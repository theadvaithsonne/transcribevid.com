import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, defer, map, of } from 'rxjs';
import type { DevicePlan } from '../../engine/device';
import type { RunnerEvent } from '../../engine/jobs/job-runner';
import { MODEL_UI, languageList, playableByName } from '../../engine/jobs/reference-data';
import { alignerOf } from '../../engine/models/catalog';
import { qwenEntry } from '../../engine/models/qwen-catalog';
import { qwenReason } from '../../engine/qwen/qwen-capability';
import { DOCX_MIME, writeDocx } from '../../engine/export/docx';
import { exportFilename, render } from '../../engine/export/formats';
import { PDF_MIME, writePdf } from '../../engine/export/pdf';
import type { StoredJob } from '../../engine/session/session-store';
import { _t } from '../../i18n/mark';
import { LogRing, LogService } from '../log.service';
import { SITE_BRAND } from '../operator';
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
import { ConverterConsent } from './converter-consent';
import { EngineDevice } from './engine-device';
import { ExportFile, JobEvent, LogStreamEvent, MediaPreview, PatchBody, Transport, TransportError, UploadState } from './transport';

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
/** watch(): how often the store is read for a job that another tab of this browser runs (its runner's events stay there). */
export const OTHER_TAB_POLL_MS = 2000;
/** WAV players are the decoded audio held in memory (an hour is over 100 MB): only the most recent ones are kept. */
export const MAX_PREVIEWS = 2;
/** Qwen3-ASR returns chunk times only (the server's `words: null`). */
const QWEN_WORD_TIMING_NOTE = _t('not available with Qwen (times are per chunk)');
const BOOKKEEPING = [
  'updated_at',
  'version',
  'media_type',
  'language_candidates',
  // resuming after a reload (engine/session RESUME_FIELDS; resume_count stays: the page says it continued)
  'checkpoint',
  'stuck_count',
  'resume_mark',
  'downloaded_bytes',
  'download_mark',
  'low_memory',
  'worker_retries',
] as const;

