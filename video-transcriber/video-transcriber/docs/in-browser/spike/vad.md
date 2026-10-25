# Spike: voice-activity detection and audio windowing in the browser

Track `vad-and-windowing`. Goal: reproduce, in the visitor's browser, what the Python engine does so that Whisper (and Qwen) never
see long silences or music, the main source of hallucinated text. Nothing here changes the repository except this file; all code,
tests, data and raw outputs are in the scratch folder (section 12).

## 1. Result in one screen

**Recommendation: candidate (b), Silero VAD driven directly with onnxruntime-web, plus a TypeScript port of faster-whisper's
segmentation and packing.** Not `@ricky0123/vad-web` (the plan's choice), because its `NonRealTimeVAD` can only run the 2022 Silero v4
model and it brings a second ONNX runtime. The pure-TypeScript energy model (c) is kept as a documented fallback only.

| | |
|---|---|
| Model file to ship | **faster-whisper's own `silero_vad_v6.onnx`** (1,245,151 bytes, sha256 `4cbf549b...17d2`, MIT). It is byte-for-byte what the Python engine runs. Its weights are exactly Silero **v6.0** (probabilities identical to the official v6.0 export, max difference 0.0000). |
| Runtime | the same `onnxruntime-web` build Transformers.js 4.3.1 pins (`1.31.0-dev.20260914-8d85527a0`), WASM execution provider, **pinned to `['wasm']`** (the WebGPU provider returns wrong probabilities for this model, section 4.4). No second runtime; marginal memory of the VAD session in an already running ORT is **+3.3 to +4.3 MB**. |
| Code | 14.9 KB minified / 4.6 KB gzip for the Silero path (segmenter, wrapper with canary, streaming), 23.1 KB / 7.2 KB gzip including the window planner and the energy fallback. No runtime dependency (the caller passes its `ort`). |
| Parity with the current product | the TypeScript segmenter returns **exactly the same segments as `faster_whisper.vad.get_speech_timestamps`** for 5 parameter sets on all 52 clip variants (26 clips, raw and with the engine's clean-up filter) when driven by Python's probabilities; and when driven by the real ONNX model in onnxruntime-web (19 variants in Node, max probability error 3.1e-5, 0 decisions flipped at 0.45 over 59,524 frames of 50 variants) and for the 60 minute file in real Chrome (787 segments, identical hash). The Qwen chunker and `collect_chunks` are ported and checked against the Python output on the same 52 variants. |
| Streaming | `push(chunk) -> completed segments`, `flush()`: bit-identical to the one-shot run for any chunking (12 random chunkings x 3 clips, 15 edge lengths, un-awaited calls, reused buffers); constant memory (60 minutes: audio ring never above 65.5 s, process +194 MB over an empty page, same as a 60 s clip). |
| Speed (this laptop, 1 thread, WASM, under heavy background load) | 47-54x real time on a 60 s clip (alternating A/B run), **25x on the 60 minute file (144 s), 86x with 4 threads on a cross-origin-isolated page (42 s)**. Python on the same machine: 45-221x. |
| Accuracy vs the alternatives (synthetic ground truth, section 9) | 0 s of non-speech kept on silence/noise/music/tone (candidates a and c keep 10-29 s of 93 s), 100% recall on clean and noisy speech, 99.8% on very quiet speech. Same as Python by construction. |
| Defaults | `WHISPER_VAD_30S` (threshold 0.45, neg 0.30, min silence 500 ms, pad 400 ms, max speech 30 s) + `WHISPER_PLAN` (30 s windows, speech packed back to back, silence dropped); `QWEN_VAD` + `QWEN_PLAN` (25 s contiguous chunks). Section 2. |

Things to know before building on it (details in sections 4 and 10): the machine was usually more than 90% busy with other agents' jobs during
the measurements (57-100%), so speeds are conservative and noisy; ground truth is synthetic (Windows SAPI voices) plus three real clips without
labels; there is no Hindi/Hinglish audio and no real "speech over music" in the test set; Chrome 155 on Windows only.

## 2. What the Python engine does, and the defaults that reproduce it

### 2.1 The behaviour to reproduce (file:line in this repository)

| step | code | what it does |
|---|---|---|
| clean-up first | `backend/app/engine.py:85`, `:298-347` | `highpass=f=70,lowpass=f=7800,dynaudnorm=f=200:g=11:p=0.9` is applied in the ffmpeg decode, so **before** VAD, when `enhance_audio` is on (default). VAD never sees the raw level. |
| Whisper VAD | `engine.py:481-482` | `vad_filter=bool(o["vad"])`, `vad_parameters=dict(threshold=0.45, min_silence_duration_ms=500, speech_pad_ms=400)`. Everything else is faster-whisper's default: `neg_threshold = threshold - 0.15 = 0.30`, `min_speech_duration_ms = 0`, `max_speech_duration_s = inf`, frame 512 samples (32 ms). |
| what Whisper receives | `faster_whisper/transcribe.py:885-893`, `:1009-1010`, `vad.py:186-243`, `:246-285`, `transcribe.py:1844-1870` | the speech chunks are **concatenated into one stream** (`collect_chunks` without a limit), Whisper's own sequential 30 s window logic runs over that stream, and every timestamp is mapped back with `SpeechTimestampsMap`/`restore_speech_timestamps`. Because of the padding rule (below) the longest silence left between two speech pieces is 2 x 400 ms = 0.8 s. |
| Qwen VAD + chunks | `backend/app/qwen_engine.py:67-102` | `VadOptions(min_silence_duration_ms=300, speech_pad_ms=100)` (threshold 0.5); gaps `>= 2 s` are skipped; a group is cut into 25 s steps, at the **middle of the last pause that lies at least 60% into the step**, else hard (the next chunk is flagged `overlap`). The decode loop (`:156-199`) re-decodes 2 s before a forced cut and trims the repeated words. |
| segment logic | `faster_whisper/vad.py:45-183` | hysteresis (`>= threshold` starts, `< neg_threshold` for `min_silence` ends), pause tracking for max-speech splits (`98 ms`), padding: first start `- pad`, last end `+ pad`, neighbours share a gap smaller than `2 x pad` half and half. Stream padded with `512 - len % 512` zeros (a multiple of 512 gets a whole extra zero frame). |
| model | `vad.py:288-351` | `assets/silero_vad_v6.onnx`, inputs `input [seq, 576]` (64 samples of context + 512), `h`, `c` (`[1,1,128]`); outputs `speech_probs [seq]`, `hn`, `cn`. It is a **sequence** export: one `run()` judges any number of frames (faster-whisper sends up to 10,000). |

### 2.2 Defaults for the browser engine

```ts
// Whisper (all seven Whisper models, translate and transcribe)
const vad = new StreamingVad(model, WHISPER_VAD_30S);   // threshold .45, neg .30, minSilence 500 ms, pad 400 ms, maxSpeech 30 s
const windows = planWindows(segments, vad.samplesSeen, WHISPER_PLAN);   // maxWindow 30 s, mergeGap 0, splice (silence dropped)
// Qwen3-ASR 0.6B / 1.7B
const vadQ = new StreamingVad(model, QWEN_VAD);          // threshold .5, minSilence 300 ms, pad 100 ms
const chunks = planWindows(segs, n, QWEN_PLAN);          // maxWindow 25 s, mergeGap 2 s, contiguous, preferBreak .6 strict
// "VAD off" option of the UI: planWindows([{start:0,end:n}], n, { maxWindow: 30, pauses })  (see 6.4)
```

Why `WHISPER_VAD_30S` and not the Python value (`maxSpeech = inf`): the browser decodes each window independently, so a speech run
must fit a window; the cap also bounds memory in streaming mode (section 7). On 50 of the 52 clip variants the cap changed **nothing**
(natural pauses `>= 500 ms` always come first); the exception is the two variants of a synthetic clip with no pause at all (111.7 s),
where it cuts at 29.26 s multiples, exactly like faster-whisper's batched pipeline (`transcribe.py:394-424`).

## 3. Candidates compared

(a) `@ricky0123/vad-web` 0.0.31 `NonRealTimeVAD`, (b) Silero driven directly (this package), (c) pure-TypeScript energy/spectral model.
Browser numbers: Chrome 155 (headless), module Web Worker, Windows 11, Ryzen 7 7730U, system CPU usually above 90% busy (57-100%, other jobs).

| | (a) vad-web NonRealTimeVAD | (b) Silero direct (recommended) | (c) TypeScript energy model |
|---|---|---|---|
| Model | Silero **v4 "legacy"** (`silero_vad_legacy.onnx`, 1,807,522 B), 1536-sample (96 ms) frames. `NonRealTimeVAD.new` hard-codes `SileroLegacy`; the v5/v6 files in the package are only reachable through `MicVAD` | faster-whisper `silero_vad_v6.onnx` 1,245,151 B (gzip 1.08 MB, brotli 0.95 MB), 32 ms frames | none |
| JavaScript shipped | own code 13.9 KB min (3.7 KB gzip) **plus its own onnxruntime-web**: npm nests `1.30.0` (vad-web asks `^1.17.0`, the pinned `1.31.0-dev` does not satisfy it) = 454.6 KB min / 103.7 KB gzip, and it imports the default `onnxruntime-web` bundle, not `onnxruntime-web/webgpu` that Transformers.js uses, so it cannot share the runtime. Whole package 533.6 KB min / 123.8 KB gzip | 14.9 KB min / 4.6 KB gzip (segmenter + Silero + streaming); 23.1 KB / 7.2 KB gzip with windows and energy | 3.2 KB min / 1.3 KB gzip |
| Extra runtime assets | `ort-wasm-simd-threaded.wasm` 14.2 MB of its own ORT version (we had to serve it separately: version mismatch otherwise) | none: reuses the ORT/WASM Transformers.js loads (2nd session costs +3.3-4.3 MB) | none |
| Licences | vad-web ISC, Silero MIT, ORT MIT | Silero MIT (c) 2020-present Silero Team, faster-whisper MIT (c) 2023 SYSTRAN, ORT MIT: keep both notices next to the model | ours |
| Web Worker | works (deep import and whole-package import both ran in a module worker) | works | works |
| API fit | needs the whole file as one `Float32Array`, returns a **copy of the audio of every segment** (memory), per-sample JS loops in its resampler; no max-speech split, no post-padding, redemption/pre-pad instead of min-silence/pad | `push(chunk)`, bounded memory, faster-whisper semantics | same interface as (b) |
| Speed, 60 s clip (x real time, wall) | 9-49x (fresh browsers) | 47-54x median in the alternating A/B run (1 thread); 12-51x across separate fresh-browser runs; 53-69x with 4 threads when cores were free | 137-1095x |
| 60 minute file | 52x but returned **one** segment = the whole hour (default 1.4 s redemption merges every pause: nothing removed); **+634 MB** over an empty page (peak 866 MB); 10 min: +507 MB | **25x (144 s) with 1 thread, 86x (42 s) with 4 threads**; 787 segments identical to Python; +194 MB (peak 406 MB), flat in the file length | 769x (4.7 s); 787 segments, 3593 s kept (Python 3528 s) |
| Parity with the Python output (frame F1 of kept audio, 3 real clips x raw/enhanced) | 93.8-97.7% defaults, 97.6-99.8% when tuned to Python's numbers | **100%** (identical segments) | 94.3-97.7% |
| Non-speech kept (silence + pink noise + music + 1 kHz tone, 93 s; enhanced audio) | 28.6 s (tuned 25.7 s) | **0 s** | 14.7 s |
| Realistic timeline (193 s, 78.7 s of speech; Python keeps 99.8 s) | 159.6 s kept, 53.8 s leaked (tuned 152.2 s, 48.9 s) | **99.8 s, 0 leak** | 126.4 s, 22.9 s leaked, 8 false segments |
| Low SNR (speech at 0 dB over music / pink noise) | 100% recall | 100% recall | **86.6-88.9% recall** |
| Verdict | reject | **use** | fallback only (no model could be loaded) |

## 4. Findings that change the plan

1. **`@ricky0123/vad-web` is the wrong tool for a file.** `NonRealTimeVAD` is hard-wired to Silero v4 (`non-real-time-vad.js`:
   `SileroLegacy`, frame 1536). Defaults are tuned for turn-taking (`redemptionMs 1400`, `preSpeechPadMs 800`, `minSpeechMs 400`), so on
   our 60 minute test it returned one segment. It also doubles the runtime (nested `onnxruntime-web@1.30.0`).
2. **The Python engine's VAD weights are Silero v6.0, not the current Silero.** The official `silero_vad.onnx` at tag `v6.0` gives
   probabilities identical to faster-whisper's file (max difference 0.0000 on 3 clips). Current Silero (v6.2.x, also the "v6" file
   inside vad-web and the new official `silero_vad_16k_sequence.onnx`) is a retrained network: mean |dp| 0.08-0.15, 6.4% / 3.0% of the
   frames flip at threshold 0.45 on two real clips, and the segments differ (F1 vs Python 98.9-99.9%, one extra false segment of 0.2 s in the
   193 s timeline). Ship the faster-whisper file for parity. `SileroFwModel` also loads `silero_vad_16k_sequence.onnx` (same
   input/output contract, 1,246,165 B) if the owner prefers the newer weights; then regenerate the goldens
   (`CANARY_EXPECTED_V62` is included).
3. **The sequence export matters for speed.** One `run()` for 256-1024 frames instead of 112,501 calls per hour. Alternating A/B in one
   worker (same load for everybody): the official one-frame-per-run export is 0.62x as fast as the sequence export (27.4x vs 46.8x median).
   A batch sweep (separate runs, noisy) gives 19x (1 frame/call), 27x (8), 32x (32), 33x (128), 34x (1024), 44x (4096).
4. **Never run Silero on the WebGPU provider.** In `onnxruntime-web 1.31.0-dev.20260914` the WebGPU EP returns wrong probabilities for
   both Silero exports (max error 0.82 and 0.86; 214 of 300 frames off by more than 0.05; deterministic; also frame by frame). WASM
   matches Python to 3.1e-5 or better. `executionProviders: ['wasm']` is the default in `DEFAULT_SESSION_OPTIONS`, and `selfTest(model)` runs a
   48-frame synthetic canary (max error 4.8e-5 on WASM, 0.67 on WebGPU in Chrome) that must pass before the model is used; on failure
   fall back to the energy model. The canary also fails for the other weight set, so it doubles as a "wrong model file" check.
5. **One ONNX runtime, shared.** Transformers.js 4.3.1 (`src/backends/onnx.js`) imports `onnxruntime-web/webgpu`, defaults to the
   `.asyncify` wasm build, serialises its own runs (comment: "Session already started") and exposes only a copy of `ort.env` as
   `env.backends.onnx`, not `InferenceSession`. The app therefore imports `onnxruntime-web/webgpu` itself, with the same exact version
   so that npm/bundler dedupe it (one module instance, one wasm instantiation, one `env.wasm.wasmPaths`). In four probes (same session twice,
   two WASM sessions, WebGPU + WASM session) overlapping `run()` calls did not throw, but route VAD and Whisper through one run queue anyway.
6. **Marginal cost of the VAD in the runtime Whisper already loads is small.** `measureUserAgentSpecificMemory` (isolated page): first
   session incl. runtime and one run 24.9 MB, second session +3.3 MB (OS private memory +3.9 / +4.3 MB). Node: +2-4 MB per session after the
   first. A *separate* worker with its own ORT would cost about +90-95 MB (compiled wasm) and a second wasm instantiation: avoid.
7. **The `.asyncify` wasm build is slower** than the plain build for this model: 1.23x in the alternating A/B run (46.8x vs 54.3x median,
   the reliable figure); the separate fresh-browser passes also put asyncify behind (23-35x vs 43-51x, and 15-24x vs 14-45x) but with larger,
   load-driven gaps. It is Transformers.js' default; the choice belongs to the Whisper engine.
8. **VAD output is robust to the clean-up chain, not independent of it.** Python raw vs enhanced audio: frame F1 99.0-100% on 9 clips,
   up to 32 frames (1 s) more audio kept after dynaudnorm on real speech. A browser approximation of the filters will therefore move the
   segments by about 1%; exact golden parity needs the same filter output.
9. **Two faster-whisper quirks:** (a) `collect_chunks` (1.2.1) forgets to list the first segment of every
   chunk but the first in its metadata (`segments`); the audio is right. Not copied: `collectChunks(..., faithful = true)` reproduces it for
   the tests, the default lists every segment. (b) The last 64 samples of the padded final frame are zeroed by faster-whisper's context code.
   Copied on purpose, so the tail frame is bit-identical.

## 5. Parameter mapping and measured differences

| faster-whisper `VadOptions` | TypeScript `VadParams` | Whisper value | Qwen value | note |
|---|---|---|---|---|
| `threshold` | `threshold` | 0.45 | 0.5 | compared as float32 (numpy 2 converts the Python float), `Math.fround` |
| `neg_threshold` (None = threshold - 0.15) | `negThreshold` | 0.30 (implicit) | 0.35 (implicit) | |
| `min_speech_duration_ms` | `minSpeechDurationMs` | 0 | 0 | only filters pause-terminated and the trailing segment |
| `max_speech_duration_s` | `maxSpeechDurationS` | **30** (Python: inf) | inf | cut at the last pause `> 98 ms`, else hard, before `30 s - 512 - 2 x pad` |
| `min_silence_duration_ms` | `minSilenceDurationMs` | 500 | 300 | |
| `speech_pad_ms` | `speechPadMs` | 400 | 100 | |
| frame / context | `FRAME = 512`, `CONTEXT = 64` | | | 32 ms; context = last 64 samples of the previous frame |

Measured differences between the TypeScript pipeline and Python (`get_speech_timestamps`):

* **0 differing segments** for the five parameter sets (Whisper, Whisper+30 s cap, Qwen, library defaults, a hand-made set with `min_speech`,
  explicit `neg_threshold` and a 20 s cap) on 26 clips x {raw, enhanced}, driven by (i) Python's own probabilities (literal port and
  incremental segmenter, random batchings) and (ii) probabilities computed by onnxruntime-web (Node WASM, 19 clip variants x 5 sets).
  Probability error vs Python: **max 3.1e-5, 0 decisions flipped at 0.45, over 59,524 frames of 50 clip variants** (`tools/prob-error.ts`).
