/**
 * Primary decode path: container parsing + WebCodecs AudioDecoder (through mediabunny by default), in a window or a
 * worker.
 *
 *   probeMedia(file)                     cheap look at the file: container, audio tracks, codec support, duration
 *   decodeWithWebCodecs(file, options)   file -> clean-up -> 16 kHz mono Int16 (+ optional Float32 chunk callback)
 *
 * Memory is bounded: the source is read in 8 MiB windows, the decoder keeps a few blocks in flight, and only the
 * 16 kHz Int16 result (115 MB per hour) is retained; with `collect: false` not even that.
 */
import { DecodeError, classifyError, friendlyCodec } from './errors';
import {
  DecodedBlock,
  MediaAudioTrack,
  MediaOpener,
  OpenedMedia,
  openWithMediabunny,
} from './media-source';
import { Mp3Gapless, readMp3Gapless } from './mp3';
import { PCM_SAMPLE_RATE, Pcm16Builder } from './pcm';
import { Mono16kPipeline, PipelineOptions } from './pipeline';
import type {
  DecodeOptions,
  DecodePath,
  DecodeProgress,
  DecodeResult,
  DecodeWarning,
  ProbeResult,
  ProbeTrack,
  SourceInfo,
} from './types';

const YIELD_EVERY_MS = 16;

/**
 * One task turn, so pending events such as an abort can run. In a window a timer turn: Chrome runs MessageChannel
 * tasks ahead of timers, so only this lets a timer, input or a repaint in. In a worker a MessageChannel turn (no 4 ms
 * timer clamping): the cancel arrives there as a message, which it lets in.
 */
function yieldTask(): Promise<void> {
  if (typeof document !== 'undefined' || typeof MessageChannel === 'undefined') {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = () => {
      channel.port1.close();
      resolve();
    };
    channel.port2.postMessage(null);
  });
}

const ISOBMFF_NAMES = new Set(['MP4', 'QuickTime File Format']);
/** Codecs an optional mediabunny WASM extension could decode (@mediabunny/ac3, @mediabunny/dts; not in v1). */
const EXTENSION_CODECS: Record<string, 'ac3' | 'dts'> = { ac3: 'ac3', eac3: 'ac3', dts: 'dts' };
/** Resume steps after damaged data: 0.25, 0.5, 1, 2, 4, 4 ... s, at most this many times. */
const MAX_RESUMES = 20;

export function hasWebCodecsAudio(): boolean {
  return typeof AudioDecoder !== 'undefined' && typeof AudioData !== 'undefined';
}

// ---- opening ----

async function open(file: Blob, opener: MediaOpener, signal?: AbortSignal): Promise<OpenedMedia> {
  if (file.size === 0) throw new DecodeError({ code: 'EMPTY_FILE', technical: 'size 0' });
  if (signal?.aborted) throw new DecodeError({ code: 'CANCELLED' });
  try {
    return await opener(file);
  } catch (e) {
    throw classifyError(e, { signal });
  }
}

/**
 * The error for a file without a usable audio track. A recognised MP4 / MOV with no track at all has lost its `moov`
 * box (cut-off download, interrupted recording): mediabunny reports that as "no tracks" without an error, which would
 * otherwise read as "no audio". Other containers without tracks hold a stream the parser does not know (Speex in Ogg).
 */
function noAudioError(opened: OpenedMedia): DecodeError {
  const { container, trackCount } = opened;
  if (trackCount === 0) {
    return new DecodeError({
      code: ISOBMFF_NAMES.has(container) ? 'CORRUPT' : 'UNSUPPORTED_CODEC',
      container,
      technical: `${container}: no tracks found`,
    });
  }
  return new DecodeError({
    code: 'NO_AUDIO_TRACK',
    container,
    technical: `${trackCount} track(s), none audio`,
  });
}

