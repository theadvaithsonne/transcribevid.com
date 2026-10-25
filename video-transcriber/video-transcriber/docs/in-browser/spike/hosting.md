# Hosting feasibility: Cloudflare Pages (free tier)

Track: hosting-feasibility. Research and experiments dated 2026-10-25. Every claim is either read from the current Cloudflare
documentation (fetched 2026-10-25) or measured here, and is tagged:

- **[doc]** from documentation, not tested.
- **[local]** measured with `wrangler pages dev` / `wrangler dev --local` (wrangler 4.152.0, workerd) on Windows 11 with Chrome 155.
  The emulator runs the same open-source asset-server code as production but it is NOT the production edge. Anything tagged
  [local] still needs the post-deploy smoke test in section 9.
- **[src]** read from the installed wrangler / package source.
- **[net]** measured over the network with curl.

## 0. Verdict

Cloudflare Pages free tier can host the whole static site. No limit is a blocker. Five things need action:

| # | Finding | Action |
|---|---------|--------|
| 1 | Pages serves `dir/index.html` at `/dir/` and 308-redirects `/dir` to `/dir/` [local]. Our sitemap and canonical tags use `/faq` (no slash). | Post-build step flattens `dir/index.html` to `dir.html` (script in section 8). Then `/faq` is 200 and `/faq/`, `/faq.html` 308 to `/faq` [local]. |
| 2 | A `200` rewrite whose target ends in `.html` answers `308` instead of rewriting [local]; wrangler also rejects `/x/index.html` targets as an "infinite loop". | Rewrite to the extension-less `/index.csr`: `/jobs/:id /index.csr 200` [local]. |
| 3 | With no `404.html`, Pages acts as an SPA host: every unknown URL answers **200** with the prerendered home page [local, doc]. | Ship `404.html` (a copy of `index.csr.html`): unknown URLs get a true 404 status and the Angular "Page not found" view [local, Chrome]. |
| 4 | Two onnxruntime-web WASM files exceed the 25 MiB per-file limit (asyncify 25.62 MiB, jsep 27.04 MiB in the ORT version transformers.js 4.3.1 really uses). `wrangler pages deploy` refuses them [src]. | Load the WASM from a pinned jsDelivr URL (transformers.js default), or split into two chunks and reassemble (section 4). |
| 5 | KV's free 1,000 writes/day cannot count videos; use D1 (or a Durable Object). The real ceiling is Workers' 100,000 requests/day, not the database. | D1 with one atomic `UPDATE ... RETURNING`; hide the number in the UI on any error (section 1.3). |

Also: `@huggingface/transformers@4.3.1` pins `onnxruntime-web@1.31.0-dev.20260914-8d85527a0` (a dev build), not 1.30.0. Self-hosted or CDN
files must come from that exact version because the JS glue differs between 1.30.0 and 1.31.0-dev (section 4).

## 1. Limits (free tier)

### 1.1 Pages [doc, with [src] cross-checks]

| Limit | Free value | Source |
|---|---|---|
| Files per site | 20,000 (paid plans 100,000 with `PAGES_WRANGLER_MAJOR_VERSION=4`) | doc; `MAX_ASSET_COUNT_DEFAULT = 2e4` in wrangler source |
| Size per file | 25 MiB. wrangler error: `Pages only supports files up to 25 MiB in size` | doc; `MAX_ASSET_SIZE = 25 * 1024 * 1024` in wrangler source |
| Builds per month | 500 (Git-integrated builds); build timeout 20 min | doc |
| `_headers` | 100 rules, 2,000 characters per line | doc; see 2.1 for local behaviour |
| `_redirects` | 2,000 static + 100 dynamic = 2,100; 1,000 characters per rule | doc |
| Custom domains per project | 100 | doc |
| Projects per account | 100 | doc |
| Bandwidth | no limit stated; "requests to static assets are free and unlimited" | doc (Pages Functions pricing, Workers static assets billing) |
| Ignored on upload | `functions`, `node_modules`, `.git`, `.DS_Store`, `.wrangler` | wrangler source `IGNORE_LIST` |

Build options: (a) Git-integrated build on Cloudflare (500 per month is plenty), or (b) build in GitHub Actions and run
`wrangler pages deploy dist/frontend/browser` (direct upload, no build quota). Cloudflare's "Migrate from Pages to Workers" guide does not
call Pages deprecated but presents Workers static assets as the way forward; section 3.6 shows what changes.

### 1.2 Workers, D1, KV, Durable Objects, free plan [doc]

| Product | Free limit (resets 00:00 UTC) |
|---|---|
| Workers | 100,000 requests/day; 10 ms CPU per request; 50 subrequests; 100 Workers per account. Pages Functions requests count against the same 100,000. Over the limit: error 1027 (fail closed) or the Worker is bypassed (fail open); with `run_worker_first` on static assets, a 429. |
| D1 | 5,000,000 rows read/day; **100,000 rows written/day**; 5 GB. Over the limit: queries fail until the reset. |
| KV | 100,000 reads/day; **1,000 writes/day**; 1,000 deletes; 1,000 lists; 1 GB. Over the limit: that operation type fails. |
| Durable Objects | 100,000 requests/day; 13,000 GB-s/day; 5,000,000 SQLite rows read/day; 100,000 SQLite rows written/day; 5 GB. Free plan allows SQLite-backed objects only. |

### 1.3 Recommendation for the anonymous "videos transcribed" counter

