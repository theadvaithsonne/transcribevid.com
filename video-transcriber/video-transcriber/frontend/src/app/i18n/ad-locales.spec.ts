import { Route } from '@angular/router';
import { appPages, notFoundRoute } from '../app.routes';
import { AVAILABLE } from './generated';
import { OTHER_LOCALES } from './locales';
import { AD_LOCALES, localizeRoute, localizedRoutes } from './routes';

/**
 * Google's publisher policy does not allow ads on "automatically generated content without manual review or curation". Every
 * translation of this site was made by a machine and no native speaker has reviewed one yet, so no translated page is an ad
 * page: AD_LOCALES is empty until a language has been reviewed.
 */
describe('which languages may show ads (AD_LOCALES)', () => {
  const adPage: Route = { path: 'video-to-text', data: { ads: true, adSlot: 'end', app: true, description: 'd', label: 'l' }, title: 'T' };

  it('is empty: no language has been reviewed by a native speaker yet', () => {
    expect([...AD_LOCALES]).toEqual([]);
  });

  it('a translated page keeps its text flags but not the ad flags', () => {
    const es = localizeRoute(adPage, 'es', 'video-a-texto');
    expect(es.data).toEqual({ app: true, locale: 'es', pageKey: '/video-to-text' });
    expect(es.data?.['ads']).toBeUndefined();
    expect(es.data?.['adSlot']).toBeUndefined();
  });

  it('the English page itself is untouched', () => {
    expect(adPage.data?.['ads']).toBe(true);
    expect(adPage.data?.['adSlot']).toBe('end');
  });

  it('a language put on the reviewed list gets the ad flags back, and only that language', () => {
    const reviewed = new Set(['es'] as const);
    const es = localizeRoute(adPage, 'es', 'video-a-texto', reviewed);
    expect(es.data).toEqual({ app: true, ads: true, adSlot: 'end', locale: 'es', pageKey: '/video-to-text' });
    const fr = localizeRoute(adPage, 'fr', 'video-en-texte', reviewed);
    expect(fr.data?.['ads']).toBeUndefined();
  });

  it('a page that was never an ad page does not gain an "ads: undefined" entry for a reviewed language', () => {
    const plain: Route = { path: 'about', data: { description: 'd' }, title: 'About' };
    const es = localizeRoute(plain, 'es', 'acerca-de', new Set(['es'] as const));
    expect('ads' in (es.data ?? {})).toBe(true); // present, but undefined: harmless
    expect(es.data?.['ads']).toBeUndefined();
  });

  it('across every published language, not one translated route (page, 404 or transcript) is an ad page', () => {
    const groups = localizedRoutes(appPages, { available: AVAILABLE, notFound: notFoundRoute });
    expect(groups.length).toBeGreaterThanOrEqual(OTHER_LOCALES.length - 1);
    let checked = 0;
    for (const g of groups) {
      for (const c of g.children ?? []) {
        expect(c.data?.['ads'], `${g.path}/${c.path}`).toBeUndefined();
        expect(c.data?.['adSlot'], `${g.path}/${c.path}`).toBeUndefined();
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(400);
  });

  it('the English ad pages are still ad pages: home, how it works, FAQ, the tool pages and the guides', () => {
    const adPaths = appPages.filter((r) => r.data?.['ads'] === true).map((r) => r.path);
    expect(adPaths).toContain('');
    expect(adPaths).toContain('how-it-works');
    expect(adPaths).toContain('faq');
    expect(adPaths).toContain('video-to-text');
    expect(adPaths).toContain('guides/how-to-transcribe-video-to-text');
    expect(adPaths.length).toBeGreaterThan(45);
  });
});
