import { AfterViewChecked, Component, ElementRef, afterEveryRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobsStore } from '../../core/jobs.store';
import { SiteService } from '../../core/site.service';
import { FaqItem, StructuredDataService } from '../../core/structured-data.service';
import { FreeChips } from '../../shared/free-chips';
import { readFaq, sameJson } from '../../shared/page-text';
import { RelatedTools } from '../../shared/related-tools';

/** The frequently asked questions. Anything about limits or about where files go comes from the server's /api/health. */
@Component({
  selector: 'app-faq',
  imports: [RouterLink, FreeChips, RelatedTools],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class FaqPage implements AfterViewChecked {
  site = inject(SiteService);
  store = inject(JobsStore);
  private root = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /**
   * The questions and answers exactly as the page shows them. They are read back from the rendered text (also while the
   * page is prerendered), so the FAQPage data in the head always matches what the visitor reads, whatever the limits are.
   */
  private qa = signal<FaqItem[]>([], { equal: sameJson });

  constructor() {
    inject(StructuredDataService).faqPage(this.qa);
    // ngAfterViewChecked is not called when only this page's own text changes (the server's limits arrive after the first
    // render, and the app does not check the whole tree on every tick), so the browser also reads the page after every render
    afterEveryRender(() => this.qa.set(readFaq(this.root)));
  }

  ngAfterViewChecked() {
    this.qa.set(readFaq(this.root));
  }
}
