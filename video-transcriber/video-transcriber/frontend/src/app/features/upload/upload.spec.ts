import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { JobsStore } from '../../core/jobs.store';
import { ModelInfo } from '../../core/models';
import { PendingFileService } from '../../core/pending-file.service';
import { httpError, makeBrowserHealth, makeHealth, makePublicHealth, makeSummary, silentLog } from '../../testing/fakes';
import { UploadPage } from './upload';
import { ToastService } from '../../core/toast.service';

class FakeRecorder {
  static instances: FakeRecorder[] = [];
  state: 'inactive' | 'recording' = 'inactive';
  mimeType = 'audio/webm';
  stopCalls = 0;
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public stream: unknown) {
    FakeRecorder.instances.push(this);
  }
  start() {
    this.state = 'recording';
  }
  stop() {
    this.stopCalls++;
    this.state = 'inactive';
    this.onstop?.();
  }
}

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function fakeStream() {
  const track = { stop: vi.fn() };
  return { stream: { getTracks: () => [track] } as unknown as MediaStream, track };
}

function media(name: string, size?: number) {
  const f = new File(['x'], name, { type: 'video/mp4' });
  if (size !== undefined) Object.defineProperty(f, 'size', { value: size });
  return f;
}

describe('UploadPage', () => {
  let fixture: ComponentFixture<UploadPage>;
  let page: UploadPage;
  let ctl: HttpTestingController;
  let store: JobsStore;
  let navigate: ReturnType<typeof vi.fn>;
  let getUserMedia: ReturnType<typeof vi.fn>;

  /** `waiting`: a file chosen on a keyword page that is already waiting when the page opens. */
  function setup(waiting?: File) {
    TestBed.configureTestingModule({
      providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    ctl = TestBed.inject(HttpTestingController);
    store = TestBed.inject(JobsStore);
    for (const r of ctl.match(() => true)) r.flush(r.request.url.endsWith('/health') ? { status: 'ok' } : []);
    navigate = vi.fn(() => Promise.resolve(true));
    TestBed.inject(Router).navigate = navigate as unknown as Router['navigate'];
    if (waiting) TestBed.inject(PendingFileService).set(waiting);
    fixture = TestBed.createComponent(UploadPage);
    page = fixture.componentInstance;
  }

  /** The pending upload request (a POST; the store's list refresh is a GET to the same url). */
  const uploadReq = (): TestRequest => ctl.expectOne((r) => r.url === '/api/jobs' && r.method === 'POST');
  const listReq = (): TestRequest => ctl.expectOne((r) => r.url === '/api/jobs' && r.method === 'GET');

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    FakeRecorder.instances = [];
    getUserMedia = vi.fn();
    Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia }, configurable: true });
    vi.stubGlobal('MediaRecorder', FakeRecorder);
    Element.prototype.scrollIntoView = vi.fn(); // jsdom has no scrolling; the zoneless fixture renders the page
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    Reflect.deleteProperty(navigator, 'mediaDevices');
    sessionStorage.clear();
  });

  describe('microphone recording cleanup', () => {
    async function record() {
      const s = fakeStream();
      getUserMedia.mockResolvedValue(s.stream);
      await page.toggleRecording();
      return { ...s, rec: FakeRecorder.instances[0] };
    }

    it('records, then stops and adds the recording as a file (releasing the microphone)', async () => {
      setup();
      const { rec, track } = await record();
      expect(page.recording()).toBe(true);
      expect(rec.state).toBe('recording');
      rec.ondataavailable?.({ data: new Blob(['audio-bytes']) });
      vi.advanceTimersByTime(2000);
      expect(page.recSeconds()).toBe(2);

      await page.toggleRecording(); // stop
      expect(page.recording()).toBe(false);
      expect(track.stop).toHaveBeenCalled();
      expect(page.files().length).toBe(1);
      expect(page.files()[0].name).toMatch(/^Recording .*\.webm$/);
      vi.advanceTimersByTime(3000);
      expect(page.recSeconds()).toBe(2); // the timer is gone
    });

    it('stops the recorder, the microphone and the timer when the page is left while recording', async () => {
      setup();
      const { rec, track } = await record();
      vi.advanceTimersByTime(3000);
      expect(page.recSeconds()).toBe(3);

      fixture.destroy();

      expect(rec.stopCalls).toBe(1);
      expect(track.stop).toHaveBeenCalled();
      vi.advanceTimersByTime(5000);
      expect(page.recSeconds()).toBe(3); // the interval no longer ticks
      expect(page.files()).toEqual([]); // the half recording is dropped, not added to a dead page
    });

    it('ignores a second click while the permission prompt is open (one recorder only)', async () => {
      setup();
      const gate = deferred<MediaStream>();
      const s = fakeStream();
      getUserMedia.mockReturnValue(gate.promise);

      const first = page.toggleRecording();
      const second = page.toggleRecording();
      expect(page.micBusy()).toBe(true);
      expect(getUserMedia).toHaveBeenCalledTimes(1);

      gate.resolve(s.stream);
      await Promise.all([first, second]);
      expect(FakeRecorder.instances.length).toBe(1);
      expect(page.recording()).toBe(true);
      expect(page.micBusy()).toBe(false);
    });

    it('releases a microphone that was granted after the page was left', async () => {
      setup();
      const gate = deferred<MediaStream>();
      const s = fakeStream();
      getUserMedia.mockReturnValue(gate.promise);
      const pending = page.toggleRecording();
      fixture.destroy();
      gate.resolve(s.stream);
      await pending;
      expect(s.track.stop).toHaveBeenCalled();
      expect(FakeRecorder.instances.length).toBe(0);
      expect(page.recording()).toBe(false);
    });

    it('can try again after a denied permission', async () => {
      setup();
      getUserMedia.mockRejectedValueOnce(new Error('NotAllowedError'));
      await page.toggleRecording();
      // a short toast that says what to do; nothing stays on the page
      expect(page.error()).toBe('');
      expect(TestBed.inject(ToastService).toasts().at(-1)).toMatchObject({
        kind: 'error',
        title: 'No microphone',
        message: 'Allow the microphone in your browser, or choose a file instead.',
      });
      expect(page.micBusy()).toBe(false);
      expect(page.recording()).toBe(false);
      await record();
      expect(page.recording()).toBe(true);
    });

    it('releases the microphone if the recorder cannot be created', async () => {
      setup();
      const s = fakeStream();
      getUserMedia.mockResolvedValue(s.stream);
      vi.stubGlobal('MediaRecorder', class {
        constructor() {
          throw new Error('NotSupportedError');
        }
      });
      await page.toggleRecording();
      expect(s.track.stop).toHaveBeenCalled();
      expect(page.recording()).toBe(false);
      expect(page.error()).toMatch(/not supported/);
    });

    it('reports an empty recording instead of adding a 0-byte file', async () => {
      setup();
      await record();
      await page.toggleRecording();
      expect(page.files()).toEqual([]);
      expect(page.error()).toMatch(/Nothing was recorded/);
    });

    it('does not start recording while an upload is running', async () => {
      setup();
      page.uploading.set(true);
      await page.toggleRecording();
      expect(getUserMedia).not.toHaveBeenCalled();
    });
  });

  describe('upload lifecycle', () => {
    it('shows success for a moment, then opens the new transcript and clears the list', () => {
      setup();
      page.addFiles([media('a.mp4')]);
      page.start();
      expect(page.uploading()).toBe(true);
      uploadReq().flush(makeSummary({ id: 'j1', status: 'queued' }));
      expect(page.uploadDone()).toBe(true);
      expect(navigate).not.toHaveBeenCalled();
      expect(store.jobs().map((j) => j.id)).toEqual(['j1']);
      listReq().flush([makeSummary({ id: 'j1' })]); // the history refresh

      vi.advanceTimersByTime(1400);
      expect(navigate).toHaveBeenCalledWith(['/jobs', 'j1'], { state: { justUploaded: 1 } });
      expect(page.files()).toEqual([]);
      expect(page.uploading()).toBe(false);
    });

    it('leaving mid-upload: the upload keeps going, the history still refreshes, nothing navigates', () => {
      setup();
      page.addFiles([media('a.mp4')]);
      page.start();
      const req = uploadReq();
      fixture.destroy();
      expect(req.cancelled).toBe(false);

      req.flush(makeSummary({ id: 'j1', status: 'queued' }));
      expect(store.jobs().map((j) => j.id)).toEqual(['j1']);
      listReq().flush([makeSummary({ id: 'j1' })]); // store.refresh() after success
      vi.advanceTimersByTime(5000);
      expect(navigate).not.toHaveBeenCalled();
      expect(page.uploadDone()).toBe(false); // page state untouched
    });

    it('leaving during the success pause cancels the pending navigation', () => {
      setup();
      page.addFiles([media('a.mp4')]);
      page.start();
      uploadReq().flush(makeSummary({ id: 'j1' }));
      listReq().flush([]);
      expect(page.uploadDone()).toBe(true);

      fixture.destroy();
      vi.advanceTimersByTime(3000);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('leaving mid-upload and then failing: tells the user with the toast', () => {
      setup();
      page.addFiles([media('a.mp4')]);
      page.start();
      const req = uploadReq();
      fixture.destroy();
      req.flush(...httpError(500, 'Disk is full.'));
      expect(store.toast()).toBe('Disk is full.');
      expect(TestBed.inject(ToastService).toasts().at(-1)).toMatchObject({ kind: 'error', title: 'Upload failed' });
      expect(navigate).not.toHaveBeenCalled();
    });

    it('does not start twice (double click)', () => {
      setup();
      page.addFiles([media('a.mp4')]);
      page.start();
      page.start();
      uploadReq(); // exactly one
    });

    it('files added or removed while uploading are refused, with an explanation', () => {
      setup();
      page.addFiles([media('a.mp4')]);
      page.start();
      page.addFiles([media('late.mp4')]);
      expect(page.files().map((f) => f.name)).toEqual(['a.mp4']);
      expect(page.error()).toMatch(/upload is in progress/i);
      page.removeFile(0);
      expect(page.files().length).toBe(1);
      uploadReq().flush(makeSummary({ id: 'j1' }));
    });
  });

  describe('failure part-way through several files', () => {
    it('removes the files that were already queued so a retry does not upload them again', () => {
      setup();
      const [f1, f2, f3] = [media('one.mp4'), media('two.mp4'), media('three.mp4')];
      page.addFiles([f1, f2, f3]);
      page.start();

      const r1 = uploadReq();
      expect(r1.request.body).toBe(f1);
      r1.flush(makeSummary({ id: 'j1', created_at: 1 }));
      const r2 = uploadReq();
      expect(r2.request.body).toBe(f2);
      r2.flush(...httpError(500, 'Conversion exploded.'));

      expect(page.uploading()).toBe(false);
      expect(page.files()).toEqual([f2, f3]);
      expect(page.error()).toContain('Conversion exploded.');
      expect(page.error()).toContain('1 of 3 file(s) were already queued');
      expect(page.error()).toContain('the other 2 are still in the list');
      expect(store.jobs().map((j) => j.id)).toEqual(['j1']);
      listReq().flush([makeSummary({ id: 'j1' })]); // history refresh because something was created

      // retry
      page.start();
      expect(uploadReq().request.body).toBe(f2);
    });

    it('keeps everything when the very first file fails', () => {
      setup();
      const [f1, f2] = [media('one.mp4'), media('two.mp4')];
      page.addFiles([f1, f2]);
      page.start();
      uploadReq().flush(...httpError(500, 'Nope.'));
      expect(page.files()).toEqual([f1, f2]);
      expect(page.error()).toBe('Nope.');
    });
  });

  describe('server limits', () => {
    const limit4gb = () => store.health.set({ status: 'ok', version: '1', device: 'cpu', compute_type: 'int8', max_upload_mb: 4096 });
    const big = () => media('big.mp4', Math.round(5.2 * 1024 ** 3));

    it('refuses a file over max_upload_mb before it is sent, with a clear message', () => {
      setup();
      limit4gb();
      page.addFiles([big(), media('small.mp4')]);
      expect(page.files().map((f) => f.name)).toEqual(['small.mp4']);
      expect(page.error()).toBe('File "big.mp4" is 5.2 GB; the limit is 4 GB - set VT_MAX_UPLOAD_MB to raise it');
      ctl.expectNone((r) => r.method === 'POST');
    });

    it('also checks at start, in case the limit became known after the file was added', () => {
      setup();
      page.addFiles([big()]);
      expect(page.files().length).toBe(1);
      limit4gb();
      page.start();
      expect(page.uploading()).toBe(false);
      expect(page.error()).toContain('the limit is 4 GB');
      ctl.expectNone((r) => r.method === 'POST');
    });

    it('accepts everything when the server reports no limit', () => {
      setup();
      page.addFiles([big()]);
      expect(page.files().length).toBe(1);
    });

    it('shows the server text for 413 and 507', () => {
      setup();
      page.addFiles([media('a.mp4')]);
      page.start();
      uploadReq().flush(...httpError(413, 'File exceeds the 4 GB upload limit.'));
      expect(page.error()).toBe('File exceeds the 4 GB upload limit.');

      page.start();
      uploadReq().flush(...httpError(507, 'Not enough free disk space.'));
      expect(page.error()).toBe('Not enough free disk space.');
    });

    it('has sensible text for 413 / 507 / 5xx without a server message, and for an unreachable server', () => {
      setup();
      page.addFiles([media('a.mp4')]);
      const failWith = (status: number) => {
        page.start();
        uploadReq().flush(...httpError(status));
        return page.error();
      };
      expect(failWith(413)).toMatch(/larger than the server accepts/);
      expect(failWith(507)).toMatch(/free disk space/);
      expect(failWith(502)).toMatch(/server error 502/);
      page.start();
      uploadReq().error(new ProgressEvent('error'));
      expect(page.error()).toMatch(/Cannot reach the server/);
    });

    it('skips files that are not audio or video: a toast says so, the good files are kept', () => {
      setup();
      page.addFiles([new File(['x'], 'notes.txt', { type: 'text/plain' }), media('a.mp4'), new File(['x'], 'clip.MKV')]);
      expect(page.files().map((f) => f.name)).toEqual(['a.mp4', 'clip.MKV']);
      expect(page.error()).toBe('');
      expect(TestBed.inject(ToastService).toasts().at(-1)).toMatchObject({ kind: 'warning', title: 'File skipped', message: '1 file was skipped: not video or audio.' });
    });

    it('only files that are not audio or video: an inline message that stays until the next try', () => {
      setup();
      page.addFiles([new File(['x'], 'a.txt'), new File(['x'], 'b.pdf')]);
      expect(page.files()).toEqual([]);
      expect(page.error()).toBe('None of those are video or audio files.');
    });

    it('the same file twice is added once, with a short note', () => {
      setup();
      const same = () => new File(['abc'], 'talk.mp4', { type: 'video/mp4', lastModified: 42 });
      page.addFiles([same()]);
      page.addFiles([same()]);
      expect(page.files().map((f) => f.name)).toEqual(['talk.mp4']);
      expect(TestBed.inject(ToastService).toasts().at(-1)).toMatchObject({ kind: 'info', title: 'Already added' });
      // a different file with the same name is a different file
      page.addFiles([new File(['abcd'], 'talk.mp4', { type: 'video/mp4', lastModified: 42 })]);
      expect(page.files().length).toBe(2);
    });
  });

  describe('wording: where do the files go?', () => {
    const page$ = () => (fixture.nativeElement as HTMLElement).textContent!.replace(/\s+/g, ' ');
    const note = () => (fixture.nativeElement.querySelector('.submit .note') as HTMLElement).textContent!.replace(/\s+/g, ' ').trim();

    it('local install: nothing is saved, and no link to a privacy policy', () => {
      setup();
      store.health.set(makeHealth());
      fixture.detectChanges();
      expect(note()).toBe('Nothing is saved. Export what you need.');
      expect(fixture.nativeElement.querySelector('.submit .note a')).toBeNull();
    });

    it('public site: files are deleted automatically, with a link to the privacy policy', () => {
      setup();
      store.health.set(makePublicHealth({ session_idle_minutes: 30 }));
      fixture.detectChanges();
      expect(note()).toBe('Your files are deleted automatically. Privacy');
      expect(fixture.nativeElement.querySelector('.submit .note a')?.getAttribute('href')).toBe('/privacy');
      expect(page$()).not.toContain('Private, on your computer');
    });

    it('the page has one title and the three chips, and no long sentences above the work area', () => {
      setup();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('h1').length).toBe(1);
      expect(Array.from(fixture.nativeElement.querySelectorAll('.trust li')).map((l) => (l as Element).textContent!.trim())).toEqual(['Free', 'Unlimited', 'No login']);
      expect(fixture.nativeElement.querySelector('.lead')).toBeNull();
    });

    it('names the size and duration limits of the server', () => {
      setup();
      store.health.set(makePublicHealth({ max_upload_mb: 2048, max_duration_min: 60 }));
      fixture.detectChanges();
      expect(page$()).toContain('Up to 2 GB and 60 minutes per file.');
      store.health.set(makePublicHealth({ max_upload_mb: 2048, max_duration_min: 0 }));
      fixture.detectChanges();
      expect(page$()).toContain('Up to 2 GB per file.');
      expect(page$()).not.toContain('minutes per file');
    });

    it('names no limit (and says what it takes instead) when the server has none', () => {
      setup();
      store.health.set(makePublicHealth({ max_upload_mb: undefined, max_duration_min: 0 }));
      fixture.detectChanges();
      expect(page$()).not.toContain('Up to');
      expect(fixture.nativeElement.querySelector('.drop-hint').textContent).toContain('Video or audio, several at once is fine.');
    });

    it('public site: the oversize message does not tell visitors to change a server setting', () => {
      setup();
      store.health.set(makePublicHealth({ max_upload_mb: 4096 }));
      page.addFiles([media('big.mp4', Math.round(5.2 * 1024 ** 3))]);
      expect(page.error()).toBe('File "big.mp4" is 5.2 GB; the limit is 4 GB.');
    });

    it('public site: an unreachable server is a connection problem, not a developer problem', () => {
      setup();
      store.health.set(makePublicHealth());
      page.addFiles([media('a.mp4')]);
      page.start();
      uploadReq().error(new ProgressEvent('error'));
      expect(page.error()).toBe('Cannot reach the server. Check your connection and try again.');
      page.start();
      uploadReq().flush(...httpError(502));
      expect(page.error()).toBe('Upload failed (server error 502). Please try again in a moment.');
    });
  });

  describe('busy or full server', () => {
    it('shows the server text inline for 429 and 503', () => {
      setup();
      page.addFiles([media('a.mp4')]);
      page.start();
      uploadReq().flush(...httpError(429, 'You already have 3 transcripts running. Wait for one to finish.'));
      fixture.detectChanges();
      expect(page.uploading()).toBe(false);
      expect(page.error()).toBe('You already have 3 transcripts running. Wait for one to finish.');
      expect(fixture.nativeElement.querySelector('.alert')?.textContent).toContain('You already have 3 transcripts running.');
      expect(page.files().length).toBe(1); // still in the list: press Transcribe to try again

      page.start();
      uploadReq().flush(...httpError(503, 'The server is full. Please try again later.'));
      expect(page.error()).toBe('The server is full. Please try again later.');
    });

    it('has plain texts when the server gives none', () => {
      setup();
      page.addFiles([media('a.mp4')]);
      page.start();
      uploadReq().flush(...httpError(429));
      expect(page.error()).toBe('The service is busy right now. Please wait a moment and try again.');
      page.start();
      uploadReq().flush(...httpError(503));
      expect(page.error()).toBe('The service is full right now. Please try again in a little while.');
    });
  });

  describe('models the server allows', () => {
    const titles = () => Array.from(fixture.nativeElement.querySelectorAll('.preset b')).map((b) => (b as HTMLElement).textContent);
    const model = (id: string, label = id): ModelInfo => ({ id, label, size_mb: 100, speed: 1, accuracy: 1, note: 'note', downloaded: true });
    const allow = (allowed: string[] | null) => {
      store.health.set(makePublicHealth({ allowed_models: allowed }));
      fixture.detectChanges();
    };

    it('offers every preset when there is no restriction', () => {
      setup();
      allow(null);
      expect(titles()).toEqual(['Fastest', 'Standard', 'High accuracy', 'Best accuracy']);
    });

    it('hides the presets that are not allowed', () => {
      setup();
      allow(['base', 'small']);
      expect(titles()).toEqual(['Fastest', 'Standard']);
    });

    it('replaces a remembered model that is not allowed by the Standard one, or by any allowed model', () => {
      sessionStorage.setItem('vt-options', JSON.stringify({ model: 'large-v3' }));
      setup();
      expect(page.opts.model).toBe('large-v3');
      allow(['base', 'small']);
      expect(page.opts.model).toBe('small');

      page.opts.model = 'base';
      allow(['tiny']);
      expect(page.opts.model).toBe('tiny');
    });

    it('lists only allowed models in the advanced select', () => {
      setup();
      store.models.set([model('base'), model('small'), model('large-v3')]);
      allow(['small', 'large-v3']);
      page.showAdvanced.set(true);
      fixture.detectChanges();
      const options = Array.from(fixture.nativeElement.querySelectorAll('#model option')).map((o) => (o as HTMLOptionElement).value);
      expect(options).toEqual(['small', 'large-v3']);
    });

    it('opens the advanced settings when no preset is allowed, because the select is then the only way to choose', () => {
      setup();
      store.models.set([model('medium')]);
      allow(['medium']);
      expect(fixture.nativeElement.querySelector('.presets')).toBeNull();
      expect(page.showAdvanced()).toBe(true);
      expect(page.opts.model).toBe('medium');
    });

    it('never sends a model that is not allowed', () => {
      setup();
      allow(['base']);
      page.opts.model = 'large-v3';
      page.addFiles([media('a.mp4')]);
      page.start();
      expect(JSON.parse(uploadReq().request.params.get('options')!).model).toBe('base');
    });
  });

  describe('remembered options', () => {
    it('never stores the vocabulary prompt, but still sends it to the server', () => {
      setup();
      page.opts.prompt = 'Dr. Okafor, BAT246';
      page.opts.model = 'base';
      page.addFiles([media('a.mp4')]);
      page.start();
      const req = uploadReq();
      expect(JSON.parse(req.request.params.get('options')!)).toMatchObject({ model: 'base', prompt: 'Dr. Okafor, BAT246' });

      const stored = JSON.parse(sessionStorage.getItem('vt-options')!);
      expect(stored.model).toBe('base');
      expect('prompt' in stored).toBe(false);
      expect(sessionStorage.getItem('vt-options')).not.toContain('Okafor');
    });

    it('restores the other options and ignores a prompt left by an older version', () => {
      sessionStorage.setItem('vt-options', JSON.stringify({ model: 'tiny', beam_size: 3, prompt: 'old secret' }));
      setup();
      expect(page.opts.model).toBe('tiny');
      expect(page.opts.beam_size).toBe(3);
      expect(page.opts.prompt).toBe('');
    });

    it('falls back to defaults when storage holds garbage', () => {
      sessionStorage.setItem('vt-options', '{not json');
      setup();
      expect(page.opts.model).toBe('small');
    });
  });

  describe('the page', () => {
    const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
    const qa = (sel: string) => Array.from(fixture.nativeElement.querySelectorAll(sel)) as HTMLElement[];
    const clean = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

    it('has one h1 and the three promises as chips: Free, Unlimited, No login', () => {
      setup();
      fixture.detectChanges();
      expect(qa('h1').length).toBe(1);
      expect(clean(q('h1'))).toBe('Transcribe a video or audio file');
      const chips = q('ul.trust')!;
      expect(chips.getAttribute('aria-label')).toBe('Free, unlimited, and no login needed');
      expect(qa('ul.trust li').map((li) => clean(li))).toEqual(['Free', 'Unlimited', 'No login']);
    });

    it('has no folder controls any more (no folder picker, no "new folder")', () => {
      setup();
      store.health.set(makePublicHealth());
      fixture.detectChanges();
      page.showAdvanced.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).not.toMatch(/folder/i);
      expect(q('select[id*="folder" i]')).toBeNull();
      expect(Object.keys(page).filter((k) => /folder/i.test(k))).toEqual([]);
    });

    it('the Transcribe button says "Choose a file first" until there is a file, and counts the files', () => {
      setup();
      fixture.detectChanges();
      const btn = () => q('.submit button.btn.primary') as HTMLButtonElement;
      expect(clean(btn())).toBe('Choose a file first');
      expect(btn().disabled).toBe(true);
      page.addFiles([media('a.mp4')]);
      fixture.detectChanges();
      expect(btn().disabled).toBe(false);
      expect(clean(btn())).toBe('Transcribe');
      page.addFiles([media('b.mp4'), media('c.mp4')]);
      fixture.detectChanges();
      expect(clean(btn())).toBe('Transcribe 3 files');
    });

    it('lists the chosen files with their size, and a button to remove each one', () => {
      setup();
      page.addFiles([media('one.mp4', 5 * 1024 * 1024), media('two.mp3', 2048)]);
      fixture.detectChanges();
      expect(qa('ul.files li .fname').map((n) => clean(n))).toEqual(['one.mp4', 'two.mp3']);
      expect(qa('ul.files li .fsize').map((n) => clean(n))).toEqual(['5.0 MB', '2 KB']);
      expect(qa('ul.files li button.x').map((b) => b.getAttribute('aria-label'))).toEqual(['Remove one.mp4', 'Remove two.mp3']);
      qa('ul.files li button.x')[0].click();
      fixture.detectChanges();
      expect(qa('ul.files li .fname').map((n) => clean(n))).toEqual(['two.mp3']);
    });

    /** a drag event as the browser sends it for files dragged over the window */
    const fileDrag = (type: 'dragover' | 'drop', files: File[] = [], types = ['Files']) => {
      const ev = new Event(type, { cancelable: true, bubbles: true });
      Object.defineProperty(ev, 'dataTransfer', { value: { files, types, dropEffect: 'none' } });
      return ev;
    };

    it('a file can be dropped anywhere on the page: the page says "Drop to add your file" while it is over it', () => {
      vi.useFakeTimers();
      try {
        setup();
        fixture.detectChanges();
        window.dispatchEvent(fileDrag('dragover'));
        fixture.detectChanges();
        expect(clean(q('.drop-overlay'))).toBe('Drop to add your file');
        const drop = fileDrag('drop', [media('dropped.mp4')]);
        window.dispatchEvent(drop);
        fixture.detectChanges();
        expect(drop.defaultPrevented).toBe(true);
        expect(q('.drop-overlay')).toBeNull();
        expect(page.files().map((f) => f.name)).toEqual(['dropped.mp4']);

        // the hint also goes away by itself when the file is dragged back out of the window
        window.dispatchEvent(fileDrag('dragover'));
        fixture.detectChanges();
        expect(q('.drop-overlay')).not.toBeNull();
        vi.advanceTimersByTime(300);
        fixture.detectChanges();
        expect(q('.drop-overlay')).toBeNull();
      } finally {
        vi.useRealTimers();
      }
    });

    it('dragging selected text (not a file) over the page changes nothing', () => {
      setup();
      fixture.detectChanges();
      const ev = fileDrag('dragover', [], ['text/plain']);
      window.dispatchEvent(ev);
      fixture.detectChanges();
      expect(ev.defaultPrevented).toBe(false);
      expect(q('.drop-overlay')).toBeNull();
    });

    it('a chosen file is shown in the file area, and the button there becomes "Add another file"', () => {
      setup();
      fixture.detectChanges();
      expect(clean(q('.choose'))).toBe('Choose a file');
      expect(q('.choose')!.classList).toContain('primary');
      page.addFiles([media('talk.mp4')]);
      fixture.detectChanges();
      expect(q('.drop ul.files .fname')!.textContent).toBe('talk.mp4');
      expect(clean(q('.choose'))).toBe('Add another file');
      expect(q('.choose')!.classList).not.toContain('primary'); // only one main button: Transcribe
    });

    it('closing the tab in the middle of an upload asks first; before and after it does not', () => {
      setup();
      const leave = () => {
        const ev = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent;
        window.dispatchEvent(ev);
        return ev.defaultPrevented;
      };
      expect(leave()).toBe(false);
      page.addFiles([media('a.mp4')]);
      page.start();
      expect(leave()).toBe(true);
      uploadReq().flush(makeSummary({ id: 'j1' }));
      expect(leave()).toBe(false); // done: nothing to lose
    });

    it('shows an error in an alert and clears it when the next files are fine', () => {
      setup();
      page.addFiles([new File(['x'], 'notes.txt', { type: 'text/plain' })]);
      fixture.detectChanges();
      expect(q('.alert')!.getAttribute('role')).toBe('alert');
      expect(clean(q('.alert'))).toBe('That is not a video or audio file. Please choose a video or audio file.');
      page.addFiles([media('ok.mp4')]);
      fixture.detectChanges();
      expect(q('.alert')).toBeNull();
    });

    it('the microphone button is offered when the browser can record', () => {
      setup();
      fixture.detectChanges();
      expect(page.micSupported).toBe(true);
      expect(clean(q('button.rec'))).toBe('Record from microphone');
    });
  });

  describe('quality choices', () => {
    const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
    const qa = (sel: string) => Array.from(fixture.nativeElement.querySelectorAll(sel)) as HTMLElement[];
    const clean = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

    it('are Fastest, Standard, High accuracy and Best accuracy, with the same model ids as before', () => {
      setup();
      fixture.detectChanges();
      expect(page.presets.map((p) => [p.title, p.model])).toEqual([
        ['Fastest', 'base'],
        ['Standard', 'small'],
        ['High accuracy', 'large-v3-turbo'],
        ['Best accuracy', 'large-v3'],
      ]);
      expect(qa('.preset b').map((b) => clean(b))).toEqual(['Fastest', 'Standard', 'High accuracy', 'Best accuracy']);
    });

    it('is a radio group called "Quality", with one line of help about the picked choice', () => {
      setup();
      fixture.detectChanges();
      expect(clean(q('fieldset.quality legend'))).toBe('Quality');
      expect(q('.presets')!.getAttribute('role')).toBe('radiogroup');
      expect(qa('.preset input[type="radio"]').length).toBe(4);
      expect(clean(q('.quality-help'))).toBe('Standard: Good for most videos. Not sure? Keep this one.');
      expect(q('.quality-help')!.getAttribute('aria-live')).toBe('polite');
    });

    it('recommends only Standard; every other choice says how fast it is in one word', () => {
      setup();
      fixture.detectChanges();
      expect(qa('.preset .sub').map((t) => clean(t))).toEqual(['Quickest', 'Recommended', 'Slower', 'Slowest']);
    });

    it('in the browser, recommends what the device starts with (Fastest on a phone), not always Standard', () => {
      setup();
      store.health.set(makeBrowserHealth());
      const m = (id: string, extra: Partial<ModelInfo> = {}): ModelInfo => ({
        id,
        label: id,
        size_mb: 100,
        speed: 1,
        accuracy: 1,
        note: '',
        downloaded: false,
        ...extra,
      });
      store.models.set([
        m('tiny'),
        m('base', { default: true }),
        m('small'),
        m('large-v3-turbo', { reason: 'use a computer for this size' }),
        m('large-v3', { reason: 'use a computer for this size' }),
      ]);
      fixture.detectChanges();
      expect(page.opts.model).toBe('base');
      expect(qa('.preset .sub').map((t) => clean(t))).toEqual(['Recommended', 'Fast', 'Slower', 'Slowest']);
      expect(clean(q('.quality-help'))).toContain('Fastest: Quick results. Good for clear speech. Not sure? Keep this one.');
      expect(page.tip(page.presets[1])).toBe('Standard. Good for most videos.');
    });

    it('the help line follows the picked choice', () => {
      setup();
      fixture.detectChanges();
      const radio = qa('.preset input[type="radio"]')[2] as HTMLInputElement;
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
      fixture.detectChanges();
      expect(clean(q('.quality-help'))).toBe('High accuracy: Fewer mistakes. Takes longer.');
    });

    it('starts on Standard (small) and shows it as selected', () => {
      setup();
      fixture.detectChanges();
      expect(page.opts.model).toBe('small');
      expect(qa('.preset').map((l) => l.classList.contains('sel'))).toEqual([false, true, false, false]);
    });

    it('picking one changes the model that is sent', () => {
      setup();
      fixture.detectChanges();
      const radio = qa('.preset input[type="radio"]')[3] as HTMLInputElement;
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
      fixture.detectChanges();
      expect(page.opts.model).toBe('large-v3');
      expect(qa('.preset').map((l) => l.classList.contains('sel'))).toEqual([false, false, false, true]);
      page.addFiles([media('a.mp4')]);
      page.start();
      expect(JSON.parse(uploadReq().request.params.get('options')!).model).toBe('large-v3');
    });

    it('each choice explains itself in a tooltip', () => {
      setup();
      fixture.detectChanges();
      expect(qa('.preset')[1].getAttribute('title')).toBe('Standard. Good for most videos. Not sure? Keep this one.');
      expect(page.tip(page.presets[3])).toBe('Best accuracy. Fewest mistakes. Takes the longest.');
    });

    it('tells when a model still has to be downloaded (first time only), and not when it is on this machine', () => {
      setup();
      const m = (id: string, size_mb: number, downloaded: boolean): ModelInfo => ({ id, label: id, size_mb, speed: 1, accuracy: 1, note: '', downloaded });
      store.models.set([m('base', 150, true), m('small', 480, true), m('large-v3-turbo', 1620, false), m('large-v3', 3100, false)]);
      fixture.detectChanges();
      expect(page.selectedHelp()).toBe('Standard: Good for most videos. Not sure? Keep this one.'); // already here: no note
      const radio = qa('.preset input[type="radio"]')[3] as HTMLInputElement;
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
      fixture.detectChanges();
      expect(clean(q('.quality-help'))).toBe('Best accuracy: Fewest mistakes. Takes the longest. First time only: downloads 3.1 GB (needs internet).');
      expect(page.downloadNote('base')).toBe('');
      expect(page.downloadShort('large-v3')).toBe('3.1 GB download');
      expect(page.downloadShort('small')).toBe('');
    });

    it('a choice the server does not have is greyed out and cannot be picked', async () => {
      setup();
      store.models.set([{ id: 'small', label: 'small', size_mb: 1, speed: 1, accuracy: 1, note: '', downloaded: true }]);
      fixture.detectChanges();
      await fixture.whenStable(); // ngModel applies [disabled] a moment later
      fixture.detectChanges();
      const disabled = qa('.preset input[type="radio"]').map((r) => (r as HTMLInputElement).disabled);
      expect(disabled).toEqual([true, false, true, true]);
      expect(qa('.preset').map((l) => l.classList.contains('na'))).toEqual([true, false, true, true]);
    });
  });

  describe('"More options"', () => {
    const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
    const clean = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
    const toggle = () => q('button.more-toggle') as HTMLButtonElement;

    it('defaults to the original script (English stays English) and sends it with a new upload', async () => {
      setup();
      fixture.detectChanges();
      await fixture.whenStable();
      expect((q('#output-script') as HTMLSelectElement).value).toBe('original');
      expect(clean(q('#output-script-hint'))).toContain('English in English letters, Hindi in Devanagari');
      page.addFiles([media('a.mp4')]);
      page.start();
      expect(JSON.parse(uploadReq().request.params.get('options')!).output_script).toBe('original');
    });

    it('still offers Hinglish, and remembers it when chosen', () => {
      sessionStorage.setItem('vt-options', JSON.stringify({ model: 'small', output_script: 'hinglish' }));
      setup();
      expect(page.opts.output_script).toBe('hinglish');
    });

    it('switches the engine and model together and prevents Qwen translation', () => {
      setup();
      store.models.set([
        { id: 'small', label: 'Small', size_mb: 465, speed: 3, accuracy: 3, note: '', downloaded: true, engine: 'whisper' },
        { id: 'qwen3-asr-0.6b', label: 'Qwen', size_mb: 1300, speed: 2, accuracy: 0, note: '', downloaded: true, engine: 'qwen' },
      ]);
      page.opts.task = 'translate';
      page.opts.engine = 'qwen';
      page.changeEngine();
      expect(page.opts.model).toBe('qwen3-asr-0.6b');
      expect(page.opts.task).toBe('transcribe');
      expect(page.selectableModels().map((m) => m.id)).toEqual(['qwen3-asr-0.6b']);
      page.choosePreset('small');
      expect(page.opts.engine).toBe('whisper');
    });

    it('lets the user choose original script and remembers that selection', () => {
      setup();
      fixture.detectChanges();
      const style = q('#output-script') as HTMLSelectElement;
      style.value = 'original';
      style.dispatchEvent(new Event('change'));
      page.addFiles([media('a.mp4')]);
      page.start();
      expect(JSON.parse(uploadReq().request.params.get('options')!).output_script).toBe('original');
      expect(JSON.parse(sessionStorage.getItem('vt-options')!).output_script).toBe('original');
    });

    it('restores an explicit original script preference', () => {
      sessionStorage.setItem('vt-options', JSON.stringify({ model: 'small', output_script: 'original' }));
      setup();
      expect(page.opts.output_script).toBe('original');
    });

    it('gives old saved options without a style the original-script default', () => {
      sessionStorage.setItem('vt-options', JSON.stringify({ model: 'small' }));
      setup();
      expect(page.opts.output_script).toBe('original');
    });

    it('disables script selection for English translation', async () => {
      setup();
      page.opts.task = 'translate';
      fixture.detectChanges();
      await fixture.whenStable();
      expect((q('#output-script') as HTMLSelectElement).disabled).toBe(true);
      expect(clean(q('#output-script-hint'))).toContain('English translation');
    });

    it('is a closed disclosure at first, with the spoken language always visible', () => {
      setup();
      fixture.detectChanges();
      expect(clean(toggle())).toBe('More options');
      expect(toggle().getAttribute('aria-expanded')).toBe('false');
      expect(toggle().getAttribute('aria-controls')).toBe('more-options');
      expect(q('#more-options')).toBeNull();
      expect(q('#lang')).not.toBeNull();
    });

    it('opens and closes with its button, and says so for assistive technology', () => {
      setup();
      fixture.detectChanges();
      toggle().click();
      fixture.detectChanges();
      expect(toggle().getAttribute('aria-expanded')).toBe('true');
      expect(q('#more-options')).not.toBeNull();
      toggle().click();
      fixture.detectChanges();
      expect(q('#more-options')).toBeNull();
    });

    it('holds output, vocabulary hint, model, search depth and the four audio / timing switches', () => {
      setup();
      page.showAdvanced.set(true);
      fixture.detectChanges();
      const body = q('#more-options')!;
      const labels = Array.from(body.querySelectorAll('label')).map((l) => clean(l));
      for (const part of ['Output', 'Vocabulary hint', 'Model', 'Search depth', 'Enhance audio', 'Skip silence & music', 'Word-level timing', 'Use previous text as context']) {
        expect(labels.some((l) => l.startsWith(part))).toBe(true);
      }
      expect(body.querySelectorAll('input[type="checkbox"]').length).toBe(4);
      expect(clean(body.querySelector('#task option[value="translate"]'))).toBe('Translate to English');
    });

    it('what is chosen in there is sent with the upload', () => {
      setup();
      page.showAdvanced.set(true);
      fixture.detectChanges();
      page.opts.task = 'translate';
      page.opts.vad = false;
      page.opts.language = 'de';
      page.addFiles([media('a.mp4')]);
      page.start();
      expect(JSON.parse(uploadReq().request.params.get('options')!)).toMatchObject({ task: 'translate', vad: false, language: 'de', model: 'small' });
    });

    it('lists the languages the server reports after "Detect automatically"', () => {
      setup();
      store.languages.set([{ code: 'en', name: 'English' }, { code: 'de', name: 'German' }]);
      fixture.detectChanges();
      expect(Array.from(fixture.nativeElement.querySelectorAll('#lang option')).map((o) => clean(o as Element))).toEqual(['Detect automatically', 'English', 'German']);
    });
  });

  describe('a file waiting from a keyword page (PendingFileService)', () => {
    const waitingFile = () => new File(['x'], 'talk.mp3', { type: 'audio/mpeg' });

    it('is picked up when the page opens, and added to the list', () => {
      const f = waitingFile();
      setup(f);
      expect(page.files()).toEqual([f]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('ul.files .fname').textContent).toBe('talk.mp3');
      expect(fixture.nativeElement.querySelector('.submit button.btn.primary').disabled).toBe(false);
    });

    it('is taken only once: the service is empty afterwards and a later visit starts empty', () => {
      setup(waitingFile());
      const pending = TestBed.inject(PendingFileService);
      expect(pending.file()).toBeNull();
      const second = TestBed.createComponent(UploadPage).componentInstance;
      expect(second.files()).toEqual([]);
    });

    it('nothing waiting: the list starts empty', () => {
      setup();
      expect(page.files()).toEqual([]);
    });

    it('is not uploaded by itself: the visitor still presses Transcribe', () => {
      setup(waitingFile());
      fixture.detectChanges();
      ctl.expectNone((r) => r.method === 'POST');
      expect(page.uploading()).toBe(false);
    });

    it('is checked like any other file: not a video or audio file is skipped with a message', () => {
      setup(new File(['x'], 'notes.txt', { type: 'text/plain' }));
      expect(page.files()).toEqual([]);
      expect(page.error()).toBe('That is not a video or audio file. Please choose a video or audio file.');
    });

    it('is checked against the size limit the server announced', () => {
      TestBed.configureTestingModule({
        providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
      });
      ctl = TestBed.inject(HttpTestingController);
      store = TestBed.inject(JobsStore);
      store.health.set(makePublicHealth({ max_upload_mb: 1 }));
      TestBed.inject(PendingFileService).set(media('huge.mp4', 5 * 1024 * 1024));
      fixture = TestBed.createComponent(UploadPage);
      page = fixture.componentInstance;
      expect(page.files()).toEqual([]);
      expect(page.error()).toBe('File "huge.mp4" is 5 MB; the limit is 1 MB.');
    });

    it('the file can then be uploaded with the options chosen on this page', () => {
      const f = waitingFile();
      setup(f);
      page.start();
      const req = uploadReq();
      expect(req.request.body).toBe(f);
      expect(req.request.params.get('filename')).toBe('talk.mp3');
      req.flush(makeSummary({ id: 'j1', status: 'queued' }));
    });

    it('a file added by hand later is added to the waiting one', () => {
      const f = waitingFile();
      setup(f);
      page.addFiles([media('b.mp4')]);
      expect(page.files().map((x) => x.name)).toEqual(['talk.mp3', 'b.mp4']);
    });
  });
});
