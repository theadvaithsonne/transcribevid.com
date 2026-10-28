import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'AVI to text',
  h1: 'Convert AVI video to text',
  lead: 'AVI is the older video format that old camcorders, screen recorders and archived downloads still use. Add an AVI file and get a timestamped transcript in more than 50 languages, free and with no login.',
  dropKind: 'video',
  dropNoun: 'AVI video',

  whyTitle: 'Why an AVI needs a little extra care',
  why: [
    'AVI dates from 1992 and is only a container: the sound inside can be MP3, uncompressed PCM, AC-3 or something rarer, depending on the camera or program that made the file. Modern players handle most of them, but some programs and web pages do not, which is why people go looking for a converter.',
    'You do not need to convert the AVI yourself. Add it as it is: only its sound is read, the picture is ignored, and the words come back as a transcript with timestamps that you can edit and download as text or subtitles.',
  ],
  browserWhy: [
    'AVI dates from 1992 and is only a container: the sound inside can be MP3, uncompressed PCM, AC-3 or something rarer, depending on the camera or program that made the file. Browsers cannot read AVI as easily as MP4, which is why people go looking for a converter.',
    'You do not need to convert the AVI yourself. Add it as it is: the first time, your browser asks to load a small converter (9 MB) that works on your own device, and only the sound is read. The file is never uploaded.',
  ],

  sections: [
    {
      title: 'Where AVI files come from',
      paragraphs: ['If you have an AVI in front of you, it probably came from one of these.'],
      bullets: [
        {
          title: 'Old camcorders and digital cameras.',
          text: 'Compact cameras from the 2000s recorded short clips as AVI. Family videos and events from that time are often only available in this format.',
        },
        {
          title: 'Screen recorders and training videos.',
          text: 'Some screen-capture tools save AVI. A recorded lesson or software demo can be turned into notes or captions.',
        },
        {
          title: 'Archives and downloads.',
          text: 'Older course material, conference talks and home-made DVD rips are often AVI files kept on a hard disk.',
        },
        {
          title: 'Surveillance and dictation gear.',
          text: 'Some recorders and call-logging systems write AVI with an audio track, and the sound is all you need from it.',
        },
      ],
    },
  ],

  howTitle: 'How to convert an AVI file to text',
  howToDescription: 'Add the AVI file, choose the language and quality, wait for the transcript and download TXT, SRT, VTT or PDF.',
  steps: [
    {
      title: 'Add the AVI',
      text: 'Drop the .avi file in the box at the top of this page, or press Choose a file.',
    },
    {
      title: 'Choose the language',
      text: 'Pick the spoken language, or keep auto-detect. Old home videos often have a lot of room noise, so naming the language helps.',
    },
    {
      title: 'Pick a quality',
      text: 'Old recordings are usually noisy and quiet. High accuracy or Best accuracy is worth the extra time on those. Fastest is enough to check what is in a file.',
      browser: {
        text: 'Old recordings are usually noisy and quiet. High accuracy or Best accuracy is worth the extra time on those. Fastest is enough to check what is in a file. When you press Transcribe, the browser asks once to load the converter: say yes, and later visits remember it.',
      },
    },
    {
      title: 'Edit and download',
      text: 'Fix any line, then download TXT, SRT, VTT, PDF, Markdown or JSON. SRT is the one for captions.',
    },
  ],

  formatsTitle: 'AVI and the formats like it',
  formatsIntro: 'AVI works, and so do the other video files from the same era and their modern replacements.',
  uploadTitle: 'Video files you can add',
  accepts: ['AVI', 'MP4', 'MOV', 'MKV', 'WEBM', 'WMV', 'FLV', 'MPG'],
  downloads: [
    { name: 'TXT', use: 'the words as plain text' },
    { name: 'SRT', use: 'timed subtitle lines' },
    { name: 'VTT', use: 'timed lines for web players' },
    { name: 'PDF', use: 'a printable copy' },
    { name: 'Markdown', use: 'notes with times' },
    { name: 'JSON', use: 'data for your own tools' },
  ],

  tipsTitle: 'Tips for AVI recordings',
  tips: [
    {
      title: 'Old audio is quiet.',
      text: 'Keep Enhance audio on in More options. It evens out quiet voices and filters the hiss that old cameras add.',
    },
    {
      title: 'No sound at all?',
      text: 'Some AVI files are only picture. If the page says the file has no audio track, there is nothing to transcribe, and the sound may be in a separate file.',
    },
    {
      title: 'Want subtitles for the old video?',
      text: 'Download the SRT and load it next to the AVI in a player such as VLC, or burn it into a copy of the video with an editor.',
    },
    {
      title: 'Long tapes.',
      text: 'Files over the size or length limit are refused, so cut a long tape into parts or export only its audio first. Word-level timing, under More options, makes the subtitle lines line up better.',
      browser: {
        title: 'Very long files.',
        text: 'A whole evening of tape is fine, but give a long file time and enough free memory, most of all on a phone. Word-level timing, under More options, makes the subtitle lines line up better.',
      },
    },
  ],

  faqs: [
    {
      question: 'Do I need to convert the AVI to MP4 first?',
      answer: 'No. Add the AVI as it is. Only the sound is used, so converting would only be a detour.',
      browser: {
        answer:
          'No. Add the AVI as it is. Because browsers do not read AVI by themselves, the page asks once to load a 9 MB converter, which runs on your device. After that you do not need to do anything.',
      },
    },
    {
      question: 'Does it work with any AVI?',
      answer:
        'With almost all of them that have a sound track. A file with no audio track, or one that is damaged, cannot be transcribed, and the page tells you which it is.',
    },
    {
      question: 'Can I get subtitles for an AVI?',
      answer:
        'Yes. Download the SRT or VTT file and load it next to the video in a player, or add it with a video editor. The SRT generator page explains the format.',
    },
    {
      question: 'Which languages work for an AVI?',
      answer: 'More than 50, from English and Spanish to Hindi and Japanese. Choose the language for the best result, or set Output to Translate to English.',
    },
    {
      question: 'Is my AVI file kept?',
      answer: 'Only for your session. It is deleted automatically when the session ends, or when you press Delete my data now.',
      browser: {
        answer:
          'Only in this browser: the AVI never leaves your device. It is deleted after a period of inactivity, or when you press Delete my data now.',
      },
    },
  ],

  related: ['/video-to-text', '/mkv-to-text', '/mp4-to-text', '/mov-to-text', '/srt-subtitle-generator'],
  links: [
    {
      label: 'MKV to text',
      path: '/mkv-to-text',
      note: 'The same free transcription for the container that screen recorders and downloads use today.',
    },
    {
      label: 'SRT subtitle generator',
      path: '/srt-subtitle-generator',
      note: 'What an SRT file is and how to use it with a video.',
    },
    {
      label: 'How to add subtitles to a video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'How to put the subtitles on the picture once you have the file.',
    },
  ],
};
