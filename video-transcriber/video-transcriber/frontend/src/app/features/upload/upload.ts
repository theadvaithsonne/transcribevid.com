import { Component, DestroyRef, HostListener, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { concatMap, from, last, tap } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { fmtBytes, fmtBytesShort, fmtTime, prefersReducedMotion } from '../../core/format';
import { errorDetail } from '../../core/http-error';
import { JobsStore } from '../../core/jobs.store';
import { LogService } from '../../core/log.service';
import { DEFAULT_OPTIONS, JobOptions } from '../../core/models';
import { PendingFileService } from '../../core/pending-file.service';
import { SiteService } from '../../core/site.service';
import { ToastService } from '../../core/toast.service';
import { DeviceAdvice, EngineDevice } from '../../core/transport/engine-device';

const KEY = 'vt-options';
const MEDIA_EXT = /\.(mp4|mkv|mov|avi|webm|mp3|wav|m4a|aac|flac|ogg|opus|wmv|flv|m4v|3gp|ts|mts)$/i;

interface Preset {
  /** the model id sent to the server (never shown as such) */
  model: string;
  /** plain name of the choice */
  title: string;
  /** one plain sentence: what the choice means for the visitor (shown under the choices for the picked one) */
  blurb: string;
  /** how fast it is: 4 = fastest .. 1 = slowest */
  speed: number;
  /** one word under the name */
  speedLabel: string;
  /** the choice we suggest when the visitor is not sure */
  recommended?: boolean;
}

/** a drag that carries files (not selected text or a link) */
function hasFiles(ev: DragEvent) {
  return Array.from(ev.dataTransfer?.types ?? []).includes('Files');
}
/** the same file chosen twice: same name, size and date */
const fileKey = (f: File) => `${f.name}|${f.size}|${f.lastModified}`;

@Component({
  selector: 'app-upload',
  imports: [FormsModule, RouterLink],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})
export class UploadPage {
  private api = inject(ApiService);
  private router = inject(Router);
  private log = inject(LogService);
  private destroyRef = inject(DestroyRef);
  private pendingFile = inject(PendingFileService);
  private toast = inject(ToastService);
  private device = inject(EngineDevice);
  store = inject(JobsStore);
  site = inject(SiteService);

  files = signal<File[]>([]);
  dragging = signal(false);
  uploading = signal(false);
  uploadProgress = signal(0);
  uploadIndex = signal(0);
  uploadedBytes = signal(0);
  uploadTotal = signal(0);
  uploadSpeed = signal(0); // bytes/second
  uploadDone = signal(false);
  private uploadStart = 0;
  private doneTimer?: ReturnType<typeof setTimeout>;
  private dragTimer?: ReturnType<typeof setTimeout>;
  /** set when the page is left: nothing may navigate or touch page state after that */
  private destroyed = false;
  error = signal('');
  showAdvanced = signal(false);

  // microphone recording
  recording = signal(false);
  recSeconds = signal(0);
  /** true while the browser's microphone permission prompt is open (a second click must not start a second recorder) */
  micBusy = signal(false);
  private recorder?: MediaRecorder;
  private stream?: MediaStream;
  private recTimer?: ReturnType<typeof setInterval>;

  /** the model remembered from earlier in this session ('' = none: the in-browser device plan may pick one) */
  private savedModel = '';
  opts: JobOptions = this.restore();

  fmtBytes = fmtBytes;
  fmtTime = fmtTime;

  presets: Preset[] = [
    { model: 'base', title: 'Fastest', blurb: 'Quick results. Good for clear speech.', speed: 4, speedLabel: 'Quickest' },
    { model: 'small', title: 'Standard', blurb: 'Good for most videos. Not sure? Keep this one.', speed: 3, speedLabel: 'Fast', recommended: true },
    { model: 'large-v3-turbo', title: 'High accuracy', blurb: 'Fewer mistakes. Takes longer.', speed: 2, speedLabel: 'Slower' },
    { model: 'large-v3', title: 'Best accuracy', blurb: 'Fewest mistakes. Takes the longest.', speed: 1, speedLabel: 'Slowest' },
  ];

  /** the hover text of a choice (with the reason when this device cannot run it) */
  tip(p: Preset) {
    const why = this.unavailableReason(p.model);
    return why ? `${p.title}. ${p.blurb} Not available on this device: ${why}.` : `${p.title}. ${p.blurb}`;
  }

  /** the one line of help under the choices: what the picked one means (plus a first-time download, if any) */
  selectedHelp() {
    const p = this.presets.find((x) => x.model === this.opts.model);
    if (!p) return '';
    const note = this.downloadNote(p.model);
    const timing = this.modelInfo(p.model)?.word_timing_note;
    const base = note ? `${p.title}: ${p.blurb} ${note}.` : `${p.title}: ${p.blurb}`;
    return timing ? `${base} Word timing: ${timing}.` : base;
  }

  /**
   * In-browser edition: why this device cannot run the model (the device plan's reason, or "being added" for Qwen),
   * '' when it can. Such models stay in the pickers, disabled, with this text: never hidden, never swapped silently.
   */
  unavailableReason(id: string): string {
    return this.modelInfo(id)?.reason ?? '';
  }

  /** Qwen3-ASR is listed but cannot run here (in-browser edition): the reason, '' when at least one Qwen model can. */
  qwenBlocked = computed(() => {
    const qwen = this.store.models().filter((m) => m.engine === 'qwen' && this.site.modelAllowed(m.id));
    return qwen.length && qwen.every((m) => m.reason) ? (qwen[0].reason as string) : '';
  });

  /** In-browser edition: the time estimate and warnings for the chosen files on this device (weak device, long file). */
  advice = signal<DeviceAdvice | null>(null);
  /** In-browser edition: the device plan's honest notes (no WebGPU, memory assumed, phone speeds estimated). */
  planNotes = signal<string[]>([]);
  private adviceSeq = 0;

  /** Recomputes the estimate (files or model changed). Only the in-browser edition has one. */
  refreshAdvice() {
    if (!this.site.inBrowser()) return;
    const seq = ++this.adviceSeq;
    const files = this.files();
    if (!files.length) {
      this.advice.set(null);
      return;
    }
    this.device
      .advice(files, this.opts.model)
      .then((a) => {
        if (seq === this.adviceSeq && !this.destroyed) this.advice.set(a);
      })
      .catch(() => {
        if (seq === this.adviceSeq) this.advice.set(null);
      });
  }

  /** the presets the server allows (all of them unless it restricts the models) */
  visiblePresets = computed(() => this.presets.filter((p) => this.site.modelAllowed(p.model)));
  /** the models for the advanced select: the ones the server has, minus any it does not allow */
  selectableModels() {
    return this.store.models().filter((m) => this.site.modelAllowed(m.id) && (m.engine ?? 'whisper') === this.opts.engine);
  }

  qwenAvailable = computed(() => this.store.models().some((m) => m.engine === 'qwen' && this.site.modelAllowed(m.id)));

  changeEngine() {
    const list = this.selectableModels();
    this.opts.model = (list.find((m) => !m.reason) ?? list[0])?.id ?? 'small';
    if (this.opts.engine === 'qwen') this.opts.task = 'transcribe';
    this.refreshAdvice();
  }

  choosePreset(model: string) {
    this.opts.engine = 'whisper';
    this.opts.model = model;
    this.refreshAdvice();
  }

  totalSize = computed(() => this.files().reduce((n, f) => n + f.size, 0));
  micSupported = typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

  constructor() {
    this.destroyRef.onDestroy(() => this.teardown());
    // a file chosen in the drop box of a keyword page ("MP3 to text" ...) is waiting here: pick it up once
    const waiting = this.pendingFile.take();
    if (waiting) this.addFiles([waiting]);
    // the server may only allow some models: never keep (or send) one that is not allowed
    effect(() => {
      this.site.allowedModels();
      const noPresets = this.visiblePresets().length === 0;
      untracked(() => {
        this.ensureAllowedModel();
        if (noPresets) this.showAdvanced.set(true); // the select is then the only way to choose
      });
    });
    // in-browser edition: the device plan picks the starting model (unless the visitor chose one this session), and a
    // remembered model this device cannot run is replaced by the plan's default in plain sight, before anything starts
    effect(() => {
      const models = this.store.models();
      untracked(() => {
        if (!this.site.inBrowser() || !models.length) return;
        const suggested = models.find((m) => m.default && !m.reason)?.id;
        const current = models.find((m) => m.id === this.opts.model);
        if (suggested && (!this.savedModel || current?.reason)) {
          this.opts.engine = 'whisper';
          this.opts.model = suggested;
        }
        this.refreshAdvice();
      });
    });
    effect(() => {
      if (!this.site.inBrowser()) return;
      untracked(() => {
        this.device
          .plan()
          .then((p) => {
            if (!this.destroyed) this.planNotes.set(p.notes);
          })
          .catch(() => {});
      });
    });
  }

  private ensureAllowedModel() {
    if (this.site.modelAllowed(this.opts.model)) return;
    const pick = [DEFAULT_OPTIONS.model, ...this.presets.map((p) => p.model)].find((m) => this.site.modelAllowed(m));
    const next = pick ?? this.site.allowedModels()?.[0];
    if (next) {
      this.opts.model = next;
      this.opts.engine = next.startsWith('qwen3-asr-') ? 'qwen' : 'whisper';
    }
  }

  modelInfo(id: string) {
    return this.store.models().find((m) => m.id === id);
  }
  available(id: string) {
    return (
      this.site.modelAllowed(id) &&
      (this.store.models().length === 0 || !!this.modelInfo(id)) &&
      !this.unavailableReason(id)
    );
  }
  /** "3.1 GB": the size of a model that is not on this machine yet; '' once it is (nothing to say then) */
  private downloadSize(id: string) {
    const m = this.modelInfo(id);
    if (!m || m.downloaded) return '';
    return m.size_mb >= 1000 ? `${(m.size_mb / 1000).toFixed(1)} GB` : `${m.size_mb} MB`;
  }
  /** a sentence for a normal person: only for a model that still has to be downloaded */
  downloadNote(id: string) {
    const size = this.downloadSize(id);
    return size ? `First time only: downloads ${size} (needs internet)` : '';
  }
  /** the short form for a select option: "3.1 GB download" */
  downloadShort(id: string) {
    const size = this.downloadSize(id);
    return size ? `${size} download` : '';
  }

  // ------------------------------------------------------------------ whole-page drop and leaving
  /** A file dragged anywhere over the page can be dropped: the page shows "Drop to add your file". */
  @HostListener('window:dragover', ['$event'])
  onWindowDragOver(ev: DragEvent) {
    if (!hasFiles(ev) || this.uploading()) return;
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'copy';
    this.dragging.set(true);
    // dragover repeats while the file is over the page; when it stops (the file left the window) the hint goes away
    clearTimeout(this.dragTimer);
    this.dragTimer = setTimeout(() => this.dragging.set(false), 300);
  }

  @HostListener('window:drop', ['$event'])
  onWindowDrop(ev: DragEvent) {
    if (!hasFiles(ev)) return;
    ev.preventDefault();
    clearTimeout(this.dragTimer);
    this.dragging.set(false);
    this.addFiles(Array.from(ev.dataTransfer?.files ?? []));
  }

  /** Closing or reloading the tab in the middle of an upload would lose it: the browser asks first. */
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(ev: BeforeUnloadEvent) {
    if (!this.uploading() || this.uploadDone()) return;
    ev.preventDefault();
    ev.returnValue = '';
  }

  /** Leaving the page: stop the recorder, release the microphone and make sure nothing navigates later. */
  private teardown() {
    this.destroyed = true;
    clearTimeout(this.doneTimer);
    clearTimeout(this.dragTimer);
    const rec = this.recorder;
    this.recorder = undefined;
    if (rec) {
      // detach first so stopping does not try to add a file to a page that is gone
      rec.ondataavailable = null;
      rec.onstop = null;
      rec.onerror = null;
      try {
        if (rec.state !== 'inactive') rec.stop();
      } catch {
        /* already stopped */
      }
    }
    this.releaseMic();
  }

  /** Stops the timer and the microphone tracks (the browser's "recording" indicator goes off). */
  private releaseMic() {
    clearInterval(this.recTimer);
    this.recTimer = undefined;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = undefined;
  }

  // ------------------------------------------------------------------ files
  onPick(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.addFiles(Array.from(input.files ?? []));
    input.value = '';
  }

  /** A drop handled by an element (the window-level handler above covers the whole page). */
  onDrop(ev: DragEvent) {
    ev.preventDefault();
    ev.stopPropagation(); // the window handler must not add the same files again
    this.dragging.set(false);
    this.addFiles(Array.from(ev.dataTransfer?.files ?? []));
  }

  addFiles(list: File[]) {
    if (this.uploading()) {
      // the list is cleared when the upload finishes, so anything added now would silently vanish
      this.error.set('An upload is in progress. Wait for it to finish before adding more files.');
      return;
    }
    if (!list.length) return;
    const problems: string[] = [];
    const media = list.filter((f) => f.type.startsWith('video/') || f.type.startsWith('audio/') || MEDIA_EXT.test(f.name));
    const skipped = list.length - media.length;
    if (skipped && !media.length) {
      problems.push(list.length === 1 ? 'That is not a video or audio file. Please choose a video or audio file.' : 'None of those are video or audio files.');
    } else if (skipped) {
      this.toast.warning(`${skipped} ${skipped === 1 ? 'file was' : 'files were'} skipped: not video or audio.`, 'File skipped');
    }
    const ok = media.filter((f) => {
      const tooBig = this.oversizeMessage(f);
      if (tooBig) problems.push(tooBig);
      return !tooBig;
    });
    // the same file twice would be transcribed twice: keep one
    const have = new Set(this.files().map(fileKey));
    let dup = 0;
    const fresh = ok.filter((f) => {
      const k = fileKey(f);
      if (have.has(k)) {
        dup++;
        return false;
      }
      have.add(k);
      return true;
    });
    if (dup) this.toast.info(dup === 1 ? 'That file is already in the list.' : `${dup} of those files are already in the list.`, 'Already added');
    this.error.set(problems.join(' '));
    this.files.update((cur) => [...cur, ...fresh]);
    if (fresh.length) this.refreshAdvice();
  }

  removeFile(i: number) {
    if (this.uploading()) return;
    this.files.update((cur) => cur.filter((_, k) => k !== i));
    this.refreshAdvice();
  }

  /** A clear message when the file is bigger than the server accepts, so it is never sent. */
  private oversizeMessage(f: File): string | null {
    const mb = this.store.health()?.max_upload_mb;
    if (!mb || mb <= 0 || f.size <= mb * 1024 * 1024) return null;
    const limit = fmtBytesShort(mb * 1024 * 1024);
    const message = `File "${f.name}" is ${fmtBytesShort(f.size)}; the limit is ${limit}`;
    // only whoever runs their own copy can change the limit
    return this.site.isPublic() ? `${message}.` : `${message} - set VT_MAX_UPLOAD_MB to raise it`;
  }

  // ------------------------------------------------------------------ recording
  async toggleRecording() {
    if (this.micBusy() || this.destroyed) return; // the permission prompt is still open
    if (this.recording()) {
      this.recorder?.stop();
      return;
    }
    if (this.uploading()) return;
    if (!this.micSupported) {
      this.error.set('This browser cannot record. Please choose a file instead.');
      return;
    }
    this.micBusy.set(true);
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      this.micBusy.set(false);
      if (!this.destroyed) {
        this.error.set('');
        this.toast.error('Allow the microphone in your browser, or choose a file instead.', 'No microphone');
      }
      return;
    }
    this.micBusy.set(false);
    if (this.destroyed) {
      // the user left the page while the prompt was open: do not keep the microphone on
      stream.getTracks().forEach((t) => t.stop());
      return;
    }
    this.stream = stream;
    try {
      const chunks: Blob[] = [];
      const rec = new MediaRecorder(stream);
      this.recorder = rec;
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onerror = () => this.error.set('The recording failed. Please try again.');
      rec.onstop = () => {
        this.releaseMic();
        if (this.recorder === rec) this.recorder = undefined;
        if (this.destroyed) return;
        this.recording.set(false);
        if (!chunks.length) {
          this.error.set('Nothing was recorded.');
          return;
        }
        const type = rec.mimeType || 'audio/webm';
        const ext = type.includes('ogg') ? 'ogg' : type.includes('mp4') ? 'm4a' : 'webm';
        const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ').replace(':', '-');
        this.addFiles([new File(chunks, `Recording ${stamp}.${ext}`, { type })]);
      };
      rec.start(1000);
      this.recSeconds.set(0);
      this.recTimer = setInterval(() => this.recSeconds.update((s) => s + 1), 1000);
      this.recording.set(true);
      this.error.set('');
    } catch {
      this.recorder = undefined;
      this.releaseMic();
      this.error.set('Recording is not supported by this browser.');
    }
  }

  // ------------------------------------------------------------------ submit
  start() {
    const files = this.files();
    if (!files.length || this.uploading() || this.recording() || this.destroyed) return;
    for (const f of files) {
      // the health info may have arrived after the file was added
      const tooBig = this.oversizeMessage(f);
      if (tooBig) {
        this.error.set(tooBig);
        return;
      }
    }
    this.ensureAllowedModel();
    const blocked = this.unavailableReason(this.opts.model);
    if (blocked) {
      // never swapped for another model at this point: the visitor decides
      const label = this.modelInfo(this.opts.model)?.label ?? this.opts.model;
      this.error.set(`The ${label} model cannot run on this device: ${blocked}. Choose another one.`);
      return;
    }
    this.persist();
    this.error.set('');
    this.uploading.set(true);
    setTimeout(() =>
      document
        .querySelector('.upload-card')
        ?.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' }),
    );
    const options: JobOptions = { ...this.opts, language: this.opts.language || null };
    const created: string[] = [];
    this.log.info(`Upload started: ${files.length} file(s), ${fmtBytes(this.totalSize())}, model ${options.model}`);

    // The upload is deliberately not cancelled when the page is left: it keeps going and still refreshes
    // the history; it just must not navigate or touch the page afterwards.
    from(files.map((f, i) => ({ f, i })))
      .pipe(
        concatMap(({ f, i }) => {
          if (!this.destroyed) {
            this.uploadIndex.set(i);
            this.uploadProgress.set(0);
            this.uploadedBytes.set(0);
            this.uploadTotal.set(f.size);
          }
          this.uploadStart = Date.now();
          return this.api.createJob(f, options).pipe(
            tap((s) => {
              if (!this.destroyed) {
                this.uploadProgress.set(s.progress);
                if (s.loaded != null) {
                  this.uploadedBytes.set(s.loaded);
                  this.uploadTotal.set(s.total ?? this.uploadTotal());
                  const secs = (Date.now() - this.uploadStart) / 1000;
                  if (secs > 0.5) this.uploadSpeed.set(s.loaded / secs);
                }
              }
              if (s.job) {
                created.push(s.job.id);
                this.store.upsert(s.job);
              }
            }),
          );
        }),
        last(),
      )
      .subscribe({
        next: () => {
          this.log.info(`Upload complete: ${created.length} job(s) queued`, { ids: created });
          this.store.refresh();
          if (this.destroyed) return;
          // show a clear success state for a moment, then open the live transcript
          this.uploadDone.set(true);
          this.doneTimer = setTimeout(() => {
            if (this.destroyed) return;
            this.uploading.set(false);
            this.uploadDone.set(false);
            this.files.set([]);
            this.router.navigate(['/jobs', created[0]], { state: { justUploaded: created.length } });
          }, 1400);
        },
        error: (e) => {
          const msg = this.describe(e);
          this.log.error(`Upload failed: ${msg}`);
          if (created.length) this.store.refresh();
          if (this.destroyed) {
            this.store.notify(msg, 'error', 'Upload failed');
            return;
          }
          this.uploading.set(false);
          if (created.length) {
            // those files are already queued: drop them from the list so Transcribe does not upload them twice
            this.files.update((cur) => cur.slice(created.length));
            const left = files.length - created.length;
            this.error.set(
              `${msg} ${created.length} of ${files.length} file(s) were already queued; the other ${left} ${left === 1 ? 'is' : 'are'} still in the list, press Transcribe to retry.`,
            );
          } else {
            this.error.set(msg);
          }
        },
      });
  }

  private describe(e: unknown): string {
    const status = (e as { status?: number } | null)?.status ?? 0;
    if (!status) {
      return this.site.devHint()
        ? 'Cannot reach the server. Make sure it is running (npm run dev) and try again.'
        : 'Cannot reach the server. Check your connection and try again.';
    }
    const detail = errorDetail(e, '');
    // includes the server's own text for 413 (too large), 429 (busy / too many jobs), 503 (full) and 507 (disk full)
    if (detail) return detail;
    if (status === 413) return 'The file is larger than the server accepts.';
    if (status === 429) return 'The service is busy right now. Please wait a moment and try again.';
    if (status === 503) return 'The service is full right now. Please try again in a little while.';
    if (status === 507) return 'The server does not have enough free disk space for this file.';
    return this.site.devHint()
      ? `Upload failed (server error ${status}). Check the terminal running the server for details.`
      : `Upload failed (server error ${status}). Please try again in a moment.`;
  }

  private restore(): JobOptions {
    try {
      // `prompt` is never persisted; ignore one left behind by an older version too
      const saved = JSON.parse(sessionStorage.getItem(KEY) ?? '{}');
      this.savedModel = typeof saved?.model === 'string' ? saved.model : '';
      return { ...DEFAULT_OPTIONS, ...saved, output_script: saved?.output_script === 'original' ? 'original' : 'hinglish', prompt: '' };
    } catch {
      return { ...DEFAULT_OPTIONS };
    }
  }

  private persist() {
    try {
      // the vocabulary hint can contain names and other private details: keep it out of storage
      const { prompt: _prompt, ...rest } = this.opts;
      sessionStorage.setItem(KEY, JSON.stringify(rest));
    } catch {
      /* ignore */
    }
  }
}
