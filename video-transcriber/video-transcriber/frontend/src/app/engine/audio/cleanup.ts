/**
 * Audio clean-up chain, equivalent to the Python engine's
 *     ffmpeg -af "highpass=f=70,lowpass=f=7800,dynaudnorm=f=200:g=11:p=0.9"
 * (backend/app/engine.py `_AUDIO_FILTER`), as a streaming object over planar chunks of any size.
 *
 * Processing is in double precision, like FFmpeg (all three filters negotiate `dblp`). A filter whose frequency is
 * above Nyquist is bypassed, exactly as FFmpeg does ("Invalid frequency and/or width!"): the 7.8 kHz low-pass is
 * skipped for 8 kHz sources.
 */
import { Biquad, highpassCoefficients, lowpassCoefficients } from './biquad';
import { DynAudNorm, DynAudNormOptions, PlanarSink } from './dynaudnorm';

export interface CleanupOptions {
  /** Default 70. */
  highpassHz?: number;
  /** Default 7800. */
  lowpassHz?: number;
  /** Default f=200 g=11 p=0.9; false turns the normaliser off. */
  norm?: DynAudNormOptions | false;
}

export const PYTHON_ENGINE_CLEANUP = {
  highpassHz: 70,
  lowpassHz: 7800,
  norm: { frameMs: 200, gaussSize: 11, peak: 0.9 } as DynAudNormOptions,
};

export interface CleanupActivity {
  highpass: boolean;
  lowpass: boolean;
  norm: boolean;
}

export class CleanupChain {
  /** Which stages run (a stage is bypassed when its frequency is above Nyquist). */
  readonly active: CleanupActivity;

  private readonly hp: Biquad[] = [];
  private readonly lp: Biquad[] = [];
  private readonly norm: DynAudNorm | null = null;
  private scratch: Float64Array[];

  constructor(
    readonly sampleRate: number,
    readonly channels: number,
    private readonly emit: PlanarSink,
    opts: CleanupOptions = {},
  ) {
    const hpHz = opts.highpassHz ?? PYTHON_ENGINE_CLEANUP.highpassHz;
    const lpHz = opts.lowpassHz ?? PYTHON_ENGINE_CLEANUP.lowpassHz;
    const nyquist = sampleRate / 2;
    const hpOk = hpHz > 0 && hpHz <= nyquist;
    const lpOk = lpHz > 0 && lpHz <= nyquist;
    if (hpOk) {
      const c = highpassCoefficients(hpHz, sampleRate);
      for (let i = 0; i < channels; i++) this.hp.push(new Biquad(c));
    }
    if (lpOk) {
      const c = lowpassCoefficients(lpHz, sampleRate);
      for (let i = 0; i < channels; i++) this.lp.push(new Biquad(c));
    }
    const normOpts = opts.norm === undefined ? PYTHON_ENGINE_CLEANUP.norm : opts.norm;
    if (normOpts) this.norm = new DynAudNorm(sampleRate, channels, normOpts, emit);
    this.active = { highpass: hpOk, lowpass: lpOk, norm: this.norm !== null };
    this.scratch = Array.from({ length: channels }, () => new Float64Array(0));
  }

  /** Filter one chunk. Without the normaliser the chunk is emitted at once; with it, after its delay. */
  push(planar: ArrayLike<number>[], length: number): void {
    if (this.scratch[0].length < length) {
      const size = Math.max(length, this.scratch[0].length * 2);
      this.scratch = Array.from({ length: this.channels }, () => new Float64Array(size));
    }
    const out: Float32Array[] = [];
    for (let c = 0; c < this.channels; c++) {
      const s = this.scratch[c];
      const src = planar[c];
      for (let i = 0; i < length; i++) s[i] = src[i];
      if (this.hp.length) this.hp[c].process(s, s, length);
      if (this.lp.length) this.lp[c].process(s, s, length);
      if (!this.norm) out.push(Float32Array.from(s.subarray(0, length)));
    }
    if (this.norm) this.norm.push(this.scratch, length);
    else this.emit(out, length);
  }

  flush(): void {
    this.norm?.flush();
  }
}
