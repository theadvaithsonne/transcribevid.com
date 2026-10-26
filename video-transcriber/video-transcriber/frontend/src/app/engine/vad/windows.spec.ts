import { GOLDEN, GOLDEN_MAP } from './fixtures/golden';
import { SR, forAll, pick, randInt, tagOf, toSegs } from './fixtures/helpers';
import { SpeechSegment } from './types';
import {
  PlanOptions,
  QWEN_PLAN,
  SpeechTimestampsMap,
  VAD_OFF_PLAN,
  WHISPER_PLAN,
  Window,
  collectChunks,
  makeTimeMap,
  pausesFromProbs,
  planWindows,
  planWithoutVad,
  pyRound,
  windowAudio,
} from './windows';

describe('planWindows(QWEN_PLAN) == backend/app/qwen_engine.chunks() (Python golden)', () => {
  for (const v of GOLDEN) {
    it(tagOf(v), () => {
      const win = planWindows(toSegs(v.configs['qwen'].segments), v.samples, QWEN_PLAN);
      expect(win.every((w) => w.pieces.length === 1)).toBe(true);
      expect(win.map((w) => [w.start, w.end, w.forcedStart])).toEqual(v.qwenChunks);
      // vad=False: the whole file is one speech interval
      const novad = planWindows([{ start: 0, end: v.samples }], v.samples, QWEN_PLAN);
      expect(novad.map((w) => [w.start, w.end, w.forcedStart])).toEqual(v.qwenChunksNoVad);
    });
  }
});

describe('collectChunks / WHISPER_PLAN == faster_whisper.vad.collect_chunks (Python golden)', () => {
  for (const v of GOLDEN) {
    it(`${tagOf(v)}: offsets, durations and segment counts of the 30 s merge`, () => {
      const segs = toSegs(v.configs['whisper_max30'].segments);
      const py = v.configs['whisper_max30'].collect!;
      const faithful = collectChunks(segs, 30, SR, true);
      expect(faithful.map((c) => [c.offset, c.duration, c.segments.length])).toEqual(
        py.map((c) => [c.offset, c.duration, c.segments]),
      );
      // the fixed variant keeps every segment, in order, exactly once
      const fixed = collectChunks(segs, 30, SR, false);
      expect(fixed.map((c) => [c.offset, c.duration])).toEqual(
        py.map((c) => [c.offset, c.duration]),
      );
      expect(fixed.flatMap((c) => c.segments)).toEqual(segs);
      // the planner packs identically
      if (segs.length) {
        const win = planWindows(segs, v.samples, WHISPER_PLAN);
        expect(win.map((w) => w.length / SR)).toEqual(py.map((c) => c.duration));
      }
    });
  }
});

describe('SpeechTimestampsMap / makeTimeMap == faster_whisper.vad.SpeechTimestampsMap (Python golden)', () => {
  for (const c of GOLDEN_MAP) {
    it(`${c.name}: ${c.rows.length} probe times, start and end rules`, () => {
      const m = new SpeechTimestampsMap(toSegs(c.chunks));
      for (const [t, idxStart, idxEnd, origStart, origEnd] of c.rows) {
        expect(m.getChunkIndex(t, false), `idx_start t=${t}`).toBe(idxStart);
        expect(m.getChunkIndex(t, true), `idx_end t=${t}`).toBe(idxEnd);
        expect(m.getOriginalTime(t, undefined, false), `orig_start t=${t}`).toBe(origStart);
        expect(m.getOriginalTime(t, undefined, true), `orig_end t=${t}`).toBe(origEnd);
      }
    });

    it(`${c.name}: makeTimeMap on one window holding all the chunks agrees`, () => {
      let local = 0;
      const pieces = c.chunks.map(([start, end]) => {
        const p = { start, end, local };
        local += end - start;
        return p;
      });
      const w: Window = {
        index: 0,
        pieces,
        length: local,
        start: pieces[0].start,
        end: pieces[pieces.length - 1].end,
        forcedStart: false,
      };
      const tm = makeTimeMap(w);
      for (const [t, , , origStart, origEnd] of c.rows) {
        expect(tm.toAbsolute(t, false, 2), `start t=${t}`).toBe(origStart);
        expect(tm.toAbsolute(t, true, 2), `end t=${t}`).toBe(origEnd);
      }
    });
  }

  it('pyRound rounds like Python round(x, 2), ties to even on exact binary ties', () => {
    expect(pyRound(0.125, 2)).toBe(0.12);
    expect(pyRound(0.375, 2)).toBe(0.38);
    expect(pyRound(2.675, 2)).toBe(2.67); // 2.675 is 2.67499999... in binary
    expect(pyRound(1.005, 2)).toBe(1); // ditto
    expect(pyRound(10.5, 0)).toBe(10);
    expect(pyRound(11.5, 0)).toBe(12);
  });
});

