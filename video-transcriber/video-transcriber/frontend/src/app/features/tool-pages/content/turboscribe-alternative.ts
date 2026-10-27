import { ToolPageContent } from '../tool-page.model';

/** Facts about TurboScribe come only from the pages in `comparison.sources`, as they read on the `checked` date. */
export const CONTENT: ToolPageContent = {
  eyebrow: 'TurboScribe alternative',
  h1: 'A free TurboScribe alternative, compared honestly',
  lead: 'TurboScribe is a popular transcription service built on Whisper. If three free files a day is not enough, or you would rather not make an account, here is how TranscribeVid compares, including where TurboScribe is the better choice.',
  browserLead:
    'TurboScribe is a popular transcription service built on Whisper. If three free files a day is not enough, or you would rather not upload your recordings, here is how TranscribeVid compares, including where TurboScribe is the better choice.',
  dropKind: 'video',
  dropNoun: 'file',

  whyTitle: 'Same family of models, different trade-offs',
  why: [
    "Both tools are built on OpenAI's Whisper speech recognition models, so with a similar model size you can expect similar text. We have not run a formal side-by-side test. The real differences are in limits, accounts and where the work happens.",
    'TranscribeVid has no sign-up and no daily cap, and every export, including SRT and PDF, is free. It can also write Hindi in Roman letters (Hinglish). TurboScribe offers more on its paid plan: speaker recognition, imports from links and very long files.',
  ],
  browserWhy: [
    "Both tools are built on OpenAI's Whisper speech recognition models, so with a similar model size you can expect similar text. We have not run a formal side-by-side test. The real differences are in limits, accounts and where the work happens.",
    'TranscribeVid runs Whisper in your browser, on your own device. There is no sign-up, no daily cap and no upload, and every export, including SRT and PDF, is free. It can also write Hindi in Roman letters (Hinglish). The trade-off is speed: your device does the work, so an old phone is much slower than a cloud server.',
  ],

  comparison: {
    title: 'TranscribeVid and TurboScribe side by side',
    intro: "The free offer of each tool, plus TurboScribe's paid plan. Prices are in US dollars.",
    them: 'TurboScribe',
    checked: '27 October 2026',
    rows: [
      { topic: 'Account', us: 'None: no sign-up, no e-mail address.', them: 'A free account is needed to keep transcribing (no card).' },
      { topic: 'Free use', us: 'No daily or monthly cap.', them: '3 files a day, 30 minutes each.' },
      {
        topic: 'Paid plan',
        us: 'None. It is free.',
        browserUs: 'None. It is free, paid for by ads.',
        them: '$20 a month, or $10 a month billed yearly: unlimited files of at most 10 hours or 5 GB each.',
      },
      {
        topic: 'Where the audio is processed',
        us: 'On the server that runs this site; deleted when your session ends.',
        browserUs: 'In your browser, on your own device. The file is not uploaded.',
        them: "On TurboScribe's servers.",
      },
      {
        topic: 'Speed',
        us: 'Depends on the server and the quality level.',
        browserUs: 'Depends on your device: quick on a recent laptop, slow on an older phone.',
        them: 'Their servers do the work, so it does not depend on your device.',
      },
      { topic: 'Speaker labels', us: 'No.', them: 'Yes, speaker recognition.' },
      { topic: 'Links', us: 'No. You add your own files.', them: 'Imports from YouTube, Dropbox, Google Drive and Vimeo.' },
      {
        topic: 'Languages',
        us: '50+ spoken languages, translation into English, Hinglish for Hindi.',
        them: '98+ spoken languages, translation into 134+ languages.',
      },
      { topic: 'Exports', us: 'TXT, SRT, VTT, Markdown, JSON and PDF, all free.', them: 'PDF, SRT, VTT and other formats.' },
      {
        topic: 'Your transcripts',
        us: 'Kept for your session only; download what you need.',
        browserUs: 'Kept in this browser for a while; download what you need.',
        them: 'Kept in your TurboScribe account.',
      },
    ],
    sources: [
      {
        label: 'ConvertAudioToText: best no-signup transcription tools (updated 30 June 2026)',
        url: 'https://convertaudiototext.com/blog/best-no-signup-transcription-tools',
      },
      { label: 'Tools for Humans: TurboScribe', url: 'https://www.toolsforhumans.ai/ai-tools/turboscribe' },
      { label: 'TurboScribe: TurboScribe vs Otter.ai', url: 'https://turboscribe.ai/learn/turboscribe-vs-otter-ai' },
    ],
  },

  howTitle: 'How to transcribe a file here instead',
  howToDescription: 'Add the file, pick the Whisper model that matches what you need, wait for the transcript and download any format for free.',
  steps: [
    {
      title: 'Choose your file',
      text: 'Drop the same audio or video in the box at the top of this page. No account is needed.',
    },
    {
      title: 'Match the model',
      text: 'Best accuracy here is Whisper Large v3, High accuracy is Large v3 Turbo, and Standard and Fastest are smaller Whisper models.',
    },
    {
      title: 'Wait for the transcript',
      text: 'Progress and the time left are shown while it works.',
      browser: {
        text: 'Your device does the work. On a recent laptop it is quick; on an older phone, pick Fastest. The first use downloads the model once.',
      },
    },
    {
      title: 'Export for free',
      text: 'Download TXT, SRT, VTT, Markdown, JSON or PDF. None of them costs anything.',
    },
  ],

  formatsTitle: 'Files and exports',
  formatsIntro: 'The same kinds of files you would give TurboScribe work here.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MOV', 'MKV', 'WEBM', 'MP3', 'WAV', 'M4A', 'FLAC'],
  downloads: [
    { name: 'TXT', use: 'plain text, or a time on each line' },
    { name: 'SRT', use: 'subtitles for players and editors' },
    { name: 'VTT', use: 'subtitles for web video' },
    { name: 'PDF', use: 'a transcript to print or share' },
    { name: 'Markdown', use: 'notes with timestamps' },
    { name: 'JSON', use: 'words, times and confidence for developers' },
  ],

  tipsTitle: 'When TurboScribe is the better choice',
  tips: [
    {
      title: 'You need speaker labels.',
      text: 'TurboScribe can tell speakers apart. TranscribeVid does not label speakers.',
    },
    {
      title: 'Your file is on YouTube or in the cloud.',
      text: 'TurboScribe can import from YouTube, Dropbox, Google Drive and Vimeo links. Here you add the file itself.',
    },
    {
      title: 'Your files are very long.',
      text: "TurboScribe's paid plan takes files of 10 hours. Here each file has the length limit shown under the drop box.",
      browser: {
        title: 'Your device is slow and your files are long.',
        text: "TurboScribe's servers do the work, so a weak phone does not slow it down. Here an old phone takes a long time on a long file.",
      },
    },
    {
      title: 'You want your transcripts in an account.',
      text: 'TurboScribe keeps them in your account. Here they stay only for your session, so you download what you want to keep.',
      browser: {
        text: 'TurboScribe keeps them in your account. Here they stay in this browser for a while, so you download what you want to keep.',
      },
    },
    {
      title: 'You need other target languages.',
      text: 'TurboScribe lists translation into more than 134 languages. TranscribeVid translates speech into English only.',
    },
  ],

  faqs: [
    {
      question: 'Is TranscribeVid really free with no daily limit?',
      answer: 'Yes. There is no account, no plan and no daily or monthly cap.',
      browser: {
        answer: 'Yes. There is no account, no plan and no daily or monthly cap. The site is paid for by ads, and no ad is shown while a file is being transcribed.',
      },
    },
    {
      question: 'Is it as accurate as TurboScribe?',
      answer:
        "Both are built on OpenAI's Whisper, so with the same model size you can expect similar results, but we have not tested them side by side. Choose Best accuracy here for the largest model. Neither tool is perfect on noisy audio or strong accents.",
    },
    {
      question: 'Where is my file processed?',
      answer:
        'On the server that runs this site, and it is deleted when your session ends. TurboScribe processes files on its own servers.',
      browser: {
        answer:
          'In your browser, on your own device: the file is never uploaded. TurboScribe, like most online services, processes files on its own servers.',
      },
    },
    {
      question: 'Is there anything to cancel?',
      answer: 'No. There is no account, trial or payment, so there is nothing to cancel and nothing that renews.',
    },
    {
      question: 'Which should I use for a two-hour file?',
      answer:
        "Check the length limit under the drop box first. On TurboScribe's free plan files are limited to 30 minutes; its paid plan takes files of 10 hours.",
      browser: {
        answer:
          "TranscribeVid sets no length limit, so it works if your device is fast enough; a laptop is a better choice than a phone. On TurboScribe's free plan files are limited to 30 minutes; its paid plan takes files of 10 hours.",
      },
    },
  ],

  related: ['/otter-ai-alternative', '/private-transcription', '/video-to-text', '/hindi-audio-to-text', '/srt-subtitle-generator'],

  links: [
    {
      label: 'How transcription on your own device works',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Why there is no daily cap and no upload, and what depends on your device.',
    },
    {
      label: 'What is Whisper',
      path: '/guides/what-is-whisper',
      note: 'The open speech model that does the work, in plain words.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'Settings and habits that reduce mistakes, whichever tool you use.',
    },
  ],
};
