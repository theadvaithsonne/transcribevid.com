import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OPERATOR } from '../../core/operator';
import { SiteService } from '../../core/site.service';
import { I18nService } from '../../i18n/i18n.service';
import { RichText } from '../../i18n/rich-text';
import { LocalePathPipe, TPipe } from '../../i18n/t.pipe';
import { LEGAL_UPDATED_ISO, fmtLegalDate } from './legal-info';

/**
 * Have it reviewed by a lawyer. The operator, address, contact and governing law come from core/operator.ts. The in-browser edition (the static website) has its own
 * wording (the device does the work, no upload, funded by ads, not directed to children); the server editions keep theirs.
 *
 * Only the in-browser text is translated (every sentence is a key, see docs/in-browser/I18N.md): translated pages exist only
 * in that edition, so the server text stays English.
 */
@Component({
  selector: 'app-terms',
  imports: [RouterLink, TPipe, LocalePathPipe, RichText],
  templateUrl: './terms.html',
  styleUrl: './legal.scss',
})
export class TermsPage {
  site = inject(SiteService);
  i18n = inject(I18nService);
  /** who runs the site, its address, contact address and governing law (core/operator.ts) */
  readonly op = OPERATOR;

  /** "Last updated" in the page's language */
  readonly dateText = computed(() => fmtLegalDate(LEGAL_UPDATED_ISO, this.i18n.locale()));
  /** the idle time before a session ends, in the page's language ("30 minutes", or "a period" when the server says nothing) */
  readonly idle = computed(() => {
    const n = this.site.idleMinutes();
    if (!n) return this.i18n.t('a period');
    return n === 1 ? this.i18n.t('{n} minute', { n }) : this.i18n.t('{n} minutes', { n });
  });
  /** the contact address: the server's when it announces one, else the operator's */
  readonly contactMail = computed(() => this.site.contactEmail() ?? OPERATOR.email);
}
