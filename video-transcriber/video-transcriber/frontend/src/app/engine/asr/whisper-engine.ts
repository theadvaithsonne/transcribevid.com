/**
 * WhisperEngine: Whisper on @huggingface/transformers 4.3.1 (WASM or WebGPU) with its own decode loop.
 *
 * Why not `model.generate()`: in 4.3.1 it drops token scores (no word probability / avg_logprob),
 * ignores `num_beams`, has no language detection, no no_speech_prob, no compression ratio, no
 * temperature fallback, ignores `prompt_ids`, cannot be cancelled, and its timestamp processor lacks two
 * of the OpenAI rules (docs/in-browser/spike/asr.md). So this class drives the encoder and the merged
 * decoder ONNX sessions through `model.forward()` and re-implements the faster-whisper behaviour the app
 * relies on (backend/app/engine.py): language detection, no_speech_prob, beam search, temperature
 * fallback, hallucination metrics, prompt, translate, word timestamps (cross-attention DTW) and
 * per-word probability. Ported from the spike's reference engine; no Angular, no DOM.
 *
 * The library is imported lazily inside load() (or injected through the constructor) so that this module
 * can be imported by unit specs without pulling onnxruntime in.
 *
 * Sizes without a `_timestamped` export (large-v3, distil-large-v3) get word timing from an aligner: a second
 * WhisperEngine with the same tokenizer and alignment heads (large-v3-turbo `_timestamped`, engine/models catalog
 * `aligner`), attached with `attachAligner()`. After a window is decoded, the aligner runs its own encoder and the
 * teacher-forced pass over the transcribing model's tokens (`alignExternal`), which gives the word start / end; the
 * word probability comes from the transcribing model's own token log-probabilities of that decode.
 */
import {
  AlignedWord,
  alignmentCost,
  cleanWordDurations,
  CrossAttentionLayer,
  encoderFramesFor,
  jumpTimes,
  mergePunctuation,
  SAMPLE_RATE,
  tokenProbabilities,
  wordsFromJumps,
} from './alignment';
import {
  argmax,
  compressionRatio,
  logSoftmaxInPlace,
  makeRng,
  sampleWithTemperature,
  topK,
} from './dsp';
import { averageLogprob, chooseFallback, needsFallback, resolveOptions } from './fallback';
import { gatherRows, GpuDeviceLike, isWholeTensor, rowBytes, TensorFactory } from './kv-rows';
import { applyLogitRules, DEFAULT_TOKEN_IDS, languageProbabilities, TokenIds } from './logits';
import { ProgressTracker } from './progress';
import { confidenceOf, parseSegments, reconcileSegmentEdges } from './segments';
import {
  CancelledError,
  Device,
  LanguageResult,
  LoadInfo,
  LoadOptions,
  ProgressInfo,
  Segment,
  TranscribeOptions,
  WindowResult,
  Word,
} from './types';

const MAX_WINDOW_SAMPLES = 30 * SAMPLE_RATE;
const MIN_WINDOW_SAMPLES = SAMPLE_RATE * 0.1;

/**
 * Batched decoding tiles the window's cross-attention KV (fp32, layers x 2 x heads x 1500 x 64 per row) to the batch
 * size, so the batch is capped by how many bytes those copies may take. GPU: small's 110.6 MB per row fits all 5 beams
 * (553 MB), large-v3-turbo / distil 5, medium 2, large-v3 (491 MB per row) 1 = the hypotheses one after another as
 * before. WASM: every step also copies its inputs into the WASM heap, which never shrinks, so less is allowed there
 * (small: 3 rows). Measured in engine/asr/README.md ("Batched decoding").
 */
export const GPU_BATCH_BYTES = 640 * 2 ** 20;
export const WASM_BATCH_BYTES = 352 * 2 ** 20;

/**
 * Largest logit difference between a batched row and the same row decoded alone that still counts as "batching changes
 * nothing" (batchCheck). fp16 rounding stays far below it (measured: 0 on WebGPU fp16); a q8 export's per-tensor
 * activation quantization moves logits by 0.27-0.97 when other rows share the batch.
 */
export const BATCH_EXACT_TOLERANCE = 0.05;

/** 'auto' = batch when the self-check shows identical results; 'always' = batch anyway; 'never' = one row per pass. */
export type BatchingMode = 'auto' | 'always' | 'never';

/**
 * Transformers.js dtypes whose decoder quantizes its activations per tensor at run time (DynamicQuantizeLinear: one
 * scale for all batch rows), so a batched row is not the row decoded alone. 'auto' never batches them and skips the
 * self-check, whose one batched pass would also grow the WASM heap for good (measured +500 MB with small q8).
 */
const DYNAMIC_QUANT_DTYPES = new Set(['q8', 'int8', 'uint8', 'quantized']);

function decoderDtype(dtype: LoadOptions['dtype']): string | undefined {
  return typeof dtype === 'string' ? dtype : dtype?.decoder_model_merged;
}

/* The library objects are untyped on purpose: Transformers.js 4.3.1 ships partial typings for the
   pieces used here (sessions, forward with past_key_values, cross attentions). */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TensorLike {
  dims: number[];
  type: string;
  data: any;
  location?: string;
  /** the onnxruntime-web tensor behind a Transformers.js Tensor (WebGPU buffer access for the KV row copies) */
  ort_tensor?: any;
  to(type: string): TensorLike;
  dispose(): void;
}
type KV = Record<string, TensorLike>;

/** The slice of the `@huggingface/transformers` module the engine uses. */
export interface TransformersModule {
  env: any;
  Tensor: new (type: string, data: any, dims: number[]) => TensorLike;
  AutoTokenizer: { from_pretrained(repo: string, options: any): Promise<any> };
  AutoProcessor: { from_pretrained(repo: string, options: any): Promise<any> };
  WhisperForConditionalGeneration: { from_pretrained(repo: string, options: any): Promise<any> };
  ModelRegistry?: {
    get_files(repo: string, options: any): Promise<string[]>;
    get_file_metadata(repo: string, file: string): Promise<{ exists: boolean; size?: number }>;
  };
}

export async function loadTransformers(): Promise<TransformersModule> {
  return (await import('@huggingface/transformers')) as unknown as TransformersModule;
}

/**
 * Where a hypothesis's self-attention cache lives: row `row` of the batched `past_key_values.*.decoder.*` tensors in
 * `kv` (the output of the step that made it, or the prefix pass's batch-1 cache).
 */
interface CacheRow {
  kv: KV;
  row: number;
}

interface Hyp {
  tokens: number[];
  logprobs: number[];
  sum: number;
  cache: CacheRow;
  last: number;
  finished: boolean;
}

interface Finished {
  tokens: number[];
  logprobs: number[];
  sum: number;
}

interface Attempt {
  tokens: number[];
  logprobs: number[];
  avgLogprob: number;
  ms: number;
  temperature: number;
  compressionRatio: number;
  text: string;
}

interface DecodeParams {
  beam: number;
  bestOf: number;
  temperature: number;
  maxNew: number;
  timestamps: boolean;
  repetitionPenalty: number;
  noRepeatNgram: number;
  rng: () => number;
  onTokens?: (tokens: number[]) => void;
}

