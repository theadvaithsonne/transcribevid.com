/**
 * AI4Bharat IndicXlit v1 (Indic -> Roman) running entirely in the browser.
 *
 * This is a re-implementation of the server's CTranslate2 int8 inference (backend/app/indicxlit.py): the same
 * weights (indicxlit.bin holds the model.bin tensors unchanged), the same int8 arithmetic, the same float32
 * operations in the same order and the same beam search. The numeric kernels are WebAssembly (SIMD when
 * available, built from kernels/indicxlit-kernels.as.ts) with a portable TypeScript twin in kernels.ts.
 * Nothing here touches the DOM or Angular, so it runs in a Web Worker (indicxlit.worker.ts) and in Node.
 *
 *   const model = await load('/models/indicxlit/');
 *   model.transliterate(['नमस्ते', 'स्टूडेंट'], { beamSize: 4 });   // -> ['namaste', 'student']
 *   model.dispose();
 *
 * Decoding settings are those of the server: tokens ['__hi__', ...NFC(word)] + </s>, beam 4, one hypothesis,
 * length penalty 1, at most 96 output symbols.
 */
import { logSoftmaxRow } from './float32';
import { JsKernels, Kernels, createWasmKernels } from './kernels';
import { parseWordCache } from './wordcache';

const f = Math.fround;

export interface TransliterateOptions {
  /** Beam width. The server uses 4 (default); 1 is greedy decoding. 2..27 are supported. */
  beamSize?: number;
  /** Maximum number of output symbols (server: 96). */
  maxDecodingLength?: number;
}

export interface AsyncTransliterateOptions extends TransliterateOptions {
  /** Polled before every encoder layer and decoder step; once it returns true the call rejects with an AbortError. */
  isCancelled?: () => boolean;
  /** Gives the event loop a turn (so that a cancel can be delivered) after `sliceMs` of work; default: a zero timeout. */
  yieldNow?: () => Promise<void>;
  /** Longest stretch of computation between two yields, in milliseconds (default 20). */
  sliceMs?: number;
  now?: () => number;
}

export interface LoadOptions {
  /** Called with (bytes received, total bytes) while indicxlit.bin downloads. */
  onProgress?: (received: number, total: number) => void;
  /** Check the SHA-256 of indicxlit.bin against the header (default true when crypto.subtle exists). */
  verify?: boolean;
  /** Replacement for fetch (tests, custom caching). */
  fetch?: typeof fetch;
  /** Use the portable TypeScript kernels even when WebAssembly is available (testing). */
  forceJs?: boolean;
  /** Skip the SIMD WebAssembly build (testing the portable WebAssembly build). */
  disableSimd?: boolean;
  /** Use wordcache.tsv next to the model when it exists (default true). It only ever returns the model's own output. */
  wordCache?: boolean;
  /** Contents of wordcache.tsv, for callers that fetched it themselves (fromBuffers). */
  wordCacheText?: string;
}

export interface IndicXlitInfo {
  readonly format: string;
  readonly binBytes: number;
  readonly kernel: 'wasm-simd' | 'wasm' | 'js';
  readonly loadMs: number;
  /** Words of the exact lookup table in use (0 when there is none). */
  readonly wordCacheEntries: number;
  /** Size of the memory holding weights and activations right now. */
  readonly memoryBytes: number;
}

export interface IndicXlit {
  /** Convert Devanagari words (any strings; each is NFC-normalised first) to Roman letters, order preserved. */
  transliterate(words: string[], options?: TransliterateOptions): string[];
  /**
   * The same result, computed in slices: the search yields to the event loop every `sliceMs` and polls
   * `isCancelled` before every encoder layer and decoder step, so one long word neither blocks the thread nor
   * outlives a cancel (the call then rejects with an AbortError). One call at a time per instance.
   */
  transliterateAsync(words: string[], options?: AsyncTransliterateOptions): Promise<string[]>;
  /** Release the weights. The instance cannot be used afterwards. */
  dispose(): void;
  readonly info: IndicXlitInfo;
}

// ---------------------------------------------------------------------------------------------------------
// asset header
// ---------------------------------------------------------------------------------------------------------
interface TensorEntry {
  dtype: 'f32' | 'i8';
  shape: number[];
  offset: number;
  bytes: number;
}

export interface Header {
  format: string;
  dims: {
    d_model: number;
    heads: number;
    ffn: number;
    enc_layers: number;
    dec_layers: number;
    head_dim: number;
    source_vocab: number;
    target_vocab: number;
    position_rows: number;
  };
  specials: { bos: number; pad: number; eos: number; unk: number };
  language_token: string;
  scale_embeddings: { encoder: number; decoder: number };
  decoding_defaults: {
    beam_size: number;
    max_decoding_length: number;
    max_input_length: number;
    min_decoding_length: number;
  };
  source_vocabulary: string[];
  target_vocabulary: string[];
  tensors: Record<string, TensorEntry>;
  bin: { file: string; bytes: number; sha256: string };
}

const FORMAT = 'indicxlit-int8-v1';
const EXPECTED_DIMS = {
  d_model: 256,
  heads: 4,
  ffn: 1024,
  enc_layers: 6,
  dec_layers: 6,
  head_dim: 64,
};
const MAX_BEAM = 27; // CTranslate2 needs 2 * beam candidates <= vocabulary size to expand after step 0
const LOWEST = -3.4028234663852886e38;
const D = 256;
const NH = 4;
const DH = 64;
const PAGE = 65536;
/** Symbols the per-hypothesis caches are sized for before a longer word triggers a second, roomier attempt. */
const SOFT_CAP = 32;
/** Default for AsyncTransliterateOptions.sliceMs. */
const SLICE_MS = 20;

