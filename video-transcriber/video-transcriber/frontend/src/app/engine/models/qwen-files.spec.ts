import { CancelledError, ProgressInfo } from '../asr/types';
import { CacheLike, CacheStorageLike, ModelError, ModelManager } from './model-manager';
import { GQA, JZ06, JZ17, QWEN_CATALOG, QwenCatalogEntry, QwenFile, qwenEntry, qwenFileUrl } from './qwen-catalog';
import { fetchQwenFiles, missingQwenFiles, QwenDownloadError } from './qwen-files';
import { FetchLike, MemoryPartStore } from './resumable-download';
import { Sha256, sha256Hex } from './sha256';

// The Qwen downloads: pinned URLs, byte progress, resumable parts, SHA-256 over the finished file, the Cache API
// bucket, delete by exact URL. A fake fetch, a fake cache and an in-memory parts store; nothing is downloaded.

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

const enc = new TextEncoder();
/** A fresh parts store and no real waits between attempts. */
const quick = () => ({ store: new MemoryPartStore(), tuning: { sleep: async () => undefined } });

class BytesCache implements CacheLike {
  readonly entries = new Map<string, Uint8Array>();
  puts = 0;
  async match(url: string): Promise<Response | undefined> {
    const b = this.entries.get(url);
    if (!b) return undefined;
    return { arrayBuffer: async () => b.slice().buffer, headers: new Map([['content-length', String(b.length)]]) } as unknown as Response;
  }
  async keys() {
    return [...this.entries.keys()].map((url) => ({ url }));
  }
  async delete(k: string | { url: string }) {
    return this.entries.delete(typeof k === 'string' ? k : k.url);
  }
  async put(url: string, res: Response) {
    this.puts++;
    this.entries.set(url, new Uint8Array(await res.arrayBuffer()));
  }
}

/** A 200 (Range ignored) that streams `bytes` in `chunk`-sized pieces. */
function streamed(bytes: Uint8Array, chunk = 3): Response {
  let at = 0;
  const body = new ReadableStream<Uint8Array>({
    pull(c) {
      if (at >= bytes.length) c.close();
      else {
        c.enqueue(bytes.slice(at, at + chunk));
        at += chunk;
      }
    },
  });
  return new Response(body, { status: 200 });
}

/** A server that honours Range (206) for `files` (by URL); `dropAfter` cuts the first answer after that many bytes. */
function rangeServer(files: Map<string, Uint8Array>, dropAfter?: number) {
  const requests: string[] = [];
  let cut = dropAfter;
  const fetch: FetchLike = async (u, init) => {
    const range = init?.headers?.['Range'] ?? '';
    requests.push(`${u.split('/').pop()} ${range}`);
    const b = files.get(u)!;
    const m = /^bytes=(\d+)-(\d*)$/.exec(range)!;
    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : b.length - 1;
    const slice = b.slice(start, end + 1);
    const stop = cut;
    cut = undefined;
    let at = 0;
    const body = new ReadableStream<Uint8Array>({
      pull(c) {
        if (stop !== undefined && at >= stop) c.error(new TypeError('network error'));
        else if (at >= slice.length) c.close();
        else {
          const to = Math.min(slice.length, at + 256, stop ?? Infinity);
          c.enqueue(slice.slice(at, to));
          at = to;
        }
      },
    });
    return new Response(body, { status: 206, headers: { 'content-range': `bytes ${start}-${end}/${b.length}` } });
  };
  return { fetch, requests };
}

function tinyEntry(contents: Record<string, string>): QwenCatalogEntry {
  const files: QwenFile[] = Object.entries(contents).map(([name, text], i) => {
    const b = enc.encode(text);
    return {
      role: (['prompt-config', 'tokenizer', 'encoder'] as const)[i],
      repo: 'test/qwen',
      revision: 'a'.repeat(40),
      name,
      bytes: b.length,
      sha256: sha256Hex(b),
    };
  });
  return { ...QWEN_CATALOG[0], files, bytes: files.reduce((n, f) => n + f.bytes, 0) };
}

