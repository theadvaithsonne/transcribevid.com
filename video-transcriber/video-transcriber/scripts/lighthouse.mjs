// Lighthouse audit of the PRODUCTION build served by the real backend: one score table for every public page (plus a
// transcript page), on mobile (Lighthouse's default, simulated throttling) and desktop, and the audits that cost points.
//
//   1. build:  cd frontend && node node_modules/@angular/cli/bin/ng.js build --configuration production --output-path <dir>
//   2. serve:  cd backend && VT_PUBLIC=1 VT_STATIC_DIR=<dir>/browser VT_WARMUP=0 VT_MAX_SESSIONS=500 \
//              .venv/Scripts/python -m uvicorn app.main:app --port 4911          (any free port; pass it with --base)
//   3. audit:  node scripts/lighthouse.mjs               (needs Chrome; fetches lighthouse@12 through npx on first use)
//
// Options: --base http://127.0.0.1:4911  --routes /,/faq  --presets mobile,desktop  --runs 3 (the median run counts)
//          --throttling simulate|devtools  --out <folder for the JSON reports>  --chrome <chrome.exe>
//          --lh <path to lighthouse/cli/index.js>  --job <32-hex id> --cookie "tv_sid=..." (a real transcript of that
//          session; without them /jobs/<random id> is audited: the "transcript not found" page, which logs a 404).
// Exit code 1 when a page misses the targets: accessibility, best practices and SEO 100 (SEO not counted for /jobs/,
// which is noindex on purpose), mobile performance 95.
// Note: on localhost the app's JavaScript arrives before the first paint, so the simulated mobile FCP/LCP count it as
// render-blocking (about +1 s). A real deployment (network latency) does not have this; --throttling devtools shows it.
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]?.startsWith('--') ? 'true' : (all[i + 1] ?? 'true')]] : acc), []),
);
const base = (args.base || 'http://127.0.0.1:4911').replace(/\/+$/, '');
const job = args.job || randomBytes(16).toString('hex');
const routes = (args.routes || '/,/how-it-works,/faq,/privacy,/terms,/video-to-text,/audio-to-text,/mp4-to-text,/mp3-to-text,' +
  '/srt-subtitle-generator,/voice-recording-to-text,/jobs/' + job).split(',').map((r) => r.trim()).filter(Boolean);
const presets = (args.presets || 'mobile,desktop').split(',').map((p) => p.trim());
const runs = Math.max(1, Number(args.runs || 1));
const out = resolve(args.out || join(tmpdir(), 'tv-lighthouse'));
mkdirSync(out, { recursive: true });
const CATS = ['performance', 'accessibility', 'best-practices', 'seo'];
const METRICS = new Set(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift',
  'speed-index', 'interactive', 'max-potential-fid']);

