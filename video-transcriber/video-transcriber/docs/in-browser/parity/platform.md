# Platform / ops parity inventory (server -> static Cloudflare Pages)

Track: inventory-platform. Branch `feature/in-browser`. App folder: `video-transcriber/video-transcriber`.
All paths below are relative to that folder unless they start with `D:/`. `file:line` refers to the files as they are on this branch today.

Owner rule that governs this document: "currently a lot of features and models are present - do not compromise them".
Every capability below therefore ends in one of five verdicts, never in silent removal:

| Verdict | Meaning |
|---|---|
| KEEP | Works unchanged on a static host (file ships as-is). |
| HOST-RULE | Re-expressed as a `_headers` / `_redirects` rule, a Cloudflare dashboard setting, or a build step. |
| CLIENT | Re-implemented in the browser (a service in `frontend/src/app/core`). |
| WORKER | Needs a tiny Cloudflare Worker (free tier). |
| SERVER-OPTIONAL | Stays available only when a self-hosted API is configured (the existing FastAPI app, trimmed). |
| LOST | Cannot exist without our own server; cost and closest alternative are stated. |

## 1. How this was established (evidence index)

Everything marked "observed" was measured on this machine, not assumed. Raw outputs are in
`C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/inventory-platform/logs/` (call it `$LOGS`).

