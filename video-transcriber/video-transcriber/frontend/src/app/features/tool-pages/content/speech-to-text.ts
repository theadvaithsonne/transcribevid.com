import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Speech to text',
  h1: 'Speech to text from any recording',
  lead: 'Turn speech into written text: add a recording or a video and get a timestamped transcript in more than 50 languages, free, with no login and no daily limit.',
  dropKind: 'video',
  dropNoun: 'recording',
  record: true,

  whyTitle: 'Speech to text from a file, not live dictation',
  why: [
    'There are two kinds of speech-to-text. Dictation types while you talk and is built into phones and computers. Transcription takes a finished recording and writes it out with punctuation and timestamps. This page does the second kind, and it does it better for long or messy audio, because it works on the finished recording: it can skip the silence and music first, use what was said before as context, and take the time a bigger model needs.',
    'Use it for a voice memo, a meeting, a lecture, an interview, a video or a podcast episode. The transcript can be edited line by line and downloaded as plain text, as subtitles (SRT and VTT) or as a PDF.',
  ],
  browserWhy: [
    'There are two kinds of speech-to-text. Dictation types while you talk and is built into phones and computers. Transcription takes a finished recording and writes it out with punctuation and timestamps. This page does the second kind, and it does it better for long or messy audio, because it works on the finished recording: it can skip the silence and music first, use what was said before as context, and take the time a bigger model needs.',
    'Use it for a voice memo, a meeting, a lecture, an interview, a video or a podcast episode. The recording is read on your own device and is never uploaded, so it works for private material too. The transcript can be edited line by line and downloaded as plain text, as subtitles (SRT and VTT) or as a PDF.',
  ],

  sections: [
    {
      title: 'How to get your speech into a file',
      paragraphs: ['If you only have the idea so far, these are the quickest ways to make a recording to convert.'],
      bullets: [
        {
          title: 'Record it on your phone.',
          text: 'Voice Memos on iPhone and the recorder app on Android (Recorder on Pixel phones, Voice Recorder on Samsung) save a file you can add here as it is. Hold the phone close and keep the room quiet; distance from the microphone costs more accuracy than anything else.',
        },
        {
          title: 'Record on the computer.',
          text: 'Press Record with your microphone under the box above: it takes you to the recorder on the home page. Any recorder app that saves MP3, WAV or M4A works as well.',
        },
        {
          title: 'Use a video you already have.',
          text: 'You do not need to extract the sound. Add the video file and only its sound is used.',
        },
      ],
    },
  ],

  howTitle: 'How to convert speech to text',
  howToDescription: 'Add the recording, choose the spoken language and a quality level, wait for the transcript, then edit and download it.',
  steps: [
    {
      title: 'Add or record',
      text: 'Drop an audio or video file in the box at the top of this page, or press Choose a file. To record instead, press Record with your microphone under the box, then Record from microphone, and allow access when your browser asks.',
    },
    {
      title: 'Choose the language',
      text: 'Pick the language that is spoken, or keep auto-detect for a recording in a single language. Pick it by hand if the recording mixes languages.',
    },
    {
      title: 'Pick a quality',
      text: 'Fastest gives a quick draft. Standard suits clear speech. High accuracy and Best accuracy take longer and make fewer mistakes on accents, noise and several speakers.',
    },
    {
      title: 'Edit and download',
      text: 'Fix any line in the transcript, then download TXT, SRT, VTT, PDF, Markdown or JSON.',
    },
  ],

  formatsTitle: 'Recordings and downloads',
  formatsIntro: 'Almost any audio or video file works. The sound of a video is used and the picture is ignored.',
  uploadTitle: 'Files you can add',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS', 'MP4', 'MOV', 'WEBM', 'MKV'],
  downloads: [
    { name: 'TXT', use: 'the words as plain text' },
    { name: 'SRT', use: 'timed subtitle lines' },
    { name: 'VTT', use: 'timed lines for web players' },
    { name: 'PDF', use: 'a printable copy' },
    { name: 'Markdown', use: 'notes with times' },
    { name: 'JSON', use: 'words with times for your own tools' },
  ],

  tipsTitle: 'Tips for better speech to text',
  tips: [
    {
      title: 'Closer is better.',
      text: 'A phone held 20 cm from the speaker beats a better microphone across the room. Most mistakes come from distance and echo, not from the software.',
    },
    {
      title: 'Choose the language by hand.',
      text: 'Auto-detect listens to the first seconds. If a recording starts with music or a greeting in another language, choosing the language yourself avoids a wrong guess.',
    },
    {
      title: 'Add names to the vocabulary hint.',
      text: 'In More options, type people, product and place names the way they are spelled. The model then prefers those spellings.',
    },
    {
      title: 'Leave Skip silence & music on.',
      text: 'It is on by default in More options and stops long pauses and background music from turning into made-up words.',
    },
    {
      title: 'Speak normally.',
      text: 'You do not need to say "comma" or "full stop". Punctuation and capital letters are added for you.',
    },
  ],

  faqs: [
    {
      question: 'Can I dictate live and watch the words appear?',
      answer:
        'No. This page transcribes a recording after it is finished. For live typing, use the voice typing built into your phone or computer, and use this page when you want an accurate, editable transcript of a whole recording.',
    },
    {
      question: 'How accurate is the transcript?',
      answer:
        'On clear speech in a major language, the best quality level gets most sentences right with only a few wrong words. Noise, echo, strong accents and several people talking at once all lower it. Reading it through once and fixing the odd word is usually quick.',
    },
    {
      question: 'Which languages are supported?',
      answer:
        'More than 50, including English, Spanish, French, German, Portuguese, Hindi, Arabic, Japanese, Korean, Turkish and Indonesian. Set Output to Translate to English to get English text from speech in another language.',
    },
    {
      question: 'Is there a time limit or a daily limit?',
      answer: 'There is no daily or monthly quota and you do not need an account. {limits}',
      browser: {
        answer:
          'No. There is no quota and no account, and we set no length limit. The work is done by your own device, so a very long recording needs enough free memory and some patience.',
      },
    },
    {
      question: 'Is my recording kept?',
      answer: 'Only for your session. It is deleted automatically when the session ends, or when you press Delete my data now.',
      browser: {
        answer:
          'Only in this browser: the recording never leaves your device. It is deleted after a period of inactivity, or when you press Delete my data now.',
      },
    },
  ],

  related: ['/audio-to-text', '/voice-recording-to-text', '/video-to-text', '/mp3-to-text', '/whisper-online'],
  links: [
    {
      label: 'Audio to text',
      path: '/audio-to-text',
      note: 'The same transcription, written for audio files such as MP3, WAV and M4A.',
    },
    {
      label: 'Voice recording to text',
      path: '/voice-recording-to-text',
      note: 'Tips for voice memos and recordings made on a phone.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'What to change about the recording, the language and the settings when the first result is not good enough.',
    },
  ],
};
