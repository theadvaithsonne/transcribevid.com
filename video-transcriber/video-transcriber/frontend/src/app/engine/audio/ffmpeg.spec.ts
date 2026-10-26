import { DecodeError } from './errors';
import {
  FFMPEG_CORE_FILES,
  FfmpegCore,
  PYTHON_ENGINE_AF,
  canRunFfmpeg,
  decodeWithFfmpeg,
  loadFfmpegCore,
  parseFfmpegLog,
} from './ffmpeg';
import { decodeMedia } from './index';
import type { MediaOpener } from './media-source';

// The ffmpeg.wasm fallback against a scripted core (what @ffmpeg/core's Emscripten module offers: exec / ret /
// reset / setLogger / FS). Nothing is downloaded; the real core runs in the browser check (M6).

const SR = 16000;

interface CoreScript {
  /** log lines of the probe run (`-t 0`) */
  probe: string[];
  /** seconds of output of a full run (a segment run writes its `-t`) */
  seconds?: number;
  /** exit code and log of the conversion runs */
  fail?: { code: number; log: string[] };
}

function fakeCore(script: CoreScript) {
  const files = new Map<string, Uint8Array>();
  const execs: string[][] = [];
  const mounts: { name: string }[] = [];
  let log: (e: { type: string; message: string }) => void = () => undefined;
  const core: FfmpegCore = {
    ret: -1,
    exec(...args: string[]) {
      execs.push(args);
      if (args.includes('-t') && args[args.indexOf('-t') + 1] === '0') {
        for (const message of script.probe) log({ type: 'stderr', message });
        core.ret = 0;
        return 0;
      }
      if (script.fail) {
        for (const message of script.fail.log) log({ type: 'stderr', message });
        core.ret = script.fail.code;
        return core.ret;
      }
      const t = args.includes('-t') ? Number(args[args.indexOf('-t') + 1]) : (script.seconds ?? 1);
      const out = new Float32Array(Math.round(t * SR)).fill(0.25);
      files.set(args[args.length - 1], new Uint8Array(out.buffer));
      core.ret = 0;
      return 0;
    },
    reset() {
      core.ret = -1;
    },
    setLogger(fn) {
      log = fn;
    },
    setProgress() {},
    setTimeout() {},
    FS: {
      mkdir() {},
      rmdir() {},
      unlink(p: string) {
        files.delete(p);
      },
      readFile(p: string) {
        const f = files.get(p);
        if (!f) throw new Error(`ENOENT ${p}`);
        return f;
      },
      mount(_type: unknown, opts: { blobs?: { name: string; data: Blob }[] }) {
        mounts.push({ name: opts.blobs![0].name });
      },
      unmount() {},
      filesystems: { WORKERFS: {} },
    },
  };
  return { core, execs, mounts };
}

const AVI_PROBE = [
  "Input #0, avi, from '/in/input.avi':",
  '  Duration: 00:00:03.00, start: 0.000000, bitrate: 1536 kb/s',
  '  Stream #0:0: Video: mjpeg (Baseline) (MJPG / 0x47504A4D), yuvj420p, 320x240, 25 fps',
  '  Stream #0:1: Audio: pcm_s16le ([1][0][0][0] / 0x0001), 44100 Hz, stereo, s16, 1411 kb/s',
];

const avi = () => new File([new Uint8Array(64)], 'Old Clip.AVI', { type: 'video/x-msvideo' });

