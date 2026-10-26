/**
 * Web Worker entry of the IndicXlit converter. Start it with
 *   new Worker(new URL('./indicxlit.worker', import.meta.url), { type: 'module' })
 * or, more conveniently, through IndicXlitClient (indicxlit-client.ts).
 */
import { WorkerRequest, createWorkerHandler } from './indicxlit-worker-core';

const scope = self as unknown as {
  postMessage(message: unknown): void;
  onmessage: ((event: { data: WorkerRequest }) => void) | null;
};

const handle = createWorkerHandler((message) => scope.postMessage(message));
scope.onmessage = (event) => {
  void handle(event.data);
};
