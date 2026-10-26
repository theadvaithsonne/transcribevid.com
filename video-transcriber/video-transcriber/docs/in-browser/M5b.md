# M5b: full parity of the in-browser engine (not yet tested)

What M5b added on top of M4, where it lives, the pins and sizes, and the commands of the test pass (M6). Nothing was
run: no `ng test`, no build, no browser. `tsc --noEmit` is clean for `tsconfig.app.json` and `tsconfig.spec.json`.
No npm package was added.

## 1. Qwen3-ASR 0.6B / 1.7B in the browser

* **Engine** (`frontend/src/app/engine/qwen/`, README there): `QwenEngine` on `onnxruntime-web/webgpu` (the module
  Transformers.js uses, so one runtime and the same pinned jsDelivr wasm): log-mel with a mixed-radix FFT ->
  fp16 audio encoder -> prompt as embeddings (int8 table x scale, audio pads replaced by the encoder output, system
  context = the vocabulary hint, `language X<asr_text>` when a language is chosen) -> fused GQA decoder with a
  GPU-resident KV cache, greedy to 512 tokens, every superseded KV tensor disposed, cancel checked at every step ->
  Transformers.js `Qwen2Tokenizer` (built from the pinned, hash-checked tokenizer files) -> qwen_asr
  `parse_asr_output` (with its repetition guard).
* **Adapter** (`qwen-chunks.ts`, `qwen-text.ts`): the spike's verified port of qwen_engine.py: chunks from
  `StreamingVad(QWEN_VAD)` + `planWindows(QWEN_PLAN)` (checked equal to the literal `chunks()` port on 2,000 random
  speech maps), 2 s overlap on forced cuts, exact >= 3-word trim or one retry (`boundary_retry`), `repeated_phrase`,
  `recognition_text` / `original_text` / `overlap_recognition_text` / `overlap_words_removed` /
  `boundary_resolution`, chunk timing, `words: null`, `confidence: null`, `language_probability: null`, 0.5 s pad.
* **Pipeline** (`engine/worker/qwen-pipeline.ts`): chosen by `options.engine === 'qwen'`; translate refused with the
  server's sentence; silent file = no segments and no model load; the model loads after the plan (as the server);
  one `segments` event per chunk with `romanizeLanguage` = `detected or language`, which the job runner uses for the
  Hinglish step (Hindi output goes into the same IndicXlit path as on the server); recycle every 40 chunks on WebGPU
  with the loop state carried over.
