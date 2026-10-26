/**
 * QwenEngine: Qwen3-ASR 0.6B / 1.7B on onnxruntime-web WebGPU, one chunk (<= 27 s) per call.
 *
 *   log-mel (qwen-mel.ts) -> audio encoder -> prompt (system context, audio pads, optional forced language) as
 *   embeddings (int8 table x scale, audio rows from the encoder) -> fused GQA decoder prefill -> greedy steps with a
 *   GPU-resident KV cache until <|endoftext|> / <|im_end|> or 512 new tokens -> tokenizer decode (special tokens
 *   skipped, `<asr_text>` kept) -> qwen_asr parse_asr_output.
 *
 * This is the spike's working harness contract (docs/in-browser/spike/qwen.md Appendix B), with what the server's
 * `qwen_asr` call adds: `max_new_tokens=512`, greedy decoding, the system-turn context (the vocabulary hint), the
 * forced `language X<asr_text>` prefix when the user chose a language, chunks under 0.5 s padded with zeros, and the
 * runaway-repetition guard inside the parser. Cancel is checked before the encoder and at every decoder step (it
 * yields a macrotask first, so the worker's cancel message is delivered while ORT is busy); every superseded KV
 * tensor is disposed.
 *
 * onnxruntime-web is imported as `onnxruntime-web/webgpu` (the bare entry is the wasm-only bundle and silently runs on
 * the CPU), the same module Transformers.js uses, so the Whisper engine and this one share one runtime and its wasm
 * files from the pinned jsDelivr URL. Silero VAD lives on the separate wasm-only instance and runs before any decode.
 */
import { CancelledError } from '../asr/types';
import type { QwenCatalogEntry } from '../models/qwen-catalog';
import type { QwenFileSet } from '../models/qwen-files';
import { ortWasmPaths } from '../models/ort-config';
import { argmaxLogits, floatToHalf, halfBits } from './half';
import { padChunk } from './qwen-chunks';
import { audioTokenCount, logMel, MelFilters, MixedRadixFft, N_FFT, parseMelFilters } from './qwen-mel';
import { parseAsrOutput } from './qwen-text';

/* The ORT and tokenizer objects are structural on purpose (tests pass fakes; ORT's own typings are not needed). */
export interface QwenTensor {
  readonly type: string;
  readonly dims: readonly number[];
  readonly data: unknown;
  readonly location?: string;
  dispose?(): void;
}

export interface QwenSession {
  readonly inputNames: readonly string[];
  readonly outputNames: readonly string[];
  run(feeds: Record<string, QwenTensor>): Promise<Record<string, QwenTensor>>;
  release?(): Promise<void>;
}

export interface QwenOrt {
  Tensor: new (type: string, data: unknown, dims: readonly number[]) => QwenTensor;
  InferenceSession: { create(model: Uint8Array, options?: Record<string, unknown>): Promise<QwenSession> };
  env: { wasm: { wasmPaths?: unknown; numThreads?: number; proxy?: boolean }; logLevel?: string };
}

export interface QwenTokenizer {
  encode(text: string, options?: { add_special_tokens?: boolean }): number[] | { input_ids: number[] };
  decode(ids: number[], options?: { skip_special_tokens?: boolean; clean_up_tokenization_spaces?: boolean }): string;
}

export interface QwenDeps {
  ort?: () => Promise<QwenOrt>;
  /** builds the tokenizer from tokenizer.json + tokenizer_config.json (default: Transformers.js Qwen2Tokenizer) */
  tokenizer?: (json: unknown, config: unknown) => Promise<QwenTokenizer>;
}

/** prompt_config.json of the layout-v2 export (the parts used here). */
export interface QwenPromptConfig {
  prompt: {
    prefix_ids: number[];
    suffix_ids: number[];
    audio_pad_id: number;
    asr_text_id: number;
    eos_ids: number[];
    max_new_tokens?: number;
  };
  language_prefix_ids?: Record<string, number[]>;
  language_names?: Record<string, string>;
  decoder: { num_layers: number; num_key_value_heads: number; head_dim: number; hidden_size: number; vocab_size: number };
}