* The 60 minute file in real Chrome, streamed from the 115 MB WAV in 1 s blocks: 787 segments, 3528.1 s kept, **FNV hash of the segment list
  identical to Python's**.
* Where it can differ in principle: a probability within float rounding of a threshold (never observed), another ORT build, other weights
  (section 4.2), another clean-up chain (section 4.8).

## 6. Window planner

`planWindows(segments, totalSamples, { maxWindow = 30, pad = 0, mergeGap = 0, splice = true, preferBreak = 0, strictPreferred = false, pauses })`
returns `Window[]`: `pieces` (absolute `[start, end)` sample spans, each with its `local` offset inside the window audio), `length`
(samples fed to the recogniser, `<= maxWindow`), `start/end` (absolute span) and `forcedStart`. A caller transcribes
`windowAudio(samples, w)` and maps every word time back with `makeTimeMap(w).toAbsolute(t, isEnd)` / `.mapSpan(a, b, 2)`.

### 6.1 Two shapes from one function
* **`WHISPER_PLAN` (`splice: true`)** = faster-whisper `collect_chunks`: whole segments are packed next-fit, strictly `>` (an exact 30.000 s fit stays
  together), silence between them is dropped, a window is the concatenation of several pieces. Time mapping follows
  `SpeechTimestampsMap` exactly (a time on the join belongs to the next piece when it is a start and to the previous when it is an end;
  words are resolved in the piece that holds their middle; 2-decimal Python rounding incl. ties to even).
