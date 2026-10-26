/**
 * Streaming polyphase windowed-sinc resampler (any integer rate -> any integer rate, tuned for 8..192 kHz -> 16 kHz).
 *
 * Deliberately the same family as FFmpeg's libswresample default, so results line up with the Python engine's
 * `ffmpeg -ar 16000` (spike/audio.md section 4: 102-143 dB SNR against it):
 *   - kernel : sinc(factor * t) under a Kaiser window (beta 9, about -90 dB stop band)
 *   - cutoff : 0.97 of the lower Nyquist (swr default), so the pass band reaches 7.76 kHz at 16 kHz output
 *   - length : ceil(32 / factor) input samples, even (about 100 taps for 48k -> 16k)
 *   - phases : one exact row per output phase when outRate / gcd <= 1024, otherwise a 1024-row table with linear
 *              interpolation between rows (e.g. 44,117 Hz)
 *   - state  : the last N-1 input samples and an integer phase accumulator -> constant memory, any length
 * Positions are integers (never a float accumulator), so there is no drift on multi-hour files.
 */

export interface ResamplerOptions {
  inRate: number;
  outRate: number;
  /** Prototype taps at unity ratio (swr default 32). */
  taps?: number;
  /** Cut-off as a fraction of the lower Nyquist frequency (swr default 0.97). */
  cutoff?: number;
  /** Kaiser window beta (swr default 9). */
  kaiserBeta?: number;
  /** Use one exact row per phase up to this many phases; above it `interpRows` rows + interpolation. */
  maxExactPhases?: number;
  interpRows?: number;
}

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

/** Modified Bessel function of the first kind, order 0 (power series; fine for |x| <= 30). */
export function besselI0(x: number): number {
  let sum = 1;
  let term = 1;
  const q = (x * x) / 4;
  for (let k = 1; k < 200; k++) {
    term *= q / (k * k);
    sum += term;
    if (term < sum * 1e-17) break;
  }
  return sum;
}

interface LoopState {
  base: number;
  phase: number;
  produced: number;
}

export class StreamResampler {
  readonly inRate: number;
  readonly outRate: number;
  /** Kernel length in input samples (even). */
  readonly kernelLength: number;
  readonly exact: boolean;
  /** Number of table rows (phases). */
  readonly rows: number;

  /** Output samples per period (outRate / gcd). */
  private readonly L: number;
  /** Input samples per period (inRate / gcd). */
  private readonly M: number;
  private readonly center: number;
  private readonly table: Float32Array;

  private buf: Float32Array;
  private bufLen = 0;
  /** Index in buf of the next output's base (floor) sample. */
  private base = 0;
  /** Fractional position of the next output, in 1/L units (0 <= phase < L). */
  private phase = 0;
  private out = new Float32Array(0);
  private inTotal = 0;
  private outTotal = 0;
  private flushed = false;
  private readonly st: LoopState = { base: 0, phase: 0, produced: 0 };

  constructor(opts: ResamplerOptions) {
    const { inRate, outRate } = opts;
    if (!(inRate > 0) || !(outRate > 0) || !Number.isFinite(inRate) || !Number.isFinite(outRate)) {
      throw new RangeError(`invalid sample rates ${inRate} -> ${outRate}`);
    }
    if (!Number.isInteger(inRate) || !Number.isInteger(outRate)) {
      throw new RangeError('sample rates must be integers');
    }
    this.inRate = inRate;
    this.outRate = outRate;
    const taps = opts.taps ?? 32;
    const cutoff = opts.cutoff ?? 0.97;
    const beta = opts.kaiserBeta ?? 9;
    const maxExact = opts.maxExactPhases ?? 1024;
    const interpRows = opts.interpRows ?? 1024;

    const g = gcd(inRate, outRate);
    this.L = outRate / g;
    this.M = inRate / g;

    // low-pass cut-off relative to the input rate's Nyquist (<= 1)
    const factor = Math.min((outRate * cutoff) / inRate, 1.0);
    let n = Math.max(Math.ceil(taps / factor), 1);
    if (n > 1) n += n % 2;
    this.kernelLength = n;
    this.center = n === 1 ? 0 : n / 2 - 1;

    this.exact = this.L <= maxExact;
    this.rows = this.exact ? this.L : interpRows;
    // one extra row at frac = 1.0 when interpolating
    const tableRows = this.exact ? this.rows : this.rows + 1;
    this.table = new Float32Array(tableRows * n);
    this.buildTable(tableRows, n, factor, beta);

    // `center` zero samples of history, so output 0 is aligned with input sample 0
    this.buf = new Float32Array(Math.max(4096, n * 4));
    this.bufLen = this.center;
    this.base = this.center;
  }

