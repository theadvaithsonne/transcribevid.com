# Engine / recognition / post-processing / export parity spec (Python server -> browser TypeScript)

Track: inventory-engine. Branch `feature/in-browser` (base `swapnil` @ `3d8d3dc`). App folder: `video-transcriber/video-transcriber`.
Paths below are relative to that folder unless they start with `D:/`. `file:line` refers to the files as they are on this branch today.

Owner rule that governs this document: "currently a lot of features and models are present - do not compromise them".
So every behaviour below ends in one of these verdicts, never in silent removal:

| Verdict | Meaning |
|---|---|
| PORT | Pure logic. Re-implement in TypeScript exactly as specified; test against the golden vectors. |
| BUILD | The Python code leans on faster-whisper / CTranslate2 internals that Transformers.js does not provide. We must write the algorithm ourselves (specified here) on top of ONNX Runtime Web. |
| BROWSER | Replaced by a browser capability with the same observable behaviour. |
| SERVER-OPTIONAL | Cannot run on a static host. Evidence and the closest alternative are stated. Stays available only through the optional server transport. |

Risk: HIGH = the port can silently lose accuracy or a feature, or needs research / a spike first. MED = clear work, some unknowns. LOW = mechanical.

## 0. Reading guide, conventions, gotchas

* IDs are `EN-nnn`. Each entry gives source `file:line`, the exact algorithm and constants, the browser plan, a verdict and a risk. Tables of constants that are too long to inline are in Appendix A (generated programmatically from the Python modules, not retyped).
* "Verified" = measured on this machine on 25 Oct 2026 (commands and raw results in section 2). "Source-read" = read from the installed package source (faster-whisper 1.2.1, ctranslate2 4.8.3, @huggingface/transformers 4.3.1). "Assumed" = not verifiable here (CTranslate2 is a compiled library; its C++ was not read). Every "assumed" item must be pinned by a golden test before it is trusted.
* **Python -> JavaScript porting gotchas that change output** (apply everywhere below):
  1. `round(x, n)` and `round(x)` in Python use banker's rounding (half to even) on the binary float; `Math.round` rounds half up and `toFixed` uses its own rule. Write `pyRound(x, n)` (round-half-even on the exact decimal expansion of the double, e.g. via `Number(x.toPrecision(17))` tie detection) and use it for every `round(` below: segment/word times (2 decimals), probabilities (3), confidence (3), `fmt_ts` milliseconds, `words_per_minute`, `speech_seconds` (1), ETA.
  2. `len(s)` counts code points; JS `.length` counts UTF-16 units. Use `[...s].length` (matters for emoji and CJK Ext-B in cue length limits, paragraph size, `_wrap`).
  3. Python `\w`, `\W`, `\d` are Unicode-aware but `\w` does NOT match combining marks (Mn/Mc). So `re.sub(r"[\W_]+", " ", t)` turns Devanagari vowel signs into spaces (`engine._norm("नमस्ते!")` is `"नमस त"`, verified). JS equivalent: `[^\p{L}\p{N}]+` with the `u` flag (no `\p{M}`) - do not "fix" this, the repetition guard depends on it only for equality so either works, but the tests/golden vectors assume Python behaviour.
  4. `str.strip()` / `str.split()` with no argument treat Unicode whitespace; `.trim()` also trims U+FEFF, Python does not. Ignore except in byte-exact golden tests (none use U+FEFF).
  5. `json.dumps(x, ensure_ascii=False, indent=2)` prints floats like `0.0`, `2.5`; `JSON.stringify(x, null, 2)` prints `0`, `2.5`. Segment times are floats in Python (`0.0`), so a byte-exact JSON export cannot be reproduced by `JSON.stringify` alone. Decide whether byte-exactness matters (it does not for consumers; parse-equality does).
  6. Dict key order = insertion order in both languages; keep the construction order given in EN-041/EN-064/EN-056 so exported JSON has the same key order.
  7. `sorted(..., reverse=True)` and `Counter.most_common` are stable (ties keep first-seen order); `Array.prototype.sort` is stable since ES2019 - fine, but the comparator must not reorder ties.
  8. NumPy float32 vs JS double: Python computes segment values with float32 model outputs converted by `float()`; browser ONNX Runtime outputs are Float32Array. Round exactly where Python rounds, otherwise `0.1+0.2`-style noise appears in JSON.

## 1. Executive summary

### 1.1 What the browser stack gives us and what it does not (all measured or source-read)

| Needed by the app today | faster-whisper / CTranslate2 | Transformers.js 4.3.1 (latest on npm on 25 Oct 2026) | Verdict |
|---|---|---|---|
| Beam search (`beam_size` 1..10, default 5, patience 1) | yes | **No.** `generate()` in `src/models/modeling_utils.js` (lines ~1005-1019) samples one token per step: the loop over candidates ends with `break` and a `// TODO: Support beam search`. Verified: `num_beams: 1` and `num_beams: 5` gave byte-identical text with the same timings on whisper-tiny (section 2.3). | BUILD (HIGH) |
| Temperature fallback, `best_of` sampling, compression-ratio / log-prob / no-speech gates | yes (`generate_with_fallback`) | **No** (no scores returned: `// TODO: scores` in the return dict; no `no_speech_prob`; no `compression_ratio`; no `avg_logprob`). | BUILD (HIGH) |
| Automatic language detection (`language=None`), 4-window majority rule | yes (`detect_language`) | **No.** `_retrieve_init_tokens` logs `No language specified - defaulting to English (en).` Verified at run time. | BUILD (HIGH) |
| Word timestamps | yes: `align()` (teacher-forced pass), DTW over alignment heads, many clean-up rules | Partial: DTW over cross-attentions collected **during generation**, `return_timestamps:'word'`. Only works with the `*_timestamped` ONNX exports (the plain `onnx-community/whisper-tiny` throws `Model outputs must contain cross attentions`, verified). Verified on a 17.9 s clip: all 36 words matched the faster-whisper words but start times were off by mean 0.31 s (max 0.78 s) and end times by mean 0.35 s (max 1.27 s) - the Transformers.js stamps look shifted by about one word. | BUILD (HIGH) |
| Per-word probability (`probability`) -> uncertain-word underline, `confidence` | yes | **No** (words are `{text, timestamp}` only; verified key set `{text, timestamp}`). | BUILD (HIGH) |
| Hallucination-silence guard (`hallucination_silence_threshold=2.0`) | yes (needs word timestamps) | **No** | BUILD (HIGH) |
| Timestamp rules (pairs, non-decreasing, first token, `max_initial_timestamp`, text-vs-timestamp mass rule) | yes (CT2 `ApplyTimestampRules`, assumed same as OpenAI) | Partial. `WhisperTimeStampLogitsProcessor` (`src/generation/logits_process.js:277-345`) has no "timestamps must not decrease" rule, and its `max_initial_timestamp_index` branch is unreachable (placed after a `continue` for the same condition). | BUILD (MED) |
| Prompt (vocabulary) | yes, first window only when `condition_on_previous_text=False` (see EN-032) | `prompt_ids` applies to every chunk | BUILD (MED) |
| Seek loop over 30 s windows with timestamp-based advance | yes | Yes in `_generate_with_seek` (4.x), but without our gates | BUILD (MED) |
| Feature extraction (80 mel; 128 mel for large-v3 family) | numpy | yes (`WhisperFeatureExtractor`) | reuse |
| Tokenizer, model download + Cache API | HF hub | yes | reuse |
| Silero VAD with custom post-processing | `silero_vad_v6.onnx` (1.2 MB) + `get_speech_timestamps` | not included. `@ricky0123/vad-web` (named in the plan) is a different implementation with its own thresholds and redemption logic (from its documentation; not tested here), so its thresholds are not comparable. | PORT (HIGH) |
| Audio decode + filter chain (highpass 70, lowpass 7800, dynaudnorm) | ffmpeg | not included | PORT (HIGH) - algorithm validated, section 2.1 |
| IndicXlit (trained Hindi -> Roman) | CTranslate2 int8 conversion of the official checkpoint | no | BUILD (HIGH) |
| Qwen3-ASR 0.6B / 1.7B | torch + `qwen_asr` | no `qwen3_asr` model type in `src/models/` (only LLM/VL `qwen3*`) | BUILD or SERVER-OPTIONAL (HIGH) |

### 1.2 Recommended engine architecture (decision for the implementers)

1. Run everything in one dedicated Web Worker. Use Transformers.js only for: tokenizer, feature extractor, config loading, Cache-API downloads, and ONNX session creation (`PreTrainedModel.from_pretrained` or its session helpers). Do **not** call `pipeline('automatic-speech-recognition')` or `model.generate()` for decoding.
2. Write our own decoding loop (`WhisperDecoder`) over the two ONNX graphs (`encoder_model`, `decoder_model_merged` with KV cache): batch-of-beams decoding with KV-cache reordering, our timestamp-rule logits processor, log-prob bookkeeping, temperature sampling (`best_of` = 5), compression-ratio / log-prob / no-speech gates, `no_speech_prob` from the first decoder step, a separate teacher-forced alignment pass for word timestamps and token probabilities, and the faster-whisper seek loop (EN-030..EN-038).
3. Port faster-whisper's `get_speech_timestamps` and run `silero_vad_v6.onnx` (extracted from the `faster-whisper` wheel, MIT) through ONNX Runtime Web (EN-020).
4. Port the audio chain exactly (EN-010..EN-012); a numeric prototype matches ffmpeg to 2e-5 RMS (section 2.1). Keep an `ffmpeg.wasm` fallback only for containers the browser cannot decode, with the same filter string.
5. Post-processing (EN-040..EN-046), Hinglish (EN-060..EN-065), job semantics (EN-070..EN-077) and every exporter (EN-080..EN-088) are pure TypeScript with Python golden vectors (section 4 and Appendix B).
6. Models must be fetched from the ONNX repos listed in EN-001; for turbo use the `_timestamped` repo because the main repo's `alignment_heads` are the large-v3 heads and would index decoder layers that do not exist (verified, EN-037).

### 1.3 HIGH-risk list (also returned in the machine-readable result)

EN-010 (decode of every container), EN-011 (clean-up chain must be ported; validated), EN-015 (long-audio memory), EN-020 (VAD port), EN-031 (language detection does not exist in Transformers.js), EN-034 and EN-035 (beam search, temperature fallback, score gates: build), EN-037 (word timestamps + per-word probability: build; large-v3 and distil have no `_timestamped` export), EN-038 (hallucination guard depends on EN-037), EN-050 and EN-056 (Qwen3-ASR: no Transformers.js support; community ONNX exports exist, unverified), EN-062 and EN-063 (IndicXlit failure policy and runtime: no ready ONNX; export + custom beam search), EN-089 (PDF via print: running header needs a per-export `@page` rule; Devanagari text extraction and non-Chrome browsers need verification), EN-100 (YouTube / Instagram download cannot run in a static browser app).

## 2. Evidence log (what was actually run)

All scratch work is under `C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/inventory-engine/` (call it `$SCR`). Nothing in the repository was modified except this file. Python was run with the repository's venv (`backend/.venv`, Python 3.12) in isolated mode (`-I`), loading the repo code by explicit `sys.path` entry.

### 2.1 Audio clean-up chain: prototype vs ffmpeg 7.1 (`$SCR/audio/proto.py`, `proto2.py`, `proto3.py`)

Method: synthetic speech-like signals (harmonics under a slowly varying envelope, a 1.5 s near-silence gap, a quiet start), written as raw float32, processed by the real ffmpeg binary (`ffmpeg-win-x86_64-v7.1.exe`) and by a ~60-line NumPy re-implementation of the algorithm in EN-011, compared sample by sample.

| Test | Result (RMS error, max error; signal RMS ~0.17) |
|---|---|
| dynaudnorm only, 48 kHz mono, 20 s (100 whole frames) | 1.5e-5 / 3.9e-4 |
| dynaudnorm only, 48 kHz, 19.77 s (partial last frame) | 1.6e-5 / 4.5e-4 |
| dynaudnorm only, 16 kHz, 13.3 s | 1.3e-6 / 3.4e-5 |
| `highpass=f=70,lowpass=f=7800,dynaudnorm=f=200:g=11:p=0.9` on 44.1 kHz stereo -> mono at native rate | 1.7e-6 / 4.3e-5 |
| same chain, 48 kHz stereo -> mono | 2.3e-5 / 4.4e-4 |
| Stereo -> mono down-mix with `-ac 1`: L=0.8,R=0 -> 0.56568545; L=0.8,R=0.4 -> 0.84852815 | coefficient is `sqrt(1/2)` for each channel, **not 0.5** |
| dynaudnorm, 48 kHz, exact-zero stretches: leading 1.0 s / 0.5 s hole / 4 s tail / all-zero file, rule "zero frame = previous gain (10 first)" | 3.2e-5 / 1.0e-3; 3.2e-5 / 1.2e-3; 1.6e-6 / 2.7e-5; 0 / 0 |
| dynaudnorm, 48 kHz and 44.1 kHz, a 2.4 s exact-zero hole + 0.7 s zero tail | previous-gain rule 4.3e-5 / 1.3e-3; plain "gain 10" rule 8.8e-4 / 0.027 (unresolved branch, see EN-011 note) |

The first prototype (closed-form boundary handling) had 4e-3 RMS error; the exact history-queue emulation in EN-011 brought it down to the float32 noise floor. Resampling to 16 kHz (ffmpeg `swr`) was NOT compared to the browser resampler (not measured; see EN-012).

### 2.2 Faster-whisper reference run on a speech fixture (real engine, `$SCR/ct2-work/run_ct2.py`)

Fixture: Windows SAPI "Microsoft David" voice, 17.87 s, 16 kHz mono, known script (`$SCR/audio/tts_en.wav`). `engine.transcribe(path, {"model":"base","language":None,"output_script":"original"})` with a private copy of the `base` CT2 model:

* Result: `language=en`, `language_probability=0.997`, 3 segments (0.0-5.38 conf 0.965; 6.33-15.54 conf 0.984; 15.54-17.0 conf 0.859), 36 words with probabilities (e.g. ` Hello` 0.0-0.34 p=0.926; ` $10` 6.81-7.21 p=0.844; `,000` 7.21-7.89 p=0.982), `avg_confidence 0.936`, 7.18 s wall for 17.87 s audio (includes model load), live progress 0.301 -> 0.87 -> 0.951.
* Silence (10 s of zeros) and 10 s of -40 dB white noise with `language="en"`: **0 segments, no error**, `stats.word_count 0`. With `language=None` on the silent file: `language en`, `language_probability 0.61`, 0 segments. (The UI then shows "No speech was transcribed".)
* VAD (EN-020) on this fixture with the app's parameters: speech spans (s) `[(0.0, 2.832), (2.928, 6.0), (6.096, 8.944), (12.048, 17.52)]`; Qwen planner VAD (300/100): `[(0.06,1.22),(1.372,2.532),(3.228,5.7),(6.396,8.644),(12.348,15.876),(16.028,17.22)]` -> two Qwen chunks `[(0.06, 8.644), (12.348, 17.22)]` (the 3 s pause is a break >= 2 s). `chunks(zeros(61 s), vad=False)` -> `[(0,25,False),(25,50,True),(50,61,True)]`.

### 2.3 Transformers.js 4.3.1 probes in Node (CPU, q8; `$SCR/tjs-test/`)

* Same fixture, `onnx-community/whisper-tiny_timestamped`, `num_beams` 1 vs 5: identical output; 2.49 s vs 2.05 s for 17.87 s audio (no extra work was done for beams). Evidence that beam search is not implemented, matching the `TODO` in the source.
* `onnx-community/whisper-base_timestamped` (q8), `language:'en'`, `return_timestamps:'word'`: text WER 0.0 vs the script and vs faster-whisper base (tools.metrics.wer_text). Words: 36 vs 36. Word times differ as stated in 1.1. Word chunk keys are only `text` and `timestamp`. 3.5 s for 17.87 s (Node CPU, not a browser number).
* No `language`: logs `No language specified - defaulting to English (en).` and decodes as English.
* `onnx-community/whisper-tiny` (not `_timestamped`) with `return_timestamps:'word'`: throws `Model outputs must contain cross attentions to extract timestamps...`.

### 2.4 Model repositories and sizes (HF API, 25 Oct 2026; encoder + `decoder_model_merged`, MB)

| Catalog id | Repo | fp16 | q4 | int8 (`_quantized`) | has `*_timestamped` twin |
|---|---|---|---|---|---|
| tiny | onnx-community/whisper-tiny | 76.1 | 95.7 | 40.8 | yes |
| base | onnx-community/whisper-base | 146.1 | 142.4 | 76.9 | yes |
| small | onnx-community/whisper-small | 485.2 | 299.3 | 249.1 | yes |
| medium | onnx-community/whisper-medium-ONNX | 1529.8 | 679.3 | 985.7 | yes (`whisper-medium_timestamped`) |
| large-v3-turbo | onnx-community/whisper-large-v3-turbo (+ `_timestamped`) | 1618.6 | 759.1 (q4f16: 563.5) | 1084.8 | yes - **use it** |
| large-v3 | onnx-community/whisper-large-v3-ONNX | 3089.6 | 1222.2 (q4f16: 979.5) | 1821.9 | **no** |
| distil-large-v3 | distil-whisper/distil-large-v3 (ONNX) | - | - | 766.8 | **no** |

Notes: sizes for the large repos include the `.onnx_data` external weights where the quantisation file set has them (encoder fp32 `.onnx_data` is 2547.9 MB alone). `alignment_heads` in `generation_config.json`: tiny 6, base 8, small 10, medium 6, large-v3 9 (layers 9..23), distil-large-v3 20 (layer 1), turbo main repo **9 heads at layers 9..23 (invalid for a 4-layer decoder)** vs `whisper-large-v3-turbo_timestamped` 6 heads `[[2,4],[2,11],[3,3],[3,6],[3,11],[3,14]]`, which equals the CTranslate2 turbo `config.json`. CT2 `config.json` heads for base/small/medium equal the ONNX repos' values (compared). Mel bins: 80 for tiny..medium, 128 for turbo/large-v3/distil-large-v3 (`preprocessor_config.json`, `num_mel_bins`).

### 2.5 Print-to-PDF probe (Chrome 155.0.8059.86 via playwright-core `channel:'chrome'`, `$SCR/pdf-test/`)

A 60-paragraph test page with Hindi, Arabic, Chinese and English paragraphs printed with `page.pdf()` and an `@page` rule: Chrome 155 honours `@page { @bottom-right { content: "Page " counter(page) " of " counter(pages) } }` (extracted text: "Page 1 of 7 ... Page 7 of 7"), `@page :first` overrides, and a **literal** string in `@top-center` (text on pages 2+, not on page 1). `string-set` / `string()` did NOT work (no running title). pypdf's text extraction of the Devanagari paragraph dropped combining signs ("एक ूड ट" for "एक स्टूडेंट") - this may be pypdf's ToUnicode handling rather than a rendering fault; the glyph rendering itself was not inspected (no PDF rasteriser available). Needs a visual check before sign-off (EN-089).

### 2.6 Link-download feasibility (curl with `Origin: https://transcribevid.com`)

`https://www.youtube.com/watch?v=...` -> 200, **no** `Access-Control-Allow-Origin`; `https://www.instagram.com/reel/...` -> 200, no ACAO, and `cross-origin-resource-policy: same-origin`; the YouTube player API answers 405 to GET. A static page therefore cannot read these responses (EN-100).

### 2.7 Other measurements used below

* Official IndicXlit v1 archive: 124,533,637 bytes; contains `transformer/indicxlit.pt` (135,825,281 bytes) and `corpus-bin/dict.<lang>.txt` (hi: 7,594 bytes, en: 302 bytes). The CT2 int8 conversion is not present on this machine (`backend/data/models` holds only whisper base/small/medium/turbo and distil-large-v3.5).
* Silero VAD model shipped with faster-whisper 1.2.1: `silero_vad_v6.onnx`, 1,245,151 bytes; inputs `input[seq_len,576] float`, `h[1,1,128]`, `c[1,1,128]`; outputs `speech_probs[seq_len]`, `hn`, `cn`.
* The golden transcripts `backend/tests/golden/V-1..V-6.json` exist (6 videos, 143-535 s, 36-178 segments, 501-2106 words each, all English; schema `{video, language, duration, segments:[{start,end,text,words:[[start,word],...]}]}`) but the source videos are NOT on this machine (`~/Desktop/New folder (2)` missing), so the regression test in EN-090 cannot run until they are located.
* Windows SAPI has only two voices here (David, Zira, en-US): no Hindi fixture can be synthesised locally; Hinglish accuracy needs real Hindi audio.

---

## EN-001 .. EN-005 Catalogue, options, validation

### EN-001 Model catalogue and browser model map  (PORT data + BROWSER download; risk MED)
Source: `backend/app/engine.py:34-53` (`MODEL_CATALOG`, full JSON in Appendix A1), `qwen_engine.py:10`.
* Nine entries, UI order: tiny 75 MB, base 145, small 465 (default), medium 1500, large-v3-turbo 1600, large-v3 3100, distil-large-v3 1500 ("English only"), qwen3-asr-0.6b 1300, qwen3-asr-1.7b 3500 (`engine:"qwen"`, accuracy 0 = "experimental"). `speed`/`accuracy` are 1..5 UI stars. `size_mb` are the CT2 int8 sizes and are what the UI prints before download.
* Server filter: `list_models()` returns the catalog entries that faster-whisper knows (`available_models()`), plus Qwen entries only if `qwen_asr` is importable, minus anything outside `VT_ALLOWED_MODELS`, each with `downloaded: bool`. `GET /api/models`. Note the shipped catalog id `distil-large-v3` maps (faster-whisper 1.2.1 `_MODELS`) to `Systran/faster-distil-whisper-large-v3`, whereas the data folder also contains `distil-large-v3.5-ct2` (not referenced by the catalogue).
* Browser plan: static JSON `models.json` with the same ids/labels/notes and new fields `repo`, `dtype` choices and real download sizes from 2.4. Replace `size_mb` with the actual bytes of the chosen dtype (q4/int8 for WASM, fp16/q4f16 for WebGPU) and show that number. `downloaded` = Cache API entry check (EN-005). The catalog must keep all nine ids, including the two Qwen ids (EN-056 decides how they are served).
* Hard requirement: the `distil-large-v3` and `large-v3` ONNX repos have no `_timestamped` export; word timestamps for them need either our own export with cross-attention outputs (preferred, one-off script) or the teacher-forced alignment pass with an attention-exporting decoder (EN-037). Until then these two models would silently lose word timing/confidence - not acceptable.
* Memory gating (device track): large-v3 q4 is 1.2 GB of weights; phones get tiny/base/small only (plan section 4). The catalog keeps every model; the picker disables what the device cannot hold and says why.

### EN-002 Language tables  (PORT data; LOW)
Source: `engine.py:55-68` (61 codes, Appendix A2), `qwen_engine.py:11-12` (30 codes, A3), `pdf.py:60-71` (100 labels, A4).
* The picker offers exactly the 61 codes of A2 (not all 99 Whisper languages); `language=null` means auto-detect. Input normalisation: `strip().lower()`, empty -> null; unknown code -> validation error `Unsupported language 'xx'` (`schemas.py:45-51`).
* For `task=translate` any listed language is accepted. For Qwen only the A3 subset; `yue` is unreachable (not in A2).
* Whisper language token ids come from the tokenizer vocabulary (`<|hi|>` = 50276 in every checkpoint; `<|yue|>` exists only in the 128-mel family at 50358; verified from the local tokenizers).

