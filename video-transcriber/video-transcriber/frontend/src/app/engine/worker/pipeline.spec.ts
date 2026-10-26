import { DEFAULT_OPTIONS, JobOptions } from '../../core/models';
import type { LanguageResult, TranscribeOptions, WindowResult } from '../asr/types';
import type { DecodeMediaOptions, DecodeResult } from '../audio';
import type { SpeechSegment } from '../vad/types';
import { QWEN_DEVICE_REASON } from '../qwen/qwen-capability';
import { AsrEngine, NO_WORD_TIMING, PipelineDeps, PipelineError, SpeechTimeline, runPipeline } from './pipeline';
import type { EngineEvent, RunRequest } from './protocol';

const SR = 16000;

interface FakeSeg {
  start: number;
  end: number;
  text: string;
}

/** One scripted window: segments in window-local seconds (the fake adds offsetSeconds like the engine). */
interface Script {
  segments?: FakeSeg[];
  consumed?: number;
  noSpeech?: number;
  avgLogprob?: number;
  single?: boolean;
}

class FakeAsr implements AsrEngine {
  hasWordTimestamps = false;
  calls: { length: number; o: TranscribeOptions }[] = [];
  detections = 0;
  disposed = false;
  constructor(private readonly script: Script[]) {}
  async load() {
    return {} as never;
  }
  async detectLanguage(): Promise<LanguageResult> {
    this.detections++;
    return { language: 'en', probability: 0.93, probabilities: [['en', 0.93], ['de', 0.02]], noSpeechProb: 0.01 };
  }
  async transcribeWindow(audio: Float32Array, o: TranscribeOptions = {}): Promise<WindowResult> {
    const s = this.script[this.calls.length] ?? { segments: [] };
    this.calls.push({ length: audio.length, o });
    const off = o.offsetSeconds ?? 0;
    const len = audio.length / SR;
    return {
      language: 'en',
      languageProbability: 0.93,
      languageProbabilities: [['en', 0.93]],
      languageDetected: false,
      noSpeechProb: s.noSpeech ?? 0.01,
      text: (s.segments ?? []).map((x) => x.text).join(''),
      segments: (s.segments ?? []).map((x) => ({
        start: x.start + off,
        end: x.end + off,
        text: x.text,
        words: [],
        avgLogprob: s.avgLogprob ?? -0.2,
        noSpeechProb: s.noSpeech ?? 0.01,
        compressionRatio: 1.2,
        temperature: 0,
        confidence: 0.8,
        tokens: [],
      })),
      words: [],
      confidence: 0.8,
      consumedSeconds: s.consumed ?? len,
      singleTimestampEnding: s.single ?? false,
      avgLogprob: s.avgLogprob ?? -0.2,
      compressionRatio: 1.2,
      temperature: 0,
      fallbacks: [],
      tokens: [],
      timings: {},
    };
  }
  cancel() {}
  async dispose() {
    this.disposed = true;
  }
}

function deps(seconds: number, asr: FakeAsr, speech: SpeechSegment[] = []): PipelineDeps & { downloads: number } {
  const out = {
    downloads: 0,
    async decode(_file: Blob, o: DecodeMediaOptions): Promise<DecodeResult> {
      const samples = Math.round(seconds * SR);
      if (o.onChunk) await o.onChunk(new Float32Array(Math.min(samples, 512)), { startSample: 0 });
      return {
        pcm: new Int16Array(samples),
        scale: 1 / 32768,
        sampleRate: 16000,
        samples,
        durationSeconds: seconds,
        startOffsetSeconds: 0,
        path: 'webcodecs',
        warnings: [],
      } as unknown as DecodeResult;
    },
    async createVad() {
      return { push: async () => [], flush: async () => speech };
    },
    createEngine: () => asr,
    async ensureModel(_id: string, _d: 'webgpu' | 'wasm', _e: AsrEngine, o: { onProgress: (p: never) => void }) {
      out.downloads++;
      o.onProgress({ status: 'progress', loaded: 5, total: 10, progress: 50, file: 'encoder_model.onnx' } as never);
    },
  };
  return out;
}

