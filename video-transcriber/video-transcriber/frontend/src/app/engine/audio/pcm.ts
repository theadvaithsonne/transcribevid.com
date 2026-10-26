/**
 * Int16 storage for the decoded 16 kHz mono signal: 115 MB per hour instead of 230 MB as Float32.
 *
 * `scale` turns a stored value back into a float sample: float = int16 * scale.
 *   - headroom 0: scale = 1/32768 (standard PCM16; values beyond +-1.0 are clipped)
 *   - headroom 1: scale = 1/16384 (range +-2.0 at 15-bit resolution, -90 dBFS noise floor). Needed with the ffmpeg
 *     down-mix of more than one channel: a centred stereo signal that dynaudnorm raised to a 0.9 peak reaches 1.27
 *     (+2 dBFS) after (L+R)/sqrt(2), which the Python engine keeps in float32.
 */

export const PCM_SAMPLE_RATE = 16000;

export class Pcm16Builder {
  readonly scale: number;
  clippedSamples = 0;
  peakAbs = 0;
  private readonly mul: number;
  private readonly pageSize: number;
  private pages: Int16Array[] = [];
  private cur: Int16Array;
  private curLen = 0;
  private total = 0;

  /**
   * @param opts.expectedSamples when known (from the container duration) one buffer of that size (+1 s) is
   *   allocated, so finish() needs no copy. An underestimate switches to 1 Mi-sample pages.
   */
  constructor(opts: { expectedSamples?: number; headroomBits?: 0 | 1; pageSamples?: number } = {}) {
    const headroom = opts.headroomBits ?? 0;
    this.scale = headroom ? 1 / 16384 : 1 / 32768;
    this.mul = headroom ? 16384 : 32768;
    this.pageSize = opts.pageSamples ?? 1 << 20;
    const first =
      opts.expectedSamples && opts.expectedSamples > 0
        ? Math.ceil(opts.expectedSamples) + PCM_SAMPLE_RATE
        : this.pageSize;
    this.cur = new Int16Array(first);
  }

  get length(): number {
    return this.total;
  }

  /** Append float samples of any magnitude; values are rounded half away from zero and clipped to int16. */
  append(x: Float32Array, n: number = x.length): void {
    const mul = this.mul;
    let i = 0;
    let peak = this.peakAbs;
    let clipped = 0;
    while (i < n) {
      if (this.curLen === this.cur.length) this.nextPage();
      const take = Math.min(this.cur.length - this.curLen, n - i);
      const dst = this.cur;
      let o = this.curLen;
      for (let k = 0; k < take; k++) {
        const v = x[i + k];
        const a = v < 0 ? -v : v;
        if (a > peak) peak = a;
        const q = v * mul;
        let s: number;
        if (q >= 32767.5) {
          s = 32767;
          clipped++;
        } else if (q <= -32768.5) {
          s = -32768;
          clipped++;
        } else {
          // NaN falls through to 0
          s = (q < 0 ? q - 0.5 : q + 0.5) | 0;
        }
        dst[o++] = s;
      }
      this.curLen += take;
      i += take;
    }
    this.total += n;
    this.peakAbs = peak;
    this.clippedSamples += clipped;
  }

  private nextPage(): void {
    this.pages.push(this.cur);
    this.cur = new Int16Array(this.pageSize);
    this.curLen = 0;
  }

  /** One contiguous Int16Array (a view on the first buffer when it was big enough). */
  finish(): Int16Array {
    if (this.pages.length === 0) return this.cur.subarray(0, this.curLen);
    const out = new Int16Array(this.total);
    let o = 0;
    for (const p of this.pages) {
      out.set(p, o);
      o += p.length;
    }
    out.set(this.cur.subarray(0, this.curLen), o);
    this.pages = [];
    this.cur = new Int16Array(0);
    return out;
  }
}

/**
 * A window of stored Int16 as Float32 (what Whisper and the VAD consume). `start` / `end` are sample indices and are
 * clamped to the array; `out` is reused when it is large enough.
 */
export function int16ToFloat32(
  pcm: Int16Array,
  scale: number,
  start = 0,
  end = pcm.length,
  out?: Float32Array,
): Float32Array {
  const from = Math.max(0, Math.min(start, pcm.length));
  const n = Math.max(0, Math.min(end, pcm.length) - from);
  const dst = out && out.length >= n ? out : new Float32Array(n);
  for (let i = 0; i < n; i++) dst[i] = pcm[from + i] * scale;
  return dst.length === n ? dst : dst.subarray(0, n);
}
