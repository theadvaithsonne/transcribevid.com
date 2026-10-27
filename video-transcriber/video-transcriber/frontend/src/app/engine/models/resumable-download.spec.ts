import { CancelledError } from '../asr/types';
import {
  blobBytes,
  deleteAllDownloads,
  discardDownloads,
  DownloadError,
  DownloadOptions,
  DownloadProgress,
  downloadResumable,
  FetchLike,
  MemoryPartStore,
  NetworkStatus,
  parseContentRange,
  PartStore,
  pruneDownloads,
  savedDownload,
  Watchdog,
} from './resumable-download';

// The resumable downloader against a fake server that serves byte ranges and can drop the connection mid-body, ignore
// Range (200), send a wrong Content-Range, stall, answer with an HTTP error or change the file; parts live in a
// MemoryPartStore (jsdom has no IndexedDB), the waits between attempts go through an injected sleep. Nothing is
// downloaded.

// jsdom's Blob cannot be read back and `new Response(blob)` turns it into the text "[object Blob]"; Node's own Blob
// behaves like a browser's, so these tests use it.
let jsdomBlob: typeof Blob;
beforeAll(() => {
  jsdomBlob = globalThis.Blob;
  const node = (
    globalThis as unknown as { process: { getBuiltinModule(m: string): { Blob: typeof Blob } } }
  ).process;
  globalThis.Blob = node.getBuiltinModule('node:buffer').Blob;
});
afterAll(() => {
  globalThis.Blob = jsdomBlob;
});

const fileBytes = (n: number, seed = 1) =>
  Uint8Array.from({ length: n }, (_, i) => (i * 31 + seed * 7 + (i >> 8)) & 0xff);
let nextId = 0;
const newUrl = () => `https://huggingface.co/test/repo/resolve/main/file-${++nextId}.onnx`;

/** What one request does differently (consumed in order, one per request). */
interface Fault {
  /** fetch() rejects as on a dead connection */
  fail?: boolean;
  status?: number;
  /** the body errors after this many bytes of the answer */
  dropAfter?: number;
  /** runs when the body errors */
  then?: () => void;
  ignoreRange?: boolean;
  contentRange?: string;
  stall?: 'headers' | 'body';
  etag?: string;
}

function body(
  bytes: Uint8Array,
  piece: number,
  f: Fault,
  signal: AbortSignal | undefined,
): ReadableStream<Uint8Array> {
  let at = 0;
  return new ReadableStream<Uint8Array>({
    start(c) {
      // like a real fetch: aborting the request errors its body
      signal?.addEventListener('abort', () => {
        try {
          c.error(new DOMException('The operation was aborted.', 'AbortError'));
        } catch {
          // already closed
        }
      });
    },
    pull(c): Promise<void> | undefined {
      if (f.stall === 'body') return new Promise<void>(() => undefined);
      if (f.dropAfter !== undefined && at >= f.dropAfter) {
        f.then?.();
        c.error(new TypeError('network error'));
      } else if (at >= bytes.length) {
        c.close();
      } else {
        const end = Math.min(bytes.length, at + piece, f.dropAfter ?? Infinity);
        c.enqueue(bytes.slice(at, end));
        at = end;
      }
      return undefined;
    },
  });
}

class FakeServer {
  /** The Range header of every request ('' = none). */
  readonly requests: string[] = [];
  faults: Fault[] = [];
  ranges = true;
  exposeContentRange = true;
  etag: string | null = '"v1"';
  piece = 256;

  constructor(public file: Uint8Array) {}

