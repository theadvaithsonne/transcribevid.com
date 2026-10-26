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
| `beamSize`                                                             | **1 (greedy)**                 | 5 = the server's beam search (4-6x decode cost, no WER gain on the fixtures)                   |
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

## Tests

`ng test --watch=false --include "**/engine/{asr,models}/*.spec.ts"` (from `frontend/`). The specs never
download anything: DSP / DTW / alignment helpers, the logit rules, the fallback ladder, segment parsing,
the seek rule and edge reconciliation against the reference engine's recorded runs
(`fixtures/reference-runs.ts`, built by `scratch m3-asr/make-fixtures.mjs` from `scratch asr/results`), and
the whole decode loop (`whisper-engine.spec.ts`) against a scripted fake of Transformers.js (prompt
prefix, forced language, translate, maxNewTokens, the ladder on a loop, partials, cancel and reuse).

Browser check (real models, headless Chrome, offline from the spike's replay cache), in the scratchpad:

```
cd <scratchpad>/m3-asr/check
node ../../asr/node_modules/vite/bin/vite.js build --config vite.config.mjs
node run.mjs          # tiny WASM q8 + base WebGPU fp16 on passage-b / passage-c -> ../results/check.json
```

It reports WER against `fixtures/texts/*.normalized.txt` (the harness normaliser), word count, the
difference to the spike's reference run (`qual-*-v2.json`), language detection, cancel latency and reuse.

## Known limits

- large-v3 and distil-large-v3 have no `*_timestamped` export: their word timing comes from the attached
  large-v3-turbo aligner (one more encoder pass per window, +564 MB download once). The server computes word times
  with the same model that transcribes; the browser's times come from turbo's alignment heads (faster-whisper's DTW
  rules, same tokens), not measured against the server yet (M6). Without the aligner, `words` stay empty and
  `confidence` falls back to `exp(avg_logprob)` as before.
- WebGPU: the GPU process grows across windows (not classified as pool or leak). Recycling the worker
  every 40 windows is the caller's job (engine/worker), not the engine's.
- Beam search is sequential per hypothesis (no batching): 4-6x the greedy decode cost.
- Without VAD in front, the ladder on noise costs 60-570 s per 30 s window and still emits "you": never
  feed silence or music (`asr.md` Q11).
- The fake-model spec checks the loop logic, not the numerics of a real model; the browser check does that.
