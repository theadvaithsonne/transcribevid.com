import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { I18N_DATA, I18nService } from '../i18n/i18n.service';
import { fakeData } from '../i18n/testing';
import { makePublicHealth, silentLog } from '../testing/fakes';
import { PHASE_LABEL, Translate, english, fmtEta, timeAgo } from './format';
import { errorDetail } from './http-error';
import { JobsStore } from './jobs.store';
import { SiteService } from './site.service';
import { StatsService } from './stats.service';
import { ToastService } from './toast.service';
import { CONVERTER_PROMPT, ConverterConsent } from './transport/converter-consent';
import { printHtml, printTranscript } from './transport/print-view';

const ES: Record<string, string> = {
  'Something went wrong': 'Algo salió mal',
  'Done': 'Hecho',
  'Up to {size} and {minutes} per file.': 'Hasta {size} y {minutes} por archivo.',
  'Up to {minutes} per file.': 'Hasta {minutes} por archivo.',
  '1 minute': '1 minuto',
  '{n} minutes': '{n} minutos',
  '{n} videos transcribed': '{n} videos transcritos',
  '{n} video transcribed': '{n} video transcrito',
  '{label}, as reported by visitors\' browsers': '{label}, según informan los navegadores de los visitantes',
  'This local copy does not count transcriptions': 'Esta copia local no cuenta las transcripciones',
  '{label}. {title}.': '{label}. {title}.',
  'Page {page} of {pages}': 'Página {page} de {pages}',
  '{n} words': '{n} palabras',
  'No speech was transcribed.': 'No se transcribió ningún texto.',
  [CONVERTER_PROMPT]: 'Este archivo necesita un convertidor de 9 MB que se ejecuta en tu navegador. ¿Cargarlo?',
};

/** A translate function that remembers which keys it was asked for. */
function recorder() {
  const calls: [string, Record<string, string | number> | undefined][] = [];
  const t: Translate = (key, params) => {
    calls.push([key, params]);
    return english(key, params);
  };
  return { calls, t };
}

describe('english (the default translate)', () => {
  it('returns the text with its placeholders filled in, and leaves an unknown placeholder alone', () => {
    expect(english('{n} min left', { n: 5 })).toBe('5 min left');
    expect(english('no placeholders')).toBe('no placeholders');
    expect(english('{a} and {b}', { a: 'x' })).toBe('x and {b}');
  });
});

describe('fmtEta, timeAgo and PHASE_LABEL', () => {
  it('fmtEta: the English output is unchanged, and every phrase goes through the translator with its number', () => {
    expect(fmtEta(null)).toBe('');
    expect(fmtEta(0.2)).toBe('1s left');
    expect(fmtEta(42)).toBe('42s left');
    expect(fmtEta(90)).toBe('2 min left');
    const { calls, t } = recorder();
    fmtEta(5, t);
    fmtEta(300, t);
    fmtEta(undefined, t);
    expect(calls).toEqual([
      ['{n}s left', { n: 5 }],
      ['{n} min left', { n: 5 }],
    ]);
  });

  it('timeAgo: the English output is unchanged, and the phrases go through the translator', () => {
    const now = Date.now() / 1000;
    expect(timeAgo(now - 10)).toBe('just now');
    expect(timeAgo(now - 300)).toBe('5 min ago');
    expect(timeAgo(now - 7200)).toBe('2 h ago');
    const { calls, t } = recorder();
    timeAgo(now - 10, t);
    timeAgo(now - 300, t);
    timeAgo(now - 7200, t);
    timeAgo(now - 3 * 86400, t); // a date: no phrase
    expect(calls).toEqual([['just now', undefined], ['{n} min ago', { n: 5 }], ['{n} h ago', { n: 2 }]]);
  });

  it('PHASE_LABEL keeps its English words (shown with the t pipe)', () => {
    expect(PHASE_LABEL).toEqual({
      extracting: 'Preparing audio…',
      loading_model: 'Loading model… (first use downloads it)',
      transcribing: 'Transcribing…',
    });
  });
});

describe('errorDetail with a translator', () => {
  const up = (k: string) => k.toUpperCase();

  it('translates the server detail, the unreachable text and the fallback; without a translator nothing changes', () => {
    expect(errorDetail({ status: 404, error: { detail: 'Job not found' } }, 'x', up)).toBe('JOB NOT FOUND');
    expect(errorDetail({ status: 0 }, 'x', up)).toBe('CANNOT REACH THE SERVER.');
    expect(errorDetail({ status: 500 }, 'Could not save.', up)).toBe('COULD NOT SAVE.');
    expect(errorDetail({ status: 0 }, 'x')).toBe('Cannot reach the server.');
    expect(errorDetail({ status: 500 }, 'Could not save.')).toBe('Could not save.');
    expect(errorDetail({ status: 400, error: { detail: ['first', 'second'] } }, 'x')).toBe('first; second');
    expect(errorDetail({ status: 400 }, '', up)).toBe('');
  });
});

