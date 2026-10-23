import { Injectable, computed, inject } from '@angular/core';
import { fmtBytesShort } from './format';
import { JobsStore } from './jobs.store';
import { Brand, Health } from './models';
import { ASSUME_PUBLIC } from './platform';

export const DEFAULT_BRAND: Brand = {
  name: 'TranscribeVid',
  domain: 'transcribevid.com',
  url: 'https://transcribevid.com',
  contact_email: null,
};
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

  /** True once the server has really answered (the assumed public defaults below are not an answer). */
  readonly answered = computed(() => !!this.store.health());
  /** The server's answer, or (on a prerendered page, until it answers) the public website's defaults. */
  private readonly h = computed<Health | null>(() => this.store.health() ?? (this.assumePublic ? ASSUMED_PUBLIC : null));

  readonly mode = computed<SiteMode>(() => {
    const h = this.h();
    return !h ? 'unknown' : h.public === true ? 'public' : 'local';
  });
  readonly isPublic = computed(() => this.mode() === 'public');
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