/** Thrown inside the search when a word needs more cache than the current layout holds. */
class CapacityError extends Error {}

/** The step-by-step form of a conversion: each `yield` is a point where the caller may pause or stop it. */
type Steps<T> = Generator<void, T, undefined>;

function abortError(): Error {
  const error = new Error('Conversion aborted.');
  error.name = 'AbortError';
  return error;
}
const RESERVED = 1 << 20; // the kernel module's own static data lives below this offset

// ---------------------------------------------------------------------------------------------------------
// memory: one growable buffer shared by the kernels, the weights and all activations
// ---------------------------------------------------------------------------------------------------------
class Arena {
  private readonly wasm: WebAssembly.Memory | null;
  private plain: ArrayBuffer | null;
  top = RESERVED;
  f32!: Float32Array;
  i32!: Int32Array;
  u8!: Uint8Array;
  i8!: Int8Array;

  constructor(wasm: WebAssembly.Memory | null) {
    this.wasm = wasm;
    this.plain = wasm ? null : new ArrayBuffer(RESERVED);
    this.refresh();
  }

  get buffer(): ArrayBuffer {
    return (this.wasm ? this.wasm.buffer : this.plain) as ArrayBuffer;
  }

  private refresh(): void {
    const b = this.buffer;
    this.f32 = new Float32Array(b);
    this.i32 = new Int32Array(b);
    this.u8 = new Uint8Array(b);
    this.i8 = new Int8Array(b);
  }

  /** Reserve `bytes` (16-byte aligned) at the top of the arena, growing the memory when needed. */
  alloc(bytes: number): number {
    const p = (this.top + 15) & ~15;
    const end = p + bytes;
    const have = this.buffer.byteLength;
    if (end > have) {
      const pages = Math.ceil((end - have) / PAGE);
      if (this.wasm) {
        this.wasm.grow(pages);
      } else {
        const bigger = new ArrayBuffer(have + pages * PAGE);
        new Uint8Array(bigger).set(new Uint8Array(this.plain as ArrayBuffer));
        this.plain = bigger;
      }
      this.refresh();
    }
    this.top = end;
    return p;
  }
}

// ---------------------------------------------------------------------------------------------------------
// weights (pointers into the arena)
// ---------------------------------------------------------------------------------------------------------
interface Norm {
  gamma: number;
  beta: number;
}

interface Lin {
  n: number;
  k: number;
  w: number;
  scale: number;
  bias: number; // 0 when absent
  comp: number;
}

interface Emb {
  w: number;
  /** float32(1 / scale) per row, as CTranslate2 dequantises: float(int8) * (1 / scale) */
  rscale: Float32Array;
}

interface EncLayer {
  saNorm: Norm;
  qkv: Lin;
  out: Lin;
  ffNorm: Norm;
  fc1: Lin;
  fc2: Lin;
}

interface DecLayer {
  saNorm: Norm;
  qkv: Lin;
  out: Lin;
  caNorm: Norm;
  q: Lin;
  kv: Lin;
  caOut: Lin;
  ffNorm: Norm;
  fc1: Lin;
  fc2: Lin;
}

class Weights {
  readonly encEmb: Emb;
  readonly encEmbNorm: Norm;
  readonly encLayers: EncLayer[] = [];
  readonly encNorm: Norm;
  readonly decEmb: Emb;
  readonly decEmbNorm: Norm;
  readonly decLayers: DecLayer[] = [];
  readonly decNorm: Norm;
  readonly proj: Lin;
  readonly positions: number; // pointer to position_rows * D float32

