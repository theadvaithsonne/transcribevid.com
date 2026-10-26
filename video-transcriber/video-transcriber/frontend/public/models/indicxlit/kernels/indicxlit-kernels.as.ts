// @ts-nocheck - AssemblyScript, not TypeScript: compiled by backend/tools/export_indicxlit_kernels.py, never by tsc.
// IndicXlit numeric kernels (AssemblyScript -> WebAssembly).
//
// Every routine reproduces, bit for bit, what CTranslate2 4.8 computes on an AVX2 CPU for the IndicXlit
// int8 model (see frontend/src/app/engine/hinglish/float32.ts for the readable TypeScript twin of the float
// parts). All float arithmetic is IEEE single precision with one rounding per operation: WebAssembly f32.add /
// f32.mul / f32.div / f32.sqrt and f32x4 lanes are correctly rounded and never fused, exactly like the
// C++ they mirror. The two fused multiply-adds CTranslate2 uses (erf, attention dot products) are done in
// double precision and rounded once.
//
// Built twice from this file: with SIMD (--enable simd) and without (portable fallback); the results are identical.
// All pointers are byte offsets into the memory imported from JavaScript. Rebuild with
//   cd backend && python -m tools.export_indicxlit_kernels

// --------------------------------------------------------------------------------------------- small helpers
@inline function fma32(a: f32, b: f32, c: f32): f32 {
  return <f32>(<f64>a * <f64>b + <f64>c);
}

