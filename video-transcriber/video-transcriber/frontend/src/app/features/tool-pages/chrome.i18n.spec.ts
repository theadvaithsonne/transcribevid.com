import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { appPages, notFoundRoute } from '../../app.routes';
import { Dict, I18N_DATA, I18nService } from '../../i18n/i18n.service';
import { localizedRoutes } from '../../i18n/routes';
import { fakeData } from '../../i18n/testing';
import { silentLog } from '../../testing/fakes';
import { NotFoundPage } from '../not-found/not-found';
import { AllToolsPage } from './all-tools';
import { ToolDrop } from './tool-drop';

const clean = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim();

/** A small Spanish dictionary: only the chrome strings these pages use. */
const ES: Dict = {
  'Home': 'Inicio',
  'Breadcrumb': 'Ruta de navegación',
  'All free tools': 'Todas las herramientas gratis',
  'All free video and audio to text tools': 'Todas las herramientas gratis de vídeo y audio a texto',
  'Video and audio to text': 'Vídeo y audio a texto',
  'The main tools: turn any video or audio file into a timestamped transcript.': 'Las herramientas principales.',
  'By file type': 'Por tipo de archivo',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.': 'Páginas para el archivo que ya tienes.',
  'Guides': 'Guías',
  'Longer answers: formats, subtitles, accuracy and privacy.': 'Respuestas más largas.',
  'label:/video-to-text': 'Vídeo a texto',
  'description:/video-to-text': 'Convierte un vídeo en texto, gratis.',
  'label:/guides/srt-vs-vtt': 'SRT frente a VTT',
  'description:/guides/srt-vs-vtt': 'SRT o VTT: cuál elegir.',
  'Page not found': 'Página no encontrada',
  'The page you are looking for does not exist or has moved.': 'La página que buscas no existe o se ha movido.',
  'Go to the home page': 'Ir a la página de inicio',
  'Choose a file': 'Elegir un archivo',
  'Drop your {noun} here, or choose a file': 'Suelta aquí tu {noun} o elige un archivo',
  '{formats}.': '{formats}.',
  '{formats} and more.': '{formats} y más.',
  'Audio works too.': 'El audio también funciona.',
  'Your file never leaves your device.': 'Tu archivo nunca sale de tu dispositivo.',
  'Please add one file at a time here. You can add more files on the next page.': 'Añade un archivo cada vez. En la página siguiente puedes añadir más.',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.': 'Eso no es un archivo de vídeo ni de audio.',
  '"{name}" is empty.': '"{name}" está vacío.',
  '"{name}" is ready. Press Transcribe to start.': '"{name}" está listo. Pulsa Transcribir para empezar.',
  'File added': 'Archivo añadido',
  'File not added': 'Archivo no añadido',
};

function esData() {
  return fakeData({
    available: { es: ['/', '/tools', '/video-to-text', '/guides/srt-vs-vtt'] },
    dicts: { es: async () => ({ default: ES }) },
    slugs: { ...fakeData().slugs, es: { '/video-to-text': 'video-a-texto', '/guides/srt-vs-vtt': 'guides/srt-vs-vtt-es' } },
  });
}

async function spanish() {
  const data = esData();
  const routes = [
    ...appPages,
    ...localizedRoutes(appPages, { available: data.available, slugs: data.slugs, notFound: notFoundRoute }),
    notFoundRoute,
  ];
  TestBed.configureTestingModule({
    providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter(routes, withComponentInputBinding()), { provide: I18N_DATA, useValue: data }],
  });
  const i18n = TestBed.inject(I18nService);
  i18n.start();
  return { i18n, harness: await RouterTestingHarness.create(), data };
}