describe('QWEN_CATALOG', () => {
  it('pins both sizes to commits with sizes and hashes for every file', () => {
    expect(QWEN_CATALOG.map((m) => m.id)).toEqual(['qwen3-asr-0.6b', 'qwen3-asr-1.7b']);
    for (const m of QWEN_CATALOG) {
      expect(new Set(m.files.map((f) => f.role)).size).toBe(9);
      for (const f of m.files) {
        expect(f.revision).toMatch(/^[0-9a-f]{40}$/);
        expect(f.sha256).toMatch(/^[0-9a-f]{64}$/);
        expect(f.bytes).toBeGreaterThan(1000);
        expect(qwenFileUrl(f)).toBe(`https://huggingface.co/${f.repo}/resolve/${f.revision}/${f.name}`);
      }
    }
    // qwen.md: 0.89 GB and 1.96 GB (q4f16 encoder + fused decoder + int8 embeddings + tokenizer)
    expect(qwenEntry('qwen3-asr-0.6b')!.bytes).toBe(896521704);
    expect(qwenEntry('qwen3-asr-1.7b')!.bytes).toBe(1947561026);
    expect(qwenEntry('qwen3-asr-0.6b')!.files.filter((f) => f.repo === GQA.repo).map((f) => f.name)).toEqual([
      'decoder-0.6b-fp16.onnx',
      'decoder-0.6b-fp16.onnx.data',
    ]);
    expect(qwenEntry('qwen3-asr-0.6b')!.files[0].repo).toBe(JZ06.repo);
    expect(qwenEntry('qwen3-asr-1.7b')!.files[0].repo).toBe(JZ17.repo);
    expect(qwenEntry('tiny')).toBeUndefined();
  });
});

describe('Sha256', () => {
  it('matches the FIPS 180-4 test vectors, also when fed in pieces', () => {
    expect(sha256Hex(new Uint8Array(0))).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    expect(sha256Hex(enc.encode('abc'))).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    const long = enc.encode('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq');
    expect(sha256Hex(long)).toBe('248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1');
    const h = new Sha256();
    for (let i = 0; i < long.length; i += 5) h.update(long.subarray(i, i + 5));
    expect(h.digest()).toBe('248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1');
  });
});

