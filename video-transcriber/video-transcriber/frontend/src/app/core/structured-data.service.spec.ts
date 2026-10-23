import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, inject, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { makePublicHealth, silentLog } from '../testing/fakes';
import { JobsStore } from './jobs.store';
import { FaqItem, HowToInput, RouteSchemaInput, StructuredDataService } from './structured-data.service';

const BASE = 'https://transcribevid.com';

const blocks = () => Array.from(document.head.querySelectorAll('script[type="application/ld+json"]')) as HTMLScriptElement[];
const keys = () => blocks().map((s) => s.getAttribute('data-vt')!).sort();
const block = (key: string) => {
  const el = document.head.querySelector(`script[data-vt="${key}"]`);
  return el ? JSON.parse(el.textContent!) : null;
};

function route(over: Partial<RouteSchemaInput> = {}): RouteSchemaInput {
  return { path: '/faq', name: 'Frequently asked questions', description: 'Answers.', indexable: true, ...over };
}

/** What the test page's constructor runs: the way the real pages register their FAQ / steps. */
let registerPage: (svc: StructuredDataService) => void = () => {};

/** A page component that registers its FAQ and / or steps in its constructor, like the real pages do. */
@Component({ template: '' })
class TestPage {
  constructor() {
    registerPage(inject(StructuredDataService));
  }
}

/** Opens a page that runs `setup` in its constructor. */
function openPage(setup: (svc: StructuredDataService) => void) {
  registerPage = setup;
  const fixture = TestBed.createComponent(TestPage);
  fixture.detectChanges();
  TestBed.tick();
  return fixture;
}

