/**
 * The player source for a stored file the browser cannot play (ARCHITECTURE section 3, M4 gap): the file is decoded
 * again in the decode worker (audio.worker.ts, 240-1150x real time on the WebCodecs path) without the clean-up
 * filters, and the 16 kHz mono chunks become a WAV Blob (wav.ts) as they stream in. The page turns it into an object
 * URL. Nothing is stored: after a reload the preview is built again on demand.
 */
import type { AudioWorkerRequest, AudioWorkerResponse } from './audio-worker-core';
import { reviveError } from './errors';
import { WavBlobBuilder } from './wav';

export interface AudioWorkerLike {
  postMessage(message: AudioWorkerRequest, transfer?: Transferable[]): void;
  terminate(): void;
  onmessage: ((event: { data: AudioWorkerResponse }) => void) | null;
  onerror: ((event: { message?: string }) => void) | null;
}

export interface PreviewOptions {
  signal?: AbortSignal;
  /** the visitor agreed to the ffmpeg.wasm converter (AVI, WMA ... need it to be decoded at all) */
  converter?: boolean;
  /** replaces the real decode worker (specs) */
  worker?: () => AudioWorkerLike;
}

function defaultWorker(): AudioWorkerLike {
  return new Worker(new URL('./audio.worker', import.meta.url), { type: 'module' }) as unknown as AudioWorkerLike;
}

/** Decodes `file` in a worker of its own and returns it as 16 kHz mono 16-bit WAV. Rejects with a DecodeError. */
export function buildWavPreview(file: Blob, o: PreviewOptions = {}): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    const worker = (o.worker ?? defaultWorker)();
    const wav = new WavBlobBuilder();
    const id = 1;
    let settled = false;
    const end = (fn: () => void) => {
      if (settled) return;
      settled = true;
      o.signal?.removeEventListener('abort', onAbort);
      worker.onmessage = null;
      worker.onerror = null;
      try {
        worker.terminate();
      } catch {
        // gone
      }
      fn();
    };
    const onAbort = () => end(() => reject(Object.assign(new Error('cancelled'), { name: 'CancelledError' })));
    if (o.signal?.aborted) {
      onAbort();
      return;
    }
    o.signal?.addEventListener('abort', onAbort, { once: true });
    worker.onerror = (e) => end(() => reject(new Error(e?.message || 'the decode worker crashed')));
    worker.onmessage = ({ data: m }) => {
      if (m.id !== id) return;
      if (m.type === 'chunk') wav.append(m.chunk);
      else if (m.type === 'done') end(() => resolve(wav.finish()));
      else if (m.type === 'error') end(() => reject(reviveError(m.error)));
    };
    worker.postMessage({
      id,
      type: 'decode',
      file,
      options: {
        collect: false,
        streamChunks: true,
        pipeline: { cleanup: false },
        ...(o.converter ? { ffmpeg: {} } : {}),
      },
    });
  });
}
