import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, DestroyRef, ElementRef, computed, effect, inject, input, signal, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { fmtEta, fmtTime } from '../../core/format';
import { errorDetail, isBusy, isTransient } from '../../core/http-error';
import { JobsStore } from '../../core/jobs.store';
import { LogService } from '../../core/log.service';
import { ExportFormat, Job, JobSummary, Segment, SegmentEdit } from '../../core/models';
import { SessionService } from '../../core/session.service';
import { SiteService } from '../../core/site.service';
import { TitleService } from '../../core/title.service';
import { ToastService } from '../../core/toast.service';
import { TranscriptView, findActiveId } from './transcript';

/** The download formats, most wanted first. The hint says in plain words what each one is for. */
export const EXPORTS: { fmt: ExportFormat; label: string; hint: string; ext: string }[] = [
  { fmt: 'pdf', label: 'PDF document (.pdf)', hint: 'Ready to print or share', ext: 'pdf' },
  { fmt: 'plain', label: 'Plain text (.txt)', hint: 'Just the words, in paragraphs', ext: 'txt' },
  { fmt: 'txt', label: 'Text with times (.txt)', hint: 'Each line with its time, like [00:12]', ext: 'txt' },
  { fmt: 'srt', label: 'Subtitles (.srt)', hint: 'For video players and editors', ext: 'srt' },
  { fmt: 'vtt', label: 'Web subtitles (.vtt)', hint: 'For YouTube and web video', ext: 'vtt' },
  { fmt: 'md', label: 'Markdown (.md)', hint: 'For notes apps', ext: 'md' },
  { fmt: 'json', label: 'JSON (.json)', hint: 'For developers: words, times, confidence', ext: 'json' },
];

export const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

/** What the progress card says for each step, in plain words. */
const PHASE_TEXT: Record<string, string> = {
  extracting: 'Preparing the audio…',
  loading_model: 'Getting the speech engine ready…',
  transcribing: 'Transcribing…',
};

/** The file name from a Content-Disposition header (RFC 5987 `filename*=` first, then `filename=`), or null. */
export function fileNameFrom(header: string | null): string | null {
  if (!header) return null;
  const star = /filename\*\s*=\s*(?:UTF-8|utf-8)''([^;]+)/.exec(header);
  if (star) {
    try {
      return decodeURIComponent(star[1].trim());
    } catch {
      /* a malformed name: try the plain one */
    }
  }
  const plain = /filename\s*=\s*"?([^";]+)"?/.exec(header);
  return plain ? plain[1].trim() : null;
}

/** Hands a file to the browser's downloads (the server's name is kept). */
function saveFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000); // iOS reads the file a moment later
}

/** The text inside a Blob (Blob.text where it exists, a FileReader in older browsers). */
function readText(blob: Blob): Promise<string> {
  if (typeof blob.text === 'function') return blob.text();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ''));
    r.onerror = () => reject(r.error);
    r.readAsText(blob);
  });
}

/** The last way to copy when the Clipboard API is missing (http on a local network) or refuses. */
function copyWithSelection(text: string): boolean {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

@Component({
  selector: 'app-job',
  imports: [FormsModule, RouterLink, TranscriptView],
  templateUrl: './job.html',
  styleUrl: './job.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeMenu(true)',
    '(window:beforeunload)': 'onBeforeUnload($event)',
    '(window:pagehide)': 'onPageHide()',
  },
})
export class JobPage {
  id = input.required<string>();