// --------------------------------------------------------------------------------------------- int8 GEMM
// c[r * n + j] = sum over pairs of sat16(u[2i] * w[2i] + u[2i + 1] * w[2i + 1]) + comp[j]
// u: m rows of k unsigned bytes; w: n rows of k signed bytes; comp[j] = -128 * sum_k w[j][k]; k % 16 == 0.
// This is the arithmetic of oneDNN's AVX2 u8s8s32 GEMM (vpmaddubsw saturates each product pair to int16).
export function gemm(u: usize, m: i32, w: usize, n: i32, k: i32, comp: usize, c: usize): void {
  if (ASC_FEATURE_SIMD) {
    for (let j = 0; j < n; j++) {
      const wrow = w + <usize>j * <usize>k;
      const cj = load<i32>(comp + ((<usize>j) << 2));
      let r = 0;
      for (; r + 4 <= m; r += 4) {
        const u0 = u + <usize>r * <usize>k;
        const u1 = u0 + <usize>k;
        const u2 = u1 + <usize>k;
        const u3 = u2 + <usize>k;
        let a0 = i32x4.splat(0);
        let a1 = i32x4.splat(0);
        let a2 = i32x4.splat(0);
        let a3 = i32x4.splat(0);
        for (let t = 0; t < k; t += 16) {
          const w0 = v128.load8x8_s(wrow + <usize>t);
          const w1 = v128.load8x8_s(wrow + <usize>t + 8);
          a0 = i32x4.add(a0, pairSat(v128.load8x8_u(u0 + <usize>t), v128.load8x8_u(u0 + <usize>t + 8), w0, w1));
          a1 = i32x4.add(a1, pairSat(v128.load8x8_u(u1 + <usize>t), v128.load8x8_u(u1 + <usize>t + 8), w0, w1));
          a2 = i32x4.add(a2, pairSat(v128.load8x8_u(u2 + <usize>t), v128.load8x8_u(u2 + <usize>t + 8), w0, w1));
          a3 = i32x4.add(a3, pairSat(v128.load8x8_u(u3 + <usize>t), v128.load8x8_u(u3 + <usize>t + 8), w0, w1));
        }
        store<i32>(c + ((<usize>r * <usize>n + <usize>j) << 2), hsum(a0) + cj);
        store<i32>(c + (((<usize>r + 1) * <usize>n + <usize>j) << 2), hsum(a1) + cj);
        store<i32>(c + (((<usize>r + 2) * <usize>n + <usize>j) << 2), hsum(a2) + cj);
        store<i32>(c + (((<usize>r + 3) * <usize>n + <usize>j) << 2), hsum(a3) + cj);
      }
      for (; r < m; r++) {
        const u0 = u + <usize>r * <usize>k;
        let a0 = i32x4.splat(0);
        for (let t = 0; t < k; t += 16) {
          const w0 = v128.load8x8_s(wrow + <usize>t);
          const w1 = v128.load8x8_s(wrow + <usize>t + 8);
          a0 = i32x4.add(a0, pairSat(v128.load8x8_u(u0 + <usize>t), v128.load8x8_u(u0 + <usize>t + 8), w0, w1));
        }
        store<i32>(c + ((<usize>r * <usize>n + <usize>j) << 2), hsum(a0) + cj);
      }
    }
  } else {
    // portable build: four rows at a time share the weight loads
    for (let j = 0; j < n; j++) {
      const wrow = w + <usize>j * <usize>k;
      const cj = load<i32>(comp + ((<usize>j) << 2));
      let r = 0;
      for (; r + 4 <= m; r += 4) {
        const u0 = u + <usize>r * <usize>k;
        const u1 = u0 + <usize>k;
        const u2 = u1 + <usize>k;
        const u3 = u2 + <usize>k;
        let a0: i32 = 0;
        let a1: i32 = 0;
        let a2: i32 = 0;
        let a3: i32 = 0;
        for (let t = 0; t < k; t += 2) {
          const w0 = <i32>load<i8>(wrow + <usize>t);
          const w1 = <i32>load<i8>(wrow + <usize>t, 1);
          a0 += clamp16(<i32>load<u8>(u0 + <usize>t) * w0 + <i32>load<u8>(u0 + <usize>t, 1) * w1);
          a1 += clamp16(<i32>load<u8>(u1 + <usize>t) * w0 + <i32>load<u8>(u1 + <usize>t, 1) * w1);
          a2 += clamp16(<i32>load<u8>(u2 + <usize>t) * w0 + <i32>load<u8>(u2 + <usize>t, 1) * w1);
          a3 += clamp16(<i32>load<u8>(u3 + <usize>t) * w0 + <i32>load<u8>(u3 + <usize>t, 1) * w1);
        }
        store<i32>(c + ((<usize>r * <usize>n + <usize>j) << 2), a0 + cj);
        store<i32>(c + (((<usize>r + 1) * <usize>n + <usize>j) << 2), a1 + cj);
        store<i32>(c + (((<usize>r + 2) * <usize>n + <usize>j) << 2), a2 + cj);
        store<i32>(c + (((<usize>r + 3) * <usize>n + <usize>j) << 2), a3 + cj);
      }
      for (; r < m; r++) {
        const urow = u + <usize>r * <usize>k;
        let acc: i32 = 0;
        for (let t = 0; t < k; t += 2) {
          acc += clamp16(
            <i32>load<u8>(urow + <usize>t) * <i32>load<i8>(wrow + <usize>t) +
              <i32>load<u8>(urow + <usize>t, 1) * <i32>load<i8>(wrow + <usize>t, 1),
          );
        }
        store<i32>(c + ((<usize>r * <usize>n + <usize>j) << 2), acc + cj);
      }
    }
  }
}

@inline function clamp16(s: i32): i32 {
  return min<i32>(max<i32>(s, -32768), 32767);
}

// Two 8-lane u16 vectors (activations) against two 8-lane i16 vectors (weights): pair sums as i32, saturated to
// i16 (the vpmaddubsw behaviour), then added pairwise into 4 i32 lanes.
@inline function pairSat(a0: v128, a1: v128, w0: v128, w1: v128): v128 {
  return i32x4.extadd_pairwise_i16x8_s(i16x8.narrow_i32x4_s(i32x4.dot_i16x8_s(a0, w0), i32x4.dot_i16x8_s(a1, w1)));
}

@inline function hsum(v: v128): i32 {
  return i32x4.extract_lane(v, 0) + i32x4.extract_lane(v, 1) + i32x4.extract_lane(v, 2) + i32x4.extract_lane(v, 3);
}

