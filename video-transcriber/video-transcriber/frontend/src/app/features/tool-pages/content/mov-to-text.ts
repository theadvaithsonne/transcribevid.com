import { ToolPageContent } from '../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MOV to text',
  h1: 'Transcribe a MOV video to text',
  lead: 'MOV is what iPhones, Macs and many cameras record. Add your MOV and get a timestamped transcript, free, with no login. Only the sound is read, so the size and codec of the picture do not matter.',
  dropKind: 'video',
  dropNoun: 'MOV',

  whyTitle: 'Why MOV files need no conversion',
  why: [
    'MOV is the QuickTime format from Apple. Like an MP4, it holds picture and sound together, and most MOV files carry AAC sound that is read directly. TranscribeVid reads that sound and ignores the picture, so there is no need for a separate MOV to MP4 step.',
    'MOV files are often big, because phones and cameras record at high quality. You do not have to shrink or convert yours. The quickest route from the camera roll to a transcript is to add the file as it is.',
  ],

  sections: [
    {
      title: 'Where MOV files come from',
      bullets: [
        {
          title: 'iPhone and iPad videos.',
          text: 'Videos recorded with the Camera app are saved as .MOV files, whether the picture format is H.264 or HEVC.',
        },
        {
          title: 'Mac screen recordings.',
          text: 'The screenshot toolbar (Shift-Command-5) and QuickTime Player save screen recordings as .mov. Choose a microphone before you record, or the file has no speech in it.',
        },
        {
          title: 'Cameras and editing software.',
          text: 'Many mirrorless cameras record MOV, and video editors such as Final Cut Pro and Adobe Premiere Pro can export it.',
        },
      ],
    },
    {
      title: 'Getting a video from your iPhone',
      paragraphs: [
        'The simplest way is to open this page on the iPhone itself and press Choose a file. You can pick a video from the Photos library or from Files. If the phone asks which format to use when you choose it, either answer works, because only the sound is read.',
        'To transcribe on a computer instead, send the video by AirDrop, save it to Files or iCloud Drive, or copy it over with a cable. Menu names change between versions of iOS and macOS, so treat these as a guide.',
      ],
    },
    {
      title: 'Videos with more than one audio track',
      paragraphs: [
        'Some cameras and editors write several audio tracks into one MOV, for example a camera microphone and a clip-on microphone. TranscribeVid uses the first audio track it can read. If the speech you want is on another track, export a copy with that track first, or mix the tracks together in your editor.',
      ],
    },
  ],

  howTitle: 'How to convert a MOV to text',
  howToDescription:
    'Add the MOV video, choose the spoken language and quality, wait for the transcript and download it.',
  steps: [
    {
      title: 'Add the MOV',
      text: 'Press Choose a file at the top of this page, or drop the .mov onto the box. An iPhone offers Photos and Files. One video fits in this box at a time; Add another file, on the next page, lines up more.',
    },
    {
      title: 'Set language and quality',
      text: 'On the next page, choose the spoken language. Standard is recommended. For wind, traffic or a distant speaker, High accuracy and Best accuracy take longer and make fewer mistakes. Then press Transcribe.',
      browser: {
        text: 'On the next page, choose the spoken language. Standard is recommended. For wind, traffic or a distant speaker, try High accuracy or Best accuracy if your device offers them: they take longer and make fewer mistakes, each is a bigger first-time download, and a device that cannot run one shows it greyed out with the reason. Then press Transcribe.',
      },
    },
    {
      title: 'Read and fix',
      text: 'The text arrives line by line with a time on each. Play from any line, correct what is wrong and delete lines you do not want.',
    },
    {
      title: 'Download the transcript',
      text: 'Get TXT or a PDF to read, or SRT or VTT to use as captions in a video editor or on the web. Your MOV is never changed.',
    },
  ],

  formatsTitle: 'MOV and other video formats',
  formatsIntro: 'The same box takes MOV and these other types, and the usual audio formats too.',
  uploadTitle: 'Video files you can add',
  accepts: ['MOV', 'MP4', 'M4V', 'MKV', 'WEBM', '3GP', 'TS'],
  downloads: [
    { name: 'TXT', use: 'the spoken words as plain text' },
    { name: 'SRT', use: 'captions for editors and players' },
    { name: 'VTT', use: 'captions for a web page' },
    { name: 'PDF', use: 'a transcript to print or share' },
    { name: 'Markdown', use: 'notes with times' },
    { name: 'JSON', use: 'data for your own tools' },
  ],

  tipsTitle: 'Tips for transcribing MOV videos',
  tips: [
    {
      title: 'Keep Enhance audio on.',
      text: 'Phone videos pick up wind, handling noise and room echo. The Enhance audio switch in More options takes out low rumble and hiss and brings up quiet voices.',
    },
    {
      title: 'Check which track has the voice.',
      text: 'If a camera recorded two microphones as separate tracks, play the video and make sure the first track is the one with the speech.',
    },
    {
      title: 'Cut long recordings at natural breaks.',
      text: 'Files over the size or length limit are refused. Cut the video into parts, or export only its audio, then add it.',
      browser: {
        title: 'Long recordings need memory.',
        text: 'The site sets no size or length limit, but a long video needs time and free memory, most of all on a phone, and an older browser may refuse a very long file. For a very long recording, export only the audio from your editor or cut the video into parts.',
      },
    },
    {
      title: 'Record with sound on purpose.',
      text: 'A Mac screen recording made without a microphone has no speech, and the transcript comes out empty.',
    },
  ],

  faqs: [
    {
      question: 'Can I transcribe an iPhone video without converting MOV to MP4?',
      answer:
        'Yes. Add the MOV as it is. TranscribeVid reads the sound track and ignores the picture, so no conversion is needed.',
    },
    {
      question: 'Does a 4K or HEVC video from my iPhone work?',
      answer:
        'Yes. Only the sound is used, so the picture size and video format do not matter. What counts is the sound track, and iPhone and Mac recordings use AAC sound, which is read directly.',
    },
    {
      question: 'How do I get a video from my iPhone to a computer for transcribing?',
      answer:
        'Send it by AirDrop to a Mac, save it to Files or iCloud Drive, or copy it over with a cable. Or skip the computer: open this page on the iPhone and choose the video from Photos.',
    },
    {
      question: 'Why does my Mac screen recording have no text?',
      answer:
        'A screen recording only carries sound if a microphone was chosen before recording. In the Shift-Command-5 toolbar, open Options, pick a microphone and record again. Menu names can differ between macOS versions.',
    },
    {
      question: 'What happens if my MOV has two audio tracks?',
      answer:
        'TranscribeVid uses the first audio track it can read. If the speech is on another track, export a copy with that track first, or mix the tracks together in your editor.',
    },
  ],

  links: [
    {
      label: 'MP4 to text',
      path: '/mp4-to-text',
      note: 'The same service for MP4 files, the other common phone video format.',
    },
    {
      label: 'Video to text',
      path: '/video-to-text',
      note: 'The main page for any video file, with tips for lectures, interviews and clips.',
    },
    {
      label: 'SRT subtitle generator',
      path: '/srt-subtitle-generator',
      note: 'Make captions for your MOV and see what an SRT file looks like inside.',
    },
    {
      label: 'How to add subtitles to a video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'What to do with the subtitle file once you have downloaded it.',
    },
  ],
};
