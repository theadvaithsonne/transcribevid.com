/**
 * Silero VAD driven directly with onnxruntime-web: `public/models/vad/silero_vad_v6.onnx`, the file
 * faster-whisper 1.2.1 ships and the Python engine runs today (Silero v6.0 weights).
 *
 *   inputs  input [seq, 576] (64 samples of context + 512 samples per row), h [1,1,128], c [1,1,128]
 *   outputs speech_probs [seq], hn, cn
 *
 * The rows are a sequence: the graph runs the conv encoder on all rows at once and the LSTM across them, so
 * one session.run() judges any number of frames (faster-whisper sends up to 10,000).
 *
 * The execution provider is pinned to ['wasm']: the WebGPU provider of onnxruntime-web 1.31.0-dev returns
 * wrong probabilities for this model (docs/in-browser/spike/vad.md section 4.4). The caller owns the ORT
 * environment (wasmPaths, threads): pass its `ort` namespace (the one Transformers.js already loaded, so that
 * only one runtime and one wasm instance exist) or let `create()` import 'onnxruntime-web' lazily and apply
 * `env`. Run `selfTest(model)` from ./canary once after creating it.
 */
import { CONTEXT, FRAME, FrameModel } from './types';

/** The few onnxruntime-web members used here (structural, so any ort build satisfies it). */
export interface OrtTensorLike {
  readonly data: unknown;
  readonly dims: readonly number[];
}

export interface OrtSessionLike {
  readonly inputNames: readonly string[];
  readonly outputNames: readonly string[];
  run(feeds: Record<string, OrtTensorLike>): Promise<Record<string, OrtTensorLike>>;
  release?(): Promise<void>;
}

export interface OrtEnvLike {
  wasm: {
    wasmPaths?: string | { mjs?: string; wasm?: string };
    numThreads?: number;
    proxy?: boolean;
  };
  logLevel?: string;
}

export interface OrtLike {
  Tensor: new (
    type: string,
    data: ArrayLike<number> | ArrayLike<bigint>,
    dims: readonly number[],
  ) => OrtTensorLike;
  InferenceSession: {
    create(
      model: Uint8Array | ArrayBuffer | string,
      options?: Record<string, unknown>,
    ): Promise<OrtSessionLike>;
  };
  env: OrtEnvLike;
}

/** Settings applied to `ort.env` before the session is created (only the fields that are given). */
export interface OrtEnvOptions {
  /** Where the `ort-wasm-simd-threaded.{mjs,wasm}` files are served from (a prefix or the two URLs). */
  wasmPaths?: string | { mjs: string; wasm: string };
  numThreads?: number;
  /** Run the wasm backend in a proxy worker (default false: the engine already runs in a worker). */
  proxy?: boolean;
  logLevel?: 'verbose' | 'info' | 'warning' | 'error' | 'fatal';
}

export interface SileroVadOptions {
  /** An already loaded onnxruntime-web namespace. Default: `await import('onnxruntime-web')`. */
  ort?: OrtLike;
  /** Applied to `ort.env` before the session is created. */
  env?: OrtEnvOptions;
  /** Merged over DEFAULT_SESSION_OPTIONS. `executionProviders` is always ['wasm'] (not overridable). */
  sessionOptions?: Record<string, unknown>;
}

export const DEFAULT_SESSION_OPTIONS = {
  executionProviders: ['wasm'],
  graphOptimizationLevel: 'all',
  // the model is tiny; extra arenas / threads only cost start-up time
  enableCpuMemArena: false,
  logSeverityLevel: 3,
} as const;

const STATE = 128;

/** Imports onnxruntime-web (once per module instance) and applies `env`. */
export async function loadOrt(env: OrtEnvOptions = {}): Promise<OrtLike> {
  const ort = (await import('onnxruntime-web')) as unknown as OrtLike;
  applyEnv(ort, env);
  return ort;
}

export function applyEnv(ort: OrtLike, env: OrtEnvOptions): void {
  if (env.wasmPaths !== undefined) ort.env.wasm.wasmPaths = env.wasmPaths;
  if (env.numThreads !== undefined) ort.env.wasm.numThreads = env.numThreads;
  if (env.proxy !== undefined) ort.env.wasm.proxy = env.proxy;
  if (env.logLevel !== undefined) ort.env.logLevel = env.logLevel;
}

/** faster-whisper's silero_vad_v6.onnx: whole sequences of frames per run(). */
export class SileroVad implements FrameModel {
  readonly name = 'silero-v6-faster-whisper';
  private h = new Float32Array(STATE);
  private c = new Float32Array(STATE);
  private ctx = new Float32Array(CONTEXT);
  private input = new Float32Array((FRAME + CONTEXT) * 64);

  private constructor(
    private readonly ort: OrtLike,
    private readonly session: OrtSessionLike,
  ) {}

  /**
   * @param model the bytes of silero_vad_v6.onnx (or a URL the ORT build can fetch itself)
   */
  static async create(
    model: Uint8Array | ArrayBuffer | string,
    options: SileroVadOptions = {},
  ): Promise<SileroVad> {
    const ort = options.ort ?? (await loadOrt());
    if (options.env) applyEnv(ort, options.env);
    const sessionOptions = {
      ...DEFAULT_SESSION_OPTIONS,
      ...options.sessionOptions,
      executionProviders: ['wasm'],
    };
    return SileroVad.fromSession(ort, await ort.InferenceSession.create(model, sessionOptions));
  }

  static fromSession(ort: OrtLike, session: OrtSessionLike): SileroVad {
    for (const n of ['input', 'h', 'c']) {
      if (!session.inputNames.includes(n)) {
        throw new Error(
          `Not a faster-whisper Silero model: inputs are [${session.inputNames.join(', ')}]`,
        );
      }
    }
    return new SileroVad(ort, session);
  }

  reset(): void {
    this.h = new Float32Array(STATE);
    this.c = new Float32Array(STATE);
    this.ctx = new Float32Array(CONTEXT);
  }

  async predict(frames: Float32Array, n: number): Promise<Float32Array> {
    if (n === 0) return new Float32Array(0);
    const row = FRAME + CONTEXT;
    if (this.input.length < n * row) this.input = new Float32Array(n * row);
    const inp = this.input;
    for (let j = 0; j < n; j++) {
      const base = j * row;
      if (j === 0) inp.set(this.ctx, base);
      else inp.set(frames.subarray((j - 1) * FRAME + FRAME - CONTEXT, j * FRAME), base);
      inp.set(frames.subarray(j * FRAME, (j + 1) * FRAME), base + CONTEXT);
    }
    // the context of the next call is the tail of the last frame of this one
    this.ctx.set(frames.subarray((n - 1) * FRAME + FRAME - CONTEXT, n * FRAME));

    const { Tensor } = this.ort;
    const out = await this.session.run({
      input: new Tensor('float32', inp.subarray(0, n * row), [n, row]),
      h: new Tensor('float32', this.h, [1, 1, STATE]),
      c: new Tensor('float32', this.c, [1, 1, STATE]),
    });
    this.h = Float32Array.from(out['hn'].data as Float32Array);
    this.c = Float32Array.from(out['cn'].data as Float32Array);
    return Float32Array.from(out['speech_probs'].data as Float32Array);
  }

  async dispose(): Promise<void> {
    await this.session.release?.();
  }
}
