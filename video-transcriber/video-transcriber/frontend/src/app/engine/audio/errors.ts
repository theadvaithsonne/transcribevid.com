/**
 * Error taxonomy for "media file -> 16 kHz PCM" (spike/audio.md section 8). Every failure has a stable `code` (for
 * logic and tests), a plain-language `userMessage` (the page shows only this) and a `technical` reason (the Logs page).
 * The CORRUPT, NO_AUDIO_TRACK and TOO_SHORT sentences are the Python engine's own (backend/app/engine.py).
 *
 * v1 ships no ffmpeg.wasm (owner decision), so containers the browser path cannot parse (AVI, WMA, FLV, MPG, raw AMR,
 * AIFF, CAF ...) end as NOT_MEDIA with the "convert this file first" advice.
 */

export type DecodeErrorCode =
  /** 0 bytes */
  | 'EMPTY_FILE'
  /** container not recognised at all (also every container we have no demuxer for) */
  | 'NOT_MEDIA'
  /** container fine, no audio stream (screen recording without sound) */
  | 'NO_AUDIO_TRACK'
  /** recognised but unreadable: MP4 / MOV without its `moov` box, required atoms missing */
  | 'CORRUPT'
  /** audio codec known but this browser cannot decode it (AC-3, E-AC-3, DTS, AMR, ALAC, WMA ...) */
  | 'UNSUPPORTED_CODEC'
  /** encrypted track (CENC / FairPlay / PlayReady / Widevine) */
  | 'DRM_PROTECTED'
  /** larger than the decodeAudioData fallback can hold (never a limit of the streaming path) */
  | 'TOO_LARGE'
  /** an allocation failed while decoding */
  | 'OUT_OF_MEMORY'
  /** decoded fine but under 0.3 s of audio (engine rule) */
  | 'TOO_SHORT'
  /** no AudioDecoder and the fallback could not read the file either */
  | 'NO_WEBCODECS'
  /** the AbortSignal fired */
  | 'CANCELLED'
  /** anything else; the reason is in `technical` */
  | 'DECODE_FAILED';

export const DECODE_ERROR_CODES: readonly DecodeErrorCode[] = [
  'EMPTY_FILE',
  'NOT_MEDIA',
  'NO_AUDIO_TRACK',
  'CORRUPT',
  'UNSUPPORTED_CODEC',
  'DRM_PROTECTED',
  'TOO_LARGE',
  'OUT_OF_MEMORY',
  'TOO_SHORT',
  'NO_WEBCODECS',
  'CANCELLED',
  'DECODE_FAILED',
];

/** What the page can offer next. */
export type DecodeSuggestion = 'convert-first' | 'redownload' | 'use-desktop-browser' | 'none';

export interface DecodeErrorInit {
  code: DecodeErrorCode;
  /** Codec id or name, e.g. 'ac3', 'samr', 'alac'; shown to the user through friendlyCodec(). */
  codec?: string | null;
  container?: string | null;
  technical?: string;
  cause?: unknown;
  suggestion?: DecodeSuggestion;
}

export class DecodeError extends Error {
  readonly code: DecodeErrorCode;
  readonly codec: string | null;
  readonly container: string | null;
  readonly technical: string;
  readonly suggestion: DecodeSuggestion;
  readonly userMessage: string;

  constructor(init: DecodeErrorInit) {
    const userMessage = messageFor(init);
    super(userMessage);
    this.name = 'DecodeError';
    this.code = init.code;
    this.codec = init.codec ?? null;
    this.container = init.container ?? null;
    this.technical = init.technical ?? '';
    this.suggestion = init.suggestion ?? defaultSuggestion(init.code);
    this.userMessage = userMessage;
    if (init.cause !== undefined) (this as { cause?: unknown }).cause = init.cause;
  }
}

function defaultSuggestion(code: DecodeErrorCode): DecodeSuggestion {
  switch (code) {
    case 'NOT_MEDIA':
    case 'UNSUPPORTED_CODEC':
    case 'DECODE_FAILED':
      return 'convert-first';
    case 'CORRUPT':
      return 'redownload';
    case 'TOO_LARGE':
    case 'OUT_OF_MEMORY':
    case 'NO_WEBCODECS':
      return 'use-desktop-browser';
    default:
      return 'none';
  }
}

const CONVERT_HINT =
  'Convert it to MP3, M4A or WAV first (for example with VLC, HandBrake or an online converter) and add the converted file.';

/**
 * The sentence the page shows. It never contains `technical`, a stack trace or "undefined": the technical reason
 * goes to the Logs page only.
 */
export function messageFor(init: Pick<DecodeErrorInit, 'code' | 'codec'>): string {
  const codec = init.codec ? friendlyCodec(init.codec) : null;
  switch (init.code) {
    case 'EMPTY_FILE':
      return 'This file is empty (0 bytes), so there is nothing to transcribe. Check that it finished downloading or saving.';
    case 'NOT_MEDIA':
      return `This does not look like an audio or video file that we can read. It may be damaged, or it may be a format your browser cannot open here (such as AVI, WMA or FLV). ${CONVERT_HINT}`;
    case 'NO_AUDIO_TRACK':
      return 'This file has no audio track. Videos recorded without sound (some screen recordings, animated clips) cannot be transcribed.';
    case 'CORRUPT':
      return 'The file is corrupted or not a supported media format. It may have been cut off while downloading or saving - try downloading or exporting it again.';
    case 'UNSUPPORTED_CODEC':
      return codec
        ? `This file uses the ${codec} audio format, which your browser cannot decode. ${CONVERT_HINT}`
        : `This file uses an audio format that your browser cannot decode. ${CONVERT_HINT}`;
    case 'DRM_PROTECTED':
      return 'This file is copy-protected (DRM-encrypted), so it cannot be read. Protected purchases and streaming downloads cannot be transcribed; use an unprotected recording instead.';
    case 'TOO_LARGE':
      return 'This file is too large for the method your browser has to use to read it. Try a desktop version of Chrome or Edge, which can read files of any size, or split or convert the file first.';
    case 'OUT_OF_MEMORY':
      return 'Your device ran out of memory while reading this file. Close other tabs and try again, use a computer instead of a phone, or use a shorter file.';
    case 'TOO_SHORT':
      return 'The audio is too short to transcribe.';
    case 'NO_WEBCODECS':
      return 'This browser is too old to read this kind of file. Please update it, or use a recent version of Chrome, Edge, Firefox or Safari.';
    case 'CANCELLED':
      return 'Cancelled.';
    case 'DECODE_FAILED':
    default:
      return 'This file could not be read. Try converting it to MP3, M4A or WAV and adding it again.';
  }
}

