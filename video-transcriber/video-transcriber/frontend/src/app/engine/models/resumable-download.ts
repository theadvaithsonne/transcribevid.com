/**
 * Resumable download of one big file (the speech models are 40 MB to 1 GB per file) for slow and flaky connections,
 * phones above all. Transformers.js and a plain fetch() hold a half-downloaded file in memory only: a dropped
 * connection, a reload or a phone that discards the tab starts it again from zero, and on a slow line a 250 MB file
 * then never finishes. Here the file comes in with HTTP Range requests and every 8 MiB part is saved in IndexedDB
 * ('tv-downloads', apart from the session database 'tv-session') the moment it is complete, so the next attempt, in this
 * page or after a reload, continues at the first missing part:
 *
 * - one request per stretch of missing parts (`Range: bytes=<first missing byte>-`), so a good line pays one Hugging
 *   Face redirect per file rather than one per part; a single simple range is CORS-safelisted (no preflight). The bytes
 *   of a part that was cut off stay in memory, and the retry asks only for the rest of it.
 * - A 206 must start where asked (Content-Range); a 200 (the server ignored Range) is read from the start and the parts
 *   it covers are saved as they pass. The size and the ETag (else Last-Modified) are kept with the parts; a file that
 *   changed on the server drops the stale parts.
 * - A failed attempt is retried after 1, 2, 4 ... 30 s; no byte for 30 s counts as a dropped connection; while the
 *   browser says it is offline the download waits for the connection instead of using up attempts. It gives up after 8
 *   failed attempts in a row (an attempt that brought new bytes is not a failure) and keeps the parts for "Try again".
 * - A cancel stops at once and keeps the parts.
 *
 * The result is one Blob made of the saved parts (disk-backed in browsers, so no second copy in memory). The caller
 * stores it (the Cache API) and then drops the parts with `discardDownload`.
 */
import { CancelledError } from '../asr/types';

export const PARTS_DB_NAME = 'tv-downloads';
const PARTS_DB_VERSION = 1;
/** Bytes per saved part: what a reload can lose at most, and one IndexedDB write. */
export const CHUNK_BYTES = 8 * 1024 * 1024;
const MAX_ATTEMPTS = 8;
const STALL_MS = 30_000;
const RETRY_BASE_MS = 1000;
const RETRY_MAX_MS = 30_000;
const PROGRESS_MS = 250;
/** How long "Continuing the download (... already saved)" stays up after a resume. */
const CONTINUE_NOTE_MS = 5000;
/** Parts nobody touched for this long belong to a download the visitor gave up on (another model): dropped. */
const STALE_MS = 14 * 24 * 3600 * 1000;

