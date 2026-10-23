import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteService } from '../../core/site.service';
import { LEGAL_UPDATED } from './legal-info';

/**
 * TEMPLATE: review with a lawyer before launch. The operator details are placeholders the site owner must fill in
 * (search privacy.html for `class="placeholder"`), and the statements about retention, logs and hosting must match
 * how the service is really deployed.
 */
@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './legal.scss',
})
export class PrivacyPage {
  site = inject(SiteService);
  readonly updated = LEGAL_UPDATED;
}
