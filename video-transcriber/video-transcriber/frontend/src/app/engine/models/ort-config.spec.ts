import { catalogEntry } from './catalog';
import {
  chooseDtype,
  chooseVariant,
  configureOrtRuntime,
  ORT_CDN_BASE,
  ORT_VERSION,
  ortWasmPaths,
  TransformersEnvLike,
} from './ort-config';

/** package.json of an installed package (Node), or null when not reachable. */
async function installedPackage(name: string): Promise<Record<string, unknown> | null> {
  try {
    const proc = (globalThis as unknown as { process?: { cwd(): string } }).process;
    if (!proc) return null;
    const specifier = (n: string): string => `node:${n}`;
    const fs = (await import(/* @vite-ignore */ specifier('fs'))) as {
      readFileSync(p: string, e: string): string;
    };
    const path = (await import(/* @vite-ignore */ specifier('path'))) as {
      join(...p: string[]): string;
    };
    const file = path.join(proc.cwd(), 'node_modules', ...name.split('/'), 'package.json');
    return JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

describe('ORT runtime pin', () => {
  it('is the exact onnxruntime-web build that @huggingface/transformers 4.3.1 pins', async () => {
    const ort = await installedPackage('onnxruntime-web');
    const tf = await installedPackage('@huggingface/transformers');
    if (!ort || !tf) return; // not reachable from this runner
    expect(ort['version']).toBe(ORT_VERSION);
    expect(tf['version']).toBe('4.3.1');
    expect((tf['dependencies'] as Record<string, string>)['onnxruntime-web']).toBe(ORT_VERSION);
  });

  it('points at the pinned jsDelivr URL, asyncify by default, jspi on request', () => {
    expect(ORT_CDN_BASE).toBe(
      'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.0-dev.20260914-8d85527a0/dist/',
    );
    expect(ortWasmPaths()).toEqual({
      mjs: `${ORT_CDN_BASE}ort-wasm-simd-threaded.asyncify.mjs`,
      wasm: `${ORT_CDN_BASE}ort-wasm-simd-threaded.asyncify.wasm`,
    });
    expect(ortWasmPaths('jspi', '/ort').wasm).toBe('/ort/ort-wasm-simd-threaded.jspi.wasm');
  });
});

describe('configureOrtRuntime', () => {
  it('sets the {mjs, wasm} paths (so the runtime is cached too) and one thread', () => {
    const env: TransformersEnvLike = { backends: { onnx: {} } };
    const paths = configureOrtRuntime(env);
    expect(env.backends.onnx.wasm).toEqual({ wasmPaths: paths, numThreads: 1 });
    expect(env.useBrowserCache).toBe(true);
    expect(env.useWasmCache).toBe(true);
  });

  it('keeps other wasm settings and accepts a self-hosted base and build', () => {
    const env: TransformersEnvLike = { backends: { onnx: { wasm: { proxy: false } } } };
    configureOrtRuntime(env, { build: 'jspi', base: 'https://example.test/ort/', numThreads: 4 });
    expect(env.backends.onnx.wasm).toEqual({
      proxy: false,
      numThreads: 4,
      wasmPaths: {
        mjs: 'https://example.test/ort/ort-wasm-simd-threaded.jspi.mjs',
        wasm: 'https://example.test/ort/ort-wasm-simd-threaded.jspi.wasm',
      },
    });
  });
});

describe('chooseVariant / chooseDtype', () => {
  it('gives WASM q8, WebGPU fp16 with shader-f16, fp32 encoder + q4 decoder without it', () => {
    const base = catalogEntry('base')!;
    expect(chooseDtype(base, 'wasm')).toEqual({ encoder_model: 'q8', decoder_model_merged: 'q8' });
    expect(chooseDtype(base, 'webgpu', { shaderF16: true })).toEqual({
      encoder_model: 'fp16',
      decoder_model_merged: 'fp16',
    });
    expect(chooseDtype(base, 'webgpu', { shaderF16: false })).toEqual({
      encoder_model: 'fp32',
      decoder_model_merged: 'q4',
    });
  });

  it('assumes shader-f16 when the adapter facts are not given', () => {
    expect(chooseVariant(catalogEntry('tiny')!, 'webgpu').dtype.encoder_model).toBe('fp16');
  });

  it('refuses the large models on WebGPU without shader-f16 (no measured mix)', () => {
    expect(() => chooseVariant(catalogEntry('medium')!, 'webgpu', { shaderF16: false })).toThrow(
      /Medium needs .*16-bit float/,
    );
  });

  it('returns a copy, so a caller cannot change the catalog', () => {
    const tiny = catalogEntry('tiny')!;
    const d = chooseDtype(tiny, 'wasm') as { encoder_model: string };
    d.encoder_model = 'fp32';
    expect(tiny.variants.wasm!.dtype.encoder_model).toBe('q8');
  });
});
