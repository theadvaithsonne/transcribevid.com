#!/usr/bin/env node
/**
 * Audits the PRERENDERED site the way a search engine reads it (no JavaScript): run it after `npm run build:pages`.
 *
 *   node scripts/audit-prerender.mjs [frontend/dist/frontend/browser]      (from video-transcriber/)
 *
 * For every public page it checks: a title of at most 60 characters and a description of 50 to 160, both unique across the
 * site; one canonical address that is the page's own; one h1 (unique); an indexable robots tag; the structured data parses and
 * has the types the page kind needs; enough real text; no leftover placeholders; every internal link goes to a page that
 * exists; the sitemap and the pages agree (each way). Exits 1 with the list of problems, 0 when clean.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'frontend/dist/frontend/browser');
if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error(`audit-prerender: ${root} has no index.html (run the production build first: npm run build:pages in frontend/)`);
  process.exit(1);
}

const problems = [];
const fail = (page, msg) => problems.push(`${page}: ${msg}`);
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;|&#160;/g, ' ');
const strip = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );

// ------------------------------------------------------------------ which pages exist
const NOT_PAGES = new Set(['404.html', 'index.csr.html']);
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html') && !NOT_PAGES.has(path.relative(root, p).split(path.sep).join('/'))) files.push(p);
  }
})(root);
const urlOf = (file) => {
  const rel = path.relative(root, file).split(path.sep).join('/').replace(/\.html$/, '');
  return rel === 'index' ? '/' : `/${rel}`;
};
const pages = new Map(files.map((f) => [urlOf(f), fs.readFileSync(f, 'utf8')]));

const sitemapFile = path.join(root, 'sitemap.xml');
const sitemap = fs.existsSync(sitemapFile)
  ? [...fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/+$/, '') || '/')
  : [];
if (!sitemap.length) fail('sitemap.xml', 'missing or empty');
for (const u of sitemap) if (!pages.has(u)) fail(u, 'is in the sitemap but has no prerendered page');
for (const u of pages.keys()) if (!sitemap.includes(u)) fail(u, 'is prerendered but not in the sitemap');
if (new Set(sitemap).size !== sitemap.length) fail('sitemap.xml', 'lists an address twice');
if (/<lastmod>/.test(fs.readFileSync(sitemapFile, 'utf8'))) {
  for (const m of fs.readFileSync(sitemapFile, 'utf8').matchAll(/<lastmod>([^<]*)<\/lastmod>/g)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(m[1])) fail('sitemap.xml', `<lastmod> "${m[1]}" is not a date`);
  }
}

// ------------------------------------------------------------------ per page
const titles = new Map();
const descriptions = new Map();
const h1s = new Map();
const meta = (html, attr, key) => {
  const m = html.match(new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`)) ?? html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`));
  return m ? decode(m[1]) : null;
};
const kindOf = (u) => (u.startsWith('/guides/') ? 'guide' : ['/', '/tools', '/guides', '/how-it-works', '/faq', '/about', '/contact', '/privacy', '/terms'].includes(u) ? 'info' : 'tool');
const MIN_WORDS = { guide: 1000, tool: 700, info: 120 };
const SKIP_TEXT_CHECK = ['/tools', '/guides']; // pages of links: short on purpose

for (const [u, html] of pages) {
  const head = html.split('</head>')[0];
  const body = html.split('</head>')[1] ?? '';
  const kind = kindOf(u);

  const title = decode(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  if (!title) fail(u, 'no <title>');
  else {
    if (title.length > 60) fail(u, `title is ${title.length} characters (max 60): "${title}"`);
    titles.set(title, [...(titles.get(title) ?? []), u]);
  }
  const description = meta(head, 'name', 'description');
  if (!description) fail(u, 'no meta description');
  else {
    if (description.length < 50 || description.length > 160) fail(u, `description is ${description.length} characters (50 to 160)`);
    descriptions.set(description, [...(descriptions.get(description) ?? []), u]);
  }

  const canonicals = [...head.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/g)].map((m) => m[1]);
  const expected = `https://transcribevid.com${u === '/' ? '/' : u}`;
  if (canonicals.length !== 1) fail(u, `${canonicals.length} canonical links (need exactly 1)`);
  else if (canonicals[0] !== expected) fail(u, `canonical is ${canonicals[0]}, expected ${expected}`);
  if (meta(head, 'property', 'og:url') !== expected) fail(u, `og:url is not ${expected}`);
  if (!/^index, follow/.test(meta(head, 'name', 'robots') ?? '')) fail(u, 'robots meta is not "index, follow"');
  if (!/<html[^>]*\slang="en"/.test(html)) fail(u, 'no lang="en" on <html>');
  if (!meta(head, 'property', 'og:image')) fail(u, 'no og:image');

  const h1 = [...body.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)].map((m) => strip(m[0]));
  if (h1.length !== 1) fail(u, `${h1.length} h1 elements (need exactly 1)`);
  else h1s.set(h1[0], [...(h1s.get(h1[0]) ?? []), u]);

  // structured data
  const types = [];
  for (const m of head.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      types.push(data['@type']);
    } catch (e) {
      fail(u, `structured data does not parse: ${e.message}`);
    }
  }
  const need = { guide: ['BreadcrumbList', 'Article', 'FAQPage'], tool: ['BreadcrumbList', 'WebApplication', 'FAQPage', 'HowTo'], info: u === '/' ? ['Organization', 'WebSite', 'WebApplication'] : ['BreadcrumbList'] }[kind];
  for (const t of need) if (!types.includes(t)) fail(u, `structured data has no ${t} (has: ${types.join(', ') || 'none'})`);
  if (new Set(types).size !== types.length) fail(u, `the same structured data type twice: ${types.join(', ')}`);

  // text
  const text = strip(body);
  const words = text.split(' ').length;
  if (!SKIP_TEXT_CHECK.includes(u) && words < MIN_WORDS[kind]) fail(u, `only ${words} words of text (${kind} pages need ${MIN_WORDS[kind]})`);
  for (const bad of ['{limits}', 'undefined', 'NaN', '[object', 'null null']) if (text.includes(bad)) fail(u, `the text contains "${bad}"`);
  if (/\bLoading…|Loading&hellip;/.test(text) && u !== '/') fail(u, 'shows the loading placeholder instead of the page');

  // links
  for (const m of body.matchAll(/<a\s[^>]*href="([^"#?]*)(?:[?#][^"]*)?"/g)) {
    const href = m[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = href.replace(/\/+$/, '') || '/';
    if (/^\/(logs|api|jobs|cdn-cgi)(\/|$)/.test(target)) continue; // client-only / Cloudflare paths
    if (/\.(png|ico|svg|jpe?g|webp|txt|xml|webmanifest)$/.test(target)) continue;
    if (!pages.has(target)) fail(u, `links to ${href}, which is not a page of the site`);
  }
}

for (const [label, map] of [['title', titles], ['description', descriptions], ['h1', h1s]]) {
  for (const [value, urls] of map) if (urls.length > 1) fail(urls.join(' and '), `share the same ${label}: "${value.slice(0, 70)}"`);
}

if (problems.length) {
  console.error(`audit-prerender: ${problems.length} problem(s) in ${pages.size} pages:\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}
console.log(`audit-prerender: ${pages.size} pages clean (titles, descriptions, canonicals, h1, structured data, text, links, sitemap).`);