* **`QWEN_PLAN` (`splice: false`)** = `qwen_engine.chunks`: gaps `< 2 s` stay inside the window, longer gaps are skipped, groups longer than
  25 s are cut at the middle (`floor`) of the last pause `>= 0.6 x 25 s` into the step, else hard with `forcedStart = true`.

### 6.2 Properties, checked (fast-check: planner 1500 + 400 + 120 random scenarios, segmenter 4000 + 3000, plus golden and boundary unit tests)
windows never exceed `maxWindow`; pieces are non-empty, ordered, disjoint, inside the audio; `length` = sum of pieces and `local` offsets add up;
coverage is exactly the speech plus the gaps that were joined (independent re-derivation in the test); deterministic and independent of the
order of the input; **a cut inside speech happens only when no pause lies in reach** (re-derived greedily in the test); `forcedStart` only
on a window that continues the previous one; next-fit packing is maximal; `windowAudio` + `makeTimeMap` map the local sample `i` to
exactly the absolute sample it was cut from; **incremental stability: every window except the last is final when more segments
arrive**, so transcription can start before the VAD has finished the file.

### 6.3 Parity with Python (golden, all 52 clip variants)
`planWindows(..., QWEN_PLAN)` returns exactly the `(start, end, overlap)` list of `qwen_engine.chunks()` (also with `vad=False`);
`collectChunks(..., faithful)` returns the same `offset`/`duration`/segment counts as `collect_chunks`; `SpeechTimestampsMap` agrees on
1,764 probe times (chunk index and rounded original time, start and end rules). On the 60 minute file the 30 s merge makes 124 windows of
28.5 s of speech on average.

