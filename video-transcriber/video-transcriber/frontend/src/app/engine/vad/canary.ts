/**
 * Self-test ("canary") for a FrameModel: a deterministic 1.5 s synthetic voiced signal with known Silero v6.0
 * probabilities. It catches a wrong execution provider (the WebGPU EP of onnxruntime-web 1.31-dev returns
 * garbage for Silero: max probability error 0.82 on real speech, 0.67 on this canary), a wrong model file
 * (the current Silero v6.2 weights fail it too) or a broken ORT build. Call it once after creating the model;
 * if it fails, do not use the model (fall back to EnergyVadModel).
 */
import { FRAME, FrameModel, SAMPLE_RATE } from './types';

export const CANARY_FRAMES = 48;

/** Deterministic 1.5 s synthetic "voiced" signal (formant-filtered harmonics, 3 syllables/s, silent edges). */
export function canarySignal(): Float32Array {
  const n = CANARY_FRAMES * FRAME;
  const f0 = new Float64Array(n);
  const phase = new Float64Array(n);
  let acc = 0;
  let sumF0 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    f0[i] = 110 + 30 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / (n / SAMPLE_RATE)));
    acc += f0[i];
    phase[i] = (2 * Math.PI * acc) / SAMPLE_RATE;
    sumF0 += f0[i];
  }
  const meanF0 = sumF0 / n;
  const gains: number[] = [];
  for (let h = 1; h < 30; h++) {
    const fh = meanF0 * h;
    gains.push(
      Math.exp(-(((fh - 700) / 250) ** 2)) +
        0.7 * Math.exp(-(((fh - 1300) / 300) ** 2)) +
        0.25 * Math.exp(-(((fh - 2600) / 500) ** 2)),
    );
  }
  const x = new Float64Array(n);
  let peak = 0;
  for (let i = 0; i < n; i++) {
    let v = 0;
    for (let h = 1; h < 30; h++) v += (gains[h - 1] * Math.sin(h * phase[i])) / h ** 0.3;
    x[i] = v;
    peak = Math.max(peak, Math.abs(v));
  }
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const syll = Math.max(Math.sin(2 * Math.PI * 3.2 * t - 0.5), 0) ** 0.6;
    const gate = t > 0.12 && t < 1.5 ? 1 : 0;
    out[i] = (x[i] / peak) * 0.5 * syll * gate;
  }
  return out;
}

/** Expected probabilities of canarySignal() for faster-whisper's silero_vad_v6.onnx (Silero v6.0 weights). */
export const CANARY_EXPECTED_V60: readonly number[] = [
  0.0238, 0.0116, 0.0068, 0.0301, 0.0791, 0.1034, 0.0903, 0.1163, 0.0747, 0.0548, 0.186, 0.4513,
  0.5824, 0.5799, 0.5672, 0.535, 0.6946, 0.3229, 0.1609, 0.0934, 0.3317, 0.3155, 0.3459, 0.3042,
  0.2848, 0.0678, 0.043, 0.0488, 0.0286, 0.0175, 0.1193, 0.0976, 0.0774, 0.0468, 0.0448, 0.0278,
  0.0565, 0.0271, 0.0169, 0.021, 0.0318, 0.024, 0.013, 0.0089, 0.0072, 0.0109, 0.0195, 0.0115,
];

/** ... and for the official v6.2 `silero_vad_16k_sequence.onnx` (what a future weights upgrade would use). */
export const CANARY_EXPECTED_V62: readonly number[] = [
  0.0017, 0.0069, 0.0089, 0.0398, 0.3866, 0.3688, 0.4006, 0.2765, 0.0823, 0.027, 0.1712, 0.7209,
  0.5851, 0.3539, 0.2327, 0.3296, 0.1937, 0.1108, 0.0411, 0.0183, 0.2332, 0.1538, 0.2167, 0.2595,
  0.1631, 0.0369, 0.0438, 0.0202, 0.011, 0.0083, 0.4457, 0.2498, 0.1771, 0.0961, 0.2019, 0.0726,
  0.0526, 0.0459, 0.0267, 0.0986, 0.09, 0.0518, 0.0338, 0.0277, 0.042, 0.0346, 0.0235, 0.0192,
];

export interface SelfTestResult {
  ok: boolean;
  maxDiff: number;
}

/**
 * Run the canary through `model` and compare. The model state is reset before and after.
 * Measured: max error 4.8e-5 on WASM, 0.67 on the WebGPU provider in Chrome, 0.2+ for the v6.2 weights.
 */
export async function selfTest(
  model: FrameModel,
  expected: readonly number[] = CANARY_EXPECTED_V60,
  tolerance = 0.02,
): Promise<SelfTestResult> {
  model.reset();
  const probs = await model.predict(canarySignal(), CANARY_FRAMES);
  model.reset();
  let maxDiff = 0;
  for (let i = 0; i < CANARY_FRAMES; i++) {
    maxDiff = Math.max(maxDiff, Math.abs(probs[i] - expected[i]));
  }
  return { ok: Number.isFinite(maxDiff) && maxDiff <= tolerance, maxDiff };
}