**Use D1**: one table, one row. Evidence:

- KV: 1,000 writes/day means the counter stops after 1,000 transcriptions a day, and KV has no atomic increment. Measured [local]:
  200 parallel POSTs to a get-then-put KV counter, then one more POST, returned **200 instead of 201** (a lost update).
- D1: `UPDATE counter SET n = n + 1 ... RETURNING n` is atomic. Measured [local]: 1 sequential POST plus 200 parallel POSTs (40 at a time)
  gave exactly 201. One increment writes one row (an `INTEGER PRIMARY KEY` table with no extra index). The production `rows_written`
  metric is not available locally; confirm it in the dashboard after launch.
- Durable Object: the same 100,000/day request and row-write ceilings as D1, and it could coalesce writes, but it needs more code and a
  class migration. Only worth it if the counter ever needs a stricter guarantee.
- The binding constraint is **Workers requests, 100,000/day, shared by writes (one POST per finished transcript) and reads (the stats GET)**.
  D1's 100,000 row writes/day only bites if every request is a write. Rough budget: 1 stats GET + 0.5 POST per visitor gives about
  66,000 visitors/day before the Worker is cut off. A browser cache (`Cache-Control: public, max-age=300` on the GET) cuts the reads;
  Worker-side `caches.default` does NOT reduce the invocation count.
- The site must work without the counter: past the limit the Worker answers 1027/429 or is bypassed. Hide the number on any error.
- Abuse: any client can forge an `Origin` header with curl, so the number can be inflated. Treat it as a vanity metric; a WAF rate-limit rule
  on `/api/count` is the mitigation (free-plan rule count not verified here).
- Privacy: the Worker sees the IP address in transit. Store only the integer and say so on the privacy page.

Tested Worker (the files that ran under `wrangler dev --local` with D1 + KV bindings; the KV comparison endpoint is removed here):

```toml
# wrangler.toml
name = "tv-counter"
main = "src/index.js"
compatibility_date = "2026-10-01"
[[d1_databases]]
binding = "DB"
database_name = "tv-counter"
database_id = "<real id after: wrangler d1 create tv-counter>"
```

```sql
-- schema.sql  (recommended form; the tested form used "name TEXT PRIMARY KEY", same behaviour)
CREATE TABLE IF NOT EXISTS counter (id INTEGER PRIMARY KEY CHECK (id = 1), n INTEGER NOT NULL DEFAULT 0);
INSERT OR IGNORE INTO counter (id, n) VALUES (1, 0);
```

```js
// src/index.js
const ALLOWED = ['https://transcribevid.com'];
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const cors = ALLOWED.includes(origin) ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' } : { 'Vary': 'Origin' };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'Access-Control-Allow-Methods': 'GET, POST', 'Access-Control-Max-Age': '86400' } });
    if (url.pathname === '/api/stats' && request.method === 'GET') {
      const row = await env.DB.prepare('SELECT n FROM counter WHERE id = 1').first();
      return Response.json({ videos: row ? row.n : 0 }, { headers: { ...cors, 'Cache-Control': 'public, max-age=300' } });
    }
    if (url.pathname === '/api/count' && request.method === 'POST') {
      if (!ALLOWED.includes(origin)) return new Response('forbidden', { status: 403 });
      const row = await env.DB.prepare('UPDATE counter SET n = n + 1 WHERE id = 1 RETURNING n').first();
      return Response.json({ videos: row.n }, { headers: { ...cors, 'Cache-Control': 'no-store' } });
    }
    return new Response('not found', { status: 404 });
  },
};
```

Local results (commands in 3.5): `GET /api/stats` 200 `{"videos":0}`; POST without Origin 403; POST with Origin 200 `{"videos":1}`; preflight 204 with
`Access-Control-Allow-Origin: https://transcribevid.com`; 200 parallel POSTs then GET gave `{"videos":201}`. Route the Worker at
`transcribevid.com/api/*` (same origin, no CORS needed) or on its own workers.dev name (CORS as above).

## 2. Serving semantics on Pages

[local] results below come from the real prerendered build (`frontend/dist/frontend/browser`: 10 prerendered pages plus `index.csr.html`) with the
`_headers` / `_redirects` of section 7.

### 2.1 `_headers`

- Syntax [doc]: a URL pattern line, then indented `Name: value` lines. `*` is a greedy splat (one per pattern; `:splat` in values). `:name`
  placeholders match up to `/` in a path, or up to `.` or `/` in a host. Absolute `https://` patterns match on host (port and scheme ignored).
  Host rules verified [local]: `https://127.0.0.1/*`, `https://localhost/*` and `https://:first.0.0.1/*` (`:first` = `127`) all matched.
- **Merging** [local]: all matching blocks apply. The same header from two patterns is joined with `, ` (observed `X-Merge: two, one`).
  A `Cache-Control` set by a rule REPLACES Pages' default (`public, max-age=0, must-revalidate`) instead of being appended.
- **Duplicate pattern trap** [local]: two blocks with the identical pattern (two `/*` blocks) do not merge. In `wrangler pages dev` the later one silently
  replaced the earlier one (all headers of the first block vanished). Keep exactly ONE block per pattern.
- Detach with `! Header-Name` [local]: `/plain.js` with `! X-Frame-Options` lost the header set by `/*`.
- Rules are keyed on the **requested** URL, so they also apply to a `200` rewrite (`/jobs/abc123` served from `/index.csr` carried the
  `/jobs/*` COOP/COEP headers), to redirects and to 404 responses [local].
