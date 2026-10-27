/** Arabic dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
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
  '.': '.',
  '"{name}" is {size}; the limit is {limit}.': '«{name}» حجمه {size}، والحد الأقصى هو {limit}.',
  '"{name}" is empty.': '«{name}» فارغ.',
  '"{name}" is ready. Press Transcribe to start.': '«{name}» جاهز. اضغط «ابدأ التفريغ» للبدء.',
  '“{title}” was deleted.': 'تم حذف «{title}».',
  '(optional)': '(اختياري)',
  '{base} Word timing: {timing}.': '{base} توقيت الكلمات: {timing}.',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    'يُشغّل {brand} ({domain}) **{name}**، {address} («نحن»). نحن من يقرر كيف تُعالَج بياناتك ولماذا، كما هو موضح هنا.',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    'يُدير {brand} ({domain}) **{name}**، {address}. اقرأ المزيد في صفحة [من نحن](/about).',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand} خدمة موجّهة إلى الجمهور العام، وليست موجّهة إلى الأطفال دون سن 13 عامًا (أو دون 16 عامًا في الاتحاد الأوروبي حيثما ينطبق ذلك).',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    'أنشأ {brand} ويديره **{name}**، {role} مقيم في {city}. بنيته ليمنح الناس أفضل تجربة تفريغ ممكنة: سلسة منذ النقرة الأولى، دون حساب يجب إنشاؤه، وبواجهة نظيفة لا تعترض طريقك.',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} موجّه إلى الجمهور العام، وليس موجّهًا إلى الأطفال دون سن 13 عامًا.',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages) and beside a finished transcript. No ad is shown while a file is being transcribed, and never on the privacy, terms or logs pages.':
    '{brand} مجاني لأنه يعرض إعلانات تقدّمها Google AdSense. تظهر الإعلانات في صفحات المعلومات فقط (الرئيسية، وكيف يعمل، والأسئلة الشائعة، وصفحات الأدوات) وبجوار التفريغ المكتمل. لا يُعرض أي إعلان أثناء تفريغ ملف، ولا يظهر أبدًا في صفحات الخصوصية أو الشروط أو السجلات.',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    'استخدام {brand} مجاني. توضّح [سياسة الخصوصية](/privacy) ما يحدث لملفاتك.',
  '{brand} is funded by ads shown on its information pages and beside finished transcripts (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    'يُموَّل {brand} بإعلانات تظهر في صفحات المعلومات وبجوار التفريغات المكتملة (Google AdSense). ولأن جهازك هو الذي يتولى التفريغ، لا تترتب أي تكلفة خادم على كل ملف، وهذا ما يُبقي الخدمة مجانية وبلا حدود. توضّح [سياسة الخصوصية](/privacy) ما تستخدمه الإعلانات وكيف تختار إعداداتك.',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    'يحوّل {brand} الكلام في ملف فيديو أو صوت إلى نص بطوابع زمنية، في ثلاث خطوات بسيطة.',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    'يحوّل {brand} الكلام في مقاطع الفيديو والملفات الصوتية والتسجيلات الصوتية إلى نص دقيق مزوّد بطوابع زمنية. وهو مجاني، ولا حدّ لعدد الملفات التي تفرّغها، ولا تحتاج إلى حساب: اختر ملفًا بالأعلى، واضغط «ابدأ التفريغ»، ثم اقرأ النتيجة.',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages and beside finished transcripts (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    'يحوّل {brand} ملفات الفيديو والصوت إلى نص داخل متصفحك مباشرة: يجري التعرّف على الكلام على جهازك، ولا تُرفع ملفاتك إلينا. الاستخدام مجاني ولا يتطلب حسابًا. ويُموَّل بإعلانات في صفحات المعلومات وبجوار التفريغات المكتملة (Google AdSense؛ راجع [سياسة الخصوصية](/privacy)). وقد نغيّر الميزات أو نقيّدها أو نوقفها في أي وقت.',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    'يحوّل {brand} الفيديو والصوت إلى نص دقيق بطوابع زمنية مجانًا. لا تسجيل ولا تسجيل دخول ولا علامة مائية: افتح الصفحة، واختر ملفًا، واقرأ التفريغ.',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies.':
    'يحوّل {brand} الفيديو والصوت إلى نص داخل متصفحك مباشرة. تشرح هذه الصفحة بكلمات بسيطة ما يعنيه ذلك لبياناتك. باختصار: ملفك لا يغادر جهازك أبدًا. وتُحفظ تفريغاتك في هذا المتصفح فقط، ولا يوجد حساب، ولا يضع الموقع أي ملفات تعريف ارتباط خاصة به. وتظهر الإعلانات في صفحات المعلومات وبجوار التفريغات المكتملة فقط، وتقدّمها Google التي تستخدم ملفات تعريف الارتباط.',
  '{done} of {total}': '{done} من {total}',
  '{duration} (estimate)': '{duration} (تقدير)',
  '{gb} GB of memory recommended': 'يُوصى بذاكرة {gb} GB',
  '{h} h': '{h} س',
  '{h} h {m} min': '{h} س {m} د',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)': '{label} (أول استخدام يُنزّل {size} MB)',
  "{label}, as reported by visitors' browsers": '{label}، كما تُبلغ عنه متصفحات الزوّار',
  '{label}: common questions': '{label}: أسئلة شائعة',
  '{label}. {title}.': '{label}. {title}.',
  '{label}. Look for it in your downloads.': '{label}. ابحث عنه في التنزيلات.',
  '{language} → English': '{language} إلى الإنجليزية',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} أُضيف {done} من أصل {total} ملف إلى الطابور بالفعل؛ أما الباقي ({left}) فما زال في القائمة، اضغط «ابدأ التفريغ» لإعادة المحاولة.',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} أُضيف {done} من أصل {total} ملف إلى الطابور بالفعل؛ أما الملف الباقي ({left}) فما زال في القائمة، اضغط «ابدأ التفريغ» لإعادة المحاولة.',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    'يعمل {model} على هذا الجهاز بسرعة أقل من زمن التسجيل نفسه: {wait} لكل {audio} من الصوت (تقدير). تنتهي النماذج Tiny أو Base أسرع.',
  '{n} files were skipped: not video or audio.': 'تم تخطّي {n} من الملفات: ليست فيديو أو صوتًا.',
  '{n} h ago': 'قبل {n} س',
  '{n} min': '{n} د',
  '{n} min ago': 'قبل {n} د',
  '{n} min left': 'متبقي {n} د',
  '{n} min read': 'قراءة {n} د',
  '{n} minute': '{n} دقيقة',
  '{n} minutes': '{n} دقيقة',
  '{n} of {total}': '{n} من {total}',
  '{n} of those files are already in the list.': '{n} من هذه الملفات موجودة بالفعل في القائمة.',
  '{n} video transcribed': 'تم تفريغ {n} فيديو',
  '{n} videos transcribed': 'تم تفريغ {n} فيديو',
  '{n} words': '{n} كلمة',
  '{n}% done': 'اكتمل {n}%',
  '{n}% model confidence': 'ثقة النموذج {n}%',
  '{n}s left': 'متبقي {n} ث',
  '{name} home': '{name}: الصفحة الرئيسية',
  '{size} download': 'تنزيل بحجم {size}',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}.',
  '{title}. {blurb}': '{title}. {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}. {blurb} غير متاح على هذا الجهاز: {reason}.',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**سجل تقني في هذا التبويب.** تعرض صفحة السجلات السجل التقني الخاص بهذا التبويب. ويبقى في متصفحك ولا يُرسل إلى أي جهة.',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**أضف تلميح مفردات**: الأسماء والعلامات التجارية والمصطلحات المتخصصة التي ترد في الصوت، مكتوبة بالطريقة التي تريدها.',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**أضف تلميح مفردات**: الأسماء والعلامات التجارية والمصطلحات المتخصصة، مكتوبة بالطريقة التي تريدها.',
  '**Ads.** Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed.':
    '**الإعلانات.** تظهر الإعلانات في صفحات المعلومات وبجوار التفريغات المكتملة فقط، وتقدّمها Google التي تستخدم ملفات تعريف الارتباط. ولا يُعرض أي إعلان أثناء تفريغ ملف.',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**راجع الأسطر المعلَّمة** وصحّحها في محرّر التفريغ.',
  '**Choose the spoken language** instead of auto-detect.':
    '**اختر اللغة المنطوقة** بدلًا من الاكتشاف التلقائي.',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**اختر ملفك.** أفلِت ملف فيديو أو صوت بالأعلى، أو اختر ملفًا من جهازك، أو سجّل صوتك بالميكروفون. تعمل صيغ MP4 وMOV وMKV وWebM وAVI وMP3 وWAV وM4A وFLAC وOGG ومعظم الصيغ الشائعة الأخرى.',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**تحسين الصوت** — تصفية الدمدمة والفحيح وموازنة المتحدثين منخفضي الصوت',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**حدود الملفات.** لا نضع أي حدود. تتم معالجة ملفك على جهازك، لذا تستغرق الملفات الكبيرة جدًا أو الطويلة وقتًا أطول وتحتاج إلى ذاكرة حرة كافية؛ وتحذّرك الصفحة إذا كان جهازك بطيئًا.',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**أنواع الملفات.** الفيديو: MP4 وMKV وMOV وAVI وWEBM وWMV وFLV وM4V و3GP وTS وMTS. الصوت: MP3 وWAV وM4A وAAC وFLAC وOGG وOPUS. ويمكنك أيضًا التسجيل مباشرة من الميكروفون.',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**ملفات تعريف الارتباط الخاصة بـ Google.** تضع Google ملفات تعريف الارتباط الخاصة بها عند تحميل الإعلانات، في الصفحات التي تعرض إعلانات فقط (انظر القسم 6).',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**المحاضرات والبودكاست** محوّلة إلى نص مقروء للدراسة أو لملاحظات الحلقة.',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**الحدود.** لا يعلن الخادم حاليًا عن أي حد للحجم أو المدة. الملفات الكبيرة جدًا تستغرق وقتًا أطول فقط.',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**الحدود.** لا نضع أي حد للحجم أو المدة: تتم معالجة ملفك على جهازك، لذا تستغرق الملفات الكبيرة جدًا أو الطويلة وقتًا أطول وتحتاج إلى ذاكرة حرة كافية. وعلى الأجهزة الأبطأ تخبرك الصفحة قبل أن تبدأ وتقدّر الوقت.',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**الوسائط التي تضيفها.** ملفات الفيديو أو الصوت التي تختارها أو تسجّلها. تتم معالجتها في متصفحك على جهازك (باستخدام WebGPU أو WebAssembly). ولا يُرفع ملفك إلى خوادمنا أبدًا ولا يُرسل إلى Google أو إلى أي جهة أخرى.',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**ملاحظات الاجتماعات والمقابلات** التي يمكنك البحث فيها والاقتباس منها ومشاركتها.',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**الأخطاء واردة.** لا يوجد نظام تعرّف على الكلام يخلو من الأخطاء. تحقّق دائمًا من التفريغ قبل الاعتماد عليه في أي أمر مهم.',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**لا ملفات تعريف ارتباط خاصة بنا.** لا يضع الموقع نفسه أي ملفات تعريف ارتباط.',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**لا شيء يُحفظ لوقت لاحق.** توجد الملفات والتفريغات خلال جلستك فقط. صدّر ما تحتاجه قبل المغادرة. التفاصيل في [سياسة الخصوصية](/privacy).',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**لا شيء يُحفظ لوقت لاحق.** تبقى التفريغات والملف في هذا المتصفح فقط، وتُحذف تلقائيًا بعد {idle} من عدم النشاط، أو عند الضغط على **حذف بياناتي الآن**. صدّر ما تحتاجه قبل المغادرة. التفاصيل في [سياسة الخصوصية](/privacy).',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**لا شيء يُحفظ لوقت لاحق.** توجد التفريغات خلال هذه الجلسة فقط، لذا صدّر ما تحتاجه. تصف [سياسة الخصوصية](/privacy) الموقع المستضاف.',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**عدّاد إجمالي واحد.** عند اكتمال التفريغ يرسل متصفحك إشارة مجهولة «+1» إلى عدّادنا (Cloudflare Worker). ولا تحمل أي ملف أو تفريغ أو معرّف. ترى Cloudflare عنوان IP الخاص بك أثناء العبور وتستخدمه لفترة وجيزة للحدّ من إساءة الاستخدام (حد للمعدّل)؛ ونحن نحتفظ بالإجمالي فقط. والرقم المعروض في ترويسة الصفحة تُبلغ عنه متصفحات الزوّار ولا يجري التحقق منه.',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    '**اختر «دقة عالية» أو «أعلى دقة»** للصوت الصعب.',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**اختر الجودة واللغة.** يعطي النموذج الأسرع مسودة سريعة، أما النموذج الأدق فهو الأفضل للمقابلات والمحاضرات والترجمات. ويمكن اكتشاف اللغة المنطوقة نيابةً عنك، وتُدعم أكثر من 50 لغة.',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    '**أعد التفريغ** لتفريغ مكتمل بجودة أو لغة أخرى؛ ويُحتفظ بتفريغك الحالي.',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    '**أعد التفريغ** بجودة أو لغة أخرى؛ ويُحتفظ بتفريغك الحالي.',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**اقرأ وصحّح ونزّل.** يظهر التفريغ بطوابع زمنية، وتُعلَّم الكلمات التي لم يكن النموذج متأكدًا منها لتتحقق منها. نزّله نصًا عاديًا أو ترجمات SRT أو VTT أو Markdown أو JSON.',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**الطلبات التي تُسلّم الموقع.** تُسلّم Cloudflare (Cloudflare Pages) هذا الموقع. وبصفتها مزوّد الاستضافة والشبكة لدينا، فإنها تعالج عنوان IP الخاص بك وبيانات الطلب المعتادة (مثل الوقت والصفحة المطلوبة ومتصفحك) لتسليم الموقع وحمايته.',
  '**Skip silence & music** — prevents made-up text':
    '**تخطّي الصمت والموسيقى** — يمنع النص المُختلَق',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**تبقى نماذج الكلام في ذاكرة التخزين المؤقت لمتصفحك** (Cache Storage)، فتبدأ عملية التفريغ التالية أسرع، إلى أن تحذفها (ويمكن لـ **حذف بياناتي الآن** حذفها أيضًا) أو يمسح متصفحك مساحة تخزينه. وهي ملفات برمجية، وليست بياناتك.',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**السرعة.** تعتمد على الجودة التي تختارها وطول الملف ومدى انشغال الخدمة.',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**السرعة.** تعتمد على جهازك والجودة التي تختارها وطول الملف. يُنزّل أول استخدام لمستوى جودة نموذجه مرة واحدة: يجلب متصفحك ملفات النموذج من Hugging Face وملفات برنامج المحرّك من jsDelivr، ثم يحتفظ بها في الذاكرة المؤقتة. أبقِ التبويب مفتوحًا أثناء العمل.',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**ابدأ بصوت جيد**: ضجيج خلفية أقل، وميكروفون قريب، ومتحدث واحد في كل مرة. أبقِ «تحسين الصوت» مفعّلًا.',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**ابدأ بصوت جيد**: ضجيج خلفية قليل، وميكروفون قريب، ومتحدث واحد في كل مرة. أبقِ «تحسين الصوت» مفعّلًا.',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**التخزين في متصفحك.** يحتفظ متصفحك بتفريغاتك وملفاتك (IndexedDB) ونماذج الكلام (Cache Storage) كما هو موضح أعلاه، ويتذكر اختيارك للمظهر الفاتح أو الداكن، ويحتفظ تخزين الجلسة فيه ببعض إعدادات الراحة للتبويب الحالي (مثل آخر اختيار للجودة). ولا يُرسل أي من ذلك إلينا.',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    '**الترجمات المصاحبة** لمقاطع الفيديو الخاصة بك وريلز والدورات عبر الإنترنت، انطلاقًا من ملف SRT أو VTT.',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**النص الذي يُنشأ على جهازك.** التفريغ وطوابعه الزمنية وتعديلاتك، والعنوان الذي تختاره، والإعدادات التي تحددها (الجودة واللغة وتلميح المفردات). تُنشأ وتُحفظ في هذا المتصفح، ولا نتلقاها أبدًا.',
  '**Use previous text as context** — can repeat on long files':
    '**استخدام النص السابق كسياق** — قد يكرّر النص في الملفات الطويلة',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**المذكرات الصوتية** مكتوبة نصًا، فلا تحتاج إلى الاستماع إليها مرة أخرى.',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**لماذا قد تختلف النتائج بين عملية وأخرى أو بين إعدادات الجودة أو الأدوات الأخرى؟** التعرّف على الكلام احتمالي: يختار الكلمات الأرجح، وفي المقاطع المشوّشة أو الملتبسة تتقارب عدة إجابات. وقد يغيّر النص إعداد جودة مختلف أو إعداد لغة مختلف أو تلميح مفردات أو تنقية صوتية، وكذلك أداة أخرى تستخدم نظامًا مختلفًا. ولا تُضاف أسماء المتحدثين أو تسمياتهم.',
  '**Word-level timing** — better subtitles and confidence marks':
    '**توقيت كل كلمة** — ترجمات أفضل وعلامات ثقة',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**ملفاتك وتفريغاتك تبقى في هذا المتصفح.** تُحفظ التفريغات والتعديلات والملف المصدر في تخزين هذا المتصفح (IndexedDB) فقط. وتُحذف تلقائيًا عند انتهاء جلستك، وهو ما يحدث بعد {idle} من عدم النشاط، أو فورًا عند الضغط على **حذف بياناتي الآن** في قائمة التفريغات.',
  '1 file was skipped: not video or audio.': 'تم تخطّي ملف واحد: ليس فيديو أو صوتًا.',
  '1 minute': 'دقيقة واحدة',
  '1 word': 'كلمة واحدة',
  '1. Agreement': '1. الموافقة',
  '1. Who runs this website': '1. من يدير هذا الموقع',
  '10. Children': '10. الأطفال',
  '10. Termination': '10. الإنهاء',
  '11. Children': '11. الأطفال',
  '11. Your rights and choices': '11. حقوقك وخياراتك',
  '12. Changes': '12. التغييرات',
  '12. Open-source components': '12. المكوّنات مفتوحة المصدر',
  '13. Changes to this policy': '13. التغييرات على هذه السياسة',
  '13. Governing law': '13. القانون الحاكم',
  '14. Contact': '14. التواصل',
  '2. The service': '2. الخدمة',
  '2. What is processed, and where': '2. ما الذي يُعالَج وأين',
  '3 simple steps': '3 خطوات بسيطة',
  '3. Why it is processed': '3. لماذا تُعالَج',
  '3. Your content': '3. محتواك',
  '4. Acceptable use': '4. الاستخدام المقبول',
  '4. How long it is kept': '4. مدة الاحتفاظ',
  '5. Downloads your browser makes': '5. ما ينزّله متصفحك',
  '5. Limits: your device does the work': '5. الحدود: جهازك هو الذي يعمل',
  '6. Accuracy: no warranty': '6. الدقة: بلا ضمان',
  '6. Advertising': '6. الإعلانات',
  '7. Availability': '7. التوفّر',
  '7. Cookies and browser storage': '7. ملفات تعريف الارتباط وتخزين المتصفح',
  '8. Sharing': '8. المشاركة',
  '8. Third-party downloads and ads': '8. التنزيلات والإعلانات من جهات خارجية',
  '9. Liability': '9. المسؤولية',
  '9. Security': '9. الأمان',
  'A name cannot be empty, so the old name was kept.':
    'لا يمكن أن يكون الاسم فارغًا، لذا بقي الاسم القديم.',
  'A new transcript has started. The old one is kept in your list.':
    'بدأ تفريغ جديد. ويبقى القديم في قائمتك.',
  'a period': 'فترة',
  About: 'من نحن',
  'About {brand}': 'عن {brand}',
  'about {h} h': 'نحو {h} س',
  'about {h} h {m} min': 'نحو {h} س {m} د',
  'about {n} min': 'نحو {n} د',
  'Accurate text': 'نص دقيق',
  'Add another file': 'إضافة ملف آخر',
  'Add your file': 'أضف ملفك',
  'Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    'تظهر الإعلانات في صفحات المعلومات وبجوار التفريغات المكتملة فقط، وتقدّمها Google التي تستخدم ملفات تعريف الارتباط. لا يُعرض أي إعلان أثناء تفريغ ملف، ولا يضع هذا الموقع أي ملفات تعريف ارتباط خاصة به. التفاصيل في [سياسة الخصوصية](/privacy).',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'الإعلانات ليست مطلوبة لأي ميزة: حتى مع حجب الإعلانات أو رفضها، يعمل كل شيء بالطريقة نفسها.',
  'Ads keep TranscribeVid free. Everything works without them.':
    'الإعلانات تُبقي TranscribeVid مجانيًا. ويعمل كل شيء من دونها.',
  Advertisement: 'إعلان',
  'All free tools': 'كل الأدوات المجانية',
  'All free video and audio to text tools': 'كل أدوات تحويل الفيديو والصوت إلى نص المجانية',
  'All tools': 'كل الأدوات',
  'All your data was deleted': 'حُذفت كل بياناتك',
  'Allow the microphone in your browser, or choose a file instead.':
    'اسمح بالميكروفون في متصفحك، أو اختر ملفًا بدلًا من ذلك.',
  'Already added': 'أُضيف مسبقًا',
  'Already finished': 'اكتمل بالفعل',
  'Also delete the downloaded speech models?': 'هل تريد حذف نماذج الكلام التي نُزّلت أيضًا؟',
  'an independent software developer': 'مطوّر برمجيات مستقل',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'هناك رفع قيد التنفيذ. انتظر حتى ينتهي قبل إضافة ملفات أخرى.',
  'Apply style only': 'تطبيق النمط فقط',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    'يستخدم «تطبيق النمط فقط» التعرّف المحفوظ دون معالجة الصوت مرة أخرى. وتبقى الأسطر المعدَّلة.',
  'Audio works too.': 'الصوت مدعوم أيضًا.',
  'Automatic (IndicXlit when installed)': 'تلقائي (IndicXlit عند تثبيته)',
  Back: 'رجوع',
  'Basic phonetic spelling': 'تهجئة صوتية أساسية',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'بما أننا لا نحتفظ بأي حساب أو بيانات تعرّف بك، فلا يمكننا عادةً ربط أي بيانات بشخص ما. وحيثما يمنحك القانون حقوقًا على بياناتك الشخصية، مثل الاطلاع والتصحيح والحذف والتقييد والاعتراض ونقل البيانات، أو حق تقديم شكوى إلى هيئة حماية البيانات لديك، يمكنك ممارستها بالتواصل معنا:',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'لأن تفريغاتك موجودة في هذا المتصفح فقط، صدّر ما تحتاجه قبل المغادرة. لا يمكن استرداد البيانات المحذوفة.',
  'Bengaluru, India': 'بنغالورو، الهند',
  'Best accuracy': 'أعلى دقة',
  'Best accuracy, slowest': 'أعلى دقة، الأبطأ',
  Breadcrumb: 'مسار التنقل',
  'By file type': 'حسب نوع الملف',
  'By language': 'حسب اللغة',
  'By use': 'حسب الاستخدام',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    'باستخدامك {brand} ({domain}) فإنك توافق على هذه الشروط. وإن لم توافق، فلا تستخدم الخدمة. تُشغّل الخدمة **{name}**، {address}.',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'تجاوز حدود المعدّل أو أمان الموقع أو عدّاده أو محاولة تجاوزها، أو التدخل في تشغيله أو في استخدام الزوّار الآخرين له؛',
  'Can I edit the transcript?': 'هل يمكنني تعديل التفريغ؟',
  "Can't reach the server.": 'تعذّر الوصول إلى الخادم.',
  Cancel: 'إلغاء',
  'Cancel "{title}"?': 'هل تريد إلغاء «{title}»؟',
  'Cancel {title}': 'إلغاء {title}',
  'Cancellation requested': 'طُلب الإلغاء',
  Cancelled: 'أُلغي',
  'Cancelling…': 'جارٍ الإلغاء…',
  'Cannot reach the server': 'تعذّر الوصول إلى الخادم',
  'Cannot reach the server.': 'تعذّر الوصول إلى الخادم.',
  'Cannot reach the server. Check your connection and try again.':
    'تعذّر الوصول إلى الخادم. تحقق من اتصالك وحاول مرة أخرى.',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'تعذّر الوصول إلى الخادم. تأكد من أنه يعمل (npm run dev) وحاول مرة أخرى.',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'غيّر سطرًا أو احذفه، أو ابحث واستبدل. تظهر تعديلاتك في كل تنزيل.',
  'Changed in {n} lines.': 'تم التغيير في {n} من الأسطر.',
  'Check Hinglish spelling': 'تحقّق من تهجئة الهنغلشية',
  'Choose "Save as PDF" in the print dialog.': 'اختر «حفظ بتنسيق PDF» في مربع حوار الطباعة.',
  'Choose a file': 'اختيار ملف',
  'Choose a file first': 'اختر ملفًا أولًا',
  'Choose a format': 'اختر صيغة',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'اختر بين نماذج أسرع وأخرى أدق، بحسب جهازك والوقت المتاح لك.',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'اختر «الأسرع» أو «القياسي» أو «دقة عالية» أو «أعلى دقة»: «الأسرع» هو الأسرع، و«أعلى دقة» يرتكب أقل عدد من الأخطاء.',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'اختر اللغة المنطوقة أو اتركها على الاكتشاف التلقائي. ويمكنك أيضًا ترجمة الكلام إلى الإنجليزية.',
  'Chosen files': 'الملفات المختارة',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'الكلام الواضح قرب الميكروفون يعطي أفضل نتيجة. ضمن «خيارات إضافية» يكون **تحسين الصوت** و**تخطّي الصمت والموسيقى** مفعّلين افتراضيًا: فهما يصفّيان الدمدمة والفحيح ويمنعان النموذج من اختلاق نص أثناء الموسيقى أو فترات الصمت الطويلة، فأبقِهما مفعّلين للتسجيلات الصاخبة. وللترجمات أبقِ **توقيت كل كلمة** مفعّلًا أيضًا، ليبدأ كل سطر وينتهي مع الكلمات تمامًا.',
  Close: 'إغلاق',
  'Close menu': 'إغلاق القائمة',
  'Close: {title}': 'إغلاق: {title}',
  'Common questions': 'أسئلة شائعة',
  Contact: 'تواصل معنا',
  'Converting…': 'جارٍ التحويل…',
  Copied: 'تم النسخ',
  'Copy text': 'نسخ النص',
  'Copying…': 'جارٍ النسخ…',
  'Could not cancel the transcript.': 'تعذّر إلغاء التفريغ.',
  'Could not change transcript style.': 'تعذّر تغيير نمط التفريغ.',
  'Could not copy': 'تعذّر النسخ',
  'Could not delete the transcript.': 'تعذّر حذف التفريغ.',
  'Could not delete your data.': 'تعذّر حذف بياناتك.',
  'Could not load the text to copy.': 'تعذّر تحميل النص لنسخه.',
  'Could not prepare the file. Please try again.': 'تعذّر تجهيز الملف. يُرجى المحاولة مرة أخرى.',
  'Could not rename the transcript.': 'تعذّر تغيير اسم التفريغ.',
  'Could not save the change.': 'تعذّر حفظ التغيير.',
  'Could not start': 'تعذّر البدء',
  'Could not start.': 'تعذّر البدء.',
  Dark: 'داكن',
  Delete: 'حذف',
  'Delete "{title}" and its transcript?': 'هل تريد حذف «{title}» وتفريغه؟',
  'Delete "{title}"? This cannot be undone.': 'هل تريد حذف «{title}»؟ لا يمكن التراجع عن ذلك.',
  'Delete {title}': 'حذف {title}',
  'Delete all your transcripts and the files kept in this browser now?':
    'هل تريد حذف كل تفريغاتك والملفات المحفوظة في هذا المتصفح الآن؟',
  'Delete all your transcripts and uploaded files now?':
    'هل تريد حذف كل تفريغاتك وملفاتك المرفوعة الآن؟',
  'Delete line': 'حذف السطر',
  'Delete my data now': 'حذف بياناتي الآن',
  'Delete this line from the transcript?': 'هل تريد حذف هذا السطر من التفريغ؟',
  'Delete transcript': 'حذف التفريغ',
  Deleted: 'تم الحذف',
  'Detect automatically': 'اكتشاف تلقائي',
  'Dismiss message': 'إخفاء الرسالة',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'يفهم Distil Large v3 الكلام الإنجليزي فقط. اختر نموذجًا آخر للترجمة.',
  Done: 'تم',
  'Download failed': 'فشل التنزيل',
  'Download started': 'بدأ التنزيل',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'نزّل النتيجة نصًا عاديًا أو ترجمات SRT أو VTT أو Markdown أو JSON.',
  'Download the transcript as': 'نزّل التفريغ بصيغة',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'جارٍ تنزيل نموذج الكلام (أول مرة فقط): {loaded} من {total}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    'أفلِت ملف فيديو أو صوت في [الصفحة الرئيسية](/)، أو سجّل من الميكروفون.',
  'Drop to add your file': 'أفلِت هنا لإضافة ملفك',
  'Drop your {noun} here, or choose a file': 'أفلِت {noun} هنا أو اختر ملفًا',
  'Each line with its time, like [00:12]': 'كل سطر مع وقته، مثل [00:12]',
  Edit: 'تعديل',
  'Edit it right here': 'عدّله هنا مباشرة',
  'Edit this line': 'تعديل هذا السطر',
  'Edited by you': 'عدّلته أنت',
  'English only, very fast and accurate': 'للإنجليزية فقط، سريع جدًا ودقيق',
  'English translation is selected in More options.':
    'الترجمة إلى الإنجليزية محددة في «خيارات إضافية».',
  'Enter saves · Esc cancels': 'Enter للحفظ · Esc للإلغاء',
  'Every line has a time. Play the media from any line to hear what was said.':
    'لكل سطر وقته. شغّل الملف من أي سطر لتسمع ما قيل.',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'تؤدي كل صفحة المهمة نفسها: تحوّل الكلام في ملف فيديو أو صوت إلى نص بطابع زمني على كل سطر، بأكثر من 50 لغة ودون تسجيل. اختر الصفحة التي تناسب الملف الذي لديك أو ما تريد إنشاءه.',
  'Experimental: compare on your audio; chunk timestamps':
    'تجريبي: قارن على صوتك؛ طوابع زمنية للمقاطع',
  'Experimental: larger model; chunk timestamps': 'تجريبي: نموذج أكبر؛ طوابع زمنية للمقاطع',
  Export: 'تصدير',
  Failed: 'فشل',
  FAQ: 'الأسئلة الشائعة',
  Fast: 'سريع',
  'Fast, clean audio': 'سريع، للصوت النظيف',
  Fastest: 'الأسرع',
  'Fastest, rough drafts only': 'الأسرع، للمسودات التقريبية فقط',
  'Fewer mistakes. Takes longer.': 'أخطاء أقل. يستغرق وقتًا أطول.',
  'Fewest mistakes. Takes the longest.': 'أقل عدد من الأخطاء. يستغرق أطول وقت.',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    'الملف «{name}» حجمه {size}، والحد الأقصى {limit} - اضبط VT_MAX_UPLOAD_MB لرفعه',
  'File "{name}" is {size}; the limit is {limit}.':
    'الملف «{name}» حجمه {size}، والحد الأقصى {limit}.',
  'file {n} of {total}': 'الملف {n} من {total}',
  'File added': 'أُضيف الملف',
  'File limits.': 'حدود الملفات.',
  'File not added': 'لم يُضف الملف',
  'File skipped': 'تم تخطّي الملف',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'توجد الملفات والتفريغات خلال جلستك فقط. صدّر ما تحتاجه قبل المغادرة. الشيء الوحيد الذي نحتفظ به هو عدّاد إجمالي مجهول واحد لعدد الملفات التي فُرّغت على الموقع (رقم واحد يظهر في ترويسة الصفحة)؛ وهو غير مرتبط بك ولا بملفاتك ولا بجلستك. التفاصيل في [سياسة الخصوصية](/privacy).',
  'Find it automatically': 'اكتشاف تلقائي',
  'first time only, also downloads the {size} MB word-timing model':
    'في المرة الأولى فقط، يُنزَّل أيضًا نموذج توقيت الكلمات ({size} MB)',
  'First time only: downloads {size} (needs internet)':
    'في المرة الأولى فقط: يُنزَّل {size} (يتطلب اتصالًا بالإنترنت)',
  'Follow playback': 'تتبّع التشغيل',
  'Following playback': 'يتتبّع التشغيل',
  Footer: 'تذييل الصفحة',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'للكلام بلكنة أو بلغات مختلطة، جرّب إعداد جودة أعلى. درجة الثقة ليست نسبة دقة.',
  'For developers: words, times, confidence': 'للمطوّرين: الكلمات والأوقات ودرجة الثقة',
  'For notes apps': 'لتطبيقات الملاحظات',
  'For video players and editors': 'لمشغّلات الفيديو وبرامج المونتاج',
  'For YouTube and web video': 'ليوتيوب وفيديو الويب',
  Free: 'مجاني',
  'Free tools': 'أدوات مجانية',
  'Free tools:': 'أدوات مجانية:',
  'Free video and audio to text': 'تحويل الفيديو والصوت إلى نص مجانًا',
  'Free video and audio to text, right in your browser':
    'تحويل الفيديو والصوت إلى نص مجانًا، مباشرة في متصفحك',
  'Free, unlimited, and no login needed': 'مجاني وبلا حدود وبلا حاجة إلى تسجيل دخول',
  'Free, unlimited, no login': 'مجاني، بلا حدود، بلا تسجيل دخول',
  'Frequently asked questions': 'الأسئلة الشائعة',
  'Get in touch': 'تواصل معنا',
  'Getting the speech engine ready…': 'جارٍ تجهيز محرّك الكلام…',
  'Give it a new name': 'امنحه اسمًا جديدًا',
  'Go to the home page': 'الانتقال إلى الصفحة الرئيسية',
  'Go to Video to text': 'الانتقال إلى تحويل الفيديو إلى نص',
  'Good balance (default)': 'توازن جيد (الافتراضي)',
  'Good for most videos. Not sure? Keep this one.':
    'مناسب لمعظم مقاطع الفيديو. إذا كنت في شك، فأبقِ على هذا الخيار.',
  'Good to know': 'معلومات مفيدة',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'تعذّر تحميل أداة الموافقة من Google، ويُرجَّح أن حاجب إعلانات أو الشبكة هو الذي منعها. وبدونها لا تُحمَّل أي إعلانات ولا ملفات تعريف ارتباط إعلانية.',
  Guides: 'الأدلة',
  'Guides: transcripts and subtitles': 'الأدلة: التفريغ النصي والترجمات',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'هل لديك سؤال أو عثرت على خلل أو تريد اقتراح ميزة؟ راسلنا على {email}. تُقرأ كل رسالة من الشخص الذي يبني {brand}، وستحصل عادةً على رد خلال بضعة أيام عمل.',
  'Helps spell uncommon words correctly.': 'يساعد على كتابة الكلمات غير الشائعة بشكل صحيح.',
  'High accuracy': 'دقة عالية',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    '«دقة عالية» (Large v3 Turbo) لم يُدرَّب على الترجمة وقد يعطيك اللغة الأصلية. للترجمة اختر «القياسي» أو «أعلى دقة».',
  'High accuracy, slower': 'دقة عالية، أبطأ',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    'كلما ارتفع الرقم زادت الدقة قليلًا وزاد البطء. 5 قيمة افتراضية جيدة.',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'الهندية بحروف إنجليزية مع الإبقاء على الكلمات الإنجليزية. أما اللغات الأخرى فتحتفظ بكتابتها الأصلية. راجع الكلمات والأسماء غير المألوفة.',
  'Hinglish (Roman Hindi)': 'الهنغلشية (الهندية بالحروف اللاتينية)',
  'Hinglish conversion': 'التحويل إلى الهنغلشية',
  History: 'السجل',
  Home: 'الرئيسية',
  'How {brand} works': 'كيف يعمل {brand}',
  'How accurate is it?': 'ما مدى دقته؟',
  'How do I get better accuracy?': 'كيف أحصل على دقة أفضل؟',
  'How it stays free': 'كيف يبقى مجانيًا',
  'How it works': 'كيف يعمل',
  'How long does it take?': 'كم يستغرق من الوقت؟',
  'How to transcribe a video to text': 'كيف تحوّل فيديو إلى نص',
  'How to turn a video or audio file into text with {brand}':
    'كيف تحوّل ملف فيديو أو صوت إلى نص باستخدام {brand}',
  'If it does have speech, try More › Re-transcribe with the right language.':
    'إذا كان فيه كلام فعلًا، جرّب «المزيد» › «إعادة التفريغ» مع اللغة الصحيحة.',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'إذا كانت الخدمة مشغولة أو كان عدد التفريغات الجارية كبيرًا جدًا، فسيُطلب منك الانتظار مع بيان السبب.',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'إذا غيّرنا هذه السياسة، فستظهر النسخة الجديدة في هذه الصفحة مع تاريخ «آخر تحديث» جديد.',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'في المنطقة الاقتصادية الأوروبية والمملكة المتحدة وسويسرا، وفي بعض الولايات الأمريكية، تطلب رسالة الموافقة المعتمدة من Google اختيارك عند تحميل الإعلانات.',
  'IndicXlit (trained model)': 'IndicXlit (نموذج مُدرَّب)',
  'Is it really free and unlimited? Do I need to log in?':
    'هل هو مجاني وبلا حدود فعلًا؟ وهل أحتاج إلى تسجيل الدخول؟',
  'Is my data private?': 'هل بياناتي خاصة؟',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    'يعتمد ذلك على الجودة التي تختارها وطول الملف ومدى انشغال الخدمة. «الأسرع» سريع؛ أما «أعلى دقة» فيستغرق أطول وقت لكنه يرتكب أقل عدد من الأخطاء. يظهر التقدم والوقت المتبقي مباشرةً، ويظهر للملف الذي ينتظر دوره «في قائمة الانتظار».',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'يعتمد ذلك على جهازك والجودة التي تختارها وطول الملف. مع بطاقة رسومات قادرة (WebGPU) يكون التفريغ أسرع ما يمكن؛ وإلا فيعمل على المعالج (WebAssembly)، وهو أبطأ. «الأسرع» سريع؛ أما «أعلى دقة» فيستغرق أطول وقت لكنه يرتكب أقل عدد من الأخطاء. يظهر التقدم والوقت المتبقي مباشرةً.',
  'It is now called “{title}”.': 'أصبح اسمه الآن «{title}».',
  'It may have been deleted.': 'ربما تم حذفه.',
  'It was stopped before any text was found.': 'تم إيقافه قبل العثور على أي نص.',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'حُذفت بياناتها، بما في ذلك هذا التفريغ. تُحفظ التفريغات فقط خلال الجلسة التي أنشأتها.',
  'Job not found': 'لم يُعثر على المهمة',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'الآن',
  'Just the words, in paragraphs': 'الكلمات فقط، في فقرات',
  'Keep reading': 'تابع القراءة',
  'Keep this page open until the upload is done.': 'أبقِ هذه الصفحة مفتوحة حتى ينتهي الرفع.',
  'Kept only for this session, then deleted automatically.':
    'تُحفظ لهذه الجلسة فقط، ثم تُحذف تلقائيًا.',
  Language: 'اللغة',
  'Larger or longer files are refused before they are processed, so split them first.':
    'تُرفض الملفات الأكبر أو الأطول قبل معالجتها، لذا قسّمها أولًا.',
  'Last updated: {date}': 'آخر تحديث: {date}',
  'Licence text': 'نص الترخيص',
  Light: 'فاتح',
  'Limits.': 'الحدود.',
  'Line deleted': 'تم حذف السطر',
  'Live: the text appears here as it is recognised': 'مباشر: يظهر النص هنا أثناء التعرّف عليه',
  'Loading model… (first use downloads it)': 'جارٍ تحميل النموذج… (يُنزَّل عند أول استخدام)',
  'Loading…': 'جارٍ التحميل…',
  'Long (56 letters)': 'طويل (56 حرفًا)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'إجابات أطول: الصيغ والترجمات والدقة والخصوصية.',
  Main: 'المحتوى الرئيسي',
  'Make a new transcript of the same file. This one is kept.':
    'أنشئ تفريغًا جديدًا للملف نفسه. ويبقى هذا التفريغ محفوظًا.',
  'Make a subtitle file (SRT or VTT) from your video.':
    'أنشئ ملف ترجمة (SRT أو VTT) من الفيديو الخاص بك.',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'القائمة',
  Model: 'النموذج',
  More: 'المزيد',
  'More answers: [Frequently asked questions](/faq)': 'مزيد من الإجابات: [الأسئلة الشائعة](/faq)',
  'More free tools': 'مزيد من الأدوات المجانية',
  'More options': 'خيارات إضافية',
  'More than 50 languages': 'أكثر من 50 لغة',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    'أكثر من 50 لغة، منها الإنجليزية والإسبانية والفرنسية والألمانية والبرتغالية والإيطالية والهولندية والروسية والعربية والهندية والصينية واليابانية والكورية. اترك اللغة على الاكتشاف التلقائي أو اخترها بنفسك. ويمكنك أيضًا ترجمة الكلام إلى الإنجليزية.',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'تطلب معظم مواقع التفريغ منك إنشاء حساب، أو تحدّ من الدقائق المجانية، أو تضيف علامات مائية، أو تدفعك إلى اشتراك قبل أن ترى سطرًا واحدًا من النص. أما {brand} فيفعل العكس. كل ما يقدمه متاح للجميع، ولا تطلب الصفحة سوى ملفك.',
  'Name not changed': 'لم يتغير الاسم',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    'أسماء وعلامات تجارية ومصطلحات متخصصة في الصوت، مثل Kubernetes وDr. Okafor',
  'Near-best accuracy, much faster than Large': 'دقة قريبة من الأفضل، وأسرع بكثير من Large',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'يتطلب دعم المظلّلات 16 بت (shader-f16) في برنامج تشغيل الرسومات',
  'needs 4 GB': 'يتطلب 4 GB',
  'needs 8 GB': 'يتطلب 8 GB',
  'needs a graphics-capable browser (Chrome, Edge)': 'يتطلب متصفحًا يدعم الرسومات (Chrome أو Edge)',
  'needs WebGPU': 'يتطلب WebGPU',
  'Next match': 'التطابق التالي',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'بلا حساب وبلا تتبّع. تُحفظ ملفاتك لجلستك فقط وتُحذف تلقائيًا.',
  'no estimate for this model here': 'لا يوجد تقدير لهذا النموذج هنا',
  'No login': 'بلا تسجيل دخول',
  'No matches': 'لا توجد نتائج مطابقة',
  'No microphone': 'لا يوجد ميكروفون',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'بلا تسجيل ولا دفع ولا حد يومي. أضِف ملفك فقط.',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'لا يعلن الخادم حاليًا عن أي حد للحجم أو المدة. الملفات الكبيرة جدًا تستغرق وقتًا أطول فقط.',
  'No speech was found in this file.': 'لم يُعثر على كلام في هذا الملف.',
  'No speech was transcribed.': 'لم يُفرَّغ أي كلام.',
  'No speech was transcribed. Check the recording and the selected language.':
    'لم يُفرَّغ أي كلام. تحقق من التسجيل ومن اللغة المحددة.',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'WebGPU غير متاح هنا: تعمل النماذج على خيط معالجة واحد، لذا تكون الأحجام الأكبر أبطأ من زمن التسجيل نفسه.',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'لا توجد ملفات لأشخاص آخرين قبل ملفك. وإذا أضفت عدة ملفات فسيجري تفريغها واحدًا بعد الآخر في تبويبك، لذا أبقِ التبويب مفتوحًا حتى تنتهي.',
  'None of those are video or audio files.': 'ليس أي منها ملف فيديو أو صوت.',
  Normal: 'عادي',
  'not available for this size': 'غير متاح لهذا الحجم',
  'not available in this browser': 'غير متاح في هذا المتصفح',
  'not available with Qwen (times are per chunk)': 'غير متاح مع Qwen (الأوقات لكل مقطع)',
  'Not cancelled': 'لم يُلغَ',
  'Not deleted': 'لم يُحذف',
  'Not renamed': 'لم تتم إعادة التسمية',
  'Not saved': 'لم يُحفظ',
  Note: 'ملاحظة',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'لا يوجد شيء هنا بعد. تظهر هنا التفريغات التي تنشئها خلال هذه الجلسة.',
  'Nothing is saved. Export what you need.': 'لا شيء يُحفظ. صدّر ما تحتاجه.',
  'Nothing is uploaded until you press Transcribe.': 'لا يُرفع شيء حتى تضغط «ابدأ التفريغ».',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'لا تسجيل ولا دفع. أضِف ملفك فقط.',
  'Nothing was recorded.': 'لم يُسجَّل شيء.',
  Off: 'إيقاف',
  On: 'تشغيل',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'على الكلام الواضح بلغة مدعومة يكون التفريغ دقيقًا جدًا عادةً، لكن لا يوجد نظام تعرّف على الكلام يخلو من الأخطاء. وتعتمد الدقة على جودة الصوت واللكنات وضجيج الخلفية وتداخل المتحدثين والموسيقى والأسماء النادرة أو المصطلحات المتخصصة. لكل سطر درجة ثقة، وتُعلَّم الأسطر ذات الثقة المنخفضة لتتحقق منها أولًا. تحقّق دائمًا من التفريغ قبل الاعتماد عليه في أي أمر مهم.',
  'Open menu': 'فتح القائمة',
  'Opening your transcript…': 'جارٍ فتح التفريغ…',
  'or drop it anywhere on this page.': 'أو أفلِته في أي مكان من هذه الصفحة.',
  'Original script': 'الكتابة الأصلية',
  Output: 'المخرجات',
  'Page {page} of {pages}': 'الصفحة {page} من {pages}',
  'Page not found': 'الصفحة غير موجودة',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'صفحات للملف الذي لديك بالفعل: WAV وM4A وWebM وMOV.',
  'PDF document (.pdf)': 'مستند PDF (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'يُنشئ متصفحك ملف PDF: اختر «حفظ بتنسيق PDF» في مربع حوار الطباعة.',
  'Pick quality': 'اختر الجودة',
  'Plain text (.txt)': 'نص عادي (.txt)',
  'Play from here': 'التشغيل من هنا',
  'Playback speed': 'سرعة التشغيل',
  'Please add one file at a time here. You can add more files on the next page.':
    'يُرجى إضافة ملف واحد في كل مرة هنا. يمكنك إضافة ملفات أخرى في الصفحة التالية.',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'يُرجى عدم إرسال تسجيلات خاصة. يفرّغ {brand} ملفاتك على جهازك ولا نتلقاها أبدًا، لذا لا نحتاج إليها لمساعدتك.',
  'Please note': 'يُرجى الانتباه',
  Preparing: 'قيد التجهيز',
  'Preparing audio…': 'جارٍ تجهيز الصوت…',
  'Preparing the audio…': 'جارٍ تجهيز الصوت…',
  'Preparing…': 'جارٍ التجهيز…',
  'Press a question to read its answer.': 'اضغط على سؤال لقراءة إجابته.',
  'Previous match': 'التطابق السابق',
  'Print to PDF': 'طباعة إلى PDF',
  Privacy: 'الخصوصية',
  'Privacy and cookie settings': 'إعدادات الخصوصية وملفات تعريف الارتباط',
  'Privacy policy': 'سياسة الخصوصية',
  'Privacy requests': 'طلبات الخصوصية',
  Private: 'خاص',
  Progress: 'التقدم',
  Quality: 'الجودة',
  'Questions about these terms:': 'أسئلة حول هذه الشروط:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'نرحب دائمًا بالأسئلة وتقارير الأخطاء والأفكار. راسلنا على {email}، أو راجع صفحة [تواصل معنا](/contact) لمعرفة ما ينبغي إرفاقه.',
  Queued: 'في قائمة الانتظار',
  'Quick results. Good for clear speech.': 'نتائج سريعة. مناسب للكلام الواضح.',
  Quickest: 'أسرع خيار',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'يستخدم Qwen طوابع زمنية تقريبية للمقاطع. توقيت الكلمات ودرجة الثقة غير متاحين.',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'يستخدم Qwen طوابع زمنية للمقاطع ولا يوفّر درجة ثقة لكل كلمة. قارن عيّنة قصيرة قبل اختياره.',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (تجريبي)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'يتطلب Qwen3-ASR متصفح حاسوب مكتبي يدعم WebGPU (Chrome أو Edge) ودعم المظلّلات 16 بت (shader-f16) في برنامج تشغيل الرسومات.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'يتطلب Qwen3-ASR متصفح حاسوب مكتبي يدعم WebGPU (Chrome أو Edge) وذاكرة بحجم 8 GB.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'يتطلب Qwen3-ASR متصفح حاسوب مكتبي يدعم WebGPU (Chrome أو Edge).',
  'Re-transcribe': 'إعادة التفريغ',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'اقرأ التفريغ مع الطوابع الزمنية، واطّلع على الكلمات التي لم يكن النموذج متأكدًا منها، وصحّحها في مكانها.',
  'Read, edit, download': 'اقرأ وعدّل ونزّل',
  Ready: 'جاهز',
  'Ready to print or share': 'جاهز للطباعة أو المشاركة',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    'جاهز للتجربة؟ [اطّلع على كل الأدوات المجانية](/tools) أو [فرّغ ملفًا الآن](/).',
  'Recognition engine': 'محرّك التعرّف',
  Recommended: 'موصى به',
  'Record from microphone': 'التسجيل من الميكروفون',
  'Record straight from your microphone and turn it into text.':
    'سجّل مباشرة من الميكروفون وحوّل التسجيل إلى نص.',
  'Record with your microphone': 'التسجيل بالميكروفون',
  'Recording {stamp}': 'تسجيل {stamp}',
  'Recording is not supported by this browser.': 'التسجيل غير مدعوم في هذا المتصفح.',
  'Related reading': 'قراءات ذات صلة',
  Remove: 'إزالة',
  'Remove {name}': 'إزالة {name}',
  'Removes it for good': 'يُزيله نهائيًا',
  Rename: 'إعادة التسمية',
  Renamed: 'تمت إعادة التسمية',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    'هل تريد استبدال «{query}» بـ«{replacement}» في الأسطر المطابقة ({n})؟',
  'Replace "{query}" with "{replacement}" in 1 line?':
    'هل تريد استبدال «{query}» بـ«{replacement}» في سطر واحد؟',
  'Replace in {n} lines': 'استبدال في الأسطر ({n})',
  'Replace in 1 line': 'استبدال في سطر واحد',
  'Replace with': 'استبدال بـ',
  'Replace with…': 'استبدال بـ…',
  'Replace…': 'استبدال…',
  Replaced: 'تم الاستبدال',
  'Reporting a problem': 'الإبلاغ عن مشكلة',
  'Retrying…': 'جارٍ إعادة المحاولة…',
  'Review language and quality': 'مراجعة اللغة والجودة',
  'Review this transcript': 'مراجعة هذا التفريغ',
  Save: 'حفظ',
  Saved: 'تم الحفظ',
  'Saving…': 'جارٍ الحفظ…',
  'Search depth: {n}': 'عمق البحث: {n}',
  'Search the text': 'البحث في النص',
  'Search the transcript': 'البحث في التفريغ',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'اطّلع أيضًا على [شروط الاستخدام](/terms) و[كيف يعمل](/how-it-works) و[الأسئلة الشائعة](/faq).',
  'Server busy': 'الخادم مشغول',
  'Session only — nothing is saved.': 'للجلسة فقط — لا شيء يُحفظ.',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'للجلسة فقط — لا شيء يُحفظ. يؤدي إغلاق التطبيق إلى مسح كل التفريغات. صدّر ما تحتاجه.',
  'Session time left: about {n} min': 'الوقت المتبقي للجلسة: نحو {n} د',
  'Short (32 letters)': 'قصير (32 حرفًا)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'إجابات قصيرة وعملية عن تحويل الكلام إلى نص وترجمات: أي صيغة ترجمة تختار، وكيف تضيف ترجمات إلى فيديو، وكيف تحصل على تفريغ أدق، وكيف يمكن أن يجري التفريغ في متصفحك دون رفع ملفك.',
  'Show all {count} languages': 'عرض كل اللغات ({count})',
  'Six ways to download': 'ست طرق للتنزيل',
  'Skip to main content': 'التخطّي إلى المحتوى الرئيسي',
  Slower: 'أبطأ',
  'slower than real time on the measured laptop':
    'أبطأ من زمن التسجيل نفسه على الحاسوب المحمول الذي جرى القياس عليه',
  Slowest: 'الأبطأ',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'تنزّل بعض الميزات مكوّنات مفتوحة المصدر إلى متصفحك عند استخدامها. وتعمل على جهازك مثل بقية المحرّك. وتطلب تراخيصها أن نعرض هذه الإشعارات:',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    'تحتاج بعض المقاطع إلى مراجعة بالاستماع بسبب نص مكرّر أو حدّ غير مؤكد للكلام.',
  'Something went wrong': 'حدث خطأ ما',
  'Something went wrong in this browser. Please try again.':
    'حدث خطأ ما في هذا المتصفح. يُرجى المحاولة مرة أخرى.',
  'Something went wrong while reading this file.': 'حدث خطأ ما أثناء قراءة هذا الملف.',
  'Source code': 'الشيفرة المصدرية',
  Speed: 'السرعة',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'سرعات الهواتف والأجهزة اللوحية مُقدَّرة وليست مقيسة؛ والحجمان tiny وbase هما الآمنان.',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'SRT وVTT للترجمات، وTXT وMarkdown للقراءة، وJSON للبرامج، أو PDF للطباعة.',
  Standard: 'القياسي',
  'Standard (42 letters)': 'قياسي (42 حرفًا)',
  Start: 'ابدأ',
  'Start a new transcription': 'بدء تفريغ جديد',
  'Start again': 'ابدأ من جديد',
  'Started again': 'بدأ من جديد',
  'Starting…': 'جارٍ البدء…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'ما زال لديك سؤال؟ اقرأ [الأسئلة الشائعة](/faq)، أو اطّلع على [كيف يعمل](/how-it-works)، أو [تواصل معنا](/contact).',
  'Still stuck? [Read How it works](/how-it-works)':
    'ما زلت تواجه مشكلة؟ [اقرأ «كيف يعمل»](/how-it-works)',
  'Stop recording · {time}': 'إيقاف التسجيل · {time}',
  'Stop this transcription? The text found so far is kept.':
    'هل تريد إيقاف هذا التفريغ؟ يُحتفظ بالنص الذي عُثر عليه حتى الآن.',
  'Stopping the transcription worker. The text found so far is kept.':
    'جارٍ إيقاف عامل التفريغ. يُحتفظ بالنص الذي عُثر عليه حتى الآن.',
  'Stored on this device only, never uploaded.': 'محفوظة على هذا الجهاز فقط، ولا تُرفع أبدًا.',
  'Style unchanged': 'لم يتغير النمط',
  'Style updated': 'تم تحديث النمط',
  'Style updated using the saved recognition. Edited lines are kept.':
    'تم تحديث النمط باستخدام التعرّف المحفوظ. وتبقى الأسطر المعدَّلة.',
  'Subtitle files': 'ملفات الترجمة',
  'Subtitle line length': 'طول سطر الترجمة',
  'Subtitles (.srt)': 'الترجمات (.srt)',
  'Switch to dark theme': 'التبديل إلى المظهر الداكن',
  'Switch to light theme': 'التبديل إلى المظهر الفاتح',
  Terms: 'الشروط',
  'Terms of use': 'شروط الاستخدام',
  'Text with times (.txt)': 'نص مع الأوقات (.txt)',
  'That file is already in the list.': 'هذا الملف موجود بالفعل في القائمة.',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'هذا ليس ملف فيديو أو صوت. اختر ملف MP4 أو MOV أو MP3 أو أي ملف فيديو أو صوت آخر.',
  'That is not a video or audio file. Please choose a video or audio file.':
    'هذا ليس ملف فيديو أو صوت. يُرجى اختيار ملف فيديو أو صوت.',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'هذا ليس ملفًا صوتيًا. اختر ملف MP3 أو WAV أو M4A أو أي ملف صوتي آخر.',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    'توضّح [سياسة الخصوصية](/privacy) ما يُعالَج ولماذا. وللاستفسار عن بياناتك أو لممارسة حقوقك، راسلنا على العنوان نفسه.',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    'لا يمكن تشغيل النموذج {label} على هذا الجهاز: {reason}. اختر نموذجًا آخر.',
  'the exact error message, or a screenshot of it.':
    'رسالة الخطأ كما ظهرت بالضبط، أو لقطة شاشة لها.',
  'The file is larger than the server accepts.': 'الملف أكبر مما يقبله الخادم.',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'عند أول استخدام لمستوى جودة معيّن، يُنزّل متصفحك نموذج الكلام الخاص به مرة واحدة ويحتفظ به للمرة القادمة، فتبدأ الملفات اللاحقة أسرع.',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'عند أول استخدام لمستوى جودة معيّن، يُنزّل متصفحك نموذج الكلام من Hugging Face وملفات برنامج المحرّك من jsDelivr، ويحتفظ بها للمرة القادمة؛ ولا يُرسل معها أي شيء من ملفك. وعند اكتمال التفريغ يضيف متصفحك واحدًا إلى العدّاد المجهول في ترويسة الصفحة، ولا شيء غير ذلك.',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'لا يدعم برنامج تشغيل الرسومات المظلّلات 16 بت: فتكون التنزيلات أكبر والذاكرة المستخدمة أكثر.',
  'The line was removed.': 'تمت إزالة السطر.',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'الأدوات الرئيسية: حوّل أي ملف فيديو أو صوت إلى تفريغ نصي بطوابع زمنية.',
  'The page you are looking for does not exist or has moved.':
    'الصفحة التي تبحث عنها غير موجودة أو نُقلت.',
  'The recording failed. Please try again.': 'فشل التسجيل. يُرجى المحاولة مرة أخرى.',
  'The server does not have enough free disk space for this file.':
    'لا تتوافر على الخادم مساحة قرص كافية لهذا الملف.',
  'The server is busy': 'الخادم مشغول',
  'The server is busy right now.': 'الخادم مشغول الآن.',
  'The service is busy right now. Please wait a moment and try again.':
    'الخدمة مشغولة الآن. يُرجى الانتظار قليلًا ثم المحاولة مرة أخرى.',
  'The service is full right now. Please try again in a little while.':
    'الخدمة ممتلئة الآن. يُرجى المحاولة مرة أخرى بعد قليل.',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    'يعمل التعرّف على الكلام داخل متصفحك، باستخدام نماذج مفتوحة للتعرّف على الكلام مثل OpenAI Whisper. يُنزّل متصفحك النموذج مرة واحدة ويحتفظ به، ثم يؤدي كل العمل على جهازك. لا يُرفع الفيديو أو الصوت إلينا أبدًا، ولهذا لا يوجد حد لحجم الملف ولا طابور لملفات الآخرين. توضّح صفحة [كيف يعمل](/how-it-works) كل خطوة.',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'تعذّر تحديد اللغة المنطوقة بثقة. اختر اللغة التي تسمعها وحاول مرة أخرى.',
  'The text found before it was stopped is shown below.':
    'يظهر أدناه النص الذي عُثر عليه قبل الإيقاف.',
  'The text found so far is kept.': 'يُحتفظ بالنص الذي عُثر عليه حتى الآن.',
  'The text is ready to paste.': 'النص جاهز للصق.',
  'The transcript finished before it could be cancelled.': 'انتهى التفريغ قبل أن يمكن إلغاؤه.',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'يجري التفريغ على جهازك باستخدام نماذج مفتوحة للتعرّف على الكلام مثل OpenAI Whisper. يُنزّل متصفحك نموذجًا مرة واحدة ويحتفظ به، فيبدأ الملف التالي أسرع، ولا يُرفع الفيديو أو الصوت إلى أي مكان.',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'نوع الملف ومدته، مثل «MP4، 25 دقيقة»؛',
  'There is no size or length limit set here.': 'لا يوجد هنا أي حد للحجم أو المدة.',
  'These details make a problem much quicker to find and fix:':
    'تجعل هذه التفاصيل العثور على المشكلة وإصلاحها أسرع بكثير:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    'تخضع هذه الشروط لقوانين الهند. وتختص محاكم بنغالورو في ولاية كارناتاكا بالهند اختصاصًا حصريًا بأي نزاع ينشأ عنها. ولا ينتقص ذلك من أي حماية تتمتع بها بموجب قوانين المستهلك الإلزامية في البلد الذي تقيم فيه.',
  'They are downloaded again the next time you transcribe.':
    'تُنزَّل مرة أخرى في المرة التالية التي تفرّغ فيها.',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'يستخدم موردو الجهات الخارجية، ومنهم Google، ملفات تعريف الارتباط لعرض إعلانات بناءً على زياراتك السابقة لهذا الموقع أو لمواقع أخرى. ويتيح استخدام Google لملفات تعريف الارتباط الإعلانية لها ولشركائها عرض إعلانات لك بناءً على زيارتك لهذا الموقع و/أو لمواقع أخرى على الإنترنت.',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'يقبل هذا المربع ملفات صوتية مثل MP3 أو WAV أو M4A، لكن ذلك الملف فيديو.',
  'This browser cannot record. Please choose a file instead.':
    'لا يستطيع هذا المتصفح التسجيل. اختر ملفًا بدلًا من ذلك.',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'لا يُبلغ هذا المتصفح عن حجم الذاكرة؛ افتُرض {gb} GB. اختر نموذجًا أصغر إذا أصبحت الصفحة بطيئة.',
  'This cannot be undone. Export anything you want to keep first.':
    'لا يمكن التراجع عن ذلك. صدّر أولًا أي شيء تريد الاحتفاظ به.',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    'تعمل هذه النسخة من {brand} على حاسوبك. تُعالَج ملفاتك على هذا الجهاز ولا يغادره أي شيء. لا يُحفظ شيء بشكل دائم: توجد التفريغات خلال هذه الجلسة فقط، لذا صدّر ما تحتاجه. توضّح [سياسة الخصوصية](/privacy) الموقع المستضاف.',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'تعمل هذه النسخة على حاسوبك. تُعالَج ملفاتك على هذا الجهاز ولا يغادره أي شيء.',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'ذاكرة هذا الجهاز قليلة بالنسبة إلى ملف بهذا الطول. يُعالَج الملف على قطع صغيرة، وهذا أبطأ؛ والأسلم اقتطاع جزء أقصر أو اختيار نموذج أصغر.',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'يحتاج هذا الملف إلى محوّل بحجم 9 MB يعمل في متصفحك. هل تريد تحميله؟',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'هذه ترجمة للتيسير. وإذا اختلفت عن النسخة الإنجليزية، فتسري النسخة الإنجليزية.',
  'This local copy does not count transcriptions': 'هذه النسخة المحلية لا تحتسب عمليات التفريغ',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'ثقة النموذج في هذا التفريغ منخفضة. استمع إلى التسجيل وتحقق من اللغة المنطوقة قبل استخدام النص.',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'سيستغرق هذا {wait} على هذا الجهاز (تقدير). أبقِ التبويب مفتوحًا حتى ينتهي.',
  Timestamps: 'الطوابع الزمنية',
  'Tips for the best results': 'نصائح للحصول على أفضل النتائج',
  'Tips for the best transcript': 'نصائح للحصول على أفضل تفريغ',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'لتغيير خياراتك الإعلانية، استخدم [إعدادات إعلانات Google](https://adssettings.google.com) أو إعدادات ملفات تعريف الارتباط في متصفحك.',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'لتغيير خياراتك الإعلانية، استخدم **إعدادات الخصوصية وملفات تعريف الارتباط** في أسفل أي صفحة تعرض إعلانات، أو [إعدادات إعلانات Google](https://adssettings.google.com)، أو إعدادات ملفات تعريف الارتباط في متصفحك.',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'لنقدّم لك التفريغ الذي طلبته على جهازك، ولتسليم الموقع بأمان، ولإبقاء الخدمة مجانية عبر الإعلانات. وحيثما ينطبق قانون حماية البيانات مثل اللائحة العامة لحماية البيانات (GDPR)، فإن أسسنا القانونية هي: تقديم الخدمة التي طلبتها (المادة 6(1)(b))، ومصلحتنا المشروعة في الأمان ومنع إساءة الاستخدام والعدّاد الإجمالي المجهول (المادة 6(1)(f))، وبالنسبة إلى ملفات تعريف الارتباط الإعلانية حيث يشترط القانون ذلك، موافقتك (المادة 6(1)(a))، التي تطلبها رسالة الموافقة من Google.',
  'To keep it fast for everyone, each file has a size and length limit.':
    'للحفاظ على سرعته للجميع، يخضع كل ملف لحد للحجم والمدة.',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    'إلى الحد الذي يسمح به القانون، لا نتحمل المسؤولية عن الخسارة غير المباشرة أو التبعية، أو فقدان البيانات أو الأرباح أو الأعمال، ولا عن أي خسارة تنشأ عن استخدامك للخدمة أو عدم تمكنك من استخدامها أو عن أخطاء في التفريغ. ولا شيء في هذه الشروط يحدّ من مسؤولية لا يجوز تحديدها قانونًا.',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'للتفريغ على جهازك، يُنزّل متصفحك ملفات نماذج الكلام من Hugging Face (huggingface.co) وملفات برنامج محرّك الكلام من jsDelivr (cdn.jsdelivr.net)، ويحتفظ بها في ذاكرته المؤقتة (Cache Storage) للمرة القادمة إلى أن تحذفها. وتتلقى هاتان الجهتان بيانات الطلب المعتادة (عنوان IP الخاص بك ومتصفحك والملف المطلوب)، ولا تتلقيان وسائطك أو تفريغك أبدًا.',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'للعمل على جهازك، يُنزّل متصفحك نماذج الكلام من Hugging Face وملفات البرنامج من jsDelivr؛ وتُقدَّم بموجب تراخيصها وشروطها الخاصة. وتُقدَّم الإعلانات من Google AdSense؛ ويقود الإعلان إلى موقع تابع لجهة خارجية لا نتحكم فيه ولا نتحمل مسؤوليته.',
  Transcribe: 'ابدأ التفريغ',
  'Transcribe (same language)': 'تفريغ (بنفس اللغة)',
  'Transcribe {n} files': 'تفريغ {n} من الملفات',
  'Transcribe a file': 'تفريغ ملف',
  'Transcribe or translate speech in the language you need.':
    'فرّغ الكلام أو ترجمه باللغة التي تحتاجها.',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    'فرّغ مقاطع الفيديو والملفات الصوتية والتسجيلات الصوتية بأكثر من 50 لغة، أو دع اللغة تُكتشف تلقائيًا.',
  'Transcribing {n}%': 'جارٍ التفريغ {n}%',
  'Transcribing takes {time} on this device.': 'يستغرق التفريغ {time} على هذا الجهاز.',
  'Transcribing…': 'جارٍ التفريغ…',
  'Transcribed in {time}': 'تم التفريغ خلال {time}',
  '{n} s': '{n} ث',
  '{m} min {s} s': '{m} د {s} ث',
  Transcript: 'التفريغ النصي',
  'Transcript name': 'اسم التفريغ',
  'Transcript not found': 'لم يُعثر على التفريغ',
  'Transcript ready': 'التفريغ جاهز',
  'Transcript style': 'نمط التفريغ',
  'Transcription failed': 'فشل التفريغ',
  'Transcription has started. The text appears below as it is recognised.':
    'بدأ التفريغ. يظهر النص أدناه أثناء التعرّف عليه.',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'بدأ التفريغ. تجد ملفاتك الأخرى ضمن «التفريغات» في أعلى الصفحة.',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    'يجري التفريغ على جهازك ويستخدم معالجه وشريحة الرسومات والذاكرة والبطارية. لا نضع أي حد لحجم الملف أو مدته، لكن سرعة التفريغ وحجم الملف الذي يستطيع متصفحك التعامل معه يعتمدان على جهازك: فقد يستغرق ملف طويل على هاتف أو حاسوب أبطأ وقتًا طويلًا أو تنفد الذاكرة. تُحفظ تفريغاتك وملفاتك في هذا المتصفح وتُحذف تلقائيًا بعد {idle} من عدم النشاط. راجع [سياسة الخصوصية](/privacy).',
  'Transcription settings': 'إعدادات التفريغ',
  Transcripts: 'التفريغات',
  'Transcripts {n}': 'التفريغات {n}',
  'Transcripts are only kept for the browser session that created them.':
    'تُحفظ التفريغات فقط خلال جلسة المتصفح التي أنشأتها.',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    'تُنتَج التفريغات تلقائيًا وستحتوي على أخطاء، خصوصًا مع الصوت الصاخب واللكنات القوية وتداخل المتحدثين والموسيقى والأسماء أو المصطلحات التقنية. تحقّق دائمًا من التفريغ قبل الاعتماد عليه، خصوصًا في الاستخدام القانوني أو الطبي أو المالي أو في النشر. تُقدَّم الخدمة «كما هي» و«حسب التوفر»، دون أي ضمان، صريحًا كان أو ضمنيًا، بما في ذلك ما يتعلق بالدقة أو الاكتمال أو الملاءمة لغرض معيّن.',
  'Translate to English': 'ترجمة إلى الإنجليزية',
  'Try again': 'حاول مرة أخرى',
  'Try another quality or language': 'جرّب جودة أو لغة أخرى',
  'try to spread malware or anything meant to damage the service.':
    'محاولة نشر برمجيات خبيثة أو أي شيء يُقصد به الإضرار بالخدمة.',
  'Trying again in a moment…': 'ستُعاد المحاولة بعد لحظة…',
  'Trying again. This page loads by itself as soon as the server is back.':
    'تتم إعادة المحاولة. ستُحمَّل هذه الصفحة تلقائيًا بمجرد عودة الخادم.',
  'under a minute': 'أقل من دقيقة',
  'Underline unsure words': 'تسطير الكلمات غير المؤكدة',
  Unlimited: 'بلا حدود',
  'Unsure: worth listening to again': 'غير مؤكدة: تستحق الاستماع إليها مرة أخرى',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'قد يُطلب الانتظار قليلًا عند حدوث دفعات رفع كثيفة على نحو غير معتاد.',
  'Up to {minutes} per file.': 'حتى {minutes} لكل ملف.',
  'Up to {size} and {minutes} minutes per file.': 'حتى {size} و{minutes} دقيقة لكل ملف.',
  'Up to {size} and {minutes} per file.': 'حتى {size} و{minutes} لكل ملف.',
  'Up to {size} per file.': 'حتى {size} لكل ملف.',
  'Updated {date}': 'تم التحديث {date}',
  'Upload complete': 'اكتمل الرفع',
  'Upload failed': 'فشل الرفع',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'فشل الرفع (خطأ في الخادم {status}). راجع الطرفية التي يعمل فيها الخادم لمعرفة التفاصيل.',
  'Upload failed (server error {status}). Please try again in a moment.':
    'فشل الرفع (خطأ في الخادم {status}). يُرجى المحاولة مرة أخرى بعد لحظة.',
  Uploading: 'جارٍ الرفع',
  'Uploading…': 'جارٍ الرفع…',
  'use a computer for this size': 'استخدم حاسوبًا لهذا الحجم',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'استخدام نصوص برمجية أو روبوتات أو أي وسائل آلية أخرى ضد الموقع أو عدّاده، أو إرسال أعداد مختلَقة، دون إذن كتابي منا؛',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'استخدام الخدمة على محتوى غير قانوني أو ينتهك حقوق الآخرين؛',
  'use the service to harass, harm or deceive others;':
    'استخدام الخدمة لمضايقة الآخرين أو إيذائهم أو خداعهم؛',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'دقيق جدًا عادةً مع الكلام الواضح. وتُعلَّم الأسطر غير المؤكدة لتتحقق منها أولًا.',
  'Video and audio to text': 'الفيديو والصوت إلى نص',
  'Video or audio, several at once is fine.': 'فيديو أو صوت، ويمكنك إضافة عدة ملفات دفعة واحدة.',
  'Video to text, accurately.': 'تحويل الفيديو إلى نص بدقة.',
  'Video to text: transcribe a video or audio file': 'تحويل الفيديو إلى نص: فرّغ ملف فيديو أو صوت',
  'video transcribed': 'فيديو مُفرَّغ',
  'videos transcribed': 'فيديو مُفرَّغ',
  'Vocabulary hint': 'تلميح المفردات',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'الملاحظات الصوتية والاجتماعات والمحاضرات والبودكاست والمقابلات.',
  'Waiting for microphone permission…': 'بانتظار إذن الميكروفون…',
  'Waiting for the first words…': 'بانتظار الكلمات الأولى…',
  'Waiting in line…': 'في قائمة الانتظار…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'شاهد النص يظهر مباشرةً، وصحّح أي أخطاء، ثم نزّله بصيغة SRT أو VTT أو TXT أو Markdown أو JSON أو PDF.',
  'We do not ask for your name, e-mail address or any other account details.':
    'لا نطلب اسمك ولا بريدك الإلكتروني ولا أي بيانات حساب أخرى.',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'لا نعد بأن تكون الخدمة متاحة دائمًا أو دون انقطاع أو دون أخطاء. فقد يتعذّر الوصول إلى الموقع أو إلى التنزيلات التي يحتاجها (نماذج الكلام من Hugging Face وملفات البرنامج من jsDelivr) بسبب الصيانة أو لأسباب خارجة عن إرادتنا، ولا تستطيع بعض المتصفحات أو الأجهزة تشغيل كل نموذج. ولأن تفريغاتك لا تُحفظ إلا في هذا المتصفح وتُحذف بعد فترة من عدم النشاط، صدّر دائمًا ما تحتاجه.',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'لا نبيع بياناتك. ولا نحتفظ بأي من ملفاتك أو تفريغاتك، فلا يوجد ما نشاركه: يجري التعرّف على جهازك وليس على خدمة تفريغ أو ذكاء اصطناعي خارجية. وGoogle (للإعلانات) وCloudflare (للاستضافة والعدّاد) وHugging Face وjsDelivr (للتنزيلات) لا تتلقى إلا ما هو موصوف أعلاه. وقد نكشف عن معلومات إذا اقتضى القانون ذلك.',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    'لا نحتفظ بأي شيء يخصك لدينا: فباستثناء العدّاد الإجمالي الواحد، لا نخزّن أي شيء عن استخدامك.',
  'We may block access if these rules are broken.': 'قد نحجب الوصول إذا خُولفت هذه القواعد.',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'قد نحدّث هذه الشروط. تظهر النسخة الجديدة في هذه الصفحة مع تاريخ «آخر تحديث» جديد، وتسري من ذلك الحين.',
  'We never send your file, your transcript or any personal information to Google.':
    'لا نرسل ملفك أو تفريغك أو أي معلومات شخصية إلى Google أبدًا.',
  'Web subtitles (.vtt)': 'ترجمات الويب (.vtt)',
  'What people use it for': 'فيمَ يستخدمه الناس',
  'What you can do with it': 'ما الذي يمكنك فعله به',
  'What you get': 'ما تحصل عليه',
  'what you were doing, and what happened instead of what you expected;':
    'ما كنت تفعله، وما حدث بدلًا مما كنت تتوقعه؛',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'يعتمد مكان معالجة ملفاتك على طريقة تشغيل {brand}، ولم يستجب الخادم قبل قليل. راجع [سياسة الخصوصية](/privacy).',
  'Where your files are processed depends on how {brand} is run.':
    'يعتمد مكان معالجة ملفاتك على طريقة تشغيل {brand}.',
  'Which files can I use, and what are the limits?':
    'ما الملفات التي يمكنني استخدامها، وما الحدود؟',
  'Which languages are supported?': 'ما اللغات المدعومة؟',
  'Who builds it': 'من يبنيه',
  'Who runs this website': 'من يدير هذا الموقع',
  'Why it exists': 'لماذا وُجد',
  'Working…': 'جارٍ العمل…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'نعم. إنه مجاني، ولا يوجد حساب ولا تسجيل دخول إطلاقًا. لا توجد حصة يومية ولا شهرية ولا جدار دفع؛ والإعلانات هي التي تُبقي الموقع مجانيًا.',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'نعم. إنه مجاني، ولا يوجد حساب ولا تسجيل دخول إطلاقًا. لا توجد حصة يومية ولا شهرية ولا جدار دفع.',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'نعم. إنه مجاني، ولا يوجد ما تسجّل فيه ولا تسجيل دخول. تعمل هذه النسخة على حاسوبك، فلا توجد حصة ولا جدار دفع؛ وتعتمد سرعة العمل على حاسوبك.',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'نعم. استخدم القلم بجوار السطر لتغيير نصه أو حذفه، أو ابحث واستبدل في التفريغ كله. وتُضمَّن تعديلاتك في كل تصدير.',
  'You agree not to:': 'أنت توافق على عدم:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'أنت صاحب القرار: احذف تفريغاتك وملفاتك، وإن شئت نماذج الكلام التي نُزّلت، في أي وقت باستخدام **حذف بياناتي الآن**. فهو يحذف البيانات في هذا المتصفح فقط؛ ولا يستطيع حذف ملفات تعريف الارتباط الخاصة بـ Google.',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'يمكنك تغييره في أي وقت من **إعدادات الخصوصية وملفات تعريف الارتباط** في أسفل أي صفحة تعرض إعلانات (مثل الصفحة الرئيسية).',
  'You can now read, fix and download it.': 'يمكنك الآن قراءته وتصحيحه وتنزيله.',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'يمكنك التوقف عن استخدام الخدمة في أي وقت وحذف البيانات في هذا المتصفح باستخدام **حذف بياناتي الآن**. ويجوز لنا تعليق وصولك أو إنهاؤه في أي وقت، ولا سيما إذا خالفت هذه الشروط.',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'تحتفظ بجميع الحقوق في الملفات التي تضيفها وفي التفريغات الناتجة عنها. وتُعالَج على جهازك ولا نتلقاها أبدًا. وأنت مسؤول عما تفرّغه: لا تستخدم إلا محتوى تملكه أو لك الحق في معالجته، بما في ذلك أي إذن مطلوب من الأشخاص الذين يتحدثون فيه.',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'يمكنك إلغاء الاشتراك في الإعلانات المخصّصة بزيارة [إعدادات إعلانات Google](https://adssettings.google.com)، أو إلغاء اشتراكك في استخدام بعض موردي الجهات الخارجية لملفات تعريف الارتباط للإعلانات المخصّصة عبر [www.aboutads.info](https://www.aboutads.info). تعرّف على [كيفية استخدام Google للمعلومات من المواقع التي تستخدم خدماتها](https://policies.google.com/technologies/partner-sites).',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'متصفحك وإصداره، وجهازك (حاسوب أو هاتف، ونظام التشغيل فيه)؛',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'منع متصفحك النسخ هنا. استخدم «تصدير» لحفظ النص بدلًا من ذلك.',
  'Your change is saved.': 'تم حفظ تغييرك.',
  'Your change is still in its box: press Save to try again.':
    'ما زال تغييرك في خانته: اضغط «حفظ» للمحاولة مرة أخرى.',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'يُرسل ملفك إلى الخادم عبر اتصال مشفّر، ويُفرَّغ باستخدام نماذج مفتوحة للتعرّف على الكلام مثل OpenAI Whisper، ثم يُحذف تلقائيًا بعد ذلك. توضّح صفحة [كيف يعمل](/how-it-works) كل خطوة.',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'يُفرَّغ ملفك في متصفحك على جهازك، لذا لا نضع أي حد للحجم أو المدة. وتعمل الملفات الكبيرة جدًا أو الطويلة أيضًا: فهي تستغرق وقتًا أطول وتحتاج إلى ذاكرة حرة كافية، وتحذّرك الصفحة عندما قد يكون جهازك بطيئًا.',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'يُفرَّغ ملفك باستخدام نماذج مفتوحة للتعرّف على الكلام مثل OpenAI Whisper، ثم يُحذف تلقائيًا بعد ذلك.',
  'Your file never leaves your device.': 'ملفك لا يغادر جهازك أبدًا.',
  'Your file never leaves your device. [Privacy](/privacy)':
    'ملفك لا يغادر جهازك أبدًا. [الخصوصية](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'ملفك لا يغادر جهازك أبدًا. يُفرَّغ في متصفحك على هذا الجهاز ولا يُرفع إلينا ولا إلى أي جهة أخرى. وتُحفظ التفريغات وتعديلاتك والملف في تخزين هذا المتصفح فقط، وتُحذف تلقائيًا بعد {idle} من عدم النشاط، أو فورًا عند الضغط على **حذف بياناتي الآن** في قائمة التفريغات. لا يوجد حساب. صدّر ما تحتاجه قبل المغادرة.',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'ملفك لا يغادر جهازك أبدًا. يُفرَّغ مباشرةً في متصفحك، دون حساب، وتبقى تفريغاتك في هذا المتصفح.',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'ملفك يبقى على هذا الجهاز. أبقِ هذا التبويب مفتوحًا أثناء التفريغ.',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'تُحفظ ملفاتك وتفريغاتك لهذه الجلسة فقط وتُحذف تلقائيًا بعد {idle} من عدم النشاط، أو عند الضغط على «حذف بياناتي الآن». بلا حساب وبلا تتبّع، مع ملف تعريف ارتباط واحد أساسي للجلسة. صدّر ما تحتاجه قبل المغادرة.',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'تُحفظ ملفاتك وتفريغاتك لهذه الجلسة فقط وتُحذف تلقائيًا عند انتهائها، أو عند الضغط على «حذف بياناتي الآن». بلا حساب وبلا تتبّع، مع ملف تعريف ارتباط واحد أساسي للجلسة. صدّر ما تحتاجه قبل المغادرة.',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'تُحذف ملفاتك تلقائيًا. [الخصوصية](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'تُعالَج ملفاتك في متصفحك وتبقى على جهازك. يستخدم الموقع والتنزيلات والعدّاد اتصالات مشفّرة (HTTPS). ويستطيع أي شخص يمكنه استخدام ملف تعريف هذا المتصفح أن يرى التفريغات المخزّنة فيه إلى أن تُحذف، لذا اضغط **حذف بياناتي الآن** على الحاسوب المشترك.',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'تُرفع ملفاتك إلى خادمنا ليجري معالجتها هناك. وتُحفظ لجلستك فقط وتُحذف تلقائيًا عند انتهائها، أو بعد {idle} من عدم النشاط، أو فورًا عند الضغط على **حذف بياناتي الآن** في قائمة التفريغات. لا يوجد حساب ولا تتبّع، وملف تعريف الارتباط الوحيد هو ملف أساسي واحد للجلسة (دون ملفات تعريف ارتباط للتحليلات أو الإعلانات).',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'تُرفع ملفاتك إلى خادمنا ليجري معالجتها هناك. وتُحفظ لجلستك فقط وتُحذف تلقائيًا عند انتهائها، أو فورًا عند الضغط على **حذف بياناتي الآن** في قائمة التفريغات. لا يوجد حساب ولا تتبّع، وملف تعريف الارتباط الوحيد هو ملف أساسي واحد للجلسة (دون ملفات تعريف ارتباط للتحليلات أو الإعلانات).',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'ملفاتك لا تغادر هذا الجهاز أبدًا. تُحفظ التفريغات في هذا المتصفح فقط وتُحذف تلقائيًا بعد {idle} من عدم النشاط، أو عند الضغط على «حذف بياناتي الآن». صدّر ما تحتاجه قبل المغادرة.',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'ملفاتك لا تغادر هذا الجهاز أبدًا. تُحفظ التفريغات في هذا المتصفح فقط وتُحذف تلقائيًا عند انتهاء الجلسة، أو عند الضغط على «حذف بياناتي الآن». صدّر ما تحتاجه قبل المغادرة.',
  'Your session ends in {mins} min. Export what you need.':
    'تنتهي جلستك بعد {mins} د. صدّر ما تحتاجه.',
  'Your session has ended': 'انتهت جلستك',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'انتهت جلستك وحُذفت بياناتها. يمكنك بدء تفريغ جديد.',
  'Your transcript is ready below.': 'تفريغك جاهز أدناه.',
  'Your transcripts': 'تفريغاتك',
  'Your transcripts and files were removed from the server.': 'أُزيلت تفريغاتك وملفاتك من الخادم.',
  'Your transcripts and files were removed from this device.':
    'أُزيلت تفريغاتك وملفاتك من هذا الجهاز.',
  'title:/': 'تحويل الفيديو إلى نص مجانًا بلا تسجيل',
  'description:/':
    'تحويل الفيديو والصوت إلى نص مجانًا. بلا تسجيل دخول ولا حد يومي وبأكثر من 50 لغة. احصل على نص بطوابع زمنية وصدّره بصيغة SRT أو VTT أو TXT أو PDF.',
  'title:/about': 'عن TranscribeVid',
  'description:/about':
    'من يبني TranscribeVid ولماذا: أداة مجانية لتحويل الفيديو والصوت إلى نص دون تسجيل أو تسجيل دخول وبواجهة نظيفة، وتُموَّل بالإعلانات.',
  'title:/audio-to-text': 'محوّل الصوت إلى نص: مجاني وبلا حدود',
  'description:/audio-to-text':
    'حوّل البودكاست والمقابلات والمحاضرات إلى نص. محوّل مجاني من الصوت إلى نص بطوابع زمنية وأكثر من 50 لغة وبلا تسجيل دخول. نزّل TXT أو SRT أو VTT أو PDF.',
  'label:/audio-to-text': 'الصوت إلى نص',
  'title:/contact': 'تواصل معنا',
  'description:/contact':
    'كيف تتواصل مع TranscribeVid: البريد الإلكتروني للأسئلة وتقارير الأخطاء وأفكار الميزات وطلبات الخصوصية، ومن يدير الموقع.',
  'title:/faq': 'الأسئلة الشائعة',
  'description:/faq':
    'إجابات عن الأسئلة الشائعة حول TranscribeVid: الدقة واللغات والملفات المدعومة والحدود والسرعة والخصوصية والتعديل.',
  'title:/guides': 'الأدلة',
  'description:/guides':
    'أدلة عملية عن التفريغ والترجمات: SRT أم VTT، وكيف تضيف ترجمات إلى فيديو، وكيف تحصل على تفريغ دقيق، والتفريغ الخاص.',
  'title:/guides/accurate-transcripts': 'كيف تحصل على تفريغ نصي أدق',
  'description:/guides/accurate-transcripts':
    'طرق عملية لتحسين دقة تحويل الكلام إلى نص: صوت أنظف، واللغة والنموذج المناسبان، وتلميح المفردات، وكيفية فحص النتيجة وتصحيحها.',
  'label:/guides/accurate-transcripts': 'كيف تحصل على تفريغ نصي أدق',
  'title:/guides/how-to-add-subtitles-to-a-video': 'كيف تضيف ترجمات إلى فيديو (مجانًا)',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'أنشئ ترجمات في أربع خطوات: فرّغ الفيديو، وصحّح النص، وصدّر SRT أو VTT، ثم أضف الملف إلى يوتيوب أو VLC أو برنامج مونتاج أو مشغّل الويب.',
  'label:/guides/how-to-add-subtitles-to-a-video': 'كيف تضيف ترجمات إلى فيديو',
  'title:/guides/srt-vs-vtt': 'SRT أم VTT: أي صيغة ترجمة تستخدم',
  'description:/guides/srt-vs-vtt':
    'SRT أم VTT؟ ما هي كل صيغة ترجمة، وكيف تختلفان، وأين تعمل كل منهما، وكيف تحصل على أي من الملفين من الفيديو مجانًا.',
  'label:/guides/srt-vs-vtt': 'SRT أم VTT',
  'title:/guides/transcribe-video-without-uploading': 'تفريغ فيديو دون رفعه',
  'description:/guides/transcribe-video-without-uploading':
    'كيف يعمل التفريغ داخل المتصفح، وما الذي يبقى على جهازك، وما الذي يُنزَّل مرة واحدة، وكيف تتحقق بنفسك من لوحة الشبكة في متصفحك.',
  'label:/guides/transcribe-video-without-uploading': 'تفريغ فيديو دون رفعه',
  'title:/guides/what-is-whisper': 'ما هو Whisper؟ شرح تحويل الكلام إلى نص',
  'description:/guides/what-is-whisper':
    'ما هو OpenAI Whisper، وعلى ماذا دُرّب، وما مدى دقته وأين يتعثر، وكيف يعمل داخل متصفحك على TranscribeVid.',
  'label:/guides/what-is-whisper': 'ما هو Whisper؟',
  'title:/how-it-works': 'كيف يعمل',
  'description:/how-it-works':
    'كيف يحوّل TranscribeVid الفيديو والصوت إلى نص دقيق بطوابع زمنية في ثلاث خطوات بسيطة، وما الذي تحصل عليه، ونصائح لأفضل النتائج.',
  'title:/interview-transcription': 'تفريغ المقابلات: خاص ومجاني',
  'description:/interview-transcription':
    'فرّغ المقابلات مجانًا دون إنشاء حساب. نص بطوابع زمنية بأكثر من 50 لغة، مناسب للبحث والصحافة والتوظيف. نزّل TXT أو PDF.',
  'label:/interview-transcription': 'تفريغ المقابلات',
  'title:/lecture-to-text': 'المحاضرة إلى نص: مفرّغ محاضرات مجاني',
  'description:/lecture-to-text':
    'حوّل محاضرة مسجّلة إلى ملاحظات نصية يمكنك البحث فيها ومذاكرتها. مجانًا وبلا تسجيل وبأكثر من 50 لغة وطوابع زمنية. نزّل TXT أو Markdown أو SRT أو PDF.',
  'label:/lecture-to-text': 'المحاضرة إلى نص',
  'title:/m4a-to-text': 'M4A إلى نص: تفريغ المذكرات الصوتية',
  'description:/m4a-to-text':
    'حوّل مذكرة صوتية أو تسجيلًا بصيغة M4A إلى نص مجانًا. يعمل مع مذكرات iPhone الصوتية، وبلا تسجيل دخول وبأكثر من 50 لغة وطوابع زمنية. نزّل TXT أو SRT أو PDF.',
  'label:/m4a-to-text': 'M4A إلى نص',
  'title:/meeting-recording-to-text': 'تسجيل Zoom وTeams وMeet إلى نص',
  'description:/meeting-recording-to-text':
    'حوّل تسجيل Zoom أو Teams أو Google Meet إلى تفريغ نصي قابل للبحث وبطوابع زمنية مجانًا. بلا تسجيل دخول وبأكثر من 50 لغة. نزّل TXT أو SRT أو VTT أو PDF.',
  'label:/meeting-recording-to-text': 'تسجيل الاجتماع إلى نص',
  'title:/mov-to-text': 'MOV إلى نص: تفريغ فيديو iPhone مجانًا',
  'description:/mov-to-text':
    'فرّغ فيديو MOV من iPhone أو QuickTime مجانًا. بلا تسجيل دخول وبأكثر من 50 لغة وطابع زمني على كل سطر. نزّل TXT أو SRT أو VTT أو PDF.',
  'label:/mov-to-text': 'MOV إلى نص',
  'title:/mp3-to-text': 'محوّل MP3 إلى نص: تفريغ مجاني',
  'description:/mp3-to-text':
    'حوّل ملف MP3 إلى نص عبر الإنترنت مجانًا. بلا تسجيل دخول وبأكثر من 50 لغة وطابع زمني على كل سطر. عدّل النص ونزّل TXT أو SRT أو VTT أو PDF.',
  'label:/mp3-to-text': 'MP3 إلى نص',
  'title:/mp4-to-text': 'MP4 إلى نص: تفريغ فيديو MP4 مجانًا',
  'description:/mp4-to-text':
    'حوّل فيديو MP4 إلى نص بطوابع زمنية. مجانًا وبلا تسجيل دخول ولا حد يومي وبأكثر من 50 لغة. نزّل TXT أو SRT أو VTT أو Markdown أو JSON أو PDF.',
  'label:/mp4-to-text': 'MP4 إلى نص',
  'title:/podcast-transcript-generator': 'مولّد تفريغ البودكاست المجاني',
  'description:/podcast-transcript-generator':
    'أنشئ تفريغًا لحلقة بودكاست من ملف MP3 أو WAV مجانًا. طوابع زمنية وأكثر من 50 لغة وبلا تسجيل دخول. عدّله ثم نزّل TXT أو Markdown أو SRT أو VTT أو PDF.',
  'label:/podcast-transcript-generator': 'مولّد تفريغ البودكاست',
  'title:/privacy': 'سياسة الخصوصية',
  'description:/privacy':
    'ما يعالجه TranscribeVid عند تفريغ ملف وأين، ولماذا، ومدة الاحتفاظ، وملفات تعريف الارتباط والإعلانات وتخزين المتصفح، وحقوقك.',
  'title:/srt-subtitle-generator': 'مولّد ترجمات SRT المجاني من الفيديو',
  'description:/srt-subtitle-generator':
    'أنشئ ملف ترجمة SRT من أي فيديو أو صوت مجانًا. متزامن مع الكلام وبأكثر من 50 لغة وبلا تسجيل دخول. عدّل الأسطر ثم نزّل SRT أو VTT.',
  'label:/srt-subtitle-generator': 'مولّد ترجمات SRT',
  'title:/terms': 'شروط الاستخدام',
  'description:/terms':
    'قواعد استخدام TranscribeVid: الخدمة المجانية ومحتواك والاستخدام المقبول وحدود الملفات وعدم الضمان لدقة التفريغ والمسؤولية.',
  'title:/tools': 'كل الأدوات المجانية',
  'description:/tools':
    'كل أدوات تحويل الفيديو والصوت إلى نص المجانية في قائمة واحدة: حسب نوع الملف وحسب الاستخدام وملفات الترجمة واللغات. بلا تسجيل ولا حد يومي.',
  'title:/translate-audio-to-english': 'ترجمة الكلام إلى نص إنجليزي مجانًا',
  'description:/translate-audio-to-english':
    'حوّل الكلام بلغة أخرى إلى نص إنجليزي مجانًا. ارفع ملف فيديو أو صوت واحصل على نص أو ترجمات إنجليزية بطوابع زمنية. بلا تسجيل دخول. SRT وVTT وTXT.',
  'label:/translate-audio-to-english': 'ترجمة الكلام إلى الإنجليزية',
  'title:/video-to-text': 'محوّل الفيديو إلى نص مجاني بلا تسجيل',
  'description:/video-to-text':
    'حوّل الفيديو إلى نص مجانًا. احصل على تفريغ دقيق بطوابع زمنية بأكثر من 50 لغة. بلا تسجيل دخول ولا حد يومي. نزّل SRT أو VTT أو TXT أو PDF.',
  'label:/video-to-text': 'الفيديو إلى نص',
  'title:/voice-recording-to-text': 'التسجيل الصوتي إلى نص: مفرّغ مجاني',
  'description:/voice-recording-to-text':
    'سجّل صوتك في المتصفح أو ارفع مذكرة صوتية واحصل عليها نصًا. مجانًا وبلا تسجيل دخول وبأكثر من 50 لغة. نزّل TXT أو PDF أو SRT أو Markdown.',
  'label:/voice-recording-to-text': 'التسجيل الصوتي إلى نص',
  'title:/vtt-subtitle-generator': 'مولّد ترجمات VTT (WebVTT) المجاني',
  'description:/vtt-subtitle-generator':
    'أنشئ ملف ترجمة WebVTT (.vtt) من أي فيديو أو صوت مجانًا. متزامن مع الكلام وبأكثر من 50 لغة وبلا تسجيل دخول. عدّل الأسطر ثم نزّل VTT.',
  'label:/vtt-subtitle-generator': 'مولّد ترجمات VTT',
  'title:/wav-to-text': 'WAV إلى نص: تفريغ مجاني عبر الإنترنت',
  'description:/wav-to-text':
    'حوّل ملف WAV إلى نص مجانًا. يتعامل مع التسجيلات الطويلة من أجهزة التسجيل الميداني والمكالمات، بأكثر من 50 لغة وطوابع زمنية وبلا تسجيل. نزّل TXT أو SRT أو PDF.',
  'label:/wav-to-text': 'WAV إلى نص',
  'title:/webm-to-text': 'WebM إلى نص: تفريغ مجاني بلا تسجيل',
  'description:/webm-to-text':
    'حوّل ملف فيديو أو صوت WebM إلى نص مجانًا. يعمل مع تسجيلات الشاشة والمتصفح وأكثر من 50 لغة وطوابع زمنية. نزّل TXT أو SRT أو VTT أو PDF.',
  'label:/webm-to-text': 'WebM إلى نص',
  'title:/whatsapp-voice-message-to-text': 'رسالة واتساب الصوتية إلى نص مجانًا',
  'description:/whatsapp-voice-message-to-text':
    'حوّل رسالة واتساب صوتية إلى نص مجانًا. احفظ الرسالة الصوتية وأسقطها هنا واقرأها بأكثر من 50 لغة منها الهندية. بلا تسجيل دخول ولا حساب.',
  'label:/whatsapp-voice-message-to-text': 'رسالة واتساب الصوتية إلى نص',
  'title:/youtube-subtitle-generator': 'مولّد ترجمات يوتيوب: ملف SRT مجاني',
  'description:/youtube-subtitle-generator':
    'أنشئ ملف ترجمة SRT لفيديو يوتيوب الخاص بك مجانًا ودون تسجيل دخول. متزامن مع الكلام وبأكثر من 50 لغة. ارفعه في YouTube Studio.',
  'label:/youtube-subtitle-generator': 'مولّد ترجمات يوتيوب',
};

export default dict;
