/**
 * The in-browser edition's job queue: backend/app/jobs.py JobStore + the scheduler, on top of engine/session's
 * SessionStore (IndexedDB) and the engine worker (engine/worker WorkerClient).
 *
 * - One job at a time, in the order they were created (the server's single worker).
 * - Phases extracting / loading_model / transcribing, progress and eta_seconds by jobs.py's rules (post/job-rules).
 * - Cancel (queued: at once; running: cooperative, then hard after 2 s), re-run with changed options, delete, edits,
 *   rename, "apply style only" (Hinglish restyle of the stored recognition).
 * - Listeners get the server's SSE shapes: { type: 'job', job } after every change and { type: 'segments', ... } with
 *   the newly recognised lines.
 *
 * Errors are RunnerError { status, message } with the server's HTTP status and wording (404 / 409 / 422 / 400 / 507).
 */
import { DEFAULT_OPTIONS, Job, JobOptions, ModelDownload, Segment, SegmentEdit } from '../../core/models';
import { applyEdits, cleanTitle, etaSeconds, storedProgress } from '../post/job-rules';
import { shouldRomanize } from '../post/segment';
import { computeStats } from '../post/stats';
import { SessionStore, SessionStoreError, StoredJob } from '../session/session-store';
import type { EngineEvent, JobResult, WorkerPlan } from '../worker/protocol';
import type { EngineRunner } from '../worker/worker-client';
import type { HinglishConverter } from './hinglish-converter';
import { ModelGate, OptionsError, validateOptions } from './options';
import { mediaKind, titleFrom } from './reference-data';

export class RunnerError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly technical?: string,
  ) {
    super(message);
    this.name = 'RunnerError';
  }
}

export type RunnerEvent =
  | { type: 'job'; job: StoredJob }
  | { type: 'segments'; id: string; segments: Segment[]; since: number };

export interface WakeLockLike {
  start(): unknown;
  stop(): unknown;
}

