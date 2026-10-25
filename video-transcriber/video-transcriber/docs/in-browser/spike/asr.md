# Spike: Whisper in Transformers.js 4.3.1 - what works in a real browser

Track `asr-capabilities` (finished by `asr-finish`). Everything below was **measured** in Chrome 155 (`channel: 'chrome'`, headless)
on the development machine (Ryzen 7 7730U 8C/16T, 15 GB RAM, AMD Radeon RDNA-2 iGPU, Windows 11) with
`@huggingface/transformers@4.3.1` (onnxruntime-web `1.31.0-dev.20260914-8d85527a0`), against the SAPI fixtures in
`frontend/fixtures` and the Python engine (`faster-whisper 1.2.1`, the kwargs of `backend/app/engine.py`) as the reference.
Every number names the raw result file it comes from. The harness, the raw results and the reference worker live in
`C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/asr/`
(`results/`, `exp/`, `driver/`, `harness/`, `reference/`; paths below are relative to it). Model sizes and the per-model
numbers are in `model-catalog.json` next to this file.

**Verdict: go, with changes.** Whisper tiny / base / small run on WASM and WebGPU and match the Python engine (same words,
word starts within 0.00-0.02 s median, word probabilities within 0.002-0.04 mean, `results/parity.json`). But the library only
gives the plumbing (download, cache, features, encoder/decoder sessions, greedy decode, streaming). Everything the app's
quality depends on - language detection, `no_speech_prob`, `avg_logprob`, per-word probability, beam search, temperature
fallback, prompt, cancel, correct word timestamps - is missing or broken in 4.3.1 and is re-implemented in the reference
worker (`reference/src/engine.ts`, 960 lines TypeScript, type-checks with `tsc --strict`, builds with Vite, passes its smoke
test on WASM and WebGPU - section "Reference worker"). Not proven here: medium / large-v3-turbo / large-v3 / distil-large-v3
(sizes only), Hinglish, phones, and real network downloads (everything ran from a replay cache).

## Capability matrix

| Feature (app today) | Browser? | How | Caveat / evidence |
|---|---|---|---|
| Whisper tiny / base / small, WASM | yes | `WhisperForConditionalGeneration` `device:'wasm'`, dtype q8 | 1 thread unless cross-origin isolated; small is slower than real time on 1 thread (reference RTF 1.5-2.0, `qual-small-wasm-q8*.json`) |
| Same, WebGPU | yes, headless too | `device:'webgpu'`, `dtype:{encoder_model:'fp16', decoder_model_merged:'fp16'|'q4f16'}` | needs a secure context and `shader-f16` (else fp32 encoder + q4 decoder); decoder step 32-134 ms on this iGPU (`bench-*.json`) |
| medium / large-v3-turbo / large-v3 / distil-large-v3 | **not measured** | repos and sizes in `model-catalog.json` | q4f16 downloads 517 / 564 / 980 / 534 MB; large-v3 and distil have no `_timestamped` export (no word timestamps) |
| Segment timestamps with our own <=30 s windows | yes | timestamp tokens, caller adds the window offset | 4.3.1 processor lacks two OpenAI rules; `decode(decode_with_timestamps)` throws; reference re-implements (`q2-windows-*.json`) |
| Word timestamps | yes, WASM + WebGPU | `*_timestamped` repo + reference alignment pass (DTW on cross-attention) | built-in `return_timestamps:'word'` ignores `num_frames`: last word ended 28.18 s on a 22.74 s clip (`q3-builtin-tiny-wasm.json`) |
| Per-word confidence | yes, **custom** | mean token probability per word from the alignment pass | library returns no scores (`q4-scores-*.json`); mean |diff| vs Python 0.002-0.041 (`parity.json`) |
| `avg_logprob`, `no_speech_prob`, compression ratio | yes, **custom** | log-softmax of processed logits; P(`<|nospeech|>`) at SOT; `CompressionStream` | identical formulas; e.g. base passage-b avg_logprob -0.116 vs Python -0.119 (`parity.json`) |
| Language auto-detect with probabilities | yes, **custom** | one decoder step over the language tokens | `pipeline()`/`generate()` default to English silently; fr/ja/ru/en right on all 3 models, bn 2 of 3, af 0 of 3 (`q5-lang-*.json`) |
| Language picker + translate | yes | `language` / `task:'translate'` | verified fr/ja/ru/bn (`q5-lang-*.json`) |
| Beam search (beam 5) | **not in the library**, yes in reference | `num_beams` is ignored (identical tokens for 1/2/5, `q6a-builtin-*.json`); reference decodes hypotheses sequentially | 4.0-6.3x decode cost, no WER gain on the fixtures, tiny q8 + beam got worse (`qual-tiny-wasm-q8.json`) |
| Temperature fallback / best_of | yes, **custom** | faster-whisper ladder re-implemented | stopped a real loop (`q6b-reference-base-wasm.json`); on noise the ladder costs 60-570 s per 30 s window (`q11-*.json`) |
| Repetition / hallucination guards | yes | `no_repeat_ngram_size`, `repetition_penalty`, ratio > 2.4, logprob < -1, no_speech > 0.6 | both processors work in `generate()` and in the reference; **not a VAD replacement** (section Q11) |
| Vocabulary prompt | yes, **custom** | `<|startofprev|> prompt <|sot|>` as `decoder_input_ids` | `prompt_ids` kwarg is ignored (`q6a-builtin-base-wasm.json`); "Covernets" -> "Kubernetes" |
| Condition on previous text | yes, needs the seek loop | prompt = previous text, restart at `consumedSeconds` | with fixed windows WER 2.9 % -> 18.9 % (`q6b-reference-base-wasm.json`) |
| Streaming live text | yes | `WhisperTextStreamer`, or `onPartial` in the reference | first text 0.65-5.0 s after the call depending on model/device (`q7-*.json`) |
| Cancel | yes, **after a fix made in this track** | reference `cancel()` now yields a macrotask between decoder steps | `stopping_criteria` and `interrupt` are ignored by `generate()`; before the fix the reference cancel was starved too (`q7-ref-rerun-tiny-wasm.json`), after it: 20-47 ms (`q7-ref-rerun2-*.json`); hard cancel = `worker.terminate()` + reload 1.6-3.2 s |
| Re-transcribe, queue, microphone | engine-agnostic | 16 kHz mono `Float32Array` in, model loaded once per worker | - |
| Model cache / offline / delete | yes | Cache API `transformers-cache`; `ModelRegistry.is_cached` / `clear_cache` | `persist()` denied in headless (`q8-cache.json`); per-file resume only, no byte-range resume; ORT wasm cached separately |
| Hosting the ORT runtime | yes | `env.backends.onnx.wasm.wasmPaths` | default asyncify wasm is 25.62 MiB (Cloudflare Pages limit 25 MiB per file); jspi (16.03 MiB) works on Chrome for WASM and WebGPU (`q9-runtime.json`) |
| Threads | only with COOP/COEP | 4 threads when isolated | not isolated: `numThreads` forced to 1 whatever is asked (`q9-runtime.json`) |
| Angular / esbuild bundling | yes | `platform:'browser'`, `format:'esm'`, worker 576 KiB | `platform:'node'` pulls 14 node modules (`q9b-esbuild.json`) |
| Hinglish / IndicXlit, Qwen3-ASR | not covered here | other tracks | - |

