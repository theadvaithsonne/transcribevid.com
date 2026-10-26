/**
 * Fallback C: ffmpeg.wasm for the files WebCodecs (mediabunny) cannot open: AVI, WMA / WMV (ASF), FLV, MPG, raw AMR
 * and AMR-in-3GP, GSM, AIFF / AU / CAF, Speex, ALAC, AC-3 / E-AC-3 / DTS, Real ... (docs/in-browser/spike/audio.md
 * sections 7 and 10). Port of the spike's `src/decode/ffmpegwasm.ts` with three changes:
 *
 * 1. Lazy and opt-in: nothing is fetched until a file needs it, and only when the visitor agreed on the page
 *    ("This file needs a 9 MB converter that runs in your browser. Load it?"; engine/worker `plan.converter`).
 * 2. The core (`@ffmpeg/core` 0.12.10, single-thread, GPL-2.0-or-later) comes from its pinned jsDelivr URL, is checked
 *    against its SHA-256 and then instantiated from the verified bytes (a blob: module + `wasmBinary`). It runs right
 *    here, in the engine (or audio) worker: `@ffmpeg/ffmpeg`'s own class worker would have to be started from a
 *    cross-origin URL, which browsers refuse, and WORKERFS needs a worker anyway (FileReaderSync). What this file
 *    does with the core is exactly what `@ffmpeg/ffmpeg` 0.12.15's worker.js does (exec / reset / FS.mount ...).
 * 3. The output goes through the same Int16 packing, `onChunk` stream and progress as the other decoders.
 *
 * ffmpeg runs the Python engine's own command (`-vn -map 0:a:0? -af highpass=f=70,lowpass=f=7800,dynaudnorm=...
 * -ac 1 -ar 16000 -f f32le`), so on this path the result is ffmpeg's output, not a re-implementation. The input is
 * mounted with WORKERFS (nothing is copied into the 2 GB wasm heap; 2.4 GiB tested); the 16 kHz float output lives in
 * MEMFS, so files over 36 min are processed in 30 min segments with 6 s of discarded overlap. `exec` is synchronous:
 * a cancel during a segment is the worker host's hard cancel (terminate after 2 s).
 */
import { Sha256 } from '../models/sha256';
import { DecodeError } from './errors';
import { Pcm16Builder, PCM_SAMPLE_RATE } from './pcm';
import type { DecodeOptions, DecodeResult, DecodeWarning } from './types';

export const FFMPEG_CORE_VERSION = '0.12.10';
/** The `@ffmpeg/ffmpeg` release whose worker protocol this file follows (not downloaded). */
export const FFMPEG_WRAPPER_VERSION = '0.12.15';
export const FFMPEG_CORE_BASE = `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/esm/`;
/** npm tarball contents (what jsDelivr serves), hashed 2026-10-26. */
export const FFMPEG_CORE_FILES = {
  js: { name: 'ffmpeg-core.js', bytes: 111804, sha256: '67a48f11645f85439f3fde4f2119042c16b374b910206b7a7a24f342e28dcae3' },
  wasm: { name: 'ffmpeg-core.wasm', bytes: 32232419, sha256: '9f57947a5bd530d8f00c5b3f2cb2a3492faa7e5d823315342d6a8656d0a6b7b7' },
} as const;
/** What the visitor downloads (jsDelivr serves the 30.7 MiB wasm brotli-compressed: 9,289,992 bytes on the wire). */
export const FFMPEG_DOWNLOAD_MB = 9.3;
/** The Python engine's clean-up chain (backend/app/engine.py extract_audio). */
export const PYTHON_ENGINE_AF = 'highpass=f=70,lowpass=f=7800,dynaudnorm=f=200:g=11:p=0.9';

