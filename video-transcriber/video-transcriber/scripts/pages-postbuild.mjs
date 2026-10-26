#!/usr/bin/env node
/**
 * Turns the Angular static build into a Cloudflare Pages site (docs/in-browser/spike/hosting.md sections 2, 7 and 8).
 *
 *   node scripts/pages-postbuild.mjs [frontend/dist/frontend/browser]
 *   (from frontend/: `npm run build:pages` = production build + this script)
 *
 *  1. dir/index.html -> dir.html: Pages then answers /faq with 200 and 308-redirects /faq/ and /faq.html to /faq, which is
 *     what the sitemap and the canonical tags use. (Left as dir/index.html, /faq would 308 to /faq/.)
 *  2. index.csr.html -> also 404.html: an unknown URL gets a real 404 status and the Angular "Page not found" view.
 *     (Without a 404.html, Pages answers every unknown URL with 200 and the home page.) index.csr.html stays: _redirects
 *     rewrites the client-only routes to /index.csr.
 *  3. Writes _headers (security headers, cache rules, noindex rules) and _redirects (client routes, old URLs).
 *  4. Checks what Pages would refuse or silently get wrong, and exits 1 if anything is off: a file over 25 MiB, 20,000
 *     files or more, more than 100 header rules, a duplicated pattern, a line over 2,000 characters, a page left as
 *     dir/index.html, a sitemap URL without its page, a missing ads.txt.
 *  5. Adds an accurate <lastmod> to each address of the built sitemap.xml (scripts/sitemap-lastmod.mjs): the date of the
 *     last real change of that page's own text, never the build time.
 *
 * There is deliberately NO Cross-Origin-Opener-Policy / Cross-Origin-Embedder-Policy anywhere: ads cannot load in a
 * cross-origin-isolated document and the engine does not need isolation (docs/in-browser/PROGRESS.md, 2026-10-25 night).
 * www -> apex is not possible in _redirects (no host redirects): it is a Bulk Redirect in the Cloudflare dashboard
 * (docs/in-browser/M5.md).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readI18n } from './i18n-data.mjs';
import { addLastmod } from './sitemap-lastmod.mjs';

/** The languages that have translated pages: their transcript pages (/es/jobs/<id>) are client-only too. */
const I18N = readI18n(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'frontend'));

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 20_000;
const MAX_HEADER_RULES = 100;
const MAX_LINE = 2_000;

/** Client-only routes (RenderMode.Client in app.routes.server.ts) that must answer 200 with the client shell. */
const CLIENT_ROUTES = ['/logs', '/jobs/:id', ...I18N.languages.map((l) => `/${l}/jobs/:id`)];

const HEADERS_BASE = `# TranscribeVid on Cloudflare Pages: security, caching and indexing headers. Written by scripts/pages-postbuild.mjs.
# Rules of this file (verified, docs/in-browser/spike/hosting.md section 2.1):
#  * ONE block per URL pattern: a repeated pattern silently replaces the earlier block.
#  * Different patterns matching one URL are merged; a header set by two of them is joined with ", ". So never set the
#    same header (Cache-Control ...) from two overlapping patterns. "! Name" removes a header set by a wider pattern.
#  * At most 100 rules, each line at most 2,000 characters.
#  * Rules are keyed on the REQUESTED url, so they also apply to a 200 rewrite (/jobs/x served from /index.csr).
# No Cross-Origin-Opener-Policy / -Embedder-Policy: ads cannot load in an isolated document, the engine does not need it.
# No Content-Security-Policy yet: the ad pages need Google's wide list; design it with the engine (Report-Only first).
# Referrer-Policy must allow a cross-origin referrer, or Google's consent message cannot show (strict-origin-when-cross-origin does).

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: microphone=(self), camera=(), geolocation=(), payment=(), usb=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains

# Hashed Angular output (outputHashing: all): never changes under the same name.
/main-*.js
  Cache-Control: public, max-age=31536000, immutable
/chunk-*.js
  Cache-Control: public, max-age=31536000, immutable
/polyfills-*.js
  Cache-Control: public, max-age=31536000, immutable
/worker-*.js
  Cache-Control: public, max-age=31536000, immutable
/styles-*.css
  Cache-Control: public, max-age=31536000, immutable
/media/*
  Cache-Control: public, max-age=31536000, immutable

# Self-hosted model files (Silero VAD, IndicXlit): unhashed names, the engine keeps its own copy in Cache Storage.
/models/*
  Cache-Control: public, max-age=86400

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
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600

# A visitor's own transcript page (the client shell via _redirects): never indexed, always revalidated.
/jobs/*
  X-Robots-Tag: noindex, nofollow
  Cache-Control: no-cache

# The browser-log page and internal URLs that must not become search results.
/logs
  X-Robots-Tag: noindex, nofollow
/index.csr
  X-Robots-Tag: noindex
/404
  X-Robots-Tag: noindex

# The production *.pages.dev address must not compete with transcribevid.com in search results.
https://:project.pages.dev/*
  X-Robots-Tag: noindex
`;

const REDIRECTS_BASE = `# TranscribeVid on Cloudflare Pages. Written by scripts/pages-postbuild.mjs.
# Order: static rules first, then rules with placeholders. Pages itself redirects /faq/ -> /faq, /faq.html -> /faq and
# /index.html -> / (308) because the pages are flat files. www -> apex is a dashboard Bulk Redirect (no host rules here).

# Client-only app routes answered 200 with the client shell. The target MUST be the extension-less /index.csr:
# a target ending in .html answers a 308 instead of rewriting, and /x/index.html targets are rejected by wrangler.
/logs /index.csr 200

# A visitor's own transcript page: exactly one segment, e.g. /jobs/abc123 (deeper paths and /jobs stay 404).
/jobs/:id /index.csr 200
`;