interface Encoded {
  encoderOut: TensorLike;
  audioSeconds: number;
}

interface FirstStep {
  row: Float32Array;
  crossKV: KV;
  noSpeechProb: number;
  languages: Array<[string, number]>;
}

/** Yields one macrotask so a queued `cancel` message can be delivered. */
function yieldMacrotask(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (typeof MessageChannel === 'undefined') {
      setTimeout(resolve, 0);
      return;
    }
    const ch = new MessageChannel();
    ch.port1.onmessage = () => {
      ch.port1.close();
      resolve();
    };
    ch.port2.postMessage(0);
  });
}

export class WhisperEngine {
  device: Device = 'wasm';
  repo = '';
  readonly stats = { decoderRuns: 0, decoderMs: 0 };
  private T: TransformersModule | null = null;
  private model: any = null;
  private tokenizer: any = null;
  private processor: any = null;
  private generationConfig: any = null;
  private cancelFlag = false;
  private busy = false;
  private ids: TokenIds = { ...DEFAULT_TOKEN_IDS };
  private langToId: Record<string, number> = {};
  private multilingual = true;
  private suppress: number[] = [];
  private beginSuppress: number[] = [];
  private maxInitialTs = 50;
  private alignmentHeads: Array<[number, number]> = [];
  private medianWidth = 7;
  private hasCrossAttn = false;
  private decoderCacheSpec: Array<{ name: string; type: string; shape: unknown[] }> = [];
  /** One-time self-test: can the merged decoder's cache branch take several new tokens at once? */
  private multiTokenCacheOk: boolean | null = null;
  private info: LoadInfo | null = null;
  /** word timing for a model without cross-attention outputs (see the header) */
  private aligner: ExternalAligner | null = null;
  /**
   * Cap of the tiled cross-attention KV of one batched decoder step, in bytes; it sets how many hypotheses share a
   * forward pass (at least 1). null = the device default (GPU_BATCH_BYTES / WASM_BATCH_BYTES).
   */
  maxBatchBytes: number | null = null;
  /**
   * Batched decoding (beam search / best-of: all hypotheses in one forward pass). 'auto' checks once per load that a
   * batched row equals the row decoded alone and otherwise decodes one hypothesis per pass, as before; 'always' skips
   * that check (faster on WASM q8, whose results then depend on the batch: README "Batched decoding"); 'never' = off.
   */
  batching: BatchingMode = 'auto';
  /**
   * Whether batching leaves the loaded model's results unchanged (null = not checked yet): the self-check's largest
   * logit difference and verdict, or `maxDiff: null, exact: false` for a dynamically quantized decoder (q8).
   */
  batchCheck: { maxDiff: number | null; exact: boolean } | null = null;
  /**
   * Outputs a decoding step fetches: logits and the self-attention cache. Fetching every output (model.forward) also
   * copies each layer's cross_attentions (WebGPU: a GPU readback each) and the empty encoder placeholders, which the
   * steps never use (word timing runs its own pass). null = the session cannot be driven directly: model.forward.
   */
  private stepFetches: string[] | null = null;
  private cacheBranchTrue: TensorLike | null = null;
  private gpu: GpuDeviceLike | null = null;
  /** the window's cross-attention KV tiled to a batch size (released with it, see releaseCrossKV) */
  private crossTiles = new Map<number, KV>();
  /** the running window's cross KV until it is released (a cancelled or failed window releases it too) */
  private windowCross: KV | null = null;

  constructor(
    private readonly transformers: () => Promise<TransformersModule> = loadTransformers,
  ) {}

  get loaded(): boolean {
    return this.model !== null;
  }

  get loadInfo(): LoadInfo | null {
    return this.info;
  }

  /** Word timing on this engine: its own alignment heads, or an attached aligner's. */
  get hasWordTimestamps(): boolean {
    return this.hasOwnWordTimestamps || !!this.aligner?.hasOwnWordTimestamps;
  }

  /** The loaded repo returns cross-attentions and has alignment heads (a `_timestamped` export). */
  get hasOwnWordTimestamps(): boolean {
    return this.hasCrossAttn && this.alignmentHeads.length > 0;
  }

  /**
   * Word timing from another loaded WhisperEngine with the same tokenizer (null detaches it). The caller owns it and
   * disposes it; cancel() reaches it too.
   */
  attachAligner(aligner: unknown): void {
    const a = aligner as ExternalAligner | null;
    if (a && typeof a.alignExternal !== 'function') throw new Error('WhisperEngine: the aligner cannot align');
    this.aligner = a;
  }

  // ---------------------------------------------------------------- load / dispose / cancel

  /**
   * Downloads (or reads from the Cache API) and creates the sessions. The ORT runtime must have been
   * configured before (engine/models/ort-config.ts); `onProgress` gets whole-model byte progress with
   * the per-file detail.
   */
  async load(o: LoadOptions, onProgress?: (p: ProgressInfo) => void): Promise<LoadInfo> {
    const t0 = performance.now();
    const T = (this.T = await this.transformers());
    this.repo = o.repo;
    this.device = o.device;
    const tracker = new ProgressTracker((p) => onProgress?.(p));
    // which files will be fetched and how big are they, so the first event already carries the total
    if (T.ModelRegistry) {
      try {
        const files = await T.ModelRegistry.get_files(o.repo, {
          dtype: o.dtype ?? null,
          device: o.device,
        });
        const metas = await Promise.all(
          files.map((f) =>
            T.ModelRegistry!.get_file_metadata(o.repo, f).catch(
              (): { exists: boolean; size?: number } => ({ exists: false }),
            ),
          ),
        );
        files.forEach((f, i) => {
          if (metas[i].exists) tracker.expect(f, metas[i].size ?? 0);
        });
      } catch {
        // totals are best effort
      }
    }
    const opts: Record<string, unknown> = {
      device: o.device,
      dtype: o.dtype,
      session_options: o.sessionOptions,
      progress_callback: tracker.callback,
    };
    for (const k of Object.keys(opts)) if (opts[k] === undefined) delete opts[k];
    const [tokenizer, processor] = await Promise.all([
      T.AutoTokenizer.from_pretrained(o.repo, opts),
      T.AutoProcessor.from_pretrained(o.repo, opts),
    ]);
    const tFiles = performance.now();
    const model = await T.WhisperForConditionalGeneration.from_pretrained(o.repo, opts);
    this.tokenizer = tokenizer;
    this.processor = processor;
    this.model = model;
    this.readConfig(model, tokenizer);
    const dt = decoderDtype(o.dtype);
    if (dt && DYNAMIC_QUANT_DTYPES.has(dt)) this.batchCheck = { maxDiff: null, exact: false };
    const info: LoadInfo = {
      repo: o.repo,
      device: o.device,
      ms: {
        total: performance.now() - t0,
        filesAndTokenizer: tFiles - t0,
        sessions: performance.now() - tFiles,
      },
      hasCrossAttentions: this.hasCrossAttn,
      alignmentHeads: this.alignmentHeads.length,
      multilingual: this.multilingual,
      files: tracker.files,
    };
    this.info = info;
    tracker.report('ready');
    return info;
  }

