import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { httpError, makeStats, makeSummary, restoreVisibility, setTabVisibility, silentLog, useEnglishNumbers } from '../testing/fakes';
import { JobsStore } from './jobs.store';
import { JobSummary } from './models';
import { IS_BROWSER } from './platform';
import { COUNTER_URL, StatsService } from './stats.service';

const MINUTE = 60_000;

/** Just what StatsService reads from the store: the list and whether it has been loaded. */
class FakeStore {
  jobs = signal<JobSummary[]>([]);
  loaded = signal(false);
}

describe('StatsService', () => {
  let ctl: HttpTestingController;
  let svc: StatsService;
  let jobs: FakeStore;
  let tabListeners: EventListenerOrEventListenerObject[];

  /** Creates the service. By default it is "in the browser", with a store whose list has not loaded yet. */
  function setup(opts: { browser?: boolean } = {}) {
    TestBed.configureTestingModule({
      providers: [
        silentLog,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: JobsStore, useClass: FakeStore },
        { provide: IS_BROWSER, useValue: opts.browser ?? true },
      ],
    });
    ctl = TestBed.inject(HttpTestingController);
    jobs = TestBed.inject(JobsStore) as unknown as FakeStore;
    svc = TestBed.inject(StatsService);
  }

  const req = (): TestRequest => ctl.expectOne('/api/stats');
  /** Answers the pending request with a good body and runs the effects. */
  function answer(body: object | string | null = makeStats({ transcribed: 10 })) {
    req().flush(body);
    TestBed.tick();
  }
  const fail = (status = 500) => req().flush(...httpError(status));
  /** The service is up and shows `n` (public site). */
  function shown(n = 10) {
    setup();
    answer(makeStats({ transcribed: n }));
  }
  const pollsIn = (ms: number) => {
    vi.advanceTimersByTime(ms);
  };

  beforeEach(() => {
    vi.useFakeTimers();
    tabListeners = [];
    const add = document.addEventListener.bind(document);
    vi.spyOn(document, 'addEventListener').mockImplementation((type: string, fn: EventListenerOrEventListenerObject, o?: boolean | AddEventListenerOptions) => {
      if (type === 'visibilitychange') tabListeners.push(fn);
      add(type, fn, o);
    });
  });

  afterEach(() => {
    for (const fn of tabListeners) document.removeEventListener('visibilitychange', fn);
    vi.restoreAllMocks();
    restoreVisibility();
    vi.useRealTimers();
  });

  describe('the first request', () => {
    it('asks the server once when it starts: a plain GET, nothing hidden until it answers', () => {
      setup();
      const r = req();
      expect(r.request.method).toBe('GET');
      expect(r.request.headers.has('Cache-Control')).toBe(false); // the browser may reuse a short-lived answer
      expect(svc.stats()).toBeNull();
      expect(svc.visible()).toBe(false);
      r.flush(makeStats({ transcribed: 3 }));
    });

    it('shows what the server says, and nothing else', () => {
      setup();
      answer(makeStats({ transcribed: 1234, counting: true }));
      expect(svc.stats()).toEqual({ transcribed: 1234, counting: true });
      expect(svc.count()).toBe(1234);
      expect(svc.counting()).toBe(true);
    });

    it('keeps whole numbers: a fraction is cut off, never rounded up', () => {
      setup();
      answer({ transcribed: 99.9, counting: true });
      expect(svc.count()).toBe(99);
    });
  });

  describe('when the pill is shown', () => {
    it('is hidden while unknown (no answer yet)', () => {
      setup();
      expect(svc.visible()).toBe(false);
      expect(svc.count()).toBe(0);
      expect(svc.counting()).toBe(false);
      req().flush(makeStats());
    });

    it('public site (counting): hidden at 0, shown from the first transcribed video', () => {
      setup();
      answer(makeStats({ transcribed: 0, counting: true }));
      expect(svc.visible()).toBe(false);
      pollsIn(MINUTE);
      answer(makeStats({ transcribed: 1, counting: true }));
      expect(svc.visible()).toBe(true);
    });

    it('a copy that does not count: shown with 0 (a local install says so in the tooltip)', () => {
      setup();
      answer(makeStats({ transcribed: 0, counting: false }));
      expect(svc.visible()).toBe(true);
      expect(svc.count()).toBe(0);
      expect(svc.counting()).toBe(false);
    });
  });

  describe('texts', () => {
    it('puts thousands separators in the number', () => {
      useEnglishNumbers();
      shown(1234567);
      expect(svc.formatted()).toBe('1,234,567');
      expect(svc.label()).toBe('1,234,567 videos transcribed');
    });

    it("formats the number the way the visitor's own language does (not hard-wired to one style)", () => {
      const spy = vi.spyOn(Intl, 'NumberFormat').mockImplementation(function () {
        return { format: (n: number) => `~${n}~` };
      } as never);
      shown(12345);
      expect(spy).toHaveBeenCalledWith(); // no locale is forced: the browser's own is used
      expect(svc.formatted()).toBe('~12345~');
    });

    it('the full label: plural for any number but one', () => {
      useEnglishNumbers();
      shown(12345);
      expect(svc.label()).toBe('12,345 videos transcribed');
      pollsIn(MINUTE);
      answer(makeStats({ transcribed: 1 }));
      expect(svc.label()).toBe('1 video transcribed');
      pollsIn(MINUTE);
      answer(makeStats({ transcribed: 2 }));
      expect(svc.label()).toBe('2 videos transcribed');
    });

    it('public site: the tooltip and the accessible name are both the full label', () => {
      shown(5);
      expect(svc.title()).toBe('5 videos transcribed');
      expect(svc.ariaLabel()).toBe('5 videos transcribed');
    });

    it('local copy: the tooltip says why it is 0, and the accessible name says both', () => {
      setup();
      answer(makeStats({ transcribed: 0, counting: false }));
      expect(svc.title()).toBe('This local copy does not count transcriptions');
      expect(svc.ariaLabel()).toBe('0 videos transcribed. This local copy does not count transcriptions.');
    });
  });

  describe('only a well-formed answer counts', () => {
    it.each([
      ['no body', null],
      ['an array (a stale mock, a proxy page)', []],
      ['a string', 'ok'],
      ['no "counting"', { transcribed: 3 }],
      ['"counting" that is not a boolean', { transcribed: 3, counting: 'yes' }],
      ['no number', { counting: true }],
      ['a number as text', { transcribed: '3', counting: true }],
      ['a negative number', { transcribed: -1, counting: true }],
      ['infinity', { transcribed: Infinity, counting: true }],
      ['NaN', { transcribed: NaN, counting: true }],
    ])('%s is "unknown": the pill stays hidden', (_name, body) => {
      setup();
      answer(body);
      expect(svc.stats()).toBeNull();
      expect(svc.visible()).toBe(false);
    });

    it('a good answer after a bad one is shown again', () => {
      setup();
      answer([]);
      expect(svc.visible()).toBe(false);
      pollsIn(MINUTE);
      answer(makeStats({ transcribed: 8 }));
      expect(svc.visible()).toBe(true);
    });
  });

  describe('polling', () => {
    it('asks again every 60 seconds, once per interval', () => {
      shown(1);
      pollsIn(MINUTE - 1);
      ctl.expectNone('/api/stats');
      pollsIn(1);
      answer(makeStats({ transcribed: 2 }));
      expect(svc.count()).toBe(2);
      pollsIn(MINUTE - 1);
      ctl.expectNone('/api/stats');
      pollsIn(1);
      answer(makeStats({ transcribed: 3 }));
      expect(svc.count()).toBe(3);
    });

    it('never has more than one timer waiting (no pile-up)', () => {
      shown(1);
      expect(vi.getTimerCount()).toBe(1);
      pollsIn(MINUTE);
      answer(makeStats({ transcribed: 2 }));
      expect(vi.getTimerCount()).toBe(1);
    });

    it('the regular poll is a plain GET too', () => {
      shown(1);
      pollsIn(MINUTE);
      const r = req();
      expect(r.request.headers.has('Cache-Control')).toBe(false);
      r.flush(makeStats({ transcribed: 1 }));
    });

    it('does not poll while the first request is still waiting for its answer (no second request on top)', () => {
      setup();
      // not answered yet: the next poll is only scheduled once the answer (or the failure) is in
      pollsIn(10 * MINUTE);
      const r = req();
      r.flush(makeStats({ transcribed: 4 }));
      expect(svc.count()).toBe(4);
    });
  });

  describe('a hidden tab', () => {
    it('does not poll while the tab is hidden, and fetches at once when it is shown again', () => {
      shown(1);
      setTabVisibility('hidden');
      pollsIn(MINUTE);
      ctl.expectNone('/api/stats'); // the tick came while hidden: skipped
      pollsIn(10 * MINUTE);
      ctl.expectNone('/api/stats'); // and it does not try again by itself
      setTabVisibility('visible');
      answer(makeStats({ transcribed: 2 }));
      expect(svc.count()).toBe(2);
      // polling is back to normal
      pollsIn(MINUTE);
      answer(makeStats({ transcribed: 3 }));
      expect(svc.count()).toBe(3);
    });

    it('a short look away (hidden and shown again inside one interval) costs nothing', () => {
      shown(1);
      setTabVisibility('hidden');
      pollsIn(10_000);
      setTabVisibility('visible');
      ctl.expectNone('/api/stats');
      pollsIn(MINUTE - 10_000);
      answer(makeStats({ transcribed: 2 })); // the normal poll still comes on time
    });

    it('shows the number it already has while hidden', () => {
      shown(7);
      setTabVisibility('hidden');
      pollsIn(5 * MINUTE);
      expect(svc.count()).toBe(7);
      expect(svc.visible()).toBe(true);
    });

    it('a tab that was never hidden does nothing on visibilitychange', () => {
      shown(1);
      setTabVisibility('visible');
      ctl.expectNone('/api/stats');
    });
  });

  describe('right after one of the visitor\'s own transcriptions finishes', () => {
    const running = (id = 'a') => makeSummary({ id, status: 'running', created_at: 1 });
    const done = (id = 'a') => makeSummary({ id, status: 'done', created_at: 1 });

    /** The list has been loaded with `rows` (this is the baseline, not a "finish"). */
    function loadList(rows: JobSummary[]) {
      jobs.jobs.set(rows);
      jobs.loaded.set(true);
      TestBed.tick();
    }
    function change(rows: JobSummary[]) {
      jobs.jobs.set(rows);
      TestBed.tick();
    }

    it('asks again about 2 seconds later, and asks the browser for a fresh answer', () => {
      shown(10);
      loadList([running()]);
      change([done()]);
      pollsIn(1999);
      ctl.expectNone('/api/stats');
      pollsIn(1);
      const r = req();
      expect(r.request.headers.get('Cache-Control')).toBe('no-cache');
      r.flush(makeStats({ transcribed: 11 }));
      expect(svc.count()).toBe(11);
    });

    it('is not lost when the news arrives while an ordinary poll is already in flight: it asks once more afterwards', () => {
      shown(10);
      pollsIn(MINUTE); // the 60 second poll is on its way and still unanswered
      const first = req();
      loadList([running()]);
      change([done()]);
      pollsIn(2000); // the 2 second refresh fires now: no second request in parallel
      ctl.expectNone('/api/stats');
      first.flush(makeStats({ transcribed: 10 }));
      const second = req();
      expect(second.request.headers.get('Cache-Control')).toBe('no-cache');
      second.flush(makeStats({ transcribed: 11 }));
      expect(svc.count()).toBe(11);
    });

    it('restarts the 60 second wait after that (the poll is not doubled)', () => {
      shown(10);
      loadList([running()]);
      change([done()]);
      pollsIn(2000);
      answer(makeStats({ transcribed: 11 }));
      pollsIn(MINUTE - 1);
      ctl.expectNone('/api/stats');
      pollsIn(1);
      req().flush(makeStats({ transcribed: 12 }));
    });

    it('a list that was already done when it first loaded is not a "finish"', () => {
      shown(10);
      loadList([done('old1'), done('old2')]);
      pollsIn(5000);
      ctl.expectNone('/api/stats');
    });

    it('nothing is asked before the list has loaded at all', () => {
      shown(10);
      jobs.jobs.set([done()]);
      TestBed.tick();
      pollsIn(5000);
      ctl.expectNone('/api/stats');
    });

    it('progress of a running job, a failure or a cancel is not a "finish"', () => {
      shown(10);
      loadList([running('a'), running('b')]);
      change([makeSummary({ id: 'a', status: 'running', progress: 0.5 }), makeSummary({ id: 'b', status: 'error' })]);
      change([makeSummary({ id: 'a', status: 'cancelled' }), makeSummary({ id: 'b', status: 'error' })]);
      pollsIn(5000);
      ctl.expectNone('/api/stats');
    });

    it('deleting a finished transcript is not a "finish" either', () => {
      shown(10);
      loadList([done('a'), done('b')]);
      change([done('a')]);
      pollsIn(5000);
      ctl.expectNone('/api/stats');
    });

    it('a new transcript that shows up already finished (a re-run that was quick) counts', () => {
      shown(10);
      loadList([done('a')]);
      change([done('b'), done('a')]);
      pollsIn(2000);
      expect(req().request.headers.get('Cache-Control')).toBe('no-cache');
    });

    it('several finishing together cause one request, 2 s after the last one', () => {
      shown(10);
      loadList([running('a'), running('b')]);
      change([done('a'), running('b')]);
      pollsIn(1500);
      change([done('a'), done('b')]);
      pollsIn(1999);
      ctl.expectNone('/api/stats');
      pollsIn(1);
      req().flush(makeStats({ transcribed: 12 }));
      ctl.expectNone('/api/stats');
    });

    it('does not ask while the tab is hidden; it asks when the tab is shown', () => {
      shown(10);
      loadList([running()]);
      setTabVisibility('hidden');
      change([done()]);
      pollsIn(5000);
      ctl.expectNone('/api/stats');
      setTabVisibility('visible');
      answer(makeStats({ transcribed: 11 }));
      expect(svc.count()).toBe(11);
    });

    it('works on a copy that does not count too (it just keeps showing 0)', () => {
      setup();
      answer(makeStats({ transcribed: 0, counting: false }));
      loadList([running()]);
      change([done()]);
      pollsIn(2000);
      answer(makeStats({ transcribed: 0, counting: false }));
      expect(svc.visible()).toBe(true);
      expect(svc.count()).toBe(0);
    });
  });

  describe('failures are silent', () => {
    it('without a number yet: a failed first request just leaves it hidden', () => {
      setup();
      fail(500);
      expect(svc.stats()).toBeNull();
      expect(svc.visible()).toBe(false);
    });

    it('an unreachable server (status 0) is handled like any other failure', () => {
      setup();
      req().error(new ProgressEvent('error'));
      expect(svc.visible()).toBe(false);
      pollsIn(MINUTE);
      answer(makeStats({ transcribed: 3 }));
      expect(svc.visible()).toBe(true);
    });

    it('an endpoint that does not exist (older server, 404) never shows a pill and does not throw', () => {
      setup();
      fail(404);
      expect(svc.visible()).toBe(false);
      pollsIn(MINUTE);
      expect(() => fail(404)).not.toThrow();
      expect(svc.visible()).toBe(false);
    });

    it('keeps the last good number through up to two failed polls, then hides it', () => {
      shown(25);
      pollsIn(MINUTE);
      fail();
      expect(svc.visible()).toBe(true);
      expect(svc.count()).toBe(25);
      pollsIn(MINUTE);
      fail();
      expect(svc.visible()).toBe(true);
      expect(svc.count()).toBe(25);
      pollsIn(MINUTE);
      fail();
      expect(svc.visible()).toBe(false);
      expect(svc.stats()).toBeNull();
    });

    it('a malformed answer counts as a failure in the same way', () => {
      shown(25);
      pollsIn(MINUTE);
      answer({ nope: true });
      expect(svc.count()).toBe(25);
      pollsIn(MINUTE);
      answer('<html>proxy error</html>');
      expect(svc.count()).toBe(25);
      pollsIn(MINUTE);
      answer(null);
      expect(svc.visible()).toBe(false);
    });

    it('one good answer in between starts the count of failures again', () => {
      shown(25);
      for (const _ of [1, 2]) {
        pollsIn(MINUTE);
        fail();
      }
      pollsIn(MINUTE);
      answer(makeStats({ transcribed: 26 })); // good again
      for (const _ of [1, 2]) {
        pollsIn(MINUTE);
        fail();
      }
      expect(svc.count()).toBe(26);
      expect(svc.visible()).toBe(true);
    });

    it('comes back by itself when the server does', () => {
      shown(25);
      for (const _ of [1, 2, 3]) {
        pollsIn(MINUTE);
        fail();
      }
      expect(svc.visible()).toBe(false);
      pollsIn(5 * MINUTE);
      answer(makeStats({ transcribed: 31 }));
      expect(svc.visible()).toBe(true);
      expect(svc.count()).toBe(31);
    });

    it('after 3 failures in a row it slows down to every 5 minutes, and speeds up again after a good answer', () => {
      shown(25);
      for (const _ of [1, 2]) {
        pollsIn(MINUTE);
        fail(); // still every minute while there have been fewer than 3
      }
      pollsIn(MINUTE);
      fail(); // the third
      pollsIn(5 * MINUTE - 1);
      ctl.expectNone('/api/stats');
      pollsIn(1);
      fail(); // the fourth, after 5 minutes: still slow
      pollsIn(MINUTE);
      ctl.expectNone('/api/stats');
      pollsIn(4 * MINUTE);
      answer(makeStats({ transcribed: 40 })); // healthy again
      pollsIn(MINUTE);
      answer(makeStats({ transcribed: 41 })); // back to once a minute
      expect(svc.count()).toBe(41);
    });

    it('a first request that fails 3 times in a row also slows down', () => {
      setup();
      fail(404);
      pollsIn(MINUTE);
      fail(404);
      pollsIn(MINUTE);
      fail(404);
      pollsIn(MINUTE);
      ctl.expectNone('/api/stats');
      pollsIn(4 * MINUTE);
      fail(404);
    });
  });

  describe('while a page is prerendered (not in a browser)', () => {
    it('makes no request, starts no timer and listens to nothing: the pill is simply not there', () => {
      setup({ browser: false });
      ctl.expectNone('/api/stats');
      expect(vi.getTimerCount()).toBe(0);
      expect(tabListeners).toEqual([]);
      expect(svc.stats()).toBeNull();
      expect(svc.visible()).toBe(false);
      pollsIn(10 * MINUTE);
      ctl.expectNone('/api/stats');
    });
  });

  describe('the static website: the counter Worker (workers/counter)', () => {
    const WORKER = 'https://counter.test/api';
    function setupWorker() {
      TestBed.configureTestingModule({
        providers: [
          silentLog,
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: JobsStore, useClass: FakeStore },
          { provide: IS_BROWSER, useValue: true },
          { provide: COUNTER_URL, useValue: WORKER },
        ],
      });
      ctl = TestBed.inject(HttpTestingController);
      jobs = TestBed.inject(JobsStore) as unknown as FakeStore;
      svc = TestBed.inject(StatsService);
    }
    const read = () => ctl.expectOne((r) => r.method === 'GET' && r.url === `${WORKER}/stats`);
    const posts = () => ctl.match((r) => r.method === 'POST' && r.url === `${WORKER}/count`);
    /** the list is loaded with these jobs (the first look only primes: nothing is reported) */
    function list(rows: JobSummary[]) {
      jobs.loaded.set(true);
      jobs.jobs.set(rows);
      TestBed.tick();
    }

    it("reads the total from the Worker, never /api/stats, and says it is reported by visitors' browsers (not verified)", () => {
      useEnglishNumbers();
      setupWorker();
      ctl.expectNone('/api/stats');
      read().flush(makeStats({ transcribed: 1234, counting: true }));
      TestBed.tick();
      expect(svc.visible()).toBe(true);
      expect(svc.count()).toBe(1234);
      expect(svc.title()).toBe("1,234 videos transcribed, as reported by visitors' browsers");
      expect(svc.title()).not.toMatch(/verified/i);
    });

    it('hides the pill on any error (not deployed yet, over its daily limit, blocked)', () => {
      setupWorker();
      read().flush(...httpError(503));
      TestBed.tick();
      expect(svc.stats()).toBeNull();
      expect(svc.visible()).toBe(false);
    });

    it("reports each of this tab's finished transcriptions once, with an empty POST, and shows the new total", () => {
      setupWorker();
      read().flush(makeStats({ transcribed: 10, counting: true }));
      list([makeSummary({ id: 'a', status: 'running' }), makeSummary({ id: 'b', status: 'queued' })]);
      expect(posts()).toEqual([]);
      list([makeSummary({ id: 'a', status: 'done' }), makeSummary({ id: 'b', status: 'running' })]);
      const first = posts();
      expect(first.length).toBe(1);
      expect(first[0].request.body).toBeNull();
      first[0].flush(makeStats({ transcribed: 11, counting: true }));
      expect(svc.count()).toBe(11);
      list([makeSummary({ id: 'a', status: 'done', title: 'renamed' }), makeSummary({ id: 'b', status: 'done' })]);
      const second = posts();
      expect(second.length).toBe(1); // only b: a was reported already
      second[0].flush(makeStats({ transcribed: 12, counting: true }));
      expect(svc.count()).toBe(12);
    });

    it('does not report transcripts it did not see being made (the list after a reload, another tab)', () => {
      setupWorker();
      read().flush(makeStats({ transcribed: 10, counting: true }));
      list([makeSummary({ id: 'a', status: 'done' })]);
      list([makeSummary({ id: 'a', status: 'done' }), makeSummary({ id: 'b', status: 'done' })]);
      expect(posts()).toEqual([]);
    });

    it('a failed report is silent and keeps the number shown', () => {
      setupWorker();
      read().flush(makeStats({ transcribed: 10, counting: true }));
      list([makeSummary({ id: 'a', status: 'running' })]);
      list([makeSummary({ id: 'a', status: 'done' })]);
      posts()[0].flush(...httpError(429));
      expect(svc.count()).toBe(10);
      expect(svc.visible()).toBe(true);
    });
  });
});
