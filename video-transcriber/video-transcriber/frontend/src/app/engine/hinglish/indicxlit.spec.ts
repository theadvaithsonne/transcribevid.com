import { MODEL_WORDS } from './indicxlit-fixtures';
import { IndicXlit, IndicXlitInfo, Runtime, fromBuffers, load } from './indicxlit';
import { IndicXlitClient, WorkerLike } from './indicxlit-client';
import { WorkerRequest, WorkerResponse, createWorkerHandler } from './indicxlit-worker-core';
import { JsKernels, Kernels, createWasmKernels } from './kernels';
import { parseWordCache } from './wordcache';

const f = Math.fround;

// ----------------------------------------------------------------------------------------------------------------
// the model assets are read from disk (Node); everything else here needs no files
// ----------------------------------------------------------------------------------------------------------------
async function readAssets(): Promise<{ header: string; bin: ArrayBuffer } | null> {
  try {
    const proc = (globalThis as unknown as { process?: { cwd(): string } }).process;
    if (!proc) return null;
    const specifier = (name: string): string => `node:${name}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fs: any = await import(/* @vite-ignore */ specifier('fs'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const path: any = await import(/* @vite-ignore */ specifier('path'));
    const dir = path.join(proc.cwd(), 'public', 'models', 'indicxlit');
    const header: string = fs.readFileSync(path.join(dir, 'indicxlit.json'), 'utf8');
    const buf = fs.readFileSync(path.join(dir, 'indicxlit.bin'));
    return {
      header,
      bin: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer,
    };
  } catch {
    return null;
  }
}

function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ----------------------------------------------------------------------------------------------------------------
describe('IndicXlit numeric kernels: WebAssembly builds match the TypeScript reference bit for bit', () => {
  const memory = new WebAssembly.Memory({ initial: 400 });
  const F32 = new Float32Array(memory.buffer);
  const I32 = new Int32Array(memory.buffer);
  const U8 = new Uint8Array(memory.buffer);
  const I8 = new Int8Array(memory.buffer);
  const at = {
    x: 1 << 20,
    y: 2 << 20,
    y2: 3 << 20,
    gamma: 4 << 20,
    beta: (4 << 20) + 8192,
    u8: 5 << 20,
    rs: 6 << 20,
    rs2: (6 << 20) | 4096,
    w: 7 << 20,
    comp: 15 << 20,
    c: 16 << 20,
    scale: 17 << 20,
    bias: 18 << 20,
    res: 19 << 20,
    sc: 20 << 20,
    q: 21 << 20,
    K: 22 << 20,
    V: 23 << 20,
  };
  const rnd = prng(20261025);
  const gauss = (): number => {
    let s = 0;
    for (let i = 0; i < 6; i++) s += rnd();
    return (s - 3) * 1.4142;
  };
  let reference: Kernels;
  const variants: [string, Kernels][] = [];

  beforeAll(async () => {
    reference = new JsKernels(memory);
    const simd = await createWasmKernels(memory, { allowSimd: true });
    const portable = await createWasmKernels(memory, { allowSimd: false });
    if (simd) variants.push([simd.name, simd]);
    if (portable && portable.name !== simd?.name) variants.push([portable.name, portable]);
  });

  it('has at least one WebAssembly build to test', () => {
    expect(variants.length).toBeGreaterThan(0);
  });

  it('layerNorm', () => {
    for (let it = 0; it < 24; it++) {
      const m = 1 + (it % 7);
      for (let i = 0; i < m * 256; i++)
        F32[(at.x >> 2) + i] = f(gauss() * (it % 3 === 0 ? 8 : 1) + (it % 5 === 0 ? 20 : 0));
      for (let i = 0; i < 256; i++) {
        F32[(at.gamma >> 2) + i] = f(1 + 0.3 * gauss());
        F32[(at.beta >> 2) + i] = f(0.2 * gauss());
      }
      reference.layerNorm(at.x, m, 256, at.gamma, at.beta, at.y2);
      const expected = F32.slice(at.y2 >> 2, (at.y2 >> 2) + m * 256);
      for (const [name, k] of variants) {
        k.layerNorm(at.x, m, 256, at.gamma, at.beta, at.y);
        expect(Array.from(F32.subarray(at.y >> 2, (at.y >> 2) + m * 256)), name).toEqual(
          Array.from(expected),
        );
      }
    }
  });

  it('quantizeRows', () => {
    for (let it = 0; it < 20; it++) {
      const m = 1 + (it % 9);
      const k = it % 2 ? 256 : 1024;
      for (let i = 0; i < m * k; i++) F32[(at.x >> 2) + i] = f(gauss() * (rnd() < 0.05 ? 20 : 1));
      if (it % 10 === 3) for (let i = 0; i < k; i++) F32[(at.x >> 2) + i] = 0;
      reference.quantizeRows(at.x, m, k, at.u8, at.rs);
      const expU = U8.slice(at.u8, at.u8 + m * k);
      const expR = F32.slice(at.rs >> 2, (at.rs >> 2) + m);
      for (const [name, kern] of variants) {
        U8.fill(0, at.u8, at.u8 + m * k);
        kern.quantizeRows(at.x, m, k, at.u8, at.rs);
        expect(U8.subarray(at.u8, at.u8 + m * k), name).toEqual(expU);
        expect(F32.subarray(at.rs >> 2, (at.rs >> 2) + m), name).toEqual(expR);
      }
    }
  });

  it('gemm with the saturating u8 x s8 pair sums', () => {
    for (const [m, n, k] of [
      [1, 54, 256],
      [3, 256, 256],
      [4, 768, 256],
      [5, 1024, 256],
      [7, 256, 1024],
      [9, 512, 256],
    ]) {
      for (let i = 0; i < m * k; i++) {
        const r = rnd();
        U8[at.u8 + i] =
          r < 0.1
            ? rnd() < 0.5
              ? 1
              : 255
            : 128 + Math.round((rnd() - 0.5) * (rnd() < 0.2 ? 250 : 40));
      }
      for (let i = 0; i < n * k; i++) {
        const r = rnd();
        I8[at.w + i] =
          r < 0.1
            ? rnd() < 0.5
              ? -127
              : 127
            : Math.round((rnd() - 0.5) * (rnd() < 0.2 ? 250 : 60));
      }
      for (let j = 0; j < n; j++) {
        let s = 0;
        for (let t = 0; t < k; t++) s += I8[at.w + j * k + t];
        I32[(at.comp >> 2) + j] = -128 * s;
      }
      reference.gemm(at.u8, m, at.w, n, k, at.comp, at.y2);
      const expected = I32.slice(at.y2 >> 2, (at.y2 >> 2) + m * n);
      for (const [name, kern] of variants) {
        kern.gemm(at.u8, m, at.w, n, k, at.comp, at.c);
        expect(I32.subarray(at.c >> 2, (at.c >> 2) + m * n), name).toEqual(expected);
      }
    }
  });

  it('epilogue (dequantise, bias, GELU, residual)', () => {
    for (const [m, n, gelu, bias, res] of [
      [3, 1024, 1, 1, 0],
      [5, 256, 0, 1, 1],
      [1, 54, 0, 0, 0],
      [4, 768, 0, 1, 0],
      [2, 256, 1, 0, 1],
      [3, 1022, 1, 1, 1],
    ]) {
      for (let i = 0; i < m * n; i++)
        I32[(at.c >> 2) + i] = Math.round((rnd() - 0.5) * 2 * (rnd() < 0.1 ? 3e6 : 3e5));
      for (let i = 0; i < m; i++) F32[(at.rs >> 2) + i] = f(1 / f(127 / f(1 + 3 * rnd())));
      for (let i = 0; i < n; i++) {
        F32[(at.scale >> 2) + i] = f(50 + 800 * rnd());
        F32[(at.bias >> 2) + i] = f(0.5 * gauss());
      }
      for (let i = 0; i < m * n; i++) F32[(at.res >> 2) + i] = f(gauss() * 3);
      reference.epilogue(
        at.c,
        m,
        n,
        at.rs,
        at.scale,
        bias ? at.bias : 0,
        gelu,
        res ? at.res : 0,
        at.y2,
      );
      const expected = F32.slice(at.y2 >> 2, (at.y2 >> 2) + m * n);
      for (const [name, kern] of variants) {
        kern.epilogue(
          at.c,
          m,
          n,
          at.rs,
          at.scale,
          bias ? at.bias : 0,
          gelu,
          res ? at.res : 0,
          at.y,
        );
        expect(F32.subarray(at.y >> 2, (at.y >> 2) + m * n), name).toEqual(expected);
      }
    }
  });

  it('attendHead for every accumulation order', () => {
    for (let it = 0; it < 36; it++) {
      const keys = 1 + (it % 19) * (it > 28 ? 3 : 1);
      const stride = 256;
      for (let i = 0; i < 64; i++) F32[(at.q >> 2) + i] = f(gauss());
      for (let j = 0; j < keys; j++) {
        for (let d = 0; d < 64; d++) {
          F32[(at.K >> 2) + j * stride + d] = f(gauss());
          F32[(at.V >> 2) + j * stride + d] = f(gauss());
        }
      }
      const main = it % 4;
      const tail = (it + 1) % 4;
      const tailStart = keys > 4 ? keys - (keys % 5) : keys;
      const pv = it % 3;
      reference.attendHead(at.q, at.K, at.V, stride, keys, at.y2, at.sc, main, tail, tailStart, pv);
      const expected = F32.slice(at.y2 >> 2, (at.y2 >> 2) + 64);
      for (const [name, kern] of variants) {
        kern.attendHead(at.q, at.K, at.V, stride, keys, at.y, at.sc, main, tail, tailStart, pv);
        expect(
          F32.subarray(at.y >> 2, (at.y >> 2) + 64),
          `${name} keys=${keys} modes=${main}/${tail}/${pv}`,
        ).toEqual(expected);
      }
    }
  });
});

// ----------------------------------------------------------------------------------------------------------------
describe('IndicXlit model against the server (CTranslate2 int8)', () => {
  let assets: { header: string; bin: ArrayBuffer } | null = null;
  let model: Runtime;

  beforeAll(async () => {
    assets = await readAssets();
    if (assets) model = await fromBuffers(assets.header, assets.bin);
  }, 60_000);

  const needsAssets = (): void => {
    if (!assets)
      throw new Error(
        'public/models/indicxlit/ was not readable from the test process (cwd must be the frontend folder).',
      );
  };

  it('loads and reports the kernel it uses', () => {
    needsAssets();
    expect(['wasm-simd', 'wasm', 'js']).toContain(model.info.kernel);
    expect(model.info.binBytes).toBe(assets!.bin.byteLength);
  });

  it(`reproduces the server's beam-4 output for ${MODEL_WORDS.length} words`, () => {
    needsAssets();
    const words = MODEL_WORDS.map(([w]) => w);
    const got = model.transliterate(words, { beamSize: 4 });
    const wrong = words
      .map((w, i) => [w, MODEL_WORDS[i][1], got[i]])
      .filter(([, want, have]) => want !== have);
    expect(wrong).toEqual([]);
  }, 60_000);

  it(`reproduces the server's greedy output for ${MODEL_WORDS.length} words`, () => {
    needsAssets();
    const words = MODEL_WORDS.map(([w]) => w);
    const got = model.transliterate(words, { beamSize: 1 });
    const wrong = words
      .map((w, i) => [w, MODEL_WORDS[i][2], got[i]])
      .filter(([, want, have]) => want !== have);
    expect(wrong).toEqual([]);
  }, 60_000);

  it('normalises to NFC like the server and keeps the order and length of its input', () => {
    needsAssets();
    const nfd = 'फ़ाइल'.normalize('NFD');
    const nfc = 'फ़ाइल'.normalize('NFC');
    const out = model.transliterate([nfd, 'नमस्ते', nfc, 'नमस्ते'], { beamSize: 4 });
    expect(out.length).toBe(4);
    expect(out[0]).toBe(out[2]);
    expect(out[1]).toBe(out[3]);
    expect(out[1]).toBe('namaste');
    expect(model.transliterate([])).toEqual([]);
  });

  it('gives the same answers with the portable WebAssembly build and with the TypeScript kernels', async () => {
    needsAssets();
    const sample = MODEL_WORDS.slice(0, 12).map(([w]) => w);
    const want = model.transliterate(sample, { beamSize: 4 });
    const portable = await fromBuffers(assets!.header, assets!.bin, { disableSimd: true });
    expect(portable.transliterate(sample, { beamSize: 4 })).toEqual(want);
    const js = await fromBuffers(assets!.header, assets!.bin, { forceJs: true });
    expect(js.info.kernel).toBe('js');
    expect(js.transliterate(sample.slice(0, 4), { beamSize: 4 })).toEqual(want.slice(0, 4));
  }, 120_000);

  it('rejects impossible options and a disposed model', async () => {
    needsAssets();
    expect(() => model.transliterate(['नमस्ते'], { beamSize: 0 })).toThrow(RangeError);
    expect(() => model.transliterate(['नमस्ते'], { beamSize: 28 })).toThrow(RangeError);
    expect(() => model.transliterate(['नमस्ते'], { beamSize: 2.5 })).toThrow(RangeError);
    expect(() => model.transliterate(['नमस्ते'], { maxDecodingLength: 0 })).toThrow(RangeError);
    const other = await fromBuffers(assets!.header, assets!.bin);
    other.dispose();
    expect(() => other.transliterate(['नमस्ते'])).toThrow(/disposed/);
  });

  it('refuses assets of another format or a truncated download', async () => {
    needsAssets();
    const header = JSON.parse(assets!.header);
    await expect(fromBuffers({ ...header, format: 'something-else' }, assets!.bin)).rejects.toThrow(
      /format/,
    );
    await expect(fromBuffers(header, assets!.bin.slice(0, 1000))).rejects.toThrow(/wrong size/);
  });

  it('answers from a word cache only for the settings it was made for, and ignores a cache of another model', async () => {
    needsAssets();
    const sha = JSON.parse(assets!.header).bin.sha256 as string;
    const table = `#indicxlit-wordcache v1 model=${sha} beam=4 max=96 count=1
नमस्ते	CACHED
`;
    const cached = await fromBuffers(assets!.header, assets!.bin, { wordCacheText: table });
    expect(cached.info.wordCacheEntries).toBe(1);
    expect(cached.transliterate(['नमस्ते'])).toEqual(['CACHED']); // server settings: answered from the table
    expect(cached.transliterate(['नमस्ते'], { beamSize: 1 })).toEqual(['namaste']); // other settings: the network runs
    expect(cached.transliterate(['नमस्ते'], { beamSize: 4, maxDecodingLength: 50 })).toEqual([
      'namaste',
    ]);
    const other = table.replace(sha, '0'.repeat(64));
    const ignored = await fromBuffers(assets!.header, assets!.bin, { wordCacheText: other });
    expect(ignored.info.wordCacheEntries).toBe(0);
    expect(ignored.transliterate(['नमस्ते'])).toEqual(['namaste']);
    const off = await fromBuffers(assets!.header, assets!.bin, {
      wordCacheText: table,
      wordCache: false,
    });
    expect(off.transliterate(['नमस्ते'])).toEqual(['namaste']);
  });

  it('the shipped word cache holds exactly what the network computes (sample)', async () => {
    needsAssets();
    const proc = (globalThis as unknown as { process?: { cwd(): string } }).process!;
    const specifier = (name: string): string => `node:${name}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fs: any = await import(/* @vite-ignore */ specifier('fs'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const path: any = await import(/* @vite-ignore */ specifier('path'));
    const text: string = fs.readFileSync(
      path.join(proc.cwd(), 'public', 'models', 'indicxlit', 'wordcache.tsv'),
      'utf8',
    );
    const sha = JSON.parse(assets!.header).bin.sha256 as string;
    const table = parseWordCache(text, sha, { beam: 4, maxDecodingLength: 96 });
    expect(table).not.toBeNull();
    expect(table!.size).toBeGreaterThan(1000);
    const sample = [...table!.entries()].filter((_, i) => i % 97 === 0).slice(0, 80);
    const fresh = await fromBuffers(assets!.header, assets!.bin, { wordCache: false });
    const got = fresh.transliterate(
      sample.map(([w]) => w),
      { beamSize: 4 },
    );
    expect(got).toEqual(sample.map(([, r]) => r));
  }, 60_000);

  describe('load() over the network', () => {
    /** A Response look-alike that streams `bytes` in a few chunks (or answers with a status). */
    function reply(bytes: Uint8Array | string, status = 200): Response {
      const data = typeof bytes === 'string' ? new TextEncoder().encode(bytes) : bytes;
      let sent = 0;
      return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => JSON.parse(new TextDecoder().decode(data)),
        text: async () => new TextDecoder().decode(data),
        arrayBuffer: async () =>
          data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength),
        body: {
          getReader: () => ({
            read: async () => {
              if (sent >= data.length) return { done: true, value: undefined };
              const chunk = data.subarray(sent, sent + 700_000);
              sent += chunk.length;
              return { done: false, value: chunk };
            },
          }),
        },
      } as unknown as Response;
    }

    function server(overrides: Record<string, (n: number) => Response> = {}) {
      const hits: string[] = [];
      const files: Record<string, Uint8Array | string> = {
        'indicxlit.json': assets!.header,
        'indicxlit.bin': new Uint8Array(assets!.bin),
      };
      const fetcher = (async (url: string) => {
        const name = url.split('/').pop()!.split('?')[0];
        const tries = hits.filter((h) => h.startsWith(url.split('?')[0])).length;
        hits.push(url);
        if (overrides[name]) return overrides[name](tries);
        return name in files ? reply(files[name]) : reply('', 404);
      }) as unknown as typeof fetch;
      return { fetcher, hits };
    }

    it('downloads, reports progress and converts', async () => {
      needsAssets();
      const { fetcher } = server();
      const seen: number[] = [];
      const loaded = await load('/models/indicxlit', {
        fetch: fetcher,
        onProgress: (received, total) => seen.push(received / total),
      });
      expect(seen[seen.length - 1]).toBe(1);
      expect(seen.length).toBeGreaterThan(5);
      expect(loaded.transliterate(['नमस्ते'])).toEqual(['namaste']);
      expect(loaded.info.wordCacheEntries).toBe(0); // the fake server has no wordcache.tsv
    }, 60_000);

    it('fetches the model again, bypassing the HTTP cache, when a stale copy fails its SHA-256 check', async () => {
      needsAssets();
      const broken = new Uint8Array(assets!.bin.slice(0));
      broken[123456] ^= 0xff;
      const { fetcher, hits } = server({
        'indicxlit.bin': (n) => reply(n === 0 ? broken : new Uint8Array(assets!.bin)),
      });
      const loaded = await load('/models/indicxlit/', { fetch: fetcher });
      expect(hits.filter((h) => h.includes('indicxlit.bin')).length).toBe(2);
      expect(loaded.transliterate(['भारत'])).toEqual(['bhaarat']);
    }, 60_000);

    it('gives up when the model is corrupt even after the second download', async () => {
      needsAssets();
      const broken = new Uint8Array(assets!.bin.slice(0));
      broken[99] ^= 0x01;
      const { fetcher } = server({ 'indicxlit.bin': () => reply(broken) });
      await expect(load('/models/indicxlit/', { fetch: fetcher })).rejects.toThrow(/SHA-256/);
    }, 60_000);

    it('says so when the asset URL serves the app page instead of the model header', async () => {
      needsAssets();
      const html = '<!doctype html><html><body>app</body></html>';
      await expect(
        load('/wrong/', { fetch: server({ 'indicxlit.json': () => reply(html) }).fetcher }),
      ).rejects.toThrow('indicxlit: /wrong/indicxlit.json is not the model header');
      const typed = (async () =>
        new Response(html, {
          status: 200,
          headers: { 'content-type': 'text/html; charset=utf-8' },
        })) as unknown as typeof fetch;
      await expect(load('/wrong/', { fetch: typed })).rejects.toThrow(/is not the model header/);
      await expect(
        load('/w/', { fetch: server({ 'indicxlit.json': () => reply('[1, 2]') }).fetcher }),
      ).rejects.toThrow(/is not the model header/);
    });

    it('reports missing files and truncated downloads', async () => {
      needsAssets();
      await expect(
        load('/nowhere/', { fetch: server({ 'indicxlit.json': () => reply('', 404) }).fetcher }),
      ).rejects.toThrow(/404/);
      const short = new Uint8Array(assets!.bin.slice(0, 5_000_000));
      await expect(
        load('/m/', { fetch: server({ 'indicxlit.bin': () => reply(short) }).fetcher }),
      ).rejects.toThrow(/incomplete/);
    }, 60_000);
  });

  it('stops at the maximum decoding length', () => {
    needsAssets();
    const long = 'अ'.repeat(60);
    const out = model.transliterate([long], { beamSize: 4, maxDecodingLength: 5 })[0];
    expect(out.length).toBeLessThanOrEqual(5);
  });

  it('ships the whole position table and matches the server beyond 256 symbols', () => {
    needsAssets();
    expect(JSON.parse(assets!.header).dims.position_rows).toBe(1024);
    // server (CTranslate2 int8, beam 4): 16 a's; the old 256-row table with recomputed rows gave 15
    expect(model.transliterate(['अ'.repeat(257)], { beamSize: 4 })).toEqual(['a'.repeat(16)]);
  }, 60_000);

  it('refuses to invent a position encoding beyond the shipped table', async () => {
    needsAssets();
    const header = JSON.parse(assets!.header);
    header.dims.position_rows = 16;
    const small = await fromBuffers(header, assets!.bin, { wordCache: false });
    expect(small.transliterate(['क'])).toEqual(model.transliterate(['क'])); // within the table
    expect(() => small.transliterate(['क'.repeat(15)])).toThrow(/^indicxlit: no position encoding/);
  });

  it('keeps the scratch rows large enough when a wide beam follows a longer word at a narrow beam', async () => {
    needsAssets();
    // beam 16 lays out 16 rows; a 13-symbol word at beam 2 re-lays the scratch for a longer source, which used to
    // size the rows from that call alone (15 < 16), so the next beam-16 call overran its buffers and gave 'nae'.
    const m = await fromBuffers(assets!.header, assets!.bin, { wordCache: false });
    m.transliterate(['क'], { beamSize: 16 });
    m.transliterate(['विश्वविद्यालय'], { beamSize: 2 });
    expect(m.transliterate(['नमस्ते'], { beamSize: 16 })).toEqual(['namaste']);
  });

  it('transliterateAsync gives the same answers and stops inside one long word when cancelled', async () => {
    needsAssets();
    const sample = MODEL_WORDS.slice(0, 20).map(([w]) => w);
    const m = await fromBuffers(assets!.header, assets!.bin, { wordCache: false });
    expect(await m.transliterateAsync(sample, { sliceMs: 0 })).toEqual(
      model.transliterate(sample, { beamSize: 4 }),
    );
    let polls = 0;
    const started = performance.now();
    await expect(
      m.transliterateAsync(['क'.repeat(600)], { isCancelled: () => ++polls > 3 }),
    ).rejects.toMatchObject({ name: 'AbortError' });
    expect(performance.now() - started).toBeLessThan(2_000); // the whole word takes several seconds
    expect(m.transliterate(['नमस्ते'])).toEqual(['namaste']); // usable afterwards
  }, 60_000);

  it('a worker cancel reaches a single long word mid-decode', async () => {
    needsAssets();
    const posted: WorkerResponse[] = [];
    const handle = createWorkerHandler((msg) => posted.push(msg), {
      loader: () => fromBuffers(assets!.header, assets!.bin, { wordCache: false }),
    });
    await handle({ id: 1, type: 'load', base: '/m/' });
    const running = handle({ id: 2, type: 'convert', words: ['क'.repeat(600)] });
    await new Promise((resolve) => setTimeout(resolve, 60));
    const cancelledAt = performance.now();
    await handle({ id: 3, type: 'cancel', target: 2 });
    await running;
    expect(performance.now() - cancelledAt).toBeLessThan(500);
    expect(posted.filter((msg) => msg.id === 2).map((msg) => msg.type)).toContain('cancelled');
    expect(handle.inspect()).toEqual({ inFlight: 0, cancelled: 0 });
  }, 60_000);
});

// ----------------------------------------------------------------------------------------------------------------
describe('word cache file format', () => {
  const sha = 'a'.repeat(64);
  const ok = `#indicxlit-wordcache v1 model=${sha} beam=4 max=96 count=2
पर	parr
गया	gayaa
`;
  const settings = { beam: 4, maxDecodingLength: 96 };

  it('parses a well-formed table', () => {
    expect([...parseWordCache(ok, sha, settings)!.entries()]).toEqual([
      ['पर', 'parr'],
      ['गया', 'gayaa'],
    ]);
    expect(parseWordCache(ok.replaceAll('\n', '\r\n'), sha, settings)!.size).toBe(2);
  });

  it('refuses tables for another model, other settings, wrong counts or broken lines', () => {
    expect(parseWordCache(ok, 'b'.repeat(64), settings)).toBeNull();
    expect(parseWordCache(ok, sha, { beam: 1, maxDecodingLength: 96 })).toBeNull();
    expect(parseWordCache(ok.replace('count=2', 'count=3'), sha, settings)).toBeNull();
    expect(parseWordCache(ok + 'broken line\n', sha, settings)).toBeNull();
    expect(parseWordCache('hello\n', sha, settings)).toBeNull();
    expect(parseWordCache('', sha, settings)).toBeNull();
  });
});

describe('IndicXlit worker protocol', () => {
  function stubModel(delayWords = 0): IndicXlit {
    const transliterate = (words: string[]): string[] => {
      void delayWords;
      return words.map((w) => `<${w}>`);
    };
    return {
      info: { format: 'test', binBytes: 1, kernel: 'js', loadMs: 0 } as IndicXlitInfo,
      transliterate,
      transliterateAsync: async (words) => transliterate(words),
      dispose: () => undefined,
    };
  }

  it('drops a cancel that arrives after its conversion finished (no stale ids are kept)', async () => {
    const posted: WorkerResponse[] = [];
    const handle = createWorkerHandler((m) => posted.push(m), { loader: async () => stubModel() });
    await handle({ id: 1, type: 'load', base: '/m/' });
    await handle({ id: 2, type: 'convert', words: ['क'] });
    expect(posted.some((m) => m.id === 2 && m.type === 'converted')).toBe(true);
    for (let i = 0; i < 50; i++) await handle({ id: 100 + i, type: 'cancel', target: 2 });
    await handle({ id: 3, type: 'cancel', target: 999 }); // never existed
    expect(handle.inspect()).toEqual({ inFlight: 0, cancelled: 0 });
  });

  function loopbackWorker(
    loader: () => Promise<IndicXlit>,
    clock: () => number,
    posted: WorkerResponse[],
  ): WorkerLike {
    let worker!: WorkerLike;
    const handler = createWorkerHandler(
      (message) => {
        posted.push(message);
        queueMicrotask(() => worker.onmessage?.({ data: message }));
      },
      {
        loader,
        now: clock,
        yieldToEventLoop: () => new Promise((resolve) => setTimeout(resolve, 0)),
      },
    );
    worker = {
      postMessage: (message: WorkerRequest) => {
        queueMicrotask(() => void handler(message));
      },
      terminate: () => undefined,
      onmessage: null,
      onerror: null,
    };
    return worker;
  }

  function loopback(
    loader: () => Promise<IndicXlit>,
    clock: () => number = () => performance.now(),
    workers = 1,
  ) {
    const posted: WorkerResponse[] = [];
    const client = new IndicXlitClient({
      workers,
      factory: () => loopbackWorker(loader, clock, posted),
    });
    return { client, posted };
  }

  it('loads, converts and reports download progress', async () => {
    const { client } = loopback(async () => stubModel());
    const info = await client.load('/models/indicxlit/');
    expect(info.format).toBe('test');
    expect(client.isLoaded).toBe(true);
    expect(await client.transliterate(['नमस्ते', 'भारत', 'नमस्ते'])).toEqual([
      '<नमस्ते>',
      '<भारत>',
      '<नमस्ते>',
    ]);
  });

  it('refuses to convert before loading', async () => {
    const { client } = loopback(async () => stubModel());
    await expect(client.transliterate(['x'])).rejects.toThrow(/load\(\)/);
  });

  it('reports a failing load as an error and stays unloaded', async () => {
    const { client } = loopback(async () => {
      throw new Error('cannot fetch indicxlit.json (404)');
    });
    await expect(client.load('/missing/')).rejects.toThrow(/404/);
    expect(client.isLoaded).toBe(false);
  });

  it('cancels a long conversion between slices', async () => {
    let t = 0;
    const model = stubModel();
    const { client } = loopback(
      async () => model,
      () => (t += 30),
    ); // every word "takes" longer than a slice
    await client.load('/models/indicxlit/');
    const controller = new AbortController();
    const words = Array.from({ length: 500 }, (_, i) => `w${i}`);
    const progress: number[] = [];
    const promise = client.transliterate(words, {
      signal: controller.signal,
      onProgress: (done) => progress.push(done),
    });
    setTimeout(() => controller.abort(), 5);
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
    expect(progress.length).toBeGreaterThan(0);
    expect(progress[progress.length - 1]).toBeLessThan(500);
  });

  it('rejects an already aborted request without touching the worker', async () => {
    const { client, posted } = loopback(async () => stubModel());
    await client.load('/models/indicxlit/');
    const before = posted.length;
    const controller = new AbortController();
    controller.abort();
    await expect(client.transliterate(['x'], { signal: controller.signal })).rejects.toMatchObject({
      name: 'AbortError',
    });
    expect(posted.length).toBe(before);
  });

  it('shares a long list between several workers and keeps the order, including repeated words', async () => {
    const { client, posted } = loopback(async () => stubModel(), undefined, 3);
    await client.load('/models/indicxlit/');
    expect(client.workers).toBe(3);
    const words = Array.from({ length: 60 }, (_, i) => `w${i % 40}`);
    const out = await client.transliterate(words);
    expect(out).toEqual(words.map((w) => `<${w}>`));
    const conversions = posted.filter((m) => m.type === 'converted').length;
    expect(conversions).toBeGreaterThan(1); // more than one chunk went out
    expect(posted.filter((m) => m.type === 'loaded').length).toBe(3);
  });

  it('can abort a pooled conversion', async () => {
    let t = 0;
    const { client } = loopback(
      async () => stubModel(),
      () => (t += 30),
      2,
    );
    await client.load('/models/indicxlit/');
    const controller = new AbortController();
    const words = Array.from({ length: 800 }, (_, i) => `w${i}`);
    const promise = client.transliterate(words, { signal: controller.signal });
    setTimeout(() => controller.abort(), 5);
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('dispose terminates the worker and a new load starts fresh', async () => {
    const { client } = loopback(async () => stubModel());
    await client.load('/models/indicxlit/');
    client.dispose();
    expect(client.isLoaded).toBe(false);
    await expect(client.transliterate(['x'])).rejects.toThrow(/load\(\)/);
    await client.load('/models/indicxlit/');
    expect(await client.transliterate(['x'])).toEqual(['<x>']);
  });
});
