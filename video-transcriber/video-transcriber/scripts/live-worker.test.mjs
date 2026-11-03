// Tests for workers/live (the live-visitor count): the routes, the origin / Do Not Track / key rules, and the counting and
// clean-up, with a stand-in for D1 that answers the exact statements the Worker runs.
//   node --test scripts/live-worker.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { handle, purge, countActive, ACTIVE_MS, CODE } from '../workers/live/src/core.ts';

const ORIGIN = 'https://transcribevid.com';
const CODE_A = 'aaaaaaaaaaaaaaaaaaaa';
const CODE_B = 'bbbbbbbbbbbbbbbbbbbb';

/** a stand-in for the D1 database: a Map of code -> time */
function fakeDb() {
  const rows = new Map();
  const db = {
    rows,
    prepare(sql) {
      let b = [];
      const st = {
        bind: (...v) => ((b = v), st),
        run: async () => {
          if (sql.startsWith('INSERT INTO seen')) rows.set(b[0], b[1]);
          else if (sql.startsWith('DELETE FROM seen WHERE code =')) rows.delete(b[0]);
          else if (sql.startsWith('DELETE FROM seen WHERE t <')) {
            for (const [k, t] of rows) if (t < b[0]) rows.delete(k);
          } else throw new Error(`unexpected statement: ${sql}`);
        },
        first: async () => {
          if (sql.startsWith('SELECT COUNT(*) AS n FROM seen WHERE t >=')) return { n: [...rows.values()].filter((t) => t >= b[0]).length };
          throw new Error(`unexpected statement: ${sql}`);
        },
      };
      return st;
    },
  };
  return db;
}

function setup(extra = {}) {
  const DB = fakeDb();
  return { env: { DB, ALLOWED_ORIGINS: ORIGIN, LIVE_KEY: 'secret-key-123', ...extra }, rows: DB.rows };
}

const ping = (env, code = CODE_A, headers = {}) =>
  handle(new Request(`${ORIGIN}/_live/ping?t=${code}`, { method: 'POST', headers: { Origin: ORIGIN, ...headers } }), env);
const live = (env, query) => handle(new Request(`${ORIGIN}/_live/now?${query}`), env);

test('a ping from the website is recorded and counted', async () => {
  const { env } = setup();
  assert.equal((await ping(env)).status, 204);
  assert.equal((await ping(env, CODE_B)).status, 204);
  assert.deepEqual(await (await live(env, 'key=secret-key-123&json=1')).json(), { active: 2 });
});

test('the same page pinging again is still one visitor', async () => {
  const { env } = setup();
  await ping(env);
  await ping(env);
  await ping(env);
  assert.deepEqual(await (await live(env, 'key=secret-key-123&json=1')).json(), { active: 1 });
});

test('a page that went quiet is no longer counted, and the next ping deletes it', async () => {
  const { env, rows } = setup();
  await ping(env, CODE_A);
  rows.set(CODE_A, Date.now() - ACTIVE_MS - 1000); // its last ping was too long ago
  assert.equal(await countActive(env, Date.now()), 0, 'not counted even before it is deleted');
  await ping(env, CODE_B);
  assert.equal(rows.has(CODE_A), false, 'deleted by the next ping');
  assert.equal(rows.has(CODE_B), true);
  assert.deepEqual(await (await live(env, 'key=secret-key-123&json=1')).json(), { active: 1 });
});

test('the scheduled job empties the table once everyone has gone', async () => {
  const { env, rows } = setup();
  rows.set(CODE_A, 1);
  rows.set(CODE_B, 2);
  await purge(env, Date.now());
  assert.equal(rows.size, 0);
  assert.equal(await countActive(env, Date.now()), 0);
});

test('a bye deletes that page code at once; a ping also deletes the codes that went quiet', async () => {
  const { env, rows } = setup();
  await ping(env, CODE_A);
  await ping(env, CODE_B);
  const bye = await handle(new Request(`${ORIGIN}/_live/ping?t=${CODE_A}&bye=1`, { method: 'POST', headers: { Origin: ORIGIN } }), env);
  assert.equal(bye.status, 204);
  assert.equal(rows.has(CODE_A), false);
  assert.equal(rows.has(CODE_B), true);
  rows.set(CODE_B, Date.now() - ACTIVE_MS - 1000); // B went quiet and nobody has pinged since
  await ping(env, 'cccccccccccccccccccc');
  assert.equal(rows.has(CODE_B), false, 'the next ping deleted it');
  assert.equal(rows.size, 1);
});