  /** `base` is where indicxlit.bin starts inside the arena. */
  constructor(
    readonly header: Header,
    arena: Arena,
    base: number,
  ) {
    const t = header.tensors;
    const ptr = (name: string, dtype: 'f32' | 'i8'): number => {
      const e = t[name];
      if (!e || e.dtype !== dtype) throw new Error(`indicxlit: missing ${dtype} tensor ${name}`);
      return base + e.offset;
    };
    const norm = (p: string): Norm => ({
      gamma: ptr(`${p}/gamma`, 'f32'),
      beta: ptr(`${p}/beta`, 'f32'),
    });
    const lin = (p: string, withBias = true): Lin => {
      const e = t[`${p}/weight`];
      if (!e) throw new Error(`indicxlit: missing tensor ${p}/weight`);
      const [n, k] = e.shape;
      const w = ptr(`${p}/weight`, 'i8');
      const comp = arena.alloc(n * 4);
      const i8 = arena.i8;
      const i32 = arena.i32;
      for (let j = 0; j < n; j++) {
        let s = 0;
        const row = w + j * k;
        for (let i = 0; i < k; i++) s += i8[row + i];
        i32[(comp >> 2) + j] = -128 * s;
      }
      return {
        n,
        k,
        w,
        scale: ptr(`${p}/weight_scale`, 'f32'),
        bias: withBias ? ptr(`${p}/bias`, 'f32') : 0,
        comp,
      };
    };
    const emb = (p: string): Emb => {
      const e = t[`${p}/weight_scale`];
      const scalePtr = ptr(`${p}/weight_scale`, 'f32');
      const rscale = new Float32Array(e.bytes / 4);
      for (let i = 0; i < rscale.length; i++) rscale[i] = f(1 / arena.f32[(scalePtr >> 2) + i]);
      return { w: ptr(`${p}/weight`, 'i8'), rscale };
    };
    this.encEmb = emb('encoder/embeddings_0');
    this.encEmbNorm = norm('encoder/layernorm_embedding');
    this.encNorm = norm('encoder/layer_norm');
    for (let l = 0; l < header.dims.enc_layers; l++) {
      const p = `encoder/layer_${l}`;
      this.encLayers.push({
        saNorm: norm(`${p}/self_attention/layer_norm`),
        qkv: lin(`${p}/self_attention/linear_0`),
        out: lin(`${p}/self_attention/linear_1`),
        ffNorm: norm(`${p}/ffn/layer_norm`),
        fc1: lin(`${p}/ffn/linear_0`),
        fc2: lin(`${p}/ffn/linear_1`),
      });
    }
    this.decEmb = emb('decoder/embeddings');
    this.decEmbNorm = norm('decoder/layernorm_embedding');
    this.decNorm = norm('decoder/layer_norm');
    for (let l = 0; l < header.dims.dec_layers; l++) {
      const p = `decoder/layer_${l}`;
      this.decLayers.push({
        saNorm: norm(`${p}/self_attention/layer_norm`),
        qkv: lin(`${p}/self_attention/linear_0`),
        out: lin(`${p}/self_attention/linear_1`),
        caNorm: norm(`${p}/attention/layer_norm`),
        q: lin(`${p}/attention/linear_0`),
        kv: lin(`${p}/attention/linear_1`),
        caOut: lin(`${p}/attention/linear_2`),
        ffNorm: norm(`${p}/ffn/layer_norm`),
        fc1: lin(`${p}/ffn/linear_0`),
        fc2: lin(`${p}/ffn/linear_1`),
      });
    }
    this.proj = lin('decoder/projection', false);
    this.positions = ptr('positions', 'f32');
  }
}

// ---------------------------------------------------------------------------------------------------------
// scratch space for one word
// ---------------------------------------------------------------------------------------------------------
interface Scratch {
  rows: number;
  src: number; // source length the layout was made for
  beam: number;
  cap: number;
  x: number;
  h: number;
  ctx: number;
  qkv: number;
  ff: number;
  u8: number;
  rs: number;
  c: number;
  scores: number;
  logits: number;
  memory: number;
  /** per decoder layer: cross-attention keys | values, T rows of 512 floats */
  kv: number[];
  selfK: number[];
  selfV: number[];
  selfK2: number[];
  selfV2: number[];
}

/**
 * Float32 accumulation orders of the sgemm behind q.k and p.v, as established by probing CTranslate2 itself
 * (docs/in-browser/spike/indicxlit.md). oneDNN's AVX2 sgemm splits the query rows into blocks of 6; the last
 * 1-2 rows (non-fused, two accumulators) and 3 rows (fused, two accumulators) have their own micro-kernels, a lone
 * row uses the gemv kernel (8 fused accumulators). Key columns come in blocks of 16 (one fused chain); a remainder
 * of 1-8 keys uses the 8-wide kernel (two fused accumulators).
 *
 * Returns [qkMain, qkTail, qkTailStart, pvMode] for query `row` of `rows` over `keys` keys.
 */
function attentionModes(rows: number, row: number, keys: number): [number, number, number, number] {
  if (rows === 1) return [1, 1, keys, 0];
  const rem = rows % 6;
  if (rem !== 0 && row >= rows - rem) {
    if (rem <= 2) return [2, 2, keys, 1];
    if (rem === 3) return [3, 3, keys, 2];
  }
  const tailStart = keys - (keys % 16);
  const rest = keys - tailStart;
  return rest > 0 && rest <= 8 ? [0, 3, tailStart, 0] : [0, 0, keys, 0];
}

export class IndicXlitModel {
  private readonly w: Weights;
  private readonly sourceIds: Map<string, number>;
  private scratch: Scratch | null = null;
  private persistentTop: number;

  constructor(
    readonly header: Header,
    private readonly arena: Arena,
    base: number,
    private readonly k: Kernels,
  ) {
    for (const [key, v] of Object.entries(EXPECTED_DIMS)) {
      const actual = (header.dims as unknown as Record<string, number>)[key];
      if (actual !== v) throw new Error(`indicxlit: unsupported architecture (${key} = ${actual})`);
    }
    this.w = new Weights(header, arena, base);
    this.sourceIds = new Map(header.source_vocabulary.map((tok, i) => [tok, i]));
    this.persistentTop = arena.top;
  }