  private buildTable(tableRows: number, n: number, factor: number, beta: number): void {
    const i0b = besselI0(beta);
    const half = n / 2;
    for (let r = 0; r < tableRows; r++) {
      const f = r / this.rows;
      let sum = 0;
      const off = r * n;
      for (let i = 0; i < n; i++) {
        // distance (in input samples) of tap i from the output instant
        const t = i - this.center - f;
        const x = Math.PI * t * factor;
        const s = x === 0 ? 1 : Math.sin(x) / x;
        const u = t / half;
        const w = Math.abs(u) >= 1 ? 0 : besselI0(beta * Math.sqrt(1 - u * u)) / i0b;
        this.table[off + i] = s * w;
        sum += s * w;
      }
      // unity DC gain for every phase (swr normalises with phase 0 only; the difference is < 1e-4)
      const inv = 1 / sum;
      for (let i = 0; i < n; i++) this.table[off + i] *= inv;
    }
  }

  get inputConsumed(): number {
    return this.inTotal;
  }

  get outputProduced(): number {
    return this.outTotal;
  }

  /** Total output length for `inSamples` input samples: ceil(n * out / in), the same as ffmpeg. */
  expectedOutputLength(inSamples: number): number {
    return Math.ceil((inSamples * this.outRate) / this.inRate);
  }

  /**
   * Feed samples; returns the newly available output. The returned array is a view on an internal buffer that is
   * valid only until the next call to process() / flush().
   */
  process(input: Float32Array | Float64Array, length: number = input.length): Float32Array {
    if (this.flushed) throw new Error('resampler already flushed');
    this.inTotal += length;
    this.append(input, length);
    return this.run(false);
  }

  /** Finish the stream: produces the outputs that need samples past the end (zero padded). */
  flush(): Float32Array {
    if (this.flushed) return new Float32Array(0);
    this.flushed = true;
    const pad = this.kernelLength + 2;
    this.append(new Float32Array(pad), pad);
    return this.run(true);
  }

  private append(input: Float32Array | Float64Array, length: number): void {
    if (this.bufLen + length > this.buf.length) {
      // compact first: drop everything before (base - center)
      const keepFrom = Math.max(0, this.base - this.center);
      if (keepFrom > 0) {
        this.buf.copyWithin(0, keepFrom, this.bufLen);
        this.bufLen -= keepFrom;
        this.base -= keepFrom;
      }
      const need = this.bufLen + length;
      if (need > this.buf.length) {
        const nb = new Float32Array(Math.max(need, this.buf.length * 2));
        nb.set(this.buf.subarray(0, this.bufLen));
        this.buf = nb;
      }
    }
    if (input instanceof Float32Array) {
      this.buf.set(length === input.length ? input : input.subarray(0, length), this.bufLen);
    } else {
      const b = this.buf;
      let o = this.bufLen;
      for (let i = 0; i < length; i++) b[o++] = input[i];
    }
    this.bufLen += length;
  }

  private run(final: boolean): Float32Array {
    const n = this.kernelLength;
    const center = this.center;
    const lastNeeded = n - 1 - center;
    const avail = this.bufLen - this.base - lastNeeded;
    let maxOut = avail > 0 ? Math.ceil((avail * this.L) / this.M) + 2 : 0;
    // never produce more than ceil(inTotal * L / M) outputs overall
    const cap = final
      ? Math.max(this.expectedOutputLength(this.inTotal) - this.outTotal, 0)
      : Infinity;
    if (final) maxOut = Math.min(maxOut, cap);
    if (this.out.length < maxOut)
      this.out = new Float32Array(Math.max(maxOut, this.out.length * 2));

    const st = this.st;
    st.base = this.base;
    st.phase = this.phase;
    st.produced = 0;
    const limit = this.bufLen - lastNeeded;
    if (this.exact && this.L === 1) {
      decimateInteger(st, this.table, this.buf, this.out, n, center, this.M, limit, cap);
    } else if (this.exact) {
      polyphaseExact(st, this.table, this.buf, this.out, n, center, this.L, this.M, limit, cap);
    } else {
      polyphaseInterp(
        st,
        this.table,
        this.buf,
        this.out,
        n,
        center,
        this.L,
        this.M,
        this.rows,
        limit,
        cap,
      );
    }
    this.base = st.base;
    this.phase = st.phase;
    this.outTotal += st.produced;
    // keep the buffer small on very long streams
    if (this.base - center > 1 << 20) {
      const keepFrom = this.base - center;
      this.buf.copyWithin(0, keepFrom, this.bufLen);
      this.bufLen -= keepFrom;
      this.base -= keepFrom;
    }
    return this.out.subarray(0, st.produced);
  }
}

// Hot loops: separate small functions so V8 optimises each path on its own (one big function was de-optimised
// when several rates ran in the same process, spike/audio.md section 4).

