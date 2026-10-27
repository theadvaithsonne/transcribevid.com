/**
 * Public types of the in-browser Whisper engine. Field names follow the spike report
 * (docs/in-browser/spike/asr.md, "The reference worker API") so the worker host and the job runner
 * can map them onto the server's Segment / Word shapes without renaming.
 */

export type Device = 'webgpu' | 'wasm';

/** One dtype for every ONNX file, or one per file stem (`encoder_model`, `decoder_model_merged`). */
export type DtypeSpec = string | { encoder_model?: string; decoder_model_merged?: string };

export interface LoadOptions {
  /** Hugging Face repo, e.g. 'onnx-community/whisper-base_timestamped'. */
  repo: string;
  device: Device;
  dtype?: DtypeSpec;
  /** onnxruntime session options passed through to Transformers.js. */
  sessionOptions?: Record<string, unknown>;
}

export interface ProgressInfo {
  status: 'initiate' | 'download' | 'progress' | 'done' | 'ready';
  file?: string;
  /** Bytes of the whole model loaded so far. */
  loaded: number;
  /** Bytes of the whole model (known up-front from the registry's file metadata; 0 when unknown). */
  total: number;
  /** 0..100 */
  progress: number;
  fileLoaded?: number;
  fileTotal?: number;
  /** a short status for the page while the download is not simply running ("Waiting for the internet connection…") */
  note?: string;
}

export interface PartialInfo {
  text: string;
  tokens: number;
  ms: number;
}

export interface TranscribeOptions {
  /** ISO 639-1 code; null / undefined = detect on this window. */
  language?: string | null;
  task?: 'transcribe' | 'translate';
  /** 1 = greedy (default), 5 = the server's beam search. */
  beamSize?: number;
  /** Samples per fallback temperature > 0 (default 5). */
  bestOf?: number;
  /** Fallback ladder (default [0, 0.2, 0.4, 0.6, 0.8, 1.0]); [0] disables the ladder. */
  temperatures?: number[];
  /** null disables the test (default 2.4). */
  compressionRatioThreshold?: number | null;
  /** null disables the test (default -1.0). */
  logProbThreshold?: number | null;
  /** null disables the test (default 0.6). */
  noSpeechThreshold?: number | null;
  /** Vocabulary hint or the previous window's text; goes in as <|startofprev|> prompt <|sot|>. */
  prompt?: string | null;
  /** Segment timestamp tokens (default true). */
  timestamps?: boolean;
  /** Run the alignment pass for per-word times and probabilities (default false). */
  wordTimestamps?: boolean;
  /** Per window; default 224, hard limit 447. */
  maxNewTokens?: number;
  repetitionPenalty?: number;
  noRepeatNgramSize?: number;
  /** Seed of the sampling PRNG (default 1234). */
  seed?: number;
  /** Added to every returned time (the window's start in the file). */
  offsetSeconds?: number;
  onPartial?: (p: PartialInfo) => void;
  /** Minimum gap between two onPartial calls (default 150 ms). */
  partialIntervalMs?: number;
  /** Include per-token log-probabilities of the chosen attempt in the result. */
  debugTokens?: boolean;
  /**
   * Prefix of the teacher-forced alignment pass. 'notimestamps' (default) = [sot, lang, task,
   * <|notimestamps|>] like openai-whisper, so the first word of a window gets a fair probability.
   * 'sot-lang-task' = what CTranslate2 / faster-whisper use (the first word scores low).
   */
  alignPrefix?: 'notimestamps' | 'sot-lang-task';
}

export interface Word {
  word: string;
  start: number;
  end: number;
  probability: number;
}

export interface Segment {
  start: number;
  end: number;
  text: string;
  /** True when the model stopped before closing the segment with a timestamp (end = best guess). */
  unfinished?: boolean;
  words: Word[];
  avgLogprob: number;
  noSpeechProb: number;
  compressionRatio: number;
  temperature: number;
  confidence: number;
  tokens: number[];
}

export interface FallbackAttempt {
  temperature: number;
  avgLogprob: number;
  compressionRatio: number;
  tokens: number;
  ms: number;
}

export interface WindowResult {
  language: string;
  languageProbability: number;
  /** Top 5 (language, probability), descending. */
  languageProbabilities: Array<[string, number]>;
  languageDetected: boolean;
  noSpeechProb: number;
  text: string;
  segments: Segment[];
  words: Word[];
  confidence: number;
  /**
   * Seconds of the window that the decoded segments cover, with faster-whisper's seek rule: the whole
   * window when the sequence ends with a single closing timestamp (or has no segment boundary),
   * otherwise the end of the last completed segment. The next window must start at
   * `window start + consumedSeconds`.
   */
  consumedSeconds: number;
  singleTimestampEnding: boolean;
  avgLogprob: number;
  compressionRatio: number;
  temperature: number;
  fallbacks: FallbackAttempt[];
  tokens: number[];
  tokenLogprobs?: number[];
  timings: Record<string, number>;
}

export interface LanguageResult {
  language: string;
  probability: number;
  /** All languages, descending. */
  probabilities: Array<[string, number]>;
  noSpeechProb: number;
}

export interface LoadInfo {
  repo: string;
  device: Device;
  ms: { total: number; filesAndTokenizer: number; sessions: number };
  hasCrossAttentions: boolean;
  alignmentHeads: number;
  multilingual: boolean;
  files: string[];
}

export class CancelledError extends Error {
  constructor() {
    super('cancelled');
    this.name = 'CancelledError';
  }
}

export function isCancelled(error: unknown): boolean {
  return error instanceof CancelledError || (error as { name?: string })?.name === 'CancelledError';
}
