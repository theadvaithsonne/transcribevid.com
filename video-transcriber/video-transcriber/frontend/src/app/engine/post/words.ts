/**
 * Word-timing clean-up and timestamp restoration of faster-whisper 1.2.1 (transcribe.py, vad.py): punctuation
 * merging, the long-word truncation of add_word_timestamps, and the mapping of post-VAD times back to the original
 * recording. The DTW alignment itself (find_alignment) belongs to engine/asr; this module takes its output.
 */
import { pyRound, pyStrip } from './py';

/** transcribe.py:286 `prepend_punctuations` default */
export const PREPEND_PUNCTUATIONS = '"\'“¿([{-';
/** transcribe.py:287 `append_punctuations` default */
export const APPEND_PUNCTUATIONS = '"\'.。,，!！?？:：”)]}、';
/** transcribe.py:1608 */
export const SENTENCE_END_MARKS = '.。!！?？';
/** transcribe.py:1602 `min(0.7, median)` */
export const MAX_MEDIAN_WORD_DURATION = 0.7;

/** One entry of find_alignment's output (times relative to the window start). */
export interface AlignedWord {
  word: string;
  tokens: number[];
  start: number;
  end: number;
  probability: number;
}

/** transcribe.py:1910-1941 `merge_punctuations`, in place, exactly like the Python (substring tests included). */
export function mergePunctuations(
  alignment: AlignedWord[],
  prepended: string = PREPEND_PUNCTUATIONS,
  appended: string = APPEND_PUNCTUATIONS,
): void {
  let i = alignment.length - 2;
  let j = alignment.length - 1;
  while (i >= 0) {
    const previous = alignment[i];
    const following = alignment[j];
    if (previous.word.startsWith(' ') && prepended.includes(pyStrip(previous.word))) {
      following.word = previous.word + following.word;
      following.tokens = [...previous.tokens, ...following.tokens];
      previous.word = '';
      previous.tokens = [];
    } else {
      j = i;
    }
    i -= 1;
  }
  i = 0;
  j = 1;
  while (j < alignment.length) {
    const previous = alignment[i];
    const following = alignment[j];
    if (!previous.word.endsWith(' ') && appended.includes(following.word)) {
      previous.word = previous.word + following.word;
      previous.tokens = [...previous.tokens, ...following.tokens];
      following.word = '';
      following.tokens = [];
    } else {
      i = j;
    }
    j += 1;
  }
}

export interface TimedWord {
  word: string;
  start: number;
  end: number;
  probability: number;
}

/** A segment of one window as split by the timestamp tokens (tokens include timestamp tokens >= eot). */
export interface SubSegment {
  seek: number;
  start: number;
  end: number;
  tokens: number[];
}

export interface AlignOptions {
  /** <|endoftext|> id: tokens below it are text tokens */
  eot: number;
  prepend?: string;
  append?: string;
  framesPerSecond?: number;
}

/** numpy.median */
function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * transcribe.py:1567-1696 `add_word_timestamps` for one window, after find_alignment: words at sentence marks no
 * longer than twice the median word duration (median capped at 0.7 s), punctuation merged, words handed to the
 * subsegments by token count with times rounded to 2 decimals, the first word after a pause shortened, and the
 * segment's own start / end preferred when the first / last word is implausibly long. Returns new subsegments with
 * `words`; the inputs are not modified.
 */
