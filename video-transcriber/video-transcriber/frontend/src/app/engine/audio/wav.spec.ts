import type { AudioWorkerRequest, AudioWorkerResponse } from './audio-worker-core';
import { serializeError, DecodeError } from './errors';
import { AudioWorkerLike, buildWavPreview } from './preview';
import { WAV_HEADER_BYTES, WavBlobBuilder, wavHeader } from './wav';

// jsdom 27's Blob has no arrayBuffer(); every browser the app supports has it.
function bytesOf(b: Blob): Promise<ArrayBuffer> {
  if (typeof b.arrayBuffer === 'function') return b.arrayBuffer();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as ArrayBuffer);
    r.onerror = () => reject(r.error);
    r.readAsArrayBuffer(b);
  });
}

describe('WAV files for the player of files the browser cannot play', () => {
  it('writes a RIFF / WAVE header for 16 kHz mono 16-bit PCM', () => {
    const h = new DataView(wavHeader(16000).buffer);
    const tag = (o: number) => String.fromCharCode(h.getUint8(o), h.getUint8(o + 1), h.getUint8(o + 2), h.getUint8(o + 3));
    expect([tag(0), tag(8), tag(12), tag(36)]).toEqual(['RIFF', 'WAVE', 'fmt ', 'data']);
    expect(h.getUint32(4, true)).toBe(36 + 32000);
    expect(h.getUint16(20, true)).toBe(1); // PCM
    expect(h.getUint16(22, true)).toBe(1); // mono
    expect(h.getUint32(24, true)).toBe(16000);
    expect(h.getUint32(28, true)).toBe(32000);
    expect(h.getUint16(34, true)).toBe(16);
    expect(h.getUint32(40, true)).toBe(32000);
  });

  it('packs float chunks into 16-bit samples across Blob parts (clipped, rounded half away from zero)', async () => {
    const w = new WavBlobBuilder(16000, 4);
    w.append(Float32Array.from([0, 0.5, -0.5, 1]));
    w.append(Float32Array.from([-1, 2, -2]));
    expect(w.samples).toBe(7);
    const blob = w.finish();
    expect(blob.type).toBe('audio/wav');
    expect(blob.size).toBe(WAV_HEADER_BYTES + 14);
    const data = new Int16Array((await bytesOf(blob)).slice(WAV_HEADER_BYTES));
    expect(Array.from(data)).toEqual([0, 16384, -16384, 32767, -32768, 32767, -32768]);
    expect(new DataView(await bytesOf(blob)).getUint32(40, true)).toBe(14);
  });
});

describe('buildWavPreview', () => {
  function fakeWorker(reply: (req: AudioWorkerRequest, post: (m: AudioWorkerResponse) => void) => void) {
    const state = { terminated: false, requests: [] as AudioWorkerRequest[] };
    const w: AudioWorkerLike = {
      onmessage: null,
      onerror: null,
      postMessage(req) {
        state.requests.push(req);
        setTimeout(() => reply(req, (m) => w.onmessage?.({ data: m })));
      },
      terminate() {
        state.terminated = true;
      },
    };
    return { w, state };
  }

  it('decodes without the clean-up filters in a worker of its own and streams the chunks into a WAV', async () => {
    const { w, state } = fakeWorker((req, post) => {
      post({ id: req.id, type: 'chunk', startSample: 0, chunk: Float32Array.from([0.5, 0.5]) });
      post({ id: req.id, type: 'chunk', startSample: 2, chunk: Float32Array.from([-0.5]) });
      post({ id: req.id, type: 'done', result: {} as never });
    });
    const wav = await buildWavPreview(new Blob(['x']), { worker: () => w, converter: true });
    expect(wav.size).toBe(WAV_HEADER_BYTES + 6);
    const req = state.requests[0] as Extract<AudioWorkerRequest, { type: 'decode' }>;
    expect(req.options).toMatchObject({ collect: false, streamChunks: true, pipeline: { cleanup: false }, ffmpeg: {} });
    expect(state.terminated).toBe(true);
  });

  it('rejects with the decode error, and with a cancel when the signal fires', async () => {
    const { w } = fakeWorker((req, post) => post({ id: req.id, type: 'error', error: serializeError(new DecodeError({ code: 'NOT_MEDIA' })) }));
    await expect(buildWavPreview(new Blob(['x']), { worker: () => w })).rejects.toMatchObject({ code: 'NOT_MEDIA' });
    const slow = fakeWorker(() => undefined);
    const ac = new AbortController();
    const p = buildWavPreview(new Blob(['x']), { worker: () => slow.w, signal: ac.signal });
    ac.abort();
    await expect(p).rejects.toMatchObject({ name: 'CancelledError' });
    expect(slow.state.terminated).toBe(true);
    const req = slow.state.requests[0] as Extract<AudioWorkerRequest, { type: 'decode' }>;
    expect(req.options?.ffmpeg).toBeUndefined(); // no consent, no converter
  });
});
