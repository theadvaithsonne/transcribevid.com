// Run with:  node --test scripts/sitemap-lastmod.test.mjs        (from video-transcriber/)
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { addLastmod, gitDate, guideUpdated, sourcesFor } from './sitemap-lastmod.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(here, '..', 'frontend');
const sitemap = (...paths) =>
  `<?xml version="1.0"?>\n<urlset>\n${paths.map((p) => `  <url>\n    <loc>https://transcribevid.com${p}</loc>\n  </url>\n`).join('')}</urlset>\n`;

test('every address of the real sitemap knows where its text lives (nothing falls through to a guess)', () => {
  const xml = fs.readFileSync(path.join(frontendDir, 'public', 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  assert.ok(locs.length >= 30);
  for (const p of locs) {
    if (p.startsWith('/guides/')) continue; // guides take their date from guides.list.ts
    const sources = sourcesFor(p);
    assert.ok(sources && sources.length, `no sources for ${p}`);
    for (const s of sources) assert.ok(fs.existsSync(path.join(frontendDir, 'src', 'app', s)), `${p}: ${s} does not exist`);
  }
});

test('a guide takes the "updated" date printed on its page', () => {
  const list = fs.readFileSync(path.join(frontendDir, 'src', 'app', 'features', 'guides', 'guides.list.ts'), 'utf8');
  assert.match(guideUpdated(list, 'srt-vs-vtt'), /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(guideUpdated(list, 'no-such-guide'), null);
  const out = addLastmod(sitemap('/guides/srt-vs-vtt'), { frontendDir, dateOf: () => assert.fail('a guide must not ask git') });
  assert.match(out, /<loc>https:\/\/transcribevid\.com\/guides\/srt-vs-vtt<\/loc>\s*<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
});

test('other pages take the date git gives for their own files, and none when git cannot say', () => {
  const asked = [];
  const out = addLastmod(sitemap('/', '/wav-to-text', '/privacy', '/not-a-page-we-know/deep'), {
    frontendDir,
    dateOf: (files) => {
      asked.push(files.map((f) => path.basename(f)));
      return files.some((f) => f.endsWith('wav-to-text.ts')) ? null : '2026-01-02';
    },
  });
  assert.match(out, /<loc>https:\/\/transcribevid\.com\/<\/loc>\s*<lastmod>2026-01-02<\/lastmod>/);
  assert.match(out, /<loc>https:\/\/transcribevid\.com\/privacy<\/loc>\s*<lastmod>2026-01-02<\/lastmod>/);
  assert.doesNotMatch(out, /wav-to-text<\/loc>\s*<lastmod>/); // git could not say: no date, not a guess
  assert.doesNotMatch(out, /deep<\/loc>\s*<lastmod>/); // an address it does not know: no date
  assert.deepEqual(asked[0], ['upload.html', 'upload.ts']);
  assert.deepEqual(asked[1], ['wav-to-text.ts']);
});

test('gitDate: the commit date of committed files, today for uncommitted changes, null outside a repository or for missing files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lastmod-'));
  try {
    const file = path.join(dir, 'page.ts');
    assert.equal(gitDate([file], dir), null); // no such file
    fs.writeFileSync(file, 'one');
    assert.equal(gitDate([file], dir, '2030-01-01'), null); // not a repository
    const git = (...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd: dir, stdio: 'ignore' });
    git('init', '-q');
    assert.equal(gitDate([file], dir, '2030-01-01'), '2030-01-01'); // untracked: it is new, so changed today
    git('add', '.');
    execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', 'x', '--date=2026-03-04T10:00:00'], {
      cwd: dir,
      env: { ...process.env, GIT_COMMITTER_DATE: '2026-03-04T10:00:00' },
      stdio: 'ignore',
    });
    assert.equal(gitDate([file], dir, '2030-01-01'), '2026-03-04'); // committed: its commit date
    fs.writeFileSync(file, 'two');
    assert.equal(gitDate([file], dir, '2030-01-01'), '2030-01-01'); // changed since: today
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
