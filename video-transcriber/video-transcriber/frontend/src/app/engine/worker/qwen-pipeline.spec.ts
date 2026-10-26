import { DEFAULT_OPTIONS, JobOptions } from '../../core/models';
import type { DecodeMediaOptions, DecodeResult } from '../audio';
import { QWEN_DEVICE_REASON } from '../qwen/qwen-capability';
import type { QwenSegment } from '../qwen/qwen-chunks';
import type { QwenDecodeOptions, QwenDecodeResult } from '../qwen/qwen-engine';
import { QWEN_VAD, type SpeechSegment, type VadParams } from '../vad/types';
import type { PipelineDeps, QwenAsr } from './pipeline';
import { runPipeline } from './pipeline';
import type { EngineEvent, ResumeState, RunRequest } from './protocol';
import { QWEN_LANGUAGE_UNSUPPORTED, QWEN_NO_TRANSLATE } from './qwen-pipeline';

// The Qwen3-ASR job pipeline against fakes: a decoder, a VAD that returns fixed speech, a QwenEngine that answers
// from a script. The chunk loop itself is covered by engine/qwen/qwen-chunks.spec.ts.

const SR = 16000;

class FakeQwen implements QwenAsr {
  calls: { start: number; length: number; o: QwenDecodeOptions }[] = [];
  disposed = false;
  cancelled = false;
  private n = 0;
  constructor(private readonly answers: { text: string; language: string }[]) {}
  async transcribeChunk(audio: Float32Array, o: QwenDecodeOptions = {}): Promise<QwenDecodeResult> {
    this.calls.push({ start: audio[0], length: audio.length, o });
    o.onPartial?.('partial text');
    const a = this.answers[Math.min(this.n++, this.answers.length - 1)];
    return { raw: a.text, text: a.text, language: a.language, tokens: 3, hitMaxTokens: false, timings: {} };
  }
  cancel() {
    this.cancelled = true;
  }
  async dispose() {
    this.disposed = true;
  }
}

function deps(seconds: number, qwen: FakeQwen, speech: SpeechSegment[]) {
  const out = {
    vadParams: [] as (VadParams | undefined)[],
    loads: 0,
    async decode(_file: Blob, o: DecodeMediaOptions): Promise<DecodeResult> {
      const samples = Math.round(seconds * SR);
      if (o.onChunk) await o.onChunk(new Float32Array(512), { startSample: 0 });
      // every sample holds its own second, so a chunk's first value tells where it starts
      const pcm = new Int16Array(samples).map((_, i) => Math.floor(i / SR));
      return { pcm, scale: 1, sampleRate: 16000, samples, durationSeconds: seconds, startOffsetSeconds: 0, path: 'webcodecs', warnings: [] } as unknown as DecodeResult;
    },
    async createVad(_signal: AbortSignal, params?: VadParams) {
      out.vadParams.push(params);
      return { push: async () => [], flush: async () => speech };
    },
    createEngine: () => {
      throw new Error('no Whisper engine in a Qwen run');
    },
    async ensureModel() {
      throw new Error('no Whisper model in a Qwen run');
    },
    createQwenEngine: () => qwen,
    async ensureQwen(_id: string, _e: QwenAsr, o: { onProgress: (p: never) => void }) {
      out.loads++;
      o.onProgress({ status: 'progress', loaded: 1, total: 2, progress: 50, file: 'encoder.fp16.onnx' } as never);
    },
  };
  return out as typeof out & PipelineDeps;
}

function request(options: Partial<JobOptions> = {}, recycleEvery = 0): RunRequest {
  return {
    op: 'run',
    id: 'job',
    file: new Blob(['x']),
    options: { ...DEFAULT_OPTIONS, engine: 'qwen', model: 'qwen3-asr-0.6b', language: null, ...options },
    plan: { backend: 'webgpu', shaderF16: true, recycleEvery },
  };
}

async function run(req: RunRequest, d: PipelineDeps) {
  const events: EngineEvent[] = [];
  const out = await runPipeline(req, d, { signal: new AbortController().signal, emit: (e) => events.push(e) });
  const segEvents = events.filter((e) => e.type === 'segments') as Extract<EngineEvent, { type: 'segments' }>[];
  return { out, events, segEvents, segments: segEvents.flatMap((e) => e.segments) };
}

