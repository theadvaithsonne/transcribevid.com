/**
 * The message handler of the decode worker (audio.worker.ts), kept free of `self` so the specs can drive it.
 * The engine worker (engine/worker/) can embed the same handler or call decodeMedia directly.
 *
 *   page -> worker  { id, type: 'decode', file, options? }   options = DecodeMediaOptions without functions / signal
 *                   { id, type: 'probe', file }
 *                   { id, type: 'cancel' }                    cancels the decode with the same id
 *   worker -> page  { id, type: 'progress', progress }
 *                   { id, type: 'chunk', startSample, chunk }  only with options.streamChunks (Float32, transferred)
 *                   { id, type: 'done', result }              result.pcm's buffer is transferred, not copied
 *                   { id, type: 'probed', result }            errors in it are serialised
 *                   { id, type: 'error', error }              SerializedDecodeError (reviveError() on the page)
 * A File / Blob is passed by reference (structured clone shares the data), so a 2 GB file is not copied.
 */
import { decodeMedia, DecodeMediaOptions } from './index';
import { probeMedia } from './decode';
import { SerializedDecodeError, serializeError } from './errors';
import type { MediaOpener } from './media-source';
import type { DecodeProgress, DecodeResult, ProbeOk } from './types';

export type WorkerDecodeOptions = Omit<
  DecodeMediaOptions,
  'signal' | 'onProgress' | 'onChunk' | 'onPath' | 'opener' | 'webAudio'
> & {
  /** Post every 16 kHz Float32 chunk as it is produced. */
  streamChunks?: boolean;
};

export type AudioWorkerRequest =
  | { id: number; type: 'decode'; file: Blob; options?: WorkerDecodeOptions }
  | { id: number; type: 'probe'; file: Blob }
  | { id: number; type: 'cancel' };

export type SerializedProbeResult =
  ProbeOk | { ok: false; error: SerializedDecodeError; fallbacks: 'webaudio'[] };

export type AudioWorkerResponse =
  | { id: number; type: 'progress'; progress: DecodeProgress }
  | { id: number; type: 'chunk'; startSample: number; chunk: Float32Array }
  | { id: number; type: 'done'; result: DecodeResult }
  | { id: number; type: 'probed'; result: SerializedProbeResult }
  | { id: number; type: 'error'; error: SerializedDecodeError };

export type PostMessage = (message: AudioWorkerResponse, transfer?: Transferable[]) => void;

export function createAudioWorkerHandler(
  post: PostMessage,
  options: { opener?: MediaOpener } = {},
): (message: AudioWorkerRequest) => Promise<void> {
  const controllers = new Map<number, AbortController>();

  return async (m) => {
    if (m.type === 'cancel') {
      controllers.get(m.id)?.abort();
      return;
    }
    if (m.type === 'probe') {
      const p = await probeMedia(m.file, { opener: options.opener });
      const result: SerializedProbeResult = p.ok
        ? p
        : { ok: false, error: serializeError(p.error), fallbacks: p.fallbacks };
      post({ id: m.id, type: 'probed', result });
      return;
    }
    const ac = new AbortController();
    controllers.set(m.id, ac);
    try {
      const { streamChunks, ...rest } = m.options ?? {};
      const decodeOptions: DecodeMediaOptions = {
        ...rest,
        opener: options.opener,
        signal: ac.signal,
        onProgress: (progress) => post({ id: m.id, type: 'progress', progress }),
      };
      if (streamChunks) {
        decodeOptions.onChunk = (c, info) => {
          // copy: the pipeline reuses its buffers
          const chunk = c.slice();
          post({ id: m.id, type: 'chunk', startSample: info.startSample, chunk }, [chunk.buffer]);
        };
      }
      const result = await decodeMedia(m.file, decodeOptions);
      // a view on a larger preallocated buffer would transfer the whole buffer; copy once in that case
      const pcm =
        result.pcm.byteOffset === 0 && result.pcm.byteLength === result.pcm.buffer.byteLength
          ? result.pcm
          : result.pcm.slice();
      post({ id: m.id, type: 'done', result: { ...result, pcm } }, [pcm.buffer as ArrayBuffer]);
    } catch (e) {
      post({ id: m.id, type: 'error', error: serializeError(e) });
    } finally {
      controllers.delete(m.id);
    }
  };
}