describe('StructuredDataService', () => {
  let svc: StructuredDataService;

  beforeEach(() => {
    document.head.innerHTML = '';
    TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting()] });
    svc = TestBed.inject(StructuredDataService);
  });

  describe('forRoute (called by the title strategy after every navigation)', () => {
    it('the home page: organisation, website and a free web application', () => {
      svc.forRoute(route({ path: '/', name: '', description: 'Free video to text.' }));
      expect(keys()).toEqual(['route:app', 'route:organization', 'route:website']);
      expect(block('route:organization')).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${BASE}/#organization`,
        name: 'TranscribeVid',
        url: `${BASE}/`,
        logo: `${BASE}/icon-512.png`,
      });
      // the site name Google shows: name + alternateName on the home page's WebSite
      expect(block('route:website')).toMatchObject({
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        name: 'TranscribeVid',
        alternateName: 'transcribevid.com',
        url: `${BASE}/`,
        inLanguage: 'en',
        publisher: { '@id': `${BASE}/#organization` },
      });
      const app = block('route:app');
      expect(app).toMatchObject({
        '@type': 'WebApplication',
        '@id': `${BASE}/#app`,
        name: 'TranscribeVid',
        url: `${BASE}/`,
        description: 'Free video to text.',
        applicationCategory: 'MultimediaApplication',
        isAccessibleForFree: true,
        image: `${BASE}/og-image.png`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      });
      expect(app.featureList.length).toBeGreaterThanOrEqual(4);
    });

    it('claims nothing it cannot back up: no ratings, no reviews', () => {
      svc.forRoute(route({ path: '/', name: '' }));
      svc.forRoute(route({ path: '/mp3-to-text', app: true }));
      const all = blocks().map((s) => s.textContent).join(' ');
      expect(all).not.toMatch(/aggregateRating|ratingValue|reviewCount|"review"/);
    });

    it('an inner page: a breadcrumb Home > page (and nothing else)', () => {
      svc.forRoute(route({ path: '/faq', name: 'Frequently asked questions', crumb: 'FAQ' }));
      expect(keys()).toEqual(['route:breadcrumb']);
      expect(block('route:breadcrumb')).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
          { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${BASE}/faq` },
        ],
      });
    });

    it('the breadcrumb uses the page name when there is no short name', () => {
      svc.forRoute(route({ path: '/privacy', name: 'Privacy policy' }));
      expect(block('route:breadcrumb').itemListElement[1].name).toBe('Privacy policy');
    });

    it('a tool page also gets a web application block of its own (named after the page, at its own address)', () => {
      svc.forRoute(route({ path: '/mp3-to-text', name: 'MP3 to Text Converter', crumb: 'MP3 to text', description: 'Transcribe an MP3.', app: true }));
      expect(keys()).toEqual(['route:app', 'route:breadcrumb']);
      expect(block('route:app')).toMatchObject({
        '@type': 'WebApplication',
        '@id': `${BASE}/mp3-to-text#app`,
        name: 'TranscribeVid: MP3 to text',
        url: `${BASE}/mp3-to-text`,
        description: 'Transcribe an MP3.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        applicationCategory: 'MultimediaApplication',
        // the Organization block is only on the home page, so the publisher names itself here
        publisher: { '@type': 'Organization', '@id': `${BASE}/#organization`, name: 'TranscribeVid', url: `${BASE}/` },
      });
    });

    it('every URL in the data is absolute and on the site', () => {
      svc.forRoute(route({ path: '/', name: '' }));
      svc.forRoute(route({ path: '/video-to-text', name: 'Video to text', app: true }));
      const urls = blocks()
        .map((s) => s.textContent!)
        .join(' ')
        .match(/"(?:url|item|logo|image|@id)":"[^"]*"/g)!;
      expect(urls.length).toBeGreaterThan(4);
      for (const u of urls) expect(u.split('":"')[1], u).toMatch(/^https:\/\/transcribevid\.com\//);
    });

    it('a private page or the 404 page gets nothing at all', () => {
      svc.forRoute(route({ path: '/jobs/abc', indexable: false }));
      expect(keys()).toEqual([]);
    });

    it('uses the brand the server reports, and adds a contact point only when there is an address', () => {
      TestBed.inject(JobsStore).health.set(makePublicHealth({ brand: { name: 'Acme Scribe', url: 'https://acme.example/', contact_email: 'hi@acme.example' } }));
      svc.forRoute(route({ path: '/', name: '' }));
      expect(block('route:organization')).toMatchObject({
        name: 'Acme Scribe',
        url: 'https://acme.example/',
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: 'hi@acme.example' },
      });
      expect(block('route:website').url).toBe('https://acme.example/');
      expect(block('route:organization')['@id']).toBe('https://acme.example/#organization');
      TestBed.inject(JobsStore).health.set(makePublicHealth());
      svc.forRoute(route({ path: '/', name: '' }));
      expect(block('route:organization').contactPoint).toBeUndefined();
    });

    it('injects one <script type="application/ld+json"> per block into the head, with valid JSON', () => {
      svc.forRoute(route({ path: '/', name: '' }));
      for (const s of blocks()) {
        expect(s.parentElement).toBe(document.head);
        expect(s.getAttribute('data-vt')).toMatch(/^route:/);
        expect(() => JSON.parse(s.textContent!)).not.toThrow();
      }
      expect(blocks().length).toBe(3);
    });

    it('replaces the blocks of the previous route instead of piling up', () => {
      svc.forRoute(route({ path: '/faq', name: 'FAQ' }));
      svc.forRoute(route({ path: '/privacy', name: 'Privacy policy' }));
      expect(keys()).toEqual(['route:breadcrumb']);
      expect(block('route:breadcrumb').itemListElement[1].item).toBe(`${BASE}/privacy`);
      svc.forRoute(route({ path: '/privacy', name: 'Privacy policy' }));
      expect(blocks().length).toBe(1);
    });

    it('removes the blocks the next route does not have (home -> inner page -> private page)', () => {
      svc.forRoute(route({ path: '/', name: '' }));
      expect(keys()).toEqual(['route:app', 'route:organization', 'route:website']);
      svc.forRoute(route({ path: '/faq', name: 'FAQ' }));
      expect(keys()).toEqual(['route:breadcrumb']);
      svc.forRoute(route({ path: '/jobs/x', indexable: false }));
      expect(keys()).toEqual([]);
    });

    it('a tool page followed by an ordinary page does not keep the application block', () => {
      svc.forRoute(route({ path: '/mp3-to-text', app: true }));
      svc.forRoute(route({ path: '/faq' }));
      expect(keys()).toEqual(['route:breadcrumb']);
    });

    it('escapes "<" so that text can never close the script tag', () => {
      svc.forRoute(route({ path: '/x', name: 'A </script><b>', crumb: 'A </script><b>' }));
      const raw = document.head.querySelector('script[data-vt="route:breadcrumb"]')!.textContent!;
      expect(raw).not.toContain('<');
      expect(raw).toContain('\\u003c/script>');
      expect(JSON.parse(raw).itemListElement[1].name).toBe('A </script><b>'); // and it still reads back correctly
    });

    it('collapses the whitespace of names and descriptions', () => {
      svc.forRoute(route({ path: '/mp3-to-text', name: '  MP3\n to   text ', description: ' a \n b ', app: true }));
      expect(block('route:breadcrumb').itemListElement[1].name).toBe('MP3 to text');
      expect(block('route:app').description).toBe('a b');
    });

    it('a block that is already in the HTML (prerendered) is reused, not duplicated', () => {
      document.head.innerHTML = '<script type="application/ld+json" data-vt="route:breadcrumb">{"old":true}</script>';
      const prerendered = document.head.querySelector('script')!;
      svc.forRoute(route({ path: '/faq', name: 'FAQ' }));
      expect(blocks().length).toBe(1);
      expect(blocks()[0]).toBe(prerendered);
      expect(JSON.parse(prerendered.textContent!)['@type']).toBe('BreadcrumbList');
    });

    it('does not touch scripts that are not its own', () => {
      document.head.innerHTML = '<script type="application/ld+json" data-vt="other">{"x":1}</script><script>var a = 1;</script>';
      svc.forRoute(route({ path: '/faq' }));
      svc.forRoute(route({ path: '/jobs/x', indexable: false }));
      expect(document.head.querySelector('script[data-vt="other"]')).not.toBeNull();
      expect(document.head.querySelectorAll('script').length).toBe(2);
    });
  });

  describe('faqPage (called by a page for the questions it shows)', () => {
    const items: FaqItem[] = [
      { question: 'Is it free?', answer: 'Yes.' },
      { question: '  How  accurate? ', answer: 'Quite\n accurate.' },
    ];

    const open = openPage;

    it('writes a FAQPage with the questions and answers exactly as given (whitespace tidied)', () => {
      open((s) => s.faqPage(items));
      expect(keys()).toEqual(['page:faq']);
      expect(block('page:faq')).toEqual({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Is it free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes.' } },
          { '@type': 'Question', name: 'How accurate?', acceptedAnswer: { '@type': 'Answer', text: 'Quite accurate.' } },
        ],
      });
    });

    it('leaves out a question or an answer that is empty, and writes nothing when none is left', () => {
      open((s) => s.faqPage([{ question: 'Q?', answer: '' }, { question: '   ', answer: 'A' }, { question: 'Real?', answer: 'Real.' }]));
      expect(block('page:faq').mainEntity.map((e: { name: string }) => e.name)).toEqual(['Real?']);
      TestBed.resetTestingModule();
      document.head.innerHTML = '';
      TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting()] });
      open((s) => s.faqPage([{ question: 'Q?', answer: ' ' }]));
      expect(keys()).toEqual([]);
    });

    it('follows a signal when the text can change (for example when the limits arrive from the server)', () => {
      const list = signal<FaqItem[]>([{ question: 'Limits?', answer: 'Up to 1 GB.' }]);
      const fixture = open((s) => s.faqPage(list));
      expect(block('page:faq').mainEntity[0].acceptedAnswer.text).toBe('Up to 1 GB.');
      list.set([{ question: 'Limits?', answer: 'Up to 2 GB.' }]);
      fixture.detectChanges();
      TestBed.tick();
      expect(block('page:faq').mainEntity[0].acceptedAnswer.text).toBe('Up to 2 GB.');
      expect(blocks().length).toBe(1);
      list.set([]);
      TestBed.tick();
      expect(keys()).toEqual([]); // no questions: no block
    });

    it('is taken away when the page is destroyed (no stale block)', () => {
      const fixture = open((s) => s.faqPage(items));
      expect(keys()).toEqual(['page:faq']);
      fixture.destroy();
      expect(keys()).toEqual([]);
    });

    it('a page that replaced another one keeps its own block when the old page is destroyed afterwards', () => {
      const first = open((s) => s.faqPage([{ question: 'First?', answer: 'One.' }]));
      const second = open((s) => s.faqPage([{ question: 'Second?', answer: 'Two.' }]));
      expect(block('page:faq').mainEntity[0].name).toBe('Second?');
      first.destroy(); // the old page goes away after the new one has already written
      expect(block('page:faq').mainEntity[0].name).toBe('Second?');
      second.destroy();
      expect(keys()).toEqual([]);
    });

    it('a late write of the page that was replaced does not overwrite the new page', () => {
      const old = signal<FaqItem[]>([{ question: 'Old?', answer: 'Old.' }]);
      const first = open((s) => s.faqPage(old));
      open((s) => s.faqPage([{ question: 'New?', answer: 'New.' }]));
      old.set([{ question: 'Old again?', answer: 'Old again.' }]);
      first.detectChanges();
      TestBed.tick();
      expect(block('page:faq').mainEntity[0].name).toBe('New?');
    });

    it('is separate from the route blocks: a navigation does not remove it, and it does not remove theirs', () => {
      svc.forRoute(route({ path: '/faq', name: 'FAQ' }));
      open((s) => s.faqPage(items));
      expect(keys()).toEqual(['page:faq', 'route:breadcrumb']);
      svc.forRoute(route({ path: '/faq', name: 'FAQ' }));
      expect(keys()).toEqual(['page:faq', 'route:breadcrumb']);
    });
  });

  describe('howTo (called by a page for the steps it shows)', () => {
    const how: HowToInput = {
      name: 'How to convert an MP3 to text',
      description: 'Upload the MP3, wait, download.',
      steps: [
        { name: 'Pick', text: 'Choose the file.' },
        { name: ' Wait ', text: 'Text   appears.' },
      ],
    };

    const open = openPage;

    it('writes a HowTo with numbered steps', () => {
      open((s) => s.howTo(how));
      expect(block('page:howto')).toEqual({
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to convert an MP3 to text',
        description: 'Upload the MP3, wait, download.',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Pick', text: 'Choose the file.' },
          { '@type': 'HowToStep', position: 2, name: 'Wait', text: 'Text appears.' },
        ],
      });
    });

    it('has no description key when there is none, and numbers only the steps that are kept', () => {
      open((s) => s.howTo({ name: 'X', steps: [{ name: '', text: 'dropped' }, { name: 'Kept', text: 'yes' }] }));
      const data = block('page:howto');
      expect('description' in data).toBe(false);
      expect(data.step).toEqual([{ '@type': 'HowToStep', position: 1, name: 'Kept', text: 'yes' }]);
    });

    it('writes nothing when there are no steps', () => {
      open((s) => s.howTo({ name: 'X', steps: [] }));
      expect(keys()).toEqual([]);
    });

    it('follows a signal and is taken away with its page', () => {
      const sig = signal(how);
      const fixture = open((s) => s.howTo(sig));
      expect(block('page:howto').step.length).toBe(2);
      sig.set({ ...how, steps: how.steps.slice(0, 1) });
      TestBed.tick();
      expect(block('page:howto').step.length).toBe(1);
      fixture.destroy();
      expect(keys()).toEqual([]);
    });

    it('works next to a FAQ block of the same page, and both go away together', () => {
      const fixture = open((s) => {
        s.faqPage([{ question: 'Q?', answer: 'A.' }]);
        s.howTo(how);
      });
      expect(keys()).toEqual(['page:faq', 'page:howto']);
      fixture.destroy();
      expect(keys()).toEqual([]);
    });
  });
});
