import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOOL_GROUPS, TOOL_PAGES, ToolPageLink } from '../features/tool-pages/tool-pages.list';

/**
 * "More free tools": plain links to the keyword pages (video to text, audio to text, ...). Drop it at the bottom of a
 * page: `<app-related-tools />` lists every page under small group headings (file types, Hindi and Hinglish, uses,
 * alternatives), so the home page, FAQ and how-it-works link the whole set. `[paths]="[...]"` lists just those pages
 * instead (a tool page's own related links), and `current="/mp3-to-text"` leaves the current page out.
 * Needs no data from the server, so it renders for crawlers too. Quiet on purpose: a thin line above, a small heading
 * and rows of underlined links (no boxes), so it never competes with the page's main button.
 */
@Component({
  selector: 'app-related-tools',
  imports: [RouterLink],
  template: `
    <section class="related" aria-labelledby="related-tools-title">
      <h2 id="related-tools-title">{{ heading() }}</h2>
      @for (g of groups(); track g.id) {
        @if (g.heading) {
          <h3>{{ g.heading }}</h3>
        }
        <ul>
          @for (t of g.tools; track t.path) {
            <li>
              <a [routerLink]="t.path">{{ t.label }}</a>
            </li>
          }
        </ul>
      }
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
    h3 {
      margin: 12px 0 0;
      font-size: var(--fs-base);
      font-weight: 650;
      color: var(--muted);
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
  /** only these pages, in this order (unknown paths are skipped); empty = every page, grouped */
  readonly paths = input<readonly string[]>([]);

  readonly tools = computed<ToolPageLink[]>(() => {
    const here = this.current().replace(/^\/?/, '/');
    const only = this.paths();
    const picked = only.length ? only.map((p) => TOOL_PAGES.find((t) => t.path === p)).filter((t): t is ToolPageLink => !!t) : TOOL_PAGES;
    return picked.filter((t) => t.path !== here);
  });

  /** one untitled list for a chosen set; the group headings for the full list */
  readonly groups = computed(() => {
    const tools = this.tools();
    if (this.paths().length) return [{ id: 'picked', heading: '', tools }];
    return TOOL_GROUPS.map((g) => ({ id: g.id, heading: g.heading, tools: tools.filter((t) => t.group === g.id) })).filter((g) => g.tools.length);
  });
}
