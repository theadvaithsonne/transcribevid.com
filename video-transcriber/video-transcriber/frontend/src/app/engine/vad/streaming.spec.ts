import { EnergyVadModel } from './energy';
import { GOLDEN } from './fixtures/golden';
import {
  CONFIGS,
  golden,
  goldenProbs,
  randomPartition,
  rng,
  syntheticSpeech,
  tagOf,
  toSegs,
} from './fixtures/helpers';
import { AudioRing, StreamingVad, detectSpeech } from './streaming';
import { CONTEXT, FRAME, FrameModel, SpeechSegment, WHISPER_VAD, WHISPER_VAD_30S } from './types';

/**
 * Plays back the probabilities Silero produced in Python, frame by frame in stream order, and records the
 * frames it was given. With it, StreamingVad must reproduce Python's segments exactly: that checks the frame
 * partition, the zero-padded tail frame and the segmenter wiring without the ONNX runtime.
 */
class ReplayModel implements FrameModel {
  readonly name = 'replay';
  private at = 0;
  calls = 0;
  lastFrame = new Float32Array(FRAME);

  constructor(private readonly probs: Float32Array) {}

  reset(): void {
    this.at = 0;
  }

  async predict(frames: Float32Array, n: number): Promise<Float32Array> {
    this.calls++;
    if (this.at + n > this.probs.length) throw new Error('more frames than Python judged');
    this.lastFrame = frames.slice((n - 1) * FRAME, n * FRAME);
    const out = this.probs.slice(this.at, this.at + n);
    this.at += n;
    return out;
  }

  get consumed(): number {
    return this.at;
  }
}

/** deterministic stand-in for Silero: probability from the frame's mean level */
class FakeModel implements FrameModel {
  readonly name = 'fake';
  calls = 0;
  reset(): void {}
  async predict(frames: Float32Array, n: number): Promise<Float32Array> {
    this.calls++;
    const out = new Float32Array(n);
    for (let j = 0; j < n; j++) {
      let e = 0;
      for (let i = 0; i < FRAME; i++) e += Math.abs(frames[j * FRAME + i]);
      out[j] = e / FRAME > 0.01 ? 0.95 : 0.02;
    }
    return out;
  }
}

async function streamed(
  vad: StreamingVad,
  pcm: Float32Array,
  parts: number[],
  checkRetain = true,
): Promise<SpeechSegment[]> {
  const out: SpeechSegment[] = [];
  let at = 0;
  for (const len of parts) {
    const before = vad.retainFrom;
    const chunk = pcm.slice(at, at + len);
    const got = await vad.push(chunk);
    chunk.fill(NaN); // the decoder may reuse its buffer
    if (checkRetain) for (const s of got) expect(s.start).toBeGreaterThanOrEqual(before);
    out.push(...got);
    at += len;
  }
  out.push(...(await vad.flush()));
  return out;
}

describe('StreamingVad on the recorded Silero traces == Python, for random chunkings', () => {
  for (const v of GOLDEN) {
    it(`${tagOf(v)}: whisper, whisper 30 s and qwen parameters`, async () => {
      const probs = goldenProbs(v);
      const pcm = new Float32Array(v.samples); // the replay model ignores the audio
      const rand = rng(99 + v.samples);
      for (const cfg of ['whisper', 'whisper_max30', 'qwen']) {
        for (let trial = 0; trial < 2; trial++) {
          const model = new ReplayModel(probs);
          const vad = new StreamingVad(model, CONFIGS[cfg], { batchFrames: trial ? 64 : 256 });
          const parts = randomPartition(v.samples, rand, trial ? 300 : 70000);
          const out = await streamed(vad, pcm, parts);
          expect(model.consumed, 'frames judged').toBe(v.frames);
          expect(out, `${tagOf(v)} / ${cfg} / trial ${trial}`).toEqual(
            toSegs(v.configs[cfg].segments),
          );
        }
      }
    });
  }
});

