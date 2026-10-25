# Model matrix: every Whisper model the app offers, measured in the browser

Track `model-matrix-benchmark` (2026-10-25, late evening). Companion to `asr.md` (capabilities) and `model-catalog.json`
(sizes + the per-model `matrix` block written by this track). Qwen3-ASR 0.6B / 1.7B are the two non-Whisper entries of the
app's catalog and are covered by `qwen.md`, not here.

Everything below was **measured** on the development machine (Ryzen 7 7730U 8C/16T, 15 GB RAM, AMD Radeon RDNA-2 iGPU with
`shader-f16`, Windows 11, Chrome 155 headless via playwright-core `channel:'chrome'`, `@huggingface/transformers` 4.3.1,
onnxruntime-web 1.31.0-dev.20260914) with the harness and the reference worker of the `asr` track
(`C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/asr/`,
paths below are relative to it). Every number names its `results/*.json` file. Nothing is extrapolated unless it says
"arithmetic" or "assumption".

## 0. Verdict in one paragraph

Seven Whisper sizes, four of them never run in a browser before tonight. **All seven load and transcribe correctly in Chrome on
this laptop** with the reference engine; none failed, crashed, lost the WebGPU device or ran out of memory (the biggest, large-v3
q4f16, peaked at 7.7 GB of working set on the 15 GB machine). What separates them is speed, memory and word timestamps:
tiny/base are comfortably faster than real time on WebGPU *and* on single-thread WASM (5-minute file: RTF 0.33 / 0.44 on WebGPU);
small is faster than real time on WebGPU only (0.71 on passage-a, 0.81 on the 5-minute file); **medium, large-v3-turbo and
large-v3 are slower than real time on this iGPU** (RTF 1.8 / 1.4 / 1.8: a 10-minute file takes 14-18 minutes) with the best
accuracy of the set (passage-a WER 1.1 %, equal to the Python engine); distil-large-v3.5 on WebGPU is the only large-class model
under real time here (0.82-0.92), and the exact distil-large-v3 repo has no WebGPU-friendly export and runs at RTF 4.5 on WASM.
Word timestamps exist for every size that has a `_timestamped` export (tiny, base, small, medium, large-v3-turbo); **large-v3 and
distil-large-v3 do not** (no cross-attention outputs in any published export), so those two sizes lose per-word timing and
confidence unless we export them ourselves. Nothing was measured on a phone, in Safari / Firefox, or over a real network
(sections 5 and 6 give the arithmetic and the gaps).

## 1. Method and trust

* **Engine**: the reference worker of `asr.md` (`reference/src/engine.ts`): own decode loop, greedy unless stated, temperature
  ladder on, word timestamps on (teacher-forced alignment pass), language auto-detected per window, windows packed at pauses into
  <= 28 s (`exp/common.mjs packWindows`), exactly what the production engine will do. "Built-in" rows use `model.generate()` of
  Transformers.js instead (one 22.7 s window, English forced, no words).
* **RTF** = wall-clock seconds / audio seconds, lower is faster, < 1 means faster than real time. It includes feature extraction,
  encoder, decoder, the alignment pass and the message round trips, not the model load.
* **Fixtures**: `passage-a` (73.2 s, 174 normalised words), `passage-b` (22.7 s, 63), `passage-c` (7.0 s, 18) from
  `frontend/fixtures`; **`long5min`** = passages a b c a b c a b concatenated (301.6 s, 747 words, 12 windows, built by
  `make-long5.mjs`). WER = word Levenshtein against `fixtures/texts/*.normalized.txt` with the same normaliser as the Python
  accuracy tool.
* **Downloads**: nothing came from the internet during a measured run. The models were fetched once into the replay cache
  (`driver/prefetch.mjs`, 11-12 MB/s tonight: 1,037 MB in 90 s, 2,185 MB in 204 s) and served from `localhost`. So **"cold load"
  below = Cache API empty, files streamed from localhost = the first visit minus the network transfer time**; add
  `bytes / bandwidth` for a real visitor (section 5). "Warm load" = second launch of the same profile with the network cut
  (`hf:'offline'`), everything from the Cache API.
* **Bytes**: "model MB" = encoder + decoder ONNX files (catalog, 1 MB = 1e6 bytes); "first visit MB" = everything the page actually
  pulled: model + tokenizer/configs (~2.5-4 MB) + the ORT runtime `ort-wasm-simd-threaded.asyncify.wasm` (26.86 MB; shipping the
  jspi build saves 10 MB, `asr.md` Q9).
* **Memory** = per-process working set read from the OS (`driver/procmem.ps1`): renderer that hosts the worker, GPU process,
  and the sum over all Chrome processes of the instance ("total"). The idle harness page is 454-468 MB total before any model.
