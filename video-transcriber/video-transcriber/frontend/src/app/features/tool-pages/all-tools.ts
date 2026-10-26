import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
import { LocalePathPipe, TPipe } from '../../i18n/t.pipe';
import { GUIDES } from '../guides/guides.list';
import { TOOL_GROUPS, TOOL_PAGES } from './tool-pages.list';

/**
 * "All free tools" (/tools): every keyword page, grouped, each with the sentence that describes it. It is what keeps the
 * long tail of pages one click from the home page, for visitors and for crawlers. No ads: a page of links has too
 * little text of its own to carry them.
 */
@Component({
  selector: 'app-all-tools',
  imports: [RouterLink, TPipe, LocalePathPipe],
  template: `
    <div class="page-doc">
      <article class="doc">
        <nav class="crumbs" [attr.aria-label]="'Breadcrumb' | t">
          <a [routerLink]="'/' | lp">{{ 'Home' | t }}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ 'All free tools' | t }}</span>
        </nav>
        <h1 class="page-title">{{ 'All free video and audio to text tools' | t }}</h1>
        <p class="lede">
          {{
            'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.'
              | t
          }}
        </p>
        @for (g of groups(); track g.id) {
          <section [attr.aria-labelledby]="'grp-' + g.id">
            <h2 [id]="'grp-' + g.id">{{ g.title | t }}</h2>
            <p class="intro">{{ g.intro | t }}</p>
            <ul class="tools">
              @for (t of g.pages; track t.path) {
                <li>
                  <a [routerLink]="t.path | lp">{{ t.label }}</a>
                  <span>{{ t.description }}</span>
                </li>
              }
            </ul>
          </section>
        }
        @if (guides().length) {
          <section aria-labelledby="grp-guides">
            <h2 id="grp-guides">{{ 'Guides' | t }}</h2>
            <p class="intro">{{ 'Longer answers: formats, subtitles, accuracy and privacy.' | t }}</p>
            <ul class="tools">
              @for (g of guides(); track g.path) {
                <li>
                  <a [routerLink]="g.path | lp">{{ g.label }}</a>
                  <span>{{ g.description }}</span>
                </li>
              }
            </ul>
          </section>
        }
      </article>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .doc {
      max-width: 980px;
      margin-inline: auto;
      font-size: var(--fs-lg);
      line-height: 1.65;
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
      h2 {
        margin: 48px 0 8px;
        font-size: clamp(24px, 2vw, 30px);
        font-weight: 750;
        line-height: 1.25;
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
      margin: 16px 0 8px;
      padding: 20px 24px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--r-lg);
      color: var(--text-strong);
    }
    .intro {
      margin: 0 0 8px;
      color: var(--muted);
      font-size: var(--fs-base);
    }
    .tools {
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: var(--fs-base);
      li {
        padding: 12px 0;
        & + li {
          border-top: 1px solid var(--line);
        }
      }
      a {
        display: inline-block;
        margin-right: 8px;
        font-weight: 700;
      }
    }
  `,
})
export class AllToolsPage {
  private i18n = inject(I18nService);

  /** A name or description in the page's language: the dictionary's `label:<path>` / `description:<path>`, else the English text. */
  private meta(kind: 'label' | 'description', path: string, english: string): string {
    const key = `${kind}:${path}`;
    const hit = this.i18n.t(key);
    return hit === key ? english : hit;
  }

  /** The groups with the pages that exist in the page's language (all of them in English); a group without pages is left out. */
  readonly groups = computed(() => {
    const locale = this.i18n.locale();
    return TOOL_GROUPS.map((g) => ({
      ...g,
      pages: TOOL_PAGES.filter((t) => t.group === g.id && this.i18n.isAvailable(locale, t.path)).map((t) => ({
        path: t.path,
        label: this.meta('label', t.path, t.label),
        description: this.meta('description', t.path, t.description),
      })),
    })).filter((g) => g.pages.length);
  });

  readonly guides = computed(() => {
    const locale = this.i18n.locale();
    return GUIDES.filter((g) => this.i18n.isAvailable(locale, g.path)).map((g) => ({
      path: g.path,
      label: this.meta('label', g.path, g.label),
      description: this.meta('description', g.path, g.description),
    }));
  });
}
