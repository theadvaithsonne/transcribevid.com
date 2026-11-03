import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { LiveCount } from './core/live-count';
import { IS_BROWSER } from './core/platform';
import { COUNTER_URL } from './core/stats.service';
import { silentLog } from './testing/fakes';

@Component({ template: '<p>page</p>' })
class Blank {}

describe('App shell: the "online now" pill', () => {
  let fixture: ComponentFixture<App>;
  let live: LiveCount;

  async function setup(opts: { counterUrl?: string; browser?: boolean } = {}) {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    TestBed.configureTestingModule({
      providers: [
        silentLog,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '', component: Blank }]),
        { provide: COUNTER_URL, useValue: opts.counterUrl ?? '' },
        { provide: IS_BROWSER, useValue: opts.browser ?? true },
      ],
    });
    live = TestBed.inject(LiveCount);
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/');
    render();
  }
  function render() {
    fixture.detectChanges();
    TestBed.tick();
  }
  const pill = () => fixture.nativeElement.querySelector('.topbar .live') as HTMLElement | null;
  const set = (v: number | null | undefined) => {
    live.active.set(v);
    render();
  };
  /** the number and the label are separate elements (spaced by CSS), so they are joined with a space here */
  const text = (e: HTMLElement | null) =>
    Array.from(e?.querySelectorAll('.cnum, .clabel') ?? [])
      .map((x) => (x.textContent ?? '').trim())
      .join(' ');

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('has no pill when nothing is configured (the local edition, a failed read, the prerender)', async () => {
    await setup();
    expect(live.active()).toBeUndefined();
    expect(pill()).toBeNull();
  });

  it('shows "…" with a grey loading dot while the first answer is awaited', async () => {
    await setup();
    set(null);
    expect(pill()).not.toBeNull();
    expect(pill()!.classList).toContain('loading');
    expect(text(pill())).toBe('… online now');
    expect(pill()!.getAttribute('aria-label')).toBe('… online now');
    expect(pill()!.querySelector('.ldot')).not.toBeNull();
  });

  it('shows the number, and the tooltip says visitors\' browsers report it', async () => {
    await setup();
    set(12);
    expect(pill()!.classList).not.toContain('loading');
    expect(text(pill())).toBe('12 online now');
    expect(pill()!.getAttribute('aria-label')).toBe('12 online now');
    expect(pill()!.getAttribute('title')).toBe("12 online now, as reported by visitors' browsers");
  });

  it('shows 0 as 0 and groups thousands like the videos counter', async () => {
    await setup();
    set(0);
    expect(text(pill())).toBe('0 online now');
    set(1234);
    expect(text(pill())).toBe(new Intl.NumberFormat().format(1234) + ' online now');
  });

  it('goes away again when the Worker cannot be read', async () => {
    await setup();
    set(5);
    expect(pill()).not.toBeNull();
    set(undefined);
    expect(pill()).toBeNull();
  });

  it('on the public website the pill is there from the first render, as "…", and nothing is requested before that', async () => {
    await setup({ counterUrl: 'https://transcribevid.com/api' });
    expect(live.active()).toBeNull();
    expect(pill()!.classList).toContain('loading');
    expect(text(pill())).toBe('… online now');
  });

  it('while prerendering (no browser) there is no pill and no loading state', async () => {
    await setup({ counterUrl: 'https://transcribevid.com/api', browser: false });
    expect(live.active()).toBeUndefined();
    expect(pill()).toBeNull();
  });
});
