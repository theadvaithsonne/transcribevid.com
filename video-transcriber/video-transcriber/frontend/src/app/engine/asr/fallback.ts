/**
 * The temperature fallback ladder of faster-whisper's `generate_with_fallback`, as pure decisions.
 */
import { TranscribeOptions } from './types';

export const DEFAULT_TEMPERATURES = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
export const MAX_NEW_TOKENS_LIMIT = 447;

export interface Thresholds {
  compressionRatio: number | null;
  logProb: number | null;
  noSpeech: number | null;
}

export interface AttemptMetrics {
  temperature: number;
  avgLogprob: number;
  compressionRatio: number;
}

/**
 * faster-whisper's avg_logprob: the cumulative log-prob (which includes the <|endoftext|> step) divided
 * by the number of generated tokens + 1.
 */
export function averageLogprob(sumLogprob: number, generatedTokens: number): number {
  return sumLogprob / (generatedTokens + 1);
}

/**
 * True when the attempt fails a quality test and the next temperature must be tried: the text
 * compresses too well (a loop), or the average log-prob is too low - unless the window is silence
 * (no_speech above its threshold together with the low log-prob), which is accepted as is.
 */
export function needsFallback(m: AttemptMetrics, noSpeechProb: number, t: Thresholds): boolean {
  let fallback = false;
  if (t.compressionRatio !== null && m.compressionRatio > t.compressionRatio) fallback = true;
  if (t.logProb !== null && m.avgLogprob < t.logProb) fallback = true;
  if (
    t.noSpeech !== null &&
    noSpeechProb > t.noSpeech &&
    t.logProb !== null &&
    m.avgLogprob < t.logProb
  ) {
    fallback = false;
  }
  return fallback;
}

/**
 * When every temperature failed: prefer the attempts whose compression ratio passed, and among those the
 * highest average log-prob (faster-whisper's `below_cr_threshold_results`).
 */
export function chooseFallback<T extends AttemptMetrics>(attempts: T[], t: Thresholds): T {
  const belowCr =
    t.compressionRatio === null
      ? attempts
      : attempts.filter((a) => a.compressionRatio <= t.compressionRatio!);
  const pool = belowCr.length ? belowCr : attempts;
  return pool.reduce((a, b) => (b.avgLogprob > a.avgLogprob ? b : a));
}

export interface ResolvedOptions {
  timestamps: boolean;
  task: 'transcribe' | 'translate';
  beam: number;
  bestOf: number;
  temperatures: number[];
  thresholds: Thresholds;
  maxNew: number;
  offset: number;
  repetitionPenalty: number;
  noRepeatNgram: number;
  seed: number;
  partialEvery: number;
  wordTimestamps: boolean;
  alignPrefix: 'notimestamps' | 'sot-lang-task';
}

/** Defaults: greedy with the full ladder, best_of 5, thresholds 2.4 / -1.0 / 0.6, 224 tokens. */
export function resolveOptions(o: TranscribeOptions): ResolvedOptions {
  return {
    timestamps: o.timestamps !== false,
    task: o.task ?? 'transcribe',
    beam: Math.max(1, o.beamSize ?? 1),
    bestOf: Math.max(1, o.bestOf ?? 5),
    temperatures: o.temperatures && o.temperatures.length ? o.temperatures : DEFAULT_TEMPERATURES,
    thresholds: {
      compressionRatio:
        o.compressionRatioThreshold === undefined ? 2.4 : o.compressionRatioThreshold,
      logProb: o.logProbThreshold === undefined ? -1.0 : o.logProbThreshold,
      noSpeech: o.noSpeechThreshold === undefined ? 0.6 : o.noSpeechThreshold,
    },
    maxNew: Math.max(1, Math.min(o.maxNewTokens ?? 224, MAX_NEW_TOKENS_LIMIT)),
    offset: o.offsetSeconds ?? 0,
    repetitionPenalty: o.repetitionPenalty ?? 1,
    noRepeatNgram: o.noRepeatNgramSize ?? 0,
    seed: o.seed ?? 1234,
    partialEvery: o.partialIntervalMs ?? 150,
    wordTimestamps: !!o.wordTimestamps,
    alignPrefix: o.alignPrefix ?? 'notimestamps',
  };
}
