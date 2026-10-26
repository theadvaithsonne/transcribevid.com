/**
 * Every number the device policy uses, in one place, each with its source. Nothing here is measured at run
 * time; the policy (plan.ts) and the time estimate (estimate.ts) only look things up.
 *
 * Sources (all under docs/in-browser/spike/ unless stated):
 *   [catalog] model-catalog.json, generated 2026-10-25: download size in MB (1 MB = 1e6 bytes) of
 *             encoder_model + decoder_model_merged for each dtype mix.
 *   [matrix]  model-matrix.md section 2 and 3: real-time factor (RTF = wall seconds / audio seconds, lower is
 *             faster) of the reference engine on passage-a (73 s), greedy, word timestamps on; peak working set
 *             of all Chrome processes; the "Min RAM" assumption (peak + ~1 GB for the OS). Measured in headless
 *             Chrome 155 on a Ryzen 7 7730U with a Radeon RDNA-2 iGPU (shader-f16), 15 GB RAM, one WASM thread.
 *   [qwen]    qwen.md sections 1, 3.2 and 3.3: Qwen3-ASR download sizes (q4f16 needs shader-f16, q4 does not)
 *             and English RTF with the fused decoder (0.6B: full run 0.82; 1.7B: 1.42, measured under CPU load).
 *   [arith]   arithmetic from the matrix (model-matrix.md sections 5 and 6), not a measurement.
 */

export type ModelEngine = 'whisper' | 'qwen';
export type Backend = 'webgpu' | 'wasm';

/** The dtype mixes the plan can pick. Names follow model-catalog.json `howToRead.mixes` (+ q4f16 / q4). */
export type MixName = 'wasmQ8' | 'webgpuF16' | 'webgpuNoShaderF16' | 'webgpuQ4F16' | 'webgpuQ4';

export interface ModelMix {
  device: Backend;
  dtype: { encoder: string; decoder: string };
  /** download of the model files in MB (1e6 bytes); tokenizer / config (~3 MB) and the ORT runtime are extra */
  downloadMB: number;
  /** true when the mix needs the WebGPU `shader-f16` feature */
  needsShaderF16: boolean;
  source: string;
}

export interface Rtf {
  value: number;
  /** false = arithmetic, flagged as such in the estimate */
  measured: boolean;
  source: string;
}

export interface ModelData {
  id: string;
  label: string;
  engine: ModelEngine;
  /** the Transformers.js repo (or the Hub repo for Qwen) the download comes from */
  repo: string;
  /** false when no export carries cross-attentions (large-v3, distil-large-v3): no per-word timing */
  wordTimestamps: boolean;
  mixes: Partial<Record<MixName, ModelMix>>;
  rtf: Partial<Record<Backend, Rtf>>;
  /** peak working set of all browser processes in MB, from the matrix; informational */
  peakTotalMB: Partial<Record<Backend, number>>;
  /** the matrix's "Min RAM" column in GB (an assumption, see [matrix]) */
  minRamGB: Partial<Record<Backend, number>>;
}

export type ModelCatalog = readonly ModelData[];

const wasmQ8 = (downloadMB: number, source = '[catalog] mixes.wasmDefault'): ModelMix => ({
  device: 'wasm',
  dtype: { encoder: 'q8', decoder: 'q8' },
  downloadMB,
  needsShaderF16: false,
  source,
});
const webgpuF16 = (downloadMB: number): ModelMix => ({
  device: 'webgpu',
  dtype: { encoder: 'fp16', decoder: 'fp16' },
  downloadMB,
  needsShaderF16: true,
  source: '[catalog] mixes.webgpuF16',
});
const webgpuNoShaderF16 = (downloadMB: number): ModelMix => ({
  device: 'webgpu',
  dtype: { encoder: 'fp32', decoder: 'q4' },
  downloadMB,
  needsShaderF16: false,
  source: '[catalog] mixes.webgpuNoShaderF16',
});
const webgpuQ4F16 = (downloadMB: number, source: string): ModelMix => ({
  device: 'webgpu',
  dtype: { encoder: 'q4f16', decoder: 'q4f16' },
  downloadMB,
  needsShaderF16: true,
  source,
});
const measured = (value: number, source: string): Rtf => ({ value, measured: true, source });
const arithmetic = (value: number, source: string): Rtf => ({ value, measured: false, source });

/** Whisper sizes a phone has no business running on one WASM thread: the matrix's arithmetic says 4-10x real time. */
const BIG_MODEL_WASM_RTF = arithmetic(
  6,
  '[arith] model-matrix.md section 6 item 4: the shared 32-layer encoder took 91 s per window on one WASM thread (distil-large-v3 q8, RTF 4.5); medium / turbo / large-v3 q8 are a 4-10x proposition, 6 taken',
);

