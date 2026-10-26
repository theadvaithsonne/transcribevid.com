/**
 * TranscribeVid counter Worker: how many transcriptions visitors' browsers have reported as finished.
 *
 *   GET  /stats  (or /api/stats)  -> 200 {"transcribed": n, "counting": true}, Cache-Control: public, max-age=300
 *   POST /count  (or /api/count)  -> 200 {"transcribed": n + 1, "counting": true}
 *                                    403 when the Origin is not the website, 429 past the per-IP limit
 *   OPTIONS                       -> 204 CORS preflight for the website's origin
 *
 * Only the total is stored (one D1 row, one atomic `UPDATE ... RETURNING`). The IP address is used in memory to limit
 * abuse and is never written anywhere. The number is a vanity metric: any client can forge an Origin header, so it is
 * never presented as verified (docs/in-browser/spike/hosting.md section 1.3).
 */

// The few Workers runtime types this file uses (no @cloudflare/workers-types dependency; wrangler bundles without it).
interface D1PreparedStatement {
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
  COUNT_LIMITER?: RateLimit;
  /** comma-separated page origins allowed to count, e.g. "https://transcribevid.com" */
  ALLOWED_ORIGINS?: string;
}

const DEFAULT_ORIGINS = ['https://transcribevid.com'];
/** Fallback limit when the binding is absent: per isolate, so it is a soft limit (an isolate serves many requests). */
const FALLBACK_LIMIT = 10;
const FALLBACK_WINDOW_MS = 60_000;
const recent = new Map<string, { count: number; resetAt: number }>();

function allowedOrigins(env: Env): string[] {
  const list = (env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  return list.length ? list : DEFAULT_ORIGINS;
}

function json(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff', ...headers },
  });
}

function plain(text: string, status: number, headers: Record<string, string>): Response {
  return new Response(text, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store', ...headers },
  });
}

/** true = this IP may count once more now */
async function underLimit(env: Env, ip: string): Promise<boolean> {
  if (env.COUNT_LIMITER) {
    try {
      return (await env.COUNT_LIMITER.limit({ key: ip })).success;
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    // the same Worker answers on its workers.dev address (/stats) and on the site's domain route (/api/stats)
    const path = url.pathname.replace(/^\/api(?=\/)/, '').replace(/\/+$/, '') || '/';
    const origin = request.headers.get('Origin') ?? '';
    const trusted = allowedOrigins(env).includes(origin);
    const cors: Record<string, string> = trusted ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : { Vary: 'Origin' };

    if (path !== '/stats' && path !== '/count') return plain('not found', 404, cors);

    if (request.method === 'OPTIONS') {
      if (!trusted) return plain('forbidden', 403, cors);
      return new Response(null, {
        status: 204,
        headers: {
          ...cors,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      if (path === '/stats') {
        if (request.method !== 'GET' && request.method !== 'HEAD') return plain('method not allowed', 405, { ...cors, Allow: 'GET, HEAD, OPTIONS' });
        const row = await env.DB.prepare('SELECT n FROM counter WHERE id = 1').first<{ n: number }>();
        return json({ transcribed: row?.n ?? 0, counting: true }, 200, { ...cors, 'Cache-Control': 'public, max-age=300' });
      }

      // POST /count
      if (request.method !== 'POST') return plain('method not allowed', 405, { ...cors, Allow: 'POST, OPTIONS' });
      if (!trusted) return plain('forbidden', 403, cors);
      const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
      if (!(await underLimit(env, ip))) return plain('too many requests', 429, { ...cors, 'Retry-After': '60' });
      const row = await env.DB.prepare('UPDATE counter SET n = n + 1 WHERE id = 1 RETURNING n').first<{ n: number }>();
      if (!row) return plain('counter not initialised (run schema.sql)', 503, cors);
      return json({ transcribed: row.n, counting: true }, 200, { ...cors, 'Cache-Control': 'no-store' });
    } catch {
      // D1 unavailable or over its daily limit: the website hides the number on any error
      return plain('unavailable', 503, cors);
    }
  },
};
