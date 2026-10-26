import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, defer, map, of } from 'rxjs';
import type { DevicePlan } from '../../engine/device';
import type { RunnerEvent } from '../../engine/jobs/job-runner';
import { MODEL_UI, languageList, playableByName } from '../../engine/jobs/reference-data';
import { QWEN_BROWSER_REASON } from '../../engine/jobs/options';
import { exportFilename, render } from '../../engine/export/formats';
import type { StoredJob } from '../../engine/session/session-store';
import { LogRing, LogService } from '../log.service';
import {
  ExportFormat,
  Health,
  Job,
  JobOptions,
  JobSummary,
  Language,
  LogBatch,
  ModelInfo,
  SessionInfo,
  SiteStats,
} from '../models';
import type { BrowserEngine } from './browser-engine';
import { EngineDevice } from './engine-device';
import { ExportFile, JobEvent, LogStreamEvent, PatchBody, Transport, TransportError, UploadState } from './transport';

/** Creates the engine runtime (IndexedDB session, job queue, workers) on first use. Specs provide fakes. */
export const BROWSER_ENGINE = new InjectionToken<() => Promise<BrowserEngine>>('BROWSER_ENGINE', {
  providedIn: 'root',
  factory: () => {
    const device = inject(EngineDevice);
    const log = inject(LogService);
    return () =>
      import('./browser-engine').then((m) =>
        m.createBrowserEngine({
          workerPlan: () => device.workerPlan(),
          gate: () => device.gate(),
          log: (level, message) => {
            if (level === 'ERROR') log.error(message);
            else if (level === 'WARNING') log.warn(message);
            else if (level === 'INFO') log.info(message);
            else log.debug(message);
          },
        }),
      );
  },
});

const FINAL = new Set(['done', 'error', 'cancelled']);
const BOOKKEEPING = ['updated_at', 'version', 'media_type', 'language_candidates'] as const;

/** Store / runner errors as HTTP-shaped errors (status + detail), so every page's error handling stays as it is. */
function asTransportError(e: unknown): unknown {
  if (e instanceof TransportError) return e;
  const err = e as { status?: unknown; code?: unknown; message?: unknown; technical?: unknown; name?: unknown } | null;
  if (typeof err?.status === 'number') return new TransportError(err.status, String(err.message ?? ''), err.technical as string | undefined);
  if (err?.name === 'SessionStoreError') {
    return new TransportError(err.code === 'not-found' ? 404 : 409, String(err.message ?? ''));
  }
  return new TransportError(500, 'Something went wrong in this browser. Please try again.', String(err?.message ?? e));
}

/** A promise as an Observable whose errors are HTTP-shaped. */
function call<T>(fn: () => Promise<T>): Observable<T> {
  return defer(async () => {
    try {
      return await fn();
    } catch (e) {
      throw asTransportError(e);
    }
  });
}

/**
 * The static website's transport: nothing is uploaded. Jobs live in this browser (engine/session SessionStore), run
 * in the engine worker one at a time (engine/jobs JobRunner) and come back in the server's shapes, so every page and
 * spec of the app keeps its meaning. Reference data that the server computed is synthesised here.
 */
@Injectable({ providedIn: 'root' })
export class BrowserTransport implements Transport {
  readonly kind = 'browser' as const;
  private readonly createEngine = inject(BROWSER_ENGINE);
  private readonly device = inject(EngineDevice);
  private readonly ring = inject(LogRing);
  private engine: Promise<BrowserEngine> | null = null;
  /** object URLs of the stored source files (the player), revoked when the job or the session goes */
  private readonly mediaUrls = new Map<string, string>();

  private get(): Promise<BrowserEngine> {
    this.engine ??= this.createEngine().catch((e) => {
      this.engine = null; // e.g. IndexedDB blocked: try again on the next call
      throw e;
    });
    return this.engine;
  }

  // ------------------------------------------------------------------ reference data
  health(): Observable<Health> {
    return call(async () => {
      let sessionId: string | undefined;
      try {
        sessionId = (await (await this.get()).store.info()).session_id;
      } catch {
        sessionId = undefined; // the page still works with the defaults; the session check reports the problem
      }
      return {
        status: 'ok',
        version: '',
        device: 'cpu',
        compute_type: 'browser',
        session_id: sessionId,
        persistent: true,
        session_idle_minutes: 30,
        public: false,
        brand: null, // SiteService fills in the default brand
        logs_enabled: true,
        logs_require_token: false,
        allowed_models: null,
        runs_in: 'browser',
      } satisfies Health;
    });
  }

  /** The website counter comes from a Cloudflare Worker in a later milestone; until then nothing is counted. */
  stats(_fresh = false): Observable<SiteStats> {
    return of({ transcribed: 0, counting: false });
  }

  models(): Observable<ModelInfo[]> {
    return call(async () => {
      const [plan, engine] = await Promise.all([this.device.plan(), this.get().catch(() => null)]);
      return Promise.all(MODEL_UI.map((m) => this.modelInfo(m, plan, engine)));
    });
  }

