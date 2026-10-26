/**
 * The server's reference data, copied from backend/app/engine.py so the in-browser edition shows the same lists:
 * MODEL_CATALOG (labels, notes, speed / accuracy marks, in the UI's order) and LANGUAGES (/api/languages).
 * Download sizes are not taken from here: the browser downloads ONNX builds, whose real sizes come from the device
 * plan (engine/device).
 */

export interface ModelUi {
  id: string;
  label: string;
  /** the server's download size (CTranslate2 build), MB; the browser shows its own ONNX size instead */
  size_mb: number;
  speed: number;
  accuracy: number;
  note: string;
  engine: 'whisper' | 'qwen';
}

/** engine.py MODEL_CATALOG (order matters: shown in this order). */
export const MODEL_UI: readonly ModelUi[] = [
  { id: 'tiny', label: 'Tiny', size_mb: 75, speed: 5, accuracy: 1, note: 'Fastest, rough drafts only', engine: 'whisper' },
  { id: 'base', label: 'Base', size_mb: 145, speed: 4, accuracy: 2, note: 'Fast, clean audio', engine: 'whisper' },
  { id: 'small', label: 'Small', size_mb: 465, speed: 3, accuracy: 3, note: 'Good balance (default)', engine: 'whisper' },
  { id: 'medium', label: 'Medium', size_mb: 1500, speed: 2, accuracy: 4, note: 'High accuracy, slower', engine: 'whisper' },
  {
    id: 'large-v3-turbo',
    label: 'Large v3 Turbo',
    size_mb: 1600,
    speed: 3,
    accuracy: 5,
    note: 'Near-best accuracy, much faster than Large',
    engine: 'whisper',
  },
  { id: 'large-v3', label: 'Large v3', size_mb: 3100, speed: 1, accuracy: 5, note: 'Best accuracy, slowest', engine: 'whisper' },
  {
    id: 'distil-large-v3',
    label: 'Distil Large v3',
    size_mb: 1500,
    speed: 4,
    accuracy: 4,
    note: 'English only, very fast and accurate',
    engine: 'whisper',
  },
  {
    id: 'qwen3-asr-0.6b',
    label: 'Qwen3 ASR 0.6B',
    size_mb: 1300,
    speed: 2,
    accuracy: 0,
    note: 'Experimental: compare on your audio; chunk timestamps',
    engine: 'qwen',
  },
  {
    id: 'qwen3-asr-1.7b',
    label: 'Qwen3 ASR 1.7B',
    size_mb: 3500,
    speed: 1,
    accuracy: 0,
    note: 'Experimental: larger model; chunk timestamps',
    engine: 'qwen',
  },
];

/** engine.py LANGUAGES (code -> English name). */
export const LANGUAGES: Readonly<Record<string, string>> = {
  af: 'Afrikaans', ar: 'Arabic', az: 'Azerbaijani', be: 'Belarusian', bg: 'Bulgarian',
  bn: 'Bengali', bs: 'Bosnian', ca: 'Catalan', cs: 'Czech', cy: 'Welsh', da: 'Danish',
  de: 'German', el: 'Greek', en: 'English', es: 'Spanish', et: 'Estonian', fa: 'Persian',
  fi: 'Finnish', fr: 'French', gl: 'Galician', gu: 'Gujarati', he: 'Hebrew', hi: 'Hindi',
  hr: 'Croatian', hu: 'Hungarian', hy: 'Armenian', id: 'Indonesian', is: 'Icelandic',
  it: 'Italian', ja: 'Japanese', kk: 'Kazakh', kn: 'Kannada', ko: 'Korean',
  lt: 'Lithuanian', lv: 'Latvian', mk: 'Macedonian', ml: 'Malayalam', mr: 'Marathi',
  ms: 'Malay', ne: 'Nepali', nl: 'Dutch', no: 'Norwegian', pa: 'Punjabi', pl: 'Polish',
  pt: 'Portuguese', ro: 'Romanian', ru: 'Russian', sk: 'Slovak', sl: 'Slovenian',
  sr: 'Serbian', sv: 'Swedish', sw: 'Swahili', ta: 'Tamil', te: 'Telugu', th: 'Thai',
  tl: 'Tagalog', tr: 'Turkish', uk: 'Ukrainian', ur: 'Urdu', vi: 'Vietnamese',
  zh: 'Chinese',
};

/** main.py /api/languages: sorted by name. */
export function languageList(): { code: string; name: string }[] {
  return Object.entries(LANGUAGES)
    .sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
    .map(([code, name]) => ({ code, name }));
}

/** jobs.py AUDIO_EXT: everything else is shown as a video. */
export const AUDIO_EXT = new Set(['.mp3', '.wav', '.ogg', '.oga', '.m4a', '.aac', '.flac', '.opus', '.wma', '.amr']);

export function mediaKind(filename: string): 'audio' | 'video' {
  const dot = filename.lastIndexOf('.');
  const ext = dot >= 0 ? filename.slice(dot).toLowerCase() : '';
  return AUDIO_EXT.has(ext) ? 'audio' : 'video';
}

/** jobs.py `Path(filename).stem or "Untitled"`. */
export function titleFrom(filename: string): string {
  const base = filename.split(/[\\/]/).pop() ?? '';
  const dot = base.lastIndexOf('.');
  const stem = dot > 0 ? base.slice(0, dot) : base;
  return stem || 'Untitled';
}

/** jobs.py BROWSER_PLAYABLE: files the player can show as they are (others: no player, see M4.md known gaps). */
export const BROWSER_PLAYABLE = new Set(['.mp4', '.m4v', '.webm', '.ogv', '.mp3', '.wav', '.ogg', '.oga', '.m4a', '.aac', '.flac', '.opus']);

export function playableByName(filename: string): boolean {
  const dot = filename.lastIndexOf('.');
  return dot >= 0 && BROWSER_PLAYABLE.has(filename.slice(dot).toLowerCase());
}
