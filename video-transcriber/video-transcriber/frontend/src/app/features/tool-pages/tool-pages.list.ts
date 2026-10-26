/**
 * The keyword landing pages ("tool pages"). Kept in its own tiny file (no page text in here) so the app shell can import
 * it for the footer "Free tools" links, the routes can use it for titles and descriptions, and the related-links
 * component can list it, all without pulling the page content into the first download.
 */
/** How a page is grouped: the footer shows the core pages, the "All free tools" page and "More free tools" use the groups. */
export type ToolGroup = 'core' | 'format' | 'use-case' | 'subtitles' | 'language';

/** What a page pre-selects in the uploader when its drop box hands a file over (the visitor can still change it). */
export interface ToolPreset {
  /** spoken language code, e.g. "hi" (absent = auto-detect) */
  language?: string;
  /** "translate" = English text from speech in any language */
  task?: 'translate';
  /** Hindi written in Roman letters ("hinglish") or the original script */
  output_script?: 'hinglish' | 'original';
}

export interface ToolPageLink {
  /** absolute path, usable as href / routerLink / sitemap entry */
  path: string;
  /** short link text for menus, footers and "more tools" lists */
  label: string;
  /** page name for the browser tab and search results (the brand is appended: "<title> - TranscribeVid") */
  title: string;
  /** meta description (about 155 characters at most) */
  description: string;
  group: ToolGroup;
  /** what the uploader starts with after a file is dropped on this page */
  preset?: ToolPreset;
}

