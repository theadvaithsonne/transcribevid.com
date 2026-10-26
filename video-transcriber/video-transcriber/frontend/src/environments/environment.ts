/**
 * Build-time settings of this edition. This file is the one `ng serve` (development), the `self-hosted` build and the
 * unit tests use: the app talks to the Python API (ServerTransport). The `production` build (the static website)
 * replaces it with environment.browser.ts (angular.json fileReplacements).
 */
export const environment = {
  /** 'server' = HTTP + SSE to the self-hosted API; 'browser' = everything runs in the visitor's browser */
  transport: 'server' as 'server' | 'browser',
};
