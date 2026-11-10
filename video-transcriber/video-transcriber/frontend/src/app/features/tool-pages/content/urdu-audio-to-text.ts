import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Urdu audio to text',
  h1: 'Urdu audio and video to text in Urdu script',
  lead: 'Turn Urdu speech from a video, a voice note or a recording into Urdu text, written right to left, with a time on every line. Free Urdu speech to text, with no login.',
  browserLead:
    'Turn Urdu speech from a video, a voice note or a recording into Urdu text, written right to left, with a time on every line. Free Urdu speech to text, with no login, and the file never leaves your device.',
  dropKind: 'video',
  dropNoun: 'Urdu video or audio',

  whyTitle: 'Urdu voice to text, in Urdu letters',
  why: [
    'Urdu is spoken by tens of millions of people in Pakistan and India and by communities around the world. People turn Urdu audio into text for family voice notes, news and talk shows, naats and speeches, lectures, interviews, podcasts and YouTube videos. In Urdu the search is often written آڈیو سے ٹیکسٹ (“audio to text”), and it ends up here. The transcript is written in Urdu script with a timestamp on each line, and this page opens the uploader with Urdu already chosen under Language.',
    'Urdu is also a language that mixes. Everyday speech is full of English words such as meeting, office and problem, and in Pakistan it moves in and out of Punjabi, Pashto, Sindhi and other languages. That is normal for the speaker and a lot of work for a recogniser, so read this page for what to expect before you start.',
  ],

  sections: [
    {
      title: 'Urdu, Hindi and Roman Urdu',
      bullets: [
        {
          title: 'Urdu script.',
          text: 'The transcript is written in Urdu script, from right to left. It is the script of Urdu newspapers, books and official forms, and the one this page produces.',
        },
        {
          title: 'Urdu or Hindi?',
          text: 'Spoken Urdu and Hindi are very close. If the speech uses many Persian and Arabic words, as in poetry, news and film dialogue, choose Urdu. If it is everyday speech with Sanskrit-origin words and you want Devanagari letters, the Hindi page may suit it better.',
        },
        {
          title: 'Roman Urdu.',
          text: 'Many people type Urdu in English letters on their phones. This page does not convert to Roman Urdu. The Hinglish option on the Hindi page works for Hindi only, so for Roman Urdu you would have to convert the Urdu text yourself.',
        },
        {
          title: 'English words in Urdu speech.',
          text: 'The recogniser may write an English word in Urdu letters or in Latin letters, and it can switch between them in one recording. Search and replace in the editor makes them consistent.',
        },
      ],
    },
    {
      title: 'What Urdu writing asks of a transcript',
      paragraphs: [
        'Urdu uses the Arabic alphabet with extra letters of its own, such as tteh (ٹ), ddal (ڈ) and rreh (ڑ), and the short vowel marks are normally not written. Some short look-alike words, such as hai (ہے) and hain (ہیں), or ke “that” (کہ) and ke “of” (کے), can be mixed up, so read for sense and replay the timestamped line when a word looks wrong.',
        'Numbers may appear as Western digits (123) or Urdu digits (۱۲۳), and names of people and places are often spelled in more than one way. Put the names you care about in the vocabulary hint and choose one number style when you edit.',
      ],
    },
    {
      title: 'How accurate is Urdu transcription here?',
      paragraphs: [
        'We tested the two models behind Standard and High accuracy on 30 clean Urdu clips, people reading sentences aloud. High accuracy got about 24 words in 100 wrong. Standard got about 45 on the clips it finished, and on some clips it repeated itself for minutes, so it is not a good choice for Urdu.',
        'Treat the result as a draft. Choose High accuracy, or Best accuracy if your device offers it, set the language to Urdu yourself, and plan a careful read-through with the audio. On 10 clips made to sound like a chat-app voice note, High accuracy scored about the same as on clean speech (26 and 24 wrong words in 100).',
      ],
    },
  ],

  howTitle: 'How to convert Urdu audio to text',
  howToDescription:
    'Add an Urdu recording, choose High accuracy, press Transcribe, read the result with the audio and download the transcript.',
  steps: [
    {
      title: 'Add your Urdu recording',
      text: 'Put the file in the drop box above, or press Choose a file. Phone videos, WhatsApp voice notes and MP3 or M4A recordings all work. The uploader opens with Urdu chosen under Language.',
    },
    {
      title: 'Choose High accuracy, then press Transcribe',
      text: 'Urdu gains more from a bigger model than most languages do. Use High accuracy or Best accuracy for anything you will publish or quote, and keep Standard for a quick, rough look. Then press Transcribe.',
      browser: {
        text: 'Urdu gains more from a bigger model than most languages do. Use High accuracy or Best accuracy if your device offers them (a choice it cannot run is greyed out, with the reason); each is a larger first-time download. Keep Standard for a quick, rough look. Then press Transcribe.',
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
      title: 'Read it with the audio, then download',
      text: 'Read the lines marked as unsure, replay the doubtful ones from their timestamps, fix names and numbers, then download TXT, SRT, VTT, Markdown, JSON or PDF.',
    },
  ],

  formatsTitle: 'Files and downloads for Urdu transcripts',
  formatsIntro:
    'Whatever the recording format, only its sound is read. The Urdu stays in Urdu script, right to left, in every download.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'OPUS', 'OGG', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'Urdu text to read, quote and paste' },
    { name: 'SRT', use: 'Urdu subtitles for players and editors' },
    { name: 'VTT', use: 'Urdu subtitles for web video' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for better Urdu transcripts',
  tips: [
    {
      title: 'Choose Urdu, not auto-detect.',
      text: 'Urdu sounds like Hindi, and auto-detect can take one for the other, or take a recording that opens in English for English. Setting Urdu yourself avoids it.',
    },
    {
      title: 'Cut the noise before you start.',
      text: 'Urdu recordings are often made on a phone in a busy room. Keep Enhance audio on, move the microphone closer when you record, and avoid music under the voice.',
    },
    {
      title: 'Put names in the vocabulary hint.',
      text: 'Names of people, places and organisations can be written in several ways in Urdu letters. Type them into the Vocabulary hint under More options, the way they should appear.',
    },
    {
      title: 'Saving Urdu text and subtitles.',
      text: 'TXT, SRT, VTT and Markdown are saved as UTF-8, so Urdu opens correctly in modern editors and video apps. If a player puts a full stop at the wrong end of a right-to-left line, fix it in a subtitle editor.',
      browser: {
        text: 'TXT, SRT, VTT and Markdown are saved as UTF-8, so Urdu opens correctly in modern editors and video apps. If a player puts a full stop at the wrong end of a right-to-left line, fix it in a subtitle editor. For an Urdu PDF, your browser opens its print window: choose Save as PDF there.',
      },
    },
  ],

  faqs: [
    {
      question: 'Can I convert Urdu audio to text for free?',
      answer:
        '{limits} There is no sign-up and no daily or monthly quota, so you can transcribe as many Urdu recordings as you like.',
      browser: {
        answer:
          'Yes. There is no sign-up, no limit on length and no daily or monthly quota. The recording is transcribed on your own device and is not uploaded, so a long file just takes longer, depending on your phone or computer.',
      },
    },
    {
      question: 'How accurate is Urdu speech to text?',
      answer:
        'It is weaker than for Spanish or German. On 30 clean clips, High accuracy got about 24 words in 100 wrong, and Standard about 45. So choose High accuracy, expect to correct the text, and check names and numbers first.',
    },
    {
      question: 'Does it write Roman Urdu?',
      answer:
        'No. The transcript is in Urdu script. The Roman letters option on this website is for Hindi only. If you need Roman Urdu, convert the Urdu text yourself after you download it.',
    },
    {
      question: 'Can I get English text from Urdu audio?',
      answer:
        'Yes. In More options, set Output to Translate to English. The translation is automatic, so read it before you use it, especially for names and numbers.',
    },
    {
      question: 'Can I use it for Urdu news, speeches and YouTube videos?',
      answer:
        'Yes, for any recording you have as a file, as long as you have the right to use it. Clear speech comes out best, and music, applause and several voices at once are harder. Download SRT or VTT if you want Urdu subtitles for the video.',
    },
  ],

  links: [
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: 'Get an English draft of an Urdu speech, interview or voice note.',
    },
    {
      label: 'Hindi audio to text',
      path: '/hindi-audio-to-text',
      note: 'The closest language: use it for everyday Hindi speech, with Devanagari or Roman letters.',
    },
    {
      label: 'WhatsApp voice message to text',
      path: '/whatsapp-voice-message-to-text',
      note: 'Save an Urdu voice note from a chat and read it as text.',
    },
    {
      label: 'Whisper accuracy by language',
      path: '/guides/whisper-accuracy-by-language',
      note: 'Urdu measured on 30 test clips: 24 wrong words in 100 on High accuracy, and why Standard struggles.',
    },
  ],
};