  private readConfig(model: any, tokenizer: any): void {
    const g = (this.generationConfig = model.generation_config ?? {});
    const tk = (s: string): number | undefined => {
      const v = tokenizer._tokenizer?.token_to_id?.(s);
      return typeof v === 'number' && v >= 0 ? v : undefined;
    };
    const d = DEFAULT_TOKEN_IDS;
    const sot = g.decoder_start_token_id ?? tk('<|startoftranscript|>') ?? d.sot;
    const eot = Array.isArray(g.eos_token_id) ? g.eos_token_id[0] : (g.eos_token_id ?? d.eot);
    const noTimestamps = g.no_timestamps_token_id ?? tk('<|notimestamps|>') ?? d.noTimestamps;
    this.ids = {
      sot,
      eot,
      noTimestamps,
      tsBegin: noTimestamps + 1,
      prev: g.prev_sot_token_id ?? tk('<|startofprev|>') ?? d.prev,
      nospeech: tk('<|nospeech|>') ?? tk('<|nocaptions|>') ?? d.nospeech,
      translate: g.task_to_id?.translate ?? d.translate,
      transcribe: g.task_to_id?.transcribe ?? d.transcribe,
    };
    this.langToId = g.lang_to_id ?? {};
    this.multilingual = g.is_multilingual ?? Object.keys(this.langToId).length > 0;
    this.suppress = g.suppress_tokens ?? [];
    this.beginSuppress = g.begin_suppress_tokens ?? [eot];
    this.maxInitialTs = g.max_initial_timestamp_index ?? 50;
    this.alignmentHeads = g.alignment_heads ?? [];
    this.medianWidth = model.config?.median_filter_width ?? 7;
    const dec = model.sessions.decoder_model_merged;
    this.hasCrossAttn = dec.outputNames.some((n: string) => n.startsWith('cross_attentions'));
    this.decoderCacheSpec = (dec.inputMetadata ?? [])
      .filter((m: any) => m.name.startsWith('past_key_values') && m.name.includes('.decoder.'))
      .map((m: any) => ({ name: m.name, type: m.type, shape: m.shape }));
    this.multiTokenCacheOk = null;
    const fillable = (n: string) =>
      n === 'input_ids' || n === 'encoder_hidden_states' || n === 'use_cache_branch' || n.startsWith('past_key_values.');
    const inputs: string[] = Array.isArray(dec.inputNames) ? dec.inputNames : [];
    this.stepFetches =
      typeof dec.run === 'function' && inputs.includes('use_cache_branch') && inputs.every(fillable)
        ? dec.outputNames.filter((n: string) => n === 'logits' || (n.startsWith('present') && n.includes('.decoder.')))
        : null;
    this.cacheBranchTrue = this.stepFetches ? new this.T!.Tensor('bool', [true], [1]) : null;
    this.gpu = null;
    this.batchCheck = null;
  }

  /** Cooperative cancel: the running call rejects with CancelledError at its next cancel point. */
  cancel(): void {
    this.cancelFlag = true;
    this.aligner?.cancel();
  }

  async dispose(): Promise<void> {
    try {
      await this.model?.dispose?.();
    } catch {
      // the sessions are gone either way
    }
    this.model = this.tokenizer = this.processor = null;
    this.info = null;
  }

  /**
   * Cancel point. It first yields one macrotask: ORT's session.run() settles through microtasks only,
   * so without the yield the worker's onmessage (where the cancel arrives) is starved until the whole
   * window is decoded. Measured after the fix: cancel settles in 20-47 ms.
   */
  private async check(): Promise<void> {
    await yieldMacrotask();
    if (this.cancelFlag) throw new CancelledError();
  }

  private requireModel(): void {
    if (!this.model || !this.T) throw new Error('WhisperEngine: load() first');
    if (this.busy) throw new Error('WhisperEngine: one call at a time');
  }

  // ---------------------------------------------------------------- decoder plumbing

  /** tokens -> text; timestamp tokens are dropped first (decode([]) throws in 4.3.1). */
  private decodeText(ids: number[]): string {
    const t = ids.filter((x) => x < this.ids.eot);
    return t.length ? this.tokenizer.decode(t, { skip_special_tokens: true }) : '';
  }

  private i64(ids: number[][]): TensorLike {
    const B = ids.length;
    const t = ids[0].length;
    const flat = new BigInt64Array(B * t);
    for (let b = 0; b < B; b++) for (let i = 0; i < t; i++) flat[b * t + i] = BigInt(ids[b][i]);
    return new this.T!.Tensor('int64', flat, [B, t]);
  }

  /** One decoder call; `past` = null for the first call of a window (computes the cross-attention KV). */
  private async run(encoderOut: TensorLike, ids: number[][], past: KV | null): Promise<any> {
    const B = ids.length;
    // input_features only carries the batch size for the empty-cache path
    const dummyFeatures = new this.T!.Tensor('float32', new Float32Array(B), [B, 1, 1]);
    const t0 = performance.now();
    const out = await this.model.forward({
      input_features: dummyFeatures,
      encoder_outputs: encoderOut,
      decoder_input_ids: this.i64(ids),
      past_key_values: past ?? undefined,
    });
    this.stats.decoderRuns++;
    this.stats.decoderMs += performance.now() - t0;
    return out;
  }

  private emptyDecoderKV(): KV {
    const out: KV = {};
    for (const m of this.decoderCacheSpec) {
      const shape = m.shape.map((d, i) => (typeof d === 'number' ? d : i === 0 ? 1 : 0));
      const F16 = (globalThis as any).Float16Array ?? Uint16Array;
      const ctor = m.type === 'float16' ? F16 : Float32Array;
      out[m.name] = new this.T!.Tensor(m.type, new ctor(0), shape as number[]);
    }
    return out;
  }

  private logitsRow(out: any, pos: number | 'last' = 'last'): Float32Array {
    const lg: TensorLike = out.logits; // [1, t, V]
    const t = lg.dims[1];
    const V = lg.dims[2];
    const f32 = lg.type === 'float32' ? lg : lg.to('float32');
    const p = pos === 'last' ? t - 1 : pos;
    return (f32.data as Float32Array).slice(p * V, p * V + V);
  }

  /** New cache after a run: self-attention KV from the output, cross-attention KV stays `prev`'s. */
  private mergeKV(out: any, prev: KV): KV {
    const next: KV = {};
    for (const name of Object.keys(out)) {
      if (!name.startsWith('present')) continue;
      const pn = name.replace('present', 'past_key_values');
      next[pn] = name.includes('.encoder.') ? (prev[pn] ?? out[name]) : out[name];
    }
    for (const k of Object.keys(prev))
      if (!(k in next) && k.includes('.encoder.')) next[k] = prev[k];
    return next;
  }

  private disposeKV(kv: KV | null, keep: Set<TensorLike>): void {
    if (!kv) return;
    for (const t of Object.values(kv))
      if (t?.location === 'gpu-buffer' && !keep.has(t)) t.dispose();
  }

