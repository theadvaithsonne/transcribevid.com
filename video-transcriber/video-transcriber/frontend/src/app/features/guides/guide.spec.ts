import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { JobsStore } from '../../core/jobs.store';
import { BrandTitleStrategy } from '../../core/title.service';
import { makeBrowserHealth, makePublicHealth, silentLog } from '../../testing/fakes';
import { loadGuideContent } from './content';
import { editionBlocks, guideWordCount } from './guide';
import { GuideContent } from './guide.model';
import { GUIDES, fmtLongDate } from './guides.list';

const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
const ldBlock = (key: string) => {
  const el = document.head.querySelector(`script[data-vt="${key}"]`);
  return el ? JSON.parse(el.textContent!) : null;
};

// every test opens a page through the router and loads its text: do not let the default 5 s decide on a busy machine
vi.setConfig({ testTimeout: 30_000 });

describe('GuidePage (an article)', () => {
  let harness: RouterTestingHarness;
  let page: HTMLElement;

  async function open(path: string, browser = false) {
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
    TestBed.inject(JobsStore).health.set(browser ? makeBrowserHealth() : makePublicHealth());
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(path);
    harness.detectChanges();
    TestBed.tick();
    page = harness.routeNativeElement as HTMLElement;
  }

  const q = (sel: string) => page.querySelector(sel) as HTMLElement | null;
  const qa = (sel: string) => Array.from(page.querySelectorAll(sel)) as HTMLElement[];

  describe.each(GUIDES.map((g) => [g.path, g] as const))('%s', (path, g) => {
    let content: GuideContent;
    beforeAll(async () => {
      content = await loadGuideContent(g.slug);
    });
    beforeEach(() => open(path));

    it('is the guide component, with one h1 that is its own, a date, a reading time and the short answer', () => {
      expect(page.tagName.toLowerCase()).toBe('app-guide');
      expect(qa('h1').length).toBe(1);
      expect(clean(q('h1')!.textContent)).toBe(content.h1);
      const time = q('.meta time')!;
      expect(time.getAttribute('datetime')).toBe(g.updated);
      expect(clean(time.textContent)).toBe(`Updated ${fmtLongDate(g.updated)}`);
      expect(clean(q('.meta')!.textContent)).toContain(`${content.readingMinutes} min read`);
      const by = q('.meta a.by')!;
      expect(clean(by.textContent)).toBe('By Advaith Bibhishan Sonne');
      expect(by.getAttribute('href')).toBe('/about');
      expect(by.getAttribute('rel')).toBe('author');
      expect(clean(q('.lede')!.textContent)).toBe(content.lead);
    });

    it('has a breadcrumb Home / Guides / this guide, and is titled and described by the list', () => {
      const crumbs = q('nav.crumbs')!;
      expect(crumbs.getAttribute('aria-label')).toBe('Breadcrumb');
      expect(qa('nav.crumbs a').map((a) => a.getAttribute('href'))).toEqual(['/', '/guides']);
      expect(clean(crumbs.querySelector('[aria-current="page"]')!.textContent)).toBe(g.label);
      expect(document.title).toBe(`${g.title} - TranscribeVid`);
      expect(document.head.querySelector<HTMLMetaElement>('meta[name="description"]')!.content).toBe(g.description);
      expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href).toBe(`https://transcribevid.com${path}`);
      expect(document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')!.content).toContain('index');
    });

    it('shows every section with its heading, in order, and the one ad slot after the second', () => {
      const shown = qa('article > section[aria-labelledby^="g-title-"] h2').map((h) => clean(h.textContent));
      expect(shown).toEqual(content.blocks.map((b) => b.title));
      expect(qa('app-ad-slot').length).toBe(1);
      const children = Array.from(q('article.doc')!.children).map((el) => el.tagName.toLowerCase());
      expect(children.indexOf('app-ad-slot')).toBe(children.indexOf('section') + 2); // after the second section
    });

    it('shows its questions (closed) and the keep-reading links it lists', () => {
      const qs = qa('details.qa');
      expect(qs.map((d) => clean(d.querySelector('summary')!.textContent))).toEqual(content.faqs.map((f) => f.question));
      expect(qs.every((d) => !(d as HTMLDetailsElement).open)).toBe(true);
      expect(qa('section.links .link-list a').map((a) => a.getAttribute('href'))).toEqual(content.links.map((l) => l.path));
      expect(clean(q('#g-links-title')!.textContent)).toBe('Keep reading');
    });

    it('ends with one quiet way to the tool (not a main button)', () => {
      const end = q('.end a.btn')!;
      expect(end.getAttribute('href')).toBe(content.toolPath);
      expect(clean(end.textContent)).toBe(content.toolCta);
      expect(end.classList.contains('primary')).toBe(false);
    });

    it('puts Article, FAQPage and a three-step breadcrumb in the structured data, as shown', () => {
      const article = ldBlock('page:article');
      expect(article['@type']).toBe('Article');
      expect(article.headline).toBe(content.h1);
      expect(article.description).toBe(g.description);
      expect(article.datePublished).toBe(g.published);
      expect(article.dateModified).toBe(g.updated);
      expect(article.url).toBe(`https://transcribevid.com${path}`);
      expect(article.publisher.name).toBe('TranscribeVid');
      expect(article.author).toMatchObject({ '@type': 'Person', name: 'Advaith Bibhishan Sonne', url: 'https://transcribevid.com/about' });
      expect(article.wordCount).toBe(guideWordCount(content, editionBlocks(content, false)));

      const faq = ldBlock('page:faq');
      expect(faq['@type']).toBe('FAQPage');
      const shown = qa('details.qa').map((d) => [clean(d.querySelector('summary')!.textContent), clean(d.querySelector('p')!.textContent)]);
      expect(faq.mainEntity.map((e: { name: string; acceptedAnswer: { text: string } }) => [e.name, e.acceptedAnswer.text])).toEqual(shown);

      const crumbs = ldBlock('route:breadcrumb').itemListElement;
      expect(crumbs.map((c: { name: string; item: string }) => [c.name, c.item])).toEqual([
        ['Home', 'https://transcribevid.com/'],
        ['Guides', 'https://transcribevid.com/guides'],
        [g.label, `https://transcribevid.com${path}`],
      ]);
      expect(ldBlock('route:app')).toBeNull(); // an article is not a web application
    });
  });

  describe('editionBlocks', () => {
    const c: GuideContent = {
      h1: 'x',
      lead: 'y',
      readingMinutes: 1,
      toolPath: '/video-to-text',
      toolCta: 'Transcribe a video file',
      blocks: [
        { title: 'Both', paragraphs: ['same'] },
        { title: 'Differs', paragraphs: ['server text'], bullets: [{ text: 'server bullet' }], after: ['server after'], browser: { paragraphs: ['browser text'], after: ['browser after'] } },
      ],
      faqs: [],
      links: [],
    };

    it('takes a block browser variant only in the in-browser edition, and only the parts it names', () => {
      expect(editionBlocks(c, false)[1]).toMatchObject({ paragraphs: ['server text'], after: ['server after'], bullets: [{ text: 'server bullet' }] });
      expect(editionBlocks(c, true)[1]).toMatchObject({ paragraphs: ['browser text'], after: ['browser after'], bullets: [{ text: 'server bullet' }] });
      expect(editionBlocks(c, true)[0]).toMatchObject({ title: 'Both', paragraphs: ['same'] });
    });

    it('counts the words a visitor reads (the browser variant, not both)', () => {
      expect(guideWordCount(c, editionBlocks(c, true))).toBeLessThan(guideWordCount(c, editionBlocks(c, false)) + 3);
      expect(guideWordCount(c)).toBeGreaterThan(5);
    });
  });

  describe('the in-browser edition', () => {
    it('shows its own wording on the guide about uploading', async () => {
      const c = await loadGuideContent('transcribe-video-without-uploading');
      await open('/guides/transcribe-video-without-uploading', true);
      const shown = clean(page.textContent);
      for (const b of editionBlocks(c, true)) {
        for (const p of b.paragraphs ?? []) expect(shown).toContain(clean(p));
      }
    });
  });
});
