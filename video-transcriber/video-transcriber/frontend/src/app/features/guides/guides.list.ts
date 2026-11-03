/**
 * The guides: longer articles that answer one question well and lead to the tool pages. Kept in its own tiny file (no
 * article text in here) so the footer, the routes, the sitemap check and the "All guides" page can all read it without
 * pulling the article text into the first download. The text of each guide lives in ./content/<slug>.ts.
 */
export interface GuideLink {
  /** the last part of the address, e.g. "srt-vs-vtt" */
  slug: string;
  /** absolute path, usable as href / routerLink / sitemap entry */
  path: string;
  /** short link text for lists and breadcrumbs */
  label: string;
  /** page name for the browser tab and search results (the brand is appended: "<title> - TranscribeVid") */
  title: string;
  /** meta description (50 to 160 characters) */
  description: string;
  /** ISO date the guide was first published */
  published: string;
  /** ISO date of the last real change to its text: bump it when the text changes, never otherwise */
  updated: string;
}

export const GUIDES_PATH = '/guides';

export const GUIDES: readonly GuideLink[] = [
  {
    slug: 'srt-vs-vtt',
    path: '/guides/srt-vs-vtt',
    label: 'SRT vs VTT',
    title: 'SRT vs VTT: Which Subtitle Format to Use',
    description:
      'SRT or VTT? What each subtitle format is, how they differ, where each one works, and how to get either file from your video for free.',
    published: '2026-10-27',
    updated: '2026-10-27',
  },
  {
    slug: 'how-to-add-subtitles-to-a-video',
    path: '/guides/how-to-add-subtitles-to-a-video',
    label: 'How to add subtitles to a video',
    title: 'How to Add Subtitles to a Video (Free)',
    description:
      'Make subtitles in four steps: transcribe the video, fix the text, export SRT or VTT, then add the file to YouTube, VLC, an editor or your web player.',
    published: '2026-10-27',
    updated: '2026-10-27',
  },
  {
    slug: 'transcribe-video-without-uploading',
    path: '/guides/transcribe-video-without-uploading',
    label: 'Transcribe a video without uploading it',
    title: 'Transcribe a Video Without Uploading It',
    description:
      'How in-browser transcription works, what stays on your device, what is downloaded once, and how to check it yourself in your browser network panel.',
    published: '2026-10-27',
    updated: '2026-11-03',
  },
  {
    slug: 'accurate-transcripts',
    path: '/guides/accurate-transcripts',
    label: 'How to get a more accurate transcript',
    title: 'How to Get a More Accurate Transcript',
    description:
      'Practical ways to improve speech-to-text accuracy: cleaner audio, the right language and model, a vocabulary hint, and how to check and correct the result.',
    published: '2026-10-27',
    updated: '2026-10-27',
  },
  {
    slug: 'what-is-whisper',
    path: '/guides/what-is-whisper',
    label: 'What is Whisper?',
    title: 'What Is Whisper? Speech-to-Text Explained',
    description:
      'What OpenAI Whisper is, what it was trained on, how accurate it is and where it struggles, and how it runs inside your browser on TranscribeVid.',
    published: '2026-10-27',
    updated: '2026-10-27',
  },
  {
    slug: 'whisper-accuracy-by-language',
    path: '/guides/whisper-accuracy-by-language',
    label: 'Whisper accuracy by language',
    title: 'Whisper Accuracy by Language, Measured',
    description:
      "Whisper's measured error rate in 16 languages on 480 test clips, clean and phone-quality: which languages are fine on Standard and which need High accuracy.",
    published: '2026-10-28',
    updated: '2026-10-28',
  },
  {
    slug: 'free-video-to-text-tools-compared',
    path: '/guides/free-video-to-text-tools-compared',
    label: 'Free video to text tools compared',
    title: 'Free Video to Text Tools Compared (2026)',
    description:
      'The free limits of thirteen video to text tools in one table: sign-up, minutes, file size and exports, each quoted from its own page on 28 October 2026.',
    published: '2026-10-28',
    updated: '2026-10-28',
  },
  {
    slug: 'how-to-transcribe-video-to-text',
    path: '/guides/how-to-transcribe-video-to-text',
    label: 'How to transcribe a video to text',
    title: 'How to Transcribe a Video to Text (Free)',
    description:
      'Five ways to transcribe a video to text: a YouTube transcript, voice typing, editor captions, an online service or your device. What each costs and gives you.',
    published: '2026-10-28',
    updated: '2026-10-28',
  },
  {
    slug: 'is-transcribevid-safe',
    path: '/guides/is-transcribevid-safe',
    label: 'Is TranscribeVid safe?',
    title: 'Is TranscribeVid Safe and Legit?',
    description:
      'Is TranscribeVid safe? Who runs it, what happens to your video, what is stored, how the site pays for itself and five checks you can make yourself.',
    published: '2026-10-29',
    updated: '2026-11-03',
  },
];

export const guideRoutePath = (g: GuideLink) => g.path.replace(/^\//, '');

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * "2026-10-27" -> "27 October 2026" in English; in another language that language's long date ("27 de octubre de 2026").
 * Always the Gregorian calendar and UTC, so the prerendered page and the browser agree whatever the visitor's settings.
 * Anything that is not a real date is returned unchanged.
 */
export function fmtLongDate(iso: string, locale = 'en'): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return iso;
  try {
    return new Intl.DateTimeFormat(`${locale === 'en' ? 'en-GB' : locale}-u-ca-gregory`, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
  } catch {
    return `${d} ${MONTHS[mo - 1]} ${y}`;
  }
}
