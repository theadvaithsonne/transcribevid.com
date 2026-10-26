import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AdSenseConfig } from '../core/ads.config';
import { ADSENSE_SRC, ADS_CONFIG, ADS_EDITION, AdsService } from '../core/ads.service';
import { JobsStore } from '../core/jobs.store';
import { IS_BROWSER } from '../core/platform';
import { makeSummary, silentLog } from '../testing/fakes';
import { AdPlacement, AdSlot, HOUSE_NOTE, adSizeFor } from './ad-slot';

@Component({ template: '' })
class Blank {}

@Component({
  imports: [AdSlot],
  template: `@if (show()) {
    <app-ad-slot [placement]="placement()" [upTo]="upTo()" />
  }`,
})
class Host {
  show = signal(true);
  placement = signal<AdPlacement>('inline');
  upTo = signal(1100);
}

const CONFIGURED: AdSenseConfig = {
  client: 'ca-pub-1234567890123456',
  slots: { rail160: '1111111111', rail300: '2222222222', inline300: '3333333333' },
};
const INERT: AdSenseConfig = { ...CONFIGURED, slots: { rail160: '', rail300: '', inline300: '' } };

describe('adSizeFor (one size per placement and viewport, section 7 of adsense.md)', () => {
  it.each([
    [1099, null],
    [1100, '160x600'],
    [1366, '160x600'],
    [1679, '160x600'],
    [1680, '300x600'],
    [1920, '300x600'],
    [2560, '300x600'],
  ])('rail at %i px: %s', (w, expected) => {
    const s = adSizeFor('rail', w);
    expect(s ? `${s.width}x${s.height}` : null).toBe(expected);
  });

  it.each([
    [320, null],
    [331, null],
    [332, '300x250'],
    [390, '300x250'],
    [600, '300x250'],
    [800, '300x250'],
    [1099, '300x250'],
    [1100, null],
    [1920, null],
  ])('inline at %i px: %s', (w, expected) => {
    const s = adSizeFor('inline', w);
    expect(s ? `${s.width}x${s.height}` : null).toBe(expected);
  });

  it('inline up to 1000 px on pages that fit the window from there (home, transcript)', () => {
    expect(adSizeFor('inline', 999, 1000)).not.toBeNull();
    expect(adSizeFor('inline', 1000, 1000)).toBeNull();
  });

  it('each size is served by its own ad unit', () => {
    expect(adSizeFor('rail', 1200)!.slot).toBe('rail160');
    expect(adSizeFor('rail', 1800)!.slot).toBe('rail300');
    expect(adSizeFor('inline', 500)!.slot).toBe('inline300');
  });
});

