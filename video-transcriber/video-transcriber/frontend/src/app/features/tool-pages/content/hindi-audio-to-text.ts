import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Hindi audio to text',
  h1: 'Hindi audio to text, in Devanagari or Roman letters',
  lead: 'Add a Hindi video, audio file or voice note and read what was said as timestamped text. Choose Devanagari (हिन्दी) or Roman letters. Free, with no login.',
  dropKind: 'video',
  dropNoun: 'Hindi video or audio',

  whyTitle: 'Why turn Hindi speech into text',
  why: [
    'Hindi is spoken across northern and central India and by Indian communities around the world, and a great deal of it is recorded: lectures, news clips, interviews, family videos, voice notes and the videos creators publish. None of that can be searched or quoted until it is written down. A transcript gives you the exact words with a time on every line, so you can find a moment, copy a quotation or turn the speech into subtitles.',
    'This page starts the uploader with Hindi selected and the transcript style set to Original script, so the text comes out in Devanagari. If you want the same speech in English letters instead, change Transcript style to Hinglish (Roman Hindi), or use the Hinglish transcriber page.',
  ],

  sections: [
    {
      title: 'Devanagari or Roman letters: which one to choose',
      paragraphs: [
        'Hindi is normally written in Devanagari, the script of printed books, news sites and official forms. Choose Original script when the transcript will be read, quoted or published in Devanagari, or when you plan to proofread it with another Hindi speaker.',
        'Many people type Hindi in English letters on their phones, which is called Hinglish. Choose Hinglish (Roman Hindi) when the transcript is for chat messages, captions on social media or readers who do not read Devanagari. In that style, text that is already in English letters is left as it is.',
        'You do not have to decide before you start. Once a transcript is finished, open More on the transcript page, choose Re-transcribe, set Transcript style (and Hinglish conversion, if you like) and press Apply style only. It converts the saved recognition again without processing the audio, and lines you have edited are kept.',
      ],
    },
    {
      title: 'What Hindi speech is like for a speech recogniser',
      bullets: [
        {
          title: 'Hindi mixed with English.',
          text: 'Everyday Hindi is full of English words such as meeting, school or problem. The recogniser may write them in Devanagari (मीटिंग) or in English letters, and it can switch between the two in one video. Search and replace in the editor makes them consistent.',
        },
        {
          title: 'Hindi and Urdu.',
          text: 'Spoken Hindi and Urdu are very close. If the speaker uses many words from Persian and Arabic, as in some news, poetry and film dialogue, the speech leans towards Urdu, and choosing Urdu from the language list will write it in Urdu script, which may suit it better.',
        },
        {
          title: 'Regional accents.',
          text: 'Speakers from different regions pronounce Hindi differently, and Hindi that borrows from Punjabi, Bhojpuri, Rajasthani or other neighbouring languages can confuse any recogniser. A larger quality choice often helps with strong accents.',
        },
        {
          title: 'Sentence endings and numbers.',
          text: 'The text may end sentences with the danda (।) or with a full stop, and numbers may appear as digits, as Devanagari numerals or as words. Pick one style when you edit.',
        },
      ],
    },
    {
      title: 'Using a Hindi transcript in other programs',
      paragraphs: [
        'The TXT, SRT, VTT, Markdown and JSON files are saved as UTF-8 text, which current editors, browsers and subtitle players read correctly. If a player shows boxes or question marks instead of Devanagari, set its subtitle encoding to UTF-8 and choose a font that includes Devanagari.',
      ],
    },
  ],

  howTitle: 'How to convert Hindi audio to text',
  howToDescription:
    'Add a Hindi video or audio file, check that Hindi and your chosen script are selected, wait for the transcript and download it.',
  steps: [
    {
      title: 'Add your Hindi file',
      text: 'Drop the file in the box at the top of this page, or press Choose a file. The uploader opens with Hindi and Original script (Devanagari) already selected. You can change both before you start.',
    },
    {
      title: 'Choose the quality, then press Transcribe',
      text: 'Standard suits clear speech. For accented, noisy or fast speech pick High accuracy or Best accuracy: they are slower and usually make fewer mistakes. Then press Transcribe.',
      browser: {
        text: 'Standard suits clear speech. For accented, noisy or fast speech pick High accuracy or Best accuracy if your device offers them (a choice it cannot run is greyed out, with the reason). They are slower and usually make fewer mistakes, and each is a larger first-time download. Then press Transcribe.',
      },
    },
    {
      title: 'Wait for the text',
      text: 'Lines appear as they are recognised, each with its time. Leave Skip silence & music on if the video has songs or long pauses.',
      browser: {
        text: 'Lines appear as they are recognised, each with its time. Leave Skip silence & music on if the video has songs or long pauses. The first time, the speech model is downloaded once and kept in your browser for later.',
      },
    },
    {
      title: 'Check, edit and download',
      text: 'Read the lines marked as unsure first, correct names and English words, then download TXT, SRT, VTT, Markdown, JSON or PDF.',
    },
  ],

  formatsTitle: 'Files for Hindi transcripts',
  formatsIntro:
    'Hindi video and audio in any of these formats work. Only the sound is used, so the picture can be any quality.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'OPUS', 'MKV', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'Devanagari text for notes and documents' },
    { name: 'SRT', use: 'Hindi subtitles for a video player' },
    { name: 'VTT', use: 'Hindi subtitles for a web page' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for better Hindi transcripts',
  tips: [
    {
      title: 'Keep the language on Hindi.',
      text: 'Hindi mixed with English can be taken for English if you leave detection on. When you know the speech is Hindi, say so.',
    },
    {
      title: 'Put names in the vocabulary hint.',
      text: 'In More options, type the names of people, places, brands and technical words in the script you want. They are more likely to be spelled that way.',
    },
    {
      title: 'Redo it at a higher quality for strong accents.',
      text: 'Strong regional accents are where a Standard result slips first. On the finished transcript, open More, choose Re-transcribe and, under Quality, pick Large v3 Turbo (High accuracy) or Large v3 (Best accuracy). The first transcript is kept, so you can compare the two.',
      browser: {
        text: 'Strong regional accents are where a Standard result slips first. On the finished transcript, open More, choose Re-transcribe and, under Quality, pick Large v3 Turbo (High accuracy) or Large v3 (Best accuracy) if your device offers them. The first transcript is kept, so you can compare the two.',
      },
    },
    {
      title: 'Start with the marked lines.',
      text: 'Lines the recogniser is unsure about are marked. Listen to the audio for those lines first.',
    },
    {
      title: 'Keep film songs out.',
      text: 'Music under speech can produce invented or repeated text. Skip silence & music helps, and trimming the song out of the file helps more.',
    },
  ],

  faqs: [
    {
      question: 'Can it write Hindi in Devanagari?',
      answer:
        'Yes. With Hindi selected and Transcript style set to Original script, the text is written in Devanagari. This page starts the uploader that way.',
    },
    {
      question: 'Does it handle Hindi mixed with English?',
      answer:
        'Mostly, but expect to correct some of it. English words may come out in Devanagari or in English letters, and a wrong language guess is possible if you leave detection on. Keep the language on Hindi and check the lines marked as unsure.',
    },
    {
      question: 'How accurate is Hindi transcription compared with English?',
      answer:
        'Hindi is one of the supported languages, but recognition is often less reliable than for English, especially with background noise, strong regional accents or a lot of language mixing. A larger quality choice often helps. Treat the text as a draft and check anything important against the audio.',
    },
    {
      question: 'Can I get the Hindi speech as English text?',
      answer:
        'Yes. Open More options and set Output to Translate to English, or use the Translate speech to English page. The English comes straight from the speech and can be less exact than the Hindi text, so check it.',
    },
    {
      question: 'Do Hindi SRT and VTT files work in video players?',
      answer:
        'They are saved as UTF-8, which current players and web pages read. If you see boxes or question marks, set the subtitle encoding of the player to UTF-8 and choose a font that includes Devanagari.',
    },
  ],

  links: [
    {
      label: 'Hinglish transcriber: Hindi in Roman letters',
      path: '/hinglish-transcription',
      note: 'Get the same Hindi speech written in English letters, the way people type it in chat.',
    },
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: 'Turn Hindi speech into English text and English subtitles.',
    },
    {
      label: 'WhatsApp voice message to text',
      path: '/whatsapp-voice-message-to-text',
      note: 'Save a Hindi voice note from a chat and read it as text.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'Audio, language and model choices that reduce mistakes.',
    },
  ],
};
