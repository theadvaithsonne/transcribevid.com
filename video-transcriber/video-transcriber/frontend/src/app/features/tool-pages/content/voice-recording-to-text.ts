import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Voice recording to text',
  h1: 'Voice recording to text, right from your browser',
  lead: 'Record with your microphone on the page, or upload a voice memo from your phone, and read your words as text afterwards. Free, no login, in more than 50 languages.',
  dropKind: 'audio',
  dropNoun: 'voice recording',
  record: true,

  whyTitle: 'What this is for, and what it is not',
  why: [
    'Speaking is faster than typing, so many people capture ideas, meeting notes, lecture points and first drafts as a voice recording and turn them into text afterwards. This page is built for that: record or upload, then read, edit and download the text.',
    'It is not live dictation. You record, stop, and the transcript is made from the whole recording, so the words do not appear while you are still talking. In return, every line gets a timestamp.',
  ],

  howTitle: 'How to turn a voice recording into text',
  howToDescription: 'Record with your microphone or upload a voice memo, choose the language, wait for the transcript and download it.',
  steps: [
    {
      title: 'Record or choose a file',
      text: 'Drop a voice memo in the box at the top of this page (iPhone Voice Memos are M4A files), or press Choose a file. To record instead, press Record with your microphone under the box, then Record from microphone, and allow access when your browser asks.',
    },
    {
      title: 'Stop and choose the language',
      text: 'If you are recording, press Stop recording when you are done. Then select the spoken language or keep auto-detect.',
    },
    {
      title: 'Wait for the transcript',
      text: 'The text appears line by line, with a progress bar and an estimate of the time left.',
    },
    {
      title: 'Edit and download',
      text: 'Fix any word, then download TXT, Markdown or PDF. Transcripts exist only in your session, so save what you need.',
    },
  ],

  formatsTitle: 'Voice memo formats and downloads',
  formatsIntro: 'Phone and desktop voice recorders save in different formats. These all work.',
  uploadTitle: 'Recording files you can upload',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'OGG', 'OPUS', 'FLAC', '3GP'],
  downloads: [
    { name: 'TXT', use: 'your words as plain text' },
    { name: 'Markdown', use: 'notes with times' },
    { name: 'PDF', use: 'a printable copy of the note' },
    { name: 'SRT', use: 'timed lines, if the recording goes with a video' },
    { name: 'VTT', use: 'timed lines for web players' },
    { name: 'JSON', use: 'structured lines for programs' },
  ],

  tipsTitle: 'Tips for voice recordings',
  tips: [
    {
      title: 'Test the microphone.',
      text: 'Record ten seconds and play it back before a long session.',
    },
    {
      title: 'Speak at a steady pace.',
      text: 'Talk close to the microphone in a quiet room. Fans, keyboards and wind are picked up as clearly as you are.',
    },
    {
      title: 'Say names and numbers clearly.',
      text: 'Add unusual words to the vocabulary hint in More options and they are far more likely to come out right.',
    },
    {
      title: 'No microphone button?',
      text: 'Some browsers only allow recording on secure pages or after you give permission. Record with your phone voice recorder app and upload the file instead.',
    },
    {
      title: 'Mind other people.',
      text: 'Tell people when you record them, and get their permission first.',
    },
  ],

  faqs: [
    {
      question: 'Is this live dictation?',
      answer:
        'No. You record first and the transcript is made afterwards. For words that appear while you speak, use the dictation feature of your phone or computer instead.',
    },
    {
      question: 'Can I use it on my phone?',
      answer:
        'Yes. Open the page in your phone browser and record on the page, or upload a voice memo file you have already saved.',
    },
    {
      question: 'How long can a recording be?',
      answer:
        '{limits} Longer files are refused before they are processed, so split them first. There is no daily or monthly quota.',
      browser: {
        answer:
          'We set no limit: the recording is transcribed in your browser on your own device, so a long one simply takes longer. The page warns you on a slower device. There is no daily or monthly quota.',
      },
    },
    {
      question: 'Does it tell speakers apart?',
      answer:
        'No. Speaker names or labels are not added. Every line has a timestamp, and you can type names into the text while editing.',
    },
    {
      question: 'Is my voice recording stored?',
      answer:
        'Only for your session. It is deleted when the session ends, after a period of inactivity, or when you press Delete my data now. There is no account.',
      browser: {
        answer:
          'Only in this browser: your recording never leaves your device. It is deleted after a period of inactivity, or when you press Delete my data now. There is no account.',
      },
    },
  ],
};
