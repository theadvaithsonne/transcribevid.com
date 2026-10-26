import { DOCUMENT } from '@angular/common';
import { Injectable, InjectionToken, computed, inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../environments/environment';
import { ADSENSE, AdSenseConfig, adsConfigured } from './ads.config';
import { JobsStore } from './jobs.store';
import { IS_BROWSER } from './platform';

/**
 * Route data `ads`: `true` = an information page that may show ads (home, how it works, FAQ, the tool pages);
 * `'job-done'` = the transcript page, which shows ads only once its transcript is finished. Any other route: no ads.
 */
export type AdsRouteFlag = true | 'job-done';

/** This edition shows ads at all (environment.ads: the static website only). A token so a spec can switch it. */
export const ADS_EDITION = new InjectionToken<boolean>('ADS_EDITION', {
  providedIn: 'root',
  factory: () => environment.ads === true,
});

/** The AdSense ids (core/ads.config.ts). A token so a spec can try a fully configured account. */
export const ADS_CONFIG = new InjectionToken<AdSenseConfig>('ADS_CONFIG', {
  providedIn: 'root',
  factory: () => ADSENSE,
});

/** Opens a URL with a full page load (a new document). A token so a spec can watch it instead of leaving the page. */
export const FULL_PAGE_LOAD = new InjectionToken<(url: string) => void>('FULL_PAGE_LOAD', {
  providedIn: 'root',
  factory: () => {
    const w = inject(DOCUMENT).defaultView;
    return (url: string) => w?.location.assign(url);
  },
});

/** Google's loader, exactly as AdSense > Ads > "Get code" gives it (the client id is appended). */
export const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

/** A new ad request for the same placement after a route change only once this long after the previous one. */
export const NEW_VIEW_MIN_MS = 30_000;

type LoaderState = 'idle' | 'loading' | 'ready' | 'blocked';

/** The parts of Google's consent API (Funding Choices, delivered by the AdSense loader) this site uses. */
interface GoogleFc {
  callbackQueue?: unknown[];
  showRevocationMessage?: () => void;
}
type AdsWindow = Window & { adsbygoogle?: unknown[]; googlefc?: GoogleFc };

/** The deepest active route: the page itself (its `data` and `:id`). */
function leaf(route: ActivatedRouteSnapshot | null): ActivatedRouteSnapshot | null {
  let r = route;
  while (r?.firstChild) r = r.firstChild;
  return r;
}

/**
 * Where ads may appear and when Google's code may run (docs/in-browser/spike/adsense.md sections 6-9 and 16).
 *
 * * Nothing happens unless this edition shows ads AND every AdSense id is configured (`configured`): before that, ad pages
 *   only reserve their space and show the house note, and Google's script is never requested (dev, tests, CI, review).
 * * The loader is appended once, in the browser only (never while prerendering), the first time a slot is about to request
 *   an ad. Auto ads are switched off in the dashboard: only the manual units of shared/ad-slot ever show.
 * * Ad pages come from the route data (`reserved`); no ad is requested while a transcription is queued or running in this
 *   tab (`busy`), on the transcript page before its transcript is finished, or on privacy, terms, logs and 404.
 */
@Injectable({ providedIn: 'root' })
export class AdsService {
  private store = inject(JobsStore);
  private router = inject(Router);
  private doc = inject(DOCUMENT);
  private browser = inject(IS_BROWSER);
  readonly config = inject(ADS_CONFIG);
  /** this edition shows ads at all: the rail and the in-flow boxes are reserved on ad pages */
  readonly edition = inject(ADS_EDITION);
  /** every id is filled in: the one state in which Google's script may be loaded */
  readonly configured = this.edition && adsConfigured(this.config);

  /** the page now shown (the router's state after the last navigation) */
  private readonly route = signal<ActivatedRouteSnapshot | null>(null);
  /** a transcription is queued or running in this tab: no new ad request (CPU, memory and accidental clicks) */
  readonly busy = computed(() => this.store.active().length > 0);
  /** the page shown is an ad page: it reserves the ad space (the rail, or the in-flow box) */
  readonly reserved = computed(() => this.isAdPage(this.route()));
  /**
   * The page's in-flow unit is drawn by the app shell, after the page (route data `adSlot: 'end'`): the home page and the
   * finished transcript, whose own templates have no content break below their buttons.
   */
  readonly endSlot = computed(() => this.reserved() && leaf(this.route())?.data?.['adSlot'] === 'end');
  /** the address shown (no query): the shell's end-of-page unit is keyed on it, so every page gets its own `ins` */
  readonly path = signal('');
  /** an ad may be requested now */
  readonly live = computed(() => this.configured && this.browser && this.reserved() && !this.busy());
  /** "Privacy and cookie settings" in the footer: only where Google's consent message can exist (an ad page, ads configured) */
  readonly privacySettingsShown = computed(() => this.configured && this.browser && this.reserved());

  readonly loader = signal<LoaderState>('idle');
  /** the loader could not be fetched (an ad blocker, or no network): the slots show the house note */
  readonly blocked = computed(() => this.loader() === 'blocked');

  /**
   * Changes when a route change is a new page view for the ads (a different page, at most once per NEW_VIEW_MIN_MS): the
   * rail and a reused page component (the six tool pages share one) key their slot on it, so a new view gets a new `ins`.
   */
  readonly viewKey = signal(0);
  private lastViewAt = 0;
  private lastPath = '';
  private loading: Promise<void> | null = null;

  constructor() {
    this.route.set(this.router.routerState.snapshot.root);
    this.router.events.subscribe((e) => {
      if (!(e instanceof NavigationEnd)) return;
      this.route.set(this.router.routerState.snapshot.root);
      const path = e.urlAfterRedirects.split(/[?#]/)[0];
      this.path.set(path);
      this.newView(path);
    });
  }

  /**
   * May this route show an ad right now? The route data says whether it is an ad page; the transcript page only once its
   * transcript is finished; never while a transcription is queued or running; never in an edition without ads.
   */
  canShow(route: ActivatedRouteSnapshot | null): boolean {
    return this.isAdPage(route) && !this.busy();
  }

  private isAdPage(route: ActivatedRouteSnapshot | null): boolean {
    if (!this.edition) return false;
    const r = leaf(route);
    const flag = r?.data?.['ads'] as AdsRouteFlag | undefined;
    if (flag === true) return true;
    if (flag === 'job-done') {
      const id = r?.paramMap.get('id');
      return !!id && this.store.jobs().some((j) => j.id === id && j.status === 'done');
    }
    return false;
  }

  private newView(path: string) {
    if (path === this.lastPath) return;
    const first = !this.lastPath;
    this.lastPath = path;
    const now = Date.now();
    if (first || now - this.lastViewAt < NEW_VIEW_MIN_MS) return;
    this.lastViewAt = now;
    this.viewKey.update((k) => k + 1);
  }

  /** A slot requested an ad: the clock for the next "new page view" starts now. */
  noteRequest() {
    this.lastViewAt = Date.now();
  }

  /**
   * Appends Google's loader once (a singleton promise). Resolves on `load`; rejects when it cannot load (blocked or offline,
   * `blocked` becomes true). Never called while prerendering, never before every id is configured.
   */
  ensureLoader(): Promise<void> {
    if (!this.configured || !this.browser) return Promise.reject(new Error('ads are off in this build'));
    if (this.loading) return this.loading;
    this.loader.set('loading');
    this.loading = new Promise<void>((resolve, reject) => {
      const s = this.doc.createElement('script');
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.src = `${ADSENSE_SRC}?client=${encodeURIComponent(this.config.client)}`;
      s.setAttribute('data-tv-ads', '');
      s.addEventListener('load', () => {
        this.loader.set('ready');
        resolve();
      });
      s.addEventListener('error', () => {
        this.loader.set('blocked');
        reject(new Error('the ad script could not be loaded'));
      });
      this.doc.head.appendChild(s);
    });
    this.loading.catch(() => undefined); // a blocked loader is a normal state, not an unhandled rejection
    return this.loading;
  }

  /** true once Google's script is (being) loaded in this document */
  loaderInDocument(): boolean {
    return this.loader() !== 'idle';
  }

  /**
   * One `push({})` for a freshly created `ins` (the queue works before the loader has arrived). Returns false when Google's
   * code throws (for example "already have ads in them"): the caller shows the house note, the page keeps working.
   */
  push(): boolean {
    const w = this.doc.defaultView as AdsWindow | null;
    if (!w) return false;
    try {
      (w.adsbygoogle = w.adsbygoogle || []).push({});
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Re-opens Google's consent message ("Privacy and cookie settings"). Google's consent tool comes with the loader, so on an
   * ad page the loader is requested first if needed and the call is queued until the consent data is ready.
   * Resolves false when it cannot be opened (ads off, or the loader is blocked).
   */
  async openPrivacySettings(): Promise<boolean> {
    if (!this.configured || !this.browser) return false;
    const w = this.doc.defaultView as AdsWindow | null;
    if (!w) return false;
    const fc = (w.googlefc = w.googlefc || {});
    if (typeof fc.showRevocationMessage === 'function') {
      fc.showRevocationMessage();
      return true;
    }
    fc.callbackQueue = fc.callbackQueue || [];
    fc.callbackQueue.push({ CONSENT_DATA_READY: () => w.googlefc?.showRevocationMessage?.() });
    try {
      await this.ensureLoader();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Pages that must never carry Google's script (privacy, terms, logs): when the loader is already in this document (the
 * visitor came from an ad page), open them with a full page load instead of a client-side route change, so the new document
 * has no ad code. The privacy policy URL in Google's consent message must point to such a page (adsense.md section 9).
 * A running transcription would stop on a page load, so then the normal route change is kept.
 */
export const adFreeDocument: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const ads = inject(AdsService);
  if (!ads.loaderInDocument() || ads.busy()) return true;
  inject(FULL_PAGE_LOAD)(state.url);
  return false;
};
