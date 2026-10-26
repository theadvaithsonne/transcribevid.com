import {
  argmax,
  compressionRatio,
  dtw,
  logSoftmaxInPlace,
  logSumExpRange,
  makeRng,
  median,
  medianFilterRows,
  sampleWithTemperature,
  topK,
} from './dsp';
import { TINY_WASM_PASSAGE_C } from './fixtures/reference-runs';

describe('logSoftmaxInPlace / logSumExpRange', () => {
  it('turns a row into log-probabilities that sum to 1 and keeps -Infinity', () => {
    const r = Float32Array.from([1, 2, 3, -Infinity]);
    const lse = logSoftmaxInPlace(r);
    expect(lse).toBeCloseTo(Math.log(Math.exp(1) + Math.exp(2) + Math.exp(3)), 5);
    expect(Array.from(r).reduce((a, b) => a + Math.exp(b), 0)).toBeCloseTo(1, 6);
    expect(r[3]).toBe(-Infinity);
  });

  it('returns -Infinity for a fully masked row', () => {
    expect(logSoftmaxInPlace(Float32Array.from([-Infinity, -Infinity]))).toBe(-Infinity);
    expect(logSumExpRange(Float32Array.from([-Infinity, 0]), 0, 1)).toBe(-Infinity);
  });

  it('sums a range only', () => {
    const r = Float32Array.from([5, 0, 0, 9]);
    expect(logSumExpRange(r, 1, 3)).toBeCloseTo(Math.log(2), 6);
  });
});

describe('argmax / topK', () => {
  it('finds the largest entry, first one on ties, inside a range', () => {
    expect(argmax(Float32Array.from([0.1, 5, 5, 3]))).toBe(1);
    expect(argmax(Float32Array.from([9, 1, 2, 3]), 1)).toBe(3);
  });

  it('returns the k largest in descending order and skips -Infinity', () => {
    expect(topK(Float32Array.from([0.1, 5, -Infinity, 3, 4, 2]), 3)).toEqual([1, 4, 3]);
    expect(topK(Float32Array.from([-Infinity, 1]), 3)).toEqual([1]);
  });
});

describe('makeRng / sampleWithTemperature', () => {
  it('is reproducible for a seed and never samples a masked token', () => {
    const row = Float32Array.from([0, 1, 2, -Infinity]);
    const a = makeRng(7);
    const b = makeRng(7);
    const xs = Array.from({ length: 50 }, () => sampleWithTemperature(row, 1, a));
    const ys = Array.from({ length: 50 }, () => sampleWithTemperature(row, 1, b));
    expect(xs).toEqual(ys);
    expect(xs.every((x) => x !== 3)).toBe(true);
    expect(new Set(xs).size).toBeGreaterThan(1);
  });

  it('approaches greedy at a tiny temperature', () => {
    const row = Float32Array.from([0, 1, 2, -Infinity]);
    expect(sampleWithTemperature(row, 1e-4, makeRng(1))).toBe(argmax(row));
  });

  it('gives values in [0, 1)', () => {
    const rng = makeRng(1234);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v >= 0 && v < 1).toBe(true);
    }
  });
});

describe('medianFilterRows', () => {
  it('filters along the time axis with reflect padding (torch / numpy semantics)', () => {
    const out = medianFilterRows(Float32Array.from([1, 9, 2, 8, 3]), 1, 5, 3);
    expect(Array.from(out)).toEqual([9, 2, 8, 3, 8]);
  });

  it('filters every row on its own', () => {
    const data = Float32Array.from([1, 9, 1, 5, 5, 5]);
    expect(Array.from(medianFilterRows(data, 2, 3, 3))).toEqual([9, 1, 9, 5, 5, 5]);
  });

  it('rejects an even width', () => {
    expect(() => medianFilterRows(new Float32Array(4), 1, 4, 4)).toThrow(/odd/);
  });
});

describe('dtw', () => {
  it('recovers a clean staircase (token i is cheap at frames 2i..2i+1)', () => {
    const N = 4;
    const M = 8;
    const cost = new Float32Array(N * M).fill(1);
    for (let i = 0; i < N; i++) for (let j = 2 * i; j < 2 * i + 2; j++) cost[i * M + j] = 0;
    const { textIndices, timeIndices } = dtw(cost, N, M);
    expect(textIndices.length).toBe(timeIndices.length);
    expect([textIndices[0], timeIndices[0]]).toEqual([0, 0]);
    expect([textIndices.at(-1), timeIndices.at(-1)]).toEqual([N - 1, M - 1]);
    const first = [-1, -1, -1, -1];
    for (let k = textIndices.length - 1; k >= 0; k--) first[textIndices[k]] = timeIndices[k];
    expect(first).toEqual([0, 2, 4, 6]);
  });

  it('is monotonic in both axes', () => {
    const N = 5;
    const M = 23;
    const rng = makeRng(3);
    const cost = Float32Array.from({ length: N * M }, () => rng());
    const { textIndices, timeIndices } = dtw(cost, N, M);
    for (let k = 1; k < textIndices.length; k++) {
      expect(textIndices[k] - textIndices[k - 1]).toBeGreaterThanOrEqual(0);
      expect(timeIndices[k] - timeIndices[k - 1]).toBeGreaterThanOrEqual(0);
      expect(
        textIndices[k] - textIndices[k - 1] + timeIndices[k] - timeIndices[k - 1],
      ).toBeGreaterThan(0);
    }
  });
});

describe('median', () => {
  it('handles odd, even and empty lists without reordering the input', () => {
    const a = [3, 1, 2];
    expect(median(a)).toBe(2);
    expect(a).toEqual([3, 1, 2]);
    expect(median([4, 1, 2, 3])).toBe(2.5);
    expect(median([])).toBe(0);
  });
});

describe('compressionRatio', () => {
  it('matches the value the reference engine recorded for passage-c (zlib framing, like Python)', async () => {
    const p = TINY_WASM_PASSAGE_C;
    expect(await compressionRatio(p.text)).toBeCloseTo(p.compressionRatio, 12);
  });

  it('is 0 for empty text and above the 2.4 loop threshold for a repetition loop', async () => {
    expect(await compressionRatio('')).toBe(0);
    const loop = Array.from({ length: 14 }, () => "I'm going to go to the next station.").join(' ');
    expect(await compressionRatio(loop)).toBeGreaterThan(2.4);
  });
});
