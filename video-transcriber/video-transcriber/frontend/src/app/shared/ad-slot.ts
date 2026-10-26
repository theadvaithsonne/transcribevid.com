import { DOCUMENT } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { AdSenseConfig } from '../core/ads.config';
import { AdsService } from '../core/ads.service';
import { LogService } from '../core/log.service';
import { IS_BROWSER } from '../core/platform';

/** `rail`: the desktop column on the right (>= 1100 px). `inline`: one in-flow unit on tablet and phone. */
export type AdPlacement = 'rail' | 'inline';

/** The viewport widths where the unit changes (docs/in-browser/spike/adsense.md section 7). */
export const AD_BREAKPOINTS = { rail: 1100, railWide: 1680, inlineMin: 332 } as const;

export interface AdSize {
  width: number;
  height: number;
  /** which AdSense ad unit (core/ads.config.ts) serves this size */
  slot: keyof AdSenseConfig['slots'];
}

/**
 * The one fixed size a placement shows at this viewport width, or null when it shows none (so nothing is requested).
 * Rail: 160x600 from 1100 px, 300x600 from 1680 px (300 + 24 px padding fits a 20% column only from there), none below.
 * Inline: 300x250 from 332 px (300 + 2 x 16 px gutters) up to `upTo` (exclusive; the rail takes over from 1100 px; the
 * home and transcript pages, which fit the window from 1000 px, stop at 1000), none on the very narrowest phones.
 * Decided once per slot instance: a resize never requests a new ad (it is not a refresh the visitor asked for).
 */
export function adSizeFor(placement: AdPlacement, viewportWidth: number, upTo: number = AD_BREAKPOINTS.rail): AdSize | null {
  if (placement === 'rail') {
    if (viewportWidth < AD_BREAKPOINTS.rail) return null;
    return viewportWidth >= AD_BREAKPOINTS.railWide ? { width: 300, height: 600, slot: 'rail300' } : { width: 160, height: 600, slot: 'rail160' };
  }
  if (viewportWidth < AD_BREAKPOINTS.inlineMin || viewportWidth >= Math.min(upTo, AD_BREAKPOINTS.rail)) return null;
  return { width: 300, height: 250, slot: 'inline300' };
}

/** reserved: the empty box (no ad requested); pending: an `ins` was pushed; filled / unfilled: Google's `data-ad-status`; failed: push threw */
export type AdSlotState = 'reserved' | 'pending' | 'filled' | 'unfilled' | 'failed';

/** The neutral line inside an empty box. Not clickable, not dressed as an ad, no pressure to switch an ad blocker off. */
export const HOUSE_NOTE = 'Ads keep TranscribeVid free. Everything works without them.';

/**
 * One manual AdSense unit in a box of fixed size, reserved before anything loads (no layout shift, also in the prerendered
 * HTML). The `ins` is created in the browser only, once per instance, when the box is visible (or, for the rail, when the
 * browser is idle), has a width, the page may show ads (`AdsService.live`: configured ids, an ad page, nothing being
 * transcribed) and the viewport has a size for this placement. It is pushed exactly once and removed again on destroy;
 * a new page view gets a new instance. Until then, or when the unit stays unfilled or the script is blocked, the box shows
 * the house note. "Advertisement" labels the box only while it holds an ad.
 */
@Component({
  selector: 'app-ad-slot',
  template: `
    <span class="ad-label" [class.on]="state() === 'filled'" aria-hidden="true">Advertisement</span>
    <div class="ad-box" [class.has-ins]="state() === 'pending' || state() === 'filled'">
      <div class="ad-ins" #insHost></div>
      @if (noteShown()) {
        <p class="ad-note">{{ note }}</p>
      }
    </div>
  `,
  // (the box is always in the DOM so `insHost` exists; `.off` hides it entirely where this edition or page has no ads)
  styles: `
    :host {
      display: block;
      contain: layout paint;
    }
    /* an edition without ads (local / self-hosted), or not an ad page: nothing at all, not even the house note */
    :host(.off) {
      display: none !important;
    }
    :host(.rail) {
      width: 160px;
      margin-inline: auto;
    }
    @media (min-width: 1680px) {
      :host(.rail) {
        width: 300px;
      }
    }
    /* in-flow: centred, 48 px clear of whatever is above and below (never right next to a button) */
    :host(.inline) {
      display: none;
      width: 300px;
      max-width: 100%;
      margin: 48px auto;
    }
    @media (min-width: 332px) and (max-width: 1099.98px) {
      :host(.inline.upto-1100) {
        display: block;
      }
    }
    @media (min-width: 332px) and (max-width: 999.98px) {
      :host(.inline.upto-1000) {
        display: block;
      }
    }
    .ad-label {
      display: block;
      height: 22px;
      padding-bottom: 6px;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.02em;
      color: var(--muted);
      visibility: hidden;
    }
    .ad-label.on {
      visibility: visible;
    }
    .ad-box {
      position: relative;
      overflow: hidden; /* never wider than the page: no sideways scrolling on a narrow phone */
      min-height: 600px;
      border: 1px solid var(--line);
      border-radius: var(--r-md);
    }
    :host(.inline) .ad-box {
      min-height: 250px;
    }
    /* Google's creatives do not follow the theme: a neutral light card under them in both themes */
    .ad-box.has-ins {
      border-color: transparent;
      background: #f4f4f4;
    }
    .ad-ins {
      display: block;
      width: 100%;
      line-height: 0;
    }
    .ad-note {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 16px;
      text-align: center;
      font-size: var(--fs-sm);
      line-height: 1.5;
      color: var(--muted);
    }
    /* "Use less data": no ad request (the box has no width), the note stays */
    @media (prefers-reduced-data: reduce) {
      .ad-ins {
        display: none;
      }
    }
    /* PDF export and printing: no ad and no empty box on paper */
    @media print {
      :host {
        display: none !important;
      }
    }
  `,
  host: {
    '[class]': 'hostClass()',
    '[attr.role]': "on() && placement() === 'inline' ? 'complementary' : null",
    '[attr.aria-label]': "on() && placement() === 'inline' ? 'Advertisement' : null",
    '[attr.aria-hidden]': "on() ? null : 'true'",
    '[attr.data-ad-state]': 'state()',
  },
})
export class AdSlot {
  readonly placement = input<AdPlacement>('inline');
  /** inline only: the first viewport width (px) without this unit. 1000 on pages that fit the window from 1000 px. */
  readonly upTo = input<number>(AD_BREAKPOINTS.rail);