## Method and trust

* Fixtures: `passage-a` (73 s, 174 normalised words), `passage-b` (22.7 s, 63), `passage-c` (7.0 s, 18), `speech-silence-speech`
  (speech 0-6.96 s, silence, speech 26.96-49.70 s), `silence-30s`, `noise-pink-30s`, `music-like-30s`, `tone-1k`, five foreign clips
  and a JFK clip from the `Xenova/transformers.js-docs` dataset. Decoded with the repo's ffmpeg to 16 kHz mono float32.
* Windows for passage-a are packed from speech between pauses >= 0.7 s into <= 28 s windows (3 windows), as a VAD planner would.
* **WER** = word Levenshtein on text normalised like `fixtures/texts/*.normalized.txt`; the same code scores the Python output.
* **Word timing truth** = SAPI pauses (~0.4 s after commas, ~0.85 s after sentences) found with a 10 ms RMS detector and matched to the
  punctuation (passage-b 8 anchors, passage-a 27). A word boundary is scored against the pause edge next to it (`driver/anchors.mjs`).
* **Timing numbers move with machine load** (the machine was shared with other agents). Every bench stores a CPU calibration
  (`calibMs`, 91-208 ms in the quoted runs, 476-596 ms in two tiny WebGPU runs that are therefore not used for speed). Quality numbers
  do not depend on load. Nothing was downloaded during the measured runs: model and runtime files came from the record/replay cache,
  so network speed is not measured.
* Python reference: `py/fw_ref.py` (faster-whisper 1.2.1 int8 CPU, beam 5, the app's kwargs) -> `results/fw/*.json`.

## The 12 questions

### Q1 - v4 API shape (`results/q01-api.json`)

Two ways in, both verified: `pipeline('automatic-speech-recognition', repo, {device, dtype, session_options, progress_callback})`
and the low level `AutoTokenizer` + `AutoProcessor` (`WhisperProcessor` -> log-mel `[1,80,3000]`, pads/truncates to 30 s) +
`WhisperForConditionalGeneration.from_pretrained(repo, {device, dtype, session_options, progress_callback})`, then
`model.generate({inputs, language, task, return_timestamps, streamer, ...})` or `model.forward({encoder_outputs, decoder_input_ids,
past_key_values})` for one decoder step (what the reference uses).

* `device`: `'wasm'` (browser default), `'webgpu'`, plus `auto/gpu/cpu/webnn*`. `dtype`: a string or an object keyed by ONNX file stem
  (`encoder_model`, `decoder_model_merged`) -> `fp32`, `fp16`, `q8`, `q4`, `q4f16`, `int8`, `uint8`, `bnb4`. Defaults: WASM -> q8, WebGPU ->
  **fp32** (a WebGPU load without `dtype` pulls 152 MB for tiny and 968 MB for small). fp16 on WebGPU throws without `shader-f16`.
  Verified on tiny: wasm q8, wasm fp32/q4, webgpu fp32/q4, webgpu default.
* `progress_callback` payloads: per file `initiate` -> `download` -> `progress {progress, loaded, total}` -> `done`; `pipeline()` adds
  `progress_total` (total known up-front from a `Range: bytes=0-0` request per file) and `ready`. `from_pretrained` alone has no total,
  so the reference builds one from `ModelRegistry.get_files()` + `get_file_metadata()` (`q7-ref-rerun2-tiny-wasm.json`: 255 events, total
  43,596,876 bytes known from the first event).
* `session_options` pass through (`graphOptimizationLevel` all / basic / disabled loaded tiny in 4.6 / 3.8 / 2.8 s from cache). On WebGPU
  the library sets `preferredOutputLocation` of the decoder's `present*` to `gpu-buffer` (KV cache stays on the GPU).
* `generate()` returns a `Tensor` of ids **including** the prefix; timestamp tokens survive `skip_special_tokens`, so drop ids >=
  `timestamp_begin` before decoding. `return_dict_in_generate` gives `{sequences, past_key_values}` and nothing else.
* `env` defaults: `useBrowserCache:true`, `useWasmCache:true`, `cacheKey:'transformers-cache'`, wasm files from jsDelivr
  (`ort-wasm-simd-threaded.asyncify.*`). `env.backends.onnx` is a shallow copy of ORT's env: set `.wasm.*` / `.webgpu.*` on it.
* v3 -> v4: onnxruntime-web 1.22 -> 1.31 (WebGPU bundle), `useWasmCache`, `progress_total`, `ModelRegistry`, Whisper seek loop
  (`_generate_with_seek`), tokenizers in `@huggingface/tokenizers`. Still `TODO` in the source: beam search, language detection, scores.
  New breakages found at run time: `stopping_criteria` dropped by Whisper `generate()`; `return_dict_in_generate` + `return_timestamps`
  without `max_new_tokens` crashes (`reading 'tolist'`); `decode(..., {decode_with_timestamps:true})` throws when two timestamps are adjacent;
  `num_frames` ignored on the word-timestamp seek path.

### Q2 - Segment timestamps with our own 30 s windows (`results/q2-windows-{tiny-wasm,base-wasm,small-webgpu}.json`)

Handing the whole 49.7 s file to the pipeline (`chunk_length_s:30, stride_length_s:5`) gave chunks like `[0,10]` for a 7 s sentence and
a hallucinated `" Thank you."` at `[49,50]`. Feeding VAD-chosen windows `[0,7.2]` and `[26.7,49.7]` to the reference and adding the offset:

| model | window 1 | window 2 segments (absolute s) | words outside the +-0.5 s timeline |
|---|---|---|---|
| tiny q8 WASM | `[0, 6.30]` | `[26.7-28.52] [28.98-33.1] [34.0-38.64] [39.5-40.86] [41.74-48.96]` | 0 |
| base q8 WASM | `[0, 6.14]` | `[26.7-28.2] [29.12-32.88] [33.8-38.36] [39.16-40.68] [41.42-48.84]` | 0 |

Rules that make it correct: (1) a window is at most 30 s (`processor()` truncates longer input silently, pads shorter); times are
window-relative; (2) do not feed long silence: one 30 s window with 6.9 s speech + 23 s silence made tiny end the segment at 10.0 s and a
silence-only window gives `"you"` with `no_speech_prob` 0.92-0.95; (3) **seek, do not jump**: the reference returns `consumedSeconds` /
`singleTimestampEnding` with faster-whisper's rule, and the next window must start at `start + consumedSeconds` (window `[27.4,37.0]` cut
mid-sentence -> `consumedSeconds 6.0`, last segment `unfinished`); (4) the built-in seek loop only ever sees the 3000 mel frames of one
window, it is not a long-audio solution; (5) the 4.3.1 `WhisperTimeStampLogitsProcessor` lacks "timestamps must not decrease" and
`max_initial_timestamp` (dead code after a `continue`); the reference applies the full set and reconciles segment edges with word times.

