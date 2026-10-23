import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { JobsStore } from '../../core/jobs.store';
import { Health } from '../../core/models';
import { makeHealth, makePublicHealth, silentLog } from '../../testing/fakes';
import { TOOL_PAGES } from '../tool-pages/tool-pages.list';
import { FaqPage } from './faq';

const QUESTIONS = [
  'Is it really free and unlimited? Do I need to log in?',
  'How accurate is it?',
  'How do I get better accuracy?',
  'Which languages are supported?',
  'Which files can I use, and what are the limits?',
  'How long does it take?',
  'Is my data private?',
  'Can I edit the transcript?',
];

describe('FaqPage', () => {
  let fixture: ComponentFixture<FaqPage>;
  let store: JobsStore;

  function setup(health: Health | null) {
    document.head.innerHTML = '';
    TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
    store = TestBed.inject(JobsStore);
    store.health.set(health);
    fixture = TestBed.createComponent(FaqPage);
    fixture.detectChanges();
  }

  const el = () => fixture.nativeElement as HTMLElement;
  const q = (sel: string) => el().querySelector(sel);
  const qa = (sel: string) => Array.from(el().querySelectorAll(sel));
  const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
  const text = () => clean(el().textContent);
  const items = () => qa('details.qa');
  const question = (d: Element) => clean(d.querySelector(':scope > summary')?.textContent);
  /** The answer as a reader takes it in: paragraphs and list items are separate, so they are joined with a space. */
  const answerText = (d: Element) =>
    Array.from(d.children)
      .filter((c) => c.tagName !== 'SUMMARY' && c.tagName !== 'DETAILS')
      .map((c) => (c.tagName === 'UL' || c.tagName === 'OL' ? Array.from(c.children).map((li) => clean(li.textContent)).join(' ') : clean(c.textContent)))
      .filter(Boolean)
      .join(' ');
  /** The whole text of one question's details element (the answer, and a list of languages inside it, if any). */
  const answerOf = (title: string) => clean(items().find((d) => question(d) === title)?.textContent).slice(title.length).trim();

  describe('the page', () => {
    it('has one h1, a short lead and the chips Free, Unlimited, No login (once, without a repeating sentence)', () => {
      setup(makePublicHealth());
      expect(qa('h1').length).toBe(1);
      expect(q('h1')?.textContent).toBe('Frequently asked questions');
      expect(q('.eyebrow')).toBeNull(); // "FAQ" above "Frequently asked questions" said the same thing twice
      expect(clean(q('.page-lead')?.textContent)).toBe('Press a question to read its answer.');
      expect(qa('app-free-chips').length).toBe(1);
      expect(qa('app-free-chips .chips li').map((li) => clean(li.textContent))).toEqual(['Free', 'Unlimited', 'No login']);
      expect(q('app-free-chips .line')).toBeNull();
    });

    it('starts with the question people ask first: is it free, do I need to log in', () => {
      setup(makePublicHealth());
      expect(question(items()[0])).toBe('Is it really free and unlimited? Do I need to log in?');
    });

    it('asks every question once, in one plain list', () => {
      setup(makePublicHealth());
      expect(items().map(question)).toEqual(QUESTIONS);
      expect(qa('.faq > details.qa').length).toBe(QUESTIONS.length);
      expect(qa('.faq .col').length).toBe(0);
    });

    it('does not talk about folders (the feature is gone) or the old "model" wording', () => {
      setup(makePublicHealth());
      expect(text()).not.toMatch(/folder/i);
      expect(text()).not.toContain('bigger model');
    });

    it('ends with one main button to start, a "Still stuck?" line and the keyword pages', () => {
      setup(makePublicHealth());
      expect(qa('.btn.primary').length).toBe(1);
      const start = q('.end a.btn.primary')!;
      expect(start.getAttribute('href')).toBe('/');
      expect(clean(start.textContent)).toBe('Transcribe a file');
      expect(clean(q('.still')?.textContent)).toBe('Still stuck? Read How it works');
      expect(q('.still a')?.getAttribute('href')).toBe('/how-it-works');
      expect(qa('app-related-tools a').map((a) => a.getAttribute('href'))).toEqual(TOOL_PAGES.map((t) => t.path));
    });
  });

  describe('opening and closing a question', () => {
    it('every question starts closed', () => {
      setup(makePublicHealth());
      expect(items().every((d) => !(d as HTMLDetailsElement).open)).toBe(true);
      expect(items().every((d) => !d.hasAttribute('open'))).toBe(true);
    });

    it('pressing the question opens its answer, pressing it again closes it (a native <details>)', () => {
      setup(makePublicHealth());
      const d = items()[1] as HTMLDetailsElement;
      d.querySelector<HTMLElement>(':scope > summary')!.click();
      expect(d.open).toBe(true);
      d.querySelector<HTMLElement>(':scope > summary')!.click();
      expect(d.open).toBe(false);
    });

    it('questions open independently of each other', () => {
      setup(makePublicHealth());
      const [a, b] = [items()[0], items()[2]] as HTMLDetailsElement[];
      a.querySelector<HTMLElement>(':scope > summary')!.click();
      b.querySelector<HTMLElement>(':scope > summary')!.click();
      expect(a.open && b.open).toBe(true);
    });

    it('each question has an icon that is hidden from assistive technology', () => {
      setup(makePublicHealth());
      const marks = qa('details.qa > summary > .pm');
      expect(marks.length).toBe(QUESTIONS.length);
      expect(marks.every((m) => m.getAttribute('aria-hidden') === 'true')).toBe(true);
    });
  });

  describe('"Is it really free and unlimited?": honest about the limits', () => {
    const first = () => answerOf(QUESTIONS[0]);

    it('public site: free, no login ever, no quota - but each file has a size and length limit', () => {
      setup(makePublicHealth({ max_upload_mb: 2048, max_duration_min: 60 }));
      expect(first()).toContain('Yes. It is free, and there is no account or login, ever.');
      expect(first()).toContain('There is no daily or monthly quota and no paywall.');
      expect(first()).toContain('To keep it fast for everyone, each file has a size and length limit.');
      expect(first()).toContain('Up to 2 GB and 60 minutes per file.');
      expect(first()).toContain('Unusually heavy bursts of uploads may be asked to wait a little.');
    });

    it('public site: it does not promise "unlimited files" - the limit is stated right after the promise', () => {
      setup(makePublicHealth());
      expect(first().indexOf('no paywall')).toBeLessThan(first().indexOf('size and length limit'));
    });

    it('public site: names no figure when the server has announced none', () => {
      setup(makePublicHealth({ max_upload_mb: undefined, max_duration_min: 0 }));
      expect(first()).toContain('each file has a size and length limit.');
      expect(first()).not.toContain('Up to');
    });

    it('local install: no quota, speed depends on this computer, and no claim about a public limit', () => {
      setup(makeHealth());
      expect(first()).toContain('Yes. It is free, and there is nothing to sign up for and no login.');
      expect(first()).toContain('This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.');
      expect(first()).not.toContain('To keep it fast for everyone');
      expect(first()).not.toContain('Unusually heavy bursts');
    });

    it('local install: states the limits only when it has some configured', () => {
      setup(makeHealth({ max_upload_mb: 512 }));
      expect(first()).toContain('Up to 512 MB per file.');
      TestBed.resetTestingModule();
      setup(makeHealth());
      expect(first()).not.toContain('Up to');
    });

    it('before the server answers it reads like the public site (the prerendered words)', () => {
      setup(null);
      expect(first()).toContain('there is no account or login, ever');
      expect(first()).toContain('each file has a size and length limit');
    });
  });

  describe('files and limits', () => {
    const files = () => answerOf(QUESTIONS[4]);

    it('names the supported file types and recording', () => {
      setup(makePublicHealth());
      for (const f of ['MP4', 'MKV', 'MOV', 'WEBM', 'MP3', 'WAV', 'M4A', 'FLAC', 'OPUS']) expect(files()).toContain(f);
      expect(files()).toContain('record straight from your microphone');
    });

    it('states the limits the server reports', () => {
      setup(makePublicHealth({ max_upload_mb: 2048, max_duration_min: 60 }));
      expect(files()).toContain('Limits. Up to 2 GB and 60 minutes per file. Larger or longer files are refused before they are processed');
    });

    it('does not invent limits when the server reports none', () => {
      setup(makePublicHealth({ max_upload_mb: undefined, max_duration_min: 0 }));
      expect(files()).toContain('No size or length limit is announced by the server right now.');
      expect(files()).not.toContain('Up to');
    });

    it('says what happens when the service is busy', () => {
      setup(makePublicHealth());
      expect(files()).toContain('If the service is busy or too many transcripts are already running, it asks you to wait and says why.');
    });
  });

  describe('languages', () => {
    it('promises more than 50 languages and lists the ones the server reports', () => {
      setup(makePublicHealth());
      expect(answerOf('Which languages are supported?')).toContain('More than 50 languages');
      expect(text()).not.toContain('Show all');
      store.languages.set([
        { code: 'en', name: 'English' },
        { code: 'de', name: 'German' },
      ]);
      fixture.detectChanges();
      expect(text()).toContain('Show all 2 languages');
      expect(qa('.langs li').map((li) => li.textContent)).toEqual(['English', 'German']);
    });

    it('the list of languages is a detail of its answer, not a question of its own', () => {
      setup(makePublicHealth());
      store.languages.set([{ code: 'en', name: 'English' }]);
      fixture.detectChanges();
      expect(items().length).toBe(QUESTIONS.length);
      expect(items().map(question)).not.toContain('Show all 1 languages');
    });
  });

  describe('accuracy', () => {
    it('is honest: no recognition is perfect, results can differ, verify before relying on it', () => {
      setup(makePublicHealth());
      const a = answerOf('How accurate is it?');
      expect(a).toContain('no speech recognition is perfect');
      expect(a).toContain('Always verify a transcript before relying on it');
      expect(a).toContain('Why can results differ between runs, quality settings or other tools?');
    });

    it('the tips use the names of the quality choices', () => {
      setup(makePublicHealth());
      const a = answerOf('How do I get better accuracy?');
      expect(a).toContain('Pick High accuracy or Best accuracy');
      expect(a).toContain('vocabulary hint');
      expect(a).toContain('Re-transcribe');
    });

    it('speed: names the quality choices and the queue', () => {
      setup(makePublicHealth());
      const a = answerOf('How long does it take?');
      expect(a).toContain('Fastest is quick; Best accuracy takes longest');
      expect(a).toContain('Waiting in queue');
    });

    it('editing: pencil, delete a line, search and replace', () => {
      setup(makePublicHealth());
      const a = answerOf('Can I edit the transcript?');
      expect(a).toContain('pencil');
      expect(a).toContain('search and replace');
    });
  });

  describe('"Is my data private?": worded for where the files really go', () => {
    const privacy = () => answerOf('Is my data private?');

    it('public site: uploaded, kept for the session, deleted automatically, no tracking, one cookie, one anonymous total', () => {
      setup(makePublicHealth({ session_idle_minutes: 30 }));
      const p = privacy();
      expect(p).toContain('Your files are uploaded to our server so they can be processed there.');
      expect(p).toContain('kept only for your session and deleted automatically when it ends, after 30 minutes of inactivity');
      expect(p).toContain('Delete my data now');
      expect(p).toContain('There is no account and no tracking, and the only cookie is one essential session cookie');
      expect(p).toContain('one anonymous running total of how many files have been transcribed on the site');
      expect(p).toContain('it is not linked to you, your files or your session');
      expect(p).not.toContain('nothing leaves');
      expect(q('a[href="/privacy"]')).not.toBeNull();
    });

    it('local install: processed on this machine and nothing leaves it', () => {
      setup(makeHealth());
      expect(privacy()).toContain('This copy of TranscribeVid runs on your own computer.');
      expect(privacy()).toContain('nothing leaves it');
      expect(privacy()).not.toContain('uploaded to our server');
    });

    it('before the server has answered it makes no claim about where files go', () => {
      setup(null);
      expect(privacy()).toContain('depends on how TranscribeVid is run');
      expect(privacy()).not.toContain('nothing leaves');
      expect(privacy()).not.toContain('uploaded to our server');
    });
  });

  describe('structured data (FAQPage)', () => {
    const block = () => document.head.querySelector('script[data-vt="page:faq"]');
    type Entity = { '@type': string; name: string; acceptedAnswer: { text: string } };

    it('describes exactly the questions and answers the page shows', () => {
      setup(makePublicHealth({ max_upload_mb: 2048, max_duration_min: 60 }));
      TestBed.tick();
      const data = JSON.parse(block()!.textContent!);
      expect(data['@type']).toBe('FAQPage');
      const entities: Entity[] = data.mainEntity;
      expect(entities.map((e) => e.name)).toEqual(QUESTIONS);
      expect(entities[0].acceptedAnswer.text).toContain('Up to 2 GB and 60 minutes per file.');
      const shown = items().map((d) => [question(d), answerText(d)]);
      expect(entities.map((e) => [e.name, e.acceptedAnswer.text])).toEqual(shown);
    });

    it('follows the words when the limits change (what the visitor reads is what is marked up)', () => {
      setup(makePublicHealth({ max_upload_mb: 2048, max_duration_min: 60 }));
      TestBed.tick();
      store.health.set(makePublicHealth({ max_upload_mb: 1024, max_duration_min: 30 }));
      fixture.detectChanges();
      TestBed.tick();
      fixture.detectChanges(); // the questions are read back after the page was drawn; the markup follows on the next pass
      TestBed.tick();
      const data = JSON.parse(block()!.textContent!);
      expect(data.mainEntity[0].acceptedAnswer.text).toContain('Up to 1 GB and 30 minutes per file.');
      expect(data.mainEntity[0].acceptedAnswer.text).not.toContain('2 GB');
    });

    it('is taken away again when the page is left', () => {
      setup(makePublicHealth());
      TestBed.tick();
      expect(block()).not.toBeNull();
      fixture.destroy();
      expect(block()).toBeNull();
    });

    it('also follows the words when the page is open in the router outlet, like in the app (the limits arrive after the first render)', async () => {
      document.head.innerHTML = '';
      TestBed.configureTestingModule({
        providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: 'faq', component: FaqPage }])],
      });
      const jobs = TestBed.inject(JobsStore);
      jobs.health.set(makePublicHealth({ max_upload_mb: 2048, max_duration_min: 60 }));
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/faq');
      harness.detectChanges();
      TestBed.tick();
      const first = () => JSON.parse(block()!.textContent!).mainEntity[0].acceptedAnswer.text as string;
      expect(first()).toContain('Up to 2 GB and 60 minutes per file.');
      jobs.health.set(makePublicHealth({ max_upload_mb: 1024, max_duration_min: 30 }));
      harness.detectChanges();
      TestBed.tick();
      harness.detectChanges();
      TestBed.tick();
      expect(clean((harness.routeNativeElement as HTMLElement).textContent)).toContain('Up to 1 GB and 30 minutes per file.');
      expect(first()).toContain('Up to 1 GB and 30 minutes per file.');
      expect(first()).not.toContain('2 GB');
    });
  });
});