export const TOOL_PAGES: readonly ToolPageLink[] = [
  {
    path: '/video-to-text',
    group: 'core',
    label: 'Video to text',
    title: 'Free Video to Text Converter, No Login',
    description:
      'Convert video to text for free. Get an accurate, timestamped transcript in 50+ languages. No login, no daily limit. Download SRT, VTT, TXT or PDF.',
  },
  {
    path: '/audio-to-text',
    group: 'core',
    label: 'Audio to text',
    title: 'Audio to Text Converter: Free, Unlimited',
    description:
      'Turn podcasts, interviews and lectures into text. Free audio to text converter with timestamps, 50+ languages and no login. Download TXT, SRT, VTT or PDF.',
  },
  {
    path: '/mp4-to-text',
    group: 'core',
    label: 'MP4 to text',
    title: 'MP4 to Text: Transcribe MP4 Videos Free',
    description:
      'Convert an MP4 video to text with timestamps. Free, no login, no daily limit, 50+ languages. Download TXT, SRT, VTT, Markdown, JSON or PDF.',
  },
  {
    path: '/mp3-to-text',
    group: 'core',
    label: 'MP3 to text',
    title: 'MP3 to Text Converter: Free Transcripts',
    description:
      'Transcribe an MP3 to text online for free. No login, 50+ languages, a timestamp on every line. Edit the text and download TXT, SRT, VTT or PDF.',
  },
  {
    path: '/srt-subtitle-generator',
    group: 'core',
    label: 'SRT subtitle generator',
    title: 'Free SRT Subtitle Generator from Video',
    description:
      'Generate an SRT subtitle file from any video or audio for free. Timed to the speech, 50+ languages, no login. Edit the lines, then download SRT or VTT.',
  },
  {
    path: '/voice-recording-to-text',
    group: 'core',
    label: 'Voice recording to text',
    title: 'Voice Recording to Text: Free Transcriber',
    description:
      'Record your voice in the browser or upload a voice memo and get it as text. Free, no login, 50+ languages. Download TXT, PDF, SRT or Markdown.',
  },
  // ---------------------------------------------------------------------------------------------- file formats
  {
    path: '/wav-to-text',
    group: 'format',
    label: 'WAV to text',
    title: 'WAV to Text: Free Transcription Online',
    description:
      'Convert a WAV file to text for free. Handles long recordings from field recorders and calls, 50+ languages, timestamps, no login. Download TXT, SRT or PDF.',
  },
  {
    path: '/m4a-to-text',
    group: 'format',
    label: 'M4A to text',
    title: 'M4A to Text: Transcribe Voice Memos Free',
    description:
      'Turn an M4A voice memo or recording into text for free. Works with iPhone Voice Memos, no login, 50+ languages, timestamps. Download TXT, SRT, VTT or PDF.',
  },
  {
    path: '/webm-to-text',
    group: 'format',
    label: 'WebM to text',
    title: 'WebM to Text: Free Transcription, No Login',
    description:
      'Convert a WebM video or audio file to text for free. Works with screen and browser recordings, 50+ languages, timestamps. Download TXT, SRT, VTT or PDF.',
  },
  {
    path: '/mov-to-text',
    group: 'format',
    label: 'MOV to text',
    title: 'MOV to Text: Transcribe iPhone Videos Free',
    description:
      'Transcribe a MOV video from your iPhone or QuickTime for free. No login, 50+ languages, a timestamp on every line. Download TXT, SRT, VTT or PDF.',
  },
  // ------------------------------------------------------------------------------------------------- use cases
  {
    path: '/whatsapp-voice-message-to-text',
    group: 'use-case',
    label: 'WhatsApp voice message to text',
    title: 'WhatsApp Voice Message to Text, Free',
    description:
      'Turn a WhatsApp voice message into text for free. Save the voice note, drop it in, read it in 50+ languages including Hindi. No login, no account.',
  },
  {
    path: '/meeting-recording-to-text',
    group: 'use-case',
    label: 'Meeting recording to text',
    title: 'Zoom, Teams & Meet Recording to Text',
    description:
      'Turn a Zoom, Teams or Google Meet recording into a searchable, timestamped transcript for free. No login, 50+ languages. Download TXT, SRT, VTT or PDF.',
  },
  {
    path: '/lecture-to-text',
    group: 'use-case',
    label: 'Lecture to text',
    title: 'Lecture to Text: Free Lecture Transcriber',
    description:
      'Turn a recorded lecture into text notes you can search and study. Free, no login, 50+ languages, timestamps. Download TXT, Markdown, SRT or PDF.',
  },
  {
    path: '/podcast-transcript-generator',
    group: 'use-case',
    label: 'Podcast transcript generator',
    title: 'Free Podcast Transcript Generator',
    description:
      'Generate a podcast transcript from an MP3 or WAV for free. Timestamps, 50+ languages, no login. Edit it, then download TXT, Markdown, SRT, VTT or PDF.',
  },
  {
    path: '/interview-transcription',
    group: 'use-case',
    label: 'Interview transcription',
    title: 'Interview Transcription: Private and Free',
    description:
      'Transcribe interviews for free without making an account. Timestamped text in 50+ languages, made for research, journalism and hiring. Download TXT or PDF.',
  },
  // ---------------------------------------------------------------------------------------------- subtitle files
  {
    path: '/vtt-subtitle-generator',
    group: 'subtitles',
    label: 'VTT subtitle generator',
    title: 'Free VTT (WebVTT) Subtitle Generator',
    description:
      'Generate a WebVTT (.vtt) subtitle file from any video or audio for free. Timed to the speech, 50+ languages, no login. Edit the lines, then download VTT.',
  },
  {
    path: '/youtube-subtitle-generator',
    group: 'subtitles',
    label: 'YouTube subtitle generator',
    title: 'YouTube Subtitle Generator: Free SRT File',
    description:
      'Make an SRT subtitle file for your own YouTube video, free and without logging in. Timed to the speech, 50+ languages. Upload it in YouTube Studio.',
  },
  // ------------------------------------------------------------------------------------------------- languages
  {
    path: '/hindi-audio-to-text',
    group: 'language',
    preset: { language: 'hi', output_script: 'original' },
    label: 'Hindi audio to text',
    title: 'Hindi Audio to Text: Free, No Login',
    description:
      'Convert Hindi audio and video to text for free, in Devanagari or in Roman letters (Hinglish). Timestamps, no login. Download TXT, SRT, VTT or PDF.',
  },
  {
    path: '/hinglish-transcription',
    group: 'language',
    preset: { language: 'hi', output_script: 'hinglish' },
    label: 'Hinglish transcriber',
    title: 'Hinglish Transcriber: Hindi in Roman Text',
    description:
      'Get Hindi speech written in Roman letters (Hinglish) for free. Timestamped text from video or audio, no login. Download TXT, SRT, VTT or PDF.',
  },
  {
    path: '/translate-audio-to-english',
    group: 'language',
    preset: { task: 'translate' },
    label: 'Translate speech to English',
    title: 'Translate Speech to English Text, Free',
    description:
      'Turn speech in another language into English text for free. Upload a video or audio file, get timestamped English text or subtitles. No login. SRT, VTT, TXT.',
  },
  {
    path: '/spanish-audio-to-text',
    group: 'language',
    preset: { language: 'es' },
    label: 'Spanish audio to text',
    title: 'Spanish Audio to Text: Free Transcriber',
    description:
      'Transcribe Spanish audio and video to text for free: Spain, Mexico and Latin America. Timestamps, no login. Download TXT, SRT, VTT or PDF.',
  },
  {
    path: '/portuguese-audio-to-text',
    group: 'language',
    preset: { language: 'pt' },
    label: 'Portuguese audio to text',
    title: 'Portuguese Audio to Text: Free, No Login',
    description:
      'Transcribe Portuguese audio and video to text for free: Brazil and Portugal. Timestamps, no login. Download TXT, SRT, VTT or PDF.',
  },
  {
    path: '/french-audio-to-text',
    group: 'language',
    preset: { language: 'fr' },
    label: 'French audio to text',
    title: 'French Audio to Text: Free Transcriber',
    description:
      'Transcribe French audio and video to text for free: France, Canada, Belgium and Africa. Timestamps, no login. Download TXT, SRT, VTT or PDF.',
  },
  {
    path: '/german-audio-to-text',
    group: 'language',
    preset: { language: 'de' },
    label: 'German audio to text',
    title: 'German Audio to Text: Free Transcriber',
    description:
      'Transcribe German audio and video to text for free: Germany, Austria and Switzerland. Timestamps, no login. Download TXT, SRT, VTT or PDF.',
  },
];

/** The route path (no leading slash) of a tool page. */
export const toolRoutePath = (t: ToolPageLink) => t.path.replace(/^\//, '');

/** The six core pages: the ones the footer links to directly (all the others are reached through "All free tools"). */
export const CORE_TOOLS: readonly ToolPageLink[] = TOOL_PAGES.filter((t) => t.group === 'core');

/** Headings of the groups on the "All free tools" page, in the order they are shown. */
export const TOOL_GROUPS: readonly { id: ToolGroup; title: string; intro: string }[] = [
  { id: 'core', title: 'Video and audio to text', intro: 'The main tools: turn any video or audio file into a timestamped transcript.' },
  { id: 'format', title: 'By file type', intro: 'Pages for the file you already have: WAV, M4A, WebM and MOV.' },
  { id: 'use-case', title: 'By use', intro: 'Voice notes, meetings, lectures, podcasts and interviews.' },
  { id: 'subtitles', title: 'Subtitle files', intro: 'Make a subtitle file (SRT or VTT) from your video.' },
  { id: 'language', title: 'By language', intro: 'Transcribe or translate speech in the language you need.' },
];
