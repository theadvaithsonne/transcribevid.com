/**
 * Numeric kernels of the IndicXlit runtime.
 *
 * Two interchangeable implementations of the same contract:
 *   - WasmKernels : the AssemblyScript module compiled to WebAssembly (SIMD when the browser has it), the fast path
 *   - JsKernels   : portable TypeScript built on float32.ts, used when WebAssembly is unavailable and as the
 *                   reference the WebAssembly build is tested against (identical results, bit for bit)
 *
 * All pointers are byte offsets into one shared memory, so the model code does not care which one runs.
 */
import {
  geluCt2,
  layerNorm as layerNormRef,
  quantizeRows as quantizeRowsRef,
  softmaxRow,
} from './float32';
import { WASM_SCALAR_BASE64, WASM_SIMD_BASE64 } from './indicxlit-kernels.wasm';

const f = Math.fround;

export interface Kernels {
  readonly name: 'wasm-simd' | 'wasm' | 'js';
  /** u8[r][j] = round(x * 127 / amax + 128); rscale[r] = amax / 127 (the dequantisation factor). */
  quantizeRows(x: number, m: number, k: number, u8: number, rscale: number): void;
  /** c[r][j] = pair-saturated u8 . s8 dot product + comp[j]  (oneDNN AVX2 u8s8s32 semantics). */
  gemm(u: number, m: number, w: number, n: number, k: number, comp: number, c: number): void;
  /** out = [gelu](c * rscale[r] / scale[j] + bias[j]) [+ res]; bias and res are 0 when absent. */
  epilogue(
    c: number,
    m: number,
    n: number,
    rscale: number,
    scale: number,
    bias: number,
    gelu: number,
    res: number,
    out: number,
  ): void;
  layerNorm(x: number, m: number, n: number, gamma: number, beta: number, out: number): void;
  /**
   * One query row and one head over `keys` rows of 64 floats (row stride `stride` floats). qkMain / qkTail select the
   * dot-product accumulation order for the keys before / from qkTailStart, pvMode the one of the context sum.
   */
  attendHead(
    q: number,
    K: number,
    V: number,
    stride: number,
    keys: number,
    out: number,
    scores: number,
    qkMain: number,
    qkTail: number,
    qkTailStart: number,
    pvMode: number,
  ): void;
}

export interface Memory {
  readonly buffer: ArrayBuffer;
}

// ---------------------------------------------------------------------------------------------------------
// portable TypeScript implementation
// ---------------------------------------------------------------------------------------------------------
export class JsKernels implements Kernels {
  readonly name = 'js' as const;
  constructor(private readonly mem: Memory) {}

  private get f32(): Float32Array {
    return new Float32Array(this.mem.buffer);
  }

  quantizeRows(x: number, m: number, k: number, u8: number, rscale: number): void {
    const buf = this.mem.buffer;
    quantizeRowsRef(
      new Float32Array(buf),
      x >> 2,
      m,
      k,
      new Uint8Array(buf),
      u8,
      new Float32Array(buf, rscale, m),
    );
  }

  gemm(u: number, m: number, w: number, n: number, k: number, comp: number, c: number): void {
    const buf = this.mem.buffer;
    const U = new Uint8Array(buf);
    const W = new Int8Array(buf);
    const COMP = new Int32Array(buf);
    const C = new Int32Array(buf);
    const cb = c >> 2;
    for (let j = 0; j < n; j++) {
      const wb = w + j * k;
      const cj = COMP[(comp >> 2) + j];
      for (let r = 0; r < m; r++) {
        const ub = u + r * k;
        let acc = 0;
        for (let t = 0; t < k; t += 2) {
          let s = U[ub + t] * W[wb + t] + U[ub + t + 1] * W[wb + t + 1];
          if (s > 32767) s = 32767;
          else if (s < -32768) s = -32768;
          acc += s;
        }
        C[cb + r * n + j] = acc + cj;
      }
    }
  }

  epilogue(
    c: number,
    m: number,
    n: number,
    rscale: number,
    scale: number,
    bias: number,
    gelu: number,
    res: number,
    out: number,
  ): void {
    const F = this.f32;
    const C = new Int32Array(this.mem.buffer);
    for (let r = 0; r < m; r++) {
      const rs = F[(rscale >> 2) + r];
      for (let j = 0; j < n; j++) {
        const idx = r * n + j;
        let y = f(f(C[(c >> 2) + idx] * rs) / F[(scale >> 2) + j]);
        if (bias !== 0) y = f(y + F[(bias >> 2) + j]);
        if (gelu !== 0) y = geluCt2(y);
        if (res !== 0) y = f(F[(res >> 2) + idx] + y);
        F[(out >> 2) + idx] = y;
      }
    }
  }

  layerNorm(x: number, m: number, n: number, gamma: number, beta: number, out: number): void {
    const F = this.f32;
    const g = F.subarray(gamma >> 2, (gamma >> 2) + n);
    const b = F.subarray(beta >> 2, (beta >> 2) + n);
    for (let r = 0; r < m; r++) layerNormRef(F, (x >> 2) + r * n, g, b, F, (out >> 2) + r * n, n);
  }