  /**
   * Runs the whole prefix and returns the logits of its last position plus the KV after it. If the
   * cache branch handles multi-token inputs correctly (self-tested once) the shared cross KV is reused;
   * otherwise a plain full pass is done.
   */
  private async prefixPass(
    encoderOut: TensorLike,
    crossKV: KV,
    prefix: number[],
  ): Promise<{ row: Float32Array; kv: KV }> {
    if (this.multiTokenCacheOk === null) {
      const a = await this.run(encoderOut, [prefix], null);
      const ra = this.logitsRow(a);
      const b = await this.run(encoderOut, [prefix], { ...crossKV, ...this.emptyDecoderKV() });
      const rb = this.logitsRow(b);
      let md = 0;
      for (let i = 0; i < ra.length; i++) md = Math.max(md, Math.abs(ra[i] - rb[i]));
      this.multiTokenCacheOk = prefix.length === 1 ? null : md < 0.05;
      this.disposeKV(this.mergeKV(a, {}), new Set(Object.values(crossKV)));
      if (md < 0.05) return { row: rb, kv: this.mergeKV(b, { ...crossKV }) };
      this.disposeKV(this.mergeKV(b, {}), new Set(Object.values(crossKV)));
      const c = await this.run(encoderOut, [prefix], null);
      return { row: this.logitsRow(c), kv: this.mergeKV(c, {}) };
    }
    if (this.multiTokenCacheOk || prefix.length === 1) {
      const b = await this.run(encoderOut, [prefix], { ...crossKV, ...this.emptyDecoderKV() });
      return { row: this.logitsRow(b), kv: this.mergeKV(b, { ...crossKV }) };
    }
    const c = await this.run(encoderOut, [prefix], null);
    return { row: this.logitsRow(c), kv: this.mergeKV(c, {}) };
  }

  // ---------------------------------------------------------------- batched decoding steps

  private tensors(): TensorFactory<TensorLike> {
    const T = this.T!;
    return {
      cpu: (type, data, dims) => new T.Tensor(type, data, dims),
      gpu: (ort) => new (T.Tensor as unknown as new (o: unknown) => TensorLike)(ort),
    };
  }

  /** The GPUDevice onnxruntime-web runs on (the KV row copies must use the same one); null on WASM or unknown. */
  private async gpuDevice(): Promise<GpuDeviceLike | null> {
    if (this.device !== 'webgpu') return null;
    if (!this.gpu) {
      try {
        this.gpu = ((await this.T!.env?.backends?.onnx?.webgpu?.device) as GpuDeviceLike) ?? null;
      } catch {
        this.gpu = null;
      }
    }
    return this.gpu;
  }

  /**
   * How many hypotheses share one decoder forward pass: all of them (`nHyp`) unless the tiled cross-attention KV would
   * exceed the byte cap (see GPU_BATCH_BYTES). 1 when the cache is on the GPU but its device is unknown (no copies).
   */
  private batchLimit(crossKV: KV, nHyp: number, gpu: GpuDeviceLike | null): number {
    if (nHyp <= 1) return 1;
    const tensors = Object.values(crossKV);
    if (!gpu && tensors.some((t) => t.location === 'gpu-buffer')) return 1;
    let perRow = 0;
    for (const t of tensors) perRow += rowBytes(t);
    const cap = this.maxBatchBytes ?? (this.device === 'webgpu' ? GPU_BATCH_BYTES : WASM_BATCH_BYTES);
    return Math.max(1, Math.min(nHyp, Math.floor(cap / Math.max(1, perRow))));
  }

  /** The window's cross-attention KV with `n` identical rows (n = 1: the KV itself). Kept until the window ends. */
  private crossFor(crossKV: KV, n: number, gpu: GpuDeviceLike | null): KV {
    if (n === 1) return crossKV;
    let tiled = this.crossTiles.get(n);
    if (!tiled) {
      // at most two sizes live (the batch and the last chunk's / a shrinking sampling batch's): bound the memory
      if (this.crossTiles.size >= 2) {
        const [oldest] = this.crossTiles.keys();
        this.disposeKV(this.crossTiles.get(oldest)!, new Set());
        this.crossTiles.delete(oldest);
      }
      tiled = {};
      const make = this.tensors();
      for (const [k, t] of Object.entries(crossKV))
        tiled[k] = gatherRows(Array.from({ length: n }, () => ({ t, row: 0 })), make, gpu);
      this.crossTiles.set(n, tiled);
    }
    return tiled;
  }

  /**
   * One decoder step for every active hypothesis: its logits row and new cache row, in `active` order, plus the new
   * caches. The hypotheses go through the decoder in chunks of `limit` rows. The first multi-row chunk after a load
   * also runs its rows one at a time and compares (batchCheck): a quantized export fails, since its per-tensor
   * activation quantization makes a row's numbers depend on its batch neighbours, and from then on every hypothesis
   * gets its own pass, as before batching existed. On failure the step keeps the one-at-a-time results, so the
   * decode is exactly the unbatched one.
   */
  private async decodeStep(
    encoderOut: TensorLike,
    crossKV: KV,
    active: readonly Hyp[],
    limit: number,
    gpu: GpuDeviceLike | null,
  ): Promise<{ results: Array<{ h: Hyp; row: Float32Array; cache: CacheRow }>; presents: KV[] }> {
    const results: Array<{ h: Hyp; row: Float32Array; cache: CacheRow }> = [];
    const presents: KV[] = [];
    const take = (chunk: readonly Hyp[], b: { rows: Float32Array[]; present: KV }) => {
      presents.push(b.present);
      chunk.forEach((h, i) => results.push({ h, row: b.rows[i], cache: { kv: b.present, row: i } }));
    };
    const alone = async (chunk: readonly Hyp[]) => {
      const out: Array<{ rows: Float32Array[]; present: KV }> = [];
      for (const h of chunk) out.push(await this.forwardBatch(encoderOut, crossKV, [h], gpu));
      return out;
    };
    let c = 0;
    while (c < active.length) {
      const size = this.batchCheck && !this.batchCheck.exact && this.batching === 'auto' ? 1 : limit;
      const chunk = active.slice(c, c + size);
      c += chunk.length;
      if (chunk.length > 1 && this.batching === 'auto' && !this.batchCheck) {
        // rows with the same last token cannot show a batching effect: decode them alone until a chunk can
        if (new Set(chunk.map((h) => h.last)).size < 2) {
          (await alone(chunk)).forEach((b, i) => take([chunk[i]], b));
          continue;
        }
        const batched = await this.forwardBatch(encoderOut, crossKV, chunk, gpu);
        const singles = await alone(chunk);
        let maxDiff = 0;
        singles.forEach((b, i) => (maxDiff = Math.max(maxDiff, maxAbsDiff(b.rows[0], batched.rows[i]))));
        this.batchCheck = { maxDiff, exact: maxDiff <= BATCH_EXACT_TOLERANCE };
        if (this.batchCheck.exact) {
          for (const b of singles) this.disposeKV(b.present, new Set());
          take(chunk, batched);
        } else {
          this.disposeKV(batched.present, new Set());
          singles.forEach((b, i) => take([chunk[i]], b));
        }
        continue;
      }
      take(chunk, await this.forwardBatch(encoderOut, crossKV, chunk, gpu));
    }
    return { results, presents };
  }

