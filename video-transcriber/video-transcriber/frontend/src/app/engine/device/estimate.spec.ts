import { estimateTime, formatDuration, formatEstimate } from './estimate';
import { MODEL_DATA } from './model-data';
import { DeviceFacts } from './plan';

const gpu: DeviceFacts = { platform: 'desktop', webgpu: true, shaderF16: true, deviceMemory: 8 };
const wasm: DeviceFacts = { platform: 'desktop', webgpu: false, shaderF16: false, deviceMemory: 8 };
const phone: DeviceFacts = { platform: 'phone', webgpu: true, shaderF16: true, deviceMemory: 4 };
const weakPhone: DeviceFacts = { platform: 'phone', webgpu: false, shaderF16: false, deviceMemory: 2 };

describe('estimateTime (measured RTF table of model-matrix.md)', () => {
  // [model, device, seconds of audio, expected seconds, expected text]
  const cases: [string, DeviceFacts, number, number, string][] = [
    ['tiny', gpu, 600, 132, 'about 2 min (estimate)'], // RTF 0.22
    ['tiny', wasm, 600, 198, 'about 3 min (estimate)'], // RTF 0.33
    ['base', gpu, 600, 174, 'about 3 min (estimate)'], // RTF 0.29
    ['base', wasm, 600, 312, 'about 5 min (estimate)'], // RTF 0.52
    ['small', gpu, 600, 426, 'about 7 min (estimate)'], // RTF 0.71
    ['small', wasm, 600, 894, 'about 15 min (estimate)'], // RTF 1.49
    ['medium', gpu, 600, 1080, 'about 18 min (estimate)'], // RTF 1.8: "a 10-minute file takes 14-18 minutes"
    ['large-v3-turbo', gpu, 600, 816, 'about 14 min (estimate)'], // RTF 1.36
    ['large-v3', gpu, 600, 1062, 'about 18 min (estimate)'], // RTF 1.77
    ['distil-large-v3', gpu, 600, 492, 'about 8 min (estimate)'], // RTF 0.82
    ['distil-large-v3', wasm, 600, 2718, 'about 45 min (estimate)'], // RTF 4.53: "would take 45 minutes"
    ['qwen3-asr-0.6b', gpu, 600, 492, 'about 8 min (estimate)'], // RTF 0.82
    ['qwen3-asr-1.7b', gpu, 600, 852, 'about 14 min (estimate)'], // RTF 1.42
  ];
  for (const [model, device, duration, seconds, text] of cases) {
    it(`${model} on ${device.webgpu ? 'WebGPU' : 'WASM'}: ${duration} s of audio -> ${seconds} s`, () => {
      const e = estimateTime(duration, model, device);
      expect(e.seconds).toBe(seconds);
      expect(e.text).toBe(text);
      expect(e.label).toBe('estimate');
      expect(e.sources.length).toBeGreaterThan(0);
    });
  }

  it('marks desktop numbers as measured and the big WASM sizes as arithmetic', () => {
    expect(estimateTime(60, 'small', gpu).basis).toBe('measured');
    expect(estimateTime(60, 'medium', wasm).basis).toBe('arithmetic');
    expect(estimateTime(60, 'medium', wasm).rtf).toBe(6);
  });

  it('multiplies by the phone factor (3x) and calls it arithmetic', () => {
    const e = estimateTime(600, 'base', phone);
    expect(e.rtf).toBeCloseTo(0.87, 6);
    expect(e.seconds).toBe(522);
    expect(e.basis).toBe('arithmetic');
    expect(e.sources.some((s) => s.includes('times 2-4'))).toBe(true);
  });

  it('warns when a model is slower than real time, never refuses', () => {
    const e = estimateTime(600, 'medium', gpu);
    expect(e.seconds).not.toBeNull();
    expect(e.warnings.map((w) => w.code)).toEqual(['slower-than-real-time']);
    expect(e.warnings[0].message).toContain('about 18 min for 10 min of audio (estimate)');
    expect(estimateTime(600, 'small', gpu).warnings).toEqual([]);
  });

  it('warns about a long wait above 20 minutes when the model is faster than real time', () => {
    const e = estimateTime(3600, 'tiny', weakPhone); // 0.33 x 3 = 0.99
    expect(e.seconds).toBe(3564);
    expect(e.warnings.map((w) => w.code)).toEqual(['long-wait']);
    expect(e.warnings[0].message).toContain('about 59 min');
  });

  it('adds the memory warning for files over an hour on a device with <= 4 GB', () => {
    const e = estimateTime(7200, 'tiny', weakPhone);
    expect(e.warnings.map((w) => w.code)).toEqual(['long-wait', 'low-memory']);
    expect(estimateTime(7200, 'tiny', gpu).warnings.map((w) => w.code)).toEqual(['long-wait']);
    // unknown memory is not treated as low memory
    expect(
      estimateTime(7200, 'tiny', { ...wasm, deviceMemory: null }).warnings.map((w) => w.code),
    ).toEqual(['long-wait']);
  });

  it('has no estimate for an unknown model or a model never measured on this backend', () => {
    expect(estimateTime(60, 'nope', gpu).seconds).toBeNull();
    expect(estimateTime(60, 'nope', gpu).text).toBe('no estimate for this model here');
    expect(estimateTime(60, 'qwen3-asr-0.6b', wasm).seconds).toBeNull();
  });

  it('keeps every RTF in one data file with its source', () => {
    for (const m of MODEL_DATA)
      for (const r of Object.values(m.rtf)) {
        expect(r!.value).toBeGreaterThan(0);
        expect(r!.source).toMatch(/^\[(matrix|qwen|arith)\]/);
      }
  });

  it('treats a negative or non-finite duration as zero', () => {
    expect(estimateTime(-5, 'tiny', gpu).seconds).toBe(0);
    expect(estimateTime(NaN, 'tiny', gpu).seconds).toBe(0);
  });
});

describe('formatDuration / formatEstimate', () => {
  it('rounds to minutes and shows hours from 60 minutes', () => {
    expect(formatDuration(20)).toBe('under a minute');
    expect(formatDuration(90)).toBe('about 2 min');
    expect(formatDuration(3600)).toBe('about 1 h');
    expect(formatDuration(5400)).toBe('about 1 h 30 min');
    expect(formatEstimate(null)).toBe('no estimate for this model here');
    expect(formatEstimate(426)).toBe('about 7 min (estimate)');
  });
});
