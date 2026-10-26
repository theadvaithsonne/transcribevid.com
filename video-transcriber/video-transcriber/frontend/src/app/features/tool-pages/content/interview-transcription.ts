import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Interview transcription',
  h1: 'Interview transcription without an account',
  lead: 'Turn a recorded interview into timestamped text you can search, quote and check against the recording. Made for research, journalism and hiring conversations: free, no login, in more than 50 languages.',
  dropKind: 'video',
  dropNoun: 'interview recording',

  whyTitle: 'Why transcribe an interview',
  why: [
    'An interview is worth more once you can search it. A transcript lets you find where a participant mentioned a topic, quote them exactly, check a quote against the recording and compare answers across several interviews. Researchers, journalists, oral historians and people who run user-research or hiring interviews all work this way.',
    "Interviews often hold private or sensitive details. Here the recording is uploaded over an encrypted connection and deleted automatically afterwards. Get consent from everyone before you record, follow your organisation's or ethics board's rules, and treat the transcript as carefully as the recording.",
  ],
  browserWhy: [
    'An interview is worth more once you can search it. A transcript lets you find where a participant mentioned a topic, quote them exactly, check a quote against the recording and compare answers across several interviews. Researchers, journalists, oral historians and people who run user-research or hiring interviews all work this way.',
    "Interviews often contain private or sensitive details, so where the file goes matters. Your browser transcribes the recording on your own device and nothing is uploaded. Get consent from everyone before you record, follow your organisation's or ethics board's rules, and treat the transcript as carefully as the recording: the downloaded text is a file on your device like any other.",
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
  howToDescription:
    'Add the interview recording, choose the language, add names, wait for the transcript, then check it and download it.',
  steps: [
    {
      title: 'Add the interview recording',
      text: 'Press Choose a file, or drag the interview onto the box above. Audio or video both work. Add one interview here, then use Add another file on the next page for the rest of your set.',
    },
    {
      title: 'Choose language and quality',
      text: 'On the next page, select the language of the interview, or keep Detect automatically. Standard suits a quiet one-to-one conversation. Echo, a phone line or a heavy accent call for High accuracy where your device can run it; a device that cannot shows the choice greyed out with a reason. It is slower and a larger first-time download.',
    },
    {
      title: 'Add names and terms, then start',
      text: "In More options, list the participants' names, their organisations and any specialist terms in the vocabulary hint, so they are spelled the way you want. Then press Transcribe.",
    },
    {
      title: 'Check, label and export',
      text: 'Play lines from their timestamps, fix the mistakes and add speaker labels by hand. Then download TXT or PDF for your files, or Markdown or JSON if you need timed lines.',
    },
  ],

  formatsTitle: 'Interview recording files and downloads',
  formatsIntro:
    'Interviews come from phones, recorders and video calls. Any of these can be added, and the sound track is all that is read.',
  uploadTitle: 'Recording files you can add',
  accepts: ['MP4', 'MOV', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV'],
  downloads: [
    { name: 'TXT', use: 'plain text to read, quote and code' },
    { name: 'PDF', use: 'a copy to print or file' },
    { name: 'Markdown', use: 'timed text for a notes app or coding software' },
    { name: 'JSON', use: 'timed lines for analysis software' },
  ],

  tipsTitle: 'Tips for interview recordings',
  tips: [
    {
      title: 'Put the microphone close.',
      text: 'Place it near the participant, and use a headset or a clip-on microphone for phone and video calls. A microphone across the room or an echoing space usually costs more accuracy than any setting can win back.',
    },
    {
      title: 'State the date and names at the start.',
      text: 'Say who is taking part and when, at the start of the recording. It makes the file easy to label and the transcript easy to file later.',
    },
    {
      title: 'Keep the original recording.',
      text: 'Never delete the audio once you have the text. The recording is what settles a doubt about a quote.',
    },
    {
      title: 'Stay under the limits.',
      text: 'Anything over the limits shown on this page is turned away, so cut a very long interview at a natural break first.',
      browser: {
        title: 'Long interviews take longer.',
        text: 'There is no cap on length, though a long recording needs time and free memory on your device, and a browser without WebCodecs may struggle with a very long file. Cut it at a natural break if you would rather start with the first part.',
      },
    },
    {
      title: 'Clear your data on a shared computer.',
      text: 'When you have saved what you need, press Delete my data now, so the transcript does not stay in the session.',
    },
  ],

  faqs: [
    {
      question: 'Can I transcribe a confidential interview here?',
      answer:
        'Your recording is uploaded over an encrypted connection and deleted by the server when the session ends, or sooner if you press Delete my data now. Before you rely on that, check what your organisation or ethics board requires. This is not legal advice.',
      browser: {
        answer:
          'No upload happens: the recording stays on your device while your browser transcribes it, and the browser clears it after a period of inactivity or when you press Delete my data now. A downloaded transcript is an ordinary file, so check the rules of your organisation or ethics board. This is not legal advice.',
      },
    },
    {
      question: 'Does the interview transcript include um and uh?',
      answer:
        'Often not. The transcript is a clean read rather than a strict verbatim record, and some stutters and filler words are left out. If you need every one, play the recording alongside the text and add them.',
    },
    {
      question: 'Can the transcript tell the interviewer from the participant?',
      answer:
        'No. The transcript does not mark who is speaking. Type Interviewer and Participant into the text while you edit, using the recording to check each turn.',
    },
    {
      question: 'How long an interview can I transcribe?',
      answer: '{limits} A longer interview may need splitting.',
      browser: {
        answer:
          'Interview length is not capped. Your own device does the work, so a long interview takes longer and needs free memory, and the page tells you if your device looks too slow.',
      },
    },
    {
      question: 'Can I use these transcripts in my research or article?',
      answer:
        'Yes. Check them against the recording before you quote anyone, say in your method that speech recognition was used, and follow the rules of your institution or publication.',
    },
  ],

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
