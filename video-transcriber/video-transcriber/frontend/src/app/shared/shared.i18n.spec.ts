import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastService } from '../core/toast.service';
import { I18N_DATA, I18nService } from '../i18n/i18n.service';
import { fakeData } from '../i18n/testing';
import { silentLog } from '../testing/fakes';
import { AdRail } from './ad-rail';
import { AdSlot, HOUSE_NOTE } from './ad-slot';
import { FreeChips } from './free-chips';
import { RelatedTools } from './related-tools';
import { ToolLabelPipe } from './tool-label';
import { Toasts } from './toasts';

const ES: Record<string, string> = {
  'Free': 'Gratis',
  'Unlimited': 'Sin límites',
  'No login': 'Sin registro',
  'Free, unlimited, no login': 'Gratis, sin límites, sin registro',
  'No sign-up, no payment, no daily limit. Just add your file.': 'Sin registro, sin pagos, sin límite diario. Solo añade tu archivo.',
  'More free tools': 'Más herramientas gratuitas',
  'All free tools': 'Todas las herramientas gratuitas',
  'Advertisement': 'Publicidad',
  [HOUSE_NOTE]: 'Los anuncios mantienen TranscribeVid gratis. Todo funciona sin ellos.',
  'Close: {title}': 'Cerrar: {title}',
  'label:/video-to-text': 'Video a texto',
  'label:/audio-to-text': 'Audio a texto',
};

describe('shared components in another language', () => {
  let i18n: I18nService;

  beforeEach(async () => {
    const data = fakeData({ available: { es: ['/', '/video-to-text', '/audio-to-text', '/tools'] }, dicts: { es: async () => ({ default: ES }) } });
    (data.slugs as Record<string, Record<string, string>>)['es'] = { '/video-to-text': 'video-a-texto', '/audio-to-text': 'audio-a-texto' };
    TestBed.configureTestingModule({
      providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([]), { provide: I18N_DATA, useValue: data }],
    });
    i18n = TestBed.inject(I18nService);
    i18n.apply('es', await i18n.load('es'));
  });

  afterEach(() => {
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
  });

  const text = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

  it('FreeChips: the three promises, their accessible name and the explanation line', () => {
    const f = TestBed.createComponent(FreeChips);
    f.componentRef.setInput('line', true);
    f.detectChanges();
    const el = f.nativeElement as HTMLElement;
    expect(Array.from(el.querySelectorAll('.chips li')).map(text)).toEqual(['Gratis', 'Sin límites', 'Sin registro']);
    expect(el.querySelector('.chips')!.getAttribute('aria-label')).toBe('Gratis, sin límites, sin registro');
    expect(text(el.querySelector('.line'))).toBe('Sin registro, sin pagos, sin límite diario. Solo añade tu archivo.');
  });

  it('RelatedTools: translated heading, names and addresses, only the tools that exist in the language, and "All free tools"', () => {
    @Component({ imports: [RelatedTools], template: `<app-related-tools />` })
    class Host {}
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const el = f.nativeElement as HTMLElement;
    expect(text(el.querySelector('h2'))).toBe('Más herramientas gratuitas');
    expect(Array.from(el.querySelectorAll('a')).map((a) => [text(a), a.getAttribute('href')])).toEqual([
      ['Video a texto', '/es/video-a-texto'],
      ['Audio a texto', '/es/audio-a-texto'],
      ['Todas las herramientas gratuitas', '/es/tools'],
    ]);
  });

  it('ToolLabelPipe: the page name from label:<path>, the English label when there is no entry', () => {
    const pipe = TestBed.runInInjectionContext(() => new ToolLabelPipe());
    expect(pipe.transform({ path: '/video-to-text', label: 'Video to text' })).toBe('Video a texto');
    expect(pipe.transform({ path: '/mp3-to-text', label: 'MP3 to text' })).toBe('MP3 to text');
  });

  it('Toasts: the close button is named in the language (the toast text is shown as given)', () => {
    const toast = TestBed.inject(ToastService);
    toast.success('Guardado', 'Hecho');
    const f = TestBed.createComponent(Toasts);
    f.detectChanges();
    expect((f.nativeElement as HTMLElement).querySelector('.close')!.getAttribute('aria-label')).toBe('Cerrar: Hecho');
  });

  it('AdSlot and AdRail: "Advertisement" and the house note in the language', () => {
    const slot = TestBed.createComponent(AdSlot);
    slot.detectChanges();
    expect(text((slot.nativeElement as HTMLElement).querySelector('.ad-label'))).toBe('Publicidad');
    expect(text((slot.nativeElement as HTMLElement).querySelector('.ad-note'))).toBe('Los anuncios mantienen TranscribeVid gratis. Todo funciona sin ellos.');
    const rail = TestBed.createComponent(AdRail);
    rail.detectChanges();
    expect((rail.nativeElement as HTMLElement).getAttribute('aria-label')).toBe('Publicidad');
  });
});

describe('RelatedTools without a translated "All free tools" page', () => {
  it('leaves the link out in that language instead of leading to an English page under a Spanish label', async () => {
    const data = fakeData({ available: { es: ['/', '/video-to-text'] }, dicts: { es: async () => ({ default: ES }) } });
    TestBed.configureTestingModule({
      providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), provideRouter([]), { provide: I18N_DATA, useValue: data }],
    });
    const i18n = TestBed.inject(I18nService);
    i18n.apply('es', await i18n.load('es'));
    @Component({ imports: [RelatedTools], template: `<app-related-tools />` })
    class Host {}
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const hrefs = Array.from((f.nativeElement as HTMLElement).querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/es/video-a-texto']);
    document.documentElement.setAttribute('lang', 'en');
  });
});
