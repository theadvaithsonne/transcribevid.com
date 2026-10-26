/**
 * Model manager of the browser edition: which files a model needs on this device, whether they are in
 * the Cache API already, whether they fit the storage quota, how big the download is, loading with
 * per-file progress (Transformers.js's progress_callback, through the engine) and deleting a model.
 *
 * Transformers.js 4.3.1 stores every file in the Cache API bucket 'transformers-cache' under its
 * Hugging Face URL (`https://huggingface.co/<repo>/resolve/main/<file>`), and the ORT runtime under its
 * jsDelivr URL (spike asr.md Q8). The manager reads that bucket directly, so `isCached`, `delete` and
 * the quota check work on the page without importing the library.
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
  /** Default: globalThis.fetch (the Qwen downloads). */
  fetch?: FetchLike;
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

/** Download size as the UI shows it: decimal MB below 1 GB ('41 MB'), else GB ('1.8 GB'). */
export function formatDownloadSize(bytes: number): string {
  const mb = bytes / 1e6;
  if (mb < 1) return '1 MB';
  if (mb < 999.5) return `${Math.round(mb)} MB`;
  return `${(mb / 1000).toFixed(1)} GB`;
}

export class ModelManager {
  private readonly caches: CacheStorageLike | null;
  private readonly storage: StorageEstimateLike | null;
  private readonly env: () => Promise<TransformersEnvLike>;
  private readonly cacheName: string;
  private readonly host: string;
  private runtimeConfigured = false;

  constructor(private readonly options: ModelManagerOptions = {}) {
    this.caches = options.caches === undefined ? defaultCaches() : options.caches;
    this.storage = options.storage === undefined ? defaultStorage() : options.storage;
    this.env = options.env ?? defaultEnv;
    this.cacheName = options.cacheName ?? CACHE_NAME;
    this.host = options.host ?? HF_HOST;
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

  /** navigator.storage.estimate() against what is still to download. Unknown quota counts as ok. */
  async checkQuota(plan: ModelPlan): Promise<QuotaCheck> {
    const missing = new Set(await this.missingFiles(plan));
    const [encoderFile, decoderFile] = plan.files.slice(CONFIG_FILES.length);
    let needed = 0;
    if (missing.has(encoderFile)) needed += plan.encoderBytes;
    if (missing.has(decoderFile)) needed += plan.decoderBytes;
    if (CONFIG_FILES.some((f) => missing.has(f))) needed += CONFIG_BYTES_ESTIMATE;
    if (!(await this.runtimeCached())) {
      needed += ORT_WASM_BYTES[this.options.runtime?.build ?? 'asyncify'];
    }
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

  /**
   * Makes the model ready: configures the ORT runtime (once), checks the quota, then loads through
   * `loader` (the engine), which downloads what is missing with per-file progress and creates the
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
    const wasCached = this.caches ? (await this.missingFiles(plan)).length === 0 : false;
    try {
      const info = await loader.load(plan.loadOptions, o.onProgress);
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
    const quota = await this.quotaFor(missing.reduce((n, f) => n + f.bytes, 0));
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
      });
    } catch (e) {
      if (isCancelled(e)) throw e;
      const err = e as Error;
      throw new ModelError(
        'model-download',
        `The ${entry.label} model could not be downloaded. Check the connection and try again; files ` +
          'that finished downloading are kept.',
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

  /** Removes every cached file of the model (all of its repos); the ORT runtime stays. */
  async delete(id: string): Promise<DeleteResult> {
    if (isQwenModel(id)) return this.deleteQwen(this.qwen(id));
    const entry = this.entry(id);
    const cache = await this.openCache();
    if (!cache) return { entries: 0, bytes: 0 };
    const prefixes = reposOf(entry).map((r) => `${this.host}${r}/resolve/`);
    let entries = 0;
    let bytes = 0;
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
    const cache = await this.openCache();
    if (!cache) return { entries: 0, bytes: 0 };
    let entries = 0;
    let bytes = 0;
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
