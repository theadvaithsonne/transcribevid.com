/**
 * The languages of the Qwen3-ASR adapter (backend/app/qwen_engine.py LANGUAGES, 30 codes) and the names the model
 * understands (qwen_asr SUPPORTED_LANGUAGES).
 *
 * The server passes `engine.LANGUAGES[code]` as the model's language, which breaks for two codes (qwen.md section 4,
 * "defects found in the existing Python adapter"): `tl` is "Tagalog" in engine.py but "Filipino" for Qwen (the
 * server fails at run time), and `yue` (Cantonese) is not in engine.LANGUAGES at all. The browser port maps both to
 * the model's own names; everything else is the server's mapping.
 */
import { LANGUAGES } from '../jobs/reference-data';

/** qwen_engine.LANGUAGES, in the server's order. */
export const QWEN_LANGUAGE_CODES: readonly string[] = [
  'zh', 'en', 'yue', 'ar', 'de', 'fr', 'es', 'pt', 'id', 'it', 'ko', 'ru', 'th', 'vi', 'ja',
  'tr', 'hi', 'ms', 'nl', 'sv', 'da', 'fi', 'pl', 'cs', 'tl', 'fa', 'el', 'hu', 'mk', 'ro',
];

/** qwen_asr SUPPORTED_LANGUAGES. */
export const QWEN_SUPPORTED_NAMES: readonly string[] = [
  'Chinese', 'English', 'Cantonese', 'Arabic', 'German', 'French', 'Spanish', 'Portuguese', 'Indonesian', 'Italian',
  'Korean', 'Russian', 'Thai', 'Vietnamese', 'Japanese', 'Turkish', 'Hindi', 'Malay', 'Dutch', 'Swedish', 'Danish',
  'Finnish', 'Polish', 'Czech', 'Filipino', 'Persian', 'Greek', 'Romanian', 'Hungarian', 'Macedonian',
];

/** Where the model's name differs from engine.LANGUAGES (the two fixes described above). */
const NAME_FIXES: Readonly<Record<string, string>> = { tl: 'Filipino', yue: 'Cantonese' };

export function isQwenLanguage(code: string | null | undefined): boolean {
  return !!code && QWEN_LANGUAGE_CODES.includes(code);
}

/** The language name Qwen is forced to ("Hindi"), or null for auto-detection / a language it does not know. */
export function qwenLanguageName(code: string | null | undefined): string | null {
  if (!code || !isQwenLanguage(code)) return null;
  const name = NAME_FIXES[code] ?? LANGUAGES[code] ?? null;
  return name && QWEN_SUPPORTED_NAMES.includes(name) ? name : null;
}

/**
 * The language code of a name the model wrote ("Hindi" -> 'hi'), like the server's
 * `{name.lower(): code for code, name in engine.LANGUAGES.items()}`; plus Filipino -> 'tl'. Cantonese stays unknown
 * (null), as on the server, because the app's language list has no 'yue'.
 */
export function codeForQwenName(name: string | null | undefined): string | null {
  const key = (name ?? '').toLowerCase();
  if (!key) return null;
  if (key === 'filipino') return 'tl';
  for (const [code, n] of Object.entries(LANGUAGES)) if (n.toLowerCase() === key) return code;
  return null;
}
