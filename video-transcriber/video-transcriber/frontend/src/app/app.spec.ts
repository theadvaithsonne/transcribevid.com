import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { JobsStore } from './core/jobs.store';
import { Health, SiteStats } from './core/models';
import { SessionService } from './core/session.service';
import { StatsService } from './core/stats.service';
import { TOAST_DURATION, ToastService } from './core/toast.service';
import { TOOL_PAGES } from './features/tool-pages/tool-pages.list';
import { httpError, makeHealth, makePublicHealth, makeSession, makeStats, makeSummary, silentLog, useEnglishNumbers } from './testing/fakes';

@Component({ template: '' })
class Blank {}

describe('App shell', () => {
  let fixture: ComponentFixture<App>;
  let app: App;
  let ctl: HttpTestingController;
  let store: JobsStore;

  const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
  const qa = (sel: string) => Array.from(fixture.nativeElement.querySelectorAll(sel)) as HTMLElement[];
  const text = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const links = (sel: string) => qa(sel).map((a) => [text(a), a.getAttribute('href')]);
  const show = (h: Health) => {
    store.health.set(h);
    fixture.detectChanges();
  };

  beforeEach(() => {
    vi.useFakeTimers();
    useEnglishNumbers(); // "1,234", whatever the language of the machine that runs the tests
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.stubGlobal('confirm', vi.fn(() => true));
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: '**', component: Blank }])],
    });
    ctl = TestBed.inject(HttpTestingController);
    store = TestBed.inject(JobsStore);
    for (const r of ctl.match(() => true)) r.flush(r.request.url.endsWith('/health') ? { status: 'ok' } : []);
    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    fixture.detectChanges();
    // the counter's first request (GET /api/stats) stays unanswered here: the tests that care answer it with stats()
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    sessionStorage.clear();
    delete document.documentElement.dataset['theme'];
    document.documentElement.classList.remove('theme-switching');
  });

  /** Answers the counter's pending request. */
  function stats(body: SiteStats | object | string | null) {
    ctl.expectOne('/api/stats').flush(body);
    fixture.detectChanges();
  }

  describe('files dropped outside the drop zone', () => {
    function dispatch(type: 'dragover' | 'drop', types: string[]) {
      const ev = new Event(type, { cancelable: true, bubbles: true });
      Object.defineProperty(ev, 'dataTransfer', { value: { types } });
      window.dispatchEvent(ev);
      return ev;
    }

    it('are not allowed to navigate the tab to the file', () => {
      expect(dispatch('dragover', ['Files']).defaultPrevented).toBe(true);
      expect(dispatch('drop', ['Files']).defaultPrevented).toBe(true);
    });

    it('leaves other drags alone (text into an input, a link)', () => {
      expect(dispatch('dragover', ['text/plain']).defaultPrevented).toBe(false);
      expect(dispatch('drop', ['text/plain']).defaultPrevented).toBe(false);
      expect(dispatch('drop', ['text/uri-list', 'text/plain']).defaultPrevented).toBe(false);
    });

    it('stops listening when the app is destroyed', () => {
      fixture.destroy();
      expect(dispatch('drop', ['Files']).defaultPrevented).toBe(false);
    });
  });

  describe('toasts', () => {
    const toastEl = () => q('app-toasts .toast');

    it('live region: an error is an alert with a title, the message and a close button; it hides by itself', () => {
      expect(q('app-toasts [aria-live="polite"]')).not.toBeNull();
      expect(toastEl()).toBeNull();

      store.notify('Could not save the change.', 'error', 'Not saved');
      fixture.detectChanges();
      const el = toastEl()!;
      expect(el.classList).toContain('error');
      expect(el.getAttribute('role')).toBe('alert');
      expect(text(el.querySelector('b'))).toBe('Not saved');
      expect(el.textContent).toContain('Could not save the change.');
      expect(el.querySelector('button.close')?.getAttribute('aria-label')).toBe('Close: Not saved');

      vi.advanceTimersByTime(TOAST_DURATION.error);
      fixture.detectChanges();
      expect(toastEl()).toBeNull();
    });

    it('a success toast is a polite status message', () => {
      TestBed.inject(ToastService).success('Transcript copied', 'Copied');
      fixture.detectChanges();
      expect(toastEl()!.classList).toContain('success');
      expect(toastEl()!.getAttribute('role')).toBe('status');
    });

    it('closes with its close button', () => {
      store.notify('hello');
      fixture.detectChanges();
      (q('app-toasts .toast button.close') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(toastEl()).toBeNull();
    });

    it('stays while the pointer is on it', () => {
      store.notify('read me', 'info');
      fixture.detectChanges();
      toastEl()!.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(TOAST_DURATION.info * 3);
      fixture.detectChanges();
      expect(toastEl()).not.toBeNull();
      toastEl()!.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(TOAST_DURATION.info);
      fixture.detectChanges();
      expect(toastEl()).toBeNull();
    });
  });

  describe('brand, header and footer', () => {
    it('shows the TranscribeVid logo and wordmark linking home, with the tagline - and nothing of the old name', () => {
      const brand = q('header a.brand')!;
      expect(brand.getAttribute('href')).toBe('/');
      expect(brand.getAttribute('aria-label')).toBe('TranscribeVid home');
      expect(q('.wordmark')?.textContent).toBe('TranscribeVid');
      expect(q('.wordmark b')?.textContent).toBe('Vid');
      expect(text(brand)).toContain('Video to text, accurately.');
      expect(brand.querySelector('svg')).not.toBeNull();
      expect(fixture.nativeElement.textContent).not.toContain('Video Transcriber');
    });

    it('has the page landmarks: banner, labelled navigations, main and a footer', () => {
      expect(q('header.topbar')).not.toBeNull();
      expect(q('header nav[aria-label="Main"]')).not.toBeNull();
      expect(q('footer nav[aria-label="Footer"]')).not.toBeNull();
      expect(q('footer nav[aria-label="Free tools"]')).not.toBeNull();
      expect(q('main#main')).not.toBeNull();
    });

    it('has no sidebar and no folders any more', () => {
      expect(q('aside')).toBeNull();
      expect(q('.sidebar')).toBeNull();
      expect(q('.shell > .side')).toBeNull();
      show(makePublicHealth());
      store.upsert(makeSummary({ id: 'a' }));
      app.togglePop();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toMatch(/folder/i);
      expect(qa('[draggable="true"]')).toEqual([]);
    });

    it('puts the logo on the left and the tabs, counter, transcripts and theme switch after the spacer', () => {
      show(makePublicHealth());
      store.upsert(makeSummary({ id: 'a' }));
      stats(makeStats({ transcribed: 10 }));
      const order = Array.from(q('header.topbar')!.children).map((c) => c.className.split(' ')[0]);
      expect(order[0]).toBe('brand');
      expect(order.indexOf('spacer')).toBe(1);
      const after = order.slice(2);
      expect(after.indexOf('mainnav')).toBeLessThan(after.indexOf('counter'));
      expect(after.indexOf('counter')).toBeLessThan(after.indexOf('tmenu'));
      expect(after.indexOf('tmenu')).toBeLessThan(after.indexOf('btn')); // the theme button
    });

    it('has a skip link that moves the focus to the main area instead of navigating to #main', () => {
      const link = q('a.skip-link')!;
      expect(link.textContent).toContain('Skip to main content');
      const click = new MouseEvent('click', { bubbles: true, cancelable: true });
      link.dispatchEvent(click);
      expect(click.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(q('main'));
    });

    it('offers Transcribe, How it works and FAQ as tabs', () => {
      expect(links('header nav[aria-label="Main"] a')).toEqual([
        ['Transcribe', '/'],
        ['How it works', '/how-it-works'],
        ['FAQ', '/faq'],
      ]);
    });

    it('marks the tab of the current page (Transcribe only on the home page itself)', async () => {
      const active = () => qa('header nav[aria-label="Main"] a.active').map((a) => text(a));
      await TestBed.inject(Router).navigateByUrl('/');
      fixture.detectChanges();
      expect(active()).toEqual(['Transcribe']);
      await TestBed.inject(Router).navigateByUrl('/faq');
      fixture.detectChanges();
      expect(active()).toEqual(['FAQ']);
      await TestBed.inject(Router).navigateByUrl('/how-it-works');
      fixture.detectChanges();
      expect(active()).toEqual(['How it works']);
    });

    it('shows the Logs tab only when the server says logs are enabled', () => {
      const logs = () => q('header nav[aria-label="Main"] a[href="/logs"]');
      expect(logs()).toBeNull(); // before the server said anything useful
      show(makeHealth());
      expect(logs()).toBeNull();
      show(makePublicHealth({ logs_enabled: false }));
      expect(logs()).toBeNull();
      show(makePublicHealth({ logs_enabled: true }));
      expect(text(logs())).toContain('Logs');
      expect(links('header nav[aria-label="Main"] a').map((l) => l[1])).toEqual(['/', '/how-it-works', '/faq', '/logs']);
    });

    it('never advertises the hardware of the public site (no CPU / GPU chip in the header)', () => {
      show(makePublicHealth({ device: 'cuda' }));
      expect(q('.topbar .chip')).toBeNull();
      expect(fixture.nativeElement.textContent).not.toMatch(/GPU|CUDA/i);
      show(makeHealth({ device: 'cuda' }));
      expect(q('.topbar .chip')).toBeNull();
    });

    it('has a short footer: the year and brand, Privacy and Terms (the pages in the header are not repeated)', () => {
      show(makePublicHealth({ version: '3.1.4' }));
      const foot = q('footer')!;
      expect(links('footer nav[aria-label="Footer"] a')).toEqual([
        ['Privacy', '/privacy'],
        ['Terms', '/terms'],
      ]);
      expect(text(foot)).toContain(`© ${new Date().getFullYear()} TranscribeVid`);
      expect(text(foot)).not.toContain('v3.1.4'); // visitors of the public site are not shown a version number
    });

    it('shows the version in the footer of a local copy (for whoever runs it)', () => {
      show(makeHealth({ version: '3.1.4' }));
      expect(text(q('footer'))).toContain('v3.1.4');
    });

    it('has a second footer row "Free tools" that links every keyword page', () => {
      const row = q('footer nav[aria-label="Free tools"]')!;
      expect(text(row.querySelector('.foot-tools-label'))).toBe('Free tools:');
      expect(links('footer nav[aria-label="Free tools"] a')).toEqual(TOOL_PAGES.map((t) => [t.label, t.path]));
      expect(TOOL_PAGES.length).toBeGreaterThanOrEqual(6);
    });

    it('shows a contact e-mail in the footer only when the server has one', () => {
      show(makePublicHealth());
      expect(q('footer a[href^="mailto:"]')).toBeNull();
      show(makePublicHealth({ brand: { contact_email: 'hello@transcribevid.com' } }));
      const mail = q('footer a[href^="mailto:"]')!;
      expect(mail.getAttribute('href')).toBe('mailto:hello@transcribevid.com');
      expect(text(mail)).toBe('hello@transcribevid.com');
    });

    it('follows the brand name the server reports', () => {
      show(makePublicHealth({ brand: { name: 'Acme Scribe' } }));
      expect(q('header a.brand')!.getAttribute('aria-label')).toBe('Acme Scribe home');
      expect(text(q('.foot-brand'))).toBe('Acme Scribe');
    });

    it('the offline notice tells a developer how to start the backend, but not the visitors of the public site', () => {
      store.offline.set(true);
      show(makeHealth());
      expect(text(q('.offline'))).toContain('python run.py');
      show(makePublicHealth());
      expect(text(q('.offline'))).toContain("Can't reach the server.");
      expect(text(q('.offline'))).not.toContain('python run.py');
    });
  });

  describe('counter: "videos transcribed"', () => {
    const pill = () => q('header .counter');

    it('is hidden until the server has answered', () => {
      expect(pill()).toBeNull();
    });

    it('stays hidden when the request fails or the answer is not understood', () => {
      ctl.expectOne('/api/stats').flush(...httpError(500));
      fixture.detectChanges();
      expect(pill()).toBeNull();
      expect(app.stats.visible()).toBe(false);
    });

    it('public site, nothing counted yet: hidden (no "0 videos" on a brand new site)', () => {
      stats(makeStats({ transcribed: 0, counting: true }));
      expect(pill()).toBeNull();
    });

    it('public site: the number the server gave, with the words after it', () => {
      stats(makeStats({ transcribed: 42 }));
      expect(text(q('.cnum'))).toBe('42');
      expect(text(q('.clabel'))).toBe('videos transcribed');
    });

    it('says "video" (singular) for exactly one', () => {
      stats(makeStats({ transcribed: 1 }));
      expect(text(q('.cnum'))).toBe('1');
      expect(text(q('.clabel'))).toBe('video transcribed');
      expect(pill()!.getAttribute('aria-label')).toBe('1 video transcribed');
    });

    it('puts thousands separators in a big number', () => {
      stats(makeStats({ transcribed: 1234567 }));
      expect(text(q('.cnum'))).toBe('1,234,567');
      expect(pill()!.getAttribute('aria-label')).toBe('1,234,567 videos transcribed');
    });

    it('is one image for assistive technology: the full text is its accessible name and tooltip', () => {
      stats(makeStats({ transcribed: 12345 }));
      const el = pill()!;
      expect(el.getAttribute('role')).toBe('img');
      expect(el.getAttribute('aria-label')).toBe('12,345 videos transcribed');
      expect(el.getAttribute('title')).toBe('12,345 videos transcribed');
    });

    it('a copy that does not count (local, dev): shows 0 and says why, without pretending', () => {
      stats(makeStats({ transcribed: 0, counting: false }));
      expect(text(q('.cnum'))).toBe('0');
      expect(text(q('.clabel'))).toBe('videos transcribed');
      expect(pill()!.getAttribute('title')).toBe('This local copy does not count transcriptions');
      expect(pill()!.getAttribute('aria-label')).toBe('0 videos transcribed. This local copy does not count transcriptions.');
    });

    it('the short and the full form are both in the markup (the label is hidden by CSS on narrow windows)', () => {
      stats(makeStats({ transcribed: 7 }));
      expect(q('header .counter .cnum')).not.toBeNull();
      expect(q('header .counter .clabel')).not.toBeNull();
      expect(q('header .counter svg')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('changes with the next answer (60 s later) and hides when the server stops answering', () => {
      stats(makeStats({ transcribed: 5 }));
      expect(text(q('.cnum'))).toBe('5');
      vi.advanceTimersByTime(60_000);
      stats(makeStats({ transcribed: 6 }));
      expect(text(q('.cnum'))).toBe('6');
      for (let i = 0; i < 3; i++) {
        vi.advanceTimersByTime(60_000);
        ctl.expectOne('/api/stats').flush(...httpError(500));
        fixture.detectChanges();
        if (i < 2) expect(text(q('.cnum'))).toBe('6'); // a hiccup or two keeps the last good number
      }
      expect(pill()).toBeNull();
    });

    it('is also shown (once) in the mobile menu', () => {
      stats(makeStats({ transcribed: 2500 }));
      q('button.menu-btn')!.click();
      fixture.detectChanges();
      const sheetPill = q('#mobile-menu .sheet-counter')!;
      expect(text(sheetPill.querySelector('.cnum'))).toBe('2,500');
      expect(text(sheetPill.querySelector('.clabel'))).toBe('videos transcribed');
      expect(sheetPill.getAttribute('aria-label')).toBe('2,500 videos transcribed');
    });

    it('is not in the mobile menu while it is hidden', () => {
      stats(makeStats({ transcribed: 0 }));
      q('button.menu-btn')!.click();
      fixture.detectChanges();
      expect(q('#mobile-menu .sheet-counter')).toBeNull();
    });

    it("asks again about 2 seconds after one of the visitor's own transcriptions finishes, and shows the new number", () => {
      stats(makeStats({ transcribed: 5 }));
      store.upsert(makeSummary({ id: 'a', status: 'running', phase: 'transcribing', progress: 0.5 }));
      fixture.detectChanges();
      TestBed.tick();
      store.upsert(makeSummary({ id: 'a', status: 'done' }));
      fixture.detectChanges();
      TestBed.tick();
      vi.advanceTimersByTime(1999);
      ctl.expectNone('/api/stats');
      vi.advanceTimersByTime(1);
      const req = ctl.expectOne('/api/stats');
      expect(req.request.headers.get('Cache-Control')).toBe('no-cache');
      req.flush(makeStats({ transcribed: 6 }));
      fixture.detectChanges();
      expect(text(q('.cnum'))).toBe('6');
    });

    it('is the same service the shell injects (one request only, no second poll of its own)', () => {
      expect(app.stats).toBe(TestBed.inject(StatsService));
      ctl.expectOne('/api/stats').flush(makeStats({ transcribed: 3 }));
      ctl.expectNone('/api/stats');
    });
  });

  describe('theme switch', () => {
    const btn = () => q('button.theme-btn')!;

    it('starts light (the default) and offers the dark theme', () => {
      expect(app.theme.theme()).toBe('light');
      expect(btn().getAttribute('aria-label')).toBe('Switch to dark theme');
      expect(btn().getAttribute('title')).toBe('Switch to dark theme');
      expect(text(q('.theme-label'))).toBe('Dark');
      expect(document.documentElement.dataset['theme']).toBe('light');
    });

    it('switches theme, labels, <html> attribute and the remembered choice', () => {
      btn().click();
      fixture.detectChanges();
      expect(app.theme.theme()).toBe('dark');
      expect(document.documentElement.dataset['theme']).toBe('dark');
      expect(localStorage.getItem('vt-theme')).toBe('dark');
      expect(btn().getAttribute('aria-label')).toBe('Switch to light theme');
      expect(text(q('.theme-label'))).toBe('Light');
      btn().click();
      fixture.detectChanges();
      expect(app.theme.theme()).toBe('light');
      expect(document.documentElement.dataset['theme']).toBe('light');
    });

    it('turns transitions off for the moment of the switch (class on <html>, removed two frames later)', () => {
      btn().click();
      expect(document.documentElement.classList.contains('theme-switching')).toBe(true);
      vi.advanceTimersByTime(100);
      expect(document.documentElement.classList.contains('theme-switching')).toBe(false);
    });

    it('draws a different icon for each theme', () => {
      const icon = () => q('.theme-btn svg')!.innerHTML;
      const dark = icon();
      btn().click();
      fixture.detectChanges();
      expect(icon()).not.toBe(dark);
    });
  });

  describe('Transcripts popover', () => {
    const toggle = () => q('button.tbtn');
    const pop = () => q('#transcripts-pop');
    const open = () => {
      toggle()!.click();
      fixture.detectChanges();
    };
    const names = () => qa('#transcripts-pop .name').map((n) => text(n));

    it('is not there while the session has no transcripts', () => {
      expect(toggle()).toBeNull();
      app.togglePop();
      fixture.detectChanges();
      expect(pop()).toBeNull();
    });

    it('appears with the number of transcripts as soon as there is one', () => {
      store.upsert(makeSummary({ id: 'a' }));
      fixture.detectChanges();
      expect(toggle()).not.toBeNull();
      expect(toggle()!.getAttribute('aria-label')).toBe('Transcripts 1');
      expect(text(toggle()!.querySelector('.badge'))).toBe('1');
      expect(text(toggle()!.querySelector('.tlabel'))).toBe('Transcripts');
      store.upsert(makeSummary({ id: 'b', created_at: 2000 }));
      fixture.detectChanges();
      expect(toggle()!.getAttribute('aria-label')).toBe('Transcripts 2');
    });

    it('opens a labelled dialog that lists this session newest first, and closes with the same button', () => {
      store.upsert(makeSummary({ id: 'a', title: 'Old one', created_at: 100 }));
      store.upsert(makeSummary({ id: 'b', title: 'New one', created_at: 300 }));
      store.upsert(makeSummary({ id: 'c', title: 'Middle', created_at: 200 }));
      fixture.detectChanges();
      expect(pop()).toBeNull();
      expect(toggle()!.getAttribute('aria-expanded')).toBe('false');
      open();
      expect(pop()!.getAttribute('role')).toBe('dialog');
      expect(pop()!.getAttribute('aria-label')).toBe('Your transcripts');
      expect(toggle()!.getAttribute('aria-expanded')).toBe('true');
      expect(toggle()!.getAttribute('aria-controls')).toBe('transcripts-pop');
      expect(names()).toEqual(['New one', 'Middle', 'Old one']);
      expect(qa('#transcripts-pop a.item').map((a) => a.getAttribute('href'))).toEqual(['/jobs/b', '/jobs/c', '/jobs/a']);
      open();
      expect(pop()).toBeNull();
    });

    it('moves the focus to the first transcript when it opens, and back to the button when it closes with Escape', () => {
      store.upsert(makeSummary({ id: 'a' }));
      fixture.detectChanges();
      open();
      vi.advanceTimersByTime(1);
      expect(document.activeElement).toBe(q('#transcripts-pop a.item'));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();
      expect(pop()).toBeNull();
      expect(document.activeElement).toBe(toggle());
    });

    it('closes when something else is clicked, but not when its own content is clicked', () => {
      store.upsert(makeSummary({ id: 'a' }));
      fixture.detectChanges();
      open();
      q('#transcripts-pop .pop-list')!.click();
      fixture.detectChanges();
      expect(pop()).not.toBeNull();
      document.body.click();
      fixture.detectChanges();
      expect(pop()).toBeNull();
    });

    it('closes when the focus leaves it (Tab out), not when it moves inside', () => {
      store.upsert(makeSummary({ id: 'a' }));
      fixture.detectChanges();
      open();
      const wrap = q('.tmenu')!;
      const inside = q('#transcripts-pop .del')!;
      wrap.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: inside }));
      fixture.detectChanges();
      expect(pop()).not.toBeNull();
      wrap.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
      fixture.detectChanges();
      expect(pop()).toBeNull();
    });

    it('closes after navigating (a row, a link, back / forward)', async () => {
      store.upsert(makeSummary({ id: 'a' }));
      fixture.detectChanges();
      open();
      await TestBed.inject(Router).navigateByUrl('/faq');
      fixture.detectChanges();
      expect(pop()).toBeNull();
    });

    it('closes when a transcript is chosen', () => {
      store.upsert(makeSummary({ id: 'a' }));
      fixture.detectChanges();
      open();
      (q('#transcripts-pop a.item') as HTMLAnchorElement).click();
      fixture.detectChanges();
      expect(pop()).toBeNull();
    });

    it('describes each state in words, not only by colour', () => {
      store.upsert(makeSummary({ id: 'q', title: 'Queued', status: 'queued', progress: 0, created_at: 1 }));
      store.upsert(makeSummary({ id: 'r', title: 'Running', status: 'running', phase: 'transcribing', progress: 0.42, eta_seconds: 90, created_at: 2 }));
      store.upsert(makeSummary({ id: 's', title: 'Starting', status: 'running', phase: 'extracting', progress: 0, created_at: 3 }));
      store.upsert(makeSummary({ id: 'e', title: 'Broken', status: 'error', created_at: 4 }));
      store.upsert(makeSummary({ id: 'c', title: 'Stopped', status: 'cancelled', created_at: 5 }));
      store.upsert(makeSummary({ id: 'd', title: 'Finished', status: 'done', duration: 125, finished_at: Date.now() / 1000, created_at: 6 }));
      fixture.detectChanges();
      open();
      const meta = Object.fromEntries(qa('#transcripts-pop li.trow').map((li) => [text(li.querySelector('.name')), text(li.querySelector('.meta'))]));
      expect(meta['Queued']).toBe('Queued');
      expect(meta['Running']).toBe('Transcribing 42% · 2 min left');
      expect(meta['Starting']).toBe('Starting…');
      expect(meta['Broken']).toBe('Failed');
      expect(meta['Stopped']).toBe('Cancelled');
      expect(meta['Finished']).toBe('02:05 · just now');
    });

    it('shows a progress bar only for a transcript that is still being processed (indeterminate until text appears)', () => {
      store.upsert(makeSummary({ id: 'r', title: 'Running', status: 'running', phase: 'transcribing', progress: 0.5, created_at: 2 }));
      store.upsert(makeSummary({ id: 'q', title: 'Queued', status: 'queued', progress: 0, created_at: 1 }));
      store.upsert(makeSummary({ id: 'd', title: 'Done', status: 'done', created_at: 3 }));
      fixture.detectChanges();
      open();
      const row = (name: string) => qa('#transcripts-pop li.trow').find((li) => text(li.querySelector('.name')) === name)!;
      expect(row('Done').querySelector('.bar')).toBeNull();
      expect(row('Running').querySelector('.bar')).not.toBeNull();
      expect(row('Running').querySelector('.bar')!.classList.contains('indeterminate')).toBe(false);
      expect((row('Running').querySelector('.bar i') as HTMLElement).style.width).toBe('50%');
      expect(row('Queued').querySelector('.bar')!.classList.contains('indeterminate')).toBe(true);
    });

    it('pulses while something is being processed and stops when it is done', () => {
      store.upsert(makeSummary({ id: 'a', status: 'running', phase: 'transcribing', progress: 0.1 }));
      fixture.detectChanges();
      expect(toggle()!.querySelector('.pulse')).not.toBeNull();
      store.upsert(makeSummary({ id: 'a', status: 'done' }));
      fixture.detectChanges();
      expect(toggle()!.querySelector('.pulse')).toBeNull();
    });

    it('has a button per row that deletes (or, while running, cancels) with the name in its label', () => {
      store.upsert(makeSummary({ id: 'a', title: 'Interview', status: 'done', created_at: 1 }));
      store.upsert(makeSummary({ id: 'r', title: 'Live talk', status: 'running', phase: 'transcribing', progress: 0.2, created_at: 2 }));
      fixture.detectChanges();
      open();
      expect(qa('#transcripts-pop .del').map((b) => b.getAttribute('aria-label'))).toEqual(['Cancel Live talk', 'Delete Interview']);
    });

    it('asks before deleting from the list, then removes the row', () => {
      store.upsert(makeSummary({ id: 'a', title: 'Interview' }));
      fixture.detectChanges();
      open();
      q('#transcripts-pop .del')!.click();
      expect(vi.mocked(confirm).mock.calls[0][0]).toBe('Delete "Interview" and its transcript?');
      ctl.expectOne((r) => r.method === 'DELETE' && r.url === '/api/jobs/a').flush(null);
      fixture.detectChanges();
      expect(store.jobs()).toEqual([]);
      expect(toggle()).toBeNull(); // nothing left to list: no button, no popover
    });

    it('does not follow the link of the row whose delete button was pressed', () => {
      store.upsert(makeSummary({ id: 'a' }));
      fixture.detectChanges();
      open();
      const click = new MouseEvent('click', { bubbles: true, cancelable: true });
      q('#transcripts-pop .del')!.dispatchEvent(click);
      expect(click.defaultPrevented).toBe(true);
      ctl.expectOne((r) => r.method === 'DELETE');
    });

    it('goes home when the transcript that is open is deleted', async () => {
      const router = TestBed.inject(Router);
      await router.navigateByUrl('/jobs/a');
      const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
      store.upsert(makeSummary({ id: 'a' }));
      fixture.detectChanges();
      open();
      q('#transcripts-pop .del')!.click();
      ctl.expectOne((r) => r.method === 'DELETE' && r.url === '/api/jobs/a').flush(null);
      expect(navigate).toHaveBeenCalledWith('/');
    });

    it('stays where it is when another transcript is deleted', async () => {
      const router = TestBed.inject(Router);
      await router.navigateByUrl('/jobs/zzz');
      const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
      store.upsert(makeSummary({ id: 'a' }));
      fixture.detectChanges();
      open();
      q('#transcripts-pop .del')!.click();
      ctl.expectOne((r) => r.method === 'DELETE' && r.url === '/api/jobs/a').flush(null);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('mobile menu sheet', () => {
    const menuBtn = () => q('button.menu-btn')!;
    const sheet = () => q('#mobile-menu');
    const open = () => {
      menuBtn().click();
      fixture.detectChanges();
    };

    it('is closed at first, and the button says how to open it', () => {
      expect(sheet()).toBeNull();
      expect(menuBtn().getAttribute('aria-expanded')).toBe('false');
      expect(menuBtn().getAttribute('aria-label')).toBe('Open menu');
      expect(menuBtn().getAttribute('aria-controls')).toBe('mobile-menu');
    });

    it('opens a dialog with the tabs, and the button then says how to close it', () => {
      open();
      expect(sheet()!.getAttribute('role')).toBe('dialog');
      expect(menuBtn().getAttribute('aria-expanded')).toBe('true');
      expect(menuBtn().getAttribute('aria-label')).toBe('Close menu');
      expect(links('#mobile-menu nav[aria-label="Menu"] a')).toEqual([
        ['Transcribe', '/'],
        ['How it works', '/how-it-works'],
        ['FAQ', '/faq'],
      ]);
    });

    it('has the Logs link only when the server enables logs', () => {
      show(makePublicHealth({ logs_enabled: true }));
      open();
      expect(links('#mobile-menu nav[aria-label="Menu"] a').map((l) => l[1])).toEqual(['/', '/how-it-works', '/faq', '/logs']);
    });

    it('lists "Your transcripts" with the same rows as the popover, and a friendly note when there are none', () => {
      open();
      expect(text(q('#mobile-menu .sheet-title'))).toBe('Your transcripts');
      expect(text(q('#mobile-menu .empty'))).toBe('Nothing here yet. Transcripts you create appear here for this session.');
      store.upsert(makeSummary({ id: 'a', title: 'Interview' }));
      fixture.detectChanges();
      expect(qa('#mobile-menu .name').map((n) => text(n))).toEqual(['Interview']);
      expect(q('#mobile-menu .empty')).toBeNull();
    });

    it('says "Loading…" in the list until the first list has arrived', () => {
      store.loaded.set(false);
      open();
      expect(text(q('#mobile-menu .empty'))).toBe('Loading…');
    });

    it('moves the focus into the sheet, and closes with Escape giving the focus back to the button', () => {
      open();
      vi.advanceTimersByTime(1);
      expect(document.activeElement).toBe(q('#mobile-menu .sheet-link'));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();
      expect(sheet()).toBeNull();
      expect(document.activeElement).toBe(menuBtn());
    });

    it('closes with the same button, with a click on the scrim and when a link is chosen', () => {
      open();
      menuBtn().click();
      fixture.detectChanges();
      expect(sheet()).toBeNull();

      open();
      q('.scrim')!.click();
      fixture.detectChanges();
      expect(sheet()).toBeNull();

      open();
      (q('#mobile-menu .sheet-link') as HTMLAnchorElement).click();
      fixture.detectChanges();
      expect(sheet()).toBeNull();
    });

    it('closes after any navigation', async () => {
      open();
      await TestBed.inject(Router).navigateByUrl('/privacy');
      fixture.detectChanges();
      expect(sheet()).toBeNull();
    });

    it('and the transcripts popover never stay open together', () => {
      store.upsert(makeSummary({ id: 'a' }));
      fixture.detectChanges();
      q('button.tbtn')!.click();
      fixture.detectChanges();
      expect(q('#transcripts-pop')).not.toBeNull();
      open();
      expect(q('#transcripts-pop')).toBeNull();
      expect(sheet()).not.toBeNull();
      q('button.tbtn')!.click();
      fixture.detectChanges();
      expect(sheet()).toBeNull();
      expect(q('#transcripts-pop')).not.toBeNull();
    });

    it('also carries the "Delete my data now" action, even when there are no transcripts yet', () => {
      show(makePublicHealth());
      open();
      expect(q('#mobile-menu button.wipe')).not.toBeNull();
    });
  });

  describe('session note and "Delete my data now" (in the Transcripts popover)', () => {
    /** The note and the button live at the bottom of the popover, which exists while there is a transcript. */
    function openPopover() {
      store.upsert(makeSummary({ id: 'a' }));
      fixture.detectChanges();
      app.togglePop();
      fixture.detectChanges();
    }

    it('local: says that nothing is saved, and has no countdown', () => {
      show(makeHealth());
      openPopover();
      expect(text(q('.session-note'))).toBe('Session only — nothing is saved.');
      expect(q('.session-note')!.getAttribute('title')).toContain('Closing the app erases all transcripts');
      expect(q('.session-left')).toBeNull();
      expect(q('button.wipe')).not.toBeNull();
    });

    it('public: says in one line what happens to the files, with the whole story as its tooltip', () => {
      show(makePublicHealth({ session_idle_minutes: 30 }));
      openPopover();
      expect(text(q('.session-note'))).toBe('Kept only for this session, then deleted automatically.');
      const full = q('.session-note')!.getAttribute('title')!;
      expect(full).toContain('kept only for this session and deleted automatically after 30 minutes of inactivity');
      expect(full).toContain('Delete my data now');
      expect(full).toContain('No account, no tracking, one essential session cookie');
      expect(full).toContain('Export what you need');
      expect(full).not.toContain('nothing leaves');
    });

    it('public: without an idle time from the server the sentence still reads right', () => {
      show(makePublicHealth({ session_idle_minutes: undefined }));
      openPopover();
      expect(q('.session-note')!.getAttribute('title')).toContain('deleted automatically when it ends, or when you press');
    });

    it('public: shows how much session time is left, from the periodic session check', () => {
      show(makePublicHealth());
      TestBed.tick();
      ctl.expectOne('/api/session').flush(makeSession({ expires_in_seconds: 1500 }));
      openPopover();
      expect(text(q('.session-left'))).toBe('Session time left: about 25 min');
    });

    it('an older server that does not say anything about sessions gets no note and no button', () => {
      show({ status: 'ok' } as Health);
      openPopover();
      expect(q('.session-note')).toBeNull();
      expect(q('button.wipe')).toBeNull();
    });
  });

  describe('session banners (public site)', () => {
    const banner = () => q('.banner');
    function publicSession(seconds: number, id = 'sess-1') {
      store.health.set(makePublicHealth());
      TestBed.tick(); // the session service starts polling
      ctl.expectOne('/api/session').flush(makeSession({ expires_in_seconds: seconds, session_id: id }));
      fixture.detectChanges();
    }

    it('warns when less than five minutes are left', () => {
      publicSession(150);
      expect(text(banner())).toBe('Your session ends in 3 min. Export what you need.');
      expect(banner()!.getAttribute('role')).toBe('status');
    });

    it('is quiet while there is plenty of time', () => {
      publicSession(1500);
      expect(banner()).toBeNull();
    });

    it('says the session has ended and its data was deleted when the server hands out a new session; it can be dismissed', () => {
      publicSession(1000, 'a');
      vi.advanceTimersByTime(60_000);
      ctl.expectOne('/api/session').flush(makeSession({ session_id: 'b' }));
      fixture.detectChanges();
      expect(text(banner())).toContain('Your session has ended and its data was deleted.');
      expect(banner()!.getAttribute('role')).toBe('alert');
      (banner()!.querySelector('button') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(banner()).toBeNull();
    });

    it('is not shown on a transcript page, which says it in full itself', async () => {
      await TestBed.inject(Router).navigateByUrl('/jobs/' + 'a'.repeat(32));
      publicSession(1000, 'a');
      vi.advanceTimersByTime(60_000);
      ctl.expectOne('/api/session').flush(makeSession({ session_id: 'b' }));
      fixture.detectChanges();
      expect(banner()).toBeNull();
      await TestBed.inject(Router).navigateByUrl('/');
      fixture.detectChanges();
      expect(text(banner())).toContain('Your session has ended');
    });

    it('shows nothing on a local install, which has no session to run out', () => {
      store.health.set(makeHealth());
      TestBed.tick();
      ctl.expectNone('/api/session');
      fixture.detectChanges();
      expect(banner()).toBeNull();
    });
  });

  describe('Delete my data now', () => {
    let navigate: ReturnType<typeof vi.fn>;
    const wipe = () => q('button.wipe') as HTMLButtonElement;
    const deleteReq = () => ctl.expectOne((r) => r.method === 'DELETE' && r.url === '/api/session');

    beforeEach(() => {
      navigate = vi.fn(() => Promise.resolve(true));
      TestBed.inject(Router).navigateByUrl = navigate as unknown as Router['navigateByUrl'];
      store.health.set(makePublicHealth());
      store.upsert(makeSummary({ id: 'a' }));
      fixture.detectChanges();
      TestBed.tick();
      ctl.expectOne('/api/session').flush(makeSession());
      app.togglePop(); // the button is at the bottom of the popover
      fixture.detectChanges();
    });

    it('asks for confirmation first: declining sends nothing', () => {
      vi.stubGlobal('confirm', vi.fn(() => false));
      wipe().click();
      expect(confirm).toHaveBeenCalledTimes(1);
      ctl.expectNone((r) => r.method === 'DELETE');
      expect(store.jobs().length).toBe(1);
    });

    it('deletes the whole session on the server, clears the list, goes home and says so', () => {
      wipe().click();
      expect(vi.mocked(confirm).mock.calls[0][0]).toContain('cannot be undone');
      const req = deleteReq();
      fixture.detectChanges();
      expect(wipe().disabled).toBe(true); // no second click while it runs
      req.flush(null, { status: 204, statusText: 'No Content' });

      expect(store.jobs()).toEqual([]);
      expect(TestBed.inject(ToastService).toasts().at(-1)).toMatchObject({ kind: 'success', title: 'All your data was deleted' });
      expect(navigate).toHaveBeenCalledWith('/');
      expect(app.deleting()).toBe(false);
      expect(app.popOpen()).toBe(false); // the popover is closed (and, with no transcripts left, gone)

      // the list and the (fresh) session are read again from the server; there are no folders to reload
      ctl.expectOne((r) => r.method === 'GET' && r.url === '/api/jobs').flush([]);
      ctl.expectNone('/api/folders');
      const polls = ctl.match((r) => r.url === '/api/session');
      polls.forEach((p) => p.flush(makeSession({ session_id: 'sess-2' })));
      expect(TestBed.inject(SessionService).ended()).toBe(false); // a new session after a deletion is not "an ended session"
    });

    it('shows the server message and keeps everything when it fails', () => {
      wipe().click();
      deleteReq().flush(...httpError(503, 'The server is busy. Try again in a moment.'));
      expect(store.toast()).toBe('The server is busy. Try again in a moment.');
      expect(store.jobs().length).toBe(1);
      expect(navigate).not.toHaveBeenCalled();
      expect(app.deleting()).toBe(false);
      ctl.match((r) => r.method === 'GET').forEach((r) => r.flush([]));
    });

    it('has a plain message when the server gives none', () => {
      wipe().click();
      deleteReq().flush(...httpError(500));
      expect(store.toast()).toBe('Could not delete your data.');
      ctl.match((r) => r.method === 'GET').forEach((r) => r.flush([]));
    });
  });

  describe('deleting and cancelling transcripts', () => {
    const click = new Event('click');

    it('shows the server message when deleting a running job is refused (409)', () => {
      app.remove(click, makeSummary({ id: 'x', status: 'done' })); // the list was stale: it is really running
      ctl.expectOne((r) => r.method === 'DELETE' && r.url === '/api/jobs/x').flush(...httpError(409, 'Cancel the running job first.'));
      expect(store.toast()).toBe('Cancel the running job first.');
      ctl.expectOne((r) => r.method === 'GET' && r.url === '/api/jobs'); // the list is resynced
    });

    it('cancels a running job (not delete) after asking, and refreshes the list', () => {
      app.remove(click, makeSummary({ id: 'x', title: 'Live', status: 'running' }));
      expect(vi.mocked(confirm).mock.calls[0][0]).toBe('Cancel "Live"?');
      ctl.expectOne('/api/jobs/x/cancel').flush(makeSummary({ id: 'x', status: 'cancelled' }));
      ctl.expectOne((r) => r.method === 'GET' && r.url === '/api/jobs');
      ctl.expectNone((r) => r.method === 'DELETE');
    });

    it('reports a failed cancel', () => {
      app.remove(click, makeSummary({ id: 'x', status: 'running' }));
      ctl.expectOne('/api/jobs/x/cancel').flush(...httpError(500));
      expect(store.toast()).toBe('Could not cancel the transcript.');
    });

    it('removes a deleted transcript from the list', () => {
      store.upsert(makeSummary({ id: 'x' }));
      app.remove(click, makeSummary({ id: 'x' }));
      ctl.expectOne((r) => r.method === 'DELETE' && r.url === '/api/jobs/x').flush(null);
      expect(store.jobs().length).toBe(0);
      expect(store.toast()).toBe('');
    });

    it('does nothing when the user declines the confirmation', () => {
      vi.stubGlobal('confirm', vi.fn(() => false));
      app.remove(click, makeSummary({ id: 'x' }));
      ctl.expectNone((r) => r.method === 'DELETE');
    });

    it('leaves the page of a transcript it deletes, but stays on the page of one it only cancels (that job still exists)', async () => {
      const router = TestBed.inject(Router);
      await router.navigateByUrl('/jobs/x');
      const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

      app.remove(click, makeSummary({ id: 'x', title: 'Live', status: 'running' }));
      ctl.expectOne('/api/jobs/x/cancel').flush(makeSummary({ id: 'x', status: 'cancelled' }));
      expect(navigate).not.toHaveBeenCalled();

      app.remove(click, makeSummary({ id: 'x', title: 'Live', status: 'cancelled' }));
      ctl.expectOne((r) => r.method === 'DELETE' && r.url === '/api/jobs/x').flush(null);
      expect(navigate).toHaveBeenCalledWith('/');
    });
  });
});
