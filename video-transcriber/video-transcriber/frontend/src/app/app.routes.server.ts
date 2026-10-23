import { RenderMode, ServerRoute } from '@angular/ssr';
import { TOOL_PAGES, toolRoutePath } from './features/tool-pages/tool-pages.list';

/**
 * How each route is built (production build only). Public, indexable pages are prerendered to static HTML at build
 * time, so search engines and social crawlers get the real text, title, description, canonical and JSON-LD without
 * running any JavaScript. Everything else is a client-rendered page: the build writes one shared `index.csr.html`
 * shell for them and the backend serves it (backend/app/main.py, `spa()`).
 *
 * A new public page: add its route to app.routes.ts and a `Prerender` entry here (the keyword pages come from
 * TOOL_PAGES, so adding a tool page there is enough), then add it to backend APP_PAGES and public/sitemap.xml.
 */
export const serverRoutes: ServerRoute[] = [
  // Home: prerendered too, so crawlers and first-time visitors get the real heading, chips and quality choices as HTML
  // (the uploader itself starts after the app takes over). index.csr.html stays the client-only shell for /jobs/<id>.
  { path: '', renderMode: RenderMode.Prerender },

  // prerendered
  { path: 'how-it-works', renderMode: RenderMode.Prerender },
  { path: 'faq', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  { path: 'terms', renderMode: RenderMode.Prerender },
  // keyword landing pages: /video-to-text, /audio-to-text, /mp4-to-text, ... (one list: tool-pages.list.ts)
  ...TOOL_PAGES.map((t): ServerRoute => ({ path: toolRoutePath(t), renderMode: RenderMode.Prerender })),

  // private or dynamic: never prerendered
  { path: 'jobs/:id', renderMode: RenderMode.Client }, // a visitor's own transcript, noindex
  { path: 'logs', renderMode: RenderMode.Client }, // operator page, noindex
  { path: 'about', renderMode: RenderMode.Client }, // redirects to /how-it-works in the app
  { path: '**', renderMode: RenderMode.Client }, // the "Page not found" page and anything unknown
];
