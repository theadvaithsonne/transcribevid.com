import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WebM to text',
  h1: 'Transcribe a WebM recording to text',
  lead: 'WebM is the format browsers and screen recorders save. Add your WebM video or audio and get a timestamped transcript, free, with no login and no conversion first.',
  dropKind: 'video',
  dropNoun: 'WebM',

  whyTitle: 'What is inside a WebM file',
  why: [
    'WebM is a web-friendly container. It usually holds VP8, VP9 or AV1 video with Opus or Vorbis sound. TranscribeVid reads only the sound, so it does not matter which video codec is inside, and a WebM that holds audio only works just as well.',
    'Opus, the sound format most WebM files use, was designed for voice, which makes these recordings a good source for a transcript. The result is text with a time on every line, ready to search, quote or turn into subtitles.',
  ],

  sections: [
    {
      title: 'Where WebM files come from',
      paragraphs: [
        'Most WebM files are made by the browser itself, which is why they turn up whenever someone records something online.',
      ],
      bullets: [
        {
          title: 'Screen and browser recorders.',
          text: 'Many screen-recording extensions and web recorders save WebM, because it is the format a browser can record directly.',
        },
        {
          title: 'Online voice recorders.',
          text: 'A website that records your microphone often gives you a .webm audio file. It may look like a video file, but it contains only sound.',
        },
        {
          title: 'Web apps you build or test.',
          text: 'Pages that record with the MediaRecorder feature of the browser usually produce WebM in Chrome. Firefox does the same for video, but its sound-only recordings are often Ogg, which this page reads too.',
        },
      ],
    },
    {
      title: 'A quirk of recorded WebM files',
      paragraphs: [
        'A WebM recorded live in the browser often has no total length written in the file. Some players then show an unknown duration or cannot skip ahead, which can look like a damaged file. The sound itself is intact, and the transcript is made from it as normal.',
        'If a recording does fail, the cause is usually simpler: the microphone was off, so there is no speech in it at all. Play the file with the volume up before you look for another reason.',
      ],
    },
  ],

  howTitle: 'How to convert a WebM to text',
  howToDescription:
    'Add the WebM file, choose the spoken language, check the lines and download the transcript as text or WebVTT subtitles.',
  steps: [
    {
      title: 'Add the WebM',
      text: 'Drop the .webm onto the box at the top of this page, or press Choose a file. A WebM that holds sound only goes in the same way. For several recordings, add the first here and the others with Add another file on the next page.',
    },
    {
      title: 'Pick the language',
      text: 'On the next page, choose the spoken language, or keep Detect automatically for a recording in one language. Standard quality suits clear speech from a good microphone. Then press Transcribe.',
    },
    {
      title: 'Check the lines',
      text: 'Watch the text arrive line by line. Open the transcript, play from any timestamp and fix the words that are wrong.',
    },
    {
      title: 'Download the result',
      text: 'Get TXT to read or search. A WebM belongs on the web, so VTT is the natural subtitle file for it. SRT and PDF are there too.',
    },
  ],

  formatsTitle: 'WebM and other video formats',
  formatsIntro: 'WebM is one of many video and audio types this box takes.',
  uploadTitle: 'Files you can add',
  accepts: ['WEBM', 'MP4', 'MKV', 'MOV', 'OGG', 'OPUS', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'TXT', use: 'the spoken words as plain text' },
    { name: 'VTT', use: 'subtitles for the same WebM on a web page' },
    { name: 'SRT', use: 'subtitles for players and editors' },
    { name: 'Markdown', use: 'notes with times' },
    { name: 'JSON', use: 'every line and time, for programs' },
    { name: 'PDF', use: 'a transcript to print or share' },
  ],

  tipsTitle: 'Tips for transcribing WebM recordings',
  tips: [
    {
      title: 'Switch the microphone on before you record.',
      text: 'Screen recorders often capture only the picture unless you tick the microphone or system audio option. Without sound there is nothing to transcribe.',
    },
    {
      title: 'Expect one voice track.',
      text: 'If you recorded a meeting tab together with your own microphone, everyone ends up in the same track. There are no speaker labels, so add names while you edit.',
    },
    {
      title: 'Use VTT for the web.',
      text: 'The video element of a browser reads VTT subtitles through the track element. It does not read SRT, so choose VTT for a WebM on your own page.',
    },
    {
      title: 'Cut very long recordings.',
      text: 'Files over the size or length limit are refused, so cut a long WebM into parts first.',
      browser: {
        title: 'Long recordings take longer.',
        text: 'The site sets no size or length limit. A long screen capture still needs time and free memory, and an older browser may refuse a very long file, so on a phone cut it into parts first.',
      },
    },
    {
      title: 'List names and commands.',
      text: 'For a software demo, put product names, commands and acronyms in the vocabulary hint so they are spelled the way you write them.',
    },
  ],

  faqs: [
    {
      question: 'Why can I not play my WebM on my phone, and can I still transcribe it?',
      answer:
        'Some older phones and players cannot open WebM. That does not matter here: TranscribeVid only needs the sound, so you can still add the file and get a transcript.',
    },
    {
      question: 'Can I transcribe an audio-only WebM?',
      answer:
        'Yes. Some recorders save sound-only files with the .webm extension. They are read like any other audio file.',
    },
    {
      question: 'Does it matter if my WebM uses VP8, VP9 or AV1?',
      answer:
        'No. The picture is ignored. What matters is that the file has a sound track in a common format such as Opus.',
    },
    {
      question: 'How do I use the subtitles with a WebM on my own web page?',
      answer:
        'Download the VTT file, save it next to the video and point a track element inside the video element at it. The VTT subtitle generator page shows what the file looks like and the exact markup.',
    },
    {
      question: 'Why did my screen recording give an empty transcript?',
      answer:
        'Most likely it contains no speech: the microphone was off or only system sounds were recorded. If you can hear people talking but get no text, keep Enhance audio on in More options and try a higher quality setting.',
    },
  ],

  links: [
    {
      label: 'VTT subtitle generator',
      path: '/vtt-subtitle-generator',
      note: 'What a WebVTT file contains and how to attach it to a video on your own page.',
    },
    {
      label: 'How to add subtitles to a video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'The whole route from recording to published captions, step by step.',
    },
    {
      label: 'Meeting recording to text',
      path: '/meeting-recording-to-text',
      note: 'For recorded calls and webinars, including how to get the recording out of the meeting tool.',
    },
    {
      label: 'MP4 to text',
      path: '/mp4-to-text',
      note: 'The same service for MP4, the most common video format.',
    },
  ],
};
