import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Bengali audio to text',
  h1: 'Bengali (Bangla) audio to text, with honest limits',
  lead: 'Turn Bengali speech from a video, a voice note or a recording into Bengali text with a time on every line. Free, with no login. Bengali is the hardest language we measured, so this page also tells you what to expect.',
  browserLead:
    'Turn Bengali speech from a video, a voice note or a recording into Bengali text with a time on every line. Free, with no login, and the file never leaves your device. Bengali is the hardest language we measured, so this page also tells you what to expect.',
  dropKind: 'video',
  dropNoun: 'Bengali video or audio',

  whyTitle: 'Bangla speech to text: what it can and cannot do today',
  why: [
    'Bengali, also called Bangla, is the language of Bangladesh and West Bengal, with hundreds of millions of speakers. People search for Bengali audio to text, Bangla voice to text or অডিও থেকে টেক্সট (“audio to text”) to turn family voice notes, lectures, news, interviews, podcasts and YouTube videos into text. This page opens the uploader with Bengali already chosen under Language, and the transcript is written in Bengali script with a timestamp on each line.',
    'We would rather tell you the truth than promise a perfect transcript. In our own tests Bengali was the weakest of 16 languages, far behind Spanish or Japanese. It can still help with a short, clear clip, and the timestamps make it easier to find your place while you correct the text, but for a long recording it may not save you time. The figures are below, so you can decide before you start.',
  ],

  sections: [
    {
      title: 'How accurate is Bengali transcription here?',
      paragraphs: [
        'We tested the two models behind Standard and High accuracy on 30 clean Bengali clips, people reading sentences aloud. High accuracy got about 82 words in 100 wrong, which means most words need fixing. Standard did worse: it often repeated itself and invented text, so it produced more wrong words than the clips contain.',
        'That is a limit of the models, which have heard very little Bengali compared with Spanish or English, not of the recording or of how you use this page. Dedicated Indian-language speech models did much better in our tests on the same kind of clips, and we are checking whether they can run in a browser with a download of a sensible size. We will not promise a date.',
      ],
    },
    {
      title: 'Where Bengali speech transcription helps',
      bullets: [
        {
          title: 'Short, clear clips.',
          text: 'A voice note of half a minute, spoken slowly in a quiet room, gives the recogniser its best chance. Try a short clip first to see what you get.',
        },
        {
          title: 'Finding your place.',
          text: 'Even a rough transcript has a time on each line, so you can jump to the part you need in a long recording and type the final text yourself.',
        },
        {
          title: 'Names and numbers.',
          text: 'Names, numbers and technical words are where Bengali output is least reliable. Check them against the audio every time.',
        },
        {
          title: 'English text.',
          text: 'You can also choose Translate to English under More options. The result is an automatic draft built on the same recognition, so treat it as a rough guide to the meaning, not as a translation.',
        },
      ],
    },
    {
      title: 'Bengali as it is spoken and written',
      paragraphs: [
        'Standard Bengali is understood in both Bangladesh and West Bengal, but speech varies. Dhaka and Kolkata speech sound different, and dialects such as Sylheti and Chittagonian are far from the standard and are much harder for any recogniser. Bengali also mixes English words freely, which may be written in Bengali letters or in Latin letters.',
        'Bengali writing joins consonants into conjunct letters, and the digits may appear as Bengali numerals (১২৩) or Western ones (123). The text is saved as UTF-8, so it opens correctly in modern editors and video apps, but a plain-looking error such as a missing vowel sign changes the word, so proofread slowly.',
      ],
    },
  ],

  howTitle: 'How to convert Bengali audio to text',
  howToDescription:
    'Add a short, clear Bengali recording, choose High accuracy, press Transcribe, correct the text with the audio and download it.',
  steps: [
    {
      title: 'Add a clear Bengali recording',
      text: 'Put the file in the drop box above, or press Choose a file. Start with a short clip. Phone videos, WhatsApp voice notes and MP3 or M4A recordings all work. The uploader opens with Bengali chosen under Language.',
    },
    {
      title: 'Choose High accuracy, then press Transcribe',
      text: 'For Bengali, Standard is not worth using. Pick High accuracy, or Best accuracy if it is offered, then press Transcribe.',
      browser: {
        text: 'For Bengali, Standard is not worth using. Pick High accuracy, or Best accuracy if your device offers it (a choice it cannot run is greyed out, with the reason); each is a larger first-time download. Then press Transcribe.',
      },
    },
    {
      title: 'Follow the progress',
      text: 'Lines appear with their times while the file is processed. Enhance audio and Skip silence & music are on by default, and the second one removes many made-up lines.',
      browser: {
        text: 'Lines appear with their times while the file is processed. Enhance audio and Skip silence & music are on by default, and the second one removes many made-up lines. The first time, your browser also downloads the speech model once and keeps it for later.',
      },
    },
    {
      title: 'Correct the text with the audio, then download',
      text: 'Replay each line from its timestamp and fix it in the editor, starting with the lines marked as unsure. Then download TXT, SRT, VTT, Markdown, JSON or PDF.',
    },
  ],

  formatsTitle: 'Files and downloads for Bengali transcripts',
  formatsIntro:
    'Whatever the recording format, only its sound is read. The Bengali stays in Bengali script in every download.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'OPUS', 'OGG', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'Bengali text to correct, quote and paste' },
    { name: 'SRT', use: 'Bengali subtitles for players and editors' },
    { name: 'VTT', use: 'Bengali subtitles for web video' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for the best Bengali result',
  tips: [
    {
      title: 'Choose Bengali yourself.',
      text: 'Never leave Bengali on auto-detect. A recording that starts with an English word or with music can be taken for another language, and the whole text then comes out wrong.',
    },
    {
      title: 'Keep Skip silence & music on.',
      text: 'It is on by default under More options. For a language the model knows poorly, it removes most of the lines the model makes up in the quiet parts, and it makes long recordings faster.',
    },
    {
      title: 'Prefer one voice at a time.',
      text: 'Speech from one person, close to the microphone and without background music, is the case that works best. Several people talking over each other makes a weak result worse.',
    },
    {
      title: 'Saving Bengali text and subtitles.',
      text: 'TXT, SRT, VTT and Markdown are saved as UTF-8, so Bengali opens correctly in modern editors and video apps.',
      browser: {
        text: 'TXT, SRT, VTT and Markdown are saved as UTF-8, so Bengali opens correctly in modern editors and video apps. For a Bengali PDF, your browser opens its print window: choose Save as PDF there.',
      },
    },
  ],

  faqs: [
    {
      question: 'Can I convert Bengali audio to text for free?',
      answer:
        '{limits} There is no sign-up and no daily or monthly quota, so you can try as many Bengali recordings as you like.',
      browser: {
        answer:
          'Yes. There is no sign-up, no limit on length and no daily or monthly quota. The recording is transcribed on your own device and is not uploaded, so a long file just takes longer, depending on your phone or computer.',
      },
    },
    {
      question: 'How accurate is Bengali speech to text?',
      answer:
        'Not very. On 30 clean clips, High accuracy got about 82 words in 100 wrong, and Standard was worse. Use the result as rough notes with timestamps, check every line with the audio, and try a short clip before you commit to a long one.',
    },
    {
      question: 'Why is Bengali so much weaker than Spanish or Hindi?',
      answer:
        'The models learned from audio found on the internet, where Spanish has thousands of hours and Bengali very few. Hindi is also weaker than Spanish, but Bengali is further behind. Better Bengali models exist, and we are testing whether they can run in a browser.',
    },
    {
      question: 'Is it the same as Bangla voice to text?',
      answer:
        'Yes. Bangla and Bengali are two names for the same language, and this page produces text in Bengali script from both Bangladesh and West Bengal speech. Strong regional dialects are harder than standard speech.',
    },
    {
      question: 'Can I get English text from Bengali audio?',
      answer:
        'You can choose Translate to English in More options, and the result is an automatic draft. Because the Bengali recognition underneath is weak, treat it as a rough guide to the meaning and not as a translation you can publish.',
    },
  ],

  links: [
    {
      label: 'Whisper accuracy by language',
      path: '/guides/whisper-accuracy-by-language',
      note: 'The full table for 16 languages, with Bengali measured on 30 test clips and how we ran the test.',
    },
    {
      label: 'Hindi audio to text',
      path: '/hindi-audio-to-text',
      note: 'The nearest large language in the same region, with better results and a Roman letters option.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'Cleaner audio, the right language and a vocabulary hint all help most when a language is hard.',
    },
    {
      label: 'WhatsApp voice message to text',
      path: '/whatsapp-voice-message-to-text',
      note: 'Save a short Bengali voice note from a chat and try it here.',
    },
  ],
};
