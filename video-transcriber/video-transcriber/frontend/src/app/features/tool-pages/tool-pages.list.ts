import { environment } from '../../../environments/environment';
import { _t } from '../../i18n/mark';

/**
 * The keyword landing pages ("tool pages"). Kept in its own tiny file (no page text in here) so the app shell can import
 * it for the footer "Free tools" links, the routes can use it for titles and descriptions, and the related-links
 * component can list it, all without pulling the page content into the first download.
 */
/** How a page is grouped: the footer shows the main pages, the "All free tools" page and "More free tools" use the groups. */
export type ToolGroup = 'core' | 'format' | 'use-case' | 'subtitles' | 'language' | 'compare';

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
  /** meta description (120 to 160 characters) */
  description: string;
  group: ToolGroup;
  /** what the uploader starts with after a file is dropped on this page */
  preset?: ToolPreset;
  /** one of the few pages the footer "Free tools" row links (the rest are reached from the home page and related links) */
  footer?: boolean;
  /**
   * The in-browser edition's title and description, where the server's words are not the whole truth there (or the
   * other way round: "no upload" is only true in the browser). The build picks one set (`TOOL_PAGES`).
   */
  browser?: { title?: string; description?: string };
}

/** Every page with both editions' words. Ordered by group (TOOL_GROUPS), so the flat and the grouped lists read the same. */
export const TOOL_PAGE_ENTRIES: readonly ToolPageLink[] = [
  // ---------------------------------------------------------------- the main tools (the footer row)
  {
    path: '/video-to-text',
    group: 'core',
    label: 'Video to text',
    title: 'Free Video to Text Converter, No Login',
    description:
      'Convert video to text for free. Get an accurate, timestamped transcript in 50+ languages. No login, no daily limit. Download SRT, VTT, TXT or PDF.',
    footer: true,
  },
  {
    path: '/audio-to-text',
    group: 'core',
    label: 'Audio to text',
    title: 'Audio to Text Converter: Free, Unlimited',
    description:
      'Turn podcasts, interviews and lectures into text. Free audio to text converter with timestamps, 50+ languages and no login. Download TXT, SRT, VTT or PDF.',
    footer: true,
  },
  {
    path: '/mp4-to-text',
    group: 'core',
    label: 'MP4 to text',
    title: 'MP4 to Text: Transcribe MP4 Videos Free',
    description:
      'Convert an MP4 video to text with timestamps. Free, no login, no daily limit, 50+ languages. Download TXT, SRT, VTT, Markdown, JSON or PDF.',
    footer: true,
  },
  {
    path: '/mp3-to-text',
    group: 'core',
    label: 'MP3 to text',
    title: 'MP3 to Text Converter: Free Transcripts',
    description:
      'Transcribe an MP3 to text online for free. No login, 50+ languages, a timestamp on every line. Edit the text and download TXT, SRT, VTT or PDF.',
    footer: true,
  },
  {
    path: '/srt-subtitle-generator',
    group: 'core',
    label: 'SRT subtitle generator',
    title: 'Free SRT Subtitle Generator from Video',
    description:
      'Generate an SRT subtitle file from any video or audio for free. Timed to the speech, 50+ languages, no login. Edit the lines, then download SRT or VTT.',
    footer: true,
  },
  {
    path: '/voice-recording-to-text',
    group: 'core',
    label: 'Voice recording to text',
    title: 'Voice Recording to Text: Free Transcriber',
    description:
      'Record your voice in the browser or upload a voice memo and get it as text. Free, no login, 50+ languages. Download TXT, PDF, SRT or Markdown.',
    footer: true,
  },
  // ---------------------------------------------------------------- by file type
  {
    path: '/wav-to-text',
    label: 'WAV to text',
    title: 'WAV to Text Converter: Free, No Login',
    description:
      'Convert a WAV recording to text with timestamps. Free, no login, no daily limit, 50+ languages. Edit the transcript and download TXT, SRT, VTT or PDF.',
    group: 'format',
  },
  {
    path: '/m4a-to-text',
    label: 'M4A to text',
    title: 'M4A to Text: Transcribe iPhone Voice Memos',
    description:
      'Convert M4A files, like iPhone voice memos, to text for free. No login, no daily limit, 50+ languages. Timestamps, editing, and TXT, SRT or PDF downloads.',
    group: 'format',
    browser: {
      description:
        'Convert M4A files, like iPhone voice memos, to text for free. No login, no upload, 50+ languages. Timestamps, editing, and TXT, SRT or PDF downloads.',
    },
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
  // ---------------------------------------------------------------- by use
  {
    path: '/whatsapp-voice-message-to-text',
    group: 'use-case',
    label: 'WhatsApp voice message to text',
    title: 'WhatsApp Voice Message to Text, Free',
    description:
      'Turn a WhatsApp voice message into text for free. Save the voice note, drop it in, read it in 50+ languages including Hindi. No login, no account.',
  },
  {
    path: '/whatsapp-voice-note-to-text',
    label: 'WhatsApp voice note to text',
    title: 'WhatsApp Voice Note to Text: Free, No Login',
    description:
      'Turn a WhatsApp voice note (OPUS) or any voice message into text. Works in Hindi, Hinglish, English and 50+ languages. Free, no login, no daily limit.',
    group: 'use-case',
    browser: {
      title: 'WhatsApp Voice Note to Text: Free, Private',
      description:
        'Turn a WhatsApp voice note (OPUS) or any voice message into text. Works in Hindi, Hinglish, English and 50+ languages. Free, no login, nothing is uploaded.',
    },
  },
  {
    path: '/meeting-recording-to-text',
    label: 'Meeting recording to text',
    title: 'Meeting Recording to Text: Zoom, Meet, Teams',
    description:
      'Turn a Zoom, Google Meet or Teams recording into text. No bot joins your call. Free, no login, no daily limit, 50+ languages. Download TXT, PDF or SRT.',
    group: 'use-case',
    browser: {
      description:
        'Turn a Zoom, Google Meet or Teams recording into text. No bot joins your call and nothing is uploaded. Free, no login, 50+ languages, TXT, PDF, SRT.',
    },
  },
  {
    path: '/interview-transcription',
    label: 'Interview transcription',
    title: 'Free Interview Transcription, No Login',
    description:
      'Transcribe research, journalism or job interviews for free. No login, a timestamp on every line, marks on unsure words, and editing before you download.',
    group: 'use-case',
    browser: {
      title: 'Free Interview Transcription, No Upload',
      description:
        'Transcribe research, journalism or job interviews without uploading the recording. Free, no login, timestamps on every line, confidence marks, editing.',
    },
  },
  {
    path: '/lecture-to-text',
    label: 'Lecture to text',
    title: 'Lecture to Text: Free Lecture Transcription',
    description:
      'Turn a recorded lecture or class into searchable notes. Free, no login, no daily limit, 50+ languages including Hindi. Export Markdown, PDF, TXT or SRT.',
    group: 'use-case',
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
    path: '/podcast-to-text',
    label: 'Podcast to text',
    title: 'Podcast to Text: Free Podcast Transcription',
    description:
      'Transcribe a podcast episode to text for show notes, blogs and captions. Free, no login, no limit on episodes. Word timing, editing, SRT, VTT and PDF.',
    group: 'use-case',
  },
  {
    path: '/private-transcription',
    label: 'Private transcription',
    title: 'Private Transcription, No Account Needed',
    description:
      'Transcribe confidential audio and video with no account. Your file is used only for your transcript and deleted when your session ends. Free, no login.',
    group: 'use-case',
    browser: {
      title: 'Private Transcription: Files Never Uploaded',
      description:
        'Transcribe confidential audio and video without uploading it. Speech recognition runs on your own device, so files never reach a server. Free, no login.',
    },
  },
  // ---------------------------------------------------------------- subtitle files
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
  {
    path: '/subtitle-generator-for-reels',
    label: 'Subtitles for Reels',
    title: 'Subtitle Generator for Reels, No Watermark',
    description:
      'Make captions for Instagram Reels, YouTube Shorts and other short videos. Free, no watermark, no login. Hindi, Hinglish and 50+ languages. SRT or VTT.',
    group: 'subtitles',
  },
  // ---------------------------------------------------------------- by language
  {
    path: '/hindi-audio-to-text',
    label: 'Hindi audio to text',
    title: 'Hindi Audio to Text: Free, No Login',
    description:
      'Convert Hindi audio or video to text for free. Get Devanagari or Hinglish (Roman) output with timestamps. No login, no daily limit. Export TXT, SRT, PDF.',
    group: 'language',
    preset: { language: 'hi', output_script: 'original' },
    footer: true,
    browser: {
      description:
        'Convert Hindi audio or video to text for free. Get Devanagari or Hinglish (Roman) output with timestamps. No login, no upload, no limit. Export TXT, SRT, PDF.',
    },
  },
  {
    path: '/hinglish-transcription',
    label: 'Hinglish transcription',
    title: 'Hinglish Transcription: Hindi in Roman Text',
    description:
      'Turn Hindi or Hindi-English speech into Hinglish text written in Roman letters. Free, no login, no daily limit. Timestamps, SRT and TXT downloads.',
    group: 'language',
    preset: { language: 'hi', output_script: 'hinglish' },
    footer: true,
    browser: {
      description:
        'Turn Hindi or Hindi-English speech into Hinglish text written in Roman letters. Free, no login, runs in your browser. Timestamps, SRT and TXT downloads.',
    },
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
    path: '/translate-hindi-audio-to-english',
    label: 'Translate Hindi to English',
    title: 'Translate Hindi Audio to English Text Free',
    description:
      'Translate Hindi, Marathi, Tamil or any of 50+ languages from audio or video into English text. Free, no login, no daily limit. Timestamped lines.',
    group: 'language',
    preset: { language: 'hi', task: 'translate' },
    browser: {
      description:
        'Translate Hindi, Marathi, Tamil or any of 50+ languages from audio or video into English text. Free, no login, files never leave your device. Timestamped.',
    },
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
  // ---------------------------------------------------------------- alternatives
  {
    path: '/turboscribe-alternative',
    label: 'TurboScribe alternative',
    title: 'Free TurboScribe Alternative, No Daily Cap',
    description:
      'A free TurboScribe alternative with no sign-up and no 3-a-day cap. An honest comparison of limits, privacy, speed and accuracy, checked in October 2026.',
    group: 'compare',
    browser: {
      description:
        'A free TurboScribe alternative with no sign-up, no 3-a-day cap and no upload. An honest, dated comparison of limits, privacy, speed and accuracy.',
    },
  },
  {
    path: '/otter-ai-alternative',
    label: 'Otter.ai alternative',
    title: 'Free Otter.ai Alternative for Recordings',
    description:
      "Need to transcribe a recording without Otter's monthly minutes or import limits? A free alternative with no account and no daily cap, compared fairly.",
    group: 'compare',
    browser: {
      description:
        "Need to transcribe a recording without Otter's monthly minutes or import limits? A free alternative with no account and no upload, compared fairly.",
    },
  },
];

/** The pages in one edition's words: the in-browser edition takes each `browser` title and description. */
export function editionPages(list: readonly ToolPageLink[], inBrowser: boolean): readonly ToolPageLink[] {
  return list.map((t) =>
    inBrowser && t.browser ? { ...t, title: t.browser.title ?? t.title, description: t.browser.description ?? t.description } : t,
  );
}

/** The pages of this build (the static website is the in-browser edition; `ng serve`, self-hosted and tests the server one). */
export const TOOL_PAGES: readonly ToolPageLink[] = editionPages(TOOL_PAGE_ENTRIES, environment.transport === 'browser');

/** The route path (no leading slash) of a tool page. */
export const toolRoutePath = (t: ToolPageLink) => t.path.replace(/^\//, '');

/** The six main pages (group 'core'). */
export const CORE_TOOLS: readonly ToolPageLink[] = TOOL_PAGES.filter((t) => t.group === 'core');

/** The pages the footer "Free tools" row links to (`footer: true`); the others are reached through "All free tools". */
export const FOOTER_TOOLS: readonly ToolPageLink[] = TOOL_PAGES.filter((t) => t.footer);

/** Headings of the groups on the "All free tools" page and in the "More free tools" lists, in the order they are shown. */
export const TOOL_GROUPS: readonly { id: ToolGroup; title: string; intro: string }[] = [
  { id: 'core', title: _t('Video and audio to text'), intro: _t('The main tools: turn any video or audio file into a timestamped transcript.') },
  { id: 'format', title: _t('By file type'), intro: _t('Pages for the file you already have: WAV, M4A, WebM and MOV.') },
  { id: 'use-case', title: _t('By use'), intro: _t('Voice notes, meetings, lectures, podcasts and interviews.') },
  { id: 'subtitles', title: _t('Subtitle files'), intro: _t('Make a subtitle file (SRT or VTT) from your video.') },
  { id: 'language', title: _t('By language'), intro: _t('Transcribe or translate speech in the language you need.') },
  { id: 'compare', title: _t('Alternatives'), intro: _t('Honest, dated comparisons with other transcription services.') },
];
