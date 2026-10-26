/**
 * The static website (Cloudflare Pages): no server, the engine runs in the visitor's browser (BrowserTransport).
 * Swapped in for environment.ts by the `production` configuration in angular.json.
 */
export const environment = {
  transport: 'browser' as 'server' | 'browser',
  /** AdSense units on the information pages and beside finished transcripts; inert until core/ads.config.ts has every slot id. */
  ads: true,
  /**
   * The counter Worker (workers/counter), routed on the site's own domain (Cloudflare: Workers Routes,
   * `transcribevid.com/api/*`). Until the Worker is deployed the request fails and the header pill simply stays hidden.
   * If the Worker runs on its workers.dev address instead, put that URL here (CORS allows https://transcribevid.com).
   */
  counterUrl: 'https://transcribevid.com/api',
  /** Translated pages (/es, /pt, ...): the website is available in every language that has pages (src/app/i18n). */
  languages: true,
};