/** Store / runner errors as HTTP-shaped errors (status + detail), so every page's error handling stays as it is. */
function asTransportError(e: unknown): unknown {
  if (e instanceof TransportError) return e;
  const err = e as { status?: unknown; code?: unknown; message?: unknown; technical?: unknown; name?: unknown } | null;
  if (typeof err?.status === 'number') return new TransportError(err.status, String(err.message ?? ''), err.technical as string | undefined);
  if (err?.name === 'SessionStoreError') {
    return new TransportError(err.code === 'not-found' ? 404 : 409, String(err.message ?? ''));
  }
  return new TransportError(500, _t('Something went wrong in this browser. Please try again.'), String(err?.message ?? e));
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
  /** WAV previews of files the browser cannot play, being built or built (object URL; null = nothing to play) */
  private readonly previews = new Map<string, Promise<MediaPreview | null>>();
  /** the jobs with a built WAV player, oldest first (MAX_PREVIEWS) */
  private readonly previewOrder: string[] = [];
  private readonly consent = inject(ConverterConsent);

  private get(): Promise<BrowserEngine> {
    this.engine ??= this.createEngine().then(
      (engine) => {
        // the session expired (30 minutes idle): its files are deleted, and their player URLs must not keep them alive
        engine.store.onEnded(() => this.forgetAllMedia());
        return engine;
      },
      (e) => {
        this.engine = null; // try again on the next call
        throw e;
      },
    );
    return this.engine;
  }

  private forgetAllMedia() {
    for (const url of this.mediaUrls.values()) URL.revokeObjectURL(url);
    this.mediaUrls.clear();
    this.previews.clear();
    this.previewOrder.length = 0;
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
        brand: SITE_BRAND, // the public website, with the operator's contact address (there is no server to announce one)
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

  /**
   * In-browser edition only (not part of Transport): downloads a Whisper model for this device in the background
   * (core/transport/model-prefetch.ts), so the first transcription does not wait. False when nothing was downloaded
   * (already here, cannot run here, a job is running, no room).
   */
  async prefetchModel(id: string, o: { signal?: AbortSignal; onProgress?: (loaded: number, total: number, note?: string) => void } = {}): Promise<boolean> {
    const [plan, engine] = await Promise.all([this.device.plan(), this.get()]);
    if (!engine.prefetchModel || !plan.offered.some((m) => m.id === id)) return false;
    return engine.prefetchModel(id, plan.backend, plan.shaderF16, {
      signal: o.signal,
      onProgress: (p) => o.onProgress?.(p.loaded, p.total, p.note),
    });
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
    const qwen = qwenEntry(m.id);
    const base: ModelInfo = {
      engine: m.engine,
      id: m.id,
      label: m.label,
      // Qwen: the pinned files' real total (qwen-catalog.ts), not the plan's rounded figure
      size_mb: qwen ? Math.round(qwen.bytes / 1e6) : offered ? Math.round(offered.downloadMB) : m.size_mb,
      speed: m.speed,
      accuracy: m.accuracy,
      note: m.note,
      downloaded: false,
      reason: null,
      default: m.id === plan.defaultModel,
      word_timing_note: qwen ? QWEN_WORD_TIMING_NOTE : (offered?.wordTimestampsNote ?? null),
    };
    if (m.engine === 'qwen' && !offered) return { ...base, default: false, reason: qwenReason(hidden?.reason) };
    if (!offered) return { ...base, default: false, reason: hidden?.reason ?? 'not available in this browser' };
    const downloaded = engine ? await engine.isCached(m.id, plan.backend, plan.shaderF16) : false;
    const aligner = alignerOf(m.id);
    if (aligner && !qwen) {
      // large-v3 / distil-large-v3: word timing comes from the turbo timing model, downloaded once next to it
      const v = plan.backend === 'webgpu' ? (plan.shaderF16 ? aligner.variants.webgpu : aligner.variants.webgpuNoF16) : aligner.variants.wasm;
      const alignerReady = engine ? await engine.isCached(aligner.id, plan.backend, plan.shaderF16) : false;
      base.word_timing_note = alignerReady || !v ? null : `first time only, also downloads the ${Math.round(v.bytes / 1e6)} MB word-timing model`;
    }
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
      this.consent.forget();
      this.forgetAllMedia();
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
      if (!job) throw new TransportError(404, _t('Job not found'));
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
      this.forgetMedia(id);
    });
  }

  /** Lets the player source of a job go (its object URL, and the WAV it points to). */
  private forgetMedia(id: string) {
    const url = this.mediaUrls.get(id);
    if (url) URL.revokeObjectURL(url);
    this.mediaUrls.delete(id);
    this.previews.delete(id);
    const i = this.previewOrder.indexOf(id);
    if (i >= 0) this.previewOrder.splice(i, 1);
  }

  /** A WAV player was built for `id`: the oldest ones beyond MAX_PREVIEWS go (they are rebuilt if opened again). */
  private keepPreview(id: string) {
    const i = this.previewOrder.indexOf(id);
    if (i >= 0) this.previewOrder.splice(i, 1);
    this.previewOrder.push(id);
    while (this.previewOrder.length > MAX_PREVIEWS) this.forgetMedia(this.previewOrder[0]);
  }

  /**
   * The player of a finished job. A file the browser cannot play is decoded again (no clean-up filters) into a WAV
   * object URL, once per job and page visit (the server's preview.mp3, made after a successful transcription);
   * afterwards getJob() carries it as media_url. A playable file answers with its own object URL.
   */
  mediaPreview(id: string): Observable<MediaPreview | null> {
    return call(async () => {
      const have = this.previews.get(id);
      if (have) return have;
      const engine = await this.get();
      const job = await engine.store.get(id);
      if (!job) throw new TransportError(404, _t('Job not found'));
      if (job.status !== 'done' || typeof URL.createObjectURL !== 'function') return null;
      if (playableByName(job.filename) || (job.media_type && this.canPlay(job.media_type, job.media_kind))) {
        const url = await this.mediaUrl(engine, job);
        return url ? { url, audioOnly: false } : null;
      }
      const media = await engine.store.getMedia(id);
      if (!media || !engine.buildPreview) return null;
      const build = engine
        .buildPreview(media, { converter: this.consent.allowed() })
        .then((wav): MediaPreview => {
          const url = URL.createObjectURL(wav);
          this.mediaUrls.set(id, url);
          this.keepPreview(id);
          return { url, audioOnly: true };
        })
        .catch((e) => {
          this.previews.delete(id); // try again on the next visit of the page
          this.ring.push('WARNING', 'engine', `no player for ${job.filename}: ${(e as Error)?.message ?? e}`);
          return null;
        });
      this.previews.set(id, build);
      return build;
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
    if (format === 'pdf' || format === 'docx') return this.document(id, format);
    return this.rendered(id, format, extra).pipe(
      map((r) => ({ blob: new Blob([r.body], { type: r.mime }), filename: r.filename })),
    );
  }

  /**
   * The Word file, or the PDF written directly (engine/export/pdf.ts). A PDF whose text the standard PDF fonts cannot
   * draw (Hindi, Chinese, Arabic, ...) is a 422: the job page checks canWriteJobPdf first and prints those instead.
   */
  private document(id: string, format: 'pdf' | 'docx'): Observable<ExportFile> {
    return call(async () => {
      const job = await this.storedJob(id);
      const creator = SITE_BRAND.name;
      if (format === 'docx') {
        const docx = writeDocx(job, { creator });
        return { blob: new Blob([docx], { type: DOCX_MIME }), filename: `${job.title}.docx` };
      }
      const pdf = writePdf(job, { creator, footer: `${SITE_BRAND.name} - ${SITE_BRAND.domain}` });
      if (!pdf) throw new TransportError(422, _t('PDF is made by your browser: choose "Save as PDF" in the print dialog.'));
      return { blob: new Blob([pdf], { type: PDF_MIME }), filename: exportFilename(job.title, 'pdf') };
    });
  }

  private async storedJob(id: string) {
    const { store } = await this.get();
    const job = await store.get(id);
    if (!job) throw new TransportError(404, _t('Job not found'));
    return job;
  }

  private rendered(id: string, format: ExportFormat, extra: Record<string, number>) {
    return call(async () => {
      if (format === 'pdf' || format === 'docx') throw new TransportError(422, `${format.toUpperCase()} is a file, not text.`);
      const job = await this.storedJob(id);
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
      let poll: ReturnType<typeof setInterval> | null = null;
      let closed = false;
      let sent = since;
      let replaying = true;
      const buffered: RunnerEvent[] = [];
      /**
       * A job that another tab of this browser runs (or one whose page went away, until a tab takes it over): this
       * tab's runner never hears of it, so the stored job is read every OTHER_TAB_POLL_MS. Without this the job page
       * stood still at "Waiting in line…" until it was reloaded.
       */
      const followStore = (engine: BrowserEngine, version: number) => {
        let seen = version;
        let reading = false;
        poll = setInterval(() => {
          if (closed || reading || engine.runner.isActive(id)) return; // run here: the runner's events come
          reading = true;
          engine.store
            .get(id)
            .then(async (j) => {
              if (closed) return;
              if (!j) return sub.complete();
              if (j.version === seen) return;
              seen = j.version;
              const segs = j.segments.slice(sent);
              if (segs.length) {
                sent += segs.length;
                sub.next({ type: 'segments', data: segs });
              }
              sub.next({ type: 'job', data: await this.summary(engine, j) });
              if (FINAL.has(j.status)) sub.complete();
            })
            .catch(() => undefined) // the next read tries again
            .finally(() => (reading = false));
        }, OTHER_TAB_POLL_MS);
      };
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
          if (!closed) followStore(engine, job.version);
        })
        .catch((e) => sub.error(asTransportError(e)));
      return () => {
        closed = true;
        off?.();
        if (poll) clearInterval(poll);
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
