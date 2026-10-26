#!/usr/bin/env node
/**
 * Writes frontend/public/sitemap.xml from the page lists, so no address is typed twice:
 *
 *   node scripts/gen-sitemap.mjs          (from video-transcriber/)
 *
 * Sources: the tool pages (frontend/src/app/features/tool-pages/tool-pages.list.ts), the guides
 * (frontend/src/app/features/guides/guides.list.ts), the fixed pages below and, for every language that has pages, the
 * translated twins (frontend/src/app/i18n/generated.ts, slugs/<code>.ts). A page that exists in several languages is listed
 * once per language, each entry carrying the full set of <xhtml:link rel="alternate" hreflang> links (itself included, plus
 * x-default = the English page), as Google asks. Run it after adding or removing a page or a translation and commit the
 * result; frontend specs and backend/tests/test_spa.py fail when the sitemap and the lists drift apart. <lastmod> is NOT
 * written here: scripts/pages-postbuild.mjs adds an accurate one to the built copy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readI18n } from './i18n-data.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.resolve(here, '..', 'frontend');
const read = (rel) => fs.readFileSync(path.join(frontend, rel), 'utf8');
const SITE = 'https://transcribevid.com';

const tools = [...read('src/app/features/tool-pages/tool-pages.list.ts').matchAll(/^\s*path:\s*'(\/[a-z0-9-]+)'/gm)].map((m) => m[1]);
const guides = [...read('src/app/features/guides/guides.list.ts').matchAll(/^\s*path:\s*'(\/guides\/[a-z0-9-]+)'/gm)].map((m) => m[1]);

const english = ['/', ...tools, '/tools', '/guides', ...guides, '/how-it-works', '/faq', '/about', '/contact', '/privacy', '/terms'];
if (english.length !== new Set(english).size) throw new Error('gen-sitemap: a path is listed twice');
if (tools.length < 6 || guides.length < 1) throw new Error('gen-sitemap: the page lists look empty (did their format change?)');

const i18n = readI18n(frontend);
for (const [lang, pages] of Object.entries(i18n.available)) {
  for (const p of pages) if (!english.includes(p)) throw new Error(`gen-sitemap: ${lang} lists ${p}, which is not a public English page`);
  const addresses = pages.map((p) => i18n.path(lang, p));
  if (addresses.length !== new Set(addresses).size) throw new Error(`gen-sitemap: two ${lang} pages share an address`);
}

/** All versions of an English page: [{ hreflang, url }], English first. */
const versions = (enPath) => [
  { hreflang: 'en', url: SITE + enPath },
  ...i18n.languages.filter((l) => i18n.available[l].includes(enPath)).map((l) => ({ hreflang: l, url: SITE + i18n.path(l, enPath) })),
];

const entries = [];
for (const p of english) {
  const all = versions(p);
  const alternates = all.length > 1 ? [...all, { hreflang: 'x-default', url: all[0].url }] : [];
  for (const v of all) entries.push({ url: v.url, alternates });
}

const multilingual = entries.some((e) => e.alternates.length);
const head = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Every public page, at its one canonical address (no trailing slash). The backend's APP_PAGES must know each English one
     (backend/tests/test_spa.py checks it). A page that exists in several languages is listed once per language with its
     <xhtml:link rel="alternate" hreflang> set, itself included, and x-default = English. No <lastmod> in this source file on
     purpose: a date is only useful to Google when it is always accurate, so scripts/pages-postbuild.mjs adds one to the built
     copy, taken from the last real change of each page's own text (git for the tool pages and information pages, the "updated"
     date printed on a guide) and left out where it cannot know. To ask Google to recrawl a changed page, use Search Console
     (deploy/SEO.md). Written by scripts/gen-sitemap.mjs from the page lists and the translations: edit those, then run it, not
     this file. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${multilingual ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' : ''}>
`;
const body = entries
  .map((e) => {
    const links = e.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.url}"/>\n`).join('');
    return `  <url>\n    <loc>${e.url}</loc>\n${links}  </url>\n`;
  })
  .join('');
fs.writeFileSync(path.join(frontend, 'public', 'sitemap.xml'), `${head}${body}</urlset>\n`);
console.log(`gen-sitemap: wrote ${entries.length} addresses (${english.length} English + ${entries.length - english.length} translated) to frontend/public/sitemap.xml`);
