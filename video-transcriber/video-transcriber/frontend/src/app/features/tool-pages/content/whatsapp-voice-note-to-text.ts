import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WhatsApp voice note to text',
  h1: 'WhatsApp voice note to text',
  lead: 'Got a long voice note you cannot listen to right now? Save it from WhatsApp, add it here and read it as text, in Hindi, Hinglish, English or 50+ other languages. Free, with no login.',
  browserLead:
    'Got a long voice note you cannot listen to right now? Save it from WhatsApp, add it here and read it as text, in Hindi, Hinglish, English or 50+ other languages. Free, with no login, and the voice note stays on your device.',
  dropKind: 'audio',
  dropNoun: 'voice note',

  whyTitle: 'Read a voice note instead of playing it',
  why: [
    'Voice notes are easy to send and slow to receive. You cannot skim them or search them later, and you cannot play them in a meeting or on a train without headphones. A transcript fixes all of that, and it keeps the details, such as an address, a list or an amount, in writing.',
    'WhatsApp saves voice notes as OPUS audio files, and they work here directly, with no conversion. Voice messages from other apps work too, as long as you can save the file.',
  ],

  howTitle: 'How to turn a WhatsApp voice note into text',
  howToDescription: 'Save the voice note from WhatsApp, add the file here, choose the language and read, copy or download the text.',
  steps: [
    {
      title: 'Save the voice note',
      text: 'On Android, tap and hold the voice note and press Share, or find it in the WhatsApp Voice Notes folder with a file manager. On iPhone, tap and hold it, choose Forward, then the share button, and Save to Files. On WhatsApp Web or desktop, open the message menu and choose Download.',
    },
    {
      title: 'Add it here',
      text: 'Open this page on the same phone or on a computer, and drop the file in the box at the top, or press Choose a file and pick it.',
    },
    {
      title: 'Choose the language',
      text: 'Pick the spoken language. For Hindi, choose Original script for Devanagari or Hinglish for Roman letters under Transcript style.',
    },
    {
      title: 'Read, copy or download',
      text: 'Press Copy text to paste it into a chat or a note, or download TXT or PDF to keep.',
    },
  ],

  formatsTitle: 'Voice message files',
  formatsIntro: 'WhatsApp uses OPUS. Other messaging and recorder apps use these formats, which work too.',
  uploadTitle: 'Voice files you can add',
  accepts: ['OPUS', 'OGG', 'M4A', 'AAC', 'MP3', 'WAV', '3GP'],
  downloads: [
    { name: 'TXT', use: 'the message as plain text' },
    { name: 'PDF', use: 'a copy to keep or forward' },
    { name: 'Markdown', use: 'notes with times' },
    { name: 'JSON', use: 'lines and times for programs' },
  ],

  tipsTitle: 'Tips for voice notes',
  tips: [
    {
      title: 'Treat it as private.',
      text: 'A voice note from a friend is still their voice and their words. Keep the text as private as the message.',
    },
    {
      title: 'Many notes at once.',
      text: 'Add several voice notes together; each becomes its own transcript.',
      browser: {
        text: 'Add several voice notes together; they are transcribed one after another, each as its own transcript.',
      },
    },
    {
      title: 'Background noise.',
      text: 'Voice notes are often recorded on the street. Keep Enhance audio on in More options: it filters rumble and hiss.',
    },
    {
      title: 'Mixed languages.',
      text: 'If the speaker switches between Hindi and English, pick Hindi rather than auto-detect, and choose Hinglish to keep the English words readable.',
    },
    {
      title: 'Short notes, quick model.',
      text: 'For a one-minute voice note, Fastest is usually enough and finishes sooner.',
      browser: {
        text: 'For a one-minute voice note, Fastest is usually enough and starts sooner, especially on a phone. Its model is downloaded once, the first time: about 77 to 146 MB, depending on your device.',
      },
    },
  ],

  faqs: [
    {
      question: 'What format are WhatsApp voice notes?',
      answer: 'OPUS audio, sometimes with the .ogg extension. Both work here directly; you do not need to convert them to MP3 first.',
    },
    {
      question: 'WhatsApp can show voice message transcripts. Why use this?',
      answer:
        "WhatsApp's own voice message transcripts work in some languages and on some phones. Use this page when your language is not covered, when you want Hinglish or Devanagari, timestamps, or a file you can save and share.",
    },
    {
      question: 'Can I transcribe a voice note on my phone?',
      answer: 'Yes. Save the voice note to your phone, open this page in your phone browser and choose the file.',
      browser: {
        answer:
          'Yes. Save the voice note, open this page in your phone browser and choose the file. The phone does the work itself, so Fastest is the quickest choice, and a short note is quick on a recent phone.',
      },
    },
    {
      question: 'Does it work for Hindi and Hinglish voice notes?',
      answer:
        'Yes. Choose Hindi as the language, then Original script for Devanagari or Hinglish for Roman letters. In Hinglish, English words in the message stay in English.',
    },
    {
      question: 'Is the voice note kept?',
      answer: 'Only for your session. It is deleted automatically when the session ends, or right away when you press Delete my data now.',
      browser: {
        answer:
          'Only in this browser: the voice note is never uploaded. It is deleted automatically after a period of inactivity, or right away when you press Delete my data now.',
      },
    },
  ],

  related: [
    '/voice-recording-to-text',
    '/hinglish-transcription',
    '/hindi-audio-to-text',
    '/m4a-to-text',
    '/private-transcription',
  ],

  links: [
    {
      label: 'WhatsApp voice message to text',
      path: '/whatsapp-voice-message-to-text',
      note: 'The same idea for a voice message you have saved from the chat.',
    },
    {
      label: 'Voice recording to text',
      path: '/voice-recording-to-text',
      note: 'Record in the browser or add a voice memo and read it as text.',
    },
    {
      label: 'How transcription on your own device works',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Why a private voice note never has to leave your phone or computer.',
    },
  ],
};
