import { CancelledError, LoadInfo, LoadOptions, ProgressInfo } from '../asr/types';
import {
  CacheLike,
  CacheStorageLike,
  CONFIG_BYTES_ESTIMATE,
  formatDownloadSize,
  ModelError,
  ModelLoader,
  ModelManager,
  StorageEstimateLike,
} from './model-manager';
import { ORT_WASM_BYTES, ortWasmPaths, TransformersEnvLike } from './ort-config';

/** In-memory stand-in for the Cache API bucket Transformers.js writes ('transformers-cache'). */
class FakeCache implements CacheLike {
  readonly entries = new Map<string, number>();
  put(url: string, bytes: number): void {
    this.entries.set(url, bytes);
  }
  async match(url: string): Promise<Response | undefined> {
    if (!this.entries.has(url)) return undefined;
    const size = String(this.entries.get(url));
    return { headers: new Map([['content-length', size]]) } as unknown as Response;
  }
  async keys(): Promise<Array<{ url: string }>> {
    return [...this.entries.keys()].map((url) => ({ url }));
  }
  async delete(k: Request | { url: string } | string): Promise<boolean> {
    return this.entries.delete(typeof k === 'string' ? k : k.url);
  }
}

class FakeCaches implements CacheStorageLike {
  readonly opened: string[] = [];
  constructor(readonly cache = new FakeCache()) {}
  async open(name: string): Promise<CacheLike> {
    this.opened.push(name);
    return this.cache;
  }
}

const HF = 'https://huggingface.co/';
const url = (repo: string, file: string) => `${HF}${repo}/resolve/main/${file}`;

function setup(estimate: { usage?: number; quota?: number } | null = { usage: 0, quota: 10e9 }) {
  const caches = new FakeCaches();
  const storage: StorageEstimateLike | null = estimate ? { estimate: async () => estimate } : null;
  const env: TransformersEnvLike = { backends: { onnx: {} } };
  let envCalls = 0;
  const manager = new ModelManager({
    caches,
    storage,
    env: async () => {
      envCalls++;
      return env;
    },
  });
  return { manager, caches, cache: caches.cache, env, envCalls: () => envCalls };
}

/** Loader double: "downloads" every file of the plan into the cache with per-file progress. */
function fakeLoader(cache: FakeCache, files: string[], fail?: Error) {
  const seen: LoadOptions[] = [];
  const loader: ModelLoader = {
    async load(o: LoadOptions, onProgress?: (p: ProgressInfo) => void): Promise<LoadInfo> {
      seen.push(o);
      if (fail) throw fail;
      let loaded = 0;
      for (const f of files) {
        loaded += 10;
        cache.put(url(o.repo, f), 10);
        onProgress?.({ status: 'done', file: f, loaded, total: files.length * 10, progress: 0 });
      }
      onProgress?.({ status: 'ready', loaded, total: loaded, progress: 100 });
      const ms = { total: 1, filesAndTokenizer: 0, sessions: 1 };
      return {
        repo: o.repo,
        device: o.device,
        ms,
        hasCrossAttentions: true,
        alignmentHeads: 6,
        multilingual: true,
        files,
      };
    },
  };
  return { loader, seen };
}