* **The machine was shared.** Every run stores a CPU calibration (`calibMs`: 3e7 `Math.sqrt`, 91-160 ms when quiet; the runs
  quoted as speed numbers are all in that range unless the table says otherwise). Tonight's new runs were executed in lanes that
  overlapped (lane logs in `logs/lane*.log` carry the timestamps): the big-model loads ran at the same time as the first 5-minute
  WASM runs and the first weak-device run, which inflated them (tiny WASM 5-minute RTF 0.72 busy vs 0.20 alone); the WASM
  5-minute runs were therefore repeated alone at the end (`*-quiet`, calib 101-106 ms) and the weak-device run was repeated
  (`throttle-tb2`). The WebGPU 5-minute runs and the big-model runs could not be repeated inside the time box and were measured
  with other lanes active (their calib is 109-173 ms, but GPU and memory-bandwidth contention do not show in a CPU calibration).
  The table marks them "busy". Timing numbers are comparable within a run, not to the millisecond across runs; the quiet
  passage-a pairs of the `asr` track remain the cleanest WASM-vs-WebGPU comparison.

## 2. The matrix

Legend: `wasm` = `device:'wasm'`, dtype q8, 1 thread (the app will not be cross-origin isolated); `gpu` = `device:'webgpu'`,
encoder/decoder fp16 for tiny/base/small, q4f16/q4f16 for the big ones (smallest viable download). Load = cold -> warm (s).
RTF-a = passage-a, RTF-5 = `long5min`. WER a / b / 5 = passage-a / passage-b / long5min, greedy; "b5" = beam 5 on passage-a.
Peak = total working set of all Chrome processes at the worst point of the memory run (after load + 5 windows incl. one beam-5
window), renderer / GPU process in brackets. Min RAM = assumption derived in section 5.

| Model | Repo (word timestamps) | Works | Model MB (first visit MB) | Load wasm / gpu | RTF-a wasm / gpu | RTF-5 wasm / gpu | WER a / b / 5 (wasm; gpu) | b5 | Peak MB wasm / gpu (renderer / GPU) | Min RAM | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| tiny | `onnx-community/whisper-tiny_timestamped` (yes) | wasm q8, wasm fp32, gpu fp16, fp16/q4f16, fp32/q4 | 40.8 (70.5) wasm; 76.1 (105.7) gpu | 4.6 -> 3.9 / 5.6 -> 5.2 | 0.33 / 0.22 | 0.20 (quiet) / 0.33 (busy) | 4.6 / 0 / 2.9; 1.7 / 0 / 1.9 | 10.3 (q8, worse) / 2.3 (fp16) | 1,224 (722 / 137) / 2,065 (783 / 888) | 2 GB | go; q8 costs 3 WER points, prefer fp16 on WebGPU |
| base | `onnx-community/whisper-base_timestamped` (yes) | wasm q8, gpu fp16, fp16/q4f16, fp32/q4 | 76.9 (106.6); 146.0 (175.7) | 5.2 -> 4.9 / 9.3 -> 5.0 | 0.52 / 0.29 | 0.37 (quiet) / 0.44 (busy) | 2.9 / 0 / 1.9; 2.9 / 0 / 2.0 | 2.9 / 2.9 (no gain) | 1,367 (841 / 137) / 2,504 (1,004 / 1,062) | 2-3 GB | go |
| small | `onnx-community/whisper-small_timestamped` (yes) | wasm q8, gpu fp16, fp16/q4f16, fp32/q4 | 249.0 (278.7); 485.0 (514.7) | 11.3 -> 6.4 / 13.8 -> 9.1 | 1.49 / 0.71 | not run / 0.81 | 1.7 / 0 / -; 1.7 / 0 / 1.5 | - / 1.7 | 2,210 (1,590 / 137) / 5,827 (2,083 / 3,114); 7,028 after 12 windows | 4 GB wasm, 8 GB gpu | go on WebGPU; WASM 1-thread is 1.5x slower than real time |
| medium | `onnx-community/whisper-medium_timestamped` (yes) | gpu q4f16/q4f16 | 516.9 (548.0) | - / 18.3 cold | not run / 1.8 | not run | - ; 1.1 / 0 / not run | not run (4-6x cost, see asr.md Q6) | - / 5,337 (2,043 / 2,631) | 8 GB | works, slower than real time on this iGPU (decoder ~390 ms per step) |
| large-v3-turbo | `onnx-community/whisper-large-v3-turbo_timestamped` (yes) | gpu q4f16/q4f16 | 563.6 (593.3) | - / 16.0 cold | not run / 1.36 | not run | - ; 1.1 / 0 / not run | not run (4-6x cost, see asr.md Q6) | - / 5,057 (2,323 / 2,038) | 8 GB | works, best WER, slower than real time on this iGPU (encoder 13.5-14.2 s per 30 s window) |
| large-v3 | `onnx-community/whisper-large-v3-ONNX` (**no** `_timestamped` export: no words) | gpu q4f16/q4f16 | 979.5 (1,010.6) | - / 22.0 cold | not run / 1.77 | not run | - ; 1.1 / 0 / not run | not run | - / 7,697 (3,175 / 3,602) | 16 GB | works, no word timestamps, 1 GB download, 7.7 GB peak |
| distil-large-v3 | `distil-whisper/distil-large-v3` (fp32/q8 only); `distil-whisper/distil-large-v3.5-ONNX` q4f16 (**no** word timestamps in either) | gpu q4f16/q4f16 (v3.5); wasm q8 (v3, works but RTF 4.5) | 533.6 (564.8) v3.5 gpu; 766.8 (796.5) v3 wasm | 16.6 cold / 8.2 cold | 4.53 (passage-b) / 0.82 | not run | 0 (b only) ; 1.7 / 0 / not run | not run | 3,917 (2,825 / -) / 4,507 (2,043 / 1,695) | 8 GB | v3.5 on WebGPU is the only large-class model faster than real time here (RTF 0.82-0.92); exact v3 has no WebGPU-friendly export |

