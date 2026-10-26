import { GuideContent } from '../guide.model';

type Loader = () => Promise<{ CONTENT: GuideContent }>;

/**
 * The text of every guide, by slug, each in a chunk of its own (the route's resolver, guide-content.resolver.ts, loads
 * the one being opened). To add a guide: a file here, an entry in guides.list.ts and one line below (a test checks that
 * the three agree).
 */
export const GUIDE_CONTENT_LOADERS: Readonly<Record<string, Loader>> = {
  'srt-vs-vtt': () => import('./srt-vs-vtt'),
  'how-to-add-subtitles-to-a-video': () => import('./how-to-add-subtitles-to-a-video'),
  'transcribe-video-without-uploading': () => import('./transcribe-video-without-uploading'),
  'accurate-transcripts': () => import('./accurate-transcripts'),
  'what-is-whisper': () => import('./what-is-whisper'),
};

export async function loadGuideContent(slug: string): Promise<GuideContent> {
  const load = GUIDE_CONTENT_LOADERS[slug] ?? GUIDE_CONTENT_LOADERS['srt-vs-vtt'];
  return (await load()).CONTENT;
}

/** Every guide's text by slug (for tests and checks: loads them all). */
export async function loadAllGuideContent(): Promise<Record<string, GuideContent>> {
  const entries = await Promise.all(
    Object.keys(GUIDE_CONTENT_LOADERS).map(
      async (slug) => [slug, await loadGuideContent(slug)] as const,
    ),
  );
  return Object.fromEntries(entries);
}
