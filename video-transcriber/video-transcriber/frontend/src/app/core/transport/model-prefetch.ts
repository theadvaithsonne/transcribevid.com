import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LogService } from '../log.service';
import type { BrowserTransport } from './browser-transport';
import { EngineDevice } from './engine-device';
import { TRANSPORT } from './token';

/** What the background download is doing, for the quality help line on the home page. */
export interface PrefetchState {
  model: string;
  loaded: number;
  total: number;
  done: boolean;
  note?: string;
}

/** The Network Information API (Chrome, Edge, Android); Safari and Firefox have none. */
interface ConnectionLike {
  saveData?: boolean;
  type?: string;
  effectiveType?: string;
}

/** Seconds after the page has loaded and gone quiet before an automatic download starts (keeps the page fast). */
const AUTO_DELAY_MS = 3000;

/**
 * In-browser edition: downloads the chosen speech model in the background, so pressing Transcribe does not start with
 * a long wait. The parts are saved as they come (engine/models resumable-download), so a reload or a job that starts
 * meanwhile continues from there.
 *
 * - `auto` (the visitor is on the home page): only after the page has loaded and gone idle, and only where a large
 *   download is unlikely to cost the visitor money: not with Save-Data, not on a cellular or 2G / 3G connection, and
 *   not on a phone or tablet whose browser cannot tell (Safari): there it waits for `user`.
 * - `user` (a file was chosen or a recording made): starts at once, whatever the connection, because the visitor is
 *   about to need the model anyway.
 * A running job stops it (the job downloads the rest itself); choosing another model switches to that one.
 */
@Injectable({ providedIn: 'root' })
export class ModelPrefetch {
  private readonly transport = inject(TRANSPORT);
  private readonly device = inject(EngineDevice);
  private readonly log = inject(LogService);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly state = signal<PrefetchState | null>(null);
  private current: { model: string; stop: AbortController } | null = null;

  request(model: string, reason: 'auto' | 'user'): void {
    if (!this.browser || this.transport.kind !== 'browser' || !model || model.startsWith('qwen')) return;
    if (this.current?.model === model) return; // already on it (or done)
    this.current?.stop.abort();
    const stop = new AbortController();
    this.current = { model, stop };
    void this.run(model, reason, stop.signal).finally(() => {
      if (this.current?.stop === stop && stop.signal.aborted) this.current = null;
    });
  }

  private async run(model: string, reason: 'auto' | 'user', signal: AbortSignal): Promise<void> {
    try {
      if (reason === 'auto') {
        if (!(await this.autoAllowed())) {
          if (this.current?.model === model) this.current = null; // a later `user` request may start it
          return;
        }
        await whenIdle(signal);
      }
      if (signal.aborted) return;
      const transport = this.transport as unknown as BrowserTransport;
      const downloaded = await inOneTab(() =>
        transport.prefetchModel(model, {
          signal,
          onProgress: (loaded, total, note) => {
            if (!signal.aborted) this.state.set({ model, loaded, total, done: false, ...(note ? { note } : {}) });
          },
        }),
      );
      if (signal.aborted) return;
      if (downloaded) {
        this.log.info(`model ${model} downloaded in the background`);
        this.state.set({ model, loaded: 1, total: 1, done: true });
      } else if (this.state()?.model === model && !this.state()?.done) {
        this.state.set(null);
      }
    } catch (e) {
      if (signal.aborted) return;
      // nothing is lost: the parts are kept, and the job downloads the rest when it starts
      this.log.debug(`background model download stopped: ${(e as Error)?.message ?? e}`);
      if (this.state()?.model === model) this.state.set(null);
      if (this.current?.model === model) this.current = null;
    }
  }

  /** An automatic download only where it is unlikely to cost the visitor money or slow the page. */
  private async autoAllowed(): Promise<boolean> {
    const c = (navigator as Navigator & { connection?: ConnectionLike }).connection;
    if (c?.saveData) return false;
    if (c?.type === 'cellular') return false;
    if (c?.effectiveType && ['slow-2g', '2g', '3g'].includes(c.effectiveType)) return false;
    try {
      const plan = await this.device.plan();
      // a phone or tablet that does not say what its connection is (Safari) may be on mobile data
      if (plan.facts.mobile && !c?.type) return false;
    } catch {
      return false;
    }
    return true;
  }
}

/** The Web Lock the background download holds while it runs. */
export const PREFETCH_LOCK = 'tv-model-prefetch';

interface PrefetchLocks {
  request(name: string, options: { ifAvailable: boolean }, callback: (lock: unknown) => Promise<boolean> | boolean): Promise<unknown>;
}

/**
 * Runs the background download in one tab at a time (Web Locks). Two tabs of the home page would otherwise both fetch
 * the same 250 MB - 1.6 GB, and the one that finished first drops the saved parts the other is still counting on. A
 * tab that finds the lock taken leaves the download to the other one (false: nothing downloaded here). Without Web
 * Locks (old Safari) it runs as before.
 */
async function inOneTab(fn: () => Promise<boolean>): Promise<boolean> {
  const locks = (globalThis as { navigator?: { locks?: PrefetchLocks } }).navigator?.locks;
  if (typeof locks?.request !== 'function') return fn();
  let ran = false;
  try {
    const r = await locks.request(PREFETCH_LOCK, { ifAvailable: true }, (lock) => {
      if (!lock) return false;
      ran = true;
      return fn();
    });
    return r === true;
  } catch (e) {
    if (ran) throw e; // the download's own error
    return fn(); // the Web Locks API itself refused (an unusual context): download without it
  }
}

/** Resolves once the page has finished loading and the browser is idle, plus a short pause. */
function whenIdle(signal: AbortSignal): Promise<void> {
  return new Promise<void>((resolve) => {
    const go = () => {
      const later = () => setTimeout(resolve, AUTO_DELAY_MS);
      const ric = (globalThis as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) ric(later, { timeout: 5000 });
      else later();
    };
    signal.addEventListener('abort', () => resolve(), { once: true });
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
  });
}
