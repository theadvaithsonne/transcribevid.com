import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Lecture to text',
  h1: 'Lecture to text: transcribe a class recording',
  lead: 'Turn a recorded lecture, seminar or online class into text you can search, highlight and revise from. Long recordings are fine, more than 50 languages work, including Hindi, and it is free with no login.',
  dropKind: 'video',
  dropNoun: 'lecture recording',

  whyTitle: 'Revise from text, not from replays',
  why: [
    'A one-hour lecture takes an hour to replay and a few minutes to read. With a transcript you can search for the term the teacher defined, copy the exact wording of a key point, and jump to the timestamp when you want to hear the explanation again.',
    'It also helps students who are hard of hearing, who study in a second language or who missed the class. In many Indian classrooms lectures mix Hindi and English; Hinglish style keeps both readable in one script.',
  ],

  howTitle: 'How to transcribe a lecture',
  howToDescription: 'Add the lecture recording, choose the language and a quality level, wait for the transcript and download it as Markdown notes or PDF.',
  steps: [
    {
      title: 'Get the recording',
      text: 'Download the class video from your course portal, Google Classroom, Moodle or Teams, or use a recording from your phone. Use only recordings you are allowed to keep.',
    },
    {
      title: 'Add it here',
      text: 'Drop the file in the box at the top of this page. For a long video, an audio-only copy (M4A or MP3) is smaller and gives the same text.',
    },
    {
      title: 'Choose language and quality',
      text: 'Pick the language of the lecture. Standard suits most clear lectures; High accuracy helps with technical terms and strong accents.',
      browser: {
        text: 'Pick the language of the lecture. On a laptop, Standard suits most clear lectures and High accuracy helps with technical terms. On a phone, Fastest is the safer choice for a long file.',
      },
    },
    {
      title: 'Download your notes',
      text: 'Download Markdown for notes with a timestamp at each paragraph, ready for Obsidian, Notion or any notes app, or PDF to print.',
    },
  ],

  formatsTitle: 'Lecture files and note formats',
  formatsIntro: 'Recorded lectures are usually MP4 from a video platform or M4A from a phone. Both work.',
  uploadTitle: 'Lecture files you can add',
  accepts: ['MP4', 'MKV', 'WEBM', 'MOV', 'M4A', 'MP3', 'WAV', 'AAC'],
  downloads: [
    { name: 'Markdown', use: 'study notes with a timestamp per paragraph' },
    { name: 'PDF', use: 'a printable handout' },
    { name: 'TXT', use: 'plain text to paste into your own notes' },
    { name: 'SRT', use: 'captions for the lecture video' },
    { name: 'VTT', use: 'captions for a web player' },
    { name: 'JSON', use: 'word times for programs' },
  ],

  tipsTitle: 'Tips for lecture transcripts',
  tips: [
    {
      title: "Add the subject's terms.",
      text: "Put technical terms and the lecturer's name in the vocabulary hint under More options, for example: eigenvalue, Kirchhoff, Dr. Iyer.",
    },
    {
      title: 'Sit near the speaker.',
      text: 'If you record it yourself, put the phone near the lecturer, not at the back of the hall. Room echo costs more accuracy than anything else.',
    },
    {
      title: 'Long recordings.',
      text: 'If the lecture is longer than the length limit, split it into parts in an audio editor and transcribe each part.',
      browser: {
        text: 'A two-hour lecture is fine, but it takes a while on a slower device. Keep the tab open and the laptop on charge, and read the first lines while the rest is transcribed.',
      },
    },
    {
      title: 'Ask before recording.',
      text: "Many colleges allow recording only with the lecturer's permission. Check your institution's rules.",
    },
    {
      title: 'English notes from any language.',
      text: 'For a lecture in Hindi, Tamil or another language, set Output to Translate to English in More options to get English notes.',
    },
  ],

  faqs: [
    {
      question: 'Can it transcribe a two-hour lecture?',
      answer: '{limits} Split longer recordings into parts first. There is no limit on how many parts or lectures you transcribe.',
      browser: {
        answer:
          'Yes. We set no length limit. The lecture is transcribed on your own device, so a long one takes longer, and the page warns you on a slower device. Fastest is the quickest choice for very long files.',
      },
    },
    {
      question: 'Does it work with a Hindi-medium or Hinglish lecture?',
      answer:
        'Yes. Choose Hindi, then Original script for Devanagari or Hinglish for Roman letters. In Hinglish, technical English words stay in English.',
    },
    {
      question: 'Can I turn the transcript into notes?',
      answer:
        'Markdown gives you clean paragraphs with timestamps that open in any notes app; add your own headings and highlights there. The tool does not write summaries.',
    },
    {
      question: 'Are formulas and slides included?',
      answer: 'No. Only speech is transcribed. Anything written on the board or shown on slides is in the text only if the lecturer says it aloud.',
    },
    {
      question: 'Can I make captions for a recorded class?',
      answer: 'Yes. Download SRT or VTT and add it to the video on your course platform, or upload it with the video on YouTube.',
    },
  ],

  related: ['/video-to-text', '/mp4-to-text', '/translate-hindi-audio-to-english', '/podcast-to-text', '/hindi-audio-to-text'],
};
