import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, computed, effect, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { JobsStore } from './jobs.store';
import { JobStatus, JobSummary, SiteStats } from './models';
import { IS_BROWSER } from './platform';

const POLL_MS = 60_000;
/** A moment after a transcription finishes the server has counted it. */
const AFTER_DONE_MS = 2_000;
/** After this many failures in a row the pill is hidden, and the poll slows down so a missing endpoint is not hammered. */
const MAX_FAILURES = 3;
const SLOW_POLL_MS = 5 * 60_000;

/**
 * The counter Worker of the static website (workers/counter, environment.counterUrl), without a trailing slash:
 * `GET <url>/stats` reads the total, `POST <url>/count` adds one finished transcription. '' = ask this edition's own
 * server (`/api/stats`, which counts by itself). A token so a spec can switch it.
 */
export const COUNTER_URL = new InjectionToken<string>('COUNTER_URL', {
  providedIn: 'root',
  factory: () => (environment.counterUrl || '').replace(/\/+$/, ''),
});

/** Only a well-formed answer counts; anything else is treated as "unknown". */
function parse(raw: unknown): SiteStats | null {
  if (!raw || typeof raw !== 'object') return null;
  const { transcribed, counting } = raw as Record<string, unknown>;
  if (typeof counting !== 'boolean') return null;
  if (typeof transcribed !== 'number' || !Number.isFinite(transcribed) || transcribed < 0) return null;
  return { transcribed: Math.floor(transcribed), counting };
}

/**
 * "How many videos this website has transcribed", for the counter in the header. It only ever shows what the server
 * says: it never guesses, offsets or fakes a number, and a failure is silent (the pill just stays hidden).
 *
 * Fetched once on start, then every 60 seconds while the tab is visible, and once more shortly after one of the
 * visitor's own transcriptions finishes.
 *
 * The static website has no server of its own: it reads the total from the counter Worker (COUNTER_URL), and when one
 * of this tab's transcriptions finishes it reports it there (one anonymous POST, nothing else is sent). That number is
 * reported by visitors' browsers, so the tooltip says so and never calls it verified; any error hides the pill.
 */
@Injectable({ providedIn: 'root' })
export class StatsService {
  private api = inject(ApiService);
  private http = inject(HttpClient);
  private store = inject(JobsStore);
  private browser = inject(IS_BROWSER);
  /** '' = this edition's own server counts; otherwise the counter Worker's address */
  private counter = inject(COUNTER_URL);

  /** null = unknown (not answered yet, or the server could not tell): the pill is hidden. */
  readonly stats = signal<SiteStats | null>(null);

  /**
   * The public site shows the pill once at least one video was transcribed. A copy that does not count (local or dev)
   * shows it with 0 and a tooltip saying so. Unknown: hidden.
   */
  readonly visible = computed(() => {
    const s = this.stats();
    return !!s && (!s.counting || s.transcribed >= 1);
  });
  readonly counting = computed(() => this.stats()?.counting === true);
  readonly count = computed(() => this.stats()?.transcribed ?? 0);

  private readonly nf = new Intl.NumberFormat();
  /** "12,345" (thousands separators) */
  readonly formatted = computed(() => this.nf.format(this.count()));
  /** "12,345 videos transcribed" (used as the accessible name and for the full label) */
  readonly label = computed(() => `${this.formatted()} ${this.count() === 1 ? 'video' : 'videos'} transcribed`);
  /** The tooltip: the full label, or why the number is 0 on a copy that does not count. */
  readonly title = computed(() => {
    if (!this.counting()) return 'This local copy does not count transcriptions';
    // the Worker's number comes from visitors' browsers: say so, and never call it verified
    return this.counter ? `${this.label()}, as reported by visitors' browsers` : this.label();
  });
  readonly ariaLabel = computed(() => (this.counting() ? this.label() : `${this.label()}. ${this.title()}.`));

