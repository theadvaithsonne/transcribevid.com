import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { AdSenseConfig } from './core/ads.config';
import { ADSENSE_SRC, ADS_CONFIG, ADS_EDITION } from './core/ads.service';
import { JobsStore } from './core/jobs.store';
import { IS_BROWSER } from './core/platform';
import { HOUSE_NOTE } from './shared/ad-slot';
import { makeSummary, silentLog } from './testing/fakes';

@Component({ template: '<p>page</p>' })
class Blank {}

const CONFIGURED: AdSenseConfig = {
  client: 'ca-pub-1234567890123456',
  slots: { rail160: '1111111111', rail300: '2222222222', inline300: '3333333333' },
};
const INERT: AdSenseConfig = { ...CONFIGURED, slots: { rail160: '', rail300: '', inline300: '' } };

describe('App shell: ads (the static website edition)', () => {
  let fixture: ComponentFixture<App>;
  let store: JobsStore;

  async function setup(opts: { edition?: boolean; config?: AdSenseConfig; url?: string } = {}) {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    TestBed.configureTestingModule({
      providers: [
        silentLog,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: '', component: Blank, data: { ads: true, adSlot: 'end' } },
          { path: 'faq', component: Blank, data: { ads: true } },
          { path: 'jobs/:id', component: Blank, data: { ads: 'job-done', adSlot: 'end' } },
          { path: 'privacy', component: Blank },
        ]),
        { provide: ADS_EDITION, useValue: opts.edition ?? true },
        { provide: ADS_CONFIG, useValue: opts.config ?? INERT },
        { provide: IS_BROWSER, useValue: true },
      ],
    });
    store = TestBed.inject(JobsStore);
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await go(opts.url ?? '/');
  }
  async function go(url: string) {
    await TestBed.inject(Router).navigateByUrl(url);
    fixture.detectChanges();
    TestBed.tick();
  }
  const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
  const shell = () => q('.shell')!;
  const consent = () =>
    (Array.from(fixture.nativeElement.querySelectorAll('.foot button')) as HTMLElement[]).find((b) => b.textContent?.trim() === 'Privacy and cookie settings') ?? null;
  const googleScripts = () => document.querySelectorAll(`script[src^="${ADSENSE_SRC}"]`).length;

  afterEach(() => {
    document.querySelectorAll(`script[src^="${ADSENSE_SRC}"]`).forEach((s) => s.remove());
    delete (window as { googlefc?: unknown }).googlefc;
    delete (window as { adsbygoogle?: unknown }).adsbygoogle;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('an ad page reserves the right-hand rail (shown from 1100 px by CSS) with the house note while ads are inert', async () => {
    await setup();
    expect(shell().classList).toContain('has-rail');
    const rail = q('app-ad-rail')!;
    expect(rail).not.toBeNull();
    expect(rail.getAttribute('role')).toBe('complementary');
    expect(rail.getAttribute('aria-label')).toBe('Advertisement');
    expect(rail.textContent).toContain(HOUSE_NOTE);
    // inert: Google is never contacted
    expect(googleScripts()).toBe(0);
    expect(fixture.nativeElement.querySelector('ins.adsbygoogle')).toBeNull();
    expect(consent()).toBeNull();
  });

  it('the home page and a finished transcript get their in-flow unit after the page (up to 1000 px)', async () => {
    await setup();
    const end = q('main app-ad-slot');
    expect(end).not.toBeNull();
    expect(end!.classList).toContain('inline');
    expect(end!.classList).toContain('upto-1000');
    await go('/faq'); // its unit is in its own template (not in this fake page)
    expect(q('main app-ad-slot')).toBeNull();
  });

  it('privacy (and every page without the flag): no rail, no unit', async () => {
    await setup({ url: '/privacy' });
    expect(shell().classList).not.toContain('has-rail');
    expect(q('app-ad-rail')).toBeNull();
    expect(q('app-ad-slot')).toBeNull();
  });

  it('a transcript: no ad space while it is being made, the rail once it is finished', async () => {
    await setup();
    store.jobs.set([makeSummary({ id: 'j1', status: 'running' })]);
    await go('/jobs/j1');
    expect(q('app-ad-rail')).toBeNull();
    expect(q('main app-ad-slot')).toBeNull();
    store.jobs.set([makeSummary({ id: 'j1', status: 'done' })]);
    fixture.detectChanges();
    expect(q('app-ad-rail')).not.toBeNull();
    expect(q('main app-ad-slot')).not.toBeNull();
  });

  it('an edition without ads (local install, self-hosted): no rail, no unit, no consent link, full-width page', async () => {
    await setup({ edition: false, config: CONFIGURED });
    expect(shell().classList).not.toContain('has-rail');
    expect(q('app-ad-rail')).toBeNull();
    expect(q('app-ad-slot')).toBeNull();
    expect(consent()).toBeNull();
  });

  describe('"Privacy and cookie settings" in the footer (ads configured)', () => {
    it('is a button on ad pages and absent on other pages', async () => {
      await setup({ config: CONFIGURED });
      expect(consent()).not.toBeNull();
      expect(consent()!.tagName).toBe('BUTTON');
      await go('/privacy');
      expect(consent()).toBeNull();
    });

    it("re-opens Google's consent message", async () => {
      await setup({ config: CONFIGURED });
      const show = vi.fn();
      (window as { googlefc?: unknown }).googlefc = { showRevocationMessage: show };
      consent()!.click();
      await Promise.resolve();
      expect(show).toHaveBeenCalledTimes(1);
    });

    it('says so plainly when the consent tool cannot load (an ad blocker)', async () => {
      await setup({ config: CONFIGURED });
      const notify = vi.spyOn(store, 'notify');
      consent()!.click();
      document.querySelector<HTMLScriptElement>(`script[src^="${ADSENSE_SRC}"]`)!.dispatchEvent(new Event('error'));
      for (let i = 0; i < 5; i++) await Promise.resolve();
      expect(notify).toHaveBeenCalledWith(expect.stringContaining("Google's consent tool could not be loaded"), 'info', 'Privacy and cookie settings');
    });
  });
});
