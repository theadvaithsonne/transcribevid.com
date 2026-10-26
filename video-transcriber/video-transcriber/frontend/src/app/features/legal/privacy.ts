import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdsService } from '../../core/ads.service';
import { SiteService } from '../../core/site.service';
import { THIRD_PARTY_NOTICES } from '../../engine/models/licences';
import { LEGAL_UPDATED } from './legal-info';

/**
 * TEMPLATE: review with a lawyer before launch. The operator details are placeholders the site owner must fill in
 * (search privacy.html for `class="placeholder"`), and the statements about retention, logs and hosting must match
 * how the service is really deployed. The in-browser edition (the static website) has its own text: the file stays on the
 * device, the downloads the browser makes, Cloudflare, the counter Worker and the AdSense disclosures that Google requires
 * (docs/in-browser/spike/adsense.md section 10); the server editions keep theirs.
 */
@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './legal.scss',
})
export class PrivacyPage {
  site = inject(SiteService);
  /** `configured`: every AdSense id is set, so the "Privacy and cookie settings" control exists on the pages with ads */
  ads = inject(AdsService);
  readonly updated = LEGAL_UPDATED;
  /** browser edition: the components downloaded at run time and the notices their licences ask for (ffmpeg.wasm, Qwen) */
  readonly notices = THIRD_PARTY_NOTICES;
}