* **Options** (`engine/jobs/options.ts`): schemas.py's Qwen rules (translate -> "Select Whisper for English
  translation.", a language outside the 30 -> "This language is not supported by the Qwen adapter."); the M4
  refusal is gone. `tl` goes to the model as "Filipino" (the server's "Tagalog" fails in qwen_asr; qwen.md 4).
* **Gate**: engine/device's table already offered Qwen only on `desktop-webgpu-f16-8gb`. Elsewhere the pickers and
  the job runner's 422 say "Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge)." (plus "and 8 GB of
  memory." / "and 16-bit shader support ..." where that is the plan's reason): `engine/qwen/qwen-capability.ts`,
  used by `BrowserTransport.models()` and `EngineDevice.gate()`. The M4 placeholder reason is replaced
  (`QWEN_BROWSER_REASON` now equals the new sentence).
* **Models** (`engine/models/qwen-catalog.ts`, `qwen-files.ts`, `ModelManager.ensureQwen`): pinned commits, every
  file's size and SHA-256 (Hub tree API 2026-10-26; small JSON files hashed from the spike's downloads, whose git blob
  ids equal the tree's); download with byte progress, SHA-256 while streaming (`sha256.ts`, no second 1 GB copy),
  size / hash mismatch refused, kept in 'transformers-cache' (so "delete the downloaded models" removes them),
  `isCached` / `delete` (by exact URL: the decoder repo is shared) / `cachedModels` know them.

| Model | Files (repo @ commit) | Bytes |
|---|---|---|
| Qwen3 ASR 0.6B | `jiangzhuo9357/Qwen3-ASR-0.6B-ONNX@4a01b95fafe2c9e3af77e33c18bbb7de349c62f6`: prompt_config.json 2,578, mel_filters.json 132,427, tokenizer.json 11,429,377, tokenizer_config.json 12,488, embed_tokens.int8.bin 155,582,464, embed_scales.f32.bin 607,744, encoder.fp16.onnx 376,261,247; `sorryhyun/qwen3-asr-onnx-gqa@075249f70b56cdded1cf4b189cbdde0fb77aeec1`: decoder-0.6b-fp16.onnx 302,915 + .data 352,190,464 | **896,521,704** |
| Qwen3 ASR 1.7B | `jiangzhuo9357/Qwen3-ASR-1.7B-ONNX@fcc238dfdc95cdcccaa9a7e2c7f5abc2f94f44a7`: same four small files, embed_tokens.int8.bin 311,164,928, embed_scales.f32.bin 607,744, encoder.fp16.onnx 639,098,881; gqa repo: decoder-1.7b-fp16.onnx 303,131 + .data 984,809,472 | **1,947,561,026** |

SHA-256 of every file: `qwen-catalog.ts`. The picker shows 897 MB / 1948 MB.

## 2. Word timing and confidence for large-v3 and distil-large-v3

* `WhisperEngine.attachAligner(aligner)` / `alignExternal()` (engine/asr): after a window is decoded, the aligner (a
  second WhisperEngine with `onnx-community/whisper-large-v3-turbo_timestamped`, same tokenizer) runs its encoder and
  the existing teacher-forced cross-attention + DTW pass (`alignWords`) over the transcribing model's text tokens, head
  `[sot, lang, task, notimestamps]`: word start / end. Word probability = the transcribing model's own token
  probabilities of that decode (`textTokenProbabilities`, replacing the aligner's in `alignWords`). Everything after
  that (segment edges, the seek rule on the last word, the hallucination-silence guard, confidence, exports) is the
  same code as for the sizes with their own timing.
* Catalog: `aligner: 'large-v3-turbo'` on large-v3 and distil-large-v3 (`alignerOf`). The worker loads it lazily,
  only for those two sizes, only with word timing on, after the main model (one download bar continuing across both);
  if it cannot load, the job keeps per-line times and the old warning.
* Picker: "Word timing: first time only, also downloads the 564 MB word-timing model." until it is cached, then no
  note (the "not available for this size" note is gone where the aligner runs).

## 3. ffmpeg.wasm fallback

* `engine/audio/ffmpeg.ts`: `@ffmpeg/core` 0.12.10 (single thread; `ffmpeg-core.js` 111,804 B sha256
  `67a48f11...dcae3`, `ffmpeg-core.wasm` 32,232,419 B sha256 `9f57947a...6b7b7`, ~9.3 MB on the wire) from
  `https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/`, verified, instantiated from the bytes (blob: module
  + `wasmBinary`) inside the engine / decode worker. `@ffmpeg/ffmpeg`'s class worker is not used (it would have to
  start from a cross-origin URL, which browsers refuse, and WORKERFS needs a worker anyway); the calls are those of its
  0.12.15 worker. WORKERFS mount, the Python engine's exact command (`-vn -map 0:a:0? -af highpass=f=70,lowpass=
  f=7800,dynaudnorm=f=200:g=11:p=0.9 -ac 1 -ar 16000 -f f32le`), 30 min segments with 6 s discarded overlap above
  36 min, Int16 packing / onChunk / progress like the other decoders, error classes, `CONVERTER_UNAVAILABLE`.
* `decodeMedia`: the converter is the last decoder, tried after NOT_MEDIA / UNSUPPORTED_CODEC / NO_WEBCODECS /
  DECODE_FAILED / TOO_LARGE, only with `ffmpeg` set and only in a worker. That covers AVI, WMA / WMV, FLV, MPG,
  AMR / 3GP-AMR, GSM, AIFF / AU / CAF, Speex, ALAC, AC-3 / E-AC-3 / DTS (mediabunny's MPL extensions are still not
  added).
* Consent: `core/transport/converter-consent.ts` (`CONVERTER_PROMPT` = "This file needs a 9 MB converter that runs
  in your browser. Load it?"). The upload page probes the chosen files when Transcribe is pressed
  (`EngineDevice.needsConverter`) and asks once with `window.confirm`; a yes is remembered in localStorage (Delete my
  data forgets it), a no for the visit. `EngineDevice.workerPlan()` passes `converter: true` to the worker.
* Licences: `docs/in-browser/LICENCES.md` (GPL-2.0-or-later, corresponding source at
  `https://github.com/ffmpegwasm/ffmpeg.wasm/tree/v0.12.10`, written offer; Qwen Apache-2.0 attribution) and the
  constant **`THIRD_PARTY_NOTICES`** (`frontend/src/app/engine/models/licences.ts`, also `FFMPEG_NOTICE`,
  `QWEN_NOTICE`) for the M5 agent's licences / legal page. No legal page was edited.

## 4. The M4 gaps

* **(a) Player for files the browser cannot play**: `Transport.mediaPreview?(id)` (browser only): for a finished job
  whose file cannot play (.mkv, .avi, .wma, .mov outside Safari ...), the stored file is decoded again in the decode
  worker without the clean-up filters and streamed into a 16 kHz mono 16-bit WAV Blob (`engine/audio/wav.ts`,
  `preview.ts`; 1 MiB parts, never one big array) -> object URL, once per job and visit; `getJob()` then carries it
  as `media_url`. The job page asks for it after loading a finished job and shows it as an audio player
  (`audioPreview`), also for video files, like the server's preview.mp3. Playable files answer with their own URL.
* **(b) Low-memory devices** (`deviceMemory <= 4` reported, or a phone / tablet that does not report it):
  `plan.lowMemory` -> the Whisper pipeline decodes with `collect: false` into `StreamingTimeline`
  (`engine/worker/timeline.ts`): only VAD-confirmed speech from the current window on is kept (Float32), the seek loop
  runs while the file decodes, the decoder waits while more than 150 s are buffered. Same windows and segments as the
  whole-file path (spec), with a 3 s look-ahead so the hallucination guard's end-of-content test answers alike. A
  WebGPU recycle hands over no PCM: the fresh worker decodes (and VADs) again and skips to its seek.
* **(c) Model loaded in parallel with decoding**: the Whisper pipeline starts `ensureModel` (and the aligner) before
  decoding, waits for it in `loading_model` (a cancel returns at once). Qwen keeps the server's order (after the plan).
  If a run ends while that load still runs (no speech, a decode error, a cancel), the worker answers with
  `restart: true` and `WorkerClient` replaces the worker. Silent files no longer wait for the model (the server waits
  for it; the result is the same, empty).

## Files

New: `engine/qwen/{casefold-extras,half,qwen-capability,qwen-chunks,qwen-engine,qwen-languages,qwen-mel,qwen-text,index}.ts`
+ README + specs `{qwen-text,qwen-chunks,qwen-mel,qwen-engine}.spec.ts`; `engine/models/{qwen-catalog,qwen-files,sha256,licences}.ts`
+ `qwen-files.spec.ts`; `engine/audio/{ffmpeg,wav,preview}.ts` + `{ffmpeg,wav}.spec.ts`;
`engine/worker/{pipeline-common,qwen-pipeline,timeline}.ts` + `{qwen-pipeline,timeline}.spec.ts`;
`core/transport/converter-consent.ts` + `browser-transport.m5b.spec.ts`; `docs/in-browser/{LICENCES,M5b}.md`.

Changed: `engine/asr/whisper-engine.ts` (+spec, README), `engine/models/{catalog,model-manager}.ts` (README),
`engine/audio/{index,types,errors}.ts` (README), `engine/worker/{pipeline,protocol,worker-core,worker-client}.ts`
(+ pipeline / worker-client specs), `engine/jobs/{options,job-runner}.ts` (+spec),
`core/transport/{transport,browser-transport,browser-engine,engine-device}.ts`, `features/upload/upload.ts` (consent
before Transcribe, Qwen reason wording), `features/job/job.ts` (WAV player). No template changed: the pickers already
render `reason`, `size_mb` and `word_timing_note`, the player already follows `hasVideo()`.

## Test commands (M6)

From `frontend/`:

```
npx tsc --noEmit -p tsconfig.app.json
npx tsc --noEmit -p tsconfig.spec.json
npx ngc -p tsconfig.app.json --noEmit
npx ng test --watch=false --include "**/engine/qwen/*.spec.ts"
npx ng test --watch=false --include "**/engine/{models,asr,audio}/*.spec.ts"
npx ng test --watch=false --include "**/engine/{worker,jobs}/*.spec.ts"
npx ng test --watch=false --include "**/core/transport/*.spec.ts"
npx ng test --watch=false
npx ng build --configuration production
```

Then in Chrome / Edge on a WebGPU laptop (`ng serve --configuration production`):

1. Qwen 0.6B and 1.7B on the spike's FLEURS English and Hindi clips: text equals the spike's harness, Hindi through
   Hinglish, chunk times, review reasons; cancel during the decode loop; a > 40-chunk file (recycle); Delete my data
   with models (the Qwen entries leave 'transformers-cache'); the fused decoder's input / output names on the 1.7B.
2. large-v3 and distil-large-v3 with word timing: words and confidence underlines appear; compare the word times
   with the server's on passage-a (expect differences of a few tens of ms, turbo's heads vs the model's own).
3. ffmpeg: AVI, WMA, FLV, AMR, AIFF, AC-3 from `frontend/fixtures/audio` -> the question once, then the same text as
   the server; "no" -> the convert-first error; offline -> CONVERTER_UNAVAILABLE.
4. Player: an .mkv and an .avi job show an audio player after "done"; seeking follows the transcript.
5. Low-memory: force `lowMemory: true` (EngineDevice.workerPlan) and compare a 30-minute file with the whole-file run.
6. Parallel load: with the model cached, the transcript starts right after decoding (no separate model-load wait);
   on a first visit the download runs during decoding and the "loading model" line shows what is left.

## Not done / open

* Never run anywhere (owner rule for M3-M5b); the browser checks above are the proof still owed.
* Qwen without `shader-f16` (the export's split q4 decoders, 1.3 / 2.7 GB): not wired; the device plan does not offer
  Qwen there anyway. No warm-up decode at load, no chunk batching, no GPU-side argmax (qwen.md section 6 options).
* `@mediabunny/ac3` / `@mediabunny/dts` (MPL, 0.24 / 0.32 MB) not added: AC-3 / DTS need the GPL converter for now.
* CSP: none is set today; if M5 adds one it needs `blob:` and `https://cdn.jsdelivr.net` in `script-src`, `worker-src
  'self' blob:`, `connect-src` for jsDelivr and `https://huggingface.co https://*.hf.co` (LICENCES.md).
* The consent question uses the browser's `confirm()` (no template change was allowed); a styled dialog is M5's call.
* docs/in-browser/PROGRESS.md was not edited (the M5b row is the coordinator's).
* The low-memory resume after a WebGPU recycle repeats the decode and the VAD up to the resume point (correct, a few
  seconds per hour of audio).