  private async modelInfo(m: (typeof MODEL_UI)[number], plan: DevicePlan, engine: BrowserEngine | null): Promise<ModelInfo> {
    const offered = plan.offered.find((o) => o.id === m.id);
    const hidden = plan.hidden.find((h) => h.id === m.id);
    const base: ModelInfo = {
      engine: m.engine,
      id: m.id,
      label: m.label,
      size_mb: offered ? Math.round(offered.downloadMB) : m.size_mb,
      speed: m.speed,
      accuracy: m.accuracy,
      note: m.note,
      downloaded: false,
      reason: null,
      default: m.id === plan.defaultModel,
      word_timing_note: offered?.wordTimestampsNote ?? null,
    };
    if (m.engine === 'qwen') return { ...base, default: false, reason: QWEN_BROWSER_REASON };
    if (!offered) return { ...base, default: false, reason: hidden?.reason ?? 'not available in this browser' };
    const downloaded = engine ? await engine.isCached(m.id, plan.backend, plan.shaderF16) : false;
    return { ...base, downloaded };
  }

  languages(): Observable<Language[]> {
    return of(languageList());
  }

  // ------------------------------------------------------------------ session
  /**
   * The session in this browser. A session that expired while the tab was closed (30 minutes idle: the store deleted
   * its data on open) is reported once as ended (expires_in_seconds 0), so the page shows the server's
   * "Your session has ended" message.
   */
  session(): Observable<SessionInfo> {
    return call(async () => {
      const { store } = await this.get();
      const ended = store.ended;
      await store.touch();
      const info = await store.info();
      if (!ended) return info;
      store.dismissEnded();
      return { ...info, expires_in_seconds: 0 };
    });
  }

  /** "Delete my data now": stops the running job, empties the store; `deleteModels` also drops the model files. */
  deleteSession(opts: { deleteModels?: boolean } = {}): Observable<void> {
    return call(async () => {
      const { store, runner } = await this.get();
      await runner.cancelAll();
      // the running job reaches 'cancelled' at its next cancel point; wait a little so clear() is not refused
      for (let i = 0; i < 40 && runner.busy; i++) await new Promise((r) => setTimeout(r, 50));
      await store.clear();
      if (opts.deleteModels) await store.deleteModels();
      for (const url of this.mediaUrls.values()) URL.revokeObjectURL(url);
      this.mediaUrls.clear();
    });
  }

  // ------------------------------------------------------------------ jobs
  listJobs(): Observable<JobSummary[]> {
    return call(async () => {
      const { store } = await this.get();
      await store.touch();
      return store.list();
    });
  }

  getJob(id: string): Observable<Job> {
    return call(async () => {
      const engine = await this.get();
      await engine.store.touch();
      const job = await engine.store.get(id);
      if (!job) throw new TransportError(404, 'Job not found');
      return this.publicJob(engine, job);
    });
  }

  /** Nothing is uploaded: the file is stored in this browser and the job is queued at once (progress 1). */
  createJob(file: File, options: JobOptions): Observable<UploadState> {
    return call(async () => {
      const engine = await this.get();
      const job = await engine.runner.create(file, options);
      return { progress: 1, loaded: file.size, total: file.size, job: await this.summary(engine, job) };
    });
  }

  patchJob(id: string, body: PatchBody): Observable<Job> {
    return call(async () => {
      const engine = await this.get();
      return this.publicJob(engine, await engine.runner.patchJob(id, body));
    });
  }

  cancel(id: string): Observable<JobSummary> {
    return call(async () => {
      const engine = await this.get();
      return this.summary(engine, await engine.runner.cancel(id));
    });
  }

  rerun(id: string, changes: Partial<JobOptions>): Observable<JobSummary> {
    return call(async () => {
      const engine = await this.get();
      return this.summary(engine, await engine.runner.rerun(id, changes));
    });
  }

  delete(id: string): Observable<void> {
    return call(async () => {
      const { runner } = await this.get();
      await runner.delete(id);
      const url = this.mediaUrls.get(id);
      if (url) URL.revokeObjectURL(url);
      this.mediaUrls.delete(id);
    });
  }

  // ------------------------------------------------------------------ logs (this tab only)
  logs(after = 0, limit = 1000): Observable<LogBatch> {
    return of(this.ring.batch(after, limit));
  }

  clearLogs(): Observable<void> {
    this.ring.clear();
    return of(undefined);
  }

  logsStreamUrl(_after: number): string {
    return '';
  }

  logsStream(after: number): Observable<LogStreamEvent> {
    return new Observable((sub) => {
      let last = after;
      const off = this.ring.subscribe((entry) => {
        if (entry.seq <= last) return;
        last = entry.seq;
        sub.next({ type: 'log', entry });
      });
      sub.next({ type: 'open' });
      // lines written between the page's logs() call and now
      for (const entry of this.ring.batch(after, Number.MAX_SAFE_INTEGER).entries) {
        if (entry.seq <= last) continue;
        last = entry.seq;
        sub.next({ type: 'log', entry });
      }
      return off;
    });
  }

