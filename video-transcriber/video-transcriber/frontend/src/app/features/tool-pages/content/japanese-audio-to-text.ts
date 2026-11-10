import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Japanese audio to text',
  h1: 'Japanese audio to text, in kanji, hiragana and katakana',
  lead: 'Turn Japanese speech from a video, a voice note or a recording into text with a time on every line. 文字起こし (mojiokoshi), free and with no login.',
  browserLead:
    'Turn Japanese speech from a video, a voice note or a recording into text with a time on every line. 文字起こし (mojiokoshi), free, with no login, and the file never leaves your device.',
  dropKind: 'video',
  dropNoun: 'Japanese video or audio',

  whyTitle: 'Japanese speech to text, with the right characters',
  why: [
    'In Japanese, turning speech into text is called 文字起こし (mojiokoshi), and people search for 音声 文字起こし or 動画 文字起こし when they need a lecture, a meeting, an interview, a podcast, a YouTube video or a voice note written down. This page gives you Japanese text with a timestamp on every line, ready to read, search or turn into SRT and VTT subtitles. It opens the uploader with Japanese already chosen under Language.',
    'Japanese is one of the languages where our tests came out well, but the result is still not perfect. Japanese has no spaces between words and uses four kinds of writing, kanji, hiragana, katakana and Latin letters, so the sections below say what a transcript can and cannot get right.',
  ],

  sections: [
    {
      title: 'Kanji, kana and homophones',
      bullets: [
        {
          title: 'Kanji or kana.',
          text: 'The recogniser chooses between kanji and hiragana by context, so a word you would write in kanji may come out in kana, or the other way round. This is usually still readable. Fix it in the editor if you publish.',
        },
        {
          title: 'Words that sound alike.',
          text: 'Japanese has many homophones, such as 橋, 箸 and 端 (all hashi). The context usually decides, but not always, so replay the timestamped line when a word looks wrong.',
        },
        {
          title: 'Names.',
          text: 'The same name can be written with different kanji. A recogniser cannot know which one a person uses, so type the exact spelling of important names into the Vocabulary hint under More options.',
        },
        {
          title: 'Foreign words.',
          text: 'English terms in business and technology are usually written in katakana (ミーティング, データ), but sometimes in Latin letters. Pick one style when you edit.',
        },
      ],
    },
    {
      title: 'Writing details of a Japanese transcript',
      paragraphs: [
        'Polite speech (です・ます) and plain speech (だ・である) are written as they are spoken, so the transcript keeps the speaker’s level of politeness. Punctuation is usually 。 and 、, and numbers may appear as digits or as kanji numerals (一, 二, 三), so choose one style when you edit.',
        'Furigana (the small reading aids above kanji) are not added. For subtitles, Japanese lines are normally kept short because there are no spaces to break on. Check the line length in a subtitle editor before you publish.',
      ],
    },
    {
      title: 'How accurate is Japanese transcription here?',
      paragraphs: [
        'We tested the two models behind Standard and High accuracy on 30 clean Japanese clips, people reading sentences aloud. Japanese has no spaces, so we count wrong characters, not words: Standard got about 13 characters in 100 wrong and High accuracy fewer than 5.',
        'On 10 clips made to sound like a chat-app voice note, Standard stayed about the same and High accuracy went from 5 to 7 wrong characters in 100. For anything you will publish, choose High accuracy, or Best accuracy if your device offers it, and still read the result: names, numbers and technical words are where mistakes remain.',
      ],
    },
  ],

  howTitle: 'How to convert Japanese audio to text',
  howToDescription:
    'Add a Japanese recording, choose the quality, press Transcribe, check names and homophones and download the transcript.',
  steps: [
    {
      title: 'Add your Japanese recording',
      text: 'Put the file in the drop box above, or press Choose a file. Phone videos, voice recordings and MP3 or M4A files all work. The uploader opens with Japanese chosen under Language.',
    },
    {
      title: 'Choose the quality, then press Transcribe',
      text: 'Standard works for clear speech. For lectures, interviews and anything you will publish, High accuracy or Best accuracy is slower and makes far fewer mistakes. Then press Transcribe.',
      browser: {
        text: 'Standard works for clear speech. For lectures, interviews and anything you will publish, High accuracy or Best accuracy is slower and makes far fewer mistakes, if your device offers them (a choice it cannot run is greyed out, with the reason); each is a larger first-time download. Then press Transcribe.',
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
      title: 'Check names and homophones, then download',
      text: 'Read the lines marked as unsure, check names, numbers and words that sound alike against the audio, then download TXT, SRT, VTT, Markdown, JSON or PDF.',
    },
  ],

  formatsTitle: 'Files and downloads for Japanese transcripts',
  formatsIntro:
    'Whatever the recording format, only its sound is read. The Japanese characters are kept in every download, saved as UTF-8.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'OPUS', 'OGG', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'Japanese text to read, quote and paste' },
    { name: 'SRT', use: 'Japanese subtitles (字幕) for players and editors' },
    { name: 'VTT', use: 'Japanese subtitles for web video' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for better Japanese transcripts',
  tips: [
    {
      title: 'Choose Japanese yourself.',
      text: 'Auto-detect decides from the start of the file. A recording that opens with English or with music can be taken for another language. Setting Japanese avoids that.',
    },
    {
      title: 'Use High accuracy for anything you publish.',
      text: 'In our test the larger model made fewer than half as many mistakes in Japanese as the smaller one. It is the better choice for lectures, interviews and subtitles.',
    },
    {
      title: 'Give the exact kanji of names to the vocabulary hint.',
      text: 'Names of people, companies, products and places are written in kanji that the recogniser cannot guess. Type them into the Vocabulary hint the way they should appear.',
    },
    {
      title: 'Check subtitle length.',
      text: 'Japanese subtitle lines are usually short. If you make subtitles, check that each line fits on the screen, and split long sentences in a subtitle editor. TXT, SRT, VTT and Markdown are saved as UTF-8, so Japanese opens correctly in modern editors and video apps.',
      browser: {
        text: 'Japanese subtitle lines are usually short. If you make subtitles, check that each line fits on the screen, and split long sentences in a subtitle editor. TXT, SRT, VTT and Markdown are saved as UTF-8, so Japanese opens correctly in modern editors and video apps. For a Japanese PDF, your browser opens its print window: choose Save as PDF there.',
      },
    },
  ],

  faqs: [
    {
      question: 'Can I convert Japanese audio to text for free?',
      answer:
        '{limits} There is no sign-up and no daily or monthly quota, so you can transcribe as many Japanese recordings as you like.',
      browser: {
        answer:
          'Yes. There is no sign-up, no limit on length and no daily or monthly quota. The recording is transcribed on your own device and is not uploaded, so a long file just takes longer, depending on your phone or computer.',
      },
    },
    {
      question: 'How accurate is Japanese speech to text?',
      answer:
        'Good on clear speech. On 30 clean clips, Standard got about 13 characters in 100 wrong and High accuracy fewer than 5. Names, numbers, specialised words and homophones need the most checking.',
    },
    {
      question: 'Does it add furigana or spaces between words?',
      answer:
        'No. Japanese is written without spaces, and the reading aids (furigana) above kanji are not added. The transcript is plain Japanese text with 。 and 、 and a time on each line.',
    },
    {
      question: 'Can I get English text from Japanese audio?',
      answer:
        'Yes. In More options, set Output to Translate to English. The translation is automatic, so read it before you use it, especially for names, numbers and polite or indirect phrases.',
    },
    {
      question: 'Can I make Japanese subtitles for a video?',
      answer:
        'Yes. Transcribe the video, correct the text, download SRT or VTT and add that file as the subtitles of your video in YouTube Studio, VLC or your editor. The guide to adding subtitles shows each step.',
    },
  ],

  links: [
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: 'Get an English draft of a Japanese lecture, interview or meeting.',
    },
    {
      label: 'YouTube subtitle generator',
      path: '/youtube-subtitle-generator',
      note: 'Make Japanese or English subtitle files for a YouTube video.',
    },
    {
      label: 'How to add subtitles to a video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Put the Japanese SRT or VTT file on a video in YouTube, VLC or an editor.',
    },
    {
      label: 'Whisper accuracy by language',
      path: '/guides/whisper-accuracy-by-language',
      note: 'Japanese measured on 30 test clips: 13 wrong characters in 100 on Standard and under 5 on High accuracy.',
    },
  ],
};
