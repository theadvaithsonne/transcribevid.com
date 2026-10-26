/**
 * The engine-agnostic text rules of the Qwen3-ASR adapter, ported from backend/app/qwen_engine.py (token_key,
 * trim_overlap, repeated_phrase) and from the `qwen_asr` package the adapter calls implicitly (Apache-2.0,
 * QwenLM/Qwen3-ASR `qwen_asr/inference/utils.py`: detect_and_fix_repetitions, parse_asr_output).
 *
 * Source of this file: docs/in-browser/spike/qwen.md Appendix A, differential-tested against the Python functions on
 * 16,000 random cases (multilingual text, Turkish dotted I, German sharp s, Greek final sigma, ligatures, combining
 * marks, emoji, exotic whitespace) with zero mismatches. Only types were added; keep it that way.
 */
import { CASEFOLD_EXTRAS } from './casefold-extras';

/** Python's str.casefold(): toLowerCase() per code point, except the 324 code points where Python folds further. */
export function casefold(s: string): string {
  let out = '';
  for (const ch of s) out += CASEFOLD_EXTRAS.get(ch.codePointAt(0)!) ?? ch.toLowerCase();
  return out;
}

// Python's str.isspace() set (used by re '\s', str.split() and str.lstrip()); JS '\s' differs on U+001C-1F, U+0085, U+FEFF.
const PY_WS = '\u0009-\u000d\u001c- \u0085   -  -   　';
const NON_WS_RUN = new RegExp('[^' + PY_WS + ']+', 'gu');
const WS_RUN = new RegExp('[' + PY_WS + ']+', 'u');
const LEADING_WS = new RegExp('^[' + PY_WS + ']+', 'u');
const EDGE_WS = new RegExp('^[' + PY_WS + ']+|[' + PY_WS + ']+$', 'gu');
// str.splitlines()
const LINE_BREAK = new RegExp('\\r\\n|[\\n\\r\\v\\f\\u001c\\u001d\\u001e\\u0085\\u2028\\u2029]', 'u');
// unicodedata.category(c)[0] in "LNM"
const KEEP = /^[\p{L}\p{N}\p{M}]$/u;

/** Python's str.strip() (its whitespace set, not JavaScript's). */
export function pyWsStrip(s: string): string {
  return s.replace(EDGE_WS, '');
}

/** qwen_engine.token_key: NFC, casefold, letters / numbers / marks only. */
export function tokenKey(token: string): string {
  let out = '';
  for (const ch of casefold(token.normalize('NFC'))) if (KEEP.test(ch)) out += ch;
  return out;
}

/**
 * qwen_engine.trim_overlap: remove only a substantial exact suffix/prefix match at an audio overlap (>= 3 words),
 * ignoring case and punctuation. Never fuzzy: unmatched text is kept for review rather than silently lost.
 * Returns [text without the repeated words, number of words removed].
 */