export interface FetchInit {
  signal?: AbortSignal;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

export type FetchLike = (url: string, init?: FetchInit) => Promise<Response>;

/** What is kept next to the parts of one file. */
export interface DownloadMeta {
  url: string;
  /** Bytes of the whole file; null until the server said. */
  size: number | null;
  chunkBytes: number;
  /** ETag, else Last-Modified, of the file the parts came from. */
  validator: string | null;
  /** Content-Type the server gave. */
  type: string | null;
  /** Date.now() when a part was last saved. */
  updated: number;
}

/** Where the parts live: IndexedDB in the browser, memory in tests (and where IndexedDB is missing). */
export interface PartStore {
  meta(url: string): Promise<DownloadMeta | undefined>;
  /** Indices of the saved parts. */
  parts(url: string): Promise<number[]>;
  part(url: string, index: number): Promise<Blob | undefined>;
  /** Saves a part together with the meta (one transaction: there are never parts without their meta). */
  save(meta: DownloadMeta, index: number, data: Blob): Promise<void>;
  saveMeta(meta: DownloadMeta): Promise<void>;
  remove(url: string): Promise<void>;
  /** Every file with saved parts. */
  list(): Promise<DownloadMeta[]>;
  clear(): Promise<void>;
}

export interface NetworkStatus {
  online(): boolean;
  /** Resolves when the browser is online again; rejects with CancelledError when the signal fires. */
  waitOnline(signal?: AbortSignal): Promise<void>;
}

export interface DownloadProgress {
  /** Bytes of the file saved or received so far, including the parts an earlier visit saved. */
  loaded: number;
  /** Size of the file: exact once the server (or the saved parts) said, else the estimate, else 0. */
  total: number;
  /** Bytes that were saved before this call (a resume). */
  resumedBytes: number;
  /** True while the "Continuing the download" note shows (a caller may word it for the whole model). */
  continuing?: boolean;
  /** Set while the download is not simply running: waiting for the connection, retrying, continuing. */
  note?: string;
}

/** Retry, stall and part-size settings; the defaults are for real phones, tests make them quick. */
export interface DownloadTuning {
  chunkBytes?: number;
  /** Failed attempts in a row (attempts that brought no new byte) before giving up; default 8. */
  maxAttempts?: number;
  /** No byte for this long = a dead connection: abort the request and retry; default 30 s. */
  stallMs?: number;
  /** First and largest wait between attempts; default 1 s and 30 s. */
  retryBaseMs?: number;
  retryMaxMs?: number;
  /** Shortest gap between two progress reports (default 250 ms; notes and finished parts always report). */
  progressMs?: number;
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>;
  network?: NetworkStatus;
  now?: () => number;
}

export interface DownloadOptions extends DownloadTuning {
  /** Exact size in bytes (pinned files): another size on the server is an error. */
  size?: number;
  /** Size for the progress bar until the server says (the catalog's sizes are rounded). */
  estimatedSize?: number;
  signal?: AbortSignal;
  onProgress?: (p: DownloadProgress) => void;
  store?: PartStore;
  fetchImpl?: FetchLike;
}

export type DownloadErrorCode = 'http' | 'network' | 'size' | 'changed' | 'storage';

export class DownloadError extends Error {
  constructor(
    readonly code: DownloadErrorCode,
    message: string,
    readonly url: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'DownloadError';
  }
}

/** Download size as the UI shows it: decimal MB below 1 GB ('41 MB'), else GB ('1.8 GB'). */
export function formatDownloadSize(bytes: number): string {
  const mb = bytes / 1e6;
  if (mb < 1) return '1 MB';
  if (mb < 999.5) return `${Math.round(mb)} MB`;
  return `${(mb / 1000).toFixed(1)} GB`;
}

export function continuingNote(savedBytes: number): string {
  return `Continuing the download (${formatDownloadSize(savedBytes)} already saved)`;
}

/**
 * Downloads `url` with resume (see the file comment) and returns the whole file as one Blob. Errors: CancelledError
 * (the signal, or a newer call for the same URL in this page), DownloadError (gave up, a missing file, a size that does
 * not match); the saved parts stay unless they were stale.
 */
export async function downloadResumable(url: string, options: DownloadOptions = {}): Promise<Blob> {
  void requestPersistentStorage();
  // one download per file per page: a newer call (a job started again after a cancel) takes over the older one
  for (let prev = running.get(url); prev; prev = running.get(url)) {
    prev.stop.abort();
    await prev.settled;
  }
  if (options.signal?.aborted) throw new CancelledError();
  const o = withDefaults(options);
  pruneOnce(o.store, url, o.now());
  const stop = new AbortController();
  const signal = linkSignals(stop.signal, options.signal);
  const job = new Download(url, o, signal.signal).run();
  const entry: Running = {
    stop,
    settled: job.then(noop, noop).then(() => {
      signal.dispose();
      if (running.get(url) === entry) running.delete(url);
    }),
  };
  running.set(url, entry);
  return job;
}

/** Bytes already saved for `url` (for the quota check and the first progress figure). Never throws. */
export async function savedDownload(
  url: string,
  store: PartStore = defaultPartStore(),
): Promise<{ savedBytes: number; size: number | null }> {
  try {
    const meta = await store.meta(url);
    if (!meta) return { savedBytes: 0, size: null };
    return {
      savedBytes: partsBytes(await store.parts(url), meta.chunkBytes, meta.size),
      size: meta.size,
    };
  } catch {
    return { savedBytes: 0, size: null };
  }
}

/** Drops the saved parts of one file (it is stored elsewhere now, or it was wrong). Never throws. */
export async function discardDownload(
  url: string,
  store: PartStore = defaultPartStore(),
): Promise<void> {
  await store.remove(url).catch(() => undefined);
}

/** Drops the saved parts of every file whose URL matches; returns the bytes freed. Never throws. */
export async function discardDownloads(
  match: (url: string) => boolean,
  store: PartStore = defaultPartStore(),
): Promise<number> {
  let bytes = 0;
  try {
    for (const m of await store.list()) {
      if (!match(m.url)) continue;
      bytes += (await savedDownload(m.url, store)).savedBytes;
      await store.remove(m.url);
    }
  } catch {
    // best effort
  }
  return bytes;
}

/** "Delete the downloaded models": every saved part of every file. False when the storage could not be reached. */
export async function deleteAllDownloads(store: PartStore = defaultPartStore()): Promise<boolean> {
  try {
    await store.clear();
    return true;
  } catch {
    return false;
  }
}

/** Drops the parts of downloads untouched for `olderThanMs` (except `keep`). Never throws. */
export async function pruneDownloads(
  store: PartStore,
  now: number,
  olderThanMs = STALE_MS,
  keep?: string,
): Promise<void> {
  try {
    for (const m of await store.list())
      if (m.url !== keep && now - m.updated > olderThanMs) await store.remove(m.url);
  } catch {
    // best effort
  }
}

let persistAsked: Promise<boolean> | null = null;

/**
 * Asks the browser once to keep this site's storage (models, saved parts) when the disk runs low. Best effort:
 * `persist()` exists on pages only (not in workers), some browsers ask the visitor, a refusal changes nothing.
 */
export function requestPersistentStorage(): Promise<boolean> {
  persistAsked ??= (async () => {
    try {
      const storage = (globalThis as { navigator?: { storage?: Partial<StorageManager> } })
        .navigator?.storage;
      if (!storage?.persist) return false;
      if (await storage.persisted?.()) return true;
      return await storage.persist();
    } catch {
      return false;
    }
  })();
  return persistAsked;
}

/** The bytes of a Blob (FileReader where Blob.arrayBuffer is missing: Safari before 14). */
export async function blobBytes(blob: Blob): Promise<Uint8Array> {
  if (typeof blob.arrayBuffer === 'function') return new Uint8Array(await blob.arrayBuffer());
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

// ------------------------------------------------------------------------------------------------ the download

type Resolved = Required<DownloadTuning> &
  Pick<DownloadOptions, 'size' | 'estimatedSize' | 'onProgress'> & {
    store: PartStore;
    fetchImpl: FetchLike;
  };

interface Running {
  stop: AbortController;
  settled: Promise<void>;
}

const running = new Map<string, Running>();
const pruned = new WeakSet<PartStore>();
const noop = () => undefined;

function withDefaults(o: DownloadOptions): Resolved {
  return {
    size: o.size,
    estimatedSize: o.estimatedSize,
    onProgress: o.onProgress,
    store: o.store ?? defaultPartStore(),
    fetchImpl: o.fetchImpl ?? ((url, init) => fetch(url, init)),
    chunkBytes: o.chunkBytes ?? CHUNK_BYTES,
    maxAttempts: o.maxAttempts ?? MAX_ATTEMPTS,
    stallMs: o.stallMs ?? STALL_MS,
    retryBaseMs: o.retryBaseMs ?? RETRY_BASE_MS,
    retryMaxMs: o.retryMaxMs ?? RETRY_MAX_MS,
    progressMs: o.progressMs ?? PROGRESS_MS,
    sleep: o.sleep ?? sleep,
    network: o.network ?? browserNetwork,
    now: o.now ?? Date.now,
  };
}

function pruneOnce(store: PartStore, keep: string, now: number): void {
  if (pruned.has(store)) return;
  pruned.add(store);
  void pruneDownloads(store, now, STALE_MS, keep);
}

/** One attempt failed in a way worth retrying. */
class AttemptError extends Error {
  constructor(
    message: string,
    readonly reason: 'network' | 'stall' | 'server',
    readonly status?: number,
  ) {
    super(message);
  }
}

/** Go round the loop again, not a failed attempt: the parts were dropped (the file changed) or the end was found. */
class Again extends Error {}

interface Filling {
  index: number;
  pieces: Uint8Array[];
  length: number;
}

class Download {
  private meta!: DownloadMeta;
  private readonly saved = new Set<number>();
  private savedBytes = 0;
  private resumedBytes = 0;
  /** Parts the store could not keep (quota, private mode): held here for this call. */
  private readonly memory = new Map<number, Blob>();
  private persist = true;
  /** The part being filled; its bytes survive a dropped connection (not a reload). */
  private cur: Filling | null = null;
  private note: string | undefined;
  private continueUntil = 0;
  private lastReport = -Infinity;
  private lastNote: string | undefined;
  private validatorRestarts = 0;
  private sizeRestarts = 0;
  private refills = 0;
  private trustValidator = true;

  constructor(
    private readonly url: string,
    private readonly o: Resolved,
    private readonly signal: AbortSignal,
  ) {}

  private get loaded(): number {
    return this.savedBytes + (this.cur?.length ?? 0);
  }

  async run(): Promise<Blob> {
    await this.restore();
    this.check();
    if (this.resumedBytes) this.continueUntil = this.o.now() + CONTINUE_NOTE_MS;
    this.report(true);
    let failures = 0;
    for (;;) {
      this.check();
      const start = this.nextStart();
      if (start === null) {
        const blob = await this.assemble();
        if (blob) {
          this.report(true);
          return blob;
        }
        continue;
      }
      if (!this.o.network.online()) {
        await this.waitOnline();
        continue;
      }
      const before = this.loaded;
      try {
        await this.attempt(start);
        if (this.loaded > before) {
          failures = 0;
          continue;
        }
        throw new AttemptError('the server sent no data', 'network');
      } catch (e) {
        if (this.signal.aborted) throw new CancelledError();
        if (e instanceof Again) continue;
        if (!(e instanceof AttemptError)) throw e;
        // the browser went offline: wait for the connection at the top of the loop, it is not a failed attempt
        if (!this.o.network.online()) continue;
        failures = this.loaded > before ? 1 : failures + 1;
        if (failures >= this.o.maxAttempts) {
          const kept = this.savedBytes
            ? `${formatDownloadSize(this.savedBytes)} saved for the next try`
            : 'nothing saved yet';
          throw new DownloadError(
            'network',
            `${e.message} (${failures} failed attempts in a row; ${kept})`,
            this.url,
            e.status,
          );
        }
        await this.backoff(failures, e);
      }
    }
  }

  // ---------------------------------------------------------------------------------------------- one request

  private async attempt(start: number): Promise<void> {
    const ctl = new AbortController();
    const stop = () => ctl.abort();
    this.signal.addEventListener('abort', stop, { once: true });
    const watchdog = new Watchdog(this.o.stallMs, stop);
    try {
      const end = this.rangeEnd(start);
      const res = await abortable(
        this.o.fetchImpl(this.url, {
          headers: { Range: `bytes=${start}-${end ?? ''}` },
          signal: ctl.signal,
          cache: 'no-store',
        }),
        ctl.signal,
      );
      watchdog.feed();
      const { from, last } = await this.accept(res, start, end);
      await this.read(res, from, last, ctl.signal, watchdog);
    } catch (e) {
      if (e instanceof DownloadError || e instanceof Again || this.signal.aborted) throw e;
      if (watchdog.fired)
        throw new AttemptError(`no data for ${Math.round(this.o.stallMs / 1000)} s`, 'stall');
      if (e instanceof AttemptError) throw e;
      throw new AttemptError((e as Error)?.message ?? String(e), 'network');
    } finally {
      watchdog.stop();
      this.signal.removeEventListener('abort', stop);
    }
  }

  /** Checks the answer to a Range request; returns where its body starts in the file and, if known, its last byte. */
  private async accept(
    res: Response,
    start: number,
    end: number | null,
  ): Promise<{ from: number; last: number | null }> {
    if (res.status === 206) {
      const raw = res.headers.get('content-range');
      const range = parseContentRange(raw);
      if (raw !== null && (!range || range.start !== start || (end !== null && range.end > end))) {
        cancelBody(res);
        throw new AttemptError(
          `asked for bytes=${start}-${end ?? ''}, got Content-Range "${raw}"`,
          'network',
        );
      }
      await this.identify(res, range?.size ?? null);
      // no readable Content-Range (not exposed by CORS): the body is the range that was asked for
      return { from: start, last: range ? range.end : end };
    }
    if (res.status === 200) {
      await this.identify(res, null);
      return { from: 0, last: null };
    }
    cancelBody(res);
    if (res.status === 416 && start > 0) {
      // size still unknown and every byte up to `start` in hand: the file ends exactly there
      if (this.meta.size === null && !this.cur?.length) {
        await this.setSize(start);
        throw new Again('the file ends at a part boundary');
      }
      return this.restart('size', 'HTTP 416: the saved size is out of date');
    }
    if (res.status === 408 || res.status === 425 || res.status === 429 || res.status >= 500) {
      throw new AttemptError(`HTTP ${res.status}`, 'server', res.status);
    }
    throw new DownloadError('http', `HTTP ${res.status}`, this.url, res.status);
  }

  /** The file behind this answer: the first answer fixes size and ETag; a different file later drops the parts. */
  private async identify(res: Response, size: number | null): Promise<void> {
    const etag = res.headers.get('etag');
    const validator = etag ? etag.replace(/^W\//, '') : res.headers.get('last-modified');
    const pinned = this.o.size;
    if (size !== null && pinned !== undefined && size !== pinned) {
      cancelBody(res);
      await this.drop();
      throw new DownloadError(
        'size',
        `the file on the server has ${size} bytes, expected ${pinned}`,
        this.url,
      );
    }
    const m = this.meta;
    if (size !== null && m.size !== null && size !== m.size) {
      cancelBody(res);
      await this.restart(
        'size',
        `the file on the server is now ${size} bytes, the saved parts are of ${m.size}`,
      );
    }
    if (validator && m.validator && validator !== m.validator && this.trustValidator) {
      if (this.validatorRestarts++ < 1) {
        cancelBody(res);
        await this.restart(
          'validator',
          `the file on the server changed (${m.validator} -> ${validator})`,
        );
      }
      // a second change within one call: the CDN's servers disagree on the ETag; rely on the size from here on
      this.trustValidator = false;
    }
    const next: DownloadMeta = {
      ...m,
      size: size ?? m.size,
      validator: m.validator ?? validator ?? null,
      type: m.type ?? res.headers.get('content-type'),
    };
    if (next.size !== m.size || next.validator !== m.validator || next.type !== m.type) {
      this.meta = next;
      if (this.saved.size && this.persist) await this.o.store.saveMeta(next).catch(() => undefined);
    }
  }

  private async read(
    res: Response,
    from: number,
    last: number | null,
    signal: AbortSignal,
    watchdog: Watchdog,
  ): Promise<void> {
    let at = from;
    const reader = res.body?.getReader();
    if (!reader) {
      // no streaming body (very old browsers): the whole answer at once
      const all = new Uint8Array(await abortable(res.arrayBuffer(), signal));
      await this.absorb(at, all, watchdog);
      at += all.length;
    } else {
      const unblock = () => void reader.cancel().catch(noop);
      signal.addEventListener('abort', unblock, { once: true });
      try {
        for (;;) {
          const { done, value } = await abortable(reader.read(), signal);
          if (done) break;
          watchdog.feed();
          if (value.length && this.note) this.note = undefined; // data flows again: drop "Reconnecting…"
          await this.absorb(at, value, watchdog);
          at += value.length;
          this.report(false);
        }
      } catch (e) {
        unblock();
        throw e;
      } finally {
        signal.removeEventListener('abort', unblock);
      }
    }
    if (signal.aborted) throw new AttemptError('aborted', 'network');
    await this.endOfBody(at, last);
  }

  /** The body ended without an error: did it bring all it should have? */
  private async endOfBody(at: number, last: number | null): Promise<void> {
    if (last !== null) {
      if (at < last + 1)
        throw new AttemptError(`the connection closed at byte ${at} of ${last + 1}`, 'network');
      return; // a 206 shorter than the rest of the file (a server may cap a range): the loop asks for the rest
    }
    const size = this.meta.size;
    if (size === null) {
      // no Content-Range and no pinned size: the end of the body is the end of the file
      if (this.cur?.length) {
        this.meta = { ...this.meta, size: at };
        await this.savePart(); // saves the size with the last part
      } else await this.setSize(at);
      return;
    }
    if (at < size)
      throw new AttemptError(`the connection closed at byte ${at} of ${size}`, 'network');
  }

  /** Takes body bytes at file offset `at`: appends what is new to the part being filled and saves full parts. */
  private async absorb(at: number, bytes: Uint8Array, watchdog: Watchdog): Promise<void> {
    const C = this.meta.chunkBytes;
    let off = 0;
    while (off < bytes.length) {
      this.check(); // one read can span several parts: a cancel must not wait for all of them to be written
      const pos = at + off;
      const size = this.meta.size;
      if (size !== null && pos >= size) await this.overrun(size);
      const index = Math.floor(pos / C);
      const partStart = index * C;
      const partEnd = size === null ? partStart + C : Math.min(partStart + C, size);
      const take = Math.min(bytes.length - off, partEnd - pos);
      const piece = bytes.subarray(off, off + take);
      off += take;
      if (this.saved.has(index) || (this.cur && this.cur.index !== index)) continue;
      // bytes of this piece that the part already holds (a 200 sends the file from its start again)
      const skip = partStart + (this.cur?.length ?? 0) - pos;
      if (skip < 0 || skip >= take) continue;
      this.cur ??= { index, pieces: [], length: 0 };
      this.cur.pieces.push(skip ? piece.subarray(skip) : piece);
      this.cur.length += take - skip;
      if (this.cur.length === partEnd - partStart && (size !== null || this.cur.length === C))
        await this.savePart(watchdog);
    }
  }

  /** The size became known after the last part was saved: keep it with the parts (a reload must not ask past the end). */
  private async setSize(size: number): Promise<void> {
    this.meta = { ...this.meta, size };
    if (this.saved.size && this.persist) await this.o.store.saveMeta(this.meta).catch(noop);
  }

  private async overrun(size: number): Promise<never> {
    if (this.o.size !== undefined) {
      await this.drop();
      throw new DownloadError(
        'size',
        `the server sent more than the expected ${size} bytes`,
        this.url,
      );
    }
    return this.restart(
      'size',
      `the file on the server is longer than the ${size} bytes saved before`,
    );
  }

  private async savePart(watchdog?: Watchdog): Promise<void> {
    const { index, pieces } = this.cur!;
    this.cur = null;
    const blob = new Blob(pieces as BlobPart[]);
    this.meta = { ...this.meta, updated: this.o.now() };
    watchdog?.pause(); // a slow disk is not a stalled connection
    if (this.persist) {
      try {
        await this.o.store.save(this.meta, index, blob);
      } catch {
        this.persist = false; // full or unavailable: keep the rest of this file in memory (no resume after a reload)
      }
    }
    if (!this.persist) this.memory.set(index, blob);
    watchdog?.resume();
    this.saved.add(index);
    this.savedBytes += blob.size;
    this.report(true);
  }

  // ---------------------------------------------------------------------------------------------- the saved parts

  private async restore(): Promise<void> {
    const store = this.o.store;
    const pinned = this.o.size;
    let meta = await store.meta(this.url).catch(() => undefined);
    // unusable, or the parts of another version of a pinned file
    if (
      meta &&
      (!(meta.chunkBytes > 0) ||
        (pinned !== undefined && meta.size !== null && meta.size !== pinned))
    )
      meta = undefined;
    if (!meta) {
      await store.remove(this.url).catch(() => undefined); // parts without their meta cannot be trusted
      this.meta = this.freshMeta();
      return;
    }
    this.meta = { ...meta, size: meta.size ?? pinned ?? null };
    const C = this.meta.chunkBytes;
    for (const i of await store.parts(this.url).catch(() => [] as number[])) {
      if (this.meta.size === null || i * C < this.meta.size) this.saved.add(i);
    }
    this.savedBytes = this.resumedBytes = partsBytes([...this.saved], C, this.meta.size);
  }

  private freshMeta(): DownloadMeta {
    return {
      url: this.url,
      size: this.o.size ?? null,
      chunkBytes: this.o.chunkBytes,
      validator: null,
      type: null,
      updated: this.o.now(),
    };
  }

  private async restart(kind: 'size' | 'validator', why: string): Promise<never> {
    if (kind === 'size' && ++this.sizeRestarts > 2) {
      await this.drop();
      throw new DownloadError(
        'changed',
        `the file keeps changing on the server (${why})`,
        this.url,
      );
    }
    await this.drop();
    throw new Again(why);
  }

  private async drop(): Promise<void> {
    await this.o.store.remove(this.url).catch(() => undefined);
    this.saved.clear();
    this.memory.clear();
    this.savedBytes = this.resumedBytes = 0;
    this.continueUntil = 0;
    this.cur = null;
    this.meta = this.freshMeta();
  }

  /** The first byte still missing, or null when every part is saved. */
  private nextStart(): number | null {
    const { chunkBytes: C, size } = this.meta;
    let i = 0;
    while (this.saved.has(i)) i++;
    if (size !== null && i * C >= size) return null;
    if (this.cur && this.cur.index !== i) this.cur = null;
    return i * C + (this.cur?.length ?? 0);
  }

  /** Last byte to ask for: just before the next saved part, the end of the file, or open (size unknown). */
  private rangeEnd(start: number): number | null {
    const { chunkBytes: C, size } = this.meta;
    if (size === null) return null;
    for (let j = Math.floor(start / C) + 1; j * C < size; j++)
      if (this.saved.has(j)) return j * C - 1;
    return size - 1;
  }

  /** One Blob of all parts; null when a part went missing (evicted, or another tab finished and dropped them). */
  private async assemble(): Promise<Blob | null> {
    const { chunkBytes: C } = this.meta;
    const size = this.meta.size!;
    const parts: Blob[] = [];
    let missing = false;
    for (let i = 0; i * C < size; i++) {
      const part =
        this.memory.get(i) ?? (await this.o.store.part(this.url, i).catch(() => undefined));
      if (part && part.size === Math.min(C, size - i * C)) parts.push(part);
      else {
        this.saved.delete(i);
        missing = true;
      }
    }
    if (missing) {
      this.savedBytes = partsBytes([...this.saved], C, size);
      if (++this.refills > 2)
        throw new DownloadError(
          'storage',
          'saved parts keep disappearing from the browser storage',
          this.url,
        );
      return null;
    }
    const blob = new Blob(parts, { type: this.meta.type ?? '' });
    if (blob.size !== size)
      throw new DownloadError(
        'size',
        `the parts add up to ${blob.size} bytes, expected ${size}`,
        this.url,
      );
    return blob;
  }

  // ---------------------------------------------------------------------------------------------- waiting

  private async waitOnline(): Promise<void> {
    this.note = 'Waiting for the internet connection…';
    this.report(true);
    await this.o.network.waitOnline(this.signal);
    this.check();
    this.note = 'Reconnecting…';
    this.report(true);
  }

  private async backoff(failures: number, e: AttemptError): Promise<void> {
    const reason =
      e.reason === 'stall'
        ? 'The download stalled.'
        : e.reason === 'server'
          ? `The download server is busy (HTTP ${e.status}).`
          : 'Connection lost.';
    let left = Math.min(this.o.retryBaseMs * 2 ** (failures - 1), this.o.retryMaxMs);
    // a countdown in whole seconds; going offline ends it (the loop then waits for the connection)
    while (left > 0 && this.o.network.online()) {
      this.note = `${reason} Retrying in ${Math.ceil(left / 1000)} s…`;
      this.report(true);
      const step = Math.min(1000, left);
      await this.o.sleep(step, this.signal);
      left -= step;
    }
    this.check();
    this.note = 'Reconnecting…';
    this.report(true);
  }

  private check(): void {
    if (this.signal.aborted) throw new CancelledError();
  }

  private report(force: boolean): void {
    if (!this.o.onProgress) return;
    const now = this.o.now();
    const continuing = !this.note && now < this.continueUntil;
    const note = this.note ?? (continuing ? continuingNote(this.resumedBytes) : undefined);
    if (!force && note === this.lastNote && now - this.lastReport < this.o.progressMs) return;
    this.lastReport = now;
    this.lastNote = note;
    const loaded = this.loaded;
    const total = this.meta.size ?? Math.max(this.o.estimatedSize ?? 0, loaded);
    this.o.onProgress({
      loaded,
      total,
      resumedBytes: this.resumedBytes,
      ...(continuing ? { continuing } : {}),
      ...(note ? { note } : {}),
    });
  }
}

// ------------------------------------------------------------------------------------------------ helpers

function partsBytes(indices: number[], chunkBytes: number, size: number | null): number {
  let n = 0;
  for (const i of indices)
    n += size === null ? chunkBytes : Math.max(0, Math.min(chunkBytes, size - i * chunkBytes));
  return n;
}

/** `bytes 0-8388607/92234567` (size null for `/*`). */
export function parseContentRange(
  raw: string | null,
): { start: number; end: number; size: number | null } | null {
  const m = raw ? /^\s*bytes\s+(\d+)-(\d+)\/(\d+|\*)\s*$/i.exec(raw) : null;
  if (!m) return null;
  const start = Number(m[1]);
  const end = Number(m[2]);
  const size = m[3] === '*' ? null : Number(m[3]);
  if (end < start || (size !== null && end >= size)) return null;
  return { start, end, size };
}

function cancelBody(res: Response): void {
  res.body?.cancel().catch(noop);
}

/** Rejects as soon as the signal fires, even if `p` never settles (a hung fetch or read). */
function abortable<T>(p: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) {
    p.catch(noop);
    return Promise.reject(new AttemptError('aborted', 'network'));
  }
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(new AttemptError('aborted', 'network'));
    signal.addEventListener('abort', onAbort, { once: true });
    p.then(
      (v) => {
        signal.removeEventListener('abort', onAbort);
        resolve(v);
      },
      (e) => {
        signal.removeEventListener('abort', onAbort);
        reject(e);
      },
    );
  });
}