describe('AdSlot', () => {
  let fixture: ComponentFixture<Host>;
  let store: JobsStore;
  let width: number;

  async function setup(opts: { config?: AdSenseConfig; edition?: boolean; browser?: boolean; url?: string; viewport?: number; boxWidth?: number } = {}) {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: opts.viewport ?? 800 });
    width = opts.boxWidth ?? 300;
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(() => width);
    TestBed.configureTestingModule({
      providers: [
        silentLog,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'info', component: Blank, data: { ads: true } },
          { path: 'plain', component: Blank },
          { path: 'jobs/:id', component: Blank, data: { ads: 'job-done' } },
        ]),
        { provide: ADS_EDITION, useValue: opts.edition ?? true },
        { provide: ADS_CONFIG, useValue: opts.config ?? CONFIGURED },
        { provide: IS_BROWSER, useValue: opts.browser ?? true },
      ],
    });
    store = TestBed.inject(JobsStore);
    TestBed.inject(AdsService);
    await TestBed.inject(Router).navigateByUrl(opts.url ?? '/info');
    fixture = TestBed.createComponent(Host);
    render();
  }
  /** change detection plus the render hooks and effects (afterNextRender, effect) */
  function render() {
    fixture.detectChanges();
    TestBed.tick();
  }
  const host = () => fixture.nativeElement.querySelector('app-ad-slot') as HTMLElement | null;
  const ins = () => Array.from(fixture.nativeElement.querySelectorAll('ins.adsbygoogle')) as HTMLElement[];
  const note = () => fixture.nativeElement.querySelector('.ad-note')?.textContent?.trim() ?? null;
  const label = () => fixture.nativeElement.querySelector('.ad-label') as HTMLElement;
  const queue = () => (window as { adsbygoogle?: unknown[] }).adsbygoogle ?? [];
  const scripts = () => Array.from(document.querySelectorAll(`script[src^="${ADSENSE_SRC}"]`));

  afterEach(() => {
    for (const s of scripts()) s.remove();
    delete (window as { adsbygoogle?: unknown }).adsbygoogle;
    vi.restoreAllMocks();
  });

  describe('inert (no slot ids yet) or no ads in this edition', () => {
    it('inert: the reserved box with the house note, no ins, no script, no label', async () => {
      await setup({ config: INERT });
      expect(host()!.classList).not.toContain('off');
      expect(host()!.getAttribute('aria-label')).toBe('Advertisement');
      expect(note()).toBe(HOUSE_NOTE);
      expect(ins()).toEqual([]);
      expect(scripts()).toEqual([]);
      expect(queue()).toEqual([]);
      expect(label().classList).not.toContain('on');
    });

    it('an edition without ads: nothing at all (hidden, no note for screen readers)', async () => {
      await setup({ edition: false });
      expect(host()!.classList).toContain('off');
      expect(host()!.getAttribute('aria-hidden')).toBe('true');
      expect(host()!.getAttribute('role')).toBeNull();
      expect(ins()).toEqual([]);
      expect(scripts()).toEqual([]);
    });

    it('not an ad page: hidden', async () => {
      await setup({ url: '/plain' });
      expect(host()!.classList).toContain('off');
      expect(ins()).toEqual([]);
    });

    it('prerendering: the reserved box only, never an ins or a script', async () => {
      await setup({ browser: false });
      expect(note()).toBe(HOUSE_NOTE);
      expect(ins()).toEqual([]);
      expect(scripts()).toEqual([]);
    });
  });

  describe('configured, on an ad page', () => {
    it('creates one ins of the right size and pushes exactly once; the loader is added once', async () => {
      await setup();
      expect(ins().length).toBe(1);
      const el = ins()[0];
      expect(el.style.width).toBe('300px');
      expect(el.style.height).toBe('250px');
      expect(el.getAttribute('data-ad-client')).toBe('ca-pub-1234567890123456');
      expect(el.getAttribute('data-ad-slot')).toBe('3333333333');
      expect(el.getAttribute('data-tag-for-age-treatment')).toBe('0');
      expect(queue().length).toBe(1);
      expect(scripts().length).toBe(1);
      render();
      render();
      expect(ins().length).toBe(1);
      expect(queue().length).toBe(1);
    });

    it('never pushes into a box without width (hidden by CSS at this size, print, "use less data")', async () => {
      await setup({ boxWidth: 0 });
      expect(ins()).toEqual([]);
      expect(queue()).toEqual([]);
      expect(note()).toBe(HOUSE_NOTE);
    });

    it('requests nothing when the viewport has no size for the placement', async () => {
      await setup({ viewport: 1366 }); // inline above 1100 px: the rail takes over
      expect(ins()).toEqual([]);
    });

    it('no push while a transcription runs; the reserved box keeps the house note; it pushes once it is done', async () => {
      await setup({ config: CONFIGURED });
      fixture.componentInstance.show.set(false);
      render();
      store.jobs.set([makeSummary({ id: 'a', status: 'running' })]);
      fixture.componentInstance.show.set(true);
      render();
      expect(ins()).toEqual([]);
      expect(note()).toBe(HOUSE_NOTE);
      store.jobs.set([makeSummary({ id: 'a', status: 'done' })]);
      render();
      expect(ins().length).toBe(1);
    });

    it('removes its own ins on destroy, and a new instance (a new page view) gets a new one', async () => {
      await setup();
      const first = ins()[0];
      const stranger = document.createElement('ins');
      stranger.className = 'adsbygoogle';
      document.body.appendChild(stranger);
      fixture.componentInstance.show.set(false);
      render();
      expect(first.isConnected).toBe(false);
      expect(stranger.isConnected).toBe(true); // never touches other ins elements
      stranger.remove();
      fixture.componentInstance.show.set(true);
      render();
      expect(ins().length).toBe(1);
      expect(ins()[0]).not.toBe(first);
      expect(queue().length).toBe(2);
      expect(scripts().length).toBe(1);
    });

    it('a push that throws does not break the page: the box shows the house note', async () => {
      (window as { adsbygoogle?: unknown }).adsbygoogle = {
        push: () => {
          throw new Error('No slot size for availableWidth=0');
        },
      };
      await setup();
      expect(host()!.getAttribute('data-ad-state')).toBe('failed');
      expect(note()).toBe(HOUSE_NOTE);
    });

    it('filled: "Advertisement" labels the box and the note goes', async () => {
      await setup();
      expect(note()).toBeNull(); // pending: neither note nor label
      ins()[0].setAttribute('data-ad-status', 'filled');
      await Promise.resolve(); // MutationObserver callback
      render();
      expect(label().classList).toContain('on');
      expect(note()).toBeNull();
    });

    it('unfilled: the box keeps its size and shows the house note instead of a blank space', async () => {
      await setup();
      const el = ins()[0];
      el.setAttribute('data-ad-status', 'unfilled');
      await Promise.resolve();
      render();
      expect(el.style.display).toBe('none');
      expect(note()).toBe(HOUSE_NOTE);
      expect(label().classList).not.toContain('on');
    });

    it('a blocked script shows the house note while the ins waits', async () => {
      await setup();
      scripts()[0].dispatchEvent(new Event('error'));
      await Promise.resolve();
      render();
      expect(note()).toBe(HOUSE_NOTE);
    });

    it('the rail: 160x600 below 1680 px, 300x600 from 1680 px, requested at an idle moment', async () => {
      let idle: (() => void) | null = null;
      vi.stubGlobal('requestIdleCallback', (cb: () => void) => {
        idle = cb;
        return 1;
      });
      vi.stubGlobal('cancelIdleCallback', () => undefined);
      try {
        await setup({ viewport: 1366 }); // the inline unit of the host has no size at 1366 px: nothing requested
        expect(ins()).toEqual([]);
        fixture.componentInstance.placement.set('rail');
        fixture.componentInstance.show.set(false);
        render();
        fixture.componentInstance.show.set(true);
        render();
        expect(ins()).toEqual([]); // waits for the idle callback so the loader does not compete with the page
        idle!();
        render();
        expect(ins().length).toBe(1);
        expect(ins()[0].style.width).toBe('160px');
        expect(ins()[0].style.height).toBe('600px');
        expect(ins()[0].getAttribute('data-ad-slot')).toBe('1111111111');

        Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1920 });
        fixture.componentInstance.show.set(false);
        render();
        fixture.componentInstance.show.set(true);
        render();
        idle!();
        render();
        expect(ins()[0].style.width).toBe('300px');
        expect(ins()[0].getAttribute('data-ad-slot')).toBe('2222222222');
      } finally {
        vi.unstubAllGlobals();
      }
    });

    it('in-flow units wait until the box is near the visible area', async () => {
      const observers: Array<{ cb: IntersectionObserverCallback; disconnected: boolean }> = [];
      class FakeIO {
        o: { cb: IntersectionObserverCallback; disconnected: boolean };
        constructor(cb: IntersectionObserverCallback) {
          this.o = { cb, disconnected: false };
          observers.push(this.o);
        }
        observe() {}
        disconnect() {
          this.o.disconnected = true;
        }
      }
      vi.stubGlobal('IntersectionObserver', FakeIO);
      try {
        await setup();
        expect(ins()).toEqual([]);
        observers[0].cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
        render();
        expect(ins().length).toBe(1);
        expect(observers[0].disconnected).toBe(true);
      } finally {
        vi.unstubAllGlobals();
      }
    });
  });
});