export function trimOverlap(previous: string, current: string, maxWords = 24): [string, number] {
  const left = [...previous.matchAll(NON_WS_RUN)].map((m) => tokenKey(m[0]));
  const right = [...current.matchAll(NON_WS_RUN)];
  const keys = right.map((m) => tokenKey(m[0]));
  for (let size = Math.min(maxWords, left.length, keys.length); size > 2; size--) {
    let ok = true;
    for (let i = 0; i < size; i++) {
      if (!keys[i]) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    for (let i = 0; i < size; i++) {
      if (left[left.length - size + i] !== keys[i]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      const cut = right[size - 1].index! + right[size - 1][0].length;
      return [current.slice(cut).replace(LEADING_WS, ''), size];
    }
  }
  return [current, 0];
}

/** qwen_engine.repeated_phrase: a review signal, never an instruction to delete potentially spoken words. */
export function repeatedPhrase(text: string): boolean {
  const words = text.split(WS_RUN).map(tokenKey).filter(Boolean);
  const maxWidth = Math.min(12, Math.floor(words.length / 3));
  for (let width = 3; width <= maxWidth; width++) {
    for (let start = 0; start <= words.length - 3 * width; start++) {
      let same = true;
      for (let i = 0; i < width && same; i++) {
        if (words[start + i] !== words[start + width + i] || words[start + i] !== words[start + 2 * width + i]) {
          same = false;
        }
      }
      if (same) return true;
    }
  }
  return false;
}

/** qwen_asr detect_and_fix_repetitions: collapses runaway character runs (> threshold) and pattern runs (>= threshold). */
export function detectAndFixRepetitions(text: string, threshold = 20): string {
  const fixCharRepeats = (cp: string[], thresh: number): string[] => {
    const res: string[] = [];
    let i = 0;
    const n = cp.length;
    while (i < n) {
      let count = 1;
      while (i + count < n && cp[i + count] === cp[i]) count++;
      if (count > thresh) {
        res.push(cp[i]);
        i += count;
      } else {
        for (let j = 0; j < count; j++) res.push(cp[i + j]);
        i += count;
      }
    }
    return res;
  };
  const same = (cp: string[], a: number, b: number, k: number): boolean => {
    for (let j = 0; j < k; j++) if (cp[a + j] !== cp[b + j]) return false;
    return true;
  };
  const fixPatternRepeats = (cp: string[], thresh: number, maxLen = 20): string[] => {
    const n = cp.length;
    const minRepeat = thresh * 2;
    if (n < minRepeat) return cp;
    let i = 0;
    const result: string[] = [];
    let found = false;
    while (i <= n - minRepeat) {
      found = false;
      for (let k = 1; k <= maxLen; k++) {
        if (i + k * thresh > n) break;
        let valid = true;
        for (let rep = 1; rep < thresh; rep++) {
          const startIdx = i + rep * k;
          // Python compares s[startIdx:startIdx+k] with the pattern; a short tail slice never equals it
          if (startIdx + k > n || !same(cp, startIdx, i, k)) {
            valid = false;
            break;
          }
        }
        if (valid) {
          let endIndex = i + thresh * k;
          while (endIndex + k <= n && same(cp, endIndex, i, k)) endIndex += k;
          for (let j = 0; j < k; j++) result.push(cp[i + j]);
          for (const c of fixPatternRepeats(cp.slice(endIndex), thresh, maxLen)) result.push(c);
          i = n;
          found = true;
          break;
        }
      }
      if (found) break;
      result.push(cp[i]);
      i++;
    }
    if (!found) for (let j = i; j < n; j++) result.push(cp[j]);
    return result;
  };
  return fixPatternRepeats(fixCharRepeats(Array.from(text), threshold), threshold).join('');
}

export interface ParsedAsrOutput {
  /** the language name as the model wrote it, title-cased ("Hindi"); '' when none or silent */
  language: string;
  text: string;
}

/**
 * qwen_asr parse_asr_output: raw decoder text -> { language, text }. `language X<asr_text>` comes first unless the
 * language was forced (then the text is all there is), `language None` means silence.
 */
export function parseAsrOutput(raw: string | null | undefined, userLanguage: string | null = null): ParsedAsrOutput {
  if (raw == null) return { language: '', text: '' };
  let s = pyWsStrip(String(raw));
  if (!s) return { language: '', text: '' };
  s = detectAndFixRepetitions(s);
  if (userLanguage) return { language: userLanguage, text: s };
  const tag = '<asr_text>';
  if (!s.includes(tag)) return { language: '', text: pyWsStrip(s) };
  const at = s.indexOf(tag);
  const meta = s.slice(0, at);
  const textPart = s.slice(at + tag.length);
  if (meta.toLowerCase().includes('language none')) return { language: '', text: pyWsStrip(textPart) };
  let lang = '';
  for (const line0 of meta.split(LINE_BREAK)) {
    const line = pyWsStrip(line0);
    if (!line) continue;
    if (line.toLowerCase().startsWith('language ')) {
      const val = pyWsStrip(line.slice('language '.length));
      if (val) lang = val.slice(0, 1).toUpperCase() + val.slice(1).toLowerCase();
      break;
    }
  }
  return { language: lang, text: pyWsStrip(textPart) };
}
