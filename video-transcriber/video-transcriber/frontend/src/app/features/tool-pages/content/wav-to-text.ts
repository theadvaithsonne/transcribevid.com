import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WAV to text',
  h1: 'Convert WAV to text',
  lead: 'WAV is the uncompressed audio that recorders, studios and dictation devices save. Add a WAV file and get a timestamped transcript in more than 50 languages, free and with no login.',
  dropKind: 'audio',
  dropNoun: 'WAV',

  whyTitle: 'Why WAV gives good transcripts',
  why: [
    'WAV keeps every detail of the recording, with no compression. That suits speech recognition: consonants stay crisp, and quiet speakers are easier to pick out than in a heavily compressed file.',
    'The catch is size. One hour of CD-quality stereo WAV is about 635 MB, which can be more than the size limit here. A mono recording at 16 kHz is far smaller, about 115 MB an hour, and keeps everything the model needs.',
  ],
  browserWhy: [
    'WAV keeps every detail of the recording, with no compression. That suits speech recognition: consonants stay crisp, and quiet speakers are easier to pick out than in a heavily compressed file.',
    'The catch is size. One hour of CD-quality stereo WAV is about 635 MB. Here that matters less: the file is read in your browser and never uploaded, so there is no upload to wait for. Very long files need enough free memory on your device.',
  ],

  howTitle: 'How to convert a WAV file to text',
  howToDescription: 'Add the WAV file, choose the language and quality, wait for the transcript and download TXT, SRT, VTT or PDF.',
  steps: [
    {
      title: 'Add the WAV',
      text: 'Drop the .wav in the box at the top of this page, or press Choose a file.',
    },
    {
      title: 'Choose the language',
      text: 'Pick the spoken language, or keep auto-detect for a recording in one language.',
    },
    {
      title: 'Pick a quality',
      text: 'Clean studio WAVs do well even on Standard. For field recordings with noise or several speakers, choose High accuracy or Best accuracy.',
    },
    {
      title: 'Edit and download',
      text: 'Fix any line, then download TXT, SRT, VTT, PDF, Markdown or JSON.',
    },
  ],

  formatsTitle: 'WAV and other lossless audio',
  formatsIntro: 'Ordinary PCM WAV files work, mono or stereo. FLAC is the same quality in about half the size, and works too.',
  uploadTitle: 'Audio files you can add',
  accepts: ['WAV', 'FLAC', 'MP3', 'M4A', 'AAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'the recording as text, with or without times' },
    { name: 'SRT', use: 'subtitles, if the audio belongs to a video' },
    { name: 'VTT', use: 'a text track for web players' },
    { name: 'PDF', use: 'a transcript to print or file' },
    { name: 'Markdown', use: 'notes with timestamps' },
    { name: 'JSON', use: 'segments and word times for programs' },
  ],

  tipsTitle: 'Tips for WAV recordings',
  tips: [
    {
      title: 'Too big for the limit?',
      text: 'Save a copy as FLAC (lossless, about half the size) or as a mono 16 kHz WAV. Both give the same transcript.',
      browser: {
        title: 'Very big files.',
        text: 'There is no size limit here, but a WAV of several hours needs a lot of memory. A mono 16 kHz copy is far smaller and gives the same transcript.',
      },
    },
    {
      title: 'One voice per channel?',
      text: 'If each person was recorded on their own channel, the channels are mixed into one before transcription. Speaker labels are not added.',
    },
    {
      title: 'Skip the silences.',
      text: 'Keep Skip silence & music on in More options, so long pauses at the start and end are skipped instead of turned into made-up words.',
    },
    {
      title: 'Even out quiet speakers.',
      text: 'Enhance audio evens out quiet voices and filters rumble. Leave it on unless the recording is already studio-clean.',
    },
    {
      title: 'Dictation recorders.',
      text: 'Many dictation devices save WAV. You do not need to say "comma" or "full stop": the model adds punctuation itself.',
    },
  ],

  faqs: [
    {
      question: 'Is a WAV more accurate than an MP3?',
      answer:
        'A little, on difficult audio. On clear speech the difference is small. The recording itself, the microphone and the room matter much more than the file format.',
    },
    {
      question: 'What is the largest WAV I can use?',
      answer: '{limits} An hour of CD-quality stereo WAV is about 635 MB, so a long WAV may need converting to FLAC or MP3 first.',
      browser: {
        answer:
          'We set no size limit, because the WAV is read on your own device. The real limit is memory: long files are fine on most computers, but a phone may run out of memory on a very long one.',
      },
    },
    {
      question: 'Do I need to convert a WAV before transcribing it?',
      answer: 'No. Add the WAV as it is. Converting only helps when the file is larger than the size limit.',
      browser: {
        answer: 'No. Add the WAV as it is. Converting only helps when a very long file is too big for the memory of your device.',
      },
    },
    {
      question: 'Can I transcribe a WAV in another language?',
      answer:
        'Yes, in more than 50 languages, from Hindi and Tamil to Spanish and Japanese. Choose the language for the best result, or set Output to Translate to English to get English text.',
    },
    {
      question: 'Is my WAV file kept?',
      answer: 'Only for your session. It is deleted automatically when the session ends, or when you press Delete my data now.',
      browser: {
        answer:
          'Only in this browser: the WAV never leaves your device. It is deleted after a period of inactivity, or when you press Delete my data now.',
      },
    },
  ],

  related: ['/audio-to-text', '/mp3-to-text', '/m4a-to-text', '/interview-transcription', '/podcast-to-text'],
};
