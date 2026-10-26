/**
 * Fallback for browsers without AudioDecoder (Safari <= 25, Firefox < 130, Firefox Android): decodeAudioData with
 * the browser's own resampling. MAIN THREAD ONLY (there is no AudioContext in a worker), whole-file, and not
 * cancellable inside the browser's decode.
 *
 * The compressed file AND the decoded float32 audio are in memory at the same time, so it is guarded by a budget from
 * the media duration. The context runs at 16 kHz so the browser resamples while decoding: decoded size is then
 * seconds * 16000 * channels * 4 B (230 MB per hour mono) instead of 1.38 GB per hour at 48 kHz stereo.
 */
import { DecodeError } from './errors';
import { PCM_SAMPLE_RATE, Pcm16Builder } from './pcm';
import { Mono16kPipeline, PipelineOptions } from './pipeline';
import type { DecodeOptions, DecodeResult } from './types';

/**
 * Measured in Chrome 155: peak private memory of a decodeAudioData job is 2.2x (WAV) to 5.3x (AAC / MP3) the decoded
 * float32 size, plus the file and the Int16 result (spike/audio.md section 6).
 */
export const PEAK_FACTOR = 5.3;

export function hasDecodeAudioData(): boolean {
  return typeof OfflineAudioContext !== 'undefined' || typeof AudioContext !== 'undefined';
}

