import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteService } from '../../core/site.service';
import { LEGAL_UPDATED } from './legal-info';

/**
 * TEMPLATE: review with a lawyer before launch. The operator and governing-law details are placeholders the site
 * owner must fill in (search terms.html for `class="placeholder"`). The in-browser edition (the static website) has its own
 * wording (the device does the work, no upload, funded by ads, not directed to children); the server editions keep theirs.
 */
@Component({
  selector: 'app-terms',
  imports: [RouterLink],
  templateUrl: './terms.html',
  styleUrl: './legal.scss',
})
export class TermsPage {
  site = inject(SiteService);
  readonly updated = LEGAL_UPDATED;
}