// --------------------------------------------------------------------------------------------- quantisation
// u8[r][j] = rint(fl(fl(x * scale) + 128)), scale = 127 / amax (1 when the row is all zero); rscale[r] = 1 / scale.
export function quantizeRows(x: usize, m: i32, k: i32, u8: usize, rscale: usize): void {
  for (let r = 0; r < m; r++) {
    const xr = x + <usize>r * <usize>k * 4;
    let amax: f32 = 0;
    for (let j = 0; j < k; j++) {
      const a = Mathf.abs(load<f32>(xr + ((<usize>j) << 2)));
      if (a > amax) amax = a;
    }
    const scale: f32 = amax != 0 ? <f32>127 / amax : <f32>1;
    store<f32>(rscale + ((<usize>r) << 2), <f32>1 / scale);
    const ur = u8 + <usize>r * <usize>k;
    for (let j = 0; j < k; j++) {
      const t: f32 = load<f32>(xr + ((<usize>j) << 2)) * scale + <f32>128;
      store<u8>(ur + <usize>j, <u8>(<i32>f32.nearest(t)));
    }
  }
}

// --------------------------------------------------------------------------------------------- exp / erf / GELU
const EXP_HI: f32 = 88.3762626647949;
const EXP_LO: f32 = -88.3762626647949;
const LOG2EF: f32 = 1.44269504088896341;
const EXP_C1: f32 = 0.693359375;
const EXP_C2: f32 = -2.12194440e-4;
const EXP_P0: f32 = 1.9875691500e-4;
const EXP_P1: f32 = 1.3981999507e-3;
const EXP_P2: f32 = 8.3334519073e-3;
const EXP_P3: f32 = 4.1665795894e-2;
const EXP_P4: f32 = 1.6666665459e-1;
const EXP_P5: f32 = 5.0000001201e-1;

@inline function exp256(x0: f32): f32 {
  let x: f32 = x0;
  if (x > EXP_HI) x = EXP_HI;
  if (x < EXP_LO) x = EXP_LO;
  const fx: f32 = Mathf.floor(x * LOG2EF + <f32>0.5);
  x = x - fx * EXP_C1;
  x = x - fx * EXP_C2;
  const z: f32 = x * x;
  let y: f32 = EXP_P0;
  y = y * x + EXP_P1;
  y = y * x + EXP_P2;
  y = y * x + EXP_P3;
  y = y * x + EXP_P4;
  y = y * x + EXP_P5;
  y = y * z;
  y = y + x;
  y = y + <f32>1;
  return y * reinterpret<f32>((<i32>fx + 127) << 23);
}

const ERF_P: f32 = 0.3275911;
const ERF_P1: f32 = 0.254829592;
const ERF_P2: f32 = -0.284496736;
const ERF_P3: f32 = 1.421413741;
const ERF_P4: f32 = -1.453152027;
const ERF_P5: f32 = 1.061405429;
const INV_SQRT2: f32 = 0.7071067811865475;

@inline function erfCt2(a: f32): f32 {
  const neg: bool = reinterpret<i32>(a) < 0;
  const abs: f32 = Mathf.abs(a);
  const t: f32 = <f32>1 / fma32(ERF_P, abs, <f32>1);
  let r: f32 = fma32(ERF_P5, t, ERF_P4);
  r = fma32(r, t, ERF_P3);
  r = fma32(r, t, ERF_P2);
  r = fma32(r, t, ERF_P1);
  const e: f32 = exp256(-(a * a));
  const tmp: f32 = -e * t;
  const res: f32 = fma32(tmp, r, <f32>1);
  return neg ? -res : res;
}

@inline function geluCt2(v: f32): f32 {
  const u: f32 = INV_SQRT2 * v;
  const w: f32 = <f32>1 + erfCt2(u);
  return <f32>0.5 * (v * w);
}