  /**
   * One decoder forward pass for `chunk` (each hypothesis's last token and cache row): its input cache is the rows of
   * the hypotheses' caches (the tensors themselves when they are already that batch, else row copies), its output is
   * one logits row per hypothesis (in chunk order) and the new batched self-attention cache.
   */
  private async forwardBatch(
    encoderOut: TensorLike,
    crossKV: KV,
    chunk: readonly Hyp[],
    gpu: GpuDeviceLike | null,
  ): Promise<{ rows: Float32Array[]; present: KV }> {
    const past: KV = { ...this.crossFor(crossKV, chunk.length, gpu) };
    const made: TensorLike[] = [];
    const make = this.tensors();
    try {
      for (const name of Object.keys(chunk[0].cache.kv)) {
        const rows = chunk.map((h) => ({ t: h.cache.kv[name], row: h.cache.row }));
        if (isWholeTensor(rows)) past[name] = rows[0].t;
        else made.push((past[name] = gatherRows(rows, make, gpu)));
      }
      return await this.stepRun(encoderOut, chunk.map((h) => h.last), past);
    } finally {
      for (const t of made) if (t.location === 'gpu-buffer') t.dispose();
    }
  }

  /**
   * A cache-branch decoder call for one new token per row: logits rows + the self-attention `present` (renamed
   * `past_key_values.*`). Drives the ONNX session directly with only the outputs a step uses (stepFetches) when it
   * can, else model.forward.
   */
  private async stepRun(
    encoderOut: TensorLike,
    last: number[],
    past: KV,
  ): Promise<{ rows: Float32Array[]; present: KV }> {
    const ids = last.map((t) => [t]);
    const out: Record<string, TensorLike> = this.stepFetches
      ? await this.directRun(encoderOut, ids, past, this.stepFetches)
      : await this.run(encoderOut, ids, past);
    const present: KV = {};
    for (const [k, v] of Object.entries(out)) {
      if (!k.startsWith('present')) continue;
      // the cache branch's encoder outputs are empty placeholders: the cross KV stays the window's
      if (k.includes('.encoder.')) {
        if (v?.location === 'gpu-buffer' && !Object.values(past).includes(v)) v.dispose();
        continue;
      }
      present[k.replace('present', 'past_key_values')] = v;
    }
    const lg: TensorLike = out['logits'];
    const f32 = lg.type === 'float32' ? lg : lg.to('float32');
    const V = lg.dims[2];
    const t = lg.dims[1];
    const data = f32.data as Float32Array;
    const rows = last.map((_, i) => data.subarray((i * t + t - 1) * V, (i * t + t) * V));
    return { rows, present };
  }

  /**
   * A cache-branch call of the merged decoder session itself (what model.forward does, see decoder_forward in
   * Transformers.js 4.3.1), returning only `fetches`: outputs that are not fetched are neither copied to the CPU nor
   * left behind in GPU buffers. Only when stepFetches says every input can be filled. Like the Silero VAD (engine/vad)
   * it does not go through Transformers.js's run queue; the engine never overlaps its own calls (one call at a time).
   */
  private async directRun(
    encoderOut: TensorLike,
    ids: number[][],
    past: KV,
    fetches: string[],
  ): Promise<Record<string, TensorLike>> {
    const dec = this.model.sessions.decoder_model_merged;
    const inputIds = this.i64(ids);
    const feeds: Record<string, unknown> = {};
    for (const name of dec.inputNames as string[]) {
      const t =
        name === 'input_ids'
          ? inputIds
          : name === 'encoder_hidden_states'
            ? encoderOut
            : name === 'use_cache_branch'
              ? this.cacheBranchTrue
              : past[name];
      if (!t) throw new Error(`WhisperEngine: no value for decoder input ${name}`);
      feeds[name] = t.ort_tensor ?? t;
    }
    const t0 = performance.now();
    const raw = await dec.run(feeds, fetches);
    this.stats.decoderRuns++;
    this.stats.decoderMs += performance.now() - t0;
    const T = this.T!.Tensor as unknown as new (o: unknown) => TensorLike;
    const out: Record<string, TensorLike> = {};
    for (const [k, v] of Object.entries<any>(raw)) out[k] = v instanceof this.T!.Tensor ? v : new T(v);
    return out;
  }

  // ---------------------------------------------------------------- features, encoder, first step

  private async encode(audio: Float32Array, timings: Record<string, number>): Promise<Encoded> {
    if (audio.length > MAX_WINDOW_SAMPLES) {
      throw new Error(
        `window is ${(audio.length / SAMPLE_RATE).toFixed(1)} s; Whisper windows are at most 30 s`,
      );
    }
    if (audio.length < MIN_WINDOW_SAMPLES) throw new Error('window shorter than 0.1 s');
    let t = performance.now();
    const { input_features } = await this.processor(audio);
    timings['features'] = ms(t);
    await this.check();
    t = performance.now();
    const kw = await this.model._prepare_encoder_decoder_kwargs_for_generation({
      inputs_tensor: input_features,
      model_inputs: { input_features },
      model_input_name: 'input_features',
      generation_config: this.generationConfig,
    });
    timings['encoder'] = ms(t);
    await this.check();
    return { encoderOut: kw.encoder_outputs, audioSeconds: audio.length / SAMPLE_RATE };
  }

  /** First decoder call [sot]: cross-attention KV, language probabilities, no_speech_prob. */
  private async firstStep(encoderOut: TensorLike): Promise<FirstStep> {
    const out0 = await this.run(encoderOut, [[this.ids.sot]], null);
    const row = this.logitsRow(out0);
    const crossKV: KV = {};
    for (const [k, v] of Object.entries<TensorLike>(out0)) {
      if (!k.startsWith('present')) continue;
      if (k.includes('.encoder.')) crossKV[k.replace('present', 'past_key_values')] = v;
      else if (v?.location === 'gpu-buffer') v.dispose();
    }
    const lp0 = new Float32Array(row);
    logSoftmaxInPlace(lp0);
    // P(<|nospeech|>) at the <|startoftranscript|> position, full-vocabulary softmax
    const noSpeechProb = Math.exp(lp0[this.ids.nospeech]);
    const languages = this.multilingual ? languageProbabilities(row, this.langToId) : [['en', 1]];
    return { row, crossKV, noSpeechProb, languages: languages as Array<[string, number]> };
  }

  private releaseCrossKV(crossKV: KV): void {
    for (const v of Object.values(crossKV)) if (v?.location === 'gpu-buffer') v.dispose();
    this.releaseCrossTiles();
  }

  private releaseCrossTiles(): void {
    for (const kv of this.crossTiles.values()) this.disposeKV(kv, new Set());
    this.crossTiles.clear();
  }

  /** One decoder step over the language tokens (85-740 ms); the encoder pass is the main cost. */
  async detectLanguage(audio: Float32Array): Promise<LanguageResult> {
    this.requireModel();
    this.cancelFlag = false;
    this.busy = true;
    try {
      const timings: Record<string, number> = {};
      const { encoderOut } = await this.encode(audio, timings);
      const first = await this.firstStep(encoderOut);
      this.releaseCrossKV(first.crossKV);
      const [language, probability] = first.languages[0];
      return {
        language,
        probability,
        probabilities: first.languages,
        noSpeechProb: first.noSpeechProb,
      };
    } finally {
      this.busy = false;
    }
  }

