/**
 * ONNX Runtime Web configuration for the in-browser engine (docs/in-browser/spike/asr.md Q1, Q9):
 * - the runtime files come from the pinned jsDelivr URL of the exact onnxruntime-web build that
 *   @huggingface/transformers 4.3.1 pins (spec checks this against node_modules);
 * - wasmPaths is the {mjs, wasm} object form, which lets Transformers.js keep both files in the Cache
 *   API (useWasmCache) so a second visit works offline;
 * - one WASM thread: the site is not cross-origin isolated (ads), ORT forces 1 thread anyway;
 * - 'asyncify' is the default build (25.62 MiB, every WASM browser); 'jspi' (16.03 MiB) worked on
 *   Chrome 155 for WASM and WebGPU but was not tested on Firefox / Safari.
 */
import { Device, DtypeSpec } from '../asr/types';
import { CatalogEntry, ModelVariant, variantKind } from './catalog';

export const ORT_VERSION = '1.31.0-dev.20260914-8d85527a0';
export const ORT_CDN_BASE = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;

export type OrtBuild = 'asyncify' | 'jspi';

/** Bytes of the .wasm of each build (q9-runtime.json); the .mjs adds ~53 KB. */
export const ORT_WASM_BYTES: Record<OrtBuild, number> = { asyncify: 26861777, jspi: 16811691 };

export interface OrtWasmPaths {
  mjs: string;
  wasm: string;
}

export function ortWasmPaths(build: OrtBuild = 'asyncify', base = ORT_CDN_BASE): OrtWasmPaths {
  const root = base.endsWith('/') ? base : base + '/';
  return {
    mjs: `${root}ort-wasm-simd-threaded.${build}.mjs`,
    wasm: `${root}ort-wasm-simd-threaded.${build}.wasm`,
  };
}

export interface OrtRuntimeOptions {
  build?: OrtBuild;
  /** Another host for the runtime files (self-hosting); default the pinned jsDelivr URL. */
  base?: string;
  numThreads?: number;
}

/** The part of Transformers.js's `env` that is touched here. */
export interface TransformersEnvLike {
  useBrowserCache?: boolean;
  useWasmCache?: boolean;
  backends: { onnx: { wasm?: Record<string, unknown> } & Record<string, unknown> };
}

/** Applies the runtime settings to Transformers.js's env (call once per worker, before any load). */
export function configureOrtRuntime(
  env: TransformersEnvLike,
  o: OrtRuntimeOptions = {},
): OrtWasmPaths {
  const paths = ortWasmPaths(o.build, o.base);
  const onnx = env.backends.onnx;
  const wasm = (onnx.wasm ??= {});
  wasm['wasmPaths'] = paths;
  wasm['numThreads'] = o.numThreads ?? 1;
  env.useBrowserCache = true;
  env.useWasmCache = true;
  return paths;
}

/** WebGPU adapter facts the dtype choice depends on (from engine/device's probe). */
export interface GpuFeatures {
  shaderF16: boolean;
}

/**
 * The download for a model on a device. WebGPU without `shader-f16` cannot run fp16 graphs (fp16
 * throws), so it gets the fp32 encoder + q4 decoder mix (tiny / base / small only; the large models
 * have no measured no-f16 mix and are not offered there).
 */
export function chooseVariant(
  entry: CatalogEntry,
  device: Device,
  gpu: GpuFeatures = { shaderF16: true },
): ModelVariant {
  const kind = variantKind(device, gpu.shaderF16);
  const v = entry.variants[kind];
  if (!v) {
    const why = kind === 'webgpuNoF16' ? 'a graphics card with 16-bit float support' : 'WebGPU';
    throw new Error(`${entry.label} needs ${why} in this browser`);
  }
  return v;
}

export function chooseDtype(entry: CatalogEntry, device: Device, gpu?: GpuFeatures): DtypeSpec {
  return { ...chooseVariant(entry, device, gpu).dtype };
}
