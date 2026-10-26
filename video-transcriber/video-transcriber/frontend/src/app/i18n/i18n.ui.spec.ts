import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { LanguageSwitcher } from './language-switcher';
import { HINT_DISMISSED_KEY, LANG_KEY, LocaleHintService } from './locale-hint.service';
import { LocaleHintBar } from './locale-hint-bar';
import { I18N_DATA, I18nService } from './i18n.service';
import { RichText, parseRich, plainText } from './rich-text';
import { LocalePathPipe, TPipe } from './t.pipe';
import { ES_DICT, fakeData, setupI18n } from './testing';

const text = (el: Element | null) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

function setLanguages(...tags: string[]) {
  Object.defineProperty(window.navigator, 'languages', { value: tags, configurable: true });
  Object.defineProperty(window.navigator, 'language', { value: tags[0], configurable: true });
}

describe('parseRich (light markup in a translated sentence)', () => {
  it('splits plain text, **bold** and [links](/path)', () => {
    expect(parseRich('See **How it works** or [ask us](/contact) today.')).toEqual([
      { kind: 'text', text: 'See ' },
      { kind: 'bold', text: 'How it works' },
      { kind: 'text', text: ' or ' },
      { kind: 'link', text: 'ask us', href: '/contact', external: false },
      { kind: 'text', text: ' today.' },
    ]);
  });

  it('knows an external link, handles a sentence with no markup, and never treats anything else as HTML', () => {
    expect(parseRich('[Google](https://example.com/a?b=c)')).toEqual([{ kind: 'link', text: 'Google', href: 'https://example.com/a?b=c', external: true }]);
    expect(parseRich('Just words.')).toEqual([{ kind: 'text', text: 'Just words.' }]);
    expect(parseRich('')).toEqual([]);
    expect(parseRich('<script>alert(1)</script>')).toEqual([{ kind: 'text', text: '<script>alert(1)</script>' }]);
    expect(parseRich('2 * 3 * 4 and [not a link]')).toEqual([{ kind: 'text', text: '2 * 3 * 4 and [not a link]' }]);
  });
});

describe('plainText (a translated sentence without its markup)', () => {
  it('keeps the words of bold text and of a link, drops the markup, and leaves plain text alone', () => {
    expect(plainText('See **How it works** or [ask us](/contact) today.')).toBe('See How it works or ask us today.');
    expect(plainText('[Google](https://example.com/a?b=c) and **more**')).toBe('Google and more');
    expect(plainText('Just words.')).toBe('Just words.');
    expect(plainText('')).toBe('');
    expect(plainText('2 * 3 and [not a link]')).toBe('2 * 3 and [not a link]');
  });
});

