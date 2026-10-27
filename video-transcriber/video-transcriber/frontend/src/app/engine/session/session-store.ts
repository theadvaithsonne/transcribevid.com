/**
 * The visitor's session in the browser: jobs, their segments, edits and titles, and the source file of each job,
 * kept in IndexedDB so that a reload, the player and re-run keep working. Expiry mirrors the server
 * (backend/app/sessions.py): 30 minutes without activity and no job in progress ends the session and deletes
 * everything; "Delete my data now" wipes it on request and the session itself stays valid.
 */
import { Job, JobSummary, Segment, SegmentEdit, SessionInfo, Stats } from '../../core/models';
import type { ResumeState } from '../worker/protocol';
import { SessionBackend, WriteOp } from './backend';

/** Fields of the history list: backend/app/jobs.py SUMMARY_FIELDS, in the same order. */
export const SUMMARY_FIELDS = [
  'id',
  'title',
  'filename',
  'status',
  'phase',
  'progress',
  'eta_seconds',
  'error',
  'cancel_requested',
  'created_at',
  'started_at',
  'finished_at',
  'language',
  'duration',
  'size_bytes',
  'media_kind',
  'options',
  'segment_count',
] as const satisfies readonly (keyof JobSummary)[];

export const DEFAULT_IDLE_MINUTES = 30;
export const DEFAULT_CHECK_INTERVAL_MS = 60_000;
/** Without the Web Locks API a queued / running job counts as alive while it was written this recently. */
export const DEFAULT_STALE_AFTER_SECONDS = 600;
/** The Cache API cache Transformers.js keeps the model files in. */
export const MODEL_CACHE_NAME = 'transformers-cache';
export const INTERRUPTED_ERROR = 'The page was closed or reloaded while this job was running. Run it again.';
/** `resumeInterrupted`, when the job's file is not stored (the browser had no room for a copy): "Run it again" cannot work. */
export const INTERRUPTED_NO_FILE_ERROR =
  'The page was closed or reloaded while this job was running, and this browser could not keep a copy of the file. ' +
  'Choose the file again to transcribe it.';
/** `resumeInterrupted`: a job that keeps losing its page without getting any further ends with one of these. */
export const STUCK_ERROR =
  'This page reloaded several times while working on this file without getting any further, which usually means the ' +
  'device ran out of memory. Try the Fastest quality, or a shorter file.';
export const STUCK_LOADING_ERROR =
  'This page reloaded several times while the speech model was loading, which usually means the device ran out of ' +
  'memory for this model. Try the Fastest quality. The downloaded part of the model is kept.';
/**
 * Interruptions in a row without progress before the job ends (a reload or crash loop). Progress is a new line of
 * transcript, or more of the model downloaded: a refresh during a slow download continues and never counts.
 */
export const MAX_STUCK_RESUMES = 3;
const META_KEY = 'session';

export interface LanguageCandidate {
  language: string;
  probability: number;
}

/** What one job looks like in the store: today's Job plus the store's own bookkeeping. */
export interface StoredJob extends Job {
  /** seconds; bumped on every write */
  updated_at: number;
  /** bumped on every write, like the server's job["version"] */
  version: number;
  /** MIME type of the stored source Blob, null when no Blob is stored */
  media_type: string | null;
  /** the top candidates of language detection (worker 'language' event), when the engine reported them */
  language_candidates?: LanguageCandidate[] | null;
  /** Whisper: where to continue after the page went away (the worker's checkpoint, without audio); null once it ends */
  checkpoint?: ResumeState | null;
  /** how often this job was continued after its page went away (a reload, a closed tab, a crash of the tab) */
  resume_count?: number;
  /** interruptions in a row that brought no new line (a reload loop); MAX_STUCK_RESUMES ends the job */
  stuck_count?: number;
  /** segment_count at the last interruption: more lines since then is progress */
  resume_mark?: number;
  /** bytes of the model download reached so far (the runner writes it every few seconds while downloading) */
  downloaded_bytes?: number;
  /** downloaded_bytes at the last interruption: more since then is progress */
  download_mark?: number;
  /** run it in low-memory mode: set after an interruption without progress, or after the engine worker crashed */
  low_memory?: boolean;
  /** automatic restarts after the engine worker itself crashed (the page stayed) */
  worker_retries?: number;
}

