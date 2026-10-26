import { DEFAULT_OPTIONS, JobOptions } from '../../core/models';
import type { LanguageResult, TranscribeOptions, WindowResult } from '../asr/types';
import type { DecodeMediaOptions, DecodeResult } from '../audio';
import type { SpeechSegment } from '../vad/types';
import { AsrEngine, PipelineDeps, PipelineError, QWEN_NOT_YET, SpeechTimeline, runPipeline } from './pipeline';
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

  it('VAD on without speech: nothing reaches the recogniser and no model is loaded', async () => {
    const asr = new FakeAsr([]);
    const d = deps(30, asr, []);
    const { out, segments } = await run(request({ vad: true }), d);
    expect(asr.calls).toHaveLength(0);
    expect(d.downloads).toBe(0);
    expect(segments).toEqual([]);
    expect(out.kind).toBe('done');
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

  it('refuses Qwen (later milestone) and audio shorter than 0.3 s', async () => {
    await expect(run(request({ engine: 'qwen', model: 'qwen3-asr-0.6b' }), deps(10, new FakeAsr([])))).rejects.toMatchObject({
      userMessage: QWEN_NOT_YET,
    });
    await expect(run(request({ vad: false }), deps(0.2, new FakeAsr([])))).rejects.toBeInstanceOf(PipelineError);
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
