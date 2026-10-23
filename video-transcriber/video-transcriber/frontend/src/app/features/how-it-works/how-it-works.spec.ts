import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { JobsStore } from '../../core/jobs.store';
import { Health } from '../../core/models';
import { TOOL_PAGES } from '../tool-pages/tool-pages.list';
import { makeHealth, makePublicHealth, silentLog } from '../../testing/fakes';
import { HowItWorksPage } from './how-it-works';

describe('HowItWorksPage', () => {
  let fixture: ComponentFixture<HowItWorksPage>;
  let store: JobsStore;

  function setup(health: Health | null) {
    document.head.innerHTML = '';
    TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
    store = TestBed.inject(JobsStore);
    store.health.set(health);
    fixture = TestBed.createComponent(HowItWorksPage);
    fixture.detectChanges();
  }

  const el = () => fixture.nativeElement as HTMLElement;
  const q = (sel: string) => el().querySelector(sel);
  const qa = (sel: string) => Array.from(el().querySelectorAll(sel));
  const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
  const text = () => clean(el().textContent);
  const hrefs = () => qa('a').map((a) => a.getAttribute('href'));

  describe('the page', () => {
    it('has one h1 with the brand, a one-sentence lead and one way to start', () => {
      setup(makePublicHealth());
      expect(qa('h1').length).toBe(1);
      expect(q('h1')?.textContent).toBe('How TranscribeVid works');
      expect(q('.eyebrow')).toBeNull(); // the h1 already says "How ... works"
      const lead = clean(q('.page-lead')?.textContent);
      expect(lead).toContain('turns the speech in a video or audio file into text with timestamps');
      expect(lead.match(/\.\s/g)).toBeNull(); // one sentence
      const cta = q('.hero a.btn.primary')!;
      expect(cta.getAttribute('href')).toBe('/');
      expect(clean(cta.textContent)).toBe('Transcribe a file');
    });

    it('has exactly one main (primary) button: the one at the top', () => {
      setup(makePublicHealth());
      expect(qa('.btn.primary').length).toBe(1);
      expect(q('.btn.primary')!.closest('.hero')).not.toBeNull();
    });

    it('follows the brand name the server reports', () => {
      setup(makePublicHealth({ brand: { name: 'Acme Scribe' } }));
      expect(q('h1')?.textContent).toBe('How Acme Scribe works');
    });

    it('shows the three promises once, at the top: Free, Unlimited, No login', () => {
      setup(makePublicHealth());
      expect(qa('app-free-chips').length).toBe(1);
      expect(q('app-free-chips')!.closest('.hero')).not.toBeNull();
      expect(qa('app-free-chips .chips li').map((li) => clean(li.textContent))).toEqual(['Free', 'Unlimited', 'No login']);
      expect(q('app-free-chips .line')).toBeNull(); // no sentence repeating what the chips say
    });

    it('has no "at a glance" facts box repeating the chips and the steps', () => {
      setup(makePublicHealth());
      expect(q('dl.facts')).toBeNull();
    });
  });

  describe('3 simple steps', () => {
    it('are an ordered list of three, each with its number and a title', () => {
      setup(makePublicHealth());
      expect(clean(q('#steps-title')?.textContent)).toBe('3 simple steps');
      const steps = qa('ol.steps > li');
      expect(steps.length).toBe(3);
      expect(steps.map((s) => clean(s.querySelector('.num')?.textContent))).toEqual(['1', '2', '3']);
      expect(steps.map((s) => clean(s.querySelector('h3')?.textContent))).toEqual(['Add your file', 'Pick quality', 'Read, edit, download']);
      for (const s of steps) expect(clean(s.querySelector('p')?.textContent).length).toBeGreaterThan(30);
    });

    it('step 2 uses the names of the quality choices on the upload page', () => {
      setup(makePublicHealth());
      const step2 = clean(qa('ol.steps > li')[1].textContent);
      for (const name of ['Fastest', 'Standard', 'High accuracy', 'Best accuracy']) expect(step2).toContain(name);
    });

    it('step 1 sends the visitor to the home page, step 3 names every export format', () => {
      setup(makePublicHealth());
      expect(qa('ol.steps > li')[0].querySelector('a')?.getAttribute('href')).toBe('/');
      const step3 = clean(qa('ol.steps > li')[2].textContent);
      for (const f of ['SRT', 'VTT', 'TXT', 'Markdown', 'JSON', 'PDF']) expect(step3).toContain(f);
    });

    it('mentions no folders anywhere (that feature is gone)', () => {
      setup(makePublicHealth());
      expect(text()).not.toMatch(/folder/i);
    });
  });

  describe('what you get, tips and things to know', () => {
    it('lists six things you get, each with a heading and a sentence', () => {
      setup(makePublicHealth());
      const feats = qa('ul.features > li');
      expect(feats.map((f) => clean(f.querySelector('h3')?.textContent))).toEqual([
        'Accurate text',
        'Timestamps',
        'More than 50 languages',
        'Edit it right here',
        'Six ways to download',
        'Private',
      ]);
      for (const f of feats) expect(clean(f.querySelector('p')?.textContent)).not.toBe('');
    });

    it('gives the accuracy tips: language, vocabulary hint, higher quality, re-transcribe, clean audio, check the marked lines', () => {
      setup(makePublicHealth());
      const tips = clean(q('section.tips')?.textContent);
      expect(tips).toContain('Tips for the best results');
      expect(tips).toContain('Choose the spoken language');
      expect(tips).toContain('Add a vocabulary hint');
      expect(tips).toContain('Pick High accuracy or Best accuracy');
      expect(tips).toContain('Re-transcribe');
      expect(tips).toContain('Start from good audio');
      expect(tips).toContain('Check the marked lines');
    });

    it('says that errors happen and results should be checked', () => {
      setup(makePublicHealth());
      expect(text()).toContain('No speech recognition is perfect');
      expect(text()).toContain('Always verify a transcript');
    });

    it('links to the FAQ for more answers', () => {
      setup(makePublicHealth());
      expect(q('section.know .more a')?.getAttribute('href')).toBe('/faq');
    });

    it('names the languages and every download format', () => {
      setup(makePublicHealth());
      expect(text()).toContain('More than 50 languages');
      expect(text()).toContain('auto-detect');
      for (const f of ['TXT', 'SRT', 'VTT', 'Markdown', 'JSON', 'PDF']) expect(text()).toContain(f);
    });
  });

  describe('limits', () => {
    const goodToKnow = () => clean(q('section.know')?.textContent);

    it('states the size and length limits the server reports in "Good to know"', () => {
      setup(makePublicHealth({ max_upload_mb: 2048, max_duration_min: 60 }));
      expect(goodToKnow()).toContain('File limits. Up to 2 GB and 60 minutes per file. Larger or longer files are refused before they are processed');
    });

    it('does not invent limits when the server reports none', () => {
      setup(makePublicHealth({ max_upload_mb: undefined, max_duration_min: 0 }));
      expect(text()).not.toContain('Up to');
      expect(goodToKnow()).toContain('No size or length limit is announced');
    });

    it('a local install with a limit of its own states it', () => {
      setup(makeHealth({ max_upload_mb: 512 }));
      expect(goodToKnow()).toContain('File limits. Up to 512 MB per file.');
    });
  });

  describe('privacy - worded for where the files really go', () => {
    const privateCard = () => clean(qa('ul.features > li').find((li) => li.querySelector('h3')?.textContent === 'Private')!.textContent);
    const goodToKnow = () => clean(q('section.know')?.textContent);

    it('public site: no account, no tracking, kept only for the session, export before leaving', () => {
      setup(makePublicHealth());
      expect(privateCard()).toContain('No account and no tracking. Your files are kept only for your session and deleted automatically.');
      expect(goodToKnow()).toContain('Nothing is saved for later. Files and transcripts exist only for your session. Export what you need before you leave.');
      expect(q('section.know a[href="/privacy"]')).not.toBeNull();
      expect(text()).not.toContain('nothing leaves');
    });

    it('local install: processed on this machine and nothing leaves it', () => {
      setup(makeHealth());
      expect(privateCard()).toContain('runs on your own computer');
      expect(privateCard()).toContain('nothing leaves it');
      expect(goodToKnow()).toContain('Transcripts exist only for this session, so export what you need.');
      expect(goodToKnow()).toContain('describes the hosted website');
    });

    it('before the server has answered it makes no claim', () => {
      setup(null);
      expect(privateCard()).toContain('depends on how TranscribeVid is run');
      expect(goodToKnow()).not.toContain('Nothing is saved for later');
      expect(text()).not.toContain('nothing leaves');
      expect(text()).not.toContain('uploaded to our server');
    });
  });

  describe('links', () => {
    it('ends with one quiet way to start (not a second main button) and the "More free tools" links to every keyword page', () => {
      setup(makePublicHealth());
      const end = q('.end a.btn')!;
      expect(end.getAttribute('href')).toBe('/');
      expect(clean(end.textContent)).toBe('Transcribe a file');
      expect(end.classList.contains('primary')).toBe(false);
      expect(q('section.cta')).toBeNull();
      expect(clean(q('app-related-tools h2')?.textContent)).toBe('More free tools');
      expect(qa('app-related-tools a').map((a) => a.getAttribute('href'))).toEqual(TOOL_PAGES.map((t) => t.path));
    });

    it('has no link to the old /about address', () => {
      setup(makePublicHealth());
      expect(hrefs()).not.toContain('/about');
    });
  });

  describe('structured data (HowTo)', () => {
    const block = () => document.head.querySelector('script[data-vt="page:howto"]');

    it('describes exactly the three steps the page shows', () => {
      setup(makePublicHealth());
      TestBed.tick();
      const data = JSON.parse(block()!.textContent!);
      expect(data['@type']).toBe('HowTo');
      expect(data.name).toBe('How to turn a video or audio file into text with TranscribeVid');
      expect(data.step.map((s: { position: number; name: string }) => [s.position, s.name])).toEqual([
        [1, 'Add your file'],
        [2, 'Pick quality'],
        [3, 'Read, edit, download'],
      ]);
      const shown = qa('ol.steps > li p').map((p) => clean(p.textContent));
      expect(data.step.map((s: { text: string }) => s.text)).toEqual(shown);
    });

    it('is taken away again when the page is left', () => {
      setup(makePublicHealth());
      TestBed.tick();
      expect(block()).not.toBeNull();
      fixture.destroy();
      expect(block()).toBeNull();
    });

    it('follows the words when the page is open in the router outlet and the brand arrives after the first render (like in the app)', async () => {
      document.head.innerHTML = '';
      TestBed.configureTestingModule({
        providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: 'how-it-works', component: HowItWorksPage }])],
      });
      const jobs = TestBed.inject(JobsStore);
      jobs.health.set(makePublicHealth());
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/how-it-works');
      harness.detectChanges();
      TestBed.tick();
      const name = () => JSON.parse(block()!.textContent!).name as string;
      expect(name()).toBe('How to turn a video or audio file into text with TranscribeVid');
      jobs.health.set(makePublicHealth({ brand: { name: 'Acme Scribe' } }));
      harness.detectChanges();
      TestBed.tick();
      harness.detectChanges();
      TestBed.tick();
      expect(clean((harness.routeNativeElement as HTMLElement).querySelector('h1')!.textContent)).toBe('How Acme Scribe works');
      expect(name()).toBe('How to turn a video or audio file into text with Acme Scribe');
    });
  });
});
