// Tell Bing (and Yandex, Seznam, Naver: they share IndexNow) about every page in the live sitemap. Run it after a deploy
// that added or changed pages; Google does not use IndexNow (use Search Console there, see deploy/SEO.md).
//
//   node scripts/indexnow.mjs --key <your VT_INDEXNOW_KEY> [--site https://transcribevid.com] [--dry-run]
//
// The app must already serve the key at <site>/<key>.txt (set VT_INDEXNOW_KEY in deploy/.env and restart it).
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]?.startsWith('--') ? 'true' : (all[i + 1] ?? 'true')]] : acc), []),
);
const site = (args.site || 'https://transcribevid.com').replace(/\/+$/, '');
const key = (args.key || process.env.VT_INDEXNOW_KEY || '').trim();
class Stop extends Error {}
const fail = (msg) => {
  throw new Stop(msg);
};

// (no process.exit() while fetch connections are open: Node on Windows can abort in libuv then)
async function main() {
  if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) fail('give the key with --key (8-128 letters, digits or dashes; the same as VT_INDEXNOW_KEY)');

  const keyLocation = `${site}/${key}.txt`;
  const served = await fetch(keyLocation).then((r) => (r.ok ? r.text() : `HTTP ${r.status}`), (e) => String(e));
  if (served.trim() !== key) fail(`${keyLocation} must show the key, but shows: ${served.slice(0, 80)}. Set VT_INDEXNOW_KEY and restart the app.`);

  const sitemap = await fetch(`${site}/sitemap.xml`).then((r) => (r.ok ? r.text() : fail(`sitemap.xml: HTTP ${r.status}`)));
  const urlList = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (!urlList.length) fail('the sitemap lists no pages');
  const host = new URL(site).hostname;
  const foreign = urlList.filter((u) => new URL(u).hostname !== host);
  if (foreign.length) fail(`the sitemap lists pages of another host: ${foreign.join(', ')}`);

  console.log(`${urlList.length} page(s) of ${host}:\n  ${urlList.join('\n  ')}`);
  if (args['dry-run']) return 0;

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  });
  const meaning = { 200: 'accepted', 202: 'accepted (the key is checked later)', 400: 'bad request', 403: 'the key file was not found or does not match',
    422: 'a page does not belong to the host', 429: 'too many requests: try again tomorrow' };
  console.log(`IndexNow answered ${res.status}: ${meaning[res.status] ?? res.statusText}`);
  return res.status === 200 || res.status === 202 ? 0 : 1;
}

process.exitCode = await main().catch((e) => {
  console.error(`indexnow: ${e instanceof Stop ? e.message : e}`);
  return 1;
});