export interface QwenLoadInfo {
  model: string;
  hidden: number;
  layers: number;
  ms: { total: number; tokenizer: number; sessions: number };
  inputNames: readonly string[];
}

export interface QwenDecodeOptions {
  /** the language name the model is forced to ("Hindi"), null = it detects and writes `language X<asr_text>` */
  language?: string | null;
  /** the vocabulary hint: the system turn's text (the server's `context=`) */
  context?: string;
  /** server: max_new_tokens=512 */
  maxNewTokens?: number;
  /** growing text while decoding, at most every `partialIntervalMs` */
  onPartial?: (text: string) => void;
  partialIntervalMs?: number;
}

export interface QwenDecodeResult {
  /** what the tokenizer decoded (the server's `out` before parse_asr_output) */
  raw: string;
  /** parse_asr_output's text */
  text: string;
  /** parse_asr_output's language name ('' when none or silent) */
  language: string;
  tokens: number;
  hitMaxTokens: boolean;
  timings: Record<string, number>;
}

/** The server's qwen_asr call: Qwen3ASRModel.from_pretrained(..., max_new_tokens=512). */
export const QWEN_MAX_NEW_TOKENS = 512;

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

async function defaultOrt(): Promise<QwenOrt> {
  const ort = (await import('onnxruntime-web/webgpu')) as unknown as QwenOrt;
  const wasm = ort.env.wasm;
  // the same settings engine/models applies to Transformers.js's copy of this module (same pinned build)
  if (!wasm.wasmPaths) wasm.wasmPaths = ortWasmPaths();
  wasm.numThreads = 1;
  wasm.proxy = false;
  return ort;
}

async function defaultTokenizer(json: unknown, config: unknown): Promise<QwenTokenizer> {
  const T = (await import('@huggingface/transformers')) as unknown as Record<string, unknown>;
  // what AutoTokenizer.from_pretrained does after fetching the two files (tokenizer_class: Qwen2Tokenizer), on the
  // pinned, hash-checked copies instead of an unverified fetch of `main`
  const Cls = (T['Qwen2Tokenizer'] ?? T['PreTrainedTokenizer']) as new (j: unknown, c: unknown) => QwenTokenizer;
  return new Cls(json, config);
}

const decoder = new TextDecoder('utf-8');
const json = (bytes: Uint8Array): unknown => JSON.parse(decoder.decode(bytes));

export class QwenEngine {
  readonly stats = { chunks: 0, steps: 0, decodeMs: 0 };
  private ort: QwenOrt | null = null;
  private encoder: QwenSession | null = null;
  private decoderSession: QwenSession | null = null;
  private tokenizer: QwenTokenizer | null = null;
  private pc: QwenPromptConfig | null = null;
  private filters: MelFilters | null = null;
  private emb: Int8Array | null = null;
  private scales: Float32Array | null = null;
  private readonly fft = new MixedRadixFft(N_FFT);
  private H = 0;
  private V = 0;
  private L = 0;
  private kvHeads = 8;
  private headDim = 128;
  private entry: QwenCatalogEntry | null = null;
  private cancelFlag = false;
  private busy = false;
  private readonly langIds = new Map<string, number[]>();

  constructor(private readonly deps: QwenDeps = {}) {}

  get loaded(): boolean {
    return this.decoderSession !== null;
  }

