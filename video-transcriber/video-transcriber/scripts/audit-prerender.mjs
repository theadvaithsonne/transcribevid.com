#!/usr/bin/env node
/**
 * Audits the PRERENDERED site the way a search engine reads it (no JavaScript): run it after `npm run build:pages`.
 *
 *   node scripts/audit-prerender.mjs [frontend/dist/frontend/browser]      (from video-transcriber/)
 *
 * For every public page, in every language, it checks: a title of at most 60 characters and a description of 50 to 160,
 * both unique across the site; one canonical address that is the page's own; one h1 (unique); an indexable robots tag; the
 * structured data parses and has the types the page kind needs; enough real text; no leftover placeholders; every internal
 * link goes to a page that exists. For translated pages also: <html lang> and dir, og:locale, the hreflang set (itself
 * included, x-default = English, equal to the sitemap's, and every alternate lists the page back), most links stay in the
 * page's language, and the text is not left in English. The sitemap and the pages must agree each way.
 * Exits 1 with the list of problems, 0 when clean.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, RTL, readI18n } from './i18n-data.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(process.argv[2] ?? 'frontend/dist/frontend/browser');
if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error(`audit-prerender: ${root} has no index.html (run the production build first: npm run build:pages in frontend/)`);
  process.exit(1);
}
const i18n = readI18n(path.resolve(here, '..', 'frontend'));
const OG = Object.fromEntries(
  [...fs.readFileSync(path.join(i18n.appDir, 'i18n', 'locales.ts'), 'utf8').matchAll(/code:\s*'([a-z]{2})'[^\n]*?og:\s*'([a-z]{2}_[A-Z]{2})'/g)].map((m) => [m[1], m[2]]),
);

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
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<pre[\s\S]*?<\/pre>|<noscript[\s\S]*?<\/noscript>/g, ' ')
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
const sitemapText = fs.existsSync(sitemapFile) ? fs.readFileSync(sitemapFile, 'utf8') : '';
const entries = [...sitemapText.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
  url: new URL(m[1].match(/<loc>\s*([^<\s]+)\s*<\/loc>/)[1]).pathname.replace(/\/+$/, '') || '/',
  alternates: [...m[1].matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/g)].map((a) => [a[1], a[2]]),
}));
const sitemap = entries.map((e) => e.url);
if (!sitemap.length) fail('sitemap.xml', 'missing or empty');
for (const u of sitemap) if (!pages.has(u)) fail(u, 'is in the sitemap but has no prerendered page');
for (const u of pages.keys()) if (!sitemap.includes(u)) fail(u, 'is prerendered but not in the sitemap');
if (new Set(sitemap).size !== sitemap.length) fail('sitemap.xml', 'lists an address twice');
for (const m of sitemapText.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)) if (!/^\d{4}-\d{2}-\d{2}$/.test(m[1])) fail('sitemap.xml', `<lastmod> "${m[1]}" is not a date`);

// ------------------------------------------------------------------ helpers
const localeOf = (u) => {
  const m = u.match(/^\/([a-z]{2})(\/|$)/);
  return m && LOCALES.includes(m[1]) && i18n.available[m[1]] ? m[1] : 'en';
};
/** The English path behind an address (a translated address is mapped back), "/" for a home page. */
const enPathOfUrl = (u, locale) => {
  if (locale === 'en') return u;
  return i18n.available[locale].find((p) => i18n.path(locale, p) === u) ?? null;
};
const INFO = ['/', '/tools', '/guides', '/how-it-works', '/faq', '/about', '/contact', '/privacy', '/terms'];
const kindOfEn = (p) => (p.startsWith('/guides/') ? 'guide' : INFO.includes(p) ? 'info' : 'tool');
/** English pages are 800-1,900 words; languages that pack more meaning into a word (Korean, Arabic, Turkish ...) count fewer, so a translated page needs 75% of that. */
const MIN_WORDS = { guide: 1000, tool: 700, info: 120 };
const minWords = (kind, locale) => Math.round(MIN_WORDS[kind] * (locale === 'en' ? 1 : 0.75));
const SKIP_TEXT_CHECK = ['/tools', '/guides'];

/** Words of a text: whitespace words, or dictionary words for the languages written without spaces. */
function countWords(text, locale) {
  if (locale === 'ja' || locale === 'th') {
    const seg = new Intl.Segmenter(locale, { granularity: 'word' });
    let n = 0;
    for (const s of seg.segment(text)) if (s.isWordLike) n++;
    return n;
  }
  return text.split(' ').filter(Boolean).length;
}

