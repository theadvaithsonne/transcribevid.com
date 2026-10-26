/**
 * Main-thread handle on the converter running in its own Web Worker(s).
 *
 *   const client = new IndicXlitClient({ workers: recommendedWorkers() });
 *   await client.load('/models/indicxlit/', (received, total) => ...);   // downloads ~12 MB once, only when needed
 *   const roman = await client.transliterate(['नमस्ते'], { signal });     // same shape as IndicXlit.transliterate
 *   client.dispose();                                                    // terminates the workers
 *
 * It satisfies NeuralConverter (hinglish.ts), so `convertSegment(segment, 'auto', { neural: client })` just works.
 * With more than one worker, a long list of words is split into small chunks that the workers take in turn; the model
 * is downloaded once (the other workers read it from the HTTP cache) and each worker holds its own ~30 MB copy.
 */
import type { IndicXlitInfo } from './indicxlit';
import type { NeuralConverter } from './hinglish';
import type { WorkerRequest, WorkerResponse } from './indicxlit-worker-core';

export interface WorkerLike {
  postMessage(message: WorkerRequest): void;
  terminate(): void;
  onmessage: ((event: { data: WorkerResponse }) => void) | null;
  onerror: ((event: { message?: string }) => void) | null;
}

export interface ClientOptions {
  /** Number of worker threads (default 1). */
  workers?: number;
  /** Replaces the real Worker (tests, custom bundling). */
  factory?: () => WorkerLike;
}

export interface ClientConvertOptions {
  beamSize?: number;
  /** Aborting rejects the promise with an AbortError and stops the workers at the next slice. */
  signal?: AbortSignal;
  onProgress?: (done: number, total: number) => void;
}

/** A sensible pool size for this device: half the logical cores, 1 to 4. */
export function recommendedWorkers(): number {
  const cores =
    (globalThis.navigator as { hardwareConcurrency?: number } | undefined)?.hardwareConcurrency ??
    2;
  return Math.max(1, Math.min(4, Math.floor(cores / 2)));
}

interface Pending {
  resolve: (message: WorkerResponse) => void;
  reject: (error: Error) => void;
  onProgress?: (message: WorkerResponse) => void;
}

/** One worker and its outstanding requests. */
class Slot {
  private worker: WorkerLike | null = null;
  private nextId = 1;
  private readonly pending = new Map<number, Pending>();
  loaded = false;

  constructor(
    private readonly factory: () => WorkerLike,
    private readonly onCrash: (error: Error) => void,
  ) {}

  private ensureWorker(): WorkerLike {
    if (this.worker) return this.worker;
    const worker = this.factory();
    worker.onmessage = (event) => this.onMessage(event.data);
    worker.onerror = (event) =>
      this.onCrash(new Error(event.message ?? 'The converter worker crashed.'));
    this.worker = worker;
    return worker;
  }

  private onMessage(message: WorkerResponse): void {
    const entry = this.pending.get(message.id);
    if (!entry) return;
    if (message.type === 'progress' || message.type === 'convertProgress') {
      entry.onProgress?.(message);
      return;
    }
    this.pending.delete(message.id);
    if (message.type === 'error') {
      const error = new Error(message.message);
      error.name = message.name;
      entry.reject(error);
    } else {
      entry.resolve(message);
    }
  }

  request(build: (id: number) => WorkerRequest, onProgress?: (message: WorkerResponse) => void) {
    const id = this.nextId++;
    const promise = new Promise<WorkerResponse>((resolve, reject) => {
      this.pending.set(id, { resolve, reject, onProgress });
      this.ensureWorker().postMessage(build(id));
    });
    return { id, promise };
  }

  cancel(target: number): void {
    this.worker?.postMessage({ id: this.nextId++, type: 'cancel', target });
  }

  terminate(error: Error): void {
    for (const entry of this.pending.values()) entry.reject(error);
    this.pending.clear();
    this.worker?.terminate();
    this.worker = null;
    this.loaded = false;
  }
}

export class IndicXlitClient implements NeuralConverter {
  private readonly slots: Slot[];

  constructor(options: ClientOptions = {}) {
    const count = Math.max(1, Math.floor(options.workers ?? 1));
    const factory = options.factory ?? defaultFactory;
    this.slots = Array.from(
      { length: count },
      () => new Slot(factory, (error) => this.crash(error)),
    );
  }

