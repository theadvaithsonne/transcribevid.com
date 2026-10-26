import type { DecodeError } from './errors';
import type { MediaOpener } from './media-source';
import type { PipelineOptions } from './pipeline';
import type { CleanupActivity } from './cleanup';

export type DecodePath = 'webcodecs' | 'webaudio';

export interface DecodeProgress {
  /** Seconds of source audio processed so far. */
  processedSeconds: number;
  /** Best estimate of the total, or null when unknown. */
  totalSeconds: number | null;
  /** 0..1, or null when the total is unknown. */
  fraction: number | null;
  /** Wall-clock seconds since decoding started. */
  elapsedSeconds: number;
  /** processedSeconds / elapsedSeconds. */
  xRealtime: number;
  phase: 'probing' | 'decoding' | 'finishing';
}

export type DecodeWarningType =
  | 'truncated'
  | 'gap'
  | 'start-offset'
  | 'format-change'
  | 'decode-error'
  | 'clipped'
  | 'multiple-audio-tracks'
  | 'track-skipped';

export interface DecodeWarning {
  type: DecodeWarningType;
  /** A sentence for the visitor. */
  message: string;
  atSeconds?: number;
  seconds?: number;
  details?: Record<string, unknown>;
}

export interface DecodeOptions {
  signal?: AbortSignal;
  /** Throttled to about 10 calls per second; a throwing callback never breaks decoding. */
  onProgress?: (p: DecodeProgress) => void;
  /**
   * Receives every 16 kHz mono Float32 chunk as soon as it exists (before Int16 packing). The array is only valid
   * during the call: copy it to keep it. Return a promise for back-pressure.
   */
  onChunk?: (chunk: Float32Array, info: { startSample: number }) => void | Promise<void>;
  /** Keep the Int16 result in memory (default true). false: `pcm` comes back empty, use onChunk. */
  collect?: boolean;
  /** Clean-up / down-mix / resampler settings (default: ffmpeg-order clean-up, ffmpeg down-mix matrix). */
  pipeline?: PipelineOptions;
  /** 0-based index among the file's audio tracks. Default: the first decodable one (ffmpeg's -map 0:a:0). */
  trackIndex?: number;
  /** Holes between decoded blocks: ffmpeg's default is to leave them ('none'). */
  gapFill?: 'none' | 'silence';
  /** Pad the start with silence when the audio starts late (default false = ffmpeg; the offset is reported). */
  padStart?: boolean;
  /** Return what was decoded when the stream breaks half-way (default true, like ffmpeg). */
  partialOnError?: boolean;
  /** Fail below this duration (default 0.3 s, the Python engine's rule). */
  minSeconds?: number;
  /**
   * Opens the file and decodes its audio blocks. Default: mediabunny + WebCodecs (media-source.ts). The specs pass a
   * fake; passing one also means "WebCodecs is available".
   */
  opener?: MediaOpener;
}

export interface SourceInfo {
  container: string | null;
  mimeType: string | null;
  fileBytes: number;
  trackCount: number;
  audioTrackCount: number;
  hasVideo: boolean;
  trackIndex: number;
  codec: string | null;
  internalCodecId: string | number | null;
  sampleRate: number;
  channels: number;
  durationMetaSeconds: number | null;
  durationComputedSeconds: number | null;
}

export interface DecodeResult {
  /** PCM16 at 16 kHz mono; float = pcm[i] * scale. Empty when `collect: false`. */
  pcm: Int16Array;
  /** 1/32768, or 1/16384 when several channels were mixed with the ffmpeg matrix (headroom bit). */
  scale: number;
  sampleRate: 16000;
  samples: number;
  durationSeconds: number;
  /**
   * Timestamp of the first decoded sample in the container. Add it to transcript times to line up with the player
   * (the Python engine ignores it; nothing is padded unless `padStart`).
   */
  startOffsetSeconds: number;
  path: DecodePath;
  source: SourceInfo;
  warnings: DecodeWarning[];
  /** true when the stream ended early or broke (a partial result). */
  truncated: boolean;
  stats: {
    wallMs: number;
    /** time inside the container + decoder (awaiting samples) */
    demuxDecodeMs: number;
    /** time inside clean-up / resampling / packing */
    dspMs: number;
    xRealtime: number;
    peakAbs: number;
    clippedSamples: number;
    cleanupActive: CleanupActivity | null;
    samplesIn: number;
  };
}

export interface ProbeTrack {
  index: number;
  codec: string | null;
  internalCodecId: string | number | null;
  sampleRate: number;
  channels: number;
  /** The browser can decode it (mediabunny asks AudioDecoder.isConfigSupported; PCM is decoded in software). */
  canDecode: boolean;
  /** Which optional WASM decoder would make it decodable (not shipped in v1, see README). */
  needsExtension: 'ac3' | 'dts' | null;
  durationSeconds: number | null;
  language: string;
  name: string | null;
}

export interface ProbeOk {
  ok: true;
  container: string;
  mimeType: string | null;
  fileBytes: number;
  /** Duration of the chosen audio track (computed from the packets, metadata as a fallback). */
  durationSeconds: number | null;
  hasVideo: boolean;
  audioTracks: ProbeTrack[];
  /** Index into audioTracks that decodeMedia would use. */
  chosen: number;
  /** The chosen track can be decoded by this browser. */
  canDecode: boolean;
  channels: number;
  sampleRate: number;
}

export interface ProbeFail {
  ok: false;
  error: DecodeError;
  /** The decodeAudioData fallback might still read the file (the main thread only). */
  fallbacks: 'webaudio'[];
}

export type ProbeResult = ProbeOk | ProbeFail;