  private ads = inject(AdsService);
  private log = inject(LogService);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private doc = inject(DOCUMENT);
  private browser = inject(IS_BROWSER);
  private insHost = viewChild.required<ElementRef<HTMLElement>>('insHost');

  readonly note = HOUSE_NOTE;
  readonly state = signal<AdSlotState>('reserved');
  /** the box is (nearly) in view, or for the rail the browser had an idle moment */
  private readonly near = signal(false);
  /** this page reserves ad space at all (an edition with ads, an ad page) */
  readonly on = computed(() => this.ads.reserved());
  readonly hostClass = computed(() => `${this.placement()} upto-${this.upTo()}${this.on() ? '' : ' off'}`);
  /** the house note: in an empty box, after "unfilled", when the push failed, or while waiting for a script that was blocked */
  readonly noteShown = computed(() => {
    const s = this.state();
    if (s === 'filled') return false;
    if (s === 'pending') return this.ads.blocked();
    return true;
  });

  private size: AdSize | null = null;
  private ins: HTMLElement | null = null;
  private io?: IntersectionObserver;
  private mo?: MutationObserver;
  private idleId?: number;
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    afterNextRender(() => this.init());
    effect(() => {
      if (this.ads.live() && this.near()) untracked(() => this.request());
    });
    inject(DestroyRef).onDestroy(() => this.teardown());
  }

  /** Browser only (afterNextRender never runs while prerendering). */
  private init() {
    const w = this.doc.defaultView;
    if (!this.browser || !w) return;
    this.size = adSizeFor(this.placement(), w.innerWidth, this.upTo());
    if (!this.size) return; // no unit at this width for this page view
    if (this.placement() === 'rail') {
      // always in the first viewport: wait for an idle moment so the loader does not compete with the page itself
      const go = () => this.near.set(true);
      if (typeof w.requestIdleCallback === 'function') this.idleId = w.requestIdleCallback(go, { timeout: 2000 });
      else this.timer = setTimeout(go, 200);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      this.near.set(true);
      return;
    }
    // `main` is the scrolling area of the shell: measure against it so the 300 px look-ahead applies there
    const root = this.host.nativeElement.closest('main');
    this.io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        this.io?.disconnect();
        this.near.set(true);
      },
      { root, rootMargin: '300px 0px' },
    );
    this.io.observe(this.host.nativeElement);
  }

  /** Creates this instance's one `ins` and pushes it once. */
  private request() {
    if (this.ins || !this.size || this.state() !== 'reserved') return;
    const box = this.insHost().nativeElement;
    // a hidden box (print, "use less data", CSS hid it at this width) must never get a push: Google would mark it done
    // with no ad, or throw "No slot size for availableWidth=0"
    if (box.clientWidth <= 0) return;
    const { width, height, slot } = this.size;
    const ins = this.doc.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'inline-block';
    ins.style.width = `${width}px`;
    ins.style.height = `${height}px`;
    ins.setAttribute('data-ad-client', this.ads.config.client);
    ins.setAttribute('data-ad-slot', this.ads.config.slots[slot]);
    // a general-audience site: "unspecified" stated explicitly, so a change of policy is a one-line edit (adsense.md section 11)
    ins.setAttribute('data-tag-for-age-treatment', '0');
    box.appendChild(ins);
    this.ins = ins;
    this.state.set('pending');
    if (typeof MutationObserver !== 'undefined') {
      this.mo = new MutationObserver(() => this.readStatus());
      this.mo.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });
    }
    this.ads.noteRequest();
    this.ads.ensureLoader().catch(() => this.log.info('The ad script could not be loaded (blocked or offline); the page works the same.'));
    if (!this.ads.push()) {
      ins.style.display = 'none';
      this.state.set('failed');
      this.log.warn('An ad slot could not be filled (adsbygoogle.push threw).');
    }
  }

  private readStatus() {
    const s = this.ins?.getAttribute('data-ad-status');
    if (s === 'filled') {
      this.state.set('filled');
      this.mo?.disconnect();
    } else if (s === 'unfilled' || s === 'unfill-optimized') {
      // the box keeps its size (no shift) and shows the house note instead of a blank space
      if (this.ins) this.ins.style.display = 'none';
      this.state.set('unfilled');
      this.mo?.disconnect();
    }
  }

  private teardown() {
    this.io?.disconnect();
    this.mo?.disconnect();
    clearTimeout(this.timer);
    const w = this.doc.defaultView;
    if (this.idleId !== undefined && w && typeof w.cancelIdleCallback === 'function') w.cancelIdleCallback(this.idleId);
    // only this instance's own element, never every ins.adsbygoogle on the page
    this.ins?.remove();
    this.ins = null;
  }
}
