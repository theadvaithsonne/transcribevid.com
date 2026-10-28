import { GuideContent } from '../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Whisper accuracy by language: what we measured',
  lead: 'We ran the two Whisper models behind Standard and High accuracy on 480 test clips in 16 languages, clean and at phone quality. English, Spanish, Portuguese, Italian, French and German are fine on Standard. Hindi, Urdu, Arabic, Korean and Indonesian need High accuracy, and Bengali is weak even then. Here are the numbers, how we got them, and what to choose for your language.',
  readingMinutes: 9,
  toolPath: '/audio-to-text',
  toolCta: 'Transcribe a recording in any of these languages',
  blocks: [
    {
      title: 'The short version',
      bullets: [
        {
          title: 'Fine on Standard.',
          text: 'English, Spanish, Portuguese, Italian, French, German, Turkish and Japanese: between 2 and 13 wrong words in 100 on clean speech. High accuracy roughly halves that.',
        },
        {
          title: 'Better on High accuracy.',
          text: 'Thai and Vietnamese: Standard gets 18 to 20 in 100 wrong, High accuracy 9 to 10.',
        },
        {
          title: 'High accuracy, and read the result.',
          text: 'Arabic, Korean and Indonesian: Standard gets 25 to 32 in 100 wrong, High accuracy 11 to 25.',
        },
        {
          title: 'High accuracy, and expect to correct a lot.',
          text: 'Hindi and Urdu: Standard gets 45 to 55 in 100 wrong, High accuracy 24 to 30.',
        },
        {
          title: 'Weak on every level.',
          text: 'Bengali: Standard produced more wrong words than the clips contain (it repeats itself and invents text), and High accuracy still gets 82 in 100 wrong.',
        },
      ],
    },
    {
      title: 'How we measured it',
      paragraphs: [
        "The clips come from FLEURS, a public speech dataset published by Google under a CC-BY-4.0 licence: people reading sentences aloud, recorded in quiet rooms. We took 30 clips of 6 to 20 seconds from the test part of each language, 480 clips in all, for English and the 15 languages this website is written in. The sentences differ between clips, and we chose them with a fixed random seed, so the same set can be rebuilt.",
        'Each clip went through the standard released Whisper models that the two quality levels use: Small for Standard and Large v3 Turbo for High accuracy, run with faster-whisper on an ordinary computer, with the language set by hand, a beam search of 5 and nothing else switched on. We then compared the output with the reference text after making both lower case, removing punctuation and, for Arabic and Urdu, removing the optional vowel marks. The error rate counts wrong, missing and extra words per 100 reference words. Japanese and Thai do not write spaces between words, so for those two we count characters instead.',
        'For the phone-quality test we took the first 10 clips of each language and treated them the way a chat app treats a voice note: the bandwidth cut to what a phone line carries, the sound compressed with Opus at 16 kbit/s and decoded again, and a little room noise mixed in at 20 decibels below the speech. The references stayed the same.',
        "The measurements were made on 27 and 28 October 2026. Two differences from this website: the browser version of each model uses compact number formats to keep the download small, which usually costs a little accuracy, so expect slightly higher numbers here than in the table; and the website's Skip silence & music guard was switched off for the test, so that the models' own behaviour shows.",
      ],
    },
    {
      title: 'The numbers on clean speech, 30 clips per language',
      paragraphs: ['Errors per 100 words (characters for Japanese and Thai). Lower is better; 5 means one wrong word in 20.'],
      table: {
        caption: 'Whisper error rates on clean FLEURS test clips, 27 to 28 October 2026 (percent, lower is better)',
        head: ['Language', 'Standard', 'High accuracy'],
        rows: [
          ['English', '8.6', '6.4'],
          ['Spanish', '5.2', '3.7'],
          ['Portuguese', '6.7', '3.3'],
          ['French', '12.2', '6.5'],
          ['German', '11.7', '7.2'],
          ['Italian', '6.4', '1.7'],
          ['Indonesian', '31.5', '25.1'],
          ['Japanese (characters)', '12.8', '4.6'],
          ['Korean', '30.3', '23.8'],
          ['Thai (characters)', '17.7', '10.1'],
          ['Vietnamese', '20.0', '9.0'],
          ['Turkish', '12.1', '9.0'],
          ['Hindi', '55.1', '30.4'],
          ['Bengali', '125.9 *', '82.3'],
          ['Arabic', '25.3', '10.6'],
          ['Urdu', '44.6 *', '24.3'],
        ],
      },
      after: [
        '* Standard repeated itself for minutes on some Bengali and Urdu clips, so those two cells come from the 11 and 10 clips it finished. A value above 100 means the model produced more wrong words than the clip contains. Korean is counted by words, and Korean writers space words differently from each other, so part of its number is spacing rather than wrong words.',
      ],
    },
    {
      title: 'Phone-quality audio: the same ten clips, before and after',
      paragraphs: [
        'A voice note, a phone call or a meeting recording is not studio audio. This table shows the first 10 clips of each language twice: clean, and after the voice-note treatment described above. Because the clips are the same, the two columns of each model can be compared directly; the 10-clip clean numbers differ a little from the 30-clip table.',
      ],
      table: {
        caption: 'Error rates on the same 10 clips per language, clean and at voice-note quality (percent, lower is better)',
        head: ['Language', 'Standard, clean', 'Standard, voice note', 'High accuracy, clean', 'High accuracy, voice note'],
        rows: [
          ['English', '7.3', '8.0', '6.2', '7.3'],
          ['Spanish', '5.6', '10.5', '4.5', '4.5'],
          ['Portuguese', '6.1', '5.2', '3.3', '3.8'],
          ['French', '14.1', '21.6', '7.1', '7.9'],
          ['German', '7.9', '17.3', '5.2', '9.9'],
          ['Italian', '5.7', '8.7', '1.3', '1.3'],
          ['Indonesian', '17.6', '20.6', '7.5', '7.5'],
          ['Japanese (characters)', '17.1', '15.2', '5.3', '6.9'],
          ['Korean', '25.7', '27.9', '19.1', '19.9'],
          ['Thai (characters)', '14.0', '18.0', '7.1', '9.7'],
          ['Vietnamese', '20.1', '24.8', '7.5', '7.5'],
          ['Turkish', '9.2', '15.0', '9.8', '10.5'],
          ['Hindi', '57.3', '64.9', '36.0', '42.2'],
          ['Bengali', '128.8', '127.7', '82.1', '87.0'],
          ['Arabic', '22.8', '32.9', '12.2', '13.9'],
          ['Urdu', '44.6', '50.8', '25.6', '24.0'],
        ],
      },
      after: [
        'Two things stand out. High accuracy barely notices the compression: on most languages it loses one or two points, and on Spanish, Italian, Indonesian and Vietnamese nothing at all. Standard suffers much more: French goes from 14 to 22, German from 8 to 17, Arabic from 23 to 33, and Spanish doubles. For a voice note or a call, the larger model is worth the wait even in a language that is fine on Standard with clean audio.',
      ],
    },
    {
      title: 'How to read an error rate',
      paragraphs: [
        'Five per cent means one wrong word in twenty: a transcript you can read straight through and fix in a minute. Ten per cent, one in ten, still reads well but needs a pass. Thirty per cent, one in three, is a draft you correct while listening. Above fifty, you are mostly rewriting.',
        'The count is strict. "Okay" against "OK", a number written as digits instead of words, or a compound written as two words all count as errors, although a reader would not notice them. The errors that matter are different ones: names, numbers, negations and the odd sentence that means something else. Those are what to listen for when you check a transcript, whatever the overall rate.',
      ],
    },
    {
      title: 'Silence and music: how much the models invent',
      paragraphs: [
        'We also gave both models 30 seconds of silence, of noise and of music-like tones, once for each of eight languages. The right answer is nothing. The table counts the words they wrote anyway.',
      ],
      table: {
        caption: 'Words invented on 30-second clips with no speech, eight languages each (0 is right)',
        head: ['Model', 'Clips with invented words, of 24', 'Words on 8 silent clips', 'Words on 8 noise clips', 'Words on 8 music clips'],
        rows: [
          ['Standard', '9', '32', '0', '16'],
          ['High accuracy', '24', '24', '23', '25'],
        ],
      },
      after: [
        'High accuracy wrote something on every single clip, usually a short polite phrase such as "Thank you." Standard was quieter on noise but invented more on silence, including, for French, a subtitle credit it learned from the internet. This is a known habit of the model family, and it is why the website skips silence and music before the model hears them (More options, Skip silence & music, on by default). Keep it on; it removes most of these made-up lines, and it also makes long recordings faster.',
      ],
    },
    {
      title: 'What to choose for your language',
      bullets: [
        {
          title: 'English, Spanish, Portuguese, Italian, French, German, Turkish, Japanese.',
          text: 'Standard for a quick draft of clean audio; High accuracy for anything recorded on a phone, in a meeting or outdoors.',
        },
        {
          title: 'Thai, Vietnamese, Arabic, Korean, Indonesian.',
          text: 'High accuracy, always. It cuts the errors by a third to a half compared with Standard.',
        },
        {
          title: 'Hindi, Urdu, Bengali.',
          text: 'High accuracy, the language set by hand (never auto-detect), and names in the vocabulary hint. Plan a careful read-through; for Bengali, treat the result as notes rather than a transcript.',
        },
        {
          title: 'Best accuracy is a step better again.',
          text: 'We have not measured it yet. It runs the full Large v3 model that Turbo was trimmed from, which is a little more accurate in published comparisons and, unlike Turbo, can translate speech to English. Use it when your device can run it and every word counts.',
        },
        {
          title: 'Set the language yourself.',
          text: 'Auto-detect decides from the first seconds and can pick a neighbouring language, which then costs far more than any model choice.',
        },
      ],
    },
    {
      title: 'What we are doing about the weak languages',
      paragraphs: [
        'On the same Hindi, Bengali and Urdu clips, speech models built specifically for Indian languages made 15, 22 and 20 errors in 100 words, against 30, 82 and 24 for High accuracy. We are testing whether they can run inside a browser quickly enough and in a small enough download. If they can, they will become an option on this website for those languages; we will not promise a date.',
        'Until then, the best you can do here for an Indian language is High accuracy, the language chosen by hand, a vocabulary hint with the names that appear, and a recording made close to the speaker. This page will be updated with new numbers when the models change.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Is Whisper accurate enough for Hindi?',
      answer:
        'On clean read speech, High accuracy gets about 30 words in 100 wrong and Standard about 55, so a Hindi transcript needs a careful read-through. Clear audio, the language set to Hindi and a vocabulary hint with the names that come up all help, and so does Best accuracy if your device can run it.',
    },
    {
      question: 'Why is Bengali so much worse than Spanish?',
      answer:
        'Training data. Whisper learned from about 680,000 hours of audio found on the internet, of which Spanish had thousands of hours and Bengali very few. The model has heard too little Bengali to be reliable, and the small model also falls into repeating itself, which is where the numbers above 100 come from.',
    },
    {
      question: 'Will my recording get the same error rate as the table?',
      answer:
        'No. The test clips are sentences read aloud in quiet rooms. A meeting with people talking over each other will do worse; a clean podcast may do better. Use the table to compare languages and quality levels with each other, not to predict a number for your file.',
    },
    {
      question: 'Did you measure Fastest and Best accuracy too?',
      answer:
        'Not yet. Fastest uses a smaller model than Standard and is worse on every language, so it is only for quick drafts of clear speech. Best accuracy uses the full Large v3 model, which published comparisons put a little ahead of Turbo. Both will be added here when we have measured them the same way.',
    },
    {
      question: 'Do these numbers apply to the browser version of the site?',
      answer:
        'Nearly. The browser models use compact number formats to keep the download small, which usually costs a little accuracy, so expect numbers a little higher than the table, not a different order of languages.',
    },
  ],
  links: [
    {
      label: 'Hindi audio to text',
      path: '/hindi-audio-to-text',
      note: 'The Hindi page, with the Hinglish option and the settings that help most.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'The habits and settings that cut the error rate further, whatever the language.',
    },
    {
      label: 'What is Whisper?',
      path: '/guides/what-is-whisper',
      note: 'What the model is, what it was trained on and why some languages lag behind.',
    },
    {
      label: 'Whisper online',
      path: '/whisper-online',
      note: 'Use the measured models from a web page, with nothing to install.',
    },
  ],
};
