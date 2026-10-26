import { highpassCoefficients, lowpassCoefficients, magnitudeDb } from './biquad';
import { CleanupChain } from './cleanup';
import { mixToMono, monoWeights } from './downmix';
import { DynAudNorm, erf } from './dynaudnorm';
import {
  BIQUAD_GOLDEN,
  CLEANUP_GOLDEN,
  FILTERS_GOLDEN,
  RESAMPLER_GOLDEN,
  cleanupGoldenInputInt16,
  decodeGolden,
  goldenConcat as concat,
  goldenNoise as noise,
  goldenSine as sine,
  resamplerGoldenInput,
} from './golden-fixtures';
import { CleanupMode, Mono16kPipeline } from './pipeline';
import { StreamResampler, resampleAll } from './resampler';

// Port of the spike's test/node/dsp.test.ts. Where that file ran the ffmpeg binary, the expectations now come from
// golden-fixtures.ts (generated with the same ffmpeg 7.1 the Python engine uses).

/** 10 log10( sum ref^2 / sum (ref - test)^2 ) over [from, to). */
function snr(
  ref: Float32Array,
  test: Float32Array,
  from = 0,
  to = Math.min(ref.length, test.length),
) {
  let num = 0;
  let den = 0;
  for (let i = from; i < to; i++) {
    const d = ref[i] - test[i];
    num += ref[i] * ref[i];
    den += d * d;
  }
  return den === 0 ? Infinity : 10 * Math.log10(num / den);
}

function rms(x: Float32Array, from = 0, to = x.length): number {
  let s = 0;
  for (let i = from; i < to; i++) s += x[i] * x[i];
  return Math.sqrt(s / Math.max(1, to - from));
}

function runChain(x: Float32Array, rate: number, chunk: number, norm: boolean): Float32Array {
  const parts: Float32Array[] = [];
  const chain = new CleanupChain(
    rate,
    1,
    (planar, n) => parts.push(planar[0].slice(0, n)),
    norm ? {} : { norm: false },
  );
  for (let s = 0; s < x.length; s += chunk) {
    const n = Math.min(chunk, x.length - s);
    chain.push([x.subarray(s, s + n)], n);
  }
  chain.flush();
  return concat(parts);
}

function runNorm(x: Float32Array, rate = 16000, chunk = 1000): Float32Array {
  const parts: Float32Array[] = [];
  const norm = new DynAudNorm(rate, 1, { frameMs: 200, gaussSize: 11, peak: 0.9 }, (p, len) =>
    parts.push(p[0].slice(0, len)),
  );
  for (let s = 0; s < x.length; s += chunk) {
    norm.push([x.subarray(s, Math.min(x.length, s + chunk))], Math.min(chunk, x.length - s));
  }
  norm.flush();
  return concat(parts);
}

function runPipeline(
  planar: Float32Array[],
  rate: number,
  cleanup: CleanupMode,
  chunk = 4096,
): Float32Array {
  const parts: Float32Array[] = [];
  const p = new Mono16kPipeline(rate, planar.length, (c) => parts.push(c.slice()), {
    cleanup,
    downmix: 'ffmpeg',
  });
  const frames = planar[0].length;
  for (let s = 0; s < frames; s += chunk) {
    const n = Math.min(chunk, frames - s);
    p.push(
      planar.map((a) => a.subarray(s, s + n)),
      n,
    );
  }
  p.finish();
  return concat(parts);
}

describe('erf', () => {
  it('matches reference values to 1e-12', () => {
    const ref: [number, number][] = [
      [0.5, 0.5204998778130465],
      [1, 0.8427007929497149],
      [2, 0.9953222650189527],
      [3, 0.9999779095030014],
      [4, 0.9999999845827421],
      [5, 0.9999999999984626],
    ];
    for (const [x, e] of ref) expect(Math.abs(erf(x) - e)).toBeLessThan(1e-12);
    expect(erf(0)).toBe(0);
    expect(erf(100)).toBe(1);
    expect(Math.abs(erf(-1) + 0.8427007929497149)).toBeLessThan(1e-12);
  });
});

describe('biquad filters', () => {
  it.each([16000, 48000])('use the coefficients ffmpeg logs at %i Hz', (rate) => {
    const golden = BIQUAD_GOLDEN[rate];
    const hp = highpassCoefficients(70, rate);
    const lp = lowpassCoefficients(7800, rate);
    for (const k of ['b0', 'b1', 'b2', 'a1', 'a2'] as const) {
      expect(Math.abs(hp[k] - golden.highpass[k])).toBeLessThan(2e-6);
      expect(Math.abs(lp[k] - golden.lowpass[k])).toBeLessThan(2e-6);
    }
  });

  it('put the high-pass corner at -3 dB', () => {
    expect(Math.abs(magnitudeDb(highpassCoefficients(70, 16000), 70, 16000) + 3.01)).toBeLessThan(
      0.05,
    );
  });

  it('refuse a frequency above Nyquist', () => {
    expect(() => lowpassCoefficients(7800, 8000)).toThrow(RangeError);
  });
});

