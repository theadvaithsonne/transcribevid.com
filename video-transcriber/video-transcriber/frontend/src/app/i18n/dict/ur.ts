/** Urdu dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
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
  '.': '۔',
  '"{name}" is {size}; the limit is {limit}.': '“{name}” کا سائز {size} ہے؛ حد {limit} ہے۔',
  '"{name}" is empty.': '“{name}” خالی ہے۔',
  '"{name}" is ready. Press Transcribe to start.':
    '“{name}” تیار ہے۔ شروع کرنے کے لیے ٹرانسکرائب کریں دبائیں۔',
  '“{title}” was deleted.': '“{title}” حذف کر دیا گیا۔',
  '(optional)': '(اختیاری)',
  '{base} Word timing: {timing}.': '{base} ہر لفظ کا وقت: {timing}۔',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand} ({domain}) کو **{name}**، {address} (“ہم”، “ہمیں”) چلاتے ہیں۔ آپ کے ڈیٹا کو کیسے اور کیوں پروسیس کیا جاتا ہے، اس کا فیصلہ ہم کرتے ہیں، جیسا کہ یہاں بیان کیا گیا ہے۔',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand} ({domain}) کو **{name}**، {address} چلاتے ہیں۔ مزید [ہمارے بارے میں](/about) صفحے پر پڑھیں۔',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand} عام صارفین کے لیے ایک سروس ہے اور 13 سال سے کم عمر بچوں (یا جہاں لاگو ہو وہاں یورپی یونین میں 16 سال سے کم عمر بچوں) کے لیے نہیں ہے۔',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand} کو **{name}**، {city} میں مقیم {role}، نے بنایا ہے اور وہی اسے چلاتے ہیں۔ میں نے اسے اس لیے بنایا کہ لوگوں کو ٹرانسکرپشن کا بہترین ممکنہ تجربہ ملے: پہلے کلک سے ہی آسان، اکاؤنٹ بنائے بغیر، اور ایسے صاف انٹرفیس کے ساتھ جو آپ کے راستے میں نہ آئے۔',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} عام صارفین کے لیے ہے اور 13 سال سے کم عمر بچوں کے لیے نہیں ہے۔',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages) and beside a finished transcript. No ad is shown while a file is being transcribed, and never on the privacy, terms or logs pages.':
    '{brand} اس لیے مفت ہے کہ اس میں اشتہارات دکھائے جاتے ہیں، جو Google AdSense کے ذریعے پیش کیے جاتے ہیں۔ اشتہارات صرف معلوماتی صفحات (ہوم، یہ کیسے کام کرتا ہے، عمومی سوالات اور ٹول کے صفحات) پر اور مکمل ٹرانسکرپٹ کے ساتھ نظر آتے ہیں۔ فائل کی ٹرانسکرپشن کے دوران کوئی اشتہار نہیں دکھایا جاتا، اور رازداری، شرائط یا لاگز کے صفحات پر کبھی نہیں۔',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    '{brand} استعمال کرنا مفت ہے۔ آپ کی فائلوں کے ساتھ کیا ہوتا ہے، یہ [رازداری کی پالیسی](/privacy) میں بتایا گیا ہے۔',
  '{brand} is funded by ads shown on its information pages and beside finished transcripts (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand} کی مالی معاونت اس کے معلوماتی صفحات پر اور مکمل ٹرانسکرپٹ کے ساتھ دکھائے جانے والے اشتہارات (Google AdSense) سے ہوتی ہے۔ چونکہ ٹرانسکرپشن آپ کی اپنی ڈیوائس پر ہوتی ہے، اس لیے ہر فائل پر کوئی سرور خرچ نہیں آتا، اور یہی سروس کو مفت اور لامحدود رکھتا ہے۔ اشتہارات کیا استعمال کرتے ہیں اور آپ اپنی ترجیحات کیسے چن سکتے ہیں، یہ [رازداری کی پالیسی](/privacy) میں بتایا گیا ہے۔',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand} ویڈیو یا آڈیو فائل کی تقریر کو تین آسان مراحل میں ٹائم اسٹیمپ کے ساتھ متن میں بدل دیتا ہے۔',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand} ویڈیوز، آڈیو فائلوں اور وائس ریکارڈنگز کی تقریر کو درست، ٹائم اسٹیمپ والے متن میں بدلتا ہے۔ یہ مفت ہے، ٹرانسکرائب کی جانے والی فائلوں کی تعداد پر کوئی حد نہیں، اور اکاؤنٹ کی ضرورت نہیں: اوپر فائل منتخب کریں، ٹرانسکرائب کریں دبائیں اور نتیجہ پڑھیں۔',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages and beside finished transcripts (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand} ویڈیو اور آڈیو فائلوں کو آپ کے براؤزر ہی میں متن میں بدلتا ہے: شناخت آپ کی ڈیوائس پر چلتی ہے، اور آپ کی فائلیں ہمیں اپ لوڈ نہیں کی جاتیں۔ اسے استعمال کرنا مفت ہے اور اکاؤنٹ کی ضرورت نہیں۔ اس کی مالی معاونت معلوماتی صفحات پر اور مکمل ٹرانسکرپٹ کے ساتھ دکھائے جانے والے اشتہارات (Google AdSense؛ دیکھیں [رازداری کی پالیسی](/privacy)) سے ہوتی ہے۔ ہم کسی بھی وقت فیچرز کو تبدیل، محدود یا بند کر سکتے ہیں۔',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand} ویڈیو اور آڈیو کو مفت درست، ٹائم اسٹیمپ والے متن میں بدلتا ہے۔ نہ سائن اَپ، نہ سائن اِن، نہ واٹرمارک: صفحہ کھولیں، فائل منتخب کریں اور اپنا ٹرانسکرپٹ پڑھیں۔',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies.':
    '{brand} ویڈیو اور آڈیو کو آپ کے براؤزر ہی میں متن میں بدلتا ہے۔ یہ صفحہ سادہ الفاظ میں بتاتا ہے کہ اس میں آپ کے ڈیٹا کے ساتھ کیا ہوتا ہے۔ مختصراً: آپ کی فائل آپ کی ڈیوائس سے باہر نہیں جاتی۔ آپ کے ٹرانسکرپٹس صرف اسی براؤزر میں رکھے جاتے ہیں، اکاؤنٹ نہیں ہوتا، اور سائٹ اپنی کوئی کوکیز سیٹ نہیں کرتی۔ اشتہارات صرف معلوماتی صفحات پر اور مکمل ٹرانسکرپٹ کے ساتھ نظر آتے ہیں، اور انہیں Google پیش کرتا ہے جو کوکیز استعمال کرتا ہے۔',
  '{done} of {total}': '{done} از {total}',
  '{duration} (estimate)': '{duration} (اندازاً)',
  '{gb} GB of memory recommended': '{gb} GB میموری تجویز کی جاتی ہے',
  '{h} h': '{h} گھنٹہ',
  '{h} h {m} min': '{h} گھنٹہ {m} منٹ',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)':
    '{label} (پہلے استعمال پر {size} MB ڈاؤن لوڈ ہوتے ہیں)',
  "{label}, as reported by visitors' browsers": '{label}، جیسا کہ وزیٹرز کے براؤزرز نے بتایا',
  '{label}: common questions': '{label}: عام سوالات',
  '{label}. {title}.': '{label}۔ {title}۔',
  '{label}. Look for it in your downloads.': '{label}۔ اسے اپنی ڈاؤن لوڈز میں دیکھیں۔',
  '{language} → English': '{language} ← انگریزی',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} {done} از {total} فائلیں پہلے ہی قطار میں تھیں؛ باقی {left} فہرست میں موجود ہیں، دوبارہ کوشش کے لیے ٹرانسکرائب کریں دبائیں۔',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} {done} از {total} فائلیں پہلے ہی قطار میں تھیں؛ باقی {left} فہرست میں موجود ہے، دوبارہ کوشش کے لیے ٹرانسکرائب کریں دبائیں۔',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '{model} اس ڈیوائس پر حقیقی وقت سے آہستہ چلتا ہے: {audio} کی آڈیو کے لیے {wait} (اندازاً)۔ Tiny یا Base جلد مکمل ہوتے ہیں۔',
  '{n} files were skipped: not video or audio.':
    '{n} فائلیں چھوڑ دی گئیں: یہ ویڈیو یا آڈیو نہیں ہیں۔',
  '{n} h ago': '{n} گھنٹے پہلے',
  '{n} min': '{n} منٹ',
  '{n} min ago': '{n} منٹ پہلے',
  '{n} min left': '{n} منٹ باقی',
  '{n} min read': '{n} منٹ کا مطالعہ',
  '{n} minute': '{n} منٹ',
  '{n} minutes': '{n} منٹ',
  '{n} of {total}': '{n} از {total}',
  '{n} of those files are already in the list.': 'ان میں سے {n} فائلیں پہلے ہی فہرست میں ہیں۔',
  '{n} video transcribed': '{n} ویڈیو ٹرانسکرائب ہوئی',
  '{n} videos transcribed': '{n} ویڈیوز ٹرانسکرائب ہوئیں',
  '{n} words': '{n} الفاظ',
  '{n}% done': '{n}% مکمل',
  '{n}% model confidence': '{n}% ماڈل کا اعتماد',
  '{n}s left': '{n} سیکنڈ باقی',
  '{name} home': '{name} ہوم',
  '{size} download': '{size} ڈاؤن لوڈ',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}۔',
  '{title}. {blurb}': '{title}۔ {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}۔ {blurb} اس ڈیوائس پر دستیاب نہیں: {reason}۔',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**اس ٹیب میں ایک تکنیکی لاگ۔** لاگز کا صفحہ اس ٹیب کا اپنا تکنیکی لاگ دکھاتا ہے۔ یہ آپ کے براؤزر ہی میں رہتا ہے اور کہیں نہیں بھیجا جاتا۔',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**الفاظ کا اشارہ شامل کریں**: آڈیو میں آنے والے نام، برانڈز اور مخصوص اصطلاحات، اسی طرح لکھی ہوئی جیسے آپ چاہتے ہیں۔',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**الفاظ کا اشارہ شامل کریں**: نام، برانڈز اور مخصوص اصطلاحات، اسی طرح لکھی ہوئی جیسے آپ چاہتے ہیں۔',
  '**Ads.** Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed.':
    '**اشتہارات۔** اشتہارات صرف معلوماتی صفحات پر اور مکمل ٹرانسکرپٹ کے ساتھ نظر آتے ہیں، اور انہیں Google پیش کرتا ہے جو کوکیز استعمال کرتا ہے۔ فائل کی ٹرانسکرپشن کے دوران کوئی اشتہار نہیں دکھایا جاتا۔',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**نشان زد لائنوں کو چیک کریں** اور انہیں ٹرانسکرپٹ ایڈیٹر میں درست کریں۔',
  '**Choose the spoken language** instead of auto-detect.':
    'خودکار پہچان کے بجائے **بولی جانے والی زبان منتخب کریں**۔',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**اپنی فائل منتخب کریں۔** اوپر کوئی ویڈیو یا آڈیو فائل ڈراپ کریں، اپنی ڈیوائس سے ایک چنیں، یا مائیکروفون سے اپنی آواز ریکارڈ کریں۔ MP4، MOV، MKV، WebM، AVI، MP3، WAV، M4A، FLAC، OGG اور زیادہ تر دیگر عام فارمیٹس کام کرتے ہیں۔',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**آڈیو بہتر بنائیں** — گونج اور سرسراہٹ ہٹائیں، دھیمی آواز والوں کو برابر کریں',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**فائل کی حدیں۔** ہماری طرف سے کوئی نہیں۔ آپ کی فائل آپ کی ڈیوائس پر پروسیس ہوتی ہے، اس لیے بہت بڑی یا لمبی فائلوں میں زیادہ وقت لگتا ہے اور کافی خالی میموری درکار ہوتی ہے؛ سست ڈیوائس پر صفحہ آپ کو خبردار کرتا ہے۔',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**فائل کی اقسام۔** ویڈیو: MP4، MKV، MOV، AVI، WEBM، WMV، FLV، M4V، 3GP، TS اور MTS۔ آڈیو: MP3، WAV، M4A، AAC، FLAC، OGG اور OPUS۔ آپ سیدھے اپنے مائیکروفون سے بھی ریکارڈ کر سکتے ہیں۔',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**Google کی کوکیز۔** اشتہارات لوڈ ہونے پر Google اپنی کوکیز سیٹ کرتا ہے، صرف ان صفحات پر جو اشتہارات دکھاتے ہیں (دیکھیں سیکشن 6)۔',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**لیکچرز اور پوڈکاسٹس** جنہیں مطالعے یا شو نوٹس کے لیے پڑھنے کے قابل متن میں بدلا گیا۔',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**حدیں۔** اس وقت سرور کی طرف سے سائز یا دورانیے کی کسی حد کا اعلان نہیں کیا گیا۔ بہت بڑی فائلوں میں بس زیادہ وقت لگتا ہے۔',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**حدیں۔** ہم سائز یا دورانیے کی کوئی حد مقرر نہیں کرتے: آپ کی فائل آپ کی ڈیوائس پر پروسیس ہوتی ہے، اس لیے بہت بڑی یا لمبی فائلوں میں بس زیادہ وقت لگتا ہے اور کافی خالی میموری درکار ہوتی ہے۔ سست ڈیوائس پر صفحہ شروع کرنے سے پہلے آپ کو بتاتا ہے اور وقت کا اندازہ دیتا ہے۔',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**آپ کی شامل کردہ میڈیا۔** وہ ویڈیو یا آڈیو فائلیں جو آپ منتخب یا ریکارڈ کرتے ہیں۔ وہ آپ کے براؤزر میں آپ کی ڈیوائس پر پروسیس ہوتی ہیں (WebGPU یا WebAssembly کے ذریعے)۔ آپ کی فائل ہمارے سرورز پر کبھی اپ لوڈ نہیں ہوتی اور نہ Google یا کسی اور کو بھیجی جاتی ہے۔',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**میٹنگ اور انٹرویو کے نوٹس** جنہیں آپ تلاش کر سکتے ہیں، حوالہ دے سکتے ہیں اور شیئر کر سکتے ہیں۔',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**غلطیاں ہو سکتی ہیں۔** کوئی بھی اسپیچ ریکگنیشن بے عیب نہیں۔ کسی اہم کام کے لیے ٹرانسکرپٹ پر بھروسا کرنے سے پہلے اسے ہمیشہ جانچ لیں۔',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**ہماری اپنی کوئی کوکیز نہیں۔** سائٹ خود کوئی کوکیز سیٹ نہیں کرتی۔',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**بعد کے لیے کچھ محفوظ نہیں ہوتا۔** فائلیں اور ٹرانسکرپٹس صرف آپ کے سیشن کے لیے رہتے ہیں۔ جانے سے پہلے جو چاہیں ایکسپورٹ کر لیں۔ تفصیل [رازداری کی پالیسی](/privacy) میں ہے۔',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**بعد کے لیے کچھ محفوظ نہیں ہوتا۔** ٹرانسکرپٹس اور فائل صرف اسی براؤزر میں رہتے ہیں اور {idle} کی غیر فعالیت کے بعد، یا جب آپ **میرا ڈیٹا ابھی حذف کریں** دبائیں، خود بخود حذف ہو جاتے ہیں۔ جانے سے پہلے جو چاہیں ایکسپورٹ کر لیں۔ تفصیل [رازداری کی پالیسی](/privacy) میں ہے۔',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**بعد کے لیے کچھ محفوظ نہیں ہوتا۔** ٹرانسکرپٹس صرف اس سیشن کے لیے رہتے ہیں، اس لیے جو چاہیں ایکسپورٹ کر لیں۔ ہوسٹ کی گئی ویب سائٹ کا بیان [رازداری کی پالیسی](/privacy) میں ہے۔',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**ایک چلتا ہوا مجموعہ۔** جب ٹرانسکرپشن مکمل ہوتی ہے تو آپ کا براؤزر ہمارے کاؤنٹر (ایک Cloudflare Worker) کو ایک گمنام “+1” بھیجتا ہے۔ اس میں کوئی فائل، ٹرانسکرپٹ یا شناخت کنندہ نہیں ہوتا۔ Cloudflare کو ترسیل کے دوران آپ کا IP پتہ نظر آتا ہے اور وہ اسے غلط استعمال روکنے (ریٹ لمٹ) کے لیے مختصر طور پر استعمال کرتا ہے؛ ہم صرف مجموعہ محفوظ کرتے ہیں۔ صفحے کے ہیڈر میں دکھایا گیا عدد وزیٹرز کے براؤزرز کی اطلاع پر مبنی ہے اور اس کی تصدیق نہیں کی جاتی۔',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    'مشکل آڈیو کے لیے **اعلیٰ درستگی یا بہترین درستگی چنیں**۔',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**کوالٹی اور زبان چنیں۔** تیز ماڈل فوری مسودہ دیتا ہے؛ زیادہ درست ماڈل انٹرویوز، لیکچرز اور سب ٹائٹلز کے لیے بہتر ہے۔ بولی جانے والی زبان خود پہچانی جا سکتی ہے، اور 50 سے زیادہ زبانیں سپورٹ کی جاتی ہیں۔',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    'مکمل ٹرانسکرپٹ کو کسی اور کوالٹی یا زبان کے ساتھ **دوبارہ ٹرانسکرائب کریں**؛ آپ کا موجودہ ٹرانسکرپٹ برقرار رہتا ہے۔',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    'کسی اور کوالٹی یا زبان کے ساتھ **دوبارہ ٹرانسکرائب کریں**؛ آپ کا موجودہ ٹرانسکرپٹ برقرار رہتا ہے۔',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**پڑھیں، درست کریں اور ڈاؤن لوڈ کریں۔** ٹرانسکرپٹ ٹائم اسٹیمپ کے ساتھ نظر آتا ہے، اور جن الفاظ پر ماڈل کو یقین نہیں تھا انہیں نشان زد کیا جاتا ہے تاکہ آپ انہیں جانچ سکیں۔ اسے سادہ متن، SRT یا VTT سب ٹائٹلز، Markdown یا JSON کی شکل میں ڈاؤن لوڈ کریں۔',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**ویب سائٹ پہنچانے والی درخواستیں۔** Cloudflare (Cloudflare Pages) یہ ویب سائٹ پہنچاتا ہے۔ ہمارے ہوسٹنگ اور نیٹ ورک فراہم کنندہ کے طور پر وہ سائٹ کی ترسیل اور حفاظت کے لیے آپ کا IP پتہ اور درخواست کا عام ڈیٹا (جیسے وقت، مانگا گیا صفحہ اور آپ کا براؤزر) پروسیس کرتا ہے۔',
  '**Skip silence & music** — prevents made-up text':
    '**خاموشی اور موسیقی چھوڑیں** — من گھڑت متن کو روکتا ہے',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**اسپیچ ماڈلز آپ کے براؤزر کے کیش میں رہتے ہیں** (Cache Storage)، تاکہ اگلی ٹرانسکرپشن جلد شروع ہو، جب تک آپ انہیں حذف نہ کریں (**میرا ڈیٹا ابھی حذف کریں** بھی انہیں حذف کر سکتا ہے) یا آپ کا براؤزر اپنا اسٹوریج صاف نہ کر دے۔ یہ پروگرام فائلیں ہیں، آپ کا ڈیٹا نہیں۔',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**رفتار۔** یہ آپ کی منتخب کوالٹی، فائل کی لمبائی اور سروس کی مصروفیت پر منحصر ہے۔',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**رفتار۔** یہ آپ کی ڈیوائس، آپ کی منتخب کوالٹی اور فائل کی لمبائی پر منحصر ہے۔ کسی کوالٹی لیول کے پہلے استعمال پر اس کا ماڈل ایک بار ڈاؤن لوڈ ہوتا ہے: آپ کا براؤزر ماڈل فائلیں Hugging Face سے اور انجن کی پروگرام فائلیں jsDelivr سے لاتا ہے، پھر انہیں کیش میں رکھتا ہے۔ کام کے دوران ٹیب کھلا رکھیں۔',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**اچھی آڈیو سے شروع کریں**: پس منظر کا شور کم، مائیکروفون قریب، اور ایک وقت میں ایک شخص بولے۔ “آڈیو بہتر بنائیں” آن رکھیں۔',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**اچھی آڈیو سے شروع کریں**: پس منظر کا شور کم، مائیکروفون قریب، ایک وقت میں ایک شخص۔ “آڈیو بہتر بنائیں” آن رکھیں۔',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**آپ کے براؤزر میں اسٹوریج۔** آپ کا براؤزر آپ کے ٹرانسکرپٹس اور فائلیں (IndexedDB) اور اسپیچ ماڈلز (Cache Storage) اوپر بیان کردہ طریقے سے رکھتا ہے، آپ کی لائٹ یا ڈارک تھیم کا انتخاب یاد رکھتا ہے، اور اس کا سیشن اسٹوریج موجودہ ٹیب کے لیے چند سہولت والی سیٹنگز (جیسے آپ کی آخری کوالٹی کا انتخاب) رکھتا ہے۔ ان میں سے کچھ بھی ہمیں نہیں بھیجا جاتا۔',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    '**سب ٹائٹلز اور کیپشنز** آپ کی اپنی ویڈیوز، ریلز اور آن لائن کورسز کے لیے، SRT یا VTT فائل سے۔',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**آپ کی ڈیوائس پر بنا متن۔** ٹرانسکرپٹ، اس کے ٹائم اسٹیمپ اور آپ کی ترامیم، آپ کا منتخب کردہ عنوان، اور آپ کی منتخب سیٹنگز (کوالٹی، زبان، الفاظ کا اشارہ)۔ یہ اسی براؤزر میں بنائی اور رکھی جاتی ہیں؛ ہمیں کبھی موصول نہیں ہوتیں۔',
  '**Use previous text as context** — can repeat on long files':
    '**پچھلی عبارت کو سیاق کے طور پر استعمال کریں** — لمبی فائلوں پر دہرا سکتا ہے',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**وائس میموز** لکھ دیے جاتے ہیں، تاکہ آپ کو انہیں دوبارہ سننا نہ پڑے۔',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**نتائج مختلف رنز، کوالٹی سیٹنگز یا دوسرے ٹولز میں مختلف کیوں ہو سکتے ہیں؟** اسپیچ ریکگنیشن امکانی ہوتی ہے: یہ سب سے زیادہ ممکنہ الفاظ چنتی ہے، اور شور والے یا مبہم حصوں میں کئی جوابات قریب قریب ہوتے ہیں۔ مختلف کوالٹی سیٹنگ، زبان کی سیٹنگ، الفاظ کا اشارہ یا آڈیو کی صفائی متن بدل سکتی ہے، اور کوئی دوسرا ٹول جو مختلف نظام استعمال کرتا ہو وہ بھی۔ اسپیکر کے نام یا لیبلز شامل نہیں کیے جاتے۔',
  '**Word-level timing** — better subtitles and confidence marks':
    '**ہر لفظ کا وقت** — بہتر سب ٹائٹلز اور اعتماد کے نشانات',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**آپ کی فائلیں اور ٹرانسکرپٹس اسی براؤزر میں رہتے ہیں۔** ٹرانسکرپٹس، ترامیم اور سورس فائل صرف اس براؤزر کے اسٹوریج (IndexedDB) میں رکھی جاتی ہیں۔ جب آپ کا سیشن ختم ہوتا ہے، جو {idle} کی غیر فعالیت کے بعد ہوتا ہے، یا ٹرانسکرپٹس مینو میں **میرا ڈیٹا ابھی حذف کریں** دبانے پر فوراً، یہ خود بخود حذف ہو جاتے ہیں۔',
  '1 file was skipped: not video or audio.': '1 فائل چھوڑ دی گئی: یہ ویڈیو یا آڈیو نہیں ہے۔',
  '1 minute': '1 منٹ',
  '1 word': '1 لفظ',
  '1. Agreement': '1. معاہدہ',
  '1. Who runs this website': '1. اس ویب سائٹ کو کون چلاتا ہے',
  '10. Children': '10. بچے',
  '10. Termination': '10. سروس کا خاتمہ',
  '11. Children': '11. بچے',
  '11. Your rights and choices': '11. آپ کے حقوق اور اختیارات',
  '12. Changes': '12. تبدیلیاں',
  '12. Open-source components': '12. اوپن سورس اجزا',
  '13. Changes to this policy': '13. اس پالیسی میں تبدیلیاں',
  '13. Governing law': '13. حاکم قانون',
  '14. Contact': '14. رابطہ',
  '2. The service': '2. سروس',
  '2. What is processed, and where': '2. کیا پروسیس ہوتا ہے، اور کہاں',
  '3 simple steps': '3 آسان مراحل',
  '3. Why it is processed': '3. اسے کیوں پروسیس کیا جاتا ہے',
  '3. Your content': '3. آپ کا مواد',
  '4. Acceptable use': '4. قابلِ قبول استعمال',
  '4. How long it is kept': '4. کتنی دیر رکھا جاتا ہے',
  '5. Downloads your browser makes': '5. آپ کا براؤزر جو ڈاؤن لوڈز کرتا ہے',
  '5. Limits: your device does the work': '5. حدیں: کام آپ کی ڈیوائس کرتی ہے',
  '6. Accuracy: no warranty': '6. درستگی: کوئی ضمانت نہیں',
  '6. Advertising': '6. اشتہارات',
  '7. Availability': '7. دستیابی',
  '7. Cookies and browser storage': '7. کوکیز اور براؤزر اسٹوریج',
  '8. Sharing': '8. شیئرنگ',
  '8. Third-party downloads and ads': '8. تھرڈ پارٹی ڈاؤن لوڈز اور اشتہارات',
  '9. Liability': '9. ذمہ داری',
  '9. Security': '9. سیکیورٹی',
  'A name cannot be empty, so the old name was kept.':
    'نام خالی نہیں ہو سکتا، اس لیے پرانا نام برقرار رکھا گیا۔',
  'A new transcript has started. The old one is kept in your list.':
    'ایک نیا ٹرانسکرپٹ شروع ہو گیا ہے۔ پرانا آپ کی فہرست میں برقرار ہے۔',
  'a period': 'ایک مدت',
  About: 'ہمارے بارے میں',
  'About {brand}': '{brand} کے بارے میں',
  'about {h} h': 'تقریباً {h} گھنٹہ',
  'about {h} h {m} min': 'تقریباً {h} گھنٹہ {m} منٹ',
  'about {n} min': 'تقریباً {n} منٹ',
  'Accurate text': 'درست متن',
  'Add another file': 'ایک اور فائل شامل کریں',
  'Add your file': 'اپنی فائل شامل کریں',
  'Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    'اشتہارات صرف معلوماتی صفحات پر اور مکمل ٹرانسکرپٹ کے ساتھ نظر آتے ہیں، اور انہیں Google پیش کرتا ہے جو کوکیز استعمال کرتا ہے۔ فائل کی ٹرانسکرپشن کے دوران کوئی اشتہار نہیں دکھایا جاتا، اور یہ ویب سائٹ اپنی کوئی کوکیز سیٹ نہیں کرتی۔ تفصیل [رازداری کی پالیسی](/privacy) میں ہے۔',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'کسی بھی فیچر کے لیے اشتہارات ضروری نہیں: اشتہارات بلاک یا مسترد کرنے پر بھی سب کچھ ویسے ہی کام کرتا ہے۔',
  'Ads keep TranscribeVid free. Everything works without them.':
    'اشتہارات TranscribeVid کو مفت رکھتے ہیں۔ ان کے بغیر بھی سب کچھ کام کرتا ہے۔',
  Advertisement: 'اشتہار',
  'All free tools': 'تمام مفت ٹولز',
  'All free video and audio to text tools': 'ویڈیو اور آڈیو کو متن میں بدلنے کے تمام مفت ٹولز',
  'All tools': 'تمام ٹولز',
  'All your data was deleted': 'آپ کا تمام ڈیٹا حذف کر دیا گیا',
  'Allow the microphone in your browser, or choose a file instead.':
    'اپنے براؤزر میں مائیکروفون کی اجازت دیں، یا اس کے بجائے فائل منتخب کریں۔',
  'Already added': 'پہلے ہی شامل ہے',
  'Already finished': 'پہلے ہی مکمل',
  'Also delete the downloaded speech models?': 'کیا ڈاؤن لوڈ کیے گئے اسپیچ ماڈلز بھی حذف کریں؟',
  'an independent software developer': 'ایک آزاد سافٹ ویئر ڈیولپر',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'اپ لوڈ جاری ہے۔ مزید فائلیں شامل کرنے سے پہلے اس کے مکمل ہونے کا انتظار کریں۔',
  'Apply style only': 'صرف انداز لاگو کریں',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    'انداز لاگو کرنے میں محفوظ شدہ شناخت استعمال ہوتی ہے، آڈیو دوبارہ پروسیس نہیں ہوتی۔ ترمیم شدہ لائنیں برقرار رہتی ہیں۔',
  'Audio works too.': 'آڈیو بھی چلتی ہے۔',
  'Automatic (IndicXlit when installed)': 'خودکار (IndicXlit انسٹال ہونے پر)',
  Back: 'واپس',
  'Basic phonetic spelling': 'بنیادی صوتی ہجے',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'چونکہ ہمارے پاس کوئی اکاؤنٹ اور آپ کی شناخت کرنے والی کوئی تفصیل نہیں ہوتی، اس لیے ہم عام طور پر کسی ڈیٹا کو کسی شخص سے نہیں جوڑ سکتے۔ جہاں قانون آپ کو اپنے ذاتی ڈیٹا پر حقوق دیتا ہے، جیسے رسائی، درستی، حذف، پابندی، اعتراض اور منتقلی، یا اپنی ڈیٹا پروٹیکشن اتھارٹی سے شکایت کا حق، آپ ہم سے رابطہ کر کے انہیں استعمال کر سکتے ہیں:',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'چونکہ آپ کے ٹرانسکرپٹس صرف اسی براؤزر میں موجود ہیں، اس لیے جانے سے پہلے جو چاہیں ایکسپورٹ کر لیں۔ حذف شدہ ڈیٹا واپس نہیں آ سکتا۔',
  'Bengaluru, India': 'بنگلورو، بھارت',
  'Best accuracy': 'بہترین درستگی',
  'Best accuracy, slowest': 'بہترین درستگی، سب سے سست',
  Breadcrumb: 'نیویگیشن راستہ',
  'By file type': 'فائل کی قسم کے مطابق',
  'By language': 'زبان کے مطابق',
  'By use': 'استعمال کے مطابق',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    '{brand} ({domain}) استعمال کر کے آپ ان شرائط سے اتفاق کرتے ہیں۔ اگر آپ متفق نہیں ہیں تو براہِ کرم سروس استعمال نہ کریں۔ سروس **{name}**، {address} چلاتے ہیں۔',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'ویب سائٹ یا اس کے کاؤنٹر کی ریٹ لمٹس یا سیکیورٹی کو بائی پاس کرنا یا بائی پاس کرنے کی کوشش کرنا، یا اس کے آپریشن یا دیگر وزیٹرز کے استعمال میں خلل ڈالنا؛',
  'Can I edit the transcript?': 'کیا ٹرانسکرپٹ میں ترمیم کی جا سکتی ہے؟',
  "Can't reach the server.": 'سرور تک رسائی نہیں ہو رہی۔',
  Cancel: 'منسوخ کریں',
  'Cancel "{title}"?': '“{title}” منسوخ کریں؟',
  'Cancel {title}': '{title} منسوخ کریں',
  'Cancellation requested': 'منسوخی کی درخواست دی گئی',
  Cancelled: 'منسوخ شدہ',
  'Cancelling…': 'منسوخ ہو رہا ہے…',
  'Cannot reach the server': 'سرور تک رسائی نہیں ہو سکی',
  'Cannot reach the server.': 'سرور تک رسائی نہیں ہو سکی۔',
  'Cannot reach the server. Check your connection and try again.':
    'سرور تک رسائی نہیں ہو سکی۔ اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'سرور تک رسائی نہیں ہو سکی۔ یقینی بنائیں کہ وہ چل رہا ہے (npm run dev) اور دوبارہ کوشش کریں۔',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'کسی لائن کو تبدیل یا حذف کریں، یا تلاش اور تبدیل کریں۔ آپ کی ترامیم ہر ڈاؤن لوڈ میں شامل ہوتی ہیں۔',
  'Changed in {n} lines.': '{n} لائنوں میں تبدیلی کی گئی۔',
  'Check Hinglish spelling': 'ہنگلش کے ہجے چیک کریں',
  'Choose "Save as PDF" in the print dialog.': 'پرنٹ ڈائیلاگ میں “Save as PDF” منتخب کریں۔',
  'Choose a file': 'فائل منتخب کریں',
  'Choose a file first': 'پہلے فائل منتخب کریں',
  'Choose a format': 'فارمیٹ منتخب کریں',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'اپنی ڈیوائس اور دستیاب وقت کے مطابق تیز یا زیادہ درست ماڈلز میں سے انتخاب کریں۔',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'سب سے تیز، معیاری، اعلیٰ درستگی یا بہترین درستگی چنیں: سب سے تیز سب سے جلدی ہے، بہترین درستگی میں سب سے کم غلطیاں ہوتی ہیں۔',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'بولی جانے والی زبان منتخب کریں یا اسے خودکار پہچان پر رہنے دیں۔ آپ تقریر کا انگریزی میں ترجمہ بھی کر سکتے ہیں۔',
  'Chosen files': 'منتخب فائلیں',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'مائیکروفون کے قریب صاف بولنا بہترین نتیجہ دیتا ہے۔ مزید اختیارات کے تحت، **آڈیو بہتر بنائیں** اور **خاموشی اور موسیقی چھوڑیں** بطورِ ڈیفالٹ آن ہوتے ہیں: وہ گونج اور سرسراہٹ ہٹاتے ہیں اور موسیقی یا لمبے وقفوں کے دوران ماڈل کو متن گھڑنے سے روکتے ہیں، اس لیے شور والی ریکارڈنگز کے لیے انہیں آن رکھیں۔ سب ٹائٹلز کے لیے **ہر لفظ کا وقت** بھی آن رکھیں، تاکہ ہر لائن بالکل الفاظ کے ساتھ شروع اور ختم ہو۔',
  Close: 'بند کریں',
  'Close menu': 'مینو بند کریں',
  'Close: {title}': 'بند کریں: {title}',
  'Common questions': 'عام سوالات',
  Contact: 'رابطہ',
  'Converting…': 'تبدیل کیا جا رہا ہے…',
  Copied: 'کاپی ہو گیا',
  'Copy text': 'متن کاپی کریں',
  'Copying…': 'کاپی ہو رہا ہے…',
  'Could not cancel the transcript.': 'ٹرانسکرپٹ منسوخ نہیں کیا جا سکا۔',
  'Could not change transcript style.': 'ٹرانسکرپٹ کا انداز تبدیل نہیں کیا جا سکا۔',
  'Could not copy': 'کاپی نہیں ہو سکا',
  'Could not delete the transcript.': 'ٹرانسکرپٹ حذف نہیں کیا جا سکا۔',
  'Could not delete your data.': 'آپ کا ڈیٹا حذف نہیں کیا جا سکا۔',
  'Could not load the text to copy.': 'کاپی کرنے کے لیے متن لوڈ نہیں ہو سکا۔',
  'Could not prepare the file. Please try again.':
    'فائل تیار نہیں کی جا سکی۔ براہِ کرم دوبارہ کوشش کریں۔',
  'Could not rename the transcript.': 'ٹرانسکرپٹ کا نام تبدیل نہیں کیا جا سکا۔',
  'Could not save the change.': 'تبدیلی محفوظ نہیں ہو سکی۔',
  'Could not start': 'شروع نہیں ہو سکا',
  'Could not start.': 'شروع نہیں ہو سکا۔',
  Dark: 'ڈارک',
  Delete: 'حذف کریں',
  'Delete "{title}" and its transcript?': '“{title}” اور اس کا ٹرانسکرپٹ حذف کریں؟',
  'Delete "{title}"? This cannot be undone.': '“{title}” حذف کریں؟ یہ عمل واپس نہیں ہو سکتا۔',
  'Delete {title}': '{title} حذف کریں',
  'Delete all your transcripts and the files kept in this browser now?':
    'اس براؤزر میں رکھے آپ کے تمام ٹرانسکرپٹس اور فائلیں ابھی حذف کریں؟',
  'Delete all your transcripts and uploaded files now?':
    'آپ کے تمام ٹرانسکرپٹس اور اپ لوڈ کی گئی فائلیں ابھی حذف کریں؟',
  'Delete line': 'لائن حذف کریں',
  'Delete my data now': 'میرا ڈیٹا ابھی حذف کریں',
  'Delete this line from the transcript?': 'اس لائن کو ٹرانسکرپٹ سے حذف کریں؟',
  'Delete transcript': 'ٹرانسکرپٹ حذف کریں',
  Deleted: 'حذف شدہ',
  'Detect automatically': 'خودکار طور پر پہچانیں',
  'Dismiss message': 'پیغام بند کریں',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3 صرف انگریزی تقریر سمجھتا ہے۔ ترجمے کے لیے کوئی اور ماڈل چنیں۔',
  Done: 'مکمل',
  'Download failed': 'ڈاؤن لوڈ ناکام ہو گیا',
  'Download started': 'ڈاؤن لوڈ شروع ہو گیا',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'نتیجہ سادہ متن، SRT یا VTT سب ٹائٹلز، Markdown یا JSON کی شکل میں ڈاؤن لوڈ کریں۔',
  'Download the transcript as': 'ٹرانسکرپٹ اس شکل میں ڈاؤن لوڈ کریں',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'اسپیچ ماڈل ڈاؤن لوڈ ہو رہا ہے (صرف پہلی بار): {loaded} از {total}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    '[ہوم صفحے](/) پر کوئی ویڈیو یا آڈیو فائل ڈراپ کریں، یا اپنے مائیکروفون سے ریکارڈ کریں۔',
  'Drop to add your file': 'اپنی فائل شامل کرنے کے لیے یہاں ڈراپ کریں',
  'Drop your {noun} here, or choose a file': '{noun} یہاں ڈراپ کریں یا فائل منتخب کریں',
  'Each line with its time, like [00:12]': 'ہر لائن اپنے وقت کے ساتھ، جیسے [00:12]',
  Edit: 'ترمیم کریں',
  'Edit it right here': 'اسے یہیں ایڈٹ کریں',
  'Edit this line': 'اس لائن میں ترمیم کریں',
  'Edited by you': 'آپ کی ترمیم کردہ',
  'English only, very fast and accurate': 'صرف انگریزی، بہت تیز اور درست',
  'English translation is selected in More options.': 'مزید اختیارات میں انگریزی ترجمہ منتخب ہے۔',
  'Enter saves · Esc cancels': 'Enter سے محفوظ ہوتا ہے · Esc سے منسوخ',
  'Every line has a time. Play the media from any line to hear what was said.':
    'ہر لائن کا ایک وقت ہے۔ جو کہا گیا اسے سننے کے لیے کسی بھی لائن سے میڈیا چلائیں۔',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'ہر صفحہ ایک ہی کام کرتا ہے: یہ ویڈیو یا آڈیو فائل کی تقریر کو ہر لائن پر ٹائم اسٹیمپ کے ساتھ متن میں بدلتا ہے، 50 سے زیادہ زبانوں میں، بغیر سائن اَپ کے۔ وہ صفحہ چنیں جو آپ کی فائل یا آپ کے مقصد سے ملتا ہو۔',
  'Experimental: compare on your audio; chunk timestamps':
    'تجرباتی: اپنی آڈیو پر موازنہ کریں؛ ٹکڑوں کے ٹائم اسٹیمپ',
  'Experimental: larger model; chunk timestamps': 'تجرباتی: بڑا ماڈل؛ ٹکڑوں کے ٹائم اسٹیمپ',
  Export: 'ایکسپورٹ',
  Failed: 'ناکام',
  FAQ: 'عمومی سوالات',
  Fast: 'تیز',
  'Fast, clean audio': 'تیز، صاف آڈیو',
  Fastest: 'سب سے تیز',
  'Fastest, rough drafts only': 'سب سے تیز، صرف ابتدائی مسودے',
  'Fewer mistakes. Takes longer.': 'کم غلطیاں۔ زیادہ وقت لگتا ہے۔',
  'Fewest mistakes. Takes the longest.': 'سب سے کم غلطیاں۔ سب سے زیادہ وقت لگتا ہے۔',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    'فائل “{name}” کا سائز {size} ہے؛ حد {limit} ہے - اسے بڑھانے کے لیے VT_MAX_UPLOAD_MB سیٹ کریں',
  'File "{name}" is {size}; the limit is {limit}.':
    'فائل “{name}” کا سائز {size} ہے؛ حد {limit} ہے۔',
  'file {n} of {total}': 'فائل {n} از {total}',
  'File added': 'فائل شامل ہو گئی',
  'File limits.': 'فائل کی حدیں۔',
  'File not added': 'فائل شامل نہیں ہوئی',
  'File skipped': 'فائل چھوڑ دی گئی',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'فائلیں اور ٹرانسکرپٹس صرف آپ کے سیشن کے لیے رہتے ہیں۔ جانے سے پہلے جو چاہیں ایکسپورٹ کر لیں۔ ہم صرف ایک چیز رکھتے ہیں: سائٹ پر اب تک کتنی فائلیں ٹرانسکرائب ہوئیں اس کا ایک گمنام مجموعہ (ایک ہی عدد، جو صفحے کے ہیڈر میں دکھایا جاتا ہے)؛ یہ آپ، آپ کی فائلوں یا آپ کے سیشن سے منسلک نہیں۔ تفصیل [رازداری کی پالیسی](/privacy) میں ہے۔',
  'Find it automatically': 'اسے خودکار طور پر تلاش کریں',
  'first time only, also downloads the {size} MB word-timing model':
    'صرف پہلی بار، ہر لفظ کے وقت کا {size} MB ماڈل بھی ڈاؤن لوڈ ہوتا ہے',
  'First time only: downloads {size} (needs internet)':
    'صرف پہلی بار: {size} ڈاؤن لوڈ ہوتا ہے (انٹرنیٹ درکار)',
  'Follow playback': 'پلے بیک کے ساتھ چلیں',
  'Following playback': 'پلے بیک کے ساتھ چل رہا ہے',
  Footer: 'فوٹر',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'لہجے والی یا مخلوط زبان کی تقریر کے لیے اعلیٰ کوالٹی سیٹنگ آزمائیں۔ اعتماد کا اسکور درستگی کا فیصد نہیں ہوتا۔',
  'For developers: words, times, confidence': 'ڈیولپرز کے لیے: الفاظ، اوقات، اعتماد',
  'For notes apps': 'نوٹس ایپس کے لیے',
  'For video players and editors': 'ویڈیو پلیئرز اور ایڈیٹرز کے لیے',
  'For YouTube and web video': 'YouTube اور ویب ویڈیو کے لیے',
  Free: 'مفت',
  'Free tools': 'مفت ٹولز',
  'Free tools:': 'مفت ٹولز:',
  'Free video and audio to text': 'ویڈیو اور آڈیو سے ٹیکسٹ، مفت',
  'Free video and audio to text, right in your browser':
    'ویڈیو اور آڈیو سے ٹیکسٹ، مفت، آپ کے براؤزر ہی میں',
  'Free, unlimited, and no login needed': 'مفت، لامحدود، اور لاگ اِن کی ضرورت نہیں',
  'Free, unlimited, no login': 'مفت، لامحدود، لاگ اِن کے بغیر',
  'Frequently asked questions': 'اکثر پوچھے جانے والے سوالات',
  'Get in touch': 'رابطہ کریں',
  'Getting the speech engine ready…': 'اسپیچ انجن تیار ہو رہا ہے…',
  'Give it a new name': 'اسے نیا نام دیں',
  'Go to the home page': 'ہوم صفحے پر جائیں',
  'Go to Video to text': 'ویڈیو سے ٹیکسٹ پر جائیں',
  'Good balance (default)': 'اچھا توازن (ڈیفالٹ)',
  'Good for most videos. Not sure? Keep this one.':
    'زیادہ تر ویڈیوز کے لیے اچھا۔ یقین نہیں؟ اسی کو رکھیں۔',
  'Good to know': 'جاننا مفید ہے',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'Google کا رضامندی کا ٹول لوڈ نہیں ہو سکا، غالباً اس لیے کہ کسی اشتہار بلاکر یا نیٹ ورک نے اسے روک دیا۔ اس کے بغیر نہ اشتہارات لوڈ ہوتے ہیں نہ اشتہاری کوکیز۔',
  Guides: 'گائیڈز',
  'Guides: transcripts and subtitles': 'گائیڈز: ٹرانسکرپٹس اور سب ٹائٹلز',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'کوئی سوال ہے، کوئی خرابی ملی ہے یا کوئی فیچر تجویز کرنا چاہتے ہیں؟ {email} پر لکھیں۔ ہر پیغام اسی شخص کے پاس پہنچتا ہے جو {brand} بناتا ہے، اور آپ کو عموماً چند کام کے دنوں میں جواب مل جاتا ہے۔',
  'Helps spell uncommon words correctly.': 'غیر معمولی الفاظ کے درست ہجے میں مدد کرتا ہے۔',
  'High accuracy': 'اعلیٰ درستگی',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    'اعلیٰ درستگی (Large v3 Turbo) کو ترجمہ کرنا نہیں سکھایا گیا تھا اور یہ آپ کو اصل زبان ہی دے سکتی ہے۔ ترجمے کے لیے معیاری یا بہترین درستگی چنیں۔',
  'High accuracy, slower': 'اعلیٰ درستگی، سست',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    'زیادہ قدر کچھ زیادہ درست اور سست ہوتی ہے۔ 5 ایک اچھی ڈیفالٹ ہے۔',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'ہندی انگریزی حروف میں، انگریزی الفاظ جوں کے توں رکھے جاتے ہیں۔ دوسری زبانیں اپنا اصل رسم الخط رکھتی ہیں۔ غیر مانوس الفاظ اور ناموں کو جانچ لیں۔',
  'Hinglish (Roman Hindi)': 'ہنگلش (رومن ہندی)',
  'Hinglish conversion': 'ہنگلش تبدیلی',
  History: 'ہسٹری',
  Home: 'ہوم',
  'How {brand} works': '{brand} کیسے کام کرتا ہے',
  'How accurate is it?': 'یہ کتنا درست ہے؟',
  'How do I get better accuracy?': 'بہتر درستگی کیسے حاصل کی جائے؟',
  'How it stays free': 'یہ مفت کیسے رہتا ہے',
  'How it works': 'یہ کیسے کام کرتا ہے',
  'How long does it take?': 'اس میں کتنا وقت لگتا ہے؟',
  'How to transcribe a video to text': 'ویڈیو کو متن میں کیسے بدلیں',
  'How to turn a video or audio file into text with {brand}':
    '{brand} کے ساتھ ویڈیو یا آڈیو فائل کو متن میں کیسے بدلیں',
  'If it does have speech, try More › Re-transcribe with the right language.':
    'اگر اس میں واقعی تقریر ہے تو مزید › دوبارہ ٹرانسکرائب کریں آزمائیں اور صحیح زبان منتخب کریں۔',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'اگر سروس مصروف ہو یا بہت سے ٹرانسکرپٹس پہلے ہی چل رہے ہوں تو وہ آپ سے انتظار کرنے کو کہتی ہے اور وجہ بتاتی ہے۔',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'اگر ہم اس پالیسی میں تبدیلی کریں تو نیا ورژن اس صفحے پر نئی “آخری تازہ کاری” کی تاریخ کے ساتھ نظر آئے گا۔',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'EEA، برطانیہ اور سوئٹزرلینڈ میں، اور امریکہ کی کچھ ریاستوں میں، اشتہارات لوڈ ہوتے وقت Google کا تصدیق شدہ رضامندی کا پیغام آپ کا انتخاب پوچھتا ہے۔',
  'IndicXlit (trained model)': 'IndicXlit (تربیت یافتہ ماڈل)',
  'Is it really free and unlimited? Do I need to log in?':
    'کیا یہ واقعی مفت اور لامحدود ہے؟ کیا لاگ اِن کرنا ضروری ہے؟',
  'Is my data private?': 'کیا میرا ڈیٹا نجی ہے؟',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    'یہ آپ کی منتخب کوالٹی، فائل کی لمبائی اور سروس کی مصروفیت پر منحصر ہے۔ سب سے تیز جلدی ہوتا ہے؛ بہترین درستگی میں سب سے زیادہ وقت لگتا ہے مگر سب سے کم غلطیاں ہوتی ہیں۔ پیش رفت اور باقی وقت لائیو دکھائے جاتے ہیں، اور اپنی باری کا انتظار کرنے والی فائل پر “قطار میں انتظار” نظر آتا ہے۔',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'یہ آپ کی ڈیوائس، آپ کی منتخب کوالٹی اور فائل کی لمبائی پر منحصر ہے۔ قابل گرافکس چپ (WebGPU) کے ساتھ یہ سب سے تیز ہے؛ ورنہ یہ پروسیسر (WebAssembly) پر چلتا ہے جو سست ہے۔ سب سے تیز جلدی ہوتا ہے؛ بہترین درستگی میں سب سے زیادہ وقت لگتا ہے مگر سب سے کم غلطیاں ہوتی ہیں۔ پیش رفت اور باقی وقت لائیو دکھائے جاتے ہیں۔',
  'It is now called “{title}”.': 'اب اس کا نام “{title}” ہے۔',
  'It may have been deleted.': 'ہو سکتا ہے اسے حذف کر دیا گیا ہو۔',
  'It was stopped before any text was found.': 'کوئی متن ملنے سے پہلے ہی اسے روک دیا گیا۔',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'اس کا ڈیٹا، بشمول یہ ٹرانسکرپٹ، حذف کر دیا گیا۔ ٹرانسکرپٹس صرف اسی سیشن کے لیے رکھے جاتے ہیں جس نے انہیں بنایا۔',
  'Job not found': 'ٹرانسکرپٹ نہیں ملا',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'ابھی ابھی',
  'Just the words, in paragraphs': 'صرف الفاظ، پیراگراف کی شکل میں',
  'Keep reading': 'مزید پڑھیں',
  'Keep this page open until the upload is done.': 'اپ لوڈ مکمل ہونے تک اس صفحے کو کھلا رکھیں۔',
  'Kept only for this session, then deleted automatically.':
    'صرف اس سیشن کے لیے رکھا جاتا ہے، پھر خود بخود حذف ہو جاتا ہے۔',
  Language: 'زبان',
  'Larger or longer files are refused before they are processed, so split them first.':
    'بڑی یا لمبی فائلیں پروسیس ہونے سے پہلے ہی مسترد کر دی جاتی ہیں، اس لیے انہیں پہلے تقسیم کریں۔',
  'Last updated: {date}': 'آخری تازہ کاری: {date}',
  'Licence text': 'لائسنس کا متن',
  Light: 'لائٹ',
  'Limits.': 'حدیں۔',
  'Line deleted': 'لائن حذف ہو گئی',
  'Live: the text appears here as it is recognised':
    'لائیو: متن پہچانے جانے کے ساتھ ہی یہاں نظر آتا ہے',
  'Loading model… (first use downloads it)':
    'ماڈل لوڈ ہو رہا ہے… (پہلے استعمال پر ڈاؤن لوڈ ہوتا ہے)',
  'Loading…': 'لوڈ ہو رہا ہے…',
  'Long (56 letters)': 'طویل (56 حروف)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'مفصل جوابات: فارمیٹس، سب ٹائٹلز، درستگی اور رازداری۔',
  Main: 'مرکزی',
  'Make a new transcript of the same file. This one is kept.':
    'اسی فائل کا نیا ٹرانسکرپٹ بنائیں۔ یہ والا برقرار رہتا ہے۔',
  'Make a subtitle file (SRT or VTT) from your video.':
    'اپنی ویڈیو سے سب ٹائٹل فائل (SRT یا VTT) بنائیں۔',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'مینو',
  Model: 'ماڈل',
  More: 'مزید',
  'More answers: [Frequently asked questions](/faq)':
    'مزید جوابات: [اکثر پوچھے جانے والے سوالات](/faq)',
  'More free tools': 'مزید مفت ٹولز',
  'More options': 'مزید اختیارات',
  'More than 50 languages': '50 سے زیادہ زبانیں',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    '50 سے زیادہ زبانیں، جن میں انگریزی، ہسپانوی، فرانسیسی، جرمن، پرتگالی، اطالوی، ڈچ، روسی، عربی، ہندی، چینی، جاپانی اور کورین شامل ہیں۔ زبان کو خودکار پہچان پر رہنے دیں یا خود منتخب کریں۔ آپ تقریر کا انگریزی میں ترجمہ بھی کر سکتے ہیں۔',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'زیادہ تر ٹرانسکرپشن ویب سائٹس آپ سے اکاؤنٹ بنانے کو کہتی ہیں، مفت منٹس محدود کرتی ہیں، واٹرمارک لگاتی ہیں یا متن کی ایک لائن دکھانے سے پہلے سبسکرپشن پر زور دیتی ہیں۔ {brand} اس کے برعکس کرتا ہے۔ اس کی ہر چیز سب کے لیے دستیاب ہے، اور صفحہ آپ کی فائل کے سوا کچھ نہیں مانگتا۔',
  'Name not changed': 'نام تبدیل نہیں ہوا',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    'آڈیو میں آنے والے نام، برانڈز اور مخصوص اصطلاحات، مثلاً Kubernetes، Dr. Okafor',
  'Near-best accuracy, much faster than Large': 'تقریباً بہترین درستگی، Large سے کہیں تیز',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'گرافکس ڈرائیور میں 16-بٹ شیڈر سپورٹ (shader-f16) درکار ہے',
  'needs 4 GB': '4 GB درکار ہے',
  'needs 8 GB': '8 GB درکار ہے',
  'needs a graphics-capable browser (Chrome, Edge)':
    'گرافکس کے قابل براؤزر درکار ہے (Chrome، Edge)',
  'needs WebGPU': 'WebGPU درکار ہے',
  'Next match': 'اگلا نتیجہ',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'نہ اکاؤنٹ، نہ ٹریکنگ۔ آپ کی فائلیں صرف آپ کے سیشن کے لیے رکھی جاتی ہیں اور خود بخود حذف ہو جاتی ہیں۔',
  'no estimate for this model here': 'اس ماڈل کے لیے یہاں اندازہ دستیاب نہیں',
  'No login': 'لاگ اِن کے بغیر',
  'No matches': 'کوئی نتیجہ نہیں ملا',
  'No microphone': 'مائیکروفون نہیں ہے',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'نہ سائن اَپ، نہ ادائیگی، نہ روزانہ کی حد۔ بس اپنی فائل شامل کریں۔',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'اس وقت سرور کی طرف سے سائز یا دورانیے کی کسی حد کا اعلان نہیں کیا گیا۔ بہت بڑی فائلوں میں بس زیادہ وقت لگتا ہے۔',
  'No speech was found in this file.': 'اس فائل میں کوئی تقریر نہیں ملی۔',
  'No speech was transcribed.': 'کوئی تقریر ٹرانسکرائب نہیں ہوئی۔',
  'No speech was transcribed. Check the recording and the selected language.':
    'کوئی تقریر ٹرانسکرائب نہیں ہوئی۔ ریکارڈنگ اور منتخب زبان چیک کریں۔',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'یہاں WebGPU نہیں ہے: ماڈلز ایک CPU تھریڈ پر چلتے ہیں، اس لیے بڑے سائز حقیقی وقت سے سست ہیں۔',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'کسی اور کی فائلیں آپ کی فائلوں سے آگے نہیں ہیں۔ اگر آپ کئی فائلیں شامل کریں تو وہ آپ کے ٹیب میں ایک کے بعد ایک ٹرانسکرائب ہوتی ہیں، اس لیے ان کے مکمل ہونے تک ٹیب کھلا رکھیں۔',
  'None of those are video or audio files.': 'ان میں سے کوئی بھی ویڈیو یا آڈیو فائل نہیں ہے۔',
  Normal: 'عام',
  'not available for this size': 'اس سائز کے لیے دستیاب نہیں',
  'not available in this browser': 'اس براؤزر میں دستیاب نہیں',
  'not available with Qwen (times are per chunk)':
    'Qwen کے ساتھ دستیاب نہیں (وقت ٹکڑوں کے حساب سے ہے)',
  'Not cancelled': 'منسوخ نہیں ہوا',
  'Not deleted': 'حذف نہیں ہوا',
  'Not renamed': 'نام تبدیل نہیں ہوا',
  'Not saved': 'محفوظ نہیں ہوا',
  Note: 'نوٹ',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'ابھی یہاں کچھ نہیں۔ آپ جو ٹرانسکرپٹس بنائیں گے وہ اس سیشن کے لیے یہاں نظر آئیں گے۔',
  'Nothing is saved. Export what you need.': 'کچھ محفوظ نہیں ہوتا۔ جو چاہیں ایکسپورٹ کر لیں۔',
  'Nothing is uploaded until you press Transcribe.':
    'ٹرانسکرائب کریں دبانے تک کچھ اپ لوڈ نہیں ہوتا۔',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'سائن اَپ کرنے یا ادائیگی کرنے کی ضرورت نہیں۔ بس اپنی فائل شامل کریں۔',
  'Nothing was recorded.': 'کچھ ریکارڈ نہیں ہوا۔',
  Off: 'بند',
  On: 'چالو',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'واضح تقریر پر، کسی معاون زبان میں، یہ عموماً بہت درست ہوتا ہے، لیکن کوئی بھی اسپیچ ریکگنیشن مکمل نہیں ہوتی۔ درستگی کا انحصار آڈیو کے معیار، لہجوں، پس منظر کے شور، ایک ساتھ بولنے والوں، موسیقی اور نادر ناموں یا مخصوص اصطلاحات پر ہوتا ہے۔ ہر لائن کا ایک اعتماد کا اسکور ہوتا ہے، اور کم اعتماد والی لائنوں پر نشان لگا ہوتا ہے تاکہ آپ انہیں پہلے جانچ سکیں۔ کسی بھی اہم مقصد کے لیے ٹرانسکرپٹ پر بھروسہ کرنے سے پہلے اسے ہمیشہ جانچ لیں۔',
  'Open menu': 'مینو کھولیں',
  'Opening your transcript…': 'آپ کا ٹرانسکرپٹ کھل رہا ہے…',
  'or drop it anywhere on this page.': 'یا اسے اس صفحے پر کہیں بھی چھوڑ دیں۔',
  'Original script': 'اصل رسم الخط',
  Output: 'آؤٹ پٹ',
  'Page {page} of {pages}': 'صفحہ {page} از {pages}',
  'Page not found': 'صفحہ نہیں ملا',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'ان فائلوں کے صفحات جو آپ کے پاس پہلے سے ہیں: WAV، M4A، WebM اور MOV۔',
  'PDF document (.pdf)': 'PDF دستاویز (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'PDF آپ کا براؤزر بناتا ہے: پرنٹ ڈائیلاگ میں “PDF کے طور پر محفوظ کریں” (Save as PDF) منتخب کریں۔',
  'Pick quality': 'کوالٹی منتخب کریں',
  'Plain text (.txt)': 'سادہ متن (.txt)',
  'Play from here': 'یہاں سے چلائیں',
  'Playback speed': 'پلے بیک کی رفتار',
  'Please add one file at a time here. You can add more files on the next page.':
    'یہاں ایک وقت میں ایک فائل شامل کریں۔ مزید فائلیں آپ اگلے صفحے پر شامل کر سکتے ہیں۔',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'براہِ کرم نجی ریکارڈنگز نہ بھیجیں۔ {brand} آپ کی فائلیں آپ ہی کی ڈیوائس پر ٹرانسکرائب کرتا ہے اور ہمیں وہ کبھی موصول نہیں ہوتیں، اس لیے آپ کی مدد کے لیے ہمیں ان کی ضرورت نہیں۔',
  'Please note': 'براہِ کرم نوٹ کریں',
  Preparing: 'تیاری ہو رہی ہے',
  'Preparing audio…': 'آڈیو تیار ہو رہا ہے…',
  'Preparing the audio…': 'آڈیو تیار ہو رہا ہے…',
  'Preparing…': 'تیاری ہو رہی ہے…',
  'Press a question to read its answer.': 'کسی سوال پر دبائیں تاکہ اس کا جواب پڑھ سکیں۔',
  'Previous match': 'پچھلا نتیجہ',
  'Print to PDF': 'PDF میں پرنٹ کریں',
  Privacy: 'رازداری',
  'Privacy and cookie settings': 'رازداری اور کوکی کی ترتیبات',
  'Privacy policy': 'رازداری کی پالیسی',
  'Privacy requests': 'رازداری سے متعلق درخواستیں',
  Private: 'نجی',
  Progress: 'پیش رفت',
  Quality: 'کوالٹی',
  'Questions about these terms:': 'ان شرائط کے بارے میں سوالات:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'سوالات، خرابیوں کی رپورٹ اور آئیڈیاز کا ہمیشہ خیر مقدم ہے۔ {email} پر لکھیں، یا کیا شامل کرنا ہے یہ جاننے کے لیے [رابطہ](/contact) صفحہ دیکھیں۔',
  Queued: 'قطار میں',
  'Quick results. Good for clear speech.': 'فوری نتائج۔ واضح تقریر کے لیے اچھا۔',
  Quickest: 'سب سے تیز',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'Qwen تخمینی ٹکڑوں کے ٹائم اسٹیمپ استعمال کرتا ہے۔ ہر لفظ کا وقت اور اعتماد دستیاب نہیں۔',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'Qwen ٹکڑوں کے ٹائم اسٹیمپ استعمال کرتا ہے اور ہر لفظ کا اعتماد فراہم نہیں کرتا۔ اسے چننے سے پہلے ایک مختصر نمونے کا موازنہ کر لیں۔',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (تجرباتی)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASR کو WebGPU والے ڈیسک ٹاپ براؤزر (Chrome یا Edge) اور گرافکس ڈرائیور میں 16-بٹ شیڈر سپورٹ (shader-f16) کی ضرورت ہے۔',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASR کو WebGPU والے ڈیسک ٹاپ براؤزر (Chrome یا Edge) اور 8 GB میموری کی ضرورت ہے۔',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASR کو WebGPU والے ڈیسک ٹاپ براؤزر (Chrome یا Edge) کی ضرورت ہے۔',
  'Re-transcribe': 'دوبارہ ٹرانسکرائب کریں',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'ٹرانسکرپٹ کو ٹائم اسٹیمپ کے ساتھ پڑھیں، دیکھیں کہ ماڈل کن الفاظ پر غیر یقینی تھا، اور انہیں وہیں درست کریں۔',
  'Read, edit, download': 'پڑھیں، ایڈٹ کریں، ڈاؤن لوڈ کریں',
  Ready: 'تیار',
  'Ready to print or share': 'پرنٹ یا شیئر کرنے کے لیے تیار',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    'آزمانے کے لیے تیار ہیں؟ [تمام مفت ٹولز دیکھیں](/tools) یا [ابھی ایک فائل ٹرانسکرائب کریں](/)۔',
  'Recognition engine': 'شناخت کا انجن',
  Recommended: 'تجویز کردہ',
  'Record from microphone': 'مائیکروفون سے ریکارڈنگ شروع کریں',
  'Record straight from your microphone and turn it into text.':
    'سیدھا اپنے مائیکروفون سے ریکارڈ کریں اور اسے متن میں بدل دیں۔',
  'Record with your microphone': 'مائیکروفون سے ریکارڈ کریں',
  'Recording {stamp}': 'ریکارڈنگ {stamp}',
  'Recording is not supported by this browser.': 'یہ براؤزر ریکارڈنگ کو سپورٹ نہیں کرتا۔',
  'Related reading': 'متعلقہ مطالعہ',
  Remove: 'ہٹائیں',
  'Remove {name}': '{name} ہٹائیں',
  'Removes it for good': 'اسے ہمیشہ کے لیے ہٹا دیتا ہے',
  Rename: 'نام تبدیل کریں',
  Renamed: 'نام تبدیل ہو گیا',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    '{n} لائنوں میں “{query}” کو “{replacement}” سے تبدیل کریں؟',
  'Replace "{query}" with "{replacement}" in 1 line?':
    '1 لائن میں “{query}” کو “{replacement}” سے تبدیل کریں؟',
  'Replace in {n} lines': '{n} لائنوں میں تبدیل کریں',
  'Replace in 1 line': '1 لائن میں تبدیل کریں',
  'Replace with': 'اس سے تبدیل کریں',
  'Replace with…': 'اس سے تبدیل کریں…',
  'Replace…': 'تبدیل کریں…',
  Replaced: 'تبدیل ہو گیا',
  'Reporting a problem': 'مسئلے کی اطلاع دینا',
  'Retrying…': 'دوبارہ کوشش ہو رہی ہے…',
  'Review language and quality': 'زبان اور کوالٹی دیکھیں',
  'Review this transcript': 'اس ٹرانسکرپٹ کا جائزہ لیں',
  Save: 'محفوظ کریں',
  Saved: 'محفوظ ہو گیا',
  'Saving…': 'محفوظ ہو رہا ہے…',
  'Search depth: {n}': 'تلاش کی گہرائی: {n}',
  'Search the text': 'متن میں تلاش کریں',
  'Search the transcript': 'ٹرانسکرپٹ میں تلاش کریں',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'یہ بھی دیکھیں: [استعمال کی شرائط](/terms)، [یہ کیسے کام کرتا ہے](/how-it-works) اور [اکثر پوچھے جانے والے سوالات](/faq)۔',
  'Server busy': 'سرور مصروف ہے',
  'Session only — nothing is saved.': 'صرف اس سیشن کے لیے - کچھ محفوظ نہیں ہوتا۔',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'صرف اس سیشن کے لیے - کچھ محفوظ نہیں ہوتا۔ ایپ بند کرنے سے تمام ٹرانسکرپٹس مٹ جاتے ہیں۔ جو چاہیں ایکسپورٹ کر لیں۔',
  'Session time left: about {n} min': 'سیشن کا باقی وقت: تقریباً {n} منٹ',
  'Short (32 letters)': 'مختصر (32 حروف)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'تقریر کو متن اور سب ٹائٹلز میں بدلنے کے بارے میں مختصر اور عملی جوابات: کون سا سب ٹائٹل فارمیٹ چنیں، ویڈیو میں سب ٹائٹلز کیسے شامل کریں، زیادہ درست ٹرانسکرپٹ کیسے حاصل کریں، اور فائل اپ لوڈ کیے بغیر ٹرانسکرپشن آپ کے اپنے براؤزر میں کیسے چل سکتی ہے۔',
  'Show all {count} languages': 'تمام {count} زبانیں دکھائیں',
  'Six ways to download': 'ڈاؤن لوڈ کرنے کے چھ طریقے',
  'Skip to main content': 'مرکزی مواد پر جائیں',
  Slower: 'سست',
  'slower than real time on the measured laptop': 'ناپے گئے لیپ ٹاپ پر حقیقی وقت سے سست',
  Slowest: 'سب سے سست',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'کچھ فیچرز استعمال کرنے پر اوپن سورس اجزاء آپ کے براؤزر میں ڈاؤن لوڈ کرتے ہیں۔ یہ باقی انجن کی طرح آپ کی ڈیوائس پر چلتے ہیں۔ ان کے لائسنس تقاضا کرتے ہیں کہ ہم یہ نوٹسز دکھائیں:',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    'کچھ حصوں کو سن کر جانچنے کی ضرورت ہے کیونکہ متن دہرایا گیا ہے یا تقریر کی حد غیر یقینی ہے۔',
  'Something went wrong': 'کچھ غلط ہو گیا',
  'Something went wrong in this browser. Please try again.':
    'اس براؤزر میں کچھ غلط ہو گیا۔ براہِ کرم دوبارہ کوشش کریں۔',
  'Something went wrong while reading this file.': 'اس فائل کو پڑھتے وقت کچھ غلط ہو گیا۔',
  'Source code': 'سورس کوڈ',
  Speed: 'رفتار',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'فونز اور ٹیبلٹس پر رفتار کا تخمینہ لگایا گیا ہے، ناپا نہیں گیا؛ tiny اور base محفوظ سائز ہیں۔',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'سب ٹائٹلز کے لیے SRT اور VTT، پڑھنے کے لیے TXT اور Markdown، پروگرامز کے لیے JSON، یا پرنٹ کرنے کے لیے PDF۔',
  Standard: 'معیاری',
  'Standard (42 letters)': 'معیاری (42 حروف)',
  Start: 'شروع کریں',
  'Start a new transcription': 'نئی ٹرانسکرپشن شروع کریں',
  'Start again': 'دوبارہ شروع کریں',
  'Started again': 'دوبارہ شروع ہو گیا',
  'Starting…': 'شروع ہو رہا ہے…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'ابھی کوئی سوال ہے؟ [اکثر پوچھے جانے والے سوالات](/faq) پڑھیں، [یہ کیسے کام کرتا ہے](/how-it-works) دیکھیں، یا [ہم سے رابطہ کریں](/contact)۔',
  'Still stuck? [Read How it works](/how-it-works)':
    'پھر بھی مسئلہ ہے؟ [یہ کیسے کام کرتا ہے پڑھیں](/how-it-works)',
  'Stop recording · {time}': 'ریکارڈنگ بند کریں - {time}',
  'Stop this transcription? The text found so far is kept.':
    'کیا یہ ٹرانسکرپشن روکیں؟ اب تک ملنے والا متن محفوظ رہتا ہے۔',
  'Stopping the transcription worker. The text found so far is kept.':
    'ٹرانسکرپشن ورکر کو روکا جا رہا ہے۔ اب تک ملنے والا متن محفوظ رہتا ہے۔',
  'Stored on this device only, never uploaded.': 'صرف اسی ڈیوائس پر محفوظ، کبھی اپ لوڈ نہیں ہوتا۔',
  'Style unchanged': 'انداز میں تبدیلی نہیں ہوئی',
  'Style updated': 'انداز اپ ڈیٹ ہو گیا',
  'Style updated using the saved recognition. Edited lines are kept.':
    'محفوظ شدہ شناخت کی بنیاد پر انداز اپ ڈیٹ ہو گیا۔ ایڈٹ کی ہوئی لائنیں برقرار رہتی ہیں۔',
  'Subtitle files': 'سب ٹائٹل فائلیں',
  'Subtitle line length': 'سب ٹائٹل لائن کی لمبائی',
  'Subtitles (.srt)': 'سب ٹائٹلز (.srt)',
  'Switch to dark theme': 'ڈارک تھیم پر جائیں',
  'Switch to light theme': 'لائٹ تھیم پر جائیں',
  Terms: 'شرائط',
  'Terms of use': 'استعمال کی شرائط',
  'Text with times (.txt)': 'وقت کے ساتھ متن (.txt)',
  'That file is already in the list.': 'یہ فائل پہلے سے فہرست میں موجود ہے۔',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'یہ ویڈیو یا آڈیو فائل نہیں ہے۔ MP4، MOV، MP3 یا کوئی اور ویڈیو یا آڈیو فائل منتخب کریں۔',
  'That is not a video or audio file. Please choose a video or audio file.':
    'یہ ویڈیو یا آڈیو فائل نہیں ہے۔ براہِ کرم کوئی ویڈیو یا آڈیو فائل منتخب کریں۔',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'یہ آڈیو فائل نہیں ہے۔ MP3، WAV، M4A یا کوئی اور آڈیو فائل منتخب کریں۔',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    '[رازداری کی پالیسی](/privacy) بتاتی ہے کہ کیا پروسیس ہوتا ہے اور کیوں۔ اپنے ڈیٹا کے بارے میں سوال پوچھنے یا اپنے حقوق استعمال کرنے کے لیے اسی پتے پر لکھیں۔',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    '{label} ماڈل اس ڈیوائس پر نہیں چل سکتا: {reason}۔ کوئی اور منتخب کریں۔',
  'the exact error message, or a screenshot of it.':
    'غلطی کا بالکل وہی پیغام، یا اس کا اسکرین شاٹ۔',
  'The file is larger than the server accepts.': 'فائل اس سائز سے بڑی ہے جو سرور قبول کرتا ہے۔',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'جب آپ پہلی بار کوئی کوالٹی لیول استعمال کرتے ہیں تو آپ کا براؤزر اس کا اسپیچ ماڈل ایک بار ڈاؤن لوڈ کرتا ہے اور اگلی بار کے لیے رکھ لیتا ہے، اس لیے بعد کی فائلیں جلدی شروع ہوتی ہیں۔',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'جب آپ پہلی بار کوئی کوالٹی لیول استعمال کرتے ہیں تو آپ کا براؤزر اسپیچ ماڈل Hugging Face سے اور انجن کی پروگرام فائلیں jsDelivr سے ڈاؤن لوڈ کرتا ہے، اور اگلی بار کے لیے رکھ لیتا ہے؛ ان کے ساتھ آپ کی فائل کا کچھ بھی نہیں بھیجا جاتا۔ ٹرانسکرپشن مکمل ہونے پر آپ کا براؤزر صفحے کے ہیڈر میں موجود گمنام کاؤنٹر میں ایک کا اضافہ کرتا ہے، اور بس۔',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'گرافکس ڈرائیور میں 16-بٹ شیڈرز نہیں ہیں: ڈاؤن لوڈز بڑے اور میموری کا استعمال زیادہ ہوتا ہے۔',
  'The line was removed.': 'لائن ہٹا دی گئی۔',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'مرکزی ٹولز: کسی بھی ویڈیو یا آڈیو فائل کو ٹائم اسٹیمپ والے ٹرانسکرپٹ میں بدلیں۔',
  'The page you are looking for does not exist or has moved.':
    'جو صفحہ آپ ڈھونڈ رہے ہیں وہ موجود نہیں یا منتقل ہو چکا ہے۔',
  'The recording failed. Please try again.': 'ریکارڈنگ ناکام ہو گئی۔ براہِ کرم دوبارہ کوشش کریں۔',
  'The server does not have enough free disk space for this file.':
    'سرور پر اس فائل کے لیے کافی خالی ڈسک اسپیس نہیں ہے۔',
  'The server is busy': 'سرور مصروف ہے',
  'The server is busy right now.': 'سرور ابھی مصروف ہے۔',
  'The service is busy right now. Please wait a moment and try again.':
    'سروس ابھی مصروف ہے۔ براہِ کرم ذرا انتظار کریں اور دوبارہ کوشش کریں۔',
  'The service is full right now. Please try again in a little while.':
    'سروس ابھی بھری ہوئی ہے۔ براہِ کرم تھوڑی دیر بعد دوبارہ کوشش کریں۔',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    'اسپیچ ریکگنیشن آپ کے اپنے براؤزر کے اندر چلتی ہے، اور اس کے لیے OpenAI Whisper جیسے اوپن اسپیچ ریکگنیشن ماڈلز استعمال ہوتے ہیں۔ آپ کا براؤزر ماڈل ایک بار ڈاؤن لوڈ کر کے رکھ لیتا ہے، پھر سارا کام آپ کی ڈیوائس پر ہوتا ہے۔ آپ کی ویڈیو یا آڈیو ہمارے پاس کبھی اپ لوڈ نہیں ہوتی، اور اسی لیے نہ فائل کے سائز کی کوئی حد ہے اور نہ دوسرے لوگوں کی فائلوں کی قطار۔ [یہ کیسے کام کرتا ہے](/how-it-works) صفحہ ہر قدم کی وضاحت کرتا ہے۔',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'بولی جانے والی زبان اعتماد کے ساتھ پہچانی نہیں جا سکی۔ جو زبان آپ سن رہے ہیں وہ منتخب کریں اور دوبارہ کوشش کریں۔',
  'The text found before it was stopped is shown below.':
    'روکے جانے سے پہلے جو متن ملا وہ نیچے دکھایا گیا ہے۔',
  'The text found so far is kept.': 'اب تک ملنے والا متن محفوظ رہتا ہے۔',
  'The text is ready to paste.': 'متن پیسٹ کرنے کے لیے تیار ہے۔',
  'The transcript finished before it could be cancelled.':
    'ٹرانسکرپٹ منسوخ کیے جانے سے پہلے ہی مکمل ہو گیا۔',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'ٹرانسکرپشن آپ کی اپنی ڈیوائس پر OpenAI Whisper جیسے اوپن اسپیچ ریکگنیشن ماڈلز کے ساتھ چلتی ہے۔ آپ کا براؤزر ماڈل ایک بار ڈاؤن لوڈ کر کے رکھ لیتا ہے، اس لیے اگلی فائل جلدی شروع ہوتی ہے، اور آپ کی ویڈیو یا آڈیو کہیں اپ لوڈ نہیں ہوتی۔',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'فائل کی قسم اور لمبائی، مثلاً “MP4، 25 منٹ”؛',
  'There is no size or length limit set here.': 'یہاں سائز یا لمبائی کی کوئی حد مقرر نہیں۔',
  'These details make a problem much quicker to find and fix:':
    'یہ تفصیلات مسئلہ ڈھونڈنے اور ٹھیک کرنے میں بہت وقت بچاتی ہیں:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    'ان شرائط پر بھارت کے قوانین لاگو ہوتے ہیں۔ ان سے پیدا ہونے والے کسی بھی تنازع پر بنگلورو، کرناٹک، بھارت کی عدالتوں کا خصوصی دائرہ اختیار ہے۔ اس سے وہ تحفظ ختم نہیں ہوتا جو آپ کو اپنے ملک کے لازمی صارف قوانین کے تحت حاصل ہے۔',
  'They are downloaded again the next time you transcribe.':
    'اگلی بار ٹرانسکرائب کرنے پر انہیں دوبارہ ڈاؤن لوڈ کیا جاتا ہے۔',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'Google سمیت تھرڈ پارٹی وینڈرز اس ویب سائٹ یا دیگر ویب سائٹس پر آپ کے پچھلے وزٹس کی بنیاد پر اشتہارات دکھانے کے لیے کوکیز استعمال کرتے ہیں۔ Google کے اشتہاری کوکیز کے استعمال سے وہ اور اس کے شراکت دار اس سائٹ اور/یا انٹرنیٹ پر دیگر سائٹس پر آپ کے وزٹ کی بنیاد پر آپ کو اشتہارات دکھا سکتے ہیں۔',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'یہ باکس MP3، WAV یا M4A جیسی آڈیو فائلیں لیتا ہے، لیکن وہ فائل ایک ویڈیو ہے۔',
  'This browser cannot record. Please choose a file instead.':
    'یہ براؤزر ریکارڈ نہیں کر سکتا۔ براہِ کرم اس کی جگہ کوئی فائل منتخب کریں۔',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'یہ براؤزر میموری کی اطلاع نہیں دیتا؛ {gb} GB فرض کی گئی ہے۔ اگر صفحہ سست ہو جائے تو چھوٹا ماڈل منتخب کریں۔',
  'This cannot be undone. Export anything you want to keep first.':
    'اسے واپس نہیں کیا جا سکتا۔ جو رکھنا چاہیں پہلے اسے ایکسپورٹ کر لیں۔',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '{brand} کی یہ کاپی آپ کے اپنے کمپیوٹر پر چلتی ہے۔ آپ کی فائلیں اسی مشین پر پروسیس ہوتی ہیں اور کچھ بھی اس سے باہر نہیں جاتا۔ کچھ بھی مستقل طور پر محفوظ نہیں ہوتا: ٹرانسکرپٹس صرف اسی سیشن کے لیے رہتے ہیں، اس لیے جو چاہیں ایکسپورٹ کر لیں۔ [رازداری کی پالیسی](/privacy) ہوسٹ کی گئی ویب سائٹ کو بیان کرتی ہے۔',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'یہ کاپی آپ کے اپنے کمپیوٹر پر چلتی ہے۔ آپ کی فائلیں اسی مشین پر پروسیس ہوتی ہیں اور کچھ بھی اس سے باہر نہیں جاتا۔',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'اس ڈیوائس میں اتنی لمبی فائل کے لیے میموری کم ہے۔ اسے چھوٹے ٹکڑوں میں پروسیس کیا جاتا ہے، جو سست ہے؛ مختصر کٹ یا چھوٹا ماڈل زیادہ محفوظ ہے۔',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'اس فائل کے لیے ایک 9 MB کنورٹر درکار ہے جو آپ کے براؤزر میں چلتا ہے۔ اسے لوڈ کریں؟',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'یہ سہولت کے لیے ترجمہ ہے۔ اگر یہ انگریزی ورژن سے مختلف ہو تو انگریزی ورژن ہی لاگو ہوگا۔',
  'This local copy does not count transcriptions': 'یہ مقامی کاپی ٹرانسکرپشنز کی گنتی نہیں کرتی',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'اس ٹرانسکرپٹ پر ماڈل کا اعتماد کم ہے۔ متن استعمال کرنے سے پہلے ریکارڈنگ سنیں اور بولی جانے والی زبان جانچ لیں۔',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'اس ڈیوائس پر اس میں {wait} لگیں گے (تخمینہ)۔ ختم ہونے تک ٹیب کھلا رکھیں۔',
  Timestamps: 'ٹائم اسٹیمپ',
  'Tips for the best results': 'بہترین نتائج کے لیے مشورے',
  'Tips for the best transcript': 'بہترین ٹرانسکرپٹ کے لیے مشورے',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'اپنی اشتہاری ترجیحات بدلنے کے لیے [Google اشتہارات کی ترتیبات](https://adssettings.google.com) یا اپنے براؤزر کی کوکی سیٹنگز استعمال کریں۔',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'اپنی اشتہاری ترجیحات بدلنے کے لیے اشتہارات دکھانے والے کسی بھی صفحے کے نیچے **رازداری اور کوکی کی ترتیبات**، [Google اشتہارات کی ترتیبات](https://adssettings.google.com) یا اپنے براؤزر کی کوکی سیٹنگز استعمال کریں۔',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'آپ کی مطلوبہ ٹرانسکرپشن آپ ہی کی ڈیوائس پر فراہم کرنے، ویب سائٹ کو محفوظ طریقے سے پہنچانے، اور اشتہارات کے ذریعے سروس کو مفت رکھنے کے لیے۔ جہاں GDPR جیسا ڈیٹا تحفظ کا قانون لاگو ہوتا ہے، وہاں ہماری قانونی بنیادیں یہ ہیں: آپ کی درخواست کردہ سروس فراہم کرنا (Art. 6(1)(b))، سیکیورٹی، غلط استعمال کی روک تھام اور گمنام مجموعی گنتی میں ہماری جائز دلچسپی (Art. 6(1)(f))، اور اشتہاری کوکیز کے لیے، جہاں قانون تقاضا کرتا ہے، آپ کی رضامندی (Art. 6(1)(a))، جو Google کا رضامندی کا پیغام مانگتا ہے۔',
  'To keep it fast for everyone, each file has a size and length limit.':
    'سب کے لیے تیز رکھنے کی خاطر ہر فائل کے سائز اور لمبائی کی ایک حد ہے۔',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    'جہاں تک قانون اجازت دیتا ہے، ہم بالواسطہ یا نتیجے کے طور پر ہونے والے نقصان، ڈیٹا، منافع یا کاروبار کے نقصان، یا سروس کے استعمال یا اس کے استعمال میں ناکامی یا ٹرانسکرپٹ میں غلطیوں سے پیدا ہونے والے کسی بھی نقصان کے ذمہ دار نہیں ہیں۔ ان شرائط میں کوئی بات اس ذمہ داری کو محدود نہیں کرتی جسے قانوناً محدود نہیں کیا جا سکتا۔',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'آپ کی ڈیوائس پر ٹرانسکرائب کرنے کے لیے آپ کا براؤزر اسپیچ ماڈل کی فائلیں Hugging Face (huggingface.co) سے اور اسپیچ انجن کی پروگرام فائلیں jsDelivr (cdn.jsdelivr.net) سے ڈاؤن لوڈ کرتا ہے، اور انہیں اگلی بار کے لیے اپنی کیش (Cache Storage) میں اس وقت تک رکھتا ہے جب تک آپ انہیں حذف نہ کر دیں۔ وہ فراہم کنندگان معمول کا درخواست ڈیٹا (آپ کا IP پتہ، آپ کا براؤزر اور کون سی فائل مانگی گئی) وصول کرتے ہیں، آپ کا میڈیا یا آپ کا ٹرانسکرپٹ کبھی نہیں۔',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'آپ کی ڈیوائس پر کام کرنے کے لیے آپ کا براؤزر Hugging Face سے اسپیچ ماڈلز اور jsDelivr سے پروگرام فائلیں ڈاؤن لوڈ کرتا ہے؛ وہ اپنے لائسنسز اور شرائط کے تحت فراہم کی جاتی ہیں۔ اشتہارات Google AdSense فراہم کرتا ہے؛ اشتہار ایک تھرڈ پارٹی ویب سائٹ پر لے جاتا ہے جس پر ہمارا کنٹرول نہیں اور جس کے ہم ذمہ دار نہیں۔',
  Transcribe: 'ٹرانسکرائب کریں',
  'Transcribe (same language)': 'ٹرانسکرائب (اسی زبان میں)',
  'Transcribe {n} files': '{n} فائلیں ٹرانسکرائب کریں',
  'Transcribe a file': 'ایک فائل ٹرانسکرائب کریں',
  'Transcribe or translate speech in the language you need.':
    'اپنی مطلوبہ زبان میں تقریر کو ٹرانسکرائب یا ترجمہ کریں۔',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    '50 سے زیادہ زبانوں میں ویڈیوز، آڈیو فائلیں اور وائس ریکارڈنگز ٹرانسکرائب کریں، یا زبان خود پہچاننے دیں۔',
  'Transcribing {n}%': 'ٹرانسکرپشن {n}%',
  'Transcribing takes {time} on this device.': 'اس ڈیوائس پر ٹرانسکرپشن میں {time} لگتے ہیں۔',
  'Transcribing…': 'ٹرانسکرائب ہو رہا ہے…',
  Transcript: 'ٹرانسکرپٹ',
  'Transcript name': 'ٹرانسکرپٹ کا نام',
  'Transcript not found': 'ٹرانسکرپٹ نہیں ملا',
  'Transcript ready': 'ٹرانسکرپٹ تیار ہے',
  'Transcript style': 'ٹرانسکرپٹ کا انداز',
  'Transcription failed': 'ٹرانسکرپشن ناکام ہو گئی',
  'Transcription has started. The text appears below as it is recognised.':
    'ٹرانسکرپشن شروع ہو گئی ہے۔ متن پہچانے جانے کے ساتھ ہی نیچے نظر آتا ہے۔',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'ٹرانسکرپشن شروع ہو گئی ہے۔ آپ کی دوسری فائلیں صفحے کے اوپر ٹرانسکرپٹس کے تحت ہیں۔',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    'ٹرانسکرپشن آپ کی ڈیوائس پر چلتی ہے اور اس کا پروسیسر، گرافکس چپ، میموری اور بیٹری استعمال کرتی ہے۔ ہم فائل کے سائز یا لمبائی کی کوئی حد مقرر نہیں کرتے، لیکن یہ کتنی تیز چلتی ہے اور آپ کا براؤزر کتنی بڑی فائل سنبھال سکتا ہے، یہ آپ کی ڈیوائس پر منحصر ہے: سست فون یا کمپیوٹر پر لمبی فائل میں بہت وقت لگ سکتا ہے یا میموری ختم ہو سکتی ہے۔ آپ کے ٹرانسکرپٹس اور فائلیں اس براؤزر میں رکھی جاتی ہیں اور {idle} غیر فعال رہنے کے بعد خود بخود حذف ہو جاتی ہیں۔ [رازداری کی پالیسی](/privacy) دیکھیں۔',
  'Transcription settings': 'ٹرانسکرپشن کی ترتیبات',
  Transcripts: 'ٹرانسکرپٹس',
  'Transcripts {n}': 'ٹرانسکرپٹس {n}',
  'Transcripts are only kept for the browser session that created them.':
    'ٹرانسکرپٹس صرف اسی براؤزر سیشن کے لیے رکھے جاتے ہیں جس نے انہیں بنایا۔',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    'ٹرانسکرپٹس خودکار طور پر بنائے جاتے ہیں اور ان میں غلطیاں ہوں گی، خاص طور پر شور والے آڈیو، تیز لہجوں، ایک ساتھ بولنے والوں، موسیقی، اور ناموں یا تکنیکی اصطلاحات کے ساتھ۔ ٹرانسکرپٹ پر بھروسہ کرنے سے پہلے اسے ہمیشہ جانچ لیں، خاص طور پر قانونی، طبی، مالی یا شائع شدہ استعمال کے لیے۔ سروس “جیسی ہے” اور “جیسی دستیاب ہے” کی بنیاد پر فراہم کی جاتی ہے، بغیر کسی صریح یا ضمنی ضمانت کے، بشمول درستگی، مکمل ہونے یا کسی خاص مقصد کے لیے موزوں ہونے کے بارے میں۔',
  'Translate to English': 'انگریزی میں ترجمہ کریں',
  'Try again': 'دوبارہ کوشش کریں',
  'Try another quality or language': 'کوئی اور کوالٹی یا زبان آزمائیں',
  'try to spread malware or anything meant to damage the service.':
    'میلویئر پھیلانے کی یا سروس کو نقصان پہنچانے کے لیے بنائی گئی کسی بھی چیز کی کوشش کرنا۔',
  'Trying again in a moment…': 'ذرا دیر میں دوبارہ کوشش ہو رہی ہے…',
  'Trying again. This page loads by itself as soon as the server is back.':
    'دوبارہ کوشش ہو رہی ہے۔ سرور واپس آتے ہی یہ صفحہ خود بخود لوڈ ہو جائے گا۔',
  'under a minute': 'ایک منٹ سے کم',
  'Underline unsure words': 'غیر یقینی الفاظ کے نیچے لکیر',
  Unlimited: 'لامحدود',
  'Unsure: worth listening to again': 'غیر یقینی: دوبارہ سننے کے قابل',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'اپ لوڈز کی غیر معمولی بھرمار پر ہو سکتا ہے کہ تھوڑا انتظار کرنے کو کہا جائے۔',
  'Up to {minutes} per file.': 'فی فائل {minutes} تک۔',
  'Up to {size} and {minutes} minutes per file.': 'فی فائل {size} اور {minutes} منٹ تک۔',
  'Up to {size} and {minutes} per file.': 'فی فائل {size} اور {minutes} تک۔',
  'Up to {size} per file.': 'فی فائل {size} تک۔',
  'Updated {date}': 'تازہ کاری: {date}',
  'Upload complete': 'اپ لوڈ مکمل',
  'Upload failed': 'اپ لوڈ ناکام ہو گیا',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'اپ لوڈ ناکام ہو گیا (سرور کی خرابی {status})۔ تفصیل کے لیے سرور چلانے والا ٹرمینل دیکھیں۔',
  'Upload failed (server error {status}). Please try again in a moment.':
    'اپ لوڈ ناکام ہو گیا (سرور کی خرابی {status})۔ براہِ کرم ذرا دیر میں دوبارہ کوشش کریں۔',
  Uploading: 'اپ لوڈ ہو رہا ہے',
  'Uploading…': 'اپ لوڈ ہو رہا ہے…',
  'use a computer for this size': 'اس سائز کے لیے کمپیوٹر استعمال کریں',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'ویب سائٹ یا اس کے کاؤنٹر کے خلاف ہماری تحریری اجازت کے بغیر اسکرپٹس، بوٹس یا دیگر خودکار ذرائع استعمال کرنا، یا من گھڑت گنتی بھیجنا؛',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'سروس کو ایسے مواد پر استعمال کرنا جو غیر قانونی ہو یا کسی اور کے حقوق کی خلاف ورزی کرتا ہو؛',
  'use the service to harass, harm or deceive others;':
    'سروس کو دوسروں کو ہراساں کرنے، نقصان پہنچانے یا دھوکا دینے کے لیے استعمال کرنا؛',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'واضح تقریر پر عموماً بہت درست۔ جن لائنوں پر یہ غیر یقینی ہو ان پر نشان لگا ہوتا ہے، تاکہ آپ انہیں پہلے جانچ سکیں۔',
  'Video and audio to text': 'ویڈیو اور آڈیو سے ٹیکسٹ',
  'Video or audio, several at once is fine.': 'ویڈیو یا آڈیو، ایک ساتھ کئی بھی چلتی ہیں۔',
  'Video to text, accurately.': 'ویڈیو سے ٹیکسٹ، درستگی کے ساتھ۔',
  'Video to text: transcribe a video or audio file':
    'ویڈیو سے ٹیکسٹ: ویڈیو یا آڈیو فائل ٹرانسکرائب کریں',
  'video transcribed': 'ویڈیو ٹرانسکرائب ہوئی',
  'videos transcribed': 'ویڈیوز ٹرانسکرائب ہوئیں',
  'Vocabulary hint': 'الفاظ کا اشارہ',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'وائس نوٹس، میٹنگز، لیکچرز، پوڈکاسٹس اور انٹرویوز۔',
  'Waiting for microphone permission…': 'مائیکروفون کی اجازت کا انتظار ہے…',
  'Waiting for the first words…': 'پہلے الفاظ کا انتظار ہے…',
  'Waiting in line…': 'قطار میں انتظار ہے…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'متن کو لائیو ظاہر ہوتے دیکھیں، کوئی غلطی ہو تو درست کریں، پھر اسے SRT، VTT، TXT، Markdown، JSON یا PDF میں ڈاؤن لوڈ کریں۔',
  'We do not ask for your name, e-mail address or any other account details.':
    'ہم آپ کا نام، ای میل پتہ یا اکاؤنٹ کی کوئی اور تفصیل نہیں مانگتے۔',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'ہم یہ وعدہ نہیں کرتے کہ سروس ہمیشہ دستیاب، بلا تعطل یا غلطیوں سے پاک رہے گی۔ ویب سائٹ، یا اس کے لیے درکار ڈاؤن لوڈز (Hugging Face سے اسپیچ ماڈلز اور jsDelivr سے پروگرام فائلیں)، دیکھ بھال کے لیے یا ہمارے قابو سے باہر وجوہات کی بنا پر دستیاب نہ ہوں، اور کچھ براؤزر یا ڈیوائسز ہر ماڈل نہیں چلا سکتے۔ چونکہ آپ کے ٹرانسکرپٹس صرف اس براؤزر میں رکھے جاتے ہیں اور غیر فعال رہنے کے بعد حذف ہو جاتے ہیں، اس لیے جو چاہیں ہمیشہ ایکسپورٹ کر لیں۔',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'ہم آپ کا ڈیٹا فروخت نہیں کرتے۔ ہمارے پاس آپ کی کوئی فائل یا ٹرانسکرپٹ نہیں ہوتا، اس لیے شیئر کرنے کو کچھ ہے ہی نہیں: شناخت آپ کی ڈیوائس پر ہوتی ہے، کسی بیرونی ٹرانسکرپشن یا AI سروس پر نہیں۔ Google (اشتہارات)، Cloudflare (ہوسٹنگ اور کاؤنٹر)، Hugging Face اور jsDelivr (ڈاؤن لوڈز) صرف وہی وصول کرتے ہیں جو اوپر بیان ہوا ہے۔ اگر قانون تقاضا کرے تو ہم معلومات ظاہر کر سکتے ہیں۔',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    'ہم آپ کا کچھ بھی اپنی طرف نہیں رکھتے: اس ایک مجموعی گنتی کے سوا، آپ کے استعمال کے بارے میں ہمارے پاس کچھ بھی محفوظ نہیں ہوتا۔',
  'We may block access if these rules are broken.':
    'اگر ان قواعد کی خلاف ورزی ہو تو ہم رسائی روک سکتے ہیں۔',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'ہم ان شرائط کو اپ ڈیٹ کر سکتے ہیں۔ نیا ورژن اس صفحے پر نئی “آخری تازہ کاری” کی تاریخ کے ساتھ ظاہر ہوتا ہے، اور اسی وقت سے لاگو ہوتا ہے۔',
  'We never send your file, your transcript or any personal information to Google.':
    'ہم آپ کی فائل، آپ کا ٹرانسکرپٹ یا کوئی ذاتی معلومات Google کو کبھی نہیں بھیجتے۔',
  'Web subtitles (.vtt)': 'ویب سب ٹائٹلز (.vtt)',
  'What people use it for': 'لوگ اسے کس لیے استعمال کرتے ہیں',
  'What you can do with it': 'آپ اس سے کیا کر سکتے ہیں',
  'What you get': 'آپ کو کیا ملتا ہے',
  'what you were doing, and what happened instead of what you expected;':
    'آپ کیا کر رہے تھے، اور جو توقع تھی اس کی جگہ کیا ہوا؛',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'آپ کی فائلیں کہاں پروسیس ہوتی ہیں یہ اس پر منحصر ہے کہ {brand} کیسے چلایا جاتا ہے، اور سرور نے ابھی جواب نہیں دیا۔ [رازداری کی پالیسی](/privacy) دیکھیں۔',
  'Where your files are processed depends on how {brand} is run.':
    'آپ کی فائلیں کہاں پروسیس ہوتی ہیں یہ اس پر منحصر ہے کہ {brand} کیسے چلایا جاتا ہے۔',
  'Which files can I use, and what are the limits?':
    'کون سی فائلیں استعمال کی جا سکتی ہیں، اور حدود کیا ہیں؟',
  'Which languages are supported?': 'کون سی زبانیں سپورٹ کی جاتی ہیں؟',
  'Who builds it': 'اسے کون بناتا ہے',
  'Who runs this website': 'یہ ویب سائٹ کون چلاتا ہے',
  'Why it exists': 'یہ کیوں موجود ہے',
  'Working…': 'کام جاری ہے…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'جی ہاں۔ یہ مفت ہے، اور کبھی کوئی اکاؤنٹ یا لاگ اِن نہیں۔ نہ روزانہ یا ماہانہ کوٹہ ہے اور نہ پے وال؛ اشتہارات ویب سائٹ کو مفت رکھتے ہیں۔',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'جی ہاں۔ یہ مفت ہے، اور کبھی کوئی اکاؤنٹ یا لاگ اِن نہیں۔ نہ روزانہ یا ماہانہ کوٹہ ہے اور نہ پے وال۔',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'جی ہاں۔ یہ مفت ہے، اور سائن اَپ کرنے یا لاگ اِن کرنے کی کوئی ضرورت نہیں۔ یہ کاپی آپ کے اپنے کمپیوٹر پر چلتی ہے، اس لیے نہ کوٹہ ہے اور نہ پے وال؛ یہ کتنی تیز کام کرتی ہے اس کا انحصار آپ کے کمپیوٹر پر ہے۔',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'جی ہاں۔ لائن کا متن بدلنے یا اسے حذف کرنے کے لیے اس کے ساتھ موجود پنسل استعمال کریں، یا پورے ٹرانسکرپٹ میں تلاش کریں اور تبدیل کریں۔ آپ کی ترامیم ہر ایکسپورٹ میں شامل ہوتی ہیں۔',
  'You agree not to:': 'آپ درج ذیل سے باز رہنے پر اتفاق کرتے ہیں:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'کنٹرول آپ کے ہاتھ میں ہے: **میرا ڈیٹا ابھی حذف کریں** کے ذریعے اپنے ٹرانسکرپٹس، فائلیں اور، اگر چاہیں، ڈاؤن لوڈ کیے گئے اسپیچ ماڈلز کو کسی بھی وقت حذف کر دیں۔ یہ صرف اسی براؤزر کا ڈیٹا حذف کرتا ہے؛ یہ Google کی کوکیز حذف نہیں کر سکتا۔',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'آپ اسے کسی بھی وقت اشتہارات دکھانے والے کسی بھی صفحے (مثلاً ہوم پیج) کے نیچے **رازداری اور کوکی کی ترتیبات** سے بدل سکتے ہیں۔',
  'You can now read, fix and download it.': 'اب آپ اسے پڑھ، درست اور ڈاؤن لوڈ کر سکتے ہیں۔',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'آپ کسی بھی وقت سروس کا استعمال بند کر سکتے ہیں اور **میرا ڈیٹا ابھی حذف کریں** سے اس براؤزر کا ڈیٹا حذف کر سکتے ہیں۔ ہم کسی بھی وقت آپ کی رسائی معطل یا ختم کر سکتے ہیں، خاص طور پر اگر آپ ان شرائط کی خلاف ورزی کریں۔',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'آپ جو فائلیں شامل کرتے ہیں اور ان سے بنائے گئے ٹرانسکرپٹس پر آپ کے تمام حقوق برقرار رہتے ہیں۔ وہ آپ کی ڈیوائس پر پروسیس ہوتے ہیں اور ہمیں وہ کبھی موصول نہیں ہوتے۔ آپ جو کچھ ٹرانسکرائب کرتے ہیں اس کی ذمہ داری آپ کی ہے: صرف وہی مواد استعمال کریں جس کے آپ مالک ہوں یا جسے پروسیس کرنے کا آپ کو حق ہو، بشمول اس میں بولنے والے لوگوں کی کوئی بھی ضروری اجازت۔',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'آپ [Google اشتہارات کی ترتیبات](https://adssettings.google.com) پر جا کر ذاتی نوعیت کے اشتہارات سے باہر نکل سکتے ہیں، یا [www.aboutads.info](https://www.aboutads.info) پر جا کر ذاتی نوعیت کے اشتہارات کے لیے کچھ تھرڈ پارٹی وینڈرز کے کوکیز کے استعمال سے باہر نکل سکتے ہیں۔ [Google ان سائٹس سے معلومات کیسے استعمال کرتا ہے جو اس کی سروسز استعمال کرتی ہیں](https://policies.google.com/technologies/partner-sites) کے بارے میں جانیں۔',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'آپ کا براؤزر اور اس کا ورژن، اور آپ کی ڈیوائس (کمپیوٹر یا فون، اور اس کا آپریٹنگ سسٹم)؛',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'آپ کے براؤزر نے یہاں کاپی کرنے سے روک دیا۔ اس کی جگہ متن محفوظ کرنے کے لیے ایکسپورٹ استعمال کریں۔',
  'Your change is saved.': 'آپ کی تبدیلی محفوظ ہو گئی۔',
  'Your change is still in its box: press Save to try again.':
    'آپ کی تبدیلی ابھی اپنے باکس میں موجود ہے: دوبارہ کوشش کرنے کے لیے محفوظ کریں دبائیں۔',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'آپ کی فائل ایک انکرپٹڈ کنکشن کے ذریعے سرور کو بھیجی جاتی ہے، OpenAI Whisper جیسے اوپن اسپیچ ریکگنیشن ماڈلز سے ٹرانسکرائب کی جاتی ہے، اور بعد میں خود بخود حذف کر دی جاتی ہے۔ [یہ کیسے کام کرتا ہے](/how-it-works) صفحہ ہر قدم کی وضاحت کرتا ہے۔',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'آپ کی فائل آپ ہی کی ڈیوائس پر آپ کے براؤزر میں ٹرانسکرائب ہوتی ہے، اس لیے ہم سائز یا لمبائی کی کوئی حد مقرر نہیں کرتے۔ بہت بڑی یا لمبی فائلیں بھی چلتی ہیں: ان میں زیادہ وقت لگتا ہے اور کافی خالی میموری درکار ہوتی ہے، اور جب آپ کی ڈیوائس سست ہو سکتی ہو تو صفحہ آپ کو خبردار کرتا ہے۔',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'آپ کی فائل OpenAI Whisper جیسے اوپن اسپیچ ریکگنیشن ماڈلز سے ٹرانسکرائب کی جاتی ہے اور بعد میں خود بخود حذف کر دی جاتی ہے۔',
  'Your file never leaves your device.': 'آپ کی فائل آپ کی ڈیوائس سے باہر نہیں جاتی۔',
  'Your file never leaves your device. [Privacy](/privacy)':
    'آپ کی فائل آپ کی ڈیوائس سے باہر نہیں جاتی۔ [رازداری](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'آپ کی فائل آپ کی ڈیوائس سے باہر نہیں جاتی۔ یہ اسی ڈیوائس پر آپ کے براؤزر میں ٹرانسکرائب ہوتی ہے اور نہ ہمیں اور نہ کسی اور کو اپ لوڈ کی جاتی ہے۔ ٹرانسکرپٹس، آپ کی ترامیم اور فائل صرف اس براؤزر کی اسٹوریج میں رکھے جاتے ہیں اور {idle} غیر فعال رہنے کے بعد خود بخود حذف ہو جاتے ہیں، یا ٹرانسکرپٹس مینو میں **میرا ڈیٹا ابھی حذف کریں** دبانے پر فوراً حذف ہو جاتے ہیں۔ کوئی اکاؤنٹ نہیں ہے۔ جانے سے پہلے جو چاہیں ایکسپورٹ کر لیں۔',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'آپ کی فائل آپ کی ڈیوائس سے باہر نہیں جاتی۔ یہ بغیر اکاؤنٹ کے سیدھے آپ کے براؤزر میں ٹرانسکرائب ہوتی ہے، اور آپ کے ٹرانسکرپٹس اسی براؤزر میں رہتے ہیں۔',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'آپ کی فائل اسی ڈیوائس پر رہتی ہے۔ ٹرانسکرپشن کے دوران اس ٹیب کو کھلا رکھیں۔',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'آپ کی فائلیں اور ٹرانسکرپٹس صرف اس سیشن کے لیے رکھے جاتے ہیں اور {idle} غیر فعال رہنے کے بعد، یا جب آپ “میرا ڈیٹا ابھی حذف کریں” دبائیں، خود بخود حذف ہو جاتے ہیں۔ کوئی اکاؤنٹ نہیں، کوئی ٹریکنگ نہیں، ایک ضروری سیشن کوکی۔ جانے سے پہلے جو چاہیں ایکسپورٹ کر لیں۔',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'آپ کی فائلیں اور ٹرانسکرپٹس صرف اس سیشن کے لیے رکھے جاتے ہیں اور سیشن ختم ہونے پر، یا جب آپ “میرا ڈیٹا ابھی حذف کریں” دبائیں، خود بخود حذف ہو جاتے ہیں۔ کوئی اکاؤنٹ نہیں، کوئی ٹریکنگ نہیں، ایک ضروری سیشن کوکی۔ جانے سے پہلے جو چاہیں ایکسپورٹ کر لیں۔',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'آپ کی فائلیں خود بخود حذف ہو جاتی ہیں۔ [رازداری](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'آپ کی فائلیں آپ کے براؤزر میں پروسیس ہوتی ہیں اور آپ کی ڈیوائس پر رہتی ہیں۔ ویب سائٹ، ڈاؤن لوڈز اور کاؤنٹر انکرپٹڈ کنکشنز (HTTPS) استعمال کرتے ہیں۔ جو کوئی اس براؤزر پروفائل کو استعمال کر سکتا ہے وہ اس میں محفوظ ٹرانسکرپٹس کو اس وقت تک دیکھ سکتا ہے جب تک وہ حذف نہ ہو جائیں، اس لیے مشترکہ کمپیوٹر پر **میرا ڈیٹا ابھی حذف کریں** دبائیں۔',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'آپ کی فائلیں ہمارے سرور پر اپ لوڈ کی جاتی ہیں تاکہ وہاں پروسیس ہو سکیں۔ وہ صرف آپ کے سیشن کے لیے رکھی جاتی ہیں اور سیشن ختم ہونے پر، {idle} غیر فعال رہنے کے بعد، یا ٹرانسکرپٹس مینو میں **میرا ڈیٹا ابھی حذف کریں** دبانے پر فوراً خود بخود حذف ہو جاتی ہیں۔ کوئی اکاؤنٹ نہیں اور کوئی ٹریکنگ نہیں، اور واحد کوکی ایک ضروری سیشن کوکی ہے (کوئی اینالیٹکس یا اشتہاری کوکیز نہیں)۔',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'آپ کی فائلیں ہمارے سرور پر اپ لوڈ کی جاتی ہیں تاکہ وہاں پروسیس ہو سکیں۔ وہ صرف آپ کے سیشن کے لیے رکھی جاتی ہیں اور سیشن ختم ہونے پر، یا ٹرانسکرپٹس مینو میں **میرا ڈیٹا ابھی حذف کریں** دبانے پر فوراً خود بخود حذف ہو جاتی ہیں۔ کوئی اکاؤنٹ نہیں اور کوئی ٹریکنگ نہیں، اور واحد کوکی ایک ضروری سیشن کوکی ہے (کوئی اینالیٹکس یا اشتہاری کوکیز نہیں)۔',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'آپ کی فائلیں اس ڈیوائس سے باہر نہیں جاتیں۔ ٹرانسکرپٹس صرف اس براؤزر میں رکھے جاتے ہیں اور {idle} غیر فعال رہنے کے بعد، یا جب آپ “میرا ڈیٹا ابھی حذف کریں” دبائیں، خود بخود حذف ہو جاتے ہیں۔ جانے سے پہلے جو چاہیں ایکسپورٹ کر لیں۔',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'آپ کی فائلیں اس ڈیوائس سے باہر نہیں جاتیں۔ ٹرانسکرپٹس صرف اس براؤزر میں رکھے جاتے ہیں اور سیشن ختم ہونے پر، یا جب آپ “میرا ڈیٹا ابھی حذف کریں” دبائیں، خود بخود حذف ہو جاتے ہیں۔ جانے سے پہلے جو چاہیں ایکسپورٹ کر لیں۔',
  'Your session ends in {mins} min. Export what you need.':
    'آپ کا سیشن {mins} منٹ میں ختم ہو جائے گا۔ جو چاہیں ایکسپورٹ کر لیں۔',
  'Your session has ended': 'آپ کا سیشن ختم ہو گیا ہے',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'آپ کا سیشن ختم ہو گیا ہے اور اس کا ڈیٹا حذف کر دیا گیا۔ آپ نئی ٹرانسکرپشن شروع کر سکتے ہیں۔',
  'Your transcript is ready below.': 'آپ کا ٹرانسکرپٹ نیچے تیار ہے۔',
  'Your transcripts': 'آپ کے ٹرانسکرپٹس',
  'Your transcripts and files were removed from the server.':
    'آپ کے ٹرانسکرپٹس اور فائلیں سرور سے ہٹا دی گئیں۔',
  'Your transcripts and files were removed from this device.':
    'آپ کے ٹرانسکرپٹس اور فائلیں اس ڈیوائس سے ہٹا دی گئیں۔',
  'title:/': 'مفت ویڈیو سے ٹیکسٹ ٹرانسکرپشن، بغیر لاگ اِن',
  'description:/':
    'ویڈیو سے ٹیکسٹ اور آڈیو سے ٹیکسٹ ٹرانسکرپشن مفت۔ نہ لاگ اِن، نہ روزانہ حد، 50+ زبانیں۔ ٹائم اسٹیمپ والا متن پائیں اور SRT، VTT، TXT، PDF ایکسپورٹ کریں۔',
  'title:/about': 'TranscribeVid کے بارے میں',
  'description:/about':
    'TranscribeVid کون بناتا ہے اور کیوں: سائن اَپ اور لاگ اِن کے بغیر ویڈیو اور آڈیو سے ٹیکسٹ کا مفت ٹول، صاف انٹرفیس کے ساتھ، جو اشتہارات سے چلتا ہے۔',
  'title:/audio-to-text': 'آڈیو سے ٹیکسٹ کنورٹر: مفت، لامحدود',
  'description:/audio-to-text':
    'پوڈکاسٹس، انٹرویوز اور لیکچرز کو ٹیکسٹ میں بدلیں۔ ٹائم اسٹیمپ، 50+ زبانوں اور بغیر لاگ اِن کے مفت کنورٹر۔ TXT، SRT، VTT یا PDF ڈاؤن لوڈ کریں۔',
  'label:/audio-to-text': 'آڈیو سے ٹیکسٹ',
  'title:/contact': 'رابطہ کریں',
  'description:/contact':
    'TranscribeVid سے رابطہ کیسے کریں: سوالات، خرابیوں کی رپورٹ، فیچر آئیڈیاز اور رازداری کی درخواستوں کے لیے ای میل، اور ویب سائٹ کون چلاتا ہے۔',
  'title:/faq': 'اکثر پوچھے جانے والے سوالات',
  'description:/faq':
    'TranscribeVid کے بارے میں عام سوالات کے جوابات: درستگی، زبانیں، سپورٹ کی جانے والی فائلیں اور حدود، رفتار، رازداری اور ایڈیٹنگ۔',
  'title:/guides': 'گائیڈز',
  'description:/guides':
    'ٹرانسکرپٹس اور سب ٹائٹلز پر عملی گائیڈز: SRT یا VTT، ویڈیو میں سب ٹائٹلز کیسے شامل کریں، درست ٹرانسکرپٹ کیسے حاصل کریں، اور نجی ٹرانسکرپشن۔',
  'title:/guides/accurate-transcripts': 'زیادہ درست ٹرانسکرپٹ کیسے حاصل کریں',
  'description:/guides/accurate-transcripts':
    'اسپیچ ٹو ٹیکسٹ کی درستگی بہتر کرنے کے عملی طریقے: صاف آڈیو، صحیح زبان اور ماڈل، الفاظ کا اشارہ، اور نتیجہ جانچنا اور درست کرنا۔',
  'label:/guides/accurate-transcripts': 'زیادہ درست ٹرانسکرپٹ کیسے حاصل کریں',
  'title:/guides/how-to-add-subtitles-to-a-video': 'ویڈیو میں سب ٹائٹلز کیسے شامل کریں (مفت)',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'چار مراحل میں سب ٹائٹلز بنائیں: ویڈیو ٹرانسکرائب کریں، متن درست کریں، SRT یا VTT ایکسپورٹ کریں، پھر فائل YouTube، VLC، ایڈیٹر یا ویب پلیئر میں شامل کریں۔',
  'label:/guides/how-to-add-subtitles-to-a-video': 'ویڈیو میں سب ٹائٹلز کیسے شامل کریں',
  'title:/guides/srt-vs-vtt': 'SRT بمقابلہ VTT: کون سا سب ٹائٹل فارمیٹ',
  'description:/guides/srt-vs-vtt':
    'SRT یا VTT؟ ہر سب ٹائٹل فارمیٹ کیا ہے، ان میں کیا فرق ہے، ہر ایک کہاں چلتا ہے، اور اپنی ویڈیو سے کوئی بھی فائل مفت کیسے حاصل کریں۔',
  'label:/guides/srt-vs-vtt': 'SRT بمقابلہ VTT',
  'title:/guides/transcribe-video-without-uploading': 'ویڈیو اپ لوڈ کیے بغیر ٹرانسکرائب کریں',
  'description:/guides/transcribe-video-without-uploading':
    'براؤزر میں ٹرانسکرپشن کیسے کام کرتی ہے، آپ کی ڈیوائس پر کیا رہتا ہے، کیا ایک بار ڈاؤن لوڈ ہوتا ہے، اور براؤزر کے نیٹ ورک پینل میں خود کیسے جانچیں۔',
  'label:/guides/transcribe-video-without-uploading': 'ویڈیو کو اپ لوڈ کیے بغیر ٹرانسکرائب کریں',
  'title:/guides/what-is-whisper': 'Whisper کیا ہے؟ اسپیچ ٹو ٹیکسٹ کی وضاحت',
  'description:/guides/what-is-whisper':
    'OpenAI Whisper کیا ہے، اسے کس پر تربیت دی گئی، یہ کتنا درست ہے اور کہاں مشکل میں پڑتا ہے، اور TranscribeVid پر یہ آپ کے براؤزر میں کیسے چلتا ہے۔',
  'label:/guides/what-is-whisper': 'Whisper کیا ہے؟',
  'title:/how-it-works': 'یہ کیسے کام کرتا ہے',
  'description:/how-it-works':
    'TranscribeVid تین آسان مراحل میں ویڈیو اور آڈیو کو درست، ٹائم اسٹیمپ والے ٹیکسٹ میں کیسے بدلتا ہے، آپ کو کیا ملتا ہے، اور بہترین نتائج کے مشورے۔',
  'title:/interview-transcription': 'انٹرویو ٹرانسکرپشن: نجی اور مفت',
  'description:/interview-transcription':
    'اکاؤنٹ بنائے بغیر انٹرویوز مفت ٹرانسکرائب کریں۔ 50+ زبانوں میں ٹائم اسٹیمپ والا متن، تحقیق، صحافت اور بھرتی کے لیے۔ TXT یا PDF ڈاؤن لوڈ کریں۔',
  'label:/interview-transcription': 'انٹرویو کی ٹرانسکرپشن',
  'title:/lecture-to-text': 'لیکچر سے ٹیکسٹ: مفت لیکچر ٹرانسکرائبر',
  'description:/lecture-to-text':
    'ریکارڈ شدہ لیکچر کو ایسے ٹیکسٹ نوٹس میں بدلیں جنہیں آپ تلاش اور مطالعہ کر سکیں۔ مفت، بغیر لاگ اِن، 50+ زبانیں۔ TXT، Markdown، SRT یا PDF ڈاؤن لوڈ کریں۔',
  'label:/lecture-to-text': 'لیکچر سے ٹیکسٹ',
  'title:/m4a-to-text': 'M4A سے ٹیکسٹ: وائس میمو مفت ٹرانسکرائب کریں',
  'description:/m4a-to-text':
    'M4A وائس میمو یا ریکارڈنگ کو مفت ٹیکسٹ میں بدلیں۔ iPhone وائس میموز کے ساتھ کام کرتا ہے، بغیر لاگ اِن، 50+ زبانیں، ٹائم اسٹیمپ۔ TXT، SRT، VTT یا PDF۔',
  'label:/m4a-to-text': 'M4A سے ٹیکسٹ',
  'title:/meeting-recording-to-text': 'Zoom، Teams اور Meet ریکارڈنگ سے ٹیکسٹ',
  'description:/meeting-recording-to-text':
    'Zoom، Teams یا Google Meet کی ریکارڈنگ کو تلاش کے قابل، ٹائم اسٹیمپ والے ٹرانسکرپٹ میں مفت بدلیں۔ بغیر لاگ اِن، 50+ زبانیں۔ TXT، SRT، VTT یا PDF۔',
  'label:/meeting-recording-to-text': 'میٹنگ ریکارڈنگ سے ٹیکسٹ',
  'title:/mov-to-text': 'MOV سے ٹیکسٹ: iPhone ویڈیوز مفت ٹرانسکرائب',
  'description:/mov-to-text':
    'اپنے iPhone یا QuickTime کی MOV ویڈیو مفت ٹرانسکرائب کریں۔ بغیر لاگ اِن، 50+ زبانیں، ہر لائن پر ٹائم اسٹیمپ۔ TXT، SRT، VTT یا PDF ڈاؤن لوڈ کریں۔',
  'label:/mov-to-text': 'MOV سے ٹیکسٹ',
  'title:/mp3-to-text': 'MP3 سے ٹیکسٹ کنورٹر: مفت ٹرانسکرپٹس',
  'description:/mp3-to-text':
    'MP3 کو آن لائن مفت ٹیکسٹ میں ٹرانسکرائب کریں۔ بغیر لاگ اِن، 50+ زبانیں، ہر لائن پر ٹائم اسٹیمپ۔ متن ایڈٹ کریں اور TXT، SRT، VTT یا PDF ڈاؤن لوڈ کریں۔',
  'label:/mp3-to-text': 'MP3 سے ٹیکسٹ',
  'title:/mp4-to-text': 'MP4 سے ٹیکسٹ: MP4 ویڈیوز مفت ٹرانسکرائب',
  'description:/mp4-to-text':
    'MP4 ویڈیو کو ٹائم اسٹیمپ کے ساتھ ٹیکسٹ میں بدلیں۔ مفت، بغیر لاگ اِن، بغیر روزانہ حد، 50+ زبانیں۔ TXT، SRT، VTT، Markdown، JSON یا PDF ڈاؤن لوڈ کریں۔',
  'label:/mp4-to-text': 'MP4 سے ٹیکسٹ',
  'title:/podcast-transcript-generator': 'مفت پوڈکاسٹ ٹرانسکرپٹ جنریٹر',
  'description:/podcast-transcript-generator':
    'MP3 یا WAV سے پوڈکاسٹ ٹرانسکرپٹ مفت بنائیں۔ ٹائم اسٹیمپ، 50+ زبانیں، بغیر لاگ اِن۔ اسے ایڈٹ کریں، پھر TXT، Markdown، SRT، VTT یا PDF ڈاؤن لوڈ کریں۔',
  'label:/podcast-transcript-generator': 'پوڈکاسٹ ٹرانسکرپٹ جنریٹر',
  'title:/privacy': 'رازداری کی پالیسی',
  'description:/privacy':
    'TranscribeVid فائل ٹرانسکرائب کرتے وقت کیا پروسیس کرتا ہے اور کہاں، کیوں، کتنی دیر رکھتا ہے، کوکیز، اشتہارات اور براؤزر اسٹوریج، اور آپ کے حقوق۔',
  'title:/srt-subtitle-generator': 'ویڈیو سے مفت SRT سب ٹائٹل جنریٹر',
  'description:/srt-subtitle-generator':
    'کسی بھی ویڈیو یا آڈیو سے SRT سب ٹائٹل فائل مفت بنائیں۔ تقریر کے مطابق وقت، 50+ زبانیں، بغیر لاگ اِن۔ لائنیں ایڈٹ کریں، پھر SRT یا VTT ڈاؤن لوڈ کریں۔',
  'label:/srt-subtitle-generator': 'SRT سب ٹائٹل جنریٹر',
  'title:/terms': 'استعمال کی شرائط',
  'description:/terms':
    'TranscribeVid کے استعمال کے قواعد: مفت سروس، آپ کا مواد، قابل قبول استعمال، فائل کی حدیں، ٹرانسکرپٹ کی درستگی پر کوئی ضمانت نہیں، اور ذمہ داری۔',
  'title:/tools': 'تمام مفت ٹولز',
  'description:/tools':
    'ویڈیو اور آڈیو سے ٹیکسٹ کے تمام مفت ٹولز ایک فہرست میں: فائل کی قسم، استعمال، سب ٹائٹل فائلوں اور زبانوں کے لحاظ سے۔ بغیر لاگ اِن، 50+ زبانیں۔',
  'title:/translate-audio-to-english': 'تقریر کو انگریزی ٹیکسٹ میں بدلیں، مفت',
  'description:/translate-audio-to-english':
    'دوسری زبان کی تقریر کو مفت انگریزی ٹیکسٹ میں بدلیں۔ ویڈیو یا آڈیو فائل اپ لوڈ کریں، ٹائم اسٹیمپ والا انگریزی متن یا سب ٹائٹلز پائیں۔ SRT، VTT، TXT۔',
  'label:/translate-audio-to-english': 'تقریر کا انگریزی میں ترجمہ',
  'title:/video-to-text': 'مفت ویڈیو سے ٹیکسٹ کنورٹر، بغیر لاگ اِن',
  'description:/video-to-text':
    'ویڈیو کو مفت ٹیکسٹ میں بدلیں۔ 50+ زبانوں میں درست، ٹائم اسٹیمپ والا ٹرانسکرپٹ پائیں۔ بغیر لاگ اِن، بغیر روزانہ حد۔ SRT، VTT، TXT یا PDF ڈاؤن لوڈ کریں۔',
  'label:/video-to-text': 'ویڈیو سے ٹیکسٹ',
  'title:/voice-recording-to-text': 'وائس ریکارڈنگ سے ٹیکسٹ: مفت ٹرانسکرائبر',
  'description:/voice-recording-to-text':
    'براؤزر میں اپنی آواز ریکارڈ کریں یا وائس میمو اپ لوڈ کریں اور اسے ٹیکسٹ میں پائیں۔ مفت، بغیر لاگ اِن، 50+ زبانیں۔ TXT، PDF، SRT یا Markdown۔',
  'label:/voice-recording-to-text': 'وائس ریکارڈنگ سے ٹیکسٹ',
  'title:/vtt-subtitle-generator': 'مفت VTT (WebVTT) سب ٹائٹل جنریٹر',
  'description:/vtt-subtitle-generator':
    'کسی بھی ویڈیو یا آڈیو سے WebVTT (.vtt) سب ٹائٹل فائل مفت بنائیں۔ تقریر کے مطابق وقت، 50+ زبانیں، بغیر لاگ اِن۔ لائنیں ایڈٹ کریں، پھر VTT ڈاؤن لوڈ کریں۔',
  'label:/vtt-subtitle-generator': 'VTT سب ٹائٹل جنریٹر',
  'title:/wav-to-text': 'WAV سے ٹیکسٹ: مفت آن لائن ٹرانسکرپشن',
  'description:/wav-to-text':
    'WAV فائل کو مفت ٹیکسٹ میں بدلیں۔ فیلڈ ریکارڈرز اور کالز کی لمبی ریکارڈنگز سنبھالتا ہے، 50+ زبانیں، ٹائم اسٹیمپ، بغیر لاگ اِن۔ TXT، SRT یا PDF۔',
  'label:/wav-to-text': 'WAV سے ٹیکسٹ',
  'title:/webm-to-text': 'WebM سے ٹیکسٹ: مفت، بغیر لاگ اِن',
  'description:/webm-to-text':
    'WebM ویڈیو یا آڈیو فائل کو مفت ٹیکسٹ میں بدلیں۔ اسکرین اور براؤزر ریکارڈنگز کے ساتھ کام کرتا ہے، 50+ زبانیں، ٹائم اسٹیمپ۔ TXT، SRT، VTT یا PDF۔',
  'label:/webm-to-text': 'WebM سے ٹیکسٹ',
  'title:/whatsapp-voice-message-to-text': 'WhatsApp وائس میسج سے ٹیکسٹ، مفت',
  'description:/whatsapp-voice-message-to-text':
    'WhatsApp وائس میسج کو مفت ٹیکسٹ میں بدلیں۔ وائس نوٹ محفوظ کریں، ڈراپ کریں، ہندی سمیت 50+ زبانوں میں پڑھیں۔ بغیر لاگ اِن، بغیر اکاؤنٹ۔',
  'label:/whatsapp-voice-message-to-text': 'WhatsApp وائس میسج سے ٹیکسٹ',
  'title:/youtube-subtitle-generator': 'YouTube سب ٹائٹل جنریٹر: مفت SRT فائل',
  'description:/youtube-subtitle-generator':
    'اپنی YouTube ویڈیو کے لیے SRT سب ٹائٹل فائل بنائیں، مفت اور لاگ اِن کیے بغیر۔ تقریر کے مطابق وقت، 50+ زبانیں۔ اسے YouTube Studio میں اپ لوڈ کریں۔',
  'label:/youtube-subtitle-generator': 'YouTube سب ٹائٹل جنریٹر',
};

export default dict;
