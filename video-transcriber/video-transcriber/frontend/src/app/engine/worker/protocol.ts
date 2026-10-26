/**
 * Messages between the page and the engine worker (ARCHITECTURE.md section 4, extended). One engine worker runs one
 * job pipeline at a time; the page keeps the queue (engine/jobs JobRunner) and the Hinglish worker.
 *
 *   page -> worker   { op: 'run', id, file, options, plan, resume? }      start (or continue after a recycle)
 *                    { op: 'cancel', id }                                cooperative; the page hard-cancels after 2 s
 *   worker -> page   phase | segments | partial | language | progress | warning | log    while it runs
 *                    recycle { state }                                   "restart me" (every 40 windows on WebGPU)
 *                    result { ok: true, result } | { ok: false, cancelled, error }      exactly one per run
 *                      (+ restart: true when a background model load was left running: the page starts a fresh worker)
 *
 * Segments carry the server's Segment shape (core/models.ts) after the post rules (segment filter, confidence,
 * original_text), before the Hinglish conversion, which the page applies (it owns the shared Hinglish worker).
 */
import type { JobOptions, Segment } from '../../core/models';
import type { DroppedCounts } from '../post/segment';
import type { SpeechChunk } from '../post/words';
import type { QwenChunk, QwenLoopState } from '../qwen/qwen-chunks';

export type EnginePhase = 'extracting' | 'loading_model' | 'transcribing';

/** What the worker needs to know about the device (from engine/device planFor). */
export interface WorkerPlan {
  backend: 'webgpu' | 'wasm';
  shaderF16: boolean;
  /** restart the worker after this many windows (0 = never): 40 on WebGPU, see ARCHITECTURE section 3 */
  recycleEvery: number;
  /**
   * The visitor agreed to load the ffmpeg.wasm converter (engine/audio ffmpeg.ts) for files WebCodecs cannot open.
   * Without it such files end with the "convert it to MP3, M4A or WAV first" message.
   */
  converter?: boolean;
  /**
   * `deviceMemory <= 4`: decode with `collect: false` and keep only the speech around the current window
   * (ARCHITECTURE section 3; engine/worker timeline.ts StreamingTimeline). Whisper only.
   */
  lowMemory?: boolean;
}

export interface RunRequest {
  op: 'run';
  id: string;
  file: Blob;
  options: JobOptions;
  plan: WorkerPlan;
  /** continue a run that a recycle interrupted (decode and VAD are not repeated) */
  resume?: ResumeState;
}

export interface CancelRequest {
  op: 'cancel';
  id: string;
}

export type EngineRequest = RunRequest | CancelRequest;

/** Everything a fresh worker needs to continue a job where the previous one stopped. */
export interface ResumeState {
  pcm: Int16Array;
  scale: number;
  samples: number;
  /** seconds of the original audio */
  duration: number;
  /** the speech pieces (sample ranges of the original audio); null = VAD off, the whole file */
  chunks: SpeechChunk[] | null;
  /** faster-whisper's `seek`, in 10 ms frames of the speech timeline */
  seek: number;
  /** segments emitted so far (the `since` of the next segments event) */
  emitted: number;
  filter: FilterState;
  language: string | null;
  languageProbability: number;
  /** previous text for condition-on-previous-text */
  context: string;
  lastSpeechTimestamp: number;
  windowsDone: number;
  wordTimestamps: boolean;
  /** low-memory mode: `pcm` is empty, the resumed worker decodes again and skips to `seek` */
  streaming?: boolean;
  /** Qwen3-ASR: the chunk plan and where the per-chunk loop continues */
  qwen?: { plan: QwenChunk[]; loop: QwenLoopState };
}

export interface FilterState {
  repeats: number;
  lastNorm: string | null;
  kept: number;
  dropped: DroppedCounts;
}

export interface WorkerError {
  /** DecodeError / ModelError code, 'cancelled', 'webgpu-lost', 'oom', 'too-short', 'worker-crashed' or 'failed' */
  code: string;
  /** shown on the page */
  userMessage: string;
  /** shown on the Logs page only */
  technical: string;
}

export interface JobResult {
  language: string | null;
  /** null for Qwen3-ASR, which reports no language probability (the server's None) */
  language_probability: number | null;
  duration: number;
  dropped: DroppedCounts;
  windows: number;
}

export type EngineEvent =
  | { type: 'phase'; id: string; phase: EnginePhase; progress: number; eta: number | null }
  | {
      type: 'segments';
      id: string;
      segments: Segment[];
      /** index of the first of these segments in the whole transcript */
      since: number;
      /** live progress after the last of them: min(end / duration, 1) on the original timeline */
      progress: number;
      language: string | null;
      duration: number;
      /**
       * The language the Hinglish step converts these segments with, when it is not the job language: Qwen3-ASR
       * converts each chunk by the language detected in it (qwen_engine `detected or language`).
       */
      romanizeLanguage?: string | null;
    }
  | { type: 'partial'; id: string; text: string }
  | {
      type: 'language';
      id: string;
      language: string;
      probability: number;
      candidates: { language: string; probability: number }[];
    }
  | { type: 'progress'; id: string; kind: 'download' | 'decode'; loaded: number; total: number; file?: string }
  | { type: 'warning'; id: string; code: string; message: string }
  | { type: 'log'; id: string; level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR'; message: string };

export type EngineMessage =
  | EngineEvent
  | { type: 'recycle'; id: string; state: ResumeState }
  | { type: 'result'; id: string; ok: true; result: JobResult; restart?: boolean }
  | { type: 'result'; id: string; ok: false; cancelled: boolean; error: WorkerError; restart?: boolean };
