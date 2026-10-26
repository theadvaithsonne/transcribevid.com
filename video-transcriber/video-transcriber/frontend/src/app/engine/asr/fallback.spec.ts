import {
  averageLogprob,
  chooseFallback,
  DEFAULT_TEMPERATURES,
  needsFallback,
  resolveOptions,
  Thresholds,
} from './fallback';
import { TINY_WASM_PASSAGE_C } from './fixtures/reference-runs';

const APP: Thresholds = { compressionRatio: 2.4, logProb: -1.0, noSpeech: 0.6 };
const m = (temperature: number, avgLogprob: number, compressionRatio: number) => ({
  temperature,
  avgLogprob,
  compressionRatio,
});

describe('averageLogprob', () => {
  it('reproduces the recorded avg_logprob of passage-c (the sum includes the <|endoftext|> step)', () => {
    const p = TINY_WASM_PASSAGE_C;
    const sum = p.tokenLogprobs.reduce((a, b) => a + b, 0);
    expect(p.tokenLogprobs.length).toBe(p.tokens.length + 1);
    expect(averageLogprob(sum, p.tokens.length)).toBeCloseTo(p.avgLogprob, 12);
  });
});

describe('needsFallback (faster-whisper generate_with_fallback)', () => {
  it('accepts clean speech at temperature 0 (base passage-b: -0.116, ratio 1.52)', () => {
    expect(needsFallback(m(0, -0.116, 1.52), 0.002, APP)).toBe(false);
  });

  it('falls back on a repetition loop (ratio 8.17 on the Bengali clip)', () => {
    expect(needsFallback(m(0, -0.2, 8.17), 0.01, APP)).toBe(true);
  });

  it('falls back on a low average log-prob', () => {
    expect(needsFallback(m(0, -1.75, 0.84), 0.3, APP)).toBe(true);
  });

  it('accepts silence as it is: no_speech above 0.6 together with a low log-prob', () => {
    expect(needsFallback(m(0, -1.4, 0.9), 0.99, APP)).toBe(false);
    // faster-whisper checks silence last, so it wins over a high ratio too
    expect(needsFallback(m(0, -1.4, 5), 0.99, APP)).toBe(false);
    expect(needsFallback(m(0, -0.5, 5), 0.99, APP)).toBe(true);
  });

  it('skips the tests whose threshold is null', () => {
    const none: Thresholds = { compressionRatio: null, logProb: null, noSpeech: null };
    expect(needsFallback(m(0, -5, 9), 0.1, none)).toBe(false);
    expect(needsFallback(m(0, -5, 9), 0.1, { ...APP, logProb: null })).toBe(true);
    expect(needsFallback(m(0, -5, 1), 0.1, { ...APP, logProb: null })).toBe(false);
  });
});

describe('chooseFallback', () => {
  it('prefers attempts under the compression threshold, then the best average log-prob', () => {
    const attempts = [m(0, -0.3, 6), m(0.2, -1.2, 1.1), m(0.4, -1.1, 1.3), m(0.6, -0.2, 3)];
    expect(chooseFallback(attempts, APP).temperature).toBe(0.4);
  });

  it('uses every attempt when none passes the compression test', () => {
    const attempts = [m(0, -0.9, 6), m(0.2, -0.4, 7), m(0.4, -0.6, 3)];
    expect(chooseFallback(attempts, APP).temperature).toBe(0.2);
    expect(chooseFallback(attempts, { ...APP, compressionRatio: null }).temperature).toBe(0.2);
  });
});

describe('resolveOptions', () => {
  it('defaults to greedy with the full ladder and the app thresholds', () => {
    const r = resolveOptions({});
    expect(r.beam).toBe(1);
    expect(r.bestOf).toBe(5);
    expect(r.temperatures).toEqual(DEFAULT_TEMPERATURES);
    expect(r.temperatures).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1.0]);
    expect(r.thresholds).toEqual(APP);
    expect(r.maxNew).toBe(224);
    expect(r.timestamps).toBe(true);
    expect(r.wordTimestamps).toBe(false);
    expect(r.task).toBe('transcribe');
    expect(r.alignPrefix).toBe('notimestamps');
    expect(r.offset).toBe(0);
    expect(r.partialEvery).toBe(150);
  });

  it('keeps beam 5, a single temperature, null thresholds and caps the token budget', () => {
    const r = resolveOptions({
      beamSize: 5,
      temperatures: [0],
      compressionRatioThreshold: null,
      logProbThreshold: null,
      noSpeechThreshold: null,
      maxNewTokens: 9999,
      offsetSeconds: 26.7,
    });
    expect(r.beam).toBe(5);
    expect(r.temperatures).toEqual([0]);
    expect(r.thresholds).toEqual({ compressionRatio: null, logProb: null, noSpeech: null });
    expect(r.maxNew).toBe(447);
    expect(r.offset).toBe(26.7);
  });

  it('treats an empty ladder as the default one and a beam below 1 as greedy', () => {
    const r = resolveOptions({ temperatures: [], beamSize: 0 });
    expect(r.temperatures).toEqual(DEFAULT_TEMPERATURES);
    expect(r.beam).toBe(1);
  });
});
