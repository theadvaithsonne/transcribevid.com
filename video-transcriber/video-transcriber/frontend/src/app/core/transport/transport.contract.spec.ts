/**
 * One contract, two transports: every case runs against ServerTransport (HTTP + SSE, answered with the server's
 * canned replies through HttpTestingController / FakeEventSource) and against BrowserTransport (the real JobRunner and
 * SessionStore on an in-memory backend, with a scripted engine worker). Both must give the components the same shapes.
 */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { planFor } from '../../engine/device/plan';
import { QWEN_BROWSER_REASON } from '../../engine/jobs/options';
import { FakeEngine, makeFakeBrowserEngine, mediaFile, playSuccess, settle } from '../../testing/engine-fakes';
import { FakeEventSource, makeJob, makeSegment, makeSession, makeSummary, silentLog } from '../../testing/fakes';
import { errorDetail } from '../http-error';
import { DEFAULT_OPTIONS, Job, JobSummary } from '../models';
import { BROWSER_ENGINE, BrowserTransport } from './browser-transport';
import { EngineDevice } from './engine-device';
import { ServerTransport } from './server-transport';
import type { JobEvent, Transport, UploadState } from './transport';

interface Answer {
  body?: unknown;
  status?: number;
  headers?: Record<string, string>;
}

interface Result<T> {
  values: T[];
  error?: unknown;
  completed: boolean;
}

interface Harness {
  name: string;
  t: Transport;
  /** Subscribes and collects; the server harness answers its one HTTP request with `answer`. */
  call<T>(obs: Observable<T>, answer?: Answer): Promise<Result<T>>;
  /** A finished job of 'talk.mp3' with the line "hello world". */
  doneJob(): Promise<string>;
  /** A job that is still waiting in the queue. */
  queuedJob(): Promise<string>;
  /** Plays the server's SSE events for the watch case (browser: nothing to do). */
  sse(events: [string, unknown][]): void;
}

const ID = 'a'.repeat(32);
const SERVER_JOB: Job = makeJob({
  id: ID,
  title: 'talk',
  filename: 'talk.mp3',
  media_kind: 'audio',
  status: 'done',
  segments: [makeSegment(0, 0, 1.5, 'hello world', { original_text: 'hello world' })],
  segment_count: 1,
  stats: { word_count: 2, segment_count: 1, speech_seconds: 1.5, words_per_minute: null, avg_confidence: 0.9, low_confidence_segments: 0, keywords: [] },
});

function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ''));
    r.onerror = () => reject(r.error);
    r.readAsText(blob);
  });
}

function collect<T>(obs: Observable<T>): { result: Result<T>; done: Promise<void> } {
  const result: Result<T> = { values: [], completed: false };
  const done = new Promise<void>((resolve) => {
    obs.subscribe({
      next: (v) => result.values.push(v),
      error: (e) => {
        result.error = e;
        resolve();
      },
      complete: () => {
        result.completed = true;
        resolve();
      },
    });
  });
  return { result, done };
}

function serverHarness(): Harness {
  TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting()] });
  const t = TestBed.inject(ServerTransport);
  const ctl = TestBed.inject(HttpTestingController);
  return {
    name: 'server',
    t,
    async call<T>(obs: Observable<T>, answer: Answer = {}) {
      const { result, done } = collect(obs);
      for (const req of ctl.match(() => true)) {
        const status = answer.status ?? 200;
        req.flush((answer.body ?? null) as never, { status, statusText: status >= 400 ? 'Error' : 'OK', headers: answer.headers });
      }
      await Promise.race([done, settle(2)]);
      return result;
    },
    async doneJob() {
      return ID;
    },
    async queuedJob() {
      return ID;
    },
    sse(events) {
      const es = FakeEventSource.instances.at(-1)!;
      for (const [type, data] of events) es.emit(type, data);
    },
  };
}

