/**
 * Channel down-mix to mono.
 *
 * 'ffmpeg' reproduces libswresample's default matrix for `-ac 1` with floating-point output (rematrix.c
 * auto_matrix(): maxval = INT_MAX, so the matrix is NOT normalised):
 *     FL, FR = 1/sqrt(2)        FC = 1.0        BL, BR, SL, SR, BC = 1/2        LFE = 0
 * Stereo becomes (L + R) / sqrt(2): +3 dB for centred / dual-mono material, and the sum can exceed full scale (the
 * Int16 store keeps a headroom bit for that, see pcm.ts).
 *
 * 'mean' divides by the sum of the coefficients present (what Web Audio does for 2 -> 1): never louder than the
 * loudest input channel; -3.0 dB (stereo) / -10.7 dB (5.1) against 'ffmpeg'.
 *
 * Channel order is the one WebCodecs / Web Audio deliver for 1..8 channels:
 *   1 M | 2 L R | 3 L R C | 4 L R SL SR | 5 L R C SL SR | 6 L R C LFE SL SR | 7 L R C LFE BC SL SR |
 *   8 L R C LFE SL SR BL BR
 * Anything else falls back to an equal-weight mean.
 */

export type DownmixMode = 'ffmpeg' | 'mean';

const FRONT = Math.SQRT1_2;
const CENTRE = 1;
const LFE = 0;
const SURROUND = 0.5;

const LAYOUTS: Record<number, number[]> = {
  1: [1],
  2: [FRONT, FRONT],
  3: [FRONT, FRONT, CENTRE],
  4: [FRONT, FRONT, SURROUND, SURROUND],
  5: [FRONT, FRONT, CENTRE, SURROUND, SURROUND],
  6: [FRONT, FRONT, CENTRE, LFE, SURROUND, SURROUND],
  7: [FRONT, FRONT, CENTRE, LFE, SURROUND, SURROUND, SURROUND],
  8: [FRONT, FRONT, CENTRE, LFE, SURROUND, SURROUND, SURROUND, SURROUND],
};

export function monoWeights(channels: number, mode: DownmixMode = 'mean'): Float64Array {
  const known = LAYOUTS[channels];
  const w = Float64Array.from(known ?? new Array<number>(channels).fill(1));
  if (mode === 'mean' || !known) {
    let sum = 0;
    for (const v of w) sum += Math.abs(v);
    if (sum > 1) for (let i = 0; i < w.length; i++) w[i] /= sum;
  }
  return w;
}

/** out[i] = sum_c weights[c] * planar[c][i]. */
export function mixToMono(
  planar: ArrayLike<number>[],
  weights: Float64Array,
  length: number,
  out: Float32Array | Float64Array,
): void {
  const ch = planar.length;
  if (ch === 1) {
    const w = weights[0];
    const a = planar[0];
    if (w === 1) for (let i = 0; i < length; i++) out[i] = a[i];
    else for (let i = 0; i < length; i++) out[i] = a[i] * w;
    return;
  }
  if (ch === 2) {
    const w0 = weights[0];
    const w1 = weights[1];
    const a = planar[0];
    const b = planar[1];
    for (let i = 0; i < length; i++) out[i] = a[i] * w0 + b[i] * w1;
    return;
  }
  for (let i = 0; i < length; i++) {
    let acc = 0;
    for (let c = 0; c < ch; c++) acc += planar[c][i] * weights[c];
    out[i] = acc;
  }
}
