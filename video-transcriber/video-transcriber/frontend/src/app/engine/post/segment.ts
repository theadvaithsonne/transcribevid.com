/**
 * The app-level segment pipeline of backend/app/engine.py `_recognise` (lines 490-525): the empty / no-speech
 * filters, the repetition-loop breaker, the segment dict with its confidence math, the Hinglish hook and
 * original_text. Input is what the decoder hands over per segment (faster-whisper's Segment fields).
 */
import type { JobOptions, Segment, Word } from '../../core/models';
import { LOG_PROB_THRESHOLD, NO_SPEECH_THRESHOLD } from './guards';
import { pyRound, pyStrip } from './py';
import { fixNumberText, mergeNumberPieces, norm } from './text';

// The app's own no-speech filter (engine.py:500) reuses the decoder thresholds of engine.py:477-478 (guards.ts).
/** engine.py:508 `if repeats >= 3`: of N identical consecutive lines the first three are kept */
export const MAX_REPEATS = 3;
/** engine.py:410 `math.exp(max(min(avg_logprob, 0.0), -10.0))` */
export const LOGPROB_FLOOR = -10.0;

export interface RawWord {
  start: number;
  end: number;
  word: string;
  probability: number;
}

/** One decoded segment before post-processing (faster-whisper's Segment: text keeps its leading space). */
export interface RawSegment {
  start: number;
  end: number;
  text: string;
  words: RawWord[] | null;
  avg_logprob: number;
  no_speech_prob: number;
}

export interface DroppedCounts {
  empty: number;
  no_speech: number;
  repetition: number;
}

/**
 * engine.py:401-413 `_segment_dict`. Times rounded to 2 decimals, probabilities to 3; number pieces merged
 * (mergeNumberPieces) BEFORE the confidence, which is the mean word probability, or exp(clamp(avg_logprob, -10, 0))
 * without words. An empty word list becomes null.
 */
export function segmentDict(idx: number, s: RawSegment): Segment {
  const rounded: Word[] = (s.words ?? []).map((w) => ({
    start: pyRound(w.start, 2),
    end: pyRound(w.end, 2),
    word: w.word,
    probability: pyRound(w.probability, 3),
  }));
  const words = mergeNumberPieces(rounded, s.text);
  const text = fixNumberText(pyStrip(s.text));
  let conf: number;
  if (words.length) {
    let sum = 0;
    for (const w of words) sum += w.probability;
    conf = sum / words.length;
  } else {
    conf = Math.exp(Math.max(Math.min(s.avg_logprob, 0.0), LOGPROB_FLOOR));
  }
  return {
    id: idx,
    start: pyRound(s.start, 2),
    end: pyRound(s.end, 2),
    text,
    words: words.length ? words : null,
    confidence: pyRound(conf, 3),
    no_speech_prob: pyRound(s.no_speech_prob, 3),
  };
}

/**
 * The streaming filter of engine.py:490-512, one instance per transcription. accept() returns the segment dict
 * (ids are dense, 0-based, after filtering) or null when the segment is dropped:
 *  - empty text after strip()                                     -> dropped.empty
 *  - no_speech_prob > 0.6 and avg_logprob < -1.0 ("made-up silence") -> dropped.no_speech
 *  - 4th and later identical consecutive line (case / punctuation ignored, _norm) -> dropped.repetition
 * The repetition key is updated for every segment that passes the first two filters, including dropped repeats.
 */
export class SegmentFilter {
  readonly dropped: DroppedCounts = { empty: 0, no_speech: 0, repetition: 0 };
  private repeats = 0;
  private lastNorm: string | null = null;
  private kept = 0;

  accept(s: RawSegment): Segment | null {
    const text = pyStrip(s.text);
    if (!text) {
      this.dropped.empty++;
      return null;
    }
    if (s.no_speech_prob > NO_SPEECH_THRESHOLD && s.avg_logprob < LOG_PROB_THRESHOLD) {
      this.dropped.no_speech++;
      return null;
    }
    const n = norm(text);
    this.repeats = n === this.lastNorm ? this.repeats + 1 : 0;
    this.lastNorm = n;
    if (this.repeats >= MAX_REPEATS) {
      this.dropped.repetition++;
      return null;
    }
    return segmentDict(this.kept++, s);
  }

  /** The log line of engine.py:522-523 ('' when nothing was dropped). */
  summary(): string {
    const parts = Object.entries(this.dropped)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`);
    return parts.length ? `filtered out segments: ${parts.join(', ')}` : '';
  }
}

/** engine.py:513: Hindi / English transcripts become Hinglish unless the user chose the original script or translate. */
export function shouldRomanize(
  options: Pick<JobOptions, 'output_script' | 'task'>,
  language: string | null,
): boolean {
  return (
    options.output_script === 'hinglish' &&
    options.task === 'transcribe' &&
    (language === 'hi' || language === 'en')
  );
}

/**
 * engine.py:515 `seg.setdefault("original_text", s.text.strip())`: the raw recognition text (before number repair)
 * unless the Hinglish conversion already recorded one.
 */
export function withOriginalText(seg: Segment, raw: Pick<RawSegment, 'text'>): Segment {
  return 'original_text' in seg ? seg : { ...seg, original_text: pyStrip(raw.text) };
}

/** engine.py:520 live progress for a kept segment: min(end / duration, 1.0) on the original timeline. */
export function segmentProgress(raw: Pick<RawSegment, 'end'>, duration: number): number {
  return Math.min(raw.end / duration, 1.0);
}

/** A synchronous Hinglish converter (e.g. engine/hinglish convertSegmentBasic); the worker may run its async one. */
export type SegmentConverter = (seg: Segment, romanizer: JobOptions['romanizer']) => Segment;

export interface PostprocessOptions {
  options: Pick<JobOptions, 'output_script' | 'task' | 'romanizer'>;
  language: string | null;
  /** seconds of the ORIGINAL audio (len(audio) / 16000), for the live progress */
  duration: number;
  convert?: SegmentConverter;
}

export interface PostprocessResult {
  segments: Segment[];
  dropped: DroppedCounts;
  /** live progress reported with each kept segment, in order */
  progress: number[];
}

/** engine.py:490-521 over a whole list (tests, re-runs); the worker uses SegmentFilter segment by segment. */
export function postprocessSegments(
  raws: readonly RawSegment[],
  { options, language, duration, convert }: PostprocessOptions,
): PostprocessResult {
  const filter = new SegmentFilter();
  const segments: Segment[] = [];
  const progress: number[] = [];
  const romanize = convert && shouldRomanize(options, language);
  for (const raw of raws) {
    let seg = filter.accept(raw);
    if (!seg) continue;
    if (romanize) seg = convert(seg, options.romanizer ?? 'auto');
    seg = withOriginalText(seg, raw);
    segments.push(seg);
    progress.push(segmentProgress(raw, duration));
  }
  return { segments, dropped: { ...filter.dropped }, progress };
}

/** engine.py:524-525: the recognition result the job stores (probability to 3 decimals, duration to 2). */
export function recognitionResult(
  language: string | null,
  languageProbability: number,
  duration: number,
  segments: Segment[],
): { language: string | null; language_probability: number; duration: number; segments: Segment[] } {
  return {
    language,
    language_probability: pyRound(languageProbability, 3),
    duration: pyRound(duration, 2),
    segments,
  };
}
