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
import { ToolPageContent } from './tool-page.model';

/** The announced public limits ("Up to 500 MB and 60 minutes per file."), used until the server tells its own (SiteService assumes the same on prerendered pages). */
export const DEFAULT_LIMITS = `Up to ${fmtBytesShort(PUBLIC_DEFAULTS.maxUploadMb * 1024 * 1024)} and ${PUBLIC_DEFAULTS.maxDurationMin} minutes per file.`;

/**
 * One keyword landing page ("MP4 to text", "SRT subtitle generator", ...). The route says which one (`data.tool` is the
 * route path, e.g. "mp4-to-text"); the text lives in ./content, one small file per page, all in this lazy chunk so a
 * visit is a single request. The visible questions and steps also feed the FAQPage / HowTo data.
 */
@Component({
  selector: 'app-tool-page',
  imports: [RouterLink, FreeChips, RelatedTools, ToolDrop],
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

  readonly limits = computed(() => {
    const announced = this.site.limitsText();
    if (announced) return announced;
    return this.site.mode() === 'unknown' ? DEFAULT_LIMITS : 'There is no size or length limit set here.';
  });

  /** the questions as the visitor reads them ({limits} filled in) */
  readonly faqs = computed(() =>
    this.c().faqs.map((f) => ({ question: f.question, answer: f.answer.replaceAll('{limits}', this.limits()) })),
  );

  constructor() {
    this.structured.faqPage(this.faqs);
    this.structured.howTo(
      computed(() => ({
        name: this.c().howTitle,
        description: this.c().howToDescription,
        steps: this.c().steps.map((s) => ({ name: s.title, text: s.text })),
      })),
    );
  }
}