  /**
   * Creates the WebGPU sessions from the verified file bytes (engine/models ModelManager.ensureQwen). The encoder and
   * decoder bytes are only needed until the sessions exist; the embedding table stays in memory (155 / 311 MB).
   */
  async load(files: QwenFileSet, entry: QwenCatalogEntry): Promise<QwenLoadInfo> {
    const t0 = performance.now();
    const ort = (this.ort = await (this.deps.ort ?? defaultOrt)());
    const pc = json(files['prompt-config']) as QwenPromptConfig;
    this.pc = pc;
    this.filters = parseMelFilters(json(files['mel-filters']) as { n_mels?: number; n_freqs?: number; data: number[][] });
    this.H = pc.decoder.hidden_size;
    this.V = pc.decoder.vocab_size;
    this.L = pc.decoder.num_layers;
    this.kvHeads = pc.decoder.num_key_value_heads;
    this.headDim = pc.decoder.head_dim;
    if (this.H !== entry.hidden || this.L !== entry.layers) {
      throw new Error(`prompt_config.json (hidden ${this.H}, layers ${this.L}) does not match ${entry.id}`);
    }
    const embBytes = files['embeddings'];
    this.emb = new Int8Array(embBytes.buffer, embBytes.byteOffset, embBytes.byteLength);
    const sc = files['embedding-scales'];
    this.scales = new Float32Array(sc.buffer.slice(sc.byteOffset, sc.byteOffset + sc.byteLength));
    if (this.emb.length !== this.V * this.H || this.scales.length !== this.V) {
      throw new Error(`embedding table is ${this.emb.length} values / ${this.scales.length} scales, expected ${this.V} x ${this.H}`);
    }
    const tTok = performance.now();
    this.tokenizer = await (this.deps.tokenizer ?? defaultTokenizer)(json(files['tokenizer']), json(files['tokenizer-config']));
    const tSess = performance.now();
    const common = { executionProviders: ['webgpu'], graphOptimizationLevel: 'all' };
    this.encoder = await ort.InferenceSession.create(files['encoder'], common);
    const present: Record<string, string> = {};
    for (let i = 0; i < this.L; i++) {
      present[`present.${i}.key`] = 'gpu-buffer';
      present[`present.${i}.value`] = 'gpu-buffer';
    }
    const dataFile = entry.files.find((f) => f.role === 'decoder-data')!.name;
    this.decoderSession = await ort.InferenceSession.create(files['decoder'], {
      ...common,
      externalData: [{ path: dataFile, data: files['decoder-data'] }],
      preferredOutputLocation: present,
    });
    for (const name of ['inputs_embeds', 'attention_mask', 'past_key_values.0.key']) {
      if (!this.decoderSession.inputNames.includes(name)) throw new Error(`the Qwen decoder has no input "${name}"`);
    }
    this.entry = entry;
    this.langIds.clear();
    return {
      model: entry.id,
      hidden: this.H,
      layers: this.L,
      ms: { total: performance.now() - t0, tokenizer: tSess - tTok, sessions: performance.now() - tSess },
      inputNames: this.decoderSession.inputNames,
    };
  }

  /** Cooperative cancel: the running call rejects with CancelledError at its next step. */
  cancel(): void {
    this.cancelFlag = true;
  }

  async dispose(): Promise<void> {
    const sessions = [this.encoder, this.decoderSession];
    this.encoder = this.decoderSession = null;
    for (const s of sessions) {
      try {
        await s?.release?.();
      } catch {
        // gone either way
      }
    }
    this.tokenizer = null;
    this.emb = this.scales = null;
    this.entry = null;
  }

  private async check(): Promise<void> {
    await yieldMacrotask();
    if (this.cancelFlag) throw new CancelledError();
  }

  /** `language X<asr_text>` ids: prompt_config's table (16 languages), else the tokenizer (the other 14). */
  forcedPrefix(languageName: string): number[] {
    const have = this.langIds.get(languageName);
    if (have) return have;
    const pc = this.pc!;
    const code = Object.entries(pc.language_names ?? {}).find(([, n]) => n === languageName)?.[0];
    let ids = code ? pc.language_prefix_ids?.[code] : undefined;
    if (!ids) {
      const enc = this.tokenizer!.encode(`language ${languageName}`, { add_special_tokens: false });
      ids = [...(Array.isArray(enc) ? enc : enc.input_ids).map(Number), pc.prompt.asr_text_id];
    }
    this.langIds.set(languageName, ids);
    return ids;
  }