// --------------------------------------------------------------------------------------------- SIMD GELU (4 lanes)
// The same operation sequence as geluCt2, one f32x4 per step. Fused multiply-adds go through f64x2.
@inline function fma4(a: v128, b: v128, c: v128): v128 {
  const lo = f64x2.add(f64x2.mul(f64x2.promote_low_f32x4(a), f64x2.promote_low_f32x4(b)), f64x2.promote_low_f32x4(c));
  const hi = f64x2.add(
    f64x2.mul(f64x2.promote_low_f32x4(i32x4.shuffle(a, a, 2, 3, 0, 1)), f64x2.promote_low_f32x4(i32x4.shuffle(b, b, 2, 3, 0, 1))),
    f64x2.promote_low_f32x4(i32x4.shuffle(c, c, 2, 3, 0, 1)),
  );
  return i32x4.shuffle(f32x4.demote_f64x2_zero(lo), f32x4.demote_f64x2_zero(hi), 0, 1, 4, 5);
}

@inline function exp256x4(x0: v128): v128 {
  let x = f32x4.pmax(f32x4.pmin(x0, f32x4.splat(EXP_HI)), f32x4.splat(EXP_LO));
  const fx = f32x4.floor(f32x4.add(f32x4.mul(x, f32x4.splat(LOG2EF)), f32x4.splat(<f32>0.5)));
  x = f32x4.sub(x, f32x4.mul(fx, f32x4.splat(EXP_C1)));
  x = f32x4.sub(x, f32x4.mul(fx, f32x4.splat(EXP_C2)));
  const z = f32x4.mul(x, x);
  let y = f32x4.splat(EXP_P0);
  y = f32x4.add(f32x4.mul(y, x), f32x4.splat(EXP_P1));
  y = f32x4.add(f32x4.mul(y, x), f32x4.splat(EXP_P2));
  y = f32x4.add(f32x4.mul(y, x), f32x4.splat(EXP_P3));
  y = f32x4.add(f32x4.mul(y, x), f32x4.splat(EXP_P4));
  y = f32x4.add(f32x4.mul(y, x), f32x4.splat(EXP_P5));
  y = f32x4.mul(y, z);
  y = f32x4.add(y, x);
  y = f32x4.add(y, f32x4.splat(<f32>1));
  const pow2n = i32x4.shl(i32x4.add(i32x4.trunc_sat_f32x4_s(fx), i32x4.splat(127)), 23);
  return f32x4.mul(y, pow2n);
}

@inline function gelu4(v: v128): v128 {
  const one = f32x4.splat(<f32>1);
  const u = f32x4.mul(f32x4.splat(INV_SQRT2), v);
  const signBit = v128.and(u, i32x4.splat(0x80000000));
  const abs = f32x4.abs(u);
  const t = f32x4.div(one, fma4(f32x4.splat(ERF_P), abs, one));
  let r = fma4(f32x4.splat(ERF_P5), t, f32x4.splat(ERF_P4));
  r = fma4(r, t, f32x4.splat(ERF_P3));
  r = fma4(r, t, f32x4.splat(ERF_P2));
  r = fma4(r, t, f32x4.splat(ERF_P1));
  const e = exp256x4(f32x4.neg(f32x4.mul(u, u)));
  const tmp = f32x4.mul(f32x4.neg(e), t);
  const res = v128.xor(fma4(tmp, r, one), signBit);
  const w = f32x4.add(one, res);
  return f32x4.mul(f32x4.splat(<f32>0.5), f32x4.mul(v, w));
}

