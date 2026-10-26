import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdsService } from '../../core/ads.service';
import { OPERATOR } from '../../core/operator';
import { SiteService } from '../../core/site.service';
import { THIRD_PARTY_NOTICES } from '../../engine/models/licences';
import { I18nService } from '../../i18n/i18n.service';
import { _t } from '../../i18n/mark';
import { RichText } from '../../i18n/rich-text';
import { LocalePathPipe, TPipe } from '../../i18n/t.pipe';
import { LEGAL_UPDATED_ISO, fmtLegalDate } from './legal-info';

/**
 * Have it reviewed by a lawyer. The operator, address and contact come from core/operator.ts, and the statements about retention, logs and hosting must match
 * how the service is really deployed. The in-browser edition (the static website) has its own text: the file stays on the
 * device, the downloads the browser makes, Cloudflare, the counter Worker and the AdSense disclosures that Google requires
 * (docs/in-browser/spike/adsense.md section 10); the server editions keep theirs.
 *
 * Only the in-browser text is translated (every sentence is a key, see docs/in-browser/I18N.md): translated pages exist only
 * in that edition, so the server text below stays English.
 */
@Component({
  selector: 'app-privacy',
  imports: [RouterLink, TPipe, LocalePathPipe, RichText],
  templateUrl: './privacy.html',
  styleUrl: './legal.scss',
})
export class PrivacyPage {
  site = inject(SiteService);
  i18n = inject(I18nService);
  /** `configured`: every AdSense id is set, so the "Privacy and cookie settings" control exists on the pages with ads */
  ads = inject(AdsService);
  /** who runs the site, its address, contact address and governing law (core/operator.ts) */
  readonly op = OPERATOR;
  /** browser edition: the components downloaded at run time and the notices their licences ask for (ffmpeg.wasm, Qwen) */
  readonly notices = THIRD_PARTY_NOTICES;

  /** "Last updated" in the page's language */
  readonly dateText = computed(() => fmtLegalDate(LEGAL_UPDATED_ISO, this.i18n.locale()));
  /** the idle time before a session ends, in the page's language ("45 minutes", or "a period" when the server says nothing) */
  readonly idle = computed(() => {
    const n = this.site.idleMinutes();
    if (!n) return this.i18n.t('a period');
    return n === 1 ? this.i18n.t('{n} minute', { n }) : this.i18n.t('{n} minutes', { n });
  });
  /** the contact address: the server's when it announces one, else the operator's */
  readonly contactMail = computed(() => this.site.contactEmail() ?? OPERATOR.email);

  /**
   * Sentences that cannot be written inside a template attribute (straight double quotes, or an apostrophe next to a web
   * address: Angular's expression parser reads `//` as a comment): shown with `T.x | t`.
   */
  protected readonly T = {
    optOut: _t(
      `You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).`,
    ),
    adChoices: _t(
      `To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.`,
    ),
    adChoicesBasic: _t(
      `To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.`,
    ),
    operated: _t(
      `{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.`,
    ),
    counter: _t(
      `**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors' browsers and is not verified.`,
    ),
  };
}
