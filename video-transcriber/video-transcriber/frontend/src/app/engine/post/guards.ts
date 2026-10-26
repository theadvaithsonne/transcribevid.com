/**
 * The decoding guards faster-whisper 1.2.1 applies per 30 s window, with the thresholds backend/app/engine.py passes
 * (engine.py:472-484): the temperature fallback with its compression-ratio / log-prob / no-speech gates, the
 * no-speech window skip, the word anomaly scores and the hallucination-silence guard. Line numbers refer to
 * backend/.venv/Lib/site-packages/faster_whisper/transcribe.py (1.2.1).
 */
import { pyRound, pySum } from './py';

/** engine.py:473 `temperature=[0.0, 0.2, 0.4, 0.6, 0.8, 1.0]` */
export const TEMPERATURES: readonly number[] = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
/** engine.py:472 `best_of=5` (hypotheses sampled per temperature > 0) */
export const BEST_OF = 5;
/** engine.py:476 `compression_ratio_threshold=2.4` */
export const COMPRESSION_RATIO_THRESHOLD = 2.4;
/** engine.py:477 `log_prob_threshold=-1.0` */
export const LOG_PROB_THRESHOLD = -1.0;
/** engine.py:478 `no_speech_threshold=0.6` */
export const NO_SPEECH_THRESHOLD = 0.6;
/** engine.py:480 `hallucination_silence_threshold=2.0` (only with word timestamps) */
export const HALLUCINATION_SILENCE_THRESHOLD = 2.0;
/** transcribe.py:1135: words made only of these characters are not scored by the anomaly test */
export const PUNCTUATION = '"\'“¿([{-"\'.。,，!！?？:：”)]}、';
/** transcribe.py:715 `frames_per_second` = 16000 / hop 160 */
export const FRAMES_PER_SECOND = 100;

export interface GuardThresholds {
  compressionRatio: number | null;
  logProb: number | null;
  noSpeech: number | null;
}

export const DEFAULT_THRESHOLDS: GuardThresholds = {
  compressionRatio: COMPRESSION_RATIO_THRESHOLD,
  logProb: LOG_PROB_THRESHOLD,
  noSpeech: NO_SPEECH_THRESHOLD,
};

/** The numbers of one decode attempt that the gates look at. */
export interface DecodeScores {
  /** mean log-probability of the generated tokens plus the end-of-text token */
  avgLogprob: number;
  compressionRatio: number;
  /** no_speech_prob of the window's first decoder step */
  noSpeechProb: number;
}

/**
 * transcribe.py:1463-1466: CTranslate2 returns the length-normalised score; the average log-probability counts the
 * end-of-text token too.
 */
export function avgLogprobFromScore(score: number, seqLen: number, lengthPenalty = 1): number {
  const cumLogprob = score * seqLen ** lengthPenalty;
  return cumLogprob / (seqLen + 1);
}

/** transcribe.py:1879-1881 `get_compression_ratio` once the zlib size is known (UTF-8 bytes / deflate bytes). */
export function compressionRatioFromSizes(textBytes: number, compressedBytes: number): number {
  return textBytes / compressedBytes;
}

/**
 * Size of zlib.compress(bytes) (level 6, zlib wrapper) through the browser's CompressionStream('deflate'). Different
 * zlib builds can differ by a few bytes; that matters only within about 1% of the 2.4 limit.
 */
export async function deflatedSize(bytes: Uint8Array<ArrayBuffer>): Promise<number> {
  const stream = new CompressionStream('deflate');
  const writer = stream.writable.getWriter();
  const written = writer.write(bytes).then(() => writer.close());
  const reader = stream.readable.getReader();
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
  }
  await written;
  return size;
}

/** transcribe.py:1879 `get_compression_ratio(text)`: len(utf8) / len(zlib.compress(utf8)). */
export async function compressionRatio(text: string): Promise<number> {
  const bytes = new TextEncoder().encode(text);
  return compressionRatioFromSizes(bytes.length, await deflatedSize(bytes));
}

/** transcribe.py:1479-1513: does this attempt need the next temperature? */
export function needsFallback(scores: DecodeScores, t: GuardThresholds = DEFAULT_THRESHOLDS): boolean {
  let needs = false;
  if (t.compressionRatio !== null && scores.compressionRatio > t.compressionRatio) {
    needs = true; // too repetitive
  }
  if (t.logProb !== null && scores.avgLogprob < t.logProb) {
    needs = true; // average log probability is too low
  }
  if (
    t.noSpeech !== null &&
    scores.noSpeechProb > t.noSpeech &&
    t.logProb !== null &&
    scores.avgLogprob < t.logProb
  ) {
    needs = false; // silence: accepted here, filtered later
  }
  return needs;
}

