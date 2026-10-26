import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'M4A to text',
  h1: 'Transcribe an M4A voice memo to text',
  lead: 'M4A is what Voice Memos on iPhone and Mac, many Android recorders and Apple apps save. Add the file and get a timestamped transcript, free, with no login and no conversion to MP3.',
  dropKind: 'audio',
  dropNoun: 'M4A',

  whyTitle: 'Why M4A files transcribe well',
  why: [
    'An M4A is an audio-only MPEG-4 file. It usually holds AAC sound, which is compressed but more than good enough for speech, so M4A files are small and transcribe well. TranscribeVid reads them directly. There is nothing to convert first.',
    'Voice memos are made on the go, so they are often quiet, echoey or recorded with the phone in a pocket. The quality choices and clean-up options on this page exist for exactly that kind of recording.',
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

  howTitle: 'How to turn an M4A into text',
  howToDescription:
    'Add the M4A file, choose the spoken language, wait for the transcript and download it as text.',
  steps: [
    {
      title: 'Add the M4A',
      text: 'Drop the .m4a memo on the box at the top of this page, or press Choose a file and, on a phone, pick it from Files or your recordings folder. Only one memo goes in this box; once you are on the next page, Add another file brings in the rest.',
    },
    {
      title: 'Choose the language',
      text: 'On the next page, select the spoken language. A short memo gives Detect automatically little to work with, so naming the language is more reliable. Standard quality suits most memos. Then press Transcribe.',
    },
    {
      title: 'Wait for the transcript',
      text: 'Lines appear one by one with a progress bar and an estimate of the time left. Play from any line to hear what was said.',
    },
    {
      title: 'Fix and save it',
      text: 'Correct any wrong word, then download TXT, Markdown or PDF for notes, or SRT or VTT if the memo goes with a video. A transcript lives only for your session, so download it before you close the page.',
    },
  ],

  formatsTitle: 'M4A and other audio formats',
  formatsIntro:
    'Phone and desktop recorders save in different formats. This box takes all of these.',
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

  tipsTitle: 'Tips for transcribing voice memos',
  tips: [
    {
      title: 'Hold the phone close.',
      text: 'A memo recorded with the phone in a pocket or across a table is hard for any recogniser. Hold the phone a hand width from your mouth and talk across it, not into it.',
    },
    {
      title: 'Trim before you share.',
      text: 'Most voice memo apps let you cut the start and end of a recording. Removing a long pause at either end saves waiting time.',
    },
    {
      title: 'Name the language.',
      text: 'For a memo of ten or twenty seconds, choosing the spoken language beats automatic detection, especially for accented speech or a mix of languages.',
    },
    {
      title: 'Give it the hard names.',
      text: 'Add unusual names to the vocabulary hint in More options and they are far more likely to come out right.',
    },
  ],

  faqs: [
    {
      question: 'Can I transcribe an iPhone Voice Memo without converting it?',
      answer:
        'Yes. Voice Memos are M4A files and TranscribeVid reads M4A directly. Share the memo to Files or to your computer, then add it here. Do not convert it to MP3 first.',
    },
    {
      question: 'Is an M4A file the same as an MP4?',
      answer:
        'They are close relatives. Both use the MPEG-4 container; an M4A holds audio only, while an MP4 usually carries video as well. TranscribeVid reads the sound from either.',
    },
    {
      question: 'Why is my M4A transcript empty or very short?',
      answer:
        'The memo may be silent, very quiet or mostly background noise. Play it back first. If it is faint, keep Enhance audio on in More options, and check that the file was not cut short when you shared it.',
    },
    {
      question: 'Can I transcribe a long meeting recorded on my phone?',
      answer:
        'Yes. M4A files are small, so a long recording is easy to add. {limits} There is no daily or monthly quota.',
      browser: {
        answer:
          'Yes. M4A files are small, so a long recording is easy to add. The site sets no size or length limit because your own device does the work, so a very long memo simply takes longer, and on a slower device the page says so before you start. An older browser may refuse a very long file.',
      },
    },
    {
      question: 'Can I transcribe a voice memo in Hindi or Spanish?',
      answer:
        'Yes. Pick the spoken language from the list of more than 50, or leave Detect automatically on for a memo in one language. For Hindi, Transcript style (next to Language) lets you choose Roman letters (Hinglish) or the original Devanagari script.',
    },
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
