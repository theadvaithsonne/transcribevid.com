# In-browser pivot - progress log

A living record of the move from "our server transcribes" to "the visitor's browser transcribes"
(plan: `TranscribeVid-new-approach-plan.txt`, kept next to the repository). It is updated at every
milestone, and every milestone ends in a commit on `feature/in-browser`.

## Ground rules

1. **Nothing that exists today is compromised.** All Whisper sizes, Qwen3-ASR, Hinglish / IndicXlit,
   word timing and confidence, VAD, audio clean-up, beam search and the hallucination guards, the
   vocabulary prompt, translate, re-transcribe, cancel, the queue, the microphone, the player, editing,
   every export format and the link downloader must either keep working in the browser engine or have a
   documented, tested equivalent. `PARITY.md` lists every feature and how it is kept; a feature may only
   be marked "lost" with evidence and the owner's attention.
2. Commit at every milestone. Never push (the owner pushes).
3. The test suites stay green at every commit.
4. Free-tier services only. AdSense stays inert until the owner's ad unit (slot) ids are configured in
   `frontend/src/app/core/ads.config.ts` (the publisher id `ca-pub-5152758693265080` is in; it is also the
   verification meta tag in `index.html` and the line in `public/ads.txt`). On desktop the
   right 20% of the viewport is reserved for ads; on tablet and phone the units are in-flow. Fully
   responsive everywhere.

## Base