const ENGLISH_WORDS = new Set(['the', 'and', 'your', 'you', 'with', 'for', 'from', 'this', 'that', 'which', 'when', 'into']);
/** Share of English function words in a Latin-script page (a translated page should have almost none), or of ASCII letters in other scripts. */
function englishShare(text, locale) {
  const NON_LATIN = ['ja', 'ko', 'th', 'hi', 'bn', 'ar', 'ur'];
  if (NON_LATIN.includes(locale)) {
    const letters = text.match(/\p{L}/gu) ?? [];
    const ascii = letters.filter((c) => /[A-Za-z]/.test(c)).length;
    return letters.length ? ascii / letters.length : 0;
  }
  const words = text.toLowerCase().match(/\p{L}+/gu) ?? [];
  return words.length ? words.filter((w) => ENGLISH_WORDS.has(w)).length / words.length : 0;
}

const meta = (html, attr, key) => {
  const m = html.match(new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`)) ?? html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`));
  return m ? decode(m[1]) : null;
};

// ------------------------------------------------------------------ per page
const titles = new Map();
const descriptions = new Map();
const h1s = new Map();
const hreflangOf = new Map();

for (const [u, html] of pages) {
  const head = html.split('</head>')[0];
  const body = html.split('</head>')[1] ?? '';
  const locale = localeOf(u);
  const enPath = enPathOfUrl(u, locale);
  if (!enPath) {
    fail(u, 'is a translated address that no page of that language owns');
    continue;
  }
  const kind = kindOfEn(enPath);

  const title = decode(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  if (!title) fail(u, 'no <title>');
  else {
    if (title.length > 60) fail(u, `title is ${title.length} characters (max 60): "${title}"`);
    titles.set(`${locale}|${title}`, [...(titles.get(`${locale}|${title}`) ?? []), u]);
  }
  const description = meta(head, 'name', 'description');
  if (!description) fail(u, 'no meta description');
  else {
    if (description.length < 50 || description.length > 160) fail(u, `description is ${description.length} characters (50 to 160)`);
    descriptions.set(`${locale}|${description}`, [...(descriptions.get(`${locale}|${description}`) ?? []), u]);
  }

  const canonicals = [...head.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/g)].map((m) => m[1]);
  const expected = `https://transcribevid.com${u === '/' ? '/' : u}`;
  if (canonicals.length !== 1) fail(u, `${canonicals.length} canonical links (need exactly 1)`);
  else if (canonicals[0] !== expected) fail(u, `canonical is ${canonicals[0]}, expected ${expected}`);
  if (meta(head, 'property', 'og:url') !== expected) fail(u, `og:url is not ${expected}`);
  if (!/^index, follow/.test(meta(head, 'name', 'robots') ?? '')) fail(u, 'robots meta is not "index, follow"');
  if (!meta(head, 'property', 'og:image')) fail(u, 'no og:image');

  // language of the page
  const htmlTag = html.match(/<html[^>]*>/)?.[0] ?? '';
  if (!new RegExp(`\\slang="${locale}"`).test(htmlTag)) fail(u, `<html> has no lang="${locale}" (${htmlTag})`);
  const wantDir = RTL.has(locale) ? 'rtl' : 'ltr';
  if (!new RegExp(`\\sdir="${wantDir}"`).test(htmlTag)) fail(u, `<html> has no dir="${wantDir}"`);
  if (OG[locale] && meta(head, 'property', 'og:locale') !== OG[locale]) fail(u, `og:locale is ${meta(head, 'property', 'og:locale')}, expected ${OG[locale]}`);

  const h1 = [...body.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)].map((m) => strip(m[0]));
  if (h1.length !== 1) fail(u, `${h1.length} h1 elements (need exactly 1)`);
  else h1s.set(`${locale}|${h1[0]}`, [...(h1s.get(`${locale}|${h1[0]}`) ?? []), u]);

  // structured data
  const types = [];
  for (const m of head.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      types.push(data['@type']);
      if (data.inLanguage !== undefined && data.inLanguage !== locale) fail(u, `structured data ${data['@type']} says inLanguage "${data.inLanguage}", the page is ${locale}`);
    } catch (e) {
      fail(u, `structured data does not parse: ${e.message}`);
    }
  }
  const need = { guide: ['BreadcrumbList', 'Article', 'FAQPage'], tool: ['BreadcrumbList', 'WebApplication', 'FAQPage', 'HowTo'], info: enPath === '/' ? ['Organization', 'WebSite', 'WebApplication'] : ['BreadcrumbList'] }[kind];
  for (const t of need) if (!types.includes(t)) fail(u, `structured data has no ${t} (has: ${types.join(', ') || 'none'})`);
  if (new Set(types).size !== types.length) fail(u, `the same structured data type twice: ${types.join(', ')}`);

  // text
  const text = strip(body);
  const words = countWords(text, locale);
  if (!SKIP_TEXT_CHECK.includes(enPath) && words < minWords(kind, locale)) fail(u, `only ${words} words of text (${kind} pages need ${minWords(kind, locale)})`);
  for (const bad of ['{limits}', 'undefined', 'NaN', '[object', 'null null', '{n}', '{name}', '{date}', '{brand}', '{email}']) if (text.includes(bad)) fail(u, `the text contains "${bad}"`);
  if (/Loading…|Loading&hellip;/.test(text) && u !== '/') fail(u, 'shows the loading placeholder instead of the page');
  if (locale !== 'en') {
    // only the page's own content: not the header, the language names of the menus, the footer, the operator's e-mail and address
    const main = strip(body.match(/<main[\s\S]*?<\/main>/)?.[0] ?? body).replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, ' ');
    const share = englishShare(main, locale);
    const limit = ['ja', 'ko', 'th', 'hi', 'bn', 'ar', 'ur'].includes(locale) ? 0.4 : 0.03;
    if (share > limit) fail(u, `the text is mostly English (${(share * 100).toFixed(1)}% English words / Latin letters in a ${locale} page)`);
  }

  // links
  const hrefs = [];
  for (const m of body.matchAll(/<a\s[^>]*href="([^"#?]*)(?:[?#][^"]*)?"/g)) {
    const href = m[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = href.replace(/\/+$/, '') || '/';
    if (/^\/(logs|api|jobs|cdn-cgi)(\/|$)/.test(target) || /^\/[a-z]{2}\/jobs\//.test(target)) continue; // client-only / Cloudflare paths
    if (/\.(png|ico|svg|jpe?g|webp|txt|xml|webmanifest)$/.test(target)) continue;
    if (!pages.has(target)) fail(u, `links to ${href}, which is not a page of the site`);
    hrefs.push(target);
  }
  if (locale !== 'en') {
    // links in a translated page stay in its language (links to the other languages' versions and to English-only pages are the exceptions)
    const own = hrefs.filter((h) => h === `/${locale}` || h.startsWith(`/${locale}/`)).length;
    const switcher = hrefs.filter((h) => LOCALES.some((l) => l !== locale && (h === `/${l}` || h.startsWith(`/${l}/`)))).length;
    const english = hrefs.length - own - switcher;
    if (own < 8) fail(u, `only ${own} links stay in ${locale}`);
    if (english > 14) fail(u, `${english} links leave ${locale} for English pages`);
  }

  // hreflang: the page's own <link rel="alternate"> set
  const set = [...head.matchAll(/<link[^>]*rel="alternate"[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/g)].map((m) => [m[1], m[2]]);
  hreflangOf.set(u, set);
}

// hreflang: equal to the sitemap's, itself included, x-default = English, reciprocal
for (const e of entries) {
  const set = hreflangOf.get(e.url);
  if (!set) continue;
  const fmt = (list) => list.map((a) => a.join('=')).sort().join(' ');
  if (fmt(set) !== fmt(e.alternates)) fail(e.url, `the hreflang links of the page differ from the sitemap's: page [${fmt(set)}] sitemap [${fmt(e.alternates)}]`);
  if (!set.length) continue;
  const self = `https://transcribevid.com${e.url === '/' ? '/' : e.url}`;
  if (!set.some((a) => a[1] === self)) fail(e.url, 'hreflang set does not include the page itself');
  const en = set.find((a) => a[0] === 'en');
  const xd = set.find((a) => a[0] === 'x-default');
  if (!en || !xd || en[1] !== xd[1]) fail(e.url, 'x-default must be the English page');
  for (const [lang, href] of set) {
    const target = new URL(href).pathname.replace(/\/+$/, '') || '/';
    if (!pages.has(target)) fail(e.url, `hreflang ${lang} points at ${href}, which is not a page`);
    const back = hreflangOf.get(target) ?? [];
    if (lang !== 'x-default' && !back.some((a) => a[1] === self)) fail(e.url, `hreflang ${lang} (${href}) does not list this page back`);
    if (lang !== 'x-default' && lang !== 'en' && localeOf(target) !== lang) fail(e.url, `hreflang ${lang} points at ${href}, which is not a ${lang} page`);
  }
}

for (const [label, map] of [['title', titles], ['description', descriptions], ['h1', h1s]]) {
  for (const [value, urls] of map) if (urls.length > 1) fail(urls.join(' and '), `share the same ${label}: "${value.slice(value.indexOf('|') + 1, value.indexOf('|') + 71)}"`);
}

if (problems.length) {
  console.error(`audit-prerender: ${problems.length} problem(s) in ${pages.size} pages:\n  - ${problems.slice(0, 120).join('\n  - ')}${problems.length > 120 ? `\n  ... and ${problems.length - 120} more` : ''}`);
  process.exit(1);
}
const langs = new Set([...pages.keys()].map(localeOf));
console.log(`audit-prerender: ${pages.size} pages clean in ${langs.size} language(s) (${[...langs].join(', ')}): titles, descriptions, canonicals, language, hreflang, h1, structured data, text, links, sitemap.`);