  // ------------------------------------------------------------------------------------------- memory layout
  private layout(T: number, beam: number, cap: number): Scratch {
    const s = this.scratch;
    if (s !== null && s.src >= T && s.beam >= beam && s.cap >= cap) return s;
    const a = this.arena;
    a.top = this.persistentTop;
    // Fold the previous layout in first: the row buffers must hold max(T, beam) rows for every call that may
    // reuse this layout, so `rows` is computed from the folded beam, never from the requested one alone.
    const src = Math.max(T, s?.src ?? 0);
    beam = Math.max(beam, s?.beam ?? 0);
    cap = Math.max(cap, s?.cap ?? 0);
    const rows = Math.max(T, beam, s?.rows ?? 0, 4);
    const L = this.header.dims.dec_layers;
    const n: Scratch = {
      rows,
      src,
      beam,
      cap,
      x: a.alloc(rows * D * 4),
      h: a.alloc(rows * D * 4),
      ctx: a.alloc(rows * D * 4),
      qkv: a.alloc(rows * 3 * D * 4),
      ff: a.alloc(rows * 1024 * 4),
      u8: a.alloc(rows * 1024),
      rs: a.alloc(rows * 4),
      c: a.alloc(rows * 1024 * 4),
      scores: a.alloc((Math.max(src, cap) + 16) * 4),
      logits: a.alloc(beam * this.header.dims.target_vocab * 4),
      memory: a.alloc(src * D * 4),
      kv: [],
      selfK: [],
      selfV: [],
      selfK2: [],
      selfV2: [],
    };
    for (let l = 0; l < L; l++) {
      n.kv.push(a.alloc(src * 2 * D * 4));
      n.selfK.push(a.alloc(beam * cap * D * 4));
      n.selfV.push(a.alloc(beam * cap * D * 4));
      n.selfK2.push(a.alloc(beam * cap * D * 4));
      n.selfV2.push(a.alloc(beam * cap * D * 4));
    }
    this.scratch = n;
    return n;
  }

  // ------------------------------------------------------------------------------------------- building blocks
  private dense(lin: Lin, x: number, m: number, out: number, gelu: number, res: number): void {
    const s = this.scratch as Scratch;
    this.k.quantizeRows(x, m, lin.k, s.u8, s.rs);
    this.k.gemm(s.u8, m, lin.w, lin.n, lin.k, lin.comp, s.c);
    this.k.epilogue(s.c, m, lin.n, s.rs, lin.scale, lin.bias, gelu, res, out);
  }

  /**
   * Float32 index of row `pos` of the position table. The table is the model's own (fairseq's float32 sinusoids,
   * copied from model.bin); nothing is ever computed here, because a recomputed row is not bit-identical.
   */
  private positionRow(pos: number): number {
    const rows = this.header.dims.position_rows;
    if (pos >= rows)
      throw new Error(`indicxlit: no position encoding for position ${pos} (the table has ${rows} rows)`);
    return (this.w.positions >> 2) + pos * D;
  }

  // ------------------------------------------------------------------------------------------- encoder
  private *encode(ids: number[], s: Scratch): Steps<void> {
    const w = this.w;
    const k = this.k;
    const a = this.arena;
    const T = ids.length;
    const escale = this.header.scale_embeddings.encoder;
    const f32 = a.f32;
    const i8 = a.i8;
    for (let t = 0; t < T; t++) {
      const row = ids[t];
      const rs = w.encEmb.rscale[row];
      const wb = w.encEmb.w + row * D;
      const xb = (s.x >> 2) + t * D;
      const pb = this.positionRow(t);
      for (let d = 0; d < D; d++) {
        f32[xb + d] = f(f(f(i8[wb + d] * rs) * escale) + f32[pb + d]);
      }
    }
    k.layerNorm(s.x, T, D, w.encEmbNorm.gamma, w.encEmbNorm.beta, s.x);
    for (const L of w.encLayers) {
      yield;
      k.layerNorm(s.x, T, D, L.saNorm.gamma, L.saNorm.beta, s.h);
      this.dense(L.qkv, s.h, T, s.qkv, 0, 0);
      for (let hd = 0; hd < NH; hd++) {
        yield; // self attention is quadratic in T: a pause point per head keeps long inputs cancellable
        for (let i = 0; i < T; i++) {
          const [qm, qt, qs, pv] = attentionModes(T, i, T);
          k.attendHead(
            s.qkv + (i * 3 * D + hd * DH) * 4,
            s.qkv + (D + hd * DH) * 4,
            s.qkv + (2 * D + hd * DH) * 4,
            3 * D,
            T,
            s.ctx + (i * D + hd * DH) * 4,
            s.scores,
            qm,
            qt,
            qs,
            pv,
          );
        }
      }
      this.dense(L.out, s.ctx, T, s.x, 0, s.x);
      yield;
      k.layerNorm(s.x, T, D, L.ffNorm.gamma, L.ffNorm.beta, s.h);
      this.dense(L.fc1, s.h, T, s.ff, 1, 0);
      this.dense(L.fc2, s.ff, T, s.x, 0, s.x);
    }
    k.layerNorm(s.x, T, D, w.encNorm.gamma, w.encNorm.beta, s.memory);
    // keys and values of the encoder-attention layers (computed once per word)
    k.quantizeRows(s.memory, T, D, s.u8, s.rs);
    for (let l = 0; l < w.decLayers.length; l++) {
      const lin = w.decLayers[l].kv;
      k.gemm(s.u8, T, lin.w, lin.n, lin.k, lin.comp, s.c);
      k.epilogue(s.c, T, lin.n, s.rs, lin.scale, lin.bias, 0, 0, s.kv[l]);
    }
  }

