/**
 * The keyword landing pages ("tool pages"). Kept in its own tiny file (no page text in here) so the app shell can import
 * it for the footer "Free tools" links, the routes can use it for titles and descriptions, and the related-links
 * component can list it, all without pulling the page content into the first download.
 */
export interface ToolPageLink {
  /** absolute path, usable as href / routerLink / sitemap entry */
  path: string;
  /** short link text for menus, footers and "more tools" lists */
  label: string;
  /** page name for the browser tab and search results (the brand is appended: "<title> - TranscribeVid") */
  title: string;
  /** meta description (about 155 characters at most) */
  description: string;
}

export const TOOL_PAGES: readonly ToolPageLink[] = [
  {
    path: '/video-to-text',
    label: 'Video to text',
    title: 'Free Video to Text Converter, No Login',
    description:
      'Convert video to text for free. Get an accurate, timestamped transcript in 50+ languages. No login, no daily limit. Download SRT, VTT, TXT or PDF.',
  },
  {
    path: '/audio-to-text',
    label: 'Audio to text',
    title: 'Audio to Text Converter: Free, Unlimited',
    description:
      'Turn podcasts, interviews and lectures into text. Free audio to text converter with timestamps, 50+ languages and no login. Download TXT, SRT, VTT or PDF.',
  },
  {
    path: '/mp4-to-text',
    label: 'MP4 to text',
    title: 'MP4 to Text: Transcribe MP4 Videos Free',
    description:
      'Convert an MP4 video to text with timestamps. Free, no login, no daily limit, 50+ languages. Download TXT, SRT, VTT, Markdown, JSON or PDF.',
  },
  {
    path: '/mp3-to-text',
    label: 'MP3 to text',
    title: 'MP3 to Text Converter: Free Transcripts',
    description:
      'Transcribe an MP3 to text online for free. No login, 50+ languages, a timestamp on every line. Edit the text and download TXT, SRT, VTT or PDF.',
  },
  {
    path: '/srt-subtitle-generator',
    label: 'SRT subtitle generator',
    title: 'Free SRT Subtitle Generator from Video',
    description:
      'Generate an SRT subtitle file from any video or audio for free. Timed to the speech, 50+ languages, no login. Edit the lines, then download SRT or VTT.',
  },
  {
    path: '/voice-recording-to-text',
    label: 'Voice recording to text',
    title: 'Voice Recording to Text: Free Transcriber',
    description:
      'Record your voice in the browser or upload a voice memo and get it as text. Free, no login, 50+ languages. Download TXT, PDF, SRT or Markdown.',
  },
];

/** The route path (no leading slash) of a tool page. */
export const toolRoutePath = (t: ToolPageLink) => t.path.replace(/^\//, '');
