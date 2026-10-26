import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Portuguese audio to text',
  h1: 'Portuguese audio to text for Brazil and Portugal',
  lead: 'Portuguese speech from Brazil, Portugal, Angola or Mozambique, written down with its accents, tildes and cedillas and a time on each line. Free, with no login.',
  dropKind: 'video',
  dropNoun: 'Portuguese video or audio',

  whyTitle: 'Brazilian and European Portuguese',
  why: [
    'Portuguese is the language of Brazil and Portugal and an official language in Angola, Mozambique and several other countries. Brazilian and European Portuguese share a written language, but they sound quite different, and some words and spellings differ too. This page starts the uploader with Portuguese selected, which is the one setting for both.',
    'In Brazil the áudio, a voice message sent in place of typing, is part of daily life, and some of them run for minutes. Beyond chat, the recordings that come up are aulas (lectures), reuniões (meetings), entrevistas (interviews), podcasts and videos for the web. What you get back is searchable text, and legendas, meaning SRT or VTT subtitles, with a time on every line.',
  ],

  sections: [
    {
      title: 'What changes between Brazil and Portugal',
      bullets: [
        {
          title: 'The sound.',
          text: 'European Portuguese reduces many unstressed vowels, so words can sound clipped. Brazilian Portuguese keeps its vowels more open, and in most regions says t and d before i as “tch” and “dj”. Both are Portuguese. A larger quality choice often helps with the clipped European sound.',
        },
        {
          title: 'Spelling.',
          text: 'The 1990 spelling agreement brought the two countries closer, but some words still differ: facto in Portugal and fato in Brazil, equipa and equipe. Some words are simply different, such as ecrã and tela, or autocarro and ônibus. The recogniser may follow the speaker or mix the two, so choose one and make the text consistent.',
        },
        {
          title: 'Addressing people.',
          text: 'Brazilians say você and often use a gente for we. Speakers in Portugal often use tu, and attach pronouns to the verb with a hyphen, as in “diz-me”. These forms are all part of the language, so expect both in the text.',
        },
        {
          title: 'Africa and beyond.',
          text: 'In Angola, Mozambique, Cape Verde and elsewhere, Portuguese is spoken with local rhythms and words, and sometimes mixed with other languages. Results vary with the accent and the recording, so check carefully.',
        },
      ],
    },
    {
      title: 'Voice messages and everyday speech',
      paragraphs: [
        'Spoken Portuguese is looser than written Portuguese. In Brazilian chat audio you will hear tá for está, pra for para, cê for você and the tag né, short for não é. In Portugal, tás for estás and the interjection pá are common. The recogniser may write these as heard in one line and as standard words in the next.',
        'Pick the register your text needs, then use search and replace to make the whole transcript match it. For a formal document you will usually expand the short forms; for a caption or a chat summary you may want to keep them.',
      ],
    },
    {
      title: 'Accents, contractions and look-alike words',
      paragraphs: [
        'Portuguese uses acute, circumflex and grave accents (á, â, é, ê, ó, ô, à), the tilde (ã, õ) and the cedilla (ç). The recogniser usually writes them, but check the pairs where the accent changes the word, such as e and é, a and à, or por and pôr.',
        'Portuguese joins small words into contractions (no, na, pelo, nele, dum) and the recogniser may join or split them differently from your style guide. Check them in formal documents.',
        'Amounts and numbers follow the local style: a comma for decimals and a full stop for thousands, as in R$ 1.250,50 in Brazil. Whether a figure appears as digits or as words can change from line to line, so make it consistent.',
      ],
    },
  ],

  howTitle: 'How to convert Portuguese audio to text',
  howToDescription:
    'Drop in a Portuguese video or voice message, press Transcribe with Portuguese selected, settle the spelling and download the result.',
  steps: [
    {
      title: 'Add the recording',
      text: 'Drop the video or audio into the box above, or press Choose a file. The uploader then opens with Portuguese chosen, which covers Brazil and Portugal alike. Change the language there only if the recording is in something else.',
    },
    {
      title: 'Pick a quality, then press Transcribe',
      text: 'Standard is fine for a clear voice. A recording from Portugal, a fast conversation or a noisy room gains most from High accuracy or Best accuracy, which are slower and usually make fewer mistakes. Press Transcribe when you are ready.',
      browser: {
        text: 'Standard is fine for a clear voice. A recording from Portugal, a fast conversation or a noisy room gains most from High accuracy or Best accuracy if your device offers them (a choice it cannot run is greyed out, with the reason). They are slower and usually make fewer mistakes; each is a larger first-time download. Press Transcribe when you are ready.',
      },
    },
    {
      title: 'Watch the lines appear',
      text: 'Each line arrives with its time. Skip silence & music is on by default, so pauses and background music are less likely to turn into invented words.',
    },
    {
      title: 'Settle the spelling, then download',
      text: 'Begin with the lines marked as unsure, choose one spelling for the whole text, then download TXT, SRT, VTT, Markdown, JSON or PDF.',
    },
  ],

  formatsTitle: 'Files and downloads for Portuguese transcripts',
  formatsIntro:
    'Voice messages saved from a chat, phone videos and studio recordings all work, because only the sound is read. The accents and cedillas stay in the text you download.',
  uploadTitle: 'Files you can add',
  accepts: ['OPUS', 'MP4', 'MP3', 'M4A', 'OGG', 'WAV', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'Portuguese text for notes and reports' },
    { name: 'SRT', use: 'legendas for players and editors' },
    { name: 'VTT', use: 'legendas for web video' },
    { name: 'PDF', use: 'a printable transcript' },
    { name: 'Markdown', use: 'text with headings and times' },
    { name: 'JSON', use: 'lines and times for your own tools' },
  ],

  tipsTitle: 'Tips for better Portuguese transcripts',
  tips: [
    {
      title: 'Set Portuguese yourself.',
      text: 'Spanish and Galician sound close to Portuguese. Naming the language is more reliable than detection, especially for short voice messages.',
    },
    {
      title: 'Choose one spelling.',
      text: 'Decide on Brazilian or European spelling, then use search and replace to make the transcript match.',
    },
    {
      title: 'List places and surnames in the vocabulary hint.',
      text: 'São Paulo, Guimarães, Fortaleza and surnames with ã or ç are easy to misspell. Type them into the Vocabulary hint under More options, written as you want to see them.',
    },
    {
      title: 'Mind the background.',
      text: 'Voice messages recorded in traffic, on a bus or in a crowd are harder to transcribe. A quiet spot and a nearby microphone matter more than any setting.',
    },
  ],

  faqs: [
    {
      question: 'Does Portuguese audio to text work for both Brazilian and European Portuguese?',
      answer:
        'Yes. Both are Portuguese in the language list. The accents differ, and the clipped European sound or fast regional speech can be harder to catch, so try a larger quality choice if the first result is rough.',
    },
    {
      question: 'Will the transcript use Brazilian or Portuguese spelling?',
      answer:
        'It may follow the speaker or mix the two, because some words are spelled differently in Brazil and Portugal. Pick the spelling you want and use search and replace to make the text consistent.',
    },
    {
      question: 'Can I transcribe a Brazilian WhatsApp áudio here?',
      answer:
        'Yes. Save the voice message to your phone, then drop the file in the box at the top of this page. The WhatsApp voice message page explains how to save it.',
    },
    {
      question:
        'Does it cope with regional Brazilian accents such as paulista, carioca or nordestino?',
      answer:
        'They are all Portuguese and use the same setting. Strong regional speech, a fast delivery or noise make any transcript less exact, so name Portuguese, add local names to the vocabulary hint and review the lines marked as unsure.',
    },
    {
      question: 'Can it tell Portuguese and Spanish apart by itself?',
      answer:
        'Automatic detection often works, but short clips and similar sounds can fool it. That is why this page starts with Portuguese selected. Choose Spanish instead for Spanish speech.',
    },
  ],

  links: [
    {
      label: 'WhatsApp voice message to text',
      path: '/whatsapp-voice-message-to-text',
      note: 'How to save a voice message from a chat and read it as text.',
    },
    {
      label: 'Spanish audio to text',
      path: '/spanish-audio-to-text',
      note: 'For Spanish speech, which has its own language setting.',
    },
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: 'Understand a Portuguese recording in English before you decide what to do with it.',
    },
    {
      label: 'Podcast transcript generator',
      path: '/podcast-transcript-generator',
      note: 'Turn a Portuguese podcast episode into show notes and subtitles.',
    },
  ],
};