describe('ffmpeg.wasm fallback: decodeWithFfmpeg', () => {
  it("runs the Python engine's command on the mounted file and returns 16 kHz mono like the other decoders", async () => {
    const f = fakeCore({ probe: AVI_PROBE, seconds: 3 });
    const chunks: number[] = [];
    const r = await decodeWithFfmpeg(avi(), {
      ffmpeg: { loadCore: async () => f.core },
      onChunk: (c) => void chunks.push(c.length),
    });
    expect(f.mounts).toEqual([{ name: 'input.avi' }]);
    expect(f.execs[0]).toEqual(['-hide_banner', '-i', '/in/input.avi', '-t', '0', '-f', 'null', '-']);
    expect(f.execs[1]).toEqual([
      '-hide_banner', '-i', '/in/input.avi', '-vn', '-map', '0:a:0?', '-af', PYTHON_ENGINE_AF, '-ac', '1', '-ar', '16000', '-f', 'f32le', '/out.f32',
    ]);
    expect(r).toMatchObject({ path: 'ffmpeg-wasm', samples: 3 * SR, durationSeconds: 3, truncated: false });
    expect(r.source).toMatchObject({ codec: 'pcm_s16le', sampleRate: 44100, channels: 2, hasVideo: true, durationMetaSeconds: 3 });
    // two channels mixed by ffmpeg: stored with the headroom bit, like the WebCodecs path
    expect(r.scale).toBe(1 / 16384);
    expect(r.pcm.length).toBe(3 * SR);
    expect(r.pcm[0]).toBe(Math.round(0.25 * 16384));
    expect(chunks.reduce((a, b) => a + b, 0)).toBe(3 * SR);
  });

  it('leaves the clean-up filters out when "enhance audio" is off, and the PCM out with collect: false', async () => {
    const f = fakeCore({ probe: AVI_PROBE, seconds: 3 });
    const r = await decodeWithFfmpeg(avi(), { ffmpeg: { loadCore: async () => f.core }, pipeline: { cleanup: false }, collect: false });
    expect(f.execs[1]).not.toContain('-af');
    expect(r.pcm.length).toBe(0);
    expect(r.samples).toBe(3 * SR);
  });

  it('cuts long files into segments with discarded overlap (no sample counted twice)', async () => {
    const f = fakeCore({ probe: AVI_PROBE });
    const r = await decodeWithFfmpeg(avi(), { ffmpeg: { loadCore: async () => f.core, segmentSeconds: 1, overlapSeconds: 0.25 } });
    const runs = f.execs.slice(1).map((a) => [a[a.indexOf('-ss') + 1], a[a.indexOf('-t') + 1]]);
    expect(runs).toEqual([
      ['0', '1.25'],
      ['0.75', '1.5'],
      ['1.75', '1.25'],
    ]);
    expect(r.samples).toBe(3 * SR);
    expect(r.warnings.map((w) => w.type)).toContain('gap');
  });

  it('classifies what ffmpeg says like the browser path does', async () => {
    const run = (s: CoreScript): Promise<DecodeError> =>
      decodeWithFfmpeg(avi(), { ffmpeg: { loadCore: async () => fakeCore(s).core } }).then(
        () => {
          throw new Error('expected a DecodeError');
        },
        (e) => e as DecodeError,
      );
    expect((await run({ probe: ['  Stream #0:0: Video: h264, yuv420p, 1280x720'] })).code).toBe('NO_AUDIO_TRACK');
    expect((await run({ probe: ['/in/input.avi: Invalid data found when processing input'] })).code).toBe('CORRUPT');
    expect((await run({ probe: ['something else'] })).code).toBe('NOT_MEDIA');
    const codec = await run({ probe: AVI_PROBE, fail: { code: 1, log: ['Decoder (codec atrac3) not found for input stream #0:1'] } });
    expect(codec.code).toBe('UNSUPPORTED_CODEC');
    expect(codec.codec).toBe('pcm_s16le');
    expect((await run({ probe: AVI_PROBE, fail: { code: 1, log: ['Error while decoding stream #0:1'] } })).code).toBe('CORRUPT');
    expect((await decodeWithFfmpeg(new File([], 'empty.avi'), { ffmpeg: { loadCore: async () => fakeCore({ probe: [] }).core } }).catch((e) => e)).code).toBe(
      'EMPTY_FILE',
    );
  });

  it('parses stream facts from the log', () => {
    expect(parseFfmpegLog(AVI_PROBE)).toMatchObject({ codec: 'pcm_s16le', rate: 44100, channels: 2, duration: 3, hasAudio: true, hasVideo: true });
    expect(parseFfmpegLog(['  Stream #0:0: Audio: wmav2 (a[1][0][0] / 0x0161), 22050 Hz, mono, fltp, 64 kb/s'])).toMatchObject({ codec: 'wmav2', channels: 1 });
    expect(parseFfmpegLog(['  Stream #0:0: Audio: ac3, 48000 Hz, 5.1(side), fltp, 384 kb/s'])).toMatchObject({ channels: 6 });
  });
});

describe('ffmpeg.wasm fallback: decodeMedia', () => {
  const notMedia: MediaOpener = async () => {
    throw new DecodeError({ code: 'NOT_MEDIA', technical: 'AVI' });
  };

  it('is the last decoder, only when the visitor agreed (`ffmpeg` set) and only in a worker', async () => {
    const f = fakeCore({ probe: AVI_PROBE, seconds: 3 });
    const paths: string[] = [];
    const r = await decodeMedia(avi(), {
      opener: notMedia,
      allowWebAudio: false,
      ffmpeg: { loadCore: async () => f.core },
      ffmpegAnywhere: true,
      onPath: (p) => paths.push(p),
    });
    expect(paths).toEqual(['webcodecs', 'ffmpeg-wasm']);
    expect(r.path).toBe('ffmpeg-wasm');
    // no consent: the browser's own error with the convert-first advice
    const declined = await decodeMedia(avi(), { opener: notMedia, allowWebAudio: false }).catch((e) => e);
    expect(declined.code).toBe('NOT_MEDIA');
    expect(declined.userMessage).toMatch(/Convert it to MP3, M4A or WAV first/);
    // the page (no FileReaderSync, no WORKERFS) never runs it
    expect(canRunFfmpeg()).toBe(false);
    const onPage = await decodeMedia(avi(), { opener: notMedia, allowWebAudio: false, ffmpeg: { loadCore: async () => f.core } }).catch((e) => e);
    expect(onPage.code).toBe('NOT_MEDIA');
  });

  it('is not tried after an error no decoder can fix (corrupt, DRM, empty ...)', async () => {
    let loaded = 0;
    const corrupt: MediaOpener = async () => {
      throw new DecodeError({ code: 'CORRUPT' });
    };
    const e = await decodeMedia(avi(), {
      opener: corrupt,
      allowWebAudio: false,
      ffmpeg: {
        loadCore: async () => {
          loaded++;
          return fakeCore({ probe: AVI_PROBE }).core;
        },
      },
      ffmpegAnywhere: true,
    }).catch((x) => x);
    expect(e.code).toBe('CORRUPT');
    expect(loaded).toBe(0);
  });

  it('refuses a core whose bytes do not match the pinned SHA-256 (CONVERTER_UNAVAILABLE)', async () => {
    const original = globalThis.fetch;
    globalThis.fetch = (async () => ({ ok: true, status: 200, arrayBuffer: async () => new Uint8Array(10).buffer })) as unknown as typeof fetch;
    try {
      const e = await loadFfmpegCore({ base: 'https://example.invalid/' }).catch((x) => x);
      expect(e).toBeInstanceOf(DecodeError);
      expect(e.code).toBe('CONVERTER_UNAVAILABLE');
      expect([FFMPEG_CORE_FILES.js.sha256, FFMPEG_CORE_FILES.wasm.sha256].some((h) => e.technical.includes(h))).toBe(true);
      expect(e.userMessage).toMatch(/converter/);
    } finally {
      globalThis.fetch = original;
    }
  });
});