* Tooling: `wrangler@4.152.0` (`npx wrangler pages dev <dir>` and `npx wrangler dev` with an `assets` config), installed in `.../inventory-platform/tools`. This is Cloudflare's own local runtime (workerd + the same asset-serving code), so redirects, `_headers`, `404.html`, trailing-slash and extension handling are the real rules, but it is still an emulator. **One real preview deployment must repeat the matrix in section 3 before launch** (script idea in section 9). Where Cloudflare's docs are silent (status code of a 404.html answer, behaviour of `/faq` vs `/faq/`) the observed local result is the evidence and is labelled as such.
* Site fixtures (copies of the repo's existing production build `frontend/dist/frontend/browser`, built 15 Oct; nothing in the repo was touched): `siteA` = raw build, `siteB` = flattened + `404.html` + `_redirects` + `_headers`, `siteC` = raw build + `404.html` + an explicit `/faq/ /faq 301`, `siteD` = raw build (folder layout) + `404.html` + `jobs.html` + `_redirects` (`/about`, `/about/`, `/jobs/*`) + a small `_headers`, served by Workers Static Assets (`html_handling: drop-trailing-slash`, `not_found_handling: 404-page`), `siteE` = siteB + host-based `_headers` rule.
* Probe script: `.../inventory-platform/tools/probe.mjs` (fetch with `redirect: manual`, prints status, a marker for "prerendered page" vs "client shell", and the headers that matter).
* Logs: `$LOGS/probeA.txt`, `probeB.txt`, `probeB2.txt`, `probeB3.txt`, `probeC.txt`, `probeD.txt`, `probeE.txt`, `cors-evidence.txt`, `ort-sizes.txt`, `wranglerA..E.log`.
* Cloudflare documentation read for this track (fetched 25 Oct 2026): Pages "Serving Pages", "Headers", "Redirects", "Limits", "Custom domains", "www redirect how-to", "Functions pricing"; Workers "html-handling"; KV and Durable Objects pricing pages. Numbers quoted from them are labelled "docs".
* Repo files read (all fully unless noted): `backend/app/{main,sessions,limits,stats,cleanup,logbuffer,logs_api,downloads,downloads_api,download_worker,config}.py`, `backend/DOWNLOADS.md`, `backend/cli.py`, `backend/run.py`, `deploy/{Caddyfile,nginx.conf.example,systemd/transcribevid.service,.env.example,SEO.md}`, `Dockerfile`, `docker-compose.yml`, `scripts/{run,indexnow,lighthouse}.mjs`, `frontend/public/*`, `frontend/src/index.html`, `angular.json`, `proxy.conf.cjs`, `app.routes.ts`, `app.routes.server.ts`, `app.config*.ts`, `core/{session,stats,site,platform,title,log,logs-token,api,jobs.store,http-error}.ts`, `features/{download/downloader,not-found}.ts`, `app.ts`. Read in part only: `structured-data.service.ts` (first 80 lines), `features/logs/logs.ts` (lines 60-110 plus greps), `features/job/job.ts` (greps for the session/not-found paths), `app.html` (first ~140 lines), `jobs.py` (greps and the quota/count functions). `deploy/README.md` (700 lines) was skimmed by heading only; its facts are mapped in PL-061.
* Pytest files used for behaviour contracts: `test_spa.py` (39 test functions; lines 1-135 and 289-350 read, the rest by test name), `test_seo.py` (32; by test name), `test_sessions.py` (29; lines 296-418 read), `test_stats.py` (46; by test name), `test_api.py` (26; lines 300-368 read), `test_downloads.py` (11; by test name). Test-function counts come from `grep -c '^def test_'`; parametrised cases are not expanded. Their replacement is in section 7.

Not done / limits of this track: no real Cloudflare account was used (no deployment, no dashboard settings verified); the Always-Use-HTTPS and Bulk Redirect behaviours are from docs only; nothing was run against Chrome/Edge (the header and routing facts do not need a browser); `deploy/README.md` was not re-read line by line.

## 2. Summary

* 70 capabilities inventoried (PL-001 .. PL-070). Primary verdict per entry: KEEP 10, HOST-RULE 21, CLIENT 14, WORKER 1, SERVER-OPTIONAL 14, LOST 10 (sum 70; an entry that names a second verdict is counted under its first).
* HIGH-risk items (details inside the entries):
  * PL-005 "Delete my data now" and the data note vanish on a static site as written (they are rendered only when `/api/health` answered).
  * PL-034 / PL-037 / PL-038 Pages default routing gives soft-404s (HTTP 200 home page for every unknown URL), flips the canonical form to `/faq/`, and serves the prerendered HOME for `/jobs/<id>`. All fixable by a post-build step plus two small files (tested), but the raw Angular build must not be deployed as-is.
  * PL-052 (with PL-051..056) YouTube / Instagram link download cannot run in a browser or on Pages/Workers (evidence: no CORS on youtube.com / instagram.com). It survives only as SERVER-OPTIONAL.
  * PL-057 / PL-058 The plan's step 4 "REMOVE backend server app, Dockerfile, deploy" collides with the owner's rule: the CLI, Qwen3-ASR path, IndicXlit, PDF font export and link download all live in `backend/`. Keep `backend/` as the self-hosted edition; remove only the hosting of it.
  * PL-065 `npm run dev|start|test` all drive the Python backend; with the backend gone they break unless re-pointed.
  * PL-069 The ONNX Runtime WebGPU wasm of the pinned `@huggingface/transformers@4.3.1` is 27.0 MiB (`jsep`) and 25.6 MiB (`asyncify`); Cloudflare Pages allows 25 MiB per file, so it cannot be hosted on Pages (must stay on a CDN or R2).
* Medium: PL-017 counter (spoofable once it is client-reported; KV free tier is 1,000 writes/day and not atomic), PL-047/PL-049 operator logs, PL-014 SiteService "public/local" branching, PL-022 noindex/duplicate host on `*.pages.dev` previews, PL-067 Angular size budgets, PL-032 www redirect needs DNS on Cloudflare.

Decisions the owner (or the hosting track) must make, because they change behaviour:

* D-1 Where transcripts live and for how long. Server: session-only, deleted after 30 idle minutes (`config.py:43`). Browser: IndexedDB survives reloads (needed for `/jobs/<id>` after a refresh) but Safari can evict script-writable storage after 7 days without interaction. Recommendation: persist locally, purge after N idle days on next visit, keep "Delete my data now", ask for `navigator.storage.persist()`, and reword the privacy/FAQ text that promises "only for this session".
* D-2 Pages (flatten step) versus Workers Static Assets (folder layout, `drop-trailing-slash`). Both were tested and both reproduce the routing contract; differences are in section 3.
* D-3 Counter backing store: Durable Object (SQLite, atomic) or KV. The plan says KV; KV has no atomic increment.
* D-4 Keep `backend/` in the repository (as the "self-hosted / local edition" with the CLI and optional API). Needed for the "do not compromise" rule.

## 3. Static host behaviour: what a static host does with unknown URLs, /jobs/<id>, headers

### 3.1 Observed URL matrix (status, `->` = Location). "Server" = today's FastAPI app (from `main.py` / `test_spa.py`).

| Request | Server today | Pages, raw build (siteA) | Pages, flattened + 404.html + _redirects (siteB) | Workers assets, folder layout + 404.html (siteD) |
|---|---|---|---|---|
| `/` | 200 prerendered | 200 prerendered | 200 prerendered | 200 prerendered |
| `/faq` | 200 | **308 -> `/faq/`** | 200 | 200 |
| `/faq/` | 301 -> `/faq` | 200 | 308 -> `/faq` | 307 -> `/faq` |
| `/faq/index.html` | 301 -> `/faq` | 308 -> `/faq/` | 404 shell | 307 -> `/faq` |
| `/faq.html` | 404 | (no file) | 308 -> `/faq` | n/t |
| `/index.html` | 301 -> `/` | 308 -> `/` | 308 -> `/` (301 with an explicit rule) | 307 -> `/` |
| `/about` | 301 -> `/how-it-works` | **200 prerendered HOME** | 301 -> `/how-it-works` (rule) | 301 (rule) |
| `/about/` | 301 -> `/how-it-works` | n/t | 404 without rule, 301 with `/about/` rule | 301 (rule) |
| `/about?x=1&y=2` | 301, query kept | n/t | 301 -> `/how-it-works?x=1&y=2` | n/t |
| `/nope` | **404** + client shell | **200 prerendered HOME (soft 404)** | **404** + client shell | **404** + client shell |
| `HEAD /nope` | 404, no body | 200 | 404, no body | n/t |
| `/Faq` | 404 | 308 -> `/Faq/` | **200 (case-insensitive)** | 404 |
| `/jobs/<32 hex>` | 200 client shell | **200 prerendered HOME** | 200 client shell (rewrite) | 200 client shell (rewrite) |
| `/jobs/abc`, `/jobs/<33 hex>` | 404 | n/t (any unmatched path gets the home page) | 200 client shell (cannot validate the id) | 200 client shell |
| `/jobs/a/b` | 404 | n/t | 200 client shell | n/t |
| `/logs` | 200 shell, noindex | n/t | 404 without rule; 200 with `/logs /jobs 200` | 404 |
| `/index.csr.html` | 404 | 308 -> `/index.csr` (-> home) | n/a (file renamed) | n/a |
| `//evil.example` | home (normalised, no redirect) | 200 home | 404 shell | n/t |
| `/_headers`, `/_redirects` | n/a | n/t | 404 (not served) | n/t |
| `POST /faq` | 405 | n/t | 405 | n/t |
| `If-None-Match` (strong or `W/`) on `/faq` | 304 | n/t | 304 | n/t |
| `Accept-Encoding: br` | gzip only (zstd/gzip via Caddy) | n/t | `content-encoding: br` | n/t |
| `Range` on a JS file | 206 | n/t | 200 (docs say Pages returns 200 for ranges) | n/t |
| `manifest.webmanifest` type | `application/manifest+json` | n/t | `application/manifest+json` | n/t |

Sources: `$LOGS/probeA.txt`, `probeB.txt`, `probeB2.txt`, `probeB3.txt`, `probeC.txt`, `probeD.txt` (n/t = not tested).

### 3.2 What follows from the matrix

1. **Unknown URLs.** A static Pages site without a root `404.html` is treated as a single-page app (docs: "assumes that you are deploying a single-page application"; observed: HTTP 200 with the prerendered home page for `/nope`, `/about`, `/jobs/<id>`, `/video-to-text.html`). That is a soft 404 for every mistyped or hostile URL, which the current server deliberately avoids (`main.py:54-58`, `main.py:795-798`). With a root `404.html` (= the Angular `index.csr.html` client shell) every unmatched URL answers a real **404** whose body is the client shell, so the in-app "Page not found" view still renders (observed on siteB/siteD; 404 answers carry `Cache-Control: no-store` on Pages).
2. **/jobs/<id> without a server.** The job lives in this browser only (IndexedDB), so the server only has to deliver the client-only shell for the URL. A `_redirects` rewrite `/jobs/* /jobs 200` plus a copy of the shell as `jobs.html` does that; the address bar keeps `/jobs/<id>` (observed), so Angular's `jobs/:id` route matches. Cost: the host cannot check that the id is 32 lowercase hex (placeholders have no regex), so `/jobs/abc` is 200 instead of 404; the Angular page already shows "transcript not found" for unknown ids (`features/job/job.ts:389-403`). Since these pages are `noindex` this has no SEO effect.
3. **Trailing slash.** Angular emits `faq/index.html`. Pages serves that at `/faq/` and 308-redirects `/faq` to it (observed on siteA), which contradicts `sitemap.xml`, `TitleService` canonicals (`title.service.ts:61-64` strips the slash) and the current 301 `/faq/ -> /faq`. Writing the obvious rule `/faq/ /faq 301` makes it worse: **infinite redirect loop** (observed, siteC: 6 redirects, still 308). Two working fixes, both tested:
   * Pages: flatten the prerendered pages in a post-build step (`faq/index.html` -> `faq.html`). Then `/faq` is 200, `/faq/` and `/faq.html` 308 -> `/faq`, `/index.html` 308 -> `/`. This reproduces the current canonical URLs exactly.
   * Workers Static Assets with `html_handling: "drop-trailing-slash"` and `not_found_handling: "404-page"`: no flattening needed, `/faq` 200, `/faq/` and `/faq/index.html` 307 -> `/faq`, unknown 404, `/Faq` 404 (case-sensitive, like today). Downside: 307 (temporary) instead of 301/308 for the slash and index forms.
4. **Case.** On Pages `/Faq` returned 200 (observed). Today it is 404. Harmless (canonical tag points at the lower-case URL; the router sees `/Faq` though, so `og:url` follows the typed path). Low risk, listed for completeness.
5. **Cache and compression defaults.** Pages sends `Cache-Control: public, max-age=0, must-revalidate`, an ETag on 200s, gzip/brotli automatically (docs and observed). Content-hashed Angular files therefore need an explicit immutable rule (below), otherwise they are revalidated every visit.
6. **Redirect/rewrite vs headers.** Docs: redirects run before headers and win. Observed locally: security headers were also present on 301/308 and on rewritten answers, and header rules match the **request** path (a rule for `/jobs/*` applied to the rewritten shell; a rule for `/logs` applied to the `/logs -> /jobs` rewrite). Treat the locally observed "headers on redirects" as unverified for production.
7. **COOP/COEP only on the transcriber page.** Because rules match the request path, `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: require-corp` on `/jobs` and `/jobs/*` appeared on those two only; `/` and `/faq` were unaffected (observed `probeB3.txt`). The plan's "ads on content pages, no ads on the transcribing page" therefore maps to header scoping plus a **full page load** (`location.assign`, not `router.navigate`) when moving from `/` to `/jobs/<id>`, because headers belong to the document, not the SPA route.
8. **Host-based rules.** `https://:project.pages.dev/*` + `X-Robots-Tag: noindex` marked `tv.pages.dev` and `abc123.tv.pages.dev` as noindex and left `transcribevid.com` and `127.0.0.1` alone (observed `probeE.txt`). This stands in for the old TrustedHost allow-list (PL-022). Docs: preview URLs are public unless protected with Cloudflare Access; `*.pages.dev` can be redirected to the custom domain with an account-level Bulk Redirect.
9. **Hard limits that bite this project (docs):** 20,000 files per Pages site (free), **25 MiB per file**, 500 builds/month, `_headers` max 100 rules, `_redirects` max 2,000 static + 100 dynamic, single `*` per rule, no query-string matching, no external proxying, no domain-level redirects in `_redirects`. Static asset requests are free and unlimited; any Functions/Worker invocation counts against 100,000 requests/day on the free plan.

### 3.3 Recommended host files (the exact set that was tested; adapt `_headers` once the worker file names are known)

`_redirects`
```
/about /how-it-works 301
/about/ /how-it-works 301
/jobs/* /jobs 200
/logs /jobs 200
/index.html / 301
```
`_headers`
```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: microphone=(self), camera=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
/main-*.js
  Cache-Control: public, max-age=31536000, immutable
/chunk-*.js
  Cache-Control: public, max-age=31536000, immutable
/styles-*.css
  Cache-Control: public, max-age=31536000, immutable
/*.png
  Cache-Control: public, max-age=86400
/jobs
  X-Robots-Tag: noindex, nofollow
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
/jobs/*
  X-Robots-Tag: noindex, nofollow
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
https://:project.pages.dev/*
  X-Robots-Tag: noindex
```
Notes: `X-Frame-Options: DENY` stays on every page (`main.py:121`); a `! X-Frame-Options` detach line was tested only as syntax (it worked) and is not part of the recommended set. The worker/bundle file names (`worker-*.js`, `ort/*`) and the favicon/manifest/robots/sitemap cache lines (1 day / 1 hour today, `main.py:688-695`) still need adding; fewer than 20 rules are used, 100 are allowed.
Post-build step (new `scripts/postbuild-static.mjs`, not written here): (1) flatten `x/index.html` -> `x.html` for every key of `dist/frontend/prerendered-routes.json` except `/`; (2) `index.csr.html` -> `404.html` and a copy `jobs.html`; (3) write `_headers` / `_redirects`; (4) fail if any `<loc>` of `public/sitemap.xml` is not in `prerendered-routes.json` (replaces `APP_PAGES` vs sitemap, `test_spa.py:159-203`); (5) fail if `404.html` is missing (replaces the Dockerfile `test -f` guards, `Dockerfile:21-24`).

## 4. Inventory

Format: `PL-id` name. What it does. Where. Static verdict + exact replacement. Evidence / notes. Risk (H/M/L).

### 4.1 Sessions, privacy, "delete my data"

**PL-001 Per-visitor isolated session (cookie `tv_sid`).** Random 32-hex id in an HttpOnly, SameSite=Lax (Secure on https) cookie; each visitor gets a private JobStore and scratch folder; others cannot see it. `sessions.py:21-22,44-97`, cookie set in `main.py:157-160`, lookup `main.py:410-420`. Verdict: CLIENT. The browser's origin storage is the isolation; no cookie is set at all (the privacy text that describes "one essential session cookie" is wrong afterwards: `features/legal/privacy.html:65-71`). Risk L.

**PL-002 GET /api/session (time left, job count).** `main.py:480-483`; frontend `api.service.ts:43-45`. Verdict: LOST as an API, CLIENT for the data (job count from IndexedDB; "time left" only if D-1 chooses an expiry). Risk L.

**PL-003 Idle expiry + reaper (30 min public, 120 local).** Session and all media deleted after idle; sessions with running work never expire. `sessions.py:117-135`, `config.py:43`. Verdict: CLIENT, optional. Replacement: purge-on-visit TTL for the local job store (D-1). Eviction by the browser (Safari 7-day rule) is the new failure mode; mitigate with `navigator.storage.persist()`. Risk M (privacy promise wording).

**PL-004 Session-ended / expiring-soon UX.** Polls `/api/session` every 60 s, banner when under 300 s left or when the session id changed; transcript page shows "session ended" instead of "not found". `session.service.ts:9-11,95-142`, `app.html:132-140`, `features/job/job.ts:263-279,389-403`, `app.ts:76-77`. Verdict: CLIENT. Replace the poll with a one-time check of the local store on load (`ended` = records existed earlier but storage is empty). No polling. Risk L.

**PL-005 "Delete my data now".** `DELETE /api/session` wipes all jobs and media immediately, keeps the cookie valid. `main.py:486-490`, `sessions.py:100-108`; UI `app.ts:191-210`, `session.service.ts:84-89`, button `app.html:41-47`. **Trap:** the whole footer block (button, note, time-left) is rendered only when `dataNote()` is truthy, and that needs `store.health()`, i.e. a server answer (`app.ts:55-70`). On a static site nothing ever answers, so the button disappears. Verdict: CLIENT. Replacement: `DataService.deleteAll()` clearing IndexedDB/OPFS job store, optionally the model Cache API, and `sessionStorage`/`localStorage` keys; show the footer unconditionally; text "removed from this browser". Risk **H** (privacy feature silently lost if SiteService is not rewired).

**PL-006 Shutdown wipe, stale-session purge, `app.cleanup`.** On SIGTERM/exit every session folder is deleted; leftovers of crashed instances purged at start and by the launcher. `sessions.py:146-170`, `jobs.py:179`, `cleanup.py:1-11`, `scripts/run.mjs:185-203`, `Dockerfile:87-89`, `docker-compose.yml:24-25`. Verdict: LOST (nothing is on a server to wipe; privacy improves). Keep for SERVER-OPTIONAL edition. Risk L.

**PL-007 Concurrent session cap (200) and "server is full" 503.** `config.py:44`, `sessions.py:85-89`, UI `http-error.ts:38-41`, `jobs.store.ts:72-83`. Verdict: LOST by design (no shared capacity). Risk L.

### 4.2 Limits, queue, capacity

**PL-008 Upload size limit (500 MB public, 4 GB local).** Declared-length check before any byte is stored, plus streaming guard; Caddy hard stop at 600 MB. `config.py:52-53`, `main.py:503-505`, `jobs.py:281-282`, `Caddyfile:72-74`, `nginx.conf.example:56-57`. Verdict: CLIENT, different meaning: no upload exists; limit becomes device-memory advice (decoding a long file to 16 kHz mono float32 is about 230 MB per hour of audio). Replacement: `device.ts` warnings (plan section 6). Risk M (phones).

**PL-009 Duration limit (60 min public).** Checked after decode. `config.py:47`, `engine.py:455-457`. Verdict: CLIENT, advisory (plan: "long video, use a computer"). Risk M.

**PL-010 Single FIFO worker + shared queue cap (30) + queue position/ETA.** `jobs.py:70,173-174`, `config.py:46`, `main.py:459` (`queue_pending`); UI status `Queued`/ETA in `app.ts:103-116`. Verdict: CLIENT. Browser runs the visitor's own jobs; keep a local queue (multi-file queue is a required feature) with the same statuses; the global queue is LOST (and no longer needed). Risk L.

**PL-011 Per-IP upload rate limit (30/h).** `limits.py:7-35`, `main.py:47,506-509`, `config.py:48`, 429 + `Retry-After`. Verdict: LOST for transcription (no server cost). Needed again for the counter Worker (PL-017) and for any SERVER-OPTIONAL download API (PL-054). Risk L.

**PL-012 Jobs-per-session quota.** `config.py:45` (default 0 = unlimited), `jobs.py:170-171`. Verdict: LOST. Risk L.

**PL-013 Free-disk guard.** Refuse uploads/downloads below 5 GB free; model download space check. `config.py:49`, `jobs.py:175-176`, `downloads.py:94-98`, `engine.py:231`. Verdict: CLIENT: `navigator.storage.estimate()` check before downloading a model or decoding a file; message "not enough free storage". Risk M (a 1.5 GB model on a phone).

**PL-014 Public-limits announcement and mode switch (`/api/health`).** Health returns brand, limits, `public`, `allowed_models`, `logs_enabled`, `queue_pending`, no hardware on public. `main.py:446-459`. The UI branches on it everywhere: `SiteService` (`site.service.ts:339-428`), assumed-public defaults for prerendered pages (`site.service.ts:311-324`, `platform.ts:451-461`), wording in `app.ts:54-70`, FAQ/privacy/upload limit text. Verdict: CLIENT. Replace the server answer with a build-time constant (`site.config.ts`: brand, domain, url, contact email, `public: true`, models offered by device tier, no queue) so `answered()`/`mode` are never `unknown`; delete the 60 s session and health polling. The 500 MB / 60 min numbers in copy (`PUBLIC_DEFAULTS`, `site.service.ts:311`) become device-dependent advice. Risk M (many strings and spec tests depend on it; see also PL-005).

**PL-015 Allowed-model list (`VT_ALLOWED_MODELS`).** Public server offered only base, small, large-v3-turbo; `allowedModels` hides others in the UI. `config.py:50`, `engine.py:153,214`, `site.service.ts:372-375`, `.env.example` (`VT_ALLOWED_MODELS=base,small,large-v3-turbo`). Verdict: CLIENT: the restriction existed for server throughput. In the browser the allow-list becomes a device-capability filter, which RESTORES tiny/medium/large-v3/distil-large-v3 and the experimental Qwen entries to public visitors (owner rule: keep all models). Qwen3-ASR/IndicXlit feasibility belongs to the engine track. Risk M.

**PL-016 /api/models and /api/languages.** Reference data. `main.py:470-477`, `jobs.store.ts:55-58`, `api.service.ts:50-55`. Verdict: KEEP as static JSON/TS constants (`models.json`, `languages.json`) generated at build; no request. Risk L.

**PL-017 Anonymous "videos transcribed" counter.** One integer + timestamp, persisted atomically (temp file, fsync, `os.replace`), corrupt file quarantined, counted exactly once per uploaded file when its job first reaches `done` (not failed/cancelled, not re-runs), 30-second public cache, `{"transcribed": n, "counting": bool}`; header pill hidden until >=1; local copies show 0 plus a tooltip. `stats.py:31-181`, `jobs.py:485-497,574`, `config.py:61-67`, `main.py:462-467`; client `stats.service.ts` (poll 60 s, +2 s after own job finishes, hide after 3 failures, `:262-266`), `api.service.ts:35-41`, `app.html:79-83,171`. Verdict: WORKER.
Replacement: one Worker bound to the same-origin route `transcribevid.com/api/stats` (GET) and `.../api/count` (POST), so `ApiService.stats()` and the `{transcribed, counting}` contract stay unchanged. Backing store: Durable Object with SQLite (atomic increments, docs: free plan 100,000 requests/day, 5 GB) rather than KV (docs: free plan 1,000 writes/day, 100,000 reads/day; no atomic increment, so concurrent increments lose updates). The client posts once per upload when its first successful run finishes (re-use the `origin`/`counted` logic of `jobs.py:485-497` in the browser store). Free-tier budget: Worker requests are limited to 100,000/day in total (docs), so lengthen the poll from 60 s to about 5 min and stop polling when hidden (already done, `stats.service.ts:226-228`); on quota exhaustion `StatsService` already hides the pill silently.
Honest loss: the old number was server-verified; the new one is client-reported and can be inflated by anyone who can POST. Mitigate with an Origin check, a Cloudflare rate-limiting rule or Workers rate-limit binding per IP, and a daily cap; do not describe it as verified. `counting:false` copies (local dev) keep working by returning that flag when the route is absent. Risk M.

### 4.3 Security headers, CSRF, host allow-list

**PL-018 Security headers on every response (pages, files, redirects, 404s, API).** `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy: microphone=(self), camera=(), geolocation=()`. `main.py:119-124,147-149`, `Caddyfile:76-86` (`defer` so Caddy wins), `nginx.conf.example:70-74`; contract `test_spa.py:340-349`. Verdict: HOST-RULE: `/*` block in `_headers` (section 3.3). Observed on 200s, 404s and (locally) on redirects. The microphone grant is what keeps in-page recording working; do not drop it. If AdSense frames are added later, `X-Frame-Options` concerns only our own pages being framed and stays. Risk L.

**PL-019 HSTS (public https only).** 1 year, includeSubDomains. `main.py:155-156`, `Caddyfile:78`, `nginx.conf.example:70`. Verdict: HOST-RULE (`_headers`, or the zone's HSTS setting in the dashboard; the dashboard setting was not verified). No `preload`, as today. Risk L.

**PL-020 Deliberately no CSP.** `test_spa.py:349`: Angular's inline styles. Verdict: KEEP (no CSP). A strict CSP would also be incompatible with AdSense. Risk L.

**PL-021 CSRF guard (OriginGuard) + CORS allow-list.** POST/PUT/PATCH/DELETE with a foreign or `null` Origin gets 403; `Content-Type: application/octet-stream` required to force a preflight. `main.py:185-204,378-380,500-502`, `config.py:105-107`, tests `test_api.py:319-335`, `test_sessions.py:361-366`. Verdict: LOST for the static site (no state-changing endpoint of ours that cookies could authorise). Required again for the counter Worker POST (Origin must equal `https://transcribevid.com` or `https://www...`) and for the SERVER-OPTIONAL API (unchanged code). Risk L.

**PL-022 Host-header allow-list (TrustedHost, DNS-rebinding guard).** Only canonical host, www, localhost, configured extras. `main.py:365-383`, test `test_api.py:307-316`, `test_sessions.py:348-358`. Verdict: HOST-RULE: Pages answers only for the attached custom domains and `*.pages.dev`; the leftover exposure is duplicate content on `*.pages.dev` and preview URLs: add the `https://:project.pages.dev/*` noindex rule (observed working) and, optionally, an account-level Bulk Redirect `*.pages.dev -> https://transcribevid.com` (docs). Risk M.

**PL-023 API responses never cacheable + never indexable.** `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow` on `/api/*`. `main.py:150-154`, tests `test_spa.py:293-304`, `test_api.py:345-352`. Verdict: KEEP in the SERVER-OPTIONAL API; on the static site only the counter Worker exists, whose `/api/stats` is deliberately public-cacheable (30 s today, `main.py:466`). Risk L.

**PL-024 Safe static-file resolution and path-traversal defence.** Rejects `..`, backslash, NUL, symlink escape; `//evil` normalised; no open redirect. `main.py:772-781`, tests `test_spa.py:246-264,411-464`. Verdict: HOST-RULE (the platform serves from an immutable asset manifest, nothing to traverse). Observed: `//evil.example` -> 404 shell, `/_headers`/`/_redirects` not served. Risk L.

**PL-025 Log-forging defence and privacy-conscious access log.** Paths are `unicode_escape`d before logging; Caddy drops the query string and all request/response headers from its JSON access log; nginx logs `$uri` only. `main.py:181`, `Caddyfile:40-48`, `nginx.conf.example:15-17`, test `test_api.py:355-360`. Verdict: LOST/N/A. Cloudflare processes request IPs at the edge; the privacy page must say so (the current Caddy note already warns that the IP is logged, `Caddyfile:34-39`). Risk L.

**PL-026 Unhandled error -> JSON 500.** `main.py:402-405`. Verdict: N/A on static; SERVER-OPTIONAL API keeps it. Risk L.

### 4.4 Delivery: compression, validators, caching, media types

**PL-027 gzip for text answers (pure-ASGI `Compress`) + Caddy/nginx compression.** Positive content-type list, never SSE/media/PDF, `Accept-Encoding` q-values parsed, weak ETag on compressed bodies, in-memory cache of compressed build files. `main.py:236-362`, `config.py:98`, `Caddyfile:54-68`, `nginx.conf.example:62-65`, tests `test_seo.py:230-390`. Verdict: HOST-RULE (nothing to write): Pages serves gzip and brotli automatically (docs; observed `content-encoding: br` for `Accept-Encoding: br`). Risk L.

**PL-028 ETag / Last-Modified / 304.** Strong ETag of the exact bytes, `If-None-Match` wins over `If-Modified-Since`, weak comparison. `main.py:702-717,739-744,788-792`, tests `test_seo.py:195-227`. Verdict: HOST-RULE: Pages always sends ETag on 200s (docs); observed 304 for strong and `W/` validators on `/faq`. No `Last-Modified` was listed in the probe; not relied on. Risk L.

**PL-029 Cache-Control policy by file kind.** Hashed `main-XXXX.js`/`chunk-`/`styles-` immutable 1 year; icons/manifest 1 day; robots.txt and sitemap.xml 1 hour; pages and everything else `no-cache`. `main.py:52,70,688-695`, test `test_spa.py:315-329`. Verdict: HOST-RULE. Pages default is `max-age=0, must-revalidate` for everything (observed), so only the immutable/1-day/1-hour lines in `_headers` are needed (observed: immutable on `/main-*.js`, 86400 on `/*.png`). The unhashed ONNX/wasm assets and any worker file names must be added once the engine track fixes them. Risk L.

**PL-030 Correct media types.** `.webmanifest`, `.xml` forced. `main.py:71`. Verdict: HOST-RULE/KEEP: observed `application/manifest+json`, `application/xml`, `image/svg+xml` with no help. Risk L.

**PL-031 HEAD parity with GET.** Crawlers and uptime monitors. `main.py:446,462,747`, tests `test_spa.py:267-290`. Verdict: HOST-RULE: observed `HEAD /nope` 404 and `HEAD /faq` 200 without body (siteB). Risk L.

### 4.5 Canonical host, redirects, 404 contract

**PL-032 www -> apex 301 (308 for non-GET), query kept.** `main.py:207-233`, `Caddyfile:26-29`, `nginx.conf.example:32-42`, test `test_sessions.py:334-345`. Verdict: HOST-RULE, dashboard only (not verifiable here): custom domain `transcribevid.com` on the Pages project (apex requires the zone on Cloudflare nameservers, docs), Bulk Redirect `www.transcribevid.com -> https://transcribevid.com` (301, preserve query/path/subdomain), a proxied DNS record for `www` (`A 192.0.2.1`, docs). `_redirects` cannot do domain-level redirects (docs). Risk M (must be done by hand, and DNS has to move to Cloudflare).

**PL-033 http -> https 301.** `main.py:225-226`; Caddy does it automatically. Verdict: HOST-RULE: zone setting "Always Use HTTPS" (dashboard, docs-level only). Pages only answers on HTTPS for `*.pages.dev`. Risk L.

**PL-034 Trailing-slash 301 (`/faq/` -> `/faq`, including `/jobs/<id>/`).** `main.py:767-768`, tests `test_spa.py:206-243`. Verdict: HOST-RULE via the flatten step (Pages) or `drop-trailing-slash` (Workers assets): see section 3.2 item 3. Do NOT write `/faq/ /faq 301` in `_redirects` (loop, observed). Risk **H** if the raw build is deployed: `/faq` becomes 308 -> `/faq/`, contradicting sitemap and canonical tags.

**PL-035 `/index.html` and `/<page>/index.html` -> canonical, 301.** `main.py:769-770`. Verdict: HOST-RULE: automatic (308 on Pages, 307 on Workers assets, observed); an explicit `/index.html / 301` line gives a true 301 (observed). After flattening, `/faq/index.html` is a 404 shell instead of a redirect (harmless). Risk L.

**PL-036 Moved pages: `/about` -> `/how-it-works` 301, query kept.** `main.py:66,765-766`, `app.routes.ts:81` (client redirect after load), test `test_spa.py:213-226`. Verdict: HOST-RULE: `/about /how-it-works 301` and `/about/ /how-it-works 301` (observed 301, query preserved). Without it `/about` is a soft-404 home page on raw Pages (observed). Risk M.

**PL-037 True 404 for unknown URLs + the `APP_PAGES` list.** Real pages (200): home, how-it-works, faq, privacy, terms, logs, six tool pages, `/jobs/<32 hex>`; anything else 404 with the client shell. List in `main.py:58-63,74-76,795-798`; tests `test_spa.py:102-137,189-203`; frontend sources of truth `app.routes.ts`, `tool-pages.list.ts`. Verdict: HOST-RULE: root `404.html` (= `index.csr.html`) makes every file-less URL a real 404 with the shell as body (observed); the set of valid pages is whatever files the build emitted, so the second hand-maintained list disappears; consistency is enforced at build time (section 3.3 step 4). Lost: id-format validation for `/jobs/*` and strict case. Risk **H** if no `404.html` is shipped (200 soft-404 for everything, observed).

**PL-038 Client-only shell `index.csr.html` for `/jobs/<id>`; never served under its own name; prerendered home distinct from the shell.** `main.py:67,782-798`, `app.routes.server.ts:26-30`, test `test_spa.py:352-388`. Verdict: HOST-RULE: `404.html` + `jobs.html` copies and the `/jobs/* /jobs 200` rewrite. Raw Pages would serve the prerendered HOME for `/jobs/<id>` (observed): the app would still boot and route client-side but the first paint and any crawler would see the home text. `/404`, `/jobs` and `/404.html`->`/404` become reachable aliases (200, noindex by route data); acceptable. Risk **H** (as PL-037).

**PL-039 Prerendered public pages (SSG) with per-page title, description, canonical, OG/Twitter, JSON-LD.** `angular.json:59-76` (`outputMode: static`, `server: src/main.server.ts`), `app.routes.server.ts:13-31`, `app.config.server.ts`, `structured-data.service.ts`, `title.service.ts`; build guards `Dockerfile:19-24`. Verdict: KEEP. Build output is already static; only the post-build normalisation (section 3.3) is new. Pages build settings: root directory = this repo's frontend folder, build `npm ci && npm run build && node scripts/postbuild-static.mjs`, output `dist/frontend/browser`, `NODE_VERSION=22`. Risk L.

**PL-040 `<noscript>`/boot fallback text and static meta in `index.html`.** `frontend/src/index.html:15-16,61-96`. Verdict: KEEP. Risk L.

### 4.6 SEO files and crawler rules

**PL-041 `X-Robots-Tag: noindex, nofollow` for `/api/`, `/logs`, `/jobs/` (+ meta robots by route data).** `main.py:68-69,150-151`, `title.service.ts:59,76`, `app.routes.ts:59,106,111`, tests `test_spa.py:293-312`. Verdict: HOST-RULE: `/jobs`, `/jobs/*`, `/logs` entries in `_headers` (observed on siteB, including on the rewritten answers). Note (existing, unchanged): `robots.txt` also `Disallow`s these paths, so Google cannot fetch the header; harmless. Risk L.

**PL-042 `robots.txt`, `sitemap.xml` (11 URLs, no lastmod), `manifest.webmanifest`, favicons, og-image.** `frontend/public/*`; contracts `test_seo.py:394-436`, `test_spa.py:159-188`, `tool-pages.list.spec.ts:139+`, `app.routes.server.spec.ts`. Verdict: KEEP (files ship as-is; `Disallow: /api/` can stay or go). Port the four file-content tests to vitest (section 7). `robots.txt` cache 1 h via `_headers`. Risk L.

**PL-043 Search-engine ownership tags (`VT_GOOGLE_SITE_VERIFICATION`, `VT_BING_SITE_VERIFICATION`) injected after `<head>`; HTML-file method.** `config.py:69-95`, `main.py:720-744`, tests `test_seo.py:91-170`, `deploy/SEO.md` step 2. Verdict: HOST-RULE/build step: prefer the DNS TXT method (needs no site change; SEO.md already recommends it, and the zone will be on Cloudflare DNS anyway); the HTML-file method is a file in `frontend/public/` (served as-is); the meta-tag method becomes an env-driven injection in `postbuild-static.mjs` (Pages build env vars) if wanted. AdSense adds its own verification snippet / `ads.txt` in `public/` (plan section 6). Risk L.

**PL-044 IndexNow key file and submit script.** `/<key>.txt` served only when the key is valid; `scripts/indexnow.mjs:1-49` reads the live sitemap, checks the key URL, POSTs to `api.indexnow.org`. `config.py:88-95`, `main.py:752-755`, tests `test_seo.py:174-193`. Verdict: KEEP script (Node, runs in CI or by hand after a deploy); the key becomes a committed file `frontend/public/<key>.txt` (the key is public by design). Evidence that this must stay a Node/CI step: `api.indexnow.org` sent no CORS header (`cors-evidence.txt`), irrelevant for a script. Risk L.

**PL-045 Structured data, canonical/og:url, brand from server.** `structured-data.service.ts`, `title.service.ts:46-77`, `site.service.ts:355-363`. Verdict: KEEP; brand/contact come from the build constant of PL-014 (the contact e-mail `VT_CONTACT_EMAIL` becomes a build env var; today empty -> the Privacy/Terms pages show no address). Risk L.

### 4.7 Logs

**PL-046 In-memory ring-buffer logging for the whole backend.** 10,000 records (`VT_LOG_BUFFER`), seq numbers, level/q filters, third-party loggers attached. `logbuffer.py:26-126`. Verdict: SERVER-OPTIONAL (only meaningful with a server process). Risk L.

**PL-047 Logs API: read, follow (SSE), clear, admin token (Bearer or `?token=`), closed by default on public.** `logs_api.py:74-118`, `main.py:386-399`, tests `test_sessions.py:300-322`. Verdict: SERVER-OPTIONAL. Static replacement: none for operators. Risk M (see PL-049).

**PL-048 Logs page (live follow, filters, token prompt) + nav link only when the server enables logs.** `features/logs/logs.ts` (`api.logs` `:101`, `EventSource` `:152`), `logs-token.ts`, `api.service.ts:103-112`, `app.html:74,167`. Verdict: CLIENT. The page keeps working against a local ring buffer fed by `LogService` (engine/worker/decoder/VAD messages, which is genuinely useful in the browser); the link is shown with `?debug` / a build flag; the token UI is hidden. Risk L.

**PL-049 Browser error reports -> server (`POST /api/logs/client`, rate-limited 100/s, sanitised).** `logs_api.py:121-133`, `log.service.ts:549-582`, interceptor `log.service.ts:596-609`. Verdict: LOST on the static site (no endpoint), which also fits the "your file never leaves your device" message. Console logging stays. The operator loses visibility of visitors' failures; closest alternative: an opt-in "copy diagnostics" button that puts the local log in the clipboard / a pre-filled mailto, no automatic telemetry. Risk M.

**PL-050 Request access log with levels (polling at DEBUG).** `main.py:50-51,127-182`. Verdict: LOST/N/A; Cloudflare Web Analytics (cookieless) or nothing. Risk L.

### 4.8 Link download (YouTube / Instagram)

**PL-051 URL allow-list and normalisation.** Only canonical YouTube watch/shorts/embed/live and instagram reel/p/tv URLs; no credentials, ports, backslashes, control chars; messages "Paste a YouTube video/Shorts link or an Instagram Reel/video post link." `downloads.py:26-53`, tests `test_downloads.py:15-40`. Verdict: CLIENT (copy the pure function to TypeScript, keep the same error text, test with the same vectors). Needed even when only the optional API downloads. Risk L.

**PL-052 yt-dlp extraction + download in a killable spawned process.** Formats `bestvideo[ext=mp4][vcodec^=avc1]...+bestaudio[ext=m4a]` capped at 360/720/1080, no playlists/carousels/live, size and duration caps (500 MB, 60 min, 600 s timeout), generic extractor off (`allowed_extractors: youtube, instagram`), Node/Deno runtime for YouTube's JS challenge, ffmpeg merge, error messages sanitised so signed URLs never leak. `download_worker.py:44-115`, `DOWNLOADS.md`, `config.py:55-59`, `requirements.txt` (`yt-dlp[default]`). **Cannot run in a browser or on Pages/Workers.** Evidence (`cors-evidence.txt`, request with `Origin: https://transcribevid.com`): `https://www.youtube.com/watch?v=...` returns 200 with **no `Access-Control-Allow-Origin`**; `https://www.instagram.com/reel/...` returns 200 with no ACAO and `Cross-Origin-Resource-Policy: same-origin`. A page script therefore cannot read either platform's HTML/player JSON, and cannot read the googlevideo media URLs. Separately, yt-dlp is Python and needs ffmpeg plus a Node/Deno runtime, and Workers cannot spawn processes (architecture reasoning, not measured here). Verdict: SERVER-OPTIONAL. Replacement: keep the existing `downloads*.py` + `download_worker.py` as a small self-hosted "download helper" API (needs a cheap VPS, ffmpeg, Node 22; no GPU; platforms may block datacentre IPs, as `DOWNLOADS.md` already warns). The browser UI shows "Download from link" only when `downloadApiBase` is configured, sends cookies-less requests, then feeds the returned MP4 into the normal in-browser pipeline. Without that helper the feature is LOST on the free static site; closest free alternatives for the user: (1) "Record tab audio" through `getDisplayMedia` (real-time, user plays the video), (2) a direct-URL field that works only for hosts that send CORS headers, (3) text explaining how to save the file and drop it. Risk **H** (named required feature).

**PL-053 SSRF guard: resolver rejects non-public IPs.** `download_worker.py:21-28`, test `test_downloads.py:157-170`. Verdict: SERVER-OPTIONAL (unchanged code). Risk L.

**PL-054 Download queue and per-session limits.** 2 worker threads, 20 global slots, 2 active and 10 retained per session, per-IP rate limit shared with uploads, 429/507 messages, cancel kills the process tree, partial files deleted, cancel beats late success. `downloads.py:15-17,80-115,117-206`, `downloads_api.py:18-58`, `download_worker.py:118-176`, tests `test_downloads.py:59-190`. Verdict: SERVER-OPTIONAL (unchanged). On a static front end the session identity is gone, so a helper API needs its own isolation: a random download id returned to the browser as capability token, files deleted on first fetch or after 10 minutes, per-IP rate limit. Risk M.

**PL-055 Same-origin MP4 hand-off with auto-save and "Save video" fallback.** `downloads_api.py:52-56`, `features/download/downloader.ts:59-122`, `fileUrl()` `:106`. Verdict: SERVER-OPTIONAL: the helper needs CORS for `https://transcribevid.com` and `Content-Disposition` exposure (the current `CORSMiddleware` already exposes it, `main.py:378-379`). Risk M.

**PL-056 Downloader UI state machine (poll 1.2 s, restoring, cancelling, session-ended message).** `downloader.ts:25-137`. Verdict: CLIENT, behind the SERVER-OPTIONAL switch. Risk L.

### 4.9 CLI, Docker, Caddy/nginx/systemd, scripts, build

**PL-057 CLI `backend/cli.py`.** Transcribe a file locally, engines whisper/qwen, romanizer auto/indicxlit/basic, language, translate, output script hinglish/original, prompt, formats txt/plain/srt/vtt/md/json. `backend/cli.py:1-52`. Verdict: SERVER-OPTIONAL = keep as is (it does not use the web server). It is the only way to run faster-whisper, Qwen3-ASR and trained IndicXlit exactly as today, so it is the fallback behind "no feature dropped". Keep `backend/app/*`, `requirements*.txt`, `backend/tests`, `backend/tools`. Risk **H** if step 4 of the plan deletes `backend/` (see PL-058).

**PL-058 Plan step 4 "REMOVE backend, Dockerfile, docker-compose, deploy, proxy.conf".** Plan section 6. Verdict: DO NOT remove `backend/`, `Dockerfile`, `docker-compose.yml`, `deploy/` wholesale. Move them under a documented "self-hosted edition" (e.g. keep in place, mark README "optional"), because they carry CLI, link download, Qwen and the golden-transcript tests (`backend/tests/golden`, kept by the plan). What may be removed from the *public* deployment path: running them in production. Risk **H**.

**PL-059 Dockerfile (2-stage image).** Stage 1: Node 22 builds Angular with prerender and fails the build if `index.csr.html`, `faq/index.html`, `how-it-works/index.html` are missing; stage 2: Python 3.12 slim + Noto/CJK fonts for PDF export, non-root user, Node copied in for yt-dlp, `VT_*` env, `/api/health` healthcheck, SIGTERM wipe. `Dockerfile:11-24,29-37,43-46,51,65-77,84-89`. Verdict: SERVER-OPTIONAL (self-hosted edition) + the Stage-1 guard logic moves into `postbuild-static.mjs`. PDF export: the server's fpdf2 + fonts (`pdf.py`) is replaced by print-to-PDF in the browser (plan section 5); that is the UI/export track's call, listed here only because the fonts live in this Dockerfile. Risk M.

**PL-060 docker-compose stack.** app + caddy, `read_only`, `cap_drop: ALL`, `no-new-privileges`, tmpfs `/tmp`, volumes `models` (0.15-3 GB Whisper cache), `scratch`, `stats` (the counter), `caddy_data`; Caddy waits for app health. `docker-compose.yml:18-82`. Verdict: SERVER-OPTIONAL. Mapping of the three data volumes: models -> browser Cache API/OPFS (+ `storage.persist()`), scratch -> memory/OPFS, stats -> Durable Object (PL-017). Risk L.

**PL-061 Caddyfile (self-hosted ingress) and the operations guide `deploy/README.md`.** Directives and their static equivalents: `www` redirect `Caddyfile:27-29` -> PL-032; automatic HTTPS/ACME `:9` -> Cloudflare Universal SSL; JSON log without query/headers `:40-48` -> PL-025; `encode zstd gzip` with positive list `:54-68` -> PL-027; `request_body max_size 600MB` `:72-74` -> PL-008; header block with `defer` `:76-86` -> PL-018/019; `reverse_proxy` with `flush_interval -1`, read timeout 1 h `:88-101` -> not needed (no SSE, no uploads). The README's server rental, SSH/firewall hardening, backups, capacity and `10.x` monitoring sections have no static equivalent; replacement process: Git-connected Pages deploy, immutable deployments with one-click rollback, preview deployments (noindex per PL-022). Verdict: SERVER-OPTIONAL. Risk L.

**PL-062 nginx example and systemd unit.** Same headers and compression as Caddy (`nginx.conf.example:62-74`), `proxy_hide_header` to avoid duplicates (`:83-87`); unit with sandboxing, `KillSignal=SIGTERM`, `TimeoutStopSec=20` (`transcribevid.service:24-28,37-47`). Verdict: SERVER-OPTIONAL. Risk L.

**PL-063 Environment settings `VT_*`.** See section 6 for the full mapping. Verdict: mostly LOST; the ones that survive for the self-hosted edition are unchanged. Risk L.

**PL-064 `scripts/indexnow.mjs`** is PL-044. **`scripts/lighthouse.mjs`:** audits every public page plus one `/jobs/<random>` page, mobile and desktop, against the PRODUCTION build served by the real backend with `VT_PUBLIC=1`; exit 1 below targets (a11y/best-practice/SEO 100, mobile perf 95). `scripts/lighthouse.mjs:1-14,25-30`. Verdict: HOST-RULE: change step 2 to serve `dist/frontend/browser` with `wrangler pages dev` (the same rules as production), which also keeps `/jobs/<random>` audited as the not-found transcript view. SEO category is skipped for `/jobs/` as today. Risk L.

**PL-065 `scripts/run.mjs` launcher (`npm run dev | start | test | setup | test:real | test:backend | test:frontend`).** Creates the Python venv and installs `requirements-dev.txt`, installs frontend deps, starts uvicorn `--reload` plus `ng serve` with an `/api` proxy, waits for `/api/health`, opens Chrome, shuts down with a session-folder sweep. `scripts/run.mjs:108-128,211-246`, root `package.json:6-14`. Verdict: HOST-RULE (dev/build tooling): `dev` = `ng serve` only (+ `VT_API` env to proxy to a self-hosted API when wanted), `start` = build + `wrangler pages dev` (or `npx serve` with a 404 fallback) so local behaviour equals Pages, `test` = vitest (+ pytest only for the self-hosted edition), `test:real`/`test:backend` unchanged. Without this change `npm run dev` hangs waiting for `/api/health`. Risk **H** (daily workflow).

**PL-066 Angular dev proxy `proxy.conf.cjs` and `angular.json` `serve.options.proxyConfig`.** `/api` -> `127.0.0.1:${VT_PORT||8000}`. `proxy.conf.cjs:1-8`, `angular.json:96-98`. Verdict: KEEP, optional (only needed with the self-hosted API; the plan lists it for removal). Risk L.

**PL-067 Angular production build settings.** `outputMode: "static"`, prerender via `src/main.server.ts`, `outputHashing: all`, budgets: initial warning 500 kB / error 1 MB, component styles warning 16 kB / error 24 kB. `angular.json:59-76`. Verdict: KEEP; the in-browser engine (transformers.js, ORT, VAD, ffmpeg.wasm) must be lazy chunks or workers, never in the initial bundle, or the 1 MB budget error fails the build. Risk M.

**PL-068 Client request layer: HttpClient + error interceptor, polling, SSE.** `app.config.ts:13-17`, `jobs.store.ts:37-88` (poll 2 s while running, 15 s idle; "offline" banner `app.html:125`, `devHint` `site.service.ts:412-422`), `api.service.ts:123-140` (EventSource per job), `http-error.ts`. Verdict: CLIENT (engine track replaces transport with a worker `postMessage`). Platform consequence: the "Backend unreachable" offline banner and Retry/busy toasts must never show on the static site; keep `http-error.ts` only for the optional downloader/counter calls. Risk M.

**PL-069 Static asset size and file-count limits of the host.** New constraint, no old equivalent. Pages free plan: 25 MiB per file, 20,000 files. Measured for the dependency pinned by `@huggingface/transformers@4.3.1` (`onnxruntime-web@1.31.0-dev.20260914-8d85527a0`, `npm pack`, uncompressed sizes in `$LOGS/ort-sizes.txt`): `ort-wasm-simd-threaded.jsep.wasm` 27.0 MiB, `.asyncify.wasm` 25.6 MiB, `.jspi.wasm` 16.0 MiB, `.wasm` 13.6 MiB. The WebGPU (`jsep`) runtime exceeds the Pages limit, so it cannot be served from the Pages site itself; load it from jsDelivr (jsDelivr answers with `Access-Control-Allow-Origin: *` and `Cross-Origin-Resource-Policy: cross-origin`, `cors-evidence.txt`, which also suits COEP `require-corp`), or from R2 / another host (the header check was made on an unrelated jsDelivr npm file, not on the wasm itself). Models likewise stay on huggingface.co (it echoed `Access-Control-Allow-Origin: https://transcribevid.com`, `cors-evidence.txt`). Verdict: HOST-RULE (configure `env.backends.onnx.wasm.wasmPaths`, engine track). Risk **H** (launch blocker if missed).

**PL-070 Package manager scripts at the root and in `frontend/`.** Root: `dev`, `start`, `build` (= `npm --prefix frontend run build -- --configuration production`), `test`, `setup`, `test:real`, `test:backend`, `test:frontend` (`package.json:6-14`); frontend: `ng`, `start`, `build`, `watch`, `test` (vitest via `ng test --watch=false`), `test:watch` (`frontend/package.json:4-11`). Verdict: KEEP `build`, `test:frontend`, frontend scripts; re-point the rest (PL-065). New: `build:static` (= build + `postbuild-static`), `verify:static` (section 9). Do not run `npm install`/`npm ci` in the frontend folder from automation outside the normal workflow. Risk L.

## 5. Behaviours lost for good (with the closest alternative)

| Lost | Why | Closest alternative |
|---|---|---|
| Server-verified global counter | Count is now reported by the visitor's browser | Same pill, same endpoint contract, DO-backed, rate-limited; never described as verified (PL-017) |
| Operator view of visitors' errors and requests (`/api/logs`, `/api/logs/client`) | No server; also contradicts "file never leaves your device" | Local Logs page, "copy diagnostics" button (PL-048/049) |
| Global queue, "server busy" feedback, per-IP limits | No shared compute | Local queue; device warnings (PL-010/011) |
| Cookie-isolated server sessions, 30-min server-side expiry | Data is local | IndexedDB + TTL purge + Delete my data (D-1, PL-001/003/005) |
| Link download on the free static site | CORS and no process execution (PL-052) | Self-hosted helper API (SERVER-OPTIONAL), tab-audio capture, direct CORS-enabled URLs |
| Byte-exact server PDF layout (fpdf2 + fonts) | Not in this track | Browser print stylesheet (plan section 5; export track) |
| `/jobs/<non-hex>` and `/Faq` returning 404 (Pages only) | Host cannot validate ids; Pages routing is case-insensitive | Client "not found" page; canonical tags; use Workers assets if exact parity is wanted |
| HSTS/headers guarantee on redirect responses | Docs say redirects win over `_headers` | Verify on a real deployment; redirects carry no sensitive content |
| 301 for the slash/index forms on Workers assets | Platform emits 307 | Use Pages + flatten if 301/308 is required |
| Idle "session ends in N min" banner | No expiry | Optional "stored on this device for N days" note |

## 6. `VT_*` settings -> static equivalent

| Setting (default public) | Static outcome |
|---|---|
| `VT_PUBLIC`, `VT_PUBLIC_URL`, `VT_BRAND_*`, `VT_CONTACT_EMAIL` | build constant `site.config.ts` (PL-014/045) |
| `VT_ALLOWED_HOSTS`, `VT_TRUST_PROXY`, `VT_CORS_ORIGINS`, `ACME_EMAIL` | Cloudflare custom domain + Bulk Redirect; counter Worker Origin allow-list |
| `VT_ADMIN_TOKEN`, `VT_LOG_BUFFER` | SERVER-OPTIONAL only |
| `VT_SESSION_IDLE_MINUTES`, `VT_MAX_SESSIONS`, `VT_MAX_JOBS_PER_SESSION` | D-1 TTL; others LOST |
| `VT_MAX_QUEUE`, `VT_RATE_UPLOADS_PER_HOUR`, `VT_MIN_FREE_GB`, `VT_CPU_THREADS`, `VT_WARMUP`, `VT_DEVICE`, `VT_COMPUTE_TYPE` | LOST / replaced by `device.ts` |
| `VT_MAX_UPLOAD_MB`, `VT_MAX_DURATION_MIN` | advisory device limits (PL-008/009) |
| `VT_ALLOWED_MODELS` | device-tier filter (PL-015) |
| `VT_COUNT_JOBS`, `VT_STATS_FILE` | counter Worker (`counting` flag) |
| `VT_GOOGLE_SITE_VERIFICATION`, `VT_BING_SITE_VERIFICATION`, `VT_INDEXNOW_KEY` | DNS TXT / `public/` files / build env (PL-043/044) |
| `VT_COMPRESS`, `VT_STATIC_DIR` | not needed |
| `VT_MAX_DOWNLOAD_MB`, `VT_MAX_DOWNLOAD_MINUTES`, `VT_DOWNLOAD_TIMEOUT_SECONDS` | SERVER-OPTIONAL helper |

## 7. Automated checks: what happens to the pytest files

| File (test functions) | Fate |
|---|---|
| `test_spa.py` (39) | Replace with a host-contract test: serve the built folder through `wrangler pages dev` (or Miniflare) and assert the matrix in section 3.1: all sitemap URLs 200, unknown 404 with shell, slash/index/moved redirects, `/jobs/<hex>` 200 shell with noindex + COOP/COEP, security headers on 200/404, HEAD parity, no `_headers` leak. Path-traversal tests (`:411-464`) are dropped (platform concern). Keep the "backend knows every frontend tool page" idea as the build check in `postbuild-static.mjs`. |
| `test_seo.py` (32) | gzip/ETag/304/Range tests (`:195-390`) are the platform's job: drop, but keep two live assertions in the host-contract test (304, br). Port `:394-436` (sitemap dates, robots allows pages, manifest matches theme and lists real icons, favicon files exist) to vitest; they only read `frontend/public`. Verification-tag and IndexNow tests (`:91-193`) move to the postbuild script's unit tests. |
| `test_sessions.py` (29) | Server session tests stay with the self-hosted edition. Add Vitest specs for the client data service: isolation by origin is automatic, `deleteAll()` clears everything, TTL purge, eviction detection. |
| `test_stats.py` (46) | Counter semantics (once per upload, not for fail/cancel/rerun, never fails the job, corrupt file handling) re-expressed as Worker tests (Miniflare/Vitest pool) for atomic increment, Origin check, rate limit, cacheable GET; client counted-once logic as a Vitest spec. Python file stays for the self-hosted edition. |
| `test_api.py` (26) | Stays for the self-hosted edition; log-forging, CSRF, content-type tests have no static counterpart. |
| `test_downloads.py` (11) | Stays (helper API). Port the 17 URL vectors (4 accepted, 13 rejected, `:15-40`) to a TypeScript spec for PL-051. |
| Frontend specs mentioning server wording | Plan section 6 lists `legal.spec.ts`, `faq.spec.ts`, `how-it-works.spec.ts`, `app.spec.ts`; add `session.service.spec.ts`, `stats.service.spec.ts`, `site.service.spec.ts`, `log.service.spec.ts`, `jobs.store.spec.ts`, `api.service.spec.ts` which encode the server contract. |

## 8. Open items / risks to close before launch

1. Real Cloudflare preview deployment: repeat the matrix (section 9 script) and check `_headers` on redirect responses, case handling, `Always Use HTTPS`, HSTS, Bulk Redirect for `www`, brotli.
2. Decide D-1 .. D-4 (section 2).
3. Wire `SiteService`/`app.ts` to the build constant before anything else, or the data footer and several limit strings disappear (PL-005, PL-014).
4. Counter Worker: store choice, Origin check, rate limit, quota behaviour (PL-017).
5. ORT wasm hosting (PL-069) and the exact worker/wasm file names for `_headers` caching.
6. Keep `backend/` and re-point `npm run dev|start|test` (PL-058, PL-065).
7. Privacy/Terms/FAQ wording about the session cookie, server retention, 500 MB / 60 min limits, "no third-party scripts" (also named in the plan) and Cloudflare as processor of IP addresses.
8. `deploy/SEO.md` checklist: update steps 1, 2, 7 (hosting words, `VT_` settings, `/logs`/`/api/` noindex lines) and the "Backend: ..." developer paragraph.

## 9. How to reproduce

```
# tools (scratch only)
cd <scratch>/inventory-platform/tools && npm install wrangler          # installed 4.152.0
# fixtures: copy frontend/dist/frontend/browser to siteA; siteB = flatten + 404.html + jobs.html + _redirects + _headers
npx wrangler pages dev <scratch>/inventory-platform/fixtures/siteB --port 8792 --ip 127.0.0.1
MSYS_NO_PATHCONV=1 node probe.mjs http://127.0.0.1:8792 / /faq /faq/ /faq/index.html /index.html /about /nope /jobs/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa /logs HEAD:/nope
# Workers assets variant: wrangler.jsonc {"assets":{"directory":"<siteD>","html_handling":"drop-trailing-slash","not_found_handling":"404-page"}} ; npx wrangler dev --port 8794
# ONNX runtime sizes: npm pack onnxruntime-web@1.31.0-dev.20260914-8d85527a0 ; tar -tvzf ... | grep wasm
# CORS evidence: curl -s -o /dev/null -D - -H "Origin: https://transcribevid.com" <url>
```
All servers started for this track (ports 8791-8795) were stopped; no repository file other than this document was written, and no git or npm install command touched the repository.
