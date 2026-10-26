/**
 * Offline, best-effort conversational Roman Hindi; this is not translation.
 *
 * A faithful port of the rule layer of backend/app/hinglish.py. Latin text, punctuation and timing stay intact.
 * Common spellings make everyday Hindi and English loanwords readable; other Devanagari words go through the
 * trained IndicXlit model (indicxlit.ts, running in a Web Worker) or, when the visitor chooses the 'basic'
 * option, through the rule-based phonetic romanizer. Recognition errors and ambiguous spellings still need review.
 *
 * Differences from the Python module are only those the language forces: the trained model is asynchronous in the
 * browser (it lives in a worker), so the functions that may call it return promises; the model is passed in
 * (`NeuralConverter`) instead of being found on disk; and the words of a segment are converted in one batch.
 */
import { CONSONANTS, MARKS, NUKTA, SPELLINGS, VOWELS } from './hinglish-data';

export class RomanizerUnavailable extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RomanizerUnavailable';
  }
}

export type RomanizerName = 'basic' | 'indicxlit' | 'auto';

/** What the converter needs from the trained model; IndicXlit (indicxlit.ts) and its worker client satisfy it. */
export interface NeuralConverter {
  transliterate(words: string[], options?: { beamSize?: number }): string[] | Promise<string[]>;
}

export interface WordTiming {
  word: string;
  original_word?: string;
  [key: string]: unknown;
}

export interface Segment {
  text: string;
  words?: WordTiming[] | null;
  original_text?: string;
  romanizer?: string;
  conversion_warning?: string;
  edited?: boolean;
  [key: string]: unknown;
}

export interface ConvertOptions {
  /** The trained converter. Without it, 'indicxlit' fails and 'auto' falls back to 'basic'. */
  neural?: NeuralConverter | null;
}

export const BASIC_WARNING =
  'Basic phonetic conversion is being used. Names and unfamiliar words may have awkward spelling.';
/**
 * Longest Devanagari run (symbols after NFC) handed to the trained model. The server applies no limit of its own
 * (CTranslate2 silently truncates at 1,024 tokens and converts even a 2,000-symbol run), but one such run costs
 * about ten seconds and 45 MB in the browser. Longer runs are not words; they get the rule-based spelling and the
 * segment carries LONG_RUN_WARNING, like the 'basic' fallback does.
 */
export const MAX_NEURAL_RUN = 256;
export const LONG_RUN_WARNING =
  'Basic phonetic conversion was used for one or more very long words (over 256 characters). Their spelling may be awkward.';
const NO_ROMAN_SPELLING =
  'IndicXlit returned no valid Roman spelling. Review this word or choose Basic romanization.';
const UNAVAILABLE =
  'IndicXlit is unavailable. Load the converter model or choose Basic romanization.';
/** The server's beam width for IndicXlit (backend/app/indicxlit.py: beam_size=max(4, topk)). */
const SERVER_BEAM = 4;

const WORD_SOURCE = '[\\u0900-\\u0963\\u0971-\\u097f]+';
const DIGIT_FROM = Array.from('०१२३४५६७८९।॥');
const DIGIT_TO = Array.from('0123456789..');
const DIGITS = new Map(DIGIT_FROM.map((c, i) => [c, DIGIT_TO[i]]));

const NUKTA_SIGN = '़';
const VIRAMA = '्';
const ANUSVARA = 'ं';
const CHANDRABINDU = 'ँ';
const VISARGA = 'ः';
const IGNORED = '़्‌‍';

/** The Devanagari runs the converter works on (digits and the danda are handled separately). */
export function devanagariRuns(text: string): string[] {
  return text.match(new RegExp(WORD_SOURCE, 'g')) ?? [];
}

function hasDevanagari(text: string): boolean {
  return new RegExp(WORD_SOURCE).test(text);
}

function translateDigits(text: string): string {
  let out = '';
  for (const ch of text) out += DIGITS.get(ch) ?? ch;
  return out;
}

type Syllable = [string, string, boolean]; // consonant, vowel, is_inherent_schwa

function romanizeWordBasic(raw: string): string {
  const nfc = raw.normalize('NFC');
  const known = SPELLINGS.get(nfc);
  if (known !== undefined) return known;
  // Decompose precomposed nukta consonants so both Unicode spellings agree.
  const word = Array.from(nfc.normalize('NFD'));
  const syllables: Syllable[] = [];
  let i = 0;
  while (i < word.length) {
    const char = word[i];
    const consonant = CONSONANTS.get(char);
    const vowel = VOWELS.get(char);
    if (consonant !== undefined) {
      let sound = consonant;
      if (i + 1 < word.length && word[i + 1] === NUKTA_SIGN) {
        sound = NUKTA.get(char) ?? sound;
        i += 1;
      }
      let v = 'a';
      let inherent = true;
      const mark = i + 1 < word.length ? MARKS.get(word[i + 1]) : undefined;
      if (mark !== undefined) {
        v = mark;
        inherent = false;
        i += 1;
      } else if (i + 1 < word.length && word[i + 1] === VIRAMA) {
        v = '';
        inherent = false;
        i += 1;
      }
      syllables.push([sound, v, inherent]);
    } else if (vowel !== undefined) {
      syllables.push(['', vowel, false]);
    } else if (char === ANUSVARA || char === CHANDRABINDU) {
      syllables.push(['n', '', false]);
    } else if (char === VISARGA) {
      syllables.push(['h', '', false]);
    } else if (!IGNORED.includes(char)) {
      // Keep unfamiliar characters rather than silently losing text.
      syllables.push([char, '', false]);
    }
    i += 1;
  }
  if (syllables.length > 1 && syllables[syllables.length - 1][2])
    syllables[syllables.length - 1][1] = '';
  for (let j = syllables.length - 2; j > 0; j--) {
    if (syllables[j][2] && syllables[j - 1][1] !== '' && syllables[j + 1][1] !== '')
      syllables[j][1] = '';
  }
  return syllables.map(([c, v]) => c + v).join('');
}

