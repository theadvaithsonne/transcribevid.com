import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Hinglish transcription',
  h1: 'Hinglish transcription: Hindi speech, Roman letters',
  lead: 'Get Hindi and Hindi-English speech written the way people type it in chats: "aap kaise ho", not Devanagari. English words stay English, every line has a timestamp, and it is free with no login.',
  browserLead:
    'Get Hindi and Hindi-English speech written the way people type it in chats: "aap kaise ho", not Devanagari. English words stay English, every line has a timestamp, and it is free, with no login, right in your browser.',
  dropKind: 'video',
  dropNoun: 'Hindi recording',

  whyTitle: 'Why Hinglish, and how the spelling works',
  why: [
    'Most people who speak Hindi online type it in Roman letters. Hinglish text is easy to search, paste into WhatsApp and edit on any keyboard. It also suits readers who speak Hindi but read Devanagari slowly, and it is what many creators want for captions on Reels and Shorts.',
    'Speech recognition first writes Hindi in Devanagari. TranscribeVid then turns each Hindi word into Roman letters and leaves English words as they are. Hinglish has no official spelling, so the converter follows common chat spelling: "hai", "mein", "kya", "nahi". Names and rare words are spelled by their sound, which is why a quick review is part of the job.',
  ],

  howTitle: 'How to get a Hinglish transcript',
  howToDescription: 'Add a Hindi recording, set the language to Hindi and Transcript style to Hinglish, wait, review names and download the Roman text.',
  steps: [
    {
      title: 'Add the recording',
      text: 'Drop a video, voice note or audio file in the box at the top of this page, or press Choose a file.',
    },
    {
      title: 'Choose Hindi and Hinglish',
      text: 'Set the language to Hindi, then set Transcript style to Hinglish (Roman Hindi). Choosing Hindi yourself works better than auto-detect when the speaker mixes in a lot of English.',
    },
    {
      title: 'Wait for the text',
      text: 'A progress bar shows how far it is. When it finishes, every Hindi line is in Roman letters.',
      browser: {
        text: 'A progress bar shows how far it is. Speed depends on your device, and the first use downloads the speech model once. When it finishes, every Hindi line is in Roman letters.',
      },
    },
    {
      title: 'Review names, then download',
      text: 'Check names, places and rare words, then download TXT, SRT or VTT. Already have a Devanagari transcript? Open More, then Re-transcribe, choose Hinglish and press Apply style only. The audio is not processed again.',
    },
  ],

  formatsTitle: 'An example, files and downloads',
  formatsIntro: 'Real output of the Hinglish converter for a mixed Hindi-English sentence. The downloads use the same Roman text.',
  exampleLabel: 'A Hindi-English sentence in Devanagari and in Hinglish',
  example: `As recognised (Devanagari):
यह वीडियो हिंदी में है, but some English words भी हैं.

As you download it (Hinglish):
yeh video Hindi mein hai, but some English words bhi hain.`,
  uploadTitle: 'Files you can use',
  accepts: ['MP4', 'MOV', 'MP3', 'M4A', 'OPUS', 'WAV', 'AAC', 'WEBM'],
  downloads: [
    { name: 'SRT', use: 'Hinglish captions for Reels, Shorts and YouTube' },
    { name: 'VTT', use: 'Hinglish captions for web players' },
    { name: 'TXT', use: 'Roman Hindi text to paste anywhere' },
    { name: 'Markdown', use: 'notes with timestamps' },
    { name: 'PDF', use: 'a printable copy' },
    { name: 'JSON', use: 'lines and times for programs' },
  ],

  tipsTitle: 'How to get clean Hinglish',
  tips: [
    {
      title: 'Know the two converters.',
      text: 'Under More options, Hinglish conversion offers IndicXlit, a trained transliteration model, and Basic phonetic spelling. Automatic uses IndicXlit when it is available. The trained model usually spells names better: "narendra modi" rather than "narendr modee".',
    },
    {
      title: 'Capitalise names yourself.',
      text: 'Hindi has no capital letters, so names come out in lower case (dilli, modi). Use search and replace in the transcript to fix a name everywhere at once.',
    },
    {
      title: 'Expect a few sound spellings.',
      text: 'Many words can be spelled more than one way in Hinglish ("ne" or "ney", "kaha" or "kahaa"). Pick the spelling your readers expect and replace it throughout.',
    },
    {
      title: 'Only Hindi changes.',
      text: 'Hinglish applies to Hindi. English stays English, and other languages, such as Marathi, Urdu or Punjabi, keep their own script.',
    },
    {
      title: 'Translation switches it off.',
      text: 'When Output is set to Translate to English, the text is English and Transcript style is not used. Set Output back to Transcribe for Hinglish.',
    },
  ],

  faqs: [
    {
      question: 'What is Hinglish transcription?',
      answer:
        'Hindi speech written in Roman (English) letters, with English words kept as English: "kal meeting hai" instead of the Devanagari spelling. It is how most people type Hindi in chats and captions.',
    },
    {
      question: 'Is Hinglish the same as translating to English?',
      answer:
        'No. Hinglish keeps the Hindi words and only changes the letters. Translation replaces them with English words. Choose Hinglish for captions and chat-style text, and Translate to English when your readers do not speak Hindi.',
    },
    {
      question: 'Can I turn a Devanagari transcript into Hinglish later?',
      answer:
        'Yes, while it is still in your Transcripts. Open it, choose More, then Re-transcribe, set Transcript style to Hinglish and press Apply style only. It uses the saved recognition, so it is quick, and lines you edited are kept.',
    },
    {
      question: 'Why are some Hinglish words spelled oddly?',
      answer:
        'Each Hindi word is converted by its sound, and Hinglish has no fixed spelling. Rare words, names and English words that were heard as Hindi can come out odd. Fix them in the editor, or use search and replace for a word that repeats.',
    },
    {
      question: 'Can I make Hinglish subtitles?',
      answer:
        'Yes. Choose Hinglish, then download SRT or VTT, and every subtitle line is in Roman letters. Keep Word-level timing on in More options so each line starts and ends with its words.',
    },
  ],

  related: [
    '/hindi-audio-to-text',
    '/translate-hindi-audio-to-english',
    '/subtitle-generator-for-reels',
    '/whatsapp-voice-note-to-text',
    '/srt-subtitle-generator',
  ],
};
