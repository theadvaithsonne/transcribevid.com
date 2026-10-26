/**
 * What both job pipelines of the engine worker share (pipeline.ts for Whisper, qwen-pipeline.ts for Qwen3-ASR): the
 * injected I/O (`PipelineDeps`), the run context, the outcome and the error type.
 */
import type { LanguageResult, LoadInfo, LoadOptions, ProgressInfo, TranscribeOptions, WindowResult } from '../asr/types';
import { CancelledError } from '../asr/types';
import type { DecodeMediaOptions, DecodeResult } from '../audio';
import type { QwenDecodeOptions, QwenDecodeResult } from '../qwen/qwen-engine';
import type { SpeechSegment, VadParams } from '../vad/types';
import type { EngineEvent, JobResult, ResumeState } from './protocol';

/** What the pipeline needs from WhisperEngine (engine/asr). */
export interface AsrEngine {
  readonly hasWordTimestamps: boolean;
  load(o: LoadOptions, onProgress?: (p: ProgressInfo) => void): Promise<LoadInfo>;
  detectLanguage(audio: Float32Array): Promise<LanguageResult>;
  transcribeWindow(audio: Float32Array, o?: TranscribeOptions): Promise<WindowResult>;
  cancel(): void;
  dispose(): Promise<void>;
  /**
   * large-v3 / distil-large-v3: word timing from a second model with the same tokenizer (WhisperEngine.attachAligner).
   * Optional so that a fake without it simply has no word timing.
   */
  attachAligner?(aligner: AsrEngine | null): void;
}

/** What the pipeline needs from QwenEngine (engine/qwen). */
export interface QwenAsr {
  transcribeChunk(audio: Float32Array, o?: QwenDecodeOptions): Promise<QwenDecodeResult>;
  cancel(): void;
  dispose(): Promise<void>;
}

/** Anything a cancel message can reach while it runs. */
export interface Cancellable {
  cancel(): void;
}

export interface VadLike {
  push(chunk: Float32Array): Promise<SpeechSegment[]>;
  flush(): Promise<SpeechSegment[]>;
  /** StreamingVad.retainFrom: decoded audio before this sample is no longer needed (low-memory mode) */
  readonly retainFrom?: number;
}

export interface PipelineDeps {
  decode(file: Blob, o: DecodeMediaOptions): Promise<DecodeResult>;
  /** Silero (with the canary self-test and the energy fallback) behind StreamingVad(params); default WHISPER_VAD */
  createVad(signal: AbortSignal, params?: VadParams): Promise<VadLike>;
  createEngine(): AsrEngine;
  /** engine/models ModelManager.ensure: quota check, per-file download progress, then engine.load */
  ensureModel(
    id: string,
    device: 'webgpu' | 'wasm',
    engine: AsrEngine,
    o: { gpu: { shaderF16: boolean }; onProgress: (p: ProgressInfo) => void },
  ): Promise<unknown>;
  /** The word-timing model for a size without its own (engine/models catalog `aligner`), null when none is needed. */
  alignerFor?(model: string): string | null;
  /** Qwen3-ASR (absent = this worker cannot run it) */
  createQwenEngine?(): QwenAsr;
  /** engine/models ModelManager.ensureQwen: pinned, hash-checked files, then QwenEngine.load */
  ensureQwen?(
    id: string,
    engine: QwenAsr,
    o: { gpu: { shaderF16: boolean }; onProgress: (p: ProgressInfo) => void; signal: AbortSignal },
  ): Promise<unknown>;
}

export interface PipelineContext {
  signal: AbortSignal;
  emit: (e: EngineEvent) => void;
  /** the engine of this run, so a cancel message can reach its decoder loop */
  onEngine?: (engine: Cancellable | null) => void;
  /**
   * The run ends while a model load it started is still going (no speech, an error, a cancel): the page should
   * replace the worker so the load does not keep running next to the next job.
   */
  markDirty?: () => void;
}

export type PipelineOutcome = { kind: 'done'; result: JobResult } | { kind: 'recycle'; state: ResumeState };

/** An error with the page's text (userMessage) and the Logs page's text (technical). */
export class PipelineError extends Error {
  constructor(
    readonly code: string,
    readonly userMessage: string,
    readonly technical = userMessage,
  ) {
    super(userMessage);
    this.name = 'PipelineError';
  }
}

export function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw new CancelledError();
}

/** Waits for `p`, but a cancel returns control at once (engine.py `_BackgroundLoad.result(cancelled)`). */
export function untilAborted<T>(p: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) return Promise.reject(new CancelledError());
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => reject(new CancelledError());
    signal.addEventListener('abort', onAbort, { once: true });
    p.then(
      (v) => {
        signal.removeEventListener('abort', onAbort);
        resolve(v);
      },
      (e) => {
        signal.removeEventListener('abort', onAbort);
        reject(e);
      },
    );
  });
}
