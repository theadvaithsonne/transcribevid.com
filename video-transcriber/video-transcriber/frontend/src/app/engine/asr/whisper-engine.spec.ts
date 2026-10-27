import { DEFAULT_TOKEN_IDS } from './logits';
import { CancelledError, LoadOptions, PartialInfo, ProgressInfo, TranscribeOptions } from './types';
import type { AlignedWord } from './alignment';
import { ExternalAlignRequest, TensorLike, TransformersModule, WhisperEngine, textTokenProbabilities } from './whisper-engine';

// A scripted stand-in for Transformers.js: the "decoder" always makes the next token of a script the
// most likely one (logit 20, everything else 0), so the engine's own decode loop, logit rules, seek
// rule, prompt prefix, fallback ladder and cancel points run exactly as with a real model. Like the real
// merged decoder it takes a batch (one row per hypothesis): its self-attention "cache" is each row's token
// history (`present.0.decoder.key`, dims [batch, length]) and the cross KV must have one row per batch row.
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
  /** Fills the logits row of a step instead of `script` (gen = the tokens after the prefix). */
  logits?: (gen: number[], row: Float32Array) => void;
  stepDelayMs?: number;
  progressEvents?: Array<Record<string, unknown>>;
  /** Give the decoder session a `run(feeds, fetches)` like onnxruntime's (the engine's direct step path). */
  sessionRun?: boolean;
  /** List `cross_attentions.0` among the decoder outputs (a `_timestamped` export; no alignment heads here). */
  crossAttentions?: boolean;
  /** Batched rows come out slightly different from the same row alone (like a q8 export's per-tensor quantization). */
  batchDependent?: boolean;
}

interface ForwardArgs {
  decoder_input_ids: FakeTensor;
  past_key_values?: Record<string, FakeTensor>;
}

const SELF = 'past_key_values.0.decoder.key';
const CROSS = 'past_key_values.0.encoder.key';

const HEAD_END = new Set([ids.transcribe, ids.translate, ids.noTimestamps]);
const FILES: Record<string, number> = {
  'config.json': 100,
  'onnx/encoder_model_quantized.onnx': 400,
  'onnx/decoder_model_merged_quantized.onnx': 500,
};

function fake(o: FakeOptions) {
  const calls: number[][] = [];
  /** [batch, new tokens] of every decoder call, and the outputs a direct session call fetched */
  const batches: Array<[number, number]> = [];
  const fetched: string[][] = [];
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
    if (o.logits) o.logits(hist.slice(h + 1), row);
    else row[o.script(hist.slice(h + 1))] = 20;
  };
  /** One decoder call over a batch: each row continues its own history (its row of the past self cache). */
  const decode = async (input: FakeTensor, past: Record<string, FakeTensor | undefined>) => {
    const [B, t] = input.dims;
    const flat = Array.from(input.data as BigInt64Array, Number);
    const self = past[SELF];
    const cross = past[CROSS];
    if (self && self.dims[0] !== B) throw new Error(`self cache batch ${self.dims[0]} != ${B}`);
    if (cross && cross.dims[0] !== B) throw new Error(`cross KV batch ${cross.dims[0]} != ${B}`);
    batches.push([B, t]);
    if (o.stepDelayMs) await new Promise((r) => setTimeout(r, o.stepDelayMs));
    const L = self ? self.dims[1] : 0;
    const logits = new Float32Array(B * t * V);
    const present = new Float32Array(B * (L + t));
    for (let b = 0; b < B; b++) {
      const hist = self ? Array.from((self.data as Float32Array).subarray(b * L, (b + 1) * L)) : [];
      const toks = flat.slice(b * t, (b + 1) * t);
      calls.push(toks);
      toks.forEach((tok, p) => {
        hist.push(tok);
        fillRow(logits.subarray((b * t + p) * V, (b * t + p + 1) * V), hist);
      });
      present.set(hist, b * (L + t));
      if (o.batchDependent && B > 1) for (let p = 0; p < t; p++) logits[(b * t + p) * V + 101] += 0.5;
    }
    const out: Record<string, FakeTensor> = {
      logits: new FakeTensor('float32', logits, [B, t, V]),
      'present.0.decoder.key': new FakeTensor('float32', present, [B, L + t]),
    };
    // like the merged decoder: the no-cache branch computes the cross KV, the cache branch returns an empty placeholder
    out['present.0.encoder.key'] = cross
      ? new FakeTensor('float32', new Float32Array(0), [0, 1])
      : new FakeTensor('float32', new Float32Array(B), [B, 1]);
    out['cross_attentions.0'] = new FakeTensor('float32', new Float32Array(B * t), [B, 1, t, 1]);
    return out;
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
        outputNames: [
          'logits',
          'present.0.decoder.key',
          'present.0.encoder.key',
          ...(o.crossAttentions ? ['cross_attentions.0'] : []),
        ],
        inputNames: ['input_ids', 'encoder_hidden_states', 'use_cache_branch', SELF, CROSS],
        inputMetadata: [],
        ...(o.sessionRun
          ? {
              async run(feeds: Record<string, FakeTensor>, fetches: string[]) {
                if (!(feeds['use_cache_branch'].data as boolean[])[0]) throw new Error('steps use the cache branch');
                fetched.push(fetches);
                const out = await decode(feeds['input_ids'], feeds);
                return Object.fromEntries(fetches.map((n) => [n, out[n]]));
              },
            }
          : {}),
      },
    },
    async _prepare_encoder_decoder_kwargs_for_generation() {
      return { encoder_outputs: new FakeTensor('float32', new Float32Array(1), [1, 1500, 4]) };
    },
    async forward({ decoder_input_ids, past_key_values }: ForwardArgs) {
      return decode(decoder_input_ids, past_key_values ?? {});
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
  return { T, calls, batches, fetched, loadOptions };
}