`feature/in-browser` starts from `swapnil` @ `3d8d3dc`, so it contains the Hinglish / IndicXlit, Qwen,
cancellation and link-download work (Swapnil Deshmukh's three commits) as well as everything on `main`.
`swapnil` itself is untouched.

Baseline measured on this machine before any change:

| Suite | Result |
| --- | --- |
| Frontend (`ng test`, vitest) | 33 files, 1083 tests, all passing |
| Backend (`pytest`) | 872 passed, 17 skipped (needs `pip install -r requirements.txt` so that `yt-dlp` exists; without it 5 download tests answer 503) |

## Architecture (decided, refined by the spike)

* **Two transports behind the existing `ApiService` facade.** `server` is today's HTTP + SSE code,
  unchanged, so all existing tests keep their meaning and the self-hosted / CLI / Docker path keeps
  working. `browser` is the new in-browser engine and is what the static production build uses. The
  components keep talking to `ApiService` / `JobsStore`.
* **Engine in a Web Worker**: decode (WebCodecs, fallbacks) -> clean-up filters -> VAD -> 30 s windows ->
  Whisper through Transformers.js v4 -> post-processing guards -> Hinglish conversion. The behaviour is
  specified by the Python code (`docs/in-browser/parity/engine.md`) and checked against its golden files.
* **No cross-origin isolation requirement** (COOP / COEP blocks ads). Multi-threaded WASM is used only
  when a page happens to be isolated; WebGPU is the fast path.
* Things that cannot run on a static host stay available as **optional server features** (link
  downloads need a downloader service URL; Qwen only if the spike finds no browser route), never silently
  removed.

## Milestones (lean plan, 2026-10-26: owner asked to spend the usage limit wisely)

| # | What | Status | Commit |
| --- | --- | --- | --- |
| M0 | Branch on `swapnil`, dependencies, baseline tests | done | - |
| M1 | Spike: fixtures, probes, inventory, research (Whisper, audio, VAD, IndicXlit, Qwen, hosting, ads) | done | `432d10d` .. `5da4cd9` |
| M2 | `ARCHITECTURE.md`, `PARITY.md` | done | `6be67da` |
| M3 | Engine modules (audio, VAD, Whisper + models, post + exports, device + session) + IndicXlit fixes | done (not yet tested) | `0121728` .. this commit |
| M4 | Integration, one agent: job runner, worker, browser transport, upload / job pages on the engine | running | |
| M5 | Site, one agent: 20% ad rail + responsive layout, inert ads, privacy / FAQ / terms text, Cloudflare `_headers` / `_redirects` / post-build, counter Worker | todo | |
| M6 | Final check, one agent: full test suites, one real-Chrome end-to-end run, accuracy on the fixtures, fix what fails | todo | |

Rules for spending: no more research or multi-agent reviews; one agent per milestone; reuse the spike harnesses.
**Implement everything first (M3-M5b), test everything once (M6)** (owner, 2026-10-26): while building, agents
write the specs but only type-check; M6 runs all suites, the browser checks and the parity runs, then fixes.
Commits during M3-M5b are marked "not yet tested" in their message.

Nothing is deferred (owner, 2026-10-26: "don't compromise features"). The three heavy items get their own milestone:

| M5b | Full parity, one agent: Qwen3-ASR 0.6B / 1.7B in the browser (desktop WebGPU; spike harness + ported adapter reused), word timing and confidence for large-v3 / distil-large-v3 (their text aligned by the turbo `_timestamped` model, which shares the tokenizer; word probability from the transcribing model's own token scores), ffmpeg.wasm as a lazy, opt-in fallback for AVI / WMA / AMR / FLV etc. (loaded from jsDelivr, GPL notice and source link on the licences page) | todo | |

Only things this machine cannot do stay open: measurements on Safari, Firefox and real phones.

## Spike result (plan step 1): GO

Measured in headless Chrome 155 on this laptop (Ryzen 7 7730U, Radeon iGPU, 15 GB); full detail in `spike/`.

| Question | Answer |
| --- | --- |
| Do all seven Whisper sizes run in a browser? | Yes. tiny / base faster than real time on WASM (1 thread) and WebGPU; small on WebGPU (RTF 0.7-0.8); medium, large-v3-turbo, large-v3 run on the iGPU at 1.4-1.9x slower than real time with the best accuracy (WER 1.1%); needs 5-8 GB of memory, so they are gated by device, not offered blindly. `spike/model-matrix.md` |
| Accuracy vs the server | Within 0.6 WER points for base / small; word timing within 0.02 s median; per-word confidence within 0.04. `spike/asr.md` |
| What Transformers.js does not give | Beam search, token scores, language detection, prompt, correct word timing, cancel: all re-implemented in the reference worker (960 lines, built and smoke-tested). |
| Audio in, any format | WebCodecs in a worker decodes everything the server reads today, streams files over 2 GB, one hour in 3-18 s; the clean-up filters and resampler match ffmpeg's output sample for sample. `spike/audio.md` |
| Silence / music guard | Silero v6 (the server's own file) driven by onnxruntime-web; segments identical to the Python engine. Mandatory: without VAD 11 of 22 noise runs still produce text. `spike/vad.md` |
| Hinglish (trained IndicXlit) | Ported bit-for-bit (int8 weights copied from the server model): identical output on 24,959 + 3,332 fresh words up to 256 symbols; verifier found 6 defects (long inputs, beam > 4, cancel, memory, errors), fixes in progress. `spike/indicxlit*.md` |
| Qwen3-ASR | Runs on desktop WebGPU (Chrome / Edge) from published ONNX, not on CPU / phones; stays in the picker, disabled with a reason where it cannot run. `spike/qwen.md` |
| Hosting | Cloudflare Pages free tier is enough; flatten `dir/index.html`, rewrite `/jobs/*`, ship `404.html`, serve the 25+ MiB ORT files from a pinned CDN or use the 16 MiB JSPI build, count videos in D1. `spike/hosting.md` |
| Ads | Manual units only, Auto ads off, never on the transcribing / privacy / terms / logs pages; ads cannot load on a cross-origin-isolated document. `spike/adsense.md` |

Known gaps that are not solved by the spike: large-v3 and distil-large-v3 have no published export with word timing (either we export them ourselves or those two sizes lose word timing, to be stated in the UI); GPU-process memory grows across windows on WebGPU (the engine recycles its worker every N windows until understood); nothing is measured on phones, Safari or Firefox.

## Decisions log

* 2026-10-25: the owner asked not to compromise current features and models -> base moved from `main` to
  `swapnil`, dual-transport architecture, parity matrix, IndicXlit conversion attempted instead of settling
  for the rule-based fallback.
* 2026-10-25: the plan's "remove the server code" step is postponed: the server stays as the optional
  transport until the owner decides, so the self-hosted and CLI paths and the accuracy tooling keep working.
* 2026-10-25 (evening): the owner added `transcribevid.com` to AdSense (status "Requires review") and gave the
  publisher id. `ads.txt` and the `google-adsense-account` meta tag are in the build; verification can only
  succeed once the new site is deployed to the domain (today it is a parked page that redirects to `/lander`).
  Per `spike/adsense.md`: manual ad units only, Auto ads off, no ad script until the slot ids exist.
* 2026-10-25 (evening): **the owner removed the YouTube / Instagram link downloader** after reading that
  AdSense bans pages that enable downloading streaming video against the provider's terms
  (`spike/adsense.md` section 3). This is the one deliberate exception to ground rule 1. Done by reverting the
  commit that added it (`3d8d3dc`); the parity matrix marks the feature "removed (owner decision)" rather than lost.
* 2026-10-25 (night), after the spike: **no cross-origin isolation anywhere** in v1. Ads cannot load on an isolated
  document and WebGPU (the fast path) does not need isolation; single-thread WASM is the fallback. A separate isolated
  transcriber document can be added later if phone / CPU speed demands it.
* 2026-10-26: ffmpeg.wasm **is** shipped (reverses the earlier note): lazy, opt-in, from jsDelivr, with its GPL notice,
  because the owner keeps every feature, and the server reads AVI / WMA / AMR today.
* 2026-10-25 (night): engine dependencies pinned exactly: `@huggingface/transformers` 4.3.1, `mediabunny` 1.62.1 and
  the `onnxruntime-web` build transformers.js itself pins (one ORT copy serves Whisper, Silero VAD and Qwen).
