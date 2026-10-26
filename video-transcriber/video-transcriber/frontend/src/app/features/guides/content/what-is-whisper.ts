import { GuideContent } from '../guide.model';

export const CONTENT: GuideContent = {
  h1: 'What is Whisper? Speech-to-text explained',
  lead: 'Whisper is an open-source speech recognition model that OpenAI released in 2022. It turns spoken audio into text in about a hundred languages, and it can run on your own computer. This guide explains where it came from, what it learned from, how it works, where it is strong and weak, and how TranscribeVid runs it inside your browser.',
  readingMinutes: 7,
  toolPath: '/audio-to-text',
  toolCta: 'Try Whisper on your own audio',
  blocks: [
    {
      title: 'Whisper in one paragraph',
      paragraphs: [
        'Whisper is a neural network trained to listen to speech and write down what it hears. You give it sound; it returns text with timestamps, and it can also name the language and translate speech into English. It comes in several sizes, from a tiny version that fits on a phone to a large one that needs a powerful computer.',
        'It is not a website or a service. It is a set of files: the model and the code to run it. Anyone may download them and use them, which is why many free and private transcription tools, including this one, are built on it.',
      ],
    },
    {
      title: 'Where it came from',
      paragraphs: [
        'OpenAI published Whisper in September 2022, together with a research paper called "Robust Speech Recognition via Large-Scale Weak Supervision". The code and the trained models were released under the MIT licence, one of the most permissive open-source licences. It lets people use, change and ship the software, including in commercial products.',
        'Before Whisper, the best speech recognition was mostly locked inside the services of large companies, or built for one language or one kind of audio. Whisper changed that by being good enough, broad enough and free to run yourself. OpenAI also sells access to speech recognition through its own web service, but that is a separate paid product. The model you run in your browser here is the open one.',
      ],
    },
    {
      title: 'What it was trained on',
      paragraphs: [
        'Whisper learned from about 680,000 hours of audio paired with transcripts, collected from the internet. Roughly a third of that audio was not in English, covering about a hundred languages (the release lists 99). The transcripts were not all checked by hand, which is what "weak supervision" in the paper title refers to.',
        'Two practical results follow. Because the training audio was so varied, with different microphones, accents, rooms and topics, Whisper copes with real recordings better than models trained on tidy studio speech. But the amount of training audio differs from language to language, so accuracy is uneven: it is generally strongest for English and for other widely spoken languages that had plenty of examples, and weaker for languages with little training data.',
      ],
    },
    {
      title: 'How it works, in plain terms',
      paragraphs: [
        'Whisper cuts audio into windows of 30 seconds and turns each one into a picture of the sound, called a spectrogram, which shows how loud each pitch is over time. The model then has two halves. An encoder studies that picture. A decoder writes the text one small piece at a time, the way a person might write a sentence while thinking about what comes next.',
        'The decoder also writes special markers: which language it believes is spoken, whether to transcribe or translate, and where each sentence begins and ends in time. That is where the timestamps come from.',
        "Long recordings are handled window by window. This design is flexible, but it explains two of Whisper's habits: it can lose the thread between windows, and it can repeat itself when a window holds little speech. TranscribeVid reduces both with a speech detector that skips silence and most non-speech sound before the model sees it, and with checks that catch some repeated or invented text afterwards.",
      ],
    },
    {
      title: 'The model sizes, and which one you get here',
      paragraphs: [
        'Whisper comes in sizes. Bigger models make fewer mistakes, especially in noise and in languages other than English, but they are slower and need more memory and a bigger download. The four quality choices on the upload page map onto these sizes like this:',
      ],
      table: {
        caption: 'Whisper sizes and the choices on TranscribeVid',
        head: ['Model', 'Parameters (about)', 'Where you find it here'],
        rows: [
          ['Tiny', '39 million', 'More options, Model list'],
          ['Base', '74 million', 'Fastest'],
          ['Small', '244 million', 'Standard'],
          ['Medium', '769 million', 'More options, Model list'],
          ['Large v3 Turbo', '809 million', 'High accuracy'],
          ['Large v3', '1.55 billion', 'Best accuracy'],
        ],
      },
      after: [
        'Large v3 was released in November 2023, and the Turbo version came later, in 2024. Turbo is a trimmed large model that is much faster and close to it in accuracy for many languages, which is why it is the High accuracy choice. One limit: OpenAI says Turbo was not trained for translation and may return the original language when asked to translate, so for Output, Translate to English choose Best accuracy instead. The model list also has Distil Large v3, a smaller and faster distilled version of Whisper large v3 for English only. Under Recognition engine there is also Qwen3 ASR, a different, experimental engine for desktop browsers with WebGPU. Qwen3 ASR is not a Whisper model.',
      ],
    },
    {
      title: 'What it does well',
      bullets: [
        {
          title: 'Real-world audio.',
          text: 'Phone recordings, lectures, interviews and video soundtracks with moderate noise.',
        },
        {
          title: 'Many languages in one model.',
          text: 'The same model family handles English, Spanish, Hindi, Arabic, Japanese and dozens more, and can often work out the language itself.',
        },
        {
          title: 'Punctuation and casing.',
          text: 'It writes sentences with capital letters and punctuation, instead of one long string of lower-case words.',
        },
        {
          title: 'Timestamps.',
          text: 'Every line comes with a start and end time, and with word-level timing the page can place each word.',
        },
        {
          title: 'Translation into English.',
          text: 'It can turn speech in another language directly into English text, which the page offers as Output, Translate to English. Turbo is the exception: it was not trained for translation, so use Best accuracy for this.',
        },
      ],
    },
    {
      title: 'Where it struggles',
      paragraphs: [
        'Whisper is impressive, and it is also fallible. Know these habits before you rely on a transcript.',
      ],
      bullets: [
        {
          title: 'It can invent text.',
          text: 'Given silence, music or noise, it may write fluent words nobody said, or repeat a phrase again and again. This is a known behaviour of the model, not a fault of one recording.',
        },
        {
          title: 'Names, numbers and rare words.',
          text: 'It spells a name the way it finds most likely, and can swap similar-sounding words. Use the vocabulary hint, then check figures.',
        },
        {
          title: 'Uneven languages.',
          text: 'Accuracy varies by language and by accent. A larger model helps a lot for languages with less training data.',
        },
        {
          title: 'No speaker labels.',
          text: 'It does not say who is talking, and overlapping voices are often merged or dropped.',
        },
        {
          title: 'Not live.',
          text: 'It works on a recording window by window, so it is not built for captions that appear as someone speaks.',
        },
      ],
    },
    {
      title: 'How TranscribeVid runs Whisper in your browser',
      paragraphs: [
        'The original Whisper is written for specialist machine-learning software. To run it in a web page, the models are converted to a portable format called ONNX, and a library called Transformers.js, from Hugging Face, runs them using ONNX Runtime. On a computer with WebGPU the work is done by the graphics chip, which is fast. Otherwise it runs on the processor through WebAssembly, which is slower but works almost everywhere.',
        'To keep the downloads reasonable, the models use compact number formats, which shrink the files, usually at a small cost in accuracy. That is how the largest model is about a gigabyte with WebGPU (1.8 GB with WebAssembly) instead of several.',
        'On transcribevid.com, running in the browser has two consequences. First, privacy: your media file is read on your device and not uploaded, so no server of ours ever receives your audio. Second, speed: it depends on your device, and the first use of each quality level includes a one-time model download. The guide on transcribing without uploading explains what is downloaded and how to check it.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Is Whisper free to use?',
      answer:
        'The model and its code are free and open source under the MIT licence, so anyone can run them. Running a large model needs a capable computer or a rented server, and OpenAI also offers its own paid web service. On transcribevid.com it runs on your device, so there is nothing to pay.',
    },
    {
      question: 'How many languages does Whisper understand?',
      answer:
        'About a hundred; the release lists 99. Quality differs a lot between them. TranscribeVid offers 61 of them in its Language list, and you can also choose Detect automatically.',
    },
    {
      question: 'Which Whisper size should I choose?',
      answer:
        'Start with Standard, which is the Small model. Move to High accuracy for accents, noise or languages other than English, and to Best accuracy when every word counts and you can wait. Fastest is only for clear, quiet speech.',
    },
    {
      question: 'Why does Whisper sometimes write words where nobody is speaking?',
      answer:
        'The model is built to always produce plausible text, so a stretch of silence, music or noise can make it invent some. Keeping Skip silence & music switched on skips most of those stretches before the model sees them.',
    },
  ],
  links: [
    {
      label: 'How to get a more accurate transcript',
      path: '/guides/accurate-transcripts',
      note: "The settings and habits that make the biggest difference to Whisper's output.",
    },
    {
      label: 'Transcribe a video without uploading it',
      path: '/guides/transcribe-video-without-uploading',
      note: 'What your browser downloads to run Whisper, and how to verify nothing is uploaded.',
    },
    {
      label: 'Translate speech to English',
      path: '/translate-audio-to-english',
      note: "Use Whisper's translation to get English text from speech in another language.",
    },
    {
      label: 'Audio to text',
      path: '/audio-to-text',
      note: 'Drop in a recording and get a timestamped transcript.',
    },
    {
      label: 'Hindi audio to text',
      path: '/hindi-audio-to-text',
      note: 'How Whisper handles Hindi, including a Roman-letter Hinglish option.',
    },
  ],
};
