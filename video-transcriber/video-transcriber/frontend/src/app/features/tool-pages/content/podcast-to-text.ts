import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Podcast to text',
  h1: 'Podcast to text, free and unlimited',
  lead: 'Turn a podcast episode into a full transcript for show notes, blog posts, quotes and captions. Audio and video podcasts both work, there is no limit on the number of episodes, and it is free with no login.',
  dropKind: 'video',
  dropNoun: 'episode',

  whyTitle: 'What a transcript does for a show',
  why: [
    'A transcript on the episode page puts every topic you covered into words that search engines and readers can find. It also makes the show accessible to deaf and hard-of-hearing listeners.',
    'It is the fastest way to write show notes, pull quotes for social posts, turn an interview into an article and caption the video version on YouTube.',
  ],

  howTitle: 'How to transcribe a podcast episode',
  howToDescription: 'Add the episode file, add guest names to the vocabulary hint, choose a quality level and download text, Markdown or subtitles.',
  steps: [
    {
      title: 'Use the final mix',
      text: 'Add the exported episode (MP3, WAV or the video file) in the box at the top of this page. The final mix has the levels evened out, which helps accuracy.',
    },
    {
      title: 'Spell your guests',
      text: 'In More options, put the show name, the host and guest names and any brand names in the vocabulary hint.',
    },
    {
      title: 'Choose a quality',
      text: 'Best accuracy is worth it for a transcript you will publish. Fastest is fine for a quick draft to write show notes from.',
      browser: {
        text: 'Best accuracy is worth it for a transcript you will publish, if your device can run it. Fastest is fine for a quick draft to write show notes from.',
      },
    },
    {
      title: 'Download for each use',
      text: 'Markdown for show notes, TXT for a blog post, SRT for the video version and VTT for web players.',
    },
  ],

  formatsTitle: 'Episode files and downloads',
  formatsIntro: 'Podcasts are usually published as MP3. If you have the master WAV or FLAC, use that instead.',
  uploadTitle: 'Episode files you can add',
  accepts: ['MP3', 'WAV', 'M4A', 'FLAC', 'AAC', 'MP4', 'MOV', 'WEBM'],
  downloads: [
    { name: 'Markdown', use: 'show notes with timestamps' },
    { name: 'TXT', use: 'the episode as plain text for a blog post' },
    { name: 'SRT', use: 'captions for the video version' },
    { name: 'VTT', use: 'a transcript track for web players' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'JSON', use: 'words with times for your own tools' },
  ],

  tipsTitle: 'Tips for podcast transcripts',
  tips: [
    {
      title: 'Intro music.',
      text: 'Keep Skip silence & music on, so the theme tune does not turn into made-up words.',
    },
    {
      title: 'Crosstalk.',
      text: 'When two people talk over each other, one of them is often lost. A quick listen at those timestamps fixes it.',
    },
    {
      title: 'Speaker names.',
      text: 'Speakers are not labelled. For a two-person show, add the names at each change of speaker while you edit; the timestamps help you find them.',
    },
    {
      title: 'Word timing for captions.',
      text: 'Keep Word-level timing on in More options when you want captions: each line then starts and ends with its words.',
    },
    {
      title: 'Publish it with the episode.',
      text: 'Paste the TXT into your episode page or blog post. Some podcast platforms also accept a transcript as an SRT or VTT file.',
    },
  ],

  faqs: [
    {
      question: 'Is there a limit on episodes?',
      answer: 'No. There is no daily or monthly quota, so you can transcribe a whole back catalogue, one episode after another.',
    },
    {
      question: 'How long can an episode be?',
      answer: '{limits} Split a longer episode into parts first.',
      browser: {
        answer:
          'We set no limit. The episode is transcribed on your own device, so a two-hour show takes a while on a slower computer. Speed depends on your device and the quality level you pick.',
      },
    },
    {
      question: 'Can I transcribe a podcast from a link or an RSS feed?',
      answer:
        "No. Add the audio or video file itself. If it is your show, use the file you exported; if it is someone else's, make sure you may transcribe and publish it.",
    },
    {
      question: 'Can I publish the transcript on my website?',
      answer:
        'Yes, if you own the podcast or have permission. Read it through first, because automatic transcripts make mistakes with names and jargon.',
    },
    {
      question: 'Does it work for podcasts in Hindi and other languages?',
      answer:
        "Yes, in more than 50 languages, and Hindi can be written in Devanagari or Hinglish. Set the episode's language for the best result.",
    },
  ],

  related: ['/mp3-to-text', '/wav-to-text', '/interview-transcription', '/srt-subtitle-generator', '/audio-to-text'],
};
