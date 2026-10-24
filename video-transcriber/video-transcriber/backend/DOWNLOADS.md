# Public video downloads

The homepage has **Transcribe a file** and **Download from link**. Paste a public
YouTube video/Shorts or Instagram Reel/single video post URL, choose a maximum
quality, then Download. The browser receives a same-origin MP4 attachment when
ready, with a Save video fallback. Existing transcription works separately.

## Setup

Install `backend/requirements.txt` and have Node 22+ (or Deno 2.3+) on PATH.
`yt-dlp[default]` includes the packaged EJS solver. FFmpeg is reused from
`imageio-ffmpeg`; no server cookies or logged-in browser credentials are used.
The Docker image copies Node from its frontend stage.

Update yt-dlp when platform changes break extraction:

```powershell
.venv/Scripts/python.exe -m pip install --upgrade "yt-dlp[default]"
```

Platform login/age checks, private content, geo/IP restrictions, unavailable
formats and anti-bot blocks can prevent a public link from downloading. The UI
reports an error; it does not claim every link works. Live streams, playlists,
photo posts and carousels are outside this first version. MP4 with H.264 and AAC
is preferred, up to the selected height when available. Unknown heights are
accepted because some Instagram metadata omits them. HTTP-stream formats are
used; HLS-only sources may be unavailable.

## Lifecycle and limits

Each session owns its download records/files. Closing/resetting an active session
cancels its workers before session cleanup. Active downloads prevent idle reaping.
Files and records disappear when the session ends. Clearing a record removes its
file. No file or internal directory path is returned to other visitors.

There are two download workers and twenty queued/running slots across the server,
two active downloads and ten retained records per session. Each job runs in its
own spawned process. Cancel kills only that process tree, including FFmpeg, and
deletes partial output. A cancelled job cannot become done after a late result.

Environment settings:

| Setting | Default |
| --- | --- |
| `VT_MAX_DOWNLOAD_MB` | 500 |
| `VT_MAX_DOWNLOAD_MINUTES` | 60 |
| `VT_DOWNLOAD_TIMEOUT_SECONDS` | 600 |

The upload IP rate limit and free-disk floor also apply to downloads. Media file
size is checked after completion; individual stream limits and temporary-file
checks bound storage during transfer. Separate video/audio streams mean an
overall percentage is not reliably known, so the UI shows the actual phase and
an indeterminate progress bar rather than a fabricated percentage.

Only canonical known-domain single-video URLs are accepted. Input credentials,
ports, arbitrary URLs and redirect endpoints are rejected. Generic extraction is
disabled. A child-process network resolver rejects non-public IPs, including
private addresses returned by DNS. FFmpeg merges locally downloaded files.

API: POST/GET `/api/downloads`, GET/DELETE `/api/downloads/{id}`,
POST `/api/downloads/{id}/cancel`, GET `/api/downloads/{id}/file`.
Every endpoint uses the existing session cookie and origin protection.

References: [yt-dlp Python integration](https://github.com/yt-dlp/yt-dlp#embedding-yt-dlp),
[YouTube JavaScript runtime setup](https://github.com/yt-dlp/yt-dlp/wiki/EJS).
