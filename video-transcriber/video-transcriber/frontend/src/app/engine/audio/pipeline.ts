/**
 * Mono16kPipeline: decoded planar audio at any rate / channel count -> 16 kHz mono Float32 chunks.
 *
 *   cleanup 'native' : [HP -> LP -> dynaudnorm at the source rate, all channels] -> down-mix -> resample
 *                      (ffmpeg's order, the default: parity with the Python engine)
 *   cleanup 'post'   : down-mix -> resample -> [HP -> LP -> dynaudnorm at 16 kHz mono]  (about 2x cheaper, but a
 *                      7.8 kHz filter at 16 kHz is not the same filter: 10-19 dB SNR against ffmpeg)
 *   cleanup false    : down-mix -> resample (the "enhance audio" option off)
 *
 * Streaming: push() any number of planar chunks, finish() once.
 */
import { CleanupActivity, CleanupChain, CleanupOptions } from './cleanup';
import { DownmixMode, mixToMono, monoWeights } from './downmix';
import { ResamplerOptions, StreamResampler } from './resampler';

export type CleanupMode = 'native' | 'post' | false;

export interface PipelineOptions {
  /** Default 16000. */
  outRate?: number;
  /** Default 'native'. */
  cleanup?: CleanupMode;
  cleanupOptions?: CleanupOptions;
  /** Default 'ffmpeg' (the Python engine's level). */
  downmix?: DownmixMode;
  resampler?: Partial<ResamplerOptions>;
}

export class Mono16kPipeline {
  readonly outRate: number;
  readonly cleanupMode: CleanupMode;
  readonly resampler: StreamResampler | null;
  /** Which clean-up filters really run (null when clean-up is off). */
  readonly cleanupActive: CleanupActivity | null;
  inputFrames = 0;
  outputFrames = 0;

  private readonly weights: Float64Array;
  private mono = new Float32Array(0);
  private readonly nativeChain: CleanupChain | null = null;
  private readonly postChain: CleanupChain | null = null;
  private readonly onOutput: (chunk: Float32Array) => void;
  private finished = false;

  constructor(
    readonly inRate: number,
    readonly channels: number,
    onOutput: (chunk: Float32Array) => void,
    opts: PipelineOptions = {},
  ) {
    this.outRate = opts.outRate ?? 16000;
    this.cleanupMode = opts.cleanup === undefined ? 'native' : opts.cleanup;
    this.onOutput = (c) => {
      this.outputFrames += c.length;
      onOutput(c);
    };
    this.weights = monoWeights(channels, opts.downmix ?? 'ffmpeg');
    this.resampler =
      inRate === this.outRate
        ? null
        : new StreamResampler({ ...opts.resampler, inRate, outRate: this.outRate });

    if (this.cleanupMode === 'native') {
      this.nativeChain = new CleanupChain(
        inRate,
        channels,
        (planar, n) => this.afterCleanup(planar, n),
        opts.cleanupOptions,
      );
      this.cleanupActive = this.nativeChain.active;
    } else if (this.cleanupMode === 'post') {
      this.postChain = new CleanupChain(
        this.outRate,
        1,
        (planar, n) => this.onOutput(planar[0].subarray(0, n)),
        opts.cleanupOptions,
      );
      this.cleanupActive = this.postChain.active;
    } else {
      this.cleanupActive = null;
    }
  }

  push(planar: ArrayLike<number>[], length: number): void {
    if (this.finished) throw new Error('pipeline finished');
    this.inputFrames += length;
    if (this.nativeChain) this.nativeChain.push(planar, length);
    else this.afterCleanup(planar, length);
  }

  finish(): void {
    if (this.finished) return;
    this.finished = true;
    this.nativeChain?.flush();
    if (this.resampler) {
      const tail = this.resampler.flush();
      if (tail.length) this.emitResampled(tail);
    }
    this.postChain?.flush();
  }

  private afterCleanup(planar: ArrayLike<number>[], n: number): void {
    if (this.mono.length < n) this.mono = new Float32Array(Math.max(n, this.mono.length * 2));
    mixToMono(planar, this.weights, n, this.mono);
    if (this.resampler) {
      const out = this.resampler.process(this.mono, n);
      if (out.length) this.emitResampled(out);
    } else {
      this.emitResampled(this.mono.subarray(0, n));
    }
  }

  private emitResampled(chunk: Float32Array): void {
    if (this.postChain) this.postChain.push([chunk], chunk.length);
    else this.onOutput(chunk);
  }
}