function linkSignals(...signals: (AbortSignal | undefined)[]): {
  signal: AbortSignal;
  dispose(): void;
} {
  const ctl = new AbortController();
  const abort = () => ctl.abort();
  for (const s of signals) {
    if (s?.aborted) ctl.abort();
    s?.addEventListener('abort', abort, { once: true });
  }
  return {
    signal: ctl.signal,
    dispose: () => signals.forEach((s) => s?.removeEventListener('abort', abort)),
  };
}

/**
 * Fires when no byte arrived for `ms` (paused while a part is written). One interval, not a timer per read.
 *
 * A tick that comes more than `ms` after the previous one means the timer itself was not running: the phone froze the
 * tab in the background, the laptop slept, or a hidden tab's timers were held back for a minute. The bytes of that
 * time may be waiting in the network stack, unread, so that is not a dead connection: the window starts again instead
 * of aborting a download that is fine.
 */
export class Watchdog {
  fired = false;
  private last: number;
  private lastTick: number;
  private paused = false;
  private readonly timer: ReturnType<typeof setInterval>;

  constructor(
    ms: number,
    onStall: () => void,
    private readonly now: () => number = Date.now,
  ) {
    this.last = this.lastTick = now();
    this.timer = setInterval(
      () => {
        const t = this.now();
        const frozen = t - this.lastTick > ms;
        this.lastTick = t;
        if (frozen) {
          this.last = t;
          return;
        }
        if (this.paused || this.fired || t - this.last < ms) return;
        this.fired = true;
        onStall();
      },
      Math.max(5, Math.min(1000, ms / 4)),
    );
  }