function substitute(text: string, convert: (run: string) => string): string {
  return translateDigits(text.replace(new RegExp(WORD_SOURCE, 'g'), (run) => convert(run)));
}

/** Rule-based ('basic') conversion. Synchronous and available without any model. */
export function romanizeBasic(text: string): string {
  return substitute(text, romanizeWordBasic);
}

/**
 * Convert the Devanagari runs of `texts` with the spelling dictionary first and the trained model for the rest
 * (one batch, each distinct run once, no cache outlives the caller's `cache`). Runs longer than MAX_NEURAL_RUN get
 * the rule-based spelling; the result says whether that happened. Throws RomanizerUnavailable.
 */
async function fillCache(
  texts: string[],
  cache: Map<string, string>,
  neural: NeuralConverter | null | undefined,
): Promise<{ longRuns: boolean }> {
  const pending: string[] = [];
  const seen = new Set<string>();
  let longRuns = false;
  for (const text of texts) {
    for (const run of devanagariRuns(text)) {
      if (cache.has(run) || seen.has(run)) continue;
      seen.add(run);
      const nfc = run.normalize('NFC');
      const spelled = SPELLINGS.get(nfc);
      if (spelled) cache.set(run, spelled);
      else if (Array.from(nfc).length > MAX_NEURAL_RUN) {
        cache.set(run, romanizeWordBasic(run));
        longRuns = true;
      } else pending.push(run);
    }
  }
  if (pending.length === 0) return { longRuns };
  if (!neural) throw new RomanizerUnavailable(UNAVAILABLE);
  const converted = await neural.transliterate(pending, { beamSize: SERVER_BEAM });
  if (converted.length !== pending.length) throw new RomanizerUnavailable(NO_ROMAN_SPELLING);
  for (let i = 0; i < pending.length; i++) {
    const candidate = converted[i];
    if (typeof candidate !== 'string' || !/^[A-Za-z'-]+$/.test(candidate)) {
      throw new RomanizerUnavailable(NO_ROMAN_SPELLING);
    }
    cache.set(pending[i], candidate);
  }
  return { longRuns };
}

/** Convert Hindi script without rewriting English or guessing missing words. */
export async function romanize(
  text: string,
  method: 'basic' | 'indicxlit' = 'basic',
  options: ConvertOptions & { cache?: Map<string, string> } = {},
): Promise<string> {
  if (method !== 'indicxlit') return romanizeBasic(text);
  const cache = options.cache ?? new Map<string, string>();
  await fillCache([text], cache, options.neural);
  return substitute(text, (run) => cache.get(run) as string);
}

function resolveMethod(romanizer: RomanizerName, options: ConvertOptions): 'basic' | 'indicxlit' {
  if (romanizer === 'auto') return options.neural ? 'indicxlit' : 'basic';
  return romanizer;
}

function convertWith(
  segment: Segment,
  method: 'basic' | 'indicxlit',
  convert: (run: string) => string,
): Segment {
  const result: Segment = { ...segment };
  const text = substitute(segment.text, convert);
  if (hasDevanagari(segment.text)) {
    result.romanizer = method;
    if (method === 'basic') result.conversion_warning = BASIC_WARNING;
  }
  if (text !== segment.text) {
    result.text = text;
    result.original_text = segment.text;
  }
  if (segment.words && segment.words.length > 0) {
    result.words = segment.words.map((word) => {
      const item: WordTiming = { ...word };
      const converted = substitute(word.word, convert);
      if (converted !== word.word) {
        item.word = converted;
        item.original_word = word.word;
      }
      return item;
    });
  }
  return result;
}

/** Apply the same spelling to segment and word text; retain recognition evidence. Does not modify its input. */
export async function convertSegment<T extends Segment>(
  segment: T,
  romanizer: RomanizerName = 'basic',
  options: ConvertOptions = {},
): Promise<T & Segment> {
  const method = resolveMethod(romanizer, options);
  if (method === 'basic') return convertWith(segment, 'basic', romanizeWordBasic) as T & Segment;
  // Recognition text must never be cached across transcripts: the cache lives for this one call.
  const cache = new Map<string, string>();
  const { longRuns } = await fillCache(
    [segment.text, ...(segment.words ?? []).map((w) => w.word)],
    cache,
    options.neural,
  );
  const result = convertWith(segment, 'indicxlit', (run) => cache.get(run) as string);
  if (longRuns) result.conversion_warning = LONG_RUN_WARNING;
  return result as T & Segment;
}

/** Synchronous convertSegment for the 'basic' romanizer (no model involved). */
export function convertSegmentBasic<T extends Segment>(segment: T): T & Segment {
  return convertWith(segment, 'basic', romanizeWordBasic) as T & Segment;
}

/** Reconvert recognition evidence, retaining user edits rather than overwriting them. */
export async function restyleSegment<T extends Segment>(
  segment: T,
  outputScript: string,
  romanizer: RomanizerName = 'auto',
  options: ConvertOptions = {},
): Promise<T & Segment> {
  if (segment.edited) return { ...segment };
  const result: Segment = { ...segment };
  result.text = segment.original_text ?? segment.text;
  result.original_text = result.text;
  delete result.romanizer;
  delete result.conversion_warning;
  if (segment.words && segment.words.length > 0) {
    result.words = segment.words.map((w) => ({ ...w, word: w.original_word ?? w.word }));
  }
  return (
    outputScript === 'hinglish' ? await convertSegment(result, romanizer, options) : result
  ) as T & Segment;
}
