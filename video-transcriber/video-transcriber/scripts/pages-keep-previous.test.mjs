// Tests for scripts/pages-keep-previous.mjs: old builds' hashed files are kept next to the new build's, nothing else is.
//   node --test scripts/pages-keep-previous.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { hashedFiles, keepPrevious } from './pages-keep-previous.mjs';

function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'keepprev-'));
}
/** a fake build folder: an index.html, some pages, and the given hashed files (with their name as content) */
function build(dir, hashed, extra = {}) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), '<html></html>');
  fs.writeFileSync(path.join(dir, 'faq.html'), 'faq');
  fs.writeFileSync(path.join(dir, 'robots.txt'), 'robots');
  for (const f of hashed) {
    fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true });
    fs.writeFileSync(path.join(dir, f), `content of ${f}`);
  }
  for (const [f, c] of Object.entries(extra)) fs.writeFileSync(path.join(dir, f), c);
  return dir;
}
const list = (dir) => fs.readdirSync(dir).sort();

test('only content-hashed files count: main, chunk, polyfills, worker, styles and media', () => {
  const dir = build(tmp(), ['main-AAAA1111.js', 'chunk-BBBB2222.js', 'polyfills-CCCC3333.js', 'worker-DDDD4444.js', 'styles-EEEE5555.css', 'media/font-FFFF6666.woff2']);
  fs.writeFileSync(path.join(dir, 'main.js'), 'unhashed');
  fs.writeFileSync(path.join(dir, 'ads.txt'), 'x');
  fs.writeFileSync(path.join(dir, 'chunk-ZZZ.map'), 'x');
  assert.deepEqual(hashedFiles(dir), ['chunk-BBBB2222.js', 'main-AAAA1111.js', 'media/font-FFFF6666.woff2', 'polyfills-CCCC3333.js', 'styles-EEEE5555.css', 'worker-DDDD4444.js']);
});

test('the first run archives this build and adds nothing', () => {
  const root = tmp();
  const dist = build(path.join(root, 'dist'), ['main-OLD11111.js', 'chunk-OLD22222.js']);
  const r = keepPrevious({ dist, archive: path.join(root, 'arch'), label: 'v1' });
  assert.equal(r.own, 2);
  assert.deepEqual(r.kept, []);
  assert.deepEqual(list(path.join(root, 'arch', 'v1')).filter((n) => n !== '.archived'), ['chunk-OLD22222.js', 'main-OLD11111.js']);
  assert.deepEqual(list(dist), ['chunk-OLD22222.js', 'faq.html', 'index.html', 'main-OLD11111.js', 'robots.txt']);
});

test('the next build gets the previous build\'s files added, and its own are untouched', async () => {
  const root = tmp();
  const arch = path.join(root, 'arch');
  keepPrevious({ dist: build(path.join(root, 'd1'), ['main-AAAA1111.js', 'chunk-BBBB2222.js', 'chunk-SAME0000.js']), archive: arch, label: 'v1' });
  await new Promise((r) => setTimeout(r, 10));
  const d2 = build(path.join(root, 'd2'), ['main-NEW33333.js', 'chunk-SAME0000.js']);
  fs.writeFileSync(path.join(d2, 'chunk-SAME0000.js'), 'the NEW build version');
  const r = keepPrevious({ dist: d2, archive: arch, label: 'v2' });
  assert.deepEqual(r.kept, [{ label: 'v1', added: 2 }], 'a file with the same name is not copied again');
  assert.equal(fs.readFileSync(path.join(d2, 'chunk-SAME0000.js'), 'utf8'), 'the NEW build version', 'never replaces a file the new build has');
  assert.deepEqual(list(d2).filter((n) => /^(main|chunk)/.test(n)), ['chunk-BBBB2222.js', 'chunk-SAME0000.js', 'main-AAAA1111.js', 'main-NEW33333.js']);
  // the kept files are the OLD content
  assert.equal(fs.readFileSync(path.join(d2, 'main-AAAA1111.js'), 'utf8'), 'content of main-AAAA1111.js');
});

test('pages, robots and ads.txt of an old build are never brought back', async () => {
  const root = tmp();
  const arch = path.join(root, 'arch');
  keepPrevious({ dist: build(path.join(root, 'd1'), ['main-AAAA1111.js'], { 'old-page.html': 'gone' }), archive: arch, label: 'v1' });
  await new Promise((r) => setTimeout(r, 10));
  const d2 = build(path.join(root, 'd2'), ['main-NEW33333.js']);
  keepPrevious({ dist: d2, archive: arch, label: 'v2' });
  assert.equal(fs.existsSync(path.join(d2, 'old-page.html')), false);
});

