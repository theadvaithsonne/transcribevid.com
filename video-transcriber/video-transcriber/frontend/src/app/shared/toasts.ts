import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';

/**
 * Where the toasts appear: bottom left on a computer (the main buttons are at the top right of the transcript page and
 * at the bottom right of the home page, so neither is covered); on a phone one compact toast over the header bar. Errors are announced at once to screen readers, the rest politely.
 * Put it once in the app shell: `<app-toasts />`.
 */
@Component({
  selector: 'app-toasts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stack" aria-live="polite" aria-relevant="additions">
      @for (t of toast.toasts(); track t.id) {
        <div
          [class]="'toast ' + t.kind"
          [attr.role]="t.kind === 'error' ? 'alert' : 'status'"
          (mouseenter)="toast.pause(t.id)"
          (mouseleave)="toast.resume(t.id)"
          (focusin)="toast.pause(t.id)"
          (focusout)="toast.resume(t.id)"
        >
          <span class="ico" aria-hidden="true">
            @switch (t.kind) {
              @case ('success') {
                <svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg>
              }
              @case ('error') {
                <svg viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10M17 7L7 17" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
              }
              @case ('warning') {
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 6v8" stroke="currentColor" stroke-width="3" stroke-linecap="round" /><circle cx="12" cy="18.5" r="1.8" fill="currentColor" /></svg>
              }
              @default {
                <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6.5" r="1.8" fill="currentColor" /><path d="M12 11v7.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
              }
            }
          </span>
          <div class="body">
            <b>{{ t.title }}</b>
            @if (t.message) {
              <span>{{ t.message }}</span>
            }
          </div>
          <button type="button" class="close" (click)="toast.dismiss(t.id)" [attr.aria-label]="'Close: ' + t.title">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" /></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      left: 24px;
      bottom: 24px;
      z-index: 70;
      width: min(420px, calc(100vw - 32px));
      pointer-events: none;
    }
    .stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      --k: var(--accent);
      pointer-events: auto;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: start;
      gap: 12px;
      padding: 12px 6px 12px 14px;
      background: var(--surface);
      border: 1px solid var(--line-strong);
      border-left: 6px solid var(--k);
      border-radius: var(--r-lg);
      color: var(--text);
      animation: toast-in 0.18s ease-out;
    }
    .success {
      --k: var(--ok);
    }
    .error {
      --k: var(--err);
    }
    .warning {
      --k: var(--warn);
    }
    .ico {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      margin-top: 2px;
      border-radius: 50%;
      background: var(--k);
      color: var(--bg);
      svg {
        width: 18px;
        height: 18px;
      }
    }
    .body {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      padding-top: 6px;
      font-size: 17px;
      line-height: 1.4;
      overflow-wrap: anywhere;
      b {
        font-weight: 800;
        color: var(--text-strong);
      }
      span {
        color: var(--text);
      }
    }
    .close {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 0;
      border-radius: var(--r-sm);
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      svg {
        width: 20px;
        height: 20px;
      }
      &:hover {
        background: var(--surface-2);
        color: var(--text-strong);
      }
      &:focus-visible {
        outline: 2px solid var(--focus-ring);
        outline-offset: 2px;
      }
    }
    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation: none;
      }
    }
    /* phones: one compact toast over the header bar (logo and menu are hidden for a few seconds), so it never covers the
       page's own title and buttons, the keyboard or the sticky Transcribe bar at the bottom */
    @media (max-width: 719px) {
      :host {
        top: max(6px, env(safe-area-inset-top));
        bottom: auto;
        left: 8px;
        right: 8px;
        width: auto;
      }
      .toast {
        gap: 10px;
        padding: 8px 4px 8px 10px;
        border-width: 1px 1px 1px 6px;
      }
      .toast:not(:last-child) {
        display: none;
      }
      .ico {
        width: 28px;
        height: 28px;
        margin-top: 4px;
      }
      .body {
        display: block;
        padding-top: 4px;
        font-size: 16px;
        line-height: 1.35;
        b::after {
          content: ' ';
        }
      }
    }
  `,
})
export class Toasts {
  readonly toast = inject(ToastService);
}