describe('StreamResampler', () => {
  it('produces ceil(n * 16000 / rate) samples for any input length, including tiny ones', () => {
    for (const rate of [8000, 11025, 22050, 24000, 32000, 44100, 44117, 48000, 96000]) {
      for (const n of [0, 1, 2, 7, 100, 1000, 12345]) {
        const out = resampleAll(noise(n, n + 1), rate, 16000);
        expect(out.length, `${rate} Hz, ${n} samples`).toBe(Math.ceil((n * 16000) / rate));
      }
    }
  });

  it('gives bit-identical output whatever the chunk size', () => {
    for (const rate of [8000, 44100, 48000, 44117]) {
      const x = concat([noise(rate, 3), sine(rate, rate, 440), noise(rate, 9, 0.05)]);
      const whole = resampleAll(x, rate, 16000);
      for (const chunk of [1, 7, 1000, 4096, 100000]) {
        const r = new StreamResampler({ inRate: rate, outRate: 16000 });
        const parts: Float32Array[] = [];
        for (let s = 0; s < x.length; s += chunk) {
          parts.push(r.process(x.subarray(s, Math.min(x.length, s + chunk))).slice());
        }
        parts.push(r.flush().slice());
        const got = concat(parts);
        expect(got.length, `${rate}/${chunk} length`).toBe(whole.length);
        let maxd = 0;
        for (let i = 0; i < got.length; i++) maxd = Math.max(maxd, Math.abs(got[i] - whole[i]));
        expect(maxd, `${rate}/${chunk}`).toBe(0);
      }
    }
  }, 60_000); // heavy: ~1.7 s under the full parallel suite (M6)

  it('keeps DC at gain 1, passes an in-band tone and rejects an out-of-band one', () => {
    const rate = 48000;
    const dc = resampleAll(new Float32Array(rate).fill(0.5), rate, 16000);
    expect(Math.abs(dc[8000] - 0.5)).toBeLessThan(1e-4);
    const inner = (x: Float32Array) => rms(x, 2000, x.length - 2000);
    const pass = resampleAll(sine(rate * 2, rate, 3000), rate, 16000);
    expect(Math.abs(inner(pass) * Math.SQRT2 - 0.5)).toBeLessThan(0.002);
    // 9 kHz would alias to 7 kHz
    const stop = resampleAll(sine(rate * 2, rate, 9000), rate, 16000);
    expect(20 * Math.log10((inner(stop) * Math.SQRT2) / 0.5)).toBeLessThan(-55);
  });

  it.each(RESAMPLER_GOLDEN.map((g) => [g.rate, g] as const))(
    'matches libswresample at %i Hz (same length, SNR >= 100 dB away from the edges)',
    (rate, golden) => {
      const ref = decodeGolden(golden.out);
      const mine = resampleAll(resamplerGoldenInput(rate, golden.seconds), rate, 16000);
      expect(mine.length).toBe(ref.length);
      // the first and last kernel half-lengths differ by design (zero history vs swr's padding)
      expect(snr(ref, mine, 400, ref.length - 400)).toBeGreaterThanOrEqual(100);
    },
  );
});

describe('DynAudNorm', () => {
  it('keeps the length for any input size', () => {
    for (const n of [0, 1, 5, 3199, 3200, 3201, 20000, 16000 * 5]) {
      expect(runNorm(noise(n, 4)).length, `length ${n}`).toBe(n);
    }
  });

  it('keeps digital silence silent', () => {
    expect(runNorm(new Float32Array(16000 * 4)).every((v) => v === 0)).toBe(true);
  });

  it('lifts a quiet tone to the 0.9 peak target, but never by more than 20 dB', () => {
    const peakOf = (x: Float32Array) =>
      x.subarray(16000 * 4, 16000 * 8).reduce((a, v) => Math.max(a, Math.abs(v)), 0);
    const lifted = peakOf(runNorm(sine(16000 * 12, 16000, 440, 0.2)));
    expect(lifted).toBeGreaterThan(0.85);
    expect(lifted).toBeLessThan(0.95);
    // gain is capped at 10x, so a 0.02 tone only reaches about 0.2
    const capped = peakOf(runNorm(sine(16000 * 12, 16000, 440, 0.02)));
    expect(capped).toBeGreaterThan(0.15);
    expect(capped).toBeLessThan(0.21);
  });

  it('gives bit-identical output whatever the chunk size', () => {
    const a = runNorm(noise(40000, 8), 16000, 1);
    const b = runNorm(noise(40000, 8), 16000, 99999);
    expect(a.length).toBe(b.length);
    let md = 0;
    for (let i = 0; i < a.length; i++) md = Math.max(md, Math.abs(a[i] - b[i]));
    expect(md).toBe(0);
  });

  it('rejects options it does not implement the range of', () => {
    const sink = () => undefined;
    expect(
      () => new DynAudNorm(16000, 1, { frameMs: 5, gaussSize: 11, peak: 0.9 }, sink),
    ).toThrow();
    expect(
      () => new DynAudNorm(16000, 1, { frameMs: 200, gaussSize: 1, peak: 0.9 }, sink),
    ).toThrow();
    expect(
      () => new DynAudNorm(16000, 1, { frameMs: 200, gaussSize: 11, peak: 2 }, sink),
    ).toThrow();
  });
});

