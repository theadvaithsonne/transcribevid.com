/**
 * Reads, for the build scripts (sitemap, Pages rules, audit), what the app's i18n code knows: the languages, which English
 * paths exist in each, and the localised address of each. The app itself is TypeScript, so this parses its small, regular
 * files (src/app/i18n/generated.ts and src/app/i18n/slugs/<code>.ts) instead of importing them. The same rules as
 * I18nService.path() (src/app/i18n/i18n.service.ts); a spec of the app and a test here keep the two in step.
 */
import fs from 'node:fs';
import path from 'node:path';

export const LOCALES = ['es', 'pt', 'fr', 'de', 'it', 'id', 'ja', 'ko', 'th', 'vi', 'tr', 'hi', 'bn', 'ar', 'ur'];
export const RTL = new Set(['ar', 'ur']);

/** { es: ['/', '/video-to-text', ...], ... } from generated.ts (only languages that have pages). */
export function readAvailable(appDir) {
  const text = fs.readFileSync(path.join(appDir, 'i18n', 'generated.ts'), 'utf8');
  const block = text.match(/export const AVAILABLE[^=]*=\s*\{([\s\S]*?)\n\};/);
  const out = {};
  if (!block) return out;
  for (const m of block[1].matchAll(/^\s*([a-z]{2}):\s*\[([^\]]*)\]/gm)) {
    out[m[1]] = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);
  }
  return out;
}

/** { '/video-to-text': 'video-a-texto', ... } from slugs/<code>.ts */
export function readSlugs(appDir, locale) {
  const file = path.join(appDir, 'i18n', 'slugs', `${locale}.ts`);
  if (!fs.existsSync(file)) return {};
  const text = fs.readFileSync(file, 'utf8');
  const block = text.match(/export const SLUGS[^=]*=\s*\{([\s\S]*?)\};/);
  const out = {};
  for (const m of (block ? block[1] : '').matchAll(/'([^']+)':\s*'([^']+)'/g)) out[m[1]] = m[2];
  return out;
}

/** The address of an English path in a language ("/video-to-text" -> "/es/video-a-texto"); the home page is "/es". */
export function localizedPath(locale, enPath, slugs) {
  if (enPath === '/') return `/${locale}`;
  return `/${locale}/${slugs[enPath] ?? enPath.slice(1)}`;
}

/** Everything the scripts need: languages with pages, each language's paths and slugs. */
export function readI18n(frontendDir) {
  const appDir = path.join(frontendDir, 'src', 'app');
  const available = readAvailable(appDir);
  const slugs = Object.fromEntries(Object.keys(available).map((l) => [l, readSlugs(appDir, l)]));
  const languages = Object.keys(available);
  return { appDir, available, slugs, languages, path: (locale, enPath) => localizedPath(locale, enPath, slugs[locale] ?? {}) };
}
