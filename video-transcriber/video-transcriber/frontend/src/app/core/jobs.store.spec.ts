import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SilentLog, httpError, makePublicHealth, makeSummary, silentLog } from '../testing/fakes';
import { JobsStore } from './jobs.store';
import { LogService } from './log.service';
import { IS_BROWSER } from './platform';
import { TOAST_DURATION, ToastService } from './toast.service';

describe('JobsStore', () => {
  let store: JobsStore;
  let ctl: HttpTestingController;

  /** Creates the store and answers the requests it makes on start-up. */
  function setup(jobs = [makeSummary({ id: 'a', created_at: 100 }), makeSummary({ id: 'b', created_at: 200 })]) {
    TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting()] });
    ctl = TestBed.inject(HttpTestingController);
    store = TestBed.inject(JobsStore);
    ctl.expectOne('/api/jobs').flush(jobs);
    ctl.expectOne('/api/health').flush({ status: 'ok' });
    ctl.expectOne('/api/models').flush([]);
    ctl.expectOne('/api/languages').flush([]);
  }

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.clear();
  });

  describe('start-up and polling', () => {
    it('loads the jobs (and nothing about folders: that feature is gone)', () => {
      setup();
      expect(store.jobs().map((j) => j.id)).toEqual(['a', 'b']);
      expect(store.loaded()).toBe(true);
      expect(store.offline()).toBe(false);
      // start-up asked for exactly jobs, health, models and languages: verify() fails on any other request (/api/folders)
      ctl.verify();
      const any = store as unknown as Record<string, unknown>;
      for (const gone of ['folders', 'lastFolderId', 'createFolder', 'renameFolder', 'deleteFolder', 'moveJob', 'setLastFolder', 'refreshFolders']) {
        expect(any[gone]).toBeUndefined();
      }
    });

    it('reads the reference data into the store', () => {
      TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting()] });
      ctl = TestBed.inject(HttpTestingController);
      store = TestBed.inject(JobsStore);
      ctl.expectOne('/api/jobs').flush([]);
      ctl.expectOne('/api/health').flush(makePublicHealth());
      ctl.expectOne('/api/models').flush([{ id: 'small', label: 'Small', size_mb: 480, speed: 3, accuracy: 3, note: '', downloaded: true }]);
      ctl.expectOne('/api/languages').flush([{ code: 'en', name: 'English' }]);
      expect(store.health()?.public).toBe(true);
      expect(store.models().map((m) => m.id)).toEqual(['small']);
      expect(store.languages()).toEqual([{ code: 'en', name: 'English' }]);
    });

    it('a failing health request means offline (and the reference lists stay empty)', () => {
      TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting()] });
      ctl = TestBed.inject(HttpTestingController);
      store = TestBed.inject(JobsStore);
      ctl.expectOne('/api/jobs').flush([]);
      ctl.expectOne('/api/health').error(new ProgressEvent('error'));
      ctl.expectOne('/api/models').flush(...httpError(500));
      ctl.expectOne('/api/languages').flush(...httpError(500));
      expect(store.offline()).toBe(true);
      expect(store.models()).toEqual([]);
      expect(store.languages()).toEqual([]);
    });

    it('polls every 15 s while idle', () => {
      setup();
      vi.advanceTimersByTime(14_999);
      ctl.expectNone('/api/jobs');
      vi.advanceTimersByTime(1);
      ctl.expectOne('/api/jobs').flush([]);
    });

    it('polls every 2 s while a job is queued or running', () => {
      setup([makeSummary({ id: 'a', status: 'running' })]);
      expect(store.active().map((j) => j.id)).toEqual(['a']);
      vi.advanceTimersByTime(2000);
      ctl.expectOne('/api/jobs').flush([makeSummary({ id: 'a', status: 'running' })]);
    });

    it('goes offline when the list cannot be loaded, retries every 5 s and recovers', () => {
      setup();
      vi.advanceTimersByTime(15_000);
      ctl.expectOne('/api/jobs').error(new ProgressEvent('error'));
      expect(store.offline()).toBe(true);
      vi.advanceTimersByTime(5000);
      ctl.expectOne('/api/jobs').flush([makeSummary({ id: 'z' })]);
      expect(store.offline()).toBe(false);
      expect(store.jobs().map((j) => j.id)).toEqual(['z']);
    });
  });

  describe('upsert / remove', () => {
    it('keeps the list sorted newest first', () => {
      setup([]);
      store.upsert(makeSummary({ id: 'old', created_at: 10 }));
      store.upsert(makeSummary({ id: 'new', created_at: 30 }));
      store.upsert(makeSummary({ id: 'mid', created_at: 20 }));
      expect(store.jobs().map((j) => j.id)).toEqual(['new', 'mid', 'old']);
    });

    it('replaces a job with the same id instead of duplicating it', () => {
      setup([]);
      store.upsert(makeSummary({ id: 'a', created_at: 10, status: 'queued', progress: 0 }));
      store.upsert(makeSummary({ id: 'b', created_at: 20 }));
      store.upsert(makeSummary({ id: 'a', created_at: 10, status: 'running', progress: 0.5 }));
      expect(store.jobs().map((j) => j.id)).toEqual(['b', 'a']);
      expect(store.jobs()[1]).toMatchObject({ status: 'running', progress: 0.5 });
    });

    it('does not mutate the previous array (signal consumers see a new reference)', () => {
      setup([]);
      const before = store.jobs();
      store.upsert(makeSummary({ id: 'a' }));
      expect(store.jobs()).not.toBe(before);
      expect(before).toEqual([]);
    });

    it('removes a job', () => {
      setup();
      store.remove('a');
      expect(store.jobs().map((j) => j.id)).toEqual(['b']);
      store.remove('nope');
      expect(store.jobs().length).toBe(1);
    });
  });

  describe('telling the logger what the server does with logs', () => {
    const configured = () => (TestBed.inject(LogService) as unknown as SilentLog).configured;

    it('an older server that says nothing about logs keeps client logging on', () => {
      setup();
      expect(configured().at(-1)).toEqual({ enabled: true, needsToken: false });
    });

    it('stops client logging when the server turned logs off, or wants a token', () => {
      setup();
      store.loadReference();
      ctl.expectOne('/api/health').flush(makePublicHealth({ logs_enabled: false }));
      ctl.match(() => true).forEach((r) => r.flush([]));
      expect(configured().at(-1)).toEqual({ enabled: false, needsToken: false });

      store.loadReference();
      ctl.expectOne('/api/health').flush(makePublicHealth({ logs_enabled: true, logs_require_token: true }));
      ctl.match(() => true).forEach((r) => r.flush([]));
      expect(configured().at(-1)).toEqual({ enabled: true, needsToken: true });
    });
  });

  describe('clearAll (after "Delete my data now")', () => {
    it('empties the list at once, then reloads from the server', () => {
      setup([makeSummary({ id: 'a' })]);
      store.clearAll();
      expect(store.jobs()).toEqual([]);
      ctl.expectOne('/api/jobs').flush([]);
      expect(store.loaded()).toBe(true);
      expect(store.offline()).toBe(false);
    });

    it('restarts the polling (the pending poll is replaced, not doubled)', () => {
      setup([makeSummary({ id: 'a' })]);
      store.clearAll();
      ctl.expectOne('/api/jobs').flush([]);
      vi.advanceTimersByTime(15_000);
      ctl.expectOne('/api/jobs').flush([]); // exactly one poll after 15 s
    });
  });

  describe('a busy server (429, or 503 with a reason)', () => {
    const failList = (status: number, detail?: string) => {
      ctl.expectOne('/api/jobs').flush(...httpError(status, detail));
    };

    it('is not "offline": says why once, keeps the list and tries again every 10 s', () => {
      setup();
      vi.advanceTimersByTime(15_000);
      failList(429, 'Too many requests. Please slow down.');
      expect(store.offline()).toBe(false);
      expect(store.toast()).toBe('Too many requests. Please slow down.');
      // a busy server is a warning ("try again"), not an error
      expect(TestBed.inject(ToastService).toasts()[0]).toMatchObject({ kind: 'warning', title: 'Server busy' });
      expect(store.jobs().length).toBe(2);

      store.dismissToast();
      vi.advanceTimersByTime(9999);
      ctl.expectNone('/api/jobs');
      vi.advanceTimersByTime(1);
      failList(503, 'The server is full. Try again later.');
      expect(store.toast()).toBe(''); // the same busy spell is not announced again
      expect(store.offline()).toBe(false);
    });

    it('says it again for a later busy spell, after the server has been fine in between', () => {
      setup();
      vi.advanceTimersByTime(15_000);
      failList(429, 'Busy.');
      store.dismissToast();
      vi.advanceTimersByTime(10_000);
      ctl.expectOne('/api/jobs').flush([]);
      vi.advanceTimersByTime(15_000);
      failList(429, 'Busy again.');
      expect(store.toast()).toBe('Busy again.');
    });

    it('a 429 without a message gets a plain one', () => {
      setup();
      vi.advanceTimersByTime(15_000);
      failList(429);
      expect(store.toast()).toBe('The server is busy right now. Retrying…');
    });

    it('a bare 503 (no reason, e.g. from a proxy while the backend is down) still counts as offline', () => {
      setup();
      vi.advanceTimersByTime(15_000);
      failList(503);
      expect(store.offline()).toBe(true);
      expect(store.toast()).toBe('');
    });
  });

  describe('toast', () => {
    it('shows an error toast by default and hides it after the error time', () => {
      setup();
      store.notify('Saved nothing');
      expect(store.toast()).toBe('Saved nothing');
      expect(TestBed.inject(ToastService).toasts()[0]).toMatchObject({ kind: 'error', message: 'Saved nothing' });
      vi.advanceTimersByTime(TOAST_DURATION.error - 1);
      expect(store.toast()).toBe('Saved nothing');
      vi.advanceTimersByTime(1);
      expect(store.toast()).toBe('');
    });

    it('takes a kind and a title', () => {
      setup();
      store.notify('Your file is queued.', 'success', 'Uploaded');
      expect(TestBed.inject(ToastService).toasts()[0]).toMatchObject({ kind: 'success', title: 'Uploaded', message: 'Your file is queued.' });
      vi.advanceTimersByTime(TOAST_DURATION.success);
      expect(store.toast()).toBe('');
    });

    it('a newer message is shown on top of the older one; toast() reads the newest', () => {
      setup();
      store.notify('first');
      vi.advanceTimersByTime(3000);
      store.notify('second');
      expect(store.toast()).toBe('second');
      expect(TestBed.inject(ToastService).toasts().map((t) => t.message)).toEqual(['first', 'second']);
    });


    it('can be dismissed early', () => {
      setup();
      store.notify('x');
      store.dismissToast();
      expect(store.toast()).toBe('');
      vi.advanceTimersByTime(5000);
      expect(store.toast()).toBe('');
    });
  });

  describe('while a page is prerendered (not in a browser)', () => {
    it('asks the server for nothing and starts no polling', () => {
      TestBed.configureTestingModule({
        providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), { provide: IS_BROWSER, useValue: false }],
      });
      ctl = TestBed.inject(HttpTestingController);
      store = TestBed.inject(JobsStore);
      ctl.verify(); // no request at all
      store.refresh();
      store.loadReference();
      store.refreshModels();
      ctl.verify();
      vi.advanceTimersByTime(60_000);
      ctl.verify();
      expect(store.jobs()).toEqual([]);
      expect(store.loaded()).toBe(false);
      expect(store.offline()).toBe(false);
    });
  });
});
