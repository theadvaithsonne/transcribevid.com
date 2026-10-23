import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'SRT subtitle generator',
  h1: 'Generate SRT subtitles from a video or audio file',
  lead: 'Upload a video and download a ready-to-use .srt file with every line timed to the speech. Free, no login, and you can fix the text before you export.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'What you get in an SRT file',
  why: [
    'An SRT file is plain text. It lists numbered cues, each with a start time, an end time and the words to show on screen. Most video players, editors and video platforms can load one, which makes it the safest subtitle format to start with.',
    'Subtitles help viewers who are deaf or hard of hearing, people watching without sound and anyone who follows a second language better in writing. They also make the speech in your video searchable and quotable.',
  ],

  howTitle: 'How to generate an SRT file',
  howToDescription: 'Upload a video, choose the language, check the lines and download the subtitles as an SRT or VTT file.',
  steps: [
    {
      title: 'Upload the video',
      text: 'Drop your video in the box at the top of this page, or press Choose a file. An audio file works too if you only need timed text.',
    },
    {
      title: 'Pick the language',
      text: 'Choose the spoken language. Word-level timing is on by default, which gives tighter subtitle timing.',
    },
    {
      title: 'Check the lines',
      text: 'Open the transcript, play from any timestamp and correct wrong words. Delete lines you do not want.',
    },
    {
      title: 'Download SRT or VTT',
      text: 'Choose SRT for most players and editors, or VTT for web pages. Both include your edits.',
    },
  ],

  formatsTitle: 'Subtitle formats and supported files',
  formatsIntro: 'Upload any video or audio file and download the subtitles as SRT or VTT. This is what an SRT file looks like inside:',
  uploadTitle: 'Files you can upload',
  accepts: ['MP4', 'MKV', 'MOV', 'WEBM', 'AVI', 'MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'SRT', use: 'numbered cues with times, the widest support' },
    { name: 'VTT', use: 'WebVTT for HTML5 video and web players' },
    { name: 'TXT', use: 'the same words without times' },
    { name: 'Markdown', use: 'text with timestamps' },
    { name: 'JSON', use: 'every line and time, for programs' },
    { name: 'PDF', use: 'a printable script' },
  ],
  exampleLabel: 'An example SRT file',
  example: `1
00:00:01,000 --> 00:00:04,200
Welcome back to the channel.

2
00:00:04,500 --> 00:00:07,800
Today we are looking at how subtitles work.`,

  tipsTitle: 'Tips for better subtitles',
  tips: [
    {
      title: 'Keep lines short.',
      text: 'A common guide is two lines of about 42 characters. Lines follow the speech, so very long ones may need splitting in a subtitle editor.',
    },
    {
      title: 'Watch before you publish.',
      text: 'Play the video with the subtitles on. Automatic subtitles need a human check, especially for names, numbers and jargon.',
    },
    {
      title: 'Use a vocabulary hint.',
      text: 'List names and technical terms in More options so they are spelled the way you want.',
    },
    {
      title: 'Pick the right format.',
      text: 'SRT for players, editors and most upload forms. VTT for the HTML5 video tag and web players.',
    },
    {
      title: 'Need English subtitles?',
      text: 'Set Output to Translate to English in More options. The translation is automatic, so read it through before you publish.',
    },
  ],

  faqs: [
    {
      question: 'What is an SRT file?',
      answer:
        'SubRip (.srt) is a plain-text subtitle format. Each cue has a number, a start and end time and the text to show. Any text editor can open it.',
    },
    {
      question: 'Should I choose SRT or VTT?',
      answer:
        'Use SRT for video players, editors and most upload forms. Use VTT (WebVTT) when you add subtitles to a web page with the HTML5 video element. TranscribeVid exports both from the same transcript.',
    },
    {
      question: 'Does it burn subtitles into my video?',
      answer:
        'No. You get a separate subtitle file and the video is not changed. Burning subtitles into the picture needs a video editor.',
    },
    {
      question: 'How accurate is the timing?',
      answer:
        'Timing follows the speech and is usually close, but it is not frame-perfect. Check the first and last lines, and adjust in a subtitle editor if you need exact sync.',
    },
    {
      question: 'Can I make subtitles in another language?',
      answer:
        'You can transcribe in the spoken language (more than 50 are supported) or translate speech into English. Translating into other languages is not offered.',
    },
  ],
};
