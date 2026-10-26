import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { makeSummary, silentLog } from '../testing/fakes';
import { AdSenseConfig } from './ads.config';
import { ADSENSE_SRC, ADS_CONFIG, ADS_EDITION, AdsService, FULL_PAGE_LOAD, NEW_VIEW_MIN_MS, adFreeDocument } from './ads.service';
import { JobsStore } from './jobs.store';
import { IS_BROWSER } from './platform';

@Component({ template: '' })
class Blank {}

/** A fully configured account (fake ids): the one state in which Google's script may load. */
export const CONFIGURED: AdSenseConfig = {
  client: 'ca-pub-1234567890123456',
  slots: { rail160: '1111111111', rail300: '2222222222', inline300: '3333333333' },
};
const INERT: AdSenseConfig = { client: 'ca-pub-1234567890123456', slots: { rail160: '', rail300: '', inline300: '' } };

const ROUTES = [
  { path: '', component: Blank, data: { ads: true } },
  { path: 'faq', component: Blank, data: { ads: true } },
  { path: 'jobs/:id', component: Blank, data: { ads: 'job-done' } },
  { path: 'privacy', component: Blank, canActivate: [adFreeDocument] },
  { path: 'logs', component: Blank, canActivate: [adFreeDocument] },
  { path: '**', component: Blank },
];

