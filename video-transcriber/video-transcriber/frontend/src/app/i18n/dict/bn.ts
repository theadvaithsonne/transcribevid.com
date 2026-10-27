/** Bengali dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
export const PAGES: readonly string[] = [
  '/',
  '/how-it-works',
  '/faq',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/tools',
  '/guides',
];

const dict: Record<string, string> = {
  '.': '।',
  '"{name}" is {size}; the limit is {limit}.': '"{name}" ফাইলটির আকার {size}; সীমা {limit}।',
  '"{name}" is empty.': '"{name}" ফাইলটি খালি।',
  '"{name}" is ready. Press Transcribe to start.':
    '"{name}" প্রস্তুত। শুরু করতে ট্রান্সক্রাইব করুন চাপুন।',
  '“{title}” was deleted.': '“{title}” মুছে ফেলা হয়েছে।',
  '(optional)': '(ঐচ্ছিক)',
  '{base} Word timing: {timing}.': '{base} শব্দের সময়: {timing}।',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand} ({domain}) পরিচালনা করেন **{name}**, {address} ("আমরা", "আমাদের")। আপনার ডেটা কীভাবে ও কেন প্রক্রিয়া করা হবে, তা আমরাই ঠিক করি, যেমনটি এখানে বর্ণনা করা হয়েছে।',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand} ({domain}) পরিচালনা করেন **{name}**, {address}। আরও জানতে [আমাদের সম্পর্কে](/about) পৃষ্ঠাটি দেখুন।',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand} সাধারণ দর্শকদের জন্য একটি সেবা এবং এটি 13 বছরের কম বয়সী শিশুদের (বা প্রযোজ্য ক্ষেত্রে ইউরোপীয় ইউনিয়নে 16 বছরের কম বয়সীদের) উদ্দেশে নয়।',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand} তৈরি ও পরিচালনা করেন **{name}**, {role} (অবস্থান: {city})। আমি এটি তৈরি করেছি মানুষকে সম্ভাব্য সেরা ট্রান্সক্রিপশনের অভিজ্ঞতা দিতে: প্রথম ক্লিক থেকেই মসৃণ, কোনো অ্যাকাউন্ট তৈরির ঝামেলা ছাড়া, আর এমন একটি পরিচ্ছন্ন ইন্টারফেস যা কাজের পথে বাধা হয়ে দাঁড়ায় না।',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} সাধারণ দর্শকদের জন্য এবং এটি 13 বছরের কম বয়সী শিশুদের উদ্দেশে নয়।',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages). No ad is shown while a file is being transcribed or beside your transcript, and never on the privacy, terms or logs pages.':
    '{brand} বিনামূল্যে, কারণ এতে বিজ্ঞাপন দেখানো হয়, যা পরিবেশন করে Google AdSense। বিজ্ঞাপন দেখা যায় কেবল তথ্যের পৃষ্ঠায় (হোম, কীভাবে কাজ করে, সচরাচর প্রশ্ন ও টুলের পৃষ্ঠা)। ফাইল ট্রান্সক্রাইব হওয়ার সময় বা আপনার ট্রান্সক্রিপ্টের পাশে কোনো বিজ্ঞাপন দেখানো হয় না, আর গোপনীয়তা, শর্তাবলি বা লগের পৃষ্ঠায় কখনোই নয়।',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    '{brand} ব্যবহার বিনামূল্যে। আপনার ফাইলের কী হয়, তা ব্যাখ্যা করা আছে [গোপনীয়তা নীতি](/privacy) পৃষ্ঠায়।',
  '{brand} is funded by ads shown on its information pages (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand}-এর অর্থায়ন আসে তথ্যের পৃষ্ঠায় দেখানো বিজ্ঞাপন থেকে (Google AdSense)। যেহেতু ট্রান্সক্রিপশন আপনার নিজের ডিভাইসেই হয়, তাই প্রতিটি ফাইলের জন্য সার্ভারের কোনো খরচ নেই, আর সেটাই সেবাটিকে বিনামূল্যে ও সীমাহীন রাখে। বিজ্ঞাপন কী ব্যবহার করে এবং আপনার সেটিং কীভাবে বেছে নেবেন, তা ব্যাখ্যা করা আছে [গোপনীয়তা নীতি](/privacy) পৃষ্ঠায়।',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand} তিনটি সহজ ধাপে ভিডিও বা অডিও ফাইলের কথাকে টাইমস্ট্যাম্পসহ টেক্সটে রূপান্তর করে।',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand} ভিডিও, অডিও ফাইল ও ভয়েস রেকর্ডিংয়ের কথাকে নির্ভুল, টাইমস্ট্যাম্পযুক্ত টেক্সটে রূপান্তর করে। এটি বিনামূল্যে, কত ফাইল ট্রান্সক্রাইব করবেন তার কোনো সীমা নেই, আর অ্যাকাউন্টও লাগে না: ওপরে একটি ফাইল বেছে নিন, ট্রান্সক্রাইব করুন চাপুন এবং ফলাফল পড়ুন।',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand} আপনার ব্রাউজারেই ভিডিও ও অডিও ফাইলকে টেক্সটে রূপান্তর করে: শনাক্তকরণ চলে আপনার ডিভাইসে, আর আপনার ফাইল আমাদের কাছে আপলোড হয় না। এটি ব্যবহার বিনামূল্যে এবং অ্যাকাউন্ট লাগে না। এর অর্থায়ন আসে তথ্যের পৃষ্ঠার বিজ্ঞাপন থেকে (Google AdSense; দেখুন [গোপনীয়তা নীতি](/privacy))। আমরা যেকোনো সময় বৈশিষ্ট্য বদলাতে, সীমিত করতে বা বন্ধ করতে পারি।',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand} বিনামূল্যে ভিডিও ও অডিওকে নির্ভুল, টাইমস্ট্যাম্পযুক্ত টেক্সটে রূপান্তর করে। সাইন-আপ নেই, সাইন-ইন নেই, ওয়াটারমার্কও নেই: পৃষ্ঠাটি খুলুন, একটি ফাইল বেছে নিন এবং আপনার ট্রান্সক্রিপ্ট পড়ুন।',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages, and are served by Google, which uses cookies.':
    '{brand} আপনার ব্রাউজারেই ভিডিও ও অডিওকে টেক্সটে রূপান্তর করে। এই পৃষ্ঠায় সহজ ভাষায় ব্যাখ্যা করা হয়েছে এতে আপনার ডেটার কী হয়। সংক্ষেপে: আপনার ফাইল কখনো আপনার ডিভাইস ছেড়ে যায় না। আপনার ট্রান্সক্রিপ্ট কেবল এই ব্রাউজারেই থাকে, কোনো অ্যাকাউন্ট নেই, আর সাইটটি নিজে থেকে কোনো কুকি সেট করে না। বিজ্ঞাপন দেখা যায় কেবল তথ্যের পৃষ্ঠায়; সেগুলো পরিবেশন করে Google, যা কুকি ব্যবহার করে।',
  '{done} of {total}': '{total}-এর মধ্যে {done}',
  '{duration} (estimate)': '{duration} (আনুমানিক)',
  '{gb} GB of memory recommended': '{gb} GB মেমরি সুপারিশ করা হয়',
  '{h} h': '{h} ঘণ্টা',
  '{h} h {m} min': '{h} ঘণ্টা {m} মিনিট',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)': '{label} (প্রথম ব্যবহারে {size} MB ডাউনলোড হয়)',
  "{label}, as reported by visitors' browsers": '{label}, দর্শকদের ব্রাউজারের জানানো অনুযায়ী',
  '{label}: common questions': '{label}: সচরাচর প্রশ্ন',
  '{label}. {title}.': '{label}। {title}।',
  '{label}. Look for it in your downloads.': '{label}। এটি আপনার ডাউনলোডের মধ্যে খুঁজুন।',
  '{language} → English': '{language} → ইংরেজি',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} {total}টির মধ্যে {done}টি ফাইল আগেই সারিতে ঢুকেছে; বাকি {left}টি এখনও তালিকায় আছে, আবার চেষ্টা করতে ট্রান্সক্রাইব করুন চাপুন।',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} {total}টির মধ্যে {done}টি ফাইল আগেই সারিতে ঢুকেছে; বাকি {left}টি এখনও তালিকায় আছে, আবার চেষ্টা করতে ট্রান্সক্রাইব করুন চাপুন।',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    'এই ডিভাইসে {model} রিয়েল-টাইমের চেয়ে ধীরে চলে: {audio} অডিওর জন্য {wait} (আনুমানিক)। Tiny বা Base আগে শেষ হয়।',
  '{n} files were skipped: not video or audio.': '{n}টি ফাইল বাদ দেওয়া হয়েছে: ভিডিও বা অডিও নয়।',
  '{n} h ago': '{n} ঘণ্টা আগে',
  '{n} min': '{n} মিনিট',
  '{n} min ago': '{n} মিনিট আগে',
  '{n} min left': 'আর {n} মিনিট বাকি',
  '{n} min read': 'পড়তে {n} মিনিট',
  '{n} minute': '{n} মিনিট',
  '{n} minutes': '{n} মিনিট',
  '{n} of {total}': '{total}-এর মধ্যে {n}',
  '{n} of those files are already in the list.': 'ওই ফাইলগুলোর {n}টি আগে থেকেই তালিকায় আছে।',
  '{n} video transcribed': '{n}টি ভিডিও ট্রান্সক্রাইব হয়েছে',
  '{n} videos transcribed': '{n}টি ভিডিও ট্রান্সক্রাইব হয়েছে',
  '{n} words': '{n}টি শব্দ',
  '{n}% done': '{n}% সম্পন্ন',
  '{n}% model confidence': '{n}% মডেলের আস্থা',
  '{n}s left': 'আর {n} সেকেন্ড বাকি',
  '{name} home': '{name} হোম',
  '{size} download': '{size} ডাউনলোড',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}।',
  '{title}. {blurb}': '{title}। {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}। {blurb} এই ডিভাইসে পাওয়া যায় না: {reason}।',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**এই ট্যাবের একটি প্রযুক্তিগত লগ।** লগ পৃষ্ঠায় এই ট্যাবের নিজস্ব প্রযুক্তিগত লগ দেখানো হয়। এটি আপনার ব্রাউজারেই থাকে এবং কোথাও পাঠানো হয় না।',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**শব্দভান্ডারের ইঙ্গিত যোগ করুন**: অডিওতে থাকা নাম, ব্র্যান্ড ও পেশাগত শব্দ, আপনি যেভাবে বানান চান সেভাবে লিখে।',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**শব্দভান্ডারের ইঙ্গিত যোগ করুন**: নাম, ব্র্যান্ড ও পেশাগত শব্দ, আপনি যেভাবে বানান চান সেভাবে লিখে।',
  '**Ads.** Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript.':
    '**বিজ্ঞাপন।** বিজ্ঞাপন দেখা যায় কেবল তথ্যের পৃষ্ঠায়, আর সেগুলো পরিবেশন করে Google, যা কুকি ব্যবহার করে। ফাইল ট্রান্সক্রাইব হওয়ার সময় বা আপনার ট্রান্সক্রিপ্টের পাশে কোনো বিজ্ঞাপন দেখানো হয় না।',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**চিহ্নিত লাইনগুলো দেখুন** এবং ট্রান্সক্রিপ্ট এডিটরে ঠিক করুন।',
  '**Choose the spoken language** instead of auto-detect.':
    'স্বয়ংক্রিয় শনাক্তকরণের বদলে **কথ্য ভাষাটি বেছে নিন**।',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**আপনার ফাইল বেছে নিন।** ওপরে একটি ভিডিও বা অডিও ফাইল ড্রপ করুন, আপনার ডিভাইস থেকে একটি বেছে নিন, অথবা মাইক্রোফোনে নিজের কণ্ঠ রেকর্ড করুন। MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG এবং বেশির ভাগ প্রচলিত ফরম্যাট কাজ করে।',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**অডিও উন্নত করুন** — গুমগুম ও হিস শব্দ ছেঁকে ফেলে, নিচু স্বরের বক্তাদের সমান করে',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**ফাইলের সীমা।** আমাদের পক্ষ থেকে কোনো সীমা নেই। আপনার ফাইল আপনার ডিভাইসেই প্রক্রিয়া হয়, তাই খুব বড় বা লম্বা ফাইলে বেশি সময় লাগে এবং যথেষ্ট খালি মেমরি দরকার; ধীর ডিভাইসে পৃষ্ঠাটি আপনাকে সতর্ক করে।',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**ফাইলের ধরন।** ভিডিও: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS ও MTS। অডিও: MP3, WAV, M4A, AAC, FLAC, OGG ও OPUS। সরাসরি আপনার মাইক্রোফোন থেকেও রেকর্ড করতে পারেন।',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**Google-এর কুকি।** বিজ্ঞাপন লোড হলে Google নিজের কুকি সেট করে, শুধু যেসব পৃষ্ঠায় বিজ্ঞাপন দেখানো হয় সেগুলোতেই (6 নম্বর ধারা দেখুন)।',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**লেকচার ও পডকাস্ট** পড়াশোনা বা শো নোটের জন্য পড়ার উপযোগী টেক্সটে রূপান্তরিত।',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**সীমা।** সার্ভার এই মুহূর্তে আকার বা দৈর্ঘ্যের কোনো সীমা জানায়নি। খুব বড় ফাইলে শুধু বেশি সময় লাগে।',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**সীমা।** আমরা আকার বা দৈর্ঘ্যের কোনো সীমা রাখিনি: আপনার ফাইল আপনার ডিভাইসেই প্রক্রিয়া হয়, তাই খুব বড় বা লম্বা ফাইলে শুধু বেশি সময় লাগে এবং যথেষ্ট খালি মেমরি দরকার। ধীর ডিভাইসে শুরুর আগেই পৃষ্ঠাটি আপনাকে জানায় এবং সময়ের আন্দাজ দেয়।',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**আপনার যোগ করা মিডিয়া।** আপনার বেছে নেওয়া বা রেকর্ড করা ভিডিও ও অডিও ফাইল। এগুলো আপনার ডিভাইসে, আপনার ব্রাউজারেই প্রক্রিয়া হয় (WebGPU বা WebAssembly ব্যবহার করে)। আপনার ফাইল আমাদের সার্ভারে কখনো আপলোড হয় না এবং Google বা অন্য কারও কাছে পাঠানোও হয় না।',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**মিটিং ও সাক্ষাৎকারের নোট**, যা আপনি খুঁজতে, উদ্ধৃত করতে ও শেয়ার করতে পারেন।',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**ভুল হতে পারে।** কোনো বাক-শনাক্তকরণই নিখুঁত নয়। গুরুত্বপূর্ণ কিছুর জন্য ভরসা করার আগে সবসময় ট্রান্সক্রিপ্টটি যাচাই করে নিন।',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**আমাদের নিজস্ব কোনো কুকি নেই।** সাইটটি নিজে কোনো কুকি সেট করে না।',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**পরের জন্য কিছু সংরক্ষিত থাকে না।** ফাইল ও ট্রান্সক্রিপ্ট কেবল আপনার সেশনের জন্যই থাকে। যাওয়ার আগে যা দরকার এক্সপোর্ট করে নিন। বিস্তারিত আছে [গোপনীয়তা নীতি](/privacy) পৃষ্ঠায়।',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**পরের জন্য কিছু সংরক্ষিত থাকে না।** ট্রান্সক্রিপ্ট ও ফাইল কেবল এই ব্রাউজারেই থাকে এবং {idle} নিষ্ক্রিয় থাকার পর, অথবা আপনি **আমার ডেটা এখনই মুছুন** চাপলে নিজে থেকেই মুছে যায়। যাওয়ার আগে যা দরকার এক্সপোর্ট করে নিন। বিস্তারিত আছে [গোপনীয়তা নীতি](/privacy) পৃষ্ঠায়।',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**পরের জন্য কিছু সংরক্ষিত থাকে না।** ট্রান্সক্রিপ্ট কেবল এই সেশনের জন্যই থাকে, তাই যা দরকার এক্সপোর্ট করে নিন। হোস্ট করা ওয়েবসাইটের বিবরণ আছে [গোপনীয়তা নীতি](/privacy) পৃষ্ঠায়।',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**একটি চলতি মোট সংখ্যা।** একটি ট্রান্সক্রিপশন শেষ হলে আপনার ব্রাউজার আমাদের কাউন্টারে (একটি Cloudflare Worker) একটি নামহীন "+1" পাঠায়। এতে কোনো ফাইল, ট্রান্সক্রিপ্ট বা শনাক্তকারী থাকে না। Cloudflare পথে আপনার IP ঠিকানা দেখতে পায় এবং অপব্যবহার ঠেকাতে অল্প সময়ের জন্য তা ব্যবহার করে (রেট লিমিট); আমরা শুধু মোট সংখ্যাটি রাখি। পৃষ্ঠার হেডারে দেখানো সংখ্যাটি দর্শকদের ব্রাউজারের জানানো এবং যাচাই করা নয়।',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    'কঠিন অডিওর জন্য **উচ্চ নির্ভুলতা বা সর্বোচ্চ নির্ভুলতা বেছে নিন**।',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**গুণমান ও ভাষা বেছে নিন।** দ্রুততর মডেল দ্রুত একটি খসড়া দেয়; আরও নির্ভুল মডেল সাক্ষাৎকার, লেকচার ও সাবটাইটেলের জন্য ভালো। কথ্য ভাষা আপনার হয়ে শনাক্ত করা যায়, আর 50-এর বেশি ভাষা সমর্থিত।',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    'সম্পন্ন ট্রান্সক্রিপ্টটি অন্য গুণমান বা ভাষায় **আবার ট্রান্সক্রাইব করুন**; আপনার বর্তমান ট্রান্সক্রিপ্ট থেকে যায়।',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    'অন্য গুণমান বা ভাষায় **আবার ট্রান্সক্রাইব করুন**; আপনার বর্তমান ট্রান্সক্রিপ্ট থেকে যায়।',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**পড়ুন, ঠিক করুন ও ডাউনলোড করুন।** ট্রান্সক্রিপ্ট টাইমস্ট্যাম্পসহ দেখা যায়, আর যেসব শব্দে মডেল নিশ্চিত ছিল না সেগুলো চিহ্নিত থাকে, যাতে আপনি যাচাই করতে পারেন। সাধারণ টেক্সট, SRT বা VTT সাবটাইটেল, Markdown বা JSON হিসেবে ডাউনলোড করুন।',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**ওয়েবসাইট পৌঁছে দেওয়ার অনুরোধ।** এই ওয়েবসাইট পৌঁছে দেয় Cloudflare (Cloudflare Pages)। আমাদের হোস্টিং ও নেটওয়ার্ক সেবাদাতা হিসেবে এটি সাইট পৌঁছে দিতে ও সুরক্ষিত রাখতে আপনার IP ঠিকানা এবং স্বাভাবিক অনুরোধের তথ্য (যেমন সময়, চাওয়া পৃষ্ঠা ও আপনার ব্রাউজার) প্রক্রিয়া করে।',
  '**Skip silence & music** — prevents made-up text':
    '**নীরবতা ও সংগীত বাদ দিন** — বানানো লেখা ঠেকায়',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**স্পিচ মডেল আপনার ব্রাউজারের ক্যাশে থাকে** (Cache Storage), তাই পরের ট্রান্সক্রিপশন দ্রুত শুরু হয়, যতক্ষণ না আপনি সেগুলো মুছে ফেলেন (**আমার ডেটা এখনই মুছুন**-ও সেগুলো মুছতে পারে) বা আপনার ব্রাউজার তার স্টোরেজ পরিষ্কার করে। এগুলো প্রোগ্রাম ফাইল, আপনার ডেটা নয়।',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**গতি।** এটি নির্ভর করে আপনার বেছে নেওয়া গুণমান, ফাইলের দৈর্ঘ্য এবং সেবাটি কতটা ব্যস্ত তার ওপর।',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**গতি।** এটি নির্ভর করে আপনার ডিভাইস, বেছে নেওয়া গুণমান এবং ফাইলের দৈর্ঘ্যের ওপর। কোনো গুণমান স্তরের প্রথম ব্যবহারে তার মডেল একবার ডাউনলোড হয়: আপনার ব্রাউজার মডেলের ফাইলগুলো Hugging Face থেকে এবং ইঞ্জিনের প্রোগ্রাম ফাইলগুলো jsDelivr থেকে আনে, তারপর ক্যাশে রেখে দেয়। কাজ চলার সময় ট্যাবটি খোলা রাখুন।',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**ভালো অডিও দিয়ে শুরু করুন**: কম পেছনের শব্দ, কাছের মাইক্রোফোন, আর একবারে একজন কথা বলা। "অডিও উন্নত করুন" চালু রাখুন।',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**ভালো অডিও দিয়ে শুরু করুন**: সামান্য পেছনের শব্দ, কাছের মাইক্রোফোন, একবারে একজন। "অডিও উন্নত করুন" চালু রাখুন।',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**আপনার ব্রাউজারের স্টোরেজ।** আপনার ব্রাউজার ওপরে বর্ণিতভাবে আপনার ট্রান্সক্রিপ্ট ও ফাইল (IndexedDB) এবং স্পিচ মডেল (Cache Storage) রাখে, আপনার লাইট বা ডার্ক থিমের পছন্দ মনে রাখে, আর এর সেশন স্টোরেজ বর্তমান ট্যাবের জন্য কয়েকটি সুবিধার সেটিং রাখে (যেমন আপনার শেষ গুণমানের পছন্দ)। এর কিছুই আমাদের কাছে পাঠানো হয় না।',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    'নিজের ভিডিও, রিল ও অনলাইন কোর্সের জন্য **সাবটাইটেল ও ক্যাপশন**, SRT বা VTT ফাইল থেকে।',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**আপনার ডিভাইসে তৈরি টেক্সট।** ট্রান্সক্রিপ্ট, তার টাইমস্ট্যাম্প ও আপনার সম্পাদনা, আপনার দেওয়া শিরোনাম এবং আপনার বেছে নেওয়া সেটিং (গুণমান, ভাষা, শব্দভান্ডারের ইঙ্গিত)। এগুলো এই ব্রাউজারেই তৈরি হয় ও থাকে; আমরা কখনো এগুলো পাই না।',
  '**Use previous text as context** — can repeat on long files':
    '**আগের লেখাকে প্রসঙ্গ হিসেবে ব্যবহার করুন** — লম্বা ফাইলে পুনরাবৃত্তি হতে পারে',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**ভয়েস মেমো** লিখিত আকারে, যাতে আর শুনতে না হয়।',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**কেন ফলাফল বিভিন্ন বারে, গুণমান সেটিংয়ে বা অন্য টুলে আলাদা হতে পারে?** বাক-শনাক্তকরণ সম্ভাব্যতাভিত্তিক: এটি সবচেয়ে সম্ভাব্য শব্দগুলো বেছে নেয়, আর গোলমেলে বা অস্পষ্ট অংশে কয়েকটি উত্তর কাছাকাছি থাকে। ভিন্ন গুণমান সেটিং, ভাষা সেটিং, শব্দভান্ডারের ইঙ্গিত বা অডিও পরিষ্কার করার ধাপ লেখা বদলে দিতে পারে, অন্য ব্যবস্থা ব্যবহার করা কোনো টুলও পারে। বক্তার নাম বা লেবেল যোগ করা হয় না।',
  '**Word-level timing** — better subtitles and confidence marks':
    '**প্রতিটি শব্দের সময়** — আরও ভালো সাবটাইটেল ও আস্থার চিহ্ন',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**আপনার ফাইল ও ট্রান্সক্রিপ্ট এই ব্রাউজারেই থাকে।** ট্রান্সক্রিপ্ট, সম্পাদনা ও মূল ফাইল শুধু এই ব্রাউজারের স্টোরেজে (IndexedDB) রাখা হয়। আপনার সেশন শেষ হলে, অর্থাৎ {idle} নিষ্ক্রিয় থাকার পর, এগুলো নিজে থেকেই মুছে যায়, অথবা ট্রান্সক্রিপ্ট মেনুতে **আমার ডেটা এখনই মুছুন** চাপলে তখনই মুছে যায়।',
  '1 file was skipped: not video or audio.': '1টি ফাইল বাদ দেওয়া হয়েছে: ভিডিও বা অডিও নয়।',
  '1 minute': '1 মিনিট',
  '1 word': '1টি শব্দ',
  '1. Agreement': '1. সম্মতি',
  '1. Who runs this website': '1. এই ওয়েবসাইট কে পরিচালনা করে',
  '10. Children': '10. শিশু',
  '10. Termination': '10. অবসান',
  '11. Children': '11. শিশু',
  '11. Your rights and choices': '11. আপনার অধিকার ও পছন্দ',
  '12. Changes': '12. পরিবর্তন',
  '12. Open-source components': '12. ওপেন-সোর্স উপাদান',
  '13. Changes to this policy': '13. এই নীতিতে পরিবর্তন',
  '13. Governing law': '13. প্রযোজ্য আইন',
  '14. Contact': '14. যোগাযোগ',
  '2. The service': '2. সেবা',
  '2. What is processed, and where': '2. কী প্রক্রিয়া হয়, এবং কোথায়',
  '3 simple steps': '3টি সহজ ধাপ',
  '3. Why it is processed': '3. কেন তা প্রক্রিয়া হয়',
  '3. Your content': '3. আপনার কনটেন্ট',
  '4. Acceptable use': '4. গ্রহণযোগ্য ব্যবহার',
  '4. How long it is kept': '4. কতদিন রাখা হয়',
  '5. Downloads your browser makes': '5. আপনার ব্রাউজার যা ডাউনলোড করে',
  '5. Limits: your device does the work': '5. সীমা: কাজ করে আপনার ডিভাইস',
  '6. Accuracy: no warranty': '6. নির্ভুলতা: কোনো গ্যারান্টি নেই',
  '6. Advertising': '6. বিজ্ঞাপন',
  '7. Availability': '7. প্রাপ্যতা',
  '7. Cookies and browser storage': '7. কুকি ও ব্রাউজার স্টোরেজ',
  '8. Sharing': '8. শেয়ার করা',
  '8. Third-party downloads and ads': '8. তৃতীয় পক্ষের ডাউনলোড ও বিজ্ঞাপন',
  '9. Liability': '9. দায়বদ্ধতা',
  '9. Security': '9. নিরাপত্তা',
  'A name cannot be empty, so the old name was kept.':
    'নাম খালি রাখা যায় না, তাই আগের নামটি রাখা হয়েছে।',
  'A new transcript has started. The old one is kept in your list.':
    'একটি নতুন ট্রান্সক্রিপ্ট শুরু হয়েছে। পুরনোটি আপনার তালিকায় রাখা আছে।',
  'a period': 'একটি সময়কাল',
  About: 'আমাদের সম্পর্কে',
  'About {brand}': '{brand} সম্পর্কে',
  'about {h} h': 'প্রায় {h} ঘণ্টা',
  'about {h} h {m} min': 'প্রায় {h} ঘণ্টা {m} মিনিট',
  'about {n} min': 'প্রায় {n} মিনিট',
  'Accurate text': 'নির্ভুল টেক্সট',
  'Add another file': 'আরেকটি ফাইল যোগ করুন',
  'Add your file': 'আপনার ফাইল যোগ করুন',
  'Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    'বিজ্ঞাপন দেখা যায় কেবল তথ্যের পৃষ্ঠায়, আর সেগুলো পরিবেশন করে Google, যা কুকি ব্যবহার করে। ফাইল ট্রান্সক্রাইব হওয়ার সময় বা আপনার ট্রান্সক্রিপ্টের পাশে কোনো বিজ্ঞাপন দেখানো হয় না, এবং এই ওয়েবসাইট নিজে কোনো কুকি সেট করে না। বিস্তারিত আছে [গোপনীয়তা নীতি](/privacy) পৃষ্ঠায়।',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'কোনো বৈশিষ্ট্যের জন্যই বিজ্ঞাপন দরকার নেই: বিজ্ঞাপন ব্লক করা বা প্রত্যাখ্যান করা থাকলেও সবকিছু একইভাবে কাজ করে।',
  'Ads keep TranscribeVid free. Everything works without them.':
    'বিজ্ঞাপন TranscribeVid-কে বিনামূল্যে রাখে। এগুলো ছাড়াও সবকিছু কাজ করে।',
  Advertisement: 'বিজ্ঞাপন',
  'All free tools': 'সব বিনামূল্যের টুল',
  'All free video and audio to text tools': 'ভিডিও ও অডিও থেকে টেক্সটের সব বিনামূল্যের টুল',
  'All tools': 'সব টুল',
  'All your data was deleted': 'আপনার সব ডেটা মুছে ফেলা হয়েছে',
  'Allow the microphone in your browser, or choose a file instead.':
    'ব্রাউজারে মাইক্রোফোনের অনুমতি দিন, অথবা এর বদলে একটি ফাইল বেছে নিন।',
  'Already added': 'আগেই যোগ করা হয়েছে',
  'Already finished': 'আগেই শেষ হয়েছে',
  'Also delete the downloaded speech models?': 'ডাউনলোড করা স্পিচ মডেলগুলোও মুছে ফেলবেন?',
  'an independent software developer': 'একজন স্বাধীন সফটওয়্যার ডেভেলপার',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'একটি আপলোড চলছে। আরও ফাইল যোগ করার আগে সেটি শেষ হওয়া পর্যন্ত অপেক্ষা করুন।',
  'Apply style only': 'শুধু ধরন প্রয়োগ করুন',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    'ধরন প্রয়োগ করলে অডিও আবার প্রক্রিয়া না করে সংরক্ষিত শনাক্তকরণ ব্যবহার করা হয়। সম্পাদনা করা লাইনগুলো থেকে যায়।',
  'Audio works too.': 'অডিও ফাইলেও কাজ করে।',
  'Automatic (IndicXlit when installed)': 'স্বয়ংক্রিয় (IndicXlit ইনস্টল থাকলে)',
  Back: 'পেছনে',
  'Basic phonetic spelling': 'মৌলিক ধ্বনিভিত্তিক বানান',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'যেহেতু আমাদের কাছে কোনো অ্যাকাউন্ট বা আপনাকে শনাক্ত করার মতো তথ্য নেই, তাই সাধারণত কোনো ডেটাকে কোনো ব্যক্তির সঙ্গে যুক্ত করা আমাদের পক্ষে সম্ভব হয় না। আইন যেখানে আপনার ব্যক্তিগত ডেটার ওপর অধিকার দেয়, যেমন প্রবেশাধিকার, সংশোধন, মুছে ফেলা, সীমিত করা, আপত্তি জানানো ও ডেটা স্থানান্তরযোগ্যতা, অথবা আপনার ডেটা সুরক্ষা কর্তৃপক্ষের কাছে অভিযোগ করার অধিকার, সেখানে আপনি আমাদের সঙ্গে যোগাযোগ করে তা প্রয়োগ করতে পারেন:',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'যেহেতু আপনার ট্রান্সক্রিপ্ট কেবল এই ব্রাউজারেই আছে, যাওয়ার আগে যা দরকার এক্সপোর্ট করে নিন। মুছে ফেলা ডেটা ফিরিয়ে আনা যায় না।',
  'Bengaluru, India': 'বেঙ্গালুরু, ভারত',
  'Best accuracy': 'সর্বোচ্চ নির্ভুলতা',
  'Best accuracy, slowest': 'সর্বোচ্চ নির্ভুলতা, সবচেয়ে ধীর',
  Breadcrumb: 'ব্রেডক্রাম্ব',
  'By file type': 'ফাইলের ধরন অনুযায়ী',
  'By language': 'ভাষা অনুযায়ী',
  'By use': 'ব্যবহার অনুযায়ী',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    '{brand} ({domain}) ব্যবহার করলে আপনি এই শর্তাবলিতে সম্মত হন। সম্মত না হলে অনুগ্রহ করে সেবাটি ব্যবহার করবেন না। সেবাটি পরিচালনা করেন **{name}**, {address}।',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'এই ওয়েবসাইট বা এর কাউন্টারের রেট লিমিট বা নিরাপত্তা এড়িয়ে যাবেন না বা এড়ানোর চেষ্টা করবেন না, এবং এর পরিচালনা বা অন্য দর্শকদের ব্যবহারে বাধা দেবেন না;',
  'Can I edit the transcript?': 'আমি কি ট্রান্সক্রিপ্ট সম্পাদনা করতে পারি?',
  "Can't reach the server.": 'সার্ভারে পৌঁছানো যাচ্ছে না।',
  Cancel: 'বাতিল করুন',
  'Cancel "{title}"?': '"{title}" বাতিল করবেন?',
  'Cancel {title}': '{title} বাতিল করুন',
  'Cancellation requested': 'বাতিলের অনুরোধ করা হয়েছে',
  Cancelled: 'বাতিল হয়েছে',
  'Cancelling…': 'বাতিল করা হচ্ছে…',
  'Cannot reach the server': 'সার্ভারে পৌঁছানো যাচ্ছে না',
  'Cannot reach the server.': 'সার্ভারে পৌঁছানো যাচ্ছে না।',
  'Cannot reach the server. Check your connection and try again.':
    'সার্ভারে পৌঁছানো যাচ্ছে না। আপনার সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'সার্ভারে পৌঁছানো যাচ্ছে না। সার্ভার চালু আছে কি না দেখুন (npm run dev) এবং আবার চেষ্টা করুন।',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'একটি লাইন বদলান বা মুছুন, অথবা খুঁজে প্রতিস্থাপন করুন। আপনার সম্পাদনা প্রতিটি ডাউনলোডে থাকে।',
  'Changed in {n} lines.': '{n}টি লাইনে বদলানো হয়েছে।',
  'Check Hinglish spelling': 'হিংলিশ বানান যাচাই করুন',
  'Choose "Save as PDF" in the print dialog.':
    'প্রিন্ট ডায়ালগে "PDF হিসেবে সংরক্ষণ করুন" বেছে নিন।',
  'Choose a file': 'ফাইল বেছে নিন',
  'Choose a file first': 'আগে একটি ফাইল বেছে নিন',
  'Choose a format': 'একটি ফরম্যাট বেছে নিন',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'আপনার ডিভাইস ও হাতে থাকা সময় অনুযায়ী দ্রুততর বা আরও নির্ভুল মডেলের মধ্যে বেছে নিন।',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'সবচেয়ে দ্রুত, স্ট্যান্ডার্ড, উচ্চ নির্ভুলতা বা সর্বোচ্চ নির্ভুলতা বেছে নিন: সবচেয়ে দ্রুত সবচেয়ে তাড়াতাড়ি শেষ হয়, সর্বোচ্চ নির্ভুলতায় ভুল সবচেয়ে কম হয়।',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'কথ্য ভাষাটি বেছে নিন বা স্বয়ংক্রিয় শনাক্তকরণে রেখে দিন। কথাকে ইংরেজিতেও অনুবাদ করতে পারেন।',
  'Chosen files': 'বেছে নেওয়া ফাইল',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'মাইক্রোফোনের কাছ থেকে স্পষ্ট কথা বললে সবচেয়ে ভালো ফল পাওয়া যায়। আরও বিকল্প-এর ভেতরে **অডিও উন্নত করুন** ও **নীরবতা ও সংগীত বাদ দিন** ডিফল্টভাবে চালু থাকে: এগুলো গুমগুম ও হিস শব্দ ছেঁকে ফেলে এবং গান বা লম্বা বিরতির সময় মডেলকে লেখা বানানো থেকে আটকায়, তাই গোলমেলে রেকর্ডিংয়ে চালু রাখুন। সাবটাইটেলের জন্য **প্রতিটি শব্দের সময়**ও চালু রাখুন, যাতে প্রতিটি লাইন ঠিক কথার সঙ্গে শুরু ও শেষ হয়।',
  Close: 'বন্ধ করুন',
  'Close menu': 'মেনু বন্ধ করুন',
  'Close: {title}': 'বন্ধ করুন: {title}',
  'Common questions': 'সাধারণ প্রশ্ন',
  Contact: 'যোগাযোগ',
  'Converting…': 'রূপান্তর করা হচ্ছে…',
  Copied: 'কপি হয়েছে',
  'Copy text': 'টেক্সট কপি করুন',
  'Copying…': 'কপি করা হচ্ছে…',
  'Could not cancel the transcript.': 'ট্রান্সক্রিপ্ট বাতিল করা যায়নি।',
  'Could not change transcript style.': 'ট্রান্সক্রিপ্টের ধরন বদলানো যায়নি।',
  'Could not copy': 'কপি করা যায়নি',
  'Could not delete the transcript.': 'ট্রান্সক্রিপ্ট মুছে ফেলা যায়নি।',
  'Could not delete your data.': 'আপনার ডেটা মুছে ফেলা যায়নি।',
  'Could not load the text to copy.': 'কপি করার টেক্সট লোড করা যায়নি।',
  'Could not prepare the file. Please try again.':
    'ফাইলটি প্রস্তুত করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
  'Could not rename the transcript.': 'ট্রান্সক্রিপ্টের নাম বদলানো যায়নি।',
  'Could not save the change.': 'পরিবর্তনটি সেভ করা যায়নি।',
  'Could not start': 'শুরু করা যায়নি',
  'Could not start.': 'শুরু করা যায়নি।',
  Dark: 'ডার্ক',
  Delete: 'মুছুন',
  'Delete "{title}" and its transcript?': '"{title}" ও তার ট্রান্সক্রিপ্ট মুছে ফেলবেন?',
  'Delete "{title}"? This cannot be undone.': '"{title}" মুছে ফেলবেন? এটি ফিরিয়ে আনা যাবে না।',
  'Delete {title}': '{title} মুছুন',
  'Delete all your transcripts and the files kept in this browser now?':
    'এই ব্রাউজারে রাখা আপনার সব ট্রান্সক্রিপ্ট ও ফাইল এখনই মুছে ফেলবেন?',
  'Delete all your transcripts and uploaded files now?':
    'আপনার সব ট্রান্সক্রিপ্ট ও আপলোড করা ফাইল এখনই মুছে ফেলবেন?',
  'Delete line': 'লাইন মুছুন',
  'Delete my data now': 'আমার ডেটা এখনই মুছুন',
  'Delete this line from the transcript?': 'ট্রান্সক্রিপ্ট থেকে এই লাইনটি মুছে ফেলবেন?',
  'Delete transcript': 'ট্রান্সক্রিপ্ট মুছুন',
  Deleted: 'মুছে ফেলা হয়েছে',
  'Detect automatically': 'স্বয়ংক্রিয়ভাবে শনাক্ত করুন',
  'Dismiss message': 'বার্তাটি সরিয়ে দিন',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3 কেবল ইংরেজি কথা বোঝে। অনুবাদ করতে অন্য একটি মডেল বেছে নিন।',
  Done: 'সম্পন্ন',
  'Download failed': 'ডাউনলোড ব্যর্থ হয়েছে',
  'Download started': 'ডাউনলোড শুরু হয়েছে',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'ফলাফল সাধারণ টেক্সট, SRT বা VTT সাবটাইটেল, Markdown বা JSON হিসেবে ডাউনলোড করুন।',
  'Download the transcript as': 'ট্রান্সক্রিপ্ট ডাউনলোড করুন এই ফরম্যাটে',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'স্পিচ মডেল ডাউনলোড হচ্ছে (শুধু প্রথমবার): {total}-এর মধ্যে {loaded}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    '[হোম পৃষ্ঠা](/)-য় একটি ভিডিও বা অডিও ফাইল ড্রপ করুন, অথবা মাইক্রোফোন থেকে রেকর্ড করুন।',
  'Drop to add your file': 'আপনার ফাইল যোগ করতে এখানে ড্রপ করুন',
  'Drop your {noun} here, or choose a file': '{noun} এখানে ড্রপ করুন অথবা ফাইল বেছে নিন',
  'Each line with its time, like [00:12]': 'প্রতিটি লাইন তার সময়সহ, যেমন [00:12]',
  Edit: 'সম্পাদনা',
  'Edit it right here': 'এখানেই সম্পাদনা করুন',
  'Edit this line': 'এই লাইনটি সম্পাদনা করুন',
  'Edited by you': 'আপনার সম্পাদিত',
  'English only, very fast and accurate': 'শুধু ইংরেজির জন্য, খুব দ্রুত ও নির্ভুল',
  'English translation is selected in More options.': 'আরও বিকল্প-এ ইংরেজি অনুবাদ বেছে নেওয়া আছে।',
  'Enter saves · Esc cancels': 'Enter সেভ করে · Esc বাতিল করে',
  'Every line has a time. Play the media from any line to hear what was said.':
    'প্রতিটি লাইনের একটি সময় আছে। যেকোনো লাইন থেকে মিডিয়া চালিয়ে শুনে নিন কী বলা হয়েছিল।',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'প্রতিটি পৃষ্ঠার কাজ একই: ভিডিও বা অডিও ফাইলের কথাকে প্রতিটি লাইনে টাইমস্ট্যাম্পসহ টেক্সটে রূপান্তর করা, 50-এর বেশি ভাষায়, সাইন-আপ ছাড়াই। আপনার হাতে থাকা ফাইল বা আপনি যা বানাতে চান, তার সঙ্গে মেলে এমন পৃষ্ঠাটি বেছে নিন।',
  'Experimental: compare on your audio; chunk timestamps':
    'পরীক্ষামূলক: আপনার অডিওতে তুলনা করে দেখুন; অংশভিত্তিক টাইমস্ট্যাম্প',
  'Experimental: larger model; chunk timestamps': 'পরীক্ষামূলক: বড় মডেল; অংশভিত্তিক টাইমস্ট্যাম্প',
  Export: 'এক্সপোর্ট',
  Failed: 'ব্যর্থ হয়েছে',
  FAQ: 'সচরাচর প্রশ্ন',
  Fast: 'দ্রুত',
  'Fast, clean audio': 'দ্রুত, পরিষ্কার অডিওর জন্য',
  Fastest: 'সবচেয়ে দ্রুত',
  'Fastest, rough drafts only': 'সবচেয়ে দ্রুত, শুধু কাঁচা খসড়ার জন্য',
  'Fewer mistakes. Takes longer.': 'ভুল কম হয়। সময় বেশি লাগে।',
  'Fewest mistakes. Takes the longest.': 'ভুল সবচেয়ে কম হয়। সবচেয়ে বেশি সময় লাগে।',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    '"{name}" ফাইলটির আকার {size}; সীমা {limit} - বাড়াতে VT_MAX_UPLOAD_MB সেট করুন',
  'File "{name}" is {size}; the limit is {limit}.': '"{name}" ফাইলটির আকার {size}; সীমা {limit}।',
  'file {n} of {total}': '{total}টির মধ্যে {n} নম্বর ফাইল',
  'File added': 'ফাইল যোগ করা হয়েছে',
  'File limits.': 'ফাইলের সীমা।',
  'File not added': 'ফাইল যোগ করা হয়নি',
  'File skipped': 'ফাইল বাদ দেওয়া হয়েছে',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'ফাইল ও ট্রান্সক্রিপ্ট কেবল আপনার সেশনের জন্যই থাকে। যাওয়ার আগে যা দরকার এক্সপোর্ট করে নিন। আমরা কেবল একটি নামহীন চলতি মোট সংখ্যা রাখি, সাইটে কতগুলো ফাইল ট্রান্সক্রাইব হয়েছে তার (একটি মাত্র সংখ্যা, পৃষ্ঠার হেডারে দেখানো হয়); এটি আপনার, আপনার ফাইলের বা আপনার সেশনের সঙ্গে যুক্ত নয়। বিস্তারিত আছে [গোপনীয়তা নীতি](/privacy) পৃষ্ঠায়।',
  'Find it automatically': 'স্বয়ংক্রিয়ভাবে খুঁজে নিন',
  'first time only, also downloads the {size} MB word-timing model':
    'শুধু প্রথমবার, সঙ্গে {size} MB-এর শব্দের সময়ের মডেলও ডাউনলোড হয়',
  'First time only: downloads {size} (needs internet)':
    'শুধু প্রথমবার: {size} ডাউনলোড হয় (ইন্টারনেট লাগে)',
  'Follow playback': 'চলার সঙ্গে সঙ্গে অনুসরণ করুন',
  'Following playback': 'চলার সঙ্গে সঙ্গে অনুসরণ করছে',
  Footer: 'ফুটার',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'উচ্চারণে ভিন্নতা বা মিশ্র ভাষার কথার জন্য উচ্চতর গুণমানের সেটিং চেষ্টা করুন। আস্থার স্কোর নির্ভুলতার শতাংশ নয়।',
  'For developers: words, times, confidence': 'ডেভেলপারদের জন্য: শব্দ, সময়, আস্থা',
  'For notes apps': 'নোট অ্যাপের জন্য',
  'For video players and editors': 'ভিডিও প্লেয়ার ও এডিটরের জন্য',
  'For YouTube and web video': 'YouTube ও ওয়েব ভিডিওর জন্য',
  Free: 'বিনামূল্যে',
  'Free tools': 'বিনামূল্যের টুল',
  'Free tools:': 'বিনামূল্যের টুল:',
  'Free video and audio to text': 'বিনামূল্যে ভিডিও ও অডিও থেকে টেক্সট',
  'Free video and audio to text, right in your browser':
    'আপনার ব্রাউজারেই বিনামূল্যে ভিডিও ও অডিও থেকে টেক্সট',
  'Free, unlimited, and no login needed': 'বিনামূল্যে, সীমাহীন, লগইন লাগে না',
  'Free, unlimited, no login': 'বিনামূল্যে, সীমাহীন, লগইন ছাড়াই',
  'Frequently asked questions': 'প্রায়শই জিজ্ঞাসিত প্রশ্ন',
  'Get in touch': 'যোগাযোগ করুন',
  'Getting the speech engine ready…': 'স্পিচ ইঞ্জিন প্রস্তুত করা হচ্ছে…',
  'Give it a new name': 'একটি নতুন নাম দিন',
  'Go to the home page': 'হোম পৃষ্ঠায় যান',
  'Go to Video to text': 'ভিডিও থেকে টেক্সটে যান',
  'Good balance (default)': 'ভালো ভারসাম্য (ডিফল্ট)',
  'Good to know': 'জেনে রাখা ভালো',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'Google-এর সম্মতি টুলটি লোড করা যায়নি, সম্ভবত কোনো অ্যাড ব্লকার বা নেটওয়ার্ক সেটি আটকে দিয়েছে। এটি ছাড়া কোনো বিজ্ঞাপন বা বিজ্ঞাপনের কুকি লোড হয় না।',
  Guides: 'গাইড',
  'Guides: transcripts and subtitles': 'গাইড: ট্রান্সক্রিপ্ট ও সাবটাইটেল',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'কোনো প্রশ্ন আছে, বাগ পেয়েছেন, বা কোনো বৈশিষ্ট্যের পরামর্শ দিতে চান? {email} ঠিকানায় লিখুন। প্রতিটি বার্তা পড়েন সেই মানুষটিই, যিনি {brand} তৈরি করেন, এবং সাধারণত কয়েক কর্মদিবসের মধ্যে উত্তর পাবেন।',
  'Helps spell uncommon words correctly.': 'অপ্রচলিত শব্দের সঠিক বানান লিখতে সাহায্য করে।',
  'High accuracy': 'উচ্চ নির্ভুলতা',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    'উচ্চ নির্ভুলতা (Large v3 Turbo) অনুবাদের জন্য প্রশিক্ষিত নয়, তাই এটি মূল ভাষাতেই ফল দিতে পারে। অনুবাদের জন্য স্ট্যান্ডার্ড বা সর্বোচ্চ নির্ভুলতা বেছে নিন।',
  'High accuracy, slower': 'উচ্চ নির্ভুলতা, ধীরগতির',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    'বেশি হলে একটু বেশি নির্ভুল হয় এবং ধীর হয়। 5 একটি ভালো ডিফল্ট।',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'ইংরেজি অক্ষরে হিন্দি, ইংরেজি শব্দগুলো যেমন আছে তেমনই থাকে। অন্য ভাষাগুলো তাদের মূল লিপিতেই থাকে। অপরিচিত শব্দ ও নাম যাচাই করে নিন।',
  'Hinglish (Roman Hindi)': 'হিংলিশ (রোমান হিন্দি)',
  'Hinglish conversion': 'হিংলিশে রূপান্তর',
  History: 'ইতিহাস',
  Home: 'হোম',
  'How {brand} works': '{brand} যেভাবে কাজ করে',
  'How accurate is it?': 'এটি কতটা নির্ভুল?',
  'How do I get better accuracy?': 'আরও ভালো নির্ভুলতা পাব কীভাবে?',
  'How it stays free': 'যেভাবে এটি বিনামূল্যে থাকে',
  'How it works': 'কীভাবে কাজ করে',
  'How long does it take?': 'কতক্ষণ সময় লাগে?',
  'How to transcribe a video to text': 'ভিডিও থেকে টেক্সটে ট্রান্সক্রাইব করার উপায়',
  'How to turn a video or audio file into text with {brand}':
    '{brand} দিয়ে ভিডিও বা অডিও ফাইলকে টেক্সটে রূপান্তর করার উপায়',
  'If it does have speech, try More › Re-transcribe with the right language.':
    'ফাইলে কথা থাকলে আরও › আবার ট্রান্সক্রাইব করুন বেছে নিয়ে সঠিক ভাষা দিয়ে চেষ্টা করুন।',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'সেবা ব্যস্ত থাকলে বা অনেকগুলো ট্রান্সক্রিপ্ট আগে থেকেই চলতে থাকলে, এটি আপনাকে অপেক্ষা করতে বলে এবং কারণও জানায়।',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'আমরা এই নীতি বদলালে নতুন সংস্করণটি এই পৃষ্ঠায় নতুন "সর্বশেষ হালনাগাদ" তারিখসহ প্রকাশিত হবে।',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'ইউরোপীয় অর্থনৈতিক অঞ্চল (EEA), যুক্তরাজ্য ও সুইজারল্যান্ডে এবং যুক্তরাষ্ট্রের কিছু অঙ্গরাজ্যে বিজ্ঞাপন লোড হওয়ার সময় Google-এর প্রত্যয়িত সম্মতি বার্তা আপনার পছন্দ জানতে চায়।',
  'IndicXlit (trained model)': 'IndicXlit (প্রশিক্ষিত মডেল)',
  'Is it really free and unlimited? Do I need to log in?':
    'এটি কি সত্যিই বিনামূল্যে ও সীমাহীন? আমাকে কি লগইন করতে হবে?',
  'Is my data private?': 'আমার ডেটা কি গোপন থাকে?',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    'এটি নির্ভর করে আপনার বেছে নেওয়া গুণমান, ফাইলের দৈর্ঘ্য এবং সেবাটি কতটা ব্যস্ত তার ওপর। সবচেয়ে দ্রুত তাড়াতাড়ি শেষ হয়; সর্বোচ্চ নির্ভুলতায় সবচেয়ে বেশি সময় লাগে, কিন্তু ভুল সবচেয়ে কম হয়। অগ্রগতি ও বাকি সময় সরাসরি দেখানো হয়, আর পালার অপেক্ষায় থাকা ফাইলে "সারিতে অপেক্ষা করছে" দেখায়।',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'এটি নির্ভর করে আপনার ডিভাইস, বেছে নেওয়া গুণমান ও ফাইলের দৈর্ঘ্যের ওপর। সক্ষম গ্রাফিক্স চিপ (WebGPU) থাকলে সবচেয়ে দ্রুত হয়; না থাকলে এটি প্রসেসরে (WebAssembly) চলে, যা ধীর। সবচেয়ে দ্রুত তাড়াতাড়ি শেষ হয়; সর্বোচ্চ নির্ভুলতায় সবচেয়ে বেশি সময় লাগে, কিন্তু ভুল সবচেয়ে কম হয়। অগ্রগতি ও বাকি সময় সরাসরি দেখানো হয়।',
  'It is now called “{title}”.': 'এর নাম এখন “{title}”।',
  'It may have been deleted.': 'এটি মুছে ফেলা হয়ে থাকতে পারে।',
  'It was stopped before any text was found.':
    'কোনো টেক্সট পাওয়ার আগেই এটি থামিয়ে দেওয়া হয়েছিল।',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'এর ডেটা মুছে ফেলা হয়েছে, এই ট্রান্সক্রিপ্টসহ। ট্রান্সক্রিপ্ট কেবল সেই সেশনের জন্যই রাখা হয় যেটি সেটি তৈরি করেছে।',
  'Job not found': 'কাজটি পাওয়া যায়নি',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'এইমাত্র',
  'Just the words, in paragraphs': 'শুধু কথাগুলো, অনুচ্ছেদে সাজানো',
  'Keep reading': 'আরও পড়ুন',
  'Keep this page open until the upload is done.':
    'আপলোড শেষ না হওয়া পর্যন্ত এই পৃষ্ঠাটি খোলা রাখুন।',
  'Kept only for this session, then deleted automatically.':
    'শুধু এই সেশনের জন্য রাখা হয়, তারপর নিজে থেকেই মুছে যায়।',
  Language: 'ভাষা',
  'Larger or longer files are refused before they are processed, so split them first.':
    'আরও বড় বা লম্বা ফাইল প্রক্রিয়া করার আগেই প্রত্যাখ্যান করা হয়, তাই আগে সেগুলো ভাগ করে নিন।',
  'Last updated: {date}': 'সর্বশেষ হালনাগাদ: {date}',
  'Licence text': 'লাইসেন্সের লেখা',
  Light: 'লাইট',
  'Limits.': 'সীমা।',
  'Line deleted': 'লাইনটি মুছে ফেলা হয়েছে',
  'Live: the text appears here as it is recognised':
    'সরাসরি: শনাক্ত হওয়ার সঙ্গে সঙ্গে টেক্সট এখানে দেখা যায়',
  'Loading model… (first use downloads it)': 'মডেল লোড হচ্ছে… (প্রথম ব্যবহারে এটি ডাউনলোড হয়)',
  'Loading…': 'লোড হচ্ছে…',
  'Long (56 letters)': 'লম্বা (56 অক্ষর)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'বিস্তারিত উত্তর: ফরম্যাট, সাবটাইটেল, নির্ভুলতা ও গোপনীয়তা।',
  Main: 'মূল',
  'Make a new transcript of the same file. This one is kept.':
    'একই ফাইলের একটি নতুন ট্রান্সক্রিপ্ট তৈরি করুন। এটি থেকে যায়।',
  'Make a subtitle file (SRT or VTT) from your video.':
    'আপনার ভিডিও থেকে একটি সাবটাইটেল ফাইল (SRT বা VTT) তৈরি করুন।',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'মেনু',
  Model: 'মডেল',
  More: 'আরও',
  'More answers: [Frequently asked questions](/faq)':
    'আরও উত্তর: [প্রায়শই জিজ্ঞাসিত প্রশ্ন](/faq)',
  'More free tools': 'আরও বিনামূল্যের টুল',
  'More options': 'আরও বিকল্প',
  'More than 50 languages': '50-এর বেশি ভাষা',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    '50-এর বেশি ভাষা, যার মধ্যে ইংরেজি, স্প্যানিশ, ফরাসি, জার্মান, পর্তুগিজ, ইতালীয়, ডাচ, রুশ, আরবি, হিন্দি, চীনা, জাপানি ও কোরিয়ান আছে। ভাষাটি স্বয়ংক্রিয় শনাক্তকরণে রেখে দিন বা নিজেই বেছে নিন। কথাকে ইংরেজিতেও অনুবাদ করতে পারেন।',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'বেশির ভাগ ট্রান্সক্রিপশন ওয়েবসাইট একটি লাইন টেক্সট দেখানোর আগেই অ্যাকাউন্ট খুলতে বলে, বিনামূল্যের মিনিট সীমিত করে, ওয়াটারমার্ক বসায় বা সাবস্ক্রিপশন গছিয়ে দেয়। {brand} করে ঠিক উল্টোটা। এর সবকিছু সবার জন্য উন্মুক্ত, আর পৃষ্ঠাটি আপনার ফাইল ছাড়া আর কিছুই চায় না।',
  'Name not changed': 'নাম বদলানো হয়নি',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    'অডিওতে থাকা নাম, ব্র্যান্ড ও পেশাগত শব্দ, যেমন Kubernetes, Dr. Okafor',
  'Near-best accuracy, much faster than Large':
    'প্রায় সর্বোচ্চ নির্ভুলতা, Large-এর চেয়ে অনেক দ্রুত',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'গ্রাফিক্স ড্রাইভারে 16-বিট শেডার সমর্থন (shader-f16) লাগে',
  'needs 4 GB': '4 GB লাগে',
  'needs 8 GB': '8 GB লাগে',
  'needs a graphics-capable browser (Chrome, Edge)': 'গ্রাফিক্স-সক্ষম ব্রাউজার লাগে (Chrome, Edge)',
  'needs WebGPU': 'WebGPU লাগে',
  'Next match': 'পরের মিল',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'কোনো অ্যাকাউন্ট নেই, কোনো ট্র্যাকিং নেই। আপনার ফাইল শুধু আপনার সেশনের জন্য রাখা হয় এবং নিজে থেকেই মুছে যায়।',
  'no estimate for this model here': 'এই মডেলের জন্য এখানে কোনো আনুমানিক হিসাব নেই',
  'No login': 'লগইন ছাড়াই',
  'No matches': 'কোনো মিল নেই',
  'No microphone': 'মাইক্রোফোন নেই',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'সাইন-আপ নেই, পেমেন্ট নেই, দৈনিক সীমা নেই। শুধু আপনার ফাইলটি যোগ করুন।',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'সার্ভার এই মুহূর্তে আকার বা দৈর্ঘ্যের কোনো সীমা জানায়নি। খুব বড় ফাইলে শুধু বেশি সময় লাগে।',
  'No speech was found in this file.': 'এই ফাইলে কোনো কথা পাওয়া যায়নি।',
  'No speech was transcribed.': 'কোনো কথা ট্রান্সক্রাইব হয়নি।',
  'No speech was transcribed. Check the recording and the selected language.':
    'কোনো কথা ট্রান্সক্রাইব হয়নি। রেকর্ডিং ও বেছে নেওয়া ভাষা পরীক্ষা করে দেখুন।',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'এখানে WebGPU নেই: মডেল একটি CPU থ্রেডে চলে, তাই বড় আকারগুলো রিয়েল-টাইমের চেয়ে ধীর।',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'আপনার ফাইলের আগে আর কারও ফাইল নেই। একাধিক ফাইল যোগ করলে সেগুলো আপনার ট্যাবে একটির পর একটি ট্রান্সক্রাইব হয়, তাই শেষ না হওয়া পর্যন্ত ট্যাবটি খোলা রাখুন।',
  'None of those are video or audio files.': 'ওগুলোর কোনোটিই ভিডিও বা অডিও ফাইল নয়।',
  Normal: 'স্বাভাবিক',
  'not available for this size': 'এই আকারের জন্য পাওয়া যায় না',
  'not available in this browser': 'এই ব্রাউজারে পাওয়া যায় না',
  'not available with Qwen (times are per chunk)': 'Qwen-এ পাওয়া যায় না (সময় অংশ অনুযায়ী)',
  'Not cancelled': 'বাতিল করা হয়নি',
  'Not deleted': 'মুছে ফেলা হয়নি',
  'Not renamed': 'নাম বদলানো হয়নি',
  'Not saved': 'সেভ করা হয়নি',
  Note: 'টীকা',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'এখানে এখনও কিছু নেই। আপনার তৈরি করা ট্রান্সক্রিপ্ট এই সেশনের জন্য এখানে দেখা যাবে।',
  'Nothing is saved. Export what you need.': 'কিছুই সংরক্ষিত থাকে না। যা দরকার এক্সপোর্ট করে নিন।',
  'Nothing is uploaded until you press Transcribe.':
    'ট্রান্সক্রাইব করুন চাপার আগে কিছুই আপলোড হয় না।',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'সাইন-আপের কিছু নেই, দেওয়ার মতো কোনো টাকাও নেই। শুধু আপনার ফাইলটি যোগ করুন।',
  'Nothing was recorded.': 'কিছুই রেকর্ড হয়নি।',
  Off: 'বন্ধ',
  On: 'চালু',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'স্পষ্ট কথায় ও সমর্থিত ভাষায় এটি সাধারণত খুবই নির্ভুল, কিন্তু কোনো বাক-শনাক্তকরণই নিখুঁত নয়। নির্ভুলতা নির্ভর করে অডিওর গুণমান, উচ্চারণভঙ্গি, পেছনের শব্দ, একসঙ্গে কথা বলা বক্তা, সংগীত এবং বিরল নাম বা পেশাগত শব্দের ওপর। প্রতিটি লাইনের একটি আস্থার স্কোর আছে, আর কম আস্থার লাইনগুলো চিহ্নিত থাকে, যাতে আপনি আগে সেগুলো দেখে নিতে পারেন। গুরুত্বপূর্ণ কিছুর জন্য ভরসা করার আগে সবসময় ট্রান্সক্রিপ্টটি যাচাই করে নিন।',
  'Open menu': 'মেনু খুলুন',
  'Opening your transcript…': 'আপনার ট্রান্সক্রিপ্ট খোলা হচ্ছে…',
  'or drop it anywhere on this page.': 'অথবা এই পৃষ্ঠার যেকোনো জায়গায় ড্রপ করুন।',
  'Original script': 'মূল লিপি',
  Output: 'আউটপুট',
  'Page {page} of {pages}': '{pages}-এর মধ্যে {page} নম্বর পৃষ্ঠা',
  'Page not found': 'পৃষ্ঠাটি পাওয়া যায়নি',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'আপনার হাতে থাকা ফাইলের জন্য পৃষ্ঠা: WAV, M4A, WebM ও MOV।',
  'PDF document (.pdf)': 'PDF নথি (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'PDF তৈরি করে আপনার ব্রাউজার: প্রিন্ট ডায়ালগে "PDF হিসেবে সংরক্ষণ করুন" বেছে নিন।',
  'Pick quality': 'গুণমান বেছে নিন',
  'Plain text (.txt)': 'সাধারণ টেক্সট (.txt)',
  'Play from here': 'এখান থেকে চালান',
  'Playback speed': 'চালানোর গতি',
  'Please add one file at a time here. You can add more files on the next page.':
    'এখানে একবারে একটি করে ফাইল যোগ করুন। পরের পৃষ্ঠায় আরও ফাইল যোগ করতে পারবেন।',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'অনুগ্রহ করে ব্যক্তিগত রেকর্ডিং পাঠাবেন না। {brand} আপনার ফাইল আপনার নিজের ডিভাইসেই ট্রান্সক্রাইব করে এবং আমরা সেগুলো কখনো পাই না, তাই আপনাকে সাহায্য করার জন্য সেগুলোর দরকার হয় না।',
  'Please note': 'অনুগ্রহ করে লক্ষ করুন',
  Preparing: 'প্রস্তুত করা হচ্ছে',
  'Preparing audio…': 'অডিও প্রস্তুত করা হচ্ছে…',
  'Preparing the audio…': 'অডিও প্রস্তুত করা হচ্ছে…',
  'Preparing…': 'প্রস্তুত করা হচ্ছে…',
  'Press a question to read its answer.': 'উত্তর পড়তে একটি প্রশ্নে চাপ দিন।',
  'Previous match': 'আগের মিল',
  'Print to PDF': 'PDF-এ প্রিন্ট করুন',
  Privacy: 'গোপনীয়তা',
  'Privacy and cookie settings': 'গোপনীয়তা ও কুকি সেটিং',
  'Privacy policy': 'গোপনীয়তা নীতি',
  'Privacy requests': 'গোপনীয়তা-বিষয়ক অনুরোধ',
  Private: 'ব্যক্তিগত',
  Progress: 'অগ্রগতি',
  Quality: 'গুণমান',
  'Questions about these terms:': 'এই শর্তাবলি নিয়ে প্রশ্ন:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'প্রশ্ন, বাগের খবর ও ধারণা সবসময় স্বাগত। {email} ঠিকানায় লিখুন, অথবা কী কী জানাবেন তা জানতে [যোগাযোগ](/contact) পৃষ্ঠাটি দেখুন।',
  Queued: 'সারিতে আছে',
  'Quick results. Good for clear speech.': 'দ্রুত ফল। স্পষ্ট কথার জন্য ভালো।',
  Quickest: 'সবচেয়ে দ্রুত',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'Qwen আনুমানিক অংশভিত্তিক টাইমস্ট্যাম্প ব্যবহার করে। শব্দের সময় ও আস্থা পাওয়া যায় না।',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'Qwen অংশভিত্তিক টাইমস্ট্যাম্প ব্যবহার করে এবং শব্দের আস্থা দেয় না। এটি বেছে নেওয়ার আগে একটি ছোট নমুনায় তুলনা করে দেখুন।',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (পরীক্ষামূলক)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASR-এর জন্য WebGPU (Chrome বা Edge) এবং গ্রাফিক্স ড্রাইভারে 16-বিট শেডার সমর্থন (shader-f16) সহ একটি ডেস্কটপ ব্রাউজার লাগে।',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASR-এর জন্য WebGPU (Chrome বা Edge) এবং 8 GB মেমরিসহ একটি ডেস্কটপ ব্রাউজার লাগে।',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASR-এর জন্য WebGPU (Chrome বা Edge) সহ একটি ডেস্কটপ ব্রাউজার লাগে।',
  'Re-transcribe': 'আবার ট্রান্সক্রাইব করুন',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'টাইমস্ট্যাম্পসহ ট্রান্সক্রিপ্ট পড়ুন, দেখুন মডেল কোন শব্দগুলোতে অনিশ্চিত ছিল, আর সেগুলো সেখানেই ঠিক করে নিন।',
  'Read, edit, download': 'পড়ুন, সম্পাদনা করুন, ডাউনলোড করুন',
  Ready: 'প্রস্তুত',
  'Ready to print or share': 'প্রিন্ট বা শেয়ার করার জন্য প্রস্তুত',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    'চেষ্টা করতে প্রস্তুত? [সব বিনামূল্যের টুল দেখুন](/tools) বা [এখনই একটি ফাইল ট্রান্সক্রাইব করুন](/)।',
  'Recognition engine': 'শনাক্তকরণ ইঞ্জিন',
  Recommended: 'প্রস্তাবিত',
  'Record from microphone': 'মাইক্রোফোন থেকে রেকর্ড করুন',
  'Record straight from your microphone and turn it into text.':
    'সরাসরি আপনার মাইক্রোফোন থেকে রেকর্ড করুন এবং সেটিকে টেক্সটে রূপান্তর করুন।',
  'Record with your microphone': 'মাইক্রোফোনে রেকর্ড করুন',
  'Recording {stamp}': 'রেকর্ডিং {stamp}',
  'Recording is not supported by this browser.': 'এই ব্রাউজারে রেকর্ডিং সমর্থিত নয়।',
  'Related reading': 'সংশ্লিষ্ট লেখা',
  Remove: 'সরান',
  'Remove {name}': '{name} সরান',
  'Removes it for good': 'এটি চিরতরে সরিয়ে দেয়',
  Rename: 'নাম বদলান',
  Renamed: 'নাম বদলানো হয়েছে',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    '{n}টি লাইনে "{query}"-এর জায়গায় "{replacement}" বসাবেন?',
  'Replace "{query}" with "{replacement}" in 1 line?':
    '1টি লাইনে "{query}"-এর জায়গায় "{replacement}" বসাবেন?',
  'Replace in {n} lines': '{n}টি লাইনে প্রতিস্থাপন করুন',
  'Replace in 1 line': '1টি লাইনে প্রতিস্থাপন করুন',
  'Replace with': 'এটি দিয়ে প্রতিস্থাপন করুন',
  'Replace with…': 'প্রতিস্থাপনের লেখা…',
  'Replace…': 'প্রতিস্থাপন করুন…',
  Replaced: 'প্রতিস্থাপন করা হয়েছে',
  'Reporting a problem': 'সমস্যা জানানো',
  'Retrying…': 'আবার চেষ্টা করা হচ্ছে…',
  'Review language and quality': 'ভাষা ও গুণমান যাচাই করুন',
  'Review this transcript': 'এই ট্রান্সক্রিপ্টটি যাচাই করুন',
  Save: 'সেভ করুন',
  Saved: 'সেভ হয়েছে',
  'Saving…': 'সেভ করা হচ্ছে…',
  'Search depth: {n}': 'অনুসন্ধানের গভীরতা: {n}',
  'Search the text': 'লেখায় খুঁজুন',
  'Search the transcript': 'ট্রান্সক্রিপ্টে খুঁজুন',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'আরও দেখুন: [ব্যবহারের শর্তাবলি](/terms), [কীভাবে কাজ করে](/how-it-works) ও [সচরাচর প্রশ্ন](/faq)।',
  'Server busy': 'সার্ভার ব্যস্ত',
  'Session only — nothing is saved.': 'শুধু এই সেশনের জন্য — কিছুই সংরক্ষিত থাকে না।',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'শুধু এই সেশনের জন্য — কিছুই সংরক্ষিত থাকে না। অ্যাপ বন্ধ করলে সব ট্রান্সক্রিপ্ট মুছে যায়। যা দরকার এক্সপোর্ট করে নিন।',
  'Session time left: about {n} min': 'সেশনের বাকি সময়: প্রায় {n} মিনিট',
  'Short (32 letters)': 'ছোট (32 অক্ষর)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'ছোট ও ব্যবহারিক উত্তর, কথাকে টেক্সট ও সাবটাইটেলে রূপান্তর নিয়ে: কোন সাবটাইটেল ফরম্যাট বেছে নেবেন, ভিডিওতে সাবটাইটেল কীভাবে যোগ করবেন, কীভাবে আরও নির্ভুল ট্রান্সক্রিপ্ট পাবেন, এবং ফাইল আপলোড না করেই ট্রান্সক্রিপশন কীভাবে আপনার নিজের ব্রাউজারে চলতে পারে।',
  'Show all {count} languages': 'সব {count}টি ভাষা দেখান',
  'Six ways to download': 'ডাউনলোডের ছয়টি উপায়',
  'Skip to main content': 'মূল বিষয়বস্তুতে যান',
  Slower: 'ধীরগতির',
  'slower than real time on the measured laptop':
    'যে ল্যাপটপে মাপা হয়েছে সেখানে রিয়েল-টাইমের চেয়ে ধীর',
  Slowest: 'সবচেয়ে ধীর',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'কিছু বৈশিষ্ট্য ব্যবহারের সময় আপনার ব্রাউজারে ওপেন-সোর্স উপাদান ডাউনলোড করে। এগুলো ইঞ্জিনের বাকি অংশের মতোই আপনার ডিভাইসে চলে। এগুলোর লাইসেন্স অনুযায়ী আমাদের এই বিজ্ঞপ্তিগুলো দেখাতে হয়:',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    'পুনরাবৃত্ত লেখা বা অনিশ্চিত কথার সীমানার কারণে কিছু অংশ শুনে যাচাই করা দরকার।',
  'Something went wrong': 'কিছু একটা ভুল হয়েছে',
  'Something went wrong in this browser. Please try again.':
    'এই ব্রাউজারে কিছু একটা ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
  'Something went wrong while reading this file.': 'এই ফাইলটি পড়ার সময় কিছু একটা ভুল হয়েছে।',
  'Source code': 'সোর্স কোড',
  Speed: 'গতি',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'ফোন ও ট্যাবলেটের গতি আনুমানিক, মাপা নয়; tiny ও base আকারই নিরাপদ।',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'সাবটাইটেলের জন্য SRT ও VTT, পড়ার জন্য TXT ও Markdown, প্রোগ্রামের জন্য JSON, অথবা প্রিন্ট করার জন্য PDF।',
  Standard: 'স্ট্যান্ডার্ড',
  'Standard (42 letters)': 'স্ট্যান্ডার্ড (42 অক্ষর)',
  Start: 'শুরু করুন',
  'Start a new transcription': 'নতুন ট্রান্সক্রিপশন শুরু করুন',
  'Start again': 'আবার শুরু করুন',
  'Started again': 'আবার শুরু হয়েছে',
  'Starting…': 'শুরু হচ্ছে…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'এখনও প্রশ্ন আছে? [প্রায়শই জিজ্ঞাসিত প্রশ্ন](/faq) পড়ুন, [কীভাবে কাজ করে](/how-it-works) দেখুন, অথবা [আমাদের সঙ্গে যোগাযোগ করুন](/contact)।',
  'Still stuck? [Read How it works](/how-it-works)':
    'এখনও আটকে আছেন? [কীভাবে কাজ করে পড়ুন](/how-it-works)',
  'Stop recording · {time}': 'রেকর্ডিং বন্ধ করুন · {time}',
  'Stop this transcription? The text found so far is kept.':
    'এই ট্রান্সক্রিপশন থামাবেন? এ পর্যন্ত পাওয়া টেক্সট থেকে যাবে।',
  'Stopping the transcription worker. The text found so far is kept.':
    'ট্রান্সক্রিপশন ওয়ার্কার থামানো হচ্ছে। এ পর্যন্ত পাওয়া টেক্সট থেকে যাবে।',
  'Stored on this device only, never uploaded.': 'শুধু এই ডিভাইসেই রাখা হয়, কখনো আপলোড হয় না।',
  'Style unchanged': 'ধরন বদলানো হয়নি',
  'Style updated': 'ধরন হালনাগাদ হয়েছে',
  'Style updated using the saved recognition. Edited lines are kept.':
    'সংরক্ষিত শনাক্তকরণ ব্যবহার করে ধরন হালনাগাদ করা হয়েছে। সম্পাদনা করা লাইনগুলো থেকে গেছে।',
  'Subtitle files': 'সাবটাইটেল ফাইল',
  'Subtitle line length': 'সাবটাইটেল লাইনের দৈর্ঘ্য',
  'Subtitles (.srt)': 'সাবটাইটেল (.srt)',
  'Switch to dark theme': 'ডার্ক থিমে যান',
  'Switch to light theme': 'লাইট থিমে যান',
  Terms: 'শর্তাবলি',
  'Terms of use': 'ব্যবহারের শর্তাবলি',
  'Text with times (.txt)': 'সময়সহ টেক্সট (.txt)',
  'That file is already in the list.': 'ওই ফাইলটি আগে থেকেই তালিকায় আছে।',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'ওটি ভিডিও বা অডিও ফাইল নয়। MP4, MOV, MP3 বা অন্য কোনো ভিডিও বা অডিও ফাইল বেছে নিন।',
  'That is not a video or audio file. Please choose a video or audio file.':
    'ওটি ভিডিও বা অডিও ফাইল নয়। অনুগ্রহ করে একটি ভিডিও বা অডিও ফাইল বেছে নিন।',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'ওটি অডিও ফাইল নয়। MP3, WAV, M4A বা অন্য কোনো অডিও ফাইল বেছে নিন।',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    '[গোপনীয়তা নীতি](/privacy) ব্যাখ্যা করে কী প্রক্রিয়া করা হয় এবং কেন। আপনার ডেটা নিয়ে প্রশ্ন করতে বা আপনার অধিকার প্রয়োগ করতে একই ঠিকানায় লিখুন।',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    '{label} মডেলটি এই ডিভাইসে চলতে পারে না: {reason}। অন্য একটি বেছে নিন।',
  'the exact error message, or a screenshot of it.':
    'ত্রুটির বার্তাটি হুবহু, অথবা তার একটি স্ক্রিনশট।',
  'The file is larger than the server accepts.': 'ফাইলটি সার্ভারের গ্রহণযোগ্য আকারের চেয়ে বড়।',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'কোনো গুণমান স্তর প্রথমবার ব্যবহার করলে আপনার ব্রাউজার তার স্পিচ মডেল একবার ডাউনলোড করে পরের বারের জন্য রেখে দেয়, তাই পরের ফাইলগুলো আগে শুরু হয়।',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'কোনো গুণমান স্তর প্রথমবার ব্যবহার করলে আপনার ব্রাউজার স্পিচ মডেল Hugging Face থেকে এবং ইঞ্জিনের প্রোগ্রাম ফাইল jsDelivr থেকে ডাউনলোড করে পরের বারের জন্য রেখে দেয়; সেগুলোর সঙ্গে আপনার ফাইলের কিছুই পাঠানো হয় না। ট্রান্সক্রিপশন শেষ হলে আপনার ব্রাউজার পৃষ্ঠার হেডারের নামহীন কাউন্টারে একটি যোগ করে, আর কিছুই নয়।',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'গ্রাফিক্স ড্রাইভারে 16-বিট শেডার নেই: ডাউনলোড বড় হয় এবং মেমরির ব্যবহার বেশি হয়।',
  'The line was removed.': 'লাইনটি সরিয়ে দেওয়া হয়েছে।',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'মূল টুল: যেকোনো ভিডিও বা অডিও ফাইলকে টাইমস্ট্যাম্পযুক্ত ট্রান্সক্রিপ্টে রূপান্তর করুন।',
  'The page you are looking for does not exist or has moved.':
    'আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি নেই বা অন্য জায়গায় সরে গেছে।',
  'The recording failed. Please try again.':
    'রেকর্ডিং ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
  'The server does not have enough free disk space for this file.':
    'এই ফাইলের জন্য সার্ভারে যথেষ্ট খালি ডিস্ক জায়গা নেই।',
  'The server is busy': 'সার্ভার ব্যস্ত আছে',
  'The server is busy right now.': 'সার্ভার এখন ব্যস্ত আছে।',
  'The service is busy right now. Please wait a moment and try again.':
    'সেবাটি এখন ব্যস্ত। অনুগ্রহ করে একটু অপেক্ষা করে আবার চেষ্টা করুন।',
  'The service is full right now. Please try again in a little while.':
    'সেবাটি এখন পূর্ণ। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    'বাক-শনাক্তকরণ আপনার নিজের ব্রাউজারের ভেতরেই চলে, OpenAI Whisper-এর মতো উন্মুক্ত স্পিচ রিকগনিশন মডেল ব্যবহার করে। আপনার ব্রাউজার মডেলটি একবার ডাউনলোড করে রেখে দেয়, তারপর সব কাজ আপনার ডিভাইসেই করে। আপনার ভিডিও বা অডিও কখনো আমাদের কাছে আপলোড হয় না, আর সেই কারণেই ফাইলের আকারের কোনো সীমা নেই এবং অন্য কারও ফাইলের সারিও নেই। [কীভাবে কাজ করে](/how-it-works) পৃষ্ঠায় প্রতিটি ধাপ ব্যাখ্যা করা আছে।',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'কথ্য ভাষাটি আস্থার সঙ্গে শনাক্ত করা যায়নি। আপনি যে ভাষা শুনছেন সেটি বেছে নিয়ে আবার চেষ্টা করুন।',
  'The text found before it was stopped is shown below.':
    'থামানোর আগে যে টেক্সট পাওয়া গেছে তা নিচে দেখানো হয়েছে।',
  'The text found so far is kept.': 'এ পর্যন্ত পাওয়া টেক্সট থেকে যাবে।',
  'The text is ready to paste.': 'টেক্সটটি পেস্ট করার জন্য প্রস্তুত।',
  'The transcript finished before it could be cancelled.':
    'ট্রান্সক্রিপ্ট বাতিল করার আগেই শেষ হয়ে গেছে।',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'ট্রান্সক্রিপশন চলে আপনার নিজের ডিভাইসে, OpenAI Whisper-এর মতো উন্মুক্ত স্পিচ রিকগনিশন মডেল দিয়ে। আপনার ব্রাউজার একটি মডেল একবার ডাউনলোড করে রেখে দেয়, তাই পরের ফাইল আরও তাড়াতাড়ি শুরু হয়, আর আপনার ভিডিও বা অডিও কোথাও আপলোড হয় না।',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'ফাইলের ধরন ও দৈর্ঘ্য, যেমন "MP4, 25 মিনিট";',
  'There is no size or length limit set here.': 'এখানে আকার বা দৈর্ঘ্যের কোনো সীমা ঠিক করা নেই।',
  'These details make a problem much quicker to find and fix:':
    'এই তথ্যগুলো থাকলে সমস্যা অনেক তাড়াতাড়ি খুঁজে বের করে ঠিক করা যায়:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    'এই শর্তাবলি ভারতের আইন দ্বারা পরিচালিত। এ থেকে উদ্ভূত যেকোনো বিরোধে বেঙ্গালুরু, কর্ণাটক, ভারতের আদালতের একচেটিয়া এখতিয়ার থাকবে। আপনি যে দেশে থাকেন সেখানকার বাধ্যতামূলক ভোক্তা আইনের অধীনে আপনার যে সুরক্ষা আছে, এটি তা কেড়ে নেয় না।',
  'They are downloaded again the next time you transcribe.':
    'পরের বার ট্রান্সক্রাইব করার সময় এগুলো আবার ডাউনলোড হবে।',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'Google সহ তৃতীয় পক্ষের বিক্রেতারা এই ওয়েবসাইটে বা অন্য ওয়েবসাইটে আপনার আগের ভিজিটের ভিত্তিতে বিজ্ঞাপন দেখাতে কুকি ব্যবহার করে। Google-এর বিজ্ঞাপন কুকি ব্যবহার করার ফলে Google ও তার অংশীদাররা এই সাইটে এবং/অথবা ইন্টারনেটের অন্য সাইটে আপনার ভিজিটের ভিত্তিতে আপনাকে বিজ্ঞাপন দেখাতে পারে।',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'এই বক্সে MP3, WAV বা M4A-এর মতো অডিও ফাইল নেওয়া হয়, কিন্তু ওটি একটি ভিডিও।',
  'This browser cannot record. Please choose a file instead.':
    'এই ব্রাউজার রেকর্ড করতে পারে না। অনুগ্রহ করে এর বদলে একটি ফাইল বেছে নিন।',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'এই ব্রাউজার মেমরির তথ্য জানায় না; {gb} GB ধরে নেওয়া হয়েছে। পৃষ্ঠাটি ধীর হয়ে গেলে ছোট একটি মডেল বেছে নিন।',
  'This cannot be undone. Export anything you want to keep first.':
    'এটি ফিরিয়ে আনা যাবে না। যা রাখতে চান আগে তা এক্সপোর্ট করে নিন।',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '{brand}-এর এই কপিটি আপনার নিজের কম্পিউটারেই চলে। আপনার ফাইল এই মেশিনেই প্রক্রিয়া হয় এবং কিছুই এখান থেকে বাইরে যায় না। কিছুই স্থায়ীভাবে সংরক্ষিত হয় না: ট্রান্সক্রিপ্ট কেবল এই সেশনের জন্যই থাকে, তাই যা দরকার এক্সপোর্ট করে নিন। হোস্ট করা ওয়েবসাইটের বিবরণ আছে [গোপনীয়তা নীতি](/privacy) পৃষ্ঠায়।',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'এই কপিটি আপনার নিজের কম্পিউটারেই চলে। আপনার ফাইল এই মেশিনেই প্রক্রিয়া হয় এবং কিছুই এখান থেকে বাইরে যায় না।',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'এত লম্বা ফাইলের জন্য এই ডিভাইসে মেমরি কম। এটি ছোট ছোট টুকরোয় প্রক্রিয়া হয়, যা ধীর; ছোট করে কাটা ফাইল বা ছোট মডেল বেশি নিরাপদ।',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'এই ফাইলের জন্য 9 MB-এর একটি কনভার্টার লাগে, যা আপনার ব্রাউজারে চলে। এটি লোড করবেন?',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'এটি সুবিধার জন্য করা একটি অনুবাদ। ইংরেজি সংস্করণের সঙ্গে এর কোনো পার্থক্য থাকলে ইংরেজি সংস্করণই প্রযোজ্য হবে।',
  'This local copy does not count transcriptions': 'এই স্থানীয় কপি ট্রান্সক্রিপশন গণনা করে না',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'এই ট্রান্সক্রিপ্টে মডেলের আস্থা কম। টেক্সটটি ব্যবহার করার আগে রেকর্ডিংটি শুনুন এবং কথ্য ভাষাটি যাচাই করুন।',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'এই ডিভাইসে এতে {wait} লাগবে (আনুমানিক)। শেষ না হওয়া পর্যন্ত ট্যাবটি খোলা রাখুন।',
  Timestamps: 'টাইমস্ট্যাম্প',
  'Tips for the best results': 'সেরা ফলের জন্য কিছু পরামর্শ',
  'Tips for the best transcript': 'সেরা ট্রান্সক্রিপ্টের জন্য কিছু পরামর্শ',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'আপনার বিজ্ঞাপনের পছন্দ বদলাতে [Google বিজ্ঞাপন সেটিং](https://adssettings.google.com) বা আপনার ব্রাউজারের কুকি সেটিং ব্যবহার করুন।',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'আপনার বিজ্ঞাপনের পছন্দ বদলাতে বিজ্ঞাপন দেখানো কোনো পৃষ্ঠার নিচে **গোপনীয়তা ও কুকি সেটিং** ব্যবহার করুন, অথবা [Google বিজ্ঞাপন সেটিং](https://adssettings.google.com) বা আপনার ব্রাউজারের কুকি সেটিং।',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'আপনার চাওয়া ট্রান্সক্রিপশন আপনার নিজের ডিভাইসে দিতে, ওয়েবসাইটটি নিরাপদে পৌঁছে দিতে এবং বিজ্ঞাপনের মাধ্যমে সেবাটি বিনামূল্যে রাখতে। যেখানে GDPR-এর মতো ডেটা সুরক্ষা আইন প্রযোজ্য, সেখানে আমাদের আইনি ভিত্তি হলো আপনার অনুরোধ করা সেবা প্রদান (ধারা 6(1)(b)), নিরাপত্তা, অপব্যবহার রোধ ও নামহীন চলতি মোট সংখ্যায় আমাদের বৈধ স্বার্থ (ধারা 6(1)(f)), এবং আইন যেখানে চায় সেখানে বিজ্ঞাপন কুকির জন্য আপনার সম্মতি (ধারা 6(1)(a)), যা Google-এর সম্মতি বার্তা জানতে চায়।',
  'To keep it fast for everyone, each file has a size and length limit.':
    'সবার জন্য এটি দ্রুত রাখতে প্রতিটি ফাইলের আকার ও দৈর্ঘ্যের একটি সীমা আছে।',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    'আইন যতদূর অনুমতি দেয়, পরোক্ষ বা পরিণামগত ক্ষতি, ডেটা, মুনাফা বা ব্যবসার ক্ষতি, অথবা সেবাটি ব্যবহার করা বা ব্যবহার করতে না পারা থেকে কিংবা ট্রান্সক্রিপ্টের ভুল থেকে উদ্ভূত কোনো ক্ষতির জন্য আমরা দায়ী নই। আইনত যে দায় সীমিত করা যায় না, এই শর্তাবলির কোনো কিছুই তা সীমিত করে না।',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'আপনার ডিভাইসে ট্রান্সক্রাইব করতে আপনার ব্রাউজার স্পিচ মডেলের ফাইলগুলো Hugging Face (huggingface.co) থেকে এবং স্পিচ ইঞ্জিনের প্রোগ্রাম ফাইলগুলো jsDelivr (cdn.jsdelivr.net) থেকে ডাউনলোড করে এবং আপনি মুছে না ফেলা পর্যন্ত পরের বারের জন্য নিজের ক্যাশে (Cache Storage) রেখে দেয়। ওই সেবাদাতারা স্বাভাবিক অনুরোধের তথ্য পায় (আপনার IP ঠিকানা, আপনার ব্রাউজার ও কোন ফাইল চাওয়া হয়েছে), কিন্তু আপনার মিডিয়া বা ট্রান্সক্রিপ্ট কখনোই নয়।',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'আপনার ডিভাইসে কাজ করতে আপনার ব্রাউজার Hugging Face থেকে স্পিচ মডেল এবং jsDelivr থেকে প্রোগ্রাম ফাইল ডাউনলোড করে; সেগুলো তাদের নিজস্ব লাইসেন্স ও শর্তে সরবরাহ করা হয়। বিজ্ঞাপন সরবরাহ করে Google AdSense; কোনো বিজ্ঞাপন এমন একটি তৃতীয় পক্ষের ওয়েবসাইটে নিয়ে যায় যা আমাদের নিয়ন্ত্রণে নেই এবং যার জন্য আমরা দায়ী নই।',
  Transcribe: 'ট্রান্সক্রাইব করুন',
  'Transcribe (same language)': 'ট্রান্সক্রাইব (একই ভাষায়)',
  'Transcribe {n} files': '{n}টি ফাইল ট্রান্সক্রাইব করুন',
  'Transcribe a file': 'একটি ফাইল ট্রান্সক্রাইব করুন',
  'Transcribe or translate speech in the language you need.':
    'আপনার প্রয়োজনীয় ভাষায় কথা ট্রান্সক্রাইব বা অনুবাদ করুন।',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    '50-এর বেশি ভাষায় ভিডিও, অডিও ফাইল ও ভয়েস রেকর্ডিং ট্রান্সক্রাইব করুন, অথবা ভাষাটি আপনার হয়ে শনাক্ত করতে দিন।',
  'Transcribing {n}%': 'ট্রান্সক্রাইব হচ্ছে {n}%',
  'Transcribing takes {time} on this device.': 'এই ডিভাইসে ট্রান্সক্রাইব করতে {time} লাগে।',
  'Transcribing…': 'ট্রান্সক্রাইব করা হচ্ছে…',
  '{blurb} Not sure? Keep this one.': '{blurb} নিশ্চিত নন? এটিই রাখুন।',
  '{reason} Retrying in {n} s…': '{reason} {n} সেকেন্ড পরে আবার চেষ্টা করা হচ্ছে…',
  'Alternatives': 'বিকল্প',
  'Checking the downloaded file…': 'ডাউনলোড করা ফাইল যাচাই করা হচ্ছে…',
  'Connection lost.': 'সংযোগ বিচ্ছিন্ন হয়ে গেছে।',
  'Continued after the page reloaded.': 'পৃষ্ঠা রিলোড হওয়ার পর চালিয়ে যাওয়া হয়েছে।',
  'Continuing the download ({size} already saved)': 'ডাউনলোড চালিয়ে যাওয়া হচ্ছে ({size} আগেই সংরক্ষিত)',
  'Downloaded: ready to start': 'ডাউনলোড হয়ে গেছে: শুরু করতে প্রস্তুত',
  'Every language in its own script: English in English letters, Hindi in Devanagari. Choose Hinglish to write Hindi in English letters.': 'প্রতিটি ভাষা তার নিজস্ব লিপিতে: ইংরেজি ইংরেজি অক্ষরে, হিন্দি দেবনাগরীতে। হিন্দি ইংরেজি অক্ষরে লিখতে হিংলিশ বেছে নিন।',
  'First time only: downloads {size}, now downloading in the background': 'শুধু প্রথমবার: {size} ডাউনলোড হয়, এখন ব্যাকগ্রাউন্ডে ডাউনলোড হচ্ছে',
  'Getting the model ready: {loaded} of {total}': 'মডেল প্রস্তুত করা হচ্ছে: {total}-এর মধ্যে {loaded}',
  'Good for most videos.': 'বেশির ভাগ ভিডিওর জন্য ভালো।',
  'Honest, dated comparisons with other transcription services.': 'অন্যান্য ট্রান্সক্রিপশন সেবার সঙ্গে সৎ ও তারিখ দেওয়া তুলনা।',
  'Keep this page open until it is finished. If it reloads or closes, it continues where it stopped when you open the site again.': 'শেষ না হওয়া পর্যন্ত এই পৃষ্ঠাটি খোলা রাখুন। এটি রিলোড হলে বা বন্ধ হয়ে গেলে, আপনি সাইটটি আবার খুললে যেখানে থেমেছিল সেখান থেকেই চলতে থাকবে।',
  'Length {time}': 'দৈর্ঘ্য {time}',
  'Opens in Word and Google Docs': 'Word ও Google Docs-এ খোলে',
  'Reconnecting…': 'আবার সংযুক্ত হচ্ছে…',
  'The download server is busy (HTTP {status}).': 'ডাউনলোড সার্ভার ব্যস্ত আছে (HTTP {status})।',
  'The download stalled.': 'ডাউনলোড আটকে গেছে।',
  'Time so far {time}': 'এ পর্যন্ত সময় {time}',
  'Translated to English': 'ইংরেজিতে অনুবাদ করা হয়েছে',
  'Waiting for the internet connection…': 'ইন্টারনেট সংযোগের অপেক্ষায়…',
  'Word document (.docx)': 'Word নথি (.docx)',
  'Transcribed in {time}': 'ট্রান্সক্রাইব হতে সময় লেগেছে {time}',
  Transcript: 'ট্রান্সক্রিপ্ট',
  'Transcript name': 'ট্রান্সক্রিপ্টের নাম',
  'Transcript not found': 'ট্রান্সক্রিপ্ট পাওয়া যায়নি',
  'Transcript ready': 'ট্রান্সক্রিপ্ট প্রস্তুত',
  'Transcript style': 'ট্রান্সক্রিপ্টের ধরন',
  'Transcription failed': 'ট্রান্সক্রিপশন ব্যর্থ হয়েছে',
  'Transcription has started. The text appears below as it is recognised.':
    'ট্রান্সক্রিপশন শুরু হয়েছে। শনাক্ত হওয়ার সঙ্গে সঙ্গে টেক্সট নিচে দেখা যাবে।',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'ট্রান্সক্রিপশন শুরু হয়েছে। আপনার অন্য ফাইলগুলো পৃষ্ঠার ওপরের ট্রান্সক্রিপ্ট অংশে আছে।',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    'ট্রান্সক্রিপশন আপনার ডিভাইসে চলে এবং এর প্রসেসর, গ্রাফিক্স চিপ, মেমরি ও ব্যাটারি ব্যবহার করে। আমরা ফাইলের আকার বা দৈর্ঘ্যের কোনো সীমা রাখিনি, তবে এটি কত দ্রুত চলে এবং আপনার ব্রাউজার কত বড় ফাইল সামলাতে পারে তা নির্ভর করে আপনার ডিভাইসের ওপর: ধীর ফোন বা কম্পিউটারে লম্বা ফাইলে অনেক সময় লাগতে পারে বা মেমরি ফুরিয়ে যেতে পারে। আপনার ট্রান্সক্রিপ্ট ও ফাইল এই ব্রাউজারে রাখা হয় এবং {idle} নিষ্ক্রিয় থাকার পর নিজে থেকেই মুছে যায়। দেখুন [গোপনীয়তা নীতি](/privacy)।',
  'Transcription settings': 'ট্রান্সক্রিপশনের সেটিং',
  Transcripts: 'ট্রান্সক্রিপ্ট',
  'Transcripts {n}': 'ট্রান্সক্রিপ্ট {n}',
  'Transcripts are only kept for the browser session that created them.':
    'ট্রান্সক্রিপ্ট কেবল সেই ব্রাউজার সেশনের জন্যই রাখা হয় যেটি সেটি তৈরি করেছে।',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    'ট্রান্সক্রিপ্ট স্বয়ংক্রিয়ভাবে তৈরি হয় এবং এতে ভুল থাকবে, বিশেষ করে গোলমেলে অডিও, জোরালো উচ্চারণভঙ্গি, একসঙ্গে কথা বলা বক্তা, সংগীত এবং নাম বা প্রযুক্তিগত শব্দে। বিশেষত আইনি, চিকিৎসা, আর্থিক বা প্রকাশিত ব্যবহারের ক্ষেত্রে ভরসা করার আগে সবসময় ট্রান্সক্রিপ্ট যাচাই করে নিন। সেবাটি "যেমন আছে" ও "যেমন পাওয়া যায়" ভিত্তিতে দেওয়া হয়, নির্ভুলতা, সম্পূর্ণতা বা কোনো নির্দিষ্ট উদ্দেশ্যের উপযোগিতা সহ কোনো প্রকাশ্য বা অন্তর্নিহিত ওয়ারেন্টি ছাড়াই।',
  'Translate to English': 'ইংরেজিতে অনুবাদ করুন',
  'Try again': 'আবার চেষ্টা করুন',
  'Try another quality or language': 'অন্য গুণমান বা ভাষায় চেষ্টা করুন',
  'try to spread malware or anything meant to damage the service.':
    'ম্যালওয়্যার ছড়ানোর বা সেবাটির ক্ষতি করার উদ্দেশ্যে তৈরি কিছু ছড়ানোর চেষ্টা করবেন না।',
  'Trying again in a moment…': 'একটু পরে আবার চেষ্টা করা হবে…',
  'Trying again. This page loads by itself as soon as the server is back.':
    'আবার চেষ্টা করা হচ্ছে। সার্ভার ফিরে এলেই এই পৃষ্ঠাটি নিজে থেকে লোড হবে।',
  'under a minute': 'এক মিনিটেরও কম',
  'Underline unsure words': 'অনিশ্চিত শব্দের নিচে দাগ দিন',
  Unlimited: 'সীমাহীন',
  'Unsure: worth listening to again': 'অনিশ্চিত: আবার শুনে দেখা ভালো',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'অস্বাভাবিকভাবে বেশি আপলোড একসঙ্গে এলে একটু অপেক্ষা করতে বলা হতে পারে।',
  'Up to {minutes} per file.': 'প্রতিটি ফাইলে সর্বোচ্চ {minutes}।',
  'Up to {size} and {minutes} minutes per file.':
    'প্রতিটি ফাইলে সর্বোচ্চ {size} ও {minutes} মিনিট।',
  'Up to {size} and {minutes} per file.': 'প্রতিটি ফাইলে সর্বোচ্চ {size} ও {minutes}।',
  'Up to {size} per file.': 'প্রতিটি ফাইলে সর্বোচ্চ {size}।',
  'Updated {date}': 'হালনাগাদ {date}',
  'Upload complete': 'আপলোড সম্পন্ন',
  'Upload failed': 'আপলোড ব্যর্থ হয়েছে',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'আপলোড ব্যর্থ হয়েছে (সার্ভারের ত্রুটি {status})। বিস্তারিত জানতে সার্ভার চালানো টার্মিনালটি দেখুন।',
  'Upload failed (server error {status}). Please try again in a moment.':
    'আপলোড ব্যর্থ হয়েছে (সার্ভারের ত্রুটি {status})। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।',
  Uploading: 'আপলোড হচ্ছে',
  'Uploading…': 'আপলোড হচ্ছে…',
  'use a computer for this size': 'এই আকারের জন্য কম্পিউটার ব্যবহার করুন',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'আমাদের লিখিত অনুমতি ছাড়া এই ওয়েবসাইট বা এর কাউন্টারের বিরুদ্ধে স্ক্রিপ্ট, বট বা অন্য স্বয়ংক্রিয় উপায় ব্যবহার করবেন না, বা বানানো সংখ্যা পাঠাবেন না;',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'বেআইনি বা অন্য কারও অধিকার লঙ্ঘন করে এমন কনটেন্টে সেবাটি ব্যবহার করবেন না;',
  'use the service to harass, harm or deceive others;':
    'অন্যকে হয়রানি, ক্ষতি বা প্রতারণা করতে সেবাটি ব্যবহার করবেন না;',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'স্পষ্ট কথায় সাধারণত খুবই নির্ভুল। যে লাইনগুলো নিয়ে এটি অনিশ্চিত সেগুলো চিহ্নিত থাকে, যাতে আপনি আগে সেগুলো দেখে নিতে পারেন।',
  'Video and audio to text': 'ভিডিও ও অডিও থেকে টেক্সট',
  'Video or audio, several at once is fine.': 'ভিডিও বা অডিও, একসঙ্গে কয়েকটি দিলেও চলবে।',
  'Video to text, accurately.': 'ভিডিও থেকে টেক্সট, নির্ভুলভাবে।',
  'Video to text: transcribe a video or audio file':
    'ভিডিও থেকে টেক্সট: একটি ভিডিও বা অডিও ফাইল ট্রান্সক্রাইব করুন',
  'video transcribed': 'ভিডিও ট্রান্সক্রাইব হয়েছে',
  'videos transcribed': 'ভিডিও ট্রান্সক্রাইব হয়েছে',
  'Vocabulary hint': 'শব্দভান্ডারের ইঙ্গিত',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'ভয়েস নোট, মিটিং, লেকচার, পডকাস্ট ও ইন্টারভিউ।',
  'Waiting for microphone permission…': 'মাইক্রোফোনের অনুমতির অপেক্ষায়…',
  'Waiting for the first words…': 'প্রথম কথাগুলোর অপেক্ষায়…',
  'Waiting in line…': 'সারিতে অপেক্ষা করছে…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'লেখা সরাসরি ফুটে উঠতে দেখুন, ভুল থাকলে ঠিক করুন, তারপর SRT, VTT, TXT, Markdown, JSON বা PDF হিসেবে ডাউনলোড করুন।',
  'We do not ask for your name, e-mail address or any other account details.':
    'আমরা আপনার নাম, ই-মেইল ঠিকানা বা অন্য কোনো অ্যাকাউন্টের তথ্য চাই না।',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'আমরা প্রতিশ্রুতি দিই না যে সেবাটি সবসময় পাওয়া যাবে, নির্বিঘ্ন থাকবে বা ত্রুটিমুক্ত হবে। রক্ষণাবেক্ষণের জন্য বা আমাদের নিয়ন্ত্রণের বাইরের কারণে ওয়েবসাইটটি, অথবা এর প্রয়োজনীয় ডাউনলোডগুলো (Hugging Face থেকে স্পিচ মডেল ও jsDelivr থেকে প্রোগ্রাম ফাইল) পাওয়া নাও যেতে পারে, আর কিছু ব্রাউজার বা ডিভাইস সব মডেল চালাতে পারে না। যেহেতু আপনার ট্রান্সক্রিপ্ট শুধু এই ব্রাউজারে রাখা হয় এবং নিষ্ক্রিয়তার পর মুছে যায়, যা দরকার সবসময় এক্সপোর্ট করে নিন।',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'আমরা আপনার ডেটা বিক্রি করি না। আপনার কোনো ফাইল বা ট্রান্সক্রিপ্ট আমাদের কাছে নেই, তাই শেয়ার করারও কিছু নেই: শনাক্তকরণ চলে আপনার ডিভাইসে, কোনো বাইরের ট্রান্সক্রিপশন বা AI সেবায় নয়। Google (বিজ্ঞাপন), Cloudflare (হোস্টিং ও কাউন্টার), Hugging Face ও jsDelivr (ডাউনলোড) কেবল ওপরে বর্ণিত তথ্যই পায়। আইন চাইলে আমরা তথ্য প্রকাশ করতে পারি।',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    'আমাদের দিকে আপনার কিছুই রাখা হয় না: একটি মাত্র চলতি মোট সংখ্যা ছাড়া আপনার ব্যবহার সম্পর্কে আমরা আর কিছুই সংরক্ষণ করি না।',
  'We may block access if these rules are broken.':
    'এই নিয়ম ভাঙা হলে আমরা প্রবেশাধিকার বন্ধ করে দিতে পারি।',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'আমরা এই শর্তাবলি হালনাগাদ করতে পারি। নতুন সংস্করণটি এই পৃষ্ঠায় নতুন "সর্বশেষ হালনাগাদ" তারিখসহ প্রকাশিত হবে এবং তখন থেকে প্রযোজ্য হবে।',
  'We never send your file, your transcript or any personal information to Google.':
    'আমরা কখনোই আপনার ফাইল, ট্রান্সক্রিপ্ট বা কোনো ব্যক্তিগত তথ্য Google-কে পাঠাই না।',
  'Web subtitles (.vtt)': 'ওয়েব সাবটাইটেল (.vtt)',
  'What people use it for': 'মানুষ এটি কীসের জন্য ব্যবহার করে',
  'What you can do with it': 'এটি দিয়ে আপনি কী করতে পারেন',
  'What you get': 'আপনি কী পান',
  'what you were doing, and what happened instead of what you expected;':
    'আপনি কী করছিলেন, এবং যা আশা করেছিলেন তার বদলে কী ঘটেছে;',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'আপনার ফাইল কোথায় প্রক্রিয়া হয় তা নির্ভর করে {brand} কীভাবে চালানো হচ্ছে তার ওপর, আর সার্ভার এইমাত্র সাড়া দেয়নি। দেখুন [গোপনীয়তা নীতি](/privacy)।',
  'Where your files are processed depends on how {brand} is run.':
    'আপনার ফাইল কোথায় প্রক্রিয়া হয় তা নির্ভর করে {brand} কীভাবে চালানো হচ্ছে তার ওপর।',
  'Which files can I use, and what are the limits?': 'কোন ফাইল ব্যবহার করতে পারি, আর সীমা কী?',
  'Which languages are supported?': 'কোন কোন ভাষা সমর্থিত?',
  'Who builds it': 'কে এটি তৈরি করেন',
  'Who runs this website': 'কে এই ওয়েবসাইট পরিচালনা করেন',
  'Why it exists': 'এটি কেন আছে',
  'Working…': 'কাজ চলছে…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'হ্যাঁ। এটি বিনামূল্যে, আর কোনো অ্যাকাউন্ট বা লগইন কখনোই লাগে না। দৈনিক বা মাসিক কোনো কোটা নেই, কোনো পেওয়াল নেই; বিজ্ঞাপন ওয়েবসাইটটিকে বিনামূল্যে রাখে।',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'হ্যাঁ। এটি বিনামূল্যে, আর কোনো অ্যাকাউন্ট বা লগইন কখনোই লাগে না। দৈনিক বা মাসিক কোনো কোটা নেই এবং কোনো পেওয়ালও নেই।',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'হ্যাঁ। এটি বিনামূল্যে, সাইন-আপ করার কিছু নেই এবং লগইনও নেই। এই কপিটি আপনার নিজের কম্পিউটারে চলে, তাই কোটা বা পেওয়াল নেই; কত দ্রুত কাজ করবে তা নির্ভর করে আপনার কম্পিউটারের ওপর।',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'হ্যাঁ। কোনো লাইনের পাশের পেনসিল চিহ্নে চেপে তার লেখা বদলান বা লাইনটি মুছুন, অথবা পুরো ট্রান্সক্রিপ্টে খুঁজে প্রতিস্থাপন করুন। আপনার সম্পাদনা প্রতিটি এক্সপোর্টে থাকে।',
  'You agree not to:': 'আপনি সম্মত হচ্ছেন যে আপনি এসব করবেন না:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'নিয়ন্ত্রণ আপনার হাতে: **আমার ডেটা এখনই মুছুন** দিয়ে যেকোনো সময় আপনার ট্রান্সক্রিপ্ট, ফাইল এবং চাইলে ডাউনলোড করা স্পিচ মডেলও মুছে ফেলতে পারেন। এটি কেবল এই ব্রাউজারের ডেটা মোছে; Google-এর কুকি মুছতে পারে না।',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'আপনি যেকোনো সময় তা বদলাতে পারেন, বিজ্ঞাপন দেখানো যেকোনো পৃষ্ঠার (যেমন হোম পৃষ্ঠার) নিচে **গোপনীয়তা ও কুকি সেটিং** দিয়ে।',
  'You can now read, fix and download it.': 'এখন আপনি এটি পড়তে, ঠিক করতে ও ডাউনলোড করতে পারেন।',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'আপনি যেকোনো সময় সেবাটি ব্যবহার বন্ধ করতে পারেন এবং **আমার ডেটা এখনই মুছুন** দিয়ে এই ব্রাউজারের ডেটা মুছে ফেলতে পারেন। আমরা যেকোনো সময় আপনার প্রবেশাধিকার স্থগিত বা বন্ধ করতে পারি, বিশেষ করে আপনি এই শর্তাবলি ভাঙলে।',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'আপনার যোগ করা ফাইল এবং সেগুলো থেকে তৈরি ট্রান্সক্রিপ্টের সব অধিকার আপনারই থাকে। সেগুলো আপনার ডিভাইসে প্রক্রিয়া হয় এবং আমরা কখনো পাই না। আপনি যা ট্রান্সক্রাইব করেন তার দায়িত্ব আপনার: শুধু সেই কনটেন্টই ব্যবহার করুন যার মালিক আপনি বা যা প্রক্রিয়া করার অধিকার আপনার আছে, তাতে যাঁরা কথা বলেছেন তাঁদের কাছ থেকে প্রয়োজনীয় যেকোনো অনুমতিসহ।',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'আপনি [Google বিজ্ঞাপন সেটিং](https://adssettings.google.com)-এ গিয়ে ব্যক্তিগতকৃত বিজ্ঞাপন থেকে বেরিয়ে আসতে পারেন, অথবা [www.aboutads.info](https://www.aboutads.info)-এ গিয়ে ব্যক্তিগতকৃত বিজ্ঞাপনের জন্য কিছু তৃতীয় পক্ষ বিক্রেতার কুকি ব্যবহার থেকে বেরিয়ে আসতে পারেন। জানুন [যেসব সাইট Google-এর সেবা ব্যবহার করে সেগুলোর তথ্য Google কীভাবে ব্যবহার করে](https://policies.google.com/technologies/partner-sites)।',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'আপনার ব্রাউজার ও তার সংস্করণ, এবং আপনার ডিভাইস (কম্পিউটার বা ফোন, ও তার অপারেটিং সিস্টেম);',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'আপনার ব্রাউজার এখানে কপি করা আটকে দিয়েছে। এর বদলে এক্সপোর্ট ব্যবহার করে টেক্সটটি সেভ করুন।',
  'Your change is saved.': 'আপনার পরিবর্তন সেভ হয়েছে।',
  'Your change is still in its box: press Save to try again.':
    'আপনার পরিবর্তন এখনও বক্সে আছে: আবার চেষ্টা করতে সেভ করুন চাপুন।',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'আপনার ফাইল এনক্রিপ্টেড সংযোগে সার্ভারে পাঠানো হয়, OpenAI Whisper-এর মতো উন্মুক্ত স্পিচ রিকগনিশন মডেল দিয়ে ট্রান্সক্রাইব করা হয়, এবং পরে নিজে থেকেই মুছে ফেলা হয়। [কীভাবে কাজ করে](/how-it-works) পৃষ্ঠায় প্রতিটি ধাপ ব্যাখ্যা করা আছে।',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'আপনার ফাইল আপনার নিজের ডিভাইসে, ব্রাউজারেই ট্রান্সক্রাইব হয়, তাই আমরা আকার বা দৈর্ঘ্যের কোনো সীমা রাখিনি। খুব বড় বা লম্বা ফাইলও চলে: সেগুলোতে বেশি সময় লাগে এবং যথেষ্ট খালি মেমরি দরকার, আর আপনার ডিভাইস ধীর হতে পারলে পৃষ্ঠাটি আপনাকে সতর্ক করে।',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'আপনার ফাইল OpenAI Whisper-এর মতো উন্মুক্ত স্পিচ রিকগনিশন মডেল দিয়ে ট্রান্সক্রাইব করা হয় এবং পরে নিজে থেকেই মুছে ফেলা হয়।',
  'Your file never leaves your device.': 'আপনার ফাইল কখনো আপনার ডিভাইস ছেড়ে যায় না।',
  'Your file never leaves your device. [Privacy](/privacy)':
    'আপনার ফাইল কখনো আপনার ডিভাইস ছেড়ে যায় না। [গোপনীয়তা](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'আপনার ফাইল কখনো আপনার ডিভাইস ছেড়ে যায় না। এটি এই ডিভাইসে আপনার ব্রাউজারেই ট্রান্সক্রাইব হয় এবং আমাদের বা অন্য কারও কাছে কখনো আপলোড হয় না। ট্রান্সক্রিপ্ট, আপনার সম্পাদনা ও ফাইল কেবল এই ব্রাউজারের স্টোরেজে রাখা হয় এবং {idle} নিষ্ক্রিয় থাকার পর নিজে থেকেই মুছে যায়, অথবা ট্রান্সক্রিপ্ট মেনুতে **আমার ডেটা এখনই মুছুন** চাপলে তখনই মুছে যায়। কোনো অ্যাকাউন্ট নেই। যাওয়ার আগে যা দরকার এক্সপোর্ট করে নিন।',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'আপনার ফাইল কখনো আপনার ডিভাইস ছেড়ে যায় না। এটি কোনো অ্যাকাউন্ট ছাড়াই আপনার ব্রাউজারেই ট্রান্সক্রাইব হয়, আর আপনার ট্রান্সক্রিপ্ট এই ব্রাউজারেই থাকে।',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'আপনার ফাইল এই ডিভাইসেই থাকে। ট্রান্সক্রাইব হওয়ার সময় এই ট্যাবটি খোলা রাখুন।',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'আপনার ফাইল ও ট্রান্সক্রিপ্ট শুধু এই সেশনের জন্য রাখা হয় এবং {idle} নিষ্ক্রিয় থাকার পর, অথবা আপনি "আমার ডেটা এখনই মুছুন" চাপলে নিজে থেকেই মুছে যায়। কোনো অ্যাকাউন্ট নেই, কোনো ট্র্যাকিং নেই, একটি অপরিহার্য সেশন কুকি। যাওয়ার আগে যা দরকার এক্সপোর্ট করে নিন।',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'আপনার ফাইল ও ট্রান্সক্রিপ্ট শুধু এই সেশনের জন্য রাখা হয় এবং সেশন শেষ হলে, অথবা আপনি "আমার ডেটা এখনই মুছুন" চাপলে নিজে থেকেই মুছে যায়। কোনো অ্যাকাউন্ট নেই, কোনো ট্র্যাকিং নেই, একটি অপরিহার্য সেশন কুকি। যাওয়ার আগে যা দরকার এক্সপোর্ট করে নিন।',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'আপনার ফাইল নিজে থেকেই মুছে যায়। [গোপনীয়তা](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'আপনার ফাইল আপনার ব্রাউজারেই প্রক্রিয়া হয় এবং আপনার ডিভাইসেই থাকে। ওয়েবসাইট, ডাউনলোড ও কাউন্টার এনক্রিপ্টেড সংযোগ (HTTPS) ব্যবহার করে। যিনিই এই ব্রাউজার প্রোফাইল ব্যবহার করতে পারেন, তিনি এতে রাখা ট্রান্সক্রিপ্টগুলো মুছে ফেলা না পর্যন্ত দেখতে পারেন, তাই শেয়ার করা কম্পিউটারে **আমার ডেটা এখনই মুছুন** চাপুন।',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'আপনার ফাইল আমাদের সার্ভারে আপলোড হয় যাতে সেখানে প্রক্রিয়া করা যায়। সেগুলো কেবল আপনার সেশনের জন্য রাখা হয় এবং সেশন শেষ হলে, {idle} নিষ্ক্রিয় থাকার পর, অথবা ট্রান্সক্রিপ্ট মেনুতে **আমার ডেটা এখনই মুছুন** চাপলে তখনই নিজে থেকে মুছে যায়। কোনো অ্যাকাউন্ট নেই, কোনো ট্র্যাকিং নেই, আর একমাত্র কুকি একটি অপরিহার্য সেশন কুকি (কোনো অ্যানালিটিক্স বা বিজ্ঞাপন কুকি নেই)।',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'আপনার ফাইল আমাদের সার্ভারে আপলোড হয় যাতে সেখানে প্রক্রিয়া করা যায়। সেগুলো কেবল আপনার সেশনের জন্য রাখা হয় এবং সেশন শেষ হলে, অথবা ট্রান্সক্রিপ্ট মেনুতে **আমার ডেটা এখনই মুছুন** চাপলে তখনই নিজে থেকে মুছে যায়। কোনো অ্যাকাউন্ট নেই, কোনো ট্র্যাকিং নেই, আর একমাত্র কুকি একটি অপরিহার্য সেশন কুকি (কোনো অ্যানালিটিক্স বা বিজ্ঞাপন কুকি নেই)।',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'আপনার ফাইল কখনো এই ডিভাইস ছেড়ে যায় না। ট্রান্সক্রিপ্ট কেবল এই ব্রাউজারে রাখা হয় এবং {idle} নিষ্ক্রিয় থাকার পর, অথবা আপনি "আমার ডেটা এখনই মুছুন" চাপলে নিজে থেকেই মুছে যায়। যাওয়ার আগে যা দরকার এক্সপোর্ট করে নিন।',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'আপনার ফাইল কখনো এই ডিভাইস ছেড়ে যায় না। ট্রান্সক্রিপ্ট কেবল এই ব্রাউজারে রাখা হয় এবং সেশন শেষ হলে, অথবা আপনি "আমার ডেটা এখনই মুছুন" চাপলে নিজে থেকেই মুছে যায়। যাওয়ার আগে যা দরকার এক্সপোর্ট করে নিন।',
  'Your session ends in {mins} min. Export what you need.':
    'আপনার সেশন {mins} মিনিটে শেষ হবে। যা দরকার এক্সপোর্ট করে নিন।',
  'Your session has ended': 'আপনার সেশন শেষ হয়েছে',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'আপনার সেশন শেষ হয়েছে এবং তার ডেটা মুছে ফেলা হয়েছে। আপনি একটি নতুন ট্রান্সক্রিপশন শুরু করতে পারেন।',
  'Your transcript is ready below.': 'আপনার ট্রান্সক্রিপ্ট নিচে প্রস্তুত।',
  'Your transcripts': 'আপনার ট্রান্সক্রিপ্ট',
  'Your transcripts and files were removed from the server.':
    'আপনার ট্রান্সক্রিপ্ট ও ফাইল সার্ভার থেকে সরিয়ে দেওয়া হয়েছে।',
  'Your transcripts and files were removed from this device.':
    'আপনার ট্রান্সক্রিপ্ট ও ফাইল এই ডিভাইস থেকে সরিয়ে দেওয়া হয়েছে।',
  'title:/': 'বিনামূল্যে ভিডিও থেকে টেক্সট, লগইন ছাড়া',
  'description:/':
    'বিনামূল্যে ভিডিও ও অডিও থেকে টেক্সট। লগইন নেই, দৈনিক সীমা নেই, 50+ ভাষা। টাইমস্ট্যাম্পসহ টেক্সট পান, SRT, VTT, TXT, PDF নামান।',
  'title:/about': 'TranscribeVid সম্পর্কে',
  'description:/about':
    'কে TranscribeVid তৈরি করেন ও কেন: সাইন-আপ ছাড়া বিনামূল্যের ভিডিও ও অডিও থেকে টেক্সট টুল, পরিচ্ছন্ন ইন্টারফেস, বিজ্ঞাপনে চলে।',
  'title:/audio-to-text': 'অডিও থেকে টেক্সট: বিনামূল্যে',
  'description:/audio-to-text':
    'পডকাস্ট, ইন্টারভিউ ও লেকচারকে টেক্সটে বদলান। বিনামূল্যে, টাইমস্ট্যাম্প, 50+ ভাষা, লগইন ছাড়াই। TXT, SRT, VTT বা PDF নামান।',
  'label:/audio-to-text': 'অডিও থেকে টেক্সট',
  'title:/contact': 'যোগাযোগ',
  'description:/contact':
    'TranscribeVid-এর সঙ্গে যোগাযোগ: প্রশ্ন, বাগ, নতুন ধারণা ও গোপনীয়তা-বিষয়ক অনুরোধের ই-মেইল, আর কে ওয়েবসাইটটি চালান।',
  'title:/faq': 'প্রায়শই জিজ্ঞাসিত প্রশ্ন',
  'description:/faq':
    'TranscribeVid নিয়ে সচরাচর প্রশ্নের উত্তর: নির্ভুলতা, ভাষা, ফাইল ও সীমা, গতি, গোপনীয়তা এবং সম্পাদনা।',
  'title:/guides': 'গাইড',
  'description:/guides':
    'ট্রান্সক্রিপ্ট ও সাবটাইটেলের ব্যবহারিক গাইড: SRT না VTT, ভিডিওতে সাবটাইটেল যোগ, নির্ভুল ট্রান্সক্রিপ্ট ও ব্যক্তিগত ট্রান্সক্রিপশন।',
  'title:/guides/accurate-transcripts': 'আরও নির্ভুল ট্রান্সক্রিপ্ট পাবেন যেভাবে',
  'description:/guides/accurate-transcripts':
    'স্পিচ-টু-টেক্সটের নির্ভুলতা বাড়ানোর উপায়: পরিষ্কার অডিও, সঠিক ভাষা ও মডেল, শব্দভান্ডারের ইঙ্গিত, আর ফল যাচাই ও ঠিক করা।',
  'label:/guides/accurate-transcripts': 'কীভাবে আরও নির্ভুল ট্রান্সক্রিপ্ট পাবেন',
  'title:/guides/how-to-add-subtitles-to-a-video': 'ভিডিওতে সাবটাইটেল যোগ করুন (বিনামূল্যে)',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'চার ধাপে সাবটাইটেল বানান: ভিডিও ট্রান্সক্রাইব করুন, লেখা ঠিক করুন, SRT বা VTT এক্সপোর্ট করুন, তারপর YouTube, VLC বা এডিটরে যোগ করুন।',
  'label:/guides/how-to-add-subtitles-to-a-video': 'কীভাবে ভিডিওতে সাবটাইটেল যোগ করবেন',
  'title:/guides/srt-vs-vtt': 'SRT বনাম VTT: কোনটি ব্যবহার করবেন',
  'description:/guides/srt-vs-vtt':
    'SRT না VTT? দুটি সাবটাইটেল ফরম্যাট কী, কীভাবে আলাদা, কোনটি কোথায় চলে, আর আপনার ভিডিও থেকে বিনামূল্যে যেকোনোটি পাবেন কীভাবে।',
  'label:/guides/srt-vs-vtt': 'SRT বনাম VTT',
  'title:/guides/transcribe-video-without-uploading': 'আপলোড ছাড়াই ভিডিও ট্রান্সক্রাইব করুন',
  'description:/guides/transcribe-video-without-uploading':
    'ব্রাউজারে ট্রান্সক্রিপশন কীভাবে চলে, কী আপনার ডিভাইসে থাকে, কী একবার ডাউনলোড হয়, আর ব্রাউজারের নেটওয়ার্ক প্যানেলে নিজে যাচাই করবেন কীভাবে।',
  'label:/guides/transcribe-video-without-uploading': 'আপলোড না করেই ভিডিও ট্রান্সক্রাইব করুন',
  'title:/guides/what-is-whisper': 'Whisper কী? স্পিচ-টু-টেক্সট ব্যাখ্যা',
  'description:/guides/what-is-whisper':
    'OpenAI Whisper কী, কীসের ওপর প্রশিক্ষিত, কতটা নির্ভুল, কোথায় হোঁচট খায়, আর TranscribeVid-এ কীভাবে আপনার ব্রাউজারে চলে।',
  'label:/guides/what-is-whisper': 'Whisper কী?',
  'title:/how-it-works': 'কীভাবে কাজ করে',
  'description:/how-it-works':
    'TranscribeVid তিনটি সহজ ধাপে ভিডিও ও অডিওকে নির্ভুল, টাইমস্ট্যাম্পযুক্ত টেক্সটে বদলায়: কী পাবেন আর সেরা ফলের পরামর্শ।',
  'title:/interview-transcription': 'ইন্টারভিউ ট্রান্সক্রিপশন, বিনামূল্যে',
  'description:/interview-transcription':
    'অ্যাকাউন্ট ছাড়াই ইন্টারভিউ ট্রান্সক্রাইব করুন, বিনামূল্যে। 50+ ভাষায় টাইমস্ট্যাম্পযুক্ত টেক্সট, গবেষণা, সাংবাদিকতা ও নিয়োগের জন্য।',
  'label:/interview-transcription': 'ইন্টারভিউ ট্রান্সক্রিপশন',
  'title:/lecture-to-text': 'লেকচার থেকে টেক্সট: বিনামূল্যে',
  'description:/lecture-to-text':
    'রেকর্ড করা লেকচারকে খোঁজা ও পড়ার উপযোগী টেক্সট নোটে বদলান। বিনামূল্যে, লগইন ছাড়াই, 50+ ভাষা। TXT, Markdown, SRT বা PDF নামান।',
  'label:/lecture-to-text': 'লেকচার থেকে টেক্সট',
  'title:/m4a-to-text': 'M4A থেকে টেক্সট: ভয়েস মেমো',
  'description:/m4a-to-text':
    'M4A ভয়েস মেমো বা রেকর্ডিংকে বিনামূল্যে টেক্সটে বদলান। iPhone ভয়েস মেমোসহ কাজ করে, লগইন নেই, 50+ ভাষা। TXT, SRT, VTT বা PDF।',
  'label:/m4a-to-text': 'M4A থেকে টেক্সট',
  'title:/meeting-recording-to-text': 'Zoom, Teams ও Meet রেকর্ডিং থেকে টেক্সট',
  'description:/meeting-recording-to-text':
    'Zoom, Teams বা Google Meet রেকর্ডিংকে বিনামূল্যে খোঁজার উপযোগী, টাইমস্ট্যাম্পযুক্ত ট্রান্সক্রিপ্টে বদলান। লগইন নেই, 50+ ভাষা।',
  'label:/meeting-recording-to-text': 'মিটিং রেকর্ডিং থেকে টেক্সট',
  'title:/mov-to-text': 'MOV থেকে টেক্সট: iPhone ভিডিও',
  'description:/mov-to-text':
    'iPhone বা QuickTime-এর MOV ভিডিও বিনামূল্যে ট্রান্সক্রাইব করুন। লগইন নেই, 50+ ভাষা, প্রতি লাইনে টাইমস্ট্যাম্প। TXT, SRT, VTT বা PDF।',
  'label:/mov-to-text': 'MOV থেকে টেক্সট',
  'title:/mp3-to-text': 'MP3 থেকে টেক্সট: বিনামূল্যে',
  'description:/mp3-to-text':
    'অনলাইনে বিনামূল্যে MP3 থেকে টেক্সট। লগইন নেই, 50+ ভাষা, প্রতি লাইনে টাইমস্ট্যাম্প। লেখা সম্পাদনা করে TXT, SRT, VTT বা PDF নামান।',
  'label:/mp3-to-text': 'MP3 থেকে টেক্সট',
  'title:/mp4-to-text': 'MP4 থেকে টেক্সট: বিনামূল্যে',
  'description:/mp4-to-text':
    'MP4 ভিডিওকে টাইমস্ট্যাম্পসহ টেক্সটে বদলান। বিনামূল্যে, লগইন নেই, দৈনিক সীমা নেই, 50+ ভাষা। TXT, SRT, VTT, Markdown, JSON বা PDF।',
  'label:/mp4-to-text': 'MP4 থেকে টেক্সট',
  'title:/podcast-transcript-generator': 'পডকাস্ট ট্রান্সক্রিপ্ট জেনারেটর',
  'description:/podcast-transcript-generator':
    'MP3 বা WAV থেকে বিনামূল্যে পডকাস্টের ট্রান্সক্রিপ্ট বানান। টাইমস্ট্যাম্প, 50+ ভাষা, লগইন নেই। সম্পাদনা করে TXT, SRT, VTT বা PDF নামান।',
  'label:/podcast-transcript-generator': 'পডকাস্ট ট্রান্সক্রিপ্ট জেনারেটর',
  'title:/privacy': 'গোপনীয়তা নীতি',
  'description:/privacy':
    'ফাইল ট্রান্সক্রাইব করলে TranscribeVid কী ও কোথায় প্রক্রিয়া করে, কেন, কতদিন রাখে, কুকি, বিজ্ঞাপন, ব্রাউজার স্টোরেজ ও আপনার অধিকার।',
  'title:/srt-subtitle-generator': 'বিনামূল্যে SRT সাবটাইটেল জেনারেটর',
  'description:/srt-subtitle-generator':
    'যেকোনো ভিডিও বা অডিও থেকে বিনামূল্যে SRT সাবটাইটেল ফাইল বানান। কথার সঙ্গে সময় মেলানো, 50+ ভাষা, লগইন নেই। লাইন ঠিক করে SRT বা VTT নামান।',
  'label:/srt-subtitle-generator': 'SRT সাবটাইটেল জেনারেটর',
  'title:/terms': 'ব্যবহারের শর্তাবলি',
  'description:/terms':
    'TranscribeVid ব্যবহারের নিয়ম: বিনামূল্যের সেবা, আপনার কনটেন্ট, গ্রহণযোগ্য ব্যবহার, ফাইলের সীমা, ট্রান্সক্রিপ্টের নির্ভুলতায় ওয়ারেন্টিহীনতা ও দায়।',
  'title:/tools': 'সব বিনামূল্যের টুল',
  'description:/tools':
    'ভিডিও ও অডিও থেকে টেক্সটের সব বিনামূল্যের টুল এক তালিকায়: ফাইলের ধরন, ব্যবহার, সাবটাইটেল ফাইল ও ভাষা অনুযায়ী। লগইন নেই, 50+ ভাষা।',
  'title:/translate-audio-to-english': 'কথা থেকে ইংরেজি টেক্সট, বিনামূল্যে',
  'description:/translate-audio-to-english':
    'অন্য ভাষার কথাকে বিনামূল্যে ইংরেজি টেক্সটে বদলান। ভিডিও বা অডিও দিন, টাইমস্ট্যাম্পযুক্ত ইংরেজি টেক্সট বা সাবটাইটেল পান। লগইন নেই। SRT, VTT, TXT।',
  'label:/translate-audio-to-english': 'কথাকে ইংরেজি টেক্সটে অনুবাদ করুন',
  'title:/video-to-text': 'ভিডিও থেকে টেক্সট, লগইন ছাড়াই',
  'description:/video-to-text':
    'বিনামূল্যে ভিডিও থেকে টেক্সট। 50+ ভাষায় নির্ভুল, টাইমস্ট্যাম্পযুক্ত ট্রান্সক্রিপ্ট পান। লগইন নেই, দৈনিক সীমা নেই। SRT, VTT, TXT বা PDF নামান।',
  'label:/video-to-text': 'ভিডিও থেকে টেক্সট',
  'title:/voice-recording-to-text': 'ভয়েস রেকর্ডিং থেকে টেক্সট',
  'description:/voice-recording-to-text':
    'ব্রাউজারে নিজের কণ্ঠ রেকর্ড করুন বা ভয়েস মেমো দিন, টেক্সটে পান। বিনামূল্যে, লগইন নেই, 50+ ভাষা। TXT, PDF, SRT বা Markdown।',
  'label:/voice-recording-to-text': 'ভয়েস রেকর্ডিং থেকে টেক্সট',
  'title:/vtt-subtitle-generator': 'বিনামূল্যে VTT সাবটাইটেল জেনারেটর',
  'description:/vtt-subtitle-generator':
    'যেকোনো ভিডিও বা অডিও থেকে বিনামূল্যে WebVTT (.vtt) সাবটাইটেল ফাইল বানান। কথার সঙ্গে সময় মেলানো, 50+ ভাষা, লগইন নেই। লাইন ঠিক করে VTT নামান।',
  'label:/vtt-subtitle-generator': 'VTT সাবটাইটেল জেনারেটর',
  'title:/wav-to-text': 'WAV থেকে টেক্সট: বিনামূল্যে',
  'description:/wav-to-text':
    'WAV ফাইল বিনামূল্যে টেক্সটে বদলান। ফিল্ড রেকর্ডার ও কলের লম্বা রেকর্ডিংও চলে, 50+ ভাষা, টাইমস্ট্যাম্প, লগইন নেই। TXT, SRT বা PDF।',
  'label:/wav-to-text': 'WAV থেকে টেক্সট',
  'title:/webm-to-text': 'WebM থেকে টেক্সট: লগইন ছাড়া',
  'description:/webm-to-text':
    'WebM ভিডিও বা অডিও ফাইল বিনামূল্যে টেক্সটে বদলান। স্ক্রিন ও ব্রাউজার রেকর্ডিংয়ে চলে, 50+ ভাষা, টাইমস্ট্যাম্প। TXT, SRT, VTT বা PDF।',
  'label:/webm-to-text': 'WebM থেকে টেক্সট',
  'title:/whatsapp-voice-message-to-text': 'WhatsApp ভয়েস মেসেজ থেকে টেক্সট',
  'description:/whatsapp-voice-message-to-text':
    'WhatsApp ভয়েস মেসেজ বিনামূল্যে টেক্সটে বদলান। ভয়েস নোট সেভ করুন, দিন, হিন্দিসহ 50+ ভাষায় পড়ুন। লগইন নেই, অ্যাকাউন্ট নেই।',
  'label:/whatsapp-voice-message-to-text': 'WhatsApp ভয়েস মেসেজ থেকে টেক্সট',
  'title:/youtube-subtitle-generator': 'YouTube সাবটাইটেল জেনারেটর, বিনামূল্যে',
  'description:/youtube-subtitle-generator':
    'নিজের YouTube ভিডিওর জন্য বিনামূল্যে, লগইন ছাড়াই SRT সাবটাইটেল ফাইল বানান। কথার সঙ্গে সময় মেলানো, 50+ ভাষা। YouTube Studio-তে আপলোড করুন।',
  'label:/youtube-subtitle-generator': 'YouTube সাবটাইটেল জেনারেটর',
  'This page was translated with AI. [Found a mistake? Tell us.](/contact)':
    'এই পৃষ্ঠাটি AI দিয়ে অনুবাদ করা হয়েছে। [কোনো ভুল পেয়েছেন? আমাদের জানান।](/contact)',
};
export default dict;
