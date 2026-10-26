import { AudioWorkerResponse, createAudioWorkerHandler } from './audio-worker-core';
import { probeMedia } from './decode';
import { DecodeError } from './errors';
import { goldenNoise } from './golden-fixtures';
import { DecodeMediaOptions, decodeMedia } from './index';
import { DecodedBlock, MediaAudioTrack, MediaOpener, MediaTrackInfo } from './media-source';
import { readMp3Gapless } from './mp3';
import { Pcm16Builder } from './pcm';
import { Mono16kPipeline, PipelineOptions } from './pipeline';
import type { DecodeProgress, DecodeResult } from './types';

// The public API against a fake decoder: the real one (mediabunny + WebCodecs) needs a browser and is covered by the
// headless-Chrome conformance run (README). The fake yields synthetic decoded blocks with the same contract.

// jsdom 27's Blob has no arrayBuffer(); every browser the app supports has it.
if (typeof Blob.prototype.arrayBuffer !== 'function') {
  Blob.prototype.arrayBuffer = function (this: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(this);
    });
  };
}

interface FakeTrack {
  info?: Partial<MediaTrackInfo>;
  /** planar source audio, cut into blocks of `blockSeconds` */
  planar: Float32Array[];
  sampleRate: number;
  blockSeconds?: number;
  /** timestamp of the first block (negative = AAC priming, positive = late start) */
  firstTimestamp?: number;
  computed?: number | null;
  /** throw `error` instead of yielding block `index` (first pass only) */
  failAt?: { index: number; error: unknown };
  /** awaited before block `index` is yielded */
  gate?: (index: number) => Promise<void> | void;
}

interface FakeMedia {
  container?: string;
  tracks: FakeTrack[];
  trackCount?: number;
  hasVideo?: boolean;
}

function fakeOpener(media: FakeMedia) {
  const state = { opened: 0, disposed: 0, starts: [] as (number | undefined)[] };
  const opener: MediaOpener = async () => {
    state.opened++;
    return {
      container: media.container ?? 'WAVE',
      mimeType: null,
      trackCount: media.trackCount ?? media.tracks.length,
      hasVideo: media.hasVideo ?? false,
      audioTracks: media.tracks.map((t) => fakeTrack(t, state)),
      dispose: () => {
        state.disposed++;
      },
    };
  };
  return { opener, state };
}

function fakeTrack(t: FakeTrack, state: { starts: (number | undefined)[] }): MediaAudioTrack {
  const rate = t.sampleRate;
  const frames = t.planar[0].length;
  const per = Math.round(rate * (t.blockSeconds ?? 0.1));
  const first = t.firstTimestamp ?? 0;
  let failed = false;
  return {
    info: async () => ({
      codec: 'pcm-f32',
      internalCodecId: null,
      sampleRate: rate,
      channels: t.planar.length,
      canDecode: true,
      durationMetaSeconds: frames / rate,
      language: 'und',
      name: null,
      ...t.info,
    }),
    computeDuration: async () => (t.computed !== undefined ? t.computed : first + frames / rate),
    async *blocks(start?: number) {
      state.starts.push(start);
      for (let i = 0, s = 0; s < frames; i++, s += per) {
        const n = Math.min(per, frames - s);
        const ts = first + s / rate;
        if (start !== undefined && ts + n / rate <= start) continue;
        await t.gate?.(i);
        if (t.failAt && !failed && i === t.failAt.index) {
          failed = true;
          throw t.failAt.error;
        }
        const block: DecodedBlock = {
          timestamp: ts,
          duration: n / rate,
          numberOfFrames: n,
          sampleRate: rate,
          numberOfChannels: t.planar.length,
          copyChannel: (c, dest) => dest.set(t.planar[c].subarray(s, s + n)),
          close: () => undefined,
        };
        yield block;
      }
    },
  };
}

/** What the pipeline + Int16 packing give for the same audio in one piece (chunking does not matter). */
function expectedPcm(
  planar: Float32Array[],
  rate: number,
  opts: PipelineOptions = {},
): { pcm: Int16Array; scale: number } {
  const builder = new Pcm16Builder({ headroomBits: planar.length > 1 ? 1 : 0 });
  const p = new Mono16kPipeline(rate, planar.length, (c) => builder.append(c), {
    downmix: 'ffmpeg',
    ...opts,
  });
  p.push(planar, planar[0].length);
  p.finish();
  return { pcm: builder.finish(), scale: builder.scale };
}