### Q3 - Word timestamps (`results/q3-builtin-*.json`, `qual-*.json`, `parity.json`)

Only the `*_timestamped` exports output `cross_attentions.*` (tiny 4 outputs / 6 heads, base 6 / 8, small 12 / 10); plain repos fail
`return_timestamps:'word'` with `Model outputs must contain cross attentions`. On **WebGPU the cross-attentions come back** (times equal WASM
within 0.0-0.1 s; decoder step 37-47 ms `_timestamped` vs 41-46 ms plain on tiny, `bench-tiny-{plain,ts}-webgpu-fp16.json`).

Built-in `pipeline(..., return_timestamps:'word')`, passage-b, median |error| in s against the pause anchors:

| model | device | word start vs pause end | word end vs pause start | last word end (audio 22.74 s) |
|---|---|---|---|---|
| tiny | WASM q8 | 0.21 | 0.35 | **28.18** |
| tiny | WebGPU fp16 | 0.22 | 0.69 | **24.14** |
| base | WASM q8 / WebGPU fp16 | 0.11 | 0.28 / 0.25 | 21.92 |
| small | WASM q8 / WebGPU fp16 | 0.11 | 0.61 | 21.92 |

Defects: the seek path passes 1500 frames to the DTW instead of `num_frames` (words land in the zero padding); word ends include the
following pause (punctuation merged with timestamps); it is slow (pure-JS DTW over 1500 frames: tiny 7.5 s, base 13.7 s, small 35.8 s for
passage-b on WASM).

Reference engine (`alignWords`: teacher-forced pass over `[sot, lang, task, <|notimestamps|>, text, eot]`, alignment heads, median filter 7,
DTW, faster-whisper duration clean-up, punctuation glued to the word text only), greedy, median |error| s and anchors within 0.2 s:

| model | device | clip | start vs pause end | end vs pause start | engine |
|---|---|---|---|---|---|
| tiny | WASM q8 | passage-b | 0.04 (7/8) | 0.05 (7/8) | browser |
| tiny | cpu int8 | passage-b | 0.08 (7/8) | 0.05 (7/8) | faster-whisper |
| tiny | WASM q8 | passage-a | 0.025 (25/27) | 0.06 (24/26) | browser |
| tiny | cpu int8 | passage-a | 0.05 (27/27) | 0.03 (24/26) | faster-whisper |
| base | WASM q8 | passage-b | 0.11 (7/8) | 0.16 (5/8) | browser |
| base | cpu int8 | passage-b | 0.22 (4/8) | 0.19 (5/8) | faster-whisper |
| base | WASM q8 | passage-a | 0.08 (21/27) | 0.135 (17/26) | browser |
| base | cpu int8 | passage-a | 0.12 (18/27) | 0.16 (18/26) | faster-whisper |
| small | WebGPU fp16 | passage-b | 0.06 (8/8) | 0.13 (5/8) | browser |
| small | WebGPU fp16 | passage-a | 0.075 (22/27) | 0.19 (16/26) | browser |

Word by word against faster-whisper (`parity.json`, 18 model/device/clip combinations): |start diff| median 0.00-0.02 s (p90 0.02-0.06),
|end diff| median 0.00-0.02 s (p90 0.02-0.10). Cost of the alignment pass: 0.14-1.1 s on tiny/base, 2.9-4.4 s on small WASM
(`qual-*-v2.json` `timings.align`). Windows must be tight around speech: the first word starts at the window start and the last ends at
the window end unless the segment reconciliation shortens it.

### Q4 - Token scores -> word confidence, `avg_logprob`, `no_speech_prob` (`results/q4-scores-tiny-wasm.json`, `q4-scores-base-webgpu.json`, `parity.json`)

* `generate()` with `return_dict_in_generate:true, output_scores:true, output_logits:true` returns only `{sequences, past_key_values}` -
  `hasScores:false, hasLogits:false` on tiny WASM **and** on base WebGPU (re-run in this track), with and without the timestamp seek path.
  The source still says `// scores` TODO.
