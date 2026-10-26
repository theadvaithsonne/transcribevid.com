import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { BrandTitleStrategy } from '../../core/title.service';
import { silentLog } from '../../testing/fakes';
import { GUIDES } from '../guides/guides.list';
import { TOOL_GROUPS, TOOL_PAGES } from './tool-pages.list';

const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

describe('AllToolsPage (/tools)', () => {
  let page: HTMLElement;

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
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/tools');
    harness.detectChanges();
    page = harness.routeNativeElement as HTMLElement;
  });

  it('is titled, described and indexable, with one h1 and a breadcrumb', () => {
    expect(document.title).toBe('All free tools - TranscribeVid');
    expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href).toBe('https://transcribevid.com/tools');
    expect(document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')!.content).toContain('index');
    expect(page.querySelectorAll('h1').length).toBe(1);
    expect(clean(page.querySelector('h1')!.textContent)).toBe('All free video and audio to text tools');
    expect(Array.from(page.querySelectorAll('nav.crumbs a')).map((a) => a.getAttribute('href'))).toEqual(['/']);
  });

  it('links to every tool page, once, each under its group, with its description', () => {
    const hrefs = Array.from(page.querySelectorAll('.tools a')).map((a) => a.getAttribute('href'));
    const tools = hrefs.filter((h) => !h!.startsWith('/guides'));
    expect(tools).toEqual(TOOL_GROUPS.flatMap((g) => TOOL_PAGES.filter((t) => t.group === g.id).map((t) => t.path)));
    expect(new Set(tools).size).toBe(TOOL_PAGES.length);
    const items = Array.from(page.querySelectorAll('.tools li')).map((li) => clean(li.textContent));
    for (const t of TOOL_PAGES) expect(items.some((x) => x.includes(t.label) && x.includes(t.description)), t.path).toBe(true);
  });

  it('every group on the page has pages in it, and every page is in a group that is shown', () => {
    const headings = Array.from(page.querySelectorAll('section h2')).map((h) => clean(h.textContent));
    for (const g of TOOL_GROUPS) {
      expect(headings).toContain(g.title);
      expect(TOOL_PAGES.some((t) => t.group === g.id), g.id).toBe(true);
    }
    expect(TOOL_PAGES.every((t) => TOOL_GROUPS.some((g) => g.id === t.group))).toBe(true);
  });

  it('also lists the guides', () => {
    const hrefs = Array.from(page.querySelectorAll('.tools a')).map((a) => a.getAttribute('href'));
    for (const g of GUIDES) expect(hrefs).toContain(g.path);
  });

  it('shows no ad (a page of links has too little text of its own)', () => {
    expect(page.querySelector('app-ad-slot')).toBeNull();
  });
});
