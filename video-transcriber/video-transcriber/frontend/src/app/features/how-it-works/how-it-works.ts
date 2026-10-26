import { AfterViewChecked, Component, ElementRef, afterEveryRender, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobsStore } from '../../core/jobs.store';
import { SiteService } from '../../core/site.service';
import { HowToInput, StructuredDataService } from '../../core/structured-data.service';
import { I18nService } from '../../i18n/i18n.service';
import { _t } from '../../i18n/mark';
import { RichText } from '../../i18n/rich-text';
import { LocalePathPipe, TPipe } from '../../i18n/t.pipe';
import { FreeChips } from '../../shared/free-chips';
import { readSteps, readText, sameJson } from '../../shared/page-text';
import { RelatedTools } from '../../shared/related-tools';
import { AdSlot } from '../../shared/ad-slot';

/** "How it works": the steps, what you get, tips and what to know. Limits and where files go come from /api/health. */
@Component({
  selector: 'app-how-it-works',
  imports: [RouterLink, FreeChips, RelatedTools, AdSlot, TPipe, LocalePathPipe, RichText],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
})
export class HowItWorksPage implements AfterViewChecked {
  site = inject(SiteService);
  store = inject(JobsStore);
  private i18n = inject(I18nService);
  private root = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** A sentence with a double quote in it: marked here (the extractor reads the source text), shown with `| t`. */
  readonly texts = {
    goodAudio: _t('**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.'),
  };

  /** "30 minutes" / "1 minute" in the page's language, or "a period" when the server announces no idle time. */
  readonly idleOrPeriod = computed(() => {
    const n = this.site.idleMinutes();
    if (!n) return this.i18n.t('a period');
    return n === 1 ? this.i18n.t('1 minute') : this.i18n.t('{n} minutes', { n });
  });

  /** The three steps as the page shows them, read back from the rendered text (also while prerendering). */
  private howTo = signal<HowToInput>({ name: '', steps: [] }, { equal: sameJson });

  constructor() {
    inject(StructuredDataService).howTo(this.howTo);
    // ngAfterViewChecked is not called when only this page's own text changes (the brand name arrives from the server after
    // the first render, and the app does not check the whole tree on every tick), so the browser also reads after every render
    afterEveryRender(() => this.read());
  }

  ngAfterViewChecked() {
    this.read();
  }

  private read() {
    this.howTo.set({
      name: this.i18n.t('How to turn a video or audio file into text with {brand}', { brand: this.site.brand().name }),
      description: readText(this.root, '.page-lead'),
      steps: readSteps(this.root),
    });
  }
}
