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

export function fmtEta(sec: number | null | undefined): string {
  if (sec == null) return '';
  if (sec < 60) return `${Math.max(1, Math.round(sec))}s left`;
  return `${Math.round(sec / 60)} min left`;
}

export function timeAgo(epochSeconds: number): string {
  const d = Date.now() / 1000 - epochSeconds;
  if (d < 60) return 'just now';
  if (d < 3600) return `${Math.floor(d / 60)} min ago`;
  if (d < 86400) return `${Math.floor(d / 3600)} h ago`;
  return new Date(epochSeconds * 1000).toLocaleDateString();
}

export const PHASE_LABEL: Record<string, string> = {
  extracting: 'Preparing audio…',
  loading_model: 'Loading model… (first use downloads it)',
  transcribing: 'Transcribing…',
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
