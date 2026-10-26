import { _t } from '../i18n/mark';

/** A translate function: `I18nService.t` (bind it) or, by default, the English text itself with its {placeholders} filled in. */
export type Translate = (key: string, params?: Record<string, string | number>) => string;

/** The default `Translate`: English. */
export const english: Translate = (key, params) =>
  params ? key.replace(/\{(\w+)\}/g, (m, name: string) => (name in params ? String(params[name]) : m)) : key;

export function fmtTime(sec: number | null | undefined): string {
  if (sec == null || !isFinite(sec)) return '--:--';
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${String(m).padStart(2, '0')}:${ss}`;
}

export function fmtBytes(n: number): string {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`;
  return `${(n / 1024 ** 3).toFixed(2)} GB`;
}

/** fmtBytes without trailing zeros, for limits and messages: "4 GB", "5.2 GB", "512 MB". */
export function fmtBytesShort(n: number): string {
  return fmtBytes(n).replace(/(\.\d*?)0+(?= )/, '$1').replace(/\.(?= )/, '');
}

/** "42s left" / "3 min left". Pass `t` (the language service's) to get the visitor's language. */
export function fmtEta(sec: number | null | undefined, t: Translate = english): string {
  if (sec == null) return '';
  if (sec < 60) return t('{n}s left', { n: Math.max(1, Math.round(sec)) });
  return t('{n} min left', { n: Math.round(sec / 60) });
}

/** "just now" / "5 min ago" / "2 h ago" / the date. Pass `t` (the language service's) to get the visitor's language. */
export function timeAgo(epochSeconds: number, t: Translate = english): string {
  const d = Date.now() / 1000 - epochSeconds;
  if (d < 60) return t('just now');
  if (d < 3600) return t('{n} min ago', { n: Math.floor(d / 60) });
  if (d < 86400) return t('{n} h ago', { n: Math.floor(d / 3600) });
  return new Date(epochSeconds * 1000).toLocaleDateString();
}

/** What a running job is doing, in English; show it with `| t` (or `i18n.t(PHASE_LABEL[phase])`). */
export const PHASE_LABEL: Record<string, string> = {
  extracting: _t('Preparing audio…'),
  loading_model: _t('Loading model… (first use downloads it)'),
  transcribing: _t('Transcribing…'),
};

/** True when the visitor asked their system for less motion (smooth scrolling is then skipped). */
export function prefersReducedMotion(): boolean {
  try {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches === true;
  } catch {
    return false;
  }
}

export function triggerDownload(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
