import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OPERATOR } from '../../core/operator';
import { SiteService } from '../../core/site.service';

/** Who runs TranscribeVid and why: the page reviewers and visitors look for. Plain text, the same reading column as the legal pages. */
@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: '../legal/legal.scss',
})
export class AboutPage {
  site = inject(SiteService);
  readonly op = OPERATOR;
}
