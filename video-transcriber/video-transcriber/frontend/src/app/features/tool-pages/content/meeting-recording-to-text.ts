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
  accepts: ['MP4', 'M4A', 'WEBM', 'MOV', 'MKV', 'MP3', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'the meeting as plain text' },
    { name: 'PDF', use: 'minutes to share or file' },
    { name: 'Markdown', use: 'notes with timestamps for Notion or Obsidian' },
    { name: 'SRT', use: 'captions for the recording' },
    { name: 'VTT', use: 'captions for a web player' },
    { name: 'JSON', use: 'lines and times for programs' },
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
};
