// Tests for frontend/public/.well-known/security.txt (RFC 9116): the fields a security researcher needs, a contact that is the
// operator's real address, and an Expires date that is neither past nor more than a year away.
//   node --test scripts/security-txt.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const FILE = fileURLToPath(new URL('../frontend/public/.well-known/security.txt', import.meta.url));
const OPERATOR = fileURLToPath(new URL('../frontend/src/app/core/operator.ts', import.meta.url));
const DAY = 86_400_000;

const text = fs.readFileSync(FILE, 'utf8');
const fields = Object.fromEntries(
  text
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 1).trim()]),
);

test('has the two required fields, Contact and Expires, once each', () => {
  assert.equal((text.match(/^Contact:/gm) ?? []).length, 1);
  assert.equal((text.match(/^Expires:/gm) ?? []).length, 1);
});

test('the contact is the operator\'s own e-mail address (the one in operator.ts)', () => {
  const email = /email:\s*'([^']+)'/.exec(fs.readFileSync(OPERATOR, 'utf8'))?.[1];
  assert.ok(email, 'found the operator address');
  assert.equal(fields.Contact, `mailto:${email}`);
});

test('Expires is an ISO 8601 UTC date in the future and less than a year away (renew it before it expires)', () => {
  assert.match(fields.Expires, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
  const left = Date.parse(fields.Expires) - Date.now();
  assert.ok(left > 0, `security.txt expired on ${fields.Expires}: renew it (deploy/DEPLOY-CHECKLIST.md)`);
  assert.ok(left <= 366 * DAY, 'RFC 9116 asks for an expiry less than a year ahead');
  if (left < 45 * DAY) console.warn(`security.txt expires in ${Math.floor(left / DAY)} days (${fields.Expires}): renew it`);
});

test('the canonical address is the one it is served from, on the real domain, over https', () => {
  assert.equal(fields.Canonical, 'https://transcribevid.com/.well-known/security.txt');
});

test('plain text with no HTML and no secrets', () => {
  assert.ok(!/<[a-z]/i.test(text));
  assert.ok(!/key|password|token|secret/i.test(text.replace(/^#.*$/gm, '')));
  assert.ok(text.length < 2000);
});