test('--keep N keeps only the newest N earlier builds; 0 keeps none', async () => {
  const root = tmp();
  const arch = path.join(root, 'arch');
  for (const [i, v] of ['v1', 'v2', 'v3'].entries()) {
    keepPrevious({ dist: build(path.join(root, `d${i}`), [`main-${v.toUpperCase()}${v.toUpperCase()}${v.toUpperCase()}.js`]), archive: arch, label: v, keep: 0 });
    await new Promise((r) => setTimeout(r, 10));
  }
  const d4 = build(path.join(root, 'd4'), ['main-V4V4V4.js']);
  const r2 = keepPrevious({ dist: d4, archive: arch, label: 'v4', keep: 2 });
  assert.deepEqual(r2.kept.map((k) => k.label), ['v3', 'v2'], 'newest first');
  const d5 = build(path.join(root, 'd5'), ['main-V5V5V5.js']);
  assert.deepEqual(keepPrevious({ dist: d5, archive: arch, label: 'v5', keep: 0 }).kept, []);
  assert.equal(fs.existsSync(path.join(d5, 'main-V3V3V3.js')), false);
});

test('archives beyond the newest five are deleted', async () => {
  const root = tmp();
  const arch = path.join(root, 'arch');
  for (let i = 1; i <= 7; i++) {
    keepPrevious({ dist: build(path.join(root, `d${i}`), [`main-VER${i}AAAA.js`]), archive: arch, label: `v${i}`, keep: 0 });
    await new Promise((r) => setTimeout(r, 10));
  }
  assert.deepEqual(list(arch), ['v3', 'v4', 'v5', 'v6', 'v7']);
});

test('running it again with the same label replaces that archive, and does not keep itself', () => {
  const root = tmp();
  const arch = path.join(root, 'arch');
  keepPrevious({ dist: build(path.join(root, 'd1'), ['main-AAAA1111.js']), archive: arch, label: 'same' });
  const r = keepPrevious({ dist: build(path.join(root, 'd2'), ['main-BBBB2222.js']), archive: arch, label: 'same' });
  assert.deepEqual(r.kept, []);
  assert.deepEqual(list(path.join(arch, 'same')).filter((n) => n !== '.archived'), ['main-BBBB2222.js']);
});

test('media files in sub-folders are kept too', async () => {
  const root = tmp();
  const arch = path.join(root, 'arch');
  keepPrevious({ dist: build(path.join(root, 'd1'), ['main-AAAA1111.js', 'media/a/font-GGGG7777.woff2']), archive: arch, label: 'v1' });
  await new Promise((r) => setTimeout(r, 10));
  const d2 = build(path.join(root, 'd2'), ['main-NEW33333.js']);
  keepPrevious({ dist: d2, archive: arch, label: 'v2' });
  assert.equal(fs.existsSync(path.join(d2, 'media', 'a', 'font-GGGG7777.woff2')), true);
});

test('refuses a bad label, a folder that is not a build, and a build without hashed files', () => {
  const root = tmp();
  const dist = build(path.join(root, 'd'), ['main-AAAA1111.js']);
  assert.throws(() => keepPrevious({ dist, archive: path.join(root, 'a'), label: '../evil' }), /bad label/);
  assert.throws(() => keepPrevious({ dist, archive: path.join(root, 'a'), label: '' }), /bad label/);
  assert.throws(() => keepPrevious({ dist: path.join(root, 'nothing'), archive: path.join(root, 'a'), label: 'v1' }), /not a build folder/);
  const empty = build(path.join(root, 'e'), []);
  assert.throws(() => keepPrevious({ dist: empty, archive: path.join(root, 'a'), label: 'v1' }), /no hashed files/);
});

test('reports the number of files, and warns before the Pages limit', () => {
  const root = tmp();
  const r = keepPrevious({ dist: build(path.join(root, 'd'), ['main-AAAA1111.js']), archive: path.join(root, 'a'), label: 'v1' });
  assert.equal(r.total, 4);
  assert.equal(r.overLimit, false);
  assert.equal(r.warn, false);
});
