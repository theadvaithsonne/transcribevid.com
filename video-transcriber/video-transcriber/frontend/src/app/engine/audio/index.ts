/**
 * Public API of the audio module: any media file -> 16 kHz mono PCM, cleaned up like the Python engine.
 *
 *   const r = await decodeMedia(file, { signal, onProgress });
 *   r.pcm, r.scale                                  Int16 16 kHz mono; float = pcm[i] * scale
 *   int16ToFloat32(r.pcm, r.scale, start, end)      a window for the VAD / Whisper
 *   r.warnings                                      truncated file, late start, several audio tracks, gaps ...
 *
 * Decoder order (spike/audio.md section 10):
 *   1. WebCodecs through mediabunny (streaming, any size, window or worker)
 *   2. decodeAudioData, on the main thread only, when WebCodecs is missing or could not read the file
 *   3. ffmpeg.wasm (ffmpeg.ts), in a worker only and only with `ffmpeg` set (the visitor agreed to the 9 MB download),
 *      for AVI, WMA / WMV, FLV, MPG, AMR, AIFF / AU / CAF, ALAC, AC-3 / E-AC-3 / DTS and the like
 *   4. the first error, which for unknown containers says "convert this file to MP3, M4A or WAV first"
 * Errors that no other decoder can fix (empty, no audio track, cut-off MP4, DRM, cancelled, too short, out of memory)
 * are thrown at once.
 */
import { decodeWithWebCodecs, hasWebCodecsAudio } from './decode';
import { DecodeError, DecodeErrorCode, toDecodeError } from './errors';
import { canRunFfmpeg, decodeWithFfmpeg, FFMPEG_RETRY_CODES, FfmpegFallbackOptions } from './ffmpeg';
import type { DecodeOptions, DecodePath, DecodeResult } from './types';
import { WebAudioOptions, decodeWithWebAudio, hasDecodeAudioData } from './webaudio';

export * from './types';
export {
  DECODE_ERROR_CODES,
  DecodeError,
  classifyError,
  friendlyCodec,
  messageFor,
  reviveError,
  serializeError,
  toDecodeError,
} from './errors';
export type {
  DecodeErrorCode,
  DecodeErrorInit,
  DecodeSuggestion,
  SerializedDecodeError,
} from './errors';
export { decodeWithWebCodecs, hasWebCodecsAudio, probeMedia } from './decode';
export { decodeWithWebAudio, defaultMemoryBudget, hasDecodeAudioData } from './webaudio';
export type { WebAudioOptions } from './webaudio';
export { PCM_SAMPLE_RATE, Pcm16Builder, int16ToFloat32 } from './pcm';
export { openWithMediabunny } from './media-source';
export type {
  DecodedBlock,
  MediaAudioTrack,
  MediaOpener,
  MediaTrackInfo,
  OpenedMedia,
} from './media-source';
export type { PipelineOptions } from './pipeline';
export { canRunFfmpeg, FFMPEG_CORE_BASE, FFMPEG_CORE_FILES, FFMPEG_CORE_VERSION, FFMPEG_DOWNLOAD_MB } from './ffmpeg';
export type { FfmpegFallbackOptions } from './ffmpeg';

export interface DecodeMediaOptions extends DecodeOptions {
  /** Allow decodeAudioData as a fallback (main thread only). Default true. */
  allowWebAudio?: boolean;
  /** Options for the fallback (memory budget, ...). */
  webAudio?: Pick<WebAudioOptions, 'memoryBudgetBytes' | 'assumeChannels' | 'mediaDuration'>;
  /** Tells the UI which decoder is being tried, and why the previous one gave up. */
  onPath?: (path: DecodePath, why?: DecodeError) => void;
  /**
   * Allow the ffmpeg.wasm converter as the last decoder (worker only). Only set it when the visitor agreed to the
   * download; absent / null = the file ends with the browser decoders' error.
   */
  ffmpeg?: FfmpegFallbackOptions | null;
  /** specs only: skip the worker check (they pass a fake core through `ffmpeg.loadCore`) */
  ffmpegAnywhere?: boolean;
}

/** Errors no alternative decoder can fix. */
const TERMINAL: ReadonlySet<DecodeErrorCode> = new Set<DecodeErrorCode>([
  'EMPTY_FILE',
  'NO_AUDIO_TRACK',
  'CORRUPT',
  'DRM_PROTECTED',
  'CANCELLED',
  'TOO_SHORT',
  'OUT_OF_MEMORY',
]);

export async function decodeMedia(
  file: Blob,
  opts: DecodeMediaOptions = {},
): Promise<DecodeResult> {
  let first: DecodeError;
  if (opts.opener || hasWebCodecsAudio()) {
    opts.onPath?.('webcodecs');
    try {
      return await decodeWithWebCodecs(file, opts);
    } catch (e) {
      first = toDecodeError(e);
      if (TERMINAL.has(first.code)) throw first;
    }
  } else {
    first = new DecodeError({ code: 'NO_WEBCODECS', technical: 'AudioDecoder is not available' });
  }

  const onMainThread = typeof document !== 'undefined';
  if (
    opts.allowWebAudio !== false &&
    onMainThread &&
    hasDecodeAudioData() &&
    !opts.signal?.aborted
  ) {
    try {
      opts.onPath?.('webaudio', first);
      return await decodeWithWebAudio(file, { ...opts, ...opts.webAudio });
    } catch (e) {
      const fallbackError = toDecodeError(e);
      if (TERMINAL.has(fallbackError.code) && fallbackError.code !== 'OUT_OF_MEMORY') {
        throw fallbackError;
      }
      // Without WebCodecs the fallback was the only decoder that really read the file, so its answer (TOO_LARGE,
      // UNSUPPORTED_CODEC, ...) is the useful one. Otherwise the first error is more precise: it names the codec
      // or the container.
      if (first.code === 'NO_WEBCODECS') throw fallbackError;
    }
  }
  if (opts.signal?.aborted) throw new DecodeError({ code: 'CANCELLED' });
  if (opts.ffmpeg && FFMPEG_RETRY_CODES.has(first.code) && (opts.ffmpegAnywhere || canRunFfmpeg())) {
    opts.onPath?.('ffmpeg-wasm', first);
    // ffmpeg reads everything the browser does and more: its answer (corrupt, no audio, not media, cancelled,
    // converter unavailable) is the one to show
    return decodeWithFfmpeg(file, { ...opts, ffmpeg: opts.ffmpeg });
  }
  throw first;
}
