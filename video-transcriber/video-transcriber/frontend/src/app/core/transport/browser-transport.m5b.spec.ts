/**
 * M5b additions of the in-browser edition: Qwen3-ASR offered on desktop WebGPU (and the reason elsewhere), the
 * word-timing download note of large-v3 / distil-large-v3, the WAV player of files the browser cannot play, the
 * converter consent and the device facts the worker gets. Fakes only (engine runtime, device plan).
 */
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { DeviceFacts, REASON, planFor } from '../../engine/device/plan';
import { PLAN_REASON_NEEDS_8GB, PLAN_REASON_NEEDS_SHADER_F16, QWEN_DEVICE_REASON, qwenReason } from '../../engine/qwen/qwen-capability';
import { makeFakeBrowserEngine, mediaFile, playSuccess, settle } from '../../testing/engine-fakes';
import { silentLog } from '../../testing/fakes';
import { DEFAULT_OPTIONS } from '../models';
import { BROWSER_ENGINE, BrowserTransport, MAX_PREVIEWS, OTHER_TAB_POLL_MS } from './browser-transport';
import { CONVERTER_PROMPT, ConverterConsent } from './converter-consent';
import { EngineDevice, LOW_MEMORY_GB } from './engine-device';

const first = <T>(obs: Observable<T>) => new Promise<T>((resolve, reject) => obs.subscribe({ next: resolve, error: reject }));

async function setup(facts: DeviceFacts, cached: (id: string) => boolean = () => false) {
  const fake = await makeFakeBrowserEngine();
  const previews: Blob[] = [];
  const engine = {
    ...fake,
    isCached: async (id: string) => cached(id),
    buildPreview: async (file: Blob) => {
      previews.push(file);
      return new Blob(['RIFF'], { type: 'audio/wav' });
    },
  };
  const plan = planFor(facts);
  TestBed.configureTestingModule({
    providers: [
      silentLog,
      { provide: BROWSER_ENGINE, useValue: () => Promise.resolve(engine) },
      {
        provide: EngineDevice,
        useValue: { plan: async () => plan, workerPlan: async () => ({ backend: plan.backend, shaderF16: plan.shaderF16, recycleEvery: 0 }), gate: async () => () => null },
      },
    ],
  });
  return { t: TestBed.inject(BrowserTransport), engine, previews };
}

const GPU8: DeviceFacts = { platform: 'desktop', webgpu: true, shaderF16: true, deviceMemory: 8 };

describe('BrowserTransport models (M5b)', () => {
  it('offers Qwen3-ASR on desktop WebGPU + shader-f16 with the size of the pinned files, chunk timing only', async () => {
    const { t } = await setup(GPU8);
    const byId = Object.fromEntries((await first(t.models())).map((m) => [m.id, m]));
    expect(byId['qwen3-asr-0.6b']).toMatchObject({ reason: null, size_mb: 897, engine: 'qwen', default: false });
    expect(byId['qwen3-asr-1.7b']).toMatchObject({ reason: null, size_mb: 1948 });
    expect(byId['qwen3-asr-0.6b'].word_timing_note).toMatch(/per chunk/);
  });

  it('says why Qwen cannot run elsewhere: no WebGPU, too little memory, no shader-f16, a phone', async () => {
    const reason = async (facts: DeviceFacts) => {
      const { t } = await setup(facts);
      TestBed.resetTestingModule();
      return (await first(t.models())).find((m) => m.id === 'qwen3-asr-0.6b')!.reason;
    };
    expect(await reason({ platform: 'desktop', webgpu: false, shaderF16: false, deviceMemory: 8 })).toBe(QWEN_DEVICE_REASON);
    expect(await reason({ platform: 'desktop', webgpu: true, shaderF16: true, deviceMemory: 4 })).toMatch(/WebGPU \(Chrome or Edge\) and 8 GB of memory\.$/);
    expect(await reason({ platform: 'desktop', webgpu: true, shaderF16: false, deviceMemory: 8 })).toMatch(/shader-f16/);
    expect(await reason({ platform: 'phone', webgpu: true, shaderF16: true, deviceMemory: 8 })).toBe(QWEN_DEVICE_REASON);
  });

  it('large-v3 / distil-large-v3 have word timing now: the note names the one-time timing-model download, gone once cached', async () => {
    const { t } = await setup(GPU8);
    const byId = Object.fromEntries((await first(t.models())).map((m) => [m.id, m]));
    expect(byId['large-v3'].word_timing_note).toBe('first time only, also downloads the 564 MB word-timing model');
    expect(byId['distil-large-v3'].word_timing_note).toBe('first time only, also downloads the 564 MB word-timing model');
    expect(byId['small'].word_timing_note).toBeNull();
    TestBed.resetTestingModule();
    const cached = await setup(GPU8, (id) => id === 'large-v3-turbo');
    const again = Object.fromEntries((await first(cached.t.models())).map((m) => [m.id, m]));
    expect(again['large-v3'].word_timing_note).toBeNull();
  });
});