  // ---------------------------------------------------------------- one decoding attempt

  /**
   * One decoding attempt at one temperature: greedy, beam search (OpenAI / faster-whisper semantics, below) or best-of
   * sampling. Every step runs the active hypotheses through the decoder together as one batch (or in chunks of
   * batchLimit() rows when the tiled cross-attention KV would be too big) instead of one forward pass each. Each row's
   * logits are then processed exactly as the one-at-a-time loop did, in the same hypothesis order (the same candidate
   * order, ties and sampling draws), so the chosen tokens and scores do not depend on the batching; only the float
   * rounding of a batched matrix product could differ (README "Batched decoding" has the measured comparison).
   */
  private async decodeAttempt(
    encoderOut: TensorLike,
    crossKV: KV,
    prefix: number[],
    a: DecodeParams,
  ): Promise<{ tokens: number[]; logprobs: number[]; avgLogprob: number; ms: number }> {
    const t0 = performance.now();
    const { eot } = this.ids;
    const sampling = a.temperature > 0;
    const nHyp = sampling ? Math.max(1, a.bestOf) : Math.max(1, a.beam);
    const rules = {
      timestamps: a.timestamps,
      repetitionPenalty: a.repetitionPenalty,
      noRepeatNgram: a.noRepeatNgram,
      suppress: this.suppress,
      beginSuppress: this.beginSuppress,
      maxInitialTimestampIndex: this.maxInitialTs,
    };
    const shared = new Set<TensorLike>(Object.values(crossKV));

    await this.check();
    const gpu = await this.gpuDevice();
    const pre = await this.prefixPass(encoderOut, crossKV, prefix);
    // the prefix's self-attention cache (batch 1): every first-step hypothesis starts from its row 0. The steps use
    // the window's cross KV; a second copy the prefix pass may have computed is not needed.
    const kv0: KV = {};
    for (const [k, v] of Object.entries(pre.kv)) {
      if (!k.includes('.encoder.')) kv0[k] = v;
      else if (!shared.has(v) && v?.location === 'gpu-buffer') v.dispose();
    }
    const finished: Finished[] = [];
    const maxFinished = nHyp; // patience 1.0
    // every batched cache of this attempt; one is freed as soon as no active hypothesis refers to it
    const caches = new Set<KV>([kv0]);
    const release = (alive: readonly Hyp[]) => {
      const used = new Set(alive.map((h) => h.cache.kv));
      for (const kv of caches) {
        if (used.has(kv)) continue;
        this.disposeKV(kv, shared);
        caches.delete(kv);
      }
    };

    const process = (row: Float32Array, genTokens: number[], first: boolean) => {
      const raw = new Float32Array(row);
      applyLogitRules(raw, genTokens, first, this.ids, rules);
      const lp = new Float32Array(raw);
      logSoftmaxInPlace(lp); // log-probs of the processed distribution (what CT2 / openai score with)
      return { raw, lp };
    };
    const hyp = (h: Hyp | null, tok: number, lp: number, cache: CacheRow): Hyp => ({
      tokens: h ? [...h.tokens, tok] : [tok],
      logprobs: h ? [...h.logprobs, lp] : [lp],
      sum: (h?.sum ?? 0) + lp,
      cache,
      last: tok,
      finished: tok === eot,
    });

    let active: Hyp[] = [];
    {
      const { raw, lp } = process(pre.row, [], true);
      const start: CacheRow = { kv: kv0, row: 0 };
      if (sampling) {
        for (let i = 0; i < nHyp; i++) {
          const tok = sampleWithTemperature(raw, a.temperature, a.rng);
          active.push(hyp(null, tok, lp[tok], start));
        }
      } else {
        for (const tok of topK(lp, nHyp)) active.push(hyp(null, tok, lp[tok], start));
      }
    }
    const settle = () => {
      for (const h of active) {
        if (h.finished)
          finished.push({
            tokens: h.tokens.slice(0, -1),
            logprobs: h.logprobs.slice(),
            sum: h.sum,
          });
      }
      active = active.filter((h) => !h.finished);
    };
    settle();

    const limit = this.batching === 'never' ? 1 : this.batchLimit(crossKV, nHyp, gpu);
    let step = 0;
    try {
      while (active.length && step < a.maxNew - 1) {
        await this.check();
        a.onTokens?.(active[0].tokens);
        step++;
        const { results, presents } = await this.decodeStep(encoderOut, crossKV, active, limit, gpu);
        for (const p of presents) caches.add(p);
        if (sampling) {
          const next: Hyp[] = [];
          for (const r of results) {
            const { raw, lp } = process(r.row, r.h.tokens, false);
            const tok = sampleWithTemperature(raw, a.temperature, a.rng);
            next.push(hyp(r.h, tok, lp[tok], r.cache));
          }
          active = next;
          settle();
        } else if (nHyp === 1) {
          const r = results[0];
          const { lp } = process(r.row, r.h.tokens, false);
          const tok = argmax(lp);
          active = [hyp(r.h, tok, lp[tok], r.cache)];
          settle();
        } else {
          // beam search (OpenAI semantics): top (beam+1) of every active beam, keep the best `beam` unfinished
          const cands: Array<{
            score: number;
            r: (typeof results)[number];
            tok: number;
            lp: number;
          }> = [];
          for (const r of results) {
            const { lp } = process(r.row, r.h.tokens, false);
            for (const tok of topK(lp, nHyp + 1))
              cands.push({ score: r.h.sum + lp[tok], r, tok, lp: lp[tok] });
          }
          cands.sort((x, y) => y.score - x.score);
          const next: Hyp[] = [];
          for (const c of cands) {
            const nh = hyp(c.r.h, c.tok, c.lp, c.r.cache);
            if (nh.finished) {
              if (finished.length < maxFinished) {
                finished.push({
                  tokens: nh.tokens.slice(0, -1),
                  logprobs: nh.logprobs.slice(),
                  sum: nh.sum,
                });
              }
            } else {
              next.push(nh);
              if (next.length === nHyp) break;
            }
          }
          active = next;
          if (finished.length >= maxFinished) active = [];
        }
        release(active);
      }
    } finally {
      release([]); // done, length limit, cancel or error: no cache outlives the attempt
    }
    // hypotheses that hit the length limit join the pool as if they had ended
    if (finished.length < Math.max(1, sampling ? 1 : a.beam)) {
      for (const h of active)
        finished.push({ tokens: h.tokens.slice(), logprobs: h.logprobs.slice(), sum: h.sum });
    }
    // rank by sum_logprob / length (CTranslate2 length_penalty = 1)
    let best: Finished | undefined = finished[0];
    let bestScore = -Infinity;
    for (const f of finished) {
      const score = f.sum / Math.max(1, f.tokens.length);
      if (score > bestScore) {
        bestScore = score;
        best = f;
      }
    }
    if (!best) best = { tokens: [], logprobs: [], sum: 0 };
    // faster-whisper: avg_logprob = cum_logprob / (len(tokens) + 1); the cumulative score includes <|endoftext|>
    const avgLogprob = averageLogprob(best.sum, best.tokens.length);
    return { tokens: best.tokens, logprobs: best.logprobs, avgLogprob, ms: performance.now() - t0 };
  }

