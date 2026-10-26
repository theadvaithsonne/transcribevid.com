// Run with:  node --test scripts/i18n-data.test.mjs        (from video-transcriber/)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { LOCALES, localizedPath, readAvailable, readI18n, readSlugs } from './i18n-data.mjs';
import { translatedSourcesFor } from './sitemap-lastmod.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(here, '..', 'frontend');

/** A fake frontend/src/app with Spanish and German translations. */
function fakeApp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-data-'));
  const frontend = path.join(dir, 'frontend');
  const app = path.join(frontend, 'src', 'app');
  fs.mkdirSync(path.join(app, 'i18n', 'slugs'), { recursive: true });
  fs.writeFileSync(
    path.join(app, 'i18n', 'generated.ts'),
    `export const AVAILABLE: Partial<Record<Locale, readonly string[]>> = {\n  es: ['/', '/faq', '/video-to-text', '/guides/srt-vs-vtt'],\n  de: ['/', '/faq'],\n};\n`,
  );
  fs.writeFileSync(
    path.join(app, 'i18n', 'slugs', 'es.ts'),
    `export const SLUGS: Readonly<Record<string, string>> = {\n  '/video-to-text': 'video-a-texto',\n  '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-es',\n};\n`,
  );
  fs.writeFileSync(path.join(app, 'i18n', 'slugs', 'de.ts'), `export const SLUGS: Readonly<Record<string, string>> = {};\n`);
  return { dir, frontend, app };
}

test('the real generated.ts and slug files parse (no language yet is fine; a language that has pages has a slug file)', () => {
  const i18n = readI18n(frontendDir);
  assert.ok(Array.isArray(i18n.languages));
  for (const l of i18n.languages) {
    assert.ok(LOCALES.includes(l));
    assert.ok(i18n.available[l].includes('/'), `${l} has no home page`);
    assert.ok(fs.existsSync(path.join(i18n.appDir, 'i18n', 'slugs', `${l}.ts`)));
  }
});

test('readAvailable, readSlugs and localizedPath follow the same rules as the app', () => {
  const { dir, frontend, app } = fakeApp();
  try {
    assert.deepEqual(readAvailable(app), { es: ['/', '/faq', '/video-to-text', '/guides/srt-vs-vtt'], de: ['/', '/faq'] });
    const slugs = readSlugs(app, 'es');
    assert.deepEqual(slugs, { '/video-to-text': 'video-a-texto', '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-es' });
    assert.deepEqual(readSlugs(app, 'fr'), {}); // no file
    assert.equal(localizedPath('es', '/', slugs), '/es');
    assert.equal(localizedPath('es', '/video-to-text', slugs), '/es/video-a-texto');
    assert.equal(localizedPath('es', '/faq', slugs), '/es/faq');
    assert.equal(localizedPath('es', '/guides/srt-vs-vtt', slugs), '/es/guides/srt-vs-vtt-es');
    const i18n = readI18n(frontend);
    assert.deepEqual(i18n.languages, ['es', 'de']);
    assert.equal(i18n.path('de', '/faq'), '/de/faq');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('translatedSourcesFor: a translated page maps to the file that holds its text (content module, or the dictionary)', () => {
  const { dir, frontend } = fakeApp();
  try {
    const i18n = readI18n(frontend);
    const f = (...p) => path.join(...p);
    assert.deepEqual(translatedSourcesFor('/es/video-a-texto', i18n), [f('features', 'tool-pages', 'content', 'i18n', 'es', 'video-to-text.ts')]);
    assert.deepEqual(translatedSourcesFor('/es/guides/srt-vs-vtt-es', i18n), [f('features', 'guides', 'content', 'i18n', 'es', 'srt-vs-vtt.ts')]);
    assert.deepEqual(translatedSourcesFor('/es', i18n), [f('i18n', 'dict', 'es.ts')]);
    assert.deepEqual(translatedSourcesFor('/es/faq', i18n), [f('i18n', 'dict', 'es.ts')]);
    assert.deepEqual(translatedSourcesFor('/de', i18n), [f('i18n', 'dict', 'de.ts')]);
    assert.equal(translatedSourcesFor('/es/no-such-page', i18n), null);
    assert.equal(translatedSourcesFor('/fr', i18n), null); // French has no pages
    assert.equal(translatedSourcesFor('/video-to-text', i18n), null); // an English address
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