export function addWordTimestamps<S extends SubSegment>(
  subsegments: readonly S[],
  alignment: readonly AlignedWord[],
  lastSpeechTimestamp: number,
  options: AlignOptions,
): { subsegments: (S & { words: TimedWord[] })[]; lastSpeechTimestamp: number } {
  const fps = options.framesPerSecond ?? 100;
  const al = alignment.map((a) => ({ ...a, tokens: [...a.tokens] }));
  const durations = al.map((w) => w.end - w.start).filter((d) => d !== 0);
  const medianDuration = Math.min(
    MAX_MEDIAN_WORD_DURATION,
    durations.length > 0 ? median(durations) : 0.0,
  );
  const maxDuration = medianDuration * 2;
  if (durations.length > 0) {
    for (let i = 1; i < al.length; i++) {
      if (al[i].end - al[i].start > maxDuration) {
        if (SENTENCE_END_MARKS.includes(al[i].word)) al[i].end = al[i].start + maxDuration;
        else if (SENTENCE_END_MARKS.includes(al[i - 1].word)) al[i].start = al[i].end - maxDuration;
      }
    }
  }
  mergePunctuations(al, options.prepend ?? PREPEND_PUNCTUATIONS, options.append ?? APPEND_PUNCTUATIONS);

  let last = lastSpeechTimestamp;
  if (subsegments.length === 0) return { subsegments: [], lastSpeechTimestamp: last };
  const timeOffset = subsegments[0].seek / fps;
  let wordIndex = 0;
  const out: (S & { words: TimedWord[] })[] = [];
  for (const source of subsegments) {
    const sub = { ...source, tokens: [...source.tokens] } as S & { words: TimedWord[] };
    const textTokens = sub.tokens.filter((t) => t < options.eot).length;
    let saved = 0;
    const words: TimedWord[] = [];
    while (wordIndex < al.length && saved < textTokens) {
      const timing = al[wordIndex];
      if (timing.word) {
        words.push({
          word: timing.word,
          start: pyRound(timeOffset + timing.start, 2),
          end: pyRound(timeOffset + timing.end, 2),
          probability: timing.probability,
        });
      }
      saved += timing.tokens.length;
      wordIndex += 1;
    }
    if (words.length > 0) {
      const w0 = words[0];
      if (
        w0.end - last > medianDuration * 4 &&
        (w0.end - w0.start > maxDuration ||
          (words.length > 1 && words[1].end - w0.start > maxDuration * 2))
      ) {
        if (words.length > 1 && words[1].end - words[1].start > maxDuration) {
          const boundary = Math.max(words[1].end / 2, words[1].end - maxDuration);
          w0.end = words[1].start = boundary;
        }
        w0.start = Math.max(0, w0.end - maxDuration);
      }
      if (sub.start < w0.end && sub.start - 0.5 > w0.start) {
        w0.start = Math.max(0, Math.min(w0.end - medianDuration, sub.start));
      } else {
        sub.start = w0.start;
      }
      const wl = words[words.length - 1];
      if (sub.end > wl.start && sub.end + 0.5 < wl.end) {
        wl.end = Math.max(wl.start + medianDuration, sub.end);
      } else {
        sub.end = wl.end;
      }
      last = sub.end;
    }
    sub.words = words;
    out.push(sub);
  }
  return { subsegments: out, lastSpeechTimestamp: last };
}

export interface SpeechChunk {
  /** sample indices into the original audio */
  start: number;
  end: number;
}

/** Python bisect.bisect (bisect_right) */
function bisectRight(values: readonly number[], x: number): number {
  let lo = 0;
  let hi = values.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (x < values[mid]) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

/** faster_whisper/vad.py:246-285 `SpeechTimestampsMap`: post-VAD time -> original recording time. */
export class SpeechTimestampsMap {
  private readonly chunkEndSample: number[] = [];
  private readonly totalSilenceBefore: number[] = [];

  constructor(
    chunks: readonly SpeechChunk[],
    private readonly samplingRate = 16000,
    private readonly timePrecision = 2,
  ) {
    let previousEnd = 0;
    let silentSamples = 0;
    for (const chunk of chunks) {
      silentSamples += chunk.start - previousEnd;
      previousEnd = chunk.end;
      this.chunkEndSample.push(chunk.end - silentSamples);
      this.totalSilenceBefore.push(silentSamples / samplingRate);
    }
  }

  getOriginalTime(time: number, chunkIndex: number | null = null, isEnd = false): number {
    const index = chunkIndex ?? this.getChunkIndex(time, isEnd);
    return pyRound(this.totalSilenceBefore[index] + time, this.timePrecision);
  }

  getChunkIndex(time: number, isEnd = false): number {
    const sample = Math.trunc(time * this.samplingRate);
    if (isEnd) {
      const exact = this.chunkEndSample.indexOf(sample);
      if (exact >= 0) return exact;
    }
    return Math.min(bisectRight(this.chunkEndSample, sample), this.chunkEndSample.length - 1);
  }
}

export interface RestorableSegment {
  start: number;
  end: number;
  words: { start: number; end: number }[] | null;
}

/**
 * transcribe.py:1844-1870 `restore_speech_timestamps`: each word is mapped with the chunk of its midpoint (so start
 * and end stay in one chunk) and the segment takes its first / last word's times; segments without words map their
 * start, and their end with the chunk-end rule. Returns copies.
 */
export function restoreSpeechTimestamps<S extends RestorableSegment>(
  segments: readonly S[],
  chunks: readonly SpeechChunk[],
  samplingRate = 16000,
): S[] {
  const map = new SpeechTimestampsMap(chunks, samplingRate);
  return segments.map((source) => {
    const segment = { ...source };
    if (source.words && source.words.length) {
      const words = source.words.map((w) => {
        const index = map.getChunkIndex((w.start + w.end) / 2);
        return { ...w, start: map.getOriginalTime(w.start, index), end: map.getOriginalTime(w.end, index) };
      });
      segment.start = words[0].start;
      segment.end = words[words.length - 1].end;
      segment.words = words;
    } else {
      segment.start = map.getOriginalTime(source.start);
      segment.end = map.getOriginalTime(source.end, null, true);
    }
    return segment;
  });
}
