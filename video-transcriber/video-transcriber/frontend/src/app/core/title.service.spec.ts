import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, TitleStrategy, provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { TOOL_PAGES } from '../features/tool-pages/tool-pages.list';
import { makePublicHealth, silentLog } from '../testing/fakes';
import { JobsStore } from './jobs.store';
import { BrandTitleStrategy, DEFAULT_DESCRIPTION, TitleService } from './title.service';

const meta = (sel: string) => document.head.querySelector<HTMLMetaElement>(sel)?.content;
const canonical = () => document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? null;
const jsonLd = () =>
  Object.fromEntries(
    Array.from(document.head.querySelectorAll('script[type="application/ld+json"]')).map((s) => [s.getAttribute('data-vt'), JSON.parse(s.textContent!)]),
  );

describe('TitleService', () => {
  let titles: TitleService;

  beforeEach(() => {
    document.head.innerHTML = '';
    document.title = '';
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting()] });
    titles = TestBed.inject(TitleService);
  });

  afterEach(() => vi.useRealTimers());

  it('appends the brand to the page name', () => {
    titles.set({ title: 'How it works', path: '/how-it-works' });
    expect(document.title).toBe('How it works - TranscribeVid');
    expect(titles.full('Interview')).toBe('Interview - TranscribeVid');
  });

  it('is just the brand without a page name (or for the brand itself)', () => {
    expect(titles.full('')).toBe('TranscribeVid');
    expect(titles.full('TranscribeVid')).toBe('TranscribeVid');
  });

  it('writes the description, Open Graph and Twitter tags', () => {
    titles.set({ title: 'Privacy policy', description: 'What we process.', path: '/privacy' });
    expect(meta('meta[name="description"]')).toBe('What we process.');
    expect(meta('meta[property="og:title"]')).toBe('Privacy policy - TranscribeVid');
    expect(meta('meta[property="og:description"]')).toBe('What we process.');
    expect(meta('meta[property="og:site_name"]')).toBe('TranscribeVid');
    expect(meta('meta[property="og:type"]')).toBe('website');
    expect(meta('meta[property="og:url"]')).toBe('https://transcribevid.com/privacy');
    expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(meta('meta[name="twitter:title"]')).toBe('Privacy policy - TranscribeVid');
    expect(meta('meta[name="twitter:description"]')).toBe('What we process.');
  });

  it('uses the default description when a page has none, and it fits a search result (155 characters or fewer)', () => {
    titles.set({ title: 'Terms of use', path: '/terms' });
    expect(meta('meta[name="description"]')).toBe(DEFAULT_DESCRIPTION);
    expect(DEFAULT_DESCRIPTION.length).toBeLessThanOrEqual(155);
  });

  it('updates the tags in place: one of each, never a pile of duplicates', () => {
    titles.set({ title: 'A', description: 'one', path: '/a' });
    titles.set({ title: 'B', description: 'two', path: '/b' });
    for (const sel of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:url"]', 'meta[name="robots"]', 'meta[property="og:image"]']) {
      expect(document.head.querySelectorAll(sel).length).toBe(1);
    }
    expect(meta('meta[name="description"]')).toBe('two');
  });

  it('shares the default picture as an absolute address, or the page\'s own (with its alt text)', () => {
    titles.set({ title: 'A', path: '/a' });
    expect(meta('meta[property="og:image"]')).toBe('https://transcribevid.com/og-image.png');
    expect(meta('meta[name="twitter:image"]')).toBe('https://transcribevid.com/og-image.png');
    expect(meta('meta[property="og:image:alt"]')).toBeUndefined();
    titles.set({ title: 'B', path: '/b', image: 'share/b.png', imageAlt: 'A picture of B' });
    expect(meta('meta[property="og:image"]')).toBe('https://transcribevid.com/share/b.png');
    expect(meta('meta[property="og:image:alt"]')).toBe('A picture of B');
    expect(meta('meta[name="twitter:image:alt"]')).toBe('A picture of B');
    titles.set({ title: 'C', path: '/c', image: 'https://cdn.example/c.png' });
    expect(meta('meta[property="og:image"]')).toBe('https://cdn.example/c.png');
  });

  it('points the canonical link at the page (a single link, updated in place)', () => {
    titles.set({ title: 'A', path: '/how-it-works' });
    expect(canonical()).toBe('https://transcribevid.com/how-it-works');
    titles.set({ title: 'B', path: '/' });
    expect(canonical()).toBe('https://transcribevid.com/');
    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
  });

  it('has one address per page: no query string, no fragment, no trailing slash (except the home page)', () => {
    titles.set({ title: 'A', path: '/faq/' });
    expect(canonical()).toBe('https://transcribevid.com/faq');
    titles.set({ title: 'A', path: '/faq?utm_source=x#top' });
    expect(canonical()).toBe('https://transcribevid.com/faq');
    expect(meta('meta[property="og:url"]')).toBe('https://transcribevid.com/faq');
    titles.set({ title: 'A', path: 'faq' });
    expect(canonical()).toBe('https://transcribevid.com/faq');
    titles.set({ title: 'A', path: '/?x=1' });
    expect(canonical()).toBe('https://transcribevid.com/');
  });

  it('keeps a private page out of search results and gives it no canonical address', () => {
    titles.set({ title: 'How it works', path: '/how-it-works' });
    expect(meta('meta[name="robots"]')).toBe('index, follow, max-image-preview:large');
    titles.set({ title: 'My interview', noindex: true, path: '/jobs/abc' });
    expect(meta('meta[name="robots"]')).toBe('noindex, nofollow');
    expect(canonical()).toBeNull();
    titles.set({ title: 'How it works', path: '/how-it-works' });
    expect(meta('meta[name="robots"]')).toBe('index, follow, max-image-preview:large');
    expect(canonical()).toBe('https://transcribevid.com/how-it-works');
  });

  it('follows the brand the server reports', () => {
    TestBed.inject(JobsStore).health.set(
      makePublicHealth({ brand: { name: 'Acme Scribe', url: 'https://acme.example/' } }),
    );
    titles.set({ title: 'About', path: '/about' });
    expect(document.title).toBe('About - Acme Scribe');
    expect(canonical()).toBe('https://acme.example/about');
    expect(meta('meta[property="og:site_name"]')).toBe('Acme Scribe');
    expect(meta('meta[property="og:image"]')).toBe('https://acme.example/og-image.png');
  });
});

