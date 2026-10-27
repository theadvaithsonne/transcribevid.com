import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Audio to text',
  h1: 'Turn audio into text without signing up',
  lead: 'Drop in a podcast, interview, lecture or voice note and get a timestamped transcript you can search, edit and download. Free, unlimited and in more than 50 languages.',
  dropKind: 'audio',
  dropNoun: 'audio',
  record: true,

  whyTitle: 'When audio to text is worth it',
  why: [
    'Audio is the hardest media to skim. You cannot search it, scan it or quote it without listening again. A transcript lets you find the minute something was said, pull out exact quotes and read an hour-long conversation in a few minutes.',
    'Typical jobs are podcast show notes, interviews for journalism or research, oral history, voice notes, dictated drafts and recordings of lessons or talks. Only transcribe recordings you made or have permission to use.',
  ],

  howTitle: 'How to convert audio to text',
  howToDescription: 'Add an audio file or record one, choose the language, wait for the transcript and download it.',
  steps: [
    {
      title: 'Add your audio',
      text: 'Drop an audio file in the box at the top of this page, or press Choose a file. To record a new one, press Record with your microphone under the box.',
    },
    {
      title: 'Choose the language',
      text: 'Select the spoken language, or keep auto-detect. Standard is a good start for clear speech. Fastest is quick, Best accuracy takes longest and makes the fewest mistakes.',
    },
    {
      title: 'Wait for the text',
      text: 'Lines appear as they are recognised. Enhance audio, which is on by default, filters rumble and hiss and evens out quiet speakers.',
    },
    {
      title: 'Review and export',
      text: 'Play any line from its timestamp, correct mistakes, then download the transcript in the format you need.',
    },
  ],

  formatsTitle: 'Supported audio files and downloads',
  formatsIntro: 'The common audio formats work. Video files are accepted too, and only their sound is used.',
  uploadTitle: 'Audio files you can upload',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'clean text for notes and drafts' },
    { name: 'Markdown', use: 'text with times, ready for a notes app' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'SRT', use: 'timed lines for subtitles or captions' },
    { name: 'VTT', use: 'timed lines for web players' },
    { name: 'JSON', use: 'every line and time, for programs' },
  ],

  tipsTitle: 'Tips for accurate audio transcripts',
  tips: [
    {
      title: 'Get close to the microphone.',
      text: 'Echo and distance usually matter more than the file format. A quiet room and a nearby microphone beat any setting.',
    },
    {
      title: 'One voice at a time.',
      text: 'Overlapping speakers, music under speech and strong background noise cause most mistakes.',
    },
    {
      title: 'Upload the original.',
      text: 'Re-saving a recording as a smaller file removes detail. Use the original or best-quality copy you have.',
    },
    {
      title: 'Use a vocabulary hint.',
      text: 'Names, brands and technical terms are what recognisers get wrong most. List them in More options.',
    },
    {
      title: 'Ask before you record.',
      text: "Get permission before you record or transcribe other people's voices, and check local rules for call recording.",
    },
  ],

  faqs: [
    {
      question: 'Which audio formats can I convert to text?',
      answer:
        'MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. Video files such as MP4 and MKV also work, because only the sound is used.',
    },
    {
      question: 'Can I record audio directly on the page?',
      answer:
        'Yes, in browsers that allow microphone access. Press Record from microphone, allow access when asked, then stop. The recording is transcribed after you stop, not while you speak.',
    },
    {
      question: 'Does it work for an interview with two people?',
      answer:
        'Yes, the speech of both people is transcribed. Speaker names or labels are not added, but every line has a timestamp and you can type names into the text while editing.',
    },
    {
      question: 'How long can the audio be?',
      answer:
        '{limits} Longer or larger files are refused before they are processed, so split them first. There is no daily or monthly quota.',
      browser: {
        answer:
          'We set no limit: the audio is transcribed in your browser on your own device, so long recordings simply take longer and need enough free memory. The page warns you on a slower device. There is no daily or monthly quota.',
      },
    },
    {
      question: 'Is my audio stored?',
      answer:
        'Files are kept only for your session and deleted automatically when it ends, or right away when you press Delete my data now. There is no account.',
      browser: {
        answer:
          'Only in this browser: your audio never leaves your device. It is deleted automatically after a period of inactivity, or right away when you press Delete my data now. There is no account.',
      },
    },
  ],

  related: [
    '/mp3-to-text',
    '/wav-to-text',
    '/m4a-to-text',
    '/podcast-to-text',
    '/interview-transcription',
    '/whatsapp-voice-note-to-text',
  ],
};
