import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Hindi audio to text',
  h1: 'Hindi audio and video to text, free',
  lead: 'Turn Hindi speech from a video, a voice note or a recording into text. Choose Devanagari or Hinglish in Roman letters, and every line gets a timestamp. Free, with no login.',
  browserLead:
    'Turn Hindi speech from a video, a voice note or a recording into text. Choose Devanagari or Hinglish in Roman letters, and every line gets a timestamp. Free, with no login, and the file never leaves your device.',
  dropKind: 'video',
  dropNoun: 'Hindi audio or video',

  whyTitle: 'Devanagari, Hinglish or English: pick the text you need',
  why: [
    'Hindi speech can be written down in three useful ways, and you get each one from the same recording. Original script writes Hindi in Devanagari, the way a newspaper prints it. Hinglish writes the same words in Roman letters ("aap kaise hain"), which many people find easier to type, search and read on a phone. Translate to English gives you English text instead.',
    'People use it for family voice notes, video scripts and captions, interviews, lectures, speeches and podcasts. Hindi speakers often mix in English words. In Hinglish style those words come out as normal English words, so a sentence like "meeting kal hai" reads the way it was said.',
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
  howToDescription: 'Add the Hindi recording, set the language to Hindi, choose Original script or Hinglish, wait for the transcript and download it.',
  steps: [
    {
      title: 'Add your recording',
      text: 'Drop the video or audio file in the box at the top of this page, or press Choose a file. Phone videos, WhatsApp voice notes and MP3 or M4A recordings all work.',
    },
    {
      title: 'Set Hindi and the style',
      text: 'Choose Hindi as the language rather than auto-detect, so mixed Hindi and English speech is not taken for English. Under Transcript style, pick Original script for Devanagari or Hinglish (Roman Hindi) for Roman letters.',
    },
    {
      title: 'Pick the quality',
      text: 'Hindi gains more from a bigger model than English does. Use High accuracy or Best accuracy for anything you will publish or quote. Fastest is fine for a quick, rough draft.',
      browser: {
        text: 'Hindi gains more from a bigger model than English does. Use High accuracy or Best accuracy if your device can run them. The first use of a quality level downloads its model once: about 77 to 485 MB for Fastest and Standard, more for the accuracy levels.',
      },
    },
    {
      title: 'Check and download',
      text: 'Read it through, fix names and words marked as unsure, then download TXT, SRT or PDF. To switch a finished transcript to the other style, open More, then Re-transcribe, and press Apply style only.',
    },
  ],

  formatsTitle: 'One line in both styles, files and downloads',
  formatsIntro:
    'Below is real output of the Hinglish converter for a Hindi sentence (the time is an example). Every download uses the style you chose, so a Hinglish transcript gives Hinglish subtitles.',
  exampleLabel: 'The same Hindi line in Original script and in Hinglish',
  example: `Original script
[00:04] तो उस डिसिप्लिन को कैसे मेंटेन किया जाए?

Hinglish (Roman Hindi)
[00:04] toh us discipline ko kaise maintain kiya jaaye?`,
  uploadTitle: 'Files you can use',
  accepts: ['MP4', 'MOV', 'WEBM', 'MP3', 'M4A', 'WAV', 'OPUS', 'OGG'],
  downloads: [
    { name: 'TXT', use: 'Hindi text in paragraphs, or with a time on each line' },
    { name: 'SRT', use: 'Hindi or Hinglish subtitles for a video' },
    { name: 'VTT', use: 'subtitles for web players' },
    { name: 'PDF', use: 'a copy to print or share' },
    { name: 'Markdown', use: 'notes with timestamps' },
    { name: 'JSON', use: 'every line and word time, for programs' },
  ],

  tipsTitle: 'Tips for Hindi transcripts',
  tips: [
    {
      title: 'Set the language to Hindi.',
      text: 'Auto-detect decides from the start of the recording. If it starts in English, or mixes in a lot of English, it may choose English and write the Hindi as rough English. Choosing Hindi avoids that.',
    },
    {
      title: 'Use a bigger model for Hindi.',
      text: 'The smaller models make noticeably more mistakes in Hindi than in English. High accuracy or Best accuracy is worth the wait for anything you will publish or quote.',
    },
    {
      title: 'Saving Devanagari.',
      text: 'TXT, SRT, VTT and Markdown are saved as UTF-8, so Devanagari opens correctly in modern editors and video apps.',
      browser: {
        text: 'TXT, SRT, VTT and Markdown are saved as UTF-8, so Devanagari opens correctly in modern editors and video apps. For a Devanagari PDF, your browser opens its print window: choose Save as PDF there.',
      },
    },
    {
      title: 'Spell names once.',
      text: 'Put the names of people, places and brands in the vocabulary hint under More options, written the way you want them to appear.',
    },
    {
      title: 'Noisy rooms and phone calls.',
      text: 'Keep Enhance audio on. When two people talk at once, expect gaps. Speaker names are not added, so type them in while you edit.',
    },
  ],

  faqs: [
    {
      question: 'Does it write Hindi in Devanagari or in English letters?',
      answer:
        'Both, as you choose. Original script gives Devanagari (नमस्ते). Hinglish (Roman Hindi) gives Roman letters (namaste) and keeps English words in English. The setting is called Transcript style and sits under Language.',
    },
    {
      question: 'How accurate is Hindi speech to text?',
      answer:
        'Good on clear speech with the larger models. It is weaker with the small models, on noisy audio and with strong regional accents or dialects. Names and numbers need the most checking. Words the model was unsure of are marked, so start there.',
    },
    {
      question: 'Can I get English text from Hindi audio?',
      answer:
        'Yes. In More options, set Output to Translate to English. The translation is automatic, so read it before you use it. Transcript style does not apply to a translation.',
    },
    {
      question: 'How long can a Hindi recording be?',
      answer: '{limits} There is no daily or monthly quota, so you can transcribe as many files as you like.',
      browser: {
        answer:
          'We set no limit. The file is transcribed on your own device, so a long recording just takes longer, and the speed depends on your phone or computer. There is no daily or monthly quota.',
      },
    },
    {
      question: 'Does it work for other Indian languages?',
      answer:
        'Yes. Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi, Urdu and Nepali are in the language list too, each in its own script. Accuracy is lower than for Hindi in most of them, so try a short clip first. Hinglish style applies to Hindi only.',
    },
  ],

  related: [
    '/hinglish-transcription',
    '/translate-hindi-audio-to-english',
    '/whatsapp-voice-note-to-text',
    '/subtitle-generator-for-reels',
    '/lecture-to-text',
    '/video-to-text',
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
