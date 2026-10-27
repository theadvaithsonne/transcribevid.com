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
import { downloadResumable, FetchLike, MemoryPartStore } from './resumable-download';

// jsdom's Blob cannot be read back and `new Response(blob)` turns it into the text "[object Blob]"; Node's own Blob
// behaves like a browser's, so these tests use it.
let jsdomBlob: typeof Blob;
beforeAll(() => {
  jsdomBlob = globalThis.Blob;
  const node = (globalThis as unknown as { process: { getBuiltinModule(m: string): { Blob: typeof Blob } } }).process;
  globalThis.Blob = node.getBuiltinModule('node:buffer').Blob;
});
afterAll(() => {
  globalThis.Blob = jsdomBlob;
});

/** In-memory stand-in for the Cache API bucket Transformers.js reads ('transformers-cache'): url -> content-length. */
class FakeCache implements CacheLike {
  readonly entries = new Map<string, number>();
  readonly types = new Map<string, string | null>();
  /** a file "already downloaded" (by Transformers.js, or by an earlier visit) */
  seed(url: string, bytes: number): void {
    this.entries.set(url, bytes);
  }
  async put(url: string, res: Response): Promise<void> {
    const body = new Uint8Array(await res.arrayBuffer());
    expect(Number(res.headers.get('content-length'))).toBe(body.length);
    this.entries.set(url, body.length);
    this.types.set(url, res.headers.get('content-type'));
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

/** Hugging Face as far as the downloader sees it: byte ranges of made-up files (ONNX 5000 bytes, JSON 300 bytes). */
function fakeHub() {
  const requests: string[] = [];
  const bodies = new Map<string, Uint8Array>();
  let failWith: number | null = null;
  const bodyOf = (u: string) => {
    let b = bodies.get(u);
    if (!b) {
      b = Uint8Array.from({ length: u.endsWith('.onnx') ? 5000 : 300 }, (_, i) => (i + u.length) & 0xff);
      bodies.set(u, b);
    }
    return b;
  };
  const fetch: FetchLike = async (u, init) => {
    const range = init?.headers?.['Range'] ?? '';
    requests.push(`${u} ${range}`);
    if (failWith) return new Response('', { status: failWith });
    const b = bodyOf(u);
    const m = /^bytes=(\d+)-(\d*)$/.exec(range);
    const start = m ? Number(m[1]) : 0;
    const end = m?.[2] ? Number(m[2]) : b.length - 1;
    return new Response(b.slice(start, end + 1) as BodyInit, {
      status: 206,
      headers: { 'content-range': `bytes ${start}-${end}/${b.length}`, etag: '"x"' },
    });
  };
  return { fetch, requests, bodyOf, fail: (status: number | null) => (failWith = status) };
}

const HF = 'https://huggingface.co/';
const url = (repo: string, file: string) => `${HF}${repo}/resolve/main/${file}`;
const fileBytes = (file: string) => (file.endsWith('.onnx') ? 5000 : 300);

function setup(estimate: { usage?: number; quota?: number } | null = { usage: 0, quota: 10e9 }) {
  const caches = new FakeCaches();
  const storage: StorageEstimateLike | null = estimate ? { estimate: async () => estimate } : null;
  const env: TransformersEnvLike = { backends: { onnx: {} } };
  const hub = fakeHub();
  const parts = new MemoryPartStore();
  let envCalls = 0;
  const manager = new ModelManager({
    caches,
    storage,
    env: async () => {
      envCalls++;
      return env;
    },
    fetch: hub.fetch,
    parts,
    download: { progressMs: 0, sleep: async () => undefined },
  });
  return { manager, caches, cache: caches.cache, env, envCalls: () => envCalls, hub, parts };
}

/** Loader double for the engine: reads the plan's files from the cache, "downloads" (seeds) the ones that are not there. */
function fakeLoader(cache: FakeCache, files: string[], fail?: Error) {
  const seen: LoadOptions[] = [];
  const loader: ModelLoader = {
    async load(o: LoadOptions, onProgress?: (p: ProgressInfo) => void): Promise<LoadInfo> {
      seen.push(o);
      if (fail) throw fail;
      let loaded = 0;
      for (const f of files) {
        if (!cache.entries.has(url(o.repo, f))) cache.seed(url(o.repo, f), 10);
        const size = cache.entries.get(url(o.repo, f))!;
        onProgress?.({ status: 'progress', file: f, loaded, total: 0, progress: 0, fileLoaded: 0, fileTotal: size });
        loaded += size;
        onProgress?.({ status: 'done', file: f, loaded, total: 0, progress: 0, fileLoaded: size, fileTotal: size });
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
    for (const f of p.files) cache.seed(url(p.repo, f), 1);
    expect(await manager.isCached('tiny', 'wasm')).toBe(true);
    expect(caches.opened.every((n) => n === 'transformers-cache')).toBe(true);
    // the WebGPU files are other files
    expect(await manager.isCached('tiny', 'webgpu')).toBe(false);
    cache.entries.delete(url(p.repo, 'onnx/decoder_model_merged_quantized.onnx'));
    expect(await manager.missingFiles(p)).toEqual(['onnx/decoder_model_merged_quantized.onnx']);
  });

  it('is false without a Cache API (insecure context)', async () => {
    const manager = new ModelManager({ caches: null, storage: null, parts: new MemoryPartStore() });
    expect(await manager.isCached('tiny', 'wasm')).toBe(false);
    expect((await manager.missingFiles(manager.plan('tiny', 'wasm'))).length).toBe(7);
  });
});

describe('ModelManager.checkQuota', () => {
  it('counts the ONNX files, the configs and the ORT runtime not cached yet, plus the largest file once more', async () => {
    const { manager, cache } = setup({ usage: 1e9, quota: 3e9 });
    const p = manager.plan('tiny', 'wasm');
    const q = await manager.checkQuota(p);
    // the largest file's saved parts and its Cache API copy exist side by side for a moment
    const peak = Math.max(p.encoderBytes, p.decoderBytes);
    expect(q.needed).toBe(p.encoderBytes + p.decoderBytes + CONFIG_BYTES_ESTIMATE + ORT_WASM_BYTES.asyncify + peak);
    expect(q).toEqual(expect.objectContaining({ usage: 1e9, quota: 3e9, free: 2e9, ok: true }));

    for (const f of p.files.slice(0, -1)) cache.seed(url(p.repo, f), 1);
    cache.seed(ortWasmPaths().wasm, 1);
    expect((await manager.checkQuota(p)).needed).toBe(2 * p.decoderBytes);
  });

  it('does not count again the parts an unfinished download already saved (they are in the usage)', async () => {
    const { manager, hub, parts } = setup();
    const p = manager.plan('tiny', 'wasm');
    const before = (await manager.checkQuota(p)).needed;
    await savedParts(hub.fetch, parts, url(p.repo, p.files[5]), 2048);
    expect((await manager.checkQuota(p)).needed).toBe(before - 2048);
  });

  it('is not ok when the free space is smaller than the download, ok when the quota is unknown', async () => {
    const small = setup({ usage: 9.9e9, quota: 10e9 });
    expect((await small.manager.checkQuota(small.manager.plan('base', 'webgpu'))).ok).toBe(false);
    const unknown = setup(null);
    const q = await unknown.manager.checkQuota(unknown.manager.plan('base', 'webgpu'));
    expect(q).toEqual(expect.objectContaining({ quota: null, free: null, ok: true }));
  });
});

/** An earlier visit: downloads `url` in 1 KiB parts until `stopAt` bytes (a part boundary), then the tab went away. */
async function savedParts(fetchImpl: FetchLike, parts: MemoryPartStore, u: string, stopAt: number) {
  const ac = new AbortController();
  await downloadResumable(u, {
    store: parts,
    fetchImpl,
    chunkBytes: 1024,
    progressMs: 0,
    signal: ac.signal,
    onProgress: (p) => p.loaded >= stopAt && ac.abort(),
  }).catch(() => undefined);
}

describe('ModelManager.ensure', () => {
  it('downloads the missing files resumably into the cache, then loads with the bar kept full', async () => {
    const { manager, cache, env, envCalls, hub, parts } = setup();
    const plan = manager.plan('tiny', 'wasm');
    const { loader, seen } = fakeLoader(cache, plan.files);
    const events: ProgressInfo[] = [];
    const first = await manager.ensure('tiny', 'wasm', loader, {
      onProgress: (p) => events.push(p),
    });
    expect(first.wasCached).toBe(false);
    expect(seen[0]).toEqual(plan.loadOptions);
    expect(env.backends.onnx.wasm).toEqual({ wasmPaths: ortWasmPaths(), numThreads: 1 });
    // every file once, as a Range request, under the key Transformers.js looks up, with its content-length
    expect(hub.requests).toEqual(plan.files.map((f) => `${url(plan.repo, f)} bytes=0-`));
    for (const f of plan.files) expect(cache.entries.get(url(plan.repo, f))).toBe(fileBytes(f));
    expect(cache.types.get(url(plan.repo, 'config.json'))).toBe('application/json');
    expect(cache.types.get(url(plan.repo, plan.files[6]))).toBe('application/octet-stream');
    expect(await parts.list()).toEqual([]); // the parts go once the cache has the file
    expect(await manager.isCached('tiny', 'wasm')).toBe(true);

    // one bar: monotonic, and the engine reading the files back from the cache keeps it full
    const loaded = events.map((e) => e.loaded);
    expect([...loaded].sort((a, b) => a - b)).toEqual(loaded);
    expect(events[0]).toMatchObject({ status: 'download', file: 'config.json', loaded: 0 });
    const total = 5 * 300 + 2 * 5000;
    const engineEvents = events.slice(events.findIndex((e) => e.status === 'done' && e.file === plan.files[6]) + 1);
    expect(engineEvents.length).toBe(15);
    expect(engineEvents.every((e) => e.loaded === total && e.total === total && e.progress === 100)).toBe(true);
    expect(events.at(-1)!.status).toBe('ready');

    const again: ProgressInfo[] = [];
    const second = await manager.ensure('tiny', 'wasm', loader, { onProgress: (p) => again.push(p) });
    expect(second.wasCached).toBe(true);
    expect(hub.requests.length).toBe(7); // nothing downloaded
    expect(again.length).toBe(15); // the engine's own progress, as before
    expect(envCalls()).toBe(1);
  });

  it('continues a file an earlier visit left half-downloaded, with a note on what is saved', async () => {
    const { manager, cache, hub, parts } = setup();
    const plan = manager.plan('tiny', 'wasm');
    const encoderUrl = url(plan.repo, plan.files[5]);
    await savedParts(hub.fetch, parts, encoderUrl, 2048);
    hub.requests.length = 0;
    const events: ProgressInfo[] = [];
    const { loader } = fakeLoader(cache, plan.files);
    await manager.ensure('tiny', 'wasm', loader, { onProgress: (p) => events.push(p) });
    expect(hub.requests).toContain(`${encoderUrl} bytes=2048-4999`);
    const resumed = events.find((e) => e.note?.startsWith('Continuing the download'))!;
    expect(resumed).toMatchObject({ file: plan.files[5], loaded: 5 * 300 + 2048, fileLoaded: 2048 });
    expect(cache.entries.get(encoderUrl)).toBe(5000);
  });

  it('refuses a download that does not fit the quota unless told to ignore it (then the engine streams it)', async () => {
    const { manager, cache, hub } = setup({ usage: 9.95e9, quota: 10e9 });
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
    expect(hub.requests).toEqual([]);
  });

  it('wraps a failed download or load as model-download and lets a cancel through', async () => {
    const { manager, cache, hub } = setup();
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

    const other = setup();
    other.hub.fail(404);
    const ok = fakeLoader(other.cache, files);
    const missing = (await other.manager.ensure('tiny', 'wasm', ok.loader).catch((e: unknown) => e)) as ModelError;
    expect(missing).toMatchObject({ code: 'model-download', userMessage: expect.stringMatching(/could not be downloaded/) });
    expect(missing.technical).toMatch(/DownloadError: HTTP 404/);
    expect(ok.seen.length).toBe(0);
    const ac = new AbortController();
    ac.abort();
    await expect(other.manager.ensure('tiny', 'wasm', ok.loader, { signal: ac.signal })).rejects.toBeInstanceOf(CancelledError);
    expect(hub.requests.length).toBe(7);
  });
});

describe('ModelManager.delete / cachedModels', () => {
  it('removes every file of one model, keeps other models and the ORT runtime', async () => {
    const { manager, cache } = setup();
    const tiny = manager.plan('tiny', 'wasm');
    const tinyGpu = manager.plan('tiny', 'webgpu');
    const base = manager.plan('base', 'wasm');
    for (const f of tiny.files) cache.seed(url(tiny.repo, f), 100);
    for (const f of tinyGpu.files.slice(-2)) cache.seed(url(tinyGpu.repo, f), 1000);
    for (const f of base.files) cache.seed(url(base.repo, f), 5);
    cache.seed(url('onnx-community/whisper-tiny', 'config.json'), 7); // another repo, not ours
    cache.seed(ortWasmPaths().wasm, 26861777);
    expect(await manager.cachedModels()).toEqual(['tiny', 'base']);

    expect(await manager.delete('tiny')).toEqual({ entries: 9, bytes: 7 * 100 + 2 * 1000 });
    expect(await manager.isCached('tiny', 'wasm')).toBe(false);
    expect(await manager.isCached('base', 'wasm')).toBe(true);
    expect(await manager.runtimeCached()).toBe(true);
    expect(cache.entries.has(url('onnx-community/whisper-tiny', 'config.json'))).toBe(true);
    expect(await manager.cachedModels()).toEqual(['base']);
  });

  it('also drops the saved parts of the model, not those of other models', async () => {
    const { manager, hub, parts } = setup();
    const tiny = manager.plan('tiny', 'wasm');
    const base = manager.plan('base', 'wasm');
    await savedParts(hub.fetch, parts, url(tiny.repo, tiny.files[5]), 2048);
    await savedParts(hub.fetch, parts, url(base.repo, base.files[5]), 1024);
    expect(await manager.delete('tiny')).toEqual({ entries: 0, bytes: 2048 });
    expect((await parts.list()).map((m) => m.url)).toEqual([url(base.repo, base.files[5])]);
  });

  it('covers both repos of distil-large-v3 and is a no-op without a Cache API', async () => {
    const { manager, cache } = setup();
    cache.seed(url('distil-whisper/distil-large-v3', 'config.json'), 1);
    cache.seed(url('distil-whisper/distil-large-v3.5-ONNX', 'config.json'), 1);
    expect((await manager.delete('distil-large-v3')).entries).toBe(2);
    const none = new ModelManager({ caches: null, storage: null, parts: new MemoryPartStore() });
    expect(await none.delete('tiny')).toEqual({ entries: 0, bytes: 0 });
  });
});