  // ------------------------------------------------------------------------------------------- decoder
  /** One decoder step for R hypotheses; the raw logits end up in s.logits (R rows of target_vocab floats). */
  private decodeStep(tokens: Int32Array, R: number, step: number, T: number, s: Scratch): void {
    const w = this.w;
    const k = this.k;
    const a = this.arena;
    const escale = this.header.scale_embeddings.decoder;
    const f32 = a.f32;
    const i8 = a.i8;
    const pb = this.positionRow(step);
    for (let r = 0; r < R; r++) {
      const row = tokens[r];
      const rs = w.decEmb.rscale[row];
      const wb = w.decEmb.w + row * D;
      const xb = (s.x >> 2) + r * D;
      for (let d = 0; d < D; d++) {
        f32[xb + d] = f(f(f(i8[wb + d] * rs) * escale) + f32[pb + d]);
      }
    }
    k.layerNorm(s.x, R, D, w.decEmbNorm.gamma, w.decEmbNorm.beta, s.x);
    if (step >= s.cap) throw new CapacityError();
    const [sm, st, ss, sp] = attentionModes(1, 0, step + 1);
    for (let l = 0; l < w.decLayers.length; l++) {
      const L = w.decLayers[l];
      // masked self attention over the cache of each hypothesis
      k.layerNorm(s.x, R, D, L.saNorm.gamma, L.saNorm.beta, s.h);
      this.dense(L.qkv, s.h, R, s.qkv, 0, 0);
      const K = s.selfK[l];
      const V = s.selfV[l];
      for (let r = 0; r < R; r++) {
        const src = (s.qkv >> 2) + r * 3 * D;
        const dst = (K >> 2) + (r * s.cap + step) * D;
        f32.copyWithin(dst, src + D, src + 2 * D);
        f32.copyWithin((V >> 2) + (r * s.cap + step) * D, src + 2 * D, src + 3 * D);
        for (let hd = 0; hd < NH; hd++) {
          k.attendHead(
            s.qkv + (r * 3 * D + hd * DH) * 4,
            K + (r * s.cap * D + hd * DH) * 4,
            V + (r * s.cap * D + hd * DH) * 4,
            D,
            step + 1,
            s.ctx + (r * D + hd * DH) * 4,
            s.scores,
            sm,
            st,
            ss,
            sp,
          );
        }
      }
      this.dense(L.out, s.ctx, R, s.x, 0, s.x);
      // attention over the encoder output
      k.layerNorm(s.x, R, D, L.caNorm.gamma, L.caNorm.beta, s.h);
      this.dense(L.q, s.h, R, s.qkv, 0, 0);
      for (let r = 0; r < R; r++) {
        const [qm, qt, qs, pv] = attentionModes(R, r, T);
        for (let hd = 0; hd < NH; hd++) {
          k.attendHead(
            s.qkv + (r * D + hd * DH) * 4,
            s.kv[l] + hd * DH * 4,
            s.kv[l] + (D + hd * DH) * 4,
            2 * D,
            T,
            s.ctx + (r * D + hd * DH) * 4,
            s.scores,
            qm,
            qt,
            qs,
            pv,
          );
        }
      }
      this.dense(L.caOut, s.ctx, R, s.x, 0, s.x);
      // feed forward
      k.layerNorm(s.x, R, D, L.ffNorm.gamma, L.ffNorm.beta, s.h);
      this.dense(L.fc1, s.h, R, s.ff, 1, 0);
      this.dense(L.fc2, s.ff, R, s.x, 0, s.x);
    }
    k.layerNorm(s.x, R, D, w.decNorm.gamma, w.decNorm.beta, s.h);
    this.dense(w.proj, s.h, R, s.logits, 0, 0);
  }

  // ------------------------------------------------------------------------------------------- search
  private *greedy(
    T: number,
    maxLen: number,
    eos: number,
    s: Scratch,
    scored: { score: number } | null = null,
  ): Steps<number[]> {
    const V = this.header.dims.target_vocab;
    const out: number[] = [];
    const tokens = new Int32Array(1);
    tokens[0] = eos;
    const lg = this.arena.f32.subarray(s.logits >> 2, (s.logits >> 2) + V);
    let total = 0;
    let length = 0;
    for (let step = 0; step < maxLen; step++) {
      yield;
      this.decodeStep(tokens, 1, step, T, s);
      if (step < 1) lg[eos] = LOWEST; // minimum decoding length 1
      let best = 0;
      for (let v = 1; v < V; v++) if (lg[v] > lg[best]) best = v;
      if (scored !== null) {
        logSoftmaxRow(lg, 0, V);
        total = f(total + lg[best]);
        length++;
      }
      if (best !== eos) out.push(best);
      if (best === eos || step + 1 === maxLen) break;
      tokens[0] = best;
    }
    if (scored !== null) scored.score = f(total / length);
    return out;
  }