  readonly fetch: FetchLike = async (_url, init) => {
    const range = init?.headers?.['Range'] ?? '';
    this.requests.push(range);
    const f = this.faults.shift() ?? {};
    if (f.fail) throw new TypeError('Failed to fetch');
    if (f.status) return new Response('error', { status: f.status });
    if (f.stall === 'headers') {
      return new Promise<Response>((_, reject) =>
        init?.signal?.addEventListener('abort', () =>
          reject(new DOMException('The operation was aborted.', 'AbortError')),
        ),
      );
    }
    const headers: Record<string, string> = { 'content-type': 'application/octet-stream' };
    const etag = f.etag ?? this.etag;
    if (etag) headers['etag'] = etag;
    const len = this.file.length;
    const m = /^bytes=(\d+)-(\d*)$/.exec(range);
    if (!m || !this.ranges || f.ignoreRange) {
      headers['content-length'] = String(len);
      return new Response(body(this.file, this.piece, f, init?.signal), { status: 200, headers });
    }
    const start = Number(m[1]);
    if (start >= len)
      return new Response(null, { status: 416, headers: { 'content-range': `bytes */${len}` } });
    const end = Math.min(m[2] ? Number(m[2]) : len - 1, len - 1);
    headers['content-length'] = String(end - start + 1);
    if (f.contentRange) headers['content-range'] = f.contentRange;
    else if (this.exposeContentRange) headers['content-range'] = `bytes ${start}-${end}/${len}`;
    return new Response(body(this.file.slice(start, end + 1), this.piece, f, init?.signal), {
      status: 206,
      headers,
    });
  };
}

/** A browser whose connection the test switches off and on. */
function fakeNetwork(up = true) {
  let waiters: Array<() => void> = [];
  const status: NetworkStatus = {
    online: () => up,
    waitOnline: (signal) =>
      new Promise<void>((resolve, reject) => {
        if (up) return resolve();
        waiters.push(resolve);
        signal?.addEventListener('abort', () => reject(new CancelledError()));
      }),
  };
  return {
    status,
    set(on: boolean) {
      up = on;
      if (on) {
        waiters.forEach((w) => w());
        waiters = [];
      }
    },
  };
}

/** Quick settings: 1 KiB parts, every read reported, the waits recorded instead of slept. */
function setup(file = fileBytes(10_000), store: PartStore = new MemoryPartStore()) {
  const server = new FakeServer(file);
  const sleeps: number[] = [];
  const events: DownloadProgress[] = [];
  const o: DownloadOptions = {
    store,
    fetchImpl: server.fetch,
    chunkBytes: 1024,
    progressMs: 0,
    sleep: async (ms) => {
      sleeps.push(ms);
    },
    onProgress: (p) => events.push(p),
  };
  return { server, store, sleeps, events, o, url: newUrl() };
}

const bytesOf = async (b: Blob) => blobBytes(b);
const notes = (events: DownloadProgress[]) =>
  events.map((e) => e.note).filter((n): n is string => !!n);

/** First visit: downloads until `stopAt` bytes, then the tab goes away (the signal stands in for the reload). */
async function firstVisit(url: string, o: DownloadOptions, stopAt: number) {
  const ac = new AbortController();
  const e = await downloadResumable(url, {
    ...o,
    signal: ac.signal,
    onProgress: (p) => {
      if (p.loaded >= stopAt) ac.abort();
    },
  }).catch((x: unknown) => x);
  expect(e).toBeInstanceOf(CancelledError);
}

