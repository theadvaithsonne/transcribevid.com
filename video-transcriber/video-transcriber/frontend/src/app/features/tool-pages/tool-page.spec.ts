import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { JobsStore } from '../../core/jobs.store';
import { fmtBytesShort } from '../../core/format';
import { Health } from '../../core/models';
import { PUBLIC_DEFAULTS } from '../../core/site.service';
import { BrandTitleStrategy } from '../../core/title.service';
import { makeBrowserHealth, makeHealth, makePublicHealth, silentLog } from '../../testing/fakes';
import { TOOL_CONTENT } from './content';
import { DEFAULT_LIMITS, ToolPage, editionText } from './tool-page';
import { TOOL_PAGES, toolRoutePath } from './tool-pages.list';

const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
const ldBlock = (key: string) => {
  const el = document.head.querySelector(`script[data-vt="${key}"]`);
  return el ? JSON.parse(el.textContent!) : null;
};

// every test opens a page through the router and loads its text: do not let the default 5 s decide on a busy machine
vi.setConfig({ testTimeout: 30_000 });

describe('ToolPage (a keyword landing page)', () => {
  let harness: RouterTestingHarness;
  let page: HTMLElement;
  let store: JobsStore;

  /** Opens a keyword page the way the router does (with the real routes). */
  async function open(path: string, health: Health | null = makePublicHealth()) {
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
    store = TestBed.inject(JobsStore);
    store.health.set(health);
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(path);
    harness.detectChanges();
    TestBed.tick();
    page = harness.routeNativeElement as HTMLElement;
  }

  const q = (sel: string) => page.querySelector(sel) as HTMLElement | null;
  const qa = (sel: string) => Array.from(page.querySelectorAll(sel)) as HTMLElement[];

  describe.each(TOOL_PAGES.map((t) => [t.path, t] as const))('%s', (path, t) => {
    const content = TOOL_CONTENT[toolRoutePath(t)];

    beforeEach(() => open(path));

    it('is the tool page component, with one h1 that is the page\'s own', () => {
      expect(page.tagName.toLowerCase()).toBe('app-tool-page');
      expect(qa('h1').length).toBe(1);
      expect(clean(q('h1')!.textContent)).toBe(content.h1);
      expect(q('.eyebrow')).toBeNull(); // the breadcrumb already names the page
      expect(clean(q('.page-lead')!.textContent)).toBe(content.lead);
    });

    it('has a breadcrumb from the home page to this page, named like the footer link', () => {
      const crumbs = q('nav.crumbs')!;
      expect(crumbs.getAttribute('aria-label')).toBe('Breadcrumb');
      expect(crumbs.querySelector('a')!.getAttribute('href')).toBe('/');
      expect(clean(crumbs.querySelector('[aria-current="page"]')!.textContent)).toBe(t.label);
    });

    it('shows the three promises once, and the drop box as the one main action', () => {
      expect(qa('app-free-chips').length).toBe(1);
      expect(qa('.hero app-free-chips .chips li').map((li) => clean(li.textContent))).toEqual(['Free', 'Unlimited', 'No login']);
      expect(q('.hero app-free-chips .line')).toBeNull(); // the keyword pages show the chips only
      expect(clean(q('app-tool-drop .title')!.textContent)).toBe(`Drop your ${content.dropNoun} here, or choose a file`);
      // the only main (primary) button on the page is the drop box's "Choose a file"
      expect(qa('.btn.primary').map((b) => clean(b.textContent))).toEqual(['Choose a file']);
      expect(q('.btn.primary')!.closest('app-tool-drop')).not.toBeNull();
      expect(q('.hero-cta')).toBeNull();
      expect(q('dl.facts')).toBeNull(); // no facts box repeating the chips
    });

    it(content.record ? 'offers recording with the microphone under the drop box' : 'has no recording link (not what this page is about)', () => {
      const rec = q('.hero-drop .alt a');
      if (content.record) {
        expect(rec!.getAttribute('href')).toBe('/');
        expect(clean(rec!.textContent)).toBe('Record with your microphone');
        // the first step tells the visitor where that link is
        expect(content.steps[0].text).toContain('Record with your microphone under the box');
      } else {
        expect(rec).toBeNull();
      }
    });

    it('the drop box takes the kind of file this page is about', () => {
      const accept = q('app-tool-drop input[type="file"]')!.getAttribute('accept')!;
      expect(accept.includes('video/*')).toBe(content.dropKind === 'video');
      expect(accept).toContain('audio/*');
    });

    it('shows why, the four steps (numbered 1 to 4), the formats and tips', () => {
      expect(clean(q('#why-title')!.textContent)).toBe(content.whyTitle);
      expect(qa('.why-text p').map((p) => clean(p.textContent))).toEqual(content.why);
      expect(clean(q('#how-title')!.textContent)).toBe(content.howTitle);
      const steps = qa('ol.steps > li');
      expect(steps.map((s) => clean(s.querySelector('.num')!.textContent))).toEqual(['1', '2', '3', '4']);
      expect(steps.map((s) => clean(s.querySelector('h3')!.textContent))).toEqual(content.steps.map((s) => s.title));
      expect(steps.map((s) => clean(s.querySelector('p')!.textContent))).toEqual(content.steps.map((s) => s.text));
      expect(clean(q('#formats-title')!.textContent)).toBe(content.formatsTitle);
      expect(qa('.formats .types li').map((c) => clean(c.textContent))).toEqual(content.accepts);
      expect(qa('.formats .downloads li b').map((b) => clean(b.textContent))).toEqual(content.downloads.map((d) => d.name));
      expect(qa('.tips li b').map((b) => clean(b.textContent))).toEqual(content.tips.map((x) => x.title));
    });

    it('shows its own questions, closed, with the announced limits written in', () => {
      const qs = qa('details.qa');
      expect(qs.length).toBe(content.faqs.length);
      expect(qs.map((d) => clean(d.querySelector('summary')!.textContent))).toEqual(content.faqs.map((f) => f.question));
      expect(qs.every((d) => !(d as HTMLDetailsElement).open)).toBe(true);
      expect(clean(q('#faq-title')!.textContent)).toBe(`${t.label}: common questions`);
      expect(clean(page.textContent)).not.toContain('{limits}'); // every placeholder was filled in
    });

    it('lists the other tools, not this one', () => {
      const hrefs = qa('app-related-tools a').map((a) => a.getAttribute('href'));
      expect(hrefs).toEqual(TOOL_PAGES.map((x) => x.path).filter((p) => p !== path));
      expect(hrefs.length).toBe(TOOL_PAGES.length - 1);
    });

    it('ends with one quiet way to start (not a second main button)', () => {
      const end = q('.end a.btn')!;
      expect(end.getAttribute('href')).toBe('/');
      expect(clean(end.textContent)).toBe('Transcribe a file');
      expect(end.classList.contains('primary')).toBe(false);
      expect(q('section.cta')).toBeNull();
    });

    it('puts the questions and the steps in the structured data, exactly as shown', () => {
      const faq = ldBlock('page:faq');
      expect(faq['@type']).toBe('FAQPage');
      const shown = qa('details.qa').map((d) => [clean(d.querySelector('summary')!.textContent), clean(d.querySelector('p')!.textContent)]);
      expect(faq.mainEntity.map((e: { name: string; acceptedAnswer: { text: string } }) => [e.name, e.acceptedAnswer.text])).toEqual(shown);

      const how = ldBlock('page:howto');
      expect(how['@type']).toBe('HowTo');
      expect(how.name).toBe(content.howTitle);
      expect(how.description).toBe(content.howToDescription);
      expect(how.step.map((s: { position: number; name: string; text: string }) => [s.position, s.name, s.text])).toEqual(
        content.steps.map((s, i) => [i + 1, s.title, s.text]),
      );
    });

    it('also has the route blocks: breadcrumb and application, for this address', () => {
      expect(ldBlock('route:breadcrumb').itemListElement[1].item).toBe(`https://transcribevid.com${path}`);
      expect(ldBlock('route:app').url).toBe(`https://transcribevid.com${path}`);
    });
  });

  describe('the limits in the text', () => {
    const limitsAnswer = () => {
      const all = qa('details.qa p').map((p) => clean(p.textContent));
      return all.filter((t) => /per file|limit/i.test(t));
    };

    const hint = () => clean(q('app-tool-drop .hint')!.textContent);

    it('public site: the limits the server announced, under the drop box and in the answers', async () => {
      await open('/mp3-to-text', makePublicHealth({ max_upload_mb: 1024, max_duration_min: 30 }));
      expect(hint()).toContain('Up to 1 GB and 30 minutes per file.');
      expect(limitsAnswer().some((t) => t.includes('Up to 1 GB and 30 minutes per file.'))).toBe(true);
      expect(limitsAnswer().some((t) => t.includes('There is no daily or monthly quota.'))).toBe(true);
    });

    // what the site announces until the server says otherwise (core/site.service.ts), worded as the page words it
    const announced = `Up to ${fmtBytesShort(PUBLIC_DEFAULTS.maxUploadMb * 1024 * 1024)} and ${PUBLIC_DEFAULTS.maxDurationMin} minutes per file.`;

    it('before the server has answered: the announced public limits (what a crawler reads)', async () => {
      await open('/mp3-to-text', null);
      expect(DEFAULT_LIMITS).toBe(announced);
      expect(DEFAULT_LIMITS).toMatch(/^Up to \d+(\.\d+)? (MB|GB) and \d+ minutes per file\.$/);
      expect(hint()).toContain(DEFAULT_LIMITS);
    });

    it('the limits follow the server when it answers later', async () => {
      await open('/mp3-to-text', null);
      expect(hint()).toContain(announced);
      store.health.set(makePublicHealth({ max_upload_mb: 100, max_duration_min: 10 }));
      harness.detectChanges();
      TestBed.tick();
      expect(hint()).toContain('Up to 100 MB and 10 minutes per file.');
      expect(hint()).not.toContain(announced);
      expect(ldBlock('page:faq').mainEntity.some((e: { acceptedAnswer: { text: string } }) => e.acceptedAnswer.text.includes('100 MB'))).toBe(true);
    });

    it('a server that announces no limit: says there is none, and does not make one up', async () => {
      await open('/mp3-to-text', makePublicHealth({ max_upload_mb: undefined, max_duration_min: 0 }));
      expect(hint()).toContain('There is no size or length limit set here.');
      expect(clean(page.textContent)).not.toContain('Up to ');
    });

    it('a local install uses its own limits too', async () => {
      await open('/video-to-text', makeHealth({ max_upload_mb: 4096 }));
      expect(hint()).toContain('Up to 4 GB per file.');
    });
  });

  describe('the in-browser edition (the file never leaves the device)', () => {
    /** sentences that are true only when files are uploaded to a server with limits and a shared queue */
    const SERVER_ONLY = ['uploaded to our server', 'queue', 'refused', 'Up to ', '500 MB', 'over the limit', 'no advertising', 'session cookie'];

    it.each(TOOL_PAGES.map((t) => [t.path] as const))('%s: says nothing that is only true for the server', async (path) => {
      await open(path, makeBrowserHealth());
      const shown = clean(page.textContent);
      for (const phrase of SERVER_ONLY) expect(shown).not.toContain(phrase);
      expect(clean(q('app-tool-drop .hint')!.textContent)).toContain('Your file never leaves your device.');
      expect(clean(q('app-tool-drop .hint')!.textContent)).toContain('There is no size or length limit set here.');
      // what a search engine reads in the structured data is the same browser wording
      const faq = JSON.stringify(ldBlock('page:faq'));
      const how = JSON.stringify(ldBlock('page:howto'));
      for (const phrase of SERVER_ONLY) {
        expect(faq).not.toContain(phrase);
        expect(how).not.toContain(phrase);
      }
    });

    it('mp4-to-text: the steps, tips and questions in the browser wording, also in the structured data', async () => {
      await open('/mp4-to-text', makeBrowserHealth());
      const c = TOOL_CONTENT['mp4-to-text'];
      const b = editionText(c, true);
      const steps = qa('ol.steps > li');
      expect(steps.map((x) => clean(x.querySelector('h3')!.textContent))).toEqual(b.steps.map((x) => x.title));
      expect(steps.map((x) => clean(x.querySelector('p')!.textContent))).toEqual(b.steps.map((x) => x.text));
      expect(clean(steps[1].querySelector('h3')!.textContent)).toBe('Add it');
      expect(clean(steps[1].textContent)).toContain('they are transcribed one after another');
      const questions = qa('details.qa summary').map((x) => clean(x.textContent));
      expect(questions).toContain('Why did my MP4 not work?');
      expect(questions).not.toContain('Why was my MP4 refused?');
      expect(clean(page.textContent)).toContain('There is no size or length limit, but very long videos need enough free memory.');
      const how = ldBlock('page:howto');
      expect(how.step.map((x: { name: string; text: string }) => [x.name, x.text])).toEqual(b.steps.map((x) => [x.title, x.text]));
      const faq = ldBlock('page:faq');
      expect(faq.mainEntity.map((e: { name: string }) => e.name)).toEqual(b.faqs.map((f) => f.question));
    });

    it('mp3-to-text: says the MP3 stays in this browser and is not uploaded', async () => {
      await open('/mp3-to-text', makeBrowserHealth());
      const shown = clean(page.textContent);
      expect(shown).toContain('Only in this browser: your MP3 never leaves your device.');
      expect(shown).toContain('We set no size or length limit, because the MP3 is transcribed in your browser on your own device.');
      expect(shown).toContain('your browser reads an MP3 quickly');
      expect(shown).not.toContain('an MP3 uploads quickly');
    });

    it('video-to-text: free because of ads, no size limit and nobody ahead of you', async () => {
      await open('/video-to-text', makeBrowserHealth());
      const shown = clean(page.textContent);
      expect(shown).toContain('ads keep it free');
      expect(shown).toContain('there is no size limit and nobody else is ahead of you');
      expect(shown).toContain('Long videos take longer.');
      expect(shown).not.toContain('Stay under the limit.');
    });

    it('the server editions keep their own words (the public site still states its limits and queue)', async () => {
      await open('/video-to-text', makePublicHealth({ max_upload_mb: 1024, max_duration_min: 30 }));
      const shown = clean(page.textContent);
      expect(shown).toContain('If many people are using the service, your file may wait in a queue for a while.');
      expect(shown).toContain('Stay under the limit.');
      expect(clean(q('app-tool-drop .hint')!.textContent)).toContain('Nothing is uploaded until you press Transcribe.');
    });
  });

  describe('editionText', () => {
    it('takes each browser variant only in the in-browser edition, and keeps the rest', () => {
      const c = TOOL_CONTENT['mp4-to-text'];
      const server = editionText(c, false);
      expect(server.steps).toEqual(c.steps.map((x) => ({ title: x.title, text: x.text })));
      expect(server.tips).toEqual(c.tips.map((x) => ({ title: x.title, text: x.text })));
      expect(server.faqs).toEqual(c.faqs.map((f) => ({ question: f.question, answer: f.answer })));
      expect(server.why).toEqual(c.why);
      const browser = editionText(c, true);
      expect(browser.steps[0].title).toBe(c.steps[0].title); // a variant without its own title keeps the title
      expect(browser.steps[0].text).toBe(c.steps[0].browser!.text);
      expect(browser.steps[2]).toEqual({ title: c.steps[2].title, text: c.steps[2].text }); // no variant: unchanged
      expect(browser.why).toEqual(c.why); // no browserWhy on this page
      expect(editionText(TOOL_CONTENT['mp3-to-text'], true).why).toEqual(TOOL_CONTENT['mp3-to-text'].browserWhy);
    });
  });

  describe('structured data lifecycle', () => {
    it('is taken away when the visitor goes to another page, and the new page has its own', async () => {
      await open('/mp3-to-text');
      expect(ldBlock('page:faq')).not.toBeNull();
      await harness.navigateByUrl('/mp4-to-text');
      harness.detectChanges();
      TestBed.tick();
      expect(ldBlock('page:faq').mainEntity.map((e: { name: string }) => e.name)).toEqual(TOOL_CONTENT['mp4-to-text'].faqs.map((f) => f.question));
      expect(ldBlock('route:breadcrumb').itemListElement[1].item).toBe('https://transcribevid.com/mp4-to-text');
      await harness.navigateByUrl('/privacy');
      harness.detectChanges();
      TestBed.tick();
      expect(ldBlock('page:faq')).toBeNull();
      expect(ldBlock('page:howto')).toBeNull();
      expect(ldBlock('route:app')).toBeNull();
    });
  });

  describe('a page that is not in the list', () => {
    it('falls back to the video page text instead of failing', async () => {
      const fixture = TestBed.configureTestingModule({
        providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: 'x', component: ToolPage, data: { tool: 'does-not-exist' } }])],
      });
      expect(fixture).toBeDefined();
      harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/x');
      expect(clean(harness.routeNativeElement!.querySelector('h1')!.textContent)).toBe(TOOL_CONTENT['video-to-text'].h1);
    });
  });
});
