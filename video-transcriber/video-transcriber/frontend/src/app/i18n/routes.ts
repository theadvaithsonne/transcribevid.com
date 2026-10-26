import { inject } from '@angular/core';
import { ResolveFn, Route } from '@angular/router';
import { I18nService } from './i18n.service';
import { Locale, OTHER_LOCALES } from './locales';
import { PAGE_SLUGS } from './slugs';

/** Loads the dictionary of the route's language into the service's cache, before the page is created (applied on ResolveEnd). */
export const localeResolver: ResolveFn<Locale> = async (route) => {
  const locale = route.data['locale'] as Locale;
  await inject(I18nService).load(locale);
  return locale;
};

/** The English path of a route ("" is the home page, "jobs/:id" stays as it is, the catch-all is "/**"). */
const enPathOf = (r: Route) => (r.path === '' ? '/' : `/${r.path}`);

/** Pages that are never offered in another language: the catch-all is built per language, the operator log viewer is English only. */
const NEVER = new Set(['**', 'logs']);

const isJob = (r: Route) => !!r.path?.startsWith('jobs/');

/** What a translated route group may need to know (parameters so a spec can use other data). */
export interface LocalizeOptions {
  /** the English paths that exist in each language */
  available: Partial<Record<Locale, readonly string[]>>;
  slugs?: Readonly<Record<Locale, Readonly<Record<string, string>>>>;
  /** the 404 page: one route for every language */
  notFound: Route;
}

/**
 * A dictionary entry of the route's language, or the English text when there is none. Called while a route resolves, when
 * the page on screen still has its own language: so it reads the language's loaded dictionary (the parent's resolver has
 * just loaded it), not the current one.
 */
const translated = (locale: Locale, key: string, english: string) => inject(I18nService).tIn(locale, key) ?? english;

/**
 * The route of a page in a language: the same page component, the same flags (ads, noindex), a localised address, and a
 * title, description and label that come from the language's dictionary (`title:<en path>`, `description:<en path>`,
 * `label:<en path>`) with the English text as the fallback.
 */
export function localizeRoute(base: Route, locale: Locale, slug: string): Route {
  const key = enPathOf(base);
  const { description, label, ...data } = (base.data ?? {}) as Record<string, unknown>;
  const resolve = { ...(base.resolve ?? {}) } as NonNullable<Route['resolve']>;
  if (typeof description === 'string') resolve['description'] = () => translated(locale, `description:${key}`, description);
  if (typeof label === 'string') resolve['label'] = () => translated(locale, `label:${key}`, label);
  const out: Route = { ...base, path: slug, data: { ...data, locale, pageKey: key }, resolve };
  if (typeof base.title === 'string') {
    const english = base.title;
    out.title = () => translated(locale, `title:${key}`, english);
  }
  return out;
}

/** The address segment of a page in a language: the home page is the group itself, a transcript keeps its pattern. */
function slugOf(r: Route, locale: Locale, slugs: NonNullable<LocalizeOptions['slugs']>): string {
  if (isJob(r)) return r.path!;
  const key = enPathOf(r);
  return key === '/' ? '' : (slugs[locale][key] ?? key.slice(1));
}

/**
 * One route group per language that has pages: `/es` (children: the pages that exist in Spanish, and `**` = the 404 page in
 * Spanish). The group carries the language (`data.locale`) and the resolver that loads its dictionary; its children inherit
 * both (a component-less parent). A page without a translation gets no route in that language: it is never English text
 * under a translated address.
 */
export function localizedRoutes(base: readonly Route[], opts: LocalizeOptions): Route[] {
  const slugs = opts.slugs ?? PAGE_SLUGS;
  const groups: Route[] = [];
  for (const locale of OTHER_LOCALES) {
    const pages = opts.available[locale] ?? [];
    if (!pages.length) continue;
    const children: Route[] = [];
    for (const r of base) {
      if (r.path === undefined || NEVER.has(r.path) || r.redirectTo) continue;
      if (isJob(r) || pages.includes(enPathOf(r))) children.push(localizeRoute(r, locale, slugOf(r, locale, slugs)));
    }
    children.push(localizeRoute(opts.notFound, locale, '**'));
    groups.push({ path: locale, data: { locale }, resolve: { i18n: localeResolver }, children });
  }
  return groups;
}

/** Every address the build prerenders for the translated pages (client-only pages are not listed); [] when there are none. */
export function localizedPaths(base: readonly Route[], opts: Pick<LocalizeOptions, 'available' | 'slugs'>): string[] {
  const slugs = opts.slugs ?? PAGE_SLUGS;
  const out: string[] = [];
  for (const locale of OTHER_LOCALES) {
    const pages = opts.available[locale] ?? [];
    for (const r of base) {
      if (r.path === undefined || NEVER.has(r.path) || r.redirectTo || isJob(r)) continue;
      if (!pages.includes(enPathOf(r))) continue;
      const slug = slugOf(r, locale, slugs);
      out.push(slug ? `${locale}/${slug}` : locale);
    }
  }
  return out;
}