describe('ModelManager.plan / sizeText', () => {
  it('resolves repo, dtype, files and size of a model on a device', () => {
    const { manager } = setup();
    const p = manager.plan('tiny', 'wasm');
    expect(p.repo).toBe('onnx-community/whisper-tiny_timestamped');
    expect(p.dtype).toEqual({ encoder_model: 'q8', decoder_model_merged: 'q8' });
    expect(p.files.length).toBe(7);
    expect(p.bytes).toBe(40.8e6);
    expect(p.wordTimestamps).toBe(true);
    expect(p.loadOptions).toEqual({ repo: p.repo, device: 'wasm', dtype: p.dtype });
    expect(manager.plan('base', 'webgpu', { shaderF16: false }).dtype.encoder_model).toBe('fp32');
    expect(manager.plan('large-v3', 'webgpu').wordTimestamps).toBe(false);
  });

  it('throws ModelError with a code for unknown and unsupported models', () => {
    const { manager } = setup();
    const err = (f: () => unknown) => {
      try {
        f();
      } catch (e) {
        return e as ModelError;
      }
      throw new Error('no error');
    };
    expect(err(() => manager.plan('huge', 'wasm')).code).toBe('unknown-model');
    const e = err(() => manager.plan('medium', 'webgpu', { shaderF16: false }));
    expect(e).toBeInstanceOf(ModelError);
    expect(e.code).toBe('unsupported');
    expect(e.userMessage).toMatch(/Medium/);
  });

  it('shows download sizes in decimal MB, GB from 1000 MB', () => {
    const { manager } = setup();
    expect(manager.sizeText('tiny', 'wasm')).toBe('41 MB');
    expect(manager.sizeText('tiny', 'webgpu')).toBe('76 MB');
    expect(manager.sizeText('base', 'webgpu', { shaderF16: false })).toBe('206 MB');
    expect(manager.sizeText('large-v3', 'webgpu')).toBe('980 MB');
    expect(manager.sizeText('large-v3', 'wasm')).toBe('1.8 GB');
    expect(formatDownloadSize(0.4e6)).toBe('1 MB');
    expect(formatDownloadSize(999.6e6)).toBe('1.0 GB');
  });
});

describe('ModelManager.isCached / missingFiles', () => {
  it('is false until every file of the plan is in the cache bucket', async () => {
    const { manager, cache, caches } = setup();
    const p = manager.plan('tiny', 'wasm');
    expect(await manager.isCached('tiny', 'wasm')).toBe(false);
    for (const f of p.files) cache.put(url(p.repo, f), 1);
    expect(await manager.isCached('tiny', 'wasm')).toBe(true);
    expect(caches.opened.every((n) => n === 'transformers-cache')).toBe(true);
    // the WebGPU files are other files
    expect(await manager.isCached('tiny', 'webgpu')).toBe(false);
    cache.entries.delete(url(p.repo, 'onnx/decoder_model_merged_quantized.onnx'));
    expect(await manager.missingFiles(p)).toEqual(['onnx/decoder_model_merged_quantized.onnx']);
  });

  it('is false without a Cache API (insecure context)', async () => {
    const manager = new ModelManager({ caches: null, storage: null });
    expect(await manager.isCached('tiny', 'wasm')).toBe(false);
    expect((await manager.missingFiles(manager.plan('tiny', 'wasm'))).length).toBe(7);
  });
});

describe('ModelManager.checkQuota', () => {
  it('counts the ONNX files, the configs and the ORT runtime that are not cached yet', async () => {
    const { manager, cache } = setup({ usage: 1e9, quota: 3e9 });
    const p = manager.plan('tiny', 'wasm');
    const q = await manager.checkQuota(p);
    expect(q.needed).toBe(
      p.encoderBytes + p.decoderBytes + CONFIG_BYTES_ESTIMATE + ORT_WASM_BYTES.asyncify,
    );
    expect(q).toEqual(expect.objectContaining({ usage: 1e9, quota: 3e9, free: 2e9, ok: true }));

    for (const f of p.files.slice(0, -1)) cache.put(url(p.repo, f), 1);
    cache.put(ortWasmPaths().wasm, 1);
    expect((await manager.checkQuota(p)).needed).toBe(p.decoderBytes);
  });

  it('is not ok when the free space is smaller than the download, ok when the quota is unknown', async () => {
    const small = setup({ usage: 9.9e9, quota: 10e9 });
    expect((await small.manager.checkQuota(small.manager.plan('base', 'webgpu'))).ok).toBe(false);
    const unknown = setup(null);
    const q = await unknown.manager.checkQuota(unknown.manager.plan('base', 'webgpu'));
    expect(q).toEqual(expect.objectContaining({ quota: null, free: null, ok: true }));
  });
});

