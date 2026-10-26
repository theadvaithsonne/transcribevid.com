/**
 * The seam between the decode loop (decode.ts) and the library that parses containers and drives WebCodecs.
 *
 * `openWithMediabunny` is the real one: the File is read through BlobSource in 8 MiB cache windows (nothing else of
 * the file is in memory), each audio track is decoded by mediabunny's AudioSampleSink, which feeds AudioDecoder at
 * most 4 blocks ahead. The specs replace it with a fake that yields synthetic blocks.
 */
import {
  ALL_FORMATS,
  AudioSample,
  AudioSampleSink,
  BlobSource,
  Input,
  InputAudioTrack,
  UnsupportedInputFormatError,
} from 'mediabunny';
import { DecodeError } from './errors';

export interface MediaTrackInfo {
  /** mediabunny codec name ('aac', 'mp3', 'opus', 'ac3', 'pcm-s16' ...) or null when unknown to it. */
  codec: string | null;
  /** The container's own codec id ('samr', 'alac' ...) when it is a string or number. */
  internalCodecId: string | number | null;
  sampleRate: number;
  channels: number;
  canDecode: boolean;
  durationMetaSeconds: number | null;
  language: string;
  name: string | null;
}

/** One decoded block of audio (an AudioSample / AudioData underneath). */
export interface DecodedBlock {
  readonly timestamp: number;
  readonly duration: number;
  readonly numberOfFrames: number;
  readonly sampleRate: number;
  readonly numberOfChannels: number;
  /** Copies one channel as float32 into `dest[0 .. numberOfFrames)`. */
  copyChannel(channel: number, dest: Float32Array): void;
  /** Releases the decoder's memory for this block; always called. */
  close(): void;
}

export interface MediaAudioTrack {
  info(): Promise<MediaTrackInfo>;
  /** Duration from the packets (reliable), or null. */
  computeDuration(): Promise<number | null>;
  /** Decoded blocks in presentation order from `startSeconds` (used to resume after damaged data). */
  blocks(startSeconds?: number): AsyncGenerator<DecodedBlock, void, unknown>;
}

export interface OpenedMedia {
  /** mediabunny format name: 'MP4', 'QuickTime File Format', 'Matroska', 'WebM', 'Ogg', 'WAVE', 'MP3', ... */
  container: string;
  mimeType: string | null;
  trackCount: number;
  hasVideo: boolean;
  audioTracks: MediaAudioTrack[];
  /** Releases the file; also makes pending reads and decoder waits fail at once (fast cancel). */
  dispose(): void;
}

/** Throws DecodeError NOT_MEDIA when the container is not recognised. */
export type MediaOpener = (file: Blob) => Promise<OpenedMedia>;

export const openWithMediabunny: MediaOpener = async (file) => {
  const input = new Input({
    source: new BlobSource(file, { maxCacheSize: 8 * 1024 * 1024 }),
    formats: ALL_FORMATS,
  });
  try {
    let container: string;
    try {
      container = (await input.getFormat()).name;
    } catch (e) {
      if (e instanceof UnsupportedInputFormatError) {
        throw new DecodeError({ code: 'NOT_MEDIA', technical: e.message, cause: e });
      }
      throw e;
    }
    let mimeType: string | null = null;
    try {
      mimeType = await input.getMimeType();
    } catch {
      // optional
    }
    const tracks = await input.getTracks();
    const audio = tracks.filter((t): t is InputAudioTrack => t.isAudioTrack());
    return {
      container,
      mimeType,
      trackCount: tracks.length,
      hasVideo: tracks.some((t) => t.isVideoTrack()),
      audioTracks: audio.map(adaptTrack),
      dispose: () => input.dispose(),
    };
  } catch (e) {
    input.dispose();
    throw e;
  }
};

function adaptTrack(track: InputAudioTrack): MediaAudioTrack {
  let sink: AudioSampleSink | null = null;
  return {
    async info() {
      const codec = ((await track.getCodec()) as string | null) ?? null;
      const internal = (await track.getInternalCodecId()) as string | number | Uint8Array | null;
      const internalCodecId =
        typeof internal === 'string' || typeof internal === 'number' ? internal : null;
      let canDecode = false;
      try {
        canDecode = await track.canDecode();
      } catch {
        // treated as not decodable
      }
      let durationMetaSeconds: number | null = null;
      try {
        durationMetaSeconds = await track.getDurationFromMetadata();
      } catch {
        // optional
      }
      let language = 'und';
      let name: string | null = null;
      try {
        language = await track.getLanguageCode();
        name = await track.getName();
      } catch {
        // optional
      }
      return {
        codec,
        internalCodecId,
        sampleRate: await track.getSampleRate(),
        channels: await track.getNumberOfChannels(),
        canDecode,
        durationMetaSeconds,
        language,
        name,
      };
    },
    async computeDuration() {
      try {
        return await track.computeDuration();
      } catch {
        return null;
      }
    },
    async *blocks(startSeconds?: number) {
      sink ??= new AudioSampleSink(track);
      // for-await forwards return() to mediabunny's generator, which stops its decoder
      for await (const sample of sink.samples(startSeconds)) yield wrapSample(sample);
    },
  };
}

function wrapSample(s: AudioSample): DecodedBlock {
  return {
    timestamp: s.timestamp,
    duration: s.duration,
    numberOfFrames: s.numberOfFrames,
    sampleRate: s.sampleRate,
    numberOfChannels: s.numberOfChannels,
    copyChannel: (channel, dest) =>
      s.copyTo(dest.subarray(0, s.numberOfFrames), { planeIndex: channel, format: 'f32-planar' }),
    close: () => s.close(),
  };
}
