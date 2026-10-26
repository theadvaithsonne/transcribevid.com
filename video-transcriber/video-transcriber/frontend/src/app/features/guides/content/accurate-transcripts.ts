import { GuideContent } from '../guide.model';

export const CONTENT: GuideContent = {
  h1: 'How to get a more accurate transcript',
  lead: 'Accuracy depends first on the sound, then on three choices you control: the language, the quality level and a vocabulary hint. This guide shows what to change before you record, which settings help, how to spot the mistakes that remain, and what speech recognition cannot do at all.',
  readingMinutes: 9,
  toolPath: '/video-to-text',
  toolCta: 'Transcribe a video with the best settings',
  blocks: [
    {
      title: 'What decides how accurate a transcript is',
      paragraphs: [
        'Speech recognition listens, much as you do. If a person speaks clearly, close to the microphone, in a quiet room, in a language the model knows well, the transcript is usually very good. If the sound is distant, noisy, echoing or crowded with voices, even a person has to concentrate, and the software makes more mistakes.',
        'That gives a simple order of priorities. Fix the audio first, because nothing downstream can recover words that were never captured. Then tell the program the language. Then pick a quality level that suits the difficulty. Then give it the unusual words it cannot guess. Finally, check the result, because no transcript is perfect.',
      ],
    },
    {
      title: 'Improve the recording itself',
      paragraphs: [
        'A few minutes of care when you record are worth more than any setting afterwards.',
      ],
      bullets: [
        {
          title: 'Get close.',
          text: "Put the microphone about a hand or two away from the speaker's mouth. A phone held close beats a laptop across the table.",
        },
        {
          title: 'Choose a quiet, soft room.',
          text: 'Curtains, carpet and sofas absorb echo. Bare walls and large empty rooms smear the words together. Switch off fans, air conditioning and notifications.',
        },
        {
          title: 'Keep music out from under the voice.',
          text: 'Background music is hard to separate from speech. Add it after transcribing, not before.',
        },
        {
          title: 'One voice at a time.',
          text: 'Overlapping speakers are the hardest case. Ask people to wait for each other, and use one microphone per person where you can.',
        },
        {
          title: 'Do not worry about the sample rate.',
          text: 'The speech models read sound at 16 kHz in mono, and the page converts any file to that automatically. A higher rate or a surround mix does not help; distance, noise and level do.',
        },
        {
          title: 'Avoid heavy compression.',
          text: 'Very low bitrate files, such as a voice message squeezed over a weak connection, lose detail the model needs. Use the original recording when you have it.',
        },
      ],
    },
    {
      title: 'Tell it the language',
      paragraphs: [
        'The page can detect the language by itself, and for a long recording in clear English it usually gets it right. But for short clips, strong accents and recordings that mix languages, detection can guess wrong, and a wrong guess makes the whole transcript poor. Choosing the language in the Language list takes one click and removes the risk.',
        'If the page cannot identify the language with confidence, it says so and asks you to choose the one you hear. Do that and run it again. For speech that switches between two languages, such as Hindi and English, choose the main language and check the passages in the other one.',
      ],
    },
    {
      title: 'Choose the right quality level',
      paragraphs: [
        'The four quality choices run different sizes of the same family of models. A larger model makes fewer mistakes with accents, noise, other languages and rare words, but it takes longer and has a bigger first download.',
      ],
      table: {
        caption: 'The quality choices and when to use each',
        head: ['Choice', 'Best for', 'Trade-off'],
        rows: [
          [
            'Fastest',
            'Clear speech in a quiet recording, quick drafts',
            'Most mistakes of the four on difficult audio',
          ],
          [
            'Standard',
            'Most videos and voice recordings (the usual starting choice)',
            'A good balance of speed and accuracy',
          ],
          [
            'High accuracy',
            'Accents, background noise, non-English speech',
            'Slower, larger download',
          ],
          ['Best accuracy', 'Hard audio where every word counts', 'Slowest, largest download'],
        ],
      },
      after: [
        'A good habit is to start with Standard on a short sample of your recording, read it, and move up a level only if the mistakes bother you. Under More options you can also choose from the full list of models. On some devices High accuracy and Best accuracy are greyed out, with the reason shown, such as "needs 8 GB" or "use a computer for this size", because the larger models need more memory. Each larger choice is also a bigger first-time download, and the page shows its size before you start.',
      ],
    },
    {
      title: 'Use the vocabulary hint for names and jargon',
      paragraphs: [
        "Speech models know common words well and rare ones poorly. A person's name, a company, a product, a place or a technical term is spelled however the model finds most likely, which is often wrong. The Vocabulary hint under More options exists for this.",
        'Type the unusual words as you want them written, for example a sentence such as "Interview with Dr. Okafor about Kubernetes and PostgreSQL." A short, natural line that contains the words works better than a long list. It is optional and it can hold up to 1,000 characters. The page does not keep it in your remembered settings, in case it holds private names.',
        'The hint helps with spelling. It does not teach the model to hear a word that is mumbled or masked by noise.',
      ],
    },
    {
      title: 'Enhance audio and Skip silence & music',
      paragraphs: [
        'Two switches under More options are on by default, and for most recordings you should leave them on.',
      ],
      bullets: [
        {
          title: 'Enhance audio.',
          text: 'Filters very low rumble and very high hiss, then evens out the volume so a quiet speaker is not lost next to a loud one. If a recording sounds fine to you but the transcript is odd, try it once with this switched off to see whether the filter is the cause.',
        },
        {
          title: 'Skip silence & music.',
          text: 'A speech detector finds the stretches with a human voice and passes only those to the model. Silence and most non-speech sound, such as music without singing, never reach it, which prevents much of the invented text a model can produce when it is given nothing to hear. Music with singing in it may still get through. Switch it off only if quiet speech is being dropped.',
        },
      ],
      after: [
        'Word-level timing is on by default too. It does not change which words are found, but it lets subtitles begin and end exactly with the words and powers the marks that show which words were uncertain.',
      ],
    },
    {
      title: 'Check the result: where the mistakes hide',
      paragraphs: [
        'When the transcript is ready, do not read it from top to bottom first. Look for the marks. Words the model was less sure of are underlined, with a stronger underline for the least certain. If the whole transcript has low confidence, or the language was uncertain, the page shows a notice with a button to review the language and quality.',
        'The confidence score is a hint about where to look, not an accuracy percentage, so a word without an underline can still be wrong. Spend your attention in this order:',
      ],
      bullets: [
        {
          title: 'Names and places.',
          text: 'These are the most common errors and the most embarrassing ones.',
        },
        {
          title: 'Numbers, dates and units.',
          text: 'A wrong figure changes the meaning. Check each against the recording.',
        },
        {
          title: 'Sound-alike words.',
          text: 'To, too and two, or their and there, are chosen from context and can be swapped.',
        },
        {
          title: 'Passages near noise or overlapping voices.',
          text: 'Listen again at the timestamp. Click a line to jump to that moment.',
        },
      ],
      after: [
        'Correct what you find directly in the text. Your edits are kept in the transcript and flow into every export.',
      ],
    },
    {
      title: 'Problem and what to try',
      table: {
        caption: 'Common problems and what to try first',
        head: ['Problem', 'What to try'],
        rows: [
          [
            'Wrong language, or text in the wrong script',
            'Choose the language yourself instead of Detect automatically',
          ],
          [
            'Names and brands spelled wrongly',
            'Add them to the Vocabulary hint under More options, then transcribe the file again from the home page',
          ],
          [
            'Many mistakes on accents or noisy sound',
            'Move up one quality level, and keep Enhance audio on',
          ],
          [
            'Text appears where nobody is speaking',
            'Keep Skip silence & music on; trim long silent or music-only parts',
          ],
          [
            'The same phrase repeats again and again',
            'Keep Use previous text as context off, and try a different quality level',
          ],
          [
            'Two people talking over each other',
            'There is no fix in software: record them on separate microphones next time',
          ],
          [
            'A very quiet or distant speaker is missed',
            'Keep Enhance audio on; if speech is still dropped, switch Skip silence & music off for that file',
          ],
        ],
      },
    },
    {
      title: 'What speech recognition cannot do',
      paragraphs: [
        'Knowing the limits helps you spot problems early. A transcript from any speech recognition, including this one, can contain the following.',
      ],
      bullets: [
        {
          title: 'No speaker names.',
          text: 'It writes what was said, not who said it. Add names by hand while you edit.',
        },
        {
          title: 'Invented text.',
          text: 'Given silence, music or noise, a model can produce fluent words that nobody spoke, or repeat a phrase many times. If you see text where you hear nothing, delete it.',
        },
        {
          title: 'Wrong homophones and rare words.',
          text: 'It picks the most likely word, which is not always the right one.',
        },
        {
          title: 'Lost words in crosstalk.',
          text: 'Overlapping speech is usually transcribed as one voice or partly dropped.',
        },
        {
          title: 'No guarantee.',
          text: 'For anything legal, medical, financial or published, treat the transcript as a draft that a person must check.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Which quality level gives the most accurate transcript?',
      answer:
        'Best accuracy usually makes the fewest mistakes, with High accuracy often close behind, then Standard and Fastest. The gap matters most for accents, noise and languages other than English. On clear English speech the differences are small, so Standard is often enough.',
    },
    {
      question: 'Does a better microphone help more than a better setting?',
      answer:
        'Usually, yes. Clean, close sound lets a smaller model do well, while poor sound limits even the largest. Moving the microphone closer and cutting background noise is the cheapest improvement you can make.',
    },
    {
      question: 'Should I clean up the audio in an editor before transcribing?',
      answer:
        'Rarely. The page already filters rumble and hiss and evens out volume when Enhance audio is on. Heavy noise-reduction filters in an editor can distort speech and make recognition worse, so use gentle settings or none.',
    },
    {
      question: 'Why do two quality levels give different text for the same file?',
      answer:
        'They are different sizes of model, so each hears and spells a hard passage in its own way. Where two runs disagree, listen to that passage at its timestamp, because it is probably a difficult one and worth checking by ear.',
    },
    {
      question: 'Can I make the transcript more accurate by editing it?',
      answer:
        'Editing corrects the text you export; it does not retrain the model. Fix names, numbers and unclear words in the transcript page and download the corrected version. A new run with a vocabulary hint reduces the corrections next time.',
    },
  ],
  links: [
    {
      label: 'What is Whisper?',
      path: '/guides/what-is-whisper',
      note: 'The speech model behind the quality levels, and where it is strong or weak.',
    },
    {
      label: 'Interview transcription',
      path: '/interview-transcription',
      note: 'Tips for transcribing a conversation with two voices and many names.',
    },
    {
      label: 'Lecture to text',
      path: '/lecture-to-text',
      note: 'Get notes from a recorded lecture, even from the back of a large room.',
    },
    {
      label: 'Hindi audio to text',
      path: '/hindi-audio-to-text',
      note: 'Choosing the language matters most for Hindi and other non-English speech.',
    },
    {
      label: 'Transcribe a video without uploading it',
      path: '/guides/transcribe-video-without-uploading',
      note: 'How the in-browser engine works and what the device you use changes.',
    },
  ],
};