/** L == 1 (32k, 48k, 96k, 192k -> 16k): all outputs share one coefficient row; eight outputs per pass. */
function decimateInteger(
  st: LoopState,
  h: Float32Array,
  buf: Float32Array,
  out: Float32Array,
  n: number,
  center: number,
  M: number,
  limit: number,
  cap: number,
): void {
  let base = st.base;
  let produced = st.produced;
  while (base + 7 * M < limit && produced + 8 <= cap) {
    const b0 = base - center;
    let a0 = 0;
    let a1 = 0;
    let a2 = 0;
    let a3 = 0;
    let a4 = 0;
    let a5 = 0;
    let a6 = 0;
    let a7 = 0;
    for (let i = 0; i < n; i++) {
      const hv = h[i];
      const p = b0 + i;
      a0 += hv * buf[p];
      a1 += hv * buf[p + M];
      a2 += hv * buf[p + 2 * M];
      a3 += hv * buf[p + 3 * M];
      a4 += hv * buf[p + 4 * M];
      a5 += hv * buf[p + 5 * M];
      a6 += hv * buf[p + 6 * M];
      a7 += hv * buf[p + 7 * M];
    }
    out[produced] = a0;
    out[produced + 1] = a1;
    out[produced + 2] = a2;
    out[produced + 3] = a3;
    out[produced + 4] = a4;
    out[produced + 5] = a5;
    out[produced + 6] = a6;
    out[produced + 7] = a7;
    produced += 8;
    base += 8 * M;
  }
  while (base < limit && produced < cap) {
    const start = base - center;
    let a = 0;
    for (let i = 0; i < n; i++) a += h[i] * buf[start + i];
    out[produced++] = a;
    base += M;
  }
  st.base = base;
  st.produced = produced;
}

/** Exact rational polyphase (L > 1): four outputs per pass with independent accumulators. */
function polyphaseExact(
  st: LoopState,
  tab: Float32Array,
  buf: Float32Array,
  out: Float32Array,
  n: number,
  center: number,
  L: number,
  M: number,
  limit: number,
  cap: number,
): void {
  let base = st.base;
  let phase = st.phase;
  let produced = st.produced;
  while (produced + 4 <= cap) {
    const rA = phase * n;
    let p1 = phase + M;
    let b1 = base;
    if (p1 >= L) {
      const adv = Math.floor(p1 / L);
      b1 += adv;
      p1 -= adv * L;
    }
    let p2 = p1 + M;
    let b2 = b1;
    if (p2 >= L) {
      const adv = Math.floor(p2 / L);
      b2 += adv;
      p2 -= adv * L;
    }
    let p3 = p2 + M;
    let b3 = b2;
    if (p3 >= L) {
      const adv = Math.floor(p3 / L);
      b3 += adv;
      p3 -= adv * L;
    }
    if (b3 >= limit) break;
    const s0 = base - center;
    const s1 = b1 - center;
    const s2 = b2 - center;
    const s3 = b3 - center;
    const r1 = p1 * n;
    const r2 = p2 * n;
    const r3 = p3 * n;
    let a0 = 0;
    let a1 = 0;
    let a2 = 0;
    let a3 = 0;
    for (let i = 0; i < n; i++) {
      a0 += tab[rA + i] * buf[s0 + i];
      a1 += tab[r1 + i] * buf[s1 + i];
      a2 += tab[r2 + i] * buf[s2 + i];
      a3 += tab[r3 + i] * buf[s3 + i];
    }
    out[produced] = a0;
    out[produced + 1] = a1;
    out[produced + 2] = a2;
    out[produced + 3] = a3;
    produced += 4;
    phase = p3 + M;
    base = b3;
    if (phase >= L) {
      const adv = Math.floor(phase / L);
      base += adv;
      phase -= adv * L;
    }
  }
  while (base < limit && produced < cap) {
    const start = base - center;
    const row = phase * n;
    let a = 0;
    for (let i = 0; i < n; i++) a += tab[row + i] * buf[start + i];
    out[produced++] = a;
    phase += M;
    if (phase >= L) {
      const adv = Math.floor(phase / L);
      base += adv;
      phase -= adv * L;
    }
  }
  st.base = base;
  st.phase = phase;
  st.produced = produced;
}

/** Odd ratios with a huge phase count: 1024-row table, linear interpolation between adjacent rows. */
function polyphaseInterp(
  st: LoopState,
  tab: Float32Array,
  buf: Float32Array,
  out: Float32Array,
  n: number,
  center: number,
  L: number,
  M: number,
  rows: number,
  limit: number,
  cap: number,
): void {
  let base = st.base;
  let phase = st.phase;
  let produced = st.produced;
  while (base < limit && produced < cap) {
    const start = base - center;
    const rp = (phase * rows) / L;
    const r = Math.floor(rp);
    const fr = rp - r;
    const row0 = r * n;
    const row1 = row0 + n;
    let y0 = 0;
    let y1 = 0;
    for (let i = 0; i < n; i++) {
      const x = buf[start + i];
      y0 += tab[row0 + i] * x;
      y1 += tab[row1 + i] * x;
    }
    out[produced++] = y0 + fr * (y1 - y0);
    phase += M;
    if (phase >= L) {
      const adv = Math.floor(phase / L);
      base += adv;
      phase -= adv * L;
    }
  }
  st.base = base;
  st.phase = phase;
  st.produced = produced;
}

/** One-shot convenience (specs, small buffers). */
export function resampleAll(
  input: Float32Array,
  inRate: number,
  outRate: number,
  opts: Partial<ResamplerOptions> = {},
): Float32Array {
  if (inRate === outRate) return input.slice();
  const r = new StreamResampler({ ...opts, inRate, outRate });
  const a = r.process(input).slice();
  const b = r.flush();
  const res = new Float32Array(a.length + b.length);
  res.set(a, 0);
  res.set(b, a.length);
  return res;
}
