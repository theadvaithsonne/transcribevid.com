import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleHintService } from './locale-hint.service';
import { LOCALES } from './locales';

/**
 * "This page is also available in <your language>": a thin bar under the header, written in the visitor's own language
 * (so they can read it), with the same page in that language one click away and a close button. Appears only in the browser
 * and only when LocaleHintService has a suggestion.
 */
@Component({
  selector: 'app-locale-hint',
  imports: [RouterLink],
  template: `
    @if (hint.suggestion(); as s) {
      <aside class="bar" role="region" [attr.lang]="s.locale" [attr.dir]="info(s.locale).dir" [attr.aria-label]="info(s.locale).hint.message">
        <span class="msg">{{ info(s.locale).hint.message }}</span>
        <a class="go" [routerLink]="s.href" [attr.hreflang]="s.locale" (click)="hint.remember(s.locale)">{{ info(s.locale).hint.action }}</a>
        <button type="button" class="x" (click)="hint.dismiss()">{{ info(s.locale).hint.dismiss }}</button>
      </aside>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 4px 18px;
      padding: 8px 16px;
      background: var(--accent-soft);
      border-bottom: 1px solid var(--line);
      color: var(--text-strong);
      font-size: var(--fs-sm);
    }
    .go {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      font-weight: 700;
      color: var(--accent);
      text-decoration: underline;
      text-underline-offset: 3px;
      text-decoration-thickness: 2px;
    }
    .x {
      min-height: 44px;
      padding: 0 12px;
      border: 0;
      background: none;
      font: inherit;
      color: var(--text);
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .go:focus-visible,
    .x:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 2px;
    }
  `,
})
export class LocaleHintBar {
  hint = inject(LocaleHintService);
  info = (code: keyof typeof LOCALES) => LOCALES[code];
}