export const MODEL_DATA: ModelCatalog = [
  {
    id: 'tiny',
    label: 'Tiny',
    engine: 'whisper',
    repo: 'onnx-community/whisper-tiny_timestamped',
    wordTimestamps: true,
    mixes: {
      wasmQ8: wasmQ8(40.8),
      webgpuF16: webgpuF16(76.1),
      webgpuNoShaderF16: webgpuNoShaderF16(119.7),
    },
    rtf: {
      wasm: measured(0.33, '[matrix] 2: tiny RTF-a wasm (quiet pair with webgpu)'),
      webgpu: measured(0.22, '[matrix] 2: tiny RTF-a gpu fp16'),
    },
    peakTotalMB: { wasm: 1224, webgpu: 2065 },
    minRamGB: { wasm: 2, webgpu: 2 },
  },
  {
    id: 'base',
    label: 'Base',
    engine: 'whisper',
    repo: 'onnx-community/whisper-base_timestamped',
    wordTimestamps: true,
    mixes: {
      wasmQ8: wasmQ8(76.9),
      webgpuF16: webgpuF16(146.0),
      webgpuNoShaderF16: webgpuNoShaderF16(206.2),
    },
    rtf: {
      wasm: measured(0.52, '[matrix] 2: base RTF-a wasm'),
      webgpu: measured(0.29, '[matrix] 2: base RTF-a gpu fp16'),
    },
    peakTotalMB: { wasm: 1367, webgpu: 2504 },
    minRamGB: { wasm: 3, webgpu: 3 },
  },
  {
    id: 'small',
    label: 'Small',
    engine: 'whisper',
    repo: 'onnx-community/whisper-small_timestamped',
    wordTimestamps: true,
    mixes: {
      wasmQ8: wasmQ8(249.0),
      webgpuF16: webgpuF16(485.0),
      webgpuNoShaderF16: webgpuNoShaderF16(586.2),
    },
    rtf: {
      wasm: measured(1.49, '[matrix] 2: small RTF-a wasm, one thread'),
      webgpu: measured(0.71, '[matrix] 2: small RTF-a gpu fp16 (0.81 on the 5-minute file)'),
    },
    peakTotalMB: { wasm: 2210, webgpu: 5827 },
    minRamGB: { wasm: 4, webgpu: 8 },
  },
  {
    id: 'medium',
    label: 'Medium',
    engine: 'whisper',
    repo: 'onnx-community/whisper-medium_timestamped',
    wordTimestamps: true,
    mixes: {
      wasmQ8: wasmQ8(985.7),
      webgpuQ4F16: webgpuQ4F16(516.9, '[matrix] 3.4: encoder q4f16 180.6 + decoder q4f16 336.3 MB'),
    },
    rtf: {
      wasm: BIG_MODEL_WASM_RTF,
      webgpu: measured(1.8, '[matrix] 3.4: medium passage-a RTF 1.8 (webgpu q4f16, other lanes active)'),
    },
    peakTotalMB: { webgpu: 5337 },
    minRamGB: { webgpu: 8 },
  },
  {
    id: 'large-v3-turbo',
    label: 'Large v3 Turbo',
    engine: 'whisper',
    repo: 'onnx-community/whisper-large-v3-turbo_timestamped',
    wordTimestamps: true,
    mixes: {
      wasmQ8: wasmQ8(1084.9),
      webgpuQ4F16: webgpuQ4F16(563.6, '[matrix] 3.5: encoder q4f16 370.0 + decoder q4f16 193.6 MB'),
    },
    rtf: {
      wasm: BIG_MODEL_WASM_RTF,
      webgpu: measured(1.36, '[matrix] 3.5: large-v3-turbo passage-a RTF 1.36 (webgpu q4f16)'),
    },
    peakTotalMB: { webgpu: 5057 },
    minRamGB: { webgpu: 8 },
  },
  {
    id: 'large-v3',
    label: 'Large v3',
    engine: 'whisper',
    repo: 'onnx-community/whisper-large-v3-ONNX',
    wordTimestamps: false,
    mixes: {
      wasmQ8: wasmQ8(1821.9),
      webgpuQ4F16: webgpuQ4F16(979.5, '[matrix] 3.6: encoder q4f16 369.9 + decoder q4f16 609.6 MB'),
    },
    rtf: {
      wasm: BIG_MODEL_WASM_RTF,
      webgpu: measured(1.77, '[matrix] 3.6: large-v3 passage-a RTF 1.77 (webgpu q4f16)'),
    },
    peakTotalMB: { webgpu: 7697 },
    minRamGB: { webgpu: 16 },
  },
  {
    id: 'distil-large-v3',
    label: 'Distil Large v3',
    engine: 'whisper',
    repo: 'distil-whisper/distil-large-v3.5-ONNX (WebGPU) / distil-whisper/distil-large-v3 (WASM)',
    wordTimestamps: false,
    mixes: {
      wasmQ8: wasmQ8(766.8, '[catalog] mixes.wasmDefault of distil-whisper/distil-large-v3 (the exact repo, q8)'),
      webgpuQ4F16: webgpuQ4F16(
        533.6,
        '[matrix] 3.7: distil-large-v3.5-ONNX q4f16, encoder 369.9 + decoder 163.7 MB (the exact v3 repo has no WebGPU-friendly export)',
      ),
    },
    rtf: {
      wasm: measured(4.53, '[matrix] 3.7: distil-large-v3 q8 on one WASM thread, passage-b RTF 4.53'),
      webgpu: measured(0.82, '[matrix] 3.7: distil-large-v3.5 q4f16 passage-a RTF 0.82'),
    },
    peakTotalMB: { wasm: 3917, webgpu: 4507 },
    minRamGB: { wasm: 8, webgpu: 8 },
  },
  {
    id: 'qwen3-asr-0.6b',
    label: 'Qwen3-ASR 0.6B',
    engine: 'qwen',
    repo: 'jiangzhuo9357/Qwen3-ASR-0.6B-ONNX + sorryhyun/qwen3-asr-onnx-gqa (fused decoder)',
    wordTimestamps: false,
    mixes: {
      webgpuQ4F16: {
        device: 'webgpu',
        dtype: { encoder: 'fp16', decoder: 'q4f16' },
        downloadMB: 890,
        needsShaderF16: true,
        source: '[qwen] 1: 0.6B q4f16 0.89 GB (needs shader-f16)',
      },
      webgpuQ4: {
        device: 'webgpu',
        dtype: { encoder: 'fp32', decoder: 'q4' },
        downloadMB: 1300,
        needsShaderF16: false,
        source: '[qwen] 1: 0.6B q4 1.30 GB (any WebGPU adapter)',
      },
    },
    rtf: {
      webgpu: measured(0.82, '[qwen] 3.2: 0.6B fused decoder, English, full run of 517 s audio: RTF 0.82'),
    },
    peakTotalMB: {},
    minRamGB: { webgpu: 8 },
  },
  {
    id: 'qwen3-asr-1.7b',
    label: 'Qwen3-ASR 1.7B',
    engine: 'qwen',
    repo: 'jiangzhuo9357/Qwen3-ASR-1.7B-ONNX + sorryhyun/qwen3-asr-onnx-gqa (fused decoder)',
    wordTimestamps: false,
    mixes: {
      webgpuQ4F16: {
        device: 'webgpu',
        dtype: { encoder: 'fp16', decoder: 'q4f16' },
        downloadMB: 1960,
        needsShaderF16: true,
        source: '[qwen] 1: 1.7B q4f16 1.96 GB',
      },
      webgpuQ4: {
        device: 'webgpu',
        dtype: { encoder: 'fp32', decoder: 'q4' },
        downloadMB: 2700,
        needsShaderF16: false,
        source: '[qwen] 1: 1.7B q4 2.70 GB',
      },
    },
    rtf: {
      webgpu: measured(1.42, '[qwen] 3.3: 1.7B fused decoder, English RTF 1.42 (CPU 91-99 % busy)'),
    },
    peakTotalMB: {},
    minRamGB: { webgpu: 16 },
  },
];

/**
 * Phones and tablets were not measured ([matrix] section 5). The weak-device emulation (section 4) says a desktop
 * core slice is still 2-4x a budget phone core on scalar JS / WASM, so estimates on a phone or tablet use the
 * desktop RTF times this factor and are flagged as arithmetic.
 */
export const MOBILE_SLOWDOWN = {
  factor: 3,
  source: '[arith] model-matrix.md section 4: "the phone-side expectation is the WASM numbers above times 2-4"',
};

/** The ORT runtime every first visit also downloads, MB ([matrix] section 1 "Bytes"). */
export const ORT_RUNTIME_MB = 26.9;

export function findModel(catalog: ModelCatalog, id: string): ModelData | undefined {
  return catalog.find((m) => m.id === id);
}

/** "485 MB" below 1 GB, "1.96 GB" from there (the real download sizes, as ARCHITECTURE section 5 asks). */
export function sizeText(downloadMB: number): string {
  if (downloadMB < 1000) return `${Math.round(downloadMB)} MB`;
  return `${parseFloat((downloadMB / 1000).toFixed(2))} GB`;
}
