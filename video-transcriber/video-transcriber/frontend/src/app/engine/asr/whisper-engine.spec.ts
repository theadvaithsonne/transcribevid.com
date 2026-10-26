import { DEFAULT_TOKEN_IDS } from './logits';
import { CancelledError, PartialInfo, ProgressInfo } from './types';
import type { AlignedWord } from './alignment';
import { ExternalAlignRequest, TensorLike, TransformersModule, WhisperEngine, textTokenProbabilities } from './whisper-engine';

// A scripted stand-in for Transformers.js: the "decoder" always makes the next token of a script the
// most likely one (logit 20, everything else 0), so the engine's own decode loop, logit rules, seek
// rule, prompt prefix, fallback ladder and cancel points run exactly as with a real model.
const ids = DEFAULT_TOKEN_IDS;
const EN = 50259;
const FR = 50265;
const V = ids.tsBegin + 1501;
const ts = (s: number) => ids.tsBegin + Math.round(s / 0.02);
const VOCAB: Record<number, string> = {
  100: ' Hello',
  101: ' world.',
  102: ' Next',
  103: ' line.',
  200: ' Kubernetes',
};
const SR = 16000;
const audio = (seconds: number) => new Float32Array(Math.round(seconds * SR));

class FakeTensor implements TensorLike {
  location?: string;
  constructor(
    public type: string,
    public data: unknown,
    public dims: number[],
  ) {}
  to(): TensorLike {
    return this;
  }
  dispose(): void {}
}

interface FakeOptions {
  /** Next token for the tokens generated so far (after the prefix). */
  script: (gen: number[]) => number;
  stepDelayMs?: number;
  progressEvents?: Array<Record<string, unknown>>;
}

interface ForwardArgs {
  decoder_input_ids: FakeTensor;
  past_key_values?: Record<string, FakeTensor>;
}

const HEAD_END = new Set([ids.transcribe, ids.translate, ids.noTimestamps]);
const FILES: Record<string, number> = {
  'config.json': 100,
  'onnx/encoder_model_quantized.onnx': 400,
  'onnx/decoder_model_merged_quantized.onnx': 500,
};

