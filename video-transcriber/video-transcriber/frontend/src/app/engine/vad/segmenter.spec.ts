import { GOLDEN } from './fixtures/golden';
import {
  CONFIGS,
  forAll,
  goldenProbs,
  pick,
  randInt,
  randomPartition,
  rng,
  tagOf,
  toSegs,
} from './fixtures/helpers';
import { SpeechSegmenter, speechTimestampsFromProbs } from './segmenter';
import { FRAME, SpeechSegment, VadParams } from './types';

describe('segmenter vs faster_whisper.vad.get_speech_timestamps (Python golden traces)', () => {
  it('has the reference data of all 50 clip variants (25 clips, raw and enhanced)', () => {
    expect(GOLDEN.length).toBe(50);
    for (const v of GOLDEN) expect(goldenProbs(v).length).toBe(Math.floor(v.samples / FRAME) + 1);
  });

  for (const v of GOLDEN) {
    const tag = tagOf(v);

    it(`${tag}: the literal port returns Python's segments for all five parameter sets`, () => {
      const probs = goldenProbs(v);
      for (const [cfg, params] of Object.entries(CONFIGS)) {
        const got = speechTimestampsFromProbs(probs, v.samples, params);
        expect(got, `${tag} / ${cfg}`).toEqual(toSegs(v.configs[cfg].segments));
      }
    });

    it(`${tag}: the incremental segmenter returns Python's segments for any batching`, () => {
      const probs = goldenProbs(v);
      const rand = rng(1234 + tag.length);
      for (const [cfg, params] of Object.entries(CONFIGS)) {
        const expected = toSegs(v.configs[cfg].segments);
        for (let trial = 0; trial < 3; trial++) {
          const seg = new SpeechSegmenter(params);
          const out: SpeechSegment[] = [];
          const parts = randomPartition(probs.length, rand, 2000);
          let at = 0;
          for (let i = 0; i < parts.length; i++) {
            const before = seg.retainFrom;
            const got = seg.pushProbs(probs.subarray(at, at + parts[i]), i === parts.length - 1);
            for (const s of got)
              expect(s.start, `${tag}/${cfg}: before retainFrom`).toBeGreaterThanOrEqual(before);
            out.push(...got);
            at += parts[i];
          }
          out.push(...seg.finish(v.samples));
          expect(out, `${tag} / ${cfg} / trial ${trial}`).toEqual(expected);
        }
      }
    });
  }
});

const LEVELS = [0.01, 0.1, 0.2, 0.29, 0.31, 0.4, 0.44, 0.45, 0.46, 0.55, 0.8, 0.99];

function randomProbs(rand: () => number): Float32Array {
  const runs = randInt(rand, 1, 40);
  const out: number[] = [];
  for (let r = 0; r < runs; r++) {
    const n = randInt(rand, 1, 40);
    const p = pick(rand, LEVELS);
    for (let i = 0; i < n; i++) out.push(p);
  }
  return Float32Array.from(out);
}

function randomParams(rand: () => number): VadParams {
  return {
    threshold: pick(rand, [0.3, 0.45, 0.5, 0.6, 0.8]),
    negThreshold: rand() < 0.5 ? undefined : pick(rand, [0.1, 0.25, 0.3, 0.4]),
    minSpeechDurationMs: pick(rand, [0, 0, 64, 250, 1000]),
    maxSpeechDurationS: pick(rand, [Infinity, Infinity, 0.6, 1, 2, 5]),
    minSilenceDurationMs: pick(rand, [32, 64, 100, 300, 500, 2000]),
    speechPadMs: pick(rand, [0, 32, 100, 400, 800]),
  };
}

