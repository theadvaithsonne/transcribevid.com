import { Component, signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { JobsStore } from '../../core/jobs.store';
import { Segment } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { I18N_DATA, I18nService } from '../../i18n/i18n.service';
import { fakeData } from '../../i18n/testing';
import { FakeEventSource, makeJob, silentLog } from '../../testing/fakes';
import { EXPORTS, JobPage } from './job';
import { TranscriptView } from './transcript';

/** A Spanish dictionary with the strings these specs look at (English text is the key; anything missing stays English). */
const ES: Record<string, string> = {
  'Your session has ended': 'Su sesión ha terminado',
  'Start a new transcription': 'Empezar una nueva transcripción',
  'Export': 'Exportar',
  'Copy text': 'Copiar texto',
  'More': 'Más',
  'Choose a format': 'Elige un formato',
  'PDF document (.pdf)': 'Documento PDF (.pdf)',
  'Ready to print or share': 'Listo para imprimir o compartir',
  'Plain text (.txt)': 'Texto sin formato (.txt)',
  'Subtitle line length': 'Longitud de las líneas de subtítulos',
  'Short (32 letters)': 'Corta (32 letras)',
  'Close': 'Cerrar',
  'Rename': 'Cambiar nombre',
  'Re-transcribe': 'Volver a transcribir',
  'Quality': 'Calidad',
  'Language': 'Idioma',
  'Find it automatically': 'Detectarlo automáticamente',
  '{label} (first use downloads {size} MB)': '{label} (la primera vez se descargan {size} MB)',
  '{n} words': '{n} palabras',
  '1 word': '1 palabra',
  '{n}% model confidence': '{n}% de confianza del modelo',
  '{language} → English': '{language} → inglés',
  '{n}% done': '{n}% completado',
  'Transcribing…': 'Transcribiendo…',
  'Waiting in line…': 'En cola…',
  'Cancel': 'Cancelar',
  'Cancelling…': 'Cancelando…',
  'Your change is saved.': 'Se guardó el cambio.',
  'Saved': 'Guardado',
  'Changed in {n} lines.': 'Se cambió en {n} líneas.',
  'Replaced': 'Reemplazado',
  'Stop this transcription? The text found so far is kept.': '¿Detener esta transcripción? Se conserva el texto encontrado hasta ahora.',
  'Delete "{title}"? This cannot be undone.': '¿Eliminar «{title}»? No se puede deshacer.',
  '“{title}” was deleted.': 'Se eliminó «{title}».',
  'Deleted': 'Eliminado',
  'A new transcript has started. The old one is kept in your list.': 'Ha empezado una transcripción nueva. La anterior sigue en tu lista.',
  'Started again': 'Empezada de nuevo',
  'No speech was transcribed. Check the recording and the selected language.': 'No se transcribió ningún discurso. Revisa la grabación y el idioma elegido.',
  'Review this transcript': 'Revisa esta transcripción',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.': 'Para voces con acento o varios idiomas, prueba una calidad más alta. La puntuación de confianza no es un porcentaje de precisión.',
  'Transcription failed': 'La transcripción falló',
  'Something went wrong while reading this file.': 'Algo salió mal al leer este archivo.',
  'Try again': 'Intentar de nuevo',
  'Loading…': 'Cargando…',
  'Speed': 'Velocidad',
  'Normal': 'Normal',
  'Playback speed': 'Velocidad de reproducción',
  'Transcript': 'Transcripción',
  'Preparing the audio…': 'Preparando el audio…',
  'Downloading the speech model (first time only): {loaded} of {total}': 'Descargando el modelo de voz (solo la primera vez): {loaded} de {total}',
  'Check Hinglish spelling': 'Revisa la ortografía del hinglish',
  // the transcript list
  'Search the text': 'Buscar en el texto',
  'Search the transcript': 'Buscar en la transcripción',
  '{n} of {total}': '{n} de {total}',
  'No matches': 'Sin resultados',
  'Previous match': 'Resultado anterior',
  'Next match': 'Resultado siguiente',
  'Replace…': 'Reemplazar…',
  'Replace with…': 'Reemplazar por…',
  'Replace with': 'Reemplazar por',
  'Replace in 1 line': 'Reemplazar en 1 línea',
  'Replace in {n} lines': 'Reemplazar en {n} líneas',
  'Replace "{query}" with "{replacement}" in 1 line?': '¿Reemplazar «{query}» por «{replacement}» en 1 línea?',
  'Replace "{query}" with "{replacement}" in {n} lines?': '¿Reemplazar «{query}» por «{replacement}» en {n} líneas?',
  'Underline unsure words': 'Subrayar palabras dudosas',
  'On': 'Sí',
  'Off': 'No',
  'Play from here': 'Reproducir desde aquí',
  'Edit this line': 'Editar esta línea',
  'Edit': 'Editar',
  'Save': 'Guardar',
  'Delete line': 'Eliminar línea',
  'Enter saves · Esc cancels': 'Intro guarda · Esc cancela',
  'Delete this line from the transcript?': '¿Eliminar esta línea de la transcripción?',
  'Unsure: worth listening to again': 'Dudoso: conviene volver a escucharlo',
  'Edited by you': 'Editado por ti',
  'Waiting for the first words…': 'Esperando las primeras palabras…',
  'No speech was found in this file.': 'No se encontró ningún discurso en este archivo.',
  'If it does have speech, try More › Re-transcribe with the right language.': 'Si sí tiene voz, prueba Más › Volver a transcribir con el idioma correcto.',
  'Live: the text appears here as it is recognised': 'En directo: el texto aparece aquí a medida que se reconoce',
  'Following playback': 'Siguiendo la reproducción',
  'Follow playback': 'Seguir la reproducción',
};

const seg = (id: number, start: number, end: number, text: string, extra: Partial<Segment> = {}): Segment => ({ id, start, end, text, words: null, confidence: 0.9, ...extra });
const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

vi.setConfig({ testTimeout: 30_000 });

describe('the transcript pages in another language', () => {
  describe('JobPage', () => {
    let fixture: ComponentFixture<JobPage>;
    let page: JobPage;
    let ctl: HttpTestingController;
    let navigate: ReturnType<typeof vi.fn>;

    function setup(id = 'a', locale: 'es' | 'en' = 'es') {
      TestBed.configureTestingModule({
        providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([]), { provide: I18N_DATA, useValue: fakeData() }],
      });
      ctl = TestBed.inject(HttpTestingController);
      TestBed.inject(JobsStore);
      for (const r of ctl.match(() => true)) r.flush(r.request.url.endsWith('/health') ? { status: 'ok' } : []);
      navigate = vi.fn(() => Promise.resolve(true));
      TestBed.inject(Router).navigate = navigate as unknown as Router['navigate'];
      TestBed.inject(Router).navigateByUrl = navigate as unknown as Router['navigateByUrl'];
      if (locale === 'es') TestBed.inject(I18nService).apply('es', ES);
      fixture = TestBed.createComponent(JobPage);
      page = fixture.componentInstance;
      fixture.componentRef.setInput('id', id);
      fixture.detectChanges();
    }
    const get = (id: string): TestRequest => ctl.expectOne((r) => r.url === `/api/jobs/${id}` && r.method === 'GET');
    const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
    const qa = (sel: string) => Array.from(fixture.nativeElement.querySelectorAll(sel)) as HTMLElement[];
    const toasts = () => TestBed.inject(ToastService).toasts();

    beforeEach(() => {
      vi.useFakeTimers();
      FakeEventSource.reset();
      vi.stubGlobal('EventSource', FakeEventSource);
      vi.stubGlobal('confirm', vi.fn(() => true));
      Element.prototype.scrollIntoView = vi.fn();
      history.replaceState(null, '');
    });
    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllGlobals();
      history.replaceState(null, '');
    });

    it('the "session ended" card is in the page\'s language, and its link goes to that language\'s home page', () => {
      setup();
      page.sessionEnded.set(true);
      fixture.detectChanges();
      expect(clean(q('h1')?.textContent)).toBe('Su sesión ha terminado');
      const a = q('a.btn')!;
      expect(clean(a.textContent)).toBe('Empezar una nueva transcripción');
      expect(a.getAttribute('href')).toBe('/es');
    });

    it('English is untouched: the same card says the English words and links to "/"', () => {
      setup('a', 'en');
      page.sessionEnded.set(true);
      fixture.detectChanges();
      expect(clean(q('h1')?.textContent)).toBe('Your session has ended');
      expect(q('a.btn')!.getAttribute('href')).toBe('/');
    });

    it('a finished transcript: buttons, export menu (labels, hints, subtitle lengths), facts and the re-transcribe form are translated', () => {
      setup();
      get('a').flush(
        makeJob({ id: 'a', status: 'done', language: 'de', duration: 60, segments: [seg(1, 0, 1, 'eins')], stats: { word_count: 12345, avg_confidence: 0.91 } as never, options: { ...makeJob().options, task: 'translate' } }),
      );
      fixture.detectChanges();
      expect(qa('.actions .btn').map((b) => clean(b.textContent))).toEqual(expect.arrayContaining(['Exportar', 'Copiar texto', 'Más']));
      // facts: the language in the page's language (the browser's own names), the times and the numbers
      const facts = qa('.facts span').map((s) => clean(s.textContent));
      expect(facts[0]).toBe('alemán → inglés');
      expect(facts).toContain('12.345 palabras');
      expect(facts).toContain('91% de confianza del modelo');

      page.menu.set('export');
      fixture.detectChanges();
      expect(q('.menu')!.getAttribute('aria-label')).toBe('Elige un formato');
      expect(clean(q('.sheet-title')!.textContent)).toBe('Elige un formato');
      const first = qa('.menu button[role="menuitem"]')[0];
      expect(clean(first.querySelector('b')!.textContent)).toBe('Documento PDF (.pdf)');
      expect(clean(first.querySelector('span')!.textContent)).toBe('Listo para imprimir o compartir');
      expect(clean(qa('.menu button[role="menuitem"]')[1].querySelector('b')!.textContent)).toBe('Texto sin formato (.txt)');
      expect(clean(q('.menu-opt')!.textContent)).toContain('Longitud de las líneas de subtítulos');
      expect(clean(q('.menu-opt option')!.textContent)).toBe('Corta (32 letras)');
      expect(clean(q('.menu .menu-close')!.textContent)).toBe('Cerrar');
      // a format that has no translation yet stays English, never empty
      expect(clean(qa('.menu button[role="menuitem"]')[2].querySelector('b')!.textContent)).toBe('Text with times (.txt)');

      page.menu.set('rerun');
      fixture.detectChanges();
      expect(clean(q('#rerun-title')!.textContent)).toBe('Volver a transcribir');
      expect(clean(q('label[for="rm"]')!.textContent)).toBe('Calidad');
      expect(clean(q('label[for="rl"]')!.textContent)).toBe('Idioma');
      expect(clean(q('#rl option')!.textContent)).toBe('Detectarlo automáticamente');
    });

    it('a running transcript: the step and the percentage are in the page\'s language', () => {
      setup();
      get('a').flush(makeJob({ id: 'a', status: 'running', phase: 'transcribing', progress: 0.42, segments: [] }));
      fixture.detectChanges();
      expect(page.statusText()).toBe('Transcribiendo…');
      expect(page.statusDetail()).toBe('42% completado');
      expect(clean(q('.progress button')!.textContent)).toBe('Cancelar');
      expect(q('.progress')!.getAttribute('aria-label')).toBe('Progress'); // no entry: English
    });

    it('a queued and a preparing transcript, and the model download line', () => {
      setup();
      get('a').flush(makeJob({ id: 'a', status: 'queued', phase: null, segments: [] }));
      expect(page.statusText()).toBe('En cola…');
      page.job.set(makeJob({ id: 'a', status: 'running', phase: 'extracting', segments: [] }));
      expect(page.statusText()).toBe('Preparando el audio…');
      page.job.set(makeJob({ id: 'a', status: 'running', phase: 'loading_model', progress: 0, download: { loaded: 50e6, total: 150e6 } as never, segments: [] }));
      expect(page.statusDetail()).toBe('Descargando el modelo de voz (solo la primera vez): 50 MB de 150 MB');
    });

    it('a transcript with no speech: the review card and the error card are in the page\'s language', () => {
      setup();
      get('a').flush(makeJob({ id: 'a', status: 'done', segments: [] }));
      fixture.detectChanges();
      expect(clean(q('#quality-title')!.textContent)).toBe('Revisa esta transcripción');
      expect(clean(q('.quality-review p')!.textContent)).toBe(
        'No se transcribió ningún discurso. Revisa la grabación y el idioma elegido. Para voces con acento o varios idiomas, prueba una calidad más alta. La puntuación de confianza no es un porcentaje de precisión.',
      );
      page.job.set(makeJob({ id: 'a', status: 'error', error: null, segments: [] }));
      fixture.detectChanges();
      expect(clean(q('.alert h2')!.textContent)).toBe('La transcripción falló');
      expect(clean(q('.alert p')!.textContent)).toBe('Algo salió mal al leer este archivo.');
      expect(clean(q('.alert .btn')!.textContent)).toBe('Intentar de nuevo');
    });

    it('a message from the engine is shown as it came when nothing translates it, and translated when it is a known string', () => {
      setup();
      get('a').flush(makeJob({ id: 'a', status: 'error', error: 'The file is empty.', segments: [] }));
      fixture.detectChanges();
      expect(clean(q('.alert p')!.textContent)).toBe('The file is empty.');
      TestBed.inject(I18nService).apply('es', { ...ES, 'The file is empty.': 'El archivo está vacío.' });
      fixture.detectChanges();
      expect(clean(q('.alert p')!.textContent)).toBe('El archivo está vacío.');
    });

    it('toasts for a saved change, a replace-all and a delete are in the page\'s language', () => {
      setup();
      get('a').flush(makeJob({ id: 'a', title: 'A', segments: [seg(1, 0, 1, 'one'), seg(2, 1, 2, 'two')] }));
      page.save([{ id: 1, text: 'uno' }]);
      ctl.expectOne((r) => r.url === '/api/jobs/a' && r.method === 'PATCH').flush(makeJob({ id: 'a', title: 'A' }));
      expect(toasts().at(-1)).toMatchObject({ message: 'Se guardó el cambio.', title: 'Guardado' });
      page.save([{ id: 1, text: 'a' }, { id: 2, text: 'b' }]);
      ctl.expectOne((r) => r.url === '/api/jobs/a' && r.method === 'PATCH').flush(makeJob({ id: 'a', title: 'A' }));
      expect(toasts().at(-1)).toMatchObject({ message: 'Se cambió en 2 líneas.', title: 'Reemplazado' });
    });

    it('confirm prompts are in the page\'s language (cancel and delete)', () => {
      setup();
      get('a').flush(makeJob({ id: 'a', title: 'Mi charla', status: 'running', phase: 'transcribing', segments: [] }));
      page.cancel();
      expect(confirm).toHaveBeenCalledWith('¿Detener esta transcripción? Se conserva el texto encontrado hasta ahora.');
      ctl.expectOne('/api/jobs/a/cancel').flush(makeJob({ id: 'a', status: 'cancelled', segments: [] }));
      page.job.set(makeJob({ id: 'a', title: 'Mi charla', status: 'done', segments: [seg(1, 0, 1, 'x')] }));
      page.remove();
      expect(confirm).toHaveBeenLastCalledWith('¿Eliminar «Mi charla»? No se puede deshacer.');
      ctl.expectOne((r) => r.url === '/api/jobs/a' && r.method === 'DELETE').flush(null);
      expect(toasts().at(-1)).toMatchObject({ message: 'Se eliminó «Mi charla».', title: 'Eliminado' });
    });

    it('after a delete the visitor goes to the home page of their language; after a re-run to the new transcript in their language', () => {
      setup();
      get('a').flush(makeJob({ id: 'a', title: 'A', status: 'done', segments: [seg(1, 0, 1, 'x')] }));
      page.rerun();
      ctl.expectOne('/api/jobs/a/rerun').flush(makeJob({ id: 'new', status: 'queued' }));
      expect(navigate).toHaveBeenCalledWith('/es/jobs/new');
      expect(toasts().at(-1)).toMatchObject({ title: 'Empezada de nuevo' });
      page.remove();
      ctl.expectOne((r) => r.url === '/api/jobs/a' && r.method === 'DELETE').flush(null);
      expect(navigate).toHaveBeenLastCalledWith('/es', { replaceUrl: true });
    });

    it('in English a re-run still uses the router\'s array form and a delete goes to "/"', () => {
      setup('a', 'en');
      get('a').flush(makeJob({ id: 'a', title: 'A', status: 'done', segments: [seg(1, 0, 1, 'x')] }));
      page.rerun();
      ctl.expectOne('/api/jobs/a/rerun').flush(makeJob({ id: 'new', status: 'queued' }));
      expect(navigate).toHaveBeenCalledWith(['/jobs', 'new']);
      page.remove();
      ctl.expectOne((r) => r.url === '/api/jobs/a' && r.method === 'DELETE').flush(null);
      expect(navigate).toHaveBeenLastCalledWith('/', { replaceUrl: true });
    });

    it('languageLabel: the English name in English, the language\'s own name for the browser in another language, English as the safety net', () => {
      setup('a', 'en');
      expect(page.languageLabel('de', 'German')).toBe('German');
      TestBed.inject(I18nService).apply('es', ES);
      expect(page.languageLabel('de', 'German')).toBe('alemán');
      expect(page.languageLabel('not a code!', 'Mystery')).toBe('Mystery');
    });

    it('the export list is marked for translation and still reads the same in English', () => {
      setup('a', 'en');
      expect(EXPORTS.map((e) => e.label)).toEqual([
        'PDF document (.pdf)',
        'Plain text (.txt)',
        'Text with times (.txt)',
        'Subtitles (.srt)',
        'Web subtitles (.vtt)',
        'Markdown (.md)',
        'JSON (.json)',
      ]);
    });
  });

  describe('TranscriptView', () => {
    @Component({ imports: [TranscriptView], template: `<app-transcript [segments]="segments()" [hasMedia]="media()" [live]="live()" [playing]="playing()" />` })
    class Host {
      segments = signal<Segment[]>([]);
      media = signal(true);
      live = signal(false);
      playing = signal(false);
    }
    let fixture: ComponentFixture<Host>;
    let view: TranscriptView;

    function setup(segments: Segment[], over: { live?: boolean; media?: boolean; playing?: boolean } = {}) {
      TestBed.configureTestingModule({ providers: [{ provide: I18N_DATA, useValue: fakeData() }] });
      TestBed.inject(I18nService).apply('es', ES);
      fixture = TestBed.createComponent(Host);
      fixture.componentInstance.segments.set(segments);
      if (over.live !== undefined) fixture.componentInstance.live.set(over.live);
      if (over.media !== undefined) fixture.componentInstance.media.set(over.media);
      if (over.playing !== undefined) fixture.componentInstance.playing.set(over.playing);
      fixture.detectChanges();
      view = fixture.debugElement.children[0].componentInstance as TranscriptView;
    }
    const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;
    const qa = (sel: string) => Array.from(fixture.nativeElement.querySelectorAll(sel)) as HTMLElement[];

    beforeEach(() => {
      vi.useFakeTimers();
      Element.prototype.scrollIntoView = vi.fn();
      vi.stubGlobal('confirm', vi.fn(() => true));
    });
    afterEach(() => {
      vi.useRealTimers();
      vi.unstubAllGlobals();
    });

    it('the search box, the toggle and the row buttons carry the page\'s language', () => {
      setup([seg(1, 0, 2, 'hola mundo', { confidence: 0.4 })]);
      const box = q('input[type="search"]')!;
      expect(box.getAttribute('placeholder')).toBe('Buscar en el texto');
      expect(box.getAttribute('aria-label')).toBe('Buscar en la transcripción');
      expect(clean(q('.switch')!.textContent)).toContain('Subrayar palabras dudosas');
      expect(clean(q('.onoff')!.textContent)).toBe('Sí');
      expect(q('.ts')!.getAttribute('title')).toBe('Reproducir desde aquí');
      expect(q('.pencil')!.getAttribute('aria-label')).toBe('Editar esta línea');
      expect(q('.pencil')!.getAttribute('title')).toBe('Editar');
      expect(q('.flag')!.getAttribute('title')).toBe('Dudoso: conviene volver a escucharlo');
    });

    it('the match counter, the step buttons and the Replace row (1 line and many lines)', () => {
      setup([seg(1, 0, 2, 'sol y luna'), seg(2, 2, 4, 'sol de nuevo'), seg(3, 4, 6, 'nada')]);
      view.query.set('sol');
      fixture.detectChanges();
      expect(clean(q('.count')!.textContent)).toBe('1 de 2');
      expect(q('button[aria-label="Resultado anterior"]')).not.toBeNull();
      expect(q('button[aria-label="Resultado siguiente"]')!.getAttribute('title')).toBe('Resultado siguiente');
      view.showReplace.set(true);
      fixture.detectChanges();
      expect(clean(q('.replace .btn')!.textContent)).toBe('Reemplazar en 2 líneas');
      expect(q('.replace input')!.getAttribute('placeholder')).toBe('Reemplazar por…');
      expect(q('.replace input')!.getAttribute('aria-label')).toBe('Reemplazar por');
      view.query.set('luna');
      fixture.detectChanges();
      expect(clean(q('.count')!.textContent)).toBe('1 de 1');
      expect(clean(q('.replace .btn')!.textContent)).toBe('Reemplazar en 1 línea');
      view.query.set('zzz');
      fixture.detectChanges();
      expect(clean(q('.count')!.textContent)).toBe('Sin resultados');
    });

    it('the replace question is asked in the page\'s language, for one line and for many', () => {
      setup([seg(1, 0, 2, 'sol y luna'), seg(2, 2, 4, 'sol de nuevo')]);
      const saved: unknown[] = [];
      view.save.subscribe((e) => saved.push(e));
      view.query.set('sol');
      view.replacement.set('estrella');
      view.replaceAll();
      expect(confirm).toHaveBeenLastCalledWith('¿Reemplazar «sol» por «estrella» en 2 líneas?');
      view.query.set('luna');
      view.replacement.set('estrella');
      view.replaceAll();
      expect(confirm).toHaveBeenLastCalledWith('¿Reemplazar «luna» por «estrella» en 1 línea?');
      expect(saved.length).toBe(2);
    });

    it('the editor: its buttons, hint and the delete question', () => {
      setup([seg(1, 0, 2, 'hola')]);
      view.edit(view.segments()[0]);
      fixture.detectChanges();
      expect(q('textarea.edit')!.getAttribute('aria-label')).toBe('Editar esta línea');
      expect(qa('.edit-actions .btn').map((b) => clean(b.textContent))).toEqual(['Guardar', 'Cancelar', 'Eliminar línea']);
      expect(clean(q('.edit-actions .hint')!.textContent)).toBe('Intro guarda · Esc cancela');
      view.remove(view.segments()[0]);
      expect(confirm).toHaveBeenLastCalledWith('¿Eliminar esta línea de la transcripción?');
    });

    it('the empty states, the live note and the follow switch', () => {
      setup([], { live: true });
      expect(clean(q('.empty')!.textContent)).toBe('Esperando las primeras palabras…');
      fixture.componentInstance.live.set(false);
      fixture.detectChanges();
      expect(clean(q('.empty')!.textContent)).toBe('No se encontró ningún discurso en este archivo.Si sí tiene voz, prueba Más › Volver a transcribir con el idioma correcto.');
      fixture.componentInstance.segments.set([seg(1, 0, 2, 'hola')]);
      fixture.componentInstance.live.set(true);
      fixture.detectChanges();
      expect(clean(q('.live-note')!.textContent)).toBe('En directo: el texto aparece aquí a medida que se reconoce');
      fixture.componentInstance.live.set(false);
      fixture.componentInstance.playing.set(true);
      fixture.detectChanges();
      expect(clean(q('.follow')!.textContent)).toBe('Siguiendo la reproducción');
      view.autoScroll.set(false);
      fixture.detectChanges();
      expect(clean(q('.follow')!.textContent)).toBe('Seguir la reproducción');
    });
  });
});