// the same rules for the transcript pages of each translated language (/es/jobs/<id> ...)
// and a Content-Language header on every translated page (Bing leans on it more than on hreflang; Google reads hreflang and <html lang>)
const HEADERS =
  HEADERS_BASE +
  I18N.languages.map((l) => `\n# A visitor's own transcript page in ${l}: never indexed, always revalidated.\n/${l}/jobs/*\n  X-Robots-Tag: noindex, nofollow\n  Cache-Control: no-cache\n`).join('') +
  I18N.languages.map((l) => `\n# Every ${l} page names its language (the home page is /${l}, the others are below it).\n/${l}\n  Content-Language: ${l}\n/${l}/*\n  Content-Language: ${l}\n`).join('');
const REDIRECTS =
  REDIRECTS_BASE + I18N.languages.map((l) => `\n# A visitor's own transcript page in ${l}.\n/${l}/jobs/:id /index.csr 200\n`).join('');

const root = path.resolve(process.argv[2] ?? 'frontend/dist/frontend/browser');
const problems = [];
const fail = (msg) => problems.push(msg);

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error(`pages-postbuild: ${root} has no index.html (run the production build first: npx ng build --configuration production)`);
  process.exit(1);
}

// 1. flatten every prerendered dir/index.html (any depth) to dir.html
let moved = 0;
function flatten(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const sub = path.join(dir, e.name);
    flatten(sub);
    const idx = path.join(sub, 'index.html');
    if (!fs.existsSync(idx)) continue;
    const flat = sub + '.html';
    if (fs.existsSync(flat)) throw new Error(`${flat} already exists (both ${e.name}/index.html and ${e.name}.html)`);
    fs.renameSync(idx, flat);
    moved++;
    if (fs.readdirSync(sub).length === 0) fs.rmdirSync(sub);
  }
}
flatten(root);

// 2. the 404 page is the client shell
const shell = path.join(root, 'index.csr.html');
if (!fs.existsSync(shell)) throw new Error('index.csr.html missing (is outputMode static with a Client route built?)');
fs.copyFileSync(shell, path.join(root, '404.html'));

// 3. headers and redirects
fs.writeFileSync(path.join(root, '_headers'), HEADERS);
fs.writeFileSync(path.join(root, '_redirects'), REDIRECTS);

// 4. checks
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else files.push(p);
  }
})(root);
const rel = (p) => path.relative(root, p).split(path.sep).join('/');

if (files.length >= MAX_FILES) fail(`${files.length} files: Pages allows fewer than ${MAX_FILES}`);
for (const f of files) {
  const size = fs.statSync(f).size;
  if (size > MAX_FILE_BYTES) fail(`${rel(f)} is ${(size / 1048576).toFixed(2)} MiB: Pages refuses files over 25 MiB`);
  if (path.basename(f) === 'index.html' && rel(f) !== 'index.html') fail(`${rel(f)} was not flattened`);
}
if (!fs.readFileSync(path.join(root, '404.html')).equals(fs.readFileSync(shell))) fail('404.html differs from index.csr.html');
if (!fs.existsSync(path.join(root, 'ads.txt'))) fail('ads.txt is missing (frontend/public/ads.txt)');

const headerLines = HEADERS.split('\n');
const patterns = headerLines.filter((l) => l && !l.startsWith('#') && !/^\s/.test(l));
if (patterns.length > MAX_HEADER_RULES) fail(`_headers has ${patterns.length} rules (max ${MAX_HEADER_RULES})`);
const dup = patterns.filter((p, i) => patterns.indexOf(p) !== i);
if (dup.length) fail(`_headers repeats ${dup.join(', ')} (a repeated pattern replaces the earlier block)`);
for (const l of [...headerLines, ...REDIRECTS.split('\n')]) if (l.length > MAX_LINE) fail(`a line is over ${MAX_LINE} characters: ${l.slice(0, 60)}...`);
for (const route of CLIENT_ROUTES) if (!REDIRECTS.includes(`\n${route} /index.csr 200`)) fail(`_redirects has no 200 rewrite for ${route}`);

const sitemap = path.join(root, 'sitemap.xml');
if (fs.existsSync(sitemap)) {
  for (const [, loc] of fs.readFileSync(sitemap, 'utf8').matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const p = new URL(loc).pathname.replace(/\/+$/, '');
    const page = p === '' ? 'index.html' : `${p.slice(1)}.html`;
    if (!fs.existsSync(path.join(root, page))) fail(`sitemap URL ${loc} has no ${page}`);
  }
  // 5. <lastmod>: only where it can be known (see sitemap-lastmod.mjs)
  const frontendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'frontend');
  const dated = addLastmod(fs.readFileSync(sitemap, 'utf8'), { frontendDir });
  fs.writeFileSync(sitemap, dated);
  const total = (dated.match(/<loc>/g) ?? []).length;
  const withDate = (dated.match(/<lastmod>\d{4}-/g) ?? []).length;
  console.log(`pages-postbuild: sitemap.xml: ${withDate} of ${total} addresses got an accurate <lastmod>${withDate < total ? ' (the rest have none: git could not say)' : ''}.`);
}

if (problems.length) {
  console.error(`pages-postbuild: ${problems.length} problem(s) in ${root}:\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}
console.log(`pages-postbuild: flattened ${moved} prerendered pages; wrote 404.html, _headers (${patterns.length} rules), _redirects; ${files.length} files, all under 25 MiB.`);