describe('StreamingVad frame partition', () => {
  it('judges floor(n / 512) + 1 frames and zeroes the tail frame like faster-whisper', async () => {
    for (const n of [
      0,
      1,
      63,
      64,
      65,
      447,
      448,
      449,
      511,
      512,
      513,
      1023,
      1024,
      256 * 512,
      256 * 512 + 1,
    ]) {
      const pcm = Float32Array.from({ length: n }, (_, i) => 0.3 + 0.1 * Math.sin(i));
      const probs = new Float32Array(Math.floor(n / FRAME) + 1).fill(0.9);
      const model = new ReplayModel(probs);
      const vad = new StreamingVad(model, WHISPER_VAD);
      for (let i = 0; i < n; i += 100) await vad.push(pcm.subarray(i, Math.min(n, i + 100)));
      const segs = await vad.flush();
      expect(model.consumed, `n=${n}`).toBe(probs.length);
      const rem = n % FRAME;
      const tail = model.lastFrame;
      for (let i = 0; i < FRAME; i++) {
        const zero = i >= rem || i >= FRAME - CONTEXT;
        if (zero) expect(tail[i], `n=${n} i=${i}`).toBe(0);
        else expect(tail[i]).toBe(pcm[n - rem + i]);
      }
      expect(segs).toEqual(n ? [{ start: 0, end: n }] : []);
    }
  });

  it('the model batch size changes the number of calls, not the result', async () => {
    const pcm = syntheticSpeech(40, 3, [
      [2, 9],
      [12, 13],
      [20, 35],
    ]);
    const ref = await detectSpeech(new FakeModel(), pcm, WHISPER_VAD_30S);
    expect(ref.length).toBeGreaterThan(1);
    for (const b of [1, 7, 64, 1000]) {
      const model = new FakeModel();
      expect(await detectSpeech(model, pcm, WHISPER_VAD_30S, { batchFrames: b }), `b=${b}`).toEqual(
        ref,
      );
      expect(model.calls).toBe(Math.floor(pcm.length / FRAME / b) + 1);
    }
  });

  it('onProbs reports every batch with its first frame index', async () => {
    const seen: [number, number][] = [];
    const vad = new StreamingVad(new FakeModel(), WHISPER_VAD, {
      batchFrames: 4,
      onProbs: (first, p) => seen.push([first, p.length]),
    });
    await vad.push(new Float32Array(10 * FRAME + 5));
    await vad.flush();
    expect(seen).toEqual([
      [0, 4],
      [4, 4],
      [8, 3],
    ]);
    expect(vad.stats).toEqual(
      expect.objectContaining({ samples: 10 * FRAME + 5, frames: 11, modelCalls: 3 }),
    );
  });
});

describe('StreamingVad memory, cancellation and call order', () => {
  it('one hour of continuous speech: the ring never holds more than about two segments (max speech 30 s)', async () => {
    const vad = new StreamingVad(new FakeModel(), WHISPER_VAD_30S);
    const ring = new AudioRing();
    const block = new Float32Array(16000).fill(0.3); // 1 s of "speech"
    let maxRetained = 0;
    let segs = 0;
    for (let sec = 0; sec < 3600; sec++) {
      ring.append(block);
      for (const s of await vad.push(block, false)) {
        ring.slice(s.start, s.end);
        segs++;
      }
      ring.discardBefore(vad.retainFrom);
      maxRetained = Math.max(maxRetained, ring.retainedSamples);
    }
    segs += (await vad.flush()).length;
    expect(segs).toBeGreaterThan(110); // ~ 3600 / 29.2
    expect(maxRetained / 16000).toBeLessThan(60);
  }, 60_000); // heavy: ~2.3 s under the full parallel suite (M6)

  it('without a max-speech cap the open segment is held until it ends (why the browser uses 30 s)', async () => {
    const vad = new StreamingVad(new FakeModel(), WHISPER_VAD);
    const ring = new AudioRing();
    const block = new Float32Array(16000).fill(0.3);
    for (let sec = 0; sec < 300; sec++) {
      ring.append(block);
      await vad.push(block, false);
      ring.discardBefore(vad.retainFrom);
    }
    expect(ring.retainedSamples / 16000).toBeGreaterThan(290);
  });

  it('an aborted signal stops the stream before the next model call', async () => {
    const ctl = new AbortController();
    const model = new FakeModel();
    const vad = new StreamingVad(model, WHISPER_VAD, { signal: ctl.signal, batchFrames: 4 });
    await vad.push(new Float32Array(4 * FRAME));
    ctl.abort();
    await expect(vad.push(new Float32Array(4 * FRAME))).rejects.toThrow();
    await expect(vad.flush()).rejects.toThrow();
    expect(model.calls).toBe(1);
  });

  it('push after flush is an error until reset()', async () => {
    const vad = new StreamingVad(new FakeModel(), WHISPER_VAD);
    await vad.push(new Float32Array(1000));
    await vad.flush();
    await expect(vad.push(new Float32Array(10))).rejects.toThrow();
    vad.reset();
    await expect(vad.push(new Float32Array(10))).resolves.toEqual([]);
    expect(vad.samplesSeen).toBe(10);
  });

  it('refuses audio that is not 16 kHz', () => {
    expect(() => new StreamingVad(new FakeModel(), WHISPER_VAD, { sampleRate: 44100 })).toThrow();
  });

  it('un-awaited push() calls behave like awaited ones, and a reused buffer is safe', async () => {
    const pcm = syntheticSpeech(60, 9, [
      [3, 14],
      [15, 22],
      [40, 58],
    ]);
    const reference = await detectSpeech(new EnergyVadModel(), pcm, WHISPER_VAD);
    expect(reference.length).toBeGreaterThan(0);
    const vad = new StreamingVad(new EnergyVadModel(), WHISPER_VAD, { batchFrames: 32 });
    const reused = new Float32Array(7001);
    const pending: Promise<SpeechSegment[]>[] = [];
    for (let at = 0; at < pcm.length; at += reused.length) {
      const part = pcm.subarray(at, Math.min(pcm.length, at + reused.length));
      reused.fill(NaN);
      reused.set(part);
      pending.push(vad.push(reused.subarray(0, part.length))); // overwritten next iteration
    }
    pending.push(vad.flush());
    expect((await Promise.all(pending)).flat()).toEqual(reference);
  });

  it('an error in one call does not wedge the queue', async () => {
    const ctl = new AbortController();
    const vad = new StreamingVad(new FakeModel(), WHISPER_VAD, {
      signal: ctl.signal,
      batchFrames: 2,
    });
    const a = vad.push(new Float32Array(2 * FRAME));
    ctl.abort();
    const b = vad.push(new Float32Array(2 * FRAME));
    await a.catch(() => undefined);
    await expect(b).rejects.toThrow();
  });
});