describe('downloadResumable', () => {
  it('downloads with a Range request, saves 1 KiB parts and returns the whole file', async () => {
    const { server, store, events, o, url } = setup();
    const blob = await downloadResumable(url, o);
    expect(await bytesOf(blob)).toEqual(server.file);
    expect(blob.type).toBe('application/octet-stream');
    expect(server.requests).toEqual(['bytes=0-']);
    expect(await store.parts(url)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(await store.meta(url)).toMatchObject({
      size: 10_000,
      chunkBytes: 1024,
      validator: '"v1"',
    });
    const loaded = events.map((e) => e.loaded);
    expect([...loaded].sort((a, b) => a - b)).toEqual(loaded); // monotonic
    expect(events.at(-1)).toMatchObject({ loaded: 10_000, total: 10_000, resumedBytes: 0 });
    expect(notes(events)).toEqual([]);
  });

  it('continues after a reload where the saved parts end, with the saved bytes in the progress', async () => {
    const { server, store, o, url } = setup();
    await firstVisit(url, o, 2500); // parts 0 and 1 saved, 512 bytes of part 2 only in memory
    expect(await store.parts(url)).toEqual([0, 1]);
    expect(await savedDownload(url, store)).toEqual({ savedBytes: 2048, size: 10_000 });

    // the reloaded page: a new call, the same store
    const events: DownloadProgress[] = [];
    const blob = await downloadResumable(url, { ...o, onProgress: (p) => events.push(p) });
    expect(await bytesOf(blob)).toEqual(server.file);
    expect(server.requests).toEqual(['bytes=0-', 'bytes=2048-9999']);
    expect(events[0]).toMatchObject({
      loaded: 2048,
      total: 10_000,
      resumedBytes: 2048,
      continuing: true,
    });
    expect(events[0].note).toMatch(/^Continuing the download \(.* already saved\)$/);
    const loaded = events.map((e) => e.loaded);
    expect([...loaded].sort((a, b) => a - b)).toEqual(loaded);
    expect(events.at(-1)!.loaded).toBe(10_000);
  });

  it('retries a dropped connection from the byte where it stopped (the cut-off part is not fetched again)', async () => {
    const { server, sleeps, events, o, url } = setup();
    server.faults = [{ dropAfter: 1500 }];
    const blob = await downloadResumable(url, o);
    expect(await bytesOf(blob)).toEqual(server.file);
    expect(server.requests).toEqual(['bytes=0-', 'bytes=1500-9999']);
    expect(sleeps).toEqual([1000]);
    expect(notes(events)).toEqual(['Connection lost. Retrying in 1 s…', 'Reconnecting…']);
    expect(events.at(-1)!.note).toBeUndefined();
  });

  it('backs off 1, 2, 4 ... 30 s, gives up after 8 failed attempts in a row and keeps the parts for "Try again"', async () => {
    const { server, store, sleeps, events, o, url } = setup();
    server.faults = [{ dropAfter: 2048 }, ...Array.from({ length: 7 }, () => ({ fail: true }))];
    const e = (await downloadResumable(url, o).catch((x: unknown) => x)) as DownloadError;
    expect(e).toBeInstanceOf(DownloadError);
    expect(e.code).toBe('network');
    expect(e.message).toMatch(/Failed to fetch \(8 failed attempts in a row/);
    expect(server.requests.length).toBe(8);
    // the first retry follows an attempt that brought bytes, so the count starts again at 1
    const firstOfEach = notes(events).filter(
      (n, i, all) => /Retrying/.test(n) && !/Retrying/.test(all[i - 1] ?? ''),
    );
    expect(firstOfEach.map((n) => Number(/in (\d+) s/.exec(n)![1]))).toEqual([
      1, 2, 4, 8, 16, 30, 30,
    ]);
    expect(sleeps.reduce((a, b) => a + b, 0)).toBe(91_000);
    expect(Math.max(...sleeps)).toBe(1000); // a countdown in whole seconds
    expect(await store.parts(url)).toEqual([0, 1]);

    const again = await downloadResumable(url, o);
    expect(await bytesOf(again)).toEqual(server.file);
    expect(server.requests.at(-1)).toBe('bytes=2048-9999');
  });

  it('reads a 200 (Range ignored) from the start and still saves and resumes by parts', async () => {
    const { server, store, o, url } = setup();
    server.ranges = false;
    server.faults = [{ dropAfter: 3000 }];
    const blob = await downloadResumable(url, o);
    expect(await bytesOf(blob)).toEqual(server.file);
    expect(server.requests).toEqual(['bytes=0-', 'bytes=3000-']);
    expect((await store.meta(url))!.size).toBe(10_000); // the end of the body was the end of the file
  });

  it('retries a 206 whose Content-Range does not start where it asked', async () => {
    const { server, sleeps, o, url } = setup();
    server.faults = [{ contentRange: 'bytes 5-9999/10000' }];
    const blob = await downloadResumable(url, o);
    expect(await bytesOf(blob)).toEqual(server.file);
    expect(server.requests).toEqual(['bytes=0-', 'bytes=0-']);
    expect(sleeps).toEqual([1000]);
  });

  it('without a readable Content-Range takes the end of the body as the end of the file (also on a part boundary)', async () => {
    const { server, store, o, url } = setup();
    server.exposeContentRange = false;
    expect(await bytesOf(await downloadResumable(url, o))).toEqual(server.file);
    expect((await store.meta(url))!.size).toBe(10_000);

    // 2048 bytes, cut exactly after part 1: the retry gets 416 and that is the end
    const b = setup(fileBytes(2048, 3));
    b.server.exposeContentRange = false;
    b.server.faults = [{ dropAfter: 2048 }];
    expect(await bytesOf(await downloadResumable(b.url, b.o))).toEqual(b.server.file);
    expect(b.server.requests).toEqual(['bytes=0-', 'bytes=2048-']);
  });

  it('drops the saved parts when the file changed on the server (ETag or size)', async () => {
    const a = setup();
    await firstVisit(a.url, a.o, 2500);
    a.server.file = fileBytes(10_000, 2); // same size, other bytes, new ETag
    a.server.etag = '"v2"';
    expect(await bytesOf(await downloadResumable(a.url, a.o))).toEqual(a.server.file);
    expect(a.server.requests).toEqual(['bytes=0-', 'bytes=2048-9999', 'bytes=0-']);
    expect((await a.store.meta(a.url))!.validator).toBe('"v2"');

    const b = setup();
    b.server.etag = null;
    await firstVisit(b.url, b.o, 2500);
    b.server.file = fileBytes(12_000, 4); // no ETag at all, but another size
    expect(await bytesOf(await downloadResumable(b.url, b.o))).toEqual(b.server.file);
    expect(b.server.requests).toEqual(['bytes=0-', 'bytes=2048-9999', 'bytes=0-']);
  });

  it('trusts the ETag for one restart only (CDN servers that disagree on it cannot loop the download)', async () => {
    const { server, o, url } = setup();
    server.faults = [
      { dropAfter: 1500, etag: '"a"' },
      { etag: '"b"' },
      { dropAfter: 1500, etag: '"a"' },
      { etag: '"b"' },
    ];
    expect(await bytesOf(await downloadResumable(url, o))).toEqual(server.file);
    expect(server.requests).toEqual(['bytes=0-', 'bytes=1500-9999', 'bytes=0-', 'bytes=1500-9999']);
  });

  it('refuses a pinned size the server does not have, and does not keep the parts', async () => {
    const { store, o, url } = setup();
    const e = (await downloadResumable(url, { ...o, size: 9999 }).catch(
      (x: unknown) => x,
    )) as DownloadError;
    expect(e).toBeInstanceOf(DownloadError);
    expect(e.code).toBe('size');
    expect(e.message).toMatch(/has 10000 bytes, expected 9999/);
    expect(await store.parts(url)).toEqual([]);
    // the pinned size is the total from the first report on
    const events: DownloadProgress[] = [];
    const ok = setup();
    await downloadResumable(ok.url, { ...ok.o, size: 10_000, onProgress: (p) => events.push(p) });
    expect(events.every((p) => p.total === 10_000)).toBe(true);
  });

  it('shows the estimate as the total until the server says the size', async () => {
    const { events, o, url } = setup();
    await downloadResumable(url, { ...o, estimatedSize: 12_000 });
    expect(events[0]).toMatchObject({ loaded: 0, total: 12_000 });
    expect(events.at(-1)).toMatchObject({ loaded: 10_000, total: 10_000 });
  });

  it('fails at once on 404 and retries 503 with a note', async () => {
    const a = setup();
    a.server.faults = [{ status: 404 }];
    const e = (await downloadResumable(a.url, a.o).catch((x: unknown) => x)) as DownloadError;
    expect(e).toMatchObject({ code: 'http', status: 404 });
    expect(a.server.requests.length).toBe(1);

    const b = setup();
    b.server.faults = [{ status: 503 }];
    expect(await bytesOf(await downloadResumable(b.url, b.o))).toEqual(b.server.file);
    expect(notes(b.events)[0]).toBe('The download server is busy (HTTP 503). Retrying in 1 s…');
  });

  it('aborts a stalled request (no byte for stallMs) and retries', async () => {
    for (const stall of ['headers', 'body'] as const) {
      const { server, events, o, url } = setup();
      server.faults = [{ stall }];
      expect(await bytesOf(await downloadResumable(url, { ...o, stallMs: 40 }))).toEqual(
        server.file,
      );
      expect(server.requests.length).toBe(2);
      expect(notes(events)[0]).toBe('The download stalled. Retrying in 1 s…');
    }
  });

  it('waits for the connection while offline without using up attempts', async () => {
    const net = fakeNetwork(false);
    const { server, events, sleeps, o, url } = setup();
    const p = downloadResumable(url, { ...o, network: net.status, maxAttempts: 1 });
    await new Promise((r) => setTimeout(r, 10));
    expect(server.requests).toEqual([]);
    expect(notes(events)).toEqual(['Waiting for the internet connection…']);
    net.set(true);
    // the connection goes away mid-body: wait again, the attempt does not count (maxAttempts 1 would give up)
    const reconnectLater = () => {
      net.set(false);
      setTimeout(() => net.set(true), 20);
    };
    server.faults = [{ dropAfter: 1500, then: reconnectLater }];
    expect(await bytesOf(await p)).toEqual(server.file);
    expect(sleeps).toEqual([]);
    expect(notes(events).filter((n) => n.startsWith('Waiting')).length).toBe(2);
  });

  it('stops at once on cancel (also during a hung request or a wait) and keeps the parts', async () => {
    const { server, store, o, url } = setup();
    server.faults = [{ dropAfter: 2048 }, { stall: 'headers' }];
    const ac = new AbortController();
    const p = downloadResumable(url, {
      ...o,
      signal: ac.signal,
      sleep: undefined,
      retryBaseMs: 1,
      stallMs: 60_000,
    });
    await new Promise((r) => setTimeout(r, 30));
    const t0 = Date.now();
    ac.abort();
    await expect(p).rejects.toBeInstanceOf(CancelledError);
    expect(Date.now() - t0).toBeLessThan(500);
    expect(await store.parts(url)).toEqual([0, 1]);

    const waiting = setup();
    const net = fakeNetwork(false);
    const ac2 = new AbortController();
    const q = downloadResumable(waiting.url, {
      ...waiting.o,
      network: net.status,
      signal: ac2.signal,
    });
    setTimeout(() => ac2.abort(), 5);
    await expect(q).rejects.toBeInstanceOf(CancelledError);
  });

  it('lets a newer call for the same file take over an older one', async () => {
    const { server, o, url } = setup();
    server.faults = [{ stall: 'headers' }];
    const older = downloadResumable(url, o); // a cancelled job whose download was left running (no signal)
    while (!server.requests.length) await new Promise((r) => setTimeout(r, 1));
    const newer = downloadResumable(url, o);
    await expect(older).rejects.toBeInstanceOf(CancelledError);
    expect(await bytesOf(await newer)).toEqual(server.file);
  });

  it('keeps the parts in memory when the store cannot (quota, private mode)', async () => {
    const mem = new MemoryPartStore();
    const full = async () => {
      throw new DOMException('quota', 'QuotaExceededError');
    };
    const failing: PartStore = {
      meta: (u) => mem.meta(u),
      parts: (u) => mem.parts(u),
      part: (u, i) => mem.part(u, i),
      save: full,
      saveMeta: full,
      remove: (u) => mem.remove(u),
      list: () => mem.list(),
      clear: () => mem.clear(),
    };
    const { server, o, url } = setup(fileBytes(5000), failing);
    expect(await bytesOf(await downloadResumable(url, o))).toEqual(server.file);
    expect(await mem.parts(url)).toEqual([]);
  });
});

describe('saved parts housekeeping', () => {
  async function saved(store: PartStore, url: string, parts: number, updated: number) {
    for (let i = 0; i < parts; i++) {
      await store.save(
        { url, size: parts * 1024, chunkBytes: 1024, validator: null, type: null, updated },
        i,
        new Blob([new Uint8Array(1024)]),
      );
    }
  }

  it('savedDownload / discardDownloads / deleteAllDownloads / pruneDownloads', async () => {
    const store = new MemoryPartStore();
    const day = 24 * 3600 * 1000;
    await saved(store, 'https://huggingface.co/a/resolve/main/x.onnx', 3, 0);
    await saved(store, 'https://huggingface.co/a/resolve/main/y.onnx', 1, 20 * day);
    await saved(store, 'https://huggingface.co/b/resolve/main/x.onnx', 2, 20 * day);
    expect(await savedDownload('https://huggingface.co/a/resolve/main/x.onnx', store)).toEqual({
      savedBytes: 3072,
      size: 3072,
    });
    expect(await savedDownload('https://nowhere/z', store)).toEqual({ savedBytes: 0, size: null });

    await pruneDownloads(store, 21 * day); // older than 14 days: the first one
    expect((await store.list()).map((m) => m.url)).toEqual([
      'https://huggingface.co/a/resolve/main/y.onnx',
      'https://huggingface.co/b/resolve/main/x.onnx',
    ]);
    expect(await discardDownloads((u) => u.startsWith('https://huggingface.co/a/'), store)).toBe(
      1024,
    );
    expect((await store.list()).length).toBe(1);
    expect(await deleteAllDownloads(store)).toBe(true);
    expect(await store.list()).toEqual([]);
  });

  it('parses Content-Range', () => {
    expect(parseContentRange('bytes 0-8388607/92234567')).toEqual({
      start: 0,
      end: 8388607,
      size: 92234567,
    });
    expect(parseContentRange('bytes 10-19/*')).toEqual({ start: 10, end: 19, size: null });
    expect(parseContentRange('bytes 20-10/100')).toBeNull();
    expect(parseContentRange('bytes 0-100/100')).toBeNull();
    expect(parseContentRange(null)).toBeNull();
    expect(parseContentRange('items 0-1/2')).toBeNull();
  });
});

describe('Watchdog (the stall timer of one request)', () => {
  // a clock of its own: the specs move it without the timers (a frozen tab) or together with them
  let t = 0;
  const now = () => t;
  beforeEach(() => {
    vi.useFakeTimers();
    t = 1_000_000;
  });
  afterEach(() => vi.useRealTimers());
  /** `ms` of real time: the clock and the timers move together */
  const pass = (ms: number) => {
    for (let i = 0; i < ms / 50; i++) {
      t += 50;
      vi.advanceTimersByTime(50);
    }
  };

  it('fires after `ms` without a byte, not while bytes keep coming or a part is being written', () => {
    const stall = vi.fn();
    const w = new Watchdog(1000, stall, now);
    pass(900);
    w.feed();
    pass(900);
    expect(stall).not.toHaveBeenCalled();
    w.pause();
    pass(3000);
    expect(stall).not.toHaveBeenCalled();
    w.resume();
    pass(900);
    expect(stall).not.toHaveBeenCalled();
    pass(400); // (the interval ticks every 250 ms)
    expect(stall).toHaveBeenCalledTimes(1);
    expect(w.fired).toBe(true);
    w.stop();
  });

  it('a tab that was frozen in the background is not a stalled connection: the window starts again', () => {
    const stall = vi.fn();
    const w = new Watchdog(1000, stall, now);
    pass(500);
    t += 60_000; // the phone froze the page for a minute: the clock moved, no timer ran
    vi.advanceTimersByTime(250); // the first tick after it wakes
    expect(stall).not.toHaveBeenCalled();
    pass(800); // the bytes that were waiting are read now
    w.feed();
    pass(800);
    expect(stall).not.toHaveBeenCalled();
    pass(400); // and a connection that is really dead is still caught
    expect(stall).toHaveBeenCalledTimes(1);
    w.stop();
  });
});