  private timer?: ReturnType<typeof setTimeout>;
  private soonTimer?: ReturnType<typeof setTimeout>;
  private pending = false;
  /** a fresh refresh was asked for while a request was in flight: repeat once when it ends */
  private again = false;
  private failures = 0;
  /** a poll tick came while the tab was hidden: fetch as soon as it is visible again */
  private stale = false;

  // for noticing that one of the visitor's transcriptions has just finished
  private seen = new Map<string, JobStatus>();
  private primed = false;

  constructor() {
    // While a page is prerendered there is no server and no tab: no request, no timer, no listener, and the pill stays
    // hidden (it never appears in the static HTML).
    if (!this.browser) return;
    this.load();
    document.addEventListener('visibilitychange', () => {
      if (this.tabVisible() && this.stale) this.load();
    });
    effect(() => this.watchJobs(this.store.jobs(), this.store.loaded()));
  }

  private tabVisible() {
    return typeof document === 'undefined' || document.visibilityState !== 'hidden';
  }

  private load(fresh = false) {
    if (this.pending) {
      // a poll is already in flight, but it may have been sent before the news that asked for this refresh: go again after it
      if (fresh) this.again = true;
      return;
    }
    this.pending = true;
    this.again = false;
    this.stale = false;
    clearTimeout(this.timer);
    this.read(fresh).subscribe({
      next: (raw) => {
        this.pending = false;
        const s = parse(raw);
        if (s) {
          this.failures = 0;
          this.stats.set(s);
        } else {
          this.fail();
        }
        this.schedule();
        if (this.again) this.load(true);
      },
      error: () => {
        this.pending = false;
        this.fail();
        this.schedule();
        if (this.again) this.load(true);
      },
    });
  }

  /** The total: from the counter Worker on the static website, else from this edition's own server. */
  private read(fresh: boolean): Observable<unknown> {
    return this.counter ? this.http.get<unknown>(`${this.counter}/stats`) : this.api.stats(fresh);
  }

  /**
   * Tells the counter Worker that `n` of this tab's transcriptions finished: one POST each, no body, no identifier. The
   * answer is the new total. A failure is silent (the next poll shows whatever the Worker has).
   */
  private report(n: number) {
    for (let i = 0; i < n; i++) {
      this.http.post<unknown>(`${this.counter}/count`, null).subscribe({
        next: (raw) => {
          const s = parse(raw);
          if (!s) return;
          this.failures = 0;
          this.stats.set(s);
        },
        error: () => undefined,
      });
    }
  }

  /** Never throws or toasts. A shown number survives a hiccup or two; after that the pill hides. */
  private fail() {
    this.failures++;
    if (this.failures >= MAX_FAILURES || !this.stats()) this.stats.set(null);
  }

  private schedule() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.tick(), this.failures >= MAX_FAILURES ? SLOW_POLL_MS : POLL_MS);
  }

  private tick(fresh = false) {
    if (this.tabVisible()) this.load(fresh);
    else this.stale = true; // polling resumes when the tab is shown again
  }

  private watchJobs(rows: JobSummary[], loaded: boolean) {
    if (!loaded) return;
    const finished =
      this.primed && rows.some((j) => j.status === 'done' && (this.seen.has(j.id) ? this.seen.get(j.id) !== 'done' : true));
    // reported to the Worker: only what this tab itself saw being worked on (not a list loaded after a reload, not a
    // transcript another tab finished)
    const mine = this.primed
      ? rows.filter((j) => j.status === 'done' && (this.seen.get(j.id) === 'running' || this.seen.get(j.id) === 'queued')).length
      : 0;
    this.seen = new Map(rows.map((j) => [j.id, j.status]));
    this.primed = true;
    if (this.counter) {
      if (mine) this.report(mine);
    } else if (finished) this.soon();
  }

  private soon() {
    clearTimeout(this.soonTimer);
    this.soonTimer = setTimeout(() => this.tick(true), AFTER_DONE_MS);
  }
}
