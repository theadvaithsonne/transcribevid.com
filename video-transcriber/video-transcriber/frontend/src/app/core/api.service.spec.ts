import { HttpEventType } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FakeEventSource, makeSummary } from '../testing/fakes';
import { ApiService, UploadState } from './api.service';
import { DEFAULT_OPTIONS } from './models';

describe('ApiService', () => {
  let api: ApiService;
  let ctl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(ApiService);
    ctl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => ctl.verify());

  describe('createJob', () => {
    const file = new File(['abc'], 'My Talk (1).mp4', { type: 'video/mp4' });

    function start() {
      const states: UploadState[] = [];
      let error: unknown;
      let completed = false;
      api.createJob(file, { ...DEFAULT_OPTIONS, language: 'de' }).subscribe({
        next: (s) => states.push(s),
        error: (e) => (error = e),
        complete: () => (completed = true),
      });
      const req = ctl.expectOne((r) => r.url === '/api/jobs');
      return { states, req, error: () => error, completed: () => completed };
    }

    it('posts the raw file with its name and options as query parameters', () => {
      const { req } = start();
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe(file);
      expect(req.request.reportProgress).toBe(true);
      expect(req.request.headers.get('Content-Type')).toBe('application/octet-stream');
      expect(req.request.params.get('filename')).toBe('My Talk (1).mp4');
      expect(JSON.parse(req.request.params.get('options')!)).toMatchObject({ model: 'small', language: 'de', prompt: '' });
      // the folder feature is gone: the only query parameters are the file name and the options
      expect(req.request.params.keys().sort()).toEqual(['filename', 'options']);
      req.flush(makeSummary());
    });

    it('maps upload progress events to a 0..1 fraction with byte counts', () => {
      const { states, req } = start();
      req.event({ type: HttpEventType.UploadProgress, loaded: 50, total: 200 });
      req.event({ type: HttpEventType.UploadProgress, loaded: 200, total: 200 });
      expect(states).toEqual([
        { progress: 0.25, loaded: 50, total: 200 },
        { progress: 1, loaded: 200, total: 200 },
      ]);
      req.flush(makeSummary());
    });

    it('reports 0 progress (not NaN / Infinity) when the total is unknown', () => {
      const { states, req } = start();
      req.event({ type: HttpEventType.UploadProgress, loaded: 1234 });
      expect(states).toEqual([{ progress: 0, loaded: 1234, total: undefined }]);
      req.flush(makeSummary());
    });

    it('ignores events that are neither progress nor the final response', () => {
      const { states, req } = start();
      req.event({ type: HttpEventType.Sent });
      req.event({ type: HttpEventType.ResponseHeader, status: 200, statusText: 'OK', headers: req.request.headers, ok: true, url: null } as never);
      expect(states).toEqual([]);
      req.flush(makeSummary());
    });

    it('finishes with progress 1 and the created job, then completes', () => {
      const { states, req, completed } = start();
      const job = makeSummary({ id: 'new', status: 'queued', progress: 0 });
      req.event({ type: HttpEventType.UploadProgress, loaded: 3, total: 3 });
      req.flush(job);
      expect(states.at(-1)).toEqual({ progress: 1, job });
      expect(states.filter((s) => s.job).length).toBe(1);
      expect(completed()).toBe(true);
    });

    it('fails with the HTTP error (status and server detail intact)', () => {
      const { states, req, error } = start();
      req.flush({ detail: 'File too large (max 4 GB).' }, { status: 413, statusText: 'Payload Too Large' });
      expect(states).toEqual([]);
      expect(error()).toMatchObject({ status: 413, error: { detail: 'File too large (max 4 GB).' } });
    });

    it('fails with status 0 on a network error', () => {
      const { req, error } = start();
      req.error(new ProgressEvent('error'));
      expect(error()).toMatchObject({ status: 0 });
    });

    it('cancels the request when unsubscribed', () => {
      const sub = api.createJob(file, DEFAULT_OPTIONS).subscribe();
      const req = ctl.expectOne((r) => r.url === '/api/jobs');
      sub.unsubscribe();
      expect(req.cancelled).toBe(true);
    });
  });

  describe('session', () => {
    it('reads the visitor session', () => {
      let got: unknown;
      api.session().subscribe((s) => (got = s));
      const req = ctl.expectOne('/api/session');
      expect(req.request.method).toBe('GET');
      req.flush({ session_id: 's', expires_in_seconds: 100 });
      expect(got).toEqual({ session_id: 's', expires_in_seconds: 100 });
    });

    it('deletes everything of this visitor at once (204)', () => {
      let done = false;
      api.deleteSession().subscribe(() => (done = true));
      const req = ctl.expectOne('/api/session');
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 204, statusText: 'No Content' });
      expect(done).toBe(true);
    });
  });

  describe('stats (the "videos transcribed" counter)', () => {
    it('reads GET /api/stats with no special headers by default, so the browser may reuse the answer', () => {
      let got: unknown;
      api.stats().subscribe((s) => (got = s));
      const req = ctl.expectOne('/api/stats');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Cache-Control')).toBe(false);
      req.flush({ transcribed: 1234, counting: true });
      expect(got).toEqual({ transcribed: 1234, counting: true });
    });

    it('asks for a fresh answer (Cache-Control: no-cache) when told to', () => {
      api.stats(true).subscribe();
      const req = ctl.expectOne('/api/stats');
      expect(req.request.headers.get('Cache-Control')).toBe('no-cache');
      req.flush({ transcribed: 0, counting: false });
    });
  });

  describe('jobs', () => {
    it('lists, reads, renames / edits, cancels, re-runs and deletes through /api/jobs', () => {
      api.listJobs().subscribe();
      expect(ctl.expectOne('/api/jobs').request.method).toBe('GET');

      api.getJob('j1').subscribe();
      expect(ctl.expectOne('/api/jobs/j1').request.method).toBe('GET');

      api.patchJob('j1', { title: 'New' }).subscribe();
      const patch = ctl.expectOne('/api/jobs/j1');
      expect(patch.request.method).toBe('PATCH');
      expect(patch.request.body).toEqual({ title: 'New' });

      api.cancel('j1').subscribe();
      const cancel = ctl.expectOne('/api/jobs/j1/cancel');
      expect(cancel.request.method).toBe('POST');

      api.rerun('j1', { model: 'large-v3' }).subscribe();
      const rerun = ctl.expectOne('/api/jobs/j1/rerun');
      expect(rerun.request.method).toBe('POST');
      expect(rerun.request.body).toEqual({ model: 'large-v3' });

      api.delete('j1').subscribe();
      expect(ctl.expectOne('/api/jobs/j1').request.method).toBe('DELETE');
    });

    it('has no folder methods any more', () => {
      const names = Object.getOwnPropertyNames(Object.getPrototypeOf(api));
      expect(names.filter((n) => /folder/i.test(n))).toEqual([]);
    });
  });

  describe('reference data', () => {
    it('reads health, models and languages', () => {
      api.health().subscribe();
      api.models().subscribe();
      api.languages().subscribe();
      expect(ctl.expectOne('/api/health').request.method).toBe('GET');
      expect(ctl.expectOne('/api/models').request.method).toBe('GET');
      expect(ctl.expectOne('/api/languages').request.method).toBe('GET');
    });

    it('exports plain text through the export url', () => {
      let text = '';
      api.exportText('abc', 'txt').subscribe((t) => (text = t));
      const req = ctl.expectOne('/api/jobs/abc/export?format=txt');
      expect(req.request.responseType).toBe('text');
      req.flush('[00:00] hello');
      expect(text).toBe('[00:00] hello');
    });
  });

  describe('logs and the admin token', () => {
    afterEach(() => sessionStorage.clear());

    it('sends no Authorization header without a token', () => {
      api.logs(5).subscribe();
      const req = ctl.expectOne((r) => r.url === '/api/logs');
      expect(req.request.headers.has('Authorization')).toBe(false);
      expect(req.request.params.get('after')).toBe('5');
      req.flush({ entries: [], last_seq: 0 });
      expect(api.logsStreamUrl(7)).toBe('/api/logs/stream?after=7');
    });

    it('sends the token as a bearer header for reading and clearing', () => {
      sessionStorage.setItem('vt-logs-token', 's3cret');
      api.logs().subscribe();
      const read = ctl.expectOne((r) => r.url === '/api/logs' && r.method === 'GET');
      expect(read.request.headers.get('Authorization')).toBe('Bearer s3cret');
      read.flush({ entries: [], last_seq: 0 });
      api.clearLogs().subscribe();
      const clear = ctl.expectOne((r) => r.url === '/api/logs' && r.method === 'DELETE');
      expect(clear.request.headers.get('Authorization')).toBe('Bearer s3cret');
      clear.flush(null);
    });

    it('puts the token in the query string of the live stream (EventSource cannot send headers), encoded', () => {
      sessionStorage.setItem('vt-logs-token', 'a b&c');
      expect(api.logsStreamUrl(3)).toBe('/api/logs/stream?after=3&token=a%20b%26c');
    });
  });

  describe('urls', () => {
    it('builds export urls with extra parameters', () => {
      expect(api.exportUrl('abc', 'srt')).toBe('/api/jobs/abc/export?format=srt');
      expect(api.exportUrl('abc', 'vtt', { max_chars: 42 })).toBe('/api/jobs/abc/export?format=vtt&max_chars=42');
    });
  });

  describe('watch (server-sent events)', () => {
    beforeEach(() => {
      FakeEventSource.reset();
      vi.stubGlobal('EventSource', FakeEventSource);
    });
    afterEach(() => vi.unstubAllGlobals());

    it('opens the stream from the given segment and forwards job / segments events', () => {
      const seen: unknown[] = [];
      api.watch('j1', 4).subscribe((e) => seen.push(e));
      const es = FakeEventSource.instances[0];
      expect(es.url).toBe('/api/jobs/j1/events?since=4');
      es.emit('segments', [{ id: 5 }]);
      es.emit('job', { id: 'j1', progress: 0.5 });
      expect(seen).toEqual([
        { type: 'segments', data: [{ id: 5 }] },
        { type: 'job', data: { id: 'j1', progress: 0.5 } },
      ]);
    });

    it('completes and closes on the end event', () => {
      let done = false;
      api.watch('j1').subscribe({ complete: () => (done = true) });
      const es = FakeEventSource.instances[0];
      es.emit('end', {});
      expect(done).toBe(true);
      expect(es.closed).toBe(true);
    });

    it('closes the connection when unsubscribed', () => {
      const sub = api.watch('j1').subscribe();
      const es = FakeEventSource.instances[0];
      sub.unsubscribe();
      expect(es.closed).toBe(true);
    });

    it('errors only when the browser gave up reconnecting', () => {
      let err: unknown;
      api.watch('j1').subscribe({ error: (e) => (err = e) });
      const es = FakeEventSource.instances[0];
      es.readyState = FakeEventSource.CONNECTING;
      es.onerror?.(new Event('error')); // the browser is retrying on its own
      expect(err).toBeUndefined();
      es.fail();
      expect(err).toBeInstanceOf(Error);
    });
  });
});
