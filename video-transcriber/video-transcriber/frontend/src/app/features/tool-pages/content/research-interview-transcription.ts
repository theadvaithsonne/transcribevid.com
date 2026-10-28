import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Research interview transcription',
  h1: 'Research interview transcription, free and unlimited',
  lead: 'Transcribe interviews and focus groups for a thesis, a study or a user-research project: add the recording and get a timestamped transcript in more than 50 languages, with no login and no per-hour fee.',
  browserLead:
    'Transcribe interviews and focus groups for a thesis, a study or a user-research project: add the recording and the transcript is made on your own device, with timestamps, in more than 50 languages, with no login and no per-hour fee.',
  dropKind: 'video',
  dropNoun: 'interview recording',

  whyTitle: 'Transcription for researchers',
  why: [
    'Qualitative research can mean tens of hours of interviews, and paying a service by the minute for all of them is a real cost for a student or a small project. A transcript is also the thing you code, quote and search, so it has to be good enough to trust.',
    'This page gives a first transcript in minutes: it adds punctuation, marks timestamps for every line and lets you correct the text in the page. It is a draft, not a finished research transcript. You still listen as you read it, correct names and terms, and add speaker labels.',
  ],
  browserWhy: [
    'Qualitative research can mean tens of hours of interviews, and paying a service by the minute for all of them is a real cost for a student or a small project. A transcript is also the thing you code, quote and search, so it has to be good enough to trust.',
    'This page gives a first transcript in minutes: it adds punctuation, marks timestamps for every line and lets you correct the text in the page. The recording is read on your own device and is never uploaded, which can make data handling simpler to describe. It is a draft, not a finished research transcript. You still listen as you read it, correct names and terms, and add speaker labels.',
  ],

  sections: [
    {
      title: 'What to know before you rely on it',
      bullets: [
        {
          title: 'It is not strictly verbatim.',
          text: 'The model tends to leave out filler words ("um", "you know"), false starts and repeated words. If your method needs a verbatim transcript, add those while you correct the text.',
        },
        {
          title: 'There are no speaker labels.',
          text: 'Interviewer and participant are not separated. The timestamps make it quick to add "I:" and "P:" at each change of speaker.',
        },
        {
          title: 'Check names, terms and numbers.',
          text: 'Technical vocabulary, place names and people are the usual errors. Put them in the vocabulary hint under More options before you start, and check them afterwards.',
        },
        {
          title: 'Your ethics board decides.',
          text: 'Some boards and data-management plans restrict where participant recordings may be processed. Check your own rules and consent form before you use any transcription tool.',
          browser: {
            text: 'Some boards and data-management plans restrict where participant recordings may be processed. Here the recording stays on your device, which can be easier to describe, but your board decides what is allowed, so check your own rules and your consent form.',
          },
        },
      ],
    },
  ],

  howTitle: 'How to transcribe a research interview',
  howToDescription: 'Add the interview recording, choose the language and quality, add key terms, then edit the transcript and download it.',
  steps: [
    {
      title: 'Add the recording',
      text: 'Drop the interview file in the box at the top of this page, or press Choose a file. Add one interview at a time and name each transcript after the participant code.',
    },
    {
      title: 'Choose the language',
      text: 'Pick the language of the interview. For a multilingual interview, pick the main language and check the other parts while you edit.',
    },
    {
      title: 'Add the key terms',
      text: 'In More options, put the names, places and technical terms in the vocabulary hint, spelled as you want them.',
    },
    {
      title: 'Edit and download',
      text: 'Listen while you read and fix each line. Then download TXT or Markdown to import into your analysis software, or SRT and VTT if you want timed lines.',
    },
  ],

  formatsTitle: 'Recording files and downloads',
  formatsIntro: 'Files from voice recorders, phones and video calls all work here, and only the sound of a video is used. JSON keeps the start and end time of every line for scripts; Markdown puts one time on each paragraph.',
  uploadTitle: 'Files you can add',
  accepts: ['MP3', 'WAV', 'M4A', 'FLAC', 'OGG', 'MP4', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'plain text to import into your analysis software' },
    { name: 'Markdown', use: 'text with timestamps for notes and coding' },
    { name: 'JSON', use: 'words with start and end times for your own scripts' },
    { name: 'SRT', use: 'timed lines to review next to the recording' },
    { name: 'VTT', use: 'timed lines for web players' },
    { name: 'PDF', use: 'a printable copy for annotation' },
  ],

  tipsTitle: 'Tips for research recordings',
  tips: [
    {
      title: 'Record well in the first place.',
      text: 'A phone or recorder placed between you and the participant, in a quiet room, matters more than any setting. A bad recording cannot be rescued by a better model.',
    },
    {
      title: 'Use High accuracy or Best accuracy.',
      text: 'Interviews are worth the extra time. Fastest is only for checking what a file contains.',
      browser: {
        text: 'Interviews are worth the extra time, if your device offers these levels: they need a computer with a graphics-capable browser such as Chrome or Edge, and a level your device cannot run is greyed out with the reason. Fastest is only for checking what a file contains.',
      },
    },
    {
      title: 'Anonymise after, not before.',
      text: 'Transcribe the recording as it is, then replace names with codes while you edit. Delete the working copy when you have finished.',
    },
    {
      title: 'Keep the timestamps.',
      text: 'Export JSON, or Text with times, when you need the exact moment a quote was said, and cite the time in your notes. Markdown keeps one timestamp per paragraph.',
    },
  ],

  faqs: [
    {
      question: 'Is the transcript good enough to quote?',
      answer: 'As a draft, yes. Listen to the passage and correct it before you quote it, because even good speech recognition gets some words wrong.',
    },
    {
      question: 'Does it label who is speaking?',
      answer: 'No. You add the speaker labels while you edit; the time on each line helps you find the place in the recording where the speaker changes.',
    },
    {
      question: 'Can it transcribe interviews in other languages?',
      answer: 'Yes, in more than 50 languages, and it can translate speech to English text. Check translated quotes with a speaker of the language before you use them.',
    },
    {
      question: 'Is there a limit on the number of interviews?',
      answer: 'No. There is no quota, no account and no per-minute fee. {limits}',
      browser: {
        answer:
          'No. There is no quota, no account and no per-minute fee, and we set no length limit. Your own device does the work, so very long interviews need free memory and some time.',
      },
    },
    {
      question: 'What happens to the recording of a participant?',
      answer: 'It is deleted when your session ends, or when you press Delete my data now. Read the privacy page and check your consent form.',
      browser: {
        answer:
          'It stays in this browser and is never uploaded. It is deleted after a period of inactivity or when you press Delete my data now. Read the privacy page and check your consent form.',
      },
    },
  ],

  related: ['/interview-transcription', '/private-transcription', '/lecture-to-text', '/flac-to-text', '/audio-to-text'],
  links: [
    {
      label: 'Interview transcription',
      path: '/interview-transcription',
      note: 'Tips for journalists and anyone else turning interviews into quotable text.',
    },
    {
      label: 'Private transcription',
      path: '/private-transcription',
      note: 'What it means for a file to be transcribed on your own device.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'What to change about the recording, the language and the settings when the first result is not good enough.',
    },
  ],
};