- Limits [local]: with 102 blocks, 101 were parsed and the rest dropped with `Maximum number of rules supported is 100. Skipping remaining 3 lines of file`
  (off by one against the docs; stay at 100 or fewer). A line over 2,000 characters is ignored with `Ignoring line 6 as it exceeds the maximum allowed
  length of 2000`, and its rule then fails with "No headers specified". A long CSP therefore has to fit in 2,000 characters on one line. Production
  deploy-time behaviour for these two cases is not verified.
- Not applied to responses generated by Pages Functions / `_worker.js` [doc]; the site has none (the counter is a separate Worker).
- Always added by Pages [doc, local]: `Access-Control-Allow-Origin: *`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `ETag`.
  Preview deployments get `X-Robots-Tag: noindex` [doc]; the production `*.pages.dev` name does not (rule in section 7).
- Redirects run before headers; if both match, the redirect wins [doc]. In practice header rules still decorate the redirect response [local].

### 2.2 `_redirects`

- Format `source destination [status]`, default 302. Supported: 301, 302, 303, 307, 308 and 200 (rewrite to a relative URL on the same site).
  Other statuses (for example a 404 rewrite) are unsupported [doc].
- Redirects fire "regardless of whether or not an asset matches" [doc]. For one source the top-most rule wins; static rules should precede dynamic ones
  (wrangler warns otherwise) [doc, local]. Only the first applicable rewrite applies: no chaining [doc].
- Targets tried for a `200` rewrite from `/jobs/<x>/*` [local]:

| Rewrite target | Result |
|---|---|
| `/index.csr` (extension-less name of `index.csr.html`) | **200**, shell body |
| `/app-shell` (extension-less name of `app-shell.html`) | 200 |
| `/shell/` (directory with `index.html`) | 200 |
| `/` and `/faq/` | 200 (home / faq content) |
| `/index.csr.html`, `/app-shell.html`, `/faq` (dir form) | **308** to the canonical form; no rewrite happens |
| `/shell/index.html` | rule rejected by wrangler: "Infinite loop detected ... redirect to strip .html or /index" |

- `/jobs/:id` (placeholder) matches exactly one segment [local]: `/jobs/abc123` is 200; `/jobs/a/b`, `/jobs`, `/jobs/`, `/jobs/abc123/` are 404.
  This mirrors the FastAPI behaviour today (a known `/jobs/<id>` is 200, anything else a real 404).
- Not supported [doc]: query-string matching, host/domain redirects, country/language/cookie redirects. So `_redirects` cannot do the www redirect (section 5).

### 2.3 Unknown URLs: 404 page or SPA fallback

| Situation | What Pages answers | Evidence |
|---|---|---|
| A root `404.html` exists | every non-matching path answers **404** with the body of `404.html` (the nearest `404.html` up the tree wins). `/nope`, `/nope/x`, `/nope.html`, `/a/b/c` all gave 404 | [doc, local] |
| No `404.html` anywhere | SPA mode: any non-asset path answers **200** with the prerendered **`index.html` (the home page)**, not `index.csr.html`. `/nope`, `/nope/x` and `/style` returned the home page with 200 | [doc, local] |
| The `404.html` file's own URL | `/404.html` 308 to `/404`, which answers **200** (a duplicate soft-404 URL) | [local]; covered by the `/404` noindex rule |

The trigger is simply whether a top-level `404.html` exists. Our choice: `404.html` = copy of `index.csr.html`. Chrome 155 on `/nope`: status 404, Angular rendered
`<h1>Page not found</h1>`, title `Page not found - TranscribeVid` [local]. That is the same behaviour as rule (d) in `backend/app/main.py` (true 404 with the shell).
Client-only routes that must be 200 (`/logs`, `/jobs/:id`) are listed in `_redirects` as 200 rewrites. A route added to `app.routes.ts` that is neither prerendered
nor in `_redirects` will answer with a 404 status (people still see the page, search engines see a 404), so keep a unit test comparing the lists.

### 2.4 Trailing slash, `/index.html`, `.html` canonicalisation [local]

| Layout | `/faq` | `/faq/` | `/faq.html` | `/faq/index.html` | `/index.html` |
|---|---|---|---|---|---|
| Angular default `faq/index.html` | **308 to `/faq/`** | 200 | not tested | 308 to `/faq/` | 308 to `/` |
| Flattened `faq.html` (recommended) | **200** | 308 to `/faq` | 308 to `/faq` | not tested | 308 to `/` |
| `faq/index.html` plus rule `/faq /faq/ 200` | 200 | 200 | n/a | 308 | duplicate URLs, avoid |

Canonicalisation redirects are **308** (permanent) on Pages. With flattened pages no `_redirects` rule is needed. The root `index.html` is served at `/`; `/index.html`
redirects to `/`. The existing sitemap and canonical tags (`https://transcribevid.com/faq`) already use the no-slash form.

### 2.5 Caching defaults

- Every cacheable asset gets `Cache-Control: public, max-age=0, must-revalidate` plus an `ETag`; revalidation answers 304 [doc, local]. That includes hashed
  `main-*.js`, so hashed files need an explicit rule (section 7; observed `public, max-age=31536000, immutable` as a single value [local]).
