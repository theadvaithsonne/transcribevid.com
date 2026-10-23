import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Video to text',
  h1: 'Convert video to text, free and with timestamps',
  lead: 'Upload a recorded video and watch its speech turn into text, line by line, each line with its time. Lectures, interviews, meetings, phone clips and screen recordings all work, in more than 50 languages.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Why turn a video into text',
  why: [
    'Video is slow to search. You cannot skim it, quote it or copy a sentence out of it. A transcript turns the speech into text you can search, quote, translate and read in a fraction of the time, and every line keeps its timestamp so you can jump back to the exact moment.',
    'People use it for recorded lectures and webinars, interview footage, saved team meetings, product demos, vlogs and short social clips. The text is also a good starting point for captions, show notes, blog posts and meeting minutes.',
  ],

  howTitle: 'How to convert a video to text',
  howToDescription:
    'Upload a video file, pick the spoken language, wait for the transcript and download it as text or subtitles.',
  steps: [
    {
      title: 'Choose your video',
      text: 'Drop the video in the box at the top of this page, or press Choose a file. It opens in the uploader, where you can add more videos.',
    },
    {
      title: 'Set language and quality',
      text: 'Pick the spoken language for the best accuracy, or leave auto-detect on. Standard suits most videos. Fastest is quick for clear speech. For noisy or difficult audio pick High accuracy or Best accuracy; Best accuracy takes longest and makes the fewest mistakes.',
    },
    {
      title: 'Watch it transcribe',
      text: 'The text appears live, line by line, with a progress bar and an estimate of the time left.',
    },
    {
      title: 'Edit and download',
      text: 'Fix any line in the editor, then download TXT, SRT, VTT, Markdown, JSON or PDF. Nothing is kept after your session, so download before you leave.',
    },
  ],

  formatsTitle: 'Supported video files and downloads',
  formatsIntro: 'TranscribeVid reads the sound track, so the picture can be any quality. Audio-only files work too.',
  uploadTitle: 'Video files you can upload',
  accepts: ['MP4', 'MKV', 'MOV', 'AVI', 'WEBM', 'WMV', 'FLV', 'M4V', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'plain text to read or paste' },
    { name: 'SRT', use: 'subtitles for players and editors' },
    { name: 'VTT', use: 'subtitles for web video' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'timed lines for programs' },
    { name: 'PDF', use: 'a printable copy' },
  ],

  tipsTitle: 'Tips for better video transcripts',
  tips: [
    {
      title: 'Play the first minute first.',
      text: 'If you struggle to follow the speech on laptop speakers, the software will too. Fix volume problems before you upload.',
    },
    {
      title: 'Name the language.',
      text: 'Choosing the spoken language is more reliable than auto-detect, especially for short or accented clips.',
    },
    {
      title: 'Add a vocabulary hint.',
      text: 'In More options, list names, brands and jargon the way you want them spelled.',
    },
    {
      title: 'Stay under the limit.',
      text: 'Videos longer or larger than the limit above are refused, so cut long recordings into parts first.',
    },
    {
      title: 'Check the marked lines.',
      text: 'Lines the recogniser is unsure about are marked. Review those first, because no transcript is perfect.',
    },
  ],

  faqs: [
    {
      question: 'Is converting video to text really free?',
      answer:
        'Yes. It is free, there is no account or login, and there is no daily or monthly quota. {limits} If many people are using the service, your file may wait in a queue for a while.',
    },
    {
      question: 'Can I transcribe a video without speech?',
      answer:
        'Only speech becomes text. A silent video, or one with only music, gives an empty or very short result. Text shown on screen is not read.',
    },
    {
      question: 'Can I paste a YouTube link?',
      answer:
        'No. TranscribeVid works with files you upload or record, not web links. If the video is your own, upload the original file.',
    },
    {
      question: 'Does it say who is speaking?',
      answer:
        'No. Speaker names or labels are not added. Every line has a timestamp, and you can type names into the text while you edit.',
    },
    {
      question: 'How accurate is video to text?',
      answer:
        'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Noise, accents, music and overlapping voices lower accuracy, so check important passages against the video.',
    },
  ],
};
