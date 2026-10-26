import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fmtTime, prefersReducedMotion } from '../../core/format';
import { Segment, SegmentEdit } from '../../core/models';
import { I18nService } from '../../i18n/i18n.service';
import { TPipe } from '../../i18n/t.pipe';

interface Part {
  text: string;
  hit?: boolean;
  level?: 'low' | 'mid';
  start?: number;
}
interface Row {
  seg: Segment;
  /** "01:23", worked out once instead of on every change-detection pass */
  time: string;
  /** a plain text row is drawn as one text node; only "rich" rows (a search hit or a shaky word) get parts */
  rich: boolean;
  parts: Part[];
  uncertain: boolean;
  /** a warning mark after the line: it is unsure, and no single word in it is marked (there are no word timings) */
  flag: boolean;
}

interface Block {
  i: number;
  rows: Row[];
}

const LOW = 0.5;
const MID = 0.75;
/** rows per content-visibility group */
const BLOCK = 50;
/** rows in the page at first; more are added when the visitor scrolls near the end (so a 3 hour recording opens at once) */
const FIRST_ROWS = 400;
const MORE_ROWS = 400;
/** start adding rows when the end of the list is this close (px) */
const NEAR_END = 2400;

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** The id of the segment under the playhead `t` (seconds), or null between segments. Segments are in time order. */
export function findActiveId(segs: Segment[], t: number): number | null {
  if (t <= 0) return null;
  let lo = 0, hi = segs.length - 1, found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (segs[mid].start <= t + 0.05) { found = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return found >= 0 && t <= segs[found].end + 0.6 ? segs[found].id : null;
}

/**
 * The transcript list. It is built to stay cheap on a 2 hour recording (thousands of rows, tens of thousands of words):
 *  - OnPush: a playback tick that does not change the active row costs one binary search, not a pass over every row;
 *  - a row is one text node unless it has something to show (a search hit or an uncertain word);
 *  - only the first rows are in the page; the rest are added as the visitor scrolls (or searches / plays) towards them;
 *  - rows are cached per segment and keep their DOM when new live segments are appended;
 *  - clicks are handled once on the list (no listener per row or per word);
 *  - the CSS side adds content-visibility so rows that are off screen cost no layout or paint.
 */
@Component({
  selector: 'app-transcript',
  imports: [FormsModule, TPipe],
  templateUrl: './transcript.html',
  styleUrl: './transcript.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranscriptView implements AfterViewChecked, AfterViewInit {
  segments = input.required<Segment[]>();
  time = input(0);
  /** the segment being played, worked out by the caller; when given it is used instead of `time` */
  activeSegment = input<number | null | undefined>(undefined);
  live = input(false);
  hasMedia = input(false);
  /** the media is playing right now: only then is the "Follow playback" switch worth showing */
  playing = input(false);

  seek = output<number>();
  save = output<SegmentEdit[]>();

  query = signal('');
  replacement = signal('');
  showReplace = signal(false);
  uncertain = signal(true);
  autoScroll = signal(true);
  editingId = signal<number | null>(null);
  draft = '';
  matchIdx = signal(0);

  fmtTime = fmtTime;
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);
  private i18n = inject(I18nService);
  private list = viewChild<ElementRef<HTMLElement>>('list');
  private lastScrolled: number | string | null = null;
  private lastLen = 0;
  /**
   * live mode: keep the newest line in view, unless the visitor scrolled up to read. Unknown until the first scroll: a list
   * that scrolls itself (desktop) starts pinned to its end; when the page scrolls instead (a phone) it is pinned once the
   * visitor has scrolled down to the end, so opening the page never jumps past the title and the progress.
   */
  private stick: boolean | null = null;
  /** how many rows are in the page right now (grows as the visitor scrolls towards the end) */
  private limit = signal(FIRST_ROWS);
  private prevTotal = 0;
  private loadingMore = false;
  private destroyed = false;
  private searchTimer?: ReturnType<typeof setTimeout>;
  private cache = new WeakMap<Segment, Row>();
  private cacheKey = '';

  private regex = computed(() => {
    const q = this.query().trim();
    return q ? new RegExp(escapeRe(q), 'gi') : null;
  });

  /** The rows in the page. Unchanged segments keep the very same row object, so a live append only builds the new rows. */
  rows = computed<Row[]>(() => {
    const re = this.regex();
    const showWords = this.uncertain();
    const key = `${re ? re.source : ''}|${showWords}`;
    if (key !== this.cacheKey) {
      this.cacheKey = key;
      this.cache = new WeakMap();
    }
    const segs = this.segments();
    const n = Math.min(segs.length, this.limit());
    const out = new Array<Row>(n);
    for (let i = 0; i < n; i++) {
      const seg = segs[i];
      let row = this.cache.get(seg);
      if (!row) {
        const parts = this.buildParts(seg, re, showWords);
        const uncertain = seg.confidence != null && seg.confidence < 0.6;
        const marked = parts.some((p) => p.level);
        row = { seg, time: fmtTime(seg.start), parts, rich: parts.length > 1 || !!parts[0]?.hit || marked, uncertain, flag: showWords && uncertain && !marked };
        this.cache.set(seg, row);
      }
      out[i] = row;
    }
    return out;
  });

  /**
   * The rows in groups of 50. Each group is one content-visibility box, so the browser tracks ~60 boxes instead of
   * thousands of rows: scrolling, a class change on one row and a live append never touch the far-away groups.
   */
  blocks = computed<Block[]>(() => {
    const rows = this.rows();
    const out: Block[] = [];
    for (let i = 0; i < rows.length; i += BLOCK) out.push({ i: i / BLOCK, rows: rows.slice(i, i + BLOCK) });
    return out;
  });

  matches = computed(() => {
    const re = this.regex();
    return re ? this.segments().filter((s) => { re.lastIndex = 0; return re.test(s.text); }).map((s) => s.id) : [];
  });
  private currentMatchId = computed(() => this.matches()[this.matchIdx()] ?? null);

  /**
   * Segment under the playhead. Only its value matters downstream, so a tick inside the same segment changes nothing.
   * The page that owns the media clock should pass `activeSegment` (it changes a few times a minute) instead of `time`
   * (it changes several times a second, and an OnPush component is re-checked every time one of its inputs changes).
   */
  activeId = computed(() => {
    const forced = this.activeSegment();
    return forced !== undefined ? forced : findActiveId(this.segments(), this.time());
  });

  constructor() {
    effect(() => {
      this.query();
      this.matchIdx.set(0);
    });
    // new segments join the page at once when the page already shows everything (or the transcript is live)
    effect(() => {
      const total = this.segments().length;
      untracked(() => this.fill(total));
    });
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      clearTimeout(this.searchTimer);
    });
    // the rows asked for by a scroll are now in the page: the next scroll may ask for more
    effect(() => {
      this.rows();
      this.loadingMore = false;
    });
  }

  ngAfterViewInit() {
    // a plain listener: an (scroll) binding would run change detection on every scroll frame
    const l = this.list()?.nativeElement;
    if (!l) return;
    l.addEventListener('scroll', this.onScroll, { passive: true });
    // On a phone the list is as tall as its rows and the page scrolls instead (the shell's main area, or the window):
    // listen there too, so "near the end" and "stay at the newest line" keep working.
    const parent: EventTarget = this.scrollParent(l) ?? window;
    parent.addEventListener('scroll', this.onScroll, { passive: true });
    this.destroyRef.onDestroy(() => parent.removeEventListener('scroll', this.onScroll));
  }

  private onScroll = () => {
    const l = this.list()?.nativeElement;
    if (!l) return;
    const left = this.distanceToEnd(l);
    this.stick = left < 140;
    if (left < NEAR_END && !this.loadingMore && this.limit() < this.segments().length) {
      this.loadingMore = true; // cleared once the new rows are in the page
      this.limit.update((n) => n + MORE_ROWS);
    }
  };

  // ------------------------------------------------------------------ which box scrolls
  /**
   * True when the list is its own scroll box (a desktop: a card of fixed height with the text scrolling inside).
   * False when it is as tall as its rows and the page scrolls (a phone). Without layout (tests) the list counts as its own box.
   */
  private selfScrolls(l: HTMLElement) {
    return l.clientHeight === 0 || l.scrollHeight > l.clientHeight + 1;
  }

  /** The nearest ancestor that scrolls (the shell's main area), or null for the window. */
  private scrollParent(el: HTMLElement): HTMLElement | null {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const o = getComputedStyle(p).overflowY;
      if (o === 'auto' || o === 'scroll') return p;
    }
    return null;
  }

  /** The part of the screen through which the rows are seen: the list itself, or the window / scrolling ancestor. */
  private viewBox(l: HTMLElement): { top: number; bottom: number } {
    if (this.selfScrolls(l)) {
      const h = l.getBoundingClientRect();
      return { top: h.top, bottom: h.bottom };
    }
    const p = this.scrollParent(l)?.getBoundingClientRect();
    return { top: Math.max(0, p?.top ?? 0), bottom: Math.min(window.innerHeight, p?.bottom ?? window.innerHeight) };
  }

  /** How far (px) the end of the list is below what is on screen. */
  private distanceToEnd(l: HTMLElement) {
    if (this.selfScrolls(l)) return l.scrollHeight - l.scrollTop - l.clientHeight;
    return l.getBoundingClientRect().bottom - this.viewBox(l).bottom;
  }

  /** Shows the newest line (live mode). */
  private scrollToEnd(l: HTMLElement) {
    if (this.selfScrolls(l)) {
      l.scrollTop = l.scrollHeight;
      return;
    }
    if (l.getBoundingClientRect().bottom > this.viewBox(l).bottom) l.scrollIntoView({ block: 'end', behavior: 'auto' });
  }

  private fill(total: number) {
    const prev = this.prevTotal;
    this.prevTotal = total;
    if (this.limit() >= total) return;
    if (this.live() || (prev > 0 && this.limit() >= prev)) this.limit.set(total);
  }

  /** Makes sure the row for `id` is in the page; true when it already was. */
  private reveal(id: number) {
    const segs = this.segments();
    const idx = segs.findIndex((s) => s.id === id);
    if (idx < 0 || idx < this.limit()) return idx >= 0;
    const want = Math.min(segs.length, idx + 40);
    // not written right away: this may be called while the view is being checked
    queueMicrotask(() => {
      if (this.destroyed) return;
      this.limit.update((n) => Math.max(n, want));
      // The rows are drawn by this list's own update, which does not call ngAfterViewChecked (the parent's check does, and
      // the parent is not re-checked for it): look at the playing row again once they are there, so it is followed at once.
      afterNextRender(() => this.ngAfterViewChecked(), { injector: this.injector });
    });
    return false;
  }

  private buildParts(seg: Segment, re: RegExp | null, showWords: boolean): Part[] {
    if (!re) {
      const ws = showWords ? seg.words : null;
      // no word data, or every word is confident: nothing to mark, so the row stays plain text
      if (!ws?.length || !ws.some((w) => w.probability < MID)) return [{ text: seg.text }];
      // runs of confident words are merged: only the shaky words become spans
      const out: Part[] = [];
      let run = '';
      let runStart = 0;
      for (const w of ws) {
        const level = w.probability < LOW ? 'low' : w.probability < MID ? 'mid' : undefined;
        if (!level) {
          if (!run) runStart = w.start;
          run += w.word;
          continue;
        }
        if (run) {
          out.push({ text: run, start: runStart, level: undefined });
          run = '';
        }
        out.push({ text: w.word, start: w.start, level });
      }
      if (run) out.push({ text: run, start: runStart, level: undefined });
      return out;
    }
    const out: Part[] = [];
    let last = 0;
    re.lastIndex = 0;
    for (let m = re.exec(seg.text); m; m = re.exec(seg.text)) {
      if (m.index > last) out.push({ text: seg.text.slice(last, m.index) });
      out.push({ text: m[0], hit: true });
      last = m.index + m[0].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    if (!out.length) return [{ text: seg.text }];
    if (last < seg.text.length) out.push({ text: seg.text.slice(last) });
    return out;
  }

  // ------------------------------------------------------------------ search
  /** typing is applied a moment after the last key, so a word is searched once, not once per letter */
  onSearchInput(value: string) {
    clearTimeout(this.searchTimer);
    const n = value.trim().length;
    this.searchTimer = setTimeout(() => this.query.set(value), n === 0 ? 0 : n < 2 ? 350 : 140);
  }

  /** Escape in the search box empties it (and with it the highlighting) */
  clearSearch(input: HTMLInputElement) {
    clearTimeout(this.searchTimer);
    input.value = '';
    this.query.set('');
    this.showReplace.set(false);
  }

  /** Enter: apply what is typed right now, then go to the next match */
  onSearchEnter(value: string) {
    clearTimeout(this.searchTimer);
    if (this.query() !== value) this.query.set(value);
    this.step(1);
  }

  step(dir: 1 | -1) {
    const n = this.matches().length;
    if (!n) return;
    this.matchIdx.update((i) => (i + dir + n) % n);
    this.scrollTo(this.matches()[this.matchIdx()]);
  }

  currentMatch(id: number) {
    return this.currentMatchId() === id;
  }

  replaceAll() {
    const re = this.regex();
    if (!re) return;
    const repl = this.replacement();
    const edits: SegmentEdit[] = [];
    for (const s of this.segments()) {
      re.lastIndex = 0;
      if (re.test(s.text)) {
        re.lastIndex = 0;
        edits.push({ id: s.id, text: s.text.replace(re, () => repl) });
      }
    }
    if (!edits.length) return;
    const n = edits.length;
    const ask = { query: this.query(), replacement: repl, n };
    const question =
      n === 1
        ? this.i18n.t('Replace "{query}" with "{replacement}" in 1 line?', ask)
        : this.i18n.t('Replace "{query}" with "{replacement}" in {n} lines?', ask);
    if (confirm(question)) {
      this.save.emit(edits);
      this.query.set('');
      this.replacement.set('');
      this.showReplace.set(false);
    }
  }

  // ------------------------------------------------------------------ editing
  edit(seg: Segment) {
    this.draft = seg.text;
    this.editingId.set(seg.id);
    setTimeout(() => {
      const ta = this.list()?.nativeElement.querySelector<HTMLTextAreaElement>('textarea.edit');
      ta?.focus();
      ta?.setSelectionRange(ta.value.length, ta.value.length);
    });
  }

  commit(seg: Segment) {
    if (this.editingId() !== seg.id) return; // already committed/cancelled (blur fires after Enter)
    const text = this.draft.trim();
    this.editingId.set(null);
    if (text && text !== seg.text) this.save.emit([{ id: seg.id, text }]);
  }

  /** Closes the editor without saving (its Cancel button; Escape does the same). */
  cancel() {
    this.editingId.set(null);
  }

  /** Deletes the line being edited, after one question (there is no undo). */
  remove(seg: Segment) {
    if (!confirm(this.i18n.t('Delete this line from the transcript?'))) return;
    this.editingId.set(null);
    this.save.emit([{ id: seg.id, text: seg.text, deleted: true }]);
  }

  /** The change in the open editor that is not saved yet (null when there is none): the page saves it when it is left. */
  pendingEdit(): SegmentEdit | null {
    const id = this.editingId();
    if (id === null) return null;
    const seg = this.segments().find((s) => s.id === id);
    const text = this.draft.trim();
    return seg && text && text !== seg.text ? { id, text } : null;
  }

  /** Opens line `id` again with `text` in its editor (its save failed: what was typed is not lost). */
  reopen(id: number, text: string) {
    const seg = this.segments().find((s) => s.id === id);
    if (!seg || this.destroyed) return;
    this.edit(seg);
    this.draft = text;
  }

  onKey(ev: KeyboardEvent, seg: Segment) {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      this.commit(seg);
    } else if (ev.key === 'Escape') {
      this.editingId.set(null);
    }
  }

  // ------------------------------------------------------------------ clicks (one listener for the whole list)
  onListClick(ev: MouseEvent) {
    const target = ev.target as HTMLElement | null;
    const rowEl = target?.closest<HTMLElement>('.seg');
    if (!target || !rowEl) return;
    const id = Number(rowEl.dataset['id']);
    const seg = this.segments().find((s) => s.id === id);
    if (!seg) return;
    const btn = target.closest('button');
    if (btn) {
      const act = btn.getAttribute('data-act');
      if (act === 'seek') {
        if (this.hasMedia()) this.seek.emit(seg.start);
      } else if (act === 'edit') {
        this.edit(seg);
      }
      return; // any other button (Delete segment) has its own handler
    }
    if (!this.hasMedia() || this.editingId() === seg.id || target.closest('textarea')) return;
    if (typeof getSelection === 'function' && getSelection()?.isCollapsed === false) return; // selecting text, not seeking
    const t = this.timeAt(ev, target, seg, rowEl);
    if (t !== null) this.seek.emit(t);
  }

  /** The start time of the word that was clicked (falls back to the segment start when the browser cannot say). */
  private timeAt(ev: MouseEvent, target: HTMLElement, seg: Segment, rowEl: HTMLElement): number | null {
    const words = seg.words;
    if (!words?.length) return null;
    const marked = target.closest<HTMLElement>('[data-t]');
    if (marked) return Number(marked.dataset['t']);
    const wordsEl = rowEl.querySelector<HTMLElement>('.words');
    if (!wordsEl || !wordsEl.contains(target)) return seg.start;
    let node: Node | null = null;
    let offset = 0;
    const d = document as Document & {
      caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
      caretRangeFromPoint?: (x: number, y: number) => Range | null;
    };
    if (d.caretPositionFromPoint) {
      const p = d.caretPositionFromPoint(ev.clientX, ev.clientY);
      if (p) ({ offsetNode: node, offset } = p);
    } else if (d.caretRangeFromPoint) {
      const r = d.caretRangeFromPoint(ev.clientX, ev.clientY);
      if (r) ({ startContainer: node, startOffset: offset } = r);
    }
    if (!node || !wordsEl.contains(node)) return seg.start;
    const range = document.createRange();
    range.setStart(wordsEl, 0);
    range.setEnd(node, offset);
    const pos = range.toString().length;
    let acc = 0;
    for (const w of words) {
      acc += w.word.length;
      if (pos < acc) return w.start;
    }
    return words[words.length - 1].start;
  }

  // ------------------------------------------------------------------ scrolling
  /** smooth unless the visitor asked their system for less motion */
  private get scrollBehavior(): ScrollBehavior {
    return prefersReducedMotion() ? 'auto' : 'smooth';
  }

  /** The element of row `id`, found by position (group, then row in the group), not by scanning the page. */
  private rowEl(host: HTMLElement, id: number): HTMLElement | null {
    const idx = this.rows().findIndex((r) => r.seg.id === id);
    const el = idx >= 0 ? (host.children[Math.floor(idx / BLOCK)]?.children[idx % BLOCK] as HTMLElement | undefined) : undefined;
    if (el && el.dataset['id'] === String(id)) return el;
    return host.querySelector<HTMLElement>(`[data-id="${id}"]`);
  }

  private scrollTo(id: number) {
    if (!this.reveal(id)) {
      // the row is not in the page yet: draw it, then come back
      afterNextRender(() => this.scrollTo(id), { injector: this.injector });
      return;
    }
    const host = this.list()?.nativeElement;
    if (host) this.rowEl(host, id)?.scrollIntoView({ block: 'center', behavior: this.scrollBehavior });
  }

  ngAfterViewChecked() {
    const host = this.list()?.nativeElement;
    if (!host) return;
    const n = this.rows().length;
    if (this.live() && n !== this.lastLen) {
      this.lastLen = n;
      if (this.stick ?? this.selfScrolls(host)) this.scrollToEnd(host);
      return;
    }
    const id = this.activeId();
    if (this.autoScroll() && id !== null && id !== this.lastScrolled && this.editingId() === null) {
      const el = this.rowEl(host, id);
      if (!el) {
        this.reveal(id); // not drawn yet: the next pass finds it
        return;
      }
      this.lastScrolled = id;
      const r = el.getBoundingClientRect(), h = this.viewBox(host);
      if (r.top < h.top + 20 || r.bottom > h.bottom - 20) el.scrollIntoView({ block: 'center', behavior: this.scrollBehavior });
    }
  }
}
