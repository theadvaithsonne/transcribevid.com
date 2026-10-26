import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'German audio to text',
  h1: 'German audio to text, with umlauts, ß and long words',
  lead: 'German speech from Germany, Austria or Switzerland, turned into text with ä, ö, ü and ß, long compound words and a time on each line. Free, with no login.',
  dropKind: 'video',
  dropNoun: 'German video or audio',

  whyTitle: 'German speech, written down correctly',
  why: [
    'German is the main language of Germany and Austria, one of the national languages of Switzerland, and spoken in Luxembourg, Liechtenstein, South Tyrol and parts of Belgium. Written German is much the same everywhere, but speech is not: a news report from Hamburg, a lecture in Vienna and a meeting in Zürich sound quite different. This page starts the uploader with German selected.',
    'German recordings tend to be long and formal: a Vorlesung (university lecture), an interview for research or journalism, a works meeting, a podcast. A transcript with a time on every line turns an hour of speech into text you can search and quote, and into SRT or VTT Untertitel for a video.',
  ],

  sections: [
    {
      title: 'Standard German, Austrian German and Swiss dialects',
      bullets: [
        {
          title: 'Germany.',
          text: 'Standard German (Hochdeutsch) is what most news, lectures and podcasts use. Regional accents, from Bavarian to northern speech, change the sound, but the text is written in standard German.',
        },
        {
          title: 'Austria.',
          text: 'Austrian speakers use some different words, such as Jänner for January, Erdäpfel for potatoes and heuer for this year, with their own intonation. They are correct German, so check that the text spells them as the speaker meant.',
        },
        {
          title: 'Switzerland.',
          text: 'People in German-speaking Switzerland write standard German but mostly speak Swiss German dialects (Schweizerdeutsch), which differ a lot from it. A recogniser often struggles with everyday dialect, so expect rough results there and better ones from news, lectures and formal talks given in standard German. Swiss writing also uses ss instead of ß.',
        },
        {
          title: 'Dialect and Denglisch.',
          text: 'Strong dialects such as Bavarian, Swabian or Saxon, and Denglisch, the mix of German and English common in business and technology, can cause errors. Keep the setting on German and check the English phrases.',
        },
      ],
    },
    {
      title: 'What German writing asks of a transcript',
      paragraphs: [
        'German joins words into long compounds such as Betriebsratsvorsitzender or Datenschutzgrundverordnung. A recogniser may split one in two or spell it slightly differently. Search for split words when you proofread.',
        'All nouns are capitalised in German, and ä, ö, ü and ß matter: schon and schön are different words, and so are Bar and Bär. The text usually gets these right, but check them in names.',
        'The transcript writes what was said, so Sie and du stay as spoken. Numbers may appear as digits or as words, and German uses a comma for decimals (3,5) and a full stop for thousands (1.000). Make them consistent when you edit.',
      ],
    },
    {
      title: 'Recordings that contain personal data',
      paragraphs: [
        'Interviews with named people and meetings with colleagues contain personal data. Whichever tool you use, get the consent of the people recorded and follow the rules of your organisation before you transcribe.',
      ],
      browser: {
        paragraphs: [
          'Interviews with named people and meetings with colleagues contain personal data. Here the recording is transcribed in your browser, on your own device, and is not uploaded to a server, which many people find easier to justify than sending interviews to an online service. It does not replace your own duty to follow data-protection rules (GDPR, in German the DSGVO), the policy of your organisation and the consent of the people recorded.',
        ],
      },
    },
  ],

  howTitle: 'How to convert German audio to text',
  howToDescription:
    'Add a German recording, start the transcript, proofread names and compound words and download the text.',
  steps: [
    {
      title: 'Add your German recording',
      text: 'Drop the German file into the box above, or press Choose a file. You land on the uploader with German already chosen under Language. Switch it there only if the recording is not in German.',
    },
    {
      title: 'Choose the quality, then press Transcribe',
      text: 'Standard suits clear speech. For dialect, fast conversation or technical talks, High accuracy and Best accuracy are slower and usually make fewer mistakes. Then press Transcribe.',
      browser: {
        text: 'Standard suits clear speech. For dialect, fast conversation or technical talks, High accuracy and Best accuracy are slower and usually make fewer mistakes. Your device may grey a choice out, with the reason, when it cannot run it, and each of the larger ones is a bigger first-time download. Then press Transcribe.',
      },
    },
    {
      title: 'Wait for the text',
      text: 'Each line shows up with its time as it is recognised. Skip silence & music is on by default and keeps pauses from turning into invented words.',
    },
    {
      title: 'Proofread, then download',
      text: 'Go through the lines marked as unsure, look for split compound words, then download TXT, SRT, VTT, Markdown, JSON or PDF.',
    },
  ],

  formatsTitle: 'Files and downloads for German transcripts',
  formatsIntro:
    'Lecture recordings, phone videos and studio files all work, because only the sound is read. The umlauts and ß stay in the text you download, so it opens correctly in current editors and subtitle players.',
  uploadTitle: 'Files you can add',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'FLAC', 'OGG', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'German text for minutes, theses and notes' },
    { name: 'SRT', use: 'Untertitel for players and editors' },
    { name: 'VTT', use: 'Untertitel for web video' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for better German transcripts',
  tips: [
    {
      title: 'Say it is German, and note dialect.',
      text: 'Keep German for standard speech from Germany, Austria and Switzerland. Spoken dialect is harder, so budget extra time to correct it.',
    },
    {
      title: 'Spell the long words out for it first.',
      text: 'Company names, surnames and compounds such as Datenschutzgrundverordnung can go into the Vocabulary hint under More options, written the way you want them. They are more likely to come out right.',
    },
    {
      title: 'Search for split words.',
      text: 'After the transcript is done, search for the compound terms you expect. A split form such as Betriebsrats Vorsitzender is easy to find and fix.',
    },
    {
      title: 'Keep the speaker close.',
      text: 'Echo in a lecture hall and distance from the microphone often cause more errors than any setting. A recorder near the speaker beats a phone at the back.',
    },
  ],

  faqs: [
    {
      question: 'Does German audio to text understand Swiss German dialects?',
      answer:
        'Written and formal spoken German from Switzerland works like any standard German. Everyday spoken dialect, Schweizerdeutsch, often does not, because it differs a lot from standard German and is rarely written. Expect rough results and check them carefully.',
    },
    {
      question: 'Does it handle ä, ö, ü and ß correctly?',
      answer:
        'The text uses them where the recogniser hears them, and the downloaded text files open correctly in current editors and subtitle players. Check names and words that differ by one letter, such as schon and schön.',
    },
    {
      question: 'Why are long German words split or misspelled in my transcript?',
      answer:
        'German compounds can be very long, and the recogniser may write one as two words or spell it a little differently. Add the important ones to the vocabulary hint before you start, and search for the split forms afterwards.',
    },
    {
      question: 'Is it suitable for confidential interviews in German?',
      answer:
        'Check what a tool does with your file before you use it for confidential material, and get the consent of the people you recorded. Here the file is uploaded to the server over an encrypted connection, processed and deleted automatically.',
      browser: {
        answer:
          'Here the recording is transcribed in your browser on your own device and is not uploaded. That does not replace your own duty to follow data-protection rules and the policy of your organisation, and you still need the consent of the people recorded.',
      },
    },
    {
      question: 'Will an Austrian speaker’s Jänner come out as Jänner or as Januar?',
      answer:
        'Either is possible, because the recogniser may write what it hears or the standard form. Check Austrian words such as Jänner, heuer and Erdäpfel against the style you want, and use search and replace to make them consistent.',
    },
  ],

  links: [
    {
      label: 'Interview transcription',
      path: '/interview-transcription',
      note: 'Transcribe interviews for research or journalism.',
    },
    {
      label: 'Lecture to text',
      path: '/lecture-to-text',
      note: 'Turn a recorded Vorlesung into searchable text with timestamps.',
    },
    {
      label: 'Transcribe a video without uploading it',
      path: '/guides/transcribe-video-without-uploading',
      note: 'How in-browser transcription works, and how to check it yourself.',
    },
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: 'Read German speech in English, with timestamps.',
    },
  ],
};