describe('runPipeline with Qwen3-ASR', () => {
  it('plans 25 s chunks from QWEN_VAD speech, loads the model after the plan and emits one server-shaped segment per chunk', async () => {
    const qwen = new FakeQwen([
      { text: 'first part', language: 'English' },
      { text: 'दूसरा हिस्सा', language: 'Hindi' },
    ]);
    const d = deps(60, qwen, [
      { start: 2 * SR, end: 20 * SR },
      { start: 30 * SR, end: 40 * SR },
    ]);
    const { out, events, segEvents, segments } = await run(request({ prompt: 'Kubernetes' }), d);
    expect(d.vadParams).toEqual([QWEN_VAD]);
    expect(events.filter((e) => e.type === 'phase').map((e) => (e as { phase: string }).phase)).toEqual(['extracting', 'loading_model', 'transcribing']);
    expect(qwen.calls.map((c) => [c.start, c.length / SR])).toEqual([
      [2, 18],
      [30, 10],
    ]);
    expect(qwen.calls[0].o).toMatchObject({ language: null, context: 'Kubernetes' });
    expect(segments.map((s) => [s.id, s.start, s.end, s.text, s.words, s.confidence, s.timing])).toEqual([
      [0, 2, 20, 'first part', null, null, 'chunk'],
      [1, 30, 40, 'दूसरा हिस्सा', null, null, 'chunk'],
    ]);
    expect(segments[0]).toMatchObject({ original_text: 'first part', recognition_text: 'first part', boundary_resolution: 'pause', review_reasons: [], edited: false });
    // the job language is the first one detected; each chunk is converted by its own (qwen_engine `detected or language`)
    expect(segEvents.map((e) => [e.since, e.language, e.romanizeLanguage, Math.round(e.progress * 100)])).toEqual([
      [0, 'en', 'en', 33],
      [1, 'en', 'hi', 67],
    ]);
    expect(events.some((e) => e.type === 'partial')).toBe(true);
    expect(events.some((e) => e.type === 'progress' && e.kind === 'download')).toBe(true);
    expect(out).toMatchObject({ kind: 'done', result: { language: 'en', language_probability: null, duration: 60, windows: 2 } });
    expect(qwen.disposed).toBe(true);
  });

  it('forces the chosen language by its Qwen name (tl -> Filipino) and keeps it as the job language', async () => {
    const qwen = new FakeQwen([{ text: 'magandang umaga', language: 'Filipino' }]);
    const { out } = await run(request({ language: 'tl' }), deps(10, qwen, [{ start: 0, end: 5 * SR }]));
    expect(qwen.calls[0].o.language).toBe('Filipino');
    expect(out).toMatchObject({ result: { language: 'tl' } });
  });

  it('VAD off: the whole file in 25 s chunks with overlap at the forced cuts', async () => {
    const qwen = new FakeQwen([
      { text: 'one two three four', language: 'English' },
      { text: 'three four five six', language: 'English' }, // no exact overlap: the non-overlapping audio is retried
      { text: 'six seven eight nine', language: 'English' }, // the retry; the next chunk then overlaps it fully
    ]);
    const { segments } = await run(request({ vad: false }), deps(60, qwen, []));
    expect(qwen.calls.map((c) => [c.start, c.length / SR])).toEqual([
      [0, 25],
      [23, 27],
      [25, 25],
      [48, 12],
    ]);
    expect(segments.map((s) => (s as QwenSegment).boundary_resolution)).toEqual(['pause', 'audio_retry']);
  });

  it('silence: no segments and the model is never loaded (qwen_engine `if not spans`)', async () => {
    const qwen = new FakeQwen([]);
    const d = deps(30, qwen, []);
    const { out, events } = await run(request({ language: 'de' }), d);
    expect(d.loads).toBe(0);
    expect(events.some((e) => e.type === 'phase' && e.phase === 'loading_model')).toBe(false);
    expect(out).toMatchObject({ kind: 'done', result: { language: 'de', language_probability: null, duration: 30 } });
  });

  it("refuses translation, a language Qwen does not know and a device without WebGPU + shader-f16 with the server's words", async () => {
    const d = deps(10, new FakeQwen([]), []);
    await expect(run(request({ task: 'translate' }), d)).rejects.toMatchObject({ userMessage: QWEN_NO_TRANSLATE });
    await expect(run(request({ language: 'af' }), d)).rejects.toMatchObject({ userMessage: QWEN_LANGUAGE_UNSUPPORTED });
    const wasm = request();
    wasm.plan = { backend: 'wasm', shaderF16: false, recycleEvery: 0 };
    await expect(run(wasm, d)).rejects.toMatchObject({ userMessage: QWEN_DEVICE_REASON });
  });

  it('recycles every `recycleEvery` chunks and continues the loop in a fresh worker without decoding again', async () => {
    const speech = [0, 1, 2].map((k) => ({ start: k * 30 * SR, end: (k * 30 + 10) * SR }));
    const q1 = new FakeQwen([{ text: 'alpha', language: 'English' }]);
    const first = await run(request({}, 2), deps(90, q1, speech));
    expect(first.out.kind).toBe('recycle');
    const state = (first.out as { state: ResumeState }).state;
    expect(state.qwen!.loop).toMatchObject({ next: 2, emitted: 2, chunksDone: 2, language: 'en' });
    const q2 = new FakeQwen([{ text: 'gamma', language: 'English' }]);
    const d2 = deps(90, q2, speech);
    let decoded = 0;
    d2.decode = async () => {
      decoded++;
      throw new Error('must not decode again');
    };
    const second = await run({ ...request({}, 2), resume: state }, d2);
    expect(decoded).toBe(0);
    expect(q2.calls.map((c) => c.start)).toEqual([60]);
    expect(second.segments.map((s) => [s.id, s.text])).toEqual([[2, 'gamma']]);
    expect(second.out).toMatchObject({ kind: 'done', result: { windows: 3 } });
  });
});