  /** The prompt token ids around `audioTokens` pads: system context, user audio, assistant (+ forced language). */
  promptIds(audioTokens: number, context: string, languageName: string | null): { ids: number[]; audioAt: number } {
    const P = this.pc!.prompt;
    // the system turn holds the hint as given (qwen_asr: {"role": "system", "content": context or ""})
    const ctx = context
      ? (() => {
          const enc = this.tokenizer!.encode(context, { add_special_tokens: false });
          return (Array.isArray(enc) ? enc : enc.input_ids).map(Number);
        })()
      : [];
    // <|im_start|>system\n{context}<|im_end|>\n<|im_start|>user\n<|audio_start|>
    const prefix = [...P.prefix_ids.slice(0, 3), ...ctx, ...P.prefix_ids.slice(3)];
    const forced = languageName ? this.forcedPrefix(languageName) : [];
    const ids = [...prefix, ...new Array<number>(audioTokens).fill(P.audio_pad_id), ...P.suffix_ids, ...forced];
    return { ids, audioAt: prefix.length };
  }

  /** One model pass over a chunk (16 kHz mono). */
  async transcribeChunk(audio: Float32Array, o: QwenDecodeOptions = {}): Promise<QwenDecodeResult> {
    if (!this.decoderSession || !this.encoder || !this.ort) throw new Error('QwenEngine: load() first');
    if (this.busy) throw new Error('QwenEngine: one call at a time');
    this.busy = true;
    this.cancelFlag = false;
    try {
      return await this.decodeInner(audio, o);
    } finally {
      this.busy = false;
    }
  }

