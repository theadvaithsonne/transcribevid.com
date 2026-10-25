# Frontend feature-parity inventory (track: inventory-ui)

Scope: every user-visible feature and behaviour of the Angular app in `frontend/src/app` (branch `feature/in-browser`, which
contains the Hinglish / IndicXlit / Qwen / link-download work), the server contract each one rides on, and the strategy that
keeps it when transcription moves into the browser. Owner rule: **nothing is dropped silently**; where a feature cannot run on a
static host the row says so, gives evidence, and names the closest alternative.

Method: all 33 spec files and every source file under `src/app` were read (templates, components, services, shared, features),
plus `src/index.html`, `public/*`, `angular.json`, and the backend contract that the UI depends on (`backend/app/main.py`,
`schemas.py`, `formats.py`, `jobs.py`, `engine.py` model/language catalog, `downloads_api.py`, `DOWNLOADS.md`, `pdf.py` header).
Spec `describe`/`it` titles (933 literal `it(` calls) were skimmed to catch behaviours not obvious from the code. Paths below are
relative to `frontend/src/app` unless they start with `backend/` or `public/`.

## How to read the tables

* **ID** `UI-nnn`. **Where** = `file:line` (start of the relevant code). **Server dependency** = endpoint / field / SSE event /
  cookie / health flag the feature uses today ("none" = pure client code).
