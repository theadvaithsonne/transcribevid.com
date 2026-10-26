/**
 * Model manager of the browser edition: which files a model needs on this device, whether they are in
 * the Cache API already, whether they fit the storage quota, how big the download is, loading with
 * per-file progress (Transformers.js's progress_callback, through the engine) and deleting a model.
 *
 * Transformers.js 4.3.1 stores every file in the Cache API bucket 'transformers-cache' under its
 * Hugging Face URL (`https://huggingface.co/<repo>/resolve/main/<file>`), and the ORT runtime under its
 * jsDelivr URL (spike asr.md Q8). The manager reads that bucket directly, so `isCached`, `delete` and
 * the quota check work on the page without importing the library.
 *
 * Its own download only resumes per file, so `ensure` fetches the missing files first with the resumable
 * downloader (resumable-download.ts: Range requests, 8 MiB parts saved in IndexedDB, retries, offline wait)
 * and puts each one into that bucket under the key Transformers.js looks up (hub.js buildResourcePaths:
 * remoteHost + '{model}/resolve/{revision}/' + file), with the content-length it reads for its progress and
 * file metadata (hub.js loadResourceFile, model_registry/get_file_metadata.js). The library then finds every
 * file in the cache and does not touch the network.
 */
import { Device, isCancelled, LoadInfo, LoadOptions, ProgressInfo } from '../asr/types';
import {
  CatalogEntry,
  catalogEntry,
  CONFIG_FILES,
  MODEL_CATALOG,
  ModelId,
  ModelVariant,
  reposOf,
  variantFiles,
} from './catalog';
import { fetchQwenFiles, FetchLike, missingQwenFiles, QwenCacheLike, QwenFileSet } from './qwen-files';
import { isQwenModel, QwenCatalogEntry, qwenEntry, qwenFileUrl, QWEN_CATALOG } from './qwen-catalog';
import {
  continuingNote,
  defaultPartStore,
  discardDownload,
  discardDownloads,
  DownloadTuning,
  downloadResumable,
  formatDownloadSize,
  PartStore,
  savedDownload,
} from './resumable-download';
import {
  chooseVariant,
  configureOrtRuntime,
  GpuFeatures,
  ORT_WASM_BYTES,
  ortWasmPaths,
  OrtRuntimeOptions,
  TransformersEnvLike,
} from './ort-config';

export const CACHE_NAME = 'transformers-cache';
export const HF_HOST = 'https://huggingface.co/';
/** Tokenizer + configs (tokenizer.json alone is 2.5 MB); used for the quota estimate only. */
export const CONFIG_BYTES_ESTIMATE = 4e6;

export type ModelErrorCode = 'unknown-model' | 'unsupported' | 'quota' | 'model-download';

export class ModelError extends Error {
  constructor(
    readonly code: ModelErrorCode,
    readonly userMessage: string,
    readonly technical: string,
  ) {
    super(userMessage);
    this.name = 'ModelError';
  }
}

type CacheKey = Request | { url: string } | string;

export interface CacheLike {
  match(request: string): Promise<Response | undefined>;
  keys(): Promise<ReadonlyArray<Request | { url: string }>>;
  delete(request: CacheKey): Promise<boolean>;
  /** The real Cache has it; without it `ensure` leaves the download to Transformers.js (not resumable). */
  put?(request: string, response: Response): Promise<void>;
}

export interface CacheStorageLike {
  open(name: string): Promise<CacheLike>;
}

export interface StorageEstimateLike {
  estimate(): Promise<{ usage?: number; quota?: number }>;
}

/** What ensure() loads with: WhisperEngine (its load() reports per-file progress) or a test double. */
export interface ModelLoader {
  load(options: LoadOptions, onProgress?: (p: ProgressInfo) => void): Promise<LoadInfo>;
}

export interface ModelManagerOptions {
  /** Default: globalThis.caches (null = no Cache API, e.g. an insecure context). */
  caches?: CacheStorageLike | null;
  /** Default: navigator.storage. */
  storage?: StorageEstimateLike | null;
  /** Transformers.js env for the ORT runtime settings; default: a lazy import of the library. */
  env?: () => Promise<TransformersEnvLike>;
  runtime?: OrtRuntimeOptions;
  cacheName?: string;
  host?: string;
  /** Default: globalThis.fetch (the resumable downloads). */
  fetch?: FetchLike;
  /** Where unfinished downloads keep their parts; default: IndexedDB 'tv-downloads' (memory without IndexedDB). */
  parts?: PartStore;
  /** Retry, stall and part-size settings of the resumable downloads (tests). */
  download?: DownloadTuning;
}

