import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { appPages, notFoundRoute } from '../../app.routes';
import { Dict, I18N_DATA, I18nService } from '../../i18n/i18n.service';
import { localizedRoutes } from '../../i18n/routes';
import { fakeData } from '../../i18n/testing';
import { silentLog } from '../../testing/fakes';
import { fmtLongDate } from './guides.list';

const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();
const ldBlock = (key: string) => {
  const el = document.head.querySelector(`script[data-vt="${key}"]`);
  return el ? JSON.parse(el.textContent!) : null;
};

const ES: Dict = {
  'Home': 'Inicio',
  'Guides': 'Guías',
  'Breadcrumb': 'Ruta de navegación',
  'By {name}': 'Por {name}',
  'Updated {date}': 'Actualizado el {date}',
  '{n} min read': '{n} min de lectura',
  'Common questions': 'Preguntas frecuentes',
  'Keep reading': 'Sigue leyendo',
  'Guides: transcripts and subtitles': 'Guías: transcripciones y subtítulos',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).': '¿Quieres probarlo? [Mira todas las herramientas](/tools) o [transcribe un archivo ahora](/).',
  'title:/guides/srt-vs-vtt': 'SRT frente a VTT: qué formato usar',
  'description:/guides/srt-vs-vtt': 'SRT o VTT: qué es cada formato de subtítulos, en qué se diferencian y cómo obtener el archivo gratis.',
  'label:/guides/srt-vs-vtt': 'SRT frente a VTT',
};

async function spanish() {
  const data = fakeData({
    available: { es: ['/', '/guides', '/guides/srt-vs-vtt'] },
    dicts: { es: async () => ({ default: ES }) },
    slugs: { ...fakeData().slugs, es: { '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-es' } },
  });
  const routes = [
    ...appPages,
    ...localizedRoutes(appPages, { available: data.available, slugs: data.slugs, notFound: notFoundRoute }),
    notFoundRoute,
  ];
  document.head.innerHTML = '';
  TestBed.configureTestingModule({
    providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter(routes, withComponentInputBinding()), { provide: I18N_DATA, useValue: data }],
  });
  const i18n = TestBed.inject(I18nService);
  i18n.start();
  return { i18n, harness: await RouterTestingHarness.create() };
}

describe('fmtLongDate in several languages', () => {
  it('writes the long date in the language, in the Gregorian calendar, whatever the viewer\'s settings', () => {
    expect(fmtLongDate('2026-10-27')).toBe('27 October 2026');
    expect(fmtLongDate('2026-10-27', 'en')).toBe('27 October 2026');
    expect(fmtLongDate('2026-10-27', 'es')).toBe('27 de octubre de 2026');
    expect(fmtLongDate('2026-10-27', 'de')).toBe('27. Oktober 2026');
    expect(fmtLongDate('2026-10-27', 'fr')).toBe('27 octobre 2026');
    expect(fmtLongDate('2026-10-27', 'th')).toContain('2026'); // not the Buddhist year 2569
    expect(fmtLongDate('2026-10-27', 'ja')).toContain('2026');
  });

  it('leaves anything that is not a real date alone, and survives a language the browser does not know', () => {
    expect(fmtLongDate('nonsense', 'es')).toBe('nonsense');
    expect(fmtLongDate('2026-13-40', 'es')).toBe('2026-13-40');
    expect(fmtLongDate('2026-02-31', 'es')).toBe('2026-02-31');
    expect(fmtLongDate('2026-10-27', 'xx-bogus-locale')).toMatch(/2026/);
  });
});

describe('the chrome of a guide and of the guides page is translatable', () => {
  it('a guide in Spanish: translated crumbs, date, reading time, headings and links; its Article data in Spanish with the Spanish address', async () => {
    const { i18n, harness } = await spanish();
    await harness.navigateByUrl('/es/guides/srt-vs-vtt-es');
    harness.detectChanges();
    const page = harness.routeNativeElement as HTMLElement;
    expect(page.tagName.toLowerCase()).toBe('app-guide');
    expect(i18n.locale()).toBe('es');
    const crumbs = Array.from(page.querySelectorAll('nav.crumbs > *')).filter((e) => e.getAttribute('aria-hidden') !== 'true');
    expect(crumbs.map((c) => [clean(c.textContent), c.getAttribute('href')])).toEqual([
      ['Inicio', '/es'],
      ['Guías', '/es/guides'],
      ['SRT frente a VTT', null],
    ]);
    expect(page.querySelector('nav.crumbs')!.getAttribute('aria-label')).toBe('Ruta de navegación');
    expect(clean(page.querySelector('.meta')!.textContent)).toMatch(/^Por Advaith Bibhishan Sonne\s*·\s*Actualizado el 27 de octubre de 2026\s*·\s*\d+ min de lectura$/);
    expect(clean(page.querySelector('#g-faq-title')!.textContent)).toBe('Preguntas frecuentes');
    expect(clean(page.querySelector('#g-links-title')!.textContent)).toBe('Sigue leyendo');

    const article = ldBlock('page:article');
    expect(article.inLanguage).toBe('es');
    expect(article.description).toContain('SRT o VTT: qué es cada formato');
    expect(article.url).toBe('https://transcribevid.com/es/guides/srt-vs-vtt-es');
    expect(article.dateModified).toBe('2026-10-27'); // the machine-readable date is never translated
    expect(page.querySelector('time')!.getAttribute('datetime')).toBe('2026-10-27');
  });

  it('the guides page in Spanish: its own heading, only the guides that exist in Spanish with their Spanish name and date, a rich sentence with localised links', async () => {
    const { harness } = await spanish();
    await harness.navigateByUrl('/es/guides');
    harness.detectChanges();
    const page = harness.routeNativeElement as HTMLElement;
    expect(clean(page.querySelector('h1')!.textContent)).toBe('Guías: transcripciones y subtítulos');
    const links = Array.from(page.querySelectorAll('.guides h2 a'));
    expect(links.map((a) => [clean(a.textContent), a.getAttribute('href')])).toEqual([['SRT frente a VTT', '/es/guides/srt-vs-vtt-es']]);
    expect(clean(page.querySelector('.guides .when')!.textContent)).toBe('Actualizado el 27 de octubre de 2026');
    const closing = Array.from(page.querySelectorAll('article > p a')).map((a) => [clean(a.textContent), a.getAttribute('href')]);
    expect(closing).toEqual([
      ['Mira todas las herramientas', '/tools'], // /tools is not translated in this fake world: the link keeps its English address
      ['transcribe un archivo ahora', '/es'],
    ]);
  });
});
