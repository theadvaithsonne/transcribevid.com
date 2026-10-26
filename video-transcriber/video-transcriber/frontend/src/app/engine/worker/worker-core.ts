/**
 * The engine worker's message handler (protocol.ts) around runPipeline, with the real decoder, VAD and Whisper as
 * the default dependencies. transcribe.worker.ts is only the entry that wires it to `self`.
 */
import { decodeMedia } from '../audio';
import { isCancelled } from '../asr/types';
import { WhisperEngine } from '../asr/whisper-engine';
import { catalogEntry } from '../models/catalog';
import { ModelManager } from '../models/model-manager';
import { ortWasmPaths } from '../models/ort-config';
import { QwenEngine } from '../qwen/qwen-engine';
import { EnergyVadModel, FrameModel, SileroVad, StreamingVad, WHISPER_VAD, selfTest } from '../vad';
import { Cancellable, PipelineDeps, runPipeline } from './pipeline';
import type { EngineMessage, EngineRequest, WorkerError } from './protocol';

/** Where the page serves the VAD model (frontend/public/models/vad). */
export const VAD_MODEL_URL = '/models/vad/silero_vad_v6.onnx';

async function loadVadModel(log: (m: string) => void): Promise<FrameModel> {
  try {
    const base = (globalThis as { location?: { href: string } }).location?.href ?? 'http://localhost/';
    const res = await fetch(new URL(VAD_MODEL_URL, base).href);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    const model = await SileroVad.create(bytes, { env: { wasmPaths: ortWasmPaths(), numThreads: 1 } });
    const check = await selfTest(model);
    if (check.ok) return model;
    log(`Silero VAD failed its self-test (max diff ${check.maxDiff}); using the energy fallback`);
  } catch (e) {
    log(`Silero VAD could not be loaded (${(e as Error)?.message ?? e}); using the energy fallback`);
  }
  return new EnergyVadModel();
}

/** The real pipeline pieces. One VAD model and one model manager per worker. */
export function defaultDeps(log: (m: string) => void = () => {}): PipelineDeps {
  const manager = new ModelManager();
  let vad: Promise<FrameModel> | null = null;
  return {
    decode: (file, o) => decodeMedia(file, o),
    async createVad(signal, params = WHISPER_VAD) {
      vad ??= loadVadModel(log);
      return new StreamingVad(await vad, params, { signal });
    },
    createEngine: () => new WhisperEngine(),
    ensureModel: (id, device, engine, o) => manager.ensure(id, device, engine, o),
    alignerFor: (model) => catalogEntry(model)?.aligner ?? null,
    createQwenEngine: () => new QwenEngine(),
    ensureQwen: (id, engine, o) =>
      manager.ensureQwen(id, engine as QwenEngine, {
        ...o,
        onCacheError: (file, e) => log(`${file} could not be kept in the browser cache (${(e as Error)?.message ?? e}); it downloads again next time`),
      }),
  };
}

const GPU_LOST = /device (was )?lost|GPUDevice|webgpu.*(lost|destroyed)/i;
const OUT_OF_MEMORY = /out of memory|allocation failed|Array buffer allocation|memory access out of bounds/i;

/** Any error as the page shows it (userMessage) and the Logs page shows it (technical). */
export function toWorkerError(e: unknown): WorkerError {
  const err = e as { code?: unknown; userMessage?: unknown; technical?: unknown; message?: unknown; name?: unknown } | null;
  const message = typeof err?.message === 'string' ? err.message : String(e);
  const technical = typeof err?.technical === 'string' && err.technical ? err.technical : `${String(err?.name ?? 'Error')}: ${message}`;
  if (isCancelled(e)) return { code: 'cancelled', userMessage: 'Cancelled.', technical };
  if (typeof err?.code === 'string' && typeof err.userMessage === 'string') {
    return { code: err.code, userMessage: err.userMessage, technical };
  }
  if (GPU_LOST.test(message)) {
    return {
      code: 'webgpu-lost',
      userMessage: 'The graphics device stopped responding. Run it again; if it keeps happening, pick a smaller model.',
      technical,
    };
  }
  if (OUT_OF_MEMORY.test(message) || err?.name === 'RangeError') {
    return {
      code: 'oom',
      userMessage: 'This device ran out of memory. Pick a smaller model or a shorter file, and close other tabs.',
      technical,
    };
  }
  return {
    code: 'failed',
    userMessage: 'Something went wrong while transcribing this file. Please try again.',
    technical,
  };
}

export type Post = (message: EngineMessage, transfer?: Transferable[]) => void;

/** Handles 'run' and 'cancel'. A cancel reaches a running pipeline at its next cancel point (20-80 ms). */
export function createEngineWorkerHandler(post: Post, deps?: PipelineDeps): (req: EngineRequest) => Promise<void> {
  const runs = new Map<string, { controller: AbortController; engine: Cancellable | null }>();
  const pipelineDeps = deps ?? defaultDeps((m) => post({ type: 'log', id: '', level: 'WARNING', message: m }));
  return async (req) => {
    if (req.op === 'cancel') {
      const run = runs.get(req.id);
      if (run) {
        run.controller.abort();
        run.engine?.cancel();
      }
      return;
    }
    const controller = new AbortController();
    const run = { controller, engine: null as Cancellable | null, dirty: false };
    runs.set(req.id, run);
    try {
      const out = await runPipeline(req, pipelineDeps, {
        signal: controller.signal,
        emit: (event) => post(event),
        onEngine: (engine) => (run.engine = engine),
        markDirty: () => (run.dirty = true),
      });
      if (out.kind === 'recycle') post({ type: 'recycle', id: req.id, state: out.state }, [out.state.pcm.buffer as ArrayBuffer]);
      else post({ type: 'result', id: req.id, ok: true, result: out.result, ...(run.dirty ? { restart: true } : {}) });
    } catch (e) {
      const error = toWorkerError(e);
      const cancelled = controller.signal.aborted || error.code === 'cancelled' || error.code === 'CANCELLED';
      post({ type: 'result', id: req.id, ok: false, cancelled, error, ...(run.dirty ? { restart: true } : {}) });
    } finally {
      runs.delete(req.id);
    }
  };
}
