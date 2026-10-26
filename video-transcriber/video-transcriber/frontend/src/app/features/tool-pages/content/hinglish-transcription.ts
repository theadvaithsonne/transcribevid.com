import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Hinglish transcriber',
  h1: 'Hinglish transcriber: Hindi speech in Roman letters',
  lead: 'Drop in a Hindi video or voice note and get it written the way people type Hindi on their phones: in English letters, with English words left as they are. Timestamped, free and with no login.',
  dropKind: 'video',
  dropNoun: 'Hindi video or audio',

  whyTitle: 'What Hinglish is, and what this page does',
  why: [
    'Hinglish is Hindi written in the Latin alphabet, usually mixed with English words. It is how many people write messages, comments and captions, for example “aap kaise hain” or “kya haal hai”. There is no official spelling, so the same word can be written in several ways.',
    'This page turns spoken Hindi into that kind of text. It is not a translation: the words stay Hindi and only the letters change. The speech is recognised first, then a converter spells each Hindi word in English letters. Words that are already in English letters stay as they are, and the timestamps do not change.',
  ],

  sections: [
    {
      title: 'Three ways the conversion can run',
      bullets: [
        {
          title: 'IndicXlit (trained model).',
          text: 'A trained transliteration model called IndicXlit spells Hindi words in English letters. It copes with words that a spelling list does not know, including many names and less common words.',
          browser: {
            text: 'A trained transliteration model called IndicXlit spells Hindi words in English letters. It copes with words that a spelling list does not know, including many names and less common words. It runs on your own device and is a small extra download (about 13 MB) the first time it is needed.',
          },
        },
        {
          title: 'Basic phonetic spelling.',
          text: 'A simpler converter that spells words by their sound, using a list of common spellings and fixed rules. It needs no extra model, but names and unfamiliar words can look awkward.',
        },
        {
          title: 'Automatic (the default).',
          text: 'It uses IndicXlit when it is available and falls back to the basic spelling when it is not, with a notice on the transcript so you know to check the spelling.',
        },
      ],
      paragraphs: ['You choose between them under Hinglish conversion in More options.'],
    },
    {
      title: 'Why the spelling is a best effort',
      paragraphs: [
        'Roman Hindi has no standard spelling. “Achha” can also be written “acha” or “accha”, and “kyun” can be “kyon”. The converter picks one common spelling for each word, but you may prefer another.',
        'Check the names of people and places, brand names and unusual or technical words. These are the words where the conversion is least likely to match the spelling you would use. When you find one you want spelled differently, correct it in the editor; search and replace changes every repeat at once.',
        'If you change your mind about the style, open More on the finished transcript, choose Re-transcribe, set Transcript style or Hinglish conversion and press Apply style only. It re-spells the saved recognition without processing the audio again, and lines you have edited are kept.',
      ],
    },
    {
      title: 'Real Hinglish speech and the language setting',
      paragraphs: [
        'People who speak Hinglish jump between Hindi and English inside one sentence. Leave the language on Hindi, which this page selects for you. If you leave detection on, a clip that is mostly English words can be taken for English, and the Hindi parts may then be written badly or missed.',
        'The Hinglish style belongs to Hindi speech. Other languages keep their own script, even when they are also written in Devanagari. If the recording has a lot of English in it, a larger quality choice often copes better with the switching.',
      ],
    },
  ],

  howTitle: 'How to get Hinglish text from Hindi audio',
  howToDescription:
    'Add a Hindi video or audio file, check that Hindi and the Hinglish style are selected, wait for the transcript and download it.',
  steps: [
    {
      title: 'Add your Hindi file',
      text: 'Drop the video or audio in the box at the top of this page, or press Choose a file. You land on the uploader with Hindi and Hinglish (Roman Hindi) already selected. Change either one first if you wish.',
    },
    {
      title: 'Check the conversion, then press Transcribe',
      text: 'Leave Hinglish conversion on Automatic for the best spelling. Open More options if you want IndicXlit only, or Basic phonetic spelling. Then press Transcribe.',
      browser: {
        text: 'Leave Hinglish conversion on Automatic for the best spelling. The first time, the converter downloads once (about 13 MB) and is kept for next time. Open More options if you want IndicXlit only, or Basic phonetic spelling. Then press Transcribe.',
      },
    },
    {
      title: 'Wait for the text',
      text: 'The speech is recognised first and then converted to Roman letters. Every line keeps its timestamp.',
    },
    {
      title: 'Check the spelling and download',
      text: 'Read the lines marked as unsure, fix names and unusual words, then download TXT, SRT, VTT, Markdown, JSON or PDF.',
    },
  ],

  formatsTitle: 'Hinglish files you can download',
  formatsIntro:
    'Any video or audio with Hindi speech works, and only its sound is used. The text you download is in Roman letters, so it opens anywhere.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'OPUS', 'OGG', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'Hinglish text for chats, notes and posts' },
    { name: 'SRT', use: 'Roman Hindi captions for short videos' },
    { name: 'VTT', use: 'captions for web players' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for clean Hinglish transcripts',
  tips: [
    {
      title: 'Choose Hindi rather than leaving detection on.',
      text: 'It is the setting that matters most for mixed Hindi and English speech. This page starts with it already chosen.',
    },
    {
      title: 'Leave Skip silence & music on.',
      text: 'It is on by default and stops songs and long pauses from turning into invented lines.',
    },
    {
      title: 'Use the vocabulary hint for hard words.',
      text: 'Names and technical terms in More options help the recogniser hear them. The Roman spelling is still chosen by the converter, so check them afterwards.',
    },
    {
      title: 'Compare two qualities on quick mixed speech.',
      text: 'Quick speech that jumps between Hindi and English is where a Standard result slips first. Under More, Re-transcribe lets you pick Large v3 Turbo (High accuracy) or Large v3 (Best accuracy) under Quality and press Start. The first transcript stays, so you can compare the Roman spellings. To change only the spelling method, set Hinglish conversion there and press Apply style only instead.',
      browser: {
        text: 'Quick speech that jumps between Hindi and English is where a Standard result slips first. Under More, Re-transcribe lets you pick Large v3 Turbo (High accuracy) or Large v3 (Best accuracy) under Quality, if your device offers them, and press Start. The first transcript stays, so you can compare the Roman spellings. To change only the spelling method, set Hinglish conversion there and press Apply style only instead.',
      },
    },
    {
      title: 'Edit once, then export.',
      text: 'Fix spellings in the editor before you download, so that the TXT, SRT and VTT files all carry the same corrections.',
    },
  ],

  faqs: [
    {
      question: 'Is Hinglish the same as translating Hindi into English?',
      answer:
        'No. A translation changes the words into English. Hinglish keeps the Hindi words and changes only the letters, so “आप कैसे हैं” becomes something like “aap kaise hain”. For English text, use the Translate speech to English page.',
    },
    {
      question: 'Why is one Hindi word spelled two ways in my Hinglish transcript?',
      answer:
        'Roman Hindi has no standard spelling, and the converter spells by sound and from a list of common spellings, so a word can appear in two forms. Use search and replace in the editor to settle on the one you prefer.',
    },
    {
      question: 'Can I get Hinglish subtitles for a video?',
      answer:
        'Yes. Download SRT or VTT after the conversion. The lines keep their timing and the text is in Roman letters. Read them through before you publish, because names and unusual words need checking.',
    },
    {
      question: 'What does the Check Hinglish spelling message mean?',
      answer:
        'It appears when the basic phonetic spelling was used for some or all words, for example when the trained converter was not available, or for a very long word. Names and unfamiliar words may then look awkward, so review them.',
    },
    {
      question: 'Does the Hinglish style work for Marathi, Nepali or other languages?',
      answer:
        'No. The Hinglish style is for Hindi. Other languages keep their own script, including those that are also written in Devanagari.',
    },
  ],

  links: [
    {
      label: 'Hindi audio to text in Devanagari',
      path: '/hindi-audio-to-text',
      note: 'Keep the transcript in Hindi script instead of Roman letters.',
    },
    {
      label: 'Translate Hindi speech to English',
      path: '/translate-audio-to-english',
      note: 'Get English text and English subtitles instead of Roman Hindi.',
    },
    {
      label: 'WhatsApp voice message to text',
      path: '/whatsapp-voice-message-to-text',
      note: 'Save a voice note from a chat and read it as Hinglish.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'How to cut down mistakes before the first run and after it.',
    },
  ],
};
