import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { errorDetail, isBusy } from './http-error';
import { LogService } from './log.service';
import { Health, JobSummary, Language, ModelInfo } from './models';
import { IS_BROWSER } from './platform';
import { ToastKind, ToastService } from './toast.service';

/** App-wide state: the job history, server info and reference data. */
@Injectable({ providedIn: 'root' })
export class JobsStore {
  private api = inject(ApiService);
  private log = inject(LogService);
  /** false while the build prerenders a page: there is no server to call, so nothing is requested or polled */
  private browser = inject(IS_BROWSER);

  readonly jobs = signal<JobSummary[]>([]);
  readonly health = signal<Health | null>(null);
  readonly models = signal<ModelInfo[]>([]);
  readonly languages = signal<Language[]>([]);
  readonly offline = signal(false);
  readonly loaded = signal(false);
  private toasts = inject(ToastService);
  /** The newest message on screen ('' when none): a short-hand for code and tests that only need the text. */
  readonly toast = computed(() => {
    const list = this.toasts.toasts();
    const last = list[list.length - 1];
    return last ? last.message || last.title : '';
  });

  readonly active = computed(() => this.jobs().filter((j) => j.status === 'queued' || j.status === 'running'));

  private timer?: ReturnType<typeof setTimeout>;
  /** the "server is busy" message was already shown for the current busy spell (so polling does not repeat it) */
  private busyShown = false;

  constructor() {
    this.refresh();
    this.loadReference();
  }

  loadReference() {
    if (!this.browser) return;
    this.api.health().subscribe({
      next: (h) => {
        this.health.set(h);
        this.log.configure({ enabled: h.logs_enabled !== false, needsToken: h.logs_require_token === true });
      },
      error: () => this.setOffline(true),
    });
    this.refreshModels();
    this.api.languages().subscribe({ next: (l) => this.languages.set(l), error: () => {} });
  }

  refreshModels() {
    if (!this.browser) return;
    this.api.models().subscribe({ next: (m) => this.models.set(m), error: () => {} });
  }

  /** Poll faster while something is running so the progress shown in the header stays live. */
  refresh() {
    if (!this.browser) return;
    clearTimeout(this.timer);
    this.api.listJobs().subscribe({
      next: (rows) => {
        this.jobs.set(rows);
        this.busyShown = false;
        this.setOffline(false);
        this.loaded.set(true);
        this.schedule(rows.some((j) => j.status === 'queued' || j.status === 'running') ? 2000 : 15000);
      },
      error: (e) => {
        this.loaded.set(true);
        if (isBusy(e)) {
          // the server answered, it is just rate limiting or full: not "offline". Say why once, then keep trying.
          this.setOffline(false);
          if (!this.busyShown) {
            this.busyShown = true;
            this.notify(errorDetail(e, 'The server is busy right now. Retrying…'), 'warning', 'Server busy');
          }
          this.schedule(10000);
          return;
        }
        this.setOffline(true);
        this.schedule(5000);
      },
    });
  }

  /** Shows a toast (see ToastService). Most callers report a failure, so an error is the default kind. */
  notify(message: string, kind: ToastKind = 'error', title?: string) {
    this.toasts.show(kind, message, title);
  }

  dismissToast() {
    this.toasts.clear();
  }

  /** Everything the visitor had was deleted on the server (Delete my data now): empty the lists to match. */
  clearAll() {
    clearTimeout(this.timer);
    this.jobs.set([]);
    this.refresh(); // confirms with the server and restarts the polling
  }

  private setOffline(v: boolean) {
    if (v && !this.offline()) this.log.warn('Backend unreachable — retrying');
    else if (!v && this.offline()) this.log.info('Backend reachable again');
    this.offline.set(v);
  }

  private schedule(ms: number) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.refresh(), ms);
  }

  upsert(job: JobSummary) {
    this.jobs.update((rows) => [job, ...rows.filter((r) => r.id !== job.id)].sort((a, b) => b.created_at - a.created_at));
  }

  remove(id: string) {
    this.jobs.update((rows) => rows.filter((r) => r.id !== id));
  }
}
