/**
 * Spec helpers: the Python goldens decoded, the parameter sets they were made with, a seeded PRNG and a
 * tiny property-test runner (fast-check is not a dependency of the app).
 */
import {
  FASTER_WHISPER_DEFAULTS,
  QWEN_VAD,
  SpeechSegment,
  VadParams,
  WHISPER_VAD,
  WHISPER_VAD_30S,
} from '../types';
import { GOLDEN, GoldenVariant } from './golden';

export const SR = 16000;

/** Python config name (ref_vad.py) -> the TypeScript parameters that must reproduce it. */
export const CONFIGS: Record<string, VadParams> = {
  whisper: WHISPER_VAD,
  whisper_max30: WHISPER_VAD_30S,
  qwen: QWEN_VAD,
  defaults: FASTER_WHISPER_DEFAULTS,
  variant: {
    threshold: 0.6,
    negThreshold: 0.4,
    minSpeechDurationMs: 250,
    minSilenceDurationMs: 300,
    speechPadMs: 200,
    maxSpeechDurationS: 20,
  },
};

export const toSegs = (a: readonly (readonly [number, number])[]): SpeechSegment[] =>
  a.map(([start, end]) => ({ start, end }));

export const tagOf = (v: GoldenVariant): string => v.name + (v.enh ? ' (enh)' : '');

const probsCache = new Map<string, Float32Array>();

/** The float32 probability trace of a golden variant (decoded once). */
export function goldenProbs(v: GoldenVariant): Float32Array {
  const key = tagOf(v);
  let p = probsCache.get(key);
  if (!p) {
    const bin = atob(v.probs);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    p = new Float32Array(bytes.buffer);
    if (p.length !== v.frames)
      throw new Error(`${key}: ${p.length} probabilities for ${v.frames} frames`);
    probsCache.set(key, p);
  }
  return p;
}

export function golden(name: string, enh = false): GoldenVariant {
  const v = GOLDEN.find((g) => g.name === name && g.enh === enh);
  if (!v) throw new Error(`no golden for ${name} enh=${enh}`);
  return v;
}

/** deterministic PRNG (mulberry32), values in [0, 1) */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** integer in [min, max] */
export const randInt = (rand: () => number, min: number, max: number): number =>
  min + Math.floor(rand() * (max - min + 1));

export const pick = <T>(rand: () => number, items: readonly T[]): T =>
  items[Math.floor(rand() * items.length)];

/** split [0, n) into random consecutive chunk lengths (some zero) */
export function randomPartition(n: number, rand: () => number, maxLen = 40000): number[] {
  const parts: number[] = [];
  let left = n;
  while (left > 0) {
    const r = rand();
    const len =
      r < 0.1
        ? 0
        : r < 0.3
          ? Math.min(left, 1 + Math.floor(rand() * 600))
          : Math.min(left, 1 + Math.floor(rand() * maxLen));
    parts.push(len);
    left -= len;
  }
  return parts;
}

/**
 * Minimal property runner: `numRuns` random cases from `gen(rand)`, `check` throws (expect) on failure. The
 * failing case is reported with its run index and seed so it can be replayed.
 */
export function forAll<T>(
  opts: { numRuns: number; seed: number },
  gen: (rand: () => number) => T,
  check: (value: T) => void,
): void {
  const rand = rng(opts.seed);
  for (let run = 0; run < opts.numRuns; run++) {
    const value = gen(rand);
    try {
      check(value);
    } catch (e) {
      const shown = JSON.stringify(value, (_k, v) =>
        v instanceof Float32Array ? Array.from(v) : v === Infinity ? 'Infinity' : v,
      );
      throw new Error(
        `property failed at run ${run} (seed ${opts.seed}): ${(e as Error).message}\ncase: ${shown.slice(0, 4000)}`,
      );
    }
  }
}

/** Synthetic 16 kHz test audio: speech-like modulated harmonic bursts over a low noise floor. */
export function syntheticSpeech(
  seconds: number,
  seed: number,
  bursts: [number, number][],
): Float32Array {
  const n = Math.round(seconds * SR);
  const rand = rng(seed);
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = 2e-4 * (rand() - 0.5);
  for (const [a, b] of bursts) {
    for (let i = Math.round(a * SR); i < Math.min(n, Math.round(b * SR)); i++) {
      const t = i / SR;
      const env = Math.max(0, Math.sin(2 * Math.PI * 3.7 * t)) ** 2;
      let v = 0;
      for (let h = 1; h <= 12; h++) v += Math.sin(2 * Math.PI * 140 * h * t) / h;
      x[i] += 0.25 * env * v;
    }
  }
  return x;
}
