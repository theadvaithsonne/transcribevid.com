# engine/models - model catalog, model manager, ORT runtime settings

Pure TypeScript, no Angular. Derived from `docs/in-browser/spike/model-catalog.json` and
`spike/model-matrix.md`; the Cache API layout and runtime facts are from `spike/asr.md` Q8 / Q9.

| File               | What                                                                                                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `catalog.ts`       | `MODEL_CATALOG`: per model id the repo + dtype + bytes for WASM, WebGPU and WebGPU without `shader-f16`, word-timestamp availability, measured flag, minimum RAM; `variantFiles` |
| `ort-config.ts`    | the pinned ORT version and jsDelivr URLs, `configureOrtRuntime(env)`, `chooseVariant` / `chooseDtype`                                                                            |
| `model-manager.ts` | `ModelManager`: `plan`, `ensure`, `isCached`, `missingFiles`, `checkQuota`, `delete`, `cachedModels`, `sizeText`; `ensureQwen`, `qwenSizeText`; `ModelError`                    |
| `qwen-catalog.ts`  | `QWEN_CATALOG`: Qwen3-ASR 0.6B / 1.7B, every file pinned to a commit with its size and SHA-256 (qwen.md 2b / 5)                                                                   |
| `qwen-files.ts`    | `fetchQwenFiles` / `missingQwenFiles`: pinned URL, resumable download, SHA-256 over the finished file, Cache API                                                                   |
| `resumable-download.ts` | `downloadResumable`: HTTP Range download in 8 MiB parts kept in IndexedDB 'tv-downloads' (continues after a dropped connection or a reload), retries, stall and offline handling; `discardDownload(s)`, `deleteAllDownloads`, `savedDownload`, `requestPersistentStorage` |
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
each file from `https://huggingface.co/<repo>/resolve/<commit>/<file>` with the resumable downloader, reads the finished
file once in 8 MiB slices (SHA-256 and the bytes the engine gets, in one pass), refuses a size or hash mismatch (and
drops the parts), stores it in 'transformers-cache' (so "delete the downloaded models" removes it too), then calls
`QwenEngine.load`.

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
  onProgress, // ProgressInfo; `note` while it waits, retries or continues a download
  signal, // the job's cancel (the saved parts stay)
});
await manager.delete('base'); // { entries, bytes }; also its saved parts; the ORT runtime stays

// resumable-download.ts, used by ensure / ensureQwen for every model file
const blob = await downloadResumable(url, { size, estimatedSize, signal, onProgress, store, fetchImpl, chunkBytes });
await discardDownload(url); // the parts of one file (after the Cache API put)
await deleteAllDownloads(); // every saved part ("delete the downloaded models")
```

- `ensure` configures the ORT runtime once (`env.backends.onnx.wasm.wasmPaths` = `{mjs, wasm}` on
  `https://cdn.jsdelivr.net/npm/onnxruntime-web@1.31.0-dev.20260914-8d85527a0/dist/`, `numThreads` 1,
  browser + wasm cache on), checks the quota, downloads every missing file of the plan with
  `downloadResumable` and puts it into 'transformers-cache' under the key Transformers.js 4.3.1 looks up
  (`src/utils/hub.js` `buildResourcePaths`: `remoteHost` + `{model}/resolve/{revision}/` + file) with
  `content-length` and `content-type`, all it reads from a cached Response besides the body (`hub.js`
  `loadResourceFile`, `model_registry/get_file_metadata.js`). It drops the parts, then calls
  `engine.load(plan.loadOptions, ...)`, which reads the files back from the cache. Progress is one bar over all files
  of the plan (catalog sizes until the server says the exact one); while the engine reads the cache the bar stays
  full (a file the cache refused, or one outside the plan, is a real download by the engine and extends it). With no
  Cache API, or with `ignoreQuota` and files that do not fit, the engine downloads them itself as before (not
  resumable).