/** What ensureQwen() loads with: QwenEngine (engine/qwen) or a test double. */
export interface QwenModelLoader {
  load(files: QwenFileSet, entry: QwenCatalogEntry): Promise<unknown>;
}

export interface EnsureQwenOptions {
  gpu?: GpuFeatures;
  onProgress?: (p: ProgressInfo) => void;
  signal?: AbortSignal;
  ignoreQuota?: boolean;
  /** a file could not be kept in the cache (it still loads) */
  onCacheError?: (file: string, e: unknown) => void;
}

export interface EnsureQwenResult {
  entry: QwenCatalogEntry;
  wasCached: boolean;
  quota: QuotaCheck;
  info: unknown;
}

export interface ModelPlan {
  id: ModelId;
  label: string;
  device: Device;
  repo: string;
  dtype: { encoder_model: string; decoder_model_merged: string };
  /** Config files first, then the encoder and the decoder ONNX file. */
  files: string[];
  encoderBytes: number;
  decoderBytes: number;
  /** Download bytes of the two ONNX files. */
  bytes: number;
  wordTimestamps: boolean;
  measured: boolean;
  note?: string;
  loadOptions: LoadOptions;
}

export interface QuotaCheck {
  usage: number | null;
  quota: number | null;
  free: number | null;
  /** Bytes still to download into the cache (model files + runtime not cached yet). */
  needed: number;
  ok: boolean;
}

export interface EnsureOptions {
  gpu?: GpuFeatures;
  onProgress?: (p: ProgressInfo) => void;
  /** Load even when the files will not fit (they stream, but are fetched again next time). */
  ignoreQuota?: boolean;
  /** The job's cancel: stops the download at once (the saved parts stay for the next run). */
  signal?: AbortSignal;
  /** A downloaded file could not be kept in the cache (quota): Transformers.js fetches it itself instead. */
  onCacheError?: (file: string, e: unknown) => void;
}

export interface EnsureResult {
  plan: ModelPlan;
  info: LoadInfo;
  /** Every file was in the Cache API before the load (no download). */
  wasCached: boolean;
  quota: QuotaCheck;
}

export interface DeleteResult {
  entries: number;
  bytes: number;
}

function defaultCaches(): CacheStorageLike | null {
  return (globalThis as { caches?: CacheStorageLike }).caches ?? null;
}

function defaultStorage(): StorageEstimateLike | null {
  const nav = (globalThis as { navigator?: { storage?: StorageEstimateLike } }).navigator;
  return nav?.storage?.estimate ? nav.storage : null;
}

async function defaultEnv(): Promise<TransformersEnvLike> {
  const T = await import('@huggingface/transformers');
  return T.env as unknown as TransformersEnvLike;
}

const urlOf = (k: CacheKey) => (typeof k === 'string' ? k : k.url);

export { formatDownloadSize };

type PuttableCache = CacheLike & Required<Pick<CacheLike, 'put'>>;

/**
 * The engine's load progress after `ensure` fetched the files itself: the engine then only reads them back from the
 * cache, so the bar stays full instead of running from 0 again; a file outside `inCache` (one the cache refused, or
 * one the plan does not list) is a real download by the engine and extends the bar.
 */
function afterPrefetch(inCache: string[], bytes: number, onProgress?: (p: ProgressInfo) => void) {
  if (!onProgress) return undefined;
  const known = new Set(inCache);
  const extra = new Map<string, { loaded: number; total: number }>();
  return (p: ProgressInfo) => {
    if (p.file && !known.has(p.file)) extra.set(p.file, { loaded: p.fileLoaded ?? 0, total: p.fileTotal ?? 0 });
    let loaded = bytes;
    let total = bytes;
    for (const e of extra.values()) {
      loaded += e.loaded;
      total += Math.max(e.total, e.loaded);
    }
    if (p.status === 'ready') loaded = total;
    onProgress({ ...p, loaded, total, progress: total ? (100 * loaded) / total : 100 });
  };
}

export class ModelManager {
  private readonly caches: CacheStorageLike | null;
  private readonly storage: StorageEstimateLike | null;
  private readonly env: () => Promise<TransformersEnvLike>;
  private readonly cacheName: string;
  private readonly host: string;
  private readonly parts: PartStore;
  private runtimeConfigured = false;

