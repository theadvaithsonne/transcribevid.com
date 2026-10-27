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

  sections: [
    {
      title: 'From transcript to study notes',
      paragraphs: [
        'A transcript is raw material, not finished notes. Here are four ways students use it.',
      ],
      bullets: [
        {
          title: 'Search before you revise.',
          text: 'When the transcript is finished, type a term into the Search the text box above it. The box counts the matching lines and the arrows step between them, so you can play each one from its timestamp and hear the explanation again. If a technical word was written wrongly everywhere, Replace… corrects every line at once.',
        },
        {
          title: 'Build your own outline.',
          text: 'Read the text once, add your own headings and cut it down to what you need. Putting an idea in your own words is usually a better way to learn it than copying it.',
        },
        {
          title: 'Check names, numbers and formulas.',
          text: 'Speech recognition writes what it hears. Equations, symbols and unusual terms often need correcting, so check them against the slides and the recording.',
        },
        {
          title: 'List what you did not follow.',
          text: 'Copy the timestamps of the parts that lost you into a list, and take it to your next tutorial or office hour.',
        },
      ],
    },
    {
      title: 'Technical vocabulary and other languages',
      paragraphs: [
        'Subject words are the hardest for any speech recogniser. Before you start, open More options and list the terms, the names of theories and authors, and any abbreviations in the vocabulary hint. The transcript then spells them the way you wrote them more often.',
        'If you study in a language that is not your first, a transcript gives you text to read at your own pace and to look words up in. Choose the language of the lecture, or keep Detect automatically. A lecture in another language can also be turned into English text: under More options, set Output to Translate to English. Translation is less reliable than transcribing in the original language and can miss technical terms, so check it against the recording.',
      ],
    },
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
  accepts: ['MP4', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'plain text for a notes app' },
    { name: 'Markdown', use: 'text with times, easy to restructure' },
    { name: 'PDF', use: 'a printable study copy' },
    { name: 'SRT', use: 'captions, if the lecture is a video you share' },
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
  links: [
    {
      label: 'Video to text',
      path: '/video-to-text',
      note: 'The general page for any recorded video, with every file type.',
    },
    {
      label: 'MP3 to text',
      path: '/mp3-to-text',
      note: 'For lecture recordings saved as MP3 on a phone or recorder.',
    },
    {
      label: 'Translate speech to English text',
      path: '/translate-audio-to-english',
      note: 'English text from a lecture in another language.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'The audio, language and quality choices that cut mistakes in a hard recording.',
    },
  ],
};