async function browserHarness(): Promise<Harness> {
  const engine = await makeFakeBrowserEngine();
  const plan = planFor({ platform: 'desktop', webgpu: false, shaderF16: false, deviceMemory: 8 });
  const device: Partial<EngineDevice> = {
    plan: async () => plan,
    workerPlan: async () => ({ backend: 'wasm', shaderF16: false, recycleEvery: 0 }),
    gate: async () => () => null,
  };
  TestBed.configureTestingModule({
    providers: [
      silentLog,
      { provide: BROWSER_ENGINE, useValue: () => Promise.resolve(engine) },
      { provide: EngineDevice, useValue: device },
    ],
  });
  const t = TestBed.inject(BrowserTransport);
  const create = async (play: boolean) => {
    engine.engine.autoplay = play ? (run) => playSuccess(run) : null;
    const { result, done } = collect<UploadState>(t.createJob(mediaFile('talk.mp3'), { ...DEFAULT_OPTIONS, output_script: 'original' }));
    await done;
    await settle(20);
    return result.values.at(-1)!.job!.id;
  };
  return {
    name: 'browser',
    t,
    async call<T>(obs: Observable<T>) {
      const { result, done } = collect(obs);
      await Promise.race([done, settle(20)]);
      return result;
    },
    doneJob: () => create(true),
    async queuedJob() {
      await create(false); // occupies the engine
      return create(false); // waits behind it
    },
    sse() {},
  };
}

const HARNESSES: [string, () => Harness | Promise<Harness>][] = [
  ['ServerTransport', serverHarness],
  ['BrowserTransport', browserHarness],
];

