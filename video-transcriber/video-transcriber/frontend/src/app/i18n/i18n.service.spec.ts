import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Dict, I18N_DATA, I18nService } from './i18n.service';
import { localizedPaths, localizedRoutes } from './routes';
import { BASE, ES_DICT, NOT_FOUND, Page, fakeData as data, setupI18n as setup } from './testing';

describe('I18nService', () => {
  describe('t (English text is the key)', () => {
    it('returns the English text when there is no dictionary or no entry, and fills placeholders either way', () => {
      const { i18n } = setup();
      expect(i18n.t('Hello')).toBe('Hello');
      expect(i18n.t('File {n} of {total}', { n: 2, total: 5 })).toBe('File 2 of 5');
      expect(i18n.t('{unknown} stays', { n: 1 })).toBe('{unknown} stays');
    });

    it('returns the translation once the language is applied, with placeholders filled', async () => {
      const { i18n } = setup();
      i18n.apply('es', await i18n.load('es'));
      expect(i18n.t('Hello')).toBe('Hola');
      expect(i18n.t('File {n} of {total}', { n: 2, total: 5 })).toBe('Archivo 2 de 5');
      expect(i18n.t('Not translated yet')).toBe('Not translated yet');
      expect(i18n.locale()).toBe('es');
    });
  });

  describe('load', () => {
    it('loads a dictionary once, English has none, and a failing loader is English instead of an error', async () => {
      const loader = vi.fn(async () => ({ default: ES_DICT }));
      const { i18n } = setup(data({ dicts: { es: loader, de: async () => Promise.reject(new Error('offline')) } }));
      expect(await i18n.load('en')).toEqual({});
      expect(await i18n.load('es')).toBe(ES_DICT);
      expect(await i18n.load('es')).toBe(ES_DICT);
      expect(loader).toHaveBeenCalledTimes(1);
      expect(await i18n.load('de')).toEqual({});
      expect(await i18n.load('fr')).toEqual({}); // no loader at all
      expect(i18n.tIn('es', 'Hello')).toBe('Hola');
      expect(i18n.tIn('es', 'nope')).toBeUndefined();
      expect(i18n.tIn('fr', 'Hello')).toBeUndefined();
    });
  });

  describe('apply', () => {
    it('sets <html lang> and <html dir>', async () => {
      const { i18n } = setup();
      i18n.apply('ar', {});
      expect(document.documentElement.getAttribute('lang')).toBe('ar');
      expect(document.documentElement.getAttribute('dir')).toBe('rtl');
      expect(i18n.dir()).toBe('rtl');
      i18n.apply('en', {});
      expect(document.documentElement.getAttribute('lang')).toBe('en');
      expect(document.documentElement.getAttribute('dir')).toBe('ltr');
    });
  });

  describe('available / languages', () => {
    it('knows which pages exist in which language, and lists the languages that have any (English first)', () => {
      const { i18n } = setup();
      expect(i18n.available('es')).toContain('/video-to-text');
      expect(i18n.available('fr')).toEqual([]);
      expect(i18n.languages()).toEqual(['en', 'es', 'de']);
      expect(i18n.isAvailable('en', '/anything')).toBe(true);
      expect(i18n.isAvailable('de', '/video-to-text')).toBe(false);
    });

    it('an edition without languages (self-hosted) has none: English only, every path unchanged', () => {
      const { i18n } = setup(data({ enabled: false }));
      expect(i18n.languages()).toEqual(['en']);
      expect(i18n.path('/video-to-text', 'es')).toBe('/video-to-text');
      expect(i18n.alternates('/faq', 'https://x.test')).toEqual([]);
    });
  });

  describe('path (an English path in a language)', () => {
    it('English is unchanged', () => {
      const { i18n } = setup();
      expect(i18n.path('/video-to-text', 'en')).toBe('/video-to-text');
      expect(i18n.path('/video-to-text')).toBe('/video-to-text'); // the current language is English
    });

    it('maps the home page, a localised slug, an unlocalised slug and a guide', () => {
      const { i18n } = setup();
      expect(i18n.path('/', 'es')).toBe('/es');
      expect(i18n.path('/video-to-text', 'es')).toBe('/es/video-a-texto');
      expect(i18n.path('/faq', 'es')).toBe('/es/faq');
      expect(i18n.path('/guides/srt-vs-vtt', 'es')).toBe('/es/guides/srt-vs-vtt-es');
    });

    it('a page with no translation keeps its English address, never a broken one', () => {
      const { i18n } = setup();
      expect(i18n.path('/hindi-audio-to-text', 'es')).toBe('/hindi-audio-to-text');
      expect(i18n.path('/video-to-text', 'de')).toBe('/video-to-text');
      expect(i18n.path('/', 'fr')).toBe('/'); // French has no pages at all
    });

    it('carries a transcript id, a query string and a fragment over', () => {
      const { i18n } = setup();
      expect(i18n.path('/jobs/abc123', 'es')).toBe('/es/jobs/abc123');
      expect(i18n.path('/faq?x=1#top', 'es')).toBe('/es/faq?x=1#top');
      expect(i18n.path('/jobs/abc123', 'en')).toBe('/jobs/abc123');
    });

    it('uses the current language by default', async () => {
      const { i18n } = setup();
      i18n.apply('es', await i18n.load('es'));
      expect(i18n.path('/video-to-text')).toBe('/es/video-a-texto');
    });
  });

  describe('enPathOf (a localised address back to the English path)', () => {
    it('inverts path()', () => {
      const { i18n } = setup();
      expect(i18n.enPathOf('/es', 'es')).toBe('/');
      expect(i18n.enPathOf('/es/video-a-texto', 'es')).toBe('/video-to-text');
      expect(i18n.enPathOf('/es/faq', 'es')).toBe('/faq');
      expect(i18n.enPathOf('/es/guides/srt-vs-vtt-es', 'es')).toBe('/guides/srt-vs-vtt');
      expect(i18n.enPathOf('/es/video-a-texto/', 'es')).toBe('/video-to-text');
      expect(i18n.enPathOf('/es/nada', 'es')).toBeNull();
      expect(i18n.enPathOf('/video-to-text', 'es')).toBeNull();
      expect(i18n.enPathOf('/faq', 'en')).toBe('/faq');
    });
  });

  describe('alternates (hreflang)', () => {
    it('lists the page in every language that has it, plus x-default = the English page', () => {
      const { i18n } = setup();
      expect(i18n.alternates('/video-to-text', 'https://x.test')).toEqual([
        { hreflang: 'en', href: 'https://x.test/video-to-text' },
        { hreflang: 'es', href: 'https://x.test/es/video-a-texto' },
        { hreflang: 'x-default', href: 'https://x.test/video-to-text' },
      ]);
      expect(i18n.alternates('/', 'https://x.test')).toEqual([
        { hreflang: 'en', href: 'https://x.test/' },
        { hreflang: 'es', href: 'https://x.test/es' },
        { hreflang: 'de', href: 'https://x.test/de' },
        { hreflang: 'x-default', href: 'https://x.test/' },
      ]);
    });

    it('is empty for a page that exists in one language only (nothing to declare)', () => {
      const { i18n } = setup();
      expect(i18n.alternates('/hindi-audio-to-text', 'https://x.test')).toEqual([]);
      expect(i18n.alternates('/logs', 'https://x.test')).toEqual([]);
    });
  });

  describe('router integration', () => {
    it('applies the language of the page being shown, with its dictionary, <html lang> and the page key', async () => {
      const { i18n } = setup();
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/es/video-a-texto');
      expect(i18n.locale()).toBe('es');
      expect(i18n.t('Hello')).toBe('Hola');
      expect(i18n.page()).toBe('/video-to-text');
      expect(document.documentElement.getAttribute('lang')).toBe('es');
      await harness.navigateByUrl('/faq');
      expect(i18n.locale()).toBe('en');
      expect(i18n.t('Hello')).toBe('Hello');
      expect(i18n.page()).toBe('/faq');
      expect(document.documentElement.getAttribute('lang')).toBe('en');
      await harness.navigateByUrl('/');
      expect(i18n.page()).toBe('/');
      await harness.navigateByUrl('/es');
      expect(i18n.locale()).toBe('es');
      expect(i18n.page()).toBe('/');
    });

    it('the translated page has its translated title (the document title), and falls back to the English title', async () => {
      setup();
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/es/video-a-texto');
      expect(document.title).toBe('Convertir video a texto gratis');
      await harness.navigateByUrl('/es/faq'); // no title:/faq in the dictionary
      expect(document.title).toBe('FAQ');
      await harness.navigateByUrl('/es');
      expect(document.title).toBe('Transcribir video y audio a texto');
    });

    it('the translated route carries the translated description and label, the English flags and the page key', async () => {
      setup();
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/es/video-a-texto');
      const snap = TestBed.inject(Router).routerState.snapshot.root.firstChild!.firstChild!;
      expect(snap.data['description']).toContain('Convierte un video en texto');
      expect(snap.data['label']).toBe('Video a texto');
      expect(snap.data['locale']).toBe('es');
      expect(snap.data['pageKey']).toBe('/video-to-text');
      expect(snap.data['ads']).toBe(true);
      expect(snap.data['app']).toBe(true);
      await harness.navigateByUrl('/es/faq');
      const faq = TestBed.inject(Router).routerState.snapshot.root.firstChild!.firstChild!;
      expect(faq.data['description']).toBe('FAQ description'); // the English one: no entry in the dictionary
    });

    it('a transcript page and the 404 page work inside a language; an unknown language or address is the English 404', async () => {
      const { i18n } = setup();
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/es/jobs/abc');
      expect(i18n.locale()).toBe('es');
      expect(i18n.page()).toBe('/jobs/:id');
      await harness.navigateByUrl('/es/nada-de-nada');
      expect(i18n.locale()).toBe('es');
      expect(document.title).toBe('Page not found');
      await harness.navigateByUrl('/fr/video-to-text'); // French has no pages: no route
      expect(i18n.locale()).toBe('en');
    });

    it('switchPath: the same page in another language, that language\'s home page when it is not translated there, and the transcript id', async () => {
      const { i18n } = setup();
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/video-to-text');
      expect(i18n.switchPath('es', '/video-to-text')).toBe('/es/video-a-texto');
      expect(i18n.switchPath('de', '/video-to-text')).toBe('/de'); // not in German: the German home page
      expect(i18n.switchPath('en', '/video-to-text')).toBe('/video-to-text');
      await harness.navigateByUrl('/es/faq');
      expect(i18n.switchPath('en', '/es/faq')).toBe('/faq');
      expect(i18n.switchPath('de', '/es/faq')).toBe('/de/faq');
      expect(i18n.switchPath('es', '/jobs/abc')).toBe('/es/jobs/abc');
      expect(i18n.switchPath('en', '/es/jobs/abc')).toBe('/jobs/abc');
    });
  });
});