describe('AdsService', () => {
  let ads: AdsService;
  let router: Router;
  let store: JobsStore;
  /** URLs opened with a full page load */
  let assigned: string[];

  function setup(opts: { edition?: boolean; config?: AdSenseConfig; browser?: boolean } = {}) {
    TestBed.configureTestingModule({
      providers: [
        silentLog,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(ROUTES),
        { provide: ADS_EDITION, useValue: opts.edition ?? true },
        { provide: ADS_CONFIG, useValue: opts.config ?? CONFIGURED },
        { provide: IS_BROWSER, useValue: opts.browser ?? true },
        { provide: FULL_PAGE_LOAD, useValue: (url: string) => assigned.push(url) },
      ],
    });
    assigned = [];
    ads = TestBed.inject(AdsService);
    router = TestBed.inject(Router);
    store = TestBed.inject(JobsStore);
  }
  const go = (url: string) => router.navigateByUrl(url);
  const loaderScripts = () => Array.from(document.querySelectorAll(`script[src^="${ADSENSE_SRC}"]`));

  afterEach(() => {
    for (const s of loaderScripts()) s.remove();
    delete (window as { googlefc?: unknown }).googlefc;
    delete (window as { adsbygoogle?: unknown }).adsbygoogle;
    vi.restoreAllMocks();
  });

  describe('which pages are ad pages', () => {
    it('the information pages (route data ads: true)', async () => {
      setup();
      await go('/');
      expect(ads.reserved()).toBe(true);
      await go('/faq');
      expect(ads.reserved()).toBe(true);
      expect(ads.canShow(router.routerState.snapshot.root)).toBe(true);
    });

    it('never privacy, logs or an unknown page', async () => {
      setup();
      for (const url of ['/privacy', '/logs', '/nope']) {
        await go(url);
        expect(ads.reserved(), url).toBe(false);
        expect(ads.live(), url).toBe(false);
        expect(ads.canShow(router.routerState.snapshot.root), url).toBe(false);
      }
    });

    it('a transcript only once it is finished, never while queued or running', async () => {
      setup();
      store.jobs.set([makeSummary({ id: 'a', status: 'running' })]);
      await go('/jobs/a');
      expect(ads.reserved()).toBe(false);
      store.jobs.set([makeSummary({ id: 'a', status: 'queued' })]);
      expect(ads.reserved()).toBe(false);
      store.jobs.set([makeSummary({ id: 'a', status: 'error' })]);
      expect(ads.reserved()).toBe(false);
      store.jobs.set([makeSummary({ id: 'a', status: 'done' })]);
      expect(ads.reserved()).toBe(true);
      expect(ads.live()).toBe(true);
      await go('/jobs/unknown');
      expect(ads.reserved()).toBe(false);
    });

    it('no new ad while anything is being transcribed in this tab (the space stays reserved)', async () => {
      setup();
      await go('/');
      store.jobs.set([makeSummary({ id: 'a', status: 'running' })]);
      expect(ads.busy()).toBe(true);
      expect(ads.reserved()).toBe(true);
      expect(ads.live()).toBe(false);
      expect(ads.canShow(router.routerState.snapshot.root)).toBe(false);
      store.jobs.set([makeSummary({ id: 'a', status: 'done' })]);
      expect(ads.live()).toBe(true);
    });

    it('an edition without ads (local install, self-hosted) has no ad page at all', async () => {
      setup({ edition: false });
      await go('/');
      expect(ads.configured).toBe(false);
      expect(ads.reserved()).toBe(false);
      expect(ads.canShow(router.routerState.snapshot.root)).toBe(false);
    });
  });

  describe('inert until every id is configured', () => {
    it('reserves the space but never goes live, never loads the script and shows no consent link', async () => {
      setup({ config: INERT });
      await go('/');
      expect(ads.configured).toBe(false);
      expect(ads.reserved()).toBe(true);
      expect(ads.live()).toBe(false);
      expect(ads.privacySettingsShown()).toBe(false);
      await expect(ads.ensureLoader()).rejects.toThrow();
      expect(loaderScripts()).toEqual([]);
      expect(await ads.openPrivacySettings()).toBe(false);
      expect(loaderScripts()).toEqual([]);
    });

    it('while prerendering nothing goes live and no script is added, even when configured', async () => {
      setup({ browser: false });
      await go('/');
      expect(ads.reserved()).toBe(true); // the prerendered HTML keeps the reserved box
      expect(ads.live()).toBe(false);
      await expect(ads.ensureLoader()).rejects.toThrow();
      expect(loaderScripts()).toEqual([]);
    });
  });

  describe('the loader', () => {
    it('is appended once, async, anonymous, with the publisher id', async () => {
      setup();
      const first = ads.ensureLoader();
      const second = ads.ensureLoader();
      expect(second).toBe(first);
      const scripts = loaderScripts() as HTMLScriptElement[];
      expect(scripts.length).toBe(1);
      expect(scripts[0].src).toBe(`${ADSENSE_SRC}?client=ca-pub-1234567890123456`);
      expect(scripts[0].async).toBe(true);
      expect(scripts[0].crossOrigin).toBe('anonymous');
      expect(ads.loader()).toBe('loading');
      expect(ads.loaderInDocument()).toBe(true);
      scripts[0].dispatchEvent(new Event('load'));
      await first;
      expect(ads.loader()).toBe('ready');
    });

    it('a blocked loader is a normal state: blocked() turns true, nothing throws unhandled', async () => {
      setup();
      const p = ads.ensureLoader();
      loaderScripts()[0].dispatchEvent(new Event('error'));
      await expect(p).rejects.toThrow();
      expect(ads.blocked()).toBe(true);
    });

    it('push() queues one entry and reports a throwing queue as false', () => {
      setup();
      expect(ads.push()).toBe(true);
      expect((window as { adsbygoogle?: unknown[] }).adsbygoogle).toEqual([{}]);
      (window as { adsbygoogle?: unknown }).adsbygoogle = {
        push: () => {
          throw new Error("All 'ins' elements in the DOM with class=adsbygoogle already have ads in them.");
        },
      };
      expect(ads.push()).toBe(false);
    });
  });

  describe('"Privacy and cookie settings"', () => {
    it('is offered on ad pages once ads are configured, not on other pages', async () => {
      setup();
      await go('/');
      expect(ads.privacySettingsShown()).toBe(true);
      await go('/nope');
      expect(ads.privacySettingsShown()).toBe(false);
    });

    it("re-opens Google's consent message when the consent tool is there", async () => {
      setup();
      const show = vi.fn();
      (window as { googlefc?: unknown }).googlefc = { showRevocationMessage: show };
      expect(await ads.openPrivacySettings()).toBe(true);
      expect(show).toHaveBeenCalledTimes(1);
      expect(loaderScripts()).toEqual([]);
    });

    it('otherwise queues the call on googlefc.callbackQueue and loads the script that brings the consent tool', async () => {
      setup();
      const opened = ads.openPrivacySettings();
      const fc = (window as { googlefc?: { callbackQueue?: Array<{ CONSENT_DATA_READY?: () => void }>; showRevocationMessage?: () => void } }).googlefc!;
      expect(fc.callbackQueue?.length).toBe(1);
      loaderScripts()[0].dispatchEvent(new Event('load'));
      expect(await opened).toBe(true);
      fc.showRevocationMessage = vi.fn();
      fc.callbackQueue![0].CONSENT_DATA_READY!();
      expect(fc.showRevocationMessage).toHaveBeenCalled();
    });

    it('resolves false when the script is blocked', async () => {
      setup();
      const opened = ads.openPrivacySettings();
      loaderScripts()[0].dispatchEvent(new Event('error'));
      expect(await opened).toBe(false);
    });
  });

  describe('a new page view for reused slots (the rail)', () => {
    it('changes the key on a route change, at most once per 30 seconds', async () => {
      let now = 1_000_000;
      vi.spyOn(Date, 'now').mockImplementation(() => now);
      setup();
      await go('/');
      const k0 = ads.viewKey();
      ads.noteRequest();
      await go('/faq');
      expect(ads.viewKey()).toBe(k0); // within 30 s of the last request: the same ad stays
      now += NEW_VIEW_MIN_MS + 1;
      await go('/');
      expect(ads.viewKey()).toBe(k0 + 1);
      await go('/?x=1');
      expect(ads.viewKey()).toBe(k0 + 1); // same page, only the query changed
    });
  });

  describe('adFreeDocument (privacy, terms, logs)', () => {
    it('is a normal route change while Google\'s script was never loaded', async () => {
      setup();
      await go('/');
      expect(await go('/privacy')).toBe(true);
      expect(router.url).toBe('/privacy');
    });

    it('becomes a full page load once the script is in this tab, so that document has no ad code', async () => {
      setup();
      await go('/');
      void ads.ensureLoader();
      expect(await go('/privacy')).toBe(false);
      expect(assigned).toEqual(['/privacy']);
      expect(router.url).toBe('/');
    });

    it('but never while a transcription runs (a page load would stop it)', async () => {
      setup();
      await go('/');
      void ads.ensureLoader();
      store.jobs.set([makeSummary({ id: 'a', status: 'running' })]);
      expect(await go('/logs')).toBe(true);
      expect(assigned).toEqual([]);
    });
  });
});
