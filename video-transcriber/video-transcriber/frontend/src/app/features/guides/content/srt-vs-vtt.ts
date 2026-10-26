import { GuideContent } from '../guide.model';

export const CONTENT: GuideContent = {
  h1: 'SRT vs VTT: which subtitle format should you use?',
  lead: 'SRT is the safe default: almost every video player, editor and platform reads it. Choose VTT (WebVTT) when the subtitles are for the video element of a web page, or when you need styling and positioning. Both are plain text files, and you can download either one from your video here.',
  readingMinutes: 8,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Make an SRT file from your video',
  blocks: [
    {
      title: 'The short answer',
      paragraphs: [
        'If you are not sure, use SRT. It is the older and simpler format, and it is accepted by nearly every video player, video editor and upload form you are likely to meet. A subtitle file that works everywhere is worth more than a clever one.',
        'Use VTT when the video plays on a web page through the HTML video element. Browsers load subtitle tracks in the WebVTT format only, so an SRT file will not work there without conversion. VTT is also the better choice when you want to place the text on the screen, add bold or italics with confidence, or label who is speaking.',
        'Everything else in this guide explains why, shows you what each file looks like inside, and tells you how to switch from one to the other without breaking anything.',
      ],
    },
    {
      title: 'What an SRT file looks like',
      paragraphs: [
        'SRT stands for SubRip Text, named after a Windows program from the early 2000s that copied subtitles out of DVDs. The format was never formally standardised, but it became so common that everything supports it. An SRT file is a list of numbered blocks, each separated from the next by an empty line.',
      ],
      code: {
        label: 'A small SRT file',
        text: `1
00:00:01,000 --> 00:00:03,500
Welcome to the show.

2
00:00:03,800 --> 00:00:07,200
Today we look at how
subtitle files are built.

3
00:00:07,600 --> 00:00:10,000
Let's start with the basics.`,
      },
      after: [
        'Each block has three parts: a running number, a line with the start time and the end time, and one or two lines of text. The times are written as hours, minutes, seconds and milliseconds, and the milliseconds are separated by a comma. That comma is the single most common reason a hand-converted file fails.',
        'Save the file as plain text in UTF-8 with the extension .srt. UTF-8 matters as soon as the text has accents, Devanagari, Arabic or any other non-English characters.',
      ],
    },
    {
      title: 'What a WebVTT file looks like',
      paragraphs: [
        'WebVTT, usually shortened to VTT, was designed for the web and is defined in a specification published by the W3C, the body that standardises web technology. It looks similar to SRT but adds a required header line and a few optional extras.',
      ],
      code: {
        label: 'The same subtitles as a WebVTT file',
        text: `WEBVTT

NOTE This file was made from the SRT example.

intro
00:00:01.000 --> 00:00:03.500
Welcome to the show.

00:00:03.800 --> 00:00:07.200 line:85% align:center
Today we look at how
subtitle files are built.

00:00:07.600 --> 00:00:10.000
<v Maria>Let's start with the basics.</v>`,
      },
      after: [
        'Four details set it apart. The first line must be WEBVTT. The milliseconds are separated by a full stop, not a comma. A cue can have a name (the word intro above) instead of, or as well as, a number, and the numbers are optional. And after the times you may add settings such as line, position and align, which move the text on the screen.',
        'You can also write NOTE blocks for comments that viewers never see, mark who is talking with the v tag, and use simple tags such as b, i and u for bold, italic and underline. Save the file as UTF-8 with the extension .vtt.',
      ],
    },
    {
      title: 'SRT and VTT compared',
      paragraphs: [
        'This table sets the two side by side. The differences that matter in daily use are the header, the decimal separator and where each format is accepted.',
      ],
      table: {
        caption: 'SRT compared with WebVTT',
        head: ['', 'SRT', 'WebVTT (VTT)'],
        rows: [
          ['File extension', '.srt', '.vtt'],
          ['First line', 'The number 1', 'The word WEBVTT'],
          ['Time format', '00:00:01,000 (comma)', '00:00:01.000 (full stop)'],
          ['Cue numbers', 'Required', 'Optional (a name is allowed)'],
          ['Position on screen', 'Not in the format', 'Cue settings: line, position, align, size'],
          [
            'Styling and speaker tags',
            'Basic tags only, support varies by player',
            'Defined in the specification, plus CSS styling',
          ],
          ['Comments', 'None', 'NOTE blocks'],
          ['Web page video element', 'Not accepted', 'The required format'],
          ['Formal specification', 'None (a de facto format)', 'W3C specification'],
        ],
      },
      after: [
        'In plain terms: SRT is the simpler file with the wider reach, VTT is the richer file with the narrower but more modern home. For ordinary spoken-word subtitles the text on screen looks the same either way.',
      ],
    },
    {
      title: 'Where each format is accepted',
      paragraphs: [
        'Support changes over time, and every platform words its help pages differently, so treat this as a guide and check the current help page of the service you upload to.',
      ],
      bullets: [
        {
          title: 'Web pages.',
          text: 'The track element of the HTML video tag needs WebVTT. This is the one place where SRT is not an option.',
        },
        {
          title: 'YouTube.',
          text: 'The subtitle upload accepts SRT, and it also accepts VTT, among other formats. SRT is the usual choice.',
        },
        {
          title: 'Desktop and mobile players.',
          text: 'VLC and most other players read SRT, and many also read VTT. A player usually loads a subtitle file that has the same name as the video.',
        },
        {
          title: 'Video editors.',
          text: 'Most editors import SRT as a captions or subtitles track. Some import VTT as well. If one format is refused, try the other.',
        },
        {
          title: 'Other social and learning platforms.',
          text: 'Many ask for SRT or VTT, a few ask for one of them only. Read the upload page before you export.',
        },
      ],
    },
    {
      title: 'Converting between SRT and VTT by hand',
      paragraphs: [
        'Renaming the file is not enough. A file called talk.vtt that still contains SRT contents is rejected by browsers, because it lacks the header and its times use commas. The conversion takes a minute in any text editor.',
      ],
      steps: [
        {
          title: 'SRT to VTT, step one',
          text: 'Add the line WEBVTT at the very top, followed by an empty line.',
        },
        {
          title: 'SRT to VTT, step two',
          text: 'In every time line, change the comma before the milliseconds to a full stop. A find-and-replace on --> lines, or on the pattern of digits around the comma, saves time.',
        },
        {
          title: 'SRT to VTT, step three',
          text: 'Leave the numbers where they are, since VTT allows them as cue names. Save as UTF-8 with the extension .vtt.',
        },
        {
          title: 'VTT to SRT',
          text: 'Do the reverse: delete the header, NOTE blocks and any settings after the times, change full stops back to commas, make sure every cue has a number, and save as .srt.',
        },
      ],
      after: [
        'If you have ffmpeg installed, it converts subtitle files too: ffmpeg -i talk.srt talk.vtt turns an SRT file into a VTT file, and the same command with the names reversed goes the other way. The simplest route, though, is to download the format you need from the transcript page, because both are produced directly from the same text.',
      ],
    },
    {
      title: 'Common problems and their causes',
      bullets: [
        {
          title: 'Accents or non-Latin letters appear as strange symbols.',
          text: 'The file is not saved as UTF-8. Re-save it with that encoding.',
        },
        {
          title: 'Nothing shows on the web page.',
          text: 'The file is SRT rather than VTT, or the server sends it with the wrong type. VTT files should be served as text/vtt, and a file on another domain also needs the right cross-origin settings.',
        },
        {
          title: 'The subtitles are late or early everywhere.',
          text: 'The whole file is shifted. Most players and editors let you offset subtitles by a fixed time, which is easier than editing every line.',
        },
        {
          title: 'Two subtitles overlap on screen.',
          text: 'The end time of one cue is later than the start time of the next. Shorten the earlier cue.',
        },
        {
          title: 'Lines are too long to read.',
          text: 'Split them into two lines of roughly equal length. About 42 characters per line is a common guideline.',
        },
      ],
    },
    {
      title: 'How to get an SRT or VTT file from your video here',
      paragraphs: [
        'You do not need to write either format yourself. Add your video or audio file on the home page, choose the spoken language, and let the transcript finish. Read through it and correct any word that is wrong: an edited line keeps its start and end time, and the words inside it are spread across that time in proportion to their length.',
        'Then open the download menu and choose SRT or VTT. Both are made from the same edited transcript, so you can export one for YouTube and the other for your own web page without repeating any work. If you want the subtitles to split cleanly at the right words, leave Word-level timing switched on under More options.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Can I rename an SRT file to VTT and use it on my website?',
      answer:
        'No. A browser rejects a .vtt file that does not start with WEBVTT, and SRT times use commas where VTT needs full stops. Add the header, change the commas, or download a VTT file directly from the transcript page.',
    },
    {
      question: 'Do SRT and VTT files differ in size or quality?',
      answer:
        'No. Both are small text files and neither affects video quality. The difference is only in the extra things VTT can describe, such as screen position and styling, and in where each format is accepted.',
    },
    {
      question: 'Can SRT subtitles be bold, italic or coloured?',
      answer:
        'Some players understand basic tags such as b and i in SRT, but support is uneven, so the result can differ from player to player. WebVTT defines its tags and CSS styling in a specification, which makes the result more predictable on the web.',
    },
    {
      question: 'What text encoding should a subtitle file use?',
      answer:
        'UTF-8. It handles every language, and it is what browsers expect for WebVTT. If subtitle characters look broken, the file was almost certainly saved in an older encoding.',
    },
  ],
  links: [
    {
      label: 'SRT subtitle generator',
      path: '/srt-subtitle-generator',
      note: 'Drop in a video and download an SRT file made from the speech in it.',
    },
    {
      label: 'VTT subtitle generator',
      path: '/vtt-subtitle-generator',
      note: 'The same, for a WebVTT file that works with the video element of a web page.',
    },
    {
      label: 'How to add subtitles to a video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Step by step, from the transcript to a video that shows subtitles in YouTube, VLC or an editor.',
    },
    {
      label: 'YouTube subtitle generator',
      path: '/youtube-subtitle-generator',
      note: 'Make an SRT file for a video you own and upload it in YouTube Studio.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'Better text means fewer corrections before you export the subtitles.',
    },
  ],
};