/** The Emscripten module of @ffmpeg/core, as @ffmpeg/ffmpeg's worker.js drives it. */
export interface FfmpegCore {
  exec(...args: string[]): number;
  ret: number;
  reset(): void;
  setLogger(fn: (e: { type: string; message: string }) => void): void;
  setProgress(fn: (e: { progress: number; time: number }) => void): void;
  setTimeout(ms: number): void;
  FS: {
    mkdir(path: string): void;
    rmdir(path: string): void;
    unlink(path: string): void;
    readFile(path: string, opts?: { encoding?: 'binary' }): Uint8Array;
    mount(type: unknown, opts: { blobs?: { name: string; data: Blob }[]; files?: File[] }, mountpoint: string): void;
    unmount(mountpoint: string): void;
    filesystems: Record<string, unknown>;
  };
}

export interface FfmpegFallbackOptions {
  /** another host for the two core files (default: the pinned jsDelivr URL) */
  base?: string;
  /** replaces the download + instantiation (specs) */
  loadCore?: () => Promise<FfmpegCore>;
  /** segment length in seconds; 0 = one pass (default 1800) */
  segmentSeconds?: number;
  /** seconds decoded around each segment cut and discarded (default 6) */
  overlapSeconds?: number;
  /** told once the core is ready (Logs page) */
  onLoad?: (info: { ms: number }) => void;
}

/** Codes after which the converter is worth a try (it reads far more containers and codecs than the browser). */
export const FFMPEG_RETRY_CODES: ReadonlySet<string> = new Set(['NOT_MEDIA', 'UNSUPPORTED_CODEC', 'NO_WEBCODECS', 'DECODE_FAILED', 'TOO_LARGE']);

/** WORKERFS needs FileReaderSync: the converter only runs in a worker. */
export function canRunFfmpeg(): boolean {
  return typeof (globalThis as { FileReaderSync?: unknown }).FileReaderSync !== 'undefined';
}

let instance: Promise<FfmpegCore> | null = null;

/** Downloads (HTTP cache after the first time), verifies and instantiates the core once per worker. */
export function loadFfmpegCore(o: FfmpegFallbackOptions = {}): Promise<FfmpegCore> {
  if (o.loadCore) return o.loadCore();
  instance ??= (async () => {
    const t0 = performance.now();
    const base = o.base ?? FFMPEG_CORE_BASE;
    const [js, wasm] = await Promise.all([fetchVerified(base, FFMPEG_CORE_FILES.js), fetchVerified(base, FFMPEG_CORE_FILES.wasm)]);
    const url = URL.createObjectURL(new Blob([js as BlobPart], { type: 'text/javascript' }));
    try {
      const mod = (await import(/* @vite-ignore */ url)) as { default: (m: Record<string, unknown>) => Promise<FfmpegCore> };
      const hash = btoa(JSON.stringify({ wasmURL: base + FFMPEG_CORE_FILES.wasm.name, workerURL: '' }));
      const core = await mod.default({
        wasmBinary: wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength),
        mainScriptUrlOrBlob: `${base}${FFMPEG_CORE_FILES.js.name}#${hash}`,
      });
      o.onLoad?.({ ms: performance.now() - t0 });
      return core;
    } finally {
      URL.revokeObjectURL(url);
    }
  })();
  instance.catch(() => (instance = null));
  return instance;
}

/** Drops the core (after a cancel the next file loads it again: the wasm heap may be in any state). */
export function unloadFfmpegCore(): void {
  instance = null;
}

async function fetchVerified(base: string, f: { name: string; bytes: number; sha256: string }): Promise<Uint8Array> {
  let res: Response;
  try {
    res = await fetch(base + f.name);
  } catch (e) {
    throw new DecodeError({ code: 'CONVERTER_UNAVAILABLE', technical: `${f.name}: ${(e as Error)?.message ?? e}` });
  }
  if (!res.ok) throw new DecodeError({ code: 'CONVERTER_UNAVAILABLE', technical: `${f.name}: HTTP ${res.status}` });
  const bytes = new Uint8Array(await res.arrayBuffer());
  const digest = new Sha256().update(bytes).digest();
  if (bytes.byteLength !== f.bytes || digest !== f.sha256) {
    throw new DecodeError({
      code: 'CONVERTER_UNAVAILABLE',
      technical: `${f.name}: ${bytes.byteLength} bytes, sha256 ${digest}; expected ${f.bytes} / ${f.sha256}`,
    });
  }
  return bytes;
}