describe('the chrome of the tool, hub and 404 pages is translatable', () => {
  describe('/tools (AllToolsPage)', () => {
    it('in Spanish: translated headings, only the pages that exist in Spanish, their Spanish names, links to the Spanish addresses', async () => {
      const { harness } = await spanish();
      await harness.navigateByUrl('/es/tools');
      harness.detectChanges();
      const page = harness.routeNativeElement as HTMLElement;
      expect(page.tagName.toLowerCase()).toBe('app-all-tools');
      expect(clean(page.querySelector('h1')!.textContent)).toBe('Todas las herramientas gratis de vídeo y audio a texto');
      expect(page.querySelector('nav.crumbs')!.getAttribute('aria-label')).toBe('Ruta de navegación');
      expect(Array.from(page.querySelectorAll('nav.crumbs a')).map((a) => [clean(a.textContent), a.getAttribute('href')])).toEqual([['Inicio', '/es']]);
      expect(Array.from(page.querySelectorAll('section h2')).map((h) => clean(h.textContent))).toEqual(['Vídeo y audio a texto', 'Guías']);
      const items = Array.from(page.querySelectorAll('.tools li a')).map((a) => [clean(a.textContent), a.getAttribute('href')]);
      expect(items).toEqual([
        ['Vídeo a texto', '/es/video-a-texto'],
        ['SRT frente a VTT', '/es/guides/srt-vs-vtt-es'],
      ]);
      expect(clean(page.textContent)).toContain('Convierte un vídeo en texto, gratis.');
    });

    it('in English the page is unchanged: every tool page and guide, English addresses', async () => {
      TestBed.configureTestingModule({ providers: [provideRouter([])] });
      const fixture = TestBed.createComponent(AllToolsPage);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      expect(clean(el.querySelector('h1')!.textContent)).toBe('All free video and audio to text tools');
      expect(el.querySelectorAll('.tools li').length).toBeGreaterThan(25);
      expect(el.querySelector('a[href="/video-to-text"]')).not.toBeNull();
      expect(el.querySelector('a[href="/guides/srt-vs-vtt"]')).not.toBeNull();
    });
  });

  describe('the 404 page', () => {
    it('speaks the language of the address it is shown under, and links home in that language', async () => {
      const { harness, i18n } = await spanish();
      await harness.navigateByUrl('/es/no-existe');
      harness.detectChanges();
      const page = harness.routeNativeElement as HTMLElement;
      expect(i18n.locale()).toBe('es');
      expect(page.tagName.toLowerCase()).toBe('app-not-found');
      expect(clean(page.querySelector('h1')!.textContent)).toBe('Página no encontrada');
      expect(clean(page.querySelector('.lede')!.textContent)).toBe('La página que buscas no existe o se ha movido.');
      const home = page.querySelector('a')!;
      expect(clean(home.textContent)).toBe('Ir a la página de inicio');
      expect(home.getAttribute('href')).toBe('/es');
    });

    it('is English at an English address (the component has a Spanish side only when the language says so)', () => {
      TestBed.configureTestingModule({ providers: [provideRouter([])] });
      const fixture = TestBed.createComponent(NotFoundPage);
      fixture.detectChanges();
      expect(clean(fixture.nativeElement.querySelector('h1').textContent)).toBe('Page not found');
    });
  });

  describe('the drop box (ToolDrop)', () => {
    async function setupDrop() {
      const data = esData();
      TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([]), { provide: I18N_DATA, useValue: data }] });
      const i18n = TestBed.inject(I18nService);
      i18n.apply('es', await i18n.load('es'));
      const navigate = vi.fn(() => Promise.resolve(true));
      TestBed.inject(Router).navigateByUrl = navigate as unknown as Router['navigateByUrl'];
      const fixture = TestBed.createComponent(ToolDrop);
      fixture.componentRef.setInput('noun', 'vídeo');
      fixture.componentRef.setInput('formats', ['MP4', 'MOV']);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const pick = (...files: File[]) => {
        const input = el.querySelector('input[type="file"]') as HTMLInputElement;
        Object.defineProperty(input, 'files', { value: files, configurable: true });
        input.dispatchEvent(new Event('change', { bubbles: true }));
        fixture.detectChanges();
      };
      return { fixture, el, pick, navigate };
    }

    it('shows its title, button and hint in Spanish', async () => {
      const { el } = await setupDrop();
      expect(clean(el.querySelector('.title')!.textContent)).toBe('Suelta aquí tu vídeo o elige un archivo');
      expect(clean(el.querySelector('button.btn')!.textContent)).toBe('Elegir un archivo');
      const hint = clean(el.querySelector('.hint')!.textContent);
      expect(hint).toContain('MP4, MOV.');
      expect(hint).toContain('El audio también funciona.');
    });

    it('says why a file was refused in Spanish, with the file name in it', async () => {
      const { el, pick } = await setupDrop();
      pick(new File(['x'], 'a.mp4', { type: 'video/mp4' }), new File(['x'], 'b.mp4', { type: 'video/mp4' }));
      expect(clean(el.querySelector('.alert')!.textContent)).toBe('Añade un archivo cada vez. En la página siguiente puedes añadir más.');
      pick(new File(['x'], 'notes.txt', { type: 'text/plain' }));
      expect(clean(el.querySelector('.alert')!.textContent)).toBe('Eso no es un archivo de vídeo ni de audio.');
      pick(Object.defineProperty(new File(['x'], 'vacío.mp4', { type: 'video/mp4' }), 'size', { value: 0 }));
      expect(clean(el.querySelector('.alert')!.textContent)).toBe('"vacío.mp4" está vacío.');
    });

    it('goes to the Spanish home page after a good file', async () => {
      const { pick, navigate } = await setupDrop();
      pick(new File(['x'], 'charla.mp4', { type: 'video/mp4' }));
      expect(navigate).toHaveBeenCalledWith('/es');
    });
  });
});
