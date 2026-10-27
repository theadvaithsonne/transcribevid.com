/** Hindi dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
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
  '"{name}" is {size}; the limit is {limit}.': '"{name}" का आकार {size} है; सीमा {limit} है।',
  '"{name}" is empty.': '"{name}" खाली है।',
  '"{name}" is ready. Press Transcribe to start.':
    '"{name}" तैयार है। शुरू करने के लिए ट्रांसक्राइब करें दबाएँ।',
  '“{title}” was deleted.': '“{title}” हटा दिया गया।',
  '(optional)': '(वैकल्पिक)',
  '{base} Word timing: {timing}.': '{base} शब्द-दर-शब्द टाइमिंग: {timing}।',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand} ({domain}) का संचालन **{name}**, {address} ("हम") करते हैं। आपके डेटा को कैसे और क्यों प्रोसेस किया जाता है, यह हम तय करते हैं, जैसा यहाँ बताया गया है।',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand} ({domain}) को **{name}**, {address} चलाते हैं। ज़्यादा जानकारी [हमारे बारे में](/about) पेज पर पढ़ें।',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand} आम लोगों के लिए बनी सेवा है और 13 साल से कम उम्र के बच्चों (जहाँ लागू हो वहाँ यूरोपीय संघ में 16 साल से कम) के लिए नहीं है।',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand} को **{name}** ने बनाया है और वही इसे चलाते हैं ({role}, {city} में स्थित)। मैंने इसे इसलिए बनाया कि लोगों को ट्रांसक्रिप्शन का सबसे अच्छा अनुभव मिले: पहले क्लिक से ही आसान, बिना अकाउंट बनाए, और एक साफ़-सुथरे इंटरफ़ेस के साथ जो रास्ते में न आए।',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} आम लोगों के लिए है और 13 साल से कम उम्र के बच्चों के लिए नहीं है।',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages). No ad is shown while a file is being transcribed or beside your transcript, and never on the privacy, terms or logs pages.':
    '{brand} मुफ़्त है क्योंकि इसमें विज्ञापन दिखते हैं, जो Google AdSense से आते हैं। विज्ञापन सिर्फ़ जानकारी वाले पेजों (होम, यह कैसे काम करता है, अक्सर पूछे जाने वाले सवाल और टूल पेज) पर दिखते हैं। फ़ाइल ट्रांसक्राइब होते समय या आपकी ट्रांसक्रिप्ट के बगल में कोई विज्ञापन नहीं दिखता, और प्राइवेसी, शर्तों या लॉग पेज पर कभी नहीं।',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    '{brand} इस्तेमाल करने के लिए मुफ़्त है। आपकी फ़ाइलों का क्या होता है, यह [प्राइवेसी पॉलिसी](/privacy) में बताया गया है।',
  '{brand} is funded by ads shown on its information pages (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand} का खर्च जानकारी वाले पेजों पर दिखने वाले विज्ञापनों (Google AdSense) से चलता है। ट्रांसक्रिप्शन आपका अपना डिवाइस करता है, इसलिए हर फ़ाइल के लिए सर्वर का कोई खर्च नहीं आता, और यही सेवा को मुफ़्त और असीमित रखता है। विज्ञापन क्या इस्तेमाल करते हैं और आप अपनी सेटिंग कैसे चुन सकते हैं, यह [प्राइवेसी पॉलिसी](/privacy) में बताया गया है।',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand} तीन आसान चरणों में किसी वीडियो या ऑडियो फ़ाइल की बोली को टाइमस्टैम्प वाले टेक्स्ट में बदलता है।',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand} वीडियो, ऑडियो फ़ाइलों और वॉइस रिकॉर्डिंग की बोली को सटीक, टाइमस्टैम्प वाले टेक्स्ट में बदलता है। यह मुफ़्त है, कितनी भी फ़ाइलें ट्रांसक्राइब करने की कोई सीमा नहीं है, और अकाउंट की ज़रूरत नहीं: ऊपर फ़ाइल चुनें, ट्रांसक्राइब करें दबाएँ और नतीजा पढ़ें।',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand} वीडियो और ऑडियो फ़ाइलों को सीधे आपके ब्राउज़र में टेक्स्ट में बदलता है: पहचान का काम आपके डिवाइस पर होता है, और आपकी फ़ाइलें हमें अपलोड नहीं होतीं। इसका इस्तेमाल मुफ़्त है और अकाउंट की ज़रूरत नहीं। इसका खर्च जानकारी वाले पेजों पर दिखने वाले विज्ञापनों (Google AdSense; [प्राइवेसी पॉलिसी](/privacy) देखें) से चलता है। हम किसी भी समय सुविधाएँ बदल, सीमित या बंद कर सकते हैं।',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand} वीडियो और ऑडियो को मुफ़्त में सटीक, टाइमस्टैम्प वाले टेक्स्ट में बदलता है। न साइन-अप, न साइन-इन और न कोई वॉटरमार्क: पेज खोलें, फ़ाइल चुनें और अपनी ट्रांसक्रिप्ट पढ़ें।',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages, and are served by Google, which uses cookies.':
    '{brand} वीडियो और ऑडियो को सीधे आपके ब्राउज़र में टेक्स्ट में बदलता है। यह पेज आम भाषा में बताता है कि इसमें आपके डेटा का क्या होता है। संक्षेप में: आपकी फ़ाइल आपके डिवाइस से बाहर नहीं जाती। आपकी ट्रांसक्रिप्ट सिर्फ़ इसी ब्राउज़र में रहती हैं, कोई अकाउंट नहीं है, और साइट अपनी कोई कुकी नहीं लगाती। विज्ञापन सिर्फ़ जानकारी वाले पेजों पर दिखते हैं, और Google उन्हें दिखाता है, जो कुकी का इस्तेमाल करता है।',
  '{done} of {total}': '{total} में से {done}',
  '{duration} (estimate)': '{duration} (अनुमान)',
  '{gb} GB of memory recommended': '{gb} GB मेमोरी सुझाई जाती है',
  '{h} h': '{h} घं',
  '{h} h {m} min': '{h} घं {m} मि',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)':
    '{label} (पहली बार इस्तेमाल पर {size} MB डाउनलोड होगा)',
  "{label}, as reported by visitors' browsers":
    '{label}, जैसा आने वाले लोगों के ब्राउज़र बताते हैं',
  '{label}: common questions': '{label}: अक्सर पूछे जाने वाले सवाल',
  '{label}. {title}.': '{label}। {title}।',
  '{label}. Look for it in your downloads.': '{label}। इसे अपने डाउनलोड में देखें।',
  '{language} → English': '{language} → अंग्रेज़ी',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} {total} में से {done} फ़ाइलें पहले ही कतार में लग चुकी थीं; बाकी {left} अब भी सूची में हैं, दोबारा कोशिश करने के लिए ट्रांसक्राइब करें दबाएँ।',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} {total} में से {done} फ़ाइलें पहले ही कतार में लग चुकी थीं; बाकी {left} अब भी सूची में है, दोबारा कोशिश करने के लिए ट्रांसक्राइब करें दबाएँ।',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    'इस डिवाइस पर {model} असली समय से धीमा चलता है: {audio} की ऑडियो के लिए {wait} (अनुमान)। Tiny या Base जल्दी खत्म होते हैं।',
  '{n} files were skipped: not video or audio.':
    '{n} फ़ाइलें छोड़ दी गईं: वे वीडियो या ऑडियो नहीं हैं।',
  '{n} h ago': '{n} घंटे पहले',
  '{n} min': '{n} मिनट',
  '{n} min ago': '{n} मिनट पहले',
  '{n} min left': '{n} मिनट बाकी',
  '{n} min read': '{n} मिनट में पढ़ें',
  '{n} minute': '{n} मिनट',
  '{n} minutes': '{n} मिनट',
  '{n} of {total}': '{total} में से {n}',
  '{n} of those files are already in the list.': 'उनमें से {n} फ़ाइलें पहले से सूची में हैं।',
  '{n} video transcribed': '{n} वीडियो ट्रांसक्राइब हुआ',
  '{n} videos transcribed': '{n} वीडियो ट्रांसक्राइब हुए',
  '{n} words': '{n} शब्द',
  '{n}% done': '{n}% पूरा',
  '{n}% model confidence': 'मॉडल का भरोसा {n}%',
  '{n}s left': '{n} सेकंड बाकी',
  '{name} home': '{name} होम',
  '{size} download': '{size} डाउनलोड',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}।',
  '{title}. {blurb}': '{title}। {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}। {blurb} इस डिवाइस पर उपलब्ध नहीं: {reason}।',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**इस टैब का तकनीकी लॉग।** लॉग पेज इसी टैब का अपना तकनीकी लॉग दिखाता है। वह आपके ब्राउज़र में रहता है और कहीं भेजा नहीं जाता।',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**शब्दावली संकेत जोड़ें**: ऑडियो में आने वाले नाम, ब्रांड और खास शब्द, उसी वर्तनी में जैसी आप चाहते हैं।',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**शब्दावली संकेत जोड़ें**: नाम, ब्रांड और खास शब्द, उसी वर्तनी में जैसी आप चाहते हैं।',
  '**Ads.** Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript.':
    '**विज्ञापन।** विज्ञापन सिर्फ़ जानकारी वाले पेजों पर दिखते हैं, और Google उन्हें दिखाता है, जो कुकी का इस्तेमाल करता है। फ़ाइल ट्रांसक्राइब होते समय या आपकी ट्रांसक्रिप्ट के बगल में कोई विज्ञापन नहीं दिखता।',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**निशान लगी लाइनें जाँचें** और उन्हें ट्रांसक्रिप्ट एडिटर में ठीक करें।',
  '**Choose the spoken language** instead of auto-detect.':
    'अपने आप पहचानने के बजाय **बोली जाने वाली भाषा चुनें**।',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**अपनी फ़ाइल चुनें।** ऊपर कोई वीडियो या ऑडियो फ़ाइल छोड़ें, अपने डिवाइस से चुनें, या माइक्रोफ़ोन से अपनी आवाज़ रिकॉर्ड करें। MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG और ज़्यादातर आम फ़ॉर्मैट चलते हैं।',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**ऑडियो बेहतर करें** — गड़गड़ाहट और सरसराहट छानें, धीमी आवाज़ों को बराबर करें',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**फ़ाइल की सीमा।** हमारी तरफ़ से कोई नहीं। आपकी फ़ाइल आपके डिवाइस पर प्रोसेस होती है, इसलिए बहुत बड़ी या लंबी फ़ाइलों में ज़्यादा समय लगता है और काफ़ी खाली मेमोरी चाहिए; धीमे डिवाइस पर पेज आपको पहले से चेतावनी देता है।',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**फ़ाइल के प्रकार।** वीडियो: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS और MTS। ऑडियो: MP3, WAV, M4A, AAC, FLAC, OGG और OPUS। आप सीधे अपने माइक्रोफ़ोन से भी रिकॉर्ड कर सकते हैं।',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**Google की कुकी।** विज्ञापन लोड होते समय Google अपनी कुकी लगाता है, सिर्फ़ उन पेजों पर जहाँ विज्ञापन दिखते हैं (खंड 6 देखें)।',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**लेक्चर और पॉडकास्ट**, पढ़ाई या शो नोट्स के लिए पढ़ने लायक टेक्स्ट में।',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**सीमाएँ।** सर्वर ने अभी कोई आकार या लंबाई की सीमा नहीं बताई है। बहुत बड़ी फ़ाइलों में बस ज़्यादा समय लगता है।',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**सीमाएँ।** हम आकार या लंबाई की कोई सीमा नहीं रखते: आपकी फ़ाइल आपके डिवाइस पर प्रोसेस होती है, इसलिए बहुत बड़ी या लंबी फ़ाइलों में बस ज़्यादा समय लगता है और काफ़ी खाली मेमोरी चाहिए। धीमे डिवाइस पर पेज शुरू करने से पहले बता देता है और समय का अनुमान देता है।',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**आपकी जोड़ी हुई मीडिया।** वे वीडियो या ऑडियो फ़ाइलें जो आप चुनते या रिकॉर्ड करते हैं। वे आपके डिवाइस पर आपके ब्राउज़र में प्रोसेस होती हैं (WebGPU या WebAssembly से)। आपकी फ़ाइल हमारे सर्वर पर कभी अपलोड नहीं होती और न Google या किसी और को भेजी जाती है।',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**मीटिंग और इंटरव्यू के नोट्स**, जिन्हें आप खोज सकते हैं, उद्धृत कर सकते हैं और साझा कर सकते हैं।',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**गलतियाँ होती हैं।** कोई भी स्पीच रिकग्निशन पूरी तरह सही नहीं होती। किसी अहम काम में भरोसा करने से पहले ट्रांसक्रिप्ट हमेशा जाँच लें।',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**हमारी अपनी कोई कुकी नहीं।** साइट खुद कोई कुकी नहीं लगाती।',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**बाद के लिए कुछ सेव नहीं होता।** फ़ाइलें और ट्रांसक्रिप्ट सिर्फ़ आपके सेशन तक रहती हैं। जाने से पहले जो चाहिए उसे एक्सपोर्ट कर लें। ब्योरा [प्राइवेसी पॉलिसी](/privacy) में है।',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**बाद के लिए कुछ सेव नहीं होता।** ट्रांसक्रिप्ट और फ़ाइल सिर्फ़ इसी ब्राउज़र में रहती हैं और {idle} तक कोई गतिविधि न होने पर अपने आप हट जाती हैं, या जब आप **मेरा डेटा अभी हटाएँ** दबाते हैं। जाने से पहले जो चाहिए उसे एक्सपोर्ट कर लें। ब्योरा [प्राइवेसी पॉलिसी](/privacy) में है।',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**बाद के लिए कुछ सेव नहीं होता।** ट्रांसक्रिप्ट सिर्फ़ इस सेशन तक रहती हैं, इसलिए जो चाहिए उसे एक्सपोर्ट कर लें। [प्राइवेसी पॉलिसी](/privacy) होस्ट की गई वेबसाइट के बारे में बताती है।',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**एक चलता हुआ कुल।** जब कोई ट्रांसक्रिप्शन पूरा होता है, तो आपका ब्राउज़र हमारे काउंटर (एक Cloudflare Worker) को एक गुमनाम "+1" भेजता है। उसमें कोई फ़ाइल, ट्रांसक्रिप्ट या पहचान-चिह्न नहीं होता। Cloudflare रास्ते में आपका IP पता देखता है और दुरुपयोग रोकने के लिए उसे थोड़े समय के लिए इस्तेमाल करता है (रेट लिमिट); हम सिर्फ़ कुल संख्या सेव करते हैं। पेज के हेडर में दिखने वाली संख्या आने वाले लोगों के ब्राउज़र बताते हैं और उसकी पुष्टि नहीं की जाती।',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    'मुश्किल ऑडियो के लिए **ज़्यादा सटीकता या सबसे सटीक चुनें**।',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**गुणवत्ता और भाषा चुनें।** तेज़ मॉडल जल्दी ड्राफ़्ट देता है; ज़्यादा सटीक मॉडल इंटरव्यू, लेक्चर और सबटाइटल के लिए बेहतर है। बोली जाने वाली भाषा अपने आप पहचानी जा सकती है, और 50 से ज़्यादा भाषाएँ समर्थित हैं।',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    'पूरी हो चुकी ट्रांसक्रिप्ट को किसी और गुणवत्ता या भाषा में **दोबारा ट्रांसक्राइब करें**; आपकी मौजूदा ट्रांसक्रिप्ट रखी रहती है।',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    'किसी और गुणवत्ता या भाषा में **दोबारा ट्रांसक्राइब करें**; आपकी मौजूदा ट्रांसक्रिप्ट रखी रहती है।',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**पढ़ें, सुधारें और डाउनलोड करें।** ट्रांसक्रिप्ट टाइमस्टैम्प के साथ दिखती है, और जिन शब्दों पर मॉडल को शक था उन पर निशान लगा होता है ताकि आप उन्हें जाँच सकें। इसे सादे टेक्स्ट, SRT या VTT सबटाइटल, Markdown या JSON के रूप में डाउनलोड करें।',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**वेबसाइट पहुँचाने वाले अनुरोध।** Cloudflare (Cloudflare Pages) यह वेबसाइट पहुँचाता है। हमारे होस्टिंग और नेटवर्क प्रदाता के रूप में वह साइट को पहुँचाने और सुरक्षित रखने के लिए आपका IP पता और सामान्य अनुरोध डेटा (जैसे समय, माँगा गया पेज और आपका ब्राउज़र) प्रोसेस करता है।',
  '**Skip silence & music** — prevents made-up text':
    '**खामोशी और संगीत छोड़ें** — गढ़ा हुआ टेक्स्ट बनने से रोकता है',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**स्पीच मॉडल आपके ब्राउज़र के कैश में रहते हैं** (Cache Storage), ताकि अगला ट्रांसक्रिप्शन जल्दी शुरू हो, जब तक आप उन्हें हटा न दें (**मेरा डेटा अभी हटाएँ** उन्हें भी हटा सकता है) या आपका ब्राउज़र अपनी स्टोरेज साफ़ न कर दे। वे प्रोग्राम फ़ाइलें हैं, आपका डेटा नहीं।',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**रफ़्तार।** यह आपकी चुनी गुणवत्ता, फ़ाइल की लंबाई और सेवा पर भीड़ पर निर्भर करती है।',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**रफ़्तार।** यह आपके डिवाइस, आपकी चुनी गुणवत्ता और फ़ाइल की लंबाई पर निर्भर करती है। किसी गुणवत्ता स्तर के पहले इस्तेमाल पर उसका मॉडल एक बार डाउनलोड होता है: आपका ब्राउज़र मॉडल फ़ाइलें Hugging Face से और इंजन की प्रोग्राम फ़ाइलें jsDelivr से लाता है, फिर उन्हें कैश में रखता है। काम चलने तक टैब खुला रखें।',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**अच्छी ऑडियो से शुरू करें**: कम बैकग्राउंड शोर, पास रखा माइक्रोफ़ोन, और एक समय में एक ही व्यक्ति का बोलना। "ऑडियो बेहतर करें" चालू रखें।',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**अच्छी ऑडियो से शुरू करें**: थोड़ा बैकग्राउंड शोर, पास रखा माइक्रोफ़ोन, एक समय में एक व्यक्ति। "ऑडियो बेहतर करें" चालू रखें।',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**आपके ब्राउज़र में स्टोरेज।** आपका ब्राउज़र ऊपर बताए अनुसार आपकी ट्रांसक्रिप्ट और फ़ाइलें (IndexedDB) और स्पीच मॉडल (Cache Storage) रखता है, आपकी लाइट या डार्क थीम की पसंद याद रखता है, और उसकी सेशन स्टोरेज मौजूदा टैब के लिए कुछ सुविधा वाली सेटिंग रखती है (जैसे आपकी आख़िरी चुनी गुणवत्ता)। इनमें से कुछ भी हमें नहीं भेजा जाता।',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    'अपने वीडियो, रील और ऑनलाइन कोर्स के लिए **सबटाइटल और कैप्शन**, SRT या VTT फ़ाइल से।',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**आपके डिवाइस पर बना टेक्स्ट।** ट्रांसक्रिप्ट, उसके टाइमस्टैम्प और आपके बदलाव, आपका चुना शीर्षक, और आपकी चुनी सेटिंग (गुणवत्ता, भाषा, शब्दावली संकेत)। वे इसी ब्राउज़र में बनते और रखे जाते हैं; हमें ये कभी नहीं मिलते।',
  '**Use previous text as context** — can repeat on long files':
    '**पिछले टेक्स्ट को संदर्भ की तरह इस्तेमाल करें** — लंबी फ़ाइलों में दोहराव हो सकता है',
  '**Voice memos** written out, so you do not have to listen to them again.':
    'लिखे हुए **वॉइस मेमो**, ताकि आपको उन्हें दोबारा सुनना न पड़े।',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**अलग-अलग बार, गुणवत्ता सेटिंग या दूसरे टूल में नतीजे अलग क्यों हो सकते हैं?** स्पीच रिकग्निशन संभाव्यता पर चलती है: वह सबसे संभावित शब्द चुनती है, और शोर वाले या अस्पष्ट हिस्सों में कई जवाब एक-दूसरे के करीब होते हैं। अलग गुणवत्ता सेटिंग, भाषा सेटिंग, शब्दावली संकेत या ऑडियो की सफ़ाई टेक्स्ट बदल सकती है, और दूसरा टूल भी, जो अलग सिस्टम इस्तेमाल करता है। वक्ताओं के नाम या लेबल नहीं जोड़े जाते।',
  '**Word-level timing** — better subtitles and confidence marks':
    '**शब्द-दर-शब्द टाइमिंग** — बेहतर सबटाइटल और भरोसे के निशान',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**आपकी फ़ाइलें और ट्रांसक्रिप्ट इसी ब्राउज़र में रहती हैं।** ट्रांसक्रिप्ट, एडिट और स्रोत फ़ाइल सिर्फ़ इस ब्राउज़र की स्टोरेज (IndexedDB) में रखी जाती हैं। वे आपका सेशन खत्म होने पर अपने आप हट जाती हैं, जो {idle} तक कोई गतिविधि न होने पर होता है, या ट्रांसक्रिप्ट मेन्यू में **मेरा डेटा अभी हटाएँ** दबाते ही तुरंत।',
  '1 file was skipped: not video or audio.': '1 फ़ाइल छोड़ दी गई: वह वीडियो या ऑडियो नहीं है।',
  '1 minute': '1 मिनट',
  '1 word': '1 शब्द',
  '1. Agreement': '1. सहमति',
  '1. Who runs this website': '1. यह वेबसाइट कौन चलाता है',
  '10. Children': '10. बच्चे',
  '10. Termination': '10. समाप्ति',
  '11. Children': '11. बच्चे',
  '11. Your rights and choices': '11. आपके अधिकार और विकल्प',
  '12. Changes': '12. बदलाव',
  '12. Open-source components': '12. ओपन-सोर्स घटक',
  '13. Changes to this policy': '13. इस पॉलिसी में बदलाव',
  '13. Governing law': '13. लागू कानून',
  '14. Contact': '14. संपर्क',
  '2. The service': '2. सेवा',
  '2. What is processed, and where': '2. क्या प्रोसेस होता है, और कहाँ',
  '3 simple steps': '3 आसान चरण',
  '3. Why it is processed': '3. इसे क्यों प्रोसेस किया जाता है',
  '3. Your content': '3. आपकी सामग्री',
  '4. Acceptable use': '4. स्वीकार्य उपयोग',
  '4. How long it is kept': '4. यह कितनी देर रखा जाता है',
  '5. Downloads your browser makes': '5. आपका ब्राउज़र जो डाउनलोड करता है',
  '5. Limits: your device does the work': '5. सीमाएँ: काम आपका डिवाइस करता है',
  '6. Accuracy: no warranty': '6. सटीकता: कोई वारंटी नहीं',
  '6. Advertising': '6. विज्ञापन',
  '7. Availability': '7. उपलब्धता',
  '7. Cookies and browser storage': '7. कुकी और ब्राउज़र स्टोरेज',
  '8. Sharing': '8. साझा करना',
  '8. Third-party downloads and ads': '8. तीसरे पक्ष के डाउनलोड और विज्ञापन',
  '9. Liability': '9. ज़िम्मेदारी की सीमा',
  '9. Security': '9. सुरक्षा',
  'A name cannot be empty, so the old name was kept.':
    'नाम खाली नहीं हो सकता, इसलिए पुराना नाम रखा गया।',
  'A new transcript has started. The old one is kept in your list.':
    'नई ट्रांसक्रिप्ट शुरू हो गई है। पुरानी आपकी सूची में रखी है।',
  'a period': 'कुछ समय',
  About: 'हमारे बारे में',
  'About {brand}': '{brand} के बारे में',
  'about {h} h': 'लगभग {h} घंटे',
  'about {h} h {m} min': 'लगभग {h} घंटे {m} मिनट',
  'about {n} min': 'लगभग {n} मिनट',
  'Accurate text': 'सटीक टेक्स्ट',
  'Add another file': 'एक और फ़ाइल जोड़ें',
  'Add your file': 'अपनी फ़ाइल जोड़ें',
  'Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    'विज्ञापन सिर्फ़ जानकारी वाले पेजों पर दिखते हैं, और Google उन्हें दिखाता है, जो कुकी का इस्तेमाल करता है। फ़ाइल ट्रांसक्राइब होते समय या आपकी ट्रांसक्रिप्ट के बगल में कोई विज्ञापन नहीं दिखता, और यह वेबसाइट अपनी कोई कुकी नहीं लगाती। ब्योरा [प्राइवेसी पॉलिसी](/privacy) में है।',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'किसी भी सुविधा के लिए विज्ञापनों की ज़रूरत नहीं है: विज्ञापन ब्लॉक या अस्वीकार करने पर भी सब कुछ पहले जैसा ही चलता है।',
  'Ads keep TranscribeVid free. Everything works without them.':
    'विज्ञापन TranscribeVid को मुफ़्त रखते हैं। उनके बिना भी सब कुछ चलता है।',
  Advertisement: 'विज्ञापन',
  'All free tools': 'सभी मुफ़्त टूल',
  'All free video and audio to text tools':
    'वीडियो और ऑडियो को टेक्स्ट में बदलने वाले सभी मुफ़्त टूल',
  'All tools': 'सभी टूल',
  'All your data was deleted': 'आपका सारा डेटा हटा दिया गया',
  'Allow the microphone in your browser, or choose a file instead.':
    'अपने ब्राउज़र में माइक्रोफ़ोन की अनुमति दें, या इसके बजाय कोई फ़ाइल चुनें।',
  'Already added': 'पहले से जोड़ी गई',
  'Already finished': 'पहले ही पूरी हो चुकी',
  'Also delete the downloaded speech models?': 'डाउनलोड किए गए स्पीच मॉडल भी हटाएँ?',
  'an independent software developer': 'एक स्वतंत्र सॉफ़्टवेयर डेवलपर',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'अपलोड जारी है। और फ़ाइलें जोड़ने से पहले उसके पूरा होने का इंतज़ार करें।',
  'Apply style only': 'सिर्फ़ शैली लागू करें',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    'शैली लागू करने पर सहेजी हुई पहचान इस्तेमाल होती है और ऑडियो दोबारा प्रोसेस नहीं होती। एडिट की गई लाइनें रखी जाती हैं।',
  'Audio works too.': 'ऑडियो भी चलती है।',
  'Automatic (IndicXlit when installed)': 'अपने आप (इंस्टॉल होने पर IndicXlit)',
  Back: 'वापस',
  'Basic phonetic spelling': 'सामान्य ध्वन्यात्मक वर्तनी',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'क्योंकि हमारे पास कोई अकाउंट और आपकी पहचान कराने वाला कोई ब्योरा नहीं होता, इसलिए हम आम तौर पर किसी भी डेटा को किसी व्यक्ति से नहीं जोड़ सकते। जहाँ कानून आपको अपने निजी डेटा पर अधिकार देता है, जैसे पहुँच, सुधार, हटाना, प्रतिबंध, आपत्ति और पोर्टेबिलिटी, या अपने डेटा सुरक्षा प्राधिकरण से शिकायत करने का अधिकार, वहाँ आप हमसे संपर्क करके उनका इस्तेमाल कर सकते हैं:',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'क्योंकि आपकी ट्रांसक्रिप्ट सिर्फ़ इसी ब्राउज़र में हैं, जाने से पहले जो चाहिए उसे एक्सपोर्ट कर लें। हटाया गया डेटा वापस नहीं मिल सकता।',
  'Bengaluru, India': 'बेंगलुरु, भारत',
  'Best accuracy': 'सबसे सटीक',
  'Best accuracy, slowest': 'सबसे सटीक, सबसे धीमा',
  Breadcrumb: 'नेविगेशन पथ',
  'By file type': 'फ़ाइल के प्रकार से',
  'By language': 'भाषा से',
  'By use': 'इस्तेमाल से',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    '{brand} ({domain}) का इस्तेमाल करके आप इन शर्तों से सहमत होते हैं। अगर आप सहमत नहीं हैं, तो कृपया सेवा का इस्तेमाल न करें। सेवा का संचालन **{name}**, {address} करते हैं।',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'वेबसाइट या उसके काउंटर की रेट लिमिट या सुरक्षा को पार करना या पार करने की कोशिश करना, या उसके संचालन में या दूसरे लोगों के उसके इस्तेमाल में दखल देना;',
  'Can I edit the transcript?': 'क्या ट्रांसक्रिप्ट एडिट की जा सकती है?',
  "Can't reach the server.": 'सर्वर तक नहीं पहुँच पा रहे।',
  Cancel: 'रद्द करें',
  'Cancel "{title}"?': '"{title}" रद्द करें?',
  'Cancel {title}': '{title} रद्द करें',
  'Cancellation requested': 'रद्द करने का अनुरोध किया गया',
  Cancelled: 'रद्द की गई',
  'Cancelling…': 'रद्द कर रहे हैं…',
  'Cannot reach the server': 'सर्वर तक नहीं पहुँच सके',
  'Cannot reach the server.': 'सर्वर तक नहीं पहुँच सके।',
  'Cannot reach the server. Check your connection and try again.':
    'सर्वर तक नहीं पहुँच सके। अपना कनेक्शन जाँचकर दोबारा कोशिश करें।',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'सर्वर तक नहीं पहुँच सके। पक्का करें कि वह चल रहा है (npm run dev) और दोबारा कोशिश करें।',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'कोई लाइन बदलें या हटाएँ, या खोजें और बदलें। आपके बदलाव हर डाउनलोड में रहते हैं।',
  'Changed in {n} lines.': '{n} लाइनों में बदला गया।',
  'Check Hinglish spelling': 'हिंग्लिश की वर्तनी जाँचें',
  'Choose "Save as PDF" in the print dialog.':
    'प्रिंट डायलॉग में "PDF के रूप में सेव करें" (Save as PDF) चुनें।',
  'Choose a file': 'फ़ाइल चुनें',
  'Choose a file first': 'पहले फ़ाइल चुनें',
  'Choose a format': 'फ़ॉर्मैट चुनें',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'अपने डिवाइस और आपके पास कितना समय है, इसके हिसाब से तेज़ या ज़्यादा सटीक मॉडल में से चुनें।',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'सबसे तेज़, स्टैंडर्ड, ज़्यादा सटीकता या सबसे सटीक चुनें: सबसे तेज़ सबसे जल्दी होता है, सबसे सटीक में सबसे कम गलतियाँ होती हैं।',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'बोली जाने वाली भाषा चुनें या उसे अपने आप पहचान पर छोड़ दें। आप बोली को अंग्रेज़ी में अनुवाद भी कर सकते हैं।',
  'Chosen files': 'चुनी गई फ़ाइलें',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'माइक्रोफ़ोन के पास साफ़ बोलने से सबसे अच्छा नतीजा मिलता है। और विकल्प में **ऑडियो बेहतर करें** और **खामोशी और संगीत छोड़ें** डिफ़ॉल्ट रूप से चालू हैं: वे गड़गड़ाहट और सरसराहट छानते हैं और संगीत या लंबे ठहराव के दौरान मॉडल को टेक्स्ट गढ़ने से रोकते हैं, इसलिए शोर वाली रिकॉर्डिंग के लिए उन्हें चालू रखें। सबटाइटल के लिए **शब्द-दर-शब्द टाइमिंग** भी चालू रखें, ताकि हर लाइन ठीक शब्दों के साथ शुरू और खत्म हो।',
  Close: 'बंद करें',
  'Close menu': 'मेन्यू बंद करें',
  'Close: {title}': 'बंद करें: {title}',
  'Common questions': 'अक्सर पूछे जाने वाले सवाल',
  Contact: 'संपर्क',
  'Converting…': 'बदल रहे हैं…',
  Copied: 'कॉपी हो गया',
  'Copy text': 'टेक्स्ट कॉपी करें',
  'Copying…': 'कॉपी हो रहा है…',
  'Could not cancel the transcript.': 'ट्रांसक्रिप्ट रद्द नहीं हो सकी।',
  'Could not change transcript style.': 'ट्रांसक्रिप्ट की शैली नहीं बदल सकी।',
  'Could not copy': 'कॉपी नहीं हो सका',
  'Could not delete the transcript.': 'ट्रांसक्रिप्ट हटाई नहीं जा सकी।',
  'Could not delete your data.': 'आपका डेटा हटाया नहीं जा सका।',
  'Could not load the text to copy.': 'कॉपी करने के लिए टेक्स्ट लोड नहीं हो सका।',
  'Could not prepare the file. Please try again.':
    'फ़ाइल तैयार नहीं हो सकी। कृपया दोबारा कोशिश करें।',
  'Could not rename the transcript.': 'ट्रांसक्रिप्ट का नाम नहीं बदल सका।',
  'Could not save the change.': 'बदलाव सेव नहीं हो सका।',
  'Could not start': 'शुरू नहीं हो सका',
  'Could not start.': 'शुरू नहीं हो सका।',
  Dark: 'डार्क',
  Delete: 'हटाएँ',
  'Delete "{title}" and its transcript?': '"{title}" और उसकी ट्रांसक्रिप्ट हटाएँ?',
  'Delete "{title}"? This cannot be undone.': '"{title}" हटाएँ? इसे वापस नहीं किया जा सकता।',
  'Delete {title}': '{title} हटाएँ',
  'Delete all your transcripts and the files kept in this browser now?':
    'अभी आपकी सारी ट्रांसक्रिप्ट और इस ब्राउज़र में रखी फ़ाइलें हटाएँ?',
  'Delete all your transcripts and uploaded files now?':
    'अभी आपकी सारी ट्रांसक्रिप्ट और अपलोड की गई फ़ाइलें हटाएँ?',
  'Delete line': 'लाइन हटाएँ',
  'Delete my data now': 'मेरा डेटा अभी हटाएँ',
  'Delete this line from the transcript?': 'इस लाइन को ट्रांसक्रिप्ट से हटाएँ?',
  'Delete transcript': 'ट्रांसक्रिप्ट हटाएँ',
  Deleted: 'हटा दिया गया',
  'Detect automatically': 'अपने आप पहचानें',
  'Dismiss message': 'संदेश बंद करें',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3 सिर्फ़ अंग्रेज़ी बोली समझता है। अनुवाद के लिए कोई दूसरा मॉडल चुनें।',
  Done: 'पूरा हुआ',
  'Download failed': 'डाउनलोड विफल रहा',
  'Download started': 'डाउनलोड शुरू हो गया',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'नतीजे को सादे टेक्स्ट, SRT या VTT सबटाइटल, Markdown या JSON के रूप में डाउनलोड करें।',
  'Download the transcript as': 'ट्रांसक्रिप्ट इस रूप में डाउनलोड करें',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'स्पीच मॉडल डाउनलोड हो रहा है (सिर्फ़ पहली बार): {total} में से {loaded}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    '[होम पेज](/) पर कोई वीडियो या ऑडियो फ़ाइल छोड़ें, या माइक्रोफ़ोन से रिकॉर्ड करें।',
  'Drop to add your file': 'फ़ाइल जोड़ने के लिए यहाँ छोड़ें',
  'Drop your {noun} here, or choose a file': '{noun} यहाँ छोड़ें या फ़ाइल चुनें',
  'Each line with its time, like [00:12]': 'हर लाइन अपने समय के साथ, जैसे [00:12]',
  Edit: 'एडिट करें',
  'Edit it right here': 'इसे यहीं एडिट करें',
  'Edit this line': 'इस लाइन को एडिट करें',
  'Edited by you': 'आपने एडिट किया',
  'English only, very fast and accurate': 'सिर्फ़ अंग्रेज़ी, बहुत तेज़ और सटीक',
  'English translation is selected in More options.': 'और विकल्प में अंग्रेज़ी अनुवाद चुना गया है।',
  'Enter saves · Esc cancels': 'Enter से सेव, Esc से रद्द',
  'Every line has a time. Play the media from any line to hear what was said.':
    'हर लाइन के साथ समय होता है। किसी भी लाइन से मीडिया चलाकर सुनें कि क्या कहा गया।',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'हर पेज एक ही काम करता है: वह वीडियो या ऑडियो फ़ाइल की बोली को टेक्स्ट में बदलता है, हर लाइन पर टाइमस्टैम्प के साथ, 50 से ज़्यादा भाषाओं में, बिना साइन-अप के। वह पेज चुनें जो आपकी फ़ाइल या आपके बनाने के मक़सद से मेल खाता हो।',
  'Experimental: compare on your audio; chunk timestamps':
    'प्रयोगात्मक: अपनी ऑडियो पर तुलना करें; खंड-स्तर के टाइमस्टैम्प',
  'Experimental: larger model; chunk timestamps': 'प्रयोगात्मक: बड़ा मॉडल; खंड-स्तर के टाइमस्टैम्प',
  Export: 'एक्सपोर्ट',
  Failed: 'विफल',
  FAQ: 'FAQ',
  Fast: 'तेज़',
  'Fast, clean audio': 'तेज़, साफ़ ऑडियो के लिए',
  Fastest: 'सबसे तेज़',
  'Fastest, rough drafts only': 'सबसे तेज़, सिर्फ़ मोटे ड्राफ़्ट के लिए',
  'Fewer mistakes. Takes longer.': 'कम गलतियाँ। ज़्यादा समय लगता है।',
  'Fewest mistakes. Takes the longest.': 'सबसे कम गलतियाँ। सबसे ज़्यादा समय लगता है।',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    'फ़ाइल "{name}" का आकार {size} है; सीमा {limit} है - इसे बढ़ाने के लिए VT_MAX_UPLOAD_MB सेट करें',
  'File "{name}" is {size}; the limit is {limit}.':
    'फ़ाइल "{name}" का आकार {size} है; सीमा {limit} है।',
  'file {n} of {total}': 'फ़ाइल {n}/{total}',
  'File added': 'फ़ाइल जोड़ी गई',
  'File limits.': 'फ़ाइल की सीमाएँ।',
  'File not added': 'फ़ाइल नहीं जोड़ी गई',
  'File skipped': 'फ़ाइल छोड़ दी गई',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'फ़ाइलें और ट्रांसक्रिप्ट सिर्फ़ आपके सेशन तक रहती हैं। जाने से पहले जो चाहिए उसे एक्सपोर्ट कर लें। हम सिर्फ़ एक गुमनाम चलता हुआ कुल रखते हैं, कि साइट पर कितनी फ़ाइलें ट्रांसक्राइब हुईं (एक अकेली संख्या, जो पेज के हेडर में दिखती है); वह आपसे, आपकी फ़ाइलों से या आपके सेशन से जुड़ी नहीं है। ब्योरा [प्राइवेसी पॉलिसी](/privacy) में है।',
  'Find it automatically': 'अपने आप खोजें',
  'first time only, also downloads the {size} MB word-timing model':
    'सिर्फ़ पहली बार, {size} MB का शब्द-टाइमिंग मॉडल भी डाउनलोड होता है',
  'First time only: downloads {size} (needs internet)':
    'सिर्फ़ पहली बार: {size} डाउनलोड होता है (इंटरनेट चाहिए)',
  'Follow playback': 'प्लेबैक के साथ चलें',
  'Following playback': 'प्लेबैक के साथ चल रहा है',
  Footer: 'फ़ुटर',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'लहजे वाली या मिली-जुली भाषाओं की बोली के लिए ऊँची गुणवत्ता सेटिंग आज़माएँ। भरोसे का स्कोर सटीकता का प्रतिशत नहीं है।',
  'For developers: words, times, confidence': 'डेवलपर के लिए: शब्द, समय, भरोसा',
  'For notes apps': 'नोट्स ऐप के लिए',
  'For video players and editors': 'वीडियो प्लेयर और एडिटर के लिए',
  'For YouTube and web video': 'YouTube और वेब वीडियो के लिए',
  Free: 'मुफ़्त',
  'Free tools': 'मुफ़्त टूल',
  'Free tools:': 'मुफ़्त टूल:',
  'Free video and audio to text': 'वीडियो और ऑडियो से टेक्स्ट, मुफ़्त',
  'Free video and audio to text, right in your browser':
    'वीडियो और ऑडियो से टेक्स्ट, मुफ़्त, सीधे आपके ब्राउज़र में',
  'Free, unlimited, and no login needed': 'मुफ़्त, असीमित, और लॉगिन की ज़रूरत नहीं',
  'Free, unlimited, no login': 'मुफ़्त, असीमित, बिना लॉगिन',
  'Frequently asked questions': 'अक्सर पूछे जाने वाले सवाल',
  'Get in touch': 'संपर्क करें',
  'Getting the speech engine ready…': 'स्पीच इंजन तैयार हो रहा है…',
  'Give it a new name': 'इसे नया नाम दें',
  'Go to the home page': 'होम पेज पर जाएँ',
  'Go to Video to text': 'वीडियो से टेक्स्ट पर जाएँ',
  'Good balance (default)': 'अच्छा संतुलन (डिफ़ॉल्ट)',
  'Good to know': 'जानने लायक बातें',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'Google का सहमति टूल लोड नहीं हो सका, शायद किसी ऐड ब्लॉकर या नेटवर्क ने उसे रोका। उसके बिना न विज्ञापन और न विज्ञापन की कुकी लोड होती हैं।',
  Guides: 'गाइड',
  'Guides: transcripts and subtitles': 'गाइड: ट्रांसक्रिप्ट और सबटाइटल',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'कोई सवाल है, कोई बग मिला या कोई सुविधा सुझानी है? {email} पर लिखें। हर संदेश उस व्यक्ति तक पहुँचता है जो {brand} बनाता है, और आम तौर पर कुछ कामकाजी दिनों में जवाब मिल जाता है।',
  'Helps spell uncommon words correctly.':
    'कम इस्तेमाल होने वाले शब्द सही वर्तनी में आने में मदद करता है।',
  'High accuracy': 'ज़्यादा सटीकता',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    'ज़्यादा सटीकता (Large v3 Turbo) को अनुवाद के लिए प्रशिक्षित नहीं किया गया है और यह आपको मूल भाषा में ही टेक्स्ट दे सकती है। अनुवाद के लिए स्टैंडर्ड या सबसे सटीक चुनें।',
  'High accuracy, slower': 'ज़्यादा सटीकता, धीमा',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    'ऊँचा मान थोड़ा ज़्यादा सटीक और धीमा होता है। 5 एक अच्छा डिफ़ॉल्ट है।',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'हिंदी अंग्रेज़ी अक्षरों में, अंग्रेज़ी शब्द जैसे के तैसे। दूसरी भाषाएँ अपनी मूल लिपि में रहती हैं। अनजान शब्द और नाम जाँच लें।',
  'Hinglish (Roman Hindi)': 'हिंग्लिश (रोमन हिंदी)',
  'Hinglish conversion': 'हिंग्लिश रूपांतरण',
  History: 'इतिहास',
  Home: 'होम',
  'How {brand} works': '{brand} कैसे काम करता है',
  'How accurate is it?': 'यह कितना सटीक है?',
  'How do I get better accuracy?': 'बेहतर सटीकता कैसे पाएँ?',
  'How it stays free': 'यह मुफ़्त कैसे रहता है',
  'How it works': 'यह कैसे काम करता है',
  'How long does it take?': 'इसमें कितना समय लगता है?',
  'How to transcribe a video to text': 'वीडियो को टेक्स्ट में कैसे ट्रांसक्राइब करें',
  'How to turn a video or audio file into text with {brand}':
    '{brand} से वीडियो या ऑडियो फ़ाइल को टेक्स्ट में कैसे बदलें',
  'If it does have speech, try More › Re-transcribe with the right language.':
    'अगर उसमें बोली है, तो और › दोबारा ट्रांसक्राइब करें में सही भाषा के साथ कोशिश करें।',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'अगर सेवा व्यस्त है या पहले से बहुत सारी ट्रांसक्रिप्ट चल रही हैं, तो वह आपसे इंतज़ार करने को कहती है और कारण बताती है।',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'अगर हम इस पॉलिसी में बदलाव करते हैं, तो नया संस्करण इसी पेज पर नई "आख़िरी बार अपडेट" तारीख के साथ दिखेगा।',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'EEA, यूके और स्विट्ज़रलैंड में, और अमेरिका के कुछ राज्यों में, विज्ञापन लोड होते समय Google का प्रमाणित सहमति संदेश आपसे आपकी पसंद पूछता है।',
  'IndicXlit (trained model)': 'IndicXlit (प्रशिक्षित मॉडल)',
  'Is it really free and unlimited? Do I need to log in?':
    'क्या यह सच में मुफ़्त और असीमित है? क्या लॉग इन करना पड़ेगा?',
  'Is my data private?': 'क्या मेरा डेटा निजी है?',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    'यह आपकी चुनी गुणवत्ता, फ़ाइल की लंबाई और सेवा पर भीड़ पर निर्भर करता है। सबसे तेज़ जल्दी होता है; सबसे सटीक में सबसे ज़्यादा समय लगता है पर सबसे कम गलतियाँ होती हैं। प्रगति और बचा समय लाइव दिखते हैं, और अपनी बारी का इंतज़ार करती फ़ाइल "कतार में इंतज़ार" दिखाती है।',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'यह आपके डिवाइस, आपकी चुनी गुणवत्ता और फ़ाइल की लंबाई पर निर्भर करता है। सक्षम ग्राफ़िक्स चिप (WebGPU) के साथ यह सबसे तेज़ होता है; वरना यह प्रोसेसर (WebAssembly) पर चलता है, जो धीमा है। सबसे तेज़ जल्दी होता है; सबसे सटीक में सबसे ज़्यादा समय लगता है पर सबसे कम गलतियाँ होती हैं। प्रगति और बचा समय लाइव दिखते हैं।',
  'It is now called “{title}”.': 'अब इसका नाम “{title}” है।',
  'It may have been deleted.': 'हो सकता है इसे हटा दिया गया हो।',
  'It was stopped before any text was found.': 'कोई टेक्स्ट मिलने से पहले ही इसे रोक दिया गया।',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'इसका डेटा हटा दिया गया, इस ट्रांसक्रिप्ट समेत। ट्रांसक्रिप्ट सिर्फ़ उसी सेशन तक रखी जाती हैं जिसने उन्हें बनाया।',
  'Job not found': 'ट्रांसक्रिप्ट नहीं मिली',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'अभी-अभी',
  'Just the words, in paragraphs': 'सिर्फ़ शब्द, अनुच्छेदों में',
  'Keep reading': 'आगे पढ़ें',
  'Keep this page open until the upload is done.': 'अपलोड पूरा होने तक इस पेज को खुला रखें।',
  'Kept only for this session, then deleted automatically.':
    'सिर्फ़ इस सेशन तक रखा जाता है, फिर अपने आप हट जाता है।',
  Language: 'भाषा',
  'Larger or longer files are refused before they are processed, so split them first.':
    'बड़ी या लंबी फ़ाइलें प्रोसेस होने से पहले ही मना कर दी जाती हैं, इसलिए उन्हें पहले बाँट लें।',
  'Last updated: {date}': 'आख़िरी बार अपडेट: {date}',
  'Licence text': 'लाइसेंस का पाठ',
  Light: 'लाइट',
  'Limits.': 'सीमाएँ।',
  'Line deleted': 'लाइन हटा दी गई',
  'Live: the text appears here as it is recognised': 'लाइव: पहचान होते ही टेक्स्ट यहाँ दिखता है',
  'Loading model… (first use downloads it)':
    'मॉडल लोड हो रहा है… (पहली बार इस्तेमाल पर डाउनलोड होता है)',
  'Loading…': 'लोड हो रहा है…',
  'Long (56 letters)': 'लंबी (56 अक्षर)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'विस्तार से जवाब: फ़ॉर्मैट, सबटाइटल, सटीकता और प्राइवेसी।',
  Main: 'मुख्य',
  'Make a new transcript of the same file. This one is kept.':
    'उसी फ़ाइल की नई ट्रांसक्रिप्ट बनाएँ। यह वाली रखी रहती है।',
  'Make a subtitle file (SRT or VTT) from your video.':
    'अपने वीडियो से सबटाइटल फ़ाइल (SRT या VTT) बनाएँ।',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'मेन्यू',
  Model: 'मॉडल',
  More: 'और',
  'More answers: [Frequently asked questions](/faq)': 'और जवाब: [अक्सर पूछे जाने वाले सवाल](/faq)',
  'More free tools': 'और मुफ़्त टूल',
  'More options': 'और विकल्प',
  'More than 50 languages': '50 से ज़्यादा भाषाएँ',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    '50 से ज़्यादा भाषाएँ, जिनमें अंग्रेज़ी, स्पैनिश, फ़्रेंच, जर्मन, पुर्तगाली, इतालवी, डच, रूसी, अरबी, हिंदी, चीनी, जापानी और कोरियाई शामिल हैं। भाषा को अपने आप पहचान पर छोड़ दें या खुद चुनें। आप बोली को अंग्रेज़ी में अनुवाद भी कर सकते हैं।',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'ज़्यादातर ट्रांसक्रिप्शन वेबसाइटें टेक्स्ट की एक लाइन दिखाने से पहले ही आपसे अकाउंट बनवाती हैं, मुफ़्त मिनट सीमित करती हैं, वॉटरमार्क लगाती हैं या सब्सक्रिप्शन थोपती हैं। {brand} इसका उल्टा करता है। इसकी हर चीज़ सबके लिए उपलब्ध है, और पेज आपसे सिर्फ़ आपकी फ़ाइल माँगता है।',
  'Name not changed': 'नाम नहीं बदला',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    'ऑडियो में आने वाले नाम, ब्रांड और खास शब्द, जैसे Kubernetes, डॉ. Okafor',
  'Near-best accuracy, much faster than Large': 'लगभग सबसे अच्छी सटीकता, Large से काफ़ी तेज़',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'ग्राफ़िक्स ड्राइवर में 16-बिट शेडर सपोर्ट (shader-f16) चाहिए',
  'needs 4 GB': '4 GB चाहिए',
  'needs 8 GB': '8 GB चाहिए',
  'needs a graphics-capable browser (Chrome, Edge)':
    'ग्राफ़िक्स सक्षम ब्राउज़र (Chrome, Edge) चाहिए',
  'needs WebGPU': 'WebGPU चाहिए',
  'Next match': 'अगला मिलान',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'न अकाउंट और न ट्रैकिंग। आपकी फ़ाइलें सिर्फ़ आपके सेशन तक रखी जाती हैं और अपने आप हट जाती हैं।',
  'no estimate for this model here': 'यहाँ इस मॉडल का कोई अनुमान नहीं',
  'No login': 'बिना लॉगिन',
  'No matches': 'कोई मिलान नहीं',
  'No microphone': 'माइक्रोफ़ोन नहीं',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'न साइन-अप, न भुगतान, न रोज़ की सीमा। बस अपनी फ़ाइल जोड़ें।',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'सर्वर ने अभी कोई आकार या लंबाई की सीमा नहीं बताई है। बहुत बड़ी फ़ाइलों में बस ज़्यादा समय लगता है।',
  'No speech was found in this file.': 'इस फ़ाइल में कोई बोली नहीं मिली।',
  'No speech was transcribed.': 'कोई बोली ट्रांसक्राइब नहीं हुई।',
  'No speech was transcribed. Check the recording and the selected language.':
    'कोई बोली ट्रांसक्राइब नहीं हुई। रिकॉर्डिंग और चुनी हुई भाषा जाँच लें।',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'यहाँ WebGPU नहीं है: मॉडल एक CPU थ्रेड पर चलते हैं, इसलिए बड़े आकार असली समय से धीमे होते हैं।',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'आपकी फ़ाइल से आगे किसी और की फ़ाइलें नहीं हैं। अगर आप कई फ़ाइलें जोड़ते हैं, तो वे आपके टैब में एक के बाद एक ट्रांसक्राइब होती हैं, इसलिए उनके पूरा होने तक टैब खुला रखें।',
  'None of those are video or audio files.': 'उनमें से कोई भी वीडियो या ऑडियो फ़ाइल नहीं है।',
  Normal: 'सामान्य',
  'not available for this size': 'इस आकार के लिए उपलब्ध नहीं',
  'not available in this browser': 'इस ब्राउज़र में उपलब्ध नहीं',
  'not available with Qwen (times are per chunk)':
    'Qwen के साथ उपलब्ध नहीं (समय खंड के हिसाब से हैं)',
  'Not cancelled': 'रद्द नहीं हुई',
  'Not deleted': 'हटाई नहीं गई',
  'Not renamed': 'नाम नहीं बदला गया',
  'Not saved': 'सेव नहीं हुआ',
  Note: 'ध्यान दें',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'अभी यहाँ कुछ नहीं है। आपकी बनाई ट्रांसक्रिप्ट इस सेशन के लिए यहाँ दिखेंगी।',
  'Nothing is saved. Export what you need.': 'कुछ भी सेव नहीं होता। जो चाहिए उसे एक्सपोर्ट कर लें।',
  'Nothing is uploaded until you press Transcribe.':
    'ट्रांसक्राइब करें दबाने तक कुछ भी अपलोड नहीं होता।',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'साइन-अप करने या भुगतान करने की कोई ज़रूरत नहीं। बस अपनी फ़ाइल जोड़ें।',
  'Nothing was recorded.': 'कुछ भी रिकॉर्ड नहीं हुआ।',
  Off: 'बंद',
  On: 'चालू',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'समर्थित भाषा में साफ़ बोली पर यह आम तौर पर बहुत सटीक होता है, लेकिन कोई भी स्पीच रिकग्निशन पूरी तरह सही नहीं होती। सटीकता ऑडियो की गुणवत्ता, लहजों, बैकग्राउंड शोर, एक साथ बोलते लोगों, संगीत, और दुर्लभ नामों या खास शब्दों पर निर्भर करती है। हर लाइन का एक भरोसे का स्कोर होता है, और कम भरोसे वाली लाइनों पर निशान लगा होता है ताकि आप उन्हें पहले जाँच सकें। किसी भी अहम काम में भरोसा करने से पहले ट्रांसक्रिप्ट हमेशा जाँच लें।',
  'Open menu': 'मेन्यू खोलें',
  'Opening your transcript…': 'आपकी ट्रांसक्रिप्ट खुल रही है…',
  'or drop it anywhere on this page.': 'या इसे इस पेज पर कहीं भी छोड़ दें।',
  'Original script': 'मूल लिपि',
  Output: 'आउटपुट',
  'Page {page} of {pages}': 'पेज {page}/{pages}',
  'Page not found': 'पेज नहीं मिला',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'उस फ़ाइल के लिए पेज जो आपके पास पहले से है: WAV, M4A, WebM और MOV।',
  'PDF document (.pdf)': 'PDF दस्तावेज़ (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'PDF आपका ब्राउज़र बनाता है: प्रिंट डायलॉग में "PDF के रूप में सेव करें" चुनें।',
  'Pick quality': 'गुणवत्ता चुनें',
  'Plain text (.txt)': 'सादा टेक्स्ट (.txt)',
  'Play from here': 'यहाँ से चलाएँ',
  'Playback speed': 'प्लेबैक की गति',
  'Please add one file at a time here. You can add more files on the next page.':
    'यहाँ एक बार में एक फ़ाइल जोड़ें। अगले पेज पर आप और फ़ाइलें जोड़ सकते हैं।',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'कृपया निजी रिकॉर्डिंग न भेजें। {brand} आपकी फ़ाइलों को आपके ही डिवाइस पर ट्रांसक्राइब करता है और वे हमें कभी नहीं मिलतीं, इसलिए मदद के लिए हमें उनकी ज़रूरत नहीं है।',
  'Please note': 'ध्यान दें',
  Preparing: 'तैयारी हो रही है',
  'Preparing audio…': 'ऑडियो तैयार हो रहा है…',
  'Preparing the audio…': 'ऑडियो तैयार हो रहा है…',
  'Preparing…': 'तैयारी हो रही है…',
  'Press a question to read its answer.': 'जवाब पढ़ने के लिए किसी सवाल पर दबाएँ।',
  'Previous match': 'पिछला मिलान',
  'Print to PDF': 'PDF में प्रिंट करें',
  Privacy: 'प्राइवेसी',
  'Privacy and cookie settings': 'प्राइवेसी और कुकी सेटिंग',
  'Privacy policy': 'प्राइवेसी पॉलिसी',
  'Privacy requests': 'प्राइवेसी अनुरोध',
  Private: 'निजी',
  Progress: 'प्रगति',
  Quality: 'गुणवत्ता',
  'Questions about these terms:': 'इन शर्तों के बारे में सवाल:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'सवाल, बग रिपोर्ट और सुझावों का हमेशा स्वागत है। {email} पर लिखें, या क्या शामिल करना है यह जानने के लिए [संपर्क](/contact) पेज देखें।',
  Queued: 'कतार में',
  'Quick results. Good for clear speech.': 'तेज़ नतीजे। साफ़ बोली के लिए अच्छा।',
  Quickest: 'सबसे तेज़',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'Qwen अनुमानित खंड समय इस्तेमाल करता है। शब्द-टाइमिंग और भरोसे का स्कोर उपलब्ध नहीं हैं।',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'Qwen खंड समय इस्तेमाल करता है और शब्दों का भरोसा नहीं देता। इसे चुनने से पहले एक छोटे नमूने की तुलना कर लें।',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (प्रायोगिक)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASR को WebGPU वाला डेस्कटॉप ब्राउज़र (Chrome या Edge) और ग्राफ़िक्स ड्राइवर में 16-बिट शेडर सपोर्ट (shader-f16) चाहिए।',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASR को WebGPU वाला डेस्कटॉप ब्राउज़र (Chrome या Edge) और 8 GB मेमोरी चाहिए।',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASR को WebGPU वाला डेस्कटॉप ब्राउज़र (Chrome या Edge) चाहिए।',
  'Re-transcribe': 'दोबारा ट्रांसक्राइब करें',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'ट्रांसक्रिप्ट को समय के साथ पढ़ें, देखें कि मॉडल को किन शब्दों पर शक था, और उन्हें वहीं ठीक करें।',
  'Read, edit, download': 'पढ़ें, बदलें, डाउनलोड करें',
  Ready: 'तैयार',
  'Ready to print or share': 'प्रिंट या शेयर करने के लिए तैयार',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    'आज़माने के लिए तैयार? [सारे मुफ़्त टूल देखें](/tools) या [अभी कोई फ़ाइल ट्रांसक्राइब करें](/)।',
  'Recognition engine': 'पहचान इंजन',
  Recommended: 'सुझाया गया',
  'Record from microphone': 'माइक्रोफ़ोन से रिकॉर्ड करें',
  'Record straight from your microphone and turn it into text.':
    'सीधे अपने माइक्रोफ़ोन से रिकॉर्ड करें और उसे टेक्स्ट में बदलें।',
  'Record with your microphone': 'माइक्रोफ़ोन से रिकॉर्ड करें',
  'Recording {stamp}': 'रिकॉर्डिंग {stamp}',
  'Recording is not supported by this browser.': 'यह ब्राउज़र रिकॉर्डिंग को सपोर्ट नहीं करता।',
  'Related reading': 'संबंधित पढ़ने की सामग्री',
  Remove: 'हटाएँ',
  'Remove {name}': '{name} हटाएँ',
  'Removes it for good': 'इसे हमेशा के लिए हटा देता है',
  Rename: 'नाम बदलें',
  Renamed: 'नाम बदला गया',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    '{n} लाइनों में "{query}" को "{replacement}" से बदलें?',
  'Replace "{query}" with "{replacement}" in 1 line?':
    '1 लाइन में "{query}" को "{replacement}" से बदलें?',
  'Replace in {n} lines': '{n} लाइनों में बदलें',
  'Replace in 1 line': '1 लाइन में बदलें',
  'Replace with': 'इससे बदलें',
  'Replace with…': 'इससे बदलें…',
  'Replace…': 'बदलें…',
  Replaced: 'बदल दिया गया',
  'Reporting a problem': 'समस्या की रिपोर्ट करना',
  'Retrying…': 'फिर कोशिश हो रही है…',
  'Review language and quality': 'भाषा और गुणवत्ता जाँचें',
  'Review this transcript': 'इस ट्रांसक्रिप्ट की समीक्षा करें',
  Save: 'सेव करें',
  Saved: 'सेव हो गया',
  'Saving…': 'सेव हो रहा है…',
  'Search depth: {n}': 'खोज की गहराई: {n}',
  'Search the text': 'टेक्स्ट में खोजें',
  'Search the transcript': 'ट्रांसक्रिप्ट में खोजें',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'यह भी देखें: [उपयोग की शर्तें](/terms), [यह कैसे काम करता है](/how-it-works) और [अक्सर पूछे जाने वाले सवाल](/faq)।',
  'Server busy': 'सर्वर व्यस्त है',
  'Session only — nothing is saved.': 'सिर्फ़ इस सेशन तक: कुछ भी सेव नहीं होता।',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'सिर्फ़ इस सेशन तक: कुछ भी सेव नहीं होता। ऐप बंद करने पर सारी ट्रांसक्रिप्ट मिट जाती हैं। जो चाहिए उसे एक्सपोर्ट कर लें।',
  'Session time left: about {n} min': 'सेशन का बचा समय: लगभग {n} मिनट',
  'Short (32 letters)': 'छोटी (32 अक्षर)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'बोली को टेक्स्ट और सबटाइटल में बदलने के बारे में छोटे, व्यावहारिक जवाब: कौन-सा सबटाइटल फ़ॉर्मैट चुनें, वीडियो में सबटाइटल कैसे जोड़ें, ज़्यादा सटीक ट्रांसक्रिप्ट कैसे पाएँ, और फ़ाइल अपलोड किए बिना ट्रांसक्रिप्शन आपके अपने ब्राउज़र में कैसे चल सकता है।',
  'Show all {count} languages': 'सभी {count} भाषाएँ दिखाएँ',
  'Six ways to download': 'डाउनलोड करने के छह तरीके',
  'Skip to main content': 'मुख्य सामग्री पर जाएँ',
  Slower: 'धीमा',
  'slower than real time on the measured laptop': 'जाँचे गए लैपटॉप पर असली समय से धीमा',
  Slowest: 'सबसे धीमा',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'कुछ सुविधाएँ इस्तेमाल करने पर ओपन-सोर्स कंपोनेंट आपके ब्राउज़र में डाउनलोड करती हैं। वे इंजन की बाक़ी चीज़ों की तरह आपके डिवाइस पर चलते हैं। उनके लाइसेंस के अनुसार हमें ये सूचनाएँ दिखानी होती हैं:',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    'दोहराए गए टेक्स्ट या बोली की अनिश्चित सीमा की वजह से कुछ अंश सुनकर जाँचने लायक हैं।',
  'Something went wrong': 'कुछ गड़बड़ हो गई',
  'Something went wrong in this browser. Please try again.':
    'इस ब्राउज़र में कुछ गड़बड़ हो गई। कृपया फिर कोशिश करें।',
  'Something went wrong while reading this file.': 'इस फ़ाइल को पढ़ते समय कुछ गड़बड़ हो गई।',
  'Source code': 'सोर्स कोड',
  Speed: 'गति',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'फ़ोन और टैबलेट पर गति अनुमानित है, मापी हुई नहीं; tiny और base सुरक्षित आकार हैं।',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'सबटाइटल के लिए SRT और VTT, पढ़ने के लिए TXT और Markdown, प्रोग्राम के लिए JSON, या प्रिंट करने के लिए PDF।',
  Standard: 'स्टैंडर्ड',
  'Standard (42 letters)': 'स्टैंडर्ड (42 अक्षर)',
  Start: 'शुरू करें',
  'Start a new transcription': 'नई ट्रांसक्रिप्शन शुरू करें',
  'Start again': 'फिर से शुरू करें',
  'Started again': 'फिर से शुरू किया गया',
  'Starting…': 'शुरू हो रहा है…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'अब भी कोई सवाल है? [अक्सर पूछे जाने वाले सवाल](/faq) पढ़ें, [यह कैसे काम करता है](/how-it-works) देखें, या [हमसे संपर्क करें](/contact)।',
  'Still stuck? [Read How it works](/how-it-works)':
    'अब भी अटके हैं? [यह कैसे काम करता है पढ़ें](/how-it-works)',
  'Stop recording · {time}': 'रिकॉर्डिंग रोकें · {time}',
  'Stop this transcription? The text found so far is kept.':
    'इस ट्रांसक्रिप्शन को रोकें? अब तक मिला टेक्स्ट रखा जाएगा।',
  'Stopping the transcription worker. The text found so far is kept.':
    'ट्रांसक्रिप्शन वर्कर रोका जा रहा है। अब तक मिला टेक्स्ट रखा जाएगा।',
  'Stored on this device only, never uploaded.':
    'सिर्फ़ इसी डिवाइस पर रखा जाता है, कभी अपलोड नहीं होता।',
  'Style unchanged': 'शैली नहीं बदली',
  'Style updated': 'शैली अपडेट हुई',
  'Style updated using the saved recognition. Edited lines are kept.':
    'सेव की गई पहचान से शैली अपडेट हुई। बदली हुई लाइनें रखी गई हैं।',
  'Subtitle files': 'सबटाइटल फ़ाइलें',
  'Subtitle line length': 'सबटाइटल की पंक्ति की लंबाई',
  'Subtitles (.srt)': 'सबटाइटल (.srt)',
  'Switch to dark theme': 'डार्क थीम पर जाएँ',
  'Switch to light theme': 'लाइट थीम पर जाएँ',
  Terms: 'शर्तें',
  'Terms of use': 'उपयोग की शर्तें',
  'Text with times (.txt)': 'समय के साथ टेक्स्ट (.txt)',
  'That file is already in the list.': 'वह फ़ाइल सूची में पहले से है।',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'यह वीडियो या ऑडियो फ़ाइल नहीं है। MP4, MOV, MP3 या कोई और वीडियो या ऑडियो फ़ाइल चुनें।',
  'That is not a video or audio file. Please choose a video or audio file.':
    'यह वीडियो या ऑडियो फ़ाइल नहीं है। कृपया कोई वीडियो या ऑडियो फ़ाइल चुनें।',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'यह ऑडियो फ़ाइल नहीं है। MP3, WAV, M4A या कोई और ऑडियो फ़ाइल चुनें।',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    '[प्राइवेसी पॉलिसी](/privacy) बताती है कि क्या प्रोसेस होता है और क्यों। अपने डेटा के बारे में सवाल पूछने या अपने अधिकारों का इस्तेमाल करने के लिए इसी पते पर लिखें।',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    '{label} मॉडल इस डिवाइस पर नहीं चल सकता: {reason}। कोई दूसरा चुनें।',
  'the exact error message, or a screenshot of it.': 'त्रुटि का ठीक वही संदेश, या उसका स्क्रीनशॉट।',
  'The file is larger than the server accepts.': 'फ़ाइल सर्वर की सीमा से बड़ी है।',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'किसी गुणवत्ता स्तर को पहली बार इस्तेमाल करने पर आपका ब्राउज़र उसका स्पीच मॉडल एक बार डाउनलोड करके अगली बार के लिए रख लेता है, इसलिए बाद की फ़ाइलें जल्दी शुरू होती हैं।',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'किसी गुणवत्ता स्तर को पहली बार इस्तेमाल करने पर आपका ब्राउज़र स्पीच मॉडल Hugging Face से और इंजन की प्रोग्राम फ़ाइलें jsDelivr से डाउनलोड करता है और अगली बार के लिए रख लेता है; इनके साथ आपकी फ़ाइल का कुछ भी नहीं भेजा जाता। ट्रांसक्रिप्शन पूरा होने पर आपका ब्राउज़र पेज के हेडर के गुमनाम काउंटर में एक जोड़ता है, और कुछ नहीं।',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'ग्राफ़िक्स ड्राइवर में 16-बिट शेडर नहीं हैं: डाउनलोड बड़े होते हैं और मेमोरी ज़्यादा लगती है।',
  'The line was removed.': 'लाइन हटा दी गई।',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'मुख्य टूल: किसी भी वीडियो या ऑडियो फ़ाइल को समय वाली ट्रांसक्रिप्ट में बदलें।',
  'The page you are looking for does not exist or has moved.':
    'आप जिस पेज को ढूँढ रहे हैं वह मौजूद नहीं है या कहीं और चला गया है।',
  'The recording failed. Please try again.': 'रिकॉर्डिंग नहीं हो सकी। कृपया फिर कोशिश करें।',
  'The server does not have enough free disk space for this file.':
    'सर्वर में इस फ़ाइल के लिए पर्याप्त खाली डिस्क जगह नहीं है।',
  'The server is busy': 'सर्वर व्यस्त है',
  'The server is busy right now.': 'सर्वर अभी व्यस्त है।',
  'The service is busy right now. Please wait a moment and try again.':
    'सेवा अभी व्यस्त है। कृपया थोड़ी देर रुककर फिर कोशिश करें।',
  'The service is full right now. Please try again in a little while.':
    'सेवा अभी भरी हुई है। कृपया थोड़ी देर में फिर कोशिश करें।',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    'स्पीच रिकग्निशन आपके अपने ब्राउज़र के अंदर चलता है, OpenAI Whisper जैसे खुले स्पीच रिकग्निशन मॉडल से। आपका ब्राउज़र मॉडल एक बार डाउनलोड करके रख लेता है, फिर सारा काम आपके डिवाइस पर करता है। आपका वीडियो या ऑडियो हमारे पास कभी अपलोड नहीं होता, इसीलिए फ़ाइल के आकार की कोई सीमा नहीं है और दूसरों की फ़ाइलों की कोई कतार भी नहीं। [यह कैसे काम करता है](/how-it-works) पेज हर कदम समझाता है।',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'बोली गई भाषा भरोसे के साथ पहचानी नहीं जा सकी। जो भाषा आप सुन रहे हैं उसे चुनें और फिर कोशिश करें।',
  'The text found before it was stopped is shown below.':
    'रोके जाने से पहले मिला टेक्स्ट नीचे दिखाया गया है।',
  'The text found so far is kept.': 'अब तक मिला टेक्स्ट रखा गया है।',
  'The text is ready to paste.': 'टेक्स्ट पेस्ट करने के लिए तैयार है।',
  'The transcript finished before it could be cancelled.':
    'रद्द करने से पहले ही ट्रांसक्रिप्ट पूरी हो चुकी थी।',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'ट्रांसक्रिप्शन आपके अपने डिवाइस पर OpenAI Whisper जैसे खुले स्पीच रिकग्निशन मॉडल से चलता है। आपका ब्राउज़र मॉडल एक बार डाउनलोड करके रख लेता है, इसलिए अगली फ़ाइल जल्दी शुरू होती है, और आपका वीडियो या ऑडियो कहीं भी अपलोड नहीं होता।',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'फ़ाइल का प्रकार और लंबाई, जैसे "MP4, 25 मिनट";',
  'There is no size or length limit set here.': 'यहाँ आकार या लंबाई की कोई सीमा तय नहीं है।',
  'These details make a problem much quicker to find and fix:':
    'ये ब्योरे किसी समस्या को बहुत जल्दी ढूँढने और ठीक करने में मदद करते हैं:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    'ये शर्तें भारत के क़ानूनों के अधीन हैं। इनसे उठने वाले किसी भी विवाद पर बेंगलुरु, कर्नाटक, भारत की अदालतों का विशेष अधिकार-क्षेत्र है। इससे आपके निवास वाले देश के अनिवार्य उपभोक्ता क़ानूनों के तहत मिली कोई सुरक्षा नहीं घटती।',
  'They are downloaded again the next time you transcribe.':
    'अगली बार ट्रांसक्राइब करने पर वे फिर से डाउनलोड होते हैं।',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'Google समेत तीसरे पक्ष के विक्रेता, इस वेबसाइट या दूसरी वेबसाइटों पर आपकी पिछली विज़िट के आधार पर विज्ञापन दिखाने के लिए कुकी इस्तेमाल करते हैं। Google के विज्ञापन कुकी इस्तेमाल करने से वह और उसके साझेदार इस साइट और/या इंटरनेट की दूसरी साइटों पर आपकी विज़िट के आधार पर आपको विज्ञापन दिखा पाते हैं।',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'यह बॉक्स MP3, WAV या M4A जैसी ऑडियो फ़ाइलें लेता है, लेकिन वह फ़ाइल वीडियो है।',
  'This browser cannot record. Please choose a file instead.':
    'यह ब्राउज़र रिकॉर्ड नहीं कर सकता। कृपया इसकी जगह कोई फ़ाइल चुनें।',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'यह ब्राउज़र मेमोरी की जानकारी नहीं देता; {gb} GB मान लिया गया है। पेज धीमा हो तो छोटा मॉडल चुनें।',
  'This cannot be undone. Export anything you want to keep first.':
    'यह वापस नहीं हो सकता। जो रखना चाहते हैं उसे पहले एक्सपोर्ट कर लें।',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '{brand} की यह कॉपी आपके अपने कंप्यूटर पर चलती है। आपकी फ़ाइलें इसी मशीन पर प्रोसेस होती हैं और कुछ भी बाहर नहीं जाता। कुछ भी हमेशा के लिए सेव नहीं होता: ट्रांसक्रिप्ट सिर्फ़ इस सेशन तक रहती हैं, इसलिए जो चाहिए उसे एक्सपोर्ट कर लें। [प्राइवेसी पॉलिसी](/privacy) होस्ट की गई वेबसाइट के बारे में बताती है।',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'यह कॉपी आपके अपने कंप्यूटर पर चलती है। आपकी फ़ाइलें इसी मशीन पर प्रोसेस होती हैं और कुछ भी बाहर नहीं जाता।',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'इतनी लंबी फ़ाइल के लिए इस डिवाइस में मेमोरी कम है। उसे छोटे टुकड़ों में प्रोसेस किया जाता है, जो धीमा है; छोटा हिस्सा या छोटा मॉडल ज़्यादा सुरक्षित है।',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'इस फ़ाइल के लिए 9 MB का कन्वर्टर चाहिए जो आपके ब्राउज़र में चलता है। उसे लोड करें?',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'यह सुविधा के लिए एक अनुवाद है। अगर यह अंग्रेज़ी संस्करण से अलग हो, तो अंग्रेज़ी संस्करण ही मान्य है।',
  'This local copy does not count transcriptions': 'यह लोकल कॉपी ट्रांसक्रिप्शन की गिनती नहीं करती',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'इस ट्रांसक्रिप्ट पर मॉडल का भरोसा कम है। टेक्स्ट इस्तेमाल करने से पहले रिकॉर्डिंग सुनें और बोली गई भाषा जाँच लें।',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'इस डिवाइस पर इसमें {wait} लगेंगे (अनुमान)। पूरा होने तक टैब खुला रखें।',
  Timestamps: 'टाइमस्टैम्प',
  'Tips for the best results': 'सबसे अच्छे नतीजों के लिए सुझाव',
  'Tips for the best transcript': 'सबसे अच्छी ट्रांसक्रिप्ट के लिए सुझाव',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'अपनी विज्ञापन पसंद बदलने के लिए [Google विज्ञापन सेटिंग](https://adssettings.google.com) या अपने ब्राउज़र की कुकी सेटिंग इस्तेमाल करें।',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'अपनी विज्ञापन पसंद बदलने के लिए विज्ञापन दिखाने वाले पेज के नीचे **प्राइवेसी और कुकी सेटिंग**, [Google विज्ञापन सेटिंग](https://adssettings.google.com) या अपने ब्राउज़र की कुकी सेटिंग इस्तेमाल करें।',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'आपके कहे अनुसार ट्रांसक्रिप्शन आपके अपने डिवाइस पर देने के लिए, वेबसाइट को सुरक्षित तरीके से पहुँचाने के लिए, और विज्ञापन के ज़रिए सेवा को मुफ़्त रखने के लिए। जहाँ GDPR जैसा डेटा सुरक्षा क़ानून लागू होता है, वहाँ हमारे क़ानूनी आधार हैं: आपकी माँगी हुई सेवा देना (अनुच्छेद 6(1)(b)), सुरक्षा, दुरुपयोग रोकने और गुमनाम चलते हुए कुल में हमारा वैध हित (अनुच्छेद 6(1)(f)), और जहाँ क़ानून माँगता है वहाँ विज्ञापन कुकी के लिए आपकी सहमति (अनुच्छेद 6(1)(a)), जो Google का सहमति संदेश माँगता है।',
  'To keep it fast for everyone, each file has a size and length limit.':
    'सबके लिए इसे तेज़ रखने के लिए हर फ़ाइल की आकार और लंबाई की एक सीमा है।',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    'क़ानून जितनी इजाज़त देता है, उस हद तक हम अप्रत्यक्ष या परिणामी नुकसान, डेटा, मुनाफ़े या कारोबार के नुकसान, या सेवा के इस्तेमाल या इस्तेमाल न कर पाने या ट्रांसक्रिप्ट की गलतियों से हुए किसी भी नुकसान के लिए ज़िम्मेदार नहीं हैं। इन शर्तों की कोई बात उस ज़िम्मेदारी को सीमित नहीं करती जिसे क़ानून सीमित नहीं होने देता।',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'आपके डिवाइस पर ट्रांसक्राइब करने के लिए आपका ब्राउज़र स्पीच मॉडल की फ़ाइलें Hugging Face (huggingface.co) से और स्पीच इंजन की प्रोग्राम फ़ाइलें jsDelivr (cdn.jsdelivr.net) से डाउनलोड करता है, और अगली बार के लिए उन्हें अपने कैश (Cache Storage) में तब तक रखता है जब तक आप उन्हें हटा न दें। उन प्रदाताओं को सामान्य अनुरोध डेटा (आपका IP पता, आपका ब्राउज़र और कौन-सी फ़ाइल माँगी गई) मिलता है, आपकी मीडिया या ट्रांसक्रिप्ट कभी नहीं।',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'आपके डिवाइस पर काम करने के लिए आपका ब्राउज़र Hugging Face से स्पीच मॉडल और jsDelivr से प्रोग्राम फ़ाइलें डाउनलोड करता है; वे अपने-अपने लाइसेंस और शर्तों के तहत दी जाती हैं। विज्ञापन Google AdSense देता है; विज्ञापन किसी तीसरे पक्ष की वेबसाइट पर ले जाता है जिस पर हमारा नियंत्रण नहीं है और जिसके लिए हम ज़िम्मेदार नहीं हैं।',
  Transcribe: 'ट्रांसक्राइब करें',
  'Transcribe (same language)': 'ट्रांसक्राइब करें (उसी भाषा में)',
  'Transcribe {n} files': '{n} फ़ाइलें ट्रांसक्राइब करें',
  'Transcribe a file': 'फ़ाइल ट्रांसक्राइब करें',
  'Transcribe or translate speech in the language you need.':
    'बोली को अपनी ज़रूरत की भाषा में ट्रांसक्राइब या अनुवाद करें।',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    'वीडियो, ऑडियो फ़ाइलें और वॉइस रिकॉर्डिंग 50 से ज़्यादा भाषाओं में ट्रांसक्राइब करें, या भाषा को अपने आप पहचानने दें।',
  'Transcribing {n}%': 'ट्रांसक्राइब हो रहा है {n}%',
  'Transcribing takes {time} on this device.': 'इस डिवाइस पर ट्रांसक्राइब करने में {time} लगता है।',
  'Transcribing…': 'ट्रांसक्राइब हो रहा है…',
  '{blurb} Not sure? Keep this one.': '{blurb} पक्का नहीं पता? इसे ही रहने दें।',
  '{reason} Retrying in {n} s…': '{reason} {n} सेकंड में फिर कोशिश की जाएगी…',
  'Alternatives': 'विकल्प',
  'Checking the downloaded file…': 'डाउनलोड की गई फ़ाइल जाँची जा रही है…',
  'Connection lost.': 'कनेक्शन टूट गया।',
  'Continued after the page reloaded.': 'पेज दोबारा लोड होने के बाद जारी रहा।',
  'Continuing the download ({size} already saved)': 'डाउनलोड जारी है ({size} पहले ही सेव हो चुका है)',
  'Downloaded: ready to start': 'डाउनलोड हो गया: शुरू करने के लिए तैयार',
  'Every language in its own script: English in English letters, Hindi in Devanagari. Choose Hinglish to write Hindi in English letters.': 'हर भाषा अपनी लिपि में: अंग्रेज़ी रोमन अक्षरों में, हिंदी देवनागरी में। हिंदी को रोमन अक्षरों में लिखने के लिए हिंग्लिश चुनें।',
  'First time only: downloads {size}, now downloading in the background': 'सिर्फ़ पहली बार: {size} डाउनलोड होता है, अभी बैकग्राउंड में डाउनलोड हो रहा है',
  'Getting the model ready: {loaded} of {total}': 'मॉडल तैयार हो रहा है: {total} में से {loaded}',
  'Good for most videos.': 'ज़्यादातर वीडियो के लिए ठीक।',
  'Honest, dated comparisons with other transcription services.': 'दूसरी ट्रांसक्रिप्शन सेवाओं से ईमानदार, तारीख़ वाली तुलनाएँ।',
  'Keep this page open until it is finished. If it reloads or closes, it continues where it stopped when you open the site again.': 'पूरा होने तक इस पेज को खुला रखें। अगर यह दोबारा लोड हो जाए या बंद हो जाए, तो साइट फिर से खोलने पर यह वहीं से जारी रहेगा जहाँ रुका था।',
  'Length {time}': 'लंबाई {time}',
  'Opens in Word and Google Docs': 'Word और Google Docs में खुलता है',
  'Reconnecting…': 'फिर से कनेक्ट हो रहा है…',
  'The download server is busy (HTTP {status}).': 'डाउनलोड सर्वर व्यस्त है (HTTP {status})।',
  'The download stalled.': 'डाउनलोड अटक गया।',
  'Time so far {time}': 'अब तक का समय {time}',
  'Translated to English': 'अंग्रेज़ी में अनुवादित',
  'Waiting for the internet connection…': 'इंटरनेट कनेक्शन का इंतज़ार है…',
  'Word document (.docx)': 'Word दस्तावेज़ (.docx)',
  'Transcribed in {time}': '{time} में ट्रांसक्राइब हुआ',
  Transcript: 'ट्रांसक्रिप्ट',
  'Transcript name': 'ट्रांसक्रिप्ट का नाम',
  'Transcript not found': 'ट्रांसक्रिप्ट नहीं मिली',
  'Transcript ready': 'ट्रांसक्रिप्ट तैयार',
  'Transcript style': 'ट्रांसक्रिप्ट की शैली',
  'Transcription failed': 'ट्रांसक्रिप्शन विफल रहा',
  'Transcription has started. The text appears below as it is recognised.':
    'ट्रांसक्रिप्शन शुरू हो गया है। टेक्स्ट पहचाने जाते ही नीचे दिखता है।',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'ट्रांसक्रिप्शन शुरू हो गया है। आपकी बाक़ी फ़ाइलें पेज के ऊपर ट्रांसक्रिप्ट में हैं।',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    'ट्रांसक्रिप्शन आपके डिवाइस पर चलता है और उसका प्रोसेसर, ग्राफ़िक्स चिप, मेमोरी और बैटरी इस्तेमाल करता है। हम फ़ाइल के आकार या लंबाई की कोई सीमा नहीं रखते, लेकिन यह कितनी तेज़ी से चलता है और आपका ब्राउज़र कितनी बड़ी फ़ाइल संभाल सकता है, यह आपके डिवाइस पर निर्भर है: धीमे फ़ोन या कंप्यूटर पर लंबी फ़ाइल में बहुत समय लग सकता है या मेमोरी कम पड़ सकती है। आपकी ट्रांसक्रिप्ट और फ़ाइलें इसी ब्राउज़र में रखी जाती हैं और {idle} तक कोई गतिविधि न होने पर अपने आप हट जाती हैं। [प्राइवेसी पॉलिसी](/privacy) देखें।',
  'Transcription settings': 'ट्रांसक्रिप्शन सेटिंग',
  Transcripts: 'ट्रांसक्रिप्ट',
  'Transcripts {n}': 'ट्रांसक्रिप्ट {n}',
  'Transcripts are only kept for the browser session that created them.':
    'ट्रांसक्रिप्ट सिर्फ़ उसी ब्राउज़र सेशन तक रखी जाती हैं जिसने उन्हें बनाया।',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    'ट्रांसक्रिप्ट अपने आप बनती हैं और उनमें गलतियाँ होंगी, ख़ासकर शोर वाले ऑडियो, तेज़ लहजों, एक साथ बोलते लोगों, संगीत, और नामों या तकनीकी शब्दों में। किसी भी ट्रांसक्रिप्ट पर भरोसा करने से पहले उसे हमेशा जाँच लें, ख़ासकर क़ानूनी, चिकित्सा, वित्तीय या प्रकाशित इस्तेमाल के लिए। सेवा "जैसी है" और "जैसी उपलब्ध है" के आधार पर दी जाती है, बिना किसी वारंटी के, चाहे स्पष्ट हो या निहित, जिसमें सटीकता, संपूर्णता या किसी ख़ास उद्देश्य की उपयुक्तता भी शामिल है।',
  'Translate to English': 'अंग्रेज़ी में अनुवाद करें',
  'Try again': 'फिर कोशिश करें',
  'Try another quality or language': 'कोई और गुणवत्ता या भाषा आज़माएँ',
  'try to spread malware or anything meant to damage the service.':
    'मैलवेयर फैलाने या सेवा को नुकसान पहुँचाने के लिए बनी किसी भी चीज़ की कोशिश करना।',
  'Trying again in a moment…': 'थोड़ी देर में फिर कोशिश हो रही है…',
  'Trying again. This page loads by itself as soon as the server is back.':
    'फिर कोशिश हो रही है। सर्वर वापस आते ही यह पेज अपने आप लोड हो जाएगा।',
  'under a minute': 'एक मिनट से कम',
  'Underline unsure words': 'संदिग्ध शब्दों को रेखांकित करें',
  Unlimited: 'असीमित',
  'Unsure: worth listening to again': 'संदिग्ध: दोबारा सुनने लायक',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'अपलोड की असामान्य रूप से भारी बाढ़ आने पर थोड़ा इंतज़ार करने को कहा जा सकता है।',
  'Up to {minutes} per file.': 'हर फ़ाइल {minutes} तक।',
  'Up to {size} and {minutes} minutes per file.': 'हर फ़ाइल {size} और {minutes} मिनट तक।',
  'Up to {size} and {minutes} per file.': 'हर फ़ाइल {size} और {minutes} तक।',
  'Up to {size} per file.': 'हर फ़ाइल {size} तक।',
  'Updated {date}': 'अपडेट: {date}',
  'Upload complete': 'अपलोड पूरा हुआ',
  'Upload failed': 'अपलोड विफल रहा',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'अपलोड विफल रहा (सर्वर त्रुटि {status})। ब्योरे के लिए सर्वर चलाने वाला टर्मिनल देखें।',
  'Upload failed (server error {status}). Please try again in a moment.':
    'अपलोड विफल रहा (सर्वर त्रुटि {status})। कृपया थोड़ी देर में फिर कोशिश करें।',
  Uploading: 'अपलोड हो रहा है',
  'Uploading…': 'अपलोड हो रहा है…',
  'use a computer for this size': 'इस आकार के लिए कंप्यूटर इस्तेमाल करें',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'हमारी लिखित अनुमति के बिना वेबसाइट या उसके काउंटर पर स्क्रिप्ट, बॉट या दूसरे स्वचालित साधन इस्तेमाल करना, या गढ़ी हुई गिनती भेजना;',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'सेवा का इस्तेमाल ऐसी सामग्री पर करना जो ग़ैरक़ानूनी हो या किसी और के अधिकारों का उल्लंघन करती हो;',
  'use the service to harass, harm or deceive others;':
    'सेवा का इस्तेमाल दूसरों को परेशान करने, नुकसान पहुँचाने या धोखा देने के लिए करना;',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'साफ़ बोली पर आम तौर पर बहुत सटीक। जिन लाइनों पर इसे शक होता है उन पर निशान लगा होता है, ताकि आप उन्हें पहले जाँच सकें।',
  'Video and audio to text': 'वीडियो और ऑडियो से टेक्स्ट',
  'Video or audio, several at once is fine.': 'वीडियो या ऑडियो, एक साथ कई भी चलेंगे।',
  'Video to text, accurately.': 'वीडियो से टेक्स्ट, सटीक।',
  'Video to text: transcribe a video or audio file':
    'वीडियो से टेक्स्ट: वीडियो या ऑडियो फ़ाइल ट्रांसक्राइब करें',
  'video transcribed': 'वीडियो ट्रांसक्राइब हुआ',
  'videos transcribed': 'वीडियो ट्रांसक्राइब हुए',
  'Vocabulary hint': 'शब्दावली संकेत',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'वॉइस नोट, मीटिंग, लेक्चर, पॉडकास्ट और इंटरव्यू।',
  'Waiting for microphone permission…': 'माइक्रोफ़ोन की अनुमति का इंतज़ार है…',
  'Waiting for the first words…': 'पहले शब्दों का इंतज़ार है…',
  'Waiting in line…': 'कतार में इंतज़ार…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'टेक्स्ट को लाइव उभरते देखें, गलतियाँ ठीक करें, फिर उसे SRT, VTT, TXT, Markdown, JSON या PDF में डाउनलोड करें।',
  'We do not ask for your name, e-mail address or any other account details.':
    'हम आपका नाम, ई-मेल पता या कोई और अकाउंट ब्योरा नहीं माँगते।',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'हम यह वादा नहीं करते कि सेवा हमेशा उपलब्ध, निर्बाध या त्रुटिहीन रहेगी। वेबसाइट, या उसे चाहिए डाउनलोड (Hugging Face के स्पीच मॉडल और jsDelivr की प्रोग्राम फ़ाइलें), रखरखाव या हमारे नियंत्रण से बाहर की वजहों से उपलब्ध न हों, और कुछ ब्राउज़र या डिवाइस हर मॉडल नहीं चला सकते। क्योंकि आपकी ट्रांसक्रिप्ट सिर्फ़ इसी ब्राउज़र में रखी जाती हैं और निष्क्रियता के बाद हट जाती हैं, जो चाहिए उसे हमेशा एक्सपोर्ट कर लें।',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'हम आपका डेटा नहीं बेचते। आपकी कोई फ़ाइल या ट्रांसक्रिप्ट हमारे पास नहीं है, इसलिए साझा करने को कुछ है ही नहीं: पहचान आपके डिवाइस पर होती है, किसी बाहरी ट्रांसक्रिप्शन या AI सेवा पर नहीं। Google (विज्ञापन), Cloudflare (होस्टिंग और काउंटर), Hugging Face और jsDelivr (डाउनलोड) को सिर्फ़ वही मिलता है जो ऊपर बताया गया है। क़ानून माँगे तो हम जानकारी बता सकते हैं।',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    'हम अपनी तरफ़ आपका कुछ भी नहीं रखते: उस एक चलते हुए कुल को छोड़कर, आपके इस्तेमाल के बारे में हमारे पास कुछ भी जमा नहीं होता।',
  'We may block access if these rules are broken.': 'ये नियम टूटने पर हम पहुँच रोक सकते हैं।',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'हम ये शर्तें अपडेट कर सकते हैं। नया संस्करण इसी पेज पर नई "आख़िरी बार अपडेट" तारीख के साथ दिखता है, और तभी से लागू होता है।',
  'We never send your file, your transcript or any personal information to Google.':
    'हम आपकी फ़ाइल, ट्रांसक्रिप्ट या कोई निजी जानकारी Google को कभी नहीं भेजते।',
  'Web subtitles (.vtt)': 'वेब सबटाइटल (.vtt)',
  'What people use it for': 'लोग इसे किसलिए इस्तेमाल करते हैं',
  'What you can do with it': 'आप इससे क्या कर सकते हैं',
  'What you get': 'आपको क्या मिलता है',
  'what you were doing, and what happened instead of what you expected;':
    'आप क्या कर रहे थे, और जो उम्मीद थी उसकी जगह क्या हुआ;',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'आपकी फ़ाइलें कहाँ प्रोसेस होती हैं, यह इस पर निर्भर है कि {brand} कैसे चलाया जाता है, और सर्वर ने अभी जवाब नहीं दिया। [प्राइवेसी पॉलिसी](/privacy) देखें।',
  'Where your files are processed depends on how {brand} is run.':
    'आपकी फ़ाइलें कहाँ प्रोसेस होती हैं, यह इस पर निर्भर है कि {brand} कैसे चलाया जाता है।',
  'Which files can I use, and what are the limits?':
    'कौन-सी फ़ाइलें इस्तेमाल हो सकती हैं, और सीमाएँ क्या हैं?',
  'Which languages are supported?': 'कौन-सी भाषाएँ समर्थित हैं?',
  'Who builds it': 'इसे कौन बनाता है',
  'Who runs this website': 'यह वेबसाइट कौन चलाता है',
  'Why it exists': 'यह क्यों बना',
  'Working…': 'काम हो रहा है…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'हाँ। यह मुफ़्त है, और कभी कोई अकाउंट या लॉगिन नहीं है। न रोज़ की या महीने की कोई सीमा है, न पेवॉल; विज्ञापन वेबसाइट को मुफ़्त रखते हैं।',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'हाँ। यह मुफ़्त है, और कभी कोई अकाउंट या लॉगिन नहीं है। न रोज़ की या महीने की कोई सीमा है, न पेवॉल।',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'हाँ। यह मुफ़्त है, और न साइन-अप करना है न लॉगिन। यह कॉपी आपके अपने कंप्यूटर पर चलती है, इसलिए न कोई सीमा है न पेवॉल; यह कितनी तेज़ चलती है, यह आपके कंप्यूटर पर निर्भर है।',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'हाँ। किसी लाइन का टेक्स्ट बदलने या उसे हटाने के लिए उसके पास की पेंसिल इस्तेमाल करें, या पूरी ट्रांसक्रिप्ट में खोजें और बदलें। आपके बदलाव हर एक्सपोर्ट में शामिल होते हैं।',
  'You agree not to:': 'आप सहमत हैं कि आप ये नहीं करेंगे:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'नियंत्रण आपके पास है: **मेरा डेटा अभी हटाएँ** से आप किसी भी समय अपनी ट्रांसक्रिप्ट, फ़ाइलें और चाहें तो डाउनलोड किए गए स्पीच मॉडल हटा सकते हैं। यह सिर्फ़ इस ब्राउज़र का डेटा हटाता है; Google की कुकी नहीं हटा सकता।',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'आप इसे किसी भी समय विज्ञापन दिखाने वाले किसी भी पेज (जैसे होम पेज) के नीचे **प्राइवेसी और कुकी सेटिंग** से बदल सकते हैं।',
  'You can now read, fix and download it.': 'अब आप इसे पढ़, ठीक कर और डाउनलोड कर सकते हैं।',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'आप किसी भी समय सेवा का इस्तेमाल बंद कर सकते हैं और इस ब्राउज़र का डेटा **मेरा डेटा अभी हटाएँ** से हटा सकते हैं। हम किसी भी समय आपकी पहुँच रोक या ख़त्म कर सकते हैं, ख़ासकर अगर आप इन शर्तों को तोड़ें।',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'आप जो फ़ाइलें जोड़ते हैं और उनसे बनी ट्रांसक्रिप्ट के सारे अधिकार आपके पास रहते हैं। वे आपके डिवाइस पर प्रोसेस होती हैं और हमें कभी नहीं मिलतीं। आप जो ट्रांसक्राइब करते हैं उसके लिए आप ज़िम्मेदार हैं: सिर्फ़ वही सामग्री इस्तेमाल करें जिसके आप मालिक हैं या जिसे प्रोसेस करने का आपको अधिकार है, जिसमें उसमें बोलने वालों से ज़रूरी कोई भी अनुमति शामिल है।',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'आप [Google विज्ञापन सेटिंग](https://adssettings.google.com) पर जाकर वैयक्तिकृत विज्ञापन से बाहर हो सकते हैं, या [www.aboutads.info](https://www.aboutads.info) पर जाकर वैयक्तिकृत विज्ञापन के लिए कुछ तीसरे पक्ष के विक्रेताओं के कुकी इस्तेमाल से बाहर हो सकते हैं। जानें कि [Google अपनी सेवाएँ इस्तेमाल करने वाली साइटों की जानकारी कैसे इस्तेमाल करता है](https://policies.google.com/technologies/partner-sites)।',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'आपका ब्राउज़र और उसका संस्करण, और आपका डिवाइस (कंप्यूटर या फ़ोन, और उसका ऑपरेटिंग सिस्टम);',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'आपके ब्राउज़र ने यहाँ कॉपी करने से रोक दिया। इसकी जगह टेक्स्ट सेव करने के लिए एक्सपोर्ट इस्तेमाल करें।',
  'Your change is saved.': 'आपका बदलाव सेव हो गया।',
  'Your change is still in its box: press Save to try again.':
    'आपका बदलाव अब भी उसके बॉक्स में है: फिर कोशिश करने के लिए सेव करें दबाएँ।',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'आपकी फ़ाइल एन्क्रिप्टेड कनेक्शन से सर्वर को भेजी जाती है, OpenAI Whisper जैसे खुले स्पीच रिकग्निशन मॉडल से ट्रांसक्राइब होती है, और बाद में अपने आप हटा दी जाती है। [यह कैसे काम करता है](/how-it-works) पेज हर कदम समझाता है।',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'आपकी फ़ाइल आपके ब्राउज़र में आपके अपने डिवाइस पर ट्रांसक्राइब होती है, इसलिए हम आकार या लंबाई की कोई सीमा नहीं रखते। बहुत बड़ी या लंबी फ़ाइलें भी चलती हैं: उनमें ज़्यादा समय लगता है और पर्याप्त खाली मेमोरी चाहिए, और जब आपका डिवाइस धीमा हो सकता है तो पेज आपको चेताता है।',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'आपकी फ़ाइल OpenAI Whisper जैसे खुले स्पीच रिकग्निशन मॉडल से ट्रांसक्राइब होती है और बाद में अपने आप हटा दी जाती है।',
  'Your file never leaves your device.': 'आपकी फ़ाइल आपके डिवाइस से बाहर कभी नहीं जाती।',
  'Your file never leaves your device. [Privacy](/privacy)':
    'आपकी फ़ाइल आपके डिवाइस से बाहर कभी नहीं जाती। [प्राइवेसी](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'आपकी फ़ाइल आपके डिवाइस से बाहर कभी नहीं जाती। वह इसी डिवाइस पर आपके ब्राउज़र में ट्रांसक्राइब होती है और हमें या किसी और को कभी अपलोड नहीं होती। ट्रांसक्रिप्ट, आपके बदलाव और फ़ाइल सिर्फ़ इस ब्राउज़र के स्टोरेज में रखे जाते हैं और {idle} तक कोई गतिविधि न होने पर अपने आप हट जाते हैं, या ट्रांसक्रिप्ट मेन्यू में **मेरा डेटा अभी हटाएँ** दबाते ही तुरंत। कोई अकाउंट नहीं है। जाने से पहले जो चाहिए उसे एक्सपोर्ट कर लें।',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'आपकी फ़ाइल आपके डिवाइस से बाहर कभी नहीं जाती। वह सीधे आपके ब्राउज़र में, बिना अकाउंट के, ट्रांसक्राइब होती है, और आपकी ट्रांसक्रिप्ट इसी ब्राउज़र में रहती हैं।',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'आपकी फ़ाइल इसी डिवाइस पर रहती है। ट्रांसक्राइब होने तक यह टैब खुला रखें।',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'आपकी फ़ाइलें और ट्रांसक्रिप्ट सिर्फ़ इस सेशन तक रखी जाती हैं और {idle} तक कोई गतिविधि न होने पर, या "मेरा डेटा अभी हटाएँ" दबाने पर अपने आप हट जाती हैं। न अकाउंट, न ट्रैकिंग, सिर्फ़ एक ज़रूरी सेशन कुकी। जाने से पहले जो चाहिए उसे एक्सपोर्ट कर लें।',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'आपकी फ़ाइलें और ट्रांसक्रिप्ट सिर्फ़ इस सेशन तक रखी जाती हैं और सेशन ख़त्म होने पर, या "मेरा डेटा अभी हटाएँ" दबाने पर अपने आप हट जाती हैं। न अकाउंट, न ट्रैकिंग, सिर्फ़ एक ज़रूरी सेशन कुकी। जाने से पहले जो चाहिए उसे एक्सपोर्ट कर लें।',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'आपकी फ़ाइलें अपने आप हटा दी जाती हैं। [प्राइवेसी](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'आपकी फ़ाइलें आपके ब्राउज़र में प्रोसेस होती हैं और आपके डिवाइस पर रहती हैं। वेबसाइट, डाउनलोड और काउंटर एन्क्रिप्टेड कनेक्शन (HTTPS) इस्तेमाल करते हैं। जो भी इस ब्राउज़र प्रोफ़ाइल को इस्तेमाल कर सकता है वह उसमें रखी ट्रांसक्रिप्ट तब तक देख सकता है जब तक वे हटाई न जाएँ, इसलिए साझा कंप्यूटर पर **मेरा डेटा अभी हटाएँ** दबाएँ।',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'आपकी फ़ाइलें हमारे सर्वर पर अपलोड होती हैं ताकि वहाँ प्रोसेस हो सकें। वे सिर्फ़ आपके सेशन तक रखी जाती हैं और सेशन ख़त्म होने पर, {idle} तक कोई गतिविधि न होने पर, या ट्रांसक्रिप्ट मेन्यू में **मेरा डेटा अभी हटाएँ** दबाते ही तुरंत अपने आप हट जाती हैं। कोई अकाउंट या ट्रैकिंग नहीं है, और एकमात्र कुकी एक ज़रूरी सेशन कुकी है (कोई एनालिटिक्स या विज्ञापन कुकी नहीं)।',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'आपकी फ़ाइलें हमारे सर्वर पर अपलोड होती हैं ताकि वहाँ प्रोसेस हो सकें। वे सिर्फ़ आपके सेशन तक रखी जाती हैं और सेशन ख़त्म होने पर, या ट्रांसक्रिप्ट मेन्यू में **मेरा डेटा अभी हटाएँ** दबाते ही तुरंत अपने आप हट जाती हैं। कोई अकाउंट या ट्रैकिंग नहीं है, और एकमात्र कुकी एक ज़रूरी सेशन कुकी है (कोई एनालिटिक्स या विज्ञापन कुकी नहीं)।',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'आपकी फ़ाइलें इस डिवाइस से बाहर कभी नहीं जातीं। ट्रांसक्रिप्ट सिर्फ़ इसी ब्राउज़र में रखी जाती हैं और {idle} तक कोई गतिविधि न होने पर, या "मेरा डेटा अभी हटाएँ" दबाने पर अपने आप हट जाती हैं। जाने से पहले जो चाहिए उसे एक्सपोर्ट कर लें।',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'आपकी फ़ाइलें इस डिवाइस से बाहर कभी नहीं जातीं। ट्रांसक्रिप्ट सिर्फ़ इसी ब्राउज़र में रखी जाती हैं और सेशन ख़त्म होने पर, या "मेरा डेटा अभी हटाएँ" दबाने पर अपने आप हट जाती हैं। जाने से पहले जो चाहिए उसे एक्सपोर्ट कर लें।',
  'Your session ends in {mins} min. Export what you need.':
    'आपका सेशन {mins} मिनट में ख़त्म होगा। जो चाहिए उसे एक्सपोर्ट कर लें।',
  'Your session has ended': 'आपका सेशन ख़त्म हो गया है',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'आपका सेशन ख़त्म हो गया है और उसका डेटा हटा दिया गया। आप नई ट्रांसक्रिप्शन शुरू कर सकते हैं।',
  'Your transcript is ready below.': 'आपकी ट्रांसक्रिप्ट नीचे तैयार है।',
  'Your transcripts': 'आपकी ट्रांसक्रिप्ट',
  'Your transcripts and files were removed from the server.':
    'आपकी ट्रांसक्रिप्ट और फ़ाइलें सर्वर से हटा दी गईं।',
  'Your transcripts and files were removed from this device.':
    'आपकी ट्रांसक्रिप्ट और फ़ाइलें इस डिवाइस से हटा दी गईं।',
  'title:/': 'वीडियो से टेक्स्ट मुफ़्त, बिना लॉगिन',
  'description:/':
    'वीडियो और ऑडियो को मुफ़्त में टेक्स्ट में बदलें। बिना लॉगिन, रोज़ की कोई सीमा नहीं, 50+ भाषाएँ। टाइमस्टैम्प वाला टेक्स्ट SRT, VTT, TXT, PDF में एक्सपोर्ट करें।',
  'title:/about': 'TranscribeVid के बारे में',
  'description:/about':
    'TranscribeVid कौन बनाता है और क्यों: बिना साइन-अप और बिना लॉगिन वाला मुफ़्त वीडियो और ऑडियो से टेक्स्ट टूल, साफ़ इंटरफ़ेस के साथ, जिसका खर्च विज्ञापन उठाते हैं।',
  'title:/audio-to-text': 'ऑडियो से टेक्स्ट कन्वर्टर: मुफ़्त',
  'description:/audio-to-text':
    'पॉडकास्ट, इंटरव्यू और लेक्चर को टेक्स्ट में बदलें। टाइमस्टैम्प, 50+ भाषाओं और बिना लॉगिन वाला मुफ़्त कन्वर्टर। TXT, SRT, VTT या PDF डाउनलोड करें।',
  'label:/audio-to-text': 'ऑडियो से टेक्स्ट',
  'title:/contact': 'संपर्क',
  'description:/contact':
    'TranscribeVid से संपर्क कैसे करें: सवाल, बग रिपोर्ट, सुविधा के सुझाव और प्राइवेसी अनुरोधों के लिए ई-मेल, और वेबसाइट कौन चलाता है।',
  'title:/faq': 'अक्सर पूछे जाने वाले सवाल',
  'description:/faq':
    'TranscribeVid के बारे में आम सवालों के जवाब: सटीकता, भाषाएँ, समर्थित फ़ाइलें और सीमाएँ, गति, प्राइवेसी और एडिटिंग।',
  'title:/guides': 'गाइड',
  'description:/guides':
    'ट्रांसक्रिप्ट और सबटाइटल पर व्यावहारिक गाइड: SRT या VTT, वीडियो में सबटाइटल कैसे जोड़ें, सटीक ट्रांसक्रिप्ट कैसे पाएँ, और निजी ट्रांसक्रिप्शन।',
  'title:/guides/accurate-transcripts': 'ज़्यादा सटीक ट्रांसक्रिप्ट कैसे पाएँ',
  'description:/guides/accurate-transcripts':
    'स्पीच-टू-टेक्स्ट की सटीकता बढ़ाने के व्यावहारिक तरीके: साफ़ ऑडियो, सही भाषा और मॉडल, शब्दावली संकेत, और नतीजे को जाँचकर ठीक करना।',
  'label:/guides/accurate-transcripts': 'ज़्यादा सटीक ट्रांसक्रिप्ट कैसे पाएँ',
  'title:/guides/how-to-add-subtitles-to-a-video': 'वीडियो में सबटाइटल कैसे जोड़ें (मुफ़्त)',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'चार कदमों में सबटाइटल बनाएँ: वीडियो ट्रांसक्राइब करें, टेक्स्ट ठीक करें, SRT या VTT एक्सपोर्ट करें, फिर फ़ाइल YouTube, VLC, एडिटर या अपने वेब प्लेयर में जोड़ें।',
  'label:/guides/how-to-add-subtitles-to-a-video': 'वीडियो में सबटाइटल कैसे जोड़ें',
  'title:/guides/srt-vs-vtt': 'SRT बनाम VTT: कौन-सा फ़ॉर्मैट चुनें',
  'description:/guides/srt-vs-vtt':
    'SRT या VTT? हर सबटाइटल फ़ॉर्मैट क्या है, दोनों में क्या फ़र्क़ है, कौन कहाँ चलता है, और अपने वीडियो से कोई भी फ़ाइल मुफ़्त में कैसे पाएँ।',
  'label:/guides/srt-vs-vtt': 'SRT बनाम VTT',
  'title:/guides/transcribe-video-without-uploading': 'वीडियो को अपलोड किए बिना ट्रांसक्राइब करें',
  'description:/guides/transcribe-video-without-uploading':
    'ब्राउज़र में ट्रांसक्रिप्शन कैसे काम करता है, क्या आपके डिवाइस पर रहता है, क्या एक बार डाउनलोड होता है, और ब्राउज़र के नेटवर्क पैनल में इसे खुद कैसे जाँचें।',
  'label:/guides/transcribe-video-without-uploading': 'वीडियो को अपलोड किए बिना ट्रांसक्राइब करें',
  'title:/guides/what-is-whisper': 'Whisper क्या है? स्पीच-टू-टेक्स्ट समझें',
  'description:/guides/what-is-whisper':
    'OpenAI Whisper क्या है, किस पर प्रशिक्षित हुआ, कितना सटीक है और कहाँ चूकता है, और TranscribeVid पर यह आपके ब्राउज़र के अंदर कैसे चलता है।',
  'label:/guides/what-is-whisper': 'Whisper क्या है?',
  'title:/how-it-works': 'यह कैसे काम करता है',
  'description:/how-it-works':
    'TranscribeVid तीन आसान कदमों में वीडियो और ऑडियो को सटीक, टाइमस्टैम्प वाले टेक्स्ट में कैसे बदलता है, आपको क्या मिलता है, और सबसे अच्छे नतीजों के सुझाव।',
  'title:/interview-transcription': 'इंटरव्यू ट्रांसक्रिप्शन: निजी और मुफ़्त',
  'description:/interview-transcription':
    'बिना अकाउंट बनाए इंटरव्यू मुफ़्त में ट्रांसक्राइब करें। 50+ भाषाओं में टाइमस्टैम्प वाला टेक्स्ट, शोध, पत्रकारिता और भर्ती के लिए। TXT या PDF डाउनलोड करें।',
  'label:/interview-transcription': 'इंटरव्यू ट्रांसक्रिप्शन',
  'title:/lecture-to-text': 'लेक्चर से टेक्स्ट: मुफ़्त ट्रांसक्राइबर',
  'description:/lecture-to-text':
    'रिकॉर्ड किए लेक्चर को खोजने और पढ़ने लायक टेक्स्ट नोट्स में बदलें। मुफ़्त, बिना लॉगिन, 50+ भाषाएँ, टाइमस्टैम्प। TXT, Markdown, SRT या PDF डाउनलोड करें।',
  'label:/lecture-to-text': 'लेक्चर से टेक्स्ट',
  'title:/m4a-to-text': 'M4A से टेक्स्ट: वॉइस मेमो मुफ़्त',
  'description:/m4a-to-text':
    'M4A वॉइस मेमो या रिकॉर्डिंग को मुफ़्त में टेक्स्ट में बदलें। iPhone के वॉइस मेमो के साथ चलता है, बिना लॉगिन, 50+ भाषाएँ, टाइमस्टैम्प। TXT, SRT, VTT या PDF।',
  'label:/m4a-to-text': 'M4A से टेक्स्ट',
  'title:/meeting-recording-to-text': 'Zoom, Teams, Meet रिकॉर्डिंग से टेक्स्ट',
  'description:/meeting-recording-to-text':
    'Zoom, Teams या Google Meet की रिकॉर्डिंग को खोजने लायक, टाइमस्टैम्प वाली ट्रांसक्रिप्ट में मुफ़्त बदलें। बिना लॉगिन, 50+ भाषाएँ। TXT, SRT, VTT, PDF।',
  'label:/meeting-recording-to-text': 'मीटिंग रिकॉर्डिंग से टेक्स्ट',
  'title:/mov-to-text': 'MOV से टेक्स्ट: iPhone वीडियो मुफ़्त',
  'description:/mov-to-text':
    'अपने iPhone या QuickTime का MOV वीडियो मुफ़्त में ट्रांसक्राइब करें। बिना लॉगिन, 50+ भाषाएँ, हर लाइन पर टाइमस्टैम्प। TXT, SRT, VTT या PDF डाउनलोड करें।',
  'label:/mov-to-text': 'MOV से टेक्स्ट',
  'title:/mp3-to-text': 'MP3 से टेक्स्ट कन्वर्टर: मुफ़्त',
  'description:/mp3-to-text':
    'MP3 को ऑनलाइन मुफ़्त में टेक्स्ट में ट्रांसक्राइब करें। बिना लॉगिन, 50+ भाषाएँ, हर लाइन पर टाइमस्टैम्प। टेक्स्ट एडिट करें और TXT, SRT, VTT या PDF डाउनलोड करें।',
  'label:/mp3-to-text': 'MP3 से टेक्स्ट',
  'title:/mp4-to-text': 'MP4 से टेक्स्ट: MP4 वीडियो मुफ़्त',
  'description:/mp4-to-text':
    'MP4 वीडियो को टाइमस्टैम्प के साथ टेक्स्ट में बदलें। मुफ़्त, बिना लॉगिन, रोज़ की कोई सीमा नहीं, 50+ भाषाएँ। TXT, SRT, VTT, Markdown, JSON या PDF डाउनलोड करें।',
  'label:/mp4-to-text': 'MP4 से टेक्स्ट',
  'title:/podcast-transcript-generator': 'मुफ़्त पॉडकास्ट ट्रांसक्रिप्ट जनरेटर',
  'description:/podcast-transcript-generator':
    'MP3 या WAV से पॉडकास्ट ट्रांसक्रिप्ट मुफ़्त में बनाएँ। टाइमस्टैम्प, 50+ भाषाएँ, बिना लॉगिन। एडिट करें, फिर TXT, Markdown, SRT, VTT या PDF डाउनलोड करें।',
  'label:/podcast-transcript-generator': 'पॉडकास्ट ट्रांसक्रिप्ट जनरेटर',
  'title:/privacy': 'प्राइवेसी पॉलिसी',
  'description:/privacy':
    'फ़ाइल ट्रांसक्राइब करने पर TranscribeVid क्या प्रोसेस करता है, कहाँ और क्यों, कितने समय रखता है, साथ ही कुकी, विज्ञापन, ब्राउज़र स्टोरेज और आपके अधिकार।',
  'title:/srt-subtitle-generator': 'वीडियो से मुफ़्त SRT सबटाइटल जनरेटर',
  'description:/srt-subtitle-generator':
    'किसी भी वीडियो या ऑडियो से SRT सबटाइटल फ़ाइल मुफ़्त में बनाएँ। बोली के हिसाब से समय, 50+ भाषाएँ, बिना लॉगिन। लाइनें एडिट करें, फिर SRT या VTT डाउनलोड करें।',
  'label:/srt-subtitle-generator': 'SRT सबटाइटल जनरेटर',
  'title:/terms': 'उपयोग की शर्तें',
  'description:/terms':
    'TranscribeVid इस्तेमाल करने के नियम: मुफ़्त सेवा, आपकी सामग्री, स्वीकार्य उपयोग, फ़ाइल की सीमाएँ, ट्रांसक्रिप्ट की सटीकता पर कोई वारंटी नहीं, और ज़िम्मेदारी।',
  'title:/tools': 'सारे मुफ़्त टूल',
  'description:/tools':
    'वीडियो और ऑडियो से टेक्स्ट के सारे मुफ़्त टूल एक सूची में: फ़ाइल प्रकार, उपयोग, सबटाइटल फ़ाइलें और भाषा के हिसाब से। बिना लॉगिन, रोज़ की कोई सीमा नहीं।',
  'title:/translate-audio-to-english': 'बोली का अंग्रेज़ी टेक्स्ट अनुवाद, मुफ़्त',
  'description:/translate-audio-to-english':
    'दूसरी भाषा की बोली को मुफ़्त में अंग्रेज़ी टेक्स्ट में बदलें। वीडियो या ऑडियो फ़ाइल डालें, टाइमस्टैम्प वाला अंग्रेज़ी टेक्स्ट या सबटाइटल पाएँ। बिना लॉगिन।',
  'label:/translate-audio-to-english': 'बोली को अंग्रेज़ी में अनुवाद करें',
  'title:/video-to-text': 'मुफ़्त वीडियो से टेक्स्ट कन्वर्टर',
  'description:/video-to-text':
    'वीडियो को मुफ़्त में टेक्स्ट में बदलें। 50+ भाषाओं में सटीक, टाइमस्टैम्प वाली ट्रांसक्रिप्ट पाएँ। बिना लॉगिन, रोज़ की कोई सीमा नहीं। SRT, VTT, TXT, PDF।',
  'label:/video-to-text': 'वीडियो से टेक्स्ट',
  'title:/voice-recording-to-text': 'वॉइस रिकॉर्डिंग से टेक्स्ट: मुफ़्त',
  'description:/voice-recording-to-text':
    'ब्राउज़र में अपनी आवाज़ रिकॉर्ड करें या वॉइस मेमो अपलोड करें और उसे टेक्स्ट में पाएँ। मुफ़्त, बिना लॉगिन, 50+ भाषाएँ। TXT, PDF, SRT या Markdown डाउनलोड करें।',
  'label:/voice-recording-to-text': 'वॉइस रिकॉर्डिंग से टेक्स्ट',
  'title:/vtt-subtitle-generator': 'मुफ़्त VTT (WebVTT) सबटाइटल जनरेटर',
  'description:/vtt-subtitle-generator':
    'किसी भी वीडियो या ऑडियो से WebVTT (.vtt) सबटाइटल फ़ाइल मुफ़्त में बनाएँ। बोली के हिसाब से समय, 50+ भाषाएँ, बिना लॉगिन। लाइनें एडिट करें, फिर VTT डाउनलोड करें।',
  'label:/vtt-subtitle-generator': 'VTT सबटाइटल जनरेटर',
  'title:/wav-to-text': 'WAV से टेक्स्ट: मुफ़्त ऑनलाइन',
  'description:/wav-to-text':
    'WAV फ़ाइल को मुफ़्त में टेक्स्ट में बदलें। फ़ील्ड रिकॉर्डर और कॉल की लंबी रिकॉर्डिंग भी चलती हैं, 50+ भाषाएँ, टाइमस्टैम्प, बिना लॉगिन। TXT, SRT, PDF।',
  'label:/wav-to-text': 'WAV से टेक्स्ट',
  'title:/webm-to-text': 'WebM से टेक्स्ट: मुफ़्त, बिना लॉगिन',
  'description:/webm-to-text':
    'WebM वीडियो या ऑडियो फ़ाइल को मुफ़्त में टेक्स्ट में बदलें। स्क्रीन और ब्राउज़र रिकॉर्डिंग के साथ चलता है, 50+ भाषाएँ, टाइमस्टैम्प। TXT, SRT, VTT, PDF।',
  'label:/webm-to-text': 'WebM से टेक्स्ट',
  'title:/whatsapp-voice-message-to-text': 'WhatsApp वॉइस मैसेज से टेक्स्ट, मुफ़्त',
  'description:/whatsapp-voice-message-to-text':
    'WhatsApp वॉइस मैसेज को मुफ़्त में टेक्स्ट में बदलें। वॉइस नोट सेव करें, यहाँ डालें, और हिंदी समेत 50+ भाषाओं में पढ़ें। बिना लॉगिन, बिना अकाउंट।',
  'label:/whatsapp-voice-message-to-text': 'WhatsApp वॉइस मैसेज से टेक्स्ट',
  'title:/youtube-subtitle-generator': 'YouTube सबटाइटल जनरेटर: मुफ़्त SRT',
  'description:/youtube-subtitle-generator':
    'अपने YouTube वीडियो के लिए मुफ़्त में, बिना लॉगिन किए SRT सबटाइटल फ़ाइल बनाएँ। बोली के हिसाब से समय, 50+ भाषाएँ। उसे YouTube Studio में अपलोड करें।',
  'label:/youtube-subtitle-generator': 'YouTube सबटाइटल जनरेटर',
  'This page was translated with AI. [Found a mistake? Tell us.](/contact)':
    'यह पेज AI से अनुवादित है। [कोई गलती मिली? हमें बताएँ।](/contact)',
  'A finished transcript: a media player next to the text in short lines, each with a timestamp.':
    'तैयार ट्रांसक्रिप्ट: मीडिया प्लेयर के साथ छोटी-छोटी पंक्तियों में टेक्स्ट, हर पंक्ति के साथ टाइमस्टैम्प।',
  'A finished transcript. Every line has a timestamp, and Export saves it as SRT, VTT, TXT, PDF and more.':
    'तैयार ट्रांसक्रिप्ट। हर पंक्ति पर टाइमस्टैम्प है, और एक्सपोर्ट इसे SRT, VTT, TXT, PDF और अन्य रूपों में सहेजता है।',
};
export default dict;
