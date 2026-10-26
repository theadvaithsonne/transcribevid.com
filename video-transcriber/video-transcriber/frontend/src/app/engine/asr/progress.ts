/**
 * Turns Transformers.js's per-file `progress_callback` events into one whole-model progress figure.
 * `from_pretrained` alone has no total; the engine / model manager seed the tracker with the file list
 * and sizes from `ModelRegistry` so the first event already knows the total.
 */
import { ProgressInfo } from './types';

/** The payload Transformers.js 4.3.1 passes to progress_callback. */
export interface LibraryProgressEvent {
  status: string;
  file?: string;
  name?: string;
  loaded?: number;
  total?: number;
  progress?: number;
}

export class ProgressTracker {
  private readonly perFile = new Map<string, { loaded: number; total: number }>();

  constructor(private readonly emit: (p: ProgressInfo) => void) {}

  /** Declares a file and its size up-front (size 0 = unknown). */
  expect(file: string, total: number): void {
    if (!this.perFile.has(file)) this.perFile.set(file, { loaded: 0, total });
  }

  get files(): string[] {
    return [...this.perFile.keys()];
  }

  get totals(): { loaded: number; total: number } {
    let loaded = 0;
    let total = 0;
    for (const v of this.perFile.values()) {
      loaded += v.loaded;
      total += v.total;
    }
    return { loaded, total };
  }

  /** The progress_callback to hand to Transformers.js. */
  readonly callback = (p: LibraryProgressEvent): void => {
    if (!p.file) return;
    const cur = this.perFile.get(p.file) ?? { loaded: 0, total: 0 };
    if (p.status === 'progress') {
      cur.loaded = p.loaded ?? cur.loaded;
      cur.total = p.total || cur.total;
    }
    if (p.status === 'done') cur.loaded = cur.total || cur.loaded;
    this.perFile.set(p.file, cur);
    const status = (['initiate', 'download', 'progress', 'done'] as const).find(
      (s) => s === p.status,
    );
    if (status) this.report(status, p.file);
  };

  report(status: ProgressInfo['status'], file?: string): void {
    const { loaded, total } = this.totals;
    const f = file ? this.perFile.get(file) : undefined;
    this.emit({
      status,
      file,
      loaded,
      total,
      progress: total ? (loaded / total) * 100 : 0,
      fileLoaded: f?.loaded,
      fileTotal: f?.total,
    });
  }
}