- The resumable download: one Range request per stretch of missing parts (`bytes=N-`, CORS-safelisted; one Hugging
  Face redirect per file on a good line). Every complete 8 MiB part goes to IndexedDB with the file's size and ETag
  (else Last-Modified); a reload continues at the first missing part, a dropped connection at the byte where it
  stopped. A 200 (Range ignored) is read from the start and saved by parts; a 206 that starts elsewhere is retried; a
  changed file (ETag or size) drops the parts (an ETag that changes twice in one call is then ignored, the size still
  counts). Retries after 1, 2, 4 ... 30 s; no byte for 30 s is a dead connection; offline (`navigator.onLine`, the
  'online' event, polled every 5 s for workers) waits instead of counting attempts; it gives up after 8 failed
  attempts in a row (an attempt that brought bytes is not a failure) and keeps the parts. 404 / 403 fail at once,
  408 / 429 / 5xx are retried. A cancel stops at once and keeps the parts. A newer call for the same URL in the same
  page (a job started again after a cancel) takes over the older one. Parts nobody touched for 14 days are dropped on
  the next download.
- Notes (`ProgressInfo.note`, absent while it simply downloads): 'Waiting for the internet connection…', 'Connection
  lost. Retrying in 8 s…' (a countdown), 'The download stalled. Retrying in …', 'The download server is busy (HTTP
  503). Retrying in …', 'Reconnecting…', 'Continuing the download (120 MB already saved)' (for 5 s after a resume,
  bytes of the whole model), 'Checking the downloaded file…' (the Qwen hash).
- Quota: `checkQuota` and the Qwen check count what is left to download (saved parts are already in the usage) plus
  the largest missing file once more: its parts and its Cache API copy exist side by side until the parts go.
- Errors are `ModelError` with `code` (`unknown-model`, `unsupported`, `quota`, `model-download`),
  `userMessage` and `technical`; a `CancelledError` passes through. `ignoreQuota: true` loads anyway
  (the files stream but are not kept, spike Q8). A download that gave up is `model-download`, with the
  downloader's `DownloadError` (`network`, `http`, `size`, `changed`, `storage`) in `technical`.
- `isCached` / `delete` read the Cache API bucket directly (keys are
  `https://huggingface.co/<repo>/resolve/main/<file>`), so they work on the page without loading the library.
- WebGPU dtype: fp16 needs `shader-f16`; without it tiny / base / small get the fp32 encoder + q4 decoder
  mix, the large models are refused (`unsupported`).

## Tests

`catalog.spec.ts` (cross-checks every repo and per-file size against `model-catalog.json`),
`ort-config.spec.ts` (the pin equals the installed `onnxruntime-web` and transformers' dependency; paths,
threads, dtype choice), `model-manager.spec.ts` (fake Cache API, fake storage estimate, a fake hub serving
ranges, fake loader), `qwen-files.spec.ts` and `resumable-download.spec.ts` (a fake server that drops connections,
ignores Range, sends a wrong Content-Range, stalls and changes the file; a fake network that goes offline; an
in-memory parts store, as jsdom has no IndexedDB; Node's Blob instead of jsdom's, which cannot be read back): run with `ng test --watch=false --include "**/engine/{asr,models}/*.spec.ts"`. Nothing is downloaded. The
browser check is described in `engine/asr/README.md`.

## Known limits

- A reload loses at most the 8 MiB part being filled. The ORT runtime (.wasm, 17-27 MB) is still fetched by ORT /
  Transformers.js itself, not resumably.
- `IndexedDbPartStore` runs in the browser check only (no IndexedDB in jsdom). Without IndexedDB, or when it is full,
  the parts of that call stay in memory: retries still continue, a reload does not.
- Two tabs downloading the same file at once each download it (the parts stay consistent: a part and its meta are one
  transaction, and a part missing at the end is fetched again).
- `requestPersistentStorage()` (`navigator.storage.persist()`, best effort) exists on pages only. The downloader calls
  it, but it runs in the worker, so the page should call it once (e.g. when the first job starts) for the browser to
  keep the models when the disk runs low.
- A file the Cache API refuses after the download (quota) is dropped from the parts and the engine fetches it again
  itself (not resumable); the quota check counts the peak so that this stays rare.
- The big models' WASM mixes and every no-`shader-f16` mix of medium and up were never run in a browser.
- jspi (16 MiB) worked on Chrome 155 only in the spike; asyncify stays the default until Firefox / Safari
  are tested. Both come from jsDelivr, so Cloudflare Pages' 25 MiB file limit does not apply.
