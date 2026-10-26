import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'YouTube subtitle generator',
  h1: 'Create subtitles for your own YouTube video',
  lead: 'Add the video file you made for YouTube, get an SRT file timed to the speech and upload it in YouTube Studio. Free, no login, and you check every line before you publish.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Why upload your own subtitle file',
  why: [
    'YouTube makes automatic captions for many videos, but they are not always right, and they do not appear until YouTube has finished processing the video. A subtitle file of your own lets you check and correct every line, with your names, products and terms spelled the way you write them.',
    'This page is for videos you made yourself. It works from the video file on your computer, not from a YouTube link: pasting a link is not supported. If the video is yours, you already have the original from your camera or editor. TranscribeVid is an independent tool and is not connected to YouTube: it never signs in to your channel, so you add the finished file there yourself.',
  ],

  sections: [
    {
      title: 'Adding the SRT file in YouTube Studio',
      paragraphs: [
        'Menu names in YouTube Studio change from time to time, so treat these steps as a guide and follow the labels you see on screen.',
      ],
      bullets: [
        {
          title: 'Open Subtitles.',
          text: 'Sign in to your channel, open YouTube Studio and choose Subtitles from the menu on the left.',
        },
        {
          title: 'Pick the video.',
          text: 'Choose the video you want to caption. If YouTube asks for the language of the video, set it first.',
        },
        {
          title: 'Add the language.',
          text: 'Choose Add language, pick the language of the file, then choose Add under Subtitles.',
        },
        {
          title: 'Upload the file.',
          text: 'Choose Upload file, then With timing, and pick the .srt file you downloaded. Check the lines in the preview, then Publish.',
        },
      ],
    },
    {
      title: 'English subtitles from another language',
      paragraphs: [
        'If the video is spoken in another language, set Output to Translate to English in More options before you start. You get English text timed to the speech, which you can upload as an English subtitle track. Translation is machine work, so read the English through before it goes live.',
        'TranscribeVid does not translate into languages other than English. For each other language you have a file for, add a separate track in YouTube Studio.',
      ],
    },
    {
      title: 'Why subtitles are worth the effort',
      paragraphs: [
        'People watch in places where they cannot turn the sound up, and many follow a second language better in writing than by ear. Subtitles also help viewers who are deaf or hard of hearing, and they put your spoken words into text that can be searched and quoted.',
      ],
    },
  ],

  howTitle: 'How to make subtitles for a YouTube video',
  howToDescription:
    'Add the video file, choose the spoken language, check the lines, download an SRT file and upload it in YouTube Studio.',
  steps: [
    {
      title: 'Add your video file',
      text: 'Choose the video file you uploaded to YouTube, not a link to it: drop it on the box at the top of this page or press Choose a file. For a second video, use Add another file on the next page.',
    },
    {
      title: 'Pick the language',
      text: 'On the next page, choose the spoken language, or leave Detect automatically on. Keep Word-level timing on in More options, so each line starts and ends with the words. Then press Transcribe.',
    },
    {
      title: 'Check the lines',
      text: 'Open the transcript, play from any timestamp and correct wrong words, names and numbers. Delete lines you do not want shown.',
    },
    {
      title: 'Download SRT and upload it',
      text: 'Download the SRT file, then add it to the video in YouTube Studio as described above.',
    },
  ],

  formatsTitle: 'Video files and subtitle files',
  formatsIntro:
    'Add the video file you made for YouTube, in any of these types, and download the subtitles in the format you need.',
  uploadTitle: 'Video files you can add',
  accepts: ['MP4', 'MOV', 'M4V', 'WEBM', 'MKV', '3GP'],
  downloads: [
    { name: 'SRT', use: 'the subtitle file YouTube Studio asks for' },
    { name: 'VTT', use: 'WebVTT, for web players' },
    { name: 'TXT', use: 'a transcript for your description or a blog post' },
    { name: 'Markdown', use: 'text with timestamps' },
    { name: 'JSON', use: 'every line and time, for programs' },
    { name: 'PDF', use: 'a printable script' },
  ],

  tipsTitle: 'Tips for YouTube subtitles',
  tips: [
    {
      title: 'Use the final cut.',
      text: 'Make the file from the exact video you upload, not from an earlier draft. Every edit that moves the speech also moves the timing.',
    },
    {
      title: 'Keep word-level timing on.',
      text: 'It is on by default and gives tighter subtitle timing than timing whole sentences.',
    },
    {
      title: 'Fix names before you publish.',
      text: 'Automatic text gets channel names, products and numbers wrong most often. A vocabulary hint helps, and a read-through catches the rest.',
    },
    {
      title: 'Read it with the sound off.',
      text: 'Watch the video muted with the subtitles on. You will see at once which lines vanish too quickly to read.',
    },
  ],

  faqs: [
    {
      question: 'Can I make subtitles for a YouTube video I did not upload?',
      answer:
        'No. This tool works only with files, not links, and it is meant for videos you made or have the right to use. For your own videos, use the original file from your camera or editor.',
    },
    {
      question: 'Which file does YouTube Studio want, SRT or VTT?',
      answer:
        'SRT is the safest choice: it is a widely used format that YouTube Studio reads. Upload it with timing, so the lines match the speech.',
    },
    {
      question: 'Do I need to log in to make the subtitle file?',
      answer:
        'No. You need no account here. You only need your YouTube channel to upload the file in YouTube Studio.',
    },
    {
      question: 'How do I get English subtitles for a video in Spanish or Hindi?',
      answer:
        'Set Output to Translate to English in More options before you start. The transcript comes out in English with times. The translation is automatic and can contain mistakes, so read it before you publish it as an English track.',
    },
    {
      question: 'Why are my subtitles out of sync on YouTube?',
      answer:
        'Most often the file was made from a different version of the video, for example before the start was trimmed. Make the file again from the exact video you uploaded. Timing is close but not frame-perfect, so a final check in YouTube Studio helps.',
    },
  ],

  links: [
    {
      label: 'SRT subtitle generator',
      path: '/srt-subtitle-generator',
      note: 'What an SRT file looks like inside, and how to fix lines before you export.',
    },
    {
      label: 'How to add subtitles to a video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Other places to use the file: media players, editors and your own web page.',
    },
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: 'English text from speech in another language, and what to check afterwards.',
    },
    {
      label: 'SRT vs VTT: which subtitle format to use',
      path: '/guides/srt-vs-vtt',
      note: 'How the two common subtitle formats differ.',
    },
  ],
};
