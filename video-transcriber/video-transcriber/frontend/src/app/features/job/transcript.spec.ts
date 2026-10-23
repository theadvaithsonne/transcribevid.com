import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Segment, SegmentEdit } from '../../core/models';
import { makeSegments, makeWord } from '../../testing/fakes';
import { TranscriptView, findActiveId } from './transcript';

/** The list as the job page uses it: a normal (not OnPush) parent that passes the playing line. */
@Component({
  imports: [TranscriptView],
  template: `<app-transcript [segments]="segments()" [activeSegment]="active()" [hasMedia]="true" [playing]="true" />`,
})
class PlayingHost {
  segments = signal<Segment[]>([]);
  active = signal<number | null>(null);
}

function seg(id: number, start: number, end: number, text: string, extra: Partial<Segment> = {}): Segment {
  return { id, start, end, text, words: null, confidence: 0.9, ...extra };
}

// drawing hundreds of rows in jsdom is slow on a busy machine: do not let the default 5 s decide
vi.setConfig({ testTimeout: 30_000 });

describe('TranscriptView', () => {
  let fixture: ComponentFixture<TranscriptView>;
  let view: TranscriptView;
  let saved: SegmentEdit[][];

  let sought: number[];

  function setup(
    segments: Segment[],
    inputs: { time?: number; live?: boolean; activeSegment?: number | null; hasMedia?: boolean; playing?: boolean } = {},
  ) {
    fixture = TestBed.createComponent(TranscriptView);
    view = fixture.componentInstance;
    saved = [];
    sought = [];
    view.save.subscribe((e) => saved.push(e));
    view.seek.subscribe((t) => sought.push(t));
    fixture.componentRef.setInput('segments', segments);
    for (const [name, value] of Object.entries(inputs)) if (value !== undefined) fixture.componentRef.setInput(name, value);
  }

  beforeEach(() => {
    vi.useFakeTimers();
    // jsdom has no layout / scrolling
    Element.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  describe('search highlighting (rows[].parts)', () => {
    it('returns the plain text when there is no query and no word data', () => {
      setup([seg(1, 0, 2, 'hello world')]);
      expect(view.rows()[0].parts).toEqual([{ text: 'hello world' }]);
    });

    it('splits a segment into text and hit parts, ignoring case, keeping the original casing', () => {
      setup([seg(1, 0, 2, 'Hello hello HELLO world')]);
      view.query.set('hello');
      expect(view.rows()[0].parts).toEqual([
        { text: 'Hello', hit: true },
        { text: ' ' },
        { text: 'hello', hit: true },
        { text: ' ' },
        { text: 'HELLO', hit: true },
        { text: ' world' },
      ]);
    });

    it('treats regex characters in the query literally', () => {
      setup([seg(1, 0, 2, 'cost (a+b) = 3.5? or 3x5')]);
      view.query.set('3.5');
      expect(view.rows()[0].parts.filter((p) => p.hit).map((p) => p.text)).toEqual(['3.5']); // not "3x5"
      view.query.set('(a+b)');
      expect(view.rows()[0].parts.filter((p) => p.hit).map((p) => p.text)).toEqual(['(a+b)']);
      view.query.set('[');
      expect(() => view.rows()).not.toThrow();
    });

    it('finds back-to-back matches and a match at the very start / end', () => {
      setup([seg(1, 0, 2, 'abab')]);
      view.query.set('ab');
      expect(view.rows()[0].parts).toEqual([
        { text: 'ab', hit: true },
        { text: 'ab', hit: true },
      ]);
    });

    it('ignores a whitespace-only query', () => {
      setup([seg(1, 0, 2, 'a b')]);
      view.query.set('   ');
      expect(view.rows()[0].parts).toEqual([{ text: 'a b' }]);
      expect(view.matches()).toEqual([]);
    });

    it('shows per-word confidence levels when words exist and no search is active', () => {
      const words = [
        { start: 0, end: 0.5, word: 'good', probability: 0.95 },
        { start: 0.5, end: 1, word: ' fine', probability: 0.6 },
        { start: 1, end: 1.5, word: ' bad', probability: 0.3 },
      ];
      setup([seg(1, 0, 2, 'good fine bad', { words })]);
      expect(view.rows()[0].parts).toEqual([
        { text: 'good', start: 0, level: undefined },
        { text: ' fine', start: 0.5, level: 'mid' },
        { text: ' bad', start: 1, level: 'low' },
      ]);
      view.uncertain.set(false);
      expect(view.rows()[0].parts).toEqual([{ text: 'good fine bad' }]);
      view.uncertain.set(true);
      view.query.set('fine'); // a search takes over the highlighting
      expect(view.rows()[0].parts.some((p) => p.hit)).toBe(true);
    });

    it('flags low-confidence segments', () => {
      setup([seg(1, 0, 1, 'a', { confidence: 0.59 }), seg(2, 1, 2, 'b', { confidence: 0.6 }), seg(3, 2, 3, 'c', { confidence: null })]);
      expect(view.rows().map((r) => r.uncertain)).toEqual([true, false, false]);
    });
  });

  describe('matches', () => {
    it('lists every matching segment id (the /g regex must not skip neighbours)', () => {
      setup([seg(1, 0, 1, 'color'), seg(2, 1, 2, 'no'), seg(3, 2, 3, 'Color color'), seg(4, 3, 4, 'color')]);
      view.query.set('color');
      expect(view.matches()).toEqual([1, 3, 4]);
    });

    it('step() cycles through matches in both directions', () => {
      setup([seg(1, 0, 1, 'x'), seg(2, 1, 2, 'x'), seg(3, 2, 3, 'x')]);
      view.query.set('x');
      expect(view.matchIdx()).toBe(0);
      view.step(1);
      expect(view.matchIdx()).toBe(1);
      view.step(1);
      view.step(1);
      expect(view.matchIdx()).toBe(0); // wrapped
      view.step(-1);
      expect(view.matchIdx()).toBe(2);
      expect(view.currentMatch(3)).toBe(true);
      expect(view.currentMatch(1)).toBe(false);
    });

    it('step() does nothing without matches', () => {
      setup([seg(1, 0, 1, 'x')]);
      view.query.set('zzz');
      view.step(1);
      expect(view.matchIdx()).toBe(0);
    });

    it('goes back to the first match when the query changes', () => {
      setup([seg(1, 0, 1, 'x y'), seg(2, 1, 2, 'x y')]);
      fixture.detectChanges();
      view.query.set('x');
      fixture.detectChanges();
      view.step(1);
      expect(view.matchIdx()).toBe(1);
      view.query.set('y');
      fixture.detectChanges();
      expect(view.matchIdx()).toBe(0);
    });
  });

  describe('activeId (segment under the playhead)', () => {
    const segs = [seg(10, 0, 2, 'a'), seg(11, 2, 4, 'b'), seg(12, 5, 7, 'c')];

    function at(time: number, list = segs) {
      setup(list, { time });
      return view.activeId();
    }

    it('is null at the start and for an empty transcript', () => {
      expect(at(0)).toBeNull();
      expect(at(-1)).toBeNull();
      expect(at(3, [])).toBeNull();
    });

    it('finds the segment containing the time', () => {
      expect(at(1)).toBe(10);
      expect(at(3)).toBe(11);
      expect(at(6)).toBe(12);
    });

    it('switches a hair early at a boundary (0.05 s tolerance) and picks the later segment on a tie', () => {
      expect(at(2)).toBe(11);
      expect(at(1.96)).toBe(11);
      expect(at(1.9)).toBe(10);
    });

    it('keeps a segment active for 0.6 s after it ends, then goes null in a gap', () => {
      expect(at(4.5)).toBe(11);
      expect(at(4.7)).toBeNull();
    });

    it('is null long after the last segment', () => {
      expect(at(100)).toBeNull();
    });

    it('works across many segments (binary search)', () => {
      const many = Array.from({ length: 1000 }, (_, i) => seg(i, i * 2, i * 2 + 1.5, 't'));
      expect(at(1234.2, many)).toBe(617);
      expect(at(1231.9, many)).toBe(615); // in the 0.5 s gap before 616, within the 0.6 s grace of 615
    });
  });

  describe('replaceAll', () => {
    it('emits one edit per segment that contains the query and clears the search', () => {
      setup([seg(1, 0, 1, 'Color and color'), seg(2, 1, 2, 'nothing'), seg(3, 2, 3, 'COLOR')]);
      view.query.set('color');
      view.replacement.set('colour');
      view.replaceAll();
      expect(saved).toEqual([
        [
          { id: 1, text: 'colour and colour' },
          { id: 3, text: 'colour' },
        ],
      ]);
      expect(view.query()).toBe('');
    });

    it('inserts the replacement literally ($& and $1 are not special)', () => {
      setup([seg(1, 0, 1, 'price')]);
      view.query.set('price');
      view.replacement.set('$& $1 $$');
      view.replaceAll();
      expect(saved[0]).toEqual([{ id: 1, text: '$& $1 $$' }]);
    });

    it('does nothing when the user declines the confirmation', () => {
      vi.stubGlobal('confirm', vi.fn(() => false));
      setup([seg(1, 0, 1, 'a')]);
      view.query.set('a');
      view.replaceAll();
      expect(saved).toEqual([]);
      expect(view.query()).toBe('a');
    });

    it('does nothing without a query or without matches', () => {
      setup([seg(1, 0, 1, 'a')]);
      view.replaceAll();
      view.query.set('zzz');
      view.replaceAll();
      expect(saved).toEqual([]);
      expect(confirm).not.toHaveBeenCalled();
    });

    it('can replace with an empty string (delete the text)', () => {
      setup([seg(1, 0, 1, 'well-known')]);
      view.query.set('-');
      view.replacement.set('');
      view.replaceAll();
      expect(saved[0]).toEqual([{ id: 1, text: 'wellknown' }]);
    });
  });

  describe('editing / commit guard', () => {
    const s = seg(7, 0, 1, 'original');

    it('commit saves the trimmed text once, even if blur fires after Enter', () => {
      setup([s]);
      view.edit(s);
      expect(view.editingId()).toBe(7);
      view.draft = '  changed  ';
      view.commit(s); // Enter
      view.commit(s); // blur after Enter
      expect(saved).toEqual([[{ id: 7, text: 'changed' }]]);
      expect(view.editingId()).toBeNull();
    });

    it('does not save unchanged or empty text', () => {
      setup([s]);
      view.edit(s);
      view.commit(s);
      expect(saved).toEqual([]);
      view.edit(s);
      view.draft = '   ';
      view.commit(s);
      expect(saved).toEqual([]);
    });

    it('ignores a commit for a segment that is not being edited', () => {
      const other = seg(8, 1, 2, 'other');
      setup([s, other]);
      view.edit(s);
      view.draft = 'changed';
      view.commit(other);
      expect(saved).toEqual([]);
      expect(view.editingId()).toBe(7);
    });

    it('Escape cancels without saving, and a following blur is ignored', () => {
      setup([s]);
      view.edit(s);
      view.draft = 'changed';
      view.onKey(new KeyboardEvent('keydown', { key: 'Escape' }), s);
      view.commit(s);
      expect(saved).toEqual([]);
    });

    it('Enter commits, Shift+Enter does not', () => {
      setup([s]);
      view.edit(s);
      view.draft = 'changed';
      view.onKey(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, cancelable: true }), s);
      expect(saved).toEqual([]);
      view.onKey(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }), s);
      expect(saved).toEqual([[{ id: 7, text: 'changed' }]]);
    });

    it('remove emits a delete edit and leaves edit mode', () => {
      setup([s]);
      view.edit(s);
      view.remove(s);
      expect(saved).toEqual([[{ id: 7, text: 'original', deleted: true }]]);
      expect(view.editingId()).toBeNull();
    });
  });

  it('renders one row per segment and survives live updates', () => {
    setup([seg(1, 0, 1, 'one')], { live: true });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.seg').length).toBe(1);
    fixture.componentRef.setInput('segments', [seg(1, 0, 1, 'one'), seg(2, 1, 2, 'two')]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.seg').length).toBe(2);
  });

  // ====================================================================================================
  // the list for long recordings: 400 rows at first, more on demand
  // ====================================================================================================
  describe('findActiveId (binary search for the line under the playhead)', () => {
    const segs = [seg(10, 0, 2, 'a'), seg(11, 2, 4, 'b'), seg(12, 5, 7, 'c')];

    it('is null at or before the start, and for no segments at all', () => {
      expect(findActiveId(segs, 0)).toBeNull();
      expect(findActiveId(segs, -3)).toBeNull();
      expect(findActiveId([], 5)).toBeNull();
    });

    it('returns the id (not the index) of the segment that contains the time', () => {
      expect(findActiveId(segs, 1)).toBe(10);
      expect(findActiveId(segs, 3)).toBe(11);
      expect(findActiveId(segs, 6)).toBe(12);
    });

    it('is 0.05 s early at a boundary, and the later segment wins a tie', () => {
      expect(findActiveId(segs, 2)).toBe(11);
      expect(findActiveId(segs, 1.95)).toBe(11);
      expect(findActiveId(segs, 1.94)).toBe(10);
    });

    it('keeps a line for 0.6 s after it ended, then is null in a gap and after the last line', () => {
      expect(findActiveId(segs, 4.6)).toBe(11);
      expect(findActiveId(segs, 4.61)).toBeNull();
      expect(findActiveId(segs, 7.6)).toBe(12);
      expect(findActiveId(segs, 7.7)).toBeNull();
      expect(findActiveId(segs, 1000)).toBeNull();
    });

    it('is null before the first line starts', () => {
      expect(findActiveId([seg(1, 5, 6, 'late')], 4)).toBeNull();
      expect(findActiveId([seg(1, 5, 6, 'late')], 4.96)).toBe(1);
    });

    it('works for one segment, for the first and the last of many, and does not scan (large input)', () => {
      expect(findActiveId([seg(7, 0, 1, 'x')], 0.5)).toBe(7);
      const many = Array.from({ length: 100_000 }, (_, i) => seg(i, i * 2, i * 2 + 1.5, 't'));
      expect(findActiveId(many, 0.5)).toBe(0);
      expect(findActiveId(many, 199_999 + 0.1)).toBe(99_999);
      expect(findActiveId(many, 123_456.2)).toBe(61_728);
      let reads = 0;
      const counted = new Proxy(many, {
        get(target, prop, receiver) {
          if (typeof prop === 'string' && /^\d+$/.test(prop)) reads++;
          return Reflect.get(target, prop, receiver);
        },
      });
      findActiveId(counted, 150_000);
      expect(reads).toBeLessThan(40); // about log2(100 000) = 17 reads
    });

    it('uses the id even when ids are not 0, 1, 2 ... (after segments were deleted)', () => {
      expect(findActiveId([seg(3, 0, 1, 'a'), seg(9, 1, 2, 'b'), seg(40, 2, 3, 'c')], 1.5)).toBe(9);
    });
  });

  describe('the line under the playhead (activeSegment / time)', () => {
    const segs = [seg(10, 0, 2, 'a'), seg(11, 2, 4, 'b')];

    it('uses the line the page worked out (activeSegment) in preference to the clock', () => {
      setup(segs, { time: 3, activeSegment: 10 });
      expect(view.activeId()).toBe(10);
    });

    it('an activeSegment of null means "no line", even when the clock would find one', () => {
      setup(segs, { time: 3, activeSegment: null });
      expect(view.activeId()).toBeNull();
    });

    it('without activeSegment it works the line out from the time', () => {
      setup(segs, { time: 3 });
      expect(view.activeId()).toBe(11);
    });

    it('marks the active row in the page', () => {
      setup(segs, { activeSegment: 11 });
      fixture.detectChanges();
      const rows = Array.from(fixture.nativeElement.querySelectorAll('.seg')) as HTMLElement[];
      expect(rows.map((r) => r.classList.contains('active'))).toEqual([false, true]);
    });

    it('a tick of the clock inside the same line changes nothing (the id stays the same)', () => {
      setup(segs, { time: 2.5 });
      const seen: (number | null)[] = [];
      for (const t of [2.5, 2.9, 3.4, 3.8]) {
        fixture.componentRef.setInput('time', t);
        seen.push(view.activeId());
      }
      expect(seen).toEqual([11, 11, 11, 11]);
    });
  });

  describe('only the first 400 rows are in the page', () => {
    const rowCount = () => fixture.nativeElement.querySelectorAll('.seg').length;
    const blockCount = () => fixture.nativeElement.querySelectorAll('.blk').length;

    function scrollTo(left: number) {
      const list = fixture.nativeElement.querySelector('.list') as HTMLElement;
      Object.defineProperty(list, 'scrollHeight', { value: 100_000, configurable: true });
      Object.defineProperty(list, 'clientHeight', { value: 600, configurable: true });
      Object.defineProperty(list, 'scrollTop', { value: 100_000 - 600 - left, configurable: true, writable: true });
      list.dispatchEvent(new Event('scroll'));
    }

    it('a long transcript opens with 400 rows, in groups of 50', () => {
      setup(makeSegments(450));
      fixture.detectChanges();
      expect(view.rows().length).toBe(400);
      expect(rowCount()).toBe(400);
      expect(blockCount()).toBe(8);
      expect(Array.from(fixture.nativeElement.querySelectorAll('.blk')).every((b) => (b as HTMLElement).children.length === 50)).toBe(true);
    });

    it('the rows are the first ones, in order', () => {
      setup(makeSegments(450));
      fixture.detectChanges();
      const ids = Array.from(fixture.nativeElement.querySelectorAll('.seg')).map((r) => (r as HTMLElement).dataset['id']);
      expect(ids[0]).toBe('0');
      expect(ids[399]).toBe('399');
      expect(ids.length).toBe(400);
    });

    it('a transcript of 400 rows or fewer is shown whole (and 401 is cut at 400)', () => {
      setup(makeSegments(400));
      fixture.detectChanges();
      expect(rowCount()).toBe(400);
      setup(makeSegments(401));
      fixture.detectChanges();
      expect(rowCount()).toBe(400);
      setup(makeSegments(3));
      fixture.detectChanges();
      expect(rowCount()).toBe(3);
      expect(blockCount()).toBe(1);
    });

    it('scrolling near the end adds 400 more rows', () => {
      setup(makeSegments(900));
      fixture.detectChanges();
      scrollTo(1500);
      fixture.detectChanges();
      expect(rowCount()).toBe(800);
      scrollTo(1500);
      fixture.detectChanges();
      expect(rowCount()).toBe(900); // what is left, not more
    });

    it('scrolling far from the end adds nothing', () => {
      setup(makeSegments(450));
      fixture.detectChanges();
      scrollTo(5000);
      fixture.detectChanges();
      expect(rowCount()).toBe(400);
    });

    it('two scroll events before the new rows are drawn add 400 once, not 800', () => {
      setup(makeSegments(1300));
      fixture.detectChanges();
      scrollTo(1000);
      scrollTo(900);
      fixture.detectChanges();
      expect(rowCount()).toBe(800);
      expect(view.rows().length).toBe(800);
    });

    it('scrolling at the end of a transcript that is fully shown does nothing', () => {
      setup(makeSegments(300));
      fixture.detectChanges();
      scrollTo(10);
      fixture.detectChanges();
      expect(rowCount()).toBe(300);
    });

    it('rows that were added stay when the visitor scrolls back up', () => {
      setup(makeSegments(900));
      fixture.detectChanges();
      scrollTo(1500);
      fixture.detectChanges();
      scrollTo(50_000);
      fixture.detectChanges();
      expect(rowCount()).toBe(800);
    });

    it('a search match beyond the first rows is shown when stepping to it (a little more than the match)', async () => {
      setup(makeSegments(500));
      fixture.detectChanges();
      view.query.set('line 450');
      fixture.detectChanges();
      expect(view.matches()).toEqual([450]);
      expect(fixture.nativeElement.querySelector('[data-id="450"]')).toBeNull();
      view.step(1);
      await Promise.resolve();
      fixture.detectChanges();
      expect(view.rows().length).toBe(490);
      const row = fixture.nativeElement.querySelector('[data-id="450"]') as HTMLElement;
      expect(row).not.toBeNull();
      expect(row.classList.contains('match')).toBe(true);
    });

    it('and scrolls the row into view once it is there', async () => {
      setup(makeSegments(500));
      fixture.detectChanges();
      const spy = vi.fn();
      Element.prototype.scrollIntoView = spy;
      view.query.set('line 450');
      fixture.detectChanges();
      view.step(1);
      await Promise.resolve();
      fixture.detectChanges();
      TestBed.tick();
      expect(spy).toHaveBeenCalled();
      expect((spy.mock.contexts.at(-1) as HTMLElement).dataset['id']).toBe('450');
    });

    it('a match inside the rows already shown does not load anything more', async () => {
      setup(makeSegments(500));
      fixture.detectChanges();
      view.query.set('line 20');
      view.step(1);
      await Promise.resolve();
      fixture.detectChanges();
      expect(rowCount()).toBe(400);
    });

    it('the last match of a long list is reached with the up arrow too (stepping back wraps round to it)', async () => {
      setup(makeSegments(500));
      fixture.detectChanges();
      view.query.set('line 49');
      fixture.detectChanges();
      expect(view.matches().length).toBe(11); // 49, 490..499
      view.step(-1);
      await Promise.resolve();
      fixture.detectChanges();
      expect(view.matches()[view.matchIdx()]).toBe(499);
      expect(view.rows().length).toBe(500);
      expect(fixture.nativeElement.querySelector('[data-id="499"]')).not.toBeNull();
    });

    it('Enter in the search box applies what is typed and goes to the first match, loading its row', async () => {
      setup(makeSegments(500));
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
      input.value = 'line 450';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await Promise.resolve();
      fixture.detectChanges();
      expect(view.query()).toBe('line 450');
      expect(fixture.nativeElement.querySelector('[data-id="450"]')).not.toBeNull();
    });

    it('playing toward later rows loads them: the row under the playhead is drawn and followed', async () => {
      // inside a page, like in the app: the rows are added by the list's own update, and it must still scroll to the row
      const spy = vi.fn();
      Element.prototype.scrollIntoView = spy;
      const host = TestBed.createComponent(PlayingHost);
      host.componentInstance.segments.set(makeSegments(500));
      host.componentInstance.active.set(450);
      host.detectChanges();
      await Promise.resolve(); // the extra rows are asked for from the first pass and added right after it
      host.detectChanges();
      const row = host.nativeElement.querySelector('[data-id="450"]') as HTMLElement;
      expect(row).not.toBeNull();
      expect(row.classList.contains('active')).toBe(true);
      expect(host.nativeElement.querySelectorAll('.seg').length).toBe(490);
      expect(spy).toHaveBeenCalled();
      expect((spy.mock.contexts.at(-1) as HTMLElement).dataset['id']).toBe('450');
    });

    it('a playhead on a line that is not in the transcript (it was deleted) asks for nothing and does not loop', async () => {
      const spy = vi.fn();
      Element.prototype.scrollIntoView = spy;
      const host = TestBed.createComponent(PlayingHost);
      host.componentInstance.segments.set(makeSegments(500));
      host.componentInstance.active.set(5000);
      host.detectChanges();
      await Promise.resolve();
      host.detectChanges();
      await host.whenStable();
      expect(host.nativeElement.querySelectorAll('.seg').length).toBe(400);
      expect(spy).not.toHaveBeenCalled();
    });

    it('with "Follow playback" off the playhead does not pull more rows in or scroll', async () => {
      const spy = vi.fn();
      Element.prototype.scrollIntoView = spy;
      setup(makeSegments(500), { hasMedia: true, playing: true });
      fixture.detectChanges();
      view.autoScroll.set(false);
      fixture.componentRef.setInput('activeSegment', 450);
      fixture.detectChanges();
      await Promise.resolve();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.seg').length).toBe(400);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('a live transcript shows every row', () => {
    const rowCount = () => fixture.nativeElement.querySelectorAll('.seg').length;

    it('even when there are more than 400', () => {
      setup(makeSegments(450), { live: true });
      fixture.detectChanges();
      fixture.detectChanges();
      expect(view.rows().length).toBe(450);
      expect(rowCount()).toBe(450);
    });

    it('new lines join at once, one after the other', () => {
      const first = makeSegments(420);
      setup(first, { live: true });
      fixture.detectChanges();
      fixture.detectChanges();
      expect(rowCount()).toBe(420);
      fixture.componentRef.setInput('segments', makeSegments(440));
      fixture.detectChanges();
      fixture.detectChanges();
      expect(rowCount()).toBe(440);
    });

    it('rows that are already there keep their data when lines are added (no rebuild of the whole list)', () => {
      const [a, b] = [seg(1, 0, 1, 'one'), seg(2, 1, 2, 'two')];
      setup([a, b], { live: true });
      fixture.detectChanges();
      const before = view.rows();
      fixture.componentRef.setInput('segments', [a, b, seg(3, 2, 3, 'three')]);
      fixture.detectChanges();
      expect(view.rows()[0]).toBe(before[0]);
      expect(view.rows()[1]).toBe(before[1]);
      expect(view.rows().length).toBe(3);
    });

    it('stays whole when the transcript is finished (the same lines, no longer live)', () => {
      const segs = makeSegments(450);
      setup(segs, { live: true });
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.componentRef.setInput('live', false);
      fixture.detectChanges();
      expect(rowCount()).toBe(450);
    });

    it('has no search box or uncertain-words switch, only a note that text appears as it is recognised', () => {
      setup(makeSegments(3), { live: true });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('input[type="search"]')).toBeNull();
      expect(fixture.nativeElement.querySelector('.switch')).toBeNull();
      expect(fixture.nativeElement.querySelector('.live-note').textContent).toContain('Live: the text appears here as it is recognised');
      expect(fixture.nativeElement.querySelector('.list').classList.contains('live')).toBe(true);
    });

    it('keeps the newest line in view while the visitor has not scrolled up', () => {
      setup(makeSegments(5), { live: true });
      fixture.detectChanges();
      const list = fixture.nativeElement.querySelector('.list') as HTMLElement;
      Object.defineProperty(list, 'scrollHeight', { value: 5000, configurable: true });
      Object.defineProperty(list, 'scrollTop', { value: 0, configurable: true, writable: true });
      fixture.componentRef.setInput('segments', makeSegments(6));
      fixture.detectChanges();
      expect(list.scrollTop).toBe(5000);
    });

    it('leaves the scroll position alone when the visitor scrolled up to read', () => {
      setup(makeSegments(5), { live: true });
      fixture.detectChanges();
      const list = fixture.nativeElement.querySelector('.list') as HTMLElement;
      Object.defineProperty(list, 'scrollHeight', { value: 5000, configurable: true });
      Object.defineProperty(list, 'clientHeight', { value: 500, configurable: true });
      Object.defineProperty(list, 'scrollTop', { value: 1000, configurable: true, writable: true });
      list.dispatchEvent(new Event('scroll')); // 3500 px from the end: reading
      fixture.componentRef.setInput('segments', makeSegments(6));
      fixture.detectChanges();
      expect(list.scrollTop).toBe(1000);
    });

    it('waiting for the first words says so', () => {
      setup([], { live: true });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.empty').textContent).toBe('Waiting for the first words…');
    });
  });

  describe('a finished transcript that grows', () => {
    const rowCount = () => fixture.nativeElement.querySelectorAll('.seg').length;

    it('new lines join at once when the page already shows everything', () => {
      setup(makeSegments(300));
      fixture.detectChanges();
      fixture.componentRef.setInput('segments', makeSegments(350));
      fixture.detectChanges();
      fixture.componentRef.setInput('segments', makeSegments(450));
      fixture.detectChanges();
      fixture.detectChanges();
      expect(rowCount()).toBe(450);
    });

    it('but not when the visitor has only seen the first part of a long one', () => {
      setup(makeSegments(450));
      fixture.detectChanges();
      fixture.componentRef.setInput('segments', makeSegments(451));
      fixture.detectChanges();
      expect(rowCount()).toBe(400);
    });

    it('an edit that comes back from the server (same number of lines) keeps the rows that were loaded', () => {
      const segs = makeSegments(900);
      setup(segs);
      fixture.detectChanges();
      const list = fixture.nativeElement.querySelector('.list') as HTMLElement;
      Object.defineProperty(list, 'scrollHeight', { value: 100_000, configurable: true });
      Object.defineProperty(list, 'clientHeight', { value: 600, configurable: true });
      Object.defineProperty(list, 'scrollTop', { value: 98_000, configurable: true, writable: true });
      list.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(rowCount()).toBe(800);
      fixture.componentRef.setInput('segments', makeSegments(900));
      fixture.detectChanges();
      expect(rowCount()).toBe(800);
    });
  });

  describe('the search box (typing is applied a moment after the last key)', () => {
    it('two or more characters: after 140 ms', () => {
      setup([seg(1, 0, 1, 'hello')]);
      view.onSearchInput('he');
      vi.advanceTimersByTime(139);
      expect(view.query()).toBe('');
      vi.advanceTimersByTime(1);
      expect(view.query()).toBe('he');
    });

    it('one character: after 350 ms (a single letter matches nearly everything)', () => {
      setup([seg(1, 0, 1, 'hello')]);
      view.onSearchInput('h');
      vi.advanceTimersByTime(349);
      expect(view.query()).toBe('');
      vi.advanceTimersByTime(1);
      expect(view.query()).toBe('h');
    });

    it('clearing the box applies at once (on the next tick)', () => {
      setup([seg(1, 0, 1, 'hello')]);
      view.query.set('he');
      view.onSearchInput('');
      expect(view.query()).toBe('he');
      vi.advanceTimersByTime(0);
      expect(view.query()).toBe('');
    });

    it('every key starts the wait again: a word is searched once, not once per letter', () => {
      setup([seg(1, 0, 1, 'hello world')]);
      const applied: string[] = [];
      for (const typed of ['hel', 'hell', 'hello']) {
        view.onSearchInput(typed);
        vi.advanceTimersByTime(100);
        applied.push(view.query());
      }
      expect(applied).toEqual(['', '', '']);
      vi.advanceTimersByTime(40);
      expect(view.query()).toBe('hello');
    });

    it('Enter applies what is typed straight away and goes to the first match (and the waiting timer is dropped)', () => {
      setup([seg(1, 0, 1, 'one apple'), seg(2, 1, 2, 'two apples')]);
      view.onSearchInput('app');
      view.onSearchEnter('app');
      expect(view.query()).toBe('app');
      expect(view.matches()).toEqual([1, 2]);
      expect(view.matchIdx()).toBe(1); // Enter = next: from the first match to the second
      vi.advanceTimersByTime(1000);
      expect(view.query()).toBe('app');
    });

    it('Enter again goes on to the next match', () => {
      setup([seg(1, 0, 1, 'a'), seg(2, 1, 2, 'a'), seg(3, 2, 3, 'a')]);
      view.onSearchEnter('a');
      expect(view.matchIdx()).toBe(1);
      view.onSearchEnter('a');
      expect(view.matchIdx()).toBe(2);
      view.onSearchEnter('a');
      expect(view.matchIdx()).toBe(0);
    });

    it('is not applied after the page was left', () => {
      setup([seg(1, 0, 1, 'hello')]);
      fixture.detectChanges();
      view.onSearchInput('hello');
      fixture.destroy();
      vi.advanceTimersByTime(1000);
      expect(view.query()).toBe('');
    });

    it('is wired to the input: typing waits, then marks the hits; the counter shows the match number', () => {
      setup([seg(1, 0, 1, 'red apple'), seg(2, 1, 2, 'green pear'), seg(3, 2, 3, 'apple pie')]);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
      input.value = 'apple';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('mark').length).toBe(0);
      vi.advanceTimersByTime(140);
      fixture.detectChanges();
      expect(Array.from(fixture.nativeElement.querySelectorAll('mark')).map((m) => (m as HTMLElement).textContent)).toEqual(['apple', 'apple']);
      expect((fixture.nativeElement.querySelector('.count') as HTMLElement).textContent).toBe('1 of 2');
      expect(fixture.nativeElement.querySelector('[aria-label="Next match"]')).not.toBeNull();
      expect(fixture.nativeElement.querySelector('[aria-label="Previous match"]')).not.toBeNull();
    });

    it('says "No matches" when nothing matches, and then offers no arrows and no Replace', () => {
      setup([seg(1, 0, 1, 'hello')]);
      view.query.set('zzz');
      fixture.detectChanges();
      expect((fixture.nativeElement.querySelector('.count') as HTMLElement).textContent).toBe('No matches');
      expect(fixture.nativeElement.querySelector('[aria-label="Next match"]')).toBeNull();
      expect(fixture.nativeElement.querySelector('[aria-label="Previous match"]')).toBeNull();
      expect(fixture.nativeElement.querySelectorAll('.search button').length).toBe(0);
    });

    it('without a search only the box and the switch are there (no count, arrows or Replace)', () => {
      setup([seg(1, 0, 1, 'hello')]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.count')).toBeNull();
      expect(fixture.nativeElement.querySelectorAll('.search button').length).toBe(0);
      expect(fixture.nativeElement.querySelector('.switch')).not.toBeNull();
    });

    it('Escape in the search box empties it and removes the highlighting', () => {
      setup([seg(1, 0, 1, 'red apple')]);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
      input.value = 'apple';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('mark').length).toBe(1);
      view.showReplace.set(true);
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();
      expect(input.value).toBe('');
      expect(view.query()).toBe('');
      expect(view.showReplace()).toBe(false);
      expect(fixture.nativeElement.querySelectorAll('mark').length).toBe(0);
    });

    it('the arrows step through the matches and the current one is marked', () => {
      setup([seg(1, 0, 1, 'x'), seg(2, 1, 2, 'x'), seg(3, 2, 3, 'x')]);
      view.query.set('x');
      fixture.detectChanges();
      const rows = () => Array.from(fixture.nativeElement.querySelectorAll('.seg')) as HTMLElement[];
      expect(rows().map((r) => r.classList.contains('match'))).toEqual([true, false, false]);
      (fixture.nativeElement.querySelector('[aria-label="Next match"]') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(rows().map((r) => r.classList.contains('match'))).toEqual([false, true, false]);
      (fixture.nativeElement.querySelector('[aria-label="Previous match"]') as HTMLButtonElement).click();
      (fixture.nativeElement.querySelector('[aria-label="Previous match"]') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(rows().map((r) => r.classList.contains('match'))).toEqual([false, false, true]);
    });

    it('Replace… opens the replace row, and replacing asks first then sends the edits', () => {
      setup([seg(1, 0, 1, 'color one'), seg(2, 1, 2, 'colour two')]);
      view.query.set('color');
      fixture.detectChanges();
      const toggle = Array.from(fixture.nativeElement.querySelectorAll('.search button')).find((b) => (b as HTMLElement).textContent!.includes('Replace…')) as HTMLButtonElement;
      expect(fixture.nativeElement.querySelector('.replace')).toBeNull();
      toggle.click();
      fixture.detectChanges();
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(fixture.nativeElement.querySelector('.replace')).not.toBeNull();
      view.replacement.set('colour');
      fixture.detectChanges();
      const go = fixture.nativeElement.querySelector('.replace button.primary') as HTMLButtonElement;
      expect(go.textContent).toContain('Replace in 1 line');
      go.click();
      expect(vi.mocked(confirm).mock.calls[0][0]).toBe('Replace "color" with "colour" in 1 line?');
      expect(saved).toEqual([[{ id: 1, text: 'colour one' }]]);
      // done: the search, the replacement and the replace row are cleared
      fixture.detectChanges();
      expect(view.query()).toBe('');
      expect(view.replacement()).toBe('');
      expect(fixture.nativeElement.querySelector('.replace')).toBeNull();
    });

    it('counts lines in the plural in the button and the question', () => {
      setup([seg(1, 0, 1, 'a x'), seg(2, 1, 2, 'b x')]);
      view.query.set('x');
      view.replacement.set('y');
      view.showReplace.set(true);
      fixture.detectChanges();
      expect((fixture.nativeElement.querySelector('.replace button.primary') as HTMLElement).textContent!.trim()).toBe('Replace in 2 lines');
      view.replaceAll();
      expect(vi.mocked(confirm).mock.calls[0][0]).toBe('Replace "x" with "y" in 2 lines?');
    });
  });

  describe('words: plain text, with spans only where there is something to show', () => {
    const words = [
      makeWord('good', 0, 0.95),
      makeWord(' fine', 0.5, 0.6),
      makeWord(' bad', 1, 0.3),
      makeWord(' fine again', 1.5, 0.74),
      makeWord(' ok', 2, 0.9),
    ];
    const shaky = seg(1, 0, 3, 'good fine bad fine again ok', { words });
    const wordsOf = (id: number) => fixture.nativeElement.querySelector(`[data-id="${id}"] .words`) as HTMLElement;

    it('a row without word data is one text node, no child elements', () => {
      setup([seg(1, 0, 1, 'plain text')]);
      fixture.detectChanges();
      expect(wordsOf(1).children.length).toBe(0);
      expect(wordsOf(1).textContent).toBe('plain text');
      expect(view.rows()[0].rich).toBe(false);
    });

    it('a row whose words are all confident is also plain text', () => {
      setup([seg(1, 0, 1, 'sure of it', { words: [makeWord('sure', 0, 0.99), makeWord(' of', 0.4, 0.8), makeWord(' it', 0.8, 0.75)] })]);
      fixture.detectChanges();
      expect(wordsOf(1).children.length).toBe(0);
      expect(wordsOf(1).textContent).toBe('sure of it');
      expect(view.rows()[0].rich).toBe(false);
    });

    it('only the shaky words become spans: below 0.5 is "low", 0.5 to 0.75 is "mid"; the rest stays text', () => {
      setup([shaky]);
      fixture.detectChanges();
      const spans = Array.from(wordsOf(1).querySelectorAll('span.w')) as HTMLElement[];
      expect(spans.map((s) => [s.textContent, s.classList.contains('low') ? 'low' : s.classList.contains('mid') ? 'mid' : ''])).toEqual([
        [' fine', 'mid'],
        [' bad', 'low'],
        [' fine again', 'mid'],
      ]);
      expect(wordsOf(1).textContent).toBe('good fine bad fine again ok'); // nothing lost or added
      expect(view.rows()[0].rich).toBe(true);
    });

    it('each shaky span knows where its word starts, so a click can play from there', () => {
      setup([shaky]);
      fixture.detectChanges();
      const spans = Array.from(wordsOf(1).querySelectorAll('span.w')) as HTMLElement[];
      expect(spans.map((s) => s.dataset['t'])).toEqual(['0.5', '1', '1.5']);
    });

    it('confident words around a shaky one are merged into plain text, not one span each', () => {
      setup([shaky]);
      expect(view.rows()[0].parts.map((p) => [p.text, p.level ?? null])).toEqual([
        ['good', null],
        [' fine', 'mid'],
        [' bad', 'low'],
        [' fine again', 'mid'],
        [' ok', null],
      ]);
    });

    it('with "Highlight uncertain words" off, the row is plain text again', () => {
      setup([shaky]);
      fixture.detectChanges();
      const toggle = fixture.nativeElement.querySelector('.switch input') as HTMLInputElement;
      expect(toggle.checked).toBe(true);
      expect(fixture.nativeElement.querySelector('.onoff').textContent).toBe('On');
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(view.uncertain()).toBe(false);
      expect(wordsOf(1).querySelectorAll('span.w').length).toBe(0);
      expect(wordsOf(1).textContent).toBe('good fine bad fine again ok');
      expect(fixture.nativeElement.querySelector('.onoff').textContent).toBe('Off');
    });

    it('search hits are <mark>, and only hits; the other words of the row stay text', () => {
      setup([seg(1, 0, 1, 'the cat and the hat'), seg(2, 1, 2, 'nothing here')]);
      view.query.set('the');
      fixture.detectChanges();
      expect(Array.from(wordsOf(1).children).map((c) => [c.tagName, c.textContent])).toEqual([
        ['MARK', 'the'],
        ['MARK', 'the'],
      ]);
      expect(wordsOf(1).textContent).toBe('the cat and the hat');
      expect(wordsOf(2).children.length).toBe(0); // a row without a hit stays one text node
    });

    it('a search takes over from the uncertain-word marks (a row with a hit shows hits, not shaky words)', () => {
      setup([shaky]);
      view.query.set('bad');
      fixture.detectChanges();
      expect(wordsOf(1).querySelectorAll('mark').length).toBe(1);
      expect(wordsOf(1).querySelectorAll('span.w').length).toBe(0);
      view.query.set('');
      fixture.detectChanges();
      expect(wordsOf(1).querySelectorAll('mark').length).toBe(0);
      expect(wordsOf(1).querySelectorAll('span.w').length).toBe(3);
    });

    it('a row is rebuilt only when the search or the switch changes (the same row object otherwise)', () => {
      const s1 = seg(1, 0, 1, 'one');
      setup([s1]);
      const a = view.rows()[0];
      expect(view.rows()[0]).toBe(a);
      view.query.set('on');
      const b = view.rows()[0];
      expect(b).not.toBe(a);
      view.query.set('');
      expect(view.rows()[0]).not.toBe(b);
    });

    it('flags a line with low confidence with a warning mark, and an edited line with a pencil mark', () => {
      setup([seg(1, 0, 1, 'unsure', { confidence: 0.4 }), seg(2, 1, 2, 'edited', { edited: true }), seg(3, 2, 3, 'fine')]);
      fixture.detectChanges();
      const flags = (id: number) => Array.from(fixture.nativeElement.querySelectorAll(`[data-id="${id}"] .flag`)).map((f) => (f as HTMLElement).textContent);
      expect(flags(1)).toEqual(['⚠']);
      expect(flags(2)).toEqual(['✎']);
      expect(flags(3)).toEqual([]);
    });

    it('a line whose unsure words are already underlined gets no extra warning mark, and none at all with the switch off', () => {
      const shakyLow = seg(1, 0, 3, 'good bad', { words: [makeWord('good', 0, 0.95), makeWord(' bad', 1, 0.3)], confidence: 0.4 });
      setup([shakyLow, seg(2, 3, 4, 'no words', { confidence: 0.4 })]);
      fixture.detectChanges();
      const flags = (id: number) => fixture.nativeElement.querySelectorAll(`[data-id="${id}"] .flag`).length;
      expect(flags(1)).toBe(0); // the underline already says it
      expect(flags(2)).toBe(1);
      view.uncertain.set(false);
      fixture.detectChanges();
      expect(flags(1)).toBe(0);
      expect(flags(2)).toBe(0);
      expect(view.rows().map((r) => r.uncertain)).toEqual([true, true]); // still known, just not marked
    });

    it('is checked on change only when needed: the component is OnPush', () => {
      const def = (TranscriptView as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(def.onPush).toBe(true);
    });
  });

  describe('editing and deleting a row in the page', () => {
    const rowOf = (id: number) => fixture.nativeElement.querySelector(`[data-id="${id}"]`) as HTMLElement;
    const segs = () => [seg(1, 0, 1, 'first line'), seg(2, 1, 2, 'second line')];

    it('the pencil opens an editor with the text; Escape cancels', async () => {
      setup(segs());
      fixture.detectChanges();
      (rowOf(2).querySelector('button.pencil') as HTMLButtonElement).click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(view.editingId()).toBe(2);
      const ta = rowOf(2).querySelector('textarea.edit') as HTMLTextAreaElement;
      expect(ta).not.toBeNull();
      expect(ta.value).toBe('second line');
      expect(rowOf(2).classList.contains('editing')).toBe(true);
      expect(rowOf(1).querySelector('textarea')).toBeNull(); // only one editor
      ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();
      expect(view.editingId()).toBeNull();
      expect(rowOf(2).querySelector('textarea')).toBeNull();
      expect(saved).toEqual([]);
    });

    it('focuses the editor with the cursor at the end', () => {
      setup(segs());
      fixture.detectChanges();
      (rowOf(1).querySelector('button.pencil') as HTMLButtonElement).click();
      fixture.detectChanges();
      vi.advanceTimersByTime(1);
      const ta = rowOf(1).querySelector('textarea.edit') as HTMLTextAreaElement;
      expect(document.activeElement).toBe(ta);
    });

    it('typing and Enter saves the new text of that line only', async () => {
      setup(segs());
      fixture.detectChanges();
      (rowOf(1).querySelector('button.pencil') as HTMLButtonElement).click();
      fixture.detectChanges();
      await fixture.whenStable();
      const ta = rowOf(1).querySelector('textarea.edit') as HTMLTextAreaElement;
      ta.value = '  First line, corrected ';
      ta.dispatchEvent(new Event('input'));
      ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true }));
      fixture.detectChanges();
      expect(saved).toEqual([[{ id: 1, text: 'First line, corrected' }]]);
      expect(view.editingId()).toBeNull();
    });

    it('leaving the editor (blur) saves too, once', async () => {
      setup(segs());
      fixture.detectChanges();
      (rowOf(1).querySelector('button.pencil') as HTMLButtonElement).click();
      fixture.detectChanges();
      await fixture.whenStable();
      const ta = rowOf(1).querySelector('textarea.edit') as HTMLTextAreaElement;
      ta.value = 'changed';
      ta.dispatchEvent(new Event('input'));
      ta.dispatchEvent(new Event('blur'));
      ta.dispatchEvent(new Event('blur'));
      expect(saved).toEqual([[{ id: 1, text: 'changed' }]]);
    });

    it('"Delete line" asks once, then removes the line (the editor does not save first)', async () => {
      setup(segs());
      fixture.detectChanges();
      (rowOf(2).querySelector('button.pencil') as HTMLButtonElement).click();
      fixture.detectChanges();
      await fixture.whenStable();
      const del = rowOf(2).querySelector('.edit-actions button.danger') as HTMLButtonElement;
      expect(del.textContent).toContain('Delete line');
      const down = new MouseEvent('mousedown', { cancelable: true, bubbles: true });
      del.dispatchEvent(down);
      expect(down.defaultPrevented).toBe(true); // so the blur of the editor does not run first
      del.click();
      expect(confirm).toHaveBeenCalledTimes(1);
      expect(vi.mocked(confirm).mock.calls[0][0]).toBe('Delete this line from the transcript?');
      expect(saved).toEqual([[{ id: 2, text: 'second line', deleted: true }]]);
      expect(view.editingId()).toBeNull();
    });

    it('"Delete line" answered "no" keeps the line and the editor', () => {
      vi.stubGlobal('confirm', vi.fn(() => false));
      setup(segs());
      view.edit(segs()[1]);
      view.remove(segs()[1]);
      expect(saved).toEqual([]);
      expect(view.editingId()).toBe(2);
    });

    it('the editor has Save and Cancel buttons on every screen (Enter and Escape are not the only ways)', async () => {
      setup(segs());
      fixture.detectChanges();
      (rowOf(1).querySelector('button.pencil') as HTMLButtonElement).click();
      fixture.detectChanges();
      await fixture.whenStable();
      const buttons = Array.from(rowOf(1).querySelectorAll('.edit-actions button')).map((b) => b.textContent!.trim());
      expect(buttons).toEqual(['Save', 'Cancel', 'Delete line']);
      view.draft = 'First, saved by the button';
      (rowOf(1).querySelector('.edit-actions button.primary') as HTMLButtonElement).click();
      expect(saved).toEqual([[{ id: 1, text: 'First, saved by the button' }]]);
    });

    it('the pencil has an accessible name', () => {
      setup(segs());
      fixture.detectChanges();
      expect(rowOf(1).querySelector('button.pencil')!.getAttribute('aria-label')).toBe('Edit this line');
    });

    it('pendingEdit: the open editor with a real change (the page saves it when it is left), nothing otherwise', () => {
      setup(segs());
      expect(view.pendingEdit()).toBeNull();
      view.edit(segs()[0]);
      expect(view.pendingEdit()).toBeNull(); // opened, nothing typed
      view.draft = '   ';
      expect(view.pendingEdit()).toBeNull(); // empty is never saved
      view.draft = ' first line, better ';
      expect(view.pendingEdit()).toEqual({ id: 1, text: 'first line, better' });
      view.cancel();
      expect(view.pendingEdit()).toBeNull();
    });

    it('reopen: a line whose save failed opens again with what was typed', () => {
      setup(segs());
      fixture.detectChanges();
      view.reopen(2, 'second line, fixed');
      fixture.detectChanges();
      expect(view.editingId()).toBe(2);
      expect(view.draft).toBe('second line, fixed');
      view.reopen(99, 'gone'); // a line that is no longer there: nothing happens
      expect(view.editingId()).toBe(2);
    });

    it('edit works for a row that was loaded later (beyond the first 400)', async () => {
      setup(makeSegments(500));
      fixture.detectChanges();
      view.query.set('line 450');
      view.step(1);
      await Promise.resolve();
      fixture.detectChanges();
      (rowOf(450).querySelector('button.pencil') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(view.editingId()).toBe(450);
      view.draft = 'edited late line';
      view.commit(view.segments().find((s) => s.id === 450)!);
      expect(saved).toEqual([[{ id: 450, text: 'edited late line' }]]);
    });

    it('while a line is being edited the playhead does not scroll away from it', () => {
      const spy = vi.fn();
      Element.prototype.scrollIntoView = spy;
      setup(segs(), { hasMedia: true });
      fixture.detectChanges();
      view.editingId.set(1);
      fixture.componentRef.setInput('activeSegment', 2);
      fixture.detectChanges();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('clicks on the list (one listener for all rows)', () => {
    const rowOf = (id: number) => fixture.nativeElement.querySelector(`[data-id="${id}"]`) as HTMLElement;
    const shaky = seg(2, 5, 8, 'hello shaky world', {
      words: [makeWord('hello', 5, 0.95), makeWord(' shaky', 6, 0.3), makeWord(' world', 7, 0.95)],
    });

    it('the timestamp plays from the start of the line when there is media', () => {
      setup([seg(1, 3, 4, 'a'), shaky], { hasMedia: true });
      fixture.detectChanges();
      (rowOf(2).querySelector('button.ts') as HTMLButtonElement).click();
      expect(sought).toEqual([5]);
    });

    it('the timestamp shows the time and is disabled without media', () => {
      setup([seg(1, 65, 70, 'a')]);
      fixture.detectChanges();
      const ts = rowOf(1).querySelector('button.ts') as HTMLButtonElement;
      expect(ts.textContent).toBe('01:05');
      expect(ts.disabled).toBe(true);
      expect(ts.getAttribute('title')).toBe('');
      expect(sought).toEqual([]);
    });

    it('clicking a shaky word plays from that word', () => {
      setup([shaky], { hasMedia: true });
      fixture.detectChanges();
      (rowOf(2).querySelector('span.w') as HTMLElement).click();
      expect(sought).toEqual([6]);
    });

    it('clicking elsewhere in a row with word timings plays from the start of the line', () => {
      setup([shaky], { hasMedia: true });
      fixture.detectChanges();
      (rowOf(2).querySelector('.words') as HTMLElement).click();
      expect(sought).toEqual([5]);
    });

    it('a row without word timings does not seek when its text is clicked', () => {
      setup([seg(1, 3, 4, 'plain')], { hasMedia: true });
      fixture.detectChanges();
      (rowOf(1).querySelector('.words') as HTMLElement).click();
      expect(sought).toEqual([]);
    });

    it('nothing seeks without media', () => {
      setup([shaky]);
      fixture.detectChanges();
      (rowOf(2).querySelector('span.w') as HTMLElement).click();
      (rowOf(2).querySelector('.words') as HTMLElement).click();
      expect(sought).toEqual([]);
    });

    it('clicking inside the editor does not seek', async () => {
      setup([shaky], { hasMedia: true });
      fixture.detectChanges();
      (rowOf(2).querySelector('button.pencil') as HTMLButtonElement).click();
      fixture.detectChanges();
      await fixture.whenStable();
      (rowOf(2).querySelector('textarea') as HTMLElement).click();
      expect(sought).toEqual([]);
    });

    it('selecting text with the mouse is not a click to seek', () => {
      setup([shaky], { hasMedia: true });
      fixture.detectChanges();
      const words = rowOf(2).querySelector('.words') as HTMLElement;
      const range = document.createRange();
      range.selectNodeContents(words);
      getSelection()!.removeAllRanges();
      getSelection()!.addRange(range);
      words.click();
      getSelection()!.removeAllRanges();
      expect(sought).toEqual([]);
    });
  });

  describe('follow playback and empty states', () => {
    const bar = () => fixture.nativeElement.querySelector('.follow-bar') as HTMLElement | null;

    it('the "Follow playback" switch is offered only while media plays on a finished transcript', () => {
      setup([seg(1, 0, 1, 'a')], { hasMedia: true, playing: false });
      fixture.detectChanges();
      expect(bar()).toBeNull();
      fixture.componentRef.setInput('playing', true);
      fixture.detectChanges();
      expect(bar()).not.toBeNull();
      fixture.componentRef.setInput('live', true);
      fixture.detectChanges();
      expect(bar()).toBeNull();
    });

    it('is not offered when there is no media', () => {
      setup([seg(1, 0, 1, 'a')], { hasMedia: false, playing: true });
      fixture.detectChanges();
      expect(bar()).toBeNull();
    });

    it('toggles, and says its state in words and in aria-pressed', () => {
      setup([seg(1, 0, 1, 'a')], { hasMedia: true, playing: true });
      fixture.detectChanges();
      const btn = () => bar()!.querySelector('button') as HTMLButtonElement;
      expect(btn().textContent!.trim()).toBe('Following playback');
      expect(btn().getAttribute('aria-pressed')).toBe('true');
      btn().click();
      fixture.detectChanges();
      expect(view.autoScroll()).toBe(false);
      expect(btn().textContent!.trim()).toBe('Follow playback');
      expect(btn().getAttribute('aria-pressed')).toBe('false');
    });

    it('scrolls the playing line into view when it moves out of sight', () => {
      const spy = vi.fn();
      Element.prototype.scrollIntoView = spy;
      setup([seg(1, 0, 1, 'a'), seg(2, 1, 2, 'b')], { hasMedia: true, playing: true, activeSegment: 1 });
      fixture.detectChanges();
      spy.mockClear();
      fixture.componentRef.setInput('activeSegment', 2);
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect((spy.mock.contexts[0] as HTMLElement).dataset['id']).toBe('2');
    });

    it('a finished transcript without speech says so', () => {
      setup([]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.empty').textContent).toContain('No speech was found in this file.');
      expect(fixture.nativeElement.querySelector('.empty-hint').textContent).toBe('If it does have speech, try More › Re-transcribe with the right language.');
      // nothing to search or underline: no toolbar
      expect(fixture.nativeElement.querySelector('.toolbar')).toBeNull();
    });

    it('waiting for the first words of a live transcript shows only that (no "Live" note over an empty list)', () => {
      setup([], { live: true });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.toolbar')).toBeNull();
      expect(fixture.nativeElement.querySelector('.empty').textContent).toBe('Waiting for the first words…');
      fixture.componentRef.setInput('segments', makeSegments(1));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.live-note')).not.toBeNull();
    });
  });
});
