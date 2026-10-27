import { Component, DestroyRef, HostListener, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { concatMap, from, last, tap } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { fmtBytes, fmtBytesShort, fmtTime, prefersReducedMotion } from '../../core/format';
import { errorDetail } from '../../core/http-error';
import { JobsStore } from '../../core/jobs.store';
import { LogService } from '../../core/log.service';
import { DEFAULT_OPTIONS, JobOptions, ModelInfo } from '../../core/models';
import { PendingFileService } from '../../core/pending-file.service';
import { SiteService } from '../../core/site.service';
import { ToastService } from '../../core/toast.service';
import { RelatedTools } from '../../shared/related-tools';
import type { ToolPreset } from '../tool-pages/tool-pages.list';
import { ConverterConsent } from '../../core/transport/converter-consent';
import { DeviceAdvice, EngineDevice } from '../../core/transport/engine-device';
import { translateMessage } from '../../engine/device/message';
import { I18nService } from '../../i18n/i18n.service';
import { _t } from '../../i18n/mark';
import { RichText } from '../../i18n/rich-text';
import { TPipe } from '../../i18n/t.pipe';
import { translateDownloadNote } from '../../core/download-note';
import { ModelPrefetch } from '../../core/transport/model-prefetch';

const KEY = 'vt-options';

/**
 * Texts that other code produces and this page shows (core/transport and engine/qwen build them as fixed English strings).
 * They are translated when shown (`tm()`); listing them here is what lets scripts/extract-i18n.mjs find their keys. A spec
 * checks they still equal what those modules produce.
 */
export const SHOWN_ELSEWHERE = [
  _t('Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).'),
  _t('Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.'),
  _t('Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.'),
  _t('not available in this browser'),
  _t('not available with Qwen (times are per chunk)'),
  _t('first time only, also downloads the {size} MB word-timing model'),
];
/** "first time only, also downloads the 564 MB word-timing model": the one text with a value that core/transport builds itself. */
const WORD_TIMING_DOWNLOAD = /^first time only, also downloads the (\d+) MB word-timing model$/;
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
  imports: [FormsModule, RelatedTools, TPipe, RichText],
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
  private i18n = inject(I18nService);
  private device = inject(EngineDevice);
  private prefetch = inject(ModelPrefetch);
  private converter = inject(ConverterConsent);
  /** the converter question is being prepared (the files are probed): a second click must not start twice */
  private converterCheck = false;
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

  /** The quality choices: English texts that are translation keys, shown with the `t` pipe. */
  presets: Preset[] = [
    { model: 'base', title: _t('Fastest'), blurb: _t('Quick results. Good for clear speech.'), speed: 4, speedLabel: _t('Quickest') },
    { model: 'small', title: _t('Standard'), blurb: _t('Good for most videos.'), speed: 3, speedLabel: _t('Fast'), recommended: true },
    { model: 'large-v3-turbo', title: _t('High accuracy'), blurb: _t('Fewer mistakes. Takes longer.'), speed: 2, speedLabel: _t('Slower') },
    { model: 'large-v3', title: _t('Best accuracy'), blurb: _t('Fewest mistakes. Takes the longest.'), speed: 1, speedLabel: _t('Slowest') },
  ];

  /**
   * The choice marked "Recommended": in the in-browser edition the one the device plan starts with (Fastest on a
   * phone, where Standard's bigger model can run out of memory), else Standard.
   */
  recommendedModel = computed<string | null>(() => {
    const fallback = this.presets.find((p) => p.recommended)?.model ?? null;
    if (!this.site.inBrowser()) return fallback;
    const models = this.store.models();
    const suggested = models.find((m) => m.default && !m.reason)?.id;
    if (!suggested) return fallback;
    if (this.presets.some((p) => p.model === suggested)) return suggested;
    // the plan starts with a model that has no preset (tiny on a weak phone): the lightest choice that can run here
    const runs = (id: string) => models.some((m) => m.id === id && !m.reason);
    return this.presets.find((p) => runs(p.model))?.model ?? fallback;
  });

  isRecommended(p: Preset): boolean {
    return p.model === this.recommendedModel();
  }

  /** what a choice is for, in the page's language (the recommended one adds "Not sure? Keep this one.") */
  blurbOf(p: Preset): string {
    const blurb = this.i18n.t(p.blurb);
    return this.isRecommended(p) ? this.i18n.t('{blurb} Not sure? Keep this one.', { blurb }) : blurb;
  }

  /** The home page text below the tool: the keys (rich texts use **bold** and [links](/path)). */
  readonly info = {
    title: _t('Free video and audio to text'),
    titleBrowser: _t('Free video and audio to text, right in your browser'),
    intro: _t(
      '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.',
    ),
    browser: _t(
      'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.',
    ),
    server: _t('Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.'),
    stepsTitle: _t('How to transcribe a video to text'),
    step1: _t(
      '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.',
    ),
    step2: _t(
      '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.',
    ),
    step3: _t(
      '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.',
    ),
    usesTitle: _t('What people use it for'),
    use1: _t('**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.'),
    use2: _t('**Meeting and interview notes** that you can search, quote and share.'),
    use3: _t('**Lectures and podcasts** turned into readable text for studying or show notes.'),
    use4: _t('**Voice memos** written out, so you do not have to listen to them again.'),
    tipsTitle: _t('Tips for the best transcript'),
    tips: _t(
      'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.',
    ),
    more: _t(
      'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).',
    ),
  };

  /** The four switches under More options (bold lead-in, then the rest). */
  readonly checkText = {
    enhance: _t('**Enhance audio** — filter rumble & hiss, even out quiet speakers'),
    vad: _t('**Skip silence & music** — prevents made-up text'),
    words: _t('**Word-level timing** — better subtitles and confidence marks'),
    context: _t('**Use previous text as context** — can repeat on long files'),
  };

  /**
   * A message that other code produced (a device note, a model's reason, the time estimate) in the page's language.
   * Those modules build fixed English strings: values go through msg() and are translated from there, the Qwen / transport
   * texts are fixed keys (SHOWN_ELSEWHERE), and anything unknown is shown as it is.
   */
  tm(message: string): string {
    const timing = message.match(WORD_TIMING_DOWNLOAD);
    if (timing) return this.i18n.t('first time only, also downloads the {size} MB word-timing model', { size: timing[1] });
    return translateMessage(message, (key, params) => this.i18n.t(key, params));
  }

  /** the pages the "Popular" line links to exist in English only */
  readonly isEnglish = computed(() => this.i18n.locale() === 'en');

  /** The languages for the select, named in the page's language ("Alemán" on the Spanish page) and sorted by that name. English keeps the list as it comes. */
  readonly languageOptions = computed(() => {
    const locale = this.i18n.locale();
    const list = this.store.languages();
    if (locale === 'en') return list;
    let names: Intl.DisplayNames | null = null;
    try {
      names = new Intl.DisplayNames(locale, { type: 'language', fallback: 'none' });
    } catch {
      /* a browser without display names: the English names are shown */
    }
    return list.map((l) => ({ code: l.code, name: this.displayName(names, l.code) ?? l.name })).sort((a, b) => a.name.localeCompare(b.name, locale));
  });

  private displayName(names: Intl.DisplayNames | null, code: string): string | undefined {
    try {
      const name = names?.of(code);
      return name && name.toLowerCase() !== code.toLowerCase() ? name : undefined;
    } catch {
      return undefined;
    }
  }

  /** One <option> of the model select: "Small — Good balance (default) (465 MB download)", or the label and why it cannot run here. */
  modelOption(m: ModelInfo): string {
    const label = m.label;
    if (m.reason) return this.i18n.t('{label} — {reason}', { label, reason: this.tm(m.reason) });
    const note = this.i18n.t(m.note);
    const download = this.downloadShort(m.id);
    return download ? this.i18n.t('{label} — {note} ({download})', { label, note, download }) : this.i18n.t('{label} — {note}', { label, note });
  }

  /** The words on the big button. */
  submitLabel(): string {
    if (this.uploading()) return this.site.inBrowser() ? this.i18n.t('Preparing…') : this.i18n.t('Uploading…');
    const n = this.files().length;
    if (!n) return this.i18n.t('Choose a file first');
    return n > 1 ? this.i18n.t('Transcribe {n} files', { n }) : this.i18n.t('Transcribe');
  }

  /** the hover text of a choice (with the reason when this device cannot run it) */
  tip(p: Preset) {
    const why = this.unavailableReason(p.model);
    const title = this.i18n.t(p.title);
    const blurb = this.blurbOf(p);
    return why
      ? this.i18n.t('{title}. {blurb} Not available on this device: {reason}.', { title, blurb, reason: this.tm(why) })
      : this.i18n.t('{title}. {blurb}', { title, blurb });
  }

  /** the one line of help under the choices: what the picked one means (plus a first-time download, if any) */
  selectedHelp() {
    const p = this.presets.find((x) => x.model === this.opts.model);
    if (!p) return '';
    const title = this.i18n.t(p.title);
    const blurb = this.blurbOf(p);
    const note = this.downloadNote(p.model);
    const timing = this.modelInfo(p.model)?.word_timing_note;
    const base = note ? this.i18n.t('{title}: {blurb} {note}.', { title, blurb, note }) : this.i18n.t('{title}: {blurb}', { title, blurb });
    return timing ? this.i18n.t('{base} Word timing: {timing}.', { base, timing: this.tm(timing) }) : base;
  }

  /**
   * In-browser edition: why this device cannot run the model (the device plan's reason; Qwen's own sentence),
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
    this.chosenModel.set(this.opts.model);
    // the chosen model starts downloading in the background (a chosen file: at once, whatever the connection)
    if (this.opts.engine === 'whisper' && this.available(this.opts.model) && !this.modelInfo(this.opts.model)?.downloaded) {
      this.prefetch.request(this.opts.model, this.files().length ? 'user' : 'auto');
    }
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
    const waiting = this.pendingFile.takeWithPreset();
    if (waiting) {
      this.addFiles([waiting.file]);
      this.applyPreset(waiting.preset);
    }
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

  /**
   * "Translate to English" with a model that cannot translate: OpenAI documents that Large v3 Turbo ("High accuracy") was not
   * trained for translation and returns the original language, and Distil Large v3 hears English only. A plain note, so the
   * visitor can pick another model before the (long) job starts. '' when nothing is wrong.
   */
  translateWarning(): string {
    if (this.opts.task !== 'translate') return '';
    if (this.opts.model === 'large-v3-turbo') {
      return this.i18n.t('High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.');
    }
    if (this.opts.model === 'distil-large-v3') return this.i18n.t('Distil Large v3 understands English speech only. Choose another model to translate.');
    return '';
  }

  /** a language page ("Hindi audio to text") starts the uploader with its language / option; the visitor can still change them */
  private applyPreset(preset: ToolPreset | null) {
    if (!preset) return;
    if (preset.language) this.opts.language = preset.language;
    if (preset.output_script) this.opts.output_script = preset.output_script;
    if (preset.task) {
      this.opts.task = preset.task;
      this.showAdvanced.set(true); // the Output choice lives in More options: show it, so the visitor sees what was picked
    }
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
    const bg = this.prefetch.state();
    if (bg?.model === id && bg.done) return this.i18n.t('Downloaded: ready to start');
    const size = this.downloadSize(id);
    if (!size) return '';
    if (bg?.model === id) return this.i18n.t('First time only: downloads {size}, now downloading in the background', { size });
    return this.i18n.t('First time only: downloads {size} (needs internet)', { size });
  }

  /** the background download's progress under the help line (not read out on every step: no aria-live) */
  prefetchLine = computed(() => {
    const bg = this.prefetch.state();
    if (!bg || bg.done || bg.model !== this.chosenModel() || !bg.total) return '';
    const mb = (n: number) => (n >= 1e9 ? `${(n / 1e9).toFixed(2)} GB` : `${Math.round(n / 1e6)} MB`);
    const line = this.i18n.t('Getting the model ready: {loaded} of {total}', { loaded: mb(bg.loaded), total: mb(bg.total) });
    return bg.note ? `${line} · ${translateDownloadNote(bg.note, (k, p) => this.i18n.t(k, p))}` : line;
  });
  /** opts is a plain object; the preset choice and the model select update this copy for prefetchLine */
  private readonly chosenModel = signal('');
  /** the short form for a select option: "3.1 GB download" */
  downloadShort(id: string) {
    const size = this.downloadSize(id);
    return size ? this.i18n.t('{size} download', { size }) : '';
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
      this.error.set(this.i18n.t('An upload is in progress. Wait for it to finish before adding more files.'));
      return;
    }
    if (!list.length) return;
    const problems: string[] = [];
    const media = list.filter((f) => f.type.startsWith('video/') || f.type.startsWith('audio/') || MEDIA_EXT.test(f.name));
    const skipped = list.length - media.length;
    if (skipped && !media.length) {
      problems.push(
        list.length === 1
          ? this.i18n.t('That is not a video or audio file. Please choose a video or audio file.')
          : this.i18n.t('None of those are video or audio files.'),
      );
    } else if (skipped) {
      this.toast.warning(
        skipped === 1 ? this.i18n.t('1 file was skipped: not video or audio.') : this.i18n.t('{n} files were skipped: not video or audio.', { n: skipped }),
        this.i18n.t('File skipped'),
      );
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
    if (dup) {
      this.toast.info(
        dup === 1 ? this.i18n.t('That file is already in the list.') : this.i18n.t('{n} of those files are already in the list.', { n: dup }),
        this.i18n.t('Already added'),
      );
    }
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
    const values = { name: f.name, size: fmtBytesShort(f.size), limit };
    // only whoever runs their own copy can change the limit
    return this.site.isPublic()
      ? this.i18n.t('File "{name}" is {size}; the limit is {limit}.', values)
      : this.i18n.t('File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it', values);
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
      this.error.set(this.i18n.t('This browser cannot record. Please choose a file instead.'));
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
        this.toast.error(this.i18n.t('Allow the microphone in your browser, or choose a file instead.'), this.i18n.t('No microphone'));
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
      rec.onerror = () => this.error.set(this.i18n.t('The recording failed. Please try again.'));
      rec.onstop = () => {
        this.releaseMic();
        if (this.recorder === rec) this.recorder = undefined;
        if (this.destroyed) return;
        this.recording.set(false);
        if (!chunks.length) {
          this.error.set(this.i18n.t('Nothing was recorded.'));
          return;
        }
        const type = rec.mimeType || 'audio/webm';
        const ext = type.includes('ogg') ? 'ogg' : type.includes('mp4') ? 'm4a' : 'webm';
        const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ').replace(':', '-');
        this.addFiles([new File(chunks, `${this.i18n.t('Recording {stamp}', { stamp })}.${ext}`, { type })]);
      };
      rec.start(1000);
      this.recSeconds.set(0);
      this.recTimer = setInterval(() => this.recSeconds.update((s) => s + 1), 1000);
      this.recording.set(true);
      this.error.set('');
    } catch {
      this.recorder = undefined;
      this.releaseMic();
      this.error.set(this.i18n.t('Recording is not supported by this browser.'));
    }
  }

  // ------------------------------------------------------------------ submit
  /** `converterChecked`: the converter question was already settled for these files (the second pass). */
  start(converterChecked = false) {
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
      this.error.set(
        this.i18n.t('The {label} model cannot run on this device: {reason}. Choose another one.', { label, reason: this.tm(blocked).replace(/[.。]$/, '') }),
      );
      return;
    }
    // in-browser edition: a file only ffmpeg.wasm can read (AVI, WMA, FLV, AMR ...) needs the visitor's yes to the
    // 9 MB converter first; the page asks once and remembers a yes
    if (this.site.inBrowser() && !converterChecked && this.converter.answer() === null) {
      if (this.converterCheck) return;
      this.converterCheck = true;
      Promise.resolve()
        .then(() => Promise.all(files.map((f) => this.device.needsConverter(f))))
        .then((needs) => {
          if (needs.some(Boolean) && !this.destroyed) {
            const yes = this.converter.ask((text) => window.confirm(text));
            this.log.info(`Converter for ${needs.filter(Boolean).length} file(s): ${yes ? 'allowed' : 'declined'}`);
          }
        })
        .catch(() => undefined)
        .finally(() => {
          this.converterCheck = false;
          if (this.destroyed || this.uploading()) return;
          this.start(true);
        });
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
            this.router.navigate(this.jobCommands(created[0]), { state: { justUploaded: created.length } });
          }, 1400);
        },
        error: (e) => {
          const msg = this.describe(e);
          this.log.error(`Upload failed: ${msg}`);
          if (created.length) this.store.refresh();
          if (this.destroyed) {
            this.store.notify(msg, 'error', this.i18n.t('Upload failed'));
            return;
          }
          this.uploading.set(false);
          if (created.length) {
            // those files are already queued: drop them from the list so Transcribe does not upload them twice
            this.files.update((cur) => cur.slice(created.length));
            const left = files.length - created.length;
            const values = { message: msg, done: created.length, total: files.length, left };
            this.error.set(
              left === 1
                ? this.i18n.t('{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.', values)
                : this.i18n.t('{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.', values),
            );
          } else {
            this.error.set(msg);
          }
        },
      });
  }

  /** Where a started job's page is: "/jobs/<id>" in English, "/es/jobs/<id>" in Spanish (the router commands, as navigate() takes them). */
  private jobCommands(id: string): string[] {
    const path = this.i18n.path(`/jobs/${id}`);
    return path === `/jobs/${id}` ? ['/jobs', id] : [path];
  }

  private describe(e: unknown): string {
    const status = (e as { status?: number } | null)?.status ?? 0;
    if (!status) {
      return this.site.devHint()
        ? this.i18n.t('Cannot reach the server. Make sure it is running (npm run dev) and try again.')
        : this.i18n.t('Cannot reach the server. Check your connection and try again.');
    }
    const detail = errorDetail(e, '');
    // includes the server's own text for 413 (too large), 429 (busy / too many jobs), 503 (full) and 507 (disk full)
    if (detail) return detail;
    if (status === 413) return this.i18n.t('The file is larger than the server accepts.');
    if (status === 429) return this.i18n.t('The service is busy right now. Please wait a moment and try again.');
    if (status === 503) return this.i18n.t('The service is full right now. Please try again in a little while.');
    if (status === 507) return this.i18n.t('The server does not have enough free disk space for this file.');
    return this.site.devHint()
      ? this.i18n.t('Upload failed (server error {status}). Check the terminal running the server for details.', { status })
      : this.i18n.t('Upload failed (server error {status}). Please try again in a moment.', { status });
  }

  private restore(): JobOptions {
    try {
      // `prompt` is never persisted; ignore one left behind by an older version too
      const saved = JSON.parse(sessionStorage.getItem(KEY) ?? '{}');
      this.savedModel = typeof saved?.model === 'string' ? saved.model : '';
      return { ...DEFAULT_OPTIONS, ...saved, output_script: saved?.output_script === 'hinglish' ? 'hinglish' : 'original', prompt: '' };
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
