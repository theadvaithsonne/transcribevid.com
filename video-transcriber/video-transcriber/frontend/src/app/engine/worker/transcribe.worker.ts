/**
 * Web Worker entry of the in-browser engine: one job pipeline at a time (pipeline.ts) behind the protocol of
 * protocol.ts. Start it through WorkerClient (worker-client.ts), which also applies the hard cancel and the recycle.
 */
import type { EngineRequest } from './protocol';
import { createEngineWorkerHandler } from './worker-core';

const scope = self as unknown as {
  postMessage(message: unknown, transfer?: Transferable[]): void;
  onmessage: ((event: { data: EngineRequest }) => void) | null;
};

const handle = createEngineWorkerHandler((message, transfer) => scope.postMessage(message, transfer ?? []));
scope.onmessage = (event) => {
  void handle(event.data);
};
