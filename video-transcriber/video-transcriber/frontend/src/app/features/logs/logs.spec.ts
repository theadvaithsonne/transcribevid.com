import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LogEntry } from '../../core/models';
import { JobsStore } from '../../core/jobs.store';
import { ToastService } from '../../core/toast.service';
import { FakeEventSource, httpError, makePublicHealth, silentLog } from '../../testing/fakes';
import { LogsPage, displayLevel } from './logs';

function entry(seq: number, level: string, message = `message ${seq}`): LogEntry {
  return { seq, ts: 1_700_000_000 + seq, level, logger: 'app.test', message };
}

describe('displayLevel', () => {
  it('shows CRITICAL and FATAL as ERROR, in any case', () => {
    expect(displayLevel('CRITICAL')).toBe('ERROR');
    expect(displayLevel('FATAL')).toBe('ERROR');
    expect(displayLevel('critical')).toBe('ERROR');
  });

  it('leaves the other levels alone', () => {
    for (const l of ['DEBUG', 'INFO', 'WARNING', 'ERROR']) expect(displayLevel(l)).toBe(l);
  });

  it('does not throw on a missing level', () => {
    expect(displayLevel(undefined as unknown as string)).toBe('');
  });
});

// a few tests draw thousands of rows in jsdom: do not let the default 5 s decide on a busy machine
vi.setConfig({ testTimeout: 30_000 });