  constructor(private readonly options: ModelManagerOptions = {}) {
    this.caches = options.caches === undefined ? defaultCaches() : options.caches;
    this.storage = options.storage === undefined ? defaultStorage() : options.storage;
    this.env = options.env ?? defaultEnv;
    this.cacheName = options.cacheName ?? CACHE_NAME;
    this.host = options.host ?? HF_HOST;
    this.parts = options.parts ?? defaultPartStore();
  }

  fileUrl(repo: string, file: string): string {
    return `${this.host}${repo}/resolve/main/${file}`;
  }

  /** The repo, dtype, files and size of a model on a device. Throws ModelError. */
  plan(id: string, device: Device, gpu?: GpuFeatures): ModelPlan {
    const entry = this.entry(id);
    let v: ModelVariant;
    try {
      v = chooseVariant(entry, device, gpu);
    } catch (e) {
      const technical = `${id} on ${device}, shader-f16 ${gpu?.shaderF16 ?? true}`;
      throw new ModelError('unsupported', (e as Error).message, technical);
    }
    return {
      id: entry.id,
      label: entry.label,
      device,
      repo: v.repo,
      dtype: { ...v.dtype },
      files: variantFiles(v),
      encoderBytes: v.encoderBytes,
      decoderBytes: v.decoderBytes,
      bytes: v.bytes,
      wordTimestamps: entry.wordTimestamps,
      measured: v.measured,
      ...(v.note ? { note: v.note } : {}),
      loadOptions: { repo: v.repo, device, dtype: { ...v.dtype } },
    };
  }

  sizeText(id: string, device: Device, gpu?: GpuFeatures): string {
    return formatDownloadSize(this.plan(id, device, gpu).bytes);
  }

  /** Files of the plan that are not in the Cache API (all of them when there is no Cache API). */
  async missingFiles(plan: ModelPlan): Promise<string[]> {
    const cache = await this.openCache();
    if (!cache) return [...plan.files];
    const missing: string[] = [];
    for (const f of plan.files) {
      if (!(await cache.match(this.fileUrl(plan.repo, f)))) missing.push(f);
    }
    return missing;
  }

  async isCached(id: string, device: Device, gpu?: GpuFeatures): Promise<boolean> {
    if (!this.caches) return false;
    if (isQwenModel(id)) return (await missingQwenFiles(this.qwen(id), await this.openCache(), this.host)).length === 0;
    return (await this.missingFiles(this.plan(id, device, gpu))).length === 0;
  }

  /** Is the ORT runtime (.wasm) of the configured build in the cache? */
  async runtimeCached(): Promise<boolean> {
    const cache = await this.openCache();
    if (!cache) return false;
    const { wasm } = ortWasmPaths(this.options.runtime?.build, this.options.runtime?.base);
    return !!(await cache.match(wasm));
  }

  /** navigator.storage.estimate() against what the missing files still add. Unknown quota counts as ok. */
  async checkQuota(plan: ModelPlan): Promise<QuotaCheck> {
    const cache = await this.openCache();
    const missing = new Set(await this.missingFiles(plan));
    const [encoderFile, decoderFile] = plan.files.slice(CONFIG_FILES.length);
    const onnx = [
      { file: encoderFile, bytes: plan.encoderBytes },
      { file: decoderFile, bytes: plan.decoderBytes },
    ].filter((f) => missing.has(f.file));
    const resumable = !!cache?.put; // ensure() fetches them itself (else Transformers.js streams them)
    let needed = await this.storageNeeded(
      onnx.map((f) => ({ url: this.fileUrl(plan.repo, f.file), bytes: f.bytes })),
      resumable,
      resumable,
    );
    if (CONFIG_FILES.some((f) => missing.has(f))) needed += CONFIG_BYTES_ESTIMATE;
    if (!(await this.runtimeCached())) {
      needed += ORT_WASM_BYTES[this.options.runtime?.build ?? 'asyncify'];
    }
    return this.quotaFor(needed);
  }

