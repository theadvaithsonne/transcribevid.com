/**
 * Transcript statistics and frequent terms: backend/app/formats.py:197-223 (`_STOP`, `compute_stats`). Recomputed
 * after every edit, restyle and delete; the UI shows words, pace, confidence and the keywords as search shortcuts.
 */
import type { Keyword, Stats } from '../../core/models';
import { pyLen, pyRound, pySum } from './py';

/** formats.py:221 `c < 0.6`: segments below this confidence are counted as low-confidence */
export const LOW_CONFIDENCE = 0.6;
/** formats.py:219 `if speech > 5`: no pace for less than 5 s of speech */
export const MIN_SPEECH_FOR_PACE = 5;
/** formats.py:213-214: top 80 by count, then words longer than 3 characters and not stop words, then the first 12 */
export const KEYWORD_POOL = 80;
export const KEYWORD_MIN_LENGTH = 4;
export const KEYWORD_COUNT = 12;

/** formats.py:197-204 `_STOP` */
export const STOP_WORDS: ReadonlySet<string> = new Set(
  `a about above after again all also am an and any are as at be because been before being
below between both but by can could did do does doing down during each few for from further had has have
having he her here hers herself him himself his how i if in into is it its itself just let me more most
my myself no nor not now of off on once only or other our ours ourselves out over own same she should so
some such than that the their theirs them themselves then there these they this those through to too under
until up very was we were what when where which while who whom why will with would you your yours yourself
yourselves dont doesnt didnt isnt arent wasnt werent cant couldnt wouldnt shouldnt im ive ill youre youve
thats theres heres whats lets gonna wanna okay yeah really like going know get got one thing things`.split(/\s+/),
);

/**
 * formats.py:209 `re.findall(r"[^\W\d_][\w'’]*", text.lower())`: a letter (or a non-decimal number such as '½')
 * followed by word characters and apostrophes. Python's \w has no combining marks, so Devanagari words are cut at
 * vowel signs (faithful; Roman Hinglish text is unaffected).
 */
const WORD_RE = /[\p{L}\p{Nl}\p{No}][\p{L}\p{N}_'’]*/gu;

export interface StatsSegment {
  start: number;
  end: number;
  text: string;
  confidence?: number | null;
}

/** formats.py:207-223 `compute_stats` (the `duration` argument is unused there too). */
export function computeStats(segments: readonly StatsSegment[], _duration?: number | null): Stats {
  const text = segments.map((s) => s.text).join(' ');
  const words = text.toLowerCase().match(WORD_RE) ?? [];
  const speech = pySum(segments.map((s) => Math.max(0.0, s.end - s.start))); // Python's compensated sum()
  const confs = segments
    .filter((s) => s.confidence !== null && s.confidence !== undefined)
    .map((s) => s.confidence as number);
  const freq = new Map<string, number>();
  for (const w of words) {
    const key = w.replace(/'/g, '').replace(/’/g, '');
    freq.set(key, (freq.get(key) ?? 0) + 1);
  }
  // Counter.most_common: by count, ties in first-seen order (Array.prototype.sort is stable)
  const common = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, KEYWORD_POOL);
  const keywords: Keyword[] = common
    .filter(([w]) => pyLen(w) >= KEYWORD_MIN_LENGTH && !STOP_WORDS.has(w))
    .slice(0, KEYWORD_COUNT)
    .map(([word, count]) => ({ word, count }));
  const confSum = pySum(confs);
  return {
    word_count: words.length,
    segment_count: segments.length,
    speech_seconds: pyRound(speech, 1),
    words_per_minute: speech > MIN_SPEECH_FOR_PACE ? pyRound(words.length / (speech / 60)) : null,
    avg_confidence: confs.length ? pyRound(confSum / confs.length, 3) : null,
    low_confidence_segments: confs.filter((c) => c < LOW_CONFIDENCE).length,
    keywords,
  };
}
