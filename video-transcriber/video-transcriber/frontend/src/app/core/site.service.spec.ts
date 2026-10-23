import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { makeHealth, makePublicHealth, silentLog } from '../testing/fakes';
import { JobsStore } from './jobs.store';
import { ASSUME_PUBLIC } from './platform';
import { PUBLIC_DEFAULTS, SiteService } from './site.service';

describe('SiteService', () => {
  let site: SiteService;
  let store: JobsStore;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting()] });
    store = TestBed.inject(JobsStore);
    site = TestBed.inject(SiteService);
    // the store's start-up requests stay unanswered: the tests set the health themselves
  });

  afterEach(() => vi.useRealTimers());

  describe('mode', () => {
    it('is unknown until the server has answered, so no claim about where files go can be made', () => {
      expect(site.mode()).toBe('unknown');
      expect(site.isPublic()).toBe(false);
      expect(site.isLocal()).toBe(false);
    });

    it('is local for a server that does not say it is public (an older answer has no such field)', () => {
      store.health.set(makeHealth());
      expect(site.mode()).toBe('local');
      expect(site.isLocal()).toBe(true);
      expect(site.isPublic()).toBe(false);
    });

    it('is public only when the server says so', () => {
      store.health.set(makePublicHealth());
      expect(site.mode()).toBe('public');
      store.health.set(makePublicHealth({ public: false }));
      expect(site.mode()).toBe('local');
    });
  });

  describe('brand', () => {
    it('falls back to TranscribeVid when the server sends no brand', () => {
      expect(site.brand()).toEqual({
        name: 'TranscribeVid',
        domain: 'transcribevid.com',
        url: 'https://transcribevid.com',
        contact_email: null,
      });
      store.health.set(makeHealth());
      expect(site.brand().name).toBe('TranscribeVid');
      expect(site.contactEmail()).toBeNull();
    });

    it('uses what the server sends, ignores blanks and strips a trailing slash from the url', () => {
      store.health.set(
        makePublicHealth({ brand: { name: 'Acme Scribe', domain: '  ', url: 'https://acme.example/', contact_email: ' hi@acme.example ' } }),
      );
      expect(site.brand()).toEqual({
        name: 'Acme Scribe',
        domain: 'transcribevid.com',
        url: 'https://acme.example',
        contact_email: 'hi@acme.example',
      });
      expect(site.contactEmail()).toBe('hi@acme.example');
    });

    it('has no contact e-mail when it is null or empty', () => {
      store.health.set(makePublicHealth({ brand: { contact_email: null } }));
      expect(site.contactEmail()).toBeNull();
      store.health.set(makePublicHealth({ brand: { contact_email: '' } }));
      expect(site.contactEmail()).toBeNull();
    });

    it('reports the version', () => {
      expect(site.version()).toBeNull();
      store.health.set(makeHealth({ version: '2.5.0' }));
      expect(site.version()).toBe('2.5.0');
    });
  });

  describe('logs (an admin feature)', () => {
    it('are only offered when the server says they are enabled', () => {
      expect(site.logsEnabled()).toBe(false);
      store.health.set(makeHealth());
      expect(site.logsEnabled()).toBe(false);
      store.health.set(makePublicHealth({ logs_enabled: false }));
      expect(site.logsEnabled()).toBe(false);
      store.health.set(makePublicHealth({ logs_enabled: true }));
      expect(site.logsEnabled()).toBe(true);
    });

    it('know whether a token is needed', () => {
      store.health.set(makePublicHealth({ logs_enabled: true, logs_require_token: true }));
      expect(site.logsRequireToken()).toBe(true);
      store.health.set(makePublicHealth({ logs_enabled: true }));
      expect(site.logsRequireToken()).toBe(false);
    });
  });

  describe('allowed models', () => {
    it('allows everything without a list (null, missing or not a list)', () => {
      expect(site.allowedModels()).toBeNull();
      expect(site.modelAllowed('large-v3')).toBe(true);
      store.health.set(makePublicHealth({ allowed_models: null }));
      expect(site.modelAllowed('large-v3')).toBe(true);
      store.health.set(makePublicHealth({ allowed_models: 'tiny' as unknown as string[] }));
      expect(site.allowedModels()).toBeNull();
    });

    it('allows only the listed models', () => {
      store.health.set(makePublicHealth({ allowed_models: ['base', 'small'] }));
      expect(site.allowedModels()).toEqual(['base', 'small']);
      expect(site.modelAllowed('small')).toBe(true);
      expect(site.modelAllowed('large-v3')).toBe(false);
    });
  });

  describe('limits', () => {
    it('words both limits', () => {
      store.health.set(makePublicHealth({ max_upload_mb: 2048, max_duration_min: 60 }));
      expect(site.limitsText()).toBe('Up to 2 GB and 60 minutes per file.');
    });

    it('leaves out a duration of 0 (unlimited)', () => {
      store.health.set(makePublicHealth({ max_upload_mb: 4096, max_duration_min: 0 }));
      expect(site.maxDurationMin()).toBeNull();
      expect(site.limitsText()).toBe('Up to 4 GB per file.');
    });

    it('can have only a duration, and says "1 minute" in the singular', () => {
      store.health.set(makePublicHealth({ max_upload_mb: undefined, max_duration_min: 1 }));
      expect(site.limitsText()).toBe('Up to 1 minute per file.');
    });

    it('is empty without any limit', () => {
      expect(site.limitsText()).toBe('');
      store.health.set(makeHealth());
      expect(site.limitsText()).toBe('');
    });

    it('words the idle time of a session', () => {
      expect(site.idleText()).toBeNull();
      store.health.set(makePublicHealth({ session_idle_minutes: 30 }));
      expect(site.idleText()).toBe('30 minutes');
      store.health.set(makePublicHealth({ session_idle_minutes: 1 }));
      expect(site.idleText()).toBe('1 minute');
    });
  });

  describe('developer hint', () => {
    it('is wanted for a local install, never for the public site', () => {
      store.health.set(makeHealth());
      expect(site.devHint()).toBe(true);
      store.health.set(makePublicHealth());
      expect(site.devHint()).toBe(false);
    });

    it('while the server is silent it depends on running on this computer (jsdom is localhost)', () => {
      expect(site.devHint()).toBe(true);
    });
  });

  describe('a prerendered page (no server answer yet): the public website is assumed', () => {
    function assumePublic() {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), { provide: ASSUME_PUBLIC, useValue: true }],
      });
      store = TestBed.inject(JobsStore);
      site = TestBed.inject(SiteService);
    }

    it('is the public site, with its default brand, before the server has said anything', () => {
      assumePublic();
      expect(site.mode()).toBe('public');
      expect(site.isPublic()).toBe(true);
      expect(site.isLocal()).toBe(false);
      expect(site.brand()).toEqual({ name: 'TranscribeVid', domain: 'transcribevid.com', url: 'https://transcribevid.com', contact_email: null });
    });

    it('is not an answer: the session check and the logs stay off until the server really answers', () => {
      assumePublic();
      expect(site.answered()).toBe(false);
      expect(site.logsEnabled()).toBe(false);
      expect(site.version()).toBeNull();
      expect(site.contactEmail()).toBeNull();
    });

    it('announces the public limits and idle time (what a crawler reads)', () => {
      assumePublic();
      expect(site.maxUploadMb()).toBe(PUBLIC_DEFAULTS.maxUploadMb);
      expect(site.maxDurationMin()).toBe(PUBLIC_DEFAULTS.maxDurationMin);
      expect(site.idleMinutes()).toBe(PUBLIC_DEFAULTS.sessionIdleMinutes);
      expect(site.limitsText()).toMatch(/^Up to \d+(\.\d+)? (MB|GB) and \d+ minutes per file\.$/);
      expect(site.idleText()).toBe(`${PUBLIC_DEFAULTS.sessionIdleMinutes} minutes`);
    });

    it('is not a developer hint (nobody on the public site starts a backend)', () => {
      assumePublic();
      expect(site.devHint()).toBe(false);
    });

    it('allows every model until the server says otherwise', () => {
      assumePublic();
      expect(site.allowedModels()).toBeNull();
      expect(site.modelAllowed('large-v3')).toBe(true);
    });

    it('the real answer replaces every assumption at once (a local install is local, the server limits win)', () => {
      assumePublic();
      store.health.set(makeHealth({ max_upload_mb: 100 }));
      expect(site.answered()).toBe(true);
      expect(site.mode()).toBe('local');
      expect(site.limitsText()).toBe('Up to 100 MB per file.');
      expect(site.idleText()).toBeNull();
      store.health.set(makePublicHealth({ max_upload_mb: 4096, max_duration_min: 0, session_idle_minutes: 45, brand: { name: 'Acme' } }));
      expect(site.limitsText()).toBe('Up to 4 GB per file.');
      expect(site.idleText()).toBe('45 minutes');
      expect(site.brand().name).toBe('Acme');
    });

    it('without the assumption and without an answer nothing is claimed (the normal browser start)', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ providers: [silentLog, provideHttpClient(), provideHttpClientTesting(), { provide: ASSUME_PUBLIC, useValue: false }] });
      site = TestBed.inject(SiteService);
      expect(site.mode()).toBe('unknown');
      expect(site.limitsText()).toBe('');
      expect(site.maxUploadMb()).toBeNull();
    });
  });
});