### EN-003 Options schema, defaults, validation  (PORT; LOW)
Source: `engine.py:70-83`, `schemas.py:8-58`, `frontend/src/app/core/models.ts:4-17`.
Defaults (`DEFAULT_OPTIONS`): `engine "whisper"`, `romanizer "auto"`, `model "small"`, `language null`, `task "transcribe"`, `output_script "hinglish"`, `prompt ""`, `beam_size 5`, `vad true`, `enhance_audio true`, `word_timestamps true`, `condition_on_previous false`.
Validation (`JobOptions`):
* `engine` in {whisper, qwen}; `romanizer` in {auto, indicxlit, basic}; `output_script` in {hinglish, original}; `task` in {transcribe, translate} (else `task must be 'transcribe' or 'translate'`).
* `model` must be a catalog id (`Unknown model 'x'`; matching is case-sensitive: `SMALL`, `large`, empty are rejected). `is_qwen = model.startswith("qwen3-asr-")` must equal `engine == "qwen"` (`Choose a model belonging to the selected recognition engine.`).
* Qwen: `task` must be transcribe (`Select Whisper for English translation.`); `language`, if set, must be in A3 (`This language is not supported by the Qwen adapter.`).
* `prompt` max length 1000 characters; `beam_size` integer 1..10; booleans as listed.
* Engine-side merge (`engine.transcribe`, `engine.py:424`): `o = DEFAULT_OPTIONS + {k: v for k, v in options if v is not None or k == "language"}` - a `None` option falls back to its default, except `language` where `None` means auto-detect. (Qwen merges without the None filter, `qwen_engine.py:119`.)
* Not exposed to users (fixed by the engine, EN-034): best_of 5, temperature ladder, thresholds, VAD parameters, language_detection_segments 4/threshold 0.5.
Browser: a Zod/handwritten validator with identical messages (the UI shows them), run both at job creation and on re-run merge.

### EN-004 Re-run option merge  (PORT; LOW)
Source: `schemas.py:61-73`, `main.py:563-579` (`rerun_job`), `jobs.py:325-354`.
* `RerunRequest` carries the same fields as optional values. Only fields the client explicitly sent are applied (`model_dump(exclude_unset=True)`); an explicit `null` for `language` is honoured (back to Auto). Merged = `JobOptions(**{**job.options, **changes})`, fully re-validated (so changing `model` to a Qwen id without `engine` fails).
* The new job re-uses the same media (hard link or copy), the same title, a fresh id, `origin` = original id and `counted` = original's `counted` (EN-075). Refused with `This job is still in progress.` when the source is queued/running. Re-transcribe "preserves your original language selection, including Auto" (README) - i.e. the stored options, not the detected language, are the base.
Browser: re-run reads the stored `Blob`/OPFS handle; no copy needed.

### EN-005 Model availability, download state, space check, warm-up  (BROWSER; MED)
Source: `engine.py:117-153, 156-176, 179-240`.
* `downloaded` = model present in the local cache (HF cache lookup, TTL 15 s); Qwen via `snapshot_download(local_files_only=True)`.
* Disk-space guard `_check_model_space`: if not downloaded, requires `free >= size_mb * 1.3 MiB`; else error `Not enough disk space to download the '<name>' model: needs about X GB, only Y GB free on the drive holding <dir>. Free some space or set VT_MODEL_DIR to another drive.`
* Warm-up (`warm_up`): preload the default model only if already on disk; never downloads.
Browser: `downloaded` = `caches.match` for all required files of the chosen dtype (or an own manifest in IndexedDB); space check = `navigator.storage.estimate()` (`quota - usage >= bytes * 1.3`), message adapted (no drive); `navigator.storage.persist()`; warm-up = load the last-used downloaded model in the worker after idle. Delete-cached-model action (EC-09) = `caches.delete`.

---

## EN-010 .. EN-015 Audio front end

### EN-010 Decode any media file to 16 kHz mono float32  (BROWSER + ffmpeg.wasm fallback; HIGH)
Source: `engine.py:298-347`.
ffmpeg command: `ffmpeg -v error -nostdin -y -i <path> -vn -map 0:a:0? [-af "<EN-011 chain>"] -ac 1 -ar 16000 -f f32le <tmp>`.
* `-vn`: ignore video. `-map 0:a:0?`: first audio stream only (optional: no error when absent). Files with several audio tracks use track 0.
* The filters run at the SOURCE sample rate and channel layout; the down-mix and resample are appended automatically after the filters (verified ordering by the stereo test in 2.1, where filters ran on both channels with coupled gain).
* Output is float32 little-endian PCM at 16 kHz mono, written to a temp file and memory-mapped.
* Failure mapping (`_ffmpeg_error`): stderr containing `does not contain any stream` or `Output file #0 does not contain` -> `This file has no audio track.`; `Invalid data found` or `moov atom not found` -> `The file is corrupted or not a supported media format.`; otherwise the last stderr line, or `ffmpeg could not read this file.`. A decoded file shorter than 4 bytes -> `This file has no audio track.`.
Browser plan: (1) `AudioDecoder`/WebCodecs with an in-worker demuxer (mp4box.js / mediabunny / WebM parser) producing PCM in streaming chunks, or (2) `decodeAudioData` for small files, (3) `ffmpeg.wasm` (about 30 MB extra download, plan section 4) for MKV/AVI/WMA/AMR and anything the browser rejects. Whichever path is used, the result must be run through EN-011/EN-012 in streaming fashion. Keep the three error messages above verbatim.
Unknown (not verified here): which containers/codecs Chrome/Edge/Safari decode (AC-3, E-AC-3, AMR); the fixtures track (`docs/in-browser/spike/fixtures.md`) owns that probe.

### EN-011 Audio enhancement chain  (PORT; HIGH - must be ported, algorithm validated)
Source: `engine.py:85` `_AUDIO_FILTER = "highpass=f=70,lowpass=f=7800,dynaudnorm=f=200:g=11:p=0.9"`; applied only when `enhance_audio` is true (default). With it off the stream is just down-mixed and resampled.
All three filters run in this order on every channel at the source sample rate `sr`, with double-precision coefficients/state and float32 samples between the filters (the validation rounded to float32 after each biquad and ran dynaudnorm in double).

**1. `highpass=f=70` and 2. `lowpass=f=7800`** - ffmpeg `biquads` defaults: 2 poles, `width_type=q`, `width=0.707`, `mix=1`. RBJ cookbook coefficients:
```
w0 = 2*pi*f/sr ; cw = cos(w0) ; alpha = sin(w0) / (2*0.707)
highpass: b0 = (1+cw)/2 ; b1 = -(1+cw) ; b2 = (1+cw)/2
lowpass : b0 = (1-cw)/2 ; b1 =   1-cw  ; b2 = (1-cw)/2
a0 = 1+alpha ; a1 = -2*cw ; a2 = 1-alpha ; divide all by a0
y[n] = b0*x[n] + z1 ; z1 = b1*x[n] - a1*y[n] + z2 ; z2 = b2*x[n] - a2*y[n]    (direct form II transposed, initial state 0)
```
If `7800 >= sr/2` (sources with sr <= 15600 Hz) ffmpeg's lowpass is degenerate; not reachable for real media (sr >= 16000 gives 7800 < 8000) - keep the guard `if (f >= sr/2) skip`.

**3. `dynaudnorm=f=200:g=11:p=0.9`** (ffmpeg `af_dynaudnorm.c`; defaults used: `m=10` max gain, `r=0` no RMS target, `n=1` channels coupled, `c=0` no DC correction, `b=0` boundary mode normal, `s=0` no compression, `t=0` no threshold, `o=0` no overlap; defaults verified with `ffmpeg -h filter=dynaudnorm`). Validated numerically against ffmpeg 7.1 (section 2.1):
```
frame_len  = lrint(sr * 0.200); frame_len += frame_len % 2          # 200 ms, forced even: 9600 @48k, 8820 @44.1k, 3200 @16k
filter_size g = 11 (forced odd) ; half = g/2 = 5
sigma = ((g/2.0) - 1.0)/3.0 + 1.0/3.0 ; w[i] = exp(-((i-half)^2)/(2*sigma^2)) / (sigma*sqrt(2*pi)) ; normalise sum(w)=1
bound(th, v) = erf(0.8862269254527580136490837416705725913990909172306 * (v/th)) * th      # soft limiter, sqrt(pi)/2
per frame k (frame_len samples; last frame may be shorter):
   peak = max |x| over the frame AND over all channels (coupled)
   gain_k = bound(10, 0.9/peak)    # normal frames; a very quiet frame (-60 dBFS and below) therefore gets the +20 dB cap, i.e. 10
   if peak == 0 (exact digital silence): gain_k = gain_{k-1}, and 10 when k == 0     # EMPIRICAL rule, see note below
history (three queues, per channel; with coupling every channel gets the same values):
   orig: starts empty; on first push prefill with `half` copies of 1.0; push gain_k
   while len(orig) >= g:
       if min-queue empty: prefill it with `half` values:  init = 1.0 ; for i = half+1 .. 2*half: init = min(init, orig[i]); push init
       push min(orig[0..g-1]) to min-queue ; pop front of orig
   while len(min) >= g: push sum(w[i]*min[i]) to smoothed ; pop front of min
frames are emitted one by one: smoothed_k is available after 2*half = 10 further frames have been analysed.
at EOF: flush by analysing synthetic frames whose samples are all 0.9 (= peak value; gain bound(10, 1.0) = 0.99613...) until every real frame has a smoothed gain (10 flush frames).
apply: prev = 1.0 initially ; for each frame: for i in 0..n-1:
          fade_i = i/(frame_len-1) ; amp = prev*(1-fade_i) + cur*fade_i ; out[i] = clip(x[i]*amp, -1, 1) ; then prev = cur
```
The partial last frame uses the first `n` fade factors computed for the full `frame_len`. Reference implementation used in the validation: `$SCR/audio/proto2.py` (`Hist` class, `dyn`) - copy it into `frontend/` tests as the oracle (the scratch directory is not durable; the algorithm above is the contract).
Note on the digital-silence rule (honest limits): the ffmpeg source branch for an all-zero frame was not read. Tested on several signals with exact-zero stretches (leading 1.0 s, 0.5 s hole, 2.4 s hole, 0.7 s tail, 4 s tail, all-zero file): treating a zero frame as "previous frame's gain (10 at the start)" gave RMS error 3e-5..4.3e-5, max 1.2e-3; treating it as plain `bound(10, +inf) = 10` gave the same on short holes but RMS 8.8e-4 / max 0.027 for the 2.4 s hole; treating it as 1.0 failed (1.4e-2). Real recordings almost never contain exact zeros longer than 2 s, and the error is confined to the fade into the next speech frame. Add the two "hole" signals to the golden tests and re-check against a real ffmpeg.wasm run before sign-off.
Memory/streaming: the algorithm needs only 10 frames (2 s) of look-ahead plus the 11-frame windows; process in a streaming pass chunk by chunk so a 4 h file is never held in RAM.
Non-obvious facts for the implementers: (a) the filter runs before the resample, so frame length depends on the source rate; (b) the first ~5 frames (1 s) are barely amplified because the history is pre-filled with gain 1.0; (c) maximum amplification is +20 dB (x10).
Alternative if exact equality is wanted before the port is trusted: `ffmpeg.wasm` with the same `-af` string (slow, +30 MB).

### EN-012 Down-mix, resample, minimum/maximum duration  (BROWSER + PORT; MED)
* Down-mix: `(L + R) * sqrt(1/2)` for stereo (verified 0.8 -> 0.5657, 1.2 total -> 0.8485). Values can exceed 1.0 after the down-mix (the real-video test allows peaks up to 2.0, `test_real_videos.py:107`); do not clip.
* Resample to 16000 Hz with ffmpeg's `swr` default (documented defaults: windowed-sinc, filter size 32, phase shift 10; not measured here). Browser `OfflineAudioContext(1, n, 16000)` is a different resampler; effect on WER not measured. Recommended: implement a polyphase windowed-sinc resampler in the worker (or accept the browser's after measuring WER on the 6 golden videos). Mark "unmeasured".
* Duration rules in `_recognise` (`engine.py:451-460`): `duration = len(samples)/16000`; `< 0.3 s` -> error `The audio is too short to transcribe.`; if `MAX_DURATION_MIN` (public server only: 60) and longer -> `This file is X minutes long; the limit on this server is N minutes.` In the browser there is no server limit; replace by a memory-based soft warning (device track).

### EN-013 Media kind, extension handling, playability  (PORT; LOW)
Source: `jobs.py:108-111, 271-274, 301-315`.
* `title = Path(filename).stem or "Untitled"`; stored extension = `Path(filename).suffix.lower()[:10]`, must match `^\.[a-z0-9]+$` else `.bin`.
* `AUDIO_EXT = {.mp3 .wav .ogg .oga .m4a .aac .flac .opus .wma .amr}` -> `media_kind "audio"`, anything else `"video"`.
* `BROWSER_PLAYABLE = {.mp4 .m4v .webm .ogv .mp3 .wav .ogg .oga .m4a .aac .flac .opus}` -> `playable`. In the browser use `HTMLMediaElement.canPlayType` on the real MIME instead, keep the lists as the fallback / for tests.

### EN-014 Audio preview for non-playable media  (BROWSER; MED)
Source: `engine.py:350-356`, `backends.py:31-32`, `jobs.py:546-547, 580-585`.
When the original is not browser-playable (mkv, avi, wma, amr...), the server writes `preview.mp3`: `-vn -map 0:a:0? -ac 1 -ar 22050 -b:a 48k`. The preview is made inside the killable worker after recognition (cancel wins: no preview after cancel), and `media_url` points to it; `playable` originals are served as is.
Browser: the decoded PCM already exists; build a WAV (mono, 22.05 kHz, 16-bit) or an Opus/MP3 `Blob` from it for the player. WAV of 1 h mono 22.05 kHz 16-bit = 159 MB: prefer encoding with WebCodecs `AudioEncoder` (Opus/AAC) in the worker. Seek must work (player sync). Re-runs reuse it.

### EN-015 Long audio memory strategy  (BROWSER; HIGH)
Python: ffmpeg writes straight to a memory-mapped temp file, so a 4 h recording costs disk, not RAM (`engine.py:298-303`).
Arithmetic: 16 kHz mono float32 = 64,000 B/s -> 1 h = 230 MB, 4 h = 922 MB (Int16 halves it). A full `decodeAudioData` of a 2 h stereo 48 kHz file expands to 2 * 48,000 * 7,200 * 4 B = 2.76 GB before resampling. Safari tab limits are far lower (plan section 4).
Plan: streaming decode -> filter -> resample into an OPFS file (`FileSystemSyncAccessHandle` in the worker) or a list of 30 s Int16/Float32 blocks; the VAD pass and the window loop read ranges. `AudioBuffer`-based decode of the whole file is allowed only below a size threshold chosen by the device track. Keep the temp file "deleted after the job" semantic (OPFS `removeEntry` in `finally`, also on cancel/crash recovery on next start).

---

## EN-020 .. EN-021 Voice activity detection

### EN-020 Silero VAD parameters and post-processing  (PORT; HIGH)
Source: `engine.py:481-482` (`vad_filter=bool(o["vad"])`, `vad_parameters=dict(threshold=0.45, min_silence_duration_ms=500, speech_pad_ms=400)`), faster-whisper `vad.py` (read in full).
Effective `VadOptions`: `threshold=0.45`, `neg_threshold = max(threshold - 0.15, 0.01) = 0.30` (derived), `min_speech_duration_ms=0`, `max_speech_duration_s=inf`, `min_silence_duration_ms=500`, `speech_pad_ms=400`. Constants inside: `window_size_samples=512`, `min_silence_samples_at_max_speech = 16000*98/1000 = 1568`.
Model: `silero_vad_v6.onnx` (the batched-LSTM export that ships with faster-whisper, 1,245,151 bytes, MIT - copy the file from the wheel and host it with the site). Inference exactly as `SileroVADModel.__call__`:
```
pad audio with zeros to a multiple of 512 samples (np.pad(audio, (0, 512 - len % 512)))   # note: a multiple of 512 gets +512 extra zeros
frames = audio.reshape(-1, 512)
context = frames[:, -64:] ; context[-1] = 0 ; context = roll(context, 1, axis=0)          # row i gets the last 64 samples of frame i-1; row 0 gets zeros
input = concat([context, frames], axis=1)  -> shape [n_frames, 576]
speech_probs = session.run({input, h: zeros[1,1,128], c: zeros[1,1,128]})   # LSTM state flows through the frames inside the graph; outputs are probs per frame
```
(The Python code runs all frames in one call when n <= 10000 and chains `h, c` between calls of 10000 frames; do the same.) Frame k covers samples `[512k, 512k+512)`.
`get_speech_timestamps` (state machine; port line by line from `vad.py`, reproduced here):
```
min_speech_samples = 0 ; speech_pad_samples = 16000*400/1000 = 6400 ; min_silence_samples = 8000
max_speech_samples = inf (16000*inf - 512 - 12800)
triggered=false; speeches=[]; current={}; temp_end=0; prev_end=next_start=0
for i, p in enumerate(speech_probs):
    if p >= 0.45 and temp_end: temp_end = 0 ; if next_start < prev_end: next_start = 512*i
    if p >= 0.45 and not triggered: triggered = true ; current.start = 512*i ; continue
    (max-duration split branch never fires: max_speech_samples = inf)
    if p < 0.30 and triggered:
        if not temp_end: temp_end = 512*i
        if 512*i - temp_end > 1568: prev_end = temp_end
        if 512*i - temp_end < 8000: continue
        else: current.end = temp_end ; if current.end - current.start > 0: speeches.push(current)
              current = {}; prev_end = next_start = temp_end = 0; triggered = false ; continue
after loop: if current and (len(audio) - current.start) > 0: current.end = len(audio) ; speeches.push(current)
padding pass: for i, s in speeches:
    if i == 0: s.start = int(max(0, s.start - 6400))
    if i != last:
        gap = speeches[i+1].start - s.end
        if gap < 12800: s.end += int(gap // 2) ; speeches[i+1].start = int(max(0, speeches[i+1].start - gap // 2))
        else:           s.end = int(min(len(audio), s.end + 6400)) ; speeches[i+1].start = int(max(0, speeches[i+1].start - 6400))
    else: s.end = int(min(len(audio), s.end + 6400))
return speeches   # sample indices into the ORIGINAL audio
```
Use JS `Math.floor` for `//` on non-negative values (all values here are non-negative). `p >= threshold` uses float32 probabilities; keep float32 comparison (`Math.fround`) - a probability of exactly 0.45 is vanishingly unlikely, but compare against `Math.fround(0.45)`.
Note: `@ricky0123/vad-web` (named in the plan) is documented as a frame-callback detector with its own positive/negative thresholds and `redemptionMs` / `minSpeechMs` rules (not tested here); do not assume its output equals `get_speech_timestamps`. Port the Python function and run the same ONNX model.
Qwen planner uses the same function with `VadOptions(min_silence_duration_ms=300, speech_pad_ms=100)` (threshold 0.5, neg 0.35, defaults otherwise) - see EN-051.
Golden: on the SAPI fixture described in Appendix B8 (`$SCR/audio/tts_en.wav` on this machine; scratch is not durable, regenerate it) the app options give `[(0.0, 2.832), (2.928, 6.0), (6.096, 8.944), (12.048, 17.52)]` (seconds; samples are these x 16000). Create a fixture-based vitest that compares sample indices exactly (ONNX runtime numerics differ between onnxruntime-cpu and onnxruntime-web; allow +/- 1 frame = 512 samples at boundaries and report the max deviation).
When `vad=false`: no VAD at all; whole audio goes to the decoder.

### EN-021 Speech-chunk concatenation and timestamp restoration  (PORT; MED)
Source: faster-whisper `transcribe.py:887-905` (VAD + concatenate), `1010` (restore), `restore_speech_timestamps` (1844-1872), `vad.py` `SpeechTimestampsMap`.
* With VAD on, `collect_chunks(audio, speech_chunks)` with `max_duration=inf` concatenates ALL speech spans back to back (no padding between them) into one array; `duration_after_vad` = its length. Language detection (EN-031), features and the whole window loop run on this concatenated audio.
* If VAD returns no speech: `collect_chunks` gives one empty array; recognition returns no segments (verified for silence/noise, 2.2). The job finishes `done` with 0 segments.
* After decoding, times are mapped back to the original timeline:
```
SpeechTimestampsMap(chunks): previous_end = 0; silent = 0
  for c in chunks: silent += c.start - previous_end ; previous_end = c.end
                   chunk_end_sample.push(c.end - silent) ; total_silence_before.push(silent/16000)
get_chunk_index(t, is_end): s = int(t*16000) ; if is_end and s in chunk_end_sample: return index_of(s)
                            return min(bisect_right(chunk_end_sample, s), len-1)
get_original_time(t, idx, is_end) = round(total_silence_before[idx] + t, 2)
per segment WITH words: for each word: mid=(w.start+w.end)/2 ; idx=get_chunk_index(mid) ; w.start/end = get_original_time(·, idx)
                        segment.start = words[0].start ; segment.end = words[-1].end
per segment WITHOUT words: start = get_original_time(start) ; end = get_original_time(end, is_end=True)
```
(`bisect.bisect` = `bisect_right`.) Progress and `duration` shown to the user use the ORIGINAL duration `len(audio)/16000`, not `duration_after_vad` (EN-043).


---

## EN-030 .. EN-039 Whisper recognition core (faster-whisper 1.2.1 `WhisperModel.transcribe`, called at `engine.py:468-486`)

The app calls `model.transcribe(audio_float32_16k, **kwargs)` with exactly these arguments (everything else is the library default, listed so nothing is left implicit):

| Argument | Value | Source |
|---|---|---|
| language | `o["language"] or None` | engine.py:469 |
| task | `"transcribe"` or `"translate"` | :470 |
| beam_size | `int(o["beam_size"])` (default 5) | :471 |
| best_of | 5 | :472 |
| temperature | `[0.0, 0.2, 0.4, 0.6, 0.8, 1.0]` | :473 |
| condition_on_previous_text | `bool(o["condition_on_previous"])` (default False) | :474 |
| initial_prompt | `o["prompt"].strip()` or None | :467, :475 |
| compression_ratio_threshold | 2.4 | :476 |
| log_prob_threshold | -1.0 | :477 |
| no_speech_threshold | 0.6 | :478 |
| word_timestamps | `bool(o["word_timestamps"])` (default True) | :479 |
| hallucination_silence_threshold | 2.0 if word_timestamps else None | :480 |
| vad_filter / vad_parameters | `bool(o["vad"])`; `{threshold 0.45, min_silence_duration_ms 500, speech_pad_ms 400}` | :481-482 |
| language_detection_segments | 4 | :483 |
| language_detection_threshold | 0.5 | :484 |
| library defaults that matter | patience 1, length_penalty 1, repetition_penalty 1, no_repeat_ngram_size 0, prompt_reset_on_temperature 0.5, prefix None, suppress_blank True, suppress_tokens [-1], without_timestamps False, max_initial_timestamp 1.0, multilingual False, max_new_tokens None (so `max_length` 448), chunk_length None (30), clip_timestamps "0", hotwords None, prepend_punctuations `"'“¿([{-`, append_punctuations `"'.。,，!！?？:：”)]}、` | transcribe.py:747-790 |

`_supported()` (engine.py:361-364) only drops keyword arguments the installed library does not know; it is a version shim with no browser equivalent.

### EN-030 Features, windows and timing constants  (BUILD; MED)
Source: faster-whisper `feature_extractor.py`, `transcribe.py:699-722`; model `preprocessor_config.json` (verified for turbo and distil-large-v3.5: `feature_size 128`, `n_fft 400`, `hop_length 160`, `chunk_length 30`, `sampling_rate 16000`, `nb_max_frames 3000`; tiny..medium use 80).
```
sr = 16000 ; n_fft = 400 ; hop = 160 ; chunk = 30 s -> n_samples = 480000 ; nb_max_frames = 3000
time_per_frame = 0.01 s ; frames_per_second = 100 ; input_stride = 2 ; tokens_per_second = 50 ; time_precision = 0.02 s ; max_length = 448 tokens
features(waveform):                           # called ONCE on the whole (post-VAD) audio, not per window
   waveform = pad(waveform, 160 zeros at the END only)
   window = hann(401)[:-1]  (periodic, length 400) ; STFT center=True, reflect padding of n_fft/2 on both sides, |.|^2, last frame dropped
   mel = slaney_mel_filters(n_mels) @ power        # n_mels 80 or 128 from preprocessor_config.json; Slaney scale, area-normalised (feature_extractor.py:30-65)
   log = log10(max(mel, 1e-10)) ; log = max(log, GLOBAL_MAX(log) - 8.0) ; features = (log + 4.0) / 4.0
content_frames = features.shape[-1] - 1  (= floor(n_samples / 160)) ; content_duration = content_frames * 0.01
window at seek (frames): segment = features[:, seek : seek + min(3000, content_frames - seek, clip_end - seek)] ; segment = pad_or_trim(segment, 3000)   # zero-pad AFTER normalisation
```
Two details that differ from "just call the Transformers.js feature extractor per 30 s chunk":
1. the `max - 8.0` clamp uses the maximum over the **whole** file, not over each window;
2. the last partial window is padded with zeros in the **feature** domain (value 0.0), not with zero samples before the STFT (silent samples would produce the clamped log-mel value of silence instead of 0.0).
For long files compute the global maximum in a first cheap pass (STFT + mel max only) and normalise windows on demand to avoid holding `n_mels * 100 * duration * 4` bytes (1 h: 115 MB at 80 mels, 184 MB at 128). Port test: compare against the NumPy implementation on `tts_en.wav` (max abs difference < 1e-4).