/** The bookkeeping of resuming: never copied into a re-run, never shown on the page. */
export const RESUME_FIELDS = [
  'checkpoint',
  'resume_count',
  'stuck_count',
  'resume_mark',
  'downloaded_bytes',
  'download_mark',
  'low_memory',
  'worker_retries',
] as const;

/** Input of put(): bookkeeping fields are optional, the store fills them. */
export type JobInput = Job &
  Partial<Pick<StoredJob, 'updated_at' | 'version' | 'media_type' | 'language_candidates'>>;

type JobRecord = Omit<StoredJob, 'segments'>;

interface SessionMeta {
  session_id: string;
  created_at: number;
  last_activity: number;
}

export interface SessionEnded {
  reason: 'expired';
  /** seconds since the last activity when the session was ended */
  idleSeconds: number;
  jobCount: number;
}

/** navigator.locks, the parts the store uses. The callback gets null when `ifAvailable` found the lock taken. */
export interface LockManagerLike {
  request(name: string, callback: (lock: unknown) => Promise<void>): Promise<unknown>;
  request(name: string, options: { ifAvailable?: boolean }, callback: (lock: unknown) => Promise<void>): Promise<unknown>;
  query(): Promise<{ held?: { name?: string }[]; pending?: { name?: string }[] }>;
}

export interface CacheStorageLike {
  delete(name: string): Promise<boolean>;
}

export interface SessionStoreOptions {
  idleMinutes?: number;
  checkIntervalMs?: number;
  /** milliseconds, like Date.now */
  now?: () => number;
  /** Web Locks (navigator.locks): exact liveness of running jobs across tabs and reloads; null = heartbeat only */
  locks?: LockManagerLike | null;
  caches?: CacheStorageLike | null;
  /** recomputes stats after an edit (engine/post computeStats); without it the stats stay as they were */
  computeStats?: (segments: Segment[], duration: number | null) => Stats | null;
  staleAfterSeconds?: number;
  onEnded?: (e: SessionEnded) => void;
  /**
   * A queued or running job whose page went away (reload, closed tab, a phone that dropped the tab) is queued again
   * for this page instead of ending with INTERRUPTED_ERROR: `takeRecovered()` / `onRecovered()` hand it to the runner,
   * which continues it from its checkpoint. A job that keeps getting interrupted without progress ends with
   * STUCK_ERROR; a job without its stored file, or one being cancelled, ends as before.
   */
  resumeInterrupted?: boolean;
  /** a failed background check (the store keeps going) */
  onError?: (e: unknown) => void;
  newSessionId?: () => string;
}

export class SessionStoreError extends Error {
  constructor(
    message: string,
    readonly code: 'not-found' | 'invalid',
  ) {
    super(message);
    this.name = 'SessionStoreError';
  }
}

const ACTIVE = new Set(['queued', 'running']);
const TERMINAL = new Set(['done', 'error', 'cancelled']);
const lockName = (id: string) => `tv-job-${id}`;

