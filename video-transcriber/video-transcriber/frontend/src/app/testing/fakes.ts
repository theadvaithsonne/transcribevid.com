/** Test helpers shared by the specs. Not part of the app build (see tsconfig.app.json). */
import { Provider } from '@angular/core';
import { LogService } from '../core/log.service';
import { DEFAULT_OPTIONS, Health, Job, JobSummary, SessionInfo, Segment, SiteStats, Word } from '../core/models';

/** A minimal EventSource: the test decides which events arrive and when the connection fails. */
export class FakeEventSource {
  static instances: FakeEventSource[] = [];
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;

  readyState = 0;
  closed = false;
  onerror: ((ev: Event) => void) | null = null;
  onopen: ((ev: Event) => void) | null = null;
  private listeners = new Map<string, ((e: MessageEvent) => void)[]>();

  constructor(public url: string) {
    FakeEventSource.instances.push(this);
  }

  static reset() {
    FakeEventSource.instances = [];
  }

  addEventListener(type: string, fn: (e: MessageEvent) => void) {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), fn]);
  }

  close() {
    this.closed = true;
    this.readyState = FakeEventSource.CLOSED;
  }

  /** Server sends `event: <type>` with a JSON body. */
  emit(type: string, data: unknown) {
    for (const fn of this.listeners.get(type) ?? []) fn({ data: JSON.stringify(data) } as MessageEvent);
  }

  /** The connection dropped for good. */
  fail() {
    this.readyState = FakeEventSource.CLOSED;
    this.onerror?.(new Event('error'));
  }
}

export function makeSummary(over: Partial<JobSummary> = {}): JobSummary {
  return {
    id: 'j1',
    title: 'Interview',
    filename: 'interview.mp4',
    status: 'done',
    phase: null,
    progress: 1,
    eta_seconds: null,
    error: null,
    created_at: 1000,
    started_at: 1000,
    finished_at: 1100,
    language: 'en',
    duration: 60,
    size_bytes: 1024,
    media_kind: 'video',
    media_url: null,
    options: { ...DEFAULT_OPTIONS },
    segment_count: 0,
    ...over,
  };
}

export function makeJob(over: Partial<Job> = {}): Job {
  return { ...makeSummary(), segments: [], stats: null, language_probability: null, ...over };
}

/** What an older / local server answers: no public-site fields at all. */
export function makeHealth(over: Partial<Health> = {}): Health {
  return { status: 'ok', version: '1.2.3', device: 'cpu', compute_type: 'int8', session_id: 'run-1', persistent: false, ...over };
}

/** What the public website answers. */
export function makePublicHealth(over: Partial<Health> = {}): Health {
  return makeHealth({
    public: true,
    max_upload_mb: 2048,
    max_duration_min: 60,
    session_idle_minutes: 30,
    brand: { name: 'TranscribeVid', domain: 'transcribevid.com', url: 'https://transcribevid.com', contact_email: null },
    logs_enabled: false,
    logs_require_token: false,
    allowed_models: null,
    ...over,
  });
}

/** What BrowserTransport.health() makes up: the static website, where everything runs in the visitor's browser. */
export function makeBrowserHealth(over: Partial<Health> = {}): Health {
  return makeHealth({
    version: '',
    compute_type: 'browser',
    persistent: true,
    public: false,
    session_idle_minutes: 30,
    brand: null,
    logs_enabled: true,
    logs_require_token: false,
    allowed_models: null,
    runs_in: 'browser',
    ...over,
  });
}

export function makeSession(over: Partial<SessionInfo> = {}): SessionInfo {
  return { session_id: 'sess-1', created_at: 1000, last_seen: 1000, expires_in_seconds: 1800, job_count: 0, ...over };
}

/** What GET /api/stats answers on the public site (counting) unless a test says otherwise. */
export function makeStats(over: Partial<SiteStats> = {}): SiteStats {
  return { transcribed: 0, counting: true, ...over };
}

/** One transcript line. */
export function makeSegment(id: number, start: number, end: number, text: string, extra: Partial<Segment> = {}): Segment {
  return { id, start, end, text, words: null, confidence: 0.9, ...extra };
}

export function makeWord(word: string, start: number, probability: number, end = start + 0.4): Word {
  return { word, start, end, probability };
}

/** `n` consecutive one-second lines "line 0", "line 1", ... with ids 0..n-1. */
export function makeSegments(n: number): Segment[] {
  return Array.from({ length: n }, (_, i) => makeSegment(i, i, i + 0.9, `line ${i}`));
}

/**
 * Makes `new Intl.NumberFormat()` (the visitor's own locale, so "12,34,567" on an Indian-English machine) format as
 * en-US: tests that read thousands separators must not depend on the machine they run on. Call it before the
 * service under test is created; `vi.restoreAllMocks()` undoes it.
 */
export function useEnglishNumbers() {
  const Real = Intl.NumberFormat;
  return vi.spyOn(Intl, 'NumberFormat').mockImplementation(function (_locales?: unknown, options?: Intl.NumberFormatOptions) {
    return new Real('en-US', options);
  } as never);
}

/**
 * Pretends the browser tab is hidden / visible: `document.visibilityState` answers `state` from now on, and (unless
 * told otherwise) the `visibilitychange` event is sent like the browser does. Call `restoreVisibility()` in afterEach.
 */
export function setTabVisibility(state: 'visible' | 'hidden', notify = true) {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => state === 'hidden' });
  if (notify) document.dispatchEvent(new Event('visibilitychange'));
}

export function restoreVisibility() {
  Reflect.deleteProperty(document, 'visibilityState');
  Reflect.deleteProperty(document, 'hidden');
}

/** LogService stand-in that records calls instead of printing / posting them. */
export class SilentLog {
  calls: { level: string; message: string }[] = [];
  configured: { enabled: boolean; needsToken: boolean }[] = [];
  configure(opts: { enabled: boolean; needsToken: boolean }) {
    this.configured.push(opts);
  }
  debug(message: string) {
    this.calls.push({ level: 'DEBUG', message });
  }
  info(message: string) {
    this.calls.push({ level: 'INFO', message });
  }
  warn(message: string) {
    this.calls.push({ level: 'WARNING', message });
  }
  error(message: string) {
    this.calls.push({ level: 'ERROR', message });
  }
}

export const silentLog: Provider = { provide: LogService, useClass: SilentLog };

/** What FastAPI sends for an HTTP error, for `req.flush(body, opts)`. */
export function httpError(status: number, detail?: unknown) {
  return [detail === undefined ? {} : { detail }, { status, statusText: 'Error' }] as const;
}
