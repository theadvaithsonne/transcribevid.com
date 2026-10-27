# engine/asr - the in-browser Whisper engine

Whisper on `@huggingface/transformers` 4.3.1 (WASM or WebGPU) with its own decode loop, ported from the
spike's reference engine (`docs/in-browser/spike/asr.md`, "The reference worker API"). Pure TypeScript,
no Angular. The library is imported lazily in `load()`, so importing this folder costs nothing until a
model is loaded. Field names of `WindowResult` / `Segment` / `Word` are the spike's.

| File                         | What                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| `whisper-engine.ts`          | `WhisperEngine`: `load`, `detectLanguage`, `transcribeWindow`, `cancel`, `dispose`                      |
| `types.ts`                   | `LoadOptions`, `TranscribeOptions`, `WindowResult`, `Segment`, `Word`, `ProgressInfo`, `CancelledError` |
| `dsp.ts`                     | log-softmax, top-k, seeded sampling, median filter, DTW, compression ratio                              |
| `logits.ts`                  | token ids, the logit rules of one step (timestamps, suppress, repetition), language softmax             |
| `fallback.ts`                | temperature ladder decisions, `avg_logprob`, option defaults                                            |
| `segments.ts`                | timestamp tokens -> segments, the `consumedSeconds` seek rule, segment / word edge reconciliation       |
| `alignment.ts`               | word timing: cross-attention -> DTW, faster-whisper duration clean-up and punctuation merge             |
| `kv-rows.ts`                 | batch-row copies of KV-cache tensors (GPU buffer-to-buffer or typed arrays) for batched decoding        |
| `progress.ts`                | per-file `progress_callback` events -> whole-model progress                                             |
| `fixtures/reference-runs.ts` | recorded outputs of the reference engine (golden data of the specs)                                     |

## API

```ts
const engine = new WhisperEngine(); // optional arg: a loader of the transformers module (tests)
const info = await engine.load({ repo, device, dtype }, (p) => progress(p.loaded, p.total, p.file));
const lang = await engine.detectLanguage(window16k); // { language, probability, probabilities, noSpeechProb }
const r = await engine.transcribeWindow(window16k, {
  offsetSeconds: start,
  wordTimestamps: true,
  onPartial,
});
nextStart = start + r.consumedSeconds; // the seek loop: never jump a fixed 30 s
engine.cancel(); // the running call rejects with CancelledError (and reaches an attached aligner)
engine.batching = 'auto'; // default: beams share one decoder pass where that is exact ('never' / 'always')
await engine.dispose();

// large-v3 / distil-large-v3 (no `_timestamped` export): word timing from the turbo `_timestamped` model
const aligner = new WhisperEngine();
await manager.ensure('large-v3-turbo', 'webgpu', aligner, { gpu });
engine.attachAligner(aligner); // engine.hasWordTimestamps is now true
await engine.transcribeWindow(window16k, { wordTimestamps: true }); // words: aligner's times, own probabilities
```

With an aligner attached, after the window is decoded the aligner runs its own encoder and the teacher-forced
cross-attention pass over the transcribing model's text tokens (`alignExternal`, same tokenizer, head
`[sot, lang, task, notimestamps]`), so the word start / end are the turbo model's DTW times; each word's probability
is the mean of the transcribing model's own token probabilities of that decode (`textTokenProbabilities`: exp of the
processed-distribution log-probs, what CTranslate2 scores with). The pipeline (engine/worker) loads it lazily, only
for those two sizes and only with word timing on; if it cannot load, the job runs with per-line times and the
"not available" warning.

Normally `engine/models`' `ModelManager.ensure(id, device, engine)` calls `load()` (repo, dtype, ORT
runtime settings, quota). The ORT runtime must be configured before `load()` (`configureOrtRuntime`).

`transcribeWindow(audio, options)`: `audio` is 16 kHz mono `Float32Array`, 0.1-30 s. Options and defaults:

