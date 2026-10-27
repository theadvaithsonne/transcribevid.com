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

  sections: [
    {
      title: 'What the transcript does and does not give you',
      paragraphs: ['Know the limits before you build on a transcript.'],
      bullets: [
        {
          title: 'No speaker labels.',
          text: 'Every line has a timestamp, but the transcript does not say who is speaking. Add Interviewer and Participant by hand while you edit, checking against the recording.',
        },
        {
          title: 'A clean read, not strictly verbatim.',
          text: 'Recognisers often leave out stutters and some filler words such as um. If your study needs a strict verbatim record, play the recording alongside the text and add what is missing.',
        },
        {
          title: 'Only after the interview.',
          text: 'It works on a saved recording. It does not join a call or transcribe live.',
        },
      ],
    },
    {
      title: 'Checking a transcript before you quote it',
      paragraphs: [
        'Before you publish a quote or cite a participant, play the line from its timestamp and listen. Lines the recogniser was unsure about are marked, so start there. Check names, numbers and dates, and any word that would change the meaning if it were wrong, such as can and cannot. To find every place a name or term appears, type it into the Search the text box above the finished transcript: it counts the matching lines and the arrows step between them.',
        'Keep the recording as the primary record and treat the transcript as a working copy. If you describe your method in a report or article, say that the transcript was made with speech recognition and then checked by hand.',
      ],
    },
    {
      title: 'Consent, storage and anonymity',
      paragraphs: [
        'Tell participants how the recording and the transcript will be stored and who will see them. If you promised anonymity, remove names and details that could identify someone before you share extracts. This page cannot do that for you, and it does not give legal advice.',
      ],
    },
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
  accepts: ['MP4', 'MOV', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV'],
  downloads: [
    { name: 'TXT', use: 'plain text to read, quote and code' },
    { name: 'PDF', use: 'a copy to print or file' },
    { name: 'Markdown', use: 'timed text for a notes app or coding software' },
    { name: 'JSON', use: 'timed lines for analysis software' },
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
  links: [
    {
      label: 'Meeting recording to text',
      path: '/meeting-recording-to-text',
      note: 'For recorded calls, with notes on turning a transcript into minutes.',
    },
    {
      label: 'Video to text',
      path: '/video-to-text',
      note: 'The general page for any recorded video.',
    },
    {
      label: 'Transcribe a video without uploading it',
      path: '/guides/transcribe-video-without-uploading',
      note: 'What happens to a recording in your browser, and how to see it for yourself.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'Audio and setting choices that reduce mistakes.',
    },
  ],
};