function request(options: Partial<JobOptions> = {}, recycleEvery = 0): RunRequest {
  return {
    op: 'run',
    id: 'job',
    file: new Blob(['x']),
    options: { ...DEFAULT_OPTIONS, word_timestamps: false, language: 'en', ...options },
    plan: { backend: 'wasm', shaderF16: false, recycleEvery },
  };
}

async function run(req: RunRequest, d: PipelineDeps) {
  const events: EngineEvent[] = [];
  const out = await runPipeline(req, d, { signal: new AbortController().signal, emit: (e) => events.push(e) });
  return { out, events, segments: events.flatMap((e) => (e.type === 'segments' ? e.segments : [])) };
}

describe('runPipeline (the engine worker pipeline)', () => {
  it('VAD off: the seek loop walks the whole file in 30 s windows and emits server-shaped segments', async () => {
    const asr = new FakeAsr([
      { segments: [{ start: 0, end: 2, text: ' Hello there.' }] },
      { segments: [{ start: 1, end: 3, text: ' Second.' }] },
      { segments: [{ start: 0, end: 4, text: ' Third.' }] },
    ]);
    const { out, events, segments } = await run(request({ vad: false }), deps(70, asr));
    expect(asr.calls.map((c) => c.o.offsetSeconds)).toEqual([0, 30, 60]);
    expect(asr.calls.map((c) => c.length)).toEqual([30 * SR, 30 * SR, 10 * SR]);
    expect(segments.map((s) => [s.id, s.start, s.end, s.text, s.original_text])).toEqual([
      [0, 0, 2, 'Hello there.', 'Hello there.'],
      [1, 31, 33, 'Second.', 'Second.'],
      [2, 60, 64, 'Third.', 'Third.'],
    ]);
    expect(events.filter((e) => e.type === 'phase').map((e) => (e as { phase: string }).phase)).toEqual([
      'extracting',
      'loading_model',
      'transcribing',
    ]);
    expect(events.some((e) => e.type === 'progress' && e.kind === 'download')).toBe(true);
    expect(out).toMatchObject({ kind: 'done', result: { language: 'en', language_probability: 1, duration: 70, windows: 3 } });
    expect(asr.disposed).toBe(true);
  });

  it('restarts at seek + consumedSeconds, never a fixed 30 s step', async () => {
    const asr = new FakeAsr([{ segments: [{ start: 0, end: 25.4, text: ' a' }], consumed: 25.4 }, { segments: [] }]);
    await run(request({ vad: false }), deps(40, asr));
    expect(asr.calls.map((c) => c.o.offsetSeconds)).toEqual([0, 25.4]);
  });

  it('skips a silent window whole (no_speech > 0.6 and a low log-probability)', async () => {
    const asr = new FakeAsr([
      { segments: [{ start: 0, end: 2, text: ' made up' }], noSpeech: 0.9, avgLogprob: -1.5, consumed: 2 },
      { segments: [{ start: 0, end: 1, text: ' real' }] },
    ]);
    const { segments } = await run(request({ vad: false }), deps(45, asr));
    expect(asr.calls.map((c) => c.o.offsetSeconds)).toEqual([0, 30]);
    expect(segments.map((s) => s.text)).toEqual(['real']);
  });

  it('VAD on: only speech is sent, and times are restored to the original timeline', async () => {
    const asr = new FakeAsr([{ segments: [{ start: 1, end: 2, text: ' speech' }] }]);
    const { segments, events } = await run(request({ vad: true }), deps(60, asr, [{ start: 10 * SR, end: 20 * SR }]));
    expect(asr.calls).toHaveLength(1);
    expect(asr.calls[0].length).toBe(10 * SR);
    expect(segments[0]).toMatchObject({ start: 11, end: 12, text: 'speech' });
    const seg = events.find((e) => e.type === 'segments') as Extract<EngineEvent, { type: 'segments' }>;
    expect(seg.progress).toBeCloseTo(12 / 60);
  });

  it('VAD on without speech: nothing reaches the recogniser and the run does not wait for the model', async () => {
    const asr = new FakeAsr([]);
    const d = deps(30, asr, []);
    let release!: () => void;
    d.ensureModel = async () => {
      d.downloads++;
      await new Promise<void>((r) => (release = r)); // a download that is still running
    };
    const events: EngineEvent[] = [];
    let dirty = false;
    const out = await runPipeline(request({ vad: true }), d, {
      signal: new AbortController().signal,
      emit: (e) => events.push(e),
      markDirty: () => (dirty = true),
    });
    expect(asr.calls).toHaveLength(0);
    // the load started with the decoding (engine.py _BackgroundLoad) ...
    expect(d.downloads).toBe(1);
    // ... and was left to the page, which replaces the worker (restart) instead of waiting for it
    expect(dirty).toBe(true);
    expect(events.some((e) => e.type === 'phase' && e.phase === 'loading_model')).toBe(false);
    expect(out.kind).toBe('done');
    release();
  });

  it('detects the language when none was chosen and emits it once', async () => {
    const asr = new FakeAsr([{ segments: [{ start: 0, end: 1, text: ' hi' }] }]);
    const { events, out } = await run(request({ vad: false, language: null }), deps(10, asr));
    expect(asr.detections).toBe(1);
    expect(asr.calls[0].o.language).toBe('en');
    expect(events.filter((e) => e.type === 'language')).toHaveLength(1);
    expect(out).toMatchObject({ result: { language: 'en', language_probability: 0.93 } });
  });

  it('drops the 4th identical line (repetition loop breaker) and keeps ids dense', async () => {
    const same = { start: 0, end: 1, text: ' again' };
    const asr = new FakeAsr([{ segments: [same, { ...same, start: 1, end: 2 }, { ...same, start: 2, end: 3 }, { ...same, start: 3, end: 4 }, { start: 4, end: 5, text: ' new' }] }]);
    const { segments, out } = await run(request({ vad: false }), deps(8, asr));
    expect(segments.map((s) => [s.id, s.text])).toEqual([[0, 'again'], [1, 'again'], [2, 'again'], [3, 'new']]);
    expect(out).toMatchObject({ result: { dropped: { repetition: 1 } } });
  });

  it('asks to be recycled after `recycleEvery` windows, and a resumed run continues from the state', async () => {
    const asr = new FakeAsr([{ segments: [{ start: 0, end: 1, text: ' one' }] }]);
    const first = await run(request({ vad: false }, 1), deps(50, asr));
    expect(first.out.kind).toBe('recycle');
    const state = (first.out as { state: import('./protocol').ResumeState }).state;
    expect(state).toMatchObject({ seek: 3000, emitted: 1, windowsDone: 1 });
    const asr2 = new FakeAsr([{ segments: [{ start: 0, end: 1, text: ' two' }] }]);
    const second = await run({ ...request({ vad: false }, 1), resume: state }, deps(50, asr2));
    expect(second.events.some((e) => e.type === 'phase' && e.phase === 'extracting')).toBe(false);
    expect(asr2.calls[0].o.offsetSeconds).toBe(30);
    expect(second.segments.map((s) => s.id)).toEqual([1]);
    expect(second.out).toMatchObject({ kind: 'done', result: { windows: 2 } });
  });

  it('hands Qwen to its own pipeline (refused where it cannot run) and refuses audio shorter than 0.3 s', async () => {
    await expect(run(request({ engine: 'qwen', model: 'qwen3-asr-0.6b' }), deps(10, new FakeAsr([])))).rejects.toMatchObject({
      userMessage: QWEN_DEVICE_REASON,
    });
    await expect(run(request({ vad: false }), deps(0.2, new FakeAsr([])))).rejects.toBeInstanceOf(PipelineError);
  });

  it('starts loading the model before the decoding, as the server does', async () => {
    const order: string[] = [];
    const asr = new FakeAsr([{ segments: [{ start: 0, end: 1, text: ' hi' }] }]);
    const d = deps(10, asr);
    const decode = d.decode.bind(d);
    d.decode = async (f, o) => {
      order.push('decode');
      return decode(f, o);
    };
    d.ensureModel = async () => {
      order.push('load');
    };
    const { events } = await run(request({ vad: false }), d);
    expect(order).toEqual(['load', 'decode']);
    expect(events.filter((e) => e.type === 'phase').map((e) => (e as { phase: string }).phase)).toEqual([
      'extracting',
      'loading_model',
      'transcribing',
    ]);
  });

  it('a cancel while the model downloads returns at once and leaves the load to the page (restart)', async () => {
    const asr = new FakeAsr([]);
    const d = deps(10, asr);
    d.ensureModel = () => new Promise(() => undefined); // never finishes
    const ac = new AbortController();
    let dirty = false;
    const p = runPipeline(request({ vad: false }), d, {
      signal: ac.signal,
      emit: (e) => {
        if (e.type === 'phase' && e.phase === 'loading_model') setTimeout(() => ac.abort());
      },
      markDirty: () => (dirty = true),
    });
    await expect(p).rejects.toMatchObject({ name: 'CancelledError' });
    expect(dirty).toBe(true);
  });

  it('SpeechTimeline joins the speech pieces back to back', () => {
    const pcm = new Int16Array(100).map((_, i) => i);
    const t = new SpeechTimeline(pcm, 1, [
      { start: 10, end: 20 },
      { start: 50, end: 55 },
    ]);
    expect(t.samples).toBe(15);
    expect(Array.from(t.slice(8, 13))).toEqual([18, 19, 50, 51, 52]);
  });
});

