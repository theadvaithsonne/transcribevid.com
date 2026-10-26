/** Fixtures shared by the i18n specs: a small fake world with two translated languages (Spanish and German). */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, provideRouter } from '@angular/router';
import { Dict, I18N_DATA, I18nData, I18nService } from './i18n.service';
import { LOCALE_CODES, Locale } from './locales';
import { localizedRoutes } from './routes';

@Component({ template: 'page' })
export class Page {}

export const ES_DICT: Dict = {
  'Hello': 'Hola',
  'Language': 'Idioma',
  'File {n} of {total}': 'Archivo {n} de {total}',
  'title:/video-to-text': 'Convertir video a texto gratis',
  'description:/video-to-text': 'Convierte un video en texto con marcas de tiempo, gratis y sin registro en más de 50 idiomas.',
  'label:/video-to-text': 'Video a texto',
  'title:/': 'Transcribir video y audio a texto',
};

export function fakeData(over: Partial<I18nData> = {}): I18nData {
  const slugs = Object.fromEntries(LOCALE_CODES.map((c) => [c, {}])) as Record<Locale, Record<string, string>>;
  slugs.es = { '/video-to-text': 'video-a-texto', '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-es' };
  return {
    enabled: true,
    available: { es: ['/', '/video-to-text', '/faq', '/guides/srt-vs-vtt'], de: ['/', '/faq'] },
    dicts: { es: async () => ({ default: ES_DICT }), de: async () => ({ default: { Hello: 'Hallo' } }) },
    slugs,
    ...over,
  };
}

export const BASE: Route[] = [
  { path: '', title: 'Free video to text', data: { description: 'Home description', ads: true }, component: Page },
  { path: 'video-to-text', title: 'Video to text', data: { description: 'English description', label: 'Video to text', app: true, ads: true }, component: Page },
  { path: 'faq', title: 'FAQ', data: { description: 'FAQ description' }, component: Page },
  { path: 'guides/srt-vs-vtt', title: 'SRT vs VTT', data: { description: 'Guide', parent: { label: 'Guides', path: '/guides' } }, component: Page },
  { path: 'jobs/:id', title: 'Transcript', data: { noindex: true }, component: Page },
  { path: 'logs', title: 'Logs', data: { noindex: true }, component: Page },
];
export const NOT_FOUND: Route = { path: '**', title: 'Page not found', data: { noindex: true }, component: Page };

/** Configures the TestBed with the fake world (English pages + one group per translated language) and starts the service. */
export function setupI18n(d: I18nData = fakeData(), extraProviders: unknown[] = []) {
  document.documentElement.setAttribute('lang', 'en');
  document.documentElement.setAttribute('dir', 'ltr');
  const routes = [...BASE, ...localizedRoutes(BASE, { available: d.available, slugs: d.slugs, notFound: NOT_FOUND }), NOT_FOUND];
  TestBed.configureTestingModule({ providers: [provideRouter(routes), { provide: I18N_DATA, useValue: d }, ...(extraProviders as never[])] });
  const i18n = TestBed.inject(I18nService);
  i18n.start();
  return { i18n, routes };
}
