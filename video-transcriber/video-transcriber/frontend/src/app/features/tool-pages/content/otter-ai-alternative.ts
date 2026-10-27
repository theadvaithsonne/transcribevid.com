import { ToolPageContent } from '../tool-page.model';

/** Facts about Otter.ai come only from the pages in `comparison.sources`, as they read on the `checked` date. */
export const CONTENT: ToolPageContent = {
  eyebrow: 'Otter.ai alternative',
  h1: 'A free Otter.ai alternative for recorded files',
  lead: 'Otter.ai is built for live meetings. If you mostly need to transcribe recordings you already have, its free plan allows only three file imports in total. TranscribeVid transcribes as many recordings as you like, with no account.',
  browserLead:
    'Otter.ai is built for live meetings. If you mostly need to transcribe recordings you already have, its free plan allows only three file imports in total. TranscribeVid transcribes as many recordings as you like, with no account and no upload.',
  dropKind: 'video',
  dropNoun: 'recording',

  whyTitle: 'Recordings, not live meetings',
  why: [
    'Otter is strong in live meetings: its assistant can join Zoom, Teams and Google Meet, write notes while people talk, identify speakers and keep everything in your account, with apps for iOS and Android. If that is what you need, Otter is a good fit.',
    'If your work starts with a file, such as a recorded interview, a lecture, a voice memo or a downloaded meeting, the free Basic plan is tight: 300 minutes a month, 30 minutes per conversation and 3 file imports for the life of the account. TranscribeVid has no monthly minutes and no import count, and needs no sign-up.',
  ],
  browserWhy: [
    'Otter is strong in live meetings: its assistant can join Zoom, Teams and Google Meet, write notes while people talk, identify speakers and keep everything in your account, with apps for iOS and Android. If that is what you need, Otter is a good fit.',
    'If your work starts with a file, such as a recorded interview, a lecture, a voice memo or a downloaded meeting, the free Basic plan is tight: 300 minutes a month, 30 minutes per conversation and 3 file imports for the life of the account. TranscribeVid has no monthly minutes, no import count and no length limit, needs no sign-up, and transcribes on your own device without uploading the file.',
  ],

  comparison: {
    title: 'TranscribeVid and Otter.ai side by side',
    intro: "The free plans compared, from Otter's pricing page and an independent round-up. Prices are in US dollars.",
    them: 'Otter.ai',
    checked: '27 October 2026',
    rows: [
      { topic: 'Account', us: 'None: no sign-up, no e-mail address.', them: 'Sign-up with an e-mail address (no card).' },
      { topic: 'Free minutes', us: 'No monthly cap.', them: '300 minutes a month.' },
      {
        topic: 'Length per file',
        us: 'The limit shown under the drop box.',
        browserUs: 'No limit; long files take longer on a slow device.',
        them: '30 minutes per conversation.',
      },
      { topic: 'File imports', us: 'As many as you like.', them: '3 in total, for the life of the account.' },
      { topic: 'Live meetings', us: 'No. Recordings only.', them: 'Yes. An assistant joins Zoom, Teams and Google Meet.' },
      { topic: 'Speaker labels', us: 'No.', them: 'Yes, speaker identification.' },
      { topic: 'Apps', us: "No app. It works in your phone's browser.", them: 'iOS and Android apps.' },
      {
        topic: 'Where the audio is processed',
        us: 'On the server that runs this site; deleted when your session ends.',
        browserUs: 'In your browser, on your own device. The file is not uploaded.',
        them: "On Otter's servers, kept in your account.",
      },
      {
        topic: 'Paid plan',
        us: 'None. It is free.',
        browserUs: 'None. It is free, paid for by ads.',
        them: 'Pro: $8.33 per user a month billed yearly, or $16.99 billed monthly.',
      },
    ],
    sources: [
      { label: 'Otter.ai pricing', url: 'https://otter.ai/pricing' },
      {
        label: 'ConvertAudioToText: best no-signup transcription tools (updated 30 June 2026)',
        url: 'https://convertaudiototext.com/blog/best-no-signup-transcription-tools',
      },
    ],
  },

  howTitle: 'How to transcribe a recording without Otter',
  howToDescription: 'Download the recording from your meeting app or phone, add it here, choose the language and quality, then edit and export.',
  steps: [
    {
      title: 'Get the recording',
      text: 'Use the file from your meeting app, phone or recorder. Zoom, Teams and Google Meet all let you download recordings.',
    },
    {
      title: 'Add it here',
      text: 'Drop it in the box at the top of this page. There is no account and no import count.',
    },
    {
      title: 'Pick language and quality',
      text: 'Choose the spoken language. High accuracy or Best accuracy is worth it for meetings with several voices.',
    },
    {
      title: 'Edit and export',
      text: 'Type in speaker names where you need them, then download TXT, PDF, Markdown, SRT, VTT or JSON.',
    },
  ],

  formatsTitle: 'Recordings and exports',
  formatsIntro: 'Files from meeting apps, phones and recorders all work.',
  uploadTitle: 'Recordings you can add',
  accepts: ['MP4', 'M4A', 'MP3', 'WAV', 'WEBM', 'MOV', 'AAC', 'OGG'],
  downloads: [
    { name: 'TXT', use: 'plain text, or a time on each line' },
    { name: 'PDF', use: 'notes to share or file' },
    { name: 'Markdown', use: 'notes for Notion, Obsidian and similar apps' },
    { name: 'SRT', use: 'captions for the recording' },
    { name: 'VTT', use: 'captions for a web player' },
    { name: 'JSON', use: 'lines and word times for programs' },
  ],

  tipsTitle: 'When Otter is the better choice',
  tips: [
    {
      title: 'You want notes during the meeting.',
      text: 'Otter transcribes live and can join your calls. TranscribeVid works only on recordings, after the meeting.',
    },
    {
      title: 'You need to know who said what.',
      text: 'Otter identifies speakers. TranscribeVid gives timestamps but no speaker labels.',
    },
    {
      title: 'You want an app and an archive.',
      text: 'Otter has iOS and Android apps and keeps transcripts in your account. Here you download what you want to keep.',
    },
    {
      title: 'Your team shares notes.',
      text: "Otter's assistant writes and shares meeting notes with the team. TranscribeVid has no sharing: you send the file yourself.",
    },
    {
      title: 'Not sure? Try both.',
      text: 'For a recorded file, run one recording through each tool and compare. Your own audio is the best test.',
    },
  ],

  faqs: [
    {
      question: 'Is there a free Otter alternative without import limits?',
      answer: 'Yes. TranscribeVid has no import count and no monthly minutes. Add as many recordings as you like, one after another.',
    },
    {
      question: 'Can TranscribeVid join my Zoom or Teams meeting?',
      answer: 'No. It never joins calls. Record the meeting in Zoom, Teams or Google Meet, then add the recording here.',
    },
    {
      question: 'Does it label speakers like Otter?',
      answer: 'No. This is the main thing Otter does that TranscribeVid does not. Each line has a timestamp, and you can add names while you edit.',
    },
    {
      question: 'Can I use it on my phone like the Otter app?',
      answer: "There is no app, but the page works in your phone's browser: choose a recording on your phone and read the text there.",
      browser: {
        answer:
          "There is no app, but the page works in your phone's browser. The phone does the transcription itself, so short recordings and the Fastest level work best there.",
      },
    },
    {
      question: 'Where is my recording processed, compared with Otter?',
      answer: 'On the server that runs this site, and only for your session. Otter processes recordings on its servers and keeps them in your account.',
      browser: {
        answer: 'On your own device: the recording is never uploaded. Otter processes recordings on its servers and keeps them in your account.',
      },
    },
  ],

  related: [
    '/turboscribe-alternative',
    '/meeting-recording-to-text',
    '/interview-transcription',
    '/private-transcription',
    '/audio-to-text',
  ],

  links: [
    {
      label: 'How transcription on your own device works',
      path: '/guides/transcribe-video-without-uploading',
      note: 'What "nothing is uploaded" means in practice, and what it does not cover.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'What to change about the recording and the settings when the first result is not good enough.',
    },
    {
      label: 'Meeting recording to text',
      path: '/meeting-recording-to-text',
      note: 'The step-by-step way to transcribe a Zoom, Meet or Teams recording without a bot.',
    },
  ],
};
