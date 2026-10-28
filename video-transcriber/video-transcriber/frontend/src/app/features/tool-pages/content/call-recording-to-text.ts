import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Call recording to text',
  h1: 'Phone call recording to text, free and with timestamps',
  lead: 'Turn a recorded phone or voice call into a written transcript: add the recording and get timestamped text in more than 50 languages, free, with no login and no daily limit.',
  dropKind: 'audio',
  dropNoun: 'call recording',

  whyTitle: 'Why turn a call into text',
  why: [
    'A transcript is quicker to search and skim than a recording. It lets you find the price that was quoted, the date that was agreed or the instruction that was given, without listening to forty minutes again. It also makes a record you can share, or attach to a ticket, a case file or a set of notes.',
    'This page transcribes a recording you already have. It does not record calls. Phone calls are narrow-band audio and are harder than a studio recording, so the transcript is a good first draft that you should read through once, rather than a certified record.',
  ],
  browserWhy: [
    'A transcript is quicker to search and skim than a recording. It lets you find the price that was quoted, the date that was agreed or the instruction that was given, without listening to forty minutes again. It also makes a record you can share, or attach to a ticket, a case file or a set of notes.',
    'This page transcribes a recording you already have. It does not record calls. The recording is read on your own device and is never uploaded, which matters for a call with a customer, a client or a patient. Phone calls are narrow-band audio and harder than a studio recording, so the transcript is a good first draft that you should read through once, not a certified record.',
  ],

  sections: [
    {
      title: 'Recording a call: check the rules first',
      paragraphs: [
        'The law on recording calls differs from country to country, and in some places from state to state. In some, one person on the call may agree to the recording. In others, everyone must. Tell people they are being recorded and get their agreement unless you are sure the law in your case says otherwise. This is general information, not legal advice.',
      ],
    },
    {
      title: 'Where call recordings come from',
      paragraphs: ['Any of these saves a file you can add here.'],
      bullets: [
        {
          title: 'The phone.',
          text: 'Some Android phones record calls from the dialler, and many call-recorder apps save an audio file. Share or copy the file to the computer, or add it straight from the phone.',
        },
        {
          title: 'Business phone systems.',
          text: 'Cloud phone and contact-centre systems usually let you download a call as MP3 or WAV from the call log.',
        },
        {
          title: 'Video-call software.',
          text: 'Zoom saves an audio-only M4A next to its MP4 recording, which you can add here. Teams and Meet save an MP4 video: add that on the meeting recording page, which has the details.',
        },
        {
          title: 'Voice-chat apps.',
          text: 'Some messaging and voice-chat apps can save a call as an audio file, which usually uses the Opus format and works here.',
        },
      ],
    },
  ],

  howTitle: 'How to convert a call recording to text',
  howToDescription: 'Add the call recording, choose the language and quality, wait for the transcript, then edit and download it.',
  steps: [
    {
      title: 'Add the recording',
      text: 'Drop the call recording in the box at the top of this page, or press Choose a file.',
    },
    {
      title: 'Choose the language',
      text: 'Pick the language of the call. If the speakers switch between two languages, pick the main one and check the passages in the other language.',
    },
    {
      title: 'Pick a quality',
      text: 'Phone audio is thin and noisy. Choose High accuracy or Best accuracy for a call you need to rely on, and Fastest for a quick check of what was said.',
    },
    {
      title: 'Edit and download',
      text: 'Fix names, numbers and any line that looks wrong, then download TXT, PDF, SRT, VTT, Markdown or JSON.',
    },
  ],

  formatsTitle: 'Call recording files and downloads',
  formatsIntro: 'Most call recorders save M4A, MP3 or WAV. A video call is usually saved as an MP4 video: add that on the Meeting recording to text page, where only its sound is used.',
  uploadTitle: 'Files you can add',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'the call as plain text for a case file or an email' },
    { name: 'PDF', use: 'a printable copy' },
    { name: 'Markdown', use: 'notes with timestamps' },
    { name: 'SRT', use: 'timed lines for a player' },
    { name: 'VTT', use: 'timed lines for web players' },
    { name: 'JSON', use: 'words with times for your own tools' },
  ],

  tipsTitle: 'Tips for call recordings',
  tips: [
    {
      title: 'Check the numbers.',
      text: 'Amounts, phone numbers, dates and spellings of names are where a call transcript goes wrong most often. Listen to those lines again at their timestamps before relying on them.',
    },
    {
      title: 'Both sides are mixed.',
      text: 'If the two speakers are on separate channels, they are mixed into one transcript. Speakers are not labelled; the timestamps help you add "Caller" and "Agent" while you edit.',
    },
    {
      title: 'Speakerphone is harder.',
      text: 'A call on speakerphone has echo, and people talk over each other. If you can choose, record the call with headsets.',
    },
    {
      title: 'Add names to the vocabulary hint.',
      text: 'Put company, product and person names in the vocabulary hint under More options so they are spelled as you write them.',
    },
    {
      title: 'Skip hold music.',
      text: 'Keep Skip silence & music on in More options so hold music and silence do not become made-up sentences.',
    },
  ],

  faqs: [
    {
      question: 'Can this record my phone calls?',
      answer: 'No. It turns a recording you already have into text. Recording the call itself is done by your phone, your phone system or an app, and the rules on consent depend on where you are.',
    },
    {
      question: 'How accurate is a transcript of a phone call?',
      answer: 'Lower than for a studio recording, because phone audio is thin and often noisy. On a clear call with the best quality level most sentences come out right, but numbers and names need checking.',
    },
    {
      question: 'Are the two speakers labelled?',
      answer: 'No. The transcript is one stream of text with timestamps. You can add the speaker names yourself while you edit.',
    },
    {
      question: 'Is it safe to use for a confidential call?',
      answer: 'Your recording is deleted when your session ends, or when you press Delete my data now. Read the privacy page before using it for sensitive material.',
      browser: {
        answer:
          'The recording is read on your own device and never uploaded, and it is deleted after a period of inactivity or when you press Delete my data now. Read the privacy page, and check your own organisation rules before using any tool for sensitive calls.',
      },
    },
    {
      question: 'Which languages can the call be in?',
      answer: 'More than 50, from English and Spanish to Hindi and Japanese. Choose the language, or set Output to Translate to English.',
    },
  ],

  related: ['/voice-recording-to-text', '/meeting-recording-to-text', '/interview-transcription', '/private-transcription', '/m4a-to-text'],
  links: [
    {
      label: 'Meeting recording to text',
      path: '/meeting-recording-to-text',
      note: 'For Zoom, Teams and Meet recordings with several people.',
    },
    {
      label: 'Private transcription',
      path: '/private-transcription',
      note: 'What it means for a file to be transcribed on your own device.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'What to change about the recording, the language and the settings when the first result is not good enough.',
    },
  ],
};
