/**
 * Download and caching of the pinned Qwen3-ASR files (qwen-catalog.ts). Transformers.js has no Qwen3-ASR model class,
 * so these files do not go through its loader: each one is fetched from its pinned URL with the resumable downloader
 * (resumable-download.ts: Range requests, parts saved in IndexedDB, so a dropped connection or a reload continues where
 * it stopped), then read back once to check its SHA-256 (sha256.ts) and fill the buffer the engine gets, refused on a
 * size or hash mismatch, and kept in the same Cache API bucket as the Whisper models ('transformers-cache', key = the
 * pinned URL), so "Delete my data now ... and the downloaded models" removes them too. A file that is already cached is
 * read back without a download (it was verified before it was stored).
 */
import { CancelledError, isCancelled, ProgressInfo } from '../asr/types';
import { QwenCatalogEntry, QwenFile, QwenFileRole, qwenFileUrl } from './qwen-catalog';
import {
  blobBytes,
  continuingNote,
  discardDownload,
  DownloadTuning,
  downloadResumable,
  FetchLike,
  PartStore,
} from './resumable-download';
import { Sha256 } from './sha256';

export type { FetchLike } from './resumable-download';

export interface QwenCacheLike {
  match(request: string): Promise<Response | undefined>;
  put?(request: string, response: Response): Promise<void>;
  delete(request: string): Promise<boolean>;
}

export type QwenFileSet = Record<QwenFileRole, Uint8Array>;

export class QwenDownloadError extends Error {
  constructor(
    message: string,
    readonly file: string,
  ) {
    super(message);
    this.name = 'QwenDownloadError';
  }
}

export interface QwenFetchOptions {
  cache: QwenCacheLike | null;
  fetch?: FetchLike;
  host?: string;
  signal?: AbortSignal;
  onProgress?: (p: ProgressInfo) => void;
  /** a file could not be stored (quota, private mode): it still loads, it is fetched again next time */
  onCacheError?: (file: string, e: unknown) => void;
  /** Where unfinished downloads keep their parts; default: IndexedDB 'tv-downloads'. */
  store?: PartStore;
  /** Retry, stall and part-size settings of the downloads (tests). */
  tuning?: DownloadTuning;
}

/** Slice read per step when checking a finished file: the file is never read in one piece. */
const READ_SLICE = 8 * 1024 * 1024;
const CHECKING_NOTE = 'Checking the downloaded file…';

/** Files of the entry that are not in the cache yet. */
export async function missingQwenFiles(entry: QwenCatalogEntry, cache: QwenCacheLike | null, host?: string): Promise<QwenFile[]> {
  if (!cache) return [...entry.files];
  const out: QwenFile[] = [];
  for (const f of entry.files) if (!(await cache.match(qwenFileUrl(f, host)))) out.push(f);
  return out;
}

/** Reads (cache) or downloads (verified, then cached) every file of the entry, in catalog order. */
export async function fetchQwenFiles(entry: QwenCatalogEntry, o: QwenFetchOptions): Promise<QwenFileSet> {
  const total = entry.bytes;
  let before = 0;
  const out: Partial<QwenFileSet> = {};
  const report = (status: ProgressInfo['status'], f: QwenFile, fileLoaded: number, note?: string) => {
    const loaded = before + fileLoaded;
    o.onProgress?.({
      status,
      file: f.name,
      loaded,
      total,
      progress: total ? (100 * loaded) / total : 0,
      fileLoaded,
      fileTotal: f.bytes,
      ...(note ? { note } : {}),
    });
  };
  for (const f of entry.files) {
    if (o.signal?.aborted) throw new CancelledError();
    const url = qwenFileUrl(f, o.host);
    let bytes: Uint8Array | null = null;
    const hit = o.cache ? await o.cache.match(url).catch(() => undefined) : undefined;
    if (hit) {
      const buf = new Uint8Array(await hit.arrayBuffer());
      if (buf.byteLength === f.bytes) bytes = buf;
      else await o.cache?.delete(url).catch(() => false); // a truncated entry: fetch it again
    }
    if (!bytes) {
      report('download', f, 0);
      const blob = await downloadFile(f, url, o, (n, note) => report('progress', f, n, note), before);
      report('progress', f, f.bytes, CHECKING_NOTE);
      try {
        bytes = await readVerified(blob, f, o.signal);
      } catch (e) {
        if (e instanceof QwenDownloadError) await discardDownload(url, o.store); // wrong bytes: never resume from them
        throw e;
      }
      if (o.cache?.put) {
        try {
          // from the Blob (the saved parts on disk), not from `bytes`: no second copy of the file in memory
          await o.cache.put(
            url,
            new Response(blob, {
              headers: { 'content-length': String(f.bytes), 'content-type': 'application/octet-stream' },
            }),
          );
        } catch (e) {
          o.onCacheError?.(f.name, e);
        }
      }
      await discardDownload(url, o.store);
    }
    report('done', f, f.bytes);
    before += f.bytes;
    out[f.role] = bytes;
  }
  o.onProgress?.({ status: 'ready', loaded: total, total, progress: 100 });
  return out as QwenFileSet;
}

/** One pinned file through the resumable downloader; `before` = bytes of the model already in hand (for the note). */
async function downloadFile(
  f: QwenFile,
  url: string,
  o: QwenFetchOptions,
  onBytes: (n: number, note?: string) => void,
  before: number,
): Promise<Blob> {
  try {
    return await downloadResumable(url, {
      ...o.tuning,
      size: f.bytes,
      signal: o.signal,
      store: o.store,
      fetchImpl: o.fetch,
      onProgress: (d) => onBytes(d.loaded, d.continuing ? continuingNote(before + d.resumedBytes) : d.note),
    });
  } catch (e) {
    if (isCancelled(e)) throw e;
    throw new QwenDownloadError(`${f.name}: ${(e as Error)?.message ?? e}`, f.name);
  }
}

/** Reads the finished file once, slice by slice: its SHA-256 and the bytes the engine gets, in one pass. */
async function readVerified(blob: Blob, f: QwenFile, signal?: AbortSignal): Promise<Uint8Array> {
  if (blob.size !== f.bytes) throw new QwenDownloadError(`${f.name}: ${blob.size} bytes, expected ${f.bytes}`, f.name);
  const out = new Uint8Array(f.bytes);
  const hash = new Sha256();
  for (let at = 0; at < f.bytes; at += READ_SLICE) {
    if (signal?.aborted) throw new CancelledError();
    const piece = await blobBytes(blob.slice(at, at + READ_SLICE));
    out.set(piece, at);
    hash.update(piece);
  }
  const digest = hash.digest();
  if (digest !== f.sha256) {
    throw new QwenDownloadError(`${f.name}: SHA-256 ${digest} does not match the pinned ${f.sha256}`, f.name);
  }
  return out;
}
