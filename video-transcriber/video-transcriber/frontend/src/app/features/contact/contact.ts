import { Component, inject } from '@angular/core';
import { OPERATOR } from '../../core/operator';
import { SiteService } from '../../core/site.service';
import { RichText } from '../../i18n/rich-text';
import { TPipe } from '../../i18n/t.pipe';

/** How to reach whoever runs the site: e-mail, what helps with a bug report, privacy requests and the postal address. */
@Component({
  selector: 'app-contact',
  imports: [TPipe, RichText],
  templateUrl: './contact.html',
  styleUrl: '../legal/legal.scss',
})
export class ContactPage {
  site = inject(SiteService);
  readonly op = OPERATOR;
}