const s = (a: number, b: number): SpeechSegment => ({
  start: Math.round(a * SR),
  end: Math.round(b * SR),
});

describe('planWindows boundary cases', () => {
  it('an exact fit stays in one window; one sample more starts a new one (collect_chunks uses ">")', () => {
    const fit = planWindows([s(0, 15), s(16, 31)], 40 * SR, WHISPER_PLAN);
    expect(fit).toHaveLength(1);
    expect(fit[0].length).toBe(30 * SR);
    expect(fit[0].pieces).toHaveLength(2);
    const over = planWindows(
      [s(0, 15), { start: 16 * SR, end: 31 * SR + 1 }],
      40 * SR,
      WHISPER_PLAN,
    );
    expect(over).toHaveLength(2);
  });

  it('a pause exactly at the preferred fraction is used; one sample earlier is not', () => {
    // maxWindow 10 s, preferBreak 0.6 -> the pause must lie at >= 6.0 s (qwen: start + 0.6 * step <= p)
    const plan = {
      maxWindow: 10,
      mergeGap: 5,
      splice: false,
      preferBreak: 0.6,
      strictPreferred: true,
    };
    const at = planWindows([s(0, 5.5), s(6.5, 20)], 20 * SR, plan); // middle of the gap = 6.0 s
    expect(at.map((w) => [w.start, w.end, w.forcedStart])).toEqual([
      [0, 6 * SR, false],
      [6 * SR, 16 * SR, false],
      [16 * SR, 20 * SR, true],
    ]);
    const before = planWindows([{ start: 0, end: 5.5 * SR - 2 }, s(6.5, 20)], 20 * SR, plan);
    expect(before[0].end).toBe(10 * SR);
    expect(before[1].forcedStart).toBe(true);
  });

  it('the middle of a pause is rounded down (qwen: (a.end + b.start) // 2)', () => {
    const w = planWindows([s(0, 9), { start: 9 * SR + 3, end: 20 * SR }], 20 * SR, {
      maxWindow: 10,
      mergeGap: 5,
      splice: false,
    });
    expect(w[0].end).toBe(9 * SR + 1); // 144001.5 -> 144001
  });

  it('pad widens segments and fuses the ones that now overlap', () => {
    const w = planWindows([s(1, 2), s(2.3, 3)], 10 * SR, { pad: 0.2 });
    expect(w).toHaveLength(1);
    expect(w[0].pieces).toEqual([{ start: 0.8 * SR, end: 3.2 * SR, local: 0 }]);
  });

  it('clamps to the audio, drops empty and out-of-range segments', () => {
    const w = planWindows(
      [{ start: -50, end: 100 }, { start: 5 * SR, end: 5 * SR }, s(11, 12), s(9, 10.5)],
      10 * SR,
    );
    expect(w.map((x) => x.pieces.map((p) => [p.start, p.end]))).toEqual([
      [
        [0, 100],
        [9 * SR, 10 * SR],
      ],
    ]);
  });

  it('spliced window audio and time map: words map to the right place in the original file', () => {
    const total = 60 * SR;
    const ramp = Float32Array.from({ length: total }, (_, i) => i);
    const w = planWindows([s(10, 12), s(30, 31), s(50, 51)], total, WHISPER_PLAN);
    expect(w).toHaveLength(1);
    const a = windowAudio(ramp, w[0]);
    expect(a.length).toBe(4 * SR);
    const tm = makeTimeMap(w[0]);
    expect(tm.toAbsolute(0.5)).toBeCloseTo(10.5, 9); // inside the first piece
    expect(tm.toAbsolute(2.0)).toBeCloseTo(30, 9); // on the join: a start belongs to the next piece
    expect(tm.toAbsolute(2.0, true)).toBeCloseTo(12, 9); // ... an end to the previous one
    expect(tm.toAbsolute(3.5)).toBeCloseTo(50.5, 9);
    expect(a[Math.round(2.5 * SR)]).toBe(Math.round(30.5 * SR));
    expect(tm.mapSpan(2.1, 2.4, 2)).toEqual({ start: 30.1, end: 30.4 });
  });

  it('a window made of one contiguous run is a view, not a copy', () => {
    const x = new Float32Array(100);
    const w = planWindows([{ start: 10, end: 60 }], 100, { splice: false })[0];
    expect(windowAudio(x, w).buffer).toBe(x.buffer);
  });

  it('degenerate input: nothing, one sample, everything, invalid maxWindow', () => {
    expect(planWindows([], 0)).toEqual([]);
    expect(planWindows([], 10 * SR)).toEqual([]);
    expect(planWindows([{ start: 5, end: 5 }], 100)).toEqual([]);
    const one = planWindows([{ start: 10, end: 11 }], 100);
    expect(one).toHaveLength(1);
    expect(one[0].length).toBe(1);
    const all = planWindows([{ start: 0, end: 95 * SR }], 95 * SR, { maxWindow: 30 });
    expect(all.map((w) => w.length)).toEqual([30 * SR, 30 * SR, 30 * SR, 5 * SR]);
    expect(all.map((w) => w.forcedStart)).toEqual([false, true, true, true]);
    expect(() => planWindows([], 10, { maxWindow: 0 })).toThrow();
  });
});