  private api = inject(ApiService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private log = inject(LogService);
  private titles = inject(TitleService);
  private session = inject(SessionService);
  private toast = inject(ToastService);
  store = inject(JobsStore);
  site = inject(SiteService);

  job = signal<Job | null>(null);
  notFound = signal(false);
  /** the transcript is gone because the visitor's session ended (its data is deleted), not because it was deleted by hand */
  sessionEnded = signal(false);
  time = signal(0);
  speed = signal(1);
  /** the open dropdown (a bottom sheet on a phone): the export formats, the "More" list, or the re-transcribe form */
  menu = signal<'export' | 'more' | 'rerun' | null>(null);
  /** the media is playing right now (only then is the "Follow playback" switch offered) */
  playing = signal(false);
  saving = signal(false);
  /** the server could not be reached while loading this job (shown instead of "not found") */
  unreachable = signal(false);
  /** the server's reason for turning the request away (429 busy / rate limited, 503 full); '' when it did not */
  busy = signal('');
  // one flag per request a button starts: the button is disabled while it runs, so it can never be sent twice
  copying = signal(false);
  exporting = signal<ExportFormat | null>(null);
  cancelling = signal(false);
  rerunning = signal(false);
  deleting = signal(false);
  subtitleChars = 42;
  renaming = signal(false);
  titleDraft = '';
  rerunModel = '';
  rerunLanguage: string | null = null;
  rerunOutputScript: 'hinglish' | 'original' = 'hinglish';
  rerunEngine: 'whisper' | 'qwen' = 'whisper';
  rerunRomanizer: 'auto' | 'indicxlit' | 'basic' = 'auto';
  restyling = signal(false);

  /**
   * How many files the visitor just uploaded when this page was opened straight after an upload (0 otherwise). Read
   * once from the history entry and cleared there, so a reload (F5) does not say "Upload complete" again.
   */
  justUploaded = signal(this.takeJustUploaded());

  exports = EXPORTS;
  speeds = SPEEDS;
  fmtTime = fmtTime;

  private player = viewChild<ElementRef<HTMLMediaElement>>('player');
  private transcript = viewChild(TranscriptView);
  /** the transcript list last on screen (kept after it is destroyed, to save a line that was still being edited) */
  private list?: TranscriptView;
  private watchSub?: Subscription;
  private fetchSub?: Subscription;
  private retryTimer?: ReturnType<typeof setTimeout>;
  private destroyed = false;
  private pendingSaves = 0;
  /** the "server is busy" message was already shown for this spell (so the retries do not repeat it) */
  private busyShown = false;
  /** the job the upload toast is for */
  private uploadedId: string | null = null;
  /** the job on screen was queued or running: when it turns "done", "Transcript ready" is said once */
  private wasActive = false;
  private lastExport = { fmt: '', at: 0 };

  /** the models the server allows for a re-run */
  rerunModels() {
    return this.store.models().filter((m) => this.site.modelAllowed(m.id) && (m.engine ?? 'whisper') === this.rerunEngine);
  }
  qwenAvailable = computed(() => this.store.models().some((m) => m.engine === 'qwen' && this.site.modelAllowed(m.id)));
  changeRerunEngine() {
    this.rerunModel = this.rerunModels()[0]?.id ?? 'small';
  }
  conversionWarning = computed(() => this.job()?.segments.find((s) => s.conversion_warning)?.conversion_warning ?? '');

  /** The segment under the playhead. The clock ticks several times a second; this only changes when the line does. */
  activeSeg = computed(() => findActiveId(this.job()?.segments ?? [], this.time()));
  active = computed(() => ['queued', 'running'].includes(this.job()?.status ?? ''));
  hasMedia = computed(() => !!this.job()?.media_url);
  hasVideo = computed(() => this.hasMedia() && this.job()?.media_kind === 'video');
  /** Completion means decoding finished; it does not establish transcript accuracy. */
  qualityConcern = computed(() => {
    const j = this.job();
    if (!j || j.status !== 'done') return '';
    if (!j.segments.length) return 'No speech was transcribed. Check the recording and the selected language.';
    if (j.segments.some((s) => !s.edited && s.review_reasons?.length)) {
      return 'Some passages need a listening check because of repeated text or an uncertain speech boundary.';
    }
    if (j.stats?.avg_confidence != null && j.stats.avg_confidence < 0.6) {
      return 'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.';
    }
    if (j.options.language == null && j.language_probability != null && j.language_probability < 0.8) {
      return 'The spoken language could not be identified confidently. Choose the language you hear and try again.';
    }
    return '';
  });
  /** "English", or the language code when the name is not known; "English → English" is never shown */
  languageName = computed(() => {
    const code = this.job()?.language;
    if (!code) return '';
    return this.store.languages().find((l) => l.code === code)?.name ?? code.toUpperCase();
  });
  /** The model's confidence is a review signal, not measured accuracy. */
  facts = computed(() => {
    const j = this.job();
    if (!j) return [] as string[];
    const out: string[] = [];
    const lang = this.languageName();
    if (lang) out.push(lang + (j.options.task === 'translate' && j.language !== 'en' ? ' → English' : ''));
    if (j.duration) out.push(fmtTime(j.duration));
    const st = j.stats;
    if (st?.word_count) {
      out.push(`${st.word_count.toLocaleString('en-US')} ${st.word_count === 1 ? 'word' : 'words'}`);
      if (st.avg_confidence != null) out.push(`${Math.round(st.avg_confidence * 100)}% model confidence`);
    }
    return out;
  });
  /** The progress card: what is happening now, and how far it is. */
  statusText = computed(() => {
    const j = this.job();
    if (!j) return '';
    return j.status === 'queued' ? 'Waiting in line…' : (PHASE_TEXT[j.phase ?? 'extracting'] ?? 'Working…');
  });
  statusDetail = computed(() => {
    const j = this.job();
    if (!j) return '';
    const parts: string[] = [];
    // floor, so 99.6% never reads "100%" before it is done (the tiny nudge keeps 0.29 from reading 28%)
    if (j.status === 'running' && j.phase === 'transcribing') parts.push(`${Math.floor(j.progress * 100 + 1e-6)}% done`);
    if (j.eta_seconds) parts.push(fmtEta(j.eta_seconds));
    return parts.join(' · ');
  });

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => {
        const shown = this.job();
        if (shown && shown.id !== id) this.flushEdit(shown.id); // a line still being edited in the job we leave is saved
        if (this.uploadedId === null) this.uploadedId = id;
        else if (id !== this.uploadedId) this.justUploaded.set(0); // the upload message is only for the job we just uploaded
        this.wasActive = false;
        this.load(id);
      });
    });
    effect(() => {
      const list = this.transcript();
      if (list) this.list = list;
    });
    // the session ended while a transcript is open (found out by the periodic session check): it is gone for good
    effect(() => {
      if (this.session.ended()) untracked(() => this.onSessionEnded());
    });
    this.destroyRef.onDestroy(() => {
      const shown = this.job();
      if (shown) this.flushEdit(shown.id); // Back button or a link while a line is open: the change is not lost
      this.destroyed = true;
      this.cancelPending();
    });
  }

  private onSessionEnded() {
    if (!this.job()) return;
    this.cancelPending();
    this.job.set(null);
    this.sessionEnded.set(true);
  }

  /** True while this page still shows job `id` (not destroyed, not switched to another job). */
  private current(id: string) {
    return !this.destroyed && this.id() === id;
  }

  /** Stops everything in flight for the previous job: the request, the live stream and the retry timer. */
  private cancelPending() {
    this.fetchSub?.unsubscribe();
    this.watchSub?.unsubscribe();
    this.fetchSub = this.watchSub = undefined;
    clearTimeout(this.retryTimer);
  }

  // ------------------------------------------------------------------ loading + live updates
  /**
   * Fetches the job and, if it is still running, follows it live. `soft` keeps what is on screen (used for
   * refreshes and retries) instead of going back to the "Loading…" state.
   */
  private load(id: string, soft = false) {
    this.cancelPending();
    if (!soft) {
      this.job.set(null);
      this.notFound.set(false);
      this.sessionEnded.set(false);
      this.unreachable.set(false);
      this.busy.set('');
      this.time.set(0);
      this.playing.set(false);
      this.menu.set(null);
      this.renaming.set(false);
      this.cancelling.set(false);
      this.restyling.set(false);
    }
    this.fetchSub = this.api.getJob(id).subscribe({
      next: (j) => {
        if (!this.current(id)) return;
        this.job.set(this.withKnownSegments(j));
        this.notFound.set(false);
        this.unreachable.set(false);
        this.busy.set('');
        this.busyShown = false;
        this.titles.set({ title: j.title, noindex: true });
        if (!soft) this.log.info(`Job opened: ${j.title} (${j.status})`, { id: j.id });
        if (!soft || !this.rerunModel) {
          this.rerunModel = j.options.model;
          // Preserve Auto: a detected language must not become a forced choice on the next run.
          this.rerunLanguage = j.options.language ?? null;
          this.rerunOutputScript = j.options.output_script ?? 'hinglish';
          this.rerunEngine = j.options.engine ?? 'whisper';
          this.rerunRomanizer = j.options.romanizer ?? 'auto';
        }
        this.afterStatus(j);
        if (j.status === 'queued' || j.status === 'running') this.watch(id, j.segments.length);
      },
      error: (e) => {
        if (!this.current(id)) return;
        if (isBusy(e)) {
          // rate limited or full: the transcript is not gone, say why and try again in a moment
          const why = errorDetail(e, 'The server is busy right now.');
          if (!this.job()) this.busy.set(why);
          else if (!this.busyShown) {
            this.busyShown = true;
            this.toast.warning(why, 'Server busy');
          }
          this.scheduleRetry(id, 5000);
        } else if (isTransient(e)) {
          // server down or erroring: this is not "deleted", keep trying while the page is open
          this.busy.set('');
          if (!this.job()) this.unreachable.set(true);
          this.scheduleRetry(id, 3000);
        } else {
          this.gone(id);
        }
      },
    });
  }

  /**
   * What a new status means to the visitor, said once: "Upload complete" when we come straight from the upload, and
   * "Transcript ready" when a transcription that was running on this page has finished.
   */
  private afterStatus(j: JobSummary) {
    const running = j.status === 'queued' || j.status === 'running';
    if (running && j.cancel_requested) this.cancelling.set(true);
    if (!running && this.cancelling()) {
      this.cancelling.set(false);
      if (j.status === 'cancelled') this.toast.info('The text found so far is kept.', 'Cancelled');
    }
    const files = this.justUploaded();
    if (files && j.id === this.uploadedId) {
      this.justUploaded.set(0);
      if (j.status === 'done') this.toast.success('Your transcript is ready below.', 'Upload complete');
      else if (running)
        this.toast.success(
          files > 1
            ? 'Transcription has started. Your other files are under Transcripts at the top of the page.'
            : 'Transcription has started. The text appears below as it is recognised.',
          'Upload complete',
        );
    } else if (this.wasActive && j.status === 'done') {
      this.toast.success('You can now read, fix and download it.', 'Transcript ready');
    }
    this.wasActive = running;
  }

  /** The server does not have this transcript (any more). */
  private gone(id: string) {
    this.log.warn(`Job not found or failed to load: ${id}`);
    this.job.set(null);
    if (!this.site.isPublic()) {
      this.notFound.set(true);
      return;
    }
    // On the public site transcripts vanish when their session ends: ask the server whether that is what happened.
    this.session.check().subscribe({
      next: (ended) => {
        if (!this.current(id)) return;
        if (ended) this.sessionEnded.set(true);
        else this.notFound.set(true);
      },
      error: () => {
        if (this.current(id)) this.notFound.set(true);
      },
    });
  }

  private scheduleRetry(id: string, ms: number) {
    clearTimeout(this.retryTimer);
    this.retryTimer = setTimeout(() => {
      if (this.current(id)) this.load(id, true);
    }, ms);
  }

  private watch(id: string, since: number) {
    this.watchSub?.unsubscribe();
    this.watchSub = this.api.watch(id, since).subscribe({
      next: (e) => {
        if (!this.current(id)) return;
        if (e.type === 'segments') {
          this.job.update((j) => (j ? { ...j, segments: this.mergeSegments(j.segments, e.data as Segment[]) } : j));
        } else {
          const upd = e.data as JobSummary;
          this.job.update((j) => (j ? { ...j, ...upd, segments: j.segments } : j));
          this.store.upsert(upd);
        }
      },
      complete: () => {
        if (!this.current(id)) return;
        this.load(id, true); // final state (and the finished transcript) from the server
        this.store.refresh();
        this.store.refreshModels();
      },
      error: () => this.scheduleRetry(id, 2000),
    });
  }

  /** Reads the "just uploaded" flag from the history entry and clears it so a reload (F5) does not repeat it. */
  private takeJustUploaded(): number {
    try {
      const state = history.state as { justUploaded?: number } | null;
      const n = Number(state?.justUploaded) || 0;
      if (n) history.replaceState({ ...state, justUploaded: undefined }, '');
      return Math.max(0, n);
    } catch {
      return 0;
    }
  }

  /** Append new segments, ignoring any the browser re-sent after an SSE reconnect. */
  private mergeSegments(have: Segment[], incoming: Segment[]) {
    const seen = new Set(have.map((s) => s.id));
    return [...have, ...incoming.filter((s) => !seen.has(s.id))];
  }

  /**
   * The job from the server, with the segment objects already on screen kept where nothing changed: the list keeps
   * those rows as they are (no rebuild of thousands of rows after one edit).
   */
  private withKnownSegments(j: Job): Job {
    const cur = this.job();
    if (!cur || cur.id !== j.id || !cur.segments.length) return j;
    const known = new Map(cur.segments.map((s) => [s.id, s]));
    let reused = 0;
    const segments = j.segments.map((s) => {
      const k = known.get(s.id);
      if (k && k.text === s.text && k.start === s.start && k.end === s.end && !!k.edited === !!s.edited && k.confidence === s.confidence && !!k.words === !!s.words) {
        reused++;
        return k;
      }
      return s;
    });
    return reused ? { ...j, segments } : j;
  }

  // ------------------------------------------------------------------ menus
  reviewQuality(ev: Event) {
    ev.stopPropagation(); // the document's outside-click handler must not close the form immediately
    this.menu.set('rerun');
    setTimeout(() => {
      if (!this.destroyed && this.menu() === 'rerun') document.getElementById('rl')?.focus();
    });
  }

  toggleMenu(which: 'export' | 'more', ev?: Event) {
    const open = this.menu();
    const isOpen = which === 'more' ? open === 'more' || open === 'rerun' : open === which;
    this.menu.set(isOpen ? null : which);
    if (!isOpen) this.fitMenu(ev);
  }

  /**
   * A dropdown is never taller than the room left below its button (a 768px window would otherwise cut the
   * last formats off); it scrolls inside instead. Phones use bottom sheets and ignore this.
   */
  private fitMenu(ev?: Event) {
    const btn = ev?.currentTarget as HTMLElement | null;
    if (!btn?.getBoundingClientRect) return;
    const main = btn.closest('main') ?? document.documentElement;
    const bottom = Math.min(innerHeight, main.getBoundingClientRect().bottom || innerHeight);
    const room = Math.floor(bottom - btn.getBoundingClientRect().bottom - 20);
    btn.closest('.menu-wrap')?.parentElement?.style.setProperty('--menu-room', `${Math.max(240, room)}px`);
  }

  /** Escape (or a tap on the scrim) closes the open dropdown; with Escape the focus goes back to its button. */
  closeMenu(refocus = false) {
    const open = this.menu();
    if (!open) return;
    this.menu.set(null);
    if (refocus) setTimeout(() => document.querySelector<HTMLElement>(`[data-menu="${open === 'rerun' ? 'more' : open}"]`)?.focus());
  }

  /**
   * A click anywhere outside an open dropdown closes it. The event path is used instead of the target because
   * the clicked item may already have left the page (the "Re-transcribe" entry is replaced by its own form).
   */
  onDocumentClick(ev: Event) {
    if (!this.menu()) return;
    const inside = ev.composedPath().some((n) => n instanceof Element && n.classList.contains('menu-wrap'));
    if (!inside) this.menu.set(null);
  }

  /** Leaving or reloading the tab while a change is not saved yet: the browser asks first. */
  onBeforeUnload(ev: BeforeUnloadEvent) {
    if (this.saving() || this.list?.pendingEdit()) {
      ev.preventDefault();
      ev.returnValue = '';
    }
  }

  /**
   * The tab is really going away (closed, reloaded, or Back to another site) with a line still open in its editor: the
   * change is sent with a keepalive request, which the browser delivers even after the page is gone.
   */
  onPageHide() {
    const j = this.job();
    const edit = this.list?.pendingEdit();
    if (!j || !edit || typeof fetch !== 'function') return;
    this.list?.editingId.set(null);
    try {
      void fetch(`/api/jobs/${encodeURIComponent(j.id)}`, {
        method: 'PATCH',
        keepalive: true,
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segments: [edit] }),
      }).catch(() => {});
    } catch {
      /* nothing more can be done while the page unloads */
    }
  }

  // ------------------------------------------------------------------ playback
  seek(t: number) {
    const el = this.player()?.nativeElement;
    if (!el) return;
    el.currentTime = Math.max(0, t);
    el.play().catch(() => {});
  }

  setSpeed(v: number) {
    if (!SPEEDS.includes(v)) return;
    this.speed.set(v);
    const el = this.player()?.nativeElement;
    if (el) el.playbackRate = v;
  }

  // ------------------------------------------------------------------ editing
  /** Saves line edits (one line, a deleted line, or a "replace all"). The line shows the new text at once. */
  save(edits: SegmentEdit[], jobId?: string) {
    const id = jobId ?? this.job()?.id ?? this.id();
    if (!edits.length) return;
    this.pendingSaves++;
    this.saving.set(true);
    const settle = () => {
      this.pendingSaves = Math.max(0, this.pendingSaves - 1);
      this.saving.set(this.pendingSaves > 0);
    };
    const before = this.job();
    if (before?.id === id) this.job.set(this.applyLocally(before, edits));
    const single = edits.length === 1 ? edits[0] : null;
    // not cancelled when leaving the page: an edit the user made should still reach the server
    this.api.patchJob(id, { segments: edits }).subscribe({
      next: (j) => {
        settle();
        if (this.current(id)) this.job.set(this.withKnownSegments(j));
        if (single?.deleted) this.toast.success('The line was removed.', 'Line deleted');
        else if (single) this.toast.success('Your change is saved.', 'Saved');
        else this.toast.success(`Changed in ${edits.length} lines.`, 'Replaced');
      },
      error: (e) => {
        settle();
        this.log.error('Could not save transcript edits', { id });
        if (this.current(id) && before?.id === id) {
          this.job.set(before); // what the server still has
          // a one-line change comes back in its editor, so nothing that was typed is lost
          if (single && !single.deleted) setTimeout(() => this.transcript()?.reopen(single.id, single.text));
        }
        const reopened = single && !single.deleted && this.current(id);
        this.toast.error(errorDetail(e, reopened ? 'Your change is still in its box: press Save to try again.' : 'Could not save the change.'), 'Not saved');
      },
    });
  }

  private applyLocally(j: Job, edits: SegmentEdit[]): Job {
    const byId = new Map(edits.map((e) => [e.id, e]));
    const segments: Segment[] = [];
    for (const s of j.segments) {
      const e = byId.get(s.id);
      if (!e) segments.push(s);
      else if (!e.deleted) segments.push({ ...s, text: e.text, words: null, edited: true });
    }
    return { ...j, segments };
  }

  /** A line that is still open in its editor (with a change) is saved now: the job is being left. */
  private flushEdit(jobId: string) {
    const edit = this.list?.pendingEdit();
    if (!edit) return;
    this.list?.editingId.set(null);
    this.save([edit], jobId);
  }

  startRename() {
    const j = this.job();
    if (!j) return;
    this.titleDraft = j.title;
    this.renaming.set(true);
    // focused, so a click elsewhere (its blur) saves it, and selected, so typing replaces the old name
    setTimeout(() => {
      const box = document.querySelector<HTMLInputElement>('.title-edit');
      box?.focus();
      box?.select();
    });
  }

  finishRename(commit: boolean) {
    if (!this.renaming()) return;
    this.renaming.set(false);
    const j = this.job();
    if (!j || !commit) return;
    const title = this.titleDraft.trim();
    if (title === j.title) return;
    if (!title) {
      this.toast.warning('A name cannot be empty, so the old name was kept.', 'Name not changed');
      return;
    }
    const id = j.id;
    const old = j.title;
    // the new name shows at once; it goes back if the server says no
    this.job.update((cur) => (cur?.id === id ? { ...cur, title } : cur));
    this.titles.set({ title, noindex: true });
    this.api.patchJob(id, { title }).subscribe({
      next: (res) => {
        if (this.current(id)) {
          this.job.update((cur) => (cur?.id === id ? { ...cur, title: res.title } : cur));
          this.titles.set({ title: res.title, noindex: true });
        }
        this.store.refresh();
        this.toast.success(`It is now called “${res.title}”.`, 'Renamed');
      },
      error: (e) => {
        if (this.current(id) && this.job()?.title === title) {
          this.job.update((cur) => (cur?.id === id ? { ...cur, title: old } : cur));
          this.titles.set({ title: old, noindex: true });
        }
        this.toast.error(errorDetail(e, 'Could not rename the transcript.'), 'Not renamed');
      },
    });
  }

  // ------------------------------------------------------------------ export, copy
  /**
   * Downloads one format. The file is fetched first, so a failure is said in a toast instead of a broken download,
   * and the button cannot start a second one while the first is on its way.
   */
  download(fmt: ExportFormat) {
    const j = this.job();
    const e = EXPORTS.find((x) => x.fmt === fmt);
    this.menu.set(null);
    if (!j || !e || this.exporting()) return;
    // a double click on the same format downloads it once
    if (this.lastExport.fmt === fmt && Date.now() - this.lastExport.at < 1500) return;
    this.lastExport = { fmt, at: Date.now() };
    const extra: Record<string, number> = fmt === 'srt' || fmt === 'vtt' ? { max_chars: this.subtitleChars } : {};
    this.exporting.set(fmt);
    this.http.get(this.api.exportUrl(j.id, fmt, extra), { observe: 'response', responseType: 'blob' }).subscribe({
      next: (res: HttpResponse<Blob>) => {
        this.exporting.set(null);
        const name = fileNameFrom(res.headers.get('Content-Disposition')) ?? `${j.title}.${e.ext}`;
        saveFile(res.body ?? new Blob([]), name);
        this.log.info(`Export downloaded: ${fmt}`, { id: j.id });
        this.toast.success(`${e.label}. Look for it in your downloads.`, 'Download started');
      },
      error: async (err: HttpErrorResponse) => {
        this.exporting.set(null);
        this.toast.error(await this.blobErrorDetail(err, 'Could not prepare the file. Please try again.'), 'Download failed');
      },
    });
  }

  /** The server's reason from an error whose body came back as a Blob (a file request). */
  private async blobErrorDetail(err: HttpErrorResponse, fallback: string): Promise<string> {
    let body: unknown = err?.error;
    if (body instanceof Blob) {
      try {
        body = JSON.parse(await readText(body));
      } catch {
        body = null;
      }
    }
    return errorDetail({ status: err?.status, error: body as { detail?: unknown } | null }, fallback);
  }

  /** Copies the transcript (with its times) to the clipboard. */
  async copy() {
    const j = this.job();
    if (!j || this.copying()) return;
    this.copying.set(true);
    const text = firstValueFrom(this.api.exportText(j.id, 'txt'));
    text.catch(() => {}); // handled below; never an "unhandled rejection"
    try {
      const done = await this.writeClipboard(text);
      if (done) this.toast.success('The text is ready to paste.', 'Copied');
      else this.toast.error('Your browser blocked copying here. Use Export to save the text instead.', 'Could not copy');
    } catch (e) {
      this.toast.error(errorDetail(e, 'Could not load the text to copy.'), 'Could not copy');
    } finally {
      this.copying.set(false);
    }
  }

  /**
   * Writes the text to the clipboard. The ClipboardItem route is started inside the click (Safari only allows that)
   * and is given the text when it arrives; writeText and a plain selection copy are the fallbacks.
   * Throws when the text itself could not be loaded; false when every way to copy was refused.
   */
  private async writeClipboard(text: Promise<string>): Promise<boolean> {
    const cb = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;
    const Item = (globalThis as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem;
    if (cb?.write && Item) {
      try {
        await cb.write([new Item({ 'text/plain': text.then((t) => new Blob([t], { type: 'text/plain' })) })]);
        return true;
      } catch {
        /* refused, or the text failed: the checks below tell which */
      }
    }
    const t = await text; // throws when the text could not be loaded
    if (cb?.writeText) {
      try {
        await cb.writeText(t);
        return true;
      } catch {
        /* blocked: try the old way */
      }
    }
    return copyWithSelection(t);
  }

  // ------------------------------------------------------------------ cancel, re-run, delete
  cancel() {
    const j = this.job();
    if (!j || this.cancelling()) return;
    if (!confirm('Stop this transcription? The text found so far is kept.')) return;
    this.cancelling.set(true);
    this.api.cancel(j.id).subscribe({
      next: (upd) => {
        if (!this.current(j.id)) return;
        const pending = upd.status === 'running' || upd.status === 'queued';
        this.cancelling.set(pending);
        if (this.current(j.id)) this.job.update((cur) => (cur?.id === j.id ? { ...cur, ...upd, segments: cur.segments } : cur));
        this.wasActive = pending;
        this.store.refresh();
        if (pending) this.toast.info('Stopping the transcription worker. The text found so far is kept.', 'Cancellation requested');
        else if (upd.status === 'cancelled') this.toast.info('The text found so far is kept.', 'Cancelled');
        else this.toast.info('The transcript finished before it could be cancelled.', 'Already finished');
      },
      error: (e) => {
        this.cancelling.set(false);
        this.toast.error(errorDetail(e, 'Could not cancel the transcript.'), 'Not cancelled');
        this.store.refresh();
      },
    });
  }

  rerun() {
    const id = this.job()?.id ?? this.id();
    if (this.rerunning()) return;
    this.rerunning.set(true);
    this.api.rerun(id, { engine: this.rerunEngine, model: this.rerunModel, language: this.rerunLanguage,
      output_script: this.rerunOutputScript, romanizer: this.rerunRomanizer }).subscribe({
      next: (j) => {
        this.rerunning.set(false);
        this.store.upsert(j);
        this.toast.success('A new transcript has started. The old one is kept in your list.', 'Started again');
        if (!this.current(id)) return; // the user already went elsewhere: do not pull them back
        this.menu.set(null);
        this.router.navigate(['/jobs', j.id]);
      },
      error: (e) => {
        this.rerunning.set(false);
        this.toast.error(errorDetail(e, 'Could not start.'), 'Could not start');
      },
    });
  }

  applyStyle() {
    const j = this.job();
    if (!j || this.restyling()) return;
    this.restyling.set(true);
    this.api.patchJob(j.id, { output_script: this.rerunOutputScript, romanizer: this.rerunRomanizer }).subscribe({
      next: (updated) => {
        if (!this.current(j.id)) return;
        this.restyling.set(false);
        this.job.set(updated);
        this.menu.set(null);
        this.toast.success('Style updated using the saved recognition. Edited lines are kept.', 'Style updated');
      },
      error: (e) => {
        if (!this.current(j.id)) return;
        this.restyling.set(false);
        this.toast.error(errorDetail(e, 'Could not change transcript style.'), 'Style unchanged');
      },
    });
  }

  remove() {
    const j = this.job();
    this.menu.set(null);
    if (!j || this.deleting()) return;
    if (!confirm(`Delete "${j.title}"? This cannot be undone.`)) return;
    this.deleting.set(true);
    this.api.delete(j.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.store.remove(j.id);
        this.toast.success(`“${j.title}” was deleted.`, 'Deleted');
        // replace this page in the history: Back must not lead to a transcript that no longer exists
        if (this.current(j.id)) this.router.navigateByUrl('/', { replaceUrl: true });
      },
      error: (e) => {
        this.deleting.set(false);
        this.toast.error(errorDetail(e, 'Could not delete the transcript.'), 'Not deleted');
        this.store.refresh();
      },
    });
  }
}
