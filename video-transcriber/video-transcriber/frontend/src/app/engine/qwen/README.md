# engine/qwen - Qwen3-ASR 0.6B / 1.7B in the browser

backend/app/qwen_engine.py on onnxruntime-web WebGPU (docs/in-browser/spike/qwen.md: decision section 0, the
adapter section 4, the harness contract Appendix B). Pure TypeScript, no Angular. The worker pipeline
(engine/worker/qwen-pipeline.ts) selects it with `options.engine === 'qwen'`; the device plan (engine/device) offers it
only on a desktop with WebGPU + `shader-f16` and 8 GB (row `desktop-webgpu-f16-8gb`), everywhere else the pickers show
it disabled with `qwenReason()` ("Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).").

| File | What |
|---|---|
| `qwen-engine.ts` | `QwenEngine`: `load(files, entry)`, `transcribeChunk(audio, { language, context, onPartial })`, `cancel`, `dispose` |
| `qwen-chunks.ts` | `planChunks` (literal port of `chunks()`), `chunksFromWindows` (engine/vad QWEN_PLAN windows -> chunks), `transcribeChunks` (the per-chunk loop: overlap trim, one retry, review reasons, the server's segment dict, recycle state), `padChunk` |
| `qwen-text.ts` | `tokenKey`, `trimOverlap`, `repeatedPhrase` (qwen_engine) and `detectAndFixRepetitions`, `parseAsrOutput` (qwen_asr, Apache-2.0) |
| `casefold-extras.ts` | the 324 code points where Python's `casefold()` differs from `toLowerCase()` (generated) |
| `qwen-mel.ts` | log-mel features (WhisperFeatureExtractor recipe, variable length) with a mixed-radix FFT; `audioTokenCount` |
| `qwen-languages.ts` | the adapter's 30 codes, their Qwen names (`tl` -> Filipino, `yue` -> Cantonese fixed), name -> code |
| `qwen-capability.ts` | the picker reasons (`QWEN_DEVICE_REASON`, `qwenReason`) and the integrated-GPU speed note |
| `half.ts` | fp16 bits <-> float, argmax over fp16 / fp32 logits |

Models: `engine/models/qwen-catalog.ts` (pinned repos and commits, sizes, SHA-256) and `qwen-files.ts` (download with
progress, hash while streaming, Cache API 'transformers-cache'); `ModelManager.ensureQwen` puts them together.

## The model pass (one chunk)

`padChunk` (0.5 s minimum) -> `logMel` -> `encoder.fp16.onnx` (`mel [1,128,T]` -> `audio_features [1,A,H]`) -> prompt
ids `<|im_start|>system\n{context}<|im_end|>\n<|im_start|>user\n<|audio_start|>` + A x `<|audio_pad|>` +
`<|audio_end|><|im_end|>\n<|im_start|>assistant\n` (+ `language X<asr_text>` when the user chose a language) ->
embeddings (int8 row x scale -> fp16; the pad rows replaced by the audio features) -> fused GQA decoder
(`inputs_embeds`, `attention_mask`, `past_key_values.{i}.key/value` empty at prefill; `present.*` kept on the GPU,
the superseded ones disposed every step) -> greedy until `<|endoftext|>` / `<|im_end|>` or 512 new tokens ->
`tokenizer.decode(skip_special_tokens)` -> `parseAsrOutput`. The tokenizer is Transformers.js's `Qwen2Tokenizer`
built from the pinned, hash-checked `tokenizer.json` + `tokenizer_config.json` (what `AutoTokenizer.from_pretrained`
does after its own unverified fetch of `main`).

## Parity with the server (qwen_engine.py)

Same: 25 s chunks from Silero VAD (300 ms pauses, 100 ms pad, threshold 0.5), cut at the last pause after 60 % of
the window, gaps of 2 s or more skipped, overlap only on forced cuts (2 s or a quarter of the chunk), exact >= 3-word
overlap trim or one retry of the non-overlapping audio (`boundary_retry`), `repeated_phrase`, `recognition_text`,
`original_text`, `overlap_recognition_text`, `overlap_words_removed`, `boundary_resolution`, `timing: 'chunk'`,
`words: null`, `confidence: null`, `language_probability: null`, the job language = forced or first detected,
Hinglish for chunks detected (or forced) as Hindi / English, context = the vocabulary hint, translate refused, silent
file = no segments and no model load, cancel between chunks and after each inference (plus every decoder step).

Differences, on purpose: `tl` is passed as "Filipino" (the server passes "Tagalog", which qwen_asr rejects) and a
detected "Filipino" maps back to `tl`; the model runs on WebGPU with q4f16 weights (fused decoder), not PyTorch
fp16/fp32 (the spike measured the same text class, one punctuation token apart on English); per-step cancel; the
Hinglish step runs on the page (the worker tags each segment with its language).

## Tests

`ng test --watch=false --include "**/engine/qwen/*.spec.ts"` (plus `engine/models/qwen-files.spec.ts`,
`engine/worker/qwen-pipeline.spec.ts`). The specs never download: the text rules and the loop are the Python tests'
assertions; `planWindows(QWEN_PLAN)` is checked against the literal port on 2,000 random speech maps; the mel / FFT
against a naive DFT; the engine against a scripted onnxruntime (prompt layout, embeddings, KV growth and disposal,
forced language, 0.5 s pad, max tokens, cancel).

## Known limits

- Only the q4f16 route (needs `shader-f16`); adapters without it get the reason, as the device plan says. The split
  q4 decoders of the export (any WebGPU adapter, 1.3 / 2.7 GB) are not wired in.
- No warm-up decode at load: the first chunk pays the shader compilation (2-5 s, qwen.md 3.2).
- No batching of chunks (the main speed lever on dispatch-bound GPUs, qwen.md section 6) and no GPU-side argmax.
- Never run in a browser by this milestone: the browser check (M6) must confirm the input / output names of the
  fused decoder for the 1.7B, the zero-length past-KV seeds on non-D3D12 backends, and memory over long files.
