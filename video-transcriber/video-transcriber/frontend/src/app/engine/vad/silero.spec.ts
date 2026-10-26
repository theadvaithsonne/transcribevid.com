import {
  CANARY_EXPECTED_V60,
  CANARY_EXPECTED_V62,
  CANARY_FRAMES,
  canarySignal,
  selfTest,
} from './canary';
import { OrtLike, OrtSessionLike, OrtTensorLike, SileroVad } from './silero';
import { CONTEXT, FRAME, FrameModel } from './types';

/**
 * A stand-in for onnxruntime-web: records the session options and every run(). Its "model" returns, per
 * row, the first sample after the context, and counts the calls in hn / cn so the state hand-over is visible.
 * The real model is exercised in headless Chrome (README.md, browser check).
 */
function fakeOrt(inputNames = ['input', 'h', 'c']) {
  const created: { model: unknown; options: Record<string, unknown> | undefined }[] = [];
  const runs: Record<string, OrtTensorLike>[] = [];
  class Tensor implements OrtTensorLike {
    constructor(
      readonly type: string,
      readonly data: ArrayLike<number> | ArrayLike<bigint>,
      readonly dims: readonly number[],
    ) {}
  }
  const session: OrtSessionLike = {
    inputNames,
    outputNames: ['speech_probs', 'hn', 'cn'],
    async run(feeds) {
      // copy what the wrapper passed (it reuses its input buffer)
      const input = Float32Array.from(feeds['input'].data as Float32Array);
      runs.push({ ...feeds, input: new Tensor('float32', input, feeds['input'].dims) });
      const n = feeds['input'].dims[0];
      const probs = new Float32Array(n);
      for (let j = 0; j < n; j++) probs[j] = input[j * (FRAME + CONTEXT) + CONTEXT];
      const h = Float32Array.from(feeds['h'].data as Float32Array).map((x) => x + 1);
      return {
        speech_probs: new Tensor('float32', probs, [n]),
        hn: new Tensor('float32', h, [1, 1, 128]),
        cn: new Tensor('float32', h, [1, 1, 128]),
      };
    },
    async release() {
      created.push({ model: 'released', options: undefined });
    },
  };
  const ort: OrtLike = {
    Tensor,
    InferenceSession: {
      async create(model, options) {
        created.push({ model, options });
        return session;
      },
    },
    env: { wasm: {} },
  };
  return { ort, created, runs };
}

describe('SileroVad (onnxruntime-web wrapper)', () => {
  it('pins the execution provider to wasm, even when the caller asks for webgpu', async () => {
    const { ort, created } = fakeOrt();
    await SileroVad.create(new Uint8Array([1, 2, 3]), {
      ort,
      sessionOptions: { executionProviders: ['webgpu'], logSeverityLevel: 0 },
    });
    expect(created[0].options).toEqual(
      expect.objectContaining({
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
        logSeverityLevel: 0,
      }),
    );
  });

  it('applies the caller-provided ORT environment (wasm paths, threads) before creating the session', async () => {
    const { ort } = fakeOrt();
    await SileroVad.create(new Uint8Array(1), {
      ort,
      env: { wasmPaths: '/ort/', numThreads: 1, proxy: false, logLevel: 'error' },
    });
    expect(ort.env).toEqual({
      wasm: { wasmPaths: '/ort/', numThreads: 1, proxy: false },
      logLevel: 'error',
    });
  });

  it('refuses a model that is not the faster-whisper sequence export', async () => {
    const { ort } = fakeOrt(['input', 'state', 'sr']);
    await expect(SileroVad.create(new Uint8Array(1), { ort })).rejects.toThrow(
      /faster-whisper Silero/,
    );
  });

  it('feeds [64 samples of context | 512 samples] rows and carries context and LSTM state across calls', async () => {
    const { ort, runs } = fakeOrt();
    const vad = await SileroVad.create(new Uint8Array(1), { ort });
    const audio = Float32Array.from({ length: 5 * FRAME }, (_, i) => i + 1);
    const p1 = await vad.predict(audio.subarray(0, 3 * FRAME), 3);
    const p2 = await vad.predict(audio.subarray(3 * FRAME), 2);
    expect(Array.from(p1)).toEqual([1, FRAME + 1, 2 * FRAME + 1]);
    expect(Array.from(p2)).toEqual([3 * FRAME + 1, 4 * FRAME + 1]);
    const row = FRAME + CONTEXT;
    const second = runs[1]['input'].data as Float32Array;
    expect(runs[1]['input'].dims).toEqual([2, row]);
    // first row of the second call: context = the last 64 samples of the first call's last frame
    expect(Array.from(second.subarray(0, CONTEXT))).toEqual(
      Array.from(audio.subarray(3 * FRAME - CONTEXT, 3 * FRAME)),
    );
    // second row: context = the tail of the row before
    expect(Array.from(second.subarray(row, row + CONTEXT))).toEqual(
      Array.from(audio.subarray(4 * FRAME - CONTEXT, 4 * FRAME)),
    );
    // the very first row of a stream has a zero context
    expect(Array.from((runs[0]['input'].data as Float32Array).subarray(0, CONTEXT))).toEqual(
      new Array(CONTEXT).fill(0),
    );
    // hn of the first call is the h of the second
    expect((runs[1]['h'].data as Float32Array)[0]).toBe(1);
    vad.reset();
    await vad.predict(audio.subarray(0, FRAME), 1);
    expect((runs[2]['h'].data as Float32Array)[0]).toBe(0);
    expect(Array.from((runs[2]['input'].data as Float32Array).subarray(0, CONTEXT))).toEqual(
      new Array(CONTEXT).fill(0),
    );
    expect(await vad.predict(new Float32Array(0), 0)).toEqual(new Float32Array(0));
    await vad.dispose();
  });
});

describe('self-test canary', () => {
  const replay = (values: readonly number[]): FrameModel => ({
    name: 'replay',
    reset() {},
    async predict(_frames: Float32Array, n: number) {
      return Float32Array.from(values.slice(0, n));
    },
  });

  it('is a deterministic 1.5 s signal of 48 frames with silent edges', () => {
    const a = canarySignal();
    expect(a.length).toBe(CANARY_FRAMES * FRAME);
    expect(canarySignal()).toEqual(a);
    expect(a[0]).toBe(0);
    expect(Math.max(...a.map(Math.abs))).toBeGreaterThan(0.2);
    expect(CANARY_EXPECTED_V60).toHaveLength(CANARY_FRAMES);
    expect(CANARY_EXPECTED_V62).toHaveLength(CANARY_FRAMES);
  });

  it('passes for the expected probabilities, fails for the other weights and for a broken model', async () => {
    expect((await selfTest(replay(CANARY_EXPECTED_V60))).ok).toBe(true);
    const other = await selfTest(replay(CANARY_EXPECTED_V62));
    expect(other.ok).toBe(false);
    expect(other.maxDiff).toBeGreaterThan(0.1);
    expect((await selfTest(replay(new Array(CANARY_FRAMES).fill(0.5)))).ok).toBe(false);
    expect((await selfTest(replay(new Array(CANARY_FRAMES).fill(NaN)))).ok).toBe(false);
    expect((await selfTest(replay(CANARY_EXPECTED_V62), CANARY_EXPECTED_V62)).ok).toBe(true);
  });
});
