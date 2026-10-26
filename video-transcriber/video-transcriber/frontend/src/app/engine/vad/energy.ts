/**
 * Fallback: a pure TypeScript energy + spectral voice-activity model. No ONNX, no WASM, no download.
 *
 * It implements the same FrameModel contract as Silero (512-sample frames -> probability) so that everything
 * downstream (segmenter, padding, max-speech splitting, windowing, streaming) is shared. It is causal (looks
 * only at the past), so streaming and one-shot runs agree exactly, and it costs one 512-point FFT per frame.
 *
 * Features per 32 ms frame:
 *   snr   frame energy above a minimum-statistics noise floor (lowest smoothed energy of the last ~3 s)
 *   band  share of the energy that lies in 300-3400 Hz (telephone speech band) of 50-8000 Hz
 *   flat  spectral flatness inside 300-3400 Hz (noise ~ 1, voiced speech and music << 1)
 *   dyn   energy swing over the last 16 frames (speech: syllabic 15-40 dB, steady noise / pads: a few dB)
 * combined by a logistic score. It is a fallback: it removes silence and steady noise, it cannot tell speech
 * from music, and it lets loud noise bursts through (measured in docs/in-browser/spike/vad.md section 9).
 * The weights are plain defaults, not fitted to the test clips. Its probabilities also feed
 * `pausesFromProbs()` for the "VAD off" window plan.
 */
import { FRAME, FrameModel } from './types';

const N = FRAME;
const LOG2N = Math.log2(N) | 0;
const HANN = Float64Array.from(
  { length: N },
  (_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1)),
);
const REV = Uint16Array.from({ length: N }, (_, i) => {
  let r = 0;
  for (let b = 0; b < LOG2N; b++) if (i & (1 << b)) r |= 1 << (LOG2N - 1 - b);
  return r;
});
const COS = Float64Array.from({ length: N / 2 }, (_, k) => Math.cos((-2 * Math.PI * k) / N));
const SIN = Float64Array.from({ length: N / 2 }, (_, k) => Math.sin((-2 * Math.PI * k) / N));

const RE = new Float64Array(N);
const IM = new Float64Array(N);

/** Power spectrum (N/2 + 1 bins) of one Hann-windowed frame. */
function powerSpectrum(frame: Float32Array, off: number, out: Float64Array): void {
  for (let i = 0; i < N; i++) {
    const j = REV[i];
    RE[j] = frame[off + i] * HANN[i];
    IM[j] = 0;
  }
  for (let size = 2; size <= N; size <<= 1) {
    const half = size >> 1;
    const step = N / size;
    for (let start = 0; start < N; start += size) {
      for (let k = 0, t = 0; k < half; k++, t += step) {
        const a = start + k;
        const b = a + half;
        const tr = RE[b] * COS[t] - IM[b] * SIN[t];
        const ti = RE[b] * SIN[t] + IM[b] * COS[t];
        RE[b] = RE[a] - tr;
        IM[b] = IM[a] - ti;
        RE[a] += tr;
        IM[a] += ti;
      }
    }
  }
  for (let k = 0; k <= N / 2; k++) out[k] = RE[k] * RE[k] + IM[k] * IM[k];
}

const BIN_HZ = 16000 / N;
const bin = (hz: number) => Math.round(hz / BIN_HZ);
const B_LO = bin(50);
const B_SPEECH_LO = bin(300);
const B_SPEECH_HI = bin(3400);
const B_HI = bin(8000);

export interface EnergyVadOptions {
  /** frames quieter than this (dBFS) are never speech */
  minDb: number;
  /** length of the noise-floor window, frames (94 = 3 s) */
  floorFrames: number;
  /** logistic weights */
  wSnr: number;
  snrMid: number;
  wBand: number;
  bandMid: number;
  wFlat: number;
  flatMid: number;
  wDyn: number;
  dynMid: number;
}

