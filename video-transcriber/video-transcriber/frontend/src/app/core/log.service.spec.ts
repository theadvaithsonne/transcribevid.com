import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler, LogService, errorLogInterceptor } from './log.service';

describe('LogService', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let log: LogService;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    fetchMock = vi.fn(() => Promise.resolve(new Response('{}')));
    vi.stubGlobal('fetch', fetchMock);
    for (const m of ['debug', 'info', 'warn', 'error'] as const) vi.spyOn(console, m).mockImplementation(() => {});
    log = TestBed.inject(LogService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const bodies = () => fetchMock.mock.calls.map((c) => JSON.parse((c[1] as RequestInit).body as string));

  it('keeps debug output local (console only)', () => {
    log.debug('noisy');
    expect(console.debug).toHaveBeenCalledWith('[DEBUG] noisy');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ['info', 'INFO', 'info'],
    ['warn', 'WARNING', 'warn'],
    ['error', 'ERROR', 'error'],
  ] as const)('%s goes to the console and to the server', (method, level, consoleFn) => {
    log[method]('something happened', { id: 5 });
    expect(console[consoleFn]).toHaveBeenCalledWith(`[${level}] something happened`, { id: 5 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/logs/client');
    expect(init.method).toBe('POST');
    expect(init.keepalive).toBe(true);
    expect(JSON.parse(init.body as string)).toEqual({ level, message: 'something happened', context: '{"id":5}' });
  });

  it('passes string context through and truncates long message / context', () => {
    log.info('x'.repeat(5000), 'y'.repeat(9000));
    const [b] = bodies();
    expect(b.message.length).toBe(2000);
    expect(b.context.length).toBe(4000);
    expect(b.context).toBe('y'.repeat(4000));
  });

  describe('the admin token and a server that refuses client logs', () => {
    afterEach(() => sessionStorage.clear());
    const headers = () => (fetchMock.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
    const settle = async () => {
      for (let i = 0; i < 4; i++) await Promise.resolve();
    };

    it('sends the token as a bearer header', () => {
      sessionStorage.setItem('vt-logs-token', 'secret');
      log.warn('x');
      expect(headers()).toMatchObject({ 'Content-Type': 'application/json', Authorization: 'Bearer secret' });
    });

    it('sends no Authorization header without a token', () => {
      log.warn('x');
      expect(headers()['Authorization']).toBeUndefined();
    });

    it.each([401, 404])('stops sending after a %s, until the token changes', async (status) => {
      fetchMock.mockImplementation(() => Promise.resolve(new Response('{}', { status })));
      log.warn('a');
      await settle();
      log.warn('b');
      log.warn('c');
      expect(fetchMock).toHaveBeenCalledTimes(1);

      sessionStorage.setItem('vt-logs-token', 'now-with-a-token');
      log.warn('d');
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('keeps sending after other failures (a 500 is not a refusal)', async () => {
      fetchMock.mockImplementation(() => Promise.resolve(new Response('{}', { status: 500 })));
      log.warn('a');
      await settle();
      log.warn('b');
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('when the server says its logs are off or private', () => {
    afterEach(() => sessionStorage.clear());

    it('sends nothing when logs are disabled (the console still gets everything)', () => {
      log.configure({ enabled: false, needsToken: false });
      log.error('boom');
      expect(console.error).toHaveBeenCalledWith('[ERROR] boom');
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('sends nothing without the token when one is required, and starts once there is one', () => {
      log.configure({ enabled: true, needsToken: true });
      log.warn('a');
      expect(fetchMock).not.toHaveBeenCalled();
      sessionStorage.setItem('vt-logs-token', 'secret');
      log.warn('b');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('is the old behaviour by default (older servers say nothing about logs)', () => {
      log.warn('a');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('de-duplication', () => {
    it('drops an identical message repeated within 5 seconds', () => {
      log.error('boom');
      log.error('boom');
      vi.advanceTimersByTime(4999);
      log.error('boom');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('sends it again once 5 seconds have passed', () => {
      log.error('boom');
      vi.advanceTimersByTime(5000);
      log.error('boom');
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('treats a different level or message as different', () => {
      log.error('boom');
      log.warn('boom');
      log.warn('bang');
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('only compares with the previous message (A, B, A is sent three times)', () => {
      log.info('a');
      log.info('b');
      log.info('a');
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('still prints every repeat to the console', () => {
      log.error('boom');
      log.error('boom');
      expect(console.error).toHaveBeenCalledTimes(2);
    });
  });

  describe('rate limit', () => {
    it('sends at most 20 messages per 10 seconds', () => {
      for (let i = 0; i < 30; i++) log.warn(`msg ${i}`);
      expect(fetchMock).toHaveBeenCalledTimes(20);
    });

    it('allows more once the window has moved on', () => {
      for (let i = 0; i < 25; i++) log.warn(`first ${i}`);
      expect(fetchMock).toHaveBeenCalledTimes(20);
      vi.advanceTimersByTime(10_000);
      for (let i = 0; i < 25; i++) log.warn(`second ${i}`);
      expect(fetchMock).toHaveBeenCalledTimes(40);
    });

    it('spreads the budget over a sliding window', () => {
      for (let i = 0; i < 10; i++) log.warn(`a${i}`);
      vi.advanceTimersByTime(6000);
      for (let i = 0; i < 10; i++) log.warn(`b${i}`);
      log.warn('over budget'); // 21 within 10 s
      expect(fetchMock).toHaveBeenCalledTimes(20);
      vi.advanceTimersByTime(4000); // the first ten are now older than 10 s
      log.warn('fits again');
      expect(fetchMock).toHaveBeenCalledTimes(21);
    });
  });

  describe('never throws', () => {
    it('survives fetch throwing synchronously', () => {
      fetchMock.mockImplementation(() => {
        throw new Error('no network stack');
      });
      expect(() => log.error('x')).not.toThrow();
    });

    it('survives fetch rejecting (the rejection is handled, vitest fails the run on an unhandled one)', async () => {
      fetchMock.mockImplementation(() => Promise.reject(new Error('offline')));
      expect(() => log.error('x')).not.toThrow();
      await Promise.resolve();
      await Promise.resolve();
    });

    it('survives a console that throws', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {
        throw new Error('console is broken');
      });
      expect(() => log.error('x')).not.toThrow();
    });

    it('survives context that cannot be serialised (circular, BigInt)', () => {
      const circular: Record<string, unknown> = {};
      circular['self'] = circular;
      expect(() => log.error('circular', circular)).not.toThrow();
      expect(() => log.error('bigint', { n: 10n })).not.toThrow();
      const sent = bodies();
      expect(sent.map((b) => b.message)).toEqual(['circular', 'bigint']);
      expect(sent[0].context).toBe('[object Object]');
    });

    it('survives undefined / null / odd messages', () => {
      expect(() => log.error(undefined as unknown as string)).not.toThrow();
      expect(() => log.info(null as unknown as string, null)).not.toThrow();
    });
  });
});

describe('GlobalErrorHandler', () => {
  it('logs uncaught errors with their stack', () => {
    const log = { error: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: LogService, useValue: log }, GlobalErrorHandler] });
    const handler = TestBed.inject(GlobalErrorHandler);
    const err = new Error('kaput');
    handler.handleError(err);
    expect(log.error).toHaveBeenCalledWith('Uncaught error: kaput', err.stack);
  });

  it('copes with thrown non-errors', () => {
    const log = { error: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: LogService, useValue: log }, GlobalErrorHandler] });
    const handler = TestBed.inject(GlobalErrorHandler);
    expect(() => handler.handleError('just a string')).not.toThrow();
    expect(() => handler.handleError(null)).not.toThrow();
    expect(log.error).toHaveBeenCalledWith('Uncaught error: just a string', undefined);
  });
});

describe('errorLogInterceptor', () => {
  let http: HttpClient;
  let ctl: HttpTestingController;
  let log: { warn: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    log = { warn: vi.fn(), error: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: LogService, useValue: log },
        provideHttpClient(withInterceptors([errorLogInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    ctl = TestBed.inject(HttpTestingController);
  });

  function fail(url: string, status: number) {
    http.get(url).subscribe({ error: () => {} });
    const req = ctl.expectOne(url);
    if (status === 0) req.error(new ProgressEvent('error'));
    else req.flush('x', { status, statusText: 'Err' });
  }

  it('logs 5xx and network failures as errors, without the query string', () => {
    http.get('/api/jobs?x=1').subscribe({ error: () => {} });
    ctl.expectOne('/api/jobs?x=1').flush('x', { status: 503, statusText: 'Unavailable' });
    expect(log.error).toHaveBeenCalledWith('API GET /api/jobs failed: 503');
    http.get('/api/models').subscribe({ error: () => {} });
    ctl.expectOne('/api/models').error(new ProgressEvent('error'));
    expect(log.error).toHaveBeenCalledWith('API GET /api/models failed: network error');
  });

  it('logs 4xx as warnings', () => {
    fail('/api/jobs/abc', 404);
    expect(log.warn).toHaveBeenCalledWith('API GET /api/jobs/abc failed: 404');
    expect(log.error).not.toHaveBeenCalled();
  });

  it('never logs failures of the log endpoints themselves (no feedback loop)', () => {
    fail('/api/logs?after=0', 500);
    fail('/api/logs/client', 0);
    expect(log.error).not.toHaveBeenCalled();
    expect(log.warn).not.toHaveBeenCalled();
  });

  it('does not log successful calls', () => {
    http.get('/api/jobs').subscribe();
    ctl.expectOne('/api/jobs').flush([]);
    expect(log.error).not.toHaveBeenCalled();
    expect(log.warn).not.toHaveBeenCalled();
  });
});
