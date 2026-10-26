import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OPERATOR } from '../../core/operator';
import { SiteService } from '../../core/site.service';

/** How to reach whoever runs the site: e-mail, what helps with a bug report, privacy requests and the postal address. */
@Component({
  selector: 'app-contact',
  imports: [RouterLink],
  templateUrl: './contact.html',
  styleUrl: '../legal/legal.scss',
})
export class ContactPage {
  site = inject(SiteService);
  readonly op = OPERATOR;
}
