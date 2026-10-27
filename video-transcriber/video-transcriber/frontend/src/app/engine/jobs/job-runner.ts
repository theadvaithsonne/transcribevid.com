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
import { RESUME_FIELDS, SessionStore, SessionStoreError, StoredJob } from '../session/session-store';
import type { EngineEvent, JobResult, ResumeState, WorkerPlan } from '../worker/protocol';
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
  /** navigator.onLine (tests replace it) */
  online?: () => boolean;
}

const ACTIVE = new Set(['queued', 'running']);

/** what an engine run rejects with (EngineRunError, or anything else) */
type RunFailure = { cancelled?: boolean; code?: string; userMessage?: string; message?: string; technical?: string };
/** The engine worker crashed (out of memory in the worker): continue from the checkpoint in low-memory mode, once. */
const MAX_WORKER_RETRIES = 1;
/** a model-download line is re-sent at most this often (the engine reports every chunk) */
const DOWNLOAD_EMIT_MS = 250;
/** how often the reached download size is written to the job (a reload loop with no download progress is stuck) */
const DOWNLOAD_WRITE_MS = 3000;

function randomHex(): string {
  const b = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(b);
  else for (let i = 0; i < b.length; i++) b[i] = Math.floor(Math.random() * 256);
  return [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/** A File the browser can no longer read: moved, deleted or changed on disk after it was chosen, or a cloud file gone. */
export const UNREADABLE_FILE =
  'This file could not be read. It may have been moved, renamed or changed after you chose it. Choose it again.';
/** The DOMException names of a File whose data is gone (Chrome / Firefox / Safari). */
const UNREADABLE_NAMES = new Set(['NotReadableError', 'NotFoundError']);
export const NO_STORED_FILE = 'The file of this transcript is no longer stored in this browser. Choose it again.';
/**
 * A run that failed without a reason of its own while the device is offline. The first run fetches the engine's code
 * (the worker script, the runtime) besides the model, and a worker whose script cannot load reads as a crash ("a
 * smaller model needs less memory"), which sends the visitor the wrong way.
 */
export const OFFLINE_ERROR =
  'This device is offline. The first transcription needs the internet to fetch the speech engine. Connect, then use ' +
  'Re-transcribe; what was already downloaded is kept.';
/** Failures that say nothing about the file: offline, they are most likely the missing connection. */
const NETWORK_SUSPECT_CODES = new Set(['worker-crashed', 'failed']);
const browserOnline = () => (globalThis as { navigator?: { onLine?: boolean } }).navigator?.onLine !== false;

function storeError(e: unknown): never {
  if (e instanceof RunnerError) throw e;
  if (e instanceof SessionStoreError) throw new RunnerError(e.code === 'not-found' ? 404 : 409, e.message);
  if (e instanceof OptionsError) throw new RunnerError(422, e.message);
  const err = e as { name?: string; message?: string } | null;
  if (err?.name === 'QuotaExceededError') {
    throw new RunnerError(507, 'This browser has no room left to keep the file. Delete old transcripts or free some space.', err.message);
  }
  if (err?.name && UNREADABLE_NAMES.has(err.name)) throw new RunnerError(400, UNREADABLE_FILE, `${err.name}: ${err.message}`);
  throw e;
}

/** Reads the first byte, which is where a File whose data is gone fails (instead of deep inside the store or the decoder). */
async function readFirstByte(file: Blob): Promise<void> {
  const head = file.slice(0, 1);
  if (typeof head.arrayBuffer === 'function') {
    await head.arrayBuffer();
    return;
  }
  await new Promise<void>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve();
    r.onerror = () => reject(r.error);
    r.readAsArrayBuffer(head);
  });
}

const isCount = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 0;
const isTime = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;

/**
 * The stored checkpoint when a worker can continue from it, else null (the job then starts again from the beginning).
 * It was written by the worker of an earlier page, which may be an older version of the site with another shape, or a
 * store that lost a write: a field that is missing or of the wrong kind must not crash the run or keep the wrong lines.
 * `lines` = the lines stored with the job; the checkpoint may not claim more.
 */