* Wrapping `WhisperTimeStampLogitsProcessor.prototype._call` captures the processed logits of every greedy step, so per-token log-probs can be
  had from the built-in path (tiny WASM passage-c: `" 12"` -0.443, `" Finance"` -0.435, `" Team"` -0.542, closing timestamp -2.10; base WebGPU:
  `" 12"` -0.625, `" finance"` -0.585). Greedy only.
* The reference computes everything from its own decode loop and the alignment pass: `avg_logprob` (mean log-prob of generated tokens
  incl. EOT, faster-whisper's definition), `no_speech_prob` (softmax of the first step at the SOT position), per-word `probability` (mean
  token probability), `compressionRatio` (`CompressionStream('deflate-raw')` + zlib header size). Against Python on identical windows:

| model / device, clip | avg_logprob browser / Python | no_speech browser / Python | compression browser / Python | word prob mean abs diff (p90) | low (<0.5) flags both / browser only / Python only |
|---|---|---|---|---|---|
| tiny WASM q8, passage-b | -0.133 / -0.152 | 0.0015 / 0.0124 | 1.52 / 1.51 | 0.007 (0.016) | 0 / 0 / 0 |
| tiny WebGPU fp16, passage-a | - | - | - | 0.024 (0.044) | 1 / 0 / 4 |
| base WASM q8, passage-b | -0.116 / -0.119 | 0.0021 / 0.0055 | 1.52 / 1.51 | 0.006 (0.017) | 0 / 0 / 0 |
| base WASM q8, passage-c | -0.175 / -0.239 | 0.0172 / 0.0091 | 1.07 / 1.04 | 0.035 (0.109) | 0 / 0 / 0 |
| base WebGPU fp16, passage-c | -0.242 / -0.239 | 0.0078 / 0.0091 | 1.07 / 1.04 | 0.035 (0.099) | 0 / 0 / 0 |
| small WebGPU fp16, passage-b | -0.127 / -0.127 | 0.0010 / 0.0095 | 1.52 / 1.51 | 0.004 (0.009) | 0 / 0 / 0 |
| small WebGPU fp16, passage-a | - | - | - | 0.016 (0.021) | 0 / 0 / 2 |

The "uncertain word" underline (probability < 0.5) agrees on most words but not all: across the 18 parity combinations the flags differ on
0-4 words per clip, with Python flagging slightly more on tiny. `no_speech_prob` is systematically lower in the browser on speech
(0.001-0.02 vs 0.005-0.012); on silence/noise both are 0.86-0.99 (Q11). Mean word probability differs by 0.00-0.03 per clip.

### Q5 - Language detection with probabilities, translate (`results/q5-lang-{tiny-wasm,base-wasm,small-webgpu}.json`)

Not in the library: `pipeline()`/`generate()` log `No language specified - defaulting to English`. The reference runs one decoder step with
`[<|startoftranscript|>]` and takes a softmax over the 99 language tokens (cost = one `first-step`, 85-740 ms).

| clip (truth) | tiny WASM q8 | base WASM q8 | small WebGPU fp16 |
|---|---|---|---|
| ext-fr (fr) | fr 0.93 | fr 0.97 | fr 0.98 |
| ext-ja (ja) | ja 0.98 | ja 0.98 | ja 0.99 |
| ext-ru (ru) | ru 1.00 | ru 1.00 | ru 1.00 |
| ext-bn (bn) | bn 0.68 | **mr 0.64** (bn 0.17) | bn 0.69 |
| ext-af (af) | **de 0.66** | **yi 0.45** (de 0.43) | **yi 0.79** (af 0.02) |
| ext-jfk (en) | en 0.87 | en 0.92 | en 0.96 |
| passage-b (en) | en 0.998 | en 0.999 | en 0.999 |
| silence-30s | cy 0.37, no_speech 0.93 | en 0.29, no_speech 0.95 | en 0.35, no_speech 0.94 |
| noise-pink-30s | nn 0.60, no_speech 0.89 | nn 0.45, no_speech 0.99 | nn 0.67, no_speech 0.99 |
| music-like-30s | en 0.32, no_speech 0.91 | en 0.45, no_speech 0.86 | la 0.42, no_speech 0.95 |

Translate (`task:'translate'`, `<|translate|>` token) works on ru/ja/bn; forcing `language:'fr'` and auto-detect give the same French text
and the same English translation; forcing `language:'en'` on French makes tiny and base translate instead of transcribing (small keeps the
French). Base on Bengali with translate ran into a repetition loop ("new series of new series ...", `q5-lang-base-wasm.json`) - the guards of
Q6 exist for that.

### Q6 - Beam search, temperature fallback, repetition controls, prompt, condition on previous (`results/q6a-builtin-{tiny,base}-wasm.json`, `q6b-reference-base-wasm.json`, `dbg-cond.json`)

* **Beam search is not implemented**: `num_beams` 1 / 2 / 5 / 5 + `early_stopping` return byte-identical token ids (`identicalTokens:true`) on
  tiny and base. The reference decodes beam hypotheses one after another through the merged decoder (per-hypothesis KV cache); cost of one
  22.7 s window, greedy -> beam 5 decode ms (decoder runs): tiny WASM 3,956 -> 15,871 (89 / 443, 4.0x), tiny WebGPU 7,064 -> 44,311 (6.3x), base
  WASM 7,376 -> 29,727 (4.0x), base WebGPU 17,591 -> 80,281 (4.6x), small WASM 15,558 -> 66,637 (4.3x), small WebGPU 32,329 -> 153,127 (4.7x)
  (`qual-{tiny,base,small}-{wasm-q8,webgpu-fp16}.json`). WER gain on the fixtures: none (Q12); tiny q8 beam 5 lost a clause (4.6 % -> 10.3 %).