export interface FallbackResult<T> {
  result: T;
  /** the temperature that produced `result`, or the last one tried when every attempt failed */
  temperature: number;
  /** number of decode attempts made */
  tried: number;
}

/** transcribe.py:1517-1528: every temperature failed; best avg_logprob among the non-repetitive ones (first wins). */
function pickWhenAllFailed<T extends DecodeScores>(all: T[], belowCr: T[]): T {
  const pool = belowCr.length ? belowCr : all;
  let best = pool[0];
  for (const r of pool) if (r.avgLogprob > best.avgLogprob) best = r;
  return best;
}

/**
 * transcribe.py:1402-1530 `generate_with_fallback`: decode at T = 0 (beam search), then sample at 0.2 ... 1.0 while
 * an attempt fails the gates. `decode(temperature, index)` performs one attempt.
 */
export function generateWithFallback<T extends DecodeScores>(
  decode: (temperature: number, index: number) => T,
  thresholds: GuardThresholds = DEFAULT_THRESHOLDS,
  temperatures: readonly number[] = TEMPERATURES,
): FallbackResult<T> {
  const all: T[] = [];
  const belowCr: T[] = [];
  for (let i = 0; i < temperatures.length; i++) {
    const r = decode(temperatures[i], i);
    all.push(r);
    if (thresholds.compressionRatio !== null && r.compressionRatio <= thresholds.compressionRatio) {
      belowCr.push(r);
    }
    if (!needsFallback(r, thresholds)) return { result: r, temperature: temperatures[i], tried: i + 1 };
  }
  return {
    result: pickWhenAllFailed(all, belowCr),
    temperature: temperatures[temperatures.length - 1],
    tried: all.length,
  };
}

/** generateWithFallback for an asynchronous decoder (the ONNX worker). */
export async function generateWithFallbackAsync<T extends DecodeScores>(
  decode: (temperature: number, index: number) => Promise<T>,
  thresholds: GuardThresholds = DEFAULT_THRESHOLDS,
  temperatures: readonly number[] = TEMPERATURES,
): Promise<FallbackResult<T>> {
  const all: T[] = [];
  const belowCr: T[] = [];
  for (let i = 0; i < temperatures.length; i++) {
    const r = await decode(temperatures[i], i);
    all.push(r);
    if (thresholds.compressionRatio !== null && r.compressionRatio <= thresholds.compressionRatio) {
      belowCr.push(r);
    }
    if (!needsFallback(r, thresholds)) return { result: r, temperature: temperatures[i], tried: i + 1 };
  }
  return {
    result: pickWhenAllFailed(all, belowCr),
    temperature: temperatures[temperatures.length - 1],
    tried: all.length,
  };
}

/**
 * transcribe.py:1215-1235: skip the whole window (seek += segment_size, nothing emitted) when no_speech_prob > 0.6,
 * unless avg_logprob > -1.0. Note the strict tests: the app's segment filter (engine.py:500) uses < -1.0.
 */
export function shouldSkipWindow(
  noSpeechProb: number,
  avgLogprob: number,
  t: GuardThresholds = DEFAULT_THRESHOLDS,
): boolean {
  if (t.noSpeech === null) return false;
  let skip = noSpeechProb > t.noSpeech;
  if (t.logProb !== null && avgLogprob > t.logProb) skip = false;
  return skip;
}

export interface GuardWord {
  word: string;
  start: number;
  end: number;
  probability?: number;
}

export interface GuardSegment {
  start: number;
  end: number;
  words: GuardWord[] | null;
}

/** transcribe.py:1242-1252 `word_anomaly_score`: improbable, very short or very long words. */
export function wordAnomalyScore(word: GuardWord): number {
  const probability = word.probability ?? 0.0;
  const duration = word.end - word.start;
  let score = 0.0;
  if (probability < 0.15) score += 1.0;
  if (duration < 0.133) score += (0.133 - duration) * 15;
  if (duration > 2.0) score += duration - 2.0;
  return score;
}

/**
 * transcribe.py:1254-1260 `is_segment_anomaly`: the first 8 non-punctuation words score >= 3, or about one point per
 * word. (`w.word not in punctuation` is a substring test, as here.)
 */