async function describeTrack(t: MediaAudioTrack, index: number): Promise<ProbeTrack> {
  const info = await t.info();
  const internalName =
    typeof info.internalCodecId === 'string' ? info.internalCodecId.trim() : null;
  return {
    index,
    codec: info.codec ?? internalName,
    internalCodecId: info.internalCodecId,
    sampleRate: info.sampleRate,
    channels: info.channels,
    canDecode: info.canDecode,
    needsExtension: !info.canDecode && info.codec ? (EXTENSION_CODECS[info.codec] ?? null) : null,
    durationSeconds: info.durationMetaSeconds,
    language: info.language,
    name: info.name,
  };
}

/** ffmpeg's `-map 0:a:0`, except that a first track nobody can decode is skipped when a later one can. */
function chooseTrack(tracks: ProbeTrack[], requested?: number): number {
  if (requested !== undefined && requested >= 0 && requested < tracks.length) return requested;
  const ok = tracks.findIndex((t) => t.canDecode);
  return ok >= 0 ? ok : 0;
}

// ---- probing ----

/**
 * Pre-flight check; no audio is decoded. Never throws: failures come back as `{ ok: false, error, fallbacks }`.
 */
export async function probeMedia(
  file: Blob,
  opts: { signal?: AbortSignal; opener?: MediaOpener } = {},
): Promise<ProbeResult> {
  let opened: OpenedMedia | null = null;
  try {
    opened = await open(file, opts.opener ?? openWithMediabunny, opts.signal);
    if (opened.audioTracks.length === 0) {
      const error = noAudioError(opened);
      return {
        ok: false,
        error,
        fallbacks: error.code === 'UNSUPPORTED_CODEC' ? ['webaudio'] : [],
      };
    }
    const described: ProbeTrack[] = [];
    for (let i = 0; i < opened.audioTracks.length; i++) {
      described.push(await describeTrack(opened.audioTracks[i], i));
    }
    const chosen = chooseTrack(described);
    const track = described[chosen];
    const computed = await opened.audioTracks[chosen].computeDuration();
    return {
      ok: true,
      container: opened.container,
      mimeType: opened.mimeType,
      fileBytes: file.size,
      durationSeconds: computed ?? track.durationSeconds,
      hasVideo: opened.hasVideo,
      audioTracks: described,
      chosen,
      canDecode: track.canDecode,
      channels: track.channels,
      sampleRate: track.sampleRate,
    };
  } catch (e) {
    const error = classifyError(e, { signal: opts.signal });
    const retry = error.code === 'NOT_MEDIA' || error.code === 'UNSUPPORTED_CODEC';
    return { ok: false, error, fallbacks: retry ? ['webaudio'] : [] };
  } finally {
    opened?.dispose();
  }
}

// ---- decoding ----

