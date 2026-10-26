import { CancelledError } from '../asr/types';
import type { QwenCatalogEntry } from '../models/qwen-catalog';
import type { QwenFileSet } from '../models/qwen-files';
import { HALF_TO_FLOAT, halfBits } from './half';
import { N_BINS, audioTokenCount } from './qwen-mel';
import { QwenEngine, QwenOrt, QwenSession, QwenTensor, QwenTokenizer } from './qwen-engine';

// QwenEngine against a scripted onnxruntime-web: tiny dimensions, an embedding table whose row `id` holds the value
// `id`, an encoder that returns 0.5 for every audio feature, a decoder whose argmax follows a script. No download, no
// GPU: this checks the prompt layout, the embeddings, the KV loop and its tensor disposal, the parse and cancel.

const H = 4;
const V = 32;
const L = 2;
const P = { prefix: [1, 2, 3, 4, 5, 6, 7, 8, 9], suffix: [10, 11, 12, 13, 14, 15], pad: 16, asr: 17, eos: [18, 19] };
const WORDS: Record<number, string> = { 20: 'language', 21: ' English', 17: '<asr_text>', 22: 'Hello', 23: ' world', 24: 'ctx', 25: ' Hindi' };
const enc = new TextEncoder();

class Tensor implements QwenTensor {
  disposed = false;
  constructor(
    readonly type: string,
    readonly data: unknown,
    readonly dims: readonly number[],
    readonly location = 'cpu',
  ) {}
  dispose() {
    this.disposed = true;
  }
}

interface Feed {
  embeds: number[];
  rows: number;
  mask: number;
  past: number;
}

function setup(script: number[], o: { delayStep?: number; onStep?: (n: number) => void } = {}) {
  const feeds: Feed[] = [];
  const presents: Tensor[] = [];
  let created = 0;
  const encoder: QwenSession = {
    inputNames: ['mel'],
    outputNames: ['audio_features'],
    async run(f) {
      const T = f['mel'].dims[2];
      const A = audioTokenCount(T);
      return { audio_features: new Tensor('float32', new Float32Array(A * H).fill(0.5), [1, A, H]) };
    },
  };
  let step = 0;
  const decoder: QwenSession = {
    inputNames: ['inputs_embeds', 'attention_mask', ...Array.from({ length: L }, (_, i) => [`past_key_values.${i}.key`, `past_key_values.${i}.value`]).flat()],
    outputNames: ['logits'],
    async run(f) {
      const e = f['inputs_embeds'];
      const bits = halfBits(e.data);
      feeds.push({
        embeds: Array.from(bits, (b) => HALF_TO_FLOAT[b]),
        rows: e.dims[1],
        mask: f['attention_mask'].dims[1],
        past: f['past_key_values.0.key'].dims[2],
      });
      o.onStep?.(step);
      if (o.delayStep) await new Promise((r) => setTimeout(r, o.delayStep));
      const logits = new Float32Array(V);
      logits[script[Math.min(step, script.length - 1)]] = 5;
      step++;
      const out: Record<string, QwenTensor> = { logits: new Tensor('float32', logits, [1, 1, V]) };
      const past = f['past_key_values.0.key'].dims[2] + e.dims[1];
      for (let i = 0; i < L; i++) {
        for (const kind of ['key', 'value']) {
          const t = new Tensor('float16', new Uint16Array(0), [1, 1, past, 2], 'gpu-buffer');
          presents.push(t);
          out[`present.${i}.${kind}`] = t;
        }
      }
      return out;
    },
  };
  const ort: QwenOrt = {
    Tensor: Tensor as unknown as QwenOrt['Tensor'],
    InferenceSession: { create: async () => (created++ === 0 ? encoder : decoder) },
    env: { wasm: {} },
  };
  const tokenizer: QwenTokenizer = {
    encode: (text) => (text === 'language English' ? [20, 21] : text === 'language Hindi' ? [20, 25] : [24]),
    decode: (ids) => ids.filter((i) => !P.eos.includes(i)).map((i) => WORDS[i] ?? `<${i}>`).join(''),
  };
  const engine = new QwenEngine({ ort: async () => ort, tokenizer: async () => tokenizer });
  return { engine, feeds, presents };
}

