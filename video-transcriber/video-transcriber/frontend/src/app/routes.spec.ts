import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { BrandTitleStrategy } from './core/title.service';
import { TOOL_PAGES } from './features/tool-pages/tool-pages.list';
import { silentLog } from './testing/fakes';

describe('routes', () => {
  let harness: RouterTestingHarness;
  const page = () => harness.routeNativeElement as HTMLElement;

  beforeEach(async () => {
    document.head.innerHTML = '';
    TestBed.configureTestingModule({
      providers: [
        silentLog,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes, withComponentInputBinding()),
        { provide: TitleStrategy, useExisting: BrandTitleStrategy },
      ],
    });
    harness = await RouterTestingHarness.create();
  });

  describe('an unknown address', () => {
    it.each(['/definitely/not/here', '/jobs', '/aboutus', '/index.html'])('%s shows a proper "Page not found" page', async (url) => {
      await harness.navigateByUrl(url);
      expect(page().querySelector('h1')?.textContent).toBe('Page not found');
      expect(page().textContent).toContain('does not exist or has moved');
      expect(TestBed.inject(Router).url).toBe(url); // not silently redirected to the home page
    });

    it('links back home', async () => {
      await harness.navigateByUrl('/nope');
      const link = page().querySelector('a')!;
      expect(link.getAttribute('href')).toBe('/');
      expect(link.textContent).toContain('Go to the home page');
    });

    it('is titled "Page not found" and kept out of search results', async () => {
      await harness.navigateByUrl('/nope');
      expect(document.title).toBe('Page not found - TranscribeVid');
      expect(document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content).toBe('noindex, nofollow');
    });
  });

  describe('the pages', () => {
    it.each([
      ['/', 'Transcribe a video or audio file'],
      ['/how-it-works', 'How TranscribeVid works'],
      ['/faq', 'Frequently asked questions'],
      ['/privacy', 'Privacy policy'],
      ['/terms', 'Terms of use'],
      ['/logs', 'Logs'],
    ])('%s shows "%s"', async (url, heading) => {
      await harness.navigateByUrl(url);
      expect(page().querySelector('h1')?.textContent).toContain(heading);
    });

    it('the old /about address leads to How it works (and the address bar shows the new one)', async () => {
      await harness.navigateByUrl('/about');
      expect(TestBed.inject(Router).url).toBe('/how-it-works');
      expect(page().querySelector('h1')?.textContent).toBe('How TranscribeVid works');
      expect(document.title).toBe('How it works - TranscribeVid');
    });

    it.each(TOOL_PAGES.map((t) => [t.path, t.title] as const))('the keyword page %s shows its own h1 and is titled "%s"', async (path, title) => {
      await harness.navigateByUrl(path);
      expect(page().tagName.toLowerCase()).toBe('app-tool-page');
      expect(page().querySelectorAll('h1').length).toBe(1);
      expect(page().querySelector('h1')!.textContent!.trim().length).toBeGreaterThan(10);
      expect(document.title).toBe(`${title} - TranscribeVid`);
    });

    it('every keyword page has a different h1 (no duplicate content)', async () => {
      const h1s: string[] = [];
      for (const t of TOOL_PAGES) {
        await harness.navigateByUrl(t.path);
        h1s.push(page().querySelector('h1')!.textContent!.trim());
      }
      expect(new Set(h1s).size).toBe(TOOL_PAGES.length);
    });

    it('/jobs/:id still opens a transcript (and starts loading it)', async () => {
      await harness.navigateByUrl('/jobs/abc123');
      expect(page().tagName.toLowerCase()).toBe('app-job');
      expect(page().textContent).toContain('Loading…');
    });
  });

  describe('the list of routes', () => {
    const paths = () => routes.map((r) => r.path);

    it('has the pages of the app and the catch-all last', () => {
      expect(paths()).toEqual([
        '',
        'jobs/:id',
        'how-it-works',
        'faq',
        'about',
        ...TOOL_PAGES.map((t) => t.path.slice(1)),
        'privacy',
        'terms',
        'logs',
        '**',
      ]);
    });

    it('has no folder pages any more', () => {
      expect(paths().filter((p) => /folder/i.test(p ?? ''))).toEqual([]);
    });

    it('the old /about is a redirect to how-it-works (not a page of its own)', () => {
      const about = routes.find((r) => r.path === 'about')!;
      expect(about.redirectTo).toBe('how-it-works');
      expect(about.pathMatch).toBe('full');
      expect(about.loadComponent).toBeUndefined();
    });

    it('every page that can be found by a search engine has a title and a description of its own', () => {
      const indexable = routes.filter((r) => !r.redirectTo && !(r.data as { noindex?: boolean } | undefined)?.noindex);
      expect(indexable.length).toBe(3 + TOOL_PAGES.length + 2); // home, how it works, faq, the keyword pages, privacy, terms
      for (const r of indexable) {
        expect(typeof r.title, r.path).toBe('string');
        expect((r.data as { description?: string }).description!.length, r.path).toBeGreaterThan(40);
      }
      const descriptions = indexable.map((r) => (r.data as { description: string }).description);
      expect(new Set(descriptions).size).toBe(descriptions.length);
    });

    it('private pages are marked noindex: a transcript, the logs and the 404 page', () => {
      for (const path of ['jobs/:id', 'logs', '**']) {
        expect((routes.find((r) => r.path === path)!.data as { noindex?: boolean }).noindex, path).toBe(true);
      }
    });

    it('every page is loaded lazily (the first download stays small)', () => {
      for (const r of routes.filter((x) => !x.redirectTo)) expect(typeof r.loadComponent, r.path).toBe('function');
    });
  });
});
