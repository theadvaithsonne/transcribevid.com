import { Route, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { adFreeDocument } from './core/ads.service';
import { DEFAULT_DESCRIPTION } from './core/title.service';
import { GUIDES, GUIDES_PATH, GuideLink, guideRoutePath } from './features/guides/guides.list';
import { guideContentResolver } from './features/guides/guide-content.resolver';
import { toolContentResolver } from './features/tool-pages/tool-content.resolver';
import { AVAILABLE } from './i18n/generated';
import { localizedRoutes } from './i18n/routes';
import { TOOL_PAGES, ToolPageLink, toolRoutePath } from './features/tool-pages/tool-pages.list';

/** A keyword landing page: its title, description and label come from TOOL_PAGES, its text from features/tool-pages/content. */
const toolRoute = (t: ToolPageLink): Route => ({
  path: toolRoutePath(t),
  title: t.title,
  data: { description: t.description, label: t.label, tool: toolRoutePath(t), app: true, ads: true },
  resolve: { content: toolContentResolver },
  loadComponent: () => import('./features/tool-pages/tool-page').then((m) => m.ToolPage),
});

/** A guide (an article): its title, description and label come from GUIDES, its text from features/guides/content. */
const guideRoute = (g: GuideLink): Route => ({
  path: guideRoutePath(g),
  title: g.title,
  data: { description: g.description, label: g.label, guide: g.slug, parent: { label: 'Guides', path: GUIDES_PATH }, ads: true },
  resolve: { content: guideContentResolver },
  loadComponent: () => import('./features/guides/guide').then((m) => m.GuidePage),
});

/**
 * `title` is the page name (the strategy in core/title.service.ts appends the brand); `data.description` feeds the
 * meta description and `data.noindex` keeps private / admin pages out of search results.
 *
 * `data.ads` marks the pages that may show ads in the edition that has them (core/ads.service.ts): `true` for the
 * information pages (home, how it works, FAQ, the tool pages, the guides). Every
 * other page (privacy, terms, logs, 404 and every transcript page: see adsense.md section 5) never shows one. `data.adSlot: 'end'`: the app
 * shell draws that page's in-flow unit (tablet / phone) after the page instead of the page's own template. `adFreeDocument` opens privacy,
 * terms and logs with a full page load once Google's script is in the tab, so those documents never carry it.
 */
export const appPages: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Free Video & Audio to Text Transcription',
    data: { description: DEFAULT_DESCRIPTION, ads: true, adSlot: 'end' },
    loadComponent: () => import('./features/upload/upload').then((m) => m.UploadPage),
  },
  {
    path: 'jobs/:id',
    title: 'Transcript',
    data: { noindex: true },
    loadComponent: () => import('./features/job/job').then((m) => m.JobPage),
  },
  {
    path: 'how-it-works',
    title: 'How it works',
    data: {
      description:
        'How TranscribeVid turns video and audio into accurate, timestamped text in three simple steps, what you get, and tips for the best results.',
      ads: true,
    },
    loadComponent: () => import('./features/how-it-works/how-it-works').then((m) => m.HowItWorksPage),
  },
  {
    path: 'faq',
    title: 'Frequently asked questions',
    data: {
      description:
        'Answers to common questions about TranscribeVid: accuracy, languages, supported files and limits, speed, privacy and editing.',
      ads: true,
    },
    loadComponent: () => import('./features/faq/faq').then((m) => m.FaqPage),
  },
  {
    path: 'about',
    title: 'About TranscribeVid',
    data: {
      description:
        'Who builds TranscribeVid and why: a free video and audio to text tool with no sign-up, no sign-in and a clean interface, funded by ads.',
    },
    loadComponent: () => import('./features/about/about').then((m) => m.AboutPage),
  },
  {
    path: 'contact',
    title: 'Contact',
    data: {
      description: 'How to reach TranscribeVid: e-mail for questions, bug reports, feature ideas and privacy requests, and who runs the website.',
    },
    loadComponent: () => import('./features/contact/contact').then((m) => m.ContactPage),
  },
  // keyword landing pages (formats, Hindi and Hinglish, use cases, alternatives): one list, tool-pages.list.ts
  ...TOOL_PAGES.map(toolRoute),
  {
    path: 'tools',
    title: 'All free tools',
    data: {
      description:
        'Every free video and audio to text tool in one list: by file type, by use, subtitle files and languages. No login, no daily limit, 50+ languages.',
    },
    loadComponent: () => import('./features/tool-pages/all-tools').then((m) => m.AllToolsPage),
  },
  // the guides: /guides lists them, one route per article
  {
    path: 'guides',
    title: 'Guides',
    data: {
      description:
        'Practical guides on transcripts and subtitles: SRT or VTT, how to add subtitles to a video, how to get an accurate transcript, and private transcription.',
    },
    loadComponent: () => import('./features/guides/guides-index').then((m) => m.GuidesIndexPage),
  },
  ...GUIDES.map(guideRoute),
  {
    path: 'privacy',
    title: 'Privacy policy',
    data: {
      description:
        'What TranscribeVid processes when you transcribe a file and where, why, how long it is kept, cookies, ads and browser storage, and your rights.',
    },
    canActivate: [adFreeDocument],
    loadComponent: () => import('./features/legal/privacy').then((m) => m.PrivacyPage),
  },
  {
    path: 'terms',
    title: 'Terms of use',
    data: {
      description:
        'The rules for using TranscribeVid: the free service, your content, acceptable use, file limits, no warranty on transcript accuracy, and liability.',
    },
    canActivate: [adFreeDocument],
    loadComponent: () => import('./features/legal/terms').then((m) => m.TermsPage),
  },
  {
    path: 'logs',
    title: 'Logs',
    data: { noindex: true },
    canActivate: [adFreeDocument],
    loadComponent: () => import('./features/logs/logs').then((m) => m.LogsPage),
  },
];

/** The "Page not found" page: the last route, and the catch-all inside every language group. */
export const notFoundRoute: Route = {
  path: '**',
  title: 'Page not found',
  data: { noindex: true },
  loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFoundPage),
};

/**
 * Every route: the English pages (no prefix), then one group per language that has translated pages (/es/..., built by
 * i18n/routes.ts, only in the edition that has languages), then the catch-all.
 */
export const routes: Routes = [
  ...appPages,
  ...(environment.languages ? localizedRoutes(appPages, { available: AVAILABLE, notFound: notFoundRoute }) : []),
  notFoundRoute,
];