* **Sampling** (`do_sample`, `temperature`, `top_k`) works in `generate()` (outputs vary at 0.6 / 1.0). `temperature:0` + `do_sample` = greedy.
* **Temperature fallback**: re-implemented (temperatures `[0,0.2,0.4,0.6,0.8,1.0]`, `best_of`, thresholds 2.4 / -1.0 / 0.6). On a real loop
  (base, Bengali clip): greedy 120 tokens, compression ratio 8.17; `noRepeatNgramSize:3` -> 1.97; `repetitionPenalty:1.3` -> 0.92; the app ladder
  stopped at temperature 0.2 with ratio 0.89 after 42.6 s. On clean speech the ladder stays at temperature 0 (`fallbackLadder`).
* **Repetition controls**: `no_repeat_ngram_size` and `repetition_penalty` are accepted by `generate()` and by the reference; on the one-token
  noise outputs they change nothing (nothing to repeat). `suppress_tokens` works (`withExtraSuppress` changed the casing of "Friday").
* **Prompt**: `prompt_ids` kwarg is **ignored** by 4.3.1 (`kwargChangesOutput:false`); passing `[<|startofprev|>, ...prompt, <|sot|>, lang, task]`
  as `decoder_input_ids` works: base "Covernets" -> "Kubernetes". The reference does the same (`prompt: 'Kubernetes, PostgreSQL, Hyderabad'`):
  "Covernet's" -> "Kubernetes". Caveat: with a prompt the model stopped after the first sentence of the window (`hasPostgreSQL:false`) - the
  seek loop is mandatory when prompting.
* **Condition on previous text**: prompt = previous window's text. With fixed windows and no seek loop WER went 2.9 % -> 18.9 % because window 2
  stopped at 34.5 s of a 22.5-49.0 s window (`dbg-cond.json`). With `consumedSeconds` honoured this is the Python behaviour; the fixture gain
  was nil, so default off and keep the option.

### Q7 - Streaming partial text and cancellation (`results/q7-stream-cancel-*.json`, `q7b-builtin-cancel-tiny-wasm.json`, `q7-ref-rerun*.json`)

* **Streaming (built-in)**: `WhisperTextStreamer` callbacks deliver one token per call with chunk start/end marks. First text after the call:
  tiny WASM 2.68 s, base WASM 4.99 s, base WebGPU 1.13 s; then ~40-70 ms per token. 64 events reached the page per 22.7 s window.
* **Streaming (reference)**: `onPartial` every 150 ms with the growing text (15-29 partials per window, first one 0.65-2.9 s after the call,
  monotonic, `q7-ref-rerun2-*.json`).
* **Cancel (built-in)**: `stopping_criteria` is dropped by Whisper `generate()` (not honoured in 3 modes, 81-90 tokens generated), the
  streamer's `interrupt` is not honoured either (tiny: interrupted at token 3, 81 tokens generated; base: 102 tokens, 4.2-6.7 s later).
  **Throwing from the streamer callback works** (5 tokens seen, rejected after 2.4 s, next run fine).
* **Cancel (reference) - a defect found and fixed in this track.** The first re-run of `exp/q7-ref.mjs` showed `cancel()` requested at 2.0 s
  and the call still **finishing** 4.5 s later (`q7-ref-rerun-tiny-wasm.json`): ORT's `session.run()` settles through promise microtasks
  only, so the worker's `onmessage` (where `{op:'cancel'}` arrives) is starved until the whole window is decoded. Fix (`engine.ts`
  `check()`): yield one macrotask (`MessageChannel`) at every cancel point. After the fix: tiny WASM cancel settles **20 ms** after the
  request (3 partials had been emitted), base WebGPU **47 ms**; the engine is reusable immediately (`reuseAfterCancel.ok`), and the smoke
  test still passes (`ref-smoke-rerun2-tiny-wasm.json`). Cancel points: after features, after the encoder, every decoder step, every
  fallback temperature, before the alignment pass - so the encoder pass (0.2-2.3 s tiny/base, up to 24 s small WASM 1-thread) cannot be
  interrupted cooperatively.
* **Hard cancel** `worker.terminate()`: new worker ready in 47-87 ms; reload from cache tiny WASM 1.56-2.00 s, base WASM 2.10 s, base WebGPU
  3.2-3.4 s. Use it for "stop now", the cooperative path for everything else.

### Q8 - Caching (`results/q8-cache.json`, tiny q8)

* Storage: Cache API bucket `transformers-cache`, one entry per Hugging Face URL (7 model files, 40.8 MB) plus the ORT runtime files
  (`ort-wasm-simd-threaded.asyncify.wasm` 26.86 MB and `.mjs` 53 KB) -> 67.3 MB used of a 10,307 MB quota (`navigator.storage.estimate()`).
* Progress: 459 events for one load; per file `initiate` / `download` / `progress` / `done`.
* Persist: `navigator.storage.persist()` returned `false` (permission `prompt`) in headless Chrome; the API does not exist in the worker.
* Registry: `ModelRegistry.is_cached(repo)` true, `is_cached_files` lists all 7, `get_available_dtypes` = fp32/fp16/int8/uint8/q8/q4/bnb4,
  `get_file_metadata` returns size and content type.
* Offline: second launch loaded with **0** network requests in 2.22 s; `pipeline()` offline too (190 `progress_total` events, 1.24 s).
* Delete: `clear_cache(repo)` removed 7 files, usage 67.3 -> 25.7 MB (the ORT files stay); `is_cached` false afterwards; an offline load after
  the delete fails as it should.
* Quota: with the quota forced to 25 MB the load still succeeds (streams from the network) but logs `QuotaExceededError` and the decoder and
  ORT wasm are not cached (12.3 MB cached).
* Interrupted download: the connection was cut mid-decoder; the load failed with `TypeError: network error`, the files already complete
  (encoder 9.6 MB, tokenizer, configs) stayed cached, and the retry fetched only the decoder and the ORT wasm. So: per-file resume, **no
  byte-range resume** of a partially downloaded file.

### Q9 - Runtime assets, self-hosting, threads, esbuild (`results/q9-runtime.json`, `q9b-esbuild.json`)

