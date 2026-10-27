// Makes the "please read this" files for native speakers: the English text and the translation of a few pages, side by side, one file per language.
// usage (from video-transcriber/, after `npm run build:pages` in frontend/):  node scripts/review-pack.mjs [dist dir] [out dir]
// Default pages: the home page, the main tool page and the privacy summary: what the owner's SEO notes ask a native speaker to read first.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALES, localizedPath, readAvailable, readSlugs } from './i18n-data.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const dist = path.resolve(process.argv[2] ?? path.join(root, 'frontend', 'dist', 'frontend', 'browser'));
const out = path.resolve(process.argv[3] ?? path.join(root, 'docs', 'in-browser', 'review'));
const appDir = path.join(root, 'frontend', 'src', 'app');

const NAMES = {
  es: 'Spanish (Español)', pt: 'Portuguese (Português)', fr: 'French (Français)', de: 'German (Deutsch)', it: 'Italian (Italiano)',
  id: 'Indonesian (Bahasa Indonesia)', ja: 'Japanese (日本語)', ko: 'Korean (한국어)', th: 'Thai (ไทย)', vi: 'Vietnamese (Tiếng Việt)',
  tr: 'Turkish (Türkçe)', hi: 'Hindi (हिन्दी)', bn: 'Bengali (বাংলা)', ar: 'Arabic (العربية)', ur: 'Urdu (اردو)',
};
const PAGES = [
  ['/', 'Home page'],
  ['/video-to-text', 'Main tool page: video to text'],
  ['/privacy', 'Privacy policy'],
];

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
/** The visible text blocks of a page's <main> area, in order: headings, paragraphs, list items. */
function blocks(file) {
  const html = fs.readFileSync(file, 'utf8');
  const main = (html.match(/<main[\s\S]*?<\/main>/) ?? [html])[0].replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const list = [];
  for (const m of main.matchAll(/<(h1|h2|h3|p|li|figcaption|summary)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    const text = decode(m[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    if (text && !list.some((b) => b.text === text && b.tag === m[1])) list.push({ tag: m[1], text });
  }
  return list;
}
const pageFile = (p) => path.join(dist, p === '/' ? 'index.html' : p.slice(1) + '.html');
const cell = (s) => s.replace(/\|/g, '\\|');

fs.mkdirSync(out, { recursive: true });
const available = readAvailable(appDir);
for (const lang of LOCALES) {
  const slugs = readSlugs(appDir, lang);
  const parts = [];
  for (const [enPath, title] of PAGES) {
    if (!(available[lang] ?? []).includes(enPath)) continue;
    const localPath = localizedPath(lang, enPath, slugs);
    const enFile = pageFile(enPath);
    const trFile = path.join(dist, localPath === `/${lang}` ? `${lang}.html` : localPath.slice(1) + '.html');
    if (!fs.existsSync(enFile) || !fs.existsSync(trFile)) continue;
    // the English-only "Popular:" line and the lists of other tools (longer in English: 13 pages exist only there) would shift the rows, so they are left out
    let en = blocks(enFile).filter((b) => !/^Popular:/.test(b.text));
    let tr = blocks(trFile);
    const cut = en.findIndex((b) => /^(More free tools|Related tools)$/.test(b.text));
    if (cut > 0) {
      en = en.slice(0, cut);
      tr = tr.slice(0, cut);
    }
    const rows = [];
    for (let i = 0; i < Math.max(en.length, tr.length); i++) rows.push(`| ${i + 1} | ${cell(en[i]?.text ?? '')} | ${cell(tr[i]?.text ?? '')} |`);
    parts.push(`## ${title}\n\nEnglish: https://transcribevid.com${enPath === '/' ? '/' : enPath}  \n${NAMES[lang].split(' ')[0]}: https://transcribevid.com${localPath}\n\n| # | English | ${NAMES[lang]} |\n|---|---|---|\n${rows.join('\n')}\n`);
  }
  const head =
    `# Please read the ${NAMES[lang]} text of TranscribeVid\n\n` +
    `TranscribeVid (https://transcribevid.com) turns video and audio into text, free, in the visitor's browser. The ${NAMES[lang].split(' ')[0]} pages were translated by an AI translator ` +
    `and have **not yet been read by a native speaker**. Please read the tables below (English on the left, ${NAMES[lang].split(' ')[0]} on the right) and tell us:\n\n` +
    `1. any sentence that sounds unnatural, too literal or wrong, with the better wording;\n` +
    `2. any word you would not use for a technical term (transcript, timestamp, subtitle, export, upload...);\n` +
    `3. anything that is rude, confusing or too formal/informal for a tool like this.\n\n` +
    `Reply with the row number and the corrected sentence, for example: "Home page, row 7: write ... instead". You can also read the live pages through the links above each table.\n\n---\n\n`;
  fs.writeFileSync(path.join(out, `${lang}.md`), head + parts.join('\n'));
  console.log(`${lang}: ${parts.length} pages -> ${path.join('docs/in-browser/review', lang + '.md')}`);
}
