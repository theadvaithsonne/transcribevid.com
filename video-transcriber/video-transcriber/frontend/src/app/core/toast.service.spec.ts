import { TestBed } from '@angular/core/testing';
import { IS_BROWSER } from './platform';
import { TOAST_DURATION, TOAST_MAX, ToastService } from './toast.service';

describe('ToastService', () => {
  let toast: ToastService;
  const setup = (browser = true) => {
    TestBed.configureTestingModule({ providers: [{ provide: IS_BROWSER, useValue: browser }] });
    toast = TestBed.inject(ToastService);
  };

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('shows each kind with a default title, and the given title when there is one', () => {
    setup();
    toast.success('Saved.');
    toast.error('Could not save.');
    toast.warning('Slow connection.', 'Heads up');
    expect(toast.toasts().map((t) => [t.kind, t.title, t.message])).toEqual([
      ['success', 'Done', 'Saved.'],
      ['error', 'Something went wrong', 'Could not save.'],
      ['warning', 'Heads up', 'Slow connection.'],
    ]);
  });

  it('hides each kind after its own time (errors stay longest)', () => {
    setup();
    toast.success('a');
    toast.error('b');
    vi.advanceTimersByTime(TOAST_DURATION.success);
    expect(toast.toasts().map((t) => t.message)).toEqual(['b']);
    vi.advanceTimersByTime(TOAST_DURATION.error - TOAST_DURATION.success);
    expect(toast.toasts()).toEqual([]);
    expect(TOAST_DURATION.error).toBeGreaterThan(TOAST_DURATION.success);
  });

  it('duration 0 keeps a toast until it is closed', () => {
    setup();
    const id = toast.info('stays', undefined, { duration: 0 });
    vi.advanceTimersByTime(60_000);
    expect(toast.toasts().length).toBe(1);
    toast.dismiss(id);
    expect(toast.toasts()).toEqual([]);
  });

  it('does not stack the same message twice: the visible one gets its full time again', () => {
    setup();
    const first = toast.error('Server busy');
    vi.advanceTimersByTime(TOAST_DURATION.error - 1000);
    const again = toast.error('Server busy');
    expect(again).toBe(first);
    expect(toast.toasts().length).toBe(1);
    vi.advanceTimersByTime(TOAST_DURATION.error - 1);
    expect(toast.toasts().length).toBe(1);
    vi.advanceTimersByTime(1);
    expect(toast.toasts()).toEqual([]);
  });

  it(`keeps at most ${TOAST_MAX}: a new one pushes the oldest out (and its timer is cleared)`, () => {
    setup();
    for (let i = 1; i <= TOAST_MAX + 2; i++) toast.info(`m${i}`);
    expect(toast.toasts().map((t) => t.message)).toEqual(['m3', 'm4', 'm5']);
    vi.advanceTimersByTime(TOAST_DURATION.info);
    expect(toast.toasts()).toEqual([]);
  });

  it('pauses while hovered or focused and resumes with the time that was left (at least 2 s)', () => {
    setup();
    const id = toast.success('read me');
    vi.advanceTimersByTime(TOAST_DURATION.success - 500);
    toast.pause(id);
    vi.advanceTimersByTime(60_000);
    expect(toast.toasts().length).toBe(1);
    toast.resume(id);
    vi.advanceTimersByTime(1999);
    expect(toast.toasts().length).toBe(1);
    vi.advanceTimersByTime(1);
    expect(toast.toasts()).toEqual([]);
  });

  it('pause and resume of a toast that is gone do nothing', () => {
    setup();
    const id = toast.info('x');
    toast.dismiss(id);
    expect(() => {
      toast.pause(id);
      toast.resume(id);
    }).not.toThrow();
    expect(toast.toasts()).toEqual([]);
  });

  it('clear() removes everything and leaves no timer behind', () => {
    setup();
    toast.info('a');
    toast.error('b');
    toast.clear();
    expect(toast.toasts()).toEqual([]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('trims the text', () => {
    setup();
    toast.error('  spaced  ', '  Title  ');
    expect(toast.toasts()[0]).toMatchObject({ title: 'Title', message: 'spaced' });
  });

  it('while a page is prerendered nothing is shown and no timer starts', () => {
    setup(false);
    expect(toast.error('x')).toBe(0);
    expect(toast.toasts()).toEqual([]);
    expect(vi.getTimerCount()).toBe(0);
  });
});