describe('LogsPage', () => {
  let fixture: ComponentFixture<LogsPage>;
  let page: LogsPage;
  let ctl: HttpTestingController;

  function setup(entries: LogEntry[]) {
    TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting()] });
    ctl = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LogsPage);
    page = fixture.componentInstance;
    ctl.expectOne((r) => r.url === '/api/logs').flush({ entries, last_seq: entries.at(-1)?.seq ?? 0 });
  }

  const all = [entry(1, 'INFO'), entry(2, 'ERROR'), entry(3, 'CRITICAL'), entry(4, 'DEBUG'), entry(5, 'WARNING')];

  beforeEach(() => {
    vi.useFakeTimers();
    FakeEventSource.reset();
    vi.stubGlobal('EventSource', FakeEventSource);
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('counts CRITICAL together with ERROR', () => {
    setup(all);
    expect(page.counts()).toMatchObject({ DEBUG: 1, INFO: 1, WARNING: 1, ERROR: 2 });
    expect(page.counts()['CRITICAL']).toBeUndefined();
  });

  it('shows CRITICAL rows under the default filter (they used to be filtered out for good)', () => {
    setup(all);
    expect(page.visible().map((e) => e.seq)).toEqual([1, 2, 3, 5]); // DEBUG is off by default
  });

  it('the ERROR chip toggles ERROR and CRITICAL rows together', () => {
    setup(all);
    page.toggleLevel('ERROR');
    expect(page.visible().map((e) => e.seq)).toEqual([1, 5]);
    page.toggleLevel('ERROR');
    expect(page.visible().map((e) => e.seq)).toEqual([1, 2, 3, 5]);
  });

  it('picks up a CRITICAL line from the live stream', () => {
    setup([entry(1, 'INFO')]);
    expect(FakeEventSource.instances.length).toBe(1);
    FakeEventSource.instances[0].emit('log', entry(2, 'CRITICAL', 'disk on fire'));
    expect(page.visible().map((e) => e.message)).toEqual(['message 1', 'disk on fire']);
    expect(page.counts()['ERROR']).toBe(1);
  });

  it('renders CRITICAL rows with the error styling and keeps their real level text', () => {
    setup(all);
    fixture.detectChanges();
    const rows: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('.row'));
    expect(rows.length).toBe(4);
    const errorRows = rows.filter((r) => r.classList.contains('ERROR'));
    expect(errorRows.map((r) => r.querySelector('.lv')?.textContent)).toEqual(['ERROR', 'CRITICAL']);
    expect(fixture.nativeElement.querySelectorAll('.row.CRITICAL').length).toBe(0);
  });

  describe('access: the admin token and a server without logs', () => {
    const logsReq = () => ctl.expectOne((r) => r.url === '/api/logs' && r.method === 'GET');
    const text = () => (fixture.nativeElement.textContent as string).replace(/\s+/g, ' ');

    function open() {
      TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
      ctl = TestBed.inject(HttpTestingController);
      fixture = TestBed.createComponent(LogsPage);
      page = fixture.componentInstance;
    }

    beforeEach(() => sessionStorage.clear());
    afterEach(() => sessionStorage.clear());

    it('sends no token when none is stored, and shows the logs when the server allows it', () => {
      open();
      const req = logsReq();
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({ entries: [entry(1, 'INFO')], last_seq: 1 });
      fixture.detectChanges();
      expect(page.access()).toBe('ok');
      expect(fixture.nativeElement.querySelectorAll('.row').length).toBe(1);
      expect(FakeEventSource.instances[0].url).toBe('/api/logs/stream?after=1');
    });

    it('asks for the token straight away when the server already said it wants one (no doomed request)', () => {
      TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
      ctl = TestBed.inject(HttpTestingController);
      TestBed.inject(JobsStore).health.set(makePublicHealth({ logs_enabled: true, logs_require_token: true }));
      fixture = TestBed.createComponent(LogsPage);
      page = fixture.componentInstance;
      fixture.detectChanges();
      expect(page.access()).toBe('token');
      expect(fixture.nativeElement.querySelector('input[type="password"]')).not.toBeNull();
      ctl.expectNone((r) => r.url === '/api/logs');

      page.tokenDraft = 'tok';
      page.submitToken();
      expect(logsReq().request.headers.get('Authorization')).toBe('Bearer tok');
    });

    it('does not ask when a token is already stored for this tab', () => {
      sessionStorage.setItem('vt-logs-token', 'kept');
      TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
      ctl = TestBed.inject(HttpTestingController);
      TestBed.inject(JobsStore).health.set(makePublicHealth({ logs_enabled: true, logs_require_token: true }));
      fixture = TestBed.createComponent(LogsPage);
      page = fixture.componentInstance;
      expect(logsReq().request.headers.get('Authorization')).toBe('Bearer kept');
    });

    it('asks for the access token on a 401 without one: no stream, no retries', () => {
      open();
      logsReq().flush(...httpError(401, 'Not authorized.'));
      fixture.detectChanges();
      expect(page.access()).toBe('token');
      expect(fixture.nativeElement.querySelector('input[type="password"]')).not.toBeNull();
      expect(text()).toContain('Enter the access token');
      expect(text()).not.toContain('not accepted');
      expect(FakeEventSource.instances.length).toBe(0);
      vi.advanceTimersByTime(20_000);
      ctl.expectNone((r) => r.url === '/api/logs');
    });

    it('sends the typed token as a bearer header, keeps it for this tab and streams with it', () => {
      open();
      logsReq().flush(...httpError(401));
      fixture.detectChanges();

      page.tokenDraft = '  s3cret ';
      page.submitToken();
      const req = logsReq();
      expect(req.request.headers.get('Authorization')).toBe('Bearer s3cret');
      expect(sessionStorage.getItem('vt-logs-token')).toBe('s3cret');
      req.flush({ entries: [entry(4, 'INFO')], last_seq: 4 });
      fixture.detectChanges();
      expect(page.access()).toBe('ok');
      expect(FakeEventSource.instances[0].url).toBe('/api/logs/stream?after=4&token=s3cret');
      expect(fixture.nativeElement.querySelector('input[type="password"]')).toBeNull();
    });

    it('does not submit an empty token', () => {
      open();
      logsReq().flush(...httpError(401));
      page.tokenDraft = '   ';
      page.submitToken();
      ctl.expectNone((r) => r.url === '/api/logs');
      expect(sessionStorage.getItem('vt-logs-token')).toBeNull();
    });

    it('uses a token stored earlier in this tab', () => {
      sessionStorage.setItem('vt-logs-token', 'kept');
      open();
      const req = logsReq();
      expect(req.request.headers.get('Authorization')).toBe('Bearer kept');
      req.flush({ entries: [], last_seq: 0 });
      expect(page.access()).toBe('ok');
    });

    it('says the token was not accepted, forgets it and asks again', () => {
      sessionStorage.setItem('vt-logs-token', 'wrong');
      open();
      logsReq().flush(...httpError(401, 'Bad token.'));
      fixture.detectChanges();
      expect(page.access()).toBe('denied');
      expect(sessionStorage.getItem('vt-logs-token')).toBeNull();
      expect(text()).toContain('That token was not accepted.');
      expect(fixture.nativeElement.querySelector('input[type="password"]')).not.toBeNull();
      ctl.expectNone((r) => r.url === '/api/logs');
    });

    it('says logs are turned off on a 404 and does not retry', () => {
      open();
      logsReq().flush(...httpError(404, 'Not found.'));
      fixture.detectChanges();
      expect(page.access()).toBe('disabled');
      expect(text()).toContain('Logs are turned off on this server.');
      expect(fixture.nativeElement.querySelector('a[href="/"]')).not.toBeNull();
      vi.advanceTimersByTime(20_000);
      ctl.expectNone((r) => r.url === '/api/logs');
      expect(FakeEventSource.instances.length).toBe(0);
    });

    it('still retries after a real outage (no connection, or a 500)', () => {
      open();
      logsReq().error(new ProgressEvent('error'));
      expect(page.access()).toBe('ok');
      vi.advanceTimersByTime(2000);
      logsReq().flush(...httpError(500));
      vi.advanceTimersByTime(2000);
      logsReq().flush({ entries: [], last_seq: 0 });
      expect(page.access()).toBe('ok');
    });

    it('asks for the token again when the stream drops and the server now refuses', () => {
      sessionStorage.setItem('vt-logs-token', 'old');
      open();
      logsReq().flush({ entries: [], last_seq: 0 });
      FakeEventSource.instances[0].fail();
      vi.advanceTimersByTime(2000);
      logsReq().flush(...httpError(401));
      expect(page.access()).toBe('denied');
    });

    it('clearing with a revoked token goes back to the prompt', () => {
      vi.stubGlobal('confirm', vi.fn(() => true));
      sessionStorage.setItem('vt-logs-token', 'old');
      open();
      logsReq().flush({ entries: [entry(1, 'INFO')], last_seq: 1 });
      page.clear();
      const del = ctl.expectOne((r) => r.url === '/api/logs' && r.method === 'DELETE');
      expect(del.request.headers.get('Authorization')).toBe('Bearer old');
      del.flush(...httpError(401));
      expect(page.access()).toBe('denied');
    });
  });

  it('closes the stream and stops retrying when destroyed', () => {
    setup(all);
    const es = FakeEventSource.instances[0];
    es.fail();
    fixture.destroy();
    vi.advanceTimersByTime(10_000);
    expect(es.closed).toBe(true);
    ctl.expectNone((r) => r.url === '/api/logs');
  });

  describe('level toggles with counts', () => {
    const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
    const qa = (sel: string) => Array.from(fixture.nativeElement.querySelectorAll(sel)) as HTMLElement[];
    const clean = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
    const toggles = () => qa('.levels button.lvl');
    const toggle = (level: string) => toggles().find((b) => clean(b).startsWith(level)) as HTMLButtonElement;
    const rowLevels = () => qa('.viewport .row .lv').map((r) => clean(r));

    function open(entries: LogEntry[]) {
      setup(entries);
      fixture.detectChanges();
    }

    it('has one toggle per level, in order, each with the number of lines of that level', () => {
      open(all);
      expect(toggles().map((b) => clean(b))).toEqual(['DEBUG 1', 'INFO 1', 'WARNING 1', 'ERROR 2']);
      expect(q('.levels')!.getAttribute('role')).toBe('group');
      expect(q('.levels')!.getAttribute('aria-label')).toBe('Filter by level');
    });

    it('counts all lines, also the ones that are hidden by the filter', () => {
      open([entry(1, 'DEBUG'), entry(2, 'DEBUG'), entry(3, 'DEBUG'), entry(4, 'INFO')]);
      expect(toggle('DEBUG').querySelector('b')!.textContent).toBe('3');
      expect(rowLevels()).toEqual(['INFO']); // DEBUG is off by default
    });

    it('shows INFO, WARNING and ERROR at first; DEBUG is off (and says so with aria-pressed and a class)', () => {
      open(all);
      expect(toggles().map((b) => b.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'true', 'true']);
      expect(toggles().map((b) => b.classList.contains('off'))).toEqual([true, false, false, false]);
      expect(rowLevels()).toEqual(['INFO', 'ERROR', 'CRITICAL', 'WARNING']);
    });

    it('pressing a toggle shows or hides the lines of that level', () => {
      open(all);
      toggle('DEBUG').click();
      fixture.detectChanges();
      expect(rowLevels()).toEqual(['INFO', 'ERROR', 'CRITICAL', 'DEBUG', 'WARNING']);
      expect(toggle('DEBUG').getAttribute('aria-pressed')).toBe('true');
      toggle('INFO').click();
      fixture.detectChanges();
      expect(rowLevels()).toEqual(['ERROR', 'CRITICAL', 'DEBUG', 'WARNING']);
      expect(toggle('INFO').classList.contains('off')).toBe(true);
    });

    it('the ERROR toggle takes the CRITICAL lines with it, and its number counts them', () => {
      open(all);
      toggle('ERROR').click();
      fixture.detectChanges();
      expect(rowLevels()).toEqual(['INFO', 'WARNING']);
      expect(toggle('ERROR').querySelector('b')!.textContent).toBe('2');
    });

    it('counts follow the live stream', () => {
      open([entry(1, 'INFO')]);
      FakeEventSource.instances[0].emit('log', entry(2, 'WARNING'));
      FakeEventSource.instances[0].emit('log', entry(3, 'WARNING'));
      fixture.detectChanges();
      expect(toggle('WARNING').querySelector('b')!.textContent).toBe('2');
      expect(rowLevels()).toEqual(['INFO', 'WARNING', 'WARNING']);
    });

    it('a search box filters by message or logger on top of the levels', () => {
      open([
        { seq: 1, ts: 1, level: 'INFO', logger: 'app.upload', message: 'Upload started' },
        { seq: 2, ts: 2, level: 'INFO', logger: 'app.jobs', message: 'Job queued' },
        { seq: 3, ts: 3, level: 'ERROR', logger: 'app.upload', message: 'Disk full' },
      ]);
      const input = q('input[type="search"]') as HTMLInputElement;
      input.value = 'upload';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(qa('.viewport .row .msg').map((m) => clean(m))).toEqual(['Upload started', 'Disk full']);
      toggle('ERROR').click();
      fixture.detectChanges();
      expect(qa('.viewport .row .msg').map((m) => clean(m))).toEqual(['Upload started']);
    });

    it('says why the list is empty: nothing yet, or nothing matches the filters', () => {
      open([]);
      expect(clean(q('.viewport .none'))).toBe('No log entries yet.');
      TestBed.resetTestingModule();
      open([entry(1, 'DEBUG')]);
      expect(clean(q('.viewport .none'))).toBe('No entries match the current filters.');
    });

    it('turning every level off shows no lines at all', () => {
      open(all);
      for (const l of ['INFO', 'WARNING', 'ERROR']) toggle(l).click();
      fixture.detectChanges();
      expect(rowLevels()).toEqual([]);
    });
  });

  describe('the live connection and the other buttons', () => {
    const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
    const clean = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

    it('says "Connecting…" at first and "Live" once the stream is open, in words and with a filled dot', () => {
      setup([entry(1, 'INFO')]);
      fixture.detectChanges();
      expect(clean(q('.conn'))).toBe('Connecting…');
      expect(q('.conn')!.classList.contains('live')).toBe(false);
      expect(q('.conn')!.getAttribute('role')).toBe('status');
      FakeEventSource.instances[0].onopen?.(new Event('open'));
      fixture.detectChanges();
      expect(clean(q('.conn'))).toBe('Live');
      expect(q('.conn')!.classList.contains('live')).toBe(true);
    });

    it('says "Reconnecting…" when the stream drops', () => {
      setup([entry(1, 'INFO')]);
      FakeEventSource.instances[0].fail();
      fixture.detectChanges();
      expect(clean(q('.conn'))).toBe('Reconnecting…');
      expect(q('.conn')!.classList.contains('live')).toBe(false);
    });

    it('the controls are quiet: no coloured main button, no pastel pills', () => {
      setup([entry(1, 'INFO')]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.logs .btn.primary').length).toBe(0);
      expect(fixture.nativeElement.querySelectorAll('.logs [class*="tint-"]').length).toBe(0);
      const follow = Array.from(fixture.nativeElement.querySelectorAll('.actions button')).find((b) => (b as HTMLElement).textContent!.includes('Follow')) as HTMLButtonElement;
      expect(follow.getAttribute('aria-pressed')).toBe('true');
      expect(follow.classList.contains('on')).toBe(true);
    });

    it('Pause holds new lines back and Resume shows them, with the number that are waiting', () => {
      setup([entry(1, 'INFO')]);
      fixture.detectChanges();
      const pause = () => Array.from(fixture.nativeElement.querySelectorAll('.actions button')).find((b) => /Pause|Resume/.test((b as HTMLElement).textContent!)) as HTMLButtonElement;
      pause().click();
      fixture.detectChanges();
      FakeEventSource.instances[0].emit('log', entry(2, 'INFO'));
      FakeEventSource.instances[0].emit('log', entry(3, 'INFO'));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.viewport .row').length).toBe(1);
      expect(clean(pause())).toBe('Resume (2 new)');
      expect(pause().getAttribute('aria-pressed')).toBe('true');
      pause().click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.viewport .row').length).toBe(3);
      expect(clean(pause())).toBe('Pause');
    });

    it('Download is disabled while no line is shown', () => {
      setup([]);
      fixture.detectChanges();
      const dl = Array.from(fixture.nativeElement.querySelectorAll('.actions button')).find((b) => (b as HTMLElement).textContent!.includes('Download')) as HTMLButtonElement;
      expect(dl.disabled).toBe(true);
    });

    it('Download saves the lines shown and says so in a toast', () => {
      setup([entry(1, 'INFO'), entry(2, 'ERROR')]);
      URL.createObjectURL = vi.fn(() => 'blob:logs');
      URL.revokeObjectURL = vi.fn();
      const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      page.download();
      expect(click).toHaveBeenCalledTimes(1);
      expect(TestBed.inject(ToastService).toasts().at(-1)).toMatchObject({ kind: 'success', title: 'Download started', message: '2 lines. Look for it in your downloads.' });
      click.mockRestore();
    });

    it('Clear asks first, then empties the list and says so', () => {
      vi.stubGlobal('confirm', vi.fn(() => true));
      setup([entry(1, 'INFO')]);
      fixture.detectChanges();
      page.clear();
      expect(vi.mocked(confirm).mock.calls[0][0]).toBe('Clear all log entries on the server?');
      expect(page.clearing()).toBe(true);
      page.clear(); // a second press while it is on its way sends nothing
      ctl.expectOne((r) => r.url === '/api/logs' && r.method === 'DELETE').flush(null);
      fixture.detectChanges();
      expect(page.entries()).toEqual([]);
      expect(page.clearing()).toBe(false);
      expect(clean(q('.viewport .none'))).toBe('No log entries yet.');
      expect(TestBed.inject(ToastService).toasts().at(-1)).toMatchObject({ kind: 'success', title: 'Logs cleared' });
    });

    it('Clear that fails says so in a toast and keeps the lines', () => {
      vi.stubGlobal('confirm', vi.fn(() => true));
      setup([entry(1, 'INFO')]);
      page.clear();
      ctl.expectOne((r) => r.url === '/api/logs' && r.method === 'DELETE').flush(...httpError(500));
      expect(page.entries().length).toBe(1);
      expect(page.clearing()).toBe(false);
      expect(TestBed.inject(ToastService).toasts().at(-1)).toMatchObject({ kind: 'error', title: 'Logs not cleared' });
    });

    it('Clear does nothing when declined', () => {
      vi.stubGlobal('confirm', vi.fn(() => false));
      setup([entry(1, 'INFO')]);
      page.clear();
      ctl.expectNone((r) => r.method === 'DELETE');
      expect(page.entries().length).toBe(1);
    });

    it('keeps at most 3000 lines, the oldest go first (the page is not drawn: 3000 rows are slow in jsdom)', () => {
      setup(Array.from({ length: 3005 }, (_, i) => entry(i + 1, 'INFO')));
      expect(page.entries().length).toBe(3000);
      expect(page.entries()[0].seq).toBe(6);
      expect(page.entries().at(-1)!.seq).toBe(3005);
      FakeEventSource.instances[0].emit('log', entry(3006, 'INFO'));
      expect(page.entries().length).toBe(3000);
      expect(page.entries()[0].seq).toBe(7);
    });

    it('says how many lines it keeps', () => {
      setup([entry(1, 'INFO')]);
      fixture.detectChanges();
      expect(clean(q('.foot'))).toContain('Showing at most 3000 recent lines.');
    });

    it('starts over when the server was restarted (its numbering began again)', () => {
      setup([entry(10, 'INFO'), entry(11, 'INFO')]);
      FakeEventSource.instances[0].fail();
      vi.advanceTimersByTime(2000);
      ctl.expectOne((r) => r.url === '/api/logs' && r.params.get('after') === '11').flush({ entries: [], last_seq: 3 });
      ctl.expectOne((r) => r.url === '/api/logs' && r.params.get('after') === '0').flush({ entries: [entry(1, 'INFO')], last_seq: 1 });
      expect(page.entries().map((e) => e.seq)).toEqual([1]);
    });

    it('does not show the same line twice (the stream may send what was already loaded)', () => {
      setup([entry(1, 'INFO'), entry(2, 'INFO')]);
      FakeEventSource.instances[0].emit('log', entry(2, 'INFO'));
      FakeEventSource.instances[0].emit('log', entry(3, 'INFO'));
      expect(page.entries().map((e) => e.seq)).toEqual([1, 2, 3]);
    });

    it('ignores a malformed event from the stream', () => {
      setup([entry(1, 'INFO')]);
      const es = FakeEventSource.instances[0] as unknown as { listeners: Map<string, ((e: MessageEvent) => void)[]> };
      for (const fn of es.listeners.get('log') ?? []) fn({ data: '{nope' } as MessageEvent);
      expect(page.entries().length).toBe(1);
    });
  });
});