function chromePath() {
  return [args.chrome, process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find((p) => p && existsSync(p));
}

/** [command, leading args]: --lh, a local install, else `npx lighthouse@12` (through npm's own script: no shell). */
function lighthouseCommand() {
  if (args.lh) return [process.execPath, [resolve(args.lh)]];
  for (const from of [process.cwd(), dirname(fileURLToPath(import.meta.url))]) {
    try {
      return [process.execPath, [createRequire(join(from, 'x.js')).resolve('lighthouse/cli/index.js')]];
    } catch { /* not installed there */ }
  }
  const npx = [join(dirname(process.execPath), 'node_modules/npm/bin/npx-cli.js'), join(dirname(process.execPath), '../lib/node_modules/npm/bin/npx-cli.js')]
    .find((p) => existsSync(p));
  if (!npx) throw new Error('lighthouse not found: install it (npm i lighthouse@12) or pass --lh <path to lighthouse/cli/index.js>');
  return [process.execPath, [npx, '--yes', 'lighthouse@12']];
}

function audit(url, preset, file) {
  const [cmd, lead] = lighthouseCommand();
  const flags = [url, '--output=json', `--output-path=${file}`, '--quiet', `--only-categories=${CATS.join(',')}`,
    '--chrome-flags=--headless=new --no-first-run --no-default-browser-check --disable-extensions'];
  if (preset === 'desktop') flags.push('--preset=desktop');
  if (args.throttling) flags.push(`--throttling-method=${args.throttling}`);
  if (args.cookie) flags.push(`--extra-headers=${JSON.stringify({ Cookie: args.cookie })}`);
  const chrome = chromePath();
  const r = spawnSync(cmd, [...lead, ...flags], { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8',
    env: chrome ? { ...process.env, CHROME_PATH: chrome } : process.env, timeout: 240_000 });
  if (r.status !== 0 || !existsSync(file)) throw new Error(`lighthouse failed for ${url} (${preset}): ${String(r.stderr || r.error || '').slice(-800)}`);
  return JSON.parse(readFileSync(file, 'utf8'));
}

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const rows = [];
const failing = new Map(); // "category: audit id" -> {title, pages: [{where, score, value}]}
for (const route of routes) {
  const name = route.startsWith('/jobs/') ? '/jobs/<id>' : route;
  for (const preset of presets) {
    const reports = [];
    for (let i = 0; i < runs; i++) {
      const file = join(out, `${route === '/' ? 'home' : route.slice(1).replace(/[^\w-]+/g, '_')}.${preset}.${i}.json`);
      reports.push(audit(base + route, preset, file));
    }
    const perf = reports.map((r) => r.categories.performance.score ?? 0);
    const lhr = reports[perf.indexOf(median(perf))]; // the run with the median performance score stands for the page
    const score = (c) => Math.round((lhr.categories[c]?.score ?? 0) * 100);
    const num = (id) => lhr.audits[id]?.numericValue;
    rows.push({ route: name, preset, perf: score('performance'), a11y: score('accessibility'), bp: score('best-practices'),
      seo: score('seo'), lcp: num('largest-contentful-paint'), cls: num('cumulative-layout-shift'), tbt: num('total-blocking-time'),
      fcp: num('first-contentful-paint') });
    for (const cat of CATS) {
      for (const ref of lhr.categories[cat].auditRefs) {
        const a = lhr.audits[ref.id];
        if (!a || a.score === null || a.score >= 1 || METRICS.has(ref.id)) continue;
        if (['notApplicable', 'manual', 'informative'].includes(a.scoreDisplayMode)) continue;
        if (cat === 'performance' && a.score >= 0.9) continue;
        // diagnostics that estimate no saving at all (e.g. the network dependency tree) are information, not a cost
        if (cat === 'performance' && !ref.weight && !Object.values(a.metricSavings ?? {}).some((v) => v > 0)) continue;
        const key = `${cat}: ${ref.id}`;
        const f = failing.get(key) ?? { title: a.title, pages: [] };
        f.pages.push({ where: `${name} ${preset}`, score: a.score, value: a.displayValue || '' });
        failing.set(key, f);
      }
    }
    process.stderr.write(`  ${name} ${preset}: ${CATS.map(score).join(' / ')}\n`);
  }
}

const ms = (v) => (v == null ? '-' : v >= 1000 ? (v / 1000).toFixed(1) + ' s' : Math.round(v) + ' ms');
console.log(`\nLighthouse ${base} (${args.throttling || 'simulate'} throttling, ${runs} run(s) per page)\n`);
console.log('| Page | Device | Perf | A11y | Best pr. | SEO | FCP | LCP | TBT | CLS |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
for (const r of rows) {
  console.log(`| ${r.route} | ${r.preset} | ${r.perf} | ${r.a11y} | ${r.bp} | ${r.seo} | ${ms(r.fcp)} | ${ms(r.lcp)} | ${ms(r.tbt)} | ${r.cls == null ? '-' : r.cls.toFixed(3)} |`);
}
console.log(failing.size ? '\nAudits that cost points (worst page first):' : '\nNo audit costs points.');
for (const [key, f] of [...failing].sort((a, b) => b[1].pages.length - a[1].pages.length)) {
  const pages = f.pages.sort((a, b) => a.score - b.score);
  const shown = pages.slice(0, 3).map((p) => p.where + (p.value ? ` (${p.value})` : '')).join('; ');
  console.log(`- ${key}: ${f.title} - ${pages.length} page run(s): ${shown}${pages.length > 3 ? '; ...' : ''}`);
}
console.log(`\nJSON reports: ${out}`);

const below = rows.filter((r) => r.a11y < 100 || r.bp < 100 || (r.seo < 100 && r.route !== '/jobs/<id>') || (r.preset === 'mobile' && r.perf < 95));
if (below.length) console.log(`Below target: ${below.map((r) => `${r.route} ${r.preset}`).join(', ')}`);
process.exitCode = below.length ? 1 : 0;
