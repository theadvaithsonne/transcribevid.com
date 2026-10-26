/**
 * Logit rules of one decoder step (OpenAI / faster-whisper semantics) and the language softmax.
 * Transformers.js 4.3.1's WhisperTimeStampLogitsProcessor lacks two of the rules (timestamps must not
 * decrease, max_initial_timestamp), so the engine applies the full set itself.
 */
import { logSumExpRange } from './dsp';

export interface TokenIds {
  sot: number;
  eot: number;
  noTimestamps: number;
  /** First timestamp token (<|0.00|>); tsBegin + k encodes k * 0.02 s. */
  tsBegin: number;
  /** <|startofprev|> */
  prev: number;
  /** <|nospeech|> (older exports: <|nocaptions|>) */
  nospeech: number;
  translate: number;
  transcribe: number;
}

/** The multilingual vocabulary (tiny .. large-v2); large-v3 shifts them by one, load() reads the real ones. */
export const DEFAULT_TOKEN_IDS: TokenIds = {
  sot: 50258,
  eot: 50257,
  noTimestamps: 50363,
  tsBegin: 50364,
  prev: 50361,
  nospeech: 50362,
  translate: 50358,
  transcribe: 50359,
};

export const TIME_PRECISION = 0.02;

export interface LogitRuleOptions {
  timestamps: boolean;
  repetitionPenalty: number;
  noRepeatNgram: number;
  suppress: number[];
  beginSuppress: number[];
  maxInitialTimestampIndex: number;
}

/**
 * Applies, in place: suppress lists, repetition penalty, no-repeat n-gram, and the timestamp rules
 * (pairs, monotonic, max initial timestamp, "timestamps beat text" sampling rule).
 * `genTokens` are the tokens generated so far in this window (no prefix); `first` = first step.
 */
export function applyLogitRules(
  row: Float32Array,
  genTokens: number[],
  first: boolean,
  ids: TokenIds,
  o: LogitRuleOptions,
): void {
  for (const t of o.suppress) row[t] = -Infinity;
  if (first) for (const t of o.beginSuppress) row[t] = -Infinity;
  if (o.repetitionPenalty && o.repetitionPenalty !== 1 && genTokens.length) {
    for (const t of new Set(genTokens)) {
      row[t] = row[t] < 0 ? row[t] * o.repetitionPenalty : row[t] / o.repetitionPenalty;
    }
  }
  if (o.noRepeatNgram > 0 && genTokens.length >= o.noRepeatNgram - 1) {
    const n = o.noRepeatNgram;
    const prefix = genTokens.slice(genTokens.length - (n - 1));
    for (let i = 0; i + n <= genTokens.length; i++) {
      let match = true;
      for (let k = 0; k < n - 1; k++) if (genTokens[i + k] !== prefix[k]) match = false;
      if (match) row[genTokens[i + n - 1]] = -Infinity;
    }
  }
  if (!o.timestamps) {
    row[ids.noTimestamps] = -Infinity;
    for (let t = ids.tsBegin; t < row.length; t++) row[t] = -Infinity;
    return;
  }
  row[ids.noTimestamps] = -Infinity;
  const seq = genTokens;
  const lastWasTs = seq.length >= 1 && seq[seq.length - 1] >= ids.tsBegin;
  const penultimateWasTs = seq.length < 2 || seq[seq.length - 2] >= ids.tsBegin;
  if (lastWasTs) {
    if (penultimateWasTs) for (let t = ids.tsBegin; t < row.length; t++) row[t] = -Infinity;
    else for (let t = 0; t < ids.eot; t++) row[t] = -Infinity;
  }
  let lastTs = -1;
  for (let i = seq.length - 1; i >= 0; i--) {
    if (seq[i] >= ids.tsBegin) {
      lastTs = seq[i];
      break;
    }
  }
  if (lastTs >= 0) {
    // monotonic, and a segment must have a non-zero length
    const lim = lastWasTs && !penultimateWasTs ? lastTs : lastTs + 1;
    for (let t = ids.tsBegin; t < Math.min(lim, row.length); t++) row[t] = -Infinity;
  }
  if (seq.length === 0) {
    for (let t = 0; t < ids.tsBegin; t++) row[t] = -Infinity;
    const lastAllowed = ids.tsBegin + o.maxInitialTimestampIndex;
    for (let t = lastAllowed + 1; t < row.length; t++) row[t] = -Infinity;
  }
  // if the total probability of the timestamps beats every text token, a timestamp must be sampled
  const lse = logSumExpRange(row, 0, row.length);
  const tsLp = logSumExpRange(row, ids.tsBegin, row.length) - lse;
  let maxText = -Infinity;
  for (let t = 0; t < ids.tsBegin; t++) if (row[t] > maxText) maxText = row[t];
  if (tsLp > maxText - lse) for (let t = 0; t < ids.tsBegin; t++) row[t] = -Infinity;
}

/**
 * Softmax over the language tokens of the first decoder step. `langToId` is the generation config's
 * map ('<|en|>' -> id). Returns (code, probability) pairs, descending.
 */
export function languageProbabilities(
  logits: Float32Array,
  langToId: Record<string, number>,
): Array<[string, number]> {
  const entries = Object.entries(langToId);
  let max = -Infinity;
  for (const [, id] of entries) if (logits[id] > max) max = logits[id];
  let sum = 0;
  for (const [, id] of entries) sum += Math.exp(logits[id] - max);
  return entries
    .map(
      ([k, id]) => [k.replace(/[<|>]/g, ''), Math.exp(logits[id] - max) / sum] as [string, number],
    )
    .sort((a, b) => b[1] - a[1]);
}
