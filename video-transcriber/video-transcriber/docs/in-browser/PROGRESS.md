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

## Milestones

| # | What | Status | Commit |
| --- | --- | --- | --- |
| M0 | Branch on `swapnil`, dependencies, baseline tests | done | - |
| M1 | Spike (plan step 1): fixtures, Whisper / audio / VAD probes in real Chrome, feature inventory, Qwen / Cloudflare / AdSense research | running | |
| M1b | IndicXlit ported to the browser, parity measured | running | |
| M2 | Architecture review + `PARITY.md` signed off | todo | |
| M3 | Engine core with unit + real-browser tests | todo | |
| M4 | Browser transport + UI integration (upload, job, shell) | todo | |
| M5 | Parity work: Hinglish, Qwen decision, PDF, logs | todo | |
| M6 | 20% ad rail, responsive layout, AdSense (inert), consent, legal text | todo | |
| M7 | Cloudflare Pages config, counter Worker, docs, scripts | todo | |
| M8 | Accuracy check, cross-browser run, adversarial review, parity audit | todo | |

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
