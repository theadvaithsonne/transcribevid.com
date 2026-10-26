import { DEFAULT_OPTIONS } from '../../core/models';
import type { EngineEvent, EngineMessage, EngineRequest, ResumeState } from './protocol';
import { EngineRunError, EngineWorkerLike, WorkerClient } from './worker-client';

/** A Worker stand-in: records what the page posted; `reply` plays the worker's side. */
class FakeWorker implements EngineWorkerLike {
  static all: FakeWorker[] = [];
  posted: { message: EngineRequest; transfer?: Transferable[] }[] = [];
  terminated = false;
  onmessage: ((event: { data: EngineMessage }) => void) | null = null;
  onerror: ((event: { message?: string }) => void) | null = null;
  constructor() {
    FakeWorker.all.push(this);
  }
  postMessage(message: EngineRequest, transfer?: Transferable[]) {
    this.posted.push({ message, transfer });
  }
  terminate() {
    this.terminated = true;
  }
  reply(data: EngineMessage) {
    this.onmessage?.({ data });
  }
}

const RESULT = { language: 'en', language_probability: 0.9, duration: 3, dropped: { empty: 0, no_speech: 0, repetition: 0 }, windows: 1 };

function input(id = 'j1') {
  return { id, file: new Blob(['x']), options: { ...DEFAULT_OPTIONS }, plan: { backend: 'webgpu' as const, shaderF16: true, recycleEvery: 40 } };
}

function resumeState(): ResumeState {
  return {
    pcm: new Int16Array(16000),
    scale: 1 / 32768,
    samples: 16000,
    duration: 1,
    chunks: null,
    seek: 3000,
    emitted: 2,
    filter: { repeats: 0, lastNorm: null, kept: 2, dropped: { empty: 0, no_speech: 0, repetition: 0 } },
    language: 'en',
    languageProbability: 0.9,
    context: '',
    lastSpeechTimestamp: 0,
    windowsDone: 40,
    wordTimestamps: true,
  };
}

describe('WorkerClient (engine worker host)', () => {
  beforeEach(() => {
    FakeWorker.all = [];
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  const make = () => new WorkerClient({ factory: () => new FakeWorker() });

  it('starts the worker lazily, sends the run, forwards events and resolves with the result', async () => {
    const client = make();
    expect(FakeWorker.all).toHaveLength(0);
    const events: EngineEvent[] = [];
    const done = client.run(input(), (e) => events.push(e));
    const w = FakeWorker.all[0];
    expect(w.posted[0].message).toMatchObject({ op: 'run', id: 'j1' });
    w.reply({ type: 'phase', id: 'j1', phase: 'extracting', progress: 0, eta: null });
    w.reply({ type: 'phase', id: 'other', phase: 'extracting', progress: 0, eta: null }); // not this run: ignored
    w.reply({ type: 'result', id: 'j1', ok: true, result: RESULT });
    await expect(done).resolves.toEqual(RESULT);
    expect(events).toHaveLength(1);
    expect(client.busy).toBe(false);
  });

  it('one run at a time', async () => {
    const client = make();
    void client.run(input('a'), () => {});
    await expect(client.run(input('b'), () => {})).rejects.toMatchObject({ code: 'busy' });
  });

  it('a failed run rejects with the worker\'s error (code, user message, technical)', async () => {
    const client = make();
    const done = client.run(input(), () => {});
    FakeWorker.all[0].reply({
      type: 'result',
      id: 'j1',
      ok: false,
      cancelled: false,
      error: { code: 'NOT_MEDIA', userMessage: 'Convert it first.', technical: 'x' },
    });
    const e = (await done.catch((err) => err)) as EngineRunError;
    expect(e).toBeInstanceOf(EngineRunError);
    expect(e).toMatchObject({ code: 'NOT_MEDIA', userMessage: 'Convert it first.', cancelled: false });
  });

  it('cancel is cooperative first: the worker answers, the same worker stays', async () => {
    const client = make();
    const done = client.run(input(), () => {});
    client.cancel('j1');
    const w = FakeWorker.all[0];
    expect(w.posted[1].message).toEqual({ op: 'cancel', id: 'j1' });
    w.reply({ type: 'result', id: 'j1', ok: false, cancelled: true, error: { code: 'cancelled', userMessage: 'Cancelled.', technical: '' } });
    await expect(done).rejects.toMatchObject({ cancelled: true });
    vi.advanceTimersByTime(5000);
    expect(w.terminated).toBe(false);
  });

  it('hard cancel: no answer within 2 s terminates the worker; the next run gets a fresh one', async () => {
    const client = make();
    const done = client.run(input(), () => {});
    client.cancel('j1');
    vi.advanceTimersByTime(1999);
    expect(FakeWorker.all[0].terminated).toBe(false);
    vi.advanceTimersByTime(1);
    expect(FakeWorker.all[0].terminated).toBe(true);
    await expect(done).rejects.toMatchObject({ cancelled: true, code: 'cancelled' });
    void client.run(input('j2'), () => {});
    expect(FakeWorker.all).toHaveLength(2);
    expect(FakeWorker.all[1].posted[0].message).toMatchObject({ op: 'run', id: 'j2' });
  });

  it('recycle: the worker is replaced and the same run continues there from its state (PCM transferred)', async () => {
    const client = make();
    const events: EngineEvent[] = [];
    const done = client.run(input(), (e) => events.push(e));
    const state = resumeState();
    FakeWorker.all[0].reply({ type: 'recycle', id: 'j1', state });
    expect(FakeWorker.all[0].terminated).toBe(true);
    const next = FakeWorker.all[1];
    expect(next.posted[0].message).toMatchObject({ op: 'run', id: 'j1', resume: { seek: 3000, emitted: 2 } });
    expect(next.posted[0].transfer).toEqual([state.pcm.buffer]);
    next.reply({ type: 'segments', id: 'j1', segments: [], since: 2, progress: 0.5, language: 'en', duration: 1 });
    next.reply({ type: 'result', id: 'j1', ok: true, result: RESULT });
    await expect(done).resolves.toEqual(RESULT);
    expect(events).toHaveLength(1);
    expect(client.started).toBe(2);
  });

  it('a crashed worker ends the run with a clear message', async () => {
    const client = make();
    const done = client.run(input(), () => {});
    FakeWorker.all[0].onerror?.({ message: 'out of memory' });
    await expect(done).rejects.toMatchObject({ code: 'worker-crashed', cancelled: false, technical: 'out of memory' });
    expect(FakeWorker.all[0].terminated).toBe(true);
  });
});