  // ---------------------------------------------------------------- word alignment

  /**
   * Teacher-forced pass over [head, text, eot] (like CTranslate2 `align`): per-token probabilities from
   * the logits, word times from the alignment heads' cross-attention (DTW).
   */
  private async alignWords(
    encoderOut: TensorLike,
    crossKV: KV,
    head: number[],
    textTokens: number[],
    audioSeconds: number,
    probsOverride?: Float32Array,
  ): Promise<AlignedWord[]> {
    if (!this.hasOwnWordTimestamps || !textTokens.length) return [];
    const { eot } = this.ids;
    const seq = [...head, ...textTokens, eot];
    const S = seq.length;
    const shared = new Set<TensorLike>(Object.values(crossKV));
    const needed = [...new Set(this.alignmentHeads.map(([l]) => l))].map((l) => `cross_attentions.${l}`);
    // only the logits and the alignment heads' layers (small: 4 of 12): no readback of the other layers' attention
    const out: Record<string, TensorLike> =
      this.stepFetches && this.multiTokenCacheOk
        ? await this.directRun(encoderOut, [seq], { ...crossKV, ...this.emptyDecoderKV() }, ['logits', ...needed])
        : this.multiTokenCacheOk
          ? await this.run(encoderOut, [seq], { ...crossKV, ...this.emptyDecoderKV() })
          : await this.run(encoderOut, [seq], null);
    try {
      return this.wordsFromPass(out, head, textTokens, audioSeconds, S, probsOverride);
    } finally {
      // the pass's cache outputs live in GPU buffers on WebGPU: free them (they used to stay allocated per window)
      for (const v of Object.values(out)) if (v?.location === 'gpu-buffer' && !shared.has(v)) v.dispose();
    }
  }

  /** Word times (cross-attention DTW of the alignment heads) and probabilities from the teacher-forced pass's outputs. */
  private wordsFromPass(
    out: Record<string, TensorLike>,
    head: number[],
    textTokens: number[],
    audioSeconds: number,
    S: number,
    probsOverride?: Float32Array,
  ): AlignedWord[] {
    const { eot } = this.ids;
    const logits = out['logits'];
    const lg: TensorLike = logits.type === 'float32' ? logits : logits.to('float32');
    const probs =
      probsOverride && probsOverride.length === textTokens.length
        ? probsOverride
        : tokenProbabilities(lg.data as Float32Array, lg.dims[2], head.length, textTokens);
    const encFrames = encoderFramesFor(audioSeconds);
    const rows = textTokens.length + 1; // [notimestamps, w1..wn]: row k attends where token k+1 is spoken
    const layers = new Map<number, CrossAttentionLayer>();
    for (const [l] of this.alignmentHeads) {
      if (layers.has(l)) continue;
      let ca: TensorLike | undefined = out[`cross_attentions.${l}`];
      if (!ca)
        throw new Error(`decoder did not return cross_attentions.${l}: use a *_timestamped repo`);
      if (ca.type !== 'float32') ca = ca.to('float32');
      layers.set(l, { data: ca.data as Float32Array, cols: ca.dims[3] });
    }
    const matrix = alignmentCost(
      layers,
      this.alignmentHeads,
      S,
      head.length - 1,
      rows,
      encFrames,
      this.medianWidth,
    );
    const jumps = jumpTimes(matrix, rows, encFrames);
    const [words, tokens, indices] = this.tokenizer.splitTokensOnSpaces([...textTokens, eot]);
    const aligned = wordsFromJumps({ words, tokens, indices }, jumps, probs);
    return mergePunctuation(cleanWordDurations(aligned));
  }

  /**
   * The aligner's side of `attachAligner`: word times for tokens another model with the same tokenizer decoded on
   * this audio. Runs this engine's encoder and its teacher-forced pass over [sot, lang, task, notimestamps, text,
   * eot]; `tokenProbs` (the other model's token probabilities) replace this model's own in the word probabilities.
   */
  async alignExternal(audio: Float32Array, req: ExternalAlignRequest): Promise<AlignedWord[]> {
    this.requireModel();
    this.cancelFlag = false;
    this.busy = true;
    try {
      if (!this.hasOwnWordTimestamps) throw new Error('WhisperEngine: the aligner has no alignment heads');
      if (!req.textTokens.length) return [];
      const { encoderOut, audioSeconds } = await this.encode(audio, {});
      const first = await this.firstStep(encoderOut);
      try {
        let head = [this.ids.sot];
        if (this.multilingual) {
          const langId = this.langToId[`<|${req.language}|>`];
          if (langId === undefined) throw new Error(`unknown language "${req.language}"`);
          head = [this.ids.sot, langId, req.task === 'translate' ? this.ids.translate : this.ids.transcribe];
        }
        if (req.alignPrefix !== 'sot-lang-task') head = [...head, this.ids.noTimestamps];
        await this.check();
        return await this.alignWords(encoderOut, first.crossKV, head, req.textTokens, audioSeconds, req.tokenProbs);
      } finally {
        this.releaseCrossKV(first.crossKV);
      }
    } finally {
      this.busy = false;
    }
  }

  // ---------------------------------------------------------------- public: one window (<= 30 s)

  async transcribeWindow(
    audio: Float32Array,
    options: TranscribeOptions = {},
  ): Promise<WindowResult> {
    this.requireModel();
    this.cancelFlag = false;
    this.busy = true;
    try {
      return await this.transcribeWindowInner(audio, options);
    } finally {
      if (this.windowCross) this.releaseCrossKV(this.windowCross);
      this.windowCross = null;
      this.busy = false;
    }
  }