  attendHead(
    q: number,
    K: number,
    V: number,
    stride: number,
    keys: number,
    out: number,
    scores: number,
    qkMain: number,
    qkTail: number,
    qkTailStart: number,
    pvMode: number,
  ): void {
    const F = this.f32;
    const qi = q >> 2;
    const sc = new Float64Array(keys);
    for (let j = 0; j < keys; j++) {
      sc[j] = f(dot64(F, qi, (K >> 2) + j * stride, j < qkTailStart ? qkMain : qkTail) * 0.125);
    }
    softmaxRow(sc, 0, keys);
    const vi = V >> 2;
    const mode = pvMode & 3;
    // p.v through the sgemm driver (flag 4): keys in blocks of 256 (the last 1-2 blocks halved), each block summed
    // from zero and added to C; without the flag (gemv) one block
    const blocks: number[] = [];
    for (let b = 0; b < keys; ) {
      let size = keys - b;
      if ((pvMode & 4) !== 0) {
        if (size >= 512) size = 256;
        else if (size > 256) size = (size + 1) >> 1;
      }
      blocks.push(b, b + size);
      b += size;
    }
    for (let d = 0; d < 64; d++) {
      let total = 0;
      for (let bi = 0; bi < blocks.length; bi += 2) {
        const from = blocks[bi];
        const to = blocks[bi + 1];
        let acc: number;
        if (mode === 0) {
          acc = 0;
          for (let j = from; j < to; j++) acc = f(acc + sc[j] * F[vi + j * stride + d]);
        } else {
          // two interleaved accumulators over an even prefix; an odd last key is added after the lanes are summed
          let e = 0;
          let o = 0;
          const pairs = from + ((to - from) & ~1);
          for (let j = from; j < pairs; j++) {
            const prod = sc[j] * F[vi + j * stride + d];
            if (((j - from) & 1) === 0) e = mode === 1 ? f(e + f(prod)) : f(e + prod);
            else o = mode === 1 ? f(o + f(prod)) : f(o + prod);
          }
          acc = f(e + o);
          if (pairs !== to) {
            const prod = sc[pairs] * F[vi + pairs * stride + d];
            acc = mode === 1 ? f(acc + f(prod)) : f(acc + prod);
          }
        }
        total = bi === 0 ? acc : f(total + acc);
      }
      F[(out >> 2) + d] = total;
    }
    void scores;
  }
}

/** 64-element dot product in the accumulation order selected by `mode` (see kernels.as.ts for the meaning). */
function dot64(F: Float32Array, a: number, b: number, mode: number): number {
  if (mode === 1) {
    const l = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let t = 0; t < 64; t += 8) {
      for (let i = 0; i < 8; i++) l[i] = f(l[i] + F[a + t + i] * F[b + t + i]);
    }
    return f(f(f(l[0] + l[1]) + f(l[4] + l[5])) + f(f(l[2] + l[3]) + f(l[6] + l[7])));
  }
  if (mode === 2) {
    let e = 0;
    let o = 0;
    for (let t = 0; t < 64; t += 2) {
      e = f(e + f(F[a + t] * F[b + t]));
      o = f(o + f(F[a + t + 1] * F[b + t + 1]));
    }
    return f(e + o);
  }
  if (mode === 3) {
    let e = 0;
    let o = 0;
    for (let t = 0; t < 64; t += 2) {
      e = f(e + F[a + t] * F[b + t]);
      o = f(o + F[a + t + 1] * F[b + t + 1]);
    }
    return f(e + o);
  }
  let acc = 0;
  for (let t = 0; t < 64; t++) acc = f(acc + F[a + t] * F[b + t]);
  return acc;
}

// ---------------------------------------------------------------------------------------------------------
// WebAssembly implementation
// ---------------------------------------------------------------------------------------------------------
interface KernelExports {
  quantizeRows(x: number, m: number, k: number, u8: number, rscale: number): void;
  gemm(u: number, m: number, w: number, n: number, k: number, comp: number, c: number): void;
  epilogue(
    c: number,
    m: number,
    n: number,
    rscale: number,
    scale: number,
    bias: number,
    gelu: number,
    res: number,
    out: number,
  ): void;
  layerNorm(x: number, m: number, n: number, gamma: number, beta: number, out: number): void;
  attendHead(
    q: number,
    K: number,
    V: number,
    stride: number,
    keys: number,
    out: number,
    scores: number,
    qkMain: number,
    qkTail: number,
    qkTailStart: number,
    pvMode: number,
  ): void;
}

function decodeBase64(text: string): Uint8Array {
  const raw = atob(text);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/** Instantiate the kernel module on `memory`, preferring the SIMD build. Returns null when WebAssembly cannot run it. */
export async function createWasmKernels(
  memory: WebAssembly.Memory,
  options: { allowSimd?: boolean } = {},
): Promise<Kernels | null> {
  if (typeof WebAssembly === 'undefined') return null;
  const candidates: { name: 'wasm-simd' | 'wasm'; bytes: string }[] = [];
  if (options.allowSimd !== false) candidates.push({ name: 'wasm-simd', bytes: WASM_SIMD_BASE64 });
  candidates.push({ name: 'wasm', bytes: WASM_SCALAR_BASE64 });
  for (const c of candidates) {
    try {
      const module = await WebAssembly.compile(decodeBase64(c.bytes) as BufferSource);
      const instance = await WebAssembly.instantiate(module, { env: { memory } });
      const k = instance.exports as unknown as KernelExports;
      return {
        name: c.name,
        quantizeRows: k.quantizeRows,
        gemm: k.gemm,
        epilogue: k.epilogue,
        layerNorm: k.layerNorm,
        attendHead: k.attendHead,
      };
    } catch {
      // this build is not supported by the browser: try the next one
    }
  }
  return null;
}
