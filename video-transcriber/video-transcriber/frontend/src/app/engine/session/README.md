# engine/session

The visitor's session in the browser (ARCHITECTURE.md section 6): jobs, segments, stats, language fields, edits,
titles and the source file of every job, in IndexedDB, with the server's expiry rules
(`backend/app/sessions.py`, `jobs.py`). Pure TypeScript, no Angular. `Job` / `JobSummary` / `Segment` are the
shapes of `core/models.ts`, unchanged.

## API

```ts
const backend = await openSessionBackend();               // database 'tv-session' (memory where IndexedDB fails)
const store = await SessionStore.open(backend, { onEnded: (e) => ... });   // checks expiry at once
```

| Method | Server equivalent | Notes |
|---|---|---|
| `list(): JobSummary[]` | `JobStore.summaries()` | exactly `SUMMARY_FIELDS`, newest `created_at` first |
| `get(id): StoredJob \| null` | `snapshot()` | Job + `updated_at`, `version`, `media_type`, `language_candidates?` |
| `getMedia(id): Blob \| null` | `media_path()` | the source File / Blob (player, re-run) |
| `put(job, media?)` | `create()` / `rerun()` | adds or replaces; `media` stores the Blob (omitted = keep); counts as activity |
| `patch(id, fields)` | the worker's `on_phase` / `on_segment` / `_finish` | merge; `segments` replaces them; reaching done / error / cancelled counts as activity |
| `patchSegments(id, edits)` | `update_segments()` | only when `done`; changed text -> `words: null`, `edited: true`; `deleted` removes; `start >= 0`, `end >= start + 0.1`; stats via the `computeStats` option (engine/post), else unchanged |
| `setTitle(id, title)` | `update_title()` | trimmed, <= 200 characters, empty keeps the old one |
| `delete(id)` | `delete()` | refuses a running job ("Cancel the running job first.") |
| `clear(): number` | `SessionManager.reset()` | "Delete my data now": everything goes, new session id, **not** an ended session; the caller cancels the running job first |
| `deleteModels(): boolean` | - | deletes the Cache API cache `transformers-cache`, only when called |
| `touch()` | `Session.touch()` | the server touches on every request (the 15 s history poll too), so `BrowserTransport` should call it per call |
| `info(): SessionInfo` | `GET /api/session` | 12-character id, `expires_in_seconds` (the full idle time while a job is in progress) |
| `checkExpiry(): boolean`, `ended`, `onEnded(cb)`, `dismissEnded()` | reaper + `SessionService.ended` | see below |
| `close()` | - | stops the timer, releases this page's job locks; the backend stays open |

Errors are `SessionStoreError` with `code: 'not-found' | 'invalid'` (the server's 404 / 400).

Options: `idleMinutes` (30), `checkIntervalMs` (60 000; 0 = no timer), `now` (ms clock), `locks`
(`navigator.locks`), `caches` (`globalThis.caches`), `computeStats`, `staleAfterSeconds` (600), `onEnded`,
`onError`, `newSessionId`.

## Storage layout (IndexedDB `tv-session`, version 1)

| Object store | Key | Value |
|---|---|---|
| `jobs` | job id | the job without `segments` (+ `updated_at`, `version`, `media_type`, `language_candidates`) |
| `segments` | job id | `Segment[]` (kept apart so `list()` never loads transcripts) |
| `media` | job id | the source `Blob` / `File` |
| `meta` | `'session'` | `{ session_id, created_at, last_activity }` (seconds) |

Every method writes in one transaction (`SessionBackend.write(ops)`), so a job, its segments and its file land
together or not at all. Nothing else is stored; theme and options stay in `sessionStorage`.

`SessionBackend` is the small storage interface (`get`, `getAll`, `write`, `clear`, `close`). `MemoryBackend`
implements it for the jsdom specs (structured-clone copies, Blobs by reference, `failNextWrite` to simulate a
quota error); `IndexedDbBackend` is the real one and is exercised by the browser check.

## Expiry rules

* Idle = now - `last_activity`. Activity: `touch()`, `put`, `patchSegments`, `setTitle`, `delete`, `clear`, and a
  job reaching a final status (the server's `last_activity` bump in `_finish`).
* Checked on `open()` (a session left idle while the tab was closed ends right there) and every
  `checkIntervalMs`. Idle > `idleMinutes` with **no job in progress** -> every store is cleared, a new session id
  is written, and `ended` / `onEnded` report `{ reason: 'expired', idleSeconds, jobCount }`. An empty session
  ends silently (nothing was lost).
* **A job in progress keeps the session alive.** In progress = `queued` / `running` and something is working on
  it: this page (it holds a Web Lock `tv-job-<id>` while the job is queued or running), another tab (its lock
  shows in `navigator.locks.query()`, held or still pending), or, without Web Locks, a write in the last
  `staleAfterSeconds` (the page's own check refreshes its jobs every `staleAfterSeconds / 2`, so a long model
  download without writes is not taken for a page that went away).
* A `queued` / `running` job that nothing is working on any more (the page was reloaded or closed mid-job) is
  marked `error` with "The page was closed or reloaded while this job was running. Run it again." on the next
  check; its file stays, so re-run works. With `resumeInterrupted` it is queued again instead (see the runner),
  and a job whose file is not stored ends with `INTERRUPTED_NO_FILE_ERROR` ("Choose the file again").
* Taking over such a job: the check of a page that just opened does it at once; a background check waits one more
  check (a page that is only reloading takes its own job back). Before it queues the job, a page claims the job's
  lock with `ifAvailable` and reads the job again, so two tabs that open at the same moment never both run it.
* A file the browser will not store (quota, Safari's large-Blob error) is kept by this page only
  (`mediaOnlyInPage`): the job runs now, a reload loses it.
* `openSessionBackend()` falls back to `MemoryBackend` where IndexedDB is missing, refuses to open (Firefox private
  windows before 115, blocked site data) or does not open within 10 s: the site works until the tab is closed.
* Several tabs share one database: a touch in any tab keeps the session alive for all of them, and expiry in one
  tab clears it for all.
