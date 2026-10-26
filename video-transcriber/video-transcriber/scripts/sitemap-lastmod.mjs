/**
 * Adds an accurate <lastmod> to every address of the built sitemap (called by scripts/pages-postbuild.mjs).
 *
 * Google only trusts <lastmod> when it is always right, so the date is never a build time or "now": it is the date of the
 * last real change to the text of THAT page.
 *   - a guide: the "updated" date printed on the page and in its Article data (guides.list.ts), the one source of truth
 *   - every other page: the date of the last git commit that touched the files that hold its text; "today" when those files
 *     have changes that are not committed yet (they differ from what was last committed, so they changed); nothing at all
 *     when git cannot say (no repository, a shallow copy, a file git has never seen): a missing date is honest, a guess is not
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { LOCALES, readI18n } from './i18n-data.mjs';

/**
 * The files that hold the text of a translated page (/es/video-a-texto): its content module, or for the home page and the
 * information pages the language's dictionary. `i18n` is readI18n(); null when the address is not a page of that language.
 */
export function translatedSourcesFor(pathname, i18n) {
  const m = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (!m || !LOCALES.includes(m[1]) || !i18n.available[m[1]]) return null;
  const [, locale, rest = ''] = m;
  const enPath = i18n.available[locale].find((p) => i18n.path(locale, p) === (rest ? `/${locale}${rest}` : `/${locale}`));
  if (!enPath) return null;
  const dict = path.join('i18n', 'dict', `${locale}.ts`);
  const guide = enPath.match(/^\/guides\/([a-z0-9-]+)$/);
  if (guide) return [path.join('features', 'guides', 'content', 'i18n', locale, `${guide[1]}.ts`)];
  const tool = enPath.match(/^\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  const info = ['/tools', '/guides', '/how-it-works', '/faq', '/about', '/contact', '/privacy', '/terms'];
  if (tool && !info.includes(enPath)) return [path.join('features', 'tool-pages', 'content', 'i18n', locale, `${tool[1]}.ts`)];
  return [dict];
}

/** The files (relative to frontend/src/app) that hold the text of a public page, or null when the address is unknown. */
export function sourcesFor(pathname) {
  const feat = (...p) => path.join('features', ...p);
  if (pathname === '/') return [feat('upload', 'upload.html'), feat('upload', 'upload.ts')];
  if (pathname === '/tools') return [feat('tool-pages', 'all-tools.ts'), feat('tool-pages', 'tool-pages.list.ts')];
  if (pathname === '/guides') return [feat('guides', 'guides-index.ts'), feat('guides', 'guides.list.ts')];
  const fixed = {
    '/how-it-works': [feat('how-it-works', 'how-it-works.html'), feat('how-it-works', 'how-it-works.ts')],
    '/faq': [feat('faq', 'faq.html'), feat('faq', 'faq.ts')],
    '/about': [feat('about', 'about.html'), feat('about', 'about.ts'), path.join('core', 'operator.ts')],
    '/contact': [feat('contact', 'contact.html'), feat('contact', 'contact.ts'), path.join('core', 'operator.ts')],
    '/privacy': [feat('legal', 'privacy.html'), feat('legal', 'privacy.ts'), feat('legal', 'legal-info.ts')],
    '/terms': [feat('legal', 'terms.html'), feat('legal', 'terms.ts'), feat('legal', 'legal-info.ts')],
  };
  if (fixed[pathname]) return fixed[pathname];
  const tool = pathname.match(/^\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
  return tool ? [feat('tool-pages', 'content', `${tool[1]}.ts`)] : null;
}

/** The "updated" date of a guide, read from the text of guides.list.ts; null when the guide is not in it. */
export function guideUpdated(guidesListText, slug) {
  const i = guidesListText.indexOf(`slug: '${slug}'`);
  if (i < 0) return null;
  const m = guidesListText.slice(i).match(/updated:\s*'(\d{4}-\d{2}-\d{2})'/);
  return m ? m[1] : null;
}

/** git's answer for `files` (absolute paths) as YYYY-MM-DD, or null when it cannot say. `today` (the local date) is used for uncommitted changes. */
export function gitDate(files, cwd, today = new Date().toLocaleDateString('en-CA')) {
  const run = (args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  try {
    const existing = files.filter((f) => fs.existsSync(f));
    if (!existing.length) return null;
    if (run(['status', '--porcelain', '--', ...existing])) return today;
    const date = run(['log', '-1', '--format=%cs', '--', ...existing]);
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
  } catch {
    return null;
  }
}

/**
 * Returns the sitemap with a <lastmod> after each <loc> that has a date. `frontendDir` is the frontend/ folder;
 * `dateOf(absoluteFiles)` answers the git question (a parameter so a test can answer without git).
 */
export function addLastmod(xml, { frontendDir, dateOf = (files) => gitDate(files, frontendDir) }) {
  const app = path.join(frontendDir, 'src', 'app');
  const guidesList = fs.readFileSync(path.join(app, 'features', 'guides', 'guides.list.ts'), 'utf8');
  const i18n = readI18n(frontendDir);
  // an entry may carry <xhtml:link> alternates after <loc>: keep them, and put <lastmod> right after <loc>
  return xml.replace(/<url>\s*<loc>\s*([^<\s]+)\s*<\/loc>([\s\S]*?)<\/url>/g, (whole, loc, rest) => {
    if (/<lastmod>/.test(rest)) return whole;
    const pathname = new URL(loc).pathname.replace(/\/+$/, '') || '/';
    const translated = translatedSourcesFor(pathname, i18n);
    const guide = translated ? null : pathname.match(/^\/guides\/([a-z0-9-]+)$/);
    const sources = translated ?? (guide ? null : sourcesFor(pathname));
    const date = guide ? guideUpdated(guidesList, guide[1]) : sources ? dateOf(sources.map((s) => path.join(app, s))) : null;
    return date ? `<url>\n    <loc>${loc}</loc>\n    <lastmod>${date}</lastmod>${rest.replace(/^\s*\n/, '\n')}</url>` : whole;
  });
}
