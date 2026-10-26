import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'French audio to text',
  h1: 'French audio to text, from France to Quebec and beyond',
  lead: 'French from France, Quebec, Belgium, Switzerland or West Africa, written down with every accent, cedilla and apostrophe, and a time on each line. Free, with no login.',
  dropKind: 'video',
  dropNoun: 'French video or audio',

  whyTitle: 'French is spoken far beyond France',
  why: [
    'French is the first language of many people in France, Belgium, Switzerland and Canada, and an official or widely used language in many African countries. A lecture in Paris, a radio programme in Montréal and a meeting in Dakar are all French, yet they sound different. This page starts the uploader with French selected, so the recogniser knows the language from the first second.',
    'French spelling is full of silent letters and look-alike words, which is why a transcript with a time on every line is useful: you can check the doubtful spots against the audio without listening to the whole recording again. The usual material is a cours at university, an interview for research, a podcast, a news or documentary clip, or a meeting at work.',
  ],

  sections: [
    {
      title: 'Varieties of French',
      bullets: [
        {
          title: 'France.',
          text: 'Standard French is the variety most recordings use. Fast, informal speech drops sounds, so “je ne sais pas” can be said as “chais pas”. The recogniser may write what it hears or the full form, and both can appear in one transcript.',
        },
        {
          title: 'Quebec and Canada.',
          text: 'Quebec French has its own vowel sounds, slang and expressions, and uses some English words differently from France. Acadian and Franco-Ontarian French have their own sound too. It is the same French setting, and a larger quality choice often helps.',
        },
        {
          title: 'Belgium and Switzerland.',
          text: 'Belgian and Swiss speakers say septante and nonante for 70 and 90, and in some Swiss regions huitante for 80, where France says soixante-dix, quatre-vingts and quatre-vingt-dix. All are correct French, and the recogniser may write them as words or as digits.',
        },
        {
          title: 'West and North Africa.',
          text: 'French is a first, second or working language in many African countries, and is often mixed with Arabic, Wolof, Lingala, Bambara and other languages. Speech that switches language in one sentence is harder. Keep the setting on French and check the passages in other languages.',
        },
      ],
    },
    {
      title: 'French writing details to check',
      paragraphs: [
        'French has many words that sound the same but are written differently: a and à, et and est, ou and où, ses and ces, son and sont, la and là. Any recogniser can mix them up, so read for sense and replay the timestamped line when a word looks wrong.',
        'The letters é, è, ê, à, ù, ç, œ and ï carry meaning. Conventions for spaces before ? ! : and ; and for « guillemets » around quotations differ between France and Canada, and the recogniser may write simpler punctuation. Apply the conventions you need in your editor or word processor if you publish in French.',
        'Elision makes words run together, as in l’ami, qu’il and c’est. The text should carry the apostrophes, but check them in names and in fast speech.',
      ],
    },
    {
      title: 'Numbers, dates and how people are addressed',
      paragraphs: [
        'French writes decimals with a comma and groups thousands with a space, as in 1 250,50, and puts the day before the month, as in le 27 octobre. A transcript may give a number as digits in one line and as words (quatre-vingt-dix) in the next, so choose one style when you edit.',
        'Tu and vous stay exactly as spoken. If you turn an interview into a quotation, check which one the speaker used, because it says something about the relationship.',
      ],
    },
  ],

  howTitle: 'How to convert French audio to text',
  howToDescription:
    'Add a French recording, choose the quality, press Transcribe, proofread the look-alike words and download the transcript.',
  steps: [
    {
      title: 'Add your French recording',
      text: 'Put the file in the drop box above, or press Choose a file. The uploader then opens with French chosen under Language. If the speech is mostly another language, change it there before you start.',
    },
    {
      title: 'Choose the quality, then press Transcribe',
      text: 'Standard works for clear speech. For regional accents, fast conversation or noise, High accuracy and Best accuracy are slower and usually make fewer mistakes. Then press Transcribe.',
      browser: {
        text: 'Standard works for clear speech. For regional accents, fast conversation or noise, High accuracy and Best accuracy are slower and usually make fewer mistakes, if your device offers them (a choice it cannot run is greyed out, with the reason); each is a larger first-time download. Then press Transcribe.',
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
      title: 'Proofread the look-alikes, then download',
      text: 'Read the lines marked as unsure, then replay any line where a or à, ou or où, ses or ces looks doubtful. When it reads right, download TXT, SRT, VTT, Markdown, JSON or PDF.',
    },
  ],

  formatsTitle: 'Files and downloads for French transcripts',
  formatsIntro:
    'Whatever the recording format, only its sound is read. The accents, cedillas and apostrophes stay in the text you download.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'FLAC', 'OGG', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'French text to read, quote and paste' },
    { name: 'SRT', use: 'sous-titres for players and editors' },
    { name: 'VTT', use: 'sous-titres for web video' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for better French transcripts',
  tips: [
    {
      title: 'Choose French even for regional speech.',
      text: 'Quebec, Belgian, Swiss and African French all use the French setting. If the speech is mostly another language, choose that language instead.',
    },
    {
      title: 'Give the hyphenated names to the vocabulary hint.',
      text: 'Names such as Beaulieu, Saint-Étienne or Trois-Rivières are often misspelled otherwise. Type them into the Vocabulary hint under More options.',
    },
    {
      title: 'Proofread the look-alikes with the audio.',
      text: 'Check a and à, ou and où, ses and ces by replaying the line from its timestamp. It is quicker than reading the whole text twice.',
    },
    {
      title: 'Watch the subtitle line length.',
      text: 'French sentences often run longer than English ones. If you make subtitles, check that the lines are short enough for the screen.',
    },
  ],

  faqs: [
    {
      question: 'Does French audio to text handle Canadian and African French?',
      answer:
        'Yes. Both are French and use the French setting. The sound and the expressions differ from the French of France, so fast or strongly regional speech can be harder. Try a larger quality choice and review the lines marked as unsure.',
    },
    {
      question: 'Why does a French transcript sometimes mix up words that sound the same?',
      answer:
        'French has many homophones, such as a and à or ses and ces. The recogniser chooses by context, which often works but not always. Replay the timestamped line and correct the word.',
    },
    {
      question: 'Does it add the spaces before question marks and the « » quotation marks?',
      answer:
        'Not as a rule. The text usually comes with simple punctuation. If you publish with French typography, add the spaces and guillemets in the editor or in your word processor.',
    },
    {
      question: 'How does it write septante, huitante and nonante?',
      answer:
        'These Belgian and Swiss number words are correct French, and the recogniser may write them as words or as digits. If your readers are in France, you may want to change them to soixante-dix, quatre-vingts and quatre-vingt-dix with search and replace.',
    },
    {
      question: 'Can I transcribe a French meeting that switches to English?',
      answer:
        'Keep the language on French and check the English phrases, which may be written wrongly or with French spelling. If most of the meeting is in English, transcribe it as English instead.',
    },
  ],

  links: [
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: 'Get an English draft of a French interview or lecture.',
    },
    {
      label: 'Lecture to text',
      path: '/lecture-to-text',
      note: 'Turn a French lecture into searchable text with timestamps.',
    },
    {
      label: 'Interview transcription',
      path: '/interview-transcription',
      note: 'Transcribe interviews for research or journalism.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'Fix the recording, the settings and the text when the first result is rough.',
    },
  ],
};
