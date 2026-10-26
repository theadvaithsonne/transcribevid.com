import {
  catalogEntry,
  CONFIG_FILES,
  MODEL_CATALOG,
  ModelVariant,
  reposOf,
  variantFiles,
  variantKind,
} from './catalog';

interface SpikeCatalog {
  transformersJs: string;
  onnxruntimeWeb: string;
  models: Array<{
    id: string;
    wordTimestampsAvailable: boolean;
    recommendedRepo: string;
    repos: Array<{
      repo: string;
      timestampedExport: boolean;
      sizesMB: Record<string, { encoder: number | null; decoder: number | null }>;
    }>;
  }>;
}

/** docs/in-browser/spike/model-catalog.json, read from disk (Node); null when not reachable. */
async function readSpikeCatalog(): Promise<SpikeCatalog | null> {
  try {
    const proc = (globalThis as unknown as { process?: { cwd(): string } }).process;
    if (!proc) return null;
    const specifier = (name: string): string => `node:${name}`;
    const fs = (await import(/* @vite-ignore */ specifier('fs'))) as {
      readFileSync(p: string, e: string): string;
    };
    const path = (await import(/* @vite-ignore */ specifier('path'))) as {
      join(...p: string[]): string;
    };
    const file = path.join(proc.cwd(), '..', 'docs', 'in-browser', 'spike', 'model-catalog.json');
    return JSON.parse(fs.readFileSync(file, 'utf8')) as SpikeCatalog;
  } catch {
    return null;
  }
}

const variants = (): Array<[string, string, ModelVariant]> =>
  MODEL_CATALOG.flatMap((m) =>
    Object.entries(m.variants)
      .filter((e): e is [string, ModelVariant] => e[1] !== null)
      .map(([kind, v]) => [m.id, kind, v] as [string, string, ModelVariant]),
  );

