/**
 * Download and caching of the pinned Qwen3-ASR files (qwen-catalog.ts). Transformers.js has no Qwen3-ASR model class,
 * so these files do not go through its loader: each one is fetched from its pinned URL with byte progress, hashed while
 * it streams (sha256.ts), refused on a size or hash mismatch, and kept in the same Cache API bucket as the Whisper
 * models ('transformers-cache', key = the pinned URL), so "Delete my data now ... and the downloaded models" removes
 * them too. A file that is already cached is read back without a download (it was verified before it was stored).
 */
import { CancelledError, ProgressInfo } from '../asr/types';
import { QwenCatalogEntry, QwenFile, QwenFileRole, qwenFileUrl } from './qwen-catalog';
import { Sha256 } from './sha256';

export interface QwenCacheLike {
  match(request: string): Promise<Response | undefined>;
  put?(request: string, response: Response): Promise<void>;
  delete(request: string): Promise<boolean>;
}

export type FetchLike = (url: string, init?: { signal?: AbortSignal }) => Promise<Response>;

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
}

/** Files of the entry that are not in the cache yet. */
export async function missingQwenFiles(entry: QwenCatalogEntry, cache: QwenCacheLike | null, host?: string): Promise<QwenFile[]> {
  if (!cache) return [...entry.files];
  const out: QwenFile[] = [];
  for (const f of entry.files) if (!(await cache.match(qwenFileUrl(f, host)))) out.push(f);
  return out;
}

/** Reads (cache) or downloads (verified, then cached) every file of the entry, in catalog order. */
export async function fetchQwenFiles(entry: QwenCatalogEntry, o: QwenFetchOptions): Promise<QwenFileSet> {
  const doFetch: FetchLike = o.fetch ?? ((url, init) => fetch(url, init));
  const total = entry.bytes;
  let before = 0;
  const out: Partial<QwenFileSet> = {};
  const report = (status: ProgressInfo['status'], f: QwenFile, fileLoaded: number) => {
    const loaded = before + fileLoaded;
    o.onProgress?.({
      status,
      file: f.name,
      loaded,
      total,
      progress: total ? (100 * loaded) / total : 0,
      fileLoaded,
      fileTotal: f.bytes,
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
      bytes = await downloadVerified(f, url, doFetch, o.signal, (n) => report('progress', f, n));
      if (o.cache?.put) {
        try {
          await o.cache.put(
            url,
            new Response(bytes as BlobPart, {
              headers: { 'content-length': String(bytes.byteLength), 'content-type': 'application/octet-stream' },
            }),
          );
        } catch (e) {
          o.onCacheError?.(f.name, e);
        }
      }
    }
    report('done', f, f.bytes);
    before += f.bytes;
    out[f.role] = bytes;
  }
  o.onProgress?.({ status: 'ready', loaded: total, total, progress: 100 });
  return out as QwenFileSet;
}

async function downloadVerified(
  f: QwenFile,
  url: string,
  doFetch: FetchLike,
  signal: AbortSignal | undefined,
  onBytes: (n: number) => void,
): Promise<Uint8Array> {
  let res: Response;
  try {
    res = await doFetch(url, { signal });
  } catch (e) {
    if (signal?.aborted) throw new CancelledError();
    throw new QwenDownloadError(`${f.name}: ${(e as Error)?.message ?? e}`, f.name);
  }
  if (!res.ok) throw new QwenDownloadError(`${f.name}: HTTP ${res.status}`, f.name);
  const out = new Uint8Array(f.bytes);
  const hash = new Sha256();
  let n = 0;
  const reader = res.body?.getReader();
  if (!reader) {
    const all = new Uint8Array(await res.arrayBuffer());
    if (all.byteLength !== f.bytes) throw new QwenDownloadError(`${f.name}: ${all.byteLength} bytes, expected ${f.bytes}`, f.name);
    out.set(all);
    hash.update(all);
    n = all.byteLength;
    onBytes(n);
  } else {
    let lastReport = 0;
    try {
      for (;;) {
        if (signal?.aborted) throw new CancelledError();
        const { done, value } = await reader.read();
        if (done) break;
        if (n + value.byteLength > f.bytes) {
          throw new QwenDownloadError(`${f.name}: more than the expected ${f.bytes} bytes`, f.name);
        }
        out.set(value, n);
        hash.update(value);
        n += value.byteLength;
        if (n - lastReport >= 1 << 20 || n === f.bytes) {
          lastReport = n;
          onBytes(n);
        }
      }
    } catch (e) {
      reader.cancel().catch(() => undefined);
      if (signal?.aborted) throw new CancelledError();
      throw e instanceof QwenDownloadError || e instanceof CancelledError
        ? e
        : new QwenDownloadError(`${f.name}: ${(e as Error)?.message ?? e}`, f.name);
    }
  }
  if (n !== f.bytes) throw new QwenDownloadError(`${f.name}: ${n} bytes, expected ${f.bytes}`, f.name);
  const digest = hash.digest();
  if (digest !== f.sha256) {
    throw new QwenDownloadError(`${f.name}: SHA-256 ${digest} does not match the pinned ${f.sha256}`, f.name);
  }
  return out;
}
