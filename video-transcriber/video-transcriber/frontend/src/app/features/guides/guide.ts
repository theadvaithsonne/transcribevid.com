import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OPERATOR } from '../../core/operator';
import { SiteService } from '../../core/site.service';
import { StructuredDataService } from '../../core/structured-data.service';
import { I18nService } from '../../i18n/i18n.service';
import { LocalePathPipe, TPipe } from '../../i18n/t.pipe';
import { AdSlot } from '../../shared/ad-slot';
import { GuideBlock, GuideContent } from './guide.model';
import { GUIDES, GUIDES_PATH, fmtLongDate } from './guides.list';

/** The sections of a guide as one edition reads them: the in-browser edition takes each block's `browser` variant where there is one. */
export function editionBlocks(c: GuideContent, inBrowser: boolean): GuideBlock[] {
  return c.blocks.map((b) => {
    const v = inBrowser ? b.browser : undefined;
    return {
      title: b.title,
      paragraphs: v?.paragraphs ?? b.paragraphs,
      bullets: v?.bullets ?? b.bullets,
      steps: v?.steps ?? b.steps,
      code: b.code,
      table: b.table,
      after: v?.after ?? b.after,
    };
  });
}

/** The words a guide shows (headings, paragraphs, lists, steps, table cells, questions): for the article data and reading time checks. */
export function guideWordCount(c: GuideContent, blocks: GuideBlock[] = c.blocks): number {
  const parts: string[] = [c.h1, c.lead];
  for (const b of blocks) {
    parts.push(b.title, ...(b.paragraphs ?? []), ...(b.after ?? []));
    for (const x of b.bullets ?? []) parts.push(x.title ?? '', x.text);
    for (const x of b.steps ?? []) parts.push(x.title, x.text);
    if (b.table) parts.push(b.table.caption, ...b.table.head, ...b.table.rows.flat());
  }
  for (const f of c.faqs) parts.push(f.question, f.answer);
  return parts.join(' ').split(/\s+/).filter(Boolean).length;
}

/**
 * One guide (/guides/<slug>). The route says which one (`data.guide`) and its resolver loads the text (`data.content`,
 * from ./content). A reading page: headline, "updated" date and reading time, the answer in short, the sections, the
 * questions, related links and one quiet way to the tool. Feeds Article, FAQPage and breadcrumb data.
 */
@Component({
  selector: 'app-guide',
  imports: [RouterLink, AdSlot, TPipe, LocalePathPipe],
  templateUrl: './guide.html',
  styleUrl: './guide.scss',
})
export class GuidePage {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  private site = inject(SiteService);
  private structured = inject(StructuredDataService);
  private i18n = inject(I18nService);

  readonly guidesPath = GUIDES_PATH;
  /** who runs the site and answers for its guides: named in the byline and as the author in the Article data */
  readonly op = OPERATOR;
  private slug = computed(() => String(this.data()['guide'] ?? ''));
  readonly c = computed<GuideContent>(() => this.data()['content'] as GuideContent);
  readonly meta = computed(() => GUIDES.find((g) => g.slug === this.slug()) ?? GUIDES[0]);
  readonly blocks = computed(() => editionBlocks(this.c(), this.site.inBrowser()));
  /** the guide's short name and description in the page's language (the route resolves them per language; English comes from the list) */
  readonly label = computed(() => String(this.data()['label'] ?? this.meta().label));
  private description = computed(() => String(this.data()['description'] ?? this.meta().description));
  readonly updatedLabel = computed(() => fmtLongDate(this.meta().updated, this.i18n.locale()));
  readonly faqs = computed(() => this.c().faqs);

  constructor() {
    this.structured.faqPage(this.faqs);
    this.structured.article(
      computed(() => ({
        headline: this.c().h1,
        description: this.description(),
        path: this.i18n.path(this.meta().path),
        published: this.meta().published,
        updated: this.meta().updated,
        wordCount: guideWordCount(this.c(), this.blocks()),
      })),
    );
  }
}
