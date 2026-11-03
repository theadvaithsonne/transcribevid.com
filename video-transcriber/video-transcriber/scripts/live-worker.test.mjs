// Tests for workers/live (the live-visitor count): the routes, the origin / Do Not Track / key rules, and the Durable
// Object's counting and clean-up, with a stand-in for the Durable Object's SQLite (only the four statements it uses).
//   node --test scripts/live-worker.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { handle, Presence, ACTIVE_MS, CODE } from '../workers/live/src/core.ts';

const ORIGIN = 'https://transcribevid.com';
const CODE_A = 'aaaaaaaaaaaaaaaaaaaa';
const CODE_B = 'bbbbbbbbbbbbbbbbbbbb';

/** a stand-in for ctx.storage: a Map of code -> time, answering the exact statements Presence runs */
function fakeStorage() {
  const rows = new Map();
  let alarm = null;
  const cursor = (n) => ({ one: () => ({ n }), toArray: () => [{ n }] });
  return {
    rows,
    get alarm() {
      return alarm;
    },
    storage: {
      sql: {
        exec(query, ...b) {
          if (query.startsWith('CREATE TABLE')) return cursor(0);
          if (query.startsWith('INSERT INTO seen')) return rows.set(b[0], b[1]), cursor(0);
          if (query.startsWith('SELECT COUNT(*) AS n FROM seen WHERE t >=')) return cursor([...rows.values()].filter((t) => t >= b[0]).length);
          if (query.startsWith('SELECT COUNT(*) AS n FROM seen')) return cursor(rows.size);
          if (query.startsWith('DELETE FROM seen WHERE t <')) {
            for (const [k, t] of rows) if (t < b[0]) rows.delete(k);
            return cursor(0);
          }
          throw new Error(`unexpected statement: ${query}`);
        },
      },
      getAlarm: async () => alarm,
      setAlarm: async (t) => void (alarm = t),
    },
  };
}

/** the Worker's PRESENCE binding, backed by a real Presence object */
function setup(extra = {}) {
  const fake = fakeStorage();
  const presence = new Presence(fake);
  const env = {
    PRESENCE: { idFromName: () => 'site', get: () => ({ fetch: (url, init) => presence.fetch(new Request(url, init)) }) },
    ALLOWED_ORIGINS: ORIGIN,
    LIVE_KEY: 'secret-key-123',
    ...extra,
  };
  return { env, fake, presence };
}

const ping = (env, code = CODE_A, headers = {}) =>
  handle(new Request(`${ORIGIN}/api/ping?t=${code}`, { method: 'POST', headers: { Origin: ORIGIN, ...headers } }), env);
const live = (env, query) => handle(new Request(`${ORIGIN}/api/live?${query}`), env);

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

test('a page that went quiet is no longer counted, and the alarm deletes it', async () => {
  const { env, fake, presence } = setup();
  await ping(env, CODE_A);
  fake.rows.set(CODE_A, Date.now() - ACTIVE_MS - 1000); // its last ping was too long ago
  await ping(env, CODE_B);
  assert.deepEqual(await (await live(env, 'key=secret-key-123&json=1')).json(), { active: 1 });
  await presence.alarm();
  assert.equal(fake.rows.has(CODE_A), false);
  assert.equal(fake.rows.has(CODE_B), true);
  assert.ok(fake.alarm, 'it runs again while a code is left');
});

test('the alarm stops once nothing is left', async () => {
  const { fake, presence } = setup();
  fake.rows.set(CODE_A, 1); // ancient
  await presence.alarm();
  assert.equal(fake.rows.size, 0);
  assert.equal(fake.alarm, null);
});

test('only the website may ping', async () => {
  const { env, fake } = setup();
  const other = await handle(new Request(`${ORIGIN}/api/ping?t=${CODE_A}`, { method: 'POST', headers: { Origin: 'https://evil.example' } }), env);
  assert.equal(other.status, 403);
  const none = await handle(new Request(`${ORIGIN}/api/ping?t=${CODE_A}`, { method: 'POST' }), env);
  assert.equal(none.status, 403);
  assert.equal(fake.rows.size, 0);
});

test('Do Not Track and Global Privacy Control are respected: nothing is recorded', async () => {
  const { env, fake } = setup();
  assert.equal((await ping(env, CODE_A, { DNT: '1' })).status, 204);
  assert.equal((await ping(env, CODE_B, { 'Sec-GPC': '1' })).status, 204);
  assert.equal(fake.rows.size, 0);
});

test('a bad code is refused and a GET to /api/ping is not a ping', async () => {
  const { env, fake } = setup();
  assert.equal((await ping(env, 'short')).status, 400);
  assert.equal((await ping(env, 'has spaces and symbols!!')).status, 400);
  assert.equal((await handle(new Request(`${ORIGIN}/api/ping?t=${CODE_A}`), env)).status, 405);
  assert.equal(fake.rows.size, 0);
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
});

test('a broken Durable Object makes ping answer 503 and the page 503, never a crash', async () => {
  const { env } = setup();
  env.PRESENCE = { idFromName: () => 'site', get: () => ({ fetch: async () => { throw new Error('down'); } }) };
  assert.equal((await ping(env)).status, 503);
  assert.equal((await live(env, 'key=secret-key-123&json=1')).status, 503);
});
