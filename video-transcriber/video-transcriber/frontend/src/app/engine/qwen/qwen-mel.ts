/**
 * The Qwen3-ASR log-mel features: WhisperFeatureExtractor's recipe at variable length (128 mel bins, n_fft 400,
 * hop 160, periodic Hann window, reflect padding of n_fft / 2, power spectrum, log10 with a 1e-10 floor, max - 8
 * clamp, (x + 4) / 4, last frame dropped), as the export's prompt_config.json `mel` section describes. The spike's
 * harness matched Transformers.js 4.3.1 exactly with a naive DFT (qwen.md section 3); this file uses a mixed-radix
 * FFT (400 = 4 x 4 x 5 x 5) instead, which removes the 0.06-0.1 real-time factor the naive DFT cost.
 */

export const N_FFT = 400;
export const HOP = 160;
export const N_BINS = N_FFT / 2 + 1;

/** Complex FFT of any length whose prime factors are small (2, 3, 5 ...), decimation in time, recursive. */
export class MixedRadixFft {
  readonly n: number;
  private readonly factors: number[];
  private readonly cos: Float64Array;
  private readonly sin: Float64Array;
  private readonly tr: Float64Array;
  private readonly ti: Float64Array;

  constructor(n: number) {
    if (!Number.isInteger(n) || n < 1) throw new RangeError('FFT length must be a positive integer');
    this.n = n;
    this.factors = [];
    let m = n;
    for (const p of [4, 2, 3, 5, 7]) {
      while (m % p === 0) {
        this.factors.push(p);
        m /= p;
      }
    }
    for (let p = 11; m > 1; p += 2) {
      while (m % p === 0) {
        this.factors.push(p);
        m /= p;
      }
    }
    this.cos = new Float64Array(n);
    this.sin = new Float64Array(n);
    for (let k = 0; k < n; k++) {
      this.cos[k] = Math.cos((2 * Math.PI * k) / n);
      this.sin[k] = -Math.sin((2 * Math.PI * k) / n);
    }
    const maxP = Math.max(1, ...this.factors);
    this.tr = new Float64Array(maxP);
    this.ti = new Float64Array(maxP);
  }

  /** X = FFT(x): `outRe` / `outIm` get the n outputs. */
  transform(inRe: ArrayLike<number>, inIm: ArrayLike<number> | null, outRe: Float64Array, outIm: Float64Array): void {
    this.rec(inRe, inIm, 0, 1, this.n, outRe, outIm, 0, 0);
  }

  private rec(
    xr: ArrayLike<number>,
    xi: ArrayLike<number> | null,
    off: number,
    stride: number,
    n: number,
    or: Float64Array,
    oi: Float64Array,
    outOff: number,
    depth: number,
  ): void {
    if (n === 1) {
      or[outOff] = xr[off];
      oi[outOff] = xi ? xi[off] : 0;
      return;
    }
    const p = this.factors[depth];
    const m = n / p;
    for (let r = 0; r < p; r++) this.rec(xr, xi, off + r * stride, stride * p, m, or, oi, outOff + r * m, depth + 1);
    const N = this.n;
    const step = N / n; // W_n^e = W_N^(e * N / n)
    const stepP = N / p;
    const { cos, sin, tr, ti } = this;
    for (let k = 0; k < m; k++) {
      for (let r = 0; r < p; r++) {
        const idx = outOff + r * m + k;
        const e = ((r * k * step) % N + N) % N;
        const c = cos[e];
        const s = sin[e];
        const a = or[idx];
        const b = oi[idx];
        tr[r] = a * c - b * s;
        ti[r] = a * s + b * c;
      }
      for (let q = 0; q < p; q++) {
        let sr = 0;
        let si = 0;
        for (let r = 0; r < p; r++) {
          const e = (r * q * stepP) % N;
          const c = cos[e];
          const s = sin[e];
          sr += tr[r] * c - ti[r] * s;
          si += tr[r] * s + ti[r] * c;
        }
        or[outOff + q * m + k] = sr;
        oi[outOff + q * m + k] = si;
      }
    }
  }
}

export interface MelFilters {
  /** 128 x 201, row-major (the export's mel_filters.json `data`) */
  data: Float32Array;
  nMels: number;
  nFreqs: number;
}

/** mel_filters.json -> a flat filter bank. */
export function parseMelFilters(json: { n_mels?: number; n_freqs?: number; data: number[][] }): MelFilters {
  const nMels = json.n_mels ?? json.data.length;
  const nFreqs = json.n_freqs ?? json.data[0]?.length ?? N_BINS;
  if (nFreqs !== N_BINS) throw new Error(`mel filters have ${nFreqs} frequency bins, expected ${N_BINS}`);
  const data = new Float32Array(nMels * nFreqs);
  for (let m = 0; m < nMels; m++) data.set(json.data[m], m * nFreqs);
  return { data, nMels, nFreqs };
}

export interface LogMel {
  /** [nMels, frames] row-major, what the encoder's `mel [1, 128, T]` input takes */
  mel: Float32Array;
  frames: number;
}

/** Reflect-padded log-mel of 16 kHz audio; frames = floor(samples / 160) (the last centred frame is dropped). */
export function logMel(x: Float32Array, filters: MelFilters, fft = new MixedRadixFft(N_FFT)): LogMel {
  const n = x.length;
  const pad = N_FFT / 2;
  const padded = new Float32Array(n + 2 * pad);
  padded.set(x, pad);
  for (let i = 1; i <= pad; i++) {
    padded[pad - i] = x[Math.min(i, n - 1)] ?? 0;
    padded[pad + n - 1 + i] = x[Math.max(n - 1 - i, 0)] ?? 0;
  }
  const frames = Math.max(0, Math.floor(n / HOP)); // 1 + floor(n / hop) centred frames, the last one dropped
  const { nMels, data: fb } = filters;
  const mel = new Float32Array(nMels * frames);
  const window = new Float64Array(N_FFT);
  for (let k = 0; k < N_FFT; k++) window[k] = 0.5 - 0.5 * Math.cos((2 * Math.PI * k) / N_FFT);
  const frame = new Float64Array(N_FFT);
  const re = new Float64Array(N_FFT);
  const im = new Float64Array(N_FFT);
  const power = new Float64Array(N_BINS);
  let maxv = -Infinity;
  for (let t = 0; t < frames; t++) {
    const off = t * HOP;
    for (let k = 0; k < N_FFT; k++) frame[k] = padded[off + k] * window[k];
    fft.transform(frame, null, re, im);
    for (let b = 0; b < N_BINS; b++) power[b] = re[b] * re[b] + im[b] * im[b];
    for (let m = 0; m < nMels; m++) {
      let s = 0;
      const o = m * N_BINS;
      for (let b = 0; b < N_BINS; b++) s += fb[o + b] * power[b];
      const v = Math.log10(Math.max(s, 1e-10));
      mel[m * frames + t] = v;
      if (v > maxv) maxv = v;
    }
  }
  const floor = maxv - 8;
  for (let i = 0; i < mel.length; i++) mel[i] = (Math.max(mel[i], floor) + 4) / 4;
  return { mel, frames };
}

/** Audio tokens the encoder emits for T mel frames (prompt_config `audio_tokens`): three stride-2 convs per 100 frames. */
export function audioTokenCount(frames: number): number {
  const c = (t: number) => Math.floor((t + 1) / 2);
  return c(c(c(frames % 100))) + 13 * Math.floor(frames / 100);
}