- Edge cache: assets stay on Cloudflare's CDN until the next deploy; TTL one week, may disappear earlier; per data centre [doc].
- Range requests answer 200, not 206 [doc]: irrelevant, since models come from Hugging Face.
- 404 responses carried `Cache-Control: no-store` locally.

## 3. Experiments (commands and raw results)

Root `$S` = `C:/Users/Mayur/AppData/Local/Temp/claude/d--transcribevid-com-transcribevid-com/2ebf80aa-5688-4a93-a2d9-eaccf6f82241/scratchpad/hosting`.

### 3.1 Install

```
cd $S/wr && npm init -y && npm install wrangler@latest
npx wrangler --version                       # 4.152.0
```

### 3.2 Toy site (`$S/site/pub`): `_headers`, `_redirects`, `404.html`, `dir/index.html`, `index.csr.html`

```
cd $S/wr && npx wrangler pages dev $S/site/pub --port 8788 --ip 127.0.0.1
#   Parsed 6 valid redirect rules.   Parsed 9 valid header rules.
curl -si http://127.0.0.1:8788/faq          -> 308 Permanent Redirect, Location: /faq/, x-merge: two, one
curl -si http://127.0.0.1:8788/jobs/abc123  (rule "/jobs/* /index.csr.html 200") -> 308, Location: /index.csr   (no rewrite)
curl -si http://127.0.0.1:8788/nope         -> 404 Not Found, body CUSTOM-404-PAGE
curl -si http://127.0.0.1:8788/plain.js     -> headers of /* minus X-Frame-Options (detached), x-test: plain
```

In the first version the file had two `/*` blocks and only the later block's headers appeared; renaming the second block made both apply.

### 3.3 `_headers` limits (`$S/site/pub2`; a newly created file needs a server restart, edits to an existing one are hot-reloaded)

```
102 blocks (/r0 .. /r100 + /long)   -> "Parsed 101 valid header rules." + "Maximum number of rules supported is 100. Skipping remaining 3 lines of file."  (/r100 applied, /long dropped)
/long1 (1980-char value), /long2 (2100) -> long1 header present; long2: "Ignoring line 6 as it exceeds the maximum allowed length of 2000." and "No headers specified"
```

### 3.4 Realistic site (`$S/site/pub3`) and Chrome

`pub3` = the existing `frontend/dist/frontend/browser` build + `node pages-postbuild.mjs` + the `_headers` / `_redirects` of section 7.
`npx wrangler pages dev $S/site/pub3 --port 8788` printed `Parsed 3 valid redirect rules.` and `Parsed 22 valid header rules.`
Result matrix (`$S/probe2.sh`): `/` 200; `/faq` 200; `/faq/` 308 `/faq`; `/faq.html` 308 `/faq`; `/index.html` 308 `/`; `/about` 301 `/how-it-works`; `/about/` 404;
`/logs` 200; `/jobs/abc123` 200 (`cache-control: no-cache`); `/jobs/abc123/`, `/jobs/a/b`, `/jobs`, `/jobs/` 404; `/nope`, `/nope/`, `/nope.html`, `/a/b/c` 404;
`/404` 200 plus noindex; `/404.html` 308 `/404`; `/index.csr` 200 plus noindex; `/index.csr.html` 308 `/index.csr`; `/ads.txt` 200 `text/plain; charset=utf-8` `max-age=3600`;
`/robots.txt` 200; `/sitemap.xml` 200 `application/xml`; `main-*.js`, `chunk-*.js`, `styles-*.css` `public, max-age=31536000, immutable`; `/favicon.ico` `max-age=86400`.

Browser check (`$S/pw/coi.mjs`, playwright-core `channel: 'chrome'`, Chrome 155.0.8059.86, headless):

| Page | status | `crossOriginIsolated` | `SharedArrayBuffer` | Notes |
|---|---|---|---|---|
| `/jobs/abc123` | 200 | **true** | yes | Angular shell booted (title `Transcript - TranscribeVid`); a blob Worker also saw `SharedArrayBuffer` |
| `/` | 200 | false | no | prerendered home hydrated (h1 `Transcribe a video or audio file`) |
| `/nope` | **404** | false | no | h1 `Page not found` |

On the isolated page: `fetch()` of the jsDelivr ORT glue file 200; dynamic `import()` of it from jsDelivr OK; `fetch()` of
`huggingface.co/onnx-community/whisper-tiny.en/resolve/main/config.json` 200 (CORS-mode fetch is fine under COEP). A no-cors `<img>` from another
origin without a CORP header (`localhost:8788` while on `127.0.0.1:8788`) was **blocked** with `ERR_BLOCKED_BY_RESPONSE.NotSameOriginAfterDefaultedToSameOriginByCoep`
(`$S/pw/coi2.mjs`); on `/` the same image loaded. That is the mechanism that makes ads and COEP incompatible. The console errors on these pages (`/api/logs/client` 404/405)
come from the current backend-calling app code, not from hosting.

Network facts [net] for COEP `require-corp`: jsDelivr and unpkg send `Cross-Origin-Resource-Policy: cross-origin` and `Access-Control-Allow-Origin: *`.
Hugging Face `resolve/main/...` sends `Access-Control-Allow-Origin` (echoing the Origin) on the redirect hops and `access-control-allow-origin: *` on the final CDN
response, with no CORP header, so it works only because transformers.js uses CORS-mode `fetch()`.

### 3.5 Counter Worker with D1 (Windows pitfall)