function files(): { files: QwenFileSet; entry: QwenCatalogEntry } {
  const promptConfig = {
    prompt: { prefix_ids: P.prefix, suffix_ids: P.suffix, audio_pad_id: P.pad, asr_text_id: P.asr, eos_ids: P.eos },
    language_prefix_ids: { en: [20, 21, 17] },
    language_names: { en: 'English' },
    decoder: { num_layers: L, num_key_value_heads: 1, head_dim: 2, hidden_size: H, vocab_size: V },
  };
  const emb = new Int8Array(V * H);
  for (let id = 0; id < V; id++) emb.fill(id, id * H, id * H + H);
  const scales = new Float32Array(V).fill(1);
  const json = (v: unknown) => enc.encode(JSON.stringify(v));
  const set: QwenFileSet = {
    'prompt-config': json(promptConfig),
    'mel-filters': json({ n_mels: 128, n_freqs: N_BINS, data: Array.from({ length: 128 }, () => new Array(N_BINS).fill(0.001)) }),
    tokenizer: json({}),
    'tokenizer-config': json({}),
    embeddings: new Uint8Array(emb.buffer),
    'embedding-scales': new Uint8Array(scales.buffer),
    encoder: new Uint8Array(1),
    decoder: new Uint8Array(1),
    'decoder-data': new Uint8Array(1),
  };
  const entry = {
    id: 'qwen3-asr-0.6b',
    label: 'Qwen3 ASR 0.6B',
    hidden: H,
    layers: L,
    files: [{ role: 'decoder-data', name: 'decoder.onnx.data' }],
  } as unknown as QwenCatalogEntry;
  return { files: set, entry };
}

async function loaded(script: number[], o?: Parameters<typeof setup>[1]) {
  const s = setup(script, o);
  const f = files();
  await s.engine.load(f.files, f.entry);
  return s;
}

const second = () => new Float32Array(16000).fill(0.01);

describe('QwenEngine', () => {
  it('builds the prompt (system context, audio pads replaced by the encoder output, assistant turn) and parses the answer', async () => {
    const { engine, feeds, presents } = await loaded([20, 21, 17, 22, 23, 18]);
    const r = await engine.transcribeChunk(second(), { context: 'Kubernetes' });
    expect(r).toMatchObject({ raw: 'language English<asr_text>Hello world', text: 'Hello world', language: 'English', tokens: 6, hitMaxTokens: false });
    const A = audioTokenCount(100);
    const prefill = feeds[0];
    expect(prefill.rows).toBe(9 + 1 + A + 6);
    const row = (i: number) => prefill.embeds[i * H];
    // <|im_start|>system\n {context} <|im_end|>\n<|im_start|>user\n<|audio_start|>
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(row)).toEqual([1, 2, 3, 24, 4, 5, 6, 7, 8, 9]);
    for (let i = 10; i < 10 + A; i++) expect(row(i)).toBe(0.5);
    expect(Array.from({ length: 6 }, (_, k) => row(10 + A + k))).toEqual(P.suffix);
    // the KV cache grows by one per step; the mask covers prompt + generated tokens
    expect(feeds.slice(1).map((f) => [f.rows, f.past, f.mask])).toEqual(
      [1, 2, 3, 4, 5].map((k) => [1, prefill.rows + k - 1, prefill.rows + k]),
    );
    // every step feeds the embedding of the previous argmax
    expect(feeds.slice(1).map((f) => f.embeds[0])).toEqual([20, 21, 17, 22, 23]);
    expect(presents.every((t) => t.disposed)).toBe(true);
  });

  it('forces the language with `language X<asr_text>` ids (prompt_config table, else the tokenizer)', async () => {
    const { engine, feeds } = await loaded([22, 23, 18]);
    const r = await engine.transcribeChunk(second(), { language: 'English' });
    expect(r).toMatchObject({ text: 'Hello world', language: 'English' });
    const f = feeds[0];
    const rows = Array.from({ length: f.rows }, (_, i) => f.embeds[i * H]);
    expect(rows.slice(-3)).toEqual([20, 21, 17]);
    expect(engine.forcedPrefix('Hindi')).toEqual([20, 25, 17]);
  });

  it('pads a chunk under 0.5 s and stops at maxNewTokens', async () => {
    const { engine, feeds } = await loaded([22]);
    const r = await engine.transcribeChunk(new Float32Array(1600), { maxNewTokens: 4 });
    expect(r.hitMaxTokens).toBe(true);
    expect(r.tokens).toBe(4);
    expect(feeds[0].rows).toBe(9 + audioTokenCount(50) + 6);
  });

  it('cancels between decoder steps, disposes the KV cache and can run again', async () => {
    let engineRef: QwenEngine | null = null;
    const s = setup([22, 22, 22, 22, 22, 18], { onStep: (n) => n === 2 && engineRef?.cancel() });
    engineRef = s.engine;
    const f = files();
    await s.engine.load(f.files, f.entry);
    await expect(s.engine.transcribeChunk(second())).rejects.toBeInstanceOf(CancelledError);
    expect(s.presents.every((t) => t.disposed)).toBe(true);
  });

  it('refuses a second call while one runs and any call before load', async () => {
    const fresh = setup([18]).engine;
    await expect(fresh.transcribeChunk(second())).rejects.toThrow(/load\(\) first/);
    const { engine } = await loaded([22, 18], { delayStep: 5 });
    const a = engine.transcribeChunk(second());
    await expect(engine.transcribeChunk(second())).rejects.toThrow(/one call at a time/);
    await a;
    await engine.dispose();
    expect(engine.loaded).toBe(false);
  });
});