function fake(o: FakeOptions) {
  const calls: number[][] = [];
  const loadOptions: Array<Record<string, unknown>> = [];
  const special: Record<string, number> = {
    '<|startoftranscript|>': ids.sot,
    '<|notimestamps|>': ids.noTimestamps,
    '<|startofprev|>': ids.prev,
    '<|nospeech|>': ids.nospeech,
  };
  const tokenizer = {
    _tokenizer: { token_to_id: (s: string) => special[s] ?? -1 },
    decode: (t: number[]) => t.map((x) => VOCAB[x] ?? `<${x}>`).join(''),
    encode: (text: string) =>
      text
        .trim()
        .split(/\s+/)
        .map((w) => Number(Object.keys(VOCAB).find((k) => VOCAB[+k].trim() === w) ?? 999)),
  };
  const fillRow = (row: Float32Array, hist: number[]) => {
    if (hist.length === 1 && hist[0] === ids.sot) {
      row[EN] = 20;
      row[FR] = 17;
      row[ids.nospeech] = 2;
      return;
    }
    let h = -1;
    for (let i = hist.length - 1; i >= 0; i--) {
      if (HEAD_END.has(hist[i])) {
        h = i;
        break;
      }
    }
    row[o.script(hist.slice(h + 1))] = 20;
  };
  const model = {
    generation_config: {
      decoder_start_token_id: ids.sot,
      eos_token_id: ids.eot,
      no_timestamps_token_id: ids.noTimestamps,
      prev_sot_token_id: ids.prev,
      lang_to_id: { '<|en|>': EN, '<|fr|>': FR },
      is_multilingual: true,
      task_to_id: { transcribe: ids.transcribe, translate: ids.translate },
      suppress_tokens: [],
      begin_suppress_tokens: [220, ids.eot],
      max_initial_timestamp_index: 50,
      alignment_heads: [],
    },
    config: {},
    sessions: {
      decoder_model_merged: {
        outputNames: ['logits', 'present.0.decoder.key', 'present.0.encoder.key'],
        inputMetadata: [],
      },
    },
    async _prepare_encoder_decoder_kwargs_for_generation() {
      return { encoder_outputs: new FakeTensor('float32', new Float32Array(1), [1, 1500, 4]) };
    },
    async forward({ decoder_input_ids, past_key_values }: ForwardArgs) {
      const input = Array.from(decoder_input_ids.data as BigInt64Array, Number);
      calls.push(input);
      if (o.stepDelayMs) await new Promise((r) => setTimeout(r, o.stepDelayMs));
      const prev = (past_key_values?.['past_key_values.0.decoder.key']?.data as number[]) ?? [];
      const hist = [...prev];
      const logits = new Float32Array(input.length * V);
      input.forEach((tok, p) => {
        hist.push(tok);
        fillRow(logits.subarray(p * V, (p + 1) * V), hist);
      });
      const out: Record<string, FakeTensor> = {
        logits: new FakeTensor('float32', logits, [1, input.length, V]),
        'present.0.decoder.key': new FakeTensor('float32', hist, [1]),
      };
      if (!past_key_values?.['past_key_values.0.encoder.key']) {
        out['present.0.encoder.key'] = new FakeTensor('float32', [], [1]);
      }
      return out;
    },
    async dispose() {},
  };
  const T = {
    env: { backends: { onnx: { wasm: {} } } },
    Tensor: FakeTensor,
    AutoTokenizer: { from_pretrained: async () => tokenizer },
    AutoProcessor: {
      from_pretrained: async () => async () => ({
        input_features: new FakeTensor('float32', new Float32Array(1), [1, 80, 3000]),
      }),
    },
    WhisperForConditionalGeneration: {
      from_pretrained: async (_repo: string, opts: Record<string, unknown>) => {
        loadOptions.push(opts);
        const cb = opts['progress_callback'] as (p: Record<string, unknown>) => void;
        for (const p of o.progressEvents ?? []) cb(p);
        return model;
      },
    },
    ModelRegistry: {
      get_files: async () => Object.keys(FILES),
      get_file_metadata: async (_repo: string, f: string) => ({ exists: true, size: FILES[f] }),
    },
  } as unknown as TransformersModule;
  return { T, calls, loadOptions };
}

async function loaded(o: FakeOptions) {
  const f = fake(o);
  const engine = new WhisperEngine(async () => f.T);
  await engine.load({
    repo: 'onnx-community/whisper-tiny_timestamped',
    device: 'wasm',
    dtype: 'q8',
  });
  return { engine, ...f };
}

const fromList =
  (list: number[]) =>
  (gen: number[]): number =>
    list[gen.length] ?? ids.eot;
const TWO_SEGMENTS = [ts(0), 100, 101, ts(1.0), ts(1.2), 102, 103, ts(2.5)];
const forever = () => 100;