describe('BrowserTransport player of files the browser cannot play (M5b)', () => {
  const created: Blob[] = [];
  const original = URL.createObjectURL;
  beforeEach(() => {
    created.length = 0;
    URL.createObjectURL = ((b: Blob) => {
      created.push(b);
      return `blob:test/${created.length}`;
    }) as typeof URL.createObjectURL;
  });
  afterEach(() => {
    URL.createObjectURL = original;
  });

  async function finished(t: BrowserTransport, engine: Awaited<ReturnType<typeof setup>>['engine'], file: File) {
    engine.engine.autoplay = (run) => playSuccess(run);
    const s = await first(t.createJob(file, { ...DEFAULT_OPTIONS }));
    await settle(20);
    return s.job!.id;
  }

  it('builds a WAV from the decoded audio once, as an audio-only source that getJob then carries', async () => {
    const { t, engine, previews } = await setup(GPU8);
    const id = await finished(t, engine, mediaFile('screen.mkv', 'mkvbytes', 'video/x-matroska'));
    expect((await first(t.getJob(id))).media_url).toBeNull();
    const p = await first(t.mediaPreview(id));
    expect(p).toEqual({ url: 'blob:test/1', audioOnly: true });
    expect(previews).toHaveLength(1);
    expect((created[0] as Blob).type).toBe('audio/wav');
    expect(await first(t.mediaPreview(id))).toEqual(p); // built once per visit
    expect(previews).toHaveLength(1);
    expect((await first(t.getJob(id))).media_url).toBe('blob:test/1');
  });

  it('a file the browser plays needs no preview: its own object URL', async () => {
    const { t, engine, previews } = await setup(GPU8);
    const id = await finished(t, engine, mediaFile('talk.mp3'));
    expect(await first(t.mediaPreview(id))).toEqual({ url: expect.stringMatching(/^blob:test/), audioOnly: false });
    expect(previews).toHaveLength(0);
  });

  it(`keeps only the last ${MAX_PREVIEWS} WAV players in memory; an older one is built again when it is opened`, async () => {
    const revoked: string[] = [];
    const revoke = URL.revokeObjectURL;
    URL.revokeObjectURL = (u: string) => void revoked.push(u);
    try {
      const { t, engine, previews } = await setup(GPU8);
      const ids: string[] = [];
      for (const name of ['a.mkv', 'b.mkv', 'c.mkv']) ids.push(await finished(t, engine, mediaFile(name, 'mkv', 'video/x-matroska')));
      for (const id of ids) await first(t.mediaPreview(id));
      expect(previews).toHaveLength(3);
      expect(revoked).toEqual(['blob:test/1']); // the first one's WAV is let go
      expect((await first(t.getJob(ids[0]))).media_url).toBeNull();
      expect((await first(t.getJob(ids[2]))).media_url).toBe('blob:test/3');
      expect(await first(t.mediaPreview(ids[0]))).toEqual({ url: 'blob:test/4', audioOnly: true });
      expect(previews).toHaveLength(4);
      expect(revoked).toEqual(['blob:test/1', 'blob:test/2']);
    } finally {
      URL.revokeObjectURL = revoke;
    }
  });
});

describe('BrowserTransport when the session expires', () => {
  afterEach(() => vi.useRealTimers());

  it('lets the player URLs go (the files behind them were deleted)', async () => {
    const revoked: string[] = [];
    const create = URL.createObjectURL;
    const revoke = URL.revokeObjectURL;
    URL.createObjectURL = (() => 'blob:test/player') as typeof URL.createObjectURL;
    URL.revokeObjectURL = (u: string) => void revoked.push(u);
    vi.useFakeTimers({ toFake: ['Date'] }); // the store's clock; the timers stay real
    try {
      const { t, engine } = await setup(GPU8);
      engine.engine.autoplay = (run) => playSuccess(run);
      const s = await first(t.createJob(mediaFile('screen.mkv', 'mkv', 'video/x-matroska'), { ...DEFAULT_OPTIONS }));
      await settle(20);
      await first(t.mediaPreview(s.job!.id));
      vi.setSystemTime(Date.now() + 31 * 60_000); // 31 idle minutes
      expect(await engine.store.checkExpiry()).toBe(true);
      expect(revoked).toEqual(['blob:test/player']);
    } finally {
      URL.createObjectURL = create;
      URL.revokeObjectURL = revoke;
    }
  });
});

