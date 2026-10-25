# Qwen3-ASR in the browser: feasibility spike and decision

Track: qwen-browser-feasibility. Research and experiments dated 2026-10-25. Branch `feature/in-browser`.
Nothing in the repo was changed except this file. Throwaway work (harness, downloaded models, raw results) is in the scratchpad (section 8).

Evidence tags used below:

- **[official]** Qwen / Google / library documentation, model cards or source that I fetched.
- **[third-party]** a number or claim published by someone else (not re-run by me).
- **[measured]** I ran it here (Chrome 155 / Edge 156, Windows 11, playwright-core 1.56.1).
- **[inference]** my reasoning from the above.
- **[unverified]** could not confirm; a to-do.

---

## 0. Decision

**PARTIAL: GO for desktop browsers with WebGPU (Chrome / Edge). NO-GO as a CPU / WebAssembly fallback.**
Whisper stays the default engine. Qwen stays an experimental, opt-in engine that is offered only where it can run, and is shown disabled with a reason (never silently dropped) where it cannot.

| Question | Answer |
|---|---|
| Can Qwen3-ASR run in a visitor's browser? | **Yes, proven here [measured].** Qwen3-ASR 0.6B and 1.7B ran end to end in stock Chrome 155 and Edge 156 on this laptop (AMD Radeon integrated GPU, WebGPU, `shader-f16`) from published ONNX files through onnxruntime-web, and produced correct English and Hindi (Devanagari) text. |
| Route | Published ONNX export (layout v2: audio encoder + decoder with GPU-resident KV cache + int8 embedding table) executed by onnxruntime-web WebGPU inside our own worker; tokenizer from Transformers.js; the adapter logic ported to TypeScript (section 4). Not a Transformers.js model class: 4.3.1 has none, upstream `main` has none, no `transformers.js`-tagged Qwen3-ASR repo exists. |
| Backup route | GGUF + wllama 3.x (llama.cpp compiled to WebAssembly, with WebGPU offload). Works [measured], far less code, but less control and an open threadpool regression in wllama >= 3.6.0. |
| Download | 0.6B: **0.89 GB** (q4f16, needs `shader-f16`) or 1.30 GB (q4, any WebGPU adapter). 1.7B: **1.96 GB** / 2.70 GB. Cached after the first visit (Cache API). |
| Speed | Dedicated GPU / Apple Silicon: real-time factor (RTF) 0.07-0.11 [third-party]. **This integrated GPU [measured]: RTF 0.48 (English) and 0.90 (Hindi) in the quietest window, 0.8-0.9 and 1.6-2.0 while the machine was about 80-90 % busy with other jobs.** Hindi is about 2-2.5x slower than English because Devanagari costs 8-10 decoder tokens per second of speech versus 3. |
| CPU / WASM | Unusable: onnxruntime-web WASM RTF 7.1 (8 threads) and 26 (1 thread); llama.cpp WASM (wllama) CPU RTF 5.2-5.8 [measured, machine loaded]. |
| Effort | About 12-14 person-days to parity with today's adapter behind an "experimental" flag (14-16 if we also re-export the models ourselves); +1 week for the optional speed work (section 6). |
| Licence | Apache-2.0 end to end; redistribution allowed with licence text, a change notice and attribution (section 2f). Do not copy code from the AGPL-3.0 Sokuji app. |
| Adapter logic | Chunk planner, overlap trimming, retries, review reasons, repetition guards and output parsing are engine-agnostic. I ported them and **differential-tested the port against the Python source on 16,000 random cases with zero mismatches** (section 4, Appendix A). |

What the user sees when it cannot run: the Qwen entries stay in the model picker, disabled, with one line such as
"Qwen3 ASR needs a desktop browser with WebGPU (Chrome or Edge). This device cannot run it. Whisper models work on every device."
If the owner ever runs a self-hosted server, the existing FastAPI Qwen adapter can serve those devices; that is the only non-browser route and it is not free.

---

## 1. Setup, method and honesty notes