export type RunnerLog = (level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR', message: string) => void;

export interface JobRunnerDeps {
  store: SessionStore;
  engine: EngineRunner;
  hinglish: HinglishConverter;
  /** the device facts the worker needs (backend, shader-f16, recycle) */
  plan: () => Promise<WorkerPlan>;
  /** why a model cannot run on this device, null when it can (engine/device plan) */
  gate?: () => Promise<ModelGate>;
  /** the model ids this edition knows (server catalog) */
  knownModels?: readonly string[];
  wakeLock?: WakeLockLike;
  /** milliseconds (Date.now) */
  now?: () => number;
  newId?: () => string;
  log?: RunnerLog;
}

const ACTIVE = new Set(['queued', 'running']);

/** what an engine run rejects with (EngineRunError, or anything else) */
type RunFailure = { cancelled?: boolean; userMessage?: string; message?: string; technical?: string };
/** a model-download line is re-sent at most this often (the engine reports every chunk) */
const DOWNLOAD_EMIT_MS = 250;

function randomHex(): string {
  const b = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(b);
  else for (let i = 0; i < b.length; i++) b[i] = Math.floor(Math.random() * 256);
  return [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function storeError(e: unknown): never {
  if (e instanceof RunnerError) throw e;
  if (e instanceof SessionStoreError) throw new RunnerError(e.code === 'not-found' ? 404 : 409, e.message);
  if (e instanceof OptionsError) throw new RunnerError(422, e.message);
  const err = e as { name?: string; message?: string } | null;
  if (err?.name === 'QuotaExceededError') {
    throw new RunnerError(507, 'This browser has no room left to keep the file. Delete old transcripts or free some space.', err.message);
  }
  throw e;
}

export class JobRunner {
  private readonly store: SessionStore;
  private readonly now: () => number;
  private readonly log: RunnerLog;
  private readonly queue: string[] = [];
  private running: string | null = null;
  private pumping = false;
  private readonly listeners = new Set<(e: RunnerEvent) => void>();
  /** the model download of the running job (memory only, like the server's live fields) */
  private readonly downloads = new Map<string, ModelDownload>();
  private lastDownloadEmit = 0;

  constructor(private readonly deps: JobRunnerDeps) {
    this.store = deps.store;
    this.now = deps.now ?? Date.now;
    this.log = deps.log ?? (() => {});
  }

  // ------------------------------------------------------------------ events
  subscribe(listener: (e: RunnerEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(e: RunnerEvent) {
    for (const l of this.listeners) {
      try {
        l(e);
      } catch {
        /* a listener must never break the queue */
      }
    }
  }

  /** The download of the model files while the job is in 'loading_model' (null otherwise). */
  download(id: string): ModelDownload | null {
    return this.downloads.get(id) ?? null;
  }

  isActive(id: string): boolean {
    return this.running === id || this.queue.includes(id);
  }

  get busy(): boolean {
    return this.running !== null || this.queue.length > 0;
  }

  private async patch(id: string, fields: Partial<Omit<StoredJob, 'id'>>): Promise<StoredJob> {
    const job = await this.store.patch(id, fields);
    this.emit({ type: 'job', job });
    return job;
  }

  private seconds(): number {
    return this.now() / 1000;
  }

  // ------------------------------------------------------------------ API (jobs.py / main.py)
  /** POST /api/jobs: the file stays in this browser (IndexedDB), the job is queued. */
  async create(file: File, options: Partial<JobOptions>): Promise<StoredJob> {
    if (!file.size) throw new RunnerError(400, 'The uploaded file is empty.');
    const opts = await this.validate(options);
    const job: Job = {
      id: (this.deps.newId ?? randomHex)(),
      title: titleFrom(file.name),
      filename: file.name,
      status: 'queued',
      phase: null,
      progress: 0,
      eta_seconds: null,
      error: null,
      cancel_requested: false,
      created_at: this.seconds(),
      started_at: null,
      finished_at: null,
      language: null,
      duration: null,
      size_bytes: file.size,
      media_kind: mediaKind(file.name),
      options: opts,
      segment_count: 0,
      segments: [],
      stats: null,
      language_probability: null,
    };
    let stored: StoredJob;
    try {
      stored = await this.store.put(job, file);
    } catch (e) {
      storeError(e);
    }
    this.log('INFO', `job ${stored.id.slice(0, 8)} queued: ${file.name} (model=${opts.model}, language=${opts.language ?? 'auto'})`);
    this.emit({ type: 'job', job: stored });
    this.enqueue(stored.id);
    return stored;
  }

  /** POST /api/jobs/{id}/rerun: the same file again as a new job (explicit null language = detect). */
  async rerun(id: string, changes: Partial<JobOptions>): Promise<StoredJob> {
    const src = await this.store.get(id);
    if (!src) throw new RunnerError(404, 'Job not found');
    if (ACTIVE.has(src.status)) throw new RunnerError(409, 'This job is still in progress.');
    const media = await this.store.getMedia(id);
    if (!media) throw new RunnerError(404, 'Job not found');
    const opts = await this.validate({ ...src.options, ...changes });
    const job: Job = {
      ...src,
      id: (this.deps.newId ?? randomHex)(),
      status: 'queued',
      phase: null,
      progress: 0,
      eta_seconds: null,
      error: null,
      cancel_requested: false,
      created_at: this.seconds(),
      started_at: null,
      finished_at: null,
      language: null,
      language_probability: null,
      duration: null,
      options: opts,
      segment_count: 0,
      segments: [],
      stats: null,
    };
    const { updated_at: _u, version: _v, media_type: _m, language_candidates: _c, ...fresh } = job as StoredJob;
    let stored: StoredJob;
    try {
      stored = await this.store.put(fresh as Job, media);
    } catch (e) {
      storeError(e);
    }
    this.log('INFO', `re-transcribe: job ${id.slice(0, 8)} -> new job ${stored.id.slice(0, 8)} (model=${opts.model})`);
    this.emit({ type: 'job', job: stored });
    this.enqueue(stored.id);
    return stored;
  }

  /** POST /api/jobs/{id}/cancel: a queued job ends at once; a running one stops at the engine's next cancel point. */
  async cancel(id: string): Promise<StoredJob> {
    const job = await this.store.get(id);
    if (!job) throw new RunnerError(404, 'Job not found');
    if (job.status === 'queued') {
      this.dequeue(id);
      this.log('INFO', `job ${id.slice(0, 8)} cancelled while queued`);
      return this.finish(id, 'cancelled');
    }
    if (job.status === 'running') {
      this.log('INFO', `job ${id.slice(0, 8)}: cancel requested`);
      const updated = await this.patch(id, { cancel_requested: true });
      this.deps.engine.cancel(id);
      return updated;
    }
    return job;
  }

  /** DELETE /api/jobs/{id}: refused while it runs (a cancel is requested instead, like the server). */
  async delete(id: string): Promise<void> {
    const job = await this.store.get(id);
    if (!job) throw new RunnerError(404, 'Job not found');
    if (job.status === 'running') {
      this.deps.engine.cancel(id);
      throw new RunnerError(409, 'Cancel the running job first.');
    }
    this.dequeue(id);
    try {
      await this.store.delete(id);
    } catch (e) {
      storeError(e);
    }
  }

  /** PATCH /api/jobs/{id}: title, then segment edits, then the transcript style (in the server's order). */
  async patchJob(
    id: string,
    body: { title?: string; segments?: SegmentEdit[]; output_script?: JobOptions['output_script']; romanizer?: JobOptions['romanizer'] },
  ): Promise<StoredJob> {
    let job = await this.store.get(id);
    if (!job) throw new RunnerError(404, 'Job not found');
    try {
      if (body.title != null) {
        job = await this.patch(id, { title: cleanTitle(body.title, job.title) });
      }
      if (body.segments?.length) {
        if (job.status !== 'done') throw new RunnerError(409, 'The transcript is not finished yet.');
        const r = applyEdits(job.segments, body.segments, job.duration);
        job = await this.patch(id, { segments: r.segments, stats: r.stats });
      }
      if (body.output_script != null || body.romanizer != null) {
        job = await this.restyle(job, body.output_script ?? null, body.romanizer ?? null);
      }
    } catch (e) {
      storeError(e);
    }
    return job;
  }

  /** jobs.py restyle: reconvert the saved recognition without the audio; refused on concurrent edits. */
  private async restyle(
    job: StoredJob,
    outputScript: JobOptions['output_script'] | null,
    romanizer: JobOptions['romanizer'] | null,
  ): Promise<StoredJob> {
    if (job.status !== 'done' && job.status !== 'cancelled') {
      throw new RunnerError(409, 'Wait for transcription to finish or cancel it before changing its style.');
    }
    if (job.options.task === 'translate') {
      throw new RunnerError(409, "This transcript is an English translation; its script cannot be changed.");
    }
    const script = outputScript ?? job.options.output_script;
    const method = romanizer ?? job.options.romanizer ?? 'auto';
    const version = job.version;
    let segments: Segment[];
    if (job.language === 'hi' || job.language === 'en') {
      try {
        segments = await this.deps.hinglish.restyle(job.segments, script, method);
      } catch (e) {
        const err = e as { name?: string; message?: string };
        if (err?.name === 'RomanizerUnavailable') throw new RunnerError(422, err.message ?? 'IndicXlit is unavailable.');
        throw e;
      }
    } else {
      segments = job.segments.map((s) => ({ ...s }));
    }
    const now = await this.store.get(job.id);
    if (!now || now.version !== version) {
      throw new RunnerError(409, 'The transcript changed during conversion. Try applying the style again.');
    }
    return this.patch(job.id, {
      segments,
      options: { ...job.options, output_script: script, romanizer: method },
      stats: computeStats(segments, job.duration),
    });
  }

  /** Cancels whatever runs and forgets the queue ("Delete my data now"). */
  async cancelAll(): Promise<void> {
    this.queue.length = 0;
    if (this.running) this.deps.engine.cancel(this.running);
  }

  private async validate(options: Partial<JobOptions>): Promise<JobOptions> {
    try {
      const gate = this.deps.gate ? await this.deps.gate() : undefined;
      return validateOptions({ ...DEFAULT_OPTIONS, ...options }, gate, this.deps.knownModels);
    } catch (e) {
      if (e instanceof OptionsError) throw new RunnerError(422, e.message);
      throw e;
    }
  }

  // ------------------------------------------------------------------ the queue
  private enqueue(id: string) {
    this.queue.push(id);
    void this.pump();
  }

  private dequeue(id: string) {
    const i = this.queue.indexOf(id);
    if (i >= 0) this.queue.splice(i, 1);
  }

  /** Runs queued jobs one after the other until the queue is empty. */
  private async pump(): Promise<void> {
    if (this.pumping) return;
    this.pumping = true;
    try {
      while (this.queue.length) {
        const id = this.queue.shift()!;
        this.running = id;
        try {
          await this.process(id);
        } catch (e) {
          this.log('ERROR', `job ${id.slice(0, 8)} failed: ${(e as Error)?.message ?? e}`);
        } finally {
          this.running = null;
          this.downloads.delete(id);
        }
      }
    } finally {
      this.pumping = false;
      try {
        this.deps.wakeLock?.stop();
      } catch {
        /* best effort */
      }
    }
  }

  private async finish(id: string, status: 'done' | 'error' | 'cancelled', fields: Partial<StoredJob> = {}): Promise<StoredJob> {
    const done: Partial<StoredJob> = {
      ...fields,
      status,
      phase: null,
      eta_seconds: null,
      cancel_requested: false,
      finished_at: this.seconds(),
    };
    if (status === 'done') done.progress = 1.0;
    return this.patch(id, done);
  }

  /** jobs.py _run: one job through the engine worker. */
  private async process(id: string): Promise<void> {
    const job = await this.store.get(id);
    if (!job || job.status !== 'queued') return; // cancelled or deleted while waiting
    const media = await this.store.getMedia(id);
    if (!media) {
      await this.finish(id, 'error', { error: 'The file of this transcript is no longer stored in this browser. Choose it again.' });
      return;
    }
    let current = await this.patch(id, {
      status: 'running',
      started_at: this.seconds(),
      progress: 0,
      error: null,
      segments: [],
    });
    this.log('INFO', `job ${id.slice(0, 8)} started: ${job.filename} (model=${job.options.model})`);
    try {
      this.deps.wakeLock?.start();
    } catch {
      /* best effort */
    }

    const options = job.options;
    const segments: Segment[] = [];
    let transcribingSince: number | null = null;
    let chain: Promise<unknown> = Promise.resolve();
    let failure: unknown = null;
    // events arrive synchronously; their handling (store writes, Hinglish) runs in order on this chain
    const onEvent = (e: EngineEvent) => {
      chain = chain
        .then(() => this.onEngineEvent(id, e, options, segments, () => transcribingSince, (t) => (transcribingSince = t)))
        .then((j) => {
          if (j) current = j;
        })
        .catch((err) => {
          failure ??= err;
          this.deps.engine.cancel(id); // a failed store write / conversion stops the run
        });
    };

    let result: JobResult | null = null;
    let runError: RunFailure | null = null;
    try {
      const plan = await this.deps.plan();
      result = await this.deps.engine.run({ id, file: media, options, plan }, onEvent);
    } catch (e) {
      runError = e as RunFailure;
    }
    await chain;

    // a failed store write or Hinglish conversion stopped the run (through a cancel): that is an error, not a cancel
    if (failure) {
      const err = failure as { status?: number; message?: string; name?: string };
      const message =
        err?.name === 'RomanizerUnavailable'
          ? (err.message ?? 'IndicXlit is unavailable.')
          : err instanceof RunnerError
            ? err.message
            : `Could not save the transcript in this browser: ${err?.message ?? String(failure)}`;
      this.log('ERROR', `job ${id.slice(0, 8)} failed: ${err?.message ?? failure}`);
      await this.finish(id, 'error', { error: message });
      return;
    }
    if (runError) {
      const stored = await this.store.get(id);
      if (runError.cancelled || stored?.cancel_requested) {
        this.log('INFO', `job ${id.slice(0, 8)} cancelled after ${segments.length} segment(s)`);
        await this.finish(id, 'cancelled');
      } else {
        this.log('ERROR', `job ${id.slice(0, 8)} failed: ${runError.technical ?? runError.message}`);
        await this.finish(id, 'error', { error: runError.userMessage ?? runError.message ?? 'Transcription failed.' });
      }
      return;
    }
    const r = result!;
    const duration = r.duration;
    const stats = computeStats(segments, duration);
    await this.finish(id, 'done', {
      segments,
      language: r.language,
      language_probability: r.language_probability,
      duration,
      stats,
    });
    const took = Math.max(this.seconds() - (current.started_at ?? this.seconds()), 1e-6);
    this.log(
      'INFO',
      `job ${id.slice(0, 8)} done: ${segments.length} segment(s), ${stats.word_count} word(s), language=${r.language} ` +
        `(p=${r.language_probability}), ${duration.toFixed(1)}s of audio in ${took.toFixed(1)}s (${(duration / took).toFixed(2)}x realtime)`,
    );
  }

  private async onEngineEvent(
    id: string,
    e: EngineEvent,
    options: JobOptions,
    segments: Segment[],
    since: () => number | null,
    setSince: (t: number) => void,
  ): Promise<StoredJob | null> {
    switch (e.type) {
      case 'phase': {
        if (e.phase === 'transcribing' && since() === null) setSince(this.now());
        if (e.phase !== 'loading_model') this.downloads.delete(id);
        this.log('INFO', `job ${id.slice(0, 8)} phase: ${e.phase}`);
        return this.patch(id, { phase: e.phase });
      }
      case 'progress': {
        if (e.kind !== 'download' || !e.total) return null;
        this.downloads.set(id, { loaded: e.loaded, total: e.total, file: e.file });
        const t = this.now();
        if (t - this.lastDownloadEmit < DOWNLOAD_EMIT_MS && e.loaded < e.total) return null;
        this.lastDownloadEmit = t;
        const job = await this.store.get(id);
        if (job) this.emit({ type: 'job', job });
        return null;
      }
      case 'language':
        return this.patch(id, {
          language: e.language,
          language_candidates: e.candidates,
        });
      case 'segments': {
        let segs = e.segments;
        // Qwen3-ASR converts each chunk by the language detected in it (qwen_engine `detected or language`)
        const romanizeAs = e.romanizeLanguage !== undefined ? e.romanizeLanguage : e.language;
        if (shouldRomanize(options, romanizeAs)) segs = await this.deps.hinglish.convert(segs, options.romanizer ?? 'auto');
        const from = segments.length;
        segments.push(...segs);
        const t0 = since();
        const elapsed = t0 === null ? 0 : (this.now() - t0) / 1000;
        const job = await this.store.patch(id, {
          segments: [...segments],
          language: e.language,
          duration: e.duration,
          progress: storedProgress(e.progress),
          eta_seconds: etaSeconds(elapsed, e.progress),
        });
        this.emit({ type: 'segments', id, segments: segs, since: from });
        this.emit({ type: 'job', job });
        return job;
      }
      case 'warning':
        this.log('WARNING', `job ${id.slice(0, 8)}: ${e.message}`);
        return null;
      case 'log':
        this.log(e.level, `engine: ${e.message}`);
        return null;
      case 'partial':
        return null;
    }
  }
}