describe.each(HARNESSES)('Transport contract: %s', (_name, make) => {
  let h: Harness;

  beforeEach(async () => {
    FakeEventSource.reset();
    vi.stubGlobal('EventSource', FakeEventSource);
    h = await make();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('health answers status ok', async () => {
    const r = await h.call(h.t.health(), { body: { status: 'ok', version: '1', device: 'cpu', compute_type: 'int8' } });
    expect(r.values[0]).toMatchObject({ status: 'ok' });
  });

  it('languages include English, sorted by name', async () => {
    const r = await h.call(h.t.languages(), { body: [{ code: 'de', name: 'German' }, { code: 'en', name: 'English' }].sort((a, b) => a.name.localeCompare(b.name)) });
    const list = r.values[0];
    expect(list).toContainEqual({ code: 'en', name: 'English' });
    expect(list.map((l) => l.name)).toEqual([...list.map((l) => l.name)].sort());
  });

  it('models are ModelInfo rows', async () => {
    const r = await h.call(h.t.models(), {
      body: [{ engine: 'whisper', id: 'small', label: 'Small', size_mb: 465, speed: 3, accuracy: 3, note: 'Good balance (default)', downloaded: false }],
    });
    const small = r.values[0].find((m) => m.id === 'small')!;
    expect(small).toMatchObject({ label: 'Small', speed: 3, accuracy: 3 });
    expect(typeof small.size_mb).toBe('number');
    expect(typeof small.downloaded).toBe('boolean');
  });

  it('session answers its id and time left; stats the counter shape', async () => {
    const s = await h.call(h.t.session(), { body: makeSession() });
    expect(typeof s.values[0].session_id).toBe('string');
    expect(typeof s.values[0].expires_in_seconds).toBe('number');
    const st = await h.call(h.t.stats(), { body: { transcribed: 0, counting: false } });
    expect(st.values[0]).toMatchObject({ transcribed: expect.any(Number), counting: expect.any(Boolean) });
  });

  it('createJob ends with progress 1 and the queued job', async () => {
    const r = await h.call(h.t.createJob(mediaFile('talk.mp3'), { ...DEFAULT_OPTIONS }), {
      body: makeSummary({ id: ID, status: 'queued', filename: 'talk.mp3', title: 'talk' }),
    });
    const last = r.values.at(-1)!;
    expect(last.progress).toBe(1);
    expect(last.job).toMatchObject({ filename: 'talk.mp3', title: 'talk' });
    expect(['queued', 'running']).toContain(last.job!.status);
  });

  it('getJob of a finished job: segments, stats, options; listJobs lists it without segments', async () => {
    const id = await h.doneJob();
    const r = await h.call(h.t.getJob(id), { body: SERVER_JOB });
    const job = r.values[0];
    expect(job).toMatchObject({ id, status: 'done', filename: 'talk.mp3', media_kind: 'audio' });
    expect(job.segments[0]).toMatchObject({ id: 0, text: 'hello world' });
    expect(job.stats?.word_count).toBe(2);
    expect(job.options.model).toBe(DEFAULT_OPTIONS.model);
    const list = await h.call(h.t.listJobs(), { body: [makeSummary({ id: ID, filename: 'talk.mp3' })] });
    const row = list.values[0].find((j) => j.id === id) as JobSummary & { segments?: unknown };
    expect(row).toBeTruthy();
    expect(row.segments).toBeUndefined();
  });

  it('an unknown job is a 404 with the server\'s wording', async () => {
    const r = await h.call(h.t.getJob('f'.repeat(32)), { body: { detail: 'Job not found' }, status: 404 });
    expect((r.error as { status: number }).status).toBe(404);
    expect(errorDetail(r.error, '')).toBe('Job not found');
  });

  it('patchJob renames (trimmed) and returns the whole job', async () => {
    const id = await h.doneJob();
    const r = await h.call(h.t.patchJob(id, { title: '  New name ' }), { body: { ...SERVER_JOB, title: 'New name' } });
    expect(r.values[0]).toMatchObject({ id, title: 'New name' });
    expect(Array.isArray(r.values[0].segments)).toBe(true);
  });

  it('exports: a file with its name (txt) and the text of a format (srt)', async () => {
    const id = await h.doneJob();
    const f = await h.call(h.t.exportBlob(id, 'txt'), {
      body: new Blob(['[00:00] hello world\n']),
      headers: { 'Content-Disposition': "attachment; filename*=UTF-8''talk.txt" },
    });
    expect(f.values[0].filename).toBe('talk.txt');
    expect(await readBlob(f.values[0].blob)).toContain('hello world');
    const s = await h.call(h.t.exportText(id, 'srt'), { body: '1\n00:00:00,000 --> 00:00:01,500\nhello world\n' });
    expect(s.values[0]).toContain('-->');
    expect(s.values[0]).toContain('hello world');
  });

  it('watch a finished job: its segments, the job, then the stream ends', async () => {
    const id = await h.doneJob();
    const { result, done } = collect<JobEvent>(h.t.watch(id, 0));
    h.sse([
      ['segments', SERVER_JOB.segments],
      ['job', makeSummary({ id: ID, status: 'done' })],
      ['end', {}],
    ]);
    await Promise.race([done, settle(20)]);
    expect(result.completed).toBe(true);
    const seg = result.values.find((e) => e.type === 'segments');
    expect((seg?.data as { text: string }[])[0].text).toBe('hello world');
    expect(result.values.filter((e) => e.type === 'job').at(-1)!.data).toMatchObject({ id, status: 'done' });
  });

  it('cancel of a queued job answers it cancelled', async () => {
    const id = await h.queuedJob();
    const r = await h.call(h.t.cancel(id), { body: makeSummary({ id: ID, status: 'cancelled' }) });
    expect(r.values[0]).toMatchObject({ id, status: 'cancelled' });
  });

  it('delete removes the job: it is a 404 afterwards', async () => {
    const id = await h.doneJob();
    const d = await h.call(h.t.delete(id), { status: 204 });
    expect(d.error).toBeUndefined();
    const g = await h.call(h.t.getJob(id), { body: { detail: 'Job not found' }, status: 404 });
    expect((g.error as { status: number }).status).toBe(404);
  });

  it('rerun of a finished job starts a new one with the changed options', async () => {
    const id = await h.doneJob();
    const r = await h.call(h.t.rerun(id, { model: 'base' }), {
      body: makeSummary({ id: 'b'.repeat(32), status: 'queued', options: { ...DEFAULT_OPTIONS, model: 'base' } }),
    });
    expect(r.values[0].id).not.toBe(id);
    expect(r.values[0].options.model).toBe('base');
  });
});

describe('BrowserTransport only', () => {
  let t: BrowserTransport;
  let engine: Awaited<ReturnType<typeof makeFakeBrowserEngine>>;

  beforeEach(async () => {
    engine = await makeFakeBrowserEngine();
    const plan = planFor({ platform: 'desktop', webgpu: false, shaderF16: false, deviceMemory: 8 });
    TestBed.configureTestingModule({
      providers: [
        silentLog,
        { provide: BROWSER_ENGINE, useValue: () => Promise.resolve(engine) },
        {
          provide: EngineDevice,
          useValue: { plan: async () => plan, workerPlan: async () => ({ backend: 'wasm', shaderF16: false, recycleEvery: 0 }), gate: async () => () => null },
        },
      ],
    });
    t = TestBed.inject(BrowserTransport);
  });

  const first = <T>(obs: Observable<T>) =>
    new Promise<T>((resolve, reject) => obs.subscribe({ next: resolve, error: reject }));

  it('health is synthesised: the browser edition, no server limits, logs page on', async () => {
    const h = await first(t.health());
    expect(h).toMatchObject({ status: 'ok', runs_in: 'browser', public: false, logs_enabled: true, logs_require_token: false });
    expect(h.max_upload_mb).toBeUndefined();
    expect(t.kind).toBe('browser');
  });

  it('models follow the device plan: offered, default, hidden with the reason, Qwen listed but disabled', async () => {
    const models = await first(t.models());
    expect(models.map((m) => m.id)).toEqual([
      'tiny', 'base', 'small', 'medium', 'large-v3-turbo', 'large-v3', 'distil-large-v3', 'qwen3-asr-0.6b', 'qwen3-asr-1.7b',
    ]);
    const byId = Object.fromEntries(models.map((m) => [m.id, m]));
    expect(byId['base']).toMatchObject({ reason: null, default: true, size_mb: 77 }); // WASM: base is the default, q8 77 MB
    expect(byId['tiny'].downloaded).toBe(true);
    expect(byId['large-v3'].reason).toBe('needs a graphics-capable browser (Chrome, Edge)');
    expect(byId['qwen3-asr-0.6b'].reason).toBe(QWEN_BROWSER_REASON);
    expect(byId['qwen3-asr-1.7b'].reason).toBe(QWEN_BROWSER_REASON);
  });

  it('createJob uploads nothing: progress is 1 at once', async () => {
    const s = await first(t.createJob(mediaFile(), { ...DEFAULT_OPTIONS }));
    expect(s).toMatchObject({ progress: 1, loaded: 3, total: 3 });
  });

  it('PDF is not rendered here (the page prints instead): a 422 with the reason', async () => {
    engine.engine.autoplay = (run) => playSuccess(run);
    const s = await first(t.createJob(mediaFile(), { ...DEFAULT_OPTIONS }));
    await settle();
    await expect(first(t.exportBlob(s.job!.id, 'pdf'))).rejects.toMatchObject({ status: 422 });
  });

  it('a running job streams its segments and progress, then ends', async () => {
    const s = await first(t.createJob(mediaFile(), { ...DEFAULT_OPTIONS, output_script: 'original' }));
    await settle();
    const events: JobEvent[] = [];
    let completed = false;
    t.watch(s.job!.id, 0).subscribe({ next: (e) => events.push(e), complete: () => (completed = true) });
    await settle();
    playSuccess(engine.engine.last);
    await settle(20);
    expect(completed).toBe(true);
    expect(events.some((e) => e.type === 'segments')).toBe(true);
    const jobs = events.filter((e) => e.type === 'job').map((e) => e.data as JobSummary);
    expect(jobs.some((j) => j.phase === 'loading_model')).toBe(true);
    expect(jobs.at(-1)).toMatchObject({ status: 'done', progress: 1 });
  });

  it('the logs page reads this tab\'s log; clear empties it', async () => {
    const batch = await first(t.logs(0));
    expect(Array.isArray(batch.entries)).toBe(true);
    await first(t.clearLogs());
    expect((await first(t.logs(0))).entries).toEqual([]);
    expect(t.logsStreamUrl(0)).toBe('');
  });

  it('cancelling a running job is cooperative: the engine is asked, the job ends cancelled', async () => {
    const s = await first(t.createJob(mediaFile(), { ...DEFAULT_OPTIONS }));
    await settle();
    const c = await first(t.cancel(s.job!.id));
    expect(c).toMatchObject({ status: 'running', cancel_requested: true });
    expect(engine.engine.cancelled).toContain(s.job!.id);
    engine.engine.last.reject(FakeEngine.cancelledError());
    await settle();
    expect((await first(t.getJob(s.job!.id))).status).toBe('cancelled');
  });
});