### EN-031 Language detection  (BUILD; HIGH)
Source: `transcribe.py:922-947` (when `language is None`), `detect_language` (1768-1841); Transformers.js has none (`modeling_whisper.js` `_retrieve_init_tokens`: "TODO: Implement language detection", defaults to English; verified at run time).
```
if language given: language_probability = 1 ; (English-only models would be forced to "en"; none are in the catalog)
else:
   features_for_detection = features[:, seek0 : ]   # seek0 = 0 (clip_timestamps "0"); on the post-VAD audio
   limit = features[..., : 4 * 3000]               # language_detection_segments = 4
   info = {}                                       # language -> [probs] for windows below the threshold
   for each window i of 3000 frames in limit (pad_or_trim to 3000):
       enc = encoder(window)
       probs = softmax over ONLY the language-token logits of decoder step([sot])     # position of <|startoftranscript|>; ids sot+1 .. sot+99 (+yue = sot+100 for 128-mel models)
       (lang, p) = argmax
       if p > 0.5: result = (lang, p) ; break
       info[lang].append(p)
   else:                                           # no window exceeded 0.5
       lang = argmax_by_count(info) (first inserted wins ties) ; p = max(info[lang])
   language_probability = p   (the engine rounds to 3 decimals)
```
Facts: the ">" test is strict; the loop reads at most 4 windows (120 s of post-VAD audio) and stops at the first window with p > 0.5; the 4-window majority vote only happens when every window was <= 0.5. Cost: 1 to 4 extra encoder passes plus 1 decoder step each. Verified examples: TTS fixture -> `en 0.997`; digital silence with language auto -> `en 0.61` and no segments. The softmax is restricted to language tokens (OpenAI semantics; CT2 `detect_language` returns `(token, prob)` pairs over language tokens only - assumed, pin with a golden test on the fixture: p within 0.02 of 0.997 for base).
Exposed to the user: `language`, `language_probability` (UI review prompt, EN-077). Re-run keeps the stored option (`null` stays Auto).
Language token ids come from the tokenizer; `<|yue|>` exists only in the 128-mel family. Languages outside the 61 of A2 can still be *detected* (any of 99/100) - the output language code is shown as-is (UI uppercases unknown names).

### EN-032 Prompt construction (vocabulary hint, previous text)  (BUILD; MED)
Source: `transcribe.py:1131-1135` (initial prompt), `1180` (`previous_tokens`), `1532-1565` (`get_prompt`), `1360-1373` (reset).
```
all_tokens = [] ; prompt_reset_since = 0
if initial_prompt: all_tokens += tokenizer.encode(" " + prompt.strip())          # add_special_tokens=False, leading space is part of the text
per window:
   previous_tokens = all_tokens[prompt_reset_since:]
   prompt = []
   if previous_tokens: prompt = [<|startofprev|>] + previous_tokens[-(448//2 - 1):]        # at most the last 223 tokens
   prompt += [<|startoftranscript|>, <|lang|>, <|task|>]                                    # sot_sequence; English-only models omit lang/task
   (without_timestamps False -> no <|notimestamps|>)
after each window that produced segments:
   all_tokens += tokens of every emitted segment (text AND timestamp tokens)
   if (not condition_on_previous) or temperature_used > 0.5: prompt_reset_since = len(all_tokens)
a window skipped by the no-speech rule or the hallucination rule `continue`s BEFORE this block, so prompt_reset_since is not advanced by skipped windows.
```
Consequences that the port must reproduce (they are observable behaviour of the shipped app):
* With the default `condition_on_previous=false` the vocabulary prompt influences **only the first window that yields text**; windows after it start from an empty context. (The UI says "names, jargon, spelling".) Transformers.js `prompt_ids` would apply to every chunk - not equivalent. Keep the faster-whisper behaviour; if the owner prefers "prompt on every window", that is a deliberate change to record in the decisions log.
* `condition_on_previous=true`: previous text is carried, reset when the window needed temperature > 0.5.
* The prompt string is limited to 1000 characters by validation; token truncation to 223 happens on `previous_tokens` only (the initial prompt is part of it).
Vocabulary also never changes VAD, boundaries or the Hinglish step.

### EN-033 Window loop, timestamp parsing, seek advance  (BUILD; MED)
Source: `transcribe.py:1103-1388`, `1024-1100`.
```
content_frames, seek = 0..; while seek < content_frames:
   time_offset = seek*0.01 ; segment_size = min(3000, content_frames - seek) ; segment_duration = segment_size*0.01
   window_end_time = (seek + 3000)*0.01
   encode(pad_or_trim(features[:, seek:seek+segment_size]))
   (result, avg_logprob, temperature, compression_ratio) = generate_with_fallback(...)          # EN-034/035
   no-speech skip (EN-036): seek += segment_size ; continue
   tokens = result.sequences_ids[0]                                                              # generated tokens (timestamp + text), without EOT
   current_segments, seek, single_timestamp_ending = split_segments_by_timestamps(tokens, time_offset, segment_size, segment_duration, seek)
   if word_timestamps: add_word_timestamps(...) (EN-037) ; if not single_timestamp_ending: last_word_end = end of the last word of the last segment with words ; if last_word_end > time_offset: seek = round(last_word_end*100)
   hallucination guard (EN-038)
   emit segments: skip a segment if start == end or text.strip() == "" ; text = decode(tokens < eot)      # timestamps tokens removed by the decoder
```
`split_segments_by_timestamps(tokens, ...)`, with `ts_begin = <|0.00|>` id (= `<|notimestamps|>` + 1):
```
single_timestamp_ending = len(tokens) >= 2 and tokens[-2] < ts_begin <= tokens[-1]
consecutive = [i for i in 1..len-1 if tokens[i] >= ts_begin and tokens[i-1] >= ts_begin]
if consecutive:
    slices = consecutive (+ [len(tokens)] if single_timestamp_ending)
    for each slice end: sliced = tokens[last:end] ; start = time_offset + (sliced[0]-ts_begin)*0.02 ; end = time_offset + (sliced[-1]-ts_begin)*0.02 ; segment{start,end,tokens=sliced}
    seek += segment_size if single_timestamp_ending else (tokens[last_slice-1]-ts_begin) * input_stride(2)      # seek in frames
else:
    duration = segment_duration ; ts = [t for t in tokens if t >= ts_begin]
    if ts and ts[-1] != ts_begin: duration = (ts[-1]-ts_begin)*0.02
    one segment{start=time_offset, end=time_offset+duration, tokens=tokens} ; seek += segment_size
```
Each segment is one "sentence-ish" unit chosen by the model's own timestamp tokens (typically 2-12 s); there is no further splitting or merging in the app, so segment boundaries in the transcript (and the live stream granularity) come from here.

