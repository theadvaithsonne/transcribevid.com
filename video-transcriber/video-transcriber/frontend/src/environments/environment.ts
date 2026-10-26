/**
 * Build-time settings of this edition. This file is the one `ng serve` (development), the `self-hosted` build and the
 * unit tests use: the app talks to the Python API (ServerTransport). The `production` build (the static website)
 * replaces it with environment.browser.ts (angular.json fileReplacements).
 */
export const environment = {
  /** 'server' = HTTP + SSE to the self-hosted API; 'browser' = everything runs in the visitor's browser */
  transport: 'server' as 'server' | 'browser',
  /**
   * The edition shows Google AdSense units (the static website only). Even then nothing loads until every ad unit id is
   * set in core/ads.config.ts. A local or self-hosted install never shows ads.
   */
  ads: false,
  /**
   * The "videos transcribed" counter Worker (workers/counter), without a trailing slash: GET <url>/stats, POST <url>/count.
   * '' = this edition asks its own server (/api/stats) instead.
   */
  counterUrl: '',
};
