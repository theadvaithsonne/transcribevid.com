#!/usr/bin/env node
/**
 * Lists every English string that has to be translated, as docs/in-browser/i18n-source.json, so translators work from one
 * exact list and a test can tell a stale or missing translation.
 *
 *   node scripts/extract-i18n.mjs           (from video-transcriber/)   write the file
 *   node scripts/extract-i18n.mjs --check   exit 1 when the file is out of date
 *
 * What is collected (see docs/in-browser/I18N.md section 3):
 *   ui    English text used as a translation key: `'text' | t` in a template, `t('text')` / `_t('text')` / `.t('text')` in
 *         code (also "double-quoted" and `template-literal` keys without ${}). `_t('text')` only marks a string that is
 *         translated later (a constant list shown with `{{ item.title | t }}`).
 *   meta  the title, description and (tool pages, guides) label of every public page, by English path: they are translated
 *         as the dictionary keys `title:<path>`, `description:<path>`, `label:<path>`.
 * Long-form pages (tool pages, guides) are content modules translated as whole files, not as keys.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const app = path.join(root, 'frontend', 'src', 'app');
const OUT = path.join(root, 'docs', 'in-browser', 'i18n-source.json');

const SKIP_DIR = new Set(['testing', 'dict']);
const SKIP_FILE = new Set(['generated.ts', 'testing.ts']);
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIR.has(e.name)) walk(p);
    } else if (/\.(html|ts)$/.test(e.name) && !e.name.endsWith('.spec.ts') && !SKIP_FILE.has(e.name) && !p.includes(`${path.sep}content${path.sep}`)) {
      files.push(p);
    }
  }
})(app);

const unescape = (s) => s.replace(/\\(['"`\\])/g, '$1').replace(/\\n/g, '\n');
// 'text' | t   (the key is a string literal; the pipe may be followed by : { params })
const PIPE = /(['"])((?:\\.|(?!\1)[^\\\n])*)\1\s*\|\s*t\b/g;
// t('text'), _t('text'), this.i18n.t('text'), i18n.t("text")
const CALL = /(?<![\w$.])(?:_t|t)\(\s*(['"`])((?:\\.|(?!\1)[^\\])*)\1|\.t\(\s*(['"`])((?:\\.|(?!\3)[^\\])*)\3/g;

const ui = new Map(); // key -> files
const add = (key, file) => {
  if (!key.trim() || key.includes('${')) return;
  const k = unescape(key);
  ui.set(k, [...(ui.get(k) ?? []), path.relative(app, file).split(path.sep).join('/')]);
};
for (const f of files) {
  // comments and documentation examples are not strings the visitor sees
  const text = fs
    .readFileSync(f, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|\s)\/\/.*$/gm, '$1');
  for (const m of text.matchAll(PIPE)) {
    // a pipe applied to something that is not a lone literal (e.g. 'a' + b | t) is not a key: the literal must start the expression
    add(m[2], f);
  }
  for (const m of text.matchAll(CALL)) add(m[2] ?? m[4], f);
}

// ---- page meta
const read = (rel) => fs.readFileSync(path.join(app, rel), 'utf8');
const meta = {};
const strings = (block, name) => {
  const m = block.match(new RegExp(`${name}:\\s*(?:\\n\\s*)?(['"\`])((?:\\\\.|(?!\\1)[^\\\\])*)\\1`));
  return m ? unescape(m[2]) : null;
};
// tool pages and guides: one object per entry in the list files
for (const [rel, kind] of [
  ['features/tool-pages/tool-pages.list.ts', 'tool'],
  ['features/guides/guides.list.ts', 'guide'],
]) {
  const text = read(rel);
  for (const m of text.matchAll(/\{\s*(?:slug:[^\n]*\n\s*)?path:\s*'([^']+)'[\s\S]*?\n\s{2}\},/g)) {
    const block = m[0];
    meta[m[1]] = { title: strings(block, 'title'), description: strings(block, 'description'), label: strings(block, 'label') };
    if (!meta[m[1]].title || !meta[m[1]].description) throw new Error(`extract-i18n: ${kind} entry ${m[1]} has no title / description`);
  }
}
// the fixed pages of app.routes.ts
const routes = read('app.routes.ts');
const DEFAULT_DESCRIPTION = strings(read('core/title.service.ts').match(/export const DEFAULT_DESCRIPTION[\s\S]*?;/)[0].replace('export const DEFAULT_DESCRIPTION =', 'x:'), 'x');
for (const key of ['', 'how-it-works', 'faq', 'about', 'contact', 'privacy', 'terms', 'tools', 'guides']) {
  const start = routes.indexOf(`path: '${key}',`);
  if (start < 0) throw new Error(`extract-i18n: no route '${key}'`);
  const block = routes.slice(start, routes.indexOf('\n  },', start));
  const enPath = key === '' ? '/' : `/${key}`;
  const description = /description:\s*DEFAULT_DESCRIPTION/.test(block) ? DEFAULT_DESCRIPTION : strings(block, 'description');
  meta[enPath] = { title: strings(block, 'title'), description, label: null };
  if (!meta[enPath].title || !meta[enPath].description) throw new Error(`extract-i18n: route ${enPath} has no title / description`);
}
for (const k of Object.keys(meta)) if (meta[k].label === null) delete meta[k].label;

const out = {
  _about: 'GENERATED by scripts/extract-i18n.mjs from the app sources: do not edit. Translators: translate every ui key and every meta entry (dictionary keys title:<path>, description:<path>, label:<path>).',
  ui: [...ui.keys()].sort((a, b) => a.localeCompare(b, 'en')),
  meta: Object.fromEntries(Object.entries(meta).sort(([a], [b]) => a.localeCompare(b, 'en'))),
};
const json = JSON.stringify(out, null, 2) + '\n';

if (process.argv.includes('--check')) {
  const have = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : '';
  if (have !== json) {
    console.error('extract-i18n: docs/in-browser/i18n-source.json is out of date. Run: node scripts/extract-i18n.mjs');
    process.exit(1);
  }
  console.log(`extract-i18n: up to date (${out.ui.length} strings, ${Object.keys(out.meta).length} pages)`);
} else {
  fs.writeFileSync(OUT, json);
  console.log(`extract-i18n: wrote ${out.ui.length} strings and ${Object.keys(out.meta).length} page entries to docs/in-browser/i18n-source.json`);
}