  /**
   * Makes the model ready: configures the ORT runtime (once), checks the quota, downloads the missing
   * files with the resumable downloader into the cache (per-file progress, notes while it waits or
   * retries), then loads through `loader` (the engine), which reads them from the cache and creates the
   * sessions. Errors: ModelError 'quota' / 'model-download' / 'unsupported'; a cancel passes through.
   */
  async ensure(
    id: string,
    device: Device,
    loader: ModelLoader,
    o: EnsureOptions = {},
  ): Promise<EnsureResult> {
    const plan = this.plan(id, device, o.gpu);
    await this.configureRuntime();
    const quota = await this.checkQuota(plan);
    if (!quota.ok && !o.ignoreQuota) {
      throw new ModelError(
        'quota',
        `Not enough browser storage for the ${plan.label} model (${formatDownloadSize(quota.needed)} ` +
          'needed). Free some space or pick a smaller model.',
        `needed ${quota.needed} free ${quota.free} quota ${quota.quota} usage ${quota.usage}`,
      );
    }
    const missing = await this.missingFiles(plan);
    const wasCached = this.caches ? missing.length === 0 : false;
    const cache = await this.openCache();
    let onLoadProgress = o.onProgress;
    // files that will not fit are left to Transformers.js, which streams them without keeping them (ignoreQuota)
    if (cache?.put && missing.length && quota.ok) {
      try {
        const got = await this.prefetch(plan, missing, cache as PuttableCache, o);
        onLoadProgress = afterPrefetch(got.inCache, got.bytes, o.onProgress);
      } catch (e) {
        if (isCancelled(e)) throw e;
        const err = e as Error;
        throw new ModelError(
          'model-download',
          `The ${plan.label} model could not be downloaded. Check the connection and try again; what ` +
            'was downloaded so far is kept.',
          `${err?.name}: ${err?.message ?? String(e)}`,
        );
      }
    }
    try {
      const info = await loader.load(plan.loadOptions, onLoadProgress);
      return { plan, info, wasCached, quota };
    } catch (e) {
      if (isCancelled(e)) throw e;
      const err = e as Error;
      throw new ModelError(
        'model-download',
        `The ${plan.label} model could not be loaded. Check the connection and try again; files ` +
          'that finished downloading are kept.',
        `${err?.name}: ${err?.message ?? String(e)}`,
      );
    }
  }

  /**
   * Downloads a model's files into the cache without loading it: the page's background download, so the first
   * transcription does not wait for it. Resumable like `ensure` (a job that starts meanwhile continues from the saved
   * parts). Does nothing when everything is cached, there is no Cache API, or the files would not fit.
   */
  async download(id: string, device: Device, o: EnsureOptions = {}): Promise<{ downloaded: boolean; bytes: number }> {
    const plan = this.plan(id, device, o.gpu);
    const missing = await this.missingFiles(plan);
    if (!missing.length) return { downloaded: false, bytes: 0 };
    const cache = await this.openCache();
    if (!cache?.put) return { downloaded: false, bytes: 0 };
    if (!(await this.checkQuota(plan)).ok) return { downloaded: false, bytes: 0 };
    const got = await this.prefetch(plan, missing, cache as PuttableCache, o);
    return { downloaded: true, bytes: got.bytes };
  }

  /**
   * Downloads the missing files of the plan (resumable, in plan order: configs, encoder, decoder) and puts each into
   * the cache under the key Transformers.js looks up. Progress is one bar over every file of the plan (cached ones
   * count as loaded); a size the catalog only rounds is the estimate until the server says. Returns the files now in
   * the cache and their bytes. A file the cache refuses is skipped (the engine fetches it itself).
   */
  private async prefetch(
    plan: ModelPlan,
    missing: string[],
    cache: PuttableCache,
    o: EnsureOptions,
  ): Promise<{ inCache: string[]; bytes: number }> {
    const sizes = new Map<string, number>();
    const inCache: string[] = [];
    for (const f of plan.files) {
      if (missing.includes(f)) {
        sizes.set(f, this.estimate(plan, f));
        continue;
      }
      const hit = await cache.match(this.fileUrl(plan.repo, f)).catch(() => undefined);
      sizes.set(f, Number(hit?.headers.get('content-length')) || this.estimate(plan, f));
      inCache.push(f);
    }
    let done = inCache.reduce((n, f) => n + sizes.get(f)!, 0);
    const emit = (status: ProgressInfo['status'], file: string, fileLoaded: number, note?: string) => {
      if (!o.onProgress) return;
      let total = 0;
      for (const n of sizes.values()) total += n;
      const loaded = done + fileLoaded;
      o.onProgress({
        status,
        file,
        loaded,
        total,
        progress: total ? (100 * loaded) / total : 0,
        fileLoaded,
        fileTotal: sizes.get(file),
        ...(note ? { note } : {}),
      });
    };
    for (const f of missing) {
      const url = this.fileUrl(plan.repo, f);
      emit('download', f, 0);
      const blob = await downloadResumable(url, {
        ...this.options.download,
        estimatedSize: sizes.get(f),
        signal: o.signal,
        store: this.parts,
        fetchImpl: this.options.fetch,
        onProgress: (d) => {
          if (d.total) sizes.set(f, d.total);
          emit('progress', f, d.loaded, d.continuing ? continuingNote(done + d.resumedBytes) : d.note);
        },
      });
      sizes.set(f, blob.size);
      try {
        await cache.put(
          url,
          new Response(blob, {
            headers: {
              'content-type': blob.type || (f.endsWith('.json') ? 'application/json' : 'application/octet-stream'),
              'content-length': String(blob.size),
            },
          }),
        );
        inCache.push(f);
      } catch (e) {
        o.onCacheError?.(f, e);
      }
      // the cache holds the file now (or refused it, and then the space is better freed for the engine's own copy)
      await discardDownload(url, this.parts);
      emit('done', f, blob.size);
      done += blob.size;
    }
    return { inCache, bytes: inCache.reduce((n, f) => n + sizes.get(f)!, 0) };
  }

