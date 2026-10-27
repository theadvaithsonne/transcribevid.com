import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { IS_BROWSER } from '../core/platform';
import { I18nService } from './i18n.service';
import { DEFAULT_LOCALE, Locale, isLocale, localeFromTag } from './locales';

/** The visitor's saved language choice (made with the language menu). */
export const LANG_KEY = 'vt-lang';
/** "Not now": the bar stays away for the rest of this visit. */
export const HINT_DISMISSED_KEY = 'vt-lang-hint-dismissed';

export interface LocaleSuggestion {
  locale: Locale;
  /** the same page in that language */
  href: string;
}

/**
 * Gets a visitor to their own language without ever forcing it on a search engine.
 *
 *  - Only in the browser, and only from what the visitor's browser says it prefers (`navigator.languages`) or the choice
 *    they saved with the language menu. Never from the IP address. Googlebot sends no such preference, so it never moves.
 *  - A guess is never acted on: when the browser language differs from the page (the bare English home page included), a small
 *    bar, written in the preferred language, offers the same page there (only when that page exists in that language). Google
 *    advises against redirecting by a guessed language.
 *  - Only a language the visitor chose themselves with the language menu (saved in this browser) moves them: landing on the
 *    English home page "/" with a saved choice of another language replaces it (no history entry) by that language's home
 *    page. Deep English pages (search results) are left alone.
 */
@Injectable({ providedIn: 'root' })
export class LocaleHintService {
  private i18n = inject(I18nService);
  private router = inject(Router);
  private browser = inject(IS_BROWSER);

  readonly suggestion = signal<LocaleSuggestion | null>(null);
  private redirected = false;

  start() {
    if (!this.browser || !this.i18n.enabled) return;
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => this.evaluate(e.urlAfterRedirects));
  }

  /** The language the visitor chose with the language menu, when this site still has it. */
  savedChoice(): Locale | null {
    const saved = this.read(localStorage, LANG_KEY);
    return isLocale(saved) && (saved === DEFAULT_LOCALE || this.i18n.available(saved).length) ? saved : null;
  }

  /** The language the visitor wants: their saved choice, else the first of their browser languages that the site offers (English counts). */
  preferred(): Locale | null {
    const saved = this.savedChoice();
    if (saved) return saved;
    let tags: readonly string[] = [];
    try {
      tags = navigator.languages?.length ? navigator.languages : [navigator.language];
    } catch {
      /* no navigator */
    }
    for (const tag of tags) {
      const locale = localeFromTag(tag);
      if (locale === DEFAULT_LOCALE) return locale;
      if (locale && this.i18n.available(locale).length) return locale;
    }
    return null;
  }

  /** The visitor chose a language with the menu: remember it, and stop suggesting. */
  remember(locale: Locale) {
    this.write(localStorage, LANG_KEY, locale);
    this.suggestion.set(null);
  }

  /** "Close" on the bar. */
  dismiss() {
    this.write(sessionStorage, HINT_DISMISSED_KEY, '1');
    this.suggestion.set(null);
  }

  private evaluate(url: string) {
    const current = this.i18n.locale();
    const wanted = this.preferred();
    if (!wanted || wanted === current) return this.suggestion.set(null);

    const bareHome = url.split(/[?#]/)[0] === '/';
    // only a choice the visitor made themselves moves them; a guess from the browser language gets the bar below
    if (bareHome && current === DEFAULT_LOCALE && !this.redirected && this.savedChoice() === wanted && this.i18n.isAvailable(wanted, '/')) {
      this.redirected = true;
      this.suggestion.set(null);
      void this.router.navigateByUrl(this.i18n.path('/', wanted), { replaceUrl: true });
      return;
    }
    const page = this.i18n.page();
    if (this.read(sessionStorage, HINT_DISMISSED_KEY) || !this.i18n.isAvailable(wanted, page)) return this.suggestion.set(null);
    this.suggestion.set({ locale: wanted, href: this.i18n.path(page, wanted) });
  }

  private read(store: Storage, key: string): string | null {
    try {
      return store.getItem(key);
    } catch {
      return null;
    }
  }

  private write(store: Storage, key: string, value: string) {
    try {
      store.setItem(key, value);
    } catch {
      /* private mode: the choice just is not remembered */
    }
  }
}
