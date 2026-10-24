# TranscribeVid — transcribevid.com

Turn any video or audio file into an accurate, timestamped transcript. Free, no account, and **nothing is kept**: every visitor gets a private, session-only workspace whose files are deleted automatically.

It runs two ways from the same code:

- **On your own computer** (`npm run dev`): single user, nothing leaves the machine.
- **As the website https://transcribevid.com**: many visitors at once, each isolated by a session cookie; see [`deploy/README.md`](deploy/README.md) for the complete go-live guide (DNS, server, HTTPS, limits).

- **Frontend:** Angular 21 (standalone components, signals, SSE live updates)
- **Backend:** FastAPI + [faster-whisper](https://github.com/SYSTRAN/faster-whisper) (Whisper on CTranslate2) + bundled ffmpeg
- Python was kept for the backend on purpose: the best open speech-recognition engine lives there, so there is no accuracy-losing rewrite.

## Video downloads from links

On the homepage, choose **Download from link**, paste a public YouTube video/Shorts
or Instagram Reel/video post link, choose a maximum quality, and Download. The MP4
is saved automatically when ready, with a Save video fallback and Cancel control.
Install the current backend requirements and keep Node 22+ on PATH. Private/login-
restricted content, live streams, playlists and carousels are not supported.
Files belong to the visitor's temporary session. See [backend/DOWNLOADS.md](backend/DOWNLOADS.md)
for setup, limits, API endpoints and platform restrictions.

## Quick start

```
npm run dev
```

On first run it creates the Python environment and installs dependencies (needs Python 3.10+ and Node 22+), then starts the API and the Angular dev server and opens **Chrome** at http://localhost:4200. Both reload automatically when you edit code. The Whisper model downloads once on first use (the UI tells you before you start) and is cached in `backend/data/models`.

| Command | What it does |
|---|---|
| `npm run dev` | API (auto-reload, :8000) + Angular dev server (live reload, :4200), opens Chrome |
| `npm start` | Production mode: builds the Angular app once, serves everything from :8000, opens Chrome |
| `npm test` | Backend (pytest) + frontend (vitest) test suites - fast, no models needed |
| `npm run test:backend` / `npm run test:frontend` | One suite only |
| `npm run test:real` | Slow: transcribes excerpts of the real videos (V-1..V-6) and compares with the golden transcripts |
| `npm run setup` | Install dependencies only |

## Session only — nothing is stored

Every visitor (every browser) gets an isolated workspace behind an unguessable cookie (`tv_sid`, HttpOnly, SameSite=Lax, Secure over https). Jobs, uploaded media and transcripts exist only in memory and in a scratch folder (`backend/data/session/<instance>/<visitor>`). A workspace is deleted — media, transcripts, everything — when

- the visitor presses **Delete my data now** (`DELETE /api/session`),
- it has been **idle** for `VT_SESSION_IDLE_MINUTES` (default 30 on the public site, 120 locally; open tabs keep it alive, a running job keeps it alive), or
- the app stops (also after a crash: the next start removes the leftovers of dead instances; a second running instance never touches a live one).

There is no database and no history on disk. **Export what you need** (TXT, SRT, VTT, PDF, Markdown, JSON) before you leave. Only two things are kept between runs: the downloaded Whisper model cache and, on the public site, the **"videos transcribed" counter** (below), which holds one anonymous integer and nothing about any visitor.

Browser-side preferences (theme, last chosen options) use `sessionStorage`: per tab, gone when the tab closes.

### The "videos transcribed" counter

The website header shows how many videos the site has transcribed. It is a single integer plus a last-updated timestamp in a small JSON file (`VT_STATS_FILE`, default `stats.json` inside the data dir, next to - not inside - the wiped `session/` folder; in Docker it is `/data/stats/stats.json` on the `stats` volume so deploys do not reset it). No IP address, session, file name or any other per-visitor data is stored, so it is not personal data.

- **Counted** once per uploaded file, when its transcription first finishes successfully. Not on errors or cancels, not for "re-transcribe" runs of a file that was already counted, and nothing a visitor does later (deleting, "Delete my data now", session expiry) changes it.
- **Only on the public site.** `VT_COUNT_JOBS=auto` (default) counts when `VT_PUBLIC=1`; `1` forces counting, `0` disables it. A local `npm run dev` copy never counts, never shows a number, and the tests never touch it (`config.COUNT_JOBS`).
- **Robust.** Writes are atomic (temp file in the same folder, `fsync`, rename). A missing file is 0; a corrupt one is renamed to `stats.json.corrupt` and counting restarts from 0; a file that cannot be written logs a WARNING and the count is kept in memory. Each new total is logged at INFO (`vt.stats`).
- **API:** `GET /api/stats` -> `{"transcribed": 1234, "counting": true}`. No session, no cookie, served from memory with `Cache-Control: public, max-age=30`. With counting off it answers `{"transcribed": 0, "counting": false}`.

## Public website mode (`VT_PUBLIC=1`)

| What | How |
|---|---|
| Visitors cannot see each other | one `JobStore` per cookie session; ids of another visitor give `404`; tested in `tests/test_sessions.py` |
| Abuse limits | upload size, minutes per file, shared queue length, uploads/hour per IP, max sessions, free-disk floor, allowed models (`VT_MAX_*`, `VT_RATE_UPLOADS_PER_HOUR`, `VT_MIN_FREE_GB`, `VT_ALLOWED_MODELS`). The number of transcriptions per visitor is **unlimited** ("free, unlimited, no login"): `VT_MAX_JOBS_PER_SESSION` defaults to `0` (= no cap; set a number to cap it), and the queue cap and per-IP hourly limit keep one visitor from monopolising the server |
| Global counter | one anonymous integer, `GET /api/stats`, persisted on a volume; see "The "videos transcribed" counter" above |
| Logs are private | `/api/logs` is **404** unless `VT_ADMIN_TOKEN` is set, then it needs `Authorization: Bearer <token>` (or `?token=` for the stream) |
| One canonical URL | `www.transcribevid.com` → `https://transcribevid.com`, http → https behind a trusted proxy (`VT_TRUST_PROXY=1`) |
| Hardening | Host-header allow-list (DNS rebinding), CSRF origin guard, `no-store` on every API response, security headers, no API docs, no hardware details in `/api/health` |
| SEO | prerendered pages with per-page titles, descriptions, canonical, Open Graph/Twitter cards and JSON-LD; sitemap.xml, robots.txt, manifest, real `404` status for unknown URLs (the list of real pages is `APP_PAGES` in `app/main.py`, checked against `sitemap.xml` by `tests/test_spa.py`), `301` from `/faq/` to `/faq` and `/index.html` to `/`, HEAD support, `X-Robots-Tag: noindex` on `/api/`, `/logs` and `/jobs/`; Search Console / Bing verification by setting (`VT_GOOGLE_SITE_VERIFICATION`, `VT_BING_SITE_VERIFICATION`) or by a file dropped into `frontend/public`; IndexNow (`VT_INDEXNOW_KEY` + `scripts/indexnow.mjs`). Owner checklist: [`deploy/SEO.md`](deploy/SEO.md) |
| Speed | gzip for text (never for the live event streams; `VT_COMPRESS=0` turns it off), ETag + `304 Not Modified`, long-cached hashed assets, cache headers per file type (details: [`deploy/README.md`](deploy/README.md) section 10.5). Lighthouse for every page: `node scripts/lighthouse.mjs` |

Before launch: fill the placeholders in the Privacy and Terms pages (`grep -rn 'class="placeholder"' frontend/src/app/features/legal`), have them reviewed, set `VT_CONTACT_EMAIL`, and follow [`deploy/README.md`](deploy/README.md).

## Features

**Accuracy**
- Quality presets (Fast → Maximum) plus every Whisper model, including `large-v3-turbo` and `distil-large-v3`; GPU (CUDA) is used automatically when available
- Audio clean-up before recognition (rumble/hiss filter, loudness levelling for quiet speakers)
- Voice-activity detection to skip silence/music, the main cause of invented text
- Beam search, temperature fallback, hallucination guard and repetition-loop breaker
- **Vocabulary hint** for names/jargon, **language picker** (more reliable than auto-detect), **translate to English**
- Word-level timing and confidence: uncertain words are underlined and uncertain segments flagged ⚠ so you know what to check
- **Re-transcribe** the same file with a bigger model or another language in one click

Language detection chooses one language for the whole recording and can be wrong for accented or mixed-language speech, even with a high detection probability. If the text looks wrong, select the spoken language explicitly and try a higher quality model. Re-transcribe preserves your original language selection, including Auto. Completed transcripts with low model confidence, uncertain language detection, or no text show a review prompt with a shortcut to the language and quality controls. Model confidence is not a measured accuracy percentage; listen and review before using the transcript.

**Default transcript style: Hinglish (Roman Hindi).** Hindi recognition is converted locally, keeping existing English text, timing and confidence. Automatic conversion uses trained IndicXlit when prepared; Basic phonetic fallback shows a warning. The same text streams live and is used by every export. Original recognition is retained for **Apply style only**, so changing script does not re-run the audio and edited lines stay intact. Qwen is available as an optional recognition engine; its Hindi output has approximate chunk timing, with no fabricated word timestamps/confidence. Cancellation stops a dedicated inference worker, including blocked native decoding. See [backend/QUALITY.md](backend/QUALITY.md) for model preparation, engine selection, benchmark results and limitations. Recognition errors still need review. CLI: `--output-script original` keeps the recognition script.

**Speed** (measured on an 8-core laptop CPU, no GPU; a GPU is used automatically when present)
- Real speed depends on the model: `small` ~2.7-3.4x realtime, `large-v3-turbo` ~1.5x, `medium` ~1x. A 10-minute video takes roughly 3-7 minutes. Keep the laptop on AC power: it was measurably faster than on battery.
- Tested and rejected because they cost accuracy or live streaming: batched decoding (+5-7% speed, but changed words and merged 60 live segments into 5), the English-only distil model (faster, but it drops words and whole sentences), more CPU threads (4-8 are within noise of each other; 12+ is slower; `VT_CPU_THREADS` is available).
- Kept: the model loads in the background while ffmpeg decodes the audio, the default model is preloaded at start-up (only if already downloaded), and audio is decoded to a memory-mapped file so a 4-hour recording costs disk, not RAM.

**Workflow**
- Drag & drop several files at once, or record from the microphone; jobs queue
- Live transcript streaming while a file is processed, with a step-by-step status, progress and time remaining
- Built-in player: click any timestamp or word to jump there; the current line follows playback; speed control
- Edit text inline, delete segments, **search** and **find & replace** across the transcript
- Stats: word count, speaking pace, average confidence, frequent terms (click to search)
- **Logs page** (`/logs`): live server + browser logs with level filter, search, pause, download

**Export:** PDF, SRT and WebVTT (re-flowed into readable 2-line cues using word timing, adjustable line length), TXT with timestamps, plain paragraphs, Markdown, JSON (words + confidence). Exports always include your edits.

## Project layout

```
backend/            FastAPI app
  app/engine.py       ffmpeg + faster-whisper pipeline
  app/sessions.py     per-visitor sessions (cookie, idle expiry, delete-my-data)
  app/jobs.py         one visitor's jobs + the shared transcription scheduler
  app/stats.py        the anonymous "videos transcribed" counter (one integer, atomic JSON file)
  app/formats.py      SRT/VTT/TXT/MD/JSON exporters, stats
  app/pdf.py          PDF exporter (fpdf2, Unicode fonts)
  app/logbuffer.py    in-memory log ring + logging setup
  app/logs_api.py     /api/logs endpoints (read, stream, clear, browser logs)
  app/main.py         REST + SSE API, request logging, hardening, serves the built Angular app
  app/limits.py       per-IP rate limiter
  tools/              accuracy-analysis tooling (WER, alignment, multi-system consensus)
  cli.py              command-line transcription (no server)
  run.py              production entry point (used by npm start)
  tests/              pytest suite
frontend/           Angular app (src/app/core = API/state/logging, src/app/features = pages)
scripts/run.mjs     cross-platform launcher behind the npm scripts
scripts/lighthouse.mjs  Lighthouse score table for every page of a production build (usage at the top of the file)
scripts/indexnow.mjs    tells Bing/Yandex about the sitemap's pages after a deploy (deploy/SEO.md)
Dockerfile, docker-compose.yml, deploy/   production deployment for transcribevid.com (Caddy + HTTPS)
legacy/             the original Flask version (kept for reference)
```

## How accuracy is measured and improved

`backend/tools/` holds the analysis tooling (word-error-rate, alignment, multi-model consensus - 241 tests, validated on synthetic ground truth where voting cut errors by ~95%). For the six sample videos several Whisper models were run, their outputs voted word by word, every disagreement was judged by two independent reviewers (majority of three opinions), and product names were normalised. The result, the accuracy report and the list of spots a human should still listen to are written by `python -m tools.deliver`. `npm run test:real` re-checks the engine against those reviewed transcripts (`backend/tests/golden/`, text only - the videos themselves are never copied). Agreement between models is strong evidence but **not proof of accuracy**: without a human-verified reference no true error rate can be stated.

## Logs

Everything is logged (request timings, uploads, each job phase, model loading, audio decoding, filtering decisions, exports, errors, and the browser's own errors) to an in-memory ring buffer and to the console. Open **http://localhost:4200/logs** (or the "Logs" button in the top bar) to watch it live. Nothing is written to a log file.

## Command line

```
cd backend
.venv\Scripts\python cli.py talk.mp4 --format srt -o talk.srt
.venv\Scripts\python cli.py talk.mp4 --model large-v3-turbo --lang en --prompt "Kubernetes, PostgreSQL"
```

## API (excerpt)

| | |
|---|---|
| `POST /api/jobs?filename=..&options=..` | raw file bytes as the body → queued job |
| `GET /api/jobs`, `GET /api/jobs/{id}` | history / full transcript |
| `GET /api/jobs/{id}/events` | live progress + segments (Server-Sent Events) |
| `GET /api/session`, `DELETE /api/session` | this visitor's session info / "delete my data now" |
| `PATCH /api/jobs/{id}` | rename (`title`), edit/delete segments |
| `GET /api/jobs/{id}/export?format=pdf\|srt\|vtt\|txt\|plain\|md\|json` | download |
| `POST /api/jobs/{id}/rerun`, `/cancel`, `DELETE /api/jobs/{id}` | |
| `GET /api/stats` | `{"transcribed": n, "counting": bool}`: the website-wide counter (no session, no cookie, cacheable 30 s) |
| `GET /api/logs`, `GET /api/logs/stream`, `DELETE /api/logs`, `POST /api/logs/client` | logs |

Interactive docs at `/docs` (local mode only).

## Configuration (environment variables)

**Everywhere:** `VT_PORT` (8000), `VT_HOST` (127.0.0.1; `0.0.0.0` shares it on your network), `VT_DATA_DIR`, `VT_MODEL_DIR`, `VT_DEVICE` (auto/cpu/cuda), `VT_COMPUTE_TYPE`, `VT_CPU_THREADS` (default 4; best on the tested 8-core laptop: 4-6), `VT_WARMUP=0` (don't preload the model), `VT_LOG_BUFFER` (10000 lines), `VT_PDF_FONT_DIR` (extra fonts for PDF export), `VT_MAX_UPLOAD_MB` (4096; 500 public).

**Public site:** `VT_PUBLIC=1`, `VT_PUBLIC_URL` (https://transcribevid.com), `VT_ALLOWED_HOSTS`, `VT_TRUST_PROXY`, `VT_CONTACT_EMAIL`, `VT_ADMIN_TOKEN`, `VT_SESSION_IDLE_MINUTES`, `VT_MAX_SESSIONS`, `VT_MAX_JOBS_PER_SESSION` (0 = unlimited, the default), `VT_MAX_QUEUE`, `VT_MAX_DURATION_MIN`, `VT_RATE_UPLOADS_PER_HOUR`, `VT_MIN_FREE_GB`, `VT_ALLOWED_MODELS`, `VT_GOOGLE_SITE_VERIFICATION`, `VT_BING_SITE_VERIFICATION`, `VT_INDEXNOW_KEY`, `VT_COMPRESS` (1). Documented with recommended values in [`deploy/.env.example`](deploy/.env.example).

**Counter:** `VT_COUNT_JOBS` (`auto` = count only when `VT_PUBLIC=1`, `1` = always, `0` = never) and `VT_STATS_FILE` (default `<VT_DATA_DIR>/stats.json`).

## Not included

Speaker identification (diarization) needs additional large models and a Hugging Face token; it is a good next step.
