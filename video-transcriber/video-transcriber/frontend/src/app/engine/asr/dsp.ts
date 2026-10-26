/**
 * Pure numeric helpers of the Whisper engine: no Transformers.js, no DOM, unit-testable in Node.
 * Ported from the spike's reference engine (scratch asr/reference/src/dsp.ts).
 */

/** In-place log-softmax of one row. Returns the log-sum-exp; -Infinity entries stay -Infinity. */
export function logSoftmaxInPlace(row: Float32Array): number {
  let max = -Infinity;
  for (let i = 0; i < row.length; i++) if (row[i] > max) max = row[i];
  if (max === -Infinity) return -Infinity;
  let sum = 0;
  for (let i = 0; i < row.length; i++) sum += Math.exp(row[i] - max);
  const lse = max + Math.log(sum);
  for (let i = 0; i < row.length; i++) row[i] -= lse;
  return lse;
}

/** log(sum(exp(row[from..to)))) */
export function logSumExpRange(row: Float32Array, from: number, to: number): number {
  let max = -Infinity;
  for (let i = from; i < to; i++) if (row[i] > max) max = row[i];
  if (max === -Infinity) return -Infinity;
  let s = 0;
  for (let i = from; i < to; i++) s += Math.exp(row[i] - max);
  return max + Math.log(s);
}

export function argmax(row: Float32Array, from = 0, to = row.length): number {
  let best = from;
  let bv = -Infinity;
  for (let i = from; i < to; i++) {
    if (row[i] > bv) {
      bv = row[i];
      best = i;
    }
  }
  return best;
}

/** Indices of the k largest entries, descending; -Infinity entries are never returned. */
export function topK(row: Float32Array, k: number): number[] {
  const idx: number[] = [];
  const val: number[] = [];
  const bubble = (p: number) => {
    while (p > 0 && val[p - 1] < val[p]) {
      [val[p - 1], val[p]] = [val[p], val[p - 1]];
      [idx[p - 1], idx[p]] = [idx[p], idx[p - 1]];
      p--;
    }
  };
  for (let i = 0; i < row.length; i++) {
    const v = row[i];
    if (v === -Infinity) continue;
    if (idx.length < k) {
      idx.push(i);
      val.push(v);
      bubble(idx.length - 1);
    } else if (v > val[k - 1]) {
      idx[k - 1] = i;
      val[k - 1] = v;
      bubble(k - 1);
    }
  }
  return idx;
}

/** mulberry32: a small seedable PRNG so temperature sampling is reproducible. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Samples an index from softmax(row / temperature). */
export function sampleWithTemperature(
  row: Float32Array,
  temperature: number,
  rng: () => number,
): number {
  let max = -Infinity;
  for (let i = 0; i < row.length; i++) if (row[i] > max) max = row[i];
  let sum = 0;
  const p = new Float64Array(row.length);
  for (let i = 0; i < row.length; i++) {
    if (row[i] === -Infinity) continue;
    const e = Math.exp((row[i] - max) / temperature);
    p[i] = e;
    sum += e;
  }
  let r = rng() * sum;
  for (let i = 0; i < row.length; i++) {
    r -= p[i];
    if (r <= 0 && p[i] > 0) return i;
  }
  return argmax(row);
}

/**
 * Median filter along the last axis with reflect padding (torch / numpy 'reflect': the edge sample is
 * not repeated). `data` is a rows x cols matrix, row-major; `width` must be odd.
 */
export function medianFilterRows(
  data: Float32Array,
  rows: number,
  cols: number,
  width: number,
): Float32Array {
  if (width % 2 === 0) throw new Error('median filter width must be odd');
  const pad = (width - 1) >> 1;
  const out = new Float32Array(data.length);
  const win = new Float32Array(width);
  for (let r = 0; r < rows; r++) {
    const base = r * cols;
    for (let c = 0; c < cols; c++) {
      for (let k = -pad; k <= pad; k++) {
        let j = c + k;
        if (j < 0) j = -j;
        if (j >= cols) j = 2 * (cols - 1) - j;
        if (j < 0) j = 0;
        win[k + pad] = data[base + j];
      }
      for (let a = 1; a < width; a++) {
        const v = win[a];
        let b = a - 1;
        while (b >= 0 && win[b] > v) {
          win[b + 1] = win[b];
          b--;
        }
        win[b + 1] = v;
      }
      out[base + c] = win[pad];
    }
  }
  return out;
}

export interface DtwPath {
  textIndices: Int32Array;
  timeIndices: Int32Array;
}

/**
 * Dynamic time warping with the recurrence and tie-breaking of openai-whisper's `dtw_cpu`.
 * `x` is an N x M cost matrix (row-major). Returns the warping path as (text index, time index) pairs.
 */
export function dtw(x: Float32Array, N: number, M: number): DtwPath {
  const W = M + 1;
  const cost = new Float32Array((N + 1) * W).fill(Infinity);
  const trace = new Int8Array((N + 1) * W).fill(-1);
  cost[0] = 0;
  for (let j = 1; j <= M; j++) {
    for (let i = 1; i <= N; i++) {
      const c0 = cost[(i - 1) * W + (j - 1)];
      const c1 = cost[(i - 1) * W + j];
      const c2 = cost[i * W + (j - 1)];
      let c: number;
      let t: number;
      if (c0 < c1 && c0 < c2) {
        c = c0;
        t = 0;
      } else if (c1 < c0 && c1 < c2) {
        c = c1;
        t = 1;
      } else {
        c = c2;
        t = 2;
      }
      cost[i * W + j] = x[(i - 1) * M + (j - 1)] + c;
      trace[i * W + j] = t;
    }
  }
  for (let j = 0; j <= M; j++) trace[j] = 2;
  for (let i = 0; i <= N; i++) trace[i * W] = 1;
  let i = N;
  let j = M;
  const ti: number[] = [];
  const tj: number[] = [];
  while (i > 0 || j > 0) {
    ti.push(i - 1);
    tj.push(j - 1);
    const t = trace[i * W + j];
    if (t === 0) {
      i--;
      j--;
    } else if (t === 1) i--;
    else if (t === 2) j--;
    else throw new Error('dtw: bad trace');
  }
  ti.reverse();
  tj.reverse();
  return { textIndices: Int32Array.from(ti), timeIndices: Int32Array.from(tj) };
}

export function median(a: number[]): number {
  if (!a.length) return 0;
  const s = [...a].sort((p, q) => p - q);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/**
 * faster-whisper's compression ratio: len(utf8) / len(zlib.compress(utf8)), computed with the
 * platform CompressionStream('deflate') (zlib framing, like Python). Empty text gives 0.
 */
export async function compressionRatio(text: string): Promise<number> {
  const bytes = new TextEncoder().encode(text);
  if (bytes.length === 0) return 0;
  const cs = new CompressionStream('deflate');
  const writer = cs.writable.getWriter();
  void writer.write(bytes);
  void writer.close();
  const buf = await new Response(cs.readable).arrayBuffer();
  return bytes.length / buf.byteLength;
}