export async function decodeWithWebCodecs(
  file: Blob,
  options: DecodeOptions = {},
): Promise<DecodeResult> {
  const opts = {
    collect: true,
    gapFill: 'none' as const,
    padStart: false,
    partialOnError: true,
    minSeconds: 0.3,
    ...options,
  };
  const { signal } = opts;
  const tStart = performance.now();
  const warnings: DecodeWarning[] = [];

  if (!opts.opener && !hasWebCodecsAudio()) {
    throw new DecodeError({ code: 'NO_WEBCODECS', technical: 'AudioDecoder is not available' });
  }
  report(opts, progressAt(0, null, tStart, 'probing'));

  const opened = await open(file, opts.opener ?? openWithMediabunny, signal);
  const { container, audioTracks } = opened;
  // disposing interrupts pending reads and decoder waits immediately
  const onAbort = () => opened.dispose();
  signal?.addEventListener('abort', onAbort, { once: true });

  try {
    if (signal?.aborted) throw new DecodeError({ code: 'CANCELLED' });

    // ---- track selection
    if (audioTracks.length === 0) throw noAudioError(opened);
    const described: ProbeTrack[] = [];
    for (let i = 0; i < audioTracks.length; i++) {
      described.push(await describeTrack(audioTracks[i], i));
    }
    const idx = chooseTrack(described, opts.trackIndex);
    const chosen = described[idx];
    const track = audioTracks[idx];
    if (!chosen.canDecode) {
      throw new DecodeError({
        code: 'UNSUPPORTED_CODEC',
        codec: chosen.codec ?? String(chosen.internalCodecId ?? ''),
        container,
        technical: `track ${idx}: ${chosen.codec ?? chosen.internalCodecId} cannot be decoded`,
      });
    }
    if (audioTracks.length > 1) {
      warnings.push({
        type: 'multiple-audio-tracks',
        message: `The file has ${audioTracks.length} audio tracks; track ${idx + 1} (${friendlyCodec(chosen.codec ?? '?')}, ${chosen.language}) was transcribed.`,
        details: {
          tracks: described.map((t) => ({
            index: t.index,
            codec: t.codec,
            language: t.language,
            channels: t.channels,
          })),
        },
      });
    }
    if (idx > 0 && opts.trackIndex === undefined) {
      warnings.push({
        type: 'track-skipped',
        message: `Audio track 1 uses a format that cannot be decoded here, so track ${idx + 1} was used instead.`,
      });
    }

    // ---- duration (progress, preallocation and the truncation check). getDurationFromMetadata() is unreliable
    // for MP3 without a Xing tag (118.8 s promised for a 22.8 s file), so the computed one wins.
    const durationMeta = chosen.durationSeconds;
    const durationComputed = await track.computeDuration();
    const expectedSeconds =
      durationComputed && durationComputed > 0 ? durationComputed : durationMeta;
    const gapless: Mp3Gapless | null =
      container === 'MP3' ? await readMp3Gapless(file).catch(() => null) : null;
    let skipRemaining = gapless ? gapless.startSkip : 0;
    // ffmpeg's mp3 demuxer also drops the encoder padding at the end (first_discard_sample .. last_discard_sample):
    // decoded samples [frames * spf - endTrim, frames * spf). Without it the normaliser's last frames differ.
    const spfTotal = gapless?.frames ? gapless.frames * gapless.samplesPerFrame : 0;
    const endDiscardFrom = spfTotal ? spfTotal - gapless!.endTrim : Infinity;
    const endDiscardTo = spfTotal || Infinity;
    let decodedPos = 0; // decoder samples seen so far, skipped ones included

    // ---- the pipeline is created from the first decoded block (its real rate / channel count win over the header)
    const pipelineOpts: PipelineOptions = {
      downmix: 'ffmpeg',
      cleanup: 'native',
      ...opts.pipeline,
    };
    const needHeadroom = pipelineOpts.downmix === 'ffmpeg';
    let builder: Pcm16Builder | null = null;
    let pipeline: Mono16kPipeline | null = null;
    let pipeKey = '';
    let outSamples = 0;
    let pending: Promise<void> | null = null;
    const emit = (chunk: Float32Array) => {
      builder?.append(chunk);
      if (opts.onChunk) {
        const r = opts.onChunk(chunk, { startSample: outSamples });
        if (r) pending = pending ? pending.then(() => r) : r;
      }
      outSamples += chunk.length;
    };

    let planes: Float32Array[] = [];
    let startOffset = 0;
    let firstSeen = false;
    let nextTs = 0;
    let samplesIn = 0;
    let demuxMs = 0;
    let dspMs = 0;
    let lastProgress = 0;
    let processedSeconds = 0;
    let brokeAt: number | null = null;
    let decodeError: unknown = null;

    report(opts, progressAt(0, expectedSeconds, tStart, 'decoding'));

    const ensurePipeline = (rate: number, channels: number): Mono16kPipeline => {
      const key = `${rate}/${channels}`;
      if (pipeline && key === pipeKey) return pipeline;
      if (pipeline) {
        // mid-stream format change: finish the old segment, start a new one
        const t = performance.now();
        pipeline.finish();
        dspMs += performance.now() - t;
        warnings.push({
          type: 'format-change',
          message: `The audio format changed in the middle of the file (${pipeKey} -> ${key}).`,
          atSeconds: processedSeconds,
        });
      }
      pipeKey = key;
      pipeline = new Mono16kPipeline(rate, channels, emit, pipelineOpts);
      if (!builder && opts.collect) {
        builder = new Pcm16Builder({
          expectedSamples: expectedSeconds ? expectedSeconds * PCM_SAMPLE_RATE : undefined,
          headroomBits: needHeadroom && channels > 1 ? 1 : 0,
        });
      }
      return pipeline;
    };

    let iterator = track.blocks();
    let lastYield = -Infinity; // once before the first block (events queued while probing), then every 16 ms
    let resumes = 0;
    let justResumed = false;
    let skippedAny = false;
    while (true) {
      let next: IteratorResult<DecodedBlock, void>;
      const t0 = performance.now();
      try {
        next = await iterator.next();
      } catch (e) {
        if (signal?.aborted) throw new DecodeError({ code: 'CANCELLED', cause: e });
        // Damaged data: WebCodecs closes a decoder after its first error, ffmpeg just skips the bad packet. Do what
        // ffmpeg does: jump a little ahead with a fresh decoder, and keep the skipped span as silence so every later
        // timestamp still lines up with the player.
        const code = classifyError(e, { signal, container, codec: chosen.codec }).code;
        const resumeAt = nextTs + 0.25 * 2 ** Math.min(resumes, 4);
        if (
          opts.partialOnError &&
          code === 'DECODE_FAILED' &&
          firstSeen &&
          resumes < MAX_RESUMES &&
          (!expectedSeconds || resumeAt < expectedSeconds - 0.1)
        ) {
          warnings.push({
            type: 'decode-error',
            message: `Damaged audio near ${nextTs.toFixed(1)} s was skipped (about ${(resumeAt - nextTs).toFixed(2)} s replaced by silence).`,
            atSeconds: nextTs,
            seconds: resumeAt - nextTs,
            details: { reason: String((e as Error | null)?.message ?? e) },
          });
          resumes++;
          justResumed = true;
          skippedAny = true;
          try {
            await iterator.return(undefined);
          } catch {
            // the failed pump is already closed
          }
          iterator = track.blocks(resumeAt);
          continue;
        }
        decodeError = e;
        brokeAt = processedSeconds;
        break;
      }
      demuxMs += performance.now() - t0;
      // In-memory reads resolve as microtasks, so without this a fast file never lets the event loop run: the abort
      // timer (or the UI, on the main thread) waits for the whole decode. Yield a task at most every 16 ms (one frame) of work.
      if (performance.now() - lastYield > YIELD_EVERY_MS) {
        await yieldTask();
        lastYield = performance.now();
      }
      if (signal?.aborted) {
        await iterator.return(undefined).catch(() => undefined);
        throw new DecodeError({ code: 'CANCELLED' });
      }
      if (next.done) break;
      const block = next.value;
      try {
        const frames = block.numberOfFrames;
        const rate = block.sampleRate;
        const chs = block.numberOfChannels;
        if (frames === 0) continue;
        const pipe = ensurePipeline(rate, chs);
        const ts = block.timestamp;
        const t1 = performance.now();
        if (!firstSeen) {
          firstSeen = true;
          startOffset = ts;
          // AAC priming comes as a negative first timestamp: dropping it aligns sample-exactly with ffmpeg
          if (ts < 0) skipRemaining += Math.round(-ts * rate);
          else if (ts > 0.001) {
            if (opts.padStart) pushSilence(pipe, Math.round(ts * rate), chs);
            warnings.push({
              type: 'start-offset',
              message: `The audio starts ${ts.toFixed(2)} s into the file${opts.padStart ? ' (padded with silence)' : ' (not padded: add startOffsetSeconds to transcript times to line up with the player)'}.`,
              seconds: ts,
            });
          }
        } else {
          const gap = ts - nextTs;
          if (justResumed) {
            justResumed = false;
            if (gap > 0.02 && gap < 60) pushSilence(pipe, Math.round(gap * rate), chs);
          } else if (gap > Math.max(0.02, 1.5 * block.duration)) {
            warnings.push({
              type: 'gap',
              message: `A ${gap.toFixed(2)} s gap in the audio was found at ${nextTs.toFixed(2)} s${opts.gapFill === 'silence' ? ' and filled with silence' : ''}.`,
              atSeconds: nextTs,
              seconds: gap,
            });
            if (opts.gapFill === 'silence') pushSilence(pipe, Math.round(gap * rate), chs);
          }
        }
        nextTs = ts + frames / rate;
        let skip = 0;
        if (skipRemaining > 0) {
          skip = Math.min(frames, skipRemaining);
          skipRemaining -= skip;
        }
        if (planes.length !== chs || planes[0].length < frames) {
          const size = Math.max(frames, planes[0]?.length ?? 0, 4096);
          planes = Array.from({ length: chs }, () => new Float32Array(size));
        }
        for (let c = 0; c < chs; c++) block.copyChannel(c, planes[c]);
        const blockStart = decodedPos;
        decodedPos += frames;
        // the part of [skip, frames) outside the end-padding window
        const cutFrom = Math.max(skip, Math.min(frames, endDiscardFrom - blockStart));
        const cutTo = Math.max(cutFrom, Math.min(frames, endDiscardTo - blockStart));
        for (const [from, to] of [
          [skip, cutFrom],
          [cutTo, frames],
        ]) {
          const n = to - from;
          if (n <= 0) continue;
          pipe.push(from || to !== frames ? planes.map((p) => p.subarray(from, to)) : planes, n);
          samplesIn += n;
        }
        processedSeconds = Math.max(0, nextTs);
        dspMs += performance.now() - t1;
      } finally {
        block.close();
      }
      if (pending) {
        const p: Promise<void> = pending;
        pending = null;
        await p;
      }
      const now = performance.now();
      if (now - lastProgress >= 100) {
        lastProgress = now;
        report(opts, progressAt(processedSeconds, expectedSeconds, tStart, 'decoding'));
      }
    }

    // ---- finish
    report(opts, progressAt(processedSeconds, expectedSeconds, tStart, 'finishing'));
    const finalPipeline = pipeline as Mono16kPipeline | null;
    if (finalPipeline) {
      const t = performance.now();
      finalPipeline.finish();
      dspMs += performance.now() - t;
    }
    if (pending) await pending;

    if (decodeError) {
      const err = classifyError(decodeError, { signal, container, codec: chosen.codec });
      const fatal =
        err.code === 'CANCELLED' ||
        err.code === 'DRM_PROTECTED' ||
        err.code === 'UNSUPPORTED_CODEC' ||
        err.code === 'OUT_OF_MEMORY';
      if (!opts.partialOnError || outSamples < PCM_SAMPLE_RATE || fatal) throw err;
      warnings.push({
        type: 'decode-error',
        message: `The file could not be read past ${(brokeAt ?? 0).toFixed(1)} s; only the part before that was transcribed.`,
        atSeconds: brokeAt ?? undefined,
        details: { code: err.code, technical: err.technical },
      });
    }

    const durationSeconds = outSamples / PCM_SAMPLE_RATE;
    if (durationSeconds < opts.minSeconds) {
      throw new DecodeError({
        code: 'TOO_SHORT',
        container,
        technical: `${durationSeconds.toFixed(3)} s decoded`,
      });
    }

    // truncated files: the container promised more audio than was there
    let truncated = !!decodeError || skippedAny;
    let promised: number | null = Math.max(durationMeta ?? 0, durationComputed ?? 0) || null;
    if (container === 'MP3') {
      // no reliable header duration unless a LAME / Xing tag carries the frame count
      promised = gapless?.frames
        ? (gapless.frames * gapless.samplesPerFrame - gapless.startSkip - gapless.endTrim) /
          chosen.sampleRate
        : null;
    }
    if (!decodeError && promised && promised > 1) {
      const end = Math.max(0, startOffset) + durationSeconds;
      const tolerance = opened.hasVideo
        ? Math.max(1, promised * 0.1)
        : Math.max(0.2, promised * 0.03);
      if (end < promised - tolerance) {
        truncated = true;
        warnings.push({
          type: 'truncated',
          message: `The file contains less audio than it promises: ${fmtDur(promised)} expected, ${fmtDur(end)} could be read. It may be an incomplete download or damaged.`,
          seconds: promised - end,
          details: { promised, got: end },
        });
      }
    }
    const b = builder as Pcm16Builder | null;
    if (b && b.clippedSamples > 0) {
      warnings.push({
        type: 'clipped',
        message: `${b.clippedSamples} samples exceeded full scale and were clipped.`,
        details: { clipped: b.clippedSamples, peak: b.peakAbs },
      });
    }

    const wall = performance.now() - tStart;
    const source: SourceInfo = {
      container,
      mimeType: opened.mimeType,
      fileBytes: file.size,
      trackCount: opened.trackCount,
      audioTrackCount: audioTracks.length,
      hasVideo: opened.hasVideo,
      trackIndex: idx,
      codec: chosen.codec,
      internalCodecId: chosen.internalCodecId,
      sampleRate: chosen.sampleRate,
      channels: chosen.channels,
      durationMetaSeconds: durationMeta,
      durationComputedSeconds: durationComputed,
    };
    const path: DecodePath = 'webcodecs';
    return {
      pcm: b ? b.finish() : new Int16Array(0),
      scale: b ? b.scale : 1 / 32768,
      sampleRate: PCM_SAMPLE_RATE,
      samples: outSamples,
      durationSeconds,
      startOffsetSeconds: startOffset,
      path,
      source,
      warnings,
      truncated,
      stats: {
        wallMs: wall,
        demuxDecodeMs: demuxMs,
        dspMs,
        xRealtime: durationSeconds / Math.max(wall / 1000, 1e-6),
        peakAbs: b ? b.peakAbs : NaN,
        clippedSamples: b ? b.clippedSamples : 0,
        cleanupActive: finalPipeline?.cleanupActive ?? null,
        samplesIn,
      },
    };
  } catch (e) {
    throw classifyError(e, { signal });
  } finally {
    signal?.removeEventListener('abort', onAbort);
    opened.dispose();
  }
}

function pushSilence(p: Mono16kPipeline, frames: number, channels: number): void {
  const step = 48000;
  const zeros = Array.from({ length: channels }, () => new Float32Array(Math.min(step, frames)));
  for (let done = 0; done < frames; done += step) p.push(zeros, Math.min(step, frames - done));
}

function progressAt(
  processedSeconds: number,
  totalSeconds: number | null,
  tStart: number,
  phase: DecodeProgress['phase'],
): DecodeProgress {
  const elapsedSeconds = (performance.now() - tStart) / 1000;
  return {
    processedSeconds,
    totalSeconds,
    fraction: totalSeconds ? Math.min(1, processedSeconds / totalSeconds) : null,
    elapsedSeconds,
    xRealtime: processedSeconds / Math.max(elapsedSeconds, 1e-6),
    phase,
  };
}

export function report(o: { onProgress?: (p: DecodeProgress) => void }, p: DecodeProgress): void {
  try {
    o.onProgress?.(p);
  } catch {
    // a throwing UI callback must never break decoding
  }
}

function fmtDur(s: number): string {
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  return m ? `${m} min ${r} s` : `${r} s`;
}
