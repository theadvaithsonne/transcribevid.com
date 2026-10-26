import { AfterViewChecked, Component, ElementRef, afterEveryRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobsStore } from '../../core/jobs.store';
import { SiteService } from '../../core/site.service';
import { FaqItem, StructuredDataService } from '../../core/structured-data.service';
import { I18nService } from '../../i18n/i18n.service';
import { _t } from '../../i18n/mark';
import { RichText } from '../../i18n/rich-text';
import { LocalePathPipe, TPipe } from '../../i18n/t.pipe';
import { FreeChips } from '../../shared/free-chips';
import { readFaq, sameJson } from '../../shared/page-text';
import { RelatedTools } from '../../shared/related-tools';
import { AdSlot } from '../../shared/ad-slot';

/** The frequently asked questions. Anything about limits or about where files go comes from the server's /api/health. */
@Component({
  selector: 'app-faq',
  imports: [RouterLink, FreeChips, RelatedTools, AdSlot, TPipe, LocalePathPipe, RichText],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class FaqPage implements AfterViewChecked {
  site = inject(SiteService);
  store = inject(JobsStore);
  private i18n = inject(I18nService);
  private root = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** Sentences with a double quote in them: marked here (the extractor reads the source text), shown with `| t`. */
  readonly texts = {
    goodAudio: _t('**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.'),
    howLongServer: _t(
      'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".',
    ),
  };

  /** "30 minutes" / "1 minute" in the page's language, or null when the server announces no idle time. */
  readonly idle = computed(() => {
    const n = this.site.idleMinutes();
    if (!n) return null;
    return n === 1 ? this.i18n.t('1 minute') : this.i18n.t('{n} minutes', { n });
  });
  /** The same, or "a period" ("deleted after a period of inactivity"). */
  readonly idleOrPeriod = computed(() => this.idle() ?? this.i18n.t('a period'));

  /** The name of a language in the page's own language (the English page keeps the server's English names). */
  langName(code: string, english: string): string {
    const locale = this.i18n.locale();
    if (locale === 'en') return english;
    try {
      return new Intl.DisplayNames([locale], { type: 'language' }).of(code) ?? english;
    } catch {
      return english;
    }
  }

  /**
   * The questions and answers exactly as the page shows them. They are read back from the rendered text (also while the
   * page is prerendered), so the FAQPage data in the head always matches what the visitor reads, whatever the limits are
   * and whatever the language: it carries the translated words, without any markup.
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