  get isLoaded(): boolean {
    return this.slots[0].loaded;
  }

  get workers(): number {
    return this.slots.length;
  }

  private crash(error: Error): void {
    for (const slot of this.slots) slot.terminate(error);
  }

  private async loadSlot(
    slot: Slot,
    absolute: string,
    wordCache: boolean | undefined,
    onProgress?: (received: number, total: number) => void,
  ): Promise<IndicXlitInfo> {
    const { promise } = slot.request(
      (id) => ({ id, type: 'load', base: absolute, wordCache }),
      (m) => {
        if (m.type === 'progress') onProgress?.(m.received, m.total);
      },
    );
    const done = await promise;
    if (done.type !== 'loaded') throw new Error('Unexpected reply from the converter worker.');
    slot.loaded = true;
    return done.info;
  }

  /**
   * Download and prepare the model. Safe to call again; it replaces the loaded model.
   * `wordCache: false` ignores wordcache.tsv (every word then runs through the network).
   */
  async load(
    assetBaseUrl: string,
    onProgress?: (received: number, total: number) => void,
    options: { wordCache?: boolean } = {},
  ): Promise<IndicXlitInfo> {
    const absolute = new URL(assetBaseUrl, globalThis.location?.href ?? 'http://localhost/').href;
    // The first worker downloads the files; the others then find them in the HTTP cache.
    const info = await this.loadSlot(this.slots[0], absolute, options.wordCache, onProgress);
    await Promise.all(
      this.slots.slice(1).map((slot) => this.loadSlot(slot, absolute, options.wordCache)),
    );
    return info;
  }

  async transliterate(words: string[], options: ClientConvertOptions = {}): Promise<string[]> {
    if (!this.isLoaded) throw new Error('Call load() before transliterate().');
    if (options.signal?.aborted) throw abortError();
    // distinct words only, longest first so the slow ones start early
    const unique = [...new Set(words)];
    unique.sort((a, b) => b.length - a.length);
    const total = unique.length;
    const results = new Map<string, string>();
    const useSlots = this.slots.length > 1 && total > 8 ? this.slots : [this.slots[0]];
    const chunkSize =
      useSlots.length === 1
        ? Math.max(1, total)
        : Math.max(1, Math.min(32, Math.ceil(total / (useSlots.length * 4))));
    let next = 0;
    let done = 0;
    const inFlight: { slot: Slot; id: number }[] = [];
    const cancelAll = (): void => {
      for (const { slot, id } of inFlight) slot.cancel(id);
    };
    options.signal?.addEventListener('abort', cancelAll, { once: true });
    const runSlot = async (slot: Slot): Promise<void> => {
      while (next < total) {
        if (options.signal?.aborted) throw abortError();
        const chunk = unique.slice(next, next + chunkSize);
        next += chunk.length;
        let chunkDone = 0;
        const { id, promise } = slot.request(
          (rid) => ({ id: rid, type: 'convert', words: chunk, beamSize: options.beamSize }),
          (m) => {
            if (m.type === 'convertProgress') {
              done += m.done - chunkDone;
              chunkDone = m.done;
              options.onProgress?.(done, total);
            }
          },
        );
        inFlight.push({ slot, id });
        const reply = await promise;
        const at = inFlight.findIndex((x) => x.id === id && x.slot === slot);
        if (at >= 0) inFlight.splice(at, 1);
        if (reply.type === 'cancelled') throw abortError();
        if (reply.type !== 'converted')
          throw new Error('Unexpected reply from the converter worker.');
        done += chunk.length - chunkDone;
        options.onProgress?.(done, total);
        chunk.forEach((w, i) => results.set(w, reply.words[i]));
      }
    };
    try {
      await Promise.all(useSlots.map((slot) => runSlot(slot)));
    } catch (error) {
      cancelAll();
      throw error;
    } finally {
      options.signal?.removeEventListener('abort', cancelAll);
    }
    return words.map((w) => results.get(w) as string);
  }

  /** Terminate the workers and release the model. A new load() starts fresh ones. */
  dispose(): void {
    this.crash(new Error('The converter was disposed.'));
  }
}

function abortError(): Error {
  const error = new Error('Conversion aborted.');
  error.name = 'AbortError';
  return error;
}

function defaultFactory(): WorkerLike {
  return new Worker(new URL('./indicxlit.worker', import.meta.url), {
    type: 'module',
  }) as unknown as WorkerLike;
}
