import { _t } from '../i18n/mark';
import type { Translate } from './format';

/**
 * The notes under a model download. The engine writes them in a web worker as plain English (engine/models/resumable-download.ts
 * and qwen-files.ts), so they reach the page as strings: the fixed ones are their own translation keys, and the ones that
 * carry a value are recognised by their shape. Anything else is shown as it is. Listing the keys with `_t` is what lets
 * scripts/extract-i18n.mjs find them; a spec checks the shapes against the engine's own words.
 */
export const DOWNLOAD_NOTES = [
  _t('Waiting for the internet connection…'),
  _t('Reconnecting…'),
  _t('Checking the downloaded file…'),
  _t('The download stalled.'),
  _t('Connection lost.'),
];

const SHAPES: readonly { re: RegExp; key: string; name: string }[] = [
  { re: /^Continuing the download \((.+) already saved\)$/, key: _t('Continuing the download ({size} already saved)'), name: 'size' },
  { re: /^The download server is busy \(HTTP (\d+)\)\.$/, key: _t('The download server is busy (HTTP {status}).'), name: 'status' },
];
/** "<reason> Retrying in 5 s…": the reason is one of the notes above */
const RETRY = /^(.+) Retrying in (\d+) s…$/;

/** The note in the page's language (`t` is the language service's translate). */
export function translateDownloadNote(note: string, t: Translate): string {
  const retry = RETRY.exec(note);
  if (retry) return t(_t('{reason} Retrying in {n} s…'), { reason: translateDownloadNote(retry[1], t), n: retry[2] });
  for (const s of SHAPES) {
    const m = s.re.exec(note);
    if (m) return t(s.key, { [s.name]: m[1] });
  }
  return t(note);
}