  private async decodeInner(audio: Float32Array, o: QwenDecodeOptions): Promise<QwenDecodeResult> {
    const ort = this.ort!;
    const H = this.H;
    const timings: Record<string, number> = {};
    let t = performance.now();
    await this.check();
    const { mel, frames } = logMel(padChunk(audio), this.filters!, this.fft);
    timings['mel'] = performance.now() - t;
    await this.check();
    t = performance.now();
    const enc = await this.encoder!.run({ mel: new ort.Tensor('float32', mel, [1, this.filters!.nMels, frames]) });
    const af = enc['audio_features'] ?? enc[this.encoder!.outputNames[0]];
    timings['encoder'] = performance.now() - t;
    const A = af.dims[1];
    if (af.dims[2] !== H) throw new Error(`audio features have width ${af.dims[2]}, expected ${H}`);
    if (A !== audioTokenCount(frames)) {
      // the formula is the export's documented contract; trust the encoder's own length if they ever disagree
      timings['audioTokenMismatch'] = audioTokenCount(frames) - A;
    }
    await this.check();

    const languageName = o.language ?? null;
    const { ids, audioAt } = this.promptIds(A, o.context ?? '', languageName);
    const S = ids.length;
    t = performance.now();
    const buf = new Uint16Array(S * H);
    this.embedRows(ids, buf, 0);
    const afBits = af.type === 'float16' ? halfBits(af.data) : null;
    const afData = af.data as ArrayLike<number>;
    for (let r = 0; r < A; r++) {
      const so = r * H;
      const oo = (audioAt + r) * H;
      if (afBits) buf.set(afBits.subarray(so, so + H), oo);
      else for (let j = 0; j < H; j++) buf[oo + j] = floatToHalf(afData[so + j]);
    }
    af.dispose?.();
    timings['prompt'] = performance.now() - t;

    const P = this.pc!.prompt;
    const eos = new Set(P.eos_ids);
    const maxNew = o.maxNewTokens ?? QWEN_MAX_NEW_TOKENS;
    const gen: number[] = [];
    const L = this.L;
    let past: Record<string, QwenTensor> = {};
    for (let i = 0; i < L; i++) {
      past[`past_key_values.${i}.key`] = new ort.Tensor('float16', new Uint16Array(0), [1, this.kvHeads, 0, this.headDim]);
      past[`past_key_values.${i}.value`] = new ort.Tensor('float16', new Uint16Array(0), [1, this.kvHeads, 0, this.headDim]);
    }
    const disposePast = () => {
      for (const k of Object.keys(past)) past[k].dispose?.();
      past = {};
    };
    const takePast = (out: Record<string, QwenTensor>) => {
      const p: Record<string, QwenTensor> = {};
      for (let i = 0; i < L; i++) {
        p[`past_key_values.${i}.key`] = out[`present.${i}.key`];
        p[`past_key_values.${i}.value`] = out[`present.${i}.value`];
      }
      return p;
    };
    const mask = (n: number) => new ort.Tensor('int64', new BigInt64Array(n).fill(1n), [1, n]);
    let lastPartial = 0;
    const partialEvery = o.partialIntervalMs ?? 150;
    let hitMax = false;
    t = performance.now();
    try {
      let out = await this.decoderSession!.run({ inputs_embeds: new ort.Tensor('float16', buf, [1, S, H]), attention_mask: mask(S), ...past });
      timings['prefill'] = performance.now() - t;
      disposePast(); // the empty seeds
      past = takePast(out);
      let tok = argmaxLogits(out['logits'].data, out['logits'].type, this.V);
      out['logits'].dispose?.();
      let total = S;
      t = performance.now();
      for (;;) {
        gen.push(tok);
        if (eos.has(tok)) break;
        if (gen.length >= maxNew) {
          hitMax = true;
          break;
        }
        await this.check();
        if (o.onPartial) {
          const now = performance.now();
          if (now - lastPartial >= partialEvery) {
            lastPartial = now;
            o.onPartial(this.visibleText(gen));
          }
        }
        total += 1;
        const eb = new Uint16Array(H);
        this.embedRows([tok], eb, 0);
        out = await this.decoderSession!.run({ inputs_embeds: new ort.Tensor('float16', eb, [1, 1, H]), attention_mask: mask(total), ...past });
        disposePast();
        past = takePast(out);
        tok = argmaxLogits(out['logits'].data, out['logits'].type, this.V);
        out['logits'].dispose?.();
        this.stats.steps++;
      }
      timings['decode'] = performance.now() - t;
    } finally {
      disposePast();
    }
    this.stats.chunks++;
    this.stats.decodeMs += timings['decode'] ?? 0;
    const raw = this.tokenizer!.decode(gen, { skip_special_tokens: true, clean_up_tokenization_spaces: false });
    const parsed = parseAsrOutput(raw, languageName);
    return { raw, text: parsed.text, language: parsed.language, tokens: gen.length, hitMaxTokens: hitMax, timings };
  }

  /** The text after `<asr_text>` so far (what the page shows while a chunk decodes). */
  private visibleText(gen: number[]): string {
    const at = gen.indexOf(this.pc!.prompt.asr_text_id);
    const ids = at >= 0 ? gen.slice(at + 1) : gen;
    return this.tokenizer!.decode(ids, { skip_special_tokens: true, clean_up_tokenization_spaces: false }).trim();
  }

  /** int8 row x scale -> fp16 bits, for `ids` into `out` from row `rowOffset`. */
  private embedRows(ids: readonly number[], out: Uint16Array, rowOffset: number): void {
    const H = this.H;
    const emb = this.emb!;
    const scales = this.scales!;
    for (let r = 0; r < ids.length; r++) {
      const id = ids[r];
      const sc = scales[id];
      const eo = id * H;
      const oo = (rowOffset + r) * H;
      for (let j = 0; j < H; j++) out[oo + j] = floatToHalf(emb[eo + j] * sc);
    }
  }
}
