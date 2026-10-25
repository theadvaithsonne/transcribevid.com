# Feature parity: server (FastAPI + faster-whisper) -> in-browser engine on a static host

Merged from the three inventories (`parity/ui.md` UI-001..UI-140, `parity/engine.md` EN-001..EN-102,
`parity/platform.md` PL-001..PL-070) and the spike reports (`spike/qwen.md`, `hosting.md`, `adsense.md`, `vad.md`,
`audio.md`, `fixtures.md`). Written 2026-10-25 on branch `feature/in-browser`. The source files are the evidence and are
not altered; this file is the single matrix the owner signs off (milestone M2) and the audit list for M8.
`spike/asr.md` and `spike/indicxlit.md` did not exist when this was written; when they land, re-check the rows that cite
EN-030..EN-038 and EN-062/EN-063 (an interim ASR harness result exists only in the scratchpad and is not used as evidence here).

## Principles

1. **No feature is dropped silently.** Every behaviour of today's product has a row, a class and a test. A row may be
   `lost` or `server-optional` only with evidence in the source inventory and a stated alternative, and every such row
   needs the owner's attention before launch (they are listed together in section 4).
2. **Measured, not guessed.** Risk reflects what was measured in the spikes: rows whose port was validated against the
   Python or ffmpeg oracle (audio chain, resampler, VAD, Qwen chunking) carry the measured risk, not the pre-spike guess;
   rows that nobody has run in a browser yet keep their HIGH risk even when a plan exists.
3. **Two owner decisions are applied** (from `PROGRESS.md`): the YouTube / Instagram link downloader is **removed**
   (class `removed`, status `closed`, not a porting task; UI-022, UI-058..UI-064, PL-051..PL-056, EN-100), and
   **Qwen3-ASR is kept as a desktop-WebGPU-only engine** with a disabled-with-reason state everywhere else
   (`spike/qwen.md` section 0; UI-037, EN-050..EN-056).
