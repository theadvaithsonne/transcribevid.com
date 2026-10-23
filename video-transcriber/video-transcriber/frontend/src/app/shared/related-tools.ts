import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOOL_PAGES } from '../features/tool-pages/tool-pages.list';

/**
 * "More free tools": plain links to the keyword pages (video to text, audio to text, ...). Drop it at the bottom of a
 * page: `<app-related-tools />`, or `<app-related-tools current="/mp3-to-text" />` to leave the current page out.
 * Needs no data from the server, so it renders for crawlers too. Quiet on purpose: a thin line above, a small heading
 * and a row of underlined links (no boxes), so it never competes with the page's main button.
 */
@Component({
  selector: 'app-related-tools',
  imports: [RouterLink],
  template: `
    <section class="related" aria-labelledby="related-tools-title">
      <h2 id="related-tools-title">{{ heading() }}</h2>
      <ul>
        @for (t of tools(); track t.path) {
          <li>
            <a [routerLink]="t.path">{{ t.label }}</a>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .related {
      padding-top: 28px;
      border-top: 1px solid var(--line);
    }
    h2 {
      margin: 0 0 8px;
      font-size: var(--fs-h3);
      font-weight: 750;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0 32px;
    }
    a {
      display: inline-flex;
      align-items: center;
      min-height: 48px;
      font-size: var(--fs-base);
      font-weight: 600;
      line-height: 1.3;
      color: var(--accent);
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 2px;
    }
    a:hover {
      color: var(--accent-hover);
      text-decoration-thickness: 3px;
    }
    a:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 3px;
    }
    @media (max-width: 560px) {
      ul {
        flex-direction: column;
      }
    }
  `,
})
export class RelatedTools {
  /** the page the visitor is on (it is left out of the list), e.g. "/mp3-to-text" */
  readonly current = input('');
  readonly heading = input('More free tools');

  readonly tools = computed(() => {
    const here = this.current().replace(/^\/?/, '/');
    return TOOL_PAGES.filter((t) => t.path !== here);
  });
}
