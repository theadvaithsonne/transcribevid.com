import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Translate Hindi to English',
  h1: 'Translate Hindi audio to English text',
  lead: 'Get English text straight from Hindi speech, or from Marathi, Tamil, Bengali and 50+ other languages. Every line keeps its timestamp, so the English works as subtitles too. Free, with no login.',
  browserLead:
    'Get English text straight from Hindi speech, or from Marathi, Tamil, Bengali and 50+ other languages. Every line keeps its timestamp, so the English works as subtitles too. Free, with no login, and your file never leaves your device.',
  dropKind: 'video',
  dropNoun: 'audio or video',

  whyTitle: 'When speech-to-English translation helps',
  why: [
    'Sometimes you need to know what was said rather than how it sounded: a family video for relatives abroad, a Hindi lecture for a classmate who reads only English, a customer voice note, or English subtitles for a Hindi Reel. Here it happens in one step: the speech recognition model listens to the Hindi and writes English.',
    'It is a machine translation of speech. It gets the meaning right more often than the exact wording, and idioms, jokes, names and numbers need a check. For anything official or legal, ask a person who knows both languages to review the text.',
  ],

  howTitle: 'How to translate Hindi audio into English',
  howToDescription: 'Add the recording, set the spoken language, choose Translate to English under Output, wait and download the English text.',
  steps: [
    {
      title: 'Add the file',
      text: 'Drop the video or audio in the box at the top of this page, or press Choose a file.',
    },
    {
      title: 'Set the spoken language',
      text: 'Choose the language that is spoken, for example Hindi, not English. That tells the model what it is listening to.',
    },
    {
      title: 'Turn on translation',
      text: 'Open More options and set Output to Translate to English. Keep the Whisper engine: the experimental Qwen engine does not translate.',
    },
    {
      title: 'Read and download',
      text: 'Check that the English says what you expect, fix what is off, then download TXT, SRT, VTT or PDF.',
    },
  ],

  formatsTitle: 'What goes in and what comes out',
  formatsIntro: 'Any common video or audio file. The downloads are in English, with the timestamps of the original speech.',
  uploadTitle: 'Files you can use',
  accepts: ['MP4', 'MOV', 'MKV', 'WEBM', 'MP3', 'M4A', 'WAV', 'OPUS'],
  downloads: [
    { name: 'SRT', use: 'English subtitles for a Hindi video' },
    { name: 'VTT', use: 'English subtitles for web players' },
    { name: 'TXT', use: 'the English text to read or share' },
    { name: 'PDF', use: 'a printable English copy' },
    { name: 'Markdown', use: 'English notes with timestamps' },
    { name: 'JSON', use: 'lines and times for programs' },
  ],

  tipsTitle: 'Tips for a better English translation',
  tips: [
    {
      title: 'Choose the right quality.',
      text: 'Best accuracy (Whisper Large v3) gives the best translation, and Standard is fine for a quick read. Avoid High accuracy (Large v3 Turbo) for translation: OpenAI trained it for transcription only, and it may give you Hindi back instead of English.',
    },
    {
      title: 'Want both Hindi and English?',
      text: 'Add the same file twice: once with Output set to Transcribe, once with Translate to English. You get two transcripts you can compare line by line.',
    },
    {
      title: 'English is the only target.',
      text: 'Speech is always translated into English. Translating into Hindi or other languages is not offered.',
    },
    {
      title: 'Hinglish is not translation.',
      text: 'If you want the Hindi words in Roman letters rather than English, keep Output on Transcribe and set Transcript style to Hinglish.',
    },
    {
      title: 'Check numbers and names.',
      text: 'Amounts, dates and names are where translation slips most. Compare them with the audio; the timestamp takes you to the right moment.',
    },
  ],

  faqs: [
    {
      question: 'Which languages can be translated into English?',
      answer:
        'Any of the 50+ spoken languages in the list, including Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi and Urdu. The result follows how well the model knows the language, and Hindi usually does better than the smaller languages.',
    },
    {
      question: 'Can I translate English audio into Hindi?',
      answer:
        'No. Speech can only be translated into English here. You can transcribe English audio as English text and use a separate text translator afterwards.',
    },
    {
      question: 'Is the translation word for word?',
      answer:
        'No. The model writes natural English for the meaning of each passage, so a line can be shorter, or in a different order, than the Hindi. The timestamps still match the speech.',
    },
    {
      question: 'Can I get English subtitles for a Hindi video?',
      answer:
        'Yes. Translate, then download SRT or VTT. Play the video with them before you publish and check that each line reads well with the picture.',
    },
    {
      question: 'Is my recording kept after translation?',
      answer:
        'Only for your session. It is deleted automatically when the session ends, or when you press Delete my data now. No account is needed.',
      browser: {
        answer:
          'Only in this browser: the file never leaves your device. It is deleted automatically after a period of inactivity, or when you press Delete my data now. No account is needed.',
      },
    },
  ],

  related: ['/hindi-audio-to-text', '/hinglish-transcription', '/srt-subtitle-generator', '/lecture-to-text', '/video-to-text'],
};
