import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Arabic audio to text',
  h1: 'Arabic audio to text, from news to everyday speech',
  lead: 'Turn Arabic speech from a video, a voice note or a recording into text in Arabic script, with a time on every line. Free Arabic speech to text, with no login.',
  browserLead:
    'Turn Arabic speech from a video, a voice note or a recording into text in Arabic script, with a time on every line. Free Arabic speech to text, with no login, and the file never leaves your device.',
  dropKind: 'video',
  dropNoun: 'Arabic video or audio',

  whyTitle: 'Arabic speech, written down in Arabic script',
  why: [
    'Arabic is spoken by hundreds of millions of people from Morocco to Iraq and the Gulf. People convert Arabic audio to text for lectures, sermons, news reports, interviews, podcasts, family voice notes and meetings. In Arabic the search is often written تحويل الصوت إلى نص (“turning sound into text”) or تحويل الفيديو إلى نص for video, and both end up here. The transcript comes out in Arabic script, right to left, with a timestamp on each line, and this page opens the uploader with Arabic already chosen under Language.',
    'Written Arabic is nearly the same everywhere (Modern Standard Arabic), but spoken Arabic is not. A news bulletin is in Modern Standard Arabic, while a chat between friends in Cairo, Riyadh, Beirut or Casablanca is in a local dialect. A speech recogniser is strongest on the first and weaker on the second, so it helps to know which one you have before you start.',
  ],

  sections: [
    {
      title: 'Modern Standard Arabic and the dialects',
      bullets: [
        {
          title: 'Modern Standard Arabic (fusha).',
          text: 'The language of news, lectures, sermons, books and formal talks. This is the best case, and it is closest to the read-aloud clips we measured.',
        },
        {
          title: 'Egyptian, Levantine, Gulf and Iraqi Arabic.',
          text: 'Everyday spoken Arabic that differs from fusha in words, grammar and sounds. The recogniser may write a dialect word in the nearest standard spelling, or get it wrong. Expect to correct more, and choose a larger quality level.',
        },
        {
          title: 'Maghrebi Arabic (Morocco, Algeria, Tunisia).',
          text: 'The dialects furthest from the standard, often mixed with French or Amazigh. This is the hardest case. Keep the language on Arabic, expect rough results and check every passage that switches language.',
        },
        {
          title: 'Arabic mixed with English or French.',
          text: 'Many speakers change language inside one sentence. Keep the setting on Arabic and check the foreign words, which may be written in Arabic letters or in Latin letters.',
        },
      ],
    },
    {
      title: 'What Arabic writing asks of a transcript',
      paragraphs: [
        'Arabic is written from right to left, and the transcript keeps that direction. The short vowel marks (tashkeel) are normally not written, the way a newspaper leaves them out, which is what most readers want.',
        'A single dot or a small mark can change a word, so some look-alike words get mixed up. Typical spots are the final ta marbuta (ة) against the final ha (ه), and the forms of alef: with hamza above (أ), with hamza below (إ) and plain (ا). Read for sense and replay the timestamped line when a word looks wrong.',
        'Numbers may appear as Western digits (123) or Arabic-Indic digits (١٢٣), and names of people and places can be spelled in more than one way. Choose one style when you edit.',
      ],
    },
    {
      title: 'How accurate is Arabic transcription here?',
      paragraphs: [
        'We tested the two models behind Standard and High accuracy on 30 clean Arabic clips, people reading sentences aloud. Standard got about 25 words in 100 wrong and High accuracy about 11.',
        'On 10 of those clips, treated the way a chat app treats a WhatsApp voice note, High accuracy went from 12 to 14 wrong words in 100, while Standard went from 23 to 33. So for Arabic, choose High accuracy, or Best accuracy if your device offers it, for anything you will quote or publish, and read the result before you use it. Dialects score worse than these read-aloud clips.',
      ],
    },
  ],

  howTitle: 'How to convert Arabic audio to text',
  howToDescription:
    'Add an Arabic recording, choose the quality, press Transcribe, check the look-alike words and download the transcript.',
  steps: [
    {
      title: 'Add your Arabic recording',
      text: 'Put the file in the drop box above, or press Choose a file. Phone videos, WhatsApp voice notes and MP3 or M4A recordings all work. The uploader opens with Arabic chosen under Language.',
    },
    {
      title: 'Choose the quality, then press Transcribe',
      text: 'Use High accuracy or Best accuracy for dialects, noise or anything you will publish. Standard is fine for a quick draft of clear speech. Then press Transcribe.',
      browser: {
        text: 'Use High accuracy or Best accuracy for dialects, noise or anything you will publish, if your device offers them (a choice it cannot run is greyed out, with the reason); each is a larger first-time download. Standard is fine for a quick draft of clear speech. Then press Transcribe.',
      },
    },
    {
      title: 'Follow the progress',
      text: 'Lines appear with their times while the file is processed. Enhance audio is on by default and evens out quiet speakers.',
      browser: {
        text: 'Lines appear with their times while the file is processed. Enhance audio is on by default and evens out quiet speakers. The first time, your browser also downloads the speech model once and keeps it for later.',
      },
    },
    {
      title: 'Check the text, then download',
      text: 'Read the lines marked as unsure, check names, numbers and look-alike words against the audio, then download TXT, SRT, VTT, Markdown, JSON or PDF.',
    },
  ],

  formatsTitle: 'Files and downloads for Arabic transcripts',
  formatsIntro:
    'Whatever the recording format, only its sound is read. The Arabic stays in Arabic script, right to left, in every download.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'OPUS', 'OGG', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'Arabic text to read, quote and paste' },
    { name: 'SRT', use: 'Arabic subtitles for players and editors' },
    { name: 'VTT', use: 'Arabic subtitles for web video' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for better Arabic transcripts',
  tips: [
    {
      title: 'Choose Arabic yourself.',
      text: 'Auto-detect decides from the first seconds. A recording that opens with music or an English phrase can be taken for another language, and Arabic written down as rough English is hard to repair.',
    },
    {
      title: 'Use High accuracy for dialects and noise.',
      text: 'In our test the smaller model made more than twice as many mistakes in Arabic as the larger one, and the gap grows on voice notes. The larger one is worth the wait.',
    },
    {
      title: 'Put names in the vocabulary hint.',
      text: 'People and places can be spelled in several ways in Arabic letters. Type the names you want into the Vocabulary hint under More options, written the way they should appear.',
    },
    {
      title: 'Saving Arabic text and subtitles.',
      text: 'TXT, SRT, VTT and Markdown are saved as UTF-8, so Arabic opens correctly in modern editors and video apps. If a player puts a full stop or a question mark at the wrong end of a right-to-left line, fix it in a subtitle editor.',
      browser: {
        text: 'TXT, SRT, VTT and Markdown are saved as UTF-8, so Arabic opens correctly in modern editors and video apps. If a player puts a full stop or a question mark at the wrong end of a right-to-left line, fix it in a subtitle editor. For an Arabic PDF, your browser opens its print window: choose Save as PDF there.',
      },
    },
  ],

  faqs: [
    {
      question: 'Can I convert Arabic voice to text for free?',
      answer:
        '{limits} There is no sign-up and no daily or monthly quota, so you can transcribe as many Arabic recordings as you like.',
      browser: {
        answer:
          'Yes. There is no sign-up, no limit on length and no daily or monthly quota. The recording is transcribed on your own device and is not uploaded, so a long file just takes longer, depending on your phone or computer.',
      },
    },
    {
      question: 'How accurate is Arabic speech to text?',
      answer:
        'On 30 clean clips, the High accuracy level got about 11 words in 100 wrong and Standard about 25. Dialects, noise and voice notes are harder, and names and numbers need the most checking. Words the model was unsure of are marked, so start there.',
    },
    {
      question: 'Does it understand Egyptian, Gulf and other Arabic dialects?',
      answer:
        'Partly. News, lectures and formal talks in Modern Standard Arabic come out best. Dialect speech works less well, and Maghrebi Arabic is the hardest. Choose Arabic yourself, use High accuracy, and read the result with the audio.',
    },
    {
      question: 'Can I get English text from Arabic audio?',
      answer:
        'Yes. In More options, set Output to Translate to English. The translation is automatic, so read it before you use it. It is a quick way to follow an Arabic interview or lecture without knowing the language.',
    },
    {
      question: 'Can I make Arabic subtitles for a YouTube video?',
      answer:
        'Yes. Transcribe the video, correct the text, download SRT or VTT and add that file as the subtitles of your video in YouTube Studio or in your editor. The guide to adding subtitles shows each step.',
    },
  ],

  links: [
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: 'Get an English draft of an Arabic lecture, news clip or interview.',
    },
    {
      label: 'WhatsApp voice message to text',
      path: '/whatsapp-voice-message-to-text',
      note: 'Save an Arabic voice note from a chat and read it as text.',
    },
    {
      label: 'How to add subtitles to a video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Turn the Arabic SRT or VTT file into subtitles on YouTube, VLC or in an editor.',
    },
    {
      label: 'Whisper accuracy by language',
      path: '/guides/whisper-accuracy-by-language',
      note: 'Arabic measured on 30 test clips: 25 wrong words in 100 on Standard and 11 on High accuracy.',
    },
  ],
};