```
cd $S/worker && wrangler d1 execute tv-counter --local --file schema.sql    -> "internal error; reference = ..." (also for SELECT 1; in wrangler dev every D1 call gives HTTP 500)
```
Cause: Windows MAX_PATH. The scratch path is about 190 characters and miniflare appends `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/<64 hex>.sqlite`; the SQLite file is never
created. The same project run from the short path `C:/Users/Mayur/AppData/Local/Temp/tvw` works. **Local counter tests on Windows need a short project path** (or long paths enabled). The short copy was deleted afterwards.

```
cd C:/Users/Mayur/AppData/Local/Temp/tvw
wrangler d1 execute tv-counter --local --file schema.sql                        -> success
wrangler dev --local --port 8790
curl http://127.0.0.1:8790/api/stats                                            -> {"videos":0}
curl -X POST http://127.0.0.1:8790/api/count                                    -> 403
curl -X POST -H "Origin: https://transcribevid.com" .../api/count               -> {"videos":1}
curl -X OPTIONS -H "Origin: https://transcribevid.com" .../api/count            -> 204, ACAO https://transcribevid.com
seq 200 | xargs -P 40 -I{} curl -s -o /dev/null -X POST -H "Origin: https://transcribevid.com" .../api/count ; curl .../api/stats   -> {"videos":201}
seq 200 | xargs -P 40 -I{} curl -s -o /dev/null -X POST .../kv/count ; curl -X POST .../kv/count                                       -> {"videos":200}  (expected 201)
```

### 3.6 Same files under Workers static assets (Pages' successor) [local]

`wrangler.jsonc`: `"assets": {"directory": "../pub4", "not_found_handling": "404-page", "html_handling": "drop-trailing-slash"}`; `pub4` is the unflattened build + `404.html` +
the same `_headers` / `_redirects`. `wrangler dev --local` parsed 3 redirect and 21 header rules. `/faq` 200; `/faq/`, `/faq/index.html`, `/faq.html`, `/index.html` redirect to the slash-less form;
`/jobs/abc123` 200; `/jobs/a/b` 404; `/nope` 404; `/logs` 200. Differences from Pages: (1) canonical redirects are **307** (temporary) instead of 308, a weaker SEO signal;
(2) no flatten step is needed thanks to `drop-trailing-slash`; (3) the custom domain must be a Cloudflare-managed zone, while Pages also takes external DNS for subdomains [doc];
(4) `.assetsignore` replaces Pages' implicit ignore list [doc]. `_headers` / `_redirects` carry over unchanged. Recommendation: start on Pages; moving later is a config change.

## 4. Large files: onnxruntime-web and transformers.js

Installed with `npm install onnxruntime-web@1.30.0 @huggingface/transformers@4.3.1` in `$S/ort`. npm placed a **second, nested** onnxruntime-web because
`@huggingface/transformers@4.3.1` depends on exactly **`onnxruntime-web@1.31.0-dev.20260914-8d85527a0`** (and `onnxruntime-node@1.30.0`). `transformers.web.js` imports
`onnxruntime-web/webgpu` (resolves to `dist/ort.webgpu.bundle.min.mjs`, 117,732 bytes) and, when `env.backends.onnx.wasm.wasmPaths` is unset, sets:

```
https://cdn.jsdelivr.net/npm/onnxruntime-web@${ONNX_ENV.versions.web}/dist/ort-wasm-simd-threaded.asyncify.{mjs,wasm}
```
(the plain `ort-wasm-simd-threaded.{mjs,wasm}` only for Safari below 26 without WebGPU). The `jsep.mjs` copy inside the transformers `dist` folder is byte-identical to the nested
1.31 dev build and DIFFERS from the 1.30.0 `jsep.mjs` (`cmp`: differ at byte 29490), so glue and wasm must always come from the same version.

### 4.1 WASM files (exact bytes, measured)

| File | 1.31.0-dev.20260914 bytes (used by transformers 4.3.1) | MiB | over 25 MiB | 1.30.0 bytes | MiB | over 25 MiB |
|---|---|---|---|---|---|---|
| `ort-wasm-simd-threaded.wasm` | 14,264,838 | 13.60 | no | 14,239,897 | 13.58 | no |
| `ort-wasm-simd-threaded.jspi.wasm` | 16,811,691 | 16.03 | no | 16,758,545 | 15.98 | no |
| `ort-wasm-simd-threaded.asyncify.wasm` (transformers default) | **26,861,777** | **25.62** | **yes (+0.62)** | 26,781,914 | 25.54 | **yes (+0.54)** |
| `ort-wasm-simd-threaded.jsep.wasm` | **28,352,885** | **27.04** | **yes (+2.04)** | 28,312,028 | 27.00 | **yes (+2.00)** |

Compressed with gzip 9 / brotli 9 (1.31 dev): plain 3.70 MB / 2.70 MB, jspi 4.15 / 3.07, asyncify 6.63 / 4.70, jsep 6.67 / 4.65. jsDelivr served the asyncify file as brotli,
`Content-Length: 5547312`. Cloudflare compresses `application/wasm` [doc], but the 25 MiB limit applies to the uncompressed file.
The `.mjs` glue files are 24 to 53 KB (asyncify 53,057; jsep 46,851; jspi 50,918; plain 24,381). Every other file in the onnxruntime-web `dist` is under 6 MB (largest `ort.all.js`, 5.73 MiB).
Inside the transformers.js 4.3.1 `dist/` the largest file is `transformers.js` at 1,349,504 bytes (`transformers.web.min.js` 454,425). Nothing there is near the limit.

