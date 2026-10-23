import { Route, Routes } from '@angular/router';
import { DEFAULT_DESCRIPTION } from './core/title.service';
import { TOOL_PAGES, ToolPageLink, toolRoutePath } from './features/tool-pages/tool-pages.list';

/** A keyword landing page: its title, description and label come from TOOL_PAGES, its text from features/tool-pages/content. */
const toolRoute = (t: ToolPageLink): Route => ({
  path: toolRoutePath(t),
  title: t.title,
  data: { description: t.description, label: t.label, tool: toolRoutePath(t), app: true },
  loadComponent: () => import('./features/tool-pages/tool-page').then((m) => m.ToolPage),
});

/**
 * `title` is the page name (the strategy in core/title.service.ts appends the brand); `data.description` feeds the
 * meta description and `data.noindex` keeps private / admin pages out of search results.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Free Video to Text Transcription, No Login',
    data: { description: DEFAULT_DESCRIPTION },
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
    },
    loadComponent: () => import('./features/how-it-works/how-it-works').then((m) => m.HowItWorksPage),
  },
  {
    path: 'faq',
    title: 'Frequently asked questions',
    data: {
      description:
        'Answers to common questions about TranscribeVid: accuracy, languages, supported files and limits, speed, privacy and editing.',
    },
    loadComponent: () => import('./features/faq/faq').then((m) => m.FaqPage),
  },
  // the old address of the "How it works" page keeps working
  { path: 'about', pathMatch: 'full', redirectTo: 'how-it-works' },
  // keyword landing pages: /video-to-text, /audio-to-text, /mp4-to-text, /mp3-to-text, /srt-subtitle-generator, /voice-recording-to-text
  ...TOOL_PAGES.map(toolRoute),
  {
    path: 'privacy',
    title: 'Privacy policy',
    data: {
      description:
        'What TranscribeVid processes when you transcribe a file, why, how long it is kept (only for your session), cookies and browser storage, and your rights.',
    },
    loadComponent: () => import('./features/legal/privacy').then((m) => m.PrivacyPage),
  },
  {
    path: 'terms',
    title: 'Terms of use',
    data: {
      description:
        'The rules for using TranscribeVid: the free service, your content, acceptable use, file limits, no warranty on transcript accuracy, and liability.',
    },
    loadComponent: () => import('./features/legal/terms').then((m) => m.TermsPage),
  },
  {
    path: 'logs',
    title: 'Logs',
    data: { noindex: true },
    loadComponent: () => import('./features/logs/logs').then((m) => m.LogsPage),
  },
  {
    path: '**',
    title: 'Page not found',
    data: { noindex: true },
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFoundPage),
  },
];
