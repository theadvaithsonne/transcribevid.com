import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Indonesian audio to text',
  h1: 'Indonesian audio to text, for lectures, rapat and voice notes',
  lead: 'Turn Bahasa Indonesia from a video, a voice note or a recording into text, with a time on every line. Audio ke teks, free and with no login.',
  browserLead:
    'Turn Bahasa Indonesia from a video, a voice note or a recording into text, with a time on every line. Audio ke teks, free, with no login, and the file never leaves your device.',
  dropKind: 'video',
  dropNoun: 'Indonesian video or audio',

  whyTitle: 'Audio ke teks: Indonesian speech, written down',
  why: [
    'Bahasa Indonesia is spoken by well over a hundred million people as a first or second language, and it is the language of lectures, webinars, meetings, podcasts, YouTube and TikTok videos across Indonesia. People search for audio ke teks, suara ke teks, video ke teks or transkrip rekaman, and this page does exactly that: you add a recording and get Indonesian text with a timestamp on each line. It opens the uploader with Indonesian already chosen under Language.',
    'Typical jobs are a transkrip wawancara for a thesis or a report, the notes of a kuliah (university lecture) or rapat (meeting), the captions of a video for social media, and a WhatsApp voice note you would rather read than play. A time on every line lets you find a sentence again without listening to the whole file.',
  ],

  sections: [
    {
      title: 'Formal, informal and regional Indonesian',
      bullets: [
        {
          title: 'Formal Indonesian (baku).',
          text: 'News, lectures, speeches and presentations are in standard Indonesian, which gives the cleanest transcripts.',
        },
        {
          title: 'Everyday and slang speech.',
          text: 'In casual speech people say gak, nggak, udah, banget or yg. The recogniser may write what it hears or the standard form, and both can appear in one transcript. Search and replace in the editor makes them consistent.',
        },
        {
          title: 'Regional languages.',
          text: 'Javanese, Sundanese, Minangkabau, Balinese and others are often mixed into Indonesian speech. A sentence in a regional language is much harder, so check those passages and keep the language setting on Indonesian.',
        },
        {
          title: 'Indonesian and Malay.',
          text: 'Indonesian and Malaysian Malay are close but not the same, with different words and spelling. For speech from Malaysia, Malay is a separate choice in the language list.',
        },
      ],
    },
    {
      title: 'Mixed Indonesian and English',
      paragraphs: [
        'Many speakers use English words in business, technology and study, such as deadline, meeting, update and budget. The recogniser may write them as English words or as Indonesian spellings. Keep the setting on Indonesian and check the English terms, which are also where product and company names hide.',
        'Names of people, places, companies and programs are best typed into the vocabulary hint under More options, written the way you want them to appear.',
      ],
    },
    {
      title: 'How accurate is Indonesian transcription here?',
      paragraphs: [
        'We tested the two models behind Standard and High accuracy on 30 clean Indonesian clips, people reading sentences aloud. Standard got about 31 words in 100 wrong and High accuracy about 25, so expect to correct the text and read it with the audio.',
        'Choose High accuracy, or Best accuracy if your device offers it, for anything you will quote or publish. On 10 clips made to sound like a chat-app voice note, High accuracy scored the same as on clean speech, while Standard got a little worse, so the larger model is the better choice for voice notes too.',
      ],
    },
  ],

  howTitle: 'How to convert Indonesian audio to text',
  howToDescription:
    'Add an Indonesian recording, choose the quality, press Transcribe, check names and English terms and download the transcript.',
  steps: [
    {
      title: 'Add your Indonesian recording',
      text: 'Put the file in the drop box above, or press Choose a file. Phone videos, WhatsApp voice notes and MP3 or M4A recordings all work. The uploader opens with Indonesian chosen under Language.',
    },
    {
      title: 'Choose the quality, then press Transcribe',
      text: 'Use High accuracy or Best accuracy for interviews, lectures and anything you will publish. Standard is fine for a quick look at clear speech. Then press Transcribe.',
      browser: {
        text: 'Use High accuracy or Best accuracy for interviews, lectures and anything you will publish, if your device offers them (a choice it cannot run is greyed out, with the reason); each is a larger first-time download. Standard is fine for a quick look at clear speech. Then press Transcribe.',
      },
    },
    {
      title: 'Follow the progress',
      text: 'Lines appear with their times while the file is processed. Enhance audio is on by default and evens out quiet speakers.',
      browser: {
        text: 'Lines appear with their times while the file is processed. Enhance audio is on by default and evens out quiet speakers. The first time, your browser also downloads the speech model once and keeps it for later.',
      },
    },
    {
      title: 'Check the text, then download',
      text: 'Read the lines marked as unsure, check names, numbers and English terms against the audio, then download TXT, SRT, VTT, Markdown, JSON or PDF.',
    },
  ],

  formatsTitle: 'Files and downloads for Indonesian transcripts',
  formatsIntro:
    'Whatever the recording format, only its sound is read. Indonesian is written with ordinary Latin letters, so every download opens everywhere.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'OPUS', 'OGG', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'Indonesian text to read, quote and paste' },
    { name: 'SRT', use: 'Indonesian subtitles for players and editors' },
    { name: 'VTT', use: 'subtitles for web video' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for better Indonesian transcripts',
  tips: [
    {
      title: 'Choose Indonesian yourself.',
      text: 'Auto-detect decides from the start of the file. A recording that opens in English or with music can be taken for another language, and Indonesian written down as rough English or Malay is hard to repair.',
    },
    {
      title: 'Give names and terms to the vocabulary hint.',
      text: 'Names of people, places, schools and companies are often misspelled otherwise. Type them into the Vocabulary hint under More options.',
    },
    {
      title: 'Record close and quiet.',
      text: 'Lecture halls and meeting rooms are echoey. A phone near the speaker, or a recording made with a lapel microphone, helps more than any setting. Keep Enhance audio on.',
    },
    {
      title: 'Check subtitle length.',
      text: 'Indonesian words are often long, so a subtitle line can grow quickly. If you make subtitles, check that the lines are short enough for the screen before you export.',
    },
  ],

  faqs: [
    {
      question: 'Can I convert audio ke teks in Indonesian for free?',
      answer:
        '{limits} There is no sign-up and no daily or monthly quota, so you can transcribe as many Indonesian recordings as you like.',
      browser: {
        answer:
          'Yes. There is no sign-up, no limit on length and no daily or monthly quota. The recording is transcribed on your own device and is not uploaded, so a long file just takes longer, depending on your phone or computer.',
      },
    },
    {
      question: 'How accurate is Indonesian speech to text?',
      answer:
        'On 30 clean clips, High accuracy got about 25 words in 100 wrong and Standard about 31. Clear speech with the language set to Indonesian, a close microphone and a vocabulary hint with the names all improve it. Names and numbers need the most checking.',
    },
    {
      question: 'Does it write slang like gak, banget and udah?',
      answer:
        'It writes what it hears, and sometimes the standard form instead (tidak, sangat, sudah). Both can appear in one transcript. Pick one style and use search and replace in the editor to make it consistent.',
    },
    {
      question: 'Can I get English text from Indonesian audio?',
      answer:
        'Yes. In More options, set Output to Translate to English. The translation is automatic, so read it before you use it, especially for names and numbers.',
    },
    {
      question: 'Can I make Indonesian subtitles for a video?',
      answer:
        'Yes. Transcribe the video, correct the text, download SRT or VTT and add that file as the subtitles in YouTube Studio, CapCut, VLC or your editor. The guide to adding subtitles shows each step.',
    },
  ],

  links: [
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: 'Get an English draft of an Indonesian lecture, interview or meeting.',
    },
    {
      label: 'Lecture to text',
      path: '/lecture-to-text',
      note: 'Turn a long kuliah or webinar into searchable text with timestamps.',
    },
    {
      label: 'How to add subtitles to a video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Put the Indonesian SRT or VTT file on a video in YouTube, VLC or an editor.',
    },
    {
      label: 'Whisper accuracy by language',
      path: '/guides/whisper-accuracy-by-language',
      note: 'Indonesian measured on 30 test clips: 31 wrong words in 100 on Standard and 25 on High accuracy.',
    },
  ],
};