const CODEC_NAMES: Record<string, string> = {
  ac3: 'Dolby Digital (AC-3)',
  'ac-3': 'Dolby Digital (AC-3)',
  eac3: 'Dolby Digital Plus (E-AC-3)',
  'ec-3': 'Dolby Digital Plus (E-AC-3)',
  dts: 'DTS',
  dca: 'DTS',
  dtsc: 'DTS',
  wma: 'Windows Media Audio (WMA)',
  wmav1: 'Windows Media Audio (WMA)',
  wmav2: 'Windows Media Audio (WMA)',
  wmapro: 'Windows Media Audio Pro',
  amr: 'AMR',
  amr_nb: 'AMR-NB (phone voice)',
  amr_wb: 'AMR-WB (phone voice)',
  samr: 'AMR-NB (phone voice)',
  sawb: 'AMR-WB (phone voice)',
  alac: 'Apple Lossless (ALAC)',
  ape: "Monkey's Audio (APE)",
  wavpack: 'WavPack',
  tta: 'TTA',
  truehd: 'Dolby TrueHD',
  mlp: 'Dolby TrueHD',
  qcelp: 'QCELP',
  evrc: 'EVRC',
  speex: 'Speex',
  gsm: 'GSM',
  atrac3: 'ATRAC3',
  real: 'RealAudio',
  ra: 'RealAudio',
  cook: 'RealAudio',
};

/** A codec id as words a visitor may recognise ('samr' -> 'AMR-NB (phone voice)'); unknown ids upper-cased. */
export function friendlyCodec(codec: string): string {
  const key = codec.trim().toLowerCase();
  return CODEC_NAMES[key] ?? codec.trim().toUpperCase();
}

// ---- crossing a worker boundary (structured clone drops the fields of Error subclasses) ----

export interface SerializedDecodeError {
  code: DecodeErrorCode;
  codec: string | null;
  container: string | null;
  technical: string;
  suggestion: DecodeSuggestion;
  userMessage: string;
}

export function serializeError(e: unknown): SerializedDecodeError {
  const err = e instanceof DecodeError ? e : toDecodeError(e);
  return {
    code: err.code,
    codec: err.codec,
    container: err.container,
    technical: err.technical,
    suggestion: err.suggestion,
    userMessage: err.userMessage,
  };
}

export function reviveError(s: SerializedDecodeError): DecodeError {
  return new DecodeError({
    code: s.code,
    codec: s.codec,
    container: s.container,
    technical: s.technical,
    suggestion: s.suggestion,
  });
}

/** Anything that is not a DecodeError yet becomes DECODE_FAILED with its name and message as `technical`. */
export function toDecodeError(e: unknown): DecodeError {
  if (e instanceof DecodeError) return e;
  const err = e as { name?: string; message?: string } | null;
  return new DecodeError({
    code: 'DECODE_FAILED',
    technical: `${err?.name ?? 'Error'}: ${err?.message ?? String(e)}`,
    cause: e,
  });
}

/**
 * Turn whatever mediabunny / WebCodecs threw into a DecodeError with a stable code. The checks are on the message
 * because the browsers throw plain DOMExceptions / TypeErrors whose class says little.
 */
export function classifyError(
  e: unknown,
  ctx: { signal?: AbortSignal; container?: string | null; codec?: string | null } = {},
): DecodeError {
  if (e instanceof DecodeError) return e;
  if (ctx.signal?.aborted) return new DecodeError({ code: 'CANCELLED', cause: e });
  const err = e as { name?: string; message?: string } | null;
  const name = err?.name ?? 'Error';
  const msg = String(err?.message ?? e);
  if (/encrypt/i.test(msg)) {
    return new DecodeError({
      code: 'DRM_PROTECTED',
      technical: msg,
      cause: e,
      container: ctx.container,
    });
  }
  if (
    name === 'NotSupportedError' ||
    /cannot be decoded in this environment|Unsupported configuration|not supported|NotSupportedError/i.test(
      msg,
    )
  ) {
    return new DecodeError({
      code: 'UNSUPPORTED_CODEC',
      codec: ctx.codec,
      technical: msg,
      cause: e,
      container: ctx.container,
    });
  }
  if (
    /allocation failed|out of memory|Invalid typed array length|Array buffer allocation|Invalid array length/i.test(
      msg,
    ) ||
    (name === 'RangeError' && /memory|allocation|length/i.test(msg))
  ) {
    return new DecodeError({ code: 'OUT_OF_MEMORY', technical: msg, cause: e });
  }
  return new DecodeError({
    code: 'DECODE_FAILED',
    technical: `${name}: ${msg}`,
    cause: e,
    container: ctx.container,
  });
}