describe('localizedRoutes and localizedPaths', () => {
  it('build one group per language that has pages, and nothing for the others', () => {
    const d = data();
    const groups = localizedRoutes(BASE, { available: d.available, slugs: d.slugs, notFound: NOT_FOUND });
    expect(groups.map((g) => g.path)).toEqual(['es', 'de']);
    expect(localizedRoutes(BASE, { available: {}, notFound: NOT_FOUND })).toEqual([]);
  });

  it('a group holds exactly the pages that exist in that language (plus transcripts and a 404), localised, never the log page', () => {
    const d = data();
    const [es, de] = localizedRoutes(BASE, { available: d.available, slugs: d.slugs, notFound: NOT_FOUND });
    expect(es.children!.map((c) => c.path)).toEqual(['', 'video-a-texto', 'faq', 'guides/srt-vs-vtt-es', 'jobs/:id', '**']);
    expect(de.children!.map((c) => c.path)).toEqual(['', 'faq', 'jobs/:id', '**']);
    expect(es.data).toEqual({ locale: 'es' });
    expect(es.resolve).toHaveProperty('i18n');
  });

  it('a translated route keeps the page component and flags, and its English description and label are replaced by resolvers', () => {
    const d = data();
    const [es] = localizedRoutes(BASE, { available: d.available, slugs: d.slugs, notFound: NOT_FOUND });
    const tool = es.children!.find((c) => c.path === 'video-a-texto')!;
    expect(tool.component).toBe(Page);
    expect(tool.data).toEqual({ app: true, ads: true, locale: 'es', pageKey: '/video-to-text' });
    expect(tool.resolve).toHaveProperty('description');
    expect(tool.resolve).toHaveProperty('label');
    expect(typeof tool.title).toBe('function');
    const job = es.children!.find((c) => c.path === 'jobs/:id')!;
    expect((job.data as { noindex?: boolean }).noindex).toBe(true);
  });

  it('localizedPaths lists every prerendered address: the home page of a language is the bare code, transcripts and 404 are left out', () => {
    const d = data();
    expect(localizedPaths(BASE, { available: d.available, slugs: d.slugs })).toEqual([
      'es',
      'es/video-a-texto',
      'es/faq',
      'es/guides/srt-vs-vtt-es',
      'de',
      'de/faq',
    ]);
    expect(localizedPaths(BASE, { available: {} })).toEqual([]);
  });
});
