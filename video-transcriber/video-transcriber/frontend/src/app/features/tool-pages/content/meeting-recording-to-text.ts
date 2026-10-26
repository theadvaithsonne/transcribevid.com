import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Meeting recording to text',
  h1: 'Meeting recording to text: Zoom, Teams and Google Meet',
  lead: 'Save the recording after your call, drop it here and get a timestamped transcript you can search, quote and turn into minutes. It costs nothing, needs no account and covers more than 50 languages.',
  dropKind: 'video',
  dropNoun: 'meeting recording',

  whyTitle: 'Why transcribe a meeting recording',
  why: [
    'Few people replay an hour-long meeting, but many need one thing from it: who agreed to what, and by when. A transcript lets you search for a deadline or a name, find the minute it was said and quote it exactly. It is a faster start for minutes and action lists than playing the call again.',
    'This page works on a recording that already exists. It cannot join a live call, and it does not add speaker names, so it replaces the replay, not the note-taker. Meetings often hold confidential details, so know where a recording goes: here it is uploaded over an encrypted connection and removed automatically afterwards.',
  ],
  browserWhy: [
    'Few people replay an hour-long meeting, but many need one thing from it: who agreed to what, and by when. A transcript lets you search for a deadline or a name, find the minute it was said and quote it exactly. It is a faster start for minutes and action lists than playing the call again.',
    'This page works on a recording that already exists. It cannot join a live call, and it does not add speaker names, so it replaces the replay, not the note-taker. Meetings often contain confidential details: your browser transcribes the recording on your own device and nothing is uploaded, and nothing is kept once your session ends.',
  ],

  sections: [
    {
      title: 'Where to find your meeting recording',
      paragraphs: [
        'Every meeting tool saves recordings in its own place, and menu names, folders and what your plan allows change between versions, so treat this as a guide. If you can export only the audio, an M4A or MP3 file is smaller and is read just as well. Zoom, Microsoft Teams and Google Meet are names of their respective owners, and this site is not connected to them.',
      ],
      bullets: [
        {
          title: 'Zoom.',
          text: 'A local recording is saved on your computer when the meeting ends, typically as an MP4 video and an M4A audio file. A cloud recording is downloaded from the recordings page of your Zoom account.',
        },
        {
          title: 'Microsoft Teams.',
          text: 'After the meeting the recording is stored in OneDrive or SharePoint, depending on the type of meeting, and a link appears in the meeting chat. Open it there and download the MP4 if your account allows downloads.',
        },
        {
          title: 'Google Meet.',
          text: 'Recordings are saved to Google Drive, usually in a Meet Recordings folder, and the organiser gets a link. Download the MP4 from Drive.',
        },
      ],
    },
    {
      title: 'From transcript to minutes',
      paragraphs: [
        'A raw transcript is not yet minutes, but it makes them quick to write. Once the transcript is finished, type a word such as deadline, agree or action into the Search the text box above it, or the name of someone involved. The box shows how many lines match, and the up and down arrows step from one to the next. Read around each hit, play that line from its timestamp if it is unclear, and copy the lines into your notes with their times so anyone can check the recording.',
        'If a name came out spelled two different ways, search for the wrong spelling, open Replace…, type the right one and apply it to every line at once. Download Markdown to paste into a notes app, or PDF to send round. Lines carry a time but no speaker label, so type the names in while you edit, using the recording to check who spoke.',
      ],
    },
    {
      title: 'Permission, rules and care',
      paragraphs: [
        "Tell everyone before you record a meeting and get their permission, and follow your organisation's rules about recordings and transcripts. A transcript of a confidential meeting is as sensitive as the recording, so store it and share it with the same care. This page does not give legal advice.",
      ],
    },
  ],

  howTitle: 'How to convert a meeting recording to text',
  howToDescription:
    'Add the meeting recording, choose the language, wait for the transcript and download it as text or subtitles.',
  steps: [
    {
      title: 'Add the recording',
      text: 'Press Choose a file, or drag the recording onto the box above. An MP4 video or an M4A audio file both work, and only the sound is used. The box takes one recording at a time and passes it to the uploader on the next page, where Add another file brings in the rest of a day of calls.',
    },
    {
      title: 'Choose language and quality',
      text: 'On the next page, pick the language people spoke, or keep Detect automatically. Standard suits most calls. Where your device offers them, High accuracy and Best accuracy suit fast talkers or poor audio; otherwise they show greyed out with the reason. Both are slower and need a bigger first-time download. If people switch language, pick the main one and check the lines marked as unsure. Then press Transcribe.',
    },
    {
      title: 'Wait for the transcript',
      text: 'Lines appear as the recording is processed, with a progress bar and an estimate of the time left. A long meeting takes longer.',
      browser: {
        text: 'Lines appear as the recording is processed, with a progress bar and an estimate of the time left. Your own device does the work, so a long meeting takes longer: keep this page open until it finishes.',
      },
    },
    {
      title: 'Search, edit and export',
      text: 'Type names and decision words into Search the text to jump between lines, play a line from its timestamp to check it, and fix mistakes. Then download TXT, Markdown or PDF. Add speaker names by hand while you edit.',
    },
  ],

  formatsTitle: 'Meeting recording files and downloads',
  formatsIntro:
    'Zoom, Teams and Meet recordings are usually MP4 or M4A. Other video and audio files work too, and only the sound track is read.',
  uploadTitle: 'Recording files you can add',
  accepts: ['MP4', 'M4A', 'MKV', 'MOV', 'WEBM', 'MP3', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'the whole meeting as plain text' },
    { name: 'Markdown', use: 'timed notes to paste into a notes app' },
    { name: 'PDF', use: 'a copy to print or send round' },
    { name: 'SRT', use: 'timed lines to caption the recording' },
  ],

  tipsTitle: 'Tips for meeting transcripts',
  tips: [
    {
      title: 'Use the audio-only file when there is one.',
      text: 'It holds the same speech in a much smaller file, so it is quicker to add and to process.',
    },
    {
      title: 'Put names and terms in the vocabulary hint.',
      text: 'In More options, list the people, product names and acronyms used in the meeting. That way names and acronyms come out as you expect.',
    },
    {
      title: 'Expect crosstalk to cause mistakes.',
      text: 'When two people speak at once, the recogniser cannot separate them. Lines it is unsure about are marked, so review those first.',
    },
    {
      title: 'Stay under the limits.',
      text: 'Recordings over the size or length limits shown on this page cannot be processed, so cut a very long call into parts first.',
      browser: {
        title: 'Long calls take longer.',
        text: 'The site sets no limit on length, but an all-day workshop recording needs time and free memory on your device. To read the first hour sooner, cut the file into parts in a video editor.',
      },
    },
    {
      title: 'Share the transcript with care.',
      text: 'Send it only to the people who were in the meeting or who need it, and delete it when you no longer need it.',
    },
  ],

  faqs: [
    {
      question: 'Can TranscribeVid join my Zoom or Teams call and transcribe it live?',
      answer:
        'No. It works on a recording that you save after the meeting. It cannot join a call, and it is not live captioning. For live captions, use the feature of your meeting tool.',
    },
    {
      question: 'Does a meeting transcript show who said what?',
      answer:
        'No. Lines carry a time but no name. Add the names yourself while you edit, and check each one against the recording.',
    },
    {
      question: 'Is it safe to transcribe a confidential meeting recording here?',
      answer:
        'The server receives the recording over an encrypted connection and deletes it when your session ends, or earlier if you press Delete my data now. Check what your organisation allows first. This is not legal advice.',
      browser: {
        answer:
          'The recording is not uploaded: your browser transcribes it on your own device, and clears it after a period of inactivity or when you press Delete my data now. A transcript you download is an ordinary file on your device, so look after it as you would the recording, and check what your organisation allows. This is not legal advice.',
      },
    },
    {
      question: 'How long a meeting recording can I transcribe?',
      answer: '{limits} Longer files cannot be processed, so split them first.',
      browser: {
        answer:
          'No cap is set on the recording itself, because the work happens on your own device. What limits you is time and free memory: a multi-hour call is possible, the page warns you if your device looks too slow for it, and a browser without WebCodecs support may not cope with a very long file.',
      },
    },
    {
      question: 'What if people switch language during the meeting?',
      answer:
        'Choose the language that is spoken most. Recognition follows the main language best, so words in another language may be written wrongly. Lines it is unsure about are marked: check those against the recording.',
    },
  ],

  links: [
    {
      label: 'MP4 to text',
      path: '/mp4-to-text',
      note: 'Settings for a meeting saved as an MP4 video.',
    },
    {
      label: 'M4A to text',
      path: '/m4a-to-text',
      note: 'For the audio-only file, which is smaller than the video.',
    },
    {
      label: 'Interview transcription',
      path: '/interview-transcription',
      note: 'For a recorded one-to-one conversation, with notes on consent and checking quotes.',
    },
    {
      label: 'Transcribe a video without uploading it',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Where your recording stays, and how to confirm it in your browser.',
    },
  ],
};
