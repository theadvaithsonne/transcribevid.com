import { ToolPageContent } from '../tool-page.model';

type Loader = () => Promise<{ CONTENT: ToolPageContent }>;

/**
 * The text of every tool page, by route path (no leading slash), each in a chunk of its own: a visit loads the one page
 * it needs (the route's resolver, tool-content.resolver.ts), not all of them. To add a page: a file here, an entry in
 * tool-pages.list.ts and one line below (a test checks that the three agree).
 */
export const TOOL_CONTENT_LOADERS: Readonly<Record<string, Loader>> = {
  'video-to-text': () => import('./video-to-text'),
  'audio-to-text': () => import('./audio-to-text'),
  'mp4-to-text': () => import('./mp4-to-text'),
  'mp3-to-text': () => import('./mp3-to-text'),
  'srt-subtitle-generator': () => import('./srt-subtitle-generator'),
  'voice-recording-to-text': () => import('./voice-recording-to-text'),
  'wav-to-text': () => import('./wav-to-text'),
  'm4a-to-text': () => import('./m4a-to-text'),
  'webm-to-text': () => import('./webm-to-text'),
  'mov-to-text': () => import('./mov-to-text'),
  'whatsapp-voice-message-to-text': () => import('./whatsapp-voice-message-to-text'),
  'meeting-recording-to-text': () => import('./meeting-recording-to-text'),
  'lecture-to-text': () => import('./lecture-to-text'),
  'podcast-transcript-generator': () => import('./podcast-transcript-generator'),
  'interview-transcription': () => import('./interview-transcription'),
  'vtt-subtitle-generator': () => import('./vtt-subtitle-generator'),
  'youtube-subtitle-generator': () => import('./youtube-subtitle-generator'),
  'hindi-audio-to-text': () => import('./hindi-audio-to-text'),
  'hinglish-transcription': () => import('./hinglish-transcription'),
  'translate-audio-to-english': () => import('./translate-audio-to-english'),
  'spanish-audio-to-text': () => import('./spanish-audio-to-text'),
  'portuguese-audio-to-text': () => import('./portuguese-audio-to-text'),
  'french-audio-to-text': () => import('./french-audio-to-text'),
  'german-audio-to-text': () => import('./german-audio-to-text'),
};

/** The text of one page; an unknown address gets the video page's text (the route table only names listed pages). */
export async function loadToolContent(slug: string): Promise<ToolPageContent> {
  const load = TOOL_CONTENT_LOADERS[slug] ?? TOOL_CONTENT_LOADERS['video-to-text'];
  return (await load()).CONTENT;
}

/** Every page's text by slug (for tests and checks: loads them all). */
export async function loadAllToolContent(): Promise<Record<string, ToolPageContent>> {
  const entries = await Promise.all(Object.keys(TOOL_CONTENT_LOADERS).map(async (slug) => [slug, await loadToolContent(slug)] as const));
  return Object.fromEntries(entries);
}
