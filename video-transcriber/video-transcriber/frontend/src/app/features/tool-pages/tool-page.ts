import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { fmtBytesShort } from '../../core/format';
import { PUBLIC_DEFAULTS, SiteService } from '../../core/site.service';
import { StructuredDataService } from '../../core/structured-data.service';
import { FreeChips } from '../../shared/free-chips';
import { RelatedTools } from '../../shared/related-tools';
import { ToolDrop } from './tool-drop';
import { ToolFaq, ToolPageContent, ToolSection, ToolStep, ToolTip } from './tool-page.model';
import { TOOL_PAGES } from './tool-pages.list';
import { AdSlot } from '../../shared/ad-slot';

/** The text of a page as one edition reads it: the in-browser edition takes each item's `browser` variant where there is one. */
export function editionText(c: ToolPageContent, inBrowser: boolean) {
  const step = (s: ToolStep | ToolTip) => ({ title: (inBrowser && s.browser?.title) || s.title, text: (inBrowser && s.browser?.text) || s.text });
  const faq = (f: ToolFaq) => ({
    question: (inBrowser && f.browser?.question) || f.question,
    answer: (inBrowser && f.browser?.answer) || f.answer,
  });
  const section = (s: ToolSection) => ({
    title: s.title,
    paragraphs: (inBrowser && s.browser?.paragraphs) || s.paragraphs || [],
    bullets: (inBrowser && s.browser?.bullets) || s.bullets || [],
  });
  return {
    why: (inBrowser && c.browserWhy) || c.why,
    sections: (c.sections ?? []).map(section),
    steps: c.steps.map(step),
    tips: c.tips.map(step),
    faqs: c.faqs.map(faq),
  };
}

/** The announced public limits ("Up to 500 MB and 60 minutes per file."), used until the server tells its own (SiteService assumes the same on prerendered pages). */
export const DEFAULT_LIMITS = `Up to ${fmtBytesShort(PUBLIC_DEFAULTS.maxUploadMb * 1024 * 1024)} and ${PUBLIC_DEFAULTS.maxDurationMin} minutes per file.`;

/**
 * One keyword landing page ("MP4 to text", "SRT subtitle generator", "Hindi audio to text", ...). The route says which one
 * (`data.tool` is the route path, e.g. "mp4-to-text") and its resolver loads the text (`data.content`, from ./content: one
 * small file per page, a chunk of its own, so a visit downloads only the page it opens). The visible questions and steps
 * also feed the FAQPage / HowTo data.
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
  /** the page's text, loaded by the route's resolver before the page is shown */
  readonly c = computed<ToolPageContent>(() => this.data()['content'] as ToolPageContent);
  /** short name of the page, e.g. "MP4 to text" */
  readonly label = computed(() => String(this.data()['label'] ?? this.c().eyebrow));
  readonly path = computed(() => '/' + this.slug());
  /** what a file dropped here starts the uploader with (a language page: its language), if anything */
  readonly preset = computed(() => TOOL_PAGES.find((t) => t.path === this.path())?.preset ?? null);
  /** why, sections, steps, tips and questions in this edition's words (the in-browser edition has no upload, limit or queue) */
  readonly text = computed(() => editionText(this.c(), this.site.inBrowser()));

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
