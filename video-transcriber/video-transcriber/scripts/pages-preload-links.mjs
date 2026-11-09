/**
 * Makes the preload addresses of a built page start with "/".
 *
 * Angular writes `<link rel="modulepreload" href="chunk-K5A77OEP.js">` and the page has `<base href="/">`, so the browser reads
 * that address as /chunk-K5A77OEP.js on every page. But Cloudflare Pages turns such tags into an HTTP `Link:` header (Early
 * Hints) and copies the address as written, and a relative address in a header is resolved against the address of the PAGE,
 * not against <base>. On /jobs/abc123 the browser then asked for /jobs/chunk-K5A77OEP.js, on /es/jobs/abc123 for
 * /es/jobs/chunk-K5A77OEP.js, and on /es/video-a-texto for /es/chunk-K5A77OEP.js: ten useless requests per visit, answered
 * with the whole page (200) or a 404, and counted as page views. With a leading "/" the header names the right file everywhere.
 */

/** an address that needs no change: it has a scheme (https:, data:), starts with "/" (also "//"), is a fragment, or is empty */
const FINISHED = /^(?:[a-z][a-z0-9+.-]*:|\/|#|$)/i;
const PRELOAD_TAG = /<link\b[^>]*>/gi;
const IS_PRELOAD = /\brel\s*=\s*["']?\s*(?:modulepreload|preload)\b/i;
const HREF = /(\bhref\s*=\s*)(["'])([^"']*)\2/i;

/** The page with every relative `<link rel="modulepreload|preload" href>` made root-relative; `changed` counts the tags edited. */
export function absolutizePreloads(html) {
  let changed = 0;
  const out = html.replace(PRELOAD_TAG, (tag) => {
    if (!IS_PRELOAD.test(tag)) return tag;
    return tag.replace(HREF, (whole, eq, quote, url) => {
      if (FINISHED.test(url)) return whole;
      changed++;
      return `${eq}${quote}/${url.replace(/^\.\//, '')}${quote}`;
    });
  });
  return { html: out, changed };
}

/** The relative preload addresses still in a page (for the build's own check). */
export function relativePreloads(html) {
  const found = [];
  for (const tag of html.match(PRELOAD_TAG) ?? []) {
    if (!IS_PRELOAD.test(tag)) continue;
    const m = HREF.exec(tag);
    if (m && !FINISHED.test(m[3])) found.push(m[3]);
  }
  return found;
}
