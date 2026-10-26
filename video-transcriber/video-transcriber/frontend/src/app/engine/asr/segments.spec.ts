import {
  BASE_WEBGPU_PASSAGE_B,
  RecordedSegment,
  RecordedWord,
  TINY_WASM_PASSAGE_B,
  TINY_WASM_PASSAGE_C,
} from './fixtures/reference-runs';
import { DEFAULT_TOKEN_IDS } from './logits';
import { confidenceOf, parseSegments, reconcileSegmentEdges } from './segments';
import { Word } from './types';

const ids = DEFAULT_TOKEN_IDS;
const ts = (s: number) => ids.tsBegin + Math.round(s / 0.02);
const toWords = (ws: RecordedWord[]): Word[] =>
  ws.map(([word, start, end, probability]) => ({ word, start, end, probability }));

describe('parseSegments: the recorded passage-c window (tiny WASM q8)', () => {
  const p = TINY_WASM_PASSAGE_C;
  const parsed = parseSegments(p.tokens, ids, p.audioSeconds, true);

  it('finds one segment with the same text tokens as the reference', () => {
    expect(parsed.segments.length).toBe(1);
    expect(parsed.segments[0].toks).toEqual(p.segments[0].tokens);
    expect(parsed.segments[0].unfinished).toBeUndefined();
  });

  it('applies the seek rule: a single closing timestamp consumes the whole window', () => {
    expect(parsed.singleTimestampEnding).toBe(p.singleTimestampEnding);
    expect(parsed.consumedSeconds).toBe(p.consumedSeconds);
  });

  it('clips a segment without a boundary to the audio length (closing token says 7.00 s)', () => {
    expect(p.tokens.at(-1)).toBe(ts(7.0));
    expect(parsed.segments[0].start).toBe(0);
    expect(parsed.segments[0].end).toBe(p.audioSeconds);
  });

  it('reconciles the segment edges with the word times exactly like the reference', () => {
    const words = toWords(p.segments[0].words);
    const before = words.map((w) => ({ ...w }));
    const edges = reconcileSegmentEdges(parsed.segments[0].start, parsed.segments[0].end, words, 0);
    expect(edges.start).toBe(p.segments[0].start);
    expect(edges.end).toBe(p.segments[0].end);
    expect(words).toEqual(before);
    expect(confidenceOf(words, p.avgLogprob)).toBeCloseTo(p.segments[0].confidence!, 12);
  });
});

describe('parseSegments: segment boundaries and the seek rule', () => {
  const A = 100;
  const B = 101;
  const C = 102;
  const D = 103;

  it('splits at a timestamp pair and consumes the whole window after a single closing timestamp', () => {
    const gen = [ts(0), A, B, ts(1.0), ts(1.2), C, D, ts(2.5)];
    const r = parseSegments(gen, ids, 3.0, true);
    expect(r.segments.map((s) => [s.start, s.end, s.toks])).toEqual([
      [0, 1.0, [A, B]],
      [1.2, 2.5, [C, D]],
    ]);
    expect(r.singleTimestampEnding).toBe(true);
    expect(r.consumedSeconds).toBe(3.0);
  });

  it('consumes only up to the last completed segment when the model stops mid-segment', () => {
    // the recorded "cut mid-sentence" case of q2-windows: consumedSeconds 6.0, last segment unfinished
    const gen = [ts(0), A, B, ts(6.0), ts(6.0), C, D];
    const r = parseSegments(gen, ids, 9.6, true);
    expect(r.segments.map((s) => [s.start, s.end, !!s.unfinished])).toEqual([
      [0, 6.0, false],
      [6.0, 9.6, true],
    ]);
    expect(r.singleTimestampEnding).toBe(false);
    expect(r.consumedSeconds).toBe(6.0);
  });

  it('ends on a timestamp pair: consumed up to that segment end', () => {
    const gen = [ts(0), A, ts(2.0), ts(2.0), B, ts(4.0), ts(4.0)];
    const r = parseSegments(gen, ids, 10, true);
    expect(r.segments.map((s) => [s.start, s.end])).toEqual([
      [0, 2.0],
      [2.0, 4.0],
    ]);
    expect(r.consumedSeconds).toBe(4.0);
  });

  it('keeps text that has no timestamp at all as one unfinished segment over the window', () => {
    const r = parseSegments([A, B], ids, 5, true);
    expect(r.segments).toEqual([{ start: 0, end: 5, toks: [A, B], unfinished: true }]);
    expect(r.consumedSeconds).toBe(5);
  });

  it('makes one segment over the window without timestamp tokens', () => {
    const r = parseSegments([A, B, C], ids, 4.2, false);
    expect(r.segments).toEqual([{ start: 0, end: 4.2, toks: [A, B, C] }]);
  });

  it('returns no segment for an empty decode (e.g. only a timestamp)', () => {
    expect(parseSegments([ts(0)], ids, 2, true).segments).toEqual([]);
    expect(parseSegments([], ids, 2, false).segments).toEqual([]);
  });
});

describe('reconcileSegmentEdges against the recorded passage-b runs', () => {
  const runs: Array<[string, RecordedSegment[]]> = [
    ['tiny WASM q8', TINY_WASM_PASSAGE_B.segments],
    ['base WebGPU fp16', BASE_WEBGPU_PASSAGE_B.segments],
  ];
  for (const [name, segments] of runs) {
    it(`is a fixed point on the reference output (${name}, ${segments.length} segments)`, () => {
      let lastSpeech = 0;
      for (const s of segments) {
        const words = toWords(s.words);
        const edges = reconcileSegmentEdges(s.start, s.end, words, lastSpeech);
        expect([edges.start, edges.end]).toEqual([s.start, s.end]);
        expect(words).toEqual(toWords(s.words));
        lastSpeech = edges.lastSpeech;
      }
    });
  }

  it('follows the words when the timestamp tokens are looser than them', () => {
    const words = toWords(TINY_WASM_PASSAGE_B.segments[1].words);
    const edges = reconcileSegmentEdges(2.2, 6.4, words, 1.54);
    expect(edges.start).toBe(words[0].start);
    expect(edges.end).toBe(words.at(-1)!.end);
  });

  it('pulls a first word back to the segment start when the timestamp is clearly later', () => {
    const words = [
      { word: ' a', start: 1.0, end: 2.0, probability: 1 },
      { word: ' b', start: 2.0, end: 2.3, probability: 1 },
      { word: ' c', start: 2.3, end: 2.6, probability: 1 },
    ];
    const edges = reconcileSegmentEdges(1.8, 2.6, words, 1.0);
    expect(words[0].start).toBeCloseTo(1.7, 6); // min(end - median 0.3, segment start 1.8)
    expect(edges.start).toBe(1.8);
  });
});

describe('confidenceOf', () => {
  it('is the mean word probability, or exp(avg_logprob) clamped when there are no words', () => {
    expect(confidenceOf([{ word: 'a', start: 0, end: 1, probability: 0.5 }], -3)).toBe(0.5);
    expect(confidenceOf([], -0.5)).toBeCloseTo(Math.exp(-0.5), 12);
    expect(confidenceOf([], 0.2)).toBe(1);
    expect(confidenceOf([], -50)).toBeCloseTo(Math.exp(-10), 12);
  });
});
