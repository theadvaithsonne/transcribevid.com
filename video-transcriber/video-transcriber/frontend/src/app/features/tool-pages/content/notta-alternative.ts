import { ToolPageContent } from '../tool-page.model';

/** Facts about Notta come only from the pages in `comparison.sources`, as they read on the `checked` date. */
export const CONTENT: ToolPageContent = {
  eyebrow: 'Notta alternative',
  h1: 'A free Notta alternative for recordings longer than three minutes',
  lead: "Notta's free plan transcribes recordings of up to three minutes, and its free web tools one file of three minutes per person. If your recordings are longer, or you would rather not make an account, here is how TranscribeVid compares, including where Notta is the better choice.",
  browserLead:
    "Notta's free plan transcribes recordings of up to three minutes, and its free web tools one file of three minutes per person. If your recordings are longer, or you would rather not upload them to a service, here is how TranscribeVid compares, including where Notta is the better choice.",
  dropKind: 'video',
  dropNoun: 'recording',

  whyTitle: 'Where the free plans differ',
  why: [
    'Notta is a meeting and transcription service with a bot that can join your calls, speaker labels and AI summaries. Its free plan gives 120 transcription minutes a month and 50 file uploads a month, but each recording can be at most three minutes long, and exporting a transcript is listed as a Pro feature.',
    'TranscribeVid is a simpler tool for a file you already have. There is no account, no monthly minutes and no per-recording cap, and every export is free. It does not join meetings, label speakers or write summaries, so for those jobs Notta is the better fit.',
  ],
  browserWhy: [
    'Notta is a meeting and transcription service with a bot that can join your calls, speaker labels and AI summaries. Its free plan gives 120 transcription minutes a month and 50 file uploads a month, but each recording can be at most three minutes long, and exporting a transcript is listed as a Pro feature.',
    'TranscribeVid is a simpler tool for a file you already have. It runs in your browser, so there is no account, no monthly minutes, no per-recording cap and no upload, and every export is free. It does not join meetings, label speakers or write summaries, so for those jobs Notta is the better fit. The trade-off is speed: your own device does the work.',
  ],

  comparison: {
    title: 'TranscribeVid and Notta side by side',
    intro: "Notta's free plan and its free web tools, from Notta's own pricing, tool and security pages. Prices are in US dollars.",
    them: 'Notta',
    checked: '28 October 2026',
    rows: [
      {
        topic: 'Free plan',
        us: 'No plan: free, with no daily or monthly cap.',
        them: '$0, no credit card: 120 transcription minutes a month and 50 file uploads a month.',
      },
      {
        topic: 'Length per recording',
        us: 'The limit shown under the drop box.',
        browserUs: 'No limit; a long file takes longer on a slow device.',
        them: 'Three minutes per conversation on the free plan; five hours per recording on Pro.',
      },
      {
        topic: 'Account',
        us: 'None: no sign-up, no e-mail address.',
        them: 'An account for the web app. The separate free web tools need none: one file of at most 3 minutes per user, with the result sent by e-mail and a link that expires in 72 hours.',
      },
      {
        topic: 'Paid plans',
        us: 'None. It is free.',
        browserUs: 'None. It is free, paid for by ads.',
        them: 'Pro: $8.17 a month billed yearly ($97.99), 1,800 minutes a month. Business: $16.67 a month billed yearly ($199.99).',
      },
      {
        topic: 'Exports',
        us: 'TXT, SRT, VTT, Markdown, JSON and PDF, all free.',
        them: 'Exporting transcripts is listed under Pro. Its pages name TXT, SRT, PDF, Word and Excel files.',
      },
      {
        topic: 'After you stop paying',
        us: 'No account, so nothing to downgrade: download what you want to keep.',
        them: 'Transcripts are saved, but a free user "can only view the first 3 minutes of the transcript".',
      },
      {
        topic: 'Where the audio is processed',
        us: 'On the server that runs this site; deleted when your session ends.',
        browserUs: 'In your browser, on your own device. The file is not uploaded.',
        them: 'On Notta\'s servers: "Notta hosts all its software on Amazon Web Services (AWS)".',
      },
      {
        topic: 'Offline mode',
        us: 'Nothing to install.',
        browserUs: 'Nothing to install: it already runs in your browser, with no plan or account.',
        them: 'Privacy Mode is a desktop download (Mac and Windows, beta) that needs an account and an offline engine. Its local model lists Simplified Chinese, English, Japanese, Korean and Cantonese.',
      },
      { topic: 'Speaker labels', us: 'No.', them: 'Yes: it "automatically labels who said what".' },
      {
        topic: 'Links',
        us: 'No. You add your own files.',
        them: 'Yes: YouTube, Google Drive or Dropbox links on its video page.',
      },
      {
        topic: 'Languages',
        us: '50+ spoken languages, translation into English, Hinglish for Hindi.',
        them: 'Its pages say 58 languages in most places and 90 on one, and translation into 42 languages.',
      },
    ],
    sources: [
      { label: 'Notta pricing', url: 'https://www.notta.ai/en/pricing' },
      { label: 'Notta: free MP3 to text tool', url: 'https://www.notta.ai/en/tools/mp3-to-text' },
      { label: 'Notta: MP3 to text', url: 'https://www.notta.ai/en/mp3-to-text' },
      { label: 'Notta: video to text', url: 'https://www.notta.ai/en/video-to-text' },
      { label: 'Notta: audio to text converter', url: 'https://www.notta.ai/en/tools/audio-to-text-converter' },
      { label: 'Notta: Privacy Mode', url: 'https://www.notta.ai/en/features/privacy-mode' },
      { label: 'Notta: security', url: 'https://www.notta.ai/en/security' },
    ],
  },

  howTitle: 'How to transcribe a longer recording here',
  howToDescription: 'Add the recording, name the language, wait for the transcript and download any format for free.',
  steps: [
    {
      title: 'Add the recording',
      text: 'Drop the audio or video in the box at the top of this page. No account is needed.',
    },
    {
      title: 'Choose language and quality',
      text: 'Pick the spoken language, then a quality level: Standard for most recordings, High accuracy or Best accuracy for accents, noise or Hindi.',
    },
    {
      title: 'Wait for the transcript',
      text: 'Progress and the time left are shown while it works.',
      browser: {
        text: 'Your device does the work, so a long recording is slower on an old phone. The first use of a level downloads its model once.',
      },
    },
    {
      title: 'Export for free',
      text: 'Download TXT, SRT, VTT, Markdown, JSON or PDF. None of them needs a paid plan.',
    },
  ],

  formatsTitle: 'Recordings and exports',
  formatsIntro: 'The recordings you would give Notta work here, and the exports are not tied to a plan.',
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

  tipsTitle: 'When Notta is the better choice',
  tips: [
    {
      title: 'You need to know who said what.',
      text: 'Notta labels speakers automatically. TranscribeVid does not label speakers.',
    },
    {
      title: 'You want a bot in your meetings.',
      text: 'Notta can join your calls and record them, and can summarise a transcript with AI. TranscribeVid only works on a file you already have, and writes no summaries.',
    },
    {
      title: 'The video is on YouTube, Google Drive or Dropbox.',
      text: "Notta's video page accepts links to videos on those services. Here you add the file itself.",
    },
    {
      title: 'Your company asks for a security certificate.',
      text: 'Notta says it has "SOC 2 Type II certification" and is GDPR compliant. TranscribeVid has no such certificate.',
      browser: {
        text: 'Notta says it has "SOC 2 Type II certification" and is GDPR compliant. TranscribeVid has no such certificate; it relies on a different design, in which your files are never uploaded.',
      },
    },
    {
      title: 'You want your transcripts kept in an account.',
      text: 'Notta saves them for you. Here they are kept only for your session, so you download what you want to keep.',
      browser: {
        text: 'Notta saves them for you. Here they stay in this browser for a while, so you download what you want to keep.',
      },
    },
  ],

  faqs: [
    {
      question: "Is Notta's free plan really free?",
      answer:
        'Yes, in the sense that it costs nothing and needs no card. It gives 120 transcription minutes a month and 50 uploads a month, but each recording can be at most three minutes long, so it suits short clips better than interviews or lectures.',
    },
    {
      question: 'Can I export a transcript from the free plan?',
      answer:
        "Notta's pricing page lists exporting transcripts under the Pro plan. Here every format is free, and you can download it as many times as you like.",
    },
    {
      question: 'What happens to my Notta transcripts if I downgrade?',
      answer:
        'Notta says they are saved, but that a free user can only view the first three minutes of a transcript, and suggests exporting before you downgrade. A transcript made here is not tied to any plan.',
    },
    {
      question: 'Does Notta upload my recording?',
      answer:
        "In its web app, yes: the recording is transcribed in the cloud, and its security page says it hosts all its software on Amazon Web Services. Its desktop Privacy Mode can transcribe on your computer, but it needs an install, an account and a download of an offline engine.",
    },
    {
      question: 'Which is better for meetings?',
      answer:
        'Notta, if the meeting is live or you want speaker labels and summaries: it can join a call with a bot. TranscribeVid is better when you already have the recording and only need the text.',
    },
  ],

  related: ['/otter-ai-alternative', '/turboscribe-alternative', '/meeting-recording-to-text', '/transcribe-video-to-text', '/private-transcription'],

  links: [
    {
      label: 'Free video to text tools compared',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'The free limits of a dozen tools in one table, quoted from their own pages.',
    },
    {
      label: 'How transcription on your own device works',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Why there is no cap and no upload, and what depends on your device.',
    },
    {
      label: 'What is Whisper',
      path: '/guides/what-is-whisper',
      note: 'The open speech model that does the work, in plain words.',
    },
  ],
};
