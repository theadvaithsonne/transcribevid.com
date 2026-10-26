import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WhatsApp voice message to text',
  h1: 'Convert a WhatsApp voice message to text',
  lead: 'Long voice messages are easy to send and hard to reread. Save the message as a file, drop it here and read it as text with timestamps, in Hindi, English, Spanish and many other languages. Free, with no login.',
  dropKind: 'audio',
  dropNoun: 'WhatsApp voice message',

  whyTitle: 'Why turn a voice message into text',
  why: [
    'A voice message is quick to record and slow to use. You cannot search it, copy one sentence out of it or skim it in a meeting. As text, the same message takes seconds to scan, and you can paste an address, a quote or a list of instructions straight into a chat, a note or a document.',
    'Use this page for messages you sent or received and are free to use. Voice messages are personal, so it helps to know where the file goes: here it travels to the server over an encrypted connection and is removed automatically afterwards. No account is needed.',
  ],
  browserWhy: [
    'A voice message is quick to record and slow to use. You cannot search it, copy one sentence out of it or skim it in a meeting. As text, the same message takes seconds to scan, and you can paste an address, a quote or a list of instructions straight into a chat, a note or a document.',
    'Use this page for messages you sent or received and are free to use. Voice messages are personal, so the file stays with you: your browser transcribes it on your own device and nothing is uploaded. The first time you use the site, your browser downloads the speech model once and keeps it. It is tens of megabytes for Fastest, a few hundred for Standard and more for the larger choices, so use Wi-Fi rather than mobile data on a phone. No account is needed.',
  ],

  sections: [
    {
      title: 'How to save a voice message as a file',
      paragraphs: [
        'WhatsApp keeps voice messages inside the app, so save the message as a file first. Menus differ between phone models and app versions, so treat these steps as a guide and look for Share, Forward or Save options. WhatsApp belongs to its own company, and this site is not connected to it.',
        'WhatsApp can also show a transcript inside the chat on some phones, in the languages and versions that offer it. This page is for when you want the text as a file you can edit and export, with timestamps, or when your version or language is not covered.',
      ],
      bullets: [
        {
          title: 'On Android.',
          text: 'Press and hold the voice message, open the menu and look for Share, or Forward and then Share. Pick Save to device, Files or a cloud-drive app, or send it to yourself by e-mail. Many Android phones also keep received voice notes in a WhatsApp Voice Notes folder that a file manager can open.',
        },
        {
          title: 'On iPhone.',
          text: 'Press and hold the voice message, choose Forward, then tap the share icon and pick Save to Files. You can also send it to your computer with AirDrop or by e-mail.',
        },
        {
          title: 'On a computer.',
          text: 'In WhatsApp Web or the desktop app, the message menu may offer a Download option. If it does not, save the file on your phone and move it across.',
        },
      ],
    },
    {
      title: 'Hindi, Hinglish and mixed-language messages',
      paragraphs: [
        'Voice messages often mix languages in one sentence. Set the language to the one that is mostly spoken, or keep Detect automatically. Recognition follows the main language best, so check the lines marked as unsure where a second language comes in.',
        'For Hindi, Transcript style decides how the text is written. Hinglish (Roman Hindi) writes Hindi in English letters and keeps English words as they are. Original script keeps Devanagari. Urdu, Bengali, Arabic, Spanish, Portuguese and the other supported languages keep their own script. A message in another language can also come out as English text: in More options, switch Output to Translate to English, and check the result against the recording, because translation is less reliable than transcribing in the original language.',
      ],
    },
  ],

  howTitle: 'How to convert a WhatsApp voice message to text',
  howToDescription:
    'Save the voice message as a file, add it to the page, choose the language, wait for the transcript and copy or download the text.',
  steps: [
    {
      title: 'Add the voice message file',
      text: 'Drop the saved file on the box above, or press Choose a file. A WhatsApp voice message is usually an .opus file, and that works as it is. The box takes one file at a time: it hands the message to the uploader on the next page, where Add another file lets you include more messages.',
    },
    {
      title: 'Choose the language',
      text: 'On the next page, pick the language that is mostly spoken, or keep Detect automatically. For Hindi, Transcript style chooses between Roman letters (Hinglish) and Devanagari. Then press Transcribe.',
    },
    {
      title: 'Wait for the text',
      text: 'Lines appear with their timestamps while the message is processed, and a short message finishes sooner than a long one. Standard suits most messages. For a fast speaker or a noisy recording, High accuracy can help where your device can run it. On a device that cannot, the choice is greyed out with a reason, and it needs a bigger first-time download.',
    },
    {
      title: 'Check, copy or download',
      text: 'Correct names and unclear words, then copy the text, or download TXT. Download SRT or VTT only if the message belongs with a video.',
    },
  ],

  formatsTitle: 'Voice message files and downloads',
  formatsIntro:
    'WhatsApp voice messages are usually .opus files. Other audio files work the same way, and video files are accepted too, with only their sound used.',
  uploadTitle: 'Audio files you can add',
  accepts: ['OPUS', 'OGG', 'M4A', 'MP3', 'AAC', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'the message as plain text to copy' },
    { name: 'Markdown', use: 'notes with a time on each line' },
    { name: 'PDF', use: 'a printable copy of the message' },
    { name: 'SRT', use: 'timed lines for a video that carries the message' },
  ],

  tipsTitle: 'Tips for voice messages',
  tips: [
    {
      title: 'Save the file, do not re-record it.',
      text: 'Playing a message through the speaker while another device records it adds echo and room noise. The saved file is the clean copy.',
    },
    {
      title: 'Name the main language.',
      text: 'Choosing the language is more reliable than auto-detect for a short message, especially when the speaker switches between two languages.',
    },
    {
      title: 'Add names to the vocabulary hint.',
      text: 'In More options, type the names of people, places and shops mentioned. They are then more likely to be spelled the way you expect.',
    },
    {
      title: 'Check numbers before you act on them.',
      text: 'A phone number, an address, a time or an amount can be misheard. Play that line from its timestamp and listen again before you rely on it.',
    },
    {
      title: "Treat other people's messages with care.",
      text: 'Only transcribe messages you sent or received and are free to use, and think before you share the text of a message that someone sent to you privately.',
    },
  ],

  faqs: [
    {
      question: 'Can I convert a WhatsApp voice message to text without the app?',
      answer:
        'Yes. Save the voice message as a file, add it to this page and read the text. You do not need an account on this site, and there is no sign-up or login.',
    },
    {
      question: 'What file type is a WhatsApp voice message?',
      answer:
        'Usually an .opus file. This page reads it directly, so you do not need to convert it to MP3 first. Voice notes saved as OGG, M4A, MP3 or AAC work too.',
    },
    {
      question: 'Does it work for Hindi or a mix of Hindi and English?',
      answer:
        'Yes. Hindi is one of the supported languages. By default the text is written in Roman letters (Hinglish); choose Original script under Transcript style for Devanagari. A message that mixes languages follows the main one best, so check the lines marked as unsure.',
    },
    {
      question: 'How long a WhatsApp voice message can I transcribe?',
      answer:
        '{limits} Voice messages are normally short, so this rarely matters. There is no daily or monthly quota.',
      browser: {
        answer:
          'The site sets no size or length limit, and voice messages are normally short, so they finish quickly. A very long recording needs time and free memory on your device, and some browsers may not manage an extremely long file.',
      },
    },
    {
      question: 'Does this keep a copy of my WhatsApp voice message?',
      answer:
        'Only for your session. The server deletes the file when the session ends, or when you press Delete my data now.',
      browser: {
        answer:
          'Only in this browser: the voice message never leaves your device. Your browser clears it after a period of inactivity, and you can clear it sooner with Delete my data now.',
      },
    },
  ],

  links: [
    {
      label: 'Hindi audio to text',
      path: '/hindi-audio-to-text',
      note: 'Settings and tips for Hindi speech, in Devanagari or Roman letters.',
    },
    {
      label: 'Hinglish transcriber',
      path: '/hinglish-transcription',
      note: 'How Hindi is written in English letters, and when to use it.',
    },
    {
      label: 'Translate speech to English text',
      path: '/translate-audio-to-english',
      note: 'Get English text from a voice message in another language.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'What to change when a message comes out with mistakes.',
    },
  ],
};
