import { HALF_TO_FLOAT, argmaxLogits, floatToHalf } from './half';
import { MixedRadixFft, N_BINS, audioTokenCount, logMel, parseMelFilters } from './qwen-mel';

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

function naiveDft(x: Float64Array): { re: Float64Array; im: Float64Array } {
  const n = x.length;
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    for (let t = 0; t < n; t++) {
      const a = (-2 * Math.PI * k * t) / n;
      re[k] += x[t] * Math.cos(a);
      im[k] += x[t] * Math.sin(a);
    }
  }
  return { re, im };
}

/** The spike harness's log-mel (naive DFT), the reference the FFT version must reproduce. */
function referenceLogMel(x: Float32Array, filters: Float32Array, nMels: number): { mel: Float32Array; T: number } {
  const nFft = 400;
  const hop = 160;
  const nBins = 201;
  const win = new Float32Array(nFft);
  for (let k = 0; k < nFft; k++) win[k] = 0.5 - 0.5 * Math.cos((2 * Math.PI * k) / nFft);
  const n = x.length;
  const pad = nFft / 2;
  const padded = new Float32Array(n + 2 * pad);
  padded.set(x, pad);
  for (let i = 1; i <= pad; i++) {
    padded[pad - i] = x[Math.min(i, n - 1)];
    padded[pad + n - 1 + i] = x[Math.max(n - 1 - i, 0)];
  }
  const T = Math.floor(n / hop);
  const mel = new Float32Array(nMels * T);
  let maxv = -1e30;
  for (let t = 0; t < T; t++) {
    const power = new Float64Array(nBins);
    for (let b = 0; b < nBins; b++) {
      let re = 0;
      let im = 0;
      for (let k = 0; k < nFft; k++) {
        const s = padded[t * hop + k] * win[k];
        re += s * Math.cos((2 * Math.PI * b * k) / nFft);
        im -= s * Math.sin((2 * Math.PI * b * k) / nFft);
      }
      power[b] = re * re + im * im;
    }
    for (let m = 0; m < nMels; m++) {
      let s = 0;
      for (let b = 0; b < nBins; b++) s += filters[m * nBins + b] * power[b];
      const v = Math.log10(Math.max(s, 1e-10));
      mel[m * T + t] = v;
      if (v > maxv) maxv = v;
    }
  }
  for (let i = 0; i < mel.length; i++) mel[i] = (Math.max(mel[i], maxv - 8) + 4) / 4;
  return { mel, T };
}

describe('qwen-mel: mixed-radix FFT', () => {
  it.each([400, 12, 7, 1, 100, 60])('matches a naive DFT for length %i', (n) => {
    const r = rng(n + 3);
    const x = new Float64Array(n).map(() => r() * 2 - 1);
    const fft = new MixedRadixFft(n);
    const re = new Float64Array(n);
    const im = new Float64Array(n);
    fft.transform(x, null, re, im);
    const want = naiveDft(x);
    for (let k = 0; k < n; k++) {
      expect(re[k]).toBeCloseTo(want.re[k], 9);
      expect(im[k]).toBeCloseTo(want.im[k], 9);
    }
  });
});

describe('qwen-mel: log-mel features', () => {
  const nMels = 8;
  const r = rng(11);
  const data = Array.from({ length: nMels }, () => Array.from({ length: N_BINS }, () => (r() < 0.1 ? r() * 0.02 : 0)));
  const filters = parseMelFilters({ n_mels: nMels, n_freqs: N_BINS, data });

  it('reproduces the spike harness (WhisperFeatureExtractor recipe, variable length, last frame dropped)', () => {
    const x = new Float32Array(16000 * 0.37).map((_, i) => Math.sin(i / 7) * 0.3 + (r() - 0.5) * 0.05);
    const got = logMel(x, filters);
    const want = referenceLogMel(x, filters.data, nMels);
    expect(got.frames).toBe(want.T);
    expect(got.frames).toBe(Math.floor(x.length / 160));
    for (let i = 0; i < got.mel.length; i++) expect(got.mel[i]).toBeCloseTo(want.mel[i], 4);
  });

  it('gives (log10(1e-10) + 4) / 4 everywhere for silence', () => {
    const { mel } = logMel(new Float32Array(8000), filters);
    expect(new Set(Array.from(mel))).toEqual(new Set([-1.5]));
  });

  it('refuses filters for another FFT size', () => {
    expect(() => parseMelFilters({ n_mels: 1, n_freqs: 257, data: [new Array(257).fill(0)] })).toThrow(/201/);
  });

  it('counts audio tokens like the export (three stride-2 convs per 100 frames)', () => {
    expect(audioTokenCount(100)).toBe(13);
    expect(audioTokenCount(2500)).toBe(325);
    expect(audioTokenCount(50)).toBe(7);
    expect(audioTokenCount(654)).toBe(13 * 6 + 7);
  });
});

describe('qwen half floats', () => {
  it('round-trips representable values and argmaxes fp16 logits from bits or Float16Array-like views', () => {
    for (const v of [0, 1, -2.5, 0.000061035156, 65504, -0.33325195]) expect(HALF_TO_FLOAT[floatToHalf(v)]).toBeCloseTo(v, 4);
    expect(floatToHalf(1e6)).toBe(0x7bff); // clamped to the largest finite half
    const bits = Uint16Array.from([1, 5, 3, 9, 2].map(floatToHalf));
    expect(argmaxLogits(bits, 'float16', 5)).toBe(3);
    expect(argmaxLogits(Float32Array.from([0, 7, 1]), 'float32', 3)).toBe(1);
    // the last `vocab` entries only (a prefill that returned every position)
    expect(argmaxLogits(Float32Array.from([9, 9, 9, 0, 1, 0]), 'float32', 3)).toBe(1);
  });
});
