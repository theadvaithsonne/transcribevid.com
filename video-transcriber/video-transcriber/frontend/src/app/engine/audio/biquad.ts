/**
 * Second-order high-pass / low-pass sections that reproduce FFmpeg's `highpass` / `lowpass` filters
 * (libavfilter/af_biquads.c, FFmpeg 7.1): RBJ "cookbook" coefficients, poles=2, width_type=q, width=0.707,
 * direct form I, double precision, zero initial state.
 *
 *   ffmpeg -af "highpass=f=70,lowpass=f=7800"  ==  new Biquad(highpass(70, sr)), new Biquad(lowpass(7800, sr))
 */

export interface BiquadCoefficients {
  b0: number;
  b1: number;
  b2: number;
  // a0 is normalised to 1
  a1: number;
  a2: number;
}

// FFmpeg's default `width` for highpass / lowpass; deliberately not exactly 1/sqrt(2).
const DEFAULT_Q = 0.707;

export function highpassCoefficients(
  freq: number,
  sampleRate: number,
  q = DEFAULT_Q,
): BiquadCoefficients {
  const w0 = (2 * Math.PI * freq) / sampleRate;
  if (!(w0 > 0 && w0 <= Math.PI)) {
    throw new RangeError(`highpass ${freq} Hz is not valid at ${sampleRate} Hz`);
  }
  const alpha = Math.sin(w0) / (2 * q);
  const c = Math.cos(w0);
  const a0 = 1 + alpha;
  return {
    b0: (1 + c) / 2 / a0,
    b1: -(1 + c) / a0,
    b2: (1 + c) / 2 / a0,
    a1: (-2 * c) / a0,
    a2: (1 - alpha) / a0,
  };
}

export function lowpassCoefficients(
  freq: number,
  sampleRate: number,
  q = DEFAULT_Q,
): BiquadCoefficients {
  const w0 = (2 * Math.PI * freq) / sampleRate;
  if (!(w0 > 0 && w0 <= Math.PI)) {
    throw new RangeError(`lowpass ${freq} Hz is not valid at ${sampleRate} Hz`);
  }
  const alpha = Math.sin(w0) / (2 * q);
  const c = Math.cos(w0);
  const a0 = 1 + alpha;
  return {
    b0: (1 - c) / 2 / a0,
    b1: (1 - c) / a0,
    b2: (1 - c) / 2 / a0,
    a1: (-2 * c) / a0,
    a2: (1 - alpha) / a0,
  };
}

/** Direct form I section, one instance per channel. State is kept between calls (streaming). */
export class Biquad {
  private i1 = 0;
  private i2 = 0;
  private o1 = 0;
  private o2 = 0;

  constructor(readonly coef: BiquadCoefficients) {}

  reset(): void {
    this.i1 = this.i2 = this.o1 = this.o2 = 0;
  }

  /** In place or out of place (input and output may be the same array). */
  process(
    input: Float32Array | Float64Array,
    output: Float32Array | Float64Array,
    length: number = input.length,
  ): void {
    const { b0, b1, b2, a1, a2 } = this.coef;
    let i1 = this.i1;
    let i2 = this.i2;
    let o1 = this.o1;
    let o2 = this.o2;
    for (let n = 0; n < length; n++) {
      const x = input[n];
      const y = b0 * x + b1 * i1 + b2 * i2 - a1 * o1 - a2 * o2;
      i2 = i1;
      i1 = x;
      o2 = o1;
      o1 = y;
      output[n] = y;
    }
    this.i1 = i1;
    this.i2 = i2;
    this.o1 = o1;
    this.o2 = o2;
  }
}

/** Magnitude response |H(e^jw)| in dB at `freq` (used by the specs). */
export function magnitudeDb(c: BiquadCoefficients, freq: number, sampleRate: number): number {
  const w = (2 * Math.PI * freq) / sampleRate;
  const cw = Math.cos(w);
  const sw = Math.sin(w);
  const c2 = Math.cos(2 * w);
  const s2 = Math.sin(2 * w);
  const nr = c.b0 + c.b1 * cw + c.b2 * c2;
  const ni = -(c.b1 * sw + c.b2 * s2);
  const dr = 1 + c.a1 * cw + c.a2 * c2;
  const di = -(c.a1 * sw + c.a2 * s2);
  return 10 * Math.log10((nr * nr + ni * ni) / (dr * dr + di * di));
}
