import { Injectable, computed, inject } from '@angular/core';
import { fmtBytesShort } from './format';
import { JobsStore } from './jobs.store';
import { Brand, Health } from './models';
import { SITE_BRAND } from './operator';
import { ASSUME_PUBLIC } from './platform';
import { TRANSPORT_KIND } from './transport/token';

/** A server build's brand until its server says otherwise: the public website's name, without a contact address (the server announces its own). */
export const DEFAULT_BRAND: Brand = { ...SITE_BRAND, contact_email: null };
export const TAGLINE = 'Video to text, accurately.';

/**
 * What the public website announces, used where the server has not answered (and cannot be asked): in the static HTML of
 * the prerendered pages, and in the browser until /api/health arrives on such a page. Crawlers never call /api/health, so
 * this is the text they index. The real server answer replaces every one of these as soon as it arrives.
 */
export const PUBLIC_DEFAULTS = { maxUploadMb: 500, maxDurationMin: 60, sessionIdleMinutes: 30 } as const;

/** The public website as a health answer: no version, no Logs link, no contact address, the default brand and limits. */
const ASSUMED_PUBLIC: Health = {
  status: 'ok',
  version: '',
  device: 'cpu',
  compute_type: '',
  public: true,
  max_upload_mb: PUBLIC_DEFAULTS.maxUploadMb,
  max_duration_min: PUBLIC_DEFAULTS.maxDurationMin,
  session_idle_minutes: PUBLIC_DEFAULTS.sessionIdleMinutes,
  logs_enabled: false,
};

/**
 * The static website (the in-browser edition) as a health answer, the same one BrowserTransport makes up: there is no server
 * to ask, so the build already knows it. Used in the prerendered HTML (what crawlers and the AdSense review read) and until
 * the transport's own answer arrives, so the browser edition never shows the public server's or the local install's words.
 */
const ASSUMED_BROWSER: Health = {
  status: 'ok',
  version: '',
  device: 'cpu',
  compute_type: 'browser',
  persistent: true,
  public: false,
  session_idle_minutes: PUBLIC_DEFAULTS.sessionIdleMinutes,
  logs_enabled: true,
  logs_require_token: false,
  allowed_models: null,
  runs_in: 'browser',
  brand: SITE_BRAND,
};

/**
 * `public`: the shared website, files are uploaded to a server. `local`: a private install on the user's own
 * computer. `unknown`: the server has not answered (yet), so no claim about where files go may be made.
 */
export type SiteMode = 'unknown' | 'local' | 'public';

const text = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);

/**
 * What the server says about itself (/api/health), reduced to the few things the UI branches on. Every field
 * of an older server's answer may be missing, so everything here has a safe default.
 */
@Injectable({ providedIn: 'root' })
export class SiteService {
  private store = inject(JobsStore);
  private assumePublic = inject(ASSUME_PUBLIC);
  /** 'browser' = this build is the static website (the engine runs in the visitor's browser); known at build time. */
  private readonly kind = inject(TRANSPORT_KIND);
  /** The answer assumed until a real one arrives: the browser edition always knows itself; a server build only on prerendered pages. */
  private readonly assumed: Health | null = this.kind === 'browser' ? ASSUMED_BROWSER : this.assumePublic ? ASSUMED_PUBLIC : null;

  /** True once the server has really answered (the assumed public defaults below are not an answer). */
  readonly answered = computed(() => !!this.store.health());
  /**
   * The server's answer, or until it answers: the browser edition's own description (always), or the public website's
   * defaults (a server build, on a prerendered page).
   */
  private readonly h = computed<Health | null>(() => this.store.health() ?? this.assumed);

  readonly mode = computed<SiteMode>(() => {
    const h = this.h();
    return !h ? 'unknown' : h.public === true ? 'public' : 'local';
  });
  readonly isPublic = computed(() => this.mode() === 'public');
  /**
   * The in-browser edition (no server: the file never leaves this device, jobs live in this browser for the session).
   * Its mode is 'local' (no shared server), and every page that describes where data goes has its own browser wording
   * (privacy, terms, FAQ, how it works, tool pages, the session note). True from the first render in the browser build,
   * including the prerendered HTML.
   */
  readonly inBrowser = computed(() => this.h()?.runs_in === 'browser');
  readonly isLocal = computed(() => this.mode() === 'local');

  readonly brand = computed<Brand>(() => {
    const b = this.h()?.brand;
    return {
      name: text(b?.name) ?? DEFAULT_BRAND.name,
      domain: text(b?.domain) ?? DEFAULT_BRAND.domain,
      url: (text(b?.url) ?? DEFAULT_BRAND.url).replace(/\/+$/, ''),
      contact_email: text(b?.contact_email),
    };
  });
  readonly contactEmail = computed(() => this.brand().contact_email);
  readonly version = computed(() => text(this.h()?.version));

  /** The Logs link and page are an admin feature: only offered when the server says they exist. */
  readonly logsEnabled = computed(() => this.h()?.logs_enabled === true);
  readonly logsRequireToken = computed(() => this.h()?.logs_require_token === true);

  /** null = every model may be used. */
  readonly allowedModels = computed<string[] | null>(() => {
    const a = this.h()?.allowed_models;
    return Array.isArray(a) ? a : null;
  });

  readonly maxUploadMb = computed(() => {
    const n = this.h()?.max_upload_mb;
    return typeof n === 'number' && n > 0 ? n : null;
  });
  /** null = no limit */
  readonly maxDurationMin = computed(() => {
    const n = this.h()?.max_duration_min;
    return typeof n === 'number' && n > 0 ? n : null;
  });
  readonly idleMinutes = computed(() => {
    const n = this.h()?.session_idle_minutes;
    return typeof n === 'number' && n > 0 ? n : null;
  });

  readonly maxSizeText = computed(() => {
    const mb = this.maxUploadMb();
    return mb ? fmtBytesShort(mb * 1024 * 1024) : null;
  });
  readonly maxMinutesText = computed(() => {
    const m = this.maxDurationMin();
    return m ? `${m} ${m === 1 ? 'minute' : 'minutes'}` : null;
  });

  /** "Up to 500 MB and 60 minutes per file." (just the limits that exist; '' when there are none) */
  readonly limitsText = computed(() => {
    const parts = [this.maxSizeText(), this.maxMinutesText()].filter((p): p is string => !!p);
    return parts.length ? `Up to ${parts.join(' and ')} per file.` : '';
  });

  /** "after 60 minutes of inactivity" / "after a period of inactivity" */
  readonly idleText = computed(() => {
    const n = this.idleMinutes();
    return n ? `${n} ${n === 1 ? 'minute' : 'minutes'}` : null;
  });

  /** A developer running the UI on this computer: worth telling how to start the backend when it is down. */
  readonly devHint = computed(() => {
    if (this.inBrowser()) return false; // there is no backend to start
    const m = this.mode();
    if (m === 'local') return true;
    if (m === 'public') return false;
    try {
      return ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
    } catch {
      return false;
    }
  });

  modelAllowed(id: string): boolean {
    const a = this.allowedModels();
    return !a || a.includes(id);
  }
}