// ------------------------------------------------------------------ M5b: aligner, low-memory mode

class AlignableAsr extends FakeAsr {
  aligner: AsrEngine | null = null;
  constructor(script: Script[], own = false) {
    super(script);
    this.hasWordTimestamps = own;
  }
  attachAligner(a: AsrEngine | null) {
    this.aligner = a;
    this.hasWordTimestamps = !!a;
  }
}

describe('runPipeline: word timing for large-v3 / distil-large-v3 (aligner)', () => {
  function alignDeps(seconds: number, main: AlignableAsr, failAligner = false) {
    const loads: string[] = [];
    const d = deps(seconds, main);
    let created = 0;
    d.createEngine = () => (created++ === 0 ? main : new FakeAsr([]));
    d.alignerFor = (model) => (model === 'large-v3' || model === 'distil-large-v3' ? 'large-v3-turbo' : null);
    d.ensureModel = async (id, _d, _e, o) => {
      loads.push(id);
      o.onProgress({ status: 'progress', loaded: 50, total: 100, progress: 50, file: `${id}.onnx` });
      if (id === 'large-v3-turbo' && failAligner) throw new Error('quota');
    };
    return { d, loads };
  }

  it('loads the turbo timing model after the main one, attaches it, and the download bar continues across both', async () => {
    const main = new AlignableAsr([{ segments: [{ start: 0, end: 1, text: ' hi' }] }]);
    const { d, loads } = alignDeps(10, main);
    const { events } = await run(request({ vad: false, model: 'large-v3', word_timestamps: true }), d);
    expect(loads).toEqual(['large-v3', 'large-v3-turbo']);
    expect(main.aligner).not.toBeNull();
    expect(main.calls[0].o.wordTimestamps).toBe(true);
    expect(events.some((e) => e.type === 'warning' && e.code === 'no-word-timing')).toBe(false);
    const downloads = events.filter((e) => e.type === 'progress' && e.kind === 'download') as Extract<EngineEvent, { type: 'progress' }>[];
    expect(downloads.map((e) => [e.loaded, e.total])).toEqual([
      [50, 100],
      [150, 200],
    ]);
  });

  it('is not loaded without word timing, nor for a size with its own', async () => {
    const a = alignDeps(10, new AlignableAsr([{ segments: [] }]));
    await run(request({ vad: false, model: 'large-v3', word_timestamps: false }), a.d);
    expect(a.loads).toEqual(['large-v3']);
    const b = alignDeps(10, new AlignableAsr([{ segments: [] }], true));
    await run(request({ vad: false, model: 'small', word_timestamps: true }), b.d);
    expect(b.loads).toEqual(['small']);
  });

  it('a timing model that cannot load leaves per-line times with the warning, the job still runs', async () => {
    const main = new AlignableAsr([{ segments: [{ start: 0, end: 1, text: ' hi' }] }]);
    const { d } = alignDeps(10, main, true);
    const { events, segments } = await run(request({ vad: false, model: 'large-v3', word_timestamps: true }), d);
    expect(main.aligner).toBeNull();
    expect(events.find((e) => e.type === 'warning' && e.code === 'no-word-timing')).toMatchObject({ message: NO_WORD_TIMING });
    expect(main.calls[0].o.wordTimestamps).toBe(false);
    expect(segments.map((s) => s.text)).toEqual(['hi']);
  });
});

