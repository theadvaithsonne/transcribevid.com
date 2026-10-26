import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Subtitles for Reels',
  h1: 'Subtitles for Reels and Shorts, free and without a watermark',
  lead: 'Make a subtitle file for an Instagram Reel, a YouTube Short or any short vertical video, in Hindi, Hinglish, English or 50+ other languages. You get SRT or VTT to add in your editor, with no watermark and no login.',
  dropKind: 'video',
  dropNoun: 'Reel or Short',

  whyTitle: 'Captions for short videos',
  why: [
    'Many people watch short videos with the sound off, so captions decide whether they follow what you say. The automatic captions inside the apps are quick, but they do not always handle Hindi, Hinglish or names well, and you cannot reuse them anywhere else.',
    'Here you get a subtitle file that you own. Fix the words once, then use the same SRT for a Reel, a Short, a YouTube upload and a Facebook post. Nothing is drawn on your video, so there is no watermark: you add the captions in your editor, in the style you like.',
  ],

  howTitle: 'How to make subtitles for a Reel',
  howToDescription: 'Add the video, choose the language and style, check the lines, download SRT or VTT and add it in your editor or on YouTube.',
  steps: [
    {
      title: 'Add the video',
      text: 'Drop the exported Reel, or the original clip, in the box at the top of this page.',
    },
    {
      title: 'Pick language and style',
      text: 'Choose the spoken language. For Hindi speech, set Transcript style to Hinglish if your viewers read Roman letters. Keep Word-level timing on in More options, so captions start and end with the words.',
    },
    {
      title: 'Fix the lines',
      text: 'Read every line and correct names, slang and brand names. On a 30-second video that takes about a minute.',
    },
    {
      title: 'Download and add',
      text: 'Download SRT, or VTT for web players. Import it in your video editor and burn it into the picture, or upload it as subtitles in YouTube Studio.',
    },
  ],

  formatsTitle: 'Video files and subtitle files',
  formatsIntro: 'Export your edit as MP4 or MOV and add it here. The subtitles come back as plain text files with times, like this Hinglish example.',
  exampleLabel: 'An example SRT file for a Hinglish Reel',
  example: `1
00:00:00,400 --> 00:00:02,100
aaj main aapko dikhata hoon

2
00:00:02,100 --> 00:00:04,300
ek simple chai recipe.`,
  uploadTitle: 'Video files you can add',
  accepts: ['MP4', 'MOV', 'WEBM', 'MKV', 'M4A', 'MP3'],
  downloads: [
    { name: 'SRT', use: 'for most video editors and for YouTube' },
    { name: 'VTT', use: 'for web players and some editors' },
    { name: 'TXT', use: 'the words, for your caption or description' },
    { name: 'JSON', use: 'word times, for custom caption tools' },
  ],

  tipsTitle: 'Tips for captions on short videos',
  tips: [
    {
      title: 'Burn them in for Reels.',
      text: 'Most short-video apps do not let you attach a subtitle file, so for a Reel the captions need to be part of the picture. Import the SRT in a desktop editor such as DaVinci Resolve or Premiere Pro, style it, and export the video.',
    },
    {
      title: 'Upload the file for YouTube.',
      text: 'On YouTube you can upload the SRT or VTT in YouTube Studio under Subtitles, so viewers can switch the captions on or off.',
    },
    {
      title: 'Keep lines short.',
      text: 'Vertical video is narrow. Split long lines in your editor so each caption has two short lines at most.',
    },
    {
      title: 'Check the first second.',
      text: 'Captions that start before the speech look sloppy. Play the start and the end, and nudge the timing in your editor if needed.',
    },
    {
      title: 'Music under the voice.',
      text: 'Loud music lowers accuracy. If you have the voice-over without music, transcribe that track instead.',
    },
  ],

  faqs: [
    {
      question: 'Will my video have a watermark?',
      answer: 'No. Your video is not changed at all. You get a separate subtitle file, and the captions look however your editor draws them.',
    },
    {
      question: 'How do I put the captions on an Instagram Reel?',
      answer:
        'Import the SRT in your video editor, place and style the captions, and export the video with them burned in. Then post that video. TranscribeVid does not burn captions in itself.',
    },
    {
      question: 'Which language should I choose for a Hindi-English Reel?',
      answer:
        'Choose Hindi and set Transcript style to Hinglish. Hindi words come out in Roman letters and English words stay English, which is how most viewers read Hinglish captions. Choose Original script for Devanagari captions.',
    },
    {
      question: 'Can I get English captions for a Hindi Reel?',
      answer: 'Yes. Set Output to Translate to English in More options. Check the English carefully: short, punchy lines are hard to translate well.',
    },
    {
      question: 'Can I make captions on my phone?',
      answer:
        'Yes. Open this page in your phone browser, choose the video from your gallery and download the SRT when it is ready. A desktop editor is still the easiest way to burn captions in.',
      browser: {
        answer:
          'Yes. Open this page in your phone browser and choose the video from your gallery. The phone does the work itself, so short clips suit it best and Fastest is the quickest choice. A desktop editor is still the easiest way to burn captions in.',
      },
    },
  ],

  related: [
    '/srt-subtitle-generator',
    '/hinglish-transcription',
    '/mp4-to-text',
    '/translate-hindi-audio-to-english',
    '/video-to-text',
  ],
};
