import { appPages, notFoundRoute } from '../app.routes';
import { loadGuideContent } from '../features/guides/content';
import { GUIDES } from '../features/guides/guides.list';
import { loadToolContent } from '../features/tool-pages/content';
import { TOOL_PAGES } from '../features/tool-pages/tool-pages.list';
import { AVAILABLE, DICT_LOADERS, GUIDE_LOADERS, TOOL_LOADERS } from './generated';
import { Dict } from './i18n.service';
import { LOCALE_CODES, LOCALES, Locale, OTHER_LOCALES } from './locales';
import { localizedPaths, localizedRoutes } from './routes';
import { PAGE_SLUGS } from './slugs';

/** The real data of this build: what is published, in which language. These checks stop a half-finished language from going live. */
const published = OTHER_LOCALES.filter((l) => (AVAILABLE[l] ?? []).length > 0);
const INFO = ['/', '/how-it-works', '/faq', '/about', '/contact', '/privacy', '/terms', '/tools', '/guides'];
const RESERVED = new Set(['faq', 'how-it-works', 'about', 'contact', 'privacy', 'terms', 'tools', 'guides', 'jobs', 'logs']);
const englishPages = ['/', ...TOOL_PAGES.map((t) => t.path), '/tools', '/guides', ...GUIDES.map((g) => g.path), '/how-it-works', '/faq', '/about', '/contact', '/privacy', '/terms'];

describe('the published languages (generated registry)', () => {
  it('every language that has pages has a dictionary, and every dictionary belongs to a language', () => {
    for (const l of published) expect(DICT_LOADERS[l], l).toBeDefined();
    for (const l of Object.keys(DICT_LOADERS) as Locale[]) expect(published, l).toContain(l);
  });

  it('only real English pages are published, once each, and every published language has its home page', () => {
    for (const l of published) {
      const pages = AVAILABLE[l]!;
      expect(new Set(pages).size, l).toBe(pages.length);
      expect(pages, l).toContain('/');
      for (const p of pages) expect(englishPages, `${l} ${p}`).toContain(p);
      // the six language pages (hindi, hinglish, spanish ...) have no translated twin
      for (const p of ['/hindi-audio-to-text', '/hinglish-transcription', '/spanish-audio-to-text', '/portuguese-audio-to-text', '/french-audio-to-text', '/german-audio-to-text']) {
        expect(pages, `${l} ${p}`).not.toContain(p);
      }
    }
  });

  it('a language is complete: the home page, every information page, and the same tools and guides as the other languages', () => {
    if (!published.length) return;
    const reference = new Set(AVAILABLE[published[0]]);
    for (const l of published) {
      for (const p of INFO) expect(AVAILABLE[l], `${l} lacks ${p}`).toContain(p);
      expect(new Set(AVAILABLE[l]), `${l} differs from ${published[0]}`).toEqual(reference);
    }
  });

  it('every translated address is unique inside its language and is not a reserved word', () => {
    for (const l of published) {
      const addresses = AVAILABLE[l]!.map((p) => (p === '/' ? '' : (PAGE_SLUGS[l][p] ?? p.slice(1))));
      expect(new Set(addresses).size, l).toBe(addresses.length);
      // tool pages and guides get their own words in the address; the information pages keep their English one on purpose
      for (const p of AVAILABLE[l]!.filter((x) => !INFO.includes(x) && !x.startsWith('/guides/'))) {
        const a = PAGE_SLUGS[l][p] ?? p.slice(1);
        expect(RESERVED.has(a), `${l}: ${a}`).toBe(false);
      }
    }
  });

  it('each published language has a route group with a route for each published page, a transcript route and a 404', () => {
    const groups = localizedRoutes(appPages, { available: AVAILABLE, notFound: notFoundRoute });
    expect(groups.map((g) => g.path)).toEqual(published);
    for (const g of groups) {
      const l = g.path as Locale;
      const kids = g.children!.map((c) => c.path);
      expect(kids, l).toContain('jobs/:id');
      expect(kids.at(-1), l).toBe('**');
      expect(kids.length, l).toBe(AVAILABLE[l]!.length + 2);
      expect(kids, l).not.toContain('logs');
    }
    const paths = localizedPaths(appPages, { available: AVAILABLE });
    expect(paths.length).toBe(published.reduce((n, l) => n + AVAILABLE[l]!.length, 0));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('a translated route keeps the English route\'s flags and guards (ads, noindex, the ad-free document guard)', () => {
    const groups = localizedRoutes(appPages, { available: AVAILABLE, notFound: notFoundRoute });
    for (const g of groups) {
      for (const c of g.children!) {
        const english = c.data?.['pageKey'] === '/**' ? notFoundRoute : appPages.find((r) => `/${r.path}` === c.data?.['pageKey'] || (r.path === '' && c.data?.['pageKey'] === '/') || r.path === c.path);
        expect(english, `${g.path}/${c.path}`).toBeDefined();
        expect(c.data?.['ads'], `${g.path}/${c.path}`).toEqual(english!.data?.['ads']);
        expect(c.data?.['noindex'], `${g.path}/${c.path}`).toEqual(english!.data?.['noindex']);
        expect(c.canActivate, `${g.path}/${c.path}`).toEqual(english!.canActivate);
        expect(c.loadComponent, `${g.path}/${c.path}`).toBe(english!.loadComponent);
      }
    }
  });

  describe.each(published)('%s', (locale) => {
    let dict: Dict;
    beforeAll(async () => {
      dict = (await DICT_LOADERS[locale]!()).default;
    });

    it('its dictionary loads and carries a title and description for every published page, within search-result limits', () => {
      expect(Object.keys(dict).length).toBeGreaterThan(600);
      for (const p of AVAILABLE[locale]!) {
        const title = dict[`title:${p}`];
        const description = dict[`description:${p}`];
        expect(title, `${locale} title:${p}`).toBeTruthy();
        expect(description, `${locale} description:${p}`).toBeTruthy();
        expect(`${title} - TranscribeVid`.length, `${locale} title:${p}`).toBeLessThanOrEqual(60);
        expect(description.length, `${locale} description:${p}`).toBeGreaterThanOrEqual(50);
        expect(description.length, `${locale} description:${p}`).toBeLessThanOrEqual(160);
      }
    });

    it('its titles and descriptions are not the English ones and not shared between pages', () => {
      const titles = AVAILABLE[locale]!.map((p) => dict[`title:${p}`]);
      const descriptions = AVAILABLE[locale]!.map((p) => dict[`description:${p}`]);
      expect(new Set(titles).size).toBe(titles.length);
      expect(new Set(descriptions).size).toBe(descriptions.length);
    });

    it('every published tool page and guide loads in this language, in this language\'s words (not the English module)', async () => {
      for (const p of AVAILABLE[locale]!.filter((x) => !INFO.includes(x))) {
        const slug = p.replace(/^\/(guides\/)?/, '');
        const guide = p.startsWith('/guides/');
        expect((guide ? GUIDE_LOADERS[locale] : TOOL_LOADERS[locale])?.[slug], `${locale} ${p}`).toBeDefined();
        const content = guide ? await loadGuideContent(slug, locale) : await loadToolContent(slug, locale);
        const english = guide ? await loadGuideContent(slug) : await loadToolContent(slug);
        expect(content.h1, `${locale} ${p}`).not.toBe(english.h1);
        expect(content.lead, `${locale} ${p}`).not.toBe(english.lead);
      }
    });

    it('its name and direction are defined', () => {
      expect(LOCALES[locale].name).toBeTruthy();
      expect(LOCALE_CODES).toContain(locale);
    });
  });
});