export function isSegmentAnomaly(
  segment: Pick<GuardSegment, 'words'> | null | undefined,
): boolean {
  if (!segment || !segment.words || segment.words.length === 0) return false;
  const words = segment.words.filter((w) => !PUNCTUATION.includes(w.word)).slice(0, 8);
  const score = pySum(words.map(wordAnomalyScore)); // Python's compensated sum()
  return score >= 3 || score + 0.01 >= words.length;
}

/** transcribe.py:1262-1263 `next_words_segment` */
export function nextWordsSegment<S extends GuardSegment>(segments: readonly S[], from = 0): S | null {
  for (let i = from; i < segments.length; i++) if (segments[i].words?.length) return segments[i];
  return null;
}

/** faster_whisper/utils.py:148 `get_end`: end of the last word, else end of the last segment. */
export function getEnd(segments: readonly GuardSegment[]): number | null {
  for (let i = segments.length - 1; i >= 0; i--) {
    const words = segments[i].words ?? [];
    if (words.length) return words[words.length - 1].end;
  }
  return segments.length ? segments[segments.length - 1].end : null;
}

export interface GuardWindow<S extends GuardSegment> {
  /** the window's segments, word timestamps already added */
  segments: readonly S[];
  /** seek / 100 at the start of the window (s) */
  timeOffset: number;
  /** segment_size / 100 (s) */
  segmentDuration: number;
  /** (seek + 3000) / 100 (s) */
  windowEndTime: number;
  /** length of the (post-VAD) audio (s) and in frames */
  contentDuration: number;
  contentFrames: number;
  /** seek before this window, and after it as computed from the timestamps / last word */
  previousSeek: number;
  seek: number;
  lastSpeechTimestamp: number;
  threshold?: number;
  framesPerSecond?: number;
}

export interface GuardResult<S> {
  /** true: drop the whole window and continue decoding at `seek` (the leading silence is skipped) */
  skipWindow: boolean;
  seek: number;
  /** the segments to emit (cut at the first hallucination surrounded by silence) */
  segments: S[];
  lastSpeechTimestamp: number;
}

/**
 * transcribe.py:1293-1343, the hallucination-silence guard: (1) an anomalous first segment after more than 2 s of
 * silence makes the window restart at that segment; (2) an anomalous segment with silence (or another anomaly) on
 * both sides is cut together with everything after it, and decoding resumes at its start (or at the end of the file
 * when it is within 2 s of the end).
 */
export function hallucinationGuard<S extends GuardSegment>(w: GuardWindow<S>): GuardResult<S> {
  const threshold = w.threshold ?? HALLUCINATION_SILENCE_THRESHOLD;
  const fps = w.framesPerSecond ?? FRAMES_PER_SECOND;
  let segments = [...w.segments];
  let seek = w.seek;
  let lastSpeech = w.lastSpeechTimestamp;

  const first = nextWordsSegment(segments);
  if (first !== null && isSegmentAnomaly(first)) {
    const gap = first.start - w.timeOffset;
    if (gap > threshold) {
      return {
        skipWindow: true,
        seek: w.previousSeek + pyRound(gap * fps),
        segments,
        lastSpeechTimestamp: lastSpeech,
      };
    }
  }

  let halLastEnd = lastSpeech;
  for (let si = 0; si < segments.length; si++) {
    const segment = segments[si];
    if (!segment.words?.length) continue;
    if (isSegmentAnomaly(segment)) {
      const next = nextWordsSegment(segments, si + 1);
      const halNextStart =
        next !== null ? (next.words as GuardWord[])[0].start : w.timeOffset + w.segmentDuration;
      const silenceBefore =
        segment.start - halLastEnd > threshold ||
        segment.start < threshold ||
        segment.start - w.timeOffset < 2.0;
      const silenceAfter =
        halNextStart - segment.end > threshold ||
        isSegmentAnomaly(next) ||
        w.windowEndTime - segment.end < 2.0;
      if (silenceBefore && silenceAfter) {
        seek = pyRound(Math.max(w.timeOffset + 1, segment.start) * fps);
        if (w.contentDuration - segment.end < threshold) seek = w.contentFrames;
        segments = segments.slice(0, si);
        break;
      }
    }
    halLastEnd = segment.end;
  }

  const lastWordEnd = getEnd(segments);
  if (lastWordEnd !== null) lastSpeech = lastWordEnd;
  return { skipWindow: false, seek, segments, lastSpeechTimestamp: lastSpeech };
}