describe('MODEL_CATALOG', () => {
  it('offers the seven Whisper sizes of the app, in order', () => {
    expect(MODEL_CATALOG.map((m) => m.id)).toEqual([
      'tiny',
      'base',
      'small',
      'medium',
      'large-v3-turbo',
      'large-v3',
      'distil-large-v3',
    ]);
    expect(catalogEntry('base')?.label).toBe('Base');
    expect(catalogEntry('huge')).toBeUndefined();
  });

  it('has word timestamps for every size except large-v3 and distil-large-v3', () => {
    const noWords = MODEL_CATALOG.filter((m) => !m.wordTimestamps).map((m) => m.id);
    expect(noWords).toEqual(['large-v3', 'distil-large-v3']);
    for (const m of MODEL_CATALOG.filter((x) => x.wordTimestamps)) {
      for (const v of Object.values(m.variants)) {
        if (v) expect(v.repo).toMatch(/_timestamped$/);
      }
    }
  });

  it('downloads the measured mixes: WASM q8, WebGPU fp16 (q4f16 for the big ones), fp32/q4 without shader-f16', () => {
    const t = catalogEntry('tiny')!.variants;
    expect(t.wasm!.dtype).toEqual({ encoder_model: 'q8', decoder_model_merged: 'q8' });
    expect(t.webgpu!.dtype).toEqual({ encoder_model: 'fp16', decoder_model_merged: 'fp16' });
    expect(t.webgpuNoF16!.dtype).toEqual({ encoder_model: 'fp32', decoder_model_merged: 'q4' });
    for (const id of ['medium', 'large-v3-turbo', 'large-v3', 'distil-large-v3']) {
      const e = catalogEntry(id)!;
      expect(e.variants.webgpu!.dtype).toEqual({
        encoder_model: 'q4f16',
        decoder_model_merged: 'q4f16',
      });
      expect(e.variants.webgpuNoF16).toBeNull();
      expect(e.variants.webgpu!.measured).toBe(true);
    }
  });

  it('keeps the sizes the architecture quotes (tiny 41-76 MB ... large-v3 980 MB)', () => {
    const mb = (id: string, kind: 'wasm' | 'webgpu') =>
      Math.round(catalogEntry(id)!.variants[kind]!.bytes / 1e6);
    expect([mb('tiny', 'wasm'), mb('tiny', 'webgpu')]).toEqual([41, 76]);
    expect([mb('base', 'wasm'), mb('base', 'webgpu')]).toEqual([77, 146]);
    expect([mb('small', 'wasm'), mb('small', 'webgpu')]).toEqual([249, 485]);
    expect(mb('medium', 'webgpu')).toBe(517);
    expect(mb('large-v3-turbo', 'webgpu')).toBe(564);
    expect(mb('large-v3', 'webgpu')).toBe(980);
    expect([mb('distil-large-v3', 'webgpu'), mb('distil-large-v3', 'wasm')]).toEqual([534, 767]);
    for (const [, , v] of variants()) expect(v.bytes).toBe(v.encoderBytes + v.decoderBytes);
  });

  it('says so when WebGPU distil uses the v3.5 repo (never a silent swap)', () => {
    const d = catalogEntry('distil-large-v3')!;
    expect(d.variants.webgpu!.repo).toBe('distil-whisper/distil-large-v3.5-ONNX');
    expect(d.variants.webgpu!.note).toMatch(/distil-large-v3\.5/);
    expect(d.variants.wasm!.repo).toBe('distil-whisper/distil-large-v3');
    expect(reposOf(d)).toEqual([
      'distil-whisper/distil-large-v3',
      'distil-whisper/distil-large-v3.5-ONNX',
    ]);
  });

  it('has a minimum RAM per device that grows with the model', () => {
    const ram = MODEL_CATALOG.map((m) => m.minRamGb.webgpu);
    expect(ram).toEqual([2, 3, 8, 8, 8, 16, 8]);
    expect(catalogEntry('small')!.minRamGb.wasm).toBe(4);
  });

  it('matches docs/in-browser/spike/model-catalog.json (repos, per-file sizes, word timestamps)', async () => {
    const spike = await readSpikeCatalog();
    if (!spike) return; // not reachable from this runner
    expect(spike.transformersJs).toBe('4.3.1');
    for (const m of MODEL_CATALOG) {
      const s = spike.models.find((x) => x.id === m.id)!;
      expect(s).toBeDefined();
      expect(m.wordTimestamps).toBe(s.wordTimestampsAvailable);
      for (const v of Object.values(m.variants)) {
        if (!v) continue;
        const repo = s.repos.find((r) => r.repo === v.repo);
        expect(repo, `${m.id} ${v.repo}`).toBeDefined();
        const enc = repo!.sizesMB[v.dtype.encoder_model];
        const dec = repo!.sizesMB[v.dtype.decoder_model_merged];
        expect(v.encoderBytes).toBe(Math.round(enc.encoder! * 1e6));
        expect(v.decoderBytes).toBe(Math.round(dec.decoder! * 1e6));
      }
    }
  });
});

describe('variantFiles / variantKind', () => {
  it('lists the seven files the spike saw Transformers.js fetch for tiny q8', () => {
    const files = variantFiles(catalogEntry('tiny')!.variants.wasm!);
    expect([...files].sort()).toEqual(
      [
        'config.json',
        'onnx/encoder_model_quantized.onnx',
        'onnx/decoder_model_merged_quantized.onnx',
        'generation_config.json',
        'tokenizer.json',
        'tokenizer_config.json',
        'preprocessor_config.json',
      ].sort(),
    );
    expect(files.slice(0, CONFIG_FILES.length)).toEqual(CONFIG_FILES);
  });

  it('uses the dtype suffixes of Transformers.js', () => {
    expect(variantFiles(catalogEntry('base')!.variants.webgpu!).slice(-2)).toEqual([
      'onnx/encoder_model_fp16.onnx',
      'onnx/decoder_model_merged_fp16.onnx',
    ]);
    expect(variantFiles(catalogEntry('small')!.variants.webgpuNoF16!).slice(-2)).toEqual([
      'onnx/encoder_model.onnx',
      'onnx/decoder_model_merged_q4.onnx',
    ]);
    expect(variantFiles(catalogEntry('medium')!.variants.webgpu!).slice(-2)).toEqual([
      'onnx/encoder_model_q4f16.onnx',
      'onnx/decoder_model_merged_q4f16.onnx',
    ]);
  });

  it('maps a device to its variant', () => {
    expect(variantKind('wasm', false)).toBe('wasm');
    expect(variantKind('wasm', true)).toBe('wasm');
    expect(variantKind('webgpu', true)).toBe('webgpu');
    expect(variantKind('webgpu', false)).toBe('webgpuNoF16');
  });
});