describe('SpeechSegmenter (incremental) == speechTimestampsFromProbs (oracle) on random input', () => {
  it('any batching of any probability sequence gives the oracle result (4000 cases)', () => {
    forAll(
      { numRuns: 4000, seed: 20261025 },
      (rand) => ({
        probs: randomProbs(rand),
        params: randomParams(rand),
        rem: randInt(rand, 0, FRAME - 1),
        cuts: Array.from({ length: randInt(rand, 1, 20) }, () => randInt(rand, 1, 60)),
      }),
      ({ probs, params, rem, cuts }) => {
        const total = (probs.length - 1) * FRAME + rem;
        const expected = speechTimestampsFromProbs(probs, total, params);
        const seg = new SpeechSegmenter(params);
        const got: SpeechSegment[] = [];
        let at = 0;
        let ci = 0;
        while (at < probs.length) {
          const len = Math.min(cuts[ci++ % cuts.length], probs.length - at);
          const before = seg.retainFrom;
          const out = seg.pushProbs(probs.subarray(at, at + len), at + len >= probs.length);
          for (const s of out) expect(s.start).toBeGreaterThanOrEqual(before);
          got.push(...out);
          at += len;
        }
        got.push(...seg.finish(total));
        expect(got).toEqual(expected);
      },
    );
  }, 60_000); // ~0.7 s alone, several times that under the full parallel suite

  it('output invariants: ordered, inside the audio, never empty, bounded by max speech (3000 cases)', () => {
    forAll(
      { numRuns: 3000, seed: 7 },
      (rand) => ({
        probs: randomProbs(rand),
        params: randomParams(rand),
        rem: randInt(rand, 0, FRAME - 1),
      }),
      ({ probs, params, rem }) => {
        const total = (probs.length - 1) * FRAME + rem;
        const out = speechTimestampsFromProbs(probs, total, params);
        let prevEnd = -1;
        for (const s of out) {
          expect(s.start).toBeGreaterThanOrEqual(0);
          expect(s.end).toBeLessThanOrEqual(total);
          expect(s.end).toBeGreaterThan(s.start);
          expect(s.start).toBeGreaterThanOrEqual(prevEnd);
          prevEnd = s.end;
          if (Number.isFinite(params.maxSpeechDurationS)) {
            const pad = (16000 * params.speechPadMs) / 1000;
            // faster-whisper subtracts one frame and both pads from the limit before cutting, and the cut is
            // checked per frame, so a padded segment may exceed the maximum by about one frame
            expect(s.end - s.start).toBeLessThanOrEqual(
              16000 * params.maxSpeechDurationS + 2 * FRAME + 2 * pad,
            );
          }
        }
      },
    );
  }, 60_000); // ~1.3 s alone; timed out at 5 s under the full parallel suite (M6)
});

describe('segmenter rules that the defaults depend on', () => {
  /** n frames of 0.01 with 0.9 in the given [from, to) frame ranges */
  const speechAt = (n: number, ...ranges: [number, number][]) => {
    const p = new Float32Array(n).fill(0.01);
    for (const [a, b] of ranges) p.fill(0.9, a, b);
    return p;
  };

  it('compares the thresholds as float32 (numpy 2): a probability of exactly fround(0.45) is speech', () => {
    const p = new Float32Array(100).fill(0.01);
    p.fill(Math.fround(0.45), 10, 40);
    const segs = speechTimestampsFromProbs(p, 100 * FRAME, {
      ...CONFIGS['whisper'],
      speechPadMs: 0,
    });
    expect(segs).toEqual([{ start: 10 * FRAME, end: 40 * FRAME }]);
  });

  it('hysteresis: a dip between the thresholds does not end speech, one below neg does after min silence', () => {
    const p = new Float32Array(200).fill(0.01);
    p.fill(0.9, 10, 100);
    p.fill(0.35, 40, 80); // between neg (0.30) and threshold (0.45): still speech
    const params = { ...CONFIGS['whisper'], speechPadMs: 0 };
    expect(speechTimestampsFromProbs(p, 200 * FRAME, params)).toEqual([
      { start: 10 * FRAME, end: 100 * FRAME },
    ]);
    p.fill(0.2, 40, 80); // 40 frames = 1.28 s below neg: two segments
    expect(speechTimestampsFromProbs(p, 200 * FRAME, params)).toEqual([
      { start: 10 * FRAME, end: 40 * FRAME },
      { start: 80 * FRAME, end: 100 * FRAME },
    ]);
  });

  it('padding: neighbours closer than 2 x pad share the gap half and half', () => {
    const p = speechAt(140, [20, 40], [60, 80]);
    const params = { ...CONFIGS['whisper'], minSilenceDurationMs: 300 };
    const segs = speechTimestampsFromProbs(p, 140 * FRAME, params);
    // gap 20 frames = 10240 samples < 2 x 6400: each side gets 5120; the outer edges get the full 6400
    expect(segs).toEqual([
      { start: 20 * FRAME - 6400, end: 40 * FRAME + 5120 },
      { start: 60 * FRAME - 5120, end: 80 * FRAME + 6400 },
    ]);
  });

  it('max speech: cut at the last pause longer than 98 ms, hard cut when there is none', () => {
    const params = { ...CONFIGS['whisper'], maxSpeechDurationS: 2, speechPadMs: 0 };
    // a 5-frame dip below neg (frames 30..34: more than 98 ms, less than the 500 ms min silence) stays
    // inside speech, but it is where the 2 s cap cuts
    const p = speechAt(200, [10, 30], [35, 120]);
    const segs = speechTimestampsFromProbs(p, 200 * FRAME, params);
    expect(segs[0]).toEqual({ start: 10 * FRAME, end: 30 * FRAME });
    expect(segs[1].start).toBe(35 * FRAME);
    const hard = speechTimestampsFromProbs(speechAt(200, [10, 120]), 200 * FRAME, params);
    expect(hard[0].start).toBe(10 * FRAME);
    expect((hard[0].end - hard[0].start) / 16000).toBeLessThanOrEqual(2);
    expect(hard[1].start).toBeGreaterThan(hard[0].end);
  });
});