  private *beamSearch(
    T: number,
    beam: number,
    maxLen: number,
    eos: number,
    s: Scratch,
    scored: { score: number; finished?: { score: number; text: string }[] } | null = null,
  ): Steps<number[]> {
    const V = this.header.dims.target_vocab;
    const ncand = beam * 2;
    const finished: { score: number; tokens: number[] }[] = [];
    let R = 1;
    let tokens = new Int32Array(beam);
    tokens[0] = eos;
    let seqs: number[][] = [[]];
    let cum: Float32Array | null = null;
    const candVal = new Float64Array(ncand);
    const candIdx = new Int32Array(ncand);
    const lg = this.arena.f32.subarray(s.logits >> 2, (s.logits >> 2) + beam * V);
    for (let step = 0; step < maxLen; step++) {
      yield;
      this.decodeStep(tokens, R, step, T, s);
      for (let r = 0; r < R; r++) {
        if (step < 1) lg[r * V + eos] = LOWEST;
        logSoftmaxRow(lg, r * V, V);
        if (cum !== null) {
          const c = cum[r];
          for (let v = 0; v < V; v++) lg[r * V + v] = f(lg[r * V + v] + c);
        }
      }
      // top 2*beam candidates over the flattened [R * V] scores, ties resolved towards the lower index
      let count = 0;
      const total = R * V;
      for (let i = 0; i < total; i++) {
        const val = lg[i];
        let pos: number;
        if (count < ncand) {
          pos = count++;
        } else if (val > candVal[ncand - 1]) {
          pos = ncand - 1;
        } else {
          continue;
        }
        while (pos > 0 && val > candVal[pos - 1]) {
          candVal[pos] = candVal[pos - 1];
          candIdx[pos] = candIdx[pos - 1];
          pos--;
        }
        candVal[pos] = val;
        candIdx[pos] = i;
      }
      const isLast = step + 1 === maxLen;
      const origin = new Int32Array(beam);
      const nextTok = new Int32Array(beam);
      const nextScore = new Float32Array(beam);
      let sec = beam;
      for (let k = 0; k < beam; k++) {
        const flat = candIdx[k];
        const tok = flat % V;
        let use = k;
        if (tok === eos || isLast) {
          finished.push({ score: candVal[k], tokens: [...seqs[Math.floor(flat / V)], tok] });
          for (let j = sec; j < ncand; j++) {
            if (candIdx[j] % V !== eos) {
              use = j;
              sec = j + 1;
              break;
            }
          }
        }
        origin[k] = Math.floor(candIdx[use] / V);
        nextTok[k] = candIdx[use] % V;
        nextScore[k] = candVal[use];
      }
      if (isLast || finished.length >= beam) break;
      // reorder the caches to follow the surviving hypotheses
      const len = (step + 1) * D;
      const f32 = this.arena.f32;
      for (let l = 0; l < s.selfK.length; l++) {
        for (let k = 0; k < beam; k++) {
          const from = origin[k] * s.cap * D;
          const to = k * s.cap * D;
          f32.copyWithin(
            (s.selfK2[l] >> 2) + to,
            (s.selfK[l] >> 2) + from,
            (s.selfK[l] >> 2) + from + len,
          );
          f32.copyWithin(
            (s.selfV2[l] >> 2) + to,
            (s.selfV[l] >> 2) + from,
            (s.selfV[l] >> 2) + from + len,
          );
        }
        [s.selfK[l], s.selfK2[l]] = [s.selfK2[l], s.selfK[l]];
        [s.selfV[l], s.selfV2[l]] = [s.selfV2[l], s.selfV[l]];
      }
      const newSeqs: number[][] = [];
      for (let k = 0; k < beam; k++) newSeqs.push([...seqs[origin[k]], nextTok[k]]);
      seqs = newSeqs;
      tokens = nextTok;
      cum = nextScore;
      R = beam;
    }
    // length-normalised score = log-prob sum / length (length counts a final </s>); first best wins
    let best = -1;
    let bestScore = -Infinity;
    for (let i = 0; i < finished.length; i++) {
      const score = f(finished[i].score / finished[i].tokens.length);
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
    const toks = finished[best].tokens;
    while (toks.length > 0 && toks[toks.length - 1] === eos) toks.pop();
    if (scored !== null) {
      scored.score = bestScore;
      scored.finished = finished.map((x) => ({
        score: f(x.score / x.tokens.length),
        text: x.tokens
          .filter((t) => t !== eos)
          .map((t) => this.header.target_vocabulary[t])
          .join(''),
      }));
    }
    return toks;
  }

  /**
   * Convert one NFC-normalised word, as a sequence of steps: the generator pauses before every encoder layer and
   * decoder step (where the caller may yield to the event loop or abandon it) and returns the Roman spelling.
   */
  *translateWordSteps(
    nfc: string,
    beam: number,
    maxLen: number,
    scored: { score: number; finished?: { score: number; text: string }[] } | null = null,
  ): Steps<string> {
    const h = this.header;
    const eos = h.specials.eos;
    const unk = h.specials.unk;
    const ids: number[] = [this.sourceIds.get(h.language_token) ?? unk];
    for (const ch of nfc) ids.push(this.sourceIds.get(ch) ?? unk);
    ids.push(eos);
    // CTranslate2's input truncation (max_input_length = 1024 tokens, the length of the position table): the
    // language token and the first 1,022 symbols are kept and the sequence still ends with </s>.
    const maxIn = h.decoding_defaults.max_input_length;
    if (ids.length > maxIn) {
      ids.length = maxIn;
      ids[maxIn - 1] = eos;
    }
    const T = ids.length;
    // Most words produce fewer than 32 symbols, so the hypothesis caches are sized for that; the rare word that needs
    // more is simply decoded again with room for the full maximum length.
    let cap = Math.min(maxLen, SOFT_CAP);
    for (;;) {
      try {
        const s = this.layout(T, beam, cap);
        yield* this.encode(ids, s);
        let out: number[];
        if (beam === 1) out = yield* this.greedy(T, maxLen, eos, s, scored);
        else out = yield* this.beamSearch(T, beam, maxLen, eos, s, scored);
        return out.map((i) => h.target_vocabulary[i]).join('');
      } catch (error) {
        if (!(error instanceof CapacityError) || cap >= maxLen) throw error;
        cap = maxLen;
      }
    }
  }

  /** Convert one NFC-normalised word in one go. */
  translateWord(
    nfc: string,
    beam: number,
    maxLen: number,
    scored: { score: number; finished?: { score: number; text: string }[] } | null = null,
  ): string {
    const steps = this.translateWordSteps(nfc, beam, maxLen, scored);
    for (;;) {
      const next = steps.next();
      if (next.done) return next.value;
    }
  }
}

// ---------------------------------------------------------------------------------------------------------
// public API
// ---------------------------------------------------------------------------------------------------------
export class Runtime implements IndicXlit {
  model: IndicXlitModel | null;
  private readonly base: Omit<IndicXlitInfo, 'memoryBytes' | 'wordCacheEntries'>;
  /** A transliterateAsync() call is paused mid-word; the scratch memory is its until it finishes. */
  private busy = false;

