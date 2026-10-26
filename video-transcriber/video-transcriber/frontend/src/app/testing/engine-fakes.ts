/**
 * Stand-ins for the in-browser engine's moving parts (the engine worker, the Hinglish converter, the device), used by
 * the JobRunner spec and the transport contract spec. Nothing here loads a model or a worker.
 */
import type { JobOptions, Segment } from '../core/models';
import type { BrowserEngine } from '../core/transport/browser-engine';
import { HinglishConverter } from '../engine/jobs/hinglish-converter';
import { JobRunner, JobRunnerDeps } from '../engine/jobs/job-runner';
import { MODEL_UI } from '../engine/jobs/reference-data';
import { MemoryBackend } from '../engine/session/backend';
import { SessionStore } from '../engine/session/session-store';
import type { EngineEvent, JobResult, WorkerPlan } from '../engine/worker/protocol';
import { EngineRunError, EngineRunner, RunInput } from '../engine/worker/worker-client';

export interface FakeRun {
  req: RunInput;
  onEvent: (e: EngineEvent) => void;
  resolve: (r: JobResult) => void;
  reject: (e: unknown) => void;
}

/** The engine worker as a script: each run waits until the spec emits events and resolves or rejects it. */
export class FakeEngine implements EngineRunner {
  readonly runs: FakeRun[] = [];
  readonly cancelled: string[] = [];
  /** when set, every run plays this script by itself (the contract spec) */
  autoplay: ((run: FakeRun) => void) | null = null;

  run(req: RunInput, onEvent: (e: EngineEvent) => void): Promise<JobResult> {
    return new Promise<JobResult>((resolve, reject) => {
      const run = { req, onEvent, resolve, reject };
      this.runs.push(run);
      if (this.autoplay) setTimeout(() => this.autoplay?.(run));
    });
  }

  cancel(id: string): void {
    this.cancelled.push(id);
  }

  dispose(): void {}

  get last(): FakeRun {
    return this.runs[this.runs.length - 1];
  }

  /** Rejects the run the way WorkerClient does after a cancel. */
  static cancelledError() {
    return new EngineRunError({ code: 'cancelled', userMessage: 'Cancelled.', technical: 'test' }, true);
  }
}

/** A short successful run: phases, the language, one segments event, the result. */
export function playSuccess(run: FakeRun, segments: Segment[] = [engineSegment(0, 0, 1.5, 'hello world')], language = 'en') {
  const id = run.req.id;
  run.onEvent({ type: 'phase', id, phase: 'extracting', progress: 0, eta: null });
  run.onEvent({ type: 'phase', id, phase: 'loading_model', progress: 0, eta: null });
  run.onEvent({ type: 'progress', id, kind: 'download', loaded: 10, total: 100, file: 'encoder_model.onnx' });
  run.onEvent({ type: 'phase', id, phase: 'transcribing', progress: 0, eta: null });
  run.onEvent({ type: 'language', id, language, probability: 0.97, candidates: [{ language, probability: 0.97 }] });
  run.onEvent({ type: 'segments', id, segments, since: 0, progress: 0.5, language, duration: 3 });
  run.resolve({
    language,
    language_probability: 0.97,
    duration: 3,
    dropped: { empty: 0, no_speech: 0, repetition: 0 },
    windows: 1,
  });
}

/** A segment as the worker emits it (after the post rules, before Hinglish). */
export function engineSegment(id: number, start: number, end: number, text: string, extra: Partial<Segment> = {}): Segment {
  return { id, start, end, text, words: null, confidence: 0.9, no_speech_prob: 0.01, original_text: text, ...extra };
}

/** Hinglish without a model: Devanagari-free text gets a visible marker so specs can see the conversion ran. */
export class FakeHinglish implements HinglishConverter {
  readonly calls: { kind: 'convert' | 'restyle'; count: number; script?: string; romanizer: string }[] = [];
  async convert(segments: readonly Segment[], romanizer: JobOptions['romanizer']): Promise<Segment[]> {
    this.calls.push({ kind: 'convert', count: segments.length, romanizer });
    return segments.map((s) => ({ ...s, text: `${s.text} (roman)`, romanizer: 'indicxlit' }));
  }
  async restyle(segments: readonly Segment[], script: JobOptions['output_script'], romanizer: JobOptions['romanizer']): Promise<Segment[]> {
    this.calls.push({ kind: 'restyle', count: segments.length, script, romanizer });
    return segments.map((s) =>
      s.edited ? { ...s } : { ...s, text: script === 'hinglish' ? `${s.original_text ?? s.text} (roman)` : (s.original_text ?? s.text) },
    );
  }
  dispose(): void {}
}

export const FAKE_WORKER_PLAN: WorkerPlan = { backend: 'wasm', shaderF16: false, recycleEvery: 0 };

/** A JobRunner on an in-memory session with the fakes above; `overrides` replaces any dependency. */
export async function makeRunner(overrides: Partial<JobRunnerDeps> = {}) {
  const backend = new MemoryBackend();
  const store = await SessionStore.open(backend, { checkIntervalMs: 0, locks: null, caches: null });
  const engine = new FakeEngine();
  const hinglish = new FakeHinglish();
  const wake = { starts: 0, stops: 0, start() { this.starts++; }, stop() { this.stops++; } };
  let n = 0;
  const runner = new JobRunner({
    store,
    engine,
    hinglish,
    plan: async () => FAKE_WORKER_PLAN,
    gate: async () => (id: string) => (id === 'large-v3' ? 'needs 8 GB' : null),
    knownModels: MODEL_UI.map((m) => m.id),
    wakeLock: wake,
    newId: () => `job${++n}`.padEnd(32, '0'),
    ...overrides,
  });
  return { runner, store, engine, hinglish, wake, backend };
}

/** The BrowserTransport's engine runtime made of the fakes (for BROWSER_ENGINE). */
export async function makeFakeBrowserEngine(): Promise<BrowserEngine & { engine: FakeEngine; hinglish: FakeHinglish }> {
  const { runner, store, engine, hinglish } = await makeRunner();
  return { runner, store, engine, hinglish, isCached: async (id) => id === 'tiny' };
}

/** Lets queued promise chains (store writes, event handling) settle. */
export async function settle(rounds = 8) {
  for (let i = 0; i < rounds; i++) await new Promise((r) => setTimeout(r, 0));
}

/** A small media file. */
export function mediaFile(name = 'talk.mp3', bytes = 'abc', type = 'audio/mpeg') {
  return new File([bytes], name, { type });
}
