import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Turkish audio to text',
  h1: 'Turkish audio to text, with ç, ğ, ı, İ, ö, ş and ü',
  lead: 'Turn Turkish speech from a video, a voice note or a recording into text with every special letter and a time on each line. Ses kaydını yazıya çevirme, free and with no login.',
  browserLead:
    'Turn Turkish speech from a video, a voice note or a recording into text with every special letter and a time on each line. Ses kaydını yazıya çevirme, free, with no login, and the file never leaves your device.',
  dropKind: 'video',
  dropNoun: 'Turkish video or audio',

  whyTitle: 'Turkish speech to text, written the Turkish way',
  why: [
    'Turkish is spoken by tens of millions of people in Türkiye, Cyprus, Germany and many other countries. People search for ses yazıya çevirme, videoyu yazıya çevirme or Turkish speech to text when they need ders kaydı (lecture recordings), toplantı (meetings), röportaj (interviews), podcasts, YouTube videos or WhatsApp voice notes as text. This page gives you Turkish text with a timestamp on every line, and it opens the uploader with Turkish already chosen under Language.',
    'Of the languages we measured, Turkish is one of the easier ones for a recogniser, because its spelling follows its sound closely. That does not make the transcript perfect: Turkish adds endings to words until they are very long, and a few letters are easy to confuse, so the sections below say what to check.',
  ],

  sections: [
    {
      title: 'The letters and endings to check',
      bullets: [
        {
          title: 'İ and ı.',
          text: 'Turkish has a dotted İ/i and a dotless I/ı, and they are different letters, so a wrong dot can change a word. When you change text to capitals in an editor, set the editor to Turkish, or an i may become I instead of İ.',
        },
        {
          title: 'ç, ğ, ö, ş and ü.',
          text: 'These letters carry meaning. The transcript should have them, but look at names of people and places and at words that sound alike.',
        },
        {
          title: 'Endings on names.',
          text: 'Turkish writes an apostrophe between a name and its ending, as in İstanbul’da or Ankara’ya. The recogniser usually adds it, but check it in names of people and companies.',
        },
        {
          title: 'Long words.',
          text: 'Endings pile up, so one Turkish word can be a whole English sentence. If a long word is spelled slightly wrong, replay the timestamped line before you correct it.',
        },
      ],
    },
    {
      title: 'Turkish recordings and speech styles',
      paragraphs: [
        'Standard Istanbul Turkish is what news, lectures and most podcasts use. Regional accents change the sound but not the writing. Speech with a lot of slang, with Kurdish, Arabic or English mixed in, or with several people talking at once is harder, so keep the language on Turkish and check the foreign passages.',
        'Lectures and meetings have names, course terms and company names in them. Put those into the vocabulary hint under More options, spelled the way you want them to appear, and they will be written correctly much more often.',
      ],
    },
    {
      title: 'How accurate is Turkish transcription here?',
      paragraphs: [
        'We tested the two models behind Standard and High accuracy on 30 clean Turkish clips, people reading sentences aloud. Standard got about 12 words in 100 wrong and High accuracy about 9, so Turkish is usable even on Standard when the audio is clear.',
        'On 10 clips made to sound like a chat-app voice note, Standard went from 9 to 15 wrong words in 100 while High accuracy stayed at 10 to 11. So for voice notes, phone calls and noisy rooms, choose High accuracy; for clean speech, Standard is a reasonable quick choice.',
      ],
    },
  ],

  howTitle: 'How to convert Turkish audio to text',
  howToDescription:
    'Add a Turkish recording, choose the quality, press Transcribe, check the special letters and names and download the transcript.',
  steps: [
    {
      title: 'Add your Turkish recording',
      text: 'Put the file in the drop box above, or press Choose a file. Phone videos, WhatsApp voice notes and MP3 or M4A recordings all work. The uploader opens with Turkish chosen under Language.',
    },
    {
      title: 'Choose the quality, then press Transcribe',
      text: 'Standard is good for clear speech. For voice notes, phone calls, noise or anything you will publish, High accuracy or Best accuracy is slower and makes fewer mistakes. Then press Transcribe.',
      browser: {
        text: 'Standard is good for clear speech. For voice notes, phone calls, noise or anything you will publish, High accuracy or Best accuracy is slower and makes fewer mistakes, if your device offers them (a choice it cannot run is greyed out, with the reason); each is a larger first-time download. Then press Transcribe.',
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
      title: 'Check the letters and names, then download',
      text: 'Read the lines marked as unsure, look at İ and ı, at endings on names and at numbers, then download TXT, SRT, VTT, Markdown, JSON or PDF.',
    },
  ],

  formatsTitle: 'Files and downloads for Turkish transcripts',
  formatsIntro:
    'Whatever the recording format, only its sound is read. The special Turkish letters are kept in every download, saved as UTF-8.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'OPUS', 'OGG', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'Turkish text to read, quote and paste' },
    { name: 'SRT', use: 'Turkish subtitles (altyazı) for players and editors' },
    { name: 'VTT', use: 'Turkish subtitles for web video' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for better Turkish transcripts',
  tips: [
    {
      title: 'Choose Turkish yourself.',
      text: 'Auto-detect decides from the start of the file. A recording that opens in English or with music can be taken for another language. Setting Turkish avoids that.',
    },
    {
      title: 'Use High accuracy for voice notes and calls.',
      text: 'On compressed phone audio the smaller model lost about six points in our test and the larger one almost nothing. The larger one is worth the wait for anything that came through a chat app.',
    },
    {
      title: 'Give the vocabulary hint your names.',
      text: 'Names of people, schools, firms and places with endings, such as Beşiktaş’ta or Eskişehir’de, are easier when the plain name is in the vocabulary hint under More options.',
    },
    {
      title: 'Keep subtitle lines short.',
      text: 'Turkish sentences can run long because of the endings. If you make subtitles, check that each line fits on the screen before you export.',
    },
  ],

  faqs: [
    {
      question: 'Can I convert Turkish audio to text for free?',
      answer:
        '{limits} There is no sign-up and no daily or monthly quota, so you can transcribe as many Turkish recordings as you like.',
      browser: {
        answer:
          'Yes. There is no sign-up, no limit on length and no daily or monthly quota. The recording is transcribed on your own device and is not uploaded, so a long file just takes longer, depending on your phone or computer.',
      },
    },
    {
      question: 'How accurate is Turkish speech to text?',
      answer:
        'Better than for many languages. On 30 clean clips, Standard got about 12 words in 100 wrong and High accuracy about 9. Noise, slang and several people at once make it worse, and names and numbers need the most checking.',
    },
    {
      question: 'Does it write İ and ı, ğ and ş correctly?',
      answer:
        'Yes, the transcript carries the Turkish letters and the apostrophe before an ending on a name. Words that differ only by a dot, such as ılık (lukewarm) and ilik (bone marrow), can still be mixed up, so check them with the audio.',
    },
    {
      question: 'Can I get English text from Turkish audio?',
      answer:
        'Yes. In More options, set Output to Translate to English. The translation is automatic, so read it before you use it, especially for names and numbers.',
    },
    {
      question: 'Can I make Turkish subtitles for a YouTube video?',
      answer:
        'Yes. Transcribe the video, correct the text, download SRT or VTT and add that file as the subtitles of your video in YouTube Studio or in your editor. The guide to adding subtitles shows each step.',
    },
  ],

  links: [
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: 'Get an English draft of a Turkish lecture, interview or meeting.',
    },
    {
      label: 'Lecture to text',
      path: '/lecture-to-text',
      note: 'Turn a long ders kaydı into searchable text with timestamps.',
    },
    {
      label: 'How to add subtitles to a video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Put the Turkish SRT or VTT file on a video in YouTube, VLC or an editor.',
    },
    {
      label: 'Whisper accuracy by language',
      path: '/guides/whisper-accuracy-by-language',
      note: 'Turkish measured on 30 test clips: 12 wrong words in 100 on Standard and 9 on High accuracy.',
    },
  ],
};