  constructor(
    model: IndicXlitModel,
    base: Omit<IndicXlitInfo, 'memoryBytes' | 'wordCacheEntries'>,
    private readonly cache: Map<string, string> | null = null,
    private readonly arena: Arena | null = null,
  ) {
    this.model = model;
    this.base = base;
  }

  get info(): IndicXlitInfo {
    return {
      ...this.base,
      wordCacheEntries: this.cache?.size ?? 0,
      memoryBytes: this.model === null ? 0 : (this.arena?.buffer.byteLength ?? 0),
    };
  }

  /** Validate the options and pick the word cache when the settings are the ones it was made for. */
  private settings(options: TransliterateOptions): {
    model: IndicXlitModel;
    beam: number;
    maxLen: number;
    cache: Map<string, string> | null;
  } {
    const model = this.model;
    if (model === null) throw new Error('IndicXlit has been disposed');
    if (this.busy) throw new Error('indicxlit: a transliterateAsync() call is still running on this instance');
    const beam = options.beamSize ?? model.header.decoding_defaults.beam_size;
    if (!Number.isInteger(beam) || beam < 1 || beam > MAX_BEAM) {
      throw new RangeError(`beamSize must be an integer from 1 to ${MAX_BEAM}`);
    }
    const maxLen = options.maxDecodingLength ?? model.header.decoding_defaults.max_decoding_length;
    if (!Number.isInteger(maxLen) || maxLen < 1)
      throw new RangeError('maxDecodingLength must be a positive integer');
    const defaults = model.header.decoding_defaults;
    const cache =
      beam === defaults.beam_size && maxLen === defaults.max_decoding_length ? this.cache : null;
    return { model, beam, maxLen, cache };
  }

  transliterate(words: string[], options: TransliterateOptions = {}): string[] {
    const { model, beam, maxLen, cache } = this.settings(options);
    const memo = new Map<string, string>();
    return words.map((word) => {
      const nfc = word.normalize('NFC');
      let out = memo.get(nfc);
      if (out === undefined) {
        out = cache?.get(nfc) ?? model.translateWord(nfc, beam, maxLen);
        memo.set(nfc, out);
      }
      return out;
    });
  }

