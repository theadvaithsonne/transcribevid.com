import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { BrandTitleStrategy } from '../../core/title.service';
import { silentLog } from '../../testing/fakes';
import { GUIDES, fmtLongDate } from './guides.list';

const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
const ldBlock = (key: string) => {
  const el = document.head.querySelector(`script[data-vt="${key}"]`);
  return el ? JSON.parse(el.textContent!) : null;
};

describe('GuidesIndexPage (/guides)', () => {
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
    await harness.navigateByUrl('/guides');
    harness.detectChanges();
    page = harness.routeNativeElement as HTMLElement;
  });

  it('is titled, described and indexable, with one h1, a breadcrumb and a two-step breadcrumb in the data', () => {
    expect(document.title).toBe('Guides - TranscribeVid');
    expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href).toBe('https://transcribevid.com/guides');
    expect(page.querySelectorAll('h1').length).toBe(1);
    expect(clean(page.querySelector('h1')!.textContent)).toBe('Guides: transcripts and subtitles');
    expect(ldBlock('route:breadcrumb').itemListElement.map((c: { name: string }) => c.name)).toEqual(['Home', 'Guides']);
  });

  it('lists every guide once with its question, description and date, in the order of the list', () => {
    const links = Array.from(page.querySelectorAll('.guides h2 a'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual(GUIDES.map((g) => g.path));
    expect(links.map((a) => clean(a.textContent))).toEqual(GUIDES.map((g) => g.label));
    const items = Array.from(page.querySelectorAll('.guides li')).map((li) => clean(li.textContent));
    GUIDES.forEach((g, i) => {
      expect(items[i]).toContain(g.description);
      expect(items[i]).toContain(`Updated ${fmtLongDate(g.updated)}`);
    });
  });

  it('points on to the tools, and shows no ad', () => {
    expect(page.querySelector('a[href="/tools"]')).not.toBeNull();
    expect(page.querySelector('app-ad-slot')).toBeNull();
  });
});
