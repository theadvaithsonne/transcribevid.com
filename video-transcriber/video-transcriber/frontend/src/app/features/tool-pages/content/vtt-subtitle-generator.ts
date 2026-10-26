import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'VTT subtitle generator',
  h1: 'Generate a WebVTT (.vtt) subtitle file from a video',
  lead: 'Add a video or audio file and download a WebVTT subtitle file timed to the speech. Free, no login, and you can fix the lines before you export. Use it with the HTML5 video element or any web player.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'What WebVTT is, and why the web uses it',
  why: [
    'WebVTT (.vtt) is the subtitle format of the web. It is a plain-text file that browsers understand natively: point the track element of a video at a .vtt file and the captions appear, with no plugin and no script.',
    'It looks much like SRT, with a few differences that matter. A VTT file starts with the word WEBVTT, uses a dot instead of a comma before the milliseconds and does not need numbered cues. Most web players read it. If you are not sure which format you need, the guide on SRT and VTT explains the choice.',
  ],

  sections: [
    {
      title: 'How to use a VTT file on your web page',
      paragraphs: [
        'Save the .vtt file next to your video, then add a track element inside the video element, for example: <track kind="subtitles" src="captions.vtt" srclang="en" label="English" default>. The attributes do the following.',
      ],
      bullets: [
        {
          title: 'kind.',
          text: 'Use subtitles for the words that are spoken. Use captions when the file also describes other sounds, such as music or laughter.',
        },
        {
          title: 'srclang.',
          text: 'The language of the file as a short code, for example en for English or es for Spanish. Add one track element for each language you have.',
        },
        {
          title: 'label and default.',
          text: 'label is the name shown in the captions menu of the player. default turns that track on when the page loads.',
        },
      ],
    },
    {
      title: 'Why the captions do not show: the usual causes',
      paragraphs: [
        'Keep the .vtt file on the same site as the page. A file on another domain needs the right cross-origin headers from its server, and the video element needs a crossorigin attribute, or the browser silently ignores it. Check also that the first line of the file reads WEBVTT, and that the captions are switched on in the player controls.',
      ],
    },
    {
      title: 'What this generator does and does not do',
      paragraphs: [
        'It turns the speech in your video into timed text. Lines are cut at sentence ends and pauses, in lines of about 42 characters with two lines at most, and the file contains timed text only. It does not translate into other languages (except English, through Output in More options), add speaker names, create styling or chapter markers, or burn the subtitles into the picture. WebVTT itself supports styling and chapters, and you can add them by hand in a text editor.',
      ],
    },
  ],

  howTitle: 'How to generate a VTT subtitle file',
  howToDescription:
    'Add a video, choose the language, check the lines and download the subtitles as a WebVTT file.',
  steps: [
    {
      title: 'Add your video',
      text: 'Put one video in the box at the top of this page: drop it there or press Choose a file. A sound-only file works as well, if timed text is all you need. On the next page, Add another file brings in more.',
    },
    {
      title: 'Choose the language',
      text: 'On the next page, pick the spoken language, or leave Detect automatically on. Keep Word-level timing on in More options: the start and end of every line then follow the words. Then press Transcribe.',
    },
    {
      title: 'Check the lines',
      text: 'Read through the transcript, play from a timestamp to check it and fix any wrong words. Delete the lines you do not want in the subtitles.',
    },
    {
      title: 'Download VTT',
      text: 'Choose VTT from the download options. Your edits are included. SRT is available from the same transcript if a player needs it.',
    },
  ],

  formatsTitle: 'The VTT format and supported files',
  formatsIntro:
    'Add any video or audio file and download WebVTT. This is what a VTT file looks like inside:',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'WEBM', 'MOV', 'MKV', 'M4V', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'VTT', use: 'WebVTT for the HTML5 video element and web players' },
    { name: 'SRT', use: 'numbered cues, for most players and editors' },
    { name: 'TXT', use: 'the same words without times' },
    { name: 'Markdown', use: 'text with timestamps' },
    { name: 'JSON', use: 'every line and time, for programs' },
    { name: 'PDF', use: 'a printable script' },
  ],
  exampleLabel: 'An example WebVTT file',
  example: `WEBVTT

00:00:00.800 --> 00:00:03.600
Good morning, everyone, and welcome.

00:00:04.000 --> 00:00:07.300
In this video we set up the project from scratch.

00:00:07.700 --> 00:00:10.900
Let's start with the folder structure.`,

  tipsTitle: 'Tips for WebVTT files',
  tips: [
    {
      title: 'Test it in a real browser.',
      text: 'Open your page, press play and turn the captions on in the video controls. Do this in more than one browser before you publish.',
    },
    {
      title: 'Use the right language code.',
      text: 'Set srclang to a valid code such as en, es or hi. A wrong code can make the player label or choose the track wrongly.',
    },
    {
      title: 'Read the lines at speed.',
      text: 'Play the video with the sound off and the captions on, and check that each line stays on screen long enough to read.',
    },
    {
      title: 'Spell names the way you want them.',
      text: 'Put brand names and technical terms in the vocabulary hint in More options before you start, so they come out right in every line.',
    },
  ],

  faqs: [
    {
      question: 'How is a VTT file different from an SRT file?',
      answer:
        'A VTT file starts with the line WEBVTT, writes times with a dot (00:00:01.000) where SRT uses a comma (00:00:01,000), and does not need cue numbers. Browsers read VTT in the video element, while SRT needs a player or script that supports it.',
    },
    {
      question: 'How do I add a VTT file to an HTML video?',
      answer:
        'Save the .vtt file next to the video and add a track element inside the video element, with kind set to subtitles, src pointing at the file, srclang set to the language code and a label for the menu.',
    },
    {
      question: 'Which players read VTT files?',
      answer:
        'All the major browsers read VTT through the video element, and most web video players read it too. Some desktop players and editors prefer SRT. For those, download SRT from the same transcript.',
    },
    {
      question: 'Can the VTT file include chapters or styling?',
      answer:
        'The file TranscribeVid makes contains timed text only. WebVTT itself supports styling and chapters, which you can add by hand in a text editor.',
    },
    {
      question: 'Why does my VTT file not show up in the player?',
      answer:
        'Common causes are a first line that is not WEBVTT, a file on another domain without the right cross-origin headers, a wrong srclang or kind, or captions that are switched off in the player. Open the file in a text editor and check the first line.',
    },
  ],

  links: [
    {
      label: 'SRT subtitle generator',
      path: '/srt-subtitle-generator',
      note: 'The same transcript as a numbered SRT file, with a worked example.',
    },
    {
      label: 'SRT vs VTT: which subtitle format to use',
      path: '/guides/srt-vs-vtt',
      note: 'A side-by-side look at the two formats and where each one works.',
    },
    {
      label: 'How to add subtitles to a video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'From transcript to published captions, for the web and for other players.',
    },
    {
      label: 'WebM to text',
      path: '/webm-to-text',
      note: 'For screen and browser recordings, the format that suits a VTT file best.',
    },
  ],
};
