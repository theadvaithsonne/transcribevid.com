// Run with:  node --test scripts/i18n-dicts.test.mjs        (from video-transcriber/)
// Validates every translation: src/app/i18n/dict/<code>.ts, the page content modules under content/i18n/<code>/ and the
// slug tables. Nothing here is true or false of English: a language without a file is simply not checked.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { LOCALES } from './i18n-data.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const app = path.join(root, 'frontend', 'src', 'app');
const require = createRequire(path.join(root, 'frontend', 'package.json'));
const ts = require('typescript');
const source = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'in-browser', 'i18n-source.json'), 'utf8'));
const INFO = ['/', '/how-it-works', '/faq', '/about', '/contact', '/privacy', '/terms', '/tools', '/guides'];

/** Loads a TypeScript file that only has data exports (no imports of other app files except types). */
function load(file) {
  const out = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', 'require', out)(module, module.exports, () => ({}));
  return module.exports;
}

const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const linkTargets = (s) => [...s.matchAll(/\]\((\/[^)\s]*|https?:[^)\s]+)\)/g)].map((m) => m[1]);
const boldCount = (s) => (s.match(/\*\*/g) ?? []).length;

const expectedMetaKeys = new Set();
for (const [p, m] of Object.entries(source.meta)) {
  expectedMetaKeys.add(`title:${p}`);
  expectedMetaKeys.add(`description:${p}`);
  if (m.label) expectedMetaKeys.add(`label:${p}`);
}
const uiKeys = new Set(source.ui);

for (const code of LOCALES) {
  const dictFile = path.join(app, 'i18n', 'dict', `${code}.ts`);
  if (!fs.existsSync(dictFile)) continue;

  test(`${code}: the dictionary has no stale keys, keeps placeholders, links and bold, and its page meta fits a search result`, () => {
    const mod = load(dictFile);
    const dict = mod.default;
    assert.ok(dict && typeof dict === 'object', 'default export is the dictionary');
    const pages = mod.PAGES ?? [];
    for (const p of pages) assert.ok(INFO.includes(p), `PAGES lists ${p}, not an information page`);
    for (const [key, value] of Object.entries(dict)) {
      assert.ok(uiKeys.has(key) || expectedMetaKeys.has(key), `${code}: "${key.slice(0, 60)}" is not a key of the app (stale?). Run node scripts/extract-i18n.mjs`);
      assert.equal(typeof value, 'string', `${code}: ${key.slice(0, 40)}`);
      assert.ok(value.trim(), `${code}: empty translation of "${key.slice(0, 40)}"`);
      assert.deepEqual(placeholders(value), placeholders(key), `${code}: placeholders differ in "${key.slice(0, 60)}"`);
      assert.deepEqual(linkTargets(value), linkTargets(key), `${code}: links differ in "${key.slice(0, 60)}"`);
      assert.equal(boldCount(value) % 2, 0, `${code}: unbalanced ** in "${key.slice(0, 60)}"`);
      assert.equal(boldCount(value), boldCount(key), `${code}: bold differs in "${key.slice(0, 60)}"`);
      assert.ok(!/<[a-z][^>]*>/i.test(value), `${code}: HTML in "${key.slice(0, 60)}"`);
      if (key.startsWith('title:')) assert.ok(`${value} - TranscribeVid`.length <= 60, `${code}: ${key} is too long for a search result: "${value}"`);
      if (key.startsWith('description:')) assert.ok(value.length >= 50 && value.length <= 160, `${code}: ${key} is ${value.length} characters (50 to 160)`);
    }
    // every page the dictionary says it covers has its meta
    for (const p of pages) for (const k of [`title:${p}`, `description:${p}`]) assert.ok(dict[k], `${code}: PAGES lists ${p} but ${k} is missing`);
  });

  test(`${code}: the dictionary translates (almost) every string of the app`, () => {
    const dict = load(dictFile).default;
    const missing = source.ui.filter((k) => !dict[k]);
    assert.ok(missing.length <= Math.ceil(source.ui.length * 0.02), `${code}: ${missing.length} of ${source.ui.length} strings are not translated, e.g. ${missing.slice(0, 5).map((m) => `"${m.slice(0, 40)}"`).join(', ')}`);
  });
}

/** A translated tool page or guide has the shape of its English original. */
function checkContent(kind, code, dir) {
  const enDir = path.join(app, 'features', kind === 'tool' ? 'tool-pages' : 'guides', 'content');
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.ts') && x !== 'index.ts')) {
    const slug = f.slice(0, -3);
    test(`${code}: ${kind} ${slug} has the structure of the English page`, () => {
      const en = load(path.join(enDir, f)).CONTENT;
      const tr = load(path.join(dir, f)).CONTENT;
      assert.ok(en, `no English ${slug}`);
      const shape = (c) =>
        kind === 'tool'
          ? { steps: c.steps.length, tips: c.tips.length >= 3, faqs: c.faqs.length, sections: (c.sections ?? []).length, links: (c.links ?? []).map((l) => l.path), accepts: c.accepts.length, downloads: c.downloads.map((d) => d.name), dropKind: c.dropKind, record: !!c.record }
          : { blocks: c.blocks.length, faqs: c.faqs.length, links: c.links.map((l) => l.path), toolPath: c.toolPath };
      assert.deepEqual(shape(tr), shape(en), `${code}/${slug}: the structure differs from English`);
      for (const [name, value] of Object.entries(tr)) assert.ok(value !== '' && value !== undefined, `${code}/${slug}: ${name} is empty`);
      assert.notEqual(tr.h1, en.h1, `${code}/${slug}: the h1 is still English`);
      assert.notEqual(tr.lead, en.lead, `${code}/${slug}: the lead is still English`);
      const text = JSON.stringify(tr);
      assert.ok(!/\{(?!limits\})[a-z]+\}/.test(text), `${code}/${slug}: unknown placeholder`);
    });
  }
}
for (const code of LOCALES) {
  for (const [kind, rel] of [
    ['tool', path.join('features', 'tool-pages', 'content', 'i18n', code)],
    ['guide', path.join('features', 'guides', 'content', 'i18n', code)],
  ]) {
    const dir = path.join(app, rel);
    if (fs.existsSync(dir)) checkContent(kind, code, dir);
  }
}

test('slug tables: unique per language, ASCII for Latin-script languages, never a reserved word', () => {
  const RESERVED = new Set(['faq', 'how-it-works', 'about', 'contact', 'privacy', 'terms', 'tools', 'guides', 'jobs', 'logs']);
  for (const code of LOCALES) {
    const file = path.join(app, 'i18n', 'slugs', `${code}.ts`);
    if (!fs.existsSync(file)) continue;
    const slugs = load(file).SLUGS;
    const values = Object.values(slugs);
    assert.equal(new Set(values).size, values.length, `${code}: two pages share a slug`);
    for (const [en, slug] of Object.entries(slugs)) {
      assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)?$/, `${code}: "${slug}" is not a plain ASCII slug`);
      assert.ok(!RESERVED.has(slug), `${code}: ${slug} is a reserved word`);
      assert.equal(en.startsWith('/guides/'), slug.startsWith('guides/'), `${code}: a guide keeps its guides/ segment (${en} -> ${slug})`);
    }
  }
});