  /** Bytes of a file until the server says: the catalog's (rounded) ONNX sizes, an even share of the config estimate. */
  private estimate(plan: ModelPlan, file: string): number {
    const [encoderFile, decoderFile] = plan.files.slice(CONFIG_FILES.length);
    if (file === encoderFile) return plan.encoderBytes;
    if (file === decoderFile) return plan.decoderBytes;
    return Math.round(CONFIG_BYTES_ESTIMATE / CONFIG_FILES.length);
  }

  /**
   * Storage the missing files still add: what is left to download (saved parts already count in the usage), plus,
   * with `peak`, the largest file once more, since its parts and its Cache API copy exist side by side until the
   * parts are dropped.
   */
  private async storageNeeded(files: { url: string; bytes: number }[], resumable: boolean, peak: boolean): Promise<number> {
    let needed = 0;
    let largest = 0;
    for (const f of files) {
      const saved = resumable ? (await savedDownload(f.url, this.parts)).savedBytes : 0;
      needed += Math.max(0, f.bytes - saved);
      largest = Math.max(largest, f.bytes);
    }
    return needed + (peak ? largest : 0);
  }

  /**
   * Qwen3-ASR: checks the adapter (`shader-f16`) and the quota, reads the pinned files from the cache or downloads and
   * verifies them (qwen-files.ts) with whole-model byte progress, then hands them to `loader` (QwenEngine.load).
   * Errors: ModelError 'unsupported' / 'quota' / 'model-download'; a cancel passes through.
   */
  async ensureQwen(id: string, loader: QwenModelLoader, o: EnsureQwenOptions = {}): Promise<EnsureQwenResult> {
    const entry = this.qwen(id);
    if (o.gpu && !o.gpu.shaderF16) {
      throw new ModelError(
        'unsupported',
        `${entry.label} needs 16-bit shader support (shader-f16) in the graphics driver.`,
        `${id} without shader-f16`,
      );
    }
    // the real Cache has put(); qwen-files stores the downloads itself (Transformers.js does that for Whisper)
    const cache = (await this.openCache()) as QwenCacheLike | null;
    const missing = await missingQwenFiles(entry, cache, this.host);
    const quota = await this.quotaFor(
      await this.storageNeeded(
        missing.map((f) => ({ url: qwenFileUrl(f, this.host), bytes: f.bytes })),
        true,
        !!cache?.put,
      ),
    );
    if (!quota.ok && !o.ignoreQuota) {
      throw new ModelError(
        'quota',
        `Not enough browser storage for the ${entry.label} model (${formatDownloadSize(quota.needed)} ` +
          'needed). Free some space or pick a smaller model.',
        `needed ${quota.needed} free ${quota.free} quota ${quota.quota} usage ${quota.usage}`,
      );
    }
    let files: QwenFileSet;
    try {
      files = await fetchQwenFiles(entry, {
        cache,
        fetch: this.options.fetch,
        host: this.host,
        signal: o.signal,
        onProgress: o.onProgress,
        onCacheError: o.onCacheError,
        store: this.parts,
        tuning: this.options.download,
      });
    } catch (e) {
      if (isCancelled(e)) throw e;
      const err = e as Error;
      throw new ModelError(
        'model-download',
        `The ${entry.label} model could not be downloaded. Check the connection and try again; what ` +
          'was downloaded so far is kept.',
        `${err?.name}: ${err?.message ?? String(e)}`,
      );
    }
    try {
      const info = await loader.load(files, entry);
      return { entry, wasCached: missing.length === 0, quota, info };
    } catch (e) {
      if (isCancelled(e)) throw e;
      const err = e as Error;
      throw new ModelError(
        'model-download',
        `The ${entry.label} model could not be started on this graphics device. Try again, or pick a Whisper model.`,
        `${err?.name}: ${err?.message ?? String(e)}`,
      );
    }
  }