function randomId(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function globalLocks(): LockManagerLike | null {
  const nav = (globalThis as { navigator?: { locks?: LockManagerLike } }).navigator;
  return nav?.locks ?? null;
}

function globalCaches(): CacheStorageLike | null {
  return (globalThis as { caches?: CacheStorageLike }).caches ?? null;
}

export function toSummary(job: JobRecord | StoredJob): JobSummary {
  const out: Record<string, unknown> = {};
  for (const k of SUMMARY_FIELDS) out[k] = job[k] ?? null;
  out['cancel_requested'] = job.cancel_requested ?? false;
  return out as unknown as JobSummary;
}

export class SessionStore {
  readonly idleSeconds: number;
  private readonly opts: SessionStoreOptions;
  private readonly now: () => number;
  private readonly locks: LockManagerLike | null;
  private readonly caches: CacheStorageLike | null;
  private meta!: SessionMeta;
  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly ownLocks = new Map<string, () => void>();
  private readonly listeners = new Set<(e: SessionEnded) => void>();
  /** jobs queued again for this page after their page went away (resumeInterrupted), oldest first, not yet taken */
  private readonly recovered: string[] = [];
  private readonly recoveredListeners = new Set<() => void>();
  /**
   * Jobs a background check found without their page for the first time. They are taken over at the next check, so
   * that a page that is only reloading (it opens within seconds and continues the job itself) keeps its own job: the
   * job then shows live in the tab the visitor is looking at, not in another tab in the background.
   */
  private readonly suspects = new Set<string>();
  /**
   * Source files this browser would not store (no room left, or Safari refusing a large Blob): kept for this page only,
   * so the job still runs now. A reload loses them, and the job then ends with INTERRUPTED_NO_FILE_ERROR.
   */
  private readonly pageMedia = new Map<string, Blob>();
  private endedState: SessionEnded | null = null;
  private closed = false;
  /** serialises read-modify-write operations so two quick patches cannot lose each other */
  private chain: Promise<unknown> = Promise.resolve();

  private constructor(
    private readonly backend: SessionBackend,
    opts: SessionStoreOptions,
  ) {
    this.opts = opts;
    this.idleSeconds = (opts.idleMinutes ?? DEFAULT_IDLE_MINUTES) * 60;
    this.now = opts.now ?? Date.now;
    this.locks = opts.locks === undefined ? globalLocks() : opts.locks;
    this.caches = opts.caches === undefined ? globalCaches() : opts.caches;
    if (opts.onEnded) this.listeners.add(opts.onEnded);
  }

  /** Opens the session on `backend`: checks expiry at once (an idle session from an earlier visit ends here). */
  static async open(backend: SessionBackend, opts: SessionStoreOptions = {}): Promise<SessionStore> {
    const store = new SessionStore(backend, opts);
    const meta = await backend.get<SessionMeta>('meta', META_KEY);
    store.meta = meta ?? (await store.newMeta());
    await store.check(true);
    const every = opts.checkIntervalMs ?? DEFAULT_CHECK_INTERVAL_MS;
    if (every > 0) {
      store.timer = setInterval(() => {
        store.checkExpiry().catch((e) => store.opts.onError?.(e));
      }, every);
    }
    return store;
  }

  private nowSeconds(): number {
    return this.now() / 1000;
  }

  private async newMeta(): Promise<SessionMeta> {
    const t = this.nowSeconds();
    const meta = {
      session_id: (this.opts.newSessionId ?? randomId)(),
      created_at: t,
      last_activity: t,
    };
    await this.backend.write([{ store: 'meta', key: META_KEY, value: meta }]);
    return meta;
  }

  private serial<T>(fn: () => Promise<T>): Promise<T> {
    const run = this.chain.then(fn, fn);
    this.chain = run.catch(() => undefined);
    return run;
  }

  // ------------------------------------------------------------------ reads

  /** The history list: SUMMARY_FIELDS only, newest first (like JobStore.summaries). */
  async list(): Promise<JobSummary[]> {
    const rows = await this.backend.getAll<JobRecord>('jobs');
    return rows
      .sort((a, b) => b.created_at - a.created_at || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .map(toSummary);
  }

  async get(id: string): Promise<StoredJob | null> {
    const rec = await this.backend.get<JobRecord>('jobs', id);
    if (!rec) return null;
    const segments = (await this.backend.get<Segment[]>('segments', id)) ?? [];
    return { ...rec, segments };
  }

  /** The source file of a job (for the player and re-run), or null. */
  async getMedia(id: string): Promise<Blob | null> {
    return this.pageMedia.get(id) ?? (await this.backend.get<Blob>('media', id)) ?? null;
  }

  /** True when the browser would not store the job's file and only this page holds it (a reload loses the job). */
  mediaOnlyInPage(id: string): boolean {
    return this.pageMedia.has(id);
  }

  // ------------------------------------------------------------------ writes

  /** Adds or replaces a job. `media` stores its source file; leaving it out keeps the stored one. */
  put(job: JobInput, media?: Blob): Promise<StoredJob> {
    return this.serial(async () => {
      const prev = await this.backend.get<JobRecord>('jobs', job.id);
      const { segments, ...rest } = job;
      const rec: JobRecord = {
        ...rest,
        cancel_requested: rest.cancel_requested ?? false,
        segment_count: segments.length,
        updated_at: this.nowSeconds(),
        version: Math.max(prev?.version ?? 0, rest.version ?? 0) + 1,
        media_type: media ? media.type || 'application/octet-stream' : (prev?.media_type ?? null),
      };
      const ops: WriteOp[] = [
        { store: 'jobs', key: job.id, value: rec },
        { store: 'segments', key: job.id, value: segments },
      ];
      if (media) ops.push({ store: 'media', key: job.id, value: media });
      ops.push(this.touchOp());
      try {
        await this.backend.write(ops);
        if (media) this.pageMedia.delete(job.id); // stored now: the browser keeps it
      } catch (e) {
        // a file whose data is gone (moved or deleted after it was chosen) is no better kept in the page
        const name = (e as { name?: string } | null)?.name;
        if (!media || name === 'NotReadableError' || name === 'NotFoundError') throw e;
        // The copy of the file is what failed, most likely (a 2 GB video on a phone with little room, Safari's "Error
        // preparing Blob/File data"): store the job without it and keep the file in this page, so it is transcribed
        // now. When the job itself cannot be written either, the original error is the one to report.
        try {
          await this.backend.write(ops.filter((op) => op.store !== 'media'));
        } catch {
          throw e;
        }
        this.pageMedia.set(job.id, media);
      }
      this.track(rec);
      return { ...rec, segments };
    });
  }

  /**
   * Merges fields into a stored job (the runner's phase / progress / segment updates). A job that reaches a final
   * status counts as activity, like the server's _finish().
   */
  patch(id: string, fields: Partial<Omit<StoredJob, 'id'>>): Promise<StoredJob> {
    return this.serial(async () => {
      const prev = await this.backend.get<JobRecord>('jobs', id);
      if (!prev) throw new SessionStoreError('Job not found.', 'not-found');
      const { segments, ...rest } = fields;
      const rec: JobRecord = {
        ...prev,
        ...rest,
        id,
        updated_at: this.nowSeconds(),
        version: prev.version + 1,
      };
      if (segments) rec.segment_count = segments.length;
      const ops: WriteOp[] = [{ store: 'jobs', key: id, value: rec }];
      if (segments) ops.push({ store: 'segments', key: id, value: segments });
      if (rest.status && TERMINAL.has(rest.status) && !TERMINAL.has(prev.status)) ops.push(this.touchOp());
      await this.backend.write(ops);
      this.track(rec);
      const stored = segments ?? (await this.backend.get<Segment[]>('segments', id)) ?? [];
      return { ...rec, segments: stored };
    });
  }

  /**
   * The user's transcript edits: backend/app/jobs.py update_segments. `edits` = [{id, text, start?, end?,
   * deleted?}] for the segments that changed; changed text drops the word timings and marks the segment edited.
   */
  patchSegments(id: string, edits: SegmentEdit[]): Promise<StoredJob> {
    return this.serial(async () => {
      const job = await this.get(id);
      if (!job) throw new SessionStoreError('Job not found.', 'not-found');
      if (job.status !== 'done') throw new SessionStoreError('The transcript is not finished yet.', 'invalid');
      const byId = new Map(edits.map((e) => [e.id, e]));
      const next: Segment[] = [];
      for (const s of job.segments) {
        const e = byId.get(s.id);
        if (e?.deleted) continue;
        if (e) {
          const text = e.text.trim();
          if (text !== s.text) {
            s.text = text;
            s.words = null;
            s.edited = true;
          }
          s.start = Math.max(0, Number(e.start ?? s.start));
          s.end = Math.max(s.start + 0.1, Number(e.end ?? s.end));
        }
        next.push(s);
      }
      const stats = this.opts.computeStats ? this.opts.computeStats(next, job.duration) : job.stats;
      const { segments: _old, ...rec } = job;
      const updated: JobRecord = {
        ...rec,
        segment_count: next.length,
        stats,
        updated_at: this.nowSeconds(),
        version: job.version + 1,
      };
      await this.backend.write([
        { store: 'jobs', key: id, value: updated },
        { store: 'segments', key: id, value: next },
        this.touchOp(),
      ]);
      return { ...updated, segments: next };
    });
  }

  /** Renames a job: backend/app/jobs.py update_title (trimmed, at most 200 characters, empty keeps the old one). */
  setTitle(id: string, title: string): Promise<StoredJob> {
    return this.serial(async () => {
      const job = await this.get(id);
      if (!job) throw new SessionStoreError('Job not found.', 'not-found');
      const rec: JobRecord = {
        ...job,
        title: title.trim().slice(0, 200) || job.title,
        updated_at: this.nowSeconds(),
        version: job.version + 1,
      };
      delete (rec as Partial<StoredJob>).segments;
      await this.backend.write([{ store: 'jobs', key: id, value: rec }, this.touchOp()]);
      return { ...rec, segments: job.segments };
    });
  }

  /** Deletes one job with its segments and source file. A running job must be cancelled first (as on the server). */
  delete(id: string): Promise<void> {
    return this.serial(async () => {
      const rec = await this.backend.get<JobRecord>('jobs', id);
      if (!rec) throw new SessionStoreError('Job not found.', 'not-found');
      if (rec.status === 'running') throw new SessionStoreError('Cancel the running job first.', 'invalid');
      await this.backend.write([
        { store: 'jobs', key: id, delete: true },
        { store: 'segments', key: id, delete: true },
        { store: 'media', key: id, delete: true },
        this.touchOp(),
      ]);
      this.pageMedia.delete(id);
      this.release(id);
    });
  }

  /**
   * "Delete my data now": every job, segment and file goes; the session continues, empty, with a new id (the
   * server keeps the cookie but its store is new). The caller cancels a running job first. Returns the job count.
   */
  clear(): Promise<number> {
    return this.serial(async () => {
      const n = (await this.backend.getAll<JobRecord>('jobs')).length;
      await this.backend.clear();
      this.pageMedia.clear();
      for (const id of [...this.ownLocks.keys()]) this.release(id);
      this.meta = await this.newMeta();
      return n;
    });
  }

  /** Deletes the cached model files (Cache API) when the visitor asks for it too. False when there was none. */
  async deleteModels(): Promise<boolean> {
    // the parts of an unfinished download (engine/models resumable-download) go too
    await import('../models/resumable-download').then((m) => m.deleteAllDownloads()).catch(() => false);
    if (!this.caches) return false;
    return this.caches.delete(MODEL_CACHE_NAME);
  }

  // ------------------------------------------------------------------ activity and expiry

  /** The visitor did something (the server touches on every request, including the history poll). */
  async touch(): Promise<void> {
    await this.backend.write([this.touchOp()]);
  }

  private touchOp(): WriteOp {
    this.meta = { ...this.meta, last_activity: Math.max(this.meta.last_activity, this.nowSeconds()) };
    return { store: 'meta', key: META_KEY, value: this.meta };
  }

  /** The session as GET /api/session reports it. A job in progress keeps the full idle time on the clock. */
  async info(): Promise<SessionInfo> {
    await this.refreshMeta();
    const jobs = await this.backend.getAll<JobRecord>('jobs');
    const busy = (await this.aliveJobs(jobs)).length > 0;
    const idle = this.nowSeconds() - this.meta.last_activity;
    return {
      session_id: this.meta.session_id.slice(0, 12),
      created_at: this.meta.created_at,
      last_seen: this.meta.last_activity,
      expires_in_seconds: busy ? this.idleSeconds : Math.max(0, Math.floor(this.idleSeconds - idle)),
      job_count: jobs.length,
    };
  }

  get ended(): SessionEnded | null {
    return this.endedState;
  }

  dismissEnded(): void {
    this.endedState = null;
  }

  /** Subscribes to the end of the session; returns the unsubscribe function. */
  onEnded(listener: (e: SessionEnded) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** The jobs this page took over since the last call (resumeInterrupted), oldest first: the runner queues them. */
  takeRecovered(): string[] {
    return this.recovered.splice(0);
  }

  /** Called when a background check took over more jobs; call `takeRecovered()` then. */
  onRecovered(listener: () => void): () => void {
    this.recoveredListeners.add(listener);
    return () => this.recoveredListeners.delete(listener);
  }

  /**
   * Runs on open and every `checkIntervalMs`: marks jobs whose page went away as interrupted, then ends the session
   * when it has been idle for `idleMinutes` with no job in progress. True when it ended the session now.
   */
  checkExpiry(): Promise<boolean> {
    return this.check(false);
  }

  /** `atOpen`: the check of a page that just opened takes over a job without its page at once (see `suspects`). */
  private check(atOpen: boolean): Promise<boolean> {
    return this.serial(async () => {
      if (this.closed) return false;
      await this.refreshMeta();
      const jobs = await this.backend.getAll<JobRecord>('jobs');
      if (!this.locks) await this.heartbeat(jobs);
      const alive = await this.aliveJobs(jobs);
      const waiting = await this.recoverInterrupted(jobs, alive, atOpen);
      if (alive.length > 0 || waiting > 0) return false;
      const idle = this.nowSeconds() - this.meta.last_activity;
      if (idle <= this.idleSeconds) return false;
      await this.backend.clear();
      this.pageMedia.clear();
      for (const id of [...this.ownLocks.keys()]) this.release(id);
      this.meta = await this.newMeta();
      // an idle session that never held anything ends silently (there is nothing the visitor lost)
      if (jobs.length === 0) return false;
      const e: SessionEnded = { reason: 'expired', idleSeconds: Math.round(idle), jobCount: jobs.length };
      this.endedState = e;
      for (const l of [...this.listeners]) l(e);
      return true;
    });
  }

  /** Stops the timer and releases this page's job locks; the backend stays open (its owner closes it). */
  close(): void {
    this.closed = true;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    for (const id of [...this.ownLocks.keys()]) this.release(id);
    this.pageMedia.clear();
  }

  private async refreshMeta(): Promise<void> {
    // another tab may have touched the session or cleared it
    const m = await this.backend.get<SessionMeta>('meta', META_KEY);
    if (!m) return;
    this.meta =
      m.session_id === this.meta.session_id
        ? { ...m, last_activity: Math.max(m.last_activity, this.meta.last_activity) }
        : m;
  }

  /**
   * Without Web Locks a job is alive while its last write is fresh, and a long model download or a slow window writes
   * nothing for minutes: another tab would then take the job for one whose page went away and run it a second time.
   * Every check refreshes the jobs this page works on (not their version: nothing in them changed).
   */
  private async heartbeat(jobs: JobRecord[]): Promise<void> {
    const now = this.nowSeconds();
    const every = (this.opts.staleAfterSeconds ?? DEFAULT_STALE_AFTER_SECONDS) / 2;
    const ops: WriteOp[] = [];
    for (const j of jobs) {
      if (!ACTIVE.has(j.status) || !this.ownLocks.has(j.id) || now - (j.updated_at ?? 0) < every) continue;
      // read again just before the write: a cancel another tab wrote a moment ago must not be lost
      const cur = await this.backend.get<JobRecord>('jobs', j.id);
      if (!cur || !ACTIVE.has(cur.status)) continue;
      j.updated_at = now;
      ops.push({ store: 'jobs', key: j.id, value: { ...cur, updated_at: now } });
    }
    if (ops.length) await this.backend.write(ops);
  }

  /** Queued / running jobs that something is still working on: this page, another tab (lock), or a fresh write. */
  private async aliveJobs(jobs: JobRecord[]): Promise<string[]> {
    const active = jobs.filter((j) => ACTIVE.has(j.status));
    if (!active.length) return [];
    let held = new Set<string>();
    if (this.locks) {
      try {
        const q = await this.locks.query();
        // a pending request is a page that is alive and asked for the lock a moment ago (granted any time now)
        held = new Set([...(q.held ?? []), ...(q.pending ?? [])].map((h) => h.name ?? ''));
      } catch {
        held = new Set();
      }
    }
    const stale = this.opts.staleAfterSeconds ?? DEFAULT_STALE_AFTER_SECONDS;
    const now = this.nowSeconds();
    return active
      .filter(
        (j) =>
          this.ownLocks.has(j.id) ||
          held.has(lockName(j.id)) ||
          (!this.locks && now - (j.updated_at ?? 0) < stale),
      )
      .map((j) => j.id);
  }

  /**
   * Queues again (or ends) the jobs whose page went away. Returns how many such jobs a background check leaves for the
   * next check (`suspects`); they count as alive meanwhile, so the session is not ended under a page that is reloading.
   */
  private async recoverInterrupted(jobs: JobRecord[], alive: string[], atOpen: boolean): Promise<number> {
    const dead = jobs.filter((j) => ACTIVE.has(j.status) && !alive.includes(j.id));
    for (const id of [...this.suspects]) if (!dead.some((j) => j.id === id)) this.suspects.delete(id);
    const ops: WriteOp[] = [];
    const written: JobRecord[] = [];
    let waiting = 0;
    for (const j of dead) {
      // without Web Locks the 10-minute heartbeat rule already waited; with them, the page itself may be reopening
      if (this.locks && !atOpen && !this.suspects.has(j.id)) {
        this.suspects.add(j.id);
        waiting++;
        continue;
      }
      // two tabs that open at the same moment (a browser restoring its tabs) both find the job without a lock: only
      // the one that gets its lock continues it, so it is never transcribed twice at once
      if (!(await this.claim(j.id))) continue;
      const cur = await this.backend.get<JobRecord>('jobs', j.id);
      if (!cur || !ACTIVE.has(cur.status) || cur.version !== j.version || (await this.wantedElsewhere(j.id))) {
        this.release(j.id); // finished, deleted or taken over meanwhile, or a live page is asking for it
        continue;
      }
      this.suspects.delete(j.id);
      const hasMedia = !!this.opts.resumeInterrupted && !!(await this.backend.get<Blob>('media', j.id));
      const rec = this.afterInterruption(cur, hasMedia);
      ops.push({ store: 'jobs', key: j.id, value: rec });
      written.push(rec);
    }
    if (!ops.length) return waiting;
    try {
      await this.backend.write(ops);
    } catch (e) {
      for (const r of written) this.release(r.id);
      throw e;
    }
    const requeued = written.filter((r) => r.status === 'queued').sort((a, b) => a.created_at - b.created_at);
    for (const r of written) this.track(r); // a requeued job keeps the lock claimed above; an ended one lets it go
    for (const r of requeued) this.recovered.push(r.id);
    if (requeued.length) for (const l of [...this.recoveredListeners]) l();
    return waiting;
  }

  /**
   * Takes a job's Web Lock only when no page holds it (`ifAvailable`). True when this page holds it now, or when
   * there is no working Web Locks API to ask (then the heartbeat rule alone decides, as before).
   */
  private async claim(id: string): Promise<boolean> {
    if (!this.locks || this.ownLocks.has(id)) return true;
    let release!: () => void;
    const held = new Promise<void>((r) => (release = r));
    const granted = await new Promise<boolean>((resolve) => {
      let answered = false;
      const answer = (v: boolean) => {
        if (answered) return;
        answered = true;
        resolve(v);
      };
      try {
        this.locks!.request(lockName(id), { ifAvailable: true }, async (lock) => {
          answer(!!lock);
          if (lock) await held;
        }).catch(() => answer(true));
      } catch {
        answer(true);
      }
    });
    if (granted) this.ownLocks.set(id, release);
    else release();
    return granted;
  }

  /** Another page asked for the job's lock (it is alive and running the job, but its lock was not granted yet). */
  private async wantedElsewhere(id: string): Promise<boolean> {
    if (!this.locks) return false;
    try {
      const q = await this.locks.query();
      return (q.pending ?? []).some((p) => p.name === lockName(id));
    } catch {
      return false;
    }
  }

  /** What a queued / running job becomes when its page went away: queued again (resumeInterrupted), or ended. */
  private afterInterruption(j: JobRecord, hasMedia: boolean): JobRecord {
    const now = this.nowSeconds();
    const ended = (status: 'error' | 'cancelled', error: string | null): JobRecord => ({
      ...j,
      status,
      error,
      phase: null,
      eta_seconds: null,
      cancel_requested: false,
      finished_at: j.updated_at ?? now,
      version: (j.version ?? 0) + 1,
      checkpoint: null,
    });
    if (!this.opts.resumeInterrupted) return ended('error', INTERRUPTED_ERROR);
    if (j.cancel_requested) return ended('cancelled', null); // the visitor was cancelling it anyway
    if (!hasMedia) return ended('error', INTERRUPTED_NO_FILE_ERROR);
    const lines = j.segment_count ?? 0;
    const bytes = j.downloaded_bytes ?? 0;
    const loading = j.phase === 'loading_model';
    // a job that never started, wrote new lines, or downloaded more of its model since the last interruption is not
    // stuck; a model that is downloaded but crashes the tab while it loads into memory is (it never gets further)
    const progressed = j.status === 'queued' || lines > (j.resume_mark ?? -1) || (loading && bytes > (j.download_mark ?? -1));
    const stuck = progressed ? 0 : (j.stuck_count ?? 0) + 1;
    if (stuck >= MAX_STUCK_RESUMES) return ended('error', loading ? STUCK_LOADING_ERROR : STUCK_ERROR);
    return {
      ...j,
      status: 'queued',
      error: null,
      phase: null,
      eta_seconds: null,
      updated_at: now,
      version: (j.version ?? 0) + 1,
      resume_count: (j.resume_count ?? 0) + (j.status === 'running' ? 1 : 0),
      stuck_count: stuck,
      resume_mark: lines,
      download_mark: bytes,
      // twice without progress outside the download: try the low-memory path from now on
      low_memory: !!j.low_memory || (stuck > 0 && !loading),
    };
  }

  /** Holds a Web Lock for every job this page has queued or running; releases it when the job ends. */
  private track(rec: JobRecord): void {
    if (ACTIVE.has(rec.status)) this.hold(rec.id);
    else this.release(rec.id);
  }

  private hold(id: string): void {
    if (this.ownLocks.has(id)) return;
    let release!: () => void;
    const held = new Promise<void>((r) => (release = r));
    this.ownLocks.set(id, release);
    this.locks?.request(lockName(id), () => held).catch(() => undefined);
  }

  private release(id: string): void {
    const r = this.ownLocks.get(id);
    this.ownLocks.delete(id);
    r?.();
  }
}
