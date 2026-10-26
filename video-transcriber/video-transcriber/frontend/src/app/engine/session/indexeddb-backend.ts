/**
 * SessionBackend over IndexedDB: database 'tv-session', version 1, four object stores with out-of-line string
 * keys (see backend.ts). Exercised by the real-browser check, not by the jsdom specs (no IndexedDB there).
 */
import { STORE_NAMES, SessionBackend, StoreName, WriteOp } from './backend';

export const DB_NAME = 'tv-session';
export const DB_VERSION = 1;

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
    const req = factory.open(name, DB_VERSION);
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
