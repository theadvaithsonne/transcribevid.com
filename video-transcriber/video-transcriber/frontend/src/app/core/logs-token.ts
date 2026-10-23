/**
 * The admin token for the Logs page (only needed when the server runs with `logs_require_token`).
 * It lives in sessionStorage, so it is gone when the tab closes, and it is never put in the URL of a page.
 * Plain functions (no DI) so LogService, ApiService and the Logs page can all use it.
 */
const KEY = 'vt-logs-token';

export function getLogsToken(): string | null {
  try {
    return sessionStorage.getItem(KEY) || null;
  } catch {
    return null;
  }
}

export function setLogsToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(KEY, token);
    else sessionStorage.removeItem(KEY);
  } catch {
    /* private mode: the token only lasts for this page then */
  }
}

/** `Authorization: Bearer <token>` for fetch / XHR, or no header at all without a token. */
export function logsAuthHeaders(): Record<string, string> {
  const t = getLogsToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
