/**
 * SessionBackend over IndexedDB: database 'tv-session', version 1, four object stores with out-of-line string
 * keys (see backend.ts). Exercised by the real-browser check, not by the jsdom specs (no IndexedDB there).
 */
import { MemoryBackend, STORE_NAMES, SessionBackend, StoreName, WriteOp } from './backend';

export const DB_NAME = 'tv-session';
export const DB_VERSION = 1;
/** Opening the database normally takes milliseconds; one that has not opened by now is not going to (a browser bug). */
export const OPEN_TIMEOUT_MS = 10_000;

export interface OpenSessionBackendOptions {
  /** default: globalThis.indexedDB; null = there is none */
  factory?: IDBFactory | null;
  timeoutMs?: number;
  /** told why the session lives in memory (for the Logs page) */
  onFallback?: (why: string) => void;
}

/**
 * The session's storage: IndexedDB, or memory where the browser has none or will not open it (Firefox private windows
 * before version 115, "block all site data", some in-app browsers) or the open never finishes. Without this, every
 * call of the page failed with "Something went wrong" and the job page retried forever; in memory the site works for
 * as long as the tab is open (a reload starts empty, as a private window would anyway).
 */
export async function openSessionBackend(o: OpenSessionBackendOptions = {}): Promise<SessionBackend> {
  let factory: IDBFactory | null | undefined;
  try {
    factory = o.factory === undefined ? (globalThis as { indexedDB?: IDBFactory }).indexedDB : o.factory;
  } catch {
    factory = null; // reading window.indexedDB itself throws where site data is blocked
  }
  if (!factory) {
    o.onFallback?.('this browser has no IndexedDB');
    return new MemoryBackend();
  }
  let timer: ReturnType<typeof setTimeout> | undefined;
  let timedOut = false;
  const opening = IndexedDbBackend.open(factory);
  try {
    return await Promise.race([
      opening,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          timedOut = true;
          reject(new Error(`IndexedDB did not open within ${Math.round((o.timeoutMs ?? OPEN_TIMEOUT_MS) / 1000)} s`));
        }, o.timeoutMs ?? OPEN_TIMEOUT_MS);
      }),
    ]);
  } catch (e) {
    // a late open is closed again: this page keeps its session in memory now
    if (timedOut) opening.then((b) => b.close()).catch(() => undefined);
    const err = e as { name?: string; message?: string } | null;
    o.onFallback?.(`${err?.name ?? 'Error'}: ${err?.message ?? e}`);
    return new MemoryBackend();
  } finally {
    clearTimeout(timer);
  }
}

function done(req: IDBRequest): Promise<unknown> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function finished(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
  });
}

export class IndexedDbBackend implements SessionBackend {
  private constructor(private readonly db: IDBDatabase) {
    // another tab upgrading the schema: let it, this tab reopens on its next load
    db.onversionchange = () => db.close();
  }

  static async open(factory: IDBFactory = indexedDB, name = DB_NAME): Promise<IndexedDbBackend> {
    const req = factory.open(name, DB_VERSION); // may throw (SecurityError): the caller's promise rejects
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of STORE_NAMES) if (!db.objectStoreNames.contains(s)) db.createObjectStore(s);
    };
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('IndexedDB open blocked by another tab'));
    });
    return new IndexedDbBackend(db);
  }

  async get<T>(store: StoreName, key: string): Promise<T | undefined> {
    const tx = this.db.transaction(store, 'readonly');
    return (await done(tx.objectStore(store).get(key))) as T | undefined;
  }

  async getAll<T>(store: StoreName): Promise<T[]> {
    const tx = this.db.transaction(store, 'readonly');
    return (await done(tx.objectStore(store).getAll())) as T[];
  }

  async write(ops: WriteOp[]): Promise<void> {
    if (!ops.length) return;
    const names = [...new Set(ops.map((o) => o.store))];
    const tx = this.db.transaction(names, 'readwrite');
    const end = finished(tx);
    for (const op of ops) {
      const s = tx.objectStore(op.store);
      if ('delete' in op) s.delete(op.key);
      else s.put(op.value, op.key);
    }
    await end;
  }

  async clear(): Promise<void> {
    const tx = this.db.transaction([...STORE_NAMES], 'readwrite');
    const end = finished(tx);
    for (const s of STORE_NAMES) tx.objectStore(s).clear();
    await end;
  }

  close(): void {
    this.db.close();
  }
}
