/**
 * Single-precision primitives that reproduce, bit for bit, what CTranslate2 4.8 computes on an AVX2 CPU
 * (Cephes `exp`, the Abramowitz-Stegun `erf` used by its vectorised GELU, the 16-accumulator layer norm,
 * the 8-lane softmax / log-softmax reductions).
 *
 * Every function takes and returns values that are already float32 (numbers produced by a Float32Array
 * read or by `Math.fround`) and rounds after each IEEE operation exactly where the C++ code does, so the
 * TypeScript model makes the same decisions as the server's model instead of merely similar ones.
 * Each routine was verified against CTranslate2 itself (see docs/in-browser/spike/indicxlit.md).
 */

const f = Math.fround;

// ---------------------------------------------------------------------------------------------------------
// exp: third_party/avx_mathfun.h exp256_ps (no FMA)
// ---------------------------------------------------------------------------------------------------------
const EXP_HI = f(88.3762626647949);
const EXP_LO = f(-88.3762626647949);
const LOG2EF = f(1.44269504088896341);
const EXP_C1 = f(0.693359375);
const EXP_C2 = f(-2.1219444e-4);
const EXP_P0 = f(1.98756915e-4);
const EXP_P1 = f(1.3981999507e-3);
const EXP_P2 = f(8.3334519073e-3);
const EXP_P3 = f(4.1665795894e-2);
const EXP_P4 = f(1.6666665459e-1);
const EXP_P5 = f(5.0000001201e-1);

/** 2^(n-127) for the biased exponent n, with n = 0 -> +0 (what `(n << 23)` reinterpreted as float gives). */
const POW2N = new Float64Array(256);
for (let n = 1; n < 255; n++) POW2N[n] = Math.pow(2, n - 127);

export function exp256(x: number): number {
  if (x > EXP_HI) x = EXP_HI;
  if (x < EXP_LO) x = EXP_LO;
  const fx = Math.floor(f(f(x * LOG2EF) + 0.5));
  x = f(x - f(fx * EXP_C1));
  x = f(x - f(fx * EXP_C2));
  const z = f(x * x);
  let y = EXP_P0;
  y = f(f(y * x) + EXP_P1);
  y = f(f(y * x) + EXP_P2);
  y = f(f(y * x) + EXP_P3);
  y = f(f(y * x) + EXP_P4);
  y = f(f(y * x) + EXP_P5);
  y = f(y * z);
  y = f(y + x);
  y = f(y + 1);
  return f(y * POW2N[fx + 127]);
}

// ---------------------------------------------------------------------------------------------------------
// GELU: vec_erf (PyTorch / Abramowitz-Stegun 7.1.26 with FMA) inside the exact-GELU formula
// ---------------------------------------------------------------------------------------------------------
const ERF_P = f(0.3275911);
const ERF_P1 = f(0.254829592);
const ERF_P2 = f(-0.284496736);
const ERF_P3 = f(1.421413741);
const ERF_P4 = f(-1.453152027);
const ERF_P5 = f(1.061405429);
const INV_SQRT2 = f(0.7071067811865475);

export function erfCt2(a: number): number {
  const negative = a < 0 || (a === 0 && 1 / a < 0);
  const abs = negative ? -a : a;
  const t = f(1 / f(ERF_P * abs + 1)); // fma(p, |a|, 1)
  let r = f(ERF_P5 * t + ERF_P4);
  r = f(r * t + ERF_P3);
  r = f(r * t + ERF_P2);
  r = f(r * t + ERF_P1);
  const e = exp256(-f(a * a));
  const tmp = f(-e * t);
  const res = f(tmp * r + 1); // fma(tmp, r, 1)
  return negative ? -res : res;
}

export function geluCt2(v: number): number {
  const u = f(INV_SQRT2 * v);
  const w = f(1 + erfCt2(u));
  return f(0.5 * f(v * w));
}

// ---------------------------------------------------------------------------------------------------------
// layer norm: sums use 16 interleaved accumulators (two ymm registers) folded as F P P P
// ---------------------------------------------------------------------------------------------------------
const LN_EPS = f(1e-5);
const lnSum = new Float64Array(16);
const lnSq = new Float64Array(16);

function fold16(a: Float64Array): number {
  const a0 = f(a[0] + a[8]);
  const a1 = f(a[1] + a[9]);
  const a2 = f(a[2] + a[10]);
  const a3 = f(a[3] + a[11]);
  const a4 = f(a[4] + a[12]);
  const a5 = f(a[5] + a[13]);
  const a6 = f(a[6] + a[14]);
  const a7 = f(a[7] + a[15]);
  const b0 = f(a0 + a1);
  const b1 = f(a2 + a3);
  const b2 = f(a4 + a5);
  const b3 = f(a6 + a7);
  return f(f(b0 + b1) + f(b2 + b3));
}

