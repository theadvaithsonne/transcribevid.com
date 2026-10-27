import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'M4A to text',
  h1: 'Convert M4A to text',
  lead: 'M4A is the audio format of iPhone Voice Memos, Zoom audio files and many recorder apps. Add an M4A and get it back as text with timestamps, free and with no login.',
  browserLead:
    'M4A is the audio format of iPhone Voice Memos, Zoom audio files and many recorder apps. Add an M4A and get it back as text with timestamps, free, with no login and no upload.',
  dropKind: 'audio',
  dropNoun: 'M4A',

  whyTitle: 'Where M4A files come from',
  why: [
    'Voice Memos on iPhone, iPad and Mac saves every recording as M4A. Zoom saves an audio-only M4A next to each local recording, and many Android recorder apps and podcast tools use it too. It is AAC audio in an MP4 container: small files with good speech quality.',
    'That makes M4A a good file to transcribe. A one-hour voice memo is usually well under 100 MB, and the sound is clear enough for the model to do well.',
  ],
  browserWhy: [
    'Voice Memos on iPhone, iPad and Mac saves every recording as M4A. Zoom saves an audio-only M4A next to each local recording, and many Android recorder apps and podcast tools use it too. It is AAC audio in an MP4 container: small files with good speech quality.',
    'That makes M4A a good file to transcribe. A one-hour voice memo is usually well under 100 MB, and your browser reads it straight from the device, with nothing to upload.',
  ],

  sections: [
    {
      title: 'Getting a voice memo off your phone',
      paragraphs: [
        'Menu names change between versions of iOS, macOS and Android, so treat these as a guide. If you are on the phone itself, press Choose a file and pick the recording from Files or your recordings folder. No computer is needed.',
      ],
      bullets: [
        {
          title: 'iPhone.',
          text: 'In Voice Memos, open the recording, tap the More button (three dots) and choose Share. Save it to Files, or send it to yourself by AirDrop or mail, then add it here.',
        },
        {
          title: 'Mac.',
          text: 'Drag a recording out of the Voice Memos window onto the Desktop. It arrives as an .m4a file, ready to add.',
        },
        {
          title: 'Android.',
          text: 'Many recorder apps save M4A files in a Recordings or Voice Recorder folder. The folder name depends on the app, and the file picker can open it.',
        },
      ],
    },
    {
      title: 'Lossless and compressed voice memos',
      paragraphs: [
        'Voice Memos on iPhone can save recordings as Compressed or Lossless. Lossless files are much larger, still end in .m4a and usually use the Apple Lossless codec. Speech does not need it: a Compressed memo gives the same transcript for a fraction of the size.',
      ],
      browser: {
        paragraphs: [
          'Voice Memos on iPhone can save recordings as Compressed or Lossless. Lossless files are much larger, still end in .m4a and usually use the Apple Lossless codec, which not every browser can read on its own. If yours cannot, the page may offer to load a small converter (about 9 MB) that runs on your device. Speech does not need Lossless: a Compressed memo gives the same transcript for a fraction of the size.',
        ],
      },
    },
  ],

  howTitle: 'How to convert an M4A file to text',
  howToDescription: 'Get the M4A out of Voice Memos or your recorder app, add it here, choose the language and download the text.',
  steps: [
    {
      title: 'Get the file',
      text: 'On iPhone, open Voice Memos, tap the recording, tap the three dots, then Share and Save to Files. On a Mac, drag a memo out of the Voice Memos app onto the desktop.',
    },
    {
      title: 'Add it here',
      text: 'Drop the .m4a in the box at the top of this page, or press Choose a file. On an iPhone, Choose a file opens Files, where you saved the memo.',
    },
    {
      title: 'Choose the language',
      text: 'Pick the spoken language, or keep auto-detect. For Hindi you can choose Devanagari or Hinglish under Transcript style.',
    },
    {
      title: 'Download',
      text: 'Fix any line, then download TXT or PDF to keep, or Markdown for your notes app.',
    },
  ],

  formatsTitle: 'M4A and related formats',
  formatsIntro: 'M4A and AAC files hold the same kind of audio. Both work, and so do these other audio formats.',
  uploadTitle: 'Audio files you can add',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'your words as plain text' },
    { name: 'Markdown', use: 'notes with times' },
    { name: 'PDF', use: 'a printable copy of the memo' },
    { name: 'SRT', use: 'timed lines for a video that goes with the memo' },
    { name: 'VTT', use: 'timed lines for web players' },
    { name: 'JSON', use: 'structured lines for programs' },
  ],

  tipsTitle: 'Tips for M4A files',
  tips: [
    {
      title: 'Save to Files first.',
      text: 'On an iPhone, a memo saved to Files is easy to pick in your browser with Choose a file.',
      browser: {
        title: 'Use Fastest on an iPhone.',
        text: 'For long memos on an iPhone, Fastest is the safe choice: the bigger models need more memory than Safari allows on many phones.',
      },
    },
    {
      title: 'Lossless memos are bigger.',
      text: 'If Voice Memos is set to Lossless, files are much larger but transcribe the same. Compressed is fine for speech.',
    },
    {
      title: 'Zoom audio file.',
      text: 'For a Zoom meeting, use the audio-only M4A in the meeting folder instead of the MP4: the same speech in a smaller file.',
    },
    {
      title: 'Name it.',
      text: 'The transcript takes the name of the file. Rename the memo before you add it, or rename the transcript afterwards under More.',
    },
    {
      title: 'Or record here.',
      text: 'You can skip the app: press Record from microphone on the home page and speak. The recording is transcribed when you stop.',
    },
  ],

  faqs: [
    {
      question: 'Is M4A the same as MP4?',
      answer: 'Almost. Both use the same container, but an M4A holds only audio, usually AAC. You can add either one here.',
    },
    {
      question: 'How do I transcribe an iPhone voice memo?',
      answer:
        'Save it to Files from the share menu in Voice Memos, open this page in Safari, press Choose a file and pick the memo. Or AirDrop it to a Mac and drop it here.',
    },
    {
      question: 'Why does my M4A not open?',
      answer:
        'The file may be damaged, still downloading from iCloud, or protected against copying. Open it in a media player to check, or export it again as MP3.',
    },
    {
      question: 'Voice Memos can show a transcript. Why use this?',
      answer:
        'Recent versions of iOS show a transcript in Voice Memos for some languages. Use this page for languages it does not cover, for Hinglish, or when you want timestamps and files to download.',
    },
    {
      question: 'How long can an M4A be?',
      answer: '{limits} A one-hour voice memo is usually far below the size limit. There is no daily or monthly quota.',
      browser: {
        answer: 'We set no limit. A long memo simply takes longer on your device, and the page warns you on a slower one. There is no daily or monthly quota.',
      },
    },
  ],

  related: [
    '/voice-recording-to-text',
    '/mp3-to-text',
    '/wav-to-text',
    '/whatsapp-voice-note-to-text',
    '/meeting-recording-to-text',
  ],
  links: [
    {
      label: 'Voice recording to text',
      path: '/voice-recording-to-text',
      note: 'Record with your microphone on the page instead of uploading a file.',
    },
    {
      label: 'MP3 to text',
      path: '/mp3-to-text',
      note: 'The same free transcription for MP3 files, the other common voice format.',
    },
    {
      label: 'Lecture to text',
      path: '/lecture-to-text',
      note: 'Turn a recorded lecture into notes you can search and study.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'Simple changes to the recording and the settings that make the biggest difference.',
    },
  ],
};