export const DEFAULT_ENERGY_OPTIONS: EnergyVadOptions = {
  minDb: -62,
  floorFrames: 94,
  wSnr: 0.3,
  snrMid: 10,
  wBand: 5,
  bandMid: 0.5,
  wFlat: 4,
  flatMid: 0.4,
  wDyn: 0.12,
  dynMid: 8,
};

export interface FrameFeatures {
  db: number;
  snr: number;
  band: number;
  flat: number;
  dyn: number;
}

export class EnergyVadModel implements FrameModel {
  readonly name = 'energy-spectral';
  private readonly o: EnergyVadOptions;
  private readonly spec = new Float64Array(N / 2 + 1);
  private ring: Float64Array;
  private ringPos = 0;
  private ringFill = 0;
  private recent = new Float64Array(16);
  private recentPos = 0;
  private recentFill = 0;
  private smooth = NaN;

  constructor(options: Partial<EnergyVadOptions> = {}) {
    this.o = { ...DEFAULT_ENERGY_OPTIONS, ...options };
    this.ring = new Float64Array(this.o.floorFrames);
  }

  reset(): void {
    this.ring.fill(0);
    this.ringPos = 0;
    this.ringFill = 0;
    this.recent.fill(0);
    this.recentPos = 0;
    this.recentFill = 0;
    this.smooth = NaN;
  }

  /** Features of one frame; advances the internal state. Exposed for analysis and tuning. */
  features(frames: Float32Array, off: number): FrameFeatures {
    let sum = 0;
    for (let i = 0; i < N; i++) sum += frames[off + i] * frames[off + i];
    const db = 10 * Math.log10(sum / N + 1e-12);
    powerSpectrum(frames, off, this.spec);
    let total = 0;
    let speech = 0;
    let logSum = 0;
    let arSum = 0;
    for (let k = B_LO; k <= B_HI; k++) total += this.spec[k];
    for (let k = B_SPEECH_LO; k <= B_SPEECH_HI; k++) {
      const p = this.spec[k];
      speech += p;
      arSum += p;
      logSum += Math.log(p + 1e-20);
    }
    const nSpeech = B_SPEECH_HI - B_SPEECH_LO + 1;
    const band = total > 1e-12 ? speech / total : 0;
    const flat = arSum > 1e-12 ? Math.exp(logSum / nSpeech) / (arSum / nSpeech) : 1;

    this.smooth = Number.isNaN(this.smooth) ? db : 0.6 * this.smooth + 0.4 * db;
    this.ring[this.ringPos] = this.smooth;
    this.ringPos = (this.ringPos + 1) % this.ring.length;
    this.ringFill = Math.min(this.ringFill + 1, this.ring.length);
    let floor = Infinity;
    for (let i = 0; i < this.ringFill; i++) floor = Math.min(floor, this.ring[i]);

    this.recent[this.recentPos] = db;
    this.recentPos = (this.recentPos + 1) % this.recent.length;
    this.recentFill = Math.min(this.recentFill + 1, this.recent.length);
    let hi = -Infinity;
    let lo = Infinity;
    for (let i = 0; i < this.recentFill; i++) {
      hi = Math.max(hi, this.recent[i]);
      lo = Math.min(lo, this.recent[i]);
    }
    return { db, snr: this.smooth - floor, band, flat, dyn: hi - lo };
  }

  score(f: FrameFeatures): number {
    const o = this.o;
    let z =
      o.wSnr * (f.snr - o.snrMid) +
      o.wBand * (f.band - o.bandMid) -
      o.wFlat * (f.flat - o.flatMid) +
      o.wDyn * (f.dyn - o.dynMid);
    if (f.db < o.minDb) z -= 8;
    return 1 / (1 + Math.exp(-z));
  }

  async predict(frames: Float32Array, n: number): Promise<Float32Array> {
    const out = new Float32Array(n);
    for (let j = 0; j < n; j++) out[j] = this.score(this.features(frames, j * N));
    return out;
  }
}