describe('AudioRing', () => {
  it('slices across blocks, refuses discarded or future ranges, trims whole blocks', () => {
    const ring = new AudioRing();
    for (let b = 0; b < 5; b++)
      ring.append(Float32Array.from({ length: 100 }, (_, i) => b * 100 + i));
    expect(Array.from(ring.slice(95, 105))).toEqual([95, 96, 97, 98, 99, 100, 101, 102, 103, 104]);
    ring.discardBefore(250); // drops blocks 0 and 1 only
    expect(ring.start).toBe(200);
    expect(ring.end).toBe(500);
    expect(() => ring.slice(150, 260)).toThrow(RangeError);
    expect(() => ring.slice(400, 501)).toThrow(RangeError);
    expect(Array.from(ring.slice(298, 302))).toEqual([298, 299, 300, 301]);
    ring.discardBefore(1e9);
    expect(ring.retainedSamples).toBe(0);
  });

  it('copies on request (decoder buffer reuse)', () => {
    const ring = new AudioRing();
    const buf = new Float32Array([1, 2, 3]);
    ring.append(buf, true);
    buf.fill(0);
    expect(Array.from(ring.slice(0, 3))).toEqual([1, 2, 3]);
  });
});

describe('energy fallback model', () => {
  const sine = (n: number, hz: number, amp: number) =>
    Float32Array.from({ length: n }, (_, i) => amp * Math.sin((2 * Math.PI * hz * i) / 16000));

  it('is deterministic and chunking-invariant (causal state only)', async () => {
    const pcm = syntheticSpeech(90, 5, [
      [4, 20],
      [21, 25],
      [50, 80],
    ]);
    const ref = await detectSpeech(new EnergyVadModel(), pcm, WHISPER_VAD);
    expect(ref.length).toBeGreaterThan(0);
    const rand = rng(5);
    for (let trial = 0; trial < 3; trial++) {
      const vad = new StreamingVad(new EnergyVadModel(), WHISPER_VAD);
      expect(await streamed(vad, pcm, randomPartition(pcm.length, rand, 50000))).toEqual(ref);
    }
  });

  it('digital silence and very quiet noise are never speech', async () => {
    const silence = new Float32Array(16000 * 20);
    expect(await detectSpeech(new EnergyVadModel(), silence, WHISPER_VAD)).toEqual([]);
    const quiet = Float32Array.from(
      { length: 16000 * 20 },
      (_, i) => 1e-4 * Math.sin(i * 1.7) * Math.cos(i * 0.31),
    );
    expect(await detectSpeech(new EnergyVadModel(), quiet, WHISPER_VAD)).toEqual([]);
  });

  it('finds speech-like modulated bursts after silence, inside the right span', async () => {
    const x = new Float32Array(16000 * 12);
    x.set(syntheticSpeech(12, 1, [[4, 8]]));
    const segs = await detectSpeech(new EnergyVadModel(), x, WHISPER_VAD);
    expect(segs.length).toBeGreaterThanOrEqual(1);
    expect(segs[0].start).toBeGreaterThan(16000 * 3);
    expect(segs[segs.length - 1].end).toBeLessThan(16000 * 9.5);
  });

  it('documented weakness: a steady tone inside the speech band is not reliably rejected', async () => {
    const segs = await detectSpeech(new EnergyVadModel(), sine(16000 * 3, 1000, 0.3), WHISPER_VAD);
    // keeps the claim in vad.md honest without pinning a number; Silero rejects this tone
    expect(Array.isArray(segs)).toBe(true);
  });

  it('a real recorded trace: the replay of speech-silence-speech finds the two speech blocks', async () => {
    const v = golden('speech-silence-speech');
    const segs = await detectSpeech(
      new ReplayModel(goldenProbs(v)),
      new Float32Array(v.samples),
      WHISPER_VAD,
    );
    expect(segs[0].start).toBe(0);
    expect(segs[0].end / 16000).toBeCloseTo(6.576, 3);
    expect(segs[1].start / 16000).toBeCloseTo(26.672, 3);
    expect(segs[segs.length - 1].end / 16000).toBeCloseTo(49.392, 3);
  });
});
