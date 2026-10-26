import { DOCUMENT } from '@angular/common';
import { Injectable, InjectionToken, Injector, computed, inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../environments/environment';
import { AVAILABLE, DICT_LOADERS } from './generated';
import { DEFAULT_LOCALE, LOCALE_CODES, LOCALES, Locale, isLocale } from './locales';
import { PAGE_SLUGS } from './slugs';

export type Dict = Readonly<Record<string, string>>;
export type Params = Readonly<Record<string, string | number>>;

/** What exists: whether this edition has languages at all, which pages exist in which language, and how a dictionary loads. A token so a spec can try another world. */
export interface I18nData {
  enabled: boolean;
  available: Partial<Record<Locale, readonly string[]>>;
  dicts: Partial<Record<Locale, () => Promise<{ default: Dict }>>>;
  /** localised path (without the /<code> prefix) by English path, per language */
  slugs: Readonly<Record<Locale, Readonly<Record<string, string>>>>;
}
export const I18N_DATA = new InjectionToken<I18nData>('I18N_DATA', {
  providedIn: 'root',
  factory: () => ({ enabled: environment.languages === true, available: AVAILABLE, dicts: DICT_LOADERS, slugs: PAGE_SLUGS }),
});

/** One entry of <link rel="alternate" hreflang="..."> */
export interface Alternate {
  hreflang: string;
  href: string;
}

/** The deepest active route of a router state snapshot. */
export const leafOf = (root: ActivatedRouteSnapshot): ActivatedRouteSnapshot => {
  let r = root;
  while (r.firstChild) r = r.firstChild;
  return r;
};

/** The English path of the page a snapshot shows: the route's own `pageKey` (localised routes), else its path ("/video-to-text", "/" for the home page). */
export function pageKeyOf(leaf: ActivatedRouteSnapshot): string {
  const key = leaf.data['pageKey'];
  if (typeof key === 'string') return key;
  const joined = leaf.pathFromRoot
    .map((s) => s.routeConfig?.path)
    .filter((p): p is string => !!p && p !== '**')
    .join('/');
  return joined ? `/${joined}` : '/';
}

/**
 * Languages and addresses (docs/in-browser/I18N.md). English text is the key of every translation: `t('Add another file')`
 * returns the translation when the current language has one and the English text otherwise, so a missing entry can never
 * show an empty label and English needs no dictionary at all.
 *
 * Which language a page is in comes from its route (`data.locale`, set on the /<code> route groups) and is applied just
 * before the page is created (router `ResolveEnd`), after the route's resolver has loaded the dictionary.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private doc = inject(DOCUMENT);
  /** the router is fetched when the service starts, not here: the router builds the title strategy, which needs this service (a cycle otherwise) */
  private injector = inject(Injector);
  private data = inject(I18N_DATA);

  private readonly _locale = signal<Locale>(DEFAULT_LOCALE);
  private readonly _dict = signal<Dict>({});
  private readonly cache = new Map<Locale, Dict>();
  private started = false;

  readonly locale = this._locale.asReadonly();
  readonly info = computed(() => LOCALES[this._locale()]);
  readonly dir = computed(() => this.info().dir);
  /** the English path of the page now shown ("/video-to-text"; "/" for the home page; "/jobs/:id" for a transcript) */
  readonly page = signal('/');
  /** the languages with at least one page: English first, in menu order */
  readonly languages = computed<Locale[]>(() => LOCALE_CODES.filter((l) => l === DEFAULT_LOCALE || this.available(l).length > 0));
  readonly enabled = this.data.enabled;

  /** Starts following the router (called once, from an app initializer, before the first navigation). */
  start() {
    if (this.started) return;
    this.started = true;
    this.injector.get(Router).events.pipe(filter((e): e is ResolveEnd => e instanceof ResolveEnd)).subscribe((e) => {
      const leaf = leafOf(e.state.root);
      const code = leaf.data['locale'];
      const locale = isLocale(code) ? code : DEFAULT_LOCALE;
      this.apply(locale, this.cache.get(locale) ?? {});
      this.page.set(pageKeyOf(leaf));
    });
  }

  /** The translation of `key` with {placeholders} filled in; the English text itself when there is none. */
  t(key: string, params?: Params): string {
    const raw = this._dict()[key] ?? key;
    return params ? raw.replace(/\{(\w+)\}/g, (m, name: string) => (name in params ? String(params[name]) : m)) : raw;
  }

  /** An entry of a language's loaded dictionary (not necessarily the current language), or undefined. */
  tIn(locale: Locale, key: string): string | undefined {
    return this.cache.get(locale)?.[key];
  }

  /** Loads (once) the dictionary of a language; English has none. Never rejects: a language that cannot load is English. */
  async load(locale: Locale): Promise<Dict> {
    if (locale === DEFAULT_LOCALE) return {};
    const hit = this.cache.get(locale);
    if (hit) return hit;
    try {
      const loader = this.data.dicts[locale];
      const dict = loader ? (await loader()).default : {};
      this.cache.set(locale, dict);
      return dict;
    } catch {
      return {};
    }
  }

  /** Makes `locale` the language of the page being created: its dictionary, <html lang> and <html dir>. */
  apply(locale: Locale, dict: Dict) {
    this._dict.set(dict);
    this._locale.set(locale);
    const el = this.doc.documentElement;
    el.setAttribute('lang', locale);
    el.setAttribute('dir', LOCALES[locale].dir);
  }

  /** The English paths that exist in a language ("/" is the home page); none when this edition has no languages. */
  available(locale: Locale): readonly string[] {
    return this.data.enabled ? (this.data.available[locale] ?? []) : [];
  }

  isAvailable(locale: Locale, enPath: string): boolean {
    return locale === DEFAULT_LOCALE || this.available(locale).includes(enPath);
  }

  /**
   * The address of an English path in a language (the current one by default): "/video-to-text" -> "/es/video-a-texto".
   * A page that has no translation keeps its English address, so a link never leads to a missing page. A transcript
   * address ("/jobs/<id>") and any query string or fragment are carried over.
   */
  path(enPath: string, locale: Locale = this._locale()): string {
    const cut = enPath.search(/[?#]/);
    const pathname = cut < 0 ? enPath : enPath.slice(0, cut);
    const rest = cut < 0 ? '' : enPath.slice(cut);
    if (locale === DEFAULT_LOCALE || !this.data.enabled || !this.available(locale).length) return enPath;
    if (pathname.startsWith('/jobs/')) return `/${locale}${pathname}${rest}`;
    if (!this.isAvailable(locale, pathname)) return enPath;
    if (pathname === '/') return `/${locale}${rest}`;
    return `/${locale}/${this.data.slugs[locale][pathname] ?? pathname.slice(1)}${rest}`;
  }

  /** The English path behind a localised path, or null when it is not an address of that language: "/es/video-a-texto" -> "/video-to-text". */
  enPathOf(url: string, locale: Locale): string | null {
    if (locale === DEFAULT_LOCALE) return url;
    const pathname = url.split(/[?#]/)[0].replace(/\/+$/, '');
    if (pathname === `/${locale}`) return '/';
    const rest = pathname.slice(locale.length + 1);
    if (!pathname.startsWith(`/${locale}/`)) return null;
    const slugs = this.data.slugs[locale];
    const hit = this.available(locale).find((p) => p !== '/' && (slugs[p] ?? p.slice(1)) === rest.slice(1));
    return hit ?? null;
  }

  /**
   * hreflang entries for a page: itself and its translations, plus x-default (the English page). `base` is the site's
   * address without a trailing slash. Empty when the page exists in one language only (no alternates to declare).
   */
  alternates(enPath: string, base: string): Alternate[] {
    const langs = this.languages().filter((l) => this.isAvailable(l, enPath));
    if (langs.length < 2) return [];
    const href = (l: Locale) => base + this.path(enPath, l).replace(/^\/$/, '/');
    return [...langs.map((l) => ({ hreflang: l, href: href(l) })), { hreflang: 'x-default', href: href(DEFAULT_LOCALE) }];
  }

  /**
   * Where the language menu sends a visitor who is on the current page: the same page in `target` when it exists there,
   * otherwise that language's home page.
   */
  switchPath(target: Locale, currentUrl: string): string {
    const job = currentUrl.match(/\/jobs\/([^/?#]+)/);
    if (job) return this.path(`/jobs/${job[1]}`, target);
    const same = this.path(this.page(), target);
    if (target === DEFAULT_LOCALE || this.isAvailable(target, this.page())) return same;
    return this.path('/', target);
  }
}
