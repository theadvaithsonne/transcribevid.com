# engine/models - model catalog, model manager, ORT runtime settings

Pure TypeScript, no Angular. Derived from `docs/in-browser/spike/model-catalog.json` and
`spike/model-matrix.md`; the Cache API layout and runtime facts are from `spike/asr.md` Q8 / Q9.

| File               | What                                                                                                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `catalog.ts`       | `MODEL_CATALOG`: per model id the repo + dtype + bytes for WASM, WebGPU and WebGPU without `shader-f16`, word-timestamp availability, measured flag, minimum RAM; `variantFiles` |
| `ort-config.ts`    | the pinned ORT version and jsDelivr URLs, `configureOrtRuntime(env)`, `chooseVariant` / `chooseDtype`                                                                            |
| `model-manager.ts` | `ModelManager`: `plan`, `ensure`, `isCached`, `missingFiles`, `checkQuota`, `delete`, `cachedModels`, `sizeText`; `ensureQwen`, `qwenSizeText`; `ModelError`                    |
| `qwen-catalog.ts`  | `QWEN_CATALOG`: Qwen3-ASR 0.6B / 1.7B, every file pinned to a commit with its size and SHA-256 (qwen.md 2b / 5)                                                                   |
| `qwen-files.ts`    | `fetchQwenFiles` / `missingQwenFiles`: pinned URL, byte progress, SHA-256 while streaming, Cache API                                                                                |
| `sha256.ts`        | incremental SHA-256 (no second copy of a 1 GB file, unlike WebCrypto `digest`)                                                                                                      |
| `licences.ts`      | `THIRD_PARTY_NOTICES` (ffmpeg.wasm GPL, Qwen Apache-2.0) for the licences page (docs/in-browser/LICENCES.md)                                                                         |

## Catalog

| id              | WASM                          | WebGPU (`shader-f16`)                                   | WebGPU, no `shader-f16` | words  | min RAM wasm / gpu |
| --------------- | ----------------------------- | ------------------------------------------------------- | ----------------------- | ------ | ------------------ |
| tiny            | q8 41 MB                      | fp16 76 MB                                              | fp32 + q4 120 MB        | yes    | 2 / 2 GB           |
| base            | q8 77 MB                      | fp16 146 MB                                             | fp32 + q4 206 MB        | yes    | 2 / 3 GB           |
| small           | q8 249 MB                     | fp16 485 MB                                             | fp32 + q4 586 MB        | yes    | 4 / 8 GB           |
| medium          | q8 986 MB (not measured)      | q4f16 517 MB                                            | -                       | yes    | 8 / 8 GB           |
| large-v3-turbo  | q8 1.1 GB (not measured)      | q4f16 564 MB                                            | -                       | yes    | 8 / 8 GB           |
| large-v3        | q8 1.8 GB (not measured)      | q4f16 980 MB                                            | -                       | **no** | 16 / 16 GB         |
| distil-large-v3 | q8 767 MB (`distil-large-v3`) | q4f16 534 MB (`distil-large-v3.5-ONNX`, `note` says so) | -                       | **no** | 8 / 8 GB           |

`large-v3` and `distil-large-v3` carry `aligner: 'large-v3-turbo'` (catalog; `alignerOf(id)`): their word timing
comes from the turbo `_timestamped` model (+564 MB on WebGPU, downloaded only with word timing on).

Qwen3-ASR (`qwen-catalog.ts`, WebGPU + `shader-f16` only): 0.6B = jiangzhuo9357/Qwen3-ASR-0.6B-ONNX@4a01b95f (prompt
config, mel filters, tokenizer, int8 embeddings 155.6 MB, fp16 encoder 376.3 MB) + sorryhyun/qwen3-asr-onnx-gqa@075249f7
(fused decoder 352.5 MB) = 896.5 MB; 1.7B = jiangzhuo9357/Qwen3-ASR-1.7B-ONNX@fcc238df (embeddings 311.2 MB, encoder
639.1 MB) + the 1.7B fused decoder 985.1 MB = 1947.6 MB. They are not a Transformers.js model: `ensureQwen` fetches
each file from `https://huggingface.co/<repo>/resolve/<commit>/<file>`, refuses a size or hash mismatch, stores it in
'transformers-cache' (so "delete the downloaded models" removes it too), then calls `QwenEngine.load`.

Word-timestamp sizes use the `onnx-community/whisper-*_timestamped` repos. Sizes are the two ONNX files
(1 MB = 1e6 bytes); configs add ~2.5-4 MB, the ORT runtime 26.9 MB (asyncify) or 16.8 MB (jspi). Which
models a device is offered is `engine/device`'s gating table (ARCHITECTURE section 5), not this folder's.

## API

```ts
const manager = new ModelManager(); // defaults: globalThis.caches, navigator.storage
manager.sizeText('base', 'webgpu', { shaderF16 }); // '146 MB'
await manager.isCached('base', 'webgpu', { shaderF16 }); // every file in 'transformers-cache'?
await manager.checkQuota(manager.plan('base', 'webgpu')); // { usage, quota, free, needed, ok }
const { plan, info, wasCached } = await manager.ensure('base', 'webgpu', engine, {
  gpu: { shaderF16 },
  onProgress,
});
await manager.delete('base'); // { entries, bytes }; the ORT runtime stays
```

- `ensure` configures the ORT runtime once (`env.backends.onnx.wasm.wasmPaths` = `{mjs, wasm}` on
  `https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.0-dev.20260914-8d85527a0/dist/`, `numThreads` 1,
  browser + wasm cache on), checks the quota, then calls `engine.load(plan.loadOptions, onProgress)`; the
  engine reports per-file progress from Transformers.js's `progress_callback` with the total known up front.
- Errors are `ModelError` with `code` (`unknown-model`, `unsupported`, `quota`, `model-download`),
  `userMessage` and `technical`; a `CancelledError` passes through. `ignoreQuota: true` loads anyway
  (the files stream but are not kept, spike Q8).
- `isCached` / `delete` read the Cache API bucket directly (keys are
  `https://huggingface.co/<repo>/resolve/main/<file>`), so they work on the page without loading the library.
- WebGPU dtype: fp16 needs `shader-f16`; without it tiny / base / small get the fp32 encoder + q4 decoder
  mix, the large models are refused (`unsupported`).

## Tests

`catalog.spec.ts` (cross-checks every repo and per-file size against `model-catalog.json`),
`ort-config.spec.ts` (the pin equals the installed `onnxruntime-web` and transformers' dependency; paths,
threads, dtype choice) and `model-manager.spec.ts` (fake Cache API, fake storage estimate, fake loader):
run with `ng test --watch=false --include "**/engine/{asr,models}/*.spec.ts"`. Nothing is downloaded. The
browser check is described in `engine/asr/README.md`.

## Known limits

- Per-file resume only: a dropped connection restarts that file (no byte-range resume, spike Q8).
- `navigator.storage.persist()` is not requested here (headless denied it; the page should ask once).
- The big models' WASM mixes and every no-`shader-f16` mix of medium and up were never run in a browser.
- jspi (16 MiB) worked on Chrome 155 only in the spike; asyncify stays the default until Firefox / Safari
  are tested. Both come from jsDelivr, so Cloudflare Pages' 25 MiB file limit does not apply.