  async transliterateAsync(
    words: string[],
    options: AsyncTransliterateOptions = {},
  ): Promise<string[]> {
    const { model, beam, maxLen, cache } = this.settings(options);
    const isCancelled = options.isCancelled ?? (() => false);
    const yieldNow =
      options.yieldNow ?? (() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
    const now = options.now ?? (() => performance.now());
    const sliceMs = options.sliceMs ?? SLICE_MS;
    this.busy = true;
    try {
      const memo = new Map<string, string>();
      const out: string[] = [];
      let sliceStart = now();
      for (const word of words) {
        const nfc = word.normalize('NFC');
        let result = memo.get(nfc) ?? cache?.get(nfc);
        if (result === undefined) {
          const steps = model.translateWordSteps(nfc, beam, maxLen);
          for (;;) {
            if (isCancelled()) throw abortError();
            if (now() - sliceStart >= sliceMs) {
              await yieldNow();
              sliceStart = now();
              if (this.model === null) throw new Error('IndicXlit has been disposed');
              if (isCancelled()) throw abortError();
            }
            const next = steps.next();
            if (next.done) {
              result = next.value;
              break;
            }
          }
          memo.set(nfc, result);
        }
        out.push(result);
      }
      return out;
    } finally {
      this.busy = false;
    }
  }

  /** Test hook: the converted word and the length-normalised log-probability CTranslate2 reports as `score`. */
  scoreWord(
    word: string,
    beamSize = 4,
  ): { text: string; score: number; finished?: { score: number; text: string }[] } {
    if (this.model === null) throw new Error('IndicXlit has been disposed');
    const scored: { score: number; finished?: { score: number; text: string }[] } = { score: 0 };
    const text = this.model.translateWord(
      word.normalize('NFC'),
      beamSize,
      this.model.header.decoding_defaults.max_decoding_length,
      scored,
    );
    return { text, score: scored.score, finished: scored.finished };
  }

  dispose(): void {
    this.model = null;
  }
}

function checkHeader(header: Header): void {
  if (header.format !== FORMAT)
    throw new Error(`indicxlit: unsupported asset format ${header.format}`);
}

async function makeKernels(
  arena: Arena,
  memory: WebAssembly.Memory | null,
  options: LoadOptions,
): Promise<Kernels> {
  if (!options.forceJs && memory !== null) {
    const wasm = await createWasmKernels(memory, { allowSimd: !options.disableSimd });
    if (wasm !== null) return wasm;
  }
  return new JsKernels(arena);
}

function newArena(
  binBytes: number,
  options: LoadOptions,
): { arena: Arena; memory: WebAssembly.Memory | null } {
  let memory: WebAssembly.Memory | null = null;
  if (!options.forceJs && typeof WebAssembly !== 'undefined') {
    memory = new WebAssembly.Memory({ initial: Math.ceil((RESERVED + binBytes) / PAGE) + 1 });
  }
  return { arena: new Arena(memory), memory };
}

/** Build a runtime from already fetched assets (tests, Node, custom loaders). */
export async function fromBuffers(
  headerJson: string | object,
  bin: ArrayBuffer,
  options: LoadOptions = {},
): Promise<Runtime> {
  const t0 = performance.now();
  const header = (typeof headerJson === 'string' ? JSON.parse(headerJson) : headerJson) as Header;
  checkHeader(header);
  if (bin.byteLength !== header.bin.bytes)
    throw new Error('indicxlit: indicxlit.bin has the wrong size (truncated download?)');
  const { arena, memory } = newArena(bin.byteLength, options);
  const base = arena.alloc(bin.byteLength);
  arena.u8.set(new Uint8Array(bin), base);
  return finish(header, arena, memory, base, options, t0);
}

async function finish(
  header: Header,
  arena: Arena,
  memory: WebAssembly.Memory | null,
  base: number,
  options: LoadOptions,
  t0: number,
): Promise<Runtime> {
  const kernels = await makeKernels(arena, memory, options);
  const model = new IndicXlitModel(header, arena, base, kernels);
  const defaults = header.decoding_defaults;
  const cache =
    options.wordCache !== false && options.wordCacheText
      ? parseWordCache(options.wordCacheText, header.bin.sha256, {
          beam: defaults.beam_size,
          maxDecodingLength: defaults.max_decoding_length,
        })
      : null;
  return new Runtime(
    model,
    {
      format: header.format,
      binBytes: header.bin.bytes,
      kernel: kernels.name,
      loadMs: performance.now() - t0,
    },
    cache,
    arena,
  );
}

async function sha256Hex(data: Uint8Array): Promise<string | null> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return null;
  const digest = new Uint8Array(await subtle.digest('SHA-256', data as BufferSource));
  return Array.from(digest, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Download the model assets from `assetBaseUrl` (a folder containing indicxlit.json and indicxlit.bin) and
 * prepare the runtime. Nothing is fetched again once loaded: conversion needs no network.
 */
export async function load(assetBaseUrl: string, options: LoadOptions = {}): Promise<IndicXlit> {
  const t0 = performance.now();
  const base = assetBaseUrl.endsWith('/') ? assetBaseUrl : `${assetBaseUrl}/`;
  const doFetch = options.fetch ?? globalThis.fetch.bind(globalThis);
  const headUrl = `${base}indicxlit.json`;
  const headRes = await doFetch(headUrl);
  if (!headRes.ok) throw new Error(`indicxlit: cannot fetch ${headUrl} (${headRes.status})`);
  const header = await readHeader(headRes, headUrl);
  checkHeader(header);
  const cacheFetch =
    options.wordCache === false
      ? null
      : doFetch(`${base}wordcache.tsv`)
          .then((r) => (r.ok ? r.text() : ''))
          .catch(() => '');
  const total = header.bin.bytes;
  const { arena, memory } = newArena(total, options);
  const ptr = arena.alloc(total);
  const url = `${base}${header.bin.file}`;
  await download(doFetch(url), arena, ptr, total, options.onProgress);
  if (options.verify !== false) {
    let digest = await sha256Hex(arena.u8.subarray(ptr, ptr + total));
    if (digest !== null && digest !== header.bin.sha256) {
      // A stale copy in the HTTP cache (new indicxlit.json, old indicxlit.bin): fetch it again, bypassing the cache.
      await download(
        doFetch(`${url}?v=${header.bin.sha256.slice(0, 8)}`, { cache: 'reload' }),
        arena,
        ptr,
        total,
        options.onProgress,
      );
      digest = await sha256Hex(arena.u8.subarray(ptr, ptr + total));
      if (digest !== header.bin.sha256)
        throw new Error('indicxlit: indicxlit.bin failed its SHA-256 check');
    }
  }
  const wordCacheText = cacheFetch ? await cacheFetch : '';
  return finish(header, arena, memory, ptr, { ...options, wordCacheText }, t0);
}

/**
 * Parse the header response. A wrong asset base URL on a single-page app typically answers every path with the
 * app's index.html and status 200; that must read as a configuration error, not as a JSON SyntaxError.
 */
async function readHeader(res: Response, url: string): Promise<Header> {
  const notHeader = (): Error => new Error(`indicxlit: ${url} is not the model header`);
  const type = res.headers?.get?.('content-type') ?? '';
  if (/text\/html/i.test(type)) throw notHeader();
  let parsed: unknown;
  try {
    parsed = await res.json();
  } catch {
    throw notHeader();
  }
  if (!parsed || typeof parsed !== 'object' || typeof (parsed as Header).format !== 'string')
    throw notHeader();
  return parsed as Header;
}

/** Stream a response straight into the arena (no second 12 MB copy). */
async function download(
  pending: Promise<Response>,
  arena: Arena,
  ptr: number,
  total: number,
  onProgress?: (received: number, total: number) => void,
): Promise<void> {
  const res = await pending;
  if (!res.ok) throw new Error(`indicxlit: cannot fetch indicxlit.bin (${res.status})`);
  if (res.body) {
    const reader = res.body.getReader();
    let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (received + value.length > total)
        throw new Error('indicxlit: indicxlit.bin is larger than its header says');
      arena.u8.set(value, ptr + received);
      received += value.length;
      onProgress?.(received, total);
    }
    if (received !== total) throw new Error('indicxlit: indicxlit.bin download is incomplete');
  } else {
    const all = new Uint8Array(await res.arrayBuffer());
    if (all.length !== total) throw new Error('indicxlit: indicxlit.bin has the wrong size');
    arena.u8.set(all, ptr);
    onProgress?.(total, total);
  }
}
