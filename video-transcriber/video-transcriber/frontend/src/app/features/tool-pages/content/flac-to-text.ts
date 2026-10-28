import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'FLAC to text',
  h1: 'Convert FLAC to text',
  lead: 'FLAC is lossless audio, used for archived interviews, field recordings and studio masters. Add a FLAC file and get a timestamped transcript in more than 50 languages, free and with no login.',
  dropKind: 'audio',
  dropNoun: 'FLAC',

  whyTitle: 'FLAC keeps everything, and the transcript benefits',
  why: [
    'FLAC compresses audio to about half the size of a WAV without losing anything. It is what you get when a recorder, a studio or an archive wants to keep the full detail of a recording and still save disk space.',
    'For speech recognition that detail is useful: consonants stay crisp and quiet speakers are easier to pick out than in a heavily compressed MP3. You do not have to convert the file first. Add the FLAC as it is.',
  ],
  browserWhy: [
    'FLAC compresses audio to about half the size of a WAV without losing anything. It is what you get when a recorder, a studio or an archive wants to keep the full detail of a recording and still save disk space.',
    'For speech recognition that detail is useful: consonants stay crisp and quiet speakers are easier to pick out than in a heavily compressed MP3. You do not have to convert the file first, and it is read on your own device and never uploaded.',
  ],

  sections: [
    {
      title: 'Where FLAC recordings come from',
      paragraphs: ['A FLAC file in front of you most likely came from one of these.'],
      bullets: [
        {
          title: 'Research and oral-history archives.',
          text: 'Interview collections are often kept as FLAC because the originals cannot be recorded again. Transcribing a copy makes the collection searchable.',
        },
        {
          title: 'Field and studio recorders.',
          text: 'Some handheld recorders can record FLAC instead of WAV, to fit more hours on a card, and audio editors such as Audacity export it to save space.',
        },
        {
          title: 'Converted recordings.',
          text: 'Someone may have turned a WAV into FLAC to save space. The sound is identical, so the transcript is too.',
        },
        {
          title: 'Music-quality rips.',
          text: 'If a speech recording is part of a larger collection, such as a talk on an album or a spoken-word release, you can transcribe just that file.',
        },
      ],
    },
  ],

  howTitle: 'How to convert a FLAC file to text',
  howToDescription: 'Add the FLAC file, choose the language and quality, wait for the transcript and download TXT, SRT, VTT or PDF.',
  steps: [
    {
      title: 'Add the FLAC',
      text: 'Drop the .flac file in the box at the top of this page, or press Choose a file.',
    },
    {
      title: 'Choose the language',
      text: 'Pick the spoken language, or keep auto-detect for a recording in one language.',
    },
    {
      title: 'Pick a quality',
      text: 'A clean FLAC does well on Standard. For an archive recording with an old voice, background noise or several speakers, choose High accuracy or Best accuracy.',
    },
    {
      title: 'Edit and download',
      text: 'Fix any line, then download TXT, SRT, VTT, PDF, Markdown or JSON.',
    },
  ],

  formatsTitle: 'FLAC and other lossless audio',
  formatsIntro: 'FLAC and WAV both work, mono or stereo, at the usual sample rates and bit depths. Lossy files such as MP3 and M4A work too.',
  uploadTitle: 'Audio files you can add',
  accepts: ['FLAC', 'WAV', 'MP3', 'M4A', 'AAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'the words as plain text' },
    { name: 'SRT', use: 'timed subtitle lines' },
    { name: 'VTT', use: 'timed lines for web players' },
    { name: 'PDF', use: 'a printable copy' },
    { name: 'Markdown', use: 'notes with times' },
    { name: 'JSON', use: 'data for your own tools' },
  ],

  tipsTitle: 'Tips for FLAC recordings',
  tips: [
    {
      title: 'No need for a higher sample rate.',
      text: 'A 96 kHz FLAC does not give a better transcript than a 16 kHz one. Speech sits in the lower part of the sound, and the file is converted for the model anyway.',
    },
    {
      title: 'Archive tapes.',
      text: 'Old tape transfers hiss and hum. Keep Enhance audio on in More options; it filters rumble and evens out quiet speakers.',
    },
    {
      title: 'Long collections.',
      text: 'Add one file at a time and name each transcript after its recording. Keep Skip silence & music on so the gaps between speakers are skipped.',
    },
    {
      title: 'A CUE sheet or tags?',
      text: 'Only the sound is read. Track names and tags in the FLAC are ignored, so the transcript is the words that were spoken and nothing else.',
    },
  ],

  faqs: [
    {
      question: 'Is a FLAC more accurate than an MP3?',
      answer:
        'Slightly, on difficult audio. On clear speech the difference is small. The microphone, the room and the speaker matter much more than the file format.',
    },
    {
      question: 'Do I have to convert FLAC to MP3 or WAV first?',
      answer: 'No. FLAC is read as it is, and converting it would only add a step.',
    },
    {
      question: 'How long can a FLAC be?',
      answer: '{limits} FLAC itself puts no limit on the length; a longer recording can be split into parts first.',
      browser: {
        answer:
          'We set no limit, because the file is read on your own device. The real limit is memory: hours of audio are fine on most computers, while a phone may struggle with a very long file.',
      },
    },
    {
      question: 'Can I transcribe a FLAC in another language?',
      answer: 'Yes, in more than 50 languages, from Hindi and Tamil to Spanish and Japanese. Choose the language, or set Output to Translate to English.',
    },
    {
      question: 'Is my FLAC file kept?',
      answer: 'Only for your session. It is deleted automatically when the session ends, or when you press Delete my data now.',
      browser: {
        answer:
          'Only in this browser: the FLAC never leaves your device. It is deleted after a period of inactivity, or when you press Delete my data now.',
      },
    },
  ],

  related: ['/audio-to-text', '/wav-to-text', '/interview-transcription', '/ogg-to-text', '/research-interview-transcription'],
  links: [
    {
      label: 'WAV to text',
      path: '/wav-to-text',
      note: 'The same free transcription for uncompressed recordings.',
    },
    {
      label: 'Interview transcription',
      path: '/interview-transcription',
      note: 'Tips for turning interview recordings into a clean, quotable transcript.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'What to change about the recording, the language and the settings when the first result is not good enough.',
    },
  ],
};
