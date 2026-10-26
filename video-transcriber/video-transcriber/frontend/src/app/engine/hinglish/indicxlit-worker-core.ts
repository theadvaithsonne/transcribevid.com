/**
 * The message handler that runs inside the converter's Web Worker (indicxlit.worker.ts), kept free of
 * `self` so it can be exercised in unit tests. Conversion is processed in short slices - between words and, through
 * IndicXlit.transliterateAsync, inside a word at every decoder step - so that a `cancel` or `dispose` message sent
 * while a long list or one very long word is converting is seen within a few milliseconds.
 */
import { IndicXlit, IndicXlitInfo, LoadOptions, load } from './indicxlit';

export type WorkerRequest =
  | { id: number; type: 'load'; base: string; wordCache?: boolean }
  | { id: number; type: 'convert'; words: string[]; beamSize?: number }
  | { id: number; type: 'cancel'; target: number }
  | { id: number; type: 'dispose' };

export type WorkerResponse =
  | { id: number; type: 'progress'; received: number; total: number }
  | { id: number; type: 'loaded'; info: IndicXlitInfo }
  | { id: number; type: 'convertProgress'; done: number; total: number }
  | { id: number; type: 'converted'; words: string[] }
  | { id: number; type: 'cancelled' }
  | { id: number; type: 'disposed' }
  | { id: number; type: 'error'; name: string; message: string };

/** Longest stretch of conversion work between two looks at the message queue. */
const SLICE_MS = 20;

export interface WorkerHandlerOptions {
  /** Replaces the real loader (tests). */
  loader?: (base: string, options: LoadOptions) => Promise<IndicXlit>;
  /** Gives the event loop a turn so queued messages can be delivered (default: a zero timeout). */
  yieldToEventLoop?: () => Promise<void>;
  now?: () => number;
}

export function createWorkerHandler(
  post: (message: WorkerResponse) => void,
  options: WorkerHandlerOptions = {},
) {
  const loader = options.loader ?? ((base, loadOptions) => load(base, loadOptions));
  const yieldNow =
    options.yieldToEventLoop ?? (() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
  const now = options.now ?? (() => performance.now());
  let model: IndicXlit | null = null;
  /** Conversions received and not yet answered. Only these can be cancelled; a late cancel is dropped on arrival. */
  const inFlight = new Set<number>();
  const cancelled = new Set<number>();
  /** Conversions run one after another: a word paused mid-decode owns the model's scratch memory. */
  let queue: Promise<void> = Promise.resolve();

  async function convert(id: number, words: string[], beamSize: number | undefined): Promise<void> {
    if (model === null) throw new Error('The converter is not loaded.');
    const out: string[] = [];
    const total = words.length;
    let sliceStart = now();
    const isCancelled = (): boolean => cancelled.has(id);
    // Words are converted one by one (each distinct word once) so the slice clock can be checked between them;
    // inside a word the model itself yields every SLICE_MS and polls isCancelled at every decoder step.
    const memo = new Map<string, string>();
    for (let i = 0; i < total; i++) {
      if (isCancelled()) {
        post({ id, type: 'cancelled' });
        return;
      }
      const word = words[i];
      let result = memo.get(word);
      if (result === undefined) {
        try {
          [result] = await model.transliterateAsync([word], {
            beamSize,
            isCancelled,
            yieldNow,
            now,
            sliceMs: SLICE_MS,
          });
        } catch (error) {
          if (isCancelled()) {
            post({ id, type: 'cancelled' });
            return;
          }
          if (model === null) throw new Error('The converter was disposed.');
          throw error;
        }
        memo.set(word, result);
      }
      out.push(result);
      if (now() - sliceStart >= SLICE_MS) {
        post({ id, type: 'convertProgress', done: i + 1, total });
        await yieldNow();
        sliceStart = now();
        if (model === null) throw new Error('The converter was disposed.');
      }
    }
    post({ id, type: 'converted', words: out });
  }

  async function handle(request: WorkerRequest): Promise<void> {
    try {
      switch (request.type) {
        case 'load': {
          model?.dispose();
          model = await loader(request.base, {
            wordCache: request.wordCache,
            onProgress: (received, total) =>
              post({ id: request.id, type: 'progress', received, total }),
          });
          post({ id: request.id, type: 'loaded', info: model.info });
          return;
        }
        case 'convert': {
          inFlight.add(request.id);
          const run = queue.then(() => convert(request.id, request.words, request.beamSize));
          queue = run.catch(() => undefined);
          try {
            await run;
          } finally {
            inFlight.delete(request.id);
            cancelled.delete(request.id);
          }
          return;
        }
        case 'cancel':
          if (inFlight.has(request.target)) cancelled.add(request.target);
          return;
        case 'dispose':
          model?.dispose();
          model = null;
          post({ id: request.id, type: 'disposed' });
          return;
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      post({ id: request.id, type: 'error', name: err.name, message: err.message });
    }
  }

  /** Test hook: how many conversions are in flight and how many cancel marks are held. */
  handle.inspect = (): { inFlight: number; cancelled: number } => ({
    inFlight: inFlight.size,
    cancelled: cancelled.size,
  });
  return handle;
}
