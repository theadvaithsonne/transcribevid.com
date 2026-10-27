import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOOL_GROUPS, TOOL_PAGES, ToolPageLink } from '../features/tool-pages/tool-pages.list';
import { I18nService } from '../i18n/i18n.service';
import { _t } from '../i18n/mark';
import { LocalePathPipe, TPipe } from '../i18n/t.pipe';
import { ToolLabelPipe } from './tool-label';

/**
 * The links on a tool page: the four pages after it in its group (wrapping round, so every page is the neighbour of four
 * others and none is linked from the home page only), then the main tools, then whatever is left, up to `max`.
 * `available` is every page that exists in the page's language, in list order, the page itself included.
 */
export function neighbourTools(page: ToolPageLink, available: readonly ToolPageLink[], max: number): ToolPageLink[] {
  const peers = available.filter((t) => t.group === page.group);
  const i = peers.findIndex((t) => t.path === page.path);
  const after = i < 0 ? peers : [...peers.slice(i + 1), ...peers.slice(0, i)];
  const others = available.filter((t) => t.path !== page.path);
  const picked = [...after.slice(0, 4), ...others.filter((t) => t.group === 'core'), ...others];
  return picked.filter((t, k) => picked.indexOf(t) === k).slice(0, max);
}

/**
 * "More free tools": plain links to the keyword pages (video to text, audio to text, ...). Drop it at the bottom of a
 * page in one of three ways:
 *  - `<app-related-tools />` lists every page under small group headings (file types, uses, subtitles, languages,
 *    alternatives), so the home page, FAQ and how-it-works link the whole set;
 *  - `<app-related-tools current="/mp3-to-text" />` on a tool page: it leaves that page out and shows its neighbours
 *    first (the next pages of its group), then the main tools, up to `max` links (`neighbourTools`);
 *  - `[paths]="[...]"` lists just those pages in that order (a tool page's own related links).
 * The last link always goes to "All free tools", so every page stays reachable. Only the pages that exist in the page's
 * language are listed. Needs no data from the server, so it renders for crawlers too. Quiet on purpose: a thin line
 * above, a small heading and rows of underlined links (no boxes), so it never competes with the page's main button.
 */
@Component({
  selector: 'app-related-tools',
  imports: [RouterLink, TPipe, LocalePathPipe, ToolLabelPipe],
  template: `
    <section class="related" aria-labelledby="related-tools-title">
      <h2 id="related-tools-title">{{ heading() | t }}</h2>
      @for (g of groups(); track g.id) {
        @if (g.title) {
          <h3>{{ g.title | t }}</h3>
        }
        <ul>
          @for (t of g.tools; track t.path) {
            <li>
              <a [routerLink]="t.path | lp">{{ t | toolLabel }}</a>
            </li>
          }
        </ul>
      }
      @if (hub()) {
        <p class="all">
          <a [routerLink]="'/tools' | lp">{{ 'All free tools' | t }}</a>
        </p>
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
    .all {
      margin: 0;
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
  readonly heading = input(_t('More free tools'));
  /** the most links shown on a tool page (not counting "All free tools") */
  readonly max = input(8);
  /** only these pages, in this order (unknown paths are skipped); empty = the page's neighbours, or every page, grouped */
  readonly paths = input<readonly string[] | undefined>([]);

  private i18n = inject(I18nService);

  /** the "All free tools" page exists in the page's language (always in English): the link is left out where it would lead to another language */
  readonly hub = computed(() => this.i18n.isAvailable(this.i18n.locale(), '/tools'));

  private readonly here = computed(() => this.current().replace(/^\/?/, '/'));
  /** picked = the `paths`, neighbours = a tool page's own kind, all = every page under its group heading */
  private readonly mode = computed<'picked' | 'neighbours' | 'all'>(() => {
    if (this.paths()?.length) return 'picked';
    return this.current() && TOOL_PAGES.some((t) => t.path === this.here()) ? 'neighbours' : 'all';
  });

  /** only the tools that exist in the page's language (all of them in English): a translated page never links to an English one */
  readonly tools = computed<readonly ToolPageLink[]>(() => {
    const locale = this.i18n.locale();
    const exists = (t: ToolPageLink) => this.i18n.isAvailable(locale, t.path);
    const here = this.here();
    switch (this.mode()) {
      case 'picked':
        return (this.paths() ?? [])
          .map((p) => TOOL_PAGES.find((t) => t.path === p))
          .filter((t): t is ToolPageLink => !!t && t.path !== here && exists(t));
      case 'neighbours': {
        const page = TOOL_PAGES.find((t) => t.path === here)!;
        return neighbourTools(page, TOOL_PAGES.filter(exists), this.max());
      }
      default:
        return TOOL_PAGES.filter((t) => t.path !== here && exists(t));
    }
  });

  /** one untitled list for a chosen set or the neighbours; the group headings for the full list */
  readonly groups = computed(() => {
    const tools = this.tools();
    if (this.mode() !== 'all') return tools.length ? [{ id: 'picked', title: '', tools }] : [];
    return TOOL_GROUPS.map((g) => ({ id: g.id, title: g.title, tools: tools.filter((t) => t.group === g.id) })).filter((g) => g.tools.length);
  });
}
