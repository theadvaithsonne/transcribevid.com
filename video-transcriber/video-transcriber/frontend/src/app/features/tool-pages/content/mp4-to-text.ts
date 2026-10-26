import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP4 to text',
  h1: 'Transcribe an MP4 video to text',
  lead: 'MP4 is the format of phone cameras, screen recorders and meeting exports. Upload yours and get a timestamped transcript, free and with no login.',
  dropKind: 'video',
  dropNoun: 'MP4',

  whyTitle: 'Why MP4 files are easy to transcribe',
  why: [
    'An MP4 is a container: it holds the picture and the sound together. TranscribeVid reads the sound and ignores the picture, so there is nothing to convert first and no need for a separate MP4 to MP3 step.',
    'It suits recordings that already come as MP4, such as phone videos, saved Zoom or Teams meetings, screen captures, webinars and lecture recordings. The result is text with a time on every line, ready to search or turn into subtitles.',
  ],

  howTitle: 'How to convert an MP4 to text',
  howToDescription: 'Upload the MP4, choose the spoken language and quality, wait for the transcript and download it.',
  steps: [
    {
      title: 'Find the MP4',
      text: 'Locate the .mp4 file on your phone or computer. You do not need to compress or trim it unless it is over the limit.',
      browser: { text: 'Locate the .mp4 file on your phone or computer. You do not need to compress or trim it first.' },
    },
    {
      title: 'Upload it',
      text: 'Drop the MP4 in the box at the top of this page, or press Choose a file. In the uploader, several MP4 files can be queued at once.',
      browser: {
        title: 'Add it',
        text: 'Drop the MP4 in the box at the top of this page, or press Choose a file. In the uploader you can add several MP4 files; they are transcribed one after another.',
      },
    },
    {
      title: 'Pick language and quality',
      text: 'Choose the spoken language. Standard is recommended. High accuracy and Best accuracy are slower and make fewer mistakes, and Fastest is quick for clear speech.',
    },
    {
      title: 'Download the result',
      text: 'Get TXT to read, SRT or VTT to use as subtitles with the same MP4, or a PDF to print.',
    },
  ],

  formatsTitle: 'MP4 and other video formats',
  formatsIntro: 'MP4 is the common case, but the same upload accepts these video types and the usual audio formats too.',
  uploadTitle: 'Video files you can upload',
  accepts: ['MP4', 'M4V', 'MOV', 'MKV', 'WEBM', 'AVI', 'WMV', 'FLV', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'the spoken words as plain text' },
    { name: 'SRT', use: 'a subtitle file for the same MP4' },
    { name: 'VTT', use: 'subtitles for a web page' },
    { name: 'PDF', use: 'a transcript to print or share' },
    { name: 'Markdown', use: 'notes with times' },
    { name: 'JSON', use: 'data for your own tools' },
  ],

  tipsTitle: 'Tips for transcribing MP4 files',
  tips: [
    {
      title: 'Check there is sound.',
      text: 'A screen recording made without audio has no speech to transcribe and gives an empty result.',
    },
    {
      title: 'Mind the wind and the room.',
      text: 'Phone videos suffer from wind, distance and echo. Hold the phone closer, or add an external microphone next time.',
    },
    {
      title: 'Shrink big files by exporting the audio.',
      text: 'If an MP4 is over the limit, export just the audio (M4A or MP3) from your editor. It is far smaller and works the same.',
      browser: {
        text: 'A very long MP4 needs a lot of memory on a phone. Export just the audio (M4A or MP3) from your editor: it is far smaller and works the same.',
      },
    },
    {
      title: 'Keep the SRT next to the video.',
      text: 'Many players load an .srt file automatically when it has the same name as the video.',
    },
    {
      title: 'Check names and numbers.',
      text: 'Automatic transcripts get these wrong most often. Search and replace fixes repeats in one go.',
    },
  ],

  faqs: [
    {
      question: 'Do I need to convert MP4 to MP3 first?',
      answer: 'No. Upload the MP4 as it is. The sound is read from the file for you.',
    },
    {
      question: 'Why was my MP4 refused?',
      answer:
        'Files over the size or length limit are refused before processing. {limits} Cut the video into parts, or export only its audio, then upload again.',
      browser: {
        question: 'Why did my MP4 not work?',
        answer:
          'Your browser could not read its sound: the file may be damaged, have no sound track, or use a rare audio format. Export the audio as M4A or MP3 from your editor and add that file instead. There is no size or length limit, but very long videos need enough free memory.',
      },
    },
    {
      question: 'Can I add subtitles to my MP4 with this?',
      answer:
        'You get a subtitle file (SRT or VTT) timed to the speech. TranscribeVid does not edit or re-encode your MP4, so burning subtitles into the picture needs a video editor.',
    },
    {
      question: 'Can I paste a link instead of uploading?',
      answer:
        'No. TranscribeVid works with files you upload or record, not web links. If the video is your own, upload the original file.',
    },
    {
      question: 'Does it work with Zoom, Teams and phone videos?',
      answer:
        'Yes, any MP4 with speech works. Speaker names are not added to meetings, but the lines are timestamped so you can add names while editing.',
    },
  ],
};