### 6.4 "VAD off" and long uninterrupted speech
Without VAD there is no pause information: use `planWindows([{start: 0, end: n}], n, { maxWindow: 30, pauses })` with
`pausesFromProbs(probs)` computed by the cheap energy model so that windows are cut in quiet valleys instead of every 30.000 s. This is not the
same as Python (which lets Whisper choose cut points from its own timestamps); it is the closest browser equivalent.

## 7. Streaming API

```ts
const vad  = new StreamingVad(model, WHISPER_VAD_30S, { batchFrames: 256, signal });
const ring = new AudioRing();                       // keeps only audio a pending segment can still need
for await (const block of decoder16kMono) {
  ring.append(block);                               // or skip the ring and decode the file a second time for Whisper
  for (const seg of await vad.push(block)) handle(ring.slice(seg.start, seg.end), seg);
  ring.discardBefore(Math.min(vad.retainFrom, firstUntranscribedSample));
}
for (const seg of await vad.flush()) handle(ring.slice(seg.start, seg.end), seg);
```

* `push()` and `flush()` are serialised internally (a decoder callback may not await); the block is copied unless `push(block, false)`.
* The model is always called with the same frame partition (batches of `batchFrames`, the rest at flush), so the result does not depend on how
  the decoder chunks the audio. Tested: 12 random chunkings x 3 clips bit-identical to the one-shot probabilities and segments; different
  `batchFrames` (1, 7, 64, 256, 1000) give identical segments (probabilities within 1e-5); lengths 0, 1, 63..65, 447..449, 511..513, 1023, 1024, 131072, 131073.
