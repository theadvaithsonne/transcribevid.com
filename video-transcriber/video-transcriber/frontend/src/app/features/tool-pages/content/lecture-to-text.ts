import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Lecture to text',
  h1: 'Lecture to text: turn a recording into a searchable transcript',
  lead: 'Record the lecture, drop the file here and read it as text with timestamps: something you can search for an exam topic, copy into your notes and check against the recording. No account, no fee and more than 50 languages.',
  dropKind: 'video',
  dropNoun: 'lecture recording',

  whyTitle: 'Why transcribe a lecture',
  why: [
    'A lecture is easy to attend and hard to revise from. You cannot search a recording for the one definition you need, and replaying an hour to find it takes as long as the lecture did. A transcript gives you the words in order, with the time beside each line, so you can jump to the part you need.',
    "It also helps people who find reading easier than listening, who study in a second language, who missed a class, or who want the text of a talk they gave themselves. Ask your lecturer before you record, and follow your institution's rules on recordings.",
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

  howTitle: 'How to convert a lecture to text',
  howToDescription:
    'Add the lecture recording, set the language and technical terms, wait for the transcript and download it as notes.',
  steps: [
    {
      title: 'Add the lecture recording',
      text: 'Drag the file onto the box above, or press Choose a file. A file from a phone voice recorder, a saved lecture video or a screen recording of an online class all work, and only the sound is used. The box takes one file at a time and moves it to the uploader on the next page, where Add another file brings in the other sessions of a course.',
    },
    {
      title: 'Set the language and quality',
      text: 'On the next page, choose the language of the lecture. Standard suits a clear recording. For an echoing hall or a fast speaker, High accuracy helps if your device can run it (the choice is greyed out, with a reason, when it cannot). Expect a slower job and a larger first-time download.',
    },
    {
      title: 'Add the technical terms, then start',
      text: 'In More options, type the key terms, names and abbreviations in the vocabulary hint, for example Krebs cycle, Bayesian, Dr. Okafor. Then press Transcribe.',
    },
    {
      title: 'Read, correct and download',
      text: 'Play lines from their timestamps to check them and fix the mistakes. Then download TXT or Markdown for your notes app, or PDF to print.',
    },
  ],

  formatsTitle: 'Lecture recording files and downloads',
  formatsIntro:
    'Phone recordings, saved videos and screen recordings of classes can all be added; only the sound track is read.',
  uploadTitle: 'Recording files you can add',
  accepts: ['MP4', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'plain text for a notes app' },
    { name: 'Markdown', use: 'text with times, easy to restructure' },
    { name: 'PDF', use: 'a printable study copy' },
    { name: 'SRT', use: 'captions, if the lecture is a video you share' },
  ],

  tipsTitle: 'Tips for lecture recordings',
  tips: [
    {
      title: 'Ask permission first.',
      text: 'Some lecturers and institutions do not allow recording. Ask, and follow the rules you are given.',
    },
    {
      title: 'Record close to the speaker.',
      text: 'A recorder at the front of the room usually beats a better one at the back, because distance and echo often cost more accuracy than any setting can win back.',
    },
    {
      title: 'Split very long sessions.',
      text: 'If a session is larger or longer than the limits on this page, cut it into parts at the break before you add it.',
      browser: {
        title: 'Long sessions take longer.',
        text: 'No limit is set on length, but a long lecture keeps your device busy for a while and needs free memory, and a browser that cannot use WebCodecs may struggle with a very long file. Cutting it at the break gives you the first half to read sooner.',
      },
    },
    {
      title: 'Keep the slides open while you review.',
      text: 'Slide titles give you a ready-made outline to match against the timestamps.',
    },
    {
      title: 'Download before you leave.',
      text: 'Transcripts exist only for your session. Save TXT or Markdown before you close the page.',
    },
  ],

  faqs: [
    {
      question: 'Is it allowed to record a lecture and transcribe it?',
      answer:
        'That depends on your lecturer and your institution, so ask before you record and follow their rules. Use a transcript for your own study unless you have permission to share it. This is not legal advice.',
    },
    {
      question: 'Can I turn a lecture transcript into notes automatically?',
      answer:
        'No. TranscribeVid gives you the words, with a timestamp on every line, but it does not summarise or add headings. You build the notes from the text, which is also a good way to learn the material.',
    },
    {
      question: 'Does it work for lectures with equations or technical terms?',
      answer:
        'It writes the words it hears, so spoken terms usually come out well when you add them to the vocabulary hint. Symbols and equations are not written out as formulas, so check them against your slides.',
    },
    {
      question: 'How long a lecture can I transcribe?',
      answer: '{limits} A longer lecture needs splitting into parts first.',
      browser: {
        answer:
          'There is no cap on lecture length. Because your own device does the work, a long lecture mostly costs patience and free memory, and the page warns you when your device looks too slow for it.',
      },
    },
    {
      question: 'Can I transcribe an online class I recorded on my screen?',
      answer:
        'Yes. A screen recording saved as MP4, MOV or WebM works. Only the sound is read, so text on the slides is not included. Add the slide terms to the vocabulary hint.',
    },
  ],

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