describe('services in another language', () => {
  let i18n: I18nService;

  beforeEach(async () => {
    localStorage.removeItem('tv-converter');
    TestBed.configureTestingModule({
      providers: [
        silentLog,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: I18N_DATA, useValue: fakeData({ dicts: { es: async () => ({ default: ES }) } }) },
      ],
    });
    i18n = TestBed.inject(I18nService);
    i18n.apply('es', await i18n.load('es'));
  });

  afterEach(() => {
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
    localStorage.removeItem('tv-converter');
  });

  it('a toast without a title gets the default title in the language; a given title is shown as it is', () => {
    const toast = TestBed.inject(ToastService);
    toast.error('Boom');
    toast.success('Saved', 'Guardado');
    expect(toast.toasts().map((t) => t.title)).toEqual(['Algo salió mal', 'Guardado']);
    toast.clear();
    toast.success('Copied');
    expect(toast.toasts()[0].title).toBe('Hecho');
  });

  it('the limits and the idle time are worded in the language, whichever of size and length the server states', () => {
    const store = TestBed.inject(JobsStore);
    const site = TestBed.inject(SiteService);
    store.health.set(makePublicHealth({ max_upload_mb: 1024, max_duration_min: 30, session_idle_minutes: 30 }));
    expect(site.limitsText()).toBe('Hasta 1 GB y 30 minutos por archivo.');
    expect(site.idleText()).toBe('30 minutos');
    store.health.set(makePublicHealth({ max_upload_mb: undefined, max_duration_min: 1, session_idle_minutes: 1 }));
    expect(site.limitsText()).toBe('Hasta 1 minuto por archivo.');
    expect(site.idleText()).toBe('1 minuto');
    store.health.set(makePublicHealth({ max_upload_mb: undefined, max_duration_min: 0 }));
    expect(site.limitsText()).toBe('');
  });

  it('the counter: the number in the language\'s own style, the label, the tooltip and the accessible name in the language', () => {
    const ctl = TestBed.inject(HttpTestingController);
    const stats = TestBed.inject(StatsService);
    ctl.expectOne('/api/stats').flush({ transcribed: 12345, counting: true });
    expect(stats.formatted()).toBe(new Intl.NumberFormat('es').format(12345));
    expect(stats.label()).toBe(`${stats.formatted()} videos transcritos`);
    expect(stats.title()).toBe(stats.label());
    expect(stats.ariaLabel()).toBe(stats.label());
    ctl.expectNone('/api/stats');
    stats.stats.set({ transcribed: 0, counting: false });
    expect(stats.title()).toBe('Esta copia local no cuenta las transcripciones');
    expect(stats.ariaLabel()).toBe(`${stats.label()}. Esta copia local no cuenta las transcripciones.`);
  });

  it('the converter question is asked in the language by the service, and in English when the class is made by hand', () => {
    const asked: string[] = [];
    expect(TestBed.inject(ConverterConsent).ask((text) => (asked.push(text), false))).toBe(false);
    expect(asked).toEqual(['Este archivo necesita un convertidor de 9 MB que se ejecuta en tu navegador. ¿Cargarlo?']);
    const byHand: string[] = [];
    expect(new ConverterConsent().ask((text) => (byHand.push(text), false))).toBe(false);
    expect(byHand).toEqual([CONVERTER_PROMPT]);
  });

  it('the PDF print document: the page counter, the word count and the empty message in the language, with the same CSS as English', () => {
    const t: Translate = (key, params) => i18n.t(key, params);
    const job = { title: 'Entrevista', language: 'es', duration: 65, segments: [{ id: 0, start: 0, end: 2, text: 'Hola mundo', words: null, confidence: null }], stats: { word_count: 120 } };
    const es = printHtml(job as never, t);
    expect(es).toContain('content: "Página " counter(page) " de " counter(pages);');
    expect(es).toContain('120 palabras');
    expect(printHtml({ ...job, segments: [], stats: undefined } as never, t)).toContain('<p>No se transcribió ningún texto.</p>');
    // English by default, byte for byte
    const en = printHtml(job as never);
    expect(en).toContain('content: "Page " counter(page) " of " counter(pages);');
    expect(en).toContain('120 words');
    expect(printHtml({ ...job, segments: [], stats: undefined } as never)).toContain('<p>No speech was transcribed.</p>');
    expect(typeof printTranscript).toBe('function');
  });
});
