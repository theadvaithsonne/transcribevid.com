import { Component, computed, inject } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { AdSlot } from './ad-slot';

/**
 * The desktop ad column: the right 20% of the window from 1100 px wide, on ad pages only (the app shell places it in its
 * grid, see app.scss "ad rail"). It sits beside the scrolling page, so the unit stays in view without `position: sticky`;
 * on a window too short for the 600 px unit the column scrolls on its own. Below 1100 px it is not shown at all (its slot
 * then has no size and requests nothing); the pages carry one in-flow unit instead.
 */
@Component({
  selector: 'app-ad-rail',
  imports: [AdSlot],
  template: `<app-ad-slot placement="rail" />`,
  host: { role: 'complementary', '[attr.aria-label]': 'label()' },
  styles: `
    :host {
      display: block;
      padding: 16px 12px;
    }
    @media print {
      :host {
        display: none !important;
      }
    }
  `,
})
export class AdRail {
  private i18n = inject(I18nService);
  /** the column's accessible name, in the page's language */
  readonly label = computed(() => this.i18n.t('Advertisement'));
}