export function usableCheckpoint(cp: unknown, lines: number): ResumeState | null {
  if (!cp || typeof cp !== 'object') return null;
  const c = cp as Partial<Record<keyof ResumeState, unknown>>;
  const f = c.filter as Partial<Record<string, unknown>> | null | undefined;
  const d = f?.['dropped'] as Partial<Record<string, unknown>> | null | undefined;
  const ok =
    c.redecode === true &&
    isCount(c.seek) &&
    isCount(c.emitted) &&
    c.emitted <= lines &&
    isCount(c.windowsDone) &&
    isCount(c.samples) &&
    isTime(c.duration) &&
    isTime(c.lastSpeechTimestamp) &&
    typeof c.scale === 'number' &&
    Number.isFinite(c.scale) &&
    typeof c.languageProbability === 'number' &&
    Number.isFinite(c.languageProbability) &&
    (c.language === null || typeof c.language === 'string') &&
    typeof c.context === 'string' &&
    typeof c.wordTimestamps === 'boolean' &&
    (c.streaming === undefined || typeof c.streaming === 'boolean') &&
    !!f &&
    isCount(f['repeats']) &&
    isCount(f['kept']) &&
    (f['lastNorm'] === null || typeof f['lastNorm'] === 'string') &&
    !!d &&
    isCount(d['empty']) &&
    isCount(d['no_speech']) &&
    isCount(d['repetition']);
  if (!ok) return null;
  // the audio is decoded again on resume: whatever a checkpoint carries there is replaced, never trusted
  return { ...(c as ResumeState), pcm: new Int16Array(0), chunks: null, qwen: undefined };
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
  private lastDownloadWrite = 0;

  private readonly busyListeners = new Set<(busy: boolean) => void>();

  constructor(private readonly deps: JobRunnerDeps) {
    this.store = deps.store;
    this.now = deps.now ?? Date.now;
    this.log = deps.log ?? (() => {});
    // jobs whose page went away (a reload, a closed tab, a phone that dropped the tab) continue here
    this.store.onRecovered(() => this.adopt());
    this.adopt();
  }

  /** Queues the jobs the store took over for this page, oldest first. */
  private adopt() {
    for (const id of this.store.takeRecovered()) {
      if (this.isActive(id)) continue;
      this.log('INFO', `job ${id.slice(0, 8)}: the page was reloaded or closed while it ran; continuing it`);
      this.enqueue(id);
    }
  }

  /** Called with true when the first job is queued and false when the queue has run empty (the page's leave warning). */
  onBusyChange(listener: (busy: boolean) => void): () => void {
    this.busyListeners.add(listener);
    return () => this.busyListeners.delete(listener);
  }

  private busyChanged(busy: boolean) {
    for (const l of [...this.busyListeners]) {
      try {
        l(busy);
      } catch {
        /* a listener must never break the queue */
      }
    }
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
    try {
      await readFirstByte(file);
    } catch (e) {
      const err = e as { name?: string; message?: string } | null;
      throw new RunnerError(400, UNREADABLE_FILE, `${err?.name ?? 'Error'}: ${err?.message ?? e}`);
    }
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
    if (this.store.mediaOnlyInPage(stored.id)) {
      this.log('WARNING', `job ${stored.id.slice(0, 8)}: this browser would not keep a copy of the file (no room); keep this page open until it is done`);
    }
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
    // the transcript is there, its file is not (the browser had no room for a copy, and the page was reloaded)
    if (!media) throw new RunnerError(409, NO_STORED_FILE);
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
    const { updated_at: _u, version: _v, media_type: _m, language_candidates: _c, ...copied } = job as StoredJob;
    const fresh: Record<string, unknown> = { ...copied };
    for (const k of RESUME_FIELDS) delete fresh[k]; // a re-run starts from the beginning
    let stored: StoredJob;
    try {
      stored = await this.store.put(fresh as unknown as Job, media);
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

  /** The device plan's reason why `model` cannot run here now, null when it can (or the plan cannot be asked). */
  private async whyNotHere(model: string): Promise<string | null> {
    if (!this.deps.gate) return null;
    try {
      return (await this.deps.gate())(model);
    } catch {
      return null;
    }
  }

  // ------------------------------------------------------------------ the queue
  private enqueue(id: string, first = false) {
    const wasBusy = this.busy;
    if (first) this.queue.unshift(id);
    else this.queue.push(id);
    if (!wasBusy) this.busyChanged(true);
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
      if (!this.busy) this.busyChanged(false);
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
      checkpoint: null,
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
      await this.finish(id, 'error', { error: NO_STORED_FILE });
      return;
    }
    // A job continued after a reload was checked against this device when it was created, not now: a browser that lost
    // WebGPU after a crash of its graphics process no longer offers the big models. Say so instead of trying anyway.
    const why = await this.whyNotHere(job.options.model);
    if (why) {
      this.log('WARNING', `job ${id.slice(0, 8)}: ${job.options.model} is not offered on this device any more (${why})`);
      await this.finish(id, 'error', {
        error: `The model '${job.options.model}' cannot run in this browser now: ${why.replace(/\.$/, '')}. Run it again with another model.`,
      });
      return;
    }
    // a job continued after its page went away keeps the lines it had up to its checkpoint (later ones come again)
    // low-memory mode streams the audio; it gives the same windows and lines as the whole-file path (timeline.ts)
    const checkpoint = job.checkpoint ? usableCheckpoint(job.checkpoint, job.segments.length) : null;
    if (job.checkpoint && !checkpoint) {
      this.log('WARNING', `job ${id.slice(0, 8)}: its saved position cannot be used (an older version of the site?); starting it again from the beginning`);
    }
    const resume: ResumeState | null = checkpoint ? { ...checkpoint, ...(job.low_memory ? { streaming: true } : {}) } : null;
    const kept = resume ? job.segments.slice(0, resume.emitted) : [];
    let current = await this.patch(id, {
      status: 'running',
      started_at: resume ? (job.started_at ?? this.seconds()) : this.seconds(),
      progress: resume ? job.progress : 0,
      error: null,
      segments: kept,
      ...(job.checkpoint && !checkpoint ? { checkpoint: null } : {}),
    });
    this.log(
      'INFO',
      resume
        ? `job ${id.slice(0, 8)} continues: ${job.filename} (model=${job.options.model}) from ${kept.length} line(s)` +
            `${job.low_memory ? ', low-memory mode' : ''}`
        : `job ${id.slice(0, 8)} started: ${job.filename} (model=${job.options.model})${job.low_memory ? ' in low-memory mode' : ''}`,
    );
    try {
      this.deps.wakeLock?.start();
    } catch {
      /* best effort */
    }

    const options = job.options;
    const segments: Segment[] = [...kept];
    let transcribingSince: number | null = null;
    let chain: Promise<unknown> = Promise.resolve();
    let failure: unknown = null;
    let cancelSeen = false;
    // events arrive synchronously; their handling (store writes, Hinglish) runs in order on this chain
    const onEvent = (e: EngineEvent) => {
      chain = chain
        .then(() => this.onEngineEvent(id, e, options, segments, () => transcribingSince, (t) => (transcribingSince = t)))
        .then((j) => {
          if (!j) return;
          current = j;
          // Cancel pressed in another tab: that tab only marks the stored job, the engine runs here. Stop it.
          if (j.cancel_requested && !cancelSeen) {
            cancelSeen = true;
            this.deps.engine.cancel(id);
          }
        })
        .catch((err) => {
          failure ??= err;
          this.deps.engine.cancel(id); // a failed store write / conversion stops the run
        });
    };

    let result: JobResult | null = null;
    let runError: RunFailure | null = null;
    try {
      const plan = { ...(await this.deps.plan()), ...(job.low_memory ? { lowMemory: true } : {}) };
      result = await this.deps.engine.run({ id, file: media, options, plan, ...(resume ? { resume } : {}) }, onEvent);
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
      } else if (runError.code === 'worker-crashed' && (stored?.worker_retries ?? 0) < MAX_WORKER_RETRIES) {
        // the engine worker died (usually out of memory) but the page is fine: continue at once, with less memory
        this.log('WARNING', `job ${id.slice(0, 8)}: the engine stopped (${runError.technical ?? runError.message}); continuing in low-memory mode`);
        await this.patch(id, {
          status: 'queued',
          phase: null,
          eta_seconds: null,
          low_memory: true,
          worker_retries: (stored?.worker_retries ?? 0) + 1,
        });
        this.enqueue(id, true);
      } else {
        this.log('ERROR', `job ${id.slice(0, 8)} failed: ${runError.technical ?? runError.message}`);
        const offline = NETWORK_SUSPECT_CODES.has(runError.code ?? '') && !(this.deps.online ?? browserOnline)();
        await this.finish(id, 'error', {
          error: offline ? OFFLINE_ERROR : (runError.userMessage ?? runError.message ?? 'Transcription failed.'),
        });
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
        this.downloads.set(id, { loaded: e.loaded, total: e.total, file: e.file, ...(e.note ? { note: e.note } : {}) });
        const t = this.now();
        if (t - this.lastDownloadEmit < DOWNLOAD_EMIT_MS && e.loaded < e.total) return null;
        this.lastDownloadEmit = t;
        if (t - this.lastDownloadWrite >= DOWNLOAD_WRITE_MS || e.loaded >= e.total) {
          this.lastDownloadWrite = t;
          const written = await this.store.patch(id, { downloaded_bytes: e.loaded });
          this.emit({ type: 'job', job: written });
          return written;
        }
        const job = await this.store.get(id);
        if (job) this.emit({ type: 'job', job });
        return job; // (a long download is where a cancel from another tab is noticed)
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
      case 'checkpoint':
        // where a reloaded page continues: stored with the job, after the lines it covers (same chain, in order)
        return this.store.patch(id, { checkpoint: e.state });
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
