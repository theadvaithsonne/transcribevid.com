import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CORE_TOOLS, TOOL_PAGES, ToolPageLink } from '../features/tool-pages/tool-pages.list';
import { I18nService } from '../i18n/i18n.service';
import { _t } from '../i18n/mark';
import { LocalePathPipe, TPipe } from '../i18n/t.pipe';
import { ToolLabelPipe } from './tool-label';

/**
 * "More free tools": plain links to the keyword pages (video to text, audio to text, ...). Drop it at the bottom of a
 * page: `<app-related-tools />` (the core tools), or `<app-related-tools current="/mp3-to-text" />` on a tool page: it
 * leaves that page out and shows its neighbours first (same group), then the core tools, up to `max` links. The last
 * link always goes to "All free tools", so every page stays reachable.
 * Needs no data from the server, so it renders for crawlers too. Quiet on purpose: a thin line above, a small heading
 * and a row of underlined links (no boxes), so it never competes with the page's main button.
 */
@Component({
  selector: 'app-related-tools',
  imports: [RouterLink, TPipe, LocalePathPipe, ToolLabelPipe],
  template: `
    <section class="related" aria-labelledby="related-tools-title">
      <h2 id="related-tools-title">{{ heading() | t }}</h2>
      <ul>
        @for (t of tools(); track t.path) {
          <li>
            <a [routerLink]="t.path | lp">{{ t | toolLabel }}</a>
          </li>
        }
        @if (hub()) {
          <li class="all">
            <a [routerLink]="'/tools' | lp">{{ 'All free tools' | t }}</a>
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
  readonly heading = input(_t('More free tools'));
  /** the most links shown on a tool page (not counting "All free tools") */
  readonly max = input(8);

  private i18n = inject(I18nService);

  /** the "All free tools" page exists in the page's language (always in English): the link is left out where it would lead to another language */
  readonly hub = computed(() => this.i18n.isAvailable(this.i18n.locale(), '/tools'));

  /** only the tools that exist in the page's language (all of them in English): a translated page never links to an English one */
  readonly tools = computed<readonly ToolPageLink[]>(() => {
    const locale = this.i18n.locale();
    const exists = (t: ToolPageLink) => this.i18n.isAvailable(locale, t.path);
    const here = this.current().replace(/^\/?/, '/');
    const page = TOOL_PAGES.find((t) => t.path === here);
    if (!page) return CORE_TOOLS.filter(exists); // home, FAQ, ...: the main tools
    const others = TOOL_PAGES.filter((t) => t.path !== here && exists(t));
    // up to four neighbours (same group), then the core tools, then whatever is left
    const picked = [...others.filter((t) => t.group === page.group).slice(0, 4), ...others.filter((t) => t.group === 'core'), ...others];
    return picked.filter((t, i) => picked.indexOf(t) === i).slice(0, this.max());
  });
}