describe('clean-up chain (highpass 70, lowpass 7800, dynaudnorm f=200:g=11:p=0.9)', () => {
  const asFloat = (int16: Float32Array) => Float32Array.from(int16, (v) => v / 32768);

  it('matches ffmpeg highpass + lowpass sample for sample', () => {
    const ref = decodeGolden(FILTERS_GOLDEN.out);
    const input = asFloat(cleanupGoldenInputInt16(FILTERS_GOLDEN.rate, FILTERS_GOLDEN.seconds));
    const mine = runChain(input, FILTERS_GOLDEN.rate, 333, false);
    expect(mine.length).toBe(ref.length);
    expect(snr(ref, mine)).toBeGreaterThanOrEqual(120);
  });

  it('matches the Python engine filter string on a 16 kHz source, including the normaliser delay', () => {
    const ref = decodeGolden(CLEANUP_GOLDEN.out);
    const input = asFloat(cleanupGoldenInputInt16(CLEANUP_GOLDEN.rate, CLEANUP_GOLDEN.seconds));
    const mine = runChain(input, CLEANUP_GOLDEN.rate, 1000, true);
    expect(mine.length).toBe(CLEANUP_GOLDEN.outputLength);
    const step = CLEANUP_GOLDEN.step;
    const sub = Float32Array.from(ref, (_, i) => mine[i * step]);
    // 800 samples (50 ms) at each end, as in the spike's own parity test
    const edge = 800 / step;
    expect(snr(ref, sub, edge, ref.length - edge)).toBeGreaterThanOrEqual(120);
  });

  it('bypasses the low-pass above Nyquist exactly like ffmpeg (8 kHz sources)', () => {
    const sink = () => undefined;
    expect(new CleanupChain(8000, 1, sink).active).toEqual({
      highpass: true,
      lowpass: false,
      norm: true,
    });
    expect(new CleanupChain(16000, 1, sink).active).toEqual({
      highpass: true,
      lowpass: true,
      norm: true,
    });
  });
});

describe('down-mix', () => {
  it('uses the ffmpeg matrix and the mean', () => {
    const s = Math.SQRT1_2;
    expect(Array.from(monoWeights(2, 'ffmpeg'))).toEqual([s, s]);
    expect(Array.from(monoWeights(2, 'mean'))).toEqual([0.5, 0.5]);
    expect(Array.from(monoWeights(6, 'ffmpeg'))).toEqual([s, s, 1, 0, 0.5, 0.5]);
    const m = monoWeights(6, 'mean');
    expect(Math.abs(m.reduce((a, v) => a + v, 0) - 1)).toBeLessThan(1e-12);
    // an unknown layout is an equal-weight mean in both modes
    expect(Array.from(monoWeights(9, 'ffmpeg'))).toEqual(new Array(9).fill(1 / 9));
    const out = new Float32Array(3);
    mixToMono(
      [new Float32Array([1, 0, 1]), new Float32Array([1, 1, 0])],
      monoWeights(2, 'ffmpeg'),
      3,
      out,
    );
    expect(Math.abs(out[0] - Math.SQRT2)).toBeLessThan(1e-6);
    expect(Math.abs(out[1] - s)).toBeLessThan(1e-6);
  });

  it('runs after the clean-up at the source rate: dual mono is the mono result times sqrt(2)', () => {
    // coupled dynaudnorm sees the same peak on both channels and the filters are linear, so ffmpeg's order gives
    // (x' + x') / sqrt(2) = sqrt(2) x'
    const rate = 48000;
    const x = concat([noise(rate, 13, 0.1), sine(rate, rate, 300, 0.3), noise(rate / 2, 17, 0.4)]);
    const mono = runPipeline([x], rate, 'native');
    const dual = runPipeline([x, x.slice()], rate, 'native');
    expect(dual.length).toBe(mono.length);
    const scaled = Float32Array.from(mono, (v) => v * Math.SQRT2);
    expect(snr(scaled, dual)).toBeGreaterThanOrEqual(120);
  });
});

describe('Mono16kPipeline', () => {
  it('outputs ceil(n * 16000 / rate) samples with and without clean-up', () => {
    for (const cleanup of ['native', 'post', false] as const) {
      for (const rate of [8000, 16000, 44100, 48000]) {
        const n = rate * 3 + 17;
        const out = runPipeline([noise(n, 1), noise(n, 2)], rate, cleanup);
        expect(out.length, `${cleanup}/${rate}`).toBe(Math.ceil((n * 16000) / rate));
      }
    }
  });

  it('reports which clean-up stages run', () => {
    const sink = () => undefined;
    expect(new Mono16kPipeline(8000, 1, sink).cleanupActive).toEqual({
      highpass: true,
      lowpass: false,
      norm: true,
    });
    expect(new Mono16kPipeline(48000, 2, sink, { cleanup: false }).cleanupActive).toBeNull();
  });
});
