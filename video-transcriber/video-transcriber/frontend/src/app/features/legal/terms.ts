import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OPERATOR } from '../../core/operator';
import { SiteService } from '../../core/site.service';
import { LEGAL_UPDATED } from './legal-info';

/**
 * Have it reviewed by a lawyer. The operator, address, contact and governing law come from core/operator.ts. The in-browser edition (the static website) has its own
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
  /** who runs the site, its address, contact address and governing law (core/operator.ts) */
  readonly op = OPERATOR;
}
