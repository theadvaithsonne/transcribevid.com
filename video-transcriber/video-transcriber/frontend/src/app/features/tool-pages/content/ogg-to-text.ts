import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'OGG to text',
  h1: 'Convert OGG and Opus audio to text',
  lead: 'OGG files, and the Opus audio that most voice notes and online calls use, can be turned into text here. Add the file and get a timestamped transcript in more than 50 languages, free and with no login.',
  dropKind: 'audio',
  dropNoun: 'OGG or Opus file',

  whyTitle: 'What OGG and Opus files are',
  why: [
    'OGG is a container, and Opus and Vorbis are the audio formats usually found inside it. Opus was built for speech: it keeps voices clear at very small file sizes, which is why it is used for voice notes and internet calls, and why you meet it as a file with the extension .opus or .ogg.',
    'Many tools and websites do not accept these files, so people end up searching for a converter. You do not need one. Add the OGG or Opus file as it is, and the words come back with timestamps that you can edit and download.',
  ],
  browserWhy: [
    'OGG is a container, and Opus and Vorbis are the audio formats usually found inside it. Opus was built for speech: it keeps voices clear at very small file sizes, which is why it is used for voice notes and internet calls, and why you meet it as a file with the extension .opus or .ogg.',
    'Many tools and websites do not accept these files, so people end up searching for a converter. You do not need one. Add the OGG or Opus file as it is: it is read on your own device and never uploaded, and the words come back with timestamps that you can edit and download.',
  ],

  sections: [
    {
      title: 'Where OGG and Opus files come from',
      paragraphs: ['If you have one, it most likely came from one of these.'],
      bullets: [
        {
          title: 'Messaging voice notes.',
          text: 'WhatsApp voice notes are Opus audio, saved as .opus files, and some other chat apps save .ogg. The WhatsApp voice note page explains how to save one from your phone.',
        },
        {
          title: 'Game and call recordings.',
          text: 'Voice-chat programs and some call recorders save Opus because it keeps speech small and clear.',
        },
        {
          title: 'Linux and open-source tools.',
          text: 'Recorders on Linux, and exports from open-source editors, often use OGG Vorbis or Opus by default.',
        },
        {
          title: 'Web downloads.',
          text: 'Podcasts and talks offered as .ogg downloads are common on open-source and community sites.',
        },
      ],
    },
  ],

  howTitle: 'How to convert an OGG or Opus file to text',
  howToDescription: 'Add the OGG or Opus file, choose the language and quality, wait for the transcript and download TXT, SRT, VTT or PDF.',
  steps: [
    {
      title: 'Add the file',
      text: 'Drop the .ogg or .opus file in the box at the top of this page, or press Choose a file.',
    },
    {
      title: 'Choose the language',
      text: 'Pick the spoken language, or keep auto-detect. Voice notes are short, so naming the language gives auto-detect less to guess.',
    },
    {
      title: 'Pick a quality',
      text: 'Standard is enough for a clear voice note. For a noisy call or a strong accent, choose High accuracy or Best accuracy.',
    },
    {
      title: 'Edit and download',
      text: 'Fix any line, then download TXT, SRT, VTT, PDF, Markdown or JSON.',
    },
  ],

  formatsTitle: 'OGG, Opus and the formats like them',
  formatsIntro: 'OGG with Vorbis, OGG with Opus and plain .opus files all work. So do MP3, M4A, WAV and FLAC.',
  uploadTitle: 'Audio files you can add',
  accepts: ['OGG', 'OPUS', 'MP3', 'M4A', 'AAC', 'WAV', 'FLAC', '3GP'],
  downloads: [
    { name: 'TXT', use: 'the words as plain text' },
    { name: 'SRT', use: 'timed subtitle lines' },
    { name: 'VTT', use: 'timed lines for web players' },
    { name: 'PDF', use: 'a printable copy' },
    { name: 'Markdown', use: 'notes with times' },
    { name: 'JSON', use: 'data for your own tools' },
  ],

  tipsTitle: 'Tips for OGG and Opus files',
  tips: [
    {
      title: 'Short clips.',
      text: 'A voice note of a few seconds has little for the model to go on. Choose the language yourself, and add names to the vocabulary hint under More options.',
    },
    {
      title: 'Low bit rate.',
      text: 'Voice notes are compressed hard. If one sounds thin or watery, choose High accuracy or Best accuracy; they cope with it better.',
    },
    {
      title: 'Several notes in a row.',
      text: 'The box at the top takes one file, but on the next page you can add several notes together, and each becomes its own transcript. For a long chat, transcribe the notes that matter and copy the text into one document.',
    },
    {
      title: 'Wrong extension.',
      text: 'Some apps save Opus audio with an .ogg name, and some save it with no extension at all. If a file will not open, rename it to end in .opus or .ogg and add it again.',
    },
  ],

  faqs: [
    {
      question: 'Do I need to convert OGG or Opus to MP3 first?',
      answer: 'No. Add the file as it is. Converting an Opus file to MP3 only loses a little quality for no gain.',
    },
    {
      question: 'Is a WhatsApp voice note an OGG file?',
      answer: 'It is Opus audio, saved as a file ending in .opus. It is closely related to OGG, and it works here the same way.',
    },
    {
      question: 'Are OGG and Opus the same thing?',
      answer: 'Not quite. OGG is the container, and Opus is one of the audio formats that can sit inside it. Both work here, along with OGG Vorbis.',
    },
    {
      question: 'Which languages work for a voice note or an OGG file?',
      answer: 'More than 50, from English and Spanish to Hindi and Japanese. Choose the language, or set Output to Translate to English.',
    },
    {
      question: 'Is my OGG file kept?',
      answer: 'Only for your session. It is deleted automatically when the session ends, or when you press Delete my data now.',
      browser: {
        answer:
          'Only in this browser: the file never leaves your device. It is deleted after a period of inactivity, or when you press Delete my data now.',
      },
    },
  ],

  related: ['/audio-to-text', '/whatsapp-voice-note-to-text', '/whatsapp-voice-message-to-text', '/flac-to-text', '/m4a-to-text', '/voice-recording-to-text'],
  links: [
    {
      label: 'WhatsApp voice note to text',
      path: '/whatsapp-voice-note-to-text',
      note: 'How to save a voice note from your phone and turn it into text.',
    },
    {
      label: 'FLAC to text',
      path: '/flac-to-text',
      note: 'The same free transcription for lossless audio.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'What to change about the recording, the language and the settings when the first result is not good enough.',
    },
  ],
};