describe('WhisperEngine.load', () => {
  it('reports whole-model progress with the per-file detail, total known from the first event', async () => {
    const events: ProgressInfo[] = [];
    const f = fake({
      script: forever,
      progressEvents: [
        { status: 'initiate', file: 'onnx/encoder_model_quantized.onnx' },
        { status: 'progress', file: 'onnx/encoder_model_quantized.onnx', loaded: 200, total: 400 },
        { status: 'done', file: 'onnx/encoder_model_quantized.onnx' },
        { status: 'ready', task: 'x' },
      ],
    });
    const engine = new WhisperEngine(async () => f.T);
    const info = await engine.load(
      { repo: 'r', device: 'wasm', dtype: { encoder_model: 'q8', decoder_model_merged: 'q8' } },
      (p) => events.push(p),
    );
    expect(events.map((e) => e.status)).toEqual(['initiate', 'progress', 'done', 'ready']);
    expect(events.every((e) => e.total === 1000)).toBe(true);
    expect(events[1]).toEqual(
      expect.objectContaining({ loaded: 200, progress: 20, fileLoaded: 200, fileTotal: 400 }),
    );
    expect(events[2].loaded).toBe(400);
    expect(info.files).toEqual(Object.keys(FILES));
    expect(info.hasCrossAttentions).toBe(false);
    expect(info.multilingual).toBe(true);
    expect(engine.hasWordTimestamps).toBe(false);
    expect(f.loadOptions[0]).toEqual(
      expect.objectContaining({
        device: 'wasm',
        dtype: { encoder_model: 'q8', decoder_model_merged: 'q8' },
      }),
    );
    expect('session_options' in f.loadOptions[0]).toBe(false);
  });

  it('refuses to transcribe before load and after dispose', async () => {
    const engine = new WhisperEngine(async () => fake({ script: forever }).T);
    await expect(engine.transcribeWindow(audio(1))).rejects.toThrow(/load\(\) first/);
    const { engine: e2 } = await loaded({ script: forever });
    await e2.dispose();
    expect(e2.loaded).toBe(false);
    await expect(e2.transcribeWindow(audio(1))).rejects.toThrow(/load\(\) first/);
  });
});

describe('WhisperEngine.transcribeWindow', () => {
  it('decodes segments, detects the language, adds the offset and applies the seek rule', async () => {
    const { engine } = await loaded({ script: fromList(TWO_SEGMENTS) });
    const r = await engine.transcribeWindow(audio(3), { offsetSeconds: 10 });
    expect(r.text).toBe('Hello world. Next line.');
    expect(r.segments.map((s) => [s.start, s.end, s.text])).toEqual([
      [10, 11, 'Hello world.'],
      [expect.closeTo(11.2, 9), 12.5, 'Next line.'],
    ]);
    expect(r.tokens).toEqual(TWO_SEGMENTS);
    expect(r.singleTimestampEnding).toBe(true);
    expect(r.consumedSeconds).toBe(3);
    expect(r.language).toBe('en');
    expect(r.languageDetected).toBe(true);
    expect(r.languageProbability).toBeCloseTo(1 / (1 + Math.exp(-3)), 6);
    expect(r.languageProbabilities.map(([c]) => c)).toEqual(['en', 'fr']);
    const z = Math.exp(20) + Math.exp(17) + Math.exp(2) + (V - 3);
    expect(Math.abs(r.noSpeechProb / (Math.exp(2) / z) - 1)).toBeLessThan(1e-3);
    expect(r.temperature).toBe(0);
    expect(r.fallbacks.length).toBe(1);
    expect(r.avgLogprob).toBeLessThan(0);
    expect(r.avgLogprob).toBeGreaterThan(-0.01);
    expect(r.words).toEqual([]);
    expect(r.confidence).toBeCloseTo(Math.exp(r.avgLogprob), 9);
    expect(r.segments[0].noSpeechProb).toBe(r.noSpeechProb);
  });

  it('uses a forced language and the translate task in the prefix', async () => {
    const { engine, calls } = await loaded({ script: fromList(TWO_SEGMENTS) });
    const r = await engine.transcribeWindow(audio(3), { language: 'fr', task: 'translate' });
    expect(r.language).toBe('fr');
    expect(r.languageDetected).toBe(false);
    expect(r.languageProbability).toBeCloseTo(1 / (1 + Math.exp(3)), 6);
    expect(calls).toContainEqual([ids.sot, FR, ids.translate]);
    await expect(engine.transcribeWindow(audio(3), { language: 'xx' })).rejects.toThrow(/unknown/);
  });

  it('feeds the vocabulary prompt as <|startofprev|> prompt <|sot|> lang task', async () => {
    const { engine, calls } = await loaded({ script: fromList(TWO_SEGMENTS) });
    await engine.transcribeWindow(audio(3), { prompt: '  Kubernetes ' });
    expect(calls).toContainEqual([ids.prev, 200, ids.sot, EN, ids.transcribe]);
  });

  it('makes one window-long segment without timestamps and honours maxNewTokens', async () => {
    const { engine, calls } = await loaded({ script: fromList([100, 101]) });
    const r = await engine.transcribeWindow(audio(2.5), { timestamps: false });
    expect(calls).toContainEqual([ids.sot, EN, ids.transcribe, ids.noTimestamps]);
    expect(r.segments.map((s) => [s.start, s.end, s.text])).toEqual([[0, 2.5, 'Hello world.']]);

    const { engine: e2 } = await loaded({ script: forever });
    const r2 = await e2.transcribeWindow(audio(2), {
      timestamps: false,
      maxNewTokens: 3,
      temperatures: [0],
    });
    expect(r2.tokens).toEqual([100, 100, 100]);
  });

  it('runs the fallback ladder on a repetition loop and keeps the best attempt', async () => {
    const { engine } = await loaded({ script: forever });
    const r = await engine.transcribeWindow(audio(2), {
      timestamps: false,
      maxNewTokens: 40,
      temperatures: [0, 0.2],
      bestOf: 2,
    });
    expect(r.fallbacks.map((f) => f.temperature)).toEqual([0, 0.2]);
    expect(r.fallbacks.every((f) => f.compressionRatio > 2.4)).toBe(true);
    expect(r.temperature).toBe(0);
    expect(r.compressionRatio).toBeGreaterThan(2.4);
  });

  it('rejects windows longer than 30 s or shorter than 0.1 s', async () => {
    const { engine } = await loaded({ script: forever });
    await expect(engine.transcribeWindow(audio(30.5))).rejects.toThrow(/at most 30 s/);
    await expect(engine.transcribeWindow(audio(0.05))).rejects.toThrow(/shorter than 0.1 s/);
  });
});

