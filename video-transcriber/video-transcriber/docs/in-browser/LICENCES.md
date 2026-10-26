# Licences of what the browser downloads at run time

The static site bundles only the app's own code and its npm dependencies (Angular, Transformers.js, onnxruntime-web,
mediabunny: MIT / Apache-2.0 / MPL-2.0). The files below are **not** in the bundle: the visitor's browser fetches them
from their pinned URLs when a feature needs them. The page text for them is the constant `THIRD_PARTY_NOTICES` in
`frontend/src/app/engine/models/licences.ts` (one entry per item: name, SPDX licence, what is downloaded and when,
source URL, corresponding-source link, the notice sentence, licence URL). The legal / licences page should link or
render that constant; this document is the reasoning behind it. Nothing here is legal advice.

## FFmpeg (ffmpeg.wasm core), GPL-2.0-or-later

* **What:** `@ffmpeg/core` 0.12.10, single-thread build (`ffmpeg-core.js` 111,804 bytes, SHA-256
  `67a48f11645f85439f3fde4f2119042c16b374b910206b7a7a24f342e28dcae3`; `ffmpeg-core.wasm` 32,232,419 bytes, SHA-256
  `9f57947a5bd530d8f00c5b3f2cb2a3492faa7e5d823315342d6a8656d0a6b7b7`; about 9.3 MB on the wire, jsDelivr serves it
  brotli-compressed), from `https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm/`.
* **When:** only for a file WebCodecs cannot open (AVI, WMA / WMV, FLV, MPG, AMR, AIFF / AU / CAF, ALAC, AC-3 / E-AC-3 /
  DTS ...), and only after the visitor answered yes to "This file needs a 9 MB converter that runs in your browser.
  Load it?" (asked once; a yes is remembered in this browser, "Delete my data now" forgets it). The bytes are checked
  against the hashes above before they are run (`engine/audio/ffmpeg.ts`).
* **Why GPL applies:** the 0.12.x core is built with `--enable-gpl` (libx264 / libx265 among others), so the binary is
  GPL-2.0-or-later. We distribute it in the GPL sense only by pointing the visitor's browser at the unmodified
  upstream package; we still treat it as distributing and follow the conditions:
  * the notice and the licence text link are shown (`FFMPEG_NOTICE`);
  * the complete corresponding source is offered: the ffmpeg.wasm repository at tag `v0.12.10`
    (`https://github.com/ffmpegwasm/ffmpeg.wasm/tree/v0.12.10`), whose build scripts fetch and pin the FFmpeg and
    library sources the core is built from, plus a written offer to provide a copy on request;
  * it is unmodified and runs as a separate program (its own WebAssembly module, driven through its command line),
    not linked into the app's code, so the app's own licence is not affected.
* The JavaScript wrapper `@ffmpeg/ffmpeg` (MIT) is **not** downloaded: the engine drives the core directly inside its
  own worker with the same calls the wrapper's worker makes (exec / reset / FS.mount with WORKERFS), because the
  wrapper's class worker cannot be started from a cross-origin URL. Its protocol (0.12.15) is cited in the code.
* Alternatives if the owner ever wants to avoid GPL: an LGPL-only audio build of FFmpeg (without x264 / x265; would
  also be smaller, not built or measured), or no converter (the "convert it to MP3, M4A or WAV first" message).
* **Hosting note for M5 / Cloudflare:** the core is loaded as a `blob:` module in a worker and the wasm from jsDelivr.
  If a Content-Security-Policy is ever added, it needs `script-src` with `blob:` and `https://cdn.jsdelivr.net`,
  `worker-src 'self' blob:` and `connect-src https://cdn.jsdelivr.net https://huggingface.co https://*.hf.co`.

## Qwen3-ASR 0.6B / 1.7B (ONNX), Apache-2.0

* **What:** ONNX conversions of `Qwen/Qwen3-ASR-0.6B` and `Qwen/Qwen3-ASR-1.7B` (Apache-2.0, the Qwen team, Alibaba
  Cloud): the layout-v2 export by jiangzhuo9357 (fp16 audio encoder, int8 embedding table, mel filters, tokenizer,
  prompt config; Apache-2.0) and the fused GroupQueryAttention decoders by sorryhyun (Apache-2.0). Pinned revisions,
  sizes and SHA-256 of every file: `frontend/src/app/engine/models/qwen-catalog.ts` (0.6B 896.5 MB, 1.7B 1947.6 MB).
* **When:** when the visitor picks a Qwen3 ASR model on a desktop browser with WebGPU; kept in the browser's Cache API
  ("transformers-cache") until deleted.
* **Conditions (Apache-2.0 section 4):** attribution and the licence link (`QWEN_NOTICE`); the files are unmodified
  (no change notice needed; if they are ever mirrored or re-exported, add a NOTICE and a change notice there).
* The adapter logic ported from the `qwen_asr` package (`detect_and_fix_repetitions`, `parse_asr_output`,
  `engine/qwen/qwen-text.ts`) is Apache-2.0 code of QwenLM/Qwen3-ASR; the file header says so. No code was taken
  from the AGPL-3.0 Sokuji project.

## Already covered elsewhere

* Whisper models (MIT, OpenAI) and their ONNX conversions (onnx-community, distil-whisper: MIT / Apache-2.0), including
  the large-v3-turbo `_timestamped` model now also used as the word-timing aligner of large-v3 / distil-large-v3.
* Silero VAD v6 (MIT): `frontend/public/models/vad/LICENSE` and `provenance.json`.
* IndicXlit (MIT): see the Hinglish track's notes.
* onnxruntime-web runtime files from jsDelivr (MIT).
