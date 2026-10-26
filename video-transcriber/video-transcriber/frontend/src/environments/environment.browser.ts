/**
 * The static website (Cloudflare Pages): no server, the engine runs in the visitor's browser (BrowserTransport).
 * Swapped in for environment.ts by the `production` configuration in angular.json.
 */
export const environment = {
  transport: 'browser' as 'server' | 'browser',
};
