/**
 * Subtitle cue re-flow: backend/app/formats.py:12-13, 41-115 (`SENTENCE_END`, `CLAUSE_END`, `_tokens`, `_wrap`,
 * `build_cues`). Cues flow across segment boundaries and split at sentence ends, clauses, pauses and the size limits,
 * using word timing (or evenly spread synthetic timing for edited lines).
 */
import { PY_NON_SPACE_RUNS, PY_SPACE_RUNS, pyLen, pyStrip } from '../post/py';

/**
 * formats.py:12 `[.!?…。！？]['\")\]]*$`. Python's `$` also matches before a final newline, hence the lookahead.
 */
export const SENTENCE_END = /[.!?…。！？]['")\]]*(?=\n?$)/u;
/** formats.py:13 `[,;:、，；：]['\")\]]*$` */
export const CLAUSE_END = /[,;:、，；：]['")\]]*(?=\n?$)/u;

/** formats.py:77 build_cues defaults; the API accepts max_chars 20..80 and max_lines 1..3 (main.py:598) */
export const DEFAULT_MAX_CHARS = 42;
export const DEFAULT_MAX_LINES = 2;
export const MAX_CUE_SECONDS = 6.0;
export const MIN_CUE_SECONDS = 0.8;
/** formats.py:101 `gap > 0.9`: a pause this long always starts a new cue */
export const PAUSE_SPLIT_SECONDS = 0.9;
/** formats.py:102 `text_len >= 12`: a sentence end splits once the cue has this many characters */
export const SENTENCE_SPLIT_MIN_CHARS = 12;
/** formats.py:103 `max_chars * 0.75`: a clause end splits once the cue is this full */
export const CLAUSE_SPLIT_FILL = 0.75;
/** formats.py:114 `c.start + 0.2`: a cue shortened to avoid an overlap keeps at least this long */
export const MIN_SHORTENED_CUE = 0.2;

export interface CueWord {
  start: number;
  end: number;
  /** keeps Whisper's leading space, so joining works for languages written without spaces */
  word: string;
}

export interface CueSegment {
  start: number;
  end: number;
  text: string;
  words?: readonly CueWord[] | null;
}

export interface Cue {
  start: number;
  end: number;
  text: string;
}

export interface CueOptions {
  maxChars?: number;
  maxLines?: number;
  maxDur?: number;
  minDur?: number;
}

/**
 * formats.py:41-57 `_tokens`: the segment's words, or (no word timing, e.g. after an edit) one token per
 * whitespace-separated part, spread over the segment in proportion to its length in characters.
 */
export function tokens(seg: CueSegment): CueWord[] {
  if (seg.words && seg.words.length) return seg.words.map((w) => ({ ...w }));
  const parts = seg.text.match(PY_NON_SPACE_RUNS) ?? [];
  if (!parts.length) return [];
  let total = 0;
  for (const p of parts) total += pyLen(p);
  total = total || 1;
  const dur = Math.max(seg.end - seg.start, 0.01);
  const out: CueWord[] = [];
  let t = seg.start;
  for (const p of parts) {
    const d = (dur * pyLen(p)) / total;
    out.push({ start: t, end: t + d, word: ` ${p}` });
    t += d;
  }
  return out;
}

/**
 * formats.py:60-74 `_wrap`: at most two balanced lines (even when max_lines is 3), preferring a split where both
 * lines fit; the first best split wins.
 */
export function wrap(text: string, maxChars: number, maxLines: number): string {
  text = pyStrip(text.replace(PY_SPACE_RUNS, ' '));
  if (pyLen(text) <= maxChars || maxLines < 2) return text;
  const words = text.split(' ');
  if (words.length === 1) return text;
  let best = text;
  let bestScore: number | null = null;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const longest = Math.max(pyLen(a), pyLen(b));
    const score = longest + (longest > maxChars ? 1000 : 0);
    if (bestScore === null || score < bestScore) {
      best = `${a}\n${b}`;
      bestScore = score;
    }
  }
  return best;
}

const joined = (words: readonly CueWord[]) => words.map((w) => w.word).join('');

/** formats.py:77-115 `build_cues` */
export function buildCues(segments: readonly CueSegment[], options: CueOptions = {}): Cue[] {
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS;
  const maxLines = options.maxLines ?? DEFAULT_MAX_LINES;
  const maxDur = options.maxDur ?? MAX_CUE_SECONDS;
  const minDur = options.minDur ?? MIN_CUE_SECONDS;
  const limit = maxChars * maxLines;
  const cues: Cue[] = [];
  let cur: CueWord[] = [];

  const flush = () => {
    if (!cur.length) return;
    const text = pyStrip(joined(cur));
    if (text) {
      cues.push({
        start: cur[0].start,
        end: cur[cur.length - 1].end,
        text: wrap(text, maxChars, maxLines),
      });
    }
    cur = [];
  };

  for (const seg of segments) {
    for (const w of tokens(seg)) {
      if (cur.length) {
        const last = cur[cur.length - 1];
        const textLen = pyLen(pyStrip(joined(cur)));
        const gap = w.start - last.end;
        const dur = last.end - cur[0].start;
        const prev = pyStrip(last.word);
        const newLen = textLen + pyLen(w.word);
        if (
          newLen > limit ||
          dur + (w.end - last.end) > maxDur ||
          gap > PAUSE_SPLIT_SECONDS ||
          (SENTENCE_END.test(prev) && textLen >= SENTENCE_SPLIT_MIN_CHARS) ||
          (CLAUSE_END.test(prev) && textLen >= maxChars * CLAUSE_SPLIT_FILL)
        ) {
          flush();
        }
      }
      cur.push(w);
    }
  }
  flush();

  // tidy timing: enforce a minimum on-screen time without overlapping the next cue
  for (let i = 0; i < cues.length; i++) {
    const c = cues[i];
    const nxt = i + 1 < cues.length ? cues[i + 1].start : null;
    if (c.end - c.start < minDur) c.end = c.start + minDur;
    if (nxt !== null && c.end > nxt) c.end = Math.max(c.start + MIN_SHORTENED_CUE, nxt);
  }
  return cues;
}
