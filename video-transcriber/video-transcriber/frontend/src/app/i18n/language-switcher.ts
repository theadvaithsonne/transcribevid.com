import { Component, ElementRef, computed, inject, input, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { I18nService } from './i18n.service';
import { LOCALES, Locale } from './locales';
import { LocaleHintService } from './locale-hint.service';
import { TPipe } from './t.pipe';

/**
 * The language menu. `menu` (header, mobile sheet): a button that opens the list; `list` (footer): the same links in a
 * row. Every entry is a real link (`href`, `hreflang`, `lang`) to the same page in that language, or that language's
 * home page when the page has no translation there, so crawlers can follow them and the keyboard works without a script.
 * Only languages that have pages are listed, and nothing is shown while English is the only one.
 */
@Component({
  selector: 'app-language-switcher',
  imports: [RouterLink, TPipe],
  template: `
    @if (items().length > 1) {
      @if (variant() === 'menu') {
        <details class="lang" #menu>
          <summary [attr.aria-label]="'Language' | t" [attr.title]="'Language' | t">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3z" />
            </svg>
            <span class="cur">{{ current().code.toUpperCase() }}</span>
          </summary>
          <ul class="lang-pop">
            @for (l of items(); track l.code) {
              <li>
                <a [routerLink]="l.href" [attr.hreflang]="l.code" [attr.lang]="l.code" [attr.aria-current]="l.current ? 'true' : null" (click)="choose(l.code)">{{ l.name }}</a>
              </li>
            }
          </ul>
        </details>
      } @else {
        <nav class="lang-list" [attr.aria-label]="'Language' | t">
          <span class="lang-label">{{ 'Language' | t }}:</span>
          @for (l of items(); track l.code) {
            <a [routerLink]="l.href" [attr.hreflang]="l.code" [attr.lang]="l.code" [attr.aria-current]="l.current ? 'true' : null" (click)="choose(l.code)">{{ l.name }}</a>
          }
        </nav>
      }
    }
  `,
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  readonly variant = input<'menu' | 'list'>('list');

  private i18n = inject(I18nService);
  private router = inject(Router);
  private hint = inject(LocaleHintService);
  private menu = viewChild<ElementRef<HTMLDetailsElement>>('menu');
  private url = signal(this.router.url);

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => this.url.set(e.urlAfterRedirects));
  }

  readonly current = computed(() => LOCALES[this.i18n.locale()]);
  readonly items = computed(() => {
    const url = this.url();
    const here = this.i18n.locale();
    return this.i18n.languages().map((code) => ({
      code,
      name: LOCALES[code].name,
      current: code === here,
      href: this.i18n.switchPath(code, url),
    }));
  });

  choose(code: Locale) {
    this.hint.remember(code);
    const el = this.menu()?.nativeElement;
    if (el) el.open = false;
  }
}