* Segments are emitted as soon as their padded end is known (at most `minSilence + 2 x pad` of audio later, plus the batch);
  `retainFrom` is the lowest sample a not-yet-returned segment can start at. With `maxSpeech = 30 s` the ring holds at most about two
  segments (65.5 s in the 60 minute run; a fake always-speech source for 1 hour: below 60 s); with `maxSpeech = inf` it would hold the whole
  open segment (test shows 290+ s retained after 300 s), which is why the cap is part of the browser defaults.
* `abort` support, `reset()` for the next file, `stats` (model calls, model time).
* Retention is the caller's job: the ring only knows the VAD's needs. If transcription starts only after the VAD finished, either keep the
  speech audio (at most 230 MB as float32 for an hour, 115 MB as Int16) or decode the file a second time and cut `windows` on the fly (no
  retention, costs one more decode).
* Language detection in Python uses the first 4 x 30 s of the **VAD-filtered** audio (`language_detection_segments=4`): use the first four
  windows, available long before the whole file is analysed.

## 8. Performance

Conditions for all rows: Chrome 155 headless on Windows 11, Ryzen 7 7730U (8c/16t), module worker, 16 kHz float input, Silero path
`batchFrames 256` unless stated, `PRIO=High` for the browser tree, **system CPU usually above 90% busy (57-100%) because other jobs were running**.
Repeats inside one worker are shown as best / median / worst (first run excluded, it includes JIT tier-up).

