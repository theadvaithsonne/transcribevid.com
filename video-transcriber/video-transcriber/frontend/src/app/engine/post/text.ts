/**
 * Text normalisation helpers of backend/app/engine.py: the repetition key (_norm) and the number repair for
 * Whisper's "10 000" (= ten thousand).
 */
import { pyRound, pyStrip } from './py';

/**
 * engine.py:367-368 `_norm`: re.sub(r"[\W_]+", " ", text.lower()).strip(). Python's \w is letters and numbers but
 * not combining marks, so Devanagari vowel signs become spaces ('नमस्ते!' -> 'नमस त'); the repetition guard only
 * compares these keys for equality.
 */
export function norm(text: string): string {
  return pyStrip(text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' '));
}

/** engine.py:371 `_THOUSANDS_HEAD` (fullmatch); Python's \d is any Unicode decimal digit. */
const THOUSANDS_HEAD = /^\p{Nd}{1,3}(?:,\p{Nd}{3})*$/u;
/** engine.py:372 `_THOUSANDS_TAIL` (fullmatch) */
const THOUSANDS_TAIL = /^\p{Nd}{3}$/u;
/** engine.py:373 `_ZERO_TRIPLE_TEXT` */
const ZERO_TRIPLE_TEXT = /(?<![\p{Nd}.,])(\p{Nd}{1,3}(?:,\p{Nd}{3})*) 000(?!\p{Nd})/gu;

/**
 * engine.py:376-379 `fix_number_text`: Whisper writes "ten thousand" as "10 000" (the word "thousand" becomes the
 * digits 000 and the comma is lost); "000" never stands alone in speech, so "10 000" is 10,000.
 */
export function fixNumberText(text: string): string {
  return text.replace(ZERO_TRIPLE_TEXT, (_m, head: string) => `${head},000`);
}

/** A word as merge_number_pieces sees it; extra keys are kept. */
export interface NumberWord {
  start: number;
  end: number;
  word: string;
  probability?: number | null;
}

/**
 * engine.py:382-398 `merge_number_pieces`: re-join " 10" + " 000" (000 = "thousand") and " 10" + " 250" when the
 * segment text itself reads "10,250". The merged word keeps the first word's start and leading space, takes the
 * second's end and the mean probability (rounded to 3 decimals). The input is not modified.
 */
export function mergeNumberPieces<W extends NumberWord>(words: readonly W[], text: string): W[] {
  const out: W[] = [];
  for (const w of words) {
    const prev = out.length ? out[out.length - 1] : undefined;
    if (prev !== undefined) {
      const a = pyStrip(prev.word);
      const b = pyStrip(w.word);
      if (
        THOUSANDS_HEAD.test(a) &&
        THOUSANDS_TAIL.test(b) &&
        (b === '000' || text.includes(`${a},${b}`))
      ) {
        prev.word += `,${b}`;
        prev.end = w.end;
        if (prev.probability != null && w.probability != null) {
          prev.probability = pyRound((prev.probability + w.probability) / 2, 3);
        }
        continue;
      }
    }
    out.push({ ...w });
  }
  return out;
}