  /** Download size of a Qwen model, as the UI shows it. */
  qwenSizeText(id: string): string {
    return formatDownloadSize(this.qwen(id).bytes);
  }

  /**
   * Removes every cached file of the model (all of its repos) and the saved parts of its unfinished downloads (`bytes`
   * counts both); the ORT runtime stays.
   */
  async delete(id: string): Promise<DeleteResult> {
    if (isQwenModel(id)) return this.deleteQwen(this.qwen(id));
    const entry = this.entry(id);
    const prefixes = reposOf(entry).map((r) => `${this.host}${r}/resolve/`);
    const partBytes = await discardDownloads((url) => prefixes.some((p) => url.startsWith(p)), this.parts);
    const cache = await this.openCache();
    if (!cache) return { entries: 0, bytes: partBytes };
    let entries = 0;
    let bytes = partBytes;
    for (const key of await cache.keys()) {
      const url = urlOf(key);
      if (!prefixes.some((p) => url.startsWith(p))) continue;
      const res = await cache.match(url);
      bytes += Number(res?.headers.get('content-length') ?? 0) || 0;
      if (await cache.delete(key)) entries++;
    }
    return { entries, bytes };
  }

  /** Models with at least one file in the cache (for the "delete my data" page). */
  async cachedModels(): Promise<ModelId[]> {
    const cache = await this.openCache();
    if (!cache) return [];
    const urls = (await cache.keys()).map(urlOf);
    const has = (repo: string) => urls.some((u) => u.startsWith(`${this.host}${repo}/resolve/`));
    const whisper: string[] = MODEL_CATALOG.filter((m) => reposOf(m).some(has)).map((m) => m.id);
    const qwen = QWEN_CATALOG.filter((m) => m.files.some((f) => urls.includes(qwenFileUrl(f, this.host)))).map((m) => m.id);
    return [...whisper, ...qwen] as ModelId[];
  }

  /** Exact URLs only: the fused-decoder repo is shared by both Qwen sizes. */
  private async deleteQwen(entry: QwenCatalogEntry): Promise<DeleteResult> {
    const urls = new Set(entry.files.map((f) => qwenFileUrl(f, this.host)));
    const partBytes = await discardDownloads((url) => urls.has(url), this.parts);
    const cache = await this.openCache();
    if (!cache) return { entries: 0, bytes: partBytes };
    let entries = 0;
    let bytes = partBytes;
    for (const f of entry.files) {
      const url = qwenFileUrl(f, this.host);
      if (!(await cache.match(url))) continue;
      if (await cache.delete(url)) {
        entries++;
        bytes += f.bytes;
      }
    }
    return { entries, bytes };
  }

  private qwen(id: string): QwenCatalogEntry {
    const entry = qwenEntry(id);
    if (!entry) throw new ModelError('unknown-model', `Unknown model "${id}".`, `id ${id}`);
    return entry;
  }

  /** The storage estimate against `bytes` still to download. Unknown quota counts as ok. */
  private async quotaFor(needed: number): Promise<QuotaCheck> {
    let usage: number | null = null;
    let quota: number | null = null;
    try {
      const est = await this.storage?.estimate();
      usage = est?.usage ?? null;
      quota = est?.quota ?? null;
    } catch {
      // unknown quota
    }
    const free = quota === null ? null : Math.max(0, quota - (usage ?? 0));
    return { usage, quota, free, needed, ok: free === null || needed <= free };
  }

  private async configureRuntime(): Promise<void> {
    if (this.runtimeConfigured) return;
    configureOrtRuntime(await this.env(), this.options.runtime);
    this.runtimeConfigured = true;
  }

  private entry(id: string): CatalogEntry {
    const entry = catalogEntry(id);
    if (!entry) throw new ModelError('unknown-model', `Unknown model "${id}".`, `id ${id}`);
    return entry;
  }

  private async openCache(): Promise<CacheLike | null> {
    if (!this.caches) return null;
    try {
      return await this.caches.open(this.cacheName);
    } catch {
      return null;
    }
  }
}
