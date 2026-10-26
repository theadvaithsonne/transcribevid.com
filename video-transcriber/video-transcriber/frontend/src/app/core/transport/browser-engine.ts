/**
 * The in-browser engine's runtime pieces, created once on first use (this module is a lazy chunk: the self-hosted
 * edition and prerendering never load it): the IndexedDB session, the job queue, the engine worker client and the
 * Hinglish converter.
 */
import { WakeLock } from '../../engine/device/wake-lock';
import { IndicXlitHinglish } from '../../engine/jobs/hinglish-converter';
import { JobRunner, RunnerLog } from '../../engine/jobs/job-runner';
import type { ModelGate } from '../../engine/jobs/options';
import { MODEL_UI } from '../../engine/jobs/reference-data';
import { catalogEntry } from '../../engine/models/catalog';
import { ModelManager } from '../../engine/models/model-manager';
import { requestPersistentStorage } from '../../engine/models/resumable-download';
import type { ProgressInfo } from '../../engine/asr/types';
import { isQwenModel } from '../../engine/models/qwen-catalog';
import { computeStats } from '../../engine/post/stats';
import { IndexedDbBackend } from '../../engine/session/indexeddb-backend';
import { SessionStore } from '../../engine/session/session-store';
import type { WorkerPlan } from '../../engine/worker/protocol';
import { WorkerClient } from '../../engine/worker/worker-client';

export interface BrowserEngine {
  store: SessionStore;
  runner: JobRunner;
  /** every file of the model's download for this device is in the Cache API */
  isCached(id: string, backend: 'webgpu' | 'wasm', shaderF16: boolean): Promise<boolean>;
  /** the player source of a stored file the browser cannot play (engine/audio preview.ts) */
  buildPreview?(file: Blob, o: { converter: boolean; signal?: AbortSignal }): Promise<Blob>;
  /**
   * Downloads a Whisper model into this browser without loading it (the page's background download). Stops as soon
   * as a job starts (the job continues from the saved parts); false when nothing was downloaded.
   */
  prefetchModel?(
    id: string,
    backend: 'webgpu' | 'wasm',
    shaderF16: boolean,
    o: { signal?: AbortSignal; onProgress?: (p: ProgressInfo) => void },
  ): Promise<boolean>;
}

export interface BrowserEngineDeps {
  workerPlan: () => Promise<WorkerPlan>;
  gate: () => Promise<ModelGate>;
  log: RunnerLog;
}

/**
 * While a job is queued or running, leaving or reloading the page asks first (desktop browsers show their own "Leave
 * site?" box; phones mostly do not). Only then: a beforeunload handler keeps the page out of the back/forward cache.
 * If the page goes anyway, the job continues from its checkpoint when the site is opened again.
 */
function guardLeaving(runner: JobRunner) {
  if (typeof window === 'undefined') return;
  const ask = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ''; // older browsers need it set
  };
  let persisted = false;
  runner.onBusyChange((busy) => {
    if (busy) window.addEventListener('beforeunload', ask);
    else window.removeEventListener('beforeunload', ask);
    // once: ask the browser to keep the models and the stored files (only a page can ask, not the worker)
    if (busy && !persisted) {
      persisted = true;
      void requestPersistentStorage().catch(() => false);
    }
  });
}

export async function createBrowserEngine(deps: BrowserEngineDeps): Promise<BrowserEngine> {
  const backend = await IndexedDbBackend.open();
  const store = await SessionStore.open(backend, {
    computeStats: (segments, duration) => computeStats(segments, duration),
    // a reload, a closed tab or a phone that dropped the tab: the job continues from its checkpoint, not "failed"
    resumeInterrupted: true,
    onError: (e) => deps.log('WARNING', `session check failed: ${(e as Error)?.message ?? e}`),
  });
  const manager = new ModelManager();
  const runner = new JobRunner({
    store,
    engine: new WorkerClient(),
    hinglish: new IndicXlitHinglish({ log: deps.log }),
    plan: deps.workerPlan,
    gate: deps.gate,
    knownModels: MODEL_UI.map((m) => m.id),
    wakeLock: new WakeLock(),
    log: deps.log,
  });
  guardLeaving(runner);
  return {
    store,
    runner,
    isCached: (id, device, shaderF16) =>
      catalogEntry(id) || isQwenModel(id) ? manager.isCached(id, device, { shaderF16 }).catch(() => false) : Promise.resolve(false),
    buildPreview: async (file, o) => (await import('../../engine/audio/preview')).buildWavPreview(file, o),
    prefetchModel: async (id, backend, shaderF16, o) => {
      if (!catalogEntry(id) || runner.busy) return false; // Whisper only; a running job downloads its own model
      const stop = new AbortController();
      const onAbort = () => stop.abort();
      o.signal?.addEventListener('abort', onAbort, { once: true });
      const off = runner.onBusyChange((busy) => busy && stop.abort());
      try {
        const r = await manager.download(id, backend, { gpu: { shaderF16 }, signal: stop.signal, onProgress: o.onProgress });
        return r.downloaded;
      } finally {
        off();
        o.signal?.removeEventListener('abort', onAbort);
      }
    },
  };
}