  feed(): void {
    this.last = this.now();
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
    this.last = this.now();
  }

  stop(): void {
    clearInterval(this.timer);
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new CancelledError());
    const onAbort = () => {
      clearTimeout(timer);
      reject(new CancelledError());
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/** navigator.onLine and the 'online' event; also polled, as a worker may not get the event in every browser. */
export const browserNetwork: NetworkStatus = {
  online: () => (globalThis as { navigator?: { onLine?: boolean } }).navigator?.onLine !== false,
  waitOnline: (signal) =>
    new Promise<void>((resolve, reject) => {
      const target = globalThis as unknown as Partial<EventTarget>;
      const finish = (ok: boolean) => {
        clearInterval(poll);
        target.removeEventListener?.('online', onOnline);
        signal?.removeEventListener('abort', onAbort);
        if (ok) resolve();
        else reject(new CancelledError());
      };
      const onOnline = () => finish(true);
      const onAbort = () => finish(false);
      const poll = setInterval(() => browserNetwork.online() && finish(true), 5000);
      target.addEventListener?.('online', onOnline);
      signal?.addEventListener('abort', onAbort, { once: true });
      if (signal?.aborted) finish(false);
      else if (browserNetwork.online()) finish(true);
    }),
};

// ------------------------------------------------------------------------------------------------ stores

export class MemoryPartStore implements PartStore {
  private readonly files = new Map<string, { meta: DownloadMeta; parts: Map<number, Blob> }>();

  async meta(url: string): Promise<DownloadMeta | undefined> {
    const m = this.files.get(url)?.meta;
    return m ? { ...m } : undefined;
  }

  async parts(url: string): Promise<number[]> {
    return [...(this.files.get(url)?.parts.keys() ?? [])].sort((a, b) => a - b);
  }

  async part(url: string, index: number): Promise<Blob | undefined> {
    return this.files.get(url)?.parts.get(index);
  }

  async save(meta: DownloadMeta, index: number, data: Blob): Promise<void> {
    this.entry(meta).parts.set(index, data);
  }

  async saveMeta(meta: DownloadMeta): Promise<void> {
    this.entry(meta);
  }

  async remove(url: string): Promise<void> {
    this.files.delete(url);
  }

  async list(): Promise<DownloadMeta[]> {
    return [...this.files.values()].map((f) => ({ ...f.meta }));
  }

  async clear(): Promise<void> {
    this.files.clear();
  }

  private entry(meta: DownloadMeta) {
    const f = this.files.get(meta.url) ?? { meta, parts: new Map<number, Blob>() };
    f.meta = { ...meta };
    this.files.set(meta.url, f);
    return f;
  }
}

const META = 'meta';
const PARTS = 'parts';

/** Keys of the parts of one file: [url, index], so one key range covers them. */
const partsOf = (url: string) => IDBKeyRange.bound([url, 0], [url, Infinity]);

function finished(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
  });
}

