import { RenderMode, ServerRoute } from '@angular/ssr';
import { environment } from '../environments/environment';
import { appPages } from './app.routes';
import { AVAILABLE } from './i18n/generated';
import { OTHER_LOCALES } from './i18n/locales';
import { localizedPaths } from './i18n/routes';
import { GUIDES, guideRoutePath } from './features/guides/guides.list';
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
export const makeServerRoutes = (languages: boolean): ServerRoute[] => [
  // Home: prerendered too, so crawlers and first-time visitors get the real heading, chips and quality choices as HTML
  // (the uploader itself starts after the app takes over). index.csr.html stays the client-only shell for /jobs/<id>.
  { path: '', renderMode: RenderMode.Prerender },

  // prerendered
  { path: 'how-it-works', renderMode: RenderMode.Prerender },
  { path: 'faq', renderMode: RenderMode.Prerender },
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },
  { path: 'privacy', renderMode: RenderMode.Prerender },
  { path: 'terms', renderMode: RenderMode.Prerender },
  // keyword landing pages: /video-to-text, /audio-to-text, /mp4-to-text, ... (one list: tool-pages.list.ts)
  ...TOOL_PAGES.map((t): ServerRoute => ({ path: toolRoutePath(t), renderMode: RenderMode.Prerender })),
  // the tools index, the guides index and every guide (one list: guides.list.ts)
  { path: 'tools', renderMode: RenderMode.Prerender },
  { path: 'guides', renderMode: RenderMode.Prerender },
  ...GUIDES.map((g): ServerRoute => ({ path: guideRoutePath(g), renderMode: RenderMode.Prerender })),

  // the translated pages (/es, /es/video-a-texto, ...): prerendered like the English ones; their transcript pages and 404 are client-only
  ...(languages
    ? [
        ...localizedPaths(appPages, { available: AVAILABLE }).map((path): ServerRoute => ({ path, renderMode: RenderMode.Prerender })),
        ...OTHER_LOCALES.filter((l) => (AVAILABLE[l] ?? []).length).flatMap(
          (l): ServerRoute[] => [
            { path: `${l}/jobs/:id`, renderMode: RenderMode.Client },
            { path: `${l}/**`, renderMode: RenderMode.Client },
          ],
        ),
      ]
    : []),

  // private or dynamic: never prerendered
  { path: 'jobs/:id', renderMode: RenderMode.Client }, // a visitor's own transcript, noindex
  { path: 'logs', renderMode: RenderMode.Client }, // operator page, noindex
  { path: '**', renderMode: RenderMode.Client }, // the "Page not found" page and anything unknown
];

/** What this build prerenders: the translated pages too, in the edition that has languages (the static website). */
export const serverRoutes: ServerRoute[] = makeServerRoutes(environment.languages === true);
