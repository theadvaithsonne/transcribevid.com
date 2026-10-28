import { ToolPageContent } from '../tool-page.model';

/** The limits quoted from other sites are as their own pages read on 28 October 2026; the guide linked below holds the full, sourced table. */
export const CONTENT: ToolPageContent = {
  eyebrow: 'Transcribe video to text',
  h1: 'Transcribe video to text: free, no sign-up, no daily cap',
  browserH1: 'Transcribe video to text: free, no sign-up, no cap, nothing uploaded',
  lead: 'Add a video and get its speech back as text, with a time on every line. There is no account to make and no daily cap, so the next video can start as soon as this one is done.',
  browserLead:
    'Add a video and get its speech back as text, with a time on every line. There is no account to make, no daily cap and no file-size limit, and the video is never uploaded: your own device does the work.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'What "free" should mean when you transcribe a video',
  why: [
    'Many sites that say "free video transcription" give you a minute, or a few files, and then ask for an account or a card. Before you pick one, check four things: whether you must sign up, how many minutes or files you get, how large a file it takes, and whether you can download the result.',
    'Here the answer to each is simple. You add the video, there is nothing to sign up for, there is no daily or monthly count, and the transcript downloads as TXT, SRT, VTT, PDF, Markdown or JSON at no charge. The tool does not label speakers and does not take links: you add the file itself.',
  ],
  browserWhy: [
    'Many sites that say "free video transcription" give you a minute, or a few files, and then ask for an account or a card. Before you pick one, check four things: whether you must sign up, how many minutes or files you get, how large a file it takes, and whether you can download the result.',
    'Here the answer to each is simple. You add the video, there is nothing to sign up for, there is no daily or monthly count and no size limit, and the transcript downloads as TXT, SRT, VTT, PDF, Markdown or JSON at no charge. Because your device does the work, its memory is the one real limit: a very long video can be too much for a phone, so cut it into parts first. The tool does not label speakers and does not take links: you add the file itself.',
  ],

  sections: [
    {
      title: 'Free limits on other video transcription sites, checked October 2026',
      paragraphs: [
        'These are quotes from each tool\'s own page as it read on 28 October 2026. Plans change, so look at the page before you rely on a number. The guide linked at the end of this page has the full table with a link to every source.',
      ],
      bullets: [
        {
          title: 'Riverside.',
          text: '"Unlimited transcriptions for free. No sign up required." The free tool takes MP3, WAV, MP4 and MOV files, and gives all the text of a multi-speaker recording to one speaker.',
        },
        { title: 'VoiceCheap.', text: '"Free for files up to 60 minutes, with 1 transcription per day."' },
        { title: 'RecCloud.', text: '"Our free plan allows videos up to 10 minutes in length."' },
        { title: 'Caption-X.', text: '"The free plan covers 5 transcriptions in total, up to 5 minutes each."' },
        { title: 'Maestra.', text: 'A "1-minute preview", and "Sign up to download or export your transcript."' },
        { title: 'Any2Text.', text: '"First 15 minutes free", then $0.035 a minute.' },
      ],
    },
    {
      title: 'Where your video goes while it is transcribed',
      paragraphs: [
        'The video is sent to the server that runs this site, transcribed there, and deleted when your session ends. It is not posted anywhere else.',
      ],
      browser: {
        paragraphs: [
          'The video stays on your device. Your browser reads it, pulls out the sound and runs the Whisper speech model on it, so no file is sent to us or to anyone else.',
          'Only the tools are downloaded: the page, the speech model and the engine that runs it. The model is between about 77 MB and a little over 1 GB, depending on the quality level and your device, and it is kept in your browser afterwards. To see it for yourself, open your browser\'s network panel while a video is transcribed.',
        ],
      },
    },
    {
      title: 'Four quality levels for different videos',
      paragraphs: [
        'Fastest uses the small Base model and suits a quick draft of clear speech. Standard uses a larger one, and is the usual choice. High accuracy runs Large v3 Turbo and handles accents and noisy rooms better. Best accuracy runs the full Large v3 and makes the fewest mistakes, but takes the longest.',
        'The larger the model, the longer it takes: Fastest needs the least time and Best accuracy the most. Try Standard first, and move up only if the text is not good enough.',
      ],
      browser: {
        paragraphs: [
          'Fastest uses the small Base model and suits a quick draft of clear speech. Standard uses a larger one, and is the usual choice. High accuracy runs Large v3 Turbo and handles accents and noisy rooms better. Best accuracy runs the full Large v3 and makes the fewest mistakes, but takes the longest.',
          'Your device does the work, so speed depends on it: a recent laptop is much quicker than an older phone, and on a phone Fastest is the level to use. Try Standard first on a laptop, and move up only if the text is not good enough.',
        ],
      },
    },
  ],

  howTitle: 'How to transcribe a video in four steps',
  howToDescription: 'Add the video, choose the language and quality level, wait while the text appears, then edit it and download it.',
  steps: [
    {
      title: 'Add the video',
      text: 'Drop the file in the box at the top of this page, or press Choose a file. A link to a web video is not accepted.',
    },
    {
      title: 'Choose language and quality',
      text: 'Name the spoken language if you know it, and pick a quality level. Standard is a good start; use High accuracy or Best accuracy for accents, noise or a language such as Hindi.',
    },
    {
      title: 'Wait for the text',
      text: 'Lines appear one by one with a progress bar and the time left.',
      browser: {
        text: 'Lines appear one by one with a progress bar and the time left. The first time you use a level, the model is downloaded once; later videos start straight away.',
      },
    },
    {
      title: 'Edit and download',
      text: 'Fix any line in the editor, then download TXT, SRT, VTT, PDF, Markdown or JSON. Download before you leave: nothing is kept for you after the session.',
      browser: {
        text: 'Fix any line in the editor, then download TXT, SRT, VTT, PDF, Markdown or JSON. The transcript stays in this browser for a while, but download what you want to keep.',
      },
    },
  ],

  formatsTitle: 'Videos you can add and files you get back',
  formatsIntro: 'The sound track is what is read, so the picture can be any quality. Audio-only files work too.',
  uploadTitle: 'Video files you can add',
  accepts: ['MP4', 'MOV', 'MKV', 'WEBM', 'AVI', 'M4V', '3GP'],
  downloads: [
    { name: 'TXT', use: 'plain text, or a time on each line' },
    { name: 'SRT', use: 'subtitles for editors and players' },
    { name: 'VTT', use: 'captions for web video' },
    { name: 'PDF', use: 'a transcript to print or share' },
    { name: 'Markdown', use: 'notes with timestamps' },
    { name: 'JSON', use: 'words and times for developers' },
  ],

  tipsTitle: 'Getting more from a free transcription',
  tips: [
    {
      title: 'Test the first minute before the whole video.',
      text: 'Cut or play a minute of the video and transcribe that. If the text is wrong, change the language or quality level before you spend time on the full file.',
    },
    {
      title: 'Check what is on your screen as well as in your ears.',
      text: 'Only the speech is written down. Names that appear on a slide but are never said will not be in the text.',
    },
    {
      title: 'Split a very long recording.',
      text: 'A video of several hours is easier to handle in parts of an hour or so each: you can start reading sooner and a mistake costs less to redo.',
      browser: {
        title: 'Split a very long recording on a phone.',
        text: 'There is no size limit, but a video of several hours needs a lot of memory. On a phone, parts of an hour or so each are much safer, and on a laptop you can usually go much longer.',
      },
    },
    {
      title: 'Download the subtitle file as well as the text.',
      text: 'The SRT file keeps the timing, so the same run gives you both a transcript to read and captions to add to the video.',
    },
  ],

  faqs: [
    {
      question: 'Can I paste a YouTube, TikTok or Google Drive link instead of a file?',
      answer: 'No. This tool works on a file you add or record. If you own the video, use the original file; for someone else\'s video you need the right to use it.',
    },
    {
      question: 'Will the transcript show who is speaking?',
      answer: 'No. Lines have times but no speaker names. You can type names into the text in the editor, which is quick for a two-person interview.',
    },
    {
      question: 'Is there really no limit on how many videos I can transcribe?',
      answer: 'There is no account, no plan and no daily or monthly count. {limits} If many people are using the service, your video may wait in a queue for a while.',
      browser: {
        answer:
          'There is no account, no plan and no daily or monthly count, and no size limit. The only limit is your device: a very long video takes longer and needs more memory, so a phone does better with parts of an hour or so. Ads keep the site free, and none is shown while a video is transcribed.',
      },
    },
    {
      question: 'Which quality level suits a long video?',
      answer: 'Standard is the usual choice. Fastest is quicker but makes more mistakes; High accuracy and Best accuracy cost more time and pay off on accents, noise and languages such as Hindi.',
    },
    {
      question: 'Does the video leave my computer?',
      answer: 'It is sent to the server that runs this site and deleted when your session ends.',
      browser: {
        answer: 'No. Your browser transcribes the video on your own device, and no file is sent to us. Only the speech model and its engine are downloaded, once.',
      },
    },
  ],

  related: ['/video-to-text', '/mp4-to-text', '/meeting-recording-to-text', '/speech-to-text', '/private-transcription', '/srt-subtitle-generator'],

  links: [
    {
      label: 'Free video to text tools compared',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Every limit in one table, quoted from each tool\'s own page.',
    },
    {
      label: 'Transcribe a video without uploading it',
      path: '/guides/transcribe-video-without-uploading',
      note: 'How the work stays on your device and how to check it yourself.',
    },
    {
      label: 'How to transcribe a video to text',
      path: '/guides/how-to-transcribe-video-to-text',
      note: 'Five ways to do it, and which one fits your video.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'Habits and settings that reduce mistakes on any video.',
    },
  ],
};