| 60 s real speech clip | x real time | notes |
|---|---:|---|
| alternating A/B, same worker, 7 rounds: `fw` + `onnxruntime-web/webgpu` asyncify wasm (Transformers.js default) | **46.8** median (21.4-51.9) | |
| ... `fw` + plain `onnxruntime-web` wasm | 54.3 (50.1-63.7) | 1.23x asyncify |
| ... `silero_vad_16k_sequence.onnx` (v6.2) | 49.5 (21.5-53.1) | 1.04x |
| ... official one-frame-per-run export | 27.4 (25.9-29.0) | 0.62x |
| ... TypeScript energy model | 792.6 (627-1095) | 22x |
| separate fresh browsers, 1 thread, `fw`: asyncify / jsep / plain | 23-35 / 43-50 / 44-51 (pass 1), 15-23 / - / 14-36 (pass 2) | load drifted between passes |
| 4 threads, cross-origin-isolated page, asyncify | 53-69 (pass 1), 20-25 (pass 2, no free cores) | threads only help when cores are idle |
| vad-web `NonRealTimeVAD` | 9-49 | +458 to +483 MB |
| Python faster-whisper (native ORT CPU), same clips, same days | 45-204 (model pass; 60 s clips raw / enhanced) | single call, `ref_vad.py` |

| 60 minute file, streamed from the 115 MB WAV (1 s blocks) | wall | x real time | segments | memory |
|---|---:|---:|---|---|
| `fw`, 1 thread, asyncify | 143.9 s | 25 | 787, 3528.1 s kept, **identical to Python** | +194 MB over an empty page, peak 406 MB, ring max 65.5 s |
| `fw`, 4 threads (isolated page) | 41.8 s | 86 | identical | +216 MB, peak 443 MB |
| energy model | 4.7 s | 769 | 787, 3593.0 s | +45 MB |
| vad-web, default options | 69 s | 52 | **1** (whole hour, nothing removed) | **+634 MB**, peak 866 MB |
| vad-web, first 10 min | 12.2 s | 49 | 1 | +507 MB |
| official one-frame export, first 10 min | 20.1 s | 30 | 131 (v6.2 weights) | +288 MB |
| Python faster-whisper, 60 min raw / enhanced | 16.3 s / 69.3 s model pass | 221 / 52 | 787 | memory-mapped |

