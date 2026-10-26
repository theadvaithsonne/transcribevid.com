/**
 * The Whisper models the browser edition offers, derived from docs/in-browser/spike/model-catalog.json
 * (sizes from the Hugging Face API, measured status and minimum RAM from spike/model-matrix.md).
 * Sizes are bytes of the two ONNX files (1 MB = 1e6 bytes, as in the catalog); the tokenizer and config
 * files add about 2.5-4 MB and the ORT runtime is counted separately (ort-config.ts).
 */
import { Device } from '../asr/types';

export type ModelId =
  'tiny' | 'base' | 'small' | 'medium' | 'large-v3-turbo' | 'large-v3' | 'distil-large-v3';

/** Which download a device gets: WASM, WebGPU with `shader-f16`, WebGPU without it. */
export type VariantKind = 'wasm' | 'webgpu' | 'webgpuNoF16';

export interface ModelVariant {
  repo: string;
  dtype: { encoder_model: string; decoder_model_merged: string };
  encoderBytes: number;
  decoderBytes: number;
  /** encoderBytes + decoderBytes */
  bytes: number;
  /** Ran in headless Chrome in the spike (false = sizes from the Hugging Face API only). */
  measured: boolean;
  /** Set when the repo is not the exact model the server runs (shown to the user, never a silent swap). */
  note?: string;
}

export interface CatalogEntry {
  id: ModelId;
  label: string;
  /** The repo has a *_timestamped export (cross-attention outputs): per-word times and confidence. */
  wordTimestamps: boolean;
  variants: Record<VariantKind, ModelVariant | null>;
  /** Measured total peak working set + ~1 GB for the OS and browser, rounded up (model-matrix.md 2). */
  minRamGb: { wasm: number; webgpu: number };
}

const MB = 1e6;

function variant(
  repo: string,
  encoder: [string, number],
  decoder: [string, number],
  measured: boolean,
  note?: string,
): ModelVariant {
  const encoderBytes = Math.round(encoder[1] * MB);
  const decoderBytes = Math.round(decoder[1] * MB);
  return {
    repo,
    dtype: { encoder_model: encoder[0], decoder_model_merged: decoder[0] },
    encoderBytes,
    decoderBytes,
    bytes: encoderBytes + decoderBytes,
    measured,
    ...(note ? { note } : {}),
  };
}

const TS = (size: string) => `onnx-community/whisper-${size}_timestamped`;
const DISTIL_NOTE =
  'WebGPU uses distil-large-v3.5 (same family, newer distillation): the exact distil-large-v3 has no ' +
  'WebGPU-friendly export.';

