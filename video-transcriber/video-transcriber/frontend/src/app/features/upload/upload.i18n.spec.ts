import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { JobsStore } from '../../core/jobs.store';
import { ModelInfo } from '../../core/models';
import { DeviceFacts, estimateTime, formatDuration, formatEstimate, planFor } from '../../engine/device';
import { msg, translateMessage } from '../../engine/device/message';
import { MODEL_UI, languageList } from '../../engine/jobs/reference-data';
import { PLAN_REASON_NEEDS_8GB, PLAN_REASON_NEEDS_SHADER_F16, QWEN_DEVICE_REASON, qwenReason } from '../../engine/qwen/qwen-capability';
import { Dict, I18N_DATA, I18nService } from '../../i18n/i18n.service';
import { fakeData } from '../../i18n/testing';
import { makeBrowserHealth, makePublicHealth, silentLog } from '../../testing/fakes';
import { SHOWN_ELSEWHERE, UploadPage } from './upload';

const clean = (el: Element | null | undefined) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

/** A small Spanish dictionary: just the strings these cases look at. */
const ES: Dict = {
  'Video to text: transcribe a video or audio file': 'Video a texto: transcribe un archivo de video o audio',
  'Free': 'Gratis',
  'Unlimited': 'Ilimitado',
  'No login': 'Sin registro',
  'Choose a file': 'Elegir un archivo',
  'Add another file': 'Añadir otro archivo',
  'Remove {name}': 'Quitar {name}',
  'Remove': 'Quitar',
  'Record from microphone': 'Grabar con el micrófono',
  'Quality': 'Calidad',
  'Fastest': 'Más rápida',
  'Standard': 'Estándar',
  'High accuracy': 'Alta precisión',
  'Best accuracy': 'Máxima precisión',
  'Quickest': 'La más veloz',
  'Fast': 'Rápida',
  'Slower': 'Más lenta',
  'Slowest': 'La más lenta',
  'Recommended': 'Recomendada',
  'Good for most videos.': 'Sirve para la mayoría de los videos.',
  '{blurb} Not sure? Keep this one.': '{blurb} ¿No estás seguro? Deja esta.',
  'Quick results. Good for clear speech.': 'Resultados rápidos. Buena para voz clara.',
  '{title}. {blurb}': '{title}. {blurb}',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.': '{title}. {blurb} No disponible en este dispositivo: {reason}.',
  'needs 8 GB': 'necesita 8 GB',
  'Language': 'Idioma',
  'Detect automatically': 'Detectar automáticamente',
  'Transcribe': 'Transcribir',
  'Transcribe {n} files': 'Transcribir {n} archivos',
  'Choose a file first': 'Elige primero un archivo',
  'Fastest, rough drafts only': 'La más rápida, solo borradores',
  'Good balance (default)': 'Buen equilibrio (predeterminada)',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{size} download': 'descarga de {size}',
  'Your file never leaves your device. [Privacy](/privacy)': 'Tu archivo nunca sale de tu dispositivo. [Privacidad](/privacy)',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers': '**Mejorar el audio**: filtra ruidos graves y siseos, y equilibra las voces bajas',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    '¿Tienes alguna duda? Lee las [preguntas frecuentes](/faq), mira [cómo funciona](/how-it-works) o [escríbenos](/contact).',
  '{done} of {total}': '{done} de {total}',
  'file {n} of {total}': 'archivo {n} de {total}',
  'Stop recording · {time}': 'Parar la grabación · {time}',
  '{duration} (estimate)': '{duration} (estimación)',
  'about {n} min': 'unos {n} min',
  '{n} min': '{n} min',
  'under a minute': 'menos de un minuto',
  'Transcribing takes {time} on this device.': 'Transcribir tarda {time} en este dispositivo.',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '{model} va más lento que el tiempo real en este dispositivo: {wait} para {audio} de audio (estimación). Tiny o base terminan antes.',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'Este dispositivo tiene poca memoria para un archivo tan largo. Se procesa en trozos pequeños, que es más lento; un corte más corto o un modelo menor es más seguro.',
  'first time only, also downloads the {size} MB word-timing model': 'solo la primera vez, además descarga el modelo de tiempos de {size} MB',
  'File "{name}" is {size}; the limit is {limit}.': 'El archivo «{name}» pesa {size}; el límite es {limit}.',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (experimental)',
};

const AVAILABLE_ES = { es: ['/', '/privacy', '/faq', '/how-it-works', '/contact'] };