/** A decoder that streams the whole file in 0.5 s chunks, and a VAD that confirms each segment once it was pushed. */
function streamingDeps(seconds: number, asr: FakeAsr, speech: SpeechSegment[] | null) {
  const d = deps(seconds, asr, speech ?? []);
  const collects: boolean[] = [];
  d.decode = async (_file, o) => {
    collects.push(o.collect !== false);
    const samples = Math.round(seconds * SR);
    const step = SR / 2;
    for (let at = 0; at < samples; at += step) {
      const chunk = new Float32Array(Math.min(step, samples - at)).map((_, i) => ((at + i) % 100) / 1000);
      await o.onChunk?.(chunk, { startSample: at });
      o.onProgress?.({ processedSeconds: (at + chunk.length) / SR, totalSeconds: seconds, fraction: null, elapsedSeconds: 0, xRealtime: 1, phase: 'decoding' });
    }
    return {
      pcm: o.collect === false ? new Int16Array(0) : new Int16Array(samples).map((_, i) => Math.round(((i % 100) / 1000) * 32768)),
      scale: 1 / 32768,
      sampleRate: 16000,
      samples,
      durationSeconds: seconds,
      startOffsetSeconds: 0,
      path: 'webcodecs',
      warnings: [],
    } as unknown as DecodeResult;
  };
  d.createVad = async () => {
    let seen = 0;
    const pending = [...(speech ?? [])];
    return {
      get retainFrom() {
        return pending.length ? pending[0].start : seen;
      },
      async push(chunk: Float32Array) {
        seen += chunk.length;
        const out: SpeechSegment[] = [];
        while (pending.length && pending[0].end + SR / 4 <= seen) out.push(pending.shift()!);
        return out;
      },
      async flush() {
        return pending.splice(0);
      },
    };
  };
  return { d, collects };
}

