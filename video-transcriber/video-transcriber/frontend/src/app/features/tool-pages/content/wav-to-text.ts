import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WAV to text',
  h1: 'Convert a WAV file to text, free and with timestamps',
  lead: 'WAV is the format of handheld recorders, call recorders and studio sessions. Add yours and read the words as timestamped text, free, with no login and no need to compress the file first.',
  dropKind: 'audio',
  dropNoun: 'WAV',

  whyTitle: 'Why a WAV file is a good thing to transcribe',
  why: [
    'A WAV file usually stores sound without compression, so nothing was thrown away when it was saved. That makes it a good source for speech recognition: no compression artefacts, and every consonant is still in the file. You do not need to turn it into an MP3 first. TranscribeVid reads the WAV as it is.',
    'The price of that quality is size. CD-quality stereo takes about 10 MB for every minute, so an hour of audio is more than half a gigabyte. This page is made for those big files: it skips silence and most non-speech sound (the Skip silence & music option, on by default) and gives you text with a timestamp on every line.',
  ],

  sections: [
    {
      title: 'Where WAV recordings come from',
      paragraphs: [
        'WAV is the default of the audio world, so the file in front of you probably came from one of these.',
      ],
      bullets: [
        {
          title: 'Handheld recorders.',
          text: 'Portable recorders used for interviews, lectures and field notes often save WAV, because it keeps every detail of the sound.',
        },
        {
          title: 'Phone-call and meeting recorders.',
          text: 'Call-recording tools and conference systems often export WAV. If each side of a call sits on its own channel, both are mixed into one transcript.',
        },
        {
          title: 'Audio editors.',
          text: 'Programs such as Audacity and Adobe Audition export WAV when you save or bounce a project, which makes it the natural file to hand on for transcription.',
        },
        {
          title: 'Dictation devices.',
          text: 'Some digital dictation recorders write WAV files that you can copy straight from the device.',
        },
      ],
    },
    {
      title: 'Sample rate, bit depth and channels',
      paragraphs: [
        'You do not need to prepare a WAV before you add it. The usual settings are all read: 8, 16 or 24 bits, or 32-bit float, mono or stereo, at 44.1 or 48 kHz. The sound is mixed down to mono and converted for the speech model automatically.',
        'A higher sample rate does not make a transcript more accurate, because speech sits in the lower part of the sound spectrum. Where you put the microphone matters far more than the numbers on the file.',
        'Enhance audio, under More options, filters rumble and hiss and evens out quiet speakers. It is on by default, and it earns its place on a recording made near a fan, a road or an air conditioner.',
      ],
    },
  ],

  howTitle: 'How to convert a WAV file to text',
  howToDescription:
    'Add the WAV file, choose the spoken language and quality, wait for the transcript and download it as text or subtitles.',
  steps: [
    {
      title: 'Drop in the WAV',
      text: 'Add the .wav file in the box at the top of this page: drop it there or press Choose a file. If it is still on a recorder, copy it to your computer first. The box takes one file; on the next page, Add another file lines up more WAVs, and each gets its own transcript.',
    },
    {
      title: 'Choose language and quality',
      text: 'On the next page, pick the spoken language, or leave Detect automatically for a recording in one language. Standard suits most speech. For a quiet or difficult recording, High accuracy and Best accuracy take longer and make fewer mistakes. Then press Transcribe.',
      browser: {
        text: 'On the next page, pick the spoken language, or leave Detect automatically for a recording in one language. Standard suits most speech. For a quiet or difficult recording, try High accuracy or Best accuracy if your device offers them: they take longer, they are a bigger first-time download, and they are greyed out, with the reason, on a device that cannot run them. Then press Transcribe.',
      },
    },
    {
      title: 'Watch the text appear',
      text: 'The transcript fills in line by line, each line with its time. Play from any line to check it against the recording.',
    },
    {
      title: 'Edit and download',
      text: 'Correct wrong words, then download TXT to read, SRT or VTT for subtitles, or PDF to print. Nothing is kept after your session, so save what you need.',
    },
  ],

  formatsTitle: 'WAV and other audio formats',
  formatsIntro: 'WAV is the lossless format, and this box takes these audio types too.',
  uploadTitle: 'Audio files you can add',
  accepts: ['WAV', 'MP3', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'the words as plain text' },
    { name: 'SRT', use: 'timed subtitle lines' },
    { name: 'VTT', use: 'timed lines for web players' },
    { name: 'PDF', use: 'a printable copy' },
    { name: 'Markdown', use: 'notes with times' },
    { name: 'JSON', use: 'data for your own tools' },
  ],

  tipsTitle: 'Tips for transcribing WAV recordings',
  tips: [
    {
      title: 'Add it exactly as it is.',
      text: 'There is nothing to gain from converting a WAV first, and a low-bitrate MP3 can lose detail. Add the file as it came off the recorder.',
    },
    {
      title: 'Listen to both channels.',
      text: 'Stereo is mixed down to mono. If one microphone is much quieter or noisier than the other, the mix inherits it, so check both channels in your player before a long job.',
    },
    {
      title: 'Trim long silences.',
      text: 'Field recordings often start and end with minutes of nothing. Cutting them in an editor makes the file smaller, and the transcript starts where the talking does.',
    },
    {
      title: 'Split a very long session.',
      text: 'Recordings over the size or length limit are refused, so split a long session at a natural break and transcribe the parts.',
      browser: {
        title: 'Several hours take several hours.',
        text: 'The site sets no size or length limit, but a recording of several hours needs a lot of time and free memory, and an older browser may refuse a very long file. On a phone, split it at a natural break and transcribe the parts.',
      },
    },
    {
      title: 'Spell the hard words.',
      text: 'List names, places and technical terms in the vocabulary hint under More options, written the way you want to see them.',
    },
  ],

  faqs: [
    {
      question: 'Can I transcribe a WAV recorded on a phone call?',
      answer:
        'Yes, if the call is saved as a WAV file and both people can be heard. Both channels are mixed into one transcript and speaker names are not added, so type names into the text while you edit. Tell people you are recording, and check the rules where you live before recording calls.',
    },
    {
      question: 'Is WAV more accurate than MP3 for transcription?',
      answer:
        'It can help a little, because nothing was removed from the sound. But a clear MP3 usually transcribes well and a noisy WAV does not. The microphone, the room and how close the speaker is matter more than the file format.',
    },
    {
      question: 'Why is my WAV file so large, and does that matter?',
      answer:
        'WAV usually stores sound without compression: about 10 MB a minute for CD-quality stereo. Big files take longer to read. {limits} If a file is over the limit, trim it, or export a compressed copy (M4A or MP3) and use that.',
      browser: {
        answer:
          'WAV usually stores sound without compression: about 10 MB a minute for CD-quality stereo. Big files take a little longer to read, but the format is not the problem: in testing, a file of about 2.5 GB was read without trouble in a current browser. The site sets no size or length limit because your own device does the work, so a very long recording needs time and free memory, and an older browser may refuse a very long file. On a phone, split it first.',
      },
    },
    {
      question: 'Does it handle 24-bit and 48 kHz WAV files?',
      answer:
        'Yes. The usual WAV settings, such as 16 or 24 bits at 44.1 or 48 kHz, are read without any preparation, and the sound is converted for the speech model automatically.',
    },
    {
      question: 'Can I transcribe several WAV files in one go?',
      answer:
        'Yes, on the next page. The box on this page takes one file; there, Add another file lines up the rest. Each file gets its own transcript, so a whole day of recordings can run one after another.',
    },
  ],

  links: [
    {
      label: 'MP3 to text',
      path: '/mp3-to-text',
      note: 'The same free transcription for the compressed format most voice recordings end up in.',
    },
    {
      label: 'Interview transcription',
      path: '/interview-transcription',
      note: 'Tips for turning interview recordings into a clean, quotable transcript.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'What to change about the recording, the language and the settings when the first result is not good enough.',
    },
    {
      label: 'Meeting recording to text',
      path: '/meeting-recording-to-text',
      note: 'For conference calls saved as a recording.',
    },
  ],
};
