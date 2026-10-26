import { NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, HostListener, computed, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AdsService } from './core/ads.service';
import { ApiService } from './core/api.service';
import { fmtEta, fmtTime, timeAgo } from './core/format';
import { errorDetail } from './core/http-error';
import { JobsStore } from './core/jobs.store';
import { JobSummary } from './core/models';
import { SessionService } from './core/session.service';
import { SiteService, TAGLINE } from './core/site.service';
import { StatsService } from './core/stats.service';
import { ThemeService } from './core/theme.service';
import { CORE_TOOLS } from './features/tool-pages/tool-pages.list';
import { AdRail } from './shared/ad-rail';
import { LanguageSwitcher } from './i18n/language-switcher';
import { LocaleHintBar } from './i18n/locale-hint-bar';
import { AdSlot } from './shared/ad-slot';
import { Logo } from './shared/logo';
import { Toasts } from './shared/toasts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgTemplateOutlet, Logo, Toasts, AdRail, AdSlot, LanguageSwitcher, LocaleHintBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  store = inject(JobsStore);
  theme = inject(ThemeService);
  site = inject(SiteService);
  session = inject(SessionService);
  stats = inject(StatsService);
  /** where ads may appear: the right-hand rail on ad pages (wide windows), and the consent link in the footer */
  ads = inject(AdsService);
  private api = inject(ApiService);
  private router = inject(Router);

  /** The mobile menu sheet (narrow windows) and the desktop "Transcripts" popover. */
  menuOpen = signal(false);
  popOpen = signal(false);
  deleting = signal(false);
  readonly tagline = TAGLINE;
  readonly year = new Date().getFullYear();
  /** the keyword landing pages: linked from the footer so every page links to them */
  /** the main tools, linked from every page's footer (the rest are one click away on "All tools") */
  readonly tools = CORE_TOOLS;

  private popWrap = viewChild<ElementRef<HTMLElement>>('popWrap');
  private popBtn = viewChild<ElementRef<HTMLButtonElement>>('popBtn');
  private menuBtn = viewChild<ElementRef<HTMLButtonElement>>('menuBtn');

  /** This visitor's transcripts, newest first. */
  jobs = computed(() => [...this.store.jobs()].sort((a, b) => b.created_at - a.created_at));
  /** Something is still being processed: the header button shows a pulsing dot. */
  busy = computed(() => this.jobs().some((j) => j.status === 'running' || j.status === 'queued'));
  /** The popover only exists while there is something to list. */
  popVisible = computed(() => this.popOpen() && this.jobs().length > 0);

  /** What happens to the data, worded for where the files really go (shown in full as a tooltip). */
  sessionNote = computed(() => {
    const h = this.store.health();
    if (!h) return '';
    if (this.site.inBrowser()) {
      const idle = this.site.idleText();
      const when = idle ? `after ${idle} of inactivity` : 'when the session ends';
      return `Your files never leave this device. Transcripts are kept in this browser only and deleted automatically ${when}, or when you press "Delete my data now". Export what you need before you leave.`;
    }
    if (this.site.isPublic()) {
      const idle = this.site.idleText();
      const when = idle ? `after ${idle} of inactivity` : 'when it ends';
      return `Your files and transcripts are kept only for this session and deleted automatically ${when}, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.`;
    }
    return h.persistent === false ? 'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.' : '';
  });

  /** The one quiet line next to "Delete my data now". */
  dataNote = computed(() => {
    if (!this.sessionNote()) return '';
    if (this.site.inBrowser()) return 'Stored on this device only, never uploaded.';
    return this.site.isPublic() ? 'Kept only for this session, then deleted automatically.' : 'Session only — nothing is saved.';
  });

  fmtTime = fmtTime;
  fmtEta = fmtEta;
  timeAgo = timeAgo;

  /** true on a transcript page: it shows its own full-page "session ended" message, so the shell banner stays away */
  readonly onJobPage = signal(false);

  constructor() {
    // any navigation (a row, a link, back/forward) closes whatever is open
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        this.onJobPage.set((e as NavigationEnd).urlAfterRedirects.startsWith('/jobs/'));
        this.closeAll();
      });
  }

  /**
   * Light/dark switch. The `theme-switching` class on <html> lets the global styles turn transitions off for the
   * moment of the switch, so every colour changes at once instead of fading piece by piece.
   */
  toggleTheme() {
    const root = document.documentElement;
    root.classList.add('theme-switching');
    this.theme.toggle();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
  }

  statusLabel(j: JobSummary) {
    switch (j.status) {
      case 'queued':
        return 'Queued';
      case 'running':
        return j.phase === 'transcribing' ? `Transcribing ${Math.round(j.progress * 100)}%` : 'Starting…';
      case 'error':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return fmtTime(j.duration);
    }
  }

  // ------------------------------------------------------------------ popover + mobile sheet
  togglePop() {
    if (this.popVisible()) return this.closePop();
    this.menuOpen.set(false);
    this.popOpen.set(true);
    setTimeout(() => this.popWrap()?.nativeElement.querySelector<HTMLElement>('.item')?.focus());
  }

  closePop(restoreFocus = true) {
    if (!this.popOpen()) return;
    this.popOpen.set(false);
    if (restoreFocus) this.popBtn()?.nativeElement.focus();
  }

  toggleMenu() {
    if (this.menuOpen()) return this.closeMenu();
    this.popOpen.set(false);
    this.menuOpen.set(true);
    setTimeout(() => document.querySelector<HTMLElement>('#mobile-menu .sheet-link')?.focus());
  }

  closeMenu(restoreFocus = true) {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    if (restoreFocus) this.menuBtn()?.nativeElement.focus();
  }

  closeAll() {
    this.popOpen.set(false);
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.popOpen()) this.closePop();
    else if (this.menuOpen()) this.closeMenu();
  }

  /** A click anywhere outside the popover closes it (clicks on the button itself are its own toggle). */
  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: Event) {
    if (!this.popOpen()) return;
    if (this.popWrap()?.nativeElement.contains(ev.target as Node)) return;
    this.closePop(false);
  }

  /** Tabbing out of the popover closes it as well. */
  onPopFocusOut(ev: FocusEvent) {
    const next = ev.relatedTarget as Node | null;
    if (this.popOpen() && next && !this.popWrap()?.nativeElement.contains(next)) this.closePop(false);
  }

  /**
   * A file dropped slightly outside the upload drop zone would make the browser navigate to it (and abort a
   * running upload), so cancel the default for file drags anywhere in the window. Other drags (selected text
   * into an input) are left alone.
   */
  @HostListener('window:dragover', ['$event'])
  @HostListener('window:drop', ['$event'])
  blockFileNavigation(ev: DragEvent) {
    if (ev.dataTransfer?.types?.includes('Files')) ev.preventDefault();
  }

  /** The in-browser engine works in this tab: closing or reloading it would stop a transcription, so ask first. */
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(ev: BeforeUnloadEvent) {
    if (!this.site.inBrowser() || !this.busy()) return;
    ev.preventDefault();
    ev.returnValue = '';
  }

  /** "Skip to main content": a plain #fragment link would navigate to the base href, so move the focus ourselves. */
  skipToContent(ev: Event) {
    ev.preventDefault();
    const main = document.getElementById('main');
    main?.focus();
    main?.scrollIntoView?.({ block: 'start' });
  }

  /**
   * "Privacy and cookie settings" (footer, ad pages, once ads are configured): re-opens Google's consent message so the
   * visitor can change the choice made there. Google's consent tool comes with the ad script; if it cannot load (an ad
   * blocker), say so plainly: then no ad and no ad cookie is loaded either.
   */
  openPrivacySettings() {
    void this.ads.openPrivacySettings().then((ok) => {
      if (!ok)
        this.store.notify(
          "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.",
          'info',
          'Privacy and cookie settings',
        );
    });
  }

  // ------------------------------------------------------------------ data
  /**
   * Wipes every transcript and uploaded file of this visitor (on the server, or in this browser), then resets the page.
   * The browser edition also offers to delete the downloaded speech models (large files, not personal data).
   */
  deleteMyData() {
    if (this.deleting()) return;
    const local = this.site.inBrowser();
    const what = local
      ? 'Delete all your transcripts and the files kept in this browser now?'
      : 'Delete all your transcripts and uploaded files now?';
    if (!confirm(`${what}\n\nThis cannot be undone. Export anything you want to keep first.`)) return;
    const deleteModels =
      local && confirm('Also delete the downloaded speech models?\n\nThey are downloaded again the next time you transcribe.');
    this.deleting.set(true);
    this.api.deleteSession(local ? { deleteModels } : undefined).subscribe({
      next: () => {
        this.deleting.set(false);
        this.session.reset();
        this.store.clearAll();
        if (deleteModels) this.store.refreshModels();
        this.closeAll();
        this.router.navigateByUrl('/');
        this.store.notify(
          local ? 'Your transcripts and files were removed from this device.' : 'Your transcripts and files were removed from the server.',
          'success',
          'All your data was deleted',
        );
      },
      error: (e) => {
        this.deleting.set(false);
        this.store.notify(errorDetail(e, 'Could not delete your data.'));
        this.store.refresh();
      },
    });
  }

  remove(ev: Event, j: JobSummary) {
    ev.preventDefault();
    ev.stopPropagation();
    const run = j.status === 'running';
    const msg = run ? `Cancel "${j.title}"?` : `Delete "${j.title}" and its transcript?`;
    if (!confirm(msg)) return;
    // a deleted transcript is gone, so leave its page; a cancelled one still exists (it shows "Cancelled"), so stay on it
    const done = () => {
      this.store.refresh();
      if (!run && this.router.url.includes(j.id)) this.router.navigateByUrl('/');
    };
    // e.g. 409 "Cancel the running job first." when the list was stale; resync the list either way
    const fail = (e: unknown) => {
      this.store.notify(errorDetail(e, run ? 'Could not cancel the transcript.' : 'Could not delete the transcript.'));
      this.store.refresh();
    };
    if (run) this.api.cancel(j.id).subscribe({ next: done, error: fail });
    else
      this.api.delete(j.id).subscribe({
        next: () => {
          this.store.remove(j.id);
          done();
        },
        error: fail,
      });
  }
}
