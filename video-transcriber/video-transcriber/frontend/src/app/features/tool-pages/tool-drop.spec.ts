import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { JobsStore } from '../../core/jobs.store';
import { PendingFileService } from '../../core/pending-file.service';
import { ToastService } from '../../core/toast.service';
import { makeBrowserHealth, makePublicHealth, silentLog } from '../../testing/fakes';
import { ACCEPT_AUDIO, ACCEPT_VIDEO_AND_AUDIO, ToolDrop } from './tool-drop';
import { DropKind } from './tool-page.model';

const MB = 1024 * 1024;

/** A file of the given type; `size` overrides the (tiny) real size. */
function file(name: string, type: string, size?: number) {
  const f = new File(['x'], name, { type });
  if (size !== undefined) Object.defineProperty(f, 'size', { value: size });
  return f;
}

describe('ToolDrop (the drop box on a keyword page)', () => {
  let fixture: ComponentFixture<ToolDrop>;
  let drop: ToolDrop;
  let pending: PendingFileService;
  let navigate: ReturnType<typeof vi.fn>;
  let ctl: HttpTestingController;

  function setup(kind: DropKind = 'video', noun = 'video', formats: string[] = ['MP4', 'MOV'], limits = '') {
    TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
    ctl = TestBed.inject(HttpTestingController);
    pending = TestBed.inject(PendingFileService);
    navigate = vi.fn(() => Promise.resolve(true));
    TestBed.inject(Router).navigateByUrl = navigate as unknown as Router['navigateByUrl'];
    fixture = TestBed.createComponent(ToolDrop);
    drop = fixture.componentInstance;
    fixture.componentRef.setInput('kind', kind);
    fixture.componentRef.setInput('noun', noun);
    fixture.componentRef.setInput('formats', formats);
    fixture.componentRef.setInput('limits', limits);
    fixture.detectChanges();
  }

  const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
  const clean = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const alertText = () => clean(q('.alert'));

  /** The visitor chooses files in the file dialog. */
  function pick(...files: File[]) {
    const input = q('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, 'files', { value: files, configurable: true });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
  }

  /** The visitor drops files on the box. */
  function dropFiles(...files: File[]) {
    const ev = new Event('drop', { cancelable: true, bubbles: true });
    Object.defineProperty(ev, 'dataTransfer', { value: { files } });
    q('.box')!.dispatchEvent(ev);
    fixture.detectChanges();
    return ev;
  }

  describe('what it says', () => {
    it('asks for the kind of file the page is about, and has a button for the file dialog', () => {
      setup('audio', 'MP3');
      expect(clean(q('.title'))).toBe('Drop your MP3 here, or choose a file');
      expect(clean(q('button.btn.primary'))).toBe('Choose a file');
      expect(q('.box')!.getAttribute('role')).toBe('group');
      expect(q('.box')!.getAttribute('aria-labelledby')).toBe(q('.title')!.id);
    });

    it('says "file" when the page gives no noun', () => {
      TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
      fixture = TestBed.createComponent(ToolDrop);
      fixture.detectChanges();
      expect(clean(q('.title'))).toBe('Drop your file here, or choose a file');
    });

    it('names the first formats, mentions that audio works on a video page, the limits, and that nothing is sent yet', () => {
      setup('video', 'video', ['MP4', 'MOV', 'MKV', 'WEBM'], 'Up to 2 GB and 60 minutes per file.');
      const hint = q('.hint')!.textContent!; // raw: "2 GB" has a non-breaking space
      expect(hint).toContain('MP4, MOV, MKV, WEBM.');
      expect(hint).toContain('Audio works too.');
      expect(hint).toContain('Up to 2\u00a0GB and 60 minutes per file.');
      expect(hint).toContain('Nothing is uploaded until you press Transcribe.');
    });

    it('the in-browser edition: says the file never leaves the device, and never that it is uploaded', () => {
      setup('video', 'video', ['MP4', 'MOV'], 'There is no size or length limit set here.');
      TestBed.inject(JobsStore).health.set(makeBrowserHealth());
      fixture.detectChanges();
      const hint = clean(q('.hint'));
      expect(hint).toContain('Your file never leaves your device.');
      expect(hint).not.toContain('uploaded');
      expect(hint).not.toContain('Nothing is uploaded until you press Transcribe.');
    });

    it('keeps "2 GB" together on one line (a non-breaking space), also for MB', () => {
      setup('video', 'video', [], 'Up to 512 MB and 5 minutes per file.');
      expect(drop.hint()).toContain('512\u00a0MB');
      expect(drop.hint()).toContain('5 minutes'); // only a size unit is glued
    });

    it('an audio page does not say that audio works too (it is the only thing it takes)', () => {
      setup('audio', 'MP3', ['MP3', 'WAV']);
      expect(clean(q('.hint'))).not.toContain('Audio works too.');
    });

    it('names at most five formats and says "and more" for the rest', () => {
      setup('audio', 'audio', ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS']);
      expect(drop.hint()).toContain('MP3, WAV, M4A, AAC, FLAC and more.');
      expect(drop.hint()).not.toContain('OGG');
      TestBed.resetTestingModule();
      setup('audio', 'audio', ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC']);
      expect(drop.hint()).toContain('MP3, WAV, M4A, AAC, FLAC.');
      expect(drop.hint()).not.toContain('and more');
    });

    it('shows no error at first', () => {
      setup();
      expect(q('.alert')).toBeNull();
    });
  });

  describe('which files the file dialog offers', () => {
    it('a video page: video and audio, like the main uploader', () => {
      setup('video');
      expect(q('input[type="file"]')!.getAttribute('accept')).toBe(ACCEPT_VIDEO_AND_AUDIO);
      expect(ACCEPT_VIDEO_AND_AUDIO).toContain('video/*');
      expect(ACCEPT_VIDEO_AND_AUDIO).toContain('audio/*');
    });

    it('an audio page: audio only (with the extensions some systems give no audio type)', () => {
      setup('audio');
      expect(q('input[type="file"]')!.getAttribute('accept')).toBe(ACCEPT_AUDIO);
      expect(ACCEPT_AUDIO).not.toContain('video/*');
      for (const ext of ['.mp3', '.wav', '.m4a', '.flac', '.opus']) expect(ACCEPT_AUDIO).toContain(ext);
    });

    it('is a hidden input behind the button, for one file', () => {
      setup();
      const input = q('input[type="file"]') as HTMLInputElement;
      expect(input.hidden).toBe(true);
      expect(input.multiple).toBe(false);
    });

    it('the button opens the file dialog', () => {
      setup();
      const input = q('input[type="file"]') as HTMLInputElement;
      const open = vi.spyOn(input, 'click').mockImplementation(() => {});
      (q('button.btn.primary') as HTMLButtonElement).click();
      expect(open).toHaveBeenCalledTimes(1);
    });
  });

  describe('a valid file', () => {
    it('chosen in the dialog: handed to the uploader (PendingFileService) and the visitor goes to the home page', () => {
      setup();
      const f = file('talk.mp4', 'video/mp4');
      pick(f);
      expect(pending.file()).toBe(f);
      expect(navigate).toHaveBeenCalledWith('/');
      expect(q('.alert')).toBeNull();
    });

    it('dropped on the box: the same', () => {
      setup();
      const f = file('talk.mov', 'video/quicktime');
      const ev = dropFiles(f);
      expect(ev.defaultPrevented).toBe(true); // the browser must not open the file
      expect(pending.file()).toBe(f);
      expect(navigate).toHaveBeenCalledWith('/');
    });

    it('sends nothing to the server from here (only the usual start-up reads, never a write or an upload)', () => {
      setup();
      pick(file('talk.mp4', 'video/mp4'));
      expect(ctl.match(() => true).filter((r) => r.request.method !== 'GET')).toEqual([]);
    });

    it('a video page also takes audio (the main uploader does)', () => {
      setup('video');
      const f = file('talk.mp3', 'audio/mpeg');
      pick(f);
      expect(pending.file()).toBe(f);
      expect(navigate).toHaveBeenCalledWith('/');
    });

    it('an audio page takes audio', () => {
      setup('audio', 'MP3');
      const f = file('talk.mp3', 'audio/mpeg');
      pick(f);
      expect(pending.file()).toBe(f);
    });

    it.each([
      ['no type, a video extension', 'clip.MKV'],
      ['no type, another video extension', 'holiday.avi'],
      ['no type, an audio extension', 'voice.m4a'],
    ])('on a video page a file with %s (%s) is recognised by its name', (_label, name) => {
      setup('video');
      const f = file(name, '');
      pick(f);
      expect(pending.file()).toBe(f);
    });

    it.each(['voice.FLAC', 'song.opus', 'call.3gp', 'memo.aac', 'a.wav'])('on an audio page %s (no type) is recognised by its name', (name) => {
      setup('audio');
      const f = file(name, '');
      pick(f);
      expect(pending.file()).toBe(f);
    });

    it('clears an earlier error', () => {
      setup();
      pick(file('notes.txt', 'text/plain'));
      expect(q('.alert')).not.toBeNull();
      pick(file('talk.mp4', 'video/mp4'));
      expect(q('.alert')).toBeNull();
    });

    it('choosing the same file again works (the input is emptied after every choice)', () => {
      setup();
      const input = q('input[type="file"]') as HTMLInputElement;
      const setter = vi.fn();
      Object.defineProperty(input, 'value', { set: setter, get: () => '', configurable: true });
      pick(file('talk.mp4', 'video/mp4'));
      expect(setter).toHaveBeenCalledWith('');
    });

    it('a dialog that was cancelled (no files) does nothing', () => {
      setup();
      pick();
      expect(pending.file()).toBeNull();
      expect(navigate).not.toHaveBeenCalled();
      expect(q('.alert')).toBeNull();
    });
  });

  describe('a file that cannot be used stays on the page, says why, and is not handed over', () => {
    it('wrong type: not video or audio', () => {
      setup('video');
      pick(file('notes.txt', 'text/plain'));
      expect(alertText()).toBe('That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.');
      expect(q('.alert')!.getAttribute('role')).toBe('alert');
      expect(q('.alert a')).toBeNull();
      expect(pending.file()).toBeNull();
      expect(navigate).not.toHaveBeenCalled();
    });

    it('wrong type by dropping: the same', () => {
      setup('video');
      dropFiles(file('slides.pdf', 'application/pdf'));
      expect(alertText()).toContain('That is not a video or audio file.');
      expect(pending.file()).toBeNull();
    });

    it('an image is not accepted either', () => {
      setup('audio');
      pick(file('photo.png', 'image/png'));
      expect(alertText()).toBe('That is not an audio file. Choose an MP3, WAV, M4A or another audio file.');
      expect(q('.alert a')).toBeNull();
    });

    it('a video on an audio page: says so and offers the Video to text page', () => {
      setup('audio', 'MP3');
      pick(file('movie.mp4', 'video/mp4'));
      expect(alertText()).toContain('This box takes audio files such as MP3, WAV or M4A, but that one is a video.');
      const link = q('.alert a')!;
      expect(link.getAttribute('href')).toBe('/video-to-text');
      expect(clean(link)).toBe('Go to Video to text');
      expect(pending.file()).toBeNull();
      expect(navigate).not.toHaveBeenCalled();
    });

    it('a video recognised by its name (no type) on an audio page: the same', () => {
      setup('audio');
      pick(file('movie.mkv', ''));
      expect(alertText()).toContain('but that one is a video');
      expect(q('.alert a')).not.toBeNull();
    });

    it('the Video to text link goes away with the next good choice', () => {
      setup('audio');
      pick(file('movie.mp4', 'video/mp4'));
      expect(q('.alert a')).not.toBeNull();
      pick(file('talk.mp3', 'audio/mpeg'));
      expect(q('.alert')).toBeNull();
      expect(drop.wrongKind()).toBe(false);
    });

    it('two files: one at a time, and nothing is handed over', () => {
      setup();
      pick(file('a.mp4', 'video/mp4'), file('b.mp4', 'video/mp4'));
      expect(alertText()).toBe('Please add one file at a time here. You can add more files on the next page.');
      expect(pending.file()).toBeNull();
      expect(navigate).not.toHaveBeenCalled();
    });

    it('two files dropped: the same', () => {
      setup();
      dropFiles(file('a.mp4', 'video/mp4'), file('b.mp3', 'audio/mpeg'));
      expect(alertText()).toContain('one file at a time');
      expect(pending.file()).toBeNull();
    });

    it('an empty file', () => {
      setup();
      pick(file('empty.mp4', 'video/mp4', 0));
      expect(alertText()).toBe('"empty.mp4" is empty.');
      expect(pending.file()).toBeNull();
    });

    it('too big: names the file, its size and the limit the server announced', () => {
      setup();
      TestBed.inject(JobsStore).health.set(makePublicHealth({ max_upload_mb: 2048 }));
      pick(file('huge.mp4', 'video/mp4', 3 * 1024 * MB));
      expect(alertText()).toBe('"huge.mp4" is 3 GB; the limit is 2 GB.');
      expect(pending.file()).toBeNull();
      expect(navigate).not.toHaveBeenCalled();
    });

    it('a file exactly at the limit is accepted, one byte over is not', () => {
      setup();
      TestBed.inject(JobsStore).health.set(makePublicHealth({ max_upload_mb: 10 }));
      const atLimit = file('ok.mp4', 'video/mp4', 10 * MB);
      pick(atLimit);
      expect(pending.file()).toBe(atLimit);
      pending.set(null);
      pick(file('over.mp4', 'video/mp4', 10 * MB + 1));
      expect(alertText()).toContain('"over.mp4"');
      expect(pending.file()).toBeNull();
    });

    it('no limit announced: a big file is accepted (the uploader will check once the server has answered)', () => {
      setup();
      TestBed.inject(JobsStore).health.set(makePublicHealth({ max_upload_mb: undefined }));
      const f = file('big.mp4', 'video/mp4', 50 * 1024 * MB);
      pick(f);
      expect(pending.file()).toBe(f);
    });

    it('the type is checked before the size (a big text file is "not a video")', () => {
      setup();
      TestBed.inject(JobsStore).health.set(makePublicHealth({ max_upload_mb: 1 }));
      pick(file('log.txt', 'text/plain', 100 * MB));
      expect(alertText()).toContain('not a video or audio file');
    });
  });

  describe('toasts (a short pop-up as well as the message in the box)', () => {
    const shown = () => TestBed.inject(ToastService).toasts().map((t) => [t.kind, t.title, t.message]);

    it('a refused file: a "File not added" warning with the same reason as the box', () => {
      setup('video');
      pick(file('notes.txt', 'text/plain'));
      expect(shown()).toEqual([['warning', 'File not added', alertText()]]);
    });

    it('too big: the toast names the file, its size and the limit, like the box', () => {
      setup();
      TestBed.inject(JobsStore).health.set(makePublicHealth({ max_upload_mb: 2048 }));
      pick(file('huge.mp4', 'video/mp4', 3 * 1024 * MB));
      expect(shown()).toEqual([['warning', 'File not added', '"huge.mp4" is 3 GB; the limit is 2 GB.']]);
    });

    it('only the latest reason is shown, not a pile of them', () => {
      setup('audio', 'MP3');
      pick(file('notes.txt', 'text/plain'));
      pick(file('movie.mp4', 'video/mp4'));
      expect(shown().length).toBe(1);
      expect(shown()[0][2]).toContain('but that one is a video');
    });

    it('a good file: "File added" and what to press next; an earlier refusal goes away', () => {
      setup();
      pick(file('notes.txt', 'text/plain'));
      pick(file('talk.mp4', 'video/mp4'));
      expect(shown()).toEqual([['success', 'File added', '"talk.mp4" is ready. Press Transcribe to start.']]);
    });

    it('a cancelled dialog shows nothing', () => {
      setup();
      pick();
      expect(shown()).toEqual([]);
    });
  });

  describe('dragging over the box', () => {
    const box = () => q('.box')!;

    it('highlights it while a drag is over it, and prevents the browser from opening the file', () => {
      setup();
      const over = new Event('dragover', { cancelable: true, bubbles: true });
      box().dispatchEvent(over);
      fixture.detectChanges();
      expect(over.defaultPrevented).toBe(true);
      expect(box().classList.contains('over')).toBe(true);
      expect(drop.dragging()).toBe(true);
    });

    it('stops highlighting when the drag leaves the box', () => {
      setup();
      box().dispatchEvent(new Event('dragover', { cancelable: true, bubbles: true }));
      box().dispatchEvent(new DragEventLike('dragleave', null));
      fixture.detectChanges();
      expect(box().classList.contains('over')).toBe(false);
    });

    it('moving over a child of the box (the button) is not leaving it', () => {
      setup();
      box().dispatchEvent(new Event('dragover', { cancelable: true, bubbles: true }));
      box().dispatchEvent(new DragEventLike('dragleave', q('button.btn')));
      fixture.detectChanges();
      expect(box().classList.contains('over')).toBe(true);
    });

    it('a drop ends the highlight', () => {
      setup();
      box().dispatchEvent(new Event('dragover', { cancelable: true, bubbles: true }));
      dropFiles(file('talk.mp4', 'video/mp4'));
      expect(box().classList.contains('over')).toBe(false);
    });

    it('a drop without files does nothing', () => {
      setup();
      const ev = new Event('drop', { cancelable: true, bubbles: true });
      box().dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(true);
      expect(pending.file()).toBeNull();
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});

/** A `dragleave` with a `relatedTarget` (jsdom has no DragEvent constructor). */
class DragEventLike extends Event {
  readonly relatedTarget: EventTarget | null;
  constructor(type: string, relatedTarget: EventTarget | null) {
    super(type, { bubbles: true, cancelable: true });
    this.relatedTarget = relatedTarget;
  }
}
