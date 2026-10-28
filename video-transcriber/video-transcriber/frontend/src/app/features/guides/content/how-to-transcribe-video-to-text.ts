import { GuideContent } from '../guide.model';

/** Steps for other tools are as their own pages describe them; nothing here was measured. The comparison guide holds the sourced limits. */
export const CONTENT: GuideContent = {
  h1: 'How to transcribe a video to text: five ways, and which one fits your video',
  lead: 'You can get the words of a video as text in five ways: the transcript YouTube already holds, voice typing, the captions of a video editor, an online service, or a tool that runs on your own device. They differ in cost, in whether you get times on every line, and in what they ask of you first. This guide says what each one does and when to pick it.',
  readingMinutes: 7,
  toolPath: '/transcribe-video-to-text',
  toolCta: 'Transcribe a video to text, free and without an account',
  blocks: [
    {
      title: 'The short answer',
      bullets: [
        {
          title: 'The video is on YouTube and has captions:',
          text: 'open its transcript on the video page. It costs nothing and takes a minute, but it only exists when the video has captions, and the text needs a careful read.',
        },
        {
          title: 'You have the video file and want text with times:',
          text: 'use a tool that takes a file and gives you TXT and subtitle files. The last two ways below do this.',
        },
        {
          title: 'You only need a few quotes:',
          text: 'play the video and type, or use voice typing. For anything longer than a few minutes it is slower than letting software do the whole file.',
        },
        {
          title: 'You want subtitles for the same video:',
          text: 'pick a way that exports SRT or VTT, so one run gives you both the transcript and the captions.',
        },
      ],
    },
    {
      title: 'What a good transcript needs from your video',
      paragraphs: [
        'Every way below works from the sound track, so the quality of the sound decides the quality of the text far more than the picture does. Speech that is close to the microphone, one voice at a time, without music under it, comes out well. A room with echo, people talking over each other or a loud background comes out with mistakes in every method.',
        'Before you start, find out three things: the language people speak in the video, whether you need a time on each line, and how long the video is. The second tells you which formats you must be able to download; the third tells you which free limits will stop you.',
      ],
    },
    {
      title: 'Way 1: use the transcript YouTube already has',
      paragraphs: [
        'Many YouTube videos carry captions, written by the owner or made automatically. On a video page, open the description: where captions exist, an option to show the transcript appears there, and it lists the text with times that you can copy. If the video is yours, YouTube Studio has a Subtitles section where you can review and download the captions. YouTube changes these screens from time to time, so the labels may differ a little.',
      ],
      after: [
        'This is the quickest way for a video that is already on YouTube. Its limits are that it only works with a link to a video that has captions, the automatic text can be rough on names and technical words, and it will not help with a file on your computer or phone.',
      ],
    },
    {
      title: 'Way 2: play the video and let voice typing listen',
      paragraphs: [
        'Voice typing in a word processor, such as the Voice typing option in the Tools menu of Google Docs, writes down what its microphone hears. You play the video through your speakers and it types.',
        'It costs nothing, but it hears the whole room, not only the video. It gives you no times, it runs in real time, so a one-hour video takes an hour, and anything the microphone misses is lost. It is fine for a quote or two and a poor choice for a lecture or an interview.',
      ],
    },
    {
      title: 'Way 3: switch on automatic captions in a video editor',
      paragraphs: [
        'Some video editors can transcribe the speech of a clip you place in them. Microsoft Clipchamp\'s own guide, for example, says to open the Captions tab, turn on automatic captions, and then download the captions as an SRT file; the video needs speech in its audio for this to work.',
        'This is useful when you are editing the video anyway, because the captions land on the timeline. For a plain transcript it is more work than it needs to be: you must load the video into the editor, and the text comes out as a subtitle file you then turn into a document.',
      ],
    },
    {
      title: 'Way 4: use an online transcription service',
      paragraphs: [
        'Dozens of sites will transcribe a file you give them. Most are free only up to a point: a few minutes, a few files, or a preview that asks you to pay before you can download. The differences that matter are whether you need an account, how many minutes you get, how large a file can be, and whether the result can be exported.',
        'Services are the right choice when you need what simple tools do not do: names for each speaker, a bot that joins a meeting, or a link to a video you do not hold as a file. Our guide with the free limits of thirteen of them, each quoted from its own page, is linked below.',
      ],
    },
    {
      title: 'Way 5: transcribe the file with TranscribeVid',
      paragraphs: [
        'TranscribeVid takes the video file itself, with no account and no daily count. It runs Whisper, an open speech model, and gives the text back with a time on every line.',
        'It does not take links, it does not label who is speaking, and it does not join meetings. For those jobs, use a service from Way 4.',
      ],
      browser: {
        paragraphs: [
          'TranscribeVid takes the video file itself, with no account, no daily count and no size limit. It runs Whisper, an open speech model, in your browser, so the video stays on your device, and the text comes back with a time on every line.',
          'It does not take links, it does not label who is speaking, and it does not join meetings. For those jobs, use a service from Way 4. Because your own device does the work, a long video is slower on an old phone than on a recent laptop.',
        ],
      },
      steps: [
        { title: 'Add the video', text: 'Drop the file in the box on the tool page, or press Choose a file. MP4, MOV, MKV, WEBM and most other video files work, and so do audio files.' },
        { title: 'Choose the language and quality', text: 'Name the spoken language if you know it. Standard suits most videos; choose High accuracy or Best accuracy for accents, noise or Hindi.' },
        { title: 'Wait for the text', text: 'Lines appear one by one, with a progress bar and the time left.' },
        { title: 'Edit and download', text: 'Fix any line in the editor, then download TXT, SRT, VTT, PDF, Markdown or JSON. Download what you want to keep before you leave.' },
      ],
    },
    {
      title: 'Which way for which video',
      table: {
        caption: 'The five ways side by side, as described in this guide',
        head: ['Way', 'Cost', 'Times on each line', 'Works on', 'Best for'],
        rows: [
          ['YouTube transcript', 'Free', 'Yes', 'A YouTube video that has captions', 'A quick copy from a video that is already online'],
          ['Voice typing', 'Free', 'No', 'Anything you can play aloud', 'A few quotes'],
          ['Editor captions', 'Depends on the editor', 'Yes, as subtitles', 'A clip loaded into the editor', 'A video you are editing anyway'],
          ['Online service', 'Free up to a limit, then paid', 'Usually', 'Files, and sometimes links', 'Speaker names, meetings, links'],
          ['TranscribeVid', 'Free', 'Yes', 'A video or audio file', 'A file, with TXT and subtitle files back'],
        ],
      },
    },
    {
      title: 'Fix the text before you use it',
      paragraphs: [
        'Whichever way you choose, read the result once with the video playing. Speech-to-text gets common words right and stumbles on the things that matter most to you: names, product words, numbers and anything said quickly.',
      ],
      bullets: [
        { title: 'Names and terms.', text: 'Search the text for each name you know is in the video and correct every place it appears.' },
        { title: 'Numbers and dates.', text: 'Check each one against the video; a wrong digit is easy to miss.' },
        { title: 'Where the speaker changes.', text: 'Add a line break and a name, because plain transcripts do not mark who is talking.' },
        { title: 'Subtitles.', text: 'If you will use an SRT or VTT file, keep each line short enough to read in the time it is on screen.' },
      ],
      after: [
        'For a longer list of habits that reduce mistakes before you start, see the guide on getting a more accurate transcript.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Can I transcribe a video to text without installing anything?',
      answer: 'Yes. The YouTube transcript, an online service and TranscribeVid all work in a web browser. Only a video editor or a desktop program needs an install.',
    },
    {
      question: 'What is the fastest way to transcribe a one-hour video?',
      answer: 'If it is on YouTube with captions, the transcript there is immediate. For a file, software is far faster than typing or voice typing, which both take at least as long as the video lasts. How long software takes depends on the tool, the quality level and, where it runs on your device, how fast that device is.',
    },
    {
      question: 'Do I have to take the audio out of the video first?',
      answer: 'No. Tools that accept video files read the sound track themselves, so you can add an MP4 or MOV as it is. Taking the audio out first only helps when a tool refuses the video format.',
    },
    {
      question: 'How do I get the text with a time on every line?',
      answer: 'Use a way that exports subtitles or a timed transcript: the YouTube transcript lists times, and a tool that downloads SRT or VTT gives each line a start and end time. Voice typing gives none.',
    },
  ],
  links: [
    {
      label: 'Free video to text tools compared',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'The free limits of thirteen online tools, each quoted from its own page.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'Habits and settings that reduce mistakes on any video.',
    },
    {
      label: 'Make subtitles for your video',
      path: '/srt-subtitle-generator',
      note: 'Turn the same video into an SRT file for players and editors.',
    },
    {
      label: 'Transcribe a video without uploading it',
      path: '/guides/transcribe-video-without-uploading',
      note: 'How the work stays on your device and how to check it yourself.',
    },
  ],
};
