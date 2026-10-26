import type { SpeechSegment } from '../vad/types';
import { speechChunks } from './pipeline';
import { StreamingTimeline, appendSpeechChunk } from './timeline';

const SR = 16000;

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

describe('appendSpeechChunk', () => {
  it('fuses the VAD segments exactly like speechChunks() does after the fact (1,000 random runs)', () => {
    const r = rng(5);
    for (let n = 0; n < 1000; n++) {
      const segs: SpeechSegment[] = [];
      let t = Math.floor(r() * SR);
      let prevLen = 0;
      for (let k = Math.floor(r() * 10); k > 0; k--) {
        const len = 1 + Math.floor(r() * 50 * SR);
        // gaps of 0 (touching), negative (overlapping, in start order as the VAD emits them) or positive
        const gap = r() < 0.2 ? 0 : r() < 0.2 ? -Math.floor(r() * Math.min(len, prevLen, SR)) : Math.floor(r() * 3 * SR);
        const start = Math.max(0, t + gap);
        segs.push({ start, end: start + len });
        t = start + len;
        prevLen = len;
      }
      const total = t + SR;
      const chunks: { start: number; end: number }[] = [];
      for (const s of segs) appendSpeechChunk(chunks, s, total);
      expect(chunks).toEqual(speechChunks(segs, total));
    }
  });

  it('returns only the new part of the speech', () => {
    const chunks: { start: number; end: number }[] = [];
    expect(appendSpeechChunk(chunks, { start: 10, end: 20 })).toEqual({ start: 10, end: 20 });
    expect(appendSpeechChunk(chunks, { start: 15, end: 30 })).toEqual({ start: 20, end: 30 });
    expect(appendSpeechChunk(chunks, { start: 12, end: 25 })).toBeNull();
    expect(appendSpeechChunk(chunks, { start: 40, end: 50 })).toEqual({ start: 40, end: 50 });
    expect(chunks).toEqual([
      { start: 10, end: 30 },
      { start: 40, end: 50 },
    ]);
  });
});

describe('StreamingTimeline', () => {
  const ramp = (from: number, n: number) => new Float32Array(n).map((_, i) => from + i);

  it('keeps only VAD-confirmed speech, back to back, and serves windows of it', async () => {
    const t = new StreamingTimeline(true);
    t.pushDecoded(ramp(0, 100));
    t.pushSpeech({ start: 10, end: 20 });
    t.trimRaw(20);
    t.pushDecoded(ramp(100, 100));
    t.pushSpeech({ start: 150, end: 160 });
    expect(t.samples).toBe(20);
    expect(Array.from(t.slice(8, 13))).toEqual([18, 19, 150, 151, 152]);
    expect(t.chunks).toEqual([
      { start: 10, end: 20 },
      { start: 150, end: 160 },
    ]);
  });

  it('VAD off: every decoded sample is speech', () => {
    const t = new StreamingTimeline(false);
    t.pushDecoded(ramp(0, 5));
    t.pushDecoded(ramp(5, 5));
    expect(t.chunks).toBeNull();
    expect(Array.from(t.slice(3, 7))).toEqual([3, 4, 5, 6]);
  });

  it('waitFor resolves once enough is known or decoding ended, and rejects when decoding failed', async () => {
    const t = new StreamingTimeline(false);
    let got = false;
    const w = t.waitFor(10).then(() => (got = true));
    t.pushDecoded(ramp(0, 5));
    await Promise.resolve();
    expect(got).toBe(false);
    t.pushDecoded(ramp(5, 5));
    await w;
    expect(got).toBe(true);
    const late = t.waitFor(1000);
    t.finish();
    await expect(late).resolves.toBeUndefined();
    const f = new StreamingTimeline(false);
    const p = f.waitFor(10);
    f.fail(new Error('broken file'));
    await expect(p).rejects.toThrow('broken file');
  });

  it('holds the decoder back while too much is buffered past the released point, and frees memory on release', async () => {
    const t = new StreamingTimeline(false, 10);
    t.pushDecoded(ramp(0, 8));
    await t.waitForSpace(); // 8 <= 10
    t.pushDecoded(ramp(8, 8));
    let free = false;
    const space = t.waitForSpace().then(() => (free = true));
    await Promise.resolve();
    expect(free).toBe(false);
    t.release(8);
    await space;
    expect(free).toBe(true);
    expect(t.buffered).toBe(8); // the first block is gone
    expect(() => t.slice(0, 4)).toThrow(RangeError);
    t.pushDecoded(ramp(16, 20));
    const stuck = t.waitForSpace();
    t.close(); // the seek loop is gone: never block the decoder again
    await expect(stuck).resolves.toBeUndefined();
  });

  it('a resumed run skips to its seek without keeping what lies before it', () => {
    const t = new StreamingTimeline(false);
    t.release(100);
    t.pushDecoded(ramp(0, 60));
    t.pushDecoded(ramp(60, 60));
    t.pushDecoded(ramp(120, 30));
    expect(t.samples).toBe(150);
    expect(t.buffered).toBe(90); // the block straddling 100 stays whole, the one before it is dropped
    expect(Array.from(t.slice(100, 103))).toEqual([100, 101, 102]);
  });
});