// --------------------------------------------------------------------------------------------- epilogue
// out = [gelu]( fl(fl(c * rscale[r]) / scale[j]) + bias[j] ) [+ residual]; bias / residual may be 0 (absent).
export function epilogue(c: usize, m: i32, n: i32, rscale: usize, scale: usize, bias: usize, gelu: i32, res: usize, out: usize): void {
  for (let r = 0; r < m; r++) {
    const rs = load<f32>(rscale + ((<usize>r) << 2));
    const row = <usize>r * <usize>n;
    let j = 0;
    if (ASC_FEATURE_SIMD) {
      const rsv = f32x4.splat(rs);
      for (; j + 4 <= n; j += 4) {
        const off = (row + <usize>j) << 2;
        const sj = (<usize>j) << 2;
        let y = f32x4.div(f32x4.mul(f32x4.convert_i32x4_s(v128.load(c + off)), rsv), v128.load(scale + sj));
        if (bias != 0) y = f32x4.add(y, v128.load(bias + sj));
        if (gelu != 0) y = gelu4(y);
        if (res != 0) y = f32x4.add(v128.load(res + off), y);
        v128.store(out + off, y);
      }
    }
    for (; j < n; j++) {
      const off = (row + <usize>j) << 2;
      let y: f32 = <f32>load<i32>(c + off) * rs;
      y = y / load<f32>(scale + ((<usize>j) << 2));
      if (bias != 0) y = y + load<f32>(bias + ((<usize>j) << 2));
      if (gelu != 0) y = geluCt2(y);
      if (res != 0) y = load<f32>(res + off) + y;
      store<f32>(out + off, y);
    }
  }
}

// --------------------------------------------------------------------------------------------- layer norm
// out[r] = ((x[r] - mean) * rstd) * gamma + beta with 16 interleaved accumulators for the sums (F P P P fold).
export function layerNorm(x: usize, m: i32, n: i32, gamma: usize, beta: usize, out: usize): void {
  const EPS: f32 = 1e-5;
  for (let r = 0; r < m; r++) {
    const xr = x + <usize>r * <usize>n * 4;
    const or = out + <usize>r * <usize>n * 4;
    let s0: f32 = 0, s1: f32 = 0, s2: f32 = 0, s3: f32 = 0, s4: f32 = 0, s5: f32 = 0, s6: f32 = 0, s7: f32 = 0;
    let s8: f32 = 0, s9: f32 = 0, s10: f32 = 0, s11: f32 = 0, s12: f32 = 0, s13: f32 = 0, s14: f32 = 0, s15: f32 = 0;
    let q0: f32 = 0, q1: f32 = 0, q2: f32 = 0, q3: f32 = 0, q4: f32 = 0, q5: f32 = 0, q6: f32 = 0, q7: f32 = 0;
    let q8: f32 = 0, q9: f32 = 0, q10: f32 = 0, q11: f32 = 0, q12: f32 = 0, q13: f32 = 0, q14: f32 = 0, q15: f32 = 0;
    for (let j = 0; j < n; j += 16) {
      const p = xr + ((<usize>j) << 2);
      let v: f32;
      v = load<f32>(p); s0 += v; q0 += v * v;
      v = load<f32>(p, 4); s1 += v; q1 += v * v;
      v = load<f32>(p, 8); s2 += v; q2 += v * v;
      v = load<f32>(p, 12); s3 += v; q3 += v * v;
      v = load<f32>(p, 16); s4 += v; q4 += v * v;
      v = load<f32>(p, 20); s5 += v; q5 += v * v;
      v = load<f32>(p, 24); s6 += v; q6 += v * v;
      v = load<f32>(p, 28); s7 += v; q7 += v * v;
      v = load<f32>(p, 32); s8 += v; q8 += v * v;
      v = load<f32>(p, 36); s9 += v; q9 += v * v;
      v = load<f32>(p, 40); s10 += v; q10 += v * v;
      v = load<f32>(p, 44); s11 += v; q11 += v * v;
      v = load<f32>(p, 48); s12 += v; q12 += v * v;
      v = load<f32>(p, 52); s13 += v; q13 += v * v;
      v = load<f32>(p, 56); s14 += v; q14 += v * v;
      v = load<f32>(p, 60); s15 += v; q15 += v * v;
    }
    const sum: f32 = fold16(s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15);
    const sq: f32 = fold16(q0, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15);
    const nf: f32 = <f32>n;
    const mean: f32 = sum / nf;
    const e2: f32 = sq / nf;
    let variance: f32 = e2 - mean * mean;
    if (!(variance > 0)) variance = 0;
    const rstd: f32 = <f32>1 / Mathf.sqrt(variance + EPS);
    for (let j = 0; j < n; j++) {
      const o = (<usize>j) << 2;
      store<f32>(or + o, (load<f32>(xr + o) - mean) * rstd * load<f32>(gamma + o) + load<f32>(beta + o));
    }
  }
}

