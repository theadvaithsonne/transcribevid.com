import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18N_DATA, I18nService } from '../i18n/i18n.service';
import { fakeData } from '../i18n/testing';
import { RESULT_IMAGE, ResultFigure } from './result-figure';

@Component({ imports: [ResultFigure], template: `<app-result-figure />` })
class Host {}

const ES: Record<string, string> = {
  'A finished transcript: a media player next to the text in short lines, each with a timestamp.':
    'Una transcripción terminada: un reproductor junto al texto en líneas cortas, cada una con su marca de tiempo.',
  'A finished transcript. Every line has a timestamp, and Export saves it as SRT, VTT, TXT, PDF and more.':
    'Una transcripción terminada. Cada línea tiene su marca de tiempo y Exportar la guarda como SRT, VTT, TXT, PDF y más.',
};

describe('ResultFigure', () => {
  let fixture: ComponentFixture<Host>;
  const q = (sel: string) => fixture.nativeElement.querySelector(sel) as HTMLElement | null;

  beforeEach(() => {
    const data = fakeData({ available: { es: ['/'] }, dicts: { es: async () => ({ default: ES }) } });
    TestBed.configureTestingModule({ providers: [{ provide: I18N_DATA, useValue: data }] });
    fixture = TestBed.createComponent(Host);
  });

  it('is a figure with a lazy, sized screenshot, alt text and a visible caption (English)', () => {
    fixture.detectChanges();
    const img = q('figure img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('/img/transcript-en.webp');
    expect(img.getAttribute('width')).toBe(String(RESULT_IMAGE.width));
    expect(img.getAttribute('height')).toBe(String(RESULT_IMAGE.height));
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('alt')).toBe('A finished transcript: a media player next to the text in short lines, each with a timestamp.');
    expect(q('figcaption')!.textContent).toContain('Every line has a timestamp');
  });

  it('shows the screenshot taken in the language of the page, with its alt text and caption in that language', async () => {
    const i18n = TestBed.inject(I18nService);
    i18n.apply('es', await i18n.load('es'));
    fixture.detectChanges();
    expect((q('figure img') as HTMLImageElement).getAttribute('src')).toBe('/img/transcript-es.webp');
    expect(q('figure img')!.getAttribute('alt')).toBe(ES['A finished transcript: a media player next to the text in short lines, each with a timestamp.']);
    expect(q('figcaption')!.textContent).toContain('Exportar la guarda como SRT');
  });
});
