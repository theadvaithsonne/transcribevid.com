import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { ApiService } from './api.service';
import { JobsStore } from './jobs.store';
import { SessionInfo } from './models';
import { IS_BROWSER } from './platform';
import { SiteService } from './site.service';

const POLL_MS = 60_000;
/** the "your session ends soon" banner appears below this */
const WARN_SECONDS = 300;

/**
 * The visitor's server-side session on the public site: how long it still lives, and whether it has ended
 * (idle expiry deletes everything it held). Polled once a minute, only on the public site.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private api = inject(ApiService);
  private site = inject(SiteService);
  private store = inject(JobsStore);
  private browser = inject(IS_BROWSER);

  readonly info = signal<SessionInfo | null>(null);
  /** True after the session we were using vanished (expired or the server restarted); cleared by dismissEnded(). */
  readonly ended = signal(false);

  /** Whole minutes left as of the last poll (at least 1), or null when unknown. */
  readonly minutesLeft = computed(() => {
    const i = this.info();
    return i ? Math.max(1, Math.ceil(i.expires_in_seconds / 60)) : null;
  });
  /** Minutes to show in the "ends soon" banner, or null when there is nothing to warn about. */
  readonly endingSoon = computed(() => {
    const i = this.info();
    return i && !this.ended() && i.expires_in_seconds < WARN_SECONDS ? this.minutesLeft() : null;
  });

  private knownId: string | null = null;
  private running = false;
  private timer?: ReturnType<typeof setTimeout>;
  /** numbers the polls so that only the newest answer counts */
  private seq = 0;
  private hadJobs = false;

  constructor() {
    effect(() => {
      // only once the server has really said "public" (the assumed defaults of a prerendered page are not an answer),
      // and never while a page is prerendered
      // the in-browser edition ends idle sessions too (engine/session SessionStore), so it is watched the same way
      const on = this.browser && this.site.answered() && (this.site.isPublic() || this.site.inBrowser());
      untracked(() => (on ? this.start() : this.stop()));
    });
    // A history that suddenly empties is the first hint that the session expired: look at once instead of waiting
    // for the next poll. (Deleting the last transcript by hand does the same, which is harmless.)
    effect(() => {
      const count = this.store.jobs().length;
      untracked(() => {
        if (count > 0) this.hadJobs = true;
        else if (this.hadJobs) {
          this.hadJobs = false;
          if (this.running) this.poll();
        }
      });
    });
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.poll();
  }

  stop() {
    this.running = false;
    this.seq++; // an answer still on its way is ignored
    clearTimeout(this.timer);
  }

  dismissEnded() {
    this.ended.set(false);
  }

  /** After "Delete my data now" the visitor gets a fresh, empty session: that is not an ended session. */
  reset() {
    this.knownId = null;
    this.ended.set(false);
    this.info.set(null);
    if (this.running) this.poll();
  }

  /**
   * Asks the server whether the session this page was using is gone, for when a transcript can no longer be
   * found: true when the session changed since we last looked (or the server was restarted).
   */
  check(): Observable<boolean> {
    const before = this.store.health();
    return forkJoin({
      session: this.api.session(),
      health: this.api.health().pipe(catchError(() => of(null))),
    }).pipe(
      map(({ session, health }) => {
        const changed = this.apply(session);
        let restarted = false;
        if (health) {
          restarted = !!before?.session_id && !!health.session_id && health.session_id !== before.session_id;
          this.store.health.set(health);
          if (restarted) this.ended.set(true);
        }
        return changed || restarted || this.ended();
      }),
    );
  }

  private poll() {
    clearTimeout(this.timer);
    const mine = ++this.seq;
    this.api.session().subscribe({
      next: (i) => {
        if (mine !== this.seq) return; // a newer poll is on its way
        this.apply(i);
        this.next();
      },
      error: () => {
        if (mine === this.seq) this.next(); // keep the last answer; the next poll will tell
      },
    });
  }

  private next() {
    if (!this.running) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.poll(), POLL_MS);
  }

  /** Stores the answer; true when it shows that the session is not the one we knew (or has run out). */
  private apply(i: SessionInfo): boolean {
    const changed = (!!this.knownId && !!i.session_id && i.session_id !== this.knownId) || i.expires_in_seconds <= 0;
    if (i.session_id) this.knownId = i.session_id;
    this.info.set(i);
    if (changed) this.ended.set(true);
    return changed;
  }
}