describe('"VAD off": fixed 30 s windows, cut at quiet valleys when the caller supplies them', () => {
  it('pausesFromProbs finds the middle of long quiet runs only', () => {
    const p = Float32Array.from([
      0.9, 0.9, 0.1, 0.1, 0.1, 0.1, 0.1, 0.9, 0.1, 0.1, 0.9, 0.2, 0.2, 0.2, 0.2,
    ]);
    expect(pausesFromProbs(p, { minFrames: 4 })).toEqual([
      Math.floor(((2 + 7) / 2) * 512),
      Math.floor(((11 + 15) / 2) * 512),
    ]);
    expect(pausesFromProbs(p, { minFrames: 2 })).toHaveLength(3);
    expect(pausesFromProbs([], {})).toEqual([]);
    expect(pausesFromProbs(p, { minFrames: 4, firstFrame: 100 })[0]).toBe(
      Math.floor(((102 + 107) / 2) * 512),
    );
  });

  it('the whole file as one interval is cut at the hints instead of every 30 s', () => {
    const total = 100 * SR;
    const hints = [28 * SR, 55 * SR, 83 * SR];
    const w = planWithoutVad(total, hints);
    expect(w.map((x) => [x.start, x.end, x.forcedStart])).toEqual([
      [0, 28 * SR, false],
      [28 * SR, 55 * SR, false],
      [55 * SR, 83 * SR, false],
      [83 * SR, total, false],
    ]);
    expect(w).toEqual(
      planWindows([{ start: 0, end: total }], total, { ...VAD_OFF_PLAN, pauses: hints }),
    );
    const hard = planWithoutVad(total);
    expect(hard.map((x) => [x.start, x.end, x.forcedStart])).toEqual([
      [0, 30 * SR, false],
      [30 * SR, 60 * SR, true],
      [60 * SR, 90 * SR, true],
      [90 * SR, total, true],
    ]);
    expect(planWithoutVad(0)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------------------------------------
// Properties (seeded random scenarios)
// ---------------------------------------------------------------------------------------------------------

interface Iv {
  start: number;
  end: number;
}

interface Scenario {
  segs: SpeechSegment[];
  total: number;
}

/** sorted, non-overlapping speech segments (touching allowed) inside [0, total] */
function scenario(rand: () => number, maxParts = 25, small = false): Scenario {
  const segs: SpeechSegment[] = [];
  let at = 0;
  const parts = randInt(rand, small ? 1 : 0, maxParts);
  for (let i = 0; i < parts; i++) {
    const gap = rand() < 0.5 ? 0 : randInt(rand, 1, (small ? 20 : 40) * SR);
    const len = small
      ? randInt(rand, 16, 40 * SR)
      : rand() < 0.5
        ? randInt(rand, 16, 3 * SR)
        : randInt(rand, 1, 95 * SR);
    at += gap;
    segs.push({ start: at, end: at + len });
    at += len;
  }
  return { segs, total: at + (small ? SR : randInt(rand, 0, 5 * SR)) };
}

function options(rand: () => number): PlanOptions {
  return {
    maxWindow: pick(rand, [1, 5, 10, 25, 30]),
    pad: pick(rand, [0, 0, 0.1, 0.4]),
    mergeGap: pick(rand, [0, 0, 0.5, 2, 5]),
    splice: rand() < 0.5,
    preferBreak: pick(rand, [0, 0, 0.6]),
    strictPreferred: rand() < 0.5,
  };
}

function normalise(segs: SpeechSegment[], total: number, pad: number): Iv[] {
  const p = Math.round(pad * SR);
  const v = segs
    .map((x) => ({ start: Math.max(0, x.start - p), end: Math.min(total, x.end + p) }))
    .filter((x) => x.end > x.start)
    .sort((a, b) => a.start - b.start || a.end - b.end);
  const out: Iv[] = [];
  for (const x of v) {
    const l = out[out.length - 1];
    if (l && x.start < l.end) l.end = Math.max(l.end, x.end);
    else out.push({ ...x });
  }
  return out;
}

/** independent re-derivation of "what must be covered": speech plus gaps shorter than mergeGap */
function expectedCoverage(fused: Iv[], mergeGap: number): Iv[] {
  const out: Iv[] = [];
  for (const x of fused) {
    const l = out[out.length - 1];
    if (l && x.start - l.end < mergeGap * SR) l.end = x.end;
    else out.push({ ...x });
  }
  return out;
}

function union(ivs: Iv[]): Iv[] {
  const v = ivs.map((x) => ({ ...x })).sort((a, b) => a.start - b.start);
  const out: Iv[] = [];
  for (const x of v) {
    const l = out[out.length - 1];
    if (l && x.start <= l.end) l.end = Math.max(l.end, x.end);
    else out.push(x);
  }
  return out;
}

const insideSpeech = (fused: Iv[], p: number) => fused.some((x) => x.start < p && p < x.end);

describe('planWindows properties', () => {
  it('never over the max window, ordered, covers exactly the speech, deterministic, cuts at pauses (1500 cases)', () => {
    forAll(
      { numRuns: 1500, seed: 20261025 },
      (rand) => ({
        ...scenario(rand),
        opts: options(rand),
        hints: Array.from({ length: randInt(rand, 0, 10) }, () => randInt(rand, 0, 3000 * SR)),
        shuffleSeed: randInt(rand, 0, 1e9),
      }),
      ({ segs, total, opts, hints, shuffleSeed }) => {
        const o: PlanOptions = { ...opts, pauses: hints };
        const max = Math.floor((opts.maxWindow ?? 30) * SR);
        const win = planWindows(segs, total, o);

        // determinism + independence of the input order
        expect(planWindows(segs, total, o)).toEqual(win);
        const shuffled = [...segs];
        let r = shuffleSeed;
        for (let i = shuffled.length - 1; i > 0; i--) {
          r = (Math.imul(r, 1664525) + 1013904223) >>> 0;
          const j = r % (i + 1);
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        expect(planWindows(shuffled, total, o)).toEqual(win);

        // sizes and structure
        let prevEnd = -1;
        win.forEach((w, k) => {
          expect(w.index).toBe(k);
          expect(w.length).toBeLessThanOrEqual(max);
          expect(w.length).toBeGreaterThan(0);
          let local = 0;
          for (const p of w.pieces) {
            expect(p.end).toBeGreaterThan(p.start);
            expect(p.start).toBeGreaterThanOrEqual(0);
            expect(p.end).toBeLessThanOrEqual(total);
            expect(p.start).toBeGreaterThanOrEqual(prevEnd);
            expect(p.local).toBe(local);
            local += p.end - p.start;
            prevEnd = p.end;
          }
          expect(w.length).toBe(local);
          expect(w.start).toBe(w.pieces[0].start);
          expect(w.end).toBe(w.pieces[w.pieces.length - 1].end);
          if (!opts.splice) expect(w.pieces.length).toBe(1);
        });

        // coverage: exactly the speech plus the gaps that were joined, nothing else
        const fused = normalise(segs, total, opts.pad ?? 0);
        const groups = expectedCoverage(fused, opts.mergeGap ?? 0);
        const covered = union(
          win.flatMap((w) => w.pieces.map((p) => ({ start: p.start, end: p.end }))),
        );
        expect(covered).toEqual(union(groups));

        // cuts: a boundary inside speech is only allowed when no pause was in reach
        const rawPieces = win.flatMap((w) => w.pieces);
        for (const g of groups) {
          const clipped = rawPieces
            .map((p) => ({ start: Math.max(p.start, g.start), end: Math.min(p.end, g.end) }))
            .filter((p) => p.end > p.start);
          expect(clipped.reduce((a, p) => a + (p.end - p.start), 0)).toBe(g.end - g.start);
          const inside = fused.filter((x) => x.start >= g.start && x.end <= g.end);
          const breaksSet = new Set<number>();
          for (let i = 1; i < inside.length; i++) {
            breaksSet.add(Math.floor((inside[i - 1].end + inside[i].start) / 2));
          }
          for (const h of hints) if (h > g.start && h < g.end) breaksSet.add(Math.floor(h));
          const breaks = [...breaksSet].sort((a, b) => a - b);
          let cursor = g.start;
          const cuts: number[] = [];
          for (;;) {
            const limit = Math.min(g.end, cursor + max);
            if (limit >= g.end) break;
            const inRange = breaks.filter((b) => b > cursor && b <= limit);
            const preferred = inRange.filter((b) => cursor + (opts.preferBreak ?? 0) * max <= b);
            let cut: number;
            if (preferred.length) cut = preferred[preferred.length - 1];
            else if (!opts.strictPreferred && inRange.length) cut = inRange[inRange.length - 1];
            else cut = limit;
            if (insideSpeech(fused, cut) && !breaks.includes(cut) && !opts.strictPreferred) {
              expect(inRange.length).toBe(0);
            }
            cuts.push(cut);
            cursor = cut;
          }
          const inner = new Set<number>();
          for (const p of rawPieces) {
            for (const x of [p.start, p.end]) if (x > g.start && x < g.end) inner.add(x);
          }
          if (!opts.splice) {
            expect([...inner].sort((x, y) => x - y)).toEqual(cuts);
            expect(clipped.length).toBe(cuts.length + 1);
          } else {
            // spliced windows may glue contiguous sub-pieces together again: never a different cut
            for (const x of inner) expect(cuts.includes(x)).toBe(true);
          }
        }

        // forcedStart only on a window that continues the previous one without a gap
        win.forEach((w, k) => {
          if (!w.forcedStart) return;
          expect(k).toBeGreaterThan(0);
          expect(w.start).toBe(win[k - 1].end);
        });

        // next-fit packing is maximal: a single-piece next window would not have fitted
        if (opts.splice) {
          for (let k = 0; k + 1 < win.length; k++) {
            const first = win[k + 1].pieces[0];
            if (win[k + 1].pieces.length === 1) {
              expect(win[k].length + (first.end - first.start)).toBeGreaterThan(max);
            }
          }
        }
      },
    );
  }, 120_000); // the oracle and its ~10^5 expect() calls take ~16 s; planWindows itself ~0.1 s for 1500 calls

  it('incremental use: every window but the last is final when more segments arrive (400 cases)', () => {
    forAll(
      { numRuns: 400, seed: 11 },
      (rand) => ({ ...scenario(rand), opts: options(rand) }),
      ({ segs, total, opts }) => {
        const full = planWindows(segs, total, opts);
        for (let k = 1; k <= segs.length; k++) {
          const stable = planWindows(segs.slice(0, k), total, opts).slice(0, -1);
          expect(full.slice(0, stable.length)).toEqual(stable);
        }
      },
    );
  }, 60_000); // heavy: ~1.3 s under the full parallel suite (M6)

  it('time map: window audio, local -> absolute time, monotonicity (120 cases)', () => {
    forAll(
      { numRuns: 120, seed: 3 },
      (rand) => ({ ...scenario(rand, 6, true), opts: options(rand) }),
      ({ segs, total, opts }) => {
        const win = planWindows(segs, total, opts);
        const ramp = new Float32Array(total);
        for (let i = 0; i < total; i++) ramp[i] = i; // exact up to 2^24 samples
        for (const w of win) {
          const audio = windowAudio(ramp, w);
          expect(audio.length).toBe(w.length);
          const tm = makeTimeMap(w);
          let prev = -Infinity;
          for (let i = 0; i < w.length; i += Math.max(1, Math.floor(w.length / 40))) {
            const abs = tm.toAbsolute(i / SR);
            expect(Math.round(abs * SR)).toBe(audio[i]);
            expect(abs).toBeGreaterThanOrEqual(prev);
            prev = abs;
          }
          // a span inside one piece maps rigidly (both ends resolved in the piece that holds the middle)
          for (const p of w.pieces) {
            const a = p.local / SR;
            const b = (p.local + p.end - p.start) / SR;
            const span = tm.mapSpan(a + (b - a) * 0.25, a + (b - a) * 0.75);
            expect(span.start).toBeCloseTo(p.start / SR + (b - a) * 0.25, 9);
            expect(span.end).toBeCloseTo(p.start / SR + (b - a) * 0.75, 9);
          }
        }
      },
    );
  }, 60_000); // heavy: ~2.3 s under the full parallel suite (M6)

  it('the presets keep their documented values', () => {
    expect(WHISPER_PLAN).toEqual({ maxWindow: 30, mergeGap: 0, splice: true });
    expect(QWEN_PLAN).toEqual({
      maxWindow: 25,
      mergeGap: 2,
      splice: false,
      preferBreak: 0.6,
      strictPreferred: true,
    });
    expect(VAD_OFF_PLAN).toEqual({ maxWindow: 30, mergeGap: 0, splice: false });
  });
});