* **Browser strategy** codes
  * `DIRECT` - works unchanged in the static build.
  * `ADAPT` - same UI, different data source or wording (usually behind the `ApiService` / `JobsStore` facade; see "Architecture
    assumption").
  * `NEW:EC-nn` - needs a new engine / platform capability from the capability list in section 13 (other tracks build it).
  * `OPTIONAL-SERVER` - cannot run in a browser; stays available only when a service URL is configured, with a clear message
    otherwise (never removed silently).
  * `KEEP-SERVER-ONLY` - exists only for the self-hosted / server transport and is hidden in the static build.
* **Risk**: `HIGH` = cannot be kept without new engine capability or an architecture change, or has evidence of a platform
  limit, or a likely visible regression; `MED` = needs real rework plus new tests, solvable; `LOW` = direct or trivial.

**Architecture assumption** (from `docs/in-browser/PROGRESS.md`): two transports behind the existing `ApiService` / `JobsStore`
facade - `server` (today's HTTP + SSE, unchanged) and `browser` (new). Components keep calling the facade. All "ADAPT" rows
assume this. Where a row says "remove in browser mode" the server transport keeps the old behaviour.

## Summary

140 features/behaviours inventoried (UI-001..UI-140): 24 HIGH, 47 MED, 69 LOW. Sections 12-14 list the 23 server assumptions
(S-01..S-23), the 19 engine/platform capabilities the UI needs (EC-01..EC-19) and the `JobOptions` matrix.

HIGH-risk items and why:

| ID | Why HIGH |
|---|---|
| UI-027 | upload size/duration limits have no meaning without an upload; replacement is a device-memory guard that does not exist yet |
| UI-031, UI-041 | the four presets and nine catalogued models (incl. `large-v3` 3.1 GB, `distil-large-v3`, `tiny`, `medium`) must map to browser builds or be gated visibly per device |
| UI-036, UI-038, UI-091 | Hinglish / IndicXlit / basic fallback / "Apply style only" need the conversion pipeline and saved `original_text` in the browser |
| UI-037 | Qwen3-ASR route in a browser is unproven; otherwise an explicit optional-server entry |
| UI-042, UI-043 | beam search, temperature fallback, VAD, clean-up, previous-text context must be rebuilt or confirmed in JS |
| UI-101, UI-102, UI-076 | per-word probability, segment confidence and review reasons drive underlines, warning marks and review prompts; plan section 8 says Transformers.js lacks word confidence |
| UI-052 | the File/ID hand-off and router state break if the transcriber becomes a full page load (COOP/COEP); PROGRESS.md decided against isolation |
| UI-056 | model-download progress UI does not exist today and is mandatory for a 75 MB - 3 GB first visit |
| UI-058..UI-060, UI-064 | link download cannot run in a browser (measured: no CORS headers on YouTube / Instagram); optional server with explicit disabled state |
| UI-065 | transcripts, player and re-run must survive reload: needs IndexedDB/OPFS persistence of segments and source Blob |
| UI-070 | cancel must stop the decode loop and keep partial text |
| UI-078 | player for non-browser-playable containers needs a PCM-derived preview |
| UI-086 | PDF with Indic / Arabic / CJK via print stylesheet is a different UX; needs tests |
| UI-090 | re-transcribe needs the stored source and the merged stored options |
| UI-120 | privacy policy statements (no advertising, no third-party scripts, uploaded to our server) become false |

---

## 1. App shell (`app.ts`, `app.html`, `app.scss`)

| ID | Feature | Where | Server dependency | Browser strategy | Risk |
|---|---|---|---|---|---|
| UI-001 | Skip link "Skip to main content": moves focus to `#main` itself (a plain `#fragment` would hit the `<base href>`) | app.html:1, app.ts:182 | none | DIRECT | LOW |
| UI-002 | Header brand: logo + wordmark + tagline "Video to text, accurately.", links home, aria-label `<brand> home` | app.html:62-68, shared/logo.ts, core/site.service.ts:13 | `health.brand.name` (falls back to `DEFAULT_BRAND`) | ADAPT: brand from a static config constant (no `/api/health`) | LOW |
| UI-003 | Main nav tabs Transcribe / How it works / FAQ with active state (`Transcribe` exact-match only on `/`) | app.html:70-73 | none | DIRECT | LOW |
| UI-004 | Logs tab, shown only when the server says logs exist; mobile sheet has the same link | app.html:74-76, 167-169; site.service.ts:77 | `health.logs_enabled` | ADAPT: browser-log page (UI-124..UI-128) always available or hidden behind a dev flag; plan says "browser logs only" | LOW |
| UI-005 | "N videos transcribed" counter pill (header, also in mobile sheet); hidden until the server answered, hidden for 0 on public, shows "0" + tooltip on a non-counting copy; singular/plural, thousands separators, one `role=img` with full aria-label; refreshed every 60 s while tab visible and 2 s after one of the visitor's jobs finishes | app.html:51-58, 79-83, 171-175; core/stats.service.ts:15-148 | `GET /api/stats` -> `{transcribed, counting}` (cached `max-age=30`); `Cache-Control: no-cache` on a fresh read | NEW:EC-17 (Cloudflare Worker + KV, optional). Without a Worker URL the pill stays hidden (existing "unknown" path); the client never fakes a number | MED |
| UI-006 | "Transcripts" popover (desktop): button with count badge, pulsing dot while something runs, `role=dialog`, focus moves to first row on open and back to button on Escape, closes on outside click / Tab-out / navigation, only offered when the session has >= 1 job | app.html:85-104; app.ts:35-52, 119-168 | list of jobs from `GET /api/jobs` (JobsStore) | ADAPT: same component, jobs from the local store | LOW |
| UI-007 | Job rows in popover and sheet: status dot, name (title attr = filename), status text (Queued / Transcribing NN% / Starting... / Failed / Cancelled / duration), "N min ago" when done, ETA while running, progress bar (indeterminate while queued or not yet transcribing) | app.html:4-35; app.ts:103-116; core/format.ts:21-33 | `JobSummary.status/phase/progress/eta_seconds/finished_at/created_at/duration/title/filename` | ADAPT: same fields produced by the browser engine (EC-01, EC-02) | MED |
| UI-008 | Per-row delete / cancel button (running -> "Cancel", else "Delete"), each asks `confirm()`; delete leaves the page if that transcript is open, cancel stays; 409 / failure -> toast + list refresh | app.html:25; app.ts:212-237 | `POST /api/jobs/:id/cancel`, `DELETE /api/jobs/:id` (409 "Cancel the running job first.") | ADAPT: local `cancel(id)` (EC-04) and delete (EC-11) | MED |
| UI-009 | Mobile menu sheet: hamburger toggle, scrim, `role=dialog`, focus first link, Escape/scrim/navigation close, mutually exclusive with the popover, holds tabs + counter + "Your transcripts" list + data footer | app.html:117-121, 160-180; app.ts:132-154 | none | DIRECT | LOW |
| UI-010 | Data note under the list: public -> "Kept only for this session, then deleted automatically."; local -> "Session only - nothing is saved."; full sentence is the tooltip; older servers without session info show neither note nor button | app.html:38-48; app.ts:55-70 | `health.public`, `health.persistent`, `health.session_idle_minutes` | ADAPT: new third mode `browser` with new wording ("stored on this device only; never uploaded") - section 11 | MED |
| UI-011 | "Session time left: about N min" line | app.html:42-44; core/session.service.ts:29-32 | `GET /api/session` -> `expires_in_seconds` (polled 60 s) | REMOVE in browser mode (nothing expires server-side); replaced by nothing or a "saved on this device" note. Server transport keeps it | LOW |
| UI-012 | "Delete my data now": confirm dialog, disable while running, wipes every job + media, resets session service, clears store, closes menus, navigates `/`, success toast "Your transcripts and files were removed from the server." (text must change), failure -> server message + refresh | app.html:45; app.ts:191-210 | `DELETE /api/session` (204); session cookie | ADAPT: clear the local job store (EC-11) and revoke object URLs; plan section 6 adds an option to also delete the cached model (EC-09). Toast wording must say "from this device" | MED |
| UI-013 | Light/dark theme switch, icon per theme, label, `theme-switching` class on `<html>` for two frames to stop colour fades, persisted in `localStorage['vt-theme']`, applied before first paint by an inline script, updates `<meta theme-color>` | app.ts:96-101; core/theme.service.ts:10-43; src/index.html (inline script) | none | DIRECT | LOW |
| UI-014 | Banner "Can't reach the server ... Retrying..." (+ dev hint "python run.py" on local / localhost) | app.html:125-131; core/jobs.store.ts:21, 106-110; site.service.ts:122-131 | failure of `GET /api/jobs` (status 0 / 5xx) or `GET /api/health` | REMOVE in browser mode (no server). Replace with an "offline" notice only where the network matters: first model download and link downloader (UI-056, UI-058). Server transport unchanged | MED |
| UI-015 | Session banners: "Your session has ended and its data was deleted..." (dismissible, hidden on job page) and "Your session ends in N min. Export what you need." (< 5 min left) | app.html:132-139; core/session.service.ts:9-11, 34-37; app.ts:77, 87 | `GET /api/session` polling, session id change, health `session_id` change (server restart) | REMOVE in browser mode. See also UI-065 (job page "session ended" state) | LOW |
| UI-016 | Footer: (c) year + brand, version only on a non-public copy, Privacy / Terms, mailto contact only if the server has one, second row "Free tools:" linking all six keyword pages | app.html:143-158 | `health.version`, `health.brand.contact_email`, `health.public` | ADAPT: static config; version from build constant | LOW |
| UI-017 | Toast system: success / info / warning / error, durations 4 / 5 / 7 / 9 s, max 3 on screen, same toast re-arms instead of stacking, pause on hover/focus, close button, errors are `role=alert`, others polite; bottom-left on desktop, over header on phones; `JobsStore.notify/toast` shim | shared/toasts.ts; core/toast.service.ts:21-117; core/jobs.store.ts:25-29, 90-97 | none | DIRECT | LOW |
| UI-018 | Window-level guard: a file dragged anywhere is `preventDefault`ed so the tab never navigates to it; other drags (text into inputs) untouched; listener removed on destroy | app.ts:170-179 | none | DIRECT | LOW |
| UI-019 | Navigation closes popover + sheet; `onJobPage` flag set from `NavigationEnd` | app.ts:79-90 | none | DIRECT | LOW |
| UI-020 | Prerender safety: everything touching network / timers / DOM gated by `IS_BROWSER`; `ASSUME_PUBLIC` makes the first client render equal the prerendered HTML; `data-prerendered` attribute | core/platform.ts:9-33; app.config.server.ts:13 | none (build-time) | ADAPT: `ASSUME_PUBLIC` is public-site wording; in the static build the equivalent is "assume browser mode" so prerendered HTML already says "never leaves your device" | MED |

## 2. Upload page (`features/upload/upload.ts`, `upload.html`)

| ID | Feature | Where | Server dependency | Browser strategy | Risk |
|---|---|---|---|---|---|
| UI-021 | Page title (h1 switches "Transcribe a video or audio file" / "Download a video from a link"), trust chips Free / Unlimited / No login | upload.html:1-9 | none | DIRECT (all three claims stay true; "Unlimited" becomes literally true) | LOW |
| UI-022 | Tool picker "Transcribe a file" / "Download from link", `aria-pressed`; link tab disabled while uploading / recording / waiting for mic permission | upload.html:11-14; upload.ts:48 | none | DIRECT; the link tab itself is UI-058..UI-064 | LOW |
| UI-023 | Drop zone: hidden `<input type=file multiple accept="video/*,audio/*,.mkv,.mov,.avi,.m4a,.flac,.opus,.wmv,.ts">`, disabled while uploading | upload.html:22-23 | none | DIRECT. Decode support per container is an engine question (EC-10): mkv/avi/wmv/flv/ts/3gp are not decodable by `decodeAudioData` everywhere (plan section 4.4 -> ffmpeg.wasm fallback ~30 MB) | MED |
| UI-024 | Multi-file selection: list with name, size (`fmtBytes`), per-file remove button with aria-label; "Add another file" label once non-empty | upload.html:24-53; upload.ts:240-294 | none | DIRECT | LOW |
| UI-025 | Whole-page drop: `dragover` anywhere shows "Drop to add your file" overlay (300 ms hysteresis, ignores text drags, ignored while uploading), `drop` anywhere adds files; element-level drop stops propagation so files are not added twice | upload.html:225-234; upload.ts:182-200, 246-252 | none | DIRECT | LOW |
| UI-026 | File validation: video/audio MIME or extension regex (`mp4 mkv mov avi webm mp3 wav m4a aac flac ogg opus wmv flv m4v 3gp ts mts`); non-media skipped with toast (some good) or inline error (all bad); duplicates (name+size+mtime) collapsed with an info toast | upload.ts:17, 254-289 | none | DIRECT. Gap: a 0-byte file is not rejected here (server rejected "The uploaded file is empty."; only `tool-drop` checks size 0) - browser engine must raise a clear error | LOW |
| UI-027 | Size limit check `oversizeMessage`: refuses a file over `max_upload_mb` (500 MB public / 4096 MB local) before sending, with a different message for public vs local ("set VT_MAX_UPLOAD_MB") | upload.ts:297-304, 373-380 | `health.max_upload_mb` | ADAPT: there is no upload, so no server cap. Replace with a device guard (EC-15): soft warning + hard refusal only where decoding would exceed memory (plan: phones/iOS). Message wording is new; tests `upload.spec.ts:337-394` change | HIGH |
| UI-028 | Duration limit (60 min public) - not checked in the UI; the server fails the job with an error after probing (`engine.py:455`). The limit is only announced ("Up to 500 MB and 60 minutes per file.") | site.service.ts:91-113; upload.html:52 | `health.max_duration_min` | ADAPT: no announced cap; warn by device class and duration after probe (EC-15); engine error text for out-of-memory | MED |
| UI-029 | Drop hint text uses `site.limitsText()` or "Video or audio, several at once is fine." | upload.html:52 | `health.max_*` | ADAPT: drop the limits sentence in browser mode; show device hint ("Long videos: use a computer") from EC-15 | LOW |
| UI-030 | Microphone recording: button toggles Record / "Stop recording - mm:ss" (timer), `MediaRecorder` with 1 s chunks, builds a `File` named `Recording YYYY-MM-DD HH-mm.<ext>` (`ogg`/`m4a`/`webm` by MIME), adds it to the list; permission prompt state ("Waiting for microphone permission..."), second click ignored while prompt open, denied -> toast "No microphone", unsupported -> inline error, empty -> "Nothing was recorded.", teardown on leave releases tracks and detaches handlers | upload.html:54-66; upload.ts:75-83, 129, 210-237, 307-367 | none | DIRECT for capture. Decode of `audio/webm;codecs=opus` and Safari `audio/mp4` by the engine (EC-10) must be tested; long recordings should not be held twice in memory | MED |
| UI-031 | Quality presets (radio group "Quality"): Fastest=`base`, Standard=`small` (Recommended), High accuracy=`large-v3-turbo`, Best accuracy=`large-v3`; each with speed word, tooltip, one help line under the group for the picked choice | upload.html:105-122; upload.ts:19-31, 89-107 | none (ids go into `JobOptions.model`) | NEW:EC-09 + EC-15: the same four ids must map to browser model builds (ONNX/WebGPU); large-v3 (3.1 GB CT2) is unrealistic on most devices, so the preset must be gated or re-mapped per device with an honest note, never silently swapped | HIGH |
| UI-032 | First-use download note: "First time only: downloads 1.6 GB (needs internet)" in the help line and per option in the advanced select / re-run form; absent once `downloaded` | upload.ts:157-178; upload.html:183; job.html:98 | `GET /api/models` -> `size_mb`, `downloaded` | NEW:EC-09: sizes of the browser model files (not the CT2 numbers in `engine.py:34-52`), `downloaded` = Cache API lookup; plus a live download progress UI (UI-056) | MED |
| UI-033 | Presets greyed / hidden: `available(id)` uses `/api/models` list + `allowed_models`; `ensureAllowedModel()` replaces a remembered disallowed model with Standard or the first allowed; if no preset is allowed the advanced section opens by itself | upload.ts:110-165; site.service.ts:81, 133 | `health.allowed_models`, `GET /api/models` | ADAPT: `allowed_models` becomes "models this device can run" from EC-15 (same plumbing, new source) | MED |
| UI-034 | Language select: "Detect automatically" + 61 languages | upload.html:124-133 | `GET /api/languages` (`engine.LANGUAGES`, 61 codes - counted from `backend/app/engine.py`) | ADAPT: static JSON (EC-16). Whisper-in-browser must accept the same codes | LOW |
| UI-035 | "More options" disclosure with `aria-expanded` / `aria-controls`, chevron | upload.html:134-139, 149-150 | none | DIRECT | LOW |
| UI-036 | Transcript style select: Hinglish (Roman Hindi) [default] / Original script; disabled when Output = translate; explanatory hint; persisted | upload.html:141-148; upload.ts:483-491 | `JobOptions.output_script` | NEW:EC-07 (Hinglish pipeline in the engine) | HIGH |
| UI-037 | Recognition engine select: Whisper / "Qwen3 ASR (experimental)" (option only when `/api/models` lists a qwen model); changing engine resets model to the first of that engine and forces Output=transcribe; hint "Qwen uses chunk timestamps and does not provide word confidence" | upload.html:151-158; upload.ts:116-121 | `JobOptions.engine`, `ModelInfo.engine`, `GET /api/models` | NEW:EC-08. If no browser route exists for Qwen3-ASR 0.6B/1.7B the option must stay as `OPTIONAL-SERVER` (server transport) with an explanatory disabled entry; that decision belongs to the engine track and must be documented, not silent | HIGH |
| UI-038 | Hinglish conversion select: Automatic (IndicXlit when installed) / IndicXlit (trained model) / Basic phonetic spelling | upload.html:159-166 | `JobOptions.romanizer` | NEW:EC-07. Labels "when installed" -> "when downloaded"; IndicXlit ported to browser (M1b) or the option shows its fallback honestly | HIGH |
| UI-039 | Output select: Transcribe (same language) / Translate to English (disabled for Qwen) | upload.html:167-173 | `JobOptions.task` (`translate`; server rejects translate+qwen 422) | NEW:EC-10 (Whisper translate task in the browser path) | MED |
| UI-040 | Vocabulary hint textarea (<= 1000 chars) "Names, brands and jargon"; **never persisted** to storage (privacy) but still sent | upload.html:174-178; upload.ts:483-501 | `JobOptions.prompt` | NEW:EC-10 (prompt conditioning / `initial_prompt`; Transformers.js support must be verified) | MED |
| UI-041 | Advanced model select listing every model of the chosen engine with label, note and "(N GB download)" - includes `tiny`, `medium`, `distil-large-v3` which have no preset | upload.html:179-189; upload.ts:112-114 | `GET /api/models` (9 entries: tiny, base, small, medium, large-v3-turbo, large-v3, distil-large-v3, qwen3-asr-0.6b, qwen3-asr-1.7b) | NEW:EC-09 (browser catalog with the same ids, labels, notes). `distil-large-v3` ("English only") needs a browser build or an explicit "not available here" | HIGH |
| UI-042 | Search depth slider 1-10 (beam size) with live value | upload.html:190-194 | `JobOptions.beam_size` (1-10) | NEW:EC-10 (beam search; Transformers.js `num_beams` - plan section 8 says it must be rebuilt or confirmed) | HIGH |
| UI-043 | Four switches: Enhance audio (filter rumble/hiss, normalise), Skip silence & music (VAD), Word-level timing, Use previous text as context | upload.html:195-200 | `JobOptions.enhance_audio`, `vad`, `word_timestamps`, `condition_on_previous` | NEW:EC-10 (clean-up chain, Silero VAD), NEW:EC-05 (word timing), NEW:EC-10 (previous-text conditioning, loop guard) | HIGH |
| UI-044 | Remembered options in `sessionStorage['vt-options']`: everything except `prompt`; output_script forced to `hinglish` unless explicitly `original`; garbage / old versions fall back to defaults (`DEFAULT_OPTIONS`: engine whisper, romanizer auto, model small, language null, task transcribe, hinglish, beam 5, vad+enhance+word timing on, condition_on_previous off) | upload.ts:16, 483-501; core/models.ts:178-191 | none | DIRECT | LOW |
| UI-045 | Submit button states: "Choose a file first" / "Transcribe" / "Transcribe N files" / "Uploading..." (disabled while uploading or recording) | upload.html:205-214 | none | ADAPT: label "Uploading..." becomes "Preparing..." (no upload in browser mode) | LOW |
| UI-046 | Start: validates sizes again, `ensureAllowedModel()`, persists options, scrolls card into view (smooth unless reduced-motion), builds `JobOptions` with `language: opts.language || null`, creates jobs **sequentially** (`concatMap`), logs to LogService | upload.ts:370-425 | `POST /api/jobs` (raw octet-stream body, `filename`+`options` query, 415 if wrong content-type, 429 rate limit, 413, 422 validation, 503/429 Busy, 507 disk) | ADAPT: `createJob(file, options)` in the browser transport creates a local job record (EC-11), enqueues it (EC-01) and returns immediately; multi-file queue is sequential in-browser (one model in memory at a time) | MED |
| UI-047 | Upload progress card: "Uploading <name> NN%", bar (`scaleX`), "X of Y", MB/s, "file i of n", "Keep this page open until the upload is done."; success state "Upload complete / Opening your transcript..." for 1.4 s then navigate | upload.html:73-98; upload.ts:60-67, 406-440 | `HttpEventType.UploadProgress` (api.service.ts:64-85) | ADAPT: there is no network upload. Show a short "Reading <file>" state (blob URL + persist, EC-11) or navigate at once; keep the "keep this page open" message for the *transcribing* phase on phones (EC-15 wake lock). The speed/bytes UI is deleted in browser mode | MED |
| UI-048 | Leaving the page mid-upload keeps the upload going and still refreshes the history; navigation / state writes suppressed after destroy (`destroyed` flag) | upload.ts:69-71, 394-396, 430-447 | upload is an in-flight XHR | ADAPT: no upload; engine job continues in the worker (tab close: see UI-049) | LOW |
| UI-049 | `beforeunload` confirmation while an upload is running (not after `uploadDone`) | upload.ts:202-208 | upload in flight | ADAPT: move the guard to "a transcription is running" (any page) because closing the tab now loses the work unless it is persisted (EC-11) | MED |
| UI-050 | Upload error mapping `describe(e)`: status 0 -> "Cannot reach the server" (dev vs public wording), server `detail`, fallbacks for 413 / 429 / 503 / 507 / 5xx | upload.ts:464-481 | HTTP status + FastAPI `detail` | ADAPT: replace by engine-start errors (unsupported or undecodable file, not enough memory, WebGPU lost, model download failed/offline). Keep `errorDetail()` shape so toasts/inline text still work | MED |
| UI-051 | Partial failure across several files: files already queued are removed from the list, error says "N of M file(s) were already queued; the other K are still in the list, press Transcribe to retry." | upload.ts:441-460 | sequential `POST /api/jobs` | ADAPT: local job creation rarely fails (storage quota, EC-11); keep the same logic for the quota-exceeded case | LOW |
| UI-052 | After success the app opens `/jobs/<first id>` with `history.state.justUploaded = N` so the job page can toast once | upload.ts:438 | none | ADAPT: unchanged route; see UI-072. **If the transcriber page must be a full page load for COOP/COEP (plan section 7), router state, `PendingFileService` and in-memory jobs are lost - the File must travel through IndexedDB/OPFS.** `PROGRESS.md` decided "no cross-origin isolation requirement", which removes this problem; record the dependency | HIGH |
| UI-053 | Note under the button: public "Your files are deleted automatically. Privacy"; local "Nothing is saved. Export what you need." | upload.html:215-219 | `health.public` | ADAPT: browser mode: "Your file never leaves your device. Privacy" (+ tests `upload.spec.ts:423-476`) | LOW |
| UI-054 | Hand-off from keyword pages: `PendingFileService.take()` in the constructor adds the waiting file once; later visits start empty; the file is validated like any other and **not** auto-started | upload.ts:133-135; core/pending-file.service.ts | none (in-memory signal) | DIRECT inside one SPA session; see UI-052 for the page-load caveat | LOW |
| UI-055 | Allowed-model effect re-runs when `allowedModels` changes (health arrives late) | upload.ts:137-144 | `health.allowed_models` | ADAPT (device capability probe is async too) | LOW |
| UI-056 | **Not present today, required by browser mode**: model download progress (bytes / %, resumable, cancellable), "stay on this page" hint, persistent-storage request, offline error. Today the phase text is only "Getting the speech engine ready..." (`job.ts:32-36`; `core/format.ts:35` `PHASE_LABEL` "Loading model... (first use downloads it)" is unused by app code, only its spec imports it) | job.ts:32-36 | none today | NEW:EC-02 + EC-09 (progress events with `loaded/total`) | HIGH |
| UI-057 | **Not present today, required by plan section 4**: weak-device warning ("long video, use a computer"), keep-screen-awake, memory guard on phones | - | none | NEW:EC-15 | MED |

## 3. Link download tab (`features/download/downloader.*`)

> **Removed by owner decision (2026-10-25).** AdSense forbids pages that enable downloading streaming video against the
> provider's terms (`spike/adsense.md` section 3), so the owner chose to drop this feature rather than risk the whole
> site's ads. The code was removed by reverting commit `3d8d3dc`. UI-022 and UI-058..UI-064 below are kept as the record
> of what existed; their status is **REMOVED**, not lost.

| ID | Feature | Where | Server dependency | Browser strategy | Risk |
|---|---|---|---|---|---|
| UI-058 | "Paste a link. Save the video." form: URL input (`type=url`, <= 2048), quality select (360 / 720 / 1080), Download button, hint "Public single videos only..." | downloader.html:1-20; downloader.ts:38-83 | `POST /api/downloads {url, quality}` (yt-dlp worker, session cookie, 429 rate limit) | OPTIONAL-SERVER (see evidence below) | HIGH |
| UI-059 | Job status panel: phases queued / extracting / downloading / processing / done / cancelled with plain labels, video title, indeterminate `<progress>`, error `alert` | downloader.ts:48-55; downloader.html:21-35 | `GET /api/downloads/:id` polled every 1.2 s | OPTIONAL-SERVER | HIGH |
| UI-060 | Cancel (waits for the backend, never auto-saves a late completion), "Cancelling..." state | downloader.ts:85-94; spec 43 | `POST /api/downloads/:id/cancel` | OPTIONAL-SERVER | HIGH |
| UI-061 | Auto-save once (hidden `<a download>` click) + "Save video" fallback link + file name / size line | downloader.ts:108-120; downloader.html:29-33 | `GET /api/downloads/:id/file` (MP4 attachment, `no-store`) | OPTIONAL-SERVER; with a service URL the browser can stream to a Blob and also **hand the file straight to the transcriber** (closest improvement: "Download and transcribe") | MED |
| UI-062 | "Clear download" (deletes the record + file), restore on page open (`GET /api/downloads`, latest active or newest), 404 on poll -> "This download session has ended" | downloader.ts:59-70, 96-104, 124-137 | `GET/DELETE /api/downloads*` | OPTIONAL-SERVER | MED |
| UI-063 | Privacy line "Downloaded files are temporary and are removed when your session ends." | downloader.html:37 | none | ADAPT wording (service URL configured: say where the file goes; otherwise the tab shows the not-available state) | LOW |
| UI-064 | **Disabled state required in the static build**: when no downloader service URL is configured, the tab must explain "needs a server; use yt-dlp / the original file" instead of failing, and the tool-page FAQ lines that deny link support must be reconciled (UI-115) | - | - | OPTIONAL-SERVER | HIGH |

**Evidence that link download cannot run purely in the browser** (measured 2026-10-25, raw output):

```
$ curl -s -m 20 -D - -o /dev/null -H "Origin: https://transcribevid.com" "https://www.youtube.com/watch?v=dQw4w9WgXcQ" | grep -iE "^HTTP|access-control|cross-origin|x-frame"
HTTP/1.1 200 OK
X-Frame-Options: SAMEORIGIN
Cross-Origin-Opener-Policy: same-origin-allow-popups; report-to="youtube_main"
$ ... "https://www.instagram.com/reel/C0000000000/"
HTTP/1.1 200 OK
X-Frame-Options: DENY
cross-origin-resource-policy: same-origin
cross-origin-opener-policy: same-origin-allow-popups
$ ... "https://www.youtube.com/youtubei/v1/player"
HTTP/1.1 405 Method Not Allowed
```

Neither origin returns `Access-Control-Allow-Origin`, so a `fetch` from `transcribevid.com` is blocked by CORS; Instagram also sends
`cross-origin-resource-policy: same-origin`. The current implementation also needs a JS runtime for the YouTube signature solver, a
spawned `yt-dlp` process and ffmpeg to merge streams (`backend/DOWNLOADS.md`, `backend/app/download_worker.py:49`). Closest
alternative: keep the tab as an `OPTIONAL-SERVER` feature backed by a user-configured downloader service URL (self-host the existing
FastAPI download router, or a separately run tiny service); on the static site without it, show the explanation above plus a copy of
the equivalent `yt-dlp` command, and offer "paste a direct media URL" only if that host sends CORS headers (not guaranteed).

## 4. Transcript (job) page - states, progress, live updates (`features/job/job.ts`, `job.html`)

| ID | Feature | Where | Server dependency | Browser strategy | Risk |
|---|---|---|---|---|---|
| UI-065 | Page states: Loading..., Transcript not found, "Your session has ended" (public), "The server is busy", "Cannot reach the server" | job.html:1-19, 199-215; job.ts:300-406 | `GET /api/jobs/:id` (404 / 429 / 503 / 0 / 5xx), `GET /api/session`, `GET /api/health` | ADAPT: lookup in the local store (EC-11). Not found remains (deleted, another browser, storage cleared). Remove busy / unreachable / session-ended in browser mode. **A page reload must still show the transcript, as it does today (cookie session survives F5) - needs persistence** | HIGH |
| UI-066 | Live follow of a running job: `EventSource /api/jobs/:id/events?since=N` with events `job` (summary), `segments` (new rows), `end`; segments merged by id (reconnect replays ignored); on `end` reload the final job + refresh list + models | api.service.ts:122-140; job.ts:415-436, 450-454 | SSE `job` / `segments` / `end` | ADAPT: in-process observable from the worker (EC-02, EC-03), same `{type,data}` shape so `JobPage.watch()` is unchanged; no reconnect logic needed | MED |
| UI-067 | Load/retry loops: busy -> retry 5 s (toast once), transient (0/5xx) -> retry 3 s keeping the page, stream error -> retry 2 s, stale responses for a previously opened job ignored via `current(id)` | job.ts:336-356, 408-413, 434 | polling / HTTP errors | ADAPT: keep `current(id)` guards, drop the network retry timers in browser mode | LOW |
| UI-068 | Progress card: status line ("Waiting in line..." / Preparing the audio... / Getting the speech engine ready... / Transcribing...), "NN% done" (floored so 99.6 never reads 100) + "N min left" ETA, bar (`scaleX`, indeterminate when queued or not transcribing), Cancel button | job.html:148-154; job.ts:231-245; core/format.ts:21-25 | `JobSummary.status/phase/progress/eta_seconds` (ETA = elapsed/progress after 3 % and 3 s) | NEW:EC-02. ETA formula must be ported; on WASM the first 3 % can be slow, so ETA stays hidden longer (unchanged logic) | MED |
| UI-069 | "Waiting in line..." queue state (server single worker + other visitors) | job.ts:235; app.ts:106 | `status = queued` | ADAPT: queue exists only between the visitor's own files; copy changes to "Waiting for your previous file..." | LOW |
| UI-070 | Cancel: `confirm('Stop this transcription? The text found so far is kept.')`, button shows "Cancelling..." until the backend reports a terminal state, toasts "Cancelled" / "Cancellation requested" / "Already finished" | job.html:151; job.ts:762-785, 363-368 | `POST /api/jobs/:id/cancel` (sets `cancel_requested`, worker aborts, status `cancelled`, partial text kept) | NEW:EC-04 (abort the decode loop between windows; terminate worker as a last resort; keep partial segments) | HIGH |
| UI-071 | Failed card "Transcription failed" with `job.error` and "Try again" (re-run with the same options); Cancelled card with "Start again" and text-below hint | job.html:156-173 | `JobSummary.error`, `POST /api/jobs/:id/rerun` | ADAPT: engine error strings (EC-01) | LOW |
| UI-072 | Toasts on status change: "Upload complete ... Transcription has started" (once, from `history.state.justUploaded`; F5 does not repeat; multi-file variant points to Transcripts menu), "Transcript ready" when a job that was running on this page finishes (not for already-finished or failed ones) | job.ts:156, 359-385, 438-448 | none | DIRECT (wording "Upload complete" -> "File added"/"Started") | LOW |
| UI-073 | Page title = transcript name, `noindex`; follows renames | job.ts:323, 652-668; core/title.service.ts | none | DIRECT | LOW |
| UI-074 | Switching/leaving cancels the in-flight request, the stream and the retry timer; results of actions on job A are never applied to job B | job.ts:259-273, 283-293 | request lifecycles | DIRECT (guards stay) | LOW |
| UI-075 | Facts line: language name (or code) [+ "-> English" when translated and source != en], duration, word count (singular/plural), "NN% model confidence"; filename as tooltip; whole line hidden when nothing is known. **Only `word_count` and `avg_confidence` of `Stats` are shown** - `keywords`, `words_per_minute`, `speech_seconds`, `low_confidence_segments` are in the model but never displayed (spec: "no list of frequent terms ... any more") | job.html:35-41; job.ts:211-230; core/models.ts:48-56 | `Job.language`, `duration`, `Stats` from `formats.compute_stats` (recomputed after every edit/restyle) | NEW:EC-12 (port `compute_stats`; `avg_confidence` needs segment confidence, EC-06) | MED |
| UI-076 | Review card "Review this transcript" + button "Review language and quality": triggers - no speech; any non-edited segment with `review_reasons`; `avg_confidence < 0.6`; auto-detected language with `language_probability < 0.8`; wording "The confidence score is not an accuracy percentage" | job.html:138-146; job.ts:194-209 | `Segment.review_reasons`, `Stats.avg_confidence`, `Job.language_probability`, `options.language` | NEW:EC-06 (repetition / uncertain-boundary reasons from the guards, language probability from detection). Without them only the first and third trigger would fire - a silent loss | HIGH |
| UI-077 | Hinglish spelling warning card (first `Segment.conversion_warning`) and Qwen note ("approximate chunk timestamps. Word timing and confidence are unavailable.") | job.html:132-137; job.ts:187 | `Segment.conversion_warning`, `options.engine` | NEW:EC-07, EC-08 | MED |
| UI-078 | Media player: `<video>` or `<audio>` with controls, `preload=metadata`, source `job.media_url` (`/api/jobs/:id/media`, HTTP Range), shown only if `media_url` present; video vs audio layout from `media_kind`; speed select 0.75 / 1 / 1.25 / 1.5 / 2 kept in sync with the element's own rate control | job.html:177-191; job.ts:162, 192-193, 553-566 | `JobSummary.media_url`, `media_kind`; server serves original if browser-playable (`mp4 m4v webm ogv mp3 wav ogg oga m4a aac flac opus`) else an ffmpeg-made `preview.mp3` (`jobs.py:109, 546-584`) | NEW:EC-14: object URL of the persisted source Blob for playable types; for mkv/avi/wmv/flv/ts/3gp/amr/wma a preview built from the decoded PCM (WAV/MP3 encode) so the player and click-to-seek keep working. Object URL must survive reload (needs EC-11) | HIGH |
| UI-079 | Playhead tracking: `timeupdate` -> `time` signal -> `activeSeg` (binary search, 0.05 s early, kept 0.6 s after end) passed to the transcript (changes a few times a minute, not per tick) | job.ts:125, 190, html:180-182; transcript.ts:61-69 | none | DIRECT | LOW |
| UI-080 | `seek(t)`: set `currentTime`, `play()` | job.ts:554-559 | none | DIRECT | LOW |

## 5. Transcript page - actions (export, copy, rerun, rename, delete, edit saving)

| ID | Feature | Where | Server dependency | Browser strategy | Risk |
|---|---|---|---|---|---|
| UI-081 | Action bar only for `status === done`: Export menu + Copy text (only when there are segments) + More menu; "Saving..." status | job.html:44-129 | none | DIRECT | LOW |
| UI-082 | Export menu (button `aria-haspopup=menu`, bottom sheet on phones with title and Close, scrim, fits remaining viewport height, Escape closes + refocuses, outside click closes): PDF, Plain text, Text with times, SRT, VTT, Markdown, JSON - each with a hint | job.html:47-69, 127; job.ts:19-27, 485-521 | none | DIRECT | LOW |
| UI-083 | Subtitle line length select (Short 32 / Standard 42 / Long 56) -> `max_chars` for SRT/VTT only (server default `max_lines=2`, `max_dur=6`, `min_dur=0.8`) | job.html:59-65; job.ts:142, 685 | `GET /api/jobs/:id/export?format=srt\|vtt&max_chars=` (20-80), `formats.build_cues` | NEW:EC-12 (port `build_cues`, `_wrap`, SENTENCE_END / CLAUSE_END rules, even word-spread for edited segments) | MED |
| UI-084 | Download a format: fetch first (so errors are toasts, not broken files), single in-flight, double-click within 1.5 s ignored, saves with the server file name (RFC 5987 `filename*` parsed), blob URL revoked after 30 s (iOS), toast "Download started", failure toast reads the body of a blob error | job.ts:53-64, 673-713; spec 1011-1075 | `GET /api/jobs/:id/export` + `Content-Disposition: attachment; filename*=UTF-8''<title>.<ext>` | ADAPT: build the string/Blob locally; file name = sanitised title + ext (the server's `quote(title)` leaves sanitising to the browser; do it explicitly for `/ \ : * ? " < > |`) | LOW |
| UI-085 | Export content parity: `txt` = `[mm:ss] text` per line; `plain` = paragraphs (pause 1.6 s, 600 chars at sentence end); `md` = `# title`, italic meta line (language, duration, model), paragraphs with bold `[time]`; `json` = `{title, filename, language, language_probability, duration, options, stats, segments}` (indent 2, `ensure_ascii=False`) - segments carry `words`, `original_text`, `review_reasons`, etc. | backend/app/formats.py:133-192 | server-side rendering | NEW:EC-12 (pure-function port; golden-compare against Python output) | MED |
| UI-086 | PDF export "Ready to print or share": A4, real selectable text, any script (Latin/Greek/Cyrillic/Hebrew/Arabic with HarfBuzz shaping, Indic, CJK via script fallbacks), RTL detection, footer, title/meta | backend/app/pdf.py:1-60; job.ts:20 | `GET /api/jobs/:id/export?format=pdf` (fpdf2 + system fonts) | NEW:EC-13. Plan: print stylesheet + `window.print()` ("Save as PDF"), which uses the browser's own fonts/shaping. Differences to document: no direct file download, name comes from `document.title`, no print CSS exists today (`grep "@media print"` in `src` finds nothing), iOS flow differs. Must be tested with Hindi, Arabic and Chinese transcripts (headless Chrome `page.pdf`) | HIGH |
| UI-087 | Copy text: copies the `txt` format; Clipboard `ClipboardItem` with a promise (Safari gesture rule), fallback `writeText`, fallback hidden-textarea `execCommand`; toasts "Copied" / "Could not copy" | job.html:70-73; job.ts:78-93, 715-759 | `GET export?format=txt` | ADAPT: text is local and synchronous; keep the three-step fallback | LOW |
| UI-088 | "More" menu: Rename, Re-transcribe, Delete transcript (danger), Close (phone sheet) | job.html:75-86 | none | DIRECT | LOW |
| UI-089 | Rename: pencil button or double-click on the h1 opens a text box (max 200), Enter / blur saves, Escape cancels, empty name keeps the old with a warning toast, optimistic update with rollback and "Renamed" / "Not renamed" toasts; page title follows; list refreshed | job.html:24-33; job.ts:624-670 | `PATCH /api/jobs/:id {title}` | ADAPT: local store update (EC-11) | LOW |
| UI-090 | Re-transcribe form (dialog inside More): engine, quality (model list with "first use downloads N MB"), language (keeps **Auto** if the first run was auto even when detection was confident), transcript style, Start; "Back"; a *new* job is created and the old one is kept; navigates to it unless the user already left; prefilled from the job's options and not overwritten by soft refreshes | job.html:87-122; job.ts:179-186, 325-332, 787-806 | `POST /api/jobs/:id/rerun` (server copies media; merges changes onto stored options; 201) | NEW:EC-11 (the source Blob must stay available after the first run) + EC-09 (model switch). Note the form does **not** expose vocabulary, beam, VAD etc.; rerun inherits stored options | HIGH |
| UI-091 | Rerun form also has "Hinglish conversion" select and **Apply style only** button: re-converts the *saved* recognition to Hinglish / original script with the chosen romanizer without touching audio; edited lines kept; disabled for translate; "Converting..." state; toast "Style updated using the saved recognition." | job.html:114-121; job.ts:808-826 | `PATCH /api/jobs/:id {output_script, romanizer}` -> `JobStore.restyle` -> `hinglish.restyle_segment` (needs `original_text` / `original_word`, language hi or en) | NEW:EC-07 (restyle runs in the worker or main thread over saved segments; IndicXlit model must be loaded; edited lines skipped) | HIGH |
| UI-092 | "Review language and quality" button opens the rerun form and focuses the language select (`#rl`) | job.ts:477-483 | none | DIRECT | LOW |
| UI-093 | Delete transcript: `confirm`, "Deleted" toast, `router.navigateByUrl('/', {replaceUrl: true})` so Back never returns to it; failure keeps the page | job.ts:828-848 | `DELETE /api/jobs/:id` (409 if running) | ADAPT: local delete + revoke object URL | LOW |
| UI-094 | Edit saving: new text shown at once (word timings dropped, `edited:true`), then server answer merged; segment objects reused when unchanged; on failure the old transcript returns and the editor reopens with what was typed; toasts "Saved" / "Line deleted" / "Replaced" / "Not saved". Edits are only accepted for `status === done` (server 409 otherwise, so a cancelled partial transcript cannot be edited today) | job.ts:569-614, 460-474; backend `jobs.py:418-448` | `PATCH /api/jobs/:id {segments:[{id,text,start?,end?,deleted?}]}`; stats recomputed server-side | ADAPT: local apply + recompute stats (EC-12). Failure path only for storage errors. Keep the "done only" rule or consciously relax it (document) | MED |
| UI-095 | Unsaved-edit protection: an open editor with a real change is saved when navigating away, when another job opens (saved to the job it belongs to), on `beforeunload` (browser prompt while saving or pending) and on `pagehide` via `fetch(... {keepalive:true})` | job.html (host bindings) job.ts:100-105, 523-551, 616-622 | `PATCH` with `keepalive`, `credentials: same-origin` | ADAPT: IndexedDB writes are async and may not finish during `pagehide`; write the pending draft synchronously (`localStorage`/`sessionStorage` or `navigator.sendBeacon`-free equivalent) and merge on next load; test with real tab close | MED |
| UI-096 | Mobile bottom sheets for menus (`menu-scrim`), `--menu-room` max-height so a 768 px window does not cut the last format | job.html:126-127; job.ts:492-503 | none | DIRECT | LOW |

## 6. Transcript list view (`features/job/transcript.ts`, `transcript.html`)

| ID | Feature | Where | Server dependency | Browser strategy | Risk |
|---|---|---|---|---|---|
| UI-097 | Row list performance design for multi-hour files: OnPush, first 400 rows then +400 near the end (2400 px), 50-row `content-visibility` blocks, per-segment row cache (WeakMap) so live appends do not rebuild, one delegated click listener | transcript.ts:46-54, 80-171, 210-231 | none | DIRECT (and now matters more: segments come from a worker at WASM speed) | LOW |
| UI-098 | Live mode: toolbar replaced by "Live: the text appears here as it is recognised" with pulse; every row shown (no 400 cap); list pins to the newest row unless the visitor scrolled up (desktop: own scroll box; phone: page scroll) | transcript.html:28-30; transcript.ts:99-125, 222-231, 267-281, 533-541 | `segments` SSE events during `running` | ADAPT: fed by EC-03 | MED |
| UI-099 | Search: debounced input (350 ms for 1 char, 140 ms for >= 2, 0 for empty), literal (regex-escaped) case-insensitive, `<mark>` hits, "N of M" / "No matches", prev/next arrows, Enter = apply + next, Escape clears; stepping to a match beyond the loaded rows loads it first; hidden while live | transcript.html:4-21; transcript.ts:341-370 | none | DIRECT | LOW |
| UI-100 | Replace in all matching lines: "Replace..." row, `confirm`, replacement inserted literally (`$&` not special), empty replacement allowed, one batch `SegmentEdit[]`, clears search | transcript.html:33-38; transcript.ts:373-393 | `PATCH` with several edits | ADAPT (UI-094) | LOW |
| UI-101 | "Underline unsure words" switch (default on, `role=switch`, On/Off text): words with `probability < 0.5` red ("low"), `< 0.75` amber ("mid"); runs of confident words merged into plain text; a search takes over from the marks | transcript.html:22-27; transcript.ts:46-48, 300-337 | `Segment.words[].probability` | NEW:EC-05 (per-word probability from the decoder on WebGPU and WASM). Plan section 8 says Transformers.js does not provide it and offers "dropped or replaced"; the owner's rule forbids dropping, so EC-05 must deliver (token log-probs aligned to words) or the replacement must be a documented equivalent (e.g. segment-level avg logprob + the flag in UI-102) | HIGH |
| UI-102 | Segment-level warning mark: low-confidence (< 0.6) line with no underlined word gets a warning mark (⚠); edited line gets the pencil mark; marks have tooltips ("Unsure: worth listening to again", "Edited by you") | transcript.html:59-60; transcript.ts:152-154 | `Segment.confidence`, `edited` | NEW:EC-06 (segment confidence as the Python engine computes it: mean of word probabilities, else `exp(avg_logprob)` clamped to [e^-10, 1]; `engine.py:_segment_dict`) | HIGH |
| UI-103 | Line editing: pencil (accessible name), textarea (rows 2) focused with caret at end, Enter saves, Shift+Enter newline, Escape cancels, blur saves once, Save / Cancel / "Delete line" buttons on every screen, hint "Enter saves - Esc cancels", playhead does not scroll away while editing | transcript.html:46-62; transcript.ts:396-449 | `PATCH` (UI-094) | DIRECT/ADAPT | LOW |
| UI-104 | Delete a line with `confirm('Delete this line from the transcript?')` - **there is no undo anywhere** (comment `transcript.ts:418`; no undo/redo code in `src/app`). Parity target: confirm-and-delete as today; an undo would be a new feature, not a regression | transcript.ts:418-423 | `PATCH {deleted:true}` | DIRECT (optional enhancement: undo stack; record as non-goal) | LOW |
| UI-105 | Click behaviour: timestamp button plays from the line start (disabled without media); click on an underlined word plays from that word (`data-t`); click elsewhere in a row with word timings uses `caretPositionFromPoint` / `caretRangeFromPoint` to find the clicked word; rows without word timings do not seek on text click; selecting text is not a seek; clicks in the editor never seek | transcript.html:46, 58; transcript.ts:452-507 | `Word.start` | NEW:EC-05 (word starts); line-level seek stays DIRECT | MED |
| UI-106 | "Follow playback" switch (only while media plays on a finished transcript): auto-scrolls the playing line into view when it leaves the viewport (smooth unless reduced-motion); off = no scrolling and no loading of more rows | transcript.html:75-81; transcript.ts:533-553 | none | DIRECT | LOW |
| UI-107 | Empty states: "Waiting for the first words..." (live), "No speech was found in this file. If it does have speech, try More > Re-transcribe with the right language." | transcript.html:66-72 | none | DIRECT | LOW |
| UI-108 | Per-segment fields rendered or used: `text`, `start`, `end`, `confidence`, `words`, `edited`; carried but not rendered: `original_text`, `romanizer`, `conversion_warning` (via card), `timing:'chunk'`, `review_reasons` (via card), `no_speech_prob`, `Word.original_word` - they must still be produced and persisted because JSON export, restyle (UI-091) and the review card depend on them | core/models.ts:19-41 | `Segment` contract | NEW:EC-05..EC-07 | MED |

## 7. Keyword (tool) pages and tool-drop

| ID | Feature | Where | Server dependency | Browser strategy | Risk |
|---|---|---|---|---|---|
| UI-109 | Six keyword landing pages `/video-to-text`, `/audio-to-text`, `/mp4-to-text`, `/mp3-to-text`, `/srt-subtitle-generator`, `/voice-recording-to-text`: one component, text from `content/*.ts`, route data (title, description, label, `app:true`), crumbs, h1, lead, why, 4 steps, formats list + download list, SRT example block, tips, 4-5 FAQ `<details>`, "Transcribe a file" CTA, related tools | features/tool-pages/tool-page.ts:27-60, tool-page.html; tool-pages.list.ts:17-60; app.routes.ts:6-11, 52 | none (prerendered) | DIRECT; text changes in section 11 | MED |
| UI-110 | Tool-drop box in each hero: `kind` video (video+audio) or audio (audio only); validation (type, one file at a time, empty file, size vs announced limit, "wrong kind" offers `/video-to-text`), `role=alert` message plus warning toast, success -> `PendingFileService.set(file)` + success toast "File added ... Press Transcribe to start." + `navigateByUrl('/')`; drag highlight; same file can be re-picked (input reset) | tool-pages/tool-drop.ts:139-247 | `health.max_upload_mb` (limit message), none otherwise ("Nothing is uploaded until you press Transcribe.") | ADAPT: drop the size-limit branch; hint text "Nothing is uploaded" -> "Nothing leaves your device" | MED |
| UI-111 | `{limits}` placeholder in tool FAQ answers replaced by `site.limitsText()` (or DEFAULT "Up to 500 MB and 60 minutes per file." when mode unknown; "There is no size or length limit set here." when the server says none) | tool-page.ts:13-48 | `health.max_*` | ADAPT: browser mode -> device-based sentence or none | MED |
| UI-112 | Free / Unlimited / No login chips (+ optional line "No sign-up, no payment, no daily limit...", local variant) | shared/free-chips.ts:78-84 | `site.isLocal()` | DIRECT | LOW |
| UI-113 | "More free tools" related-links block (excludes current page) | shared/related-tools.ts | none | DIRECT | LOW |
| UI-114 | "Record with your microphone" link on the voice-recording page (to `/`) | tool-page.html:15-17; voice-recording-to-text.ts | none | DIRECT | LOW |
| UI-115 | Existing contradiction on this branch: `mp4-to-text.ts:90-92` and `video-to-text.ts:89` answer "Can I paste a link instead of uploading?" with "No ... not web links", while the home page now has a link-download tab. Must be reconciled with UI-058..064 | content/mp4-to-text.ts:90, content/video-to-text.ts:89 | none | ADAPT (copy) | MED |

## 8. FAQ, How it works, legal, 404 - and their mode-dependent wording

`SiteService.mode` is `public` (shared website, files uploaded) / `local` (own computer) / `unknown` (server not answered); prerendered
pages assume `public`. The static build has no `/api/health`, so a fourth value `browser` is required (wording below).

| ID | Feature | Where | Server dependency | Browser strategy | Risk |
|---|---|---|---|---|---|
| UI-116 | FAQ page, 8 questions as `<details class="qa">`: free/unlimited/login (local vs public variant, limits sentence), accuracy (confidence + marked lines, why results differ), better accuracy (language, vocabulary hint, High/Best, re-transcribe, Enhance audio, check marked lines), languages (50+ list; "Show all N languages" from `store.languages()`), files and limits (types; "refused before processed"; "busy ... asks you to wait"), how long (live progress, "Waiting in queue"), privacy (3-way `@switch(site.mode())`), editing | features/faq/faq.html:1-144; faq.ts | `health.public/max_*/session_idle_minutes/brand`, `GET /api/languages` | ADAPT copy for browser mode (section 11); languages list from static JSON | MED |
| UI-117 | FAQPage JSON-LD built **from the rendered text** (`readFaq` after every render) so the data cannot drift, also at prerender | faq.ts:26-37; shared/page-text.ts:15-30; core/structured-data.service.ts:81-96 | none | DIRECT | LOW |
| UI-118 | How it works: h1 with brand, lead, chips, 3 numbered steps (Add your file / Pick quality / Read, edit, download), "What you get" 6 cards (Accurate text, Timestamps, 50+ languages, Edit it right here, Six ways to download [actually seven formats are offered incl. plain text and PDF; copy says six], Private - 3-way mode text), tips, "Good to know" (limits, speed "how busy the service is", nothing saved) | features/how-it-works/how-it-works.html:1-142 | `health.*` | ADAPT copy; fix "busy service" and "uploaded" phrases | MED |
| UI-119 | HowTo JSON-LD from the three rendered steps | how-it-works.ts:36-42; structured-data.service.ts:102-120 | none | DIRECT | LOW |
| UI-120 | Privacy policy (template, "review with a lawyer"): sections 1-9, operator/contact placeholders (`mark.placeholder`), local-copy callout, retention text uses `site.idleText()`, "Last updated" constant | features/legal/privacy.html, privacy.ts, legal-info.ts:2 (`14 October 2026`) | `health.session_idle_minutes`, `brand.contact_email`, `health.public` | ADAPT: full rewrite (files stay on device; models from Hugging Face CDN; AdSense / Google cookies; counter Worker; logs in browser only). Tests `legal.spec.ts:76-85, 171` | HIGH |
| UI-121 | Terms of use (12 sections): free service, your content ("process them only to provide the service"), acceptable use, **limits & session deletion**, accuracy no-warranty, availability, liability, termination via "Delete my data now", governing-law placeholder | features/legal/terms.html:1-102 | `health.max_*`, `session_idle_minutes` | ADAPT: sections 3, 5, 7, 9 reference server processing, limits and session deletion | MED |
| UI-122 | 404 page "Page not found" + home button; catch-all route `**` is client-rendered | features/not-found/not-found.ts; app.routes.ts:77-82 | static host must serve the SPA shell for unknown paths | ADAPT: Cloudflare Pages `_redirects` / `404.html` behaviour (UI-136) | MED |
| UI-123 | Mode-dependent wording matrix (public/local/unknown) exists in: app.ts:55-70 (data note), upload.html:215-219, faq.html:11-26 and 99-126, how-it-works.html:75-85 and 115-128, privacy.html:9-14, terms.html:9-13, free-chips.ts:24-28, job.html:15, tool-page.ts:39-43. A `browser` mode must be added to **every** one of these, and the tests that pin the old sentences updated | listed | `health.public` | ADAPT | MED |

## 9. Logs page and client logging (`features/logs`, `core/log.service.ts`, `core/logs-token.ts`)

| ID | Feature | Where | Server dependency | Browser strategy | Risk |
|---|---|---|---|---|---|
| UI-124 | Logs page access gate: "Logs are turned off on this server" (404), token form (password input) when the server needs one or on 401, "That token was not accepted" on denial, token kept in `sessionStorage['vt-logs-token']` | logs.html:1-23; logs.ts:79-81, 119-148; logs-token.ts | `/api/logs` (`Authorization: Bearer`), `health.logs_enabled`, `logs_require_token` | KEEP-SERVER-ONLY (admin feature of the server); hidden in the static build | LOW |
| UI-125 | Live log viewer: initial load `GET /api/logs?after=&limit=1000`, then `EventSource /api/logs/stream?after=&token=` event `log`, reconnect every 2 s, server-restart detection (`last_seq` decreases), de-duplication by `seq`, 3000-row cap | logs.ts:96-117, 150-195; api.service.ts:103-112 | `/api/logs`, `/api/logs/stream` | ADAPT: in-memory ring buffer in the page (EC-19) feeding the same component, no token | MED |
| UI-126 | Level toggles with counts (DEBUG off by default; CRITICAL/FATAL shown as ERROR), text filter on message or logger, Pause/Resume with "N new" buffer, Follow newest (scroll-up pauses), Download visible lines as `.log`, Clear (confirm, server call) | logs.html:26-77; logs.ts:62-77, 198-270 | `DELETE /api/logs` | ADAPT: Clear empties the local buffer | LOW |
| UI-127 | Client logs sent to the server: `LogService` always writes to console; info / warn / error also `POST /api/logs/client` (fire-and-forget `fetch keepalive`, rate-limit 20 per 10 s, identical repeat suppressed for 5 s, stops after a 401/404, honours `logs_enabled` / token) | core/log.service.ts:16-93 | `POST /api/logs/client`, `health.logs_*` | ADAPT: send to the in-page ring buffer (EC-19); optional opt-in remote reporting is a new decision (privacy page) | LOW |
| UI-128 | Global error handler (uncaught -> `ERROR` log) and HTTP interceptor (failed non-log API call -> `ERROR`/`WARNING` "API GET /x failed: status") | core/log.service.ts:96-119; app.config.ts:10-12 | HTTP calls | DIRECT (interceptor becomes a no-op in browser mode) | LOW |

## 10. Core services - polling, session, stats, site, SEO

| ID | Feature | Where | Server dependency | Browser strategy | Risk |
|---|---|---|---|---|---|
| UI-129 | `ApiService` facade (the swap point): `health, stats(fresh), session, deleteSession, models, languages, listJobs, getJob, createJob(file, options) -> Observable<{progress, loaded, total, job}>, patchJob, cancel, rerun, delete, logs, clearLogs, logsStreamUrl, exportUrl, exportText, watch(id, since) -> Observable<{type:'job'\|'segments', data}>` | core/api.service.ts:28-141 | 17 endpoints (list in section 12) | ADAPT: second implementation with identical signatures; `exportUrl` has no meaning (replace with `export(id, fmt, opts) -> Blob`) | MED |
| UI-130 | `JobsStore`: `jobs`, `health`, `models`, `languages`, `offline`, `loaded` signals; `refresh()` polls `/api/jobs` every **2 s** while any job is queued/running, **15 s** idle, **5 s** after a failure, **10 s** after a 429/503 ("Server busy" toast once); `loadReference()` loads health, models, languages once; `upsert/remove/clearAll` | core/jobs.store.ts:11-124 | `GET /api/jobs`, `/api/health`, `/api/models`, `/api/languages` | ADAPT: store becomes event-driven (no timers) in browser mode; reference data static; `models` refreshed after each job (so `downloaded` updates) as `job.ts:431` does today | MED |
| UI-131 | `SessionService`: poll `/api/session` every 60 s (only when `site.answered() && isPublic()`), detects id change / expiry / empty history, `check()` used by the job page to explain a vanished transcript, `reset()` after wipe | core/session.service.ts:17-143 | `/api/session`, `/api/health.session_id` | REMOVE in browser mode (service stays inert) | LOW |
| UI-132 | `StatsService`: described in UI-005; stops after 3 failures (slow poll 5 min), pauses when the tab is hidden, `visibilitychange` catch-up | core/stats.service.ts | `/api/stats` | NEW:EC-17 | MED |
| UI-133 | `SiteService`: mode, brand, version, logs flags, `allowedModels`, limits texts ("Up to 500 MB and 60 minutes per file."), idle text, `devHint`; `PUBLIC_DEFAULTS` = 500 MB / 60 min / 30 min used for prerendered HTML | core/site.service.ts:20-137 | `/api/health` | ADAPT: source switches to build-time config + EC-15; `PUBLIC_DEFAULTS` removed in browser mode | MED |
| UI-134 | SEO titles and meta: `BrandTitleStrategy` -> `TitleService.set` (title "X - TranscribeVid", description, OG / Twitter, canonical without query/trailing slash, robots `index, follow, max-image-preview:large` or `noindex, nofollow` for `/jobs/*`, `/logs`, 404; brand and URL from `site.brand()`) | core/title.service.ts:34-138; app.routes.ts:17-83 | `health.brand` | DIRECT (brand from static config) | LOW |
| UI-135 | Structured data: WebSite + Organization + WebApplication on `/`; BreadcrumbList on inner pages; WebApplication on tool pages; FAQPage / HowTo from page text; nothing on private pages; `FEATURES` list says "Video and audio to text in the browser" (already true), `browserRequirements: Requires JavaScript and a modern web browser` (should add WebAssembly/WebGPU note) | core/structured-data.service.ts:45-262 | none | DIRECT (small copy tweak) | LOW |
| UI-136 | Prerender: `/`, `/how-it-works`, `/faq`, `/privacy`, `/terms` and the six tool pages are `RenderMode.Prerender`; `/jobs/:id`, `/logs`, `/about`, `**` are client-rendered (`index.csr.html`), built with `outputMode: static`; the backend's `spa()` serves `index.csr.html` for client routes and must know every page (`APP_PAGES`, checked by `backend/tests/test_spa.py`) | app.routes.server.ts:13-31; angular.json (`outputMode: static`); backend `main.py` `spa()` | backend static serving | ADAPT: Cloudflare Pages needs the equivalent rewrite for `/jobs/*` and unknown paths, and `_headers`; `sitemap.xml` / `robots.txt` stay | MED |
| UI-137 | Static assets: `index.html` boot content for no-JS crawlers (+ `<noscript>`), inline theme script, `manifest.webmanifest` ("...in your browser"), `robots.txt` (Disallow `/api/`, `/logs`, `/jobs/`), `sitemap.xml` (11 URLs), icons, `og-image.png` | src/index.html; public/* | none | DIRECT (`/api/` Disallow becomes dead but harmless) | LOW |
| UI-138 | Dev proxy `/api -> 127.0.0.1:$VT_PORT` | frontend/proxy.conf.cjs | FastAPI | KEEP-SERVER-ONLY (plan: removed at step 4 only if the server transport is dropped) | LOW |
| UI-139 | Formatting helpers: `fmtTime`, `fmtBytes`, `fmtBytesShort`, `fmtEta` ("N s left" / "N min left"), `timeAgo`, `prefersReducedMotion`, `triggerDownload` | core/format.ts | none | DIRECT | LOW |
| UI-140 | Error text helpers `errorDetail` (FastAPI `detail`, string / array, first line), `isTransient` (0 / 5xx), `isBusy` (429 / explained 503) | core/http-error.ts | HTTP semantics | ADAPT: engine errors reuse the `{error:{detail}}` shape so call sites stay | LOW |

## 11. Wording that stops being true in browser mode (and the tests that pin it)

| Where | Today's claim | Why it breaks | Tests to update |
|---|---|---|---|
| privacy.html:18 | "no account, no tracking and no advertising" | AdSense (plan section 7) | legal.spec.ts:76-85 |
| privacy.html:29-44, 60-63, 80-83, 87-89 | files uploaded to "our server"; recognition "runs on our own server"; HTTPS to our server | files never leave the device; model files come from a CDN | legal.spec.ts |
| privacy.html:65-76 | "One essential session cookie ... no cookie banner"; "No analytics, advertising or tracking cookies, and no third-party scripts, fonts or trackers" | no session cookie; AdSense cookies + consent banner | legal.spec.ts:76-85 |
| faq.html:99-111 | "Your files are uploaded to our server ... one essential session cookie ... no tracking" | same | faq.spec.ts:257-282 |
| faq.html:85, 91-94 | "service is busy ... asks you to wait", "Waiting in queue" (UI actually says "Waiting in line...") | no shared queue | faq.spec.ts |
| faq.html:80-84, 15-24, 22-24 | server limits sentence ("Up to 500 MB and 60 minutes") | no upload limits | faq.spec.ts, site.service.spec.ts |
| how-it-works.html:75-85, 115-128 | "Your files are kept only for your session and deleted automatically"; "how busy the service is" | same | how-it-works.spec.ts:171-192 |
| how-it-works.html:67 | "Six ways to download" | seven formats are offered | how-it-works.spec.ts |
| app.ts:61 | "kept only for this session and deleted automatically ... one essential session cookie" | same | app.spec.ts:764-780 |
| app.ts:202 | toast "removed from the server" | no server | app.spec.ts:876-897 |
| upload.html:215-219 | "Your files are deleted automatically." | same | upload.spec.ts:423-476 |
| terms.html:29-30, 45-53, 66, 78 | "process them only to provide the service"; limits + session deletion; "data kept only for your session" | same | legal.spec.ts:171 |
| tool-pages/content/*.ts (audio-to-text 94 & 99, mp3-to-text 62, 78, 98, mp4-to-text 82, video-to-text 34, 79, voice-recording-to-text 34, 89, 99) | "refused before processed", "{limits}", "deleted automatically when the session ends", "your file may wait in the queue" | same | tool-page.spec.ts |
| tool-drop.ts:170 | "Nothing is uploaded until you press Transcribe." | still true but misleading: nothing is ever uploaded | tool-drop.spec.ts:80 |
| public/manifest.webmanifest | "...in your browser" | already correct | - |

## 12. Every place the UI assumes a server, and what replaces it in the browser engine

| # | Assumption | Where | Replacement in the browser transport |
|---|---|---|---|
| S-01 | Poll `GET /api/jobs` every 2 s while a job is active, 15 s idle, 5 s after error, 10 s after 429/503 | core/jobs.store.ts:61-88 | Store is updated by engine events (EC-01/02); no timers. Keep `refresh()` as a no-op or a store reload after `visibilitychange` |
| S-02 | `EventSource /api/jobs/:id/events?since=` (`job`, `segments`, `end`), auto-reconnect, `error -> retry 2 s` | api.service.ts:122-140; job.ts:415-436 | `watch(id, since)` returns an Observable fed directly by the worker's `postMessage` stream; `since` replays from the persisted segments; no reconnect case |
| S-03 | Upload progress via `HttpEventType.UploadProgress`; bytes, speed, "keep this page open" | api.service.ts:64-85; upload.ts:60-67, 406-421; upload.html:73-98 | No upload. Show file-read / decode progress if useful; progress UI for model download (UI-056) instead |
| S-04 | Max upload size (500 MB public / 4096 MB local): client check, drop hint, tool-drop, FAQ, Terms, tool pages | upload.ts:297; site.service.ts:86; tool-drop.ts:242; tool-page.ts:13 | Device guard EC-15 (memory-based warnings), no fixed cap |
| S-05 | Max duration (60 min public): announced text; enforced server-side at probe (`engine.py:455`, `qwen_engine.py:134`) | site.service.ts:91, 104-113 | No cap; per-device warning and out-of-memory handling |
| S-06 | Session cookie, idle expiry (30 min public / 120 local), `GET /api/session` every 60 s, "ends in N min" and "session ended" banners, job-page "Your session has ended" state, server-restart detection via `health.session_id` | session.service.ts; app.html:132-139; job.html:1-8; job.ts:388-406 | No server session. Data lives in the browser until the visitor deletes it (UI-012); remove banners / state in browser mode |
| S-07 | "Can't reach the server ... Retrying..." banner, `offline` signal, dev hint (`python run.py`) | app.html:125-131; jobs.store.ts:106-110 | Offline notice only for model download and link downloader |
| S-08 | "The server is busy" / 429 / 503 handling in store, job page, upload page | jobs.store.ts:74-83; job.ts:338-346; job.html:199-205; upload.ts:464-481 | Not applicable; dead code in browser mode (keep for server transport) |
| S-09 | `health.device` (`cpu` / `cuda`) and `compute_type` exist in `Health` but are **never rendered** (public health returns null for both; `app.spec.ts:228` asserts no hardware chip) | core/models.ts:113-114; backend main.py health | Replace by an optional "running on GPU (WebGPU) / CPU (WebAssembly)" hint from EC-15 on the upload page (needed for the plan's slow-mode warning); not a regression if absent |
| S-10 | `GET /api/models` (`downloaded`, `size_mb`, engine) | jobs.store.ts:55-58; upload.ts:157-178 | Browser model manager (EC-09): Cache API `downloaded` flag, real sizes |
| S-11 | `GET /api/languages` | jobs.store.ts:52 | Static JSON (61 entries, EC-16) |
| S-12 | `GET /api/stats` 60 s poll + 2 s after done | stats.service.ts | Cloudflare Worker + KV (EC-17), same payload |
| S-13 | `/api/logs`, `/api/logs/stream`, `DELETE /api/logs`, `POST /api/logs/client` | api.service.ts:103-112; log.service.ts:79 | In-page ring buffer (EC-19) |
| S-14 | `/api/downloads*` polled every 1.2 s | downloader.ts | `OPTIONAL-SERVER` (UI-058..064) |
| S-15 | `media_url = /api/jobs/:id/media` with HTTP Range; server-made `preview.mp3` | job.html:177-183; jobs.py:546-584 | Object URL of the stored source Blob; PCM-derived preview for non-playable containers (EC-14) |
| S-16 | Export through `GET /api/jobs/:id/export` with `Content-Disposition`; 409 if not done | job.ts:677-700; main.py:599-613 | Local pure-function exporters (EC-12) + print-to-PDF (EC-13) |
| S-17 | `PATCH /api/jobs/:id` (title, segment edits, restyle) and `keepalive` PATCH on `pagehide` | job.ts:541, 583, 653, 812 | Local store writes (EC-11); synchronous draft stash for pagehide |
| S-18 | `POST /api/jobs/:id/rerun`, `/cancel`, `DELETE /api/jobs/:id`, `DELETE /api/session` | api.service.ts:90-98, 47 | Local engine + store |
| S-19 | Job ids are server UUID hex; routes `/jobs/:id` | app.routes.ts:25-30 | Client-generated id; the route must resolve after reload (EC-11) |
| S-20 | Prerender uses `ASSUME_PUBLIC` wording; backend `spa()` serves `index.csr.html` | platform.ts:23-33; app.routes.server.ts | Static host rewrites + "assume browser mode" |
| S-21 | `health.brand/version/contact_email/allowed_models/public/logs_*/session_*/max_*` | site.service.ts | Build-time config (+ EC-15 for allowed models) |
| S-22 | Single server worker queue: files of all visitors queue; `queue_pending` in health (not shown) | jobs.py `Scheduler`; main.py:458 | Per-visitor sequential queue in the browser (EC-01) |
| S-23 | `credentials` / cookie same-origin on `keepalive` fetch | job.ts:541-546 | none |

## 13. Engine / platform capabilities the UI needs (hand-off to the engine tracks)

| EC | Capability | Needed by (UI rows) |
|---|---|---|
| EC-01 | Job runner in a worker: statuses `queued/running/done/error/cancelled`, ids, sequential multi-file queue, error strings | 007, 046, 065, 068-071, S-22 |
| EC-02 | Events: `phase` (`extracting` / `loading_model` / `transcribing`), `progress` 0..1, `eta_seconds` (elapsed/progress after 3 % and 3 s), model-download `loaded/total` | 056, 066, 068 |
| EC-03 | Incremental `segments` events (id, start, end, text, ...) with `since` replay | 066, 098 |
| EC-04 | Cooperative cancel that keeps partial segments and ends in `cancelled`; `cancel_requested` interim state | 008, 070 |
| EC-05 | Word timestamps + per-word probability on WebGPU **and** WASM | 043, 101, 105, 108 |
| EC-06 | Segment confidence, `no_speech_prob`, `review_reasons` (repetition / uncertain boundary), `timing:'chunk'`, detected `language` + `language_probability`, `duration` | 075, 076, 102 |
| EC-07 | Hinglish: IndicXlit (trained) + basic fallback + `auto`; stores `original_text` / `original_word`; restyle of saved segments; `conversion_warning` | 036, 038, 077, 091 |
| EC-08 | Qwen3-ASR 0.6B / 1.7B route (or documented `OPTIONAL-SERVER`) | 037, 077 |
| EC-09 | Model catalog, `downloaded` (Cache API), sizes, download progress, persistent storage request, delete cached model | 031, 032, 041, 056, 012 |
| EC-10 | Pipeline: any-container decode (ffmpeg.wasm fallback), 16 kHz mono, clean-up filters, Silero VAD, 30 s windows, beam search, temperature fallback, hallucination + loop guards, vocabulary prompt, translate task, language param, previous-text conditioning | 023, 030, 039, 040, 042, 043 |
| EC-11 | Persistence: job records, segments, source Blob (player + re-run) in IndexedDB / OPFS; delete-all; quota handling; pagehide-safe draft | 012, 052, 065, 078, 090, 094, 095 |
| EC-12 | Exporters and `compute_stats` as pure functions, golden-tested against `backend/app/formats.py` | 075, 083, 085, 094 |
| EC-13 | PDF route (print stylesheet or generator) tested for Indic / Arabic / CJK | 086 |
| EC-14 | Player media: object URL; PCM-derived preview for non-playable containers | 078 |
| EC-15 | Device capability probe (WebGPU / WASM, `deviceMemory`, cores), model gating, large-file / phone warnings, Screen Wake Lock | 027, 028, 031, 033, 057 |
| EC-16 | Static reference data (61 languages, 9-model catalog) | 034, 041 |
| EC-17 | Cloudflare Worker + KV counter (optional) | 005, 132 |
| EC-18 | Downloader service URL (optional, existing FastAPI router) | 058-064 |
| EC-19 | In-page log ring buffer | 125, 127 |

## 14. Option matrix (`JobOptions`, `core/models.ts:4-17`, defaults `models.ts:178-191`)

| Field | UI control (where) | Default | Also editable at re-run | Engine capability |
|---|---|---|---|---|
| `engine` whisper/qwen | Recognition engine select (upload.html:151) | whisper | yes (job.html:91) | EC-08 |
| `romanizer` auto/indicxlit/basic | Hinglish conversion (upload.html:159) | auto | yes + Apply style only (job.html:114) | EC-07 |
| `model` | Quality presets + Model select (upload.html:105, 179) | small | yes (job.html:96) | EC-09 |
| `language` | Language select (upload.html:127) | null (auto) | yes, Auto preserved (job.html:100) | EC-10 |
| `task` transcribe/translate | Output select (upload.html:169) | transcribe | no (inherited; style/engine disabled when translate) | EC-10 |
| `output_script` hinglish/original | Transcript style (upload.html:143) | hinglish | yes (job.html:105) | EC-07 |
| `prompt` (<= 1000) | Vocabulary hint (upload.html:176) | '' (never stored) | no (inherited) | EC-10 |
| `beam_size` 1-10 | Search depth slider (upload.html:192) | 5 | no (inherited) | EC-10 |
| `vad` | Skip silence & music (upload.html:197) | true | no | EC-10 |
| `enhance_audio` | Enhance audio (upload.html:196) | true | no | EC-10 |
| `word_timestamps` | Word-level timing (upload.html:198) | true | no | EC-05 |
| `condition_on_previous` | Use previous text as context (upload.html:199) | false | no | EC-10 |

Server-side hidden behaviours behind these options that the UI does not name but users rely on (from the `engine.py` module header): speech-band filter + loudness normalisation, Silero VAD, temperature fallback, hallucination guard, loop suppression,
hotwords, adaptive chunk boundaries, "uncertain passage" review reasons, and text post-processing such as `merge_number_pieces` / `fix_number_text` ("10,000" instead of "10" + "000", `engine.py:380-410`). They are covered by the engine track's inventory; the UI
only exposes the outcome (UI-076).

## 15. Accessibility features that must survive

* Skip link (UI-001); `main` has `tabindex=-1` and receives focus.
* Landmarks and labelled navs: `Main`, `History`, `Footer`, `Free tools`, `Menu`; header/main/footer roles asserted in `app.spec.ts:153`.
* Popover and sheet are `role=dialog` with focus-in on open, Escape closes and restores focus, Tab-out closes the popover (UI-006, UI-009).
* Live regions: toasts (`aria-live=polite`, errors `role=alert`), upload card `role=status aria-live=polite`, quality help line, search count, `role=log` on the log viewer.
* Counter is one `role=img` with the full text as name and tooltip (UI-005); statuses are words, not colour only (`app.spec.ts:545`).
* Radio group "Quality" with visually hidden inputs; `aria-expanded` / `aria-controls` / `aria-pressed` on toggles; `role=switch` for "Underline unsure words" and the Follow playback `aria-pressed`.
* Every icon button has an `aria-label`; `aria-hidden` on decorative SVG; pencil buttons named "Edit this line".
* `prefers-reduced-motion` honoured for smooth scrolling (`core/format.ts:41`, `styles.scss:381`); `theme-switching` suppresses transitions.
* Focus-visible outlines (`styles.scss:181`), `.visually-hidden` helper (`styles.scss:560`), touch targets >= 44-48 px in tool components.
* Keyboard: Enter / Shift+Enter / Escape in the line editor, Enter / Escape in search, Enter / Escape in rename, Escape closes any menu.
* `lang="en"`, single `h1` per page, `<noscript>` message, JSON-LD only for visible text.
* New in browser mode and not present today: announce model-download progress and the weak-device warning politely (`role=status`).

## 16. Observations about the current UI worth knowing before porting

1. **Unused helpers**: `PHASE_LABEL` (`core/format.ts:35`) and `triggerDownload` (`format.ts:49`) are exported and covered by `format.spec.ts` but no component uses them; the job page has its own `saveFile` (`job.ts:54`) and the progress text lives in `PHASE_TEXT` (`job.ts:32`).
2. **Copy drift**: FAQ says "Waiting in queue" while the job page says "Waiting in line..."; How it works says "Six ways to download" while the export menu has seven entries; tool pages say links are not supported while the home page has a link tab (UI-115).
3. **No undo** for deleted lines or replace-all (UI-104) and **no edit of cancelled or running transcripts** (server returns 409 unless `done`, `jobs.py:418-424`) - parity means keeping both unless the owner wants them changed.
4. **Stats shown**: only word count and average confidence; `keywords`, `words_per_minute`, `speech_seconds`, `low_confidence_segments` exist in `Stats` and JSON export but have no UI today.
5. **Models without a preset**: `tiny`, `medium`, `distil-large-v3` and both Qwen models are reachable only through "More options > Model/Engine". The browser catalog must keep them reachable (or show a visible "not available on this device" reason) - UI-041.
6. **Re-transcribe form** exposes engine, model, language, style, romanizer only; vocabulary, beam, VAD, enhance, word timing and task are inherited from the first run via the server's merge (`main.py:562-577`). The local `rerun(id, changes)` must perform the same merge.
7. **0-byte files** are rejected by the server and by `tool-drop`, but not by the upload page's own validation (UI-026).
8. **Everything user-typed that is sensitive** (vocabulary hint) is deliberately never put in storage (UI-040/044); with local persistence of jobs (EC-11) the stored `options.prompt` of a job needs the same treatment or an explicit decision.
9. **Ads vs. UI**: AdSense rules in the plan forbid ads adjacent to Upload / Download / Export controls; the upload card, export menu and the player area must keep clear space (layout work in `PROGRESS.md` M6, not a parity item).

## 17. Counts and evidence

* Frontend source inspected: 33 spec files (933 literal `it(` calls) and all non-spec files under `src/app`, `src/index.html`,
  `public/`, `angular.json`, `package.json`, `proxy.conf.cjs`.
* Backend contract read: `main.py` (endpoints at lines 470-640), `schemas.py`, `formats.py` (whole), `jobs.py` (create, update,
  restyle, `_run`, `preview_path`), `engine.py` (catalog lines 34-52, languages = 61 codes), `downloads_api.py`, `DOWNLOADS.md`, `pdf.py` (header).
* Commands: file reads with line numbers (`cat -n`), `grep -rnE` for `undo`, `keywords|avg_confidence`, `@media print`, `PHASE_LABEL`,
  `.device|compute_type`, wording strings; `curl -D -` CORS probes quoted in section 3; a Python regex counted the 61 language codes.
* No repo files outside this document were modified; no browser or server process was started.