@inline function fold16(l0: f32, l1: f32, l2: f32, l3: f32, l4: f32, l5: f32, l6: f32, l7: f32,
  l8: f32, l9: f32, l10: f32, l11: f32, l12: f32, l13: f32, l14: f32, l15: f32): f32 {
  const a0 = l0 + l8, a1 = l1 + l9, a2 = l2 + l10, a3 = l3 + l11;
  const a4 = l4 + l12, a5 = l5 + l13, a6 = l6 + l14, a7 = l7 + l15;
  const b0 = a0 + a1, b1 = a2 + a3, b2 = a4 + a5, b3 = a6 + a7;
  return (b0 + b1) + (b2 + b3);
}

// --------------------------------------------------------------------------------------------- attention
// Dot product of two 64-element float32 vectors in the accumulation order of the sgemm that CTranslate2 runs.
// oneDNN picks a different micro-kernel depending on the shape, so the order is a parameter:
//   mode 0  one fused multiply-add chain
//   mode 1  8 interleaved fused chains folded P F P          (gemv: one query row)
//   mode 2  2 interleaved non-fused chains (mul, add), summed (two query rows)
//   mode 3  2 interleaved fused chains, summed                (few keys)
function dot64(a: usize, b: usize, mode: i32): f32 {
  if (mode == 1) {
    let l0: f32 = 0, l1: f32 = 0, l2: f32 = 0, l3: f32 = 0, l4: f32 = 0, l5: f32 = 0, l6: f32 = 0, l7: f32 = 0;
    for (let t = 0; t < 64; t += 8) {
      const o = (<usize>t) << 2;
      l0 = fma32(load<f32>(a + o), load<f32>(b + o), l0);
      l1 = fma32(load<f32>(a + o, 4), load<f32>(b + o, 4), l1);
      l2 = fma32(load<f32>(a + o, 8), load<f32>(b + o, 8), l2);
      l3 = fma32(load<f32>(a + o, 12), load<f32>(b + o, 12), l3);
      l4 = fma32(load<f32>(a + o, 16), load<f32>(b + o, 16), l4);
      l5 = fma32(load<f32>(a + o, 20), load<f32>(b + o, 20), l5);
      l6 = fma32(load<f32>(a + o, 24), load<f32>(b + o, 24), l6);
      l7 = fma32(load<f32>(a + o, 28), load<f32>(b + o, 28), l7);
    }
    return ((l0 + l1) + (l4 + l5)) + ((l2 + l3) + (l6 + l7));
  }
  if (mode == 2) {
    let e: f32 = 0, o2: f32 = 0;
    for (let t = 0; t < 64; t += 2) {
      const o = (<usize>t) << 2;
      e = e + load<f32>(a + o) * load<f32>(b + o);
      o2 = o2 + load<f32>(a + o, 4) * load<f32>(b + o, 4);
    }
    return e + o2;
  }
  if (mode == 3) {
    let e: f32 = 0, o2: f32 = 0;
    for (let t = 0; t < 64; t += 2) {
      const o = (<usize>t) << 2;
      e = fma32(load<f32>(a + o), load<f32>(b + o), e);
      o2 = fma32(load<f32>(a + o, 4), load<f32>(b + o, 4), o2);
    }
    return e + o2;
  }
  let acc: f32 = 0;
  for (let t = 0; t < 64; t++) {
    const o = (<usize>t) << 2;
    acc = fma32(load<f32>(a + o), load<f32>(b + o), acc);
  }
  return acc;
}

