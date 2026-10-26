import { Injectable, inject, signal } from '@angular/core';
import { _t } from '../i18n/mark';
import { I18nService } from '../i18n/i18n.service';
import { IS_BROWSER } from './platform';

export type ToastKind = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  /** one or two words in bold ("Copied", "Upload failed") */
  title: string;
  /** one plain sentence; '' for a title-only toast */
  message: string;
}

export interface ToastOptions {
  /** how long it stays, in ms; 0 keeps it until it is closed */
  duration?: number;
}

/** How long each kind stays on screen. Errors stay longer: they usually need reading. */
export const TOAST_DURATION: Record<ToastKind, number> = { success: 4000, info: 5000, warning: 7000, error: 9000 };
/** At most this many at once: a new one pushes the oldest out. */
export const TOAST_MAX = 3;

/** English; translated when the toast is made. */
const DEFAULT_TITLE: Record<ToastKind, string> = { success: _t('Done'), error: _t('Something went wrong'), warning: _t('Please note'), info: _t('Note') };

/**
 * Short pop-up messages (like Bootstrap's toasts): stacked, a coloured icon per kind, a close button, and they hide by
 * themselves. A toast pauses while the pointer is on it or it has keyboard focus, so it never vanishes while being read.
 * The same message twice in a row is not stacked: the visible one simply stays longer.
 *
 *   toast.success('Transcript copied');            toast.error('Could not save the change.', 'Not saved');
 *
 * The text is shown as given: translate it where the toast is made (`toast.success(this.i18n.t('...'), this.i18n.t('...'))`);
 * only the default titles are translated here.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private browser = inject(IS_BROWSER);
  private i18n = inject(I18nService);
  readonly toasts = signal<Toast[]>([]);

  private nextId = 1;
  private timers = new Map<number, ReturnType<typeof setTimeout>>();
  private remaining = new Map<number, { ms: number; since: number }>();

  success(message: string, title?: string, opts?: ToastOptions) {
    return this.show('success', message, title, opts);
  }
  error(message: string, title?: string, opts?: ToastOptions) {
    return this.show('error', message, title, opts);
  }
  warning(message: string, title?: string, opts?: ToastOptions) {
    return this.show('warning', message, title, opts);
  }
  info(message: string, title?: string, opts?: ToastOptions) {
    return this.show('info', message, title, opts);
  }

  /** Shows a toast and returns its id. Nothing happens while a page is prerendered (there is no one to see it). */
  show(kind: ToastKind, message: string, title?: string, opts: ToastOptions = {}): number {
    if (!this.browser) return 0;
    const text = (message ?? '').trim();
    const head = (title ?? this.i18n.t(DEFAULT_TITLE[kind])).trim();
    const duration = opts.duration ?? TOAST_DURATION[kind];

    const same = this.toasts().find((t) => t.kind === kind && t.title === head && t.message === text);
    if (same) {
      this.arm(same.id, duration); // already on screen: give it its full time again instead of stacking a copy
      return same.id;
    }

    const toast: Toast = { id: this.nextId++, kind, title: head, message: text };
    const list = [...this.toasts(), toast];
    while (list.length > TOAST_MAX) this.clearTimer(list.shift()!.id);
    this.toasts.set(list);
    this.arm(toast.id, duration);
    return toast.id;
  }

  dismiss(id: number) {
    this.clearTimer(id);
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clear() {
    for (const t of this.toasts()) this.clearTimer(t.id);
    this.toasts.set([]);
  }

  /** The pointer is on it or it has focus: stop the clock. */
  pause(id: number) {
    const left = this.remaining.get(id);
    const timer = this.timers.get(id);
    if (!left || timer === undefined) return;
    clearTimeout(timer);
    this.timers.delete(id);
    left.ms = Math.max(0, left.ms - (Date.now() - left.since));
  }

  /** Start the clock again with the time that was left (at least 2 s, so it does not vanish the moment you look away). */
  resume(id: number) {
    const left = this.remaining.get(id);
    if (!left || this.timers.has(id) || !this.toasts().some((t) => t.id === id)) return;
    this.arm(id, Math.max(2000, left.ms));
  }

  private arm(id: number, ms: number) {
    this.clearTimer(id);
    if (ms <= 0) return; // stays until closed
    this.remaining.set(id, { ms, since: Date.now() });
    this.timers.set(id, setTimeout(() => this.dismiss(id), ms));
  }

  private clearTimer(id: number) {
    const timer = this.timers.get(id);
    if (timer !== undefined) clearTimeout(timer);
    this.timers.delete(id);
    this.remaining.delete(id);
  }
}