describe('fetchQwenFiles', () => {
  const entry = tinyEntry({ 'prompt_config.json': '{"a":1}', 'tokenizer.json': '{"t":true}', 'encoder.onnx': 'ENCODERBYTES' });

  it('downloads each pinned file with whole-model progress, verifies it and keeps it in the cache', async () => {
    const cache = new BytesCache();
    const urls: string[] = [];
    const events: ProgressInfo[] = [];
    const parts = quick();
    const set = await fetchQwenFiles(entry, {
      cache,
      fetch: async (url) => {
        urls.push(url);
        const f = entry.files.find((x) => qwenFileUrl(x) === url)!;
        return streamed(enc.encode({ 'prompt_config.json': '{"a":1}', 'tokenizer.json': '{"t":true}', 'encoder.onnx': 'ENCODERBYTES' }[f.name]!));
      },
      onProgress: (p) => events.push(p),
      ...parts,
    });
    expect(urls).toEqual(entry.files.map((f) => qwenFileUrl(f)));
    expect(new TextDecoder().decode(set['encoder'])).toBe('ENCODERBYTES');
    expect(cache.puts).toBe(3);
    expect(new TextDecoder().decode(cache.entries.get(qwenFileUrl(entry.files[2])))).toBe('ENCODERBYTES');
    expect(await parts.store.list()).toEqual([]); // dropped once the cache has the file
    expect(events.filter((e) => e.note === 'Checking the downloaded file…').length).toBe(3);
    expect(events.every((e) => e.total === entry.bytes)).toBe(true);
    expect(events[events.length - 1]).toMatchObject({ status: 'ready', loaded: entry.bytes, progress: 100 });
    const loaded = events.map((e) => e.loaded);
    expect([...loaded].sort((a, b) => a - b)).toEqual(loaded); // monotonic
    // the second time: no download at all
    const again = await fetchQwenFiles(entry, { cache, fetch: async () => Promise.reject(new Error('offline')) });
    expect(new TextDecoder().decode(again['tokenizer'])).toBe('{"t":true}');
    expect(await missingQwenFiles(entry, cache)).toEqual([]);
  });

  it('refuses a file whose hash or size does not match the pin, and does not cache it', async () => {
    const reply = (text: string) => async () => streamed(enc.encode(text));
    const cases: [string, RegExp][] = [
      ['{"a":2}', /SHA-256/], // same length, other bytes
      ['{"a"', /closed at byte 4 of 7 \(8 failed attempts in a row/], // a short body is a cut connection, retried
      ['{"a":1}!!', /more than the expected 7 bytes/],
    ];
    for (const [text, why] of cases) {
      const cache = new BytesCache();
      const parts = quick();
      const e = await fetchQwenFiles(entry, { cache, fetch: reply(text), ...parts }).catch((x) => x);
      expect(e).toBeInstanceOf(QwenDownloadError);
      expect(e.message).toMatch(why);
      expect(cache.puts).toBe(0);
      expect(await parts.store.list()).toEqual([]); // no part of a wrong file is kept
    }
    const cache = new BytesCache();
    await expect(
      fetchQwenFiles(entry, { cache, fetch: async () => new Response('', { status: 404 }), ...quick() }),
    ).rejects.toThrow(/HTTP 404/);
    expect(cache.puts).toBe(0);
  });

  it('continues a file after a reload and checks the SHA-256 over the whole file', async () => {
    const big = 'E'.repeat(5000);
    const resumable = tinyEntry({ 'prompt_config.json': '{"a":1}', 'tokenizer.json': '{"t":true}', 'encoder.onnx': big });
    const files = new Map(resumable.files.map((f, i) => [qwenFileUrl(f), enc.encode(['{"a":1}', '{"t":true}', big][i])]));
    const store = new MemoryPartStore();
    const tuning = { sleep: async () => undefined, chunkBytes: 1024, maxAttempts: 1 };
    // first visit: the connection drops 2500 bytes into the encoder and this try gives up
    const first = rangeServer(files, undefined);
    const cut = rangeServer(files, 2500);
    const e = await fetchQwenFiles(resumable, {
      cache: new BytesCache(),
      store,
      tuning,
      fetch: (u, init) => (u.endsWith('encoder.onnx') ? cut.fetch(u, init) : first.fetch(u, init)),
    }).catch((x) => x);
    expect(e).toBeInstanceOf(QwenDownloadError);
    expect((await store.parts(qwenFileUrl(resumable.files[2]))).length).toBe(2);

    // the reloaded page: only the rest of the encoder comes over the network
    const cache = new BytesCache();
    const again = rangeServer(files);
    const events: ProgressInfo[] = [];
    const set = await fetchQwenFiles(resumable, { cache, store, tuning, fetch: again.fetch, onProgress: (p) => events.push(p) });
    expect(again.requests).toEqual(['prompt_config.json bytes=0-6', 'tokenizer.json bytes=0-9', 'encoder.onnx bytes=2048-4999']);
    expect(new TextDecoder().decode(set['encoder'])).toBe(big);
    expect(events.some((p) => p.note?.startsWith('Continuing the download'))).toBe(true);
    expect(await store.list()).toEqual([]);
  });

  it('stops with CancelledError when the signal fires', async () => {
    const ac = new AbortController();
    ac.abort();
    await expect(fetchQwenFiles(entry, { cache: null, fetch: async () => streamed(enc.encode('x')), signal: ac.signal })).rejects.toBeInstanceOf(
      CancelledError,
    );
  });

  it('re-downloads a truncated cache entry', async () => {
    const cache = new BytesCache();
    cache.entries.set(qwenFileUrl(entry.files[0]), enc.encode('{"a"'));
    let fetched = 0;
    await fetchQwenFiles(entry, {
      cache,
      ...quick(),
      fetch: async (url) => {
        fetched++;
        const f = entry.files.find((x) => qwenFileUrl(x) === url)!;
        return streamed(enc.encode({ 'prompt_config.json': '{"a":1}', 'tokenizer.json': '{"t":true}', 'encoder.onnx': 'ENCODERBYTES' }[f.name]!));
      },
    });
    expect(fetched).toBe(3);
    expect(new TextDecoder().decode(cache.entries.get(qwenFileUrl(entry.files[0])))).toBe('{"a":1}');
  });
});

describe('ModelManager with Qwen', () => {
  function manager(estimate = { usage: 0, quota: 10e12 }) {
    const cache = new BytesCache();
    const caches: CacheStorageLike = { open: async () => cache };
    const m = new ModelManager({
      caches,
      storage: { estimate: async () => estimate },
      env: async () => ({ backends: { onnx: {} } }),
      parts: new MemoryPartStore(),
      download: { sleep: async () => undefined },
    });
    return { m, cache };
  }

  it('refuses an adapter without shader-f16 and a download that does not fit', async () => {
    const { m } = manager({ usage: 0, quota: 100e6 });
    const loader = { load: async () => ({}) };
    await expect(m.ensureQwen('qwen3-asr-0.6b', loader, { gpu: { shaderF16: false } })).rejects.toMatchObject({ code: 'unsupported' });
    const e = await m.ensureQwen('qwen3-asr-0.6b', loader, { gpu: { shaderF16: true } }).catch((x) => x);
    expect(e).toBeInstanceOf(ModelError);
    expect(e.code).toBe('quota');
    // 897 MB of files + the largest (the 376 MB encoder) once more: its parts and its cache copy exist side by side
    expect(e.userMessage).toMatch(/1\.3 GB needed/);
    await expect(m.ensureQwen('qwen3-asr-9b', loader)).rejects.toMatchObject({ code: 'unknown-model' });
  });

  it('reports a failed download and a failed session start as model-download errors with the page text', async () => {
    const { m } = manager();
    const loader = { load: async () => ({}) };
    const original = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new TypeError('Failed to fetch');
    }) as typeof fetch;
    try {
      await expect(m.ensureQwen('qwen3-asr-0.6b', loader)).rejects.toMatchObject({ code: 'model-download', userMessage: expect.stringMatching(/could not be downloaded/) });
    } finally {
      globalThis.fetch = original;
    }
  });

  it('isCached / delete / cachedModels work by exact URL (the fused-decoder repo is shared by both sizes)', async () => {
    const { m, cache } = manager();
    const small = qwenEntry('qwen3-asr-0.6b')!;
    const big = qwenEntry('qwen3-asr-1.7b')!;
    for (const f of small.files) cache.entries.set(qwenFileUrl(f), new Uint8Array(1));
    cache.entries.set(qwenFileUrl(big.files.find((f) => f.role === 'decoder')!), new Uint8Array(1));
    expect(await m.isCached('qwen3-asr-0.6b', 'webgpu', { shaderF16: true })).toBe(true);
    expect(await m.isCached('qwen3-asr-1.7b', 'webgpu', { shaderF16: true })).toBe(false);
    expect(await m.cachedModels()).toEqual(['qwen3-asr-0.6b', 'qwen3-asr-1.7b']);
    expect(m.qwenSizeText('qwen3-asr-1.7b')).toBe('1.9 GB');
    const r = await m.delete('qwen3-asr-0.6b');
    expect(r.entries).toBe(small.files.length);
    expect(cache.entries.has(qwenFileUrl(big.files.find((f) => f.role === 'decoder')!))).toBe(true);
    expect(await m.cachedModels()).toEqual(['qwen3-asr-1.7b']);
  });
});
