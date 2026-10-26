/**
 * Streaming port of FFmpeg's `dynaudnorm` (Dynamic Audio Normalizer, libavfilter/af_dynaudnorm.c, FFmpeg 7.1).
 *
 * Only the options the Python engine uses are supported (framelen f, gausssize g, peak p) plus maxgain, coupling and
 * altboundary at their defaults; the other ffmpeg options are left out so nobody assumes they work.
 *
 * Per frame of `frameLen` samples (channels coupled -> one gain track):
 *   local gain  = bound(maxgain, peak / max|x| over the frame)          bound(t, v) = erf(sqrt(pi)/2 * v/t) * t
 *   history     : the minimum over `filterSize` local gains, then a Gaussian weighted mean of those minima,
 *                 capped by the frame's own local gain
 *   output      : each frame is multiplied by a gain ramping linearly from the previous frame's gain to its own
 * Output is delayed by `filterSize` frames; flush() drains the rest. FFmpeg's buffering and boundary handling
 * (virtual gains before the start, synthetic constant frames after the end) are reproduced exactly, so the result is
 * sample-comparable to `ffmpeg -af dynaudnorm=...`.
 */

export interface DynAudNormOptions {
  /** Frame length in ms (ffmpeg `f`). Python engine: 200. */
  frameMs: number;
  /** Gaussian filter size, odd 3..301 (ffmpeg `g`). Python engine: 11. */
  gaussSize: number;
  /** Target peak 0..1 (ffmpeg `p`). Python engine: 0.9. */
  peak: number;
  /** Maximum gain factor (ffmpeg `m`, default 10 = 20 dB). */
  maxGain?: number;
  /** Couple channels (ffmpeg `n`, default true). */
  coupled?: boolean;
  /** Alternative boundary mode (ffmpeg `b`, default false). */
  altBoundary?: boolean;
}

const DBL_EPSILON = 2.220446049250313e-16;
const DBL_MAX = Number.MAX_VALUE;
const SQRT_PI_2 = 0.886226925452758;

/**
 * erf in double precision (series below 3, continued fraction above). Abramowitz-Stegun 7.1.26 (1.5e-7) is not
 * accurate enough to follow ffmpeg's libm erf() sample for sample.
 */
export function erf(x: number): number {
  const ax = Math.abs(x);
  if (ax > 6) return x < 0 ? -1 : 1;
  if (ax < 3) {
    let sum = ax;
    let term = ax;
    const x2 = ax * ax;
    for (let n = 1; n < 100; n++) {
      term *= -x2 / n;
      const add = term / (2 * n + 1);
      sum += add;
      if (Math.abs(add) < 1e-17 * Math.abs(sum)) break;
    }
    const r = (2 / Math.sqrt(Math.PI)) * sum;
    return x < 0 ? -r : r;
  }
  let f = 0;
  for (let k = 60; k >= 1; k--) f = k / 2 / (ax + f);
  const erfc = Math.exp(-ax * ax) / Math.sqrt(Math.PI) / (ax + f);
  const r = 1 - erfc;
  return x < 0 ? -r : r;
}

function bound(threshold: number, val: number): number {
  return erf(SQRT_PI_2 * (val / threshold)) * threshold;
}

/** The small FIFO ffmpeg uses for its gain histories (at most `filterSize` entries, so shift() is cheap). */
class CQueue {
  private readonly items: number[] = [];
  get size(): number {
    return this.items.length;
  }
  empty(): boolean {
    return this.items.length <= 0;
  }
  enqueue(v: number): void {
    this.items.push(v);
  }
  peek(i: number): number {
    return this.items[i];
  }
  pop(): void {
    this.items.shift();
  }
  dequeue(): number {
    return this.items.shift() as number;
  }
}

interface Frame {
  data: Float64Array[];
  n: number;
}

export type PlanarSink = (planar: Float32Array[], length: number) => void;

export class DynAudNorm {
  readonly frameLen: number;
  readonly filterSize: number;
  private readonly peakValue: number;
  private readonly maxAmp: number;
  private readonly altBoundary: boolean;
  private readonly coupled: boolean;
  private readonly weights: Float64Array;
  private readonly channels: number;

  // Per-channel gain histories: identical for all channels when coupled, but kept per channel like ffmpeg.
  private readonly original: CQueue[] = [];
  private readonly minimum: CQueue[] = [];
  private readonly smoothed: CQueue[] = [];
  private readonly thresholds: CQueue[] = [];
  private readonly prevAmp: Float64Array;