Cold start: fetching and compiling the wasm and creating the session took 0.7-0.9 s (plain wasm) and 1.3-6.5 s (asyncify, load dependent);
the Whisper engine pays this anyway. A 60 minute file therefore costs the VAD 42 s (4 threads) to 2.4 minutes (1 thread) on this laptop,
up to about 5 minutes when the machine is saturated (12x), and it should run during decoding (it keeps up with any decoder slower than 25x).
Phones were not measured; expect several times slower than this laptop. For them the 4.7 s energy pre-pass is the fallback to offer
(it removes digital silence and steady noise only).

## 9. Accuracy

Ground truth = frames (512 samples) of the **clean** TTS signal with RMS above -65 dBFS (the SAPI voices render pauses as exact digital zero:
the energy histogram of every passage is bimodal: e.g. 7 of the 710 frames of passage-b lie between -90 and -60 dB). Noise and music are mixed in afterwards at a known SNR, so
the mask is exact for the synthetic set. Metrics per clip, then averaged: **recall** (share of speech frames inside a returned segment),
**kept / speech**, **leak** (returned audio more than 1 s away from any speech frame), **false segments** (contain no speech frame).
Full tables: `bench-out/accuracy-tables.md`; all rows: `bench-out/accuracy.json`.

Enhanced audio (the app default), Whisper parameters, post-processed segments:

| group | py-fw = **ours (fw-v6.0)** | seq-v6.2 | energy (c) | vad-web (a) | vad-web tuned (a) |
|---|---|---|---|---|---|
| clean speech: recall (mean/min) | 100 / 100 % | 100 / 100 % | 100 / 100 % | 100 / 100 % | 100 / 100 % |
| speech + pink noise / music, 20..0 dB SNR, 9 clips | 100 / 100 % | 100 / 100 % | 97.4 / **88.1 %** | 100 / 100 % | 100 / 100 % |
| quiet speech (-35, -45, -55 dBFS peak) | 99.8 / 99.4 % | 99.6 / 98.9 % | 100 / 100 % | 100 / 100 % | 100 / 100 % |
| 193 s timeline (music, silence, speech, noise, speech over music): kept s (speech 78.7 s) | **99.8** | 101.8 | 126.4 | 159.6 | 152.2 |
| ... leaked non-speech s / false segments | **0 / 0** | 0.2 / 1 | 22.9 / 8 | 53.8 / 1 | 48.9 / 4 |
| silence + pink noise + music + tone (93 s): wrongly kept s | **0** | 0 | 14.7 | 28.6 | 25.7 |
| 3 real clips (131 s): frame F1 of kept audio vs Python | 100 % | 99.0 % | 96.6 % | 96.4 % | 98.3 % |

