/**
 * The page's handle on the engine worker: one run at a time, its events, the cancel, and the worker's life cycle.
 *
 *   const client = new WorkerClient();
 *   const result = await client.run({ id, file, options, plan }, (event) => ...);   // rejects with EngineRunError
 *   client.cancel(id);   // cooperative first; after 2 s without an answer: terminate + a fresh worker next time
 *
 * Recycle: on WebGPU the worker asks to be replaced every `plan.recycleEvery` windows (GPU-process growth, see
 * ARCHITECTURE section 3). It sends its state ('recycle'); the client terminates it, starts a new worker and continues
 * the same run there. The caller sees one run.
 */
import type { EngineEvent, EngineMessage, EngineRequest, JobResult, RunRequest, WorkerError } from './protocol';

export interface EngineWorkerLike {
  postMessage(message: EngineRequest, transfer?: Transferable[]): void;
  terminate(): void;
  onmessage: ((event: { data: EngineMessage }) => void) | null;
  onerror: ((event: { message?: string }) => void) | null;
}

export type RunInput = Omit<RunRequest, 'op' | 'resume'>;

/** What JobRunner needs from the engine (WorkerClient, or a fake in specs). */
export interface EngineRunner {
  run(req: RunInput, onEvent: (event: EngineEvent) => void): Promise<JobResult>;
  cancel(id: string): void;
  dispose(): void;
}

export class EngineRunError extends Error {
  readonly code: string;
  readonly userMessage: string;
  readonly technical: string;
  constructor(
    error: WorkerError,
    readonly cancelled: boolean,
  ) {
    super(error.userMessage);
    this.name = 'EngineRunError';
    this.code = error.code;
    this.userMessage = error.userMessage;
    this.technical = error.technical;
  }
}

export interface WorkerClientOptions {
  /** Replaces the real Worker (tests). */
  factory?: () => EngineWorkerLike;
  /** Milliseconds a cooperative cancel may take before the worker is terminated (default 2000). */
  hardCancelMs?: number;
}

interface Current {
  req: RunInput;
  onEvent: (event: EngineEvent) => void;
  resolve: (r: JobResult) => void;
  reject: (e: EngineRunError) => void;
  cancelling: boolean;
  cancelTimer?: ReturnType<typeof setTimeout>;
}

function defaultFactory(): EngineWorkerLike {
  return new Worker(new URL('./transcribe.worker', import.meta.url), {
    type: 'module',
  }) as unknown as EngineWorkerLike;
}

export const HARD_CANCEL_MS = 2000;

export class WorkerClient implements EngineRunner {
  private worker: EngineWorkerLike | null = null;
  private current: Current | null = null;
  private readonly factory: () => EngineWorkerLike;
  private readonly hardCancelMs: number;
  /** workers started so far (the first one, recycles, replacements after a hard cancel or a crash) */
  started = 0;

  constructor(options: WorkerClientOptions = {}) {
    this.factory = options.factory ?? defaultFactory;
    this.hardCancelMs = options.hardCancelMs ?? HARD_CANCEL_MS;
  }

  get busy(): boolean {
    return this.current !== null;
  }

  run(req: RunInput, onEvent: (event: EngineEvent) => void): Promise<JobResult> {
    if (this.current) {
      return Promise.reject(
        new EngineRunError({ code: 'busy', userMessage: 'Another transcription is running.', technical: 'busy' }, false),
      );
    }
    return new Promise<JobResult>((resolve, reject) => {
      this.current = { req, onEvent, resolve, reject, cancelling: false };
      try {
        this.ensure().postMessage({ op: 'run', ...req });
      } catch (e) {
        this.fail(`could not start the engine worker: ${(e as Error)?.message ?? e}`);
      }
    });
  }

  cancel(id: string): void {
    const c = this.current;
    if (!c || c.req.id !== id || c.cancelling) return;
    c.cancelling = true;
    this.worker?.postMessage({ op: 'cancel', id });
    c.cancelTimer = setTimeout(() => {
      if (this.current !== c) return;
      // the encoder pass (or a stuck worker) did not reach a cancel point in time: stop it the hard way
      this.kill();
      this.finish(c, () =>
        c.reject(new EngineRunError({ code: 'cancelled', userMessage: 'Cancelled.', technical: 'hard cancel (terminated)' }, true)),
      );
    }, this.hardCancelMs);
  }

  dispose(): void {
    const c = this.current;
    this.kill();
    if (c) {
      this.finish(c, () =>
        c.reject(new EngineRunError({ code: 'cancelled', userMessage: 'Cancelled.', technical: 'engine disposed' }, true)),
      );
    }
  }

  // ------------------------------------------------------------------ internals
  private ensure(): EngineWorkerLike {
    if (this.worker) return this.worker;
    const w = this.factory();
    w.onmessage = (event) => this.onMessage(w, event.data);
    w.onerror = (event) => {
      if (this.worker === w) this.fail(event?.message || 'the engine worker crashed');
    };
    this.worker = w;
    this.started++;
    return w;
  }

  private kill() {
    const w = this.worker;
    this.worker = null;
    if (w) {
      w.onmessage = null;
      w.onerror = null;
      try {
        w.terminate();
      } catch {
        /* already gone */
      }
    }
  }

  private finish(c: Current, settle: () => void) {
    clearTimeout(c.cancelTimer);
    if (this.current === c) this.current = null;
    settle();
  }

  /** The worker died (crash, out of memory in the worker, failed to start): end the run with a clear error. */
  private fail(technical: string) {
    const c = this.current;
    this.kill();
    if (!c) return;
    const error: WorkerError = c.cancelling
      ? { code: 'cancelled', userMessage: 'Cancelled.', technical }
      : {
          code: 'worker-crashed',
          userMessage: 'The speech engine stopped unexpectedly. Try again; a smaller model needs less memory.',
          technical,
        };
    this.finish(c, () => c.reject(new EngineRunError(error, c.cancelling)));
  }

  private onMessage(from: EngineWorkerLike, m: EngineMessage) {
    const c = this.current;
    if (from !== this.worker || !c || m.id !== c.req.id) {
      // worker-level log lines carry no job id
      if (c && m.type === 'log') c.onEvent(m);
      return;
    }
    if (m.type === 'result') {
      if (m.ok) this.finish(c, () => c.resolve(m.result));
      else this.finish(c, () => c.reject(new EngineRunError(m.error, m.cancelled || c.cancelling)));
      return;
    }
    if (m.type === 'recycle') {
      this.kill();
      if (c.cancelling) {
        this.finish(c, () =>
          c.reject(new EngineRunError({ code: 'cancelled', userMessage: 'Cancelled.', technical: 'cancelled at a recycle' }, true)),
        );
        return;
      }
      try {
        this.ensure().postMessage({ op: 'run', ...c.req, resume: m.state }, [m.state.pcm.buffer as ArrayBuffer]);
      } catch (e) {
        this.fail(`could not restart the engine worker: ${(e as Error)?.message ?? e}`);
      }
      return;
    }
    c.onEvent(m);
  }
}
