import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
import { RichText } from '../../i18n/rich-text';
import { LocalePathPipe, TPipe } from '../../i18n/t.pipe';
import { GUIDES, fmtLongDate } from './guides.list';

/**
 * "Guides": the list of the articles (/guides). Plain links with the question each one answers; no ads (a page of
 * links has too little text of its own to carry them).
 */
@Component({
  selector: 'app-guides-index',
  imports: [RouterLink, TPipe, LocalePathPipe, RichText],
  template: `
    <div class="page-doc">
      <article class="doc">
        <nav class="crumbs" [attr.aria-label]="'Breadcrumb' | t">
          <a [routerLink]="'/' | lp">{{ 'Home' | t }}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ 'Guides' | t }}</span>
        </nav>
        <h1 class="page-title">{{ 'Guides: transcripts and subtitles' | t }}</h1>
        <p class="lede">
          {{
            'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.'
              | t
          }}
        </p>
        <ul class="guides">
          @for (g of guides(); track g.path) {
            <li>
              <h2>
                <a [routerLink]="g.path | lp">{{ g.label }}</a>
              </h2>
              <p>{{ g.description }}</p>
              <p class="when">{{ 'Updated {date}' | t: { date: g.date } }}</p>
            </li>
          }
        </ul>
        <p><app-rich [text]="'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).' | t" /></p>
      </article>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .doc {
      max-width: 820px;
      margin-inline: auto;
      font-size: var(--fs-lg);
      line-height: 1.7;
      color: var(--text);
      a:not(.btn) {
        color: var(--accent);
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 2px;
      }
      a:focus-visible {
        outline: 2px solid var(--focus-ring);
        outline-offset: 3px;
      }
    }
    .crumbs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0 10px;
      margin-bottom: 8px;
      font-size: var(--fs-sm);
      color: var(--muted);
      a {
        display: inline-flex;
        align-items: center;
        min-width: 44px;
        min-height: 44px;
      }
    }
    .page-title {
      font-size: clamp(32px, 3.2vw, 48px);
      line-height: 1.15;
    }
    .lede {
      margin: 16px 0 32px;
      padding: 20px 24px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--r-lg);
      color: var(--text-strong);
    }
    .guides {
      margin: 0 0 32px;
      padding: 0;
      list-style: none;
      li {
        padding: 20px 0;
        & + li {
          border-top: 1px solid var(--line);
        }
      }
      h2 {
        margin: 0 0 6px;
        font-size: clamp(22px, 1.8vw, 28px);
        font-weight: 750;
        line-height: 1.25;
      }
      p {
        margin: 0;
      }
      .when {
        margin-top: 6px;
        font-size: var(--fs-sm);
        color: var(--muted);
      }
    }
  `,
})
export class GuidesIndexPage {
  private i18n = inject(I18nService);

  /** The guides that exist in the page's language, with their name, description and date in that language (English where the dictionary has no entry). */
  readonly guides = computed(() => {
    const locale = this.i18n.locale();
    const meta = (kind: 'label' | 'description', path: string, english: string) => {
      const key = `${kind}:${path}`;
      const hit = this.i18n.t(key);
      return hit === key ? english : hit;
    };
    return GUIDES.filter((g) => this.i18n.isAvailable(locale, g.path)).map((g) => ({
      path: g.path,
      label: meta('label', g.path, g.label),
      description: meta('description', g.path, g.description),
      date: fmtLongDate(g.updated, locale),
    }));
  });
}