Python reference for the same clips (faster-whisper 1.2.1, int8 on 8 CPU cores, beam 5, `results/fw/*.json`): WER passage-a tiny
1.1 %, base 2.3 %, small 1.1 %; RTF 0.08 / 0.20 / 0.66 - the browser WebGPU path is 1.1-3x slower than the server CPU path for
tiny/base and about equal for small; the single-thread WASM path is 2.6-4x slower than the server.

## 3. Per model

### 3.1 tiny (`qual-tiny-*.json`, `bench-tiny-*.json`, `q10-mem-tiny-*.json`, `coldwarm-tbs.json`, `long5-tiny-*.json`, `throttle-tb2.json`)

* Works: WASM q8 (40.8 MB) and fp32 (151.6 MB); WebGPU fp16/fp16 (76.1 MB), fp16/q4f16 (62.5 MB), fp32/q4 (119.7 MB, the no
  `shader-f16` fallback), fp32/fp32 (151.6 MB, the library default - avoid). Word timestamps: yes (6 alignment heads).
* First visit pulls 70.5 MB (wasm q8) / 105.7 MB (gpu fp16) incl. the 26.9 MB ORT runtime; the Cache API then holds 67.3 / 100.9 MB
  in 9 entries (`coldwarm-tbs.json`). Load: cold 4.6 s -> warm 3.9 s (wasm), 5.6 -> 5.2 s (gpu); session creation is 90 % of both,
  so the Cache API saves little once the bytes are local - the network is the real cold-start cost (section 5).
* Speed, reference engine: passage-a RTF 0.33 wasm / 0.22 gpu. **5 minutes** (`long5min`, 301.6 s): WebGPU fp16 **RTF 0.325**
  (97.9 s wall, 14 windows incl. two 1.5-2.8 s seek windows, calib 144 / 115 ms, measured while the big-model lane and the
  weak-device lane were running, `long5-tiny-webgpu-fp16.json`); WASM q8 **RTF 0.204** (61.6 s, 12 windows, calib 106 / 73 ms, run
  alone on the quiet machine, `long5-tiny-wasm-q8-quiet.json`; the same run during the busy phase gave 0.72,
  `long5-tiny-wasm-q8.json`). On a quiet machine the WASM number beats the busy WebGPU one, so do not read "WASM faster than
  WebGPU" into this table: the clean pair is passage-a, 0.33 vs 0.22. Built-in `generate()` on one window: 0.27 wasm 1 thread (0.21 with 4 isolated threads), 0.18 gpu fp16,
  0.16 gpu fp16/q4f16.
