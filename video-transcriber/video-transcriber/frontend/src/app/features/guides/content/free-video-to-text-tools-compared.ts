import { GuideContent } from '../guide.model';

/** Every quote about another tool is from the page linked in `sources`, as it read on `checked`. Nothing here was run or measured: these are the tools' own words. */
export const CONTENT: GuideContent = {
  h1: 'Free video to text tools compared: each limit quoted from its own page',
  lead: 'Most "free" video transcription sites give you a minute, a few files or a watermark before they ask for an account or a card. We read the free-plan pages of thirteen tools on 28 October 2026 and put every limit in one table, each as the tool itself words it.',
  readingMinutes: 8,
  toolPath: '/transcribe-video-to-text',
  toolCta: 'Transcribe a video to text, free and without an account',
  checked: '28 October 2026',
  blocks: [
    {
      title: 'The short answer',
      bullets: [
        {
          title: 'For one short clip,',
          text: 'almost any of them will do. Riverside, VoiceCheap, RecCloud and Caption-X all transcribe a clip of a few minutes without cost.',
        },
        {
          title: 'For a one-hour lecture or interview,',
          text: 'the caps matter: five minutes, ten minutes, a "1-minute preview" or 30 minutes a file rule out most free plans. Riverside, SubtitleKit and TranscribeVid state no minutes cap.',
        },
        {
          title: 'For speaker names, links or meetings,',
          text: 'use a service that does them: Notta labels speakers, and NoteGPT and Notta take links. TranscribeVid does none of these.',
        },
        {
          title: 'For subtitle files,',
          text: 'check the export column first. VOMO says plainly that SRT and VTT are not supported, and VEED asks you to upgrade for subtitle files.',
        },
      ],
    },
    {
      title: 'How we checked',
      paragraphs: [
        'On 28 October 2026 we opened each tool\'s own free video-to-text or pricing page and wrote down what it says about sign-up, the free allowance, the size or length of a file and the formats it exports. Where a page does not say something, the table says "not stated", and we did not guess.',
        'We did not run any of these tools, and we did not test how accurate any of them is. Some pages quote accuracy figures of their own; we left them out because nobody here measured them. For our own measurements, which cover one open model, see the guide on Whisper accuracy by language.',
        'Free plans change often. Every row below has its page in the list of sources at the end, and we will check them again each quarter.',
      ],
    },
    {
      title: 'The free limits, tool by tool',
      table: {
        caption: 'Free plans of thirteen video to text tools and TranscribeVid, quoted from their own pages on 28 October 2026',
        head: ['Tool', 'Sign-up', 'Free allowance', 'Size or length of a file', 'Exports'],
        rows: [
          ['Otter', 'Not stated; its button leads to a sign-up page', '"300 minutes of video transcription each month at no cost"', '"No strict time limit", but your minutes must cover the file', 'TXT, Word, PDF, SRT'],
          ['VEED', '"No upfront signup required" to try; sign up to download', 'A watermarked video with subtitles; upgrade "to remove watermarks, transcribe longer videos"', 'Not stated', 'TXT, SRT, VTT listed; the page is not clear whether free users get them'],
          ['Riverside', 'None: "No sign up required"', '"Unlimited transcriptions for free"; one speaker for all the text', 'Not stated; MP3, WAV, MP4 and MOV files only', 'SRT and TXT'],
          ['Any2Text', '"No Sign Up or Credit card Required" to try', '"First 15 minutes free", then $0.035 a minute', 'Not stated', 'TXT and SRT among others'],
          ['VOMO', 'An account, to get the free minutes', '"60 free transcription minutes", once', '"Up to 25 MB and 30 minutes"', 'TXT, Word, PDF, Markdown; SRT and VTT not supported'],
          ['VoiceCheap', 'None for files up to 60 minutes', '"1 transcription per day"', '"Up to 60 minutes"', 'Text to copy, as raw text, paragraphs or sentences'],
          ['RecCloud', 'Not stated', '"Videos up to 10 minutes in length"', '"Video ≤ 4G, Audio ≤ 500M"; 5 hours at most', 'TXT'],
          ['Caption-X', 'A free account', '"5 transcriptions in total, up to 5 minutes each"', 'Five minutes a file', 'TXT, SRT, VTT'],
          ['UniScribe', 'Not stated; its buttons lead to a sign-in page', '"120 minutes of transcription per month", "3 files per day"', '30 minutes a file', 'Not read'],
          ['Maestra', 'Sign up to download or export', 'A "1-minute preview"', 'Not stated', 'TXT, Word, PDF, JSON; SRT and VTT also mentioned'],
          ['NoteGPT', 'Not stated', 'Not stated', '"Max 5GB per video, up to 20 tasks in queue"; links accepted', 'Not read'],
          ['Notta (free web tool)', 'No account for the tool; one file per user', 'One file, "a maximum duration of 3 minutes per file", sent by e-mail', 'Three minutes', 'TXT, SRT, PDF and more'],
          ['SubtitleKit', 'None: "no account"', 'No watermark and no minutes cap, per its FAQ', '"Up to 2 GB"; the work is done in your browser', 'Not read'],
          ['TranscribeVid', 'None', 'No daily or monthly count', 'No plan limit; a very long file needs a lot of memory on a phone', 'TXT, SRT, VTT, PDF, Markdown, JSON'],
        ],
      },
      after: [
        'TurboScribe is not in the table because its own pages refused our request. Third-party reviews describe its free plan as three files a day of up to 30 minutes each, and our TurboScribe comparison page lists those reviews.',
      ],
    },
    {
      title: 'How to read a free plan',
      bullets: [
        {
          title: 'A per-day cap',
          text: 'such as "1 transcription per day" or "3 files per day" resets every 24 hours. It suits an occasional clip and fails the day you have a backlog.',
        },
        {
          title: 'A per-file length',
          text: 'such as five, ten or 30 minutes decides what you can do at all. A 40-minute interview does not fit under a 30-minute rule, however many minutes a month the plan gives.',
        },
        {
          title: 'A monthly or one-off pool of minutes',
          text: 'such as 300 a month or 60 once is generous for a few files and runs out on a long project. Check whether unused minutes carry over.',
        },
        {
          title: 'A watermark or a sign-up wall',
          text: 'means the free result is a preview. If a page says you must sign up "to download or export", the transcript on screen is not yours to keep.',
        },
        {
          title: 'The export list',
          text: 'tells you whether you can get subtitles. A site that exports only TXT cannot give you an SRT file for your video.',
        },
      ],
    },
    {
      title: 'Where your video goes',
      paragraphs: [
        'Most online transcription services process the file on their own servers. Notta\'s security page, for instance, says it hosts all its software on Amazon Web Services. Any2Text says "all processing happens locally or on secure servers" without saying which.',
        'TranscribeVid sends the file to the server that runs this site, which deletes it when your session ends. SubtitleKit says "nothing leaves your device" when you drop a file in.',
      ],
      browser: {
        paragraphs: [
          'Most online transcription services process the file on their own servers. Notta\'s security page, for instance, says it hosts all its software on Amazon Web Services. Any2Text says "all processing happens locally or on secure servers" without saying which.',
          'TranscribeVid keeps the file on your device: your browser does the work and nothing is uploaded. SubtitleKit says "nothing leaves your device" when you drop a file in.',
        ],
      },
    },
    {
      title: 'Which tool for which job',
      bullets: [
        {
          title: 'You need speaker names.',
          text: 'Notta says it "automatically labels who said what". TranscribeVid and Riverside\'s free tool give one block of text, with no speaker names.',
        },
        {
          title: 'The video is online, not on your disk.',
          text: 'NoteGPT has a "Paste Link" option for YouTube, Google Drive, Dropbox, TikTok and Instagram, and Notta accepts YouTube, Google Drive and Dropbox links on its video page. TranscribeVid takes files only.',
        },
        {
          title: 'The file is long and you do not want to pay.',
          text: 'A site with no minutes cap is the realistic choice: Riverside, SubtitleKit or TranscribeVid. Riverside takes only four file types; SubtitleKit and TranscribeVid run in your browser, SubtitleKit with a 2 GB limit.',
        },
        {
          title: 'You want subtitles for the video.',
          text: 'Caption-X, Riverside and TranscribeVid all name SRT among their exports. TranscribeVid also writes VTT, and has its own pages on SRT and VTT.',
        },
        {
          title: 'It is a live meeting.',
          text: 'None of the free file tools here joins a call. Notta describes a bot that joins yours.',
        },
      ],
    },
    {
      title: 'Where TranscribeVid is weaker',
      bullets: [
        {
          title: 'No speaker labels and no links.',
          text: 'Several tools above do one or both. We do neither.',
        },
        {
          title: 'The first run downloads a model.',
          text: 'It is between about 77 MB and a little over 1 GB depending on the quality level, once. A cloud tool starts at once.',
        },
        {
          title: 'It depends on your device.',
          text: 'A recent laptop is quick; an older phone can be slow and may run out of memory on a very long file.',
        },
        {
          title: 'Fewer languages than some.',
          text: 'We say 50 or more; Maestra and VEED say 125 or more. Hindi and Urdu are less accurate than English, as our accuracy guide shows.',
        },
      ],
    },
    {
      title: 'What we did not check',
      paragraphs: [
        'We did not read the free-plan pages of Gumlet, Klap, videocompress.ai, Proactor or Wayin, so they are not in the table and we make no claim about them. We also did not test how fast any tool runs, how it handles noise or how good its text is.',
        'If a number in the table is out of date, tell us through the contact page and we will check the source and correct it.',
      ],
    },
  ],

  faqs: [
    {
      question: 'Which free video to text tool has no limits at all?',
      answer:
        'None has no limits of any kind. Riverside, SubtitleKit and TranscribeVid state no minutes cap, but Riverside takes only four file types, SubtitleKit is limited to 2 GB, and a tool that runs on your device is limited by your device.',
    },
    {
      question: 'Why do so many free tools give only a minute or a few files?',
      answer:
        'Transcription on a server costs the provider money for every minute, so a free plan is usually a trial of a paid one. A tool that runs in your browser uses your own processor instead, which is why it can state no cap.',
    },
    {
      question: 'Are the numbers in the table still correct?',
      answer:
        'They were correct on 28 October 2026, as each page worded them. Providers change their plans without notice, so open the linked page before you rely on one.',
    },
    {
      question: 'Is a free tool good enough for an important recording?',
      answer:
        'It can be, but check the text against the recording whichever tool you use. None of these tools is perfect on noise, accents or overlapping voices, and none of the figures in the table says anything about accuracy.',
    },
  ],

  links: [
    {
      label: 'Transcribe video to text, free and without sign-up',
      path: '/transcribe-video-to-text',
      note: 'The tool this guide compares, with its own limits stated up front.',
    },
    {
      label: 'A free Notta alternative for recordings longer than three minutes',
      path: '/notta-alternative',
      note: 'A side-by-side with one of the tools in the table.',
    },
    {
      label: 'Whisper accuracy by language',
      path: '/guides/whisper-accuracy-by-language',
      note: 'Measured error rates for the model behind the quality levels.',
    },
    {
      label: 'Transcribe a video without uploading it',
      path: '/guides/transcribe-video-without-uploading',
      note: 'How a transcription that stays on your device works.',
    },
  ],

  sources: [
    { label: 'Otter: video to text', url: 'https://otter.ai/video-to-text' },
    { label: 'VEED: video to text', url: 'https://www.veed.io/tools/video-to-text' },
    { label: 'Riverside: transcription', url: 'https://riverside.com/transcription' },
    { label: 'Any2Text: video to text', url: 'https://any2text.com/video-to-text' },
    { label: 'VOMO: MP4 to text', url: 'https://vomo.ai/tools/mp4-to-text' },
    { label: 'VoiceCheap: transcribe video', url: 'https://www.voicecheap.ai/tools/transcribe-video' },
    { label: 'RecCloud: video transcription', url: 'https://reccloud.com/video-transcription' },
    { label: 'Caption-X: transcribe video to text', url: 'https://caption-x.com/transcribe-video-to-text' },
    { label: 'UniScribe', url: 'https://www.uniscribe.co/' },
    { label: 'Maestra: video to text', url: 'https://maestra.ai/tools/video-to-text' },
    { label: 'NoteGPT: transcribe video to text', url: 'https://notegpt.io/transcribe-video-to-text' },
    { label: 'Notta: free MP3 to text tool', url: 'https://www.notta.ai/en/tools/mp3-to-text' },
    { label: 'Notta: video to text', url: 'https://www.notta.ai/en/video-to-text' },
    { label: 'Notta: audio to text converter', url: 'https://www.notta.ai/en/tools/audio-to-text-converter' },
    { label: 'Notta: security', url: 'https://www.notta.ai/en/security' },
    { label: 'SubtitleKit: transcribe video to text', url: 'https://subtitlekit.com/en/transcribe-video-to-text/' },
  ],
};
