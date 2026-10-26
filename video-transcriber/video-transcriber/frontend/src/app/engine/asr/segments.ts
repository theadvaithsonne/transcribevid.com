/**
 * Timestamp tokens -> segments, faster-whisper's seek rule (`consumedSeconds`) and the reconciliation
 * of segment edges with word times. Everything here is window-relative; the engine adds the offset.
 */
import { median } from './dsp';
import { TIME_PRECISION } from './logits';
import { Word } from './types';

export interface TokenSegment {
  start: number;
  end: number;
  toks: number[];
  unfinished?: boolean;
}

export interface ParsedSegments {
  segments: TokenSegment[];
  consumedSeconds: number;
  singleTimestampEnding: boolean;
}

/**
 * Splits a generated token sequence at its timestamp tokens.
 * - two timestamps in a row are a segment boundary; a text run without a closing timestamp is kept as
 *   `unfinished` (end = window end);
 * - `consumedSeconds` follows faster-whisper: the whole window when the sequence ends with a single
 *   closing timestamp or has no boundary, otherwise the end of the last completed segment, so the
 *   caller's seek loop restarts there and nothing after a boundary is lost;
 * - without timestamp tokens (timestamps: false) the whole window is one segment.
 */
export function parseSegments(
  gen: number[],
  ids: { eot: number; tsBegin: number },
  audioSeconds: number,
  timestamps: boolean,
): ParsedSegments {
  const tb = ids.tsBegin;
  const segments: TokenSegment[] = [];
  let consumedSeconds = audioSeconds;
  const lastTwo = gen.slice(-2);
  const singleTimestampEnding = gen.length >= 2 && lastTwo[0] < tb && lastTwo[1] >= tb;
  if (!timestamps) {
    const toks = gen.filter((x) => x < ids.eot);
    if (toks.length) segments.push({ start: 0, end: audioSeconds, toks });
    return { segments, consumedSeconds, singleTimestampEnding };
  }
  let cur: { start: number; toks: number[] } | null = null;
  let lastEnd = 0;
  let pairs = 0;
  for (let i = 0; i < gen.length; i++) {
    const tok = gen[i];
    if (tok >= tb) {
      const ts = (tok - tb) * TIME_PRECISION;
      if (i > 0 && gen[i - 1] >= tb) pairs++;
      if (!cur) cur = { start: ts, toks: [] };
      else if (!cur.toks.length) cur.start = ts;
      else {
        segments.push({ start: cur.start, end: ts, toks: cur.toks });
        lastEnd = ts;
        cur = null;
      }
    } else if (tok < ids.eot) {
      if (!cur) cur = { start: lastEnd, toks: [] };
      cur.toks.push(tok);
    }
  }
  if (cur && cur.toks.length) {
    segments.push({
      start: cur.start,
      end: Math.min(audioSeconds, 30),
      toks: cur.toks,
      unfinished: true,
    });
  }
  if (pairs > 0 && !singleTimestampEnding) {
    const done = segments.filter((s) => !s.unfinished);
    consumedSeconds = done.length ? done[done.length - 1].end : audioSeconds;
  } else if (pairs === 0) {
    // no boundary: a single segment up to the last timestamp (faster-whisper then moves a whole window)
    const stamps = gen.filter((x) => x >= tb);
    const last = stamps[stamps.length - 1];
    if (stamps.length && last !== tb && segments.length === 1) {
      segments[0].end = Math.min(audioSeconds, (last - tb) * TIME_PRECISION);
    }
  }
  return { segments, consumedSeconds, singleTimestampEnding };
}

export interface ReconciledEdges {
  start: number;
  end: number;
  /** End of speech after this segment (input of the next call). */
  lastSpeech: number;
}

/**
 * faster-whisper's segment / word boundary reconciliation (mutates the words):
 * - a first word that is far from the previous speech and unreasonably long is shortened;
 * - the segment start / end follow the first / last word unless the timestamp token is clearly
 *   earlier / later (then the word is adjusted instead).
 */
export function reconcileSegmentEdges(
  start: number,
  end: number,
  words: Word[],
  lastSpeech: number,
): ReconciledEdges {
  if (!words.length) return { start, end, lastSpeech };
  const durations = words.map((w) => w.end - w.start).filter((d) => d > 0);
  const med = Math.min(0.7, median(durations));
  const maxD = med * 2;
  const first = words[0];
  if (
    first.end - lastSpeech > med * 4 &&
    (first.end - first.start > maxD || (words.length > 1 && words[1].end - first.start > maxD * 2))
  ) {
    if (words.length > 1 && words[1].end - words[1].start > maxD) {
      const b = Math.max(words[1].end / 2, words[1].end - maxD);
      first.end = b;
      words[1].start = b;
    }
    first.start = Math.max(0, first.end - maxD);
  }
  let s = start;
  let e = end;
  if (s < first.end && s - 0.5 > first.start)
    first.start = Math.max(0, Math.min(first.end - med, s));
  else s = first.start;
  const last = words[words.length - 1];
  if (e > last.start && e + 0.5 < last.end) last.end = Math.max(last.start + med, e);
  else e = last.end;
  return { start: s, end: e, lastSpeech: e };
}

/** Mean word probability, or exp(avgLogprob) clamped to [exp(-10), 1] when there are no words. */
export function confidenceOf(words: Word[], avgLogprob: number): number {
  if (words.length) return words.reduce((p, w) => p + w.probability, 0) / words.length;
  return Math.exp(Math.max(Math.min(avgLogprob, 0), -10));
}
