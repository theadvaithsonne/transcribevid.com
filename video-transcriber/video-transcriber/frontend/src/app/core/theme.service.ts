import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';
import { IS_BROWSER } from './platform';

export type Theme = 'light' | 'dark';
const KEY = 'vt-theme';
/** the colour of the browser's own bar on phones: the page background of each theme */
export const THEME_COLOR: Record<Theme, string> = { light: '#fff7ed', dark: '#1f1d1b' };

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private doc = inject(DOCUMENT);
  private browser = inject(IS_BROWSER);
  readonly theme = signal<Theme>(this.initial());

  constructor() {
    effect(() => {
      // the prerendered HTML carries no theme attribute: light is the stylesheet's default, and the browser applies a saved choice
      if (!this.browser) return;
      this.doc.documentElement.dataset['theme'] = this.theme();
      this.doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[this.theme()]);
      try {
        localStorage.setItem(KEY, this.theme());
      } catch {
        /* private mode: ignore */
      }
    });
  }

  toggle() {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private initial(): Theme {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      /* ignore */
    }
    return 'light'; // light is the default; the visitor can switch, and the choice is remembered in this browser
  }
}