export const MODEL_CATALOG: readonly CatalogEntry[] = [
  {
    id: 'tiny',
    label: 'Tiny',
    wordTimestamps: true,
    variants: {
      wasm: variant(TS('tiny'), ['q8', 10.1], ['q8', 30.7], true),
      webgpu: variant(TS('tiny'), ['fp16', 16.5], ['fp16', 59.6], true),
      webgpuNoF16: variant(TS('tiny'), ['fp32', 32.9], ['q4', 86.8], true),
    },
    minRamGb: { wasm: 2, webgpu: 2 },
  },
  {
    id: 'base',
    label: 'Base',
    wordTimestamps: true,
    variants: {
      wasm: variant(TS('base'), ['q8', 23.2], ['q8', 53.7], true),
      webgpu: variant(TS('base'), ['fp16', 41.3], ['fp16', 104.7], true),
      webgpuNoF16: variant(TS('base'), ['fp32', 82.5], ['q4', 123.7], true),
    },
    minRamGb: { wasm: 2, webgpu: 3 },
  },
  {
    id: 'small',
    label: 'Small',
    wordTimestamps: true,
    variants: {
      wasm: variant(TS('small'), ['q8', 92.2], ['q8', 156.8], true),
      webgpu: variant(TS('small'), ['fp16', 176.5], ['fp16', 308.5], true),
      webgpuNoF16: variant(TS('small'), ['fp32', 352.8], ['q4', 233.4], true),
    },
    minRamGb: { wasm: 4, webgpu: 8 },
  },
  {
    id: 'medium',
    label: 'Medium',
    wordTimestamps: true,
    variants: {
      wasm: variant(TS('medium'), ['q8', 313.2], ['q8', 672.6], false),
      webgpu: variant(TS('medium'), ['q4f16', 180.6], ['q4f16', 336.3], true),
      webgpuNoF16: null,
    },
    minRamGb: { wasm: 8, webgpu: 8 },
  },
  {
    id: 'large-v3-turbo',
    label: 'Large v3 Turbo',
    wordTimestamps: true,
    variants: {
      wasm: variant(TS('large-v3-turbo'), ['q8', 644.9], ['q8', 440.0], false),
      webgpu: variant(TS('large-v3-turbo'), ['q4f16', 370.0], ['q4f16', 193.6], true),
      webgpuNoF16: null,
    },
    minRamGb: { wasm: 8, webgpu: 8 },
  },
  {
    id: 'large-v3',
    label: 'Large v3',
    wordTimestamps: false,
    variants: {
      wasm: variant('onnx-community/whisper-large-v3-ONNX', ['q8', 644.8], ['q8', 1177.1], false),
      webgpu: variant(
        'onnx-community/whisper-large-v3-ONNX',
        ['q4f16', 369.9],
        ['q4f16', 609.6],
        true,
      ),
      webgpuNoF16: null,
    },
    minRamGb: { wasm: 16, webgpu: 16 },
  },
  {
    id: 'distil-large-v3',
    label: 'Distil Large v3',
    wordTimestamps: false,
    variants: {
      wasm: variant('distil-whisper/distil-large-v3', ['q8', 645.2], ['q8', 121.6], true),
      webgpu: variant(
        'distil-whisper/distil-large-v3.5-ONNX',
        ['q4f16', 369.9],
        ['q4f16', 163.7],
        true,
        DISTIL_NOTE,
      ),
      webgpuNoF16: null,
    },
    minRamGb: { wasm: 8, webgpu: 8 },
  },
];

export function catalogEntry(id: string): CatalogEntry | undefined {
  return MODEL_CATALOG.find((m) => m.id === id);
}

export function variantKind(device: Device, shaderF16: boolean): VariantKind {
  if (device === 'wasm') return 'wasm';
  return shaderF16 ? 'webgpu' : 'webgpuNoF16';
}

/** Every repo a model can be downloaded from (for delete). */
export function reposOf(entry: CatalogEntry): string[] {
  const repos = Object.values(entry.variants)
    .filter((v): v is ModelVariant => v !== null)
    .map((v) => v.repo);
  return [...new Set(repos)];
}

/** Transformers.js file-name suffix per dtype (DEFAULT_DTYPE_SUFFIX_MAPPING in 4.3.1). */
const DTYPE_SUFFIX: Record<string, string> = {
  fp32: '',
  fp16: '_fp16',
  int8: '_int8',
  uint8: '_uint8',
  q8: '_quantized',
  q4: '_q4',
  q4f16: '_q4f16',
  bnb4: '_bnb4',
};

export const CONFIG_FILES = [
  'config.json',
  'generation_config.json',
  'preprocessor_config.json',
  'tokenizer.json',
  'tokenizer_config.json',
];

/** The files Transformers.js fetches for a variant (what the spike's load recorded: 7 files). */
export function variantFiles(v: ModelVariant): string[] {
  const onnx = (stem: 'encoder_model' | 'decoder_model_merged') => {
    const suffix = DTYPE_SUFFIX[v.dtype[stem]];
    if (suffix === undefined) throw new Error(`unknown dtype ${v.dtype[stem]}`);
    return `onnx/${stem}${suffix}.onnx`;
  };
  return [...CONFIG_FILES, onnx('encoder_model'), onnx('decoder_model_merged')];
}