describe('TPipe, LocalePathPipe and RichText', () => {
  @Component({
    imports: [TPipe, LocalePathPipe, RichText],
    template: `
      <p id="t">{{ 'Hello' | t }}</p>
      <p id="n">{{ 'File {n} of {total}' | t: { n: 2, total: 5 } }}</p>
      <p id="p">{{ '/video-to-text' | lp }}</p>
      <p id="r"><app-rich [text]="'Read **FAQ** or [the FAQ](/faq) or [Google](https://example.com).' | t" /></p>
      <p id="x"><app-rich text="<b>x</b> [bad](javascript:alert(1))" /></p>
    `,
  })
  class Host {}

  let fixture: ComponentFixture<Host>;
  beforeEach(() => {
    setupI18n();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  const q = (id: string) => fixture.nativeElement.querySelector(`#${id}`) as HTMLElement;

  it('English: the text itself, the English path, English links', () => {
    expect(text(q('t'))).toBe('Hello');
    expect(text(q('n'))).toBe('File 2 of 5');
    expect(text(q('p'))).toBe('/video-to-text');
    expect(q('r').querySelector('b')!.textContent).toBe('FAQ');
    expect(q('r').querySelector('a[href="/faq"]')).not.toBeNull();
    const ext = q('r').querySelector('a[href="https://example.com"]')!;
    expect(ext.getAttribute('target')).toBe('_blank');
    expect(ext.getAttribute('rel')).toContain('noopener');
  });

  it('after the language changes the same templates show the translation and the translated address, by themselves', async () => {
    const service = TestBed.inject(I18nService);
    service.apply('es', await service.load('es'));
    fixture.detectChanges();
    expect(text(q('t'))).toBe('Hola');
    expect(text(q('n'))).toBe('Archivo 2 de 5');
    expect(text(q('p'))).toBe('/es/video-a-texto');
    expect(q('r').querySelector('a[href="/es/faq"]')).not.toBeNull(); // a link inside a translated sentence stays in the language
    expect(q('r').querySelector('a[href="https://example.com"]')).not.toBeNull(); // an outside link is left alone
  });

  it('a translated sentence can never inject markup or a javascript: address', () => {
    expect(q('x').querySelector('b')).toBeNull();
    expect(text(q('x'))).toContain('<b>x</b>');
    const bad = q('x').querySelector('a');
    expect(bad?.getAttribute('href') ?? '').not.toMatch(/^javascript:/i);
  });
});

describe('LanguageSwitcher', () => {
  async function render(variant: 'menu' | 'list', url: string, d = fakeData()) {
    setupI18n(d);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    const fixture = TestBed.createComponent(LanguageSwitcher);
    fixture.componentRef.setInput('variant', variant);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement, harness };
  }

  beforeEach(() => localStorage.clear());

  it('list: one real link per language that has pages, to the same page there (or that language\'s home page), the current one marked', async () => {
    const { el } = await render('list', '/es/video-a-texto');
    const links = Array.from(el.querySelectorAll('nav.lang-list a'));
    expect(links.map((a) => text(a))).toEqual(['English', 'Español', 'Deutsch']);
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/video-to-text', '/es/video-a-texto', '/de']);
    expect(links.map((a) => a.getAttribute('hreflang'))).toEqual(['en', 'es', 'de']);
    expect(links.map((a) => a.getAttribute('lang'))).toEqual(['en', 'es', 'de']);
    expect(links.map((a) => a.getAttribute('aria-current'))).toEqual([null, 'true', null]);
    expect(el.querySelector('nav')!.getAttribute('aria-label')).toBe('Idioma'); // a Spanish page: the label is Spanish too
  });

  it('menu: a button with the current language code and the same links', async () => {
    const { el } = await render('menu', '/faq');
    expect(text(el.querySelector('summary .cur'))).toBe('EN');
    expect(el.querySelector('summary')!.getAttribute('aria-label')).toBe('Language');
    expect(Array.from(el.querySelectorAll('ul.lang-pop a')).map((a) => a.getAttribute('href'))).toEqual(['/faq', '/es/faq', '/de/faq']);
  });

  it('follows the page: after a navigation the links point at the new page', async () => {
    const { fixture, el, harness } = await render('list', '/video-to-text');
    expect(Array.from(el.querySelectorAll('a')).map((a) => a.getAttribute('href'))).toEqual(['/video-to-text', '/es/video-a-texto', '/de']);
    await harness.navigateByUrl('/faq');
    fixture.detectChanges();
    expect(Array.from(el.querySelectorAll('a')).map((a) => a.getAttribute('href'))).toEqual(['/faq', '/es/faq', '/de/faq']);
  });

  it('choosing a language saves the choice, and closes the menu', async () => {
    const { fixture, el } = await render('menu', '/faq');
    const details = el.querySelector('details') as HTMLDetailsElement;
    details.open = true;
    (el.querySelector('ul.lang-pop a[hreflang="es"]') as HTMLAnchorElement).click();
    fixture.detectChanges();
    expect(localStorage.getItem(LANG_KEY)).toBe('es');
    expect(details.open).toBe(false);
  });

  it('shows nothing while English is the only language', async () => {
    const { el } = await render('list', '/faq', fakeData({ available: {} }));
    expect(el.querySelector('a')).toBeNull();
    expect(el.querySelector('details')).toBeNull();
  });

  it('translates its own label', async () => {
    const { fixture, el } = await render('list', '/es/faq');
    fixture.detectChanges();
    expect(el.querySelector('nav')!.getAttribute('aria-label')).toBe('Idioma');
    expect(ES_DICT['Language']).toBe('Idioma');
  });
});

describe('LocaleHintService and the "also available" bar', () => {
  const realLanguages = Object.getOwnPropertyDescriptor(window.navigator, 'languages');
  const realLanguage = Object.getOwnPropertyDescriptor(window.navigator, 'language');

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    setLanguages('en-US', 'en');
  });
  afterEach(() => {
    for (const [key, d] of [['languages', realLanguages], ['language', realLanguage]] as const) {
      if (d) Object.defineProperty(window.navigator, key, d);
      else delete (window.navigator as unknown as Record<string, unknown>)[key];
    }
  });

  async function start(d = fakeData()) {
    const { i18n } = setupI18n(d);
    const hint = TestBed.inject(LocaleHintService);
    hint.start();
    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);
    return { i18n, hint, harness, router };
  }

  it('first visit to the English home page with a Spanish browser: replaced by the Spanish home page (no history entry)', async () => {
    setLanguages('es-MX', 'es', 'en');
    const { i18n, router, harness } = await start();
    await harness.navigateByUrl('/');
    await vi.waitFor(() => expect(router.url).toBe('/es'));
    expect(i18n.locale()).toBe('es');
  });

  it('a deep English page is never redirected: a bar offers the same page in the visitor\'s language', async () => {
    setLanguages('es-ES');
    const { hint, router, harness } = await start();
    await harness.navigateByUrl('/video-to-text');
    expect(router.url).toBe('/video-to-text');
    expect(hint.suggestion()).toEqual({ locale: 'es', href: '/es/video-a-texto' });
  });

  it('offers nothing when that exact page has no translation in the visitor\'s language', async () => {
    setLanguages('de-DE');
    const { hint, harness } = await start();
    await harness.navigateByUrl('/video-to-text');
    expect(hint.suggestion()).toBeNull();
  });

  it('a visitor whose browser asks for English, on a Spanish page, is offered the English page', async () => {
    setLanguages('en-GB');
    const { hint, harness } = await start();
    await harness.navigateByUrl('/es/faq');
    expect(hint.suggestion()).toEqual({ locale: 'en', href: '/faq' });
  });

  it('a browser language the site does not offer changes nothing; the first offered one wins', async () => {
    setLanguages('zh-CN', 'sv');
    const a = await start();
    await a.harness.navigateByUrl('/');
    expect(a.router.url).toBe('/');
    expect(a.hint.suggestion()).toBeNull();
    TestBed.resetTestingModule();
    setLanguages('fr-FR', 'de-DE', 'es'); // French has no pages here: German is the first that does
    const b = await start();
    await b.harness.navigateByUrl('/faq');
    expect(b.hint.suggestion()).toEqual({ locale: 'de', href: '/de/faq' });
  });

  it('a saved choice beats the browser: English chosen means no redirect and no bar; Spanish chosen redirects the English home', async () => {
    setLanguages('es-MX');
    localStorage.setItem(LANG_KEY, 'en');
    const a = await start();
    await a.harness.navigateByUrl('/');
    expect(a.router.url).toBe('/');
    expect(a.hint.suggestion()).toBeNull();
    TestBed.resetTestingModule();
    setLanguages('en-US');
    localStorage.setItem(LANG_KEY, 'es');
    const b = await start();
    await b.harness.navigateByUrl('/');
    await vi.waitFor(() => expect(b.router.url).toBe('/es'));
  });

  it('remember() saves the choice and clears the bar; dismiss() keeps it away for the visit', async () => {
    setLanguages('es');
    const { hint, harness } = await start();
    await harness.navigateByUrl('/faq');
    expect(hint.suggestion()).not.toBeNull();
    hint.dismiss();
    expect(hint.suggestion()).toBeNull();
    expect(sessionStorage.getItem(HINT_DISMISSED_KEY)).toBe('1');
    await harness.navigateByUrl('/video-to-text');
    expect(hint.suggestion()).toBeNull();
    hint.remember('es');
    expect(localStorage.getItem(LANG_KEY)).toBe('es');
    expect(hint.preferred()).toBe('es');
  });

  it('does nothing at all in an edition without languages, and never redirects twice', async () => {
    setLanguages('es');
    const a = await start(fakeData({ enabled: false }));
    await a.harness.navigateByUrl('/');
    expect(a.router.url).toBe('/');
    expect(a.hint.suggestion()).toBeNull();
    TestBed.resetTestingModule();
    const b = await start();
    await b.harness.navigateByUrl('/');
    await vi.waitFor(() => expect(b.router.url).toBe('/es'));
    await b.harness.navigateByUrl('/'); // the visitor goes back to English on purpose: not redirected again
    expect(b.router.url).toBe('/');
  });

  it('storage that throws (private mode) is survived', async () => {
    setLanguages('es');
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const { hint, harness } = await start();
    await harness.navigateByUrl('/faq');
    expect(hint.suggestion()).not.toBeNull();
    spy.mockRestore();
  });

  describe('the bar', () => {
    it('is written in the visitor\'s language, with the language and direction set on it, a link to the page there and a close button', async () => {
      setLanguages('es');
      const { hint, harness } = await start();
      await harness.navigateByUrl('/video-to-text');
      const fixture = TestBed.createComponent(LocaleHintBar);
      fixture.detectChanges();
      const bar = fixture.nativeElement.querySelector('aside') as HTMLElement;
      expect(bar.getAttribute('lang')).toBe('es');
      expect(bar.getAttribute('dir')).toBe('ltr');
      expect(text(bar.querySelector('.msg'))).toBe('Esta página también está disponible en español.');
      const go = bar.querySelector('a.go')!;
      expect(text(go)).toBe('Ver en español');
      expect(go.getAttribute('href')).toBe('/es/video-a-texto');
      (bar.querySelector('button.x') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('aside')).toBeNull();
      expect(hint.suggestion()).toBeNull();
    });

    it('shows nothing without a suggestion, and following the link remembers the choice', async () => {
      setLanguages('es');
      const { harness } = await start();
      await harness.navigateByUrl('/faq');
      const fixture = TestBed.createComponent(LocaleHintBar);
      fixture.detectChanges();
      (fixture.nativeElement.querySelector('a.go') as HTMLAnchorElement).click();
      expect(localStorage.getItem(LANG_KEY)).toBe('es');
      TestBed.resetTestingModule();
      setLanguages('en');
      await start();
      const empty = TestBed.createComponent(LocaleHintBar);
      empty.detectChanges();
      expect(empty.nativeElement.querySelector('aside')).toBeNull();
    });
  });
});

it('the I18N_DATA default is this edition\'s real data (no languages unless the edition asks for them)', () => {
  const real = TestBed.inject(I18N_DATA);
  expect(real.enabled).toBe(false); // unit tests run with the self-hosted environment
  expect(real.available).toBeDefined();
  expect(real.slugs.en).toEqual({});
});
