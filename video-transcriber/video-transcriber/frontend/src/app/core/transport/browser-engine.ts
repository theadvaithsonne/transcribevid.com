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
}

export interface BrowserEngineDeps {
  workerPlan: () => Promise<WorkerPlan>;
  gate: () => Promise<ModelGate>;
  log: RunnerLog;
}

export async function createBrowserEngine(deps: BrowserEngineDeps): Promise<BrowserEngine> {
  const backend = await IndexedDbBackend.open();
  const store = await SessionStore.open(backend, {
    computeStats: (segments, duration) => computeStats(segments, duration),
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
  return {
    store,
    runner,
    isCached: (id, device, shaderF16) =>
      catalogEntry(id) ? manager.isCached(id, device, { shaderF16 }).catch(() => false) : Promise.resolve(false),
  };
}