### 4.2 Recommendation

1. **Default: load the two ORT files from a pinned jsDelivr URL**, which is what transformers.js already does, and set `env.backends.onnx.wasm.wasmPaths` explicitly to the exact version so
   a later transformers upgrade cannot silently change it. Verified [net]: jsDelivr and unpkg both return the complete asyncify file (26,861,777 bytes, SHA-256
   `49871f5a4409519797e127440868a6d1923339d9185907f301a5b2a1d90af082`, identical to the npm file). Headers: `Access-Control-Allow-Origin: *`, `Cross-Origin-Resource-Policy: cross-origin`,
   `Cache-Control: public, max-age=31536000, s-maxage=31536000, immutable`. jsDelivr is the first choice (immutable, Brotli, CORP); unpkg the fallback.
   Pin the full version, never a range or `latest`.
2. Risk of the CDN route: a third party must be up (the same dependency already exists for Hugging Face). Mitigations: fallback to the second CDN, and the browser cache (transformers.js
   stores the WASM through its own cache, `env.useWasmCache`, true by default in browsers).
3. **Self-hosting works as-is only for files under 25 MiB** (plain 13.6 MiB, jspi 16.0 MiB, all `.mjs`). For asyncify/jsep, split the file in two (13,430,889 + 13,430,888 bytes for asyncify;
   byte-exact reassembly confirmed by SHA-256) and reassemble in a worker into a `Blob`, then pass the blob URL as `wasmPaths.wasm` (transformers.js skips its own fetch for blob URLs, see
   `ensureWasmLoaded`). This path is NOT tested end to end (it needs a model run); keep it as the fallback if jsDelivr is ever unacceptable. Serve the chunks with a `.wasm` extension so Cloudflare compresses them.
4. Put self-hosted engine files in a versioned folder (for example `/vendor/ort-1.31.0-dev.20260914/`), so the `/vendor/*` immutable rule in section 7 is safe.
5. Ask the engine track which ORT build is really needed. If WebGPU works with the 16 MiB `jspi` build, everything fits on Pages without chunking. That is a runtime question not answered here.

## 5. Domain handling

- **Apex**: the apex must be a Cloudflare zone (nameservers moved to Cloudflare); adding the custom domain then creates the CNAME [doc]. `www` can be a CNAME to `<project>.pages.dev` without being a zone [doc].
- **www to apex**: not possible in `_redirects` (host redirects unsupported [doc]). Use the documented Bulk Redirect recipe: DNS `A www 192.0.2.1` proxied; list entry
  `www.transcribevid.com -> https://transcribevid.com`, status 301, with preserve query string, subpath matching, preserve path suffix, include subdomains [doc]. Free quotas: 15 bulk redirect rules,
  5 lists; Single Redirects 10 rules [doc]. Do not also attach www as a Pages custom domain (duplicate content).
