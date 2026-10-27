import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { JobsStore } from './core/jobs.store';
import { I18N_DATA, I18nService } from './i18n/i18n.service';
import { fakeData } from './i18n/testing';
import { makeBrowserHealth, makePublicHealth, makeSummary, makeStats, silentLog, useEnglishNumbers } from './testing/fakes';

@Component({ template: '' })
class Blank {}

/** The words of the app shell in Spanish: enough to prove every visible string goes through the dictionary. */
const ES: Record<string, string> = {
  'Skip to main content': 'Saltar al contenido principal',
  'Main': 'Principal',
  'Transcribe': 'Transcribir',
  'How it works': 'Cómo funciona',
  'FAQ': 'Preguntas frecuentes',
  'Guides': 'Guías',
  'Transcripts': 'Transcripciones',
  'Transcripts {n}': 'Transcripciones {n}',
  'Your transcripts': 'Tus transcripciones',
  'History': 'Historial',
  'Cancel {title}': 'Cancelar {title}',
  'Delete {title}': 'Eliminar {title}',
  'Delete my data now': 'Borrar mis datos ahora',
  'Queued': 'En cola',
  'Transcribing {n}%': 'Transcribiendo {n}%',
  '{n} min left': 'quedan {n} min',
  '{n} min ago': 'hace {n} min',
  'Switch to dark theme': 'Cambiar al tema oscuro',
  'Switch to light theme': 'Cambiar al tema claro',
  'Dark': 'Oscuro',
  'Light': 'Claro',
  'Open menu': 'Abrir menú',
  'Close menu': 'Cerrar menú',
  'Menu': 'Menú',
  'About': 'Acerca de',
  'Contact': 'Contacto',
  'Privacy': 'Privacidad',
  'Terms': 'Términos',
  'Footer': 'Pie de página',
  'Free tools': 'Herramientas gratuitas',
  'Free tools:': 'Herramientas gratuitas:',
  'All tools': 'Todas las herramientas',
  'Language': 'Idioma',
  '{name} home': 'Inicio de {name}',
  'videos transcribed': 'videos transcritos',
  'video transcribed': 'video transcrito',
  '{n} videos transcribed': '{n} videos transcritos',
  '{n} video transcribed': '{n} video transcrito',
  'Stored on this device only, never uploaded.': 'Guardado solo en este dispositivo, nunca se sube.',
  'Your session ends in {mins} min. Export what you need.': 'Tu sesión termina en {mins} min. Exporta lo que necesites.',
  'Session time left: about {n} min': 'Tiempo de sesión restante: unos {n} min',
  'label:/video-to-text': 'Video a texto',
  'Video to text, accurately.': 'Video a texto, con precisión.',
  'This page was translated with AI. [Found a mistake? Tell us.](/contact)': 'Esta página se ha traducido con IA. [¿Has encontrado un error? Cuéntanoslo.](/contact)',
};