### EN-034 Decoding: beam search, sampling and logit rules  (BUILD; HIGH)
Source: `transcribe.py:1402-1530` (`generate_with_fallback`) + CTranslate2 `Whisper::generate` (compiled; behaviour assumed equal to OpenAI Whisper's `decoding.py` and verified only through end-to-end golden tests).
* Greedy/beam (`temperature == 0`): `beam_size = o.beam_size` (1..10, default 5), `patience = 1`, `num_hypotheses = 1`, `length_penalty = 1`. Beam search keeps `beam_size` live hypotheses, finished hypotheses end at `<|endoftext|>`; selection by `cum_logprob / length` (length_penalty 1 = divide by generated length). Stop conditions: `beam_size * patience` finished hypotheses (CT2) or `max_length = 448` total tokens including the prompt.
* Sampling (`temperature > 0`): `beam_size 1`, `num_hypotheses = best_of = 5`, `sampling_topk = 0` (sample from the full distribution), logits divided by `temperature`; the best of the 5 by score is returned.
* Logit rules applied before the softmax, at every step (OpenAI `ApplyTimestampRules`, `SuppressBlank`, `SuppressTokens`; CT2 applies the same through `suppress_blank`, `suppress_tokens`, `max_initial_timestamp_index`, `return_scores`):
```
suppress_ids        = 88 ids (82 non-speech symbol tokens + the 6 special tokens transcribe, translate, sot, sot_prev, sot_lm, no_speech); list in Appendix A8 (verified: faster-whisper's `get_suppressed_tokens` output is element-for-element equal to the CTranslate2 `config.json` `suppress_ids` of the local base, medium and large-v3-turbo models, 88 ids each)
suppress_ids_begin  = [220, 50257]   # " " and <|endoftext|> are forbidden at the FIRST generated position (CT2 config.json)
max_initial_timestamp_index = round(1.0 / 0.02) = 50
at each step (tokens = generated so far, excluding the prompt):
   logits[<|notimestamps|>] = -inf
   last_ts = len(tokens)>=1 and tokens[-1] >= ts_begin ; pen_ts = len(tokens)<2 or tokens[-2] >= ts_begin
   if last_ts:  if pen_ts: logits[ts_begin:] = -inf          # a third timestamp in a row is not allowed -> text or EOT
                else:      logits[:eot] = -inf                # after a single timestamp: another timestamp or EOT only
   if any timestamp so far: t_last = tokens' last timestamp (+1 unless last_ts and not pen_ts) ; logits[ts_begin : t_last] = -inf      # timestamps never decrease and each segment has non-zero length
   if len(tokens) == 0: logits[:ts_begin] = -inf ; logits[ts_begin + 50 + 1 :] = -inf                        # first token must be a timestamp <= 1.0 s
   logp = log_softmax(logits) ; if logsumexp(logp[ts_begin:]) > max(logp[:ts_begin]): logits[:ts_begin] = -inf      # timestamp mass beats any text token -> force timestamp
   suppress_ids -> -inf (and suppress_ids_begin at position 0)
```
  Transformers.js 4.3.1's `WhisperTimeStampLogitsProcessor` (logits_process.js:277-345) implements the pair rule and the "timestamp mass" rule only; it lacks the monotonic rule and its `max_initial_timestamp` branch is unreachable (placed after a `continue` for the same condition). Do not reuse it.
* Beam search implementation notes: run the decoder over `beam` rows with a KV cache (`decoder_model_merged` + `use_cache_branch`); after each step reorder every `past_key_values.*` tensor by the surviving beam indices (self-attention keys/values change per beam; cross-attention keys/values are identical across beams and can be expanded once). For `beam_size=1` use the plain greedy path (also used by the sampling path with `num_hypotheses` rows). Peak memory scales with `beam_size`; default 5 is what the user has today. On WebGPU a batched decoder call of 5 rows costs about one call; on WASM it is slower (measure).
* Max length: `max_length = 448` includes the prompt (previous tokens up to 223 + 3-4 prefix tokens); `max_new_tokens` is not set. A window whose decode hits 448 simply ends; the seek logic then handles an unterminated tail (`single_timestamp_ending=false` => advance to the last complete timestamp).

### EN-035 Scores, gates and temperature fallback  (BUILD; HIGH)
Source: `transcribe.py:1402-1530`.
```
for temperature in [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]:
    result = generate(...)                         # beam (T=0) or best_of sampling (T>0), see EN-034
    tokens = result.sequences_ids[0] ; seq_len = len(tokens)
    cum_logprob = result.scores[0] * seq_len^length_penalty        # = sum of log-probs of the generated tokens (CT2 returns it length-normalised)
    avg_logprob = cum_logprob / (seq_len + 1)                       # the +1 is the EOT token
    text = decode(tokens).strip() ; compression_ratio = len(utf8(text)) / len(zlib.compress(utf8(text)))     # zlib default level 6
    needs_fallback = False
    if compression_ratio > 2.4: needs_fallback = True            # "too repetitive"
    else: below_cr_results.append(this)
    if avg_logprob < -1.0: needs_fallback = True                  # low confidence
    if result.no_speech_prob > 0.6 and avg_logprob < -1.0: needs_fallback = False      # looks like silence: accept (it is filtered later)
    if not needs_fallback: break
else:                                                              # every temperature failed
    pick = max(below_cr_results or all_results, key = avg_logprob)      # ties -> first
    temperature_used = 1.0 (the last tried)                       # only matters for prompt reset (> 0.5)
```
Notes: (1) `avg_logprob` is the quantity compared with the thresholds; reproduce it as the mean log-probability over generated tokens + EOT of the **chosen** hypothesis, where each log-probability comes from the log-softmax **after** the logit rules above (OpenAI semantics). (2) `-1.0` is a loose floor: clean speech normally sits far above it (the fixture's mean word probabilities were 0.86-0.98, i.e. per-token log-probs near -0.02..-0.15); `avg_logprob` itself is not stored in the segment, so tests must expose it from the decoder. (3) `compression_ratio` in the browser: `CompressionStream('deflate')` output length (zlib wrapper) or `pako.deflate(level 6)`; zlib versions can differ by a few bytes, which only matters within about 1% of the 2.4 limit. (4) Fallback re-decodes the same window up to six times, so worst-case work is 6x; typical clean speech never falls back. (5) Because `best_of` sampling uses randomness, outputs are not reproducible at T>0; the guards are probabilistic by design. Provide a seedable PRNG for tests only.

### EN-036 No-speech handling  (BUILD; MED)
Source: `transcribe.py:1218-1245`; `engine.py:499-503`.
`no_speech_prob` = softmax(raw logits at the `<|startoftranscript|>` position of the **first** decoder pass, over the full vocabulary)[`<|nospeech|>` id] (id = `no_speech` token; `<|nocaptions|>` for old vocabularies). Raw = before any suppression. With `sot_prev` context the sot position is not 0 - index it by `prompt.index(sot)`.
Two distinct rules use it:
```
(a) window skip, in generate_segments:  should_skip = no_speech_prob > 0.6 ; if avg_logprob > -1.0: should_skip = False ; if should_skip: seek += segment_size ; continue     # nothing emitted for that window
(b) segment filter, in the app (engine.py:500): drop a segment when s.no_speech_prob > 0.6 and s.avg_logprob < -1.0              # note: strict < here; (a) uses > for the opposite test
```
Both operate on the window-level numbers, copied onto every segment of the window (`Segment.avg_logprob`, `no_speech_prob`). `no_speech_prob` is exported rounded to 3 decimals in each segment; `avg_logprob` itself is NOT exported (only `confidence`, EN-041).

### EN-037 Word timestamps and per-word probability  (BUILD; HIGH)
Source: `transcribe.py:1567-1766` (`add_word_timestamps`, `find_alignment`), `merge_punctuations` (1910-1941), `tokenizer.py` (`split_to_word_tokens`).
Needed because the UI underlines uncertain words (`probability < 0.75`, EN-077), the player highlights/jumps by word, SRT/VTT cue timing uses word times (EN-081), and segment `confidence` is the mean word probability (EN-041).
Alignment pass (per window, after decoding), reference = OpenAI `whisper/timing.py::find_alignment` (CT2 `Whisper::align`; equivalence assumed, pin with golden tests):
```
text_tokens = all tokens < eot of ALL segments of the window, concatenated (timestamp tokens removed)
sequence = [*sot_sequence, <|notimestamps|>, *text_tokens, eot]               # teacher forcing, ONE decoder pass without KV cache, cross-attentions returned
logits -> token_probs = softmax(logits[len(sot_sequence) :, :eot])  ; text_token_probs[i] = token_probs[i, text_tokens[i]]        # restricted to text tokens (< eot)
weights = cross_attention of the model's alignment heads (generation_config.alignment_heads, list of [layer, head]) -> [n_heads, n_tokens, 1500]
weights = weights[:, :, : segment_size // 2]                                    # only the real (non-padded) frames
weights = renormalise each head/token row along time so it sums to 1       # OpenAI: softmax(qk * scale) AFTER cropping; with post-softmax attention probabilities, crop then divide by the row sum is mathematically the same. Whether CT2 renormalises is NOT verified - pin with the word tests
weights = (weights - mean(weights, dim=-2)) / std(weights, dim=-2, unbiased=False)
weights = median_filter(weights, width = 7, along the time axis, reflect padding)
matrix = mean(weights over heads)[len(sot_sequence) : -1]                      # rows for [<|notimestamps|>, text tokens...]
text_indices, time_indices = dtw(-matrix)                                      # standard monotonic DTW (steps: diagonal, down, right)
words, word_tokens = split_to_word_tokens(text_tokens + [eot])                 # zh/ja/th/lo/my/yue: split_tokens_on_unicode ; others: split_tokens_on_spaces
word_boundaries = [0] + cumsum(len(t) for t in word_tokens[:-1])
jumps = [True] + diff(text_indices) != 0 ; jump_times = time_indices[jumps] / 50            # tokens_per_second = 50 -> 0.02 s steps
start_times = jump_times[word_boundaries[:-1]] ; end_times = jump_times[word_boundaries[1:]]
word_probability = mean(text_token_probs[i:j]) for the word's token slice
if len(word_tokens) <= 1 or len(word_boundaries) <= 1: no words for this window
```
`split_tokens_on_spaces`: decode each token; a token starts a new word if it is special (>= eot), starts with a space, is punctuation (`string.punctuation`), or is the first; otherwise it extends the previous word. `split_tokens_on_unicode`: a token ends a word when the cumulative decode contains no U+FFFD that the full decode also lacks (handles byte-fallback tokens).
Post-processing (all constants, in `add_word_timestamps`):
```
per alignment (window):
   durations = word durations that are non-zero ; median = min(0.7, median(durations)) (0 if none) ; max_duration = 2*median
   for i in 1..n-1: if (end-start) of word i > max_duration:
        if word[i] in ".。!！?？": end_i = start_i + max_duration
        elif word[i-1] in ".。!！?？": start_i = end_i - max_duration
   merge_punctuations(alignment, prepend='"\'“¿([{-', append='"\'.。,，!！?？:：”)]}、')
      # prepend: walk i from n-2 down to 0; if word[i] starts with a space and word[i].strip() is in prepend: word[j] = word[i] + word[j]; tokens likewise; word[i] = ""   (j = following kept word)
      # append : walk forward; if previous word does not end with a space and the following word is in `append`: previous += following; following = ""
per segment (subsegment) in the window, with time_offset = seek / 100:
   words = non-empty aligned words assigned by consuming alignment entries until the segment's token count is covered:
        word = {word, start = round(time_offset + start, 2), end = round(time_offset + end, 2), probability}
   if words:
       # first word after a pause must not be long
       if words[0].end - last_speech_timestamp > median*4 and (words[0].duration > max_duration or (len(words) > 1 and words[1].end - words[0].start > max_duration*2)):
            if len(words) > 1 and words[1].duration > max_duration:
                 boundary = max(words[1].end/2, words[1].end - max_duration) ; words[0].end = words[1].start = boundary
            words[0].start = max(0, words[0].end - max_duration)
       # prefer the model's own segment start/end if the first/last word is too long
       if seg.start < words[0].end and seg.start - 0.5 > words[0].start: words[0].start = max(0, min(words[0].end - median, seg.start))
       else: seg.start = words[0].start
       if seg.end > words[-1].start and seg.end + 0.5 < words[-1].end: words[-1].end = max(words[-1].start + median, seg.end)
       else: seg.end = words[-1].end
       last_speech_timestamp = seg.end
```
Observed behaviour on the fixture (faster-whisper base): ` Hello` 0.0-0.34 p=0.926; ` everyone,` 0.34-0.94 p=0.905; ` $10` 6.81-7.21 p=0.844; `,000` 7.21-7.89 p=0.982 - words keep their leading space and punctuation stays glued to the word (`everyone,`), numbers can be split into pieces (EN-042).
Why this is HIGH: Transformers.js timings were measured to be shifted by ~one word relative to faster-whisper (mean 0.31 s), it returns no probabilities, and the large-v3 / distil-large-v3 ONNX repos have no attention-exporting `_timestamped` export. Required deliverables: (1) a decoder graph (or an extra graph) that returns cross-attentions of the alignment-head layers only (export script + hosting; the attention tensors for all layers of large-v3 at 448 x 1500 x 20 heads would be too heavy on WebGPU, so select the head layers in the export); (2) the teacher-forced pass above; (3) the post-processing above; (4) golden tests: word start/end within 0.05 s and probability within 0.05 of the CT2 reference JSON for tiny/base/small on the fixtures, and `merge_punctuations` unit tests. Alignment heads per model are in 2.4 (use the CT2 `config.json` values; the turbo main ONNX repo's heads are wrong for turbo).
`word_timestamps=false` path (user option): segments come from timestamp tokens only, no `words`, no guard (EN-038 off), `confidence` from `avg_logprob` (EN-041), and cue re-flow uses synthetic word timing (EN-081).

### EN-038 Hallucination-silence guard  (BUILD; HIGH)
Source: `transcribe.py:1236-1362`; enabled iff `word_timestamps` (threshold 2.0 s).
```
punctuation = '"\'“¿([{-"\'.。,，!！?？:：”)]}、'
word_anomaly_score(w): s = 0 ; if w.probability < 0.15: s += 1 ; d = w.end - w.start ; if d < 0.133: s += (0.133 - d) * 15 ; if d > 2.0: s += d - 2.0
is_segment_anomaly(seg): seg has words ; words = [w for w in seg.words if w.word not in punctuation][:8] ; score = sum(scores) ; return score >= 3 or score + 0.01 >= len(words)
first = first segment with words ; if first and anomaly(first): gap = first.start - time_offset ; if gap > 2.0: seek = previous_seek + round(gap*100) ; continue (emit nothing for this iteration)
hal_last_end = last_speech_timestamp
for si, seg in enumerate(current_segments) with words:
    if anomaly(seg):
        next_seg = next segment after si with words ; hal_next_start = next_seg.words[0].start if next_seg else time_offset + segment_duration
        silence_before = seg.start - hal_last_end > 2.0 or seg.start < 2.0 or seg.start - time_offset < 2.0
        silence_after  = hal_next_start - seg.end > 2.0 or anomaly(next_seg) or window_end_time - seg.end < 2.0
        if silence_before and silence_after:
            seek = round(max(time_offset + 1, seg.start) * 100)
            if content_duration - seg.end < 2.0: seek = content_frames
            current_segments[si:] = [] ; break
    hal_last_end = seg.end
last_speech_timestamp = end of last remaining word
```
This is the "invented text in silence" defence the README calls the hallucination guard. It needs EN-037 output (word durations and probabilities), so the three must ship together. Golden test: craft a window of near-silence followed by speech and verify the suspicious first segment is skipped (use the SAPI fixture with a 3 s pause - the guard did not fire on it; add a synthetic noise-only lead-in).

### EN-039 Translate task  (BUILD; LOW)
`task="translate"` replaces `<|transcribe|>` by `<|translate|>` in the prefix. Output is English text; `language` in the result is the source language (provided or detected); Hinglish conversion is skipped (EN-060); restyle is refused (`This transcript is an English translation; its script cannot be changed.`, jobs.py:459-460); the PDF meta adds "Translated to English"; the job page shows "Hindi -> English" when `language != "en"`. Qwen rejects translate (EN-050). Word timestamps for translate are less reliable (Transformers.js logs a warning; faster-whisper does not).

---

## EN-040 .. EN-046 App-level post-processing (`engine.py`, `backends.py`)

### EN-040 Segment filters and the repetition-loop breaker  (PORT; LOW)
Source: `engine.py:490-521`. Applied to each library segment in order, state `repeats=0, last_norm=None`, `dropped={empty,no_speech,repetition}`:
```
for s in segments:                                   # streamed in time order
    if cancelled(): raise Cancelled
    text = s.text.strip() ; if not text: dropped.empty++ ; continue
    if s.no_speech_prob > 0.6 and s.avg_logprob < -1.0: dropped.no_speech++ ; continue
    n = norm(text) = re.sub(r"[\W_]+", " ", text.lower()).strip()
    repeats = repeats + 1 if n == last_norm else 0 ; last_norm = n                 # last_norm is updated even for dropped segments
    if repeats >= 3: dropped.repetition++ ; continue
    seg = segment_dict(len(out), s) ; Hinglish convert (EN-060) ; seg.setdefault("original_text", s.text.strip()) ; out.append(seg) ; on_segment(...)
```
Resulting rule: of N identical consecutive segments (ignoring case/punctuation) the **first three are kept**, the rest dropped (test: 8x "Thank you." -> 3 kept). A different segment resets the counter. Segment `id` = index in `out` (dense, 0-based, after filtering). Two empty-normalised segments in a row (e.g. "..." and "?") compare equal (`""`), so a run of punctuation-only segments is also cut after 3. JS: `text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim()`. `unicodedata`/`lower()` differences (e.g. final sigma, "İ") are irrelevant for equality of identical strings.
The three counts are logged only (`filtered out segments: ...`); surface them in the browser log.

### EN-041 Segment dict, confidence math  (PORT; LOW)
Source: `engine.py:401-413`. Key order matters for JSON parity:
```
words = [{start: round(w.start,2), end: round(w.end,2), word: w.word, probability: round(w.probability,3)}] ; words = merge_number_pieces(words, s.text)        # EN-042
text  = fix_number_text(s.text.strip())
if words non-empty: conf = mean(w.probability for w in words)         # AFTER the number merge (a merged piece has the mean of its two probabilities), BEFORE Hinglish
else:               conf = exp(clamp(avg_logprob, -10.0, 0.0))         # clamp(x,-10,0) = max(min(x,0),-10)
segment = {id: idx, start: round(s.start,2), end: round(s.end,2), text, words: words or None, confidence: round(conf,3), no_speech_prob: round(s.no_speech_prob,3)}
```
Verified numbers: `avg_logprob=-0.5` -> 0.607; `-100` -> 0.0 (<0.001); `+5.0` -> 1.0; words p 0.9 and 0.7 -> 0.8. Empty `words` list (e.g. word_timestamps=false) -> `None`, and `confidence` falls back to the log-prob form.
Later, `seg.setdefault("original_text", s.text.strip())` appends `original_text` (raw library text, **before** number repair) when Hinglish conversion did not already set it. Quirk to be aware of: for an English segment containing "10 000", `text` is "10,000" but `original_text` is "10 000"; a later "Apply style only" (EN-065) rebuilds `text` from `original_text` and therefore undoes the number repair. Decide whether to keep this (faithful) or fix it (set `original_text` after the repair); if fixed, record it in the decisions log.

### EN-042 Number repair  (PORT; LOW)
Source: `engine.py:371-398`. Whisper writes "ten thousand" as "10 000".
```
THOUSANDS_HEAD = /\d{1,3}(?:,\d{3})*/ (fullmatch) ; THOUSANDS_TAIL = /\d{3}/ (fullmatch) ; ZERO_TRIPLE = /(?<![\d.,])(\d{1,3}(?:,\d{3})*) 000(?!\d)/g
fix_number_text(text) = text.replace(ZERO_TRIPLE, (m, head) => head + ",000")
merge_number_pieces(words, text): out = [] ; for w in words:
     if out and a = out[-1].word.strip() fullmatches HEAD and b = w.word.strip() fullmatches TAIL and (b == "000" or (a + "," + b) in text):
          out[-1].word += "," + b ; out[-1].end = w.end ; if both have probability: out[-1].probability = round((p1+p2)/2, 3) ; continue
     out.append(copy of w)                                   # input is not mutated
```
Verified vectors (tests): `"earns 10 000 a month, 20 000 and 1,250 000 and 250 000"` -> `"earns 10,000 a month, 20,000 and 1,250,000 and 250,000"`; `"call 555 000 now, 3.5 000, 0 000, 1000 000"` -> `"call 555,000 now, 3.5 000, 0,000, 1000 000"`; words `" 10"(0.8) + " 000"(0.6)` -> `" 10,000"` p=0.7, end from the second; chained `" 1" + " 250" + " 000"` with text `"1,250,000 dollars"` -> `" 1,250,000"`; `" 5" + " 100"` with text "5 100" stays two words; the merged word keeps the first word's leading space. The JS regex needs lookbehind (supported in Chrome/Edge/Firefox/Safari 16.4+).

### EN-043 Phases, live segments, progress, ETA  (PORT; LOW)
Source: `engine.py:416-448`, `jobs.py:512-578`, frontend `job.ts:235-245`, `core/format.ts:21-26`.
* Phases in order: `extracting` -> `loading_model` (detail = model id) -> `transcribing`. The model load starts in the background before decoding (`_BackgroundLoad`) so the two overlap; `loading_model` is announced after the audio is decoded. Error before recognition: duration < 0.3 s etc. (EN-012).
* `on_segment(seg, progress, info)` is called for every kept segment as soon as the library yields it: `progress = min(s.end / duration, 1.0)` with `duration = len(audio)/16000` (original timeline) and `info = {language, duration}`. Progress is therefore monotone only if segment ends are; it is capped at 1.0, the job sets 1.0 at completion.
* ETA (jobs.py:537-539): `elapsed = now - time_transcribing_started` (the moment phase `transcribing` is announced); `eta_seconds = round(elapsed / progress - elapsed) if progress > 0.03 and elapsed > 3 else None`; `progress` is stored rounded to 4 decimals. Cleared at finish. UI text: `statusDetail` = `floor(progress*100 + 1e-6)% done` plus `fmtEta`: `< 60 s` -> `max(1, round(s))s left`, else `round(s/60) min left`.
* `status`: `queued` -> `running` (sets `started_at`, clears segments/error) -> `done | error | cancelled`; `_finish` sets `finished_at`, clears `phase`, `eta_seconds`, `cancel_requested`; `progress = 1.0` only on `done`.
* A new job version counter (`_touch`) increments on every change; the UI polls/streams on it. The browser worker posts messages instead: `phase`, `segment` (with `index` for replay), `progress`, `result`, `error`, `cancelled`.
* The first segment arrives only after the first 30 s window (plus language detection) has been decoded, which is the same latency characteristic as today (base on the fixture: first live segment at 5.88 s of 7.18 s total).

### EN-044 Cancellation semantics  (BROWSER; MED)
Source: `engine.py:91, 195-207, 298-340, 458-465, 493-494`, `backends.py:29-30`, `worker.py` (whole), `jobs.py:379-406, 551-558`, `tests/test_worker.py`.
Contract to keep: (1) cancel is honoured while decoding audio (ffmpeg killed, temp removed), while waiting for a model download (returns at once), per recognised segment, and even if the native decoder is blocked (the old worker process tree is killed; the next job spawns a fresh worker and re-loads the model from disk cache); (2) segments already produced stay in the job and are shown; (3) final status `cancelled`, `cancel_requested` shown meanwhile, never counted (EN-075); (4) a job cancelled after the engine returned (race) is still `cancelled`; no audio preview is produced after a cancel; (5) a queued job is cancelled immediately; deleting a running job is refused (`Cancel the running job first.`) but requests the cancel; (6) `close()` of a session cancels everything.
Browser: cooperative flag checked at every decode step, every VAD batch, every 30 s window and between media chunks (target < 300 ms latency); if the worker has not acknowledged in 1.5 s, `worker.terminate()` and respawn lazily (the model weights stay in the Cache API; re-instantiation cost to be measured). Partial segments are already in the main thread's store. Crash recovery: `error` event with `The transcription worker stopped unexpectedly. Try again.` when the worker dies (WebGPU device lost / OOM).

### EN-045 Model lifecycle and background load  (BROWSER; MED)
Source: `engine.py:87-88, 156-207, 210-223`.
One model resident at a time; switching unloads the old one first (`unloading model ... to free memory`; a failed load leaves no stale name). Load errors are wrapped: `Could not load the '<name>' model: <error>`. Loading starts in a background thread before decoding begins and the cancel poll interval while waiting is 0.25 s. Browser: create the ONNX sessions for the next job while the audio is decoded/VAD'd (they use different resources), `await` with cancel polling; release old sessions (`session.release()`) before creating new ones; for WebGPU also destroy the device buffers. First use downloads the weights (progress `loaded/total` event for the UI; EC-02/EC-09).

### EN-046 Engine switch and preview hook (`backends.py`)  (PORT; LOW)
* `engine == "qwen"` -> Qwen adapter; otherwise Whisper. Before running Whisper, a resident Qwen model is dropped (`_model = _name = None`, `gc.collect()`, `torch.cuda.empty_cache()` if available) so two large models never coexist. Browser: same rule (dispose Qwen sessions before creating Whisper sessions and vice versa; EN-056).
* `_preview_to` (server-injected, not in the public schema) triggers EN-014 after a successful, non-cancelled run.

---

## EN-050 .. EN-056 Qwen3-ASR adapter (`qwen_engine.py`)

### EN-050 Overview and constraints  (PORT logic; BUILD runtime; HIGH)
Models: `qwen3-asr-0.6b` -> `Qwen/Qwen3-ASR-0.6B`, `qwen3-asr-1.7b` -> `Qwen/Qwen3-ASR-1.7B` (`qwen_engine.py:10`). Experimental; no word timestamps (`words: null`), no confidence (`confidence: null`), no `language_probability` (`null`), `timing: "chunk"`. Transcribe only (`ValueError: Qwen supports transcription here; select Whisper for English translation.`). Output script Hinglish applies when the language is hi/en (EN-060). Shares phases/segments/result contract with Whisper. Same cancel semantics: `check()` before extraction, after the chunk plan, before and after every decode.
Pipeline: `extract_audio(enhance=o.enhance_audio)` (same EN-010..012 front end, the Qwen path does NOT use the Whisper VAD filter option as such but its own planner) -> duration checks (< 0.3 s error `The audio is too short to transcribe.`) -> `spans = list(chunks(audio, vad=o.vad))` -> if no spans: return `{language: o.language, language_probability: None, duration, segments: []}` **without loading the model** (verified by test) -> `phase("loading_model", model)` -> `phase("transcribing")` -> decode chunk by chunk.

### EN-051 Chunk planner  (PORT; MED)
Source: `qwen_engine.py:17-21, 67-102`; tests `test_backends.py:123-147`.
```
Chunk(start, end, overlap)     # sample offsets into the ORIGINAL audio
chunks(audio, seconds=25, vad=True):
   step = 25*16000 ; if vad: speech = get_speech_timestamps(audio, VadOptions(min_silence_duration_ms=300, speech_pad_ms=100))     # threshold 0.5, neg 0.35, other defaults
                     else:   speech = [{start: 0, end: len(audio)}]
   if no speech: return
   groups: new group when interval.start - previous.end >= 2*16000 (2 s) ; otherwise same group
   for each group: start = group[0].start ; stop = group[-1].end
        breaks = [(a.end + b.start)//2 for consecutive intervals a,b in the group if b.start > a.end]       # midpoints of pauses
        overlap = False
        while start < stop:
             end = min(stop, start + step) ; nearby = [p for p in breaks if start + 0.6*step <= p <= end] ; forced = end < stop
             if forced and nearby: end = nearby[-1] ; forced = False
             yield Chunk(start, end, overlap) ; start = end ; overlap = forced
```
`overlap` is true only for a chunk that follows a forced cut inside continuous speech. Verified on the fixture: two chunks `(0.06-8.644 s)` and `(12.348-17.22 s)`. Test vectors: speech `[0,19 s] [19.4,40 s] [60,65 s]` -> `Chunk(0, 19.2 s), Chunk(19.2 s, 40 s), Chunk(60 s, 65 s)`; `vad=False` on 61 s -> `(0,25,F) (25,50,T) (50,61,T)`; `seconds=0` -> `ValueError("Chunk duration must be positive.")`. Silence gaps >= 2 s are never sent to the model (no invented speech).

### EN-052 Chunk decoding with overlap recovery  (PORT; MED)
Source: `qwen_engine.py:145-199`. Per chunk `(start, end, overlap)`:
```
overlap_samples = min(2*16000, (end - start)//4)
audio_start = max(0, start - overlap_samples) if previous_text and chunk.overlap else start
response = decode(audio_start, end)                              # model.transcribe(audio=(float32 copy of audio[audio_start:end], 16000), language=LANGUAGES.get(o.language) (English name or None), context=o.prompt)
raw_text = response.text.strip()
if audio_start < start: (text, removed) = trim_overlap(previous_text, raw_text) else (text, removed) = (raw_text, 0)
boundary = "pause" ; reasons = [] ; overlap_text = None
if audio_start < start:
    if removed: boundary = "exact_overlap"
    else:                                                        # no reliable textual match: do not guess, decode the non-overlapping audio again
        overlap_text = raw_text ; response = decode(start, end) ; raw_text = text = response.text.strip() ; boundary = "audio_retry" ; reasons.append("boundary_retry")
detected = inverse_languages.get(response.language.lower())      # English name -> code, built from engine.LANGUAGES; unknown -> None
language = language or detected                                  # the FIRST non-null detection (or the user's choice) wins for the whole file
if not text: previous_text = "" ; continue                      # nothing emitted, context cleared
previous_text = raw_text                                         # the raw (untrimmed) text of this chunk is the next overlap reference
if repeated_phrase(text): reasons.append("repeated_phrase")
seg = {id: len(out), start: round(start/16000, 2), end: round(end/16000, 2), text, original_text: text, recognition_text: raw_text,
       overlap_words_removed: removed, boundary_resolution: boundary, review_reasons: reasons, words: None, confidence: None, timing: "chunk", edited: False}
if overlap_text is not None: seg.overlap_recognition_text = overlap_text
if o.output_script == "hinglish" and (detected or language) in ("hi", "en"): seg = convert_segment(seg, o.romanizer)
on_segment(seg, end/len(audio), {language, duration})
```
Notes: progress here is `end / len(audio)` in samples (so it jumps over skipped silence); a cancelled check follows each decode, so a cancel after a decode never triggers the boundary retry (test). `original_text` keeps the Devanagari after overlap removal so restyling does not reintroduce duplicate words. `recognition_text` stores the raw chunk output for audit. The Qwen cost model: a boundary retry doubles decode work for that chunk; continuous speech without pauses forces a cut every 25 s, so most chunks of a lecture incur the retry unless the exact overlap matches.
Tests' vectors: calls for chunks `(0,400000)` and `(400000,800000,overlap)` with no textual match -> audio slices `(0,400000)`, `(368000,432000)`, `(400000,400000)`; second segment `start 25`, `boundary_resolution "audio_retry"`, `review_reasons ["boundary_retry"]`, `overlap_recognition_text` = first retry text. Pause boundaries never re-decode and never remove repeated speech (`"yes we can yes we can"` twice stays in both segments).

### EN-053 `trim_overlap`  (PORT; LOW)
Source: `qwen_engine.py:24-41`.
```
token_key(tok) = "".join(c for c in NFC(tok).casefold() if unicode_category(c)[0] in "LNM")       # letters, numbers, marks only; case-folded
trim_overlap(previous, current, max_words=24):
   left = [token_key(m) for m in regex \S+ over previous] ; right = matches of \S+ over current ; keys = [token_key(m.text) for m in right]
   for size from min(24, len(left), len(keys)) DOWN TO 3 (range stops at 3, i.e. size >= 3):
        if all(keys[:size]) and left[-size:] == keys[:size]:
             return current[right[size-1].end :].lstrip(), size
   return current, 0
```
Rules: only an exact suffix/prefix match of at least 3 tokens counts; empty keys (pure punctuation tokens) block a match; case/punctuation ignored; the longest candidate wins; never fuzzy. Vectors (tests): `("we should maintain discipline daily.", "MAINTAIN discipline daily, and study") -> ("and study", 3)`; `("I think","think think again") -> unchanged, 0`; `("तो उसको कैसे करें?","उसको कैसे करें। फिर देखें") -> ("फिर देखें", 3)`; `("start one two three","one two three") -> ("", 3)`; a 2-word match is ignored. JS: `casefold` ~ `toLowerCase()` after `normalize("NFC")` (differences only for ß/ς-like folds; add a test with "STRASSE"/"straße" if German matters; Python `casefold` maps ß to ss, JS `toLowerCase` does not - use `toLocaleLowerCase` plus an explicit ß -> ss replacement, or a small casefold table), `\p{L}\p{N}\p{M}` for the category filter.

### EN-054 `repeated_phrase` review signal  (PORT; LOW)
Source: `qwen_engine.py:105-113`. `words = [token_key(t) for t in text.split() if token_key(t)]`; for `width` in `3 .. min(12, len(words)//3)`: for `start` in `0 .. len(words) - 3*width`: true if `words[start:start+width] == words[start+width:start+2*width] == words[start+2*width:start+3*width]`. A phrase must repeat 3 times consecutively; `"go go go"` is false (width 1 not tested), `"This is a test. This is a test. This is a test."` true, Hindi triple true, `"mañana veremos física mañana veremos química"` false. It only appends `repeated_phrase` to `review_reasons` (UI: "Some passages need a listening check..."); text is never deleted. Note that Python's `str.split()` splits on all Unicode whitespace.

### EN-055 Qwen language mapping and output script  (PORT; LOW)
Language passed to the model = English name from `engine.LANGUAGES` (e.g. `"Hindi"`), `None` for Auto; the response language name is mapped back through the lowercase inverse table. The returned job language is the user's choice or the first detection. Hinglish conversion condition uses `(detected or language) in ("hi","en")` - `detected` is the detection of the current chunk. Segment key order: as in EN-052, then `convert_segment` adds `romanizer` / `conversion_warning` and updates `text` / `original_text` (EN-064).

### EN-056 Qwen runtime in the browser  (BUILD or SERVER-OPTIONAL; HIGH)
Facts: Transformers.js 4.3.1 has no `qwen3_asr` model type (`src/models/` contains `qwen2`, `qwen2_5_vl`, `qwen3`, `qwen3_vl`, ... but no ASR); the original runs on torch (`qwen_asr`, fp16 on CUDA else fp32 CPU, `max_new_tokens=512`, `max_inference_batch_size=1`, `torch.set_num_threads(CPU_THREADS or 4)`). Community ONNX exports exist on the Hub (e.g. `andrewleech/qwen3-asr-0.6b-onnx`: `encoder.onnx` 745.8 MB, `decoder_init.onnx` + `decoder_step.onnx` + `embed_tokens.bin` 311.2 MB, int4 variants; `rhasspy/qwen3-asr-0.6b-onnx-int4-merged`: `decoder_merged.int4.onnx`, `encoder.int4.onnx`, `embed_tokens.bin`; `csukuangfj2/sherpa-onnx-qwen3-asr-0.6B-int8-2026-03-25`: encoder.int8 182.5 MB + decoder.int8 755.9 MB + conv_frontend 44.1 MB; Apache-2.0). Their browser suitability (WebGPU op coverage, memory, speed, tokenizer, prompt/"context" format, language prompt) is unverified.
Plan: (1) time-boxed spike to run one 0.6B export in onnxruntime-web WebGPU/WASM and compare text with the torch reference on Hindi/English audio; (2) if viable, implement the adapter around EN-051..EN-055 (all logic is model-independent; only `decode(audio_slice, language_name, context) -> {language, text}` is model-specific); (3) if not viable, Qwen stays selectable but is **SERVER-OPTIONAL**: the model picker shows the two Qwen entries, labelled as requiring the self-hosted server, and the engine calls the existing FastAPI route when a server URL is configured; never silently removed. The 1.7B model (3.5 GB catalog size) is unlikely to fit a browser tab on most devices; gate by device memory.

---


## EN-060 .. EN-065 Hinglish (Roman Hindi) pipeline (`hinglish.py`, `indicxlit.py`, `tools/prepare_indicxlit.py`)

### EN-060 When conversion runs  (PORT; MED)
Source: `engine.py:513-514`, `qwen_engine.py:194-195`, `hinglish.py:153-180`.
* Whisper path: convert iff `output_script == "hinglish" and task == "transcribe" and info.language in ("hi", "en")`. `info.language` is the user's language or the detection. Other languages (e.g. Marathi `mr`, which also uses Devanagari) are returned unchanged (test `test_hinglish_default_live_and_final_output`, row `mr`). English text without Devanagari passes through untouched (no `romanizer` key, no `original_text` from the converter).
* Qwen path: `(detected or language) in ("hi","en")` and `output_script == "hinglish"`.
* Live segments and every export use the converted text; the original recognition is kept for restyle (EN-065).
* The conversion runs synchronously per segment before `on_segment`. An exception in the converter aborts the job (message surfaces as the job error) - see EN-062 for what the browser should do instead.

### EN-061 Basic (rule-based) romanizer  (PORT; MED)
Source: `hinglish.py:38-150`; tables in Appendix A5/A6 (generated from the module).
```
_WORDS = /[ऀ-ॣॱ-ॿ]+/g        # Devanagari block minus the danda/double danda/abbreviation sign and the Devanagari digits (U+0964-0970 are excluded on purpose)
_DIGITS translate: ०१२३४५६७८९।॥ -> 0123456789..    # applied to the WHOLE output string after the word substitution (Latin text is unaffected)
romanize_basic(text) = text.replace(_WORDS, romanize_word).translate(_DIGITS)
romanize_word(m):
   word = NFC(m)
   if word in _SPELLINGS (196 entries, A5): return _SPELLINGS[word]
   word = NFD(word)                     # precomposed nukta letters (क़ ख़ ग़ ज़ ड़ ढ़ फ़ य़ ...) become base + U+093C
   syllables = []                       # [consonant_sound, vowel_sound, is_inherent_a]
   i = 0
   while i < len(word):
       ch = word[i]
       if ch in CONSONANTS:                                     # A6 map, 34 letters
           sound = CONSONANTS[ch]
           if word[i+1] == "़": sound = NUKTA.get(ch, sound) ; i += 1          # क->q ख->kh ग->g ज->z ड->r ढ->rh फ->f य->y, others unchanged
           vowel, inherent = "a", True
           if word[i+1] in MARKS: vowel, inherent = MARKS[word[i+1]], False ; i += 1     # vowel signs ा ि ी ु ू ृ ॄ ॢ ॣ ॅ ॆ े ै ॉ ॊ ो ौ
           elif word[i+1] == "्": vowel, inherent = "", False ; i += 1                    # virama: no vowel
           syllables.push([sound, vowel, inherent])
       elif ch in VOWELS: syllables.push(["", VOWELS[ch], False])                        # independent vowels
       elif ch in "ंँ": syllables.push(["n", "", False])                                  # anusvara / chandrabindu -> n
       elif ch == "ः": syllables.push(["h", "", False])
       elif ch not in "़्‌‍": syllables.push([ch, "", False])      # unknown char kept, never dropped (nukta/virama/ZWNJ/ZWJ are consumed silently)
       i += 1
   if len(syllables) > 1 and syllables[-1].inherent: syllables[-1].vowel = ""            # final schwa deletion
   for i from len(syllables)-2 DOWN TO 1:                                                 # medial schwa deletion, right-to-left, uses already-updated neighbours
       if syllables[i].inherent and syllables[i-1].vowel and syllables[i+1].vowel: syllables[i].vowel = ""
   return join(consonant + vowel for each)
```
Everything outside `_WORDS` (Latin, digits, punctuation, other scripts) is preserved. Hindi-inherent behaviour to keep: this is phonetic, not conversational (`भारत -> bhaarat`, `नमस्ते -> namaste`, `पढ़ाई -> parhaaee`, `मुंबई -> munbaee`), so common words rely on the `_SPELLINGS` table (`भारत` is not in it).
Verified outputs (backend venv, basic): भारत bhaarat; नमस्ते namaste; पढ़ाई parhaaee; विद्यार्थी vidyaarthee; प्रश्न prashn; ज्ञान jnyaan; संस्कृत sanskrit; अध्यापक adhyaapak; धन्यवाद dhanyavaad; कृपया kripyaa; दुनिया duniyaa; बच्चों bachchon; सरकार sarkaar; हिन्दुस्तान hindustaan; ऑफिस ophis; क्रिकेट kriket; मुंबई munbaee; चाँद chaand; जिंदगी jindagee; रहता rahtaa; पहला pahlaa. Test vectors: Appendix B (from `test_hinglish.py`). The NFC/NFD behaviour: `romanize(NFC(t)) == romanize(NFD(t))` for "फ़ाइल ज़रा" -> "file zara".
Do not "improve" the rules - every output above is what current users get; changes need the owner's decision and a new golden file.

### EN-062 IndicXlit (trained) path and selection  (PORT logic; BUILD runtime; HIGH)
Source: `hinglish.py:17-35, 138-150, 153-165`.
```
method resolution (convert_segment): romanizer "auto" -> "indicxlit" if (CT2 model folder 'indicxlit-ct2/model.bin' exists  OR  the ai4bharat package is importable) else "basic"; "indicxlit"/"basic" are used as given.
romanize_neural(text, cache): text.replace(_WORDS, m => cache[m] ??= (_SPELLINGS[NFC(m)] || neural(m))).translate(_DIGITS)       # spelling table has priority over the model
neural(word): candidates = model.translit_word(word, lang="hi", topk=1) ; must be a non-empty string matching /^[A-Za-z'-]+$/ else throw RomanizerUnavailable("IndicXlit returned no valid Roman spelling. Review this word or choose Basic romanization.")
loader error (model/package missing): RomanizerUnavailable("IndicXlit is unavailable. Install backend/requirements-indicxlit.txt and run python -m tools.prepare_indicxlit from backend, or choose Basic romanization.")
```
Segment metadata set by `convert_segment`: `romanizer = method` whenever the segment text contains Devanagari; `conversion_warning = "Basic phonetic conversion is being used. Names and unfamiliar words may have awkward spelling."` only for `basic`.
Failure policy today: an exception aborts the whole job (it is raised inside the recognition loop). Browser policy proposal (needs owner OK, record in decisions): `auto` falls back to basic **per job** (set `romanizer:"basic"` and the warning) when the neural model cannot be loaded; an explicit `indicxlit` keeps the hard error (message adapted: "...or choose Basic romanization"); a per-word invalid output (regex mismatch) falls back to the basic romanization of that word instead of aborting.
Caching: a fresh `cache = {}` per `convert_segment` call (segment text and its words share it). The test `test_neural_conversion_only_changes_hindi_words_and_preserves_word_timing` asserts the model is called once per distinct word per call (3 calls for 2 + 1 words over two calls) - "no cross-visitor input cache". In the browser a per-job in-memory `Map` is privacy-neutral and faster, but keep the per-call behaviour in the unit test via an injectable model stub.

### EN-063 IndicXlit model and runtime  (BUILD; HIGH)
Source: `indicxlit.py`, `tools/prepare_indicxlit.py`, `backend/QUALITY.md` ("Trained Roman Hindi conversion").
* Model: official AI4Bharat IndicXlit v1 Indic->Roman checkpoint (MIT). Download: `https://github.com/AI4Bharat/IndicXlit/releases/download/v1.0/indicxlit-indic-en-v1.0.zip` = 124,533,637 bytes (measured). `transformer/indicxlit.pt` is 135,825,281 bytes, SHA-256 `45ffecef88d990ae12f915939b91267a3fc8f69f26331baa59f7932005976f28` (hash check is part of the converter). Vocabularies: `corpus-bin/dict.hi.txt` (source, 7,594 bytes) and `dict.en.txt` (target, 302 bytes).
* Architecture asserted by the converter: Fairseq `transformer`, `encoder_embed_dim = 256`, GELU, pre-norm, `layernorm_embedding`, learned dimensions (layer count / heads read from the checkpoint args), sinusoidal position table of 1026 rows with `padding_idx = 1` (row 1 zeroed), `embed_scale = sqrt(dim)`, decoder start token = `</s>`, `add_source_eos = True`.
* Vocabulary construction (must be reproduced exactly): `["<s>", "<blank>", "</s>", "<unk>"]` + every line of the dict file with its trailing count removed (`line.rsplit(" ", 1)[0]`, duplicates skipped) + language tags `__{lang}__` for `en as bn brx gom gu hi kn ks mai ml mni mr ne or pa sa sd si ta te ur` (skipping ones already present). The checkpoint's embedding row counts must equal these lengths.
* Inference (CTranslate2 today): source tokens = `["__hi__", *characters of NFC(word)]`; `translate_batch(beam_size = max(4, topk) = 4, num_hypotheses = topk = 1, max_decoding_length = 96)`; CT2 int8 on CPU, 2 intra-threads. Output = concatenated hypothesis tokens. Smoke checks in the converter: `नमस्ते -> "namaste"`; `भारत -> "bharat"` or `"bhaarat"`.
* Browser plan: (1) export the PyTorch/Fairseq weights to ONNX (encoder, decoder-with-KV or full-sequence decoder; the model is ~34 M parameters if the checkpoint is fp32 weights only, an estimate from 135.8 MB / 4 B) and quantise to int8 (~35-40 MB expected, unmeasured); (2) implement beam search (beam 4, max 96 steps, length-normalised score like CT2) in TypeScript over those graphs (a character-level model with a ~600-symbol source vocab: decoding a word is tens of steps; negligible vs Whisper); (3) host the ONNX + vocabs next to the site; ship licence + provenance (MIT text is in the converter source). (4) Acceptance: >= 99.5 % exact top-1 agreement with the CT2 model on >= 2,000 distinct Hindi words (take them from Hindi transcripts; a CT2 reference needs `python -m tools.prepare_indicxlit`, which requires `torch==2.9.1` and `omegaconf` - not present on this machine) and 100 % on the spelling-table collisions. Another milestone (M1b in `docs/in-browser/PROGRESS.md`) is already attempting this port; this entry is the behavioural contract it must meet. A Hugging Face search for ready-made ONNX Hindi->Roman IndicXlit models found only an Assamese Roman->native ONNX int8 export (`aaiiaxom/indicxlit-roman-to-assamese-onnx-int8`), i.e. nothing reusable.
* Fallback ladder (never silent): neural -> (auto) basic with the visible conversion warning.

### EN-064 Segment and word mapping  (PORT; MED)
Source: `hinglish.py:153-180`.
```
convert_segment(segment, romanizer):
   result = shallow copy of segment ; method as EN-062 ; cache = {}
   text = romanize(segment.text, method, cache)
   if _WORDS.test(segment.text): result.romanizer = method ; if method == "basic": result.conversion_warning = "<text above>"
   if text != segment.text: result.text = text ; result.original_text = segment.text
   if segment.words (non-empty): result.words = [ {…w, word: converted, original_word: w.word} if romanize(w.word) != w.word else {…w} ]      # same cache -> same spelling in segment and words
```
Properties verified by tests: input segment is not mutated; `start`, `end`, `confidence`, word `start/end/probability` unchanged; `"".join(w.word).strip() == text` when every word converted consistently (the per-word substitution matches because each Devanagari run is a whole word and the space is in the Latin part); an unchanged English segment returns an equal dict (no `original_text` added by the converter). Key order of a converted Whisper segment: `id, start, end, text, words, confidence, no_speech_prob, romanizer, conversion_warning (basic only), original_text` (`original_text` is appended by `update`, `romanizer` by assignment, then `setdefault("original_text")` in the engine - which is a no-op when already set).

### EN-065 "Apply style only" (restyle)  (PORT; MED)
Source: `hinglish.py:183-194`, `jobs.py:450-474`, `main.py:538-554`.
```
restyle_segment(seg, output_script, romanizer="auto"):
   if seg.edited: return copy(seg)                                      # user text is never overwritten
   r = copy(seg) ; r.text = seg.original_text ?? seg.text ; r.original_text = r.text ; delete r.romanizer, r.conversion_warning
   if seg.words: r.words = [ {…w, word: w.original_word ?? w.word} ]    # NB the original_word key stays on the object
   return convert_segment(r, romanizer) if output_script == "hinglish" else r
JobStore.restyle(job, output_script?, romanizer?):
   require status in (done, cancelled) else error "Wait for transcription to finish or cancel it before changing its style."
   refuse if options.task == "translate": "This transcript is an English translation; its script cannot be changed."
   script = output_script ?? options.output_script ; method = romanizer ?? options.romanizer ?? "auto"
   snapshot = deepcopy(segments), language, version      # do the (slow) conversion OUTSIDE the lock
   segments = [restyle_segment(s, script, method) if language in ("hi","en") else copy(s) for s in snapshot]
   if job was replaced or job.version != version: error "The transcript changed during conversion. Try applying the style again."
   commit atomically: job.segments = segments ; job.options = {...options, output_script: script, romanizer: method} ; stats = compute_stats(...) ; version++
   any exception during conversion leaves the job exactly as it was (test_failed_style_conversion_is_atomic)
```
No audio is processed. Qwen jobs (`language` possibly null) are copied unchanged when the job language is neither hi nor en. Mapped to browser: runs in the engine worker (needs the IndicXlit model) with a version check against concurrent edits; pure data transformation on stored segments.

---

## EN-070 .. EN-077 Job model, edits, bookkeeping

### EN-070 Job record and lifecycle  (PORT; LOW)
Source: `jobs.py:301-315, 477-483, 499-578`, `core/models.ts:19-110`.
Fields: `id, title, filename, media_file, size_bytes, origin, counted, media_kind, playable, status, phase, progress, eta_seconds, error, cancel_requested, created_at, started_at, finished_at, language, language_probability, duration, options (DEFAULT_OPTIONS merged), segments, segment_count, stats, version`. Summary row (history list) = `id, title, filename, status, phase, progress, eta_seconds, error, cancel_requested, created_at, started_at, finished_at, language, duration, size_bytes, media_kind, options, segment_count`. Result handling on success: `segments, segment_count, language, language_probability, duration` replaced by the final result; `stats = compute_stats(segments, duration)`; `finish("done")`; then the counter hook (EN-075). An exception in a job marks it `error` with `str(e) or ClassName`, and never stops the queue. Jobs run strictly one at a time (shared scheduler); the browser keeps this: multi-file queue = sequential, one model resident.

### EN-071 Edit segments  (PORT; LOW)
Source: `jobs.py:418-448`, `schemas.py:76-88`.
```
require status == "done" else error "The transcript is not finished yet."
edits = {id: {text (<= 5000 chars), start?, end?, deleted?}} ; unknown ids ignored
for s in segments (order kept):
   e = edits[s.id] ; if e.deleted: drop ; continue
   if e: text = e.text.strip()
         if text != s.text: s.text = text ; s.words = None ; s.edited = True            # word timings/underlines are dropped for edited text; confidence stays
         s.start = max(0.0, float(e.start ?? s.start)) ; s.end = max(s.start + 0.1, float(e.end ?? s.end))    # applied even when only times changed
   keep s
segment_count = len(kept) ; stats = compute_stats(kept, duration) ; version++
```
Ids are NOT renumbered after deletes (gaps are normal; the UI keys by id). An edited segment keeps `original_text`/`recognition_text`/`romanizer`; `edited=true` shields it from restyle. Whitespace-only text becomes `""` and stays in the list (exports skip empty cue text; TXT prints the timestamp with empty text). Exports always use the edited data (EN-080..089). Frontend debounces and saves; autosave details are the UI track's.

### EN-072 Rename  (PORT; LOW)
`title = title.strip()[:200]`, and a blank result keeps the previous title (`jobs.py:408-416`; test: 500-char title -> 200 chars). Default title = file stem. Title is used in exports (MD heading, PDF title, file names).

### EN-073 Re-transcribe  (PORT; LOW)
See EN-004. The new job copies `title` and the stored `options` merged with the request, shares `origin`, and starts `queued`. The original job and its transcript stay; the page navigates to the new job.

### EN-074 Cancel and delete rules  (PORT; LOW)
Queued job + cancel -> `cancelled` at once (`finished_at` set). Running job + cancel -> `cancel_requested=true`, interim state until the engine acknowledges. Delete of a running job: refused with `Cancel the running job first.` (and a cancel is requested); delete of anything else removes the record and media. Jobs of a closed session are cancelled. Browser mapping: delete also removes the stored Blob/OPFS entries (EC-11; platform track).

### EN-075 "Videos transcribed" counter hook  (PORT logic; platform WORKER; LOW)
Source: `jobs.py:485-497, 567-574`, `config.py:61-67`, `stats.py`.
Count exactly once per **uploaded file**, when its first run reaches `done` (not for errors/cancels; a re-run of a counted upload never counts; if the first run failed/cancelled, the first re-run that succeeds counts; all jobs with the same `origin` are marked `counted` when one counts; later deletions never decrement). The counter is only active on the public site (`COUNT_JOBS`). Browser: `POST /count` to the Cloudflare Worker once per origin (platform track PL-017), best-effort and non-blocking; keep `origin`/`counted` in the job record so re-run logic stays identical. No file name or per-visitor data is sent.

### EN-076 Server-only limits (dropped on purpose)  (n/a; documented)
Source: `config.py:43-59`, `jobs.py:168-176, 255-299`, `limits.py`. Dropped because they protect the server: session idle expiry (30 min public / 120 local), `MAX_SESSIONS`, `MAX_QUEUE`, `MAX_JOBS_PER_SESSION` (default 0 = unlimited anyway), `MAX_DURATION_MIN` (public 60), `MAX_UPLOAD_MB` (public 500 / local 4096), per-IP upload rate limit, free-disk floor, `ALLOWED_MODELS`, disk-space check for model download (replaced by storage-quota check, EN-005), upload streaming/size errors (`File is larger than the N MB limit.`, `The uploaded file is empty.` - keep an empty-file check, drop the size limit or replace with a memory warning). Replacement: device-based warnings in the upload page (device track). Nothing user-visible about features is lost; the "free, unlimited" promise becomes literally true.

### EN-077 Review prompts and uncertainty thresholds (data contract with the UI)  (PORT; MED)
Source: `frontend/src/app/features/job/job.ts:195-209`, `transcript.ts:46-47, 152, 300-325`, `formats.py:221` (`low_confidence_segments`), README "Accuracy".
```
word underline levels (transcript.ts): p < 0.5 -> "low", p < 0.75 -> "mid", else none          # needs word probabilities (EN-037)
segment flag (warning mark): confidence != null and confidence < 0.6 and no word underline in that row
stats.low_confidence_segments = count(c < 0.6 over non-null segment confidences)
qualityConcern(job) (first match wins; only when status == done):
   no segments                                                             -> "No speech was transcribed. Check the recording and the selected language."
   any non-edited segment with review_reasons (Qwen)                       -> "Some passages need a listening check because of repeated text or an uncertain speech boundary."
   stats.avg_confidence != null and < 0.6                                  -> "This transcript has low model confidence. Listen to the recording and check the spoken language before using the text."
   options.language == null and language_probability != null and < 0.8    -> "The spoken language could not be identified confidently. Choose the language you hear and try again."
```
Engine obligations: always provide `language`, `language_probability` (null for Qwen and when the user chose a language it is 1.0), per-segment `confidence` (null for Qwen), `words[].probability`, `review_reasons`. The plan's open question "OK to drop the per-word confidence underline?" is answered **no** by the owner rule: it requires EN-037. The wording "Model confidence is not a measured accuracy percentage" must stay.

---

## EN-080 .. EN-089 Exports and analysis (`formats.py`, `pdf.py`)

All exporters are pure functions of `job` (title, filename, language, language_probability, duration, options, stats, segments) and must run in the browser on the edited, stored data.

### EN-080 Timestamp formatting  (PORT; LOW)  `formats.py:26-36`
`ms = max(0, int(round(sec * 1000)))` - **banker's rounding**; use `pyRound`. `h, rem = divmod(ms, 3_600_000); m, rem = divmod(rem, 60_000); s, ms = divmod(rem, 1000)`. Styles: `short` -> `h:mm:ss` if `h` else `mm:ss` (`{h}:{m:02}:{s:02}` / `{m:02}:{s:02}`); `srt` -> `hh:mm:ss,mmm`; `vtt` -> `hh:mm:ss.mmm`. Vectors: `65.5 -> "01:05"`, `3661.2 -> "1:01:01"`, `1.5/srt -> "00:00:01,500"`, `1.5/vtt -> "00:00:01.500"`, `-3 -> "00:00"`, `59.9996/vtt -> "00:01:00.000"`, `0.0004/srt -> "00:00:00,000"`. (The UI's `fmtTime` in `core/format.ts` is a separate floor-based formatter with `--:--` for null; do not conflate.)

### EN-081 Subtitle cue re-flow  (PORT; MED)  `formats.py:12-13, 41-115`
Parameters: `max_chars = 42` (API range 20..80; the UI sends only this one, default 42), `max_lines = 2` (API range 1..3, UI never changes it), `max_dur = 6.0 s`, `min_dur = 0.8 s`, `limit = max_chars * max_lines`; `SENTENCE_END = /[.!?…。！？]['")\]]*$/`, `CLAUSE_END = /[,;:、，；：]['")\]]*$/`; `pause gap > 0.9 s`.
```
tokens(seg): if seg.words: copies of the words (start, end, word with leading space)
             else: parts = text.match(\S+) ; total = sum(len(p)) or 1 ; dur = max(seg.end - seg.start, 0.01) ; t = seg.start
                   for p in parts: d = dur*len(p)/total ; push {start: t, end: t + d, word: " " + p} ; t += d        # edited text has no word times -> evenly spread by character count
cues = [] ; cur = []
flush(): text = join(w.word).strip() ; if text: cues.push({start: cur[0].start, end: cur[-1].end, text: wrap(text, max_chars, max_lines)}) ; cur = []
for seg in segments: for w in tokens(seg):                                   # cues flow ACROSS segment boundaries
    if cur:
        text_len = len(join(cur.word).strip()) ; gap = w.start - cur[-1].end ; dur = cur[-1].end - cur[0].start ; prev = cur[-1].word.strip() ; new_len = text_len + len(w.word)
        if new_len > limit or dur + (w.end - cur[-1].end) > max_dur or gap > 0.9
           or (SENTENCE_END.test(prev) and text_len >= 12) or (CLAUSE_END.test(prev) and text_len >= max_chars * 0.75): flush()
    cur.push(w)
flush()
for i, c in enumerate(cues):                                                  # tidy, in place, in order
    nxt = cues[i+1].start if i+1 < len(cues) else None
    if c.end - c.start < 0.8: c.end = c.start + 0.8
    if nxt is not None and c.end > nxt: c.end = max(c.start + 0.2, nxt)
wrap(text, max_chars, max_lines): text = collapse \s+ to " ", trim ; if len(text) <= max_chars or max_lines < 2: return text
    words = text.split(" ") ; if len(words) == 1: return text
    best over i in 1..len(words)-1: a = join(words[:i]) ; b = join(words[i:]) ; score = max(len(a), len(b)) + (1000 if max(len(a), len(b)) > max_chars else 0) ; keep the FIRST minimum (strict <)
    return a + "\n" + b                                                        # always at most 2 lines, even when max_lines = 3
```
Verified outputs (Python): 40 words `word0..word39.` at 0.4 s spacing (0.35 s duration) -> 4 cues: `[0.0, 5.15] "word0 word1 word2 word3 word4 word5 word6\nword7 word8 word9 word10 word11 word12"`, `[5.2, 9.950000000000001]`, `[10.0, 14.75]`, `[14.8, 15.950000000000001] "word37 word38 word39"`; an edited 10 s segment `"This is a fairly long edited sentence. And here is another one that follows it."` with no words -> two cues `[0, 4.923076923076923] "This is a fairly long edited sentence."` and `[4.923076923076923, 10.0] "And here is another one that follows it."`; `wrap("The quick brown fox jumps over the lazy dog near the river bank today", 42, 2)` -> `"The quick brown fox jumps over the\nlazy dog near the river bank today"`. JS doubles reproduce the same float noise. Use `[...s].length` for `len`.

### EN-082 SRT and WebVTT  (PORT; LOW)  `formats.py:118-128`
```
srt = cues.map((c, i) => `${i+1}\n${ts_srt(c.start)} --> ${ts_srt(c.end)}\n${c.text}\n`).join("\n")        # each block ends with "\n", blocks joined by "\n" => blank line between, file ends with "\n"; no cues -> ""
vtt = "WEBVTT\n\n" + cues.map(c => `${ts_vtt(c.start)} --> ${ts_vtt(c.end)}\n${c.text}\n`).join("\n")
```
Vector (segments `Hello there.` 0-2, `General Kenobi.` 2.5-4, `Third paragraph here.` 10-12, no words): SRT = `"1\n00:00:00,000 --> 00:00:02,000\nHello there.\n\n2\n00:00:02,500 --> 00:00:04,000\nGeneral Kenobi.\n\n3\n00:00:10,000 --> 00:00:12,000\nThird paragraph here.\n"`; VTT = `"WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nHello there.\n\n00:00:02.500 --> 00:00:04.000\nGeneral Kenobi.\n\n00:00:10.000 --> 00:00:12.000\nThird paragraph here.\n"`. Unit tests (kept): numbering/format, long segment split into short cues using word timing (every line <= 42 chars, cue <= 6.5 s, no overlaps), edited segment still splits, sentence/pause splits, cues flow across segment boundaries (`"Let us test whether"` + `"Kubernetes works."` -> one cue).

### EN-083 Text with timestamps (TXT)  (PORT; LOW)  `formats.py:133-135`
`segments.map(s => `[${ts_short(s.start)}] ${s.text}`).join("\n")` (no trailing newline). Vector: `"[00:00] Hello there.\n[00:02] General Kenobi.\n[00:10] Third paragraph here."`.

### EN-084 Paragraphs and plain text  (PORT; LOW)  `formats.py:138-156`
`paragraphs(segments, pause = 1.6, max_chars = 600)`: start a new paragraph before segment `s` when `cur` is non-empty and (`last_end` known and `s.start - last_end > 1.6`) or (`size >= 600` and `SENTENCE_END.test(cur[-1].text)`); `size` accumulates `len(text)` of the paragraph's segments; `last_end = s.end`. `to_plain = paragraphs.map(p => p.map(s => s.text).join(" ")).join("\n\n")`. Vector: segments (0-2 "Hello there."), (2.5-4 "General Kenobi."), (10-12 "Third paragraph here.") -> `"Hello there. General Kenobi.\n\nThird paragraph here."`; the test `One. Two. / Three.` -> `"One. Two.\n\nThree."`. The same grouping drives Markdown and PDF.

### EN-085 Markdown  (PORT; LOW)  `formats.py:159-167`
```
lines = [`# ${title}`, ""]
meta = [`Language: ${language || "unknown"}`, `Duration: ${ts_short(duration || 0)}`, `Model: ${options.model || "?"}`]
lines += [`*${meta.join(" · ")}*`, ""]                               # separator is " · " (U+00B7)
for p in paragraphs(segments): lines += [`**[${ts_short(p[0].start)}]** ` + p.map(s => s.text).join(" "), ""]
return lines.join("\n")                                              # ends with "\n" because the last element is ""
```
Vector for the job above (`language en`, duration 12, model small): `"# T\n\n*Language: en · Duration: 00:12 · Model: small*\n\n**[00:00]** Hello there. General Kenobi.\n\n**[00:10]** Third paragraph here.\n"`. Note `language` is the code (not the display name) here; the PDF uses the display name.

### EN-086 JSON  (PORT; LOW)  `formats.py:184-188`
`{title, filename, language, language_probability, duration, options, stats, segments}` in this key order, missing -> `null`, `JSON.stringify(obj, null, 2)` with real UTF-8 (`ensure_ascii=False`). `options` is the full merged options object; `stats` the EN-087 object; `segments` as stored (including `original_text`, `original_word`, `romanizer`, Qwen's `recognition_text`, `boundary_resolution`, ...; tests assert `"original_text": "तो student है।"` appears). Differences from Python text: float formatting (`0.0` vs `0`) - see gotcha 5. The `title`, `filename` come from the job. `id` of the job and media paths are NOT in the export. Browser: add nothing new here unless required (e.g. an `engine` block with model dtype/device would change the schema - put it inside `options` extras only if the owner agrees).

### EN-087 Stats and keywords  (PORT; MED)  `formats.py:197-223`
```
text = " ".join(s.text for s in segments)
words = text.lower().match(/[^\W\d_][\w'’]*/g)          # Python: letters, then word chars/apostrophes; \w excludes combining marks, so Devanagari words are cut at vowel signs (faithful; Latin Hinglish text is unaffected)
speech = sum(max(0.0, s.end - s.start))
confs = [s.confidence for s in segments if s.confidence != null]
freq = Counter(w.replace("'", "").replace("’", "") for w in words)
keywords = [{word, count} for (w, c) in freq.most_common(80) if len(w) > 3 and w not in STOP][:12]       # top 80 by count (ties: first seen), then filter, then first 12
return {word_count: len(words), segment_count: len(segments), speech_seconds: round(float(speech), 1),
        words_per_minute: round(len(words) / (speech/60)) if speech > 5 else null,
        avg_confidence: round(sum(confs)/len(confs), 3) if confs else null,
        low_confidence_segments: count(c < 0.6 for c in confs), keywords}
```
`STOP` = Appendix A7 (161 words). JS regexes: Python `[^\W\d_]` = letters and non-decimal numerics; use `/[\p{L}\p{Nl}\p{No}][\p{L}\p{N}_'’]*/gu` (closest; marks are excluded on purpose). `Counter` must keep insertion order. Verified vector: two 30 s segments `"Kubernetes deployments don't need Kubernetes expertise, it's good monitoring tools. Café déjà vu naïve résumé."` (conf 0.5) and `"Monitoring Kubernetes clusters is important. Monitoring 123 abc_def x1y2"` (conf 0.9) -> `word_count 23, segment_count 2, speech_seconds 60.0, words_per_minute 23, avg_confidence 0.7, low_confidence_segments 1`, keywords `[kubernetes 3, monitoring 3, deployments 1, need 1, expertise 1, good 1, tools 1, café 1, déjà 1, naïve 1, résumé 1, clusters 1]` (note `don't` -> `dont` is a stop word; `123` is not a word; `abc_def` and `x1y2` are one word each). The fixture run (base): `word_count 34, segment_count 3, speech_seconds 16.1, words_per_minute 127, avg_confidence 0.936, low_confidence_segments 0`. Stats are recomputed after every edit/restyle/delete and shown in the UI (words, pace, confidence, frequent terms that act as search shortcuts).

### EN-088 Export dispatch, MIME, names, parameters  (PORT; LOW)  `formats.py:15-23, 170-192`, `main.py:49, 599-614`
| format | MIME | extension | notes |
|---|---|---|---|
| txt | text/plain; charset=utf-8 | txt | EN-083 |
| plain | text/plain; charset=utf-8 | txt | EN-084 |
| srt | application/x-subrip; charset=utf-8 | srt | max_chars/max_lines |
| vtt | text/vtt; charset=utf-8 | vtt | |
| json | application/json; charset=utf-8 | json | |
| md | text/markdown; charset=utf-8 | md | |
| pdf | application/pdf | pdf | EN-089 |
An unknown format falls back to `txt` inside `render` (the API pattern `^(txt|plain|srt|vtt|json|md|pdf)$` rejects it earlier). Allowed only for finished jobs (`The transcript is not ready yet`). File name = `${job.title}.${ext}` (percent-encoded in `Content-Disposition: attachment; filename*=UTF-8''...`; the browser must sanitise `\ / : * ? " < > |`). Browser: `new Blob([body], {type: mime})` + object URL + `<a download>`; UTF-8 without BOM (as Python). The UI's double-click debounce (1.5 s) and busy flag stay in the UI.

### EN-089 PDF export  (BROWSER print or generator; HIGH)  `pdf.py` (721 lines), `tests/test_pdf.py`
Today (fpdf2 + HarfBuzz, A4 points): page 595.28 x 841.89, margin 62, text width 471.28; title 22/27 pt bold, meta line 9.5 pt muted, optional summary tile row (3 tiles: Words, Duration, Avg. confidence) 46 pt high with rounded 6 pt corners, fill (244,246,249); body 10.5 pt on 16.5 pt leading, paragraph gap 9, timestamp `[mm:ss]` 9 pt bold accent (37,99,235) before each paragraph with a 6 pt gap, ink (31,35,40), muted (107,114,128), rules (222,226,231); running header (title, 8.5 pt, shortened with an ellipsis) from page 2 at y=30 with a rule at y=48; footer on every page: rule at 52 pt from the bottom, left `TranscribeVid - transcribevid.com`, right `Page X of Y` (8 pt); bottom of body at 66 pt; widows/orphans: a paragraph is split across pages only with >= 2 lines on each side; a lone timestamp is never left at the bottom; empty transcript prints `No speech was detected in this recording.`; RTL paragraphs (language in `ar he fa ur yi ps sd ug dv ckb`, or majority RTL letters) right-aligned; fonts are discovered on the machine per script (Segoe UI/Arial/DejaVu/Noto + script fallbacks, CJK by language, symbols), unsupported glyphs become `?`; title in scripts without a bold face is thickened; invisible/control characters stripped, NFC, whitespace collapsed; title <= 300 chars; PDF metadata title + creator `TranscribeVid (transcribevid.com)`. Content rules:
```
meta = ["Language: <display name from A4 | raw code>" if language, "Duration: h:mm:ss" if duration (else max segment end), "Model: <options.model>", "Translated to English" if options.task == "translate"] joined by "  ·  " (two spaces around U+00B7)
summary tiles only when stats present: Words = f"{int(word_count):,}" ; Duration = h:mm:ss (always with hours: "0:12:00") ; Avg. confidence = f"{conf*100:.0f}%" (a value > 1 is treated as already a percentage)
paragraphs = paragraphs(segments with non-empty cleaned text) -> "[mm:ss]" (or "[h:mm:ss]") + " " + joined text
```
Browser plan (from the plan document and verified in section 2.5): print stylesheet + `window.print()` in a hidden iframe/new tab, because the browser's own font fallback handles Hindi, Arabic and CJK without shipping fonts. Verified in Chrome 155 (playwright, `page.pdf`): `@page` margin boxes with `counter(page)`/`counter(pages)` render "Page 1 of 7"; `@page :first` works; a literal title string in `@top-center` shows on pages 2+ (inject the escaped title into a `<style>` at export time; `string-set` does not work); A4 size and margins via `@page { size: A4; margin: 22mm 22mm 24mm }`. Skeleton validated by the probe:
```css
@page { size: A4; margin: 22mm 22mm 24mm;
  @bottom-left  { content: "TranscribeVid - transcribevid.com"; font: 8pt sans-serif; color: #6b7280 }
  @bottom-right { content: "Page " counter(page) " of " counter(pages); font: 8pt sans-serif; color: #6b7280 }
  @top-center   { content: "<ESCAPED TITLE>"; font: 8.5pt sans-serif; color: #6b7280 } }
@page :first { @top-center { content: "" } }
body { font: 10.5pt/16.5pt "Segoe UI", system-ui, sans-serif; color: #1f2328 }  .ts { color: #2563eb; font-size: 9pt; font-weight: 700 }
p { margin: 0 0 9pt; orphans: 2; widows: 2 } p[dir=auto] { unicode-bidi: plaintext }
```
Known gaps vs the Python PDF: (1) Firefox and Safari support for `@page` margin boxes is incomplete (not tested here; from browser documentation, verify on the real browsers) - fall back to a generated fixed footer without "of Y" there or use a JS PDF generator (pdf-lib/jsPDF + embedded Noto fonts + HarfBuzz via `harfbuzzjs`) as the cross-browser path; (2) the user's browser print dialog cannot set the file name or save silently - the UI must say "choose Save as PDF"; (3) text extraction fidelity for Devanagari in the printed PDF was lossy in pypdf (2.5) and must be checked in a real PDF viewer (copy/paste) before sign-off - the Python tests require selectable, searchable text; (4) "?" substitution for unsupported glyphs is replaced by the browser's tofu box. Decision for the owner: print route (zero fonts, system-dependent) vs generator route (identical across devices, ~1-3 MB fonts and a layout engine). The self-hosted server edition keeps the exact fpdf2 output.

---

## EN-090 .. EN-092 Developer tooling that must keep working

### EN-090 Accuracy tooling (`tools/textnorm.py`, `metrics.py`, `align.py`) and the golden regression  (PORT or reuse; MED)
* `textnorm.normalize(text, drop_fillers=True)`: NFKC + lower-case + quote/dash unification + zero-width removal; `U.S.`-style abbreviations; a scanner into words (letters + marks, apostrophes only inside a word), numbers and symbols; English number reading (cardinals to 999,999,999, Indian and western comma grouping, ordinals, decimals, `%`, currency `$ EUR GBP JPY INR KRW`, years 1900-2099, decades, long digit strings digit-by-digit); `and` dropped between magnitude and number words; `VARIANTS` table (ok/okay, all right/alright, per cent/percent, gonna, wanna, gotta, a hundred, ...); fillers `um umm uh uhh uhm er erm hmm hm mm mmm mhm ah` removed; cross-chunk passes keep tokens aligned to input words.
* `metrics.wer(ref, hyp)`: Levenshtein over token lists via `align.align` (rapidfuzz `Levenshtein.opcodes`); `WER = (S + I + D) / max(n_ref, 1)`, accuracy `max(0, 1 - WER)`; `diff_report` prints `REPLACE ref[i:j] hyp[k:l] | ... context ...`; `window_errors`, `segment_errors`, `bootstrap_ci` (2000 resamples, 95 %) exist for reports.
* Golden regression (`test_real_videos.py`): for each of V-1..V-6 cut `[0, 45] s`, transcribe with `{"model": MODEL, "language": "en"}` (and V-3 once with prompt `"BAT246, All-Star, Rookie, Home Plate"`), compare words that START before `45 - 2 = 43 s` with the golden words (same cut), require >= 30 reference words, segments not overlapping by more than 0.3 s, confidences in [0,1], and `WER <= MAX_WER` with `MAX_WER = {"small": 0.10, "medium": 0.07}.get(MODEL, 0.05)` (+0.02 for the prompt test, +0.03 for the API flow). Also: all six decode to > 60 s of speech audio with peak in (0.05, 2.0); live segments arrive in order with non-decreasing progress <= 1.0; exports start with `1\n00:00:`, `WEBVTT`, `[`, `# `, `%PDF`; an edit appears in the plain export.
* **The source videos are not on this machine**; `VT_TEST_VIDEOS` defaults to `~/Desktop/New folder (2)` (absent). Until they are located, step 5 of the plan cannot be run; the golden transcripts alone only allow comparing against transcripts of other audio. Substitute for CI smoke tests: the SAPI fixtures in `frontend/fixtures` (known script, WER 0 expected for base and up).
* Port decision: keep the Python tools (they are development tooling and stay in `backend/` per `PROGRESS.md`) and have the browser test harness export `{segments, language, duration}` JSON that `python -m tools.metrics` scores; or port `normalize` + `wer` to TypeScript (~300 lines, 241 existing Python tests in `test_tools.py` are the oracle) if the check must run in pure Node. The Playwright test measured here already did this ad hoc: WER 0.0 for tiny/base (Transformers.js) vs the script and vs faster-whisper on the SAPI clip.

### EN-091 Offline analysis tools  (keep in Python; n/a for the browser)
`tools/consensus.py` (639 lines; multi-system word voting), `campaign.py`, `reconcile.py`, `deliver.py`, `run_systems.py`, `compare_engines.py` (bounded-time A/B of Whisper small vs Qwen with a killable worker; reports `status completed|timed_out|failed`; no WER without `--reference-verified`), `systems_stage1/2.json`. They produced the golden transcripts and need CT2 models and `rapidfuzz`. Not part of the shipped app; not ported. Their only runtime dependency on the engine is the segment JSON shape (EN-086).

### EN-092 Command line (`cli.py`)  (SERVER-OPTIONAL / dev; LOW)
`python cli.py FILE [--engine whisper|qwen] [--model M] [--romanizer auto|indicxlit|basic] [--lang xx] [--translate] [--output-script hinglish|original] [--prompt ...] [--format txt|plain|srt|vtt|md|json] [-o out]`. Defaults: model `small` (Whisper) or `qwen3-asr-0.6b` (Qwen); prints `[phase detail]` and `NN%` to stderr, writes the chosen export (utf-8) to stdout or `-o`; builds a job dict with stats. No PDF in the CLI. A browser cannot provide a CLI. The backend stays in the repo as the self-hosted edition (`PROGRESS.md`), so this keeps working unchanged. Optional later: a Node CLI built on the same TypeScript engine with `onnxruntime-node` (Transformers.js supports Node; measured in 2.3), producing identical exports.

---

## EN-100 .. EN-102 Out-of-engine capabilities that touch it

### EN-100 YouTube / Instagram link download  (REMOVED by owner decision 2026-10-25; was SERVER-OPTIONAL; HIGH)

> The owner removed this feature because AdSense forbids pages that enable downloading streaming video against the
> provider's terms (`spike/adsense.md` section 3). Commit `3d8d3dc` was reverted. The text below is the record of what
> existed and is not a porting task.
Source: `backend/DOWNLOADS.md`, `downloads*.py`, `download_worker.py`. Today: `yt-dlp[default]>=2026.10.21` + a JS runtime (Node 22+/Deno) for YouTube signature solving + ffmpeg merge, MP4 H.264/AAC up to a chosen height, 500 MB / 60 min / 600 s limits, two workers and 20 slots, per-session isolation, private-IP rejection (SSRF guard), known-domain single-video URLs only, no cookies.
Why it cannot be a pure static-site feature (evidence, 2.6): the page and media endpoints of both sites send no `Access-Control-Allow-Origin` (Instagram also sends `cross-origin-resource-policy: same-origin`), so `fetch()` from transcribevid.com cannot read them; the extraction needs server-side requests with spoofable headers/cookies, the platform's anti-bot checks block datacenter IPs and change weekly (hence the pinned-version yt-dlp), and Cloudflare Workers/Pages cannot run yt-dlp (no subprocess, no long CPU).
Closest alternatives, in order: (1) keep the existing downloader router as an optional service whose URL is configured in the site (the app already isolates it behind `/api/downloads`; PROGRESS.md decision), with the transcript flow unchanged afterwards (the downloaded MP4 is handed to the browser engine like an uploaded file); (2) paste-the-file flow: explain "download the video with your own tool, then drop it here" (works offline); (3) a browser extension or bookmarklet that fetches the media from the user's logged-in tab (user-initiated, platform ToS risk) - not recommended. The UI row must stay visible with a clear "needs the downloader service" message when no service is configured (platform/UI tracks).

### EN-101 Worker/process model  (BROWSER; MED)
`worker.py` runs inference in a spawned process: the API process never loads models; success reuses the child; cancel/crash kills the process tree (`taskkill /T /F` or `killpg`); a fresh child loads the model from disk next time; settings are copied (`MODEL_DIR, TMP_DIR, DEVICE, COMPUTE_TYPE, CPU_THREADS, MAX_DURATION_MIN`); the previous job's transcript is dropped from the idle worker. Browser mapping: one dedicated `Worker` owns models, audio and the engine; the UI thread owns job records and the player; messages are structured-cloned (segments are small); `terminate()` is the equivalent of the process kill; memory is reclaimed by dropping sessions on completion of a job when the next job needs another model; WebGPU buffers are freed explicitly. Threading: ONNX Runtime Web multi-threaded WASM needs cross-origin isolation (COOP/COEP), which the ad plan forbids on ad pages; the engine must run correctly (slower) single-threaded and use threads only on the isolated transcriber page. `VT_CPU_THREADS` (4-6 best on an 8-core laptop, 12+ slower per README) has no direct equivalent; test `numThreads` = `min(4, hardwareConcurrency)` first.

### EN-102 Sessions, privacy and "nothing is kept"  (platform track)
The server promise ("session-only, deleted after 30 idle minutes") becomes "never leaves your device"; persistence decisions D-1 etc. live in `docs/in-browser/parity/platform.md`. Engine obligation: no network request carries audio, text or file names (the only network use is model/asset download from the CDN and the optional counter/downloader endpoints), temp audio in OPFS is removed after every job (EN-015), and `Delete my data` clears job records, Blobs, OPFS temp files and optionally the model cache.

---


## 3. Parity matrix (one row per EN entry)

Verdict key: PORT, BUILD, BROWSER, SERVER-OPT (= SERVER-OPTIONAL). "Test" = the first test that must pass (names are suggestions for the TypeScript suites; Python source in brackets).

| ID | Behaviour | Verdict | Risk | Test that proves parity |
|---|---|---|---|---|
| EN-001 | Model catalogue (9 models) + ONNX repo/dtype map + real sizes | PORT + BROWSER | MED | catalog.spec: 9 ids, order, labels, notes equal A1; all repos resolve (HEAD) in CI |
| EN-002 | 61 languages, Qwen 30 subset, PDF labels | PORT | LOW | languages.spec equals A2/A3/A4 |
| EN-003 | Options defaults + validation messages | PORT | LOW | schemas.spec [test_schemas.py, test_backends.py::test_backend_model_validation] |
| EN-004 | Re-run merge (explicit null language, revalidate) | PORT | LOW | rerun.spec [test_jobs.py::test_rerun_*, test_schemas.py::test_output_script_validation_and_partial_rerun] |
| EN-005 | Downloaded flag, storage check, warm-up | BROWSER | MED | models-cache.e2e (Cache API present/absent, quota low) |
| EN-010 | Decode any container to 16 kHz mono f32 | BROWSER + ffmpeg.wasm | HIGH | decode.e2e on the 29 fixtures; error strings [test_engine.py::test_extract_audio_*] |
| EN-011 | highpass70 + lowpass7800 + dynaudnorm chain | PORT | HIGH | audio-chain.spec vs ffmpeg references (RMS < 5e-5 normal, hole cases documented) |
| EN-012 | Down-mix sqrt(1/2), resample, <0.3 s rule | BROWSER + PORT | MED | resample.spec (WER on golden unchanged +-0.5 pt) |
| EN-013 | Media kind / extension / playable lists | PORT | LOW | media-kind.spec |
| EN-014 | Non-playable preview (mono 22.05 kHz) | BROWSER | MED | preview.e2e (mkv plays + seeks) |
| EN-015 | Long audio memory (OPFS streaming) | BROWSER | HIGH | long-audio.e2e (60 min file, peak memory budget) |
| EN-020 | Silero VAD v6 + `get_speech_timestamps` | PORT | HIGH | vad.spec: sample indices on tts_en.wav equal Appendix B within 512 samples |
| EN-021 | Concatenate speech, restore timestamps | PORT | MED | vad-map.spec (SpeechTimestampsMap vectors) |
| EN-030 | Features (global max clamp, feature-domain padding), windows | BUILD | MED | features.spec vs NumPy on tts_en.wav (max abs diff < 1e-4) |
| EN-031 | Language detection (4 windows, 0.5, vote) | BUILD | HIGH | lang-detect.spec: fixture -> en >= 0.9; silence -> en 0.61 +-0.1; Hindi fixture -> hi |
| EN-032 | Prompt / previous-text semantics | BUILD | MED | prompt.spec (first-window-only; skipped windows keep prompt) |
| EN-033 | Timestamp parsing, seek advance | BUILD | MED | seek.spec (token-sequence vectors) |
| EN-034 | Beam search, sampling, timestamp rules | BUILD | HIGH | decode.spec: greedy == beam1; beam5 >= greedy score; rule unit tests; golden text on fixtures |
| EN-035 | avg_logprob, compression ratio, fallback ladder | BUILD | HIGH | fallback.spec with scripted decoder (forces each branch) |
| EN-036 | no_speech_prob, window skip, segment filter | BUILD | MED | nospeech.spec; silence/noise fixtures -> 0 segments [test_engine.py::test_no_speech_filter_and_blank_text] |
| EN-037 | Word timestamps + probabilities | BUILD | HIGH | words.spec: vs CT2 JSON (+-0.05 s, +-0.05 p) for tiny/base/small; merge_punctuations vectors |
| EN-038 | Hallucination silence guard | BUILD | HIGH | halluc.spec (anomaly score vectors + synthetic window) |
| EN-039 | Translate task | BUILD | LOW | translate.e2e (French or Hindi sample -> English) |
| EN-040 | Empty / no-speech / repetition filters | PORT | LOW | [test_engine.py::test_repetition_*, test_no_speech_*] |
| EN-041 | Segment dict + confidence | PORT | LOW | [test_engine.py::test_segment_dict_*] |
| EN-042 | Number repair | PORT | LOW | [test_engine.py::test_numbers_that_lost_their_comma_*] |
| EN-043 | Phases, progress, ETA | PORT | LOW | eta.spec [formula], job.spec |
| EN-044 | Cancellation (cooperative + terminate) | BROWSER | MED | cancel.e2e [test_worker.py x4, test_engine.py::test_cancel_*] |
| EN-045 | Model lifecycle / background load | BROWSER | MED | lifecycle.spec (one resident model; cancel while loading) |
| EN-046 | Engine switch, preview hook | PORT | LOW | switch.spec [test_backends.py::test_preview_*] |
| EN-050 | Qwen adapter constraints | PORT | HIGH | [test_backends.py::test_qwen_outputs_incremental_chunks_*] |
| EN-051 | Chunk planner | PORT | MED | chunks.spec [test_backends.py::test_chunk_plan_*, test_continuous_speech_*] |
| EN-052 | Overlap decode/retry | PORT | MED | overlap.spec [test_backends.py::test_qwen_overlap_*, test_unmatched_overlap_*, test_pause_boundaries_*, test_cancellation_after_inference_*] |
| EN-053 | trim_overlap | PORT | LOW | [test_backends.py::test_overlap_preserves_*] |
| EN-054 | repeated_phrase | PORT | LOW | [test_backends.py::test_repetition_is_a_language_independent_review_signal] |
| EN-055 | Qwen language mapping | PORT | LOW | part of overlap.spec |
| EN-056 | Qwen runtime | BUILD or SERVER-OPT | HIGH | qwen-spike report: same text as torch on 3 clips, memory/time budget |
| EN-060 | Hinglish trigger rules | PORT | MED | [test_engine.py::test_hinglish_default_live_and_final_output] |
| EN-061 | Basic romanizer + 196 spellings | PORT | MED | [test_hinglish.py x all] + Appendix B table |
| EN-062 | IndicXlit selection / failure policy | PORT + BUILD | HIGH | [test_hinglish.py::test_neural_conversion_*] with a stub model |
| EN-063 | IndicXlit ONNX + beam search | BUILD | HIGH | indicxlit-parity: >= 99.5 % top-1 vs CT2 on >= 2,000 words |
| EN-064 | Segment/word mapping | PORT | MED | [test_hinglish.py::test_segment_keeps_*] |
| EN-065 | Apply style only | PORT | MED | [test_hinglish.py::test_restyle_*, test_jobs.py::test_restyle_*, test_failed_style_conversion_is_atomic, test_concurrent_edit_*] |
| EN-070 | Job record + lifecycle | PORT | LOW | job-store.spec [test_jobs.py] |
| EN-071 | Edit segments | PORT | LOW | [test_jobs.py::test_text_edit_*, test_unchanged_text_*, test_delete_segment_*, test_minimum_duration_*] |
| EN-072 | Rename | PORT | LOW | [test_jobs.py::test_rename_a_job_title] |
| EN-073 | Re-transcribe | PORT | LOW | [test_jobs.py::test_rerun_*] |
| EN-074 | Cancel/delete rules | PORT | LOW | [test_jobs.py::test_cancel_*, test_delete_*] |
| EN-075 | Counter hook | PORT + WORKER | LOW | [test_stats.py, jobs `_count_once` cases] |
| EN-076 | Server-only limits | dropped (documented) | LOW | n/a |
| EN-077 | Review prompts + uncertainty thresholds | PORT | MED | [job.spec.ts / transcript.spec.ts quality cases] |
| EN-080 | Timestamp formats | PORT | LOW | [test_formats.py::test_timestamps] + banker's rounding vectors |
| EN-081 | Cue re-flow | PORT | MED | [test_formats.py::test_long_segment_*, test_edited_segment_*, test_cues_*] + Appendix B |
| EN-082 | SRT / VTT | PORT | LOW | [test_formats.py::test_srt_*, test_vtt_header] + Appendix B strings |
| EN-083 | TXT | PORT | LOW | Appendix B |
| EN-084 | Paragraphs / plain | PORT | LOW | [test_formats.py::test_plain_text_paragraphs] |
| EN-085 | Markdown | PORT | LOW | [test_formats.py::test_render_json_and_md] |
| EN-086 | JSON | PORT | LOW | parse-equal to Python export on golden segments |
| EN-087 | Stats + keywords | PORT | MED | [test_formats.py::test_stats*, test_stats_are_json_serialisable_*] + Appendix B |
| EN-088 | Dispatch, MIME, names, params | PORT | LOW | [test_formats.py::test_render_*] |
| EN-089 | PDF | BROWSER (print) or generator | HIGH | pdf.e2e: 7 scripts, Page X of Y, header on page 2+, empty-transcript text [test_pdf.py semantics] |
| EN-090 | Accuracy tooling + golden regression | PORT or reuse Python | MED | blocked until the 6 source videos are found; interim SAPI fixtures |
| EN-091 | Offline analysis tools | keep Python | LOW | n/a |
| EN-092 | CLI | SERVER-OPT / dev | LOW | server-edition CI |
| EN-100 | Link download | SERVER-OPT | HIGH | [test_downloads.py] on the retained router |
| EN-101 | Process worker -> Web Worker | BROWSER | MED | see EN-044 |
| EN-102 | Privacy / no-network guarantees | BROWSER | LOW | no-upload.e2e (network log shows no audio/text bytes) |

## 4. Test strategy and golden material

1. **Python is the oracle.** Everything marked PORT is pure and gets table-driven vitest suites whose expected values come from the Python implementation: Appendix B has the vectors already produced and Appendix C/D/E have the generators (copy them into `frontend/` tooling so they can be re-run when the Python changes). The existing Python tests are the specification of intent; each maps to a TypeScript test (matrix above). The Python suites remain in `backend/tests` and keep passing because `backend/` stays (PROGRESS decision).
2. **Real-engine references.** For BUILD items, record CT2 reference JSON for `tts_en.wav`-class fixtures with tiny/base/small (exact command in section 2.2: `engine.transcribe(path, {"model": m, "language": null, "output_script": "original"})` with a private model copy and `VT_DATA_DIR` pointing at a temp folder) and compare: text WER = 0 on clean TTS; word times within 0.05 s; word probabilities within 0.05; segment boundaries within 0.3 s; language and probability within 0.02. For noisy/real speech use the golden transcripts once the videos are found.
3. **Hindi/Hinglish.** The machine has no Hindi TTS voice and no Hindi audio, so end-to-end Hinglish tests need a licensed Hindi sample (owner to supply one 30-60 s clip + a reviewed transcript). Unit-level parity is covered by the table-driven romanizer tests and the IndicXlit word list.
4. **Cancellation and failure tests** are behavioural: cancel during decode, during VAD, during model load, while the worker is "stuck" (a test hook that never returns), worker crash, storage quota exceeded, WebGPU unavailable (fallback to WASM), out-of-memory path (clean error, not a dead tab).
5. **Performance budget** (to be set by the device track, not by this document): the Python server reaches small ~2.7-3.4x real time, turbo ~1.5x, medium ~1x on an 8-core CPU (README). Node/CPU q8 numbers measured here (tiny 7-9x, base about 5x on the 17.9 s clip) are not browser numbers; measure in Chrome with WebGPU and WASM before promising anything.

## 5. Decisions the owner (or the engine implementers) must take

| ID | Question | Recommendation |
|---|---|---|
| D-E1 | Vocabulary prompt: faithful (first window only, EN-032) or on every window? | Faithful first; offer "apply to every window" as an experiment after accuracy is measured. |
| D-E2 | `original_text` stores the raw text, so "Apply style only" undoes the number repair on English segments (EN-041). | Fix it (store the repaired text) and add a test; it only improves output. |
| D-E3 | IndicXlit unavailable/invalid output: abort the job (today) or fall back to basic with the warning (EN-062)? | Fall back, visibly. |
| D-E4 | PDF route (EN-089): print stylesheet or JS generator? | Print route first (validated), generator only if Firefox/Safari footer or copy-paste fidelity fails the sign-off check. |
| D-E5 | Qwen: browser runtime if the spike passes, else server-optional (EN-056). | Spike first; never remove the two catalog entries. |
| D-E6 | Word timestamps for large-v3 / distil-large-v3 need our own attention-exporting ONNX (EN-037). | Produce and host the exports; keep the models selectable but block "word timing" claims until they pass the word tests. |
| D-E7 | Resampler (EN-012): browser `OfflineAudioContext` or ported sinc? | Measure WER on the golden set; adopt the browser one only if the difference is < 0.5 pt. |
| D-E8 | JSON export byte-exactness with the Python server (floats like `0.0`). | Parse-equality is enough; document it. |
| D-E9 | Accuracy tooling in Python vs TypeScript (EN-090). | Keep Python; add a thin JSON export from the browser test harness. |
| D-E10 | Beam size 5 default on slow devices: keep and show a realistic ETA, or auto-lower? | Keep the user's setting; the device track may *suggest* beam 1 for WASM + large models, never silently apply it. |
| D-E11 | The six golden source videos are missing. | Owner to restore them (or provide replacements) before plan step 5. |

## 6. Cross-reference to the UI track's engine requirements (`docs/in-browser/parity/ui.md` section 13)

| UI need | Engine entries |
|---|---|
| EC-01 job runner, statuses, queue, error strings | EN-070, EN-043, EN-012 (error texts), EN-010 |
| EC-02 phases, progress, ETA, download progress | EN-043, EN-005, EN-045 |
| EC-03 incremental segments with replay | EN-043 (segment `index` replay) |
| EC-04 cooperative cancel keeping partial segments | EN-044, EN-101 |
| EC-05 word timestamps + probabilities on WebGPU and WASM | EN-037 (requires attention outputs on both backends) |
| EC-06 confidence, no_speech_prob, review_reasons, timing, language, duration | EN-041, EN-036, EN-054, EN-031, EN-077 |
| EC-07 Hinglish, IndicXlit, basic, auto, restyle | EN-060..EN-065 |
| EC-08 Qwen route | EN-050..EN-056 |
| EC-09 model catalogue, downloaded, sizes, persistence, delete | EN-001, EN-005 |
| EC-10 decode, clean-up, VAD, windows, beam, fallback, guards, prompt, translate, language, previous text | EN-010..EN-039 |
| EC-11 persistence of records/segments/Blob | EN-015, EN-070..EN-074 (data shape), platform track |
| EC-12 exporters + `compute_stats` pure functions | EN-080..EN-088 |
| EC-13 PDF route | EN-089 |
| EC-14 player media / preview | EN-013, EN-014 |
| EC-15 device probe, gating | EN-001 (gating), EN-015, EN-101 |
| EC-16 static reference data | EN-001, EN-002 |
| EC-17 counter Worker | EN-075 |
| EC-18 downloader service URL | EN-100 |
| EC-19 in-page log ring buffer | EN-040 (filter counts), EN-043 (phase lines) - log lines listed in the Python code (`vt.engine`, `vt.jobs`) should be mirrored |

## 7. Honest limits of this inventory

* CTranslate2 and the Qwen/torch code were not read as C++/model source; every "assumed" tag marks a behaviour copied from the OpenAI reference or inferred from faster-whisper's Python wrapper. They are pinned only by the golden tests above.
* No browser measurement of Transformers.js speed, WebGPU support, or memory was made in this track (Chrome was used only for the PDF probe); Node/CPU figures are labelled as such.
* The IndicXlit CT2 model, torch and the Qwen weights are not on this machine, so those parities are contracts, not measurements.
* Hindi speech could not be synthesised here; nothing in this document measures Hindi recognition accuracy.
* `docs/in-browser/parity/platform.md` and `ui.md` were produced by other tracks in parallel; cross-references above were checked only against section 13 of `ui.md` and the decisions log in `PROGRESS.md`.

---

## Appendix A. Constant tables (generated from the Python modules by the script in Appendix C, not retyped)

### A1. MODEL_CATALOG (engine.py:34-53, order = UI order)

```json
[{"id": "tiny", "label": "Tiny", "size_mb": 75, "speed": 5, "accuracy": 1, "note": "Fastest, rough drafts only"}, {"id": "base", "label": "Base", "size_mb": 145, "speed": 4, "accuracy": 2, "note": "Fast, clean audio"}, {"id": "small", "label": "Small", "size_mb": 465, "speed": 3, "accuracy": 3, "note": "Good balance (default)"}, {"id": "medium", "label": "Medium", "size_mb": 1500, "speed": 2, "accuracy": 4, "note": "High accuracy, slower"}, {"id": "large-v3-turbo", "label": "Large v3 Turbo", "size_mb": 1600, "speed": 3, "accuracy": 5, "note": "Near-best accuracy, much faster than Large"}, {"id": "large-v3", "label": "Large v3", "size_mb": 3100, "speed": 1, "accuracy": 5, "note": "Best accuracy, slowest"}, {"id": "distil-large-v3", "label": "Distil Large v3", "size_mb": 1500, "speed": 4, "accuracy": 4, "note": "English only, very fast and accurate"}, {"id": "qwen3-asr-0.6b", "label": "Qwen3 ASR 0.6B", "size_mb": 1300, "speed": 2, "accuracy": 0, "note": "Experimental: compare on your audio; chunk timestamps", "engine": "qwen"}, {"id": "qwen3-asr-1.7b", "label": "Qwen3 ASR 1.7B", "size_mb": 3500, "speed": 1, "accuracy": 0, "note": "Experimental: larger model; chunk timestamps", "engine": "qwen"}]
```

### A2. LANGUAGES (61 entries, engine.py:55-68)

Validation accepts only these codes (schemas.py:45-51). `GET /api/languages` returns them sorted by display name.

```json
{"af": "Afrikaans", "ar": "Arabic", "az": "Azerbaijani", "be": "Belarusian", "bg": "Bulgarian", "bn": "Bengali", "bs": "Bosnian", "ca": "Catalan", "cs": "Czech", "cy": "Welsh", "da": "Danish", "de": "German", "el": "Greek", "en": "English", "es": "Spanish", "et": "Estonian", "fa": "Persian", "fi": "Finnish", "fr": "French", "gl": "Galician", "gu": "Gujarati", "he": "Hebrew", "hi": "Hindi", "hr": "Croatian", "hu": "Hungarian", "hy": "Armenian", "id": "Indonesian", "is": "Icelandic", "it": "Italian", "ja": "Japanese", "kk": "Kazakh", "kn": "Kannada", "ko": "Korean", "lt": "Lithuanian", "lv": "Latvian", "mk": "Macedonian", "ml": "Malayalam", "mr": "Marathi", "ms": "Malay", "ne": "Nepali", "nl": "Dutch", "no": "Norwegian", "pa": "Punjabi", "pl": "Polish", "pt": "Portuguese", "ro": "Romanian", "ru": "Russian", "sk": "Slovak", "sl": "Slovenian", "sr": "Serbian", "sv": "Swedish", "sw": "Swahili", "ta": "Tamil", "te": "Telugu", "th": "Thai", "tl": "Tagalog", "tr": "Turkish", "uk": "Ukrainian", "ur": "Urdu", "vi": "Vietnamese", "zh": "Chinese"}
```

### A3. Qwen LANGUAGES (30 codes, qwen_engine.py:11-12; sorted here, source is a set literal)

Note: `yue` is in this set but is NOT in A2, so the API validator rejects it first (effectively unreachable).

```json
["ar", "cs", "da", "de", "el", "en", "es", "fa", "fi", "fr", "hi", "hu", "id", "it", "ja", "ko", "mk", "ms", "nl", "pl", "pt", "ro", "ru", "sv", "th", "tl", "tr", "vi", "yue", "zh"]
```

### A4. PDF language labels (100 entries, pdf.py:60-71)

Used only for the PDF meta line `Language: <name>`; unknown codes print the raw string.

```json
{"en": "English", "zh": "Chinese", "de": "German", "es": "Spanish", "ru": "Russian", "ko": "Korean", "fr": "French", "ja": "Japanese", "pt": "Portuguese", "tr": "Turkish", "pl": "Polish", "ca": "Catalan", "nl": "Dutch", "ar": "Arabic", "sv": "Swedish", "it": "Italian", "id": "Indonesian", "hi": "Hindi", "fi": "Finnish", "vi": "Vietnamese", "he": "Hebrew", "uk": "Ukrainian", "el": "Greek", "ms": "Malay", "cs": "Czech", "ro": "Romanian", "da": "Danish", "hu": "Hungarian", "ta": "Tamil", "no": "Norwegian", "th": "Thai", "ur": "Urdu", "hr": "Croatian", "bg": "Bulgarian", "lt": "Lithuanian", "la": "Latin", "mi": "Maori", "ml": "Malayalam", "cy": "Welsh", "sk": "Slovak", "te": "Telugu", "fa": "Persian", "lv": "Latvian", "bn": "Bengali", "sr": "Serbian", "az": "Azerbaijani", "sl": "Slovenian", "kn": "Kannada", "et": "Estonian", "mk": "Macedonian", "br": "Breton", "eu": "Basque", "is": "Icelandic", "hy": "Armenian", "ne": "Nepali", "mn": "Mongolian", "bs": "Bosnian", "kk": "Kazakh", "sq": "Albanian", "sw": "Swahili", "gl": "Galician", "mr": "Marathi", "pa": "Punjabi", "si": "Sinhala", "km": "Khmer", "sn": "Shona", "yo": "Yoruba", "so": "Somali", "af": "Afrikaans", "oc": "Occitan", "ka": "Georgian", "be": "Belarusian", "tg": "Tajik", "sd": "Sindhi", "gu": "Gujarati", "am": "Amharic", "yi": "Yiddish", "lo": "Lao", "uz": "Uzbek", "fo": "Faroese", "ht": "Haitian Creole", "ps": "Pashto", "tk": "Turkmen", "nn": "Nynorsk", "mt": "Maltese", "sa": "Sanskrit", "lb": "Luxembourgish", "my": "Myanmar", "bo": "Tibetan", "tl": "Tagalog", "mg": "Malagasy", "as": "Assamese", "tt": "Tatar", "haw": "Hawaiian", "ln": "Lingala", "ha": "Hausa", "ba": "Bashkir", "jw": "Javanese", "su": "Sundanese", "yue": "Cantonese"}
```

### A5. _SPELLINGS (196 entries, hinglish.py:38-87, dict order preserved)

Keys are matched against `unicodedata.normalize('NFC', word)`. Duplicate keys in the Python source collapse (last wins).

```json
{"मैं": "main", "में": "mein", "हैं": "hain", "है": "hai", "हूँ": "hoon", "हूं": "hoon", "हां": "haan", "हाँ": "haan", "नहीं": "nahi", "नही": "nahi", "ये": "ye", "यह": "yeh", "वो": "woh", "वह": "woh", "क्या": "kya", "क्यों": "kyun", "क्यूं": "kyun", "क्यूँ": "kyun", "क्योंकि": "kyunki", "कैसे": "kaise", "कैसा": "kaisa", "ऐसे": "aise", "ऐसा": "aisa", "तो": "toh", "हो": "ho", "होता": "hota", "होती": "hoti", "होते": "hote", "हुआ": "hua", "हुई": "hui", "हुए": "hue", "था": "tha", "थी": "thi", "थे": "the", "कि": "ki", "की": "ki", "के": "ke", "को": "ko", "का": "ka", "से": "se", "और": "aur", "या": "ya", "भी": "bhi", "ही": "hi", "एक": "ek", "आप": "aap", "आपको": "aapko", "आपका": "aapka", "आपकी": "aapki", "हम": "hum", "हमें": "humein", "हमारे": "hamare", "हमारी": "hamari", "तुम": "tum", "तुम्हें": "tumhe", "मुझे": "mujhe", "मेरा": "mera", "मेरी": "meri", "मेरे": "mere", "अपने": "apne", "अपनी": "apni", "इस": "is", "उस": "us", "इसको": "isko", "उसको": "usko", "इसमें": "ismein", "वहाँ": "wahan", "यहाँ": "yahan", "जहाँ": "jahan", "कहाँ": "kahan", "बहुत": "bahut", "अच्छा": "achha", "अच्छी": "achhi", "अच्छे": "achhe", "सही": "sahi", "गलत": "galat", "बात": "baat", "भाई": "bhai", "लिए": "liye", "चाहिए": "chahiye", "जैसे": "jaise", "जब": "jab", "अब": "ab", "सब": "sab", "बस": "bas", "अगर": "agar", "फिर": "phir", "लेकिन": "lekin", "कुछ": "kuch", "कोई": "koi", "कभी": "kabhi", "अभी": "abhi", "साथ": "saath", "रहा": "raha", "रही": "rahi", "रहे": "rahe", "रख": "rakh", "कर": "kar", "करना": "karna", "करने": "karne", "करते": "karte", "करो": "karo", "किया": "kiya", "करे": "kare", "करें": "karein", "करेंगे": "karenge", "जाए": "jaaye", "जाये": "jaaye", "जाना": "jaana", "जाता": "jaata", "देख": "dekh", "देखो": "dekho", "समझ": "samajh", "पता": "pata", "समझना": "samajhna", "लड़का": "ladka", "ज़रा": "zara", "नंबर": "number", "दिन": "din", "दस": "das", "बना": "bana", "चली": "chali", "आ": "aa", "आता": "aata", "आती": "aati", "आते": "aate", "रखूं": "rakhun", "रखूँ": "rakhun", "बनाई": "banayi", "बनाए": "banaye", "बनाये": "banaye", "बीच": "beech", "वापस": "wapas", "पीछे": "peechhe", "सकता": "sakta", "सकती": "sakti", "सकते": "sakte", "लगता": "lagta", "उसके": "uske", "उसकी": "uski", "उसका": "uska", "जरूरी": "zaroori", "ज़रूरी": "zaroori", "जरुरी": "zaroori", "पूछिए": "poochhiye", "इंग्लिश": "English", "हिंदी": "Hindi", "हिन्दी": "Hindi", "हिंग्लिश": "Hinglish", "स्टूडेंट": "student", "स्टूडेन्ट": "student", "स्टुडेंट": "student", "स्तुडन्त": "student", "लाइफ": "life", "डिसिप्लिन": "discipline", "डिसिप्लीन": "discipline", "दिसिप्लिन": "discipline", "दिसिप्लेन": "discipline", "इंपॉर्टेंट": "important", "इम्पोर्टेन्ट": "important", "इम्पोर्टेंट": "important", "मेंटेन": "maintain", "मेंटिन": "maintain", "मेंटेनेंस": "maintenance", "सैंपल": "sample", "सैम्पल": "sample", "साम्पल": "sample", "स्ट्रैटेजी": "strategy", "स्ट्रेटेजी": "strategy", "स्टर्टेजी": "strategy", "प्रिपेयर": "prepare", "प्रिपेयरिंग": "preparing", "प्रिपरेशन": "preparation", "टाइम": "time", "स्पीड": "speed", "वीडियो": "video", "ऑडियो": "audio", "ट्रांसक्रिप्ट": "transcript", "मॉडल": "model", "सेटिंग": "setting", "कंप्यूटर": "computer", "मोबाइल": "mobile", "फाइल": "file", "फ़ाइल": "file", "डाउनलोड": "download", "अपलोड": "upload", "बटन": "button", "क्लिक": "click", "क्लास": "class", "टीचर": "teacher", "सर": "sir", "स्कूल": "school", "एग्जाम": "exam", "एग्ज़ाम": "exam", "कोचिंग": "coaching", "नॉर्मल": "normal"}
```

### A6. Basic romanizer maps (hinglish.py:89-94)

```json
{"_VOWELS": {"अ": "a", "आ": "aa", "इ": "i", "ई": "ee", "उ": "u", "ऊ": "oo", "ऋ": "ri", "ॠ": "ri", "ऌ": "li", "ॡ": "li", "ऍ": "e", "ऎ": "e", "ए": "e", "ऐ": "ai", "ऑ": "o", "ऒ": "o", "ओ": "o", "औ": "au"}, "_MARKS": {"ा": "aa", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo", "ृ": "ri", "ॄ": "ri", "ॢ": "li", "ॣ": "li", "ॅ": "e", "ॆ": "e", "े": "e", "ै": "ai", "ॉ": "o", "ॊ": "o", "ो": "o", "ौ": "au"}, "_CONSONANTS": {"क": "k", "ख": "kh", "ग": "g", "घ": "gh", "ङ": "ng", "च": "ch", "छ": "chh", "ज": "j", "झ": "jh", "ञ": "ny", "ट": "t", "ठ": "th", "ड": "d", "ढ": "dh", "ण": "n", "त": "t", "थ": "th", "द": "d", "ध": "dh", "न": "n", "प": "p", "फ": "ph", "ब": "b", "भ": "bh", "म": "m", "य": "y", "र": "r", "ल": "l", "व": "v", "श": "sh", "ष": "sh", "स": "s", "ह": "h", "ळ": "l"}, "_NUKTA": {"क": "q", "ख": "kh", "ग": "g", "ज": "z", "ड": "r", "ढ": "rh", "फ": "f", "य": "y"}, "_DIGITS(translate: char -> char)": {"०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9", "।": ".", "॥": "."}, "_WORDS_regex": "[\\u0900-\\u0963\\u0971-\\u097f]+"}
```

### A7. Keyword stop words (161 words, formats.py:197-204; sorted here, used only for membership)

```json
["a", "about", "above", "after", "again", "all", "also", "am", "an", "and", "any", "are", "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "cant", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "get", "going", "gonna", "got", "had", "has", "have", "having", "he", "her", "here", "heres", "hers", "herself", "him", "himself", "his", "how", "i", "if", "ill", "im", "in", "into", "is", "isnt", "it", "its", "itself", "ive", "just", "know", "let", "lets", "like", "me", "more", "most", "my", "myself", "no", "nor", "not", "now", "of", "off", "okay", "on", "once", "one", "only", "or", "other", "our", "ours", "ourselves", "out", "over", "own", "really", "same", "she", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "thing", "things", "this", "those", "through", "to", "too", "under", "until", "up", "very", "wanna", "was", "wasnt", "we", "were", "werent", "what", "whats", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "wouldnt", "yeah", "you", "your", "youre", "yours", "yourself", "yourselves", "youve"]
```

### A8. Suppressed token ids (EN-034)

Verified equal to the CTranslate2 `config.json` `suppress_ids` of the local base, medium and large-v3-turbo models; `suppress_ids_begin` there is `[220, 50257]`.

```json
{"non_speech_tokens (82 ids, identical for every Whisper vocabulary; computed from faster-whisper `Tokenizer.non_speech_tokens`)": [1, 2, 7, 8, 9, 10, 14, 25, 26, 27, 28, 29, 31, 58, 59, 60, 61, 62, 63, 90, 91, 92, 93, 359, 503, 522, 542, 873, 893, 902, 918, 922, 931, 1350, 1853, 1982, 2460, 2627, 3246, 3253, 3268, 3536, 3846, 3961, 4183, 4667, 6585, 6647, 7273, 9061, 9383, 10428, 10929, 11938, 12033, 12331, 12562, 13793, 14157, 14635, 15265, 15618, 16553, 16604, 18362, 18956, 20075, 21675, 22520, 26130, 26161, 26435, 28279, 29464, 31650, 32302, 32470, 36865, 42863, 47425, 49870, 50254]}
```

Special token ids per family (read from the local `tokenizer.json` files):

```json
{
 "80-mel family (tiny, base, small, medium; vocabulary 51865)": {
  "eot": 50257,
  "sot": 50258,
  "languages": "50259..50357 (99 languages in the alphabetical `_LANGUAGE_CODES` order of faster-whisper; en = 50259, zh = 50260, hi = 50276)",
  "translate": 50358,
  "transcribe": 50359,
  "sot_lm": 50360,
  "sot_prev": 50361,
  "no_speech": 50362,
  "no_timestamps": 50363,
  "timestamp_begin (<|0.00|>)": 50364,
  "suppress_ids = non_speech + [sot, translate, transcribe, sot_lm, sot_prev, no_speech]": 88
 },
 "128-mel family (large-v3, large-v3-turbo, distil-large-v3; vocabulary 51866)": {
  "eot": 50257,
  "sot": 50258,
  "languages": "50259..50358 (100 languages; yue = 50358 is last)",
  "translate": 50359,
  "transcribe": 50360,
  "sot_lm": 50361,
  "sot_prev": 50362,
  "no_speech": 50363,
  "no_timestamps": 50364,
  "timestamp_begin (<|0.00|>)": 50365,
  "suppress_ids": 88
 }
}
```

## Appendix B. Golden vectors produced by the Python implementation (25 Oct 2026)

Produced with the repository code by the scripts in Appendices C and D, plus the real-engine runs of section 2. Other vectors already live in the repository tests and are not repeated: `backend/tests/test_formats.py` (timestamps, SRT/VTT, cues, plain, JSON/MD, stats), `test_hinglish.py:10-22` (8 romanizer pairs), `:62` (spelling-table pairs), `test_engine.py:224-240` (number repair), `test_backends.py:45-52, 123-169, 191-199` (trim_overlap, chunk plans, repetition), `test_jobs.py:181-292` (edit / restyle semantics), `test_schemas.py`.

### B1. Cue re-flow, 40 words (`word0 ... word39.`, word i at `[0.4 i, 0.4 i + 0.35]`, `max_chars=42, max_lines=2, max_dur=6`)
```json
[{"start": 0.0, "end": 5.15, "text": "word0 word1 word2 word3 word4 word5 word6\nword7 word8 word9 word10 word11 word12"},
 {"start": 5.2, "end": 9.950000000000001, "text": "word13 word14 word15 word16 word17 word18\nword19 word20 word21 word22 word23 word24"},
 {"start": 10.0, "end": 14.75, "text": "word25 word26 word27 word28 word29 word30\nword31 word32 word33 word34 word35 word36"},
 {"start": 14.8, "end": 15.950000000000001, "text": "word37 word38 word39"}]
```
### B2. Cue re-flow, edited segment without word times (segment 0-10 s)
`"This is a fairly long edited sentence. And here is another one that follows it."` ->
```json
[{"start": 0, "end": 4.923076923076923, "text": "This is a fairly long edited sentence."},
 {"start": 4.923076923076923, "end": 10.0, "text": "And here is another one that follows it."}]
```
### B3. Text exports for segments `[0-2 "Hello there."]`, `[2.5-4 "General Kenobi."]`, `[10-12 "Third paragraph here."]` (no words), job `{title:"T", language:"en", duration:12, options:{model:"small"}}`
```
SRT : "1\n00:00:00,000 --> 00:00:02,000\nHello there.\n\n2\n00:00:02,500 --> 00:00:04,000\nGeneral Kenobi.\n\n3\n00:00:10,000 --> 00:00:12,000\nThird paragraph here.\n"
VTT : "WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nHello there.\n\n00:00:02.500 --> 00:00:04.000\nGeneral Kenobi.\n\n00:00:10.000 --> 00:00:12.000\nThird paragraph here.\n"
TXT : "[00:00] Hello there.\n[00:02] General Kenobi.\n[00:10] Third paragraph here."
PLAIN: "Hello there. General Kenobi.\n\nThird paragraph here."
MD  : "# T\n\n*Language: en · Duration: 00:12 · Model: small*\n\n**[00:00]** Hello there. General Kenobi.\n\n**[00:10]** Third paragraph here.\n"
JSON: {"title":"T","filename":"t.mp4","language":"en","language_probability":null,"duration":12,"options":{"model":"small"},"stats":{},"segments":[...]}   (indent 2, key order as shown)
```
### B4. `_wrap`
`wrap("The quick brown fox jumps over the lazy dog near the river bank today", 42, 2)` -> `"The quick brown fox jumps over the\nlazy dog near the river bank today"`.

### B5. Stats (two 30 s segments, confidences 0.5 and 0.9)
Text 1: `Kubernetes deployments don't need Kubernetes expertise, it's good monitoring tools. Café déjà vu naïve résumé.`; text 2: `Monitoring Kubernetes clusters is important. Monitoring 123 abc_def x1y2`; duration 60.
```json
{"word_count": 23, "segment_count": 2, "speech_seconds": 60.0, "words_per_minute": 23, "avg_confidence": 0.7, "low_confidence_segments": 1,
 "keywords": [{"word":"kubernetes","count":3},{"word":"monitoring","count":3},{"word":"deployments","count":1},{"word":"need","count":1},{"word":"expertise","count":1},{"word":"good","count":1},{"word":"tools","count":1},{"word":"café","count":1},{"word":"déjà","count":1},{"word":"naïve","count":1},{"word":"résumé","count":1},{"word":"clusters","count":1}]}
```
Real-engine stats on `tts_en.wav` with faster-whisper base: `{"word_count": 34, "segment_count": 3, "speech_seconds": 16.1, "words_per_minute": 127, "avg_confidence": 0.936, "low_confidence_segments": 0, ...}`.

### B6. Hinglish basic romanizer, extra pairs (module output)
`नमस्ते API, भारत!` with `convert_segment(..., "basic")` -> `{"text": "namaste API, bhaarat!", "words": null, "romanizer": "basic", "conversion_warning": "Basic phonetic conversion is being used. Names and unfamiliar words may have awkward spelling.", "original_text": "नमस्ते API, भारत!"}`; `convert_segment({"text":"Hello","words":null}, "basic")` -> `{"text":"Hello","words":null}` (unchanged, no new keys). The 21-word table is in EN-061.

### B7. Number repair and segment dict
`_segment_dict(0, {start 0.0, end 1.0, text " 10 000 a ", words [" 10" 0-0.4 p0.8, " 000" 0.4-0.9 p0.6], avg_logprob -0.3, no_speech_prob 0.01})` -> `{"id":0,"start":0.0,"end":1.0,"text":"10,000 a","words":[{"start":0.0,"end":0.9,"word":" 10,000","probability":0.7}],"confidence":0.7,"no_speech_prob":0.01}`. `_norm("Don't_stop, नमस्ते!") == "don t stop नमस त"`. `trim_overlap("we should maintain discipline daily.", "MAINTAIN discipline daily, and study") == ("and study", 3)`.

### B8. Fixture `tts_en.wav` (Windows SAPI David, 17.87 s, 16 kHz mono; regenerate with the PowerShell in `frontend/fixtures/tools` or the snippet used here: `SpeechSynthesizer.SpeakSsml` with a `<break time='3000ms'/>`)
Script: "Hello everyone, welcome to the show. Today we will talk about speech recognition. It earns ten thousand dollars a month. [3 s pause] After a long pause we continue with the second part of the talk, and we finish here."
* App VAD options: `[(0.0, 2.832), (2.928, 6.0), (6.096, 8.944), (12.048, 17.52)]` s. Qwen planner VAD: `[(0.06,1.22),(1.372,2.532),(3.228,5.7),(6.396,8.644),(12.348,15.876),(16.028,17.22)]` -> chunks `[(0.06, 8.644, False), (12.348, 17.22, False)]`. `chunks(61 s of zeros, vad=False)` -> `[(0,25,False),(25,50,True),(50,61,True)]`.
* faster-whisper base, `language=None`: `en` 0.997; segments `[0.0, 5.38] conf 0.965 nsp 0.011 "Hello everyone, welcome to the show. Today we will talk about speech recognition."`, `[6.33, 15.54] conf 0.984 nsp 0.011 "It earns $10,000 a month. After a long pause we continue with the second part of the talk,"`, `[15.54, 17.0] conf 0.859 nsp 0.213 "and we finish here."`; words e.g. `(" Hello", 0.0, 0.34, 0.926) (" everyone,", 0.34, 0.94, 0.905) (" welcome", 1.38, 1.74, 0.81) (" to", 1.74, 1.98, 0.999) (" the", 1.98, 2.1, 0.986) (" show.", 2.1, 2.38, 0.993) (" It", 6.33, 6.61, 0.964) (" earns", 6.61, 6.81, 0.993) (" $10", 6.81, 7.21, 0.844) (",000", 7.21, 7.89, 0.982) (" a", 7.89, 8.13, 0.987) (" month.", 8.13, 8.45, 0.999) (" and", 15.54, 16.22, 0.476) (" we", 16.22, 16.4, 0.988) (" finish", 16.4, 16.68, 0.974) (" here.", 16.68, 17.0, 0.996)`.
* Transformers.js 4.3.1 (Node, q8, base_timestamped, `language:'en'`): identical text; first words ` Hello [0.34, 0.9]`, ` everyone, [0.9, 1.42]`, ` welcome [1.74, 1.98]`, ` to [1.98, 2.1]`, ` the [2.1, 2.36]` - compare with the faster-whisper times above (the ~one-word shift).
* Silence / noise: 0 segments (language given), auto-language silence -> `en` 0.61.

### B9. ffmpeg audio-chain references
Produced by `proto.py::run_ffmpeg` (raw f32 in, `-af ...`, raw f32 out). To regenerate: `ffmpeg -v error -y -f f32le -ar 48000 -ac 1 -i in.f32 -af "highpass=f=70,lowpass=f=7800,dynaudnorm=f=200:g=11:p=0.9" -ac 1 -ar 48000 -f f32le out.f32`. Expected port error: RMS <= 5e-5 and max <= 1.5e-3 on the test signals in section 2.1 (signal RMS about 0.17).

## Appendix C. Generator for Appendix A (run from anywhere with the backend venv: `python -I -X utf8 tables.py out.md`)

```python
import sys, json, re
sys.path.insert(0, r"<repo>/video-transcriber/video-transcriber/backend")
from app import engine, formats, hinglish, qwen_engine
from app import pdf
out = []
def block(title, obj, note=""):
    out.append(f"### {title}\n")
    if note: out.append(note + "\n")
    out.append("```json\n" + json.dumps(obj, ensure_ascii=False) + "\n```\n")
block("A1. MODEL_CATALOG (engine.py:34-53, order = UI order)", engine.MODEL_CATALOG)
block(f"A2. LANGUAGES ({len(engine.LANGUAGES)} entries, engine.py:55-68)", engine.LANGUAGES, "Validation accepts only these codes (schemas.py:45-51). `GET /api/languages` returns them sorted by display name.")
block(f"A3. Qwen LANGUAGES ({len(qwen_engine.LANGUAGES)} codes, qwen_engine.py:11-12; sorted here, source is a set literal)", sorted(qwen_engine.LANGUAGES), "Note: `yue` is in this set but is NOT in A2, so the API validator rejects it first (effectively unreachable).")
block(f"A4. PDF language labels ({len(pdf._LANGUAGES)} entries, pdf.py:60-71)", pdf._LANGUAGES, "Used only for the PDF meta line `Language: <name>`; unknown codes print the raw string.")
block(f"A5. _SPELLINGS ({len(hinglish._SPELLINGS)} entries, hinglish.py:38-87, dict order preserved)", hinglish._SPELLINGS, "Keys are matched against `unicodedata.normalize('NFC', word)`. Duplicate keys in the Python source collapse (last wins).")
block("A6. Basic romanizer maps (hinglish.py:89-94)", {"_VOWELS": hinglish._VOWELS, "_MARKS": hinglish._MARKS, "_CONSONANTS": hinglish._CONSONANTS, "_NUKTA": hinglish._NUKTA, "_DIGITS(translate: char -> char)": {chr(k): chr(v) for k, v in hinglish._DIGITS.items()}, "_WORDS_regex": hinglish._WORDS.pattern})
block(f"A7. Keyword stop words ({len(formats._STOP)} words, formats.py:197-204; sorted here, used only for membership)", sorted(formats._STOP))
open(sys.argv[1], "w", encoding="utf-8").write("\n".join(out))
print(len(engine.LANGUAGES), len(qwen_engine.LANGUAGES), len(pdf._LANGUAGES), len(hinglish._SPELLINGS), len(formats._STOP), len(hinglish._CONSONANTS))
# duplicates in the _SPELLINGS literal?
src = open(r"<repo>/video-transcriber/video-transcriber/backend/app/hinglish.py", encoding="utf-8").read()
seg = src[src.index("_SPELLINGS = {"):src.index("_VOWELS")]
keys = re.findall(r'"([^"]+)":', seg)
print("literal keys", len(keys), "unique", len(set(keys)))
print([k for k in set(keys) if keys.count(k) > 1])
```

## Appendix D. Generator for the formats / Hinglish vectors of Appendix B

```python
import sys, json, os
sys.path.insert(0, r"<repo>/video-transcriber/video-transcriber/backend")
from app import engine, formats, hinglish, qwen_engine
V = {}
def words(*items): return [{"start": s, "end": e, "word": w, "probability": 0.9} for w, s, e in items]
def seg(i, s, e, t, ws=None, conf=0.9): return {"id": i, "start": s, "end": e, "text": t, "words": ws, "confidence": conf}
text = " ".join(f"word{i}" for i in range(40)) + "."
ws = words(*[(f" word{i}", i*0.4, i*0.4+0.35) for i in range(40)])
V["cues_40words"] = formats.build_cues([seg(0, 0, 16, text, ws)])
print(json.dumps(V["cues_40words"]))
edited = seg(0, 0, 10, "This is a fairly long edited sentence. And here is another one that follows it.")
V["cues_edited"] = formats.build_cues([edited]); print(json.dumps(V["cues_edited"]))
segs = [seg(0, 0, 2, "Hello there."), seg(1, 2.5, 4, "General Kenobi."), seg(2, 10, 12, "Third paragraph here.")]
V["srt"] = formats.to_srt(segs); V["vtt"] = formats.to_vtt(segs)
print(repr(V["srt"])); print(repr(V["vtt"]))
print(repr(formats.to_txt(segs))); print(repr(formats.to_plain(segs)))
job = {"title": "T", "filename": "t.mp4", "language": "en", "duration": 12, "options": {"model": "small"}, "segments": segs, "stats": {}}
print(repr(formats.to_markdown(job)))
print(formats.render(job, "json")[0][:400])
print(repr(formats._wrap("The quick brown fox jumps over the lazy dog near the river bank today", 42, 2)))
st = formats.compute_stats([seg(0,0,30,"Kubernetes deployments don't need Kubernetes expertise, it's good monitoring tools. Café déjà vu naïve résumé.", conf=0.5), seg(1,30,60,"Monitoring Kubernetes clusters is important. Monitoring 123 abc_def x1y2", conf=0.9)], 60)
print(json.dumps(st))
for w in ["भारत","नमस्ते","पढ़ाई","विद्यार्थी","प्रश्न","ज्ञान","संस्कृत","अध्यापक","धन्यवाद","कृपया","दुनिया","बच्चों","सरकार","हिन्दुस्तान","ऑफिस","क्रिकेट","मुंबई","चाँद","जिंदगी","रहता","पहला"]:
    print(w, hinglish.romanize(w, "basic"))
print(hinglish.convert_segment({"text":"नमस्ते API, भारत!","words":None}, "basic"))
print(hinglish.convert_segment({"text":"Hello","words":None}, "basic"))
print(qwen_engine.trim_overlap("we should maintain discipline daily.", "MAINTAIN discipline daily, and study"))
print(engine._norm("Don't_stop, नमस्ते!"))
print(engine._segment_dict(0, type("S",(),dict(start=0.0,end=1.0,text=" 10 000 a ",words=[type("W",(),dict(start=0,end=.4,word=" 10",probability=.8))(),type("W",(),dict(start=.4,end=.9,word=" 000",probability=.6))()],avg_logprob=-.3,no_speech_prob=.01))()))
```

## Appendix E. Reference oracle for the audio chain (validated against ffmpeg 7.1, section 2.1)

Python/NumPy. `proto.py` has the biquad, coefficient helpers and the test-signal generator; `proto2.py` is the dynaudnorm emulation (`Hist` = the three gain queues, `dyn` = framing, fade and flush). The digital-silence rule of EN-011 (an all-zero frame reuses the previous frame's gain, 10 for the first) is implemented in `dyn` (`last_gain`). Measured against ffmpeg with these files: plain 20 s signal RMS 1.5e-5 / max 3.9e-4; 2.4 s hole + 0.7 s tail 4.3e-5 / 1.3e-3; leading 1.0 s zeros 3.2e-5 / 1.0e-3; 4 s zero tail 1.6e-6 / 2.7e-5.

### proto.py

```python
import math, subprocess, sys, os
import numpy as np
FF = r"<repo>/video-transcriber/video-transcriber/backend/.venv/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe"
W = os.path.dirname(os.path.abspath(__file__))

def make_signal(sr, secs=20, seed=1):
    rng = np.random.default_rng(seed)
    t = np.arange(int(sr*secs))/sr
    env = np.clip(0.02 + 0.6*np.abs(np.sin(2*np.pi*0.23*t))**3 * (np.sin(2*np.pi*0.07*t)>-0.2), 0, 1)
    sig = sum(np.sin(2*np.pi*f*t + k) / (k+1) for k, f in enumerate([120, 240, 360, 720, 1500, 3100, 6000]))
    sig = sig/ np.abs(sig).max() * env + 0.003*rng.standard_normal(len(t))
    sig[:int(sr*0.3)] *= 0.05
    sig[int(sr*12):int(sr*13.5)] *= 0.01
    return np.clip(sig, -1, 1).astype(np.float32)

def run_ffmpeg(sig, sr, af, out_sr=None, ch=1):
    inp = os.path.join(W, "in.f32"); out = os.path.join(W, "out.f32")
    sig.astype("<f4").tofile(inp)
    cmd = [FF, "-v", "error", "-y", "-f", "f32le", "-ar", str(sr), "-ac", str(ch), "-i", inp]
    if af: cmd += ["-af", af]
    cmd += ["-ac", "1", "-ar", str(out_sr or sr), "-f", "f32le", out]
    subprocess.run(cmd, check=True)
    return np.fromfile(out, dtype="<f4")

def biquad(x, b, a):
    # direct form II transposed, float64 state like ffmpeg's biquad (coeffs double)
    b0, b1, b2 = b; a1, a2 = a
    z1 = z2 = 0.0
    y = np.empty(len(x), dtype=np.float64)
    xl = x.astype(np.float64).tolist()
    out = []
    for xi in xl:
        yi = b0*xi + z1
        z1 = b1*xi - a1*yi + z2
        z2 = b2*xi - a2*yi
        out.append(yi)
    return np.array(out)

def coeffs(kind, f, sr, q=0.707):
    w0 = 2*math.pi*f/sr; cw = math.cos(w0); alpha = math.sin(w0)/(2*q)
    if kind == "hp":
        b = [(1+cw)/2, -(1+cw), (1+cw)/2]
    else:
        b = [(1-cw)/2, 1-cw, (1-cw)/2]
    a0 = 1+alpha; a1 = -2*cw; a2 = 1-alpha
    return [x/a0 for x in b], [a1/a0, a2/a0]

def erf(v): return math.erf(v)

def dynaudnorm(x, sr, f_ms=200, g=11, p=0.9, m=10.0):
    x = x.astype(np.float64)
    fl = int(round(sr*(f_ms/1000.0))); fl += fl % 2
    if g % 2 == 0: g += 1
    n = len(x)
    nframes = (n + fl - 1)//fl
    sigma = ((g/2.0) - 1.0)/3.0 + (1.0/3.0)
    off = g//2
    wts = np.array([(1.0/(sigma*math.sqrt(2*math.pi)))*math.exp(-((i-off)**2)/(2.0*sigma**2)) for i in range(g)])
    wts /= wts.sum()
    CONST = 0.8862269254527580136490837416705725913990909172306
    gains = []
    for k in range(nframes):
        fr = x[k*fl:(k+1)*fl]
        peak = np.abs(fr).max()
        mg = p/peak if peak > 0 else float("inf")
        gains.append(erf(CONST*(min(mg, 1e300)/m))*m if peak>0 else m)   # bound(m, min(maxgain, rms_gain=DBL_MAX))
    return x, fl, nframes, wts, gains

def smooth_gains(gains, g, wts, alt=False):
    off = g//2
    orig = [1.0]*off + list(gains)          # pre-fill with 1.0
    # minimum filter over window g (centered at each original frame), history padded with 1.0 at start
    # and (at EOF) padded by repeating... try repeating last value
    pad_end = [gains[-1]]*off if len(gains) else []
    seq = orig + pad_end
    mins = []
    for i in range(len(gains)+0):
        window = seq[i:i+g]
        mins.append(min(window))
    # second stage: gaussian over minimum history (pre-filled: initial 1.0 then min of ... )
    pre = [1.0]*off
    ms = pre + mins + [mins[-1]]*off
    out = []
    for i in range(len(mins)):
        out.append(sum(w*v for w, v in zip(wts, ms[i:i+g])))
    return out

def apply(x, fl, nframes, smoothed):
    y = np.empty_like(x)
    prev = 1.0
    f1 = np.arange(fl)/(fl-1); f0 = 1.0 - f1
    for k in range(nframes):
        fr = x[k*fl:(k+1)*fl]
        cur = smoothed[k]
        L = len(fr)
        y[k*fl:k*fl+L] = fr*(prev*f0[:L] + cur*f1[:L])
        prev = cur
    return np.clip(y, -1, 1)

if __name__ == "__main__":
    sr = 48000
    sig = make_signal(sr)
    ref = run_ffmpeg(sig, sr, "dynaudnorm=f=200:g=11:p=0.9")
    x, fl, nfr, wts, gains = dynaudnorm(sig, sr)
    sm = smooth_gains(gains, 11, wts)
    mine = apply(x, fl, nfr, sm)
    n = min(len(ref), len(mine))
    print("len ref/mine", len(ref), len(mine), "frame_len", fl, "frames", nfr)
    d = ref[:n]-mine[:n]
    print("rms err", float(np.sqrt((d**2).mean())), "max err", float(np.abs(d).max()), "ref rms", float(np.sqrt((ref**2).mean())))
    # per-frame comparison of gain
    for k in range(0, nfr, max(1, nfr//12)):
        a = ref[k*fl:(k+1)*fl]; b = sig[k*fl:(k+1)*fl]
        den = (b.astype(np.float64)**2).sum()
        g_ref = (a.astype(np.float64)*b).sum()/den if den>0 else float('nan')
        print(k, round(g_ref,4), round(sm[k],4), round(gains[k],3))
```

### proto2.py

```python
import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import math, collections
import numpy as np
from proto import *

class Hist:
    def __init__(self, g):
        self.g = g; self.orig = collections.deque(); self.mn = collections.deque(); self.sm = collections.deque()
        wts, self.wts = None, None
        sigma = ((g/2.0) - 1.0)/3.0 + (1.0/3.0); off = g//2
        w = [(1.0/(sigma*math.sqrt(2*math.pi)))*math.exp(-(((i-off)**2))/(2.0*sigma**2)) for i in range(g)]
        s = sum(w); self.wts = [v/s for v in w]
    def update(self, cur):
        g = self.g; pre = g//2
        if not self.orig:
            for _ in range(pre): self.orig.append(1.0)
        self.orig.append(cur)
        while len(self.orig) >= g:
            if not self.mn:
                init = 1.0; i = pre
                while len(self.mn) < pre:
                    i += 1
                    init = min(init, self.orig[i])
                    self.mn.append(init)
            self.mn.append(min(self.orig))
            self.orig.popleft()
        while len(self.mn) >= g:
            self.sm.append(sum(w*v for w, v in zip(self.wts, self.mn)))
            self.mn.popleft()

def bound(th, v):
    return math.erf(0.8862269254527580136490837416705725913990909172306*(v/th))*th

def dyn(x, sr, f_ms=200, g=11, p=0.9, m=10.0):
    x = x.astype(np.float64)
    fl = int(round(sr*(f_ms/1000.0))); fl += fl % 2
    n = len(x); nfr = (n+fl-1)//fl
    H = Hist(g)
    dummy_gain = bound(m, p/p)
    last_gain = m                                        # EMPIRICAL: an all-zero frame reuses the previous frame's gain (m for the first)
    for k in range(nfr):
        fr = x[k*fl:(k+1)*fl]
        peak = np.abs(fr).max()
        last_gain = bound(m, p/peak) if peak > 0 else last_gain
        H.update(last_gain)
    while len(H.sm) < nfr: H.update(dummy_gain)
    y = np.empty_like(x); prev = 1.0
    f1 = np.arange(fl)/(fl-1); f0 = 1.0 - f1
    smoothed = list(H.sm)
    for k in range(nfr):
        fr = x[k*fl:(k+1)*fl]; cur = smoothed[k]; L = len(fr)
        y[k*fl:k*fl+L] = fr*(prev*f0[:L] + cur*f1[:L]); prev = cur
    return np.clip(y,-1,1), smoothed, fl

if __name__ == "__main__":
    for sr, secs, seed in ((48000,20,1),(48000,19.77,2),(16000,13.3,3)):
        sig = make_signal(sr, secs, seed)
        ref = run_ffmpeg(sig, sr, "dynaudnorm=f=200:g=11:p=0.9")
        mine, sm, fl = dyn(sig, sr)
        n = min(len(ref), len(mine))
        d = ref[:n]-mine[:n]
        print(sr, secs, "len", len(ref), len(mine), "rms err", float(np.sqrt((d**2).mean())), "max err", float(np.abs(d).max()))
```