describe('runPipeline: low-memory mode (deviceMemory <= 4, ARCHITECTURE section 3)', () => {
  const script = (): Script[] => [
    { segments: [{ start: 0, end: 2, text: ' one' }], consumed: 25 },
    { segments: [{ start: 1, end: 3, text: ' two' }] },
    { segments: [{ start: 0, end: 1, text: ' three' }] },
    { segments: [{ start: 0, end: 1, text: ' four' }] },
  ];
  const speech: SpeechSegment[] = [
    { start: 1 * SR, end: 20 * SR },
    { start: 22 * SR, end: 50 * SR },
    { start: 50 * SR, end: 51 * SR }, // touches the previous one: one chunk, as speechChunks() makes it
    { start: 70 * SR, end: 95 * SR },
  ];

  it.each([true, false])('gives the same windows and segments as the whole-file path (VAD %s)', async (vad) => {
    const whole = new FakeAsr(script());
    const a = streamingDeps(100, whole, vad ? speech : null);
    const ref = await run(request({ vad }), a.d);
    const low = new FakeAsr(script());
    const b = streamingDeps(100, low, vad ? speech : null);
    const req = request({ vad });
    req.plan.lowMemory = true;
    const got = await run(req, b.d);
    expect(a.collects).toEqual([true]);
    expect(b.collects).toEqual([false]);
    expect(low.calls.map((c) => [c.length, c.o.offsetSeconds])).toEqual(whole.calls.map((c) => [c.length, c.o.offsetSeconds]));
    expect(got.segments).toEqual(ref.segments);
    expect(got.out).toMatchObject({ kind: 'done', result: { duration: 100, windows: whole.calls.length } });
  });

  it('recycles without the PCM: the fresh worker decodes again and continues at its seek', async () => {
    const first = new FakeAsr(script());
    const a = streamingDeps(100, first, speech);
    const req = request({ vad: true }, 1);
    req.plan.lowMemory = true;
    const r1 = await run(req, a.d);
    expect(r1.out.kind).toBe('recycle');
    const state = (r1.out as { state: import('./protocol').ResumeState }).state;
    expect(state).toMatchObject({ streaming: true, emitted: 1, windowsDone: 1 });
    expect(state.pcm.length).toBe(0);
    const second = new FakeAsr(script().slice(1));
    const b = streamingDeps(100, second, speech);
    const r2 = await run({ ...request({ vad: true }), resume: state }, b.d);
    expect(b.collects).toEqual([false]);
    expect(second.calls[0].o.offsetSeconds).toBe(state.seek / 100);
    expect(r2.segments[0].id).toBe(1);
    expect(r2.events.some((e) => e.type === 'phase' && e.phase === 'extracting')).toBe(false);
  });

  it('stores a checkpoint after every window (no audio in it) so a reloaded page can continue', async () => {
    const asr = new FakeAsr([
      { segments: [{ start: 0, end: 2, text: ' One.' }] },
      { segments: [{ start: 0, end: 2, text: ' Two.' }] },
      { segments: [{ start: 0, end: 2, text: ' Three.' }] },
    ]);
    const { events } = await run(request({ vad: false }), deps(70, asr));
    const checkpoints = events.filter((e) => e.type === 'checkpoint') as Extract<EngineEvent, { type: 'checkpoint' }>[];
    // after windows 1 and 2 (the loop ends after window 3: the job is done, nothing to continue)
    expect(checkpoints.map((c) => [c.state.windowsDone, c.state.emitted, c.state.seek])).toEqual([
      [1, 1, 30 * 100],
      [2, 2, 60 * 100],
    ]);
    for (const c of checkpoints) {
      expect(c.state.pcm.length).toBe(0);
      expect(c.state.chunks).toBeNull();
      expect(c.state).toMatchObject({ redecode: true, streaming: false, language: 'en' });
    }
    // each checkpoint comes after the lines it covers
    const order = events.filter((e) => e.type === 'segments' || e.type === 'checkpoint').map((e) => e.type);
    expect(order).toEqual(['segments', 'checkpoint', 'segments', 'checkpoint', 'segments']);
  });

  it('continues from a checkpoint: decodes the file again, skips to its seek, no new language detection', async () => {
    const script = [
      { segments: [{ start: 0, end: 2, text: ' One.' }] },
      { segments: [{ start: 0, end: 2, text: ' Two.' }] },
      { segments: [{ start: 0, end: 2, text: ' Three.' }] },
    ];
    const first = await run(request({ vad: false, language: null }), deps(70, new FakeAsr(script)));
    const cp = (first.events.filter((e) => e.type === 'checkpoint') as Extract<EngineEvent, { type: 'checkpoint' }>[])[0].state;
    const asr = new FakeAsr(script.slice(1));
    const d = deps(70, asr);
    const { out, events, segments } = await run({ ...request({ vad: false, language: null }), resume: cp }, d);
    expect(asr.detections).toBe(0); // the language is in the checkpoint
    expect(asr.calls.map((c) => c.o.offsetSeconds)).toEqual([30, 60]);
    expect(segments.map((s) => [s.id, s.text])).toEqual([
      [1, 'Two.'],
      [2, 'Three.'],
    ]);
    expect((events.find((e) => e.type === 'segments') as Extract<EngineEvent, { type: 'segments' }>).since).toBe(1);
    expect(events.filter((e) => e.type === 'phase').map((e) => (e as { phase: string }).phase)).toEqual([
      'extracting',
      'loading_model',
      'transcribing',
    ]);
    expect(out).toMatchObject({ kind: 'done', result: { language: 'en', windows: 3, duration: 70 } });
  });

  it.each([true, false])('a whole-file checkpoint continues in low-memory mode with the same windows and lines (VAD %s)', async (vad) => {
    const whole = new FakeAsr(script());
    const ref = await run(request({ vad }), streamingDeps(100, whole, vad ? speech : null).d);
    const cp = (ref.events.filter((e) => e.type === 'checkpoint') as Extract<EngineEvent, { type: 'checkpoint' }>[])[0].state;
    expect(cp).toMatchObject({ streaming: false, redecode: true, emitted: 1, windowsDone: 1 });
    const low = new FakeAsr(script().slice(1));
    const b = streamingDeps(100, low, vad ? speech : null);
    const got = await run({ ...request({ vad }), resume: { ...cp, streaming: true } }, b.d);
    expect(b.collects).toEqual([false]);
    expect(low.calls.map((c) => [c.length, c.o.offsetSeconds])).toEqual(whole.calls.slice(1).map((c) => [c.length, c.o.offsetSeconds]));
    expect(got.segments).toEqual(ref.segments.slice(1));
  });
});

