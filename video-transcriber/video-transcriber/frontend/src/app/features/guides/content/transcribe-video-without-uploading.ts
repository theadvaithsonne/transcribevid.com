import { GuideContent } from '../guide.model';

export const CONTENT: GuideContent = {
  h1: 'How to transcribe a video without uploading it',
  lead: 'On transcribevid.com the speech recognition runs inside your own browser, so your video or audio file is read on your device and is not sent to the website, to Google or to anyone else. This guide explains how that works, what your browser still downloads, what is still sent, and how you can check all of it yourself.',
  readingMinutes: 10,
  toolPath: '/video-to-text',
  toolCta: 'Transcribe a video on your device',
  blocks: [
    {
      title: 'What "without uploading" means here',
      paragraphs: [
        "Most online transcription services work the same way: you send your file to their server, a computer you cannot see transcribes it, and you download the result. Your recording sits on someone else's machine for as long as they keep it.",
        'On transcribevid.com the work happens the other way round. The speech recognition program comes to your browser, and your browser runs it on your own computer or phone. The media file is read from your disk by the page you have open. It is never attached to a request to the site, and it is never sent to Google, to the companies that host the downloads, or to any speech service.',
        'That is why the site sets no size or length limit and has no queue: there is no server of ours doing the work, so nothing runs up a bill per file, and nobody is waiting ahead of you. A very long recording still needs time and free memory on your device. It is also why a confidential interview or a private family video can be transcribed without leaving your device.',
        'This guide describes the website at transcribevid.com. A copy of the software that someone installs on their own server works differently: it sends the file to that server over an encrypted connection and deletes it automatically afterwards.',
      ],
    },
    {
      title: 'How it works, step by step',
      steps: [
        {
          title: 'The page loads',
          text: 'Your browser fetches the page and its program code from transcribevid.com, which is hosted on Cloudflare. This is the same as opening any other website.',
        },
        {
          title: 'The speech model is downloaded once',
          text: "The first time you use a quality level, your browser downloads the speech recognition model for it from Hugging Face, together with the engine files that run it from jsDelivr. They are kept in your browser's cache, so the next transcription starts without downloading them again.",
        },
        {
          title: 'Your file is decoded on your device',
          text: "The browser's built-in audio and video decoders turn the file into plain 16 kHz mono sound, which is what the model reads. For a few formats the browser cannot open itself, such as AVI, WMA and FLV, the page asks first and then downloads a converter of about 9 MB, which also runs on your device.",
        },
        {
          title: 'A worker runs the model',
          text: 'A background thread of the page, called a Web Worker, runs the model so the page stays responsive. It uses your graphics chip through WebGPU when the browser supports it, and otherwise your processor through WebAssembly.',
        },
        {
          title: 'The text appears, and stays in your browser',
          text: "The transcript is built line by line with timestamps. It is stored in your browser's own storage for the session, and the SRT, VTT, TXT, Markdown, JSON and PDF files you download are created on your device too.",
        },
      ],
    },
    {
      title: 'What your browser does download',
      paragraphs: [
        'Not uploading does not mean not downloading. A speech model is a large file, and your browser has to fetch it before it can transcribe anything. This is what comes in, and from where.',
      ],
      table: {
        caption: 'What the page downloads, where from and when',
        head: ['What', 'From', 'When', 'Roughly how big'],
        rows: [
          [
            'The page and its program code',
            'transcribevid.com (Cloudflare)',
            'Each visit, then cached',
            'About 200 KB',
          ],
          [
            'The engine code that runs the model',
            'transcribevid.com',
            'First transcription, then cached',
            'Under 1 MB',
          ],
          [
            'The model runtime (ONNX Runtime, WebAssembly)',
            'cdn.jsdelivr.net (jsDelivr)',
            'First transcription, then cached',
            'About 17 to 27 MB',
          ],
          [
            'A small speech-detection model',
            'transcribevid.com',
            'First transcription, then cached',
            'About 1.2 MB',
          ],
          [
            'The speech model for your quality choice',
            'huggingface.co (Hugging Face)',
            'Once per quality choice, then cached',
            'From about 40 MB to a few GB (see below)',
          ],
          [
            'A converter for formats the browser cannot open (AVI, WMA, FLV and similar)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Only if your file needs it, and only after you agree',
            'About 9 MB',
          ],
          [
            'The Hindi spelling model (IndicXlit)',
            'transcribevid.com',
            'Only when Hindi is written in Roman letters (Hinglish), then cached',
            'About 13 MB',
          ],
        ],
      },
      after: [
        'These downloads are program and model files, not your data. The companies that deliver them see the usual details of any web request, such as your internet address and browser, but never your media or your transcript.',
      ],
    },
    {
      title: 'What is still sent, honestly',
      paragraphs: ['Three things do reach a server, and none of them is your file or your text.'],
      bullets: [
        {
          title: 'The hosting.',
          text: 'Cloudflare delivers the website, so it processes your internet address and the usual request details to deliver and protect the site.',
        },
        {
          title: 'A running total.',
          text: "When a transcription finishes, your browser sends one empty request to the site's counter, which adds one to the number shown in the header. It carries no file, no transcript and no identifier. The counter is reported by visitors' browsers and is not independently verified.",
        },
        {
          title: 'Advertising.',
          text: "The site is free because it shows ads served by Google AdSense, on information pages, never while a file is being transcribed and never beside your transcript. Google uses cookies for ads and, where the law requires it, asks for your consent first. Google's ad scripts make requests of their own to Google, but your file and transcript are never sent to Google.",
        },
      ],
      after: [
        'The privacy policy sets all of this out in full. There is no account, and the site asks for no name or e-mail address.',
      ],
    },
    {
      title: 'How to check it yourself',
      paragraphs: [
        'You do not have to take our word for it. Every modern browser can show you what a page sends and receives, and the check takes two minutes.',
      ],
      steps: [
        {
          title: 'Open the developer tools',
          text: 'In Chrome, Edge or Firefox, open the transcribevid.com home page and press F12 (on a Mac, Command, Option and I). Choose the Network tab.',
        },
        {
          title: 'Clear the list',
          text: 'Press the clear button, which looks like a circle with a line through it, so only new requests appear.',
        },
        {
          title: 'Start a transcription',
          text: 'Add a file and press Transcribe. Keep the Network tab visible.',
        },
        {
          title: 'Watch what comes in',
          text: 'The first time, you will see large downloads from huggingface.co and cdn.jsdelivr.net. Those are the model and the engine arriving.',
        },
        {
          title: 'Look for what goes out',
          text: "Type method:POST into the filter box (Chrome and Edge; Firefox accepts the same filter). The only POST request to transcribevid.com should be one empty request to /api/count after the transcript finishes. Open it and check its request body: it is empty. If the page shows ads, Google's own scripts make requests of their own to Google, and none of them carries your file or your transcript. Nothing close to the size of your file leaves your device.",
        },
      ],
    },
    {
      title: 'How big is the first download, and how fast is it?',
      paragraphs: [
        'The size depends on the quality level and on the kind of device. A device with WebGPU gets a build that is compact for its size, while a device that uses WebAssembly gets a different build. The page tells you the exact download size before it starts, so you are never surprised. These are the approximate sizes of the model files (the WebGPU figures are for browsers with 16-bit shader support; other devices get other builds):',
      ],
      table: {
        caption: 'Approximate first-time model download',
        head: ['Quality choice', 'Whisper model', 'With WebGPU', 'With WebAssembly'],
        rows: [
          ['Fastest', 'Base', 'About 146 MB', 'About 77 MB'],
          ['Standard', 'Small', 'About 485 MB', 'About 249 MB'],
          ['High accuracy', 'Large v3 Turbo', 'About 564 MB', 'About 1.1 GB'],
          [
            'Best accuracy',
            'Large v3',
            'About 980 MB, plus about 564 MB for word timing',
            'About 1.8 GB, plus about 1.1 GB for word timing',
          ],
        ],
      },
      after: [
        "Add a few megabytes for the model's configuration files. Large v3 has no word-timing version of its own, so with Word-level timing on, which is the default, its first run also downloads the Large v3 Turbo timing model, and the page says so before you start. That Turbo model is kept and is shared with the High accuracy choice. After the first download the model is read from your browser's cache, so later transcriptions start at once. Speed after that depends entirely on your device: a computer with a capable graphics chip and WebGPU is much faster than a phone or an older laptop using WebAssembly.",
      ],
    },
    {
      title: 'When this is the right tool, and when it is not',
      paragraphs: [
        'Transcribing on your own device is a good fit for private material and for long files. It is not the best tool for everything.',
      ],
      bullets: [
        {
          title: 'Good for confidential recordings.',
          text: 'On transcribevid.com, interviews, meetings, medical or legal notes and personal videos stay on your device.',
        },
        {
          title: 'Good for long files.',
          text: 'On transcribevid.com there is no upload to wait for and no size or length limit set. A very long recording needs time and free memory, and a browser without WebCodecs support may refuse a very long file.',
        },
        {
          title: 'Not for live captions.',
          text: 'The transcript is made from a finished file or recording. It does not caption a live event as it happens.',
        },
        {
          title: 'Not for speaker names.',
          text: 'Lines carry timestamps, but the text does not say who is speaking. You can type names in while you edit.',
        },
        {
          title: 'Not ideal on a weak phone.',
          text: 'Phones have less memory. The page warns you, and may switch off the largest quality choices, when your device cannot run them. Cut very long recordings into parts.',
        },
        {
          title: 'Not if you cannot download a large file once.',
          text: 'The first use needs a connection that can fetch tens or hundreds of megabytes.',
        },
      ],
    },
    {
      title: 'Clearing your data afterwards',
      paragraphs: [
        "On transcribevid.com, your transcripts and the source file are kept in your browser's storage so the page can show them and let you edit and export them. They are deleted automatically when your session ends after a period of inactivity, or at once when you press Delete my data now in the Transcripts menu. Deleted data cannot be recovered, so export what you need first.",
        "The speech models stay in your browser's cache so later transcriptions are quick, until you delete them (Delete my data now can remove them as well) or your browser clears its storage. If you use a shared or public computer, press Delete my data now before you leave, because anyone who can open that browser profile can read what is stored in it.",
      ],
    },
  ],
  faqs: [
    {
      question: 'Is it really true that my file is never uploaded?',
      answer:
        "Yes, on transcribevid.com. The recognition runs in your browser, and your file is read from your own disk by the page. You can confirm it in the Network tab of your browser's developer tools: the only request that sends anything to transcribevid.com is one empty count request after the transcript finishes, and Google's ad scripts make requests of their own to Google that never carry your file.",
    },
    {
      question: 'Does the transcription still work if my connection is slow?',
      answer:
        'The slow part is the first download of the speech model, which can be hundreds of megabytes. Once it is saved in your browser, the transcription itself uses your own device and needs no network speed.',
    },
    {
      question: 'Why does my browser download a model from another website?',
      answer:
        'The model is the program that recognises speech, and it is far too large to bundle into the page. It is downloaded from Hugging Face, a public host for such models, and the engine that runs it comes from jsDelivr. Neither of them receives your media or your transcript.',
    },
    {
      question: 'Is transcribing on my device faster than uploading?',
      answer:
        'It can be, because there is no upload and no queue, and a computer with WebGPU is quick. On an older laptop or a phone the same job can take longer than a fast server would. The first run also includes the one-time model download.',
    },
  ],
  links: [
    {
      label: 'Interview transcription',
      path: '/interview-transcription',
      note: 'The private route for research, journalism and hiring interviews.',
    },
    {
      label: 'What is Whisper?',
      path: '/guides/what-is-whisper',
      note: 'The speech model your browser runs, explained in plain words.',
    },
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: 'Settings and habits that give better text, whatever the device.',
    },
    {
      label: 'Video to text',
      path: '/video-to-text',
      note: 'Add a video and watch it become timestamped text on your own device.',
    },
    {
      label: 'Meeting recording to text',
      path: '/meeting-recording-to-text',
      note: 'Turn a saved Zoom, Teams or Meet recording into a searchable transcript.',
    },
  ],
};
