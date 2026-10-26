import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Translate speech to English',
  h1: 'Translate speech to English text and subtitles',
  lead: 'Add a video or audio file in another language and get English text with timestamps, or an English subtitle file. Free, with no login.',
  dropKind: 'video',
  dropNoun: 'video or audio',

  whyTitle: 'What translating speech to English does',
  why: [
    'Most speech recognition writes down what was said in the language it was said in. Translating to English is a different job. The speaker talks in Hindi, Spanish, German or another supported language, and the text comes out in English, with a timestamp on every line. It helps when you need the gist of a lecture, interview, news clip or family video that you cannot follow, or English subtitles for a video that is in another language.',
    'English is the only language it translates into. There is no translation into French, Hindi or any other language, and written text is not translated: only the speech in the recording. This page starts the uploader with Output set to Translate to English and the spoken language left on Detect automatically.',
  ],

  sections: [
    {
      title: 'How reliable the English is, and what to check',
      paragraphs: [
        'Translation is harder than transcription. The English is produced straight from the sound, with no written text in the original language in between. It is often good enough to follow the meaning, but it can shorten or rephrase sentences, miss idioms and jokes, and get names, numbers and technical words wrong.',
        'Treat the result as a draft for understanding, not as an official translation. For contracts, legal, medical or other important material, ask a human translator, and use a transcript in the original language as the starting point.',
        'A good habit is to make an ordinary transcript in the original language first and the English version second. Where the two seem to disagree, that spot deserves a closer listen. A finished transcript is kept when you use Re-transcribe, so both can come from the same file.',
      ],
    },
    {
      title: 'Which languages and which quality choices translate well',
      bullets: [
        {
          title: 'Any language in the list.',
          text: 'More than 50 spoken languages, from Afrikaans to Welsh, can be translated into English. Quality varies a lot, and it is weakest for languages that have little recorded speech to learn from. If the speech is already in English you do not need this page: use the video to text or audio to text pages.',
        },
        {
          title: 'Name the language, or let it be detected.',
          text: 'Leave Language on Detect automatically when you are not sure what is being spoken. If you know it, choosing it is more reliable, especially for short or accented clips.',
        },
        {
          title: 'Avoid High accuracy for translation.',
          text: 'High accuracy runs the Large v3 Turbo model. OpenAI, who made Whisper, says Turbo is not trained for translation and returns the original language even when translation is requested. Distil Large v3, in the Model list under More options, is English only. For a translation, start with Standard, and choose Best accuracy (Large v3) for difficult speech. Medium, also in that Model list, is another sound choice.',
          browser: {
            text: 'High accuracy runs the Large v3 Turbo model. OpenAI, who made Whisper, says Turbo is not trained for translation and returns the original language even when translation is requested. Distil Large v3, in the Model list under More options, is English only. For a translation, start with Standard, and choose Best accuracy (Large v3) for difficult speech if your device offers it. Medium, also in that Model list, is another sound choice.',
          },
        },
        {
          title: 'Whisper only.',
          text: 'Translating needs the Whisper recognition engine. The experimental Qwen3 ASR choice cannot translate: Translate to English is unavailable while it is selected, and choosing it sets Output back to Transcribe.',
        },
        {
          title: 'No transcript style.',
          text: 'The Transcript style choice (Hinglish or Original script) does not apply to a translation, and it is greyed out while Translate to English is selected.',
        },
      ],
    },
    {
      title: 'What people do with English subtitles and text',
      bullets: [
        {
          title: 'Subtitles for your own video.',
          text: 'Download SRT or VTT. The English lines are timed to the original speech, so they can be added to the same video in a player or an editor.',
        },
        {
          title: 'Understanding a recording.',
          text: 'Read what an interview, lecture or news report is about before you decide whether it needs a proper translation.',
        },
        {
          title: 'Research and journalism.',
          text: 'An English draft helps you decide which passages to have translated carefully, and which to quote from the original language.',
        },
      ],
    },
  ],

  howTitle: 'How to translate speech to English',
  howToDescription:
    'Add a video or audio file in another language, check that Translate to English is selected, wait for the English text and download it.',
  steps: [
    {
      title: 'Add your recording',
      text: 'Drop your recording in the box at the top of this page, or press Choose a file. You land on the uploader with More options open, Output set to Translate to English and Language on Detect automatically. Pick the spoken language if you know it.',
    },
    {
      title: 'Pick the quality, then press Transcribe',
      text: 'Standard is a fair start. For accented, noisy or technical speech choose Best accuracy, which takes longer and usually makes fewer mistakes. Do not choose High accuracy for a translation: it uses a model that was not trained to translate. Then press Transcribe.',
      browser: {
        text: 'Standard is a fair start. For accented, noisy or technical speech choose Best accuracy if your device offers it (a choice it cannot run is greyed out, with the reason); it is a large first-time download, takes longer and usually makes fewer mistakes. Do not choose High accuracy for a translation: it uses a model that was not trained to translate. Then press Transcribe.',
      },
    },
    {
      title: 'Wait for the English text',
      text: 'English lines appear with their times. Transcript style is greyed out because it only applies to transcripts, not to translations.',
    },
    {
      title: 'Check and download',
      text: 'Read the lines marked as unsure, compare names and numbers with the audio, then download TXT, SRT or VTT, or a PDF, Markdown or JSON file.',
    },
  ],

  formatsTitle: 'Files in, English text out',
  formatsIntro:
    'Video and audio in many formats work, whichever language is spoken. The files you download contain the English text.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'MKV', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'English text to read' },
    { name: 'SRT', use: 'English subtitles timed to the speech' },
    { name: 'VTT', use: 'English subtitles for a web player' },
    { name: 'PDF', use: 'a printable copy' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for better translations',
  tips: [
    {
      title: 'Name the spoken language when you know it.',
      text: 'Automatic detection is fine for clear speech, but a wrong guess on a short clip gives a poor translation.',
    },
    {
      title: 'Keep clips to one language.',
      text: 'A recording that keeps switching between languages can confuse translation. Split it, or make an ordinary transcript first to see what was heard.',
    },
    {
      title: 'Check numbers, names and dates.',
      text: 'They are the details that matter most and the ones most often wrong in a translated draft.',
    },
    {
      title: 'Test the first minute.',
      text: 'Read the first minute of English against the audio before you rely on the whole file.',
    },
    {
      title: 'Keep the original beside the English.',
      text: 'If you publish a quotation, keep the transcript in the original language next to the English version.',
    },
  ],

  faqs: [
    {
      question: 'Can it translate speech into languages other than English?',
      answer:
        'No. English is the only language it translates into. To read the speech in its own language, make an ordinary transcript instead.',
    },
    {
      question: 'Why is a translated transcript less exact than an ordinary one?',
      answer:
        'Translation is a harder task than writing down the words. The speech has to be understood and restated in one step, so sentences may be shortened, idioms and jokes missed and names misheard. Check anything important against the audio or against a transcript in the original language.',
    },
    {
      question: 'Why did my translation come out in the original language?',
      answer:
        'The likely cause is the quality choice. High accuracy runs the Large v3 Turbo model, which was not trained to translate and tends to write the original language instead. Start again with Standard or Best accuracy, and check that Output is set to Translate to English.',
    },
    {
      question: 'Can I get English subtitles for a video in another language?',
      answer:
        'Yes. After the translation, download SRT or VTT. The English lines carry the timing of the original speech. Read them through before you publish, and remember that the translation is a draft.',
    },
    {
      question: 'Why can I not choose Translate to English?',
      answer:
        'It is not available for the experimental Qwen3 ASR engine. Switch Recognition engine back to Whisper in More options and the choice returns.',
    },
  ],

  links: [
    {
      label: 'Hindi audio to text',
      path: '/hindi-audio-to-text',
      note: 'Read Hindi speech in its own language before you translate it.',
    },
    {
      label: 'Spanish audio to text',
      path: '/spanish-audio-to-text',
      note: 'Make a Spanish transcript with accents, without translating it.',
    },
    {
      label: 'YouTube subtitle generator',
      path: '/youtube-subtitle-generator',
      note: 'Make an SRT for your own video and upload it in YouTube Studio.',
    },
    {
      label: 'How to add subtitles to a video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'What to do with the SRT or VTT file once you have it.',
    },
  ],
};