describe('UploadPage in another language', () => {
  let fixture: ComponentFixture<UploadPage>;
  let page: UploadPage;
  let store: JobsStore;
  let i18n: I18nService;

  const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
  const qa = (sel: string) => Array.from(fixture.nativeElement.querySelectorAll(sel)) as HTMLElement[];

  /** `locale`: the language of the page; the dictionary is applied the way the router does (I18nService.apply). */
  function setup(locale: 'en' | 'es', health = makePublicHealth()) {
    TestBed.configureTestingModule({
      providers: [
        silentLog,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: I18N_DATA, useValue: fakeData({ available: AVAILABLE_ES }) },
      ],
    });
    const ctl = TestBed.inject(HttpTestingController);
    store = TestBed.inject(JobsStore);
    for (const r of ctl.match(() => true)) r.flush(r.request.url.endsWith('/health') ? { status: 'ok' } : []);
    store.health.set(health);
    i18n = TestBed.inject(I18nService);
    i18n.apply(locale, locale === 'es' ? ES : {});
    fixture = TestBed.createComponent(UploadPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => sessionStorage.clear());

  describe('Spanish', () => {
    it('shows the heading, the three promises, the buttons and the Quality choices in Spanish', () => {
      setup('es');
      expect(clean(q('h1'))).toBe('Video a texto: transcribe un archivo de video o audio');
      expect(qa('.trust li').map((l) => clean(l))).toEqual(['Gratis', 'Ilimitado', 'Sin registro']);
      expect(clean(q('.drop-label .btn'))).toBe('Elegir un archivo');
      expect(clean(q('button.rec'))).toBe('Grabar con el micrófono');
      expect(clean(q('fieldset.quality legend'))).toBe('Calidad');
      expect(q('.presets')!.getAttribute('aria-label')).toBe('Calidad');
      expect(qa('.preset b').map((b) => clean(b))).toEqual(['Más rápida', 'Estándar', 'Alta precisión', 'Máxima precisión']);
      expect(qa('.preset .sub').map((s) => clean(s))).toEqual(['La más veloz', 'Recomendada', 'Más lenta', 'La más lenta']);
      expect(clean(q('label[for="lang"]'))).toBe('Idioma');
      expect(clean(q('#lang option'))).toBe('Detectar automáticamente');
      expect(clean(q('button.go'))).toBe('Elige primero un archivo');
    });

    it('the hover text and the line of help under the choices are Spanish too', () => {
      setup('es');
      expect(qa('.preset')[1].getAttribute('title')).toBe('Estándar. Sirve para la mayoría de los videos. ¿No estás seguro? Deja esta.');
      expect(page.tip(page.presets[0])).toBe('Más rápida. Resultados rápidos. Buena para voz clara.');
      page.opts.model = 'small';
      expect(page.selectedHelp()).toBe('Estándar: Sirve para la mayoría de los videos. ¿No estás seguro? Deja esta.');
    });

    it('a model that cannot run here is explained in Spanish (the reason is translated when shown)', () => {
      setup('es', makeBrowserHealth());
      store.models.set([
        { id: 'small', label: 'Small', size_mb: 465, speed: 3, accuracy: 3, note: 'Good balance (default)', downloaded: true },
        { id: 'large-v3', label: 'Large v3', size_mb: 3100, speed: 1, accuracy: 5, note: 'Best accuracy, slowest', downloaded: false, reason: 'needs 8 GB' },
      ] as ModelInfo[]);
      expect(page.tip(page.presets[3])).toBe('Máxima precisión. Fewest mistakes. Takes the longest. No disponible en este dispositivo: necesita 8 GB.');
      const [small, large] = store.models();
      expect(page.modelOption(small)).toBe('Small — Buen equilibrio (predeterminada)');
      expect(page.modelOption(large)).toBe('Large v3 — necesita 8 GB');
    });

    it('a placeholder is filled in, and a file can be removed with a Spanish label', () => {
      setup('es');
      page.files.set([new File(['x'], 'charla.mp4', { type: 'video/mp4' })]);
      fixture.detectChanges();
      expect(q('.files .x')!.getAttribute('aria-label')).toBe('Quitar charla.mp4');
      expect(q('.files .x')!.getAttribute('title')).toBe('Quitar');
      expect(clean(q('.drop-label .btn'))).toBe('Añadir otro archivo');
      expect(clean(q('button.go'))).toBe('Transcribir');
      page.files.set([new File(['x'], 'a.mp4', { type: 'video/mp4' }), new File(['x'], 'b.mp4', { type: 'video/mp4' })]);
      fixture.detectChanges();
      expect(clean(q('button.go'))).toBe('Transcribir 2 archivos');
    });

    it('a sentence with a link keeps the link, in the language of the page, with the link text translated', () => {
      setup('es', makeBrowserHealth());
      const link = q('.submit .note a')!;
      expect(clean(link)).toBe('Privacidad');
      expect(link.getAttribute('href')).toBe('/es/privacy');
      expect(clean(q('.submit .note'))).toBe('Tu archivo nunca sale de tu dispositivo. Privacidad');
      const faq = q('.home-more a[href="/es/faq"]');
      expect(clean(faq)).toBe('preguntas frecuentes');
      expect(qa('.home-more a').map((a) => a.getAttribute('href'))).toEqual(['/es/faq', '/es/how-it-works', '/es/contact']);
    });

    it('a switch label keeps its bold lead-in', () => {
      setup('es');
      page.showAdvanced.set(true);
      fixture.detectChanges();
      const first = q('.checks .check span')!;
      expect(clean(first.querySelector('b'))).toBe('Mejorar el audio');
      expect(clean(first)).toBe('Mejorar el audio: filtra ruidos graves y siseos, y equilibra las voces bajas');
    });

    it('the upload progress line is Spanish', () => {
      setup('es');
      page.files.set([new File(['x'], 'a.mp4'), new File(['x'], 'b.mp4')]);
      page.uploading.set(true);
      page.uploadIndex.set(1);
      page.uploadedBytes.set(1048576);
      page.uploadTotal.set(4194304);
      fixture.detectChanges();
      expect(clean(q('.up-meta span'))).toBe('1.0 MB de 4.0 MB · archivo 2 de 2');
    });

    it('the recording button counts in Spanish', () => {
      setup('es');
      page.recording.set(true);
      page.recSeconds.set(65);
      fixture.detectChanges();
      expect(clean(q('button.rec'))).toBe('Parar la grabación · 01:05');
    });

    it('the error for a file over the limit is Spanish, with the values', () => {
      setup('es', makePublicHealth({ max_upload_mb: 1 }));
      page.addFiles([Object.defineProperty(new File(['x'], 'enorme.mp4', { type: 'video/mp4' }), 'size', { value: 5 * 1024 * 1024 })]);
      expect(page.error()).toBe('El archivo «enorme.mp4» pesa 5 MB; el límite es 1 MB.');
    });

    it('a started transcript opens at its Spanish address; English keeps the router commands it always used', () => {
      setup('es');
      const commands = (page as unknown as { jobCommands(id: string): string[] }).jobCommands('abc123');
      expect(commands).toEqual(['/es/jobs/abc123']);
      TestBed.resetTestingModule();
      setup('en');
      expect((page as unknown as { jobCommands(id: string): string[] }).jobCommands('abc123')).toEqual(['/jobs', 'abc123']);
    });
  });

  describe('language names in the select', () => {
    const list = [
      { code: 'en', name: 'English' },
      { code: 'de', name: 'German' },
      { code: 'fr', name: 'French' },
      { code: 'es', name: 'Spanish' },
      { code: 'zz', name: 'Zedish' },
    ];

    it('English: the list as it comes (sorted by the English name), names unchanged', () => {
      setup('en');
      store.languages.set(list);
      expect(page.languageOptions()).toEqual(list);
      fixture.detectChanges();
      expect(qa('#lang option').map((o) => clean(o))).toEqual(['Detect automatically', 'English', 'German', 'French', 'Spanish', 'Zedish']);
    });

    it('Spanish: each language named in Spanish, sorted by that name; a code the browser does not know keeps the given name', () => {
      setup('es');
      store.languages.set(list);
      const options = page.languageOptions();
      const names = new Intl.DisplayNames('es', { type: 'language' });
      expect(options.find((o) => o.code === 'de')!.name).toBe(names.of('de'));
      expect(options.find((o) => o.code === 'de')!.name).not.toBe('German');
      expect(options.find((o) => o.code === 'zz')!.name).toBe('Zedish');
      const sorted = [...options].sort((a, b) => a.name.localeCompare(b.name, 'es'));
      expect(options).toEqual(sorted);
      expect(options.length).toBe(list.length);
    });

    it('the real list: every language has a name in Spanish and the order is the Spanish alphabet', () => {
      setup('es');
      store.languages.set(languageList());
      const options = page.languageOptions();
      expect(options.length).toBe(languageList().length);
      const english = new Map(languageList().map((l) => [l.code, l.name]));
      const translated = options.filter((o) => o.name !== english.get(o.code));
      expect(translated.length).toBeGreaterThan(options.length * 0.8);
      expect(options.map((o) => o.name)).toEqual(options.map((o) => o.name).sort((a, b) => a.localeCompare(b, 'es')));
    });
  });

  describe('tm: messages that other code produces', () => {
    const gpu: DeviceFacts = { platform: 'desktop', webgpu: true, shaderF16: true, deviceMemory: 8 };
    const weakPhone: DeviceFacts = { platform: 'phone', webgpu: false, shaderF16: false, deviceMemory: 2 };

    it('a time estimate: the sentence, its duration and its "(estimate)" are translated; the English text is what it always was', () => {
      setup('es');
      const english = formatEstimate(420);
      expect(english).toBe('about 7 min (estimate)');
      expect(page.tm(english)).toBe('unos 7 min (estimación)');
      expect(page.tm(formatDuration(30))).toBe('menos de un minuto');
      const advice = msg('Transcribing takes {time} on this device.', { time: english });
      expect(advice).toBe('Transcribing takes about 7 min (estimate) on this device.');
      expect(page.tm(advice)).toBe('Transcribir tarda unos 7 min (estimación) en este dispositivo.');
    });

    it('a warning with a model name and two durations is translated as one sentence', () => {
      setup('es');
      const w = estimateTime(600, 'medium', gpu).warnings[0];
      expect(w.message).toBe('Medium runs slower than real time on this device: about 18 min for 10 min of audio (estimate). Tiny or base finish sooner.');
      expect(page.tm(w.message)).toBe('Medium va más lento que el tiempo real en este dispositivo: unos 18 min para 10 min de audio (estimación). Tiny o base terminan antes.');
    });

    it('a fixed warning and a fixed reason are looked up as they are', () => {
      setup('es');
      const low = estimateTime(7200, 'tiny', weakPhone).warnings.find((x) => x.code === 'low-memory')!;
      expect(page.tm(low.message)).toContain('poca memoria');
      expect(page.tm('needs 8 GB')).toBe('necesita 8 GB');
      expect(page.tm('something nobody translated')).toBe('something nobody translated');
    });

    it('the plan notes the device produces are translatable keys (a sentence with a value, and fixed ones)', () => {
      setup('es');
      const plan = planFor({ platform: 'phone', webgpu: false, shaderF16: false, deviceMemory: null });
      expect(plan.notes[0]).toBe('This browser does not report memory; 3 GB assumed. Pick a smaller model if the page gets slow.');
      // no Spanish entry in the small test dictionary: the English text comes back, never a hole
      expect(page.tm(plan.notes[0])).toBe(plan.notes[0]);
      expect(translateMessage(plan.notes[0], (key, params) => `[${key}|${JSON.stringify(params)}]`)).toBe(
        '[This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.|{"gb":3}]',
      );
    });

    it('the one text with a value that the transport builds is recognised', () => {
      setup('es');
      expect(page.tm('first time only, also downloads the 564 MB word-timing model')).toBe('solo la primera vez, además descarga el modelo de tiempos de 564 MB');
    });

    it('English: every message comes back as it was produced', () => {
      setup('en');
      for (const text of [formatEstimate(420), estimateTime(600, 'medium', gpu).warnings[0].message, 'needs 8 GB', 'first time only, also downloads the 564 MB word-timing model']) {
        expect(page.tm(text)).toBe(text);
      }
    });
  });

  describe('the texts shown from elsewhere (SHOWN_ELSEWHERE) are the ones those modules produce', () => {
    it('the three Qwen reasons', () => {
      expect(SHOWN_ELSEWHERE).toContain(QWEN_DEVICE_REASON);
      expect(SHOWN_ELSEWHERE).toContain(qwenReason(PLAN_REASON_NEEDS_8GB));
      expect(SHOWN_ELSEWHERE).toContain(qwenReason(PLAN_REASON_NEEDS_SHADER_F16));
      expect(qwenReason(null)).toBe(QWEN_DEVICE_REASON);
    });

    it('the model notes of the reference data are all keys the page can translate', () => {
      for (const m of MODEL_UI) expect(m.note.trim()).not.toBe('');
      expect(new Set(MODEL_UI.map((m) => m.note)).size).toBe(MODEL_UI.length);
    });
  });
});