const speechLike = (seconds: number, rate: number, seed = 3) =>
  Float32Array.from(
    goldenNoise(Math.round(seconds * rate), seed, 0.3),
    (v, i) => v * (0.5 + 0.5 * Math.sin(i / rate)),
  );

const fileOf = (bytes = 1000, type = '') => new Blob([new Uint8Array(bytes)], { type });

async function decodeError(promise: Promise<unknown>): Promise<DecodeError> {
  try {
    await promise;
  } catch (e) {
    expect(e).toBeInstanceOf(DecodeError);
    return e as DecodeError;
  }
  throw new Error('expected the decode to fail');
}

describe('decodeMedia (WebCodecs path, fake decoder)', () => {
  it('turns 48 kHz stereo into cleaned-up 16 kHz mono Int16 with the headroom scale', async () => {
    const left = speechLike(2, 48000, 3);
    const right = speechLike(2, 48000, 4);
    const { opener, state } = fakeOpener({
      container: 'Matroska',
      tracks: [{ planar: [left, right], sampleRate: 48000 }],
    });
    const r = await decodeMedia(fileOf(), { opener });
    const want = expectedPcm([left, right], 48000);
    expect(r.path).toBe('webcodecs');
    expect(r.sampleRate).toBe(16000);
    expect(r.scale).toBe(1 / 16384);
    expect(r.samples).toBe(Math.ceil((left.length * 16000) / 48000));
    expect(r.pcm.length).toBe(r.samples);
    expect(Array.from(r.pcm)).toEqual(Array.from(want.pcm));
    expect(r.durationSeconds).toBeCloseTo(2, 3);
    expect(r.startOffsetSeconds).toBe(0);
    expect(r.warnings).toEqual([]);
    expect(r.truncated).toBe(false);
    expect(r.source).toMatchObject({
      container: 'Matroska',
      channels: 2,
      sampleRate: 48000,
      trackIndex: 0,
    });
    expect(r.stats.cleanupActive).toEqual({ highpass: true, lowpass: true, norm: true });
    expect(state.disposed).toBe(1);
  });

  it('keeps standard PCM16 scale for mono and honours the pipeline options', async () => {
    const x = speechLike(1, 16000);
    const { opener } = fakeOpener({ tracks: [{ planar: [x], sampleRate: 16000 }] });
    const r = await decodeMedia(fileOf(), { opener, pipeline: { cleanup: false } });
    expect(r.scale).toBe(1 / 32768);
    expect(Array.from(r.pcm)).toEqual(Array.from(expectedPcm([x], 16000, { cleanup: false }).pcm));
    expect(r.stats.cleanupActive).toBeNull();
  });

  it('reports monotonic progress ending with "finishing", and survives a throwing callback', async () => {
    const { opener } = fakeOpener({
      tracks: [{ planar: [speechLike(3, 16000)], sampleRate: 16000 }],
    });
    const seen: DecodeProgress[] = [];
    const r = await decodeMedia(fileOf(), {
      opener,
      onProgress: (p) => {
        seen.push(p);
        throw new Error('UI bug');
      },
    });
    expect(r.samples).toBe(48000);
    expect(seen[0].phase).toBe('probing');
    expect(seen.at(-1)?.phase).toBe('finishing');
    expect(seen.at(-1)?.fraction).toBeCloseTo(1, 9);
    const fractions = seen.map((p) => p.fraction).filter((f): f is number => f !== null);
    for (let i = 1; i < fractions.length; i++)
      expect(fractions[i]).toBeGreaterThanOrEqual(fractions[i - 1]);
  });

  it('streams every 16 kHz chunk to onChunk and can skip collecting', async () => {
    const x = speechLike(2.5, 44100);
    const { opener } = fakeOpener({ tracks: [{ planar: [x], sampleRate: 44100 }] });
    const chunks: { start: number; length: number }[] = [];
    const r = await decodeMedia(fileOf(), {
      opener,
      collect: false,
      onChunk: async (c, info) => {
        chunks.push({ start: info.startSample, length: c.length });
        await Promise.resolve();
      },
    });
    expect(r.pcm.length).toBe(0);
    expect(r.samples).toBe(Math.ceil((x.length * 16000) / 44100));
    let next = 0;
    for (const c of chunks) {
      expect(c.start).toBe(next);
      next += c.length;
    }
    expect(next).toBe(r.samples);
  });

  it('uses the first decodable audio track and says so', async () => {
    const x = speechLike(1, 16000);
    const { opener } = fakeOpener({
      container: 'Matroska',
      tracks: [
        {
          planar: [x],
          sampleRate: 16000,
          info: { codec: 'ac3', canDecode: false, language: 'eng' },
        },
        { planar: [x], sampleRate: 16000, info: { codec: 'opus', language: 'hin' } },
      ],
    });
    const r = await decodeMedia(fileOf(), { opener });
    expect(r.source.trackIndex).toBe(1);
    expect(r.warnings.map((w) => w.type)).toEqual(['multiple-audio-tracks', 'track-skipped']);
    expect(r.warnings[0].message).toMatch(/2 audio tracks; track 2 \(OPUS, hin\)/);
  });

  it('reports a late start without padding it, and pads it when asked', async () => {
    const x = speechLike(1, 16000);
    const make = () =>
      fakeOpener({ tracks: [{ planar: [x], sampleRate: 16000, firstTimestamp: 2.5 }] }).opener;
    const r = await decodeMedia(fileOf(), { opener: make() });
    expect(r.startOffsetSeconds).toBe(2.5);
    expect(r.durationSeconds).toBeCloseTo(1, 3);
    expect(r.warnings.map((w) => w.type)).toEqual(['start-offset']);
    const padded = await decodeMedia(fileOf(), { opener: make(), padStart: true });
    expect(padded.durationSeconds).toBeCloseTo(3.5, 3);
    expect(padded.warnings[0].message).toMatch(/padded with silence/);
  });

  it('drops AAC priming (a negative first timestamp), like ffmpeg', async () => {
    const x = speechLike(1, 16000);
    const { opener } = fakeOpener({
      tracks: [{ planar: [x], sampleRate: 16000, firstTimestamp: -0.064 }],
    });
    const r = await decodeMedia(fileOf(), { opener, pipeline: { cleanup: false } });
    expect(r.samples).toBe(16000 - 1024);
    expect(r.startOffsetSeconds).toBe(-0.064);
    expect(Array.from(r.pcm.subarray(0, 50))).toEqual(
      Array.from(expectedPcm([x.subarray(1024)], 16000, { cleanup: false }).pcm.subarray(0, 50)),
    );
  });

  it('skips damaged data with a fresh decoder, fills the hole with silence and keeps the timeline', async () => {
    const x = speechLike(3, 16000);
    const { opener, state } = fakeOpener({
      tracks: [
        {
          planar: [x],
          sampleRate: 16000,
          failAt: { index: 12, error: new Error('Decoding error') },
        },
      ],
    });
    const r = await decodeMedia(fileOf(), { opener, pipeline: { cleanup: false } });
    // blocks 12 and 13 (1.2-1.4 s) are lost and replaced by 0.2 s of silence: the length is unchanged
    expect(state.starts.length).toBe(2);
    expect(state.starts[0]).toBeUndefined();
    expect(state.starts[1]).toBeCloseTo(1.45, 9);
    expect(r.samples).toBe(48000);
    expect(r.truncated).toBe(true);
    expect(r.warnings.map((w) => w.type)).toEqual(['decode-error']);
    expect(r.warnings[0].atSeconds).toBeCloseTo(1.2, 9);
    expect(r.warnings[0].seconds).toBeCloseTo(0.25, 9);
    expect(Array.from(r.pcm.subarray(19300, 22300)).every((v) => v === 0)).toBe(true);
    expect(r.pcm[30000]).toBe(expectedPcm([x], 16000, { cleanup: false }).pcm[30000]);
  });

  it('keeps what was decoded before an unrecoverable break, unless partialOnError is off', async () => {
    const x = speechLike(3, 16000);
    const broken = () =>
      fakeOpener({
        tracks: [
          {
            planar: [x],
            sampleRate: 16000,
            computed: 3,
            failAt: { index: 28, error: new Error('Decoding error') },
          },
        ],
      }).opener;
    // the resume point (2.8 + 0.25 s) is past the end minus 0.1 s, so the decoder cannot resume
    const r = await decodeMedia(fileOf(), { opener: broken(), pipeline: { cleanup: false } });
    expect(r.truncated).toBe(true);
    expect(r.samples).toBe(44800);
    expect(r.warnings.map((w) => w.type)).toEqual(['decode-error']);
    expect(r.warnings[0].message).toMatch(/could not be read past 2\.8 s/);
    const e = await decodeError(decodeMedia(fileOf(), { opener: broken(), partialOnError: false }));
    expect(e.code).toBe('DECODE_FAILED');
    expect(e.technical).toBe('Error: Decoding error');
  });

  it('warns when the file holds less audio than its header promises', async () => {
    const { opener } = fakeOpener({
      tracks: [{ planar: [speechLike(5, 16000)], sampleRate: 16000, computed: 10 }],
    });
    const r = await decodeMedia(fileOf(), { opener });
    expect(r.truncated).toBe(true);
    expect(r.warnings.map((w) => w.type)).toEqual(['truncated']);
    expect(r.warnings[0].message).toBe(
      'The file contains less audio than it promises: 10 s expected, 5 s could be read. It may be an incomplete download or damaged.',
    );
  });

  it('trims the MP3 encoder delay from the LAME tag', async () => {
    const x = speechLike(1, 16000);
    const { opener } = fakeOpener({
      container: 'MP3',
      tracks: [{ planar: [x], sampleRate: 16000 }],
    });
    const r = await decodeMedia(new Blob([mp3WithLameTag(576, 1000)]), {
      opener,
      pipeline: { cleanup: false },
    });
    expect(r.samples).toBe(16000 - (576 + 529));
  });
});