- Machine: Windows 11 Home (10.0.26300), Ryzen 7 7730U (8 cores / 16 threads), 15.8 GB RAM, integrated AMD Radeon. Chrome reports `vendor: amd, architecture: rdna-2`, features include `shader-f16` and `subgroups`, `maxBufferSize` 2 GiB, `maxStorageBufferBindingSize` 2,147,483,644. WebGPU is available **without flags** in stock headless Chrome 155 and Edge 156 [measured: `navigator.gpu.requestAdapter()` probe, scratchpad `tools/webgpu_probe.mjs`]. The benchmark runs used `--enable-unsafe-webgpu --ignore-gpu-blocklist`, which are not needed.
- onnxruntime-web: `1.31.0-dev.20260914-8d85527a0`, the exact build that `@huggingface/transformers` 4.3.1 depends on, so the Qwen worker can share the Whisper engine's ORT build and wasm files (no second 26-28 MB wasm to host).
- **The machine was shared with other agents the whole time.** Typeperf samples taken at the start of my runs show 30-98 % total CPU already busy (Python and Node jobs; Windows Defender's MsMpEng was also seen using more than one core); free RAM fell to about 0 MB during two runs and one WASM tab crashed once (the retry ran). The ORT-web decode loop is dispatch-bound (CPU side), so **every absolute timing below is pessimistic and noisy.** Relative comparisons (fused vs split decoder, WebGPU vs WASM) were interleaved in one browser session and are the reliable part. Do not quote these timings as benchmarks.
- Test audio: FLEURS dev clips (CC-BY-4.0, downloaded for local testing only): 10 English (89.1 s, 203 reference words), 10 Hindi (120.6 s, 440 words), plus two 24 s concatenations. The sibling fixture set (`frontend/fixtures`) is English SAPI speech only and has no Hindi.
- The harness (about 270 lines of JavaScript) is clean-room, written from the public model-card contract; nothing was copied from Sokuji (AGPL-3.0). All model files were downloaded from the Hub and, for the five main 0.6B files, verified against the Hub's LFS SHA-256 values (all match).
- I did not export a model myself (section 2e) and did not run PyTorch, so **token-exactness versus PyTorch is third-party evidence only.**

---

## 2. Findings, question by question

### (a) Does `@huggingface/transformers` 4.3.1 know Qwen3-ASR?  No.

Installed in scratch (`npm install @huggingface/transformers@4.3.1`) and searched [measured]:

- `src/models/registry.js` has `qwen2, qwen2_moe, qwen3, qwen3_moe, qwen3_next, qwen2_vl, qwen2_5_vl, qwen3_vl, qwen3_vl_moe, qwen3_5, qwen3_5_moe`. No `qwen3_asr`, `qwen3-asr`, `qwen_asr`, `qwen2_audio` or `qwen3_omni`. `grep -ci` over `dist/transformers.web.js`, `.node.mjs`, `.node.cjs` for those names returns 0.
- Audio-LLM slots that exist: `AudioTextToText` = `granite_speech`, `ultravox`, `voxtral`, `voxtral_realtime`; speech seq2seq = `whisper`, `lite-whisper`, `moonshine`, `cohere_asr`, `speecht5`; CTC = `parakeet_ctc`, `wav2vec2*`, `hubert`, `wavlm`.
- Upstream `main` (pushed 2026-10-24; GitHub trees API, 1,123 entries, 230 model directories) has no `qwen3_asr` directory. GitHub issue / PR search for "qwen3-asr", "qwen3_asr", "Qwen3ASR" in `huggingface/transformers.js` finds nothing relevant.
- Hub: 718 repositories match `qwen3-asr | qwen3_asr | qwen3asr`; **0** carry the `transformers.js` tag or library name; none are under `onnx-community`, `Xenova`, `webml-community` or `huggingface` (HF API queries).
- What adding it would take [inference]: `voxtral` is a 3-line class over `UltravoxModel`, so a `Qwen3ASRForConditionalGeneration` class plus a processor (variable-length 128-bin mel, audio-pad expansion) is small. The blocker is the files: the `AudioTextToText` loader wants `audio_encoder`, `embed_tokens` and `decoder_model_merged` ONNX files in the Optimum layout, and every existing Qwen3-ASR export uses a different layout (separate init/step graphs or a genai-built fused graph, host-side embedding lookup). Not recommended now; revisit if we want to upstream it.
- Useful part: Transformers.js **does** load the Qwen3-ASR tokenizer (`Qwen2Tokenizer`), maps `<asr_text>` to id 151704 and `language English` to `[11528, 6364]`, matching the model's prompt config [measured: `tools/tok_ids.mjs`]. Use `AutoTokenizer` for prompt and context ids; no custom BPE is needed (decode is 20 lines, shown in the harness).

### (b) Existing ONNX exports  Plenty, several built for the browser

HF API on 2026-10-25: of 718 matching repositories, **66 are tagged `onnx`, 8 are tagged `webgpu`**, 106 `gguf`, 66 `mlx`, 12 `openvino`, 15 `coreml`, 2 `tflite`/`litert`.
Official weights: `Qwen/Qwen3-ASR-0.6B` (BF16, 938 M parameters in the safetensors metadata, 1.88 GB; 0.6B-`hf` variant 1.56 GB, tied embeddings) and `Qwen/Qwen3-ASR-1.7B` (2.35 B, 4.70 GB), both `license: apache-2.0`, not gated [official].

Architecture [official config.json]: audio encoder 18 layers, d 896, 14 heads, FFN 3584, 128 mel bins, 8x downsampling, output 1024 (1.7B: 24 layers, d 1024, 16 heads, FFN 4096, output 2048); text decoder Qwen3, 28 layers, hidden 1024 (1.7B: 2048), 16 query / 8 KV heads, head dim 128, vocab 151,936, tied embeddings. Mrope reduces to plain RoPE when all position streams are equal, as for a single audio clip [inference; the exports use a 1-D `position_ids` and reproduce PyTorch].

| Repo (revision) | What it is | Size | Evidence |
|---|---|---|---|
| `jiangzhuo9357/Qwen3-ASR-0.6B-ONNX` (`4a01b95f`) | **Layout v2 for onnxruntime-web WebGPU**: `encoder` (fp32 or fp16), `decoder_init` (prefill on host-built `input_embeds`, last-position logits), `decoder_step`, one shared weights file, int8 embedding table, `prompt_config.json` with every constant. Variants `q4` and `q4f16`. Apache-2.0. | q4f16 **0.89 GB**, q4 1.30 GB | I ran it [measured]. Model card / Sokuji notes [third-party]: the FP32 export matches PyTorch token for token (30/30 tokens on two clips); the v2 FP32 graphs match v1; q4f16 matches on ja / zh and differs by one punctuation token on English. |
| `jiangzhuo9357/Qwen3-ASR-1.7B-ONNX` (`fcc238df`) | Same layout, 1.7B. | q4f16 **1.96 GB**, q4 2.70 GB | I ran it [measured]. |
| `sorryhyun/qwen3-asr-onnx-gqa` (`075249f7`) | **Fused single-graph decoders** (prefill + step, GroupQueryAttention, fused QKV, int4 block 32), built with onnxruntime-genai. Drop-in for the split decoders; needs the other repo's encoder and embeddings. Apache-2.0. | 0.6B fp16 352 MB / fp32 406 MB; 1.7B fp16 985 MB / fp32 1.11 GB | I ran both sizes [measured]: 1.6-2.7x faster decode steps than the split decoders, same accuracy class (section 3). |
| `andrewleech/qwen3-asr-{0.6b,1.7b}-onnx` + `andrewleech/qwen3-asr-onnx` (code) | The reference exporter and native-ORT packages (FP32 + int4). Apache-2.0. Most other exports derive from its scripts. | 0.6B int4 1.3 GB, 1.7B 2.7 GB | README [third-party]: FP32 export vs PyTorch token-exact on 5-30 s clips; native CPU RTF 0.17 (0.6B) and 0.29 (1.7B) on a Ryzen AI 7 PRO 350; ORT's WebGPU execution provider (native, not in a browser) on that machine's Radeon 860M iGPU RTF 0.47, and DirectML produced garbage on that AMD iGPU. |
| `goryodog/tokihisu-qwen3-asr-0.6b-webgpu` | fp16 encoder + merged decoder from the official `-hf` checkpoint (manifest with hashes). | 1.89 GB | Model card only. |
| `uddompang/qwen3-asr-0.6b-onnx` (KamVox) | int8, used in a shipping browser product; CER 0.19 % vs PyTorch on 30 FLEURS zh clips [third-party]. | 1.08 GB | Model card only. |
| `rhasspy/qwen3-asr-0.6b-onnx-int4-merged` | Merged decoder that can reuse the KV cache of the context prompt (cheap vocabulary biasing). | - | Model card only. |
| `Reza2kn/mega-asr-onnx`, `mike1026915/Qwen3-ASR-1.7B-JA-ONNX`, others | ONNX of fine-tunes (robust-noise Mega-ASR, Japanese) in the same architecture. | 2.3 GB / - | Shows the export recipe is reusable for fine-tunes, e.g. the Apache-2.0 Hinglish fine-tune `moorlee/qwen3-asr-0.6b-hinglish` (outputs mixed Devanagari + Latin; WER 15.9 % on HiACC per its card). |

Third-party browser benchmarks of the jiangzhuo layout (Sokuji repo, 13 clips zh/en/ja, Chrome 152): RTX 4070 SUPER q4f16 RTF 0.087 (21 ms/token); Mac mini M4 q4f16 RTF 0.076 (16.6 ms/token); NVIDIA GB10 q4 RTF 0.081. The fused sorryhyun decoder on an M1 Pro: 0.6B 14.3 ms/token, 30 s chunk in 2.3 s; 1.7B 3.4 s. GPU memory (Windows, 4070, dedicated, peak): 1.9 GB for 0.6B q4f16, 3.3 GB for 1.7B q4f16. Their own wasm-EP numbers: RTF 2.97 (1 thread), 0.64 (8 threads). Note that every third-party GPU is a discrete or Apple GPU; the only AMD iGPU figure is the exporter README's 0.47 RTF on a Radeon 860M.

### (c) LiteRT / MediaPipe web runtime  No browser route today

- `litert-community/Qwen3-ASR-0.6B` is a **fixed 5-second, f32 `.tflite` of 3.13 GB** (plus a dozen or more MediaTek-specific builds of about 1.9 GB each) with an empty model card. `litert-community/Qwen3-ASR-1.7B` is two `.litertlm` files of 2.7 GB (int8 LM + fp16 encoder; 15 s or 30 s window) for the LiteRT-LM runtime [official model card].
- Its card documents Python, Kotlin / Android and a CLI only, and states **"the audio encoder does not run on the GPU delegate"**; int4 LM weights failed its correctness check (stops after the language tag on half the clips), so int8 is the floor: 2.7 GB.
- The LiteRT-LM **Web (JS) API** lists only Gemma 4 `*-gpu` `.litertlm` builds as "web-compatible models", with text-only examples; no audio or ASR example (developers.google.com/edge/litert-lm/js, fetched 2026-10-25) [official]. A web search found no browser audio support or any Qwen3-ASR browser demo on LiteRT.
- `soniqo/Qwen3-ASR-0.6B-Encoder-LiteRT-INT8` is the encoder only (189 MB), for Android.
- Verdict: NO-GO. Size alone (3.1 / 2.7 GB), the fixed windows and the missing web audio path rule it out.

### (d) GGUF + llama.cpp-style runtimes  Works, as a backup route

- llama.cpp supports Qwen3-ASR through `mtmd`: PR #19441 "mtmd: qwen3 audio support (qwen3-omni and qwen3-asr)" merged 2026-04-12 (release b8769), follow-up #23073 "add chunks and fix preproc for qwen3a" merged 2026-05-15 [official, GitHub API]. `ggml-org/Qwen3-ASR-0.6B-GGUF` has LM Q8_0 805 MB + mmproj Q8_0 214 MB (bf16: 1.51 + 0.38 GB); 1.7B: 2.17 GB + 356 MB. Only Q8_0 and bf16 are published by ggml-org; community repos add Q4_K_M etc. (handy-computer's `transcribe.cpp` GGUFs are single files for a different runtime and, I infer from their card and file list, are not loadable by llama.cpp).
- **wllama 3.x** (MIT; npm latest 3.8.1; llama.cpp `server-context` compiled to WASM) accepts audio parts (`{type:'audio', data: ArrayBuffer}`) with an `mmproj`, and since 3.1 offloads to **WebGPU** (Chrome only; "Firefox via compat mode, significantly degraded") [official].
- **Measured with wllama 3.5.1, 0.6B Q8_0 + mmproj Q8_0, Chrome 155, cross-origin isolated page, 8 threads:** it loads in 10-14 s, `supportInputModality('audio')` is true, and it returns `language English<asr_text>When you call someone who is thousands of miles away, you are using a satellite.` and `language Hindi<asr_text>कुतुहल गांव में आधे घंटे टलना समय की हानि नहीं है` (identical to the ONNX transcripts). CPU only (`n_gpu_layers 0`): 38.0 s for the 6.5 s English clip (RTF 5.8) and 33.5 s for the 6.4 s Hindi clip (RTF 5.2). **WebGPU offload (`n_gpu_layers 99`, mmproj offload): 7.5 s (RTF 1.15) and 11.1 s (RTF 1.72)**, similar to the ONNX route under the same load.
- Caveats: (1) wllama issue #294 (open, 2026-10-18): Qwen3-ASR 1.7B Q8_0 hangs in **3.6.0+** because llama.cpp's new persistent CPU threadpool starves wllama's fixed pthread pool; 3.5.1 works (what I used); a one-line pool-size patch is in the issue. (2) llama.cpp's own build docs still mark the WebGPU backend "In Progress" and it is Chrome-only. (3) Only an OpenAI-style chat API is exposed: no logits, no per-token probabilities, no control over the loop; language forcing needs assistant prefill and was not tried. (4) wasm32 caps memory at 4 GB; 1.7B Q8_0 (2.5 GB with mmproj) is near the practical limit.
- Other native-only stacks, for completeness: `handy-computer/transcribe.cpp` (MIT, ggml; no Emscripten / WASM app target in its tree, only ggml's wasm SIMD kernels), `k2-fsa/sherpa-onnx` (first-class native Qwen3-ASR support in 10+ languages, int8; its `wasm/` tree has `asr`, `vad-asr` etc. but **no Qwen3 WASM build**). Native ggml numbers on the same hardware class show the ceiling the browser cannot reach: Ryzen 7 PRO 4750U (Vega iGPU) 8.7-12.1x real time on Vulkan, 4.7-6.6x on CPU [third-party, transcribe.cpp docs].
- Verdict: **PARTIAL.** A viable second route (and an easy way to prototype), but not preferred because of the threadpool regression, the Chrome-only WebGPU backend and the lack of control.

### (e) Exporting the model ourselves  Feasible, not needed for the decision

- Pipeline [third-party, andrewleech README, Apache-2.0]: `export.py` (FP32, **about 5 min and 4 GB RAM for 0.6B; about 15 min and 10 GB for 1.7B** on CPU), `validate.py` (token-for-token vs PyTorch), `optimize_graphs.py` (RMSNorm / SkipLayerNorm / BiasGelu fusion), `quantize_nbits.py` (RTN int4, block 32 for the browser; block 64 collapsed on one zh clip), native fp16 encoder export, int8 embedding table, `prompt_config.json`; Sokuji's layout-v2 scripts add roughly 5 more minutes. The fused decoder [third-party, sorryhyun card] is `python -m onnxruntime_genai.models.builder -i <dir> -o out -p int4 -e webgpu --extra_options exclude_embeds=true prune_lm_head=true block_size=32 accuracy_level=4 enable_webgpu_graph=true fuse_qk_norm_gqa=false` (add `use_webgpu_fp32=true` for the fp32 graph) after extracting `thinker.model.*` and `thinker.lm_head.weight` into a `Qwen3ForCausalLM` folder.
- Local reality: `backend/.venv` has `ctranslate2`, `faster_whisper` and `onnxruntime` but **no torch and no `qwen_asr`** (`requirements-qwen.txt` pins torch 2.9.1, qwen-asr 0.0.6, gradio). A fresh venv with torch CPU + qwen-asr is about 2.5 GB of downloads. I judged a real export not worth the hour: three independent teams already ship validated exports, I confirmed the files hash-match the Hub, and the open questions are in the runtime, not the export.
- Why we may still re-export (1-2 days): one consistent pipeline for both sizes (fused decoder + fp16 encoder + a no-`shader-f16` fp32 variant), our own provenance and pinned mirror, a token-exact check against PyTorch on 5 clips (the one verification I could not do), and later fine-tunes such as Hinglish.
- Sizes (measured from the Hub file lists): 0.6B q4f16 = encoder.fp16 376 MB + decoder 345-352 MB + int8 embeddings 156 MB + tokenizer / config 15 MB = **about 0.89-0.90 GB**; 1.7B = 639 + 985-995 + 311 + 15 = **about 1.95 GB**. Fallback without `shader-f16`: 0.6B 1.30-1.32 GB, 1.7B 2.70 GB.
- Memory on an integrated GPU: the GPU shares system RAM. Third-party peaks on a discrete card are 1.9 GB (0.6B) and 3.3 GB (1.7B) of dedicated memory. On this machine both models loaded and ran with 15.8 GB total RAM under heavy pressure; renderer working set peaked at 744 MB (0.6B) and 990 MB (1.7B) [measured]. Windows per-process GPU counters for the Chrome GPU process read about 0.95 GB committed for both models, which cannot be right for 1.7B (weights alone are 1.6 GB), so I do **not** trust them; WebGPU exposes no memory API [inference]. Budget about 2 GB (0.6B) and 3.5 GB (1.7B) of GPU-addressable memory [third-party].

### (f) Licence and redistribution

| Item | Licence | Consequence |
|---|---|---|
| `Qwen/Qwen3-ASR-0.6B / 1.7B` weights, `QwenLM/Qwen3-ASR` code | Apache-2.0 [official] | Free to use and redistribute. |
| ONNX / GGUF / quantised derivatives (jiangzhuo9357, sorryhyun, andrewleech, uddompang, goryodog, ggml-org, handy-computer ...) | Apache-2.0 (cards); ggml-org's card has no licence field but its base model is Apache-2.0 | If **we** host a mirror: ship the Apache-2.0 text, keep attribution, and state that the files were modified (Apache-2.0 section 4b: converted to ONNX, int4 quantised, fp16, embeddings int8, tokenizer reduced). "Qwen" is a trademark: no endorsement claim. |
| Exporter code `andrewleech/qwen3-asr-onnx`, `onnxruntime-genai` (MIT), `onnxruntime` (MIT), `@huggingface/transformers` (Apache-2.0), wllama (MIT), transcribe.cpp (MIT), sherpa-onnx (Apache-2.0) | permissive | Reusable with attribution. |
| **Sokuji** (`kizuna-ai-lab/sokuji`, the app behind the jiangzhuo9357 exports and the only complete browser pipeline) | **AGPL-3.0** | Do **not** copy or adapt its source. Reading its public docs for the ONNX contract is fine; my harness and the Appendix A port are independent. |
| FLEURS test audio | CC-BY-4.0 | Used locally for tests only, not redistributed. |

Hosting: Cloudflare Pages has a 25 MiB per-file limit (see `hosting.md`), so models cannot live there; the Hub serves `resolve/<sha>/...` with `Access-Control-Allow-Origin` (reflects the caller's origin), `Accept-Ranges: bytes` and CDN redirects [measured with curl]. Recommended: mirror the pinned files into a Hub repo we control (the third-party repos belong to individuals and can change or disappear), pin by commit SHA, verify SHA-256 after download.

---

## 3. Measurements on this machine

All [measured]. Pipeline: WAV -> log-mel (my JS, naive DFT) -> encoder -> prompt with int8 embeddings -> prefill -> greedy decode with GPU-resident KV cache -> text. RTF = (mel + encoder + prompt build + prefill + decode) / audio seconds, warm. VAD, ffmpeg and model load are excluded. "split" = jiangzhuo9357 `decoder_init` + `decoder_step`; "fused" = sorryhyun single-graph GQA decoder. The log-mel matches `WhisperFeatureExtractor` (128 bins) from Transformers.js 4.3.1 exactly (654 frames: min -1.2966086, max 0.7033914, mean -0.68332, std 0.37378 in both).

### 3.1 It runs and the text is right

- English FLEURS clip: "When you call someone who is thousands of miles away, you are using a satellite." with WER 0 on every variant (0.6B and 1.7B, split and fused, q4 and q4f16, WebGPU, WASM, wllama). Edge 156 gives the same text.
- Hindi FLEURS clip: "कुतुहल गांव में आधे घंटे टलना समय की हानि नहीं है." (split, 0.6B and wllama) / "...हानी नही है।" (fused): same words, different spelling and punctuation, i.e. quantisation-level differences, not errors of understanding.
- Language tag: `language English` / `language Hindi` is emitted first and parsed; all 44 timed runs (22 clips x 2 decoders, no forcing) detected the right language.
- Accuracy sanity (basic normalisation: lower-case, punctuation stripped, no official FLEURS normaliser, small sample), corpus WER / CER against the FLEURS normalised transcription:

| Clips | Fused | Split | Published for 0.6B Q8_0, full FLEURS test [third-party] |
|---|---|---|---|
| English, 10 clips, 89 s, 203 words | WER 5.4 % / CER 1.6 % | WER 4.9 % / CER 1.4 % | WER 4.23 % |
| Hindi, 10 clips, 121 s, 440 words | WER 17.3 % / CER 10.5 % | WER 18.0 % / CER 8.7 % | WER 12.68 % |

  This is a plumbing check, not an accuracy claim. The browser pipeline reproduces the expected quality class, the fused and split decoders are equivalent within noise, and one English proper noun is a real model error ("Javanese" -> "Japanese", on both 0.6B decoders).
- Vocabulary prompt: system-turn context tokens ("Javanese cuisine, archipelago", 8 ids from the Transformers.js tokenizer) go into the prompt (228 -> 236 tokens) and decode normally. On that clip the biasing did **not** correct "Japanese" [measured, n=1]; the plumbing parity with the server adapter's `context=` argument is verified, the benefit is model-dependent (transcribe.cpp's notes say the 0.6B "echoes the dictionary into the output more often than the 1.7B").
- q4 (fp32 activations, 1.30 GB) on WebGPU: same English text, Hindi differs in a few tokens; needed for adapters without `shader-f16`.

### 3.2 Speed, 0.6B q4f16, WebGPU, integrated GPU

| Condition | Decoder | English RTF / ms per token | Hindi RTF / ms per token |
|---|---|---|---|
| Quietest window (2 consecutive runs per mode, CPU load not recorded; 13 s of audio per language) | fused | **0.48** / 84.5 | **0.90** / 88.7 |
| same | split | 0.89 / 136 (best), 223 (median) | 2.44 / 137 (best), 273 (median) |
| Full run, 44 runs, 517 s of audio, CPU 79 % mean / 100 % max (30 % at start) | fused | 0.82 / 193 | 1.96 / 175 |
| same | split | 1.69 / 488 | 4.89 / 469 |
| Re-run (CPU baseline 45 %, 89 % during), 6.5 s and 24 s clips | fused | 0.84-0.88 / 191-196 | 1.65-1.97 / 171-181 |
| same | split | 1.57-1.73 / 429-519 | 3.67-4.84 / 439-453 |

- Fused vs split: 1.6-2.7x faster per step, and far less sensitive to CPU contention (fewer graph nodes: 519 vs 1,586 per token [third-party, sorryhyun card]). Use fused.
- Tokens per second of audio: English 3.0-3.2, Hindi 7.6-10.2. Decode is 70-85 % of the time, so Hindi is about 2-2.5x slower in RTF.
- Mel with my naive O(N^2) DFT costs 0.06-0.1 RTF; an FFT (or the Transformers.js `spectrogram`) removes most of it. Encoder about 70-85 ms per second of audio; prefill 0.5-2.2 s per chunk.
- The first run after load pays shader compilation (prefill 2.4-4.7 s instead of about 0.5 s); do a warm-up decode at load.
- Load from local disk (fetch + session creation, 5.6-25 s depending on disk, antivirus and load): 0.6B 5.6-25 s (+3.3-6.2 s for the fused decoder); 1.7B 49 s (+31 s fused). Real download time depends on the network: 0.9 GB and 2 GB.
- The per-step time swings 2x with background load while GPU work is small, so the loop is **dispatch-bound on the CPU side** [inference; third-party says the same on every GPU]. Implication: batching several chunks into one decode loop should give a near-linear speed-up for file transcription, because the chunk plan is known up front. Not tested; it is the best lever (section 6).
- I could not obtain GPU-side kernel times: `env.webgpu.profiling` delivered no callbacks in this ORT build, and the Windows GPU-engine counters were not interpretable. So "dispatch-bound" is an inference, not a profile.

### 3.3 1.7B

| Decoder | English RTF / ms per token | Hindi RTF / ms per token | Hindi WER (one 6.4 s clip) |
|---|---|---|---|
| fused | 1.42 / 253 | 2.73 / 265 | 0.182 (0.6B fused: 0.455, split: 0.273) |
| split | 2.18 / 506 | 4.80 / 505 | 0.273 |

CPU was 91-99 % busy during this run and free RAM touched 0 MB. It loads and runs on a 15.8 GB integrated-GPU laptop under pressure, English WER 0. One clip is anecdotal; Sokuji's Japanese CER halves from 0.6B to 1.7B (0.147 -> 0.070) [third-party]. Cost is about 1.4x per token and 2.2x download.

### 3.4 CPU fallbacks (loaded machine)

| Route | RTF | Detail |
|---|---|---|
| onnxruntime-web WASM EP, q4 (fp32), 1 thread, not isolated | **26.0** | 7.4 s/token, encoder 6.6 s and prefill 15.6 s for a 6.5 s clip |
| onnxruntime-web WASM EP, q4, 8 threads, COOP/COEP isolated | **7.1** | 1.78 s/token, encoder 3.7 s, prefill 6.1 s |
| wllama 3.5.1 CPU, 8 threads, Q8_0 | 5.2-5.8 | 38.0 s and 33.5 s for 6.5 s clips |
| [third-party] ORT WASM on an NVIDIA GB10 | 2.97 / 0.64 | 1 / 8 threads |
| [third-party] native ORT CPU, Ryzen AI 7 PRO 350 | 0.17 | not a browser |

Even at the best third-party figure (0.64) a one-hour file would take 40 minutes with every core busy; on this machine it would be hours. Memory is also a problem: the q4 WASM path holds a 746 MB encoder plus the 382 MB decoder weights (passed to two decoder sessions, so probably copied twice [inference]) in the 4 GB wasm heap, and my first attempt crashed the tab (free RAM was near zero at the time). Conclusion: do not offer Qwen without WebGPU.

---

## 4. The Qwen adapter: what ports, what does not

Source: `backend/app/qwen_engine.py`, `backend/QUALITY.md`, `backend/tests/test_backends.py`, plus the `qwen_asr` package the adapter calls (its `parse_asr_output` and `detect_and_fix_repetitions` are used implicitly, so a browser port must carry them).

| Part | Where | Engine-agnostic? | Port status |
|---|---|---|---|
| VAD-based chunk boundaries (300 ms pauses, 100 ms padding), cut at the last pause after 60 % of the window, 25 s maximum, skip gaps >= 2 s, original sample offsets | `chunks()` | **Yes** (needs only speech intervals) | Ported as `planChunks`; 3,000 random plans identical to Python |
| Overlap only for forced cuts inside continuous speech; 2 s (or a quarter of the chunk) of preceding audio | `transcribe()` loop | Yes | Ported (`transcribeChunks`) |
| Exact suffix/prefix overlap removal (>= 3 words, ignore case and punctuation), never fuzzy | `token_key`, `trim_overlap` | Yes (pure strings) | Ported; 4,000 random cases identical |
| Retry of the non-overlapping audio when no reliable match; `boundary_resolution`, `overlap_recognition_text`, `recognition_text`, `overlap_words_removed` | loop | Yes | Ported; the call positions `[0,400000], [368000,432000], [400000,400000]` from the Python test reproduce exactly |
| `review_reasons`: `boundary_retry`, `repeated_phrase` | loop, `repeated_phrase` | Yes | Ported; 4,000 random cases identical |
| Approximate chunk timing, `timing:'chunk'`, `words:null`, `confidence:null`, `language_probability:null` | segment dict | Yes (the UI `Segment` type already allows it) | Ported |
| Cancellation between chunks and after inference (no retry after a cancel) | loop | Yes (+ a per-token check, which the browser can do in ~100 ms) | Ported; Python test reproduced |
| Silent file: no segments, model never loaded; cleanup in `finally` | `transcribe()` | Yes | Empty plan -> caller skips model load |
| Hinglish conversion hook `convert_segment` for Hindi/English segments, `original_text` kept for "apply style only" | loop | Yes (belongs to the Hinglish track) | Hook parameter provided |
| **Inherited from `qwen_asr`:** runaway-repetition guard (character run > 20 and pattern run >= 20 collapsed) | `detect_and_fix_repetitions` | Yes | Ported; 2,500 random cases identical |
| **Inherited:** output parser (`language X<asr_text>`, `language None` => empty, forced language => text only) | `parse_asr_output` | Yes | Ported; 2,500 random cases identical (the differential test caught two bugs in my first port) |
| Pad chunks shorter than 0.5 s with zeros | `qwen_asr` normalisation | Yes | **To do in the worker** (not in Appendix A) |
| Engine-specific: model load / unload (do not hold Whisper and Qwen together), `max_new_tokens=512`, greedy decoding, prompt with system context + audio pads + language prefix | `load_model`, qwen_asr | **No** | Appendix B (harness contract) |
| Needs other tracks: ffmpeg clean-up filter (`highpass=70, lowpass=7800, dynaudnorm`), faster-whisper's Silero `get_speech_timestamps` (threshold 0.5, `min_silence_duration_ms=300`, `speech_pad_ms=100`) | `engine.extract_audio`, `faster_whisper.vad` | n/a | `vad.ts` must expose those options and reproduce faster-whisper's merge / padding logic |

Not applicable to Qwen today and therefore not a parity gap: beam search, temperature fallback, Whisper hallucination thresholds, word timestamps, confidence underlines (the server adapter returns `null` for them by design; translate-to-English is rejected: "Qwen supports transcription here; select Whisper for English translation"). Extras the browser pipeline could add later, only with an explicit decision because the current adapter promises not to fabricate scores: per-token probabilities from the logits it already has, and word timestamps from `Qwen3-ForcedAligner-0.6B` (ONNX exports exist; 11 languages, **not Hindi**).

Defects found in the existing Python adapter while mapping languages (not caused by the browser move; fix in the port):
- `tl` (Tagalog) passes both validators in `schemas.py`, but `engine.LANGUAGES['tl']` = "Tagalog", which `qwen_asr.validate_language` rejects (its name is **Filipino**). Selecting Tagalog with Qwen fails at run time.
- `yue` (Cantonese) is in the Qwen adapter's 30-code set but absent from `engine.LANGUAGES`, and the global `language` validator only accepts `engine.LANGUAGES` keys, so Cantonese can never be selected; that entry is dead code. Qwen does support Cantonese (and auto-detects it).
- The browser table should map all 30 codes to Qwen names (`tl` -> Filipino, `yue` -> Cantonese); `prompt_config.json` only lists forced-language ids for 16 languages, so compute the ids of `language <Name>` + `<asr_text>` with the tokenizer.

**Verification.** `port/qwen-chunking.mjs` (Appendix A) vs a verbatim extraction of the Python functions from `qwen_engine.py` and `qwen_asr/inference/utils.py`, fed 16,000 random cases containing multilingual text, Turkish dotted I, German sharp s, Greek final sigma and ypogegrammeni, ligatures, combining marks, emoji and exotic whitespace (NEL, FS, FEFF, U+2028): `trim_overlap` 4,000, `repeated_phrase` 4,000, `chunks` 3,000, `detect_and_fix_repetitions` 2,500, `parse_asr_output` 2,500: **0 mismatches**. The assertions of the Python Qwen tests were re-implemented against the JS port (10 groups) and pass. Two non-obvious requirements surfaced: Python `casefold()` differs from `toLowerCase()` on 324 code points (a 4.6 KB generated table fixes it), and Python's whitespace set differs from JS `\s` (U+001C-1F, U+0085, U+FEFF).

---

## 5. Recommended design

```
frontend/src/app/engine/qwen/
  qwen.worker.ts        module worker: owns the ORT sessions; messages init | decode(chunk) | cancel | dispose
  qwen-pipeline.ts      mel (FFT) -> encoder -> prompt/embeddings -> prefill -> step loop -> raw text
  qwen-chunking.ts      Appendix A (+ 0.5 s pad); pure, unit-tested, runs on the main thread or in the worker
  qwen-languages.ts     30 codes -> Qwen names (tl -> Filipino, yue -> Cantonese); forced-prefix ids via the tokenizer
  qwen-manifest.ts      repo@commit, file list, sizes, sha256, variants (q4f16 | q4), licence notice
  qwen-capability.ts    device gate (below)
```

- **Runtime:** `onnxruntime-web/webgpu` (never the bare package entry, which is the wasm-only bundle and silently runs on CPU) pinned to the version Transformers.js uses; same wasm files as the Whisper engine. Run Silero VAD before decoding starts, or on a separate ORT instance: a second session on the WebGPU instance while a decode is in flight re-enters the Asyncify runtime and hangs [third-party, Sokuji]. The chunk plan is computed up front, as in Python, so this is naturally satisfied.
- **Models:** fused GQA decoder + fp16 encoder + int8 embeddings (+ tokenizer.json 11 MB) for `shader-f16` adapters; fp32 encoder + fused fp32 decoder otherwise. Pinned mirror in a repo we control; SHA-256 checked; Cache API + `navigator.storage.persist()`.
- **Contract to the app** (same as `backends.py`): phases `extracting | loading_model | transcribing`, `onSegment(seg, progress, info)`, `shouldCancel()`; segment dict exactly as in Appendix A. Per-token streaming inside a chunk is possible (better live text than the server); cancellation can be checked every decode step (about 0.1-0.2 s) and must dispose the GPU KV tensors.
- **One engine alive at a time:** terminate the Whisper worker before loading Qwen, as the server adapter unloads Whisper (`load_model`).
- **UI:** Qwen options force `task=transcribe`; hide or disable beam size, word timestamps and "translate" for Qwen; show model size (0.9 / 2.0 GB, not today's catalogue 1300 / 3500 MB), an ETA from a measured tokens-per-second, and a speed hint on integrated GPUs.
- **Capability gate** [inference; thresholds to be tuned]: not a phone; `navigator.gpu` and an adapter; `shader-f16` -> q4f16 else q4; `maxBufferSize >= 1 GiB`; storage estimate >= 2x model size; `deviceMemory >= 8` when reported (>= 16 for 1.7B). Unknown on Safari, Firefox and Android: treat as unavailable until tested.
- **Hindi on integrated GPUs is borderline** (RTF about 1-2). Offer it, but say so, and prefer Whisper large-v3-turbo / small there.

Fallback text:

| Situation | Message |
|---|---|
| No WebGPU / phone / too little memory | "Qwen3 ASR needs a desktop browser with WebGPU (Chrome or Edge) and about 4 GB of free memory. This device cannot run it. Whisper models work on every device." |
| Integrated GPU | "Qwen runs at about the speed of the recording on integrated graphics (Hindi is slower than English). A dedicated GPU or Apple Silicon is much faster." |
| First use | "Downloads 0.9 GB once and keeps it in this browser." |

---

## 6. Effort and plan

| Work | Days |
|---|---|
| Pinned mirror in an org repo: licence + NOTICE + change notice, manifest with SHA-256, CORS check | 1.5 |
| Optional: re-export both sizes in one pipeline (fused decoder, fp16 encoder, fp32 fallback) + token-exact check vs PyTorch on 5 clips | +1.5 |
| `qwen.worker.ts` + `qwen-pipeline.ts`: sessions, FFT mel, prompt and embeddings, fp16 handling, KV loop, argmax, parse, cancel / progress / dispose, shader warm-up | 4-5 |
| Tokenizer integration, 30-language table, context prompt, 0.5 s pad | 0.5 |
| Chunking port into the app + Vitest ports of the Python tests (code and tests exist, Appendix A) | 1 |
| Engine integration: interface, capability gate, download UI with progress, persistence, settings, re-transcribe, error states, copy | 2-3 |
| QA: Windows + macOS, Chrome + Edge, low memory, 1-hour file, cancel, repeated runs for memory growth | 3 |
| **Total** | **12-14 (14-16 with the re-export)** |
| Optional: batch 2-4 chunks per decode loop (expected 2-3x on dispatch-bound devices [inference]) | 3-5 |
| Optional: GPU-side argmax (skip the 300 KB logits read-back per token), FFT mel in the worker | 1 |
| Optional: evaluate the Hinglish fine-tune (mixed Devanagari + Latin output, then IndicXlit on the Devanagari part) | 2-3 |
| Optional: per-token probabilities / ForcedAligner timestamps (needs an explicit product decision) | 1-2 / 5+ |

Suggested order: (1) mirror + manifest, (2) worker on a fixed 25 s test page reusing this spike's contract, (3) wire `planChunks` / `transcribeChunks`, (4) gate + UI, (5) QA, (6) batching.

---

## 7. Risks and unknowns

- **Performance on integrated GPUs and busy laptops** is the main risk; Hindi may run slower than real time. Mitigations: fused decoder, batching, clear messaging, Whisper as the default.
- **Supply chain:** the exports are individuals' repos. Mirror, pin, hash.
- Two different third-party decoder recipes (jiangzhuo split, sorryhyun fused) gave slightly different Hindi spelling; settle on one pipeline (re-export) before shipping.
- fp16 output arrays: Chrome >= 135 returns a `Float16Array` for fp16 tensors. Treating it as `Uint16Array` bits cost me a debugging round (garbage tokens and an argmax that was several times slower). Read it through a bit-reinterpreting view.
- Not verified: Safari, Firefox, Android Chrome, Intel and NVIDIA GPUs, Apple GPUs (third-party only), thermal / battery behaviour, a 60-minute run (memory growth over hundreds of chunks), Cache API persistence of 2 GB, real network download, behaviour at 8 GB RAM, and the zero-length past-KV tensors of the fused decoder on non-D3D12 backends (a TOKIHISU note suggests seeding one position on some platforms).
- Open wllama issue #294 (pthread pool) if the GGUF route is ever used; pin 3.5.1 or patch.
- wasm heap: never ship the CPU path for the large variants.
- The `qwen_asr` package's behaviours that I did not port because the adapter never exercises them: 20-minute internal splitting (we use 25 s), forced-aligner timestamps, streaming (vLLM only).

---

## 8. Evidence index (commands and raw outputs)

Raw results (JSON, one per experiment) are in `notes/` of the scratchpad; key ones:

| Claim | Where |
|---|---|
| Transformers.js has no qwen3_asr | `tjs/node_modules/@huggingface/transformers/src/models/registry.js`; `grep -c` over `dist/*`; `data/gh/tjs_tree.json` |
| 718 / 66 / 8 repository counts | `data/hf/s1_qwen3-asr.json`, `s2_qwen3_asr.json`, `s3_qwen3asr.json` (HF API `?search=...&limit=1000`) |
| Hub files and sizes | `tools/hf_tree.py <repo>` (HF `tree/main?recursive=true&expand=true`) |
| SHA-256 match | five 0.6B files vs `lfs.oid` |
| WebGPU adapter, features, limits | `tools/webgpu_probe.mjs chrome headless` |
| Pipeline results | `notes/res_ab1.json` (quiet A/B), `res_full_gpu_run1.json` (44 runs), `res_calm06.json`, `res_17b_ab.json`, `res_q4_gpu.json`, `res_edge06.json`, `res_ctx.json` |
| CPU fallbacks | `res_wasm_t1.json`, `res_wasm_t8.json`, `res_wllama_cpu.json`, `res_wllama_gpu.json` |
| Machine load during runs | `notes/cpu_cfg_*.csv` (typeperf, 1 s), `mem_cfg_*.csv` |
| Port tests | `port/loop_test.mjs`, `port/diff_test.mjs`, `port/diff_test2.mjs`, `port/cases.json`, `port/cases2.json` |

Scratchpad root: `C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/qwen/` (`www/qwen/main.js` harness, `tools/run_bench.mjs` driver, `tools/bench.ps1` load-aware runner, `models/` downloads, `data/` untrusted downloads).

Sources: Qwen model cards and `QwenLM/Qwen3-ASR` (`qwen_asr/inference/utils.py`); `jiangzhuo9357/Qwen3-ASR-0.6B-ONNX` and `-1.7B-ONNX` cards; Sokuji `benchmark/qwen3-asr-webgpu` notes (spike, v2, 1.7B, fleet validation); `sorryhyun/qwen3-asr-onnx-gqa`; `andrewleech/qwen3-asr-onnx`; `litert-community/Qwen3-ASR-1.7B` card; developers.google.com/edge/litert-lm/js; llama.cpp PR #19441 / #23073; wllama 3.x guides and issue #294; `handy-computer/transcribe.cpp` docs; `k2-fsa/sherpa-onnx` tree; Hugging Face model API.

---

## Appendix A. Verified port of the engine-agnostic logic (JavaScript, drop-in for TypeScript)

Generate the table imported as `./casefold-extras.mjs` (324 entries) once, with the Python that runs the backend:

```python
import json, sys, unicodedata
cf = {cp: chr(cp).casefold() for cp in range(0x110000) if not 0xD800 <= cp <= 0xDFFF and chr(cp).casefold() != chr(cp)}
json.dump({str(k): v for k, v in cf.items()}, open("py_casefold.json", "w", encoding="utf-8"), ensure_ascii=False)
```
```js
// node: keep only code points where per-code-point toLowerCase() differs from Python casefold()
import fs from 'node:fs';
const py = JSON.parse(fs.readFileSync('py_casefold.json', 'utf8')); const extras = [];
for (let cp = 0; cp < 0x110000; cp++) { if (cp >= 0xD800 && cp <= 0xDFFF) continue; const ch = String.fromCodePoint(cp); const want = py[String(cp)] ?? ch; if (ch.toLowerCase() !== want) extras.push([cp, want]); }
fs.writeFileSync('casefold-extras.mjs', 'export const CASEFOLD_EXTRAS = new Map(' + JSON.stringify(extras) + ');\n');
```

```js
// Spike port (JavaScript, drop-in for TypeScript) of the engine-agnostic parts of backend/app/qwen_engine.py.
// Nothing here touches a model runtime: it plans chunks from VAD speech intervals, trims exact overlaps, flags repeated
// phrases and drives the decode loop through a caller supplied `decode(startSample, endSample)` function.
// Source of truth: backend/app/qwen_engine.py (token_key, trim_overlap, chunks, repeated_phrase, QwenEngine.transcribe loop).

export const SAMPLE_RATE = 16000;

import { CASEFOLD_EXTRAS } from './casefold-extras.mjs';
function casefold(s) {
  let out = '';
  for (const ch of s) out += CASEFOLD_EXTRAS.get(ch.codePointAt(0)) ?? ch.toLowerCase();
  return out;
}
// Python's str.isspace() set (used by re '\s', str.split() and str.lstrip()); JS '\s' differs on U+001C-1F, U+0085, U+FEFF.
const PY_WS = '\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028-\u2029\u202f\u205f\u3000';
const NON_WS_RUN = new RegExp('[^' + PY_WS + ']+', 'gu');
const WS_RUN = new RegExp('[' + PY_WS + ']+', 'u');
const LEADING_WS = new RegExp('^[' + PY_WS + ']+', 'u');
const LINE_BREAK = new RegExp('\\r\\n|[\\n\\r\\v\\f\\u001c\\u001d\\u001e\\u0085\\u2028\\u2029]', 'u'); // str.splitlines()
const KEEP = /^[\p{L}\p{N}\p{M}]$/u; // unicodedata.category(c)[0] in "LNM"

export function tokenKey(token) {
  let out = '';
  for (const ch of casefold(token.normalize('NFC'))) if (KEEP.test(ch)) out += ch;
  return out;
}

/** Remove only a substantial exact suffix/prefix match at an audio overlap (>= 3 words), ignoring case and punctuation. */
export function trimOverlap(previous, current, maxWords = 24) {
  const left = [...previous.matchAll(NON_WS_RUN)].map((m) => tokenKey(m[0]));
  const right = [...current.matchAll(NON_WS_RUN)];
  const keys = right.map((m) => tokenKey(m[0]));
  for (let size = Math.min(maxWords, left.length, keys.length); size > 2; size--) {
    let ok = true;
    for (let i = 0; i < size; i++) if (!keys[i]) { ok = false; break; }
    if (!ok) continue;
    for (let i = 0; i < size; i++) if (left[left.length - size + i] !== keys[i]) { ok = false; break; }
    if (ok) {
      const cut = right[size - 1].index + right[size - 1][0].length;
      return [current.slice(cut).replace(LEADING_WS, ''), size];
    }
  }
  return [current, 0];
}

/** A review signal, never an instruction to delete potentially spoken words. */
export function repeatedPhrase(text) {
  const words = text.split(WS_RUN).map(tokenKey).filter(Boolean);
  const maxWidth = Math.min(12, Math.floor(words.length / 3));
  for (let width = 3; width <= maxWidth; width++) {
    for (let start = 0; start <= words.length - 3 * width; start++) {
      let same = true;
      for (let i = 0; i < width && same; i++) {
        if (words[start + i] !== words[start + width + i] || words[start + i] !== words[start + 2 * width + i]) same = false;
      }
      if (same) return true;
    }
  }
  return false;
}

/**
 * Split at natural pauses, skip long silence, overlap only forced cuts. Sample offsets always refer to the original audio.
 * @param {number} totalSamples length of the decoded audio
 * @param {{start:number,end:number}[]|null} speech VAD intervals in samples (null => VAD disabled, whole file is speech)
 */
export function planChunks(totalSamples, speech, seconds = 25) {
  const step = Math.trunc(seconds * SAMPLE_RATE);
  if (step <= 0) throw new RangeError('Chunk duration must be positive.');
  const iv = speech ?? [{ start: 0, end: totalSamples }];
  if (!iv.length) return [];
  const groups = []; let group = [];
  for (const interval of iv) {
    if (group.length && interval.start - group[group.length - 1].end >= 2 * SAMPLE_RATE) { groups.push(group); group = []; }
    group.push(interval);
  }
  groups.push(group);
  const plan = [];
  for (const g of groups) {
    let start = g[0].start; const stop = g[g.length - 1].end;
    const breaks = [];
    for (let i = 0; i + 1 < g.length; i++) if (g[i + 1].start > g[i].end) breaks.push(Math.floor((g[i].end + g[i + 1].start) / 2));
    let overlap = false;
    while (start < stop) {
      let end = Math.min(stop, start + step);
      const nearby = breaks.filter((p) => start + step * 0.6 <= p && p <= end);
      let forced = end < stop;
      if (forced && nearby.length) { end = nearby[nearby.length - 1]; forced = false; }
      plan.push({ start, end, overlap });
      start = end; overlap = forced;
    }
  }
  return plan;
}

/**
 * The per-chunk loop of QwenEngine.transcribe. `decode(start, end)` runs one model pass over audio[start:end] and returns
 * { text, language } (language already mapped to a code or null). `convert` is the optional Hinglish step.
 */
export async function transcribeChunks({ totalSamples, plan, decode, language = null, convert = null, onSegment = null, shouldCancel = () => false, hinglish = false }) {
  const out = []; let lang = language; let previousText = '';
  const check = () => { if (shouldCancel()) throw Object.assign(new Error('cancelled'), { name: 'Cancelled' }); };
  for (const chunk of plan) {
    check();
    const { start, end } = chunk;
    const overlapSamples = Math.min(2 * SAMPLE_RATE, Math.floor((end - start) / 4));
    const audioStart = previousText && chunk.overlap ? Math.max(0, start - overlapSamples) : start;
    let response = await decode(audioStart, end); check();
    let rawText = response.text.trim(); let text = rawText; let removed = 0;
    if (audioStart < start) [text, removed] = trimOverlap(previousText, rawText);
    let boundary = 'pause'; const reasons = []; let overlapText = null;
    if (audioStart < start) {
      if (removed) boundary = 'exact_overlap';
      else {
        overlapText = rawText; response = await decode(start, end); check();
        rawText = text = response.text.trim(); boundary = 'audio_retry'; reasons.push('boundary_retry');
      }
    }
    const detected = response.language ?? null;
    lang = lang ?? detected;
    if (!text) { previousText = ''; continue; }
    previousText = rawText;
    if (repeatedPhrase(text)) reasons.push('repeated_phrase');
    let seg = {
      id: out.length, start: Math.round(start / SAMPLE_RATE * 100) / 100, end: Math.round(end / SAMPLE_RATE * 100) / 100,
      text, original_text: text, recognition_text: rawText, overlap_words_removed: removed, boundary_resolution: boundary,
      review_reasons: reasons, words: null, confidence: null, timing: 'chunk', edited: false,
    };
    if (overlapText !== null) seg.overlap_recognition_text = overlapText;
    if (hinglish && convert && (detected || lang) && ['hi', 'en'].includes(detected || lang)) seg = await convert(seg);
    out.push(seg);
    if (onSegment) onSegment(seg, end / totalSamples, { language: lang, duration: totalSamples / SAMPLE_RATE });
  }
  check();
  return { language: lang, language_probability: null, duration: Math.round(totalSamples / SAMPLE_RATE * 100) / 100, segments: out };
}

// ---- Port of qwen_asr.inference.utils (Apache-2.0, QwenLM/Qwen3-ASR): the runaway-repetition guard and output parser ----
// The Python adapter inherits these from the qwen_asr package, so a browser pipeline has to carry them itself.
export function detectAndFixRepetitions(text, threshold = 20) {
  const fixCharRepeats = (cp, thresh) => {
    const res = []; let i = 0; const n = cp.length;
    while (i < n) {
      let count = 1;
      while (i + count < n && cp[i + count] === cp[i]) count++;
      if (count > thresh) { res.push(cp[i]); i += count; } else { for (let j = 0; j < count; j++) res.push(cp[i + j]); i += count; }
    }
    return res;
  };
  const same = (cp, a, b, k) => { for (let j = 0; j < k; j++) if (cp[a + j] !== cp[b + j]) return false; return true; };
  const fixPatternRepeats = (cp, thresh, maxLen = 20) => {
    const n = cp.length; const minRepeat = thresh * 2;
    if (n < minRepeat) return cp;
    let i = 0; const result = []; let found = false;
    while (i <= n - minRepeat) {
      found = false;
      for (let k = 1; k <= maxLen; k++) {
        if (i + k * thresh > n) break;
        let valid = true;
        for (let rep = 1; rep < thresh; rep++) {
          const startIdx = i + rep * k;
          // Python compares s[startIdx:startIdx+k] with the pattern; a short tail slice never equals it
          if (startIdx + k > n || !same(cp, startIdx, i, k)) { valid = false; break; }
        }
        if (valid) {
          let endIndex = i + thresh * k;
          while (endIndex + k <= n && same(cp, endIndex, i, k)) endIndex += k;
          for (let j = 0; j < k; j++) result.push(cp[i + j]);
          for (const c of fixPatternRepeats(cp.slice(endIndex), thresh, maxLen)) result.push(c);
          i = n; found = true; break;
        }
      }
      if (found) break;
      result.push(cp[i]); i++;
    }
    if (!found) for (let j = i; j < n; j++) result.push(cp[j]);
    return result;
  };
  return fixPatternRepeats(fixCharRepeats(Array.from(text), threshold), threshold).join('');
}

/** parse_asr_output: raw decoder text -> { language, text }. Language names stay as the model wrote them (e.g. "Hindi"). */
export function parseAsrOutput(raw, userLanguage = null) {
  const trim = (x) => x.replace(new RegExp('^[' + PY_WS + ']+|[' + PY_WS + ']+$', 'gu'), '');
  if (raw == null) return { language: '', text: '' };
  let s = trim(String(raw));
  if (!s) return { language: '', text: '' };
  s = detectAndFixRepetitions(s);
  if (userLanguage) return { language: userLanguage, text: s };
  const tag = '<asr_text>';
  if (!s.includes(tag)) return { language: '', text: trim(s) };
  const at = s.indexOf(tag); const meta = s.slice(0, at); const textPart = s.slice(at + tag.length);
  if (meta.toLowerCase().includes('language none')) return { language: '', text: trim(textPart) };
  let lang = '';
  for (const line0 of meta.split(LINE_BREAK)) {
    const line = trim(line0); if (!line) continue;
    if (line.toLowerCase().startsWith('language ')) { const val = trim(line.slice('language '.length)); if (val) lang = val.slice(0, 1).toUpperCase() + val.slice(1).toLowerCase(); break; }
  }
  return { language: lang, text: trim(textPart) };
}
```

Status: the listing above was extracted verbatim from this file (scratchpad `port_doc/`), together with the two generator snippets, and re-run: the 10 re-implemented Python test groups pass and the 16,000 random cases give 0 mismatches. It is plain ES2022 with no dependencies; converting it to TypeScript only needs types on the parameters.

---

## Appendix B. Browser pipeline contract and gotchas (from the working harness)

Graphs (layout v2, `prompt_config.json` carries every constant): `encoder`: `mel [1,128,T] f32 -> audio_features [1,A,H] f32`, `A = conv3(T mod 100) + 13*floor(T/100)` with `conv(t)=floor((t+1)/2)` (assert it equals the encoder output length). Prompt ids = `[151644,9125,198, <context ids>, 151645,198,151644,882,198,151669] + A*[151676] + [151670,151645,198,151644,77091,198] + <forced "language X<asr_text>" ids, optional>`. Embedding of id = `int8[id,:] * scale[id]` (fp16 for q4f16); overwrite the A pad rows with `audio_features`. Split decoders: `decoder_init(input_embeds[1,S,H], position_ids[1,S] i64) -> logits[1,1,V], present_keys/values[28,1,8,S,128]`; `decoder_step(input_embeds[1,1,H], position_ids[1,1], past_keys, past_values) -> logits, present_*`. Fused decoder: `inputs_embeds[1,S,H], attention_mask[1,total] i64, past_key_values.{0..27}.{key,value}[1,8,past,128]` (empty at prefill) `-> logits[1,1,V], present.{i}.{key,value}`. Greedy until id 151643 or 151645; `max_new_tokens` 512; output `language <Name><asr_text><text>`.

```js
// sessions: pass the shared weights once per session; keep KV on the GPU
const pref = Object.fromEntries([...Array(28).keys()].flatMap(i => [[`present.${i}.key`,'gpu-buffer'],[`present.${i}.value`,'gpu-buffer']]));
const dec = await ort.InferenceSession.create(graphBytes, { executionProviders:['webgpu'], graphOptimizationLevel:'all',
  externalData:[{ path:'decoder-0.6b-fp16.onnx.data', data: weightsU8 }], preferredOutputLocation: pref });
// step loop (fused): dispose the superseded KV tensors every step; logits come back as Float16Array on Chrome >= 135
let out = await dec.run({ inputs_embeds, attention_mask, ...emptyPast });   // helpers (embed, ones, pastFrom, ...) as in the harness
let n = 0;
for (;;) {
  const bits = out.logits.data instanceof Uint16Array ? out.logits.data : new Uint16Array(out.logits.data.buffer, out.logits.data.byteOffset, out.logits.data.length);
  const tok = argmaxHalf(bits);                    // 151,936 entries; use a 65,536-entry half->float table
  if (eos.has(tok) || n++ >= maxNew || cancelled()) break;
  const next = await dec.run({ inputs_embeds: embed(tok), attention_mask: ones(total+1), ...pastFrom(out) });
  for (const t of pastTensors(out)) t.dispose();   // 56 tensors
  out = next;
}
```

Gotchas I hit or that the sources document: bare `onnxruntime-web` import is the wasm-only bundle; no second session on the WebGPU ORT instance during a decode (Asyncify re-entrancy); `Float16Array` outputs on Chrome >= 135; log-mel needs the max-8 clamp and the dropped last frame (matches `WhisperFeatureExtractor`); a naive DFT costs 0.06-0.1 RTF; q4f16 needs the adapter feature `shader-f16` (an NVIDIA Vulkan adapter on Linux lacks it); block-64 int4 collapsed on one zh clip (use block 32); teacher-forcing `language X<asr_text>` removes a first-token failure mode when the language is known.
