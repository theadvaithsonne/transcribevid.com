import { Component, DestroyRef, ElementRef, computed, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { errorDetail } from '../../core/http-error';
import { LogService } from '../../core/log.service';
import { getLogsToken, setLogsToken } from '../../core/logs-token';
import { LogBatch, LogEntry } from '../../core/models';
import { SiteService } from '../../core/site.service';
import { ToastService } from '../../core/toast.service';

const MAX_ROWS = 3000;
const LEVELS = ['DEBUG', 'INFO', 'WARNING', 'ERROR'] as const;
type Conn = 'connecting' | 'live' | 'reconnecting';
/**
 * ok: showing the logs. token: the server wants an access token and we have none. denied: the token we sent was
 * refused. disabled: this server has no logs page (404).
 */
type Access = 'ok' | 'token' | 'denied' | 'disabled';

/** The level a row is filtered, counted and coloured as: the server's CRITICAL (and FATAL) are shown as ERROR. */
export function displayLevel(level: string): string {
  const l = String(level ?? '').toUpperCase();
  return l === 'CRITICAL' || l === 'FATAL' ? 'ERROR' : l;
}

@Component({
  selector: 'app-logs',
  imports: [FormsModule, RouterLink],
  templateUrl: './logs.html',
  styleUrl: './logs.scss',
})
export class LogsPage {
  private api = inject(ApiService);
  private log = inject(LogService);
  private site = inject(SiteService);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  levels = LEVELS;
  lvl = displayLevel;
  entries = signal<LogEntry[]>([]);
  // DEBUG (polling, asset requests, per-segment lines) is hidden by default; click its chip to show it
  active = signal<ReadonlySet<string>>(new Set(['INFO', 'WARNING', 'ERROR']));
  query = signal('');
  follow = signal(true);
  paused = signal(false);
  conn = signal<Conn>('connecting');
  pendingCount = signal(0);
  access = signal<Access>('ok');
  /** a Clear request is on its way (the button waits for it: no second request) */
  clearing = signal(false);
  tokenDraft = '';

  private lastSeq = 0;
  private pending: LogEntry[] = [];
  private es?: EventSource;
  private retry?: ReturnType<typeof setTimeout>;
  private closed = false;
  private viewport = viewChild<ElementRef<HTMLElement>>('viewport');

  counts = computed(() => {
    const c: Record<string, number> = { DEBUG: 0, INFO: 0, WARNING: 0, ERROR: 0 };
    for (const e of this.entries()) {
      const l = displayLevel(e.level);
      c[l] = (c[l] ?? 0) + 1;
    }
    return c;
  });

  visible = computed(() => {
    const on = this.active();
    const q = this.query().trim().toLowerCase();
    return this.entries().filter(
      (e) => on.has(displayLevel(e.level)) && (!q || e.message.toLowerCase().includes(q) || e.logger.toLowerCase().includes(q)),
    );
  });

  constructor() {
    // the server already told us it wants a token: ask for it instead of making a request that is bound to fail
    if (this.site.logsRequireToken() && !getLogsToken()) this.access.set('token');
    else this.connect(true);
    this.destroyRef.onDestroy(() => {
      this.closed = true;
      this.es?.close();
      clearTimeout(this.retry);
    });
    // keep the view pinned to the newest line while following
    effect(() => {
      this.visible();
      if (untracked(() => this.follow())) setTimeout(() => this.scrollToEnd());
    });
  }

  // ------------------------------------------------------------------ data
  /** (Re)load what we missed, then follow the live stream. Safe to call again after a drop. */
  private connect(initial = false) {
    if (this.closed) return;
    this.es?.close();
    this.conn.set(initial ? 'connecting' : 'reconnecting');
    this.api.logs(initial ? 0 : this.lastSeq).subscribe({
      next: (b: LogBatch) => {
        if (b.last_seq < this.lastSeq) {
          // the server restarted and numbering began again: start from scratch
          this.entries.set([]);
          this.pending = [];
          this.pendingCount.set(0);
          this.lastSeq = 0;
          return this.connect(true);
        }
        this.ingest(b.entries);
        this.lastSeq = Math.max(this.lastSeq, b.last_seq);
        this.stream();
      },
      error: (e: { status?: number }) => this.onLoadError(e),
    });
  }

  /** 401 / 404 are answers, not outages: show the token prompt or the "turned off" message instead of retrying. */
  private onLoadError(e: { status?: number }): boolean {
    if (e?.status === 401) {
      this.access.set(getLogsToken() ? 'denied' : 'token');
      setLogsToken(null); // a refused token is no use: ask again
      this.es?.close();
      return true;
    }
    if (e?.status === 404) {
      this.access.set('disabled');
      this.es?.close();
      return true;
    }
    this.scheduleRetry();
    return false;
  }

  /** The admin typed the access token: keep it for this tab and try again. */
  submitToken() {
    const token = this.tokenDraft.trim();
    if (!token) return;
    setLogsToken(token);
    this.tokenDraft = '';
    this.access.set('ok');
    this.entries.set([]);
    this.pending = [];
    this.pendingCount.set(0);
    this.lastSeq = 0;
    this.connect(true);
  }

  private stream() {
    if (this.closed) return;
    const es = new EventSource(this.api.logsStreamUrl(this.lastSeq));
    this.es = es;
    es.onopen = () => this.conn.set('live');
    es.addEventListener('log', (ev) => {
      try {
        this.ingest([JSON.parse((ev as MessageEvent).data) as LogEntry]);
      } catch {
        /* ignore malformed event */
      }
    });
    es.onerror = () => {
      // we reconnect ourselves so `after` always reflects what we already have
      es.close();
      this.scheduleRetry();
    };
  }

  private scheduleRetry() {
    if (this.closed) return;
    this.conn.set('reconnecting');
    clearTimeout(this.retry);
    this.retry = setTimeout(() => this.connect(false), 2000);
  }

  /** De-duplicates by seq and applies the row cap. While paused, rows wait in a side buffer. */
  private ingest(list: LogEntry[]) {
    const fresh = list.filter((e) => e.seq > this.lastSeq);
    if (!fresh.length) return;
    this.lastSeq = fresh.reduce((m, e) => Math.max(m, e.seq), this.lastSeq);
    if (this.paused()) {
      this.pending.push(...fresh);
      if (this.pending.length > MAX_ROWS) this.pending.splice(0, this.pending.length - MAX_ROWS);
      this.pendingCount.set(this.pending.length);
      return;
    }
    this.append(fresh);
  }

  private append(rows: LogEntry[]) {
    this.entries.update((cur) => {
      const next = cur.concat(rows);
      return next.length > MAX_ROWS ? next.slice(next.length - MAX_ROWS) : next;
    });
  }

  // ------------------------------------------------------------------ actions
  toggleLevel(l: string) {
    this.active.update((s) => {
      const n = new Set(s);
      if (!n.delete(l)) n.add(l);
      return n;
    });
  }

  togglePause() {
    const next = !this.paused();
    this.paused.set(next);
    if (!next && this.pending.length) {
      const rows = this.pending;
      this.pending = [];
      this.pendingCount.set(0);
      this.append(rows);
    }
  }

  setFollow(on: boolean) {
    this.follow.set(on);
    if (on) this.scrollToEnd();
  }

  clear() {
    if (this.clearing() || !confirm('Clear all log entries on the server?')) return;
    this.clearing.set(true);
    this.api.clearLogs().subscribe({
      next: () => {
        this.clearing.set(false);
        this.entries.set([]);
        this.pending = [];
        this.pendingCount.set(0);
        this.toast.success('The server log is empty now.', 'Logs cleared');
      },
      error: (e: { status?: number }) => {
        this.clearing.set(false);
        if (e?.status === 401 || e?.status === 404) this.onLoadError(e);
        else {
          this.log.warn('Could not clear server logs');
          this.toast.error(errorDetail(e, 'The server did not answer. Please try again.'), 'Logs not cleared');
        }
      },
    });
  }

  download() {
    const rows = this.visible();
    if (!rows.length) return;
    const text = rows.map((e) => `${this.iso(e.ts)} ${e.level.padEnd(7)} ${e.logger} ${e.message}`).join('\n') + '\n';
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcribevid-logs-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.log`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    this.toast.success(`${rows.length} ${rows.length === 1 ? 'line' : 'lines'}. Look for it in your downloads.`, 'Download started');
  }

  /** Scrolling up pauses following; returning to the bottom resumes it. */
  onScroll() {
    const el = this.viewport()?.nativeElement;
    if (!el) return;
    const atEnd = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    if (atEnd !== this.follow()) this.follow.set(atEnd);
  }

  private scrollToEnd() {
    const el = this.viewport()?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  // ------------------------------------------------------------------ formatting
  time(ts: number) {
    const d = new Date(ts * 1000);
    const p = (n: number, w = 2) => String(n).padStart(w, '0');
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`;
  }

  private iso(ts: number) {
    return new Date(ts * 1000).toISOString();
  }

  trackSeq(_: number, e: LogEntry) {
    return e.seq;
  }
}