* Accuracy: passage-a 4.6 % (8/174) q8, 1.7 % fp32 and fp16, Python 1.1 %; passage-b 0 %; beam 5 made q8 **worse** (10.3 %) and
  fp16 slightly worse (2.3 %) at 4-6x the decode cost. `long5min` WER: **1.87 % (14/747) on WebGPU fp16** with the seek loop
  (every error is a substitution of the fixture's hard tokens: third/three, write/right, switched/switch, PostgreSQL, dollars);
  WASM q8 **2.95 % (22/747)** quiet run with the seek loop (same substitution pattern plus "project"/"projects"; nothing
  dropped), 3.61 % in the busy run without the seek loop (27/747, five words of "Welcome back to the show" lost at a voice change).
* Memory: total peak 1,224 MB wasm (renderer 722, idle page 457) / 2,065 MB gpu (renderer 783 + GPU process 888); after
  `dispose()` + `terminate()` 606 / 1,025 MB.
* Weak device: section 4.

### 3.2 base (`qual-base-*.json`, `bench-base-*.json`, `q10-mem-base-*.json`, `coldwarm-tbs.json`, `long5-base-*.json`, `throttle-tb2.json`)

* Works: WASM q8 (76.9 MB); WebGPU fp16/fp16 (146.0 MB), fp16/q4f16 (109.8 MB), fp32/q4 (206.2 MB). Words: yes (8 heads).
* First visit 106.6 MB (wasm) / 175.7 MB (gpu); Cache API 101.6 / 167.5 MB. Load: cold 5.2 s -> warm 4.9 s (wasm), 9.3 -> 5.0 s
  (gpu; the cold WebGPU figure ran during a busy minute, calib 211 ms).
* Speed: passage-a RTF 0.52 wasm / 0.29 gpu. **5 minutes**: WebGPU fp16 **RTF 0.437** (131.8 s, 13 windows, calib 109 / 95 ms,
  `long5-base-webgpu-fp16.json`, measured while other lanes ran; the decoder is 7.3-11.2 s of every ~10 s window, the encoder
  0.55-0.7 s); WASM q8 **RTF 0.365** (110.1 s, 14 windows incl. two 6.7 s seek windows, calib 101 / 74 ms, run alone,
  `long5-base-wasm-q8-quiet.json`; 0.66 in the busy run `long5-base-wasm-q8.json`). Built-in: 0.47 wasm 1 thread (0.32 iso4), 0.27 gpu fp16, 0.20 gpu fp16/q4f16, 0.23 fp32/q4.
* Accuracy: passage-a 2.9 % (5/174) on both devices, Python 2.3 %; fp32/q4 3.4 %; passage-b 0 %; beam 5 = greedy. `long5min`:
  **2.01 % (15/747) on WebGPU fp16** with the seek loop (Kubernetes -> "Covernet's"/"Cabernet's" 3x, third/three, dollars,
  switched, twelfth/twelve - no dropped words); WASM q8 **1.87 % (14/747)** in the quiet seek-loop run (the seek fired twice,
  each time re-decoding the 6.7 s passage-c that base had skipped at the voice change). The first WASM run without the seek loop
  (`long5-base-wasm-q8.json`, fixed windows) scored 6.69 % because base stopped decoding at the speaker change inside two
  windows and the 18-word passage-c was lost both times - the seek loop (`consumedSeconds`) is not optional in the engine.
* Memory: 1,367 MB wasm (renderer 841) / 2,504 MB gpu (renderer 1,004 + GPU 1,062).

### 3.3 small (`qual-small-*.json`, `bench-small-*.json`, `q10-mem-small-*.json`, `coldwarm-tbs.json`, `long5-small-webgpu-fp16+fp16.json`)

* Works: WASM q8 (249.0 MB); WebGPU fp16/fp16 (485.0 MB), fp16/q4f16 (322.3 MB), fp32/q4 (586.2 MB; load took 32 s and peaked at
  5,572 MB - avoid fp32 encoders). Words: yes (10 heads).
* First visit 278.7 MB (wasm) / 514.7 MB (gpu); Cache API 265.8 / 490.9 MB. Load: cold 11.3 s -> warm 6.4 s (wasm), 13.8 -> 9.1 s
  (gpu).
* Speed: passage-a RTF **1.49** wasm 1 thread (slower than real time; 0.70-0.76 with 4-8 isolated threads, which the ad pages
  cannot have) / **0.71** gpu. **5 minutes on WebGPU fp16: RTF 0.81** (243.9 s, 12 windows, no seeks, calib 122 / 80 ms,
  `long5-small-webgpu-fp16.json`; decoder 12.8-20.2 s per window, encoder 1.6-2.0 s, alignment ~1 s). WASM was not run on the
  5-minute file: by the passage-a factor it would take ~7.5 min. Built-in: 1.66 wasm t1, 0.56 gpu fp16, 0.47 gpu fp16/q4f16.
* Accuracy: passage-a 1.7 % (3/174) on both devices, Python 1.1 %; passage-b 0 %; beam 5 = greedy (1.7 %) at 4.3-4.7x cost.
  `long5min`: **1.47 % (11/747)** on WebGPU - the best 5-minute number of the three (Kubernetes 3x, third/three, dollars,
  twelfth/twelve; nothing dropped).
* Memory: 2,210 MB wasm (renderer 1,590) / **5,827 MB gpu** (renderer 2,083 + GPU 3,114, growing per window - `asr.md` Q10 open
  item). The 5-minute run ended at **7,028 MB total peak with the GPU process at 4,348 MB after 12 windows** (renderer 2,050) -
  the growth continues beyond the 5 windows measured before. The fp16/q4f16 mix peaked lower in the built-in bench (renderer
  1,492 / GPU 1,464 vs 2,057 / 1,720).

### 3.4 medium (`large-medium-webgpu-q4f16.json`)

* Repo `onnx-community/whisper-medium_timestamped`, WebGPU, encoder q4f16 (180.6 MB) + decoder q4f16 (336.3 MB) = 516.9 MB; first
  visit 548.0 MB. **Loads and runs**: load 18.3 s cold (sessions 17.5 s), cross-attentions present (6 alignment heads), word
  timestamps on.
* Speed (calib 173 ms before / 105 ms after - the other lanes were still loading models at the start): passage-b RTF **2.1**
  (encoder 7.7 s, 89 decoder steps 34.9 s = ~390 ms per step, alignment 3.3 s), passage-a RTF **1.8** (encoder 7.1-7.7 s,
  decode 30.5-34.2 s per window). The 24-layer decoder makes medium **slower than large-v3-turbo** on this iGPU although its
  encoder is twice as fast.
* Accuracy: passage-b 0 %, passage-a **1.1 % (2/174)**; temperature 0 everywhere, no fallbacks.
* Memory: total peak **5,337 MB** (renderer 2,043, GPU process 2,631, still growing window by window: 2,124 -> 2,449 -> 2,631).
* Not tried: fp16 encoder (614.7 MB), WASM q8 (985.7 MB).

### 3.5 large-v3-turbo (`large-large-v3-turbo-webgpu-q4f16.json`)

* Repo `onnx-community/whisper-large-v3-turbo_timestamped`, WebGPU, encoder q4f16 (370.0 MB) + decoder q4f16 (193.6 MB) = 563.6 MB;
  first visit 593.3 MB. **Loads and runs**: load 16.0 s cold (sessions 15.2 s), cross-attentions present (6 alignment heads), word
  timestamps work (`" Welcome" 0.00-0.36 p0.91, " back" 0.36-0.66 p0.98 ...`).
* Speed (calib 156 ms, other lanes active): passage-b RTF **1.46** (encoder 13.5 s, 87 decoder steps 16.4 s = ~190 ms per step,
  alignment 1.9 s), passage-a RTF **1.36** (3 windows, encoder 13.7-14.2 s each). The 32-layer encoder is the cost on this iGPU;
  the 4-layer decoder is only ~2x slower per step than small's.
* Accuracy: passage-b 0 %, passage-a **1.1 % (2/174)** - the best browser number and equal to Python tiny/small beam 5. One
  temperature (0) per window, no fallbacks.
* Memory: total peak **5,057 MB** (renderer 2,323 after load, GPU process 2,038); steady state ~4.0 GB while running; back to
  2,561 MB after the run without disposing.
* Not tried (download budget): fp16 encoder (1,274 MB), WASM q8 (1,085 MB; by the small WASM factor it would be far slower than real time).

### 3.6 large-v3 (`large-large-v3-webgpu-q4f16.json`)

* Repo `onnx-community/whisper-large-v3-ONNX` (the only Transformers.js export; **no `_timestamped` variant exists, so no word
  timestamps and no per-word confidence** - the engine reports `hasCrossAttentions:false` and falls back to segment timing),
  WebGPU, encoder q4f16 (369.9 MB) + decoder q4f16 (609.6 MB) = 979.5 MB; first visit **1,010.6 MB**.
* **Loads and runs on this 15 GB laptop**: load 22.0 s cold (sessions 21.4 s). No error, no device loss, no OOM.
* Speed (calib 127 / 108 ms): passage-b RTF **1.9** (encoder 13.7 s, 86 decoder steps 26.5 s = ~310 ms per step), passage-a RTF
  **1.77** (encoder 13.8-14.9 s, decode 24.6-28.2 s per window). Roughly: turbo = large-v3 encoder + a 4-layer decoder, so large-v3
  costs the same encoder time plus a decoder that is 1.6x slower per step than turbo's.
* Accuracy: passage-b 0 %, passage-a **1.1 % (2/174)** - identical to turbo and medium on these fixtures (the two errors are the
  fixtures' "third"/"three" and "dollars" tokens that every model gets wrong).
* Memory: total peak **7,697 MB** (renderer 3,175 after load, GPU process 3,602). This is the largest footprint measured; with the
  idle OS the machine was at the edge of its 15 GB. A visitor with 8 GB will not run this safely; 16 GB is the assumption.
* Not tried: WASM q8 (1,821.9 MB download) - by the small WASM factor (RTF 1.49 for a 12-layer model) it cannot be near real time.

### 3.7 distil-large-v3 (`large-distil-large-v3.5-webgpu-q4f16.json`, `large-distil-large-v3-wasm-q8.json`)

Two repos matter. The app's model id is `distil-large-v3`; its official repo `distil-whisper/distil-large-v3` carries ONNX files in
fp32 and q8 only (no fp16 / q4 / q4f16, so no small WebGPU download: 3,026 MB fp32 or 766.8 MB q8). The successor
`distil-whisper/distil-large-v3.5-ONNX` has the full dtype set (q4f16 533.6 MB). Neither has a `_timestamped` export: **no word
timestamps, no per-word confidence** for this size either.

* **distil-large-v3.5, WebGPU q4f16/q4f16** (369.9 + 163.7 MB; first visit 564.8 MB): loads in **8.2 s** (sessions 7.7 s) and is the
  **fastest big model here: passage-b RTF 0.92, passage-a RTF 0.82** (encoder 13.5-14.2 s per window like every large-v3-family
  encoder, but 86 decoder steps take only 6.0 s = ~70 ms per step with the 2-layer decoder). WER passage-b 0 %, passage-a 1.7 %
  (3/174); temperature 0, no fallbacks. Peak total **4,507 MB** (renderer 2,043, GPU process 1,695). Calib 129 / 154 ms.
  If the owner accepts v3.5 in place of v3 (same family, English-only, newer distillation), this is the one large-class model that
  is faster than real time on this iGPU.
* **distil-large-v3 (the exact repo), WASM q8** (645.2 + 121.6 MB = 766.8 MB; first visit 796.5 MB; one 22.7 s window, 1 thread):
  **loads (16.6 s) and transcribes correctly (passage-b WER 0 %) but at RTF 4.53** - the 32-layer encoder alone takes 91 s per
  window on one WASM thread (117 s during the warm-up while other lanes were loading; calib 185 / 89 ms), the 2-layer decoder
  10.8 s for 84 steps. Peak total 3,917 MB (renderer 2,825 after load). It is a working fallback for the exact model only in the
  sense that it finishes; a 10-minute file would take 45 minutes. The q8 encoder on WebGPU was not tried: ORT's WebGPU EP has no
  kernels for the `MatMulInteger`/`DynamicQuantizeLinear` graph and falls back to CPU, which would be the same number.

## 4. Weak-device emulation (`throttle-tb.json`, `throttle-tb2.json`)

**CDP CPU throttling does not reach the worker.** `Emulation.setCPUThrottlingRate {rate:4}` on the page session slowed the page
main thread's calibration loop 382 -> 1,143 ms (3.0x; 268 ms after the reset) while the same loop *inside the model worker* stayed at
303 -> 207 -> 292 ms (`throttle-tb.json partA`). Attaching to the worker target (`Target.attachToTarget`, flatten) succeeds but the
Emulation domain cannot be addressed there through Playwright's CDP session (`Target.sendMessageToTarget` is rejected under the
flat protocol), and Chromium's throttler is per-thread by design. Consequence for anyone repeating this: a DevTools "4x slowdown"
measurement of an in-worker Whisper engine measures nothing - the reference engine's wall time under CDP 4x was equal to the
baseline on all four combinations (tiny WASM 11.1 vs 11.5 s, base WASM 17.2 vs 18.3 s, tiny WebGPU 6.9 vs 7.1-8.1 s, base WebGPU
12.8 vs 12.9 s, `throttle-tb.json partB`, main-thread calibration 563-887 ms during those runs).

**Processor affinity is the emulation that works.** `driver/affinity.ps1` pins every process of the harness browser (browser, GPU
process, renderers, utilities) to one logical CPU (`0x1`) or to two (`0x3`, one physical core with SMT) - a 1-core / 1-core-2-thread
budget for the whole browser, closer to a low-end phone or Chromebook than a throttle would be. The first run (`throttle-tb.json`)
hit a PowerShell bug in the helper (the mask was written back into its own string parameter; fixed) so only its last two
combinations carry valid affinity numbers; the complete re-run is `throttle-tb2.json`:

| model / device | baseline (2 runs) | CDP 4x (main-thread calib) | 1 logical CPU (`0x1`, 2 runs) | 2 logical CPUs (`0x3`) |
|---|---|---|---|---|
| tiny WASM q8 | 8.6 s, 9.4 s (RTF 0.38-0.41) | 7.5 s (562 ms) | 10.7 s, 11.1 s (RTF 0.47-0.49) | 9.0 s (0.40) |
| base WASM q8 | 18.9 s, 15.9 s (0.70-0.83) | 14.2 s (713 ms) | 18.8 s, 17.2 s (0.76-0.83) | 15.8 s (0.70) |
| tiny WebGPU fp16 | 8.2 s, 8.8 s (0.36-0.39) | 7.9 s (559 ms) | 7.8 s, 8.0 s (0.34-0.35) | 7.3 s (0.32) |
| base WebGPU fp16 | 11.7 s, 12.8 s (0.51-0.56) | 11.9 s (564 ms) | 8.8 s, 11.0 s (0.39-0.48) | 12.6 s (0.55) |

Reading (passage-b, 22.7 s, greedy + words, `throttle-tb2.json`; the run overlapped with the cold/warm loads and the distil WASM
load, main-thread calib 98-232 ms outside the CDP rows): the reference engine is single-threaded on WASM (1 ORT thread, no
isolation) and its WebGPU path is one JS thread plus the GPU process, so **pinning the whole browser to one logical CPU costs
0-25 %** (tiny WASM +20 %, base WASM ~0, tiny WebGPU ~0 within the noise). In the first, noisier run (`throttle-tb.json`,
affinity valid for the WebGPU rows only) tiny WebGPU on one logical CPU took 24.1 / 21.5 s against 7.1-8.1 s (3x) while base
WebGPU went 27.7 then 13.2 s - the two runs disagree, so for WebGPU the core-count effect is **inconclusive** on this machine.
What this emulation cannot do is make a core slower per clock: a Zen 3 logical CPU at 4 GHz is still 2-4x a budget phone core
on scalar JS and WASM [inference from published per-core benchmarks, unverified here], so the phone-side expectation is the
WASM numbers above times 2-4, i.e. tiny around real time and base slower than real time on a weak phone. Baselines in this file
(8.6-9.4 s tiny WASM for passage-b against 8.5 s in `qual-tiny-wasm-q8-v2.json`) show how much the shared machine moves numbers.

## 5. Phones, Safari and slow networks: arithmetic, not measurements

No phone, tablet, Safari or Firefox was available; nothing in this section is a measurement of those. The inputs are the
measured desktop numbers above; the rules of thumb are linear fits to them and break down outside the measured range.

**Memory per model (measured renderer / GPU-process peaks, MB, `q10-mem-*.json`, `large-*.json`):**

| | model file MB | renderer peak (WASM q8) | renderer peak (WebGPU) | GPU process peak (WebGPU) |
|---|---|---|---|---|
| tiny | 40.8 / 76.1 | 722 | 783 | 888 |
| base | 76.9 / 146.0 | 841 | 1,004 | 1,062 |
| small | 249.0 / 485.0 | 1,590 | 2,083 | 3,114 |
| medium q4f16 | 516.9 | - | 2,043 | 2,631 |
| large-v3-turbo q4f16 | 563.6 | - | 2,323 | 2,038 |

Fits (arithmetic): WASM q8 renderer peak ~ 0.45 GB + 4.3 x model MB (tiny 0.63 vs 0.72 measured, base 0.78 vs 0.84, small 1.52
vs 1.59); WebGPU renderer peak ~ 0.55 GB + 3.1 x model MB; WebGPU GPU process ~ 6 x model MB for fp16 (q4f16 is lower per byte:
the q4 weights stay small on the GPU). The renderer figure is what a per-tab limit sees. The WASM path keeps a full copy of the
model file as an `ArrayBuffer` plus ORT's copy inside the WebAssembly heap during session creation, which is why the peak is
several times the file size; it does not shrink after load (`q10-mem-*`: "after load" is already 85-95 % of the peak).

**What that means for phones (assumptions, marked):** per-tab memory limits on iOS Safari are not documented by Apple;
third-party reports put them around 1-1.5 GB on recent iPhones [unverified]. Android Chrome kills background tabs long before
that on 3-4 GB phones. Against those figures: tiny WASM q8 (0.72 GB) is the only size with headroom; base WASM q8 (0.84 GB) is
borderline; small (1.6 GB renderer on WASM, 2.1 GB + 3.1 GB on WebGPU) and everything above are desktop-only until measured on a
device. Minimum RAM column in section 2 = measured total peak + ~1 GB for the OS and the rest of the browser, rounded up:
tiny 2 GB, base 2-3 GB, small 4 GB (WASM) / 6-8 GB (WebGPU), medium and large-v3-turbo 8 GB (WebGPU peak 5.1-5.3 GB).
Safari: WebGPU ships in Safari 26 but `shader-f16` availability and the fp16 ONNX graphs were not tested [unverified]; the no-f16
fallback (fp32 encoder + q4 decoder) costs +57 % download for tiny and more memory (section 3). Firefox: WebGPU on Windows only;
the JSPI ORT build was not tested there (`asr.md` Q9).

**Download time (arithmetic, first visit bytes incl. the 26.9 MB ORT runtime; subtract 10 MB with the jspi build):**

| | first visit MB | 10 Mbit/s | 50 Mbit/s | 200 Mbit/s |
|---|---|---|---|---|
| tiny wasm q8 / gpu fp16 | 70.5 / 105.7 | 56 s / 85 s | 11 s / 17 s | 3 s / 4 s |
| base wasm q8 / gpu fp16 | 106.6 / 175.7 | 85 s / 141 s | 17 s / 28 s | 4 s / 7 s |
| small wasm q8 / gpu fp16 | 278.7 / 514.7 | 3.7 min / 6.9 min | 45 s / 82 s | 11 s / 21 s |
| medium gpu q4f16 | 548.0 | 7.3 min | 88 s | 22 s |
| large-v3-turbo gpu q4f16 | 593.3 | 7.9 min | 95 s | 24 s |
| large-v3 gpu q4f16 | ~1,010 | 13.5 min | 2.7 min | 40 s |

The Cache API quota seen on this machine was 10,307 MB per origin (`q8-cache.json`); Safari's default per-origin storage is much
smaller and evicts after 7 days without a visit [unverified] - a second download on iPhones is to be expected. Downloads resume
per file, not per byte (`asr.md` Q8), so a dropped connection at 90 % of a 370 MB encoder restarts that file.

## 6. Not measured / open

1. **Real network**: every model came from a local replay server; download time is arithmetic (section 5). Real first-visit
   behaviour (CDN throughput from India/EU/US, resume after a drop, mobile data caps) is unmeasured.
2. **Phones, tablets, Safari, Firefox**: nothing measured; section 5 is arithmetic plus flagged third-party claims. The only
   defensible phone candidate from the numbers is tiny (and perhaps base) on WASM.
3. **Weak device**: the CPU budget was emulated with processor affinity on a desktop CPU; a 1-core slice of a Zen 3 core is still
   faster per clock than a budget phone core, and GPU emulation is impossible here.
4. **Big models on WASM**: only distil-large-v3 q8 was run (RTF 4.53, one window, section 3.7). Its 91 s encoder pass is the same
   32-layer / 1280-wide encoder that medium (24 layers, 1024) and large-v3 / turbo share, so medium q8 / turbo q8 / large-v3 q8 on
   one WASM thread are a 4-10x-real-time proposition (arithmetic from that run, not measured).
5. **Big models at beam 5 / with the temperature ladder on noise**: not run; `asr.md` Q6/Q11 numbers (4-6x decode cost, 60-570 s per
   noise window) scale with the per-step cost (190-390 ms here vs 37-120 ms for tiny-small), so the VAD-in-front rule and
   `max_new_tokens` are not optional for them.
6. **GPU-process growth across windows** (medium: 2,124 -> 2,449 -> 2,631 MB over 5 windows; small fp16: 3,114 MB after 5 windows
   and **4,348 MB after the 12 windows of the 5-minute run**; base fp16 1,503 MB after 13) is still not classified as pool or leak
   (`asr.md` open item 2), but it clearly has not plateaued at 12 windows. A 60-minute file is ~130 windows; until this is
   understood the engine should `terminate()` and reload the worker every N windows on WebGPU (reload from cache is 3-9 s).
7. **large-v3 and distil-large-v3 have no word timestamps** in any published Transformers.js export; keeping the app's per-word
   output for those two sizes needs our own export with `output_attentions` (medium-sized task, not started) or a documented loss.
8. **The 5-minute runs**: the first two (WASM, `long5-{tiny,base}-wasm-q8.json`) ran while the big models were loading and used
   fixed windows without the seek loop, which lost whole sentences when the voice changed mid-window; the re-runs
   (`*-quiet`, WebGPU) use the seek loop. See 3.1-3.3 for which number is which.
9. Everything ran headless; `navigator.storage.persist()` and real eviction were not exercised (`asr.md` Q8).

## 7. Files and reproduction

Written by this track (everything else in the harness folder is the `asr` track's, reused unchanged except where noted):

* `docs/in-browser/spike/model-matrix.md` (this file) and the `matrix` block + `status` of every model in
  `docs/in-browser/spike/model-catalog.json` (written by `merge-matrix.mjs`; the previous catalog is kept as
  `results/model-catalog.before-matrix.json`).
* `make-long5.mjs` -> `audio/long5min.f32` + `audio/long5min.expected.txt` (passages a b c a b c a b, 301.6 s, 747 words).
* `exp/long5.mjs` (5-minute RTF with the reference engine, pause-packed windows <= 28 s, seek loop on `consumedSeconds`;
  `seek:false` reproduces the first two runs), `exp/coldwarm.mjs` (two launches per combination, same profile and port),
  `exp/throttle.mjs` + `driver/affinity.ps1` (weak-device emulation), `exp/large.mjs` (big-model probe with timeouts and error
  capture), `merge-matrix.mjs` (-> `results/matrix-summary.json` + catalog), the lane scripts `run-lane1.sh` ... `run-lane5.sh`
  (the exact `P` of every result file), `logs/lane*.log`, `logs/prefetch-large*.log`.
* Results: `results/long5-*.json`, `results/coldwarm-tbs.json`, `results/throttle-tb.json` (first run, affinity helper broken),
  `results/throttle-tb2.json`, `results/large-*.json`, `results/matrix-summary.json`.
* Replay cache additions (`cache/hf`, now ~6 GB): `whisper-large-v3-turbo_timestamped` q4f16, `whisper-medium_timestamped` q4f16,
  `whisper-large-v3-ONNX` q4f16, `distil-large-v3.5-ONNX` q4f16, `distil-large-v3` q8.

```
cd <scratchpad>/asr
node make-long5.mjs
P='{"model":"base","device":"webgpu","dtype":{"encoder_model":"fp16","decoder_model_merged":"fp16"}}' node driver/run.mjs exp/long5.mjs --tag base-webgpu-fp16 --offline
P='[{"model":"tiny","device":"wasm","dtype":"q8"}]' TAG=x node exp/coldwarm.mjs
P='{"combos":[{"model":"tiny","device":"wasm","dtype":"q8"}],"clip":"passage-b","rate":4,"mask":"0x1","mask2":"0x3"}' TAG=x node exp/throttle.mjs
P='{"model":"large-v3-turbo","repo":"onnx-community/whisper-large-v3-turbo_timestamped","device":"webgpu","dtype":{"encoder_model":"q4f16","decoder_model_merged":"q4f16"},"clips":["passage-b","passage-a"]}' node driver/run.mjs exp/large.mjs --tag x --offline
node merge-matrix.mjs
```

No file outside `docs/in-browser/spike/model-matrix.md`, `docs/in-browser/spike/model-catalog.json` and the scratchpad harness
folder was created or modified; no git command was run; every browser and server the runs started was closed by the driver.
