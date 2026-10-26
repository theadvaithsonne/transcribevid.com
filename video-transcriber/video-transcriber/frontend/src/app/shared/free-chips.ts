import { Component, inject, input } from '@angular/core';
import { SiteService } from '../core/site.service';

/**
 * The three promises: Free, Unlimited, No login. Shown once, at the top of How it works, the FAQ and the keyword pages,
 * so a visitor sees them before anything else. Calm on purpose: plain words, each with one small round tick in the
 * accent colour (no coloured pills).
 */
@Component({
  selector: 'app-free-chips',
  template: `
    <ul class="chips" aria-label="Free, unlimited, no login">
      @for (c of chips; track c) {
        <li>
          <span class="tick" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </span>
          {{ c }}
        </li>
      }
    </ul>
    @if (line()) {
      <p class="line">
        @if (site.isLocal() && !site.inBrowser()) {
          Nothing to sign up for and nothing to pay. Just add your file.
        } @else {
          No sign-up, no payment, no daily limit. Just add your file.
        }
      </p>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 28px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: var(--fs-lg);
      font-weight: 750;
      line-height: 1.2;
      color: var(--text-strong);
      white-space: nowrap;
    }
    .tick {
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: var(--accent);
      color: var(--accent-ink);
    }
    .line {
      margin: 14px 0 0;
      font-size: var(--fs-base);
      line-height: 1.5;
      color: var(--text);
    }
    @media (max-width: 420px) {
      .chips {
        gap: 12px 20px;
      }
    }
  `,
})
export class FreeChips {
  site = inject(SiteService);
  /** also show the one-line explanation under the chips (off by default: the chips say it already) */
  line = input(false);

  readonly chips = ['Free', 'Unlimited', 'No login'];
}
