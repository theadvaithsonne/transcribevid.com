import { PCM_SAMPLE_RATE, Pcm16Builder, int16ToFloat32 } from './pcm';

describe('Pcm16Builder', () => {
  it('rounds half away from zero, clips to int16 and turns NaN into 0', () => {
    const b = new Pcm16Builder({ pageSamples: 4 });
    b.append(new Float32Array([0, 0.5, -0.5, 1, -1, 1.5, -1.5, NaN, 0.00001, 1 / 32768]));
    expect(Array.from(b.finish())).toEqual([
      0, 16384, -16384, 32767, -32768, 32767, -32768, 0, 0, 1,
    ]);
    // 1.0 -> 32768 clips to 32767 as well
    expect(b.clippedSamples).toBe(3);
    expect(b.peakAbs).toBe(1.5);
    expect(b.scale).toBe(1 / 32768);
  });

  it('keeps +2 dBFS of a down-mixed signal with the headroom bit', () => {
    const h = new Pcm16Builder({ headroomBits: 1 });
    h.append(new Float32Array([1.27, -1.9, 0.1]));
    const out = h.finish();
    expect(h.scale).toBe(1 / 16384);
    expect(Math.abs(out[0] * h.scale - 1.27)).toBeLessThan(1e-4);
    expect(Math.abs(out[1] * h.scale + 1.9)).toBeLessThan(1e-4);
    expect(h.clippedSamples).toBe(0);
  });

  it('switches to pages when the duration estimate was too low, and returns one contiguous array', () => {
    const big = new Pcm16Builder({ expectedSamples: 10, pageSamples: 8 });
    // the first buffer is the estimate + 1 s, so go past that
    const n = 10 + PCM_SAMPLE_RATE + 100;
    big.append(new Float32Array(n).fill(0.25));
    big.append(new Float32Array(5).fill(-0.25), 3);
    const out = big.finish();
    expect(out.length).toBe(n + 3);
    expect(big.length).toBe(n + 3);
    expect(out[0]).toBe(8192);
    expect(out[n - 1]).toBe(8192);
    expect(out[n + 2]).toBe(-8192);
  });

  it('returns a view without copying when the first buffer was big enough', () => {
    const b = new Pcm16Builder({ expectedSamples: 100 });
    b.append(new Float32Array(50).fill(0.5));
    const out = b.finish();
    expect(out.length).toBe(50);
    expect(out.buffer.byteLength).toBe((100 + PCM_SAMPLE_RATE) * 2);
  });
});

describe('int16ToFloat32', () => {
  const pcm = Int16Array.from([0, 16384, -16384, 32767, -32768, 100]);

  it('converts with the scale the result carries', () => {
    expect(Array.from(int16ToFloat32(pcm, 1 / 32768))).toEqual([
      0,
      0.5,
      -0.5,
      32767 / 32768,
      -1,
      100 / 32768,
    ]);
    expect(int16ToFloat32(pcm, 1 / 16384)[1]).toBe(1);
  });

  it('cuts a window and clamps it to the array', () => {
    expect(Array.from(int16ToFloat32(pcm, 1 / 32768, 1, 3))).toEqual([0.5, -0.5]);
    expect(Array.from(int16ToFloat32(pcm, 1 / 32768, 4, 100))).toEqual([-1, 100 / 32768]);
    expect(int16ToFloat32(pcm, 1 / 32768, 10, 20).length).toBe(0);
    expect(int16ToFloat32(pcm, 1 / 32768, -5, 1).length).toBe(1);
  });

  it('reuses a large enough output buffer', () => {
    const out = new Float32Array(10);
    const r = int16ToFloat32(pcm, 1 / 32768, 0, 2, out);
    expect(r.buffer).toBe(out.buffer);
    expect(Array.from(r)).toEqual([0, 0.5]);
  });

  it('round-trips the packing to within half a step', () => {
    const b = new Pcm16Builder();
    const x = Float32Array.from({ length: 1000 }, (_, i) => Math.sin(i / 7) * 0.8);
    b.append(x);
    const back = int16ToFloat32(b.finish(), b.scale);
    let md = 0;
    for (let i = 0; i < x.length; i++) md = Math.max(md, Math.abs(back[i] - x[i]));
    expect(md).toBeLessThanOrEqual(0.5 / 32768 + 1e-9);
  });
});
