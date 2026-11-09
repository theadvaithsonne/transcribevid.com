// Tests for scripts/pages-preload-links.mjs: preload addresses get a leading "/" so Cloudflare Pages' Link header (Early Hints)
// names the same file on every page, however deep the page address is.
//   node --test scripts/pages-preload-links.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { absolutizePreloads, relativePreloads } from './pages-preload-links.mjs';

const shell = (links) => `<!doctype html><html><head><base href="/"><title>x</title></head><body><app-root></app-root>${links}<script src="main-ABC.js" type="module"></script></body></html>`;

test('a relative modulepreload gets a leading slash, and only the address changes', () => {
  const { html, changed } = absolutizePreloads(shell('<link rel="modulepreload" href="chunk-K5A77OEP.js">'));
  assert.equal(changed, 1);
  assert.ok(html.includes('<link rel="modulepreload" href="/chunk-K5A77OEP.js">'));
});

test('all ten tags of a page are fixed, in any attribute order and quote style', () => {
  const tags = [
    '<link rel="modulepreload" href="chunk-A.js">',
    "<link rel='modulepreload' href='chunk-B.js'>",
    '<link href="chunk-C.js" rel="modulepreload">',
    '<link rel="modulepreload" crossorigin href="chunk-D.js">',
    '<link rel="preload" as="script" href="chunk-E.js">',
    '<LINK REL="MODULEPRELOAD" HREF="chunk-F.js">',
  ].join('');
  const { html, changed } = absolutizePreloads(shell(tags));
  assert.equal(changed, 6);
  assert.deepEqual(relativePreloads(html), []);
  for (const n of 'ABCDEF') assert.match(html, new RegExp(`href=["']/chunk-${n}\\.js["']`, 'i'));
});

test('addresses that are already fine are left alone: root-relative, protocol-relative, absolute, data and empty', () => {
  const links = '<link rel="modulepreload" href="/chunk-A.js"><link rel="modulepreload" href="//cdn.example/chunk-B.js"><link rel="preload" href="https://fonts.example/a.woff2" as="font"><link rel="preload" href="data:text/plain,x"><link rel="preload" href="">';
  const { html, changed } = absolutizePreloads(shell(links));
  assert.equal(changed, 0);
  assert.equal(html, shell(links));
  assert.deepEqual(relativePreloads(html), []);
});

test('a leading "./" is dropped, not doubled', () => {
  const { html } = absolutizePreloads(shell('<link rel="modulepreload" href="./chunk-A.js">'));
  assert.ok(html.includes('href="/chunk-A.js"'));
  assert.ok(!html.includes('/./'));
});

test('other link tags are untouched: stylesheets, icons, manifest, canonical, prefetch', () => {
  const links =
    '<link rel="stylesheet" href="styles-ABC.css" media="print" onload="this.media=\'all\'"><link rel="icon" href="favicon.svg"><link rel="manifest" href="manifest.webmanifest"><link rel="canonical" href="faq"><link rel="prefetch" href="chunk-X.js">';
  const { html, changed } = absolutizePreloads(shell(links));
  assert.equal(changed, 0);
  assert.equal(html, shell(links));
});

test('scripts, text and the base tag are untouched, and a page without preloads is returned as it was', () => {
  const page = '<html><head><base href="/"></head><body><script src="main-ABC.js"></script><p>rel="modulepreload" href="chunk-A.js" in the text</p></body></html>';
  const { html, changed } = absolutizePreloads(page);
  assert.equal(changed, 0);
  assert.equal(html, page);
});

test('running it twice changes nothing the second time', () => {
  const once = absolutizePreloads(shell('<link rel="modulepreload" href="chunk-A.js"><link rel="modulepreload" href="chunk-B.js">'));
  const twice = absolutizePreloads(once.html);
  assert.equal(twice.changed, 0);
  assert.equal(twice.html, once.html);
});

test('relativePreloads names what is left, for the build check', () => {
  const left = relativePreloads(shell('<link rel="modulepreload" href="chunk-A.js"><link rel="modulepreload" href="/chunk-B.js"><link rel="preload" href="chunk-C.js" as="script">'));
  assert.deepEqual(left, ['chunk-A.js', 'chunk-C.js']);
});

test('what Cloudflare would put in the Link header now resolves to the same file from any page address', () => {
  const { html } = absolutizePreloads(shell('<link rel="modulepreload" href="chunk-K5A77OEP.js">'));
  const href = /rel="modulepreload" href="([^"]+)"/.exec(html)[1];
  for (const page of ['https://transcribevid.com/', 'https://transcribevid.com/jobs/abc123', 'https://transcribevid.com/es/jobs/abc123', 'https://transcribevid.com/es/video-a-texto', 'https://transcribevid.com/guides/srt-vs-vtt']) {
    assert.equal(new URL(href, page).href, 'https://transcribevid.com/chunk-K5A77OEP.js', page);
  }
  // and the old, relative address did not
  assert.equal(new URL('chunk-K5A77OEP.js', 'https://transcribevid.com/jobs/abc123').href, 'https://transcribevid.com/jobs/chunk-K5A77OEP.js');
});
