import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Private transcription',
  h1: 'Private transcription for confidential recordings',
  browserH1: 'Private transcription that never uploads your files',
  lead: 'Transcribe interviews, client calls, medical notes or anything confidential with no account and no tracking. Your file is used only to make your transcript and is deleted when your session ends.',
  browserLead:
    "Transcribe interviews, client calls, medical notes or anything confidential without sending it anywhere. The speech recognition runs on your own device, so the file never reaches a server, ours or anyone else's.",
  dropKind: 'video',
  dropNoun: 'file',

  whyTitle: 'Where your file goes',
  why: [
    'Most online transcription services upload your recording to their servers and keep it in an account, sometimes for weeks. That is a problem for recordings you promised to keep confidential: research interviews, HR conversations, legal or medical notes, material from a source.',
    'Here there is no account and nothing is linked to you. The file is kept only for your session and is deleted automatically when the session ends, or at once when you press Delete my data now. If you run TranscribeVid on your own computer, the file never leaves that machine.',
  ],
  browserWhy: [
    'Most online transcription services upload your recording to their servers and keep it in an account, sometimes for weeks. That is a problem for recordings you promised to keep confidential: research interviews, HR conversations, legal or medical notes, material from a source.',
    "Here the speech recognition model runs in your browser, on your own device. The file is read from your disk and is never uploaded. You can check this yourself: open your browser's developer tools, go to the Network tab and transcribe a file. You will see the model being downloaded, but your file is never sent.",
  ],

  howTitle: 'How to transcribe privately',
  howToDescription: 'Choose the file, pick the language and quality, fix the transcript in place, download it and delete your data.',
  steps: [
    {
      title: 'Choose the file',
      text: 'Drop it in the box at the top of this page, or press Choose a file. No account or e-mail address is asked for.',
      browser: {
        text: 'Drop it in the box at the top of this page, or press Choose a file. Your browser reads it from your disk and sends it nowhere.',
      },
    },
    {
      title: 'Pick language and quality',
      text: 'Choose the spoken language and a quality level. Best accuracy makes the fewest mistakes, which matters when you will quote the text.',
      browser: {
        text: 'Choose the spoken language and a quality level. The first time, your browser downloads the speech model: the model comes to you, your file goes nowhere.',
      },
    },
    {
      title: 'Edit in place',
      text: 'Fix names and words marked as unsure right in the transcript. Search and replace changes a name everywhere at once.',
    },
    {
      title: 'Download, then delete',
      text: 'Download what you need, then press Delete my data now in the Transcripts menu to remove the file and the transcript at once.',
      browser: {
        text: 'Download what you need, then press Delete my data now in the Transcripts menu to clear the file and the transcript from this browser.',
      },
    },
  ],

  formatsTitle: 'Files and downloads',
  formatsIntro: 'Video and audio both work. Each download is a normal file on your device, so you decide where it is kept.',
  uploadTitle: 'Files you can use',
  accepts: ['MP4', 'MOV', 'MKV', 'WEBM', 'MP3', 'M4A', 'WAV', 'FLAC'],
  downloads: [
    { name: 'TXT', use: 'plain text for your notes' },
    { name: 'PDF', use: 'a copy for a case file or a client' },
    { name: 'Markdown', use: 'notes with timestamps' },
    { name: 'SRT', use: 'subtitles, if it is a video' },
    { name: 'VTT', use: 'subtitles for web players' },
    { name: 'JSON', use: 'words, times and confidence for programs' },
  ],

  tipsTitle: 'Privacy tips',
  tips: [
    {
      title: 'Shared computer?',
      text: 'Press Delete my data now when you are done, and close the browser.',
      browser: {
        text: 'Transcripts stay in this browser until they expire. On a shared or work computer, use a private window, or press Delete my data now when you are done.',
      },
    },
    {
      title: 'Know what is processed.',
      text: 'The Privacy policy says what is processed, where, for how long and why.',
      browser: {
        title: 'Check it yourself.',
        text: "Open your browser's developer tools, go to the Network tab and transcribe a file. You will see the model download, but your file is never sent.",
      },
    },
    {
      title: 'Get consent first.',
      text: 'Recording someone usually needs their permission, and the rules differ between countries. A private transcript does not replace consent for the recording.',
    },
    {
      title: 'Mind the downloads.',
      text: 'Once you download a transcript it is a normal file. Keep it in an encrypted or access-controlled folder if the content is sensitive.',
    },
    {
      title: 'Cookies and storage.',
      text: 'The Privacy policy lists the cookies and what is stored, and for how long.',
      browser: {
        text: 'This website is paid for by ads from Google, which uses cookies; it sets no cookies of its own. No ad is shown while a file is being transcribed. Details are in the Privacy policy.',
      },
    },
  ],

  faqs: [
    {
      question: 'Is my file uploaded anywhere?',
      answer:
        'Yes, to the server that runs this site, because that is where the transcription happens. It is kept only for your session and then deleted. On a copy you run on your own computer, that server is your computer.',
      browser: {
        answer:
          'No. The transcription runs in your browser on your own device, and the file is never uploaded, to us or to anyone else. Only the speech model is downloaded, the first time you use a quality level.',
      },
    },
    {
      question: 'Can I use it for confidential or medical recordings?',
      answer:
        'Many people do, because there is no account and nothing is kept after your session. You are still responsible for following your organisation\'s rules and the law that applies to you. If your rules require a specific certified service, use that.',
      browser: {
        answer:
          "Many people do, because the recording never leaves the device. You are still responsible for following your organisation's rules and the law that applies to you. If your rules require a specific certified service, use that.",
      },
    },
    {
      question: 'Who can see my transcript?',
      answer:
        'Only someone with your browser session. There are no share links and no accounts, and the transcript is deleted when the session ends.',
      browser: {
        answer:
          'Only someone using this browser on this device. There are no share links and no accounts, and transcripts are deleted after a period of inactivity or when you press Delete my data now.',
      },
    },
    {
      question: 'Is private transcription slower?',
      answer:
        'It depends on the server and the quality level you pick. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.',
      browser: {
        answer:
          'Often, yes. Your own device does the work, so the speed depends on its processor or graphics chip. A recent laptop is fast; an older phone is slow and does best with Fastest. The first use also downloads the model: about 77 to 485 MB for Fastest and Standard, more for the accuracy levels.',
      },
    },
    {
      question: 'Do I need an account or an e-mail address?',
      answer: 'No. There is no sign-up, no login and no e-mail. Nothing is linked to you, so there is also nothing to cancel.',
    },
  ],

  related: [
    '/interview-transcription',
    '/meeting-recording-to-text',
    '/voice-recording-to-text',
    '/turboscribe-alternative',
    '/otter-ai-alternative',
  ],

  links: [
    {
      label: 'How transcription on your own device works',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Where your file goes, and where it does not.',
    },
    {
      label: 'What is Whisper',
      path: '/guides/what-is-whisper',
      note: 'The open speech model that runs in your browser.',
    },
    {
      label: 'Interview transcription',
      path: '/interview-transcription',
      note: 'Confidential interviews, with timestamps and confidence marks you can review.',
    },
  ],
};
