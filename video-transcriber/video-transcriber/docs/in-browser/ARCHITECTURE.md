# In-browser engine: architecture (milestone M2)

What the browser edition of TranscribeVid is made of, how its parts talk, and which decisions are settled. Everything
here follows from the measured spike (`spike/*.md`), the feature matrix (`PARITY.md`) and the owner's rules
(`PROGRESS.md`). Implementers work from this file plus the reference code that the spike left behind.

## 1. Shape of the system

```
                       visitor's browser (one tab)
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │  Angular app (unchanged pages)                                               │
 │    components ──► ApiService (facade, same methods as today)                 │
 │                      ├── ServerTransport   HTTP + SSE to the self-hosted API │
 │                      └── BrowserTransport  ◄──► JobRunner (queue, phases)    │
 │                                                   │  IndexedDB session store │
 │                                                   ▼                          │
 │  engine worker (one per job pipeline)          hinglish worker (lazy)        │
 │   decode (WebCodecs) ► clean-up ► VAD ► windows ► Whisper ► guards ► words   │
 │   model files: Cache API            ORT runtime: pinned CDN                  │
 └──────────────────────────────────────────────────────────────────────────────┘
          ▲ static files (Cloudflare Pages)            ▲ counter (Worker + D1)
```

* **Nothing is uploaded.** The file is read in the visitor's tab; model and runtime files are downloaded to the
  visitor's browser once and cached.
* **Two transports behind one facade.** The components keep calling `ApiService` / `JobsStore` exactly as today.
  The static site is built with `BrowserTransport`; the self-hosted edition (`backend/`, Docker, CLI) keeps
  `ServerTransport`, which is today's code unchanged. The existing specs keep their meaning.
* **No cross-origin isolation anywhere** (decision in `PROGRESS.md`): ads cannot load on an isolated document and
  the fast path (WebGPU) does not need it. WASM runs single-threaded as the fallback.
* **One ORT copy.** Whisper (Transformers.js), Silero VAD and Qwen3-ASR all run on the `onnxruntime-web` build that
  `@huggingface/transformers` 4.3.1 pins.

## 2. Module layout (`frontend/src/app/engine/`)