| ORT file (`onnxruntime-web/dist`) | bytes | MiB | brotli | WASM | WebGPU |
|---|---|---|---|---|---|
| `ort-wasm-simd-threaded.asyncify.wasm` (Transformers.js default) | 26,861,777 | **25.62** | 4.5 MiB | ok | ok |
| `ort-wasm-simd-threaded.jspi.wasm` | 16,811,691 | 16.03 | 2.9 MiB | ok | ok |
| `ort-wasm-simd-threaded.wasm` (plain) | 14,264,838 | 13.6 | 2.6 MiB | ok | **fails** (`webgpuInit is not a function`) |
| `ort-wasm-simd-threaded.jsep.wasm` | 28,352,885 | 27.04 | 4.4 MiB | ok | **fails** (same error) |

* Default: both files come from `cdn.jsdelivr.net/npm/onnxruntime-web@<ver>/dist/`; the `.mjs` is cached and re-imported through a `blob:` URL.
* Self-hosting works with `env.backends.onnx.wasm.wasmPaths = {mjs:'/ort/...mjs', wasm:'/ort/...wasm'}` or the prefix string `'/ort/'`
  (then the asyncify names are assumed). The asyncify file is over Cloudflare Pages' 25 MiB per-file limit; **ship jspi** (works for WASM
  and WebGPU on Chrome 155, loaded faster from cache: 1.42 s vs 2.34 s) or serve the asyncify file from R2 / jsDelivr. Firefox/Safari
  support of JSPI was not tested here.
* Threads: without COOP/COEP `numThreads` is **1** even when 4 is requested; with isolation the default is 4 and WebGPU still works.
  Effect on tiny q8 `generate()` for passage-c: 1 thread 1.97-2.14 s, 4 threads 1.28-1.35 s. The app will not be isolated (ads), so plan
  for 1 thread on WASM; the WebGPU path is the fast one.
* esbuild with Angular's application-builder options (`platform:'browser'`, `format:'esm'`, minify, esbuild 0.28.2 vs Angular's 0.28.1):
  worker bundle 576 KiB, loads and transcribes on WASM and WebGPU, 0 wasm files emitted (the runtime is fetched at run time);
  `platform:'node'` is wrong (pulls 14 node-only inputs, 707 KiB). The Vite build of the reference copies the 26.9 MB asyncify wasm into
  `dist/assets` - that must be replaced by `wasmPaths` pointing at jspi files in the real build.

### Q10 - Memory peaks and OOM behaviour (`results/q10-mem-*.json`, `q10-oom.json`, `bench-*.json`)

Per-process working set in MB read from the OS (renderer that hosts the worker + GPU process; `totalPeakWsMB` = peak of all Chrome
processes), 22.7 s greedy window with words, then three 24 s windows, then one beam-5 window:

| model / device | after load (peak) | after 1 window | after 4 windows | after beam 5 | after dispose + terminate | renderer peak / GPU peak |
|---|---|---|---|---|---|---|
| tiny WASM q8 | 1,077 | 1,166 | 1,224 | 1,224 | 606 | 722 / 137 |
| tiny WebGPU fp16 | 1,643 | 1,886 | 1,975 | 2,064 | 1,025 | 783 / 888 |
| base WASM q8 | 1,200 | 1,365 | 1,367 | 1,367 | 548 | 841 / 137 |
| base WebGPU fp16 | 1,919 | 2,288 | 2,415 | 2,504 | 911 | 1,004 / 1,062 |
| small WASM q8 | 1,869 | 2,024 | 2,165 | 2,210 | 549 | 1,590 / 137 |
| small WebGPU fp16 | 3,907 | 4,817 | 5,557 | 5,827 | 1,096 | 2,083 / **3,114** |

Idle page before loading: 454-466 MB. Observations: WASM memory is flat after the first window; on **WebGPU the GPU process keeps
growing across windows** (small: 1,263 -> 2,104 -> 2,843 -> 3,114 MB; base: 530 -> 846 -> 973 -> 1,061 MB) and only `terminate()` returns it.
Whether that is a pool that plateaus or a leak is **not measured** (the planned `q10-leak` run with 12-16 windows did not produce a result
file). The fp32/q4 mix on small WebGPU peaked at 5,572 MB and took 32 s to load (`bench-small-webgpu-fp32q4.json`) - avoid fp32 encoders.
OOM probe (`q10-oom.json`): `WebAssembly.Memory` grew to 4,096 MiB, 2.25 GiB of ArrayBuffers and 6 GiB of WebGPU buffers were allocated
without a crash (stopped on purpose on the shared machine); the WebGPU `maxBufferSize` is 2 GiB and a larger buffer is a validation error,
not a crash. **What happens at the real limit (tab kill vs exception) was not observed** and must be tested on a low-memory device.

### Q11 - Hallucination baseline on noise / music / silence without VAD (`results/q11-halluc-*.json`)

Reference engine, three settings per 30 s clip: `appSettings` (beam 5, auto language, full fallback ladder, thresholds 2.4 / -1 / 0.6),
`greedyNoFallback`, `greedyEnglish`. "Passes filter" = non-empty text that the app's drop rule (`no_speech_prob > 0.6 and avg_logprob < -1`,
`backend/app/engine.py`) would keep.

| clip | model / device | appSettings output | no_speech / avg_logprob / ratio | fallbacks, wall | passes filter |
|---|---|---|---|---|---|
| silence-30s | all 6 | `"you"` / `"You"` (tiny WASM: Welsh garbage after 6 temperatures, 202 s) | 0.92-0.95 / -0.48..-0.74 | 1, 2-12 s | **yes** on 5 of 6 |
| noise-pink-30s | tiny WASM | "I think it's a bit more fun than I thought." | 0.89 / -1.75 / 0.84 | 2, 62 s | no |
| noise-pink-30s | tiny WebGPU | "A few minutes later, I'll take a look at the other side of the table." x3 | 0.97 / -0.96 / 2.26 | 2, 60 s | **yes** |
| noise-pink-30s | base WASM / WebGPU | "1.0% de坂" / "nd" | 0.99 / -1.4..-1.7 | 2, 69-79 s | no |
| noise-pink-30s | small WASM / WebGPU | "O... Oaaa... Ooooressed..." / "ԱսԱս ԱսԱս" | 0.99 / -4.1 and -0.83 | 6 (572 s) / 4 (519 s) | no / **yes** |
| music-like-30s | tiny, base | `"You"`, `"to"`, `"."` | 0.74-0.91 / -1.1..-1.9 | 1-3, 2-91 s | no |
| music-like-30s | small WebGPU | Khmer garbage | 0.95 / -1.0 / 1.23 | 4, 419 s | **yes** |
| tone-1k | tiny / base / small | "Thanks for watching!" / `"You"` / "BEEP" | 0.51-0.84 / -0.8..-1.05 | 1-6, 2-32 s | yes on 3 of 6 |

