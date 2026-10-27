// Run with:  node --test scripts/result-images.test.mjs        (from video-transcriber/)
// The transcript screenshots of frontend/public/img (shared/result-figure.ts): one per language, real WebP files, small.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { LOCALES } from './i18n-data.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(here, '..', 'frontend', 'public', 'img');

test('every language of the site, English included, has its own transcript screenshot', () => {
  const expected = ['en', ...LOCALES].map((l) => `transcript-${l}.webp`).sort();
  assert.deepEqual(fs.readdirSync(dir).filter((f) => f.endsWith('.webp')).sort(), expected);
});

test('each screenshot is a WebP file of a small weight (it is loaded on every tool page)', () => {
  for (const l of ['en', ...LOCALES]) {
    const file = path.join(dir, `transcript-${l}.webp`);
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF', `${l}: not a RIFF file`);
    assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP', `${l}: not WebP`);
    assert.ok(bytes.length < 80 * 1024, `${l}: ${bytes.length} bytes is too heavy for a page image`);
  }
});

test('the files have the size the component states (1280 x 660: the width and height attributes stop layout shift)', () => {
  for (const l of ['en', ...LOCALES]) {
    const b = fs.readFileSync(path.join(dir, `transcript-${l}.webp`));
    const kind = b.subarray(12, 16).toString('ascii');
    // extended WebP ("VP8X"): the canvas size minus one, 24 bits each, at bytes 24 and 27; plain lossy ("VP8 "): 14 bits at 26 and 28
    const [w, h] = kind === 'VP8X' ? [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1] : [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    assert.ok(kind === 'VP8X' || kind === 'VP8 ', `${l}: unexpected WebP kind ${kind}`);
    assert.equal(w, 1280, `${l}: width`);
    assert.equal(h, 660, `${l}: height`);
  }
});