  private async transcribeWindowInner(
    audio: Float32Array,
    o: TranscribeOptions,
  ): Promise<WindowResult> {
    const T0 = performance.now();
    const r = resolveOptions(o);
    const timings: Record<string, number> = {};
    const runs0 = this.stats.decoderRuns;

    // 1. features + encoder, 2. first step: cross KV, language, no_speech_prob
    const { encoderOut, audioSeconds } = await this.encode(audio, timings);
    let t = performance.now();
    const first = await this.firstStep(encoderOut);
    const { crossKV, noSpeechProb } = first;
    this.windowCross = crossKV;
    const langProbs = this.multilingual ? first.languages : [];
    let language = o.language ?? null;
    let detected = false;
    if (this.multilingual) {
      if (!language) {
        language = langProbs[0][0];
        detected = true;
      }
    } else language = 'en';
    timings['first-step'] = ms(t);
    const langId = this.langToId[`<|${language}|>`];
    if (this.multilingual && langId === undefined)
      throw new Error(`unknown language "${language}"`);
    const taskId = r.task === 'translate' ? this.ids.translate : this.ids.transcribe;
    const head = this.multilingual ? [this.ids.sot, langId, taskId] : [this.ids.sot];
    const prefixHead = r.timestamps ? head : [...head, this.ids.noTimestamps];
    let prefix = prefixHead;
    if (o.prompt && o.prompt.trim()) {
      const ids = this.tokenizer.encode(' ' + o.prompt.trim(), { add_special_tokens: false });
      const promptIds: number[] = (Array.isArray(ids) ? ids : ids.input_ids)
        .map(Number)
        .slice(-223);
      prefix = [this.ids.prev, ...promptIds, ...prefixHead];
    }

    // 3. decode with the temperature fallback ladder (faster-whisper generate_with_fallback)
    const rng = makeRng(r.seed);
    const attempts: Attempt[] = [];
    let chosen: Attempt | null = null;
    let lastPartial = 0;
    const onTokens = o.onPartial
      ? (toks: number[]) => {
          const now = performance.now();
          if (now - lastPartial < r.partialEvery) return;
          lastPartial = now;
          o.onPartial!({ text: this.decodeText(toks), tokens: toks.length, ms: now - T0 });
        }
      : undefined;
    for (const temperature of r.temperatures) {
      await this.check();
      t = performance.now();
      const d = await this.decodeAttempt(encoderOut, crossKV, prefix, {
        beam: r.beam,
        bestOf: r.bestOf,
        temperature,
        maxNew: r.maxNew,
        timestamps: r.timestamps,
        repetitionPenalty: r.repetitionPenalty,
        noRepeatNgram: r.noRepeatNgram,
        rng,
        onTokens,
      });
      timings[`decode@${temperature}`] = ms(t);
      const text = this.decodeText(d.tokens).trim();
      const att: Attempt = {
        ...d,
        temperature,
        compressionRatio: await compressionRatio(text),
        text,
      };
      attempts.push(att);
      if (!needsFallback(att, noSpeechProb, r.thresholds)) {
        chosen = att;
        break;
      }
    }
    const best = chosen ?? chooseFallback(attempts, r.thresholds);

    // 4. segments from the timestamp tokens (+ the seek rule)
    const parsed = parseSegments(best.tokens, this.ids, audioSeconds, r.timestamps);
    const textTokens = parsed.segments.flatMap((s) => s.toks);

    // 5. word timestamps + word probabilities
    let wordsAll: AlignedWord[] = [];
    if (r.wordTimestamps && textTokens.length && this.hasOwnWordTimestamps) {
      await this.check();
      t = performance.now();
      const alignHead =
        r.alignPrefix === 'sot-lang-task' ? [...head] : [...head, this.ids.noTimestamps];
      wordsAll = await this.alignWords(encoderOut, crossKV, alignHead, textTokens, audioSeconds);
      timings['align'] = ms(t);
    } else if (r.wordTimestamps && textTokens.length && this.aligner?.hasOwnWordTimestamps) {
      // large-v3 / distil-large-v3: the turbo `_timestamped` model times this model's tokens
      await this.check();
      t = performance.now();
      wordsAll = await this.aligner.alignExternal(audio, {
        language: language!,
        task: r.task,
        textTokens,
        tokenProbs: textTokenProbabilities(best.tokens, best.logprobs, this.ids.eot),
        alignPrefix: r.alignPrefix,
      });
      timings['align'] = ms(t);
    }

    // 6. assemble segments (+ faster-whisper's segment / word boundary reconciliation)
    const segments: Segment[] = [];
    let wi = 0;
    let lastSpeech = 0;
    for (const s of parsed.segments) {
      const words: Word[] = [];
      if (wordsAll.length) {
        let saved = 0;
        while (wi < wordsAll.length && saved < s.toks.length) {
          const w = wordsAll[wi];
          words.push({ word: w.word, start: w.start, end: w.end, probability: w.probability });
          saved += w.tokens.length;
          wi++;
        }
      }
      const edges = reconcileSegmentEdges(s.start, s.end, words, lastSpeech);
      lastSpeech = edges.lastSpeech;
      segments.push({
        start: edges.start + r.offset,
        end: edges.end + r.offset,
        text: this.decodeText(s.toks).trim(),
        unfinished: s.unfinished,
        words: words.map((w) => ({ ...w, start: w.start + r.offset, end: w.end + r.offset })),
        avgLogprob: best.avgLogprob,
        noSpeechProb,
        compressionRatio: best.compressionRatio,
        temperature: best.temperature,
        confidence: confidenceOf(words, best.avgLogprob),
        tokens: s.toks,
      });
    }
    const words = segments.flatMap((s) => s.words);
    this.releaseCrossKV(crossKV); // free the per-window GPU tensors (and their batch tiles)
    this.windowCross = null;
    timings['total'] = ms(T0);
    timings['decoderRuns'] = this.stats.decoderRuns - runs0;
    return {
      language: language!,
      languageProbability: langProbs.find((x) => x[0] === language)?.[1] ?? 1,
      languageProbabilities: langProbs.slice(0, 5),
      languageDetected: detected,
      noSpeechProb,
      text: segments
        .map((s) => s.text)
        .join(' ')
        .trim(),
      segments,
      words,
      confidence: confidenceOf(words, best.avgLogprob),
      consumedSeconds: parsed.consumedSeconds,
      singleTimestampEnding: parsed.singleTimestampEnding,
      avgLogprob: best.avgLogprob,
      compressionRatio: best.compressionRatio,
      temperature: best.temperature,
      fallbacks: attempts.map((a) => ({
        temperature: a.temperature,
        avgLogprob: a.avgLogprob,
        compressionRatio: a.compressionRatio,
        tokens: a.tokens.length,
        ms: Math.round(a.ms),
      })),
      tokens: best.tokens,
      tokenLogprobs: o.debugTokens ? best.logprobs : undefined,
      timings,
    };
  }
}

/** What `alignExternal` needs: the transcribing model's text tokens of one window and their probabilities. */
export interface ExternalAlignRequest {
  language: string;
  task: 'transcribe' | 'translate';
  textTokens: number[];
  /** probability of each text token in the transcribing model's own decode (textTokenProbabilities) */
  tokenProbs?: Float32Array;
  alignPrefix?: 'notimestamps' | 'sot-lang-task';
}

/** The part of WhisperEngine an aligner needs to expose. */
export interface ExternalAligner {
  readonly hasOwnWordTimestamps: boolean;
  alignExternal(audio: Float32Array, req: ExternalAlignRequest): Promise<AlignedWord[]>;
  cancel(): void;
}

/**
 * exp(log-prob) of the text tokens (< eot) of a decoded sequence, in order: the tokens the segments carry. `logprobs`
 * are the processed distribution's, as CTranslate2 / OpenAI score a hypothesis.
 */
export function textTokenProbabilities(tokens: readonly number[], logprobs: readonly number[], eot: number): Float32Array {
  const out: number[] = [];
  for (let i = 0; i < tokens.length; i++) if (tokens[i] < eot) out.push(Math.exp(logprobs[i] ?? -Infinity));
  return Float32Array.from(out);
}

/** Largest |a[i] - b[i]| of two raw logits rows (finite numbers; a NaN counts as an infinite difference). */
function maxAbsDiff(a: Float32Array, b: Float32Array): number {
  let m = 0;
  for (let i = 0; i < a.length; i++) {
    const d = Math.abs(a[i] - b[i]);
    if (Number.isNaN(d)) return Infinity;
    if (d > m) m = d;
  }
  return m;
}

function ms(since: number): number {
  return Math.round((performance.now() - since) * 10) / 10;
}