interface StreamInfo {
  codec: string | null;
  rate: number;
  channels: number;
  layout: string;
  duration: number | null;
  hasAudio: boolean;
  hasVideo: boolean;
}

/** Stream facts from ffmpeg's log of a zero-length run (the spike's parser). */
export function parseFfmpegLog(lines: readonly string[]): StreamInfo {
  const info: StreamInfo = { codec: null, rate: 0, channels: 0, layout: '', duration: null, hasAudio: false, hasVideo: false };
  const named: Record<string, number> = {
    mono: 1,
    stereo: 2,
    '5.1': 6,
    '5.1(side)': 6,
    '7.1': 8,
    quad: 4,
    '3.0': 3,
    '2.1': 3,
    '5.0': 5,
    '6.1': 7,
  };
  for (const l of lines) {
    const d = /Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/.exec(l);
    if (d && info.duration === null) info.duration = +d[1] * 3600 + +d[2] * 60 + +d[3];
    if (/Stream #\d+:\d+.*: Video:/.test(l) && !/attached pic/.test(l)) info.hasVideo = true;
    const a = /Stream #\d+:\d+[^\n]*?: Audio: ([^,\s(]+)[^\n]*?, (\d+) Hz, ([^,]+)/.exec(l);
    if (a && !info.hasAudio) {
      info.hasAudio = true;
      info.codec = a[1];
      info.rate = +a[2];
      info.layout = a[3].trim();
      const n = /^(\d+) channels/.exec(info.layout);
      info.channels = named[info.layout] ?? (n ? +n[1] : 0);
    }
  }
  return info;
}

function lastLines(log: readonly string[], n = 3): string {
  return log
    .filter((l) => l.trim())
    .slice(-n)
    .join(' | ')
    .slice(0, 300);
}

function classify(log: readonly string[], code: number, info: StreamInfo): DecodeError {
  const text = log.join('\n');
  if (/Invalid data found|moov atom not found|truncated|Error while decoding stream/i.test(text)) {
    return new DecodeError({ code: 'CORRUPT', technical: lastLines(log), codec: info.codec });
  }
  if (/Decoder .* not found|Unsupported codec|decoder .* not (found|available)|Function not implemented/i.test(text)) {
    return new DecodeError({ code: 'UNSUPPORTED_CODEC', codec: info.codec, technical: lastLines(log) });
  }
  if (/memory|alloc|abort/i.test(text)) return new DecodeError({ code: 'OUT_OF_MEMORY', technical: lastLines(log) });
  return new DecodeError({ code: 'DECODE_FAILED', technical: `exit code ${code}: ${lastLines(log)}`, codec: info.codec });
}

export interface FfmpegDecodeOptions extends DecodeOptions {
  ffmpeg: FfmpegFallbackOptions;
}

/** The whole file through ffmpeg.wasm -> 16 kHz mono, the same DecodeResult as the other decoders. */
export async function decodeWithFfmpeg(file: Blob, options: FfmpegDecodeOptions): Promise<DecodeResult> {
  const t0 = performance.now();
  if (file.size === 0) throw new DecodeError({ code: 'EMPTY_FILE', technical: 'size 0' });
  const { signal } = options;
  if (signal?.aborted) throw new DecodeError({ code: 'CANCELLED' });
  const core = await loadFfmpegCore(options.ffmpeg);
  if (signal?.aborted) throw new DecodeError({ code: 'CANCELLED' });
  const log: string[] = [];
  core.setLogger((e) => {
    if (log.length < 4000) log.push(e.message);
  });
  const run = (args: string[]): number => {
    core.setTimeout(-1);
    core.exec(...args);
    const ret = core.ret;
    core.reset();
    return ret;
  };
  const warnings: DecodeWarning[] = [];
  const ext = ((file as File).name?.match(/\.([A-Za-z0-9]{1,5})$/)?.[1] ?? 'bin').toLowerCase();
  const mountDir = '/in';
  const inName = `input.${ext}`;
  const inPath = `${mountDir}/${inName}`;
  const outPath = '/out.f32';
  let mounted = false;
  try {
    try {
      core.FS.mkdir(mountDir);
    } catch {
      // exists from an earlier file
    }
    core.FS.mount(core.FS.filesystems['WORKERFS'], { blobs: [{ name: inName, data: file }] }, mountDir);
    mounted = true;

    // 1. probe: stream info and duration from the log of a zero-length run
    log.length = 0;
    run(['-hide_banner', '-i', inPath, '-t', '0', '-f', 'null', '-']);
    const info = parseFfmpegLog(log);
    if (!info.hasAudio) {
      const text = log.join('\n');
      if (/Invalid data found|moov atom not found|could not find codec|Unsupported|not supported/i.test(text)) {
        throw new DecodeError({ code: info.hasVideo ? 'NO_AUDIO_TRACK' : 'CORRUPT', technical: lastLines(log) });
      }
      throw new DecodeError({ code: info.hasVideo ? 'NO_AUDIO_TRACK' : 'NOT_MEDIA', technical: lastLines(log) });
    }

    // 2. segments (only above 1.2 x the segment length: AAC's noise substitution restarts at a cut, audio.md 7.1)
    const total = info.duration;
    const seg = options.ffmpeg.segmentSeconds ?? 1800;
    const overlap = options.ffmpeg.overlapSeconds ?? 6;
    const segments: { start: number; length: number; pre: number; post: number }[] = [];
    if (!total || !seg || total <= seg * 1.2) segments.push({ start: 0, length: total ?? 0, pre: 0, post: 0 });
    else {
      for (let s = 0; s < total; s += seg) {
        segments.push({ start: s, length: Math.min(seg, total - s), pre: s > 0 ? overlap : 0, post: s + seg < total ? overlap : 0 });
      }
    }
    const headroom = info.channels > 1 && (options.pipeline?.downmix ?? 'ffmpeg') === 'ffmpeg' ? 1 : 0;
    const builder =
      options.collect === false
        ? null
        : new Pcm16Builder({ expectedSamples: total ? total * PCM_SAMPLE_RATE : undefined, headroomBits: headroom as 0 | 1 });
    const enhance = options.pipeline?.cleanup !== false;
    const af = enhance ? ['-af', PYTHON_ENGINE_AF] : [];
    let outSamples = 0;
    let demux = 0;
    for (let i = 0; i < segments.length; i++) {
      if (signal?.aborted) throw new DecodeError({ code: 'CANCELLED' });
      const sgm = segments[i];
      const args = ['-hide_banner'];
      if (segments.length > 1) args.push('-ss', String(Math.max(0, sgm.start - sgm.pre)));
      args.push('-i', inPath);
      if (segments.length > 1) args.push('-t', String(sgm.length + sgm.pre + sgm.post));
      args.push('-vn', '-map', '0:a:0?', ...af, '-ac', '1', '-ar', String(PCM_SAMPLE_RATE), '-f', 'f32le', outPath);
      log.length = 0;
      const tExec = performance.now();
      const code = run(args);
      demux += performance.now() - tExec;
      if (signal?.aborted) throw new DecodeError({ code: 'CANCELLED' });
      if (code !== 0) throw classify(log, code, info);
      const raw = core.FS.readFile(outPath);
      try {
        core.FS.unlink(outPath);
      } catch {
        // gone
      }
      const aligned = raw.byteOffset % 4 === 0 ? raw : raw.slice();
      const all = new Float32Array(aligned.buffer, aligned.byteOffset, Math.floor(aligned.byteLength / 4));
      const from = Math.round(sgm.pre * PCM_SAMPLE_RATE);
      const to = segments.length > 1 && i < segments.length - 1 ? Math.min(all.length, from + Math.round(sgm.length * PCM_SAMPLE_RATE)) : all.length;
      const step = 1 << 16;
      for (let p = from; p < to; p += step) {
        const c = all.subarray(p, Math.min(to, p + step));
        builder?.append(c);
        if (options.onChunk) await options.onChunk(c, { startSample: outSamples });
        outSamples += c.length;
      }
      try {
        options.onProgress?.({
          processedSeconds: Math.min(total ?? outSamples / PCM_SAMPLE_RATE, sgm.start + sgm.length),
          totalSeconds: total,
          fraction: total ? Math.min(1, (sgm.start + sgm.length) / total) : null,
          elapsedSeconds: (performance.now() - t0) / 1000,
          xRealtime: outSamples / PCM_SAMPLE_RATE / ((performance.now() - t0) / 1000),
          phase: 'decoding',
        });
      } catch {
        // a throwing callback never breaks decoding
      }
    }
    if (outSamples === 0) {
      const all = log.join('\n');
      if (/encrypt|cenc|drm/i.test(all) || /Error submitting packet to decoder/i.test(all)) {
        throw new DecodeError({ code: 'CORRUPT', technical: 'every audio packet failed to decode (damaged or encrypted): ' + lastLines(log), codec: info.codec });
      }
      throw new DecodeError({ code: 'NO_AUDIO_TRACK', technical: 'ffmpeg produced no audio' });
    }
    const durationSeconds = outSamples / PCM_SAMPLE_RATE;
    if (durationSeconds < (options.minSeconds ?? 0.3)) {
      throw new DecodeError({ code: 'TOO_SHORT', technical: `${durationSeconds.toFixed(3)} s decoded` });
    }
    if (segments.length > 1) {
      warnings.push({
        type: 'gap',
        message: `Processed in ${segments.length} parts of ${seg / 60} minutes; the joins were smoothed.`,
        details: { segments: segments.length },
      });
    }
    const truncated = total ? durationSeconds < total * 0.97 - 0.2 : false;
    if (truncated) {
      warnings.push({
        type: 'truncated',
        message: 'The file ended earlier than its header says; everything that could be read was transcribed.',
        seconds: (total ?? 0) - durationSeconds,
      });
    }
    const wall = performance.now() - t0;
    return {
      pcm: builder ? builder.finish() : new Int16Array(0),
      scale: builder ? builder.scale : 1 / 32768,
      sampleRate: PCM_SAMPLE_RATE,
      samples: outSamples,
      durationSeconds,
      startOffsetSeconds: 0,
      path: 'ffmpeg-wasm',
      source: {
        container: null,
        mimeType: (file as File).type || null,
        fileBytes: file.size,
        trackCount: 1,
        audioTrackCount: 1,
        hasVideo: info.hasVideo,
        trackIndex: 0,
        codec: info.codec,
        internalCodecId: null,
        sampleRate: info.rate,
        channels: info.channels,
        durationMetaSeconds: total,
        durationComputedSeconds: durationSeconds,
      },
      warnings,
      truncated,
      stats: {
        wallMs: wall,
        demuxDecodeMs: demux,
        dspMs: wall - demux,
        xRealtime: durationSeconds / (wall / 1000),
        peakAbs: builder ? builder.peakAbs : NaN,
        clippedSamples: builder ? builder.clippedSamples : 0,
        cleanupActive: enhance ? { highpass: true, lowpass: true, norm: true } : null,
        samplesIn: outSamples,
      },
    };
  } catch (e) {
    if (signal?.aborted) {
      unloadFfmpegCore();
      throw new DecodeError({ code: 'CANCELLED', cause: e });
    }
    if (e instanceof DecodeError) throw e;
    const msg = String((e as Error)?.message ?? e);
    unloadFfmpegCore(); // the wasm heap may be in any state after an abort()
    if (/memory|allocation|RangeError|out of bounds/i.test(msg)) throw new DecodeError({ code: 'OUT_OF_MEMORY', technical: msg, cause: e });
    throw new DecodeError({ code: 'DECODE_FAILED', technical: msg, cause: e });
  } finally {
    if (mounted) {
      try {
        core.FS.unmount(mountDir);
      } catch {
        // already gone
      }
    }
  }
}