describe('ModelManager.ensure', () => {
  it('configures the ORT runtime once, loads with per-file progress and reports the cache state', async () => {
    const { manager, cache, env, envCalls } = setup();
    const plan = manager.plan('tiny', 'wasm');
    const { loader, seen } = fakeLoader(cache, plan.files);
    const events: ProgressInfo[] = [];
    const first = await manager.ensure('tiny', 'wasm', loader, {
      onProgress: (p) => events.push(p),
    });
    expect(first.wasCached).toBe(false);
    expect(seen[0]).toEqual(plan.loadOptions);
    expect(events.length).toBe(8);
    expect(events.at(-1)!.status).toBe('ready');
    expect(env.backends.onnx.wasm).toEqual({ wasmPaths: ortWasmPaths(), numThreads: 1 });
    expect(await manager.isCached('tiny', 'wasm')).toBe(true);

    const second = await manager.ensure('tiny', 'wasm', loader);
    expect(second.wasCached).toBe(true);
    expect(envCalls()).toBe(1);
  });

  it('refuses a download that does not fit the quota unless told to ignore it', async () => {
    const { manager, cache } = setup({ usage: 9.95e9, quota: 10e9 });
    const { loader, seen } = fakeLoader(cache, manager.plan('base', 'webgpu').files);
    const err = await manager
      .ensure('base', 'webgpu', loader)
      .catch((e: unknown) => e as ModelError);
    expect(err).toBeInstanceOf(ModelError);
    expect((err as ModelError).code).toBe('quota');
    expect((err as ModelError).userMessage).toMatch(/Base model/);
    expect(seen.length).toBe(0);
    await manager.ensure('base', 'webgpu', loader, { ignoreQuota: true });
    expect(seen.length).toBe(1);
  });

  it('wraps a failed download as model-download and lets a cancel through', async () => {
    const { manager, cache } = setup();
    const files = manager.plan('tiny', 'wasm').files;
    const net = fakeLoader(cache, files, new TypeError('network error'));
    const err = (await manager
      .ensure('tiny', 'wasm', net.loader)
      .catch((e: unknown) => e)) as ModelError;
    expect(err.code).toBe('model-download');
    expect(err.technical).toBe('TypeError: network error');
    const cancelled = fakeLoader(cache, files, new CancelledError());
    await expect(manager.ensure('tiny', 'wasm', cancelled.loader)).rejects.toBeInstanceOf(
      CancelledError,
    );
  });
});

describe('ModelManager.delete / cachedModels', () => {
  it('removes every file of one model, keeps other models and the ORT runtime', async () => {
    const { manager, cache } = setup();
    const tiny = manager.plan('tiny', 'wasm');
    const tinyGpu = manager.plan('tiny', 'webgpu');
    const base = manager.plan('base', 'wasm');
    for (const f of tiny.files) cache.put(url(tiny.repo, f), 100);
    for (const f of tinyGpu.files.slice(-2)) cache.put(url(tinyGpu.repo, f), 1000);
    for (const f of base.files) cache.put(url(base.repo, f), 5);
    cache.put(url('onnx-community/whisper-tiny', 'config.json'), 7); // another repo, not ours
    cache.put(ortWasmPaths().wasm, 26861777);
    expect(await manager.cachedModels()).toEqual(['tiny', 'base']);

    expect(await manager.delete('tiny')).toEqual({ entries: 9, bytes: 7 * 100 + 2 * 1000 });
    expect(await manager.isCached('tiny', 'wasm')).toBe(false);
    expect(await manager.isCached('base', 'wasm')).toBe(true);
    expect(await manager.runtimeCached()).toBe(true);
    expect(cache.entries.has(url('onnx-community/whisper-tiny', 'config.json'))).toBe(true);
    expect(await manager.cachedModels()).toEqual(['base']);
  });

  it('covers both repos of distil-large-v3 and is a no-op without a Cache API', async () => {
    const { manager, cache } = setup();
    cache.put(url('distil-whisper/distil-large-v3', 'config.json'), 1);
    cache.put(url('distil-whisper/distil-large-v3.5-ONNX', 'config.json'), 1);
    expect((await manager.delete('distil-large-v3')).entries).toBe(2);
    const none = new ModelManager({ caches: null, storage: null });
    expect(await none.delete('tiny')).toEqual({ entries: 0, bytes: 0 });
  });
});