4. **Two transports.** The `server` transport (today's HTTP + SSE code) stays for the self-hosted / CLI / Docker edition,
   so `server-optional` rows keep working unchanged there; the `browser` transport is what transcribevid.com ships.
5. **Stable IDs.** The source IDs are kept. Where several inventories describe one feature, the row with the most
   user-visible ID is the primary row and the others say "see X"; each still has its own row so nothing goes missing
   in an audit.

### Classes

| Class | Meaning |
|---|---|
| `direct` | Works unchanged in the static build (or stays unchanged in `backend/`, for developer tooling). |
| `port` | Same observable behaviour re-implemented in TypeScript (pure logic, golden-tested against Python) or the same UI rewired to local data. |
| `new-capability` | Needs an engine / platform capability that does not exist in the browser stack today and must be built (decoder loop, persistence, model manager, device probe ...). |
| `server-optional` | Cannot run on a static host; stays available only through the optional self-hosted API / CLI, with a visible explanation on the static site. |
| `replaced` | A different mechanism with an equivalent user-visible outcome (host rules instead of middleware, print-to-PDF instead of fpdf2, device guard instead of an upload cap, Worker counter instead of a file). |
| `removed` | Removed by the owner's decision (link downloader). |
| `lost` | No equivalent exists on the free static site; the alternative is stated and the owner must acknowledge it. |

Risk: `HIGH` = cannot be kept without unproven work or has evidence of a platform limit; `MED` = clear work with some
unknowns; `LOW` = direct, mechanical or already validated by a spike. Status: `todo` for every row that needs work or a
test, `closed` for removed rows and rows that need nothing.

## 1. Summary

| Class | Count |
|---|---|
| direct | 54 |
| port | 98 |
| new-capability | 43 |
| server-optional | 13 |
| replaced | 46 |
| removed | 15 |
| lost | 8 |
| **Total rows** | **277** (140 UI + 67 EN + 70 PL; every source ID present once) |

Risk: 37 HIGH, 79 MED, 161 LOW. Status: 216 `todo`, 61 `closed`. (Counts are of the rows in section 2, computed from
the file; a feature described by several inventories keeps one row per source ID so that an audit against the
inventories is one-to-one.)

## 2. Parity matrix

Column notes. **Today (server)** = where/how it works now (file refs are in the source inventory under the same ID).
**Browser engine strategy** = how it is kept; `EC-nn` are the capability hand-offs defined in `ui.md` section 13.
**Test that proves it** = the first test that must pass (vitest `*.spec`, Playwright `*.e2e`, Python test in brackets
when it is the oracle).

### 2.1 App shell, upload page, model picker (UI-001..UI-057)

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| UI-001 | Skip link focuses `#main` | pure client | unchanged | direct | LOW | app.spec (skip link) | closed |
| UI-002 | Header brand, tagline, home link | `health.brand.name` | brand from build-time `site.config.ts` (see PL-014) | port | LOW | app.spec brand without `/api/health` | todo |
| UI-003 | Main nav tabs with active state | none | unchanged | direct | LOW | app.spec | closed |
| UI-004 | Logs tab shown when server has logs | `health.logs_enabled` | shown behind a dev flag / `?debug`, feeds the in-page log buffer (EC-19; see UI-125) | port | LOW | app.spec logs link gating | todo |
| UI-005 | "N videos transcribed" counter pill (also UI-132, PL-017, EN-075) | `GET /api/stats` from an atomic server file, counted once per upload | Cloudflare Worker + D1 atomic increment at `/api/stats` + `/api/count`, same `{transcribed, counting}` payload; client posts once per origin; pill hidden on any error; poll 5 min. Honest loss: count is client-reported, never described as verified | replaced | MED | worker.spec (atomic 201 after 200 parallel POSTs, Origin 403), stats.service.spec hide-on-error | todo |
| UI-006 | Transcripts popover (dialog, focus rules) | `GET /api/jobs` | same component, jobs from the local store (EC-11) | port | LOW | app.spec popover | todo |
| UI-007 | Job rows: status, %, ETA, bar, "N min ago" | `JobSummary` fields | same fields from the engine events (EC-01/02) | port | MED | app.spec rows with engine-fed store | todo |
| UI-008 | Per-row Cancel / Delete with confirm, 409 rule | `POST .../cancel`, `DELETE /api/jobs/:id` | local `cancel(id)` (EC-04) and delete (EC-11); "Cancel the running job first." kept | port | MED | app.spec delete/cancel; jobs-store.spec | todo |
| UI-009 | Mobile menu sheet | none | unchanged | direct | LOW | app.spec sheet | closed |
| UI-010 | Data note (public / local wording) | `health.public/persistent/idle` | third mode `browser`: "stored on this device only; never uploaded" (see UI-123) | port | MED | app.spec data note browser mode | todo |
| UI-011 | "Session time left: about N min" | `GET /api/session` | nothing expires server-side; line replaced by the "stored on this device" note (PL-003 TTL if the owner picks one) | replaced | LOW | app.spec: line absent in browser mode | todo |
| UI-012 | "Delete my data now" (also PL-005) | `DELETE /api/session` wipes jobs + media | `DataService.deleteAll()` clears IndexedDB/OPFS jobs, Blobs, temp files, optionally the model cache (EC-09/EC-11); toast "removed from this device". **Trap:** the footer block renders only when `/api/health` answered, so it must be shown unconditionally | port | HIGH | app.spec footer present without health; data.service.spec deleteAll empties every store | todo |
| UI-013 | Light / dark theme, persisted, no first-paint flash | none | unchanged | direct | LOW | theme.service.spec | closed |
| UI-014 | "Can't reach the server ... Retrying" banner | `GET /api/jobs` failures | removed in browser mode; an offline notice only where the network matters (model download, UI-056). Server transport unchanged | replaced | MED | app.spec: banner never shows in browser mode; download offline error | todo |
| UI-015 | Session-ended / ends-in-N-min banners (also PL-004) | `/api/session` polling | removed in browser mode; one-time eviction check on load ("your browser removed stored transcripts") | replaced | LOW | session.service.spec inert; data.service.spec eviction flag | todo |
| UI-016 | Footer (year, version, Privacy / Terms, contact, free tools) | `health.version/brand` | static config; version from a build constant; add "Privacy and cookie settings" button on ad pages (M6) | port | LOW | app.spec footer | todo |
| UI-017 | Toast system | none | unchanged | direct | LOW | toast.service.spec | closed |
| UI-018 | Window-level file-drag guard | none | unchanged | direct | LOW | app.spec | closed |
| UI-019 | Navigation closes menus | none | unchanged | direct | LOW | app.spec | closed |
| UI-020 | Prerender safety, `ASSUME_PUBLIC` | build time | "assume browser mode" so prerendered HTML already says "never leaves your device" | port | MED | prerender snapshot spec | todo |
| UI-021 | Page title + Free / Unlimited / No login chips | none | unchanged ("Unlimited" becomes literally true); h1 no longer switches (link tab removed) | direct | LOW | upload.spec | todo |
| UI-022 | Tool picker "Transcribe a file" / "Download from link" | none | removed with the link downloader (owner decision) | removed | LOW | upload.spec: picker absent | closed |
| UI-023 | Drop zone accept list (`video/*,audio/*,.mkv,...`) | none | unchanged; decodability per container is EN-010 (ffmpeg.wasm for mkv/avi/wmv/flv/ts/3gp; spike/audio.md 3.5) | direct | MED | upload.spec accept attr; decode.e2e matrix | todo |
| UI-024 | Multi-file list with remove | none | unchanged | direct | LOW | upload.spec | closed |
| UI-025 | Whole-page drop overlay | none | unchanged | direct | LOW | upload.spec | closed |
| UI-026 | File validation (MIME / extension / duplicates) | none; server rejects 0 bytes | unchanged + explicit 0-byte rejection ("This file is empty (0 bytes) ..." from EN-010 `EMPTY_FILE`) | direct | LOW | upload.spec 0-byte file | todo |
| UI-027 | Upload size limit 500 MB / 4 GB (also PL-008) | `health.max_upload_mb` | no upload, so no cap; device guard (EC-15): soft warning, hard refusal only where decode would exceed memory (phones). Primary decoder handles > 2 GB files (spike/audio.md 3.3) | replaced | HIGH | upload.spec device-guard messages; long-audio.e2e | todo |
| UI-028 | Duration limit 60 min (also PL-009) | server probe error | no cap; duration-based advice per device class after probe (EC-15) | replaced | MED | upload.spec; device.spec | todo |
| UI-029 | Drop hint with limits text | `health.max_*` | device hint instead of a limits sentence | port | LOW | upload.spec | todo |
| UI-030 | Microphone recording to a `File` | none | unchanged; MediaRecorder WebM/Opus and MP4/AAC decode through the same primary decoder (24/24 recordings, spike/audio.md 9) | direct | LOW | mic.e2e (fake capture device) | todo |
| UI-031 | Quality presets base / small / large-v3-turbo / large-v3 | ids into `JobOptions.model` | same four ids mapped to ONNX builds (EC-09); large-v3 (1.2 GB q4) gated per device with a visible reason, never silently swapped. tiny/base/small proven in Chrome; medium/turbo/large-v3 not yet run in a browser | new-capability | HIGH | catalog.spec; preset-gating.spec; model-load.e2e per model | todo |
| UI-032 | "First time only: downloads N GB" note | `/api/models` size_mb, downloaded | real byte sizes of the chosen dtype; `downloaded` from the Cache API (EC-09) | new-capability | MED | models-cache.e2e | todo |
| UI-033 | Presets greyed by allowed models (also PL-015) | `health.allowed_models` | "models this device can run" from EC-15 (restores tiny/medium/large-v3/distil to public visitors) | port | MED | upload.spec ensureAllowedModel with device list | todo |
| UI-034 | Language select, 61 languages (also PL-016, EN-002) | `GET /api/languages` | static JSON (EC-16) | port | LOW | languages.spec equals Appendix A2 | todo |
| UI-035 | "More options" disclosure | none | unchanged | direct | LOW | upload.spec | closed |
| UI-036 | Transcript style Hinglish / Original | `JobOptions.output_script` | Hinglish pipeline in the engine (EC-07; EN-060..EN-065) | new-capability | HIGH | hinglish e2e on a Hindi clip (owner to supply) | todo |
| UI-037 | Recognition engine select Whisper / Qwen3 ASR | `/api/models` lists qwen | **Desktop WebGPU only** (spike/qwen.md): entries stay in the picker; on phones / no WebGPU / low memory they are disabled with "Qwen3 ASR needs a desktop browser with WebGPU (Chrome or Edge) ... Whisper models work on every device." Self-hosted server is the only other route | new-capability | HIGH | upload.spec disabled-with-reason states; qwen.e2e on WebGPU | todo |
| UI-038 | Hinglish conversion select Automatic / IndicXlit / Basic | `JobOptions.romanizer` | IndicXlit ported to the browser (M1b, EN-063) or an honest fallback to Basic with the warning; label "when downloaded" | new-capability | HIGH | indicxlit-parity (>= 99.5 % top-1 vs CT2 on >= 2,000 words) | todo |
| UI-039 | Output Transcribe / Translate to English | `JobOptions.task` | `<\|translate\|>` prefix in the decoder (EN-039); disabled for Qwen | new-capability | MED | translate.e2e | todo |
| UI-040 | Vocabulary hint (never persisted) | `JobOptions.prompt` | `<\|startofprev\|>` prompt tokens built by our decoder (EN-032); `prompt` must stay out of persisted job options or be an explicit decision | new-capability | MED | prompt.spec; storage spec: prompt not persisted | todo |
| UI-041 | Advanced model select (all 9 ids incl. tiny, medium, distil-large-v3) | `GET /api/models` | browser catalogue with the same ids/labels/notes (EC-09, EN-001); distil-large-v3 and large-v3 need our own attention-exporting ONNX for word timing (D-E6) or a visible "no word timing on this model" note | new-capability | HIGH | catalog.spec 9 ids; words.spec per model | todo |
| UI-042 | Search depth slider 1-10 (beam size) | `beam_size` | beam search built in our decoder (EN-034; Transformers.js ignores `num_beams`) | new-capability | HIGH | decode.spec greedy == beam1, beam5 >= greedy score | todo |
| UI-043 | Switches: Enhance audio, Skip silence & music, Word timing, Previous text | four options | clean-up chain (EN-011, validated), Silero VAD (EN-020, validated), word timing (EN-037, build), previous-text conditioning (EN-032, build) | new-capability | HIGH | audio-chain.spec, vad.spec, words.spec, prompt.spec | todo |
| UI-044 | Remembered options in `sessionStorage` | none | unchanged | direct | LOW | upload.spec | closed |
| UI-045 | Submit button states | none | "Uploading..." becomes "Preparing..." | port | LOW | upload.spec | todo |
| UI-046 | Start: validate, persist options, create jobs sequentially | `POST /api/jobs` | `createJob(file, options)` creates a local record (EC-11) and enqueues (EC-01); sequential queue, one model resident | port | MED | upload.spec; jobs-store.spec queue order | todo |
| UI-047 | Upload progress card (bytes, MB/s, "keep page open") | `UploadProgress` events | no upload: short "Reading <file>" state then navigate; "keep this page open" moves to the transcribing phase (wake lock EC-15) | replaced | MED | upload.spec; job.spec wake-lock hint | todo |
| UI-048 | Leaving mid-upload keeps it going | in-flight XHR | engine job continues in the worker | port | LOW | upload.spec destroyed flag | todo |
| UI-049 | `beforeunload` guard while uploading | upload in flight | guard moves to "a transcription is running" on any page | port | MED | app.spec beforeunload | todo |
| UI-050 | Upload error mapping (0 / 413 / 429 / 503 / 507) | HTTP status + `detail` | engine-start errors (undecodable file, memory, WebGPU lost, download failed/offline) in the same `{detail}` shape (EN-010 error taxonomy, 11 codes with tested messages) | port | MED | upload.spec error texts; decode conformance (153 checks) | todo |
| UI-051 | Partial failure across several files | sequential POSTs | same logic for the storage-quota case | port | LOW | upload.spec | todo |
| UI-052 | Open `/jobs/<id>` with `history.state.justUploaded` | router state | **decision needed:** ads-free isolated transcriber page needs a full page load (`location.assign`) per spike/hosting.md 7 and adsense.md 12.1, which drops router state and in-memory jobs; the File and job must travel through IndexedDB/OPFS (EC-11). `PROGRESS.md` said "no isolation requirement"; the ad architecture reopens it | port | HIGH | nav.e2e: reload and full load both open the transcript; toast once | todo |
| UI-053 | Note under the button (deleted automatically / nothing saved) | `health.public` | "Your file never leaves your device. Privacy" | port | LOW | upload.spec | todo |
| UI-054 | Hand-off from keyword pages (`PendingFileService`) | in-memory signal | unchanged inside one SPA document; see UI-052 if the transcriber is a separate document | direct | LOW | tool-drop.spec | todo |
| UI-055 | Allowed-model effect re-runs when the list arrives | `health.allowed_models` | device probe is async too | port | LOW | upload.spec | todo |
| UI-056 | Model download progress UI (new, required) | not present ("Getting the speech engine ready...") | progress events `loaded/total` per file, resumable, cancellable, persistent-storage request, offline error (EC-02/EC-09) | new-capability | HIGH | download-progress.e2e (throttled network, cancel, offline) | todo |
| UI-057 | Weak-device warning, wake lock, memory guard (new, required) | not present | EC-15 device probe (`navigator.gpu`, `deviceMemory`, cores, `storage.estimate`) | new-capability | MED | device.spec | todo |

### 2.2 Link download tab (removed by owner decision)

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| UI-058 | "Paste a link. Save the video." form | `POST /api/downloads` (yt-dlp) | removed 2026-10-25 (AdSense "enabling dishonest behavior" policy, spike/adsense.md 3); commit `3d8d3dc` reverted | removed | LOW | upload.spec: no link tab; grep for `downloader` finds nothing | closed |
| UI-059 | Download job status panel | `GET /api/downloads/:id` | removed | removed | LOW | as UI-058 | closed |
| UI-060 | Download cancel | `POST .../cancel` | removed | removed | LOW | as UI-058 | closed |
| UI-061 | Auto-save + "Save video" link | `GET .../file` | removed | removed | LOW | as UI-058 | closed |
| UI-062 | "Clear download", restore on open | `GET/DELETE /api/downloads*` | removed | removed | LOW | as UI-058 | closed |
| UI-063 | Downloader privacy line | none | removed | removed | LOW | as UI-058 | closed |
| UI-064 | Disabled state when no downloader URL | - | not needed any more | removed | LOW | as UI-058 | closed |

### 2.3 Transcript page: states, progress, player (UI-065..UI-080)

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| UI-065 | Page states incl. transcript survives reload | `GET /api/jobs/:id`, cookie session | lookup in IndexedDB (EC-11); busy / unreachable / session-ended states dropped in browser mode; **F5 must still show the transcript and the player** (persist segments + source Blob; Safari 7-day eviction -> `storage.persist()`, D-1) | new-capability | HIGH | persistence.e2e: reload, new tab, storage cleared -> not found | todo |
| UI-066 | Live follow of a running job | SSE `job` / `segments` / `end` | in-process observable from the worker, same `{type,data}` shape; `since` replays persisted segments (EC-02/03) | port | MED | job.spec watch() with worker events | todo |
| UI-067 | Load / retry loops, stale-response guards | HTTP errors | keep `current(id)` guards, drop network timers | port | LOW | job.spec | todo |
| UI-068 | Progress card: phase text, "NN% done", ETA, Cancel | `progress/eta_seconds` | ETA formula ported (EN-043: `elapsed/progress - elapsed` after 3 % and 3 s) | port | MED | eta.spec; job.spec | todo |
| UI-069 | "Waiting in line..." | shared server queue | only the visitor's own queue: "Waiting for your previous file..." | port | LOW | job.spec copy | todo |
| UI-070 | Cancel keeps partial text, "Cancelling..." until terminal (also EN-044) | `cancel_requested`, worker abort | cooperative flag checked per decode step / VAD batch / window / media chunk (< 300 ms target); `worker.terminate()` after 1.5 s; partial segments stay; decode cancel measured 18-82 ms (spike/audio.md 3.4) | new-capability | HIGH | cancel.e2e during decode, VAD, model load, stuck worker | todo |
| UI-071 | Failed / Cancelled cards with Try again / Start again | `job.error`, rerun | engine error strings (EN-010 taxonomy, EN-012) | port | LOW | job.spec | todo |
| UI-072 | Toasts on status change ("Upload complete", "Transcript ready") | none | wording "File added" / "Started" | direct | LOW | job.spec | todo |
| UI-073 | Page title = transcript name, noindex | none | unchanged | direct | LOW | title.service.spec | closed |
| UI-074 | Leaving cancels request / stream / timer | request lifecycles | unchanged guards | direct | LOW | job.spec | closed |
| UI-075 | Facts line: language, duration, words, "NN% model confidence" | `Stats` from `compute_stats` | `compute_stats` ported (EN-087); `avg_confidence` needs segment confidence (EN-041/EN-037) | port | MED | stats.spec vs Appendix B vector | todo |
| UI-076 | Review card triggers (no speech / review_reasons / avg_confidence < 0.6 / language_probability < 0.8) | engine fields | needs `review_reasons` (EN-054 for Qwen; Whisper guards), segment confidence (EN-041), `language_probability` (EN-031). Without EN-031/EN-037 two of four triggers go silent | new-capability | HIGH | job.spec qualityConcern cases with engine fixtures | todo |
| UI-077 | Hinglish spelling warning card + Qwen note | `conversion_warning`, `options.engine` | from EC-07 / EC-08; Qwen note also carries the desktop-WebGPU speed hint | new-capability | MED | job.spec cards | todo |
| UI-078 | Media player (video/audio, speed select) incl. non-playable containers (also EN-013, EN-014) | `/api/jobs/:id/media` Range; server `preview.mp3` for mkv/avi/... | object URL of the persisted source Blob when `canPlayType`; otherwise a preview encoded from the decoded PCM (WebCodecs `AudioEncoder` Opus/AAC or WAV) built in the worker; must survive reload (EC-11/EC-14) | new-capability | HIGH | preview.e2e: mkv plays, seeks, survives reload | todo |
| UI-079 | Playhead tracking -> active segment | none | unchanged | direct | LOW | transcript.spec | closed |
| UI-080 | `seek(t)` | none | unchanged | direct | LOW | job.spec | closed |

### 2.4 Transcript page: actions and list (UI-081..UI-108)

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| UI-081 | Action bar only when done | none | unchanged | direct | LOW | job.spec | closed |
| UI-082 | Export menu (7 formats, phone sheet) | none | unchanged | direct | LOW | job.spec | closed |
| UI-083 | Subtitle line length 32 / 42 / 56 -> `max_chars` | `export?format=srt&max_chars=` | `build_cues` + `_wrap` ported (EN-081) | port | MED | cues.spec vs Appendix B [test_formats.py] | todo |
| UI-084 | Download a format (fetch first, debounce, RFC 5987 name) | `Content-Disposition` | Blob built locally; file name = sanitised title + ext | port | LOW | job.spec saveFile | todo |
| UI-085 | Export content parity txt / plain / md / json | `formats.py` | pure-function port, golden-compared (EN-082..EN-086) | port | MED | formats.spec byte-equal (JSON parse-equal, D-E8) | todo |
| UI-086 | PDF export: A4, selectable text, any script, RTL, footer (also EN-089) | fpdf2 + HarfBuzz + system fonts | print stylesheet + `window.print()` ("Save as PDF"); Chrome 155 verified `Page X of Y`, `:first`, literal running title. Gaps: Firefox/Safari margin boxes, no silent file name, Devanagari copy-paste fidelity unverified, tofu instead of `?`. Generator route (pdf-lib + Noto) is the fallback (D-E4). Server edition keeps the exact fpdf2 output | replaced | HIGH | pdf.e2e: Hindi / Arabic / Chinese / English, header on page 2+, empty-transcript text, visual check in a viewer | todo |
| UI-087 | Copy text (three-step clipboard fallback) | `export?format=txt` | text is local; keep the fallbacks | port | LOW | job.spec copy | todo |
| UI-088 | "More" menu | none | unchanged | direct | LOW | job.spec | closed |
| UI-089 | Rename (optimistic, rollback, 200 chars; also EN-072) | `PATCH {title}` | local store update | port | LOW | job.spec rename [test_jobs.py::test_rename_a_job_title] | todo |
| UI-090 | Re-transcribe form (engine, model, language with Auto kept, style) creates a new job (also EN-004, EN-073) | `POST .../rerun` copies media, merges options | stored source Blob reused (EC-11); same merge semantics (explicit null language honoured, revalidated) | new-capability | HIGH | rerun.e2e after reload; rerun.spec merge vectors [test_jobs.py::test_rerun_*] | todo |
| UI-091 | "Apply style only" restyle of saved recognition (also EN-065) | `PATCH {output_script, romanizer}` -> `restyle_segment` | pure restyle over stored segments in the worker with the IndicXlit model; edited lines skipped; version check against concurrent edits; atomic | new-capability | HIGH | restyle.spec [test_hinglish.py::test_restyle_*, test_failed_style_conversion_is_atomic] | todo |
| UI-092 | "Review language and quality" opens rerun form | none | unchanged | direct | LOW | job.spec | closed |
| UI-093 | Delete transcript | `DELETE /api/jobs/:id` | local delete + revoke object URL + remove Blob | port | LOW | job.spec | todo |
| UI-094 | Edit saving (optimistic, merge, "done only" rule; also EN-071) | `PATCH {segments}`; stats recomputed | local apply + `compute_stats`; keep "done only" or decide consciously | port | MED | edit.spec [test_jobs.py::test_text_edit_*, test_delete_segment_*] | todo |
| UI-095 | Unsaved-edit protection on navigate / pagehide | `fetch keepalive` PATCH | IndexedDB writes are async: stash the draft synchronously (`sessionStorage`) on `pagehide`, merge on next load | port | MED | pagehide.e2e real tab close | todo |
| UI-096 | Mobile bottom sheets | none | unchanged | direct | LOW | job.spec | closed |
| UI-097 | Row list performance (400-row paging, content-visibility) | none | unchanged (matters more at WASM speed) | direct | LOW | transcript.spec | closed |
| UI-098 | Live mode (every row, pin to newest) | SSE segments | fed by EC-03 | port | MED | transcript.spec live | todo |
| UI-099 | Search with marks, prev/next | none | unchanged | direct | LOW | transcript.spec | closed |
| UI-100 | Replace in all matching lines | batch PATCH | local batch edit (UI-094) | port | LOW | transcript.spec | todo |
| UI-101 | "Underline unsure words" (p < 0.5 red, < 0.75 amber; also EN-037) | `words[].probability` | per-word probability from a teacher-forced alignment pass (EN-037) on WebGPU and WASM; the plan's "drop it" option is rejected by the owner rule | new-capability | HIGH | words.spec: probability within 0.05 of CT2 on tiny/base/small; transcript.spec levels | todo |
| UI-102 | Segment warning mark (confidence < 0.6) and edited mark | `Segment.confidence` | confidence = mean word probability else `exp(clamp(avg_logprob))` (EN-041); needs EN-035 scores | new-capability | HIGH | confidence.spec vectors [test_engine.py::test_segment_dict_*] | todo |
| UI-103 | Line editing (textarea, Enter / Shift+Enter / Esc) | PATCH | unchanged UI, local save | direct | LOW | transcript.spec | todo |
| UI-104 | Delete a line with confirm (no undo today) | PATCH deleted | unchanged; undo stays a non-goal | direct | LOW | transcript.spec | closed |
| UI-105 | Click word / timestamp to seek (caret lookup) | `Word.start` | needs word starts (EN-037); line-level seek direct | new-capability | MED | transcript.spec seek by word | todo |
| UI-106 | "Follow playback" switch | none | unchanged | direct | LOW | transcript.spec | closed |
| UI-107 | Empty states (live / no speech) | none | unchanged | direct | LOW | transcript.spec | closed |
| UI-108 | Per-segment fields carried (`original_text`, `romanizer`, `timing`, `review_reasons`, `no_speech_prob`, `original_word`) | `Segment` contract | produced by EC-05..EC-07 and persisted, because JSON export, restyle and the review card depend on them | new-capability | MED | segment-shape.spec (key order per EN-041/EN-064) | todo |

### 2.5 Keyword pages, FAQ, How it works, legal, 404, logs, core services (UI-109..UI-140)

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| UI-109 | Six keyword landing pages (prerendered) | none | unchanged structure; copy changes in section 3 and AdSense content requirements (original text per page) | direct | MED | tool-page.spec; prerender snapshot | todo |
| UI-110 | Tool-drop box in each hero | `health.max_upload_mb` | drop the size branch; hint "Nothing leaves your device" | port | MED | tool-drop.spec | todo |
| UI-111 | `{limits}` placeholder in tool FAQ answers | `health.max_*` | device-based sentence or none | port | MED | tool-page.spec | todo |
| UI-112 | Free / Unlimited / No login chips | `site.isLocal()` | unchanged | direct | LOW | free-chips.spec | closed |
| UI-113 | "More free tools" block | none | unchanged | direct | LOW | related-tools.spec | closed |
| UI-114 | "Record with your microphone" link | none | unchanged | direct | LOW | tool-page.spec | closed |
| UI-115 | Tool-page FAQ "Can I paste a link? No" vs home link tab | none | contradiction disappears with the removal; the "No ... not web links" answer is true again | direct | LOW | content spec: no YouTube / Instagram wording on reviewed pages | todo |
| UI-116 | FAQ page (8 questions, mode-dependent wording, languages list) | `health.*`, `/api/languages` | browser-mode copy (section 3); languages from static JSON | port | MED | faq.spec | todo |
| UI-117 | FAQPage JSON-LD from rendered text | none | unchanged | direct | LOW | faq.spec | closed |
| UI-118 | How it works page | `health.*` | copy fixes ("busy service", "uploaded", "Six ways" -> seven) | port | MED | how-it-works.spec | todo |
| UI-119 | HowTo JSON-LD | none | unchanged | direct | LOW | how-it-works.spec | closed |
| UI-120 | Privacy policy | `health.*`, retention text | full rewrite: files stay on device; models from Hugging Face / jsDelivr; AdSense cookies + consent + opt-out links; counter Worker; logs browser-only; Cloudflare sees IPs. `/privacy` must carry no ad loader | port | HIGH | legal.spec; ads.spec: no loader on `/privacy` | todo |
| UI-121 | Terms of use | `health.*` | sections 3, 5, 7, 9 rewritten (no server processing, no limits, no session deletion) | port | MED | legal.spec | todo |
| UI-122 | 404 page + catch-all route (also PL-037) | server true 404 + shell | root `404.html` = client shell so unknown URLs answer a real 404 with "Page not found" (verified locally) | replaced | MED | host-contract.e2e `/nope` 404 + h1 | todo |
| UI-123 | Mode-dependent wording matrix (10 places) | `health.public` | add `browser` mode to every switch; update the pinned tests | port | MED | the specs listed in ui.md section 11 | todo |
| UI-124 | Logs access gate (token form) | `/api/logs` auth | server-only admin feature; hidden in the static build | server-optional | LOW | logs.spec hidden in browser mode | todo |
| UI-125 | Live log viewer (also PL-048) | `/api/logs` + SSE | same component on an in-page ring buffer fed by `LogService` (engine / worker / VAD lines; EC-19) | port | MED | logs.spec with buffer source | todo |
| UI-126 | Level toggles, filter, pause, download, clear | `DELETE /api/logs` | Clear empties the local buffer | port | LOW | logs.spec | todo |
| UI-127 | Client logs sent to the server (also PL-049) | `POST /api/logs/client` | console + local buffer; remote reporting is gone on the static site (see PL-049) | replaced | LOW | log.service.spec no network | todo |
| UI-128 | Global error handler + HTTP interceptor | HTTP | unchanged; interceptor a no-op in browser mode | direct | LOW | log.service.spec | todo |
| UI-129 | `ApiService` facade (17 endpoints) | HTTP | second implementation with identical signatures; `exportUrl` -> `export(id, fmt, opts): Blob` | port | MED | api.service.spec browser transport; contract test both transports | todo |
| UI-130 | `JobsStore` polling 2 s / 15 s / 5 s / 10 s | `GET /api/jobs` | event-driven store, no timers; reference data static; `models` refreshed after each job | port | MED | jobs.store.spec | todo |
| UI-131 | `SessionService` 60 s poll | `/api/session` | inert in browser mode | replaced | LOW | session.service.spec | todo |
| UI-132 | `StatsService` poll, backoff, visibility | `/api/stats` | see UI-005 (Worker, 5 min poll) | replaced | MED | stats.service.spec | todo |
| UI-133 | `SiteService` mode / brand / limits / dev hint (also PL-014) | `/api/health` | build-time `site.config.ts` + EC-15; `PUBLIC_DEFAULTS` removed; `answered()` never `unknown` | port | MED | site.service.spec | todo |
| UI-134 | SEO titles, canonical, robots meta | `health.brand` | brand from static config | direct | LOW | title.service.spec | todo |
| UI-135 | Structured data (WebSite, WebApplication, Breadcrumb, FAQ, HowTo) | none | unchanged; add WebAssembly/WebGPU to `browserRequirements` | direct | LOW | structured-data.spec | todo |
| UI-136 | Prerender + CSR shell served for client routes (also PL-038, PL-039) | backend `spa()` | Cloudflare `_redirects` rewrite `/jobs/:id /index.csr 200`, `/logs`, flattened pages, `_headers` | replaced | MED | host-contract.e2e matrix (hosting.md 3.4) | todo |
| UI-137 | Static assets (index boot text, manifest, robots, sitemap, icons) | none | unchanged (`Disallow: /api/` harmless) | direct | LOW | public-files.spec | closed |
| UI-138 | Dev proxy `/api -> 127.0.0.1` (also PL-066) | FastAPI | kept, optional, for the server transport | server-optional | LOW | n/a | closed |
| UI-139 | Formatting helpers | none | unchanged | direct | LOW | format.spec | closed |
| UI-140 | Error text helpers (`errorDetail`, `isTransient`, `isBusy`) | HTTP semantics | engine errors reuse the `{error:{detail}}` shape | port | LOW | http-error.spec | todo |

### 2.6 Engine: catalogue, audio front end, VAD (EN-001..EN-021)

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| EN-001 | Model catalogue: 9 ids, labels, notes, sizes, `downloaded` | `MODEL_CATALOG`, `/api/models` | static `models.json` with the same ids + `repo`, dtype choices, real byte sizes (fp16 / q4 / int8 table in engine.md 2.4); turbo must use the `_timestamped` repo (its main repo's alignment heads are invalid); large-v3 and distil-large-v3 have no timestamped export | port | MED | catalog.spec 9 ids/order/labels; CI HEAD on every repo | todo |
| EN-002 | 61 languages, Qwen 30-code subset, PDF labels | `engine.LANGUAGES` etc. | static tables (Appendix A2/A3/A4); fix `tl` -> Filipino and expose `yue` for Qwen | port | LOW | languages.spec | todo |
| EN-003 | Options schema, defaults, validation messages | `schemas.py` | validator with identical messages, run at create and re-run | port | LOW | schemas.spec [test_schemas.py] | todo |
| EN-004 | Re-run option merge (explicit null language, revalidate) | `RerunRequest` | same merge over stored options | port | LOW | rerun.spec [test_jobs.py::test_rerun_*] | todo |
| EN-005 | Downloaded flag, disk-space guard, warm-up | HF cache, `_check_model_space` | `caches.match` manifest, `storage.estimate()` (quota - usage >= bytes * 1.3), `storage.persist()`, idle warm-up of the last model, `caches.delete` | replaced | MED | models-cache.e2e (present / absent / low quota) | todo |
| EN-010 | Decode any media to 16 kHz mono (`-map 0:a:0?`, error messages) | ffmpeg subprocess | **validated (spike/audio.md):** mediabunny + WebCodecs in the worker (43/67 conformance files, > 2 GB files, 240-1160x), lazy `@mediabunny/ac3`/`dts`, `decodeAudioData` for browsers without WebCodecs, ffmpeg.wasm (consent-gated, jsDelivr, 9.3 MB) for AVI / WMA / WMV / FLV / MPG / AMR / GSM / AIFF / AU / CAF / Speex / ALAC. Open: ffmpeg.wasm core is GPL-2.0 (owner decision), Safari / Firefox not measured | new-capability | MED | decode.e2e conformance (153 checks pass in Chrome + Edge); Safari / Firefox run | todo |
| EN-011 | Clean-up chain highpass 70 / lowpass 7800 / dynaudnorm | ffmpeg `-af` | **validated:** TypeScript port matches ffmpeg 7.1 at SNR 191-623 dB (16 kHz) and 85-124 dB through the full chain; filters at the source rate, ffmpeg down-mix matrix | port | LOW | audio-chain.spec vs ffmpeg references | todo |
| EN-012 | Down-mix sqrt(1/2), resample to 16 kHz, < 0.3 s rule | ffmpeg swr | **validated:** polyphase sinc matches libswresample (SNR 100-143 dB, identical lengths, 140-1320x in a worker); "too short" message kept | port | LOW | resample.spec; [test_engine.py duration rule] | todo |
| EN-013 | Media kind / extension / playable lists | `jobs.py` | ported lists + `canPlayType` | port | LOW | media-kind.spec | todo |
| EN-014 | Audio preview for non-playable media | server `preview.mp3` 22.05 kHz | encode from decoded PCM in the worker (WebCodecs Opus/AAC or WAV); see UI-078 | new-capability | MED | preview.e2e | todo |
| EN-015 | Long audio memory (4 h files) | ffmpeg -> memory-mapped file | streaming decode (flat ~110 MB/h Int16 result measured); spilling PCM to OPFS is **not implemented** (needed for phones); temp files removed in `finally` | new-capability | HIGH | long-audio.e2e 60 min + 3.6 h on desktop; phone budget test | todo |
| EN-020 | Silero VAD (threshold 0.45, 500 ms, 400 ms pad) + `get_speech_timestamps` | `silero_vad_v6.onnx` via faster-whisper | **validated (spike/vad.md):** same ONNX file through onnxruntime-web WASM (never WebGPU: wrong probabilities; canary self-test), TypeScript segmenter identical to Python on 52 clip variants x 5 parameter sets and on a 60 min file (787 segments, identical hash); 25x (1 thread) to 86x real time. `vad=false`: 30 s windows cut at quiet valleys (closest equivalent). Energy fallback if the model cannot load | port | LOW | vad.spec goldens (274 tests exist in the spike reference) | todo |
| EN-021 | Speech concatenation + timestamp restore (`SpeechTimestampsMap`) | faster-whisper | `planWindows(WHISPER_PLAN)` + `makeTimeMap`, golden-equal on 1,764 probe times | port | LOW | vad-map.spec | todo |

### 2.7 Engine: Whisper decoding core (EN-030..EN-046)

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| EN-030 | Log-mel features (global max clamp, feature-domain padding), 30 s windows | faster-whisper feature extractor | reuse Transformers.js extractor per window but apply the global `max - 8` clamp and zero-pad in the feature domain | new-capability | MED | features.spec vs NumPy (< 1e-4) | todo |
| EN-031 | Automatic language detection (4 windows, > 0.5, vote) + `language_probability` | `detect_language` | not in Transformers.js (defaults to English): one decoder step at `<\|sot\|>`, softmax over language tokens, per EN-031 pseudo-code | new-capability | HIGH | lang-detect.spec: fixture en >= 0.9, silence en ~0.61, Hindi -> hi | todo |
| EN-032 | Vocabulary prompt + previous-text conditioning semantics | `get_prompt`, reset rules | own prompt construction (`<\|startofprev\|>` + last 223 tokens); faithful first-window-only behaviour (D-E1) | new-capability | MED | prompt.spec | todo |
| EN-033 | Window loop, timestamp parsing, seek advance | `transcribe.py` | own seek loop over `encoder_model` / `decoder_model_merged` | new-capability | MED | seek.spec token vectors | todo |
| EN-034 | Beam search (1-10), sampling, timestamp logit rules | CTranslate2 | **not in Transformers.js** (`num_beams` ignored, verified): batched-beam decoder with KV-cache reordering and the full OpenAI timestamp rules | new-capability | HIGH | decode.spec; golden text on fixtures | todo |
| EN-035 | `avg_logprob`, compression ratio 2.4, temperature ladder, best_of 5 | `generate_with_fallback` | own log-prob bookkeeping, `CompressionStream('deflate')`, six-step ladder | new-capability | HIGH | fallback.spec with scripted decoder | todo |
| EN-036 | `no_speech_prob`: window skip and segment filter | first decoder step | softmax at the SOT position; both rules ported | new-capability | MED | nospeech.spec; silence / noise -> 0 segments | todo |
| EN-037 | Word timestamps + per-word probability (DTW, `merge_punctuations`, post rules) | `add_word_timestamps` | teacher-forced alignment pass over `_timestamped` graphs (cross-attentions of alignment heads), DTW, token probabilities; large-v3 / distil need our own export (D-E6). Transformers.js' own word stamps are shifted ~0.31 s and carry no probability | new-capability | HIGH | words.spec within 0.05 s / 0.05 p of CT2 for tiny/base/small; per-model gate | todo |
| EN-038 | Hallucination-silence guard (2.0 s, anomaly score) | faster-whisper | ported on top of EN-037 | new-capability | HIGH | halluc.spec synthetic window | todo |
| EN-039 | Translate task | `<\|translate\|>` | prefix token; Hinglish skipped; restyle refused | new-capability | LOW | translate.e2e | todo |
| EN-040 | Empty / no-speech / repetition (3 identical) filters | `engine.py` | ported; counts to the browser log | port | LOW | [test_engine.py::test_repetition_*] | todo |
| EN-041 | Segment dict + confidence math, key order | `_segment_dict` | ported with `pyRound`; D-E2 on `original_text` vs number repair | port | LOW | [test_engine.py::test_segment_dict_*] | todo |
| EN-042 | Number repair ("10 000" -> "10,000", word merge) | `fix_number_text`, `merge_number_pieces` | ported (lookbehind regex) | port | LOW | [test_engine.py::test_numbers_*] | todo |
| EN-043 | Phases, live segments, progress, ETA, status machine | `engine.py` / `jobs.py` | worker messages `phase` / `segment(index)` / `progress` / `result` / `error` / `cancelled` | port | LOW | eta.spec; job.spec | todo |
| EN-044 | Cancellation contract (decode, download wait, per segment, stuck decoder, race) | killable worker process | see UI-070; crash recovery message "The transcription worker stopped unexpectedly. Try again." | new-capability | MED | cancel.e2e [test_worker.py x4] | todo |
| EN-045 | One resident model, background load, load errors | `engine.py` | sessions created while audio decodes; release before switching; WebGPU buffers destroyed; download progress events | new-capability | MED | lifecycle.spec | todo |
| EN-046 | Engine switch Whisper <-> Qwen, preview hook | `backends.py` | dispose one engine before loading the other (both tracks say so) | port | LOW | switch.spec | todo |

### 2.8 Engine: Qwen3-ASR (EN-050..EN-056) - desktop WebGPU only

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| EN-050 | Qwen adapter constraints (transcribe only, chunk timing, null words / confidence) | `qwen_engine.py` on torch | **Owner decision:** browser route = published ONNX export (fused GQA decoder + fp16 encoder + int8 embeddings, 0.9 GB / 2.0 GB) through onnxruntime-web WebGPU in our worker; proven end to end in Chrome 155 / Edge 156 on an AMD iGPU (English WER 0 on the test clip; RTF 0.48 en / 0.90 hi quiet, 0.8-2.0 loaded). WASM is unusable (RTF 7-26): no CPU fallback. Elsewhere the entries are disabled with the reason text | new-capability | HIGH | qwen.e2e on WebGPU (text equals torch reference on 3 clips); capability-gate.spec | todo |
| EN-051 | Chunk planner (25 s, 300 ms / 100 ms VAD, skip >= 2 s, overlap flag) | `chunks()` | ported; identical to Python on 3,000 random plans and on 52 clip variants (qwen.md 4, vad.md 6.3) | port | LOW | chunks.spec [test_backends.py::test_chunk_plan_*] | todo |
| EN-052 | Chunk decode with overlap recovery / audio retry | `transcribe()` loop | ported (`transcribeChunks`); Python test vectors reproduced | port | LOW | overlap.spec | todo |
| EN-053 | `trim_overlap` (>= 3 tokens, casefold) | `qwen_engine.py` | ported with a 324-entry Python-casefold table; 4,000 random cases identical | port | LOW | [test_backends.py::test_overlap_preserves_*] | todo |
| EN-054 | `repeated_phrase` review signal | `qwen_engine.py` | ported; 4,000 cases identical; plus `detect_and_fix_repetitions` / `parse_asr_output` from `qwen_asr` (2,500 each) | port | LOW | [test_backends.py repetition test] | todo |
| EN-055 | Qwen language mapping (30 codes) | English names | all 30 codes mapped (`tl` -> Filipino, `yue` -> Cantonese: fixes two latent server bugs); forced-prefix ids from the tokenizer | port | LOW | qwen-languages.spec | todo |
| EN-056 | Qwen runtime hosting, gate, memory | n/a | pinned mirror in a repo we control (SHA-256, Apache-2.0 notice; never copy AGPL Sokuji code); gate: not a phone, WebGPU adapter, `shader-f16` -> q4f16 else q4, `maxBufferSize >= 1 GiB`, storage >= 2x model, `deviceMemory >= 8` (16 for 1.7B); Safari / Firefox / Android treated as unavailable until tested; 12-14 person-days | new-capability | HIGH | capability-gate.spec; 60 min run for memory growth; cross-GPU QA | todo |

### 2.9 Engine: Hinglish / IndicXlit (EN-060..EN-065)

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| EN-060 | When conversion runs (hi / en, transcribe only, live + exports) | `engine.py` / `qwen_engine.py` | ported trigger rules | port | MED | [test_engine.py::test_hinglish_default_live_and_final_output] | todo |
| EN-061 | Basic rule-based romanizer + 196 spellings + schwa rules | `hinglish.py` | ported table-driven (Appendix A5/A6, B); outputs must not be "improved" | port | MED | [test_hinglish.py] + Appendix B table | todo |
| EN-062 | IndicXlit selection (`auto`) and failure policy | job aborts on converter error | `auto` falls back to Basic **per job** with the visible warning; explicit `indicxlit` keeps the hard error; invalid word output -> basic for that word (D-E3, owner OK) | port | MED | [test_hinglish.py::test_neural_conversion_*] with a stub | todo |
| EN-063 | IndicXlit trained model in the browser | CTranslate2 int8 of the Fairseq checkpoint | export to ONNX (encoder + decoder) + TypeScript beam search (beam 4, 96 steps); M1b is attempting this (`frontend/src/app/engine/`, `public/models/` on disk, untracked); no ready-made ONNX exists; acceptance >= 99.5 % top-1 vs CT2 on >= 2,000 Hindi words | new-capability | HIGH | indicxlit-parity spec; browser load/size test | todo |
| EN-064 | Segment and word mapping (`original_text`, `original_word`, key order) | `convert_segment` | ported | port | MED | [test_hinglish.py::test_segment_keeps_*] | todo |
| EN-065 | "Apply style only" restyle (atomic, version check, edited lines kept) | `restyle_segment`, `JobStore.restyle` | ported (see UI-091) | port | MED | [test_hinglish.py::test_restyle_*] | todo |

### 2.10 Engine: job model, exports, tooling, out-of-engine (EN-070..EN-102)

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| EN-070 | Job record fields, lifecycle, one-at-a-time scheduler | `jobs.py` | same record in IndexedDB; sequential local queue | port | LOW | job-store.spec [test_jobs.py] | todo |
| EN-071 | Edit segments (done only, ids not renumbered, 0.1 s minimum) | `jobs.py` | ported | port | LOW | [test_jobs.py::test_text_edit_*] | todo |
| EN-072 | Rename (200 chars, blank keeps old) | `jobs.py` | ported | port | LOW | [test_jobs.py::test_rename_a_job_title] | todo |
| EN-073 | Re-transcribe creates a new job sharing `origin` | `jobs.py` | ported (see UI-090) | port | LOW | [test_jobs.py::test_rerun_*] | todo |
| EN-074 | Cancel / delete rules (queued cancels at once, running delete refused) | `jobs.py` | ported; delete also removes Blob / OPFS entries | port | LOW | [test_jobs.py::test_cancel_*, test_delete_*] | todo |
| EN-075 | Counter hook: once per upload, not on fail / cancel / rerun | `jobs.py` + `stats.py` | `origin` / `counted` logic kept in the browser store; best-effort POST to the Worker (UI-005) | replaced | LOW | counted-once.spec [test_stats.py cases] | todo |
| EN-076 | Server-only limits (sessions, queue, rate, disk, allowed models) | `config.py`, `limits.py` | protections of a shared server; replaced by device-based warnings; individual PL rows below record each one | replaced | LOW | n/a (see PL-007, PL-011, PL-012, PL-013) | closed |
| EN-077 | Review prompts and uncertainty thresholds (data contract) | `job.ts`, `transcript.ts`, `formats.py` | engine must always provide `language`, `language_probability`, `confidence`, `words[].probability`, `review_reasons` | port | MED | job.spec / transcript.spec quality cases | todo |
| EN-080 | Timestamp formats (banker's rounding) | `formats.py` | `pyRound` port | port | LOW | [test_formats.py::test_timestamps] | todo |
| EN-081 | Subtitle cue re-flow (`max_chars`, 6 s, 0.8 s, sentence / clause rules, `_wrap`) | `build_cues` | ported; `[...s].length` for lengths | port | MED | cues.spec vs Appendix B | todo |
| EN-082 | SRT / WebVTT | `formats.py` | ported | port | LOW | [test_formats.py::test_srt_*] | todo |
| EN-083 | TXT with timestamps | `formats.py` | ported | port | LOW | Appendix B string | todo |
| EN-084 | Paragraphs / plain text (1.6 s, 600 chars) | `formats.py` | ported | port | LOW | [test_formats.py::test_plain_text_paragraphs] | todo |
| EN-085 | Markdown | `formats.py` | ported | port | LOW | [test_formats.py::test_render_json_and_md] | todo |
| EN-086 | JSON export (key order, full segments) | `formats.py` | ported; parse-equality, not byte-equality (D-E8) | port | LOW | json.spec parse-equal | todo |
| EN-087 | Stats + keywords (161 stop words) | `compute_stats` | ported (`Counter` order, Unicode regex) | port | MED | [test_formats.py::test_stats*] | todo |
| EN-088 | Export dispatch, MIME, file names | `formats.py`, `main.py` | Blob + `<a download>`; sanitised names | port | LOW | [test_formats.py::test_render_*] | todo |
| EN-089 | PDF export | fpdf2 | see UI-086 | replaced | HIGH | pdf.e2e | todo |
| EN-090 | Accuracy tooling (`textnorm`, `metrics`, `align`) + golden regression V-1..V-6 | Python tools | kept in `backend/` (D-E9); browser harness exports JSON for `tools.metrics`. **Blocked:** the six source videos are not on this machine (D-E11) | direct | MED | golden run once videos are restored; SAPI fixtures as interim smoke (WER 0 expected) | todo |
| EN-091 | Offline analysis tools (consensus, campaign, compare_engines) | Python | kept in Python, not shipped | direct | LOW | n/a | closed |
| EN-092 | CLI `cli.py` (also PL-057) | Python | unchanged in the self-hosted edition; optional Node CLI later | server-optional | LOW | server-edition CI | closed |
| EN-100 | YouTube / Instagram link download | yt-dlp worker | removed by owner decision (record kept in engine.md with the CORS evidence) | removed | LOW | n/a | closed |
| EN-101 | Process worker -> Web Worker, threads | spawned process | one dedicated worker owns models and audio; `terminate()` = process kill; multi-threaded WASM only on a cross-origin-isolated page, correct single-threaded elsewhere | new-capability | MED | cancel.e2e; single-thread run | todo |
| EN-102 | Privacy: no network carries audio / text / names | server promise "session-only" | "never leaves your device"; only model / asset downloads and the optional counter | port | LOW | no-upload.e2e (network log) | todo |

### 2.11 Platform: sessions, limits, capacity (PL-001..PL-017)

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| PL-001 | Per-visitor isolated session (`tv_sid` cookie) | `sessions.py` | origin storage is the isolation; no cookie at all (privacy text must drop "one essential session cookie") | replaced | LOW | data.service.spec | todo |
| PL-002 | `GET /api/session` (time left, job count) | `main.py` | job count from IndexedDB; no API | replaced | LOW | data.service.spec | todo |
| PL-003 | Idle expiry + reaper (30 / 120 min) | `sessions.py` | **D-1 (owner):** persist locally, purge after N idle days on next visit, `storage.persist()`; Safari may evict after 7 days | replaced | MED | data.service.spec TTL purge | todo |
| PL-004 | Session-ended / expiring-soon UX | `session.service.ts` | see UI-015 (one-time eviction check) | replaced | LOW | session.service.spec | todo |
| PL-005 | "Delete my data now" (trap: footer needs `/api/health`) | `DELETE /api/session` | see UI-012 | port | HIGH | app.spec footer unconditional | todo |
| PL-006 | Shutdown wipe, stale-session purge | `sessions.py`, `cleanup.py` | nothing is on a server to wipe; kept for the self-hosted edition. Alternative: Delete my data covers the device | lost | LOW | n/a (owner acknowledgement) | todo |
| PL-007 | Concurrent session cap (200) + "server is full" 503 | `config.py` | no shared capacity, by design; UI never shows it | lost | LOW | app.spec no busy toast in browser mode | todo |
| PL-008 | Upload size limit incl. Caddy 600 MB | `main.py`, `Caddyfile` | see UI-027 (device guard) | replaced | MED | device.spec | todo |
| PL-009 | Duration limit 60 min | `engine.py` | see UI-028 | replaced | MED | device.spec | todo |
| PL-010 | Single FIFO worker, queue cap 30, position / ETA | `jobs.py` | local sequential queue with the same statuses; the global queue is not needed | port | LOW | jobs-store.spec | todo |
| PL-011 | Per-IP upload rate limit (30/h) | `limits.py` | not needed for transcription (no server cost); required again on the counter Worker | lost | LOW | worker rate-limit test | todo |
| PL-012 | Jobs-per-session quota | `jobs.py` | not needed (default was unlimited) | lost | LOW | n/a | todo |
| PL-013 | Free-disk guard (5 GB) + model space check | `jobs.py`, `engine.py` | `navigator.storage.estimate()` before model download / decode; "not enough free storage" | replaced | MED | models-cache.e2e low quota | todo |
| PL-014 | `/api/health` mode switch, brand, limits, allowed models | `main.py`, `SiteService` | build-time `site.config.ts` (see UI-133); no polling | port | MED | site.service.spec | todo |
| PL-015 | `VT_ALLOWED_MODELS` (public: base, small, turbo) | `config.py` | device-capability filter; restores all models to public visitors (see UI-033) | replaced | MED | upload.spec | todo |
| PL-016 | `/api/models`, `/api/languages` | `main.py` | static JSON generated at build | port | LOW | languages.spec, catalog.spec | todo |
| PL-017 | Anonymous counter (atomic file, 30 s cache) | `stats.py` | see UI-005: Worker + D1 (KV rejected: 1,000 writes/day, lost updates measured); Workers 100,000 req/day budget; Origin check; vanity metric | replaced | MED | worker.spec | todo |

### 2.12 Platform: headers, delivery, routing, SEO (PL-018..PL-045)

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| PL-018 | Security headers on every response | middleware + Caddy | `/*` block in `_headers` (nosniff, Referrer-Policy strict-origin-when-cross-origin, X-Frame-Options DENY, Permissions-Policy microphone=(self)); observed on 200 / 404 / redirects locally | replaced | LOW | host-contract.e2e headers | todo |
| PL-019 | HSTS 1 year | `main.py` | `_headers` line or dashboard (one place only) | replaced | LOW | post-deploy curl | todo |
| PL-020 | Deliberately no CSP | `test_spa.py` | unchanged (AdSense needs no script-src CSP; hash CSP only on the isolated page later) | direct | LOW | n/a | closed |
| PL-021 | CSRF OriginGuard + CORS allow-list | `main.py` | no state-changing endpoint on the static site; the counter Worker checks `Origin` (403 verified) | lost | LOW | worker.spec Origin 403 | todo |
| PL-022 | Host-header allow-list | `main.py` | Pages answers only for attached domains; `https://:project.pages.dev/*` noindex rule (verified locally) + Bulk Redirect | replaced | MED | post-deploy curl pages.dev | todo |
| PL-023 | API no-store + noindex | `main.py` | only `/api/stats` exists (public cache 300 s) | replaced | LOW | worker.spec headers | todo |
| PL-024 | Safe static-file resolution, traversal defence | `main.py` | platform asset manifest; `//evil` -> 404, `_headers` not served (observed) | replaced | LOW | host-contract.e2e | todo |
| PL-025 | Log-forging defence, privacy-conscious access log | `main.py`, Caddy | no access log of ours; Cloudflare processes IPs at the edge (privacy page must say so) | lost | LOW | privacy copy review | todo |
| PL-026 | Unhandled error -> JSON 500 | `main.py` | self-hosted API only | server-optional | LOW | n/a | closed |
| PL-027 | gzip / brotli | `Compress` middleware | automatic on Pages (br observed) | replaced | LOW | host-contract.e2e `content-encoding` | todo |
| PL-028 | ETag / 304 | `main.py` | automatic (304 observed for strong and weak validators) | replaced | LOW | host-contract.e2e 304 | todo |
| PL-029 | Cache-Control by file kind | `main.py` | `_headers` immutable for hashed files, 1 day icons, 1 h robots / sitemap / ads.txt; add worker / wasm / vendor names | replaced | LOW | host-contract.e2e cache headers | todo |
| PL-030 | Correct media types (`.webmanifest`, `.xml`) | `main.py` | correct by default (observed) | direct | LOW | host-contract.e2e | todo |
| PL-031 | HEAD parity with GET | `main.py` | observed (`HEAD /nope` 404, no body) | replaced | LOW | host-contract.e2e | todo |
| PL-032 | www -> apex 301, query kept | `main.py`, Caddy | dashboard only: zone on Cloudflare DNS, Bulk Redirect, proxied `A www 192.0.2.1`; not verifiable locally | replaced | MED | post-deploy curl | todo |
| PL-033 | http -> https | Caddy | "Always Use HTTPS" zone setting | replaced | LOW | post-deploy curl | todo |
| PL-034 | Trailing-slash 301 (`/faq/` -> `/faq`) | `main.py` | **raw build must not be deployed:** Pages 308s `/faq` -> `/faq/` (contradicts sitemap / canonicals); fix = post-build flatten `faq/index.html` -> `faq.html` (verified) or Workers assets `drop-trailing-slash`; never write `/faq/ /faq 301` (infinite loop observed) | replaced | HIGH | postbuild unit test; host-contract.e2e `/faq` 200, `/faq/` 308 | todo |
| PL-035 | `/index.html` -> canonical | `main.py` | automatic 308 (observed) | replaced | LOW | host-contract.e2e | todo |
| PL-036 | `/about` -> `/how-it-works` 301 | `main.py`, routes | `_redirects` rule (observed 301, query kept) | replaced | MED | host-contract.e2e | todo |
| PL-037 | True 404 for unknown URLs (`APP_PAGES`) | `main.py` | root `404.html` = client shell (observed real 404 + "Page not found"); without it every unknown URL is a 200 soft-404. Lost: id-format validation and strict case on Pages | replaced | HIGH | postbuild asserts `404.html`; host-contract.e2e `/nope` 404 | todo |
| PL-038 | Client shell for `/jobs/<id>`, never under its own name | `main.py` | `_redirects` `/jobs/:id /index.csr 200` (extension-less target; `.html` targets 308 instead, verified); `/logs /index.csr 200` | replaced | HIGH | host-contract.e2e `/jobs/abc123` 200 shell, `/jobs/a/b` 404 | todo |
| PL-039 | Prerendered pages with per-page meta / JSON-LD | Angular SSG | unchanged; Pages build `npm ci && npm run build && node scripts/postbuild-static.mjs` | direct | LOW | prerender-routes spec | todo |
| PL-040 | `<noscript>` / boot fallback text | `index.html` | unchanged | direct | LOW | n/a | closed |
| PL-041 | `X-Robots-Tag: noindex` on `/api/`, `/logs`, `/jobs/` | `main.py` | `_headers` entries (observed, also on rewrites) | replaced | LOW | host-contract.e2e | todo |
| PL-042 | `robots.txt`, `sitemap.xml`, manifest, icons, og-image | `public/*` | ship as-is; port the four content tests to vitest | direct | LOW | public-files.spec | todo |
| PL-043 | Search-engine verification tags | `config.py` injection | DNS TXT preferred; HTML-file method = file in `public/`; meta via postbuild env | replaced | LOW | postbuild spec | todo |
| PL-044 | IndexNow key file + submit script | `main.py`, `scripts/indexnow.mjs` | key file committed in `public/`; script unchanged (CI / by hand) | direct | LOW | n/a | todo |
| PL-045 | Structured data brand / contact from server | `site.service.ts` | from the build constant (`VT_CONTACT_EMAIL` as build env) | direct | LOW | structured-data.spec | todo |

### 2.13 Platform: logs, link download (removed), self-hosted edition, tooling (PL-046..PL-070)

| ID | Feature | Today (server) | Browser engine strategy | Class | Risk | Test that proves it | Status |
|---|---|---|---|---|---|---|---|
| PL-046 | Backend ring-buffer logging (10,000 records) | `logbuffer.py` | self-hosted edition only | server-optional | LOW | pytest (kept) | closed |
| PL-047 | Logs API (read, SSE, clear, admin token) | `logs_api.py` | self-hosted edition only; no operator replacement on the static site | server-optional | MED | pytest (kept) | closed |
| PL-048 | Logs page (live follow, filters, token prompt) | `features/logs` | see UI-125 (local ring buffer, token UI hidden) | port | LOW | logs.spec | todo |
| PL-049 | Browser error reports -> server | `POST /api/logs/client` | no endpoint: operator loses visibility of visitors' failures. Alternative: opt-in "copy diagnostics" button (clipboard / mailto), no automatic telemetry | lost | MED | logs.spec copy-diagnostics | todo |
| PL-050 | Request access log with levels | `main.py` | none; Cloudflare Web Analytics (cookieless) is optional | lost | LOW | n/a (owner acknowledgement) | todo |
| PL-051 | Download URL allow-list / normalisation | `downloads.py` | removed with the feature | removed | LOW | n/a | closed |
| PL-052 | yt-dlp extraction in a killable process | `download_worker.py` | removed (evidence of CORS block kept in platform.md / engine.md) | removed | LOW | n/a | closed |
| PL-053 | SSRF guard for downloads | `download_worker.py` | removed | removed | LOW | n/a | closed |
| PL-054 | Download queue and per-session limits | `downloads.py` | removed | removed | LOW | n/a | closed |
| PL-055 | Same-origin MP4 hand-off | `downloads_api.py` | removed | removed | LOW | n/a | closed |
| PL-056 | Downloader UI state machine | `downloader.ts` | removed | removed | LOW | n/a | closed |
| PL-057 | CLI `backend/cli.py` | Python | unchanged; the only way to run faster-whisper / Qwen / CT2 IndicXlit exactly as today (D-4) | server-optional | MED | server-edition CI | closed |
| PL-058 | Plan step 4 "remove backend, Dockerfile, deploy" | plan | **do not remove**; `backend/` stays as the self-hosted edition (PROGRESS decision 2026-10-25); only its hosting in production ends | server-optional | MED | repo check: `backend/` present, pytest green | todo |
| PL-059 | Dockerfile (2 stages, fonts, guards) | `Dockerfile` | self-hosted edition; stage-1 guards move to `postbuild-static.mjs` | server-optional | MED | postbuild spec | todo |
| PL-060 | docker-compose stack and volumes | `docker-compose.yml` | self-hosted edition; volumes map to Cache API / OPFS / D1 | server-optional | LOW | n/a | closed |
| PL-061 | Caddyfile + `deploy/README.md` | `deploy/` | self-hosted edition; directives mapped to host rules (PL-018..PL-032) | server-optional | LOW | n/a | closed |
| PL-062 | nginx example + systemd unit | `deploy/` | self-hosted edition | server-optional | LOW | n/a | closed |
| PL-063 | `VT_*` environment settings | `config.py` | mapped per platform.md section 6 (build constants, dashboard, device.ts, Worker) | replaced | LOW | site.config spec | todo |
| PL-064 | `scripts/lighthouse.mjs` against the real backend | script | serve `dist` with `wrangler pages dev` instead | replaced | LOW | script run | todo |
| PL-065 | `scripts/run.mjs` launcher (`npm run dev\|start\|test`) | drives uvicorn + ng serve | `dev` = `ng serve` (+ optional `VT_API` proxy), `start` = build + `wrangler pages dev`, `test` = vitest (+ pytest for the server edition); otherwise `npm run dev` hangs on `/api/health` | port | HIGH | run.mjs smoke in CI | todo |
| PL-066 | Angular dev proxy | `proxy.conf.cjs` | kept, optional (see UI-138) | server-optional | LOW | n/a | closed |
| PL-067 | Angular production build budgets (1 MB initial) | `angular.json` | engine (transformers.js, ORT, VAD, ffmpeg.wasm) must be lazy chunks / workers, never in the initial bundle | direct | MED | build budget check in CI | todo |
| PL-068 | Client request layer (HttpClient, polling, SSE, offline banner) | `jobs.store.ts`, `api.service.ts` | worker `postMessage` transport; offline / busy banners never show on the static site; `http-error.ts` only for the counter | port | MED | jobs.store.spec, api.service.spec | todo |
| PL-069 | Static host file-size limits vs ONNX Runtime wasm | new constraint | 25 MiB per file on Pages; ORT `jsep` 27.0 MiB and `asyncify` 25.6 MiB (the Transformers.js default) cannot be self-hosted: load from pinned jsDelivr (CORS + CORP verified) or split into two chunks; `jspi` (16 MiB) fits if the engine can use it; models from huggingface.co | new-capability | HIGH | deploy dry-run (every file < 25 MiB); engine.e2e with pinned `wasmPaths` | todo |
| PL-070 | Root and frontend npm scripts | `package.json` | keep `build`, `test:frontend`; re-point the rest; add `build:static`, `verify:static` | port | LOW | script smoke | todo |

## 3. Wording that stops being true (must change with the pinned tests)

From `ui.md` section 11 and `adsense.md` section 10: `privacy.html` ("no advertising", "uploaded to our server", "one
essential session cookie", "no third-party scripts"), `faq.html` (upload, cookie, busy queue, 500 MB / 60 min),
`how-it-works.html` ("kept only for your session", "how busy the service is", "Six ways to download"), `app.ts:61` and
`:202` (session note, "removed from the server"), `upload.html:215-219`, `terms.html` sections 3 / 5 / 7 / 9, the six
`tool-pages/content/*.ts` files ("refused before processed", "{limits}", "wait in the queue"), `tool-drop.ts:170`.
Tests to update: `legal.spec.ts`, `faq.spec.ts`, `how-it-works.spec.ts`, `app.spec.ts`, `upload.spec.ts`,
`tool-page.spec.ts`, `tool-drop.spec.ts`, `site.service.spec.ts`. New promise that stays true: "Your file never
leaves your device. Ads appear only on information pages and are served by Google, which uses cookies."

## 4. Items that need the owner's attention (every `lost` and `server-optional` row, plus open decisions)

| Row(s) | What the owner must acknowledge or decide | Stated alternative |
|---|---|---|
| PL-006, PL-007, PL-011, PL-012, PL-021, PL-025, PL-050 | Server protections and server logs have no static equivalent (session cap, rate limit, quotas, CSRF, access log) | Not needed without a shared server; Worker keeps Origin check + rate limit; privacy page names Cloudflare as IP processor |
| PL-049 | Operator no longer sees visitors' errors | "Copy diagnostics" button in the Logs page; no telemetry |
| UI-124, PL-046, PL-047 | Operator logs API exists only in the self-hosted edition | Browser Logs page for the visitor's own session |
| EN-092, PL-057..PL-062, PL-066, UI-138, PL-026 | `backend/`, Dockerfile, deploy files stay as the self-hosted edition (plan step 4 not executed) | Decision already recorded in `PROGRESS.md`; confirm at M2 |
| UI-037, EN-050, EN-056 | Qwen3-ASR only on desktop WebGPU; Hindi near real time on integrated GPUs | Disabled-with-reason elsewhere; Whisper default; self-hosted server for other devices |
| UI-005, PL-017 | Counter becomes client-reported (spoofable) | Never described as verified; rate-limited Worker; hidden on error |
| UI-086, EN-089 (D-E4) | PDF via browser print: no silent file name, Firefox / Safari footer, copy-paste fidelity | Generator route with embedded fonts if sign-off fails |
| EN-010 | ffmpeg.wasm fallback core is GPL-2.0 | Accept GPL obligations, build an LGPL audio-only core, or "convert first" message for AVI / WMA / AMR ... |
| UI-052 + adsense.md 12.1 | Ads need a non-isolated document; multi-threaded WASM needs isolation: transcriber as a separate full-page document or single-threaded engine on the same document | Decide before M4 (PROGRESS says "no isolation requirement") |
| PL-003 (D-1), PL-034 (D-2), PL-017 (D-3) | Local retention TTL; Pages flatten vs Workers assets; D1 vs Durable Object | Recommendations in platform.md section 2 and hosting.md section 0 |
| EN-032 (D-E1), EN-041 (D-E2), EN-062 (D-E3), EN-037 (D-E6), EN-012 (D-E7), EN-086 (D-E8), EN-090 (D-E11) | Engine behaviour decisions and the missing six golden videos | engine.md section 5 |
| EN-063, UI-036, UI-038 | No Hindi audio fixture exists on this machine; Hinglish accuracy cannot be measured here | Owner supplies a 30-60 s licensed Hindi clip with a reviewed transcript |

## 5. The 10 highest-risk items

| # | Row(s) | Why it is the risk |
|---|---|---|
| 1 | EN-037, EN-038, UI-101, UI-102, UI-105, UI-043 | Word timestamps and per-word probability drive the uncertain-word underline, the warning marks, click-to-word seek, SRT/VTT timing and segment confidence. Transformers.js has no probabilities and its word stamps are shifted ~0.31 s; a teacher-forced alignment pass must be built, and large-v3 / distil-large-v3 have no attention-exporting ONNX export at all (own export needed, D-E6). The plan's "drop it" option is ruled out by the owner. |
| 2 | EN-034, EN-035, EN-031, UI-042, UI-076 | Beam search, temperature fallback, the compression / log-prob / no-speech gates and language detection are all missing from Transformers.js 4.3.1 (verified: `num_beams` ignored, defaults to English, no scores). Without them beam size, the hallucination defences and two of the four review-card triggers silently disappear. |
| 3 | EN-063, EN-062, UI-036, UI-038, UI-091 | Trained IndicXlit (the default Hinglish quality) has no ONNX export; M1b is building one (export + TypeScript beam search), acceptance >= 99.5 % vs CT2 is unmeasured, and no Hindi audio exists here to test end to end. Fallback to Basic changes spellings visibly. |
| 4 | UI-037, EN-050, EN-056 | Qwen3-ASR runs only on desktop WebGPU (proven), at RTF 0.5-2 on an integrated GPU, from third-party ONNX exports that must be mirrored and hashed; WASM is unusable, Safari / Firefox / Android untested. Owner decision applied; the gate and the disabled-with-reason UI must be right on every device. |
| 5 | UI-031, UI-041, EN-001, EN-015 | Only tiny / base / small have been run in a browser; medium (517 MB), turbo (564 MB), large-v3 (980 MB q4f16) and distil are untested, and long-audio memory on phones (OPFS spill not implemented) decides which presets a device may offer. Gating must be visible and honest, never a silent swap. |
| 6 | UI-065, UI-052, UI-090, UI-078, UI-012 / PL-005 | Transcripts, the source Blob (player, re-run), drafts and the "Delete my data" footer must survive reloads and a possible full-page navigation to an isolated transcriber document; today a cookie session does this for free. Safari eviction and the health-gated footer are concrete traps. |
| 7 | UI-086 / EN-089 | PDF through the browser print dialog: verified in Chrome only; Firefox / Safari `@page` margin boxes, Devanagari copy-paste fidelity and the file name are open; the generator alternative costs 1-3 MB of fonts. |
| 8 | PL-034, PL-037, PL-038, PL-069 | Deploying the raw Angular build gives soft-404s, flips canonical URLs to `/faq/` and serves the home page for `/jobs/<id>`; the ORT WebGPU wasm (27 MiB) exceeds the 25 MiB Pages limit. All fixable by a post-build step, `404.html`, two rewrites and a pinned CDN URL, but each is a launch blocker if missed and none has run on a real Cloudflare deployment yet. |
| 9 | UI-052 + spike/adsense.md 12.1, EN-101 | Ads cannot load on a COOP/COEP-isolated document (measured `ERR_BLOCKED_BY_RESPONSE`), while multi-threaded WASM needs isolation. The document split (ad pages vs transcriber) is an architecture decision that touches navigation, persistence and the engine's thread count. |
| 10 | UI-120, UI-123, PL-014, UI-027 / UI-028 | Every mode-dependent sentence (privacy, FAQ, terms, data note, limits) is currently false for the browser build and pinned by tests; the privacy page must also carry the AdSense disclosures and no ad loader. Cheap individually, but a silent omission here is a policy or trust failure rather than a bug. |

## 6. Sources and limits

* Classes and risks are taken from the three inventories and adjusted only where a spike measured the item
  (EN-010/011/012 from `spike/audio.md`, EN-020/021 from `spike/vad.md`, EN-051..EN-055 from `spike/qwen.md` Appendix A,
  EN-050/EN-056/UI-037 from the Qwen decision, PL-034/037/038/069 and UI-136 from `spike/hosting.md`).
* Nothing in this file is a new measurement; where a source says "not measured" (phones, Safari, Firefox, Hindi
  audio, real Cloudflare deployment, medium and larger Whisper models in a browser) the row keeps the uncertainty.
* `spike/asr.md` and `spike/indicxlit.md` were not available; rows EN-030..EN-039, EN-062, EN-063 and UI-031/UI-041
  should be re-checked against them when they are committed.