  // ------------------------------------------------------------------ exports
  exportUrl(_id: string, _format: ExportFormat, _extra: Record<string, number> = {}): string {
    return '';
  }

  exportText(id: string, format: ExportFormat): Observable<string> {
    return this.rendered(id, format, {}).pipe(map((r) => r.body));
  }

  exportBlob(id: string, format: ExportFormat, extra: Record<string, number> = {}): Observable<ExportFile> {
    return this.rendered(id, format, extra).pipe(
      map((r) => ({ blob: new Blob([r.body], { type: r.mime }), filename: r.filename })),
    );
  }

  private rendered(id: string, format: ExportFormat, extra: Record<string, number>) {
    return call(async () => {
      if (format === 'pdf') {
        throw new TransportError(422, 'PDF is made by your browser: choose "Save as PDF" in the print dialog.');
      }
      const { store } = await this.get();
      const job = await store.get(id);
      if (!job) throw new TransportError(404, 'Job not found');
      const maxChars = Math.min(80, Math.max(20, Math.round(extra['max_chars'] ?? 42)));
      const maxLines = Math.min(3, Math.max(1, Math.round(extra['max_lines'] ?? 2)));
      const r = render(job, format, { maxChars, maxLines });
      return { ...r, filename: exportFilename(job.title, format) };
    });
  }

  // ------------------------------------------------------------------ live
  /**
   * The server's SSE stream, in process: the segments after `since` and the job, then every change until the job
   * reaches a final state (then it completes, like the server's 'end' event). A job that is gone completes at once.
   */
  watch(id: string, since = 0): Observable<JobEvent> {
    return new Observable<JobEvent>((sub) => {
      let off: (() => void) | null = null;
      let closed = false;
      let sent = since;
      let replaying = true;
      const buffered: RunnerEvent[] = [];
      const forward = async (engine: BrowserEngine, e: RunnerEvent) => {
        if (e.type === 'segments') {
          if (e.id !== id) return;
          const fresh = e.segments.filter((_, i) => e.since + i >= sent);
          if (fresh.length) {
            sent = Math.max(sent, e.since + e.segments.length);
            sub.next({ type: 'segments', data: fresh });
          }
          return;
        }
        if (e.job.id !== id) return;
        sub.next({ type: 'job', data: await this.summary(engine, e.job) });
        if (FINAL.has(e.job.status)) sub.complete();
      };
      this.get()
        .then(async (engine) => {
          if (closed) return;
          off = engine.runner.subscribe((e) => {
            if (replaying) buffered.push(e);
            else void forward(engine, e);
          });
          await engine.store.touch();
          const job = await engine.store.get(id);
          if (!job) {
            sub.complete();
            return;
          }
          const segs = job.segments.slice(sent);
          if (segs.length) {
            sent += segs.length;
            sub.next({ type: 'segments', data: segs });
          }
          sub.next({ type: 'job', data: await this.summary(engine, job) });
          if (FINAL.has(job.status)) {
            sub.complete();
            return;
          }
          replaying = false;
          for (const e of buffered.splice(0)) await forward(engine, e);
        })
        .catch((e) => sub.error(asTransportError(e)));
      return () => {
        closed = true;
        off?.();
      };
    });
  }

  // ------------------------------------------------------------------ shapes
  /** main.py _public: the job without the store's bookkeeping, with media_url (and the live model download). */
  private async publicJob(engine: BrowserEngine, job: StoredJob): Promise<Job> {
    const out = { ...job } as Job & Partial<Record<(typeof BOOKKEEPING)[number], unknown>>;
    for (const k of BOOKKEEPING) delete out[k];
    out.media_url = await this.mediaUrl(engine, job);
    const download = engine.runner.download(job.id);
    if (download) out.download = download;
    return out;
  }

  /** The same without segments (the SSE 'job' event and the create / cancel / rerun answers). */
  private async summary(engine: BrowserEngine, job: StoredJob): Promise<JobSummary> {
    const { segments: _segments, ...rest } = await this.publicJob(engine, { ...job, segments: [] });
    return rest;
  }

  private async mediaUrl(engine: BrowserEngine, job: StoredJob): Promise<string | null> {
    const have = this.mediaUrls.get(job.id);
    if (have) return have;
    if (!job.media_type || typeof URL.createObjectURL !== 'function') return null;
    if (!playableByName(job.filename) && !this.canPlay(job.media_type, job.media_kind)) return null;
    const blob = await engine.store.getMedia(job.id);
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    this.mediaUrls.set(job.id, url);
    return url;
  }

  private canPlay(type: string, kind: 'audio' | 'video'): boolean {
    try {
      return typeof document !== 'undefined' && document.createElement(kind).canPlayType(type) !== '';
    } catch {
      return false;
    }
  }
}