  private readonly queue: Frame[] = [];
  private cur: Float64Array[];
  private curFill = 0;
  private eof = false;

  /**
   * @param emit receives processed audio (planar, one Float32Array per channel, `length` valid samples).
   *   The arrays belong to the callee after the call.
   */
  constructor(
    sampleRate: number,
    channels: number,
    opts: DynAudNormOptions,
    private readonly emit: PlanarSink,
  ) {
    const o = { maxGain: 10, coupled: true, altBoundary: false, ...opts };
    if (!(o.frameMs >= 10 && o.frameMs <= 8000)) throw new RangeError('frameMs must be 10..8000');
    let g = o.gaussSize | 0;
    if (g < 3 || g > 301) throw new RangeError('gaussSize must be 3..301');
    // ffmpeg bumps even sizes to the next odd value
    if (!(g & 1)) g |= 1;
    if (!(o.peak >= 0 && o.peak <= 1)) throw new RangeError('peak must be 0..1');
    if (!(o.maxGain >= 1 && o.maxGain <= 100)) throw new RangeError('maxGain must be 1..100');
    this.channels = channels;
    this.filterSize = g;
    this.peakValue = o.peak;
    this.maxAmp = o.maxGain;
    this.altBoundary = o.altBoundary;
    this.coupled = o.coupled;
    // frame_size(): lrint(sr * ms / 1000), forced even
    const fs = Math.round(sampleRate * (o.frameMs / 1000));
    this.frameLen = fs + (fs % 2);
    this.weights = DynAudNorm.gaussian(g);
    this.prevAmp = new Float64Array(channels).fill(1);
    for (let c = 0; c < channels; c++) {
      this.original.push(new CQueue());
      this.minimum.push(new CQueue());
      this.smoothed.push(new CQueue());
      this.thresholds.push(new CQueue());
    }
    this.cur = Array.from({ length: channels }, () => new Float64Array(this.frameLen));
  }

  private static gaussian(filterSize: number): Float64Array {
    const w = new Float64Array(filterSize);
    const sigma = (filterSize / 2.0 - 1.0) / 3.0 + 1.0 / 3.0;
    const offset = Math.trunc(filterSize / 2);
    const c1 = 1.0 / (sigma * Math.sqrt(2.0 * Math.PI));
    const c2 = 2.0 * sigma * sigma;
    let total = 0;
    for (let i = 0; i < filterSize; i++) {
      const x = i - offset;
      w[i] = c1 * Math.exp(-(x * x) / c2);
      total += w[i];
    }
    const adjust = 1.0 / total;
    for (let i = 0; i < filterSize; i++) w[i] *= adjust;
    return w;
  }

  /** Push planar samples (one array per channel, equal lengths). */
  push(planar: ArrayLike<number>[], length: number): void {
    if (this.eof) throw new Error('DynAudNorm already flushed');
    let pos = 0;
    while (pos < length) {
      const take = Math.min(this.frameLen - this.curFill, length - pos);
      for (let c = 0; c < this.channels; c++) {
        const src = planar[c];
        const dst = this.cur[c];
        for (let i = 0; i < take; i++) dst[this.curFill + i] = src[pos + i];
      }
      this.curFill += take;
      pos += take;
      if (this.curFill === this.frameLen) {
        this.filterFrame({ data: this.cur, n: this.frameLen });
        this.cur = Array.from({ length: this.channels }, () => new Float64Array(this.frameLen));
        this.curFill = 0;
      }
    }
  }

  /** End of stream: process the partial frame, then drain the delayed frames. */
  flush(): void {
    if (this.eof) return;
    if (this.curFill > 0) {
      // ffmpeg hands the final short frame to the filter with nb_samples < frame_len
      this.filterFrame({ data: this.cur, n: this.curFill });
      this.curFill = 0;
    }
    this.eof = true;
    // activate(): while (eof && queue available) flush(outlink)
    while (this.queue.length > 0) {
      // flush(): while (eof && smoothed empty) update_gain_history(c, original.peek(0), threshold 1.0)
      while (this.smoothed[0].empty()) {
        for (let c = 0; c < this.channels; c++) {
          this.updateGainHistory(c, this.original[c].peek(0), 1.0);
        }
      }
      // flush_buffer(): a synthetic constant frame of `frameLen` samples (target_rms is 0 -> peak_value)
      const v = this.altBoundary ? DBL_EPSILON : this.peakValue;
      const synth: Frame = {
        data: Array.from({ length: this.channels }, () => new Float64Array(this.frameLen).fill(v)),
        n: this.frameLen,
      };
      this.filterFrame(synth);
    }
  }

