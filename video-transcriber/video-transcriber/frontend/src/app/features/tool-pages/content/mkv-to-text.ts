import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MKV to text',
  h1: 'Convert MKV video to text',
  lead: 'MKV is the Matroska video container used by screen recorders such as OBS and by many video downloads and recorded talks. Add an MKV file and get a timestamped transcript in more than 50 languages, free and with no login.',
  dropKind: 'video',
  dropNoun: 'MKV video',

  whyTitle: 'Transcribing an MKV without converting it',
  why: [
    'An MKV file can hold several things at once: one video track, several audio tracks, and subtitles. That flexibility is why recorders and video downloads use it, and also why some tools refuse it. Here you can skip the conversion: add the MKV and its sound is read directly.',
    'The first audio track is the one that is transcribed. For a screen recording or a talk that is the whole story. For a film with several dubbed languages, make sure the track you want comes first, or save that one as its own file.',
  ],
  browserWhy: [
    'An MKV file can hold several things at once: one video track, several audio tracks, and subtitles. That flexibility is why recorders and video downloads use it, and also why some tools refuse it. Here you can skip the conversion: add the MKV and its sound is read on your own device, without uploading the file.',
    'The first audio track your browser can read is the one that is transcribed: a first track in AC-3 or DTS is skipped when a later track is in AAC, Opus or MP3. For a screen recording or a talk that is the whole story. For a film with several dubbed languages, save the track you want as its own file, or make sure it comes first and is in a format the browser reads.',
  ],

  sections: [
    {
      title: 'What is inside your MKV',
      paragraphs: ['Knowing what the file holds explains most surprises.'],
      bullets: [
        {
          title: 'Audio codec.',
          text: 'AAC, Opus, Vorbis, FLAC and MP3 inside an MKV are read directly, and so are the AC-3 and DTS tracks that films and TV recordings often use.',
          browser: {
            text: 'AAC, Opus, Vorbis, FLAC and MP3 inside an MKV are read directly. Films and TV recordings often use AC-3 or DTS, and for those your browser asks once to load a 9 MB converter that works on your device.',
          },
        },
        {
          title: 'Several audio tracks.',
          text: 'Files with more than one language carry one track per language. The first track is transcribed.',
          browser: {
            text: 'Files with more than one language carry one track per language. The first track your browser can read is transcribed; when every track needs the converter, the first track is used.',
          },
        },
        {
          title: 'Subtitle tracks.',
          text: 'Subtitles stored inside the MKV are not read. The transcript is made from the sound, which makes it useful when a video has no subtitles at all.',
        },
        {
          title: 'Screen recordings.',
          text: 'OBS and similar recorders can save MKV, because the file survives a crash better than an MP4. A long recording of a meeting, a lesson or a game stream is a good fit.',
        },
      ],
    },
  ],

  howTitle: 'How to convert an MKV file to text',
  howToDescription: 'Add the MKV file, choose the language and quality, wait for the transcript and download TXT, SRT, VTT or PDF.',
  steps: [
    {
      title: 'Add the MKV',
      text: 'Drop the .mkv file in the box at the top of this page, or press Choose a file.',
    },
    {
      title: 'Choose the language',
      text: 'Pick the spoken language, or keep auto-detect. For a film with a dubbed track, choose the language of that track.',
    },
    {
      title: 'Pick a quality',
      text: 'Standard is fine for a clean screen recording. Film dialogue under music and effects is harder, and High accuracy or Best accuracy helps there.',
    },
    {
      title: 'Edit and download',
      text: 'Fix any line, then download TXT, SRT, VTT, PDF, Markdown or JSON. SRT can be loaded next to the video in a player.',
    },
  ],

  formatsTitle: 'MKV and the files like it',
  formatsIntro: 'MKV works, and so do the other video containers and plain audio files.',
  uploadTitle: 'Video files you can add',
  accepts: ['MKV', 'MP4', 'MOV', 'WEBM', 'AVI', 'M4A', 'MP3', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'the words as plain text' },
    { name: 'SRT', use: 'timed subtitle lines' },
    { name: 'VTT', use: 'timed lines for web players' },
    { name: 'PDF', use: 'a printable copy' },
    { name: 'Markdown', use: 'notes with times' },
    { name: 'JSON', use: 'data for your own tools' },
  ],

  tipsTitle: 'Tips for MKV files',
  tips: [
    {
      title: 'Wrong language in the transcript?',
      text: 'You may have transcribed the first track of a file with several languages. Save the track you want as its own audio file, or re-save the MKV with that track first, and add it again.',
    },
    {
      title: 'Game or stream recordings.',
      text: 'Game sound can drown out voices. If you recorded voice on its own track, export that track alone and the transcript will be much cleaner.',
    },
    {
      title: 'Long recordings.',
      text: 'Give a long recording time, and keep Skip silence & music on in More options so long quiet stretches are skipped rather than turned into words. A file over the size or length limit is refused before processing.',
      browser: {
        text: 'A multi-hour MKV is fine: there is no size or length limit, though a long file needs time and free memory, most of all on a phone. Keep Skip silence & music on in More options so long quiet stretches are skipped rather than turned into words.',
      },
    },
    {
      title: 'Subtitles for a video that has none.',
      text: 'Download the SRT, name it like the video file, and put them in the same folder. Most players pick it up on their own.',
    },
  ],

  faqs: [
    {
      question: 'Can I transcribe an MKV without converting it to MP4?',
      answer: 'Yes. Add the MKV as it is. There is no need to convert it first, and nothing is lost by not doing so.',
    },
    {
      question: 'Which audio track of an MKV is transcribed?',
      answer: 'The first one that can be decoded. If your file has several languages, put the one you want first or save it as its own file.',
    },
    {
      question: 'My MKV has AC-3 or DTS audio. Does that work?',
      answer: 'Yes. AC-3 and DTS, which are common in films and TV recordings, are read like any other audio track.',
      browser: {
        answer:
          'Yes. Browsers cannot decode AC-3 or DTS themselves, so when you press Transcribe the page asks once to load a 9 MB converter that runs on your device. Say yes and the file is read as normal; later visits remember your answer.',
      },
    },
    {
      question: 'Are the subtitles inside the MKV used?',
      answer: 'No. The transcript is made from the sound, so it works even when the video has no subtitles, and it is timed to the speech.',
    },
    {
      question: 'Is my MKV file kept?',
      answer: 'Only for your session. It is deleted automatically when the session ends, or when you press Delete my data now.',
      browser: {
        answer:
          'Only in this browser: the MKV never leaves your device. It is deleted after a period of inactivity, or when you press Delete my data now.',
      },
    },
  ],

  related: ['/video-to-text', '/avi-to-text', '/mp4-to-text', '/webm-to-text', '/srt-subtitle-generator'],
  links: [
    {
      label: 'AVI to text',
      path: '/avi-to-text',
      note: 'The same free transcription for the older AVI video format.',
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