/** y = ((x - mean) * rstd) * gamma + beta, every step rounded to float32, over `n` (a multiple of 16) values. */
export function layerNorm(
  x: Float32Array,
  xo: number,
  gamma: Float32Array,
  beta: Float32Array,
  out: Float32Array,
  oo: number,
  n: number,
): void {
  lnSum.fill(0);
  lnSq.fill(0);
  for (let j = 0; j < n; j += 16) {
    for (let l = 0; l < 16; l++) {
      const v = x[xo + j + l];
      lnSum[l] = f(lnSum[l] + v);
      lnSq[l] = f(lnSq[l] + f(v * v));
    }
  }
  const mean = f(fold16(lnSum) / n);
  const e2 = f(fold16(lnSq) / n);
  let variance = f(e2 - f(mean * mean));
  if (!(variance > 0)) variance = 0;
  const rstd = f(1 / f(Math.sqrt(f(variance + LN_EPS))));
  for (let j = 0; j < n; j++) {
    out[oo + j] = f(f(f(x[xo + j] - mean) * rstd) * gamma[j]) + beta[j];
  }
}

// ---------------------------------------------------------------------------------------------------------
// reductions: `vectorized_reduce_all` / `reduce_m256` of CTranslate2 kernels.cc
// ---------------------------------------------------------------------------------------------------------
const lanes = new Float64Array(8);

/** Horizontal add of 8 lanes exactly as reduce_m256: swap 128-bit halves, swap 64-bit pairs, swap neighbours. */
function reduceM256(v: Float64Array): number {
  const a0 = f(v[0] + v[4]);
  const a1 = f(v[1] + v[5]);
  const a2 = f(v[2] + v[6]);
  const a3 = f(v[3] + v[7]);
  const b0 = f(a0 + a2);
  const b1 = f(a1 + a3);
  return f(b0 + b1);
}

/** Sum of n float32 values: sequential for n <= 8, else 8 lane accumulators + horizontal add + sequential tail. */
export function reduceSum(y: Float32Array | Float64Array, yo: number, n: number): number {
  if (n <= 8) {
    let acc = 0;
    for (let i = 0; i < n; i++) acc = f(acc + y[yo + i]);
    return acc;
  }
  const remaining = n % 8;
  const size = n - remaining;
  lanes.fill(0);
  for (let i = 0; i < size; i += 8) {
    for (let l = 0; l < 8; l++) lanes[l] = f(lanes[l] + y[yo + i + l]);
  }
  let acc = reduceM256(lanes);
  for (let i = size; i < n; i++) acc = f(acc + y[yo + i]);
  return acc;
}

/** In-place softmax over n float32 values (attention rows). */
export function softmaxRow(x: Float32Array | Float64Array, xo: number, n: number): void {
  let max = x[xo];
  for (let i = 1; i < n; i++) if (x[xo + i] > max) max = x[xo + i];
  for (let i = 0; i < n; i++) x[xo + i] = exp256(f(x[xo + i] - max));
  const sum = reduceSum(x, xo, n);
  const r = f(1 / sum);
  for (let i = 0; i < n; i++) x[xo + i] = f(x[xo + i] * r);
}

/** In-place log-softmax over n float32 values (the output logits). */
export function logSoftmaxRow(x: Float32Array, xo: number, n: number): void {
  let max = x[xo];
  for (let i = 1; i < n; i++) if (x[xo + i] > max) max = x[xo + i];
  let sum: number;
  if (n <= 8) {
    sum = 0;
    for (let i = 0; i < n; i++) sum = f(sum + f(Math.exp(f(x[xo + i] - max))));
  } else {
    const remaining = n % 8;
    const size = n - remaining;
    lanes.fill(0);
    for (let i = 0; i < size; i += 8) {
      for (let l = 0; l < 8; l++) lanes[l] = f(lanes[l] + exp256(f(x[xo + i + l] - max)));
    }
    sum = reduceM256(lanes);
    for (let i = size; i < n; i++) sum = f(sum + f(Math.exp(f(x[xo + i] - max))));
  }
  const c = f(f(-max) - f(Math.log(sum)));
  for (let i = 0; i < n; i++) x[xo + i] = f(x[xo + i] + c);
}

// ---------------------------------------------------------------------------------------------------------
// int8 activation quantisation (u8 "shift" form used by the oneDNN u8s8s32 GEMM)
// ---------------------------------------------------------------------------------------------------------
/** Round to nearest, ties to even, for 0 <= t < 2^23 (the kernel's `_MM_FROUND_TO_NEAREST_INT`). */
export function roundHalfEven(t: number): number {
  const r = Math.round(t); // rounds .5 up
  return r - t === 0.5 && (r & 1) === 1 ? r - 1 : r;
}

/**
 * Quantise `m` rows of `k` floats to unsigned bytes (q + 128) and return, per row, 1 / scale as float32:
 *   amax = max|x|, scale = 127 / amax (1 for a zero row), u = rint(fl(fl(x * scale) + 128)).
 */
export function quantizeRows(
  x: Float32Array,
  xo: number,
  m: number,
  k: number,
  u8: Uint8Array,
  uo: number,
  rscale: Float32Array,
): void {
  for (let r = 0; r < m; r++) {
    const base = xo + r * k;
    let amax = 0;
    for (let j = 0; j < k; j++) {
      const a = Math.abs(x[base + j]);
      if (a > amax) amax = a;
    }
    const scale = amax !== 0 ? f(127 / amax) : 1;
    rscale[r] = f(1 / scale);
    const ub = uo + r * k;
    for (let j = 0; j < k; j++) {
      u8[ub + j] = roundHalfEven(f(f(x[base + j] * scale) + 128));
    }
  }
}
