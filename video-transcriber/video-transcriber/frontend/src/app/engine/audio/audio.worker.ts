/**
 * Web Worker entry of the decoder. Start it with
 *   new Worker(new URL('./audio.worker', import.meta.url), { type: 'module' })
 * and speak the protocol in audio-worker-core.ts. WebCodecs exists in dedicated workers; decodeAudioData does not,
 * so this worker never uses the fallback.
 */
import { AudioWorkerRequest, createAudioWorkerHandler } from './audio-worker-core';

const scope = self as unknown as {
  postMessage(message: unknown, transfer?: Transferable[]): void;
  onmessage: ((event: { data: AudioWorkerRequest }) => void) | null;
};

const handle = createAudioWorkerHandler((message, transfer) =>
  scope.postMessage(message, transfer ?? []),
);
scope.onmessage = (event) => {
  void handle(event.data);
};