- **pages.dev duplicate**: `<project>.pages.dev` stays reachable after the custom domain is attached [doc]. Options: Bulk Redirect it to the custom domain (the docs' suggestion) and/or the host rule
  `https://:project.pages.dev/*` with `X-Robots-Tag: noindex` (host rules verified locally; the pages.dev name itself needs the post-deploy check). The prerendered pages already carry an absolute canonical `https://transcribevid.com/...`.
- **HTTPS**: Universal SSL is automatic for custom domains. "Always Use HTTPS" (all plans) redirects http to https on all hosts; the docs describe it as a toggle and do not state the default, so switch it on.
  Automatic HTTPS Rewrites: not verified.
- **HSTS**: either the dashboard setting (SSL/TLS, Edge Certificates: max-age 1 to 12 months, includeSubDomains, preload, no-sniff; all plans) or the `_headers` line in section 7, which equals today's Caddy value
  `max-age=31536000; includeSubDomains`. Do not add `preload` until every subdomain ever used serves HTTPS, and do not set different values in both places.
- **ads.txt**: must sit at the root, `https://transcribevid.com/ads.txt` [doc, Google]; line format `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`. Pages served `/ads.txt` as
  `text/plain; charset=utf-8`, 200, no redirect [local]. Put the file in `frontend/public/` so the Angular build copies it. How Google's crawler treats www/apex redirects was not stated on the fetched page; keep the apex copy canonical.
- **robots.txt**: `public/robots.txt` today disallows `/api/`, `/logs`, `/jobs/`. After the backend is gone, `/api/` can go (harmless to keep); keep `/jobs/` and `/logs`. `Allow: /` already covers the AdSense crawler.
  A robots.txt disallow does not de-index a page; the `X-Robots-Tag: noindex` header in section 7 does, and only for crawlers allowed to fetch the URL. For `/jobs/*` (private, never linked) that is fine.
- **Custom 404 and SEO**: `404.html` (copy of the shell) gives a true 404 status [local], so typo or removed URLs drop out of the index instead of becoming soft 404s. Keep the sitemap to the prerendered public pages only (as today).
  `/404` answering 200 is covered by `X-Robots-Tag: noindex`. Slash and `.html` canonicalisation is a permanent 308 on Pages [local].

## 6. Feature list versus hosting

Nothing in the owner's feature list is lost because of hosting: about 40 static files (limit 20,000); the largest self-hosted file recommended is under 17 MiB; Whisper/Qwen models (up to about 1.5 GB) come from Hugging Face and never touch Pages;
the counter fits the Workers free limits as computed in 1.3. YouTube / Instagram link download is not a hosting question: a static host cannot run it, so it needs a separate server-side component, which is for the feature-parity track to document with evidence.

## 7. Recommended `_headers` and `_redirects` (tested together: 22 header rules, 3 redirect rules)

Put both in `frontend/public/` (Angular copies `public/**/*` to the output root). If the transcribing page lives somewhere other than `/jobs/*`, change that one block.
There is deliberately no global `Content-Security-Policy`: the ad scripts need a wide policy and the engine page needs `wasm-unsafe-eval`, so design the CSP together with the engine
(start with `Content-Security-Policy-Report-Only` on `/jobs/*`; keep each line under 2,000 characters).

### `_headers`

```
# TranscribeVid on Cloudflare Pages - security, isolation and caching headers.
# RULES OF THE FILE (all verified, see docs/in-browser/spike/hosting.md section 2.1):
#  * ONE block per URL pattern. A repeated pattern silently REPLACES the earlier block locally (wrangler pages dev).
#  * Different patterns that match one URL are MERGED; a header set twice is joined with ", " - so never set the same
#    header (Cache-Control, COOP, ...) from two overlapping patterns unless you mean a comma list. Use "! Name" to detach.
#  * Max 100 rules, each line max 2,000 characters (longer lines are dropped with only a warning).
#  * Rules are keyed on the REQUESTED url, so they also apply to a 200 rewrite (/jobs/x served from /index.csr).

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: microphone=(self), camera=(), geolocation=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains

# Hashed Angular output (outputHashing: all) - never changes under the same name.
/main-*.js
  Cache-Control: public, max-age=31536000, immutable
/chunk-*.js
  Cache-Control: public, max-age=31536000, immutable
/polyfills-*.js
  Cache-Control: public, max-age=31536000, immutable
/styles-*.css
  Cache-Control: public, max-age=31536000, immutable
/media/*
  Cache-Control: public, max-age=31536000, immutable

# Self-hosted engine files live in a VERSIONED folder (e.g. /vendor/ort-1.31.0-dev.20260914/), so they are immutable too.
/vendor/*
  Cache-Control: public, max-age=31536000, immutable

# Small unhashed files: revalidate daily-ish.
/favicon.ico
  Cache-Control: public, max-age=86400
/favicon.svg
  Cache-Control: public, max-age=86400
/icon-192.png
  Cache-Control: public, max-age=86400
/icon-512.png
  Cache-Control: public, max-age=86400
/apple-touch-icon.png
  Cache-Control: public, max-age=86400
/og-image.png
  Cache-Control: public, max-age=86400
/manifest.webmanifest
  Cache-Control: public, max-age=86400
/robots.txt
  Cache-Control: public, max-age=3600
/sitemap.xml
  Cache-Control: public, max-age=3600
/ads.txt
  Cache-Control: public, max-age=3600

# The transcribing page: its own full page load, cross-origin isolated (SharedArrayBuffer -> multi-threaded WASM).
# NO ads here (COEP blocks them). Never indexed. Change the path to wherever the engine page really lives.
/jobs/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-cache

# Operator/browser-log page and internal URLs that must not become search results.
/logs
  X-Robots-Tag: noindex, nofollow
/index.csr
  X-Robots-Tag: noindex
/404
  X-Robots-Tag: noindex

# The *.pages.dev address of the production project must not compete with transcribevid.com in search results.
# (Host rules verified locally with 127.0.0.1 / localhost and a :placeholder host; the pages.dev name itself needs a post-deploy check.)
https://:project.pages.dev/*
  X-Robots-Tag: noindex
```

### `_redirects`

```
# TranscribeVid on Cloudflare Pages. Order: static rules first, then rules with placeholders/splats.
# Pages already redirects /faq/ -> /faq, /faq.html -> /faq and /index.html -> / (308) when pages are flat files.

# Client-only app routes answered 200 with the client shell. Rewrite target MUST be the extension-less /index.csr:
# a target ending in .html is answered with a 308 redirect, and a /index.html target is rejected by wrangler.
/logs /index.csr 200

# Old URLs
/about /how-it-works 301

# A visitor's own transcript page: exactly one segment, e.g. /jobs/abc123 (deeper paths and /jobs stay 404).
/jobs/:id /index.csr 200
```

Notes:

- COOP/COEP only on `/jobs/*`: `crossOriginIsolated` was true there and false on `/` [local, Chrome 155]. `require-corp` has the widest support; `credentialless` would admit more third-party content but was not tested and its Safari support was not verified here.
- A client-side route change keeps the old document's headers, so the upload page must open the transcribing page with a real navigation (`location.assign('/jobs/<id>')` or a plain `<a>` that bypasses the router), as the plan already says.
- If the post-build flatten step is skipped, every prerendered page 308-redirects to a trailing-slash URL that disagrees with the canonical tags and the sitemap. The CI checks in section 8 catch that.

## 8. Build step (tested on a copy of the existing dist)

`$S/scripts/pages-postbuild.mjs`, run after `ng build` with `dist/frontend/browser` as the argument. Output on the 15 Oct build: `flattened 10 prerendered pages; wrote 404.html`; the resulting layout equals the tested `pub3`.

```js
// node pages-postbuild.mjs <dist/browser>
//  1. dir/index.html -> dir.html   (Pages then serves /dir as 200 and 308-redirects /dir/ and /dir.html to /dir)
//  2. index.csr.html -> also copied to 404.html (unknown URLs: real 404 status + the Angular "Page not found" view)
// The root index.html stays. index.csr.html stays too: _redirects rewrites /jobs/:id and /logs to /index.csr.
import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(process.argv[2] ?? '.');
let moved = 0;
for (const e of fs.readdirSync(root, { withFileTypes: true })) {
  if (!e.isDirectory()) continue;
  const idx = path.join(root, e.name, 'index.html');
  if (!fs.existsSync(idx)) continue;
  const flat = path.join(root, e.name + '.html');
  if (fs.existsSync(flat)) throw new Error(`${flat} already exists`);
  fs.renameSync(idx, flat); moved++;
  if (fs.readdirSync(path.join(root, e.name)).length === 0) fs.rmdirSync(path.join(root, e.name));
}
const shell = path.join(root, 'index.csr.html');
if (!fs.existsSync(shell)) throw new Error('index.csr.html missing (is outputMode static + a Client route built?)');
fs.copyFileSync(shell, path.join(root, '404.html'));
console.log(`flattened ${moved} prerendered pages; wrote 404.html`);
```

Suggested CI assertions (not implemented): no `*/index.html` except the root; `404.html` byte-equal to `index.csr.html`; every file under 25 MiB; fewer than 20,000 files; `_headers` has at most 100 blocks, no duplicate pattern and no line over 2,000 characters;
every URL in `sitemap.xml` maps to `<path>.html` or `/`; every client route in `app.routes.ts` that is not prerendered appears in `_redirects` as a 200 rewrite.

## 9. Post-deploy smoke test (production behaviour cannot be proven without an account)

Run against the `*.pages.dev` URL, then transcribevid.com. Expected values are what [local] showed.

```
curl -sI https://HOST/faq              # 200, no Location
curl -sI https://HOST/faq/             # 308 Location: /faq
curl -sI https://HOST/index.html       # 308 Location: /
curl -sI https://HOST/nope             # 404 (body is the shell)
curl -sI https://HOST/jobs/abc123      # 200 + cross-origin-opener-policy: same-origin + cross-origin-embedder-policy: require-corp
curl -sI https://HOST/jobs/a/b         # 404
curl -sI https://HOST/about            # 301 Location: /how-it-works
curl -sI https://HOST/main-XXXX.js     # cache-control: public, max-age=31536000, immutable (single value)
curl -sI https://HOST/ads.txt          # 200 text/plain
curl -sI https://PROJECT.pages.dev/    # x-robots-tag: noindex (host rule)
curl -sI "https://www.transcribevid.com/faq?x=1"   # 301 https://transcribevid.com/faq?x=1
curl -sI http://transcribevid.com/     # redirect to https
```
Also check: `Strict-Transport-Security` appears exactly once; the 404 response carries the `/*` headers; a self-hosted `.wasm` under 25 MiB deploys and is served Brotli/gzip; and `wrangler pages deploy` rejects a 26 MiB file with
`Pages only supports files up to 25 MiB in size` (confirmed in the source, not executed because it needs credentials).

## 10. Limitations and unknowns

- No Cloudflare account was used. Every [local] result comes from wrangler's emulator. Unverified in production: header merge order, the 101st-rule and over-long-line behaviour at deploy time, `Cache-Control` on 404s, the pages.dev host rule, Brotli on `.wasm` from Pages.
- Documentation was read through a summarising fetch tool. Numbers match wrangler's source where the source holds them (20,000 files, 25 MiB, header rule and line limits); the KV, D1, DO and Workers free numbers are doc-only and Cloudflare changes them, so re-check before launch.
- What happens to Pages Functions after 100,000 requests is not documented; for Worker routes it is error 1027 or bypass depending on the fail mode. The counter must therefore stay optional in the UI.
- D1 rows-written accounting and WAF rate-limit quotas were not measured. Single Redirects and Bulk Redirects quotas are doc-only.
- Which ORT build the engine truly needs (jsep, asyncify or jspi) and the blob-URL WASM path were not run with a model. This track measured file sizes, hashes, CDN delivery and COEP compatibility of the fetches only.
- The existing `frontend/dist` (15 Oct) was used as the realistic layout; it was not rebuilt (no npm install in `frontend`). The hash patterns in `_headers` assume Angular keeps the `main-`, `chunk-`, `polyfills-`, `styles-` names with `outputHashing: all`.
- Chrome on Windows only. Safari and Firefox behaviour of COOP/COEP was not exercised.
- All servers started (wrangler pages dev x4, wrangler dev x2) and Chrome instances launched by playwright were stopped. The short-path project `C:/Users/Mayur/AppData/Local/Temp/tvw` was deleted. Nothing in the repo was changed except this file.

## 11. Sources (fetched 2026-10-25)

Cloudflare Docs: Pages limits, headers, redirects, serving pages (404/SPA/caching), custom domains, www-redirect how-to, Functions pricing; Workers limits; Workers static assets (billing, html handling, migrate from Pages);
D1, KV and Durable Objects pricing; SSL HSTS; Always Use HTTPS; URL forwarding availability; Speed compression. Google AdSense help "ads.txt" (answer 7532444).
Package facts from `@huggingface/transformers@4.3.1`, `onnxruntime-web@1.30.0` and `onnxruntime-web@1.31.0-dev.20260914-8d85527a0` as installed from npm.