Raw audio gives the same ranking (non-speech kept: 0 / 0 / 9.8 / 13.0 / 10.2 s). Raw per-frame decision `prob >= 0.45` against the mask:
fw precision 99.7%, recall 97.2% (F1 98.4%); with a 250 ms collar around speech/pause transitions 100% / 99.5% (F1 99.8%); energy 93.9% / 79.9%.
Quiet speech: the only misses of Silero are the faintest -55 dBFS syllables (98.1% raw, 99.4% after the engine's level normalisation).

## 10. Limits, risks, open questions

* **Ground truth is synthetic.** Two SAPI voices (David, Zira) in English; clean speech; music is four synthesised triads, noise is pink noise.
  Real speech over real music, laughter, applause, overlapping speakers, Hindi/Hinglish and children's voices are not measured (no Hindi voice
  exists on this machine; downloaded real clips: Silero's `test.wav`, JFK, a TED excerpt; only agreement with Python can be scored there).
  Because the goal is parity with the product that exists, this matters less: any speech where Python's VAD is good, ours is the same.
* **Timing numbers are load-dependent** (system CPU usually above 90% busy; clocks probably throttle). Relative figures from the alternating A/B run
  are the reliable ones; absolute figures are conservative. The CPU-time based column in `bench-out/*.json` is an upper bound of CPU cost
  (it includes JIT threads and GC).
* **Chrome 155 / Windows only.** Firefox, Safari, Android and iOS were not run. WASM SIMD is universal, `SharedArrayBuffer` threads need the
  isolated page the plan reserves for the transcriber.
* **WebGPU EP bug** (section 4.4) may be fixed in a later ORT; keep the canary, re-test on upgrade.
* **Weights choice** (section 4.2): v6.0 for parity vs v6.2 (claimed better on edge cases, untested here on real audio).
* **The energy fallback is not tuned** (default weights): it keeps steady tones and music (3 s tone flagged, 6.8-8.1 s of 30 s music kept),
  loses 11-13% of speech at 0 dB SNR, and lets 8 false segments through the timeline. It is a safety net, not a substitute.
* **No cross-check of the audio ring under a real decoder** (WebCodecs); the 60 minute run used a streamed WAV.
* **Hallucination guards are a different layer**: the VAD removes the non-speech that triggers them; `hallucination_silence_threshold`,
  `no_speech_threshold`, loop guards still belong to the decoding stage.
* The faster-whisper batched pipeline's default is `min_silence_duration_ms=160` (`transcribe.py:399`); the product's value (500) is what is reproduced.
* Elapsed time was about 2 hours instead of the 45 minute target: most of it waiting for stable measurements on a loaded machine.

## 11. Suggested `PARITY.md` rows

| feature | status | how | evidence |
|---|---|---|---|
| VAD (skip silence / music), `vad` option | kept, identical segments | Silero v6.0 (faster-whisper's file) via onnxruntime-web WASM, TypeScript port of `get_speech_timestamps`, same parameters | 0 differing segments on 52 variants x 5 sets, 60 min in Chrome identical |
| VAD off | kept, closest equivalent | fixed 30 s windows cut at quiet valleys from the energy model | section 6.4 |
| 30 s windowing + timestamp restore | kept | `planWindows(WHISPER_PLAN)` + `makeTimeMap` = `collect_chunks` + `SpeechTimestampsMap` | golden tests |
| Qwen VAD chunking (300 ms / 100 ms pad / 25 s / skip >= 2 s / overlap flag) | kept, identical | `QWEN_VAD` + `QWEN_PLAN` | chunk lists identical on 52 variants (+ no-VAD) |
| cancel during VAD | kept | `AbortSignal` | streaming tests |
| VAD model unavailable / wrong EP | new safety | `selfTest` canary, then `EnergyVadModel` | probes |

## 12. Evidence and reproduction

Scratch root: `C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/vad/`

* `reference/` - the deliverable: `src/` (types, segmenter, silero, streaming, windows, energy), `test/` (7 files, **274 tests, all passing**;
  deliberately broken copies of the segmenter (3 mutations) and the planner (4) were all caught by the tests), `tools/`, `bench/` (Vite page, module worker, server, Playwright
  driver), `README.md`. `npx tsc --noEmit` clean (strict).
* `py/` - generators of the goldens (`ref_vad.py` runs the real `faster_whisper.vad` and `qwen_engine.chunks`, `ref_map.py`, `make_synth.py`,
  model inspection and weight comparison scripts).
* `data/` - decoded PCM (raw and enhanced, `engine.extract_audio` ffmpeg line), ground-truth masks `gt.json`, Python outputs `ref/`.
* `downloads/` - official Silero v6.0/v6.2 models, the sequence export, real clips, the Transformers.js tarball (each in its own folder, never executed; the real clips were used locally only and are not redistributed).
* `bench-out/` - every raw result: `accuracy.json/.log/tables.md`, `browser-*.json/.log` (speed, long runs, probes, A/B), `bundle-sizes*.json`,
  `file-sizes.json`, `vitest-full.log`; `reference/tools/prob-error.ts` produced the probability-error figure.

Key commands (from `reference/`):

```
node tools/prep-audio.mjs <ffmpeg> <fixtures> <data> <downloads> <long>          # same ffmpeg line as engine.extract_audio, raw and enhanced
<backend>/.venv/Scripts/python.exe -I -B ../py/ref_vad.py <data> <data>/ref <backend>
npx vitest run                                                                     # 274 tests, ~2 min
npx tsx tools/eval-accuracy.ts <data> <downloads> out.json && node tools/summarize-accuracy.mjs out.json
npx vite build -c vite.bench.config.ts && PRIO=High node bench/run.mjs <vadRoot> speed60c|long60|ab|probes2 out.json
```

Provenance of the numbers quoted above: weights identity (`py/cmp_official.py`, `py/cmp_weights.py`), WebGPU and memory probes
(`bench-out/browser-probes*.json`), A/B (`bench-out/browser-ab.json`), 60 minute runs (`browser-long60-high.json`, `browser-longvadweb.json`),
bundle sizes (`bundle-sizes.json` via `tools/bundle-sizes.mjs`, `file-sizes.json`).
