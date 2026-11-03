/**
 * TranscribeVid live-visitor Worker (rules): how many people have the website open right now. The number is shown in the page
 * header to every visitor and, with more detail, on the owner's page.
 *
 *   GET  /_live/count              -> {"active": n}   public, the number the header shows (browser-cached for 20 seconds)
 *   POST /_live/ping?t=<code>        -> 204   a page that is open says "I am here" (about once a minute)
 *                                    403 when the Origin is not the website, 429 past the per-IP limit,
 *                                    204 and nothing recorded when the browser sends Do Not Track / Global Privacy Control
 *   GET  /_live/now?key=<secret>    -> an HTML page with the number (refreshes itself); 404 without the right key
 *   GET  /_live/now?key=...&json=1  -> {"active": n}
 *
 * What is kept: the random code a page made up when it opened (never stored in a cookie or the browser's storage), and the
 * time of its last ping, in one small D1 table: a code that has not pinged for 2.5 minutes is not counted,
 * and is deleted by the next ping or read of the owner page, and at once when the page is closed (a "bye" ping). The IP address is used in memory to limit abuse and is never written
 * anywhere. Nothing else is kept: no history, no page, no country. Only the current number is shown.
 *
 * A separate Worker and a separate D1 database from the "videos transcribed" counter (workers/counter) on purpose: its own,
 * more specific routes, so deploying or breaking this one cannot touch the counter.
 */

// The few Workers runtime types this file uses (no @cloudflare/workers-types dependency; wrangler bundles without it).
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  run(): Promise<unknown>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}
interface D1Database {
  prepare(sql: string): D1PreparedStatement;
}
interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  DB: D1Database;
  /** the Workers Rate Limiting binding (wrangler.toml [[ratelimits]]); optional */
  PING_LIMITER?: RateLimit;
  /** comma-separated page origins allowed to ping, e.g. "https://transcribevid.com" */
  ALLOWED_ORIGINS?: string;
  /** the secret in the owner's bookmark (`wrangler secret put LIVE_KEY`); without it /_live/now does not exist */
  LIVE_KEY?: string;
}

/** a page counts as active while its last ping is this young (the page pings every 60 s, so one missed ping is forgiven) */
export const ACTIVE_MS = 150_000;
const DEFAULT_ORIGINS = ['https://transcribevid.com'];
/** the codes the page makes: 16 to 40 URL-safe characters */
export const CODE = /^[A-Za-z0-9_-]{16,40}$/;
/** Fallback limit when the binding is absent: per isolate, so it is a soft limit. */
const FALLBACK_LIMIT = 20;
const FALLBACK_WINDOW_MS = 60_000;
const recent = new Map<string, { count: number; resetAt: number }>();

function allowedOrigins(env: Env): string[] {
  const list = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  return list.length ? list : DEFAULT_ORIGINS;
}

function plain(text: string, status: number, headers: Record<string, string> = {}): Response {
  return new Response(text, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store', ...headers },
  });
}

