import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Meeting recording to text',
  h1: 'Meeting recording to text, with no bot in your call',
  lead: 'Already recorded the meeting in Zoom, Google Meet or Microsoft Teams? Add the file and get a timestamped transcript to search, quote and turn into minutes. Nothing joins your call, and there is no login.',
  browserLead:
    'Already recorded the meeting in Zoom, Google Meet or Microsoft Teams? Add the file and get a timestamped transcript to search, quote and turn into minutes. Nothing joins your call, and the recording never leaves your device.',
  dropKind: 'video',
  dropNoun: 'meeting recording',

  whyTitle: 'Transcribe after the meeting, not during it',
  why: [
    'Meeting assistants work by sending a bot into your call. Some guests find that awkward, and many companies block it. TranscribeVid works from the recording you already have, after the meeting, so nobody new appears in the list of participants.',
    'Use it for team calls, client meetings, board minutes, webinars and online classes. The transcript gives you exact quotes for the minutes and the moment a decision was made, and you can search it instead of scrubbing through an hour of video.',
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

  howTitle: 'How to turn a meeting recording into text',
  howToDescription: 'Find the Zoom, Meet or Teams recording, add it here, choose the language and quality, then edit and download the transcript.',
  steps: [
    {
      title: 'Find the recording',
      text: "Zoom saves local recordings in a Zoom folder inside Documents, usually with an audio-only M4A next to the MP4. Google Meet saves recordings to the organiser's Google Drive, in a Meet Recordings folder. Teams saves them to OneDrive or SharePoint; open the recording from the meeting chat to download it.",
    },
    {
      title: 'Add it here',
      text: 'Drop the MP4 or the M4A in the box at the top of this page. The audio-only M4A is smaller and gives the same text.',
      browser: {
        text: 'Drop the MP4 or the M4A in the box at the top of this page. The audio-only M4A is smaller, so it is read faster and needs less memory, and it gives the same text.',
      },
    },
    {
      title: 'Set language and quality',
      text: 'Choose the language of the meeting. For calls with several accents or poor microphones, High accuracy or Best accuracy makes fewer mistakes.',
    },
    {
      title: 'Edit and download',
      text: 'Type in speaker names where they matter, then download TXT or PDF for the minutes, or Markdown for your notes app.',
    },
  ],

  formatsTitle: 'Meeting files you can use',
  formatsIntro: 'Zoom, Meet and Teams all save MP4 video, and Zoom also saves an M4A audio file. Phone recordings of meetings in a room work too.',
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
      title: 'Tell people first.',
      text: 'Say at the start that the meeting is recorded and will be transcribed. In many places you need everyone\'s consent to record.',
    },
    {
      title: 'Use the audio-only file.',
      text: "Zoom's M4A has the same speech as the MP4 in a much smaller file.",
    },
    {
      title: 'No speaker names.',
      text: 'Lines are not labelled by speaker. The timestamps make it quick to check who said what in the recording, and you can type the names in.',
    },
    {
      title: 'Add jargon to the vocabulary hint.',
      text: "Project names, product codes and colleagues' names in More options come out right far more often.",
    },
    {
      title: 'Long meetings.',
      text: 'If a meeting is longer than the length limit shown under the drop box, split the recording into parts first.',
      browser: {
        text: 'There is no length limit, but a two-hour meeting takes a while on a slower device. Keep the tab open and the laptop plugged in.',
      },
    },
  ],

  faqs: [
    {
      question: 'Does a bot join my meeting?',
      answer: 'No. Nothing connects to Zoom, Meet or Teams. You add a recording after the meeting, the way you would add any other file.',
    },
    {
      question: 'Can it transcribe a meeting live?',
      answer: 'No. It works on recordings, not live calls. Record the meeting with your meeting app, then add the file here when it ends.',
    },
    {
      question: 'Where does Zoom save recordings?',
      answer:
        'Local recordings go to a Zoom folder in your Documents folder, one folder per meeting. Cloud recordings are on the Zoom website under Recordings, where you can download them.',
    },
    {
      question: 'Can I write meeting minutes from it?',
      answer:
        'Yes, the transcript is the raw material. Download Markdown or TXT and cut it down to the decisions and actions. The tool does not write summaries for you.',
    },
    {
      question: 'How long can a meeting recording be?',
      answer: "{limits} Zoom's audio-only M4A is the smallest file for the same meeting. There is no daily or monthly quota.",
      browser: {
        answer:
          'We set no limit. The recording is transcribed on your own device, so a long meeting takes longer, and the page warns you on a slower device. There is no daily or monthly quota.',
      },
    },
  ],

  related: ['/mp4-to-text', '/m4a-to-text', '/interview-transcription', '/private-transcription', '/otter-ai-alternative'],
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
