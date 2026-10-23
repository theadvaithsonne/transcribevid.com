import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP3 to text',
  h1: 'Convert MP3 to text online',
  lead: 'From podcast episodes to lecture recordings and voice messages, MP3 is the audio format most of us have piles of. Upload an MP3 and get a timestamped transcript for free, with no login.',
  dropKind: 'audio',
  dropNoun: 'MP3',

  whyTitle: 'What an MP3 transcript gives you',
  why: [
    'MP3 squeezes audio into a small file, which is why podcasts, voice recorders and downloaded lectures use it. That helps here too: an MP3 uploads quickly even on a slow connection, and a one-hour MP3 at 128 kbps is only about 58 MB.',
    'A transcript lets you search a long episode for one phrase, quote an interviewee exactly, write show notes without replaying the show, or keep a written record of a talk or voice message.',
  ],

  howTitle: 'How to convert an MP3 to text',
  howToDescription: 'Upload the MP3, choose the spoken language, wait for the transcript and download it as text or subtitles.',
  steps: [
    {
      title: 'Pick your MP3',
      text: 'Drop the .mp3 in the box at the top of this page, or press Choose a file. In the uploader you can add more than one, and each becomes its own transcript.',
    },
    {
      title: 'Choose the language',
      text: 'Select the spoken language or keep auto-detect. To get English text from another language, open More options and set Output to Translate to English.',
    },
    {
      title: 'Wait for the transcript',
      text: 'Text appears while the file is processed, with a progress bar. Fastest is quick, Best accuracy takes longest and makes the fewest mistakes.',
    },
    {
      title: 'Fix and download',
      text: 'Correct any line, then download TXT to read, or SRT and VTT if the audio belongs with a video or web player.',
    },
  ],

  formatsTitle: 'MP3 and other audio formats',
  formatsIntro: 'MP3 is the most common audio upload. These other audio formats work the same way, and video files are accepted too.',
  uploadTitle: 'Audio files you can upload',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'the episode or talk as plain text' },
    { name: 'Markdown', use: 'show notes with timestamps' },
    { name: 'SRT', use: 'captions for a video version' },
    { name: 'VTT', use: 'a transcript track for web players' },
    { name: 'PDF', use: 'a transcript to print or send' },
    { name: 'JSON', use: 'structured lines for programs' },
  ],

  tipsTitle: 'Tips for transcribing MP3 files',
  tips: [
    {
      title: 'Upload the best copy.',
      text: 'MP3 is lossy and every re-save loses a little more detail. If you still have the WAV or the original recording, upload that instead.',
    },
    {
      title: 'Avoid very low bitrates.',
      text: 'Speech survives compression well, but very low bitrates blur consonants and lower accuracy.',
    },
    {
      title: 'Split long episodes.',
      text: 'A file over the length limit is refused. Cut a two-hour episode into parts in any audio editor first.',
    },
    {
      title: 'Handle intros and music.',
      text: 'Keep Skip silence & music switched on in More options, so jingles and long pauses do not produce made-up words.',
    },
    {
      title: 'Spell out the guests.',
      text: 'Put the host, guests, show name and brands in the vocabulary hint once, and they are far more likely to come out right.',
    },
  ],

  faqs: [
    {
      question: 'How long can an MP3 be?',
      answer:
        '{limits} A 60-minute MP3 at 128 kbps is about 58 MB, so the length limit matters more than the size limit. There is no daily or monthly quota.',
    },
    {
      question: 'Does MP3 compression hurt accuracy?',
      answer:
        'Not much at normal quality, because speech is the easy case for MP3. Noise, echo and overlapping voices hurt far more than the format, so prefer a clean original when you have one.',
    },
    {
      question: 'Can I transcribe several MP3 files at once?',
      answer:
        'Yes. Add them together and each becomes its own transcript in your session, which you can open and download separately.',
    },
    {
      question: 'Can I translate an MP3 into English?',
      answer:
        'Yes. In More options set Output to Translate to English. Translation is automatic, so read the English text before you use it. Other target languages are not offered.',
    },
    {
      question: 'Is my MP3 kept?',
      answer:
        'Only for your session. It is deleted automatically when the session ends, or when you press Delete my data now. No account is needed.',
    },
  ],
};
