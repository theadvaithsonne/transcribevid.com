import { Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { fmtBytesShort } from '../../core/format';
import { PendingFileService } from '../../core/pending-file.service';
import { SiteService } from '../../core/site.service';
import { ToastService } from '../../core/toast.service';
import { DropKind } from './tool-page.model';

/** The same list the main uploader gives its file picker (features/upload/upload.html): video and audio. */
export const ACCEPT_VIDEO_AND_AUDIO = 'video/*,audio/*,.mkv,.mov,.avi,.m4a,.flac,.opus,.wmv,.ts';
/** An audio page: audio only (some systems give .flac / .opus / .m4a no audio type, so the extensions are named too). */
export const ACCEPT_AUDIO = 'audio/*,.mp3,.wav,.m4a,.aac,.flac,.ogg,.opus,.3gp';
/** The same extension check the main uploader uses for files that have no video / audio type. */
const MEDIA_EXT = /\.(mp4|mkv|mov|avi|webm|mp3|wav|m4a|aac|flac|ogg|opus|wmv|flv|m4v|3gp|ts|mts)$/i;
const AUDIO_EXT = /\.(mp3|wav|m4a|aac|flac|ogg|opus|3gp)$/i;

/**
 * The small drop box in the hero of a keyword page: "Drop your MP3 here, or choose a file". It makes the page a tool on
 * its own. A chosen or dropped file is handed to PendingFileService and the visitor goes to the home page, where the
 * uploader picks it up (a short toast says what to press next). A file that cannot be used stays here: the reason is
 * shown in the box (role="alert", for screen readers) and as a toast. Nothing is sent to the server from here.
 *
 * Client-only behaviour: the template reaches the DOM only from event handlers, never in the constructor, so it
 * renders fine on the server.
 */
@Component({
  selector: 'app-tool-drop',
  imports: [RouterLink],
  template: `
    <div
      class="box"
      role="group"
      aria-labelledby="tool-drop-title"
      [class.over]="dragging()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <span class="icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" focusable="false">
          <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <p class="title" id="tool-drop-title">Drop your {{ noun() }} here, or choose a file</p>
      <input #picker type="file" hidden [accept]="accept()" (change)="onPick($event)" />
      <button type="button" class="btn primary big" (click)="picker.click()">Choose a file</button>
      <p class="hint">{{ hint() }}</p>
      @if (error()) {
        <p class="alert" role="alert">
          {{ error() }}
          @if (wrongKind()) {
            <a routerLink="/video-to-text">Go to Video to text</a>
          }
        </p>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: clamp(24px, 2.6vw, 40px) clamp(18px, 2.4vw, 36px);
      text-align: center;
      background: var(--surface);
      border: 2px dashed var(--line-strong);
      border-radius: var(--r-lg);
      transition:
        border-color 0.15s var(--ease),
        background-color 0.15s var(--ease);
    }
    .box.over {
      border-style: solid;
      border-color: var(--accent);
      background: var(--surface-2);
    }
    .icon {
      display: grid;
      place-items: center;
      flex: none;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--accent-soft);
      color: var(--accent);
    }
    .title {
      max-width: 22ch;
      margin: 0;
      font-size: clamp(22px, 1.8vw, 28px);
      font-weight: 800;
      line-height: 1.25;
      letter-spacing: -0.01em;
      color: var(--text-strong);
    }
    .btn {
      min-width: min(100%, 240px);
      text-decoration: none;
    }
    .btn:focus-visible,
    a:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 3px;
    }
    .hint {
      max-width: 40ch;
      margin: 0;
      font-size: 18px;
      line-height: 1.5;
      color: var(--text);
    }
    .alert {
      margin: 0;
      font-size: 18px;
      font-weight: 650;
      line-height: 1.5;
      color: var(--err);
      background: var(--surface);
      border: 2px solid var(--err);
      border-radius: var(--r-sm);
      padding: 12px 16px;
    }
    .alert a {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      margin-left: 6px;
      color: var(--accent);
      text-decoration: underline;
      text-underline-offset: 3px;
      text-decoration-thickness: 2px;
    }
  `,
})
export class ToolDrop {
  private router = inject(Router);
  private pending = inject(PendingFileService);
  private site = inject(SiteService);
  private toast = inject(ToastService);

  /** video pages take video and audio, audio pages take audio only */
  readonly kind = input<DropKind>('video');
  /** "MP3", "video", "voice recording": what the title asks for */
  readonly noun = input('file');
  /** the formats of this page, e.g. ["MP3", "WAV", ...]: the first few are named under the button */
  readonly formats = input<readonly string[]>([]);
  /** the announced size / length limits, e.g. "Up to 500 MB and 60 minutes per file." */
  readonly limits = input('');

  readonly dragging = signal(false);
  readonly error = signal('');
  /** the error is about a video on an audio page: offer the video page */
  readonly wrongKind = signal(false);
  /** the id of the "File not added" toast on screen (0 = none) */
  private refusedToast = 0;

  readonly accept = computed(() => (this.kind() === 'audio' ? ACCEPT_AUDIO : ACCEPT_VIDEO_AND_AUDIO));

  readonly hint = computed(() => {
    const f = this.formats();
    const named = f.slice(0, 5).join(', ') + (f.length > 5 ? ' and more' : '');
    const parts = [
      named ? `${named}.` : '',
      this.kind() === 'video' ? 'Audio works too.' : '',
      this.limits(),
      'Nothing is uploaded until you press Transcribe.',
    ];
    // "500 MB" stays on one line
    return parts.filter(Boolean).join(' ').replace(/(\d) (?=[KMGT]B(?![a-z]))/g, '$1\xa0');
  });

  onPick(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.take(Array.from(input.files ?? []));
    input.value = ''; // choosing the same file again must work
  }

  onDragOver(ev: DragEvent) {
    ev.preventDefault();
    this.dragging.set(true);
  }

  onDragLeave(ev: DragEvent) {
    // moving over the children of the box also fires dragleave: only a real exit counts
    const to = ev.relatedTarget as Node | null;
    if (!to || !(ev.currentTarget as HTMLElement).contains(to)) this.dragging.set(false);
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.dragging.set(false);
    this.take(Array.from(ev.dataTransfer?.files ?? []));
  }

  private take(files: File[]) {
    if (!files.length) return;
    if (files.length > 1) {
      this.refuse('Please add one file at a time here. You can add more files on the next page.');
      return;
    }
    const file = files[0];
    const problem = this.problem(file);
    if (problem) {
      this.refuse(problem.text, problem.video);
      return;
    }
    this.error.set('');
    this.wrongKind.set(false);
    this.pending.set(file);
    this.toast.dismiss(this.refusedToast); // an earlier "File not added" is out of date now
    this.refusedToast = 0;
    this.toast.success(`"${file.name}" is ready. Press Transcribe to start.`, 'File added');
    void this.router.navigateByUrl('/');
  }

  /** the reason stays in the box (read out by screen readers) and also pops up as a toast, where the eye is drawn */
  private refuse(text: string, video = false) {
    this.error.set(text);
    this.wrongKind.set(video);
    this.toast.dismiss(this.refusedToast); // only the latest reason, not a pile of them
    this.refusedToast = this.toast.warning(text, 'File not added');
  }

  /** why this file cannot be used (the same checks the uploader makes, so it never gets a surprise); null when it can */
  private problem(f: File): { text: string; video: boolean } | null {
    const audioOnly = this.kind() === 'audio';
    const isAudio = f.type.startsWith('audio/') || AUDIO_EXT.test(f.name);
    const isMedia = isAudio || f.type.startsWith('video/') || MEDIA_EXT.test(f.name);
    if (audioOnly && !isAudio) {
      return isMedia
        ? { text: 'This box takes audio files such as MP3, WAV or M4A, but that one is a video.', video: true }
        : { text: 'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.', video: false };
    }
    if (!isMedia) {
      return { text: 'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.', video: false };
    }
    if (f.size === 0) return { text: `"${f.name}" is empty.`, video: false };
    const mb = this.site.maxUploadMb();
    if (mb && f.size > mb * 1024 * 1024) {
      return { text: `"${f.name}" is ${fmtBytesShort(f.size)}; the limit is ${fmtBytesShort(mb * 1024 * 1024)}.`, video: false };
    }
    return null;
  }
}