async function loaded(o: FakeOptions, dtype: LoadOptions['dtype'] = 'q8') {
  const f = fake(o);
  const engine = new WhisperEngine(async () => f.T);
  await engine.load({
    repo: 'onnx-community/whisper-tiny_timestamped',
    device: 'wasm',
    dtype,
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

describe('WhisperEngine batched decoding (beam search / best-of in one forward pass)', () => {
  // Three text tokens and <|endoftext|> compete with history-dependent logits, so beams fork, reorder and finish at
  // different lengths: a real test of the beam bookkeeping, not just of one dominant token.
  const branching = (gen: number[], row: Float32Array) => {
    let h = 7;
    for (const t of gen) h = (h * 31 + t) % 1009;
    row[100] = 10 + (h % 7) * 0.3;
    row[101] = 10 + ((h >> 1) % 5) * 0.35;
    row[102] = 10 + ((h >> 2) % 3) * 0.5;
    row[ids.eot] = gen.length >= 14 ? 30 : 8.5 + gen.length * 0.15 + (h % 4) * 0.2;
  };
  const opts: TranscribeOptions = { language: 'en', timestamps: false, temperatures: [0], beamSize: 5, debugTokens: true };
  const summary = (r: Awaited<ReturnType<WhisperEngine['transcribeWindow']>>) => ({
    tokens: r.tokens,
    logprobs: r.tokenLogprobs,
    avgLogprob: r.avgLogprob,
    text: r.text,
  });
  // fp16 / fp32 exports batch exactly; q8 is checked separately below
  async function decodeWith(
    o: Partial<FakeOptions>,
    setup: (e: WhisperEngine) => void,
    extra: Record<string, unknown> = {},
    dtype = 'fp16',
  ) {
    const f = await loaded({ script: forever, logits: branching, ...o }, dtype);
    setup(f.engine);
    const r = await f.engine.transcribeWindow(audio(2), { ...opts, ...extra });
    return { r, ...f };
  }
  const steps = (batches: Array<[number, number]>) => batches.filter(([, t]) => t === 1).map(([b]) => b);

  it('beam 5: one forward pass per step for all beams, the same tokens / log-probs / score as one beam per pass', async () => {
    const one = await decodeWith({}, (e) => (e.batching = 'never'));
    const all = await decodeWith({}, () => undefined);
    expect(all.engine.batchCheck).toEqual({ maxDiff: 0, exact: true });
    expect(summary(all.r)).toEqual(summary(one.r));
    expect(one.r.tokens.length).toBeGreaterThan(3);
    // the beams matter here: greedy picks another sequence
    const greedy = await decodeWith({}, () => undefined, { beamSize: 1 });
    expect(greedy.r.tokens).not.toEqual(all.r.tokens);
    // never: only batch-1 steps; auto: the check (5 alone) once, then batch-5 steps (the fake throws on a cross KV or
    // a self cache whose batch is not the step's)
    expect(Math.max(...steps(one.batches))).toBe(1);
    const s = steps(all.batches).slice(1); // [0] = the <|startoftranscript|> step
    expect(s.slice(0, 6)).toEqual([5, 1, 1, 1, 1, 1]);
    expect(s.slice(6).every((b) => b === 5)).toBe(true);
    expect(all.engine.stats.decoderRuns).toBeLessThan(one.engine.stats.decoderRuns / 2);
  });

  it('chunks the batch under a small cross-KV byte cap and still decodes the same', async () => {
    const one = await decodeWith({}, (e) => (e.batching = 'never'));
    // the fake's cross KV is one float32 per row: 8 bytes = 2 rows per pass
    const two = await decodeWith({}, (e) => (e.maxBatchBytes = 8));
    expect(summary(two.r)).toEqual(summary(one.r));
    const s = steps(two.batches).slice(1);
    expect(s.slice(0, 3)).toEqual([2, 1, 1]); // the check on the first chunk, then the rest of the step
    expect(Math.max(...s)).toBe(2);
  });

  it('best-of sampling: the samples share a pass and draw the same tokens from the same seed', async () => {
    const extra = { temperatures: [0.6], bestOf: 5, beamSize: 1 };
    const one = await decodeWith({}, (e) => (e.batching = 'never'), extra);
    const all = await decodeWith({}, () => undefined, extra);
    expect(summary(all.r)).toEqual(summary(one.r));
    expect(all.r.temperature).toBe(0.6);
    expect(Math.max(...steps(all.batches))).toBe(5);
  });

  it('a q8 decoder (per-tensor dynamic quantization) is never batched in auto mode, without a check pass', async () => {
    const one = await decodeWith({}, (e) => (e.batching = 'never'), {}, 'q8');
    const auto = await decodeWith({}, () => undefined, {}, 'q8');
    expect(auto.engine.batchCheck).toEqual({ maxDiff: null, exact: false });
    expect(summary(auto.r)).toEqual(summary(one.r));
    expect(Math.max(...steps(auto.batches))).toBe(1);
    // per-file dtypes: the decoder's counts
    const q8 = await loaded({ script: forever }, { encoder_model: 'fp16', decoder_model_merged: 'q8' });
    expect(q8.engine.batchCheck?.exact).toBe(false);
    const fp16 = await loaded({ script: forever }, { encoder_model: 'q8', decoder_model_merged: 'fp16' });
    expect(fp16.engine.batchCheck).toBeNull();
  });

  it('a model whose batched rows differ keeps one hypothesis per pass, with exactly the unbatched result', async () => {
    const one = await decodeWith({ batchDependent: true }, (e) => (e.batching = 'never'));
    const auto = await decodeWith({ batchDependent: true }, () => undefined);
    expect(auto.engine.batchCheck?.exact).toBe(false);
    expect(auto.engine.batchCheck?.maxDiff).toBeCloseTo(0.5, 5);
    expect(summary(auto.r)).toEqual(summary(one.r));
    expect(steps(auto.batches).slice(2).every((b) => b === 1)).toBe(true);
    // 'always' trades that exactness for speed: batched passes all the way
    const always = await decodeWith({ batchDependent: true }, (e) => (e.batching = 'always'));
    expect(always.engine.batchCheck).toBeNull();
    expect(steps(always.batches).slice(1).every((b) => b === 5)).toBe(true);
  });

  it('drives the decoder session directly, fetching only logits and the self-attention cache', async () => {
    const viaForward = await decodeWith({ crossAttentions: true }, () => undefined);
    const direct = await decodeWith({ crossAttentions: true, sessionRun: true }, () => undefined);
    expect(summary(direct.r)).toEqual(summary(viaForward.r));
    expect(direct.fetched.length).toBeGreaterThan(5);
    for (const f of direct.fetched) expect(f).toEqual(['logits', 'present.0.decoder.key']);
  });

  it('a cancel during a batched beam search settles and the engine decodes again', async () => {
    const f = await loaded({ script: forever, logits: branching, stepDelayMs: 2 }, 'fp16');
    const run = f.engine.transcribeWindow(audio(2), { ...opts, maxNewTokens: 200 });
    const settled = run.then(
      () => 'finished',
      (e) => (e instanceof CancelledError ? 'cancelled' : 'error'),
    );
    await new Promise((r) => setTimeout(r, 30));
    f.engine.cancel();
    expect(await settled).toBe('cancelled');
    const again = await f.engine.transcribeWindow(audio(2), opts);
    expect(again.tokens.length).toBeGreaterThan(3);
  });
});