| Option                                                                 | Default                        | Notes                                                                                          |
| ---------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `language`                                                             | `null` = detect on this window | ISO code; unknown codes throw                                                                  |
| `task`                                                                 | `'transcribe'`                 | `'translate'` = to English                                                                     |
| `beamSize`                                                             | **1 (greedy)**                 | 5 = the server's beam search; all beams share one pass where exact (see "Batched decoding")    |
| `temperatures`                                                         | `[0, 0.2, 0.4, 0.6, 0.8, 1.0]` | the fallback ladder; `[0]` disables it                                                         |
| `bestOf`                                                               | 5                              | samples per temperature > 0                                                                    |
| `compressionRatioThreshold` / `logProbThreshold` / `noSpeechThreshold` | 2.4 / -1.0 / 0.6               | `null` disables a test; silence (no_speech > 0.6 with a low log-prob) is accepted, not retried |
| `prompt`                                                               | none                           | vocabulary hint or previous text: `<\|startofprev\|> prompt <\|sot\|>`, last 223 tokens        |
| `timestamps`                                                           | true                           | segment timestamp tokens                                                                       |
| `wordTimestamps`                                                       | false                          | the teacher-forced alignment pass (needs a `*_timestamped` repo)                               |
| `maxNewTokens`                                                         | 224 (cap 447)                  | per window                                                                                     |
| `repetitionPenalty` / `noRepeatNgramSize`                              | 1 / 0                          |                                                                                                |
| `seed`                                                                 | 1234                           | sampling PRNG                                                                                  |
| `offsetSeconds`                                                        | 0                              | added to every returned time                                                                   |
| `onPartial`, `partialIntervalMs`                                       | none, 150 ms                   | growing text while decoding                                                                    |
| `debugTokens`                                                          | false                          | `tokenLogprobs` in the result                                                                  |
| `alignPrefix`                                                          | `'notimestamps'`               | `'sot-lang-task'` = CTranslate2's prefix (first word scores low)                               |

Condition-on-previous-text = pass the previous window's text as `prompt` and restart at
`consumedSeconds` (with fixed windows WER went 2.9 % -> 18.9 % in the spike). Default off in the job runner.

`WindowResult`: `language`, `languageProbability`, `languageProbabilities` (top 5), `languageDetected`,
`noSpeechProb`, `text`, `segments`, `words`, `confidence`, `consumedSeconds`, `singleTimestampEnding`,
`avgLogprob`, `compressionRatio`, `temperature`, `fallbacks`, `tokens`, `tokenLogprobs?`, `timings`.
Each `Segment` carries `start`, `end`, `text`, `unfinished?`, `words` (`word`, `start`, `end`,
`probability`), `avgLogprob`, `noSpeechProb`, `compressionRatio`, `temperature`, `confidence`, `tokens`.

Cancel is cooperative: every cancel point (after features, after the encoder, every decoder step, every
temperature, before the alignment pass) first yields one macrotask (`MessageChannel`), so a `cancel`
message reaches the worker while ORT is busy; measured 20-47 ms in the spike. The encoder pass itself
cannot be interrupted (up to 24 s for small on one WASM thread): the worker host's hard cancel
(`terminate()` + reload from cache, 1.6-3.4 s) covers it. One call at a time per engine.

## Batched decoding

