/**
 * IEEE 754 half-precision helpers for the fp16 Qwen graphs. onnxruntime-web returns float16 tensors as a
 * `Float16Array` where the browser has one (Chrome >= 135) and as raw `Uint16Array` bits elsewhere; reading the
 * former as bits cost the spike a debugging round (qwen.md section 7), so everything here works on the bits.
 */

const f32 = new Float32Array(1);
const u32 = new Uint32Array(f32.buffer);

/** float -> half bits, round to nearest, overflow to the largest finite half (as the spike's harness did). */
export function floatToHalf(x: number): number {
  f32[0] = x;
  const v = u32[0];
  const sign = (v >>> 16) & 0x8000;
  const exp = ((v >>> 23) & 0xff) - 127 + 15;
  let man = v & 0x7fffff;
  if (((v >>> 23) & 0xff) === 0xff) return sign | (man ? 0x7e00 : 0x7c00); // NaN / Infinity
  if (exp <= 0) {
    if (exp < -10) return sign;
    man = (man | 0x800000) >> (1 - exp);
    return sign | ((man + 0x1000) >> 13);
  }
  if (exp >= 31) return sign | 0x7bff;
  const r = sign + ((exp << 10) + ((man + 0x1000) >> 13)); // '+' so a rounding carry rolls into the exponent
  return (r & 0x7c00) === 0x7c00 ? sign | 0x7bff : r;
}

/** half bits -> float, for every one of the 65,536 patterns. */
export const HALF_TO_FLOAT: Float32Array = (() => {
  const t = new Float32Array(65536);
  for (let h = 0; h < 65536; h++) {
    const s = h & 0x8000 ? -1 : 1;
    const e = (h >> 10) & 31;
    const m = h & 1023;
    t[h] = e === 0 ? s * Math.pow(2, -14) * (m / 1024) : e === 31 ? (m ? NaN : s * Infinity) : s * Math.pow(2, e - 15) * (1 + m / 1024);
  }
  return t;
})();

/** The bits of a float16 tensor's data, whatever typed array ORT handed back. */
export function halfBits(data: unknown): Uint16Array {
  if (data instanceof Uint16Array) return data;
  const view = data as { buffer: ArrayBufferLike; byteOffset: number; length: number };
  return new Uint16Array(view.buffer, view.byteOffset, view.length);
}

/** Index of the largest value of a float32 / float16 logits row (the last `vocab` entries of `data`). */
export function argmaxLogits(data: unknown, type: string, vocab: number): number {
  let best = -1;
  let bv = -Infinity;
  if (type === 'float16') {
    const bits = halfBits(data);
    const from = bits.length - vocab;
    for (let i = 0; i < vocab; i++) {
      const x = HALF_TO_FLOAT[bits[from + i]];
      if (x > bv) {
        bv = x;
        best = i;
      }
    }
    return best;
  }
  const arr = data as ArrayLike<number>;
  const from = arr.length - vocab;
  for (let i = 0; i < vocab; i++) {
    const x = arr[from + i];
    if (x > bv) {
      bv = x;
      best = i;
    }
  }
  return best;
}