describe('BrandTitleStrategy with the real routes', () => {
  let router: Router;

  beforeEach(() => {
    document.head.innerHTML = '';
    document.title = '';
    TestBed.configureTestingModule({
      providers: [
        silentLog,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes),
        { provide: TitleStrategy, useExisting: BrandTitleStrategy },
      ],
    });
    router = TestBed.inject(Router);
  });

  it.each([
    ['/', 'Free Video to Text Transcription, No Login - TranscribeVid', 'https://transcribevid.com/'],
    ['/how-it-works', 'How it works - TranscribeVid', 'https://transcribevid.com/how-it-works'],
    ['/faq', 'Frequently asked questions - TranscribeVid', 'https://transcribevid.com/faq'],
    ['/privacy', 'Privacy policy - TranscribeVid', 'https://transcribevid.com/privacy'],
    ['/terms', 'Terms of use - TranscribeVid', 'https://transcribevid.com/terms'],
  ])('%s is titled "%s" and can be indexed', async (url, title, canon) => {
    await router.navigateByUrl(url);
    expect(document.title).toBe(title);
    expect(meta('meta[name="robots"]')).toBe('index, follow, max-image-preview:large');
    expect(canonical()).toBe(canon);
    expect(meta('meta[property="og:url"]')).toBe(canon);
    expect(meta('meta[name="description"]')!.length).toBeGreaterThan(40);
  });

  it('the home page title is the one that says what the site does', async () => {
    await router.navigateByUrl('/');
    expect(document.title).toBe('Free Video to Text Transcription, No Login - TranscribeVid');
    expect(meta('meta[name="description"]')).toBe(DEFAULT_DESCRIPTION);
  });

  it('the old /about address ends up on How it works, with that page\'s title and canonical address', async () => {
    await router.navigateByUrl('/about');
    expect(router.url).toBe('/how-it-works');
    expect(document.title).toBe('How it works - TranscribeVid');
    expect(canonical()).toBe('https://transcribevid.com/how-it-works');
  });

  it.each([
    ['/jobs/abc123', 'Transcript - TranscribeVid'],
    ['/logs', 'Logs - TranscribeVid'],
    ['/no/such/page', 'Page not found - TranscribeVid'],
  ])('%s is titled "%s" and kept out of search results', async (url, title) => {
    await router.navigateByUrl(url);
    expect(document.title).toBe(title);
    expect(meta('meta[name="robots"]')).toBe('noindex, nofollow');
    expect(canonical()).toBeNull();
  });

  it('a query string or fragment does not end up in the canonical address', async () => {
    await router.navigateByUrl('/how-it-works?utm_source=x#faq');
    expect(canonical()).toBe('https://transcribevid.com/how-it-works');
    expect(meta('meta[property="og:url"]')).toBe('https://transcribevid.com/how-it-works');
  });

  describe('a keyword page', () => {
    const t = TOOL_PAGES.find((p) => p.path === '/mp3-to-text')!;

    it('has its own title, description, canonical address and Open Graph / Twitter tags', async () => {
      await router.navigateByUrl(t.path);
      const full = `${t.title} - TranscribeVid`;
      expect(document.title).toBe(full);
      expect(meta('meta[name="description"]')).toBe(t.description);
      expect(meta('meta[property="og:title"]')).toBe(full);
      expect(meta('meta[property="og:description"]')).toBe(t.description);
      expect(meta('meta[property="og:url"]')).toBe('https://transcribevid.com/mp3-to-text');
      expect(meta('meta[property="og:type"]')).toBe('website');
      expect(meta('meta[property="og:image"]')).toBe('https://transcribevid.com/og-image.png');
      expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image');
      expect(meta('meta[name="twitter:title"]')).toBe(full);
      expect(meta('meta[name="twitter:description"]')).toBe(t.description);
      expect(meta('meta[name="robots"]')).toBe('index, follow, max-image-preview:large');
      expect(canonical()).toBe('https://transcribevid.com/mp3-to-text');
    });

    it('leaves nothing of the previous page behind when navigating from one page to another', async () => {
      await router.navigateByUrl('/privacy');
      await router.navigateByUrl(t.path);
      expect(meta('meta[name="description"]')).toBe(t.description);
      expect(canonical()).toBe('https://transcribevid.com/mp3-to-text');
      await router.navigateByUrl('/video-to-text');
      expect(canonical()).toBe('https://transcribevid.com/video-to-text');
      expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
      expect(document.head.querySelectorAll('meta[name="description"]').length).toBe(1);
    });

    it('each of the keyword pages gets its own canonical address and title', async () => {
      const seen = new Set<string>();
      for (const p of TOOL_PAGES) {
        await router.navigateByUrl(p.path);
        expect(canonical()).toBe(`https://transcribevid.com${p.path}`);
        expect(document.title).toBe(`${p.title} - TranscribeVid`);
        seen.add(document.title);
      }
      expect(seen.size).toBe(TOOL_PAGES.length);
    });

    it('adds a breadcrumb and a free web application as structured data (home > page)', async () => {
      await router.navigateByUrl(t.path);
      const ld = jsonLd();
      expect(Object.keys(ld).sort()).toEqual(['route:app', 'route:breadcrumb']);
      expect(ld['route:breadcrumb'].itemListElement.map((i: { name: string; item: string }) => [i.name, i.item])).toEqual([
        ['Home', 'https://transcribevid.com/'],
        [t.label, 'https://transcribevid.com/mp3-to-text'],
      ]);
      expect(ld['route:app']['@type']).toBe('WebApplication');
      expect(ld['route:app'].description).toBe(t.description);
      expect(ld['route:app'].isAccessibleForFree).toBe(true);
    });
  });

  describe('structured data follows the route', () => {
    it('the home page: organisation, website and application', async () => {
      await router.navigateByUrl('/');
      expect(Object.keys(jsonLd()).sort()).toEqual(['route:app', 'route:organization', 'route:website']);
    });

    it('an ordinary inner page: just the breadcrumb', async () => {
      await router.navigateByUrl('/privacy');
      expect(Object.keys(jsonLd())).toEqual(['route:breadcrumb']);
    });

    it('private pages and the 404 page: none at all (and what the page before had is removed)', async () => {
      await router.navigateByUrl('/');
      expect(Object.keys(jsonLd()).length).toBeGreaterThan(0);
      await router.navigateByUrl('/jobs/abc');
      expect(jsonLd()).toEqual({});
      await router.navigateByUrl('/privacy');
      expect(Object.keys(jsonLd())).toEqual(['route:breadcrumb']);
      await router.navigateByUrl('/no/such/page');
      expect(jsonLd()).toEqual({});
      await router.navigateByUrl('/logs');
      expect(jsonLd()).toEqual({});
    });

    it('going from a keyword page to an ordinary page drops the application block', async () => {
      await router.navigateByUrl('/mp3-to-text');
      expect(Object.keys(jsonLd()).sort()).toEqual(['route:app', 'route:breadcrumb']);
      await router.navigateByUrl('/faq');
      expect(Object.keys(jsonLd()).sort()).toEqual(['route:breadcrumb']);
      expect(jsonLd()['route:breadcrumb'].itemListElement[1].item).toBe('https://transcribevid.com/faq');
    });
  });

  describe('what search results show', () => {
    const indexable = routes.filter((r) => typeof r.title === 'string' && r.path !== '**' && !(r.data as { noindex?: boolean })?.noindex);

    it('every public page: a full title of at most 60 characters and a description of 120 to 160, none shared', () => {
      expect(indexable.length).toBe(5 + TOOL_PAGES.length); // home, how it works, faq, privacy, terms + the keyword pages
      const titles = new Set<string>();
      const descriptions = new Set<string>();
      for (const r of indexable) {
        const full = TestBed.inject(TitleService).full(r.title as string);
        const description = (r.data as { description: string }).description;
        expect(full.length, full).toBeLessThanOrEqual(60);
        expect(description.length, description).toBeGreaterThanOrEqual(120);
        expect(description.length, description).toBeLessThanOrEqual(160);
        titles.add(full);
        descriptions.add(description);
      }
      expect(titles.size).toBe(indexable.length);
      expect(descriptions.size).toBe(indexable.length);
    });
  });
});
