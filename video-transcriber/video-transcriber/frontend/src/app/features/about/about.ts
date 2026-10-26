import { Component, inject } from '@angular/core';
import { OPERATOR } from '../../core/operator';
import { SiteService } from '../../core/site.service';
import { I18nService } from '../../i18n/i18n.service';
import { RichText } from '../../i18n/rich-text';
import { TPipe } from '../../i18n/t.pipe';

/** Who runs TranscribeVid and why: the page reviewers and visitors look for. Plain text, the same reading column as the legal pages. */
@Component({
  selector: 'app-about',
  imports: [TPipe, RichText],
  templateUrl: './about.html',
  styleUrl: '../legal/legal.scss',
})
export class AboutPage {
  site = inject(SiteService);
  private i18n = inject(I18nService);
  readonly op = OPERATOR;
  /** the operator's role and city in the page's language (the dictionary has them as keys) */
  tr = (text: string) => this.i18n.t(text);
}