describe('App shell in another language', () => {
  let fixture: ComponentFixture<App>;
  let app: App;
  let store: JobsStore;
  let ctl: HttpTestingController;
  let i18n: I18nService;

  const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
  const qa = (sel: string) => Array.from(fixture.nativeElement.querySelectorAll(sel)) as HTMLElement[];
  const text = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const links = (sel: string) => qa(sel).map((a) => [text(a), a.getAttribute('href')]);

  beforeEach(async () => {
    vi.useFakeTimers();
    useEnglishNumbers();
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    sessionStorage.clear();
    const data = fakeData({
      available: { es: ['/', '/video-to-text', '/faq', '/about', '/contact', '/privacy', '/terms', '/tools', '/guides', '/how-it-works'] },
      dicts: { es: async () => ({ default: ES }) },
    });
    TestBed.configureTestingModule({
      providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: '**', component: Blank }]), { provide: I18N_DATA, useValue: data }],
    });
    ctl = TestBed.inject(HttpTestingController);
    store = TestBed.inject(JobsStore);
    i18n = TestBed.inject(I18nService);
    for (const r of ctl.match(() => true)) r.flush(r.request.url.endsWith('/health') ? { status: 'ok' } : []);
    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    store.health.set(makePublicHealth());
    i18n.apply('es', await i18n.load('es'));
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    sessionStorage.clear();
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
  });

  it('the skip link, tab names, menu labels and tagline are in the language, and the tabs lead to the same pages in that language', () => {
    expect(text(q('.skip-link'))).toBe('Saltar al contenido principal');
    expect(q('header nav.mainnav')!.getAttribute('aria-label')).toBe('Principal');
    expect(links('header nav.mainnav a')).toEqual([
      ['Transcribir', '/es'],
      ['Cómo funciona', '/es/how-it-works'],
      ['Preguntas frecuentes', '/es/faq'],
      ['Guías', '/es/guides'],
    ]);
    expect(q('.brand')!.getAttribute('aria-label')).toBe('Inicio de TranscribeVid');
    expect(q('.brand')!.getAttribute('href')).toBe('/es');
    expect(text(q('.tagline'))).toBe('Video a texto, con precisión.');
    expect(q('.menu-btn')!.getAttribute('aria-label')).toBe('Abrir menú');
    expect(text(q('.theme-label'))).toBe('Oscuro');
    expect(q('.theme-btn')!.getAttribute('aria-label')).toBe('Cambiar al tema oscuro');
  });

  it('the footer: translated links to the pages that exist in the language, only the tools that exist there, "All tools"', () => {
    expect(links('footer nav.foot-nav a')).toEqual([
      ['Acerca de', '/es/about'],
      ['Contacto', '/es/contact'],
      ['Privacidad', '/es/privacy'],
      ['Términos', '/es/terms'],
    ]);
    expect(q('footer nav.foot-nav')!.getAttribute('aria-label')).toBe('Pie de página');
    expect(text(q('.foot-tools-label'))).toBe('Herramientas gratuitas:');
    // only /video-to-text exists in this fake Spanish; its name comes from the label: entry
    expect(links('footer nav.foot-tools a')).toEqual([
      ['Video a texto', '/es/video-a-texto'],
      ['Todas las herramientas', '/es/tools'],
    ]);
  });

  it('every translated page ends with a note that it was translated with AI, and a link to report a mistake, in the language', () => {
    const note = q('main .ai-note')!;
    expect(text(note)).toBe('Esta página se ha traducido con IA. ¿Has encontrado un error? Cuéntanoslo.');
    expect(note.querySelector('a')!.getAttribute('href')).toBe('/es/contact');
  });

  it('the note is left off a transcript page: the transcript is not our text', async () => {
    await TestBed.inject(Router).navigateByUrl('/es/jobs/abc');
    fixture.detectChanges();
    expect(q('.ai-note')).toBeNull();
  });

  it('the language menu is there, and says its name in the language', () => {
    const summary = q('app-language-switcher details summary')!;
    expect(summary.getAttribute('title')).toBe('Idioma');
    expect(summary.textContent!.replace(/\s+/g, ' ').trim()).toBe('ES Idioma'); // the visible code is part of the accessible name
  });

  it('the counter reads in the language', () => {
    ctl.expectOne('/api/stats').flush(makeStats({ transcribed: 1234 }));
    fixture.detectChanges();
    expect(text(q('.clabel'))).toBe('videos transcritos');
    expect(q('.counter')!.getAttribute('aria-label')).toBe('1,234 videos transcritos');
  });

  it('the transcript list: status, time and delete labels are in the language, and each row leads to /es/jobs/<id>', () => {
    store.upsert(makeSummary({ id: 'a', title: 'Entrevista', status: 'running', phase: 'transcribing', progress: 0.5, eta_seconds: 90 }));
    store.upsert(makeSummary({ id: 'b', title: 'Clase', status: 'queued' }));
    fixture.detectChanges();
    expect(q('.tbtn')!.getAttribute('aria-label')).toBe('Transcripciones 2');
    expect(q('.tbtn')!.getAttribute('title')).toBe('Tus transcripciones');
    expect(text(q('.tlabel'))).toBe('Transcripciones');
    store.health.set(makeBrowserHealth()); // the in-browser edition: its data note
    app.popOpen.set(true);
    fixture.detectChanges();
    expect(q('#transcripts-pop')!.getAttribute('aria-label')).toBe('Tus transcripciones');
    expect(q('#transcripts-pop nav')!.getAttribute('aria-label')).toBe('Historial');
    const rows = qa('#transcripts-pop .trow');
    const metas = rows.map((r) => text(r.querySelector('.meta')));
    expect(metas.some((m) => m.includes('Transcribiendo 50%') && m.includes('quedan 2 min'))).toBe(true);
    expect(metas.some((m) => m.includes('En cola'))).toBe(true);
    const del = qa('#transcripts-pop .del').map((b) => [b.getAttribute('aria-label'), b.getAttribute('title')]);
    expect(del).toContainEqual(['Cancelar Entrevista', 'Cancel']); // "Cancel" itself has no entry in this small dictionary: English fallback
    expect(del).toContainEqual(['Eliminar Clase', 'Delete']);
    expect(qa('#transcripts-pop a.item').map((a) => a.getAttribute('href')).sort()).toEqual(['/es/jobs/a', '/es/jobs/b']);
    expect(text(q('.wipe'))).toBe('Borrar mis datos ahora');
    expect(text(q('.session-note'))).toContain('Guardado solo en este dispositivo');
  });

  it('a transcript page is recognised with or without a language prefix (/jobs/<id>, /es/jobs/<id>)', async () => {
    const router = TestBed.inject(Router);
    for (const [url, expected] of [
      ['/jobs/abc', true],
      ['/es/jobs/abc', true],
      ['/pt/jobs/abc', true],
      ['/es/faq', false],
      ['/faq', false],
      ['/jobsx', false],
      ['/es/jobsx', false],
    ] as const) {
      await router.navigateByUrl(url);
      expect(app.onJobPage(), url).toBe(expected);
    }
  });

  it('the status helpers translate through the language service', () => {
    expect(app.statusLabel(makeSummary({ status: 'queued' }))).toBe('En cola');
    expect(app.statusLabel(makeSummary({ status: 'running', phase: 'transcribing', progress: 0.25 }))).toBe('Transcribiendo 25%');
    expect(app.fmtEta(300)).toBe('quedan 5 min');
    expect(app.timeAgo(Date.now() / 1000 - 600)).toBe('hace 10 min');
  });
});
