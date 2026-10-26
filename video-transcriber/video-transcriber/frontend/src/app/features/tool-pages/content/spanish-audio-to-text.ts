import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Spanish audio to text',
  h1: 'Spanish audio and video to text, free and with timestamps',
  lead: 'Turn a Spanish recording into text, with its accents, the ñ and the opening marks ¿ and ¡, and a time on every line. It works for speech from Spain, Mexico, Argentina and everywhere in between. Free, with no login.',
  dropKind: 'video',
  dropNoun: 'Spanish video or audio',

  whyTitle: 'Spanish is spoken in many ways',
  why: [
    'Spanish is the first language of people across Spain, Mexico, Central and South America and the Caribbean, and many people speak it in the United States too. A lecture from Salamanca, a podcast from Bogotá and a family video from Buenos Aires can sound quite different, yet the transcript should read as correct Spanish. This page starts the uploader with Spanish selected, so the recogniser does not have to guess the language.',
    'The recordings people bring to a Spanish transcriber are very varied. Some are planned and well recorded: a class, a conference, an interview for a thesis, an episode of a podcast. Others are casual: a nota de voz sent through a chat app, a phone call, a family video. A transcript turns any of them into searchable text with a time on every line, and into SRT or VTT subtítulos you can add to a video.',
  ],

  sections: [
    {
      title: 'Accents and varieties of Spanish',
      bullets: [
        {
          title: 'Spain.',
          text: 'Standard Castilian Spanish, with the th-like z and c and the vosotros form, is common in broadcasts and lectures. Andalusian and Canarian speech soften or drop some consonants, which can make words harder to catch.',
        },
        {
          title: 'Mexico and Central America.',
          text: 'Mexican Spanish includes local words such as chamba and órale, and plenty of English borrowings in business and technology. Words like these are common spots for mistakes.',
        },
        {
          title: 'The Caribbean.',
          text: 'Cuban, Dominican and Puerto Rican speech, and the speech of coastal Colombia and Venezuela, often drops or softens the final s and runs words together. Expect to check these recordings more carefully.',
        },
        {
          title: 'Río de la Plata and the Andes.',
          text: 'In Argentina and Uruguay vos replaces tú, with forms such as “vos tenés”, and ll and y are pronounced like sh or zh. Andean Spanish can borrow words from Quechua or Aymara. All of it is Spanish, so keep the language on Spanish.',
        },
      ],
    },
    {
      title: 'Notas de voz and everyday speech',
      paragraphs: [
        'A nota de voz is usually short, quick and relaxed. Speakers drop word endings, run words together and lean on fillers such as “o sea”, “pues”, “este” (very common in Mexico) or “che” (Argentina), and on local slang such as tío in Spain, güey in Mexico, parce in Colombia or pana in Venezuela.',
        'The recogniser may write shortened forms like “pa’” for para or “ta’” for está in some lines and the standard words in others. Decide how formal your written text should be, then use search and replace in the editor to make it consistent.',
      ],
    },
    {
      title: 'Spanish writing details to check',
      paragraphs: [
        'Spanish uses written accents (café, está, qué), the tilde on ñ and the opening marks ¿ and ¡. The recogniser usually writes them, but check the short words where an accent changes the meaning: si and sí, el and él, mas and más, tu and tú.',
        'Spain and much of Latin America write decimals with a comma and group thousands with a full stop, while Mexico and several other countries use the English style. The recogniser may follow either, so make the numbers consistent when you edit.',
      ],
    },
    {
      title: 'Catalan, Galician, Basque and Spanglish',
      paragraphs: [
        'In Spain, Catalan and Galician are spoken alongside Spanish. Both are in the language list, so choose them for speech in those languages. Basque is not on the list.',
        'For Spanish with English phrases mixed in, as often heard in the United States, keep the language on Spanish and check the English parts, which may be spelled the Spanish way.',
      ],
    },
  ],

  howTitle: 'How to convert Spanish audio to text',
  howToDescription:
    'Add a Spanish recording, let the uploader open with Spanish chosen, wait for the lines to appear and download the text or the subtítulos.',
  steps: [
    {
      title: 'Add your recording',
      text: 'Put the file in the box at the top of this page, or press Choose a file. You then land on the uploader with Spanish already chosen under Language, so there is nothing to guess. Pick another language there if the recording is not in Spanish.',
    },
    {
      title: 'Choose the quality, then press Transcribe',
      text: 'Standard handles a clear voice. Fast regional speech or a noisy recording is better served by High accuracy or Best accuracy, which take longer and usually make fewer mistakes. Then press Transcribe.',
      browser: {
        text: 'Standard handles a clear voice. Fast regional speech or a noisy recording is better served by High accuracy or Best accuracy if your device offers them (a choice it cannot run is greyed out, with the reason). They take longer, usually make fewer mistakes and are larger first-time downloads. Then press Transcribe.',
      },
    },
    {
      title: 'Wait for the text',
      text: 'Lines appear with their times. Enhance audio is on by default: it filters hiss and rumble and evens out quiet speakers.',
      browser: {
        text: 'Lines appear with their times. Enhance audio is on by default: it filters hiss and rumble and evens out quiet speakers. The first time, your browser also downloads the speech model once, so it can take a little longer.',
      },
    },
    {
      title: 'Fix and download',
      text: 'Go straight to the lines marked as unsure, put right the names and accents, then download the format you need: TXT, SRT, VTT, Markdown, JSON or PDF.',
    },
  ],

  formatsTitle: 'Files and downloads for Spanish transcripts',
  formatsIntro:
    'Only the sound track is read, so a phone video, a screen recording and a studio file are treated alike. The accents, ñ and ¿ ¡ are kept in the text you download.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'OGG', 'OPUS', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'Spanish text for notes, essays and documents' },
    { name: 'SRT', use: 'subtítulos for players and editors' },
    { name: 'VTT', use: 'subtítulos for web video' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for better Spanish transcripts',
  tips: [
    {
      title: 'Choose the right language.',
      text: 'Keep Spanish for Spanish, and choose Catalan or Galician when that is what is spoken.',
    },
    {
      title: 'Type the names you expect into the vocabulary hint.',
      text: 'Under More options, the Vocabulary hint takes surnames, towns and brands as you want them written, for example Oaxaca, Ibáñez or Mercadona.',
    },
    {
      title: 'Replay the numbers.',
      text: 'Prices, dates and phone numbers are where one wrong digit costs most. Play those lines again, and settle on one way of writing decimals and thousands.',
    },
    {
      title: 'Proofread the accents last.',
      text: 'Fix the words first, then read through once for accents and ¿ ¡ marks. A missing accent rarely changes the meaning, but it shows.',
    },
  ],

  faqs: [
    {
      question: 'Does Spanish audio to text keep the accents and the ñ?',
      answer:
        'Yes. The text keeps the written accents, the ñ, the ü and the opening marks ¿ and ¡ where the recogniser writes them. Check short words where an accent changes the meaning, such as si and sí.',
    },
    {
      question: 'Does it understand Latin American Spanish as well as Spanish from Spain?',
      answer:
        'Both are Spanish and both use the same Spanish setting. The accents differ, and fast or strongly regional speech is harder for any recogniser. If the result is rough, try a larger quality choice and add local names to the vocabulary hint.',
    },
    {
      question: 'Can I transcribe Catalan, Galician or Basque here?',
      answer:
        'Catalan and Galician are in the language list, so choose them instead of Spanish. Basque is not on the list.',
    },
    {
      question: 'How long a Spanish lecture or meeting can I transcribe?',
      answer:
        '{limits} A longer recording is refused before it is processed, so cut a long class or meeting into parts first. Nothing is capped per day or per month.',
      browser: {
        answer:
          'The site sets no size or length limit, so a two-hour lecture is accepted. It does take time and free memory on your own device, and a browser without WebCodecs may refuse a very long file; if that happens, split the recording at a natural break. Nothing is capped per day or per month.',
      },
    },
    {
      question: 'Can I get subtítulos in the Spanish of my own audience?',
      answer:
        'The text keeps the words that were spoken, so a Mexican speaker’s carro stays carro even if viewers in Spain would say coche. Whether to change the vocabulary is an editing decision: search and replace makes it quick, and then you can download SRT or VTT.',
    },
  ],

  links: [
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: 'Read a Spanish talk in English, as text or as subtitles.',
    },
    {
      label: 'WhatsApp voice message to text',
      path: '/whatsapp-voice-message-to-text',
      note: 'Save a nota de voz from a chat and read it as text.',
    },
    {
      label: 'Portuguese audio to text',
      path: '/portuguese-audio-to-text',
      note: 'Portuguese sounds close to Spanish, but it is a separate language setting.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'What to change when a recording with strong accents comes out rough.',
    },
  ],
};