describe('WhisperEngine streaming and cancel', () => {
  it('streams growing partial text and cancels cooperatively from inside onPartial', async () => {
    const { engine } = await loaded({ script: forever });
    const partials: PartialInfo[] = [];
    const run = engine.transcribeWindow(audio(2), {
      timestamps: false,
      maxNewTokens: 100,
      temperatures: [0],
      partialIntervalMs: 0,
      onPartial: (p) => {
        partials.push(p);
        if (partials.length === 3) engine.cancel();
      },
    });
    await expect(run).rejects.toBeInstanceOf(CancelledError);
    expect(partials.map((p) => p.tokens)).toEqual([1, 2, 3]);
    expect(partials[2].text).toBe(' Hello Hello Hello');
    // usable straight away
    const again = await engine.transcribeWindow(audio(2), {
      timestamps: false,
      maxNewTokens: 2,
      temperatures: [0],
    });
    expect(again.text).toBe('Hello Hello');
  });

  it('settles a cancel requested from outside within a few decoder steps (macrotask yield)', async () => {
    const { engine } = await loaded({ script: forever, stepDelayMs: 5 });
    const run = engine.transcribeWindow(audio(2), {
      timestamps: false,
      maxNewTokens: 300,
      temperatures: [0],
    });
    const settled = run.then(
      () => 'finished',
      (e) => (e instanceof CancelledError ? 'cancelled' : 'error'),
    );
    await new Promise((r) => setTimeout(r, 40));
    const t0 = performance.now();
    engine.cancel();
    expect(await settled).toBe('cancelled');
    expect(performance.now() - t0).toBeLessThan(200);
  });
});

describe('WhisperEngine.detectLanguage', () => {
  it('runs the encoder and one decoder step', async () => {
    const { engine, calls } = await loaded({ script: forever });
    const r = await engine.detectLanguage(audio(3));
    expect(r.language).toBe('en');
    expect(r.probability).toBeCloseTo(1 / (1 + Math.exp(-3)), 6);
    expect(r.probabilities.length).toBe(2);
    expect(r.noSpeechProb).toBeGreaterThan(0);
    expect(calls).toEqual([[ids.sot]]);
  });
});