Pure TypeScript, no Angular imports below `engine/`. Every module has a `*.spec.ts` with golden fixtures; the
reference code named in the right column is the starting point (it is spike code: port it, keep its tests, give it
the repo's style).

| Folder | Responsibility | Reference code (scratchpad) | Spec |
|---|---|---|---|
| `engine/audio/` | `probeMedia`, `decodeMedia(file, {signal, onProgress})` -> Int16 16 kHz mono + scale, resampler, clean-up chain (highpass 70 / lowpass 7800 / dynaudnorm), down-mix, error taxonomy with user messages | `audio/reference/src/{decode,dsp}` + its 18 unit tests and 153 browser checks | `spike/audio.md` section 13 |
| `engine/vad/` | Silero v6 wrapper (`['wasm']` provider only), `StreamingVad.push/flush`, faster-whisper segmenter port, `planWindows` (Whisper 30 s packed, Qwen 25 s contiguous), energy fallback | `vad/reference/` + vitest specs | `spike/vad.md` section 2 |
| `engine/asr/` | `WhisperEngine`: `load`, `detectLanguage`, `transcribeWindow`, `alignWords`, fallback ladder, `cancel`, `dispose`; model registry from `spike/model-catalog.json` | `asr/reference/src/{engine,dsp,worker}.ts` (960 lines, tsc clean) | `spike/asr.md` "reference worker API" |
| `engine/qwen/` (M5) | `QwenEngine` with the same `transcribeWindow` contract; chunk planner, overlap trim, retries, `review_reasons` (ported, differential-tested) | `qwen/` harness | `spike/qwen.md` section 4 |
| `engine/hinglish/` (exists) | IndicXlit int8 runtime + rule layer, lazy worker, word cache | in repo | `spike/indicxlit*.md` |
| `engine/post/` | Hallucination guard, repetition-loop breaker, segment merge / split, confidence math, language-uncertainty review rules, stats + keywords, text normalisation | port from `backend/app/engine.py`, `formats.py` (`parity/engine.md` EN-030..046, EN-070..080) | golden JSON from the Python functions |
| `engine/export/` | SRT / VTT (2-line re-flow with word timing, line length), TXT, plain, Markdown, JSON; file naming | port from `backend/app/formats.py` | byte-identical to Python on the fixtures |
| `engine/device/` | Capability probe (WebGPU adapter + `shader-f16`, `deviceMemory`, `hardwareConcurrency`, `storage.estimate`, platform), the model gating table (section 5), wake lock | - | table-driven spec |
| `engine/models/` | Model manager: catalog, download with per-file progress, Cache API, `isCached`, delete, size text, quota check | `asr/driver/hfcache.mjs` for the test double | `spike/asr.md` Q8/Q9 |
| `engine/jobs/` | `JobRunner`: the queue (one job at a time, like the server scheduler), phases, progress + ETA (`jobs.py` rules), cancel, re-run, apply-style-only, edits, title; `SessionStore` (IndexedDB) | `backend/app/jobs.py` `_process` | `parity/engine.md` EN-070.. |
| `engine/worker/` | `transcribe.worker.ts`: the pipeline host (section 3) and its message protocol; `WorkerClient` with hard-cancel (terminate + reload) | `asr/reference/src/worker.ts`, `main.ts` | protocol spec with a fake worker |

`core/transport/`: `Transport` interface (the method list of today's `ApiService`), `ServerTransport` (today's body,
moved), `BrowserTransport` (adapts `JobRunner` + `SessionStore` to the same Observables), `TRANSPORT` token chosen by
the build configuration (section 7). `ApiService` becomes a thin facade.

## 3. The job pipeline (inside the engine worker)

```
decodeMedia ──chunks──► clean-up (source rate) ──► resample 16 kHz ──► Int16 PCM (+scale)   phase 'extracting'
      │                                                              │
      │                                       StreamingVad.push ─────┘ ──► speech segments ──► planWindows
      ▼                                                                                            │
 model manager: ensure model files (Cache API) ──► WhisperEngine.load          phase 'loading_model'│
                                                                                                   ▼
 for each window (seek loop, restart at start + consumedSeconds):            phase 'transcribing', progress = consumed / total speech
     detectLanguage (first window, unless the user chose one)
     transcribeWindow(float32(window), {beamSize, temperatures, prompt, task, wordTimestamps})  ──► partial text events
     post: offset timestamps back (SpeechTimestampsMap), hallucination guard, loop breaker, confidence
     emit segments (same shape as the server's SSE 'segments' event)
 finally: stats, keywords, language, duration ──► job 'done'
 Hinglish (default output_script): segments ──► hinglish worker (convertSegment, IndicXlit beam 4, word cache) ──► text + original_text
```

Rules that the spike proved matter:
* VAD is mandatory before Whisper; silence and music are never sent (`spike/asr.md` Q11). The "VAD off" option
  plans plain 30 s windows (`vad.md` 6.4) and keeps the guards.
* Windows restart at `consumedSeconds`, never fixed 30 s steps (base lost whole sentences otherwise,
  `spike/model-matrix.md`).
* Beam 5 is the server's default and stays selectable; the engine's own default is greedy with the fallback ladder,
  because beam search costs 4-6x and gained nothing on the fixtures (`asr.md` Q6). The UI shows the real setting.
* Cancel is cooperative at every decoder step (20-47 ms); the encoder pass and a stuck worker get the hard cancel
  (terminate + reload from cache, 1.6-3.4 s).
* The worker is recycled every 40 windows on WebGPU until the GPU-process growth is understood
  (`model-matrix.md` risks).
* Memory: the PCM result is 115 MB per hour; on devices with `deviceMemory <= 4` the decoder keeps only the current
  window (`collect:false`) and the player uses the original file.

Phase names, progress semantics, `Job` / `Segment` / `Word` field names and the SSE-shaped events are **identical to
the server's** (`core/models.ts`), so the transcript page, the exports and their specs do not change.

## 4. Worker protocol

One engine worker per job pipeline; one hinglish worker shared and lazy. Messages (from `spike/asr.md`, extended):

```
page -> worker   { id, op: 'run', file: File, options: JobOptions, plan: DevicePlan }
worker -> page   { type: 'phase', id, phase, progress, eta }     | { type: 'segments', id, segments, since }
                 { type: 'partial', id, text }                   | { type: 'language', id, language, probability, candidates }
                 { type: 'progress', id, kind: 'download'|'decode', loaded, total, file? }
                 { type: 'warning', id, code, message }          | { id, ok: true, result: JobResult } | { id, ok: false, cancelled, error }
page -> worker   { op: 'cancel', id }   (cooperative; the page applies the hard cancel after 2 s without an ack)
                 { id, op: 'restyle', segments, output_script, romanizer }   (hinglish worker)
```

Errors carry `code` + `userMessage` + `technical` (`spike/audio.md` section 8 taxonomy, extended with
`model-download`, `quota`, `webgpu-lost`, `oom`). The page never shows `technical`; the Logs page does.

## 5. Device policy and model gating (honest, never a silent swap)

Measured on this laptop (`spike/model-matrix.md`); phones and Safari are arithmetic, flagged in the UI copy.

| Device class (probe) | Offered | Default | Hidden with reason |
|---|---|---|---|
| Desktop, WebGPU + `shader-f16`, `deviceMemory` >= 8 | tiny, base, small, medium, large-v3-turbo, large-v3, distil-large-v3, Qwen 0.6B / 1.7B | small | - |
| Desktop, WebGPU, `deviceMemory` 4-8 | tiny, base, small, large-v3-turbo (q4f16) | small | medium / large-v3: "needs 8 GB" |
| Desktop, no WebGPU (WASM, 1 thread) | tiny, base, small | base | larger: "needs a graphics-capable browser (Chrome, Edge)"; Qwen: "needs WebGPU" |
| Phone / tablet, WebGPU | tiny, base, small | base | larger: "use a computer for this size" |
| Phone / tablet, no WebGPU, or `deviceMemory` <= 2 | tiny, base | tiny | - |

Sizes shown are the real download sizes from `model-catalog.json` (tiny 41-76 MB, base 77-146 MB, small 249-485 MB,
medium 517 MB, turbo 564 MB, large-v3 980 MB, distil 534-767 MB). Word timing: shown as "not available for this size"
for large-v3 and distil-large-v3 until an own export exists (`PROGRESS.md` known gaps). A long file on a weak device
gets a warning with the estimated time, not a refusal.

## 6. Data, sessions and privacy

* `SessionStore` (IndexedDB `tv-session`): jobs, segments, stats, edits, and the source `File` (as a Blob) so that
  reload, the player and re-run keep working. Expiry mirrors the server: 30 minutes idle (last activity stamp checked on
  load and every minute), a running job keeps it alive. "Delete my data now" clears the store and offers to delete the
  cached models (Cache API). Nothing else is stored; theme and options stay in `sessionStorage` as today.
* The "videos transcribed" counter: `POST` to a Cloudflare Worker with D1 (`spike/hosting.md` 1.3), one atomic update,
  rate-limited, hidden on any error; described as "reported by browsers", never as verified.
* Privacy wording changes with tests (`PARITY.md` section 3): "Your file never leaves your device. Model files come
  from Hugging Face and the runtime from jsDelivr (your browser fetches them). Ads appear only on information pages
  and are served by Google, which uses cookies."

## 7. Build, hosting, ads

* Angular configurations: `production` = static site, `TRANSPORT = 'browser'`; `self-hosted` and `development`
  (`ng serve` with the proxy) = `TRANSPORT = 'server'`, so `npm run dev` with the Python API keeps working.
* Post-build step (`scripts/pages-postbuild.mjs`): flatten `dir/index.html` -> `dir.html`, copy `index.csr.html` to
  `404.html`, write `_headers` and `_redirects` from `spike/hosting.md` section 8 (`/jobs/:id /index.csr 200`).
* ORT runtime files (16-28 MiB) come from the pinned jsDelivr URL of the exact pinned version
  (`env.backends.onnx.wasm.wasmPaths`); model files from Hugging Face; both named in the privacy page. Everything else
  is self-hosted.
* Ads (`spike/adsense.md` section 16): `shared/ad-rail` grid shell (`minmax(0,1fr) 20vw` at >= 1100 px, in-flow
  300x250 below), `AdSlot` component, `AdsService.canShow(route)`; ad pages = home, how-it-works, FAQ, tool pages,
  finished-transcript page; never on `/jobs/:id` while running, privacy, terms, logs, 404. Inert until
  `core/ads.config.ts` has every slot id; the rail then shows the house note.

## 8. Testing strategy

| Level | What | Where |
|---|---|---|
| Unit (vitest, `ng test`) | every `engine/*` module against golden fixtures produced by the Python code (exports byte-identical, VAD segments identical, DSP within the measured SNR, post-processing rules) | `*.spec.ts` next to the code |
| Transport | `BrowserTransport` satisfies the same contract specs as `ServerTransport` (one shared spec file run against both) | `core/transport/*.spec.ts` |
| Browser (Playwright, `channel: 'chrome'`) | the real worker on the fixtures: tiny WASM + base WebGPU end to end, cancel, reload persistence, model cache, phone viewport | `frontend/e2e/` (built from the spike drivers), run by `npm run e2e` |
| Accuracy (plan step 5) | WER on the SAPI fixtures vs `expectedText`; the six golden transcripts need the owner's videos (not in the repo) | `scripts/accuracy.mjs` |
| Policy | no `adsbygoogle` on excluded routes; privacy text contains the disclosures; CLS 0 on ad pages with a stub | specs + e2e |

## 9. Work breakdown for M3 (engine core)

Each row is one implementer; file ownership is disjoint so they run in parallel; `engine/jobs` and the worker host
integrate last.

| # | Owner of | Input |
|---|---|---|
| A | `engine/audio/` | `scratch/audio/reference`, `spike/audio.md` |
| B | `engine/vad/` | `scratch/vad/reference`, `spike/vad.md` |
| C | `engine/asr/` + `engine/models/` | `scratch/asr/reference`, `spike/asr.md`, `model-catalog.json` |
| D | `engine/post/` + `engine/export/` | `backend/app/{engine,formats}.py`, `parity/engine.md`, Python golden dumps |
| E | `engine/device/` + `engine/jobs/SessionStore` | section 5-6, `backend/app/jobs.py` |
| F (after A-E) | `engine/jobs/JobRunner` + `engine/worker/` + `core/transport/BrowserTransport` | sections 3-4 |

Done means: specs green in `ng test`, the module's reference browser check passes in headless Chrome, and
`PARITY.md` rows it covers move to `status: done` with the test named.