/**
 * Database 'tv-downloads', version 1: 'meta' (key path 'url') and 'parts' (Blob values, out-of-line keys
 * [url, index]). Exercised by the real-browser check, not by the jsdom specs (no IndexedDB there).
 */
export class IndexedDbPartStore implements PartStore {
  private db: Promise<IDBDatabase> | null = null;

  constructor(
    private readonly factory: IDBFactory,
    private readonly name = PARTS_DB_NAME,
  ) {}

  async meta(url: string): Promise<DownloadMeta | undefined> {
    return (await this.request(META, (s) => s.get(url))) as DownloadMeta | undefined;
  }

  async parts(url: string): Promise<number[]> {
    const keys = (await this.request(PARTS, (s) => s.getAllKeys(partsOf(url)))) as [
      string,
      number,
    ][];
    return keys.map((k) => k[1]);
  }

  async part(url: string, index: number): Promise<Blob | undefined> {
    return (await this.request(PARTS, (s) => s.get([url, index]))) as Blob | undefined;
  }

  async save(meta: DownloadMeta, index: number, data: Blob): Promise<void> {
    await this.write((tx) => {
      tx.objectStore(META).put(meta);
      tx.objectStore(PARTS).put(data, [meta.url, index]);
    });
  }

  async saveMeta(meta: DownloadMeta): Promise<void> {
    await this.write((tx) => tx.objectStore(META).put(meta));
  }