  // ---- filter_frame() ----

  private filterFrame(inFrame: Frame): void {
    const fsz = this.filterSize;
    while (
      (this.queue.length >= fsz || (this.eof && this.queue.length > 0)) &&
      !this.smoothed[0].empty()
    ) {
      this.amplify(this.queue.shift() as Frame);
    }
    this.analyze(inFrame);
    if (!this.eof) this.queue.push(inFrame);
  }

  private amplify(f: Frame): void {
    const out: Float32Array[] = [];
    const n = f.n;
    const step = 1.0 / n;
    for (let c = 0; c < this.channels; c++) {
      const cur = this.smoothed[c].dequeue();
      const prev = this.prevAmp[c];
      const src = f.data[c];
      const dst = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        // fade(): f0 = 1 - step * (pos + 1); f1 = 1 - f0
        const f0 = 1.0 - step * (i + 1.0);
        const f1 = 1.0 - f0;
        dst[i] = src[i] * (f0 * prev + f1 * cur);
      }
      this.prevAmp[c] = cur;
      out.push(dst);
    }
    this.emit(out, n);
  }

  // ---- analyze_frame() / get_max_local_gain() ----

  private analyze(f: Frame): void {
    if (this.coupled) {
      const gain = this.localGain(f, -1);
      for (let c = 0; c < this.channels; c++) this.updateGainHistory(c, gain, 1.0);
    } else {
      for (let c = 0; c < this.channels; c++) this.updateGainHistory(c, this.localGain(f, c), 1.0);
    }
  }

  private localGain(f: Frame, channel: number): number {
    let max = DBL_EPSILON;
    const n = f.n;
    const from = channel === -1 ? 0 : channel;
    const to = channel === -1 ? this.channels : channel + 1;
    for (let c = from; c < to; c++) {
      const d = f.data[c];
      for (let i = 0; i < n; i++) {
        const a = Math.abs(d[i]);
        if (a > max) max = a;
      }
    }
    const maximumGain = this.peakValue / max;
    // target_rms == 0, so the rms gain never limits
    return bound(this.maxAmp, Math.min(DBL_MAX, Math.min(maximumGain, DBL_MAX)));
  }

  // ---- update_gain_history() ----

  private updateGainHistory(ch: number, maxGain: number, threshold: number): void {
    const fsz = this.filterSize;
    const orig = this.original[ch];
    const mini = this.minimum[ch];
    const smooth = this.smoothed[ch];
    const thr = this.thresholds[ch];

    if (orig.empty()) {
      const pre = Math.trunc(fsz / 2);
      const initial = this.altBoundary ? maxGain : Math.min(1.0, maxGain);
      this.prevAmp[ch] = initial;
      while (orig.size < pre) {
        orig.enqueue(initial);
        thr.enqueue(threshold);
      }
    }

    orig.enqueue(maxGain);

    while (orig.size >= fsz) {
      if (mini.empty()) {
        const pre = Math.trunc(fsz / 2);
        let initial = this.altBoundary ? orig.peek(0) : 1.0;
        let input = pre;
        while (mini.size < pre) {
          input++;
          initial = Math.min(initial, orig.peek(input));
          mini.enqueue(initial);
        }
      }
      let minimum = DBL_MAX;
      for (let i = 0; i < orig.size; i++) minimum = Math.min(minimum, orig.peek(i));
      mini.enqueue(minimum);
      thr.enqueue(threshold);
      orig.pop();
    }

    while (mini.size >= fsz) {
      // gaussian_filter(): threshold-weighted mean
      let result = 0.0;
      let tsum = 0.0;
      for (let i = 0; i < mini.size; i++) {
        const tq = thr.peek(i);
        tsum += tq * this.weights[i];
        result += tq * this.weights[i] * mini.peek(i);
      }
      if (tsum === 0.0) result = 1.0;
      smooth.enqueue(Math.min(result, orig.peek(0)));
      mini.pop();
      thr.pop();
    }
  }
}
