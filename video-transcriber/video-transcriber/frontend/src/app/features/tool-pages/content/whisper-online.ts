import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Whisper online',
  h1: 'Whisper online, free and without installing anything',
  lead: "Use OpenAI's Whisper speech recognition from a web page: add an audio or video file and get a timestamped transcript in more than 50 languages. No Python, no command line, no API key, no login.",
  browserLead:
    "Use OpenAI's Whisper speech recognition from a web page: add an audio or video file and Whisper runs on your own device, in the browser, to give you a timestamped transcript in more than 50 languages. No Python, no API key, no login.",
  dropKind: 'video',
  dropNoun: 'audio or video file',

  whyTitle: 'What you get from Whisper online',
  why: [
    'Whisper is an open speech-recognition model released by OpenAI. It was trained on a very large amount of multilingual audio, which is why it copes with accents, background noise and about 99 languages better than most older tools. Normally you would have to install it, or pay for an API, to use it.',
    'This page puts it behind a drop box. It is an independent site and not an OpenAI product. The model, the settings and the editor are all here: add a file, choose a quality level, then edit the transcript and download TXT, SRT, VTT or PDF.',
  ],
  browserWhy: [
    'Whisper is an open speech-recognition model released by OpenAI. It was trained on a very large amount of multilingual audio, which is why it copes with accents, background noise and about 99 languages better than most older tools. Normally you would have to install it, or pay for an API, to use it.',
    'Here the model is downloaded to your browser the first time and then does the work on your own device, with the graphics chip when the browser allows it. Your file is never uploaded. This is an independent site and not an OpenAI product.',
  ],

  sections: [
    {
      title: 'The four quality levels and the Whisper models behind them',
      paragraphs: [
        'Whisper comes in sizes. A bigger model makes fewer mistakes and needs more time and memory. The quality levels pick the size for you, so you do not have to know the names.',
      ],
      bullets: [
        {
          title: 'Fastest.',
          text: 'The Base model, the smallest of the four levels. A quick draft for clear speech.',
        },
        {
          title: 'Standard.',
          text: 'A good balance for clear speech in widely spoken languages.',
        },
        {
          title: 'High accuracy.',
          text: 'Large v3 Turbo, a large model tuned for speed. A good choice for accents and noisy rooms.',
        },
        {
          title: 'Best accuracy.',
          text: 'The largest model. The slowest, with the fewest mistakes, and the best choice for a transcript you will publish.',
        },
      ],
    },
    {
      title: 'Where Whisper is weaker, and what we do about it',
      paragraphs: [
        'Whisper can invent words when it is given silence or music, and it is less accurate in languages it saw little of during training. Skip silence & music, on by default in More options, removes the quiet parts before the model hears them. For a language such as Hindi, choose High accuracy or Best accuracy: the smaller levels make many more mistakes there.',
      ],
      browser: {
        paragraphs: [
          'Whisper can invent words when it is given silence or music, and it is less accurate in languages it saw little of during training. Skip silence & music, on by default in More options, removes the quiet parts before the model hears them. For a language such as Hindi, choose High accuracy or Best accuracy if your device can run them (they need a computer with a graphics-capable browser): the smaller levels make many more mistakes there.',
        ],
      },
    },
  ],

  howTitle: 'How to use Whisper online',
  howToDescription: 'Add a file, choose the language and a quality level, wait for the transcript, then edit and download it.',
  steps: [
    {
      title: 'Add a file',
      text: 'Drop an audio or video file in the box at the top of this page, or press Choose a file. MP3, WAV, M4A, MP4 and many more work.',
    },
    {
      title: 'Choose the language',
      text: 'Pick the spoken language for the best result, or keep auto-detect. Set Output to Translate to English to get English text from speech in another language; use Standard or Best accuracy for that, as High accuracy was not trained to translate.',
    },
    {
      title: 'Pick a quality level',
      text: 'Fastest to Best accuracy, from the small Base model to the largest, Large v3. The larger the model, the longer it takes.',
      browser: {
        text: 'Fastest to Best accuracy, from the small Base model to the largest, Large v3. The first time you use a level, your browser downloads that model, and later visits reuse it.',
      },
    },
    {
      title: 'Edit and download',
      text: 'Fix any line, then download TXT, SRT, VTT, PDF, Markdown or JSON, including word times for your own tools.',
    },
  ],

  formatsTitle: 'What Whisper online accepts and produces',
  formatsIntro: 'Audio and video files go in. The transcript comes out as text, as subtitle files or as data with a time for every word.',
  uploadTitle: 'Files you can add',
  accepts: ['MP3', 'WAV', 'M4A', 'FLAC', 'OGG', 'OPUS', 'MP4', 'MOV', 'WEBM', 'MKV'],
  downloads: [
    { name: 'TXT', use: 'the words as plain text' },
    { name: 'SRT', use: 'subtitles for video editors and players' },
    { name: 'VTT', use: 'subtitles for web video' },
    { name: 'PDF', use: 'a printable copy' },
    { name: 'Markdown', use: 'notes with timestamps' },
    { name: 'JSON', use: 'words with start and end times' },
  ],

  tipsTitle: 'Tips for using Whisper well',
  tips: [
    {
      title: 'Name the language.',
      text: 'Auto-detect decides from the first seconds. For a recording that starts with music, or one that mixes languages, choose the language yourself.',
    },
    {
      title: 'Give it the hard words.',
      text: 'Names, brands and jargon go in the vocabulary hint under More options. Whisper then prefers those spellings.',
    },
    {
      title: 'Start with Fastest.',
      text: 'On a long file, run Fastest first to check that the audio is what you expect, then run the level you want.',
      browser: {
        text: 'On a long file, run Fastest first to check that the audio is what you expect, then run the level you want. Fastest is also the one to use on a phone.',
      },
    },
    {
      title: 'Keep word timing on for captions.',
      text: 'Word-level timing makes each subtitle line start and end with its words instead of drifting.',
    },
  ],

  faqs: [
    {
      question: 'Is this the official OpenAI Whisper?',
      answer:
        'It uses the open Whisper models that OpenAI released, but it is an independent site and not made by OpenAI. Nothing here needs an OpenAI account or an API key.',
    },
    {
      question: 'Which Whisper model is used?',
      answer:
        'It depends on the quality level you choose, from the Base model for Fastest to Large v3 for Best accuracy. You choose the level and the site chooses the model; if you know the sizes, the Model list under More options lets you pick one directly, including Tiny and Medium.',
    },
    {
      question: 'Is Whisper online really free?',
      answer: 'Yes. There is no account, no daily limit and no paid tier on this page.',
      browser: {
        answer: 'Yes. There is no account, no limit and no paid tier on this page. The site is paid for by a few ads on its text pages, never beside your transcript.',
      },
    },
    {
      question: 'Does Whisper online work in languages other than English?',
      answer:
        'Yes, in more than 50 languages with usable results, from Spanish, French and German to Hindi, Arabic and Japanese. Accuracy is highest in the languages Whisper saw most, and lower in the rarer ones.',
    },
    {
      question: 'Where does the transcription run?',
      answer: 'On our server, which reads your file, runs Whisper and returns the transcript.',
      browser: {
        answer:
          'In your browser, on your own device. Only the Whisper model is downloaded; your file stays where it is. That is also why a recent laptop is quick and an old phone is slow.',
      },
    },
  ],

  related: ['/speech-to-text', '/audio-to-text', '/video-to-text', '/private-transcription', '/hindi-audio-to-text'],
  links: [
    {
      label: 'What is Whisper?',
      path: '/guides/what-is-whisper',
      note: 'A plain explanation of the model, its sizes and its strengths and weaknesses.',
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