describe('BrowserTransport watch() of a job that another tab runs', () => {
  afterEach(() => vi.useRealTimers());

  it('follows the stored job (lines, status) until it ends: the runner of this tab never hears of it', async () => {
    const { t, engine } = await setup(GPU8);
    const store = engine.store;
    // the other tab's runner wrote this job; this tab's runner is idle
    const job = await store.put(
      {
        ...(await first(t.createJob(mediaFile('x.mp3'), { ...DEFAULT_OPTIONS }))).job!,
        id: 'other'.padEnd(32, '0'),
        status: 'running',
        phase: 'transcribing',
        segments: [],
      } as never,
      new Blob(['abc']),
    );
    vi.useFakeTimers();
    const events: { type: string; data: unknown }[] = [];
    let completed = false;
    const sub = t.watch(job.id).subscribe({ next: (e) => events.push(e), complete: () => (completed = true) });
    await vi.advanceTimersByTimeAsync(10);
    expect(events.map((e) => e.type)).toEqual(['job']);
    await store.patch(job.id, { progress: 0.5, segments: [{ id: 0, start: 0, end: 1, text: 'hello', words: null, confidence: 0.9 }] });
    await vi.advanceTimersByTimeAsync(OTHER_TAB_POLL_MS + 10);
    expect(events.map((e) => e.type)).toEqual(['job', 'segments', 'job']);
    expect(events[1].data).toEqual([expect.objectContaining({ text: 'hello' })]);
    await vi.advanceTimersByTimeAsync(OTHER_TAB_POLL_MS + 10);
    expect(events).toHaveLength(3); // nothing changed: nothing sent
    await store.patch(job.id, { status: 'done', phase: null, progress: 1 });
    await vi.advanceTimersByTimeAsync(OTHER_TAB_POLL_MS + 10);
    expect(events.at(-1)).toMatchObject({ type: 'job', data: expect.objectContaining({ status: 'done' }) });
    expect(completed).toBe(true);
    sub.unsubscribe();
  });
});

describe('ConverterConsent (the ffmpeg.wasm question)', () => {
  beforeEach(() => localStorage.clear());

  it('asks once; a yes is remembered in this browser, a no only for this visit; Delete my data forgets it', () => {
    const a = new ConverterConsent();
    const asked: string[] = [];
    expect(a.answer()).toBeNull();
    expect(a.ask((q) => (asked.push(q), false))).toBe(false);
    expect(a.ask((q) => (asked.push(q), true))).toBe(false); // not asked twice in a visit
    expect(asked).toEqual([CONVERTER_PROMPT]);
    expect(new ConverterConsent().answer()).toBeNull(); // the next visit asks again
    const b = new ConverterConsent();
    expect(b.ask(() => true)).toBe(true);
    expect(new ConverterConsent().allowed()).toBe(true);
    b.forget();
    expect(new ConverterConsent().answer()).toBeNull();
    expect(CONVERTER_PROMPT).toBe('This file needs a 9 MB converter that runs in your browser. Load it?');
  });
});

describe('EngineDevice (M5b facts for the worker)', () => {
  function device(facts: Partial<DeviceFacts> & { mobile?: boolean }) {
    TestBed.configureTestingModule({});
    const d = TestBed.inject(EngineDevice);
    const info = { platform: 'desktop', webgpu: true, shaderF16: true, deviceMemory: 8, ...facts };
    d.probe = async () => info as never;
    return d;
  }
  afterEach(() => TestBed.resetTestingModule());

  it('low-memory mode at <= 4 GB reported (or a phone that does not say), the converter only after a yes', async () => {
    localStorage.clear();
    expect(LOW_MEMORY_GB).toBe(4);
    expect(await device({ deviceMemory: 4 }).workerPlan()).toMatchObject({ lowMemory: true, converter: false });
    TestBed.resetTestingModule();
    expect(await device({ deviceMemory: 8 }).workerPlan()).toMatchObject({ lowMemory: false });
    TestBed.resetTestingModule();
    expect(await device({ deviceMemory: null }).workerPlan()).toMatchObject({ lowMemory: false }); // a desktop that does not report
    TestBed.resetTestingModule();
    expect(await device({ platform: 'phone', deviceMemory: null, webgpu: false }).workerPlan()).toMatchObject({ lowMemory: true });
    TestBed.resetTestingModule();
    const d = device({});
    TestBed.inject(ConverterConsent).record(true);
    expect(await d.workerPlan()).toMatchObject({ converter: true });
    localStorage.clear();
  });

  it("gives Qwen its own reason through the gate (the job runner's 422)", async () => {
    const gate = await device({ webgpu: false, shaderF16: false }).gate();
    expect(gate('qwen3-asr-0.6b')).toBe(QWEN_DEVICE_REASON);
    expect(gate('base')).toBeNull();
  });

  it('the Qwen reasons match the device plan reasons they refine', () => {
    expect(PLAN_REASON_NEEDS_8GB).toBe(REASON.needs8GB);
    expect(PLAN_REASON_NEEDS_SHADER_F16).toBe(REASON.needsShaderF16);
    expect(qwenReason(REASON.needsWebGpu)).toBe(QWEN_DEVICE_REASON);
    expect(qwenReason(REASON.useComputer)).toBe(QWEN_DEVICE_REASON);
  });
});
