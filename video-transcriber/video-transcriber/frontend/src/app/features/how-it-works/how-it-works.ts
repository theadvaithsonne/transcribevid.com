import { AfterViewChecked, Component, ElementRef, afterEveryRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobsStore } from '../../core/jobs.store';
import { SiteService } from '../../core/site.service';
import { HowToInput, StructuredDataService } from '../../core/structured-data.service';
import { FreeChips } from '../../shared/free-chips';
import { readSteps, readText, sameJson } from '../../shared/page-text';
import { RelatedTools } from '../../shared/related-tools';

/** "How it works": the steps, what you get, tips and what to know. Limits and where files go come from /api/health. */
@Component({
  selector: 'app-how-it-works',
  imports: [RouterLink, FreeChips, RelatedTools],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.scss',
})
export class HowItWorksPage implements AfterViewChecked {
  site = inject(SiteService);
  store = inject(JobsStore);
  private root = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

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
      name: `How to turn a video or audio file into text with ${this.site.brand().name}`,
      description: readText(this.root, '.page-lead'),
      steps: readSteps(this.root),
    });
  }
}
