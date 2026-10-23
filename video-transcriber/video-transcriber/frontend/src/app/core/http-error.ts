/** The bits of an HttpErrorResponse we look at (kept structural so plain objects work in tests too). */
interface ErrorLike {
  status?: number;
  error?: { detail?: unknown } | null;
}

/**
 * The server's explanation of a failed request (FastAPI `detail`), reduced to one short line so it fits
 * a toast: validation errors can arrive as an array or as a multi-line message, only the first line is kept.
 * Falls back to `fallback` when the server gave no usable text.
 */
export function errorDetail(e: unknown, fallback: string): string {
  const err = e as ErrorLike | null;
  const d = err?.error?.detail;
  let text = '';
  if (typeof d === 'string') text = d;
  else if (Array.isArray(d)) {
    text = d
      .map((x: unknown) => (typeof x === 'string' ? x : ((x as { msg?: unknown } | null)?.msg ?? '')))
      .filter((x): x is string => typeof x === 'string' && x.trim() !== '')
      .join('; ');
  }
  const first = text.split(/\r?\n/).map((s) => s.trim()).find(Boolean);
  if (first) return first;
  return err?.status === 0 ? 'Cannot reach the server.' : fallback;
}

/** True for failures that are worth retrying: the server is unreachable (status 0) or broke (5xx). */
export function isTransient(e: unknown): boolean {
  const status = (e as ErrorLike | null)?.status ?? 0;
  return status === 0 || status >= 500;
}

/**
 * The server is up but turning work away: 429 (busy / rate limited / too many jobs) or a 503 that explains itself
 * ("server full"). A bare 503 from a proxy without a message is treated as unreachable instead.
 */
export function isBusy(e: unknown): boolean {
  const status = (e as ErrorLike | null)?.status ?? 0;
  return status === 429 || (status === 503 && errorDetail(e, '') !== '');
}
