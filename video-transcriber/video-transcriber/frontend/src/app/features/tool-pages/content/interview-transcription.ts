import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Interview transcription',
  h1: 'Interview transcription with a timestamp on every line',
  browserH1: 'Interview transcription that keeps recordings private',
  lead: 'For researchers, journalists and recruiters: turn an interview recording into text you can quote, code and check against the audio. Words the model was unsure of are marked. Free, with no login.',
  browserLead:
    'For researchers, journalists and recruiters: turn an interview recording into text you can quote, code and check against the audio. Words the model was unsure of are marked. Free, with no login, and the recording never leaves your device.',
  dropKind: 'video',
  dropNoun: 'interview recording',

  whyTitle: 'Made for quoting and checking',
  why: [
    'An interview transcript is only useful if you can trust it. Every line here carries the time it was said, so you can jump to that moment and confirm a quote. With Word-level timing on, words the model was unsure of are marked, which shows you where to listen again.',
    'Research interviews often come with a consent form that limits who may handle the audio. Sources speak to journalists in confidence, and job interviews contain personal data. Here there is no account, and the file is kept only for your session.',
  ],
  browserWhy: [
    'An interview transcript is only useful if you can trust it. Every line here carries the time it was said, so you can jump to that moment and confirm a quote. With Word-level timing on, words the model was unsure of are marked, which shows you where to listen again.',
    'Research interviews often come with a consent form that limits who may handle the audio. Sources speak to journalists in confidence, and job interviews contain personal data. Here the recording is transcribed on your own device and never uploaded, so it stays under your control.',
  ],

  howTitle: 'How to transcribe an interview',
  howToDescription: 'Add the interview recording, choose the language and a high quality level, check the marked words and export the text.',
  steps: [
    {
      title: 'Add the recording',
      text: 'Drop the audio or video in the box at the top of this page, or press Choose a file. Phone recordings, Zoom files and WAVs from a recorder all work.',
    },
    {
      title: 'Choose language and quality',
      text: 'Set the language of the interview. Use High accuracy or Best accuracy when you will quote the text; they make the fewest mistakes.',
    },
    {
      title: 'Check the marked words',
      text: 'Read it through, listen again where words are marked as unsure, and fix them in place. Type speaker names or initials at the start of lines where you need them.',
    },
    {
      title: 'Export for your work',
      text: 'Download TXT for your analysis software, PDF for an archive or a participant check, or JSON if you need the time of every word.',
    },
  ],

  formatsTitle: 'Recordings and exports',
  formatsIntro: 'Audio recorders, phones and video calls all produce files that work here.',
  uploadTitle: 'Interview files you can add',
  accepts: ['MP3', 'WAV', 'M4A', 'MP4', 'WEBM', 'FLAC', 'OGG', 'AAC'],
  downloads: [
    { name: 'TXT', use: 'plain text, or each line with its time, for tools such as NVivo or ATLAS.ti' },
    { name: 'PDF', use: 'a fixed copy for an archive or a participant check' },
    { name: 'Markdown', use: 'notes with timestamps' },
    { name: 'JSON', use: 'every word with its time and confidence' },
    { name: 'SRT', use: 'subtitles, if you publish video clips' },
  ],

  tipsTitle: 'Tips for interview transcripts',
  tips: [
    {
      title: 'Get consent for the recording.',
      text: 'Ask before you record, and say how the recording and the transcript will be used and stored. Many countries and ethics boards require this in writing.',
    },
    {
      title: 'Place the recorder between you.',
      text: 'Accuracy drops when one voice is far from the microphone. Put the phone or recorder in the middle, not next to yourself.',
    },
    {
      title: 'Mark the speakers.',
      text: 'Speaker labels are not added automatically. Type "Q:" and "A:", or initials, at the start of lines while you edit.',
    },
    {
      title: 'Anonymise before you share.',
      text: 'Use search and replace to swap names for codes such as P01 across the whole transcript before anyone else sees it.',
    },
    {
      title: 'Keep the vocabulary hint short.',
      text: "Add the interviewee's name, organisation and a few technical terms. A very long list can confuse the model.",
    },
  ],

  faqs: [
    {
      question: 'Can it tell the interviewer and the interviewee apart?',
      answer: 'No. Speaker labels are not added. Each line has a timestamp, and you can add names or initials while you edit.',
    },
    {
      question: 'Is it accurate enough to quote?',
      answer:
        'On a clear recording with Best accuracy, most lines are right, but no automatic transcript is perfect. Always check a quote against the audio before you publish it; the timestamp takes you straight there.',
    },
    {
      question: 'Can I use it for research data under an ethics approval?',
      answer:
        'Check what your approval says about third-party tools. Here there is no account and the file is deleted when your session ends, but it is processed on the server that runs this site. Your ethics board has the final word.',
      browser: {
        answer:
          'Check what your approval says about tools. Here the recording is processed only on your own device and is never uploaded to a third party, which is often the deciding question. Your ethics board has the final word.',
      },
    },
    {
      question: 'Which file should I export for qualitative analysis?',
      answer: 'Plain text (.txt) imports into most analysis tools. Choose Text with times if you want each line to keep its timestamp.',
    },
    {
      question: 'How long does an hour-long interview take?',
      answer:
        'It depends on the quality level and how busy the service is. Fastest is quick; Best accuracy takes longest. Progress and the time left are shown while it works.',
      browser: {
        answer:
          'It depends on your device and the quality level. A recent laptop with a good graphics chip is much faster than an older phone, where it can take longer than the recording itself. Progress and the time left are shown while it works.',
      },
    },
  ],

  related: ['/private-transcription', '/audio-to-text', '/meeting-recording-to-text', '/podcast-to-text', '/wav-to-text'],
};
