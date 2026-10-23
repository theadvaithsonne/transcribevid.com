import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { httpError, makeHealth, makePublicHealth, makeSession, makeSummary, silentLog } from '../testing/fakes';
import { JobsStore } from './jobs.store';
import { ASSUME_PUBLIC, IS_BROWSER } from './platform';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let session: SessionService;
  let store: JobsStore;
  let ctl: HttpTestingController;

  const sessionReq = (): TestRequest => ctl.expectOne((r) => r.url === '/api/session' && r.method === 'GET');
  const noSessionReq = () => ctl.expectNone((r) => r.url === '/api/session');

  /** The store's start-up requests are answered with empty data; the health is set by the test. */
  function setup(health = makePublicHealth()) {
    TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting()] });
    ctl = TestBed.inject(HttpTestingController);
    store = TestBed.inject(JobsStore);
    session = TestBed.inject(SessionService);
    for (const r of ctl.match((req) => req.url !== '/api/session')) r.flush(r.request.url.endsWith('/health') ? health : []);
    TestBed.tick(); // the service starts polling when the health says "public"
  }

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    session.stop();
  });

  describe('polling', () => {
    it('does not talk to /api/session on a local install', () => {
      setup(makeHealth());
      noSessionReq();
      vi.advanceTimersByTime(180_000);
      noSessionReq();
      expect(session.info()).toBeNull();
    });

    it('asks at once on the public site, then every 60 seconds', () => {
      setup();
      sessionReq().flush(makeSession({ expires_in_seconds: 1800 }));
      expect(session.info()?.expires_in_seconds).toBe(1800);
      vi.advanceTimersByTime(59_999);
      noSessionReq();
      vi.advanceTimersByTime(1);
      sessionReq().flush(makeSession({ expires_in_seconds: 1740 }));
      expect(session.info()?.expires_in_seconds).toBe(1740);
      vi.advanceTimersByTime(60_000);
      sessionReq().flush(makeSession({ expires_in_seconds: 1680 }));
    });

    it('keeps the last answer and carries on when a poll fails', () => {
      setup();
      sessionReq().flush(makeSession({ expires_in_seconds: 900 }));
      vi.advanceTimersByTime(60_000);
      sessionReq().flush(...httpError(500));
      expect(session.info()?.expires_in_seconds).toBe(900);
      vi.advanceTimersByTime(60_000);
      sessionReq().flush(makeSession({ expires_in_seconds: 780 }));
      expect(session.info()?.expires_in_seconds).toBe(780);
    });

    it('stops when the server turns out not to be public', () => {
      setup();
      sessionReq().flush(makeSession());
      store.health.set(makeHealth());
      TestBed.tick();
      vi.advanceTimersByTime(180_000);
      noSessionReq();
    });

    it('looks at once when the history suddenly empties (the first hint of an expired session)', () => {
      setup();
      sessionReq().flush(makeSession());
      store.jobs.set([makeSummary({ id: 'a' })]);
      TestBed.tick();
      noSessionReq();
      store.jobs.set([]);
      TestBed.tick();
      sessionReq().flush(makeSession({ session_id: 'sess-2' }));
      expect(session.ended()).toBe(true);
    });
  });

  describe('time left', () => {
    it.each([
      [1800, null, 30],
      [301, null, 6],
      [300, null, 5],
      [299, 5, 5],
      [150, 3, 3],
      [61, 2, 2],
      [20, 1, 1],
    ])('%s seconds left: the "ending soon" banner shows %s (%s min)', (seconds, soon, minutes) => {
      setup();
      sessionReq().flush(makeSession({ expires_in_seconds: seconds }));
      expect(session.endingSoon()).toBe(soon);
      expect(session.minutesLeft()).toBe(minutes);
    });

    it('has nothing to show before the first answer', () => {
      setup();
      expect(session.minutesLeft()).toBeNull();
      expect(session.endingSoon()).toBeNull();
      sessionReq().flush(makeSession());
    });
  });

  describe('an ended session', () => {
    it('is noticed when the server hands out a different session id', () => {
      setup();
      sessionReq().flush(makeSession({ session_id: 'a', expires_in_seconds: 100 }));
      expect(session.ended()).toBe(false);
      expect(session.endingSoon()).toBe(2);
      vi.advanceTimersByTime(60_000);
      sessionReq().flush(makeSession({ session_id: 'b', expires_in_seconds: 1800 }));
      expect(session.ended()).toBe(true);
      expect(session.endingSoon()).toBeNull(); // the "has ended" message replaces the warning
      vi.advanceTimersByTime(60_000);
      sessionReq().flush(makeSession({ session_id: 'b' })); // the new session is the one we know now
      expect(session.ended()).toBe(true); // until it is dismissed
      session.dismissEnded();
      expect(session.ended()).toBe(false);
    });

    it('is noticed when the session has run out of time', () => {
      setup();
      sessionReq().flush(makeSession({ expires_in_seconds: 0 }));
      expect(session.ended()).toBe(true);
    });

    it('is not mistaken for a session that merely continues', () => {
      setup();
      sessionReq().flush(makeSession({ session_id: 'a' }));
      vi.advanceTimersByTime(60_000);
      sessionReq().flush(makeSession({ session_id: 'a', job_count: 3 }));
      expect(session.ended()).toBe(false);
    });

    it('a fresh session after "Delete my data now" is not an ended one', () => {
      setup();
      sessionReq().flush(makeSession({ session_id: 'a' }));
      session.reset();
      expect(session.info()).toBeNull();
      sessionReq().flush(makeSession({ session_id: 'b' }));
      expect(session.ended()).toBe(false);
      expect(session.info()?.session_id).toBe('b');
    });
  });

  describe('check() when a transcript can no longer be found', () => {
    const health = (id: string) => makePublicHealth({ session_id: id });
    const answer = (sessionId: string, healthId = 'run-1') => {
      sessionReq().flush(makeSession({ session_id: sessionId }));
      ctl.expectOne((r) => r.url === '/api/health').flush(health(healthId));
    };

    it('says yes when the visitor now has a different session', () => {
      setup();
      sessionReq().flush(makeSession({ session_id: 'a' }));
      let result: boolean | undefined;
      session.check().subscribe((v) => (result = v));
      answer('b');
      expect(result).toBe(true);
      expect(session.ended()).toBe(true);
    });

    it('says yes when the server was restarted (a different run id in the health)', () => {
      setup(makePublicHealth({ session_id: 'run-1' }));
      sessionReq().flush(makeSession({ session_id: 'a' }));
      let result: boolean | undefined;
      session.check().subscribe((v) => (result = v));
      answer('a', 'run-2');
      expect(result).toBe(true);
      expect(store.health()?.session_id).toBe('run-2');
    });

    it('says no when nothing changed (the transcript was simply deleted)', () => {
      setup();
      sessionReq().flush(makeSession({ session_id: 'a' }));
      let result: boolean | undefined;
      session.check().subscribe((v) => (result = v));
      answer('a');
      expect(result).toBe(false);
      expect(session.ended()).toBe(false);
    });

    it('still decides from the session when the health cannot be read', () => {
      setup();
      sessionReq().flush(makeSession({ session_id: 'a' }));
      let result: boolean | undefined;
      session.check().subscribe((v) => (result = v));
      sessionReq().flush(makeSession({ session_id: 'b' }));
      ctl.expectOne((r) => r.url === '/api/health').flush(...httpError(500));
      expect(result).toBe(true);
    });

    it('passes on an error when the session itself cannot be read', () => {
      setup();
      sessionReq().flush(makeSession());
      let failed = false;
      session.check().subscribe({ error: () => (failed = true) });
      sessionReq().flush(...httpError(500));
      expect(failed).toBe(true);
    });
  });

  describe('before the server has answered, and while prerendering', () => {
    it('does not poll on the strength of the assumed public site (only on a real answer)', () => {
      TestBed.configureTestingModule({
        providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), { provide: ASSUME_PUBLIC, useValue: true }],
      });
      ctl = TestBed.inject(HttpTestingController);
      store = TestBed.inject(JobsStore);
      session = TestBed.inject(SessionService);
      TestBed.tick();
      noSessionReq();
      store.health.set(makePublicHealth());
      TestBed.tick();
      sessionReq().flush(makeSession());
    });

    it('never polls while a page is prerendered, even for a public answer', () => {
      TestBed.configureTestingModule({
        providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), { provide: IS_BROWSER, useValue: false }],
      });
      ctl = TestBed.inject(HttpTestingController);
      store = TestBed.inject(JobsStore);
      session = TestBed.inject(SessionService);
      store.health.set(makePublicHealth());
      TestBed.tick();
      noSessionReq();
      vi.advanceTimersByTime(120_000);
      noSessionReq();
    });
  });
});