describe('decodeMedia errors', () => {
  const x = speechLike(1, 16000);

  it.each([
    ['an empty file', { tracks: [] }, new Blob([]), 'EMPTY_FILE'],
    [
      'a cut-off MP4 (no moov, so no tracks)',
      { container: 'MP4', tracks: [], trackCount: 0 },
      fileOf(),
      'CORRUPT',
    ],
    [
      'a video without sound',
      { container: 'MP4', tracks: [], trackCount: 1, hasVideo: true },
      fileOf(),
      'NO_AUDIO_TRACK',
    ],
    [
      'an Ogg stream the parser does not know (Speex)',
      { container: 'Ogg', tracks: [], trackCount: 0 },
      fileOf(),
      'UNSUPPORTED_CODEC',
    ],
  ] as const)('reports %s', async (_, media, file, code) => {
    const { opener } = fakeOpener({ ...media, tracks: [] });
    const e = await decodeError(decodeMedia(file, { opener }));
    expect(e.code).toBe(code);
  });

  it('names an undecodable codec (AC-3: no WASM decoder in v1) and suggests converting', async () => {
    const { opener } = fakeOpener({
      container: 'MP4',
      tracks: [{ planar: [x], sampleRate: 48000, info: { codec: 'ac3', canDecode: false } }],
    });
    const e = await decodeError(decodeMedia(fileOf(), { opener }));
    expect(e.code).toBe('UNSUPPORTED_CODEC');
    expect(e.codec).toBe('ac3');
    expect(e.userMessage).toMatch(/Dolby Digital \(AC-3\).*Convert it to MP3, M4A or WAV first/);
    expect(e.suggestion).toBe('convert-first');
  });

  it('passes through NOT_MEDIA from the container parser with the convert-first advice', async () => {
    const opener: MediaOpener = async () => {
      throw new DecodeError({
        code: 'NOT_MEDIA',
        technical: 'unsupported or unrecognizable format',
      });
    };
    const e = await decodeError(decodeMedia(fileOf(), { opener }));
    expect(e.code).toBe('NOT_MEDIA');
    expect(e.userMessage).toMatch(/Convert it to MP3, M4A or WAV first/);
  });

  it('refuses less than 0.3 s of audio with the Python sentence', async () => {
    const { opener } = fakeOpener({
      tracks: [{ planar: [x.subarray(0, 3200)], sampleRate: 16000 }],
    });
    const e = await decodeError(decodeMedia(fileOf(), { opener }));
    expect(e.code).toBe('TOO_SHORT');
    expect(e.userMessage).toBe('The audio is too short to transcribe.');
  });

  it('is cancelled by an aborted signal, before and during decoding, and releases the file', async () => {
    const before = new AbortController();
    before.abort();
    const a = fakeOpener({ tracks: [{ planar: [x], sampleRate: 16000 }] });
    expect(
      (await decodeError(decodeMedia(fileOf(), { opener: a.opener, signal: before.signal }))).code,
    ).toBe('CANCELLED');
    expect(a.state.opened).toBe(0);

    const during = new AbortController();
    const b = fakeOpener({
      tracks: [{ planar: [x], sampleRate: 16000, gate: (i) => void (i === 3 && during.abort()) }],
    });
    const e = await decodeError(decodeMedia(fileOf(), { opener: b.opener, signal: during.signal }));
    expect(e.code).toBe('CANCELLED');
    expect(e.userMessage).toBe('Cancelled.');
    expect(b.state.disposed).toBeGreaterThanOrEqual(1);
  });

  it('says the browser is too old when neither WebCodecs nor decodeAudioData exist', async () => {
    // jsdom has neither AudioDecoder nor OfflineAudioContext
    const e = await decodeError(decodeMedia(fileOf()));
    expect(e.code).toBe('NO_WEBCODECS');
  });
});

