#!/usr/bin/env node
/**
 * Keeps the previous versions' script files on the website after a deploy, so a visitor who opened the site BEFORE the deploy
 * does not hit a missing file.
 *
 * Why: every build gives main-*.js, chunk-*.js, worker-*.js, polyfills-*.js and styles-*.css new names, and a deploy replaces
 * the whole site, so the names of the old build stop existing (a missing file answers 404). A page that is already open loads
 * more files later (the first transcription starts its worker, a language or a page is opened for the first time), and those
 * requests carry the OLD names. Uploading the old files next to the new ones costs nothing, because the names are content
 * hashes and cannot clash.
 *
 *   node scripts/pages-keep-previous.mjs <dist> <archive-dir> <label> [--keep N]
 *
 *   1. copies this build's hashed files into <archive-dir>/<label>/ (the label is the commit, e.g. its first 8 characters)
 *   2. copies the hashed files of the newest N other archives (default 2) into <dist>, never replacing a file that is there
 *   3. deletes archives beyond the newest 5
 *
 * Run it after `npm run build:pages` and before `wrangler pages deploy`. The archive folder is local (git-ignored). The first
 * run after this script was introduced has nothing to keep: archive the live build first with `--keep 0` before building.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** the files whose names carry a content hash (see the Cache-Control rules in pages-postbuild.mjs) */
const HASHED = /^(?:main|chunk|polyfills|worker|styles)-[A-Za-z0-9]+\.(?:js|css)$/;
const MAX_ARCHIVES = 5;
/** Cloudflare Pages allows 20,000 files in one deployment */
const FILE_LIMIT = 20_000;
const WARN_AT = 15_000;

/** relative paths (with / separators) of the hashed files in a build folder: the top level, plus everything in media/ */
export function hashedFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isFile() && HASHED.test(e.name)) out.push(e.name);
  }
  const media = path.join(dir, 'media');
  if (fs.existsSync(media)) {
    (function walk(d, rel) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (e.isDirectory()) walk(path.join(d, e.name), `${rel}/${e.name}`);
        else out.push(`${rel}/${e.name}`);
      }
    })(media, 'media');
  }
  return out.sort();
}

function copyInto(fromDir, toDir, files, { overwrite }) {
  let copied = 0;
  for (const rel of files) {
    const to = path.join(toDir, rel);
    if (!overwrite && fs.existsSync(to)) continue;
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(fromDir, rel), to);
    copied++;
  }
  return copied;
}

function countFiles(dir) {
  let n = 0;
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) e.isDirectory() ? walk(path.join(d, e.name)) : n++;
  })(dir);
  return n;
}

/** Returns what it did; throws on a bad label or a missing build folder. */
export function keepPrevious({ dist, archive, label, keep = 2 }) {
  if (!/^[A-Za-z0-9._-]{1,40}$/.test(label)) throw new Error(`bad label "${label}" (letters, digits, . _ - only)`);
  if (!fs.existsSync(path.join(dist, 'index.html'))) throw new Error(`${dist} is not a build folder (no index.html)`);

  // 1. this build's own hashed files, before anything is added to the folder
  const own = hashedFiles(dist);
  if (!own.length) throw new Error(`no hashed files found in ${dist}: is this the right folder?`);
  const mine = path.join(archive, label);
  fs.rmSync(mine, { recursive: true, force: true });
  copyInto(dist, mine, own, { overwrite: true });
  fs.writeFileSync(path.join(mine, '.archived'), new Date().toISOString());

  // 2. the newest other archives go into the build folder
  const others = fs
    .readdirSync(archive, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== label && fs.existsSync(path.join(archive, e.name, '.archived')))
    .map((e) => ({ name: e.name, at: fs.readFileSync(path.join(archive, e.name, '.archived'), 'utf8') }))
    .sort((a, b) => (a.at < b.at ? 1 : -1));
  const kept = [];
  for (const o of others.slice(0, Math.max(0, keep))) {
    const dir = path.join(archive, o.name);
    kept.push({ label: o.name, added: copyInto(dir, dist, hashedFiles(dir), { overwrite: false }) });
  }

  // 3. old archives beyond the newest MAX_ARCHIVES (counting this one)
  const pruned = others.slice(MAX_ARCHIVES - 1).map((o) => o.name);
  for (const name of pruned) fs.rmSync(path.join(archive, name), { recursive: true, force: true });

  const total = countFiles(dist);
  return { own: own.length, kept, pruned, total, overLimit: total > FILE_LIMIT, warn: total > WARN_AT };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const ki = args.indexOf('--keep');
  const keep = ki >= 0 ? Number(args[ki + 1]) : 2;
  // the three positional arguments: everything except "--keep" and the number after it (when it is there)
  const pos = args.filter((a, i) => !a.startsWith('--') && !(ki >= 0 && i === ki + 1));
  const [dist, archive, label] = pos;
  if (!dist || !archive || !label || !Number.isInteger(keep) || keep < 0) {
    console.error('usage: node scripts/pages-keep-previous.mjs <dist> <archive-dir> <label> [--keep N]');
    process.exit(2);
  }
  try {
    const r = keepPrevious({ dist, archive, label, keep });
    console.log(`pages-keep-previous: archived ${r.own} hashed files of this build as "${label}".`);
    for (const k of r.kept) console.log(`pages-keep-previous: added ${k.added} files of the earlier build "${k.label}" (names that this build no longer has).`);
    if (!r.kept.length) console.log('pages-keep-previous: no earlier build kept (none archived yet, or --keep 0).');
    if (r.pruned.length) console.log(`pages-keep-previous: deleted old archives: ${r.pruned.join(', ')}.`);
    console.log(`pages-keep-previous: ${r.total} files in ${dist} now (Cloudflare Pages allows ${FILE_LIMIT}).`);
    if (r.overLimit) {
      console.error('pages-keep-previous: TOO MANY FILES for one deployment: use a smaller --keep.');
      process.exit(1);
    }
    if (r.warn) console.warn('pages-keep-previous: warning: more than 15,000 files; consider a smaller --keep.');
  } catch (err) {
    console.error(`pages-keep-previous: ${err.message}`);
    process.exit(1);
  }
}