/** Compares two strings in time that does not depend on where they differ. */
function sameKey(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

/** true = this IP may ping once more now */
async function underLimit(env: Env, ip: string): Promise<boolean> {
  if (env.PING_LIMITER) {
    try {
      return (await env.PING_LIMITER.limit({ key: ip })).success;
    } catch {
      // the binding failed: fall through to the in-memory limit rather than refusing everyone
    }
  }
  const now = Date.now();
  if (recent.size > 10_000) for (const [k, v] of recent) if (v.resetAt <= now) recent.delete(k);
  const entry = recent.get(ip);
  if (!entry || entry.resetAt <= now) {
    recent.set(ip, { count: 1, resetAt: now + FALLBACK_WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= FALLBACK_LIMIT;
}

/** Records (or refreshes) one page's code: one row written. */
export async function touch(env: Env, code: string, now: number): Promise<void> {
  await env.DB.prepare('INSERT INTO seen (code, t) VALUES (?, ?) ON CONFLICT(code) DO UPDATE SET t = excluded.t').bind(code, now).run();
}

/** How many pages pinged within the active window. */
export async function countActive(env: Env, now: number): Promise<number> {
  const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM seen WHERE t >= ?').bind(now - ACTIVE_MS).first<{ n: number }>();
  return Number(row?.n) || 0;
}

/** Deletes one page's code (the page was closed). */
export async function forget(env: Env, code: string): Promise<void> {
  await env.DB.prepare('DELETE FROM seen WHERE code = ?').bind(code).run();
}

/**
 * Deletes the codes that have been quiet for longer than the active window. Runs on every ping and every read of the owner's
 * page (and from the scheduled job in src/index.ts where the account allows cron triggers).
 */
export async function purge(env: Env, now: number): Promise<void> {
  await env.DB.prepare('DELETE FROM seen WHERE t < ?').bind(now - ACTIVE_MS).run();
}

/** The owner's page: the number, big, refreshing itself every 10 seconds. No cookies, no storage, not indexable. */
const PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Live visitors</title>
<style>
:root{color-scheme:light dark;--bg:#fff7ef;--fg:#2b1608;--muted:#7a5c46;--ok:#c2410c}
@media (prefers-color-scheme:dark){:root{--bg:#1c120b;--fg:#ffeede;--muted:#c9a88c;--ok:#fb923c}}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif;text-align:center}
main{padding:24px}h1{font-size:1rem;font-weight:600;color:var(--muted);margin:0 0 8px}
#n{font-size:clamp(5rem,28vw,11rem);font-weight:800;line-height:1;color:var(--ok)}
p{margin:12px 0 0;color:var(--muted);font-size:.9rem}
</style></head><body><main>
<h1>People on TranscribeVid right now</h1>
<div id="n" aria-live="polite">…</div>
<p id="s">Counting pages that checked in during the last 2½ minutes.</p>
</main><script>
var key=new URLSearchParams(location.search).get('key')||'';
function go(){fetch('?json=1&key='+encodeURIComponent(key),{cache:'no-store'}).then(function(r){return r.ok?r.json():Promise.reject()})
.then(function(j){document.getElementById('n').textContent=j.active;document.getElementById('s').textContent='Updated '+new Date().toLocaleTimeString()+'. Counting pages that checked in during the last 2½ minutes.'})
.catch(function(){document.getElementById('s').textContent='Could not read the number. Retrying…'})}
go();setInterval(go,10000);
</script></body></html>`;

export async function handle(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (path === '/_live/ping') {
    if (request.method !== 'POST') return plain('method not allowed', 405, { Allow: 'POST' });
    const origin = request.headers.get('Origin') ?? '';
    if (!allowedOrigins(env).includes(origin)) return plain('forbidden', 403);
    // a browser that asks not to be tracked is not counted (the page does not even send, this is the second check)
    if (request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1') return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
    const code = url.searchParams.get('t') ?? '';
    if (!CODE.test(code)) return plain('bad request', 400);
    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    if (!(await underLimit(env, ip))) return plain('too many requests', 429, { 'Retry-After': '60' });
    try {
      // "bye": the page was closed, so its code is deleted at once; otherwise it is recorded. Either way every code that
      // has gone quiet is deleted too, so a code never outlives the next visit by more than that visit's ping.
      if (url.searchParams.get('bye') === '1') await forget(env, code);
      else await touch(env, code, Date.now());
      await purge(env, Date.now());
    } catch {
      // the database is unavailable or over its free limit: the page ignores any answer
      return plain('unavailable', 503);
    }
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  }

  if (path === '/_live/count') {
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') return plain('method not allowed', 405, { Allow: 'GET, HEAD, OPTIONS' });
    // the website reads it from its own address; another website may not (no CORS for it), but a plain request still works
    const origin = request.headers.get('Origin') ?? '';
    const cors: Record<string, string> = allowedOrigins(env).includes(origin) ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : { Vary: 'Origin' };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS', 'Access-Control-Max-Age': '86400' } });
    try {
      return new Response(JSON.stringify({ active: await countActive(env, Date.now()) }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=20', 'X-Content-Type-Options': 'nosniff', ...cors },
      });
    } catch {
      return plain('unavailable', 503, cors);
    }
  }

  if (path === '/_live/now') {
    if (request.method !== 'GET' && request.method !== 'HEAD') return plain('method not allowed', 405, { Allow: 'GET, HEAD' });
    // no key configured, or the wrong one: the page does not exist
    if (!env.LIVE_KEY || !sameKey(url.searchParams.get('key') ?? '', env.LIVE_KEY)) return plain('not found', 404);
    if (url.searchParams.get('json') !== '1') {
      return new Response(PAGE, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer' } });
    }
    try {
      await purge(env, Date.now());
      return new Response(JSON.stringify({ active: await countActive(env, Date.now()) }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' },
      });
    } catch {
      return plain('unavailable', 503);
    }
  }

  return plain('not found', 404);
}