  async remove(url: string): Promise<void> {
    await this.write((tx) => {
      tx.objectStore(META).delete(url);
      tx.objectStore(PARTS).delete(partsOf(url));
    });
  }

  async list(): Promise<DownloadMeta[]> {
    return (await this.request(META, (s) => s.getAll())) as DownloadMeta[];
  }

  async clear(): Promise<void> {
    await this.write((tx) => {
      tx.objectStore(META).clear();
      tx.objectStore(PARTS).clear();
    });
  }

  private async request(store: string, make: (s: IDBObjectStore) => IDBRequest): Promise<unknown> {
    const req = make((await this.transaction([store], 'readonly')).objectStore(store));
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  private async write(fill: (tx: IDBTransaction) => unknown): Promise<void> {
    const tx = await this.transaction([META, PARTS], 'readwrite');
    const end = finished(tx);
    fill(tx);
    await end;
  }

  /** A transaction; a connection the browser closed (Safari in the background, another tab's upgrade) is reopened once. */
  private async transaction(stores: string[], mode: IDBTransactionMode): Promise<IDBTransaction> {
    for (let attempt = 0; ; attempt++) {
      const db = await this.open();
      try {
        return db.transaction(stores, mode);
      } catch (e) {
        this.db = null;
        if (attempt) throw e;
      }
    }
  }

  private open(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    const opening = new Promise<IDBDatabase>((resolve, reject) => {
      const req = this.factory.open(this.name, PARTS_DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(META)) db.createObjectStore(META, { keyPath: 'url' });
        if (!db.objectStoreNames.contains(PARTS)) db.createObjectStore(PARTS);
      };
      req.onsuccess = () => {
        const db = req.result;
        // another tab upgrading or deleting the database: let it, reopen on the next call
        db.onversionchange = () => {
          db.close();
          this.db = null;
        };
        resolve(db);
      };
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('IndexedDB open blocked by another tab'));
    });
    this.db = opening;
    opening.catch(() => {
      if (this.db === opening) this.db = null; // try again on the next call
    });
    return opening;
  }
}

let shared: PartStore | null = null;

/** The page's (or worker's) store: IndexedDB, or memory where there is none. */
export function defaultPartStore(): PartStore {
  const factory = (globalThis as { indexedDB?: IDBFactory }).indexedDB;
  shared ??= factory ? new IndexedDbPartStore(factory) : new MemoryPartStore();
  return shared;
}
