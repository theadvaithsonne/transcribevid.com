#!/usr/bin/env node
/**
 * Writes frontend/public/sitemap.xml from the page lists, so no address is typed twice:
 *
 *   node scripts/gen-sitemap.mjs          (from video-transcriber/)
 *
 * Sources: the tool pages (frontend/src/app/features/tool-pages/tool-pages.list.ts), the guides
 * (frontend/src/app/features/guides/guides.list.ts) and the fixed pages below. Run it after adding or removing a page and
 * commit the result; frontend specs (tool-pages.list.spec.ts, guides.list.spec.ts) and backend/tests/test_spa.py fail when
 * the sitemap and the lists drift apart. <lastmod> is NOT written here: scripts/pages-postbuild.mjs adds an accurate one to
 * the built copy (see the comment it writes at the top of the file).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.resolve(here, '..', 'frontend');
const read = (rel) => fs.readFileSync(path.join(frontend, rel), 'utf8');

const tools = [...read('src/app/features/tool-pages/tool-pages.list.ts').matchAll(/^\s*path:\s*'(\/[a-z0-9-]+)'/gm)].map((m) => m[1]);
const guides = [...read('src/app/features/guides/guides.list.ts').matchAll(/^\s*path:\s*'(\/guides\/[a-z0-9-]+)'/gm)].map((m) => m[1]);

const paths = ['/', ...tools, '/tools', '/guides', ...guides, '/how-it-works', '/faq', '/about', '/contact', '/privacy', '/terms'];
if (paths.length !== new Set(paths).size) throw new Error('gen-sitemap: a path is listed twice');
if (tools.length < 6 || guides.length < 1) throw new Error('gen-sitemap: the page lists look empty (did their format change?)');

const head = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Every public page, at its one canonical address (no trailing slash). The backend's APP_PAGES must know each of them
     (backend/tests/test_spa.py checks it). No <lastmod> in this source file on purpose: a date is only useful to Google when
     it is always accurate, so scripts/pages-postbuild.mjs adds one to the built copy, taken from the last real change of each
     page's own text (git for the tool pages and information pages, the "updated" date printed on a guide) and left out where
     it cannot know. To ask Google to recrawl a changed page, use Search Console (deploy/SEO.md). Written by
     scripts/gen-sitemap.mjs from the page lists: edit the lists, then run it, not this file. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
const body = paths.map((p) => `  <url>\n    <loc>https://transcribevid.com${p}</loc>\n  </url>\n`).join('');
fs.writeFileSync(path.join(frontend, 'public', 'sitemap.xml'), `${head}${body}</urlset>\n`);
console.log(`gen-sitemap: wrote ${paths.length} addresses to frontend/public/sitemap.xml`);
