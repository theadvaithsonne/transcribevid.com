import { Component, input } from '@angular/core';

/**
 * The TranscribeVid mark: a play triangle, an audio waveform and two subtitle lines on a rounded square.
 * Flat: a solid square in the main-button colours (light with black marks in dark mode, dark with white marks in
 * light mode), so there is never light text on blue. Decorative: the wordmark next to it carries the name.
 */
@Component({
  selector: 'app-logo',
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect class="bg" width="32" height="32" rx="8.5" />
      <g class="fg" stroke-linejoin="round" stroke-linecap="round">
        <path d="M7.4 5.9v9.6l7.6-4.8z" stroke-width="1.8" />
        <path d="M19.2 8.9v3.6M22.6 6.8v7.8M26 9.6v2.4" fill="none" stroke-width="2.2" />
        <path d="M7 21h18M7 25.2h11.5" fill="none" stroke-width="2.4" />
      </g>
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
    }
    svg {
      display: block;
    }
    .bg {
      fill: var(--primary-bg);
    }
    .fg {
      fill: var(--primary-ink);
      stroke: var(--primary-ink);
    }
  `,
})
export class Logo {
  size = input(40);
}