Beam search (`beamSize` 5) and best-of sampling (the ladder's temperatures > 0, `bestOf` 5) keep several hypotheses
per step. Each step runs all of them through the decoder as **one batch** (batch axis = hypothesis) instead of one
forward pass each:

- Self-attention cache: a hypothesis points at a row of a step's batched `present.*.decoder.*` output. The next
  step's input is built by copying rows (a beam can fork into two rows or die): on WebGPU buffer-to-buffer on the
  device onnxruntime-web runs on (`copyBufferToBuffer`, nothing goes through the CPU), on WASM typed-array copies
  (`kv-rows.ts`). Rows that already are the batch in order (greedy; sampling until a sample ends) pass as they are.
- Cross-attention KV: tiled once per window to the batch size. The ONNX graphs reshape it by batch x heads, so a
  batch-1 cross KV does not broadcast (measured: logits off by 11-22). The tiles cost memory, so the batch is capped
  by bytes: `GPU_BATCH_BYTES` 640 MiB (small 110.6 MB per row -> 5 rows; large-v3-turbo, distil 5; medium 2;
  large-v3 1 = one hypothesis per pass) and `WASM_BATCH_BYTES` 352 MiB; `maxBatchBytes` overrides. Hypotheses beyond
  the cap go in further chunks of the same step.
- The steps call the merged decoder session directly with `fetches` = logits + `present.*.decoder.*` instead of
  `model.forward`, which fetches every output: each layer's `cross_attentions` (a GPU readback each on WebGPU) and the
  cache branch's empty encoder placeholders are no longer copied out on every step. The word-timing pass fetches the
  logits and only the alignment heads' layers (small: 4 of 12) and now frees its `present.*` GPU buffers, which used
  to stay allocated after every window (~7 MB per window for small).
- Selection is unchanged: every row's logits go through the same rules in the same hypothesis order, so candidate
  order, tie-breaking, sampling draws and scores are those of the one-at-a-time loop.

**Exactness.** Batching may only be used where a batched row equals the row decoded alone. WebGPU fp16:
bit-identical (max logit difference 0 for every batch composition tried). WASM q8: **not**: the q8 export quantizes
activations per tensor at run time (`DynamicQuantizeLinear`, one scale for all rows), so a row's logits move by
0.27-0.97 when other rows share the batch (on the 95 s run below it turned "Kubernet's" into "Kubernetes" in one
window and changed timestamp tokens in another). So `batching: 'auto'` (default) never batches a q8 / int8 / uint8
decoder, and for any other dtype checks once per load, on the first multi-row step, that the batched rows equal the
rows decoded alone (`batchCheck`, tolerance 0.05 on raw logits); on a failure that step keeps its one-at-a-time
results and every later step decodes one hypothesis per pass. `'always'` forces batching (q8: faster, but the
results depend on the batch), `'never'` turns it off.

Measured with the perf bench (`<scratchpad>/perf`, see Tests): Chrome 155 headless, Ryzen 7 7730U with its Radeon
Vega 8 iGPU, `long5min` (English), small, beam 5 unless the row says otherwise, word timestamps on, default ladder,
cut at a pause, before / after interleaved because the machine is shared; decode = the sum of `decode@*`:

| Backend (audio)                     | Before: RTF, decode           | After: RTF, decode                | Decode speed-up | Same tokens / words | WER (excerpt)   |
| ----------------------------------- | ----------------------------- | --------------------------------- | --------------- | ------------------- | --------------- |
| WebGPU fp16 (119.3 s, 5 windows)    | 2.38, 270.7 s / 2.61, 296.2 s | 1.08, 114.7 s / 1.22, 129.8 s     | **2.28-2.36x**  | 5/5, 5/5 (both)     | 2.33 % = 2.33 % |
| same, final engine (series 2)       |                               | **0.97**, 103.4 s                 | 2.6-2.9x        | 5/5, 5/5            | 2.33 %          |
| WebGPU fp16, greedy (beam 1)        | 0.52, 49.9 s                  | 0.39, 34.5 s                      | 1.45x (fetches) | 5/5, 5/5            | 2.99 % = 2.99 % |
| WebGPU q4f16 turbo (68.4 s)         | 1.48, 68.9 s                  | 1.28, 54.6 s (not batched, below) | 1.26x (fetches) | 3/3, 3/3            | 3.68 % = 3.68 % |
| WASM q8, `auto` (95.6 s, 4 windows) | 2.35, 171.0 s                 | 2.07, 152.4 s                     | 1.12x (fetches) | 4/4, 4/4            | 2.95 % = 2.95 % |
| WASM q8, `'always'`, 3 rows         | 2.35, 171.0 s                 | 1.74, 122.2 s                     | 1.40x           | 3/4, 4/4            | 2.95 %          |
| WASM q8, `'always'`, 5 rows         | 2.35, 171.0 s                 | 1.87, 120.2 s                     | 1.42x           | 2/4, 3/4            | 2.53 %          |

WebGPU per step (small, 5 beams): five passes of ~85-125 ms became one pass of ~230-260 ms. What is left is the
cross KV: the fp16 / q4f16 decoders take fp32 KV inputs and `Cast` every `past_key_values.*` to fp16 outside their
`If` node on every step, for every row (~35-40 ms per extra row here; a batch-1 pass is ~85 ms). Memory: the tiles
add ~480 MB to the GPU process for small, about what the alignment-pass fix gives back (peak private bytes: before
3.0 GB, batched without the fix 3.5 GB, final 2.8 GB; greedy 2.7 -> 1.9 GB). WASM: every pass copies its CPU inputs
into the WASM heap (onnxruntime-web has no pinned inputs there; small's cross KV is 110 MB per row, 14 ms per copy)
and the attention reads them again, so batching only saves the fixed ~70 ms of a pass while 3-5 rows grow the
never-shrinking heap by 0.8-1.1 GB: not worth its changed results.

q4f16 (medium, large-v3-turbo, distil-large-v3.5, large-v3 on WebGPU): batched rows differ from single rows by up to
0.16 in the logits (fp16 accumulation in another kernel order, measured on turbo), so `auto` falls back to one
hypothesis per pass. Forcing it is not worth it either: with 20 heads x 1500 frames per row the per-row cast and
attention dominate, turbo's decode went 97.6 -> 88.5 s (1.10x, one window's tokens changed) and distil's
76.6 -> 69.4 s (every window changed, one lost its punctuation). large-v3 (491 MB of cross KV per row) never
batches under the cap.

Speed / accuracy of the options (final engine, same bench; WER on a TTS-voiced excerpt with a rough number
normaliser, so +-1-2 errors are noise; large-v3 / distil with the turbo aligner, as the pipeline runs them):

| Model, device (audio)                       | Beam 1: RTF, WER  | Beam 5: RTF, WER  |
| ------------------------------------------- | ----------------- | ----------------- |
| base fp16, WebGPU (119.3 s, 301 words)      | 0.16, 5.32 %      | 0.33, 5.32 %      |
| small fp16, WebGPU                          | 0.39, 2.99 %      | 0.97, 2.33 %      |
| large-v3-turbo q4f16, WebGPU                | 0.62, 3.32 %      | 1.25, 3.32 %      |
| distil-large-v3.5 q4f16 + aligner, WebGPU   | 0.84, 3.99 %      | 1.52, 3.32 %      |
| large-v3 q4f16 + aligner, WebGPU (68.4 s)   | 1.99, 3.68 %      | 5.47, 3.07 %      |
| base q8, WASM (95.6 s, 237 words)           | 0.34, 5.49 %      | 0.98, 3.38 %      |
| small q8, WASM                              | 0.82, 2.95 %      | 2.07, 2.95 %      |

## Tests

`ng test --watch=false --include "**/engine/{asr,models}/*.spec.ts"` (from `frontend/`). The specs never
download anything: DSP / DTW / alignment helpers, the logit rules, the fallback ladder, segment parsing,
the seek rule and edge reconciliation against the reference engine's recorded runs
(`fixtures/reference-runs.ts`, built by `scratch m3-asr/make-fixtures.mjs` from `scratch asr/results`), and
the whole decode loop (`whisper-engine.spec.ts`) against a scripted fake of Transformers.js (prompt
prefix, forced language, translate, maxNewTokens, the ladder on a loop, partials, cancel and reuse). The fake takes
batches like the real merged decoder (its cache is each row's token history; it throws on a cross KV or cache whose
batch is not the step's): batched beam search and best-of sampling give the same tokens, log-probs and scores as one
hypothesis per pass, chunking under a byte cap, the q8 rule, a batch-dependent model falling back with exactly the
unbatched result, the direct session path fetching only logits + cache, cancel mid-beam. `kv-rows.spec.ts` covers
the row copies (CPU, and the GPU path against a fake device).

Browser check (real models, headless Chrome, offline from the spike's replay cache), in the scratchpad:

```
cd <scratchpad>/m3-asr/check
node ../../asr/node_modules/vite/bin/vite.js build --config vite.config.mjs
node run.mjs          # tiny WASM q8 + base WebGPU fp16 on passage-b / passage-c -> ../results/check.json
```

It reports WER against `fixtures/texts/*.normalized.txt` (the harness normaliser), word count, the
difference to the spike's reference run (`qual-*-v2.json`), language detection, cancel latency and reuse.

Speed bench (real models in Chrome via Playwright, models cached in a Chrome profile, the pipeline's seek loop
without VAD over `long5min`), in the scratchpad: `cd <scratchpad>/perf; node build.mjs` (the repo's engine) and
`node build.mjs baseline` (the snapshot taken before batching), then
`node run.mjs --dist dist --device webgpu --model small --beam 5 --seconds 119.28 --tag x` and
`node compare.mjs <before tag> <after tag>` (RTF, decode / encoder / align time, windows with identical tokens and
words, WER, memory peaks). `series1.sh` / `series2.sh` are the runs quoted above.

## Known limits

- large-v3 and distil-large-v3 have no `*_timestamped` export: their word timing comes from the attached
  large-v3-turbo aligner (one more encoder pass per window, +564 MB download once). The server computes word times
  with the same model that transcribes; the browser's times come from turbo's alignment heads (faster-whisper's DTW
  rules, same tokens), not measured against the server yet (M6). Without the aligner, `words` stay empty and
  `confidence` falls back to `exp(avg_logprob)` as before.
- WebGPU: the GPU process grows across windows (not classified as pool or leak). Recycling the worker
  every 40 windows is the caller's job (engine/worker), not the engine's.
- Beam search on WASM q8 decodes one hypothesis per pass (batching would change its results, see "Batched
  decoding"): ~4-5x the greedy decode cost there.
- WebGPU decoders cast the fp32 KV inputs to fp16 on every step (the graph inputs are fp32), for every batch row:
  most of a batched step's cost. A load-time graph change to fp16 KV inputs / outputs would be exact (the values are
  fp16 inside already) and would also halve the cross-KV tiles, but it means rewriting the ONNX file before the
  session is created (engine/models).
- Without VAD in front, the ladder on noise costs 60-570 s per 30 s window and still emits "you": never
  feed silence or music (`asr.md` Q11).
- The fake-model spec checks the loop logic, not the numerics of a real model; the browser check does that.
