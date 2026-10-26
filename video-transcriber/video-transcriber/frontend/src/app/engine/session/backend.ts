/**
 * The storage the SessionStore sits on: four key-value object stores and an atomic multi-write. The real one is
 * IndexedDB (indexeddb-backend.ts); specs use MemoryBackend, which copies values the way IndexedDB does
 * (structured clone; Blobs by reference) so that a test cannot pass by mutating a stored object in place.
 */

/** jobs: job record without segments; segments: Segment[] per job; media: source Blob per job; meta: the session */
export type StoreName = 'jobs' | 'segments' | 'media' | 'meta';
export const STORE_NAMES: readonly StoreName[] = ['jobs', 'segments', 'media', 'meta'];

export type WriteOp =
  | { store: StoreName; key: string; value: unknown }
  | { store: StoreName; key: string; delete: true };

export interface SessionBackend {
  get<T>(store: StoreName, key: string): Promise<T | undefined>;
  getAll<T>(store: StoreName): Promise<T[]>;
  /** all ops in one transaction: either every op lands or none */
  write(ops: WriteOp[]): Promise<void>;
  /** empties every store */
  clear(): Promise<void>;
  close(): void;
}

function copy<T>(v: T): T {
  if (typeof Blob !== 'undefined' && v instanceof Blob) return v;
  if (v === undefined || v === null || typeof v !== 'object') return v;
  return typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v));
}

export class MemoryBackend implements SessionBackend {
  private readonly stores = new Map<StoreName, Map<string, unknown>>(
    STORE_NAMES.map((n) => [n, new Map<string, unknown>()]),
  );
  /** set to make the next write fail (quota, a closed database) */
  failNextWrite: Error | null = null;
  closed = false;

  async get<T>(store: StoreName, key: string): Promise<T | undefined> {
    return copy(this.stores.get(store)!.get(key) as T | undefined);
  }

  async getAll<T>(store: StoreName): Promise<T[]> {
    return [...this.stores.get(store)!.values()].map((v) => copy(v as T));
  }

  async write(ops: WriteOp[]): Promise<void> {
    if (this.failNextWrite) {
      const e = this.failNextWrite;
      this.failNextWrite = null;
      throw e;
    }
    const staged = ops.map((op) => ('delete' in op ? op : { ...op, value: copy(op.value) }));
    for (const op of staged) {
      const s = this.stores.get(op.store)!;
      if ('delete' in op) s.delete(op.key);
      else s.set(op.key, op.value);
    }
  }

  async clear(): Promise<void> {
    for (const s of this.stores.values()) s.clear();
  }

  close(): void {
    this.closed = true;
  }

  /** test helper: how many records a store holds */
  size(store: StoreName): number {
    return this.stores.get(store)!.size;
  }
}