Greedy without the ladder on noise/music produces the classic 224-token loops ("2.5mm x 2.5mm ...", Sinhala/Telugu character runs,
"I'm going to go to the next station." x14) with compression ratio 5-21 and avg_logprob -0.12..-0.46: they pass the no-speech test, and a
single 30 s segment also escapes the "same text 4x" rule. Conclusions: (1) the `no_speech`/`avg_logprob` filter and the ladder stop most of
it but **11 of 22 app-setting runs still emitted something**, usually `"you"`; (2) the fallback ladder on non-speech is ruinously slow
(60-570 s per 30 s window: every temperature decodes 224 tokens); (3) VAD in front of the engine is therefore not optional - exactly the
Python set-up (Silero VAD) - and `no_speech_prob > 0.6` alone (not ANDed with the logprob) is a sensible extra gate for windows that VAD let
through; (4) `max_new_tokens` per window and the compression-ratio test before running the next temperature are the cheap wins.

### Q12 - WER on passage-a / passage-b, greedy vs beam 5 (`results/qual-*.json`, `results/fw/*.json`; `node report-tables.mjs`)

| model | device / dtype | clip | browser greedy | browser beam 5 | Python beam 5 (int8 CPU) |
|---|---|---|---|---|---|
| tiny | WASM q8 | passage-b | 0.0 % (0/63) | 0.0 % | 0.0 % |
| tiny | WASM q8 | passage-a | 4.6 % (8/174) | **10.3 %** (18/174) | 1.1 % (2/174) |
| tiny | WASM fp32 | passage-a | 1.7 % (3/174) | 1.7 % | 1.1 % |
| tiny | WebGPU fp16 | passage-b | 0.0 % | 0.0 % | 0.0 % |
| tiny | WebGPU fp16 | passage-a | 1.7 % (3/174) | 2.3 % (4/174) | 1.1 % |
| tiny | WebGPU fp32/q4, fp16/q4f16 | passage-a | 2.9 %, 3.4 % | - | 1.1 % |
| base | WASM q8 | passage-b | 0.0 % | 0.0 % | 0.0 % |
| base | WASM q8 | passage-a | 2.9 % (5/174) | 2.9 % | 2.3 % (4/174) |
| base | WebGPU fp16 | passage-a | 2.9 % | 2.9 % | 2.3 % |
| base | WebGPU fp32/q4 | passage-a | 3.4 % (6/174) | - | 2.3 % |
| small | WASM q8 | passage-b | 0.0 % | 0.0 % | 0.0 % |
| small | WASM q8 | passage-a | 1.7 % (3/174) | not run | 1.1 % (2/174) |
| small | WebGPU fp16 | passage-a | 1.7 % | 1.7 % | 1.1 % |

passage-c (18 words): 5.6 % (1 word, "12" vs "12th"-type) on most combinations, 0 % on tiny WebGPU and Python tiny. Reading: q8
quantisation costs tiny ~3 points on the long passage (fp32 and fp16 are at 1.7 %); base and small are within 0.6 points of Python; beam 5
never helped on these fixtures. Speed of the reference engine, greedy with word timestamps (wall / audio, `qual-*-v2.json`,
`qual-small-wasm-q8-a.json`): tiny WASM q8 **0.33**, tiny WebGPU fp16 **0.22**, base WASM q8 **0.53**, base WebGPU fp16 **0.29**, small WASM q8
(1 thread) **1.49**, small WebGPU fp16 **0.71**; load from cache 4.2 / 5.3 / 5.6 / 7.5 / 8.1 / 11.1 s. Built-in `generate()` on one window
(`bench-*.json`, RTF): tiny 0.27 WASM / 0.14 WebGPU q4f16, base 0.33-0.47 WASM 1 thread / 0.20 WebGPU q4f16, small 1.66-1.97 WASM 1 thread /
0.47 WebGPU q4f16; 4 isolated threads bring small WASM to 0.70-0.76.

## Open items and risks

1. medium / large-v3-turbo / large-v3 / distil-large-v3: nothing measured (sizes only). large-v3 and distil-large-v3 have no `_timestamped`
   export, so word timestamps need a different route (own export) or a documented loss.
2. WebGPU GPU-process memory growth across windows (small: +1.85 GB over 5 windows) - run `exp/q10-leak.mjs` with 16+ windows.
3. Real OOM behaviour and phones: not observed. Real download speed: not measured (replay cache).
4. The encoder pass cannot be cancelled cooperatively; on small WASM 1-thread that is up to 24 s. Hard cancel covers it.
5. Firefox / Safari: not tested (JSPI runtime, WebGPU fp16, Cache API quota).
6. `persist()` could not be exercised (headless denies it); try on a headed profile.
7. The reference engine is spike code: no tests beyond `reference/test/dsp.test.ts` (DTW/median filter, not re-run here) and the
   experiments; the production engine should be built from it with the parity harness (`cmp-fw.mjs`) as its regression test.

## How to reuse the harness

```
cd <scratchpad>/asr                                   # package.json pins transformers 4.3.1, vite 8.3.5, playwright-core 1.64.1, esbuild 0.28.2
node driver/prepare-audio.mjs                         # fixtures -> audio/*.f32 (16 kHz mono) with the repo's ffmpeg
npx vite build --config harness/vite.config.ts        # lab page (window.lab.call(op,args): info, configure, load, loadPipeline, exec, dispose)
npx vite build --config reference/vite.config.ts      # reference page (window.ref.load / transcribeWindow / cancel / terminate)
P='{"model":"base","device":"wasm","dtype":"q8","beams":[1,5],"clips":["passage-b"],"words":true}' \
  node driver/run.mjs exp/qual.mjs --tag base-wasm --offline     # -> results/qual-base-wasm.json ; --offline = replay cache only
node show-qual.mjs results/qual-base-wasm.json ; node show-bench.mjs results/bench-*.json ; node report-tables.mjs
node merge-results.mjs                                # rebuilds docs/in-browser/spike/model-catalog.json from results/
```