describe('WhisperEngine word timing through an aligner (large-v3 / distil-large-v3)', () => {
  // The fake model has no alignment heads, like the large-v3 export: on its own it has no word timing.
  function fakeAligner(words: AlignedWord[]) {
    const requests: { audio: number; req: ExternalAlignRequest }[] = [];
    return {
      requests,
      cancels: 0,
      hasOwnWordTimestamps: true,
      cancel() {
        this.cancels++;
      },
      async alignExternal(audio: Float32Array, req: ExternalAlignRequest) {
        requests.push({ audio: audio.length, req });
        return words;
      },
    };
  }
  const w = (word: string, tok: number, start: number, end: number): AlignedWord => ({
    word,
    tokens: [tok],
    idx: [],
    start,
    end,
    // the real aligner (WhisperEngine.alignExternal) puts the transcribing model's token probabilities in here
    probability: 0.77,
  });

  it("times the model's own tokens with the aligner; the words keep the aligner's times", async () => {
    const { engine } = await loaded({ script: fromList(TWO_SEGMENTS) });
    expect(engine.hasWordTimestamps).toBe(false);
    const a = fakeAligner([w(' Hello', 100, 0.1, 0.5), w(' world.', 101, 0.5, 0.9), w(' Next', 102, 1.3, 1.7), w(' line.', 103, 1.7, 2.4)]);
    engine.attachAligner(a);
    expect(engine.hasWordTimestamps).toBe(true);
    expect(engine.hasOwnWordTimestamps).toBe(false);
    const r = await engine.transcribeWindow(audio(3), { language: 'en', wordTimestamps: true, offsetSeconds: 10 });
    expect(a.requests).toHaveLength(1);
    const { req } = a.requests[0];
    expect(a.requests[0].audio).toBe(3 * SR);
    expect(req).toMatchObject({ language: 'en', task: 'transcribe', textTokens: [100, 101, 102, 103] });
    // word probability = the transcribing model's own token probabilities (here ~1: the script's logit dominates)
    expect(req.tokenProbs).toHaveLength(4);
    for (const p of req.tokenProbs!) expect(p).toBeGreaterThan(0.5);
    const r2 = (x: number) => Math.round(x * 100) / 100;
    expect(r.words.every((x) => x.probability === 0.77)).toBe(true);
    expect(r.segments.map((s) => s.words.map((x) => [x.word, r2(x.start), r2(x.end)]))).toEqual([
      [
        [' Hello', 10.1, 10.5],
        [' world.', 10.5, 10.9],
      ],
      [
        [' Next', 11.3, 11.7],
        [' line.', 11.7, 12.4],
      ],
    ]);
  });

  it('is not asked when word timing is off, and a cancel reaches it', async () => {
    const { engine } = await loaded({ script: fromList(TWO_SEGMENTS) });
    const a = fakeAligner([]);
    engine.attachAligner(a);
    const r = await engine.transcribeWindow(audio(3), { language: 'en', wordTimestamps: false });
    expect(a.requests).toHaveLength(0);
    expect(r.words).toEqual([]);
    engine.cancel();
    expect(a.cancels).toBe(1);
    engine.attachAligner(null);
    expect(engine.hasWordTimestamps).toBe(false);
    expect(() => engine.attachAligner({ hasOwnWordTimestamps: true })).toThrow(/cannot align/);
  });

  it('textTokenProbabilities: exp(log-prob) of the text tokens only, in order', () => {
    const p = textTokenProbabilities([ids.tsBegin, 100, 101, ids.tsBegin + 50], [-0.1, Math.log(0.5), Math.log(0.25), -0.2], ids.eot);
    expect(Array.from(p)).toEqual([expect.closeTo(0.5, 6), expect.closeTo(0.25, 6)]);
  });
});
