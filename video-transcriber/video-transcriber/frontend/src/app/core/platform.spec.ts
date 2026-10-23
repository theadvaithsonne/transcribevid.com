import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ASSUME_PUBLIC, IS_BROWSER, PRERENDERED_ATTR } from './platform';

describe('platform tokens', () => {
  afterEach(() => document.documentElement.removeAttribute(PRERENDERED_ATTR));

  describe('IS_BROWSER', () => {
    it("is true in the visitor's browser (and in these tests)", () => {
      expect(TestBed.inject(IS_BROWSER)).toBe(true);
    });

    it('is true for the browser platform and false while a page is prerendered on the server', () => {
      TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
      expect(TestBed.inject(IS_BROWSER)).toBe(false);
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'browser' }] });
      expect(TestBed.inject(IS_BROWSER)).toBe(true);
    });

    it('can be switched by a test (that is what the token is for)', () => {
      TestBed.configureTestingModule({ providers: [{ provide: IS_BROWSER, useValue: false }] });
      expect(TestBed.inject(IS_BROWSER)).toBe(false);
    });
  });

  describe('ASSUME_PUBLIC', () => {
    it('is false in a browser page that was not prerendered (it makes no claim until the server answers)', () => {
      expect(TestBed.inject(ASSUME_PUBLIC)).toBe(false);
    });

    it('is true in a browser page that came from prerendered HTML (the mark the prerender puts on <html>)', () => {
      document.documentElement.setAttribute(PRERENDERED_ATTR, '');
      expect(TestBed.inject(ASSUME_PUBLIC)).toBe(true);
    });

    it('is always true while prerendering on the server', () => {
      TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
      expect(TestBed.inject(ASSUME_PUBLIC)).toBe(true);
    });

    it('is false when the document cannot be read (never throws)', () => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: DOCUMENT,
            useValue: {
              get documentElement(): never {
                throw new Error('no document');
              },
            },
          },
        ],
      });
      expect(TestBed.inject(ASSUME_PUBLIC)).toBe(false);
    });

    it('uses the documented attribute name', () => {
      expect(PRERENDERED_ATTR).toBe('data-prerendered');
    });
  });
});