test('reading the owner page also deletes the codes that went quiet', async () => {
  const { env, rows } = setup();
  rows.set(CODE_A, 1);
  assert.deepEqual(await (await live(env, 'key=secret-key-123&json=1')).json(), { active: 0 });
  assert.equal(rows.size, 0);
});

test('a bye from another origin deletes nothing', async () => {
  const { env, rows } = setup();
  await ping(env, CODE_A);
  const foreign = await handle(new Request(`${ORIGIN}/_live/ping?t=${CODE_A}&bye=1`, { method: 'POST', headers: { Origin: 'https://evil.example' } }), env);
  assert.equal(foreign.status, 403);
  assert.equal(rows.has(CODE_A), true);
});

test('only the website may ping', async () => {
  const { env, rows } = setup();
  const other = await handle(new Request(`${ORIGIN}/_live/ping?t=${CODE_A}`, { method: 'POST', headers: { Origin: 'https://evil.example' } }), env);
  assert.equal(other.status, 403);
  const none = await handle(new Request(`${ORIGIN}/_live/ping?t=${CODE_A}`, { method: 'POST' }), env);
  assert.equal(none.status, 403);
  assert.equal(rows.size, 0);
});

test('Do Not Track and Global Privacy Control are respected: nothing is recorded', async () => {
  const { env, rows } = setup();
  assert.equal((await ping(env, CODE_A, { DNT: '1' })).status, 204);
  assert.equal((await ping(env, CODE_B, { 'Sec-GPC': '1' })).status, 204);
  assert.equal(rows.size, 0);
});

test('a bad code is refused and a GET to /_live/ping is not a ping', async () => {
  const { env, rows } = setup();
  assert.equal((await ping(env, 'short')).status, 400);
  assert.equal((await ping(env, 'has spaces and symbols!!')).status, 400);
  assert.equal((await handle(new Request(`${ORIGIN}/_live/ping?t=${CODE_A}`), env)).status, 405);
  assert.equal(rows.size, 0);
  assert.ok(CODE.test('abcDEF0123456789_-xy'));
});

test('the per-IP limit answers 429', async () => {
  let n = 0;
  const { env } = setup({ PING_LIMITER: { limit: async () => ({ success: ++n <= 2 }) } });
  assert.equal((await ping(env)).status, 204);
  assert.equal((await ping(env)).status, 204);
  assert.equal((await ping(env)).status, 429);
});

test('the owner page needs the key: wrong, missing or unset key is a 404', async () => {
  const { env } = setup();
  assert.equal((await live(env, 'key=nope')).status, 404);
  assert.equal((await live(env, '')).status, 404);
  assert.equal((await live(env, 'key=secret-key-123&json=1')).status, 200);
  const unset = setup({ LIVE_KEY: undefined });
  assert.equal((await live(unset.env, 'key=')).status, 404);
  assert.equal((await live(unset.env, 'key=undefined')).status, 404);
});

test('the owner page is HTML, not cached, not indexable; the JSON is too', async () => {
  const { env } = setup();
  const page = await live(env, 'key=secret-key-123');
  assert.match(page.headers.get('content-type'), /text\/html/);
  assert.equal(page.headers.get('cache-control'), 'no-store');
  assert.match(page.headers.get('x-robots-tag'), /noindex/);
  assert.match(await page.text(), /People on TranscribeVid right now/);
  const json = await live(env, 'key=secret-key-123&json=1');
  assert.match(json.headers.get('x-robots-tag'), /noindex/);
});

test('other paths are not handled', async () => {
  const { env } = setup();
  assert.equal((await handle(new Request(`${ORIGIN}/api/other`), env)).status, 404);
  assert.equal((await handle(new Request(`${ORIGIN}/api/stats`), env)).status, 404);
});

test('a broken database makes ping and the page answer 503, never a crash', async () => {
  const { env } = setup();
  env.DB = { prepare: () => { throw new Error('down'); } };
  assert.equal((await ping(env)).status, 503);
  assert.equal((await live(env, 'key=secret-key-123&json=1')).status, 503);
});
