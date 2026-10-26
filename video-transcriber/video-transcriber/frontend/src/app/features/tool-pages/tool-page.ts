import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { fmtBytesShort } from '../../core/format';
import { PUBLIC_DEFAULTS, SiteService } from '../../core/site.service';
import { StructuredDataService } from '../../core/structured-data.service';
import { FreeChips } from '../../shared/free-chips';
import { RelatedTools } from '../../shared/related-tools';
import { TOOL_CONTENT } from './content';
import { ToolDrop } from './tool-drop';
import { ToolFaq, ToolPageContent, ToolStep, ToolTip } from './tool-page.model';
import { AdSlot } from '../../shared/ad-slot';

/** The text of a page as one edition reads it: the in-browser edition takes each item's `browser` variant where there is one. */
export function editionText(c: ToolPageContent, inBrowser: boolean) {
  const step = (s: ToolStep | ToolTip) => ({ title: (inBrowser && s.browser?.title) || s.title, text: (inBrowser && s.browser?.text) || s.text });
  const faq = (f: ToolFaq) => ({
    question: (inBrowser && f.browser?.question) || f.question,
    answer: (inBrowser && f.browser?.answer) || f.answer,
  });
  const cmp = c.comparison;
  return {
    h1: (inBrowser && c.browserH1) || c.h1,
    lead: (inBrowser && c.browserLead) || c.lead,
    why: (inBrowser && c.browserWhy) || c.why,
    steps: c.steps.map(step),
    tips: c.tips.map(step),
    faqs: c.faqs.map(faq),
    comparison: cmp
      ? { ...cmp, rows: cmp.rows.map((r) => ({ topic: r.topic, us: (inBrowser && r.browserUs) || r.us, them: r.them })) }
      : null,
  };
}

/** The announced public limits ("Up to 500 MB and 60 minutes per file."), used until the server tells its own (SiteService assumes the same on prerendered pages). */
export const DEFAULT_LIMITS = `Up to ${fmtBytesShort(PUBLIC_DEFAULTS.maxUploadMb * 1024 * 1024)} and ${PUBLIC_DEFAULTS.maxDurationMin} minutes per file.`;

/**
 * One keyword landing page ("MP4 to text", "SRT subtitle generator", ...). The route says which one (`data.tool` is the
 * route path, e.g. "mp4-to-text"); the text lives in ./content, one small file per page, all in this lazy chunk so a
 * visit is a single request. The visible questions and steps also feed the FAQPage / HowTo data.
 */
@Component({
  selector: 'app-tool-page',
  imports: [RouterLink, FreeChips, RelatedTools, ToolDrop, AdSlot],
  templateUrl: './tool-page.html',
  styleUrl: './tool-page.scss',
})
export class ToolPage {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  private site = inject(SiteService);
  private structured = inject(StructuredDataService);

  private slug = computed(() => String(this.data()['tool'] ?? ''));
  readonly c = computed<ToolPageContent>(() => TOOL_CONTENT[this.slug()] ?? TOOL_CONTENT['video-to-text']);
  /** short name of the page, e.g. "MP4 to text" */
  readonly label = computed(() => String(this.data()['label'] ?? this.c().eyebrow));
  readonly path = computed(() => '/' + this.slug());
  /** why, steps, tips and questions in this edition's words (the in-browser edition has no upload, limit or queue) */
  readonly text = computed(() => editionText(this.c(), this.site.inBrowser()));
  /** the site's own name, for the comparison table's column */
  readonly brand = computed(() => this.site.brand().name);

  readonly limits = computed(() => {
    const announced = this.site.limitsText();
    if (announced) return announced;
    return this.site.mode() === 'unknown' ? DEFAULT_LIMITS : 'There is no size or length limit set here.';
  });

  /** the questions as the visitor reads them ({limits} filled in) */
  readonly faqs = computed(() =>
    this.text().faqs.map((f) => ({ question: f.question, answer: f.answer.replaceAll('{limits}', this.limits()) })),
  );

  constructor() {
    this.structured.faqPage(this.faqs);
    this.structured.howTo(
      computed(() => ({
        name: this.c().howTitle,
        description: this.c().howToDescription,
        steps: this.text().steps.map((s) => ({ name: s.title, text: s.text })),
      })),
    );
  }
}