// Sum of n float32 values as CTranslate2's vectorised reduce: sequential for n <= 8, else 8 lanes + horizontal add.
function reduceSum(p: usize, n: i32): f32 {
  if (n <= 8) {
    let acc: f32 = 0;
    for (let i = 0; i < n; i++) acc += load<f32>(p + ((<usize>i) << 2));
    return acc;
  }
  const rem = n & 7;
  const size = n - rem;
  let l0: f32 = 0, l1: f32 = 0, l2: f32 = 0, l3: f32 = 0, l4: f32 = 0, l5: f32 = 0, l6: f32 = 0, l7: f32 = 0;
  for (let i = 0; i < size; i += 8) {
    const o = p + ((<usize>i) << 2);
    l0 += load<f32>(o);
    l1 += load<f32>(o, 4);
    l2 += load<f32>(o, 8);
    l3 += load<f32>(o, 12);
    l4 += load<f32>(o, 16);
    l5 += load<f32>(o, 20);
    l6 += load<f32>(o, 24);
    l7 += load<f32>(o, 28);
  }
  const a0 = l0 + l4, a1 = l1 + l5, a2 = l2 + l6, a3 = l3 + l7;
  let acc: f32 = (a0 + a2) + (a1 + a3);
  for (let i = size; i < n; i++) acc += load<f32>(p + ((<usize>i) << 2));
  return acc;
}

// In-place softmax of n float32 values.
export function softmaxRow(p: usize, n: i32): void {
  let max: f32 = load<f32>(p);
  for (let i = 1; i < n; i++) {
    const v = load<f32>(p + ((<usize>i) << 2));
    if (v > max) max = v;
  }
  for (let i = 0; i < n; i++) {
    const o = p + ((<usize>i) << 2);
    store<f32>(o, exp256(load<f32>(o) - max));
  }
  const r: f32 = <f32>1 / reduceSum(p, n);
  for (let i = 0; i < n; i++) {
    const o = p + ((<usize>i) << 2);
    store<f32>(o, load<f32>(o) * r);
  }
}

// One query row, one head: scores = (q . k_j) * 0.125, softmax, context = sum_j p_j v_j.
// K / V: key rows of 64 floats with a row stride of `stride` floats. scores: scratch for `keys` floats.
// qkMain / qkTail / qkTailStart: dot-product mode (see dot64) for keys before / from qkTailStart.
// pvMode: accumulation over the keys for the context: 0 one fused chain, 1 two non-fused chains, 2 two fused chains.
export function attendHead(q: usize, K: usize, V: usize, stride: i32, keys: i32, out: usize, scores: usize,
  qkMain: i32, qkTail: i32, qkTailStart: i32, pvMode: i32): void {
  const rowBytes = (<usize>stride) << 2;
  for (let j = 0; j < keys; j++) {
    store<f32>(scores + ((<usize>j) << 2), dot64(q, K + <usize>j * rowBytes, j < qkTailStart ? qkMain : qkTail) * <f32>0.125);
  }
  softmaxRow(scores, keys);
  for (let d = 0; d < 64; d++) {
    const col = V + ((<usize>d) << 2);
    let acc: f32 = 0;
    if (pvMode == 0) {
      for (let j = 0; j < keys; j++) {
        acc = fma32(load<f32>(scores + ((<usize>j) << 2)), load<f32>(col + <usize>j * rowBytes), acc);
      }
    } else {
      // two interleaved accumulators over an even prefix; an odd last key is added after the lanes are summed
      let e: f32 = 0, o: f32 = 0;
      const pairs = keys & ~1;
      for (let j = 0; j < pairs; j++) {
        const p = load<f32>(scores + ((<usize>j) << 2));
        const v = load<f32>(col + <usize>j * rowBytes);
        if ((j & 1) == 0) {
          e = pvMode == 1 ? e + p * v : fma32(p, v, e);
        } else {
          o = pvMode == 1 ? o + p * v : fma32(p, v, o);
        }
      }
      acc = e + o;
      if (pairs != keys) {
        const p = load<f32>(scores + ((<usize>pairs) << 2));
        const v = load<f32>(col + <usize>pairs * rowBytes);
        acc = pvMode == 1 ? acc + p * v : fma32(p, v, acc);
      }
    }
    store<f32>(out + ((<usize>d) << 2), acc);
  }
}
