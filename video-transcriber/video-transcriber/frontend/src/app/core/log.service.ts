import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
import { getLogsToken, logsAuthHeaders } from './logs-token';
import { LogBatch, LogEntry } from './models';
import { IS_BROWSER } from './platform';
import { TRANSPORT_KIND } from './transport/kind';

type Level = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

/** How many lines the in-page log keeps (the Logs page shows at most 3000 too). */
export const LOG_RING_SIZE = 3000;

/**
 * The in-page log: the newest LOG_RING_SIZE lines this tab wrote, numbered like the server's log (`seq` from 1). The
 * browser edition has no server log, so its Logs page reads this (BrowserTransport.logs / logsStream). Lines stay in
 * memory only; nothing here is stored or sent anywhere.
 */
@Injectable({ providedIn: 'root' })
export class LogRing {
  private rows: LogEntry[] = [];
  private seq = 0;
  private listeners = new Set<(e: LogEntry) => void>();

  push(level: string, logger: string, message: string, context?: unknown) {
    let text = message;
    if (context !== undefined) {
      let ctx: string;
      try {
        ctx = typeof context === 'string' ? context : JSON.stringify(context);
      } catch {
        ctx = String(context);
      }
      if (ctx) text += ` ${ctx.slice(0, 1000)}`;
    }
    const entry: LogEntry = { seq: ++this.seq, ts: Date.now() / 1000, level, logger, message: text };
    this.rows.push(entry);
    if (this.rows.length > LOG_RING_SIZE) this.rows.splice(0, this.rows.length - LOG_RING_SIZE);
    for (const l of this.listeners) {
      try {
        l(entry);
      } catch {
        /* a listener must never break logging */
      }
    }
  }

  /** Lines after `after` (at most `limit`, the newest ones), and the highest number written so far. */
  batch(after = 0, limit = 1000): LogBatch {
    const fresh = this.rows.filter((e) => e.seq > after);
    return { entries: fresh.slice(Math.max(0, fresh.length - limit)), last_seq: this.seq };
  }

  /** Calls `listener` for every new line until the returned function is called. */
  subscribe(listener: (e: LogEntry) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Empties the log; numbering continues, so a page that already showed lines does not see old numbers again. */
  clear() {
    this.rows = [];
  }
}

/**
 * Browser-side logging. Always writes to the console; warn/error (and info, for key events) are also
 * sent to the server so they show up in the Logs page. Sending is fire-and-forget: it uses fetch
 * directly (not HttpClient, so the error interceptor can never recurse), never throws, and is
 * rate-limited so a failure storm cannot flood the server.
 */
@Injectable({ providedIn: 'root' })
export class LogService {
  /** nothing is sent to the server while a page is prerendered (there is none, and no visitor) */
  private browser = inject(IS_BROWSER);
  /** every line also goes to the in-page log (the browser edition's Logs page) */
  private ring = inject(LogRing);
  private sent: number[] = [];
  private last = '';
  private lastAt = 0;
  /** the token (or '') the server refused for client logs; null while nothing was refused */
  private refused: string | null = null;
  private serverLogs = { enabled: true, needsToken: false };
  /**
   * The browser edition has no server: nothing is ever sent (also not before the synthesised health arrives, when the
   * default above would), so no log line, which can name the visitor's file, leaves the device.
   */
  private readonly noServer = inject(TRANSPORT_KIND) === 'browser';

  /**
   * What /api/health says about the server's logs. When they are off (or need a token this browser does not have,
   * which is every visitor of the public site) nothing is sent, so no request fails for no reason.
   */
  configure(opts: { enabled: boolean; needsToken: boolean }) {
    this.serverLogs = opts;
  }

  debug(message: string, context?: unknown) {
    this.emit('DEBUG', message, context, false);
  }
  /** Info goes to the server too: use it for key events only. */
  info(message: string, context?: unknown) {
    this.emit('INFO', message, context, true);
  }
  warn(message: string, context?: unknown) {
    this.emit('WARNING', message, context, true);
  }
  error(message: string, context?: unknown) {
    this.emit('ERROR', message, context, true);
  }

  private emit(level: Level, message: string, context: unknown, remote: boolean) {
    try {
      const fn = level === 'ERROR' ? console.error : level === 'WARNING' ? console.warn : level === 'DEBUG' ? console.debug : console.info;
      if (context === undefined) fn(`[${level}] ${message}`);
      else fn(`[${level}] ${message}`, context);
      if (this.browser) this.ring.push(level, 'browser', message, context);
      if (remote) this.send(level, message, context);
    } catch {
      /* logging must never throw */
    }
  }

  private send(level: Level, message: string, context: unknown) {
    if (!this.browser || this.noServer || !this.serverLogs.enabled || (this.serverLogs.needsToken && !getLogsToken())) return;
    const now = Date.now();
    const key = `${level}|${message}`;
    if (key === this.last && now - this.lastAt < 5000) return; // identical repeat
    this.last = key;
    this.lastAt = now;
    this.sent = this.sent.filter((t) => now - t < 10000);
    if (this.sent.length >= 20) return; // rate limit
    this.sent.push(now);
    let ctx: string | undefined;
    try {
      ctx = context === undefined ? undefined : typeof context === 'string' ? context : JSON.stringify(context);
    } catch {
      ctx = String(context);
    }
    try {
      const token = getLogsToken() ?? '';
      // the server said no (logs turned off, or a token is needed and we have none): stop asking until the token changes
      if (this.refused === token) return;
      fetch('/api/logs/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...logsAuthHeaders() },
        body: JSON.stringify({ level, message: message.slice(0, 2000), context: ctx?.slice(0, 4000) }),
        keepalive: true,
      })
        .then((res) => {
          if (res?.status === 401 || res?.status === 404) this.refused = token;
        })
        .catch(() => {});
    } catch {
      /* ignore */
    }
  }
}

/** Logs uncaught errors (the default handler's console output is replaced by LogService's). */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private log = inject(LogService);
  handleError(error: unknown) {
    const e = error as { message?: string; stack?: string } | null;
    this.log.error(`Uncaught error: ${e?.message ?? String(error)}`, e?.stack);
  }
}

/** Logs failed API calls (status, method, url). Skips /api/logs* so logging problems cannot loop. */
export const errorLogInterceptor: HttpInterceptorFn = (req, next) => {
  const log = inject(LogService);
  return next(req).pipe(
    tap({
      error: (err: unknown) => {
        if (req.url.includes('/api/logs')) return;
        const status = err instanceof HttpErrorResponse ? err.status : 0;
        const msg = `API ${req.method} ${req.url.split('?')[0]} failed: ${status || 'network error'}`;
        if (status === 0 || status >= 500) log.error(msg);
        else log.warn(msg);
      },
    }),
  );
};
