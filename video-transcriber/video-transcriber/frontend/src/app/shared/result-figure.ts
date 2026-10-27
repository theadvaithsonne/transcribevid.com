import { Component, computed, inject } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { TPipe } from '../i18n/t.pipe';

/** Size of the screenshots in public/img (the width and height attributes keep the page from shifting while one loads). */
export const RESULT_IMAGE = { width: 1280, height: 660 } as const;

/**
 * A real screenshot of a finished transcript: media player, search box and the text in lines with timestamps, taken from the
 * app itself with a sample recording, once per language (public/img/transcript-<language>.webp, about 45 KB each). It sits
 * next to the text about download formats on the tool pages, loads lazily (it is below the first screen) and has its own
 * words for people who cannot see it (Google's guidance for images: sharp, near the text that describes them, with alt text).
 */
@Component({
  selector: 'app-result-figure',
  imports: [TPipe],
  template: `
    <figure class="result-fig">
      <img
        [src]="src()"
        [attr.width]="size.width"
        [attr.height]="size.height"
        [alt]="'A finished transcript: a media player next to the text in short lines, each with a timestamp.' | t"
        loading="lazy"
        decoding="async"
      />
      <figcaption>{{ 'A finished transcript. Every line has a timestamp, and Export saves it as SRT, VTT, TXT, PDF and more.' | t }}</figcaption>
    </figure>
  `,
  styles: `
    :host {
      display: block;
    }
    .result-fig {
      margin: 40px 0 0;
      max-width: 960px;
    }
    img {
      display: block;
      width: 100%;
      height: auto;
      border: 1px solid var(--line);
      border-radius: var(--r-md);
    }
    figcaption {
      margin-top: 12px;
      font-size: var(--fs-sm);
      line-height: 1.5;
      color: var(--muted);
    }
    @media print {
      :host {
        display: none;
      }
    }
  `,
})
export class ResultFigure {
  private i18n = inject(I18nService);
  readonly size = RESULT_IMAGE;
  /** the screenshot taken in the page's language (every language the site has one for has its own file) */
  readonly src = computed(() => `/img/transcript-${this.i18n.locale()}.webp`);
}
