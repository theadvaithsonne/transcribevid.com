import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GUIDES, fmtLongDate } from './guides.list';

/**
 * "Guides": the list of the articles (/guides). Plain links with the question each one answers; no ads (a page of
 * links has too little text of its own to carry them).
 */
@Component({
  selector: 'app-guides-index',
  imports: [RouterLink],
  template: `
    <div class="page-doc">
      <article class="doc">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a routerLink="/">Home</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Guides</span>
        </nav>
        <h1 class="page-title">Guides: transcripts and subtitles</h1>
        <p class="lede">
          Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video,
          how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.
        </p>
        <ul class="guides">
          @for (g of guides; track g.path) {
            <li>
              <h2>
                <a [routerLink]="g.path">{{ g.label }}</a>
              </h2>
              <p>{{ g.description }}</p>
              <p class="when">Updated {{ date(g.updated) }}</p>
            </li>
          }
        </ul>
        <p>
          Ready to try it? <a routerLink="/tools">See all free tools</a> or <a routerLink="/">transcribe a file now</a>.
        </p>
      </article>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .doc {
      max-width: 820px;
      margin-inline: auto;
      font-size: var(--fs-lg);
      line-height: 1.7;
      color: var(--text);
      a:not(.btn) {
        color: var(--accent);
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 2px;
      }
      a:focus-visible {
        outline: 2px solid var(--focus-ring);
        outline-offset: 3px;
      }
    }
    .crumbs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0 10px;
      margin-bottom: 8px;
      font-size: var(--fs-sm);
      color: var(--muted);
      a {
        display: inline-flex;
        align-items: center;
        min-width: 44px;
        min-height: 44px;
      }
    }
    .page-title {
      font-size: clamp(32px, 3.2vw, 48px);
      line-height: 1.15;
    }
    .lede {
      margin: 16px 0 32px;
      padding: 20px 24px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--r-lg);
      color: var(--text-strong);
    }
    .guides {
      margin: 0 0 32px;
      padding: 0;
      list-style: none;
      li {
        padding: 20px 0;
        & + li {
          border-top: 1px solid var(--line);
        }
      }
      h2 {
        margin: 0 0 6px;
        font-size: clamp(22px, 1.8vw, 28px);
        font-weight: 750;
        line-height: 1.25;
      }
      p {
        margin: 0;
      }
      .when {
        margin-top: 6px;
        font-size: var(--fs-sm);
        color: var(--muted);
      }
    }
  `,
})
export class GuidesIndexPage {
  readonly guides = GUIDES;
  readonly date = fmtLongDate;
}
