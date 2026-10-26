/**
 * Qwen3-ASR 0.6B / 1.7B in the browser: the pinned ONNX files (docs/in-browser/spike/qwen.md sections 2b, 5).
 *
 * Route (the only one the device plan offers, engine/device row `desktop-webgpu-f16-8gb`): WebGPU with `shader-f16`,
 * the layout-v2 export of jiangzhuo9357 for the fp16 audio encoder, the int8 embedding table, the mel filters and the
 * tokenizer, plus the fused GroupQueryAttention decoder of sorryhyun (fp16 activations, int4 weights, block 32),
 * which was 1.6-2.7x faster per step than the split decoders in the spike. All repos are Apache-2.0.
 *
 * Pins: every file is fetched from `https://huggingface.co/<repo>/resolve/<revision>/<file>` (a commit, never `main`)
 * and checked against its SHA-256 before it is used or cached. Sizes and hashes: the Hub's tree API at these commits
 * (LFS files: `lfs.oid`; the small JSON files: hashed from the spike's downloads, whose git blob ids equal the tree's),
 * read 2026-10-26.
 */

export type QwenModelId = 'qwen3-asr-0.6b' | 'qwen3-asr-1.7b';

export type QwenFileRole =
  | 'prompt-config'
  | 'mel-filters'
  | 'tokenizer'
  | 'tokenizer-config'
  | 'embeddings'
  | 'embedding-scales'
  | 'encoder'
  | 'decoder'
  | 'decoder-data';

export interface QwenFile {
  role: QwenFileRole;
  repo: string;
  revision: string;
  /** path inside the repo */
  name: string;
  bytes: number;
  sha256: string;
}

export interface QwenCatalogEntry {
  id: QwenModelId;
  label: string;
  /** the official weights these files were exported from */
  baseModel: string;
  /** hidden size of the text decoder (embedding width) */
  hidden: number;
  layers: number;
  kvHeads: number;
  headDim: number;
  vocab: number;
  /** the fused decoder takes fp16 activations: only adapters with `shader-f16` */
  needsShaderF16: true;
  files: QwenFile[];
  /** sum of the file sizes */
  bytes: number;
  /** measured in the spike (qwen.md section 3) */
  measured: boolean;
}

export const JZ06 = { repo: 'jiangzhuo9357/Qwen3-ASR-0.6B-ONNX', revision: '4a01b95fafe2c9e3af77e33c18bbb7de349c62f6' };
export const JZ17 = { repo: 'jiangzhuo9357/Qwen3-ASR-1.7B-ONNX', revision: 'fcc238dfdc95cdcccaa9a7e2c7f5abc2f94f44a7' };
export const GQA = { repo: 'sorryhyun/qwen3-asr-onnx-gqa', revision: '075249f70b56cdded1cf4b189cbdde0fb77aeec1' };

const file = (
  src: { repo: string; revision: string },
  role: QwenFileRole,
  name: string,
  bytes: number,
  sha256: string,
): QwenFile => ({ role, repo: src.repo, revision: src.revision, name, bytes, sha256 });

/** The tokenizer and mel filters are byte-identical in both jiangzhuo repos. */
const shared = (src: { repo: string; revision: string }, promptConfigSha: string): QwenFile[] => [
  file(src, 'prompt-config', 'prompt_config.json', 2578, promptConfigSha),
  file(src, 'mel-filters', 'mel_filters.json', 132427, 'dcdaf139353616855b4f85e304c075f5f3442573d40637ae0f031db705626181'),
  file(src, 'tokenizer', 'tokenizer.json', 11429377, 'bd2a97b55c8f7f9c328c73ee9b9178771037e9f566dfca8e238a063d41cbac92'),
  file(src, 'tokenizer-config', 'tokenizer_config.json', 12488, '784c92a0a81fbbc440afb89842f8c16c8da28dfb9ff381fcea585b84f4eed7d1'),
];

function entry(e: Omit<QwenCatalogEntry, 'bytes'>): QwenCatalogEntry {
  return { ...e, bytes: e.files.reduce((n, f) => n + f.bytes, 0) };
}

