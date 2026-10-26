/**
 * Shared types and constants of the VAD + windowing module.
 *
 * Every sample offset in this folder is an ABSOLUTE index into the 16 kHz mono stream (0 = first sample of
 * the file); `end` is exclusive. Seconds are only used at the edges (options, display).
 */

/** Silero VAD only supports 8 kHz and 16 kHz; the engine always decodes to 16 kHz mono. */
export const SAMPLE_RATE = 16000;
/** Samples per VAD frame (32 ms at 16 kHz): faster-whisper's `window_size_samples`. */
export const FRAME = 512;
/** Samples of left context Silero v5/v6 want in front of each frame (the tail of the previous frame). */
export const CONTEXT = 64;

export interface SpeechSegment {
  /** first sample (inclusive) */
  start: number;
  /** last sample + 1 (exclusive) */
  end: number;
}

/**
 * Mirrors faster_whisper.vad.VadOptions (faster-whisper 1.2.1) field for field. Durations keep
 * faster-whisper's units (ms / s) so the Python call sites can be compared line by line.
 */
export interface VadParams {
  /** Probability >= threshold is speech. */
  threshold: number;
  /** Probability < negThreshold ends speech. Default max(threshold - 0.15, 0.01). */
  negThreshold?: number;
  /** Segments of at most this many ms are dropped (only in the silence-terminated branch). */
  minSpeechDurationMs: number;
  /** Longer speech is split at the last pause > 98 ms, else hard-split. Infinity = never. */
  maxSpeechDurationS: number;
  /** Silence this long closes a segment. */
  minSilenceDurationMs: number;
  /** Padding added to both sides of every segment (neighbours share the gap when it is < 2 x pad). */
  speechPadMs: number;
}

/** faster-whisper's own defaults (VadOptions()). */
export const FASTER_WHISPER_DEFAULTS: VadParams = {
  threshold: 0.5,
  minSpeechDurationMs: 0,
  maxSpeechDurationS: Infinity,
  minSilenceDurationMs: 2000,
  speechPadMs: 400,
};

/**
 * What backend/app/engine.py passes for every Whisper model:
 *   vad_parameters=dict(threshold=0.45, min_silence_duration_ms=500, speech_pad_ms=400)
 * (faster-whisper's WhisperModel.transcribe keeps max_speech_duration_s = inf and concatenates all speech
 * chunks into one long stream.)
 */
export const WHISPER_VAD: VadParams = {
  threshold: 0.45,
  minSpeechDurationMs: 0,
  maxSpeechDurationS: Infinity,
  minSilenceDurationMs: 500,
  speechPadMs: 400,
};

/**
 * WHISPER_VAD plus the 30 s cap that faster-whisper's BatchedInferencePipeline adds
 * (max_speech_duration_s = chunk_length). The browser decodes every window independently, so a speech run
 * must fit a window; the cap also bounds the streaming memory. This is the engine's default for Whisper.
 */
export const WHISPER_VAD_30S: VadParams = { ...WHISPER_VAD, maxSpeechDurationS: 30 };

/** backend/app/qwen_engine.py: VadOptions(min_silence_duration_ms=300, speech_pad_ms=100), threshold 0.5. */
export const QWEN_VAD: VadParams = {
  threshold: 0.5,
  minSpeechDurationMs: 0,
  maxSpeechDurationS: Infinity,
  minSilenceDurationMs: 300,
  speechPadMs: 100,
};

/**
 * A model that turns whole 512-sample frames into speech probabilities. It owns whatever state it needs
 * (LSTM state, the 64-sample context, an adaptive noise floor...), so calls must be made in stream order.
 */
export interface FrameModel {
  readonly name: string;
  /** `frames` holds n whole frames back to back (n * 512 samples). Returns n probabilities in [0, 1]. */
  predict(frames: Float32Array, n: number): Promise<Float32Array>;
  /** Forget all state (start of a new stream). */
  reset(): void;
  /** Release native resources (ORT session). */
  dispose?(): Promise<void>;
}