* One script per question in `exp/` (`q01-api`, `q2-windows`, `q3-builtin`, `q4-scores`, `q5-lang`, `q6a-builtin`, `q6b-reference`, `q7-ref`,
  `q7-stream-cancel`, `q7b-builtin-cancel`, `q8-cache`, `q9-runtime`, `q9b-esbuild`, `q10-mem`, `q10-oom`, `q10-leak`, `q11-halluc`, `qual`, `bench`,
  `ref-smoke`); the sequential batch files `run-matrix.sh`, `run-bench.sh`, `run-rest.sh`, `run-qual2.sh`, `run-post.sh` show the exact `P` for
  every result file. A new experiment is a module `export default async (L) => result`; `L.exec(async (T, ctx, args, audio, emit) => {...})`
  runs a stringified function inside the lab worker, `L.ref(op, clip, opts)` drives the reference worker.
* `driver/hfcache.mjs` is the record/replay cache (`cache/hf`, ~2.3 GB) for huggingface.co and jsDelivr: `auto` / `offline` / `live`; files
  >= 2 MB are answered with a 302 to a local file server because `route.fulfill()` with a 150 MB body kills the browser. `cutAfter` and
  `throttleBytesPerSec` emulate failed and slow downloads. `driver/prefetch.mjs "repo:q8,fp16"` fills the cache from node.
* WebGPU needs `http://localhost` (not `about:blank`); headless Chrome 155 gets the AMD adapter with no flags. `driver/procmem.ps1` reads
  per-process memory read-only. `run.mjs` retries up to 3 times if the browser vanishes (shared machine).
* `py/fw_ref.py` produces the Python reference (`results/fw/`), `cmp-fw.mjs` compares word by word -> `results/parity.json`.

## The reference worker API (`reference/src/worker.ts`, `engine.ts`, `dsp.ts`, `main.ts`)

Message protocol (one request at a time, `cancel` handled out of band):

```
page -> worker  { id, op:'load', args: LoadOptions }                      -> { id, ok, result: loadInfo }   + { type:'progress', id, p: ProgressInfo }
                { id, op:'transcribeWindow', audio: Float32Array, opts }  -> { id, ok, result: WindowResult } + { type:'partial', id, text, tokens, ms }
                { op:'cancel' }                                            cooperative; takes effect at the next cancel point (20-47 ms measured)
                { id, op:'dispose' } | { id, op:'info' }
errors          { id, ok:false, cancelled: boolean, error: { name, message, stack } }
hard cancel     worker.terminate() + new Worker(); reload from cache 1.6-3.4 s
```

```ts
interface LoadOptions { repo: string; device: 'webgpu'|'wasm'; dtype?: string | { encoder_model?: string; decoder_model_merged?: string };
  sessionOptions?: Record<string, unknown>; wasmPaths?: string | { mjs: string; wasm: string }; numThreads?: number; progress?: (p: ProgressInfo) => void }
interface ProgressInfo { status: 'initiate'|'download'|'progress'|'done'|'ready'; file?: string; loaded: number; total: number; progress: number; fileLoaded?: number; fileTotal?: number }
interface TranscribeOptions { language?: string | null /* null = detect */; task?: 'transcribe'|'translate'; beamSize?: number /* 1 = greedy, default 5 */;
  bestOf?: number; temperatures?: number[]; compressionRatioThreshold?: number | null; logProbThreshold?: number | null; noSpeechThreshold?: number | null;
  prompt?: string | null; timestamps?: boolean; wordTimestamps?: boolean; maxNewTokens?: number; repetitionPenalty?: number; noRepeatNgramSize?: number;
  seed?: number; offsetSeconds?: number; onPartial?: (p: { text: string; tokens: number; ms: number }) => void; partialIntervalMs?: number;
  debugTokens?: boolean; alignPrefix?: 'notimestamps'|'sot-lang-task' }
interface Word { word: string; start: number; end: number; probability: number }
interface Segment { start: number; end: number; text: string; unfinished?: boolean; words: Word[]; avgLogprob: number; noSpeechProb: number;
  compressionRatio: number; temperature: number; confidence: number; tokens: number[] }
interface WindowResult { language: string; languageProbability: number; languageProbabilities: Array<[string, number]>; languageDetected: boolean;
  noSpeechProb: number; text: string; segments: Segment[]; words: Word[]; confidence: number; consumedSeconds: number; singleTimestampEnding: boolean;
  avgLogprob: number; compressionRatio: number; temperature: number; fallbacks: Array<{ temperature; avgLogprob; compressionRatio; tokens; ms }>;
  tokens: number[]; tokenLogprobs?: number[]; timings: Record<string, number> }
```

Engine internals worth keeping: `load()` (files + tokenizer + processor + sessions, own progress total via `ModelRegistry`), `detectLanguage`
(one step), `decodeAttempt` (greedy / sequential beam with per-hypothesis KV, timestamp rules, `repetitionPenalty`, `noRepeatNgram`, partials,
cancel points), the fallback ladder, `alignWords` (teacher-forced pass, alignment heads, median filter, DTW from `dsp.ts`, faster-whisper
word clean-up, per-word probability), `consumedSeconds` seek rule, `compressionRatio` via `CompressionStream`. Build: `npx vite build --config
reference/vite.config.ts` (568 KiB worker); type check: `npx tsc --noEmit -p reference/tsconfig.json` (clean). Smoke: `node driver/run.mjs
exp/ref-smoke.mjs --offline` (tiny WASM q8, passage-c, 18 words, 2.9-5.3 s wall, `ref-smoke-rerun2-tiny-wasm.json`).