export const QWEN_CATALOG: readonly QwenCatalogEntry[] = [
  entry({
    id: 'qwen3-asr-0.6b',
    label: 'Qwen3 ASR 0.6B',
    baseModel: 'Qwen/Qwen3-ASR-0.6B',
    hidden: 1024,
    layers: 28,
    kvHeads: 8,
    headDim: 128,
    vocab: 151936,
    needsShaderF16: true,
    measured: true,
    files: [
      ...shared(JZ06, '282e0cba43d48f0799c665e2687bea950cbb090bc1def85578d6cdf369c08970'),
      file(JZ06, 'embeddings', 'embed_tokens.int8.bin', 155582464, '9ec07c97a15cb9defb675656edeed0370bc3e7b2c478d1eefe6f948fc6516513'),
      file(JZ06, 'embedding-scales', 'embed_scales.f32.bin', 607744, 'acce138a5f06f1233faa4a8a359903b3c303efc0ce37818ad8cf0f9be11fc9b3'),
      file(JZ06, 'encoder', 'encoder.fp16.onnx', 376261247, 'af2a517a3d873a401ec9f64a81711e3d780fc8b085fd36f9366f9ac17a54411b'),
      file(GQA, 'decoder', 'decoder-0.6b-fp16.onnx', 302915, '9b5e2d3da0f06b10914362a8962ca27e6a67c763240f6cb3a8e4cc745548163e'),
      file(GQA, 'decoder-data', 'decoder-0.6b-fp16.onnx.data', 352190464, 'ba71b39490074e6be28ebe9714443c50525cf87116694135dbf47e33da5b0a39'),
    ],
  }),
  entry({
    id: 'qwen3-asr-1.7b',
    label: 'Qwen3 ASR 1.7B',
    baseModel: 'Qwen/Qwen3-ASR-1.7B',
    hidden: 2048,
    layers: 28,
    kvHeads: 8,
    headDim: 128,
    vocab: 151936,
    needsShaderF16: true,
    measured: true,
    files: [
      ...shared(JZ17, '95ee1df705db5dde4a06afa75db3a6cf1d1f6a8171edf3b20b44c9281a7728e2'),
      file(JZ17, 'embeddings', 'embed_tokens.int8.bin', 311164928, 'aae6843861877411c99999f37dd6767a14cd1384d14e4ec9a94ca473c4cdc8b4'),
      file(JZ17, 'embedding-scales', 'embed_scales.f32.bin', 607744, '043e444f62ed1494b0be68b00d06b237a535ac2f6c42ff2d18aea238dddefe3f'),
      file(JZ17, 'encoder', 'encoder.fp16.onnx', 639098881, '05be4287756a0ced2da6b12cc41ebb79614e41c4363120a18deffebfd7658281'),
      file(GQA, 'decoder', 'decoder-1.7b-fp16.onnx', 303131, '4d374d8cc1a18a75a1e1df8fc1c16dddf99feea2db1b543d0d0214f18f246eb0'),
      file(GQA, 'decoder-data', 'decoder-1.7b-fp16.onnx.data', 984809472, '4515bfb2e853b12dedfba4dc887f31111a791e656b272478397af0f531260288'),
    ],
  }),
];

export function qwenEntry(id: string): QwenCatalogEntry | undefined {
  return QWEN_CATALOG.find((m) => m.id === id);
}

export function isQwenModel(id: string): id is QwenModelId {
  return QWEN_CATALOG.some((m) => m.id === id);
}

export const HF_RESOLVE = 'https://huggingface.co/';

/** The pinned download URL of a file (also its Cache API key). */
export function qwenFileUrl(f: Pick<QwenFile, 'repo' | 'revision' | 'name'>, host = HF_RESOLVE): string {
  return `${host}${f.repo}/resolve/${f.revision}/${f.name}`;
}

/** Every repo a Qwen model downloads from (for delete). */
export function qwenRepos(e: QwenCatalogEntry): string[] {
  return [...new Set(e.files.map((f) => f.repo))];
}
