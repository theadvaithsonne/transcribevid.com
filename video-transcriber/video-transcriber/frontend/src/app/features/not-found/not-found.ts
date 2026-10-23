import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="page-doc">
      <section class="lost">
        <h1>Page not found</h1>
        <p class="lede">The page you are looking for does not exist or has moved.</p>
        <a class="btn primary big" routerLink="/">Go to the home page</a>
      </section>
    </div>
  `,
  /* Plain and calm: a heading, one sentence and the one main button, centred. No card, no colour. */
  styles: `
    :host {
      display: block;
    }
    .lost {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 720px;
      margin: clamp(16px, 8vh, 96px) auto 0;
    }
    h1 {
      font-size: var(--fs-h1);
      font-weight: 800;
    }
    .lede {
      max-width: 40ch;
      margin: 16px 0 32px;
      font-size: var(--fs-lg);
      line-height: 1.6;
      color: var(--text);
    }
    .btn:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 3px;
    }
    @media (max-width: 560px) {
      .btn {
        width: 100%;
      }
    }
  `,
})
export class NotFoundPage {}
