import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { JobsStore } from '../../core/jobs.store';
import { Job } from '../../core/models';
import { SessionService } from '../../core/session.service';
import { ToastService } from '../../core/toast.service';
import { FakeEventSource, httpError, makeBrowserHealth, makeJob, makePublicHealth, makeSession, silentLog } from '../../testing/fakes';
import { EXPORTS, JobPage, fileNameFrom } from './job';
import { TranscriptView } from './transcript';

describe('JobPage', () => {
  let fixture: ComponentFixture<JobPage>;
  let page: JobPage;
  let ctl: HttpTestingController;
  let store: JobsStore;
  let navigate: ReturnType<typeof vi.fn>;

  function setup(id = 'a') {
    TestBed.configureTestingModule({
      providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    ctl = TestBed.inject(HttpTestingController);
    store = TestBed.inject(JobsStore);
    for (const r of ctl.match(() => true)) r.flush(r.request.url.endsWith('/health') ? { status: 'ok' } : []);
    navigate = vi.fn(() => Promise.resolve(true));
    TestBed.inject(Router).navigate = navigate as unknown as Router['navigate'];
    TestBed.inject(Router).navigateByUrl = navigate as unknown as Router['navigateByUrl'];
    fixture = TestBed.createComponent(JobPage);
    page = fixture.componentInstance;
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges(); // runs the effect that starts loading
  }

  function switchTo(id: string) {
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
  }

  const get = (id: string): TestRequest => ctl.expectOne((r) => r.url === `/api/jobs/${id}` && r.method === 'GET');
  const patch = (id: string): TestRequest => ctl.expectOne((r) => r.url === `/api/jobs/${id}` && r.method === 'PATCH');
  const none = (id: string) => ctl.expectNone((r) => r.url === `/api/jobs/${id}` && r.method === 'GET');
  const toasts = () => TestBed.inject(ToastService).toasts();
  const lastToast = () => toasts().at(-1);
  const list = () => fixture.debugElement.query(By.directive(TranscriptView)).componentInstance as TranscriptView;

  beforeEach(() => {
    vi.useFakeTimers();
    FakeEventSource.reset();
    vi.stubGlobal('EventSource', FakeEventSource);
    vi.stubGlobal('confirm', vi.fn(() => true));
    Element.prototype.scrollIntoView = vi.fn();
    history.replaceState(null, '');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    history.replaceState(null, '');
  });

  describe('switching and leaving', () => {
    it('cancels the slow request for the previous job when another one is opened', () => {
      setup('a');
      const slowA = get('a');
      switchTo('b');
      expect(slowA.cancelled).toBe(true);
      get('b').flush(makeJob({ id: 'b', title: 'Job B' }));
      expect(page.job()?.title).toBe('Job B');
      expect(FakeEventSource.instances.length).toBe(0);
    });

    it('closes the live stream of the previous job when another one is opened', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      expect(FakeEventSource.instances.length).toBe(1);
      switchTo('b');
      expect(FakeEventSource.instances[0].closed).toBe(true); // A's stream is closed
      get('b').flush(makeJob({ id: 'b', status: 'done' }));
      expect(page.job()?.id).toBe('b');
      expect(FakeEventSource.instances.length).toBe(1); // nothing new for B (it is done)
    });

    it('cancels the request and never opens a live stream when destroyed while loading', () => {
      setup('a');
      const req = get('a');
      fixture.destroy();
      expect(req.cancelled).toBe(true);
      expect(FakeEventSource.instances.length).toBe(0);
    });

    it('closes the live stream when destroyed', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      fixture.destroy();
      expect(FakeEventSource.instances[0].closed).toBe(true);
    });

    it('follows a running job live, then loads the final transcript when the stream ends', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running', segments: [{ id: 0, start: 0, end: 1, text: 'hi', words: null, confidence: 1 }] }));
      const es = FakeEventSource.instances[0];
      expect(es.url).toBe('/api/jobs/a/events?since=1');
      es.emit('segments', [{ id: 0, start: 0, end: 1, text: 'hi', words: null, confidence: 1 }, { id: 1, start: 1, end: 2, text: 'there', words: null, confidence: 1 }]);
      expect(page.job()?.segments.map((s) => s.id)).toEqual([0, 1]); // the re-sent segment 0 is not duplicated
      es.emit('end', {});
      expect(page.job()).not.toBeNull(); // stays on screen while the final version loads
      get('a').flush(makeJob({ id: 'a', status: 'done' }));
      expect(page.job()?.status).toBe('done');
      expect(FakeEventSource.instances.length).toBe(1);
    });
  });

  describe('retry timers', () => {
    it('reconnects 2 s after the live stream drops, without blanking the page', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      FakeEventSource.instances[0].fail();
      expect(page.job()).not.toBeNull();
      vi.advanceTimersByTime(1999);
      none('a');
      vi.advanceTimersByTime(1);
      expect(page.job()).not.toBeNull(); // soft reload: no "Loading…" flash
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      expect(FakeEventSource.instances.length).toBe(2);
    });

    it('does not reload a destroyed page after the live stream dropped', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      FakeEventSource.instances[0].fail();
      fixture.destroy();
      vi.advanceTimersByTime(10_000);
      none('a');
    });

    it('does not reload the old job after the user switched to another one', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      FakeEventSource.instances[0].fail();
      switchTo('b');
      get('b').flush(makeJob({ id: 'b' }));
      vi.advanceTimersByTime(10_000);
      none('a');
    });
  });

  describe('load errors', () => {
    it('404 means "not found" and is not retried', () => {
      setup('a');
      get('a').flush(...httpError(404, 'Job not found.'));
      expect(page.notFound()).toBe(true);
      expect(page.unreachable()).toBe(false);
      vi.advanceTimersByTime(30_000);
      none('a');
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Transcript not found');
      expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Transcript not found');
      expect(fixture.nativeElement.querySelector('a.btn.primary').getAttribute('href')).toBe('/');
    });

    it.each([
      ['an unreachable server (status 0)', 0],
      ['a server error (500)', 500],
      ['a bad gateway (502)', 502],
    ])('%s is not "not found": it shows "Cannot reach the server" and retries every 3 s', (_label, status) => {
      setup('a');
      const fail = (r: TestRequest) => (status === 0 ? r.error(new ProgressEvent('error')) : r.flush(...httpError(status)));
      fail(get('a'));
      expect(page.notFound()).toBe(false);
      expect(page.unreachable()).toBe(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Cannot reach the server');
      expect(fixture.nativeElement.textContent).not.toContain('not found');

      vi.advanceTimersByTime(2999);
      none('a');
      vi.advanceTimersByTime(1);
      fail(get('a')); // still down: another try 3 s later
      vi.advanceTimersByTime(3000);
      get('a').flush(makeJob({ id: 'a', title: 'Back again' })); // server is back
      expect(page.job()?.title).toBe('Back again');
      expect(page.unreachable()).toBe(false);
      expect(page.notFound()).toBe(false);
    });

    it.each([
      ['429', 429, 'Too many requests. Please slow down.'],
      ['a 503 that explains itself', 503, 'The server is full.'],
    ])('%s is not "not found": it shows the server message and retries after 5 s', (_label, status, detail) => {
      setup('a');
      get('a').flush(...httpError(status, detail));
      expect(page.notFound()).toBe(false);
      expect(page.busy()).toBe(detail);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('The server is busy');
      expect(fixture.nativeElement.textContent).toContain(detail);
      expect(fixture.nativeElement.textContent).not.toContain('not found');
      ctl.expectNone((r) => r.url === '/api/session');

      vi.advanceTimersByTime(4999);
      none('a');
      vi.advanceTimersByTime(1);
      get('a').flush(makeJob({ id: 'a', title: 'Back again' }));
      expect(page.job()?.title).toBe('Back again');
      expect(page.busy()).toBe('');
    });

    it('a 429 while a transcript is on screen keeps it there and tells the user once, as a warning', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      FakeEventSource.instances[0].fail();
      vi.advanceTimersByTime(2000);
      get('a').flush(...httpError(429, 'Slow down.'));
      expect(page.job()).not.toBeNull();
      expect(store.toast()).toBe('Slow down.');
      expect(lastToast()).toMatchObject({ kind: 'warning', title: 'Server busy' });
      expect(page.busy()).toBe('');
      vi.advanceTimersByTime(5000);
      get('a').flush(...httpError(429, 'Slow down.'));
      expect(toasts().length).toBe(1); // not repeated for every retry
    });

    it('stops retrying once the page is destroyed', () => {
      setup('a');
      get('a').error(new ProgressEvent('error'));
      fixture.destroy();
      vi.advanceTimersByTime(30_000);
      none('a');
    });

    it('stops retrying once the user opened another job, and that job loads normally', () => {
      setup('a');
      get('a').error(new ProgressEvent('error'));
      switchTo('b');
      get('b').flush(makeJob({ id: 'b' }));
      expect(page.unreachable()).toBe(false);
      vi.advanceTimersByTime(30_000);
      none('a');
    });

    it('a job already on screen that is deleted meanwhile becomes "not found"', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      FakeEventSource.instances[0].fail();
      vi.advanceTimersByTime(2000);
      get('a').flush(...httpError(404, 'Job not found.'));
      expect(page.notFound()).toBe(true);
      expect(page.job()).toBeNull();
    });
  });

  describe('a transcript that is gone on the public site', () => {
    const sessionReq = () => ctl.expectOne((r) => r.url === '/api/session');
    const healthReq = () => ctl.expectOne((r) => r.url === '/api/health');
    const text = () => (fixture.nativeElement.textContent as string).replace(/\s+/g, ' ');

    /** A public site whose visitor has the session "a". */
    function publicSite() {
      setup('a');
      store.health.set(makePublicHealth({ session_id: 'run-1' }));
      TestBed.tick(); // the session service starts polling
      sessionReq().flush(makeSession({ session_id: 'a' }));
    }

    it('says the session has ended when the visitor now has a different session', () => {
      publicSite();
      get('a').flush(...httpError(404, 'Job not found.'));
      expect(page.notFound()).toBe(false);
      fixture.detectChanges();
      expect(text()).toContain('Loading…'); // while the server is asked
      sessionReq().flush(makeSession({ session_id: 'b' }));
      healthReq().flush(makePublicHealth({ session_id: 'run-1' }));
      fixture.detectChanges();
      expect(page.sessionEnded()).toBe(true);
      expect(page.notFound()).toBe(false);
      expect(text()).toContain('Your session has ended');
      expect(text()).toContain('Its data was deleted');
      expect(text()).not.toContain('not found');
    });

    it('says the session has ended when the server was restarted (a new run id in the health)', () => {
      publicSite();
      get('a').flush(...httpError(404, 'Job not found.'));
      sessionReq().flush(makeSession({ session_id: 'a' }));
      healthReq().flush(makePublicHealth({ session_id: 'run-2' }));
      expect(page.sessionEnded()).toBe(true);
    });

    it('is plain "not found" when the session is the same (the transcript was deleted), with a hint about sessions', () => {
      publicSite();
      get('a').flush(...httpError(404, 'Job not found.'));
      sessionReq().flush(makeSession({ session_id: 'a' }));
      healthReq().flush(makePublicHealth({ session_id: 'run-1' }));
      fixture.detectChanges();
      expect(page.notFound()).toBe(true);
      expect(page.sessionEnded()).toBe(false);
      expect(text()).toContain('Transcript not found');
      expect(text()).toContain('Transcripts are only kept for the browser session that created them.');
    });

    it('falls back to "not found" when the session cannot be checked', () => {
      publicSite();
      get('a').flush(...httpError(404, 'Job not found.'));
      sessionReq().flush(...httpError(500));
      expect(page.notFound()).toBe(true);
    });

    it('does not ask anything on a local install: 404 is simply "not found"', () => {
      setup('a');
      get('a').flush(...httpError(404, 'Job not found.'));
      expect(page.notFound()).toBe(true);
      ctl.expectNone((r) => r.url === '/api/session');
      fixture.detectChanges();
      expect(text()).not.toContain('browser session');
    });

    it('replaces a transcript that is on screen when the periodic check finds the session gone', () => {
      publicSite();
      get('a').flush(makeJob({ id: 'a', title: 'Interview' }));
      fixture.detectChanges();
      expect(page.job()).not.toBeNull();
      vi.advanceTimersByTime(60_000);
      sessionReq().flush(makeSession({ session_id: 'b' }));
      expect(TestBed.inject(SessionService).ended()).toBe(true);
      fixture.detectChanges(); // the page notices
      expect(page.job()).toBeNull();
      expect(page.sessionEnded()).toBe(true);
      expect(text()).toContain('Your session has ended');
    });

    it('a new transcript opened after the session ended loads normally', () => {
      publicSite();
      get('a').flush(makeJob({ id: 'a' }));
      vi.advanceTimersByTime(60_000);
      sessionReq().flush(makeSession({ session_id: 'b' }));
      fixture.detectChanges();
      expect(page.sessionEnded()).toBe(true);
      switchTo('c');
      get('c').flush(makeJob({ id: 'c', title: 'Fresh' }));
      fixture.detectChanges();
      expect(page.sessionEnded()).toBe(false);
      expect(page.job()?.title).toBe('Fresh');
    });
  });

  describe('page title and re-run models', () => {
    const meta = (sel: string) => document.head.querySelector<HTMLMetaElement>(sel)?.content;

    it('is titled with the transcript name, and kept out of search results', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', title: 'Quarterly call' }));
      expect(document.title).toBe('Quarterly call - TranscribeVid');
      expect(meta('meta[name="robots"]')).toBe('noindex, nofollow');
    });

    it('follows a rename', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', title: 'Old name' }));
      page.startRename();
      page.titleDraft = 'New name';
      page.finishRename(true);
      patch('a').flush(makeJob({ id: 'a', title: 'New name' }));
      expect(document.title).toBe('New name - TranscribeVid');
    });

    it('offers only the allowed models for a re-run', () => {
      setup('a');
      const model = (id: string) => ({ id, label: id, size_mb: 100, speed: 1, accuracy: 1, note: '', downloaded: true });
      store.models.set([model('base'), model('small'), model('large-v3')]);
      store.health.set(makePublicHealth({ allowed_models: ['small', 'base'] }));
      get('a').flush(makeJob({ id: 'a', status: 'done' }));
      page.menu.set('rerun');
      fixture.detectChanges();
      const options = Array.from(fixture.nativeElement.querySelectorAll('#rm option')).map((o) => (o as HTMLOptionElement).value);
      expect(options).toEqual(['base', 'small']);
    });

    it('a refresh of the same job keeps the quality and language the user picked in the re-run form', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      page.rerunModel = 'medium';
      FakeEventSource.instances[0].fail();
      vi.advanceTimersByTime(2000);
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      expect(page.rerunModel).toBe('medium');
    });
  });

  // ====================================================================================================
  // toasts: one short message for every result of an action
  // ====================================================================================================
  describe('"Upload complete" toast (instead of a banner)', () => {
    it('is said once when the page is opened straight from the upload, and cleared from the history so F5 does not repeat it', () => {
      history.replaceState({ navigationId: 7, justUploaded: 2 }, '');
      setup('a');
      expect(page.justUploaded()).toBe(2);
      expect(history.state).toMatchObject({ navigationId: 7 }); // the router's own entry is kept
      expect(history.state.justUploaded).toBeUndefined();
      // F5: a new page instance reads the same history entry
      const reloaded = TestBed.createComponent(JobPage).componentInstance;
      expect(reloaded.justUploaded()).toBe(0);
    });

    it('says the transcription has started (one file), and is not repeated when the job refreshes itself', () => {
      history.replaceState({ justUploaded: 1 }, '');
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      expect(toasts()).toEqual([expect.objectContaining({ kind: 'success', title: 'Upload complete', message: 'Transcription has started. The text appears below as it is recognised.' })]);
      expect(fixture.nativeElement.querySelector('.success')).toBeNull(); // no banner any more
      FakeEventSource.instances[0].fail();
      vi.advanceTimersByTime(2000);
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      expect(toasts().length).toBe(1);
    });

    it('points at the other files when several were uploaded', () => {
      history.replaceState({ justUploaded: 3 }, '');
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'queued' }));
      expect(lastToast()?.message).toContain('Your other files are under Transcripts');
    });

    it('says the transcript is ready when it already is', () => {
      history.replaceState({ justUploaded: 1 }, '');
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'done' }));
      expect(lastToast()).toMatchObject({ kind: 'success', title: 'Upload complete', message: 'Your transcript is ready below.' });
    });

    it('says nothing for a failed transcription (the page shows the failure itself)', () => {
      history.replaceState({ justUploaded: 1 }, '');
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'error', error: 'x' }));
      expect(toasts()).toEqual([]);
    });

    it('is not shown when the page was not opened by an upload', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      expect(page.justUploaded()).toBe(0);
      expect(toasts()).toEqual([]);
    });

    it('is not shown for another job opened before the first one answered', () => {
      history.replaceState({ justUploaded: 1 }, '');
      setup('a');
      switchTo('b');
      expect(page.justUploaded()).toBe(0);
      get('b').flush(makeJob({ id: 'b', status: 'running' }));
      expect(toasts()).toEqual([]);
    });
  });

  describe('"Transcript ready" toast', () => {
    it('is said when a transcription that was running on this page finishes', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      const es = FakeEventSource.instances[0];
      es.emit('job', { ...makeJob({ id: 'a', status: 'done' }), segments: undefined });
      es.emit('end', {});
      get('a').flush(makeJob({ id: 'a', status: 'done' }));
      expect(toasts()).toEqual([expect.objectContaining({ kind: 'success', title: 'Transcript ready' })]);
    });

    it('is not said for a transcript that was already finished when it was opened', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'done' }));
      expect(toasts()).toEqual([]);
    });

    it('is not said when the transcription failed or was cancelled', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', status: 'running' }));
      FakeEventSource.instances[0].emit('end', {});
      get('a').flush(makeJob({ id: 'a', status: 'error', error: 'broken' }));
      expect(toasts()).toEqual([]);
    });
  });

  describe('results of actions are not applied to a different job', () => {
    it('a slow save of job A does not overwrite job B', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', title: 'A' }));
      page.save([{ id: 1, text: 'changed' }]);
      expect(page.saving()).toBe(true);
      const savingA = patch('a');
      switchTo('b');
      get('b').flush(makeJob({ id: 'b', title: 'B' }));
      savingA.flush(makeJob({ id: 'a', title: 'A (edited)' }));
      expect(page.job()?.title).toBe('B');
      expect(page.saving()).toBe(false);
    });

    it('a slow rename of job A does not rename job B', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', title: 'A' }));
      page.startRename();
      page.titleDraft = 'A2';
      page.finishRename(true);
      const renameA = patch('a');
      expect(renameA.request.body).toEqual({ title: 'A2' });
      switchTo('b');
      get('b').flush(makeJob({ id: 'b', title: 'B' }));
      renameA.flush(makeJob({ id: 'a', title: 'A2' }));
      expect(page.job()?.title).toBe('B');
    });

    it('a re-run started from job A does not pull the user back after they moved on', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a' }));
      page.rerun();
      const rerun = ctl.expectOne('/api/jobs/a/rerun');
      switchTo('b');
      get('b').flush(makeJob({ id: 'b' }));
      rerun.flush(makeJob({ id: 'new', status: 'queued' }));
      expect(navigate).not.toHaveBeenCalled();
      expect(store.jobs().map((j) => j.id)).toContain('new'); // but it is in the history
    });

    it('a re-run navigates to the new job when the user is still here', () => {
      setup('a');
      get('a').flush(makeJob({ id: 'a' }));
      page.rerun();
      ctl.expectOne('/api/jobs/a/rerun').flush(makeJob({ id: 'new', status: 'queued' }));
      expect(navigate).toHaveBeenCalledWith(['/jobs', 'new']);
    });
  });

  describe('every action says how it went', () => {
    beforeEach(() => {
      setup('a');
      get('a').flush(makeJob({ id: 'a', title: 'A', segments: [{ id: 1, start: 0, end: 1, text: 'one', words: null, confidence: 0.9 }] }));
    });

    it('rename: "Renamed"; a failure says "Not renamed" with the server message and puts the old name back', () => {
      page.startRename();
      page.titleDraft = 'New name';
      page.finishRename(true);
      expect(page.job()?.title).toBe('New name'); // shown at once
      patch('a').flush(...httpError(400, 'Title is too long.'));
      expect(store.toast()).toBe('Title is too long.');
      expect(lastToast()).toMatchObject({ kind: 'error', title: 'Not renamed' });
      expect(page.job()?.title).toBe('A');
      expect(document.title).toBe('A - TranscribeVid');

      page.startRename();
      page.titleDraft = '  Board call ';
      page.finishRename(true);
      patch('a').flush(makeJob({ id: 'a', title: 'Board call' }));
      expect(lastToast()).toMatchObject({ kind: 'success', title: 'Renamed', message: 'It is now called “Board call”.' });
    });

    it('rename to an empty name: nothing is sent, the old name stays, and a warning says why', () => {
      page.startRename();
      page.titleDraft = '   ';
      page.finishRename(true);
      ctl.expectNone((r) => r.method === 'PATCH');
      expect(page.job()?.title).toBe('A');
      expect(lastToast()).toMatchObject({ kind: 'warning', title: 'Name not changed' });
    });

    it('rename: Enter followed by the blur of the closing box sends one request', () => {
      page.startRename();
      page.titleDraft = 'B';
      page.finishRename(true);
      page.finishRename(true); // blur
      expect(ctl.match((r) => r.method === 'PATCH').length).toBe(1);
    });

    it('save: "Saved"; a failure says "Not saved"', () => {
      page.save([{ id: 1, text: 'x' }]);
      patch('a').flush(makeJob({ id: 'a', segments: [{ id: 1, start: 0, end: 1, text: 'x', words: null, confidence: 0.9, edited: true }] }));
      expect(lastToast()).toMatchObject({ kind: 'success', title: 'Saved' });
      page.save([{ id: 1, text: 'y' }]);
      patch('a').flush(...httpError(500));
      expect(store.toast()).toBe('Your change is still in its box: press Save to try again.');
      expect(lastToast()).toMatchObject({ kind: 'error', title: 'Not saved' });
      expect(page.saving()).toBe(false);
      page.save([
        { id: 1, text: 'a' },
        { id: 2, text: 'b' },
      ]);
      patch('a').flush(...httpError(500));
      expect(store.toast()).toBe('Could not save the change.'); // a replace-all is not reopened anywhere
      page.save([{ id: 1, text: 'z' }]);
      patch('a').flush(...httpError(409, 'This transcript is being re-transcribed.'));
      expect(store.toast()).toBe('This transcript is being re-transcribed.'); // the server's own reason wins
    });

    it('a deleted line says "Line deleted", a replace in several lines says "Replaced"', () => {
      page.save([{ id: 1, text: 'one', deleted: true }]);
      patch('a').flush(makeJob({ id: 'a' }));
      expect(lastToast()).toMatchObject({ kind: 'success', title: 'Line deleted' });
      page.save([
        { id: 1, text: 'a' },
        { id: 2, text: 'b' },
      ]);
      patch('a').flush(makeJob({ id: 'a' }));
      expect(lastToast()).toMatchObject({ kind: 'success', title: 'Replaced', message: 'Changed in 2 lines.' });
    });

    it('re-run: "Started again"; a failure shows only the first line of a multi-line validation message', () => {
      page.rerun();
      ctl.expectOne('/api/jobs/a/rerun').flush(...httpError(422, [{ msg: 'Model "x" is not available.\nTry one of: base, small' }]));
      expect(store.toast()).toBe('Model "x" is not available.');
      expect(lastToast()).toMatchObject({ kind: 'error', title: 'Could not start' });
      expect(navigate).not.toHaveBeenCalled();
      expect(page.rerunning()).toBe(false);
      page.rerun();
      ctl.expectOne('/api/jobs/a/rerun').flush(makeJob({ id: 'new', status: 'queued' }));
      expect(lastToast()).toMatchObject({ kind: 'success', title: 'Started again' });
    });

    it('re-run: a second press while the first is on its way sends nothing', () => {
      page.rerun();
      page.rerun();
      expect(ctl.match('/api/jobs/a/rerun').length).toBe(1);
    });

    it('cancel: asks first, then says "Cancelled"; a failure shows the server message', () => {
      page.cancel();
      expect(vi.mocked(confirm).mock.calls[0][0]).toBe('Stop this transcription? The text found so far is kept.');
      ctl.expectOne('/api/jobs/a/cancel').flush(...httpError(409, 'Job already finished.'));
      expect(store.toast()).toBe('Job already finished.');
      expect(lastToast()).toMatchObject({ kind: 'error', title: 'Not cancelled' });
      page.cancel();
      ctl.expectOne('/api/jobs/a/cancel').flush(makeJob({ id: 'a', status: 'cancelled', segments: undefined }));
      expect(lastToast()).toMatchObject({ kind: 'info', title: 'Cancelled' });
      expect(page.job()?.status).toBe('cancelled'); // at once, not after the next refresh
      expect(page.job()?.segments.length).toBe(1); // the text so far stays
    });

    it('cancel: nothing happens when the question is answered "no"', () => {
      vi.mocked(confirm).mockReturnValueOnce(false);
      page.cancel();
      ctl.expectNone('/api/jobs/a/cancel');
    });

    it('keeps Cancelling visible until the backend reports a terminal state', () => {
      page.cancel();
      ctl.expectOne('/api/jobs/a/cancel').flush(makeJob({ id: 'a', status: 'running', cancel_requested: true }));
      expect(page.cancelling()).toBe(true);
      expect(lastToast()).toMatchObject({ title: 'Cancellation requested' });
      expect(page.job()?.status).toBe('running');
      (page as any).afterStatus(makeJob({ id: 'a', status: 'cancelled' }));
      expect(page.cancelling()).toBe(false);
      expect(lastToast()).toMatchObject({ title: 'Cancelled' });
    });

    it('applies script changes to saved recognition without starting another transcription', () => {
      page.rerunOutputScript = 'original';
      page.applyStyle();
      expect(page.restyling()).toBe(true);
      const req = patch('a');
      expect(req.request.body).toEqual({ output_script: 'original', romanizer: 'auto' });
      req.flush(makeJob({ id: 'a' }));
      expect(page.restyling()).toBe(false);
      ctl.expectNone('/api/jobs/a/rerun');
    });

    it('delete: shows the server message and stays on the page', () => {
      page.remove();
      ctl.expectOne((r) => r.method === 'DELETE' && r.url === '/api/jobs/a').flush(...httpError(409, 'Cancel the running job first.'));
      expect(store.toast()).toBe('Cancel the running job first.');
      expect(lastToast()).toMatchObject({ kind: 'error', title: 'Not deleted' });
      expect(navigate).not.toHaveBeenCalled();
      expect(page.deleting()).toBe(false);
    });

    it('delete: asks once, says "Deleted" and goes home, replacing this page in the history (Back does not lead to it)', () => {
      page.remove();
      expect(confirm).toHaveBeenCalledTimes(1);
      expect(vi.mocked(confirm).mock.calls[0][0]).toBe('Delete "A"? This cannot be undone.');
      page.remove(); // a second press while it is on its way
      ctl.expectOne((r) => r.method === 'DELETE' && r.url === '/api/jobs/a').flush(null);
      expect(navigate).toHaveBeenCalledWith('/', { replaceUrl: true });
      expect(store.jobs().some((j) => j.id === 'a')).toBe(false);
      expect(lastToast()).toMatchObject({ kind: 'success', title: 'Deleted', message: '“A” was deleted.' });
    });

    it('delete: nothing happens when the question is answered "no"', () => {
      vi.mocked(confirm).mockReturnValueOnce(false);
      page.remove();
      ctl.expectNone((r) => r.method === 'DELETE');
    });
  });

  // ====================================================================================================
  // what the page shows
  // ====================================================================================================
  describe('what the page shows', () => {
    const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
    const qa = (sel: string) => Array.from(fixture.nativeElement.querySelectorAll(sel)) as HTMLElement[];
    const clean = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
    const stats = (over: Partial<NonNullable<Job['stats']>> = {}): NonNullable<Job['stats']> => ({
      word_count: 321,
      segment_count: 2,
      speech_seconds: 100,
      words_per_minute: 150,
      avg_confidence: 0.9,
      low_confidence_segments: 0,
      keywords: [],
      ...over,
    });
    const line = (id: number, start: number, text: string) => ({ id, start, end: start + 1, text, words: null, confidence: 0.9 });

    /** Opens job "a" with these properties and draws the page. */
    function show(over: Partial<Job> = {}, languages: { code: string; name: string }[] = []) {
      setup('a');
      store.languages.set(languages);
      get('a').flush(makeJob({ id: 'a', status: 'done', segments: [line(0, 0, 'hello'), line(1, 2, 'world')], ...over }));
      fixture.detectChanges();
    }

    beforeEach(() => {
      HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
    });

    describe('language recovery', () => {
      it('shows audio review signals even when word confidence is unavailable', () => {
        const segment = { ...makeJob().segments[0], review_reasons: ['boundary_retry'], confidence: null };
        show({ segments: [segment], language_probability: null, stats: null });
        expect(clean(q('.quality-review'))).toContain('uncertain speech boundary');
      });

      it('does not keep a review warning after the user has corrected that passage', () => {
        const segment = { ...makeJob().segments[0], review_reasons: ['repeated_phrase'], edited: true };
        show({ segments: [segment], language_probability: null, stats: null });
        expect(q('.quality-review')).toBeNull();
      });

      it('keeps Auto on retry even when the previous detection was confidently wrong', () => {
        show({ language: 'hi', language_probability: 0.988, stats: stats({ avg_confidence: 0.38 }) });
        expect(page.rerunLanguage).toBeNull();
        expect(clean(q('.quality-review'))).toContain('low model confidence');
        page.rerun();
        const req = ctl.expectOne('/api/jobs/a/rerun');
        expect(req.request.body.language).toBeNull();
        expect(req.request.body.output_script).toBe('original'); // the job's own style (the default now)
        req.flush(makeJob({ id: 'new', status: 'queued' }));
      });

      it('keeps an explicit language instead of replacing it with the detected language', () => {
        show({ language: 'hi', options: { ...makeJob().options, language: 'en' } });
        expect(page.rerunLanguage).toBe('en');
      });

      it('preserves an explicit original-script preference on retry', () => {
        show({ options: { ...makeJob().options, output_script: 'original' } });
        expect(page.rerunOutputScript).toBe('original');
        page.rerun();
        const req = ctl.expectOne('/api/jobs/a/rerun');
        expect(req.request.body.output_script).toBe('original');
        req.flush(makeJob({ id: 'new', status: 'queued' }));
      });

      it('opens a usable recovery form without starting a job or downloading a model', () => {
        show({ language: 'hi', stats: stats({ avg_confidence: 0.38 }) }, [{ code: 'en', name: 'English' }]);
        (q('.quality-review button') as HTMLButtonElement).click();
        fixture.detectChanges();
        expect(page.menu()).toBe('rerun'); // survives the bubbling document click
        expect(q('.menu.rerun')).not.toBeNull();
        vi.advanceTimersByTime(1);
        expect(document.activeElement?.id).toBe('rl');
        ctl.expectNone('/api/jobs/a/rerun');
        const language = q('#rl') as HTMLSelectElement;
        language.selectedIndex = 1;
        language.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        expect(page.rerunLanguage).toBe('en');
        (q('.rerun-actions .primary') as HTMLButtonElement).click();
        const req = ctl.expectOne('/api/jobs/a/rerun');
        expect(req.request.body.language).toBe('en');
        req.flush(makeJob({ id: 'new', status: 'queued' }));
      });

      it('asks for language review when auto detection is uncertain despite good word confidence', () => {
        show({ language_probability: 0.55, stats: stats() });
        expect(clean(q('.quality-review'))).toContain('could not be identified confidently');
      });

      it.each(['running', 'queued', 'error', 'cancelled'] as const)('does not show quality recovery for a %s job', (status) => {
        show({ status, stats: stats({ avg_confidence: 0.38 }) });
        expect(q('.quality-review')).toBeNull();
      });

      it('does not warn for a confident completed transcript', () => {
        show({ language_probability: 0.99, stats: stats() });
        expect(q('.quality-review')).toBeNull();
      });

      it('does not treat missing confidence as zero', () => {
        show({ language_probability: null, stats: null });
        expect(q('.quality-review')).toBeNull();
      });

      it('does not flag detection confidence when the user explicitly selected a language', () => {
        show({ options: { ...makeJob().options, language: 'en' }, language_probability: 0.4, stats: stats() });
        expect(q('.quality-review')).toBeNull();
      });

      it('offers recovery when decoding finishes without any transcript', () => {
        show({ segments: [] });
        expect(clean(q('.quality-review'))).toContain('No speech was transcribed');
      });
    });

    describe('the name and the one line of facts', () => {
      const facts = () => qa('p.facts > span').map((s) => clean(s));

      it('shows the name as the one h1, with a rename button', () => {
        show({ title: 'Quarterly call' });
        expect(qa('h1').length).toBe(1);
        expect(clean(q('h1'))).toBe('Quarterly call');
        expect(q('button.rename')!.getAttribute('aria-label')).toBe('Rename');
      });

      it('language, length, words and how sure: one quiet line of text (no pills, no tiles)', () => {
        show({ language: 'en', duration: 125, stats: stats() }, [{ code: 'en', name: 'English' }]);
        expect(facts()).toEqual(['English', 'Length 02:05', 'Transcribed in 01:40', '321 words', '90% model confidence']);
        expect(qa('p.facts [class*="tint-"]')).toEqual([]);
        expect(q('.stats')).toBeNull();
        expect(q('dl')).toBeNull();
      });

      it('rounds the confidence and counts words in the singular too', () => {
        show({ language: null, duration: null, stats: stats({ word_count: 1, avg_confidence: 0.876 }) });
        expect(facts()).toEqual(['Transcribed in 01:40', '1 word', '88% model confidence']);
      });

      it('names the language by its code when the server has no name for it', () => {
        show({ language: 'xx', duration: null }, [{ code: 'en', name: 'English' }]);
        expect(facts()).toEqual(['XX', 'Transcribed in 01:40']);
      });

      it('leaves out what is not known, and the whole line when nothing is', () => {
        show({ language: null, duration: null, stats: stats({ avg_confidence: null }) });
        expect(facts()).toEqual(['Transcribed in 01:40', '321 words']);
        TestBed.resetTestingModule();
        show({ language: null, duration: null, stats: null, started_at: null });
        expect(q('p.facts')).toBeNull();
      });

      it('says "→ English" when the transcript was translated', () => {
        show({ language: 'de', duration: null, options: { ...makeJob().options, task: 'translate' } }, [{ code: 'de', name: 'German' }]);
        expect(facts()).toEqual(['German → English', 'Transcribed in 01:40']);
      });

      it('never shows "English → English" (translating English into English is just English)', () => {
        show({ language: 'en', duration: null, options: { ...makeJob().options, task: 'translate' } }, [{ code: 'en', name: 'English' }]);
        expect(facts()).toEqual(['English', 'Transcribed in 01:40']);
      });

      it('has the file name as the tooltip of the line', () => {
        show({ filename: 'interview.mp4' });
        expect(q('p.facts')!.getAttribute('title')).toBe('interview.mp4');
      });

      it('has no list of frequent terms and no "worth a second look" box any more (the underlines say it)', () => {
        show({ stats: stats({ low_confidence_segments: 3, keywords: [{ word: 'budget', count: 7 }] }) });
        expect(q('details.terms')).toBeNull();
        expect(q('.review')).toBeNull();
      });
    });

    describe('the media and the transcript next to it', () => {
      it('a video gets a video player and a speed list; a transcript without media gets neither', () => {
        show({ media_kind: 'video', media_url: '/media/a.mp4' });
        expect(q('.player video')!.getAttribute('src')).toBe('/media/a.mp4');
        expect(q('.player video')!.hasAttribute('playsinline')).toBe(true);
        expect(q('.player audio')).toBeNull();
        expect(qa('.player .speed option').map((o) => clean(o))).toEqual(['0.75×', 'Normal', '1.25×', '1.5×', '2×']);
        expect(q('.cols')!.classList.contains('with-video')).toBe(true);
        TestBed.resetTestingModule();
        show({ media_url: null, stats: null });
        expect(q('.player')).toBeNull();
        expect(q('.cols')!.classList.contains('with-video')).toBe(false);
        expect(q('.cols')!.classList.contains('with-audio')).toBe(false);
      });

      it('audio gets an audio player (laid out above the text, not in a side column)', () => {
        show({ media_kind: 'audio', media_url: '/media/a.mp3' });
        expect(q('.player audio')!.getAttribute('src')).toBe('/media/a.mp3');
        expect(q('.player video')).toBeNull();
        expect(q('.cols')!.classList.contains('with-audio')).toBe(true);
      });

      it('the speed list changes the speed of the player and shows the chosen one', () => {
        show({ media_kind: 'video', media_url: '/media/a.mp4' });
        const video = q('.player video') as HTMLVideoElement;
        const select = q('.speed select') as HTMLSelectElement;
        expect(select.getAttribute('aria-label')).toBe('Playback speed');
        expect(select.options[select.selectedIndex].textContent!.trim()).toBe('Normal');
        select.value = '1.5';
        select.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        expect(video.playbackRate).toBe(1.5);
        expect(page.speed()).toBe(1.5);
        expect(select.options[select.selectedIndex].textContent!.trim()).toBe('1.5×');
      });

      it('a speed changed in the audio player itself is followed too (the audio player missed it)', () => {
        show({ media_kind: 'audio', media_url: '/media/a.mp3' });
        const audio = q('.player audio') as HTMLAudioElement;
        audio.playbackRate = 2;
        audio.dispatchEvent(new Event('ratechange'));
        expect(page.speed()).toBe(2);
      });

      it('ignores a speed that is not offered', () => {
        show({ media_kind: 'video', media_url: '/media/a.mp4' });
        page.setSpeed(9);
        expect(page.speed()).toBe(1);
      });

      it('pressing a time in the transcript plays the media from there', () => {
        show({ media_kind: 'video', media_url: '/media/a.mp4', segments: [line(0, 0, 'hello'), line(1, 12, 'world')] });
        const video = q('.player video') as HTMLVideoElement;
        (qa('.seg button.ts')[1] as HTMLButtonElement).click();
        expect(video.currentTime).toBe(12);
        expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
      });

      it('passes the line under the playhead (activeSegment), not the running clock, to the transcript', () => {
        show({ media_kind: 'video', media_url: '/media/a.mp4', segments: [line(10, 0, 'a'), line(11, 2, 'b'), line(12, 5, 'c')] });
        const video = q('.player video') as HTMLVideoElement;
        const tick = (t: number) => {
          Object.defineProperty(video, 'currentTime', { value: t, configurable: true });
          video.dispatchEvent(new Event('timeupdate'));
          fixture.detectChanges();
        };
        expect(list().activeSegment()).toBeNull();
        tick(0.5);
        expect(page.time()).toBe(0.5);
        expect(list().activeSegment()).toBe(10);
        tick(1.0);
        expect(list().activeSegment()).toBe(10);
        tick(3);
        expect(list().activeSegment()).toBe(11);
        tick(8.5);
        expect(list().activeSegment()).toBeNull(); // after the last line
        expect(list().time()).toBe(0); // the clock itself is not handed down: the list is not re-checked on every tick
      });

      it('activeSeg changes only when the line changes, not at every tick of the clock', () => {
        show({ segments: [line(10, 0, 'a'), line(11, 2, 'b')] });
        const seen = new Set<number | null>();
        for (const t of [0.1, 0.4, 0.9, 1.2, 1.5]) {
          page.time.set(t);
          seen.add(page.activeSeg());
        }
        expect([...seen]).toEqual([10]);
      });

      it('"Follow playback" is offered only while the media plays', () => {
        show({ media_kind: 'video', media_url: '/media/a.mp4' });
        expect(q('.follow-bar')).toBeNull();
        const video = q('.player video') as HTMLVideoElement;
        video.dispatchEvent(new Event('play'));
        fixture.detectChanges();
        expect(page.playing()).toBe(true);
        expect(q('.follow-bar')).not.toBeNull();
        video.dispatchEvent(new Event('pause'));
        fixture.detectChanges();
        expect(q('.follow-bar')).toBeNull();
      });
    });

    describe('the buttons of a finished transcript', () => {
      const button = (text: string) => qa('.actions button').find((b) => clean(b).includes(text)) as HTMLButtonElement;

      it('has Export (the one main button), Copy and More only when the transcript is done', () => {
        show({ status: 'done' });
        expect(clean(q('.actions'))).toContain('Export');
        expect(clean(q('.actions'))).toContain('Copy text');
        expect(clean(q('.actions'))).toContain('More');
        expect(qa('.actions .btn.primary').map((b) => clean(b))).toEqual(['Export']);
        TestBed.resetTestingModule();
        show({ status: 'running', phase: 'transcribing', progress: 0.1 });
        expect(q('.actions')).toBeNull();
      });

      it('without any text there is nothing to export or copy: only More (to re-transcribe or delete)', () => {
        show({ status: 'done', segments: [] });
        expect(button('Export')).toBeUndefined();
        expect(button('Copy')).toBeUndefined();
        expect(button('More')).toBeDefined();
      });

      it('the Export menu offers seven formats, most wanted first, with a hint each, and a subtitle line length', () => {
        show({});
        button('Export').click();
        fixture.detectChanges();
        const items = qa('.menu[role="menu"] button[role="menuitem"]');
        expect(items.map((b) => clean(b.querySelector('b')))).toEqual([
          'PDF document (.pdf)',
          'Plain text (.txt)',
          'Text with times (.txt)',
          'Subtitles (.srt)',
          'Web subtitles (.vtt)',
          'Markdown (.md)',
          'JSON (.json)',
        ]);
        expect(items.every((b) => clean(b.querySelector('span')) !== '')).toBe(true);
        expect(qa('.menu-opt option').map((o) => clean(o))).toEqual(['Short (32 letters)', 'Standard (42 letters)', 'Long (56 letters)']);
      });

      it('the browser edition also offers a Word file, right after PDF (the server has no Word export)', () => {
        show({});
        store.health.set(makeBrowserHealth());
        fixture.detectChanges();
        button('Export').click();
        fixture.detectChanges();
        const items = qa('.menu[role="menu"] button[role="menuitem"]');
        expect(items.slice(0, 3).map((b) => clean(b.querySelector('b')))).toEqual(['PDF document (.pdf)', 'Word document (.docx)', 'Plain text (.txt)']);
        expect(clean(items[1].querySelector('span'))).toBe('Opens in Word and Google Docs');
        expect(items.length).toBe(8);
      });

      describe('downloading a format', () => {
        let saved: { href: string; name: string }[];
        let click: ReturnType<typeof vi.spyOn>;
        beforeEach(() => {
          saved = [];
          URL.createObjectURL = vi.fn(() => 'blob:file');
          URL.revokeObjectURL = vi.fn();
          click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
            saved.push({ href: this.getAttribute('href')!, name: this.download });
          });
        });
        afterEach(() => click.mockRestore());

        it('fetches the file with the chosen line length (subtitles only), saves it under the server name, and says so once', () => {
          show({ title: 'My call' });
          page.subtitleChars = 56;
          button('Export').click();
          fixture.detectChanges();
          (qa('.menu[role="menu"] button[role="menuitem"]').find((b) => clean(b).includes('Subtitles (.srt)')) as HTMLButtonElement).click();
          expect(page.menu()).toBeNull(); // the menu closes at once
          fixture.detectChanges();
          expect(clean(button('Preparing'))).toBe('Preparing…');
          expect(button('Preparing').disabled).toBe(true);
          const req = ctl.expectOne('/api/jobs/a/export?format=srt&max_chars=56');
          expect(req.request.responseType).toBe('blob');
          req.flush(new Blob(['1\n00:00:00,000 --> 00:00:01,000\nhello']), { headers: { 'Content-Disposition': "attachment; filename*=UTF-8''My%20call.srt" } });
          expect(saved).toEqual([{ href: 'blob:file', name: 'My call.srt' }]);
          expect(toasts()).toEqual([expect.objectContaining({ kind: 'success', title: 'Download started', message: 'Subtitles (.srt). Look for it in your downloads.' })]);
          page.download('plain');
          ctl.expectOne('/api/jobs/a/export?format=plain').flush(new Blob(['hello world']));
          expect(saved[1]).toEqual({ href: 'blob:file', name: 'My call.txt' }); // no header: the name is made here
        });

        it('a double click on a format downloads it once, and nothing starts while one is on its way', () => {
          show({});
          page.download('pdf');
          page.download('pdf');
          page.download('txt');
          expect(ctl.match((r) => r.url.startsWith('/api/jobs/a/export')).length).toBe(1);
        });

        it('a failure says why in a toast (the server reason inside the file body is read) and frees the button', async () => {
          show({});
          page.download('pdf');
          ctl.expectOne('/api/jobs/a/export?format=pdf').flush(new Blob([JSON.stringify({ detail: 'The transcript is not ready yet' })]), { status: 409, statusText: 'Conflict' });
          await vi.waitFor(() => expect(lastToast()).toMatchObject({ kind: 'error', title: 'Download failed', message: 'The transcript is not ready yet' }));
          expect(page.exporting()).toBeNull();
          expect(saved).toEqual([]);
        });

        it('an unreachable server says so', async () => {
          show({});
          page.download('md');
          ctl.expectOne('/api/jobs/a/export?format=md').error(new ProgressEvent('error'));
          await vi.waitFor(() => expect(lastToast()).toMatchObject({ kind: 'error', title: 'Download failed', message: 'Cannot reach the server.' }));
        });

        it('the server edition never asks the server for a Word file', () => {
          show({});
          page.download('docx');
          ctl.expectNone((r) => r.url.startsWith('/api/jobs/a/export'));
          expect(saved).toEqual([]);
        });

        it('in the browser edition: Latin text downloads a PDF file, other scripts open the print dialog ("Save as PDF")', () => {
          show({ title: 'My call' });
          store.health.set(makeBrowserHealth());
          Object.defineProperty(TestBed.inject(ApiService), 'kind', { get: () => 'browser', configurable: true });
          page.download('pdf');
          ctl.expectOne('/api/jobs/a/export?format=pdf').flush(new Blob(['%PDF-1.4']));
          expect(saved).toEqual([{ href: 'blob:file', name: 'My call.pdf' }]);
          expect(document.querySelector('iframe')).toBeNull();

          vi.advanceTimersByTime(2000); // past the double-click guard
          page.job.set({ ...page.job()!, segments: [line(0, 0, 'नमस्ते दोस्तों')] });
          page.download('pdf');
          ctl.expectNone((r) => r.url.startsWith('/api/jobs/a/export'));
          expect(lastToast()).toMatchObject({ kind: 'info', title: 'Print to PDF' });
          const frame = document.querySelector('iframe[aria-hidden="true"]');
          expect(frame).not.toBeNull();
          frame!.remove();

          vi.advanceTimersByTime(2000);
          page.download('docx');
          ctl.expectOne('/api/jobs/a/export?format=docx').flush(new Blob(['PK']));
          expect(saved[1]).toEqual({ href: 'blob:file', name: 'My call.docx' });
        });
      });

      it('reads the file name of a download from the server header', () => {
        expect(fileNameFrom("attachment; filename*=UTF-8''Caf%C3%A9%20call.pdf")).toBe('Café call.pdf');
        expect(fileNameFrom('attachment; filename="notes.md"')).toBe('notes.md');
        expect(fileNameFrom(null)).toBeNull();
        expect(fileNameFrom('attachment')).toBeNull();
        expect(EXPORTS.length).toBe(8);
      });

      it('the "More" menu holds Rename, Re-transcribe and Delete; Re-transcribe opens a form that can go back', () => {
        show({});
        button('More').click();
        fixture.detectChanges();
        expect(qa('.menu[role="menu"] button[role="menuitem"]').map((b) => clean(b.querySelector('b')))).toEqual(['Rename', 'Re-transcribe', 'Delete transcript']);
        (qa('.menu[role="menu"] button[role="menuitem"]')[1] as HTMLButtonElement).click();
        fixture.detectChanges();
        expect(q('.menu.rerun')!.getAttribute('role')).toBe('dialog');
        expect(q('#rm')).not.toBeNull();
        expect(q('#rl')).not.toBeNull();
        (qa('.rerun-actions button').find((b) => clean(b) === 'Back') as HTMLButtonElement).click();
        fixture.detectChanges();
        expect(q('.menu.rerun')).toBeNull();
        expect(q('.menu[role="menu"]')).not.toBeNull();
      });

      it('"Rename" in the More menu opens the name box', async () => {
        show({ title: 'Old' });
        button('More').click();
        fixture.detectChanges();
        (qa('.menu[role="menu"] button[role="menuitem"]')[0] as HTMLButtonElement).click();
        fixture.detectChanges();
        expect(page.menu()).toBeNull();
        expect((q('input.title-edit') as HTMLInputElement).getAttribute('aria-label')).toBe('Transcript name');
        expect(page.titleDraft).toBe('Old');
      });

      it('the Start button of the re-run form waits for its answer (no second start)', () => {
        show({});
        page.menu.set('rerun');
        fixture.detectChanges();
        const start = qa('.rerun-actions button')[0] as HTMLButtonElement;
        start.click();
        fixture.detectChanges();
        expect(start.disabled).toBe(true);
        expect(clean(start)).toBe('Starting…');
        ctl.expectOne('/api/jobs/a/rerun').flush(makeJob({ id: 'new', status: 'queued' }));
      });

      it('a click outside an open menu closes it; a click inside does not; Escape closes it and puts the focus back on its button', () => {
        show({});
        page.menu.set('export');
        fixture.detectChanges();
        q('.menu')!.click();
        expect(page.menu()).toBe('export');
        document.body.click();
        expect(page.menu()).toBeNull();
        page.menu.set('rerun');
        fixture.detectChanges();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(page.menu()).toBeNull();
        vi.advanceTimersByTime(1);
        expect(document.activeElement?.getAttribute('data-menu')).toBe('more');
      });

      it('Copy puts the transcript on the clipboard and says "Copied"; the button waits while it works', async () => {
        show({});
        const writeText = vi.fn(() => Promise.resolve());
        Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
        button('Copy').click();
        fixture.detectChanges();
        expect(button('Copying').disabled).toBe(true);
        button('Copying').click(); // a second press sends nothing
        const req = ctl.expectOne('/api/jobs/a/export?format=txt');
        expect(req.request.responseType).toBe('text');
        req.flush('[00:00] hello');
        await vi.waitFor(() => expect(lastToast()).toMatchObject({ kind: 'success', title: 'Copied' }));
        expect(writeText).toHaveBeenCalledWith('[00:00] hello');
        fixture.detectChanges();
        expect(button('Copy text').disabled).toBe(false);
        Reflect.deleteProperty(navigator, 'clipboard');
      });

      it('without the Clipboard API (http on a local network) it still copies, the old way', async () => {
        show({});
        Reflect.deleteProperty(navigator, 'clipboard');
        const exec = vi.fn(() => true);
        document.execCommand = exec as unknown as Document['execCommand'];
        page.copy();
        ctl.expectOne('/api/jobs/a/export?format=txt').flush('text');
        await vi.waitFor(() => expect(lastToast()).toMatchObject({ kind: 'success', title: 'Copied' }));
        expect(exec).toHaveBeenCalledWith('copy');
      });

      it('a blocked clipboard says so instead of failing silently', async () => {
        show({});
        Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) }, configurable: true });
        document.execCommand = vi.fn(() => false) as unknown as Document['execCommand'];
        page.copy();
        ctl.expectOne('/api/jobs/a/export?format=txt').flush('text');
        await vi.waitFor(() => expect(lastToast()).toMatchObject({ kind: 'error', title: 'Could not copy' }));
        expect(store.toast()).toBe('Your browser blocked copying here. Use Export to save the text instead.');
        expect(page.copying()).toBe(false);
        Reflect.deleteProperty(navigator, 'clipboard');
      });

      it('text that cannot be loaded says so', async () => {
        show({});
        page.copy();
        ctl.expectOne('/api/jobs/a/export?format=txt').flush(...httpError(500));
        await vi.waitFor(() => expect(lastToast()).toMatchObject({ kind: 'error', title: 'Could not copy', message: 'Could not load the text to copy.' }));
        expect(page.copying()).toBe(false);
      });

      it('shows "Saving…" while an edit is on its way', () => {
        show({});
        page.save([{ id: 0, text: 'x' }]);
        fixture.detectChanges();
        expect(clean(q('.saving'))).toBe('Saving…');
        patch('a').flush(makeJob({ id: 'a' }));
        fixture.detectChanges();
        expect(q('.saving')).toBeNull();
      });
    });

    describe('editing lines', () => {
      it('the new text shows at once, before the server has answered', () => {
        show({});
        page.save([{ id: 1, text: 'planet' }]);
        expect(page.job()!.segments.map((s) => s.text)).toEqual(['hello', 'planet']);
        expect(page.job()!.segments[1].edited).toBe(true);
        patch('a');
      });

      it('lines the server did not change keep their objects (the list does not rebuild every row after one edit)', () => {
        show({});
        const first = page.job()!.segments[0];
        page.save([{ id: 1, text: 'planet' }]);
        patch('a').flush(makeJob({ id: 'a', segments: [line(0, 0, 'hello'), { ...line(1, 2, 'planet'), edited: true }] }));
        expect(page.job()!.segments[0]).toBe(first);
        expect(page.job()!.segments[1].text).toBe('planet');
      });

      it('a failed save puts the old text back and opens the line again with what was typed (nothing is lost)', () => {
        show({});
        page.save([{ id: 1, text: 'planet' }]);
        patch('a').flush(...httpError(500));
        expect(page.job()!.segments[1].text).toBe('world');
        vi.advanceTimersByTime(1);
        fixture.detectChanges();
        expect(list().editingId()).toBe(1);
        expect(list().draft).toBe('planet');
      });

      it('a line still open in its editor is saved when the page is left (Back button, a link)', () => {
        show({});
        list().edit(page.job()!.segments[0]);
        list().draft = 'hello there';
        fixture.destroy();
        expect(patch('a').request.body).toEqual({ segments: [{ id: 0, text: 'hello there' }] });
      });

      it('...and when another transcript is opened, it is saved to the transcript it belongs to', () => {
        show({});
        list().edit(page.job()!.segments[0]);
        list().draft = 'hello there';
        switchTo('b');
        expect(patch('a').request.body).toEqual({ segments: [{ id: 0, text: 'hello there' }] });
        get('b');
      });

      it('an editor without a change saves nothing when the page is left', () => {
        show({});
        list().edit(page.job()!.segments[0]);
        fixture.destroy();
        ctl.expectNone((r) => r.method === 'PATCH');
      });

      it('when the tab really goes away with a line still open, the change is sent with a keepalive request', () => {
        show({});
        const send = vi.fn(() => Promise.resolve(new Response(null)));
        vi.stubGlobal('fetch', send);
        window.dispatchEvent(new Event('pagehide'));
        expect(send).not.toHaveBeenCalled(); // nothing open: nothing sent
        list().edit(page.job()!.segments[1]);
        list().draft = 'world, kept';
        window.dispatchEvent(new Event('pagehide'));
        expect(send).toHaveBeenCalledTimes(1);
        const [url, init] = send.mock.calls[0] as unknown as [string, RequestInit];
        expect(url).toBe('/api/jobs/a');
        expect(init).toMatchObject({ method: 'PATCH', keepalive: true });
        expect(JSON.parse(init.body as string)).toEqual({ segments: [{ id: 1, text: 'world, kept' }] });
        expect(list().editingId()).toBeNull(); // not sent a second time when the page is torn down
        fixture.destroy();
        ctl.expectNone((r) => r.method === 'PATCH');
      });

      it('in the browser edition the open line is saved in this browser, not sent to a server that is not there', () => {
        show({});
        store.health.set(makeBrowserHealth());
        const send = vi.fn(() => Promise.resolve(new Response(null)));
        vi.stubGlobal('fetch', send);
        list().edit(page.job()!.segments[1]);
        list().draft = 'world, kept';
        window.dispatchEvent(new Event('pagehide'));
        expect(send).not.toHaveBeenCalled();
        expect(patch('a').request.body).toEqual({ segments: [{ id: 1, text: 'world, kept' }] }); // through the transport
        expect(list().editingId()).toBeNull();
      });

      it('closing or reloading the tab with an unsaved change (or a save on its way) makes the browser ask first', () => {
        show({});
        const leave = () => {
          const ev = new Event('beforeunload', { cancelable: true });
          window.dispatchEvent(ev);
          return ev.defaultPrevented;
        };
        expect(leave()).toBe(false);
        list().edit(page.job()!.segments[0]);
        list().draft = 'changed';
        expect(leave()).toBe(true);
        list().cancel();
        expect(leave()).toBe(false);
        page.save([{ id: 0, text: 'x' }]);
        expect(leave()).toBe(true);
        patch('a').flush(makeJob({ id: 'a' }));
        expect(leave()).toBe(false);
      });
    });

    describe('renaming', () => {
      it('the pencil (or a double click on the name) opens a box with the name; Enter saves, Escape cancels', () => {
        show({ title: 'Old name' });
        q('button.rename')!.click();
        fixture.detectChanges();
        const input = q('input.title-edit') as HTMLInputElement;
        expect(input.getAttribute('aria-label')).toBe('Transcript name');
        expect(page.titleDraft).toBe('Old name');
        vi.advanceTimersByTime(1);
        expect(document.activeElement).toBe(input); // focused: a click elsewhere saves it, typing replaces the name
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        fixture.detectChanges();
        expect(q('input.title-edit')).toBeNull();
        ctl.expectNone((r) => r.method === 'PATCH');
        q('h1')!.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
        fixture.detectChanges();
        expect(q('input.title-edit')).not.toBeNull();
      });

      it('an unchanged name sends nothing and says nothing', () => {
        show({ title: 'Same' });
        page.startRename();
        page.finishRename(true);
        ctl.expectNone((r) => r.method === 'PATCH');
        expect(toasts()).toEqual([]);
      });
    });

    describe('progress of a running transcript: one line, one bar, Cancel', () => {
      const running = (over: Partial<Job> = {}) =>
        show({ status: 'running', phase: 'transcribing', progress: 0.42, eta_seconds: 90, stats: null, segments: [line(0, 0, 'a'), line(1, 1, 'b')], ...over });

      it('says what is happening, how far it is and the time left, in one line (no step dots)', () => {
        running();
        expect(clean(q('.progress .status b'))).toBe('Transcribing…');
        expect(clean(q('.progress .status span'))).toBe('42% done · 2 min left');
        expect(q('.progress .status')!.getAttribute('role')).toBe('status');
        expect(q('ol.steps')).toBeNull();
        expect(qa('.progress .bar').length).toBe(1);
      });

      it.each([
        ['extracting', 'Preparing the audio…'],
        ['loading_model', 'Getting the speech engine ready…'],
      ] as const)('%s: %s, with a moving bar', (phase, label) => {
        running({ phase, progress: 0, eta_seconds: null });
        expect(clean(q('.status b'))).toBe(label);
        expect(q('.status span')).toBeNull();
        expect(q('.progress .bar')!.classList.contains('indeterminate')).toBe(true);
      });

      it('while the model downloads: how much, the status note, and a bar that fills with the download', () => {
        running({ phase: 'loading_model', progress: 0, eta_seconds: null, download: { loaded: 120e6, total: 249e6, note: 'Connection lost. Retrying in 8 s…' } });
        expect(clean(q('.status span'))).toBe('Downloading the speech model (first time only): 120 MB of 249 MB · Connection lost. Retrying in 8 s…');
        expect(q('.progress .bar')!.classList.contains('indeterminate')).toBe(false);
        expect((q('.progress .bar i') as HTMLElement).style.transform).toBe(`scaleX(${120e6 / 249e6})`);
      });

      it('in the browser edition: asks to keep the page open', () => {
        running();
        expect(q('.keep-open')).toBeNull(); // the server editions work on the server
        store.health.set(makeBrowserHealth());
        fixture.detectChanges();
        expect(clean(q('.keep-open'))).toBe(
          'Keep this page open until it is finished. If it reloads or closes, it continues where it stopped when you open the site again.',
        );
      });

      it('says when the job continued after the page reloaded', () => {
        running({ resume_count: 1 });
        store.health.set(makeBrowserHealth());
        fixture.detectChanges();
        expect(clean(q('.keep-open b'))).toBe('Continued after the page reloaded.');
      });

      it('a queued transcript says it is waiting', () => {
        running({ status: 'queued', phase: null, progress: 0, eta_seconds: null, segments: [] });
        expect(clean(q('.status b'))).toBe('Waiting in line…');
      });

      it('the bar grows with the progress (transform, no layout) and Cancel asks, then stops the job', () => {
        running();
        expect((q('.progress .bar i') as HTMLElement).style.transform).toBe('scaleX(0.42)');
        expect(q('.progress .bar')!.classList.contains('indeterminate')).toBe(false);
        const cancel = q('.progress button') as HTMLButtonElement;
        cancel.click();
        fixture.detectChanges();
        expect(confirm).toHaveBeenCalled();
        expect(cancel.disabled).toBe(true);
        expect(clean(cancel)).toBe('Cancelling…');
        ctl.expectOne('/api/jobs/a/cancel').flush(makeJob({ id: 'a', status: 'cancelled' }));
      });

      it('shows the live transcript while it runs (every line, with the "Live" note)', () => {
        running();
        expect(qa('.seg').length).toBe(2);
        expect(clean(q('.live-note'))).toContain('Live');
      });

      it('disappears when the transcript is done', () => {
        show({ status: 'done' });
        expect(q('.progress')).toBeNull();
      });
    });

    describe('failed and cancelled transcripts', () => {
      it('a failure says what went wrong and offers to try again (the one main button there)', () => {
        show({ status: 'error', error: 'Could not read the file.', segments: [] });
        expect(clean(q('.alert h2'))).toBe('Transcription failed');
        expect(clean(q('.alert p'))).toBe('Could not read the file.');
        expect(q('.alert')!.getAttribute('role')).toBe('alert');
        const retry = qa('.alert button').find((b) => clean(b) === 'Try again') as HTMLButtonElement;
        expect(retry.classList.contains('primary')).toBe(true);
        retry.click();
        ctl.expectOne('/api/jobs/a/rerun').flush(makeJob({ id: 'new', status: 'queued' }));
        expect(navigate).toHaveBeenCalledWith(['/jobs', 'new']);
      });

      it('a failure without a reason still says something useful', () => {
        show({ status: 'error', error: null, segments: [] });
        expect(clean(q('.alert p'))).toBe('Something went wrong while reading this file.');
      });

      it('a cancelled one keeps the partial text and offers to start again', () => {
        show({ status: 'cancelled' });
        expect(clean(q('.alert.warn h2'))).toBe('Cancelled');
        expect(clean(q('.alert.warn p'))).toBe('The text found before it was stopped is shown below.');
        expect(qa('.seg').length).toBe(2);
        expect(qa('.alert.warn button').map((b) => clean(b))).toEqual(['Start again']);
      });

      it('a cancelled one with no text does not mention text below', () => {
        show({ status: 'cancelled', segments: [] });
        expect(clean(q('.alert.warn p'))).toBe('It was stopped before any text was found.');
      });
    });

    describe('empty and waiting states', () => {
      it('"Loading…" before the transcript has come', () => {
        setup('a');
        expect(clean(q('.state.loading'))).toBe('Loading…');
        expect(q('.state.loading')!.getAttribute('aria-busy')).toBe('true');
      });

      it('a finished transcript without speech says so in the list', () => {
        show({ status: 'done', segments: [], stats: null });
        expect(clean(q('.list .empty'))).toBe('No speech was found in this file.If it does have speech, try More › Re-transcribe with the right language.');
        expect(q('input[type="search"]')).toBeNull(); // nothing to search
        expect(qa('p.facts > span').map((s) => clean(s))).toEqual(['EN', 'Length 01:00', 'Transcribed in 01:40']); // no "0 words"
      });

      it('a very long name wraps instead of widening the page (it is plain text, no fixed width)', () => {
        const long = 'A very long transcript name '.repeat(8).trim();
        show({ title: long });
        expect(clean(q('h1'))).toBe(long);
      });
    });
  });
});