describe('decodeMedia fallback: decodeAudioData (main thread, no WebCodecs)', () => {
  let decodeCalls = 0;
  let behaviour: 'ok' | 'encoding-error' = 'ok';
  const audio = speechLike(1.5, 16000);

  class FakeOfflineAudioContext {
    constructor(
      readonly channels: number,
      readonly length: number,
      readonly sampleRate: number,
    ) {}
    async decodeAudioData(_data: ArrayBuffer): Promise<AudioBuffer> {
      decodeCalls++;
      if (behaviour === 'encoding-error') {
        throw new DOMException('Unable to decode audio data', 'EncodingError');
      }
      return {
        length: audio.length,
        numberOfChannels: 1,
        sampleRate: 16000,
        duration: audio.length / 16000,
        getChannelData: () => audio,
      } as unknown as AudioBuffer;
    }
  }

  const options = (extra: DecodeMediaOptions = {}): DecodeMediaOptions => ({
    webAudio: { mediaDuration: async () => 1.5 },
    ...extra,
  });

  beforeEach(() => {
    decodeCalls = 0;
    behaviour = 'ok';
    vi.stubGlobal('OfflineAudioContext', FakeOfflineAudioContext);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('decodes and cleans up through the same pipeline', async () => {
    const paths: string[] = [];
    const r = await decodeMedia(fileOf(), options({ onPath: (p) => paths.push(p) }));
    expect(paths).toEqual(['webaudio']);
    expect(r.path).toBe('webaudio');
    expect(Array.from(r.pcm)).toEqual(Array.from(expectedPcm([audio], 16000).pcm));
  });

  it('is tried after WebCodecs could not read the file, and the more precise first error wins if it fails too', async () => {
    behaviour = 'encoding-error';
    const opener: MediaOpener = async () => {
      throw new DecodeError({ code: 'NOT_MEDIA', technical: 'AVI' });
    };
    const paths: string[] = [];
    const e = await decodeError(
      decodeMedia(fileOf(), options({ opener, onPath: (p) => paths.push(p) })),
    );
    expect(paths).toEqual(['webcodecs', 'webaudio']);
    expect(decodeCalls).toBe(1);
    expect(e.code).toBe('NOT_MEDIA');
  });

  it('reports its own error when it was the only decoder (no WebCodecs)', async () => {
    behaviour = 'encoding-error';
    expect((await decodeError(decodeMedia(fileOf(), options()))).code).toBe('UNSUPPORTED_CODEC');
    const big = await decodeError(
      decodeMedia(fileOf(), {
        webAudio: { mediaDuration: async () => 3 * 3600, memoryBudgetBytes: 1 << 30 },
      }),
    );
    expect(big.code).toBe('TOO_LARGE');
    expect(decodeCalls).toBe(1);
  });

  it('is never tried for errors no decoder can fix', async () => {
    const { opener } = fakeOpener({ container: 'MP4', tracks: [], trackCount: 1, hasVideo: true });
    const e = await decodeError(decodeMedia(fileOf(), options({ opener })));
    expect(e.code).toBe('NO_AUDIO_TRACK');
    expect((await decodeError(decodeMedia(new Blob([]), options()))).code).toBe('EMPTY_FILE');
    expect(decodeCalls).toBe(0);
  });

  it('can be switched off', async () => {
    const e = await decodeError(decodeMedia(fileOf(), options({ allowWebAudio: false })));
    expect(e.code).toBe('NO_WEBCODECS');
    expect(decodeCalls).toBe(0);
  });
});

describe('probeMedia', () => {
  it('describes the file without decoding it', async () => {
    const { opener } = fakeOpener({
      container: 'QuickTime File Format',
      hasVideo: true,
      trackCount: 2,
      tracks: [
        {
          planar: [speechLike(2, 48000), speechLike(2, 48000, 5)],
          sampleRate: 48000,
          info: { codec: 'aac' },
        },
      ],
    });
    const p = await probeMedia(fileOf(), { opener });
    expect(p.ok).toBe(true);
    if (!p.ok) return;
    expect(p).toMatchObject({
      container: 'QuickTime File Format',
      hasVideo: true,
      chosen: 0,
      canDecode: true,
      channels: 2,
      sampleRate: 48000,
      durationSeconds: 2,
    });
    expect(p.audioTracks[0]).toMatchObject({ codec: 'aac', needsExtension: null });
  });

  it('says which optional decoder an AC-3 / DTS track would need', async () => {
    const { opener } = fakeOpener({
      container: 'MP4',
      tracks: [
        {
          planar: [speechLike(1, 48000)],
          sampleRate: 48000,
          info: { codec: 'eac3', canDecode: false },
        },
      ],
    });
    const p = await probeMedia(fileOf(), { opener });
    expect(p.ok && p.audioTracks[0].needsExtension).toBe('ac3');
    expect(p.ok && p.canDecode).toBe(false);
  });

  it('never throws: failures come back with the fallbacks that might still work', async () => {
    const empty = await probeMedia(new Blob([]), { opener: fakeOpener({ tracks: [] }).opener });
    expect(empty.ok === false && empty.error.code).toBe('EMPTY_FILE');
    expect(empty.ok === false && empty.fallbacks).toEqual([]);
    const notMedia = await probeMedia(fileOf(), {
      opener: async () => {
        throw new DecodeError({ code: 'NOT_MEDIA' });
      },
    });
    expect(notMedia.ok === false && notMedia.fallbacks).toEqual(['webaudio']);
    const silent = await probeMedia(fileOf(), {
      opener: fakeOpener({ container: 'MP4', tracks: [], trackCount: 1 }).opener,
    });
    expect(silent.ok === false && silent.error.code).toBe('NO_AUDIO_TRACK');
  });
});

describe('readMp3Gapless', () => {
  it('reads the LAME delay (+529, the ffmpeg rule) and the end trim, also after an ID3v2 tag', async () => {
    const g = await readMp3Gapless(new Blob([mp3WithLameTag(576, 1000)]));
    expect(g).toMatchObject({
      encoderDelay: 576,
      encoderPadding: 1000,
      startSkip: 576 + 529,
      endTrim: 1000 - 529,
      frames: 300,
      samplesPerFrame: 576,
      encoder: 'LAME3.100',
    });
    const id3 = new Uint8Array([0x49, 0x44, 0x33, 4, 0, 0, 0, 0, 0, 20, ...new Uint8Array(20)]);
    const tagged = await readMp3Gapless(new Blob([id3, mp3WithLameTag(1105, 0)]));
    expect(tagged?.startSkip).toBe(1105 + 529);
  });

  it('trims nothing without a trustworthy tag (ffmpeg does not either)', async () => {
    expect(await readMp3Gapless(new Blob([new Uint8Array(100000)]))).toBeNull();
    expect(await readMp3Gapless(new Blob(['not an mp3 file at all'.repeat(100)]))).toBeNull();
    expect(await readMp3Gapless(new Blob([mp3WithLameTag(576, 1000, 'Foobar100')]))).toBeNull();
  });
});

describe('audio worker protocol', () => {
  function harness(opener: MediaOpener) {
    const posted: { message: AudioWorkerResponse; transfer?: Transferable[] }[] = [];
    const handle = createAudioWorkerHandler(
      (message, transfer) => posted.push({ message, transfer }),
      { opener },
    );
    return { posted, handle };
  }
  const x = speechLike(1, 16000);

  it('posts progress, then the result with its PCM buffer transferred', async () => {
    const { posted, handle } = harness(
      fakeOpener({ tracks: [{ planar: [x], sampleRate: 16000 }] }).opener,
    );
    await handle({
      id: 7,
      type: 'decode',
      file: fileOf(),
      options: { pipeline: { cleanup: false } },
    });
    const done = posted.at(-1)!;
    expect(done.message.type).toBe('done');
    expect(
      posted.slice(0, -1).every((p) => p.message.type === 'progress' && p.message.id === 7),
    ).toBe(true);
    const result = (done.message as { result: DecodeResult }).result;
    expect(result.samples).toBe(16000);
    expect(done.transfer).toEqual([result.pcm.buffer]);
    // a whole buffer, not a view on a larger preallocated one
    expect(result.pcm.buffer.byteLength).toBe(result.pcm.byteLength);
  });

  it('streams chunks when asked', async () => {
    const { posted, handle } = harness(
      fakeOpener({ tracks: [{ planar: [x], sampleRate: 16000 }] }).opener,
    );
    await handle({
      id: 1,
      type: 'decode',
      file: fileOf(),
      options: { streamChunks: true, collect: false },
    });
    const chunks = posted.filter((p) => p.message.type === 'chunk');
    const total = chunks.reduce(
      (a, p) => a + (p.message as { chunk: Float32Array }).chunk.length,
      0,
    );
    expect(total).toBe(16000);
    expect(chunks.every((p) => p.transfer?.length === 1)).toBe(true);
  });

  it('serialises errors and cancels on request', async () => {
    let release!: () => void;
    const released = new Promise<void>((r) => (release = r));
    const opener = fakeOpener({
      tracks: [{ planar: [x], sampleRate: 16000, gate: (i) => (i === 2 ? released : undefined) }],
    }).opener;
    const { posted, handle } = harness(opener);
    const running = handle({ id: 3, type: 'decode', file: fileOf() });
    await new Promise((r) => setTimeout(r, 0));
    await handle({ id: 3, type: 'cancel' });
    release();
    await running;
    const last = posted.at(-1)!.message;
    expect(last.type === 'error' && last.error.code).toBe('CANCELLED');

    await handle({ id: 4, type: 'decode', file: new Blob([]) });
    const empty = posted.at(-1)!.message;
    expect(empty.type === 'error' && empty.error).toMatchObject({
      code: 'EMPTY_FILE',
      userMessage: expect.stringMatching(/empty/),
    });
  });

  it('answers a probe with a serialised result', async () => {
    const { posted, handle } = harness(fakeOpener({ tracks: [] }).opener);
    await handle({ id: 9, type: 'probe', file: new Blob([]) });
    const m = posted.at(-1)!.message;
    expect(m.type).toBe('probed');
    expect(m.type === 'probed' && !m.result.ok && m.result.error.code).toBe('EMPTY_FILE');
  });
});

/**
 * One MPEG-2 layer III frame header (16 kHz mono) followed by an Info tag with a frame count and a LAME extension:
 * just enough bytes for readMp3Gapless.
 */
function mp3WithLameTag(
  delay: number,
  padding: number,
  encoder = 'LAME3.100',
): Uint8Array<ArrayBuffer> {
  const b = new Uint8Array(512);
  // sync + MPEG-2 + layer III + no CRC | 64 kbps, 16 kHz | mono
  b.set([0xff, 0xf3, 0x88, 0xc0], 0);
  // side info of MPEG-2 mono is 9 bytes
  const tag = 4 + 9;
  b.set(
    [...'Info'].map((c) => c.charCodeAt(0)),
    tag,
  );
  const dv = new DataView(b.buffer);
  dv.setUint32(tag + 4, 1);
  dv.setUint32(tag + 8, 300);
  const q = tag + 12;
  b.set(
    [...encoder].map((c) => c.charCodeAt(0)),
    q,
  );
  const v = (delay << 12) | padding;
  b.set([(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff], q + 21);
  return b;
}