/** Duration according to the browser's own demuxer (an <audio> element), without decoding. null if unknown. */
export async function mediaElementDuration(file: Blob, timeoutMs = 4000): Promise<number | null> {
  if (typeof document === 'undefined') return null;
  const url = URL.createObjectURL(file);
  try {
    const a = document.createElement('audio');
    a.preload = 'metadata';
    return await new Promise<number | null>((resolve) => {
      const done = (v: number | null) => {
        a.removeAttribute('src');
        a.load();
        resolve(v);
      };
      const timer = setTimeout(() => done(null), timeoutMs);
      a.onloadedmetadata = () => {
        clearTimeout(timer);
        done(Number.isFinite(a.duration) ? a.duration : null);
      };
      a.onerror = () => {
        clearTimeout(timer);
        done(null);
      };
      a.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** 1.5 GiB on desktop, 384 MiB on phones or devices with deviceMemory <= 4. */
export function defaultMemoryBudget(): number {
  const nav =
    typeof navigator !== 'undefined'
      ? (navigator as Navigator & { deviceMemory?: number })
      : undefined;
  const mobile = !!nav && /Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent);
  const low = !!nav?.deviceMemory && nav.deviceMemory <= 4;
  return mobile || low ? 384 * 1024 * 1024 : 1536 * 1024 * 1024;
}

export interface WebAudioOptions extends DecodeOptions {
  /** Budget for compressed + decoded bytes (default defaultMemoryBudget()). */
  memoryBudgetBytes?: number;
  /** Channel count assumed for the budget when only the duration is known (default 2). */
  assumeChannels?: number;
  /** Replaces mediaElementDuration (specs). */
  mediaDuration?: (file: Blob) => Promise<number | null>;
}

export async function decodeWithWebAudio(
  file: Blob,
  options: WebAudioOptions = {},
): Promise<DecodeResult> {
  const t0 = performance.now();
  if (file.size === 0) throw new DecodeError({ code: 'EMPTY_FILE', technical: 'size 0' });
  if (!hasDecodeAudioData()) {
    throw new DecodeError({ code: 'NO_WEBCODECS', technical: 'no AudioContext' });
  }
  if (options.signal?.aborted) throw new DecodeError({ code: 'CANCELLED' });

  // 1. budget check from the browser's idea of the duration (cheap, no decode)
  const budget = options.memoryBudgetBytes ?? defaultMemoryBudget();
  const duration = await (options.mediaDuration ?? mediaElementDuration)(file);
  const channelsGuess = options.assumeChannels ?? 2;
  const estDecoded = duration ? duration * PCM_SAMPLE_RATE * channelsGuess * 4 : null;
  const estPeak = estDecoded !== null ? estDecoded * PEAK_FACTOR + file.size * 2 : null;
  if (estPeak !== null && estPeak > budget) {
    throw new DecodeError({
      code: 'TOO_LARGE',
      technical: `needs about ${Math.round(estPeak / 1048576)} MiB, budget ${Math.round(budget / 1048576)} MiB`,
    });
  }
  if (estPeak === null && file.size > budget / 40) {
    // duration unknown: assume a very low bitrate (about 24 kbps, a 640x blow-up for stereo float)
    throw new DecodeError({
      code: 'TOO_LARGE',
      technical: `duration unknown and the file is ${Math.round(file.size / 1048576)} MiB`,
    });
  }

  // 2. decode + resample to 16 kHz inside the browser
  let data: ArrayBuffer;
  try {
    data = await file.arrayBuffer();
  } catch (e) {
    throw new DecodeError({
      code: 'OUT_OF_MEMORY',
      technical: String((e as Error | null)?.message ?? e),
      cause: e,
    });
  }
  let buffer: AudioBuffer;
  try {
    const ctx =
      typeof OfflineAudioContext !== 'undefined'
        ? new OfflineAudioContext(1, 1, PCM_SAMPLE_RATE)
        : new AudioContext({ sampleRate: PCM_SAMPLE_RATE });
    buffer = await ctx.decodeAudioData(data);
  } catch (e) {
    const err = e as { name?: string; message?: string } | null;
    const msg = String(err?.message ?? e);
    if (err?.name === 'EncodingError' || /unable to decode|encoding/i.test(msg)) {
      throw new DecodeError({
        code: 'UNSUPPORTED_CODEC',
        technical: `decodeAudioData: ${msg}`,
        cause: e,
      });
    }
    if (err?.name === 'RangeError' || /memory|allocation|too large|RangeError/i.test(msg)) {
      throw new DecodeError({ code: 'OUT_OF_MEMORY', technical: msg, cause: e });
    }
    throw new DecodeError({
      code: 'DECODE_FAILED',
      technical: `decodeAudioData: ${err?.name}: ${msg}`,
      cause: e,
    });
  }
  if (options.signal?.aborted) throw new DecodeError({ code: 'CANCELLED' });

  // 3. clean-up + down-mix. The browser already resampled, so the filters run at 16 kHz: equal to ffmpeg's order
  // for 16 kHz sources only (11-17 dB SNR for resampled ones, spike/audio.md section 6).
  const frames = buffer.length;
  const channels = buffer.numberOfChannels;
  const rate = buffer.sampleRate;
  const pipelineOpts: PipelineOptions = {
    downmix: 'ffmpeg',
    cleanup: 'native',
    ...options.pipeline,
  };
  const builder =
    options.collect === false
      ? null
      : new Pcm16Builder({
          expectedSamples: frames * (PCM_SAMPLE_RATE / rate),
          headroomBits: pipelineOpts.downmix === 'ffmpeg' && channels > 1 ? 1 : 0,
        });
  let out = 0;
  const pipe = new Mono16kPipeline(
    rate,
    channels,
    (c) => {
      builder?.append(c);
      // the chunk is complete before the next yield, so back-pressure is not needed here
      void options.onChunk?.(c, { startSample: out });
      out += c.length;
    },
    pipelineOpts,
  );
  const planes = Array.from({ length: channels }, (_, c) => buffer.getChannelData(c));
  const step = 1 << 16;
  const t1 = performance.now();
  for (let s = 0; s < frames; s += step) {
    const n = Math.min(step, frames - s);
    pipe.push(
      planes.map((p) => p.subarray(s, s + n)),
      n,
    );
    if ((s / step) % 8 === 0) {
      const elapsed = (performance.now() - t0) / 1000;
      try {
        options.onProgress?.({
          processedSeconds: s / rate,
          totalSeconds: frames / rate,
          fraction: s / frames,
          elapsedSeconds: elapsed,
          xRealtime: s / rate / Math.max(elapsed, 1e-6),
          phase: 'decoding',
        });
      } catch {
        // a throwing UI callback must never break decoding
      }
      // let the UI breathe and a cancel be seen
      await new Promise((r) => setTimeout(r));
      if (options.signal?.aborted) throw new DecodeError({ code: 'CANCELLED' });
    }
  }
  pipe.finish();
  const dspMs = performance.now() - t1;

  const durationSeconds = out / PCM_SAMPLE_RATE;
  if (durationSeconds < (options.minSeconds ?? 0.3)) {
    throw new DecodeError({
      code: 'TOO_SHORT',
      technical: `${durationSeconds.toFixed(3)} s decoded`,
    });
  }
  const wall = performance.now() - t0;
  return {
    pcm: builder ? builder.finish() : new Int16Array(0),
    scale: builder ? builder.scale : 1 / 32768,
    sampleRate: PCM_SAMPLE_RATE,
    samples: out,
    durationSeconds,
    startOffsetSeconds: 0,
    path: 'webaudio',
    source: {
      container: null,
      mimeType: file.type || null,
      fileBytes: file.size,
      trackCount: 1,
      audioTrackCount: 1,
      hasVideo: false,
      trackIndex: 0,
      codec: null,
      internalCodecId: null,
      sampleRate: rate,
      channels,
      durationMetaSeconds: duration,
      durationComputedSeconds: durationSeconds,
    },
    warnings: [],
    truncated: false,
    stats: {
      wallMs: wall,
      demuxDecodeMs: wall - dspMs,
      dspMs,
      xRealtime: durationSeconds / Math.max(wall / 1000, 1e-6),
      peakAbs: builder ? builder.peakAbs : NaN,
      clippedSamples: builder ? builder.clippedSamples : 0,
      cleanupActive: pipe.cleanupActive,
      samplesIn: frames,
    },
  };
}
