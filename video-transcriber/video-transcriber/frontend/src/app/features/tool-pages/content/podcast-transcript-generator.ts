import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Podcast transcript generator',
  h1: 'Generate a podcast transcript from your audio file',
  lead: 'Drop in an episode and get a full, timestamped transcript to publish beside it, search, quote or turn into show notes. Free, with no sign-up, and available in more than 50 languages.',
  dropKind: 'audio',
  dropNoun: 'podcast episode',

  whyTitle: 'Why give an episode a transcript',
  why: [
    "A transcript makes an episode easier to find, quote and follow. Listeners can skim it, read along on mute or in a noisy place, and search it for a guest's name. Deaf and hard-of-hearing listeners, and people who listen in a second language, can use it too. Search engines also read text far more easily than audio.",
    "This page makes the first draft: the whole episode as text, with the time on each line. Plan to edit it. Speech recognition does not know your guests' names or your show's jargon, and it does not label speakers. Use it on episodes you made or are cleared to use.",
  ],

  sections: [
    {
      title: 'From transcript to episode page',
      paragraphs: ['One transcript can feed several things you already publish.'],
      bullets: [
        {
          title: 'Show notes.',
          text: 'Read the transcript once, pick the topics and write a short summary with the timestamp of each. Download Markdown to paste into a notes app or a blog editor.',
        },
        {
          title: 'A transcript under the player.',
          text: 'Download TXT, tidy the paragraphs and add names such as Host and Guest by hand. The transcript has no speaker labels of its own.',
        },
        {
          title: 'Captions for a video version.',
          text: 'If you also publish the episode as a video, download SRT or VTT and upload it as captions.',
        },
        {
          title: 'Quotes and clips.',
          text: 'Find the line, read its timestamp and cut the clip from your audio at that time.',
        },
      ],
    },
    {
      title: 'Getting names, jargon and ad reads right',
      paragraphs: [
        'Guest names, brand names and show terms are what a recogniser gets wrong most. Before you start, list them in the vocabulary hint under More options: the host, the guests, the show name, products and any term you use often. When the transcript is ready, type a wrongly spelled name into the Search the text box above it, open Replace…, enter the right spelling and apply it to every matching line at once. Lines the recogniser was unsure about are marked, so review those first.',
        'Leave the Skip silence & music switch on in More options, so jingles and long pauses do not turn into invented words. Sound effects and music beds under an ad read can still add stray text, so delete anything that was not said.',
      ],
    },
  ],

  howTitle: 'How to generate a podcast transcript',
  howToDescription:
    'Add the episode, list the names and terms, wait for the transcript and download it for the episode page.',
  steps: [
    {
      title: 'Add the episode',
      text: 'Drop the episode on the box above, or press Choose a file. MP3 is the usual podcast format, but WAV, M4A, FLAC and others work. One episode goes in this box at a time; on the next page, Add another file lets you include more episodes.',
    },
    {
      title: 'List the names and terms',
      text: 'On the next page, open More options and put the host, the guests, the show name and any jargon in the vocabulary hint. Choose the spoken language, or keep Detect automatically.',
    },
    {
      title: 'Start and wait for the transcript',
      text: 'Press Transcribe. Text appears line by line with a progress bar. Standard suits most episodes. Crosstalk or poor audio is where High accuracy or Best accuracy earn their time. They are slower, need a larger first-time download, and show greyed out with a reason on a device that cannot run them.',
    },
    {
      title: 'Edit and export',
      text: 'Fix names and punctuation and add speaker names by hand. Then download TXT or Markdown for the episode page, or SRT or VTT for a video version.',
    },
  ],

  formatsTitle: 'Podcast files and downloads',
  formatsIntro:
    'MP3 is the usual podcast format. Other audio files are read in the same way, and video files are accepted too.',
  uploadTitle: 'Audio files you can add',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'the transcript to publish under the player' },
    { name: 'Markdown', use: 'show notes with timestamps' },
    { name: 'SRT', use: 'captions for a video version' },
    { name: 'VTT', use: 'a transcript track for web players' },
    { name: 'PDF', use: 'a transcript to share or print' },
  ],

  tipsTitle: 'Tips for podcast transcripts',
  tips: [
    {
      title: 'Transcribe the final mix.',
      text: 'The mastered episode, with intro and ad reads, is what listeners hear. Its timestamps then match the file you publish.',
    },
    {
      title: 'Use your original WAV when you have it.',
      text: 'An MP3 is a compressed copy, and every extra round of compression loses detail. Cleaner audio gives fewer mistakes.',
    },
    {
      title: 'Cut very long episodes into parts.',
      text: 'A file larger or longer than the limits shown on this page cannot be processed, so split a long episode in any audio editor first.',
      browser: {
        title: 'Long episodes take longer.',
        text: 'The site sets no cap on episode length, but a long conversation show needs time and free memory on your device. Splitting it at a natural break in any audio editor gets you the first part sooner.',
      },
    },
    {
      title: 'Read along once.',
      text: 'Reading the transcript while the episode plays at normal speed is the quickest way to catch the mistakes that matter.',
    },
    {
      title: 'Say it is automatic.',
      text: 'If you publish a transcript without a full edit, say so, so readers know small mistakes are possible.',
    },
  ],

  faqs: [
    {
      question: 'Can I publish an automatic podcast transcript on my episode page?',
      answer:
        'Yes, for an episode you made. Read it through first, correct the names, add speaker names by hand and tell readers that it was made automatically. If a guest asked for something to be left out, remove it from the text too.',
    },
    {
      question: 'Does the podcast transcript have speaker names?',
      answer:
        'No. Type "Host" and "Guest" into the text as you edit; the transcript itself carries only times.',
    },
    {
      question: 'Can I get show notes from a podcast transcript?',
      answer:
        'You get the raw material, not a summary. The transcript does not write show notes for you, but its timestamps make it quick to list the topics and the minute each one starts.',
    },
    {
      question: 'How long a podcast episode can I transcribe in one go?',
      answer: '{limits} A long episode may need splitting. There is no daily or monthly quota.',
      browser: {
        answer:
          'Episode length is not capped by the site. A long episode takes longer and needs free memory on your own device; the page warns you on a slower one.',
      },
    },
    {
      question: 'Can I transcribe a podcast from its RSS feed or a link?',
      answer:
        'No. TranscribeVid works with files you add, not web links or feeds. Use the episode file you made or exported, and add it in the box at the top of this page.',
    },
  ],

  links: [
    {
      label: 'MP3 to text',
      path: '/mp3-to-text',
      note: 'Settings and tips for the most common podcast file type.',
    },
    {
      label: 'SRT subtitle generator',
      path: '/srt-subtitle-generator',
      note: 'Captions for a video version of the episode.',
    },
    {
      label: 'SRT vs VTT',
      path: '/guides/srt-vs-vtt',
      note: 'Which caption file your player or host expects.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'Fewer mistakes from the same episode.',
    },
  ],
};
