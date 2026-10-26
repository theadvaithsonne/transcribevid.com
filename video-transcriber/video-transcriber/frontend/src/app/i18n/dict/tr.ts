/** Turkish dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
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
  '"{name}" is {size}; the limit is {limit}.': '“{name}” {size} boyutunda; sınır {limit}.',
  '"{name}" is empty.': '“{name}” boş.',
  '"{name}" is ready. Press Transcribe to start.':
    '“{name}” hazır. Başlatmak için Yazıya dök düğmesine basın.',
  '“{title}” was deleted.': '“{title}” silindi.',
  '(optional)': '(isteğe bağlı)',
  '{base} Word timing: {timing}.': '{base} Kelime zamanlaması: {timing}.',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand} ({domain}), **{name}** tarafından işletilmektedir; adres: {address} (“biz”). Verilerinizin nasıl ve neden işlendiğine, burada açıklandığı şekilde biz karar veririz.',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand} ({domain}), **{name}** tarafından yürütülmektedir; adres: {address}. Daha fazlası için [Hakkında](/about) sayfasına bakın.',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand} genel kitleye yönelik bir hizmettir ve 13 yaşın altındaki (uygulanabilir olduğu yerlerde AB’de 16 yaşın altındaki) çocuklara yönelik değildir.',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand}, **{name}** ({role}, {city}) tarafından geliştirilmiş ve işletilmektedir. Bunu insanlara olabilecek en iyi yazıya dökme deneyimini sunmak için geliştirdim: ilk tıklamadan itibaren sorunsuz, oluşturulacak bir hesap olmadan ve yolunuza çıkmayan temiz bir arayüzle.',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} genel kitleye yöneliktir ve 13 yaşın altındaki çocuklara yönelik değildir.',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages) and beside a finished transcript. No ad is shown while a file is being transcribed, and never on the privacy, terms or logs pages.':
    '{brand} reklam gösterdiği için ücretsizdir; reklamları Google AdSense sunar. Reklamlar yalnızca bilgi sayfalarında (ana sayfa, Nasıl çalışır, SSS ve araç sayfaları) ve tamamlanmış bir transkriptin yanında görünür. Bir dosya yazıya dökülürken hiçbir reklam gösterilmez; gizlilik, şartlar veya günlük sayfalarında da asla gösterilmez.',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    '{brand} kullanım için ücretsizdir. [Gizlilik politikası](/privacy) dosyalarınıza ne olduğunu açıklar.',
  '{brand} is funded by ads shown on its information pages and beside finished transcripts (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand}, bilgi sayfalarında ve tamamlanmış transkriptlerin yanında gösterilen reklamlarla (Google AdSense) finanse edilir. Yazıya dökme işlemini kendi cihazınız yaptığı için her dosya için sunucu maliyeti yoktur; hizmeti ücretsiz ve sınırsız tutan da budur. [Gizlilik politikası](/privacy) reklamların neyi kullandığını ve ayarlarınızı nasıl seçeceğinizi açıklar.',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand}, bir video veya ses dosyasındaki konuşmayı üç basit adımda zaman damgalı metne dönüştürür.',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand}, videolardaki, ses dosyalarındaki ve ses kayıtlarındaki konuşmayı doğru, zaman damgalı metne dönüştürür. Ücretsizdir, yazıya dökeceğiniz dosya sayısında sınır yoktur ve hesap gerekmez: yukarıdan bir dosya seçin, Yazıya dök düğmesine basın ve sonucu okuyun.',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages and beside finished transcripts (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand}, video ve ses dosyalarını doğrudan tarayıcınızda metne dönüştürür: tanıma cihazınızda çalışır ve dosyalarınız bize yüklenmez. Kullanımı ücretsizdir ve hesap gerektirmez. Bilgi sayfalarındaki ve tamamlanmış transkriptlerin yanındaki reklamlarla (Google AdSense; bkz. [Gizlilik politikası](/privacy)) finanse edilir. Özellikleri istediğimiz zaman değiştirebilir, sınırlayabilir veya durdurabiliriz.',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand}, videoyu ve sesi ücretsiz olarak doğru, zaman damgalı metne dönüştürür. Kayıt yok, giriş yok, filigran yok: sayfayı açın, bir dosya seçin ve transkriptinizi okuyun.',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies.':
    '{brand}, video ve sesi doğrudan tarayıcınızda metne dönüştürür. Bu sayfa, bunun verileriniz açısından ne anlama geldiğini sade bir dille açıklar. Kısaca: Dosyanız cihazınızdan hiç ayrılmaz. Transkriptleriniz yalnızca bu tarayıcıda saklanır, hesap yoktur ve site kendi çerezlerini ayarlamaz. Reklamlar yalnızca bilgi sayfalarında ve tamamlanmış transkriptlerin yanında görünür ve çerez kullanan Google tarafından sunulur.',
  '{done} of {total}': '{done} / {total}',
  '{duration} (estimate)': '{duration} (tahmini)',
  '{gb} GB of memory recommended': '{gb} GB bellek önerilir',
  '{h} h': '{h} sa',
  '{h} h {m} min': '{h} sa {m} dk',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)': '{label} (ilk kullanımda {size} MB indirilir)',
  "{label}, as reported by visitors' browsers":
    '{label}, ziyaretçilerin tarayıcılarının bildirdiği şekilde',
  '{label}: common questions': '{label}: sık sorulan sorular',
  '{label}. {title}.': '{label}. {title}.',
  '{label}. Look for it in your downloads.': '{label}. İndirilenler klasörünüzde arayın.',
  '{language} → English': '{language} → İngilizce',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} {total} dosyadan {done} tanesi zaten kuyruğa alındı; kalan {left} dosya hâlâ listede, yeniden denemek için Yazıya dök düğmesine basın.',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} {total} dosyadan {done} tanesi zaten kuyruğa alındı; kalan {left} dosya hâlâ listede, yeniden denemek için Yazıya dök düğmesine basın.',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '{model} bu cihazda gerçek zamandan yavaş çalışır: {audio} ses için {wait} (tahmini). Tiny veya base daha çabuk biter.',
  '{n} files were skipped: not video or audio.': '{n} dosya atlandı: video veya ses değil.',
  '{n} h ago': '{n} sa önce',
  '{n} min': '{n} dk',
  '{n} min ago': '{n} dk önce',
  '{n} min left': '{n} dk kaldı',
  '{n} min read': '{n} dk okuma',
  '{n} minute': '{n} dakika',
  '{n} minutes': '{n} dakika',
  '{n} of {total}': '{n} / {total}',
  '{n} of those files are already in the list.': 'Bu dosyalardan {n} tanesi zaten listede.',
  '{n} video transcribed': '{n} video yazıya döküldü',
  '{n} videos transcribed': '{n} video yazıya döküldü',
  '{n} words': '{n} kelime',
  '{n}% done': '%{n} tamamlandı',
  '{n}% model confidence': '%{n} model güveni',
  '{n}s left': '{n} sn kaldı',
  '{name} home': '{name} ana sayfa',
  '{size} download': '{size} indirme',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}.',
  '{title}. {blurb}': '{title}. {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}. {blurb} Bu cihazda kullanılamaz: {reason}.',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**Bu sekmede teknik bir günlük.** Günlükler sayfası bu sekmenin kendi teknik günlüğünü gösterir. Tarayıcınızda kalır ve hiçbir yere gönderilmez.',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**Kelime ipucu ekleyin**: seste geçen isimleri, markaları ve terimleri istediğiniz yazımla yazın.',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**Kelime ipucu ekleyin**: isimleri, markaları ve terimleri istediğiniz yazımla yazın.',
  '**Ads.** Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed.':
    '**Reklamlar.** Reklamlar yalnızca bilgi sayfalarında ve tamamlanmış transkriptlerin yanında görünür ve çerez kullanan Google tarafından sunulur. Bir dosya yazıya dökülürken hiçbir reklam gösterilmez.',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**İşaretli satırları kontrol edin** ve transkript düzenleyicisinde düzeltin.',
  '**Choose the spoken language** instead of auto-detect.':
    '**Konuşulan dili seçin**, otomatik algılamaya bırakmayın.',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**Dosyanızı seçin.** Yukarıya bir video veya ses dosyası bırakın, cihazınızdan seçin ya da mikrofonla sesinizi kaydedin. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG ve diğer yaygın biçimlerin çoğu çalışır.',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**Sesi iyileştir** — uğultuyu ve cızırtıyı süz, kısık sesli konuşmacıları dengele',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**Dosya sınırları.** Bizim koyduğumuz sınır yok. Dosyanız cihazınızda işlenir; bu yüzden çok büyük veya uzun dosyalar daha uzun sürer ve yeterli boş bellek gerektirir; daha yavaş bir cihazda sayfa sizi uyarır.',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**Dosya türleri.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS ve MTS. Ses: MP3, WAV, M4A, AAC, FLAC, OGG ve OPUS. Doğrudan mikrofonunuzdan da kayıt yapabilirsiniz.',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**Google’ın çerezleri.** Reklamlar yüklendiğinde Google kendi çerezlerini yalnızca reklam gösteren sayfalarda ayarlar (bkz. 6. bölüm).',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**Dersler ve podcast’ler**, çalışmak veya bölüm notları için okunabilir metne dönüştürülür.',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**Sınırlar.** Sunucu şu anda bir boyut veya uzunluk sınırı duyurmuyor. Çok büyük dosyalar yalnızca daha uzun sürer.',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**Sınırlar.** Boyut veya uzunluk sınırı koymuyoruz: dosyanız cihazınızda işlenir, bu yüzden çok büyük veya uzun dosyalar yalnızca daha uzun sürer ve yeterli boş bellek gerektirir. Daha yavaş bir cihazda sayfa, başlamadan önce sizi uyarır ve süreyi tahmin eder.',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**Eklediğiniz medya.** Seçtiğiniz veya kaydettiğiniz video ya da ses dosyaları. Tarayıcınızda, cihazınızda (WebGPU veya WebAssembly kullanılarak) işlenir. Dosyanız asla sunucularımıza yüklenmez ve Google’a ya da başkasına gönderilmez.',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**Toplantı ve görüşme notları**; arayabilir, alıntılayabilir ve paylaşabilirsiniz.',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**Hatalar olur.** Hiçbir konuşma tanıma kusursuz değildir. Önemli bir şey için güvenmeden önce bir transkripti her zaman doğrulayın.',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**Kendi çerezlerimiz yok.** Site kendisi hiçbir çerez ayarlamaz.',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Sonrası için hiçbir şey kaydedilmez.** Dosyalar ve transkriptler yalnızca oturumunuz boyunca vardır. Ayrılmadan önce ihtiyacınız olanı dışa aktarın. Ayrıntılar [Gizlilik politikası](/privacy) sayfasındadır.',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Sonrası için hiçbir şey kaydedilmez.** Transkriptler ve dosya yalnızca bu tarayıcıda kalır ve {idle} hareketsizlikten sonra ya da **Verilerimi şimdi sil** düğmesine bastığınızda otomatik olarak silinir. Ayrılmadan önce ihtiyacınız olanı dışa aktarın. Ayrıntılar [Gizlilik politikası](/privacy) sayfasındadır.',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**Sonrası için hiçbir şey kaydedilmez.** Transkriptler yalnızca bu oturum için vardır; bu yüzden ihtiyacınız olanı dışa aktarın. [Gizlilik politikası](/privacy), barındırılan web sitesini açıklar.',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**Tek bir toplam sayı.** Bir yazıya dökme işlemi bittiğinde tarayıcınız sayacımıza (bir Cloudflare Worker) tek bir anonim “+1” gönderir. İçinde dosya, transkript veya tanımlayıcı yoktur. Cloudflare, IP adresinizi iletim sırasında görür ve kötüye kullanımı sınırlamak için kısa süreliğine kullanır (hız sınırı); biz yalnızca toplamı saklarız. Sayfa başlığında gösterilen sayı ziyaretçilerin tarayıcılarınca bildirilir ve doğrulanmamıştır.',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    'Zor sesler için **Yüksek doğruluk veya En yüksek doğruluk** seçin.',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**Kaliteyi ve dili seçin.** Daha hızlı bir model çabuk bir taslak verir; daha doğru olanı röportajlar, dersler ve altyazılar için daha iyidir. Konuşulan dil sizin için algılanabilir ve 50’den fazla dil desteklenir.',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    'Bitmiş bir transkripti başka bir kalite veya dille **yeniden yazıya dökün**; mevcut transkriptiniz korunur.',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    'Başka bir kalite veya dille **yeniden yazıya dökün**; mevcut transkriptiniz korunur.',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**Okuyun, düzeltin ve indirin.** Transkript zaman damgalarıyla görünür ve modelin emin olmadığı kelimeler işaretlenir, böylece kontrol edebilirsiniz. Düz metin, SRT veya VTT altyazı, Markdown ya da JSON olarak indirin.',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**Web sitesini ileten istekler.** Bu web sitesini Cloudflare (Cloudflare Pages) iletir. Barındırma ve ağ sağlayıcımız olarak, siteyi iletmek ve korumak için IP adresinizi ve olağan istek verilerini (zaman, istenen sayfa ve tarayıcınız gibi) işler.',
  '**Skip silence & music** — prevents made-up text':
    '**Sessizlikleri ve müziği atla** — uydurma metni önler',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**Konuşma modelleri tarayıcınızın önbelleğinde kalır** (Cache Storage); böylece bir sonraki yazıya dökme daha hızlı başlar. Siz onları silene (**Verilerimi şimdi sil** de bunları silebilir) ya da tarayıcınız depolamasını temizleyene kadar kalırlar. Bunlar program dosyalarıdır, verileriniz değil.',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**Hız.** Seçtiğiniz kaliteye, dosyanın uzunluğuna ve hizmetin ne kadar meşgul olduğuna bağlıdır.',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**Hız.** Cihazınıza, seçtiğiniz kaliteye ve dosyanın uzunluğuna bağlıdır. Bir kalite düzeyinin ilk kullanımı modelini bir kez indirir: tarayıcınız model dosyalarını Hugging Face’ten, motorun program dosyalarını jsDelivr’den alır, sonra önbellekte tutar. Çalışırken sekmeyi açık tutun.',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**İyi bir sesle başlayın**: daha az arka plan gürültüsü, yakın bir mikrofon ve aynı anda tek kişinin konuşması. “Sesi iyileştir” açık kalsın.',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**İyi bir sesle başlayın**: az arka plan gürültüsü, yakın bir mikrofon, aynı anda tek kişi. “Sesi iyileştir” açık kalsın.',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**Tarayıcınızdaki depolama.** Tarayıcınız, yukarıda açıklandığı gibi transkriptlerinizi ve dosyalarınızı (IndexedDB) ve konuşma modellerini (Cache Storage) tutar, açık veya koyu tema seçiminizi hatırlar ve oturum depolaması mevcut sekme için birkaç kolaylık ayarını (son kalite seçiminiz gibi) saklar. Bunların hiçbiri bize gönderilmez.',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    'Kendi videolarınız, reels’leriniz ve çevrimiçi kurslarınız için **altyazılar**; bir SRT veya VTT dosyasından.',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**Cihazınızda oluşturulan metin.** Transkript, zaman damgaları ve düzenlemeleriniz, seçtiğiniz başlık ve yaptığınız ayarlar (kalite, dil, kelime ipucu). Bu tarayıcıda oluşturulur ve saklanır; biz bunları hiç almayız.',
  '**Use previous text as context** — can repeat on long files':
    '**Önceki metni bağlam olarak kullan** — uzun dosyalarda tekrar edebilir',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**Sesli notlar** yazıya dökülür; böylece onları yeniden dinlemeniz gerekmez.',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**Sonuçlar neden çalıştırmalar, kalite ayarları veya başka araçlar arasında farklı olabilir?** Konuşma tanıma olasılığa dayanır: en olası kelimeleri seçer ve gürültülü ya da belirsiz kısımlarda birkaç yanıt birbirine yakındır. Farklı bir kalite ayarı, dil ayarı, kelime ipucu veya ses temizleme metni değiştirebilir; farklı bir sistem kullanan başka bir araç da öyle. Konuşmacı adları veya etiketleri eklenmez.',
  '**Word-level timing** — better subtitles and confidence marks':
    '**Kelime düzeyinde zamanlama** — daha iyi altyazılar ve güven işaretleri',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**Dosyalarınız ve transkriptleriniz bu tarayıcıda kalır.** Transkriptler, düzenlemeler ve kaynak dosya yalnızca bu tarayıcının depolamasında (IndexedDB) tutulur. Oturumunuz bittiğinde (bu, {idle} hareketsizlikten sonra gerçekleşir) otomatik olarak, Transkriptler menüsündeki **Verilerimi şimdi sil** düğmesine bastığınızda ise hemen silinir.',
  '1 file was skipped: not video or audio.': '1 dosya atlandı: video veya ses değil.',
  '1 minute': '1 dakika',
  '1 word': '1 kelime',
  '1. Agreement': '1. Sözleşme',
  '1. Who runs this website': '1. Bu web sitesini kim işletiyor',
  '10. Children': '10. Çocuklar',
  '10. Termination': '10. Fesih',
  '11. Children': '11. Çocuklar',
  '11. Your rights and choices': '11. Haklarınız ve seçimleriniz',
  '12. Changes': '12. Değişiklikler',
  '12. Open-source components': '12. Açık kaynak bileşenler',
  '13. Changes to this policy': '13. Bu politikadaki değişiklikler',
  '13. Governing law': '13. Uygulanacak hukuk',
  '14. Contact': '14. İletişim',
  '2. The service': '2. Hizmet',
  '2. What is processed, and where': '2. Ne işlenir ve nerede',
  '3 simple steps': '3 basit adım',
  '3. Why it is processed': '3. Neden işlenir',
  '3. Your content': '3. İçeriğiniz',
  '4. Acceptable use': '4. Kabul edilebilir kullanım',
  '4. How long it is kept': '4. Ne kadar süre saklanır',
  '5. Downloads your browser makes': '5. Tarayıcınızın yaptığı indirmeler',
  '5. Limits: your device does the work': '5. Sınırlar: işi cihazınız yapar',
  '6. Accuracy: no warranty': '6. Doğruluk: garanti yok',
  '6. Advertising': '6. Reklam',
  '7. Availability': '7. Kullanılabilirlik',
  '7. Cookies and browser storage': '7. Çerezler ve tarayıcı depolaması',
  '8. Sharing': '8. Paylaşım',
  '8. Third-party downloads and ads': '8. Üçüncü taraf indirmeleri ve reklamlar',
  '9. Liability': '9. Sorumluluk',
  '9. Security': '9. Güvenlik',
  'A name cannot be empty, so the old name was kept.': 'Ad boş olamaz; bu yüzden eski ad korundu.',
  'A new transcript has started. The old one is kept in your list.':
    'Yeni bir transkript başladı. Eskisi listenizde duruyor.',
  'a period': 'bir süre',
  About: 'Hakkında',
  'About {brand}': '{brand} hakkında',
  'about {h} h': 'yaklaşık {h} sa',
  'about {h} h {m} min': 'yaklaşık {h} sa {m} dk',
  'about {n} min': 'yaklaşık {n} dk',
  'Accurate text': 'Doğru metin',
  'Add another file': 'Başka bir dosya ekle',
  'Add your file': 'Dosyanızı ekleyin',
  'Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    'Reklamlar yalnızca bilgi sayfalarında ve tamamlanmış transkriptlerin yanında görünür ve çerez kullanan Google tarafından sunulur. Bir dosya yazıya dökülürken hiçbir reklam gösterilmez ve bu web sitesi kendi çerezlerini ayarlamaz. Ayrıntılar [Gizlilik politikası](/privacy) sayfasındadır.',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'Hiçbir özellik için reklamlara gerek yoktur: reklamlar engellendiğinde veya reddedildiğinde her şey aynı şekilde çalışır.',
  'Ads keep TranscribeVid free. Everything works without them.':
    'Reklamlar TranscribeVid’i ücretsiz tutar. Onlar olmadan da her şey çalışır.',
  Advertisement: 'Reklam',
  'All free tools': 'Tüm ücretsiz araçlar',
  'All free video and audio to text tools': 'Videoyu ve sesi metne çeviren tüm ücretsiz araçlar',
  'All tools': 'Tüm araçlar',
  'All your data was deleted': 'Tüm verileriniz silindi',
  'Allow the microphone in your browser, or choose a file instead.':
    'Tarayıcınızda mikrofona izin verin ya da bunun yerine bir dosya seçin.',
  'Already added': 'Zaten eklendi',
  'Already finished': 'Zaten tamamlandı',
  'Also delete the downloaded speech models?': 'İndirilen konuşma modelleri de silinsin mi?',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'Bir yükleme sürüyor. Daha fazla dosya eklemeden önce bitmesini bekleyin.',
  'Apply style only': 'Yalnızca stili uygula',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    'Stili uygula, sesi yeniden işlemeden kayıtlı tanıma sonucunu kullanır. Düzenlenen satırlar korunur.',
  'Audio works too.': 'Ses de olur.',
  'Automatic (IndicXlit when installed)': 'Otomatik (kuruluysa IndicXlit)',
  Back: 'Geri',
  'Basic phonetic spelling': 'Temel fonetik yazım',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'Hesap ve sizi tanımlayan bilgi tutmadığımız için genellikle hiçbir veriyi bir kişiyle ilişkilendiremeyiz. Hukukun kişisel verileriniz üzerinde size tanıdığı haklar (erişim, düzeltme, silme, kısıtlama, itiraz ve taşınabilirlik gibi) veya veri koruma otoritenize şikâyet etme hakkı için bizimle iletişime geçerek bu hakları kullanabilirsiniz:',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'Transkriptleriniz yalnızca bu tarayıcıda bulunduğu için, ayrılmadan önce ihtiyacınız olanı dışa aktarın. Silinen veriler geri alınamaz.',
  'Best accuracy': 'En yüksek doğruluk',
  'Best accuracy, slowest': 'En yüksek doğruluk, en yavaş',
  Breadcrumb: 'Gezinti yolu',
  'By file type': 'Dosya türüne göre',
  'By language': 'Dile göre',
  'By use': 'Kullanıma göre',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    '{brand} ({domain}) hizmetini kullanarak bu şartları kabul etmiş olursunuz. Kabul etmiyorsanız lütfen hizmeti kullanmayın. Hizmet **{name}** tarafından işletilmektedir; adres: {address}.',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'web sitesinin veya sayacının hız sınırlarını ya da güvenliğini aşmak veya aşmaya çalışmak, işleyişine ya da diğer ziyaretçilerin kullanımına müdahale etmek;',
  'Can I edit the transcript?': 'Transkripti düzenleyebilir miyim?',
  "Can't reach the server.": 'Sunucuya ulaşılamıyor.',
  Cancel: 'İptal',
  'Cancel "{title}"?': '“{title}” iptal edilsin mi?',
  'Cancel {title}': '{title} işlemini iptal et',
  'Cancellation requested': 'İptal istendi',
  Cancelled: 'İptal edildi',
  'Cancelling…': 'İptal ediliyor…',
  'Cannot reach the server': 'Sunucuya ulaşılamıyor',
  'Cannot reach the server.': 'Sunucuya ulaşılamıyor.',
  'Cannot reach the server. Check your connection and try again.':
    'Sunucuya ulaşılamıyor. Bağlantınızı kontrol edip yeniden deneyin.',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'Sunucuya ulaşılamıyor. Çalıştığından emin olun (npm run dev) ve yeniden deneyin.',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'Bir satırı değiştirin veya silin ya da arayıp değiştirin. Düzenlemeleriniz her indirmede yer alır.',
  'Changed in {n} lines.': '{n} satırda değiştirildi.',
  'Check Hinglish spelling': 'Hinglish yazımını kontrol edin',
  'Choose "Save as PDF" in the print dialog.':
    'Yazdırma penceresinde “PDF olarak kaydet” seçeneğini seçin.',
  'Choose a file': 'Dosya seç',
  'Choose a file first': 'Önce bir dosya seçin',
  'Choose a format': 'Bir biçim seçin',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'Cihazınıza ve ne kadar zamanınız olduğuna göre daha hızlı veya daha doğru modeller arasından seçin.',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'En hızlı, Standart, Yüksek doğruluk veya En yüksek doğruluk seçeneklerinden birini seçin: En hızlı en çabuk olandır, En yüksek doğruluk en az hata yapandır.',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'Konuşulan dili seçin ya da otomatik algılamada bırakın. Konuşmayı İngilizceye de çevirebilirsiniz.',
  'Chosen files': 'Seçilen dosyalar',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'Mikrofona yakın, net konuşma en iyi sonucu verir. Daha fazla seçenek altında **Sesi iyileştir** ve **Sessizlikleri ve müziği atla** varsayılan olarak açıktır: uğultuyu ve cızırtıyı süzer, modelin müzik veya uzun duraklamalar sırasında metin uydurmasını engeller; bu yüzden gürültülü kayıtlarda açık tutun. Altyazılar için **Kelime düzeyinde zamanlama** seçeneğini de açık tutun; böylece her satır tam olarak kelimelerle başlar ve biter.',
  Close: 'Kapat',
  'Close menu': 'Menüyü kapat',
  'Close: {title}': 'Kapat: {title}',
  'Common questions': 'Sık sorulan sorular',
  Contact: 'İletişim',
  'Converting…': 'Dönüştürülüyor…',
  Copied: 'Kopyalandı',
  'Copy text': 'Metni kopyala',
  'Copying…': 'Kopyalanıyor…',
  'Could not cancel the transcript.': 'Transkript iptal edilemedi.',
  'Could not change transcript style.': 'Transkript stili değiştirilemedi.',
  'Could not copy': 'Kopyalanamadı',
  'Could not delete the transcript.': 'Transkript silinemedi.',
  'Could not delete your data.': 'Verileriniz silinemedi.',
  'Could not load the text to copy.': 'Kopyalanacak metin yüklenemedi.',
  'Could not prepare the file. Please try again.': 'Dosya hazırlanamadı. Lütfen yeniden deneyin.',
  'Could not rename the transcript.': 'Transkriptin adı değiştirilemedi.',
  'Could not save the change.': 'Değişiklik kaydedilemedi.',
  'Could not start': 'Başlatılamadı',
  'Could not start.': 'Başlatılamadı.',
  Dark: 'Koyu',
  Delete: 'Sil',
  'Delete "{title}" and its transcript?': '“{title}” ve transkripti silinsin mi?',
  'Delete "{title}"? This cannot be undone.': '“{title}” silinsin mi? Bu işlem geri alınamaz.',
  'Delete {title}': '{title} öğesini sil',
  'Delete all your transcripts and the files kept in this browser now?':
    'Tüm transkriptleriniz ve bu tarayıcıda tutulan dosyalar şimdi silinsin mi?',
  'Delete all your transcripts and uploaded files now?':
    'Tüm transkriptleriniz ve yüklenen dosyalar şimdi silinsin mi?',
  'Delete line': 'Satırı sil',
  'Delete my data now': 'Verilerimi şimdi sil',
  'Delete this line from the transcript?': 'Bu satır transkriptten silinsin mi?',
  'Delete transcript': 'Transkripti sil',
  Deleted: 'Silindi',
  'Detect automatically': 'Otomatik algıla',
  'Dismiss message': 'Mesajı kapat',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3 yalnızca İngilizce konuşmayı anlar. Çeviri için başka bir model seçin.',
  Done: 'Bitti',
  'Download failed': 'İndirme başarısız oldu',
  'Download started': 'İndirme başladı',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'Sonucu düz metin, SRT veya VTT altyazı, Markdown ya da JSON olarak indirin.',
  'Download the transcript as': 'Transkripti şu biçimde indir',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'Konuşma modeli indiriliyor (yalnızca ilk seferde): {loaded} / {total}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    '[Ana sayfaya](/) bir video veya ses dosyası bırakın ya da mikrofonunuzdan kaydedin.',
  'Drop to add your file': 'Dosyanızı eklemek için bırakın',
  'Drop your {noun} here, or choose a file': '{noun} buraya bırakın veya bir dosya seçin',
  'Each line with its time, like [00:12]': 'Her satır kendi zamanıyla, örneğin [00:12]',
  Edit: 'Düzenle',
  'Edit it right here': 'Tam burada düzenleyin',
  'Edit this line': 'Bu satırı düzenle',
  'Edited by you': 'Sizin düzenlediğiniz',
  'English only, very fast and accurate': 'Yalnızca İngilizce, çok hızlı ve doğru',
  'English translation is selected in More options.':
    'Daha fazla seçenek bölümünde İngilizce çeviri seçili.',
  'Enter saves · Esc cancels': 'Enter kaydeder · Esc iptal eder',
  'Every line has a time. Play the media from any line to hear what was said.':
    'Her satırın bir zamanı vardır. Ne söylendiğini duymak için medyayı herhangi bir satırdan oynatın.',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'Her sayfa aynı işi yapar: bir video veya ses dosyasındaki konuşmayı, kayıt gerektirmeden, 50’den fazla dilde, her satırda zaman damgası olan metne dönüştürür. Elinizdeki dosyaya ya da yapmak istediğiniz şeye uyan sayfayı seçin.',
  'Experimental: compare on your audio; chunk timestamps':
    'Deneysel: kendi sesinizde karşılaştırın; parça zaman damgaları',
  'Experimental: larger model; chunk timestamps':
    'Deneysel: daha büyük model; parça zaman damgaları',
  Export: 'Dışa aktar',
  Failed: 'Başarısız',
  FAQ: 'SSS',
  Fast: 'Hızlı',
  'Fast, clean audio': 'Hızlı, temiz ses',
  Fastest: 'En hızlı',
  'Fastest, rough drafts only': 'En hızlı, yalnızca kaba taslaklar için',
  'Fewer mistakes. Takes longer.': 'Daha az hata. Daha uzun sürer.',
  'Fewest mistakes. Takes the longest.': 'En az hata. En uzun sürer.',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    '“{name}” dosyası {size} boyutunda; sınır {limit} - artırmak için VT_MAX_UPLOAD_MB ayarını yapın',
  'File "{name}" is {size}; the limit is {limit}.':
    '“{name}” dosyası {size} boyutunda; sınır {limit}.',
  'file {n} of {total}': 'dosya {n} / {total}',
  'File added': 'Dosya eklendi',
  'File limits.': 'Dosya sınırları.',
  'File not added': 'Dosya eklenmedi',
  'File skipped': 'Dosya atlandı',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'Dosyalar ve transkriptler yalnızca oturumunuz boyunca vardır. Ayrılmadan önce ihtiyacınız olanı dışa aktarın. Tuttuğumuz tek şey, sitede kaç dosyanın yazıya döküldüğünün anonim bir toplam sayısıdır (tek bir sayı, sayfa başlığında gösterilir); sizinle, dosyalarınızla veya oturumunuzla ilişkilendirilmez. Ayrıntılar [Gizlilik politikası](/privacy) sayfasındadır.',
  'Find it automatically': 'Otomatik algılansın',
  'first time only, also downloads the {size} MB word-timing model':
    'yalnızca ilk seferde, ayrıca {size} MB’lık kelime zamanlama modelini de indirir',
  'First time only: downloads {size} (needs internet)':
    'Yalnızca ilk seferde: {size} indirir (internet gerekir)',
  'Follow playback': 'Oynatmayı takip et',
  'Following playback': 'Oynatma takip ediliyor',
  Footer: 'Alt bilgi',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'Aksanlı veya karışık dilli konuşmalar için daha yüksek bir kalite ayarı deneyin. Güven puanı bir doğruluk yüzdesi değildir.',
  'For developers: words, times, confidence': 'Geliştiriciler için: kelimeler, zamanlar, güven',
  'For notes apps': 'Not uygulamaları için',
  'For video players and editors': 'Video oynatıcılar ve düzenleyiciler için',
  'For YouTube and web video': 'YouTube ve web videosu için',
  Free: 'Ücretsiz',
  'Free tools': 'Ücretsiz araçlar',
  'Free tools:': 'Ücretsiz araçlar:',
  'Free video and audio to text': 'Ücretsiz video ve sesten metne',
  'Free video and audio to text, right in your browser':
    'Ücretsiz video ve sesten metne, doğrudan tarayıcınızda',
  'Free, unlimited, and no login needed': 'Ücretsiz, sınırsız ve giriş gerekmez',
  'Free, unlimited, no login': 'Ücretsiz, sınırsız, giriş yok',
  'Frequently asked questions': 'Sık sorulan sorular',
  'Get in touch': 'Bize ulaşın',
  'Getting the speech engine ready…': 'Konuşma motoru hazırlanıyor…',
  'Give it a new name': 'Yeni bir ad verin',
  'Go to the home page': 'Ana sayfaya git',
  'Go to Video to text': 'Videodan metne sayfasına git',
  'Good balance (default)': 'İyi denge (varsayılan)',
  'Good for most videos. Not sure? Keep this one.':
    'Çoğu video için iyidir. Emin değil misiniz? Bunu seçili bırakın.',
  'Good to know': 'Bilmekte fayda var',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'Google’ın onay aracı yüklenemedi; büyük olasılıkla bir reklam engelleyici veya ağ onu durdurdu. Onsuz hiçbir reklam ve reklam çerezi yüklenmez.',
  Guides: 'Rehberler',
  'Guides: transcripts and subtitles': 'Rehberler: transkriptler ve altyazılar',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'Bir sorunuz mu var, bir hata mı buldunuz ya da bir özellik mi önermek istiyorsunuz? {email} adresine yazın. Her mesaj, {brand} uygulamasını geliştiren kişi tarafından okunur ve genellikle birkaç iş günü içinde yanıt alırsınız.',
  'Helps spell uncommon words correctly.':
    'Alışılmadık kelimelerin doğru yazılmasına yardımcı olur.',
  'High accuracy': 'Yüksek doğruluk',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    'Yüksek doğruluk (Large v3 Turbo) çeviri için eğitilmemiştir ve size özgün dili verebilir. Çeviri için Standart veya En yüksek doğruluk seçin.',
  'High accuracy, slower': 'Yüksek doğruluk, daha yavaş',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    'Daha yüksek değer biraz daha doğru ve daha yavaştır. 5 iyi bir varsayılandır.',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'Hintçe, Latin harfleriyle yazılır; İngilizce kelimeler olduğu gibi korunur. Diğer diller özgün yazılarını korur. Tanıdık olmayan kelimeleri ve isimleri gözden geçirin.',
  'Hinglish (Roman Hindi)': 'Hinglish (Latin harfleriyle Hintçe)',
  'Hinglish conversion': 'Hinglish dönüştürme',
  History: 'Geçmiş',
  Home: 'Ana sayfa',
  'How {brand} works': '{brand} nasıl çalışır',
  'How accurate is it?': 'Ne kadar doğru?',
  'How do I get better accuracy?': 'Nasıl daha iyi doğruluk elde ederim?',
  'How it stays free': 'Nasıl ücretsiz kalır',
  'How it works': 'Nasıl çalışır',
  'How long does it take?': 'Ne kadar sürer?',
  'How to transcribe a video to text': 'Bir video metne nasıl çevrilir',
  'How to turn a video or audio file into text with {brand}':
    '{brand} ile bir video veya ses dosyası metne nasıl dönüştürülür',
  'If it does have speech, try More › Re-transcribe with the right language.':
    'Konuşma varsa Daha fazla › Yeniden yazıya dök seçeneğini doğru dille deneyin.',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'Hizmet meşgulse ya da çok fazla transkript zaten çalışıyorsa, beklemenizi ister ve nedenini söyler.',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'Bu politikayı değiştirirsek yeni sürüm, yeni bir “Son güncelleme” tarihiyle bu sayfada yer alır.',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'Avrupa Ekonomik Alanı’nda (AEA), Birleşik Krallık’ta, İsviçre’de ve bazı ABD eyaletlerinde, reklamlar yüklenirken Google’ın sertifikalı onay mesajı tercihinizi sorar.',
  'IndicXlit (trained model)': 'IndicXlit (eğitilmiş model)',
  'Is it really free and unlimited? Do I need to log in?':
    'Gerçekten ücretsiz ve sınırsız mı? Giriş yapmam gerekir mi?',
  'Is my data private?': 'Verilerim gizli mi?',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    'Seçtiğiniz kaliteye, dosyanın uzunluğuna ve hizmetin ne kadar meşgul olduğuna bağlıdır. En hızlı çabuktur; En yüksek doğruluk en uzun sürer ancak en az hatayı yapar. İlerleme ve kalan süre canlı gösterilir; sırasını bekleyen bir dosyada “Kuyrukta bekliyor” yazar.',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'Cihazınıza, seçtiğiniz kaliteye ve dosyanın uzunluğuna bağlıdır. Yetenekli bir grafik çipiyle (WebGPU) en hızlıdır; aksi hâlde işlemcide (WebAssembly) çalışır, bu daha yavaştır. En hızlı çabuktur; En yüksek doğruluk en uzun sürer ancak en az hatayı yapar. İlerleme ve kalan süre canlı gösterilir.',
  'It is now called “{title}”.': 'Artık adı “{title}”.',
  'It may have been deleted.': 'Silinmiş olabilir.',
  'It was stopped before any text was found.': 'Hiçbir metin bulunamadan durduruldu.',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'Verileri, bu transkript dahil, silindi. Transkriptler yalnızca onları oluşturan oturum boyunca saklanır.',
  'Job not found': 'İş bulunamadı',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'az önce',
  'Just the words, in paragraphs': 'Yalnızca kelimeler, paragraflar hâlinde',
  'Keep reading': 'Okumaya devam edin',
  'Keep this page open until the upload is done.': 'Yükleme bitene kadar bu sayfayı açık tutun.',
  'Kept only for this session, then deleted automatically.':
    'Yalnızca bu oturum için saklanır, sonra otomatik olarak silinir.',
  Language: 'Dil',
  'Larger or longer files are refused before they are processed, so split them first.':
    'Daha büyük veya daha uzun dosyalar işlenmeden önce reddedilir; bu yüzden önce bölün.',
  'Last updated: {date}': 'Son güncelleme: {date}',
  'Licence text': 'Lisans metni',
  Light: 'Açık',
  'Limits.': 'Sınırlar.',
  'Line deleted': 'Satır silindi',
  'Live: the text appears here as it is recognised': 'Canlı: metin tanındıkça burada görünür',
  'Loading model… (first use downloads it)': 'Model yükleniyor… (ilk kullanımda indirilir)',
  'Loading…': 'Yükleniyor…',
  'Long (56 letters)': 'Uzun (56 harf)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'Daha uzun yanıtlar: biçimler, altyazılar, doğruluk ve gizlilik.',
  Main: 'Ana menü',
  'Make a new transcript of the same file. This one is kept.':
    'Aynı dosyadan yeni bir transkript oluşturun. Bu transkript korunur.',
  'Make a subtitle file (SRT or VTT) from your video.':
    'Videonuzdan bir altyazı dosyası (SRT veya VTT) oluşturun.',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'Menü',
  Model: 'Model',
  More: 'Daha fazla',
  'More answers: [Frequently asked questions](/faq)':
    'Daha fazla yanıt: [Sık sorulan sorular](/faq)',
  'More free tools': 'Daha fazla ücretsiz araç',
  'More options': 'Daha fazla seçenek',
  'More than 50 languages': '50’den fazla dil',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    '50’den fazla dil: İngilizce, İspanyolca, Fransızca, Almanca, Portekizce, İtalyanca, Felemenkçe, Rusça, Arapça, Hintçe, Çince, Japonca ve Korece dahil. Dili otomatik algılamada bırakın ya da kendiniz seçin. Konuşmayı İngilizceye de çevirebilirsiniz.',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'Çoğu yazıya dökme sitesi, tek bir metin satırı görmeden önce hesap oluşturmanızı ister, ücretsiz dakikaları sınırlar, filigran ekler veya abonelik dayatır. {brand} bunun tam tersini yapar. Sunduğu her şey herkese açıktır ve sayfa dosyanızdan başka hiçbir şey istemez.',
  'Name not changed': 'Ad değiştirilmedi',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    'Seste geçen isimler, markalar ve terimler, örn. Kubernetes, Dr. Okafor',
  'Near-best accuracy, much faster than Large':
    'Neredeyse en iyi doğruluk, Large’tan çok daha hızlı',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'grafik sürücüsünde 16 bit gölgelendirici desteği (shader-f16) gerekir',
  'needs 4 GB': '4 GB gerekir',
  'needs 8 GB': '8 GB gerekir',
  'needs a graphics-capable browser (Chrome, Edge)':
    'grafik destekli bir tarayıcı gerekir (Chrome, Edge)',
  'needs WebGPU': 'WebGPU gerekir',
  'Next match': 'Sonraki eşleşme',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'Hesap yok, izleme yok. Dosyalarınız yalnızca oturumunuz boyunca saklanır ve otomatik olarak silinir.',
  'no estimate for this model here': 'bu model için burada tahmin yok',
  'No login': 'Giriş yok',
  'No matches': 'Eşleşme yok',
  'No microphone': 'Mikrofon yok',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'Kayıt yok, ödeme yok, günlük sınır yok. Yalnızca dosyanızı ekleyin.',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'Sunucu şu anda bir boyut veya uzunluk sınırı duyurmuyor. Çok büyük dosyalar yalnızca daha uzun sürer.',
  'No speech was found in this file.': 'Bu dosyada konuşma bulunamadı.',
  'No speech was transcribed.': 'Hiç konuşma yazıya dökülmedi.',
  'No speech was transcribed. Check the recording and the selected language.':
    'Hiç konuşma yazıya dökülmedi. Kaydı ve seçilen dili kontrol edin.',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'Burada WebGPU yok: modeller tek bir işlemci iş parçacığında çalışır; bu yüzden daha büyük boyutlar gerçek zamandan yavaştır.',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'Sizin dosyalarınızdan önce kimsenin dosyası yok. Birkaç dosya eklerseniz sekmenizde birbiri ardına yazıya dökülür; bu yüzden bitene kadar sekmeyi açık tutun.',
  'None of those are video or audio files.': 'Bunların hiçbiri video veya ses dosyası değil.',
  Normal: 'Normal',
  'not available for this size': 'bu boyut için kullanılamaz',
  'not available in this browser': 'bu tarayıcıda kullanılamaz',
  'not available with Qwen (times are per chunk)':
    'Qwen ile kullanılamaz (zamanlar parça başınadır)',
  'Not cancelled': 'İptal edilmedi',
  'Not deleted': 'Silinmedi',
  'Not renamed': 'Adı değiştirilmedi',
  'Not saved': 'Kaydedilmedi',
  Note: 'Not',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'Henüz burada bir şey yok. Oluşturduğunuz transkriptler bu oturum için burada görünür.',
  'Nothing is saved. Export what you need.':
    'Hiçbir şey kaydedilmez. İhtiyacınız olanı dışa aktarın.',
  'Nothing is uploaded until you press Transcribe.':
    'Yazıya dök düğmesine basana kadar hiçbir şey yüklenmez.',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'Kaydolacak bir şey yok, ödenecek bir şey yok. Yalnızca dosyanızı ekleyin.',
  'Nothing was recorded.': 'Hiçbir şey kaydedilmedi.',
  Off: 'Kapalı',
  On: 'Açık',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'Desteklenen bir dilde net konuşmada genellikle çok doğrudur, ancak hiçbir konuşma tanıma kusursuz değildir. Doğruluk; ses kalitesine, aksanlara, arka plan gürültüsüne, üst üste konuşan kişilere, müziğe ve nadir isimlere ya da terimlere bağlıdır. Her satırın bir güven puanı vardır ve düşük güvenli satırlar önce kontrol edebilmeniz için işaretlenir. Önemli bir şey için güvenmeden önce bir transkripti her zaman doğrulayın.',
  'Open menu': 'Menüyü aç',
  'Opening your transcript…': 'Transkriptiniz açılıyor…',
  'or drop it anywhere on this page.': 'ya da bu sayfanın herhangi bir yerine bırakın.',
  'Original script': 'Özgün yazı',
  Output: 'Çıktı',
  'Page {page} of {pages}': 'Sayfa {page} / {pages}',
  'Page not found': 'Sayfa bulunamadı',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'Elinizdeki dosya için sayfalar: WAV, M4A, WebM ve MOV.',
  'PDF document (.pdf)': 'PDF belgesi (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'PDF’yi tarayıcınız oluşturur: yazdırma penceresinde “PDF olarak kaydet” seçeneğini seçin.',
  'Pick quality': 'Kalite seçin',
  'Plain text (.txt)': 'Düz metin (.txt)',
  'Play from here': 'Buradan oynat',
  'Playback speed': 'Oynatma hızı',
  'Please add one file at a time here. You can add more files on the next page.':
    'Lütfen burada her seferinde bir dosya ekleyin. Sonraki sayfada daha fazla dosya ekleyebilirsiniz.',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'Lütfen özel kayıtlar göndermeyin. {brand} dosyalarınızı kendi cihazınızda yazıya döker ve biz onları hiç almayız; bu yüzden size yardım etmek için onlara ihtiyacımız yok.',
  'Please note': 'Lütfen dikkat',
  Preparing: 'Hazırlanıyor',
  'Preparing audio…': 'Ses hazırlanıyor…',
  'Preparing the audio…': 'Ses hazırlanıyor…',
  'Preparing…': 'Hazırlanıyor…',
  'Press a question to read its answer.': 'Yanıtını okumak için bir soruya basın.',
  'Previous match': 'Önceki eşleşme',
  'Print to PDF': 'PDF olarak yazdır',
  Privacy: 'Gizlilik',
  'Privacy and cookie settings': 'Gizlilik ve çerez ayarları',
  'Privacy policy': 'Gizlilik politikası',
  'Privacy requests': 'Gizlilik talepleri',
  Private: 'Gizli',
  Progress: 'İlerleme',
  Quality: 'Kalite',
  'Questions about these terms:': 'Bu şartlarla ilgili sorular:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'Sorular, hata bildirimleri ve fikirler her zaman memnuniyetle karşılanır. {email} adresine yazın ya da nelerin ekleneceği için [İletişim](/contact) sayfasına bakın.',
  Queued: 'Kuyrukta',
  'Quick results. Good for clear speech.': 'Hızlı sonuç. Net konuşma için iyidir.',
  Quickest: 'En çabuk',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'Qwen yaklaşık parça zaman damgaları kullanır. Kelime zamanlaması ve güven kullanılamaz.',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'Qwen parça zaman damgaları kullanır ve kelime güveni sağlamaz. Seçmeden önce kısa bir örneği karşılaştırın.',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (deneysel)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASR, WebGPU’lu (Chrome veya Edge) bir masaüstü tarayıcı ve grafik sürücüsünde 16 bit gölgelendirici desteği (shader-f16) gerektirir.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASR, WebGPU’lu (Chrome veya Edge) bir masaüstü tarayıcı ve 8 GB bellek gerektirir.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASR, WebGPU’lu (Chrome veya Edge) bir masaüstü tarayıcı gerektirir.',
  'Re-transcribe': 'Yeniden yazıya dök',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'Transkripti zaman damgalarıyla okuyun, modelin emin olmadığı kelimeleri görün ve bunları yerinde düzeltin.',
  'Read, edit, download': 'Oku, düzenle, indir',
  Ready: 'Hazır',
  'Ready to print or share': 'Yazdırmaya veya paylaşmaya hazır',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    'Denemeye hazır mısınız? [Tüm ücretsiz araçlara bakın](/tools) ya da [hemen bir dosyayı yazıya dökün](/).',
  'Recognition engine': 'Tanıma motoru',
  Recommended: 'Önerilen',
  'Record from microphone': 'Mikrofondan kaydet',
  'Record straight from your microphone and turn it into text.':
    'Doğrudan mikrofonunuzdan kaydedin ve metne dönüştürün.',
  'Record with your microphone': 'Mikrofonla kaydet',
  'Recording {stamp}': 'Kayıt {stamp}',
  'Recording is not supported by this browser.': 'Bu tarayıcı kaydı desteklemiyor.',
  'Related reading': 'İlgili okumalar',
  Remove: 'Kaldır',
  'Remove {name}': '{name} dosyasını kaldır',
  'Removes it for good': 'Kalıcı olarak kaldırır',
  Rename: 'Yeniden adlandır',
  Renamed: 'Yeniden adlandırıldı',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    '{n} satırda “{query}” ifadesi “{replacement}” ile değiştirilsin mi?',
  'Replace "{query}" with "{replacement}" in 1 line?':
    '1 satırda “{query}” ifadesi “{replacement}” ile değiştirilsin mi?',
  'Replace in {n} lines': '{n} satırda değiştir',
  'Replace in 1 line': '1 satırda değiştir',
  'Replace with': 'Şununla değiştir',
  'Replace with…': 'Şununla değiştir…',
  'Replace…': 'Değiştir…',
  Replaced: 'Değiştirildi',
  'Reporting a problem': 'Sorun bildirme',
  'Retrying…': 'Yeniden deneniyor…',
  'Review language and quality': 'Dili ve kaliteyi gözden geçirin',
  'Review this transcript': 'Bu transkripti gözden geçirin',
  Save: 'Kaydet',
  Saved: 'Kaydedildi',
  'Saving…': 'Kaydediliyor…',
  'Search depth: {n}': 'Arama derinliği: {n}',
  'Search the text': 'Metinde ara',
  'Search the transcript': 'Transkriptte ara',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'Ayrıca [Kullanım şartları](/terms), [Nasıl çalışır](/how-it-works) ve [SSS](/faq) sayfalarına bakın.',
  'Server busy': 'Sunucu meşgul',
  'Session only — nothing is saved.': 'Yalnızca oturum — hiçbir şey kaydedilmez.',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'Yalnızca oturum — hiçbir şey kaydedilmez. Uygulamayı kapatmak tüm transkriptleri siler. İhtiyacınız olanı dışa aktarın.',
  'Session time left: about {n} min': 'Kalan oturum süresi: yaklaşık {n} dk',
  'Short (32 letters)': 'Kısa (32 harf)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'Konuşmayı metne ve altyazıya dönüştürmeye dair kısa, pratik yanıtlar: hangi altyazı biçimini seçmeli, bir videoya altyazı nasıl eklenir, daha doğru bir transkript nasıl elde edilir ve yazıya dökme, dosyanızı yüklemeden kendi tarayıcınızda nasıl çalışabilir.',
  'Show all {count} languages': '{count} dilin tümünü göster',
  'Six ways to download': 'Altı indirme yolu',
  'Skip to main content': 'Ana içeriğe geç',
  Slower: 'Daha yavaş',
  'slower than real time on the measured laptop':
    'ölçülen dizüstü bilgisayarda gerçek zamandan yavaş',
  Slowest: 'En yavaş',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'Bazı özellikler, kullandığınızda tarayıcınıza açık kaynak bileşenler indirir. Motorun geri kalanı gibi cihazınızda çalışırlar. Lisansları bu bildirimleri göstermemizi ister:',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    'Bazı bölümler, tekrarlanan metin veya belirsiz bir konuşma sınırı yüzünden dinleyerek kontrol gerektirir.',
  'Something went wrong': 'Bir şeyler ters gitti',
  'Something went wrong in this browser. Please try again.':
    'Bu tarayıcıda bir şeyler ters gitti. Lütfen yeniden deneyin.',
  'Something went wrong while reading this file.': 'Bu dosya okunurken bir şeyler ters gitti.',
  'Source code': 'Kaynak kodu',
  Speed: 'Hız',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'Telefonlardaki ve tabletlerdeki hızlar ölçülmemiş, tahmin edilmiştir; tiny ve base güvenli boyutlardır.',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'Altyazı için SRT ve VTT, okumak için TXT ve Markdown, programlar için JSON ya da yazdırmak için PDF.',
  Standard: 'Standart',
  'Standard (42 letters)': 'Standart (42 harf)',
  Start: 'Başlat',
  'Start a new transcription': 'Yeni bir yazıya dökme başlat',
  'Start again': 'Yeniden başlat',
  'Started again': 'Yeniden başlatıldı',
  'Starting…': 'Başlatılıyor…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'Hâlâ bir sorunuz mu var? [Sık sorulan soruları](/faq) okuyun, [nasıl çalıştığına](/how-it-works) bakın ya da [bize ulaşın](/contact).',
  'Still stuck? [Read How it works](/how-it-works)':
    'Hâlâ takıldınız mı? [Nasıl çalışır sayfasını okuyun](/how-it-works)',
  'Stop recording · {time}': 'Kaydı durdur · {time}',
  'Stop this transcription? The text found so far is kept.':
    'Bu yazıya dökme durdurulsun mu? Şimdiye kadar bulunan metin korunur.',
  'Stopping the transcription worker. The text found so far is kept.':
    'Yazıya dökme işlemi durduruluyor. Şimdiye kadar bulunan metin korunur.',
  'Stored on this device only, never uploaded.': 'Yalnızca bu cihazda saklanır, hiç yüklenmez.',
  'Style unchanged': 'Stil değişmedi',
  'Style updated': 'Stil güncellendi',
  'Style updated using the saved recognition. Edited lines are kept.':
    'Stil, kayıtlı tanıma sonucu kullanılarak güncellendi. Düzenlenen satırlar korunur.',
  'Subtitle files': 'Altyazı dosyaları',
  'Subtitle line length': 'Altyazı satır uzunluğu',
  'Subtitles (.srt)': 'Altyazı (.srt)',
  'Switch to dark theme': 'Koyu temaya geç',
  'Switch to light theme': 'Açık temaya geç',
  Terms: 'Şartlar',
  'Terms of use': 'Kullanım şartları',
  'Text with times (.txt)': 'Zamanlı metin (.txt)',
  'That file is already in the list.': 'Bu dosya zaten listede.',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'Bu bir video veya ses dosyası değil. MP4, MOV, MP3 ya da başka bir video veya ses dosyası seçin.',
  'That is not a video or audio file. Please choose a video or audio file.':
    'Bu bir video veya ses dosyası değil. Lütfen bir video veya ses dosyası seçin.',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'Bu bir ses dosyası değil. MP3, WAV, M4A ya da başka bir ses dosyası seçin.',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    '[Gizlilik politikası](/privacy), nelerin neden işlendiğini açıklar. Verilerinizle ilgili bir soru sormak veya haklarınızı kullanmak için aynı adrese yazın.',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    '{label} modeli bu cihazda çalışamaz: {reason}. Başka bir tane seçin.',
  'the exact error message, or a screenshot of it.':
    'tam hata mesajı veya bunun bir ekran görüntüsü.',
  'The file is larger than the server accepts.': 'Dosya, sunucunun kabul ettiğinden büyük.',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'Bir kalite düzeyini ilk kullandığınızda tarayıcınız konuşma modelini bir kez indirir ve bir sonraki sefer için saklar; böylece sonraki dosyalar daha çabuk başlar.',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'Bir kalite düzeyini ilk kullandığınızda tarayıcınız konuşma modelini Hugging Face’ten, motorun program dosyalarını jsDelivr’den indirir ve bir sonraki sefer için saklar; bunlarla birlikte dosyanızdan hiçbir şey gönderilmez. Bir yazıya dökme bittiğinde tarayıcınız sayfa başlığındaki anonim sayaca bir ekler, başka hiçbir şey yapmaz.',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'Grafik sürücüsünde 16 bit gölgelendirici yok: indirmeler daha büyük, bellek kullanımı daha yüksek.',
  'The line was removed.': 'Satır kaldırıldı.',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'Ana araçlar: herhangi bir video veya ses dosyasını zaman damgalı bir transkripte dönüştürün.',
  'The page you are looking for does not exist or has moved.':
    'Aradığınız sayfa mevcut değil veya taşınmış.',
  'The recording failed. Please try again.': 'Kayıt başarısız oldu. Lütfen yeniden deneyin.',
  'The server does not have enough free disk space for this file.':
    'Sunucuda bu dosya için yeterli boş disk alanı yok.',
  'The server is busy': 'Sunucu meşgul',
  'The server is busy right now.': 'Sunucu şu anda meşgul.',
  'The service is busy right now. Please wait a moment and try again.':
    'Hizmet şu anda meşgul. Lütfen biraz bekleyip yeniden deneyin.',
  'The service is full right now. Please try again in a little while.':
    'Hizmet şu anda dolu. Lütfen biraz sonra yeniden deneyin.',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    'Konuşma tanıma, OpenAI Whisper gibi açık konuşma tanıma modelleri kullanılarak kendi tarayıcınızın içinde çalışır. Tarayıcınız modeli bir kez indirir ve saklar, sonra tüm işi cihazınızda yapar. Videonuz veya sesiniz bize hiç yüklenmez; dosya boyutu sınırının ve başkalarının dosyalarından oluşan bir kuyruğun olmamasının nedeni de budur. [Nasıl çalışır](/how-it-works) sayfası her adımı açıklar.',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'Konuşulan dil güvenle belirlenemedi. Duyduğunuz dili seçin ve yeniden deneyin.',
  'The text found before it was stopped is shown below.':
    'Durdurulmadan önce bulunan metin aşağıda gösterilir.',
  'The text found so far is kept.': 'Şimdiye kadar bulunan metin korunur.',
  'The text is ready to paste.': 'Metin yapıştırılmaya hazır.',
  'The transcript finished before it could be cancelled.':
    'Transkript iptal edilemeden önce tamamlandı.',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'Yazıya dökme, OpenAI Whisper gibi açık konuşma tanıma modelleriyle kendi cihazınızda çalışır. Tarayıcınız bir modeli bir kez indirir ve saklar; böylece sonraki dosya daha çabuk başlar ve videonuz veya sesiniz hiçbir yere yüklenmez.',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'dosyanın türü ve uzunluğu, örneğin “MP4, 25 dakika”;',
  'There is no size or length limit set here.':
    'Burada belirlenmiş bir boyut veya uzunluk sınırı yok.',
  'These details make a problem much quicker to find and fix:':
    'Bu ayrıntılar bir sorunu bulmayı ve düzeltmeyi çok daha hızlı hâle getirir:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    'Bu şartlar Hindistan hukukuna tabidir. Bunlardan doğan her uyuşmazlıkta Bengaluru (Karnataka, Hindistan) mahkemeleri münhasır yetkilidir. Bu, yaşadığınız ülkenin emredici tüketici kanunları uyarınca sahip olduğunuz hiçbir korumayı ortadan kaldırmaz.',
  'They are downloaded again the next time you transcribe.':
    'Bir sonraki yazıya dökme sırasında yeniden indirilirler.',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'Google dahil üçüncü taraf sağlayıcılar, bu web sitesine veya diğer web sitelerine daha önce yaptığınız ziyaretlere göre reklam sunmak için çerezler kullanır. Google’ın reklam çerezlerini kullanması, kendisinin ve ortaklarının bu siteyi ve/veya internetteki diğer siteleri ziyaretinize göre size reklam sunmasını sağlar.',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'Bu kutu MP3, WAV veya M4A gibi ses dosyalarını kabul eder, ancak bu bir video.',
  'This browser cannot record. Please choose a file instead.':
    'Bu tarayıcı kayıt yapamıyor. Lütfen bunun yerine bir dosya seçin.',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'Bu tarayıcı bellek bilgisi vermiyor; {gb} GB varsayıldı. Sayfa yavaşlarsa daha küçük bir model seçin.',
  'This cannot be undone. Export anything you want to keep first.':
    'Bu işlem geri alınamaz. Önce saklamak istediğiniz her şeyi dışa aktarın.',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '{brand} uygulamasının bu kopyası kendi bilgisayarınızda çalışır. Dosyalarınız bu makinede işlenir ve hiçbir şey makineden çıkmaz. Hiçbir şey kalıcı olarak kaydedilmez: transkriptler yalnızca bu oturum için vardır; bu yüzden ihtiyacınız olanı dışa aktarın. [Gizlilik politikası](/privacy), barındırılan web sitesini açıklar.',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'Bu kopya kendi bilgisayarınızda çalışır. Dosyalarınız bu makinede işlenir ve hiçbir şey makineden çıkmaz.',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'Bu cihazın bu kadar uzun bir dosya için belleği az. Küçük parçalar hâlinde işlenir, bu da daha yavaştır; daha kısa bir kesit veya daha küçük bir model daha güvenlidir.',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'Bu dosya, tarayıcınızda çalışan 9 MB’lık bir dönüştürücü gerektirir. Yüklensin mi?',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'Bu, kolaylık için yapılmış bir çeviridir. İngilizce sürümden farklıysa İngilizce sürüm geçerlidir.',
  'This local copy does not count transcriptions': 'Bu yerel kopya yazıya dökmeleri saymaz',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'Bu transkriptin model güveni düşük. Metni kullanmadan önce kaydı dinleyin ve konuşulan dili kontrol edin.',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'Bu işlem bu cihazda {wait} sürecek (tahmini). Bitene kadar sekmeyi açık tutun.',
  Timestamps: 'Zaman damgaları',
  'Tips for the best results': 'En iyi sonuçlar için ipuçları',
  'Tips for the best transcript': 'En iyi transkript için ipuçları',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'Reklam tercihlerinizi değiştirmek için [Google Reklam Ayarları](https://adssettings.google.com) veya tarayıcınızın çerez ayarlarını kullanın.',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'Reklam tercihlerinizi değiştirmek için reklam gösteren bir sayfanın altındaki **Gizlilik ve çerez ayarları** bağlantısını, [Google Reklam Ayarları](https://adssettings.google.com) sayfasını veya tarayıcınızın çerez ayarlarını kullanın.',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'Size istediğiniz yazıya dökmeyi kendi cihazınızda sağlamak, web sitesini güvenli biçimde sunmak ve hizmeti reklamlar yoluyla ücretsiz tutmak için. GDPR gibi bir veri koruma hukukunun uygulandığı yerlerde hukuki dayanaklarımız şunlardır: talep ettiğiniz hizmeti sunmak (md. 6(1)(b)), güvenlik, kötüye kullanımı önleme ve anonim toplam sayı konusundaki meşru menfaatimiz (md. 6(1)(f)) ve hukukun gerektirdiği yerlerde reklam çerezleri için Google’ın onay mesajının sorduğu rızanız (md. 6(1)(a)).',
  'To keep it fast for everyone, each file has a size and length limit.':
    'Herkes için hızlı kalması adına her dosyanın bir boyut ve uzunluk sınırı vardır.',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    'Hukukun izin verdiği ölçüde; dolaylı veya sonuç olarak ortaya çıkan zararlardan, veri, kâr veya iş kaybından ya da hizmeti kullanmanızdan veya kullanamamanızdan ya da bir transkriptteki hatalardan kaynaklanan herhangi bir kayıptan sorumlu değiliz. Bu şartlardaki hiçbir şey, hukuken sınırlanamayacak sorumluluğu sınırlamaz.',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'Cihazınızda yazıya dökmek için tarayıcınız konuşma modeli dosyalarını Hugging Face’ten (huggingface.co), konuşma motorunun program dosyalarını jsDelivr’den (cdn.jsdelivr.net) indirir ve siz silene kadar bir sonraki sefer için önbelleğinde (Cache Storage) tutar. Bu sağlayıcılar olağan istek verilerini (IP adresiniz, tarayıcınız ve hangi dosyanın istendiği) alır; medyanızı veya transkriptinizi asla almaz.',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'Cihazınızda çalışmak için tarayıcınız konuşma modellerini Hugging Face’ten, program dosyalarını jsDelivr’den indirir; bunlar kendi lisansları ve şartları altında sağlanır. Reklamları Google AdSense sağlar; bir reklam, kontrol etmediğimiz ve sorumlu olmadığımız üçüncü taraf bir web sitesine yönlendirir.',
  Transcribe: 'Yazıya dök',
  'Transcribe (same language)': 'Yazıya dök (aynı dil)',
  'Transcribe {n} files': '{n} dosyayı yazıya dök',
  'Transcribe a file': 'Bir dosyayı yazıya dök',
  'Transcribe or translate speech in the language you need.':
    'Konuşmayı ihtiyacınız olan dilde yazıya dökün veya çevirin.',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    'Videoları, ses dosyalarını ve ses kayıtlarını 50’den fazla dilde yazıya dökün ya da dilin sizin için algılanmasına izin verin.',
  'Transcribing {n}%': 'Yazıya dökülüyor %{n}',
  'Transcribing takes {time} on this device.': 'Yazıya dökme bu cihazda {time} sürer.',
  'Transcribing…': 'Yazıya dökülüyor…',
  Transcript: 'Transkript',
  'Transcript name': 'Transkript adı',
  'Transcript not found': 'Transkript bulunamadı',
  'Transcript ready': 'Transkript hazır',
  'Transcript style': 'Transkript stili',
  'Transcription failed': 'Yazıya dökme başarısız oldu',
  'Transcription has started. The text appears below as it is recognised.':
    'Yazıya dökme başladı. Metin tanındıkça aşağıda görünür.',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'Yazıya dökme başladı. Diğer dosyalarınız sayfanın üstündeki Transkriptler altında.',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    'Yazıya dökme cihazınızda çalışır ve işlemcisini, grafik çipini, belleğini ve pilini kullanır. Dosya boyutu veya uzunluk sınırı koymuyoruz; ancak ne kadar hızlı çalıştığı ve tarayıcınızın ne kadar büyük bir dosyayı işleyebileceği cihazınıza bağlıdır: daha yavaş bir telefon veya bilgisayardaki uzun bir dosya uzun sürebilir ya da belleği tüketebilir. Transkriptleriniz ve dosyalarınız bu tarayıcıda tutulur ve {idle} hareketsizlikten sonra otomatik olarak silinir. Bkz. [Gizlilik politikası](/privacy).',
  'Transcription settings': 'Yazıya dökme ayarları',
  Transcripts: 'Transkriptler',
  'Transcripts {n}': 'Transkriptler {n}',
  'Transcripts are only kept for the browser session that created them.':
    'Transkriptler yalnızca onları oluşturan tarayıcı oturumu boyunca saklanır.',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    'Transkriptler otomatik olarak üretilir ve özellikle gürültülü seste, güçlü aksanlarda, üst üste konuşan kişilerde, müzikte ve isimlerde ya da teknik terimlerde hatalar içerecektir. Özellikle hukuki, tıbbi, finansal veya yayımlanacak kullanımlarda, güvenmeden önce bir transkripti her zaman kontrol edin. Hizmet, doğruluk, eksiksizlik veya belirli bir amaca uygunluk dahil olmak üzere açık ya da zımni hiçbir garanti olmaksızın “olduğu gibi” ve “mevcut olduğu şekliyle” sunulur.',
  'Translate to English': 'İngilizceye çevir',
  'Try again': 'Yeniden dene',
  'Try another quality or language': 'Başka bir kalite veya dil deneyin',
  'try to spread malware or anything meant to damage the service.':
    'kötü amaçlı yazılım veya hizmete zarar vermek amacıyla hazırlanmış herhangi bir şeyi yaymaya çalışmak.',
  'Trying again in a moment…': 'Birazdan yeniden deneniyor…',
  'Trying again. This page loads by itself as soon as the server is back.':
    'Yeniden deneniyor. Sunucu geri geldiğinde bu sayfa kendiliğinden yüklenir.',
  'under a minute': 'bir dakikadan az',
  'Underline unsure words': 'Emin olunmayan kelimelerin altını çiz',
  Unlimited: 'Sınırsız',
  'Unsure: worth listening to again': 'Emin değil: yeniden dinlemeye değer',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'Olağandışı yoğun yükleme dalgalarında biraz beklemeniz istenebilir.',
  'Up to {minutes} per file.': 'Dosya başına en fazla {minutes}.',
  'Up to {size} and {minutes} minutes per file.':
    'Dosya başına en fazla {size} ve {minutes} dakika.',
  'Up to {size} and {minutes} per file.': 'Dosya başına en fazla {size} ve {minutes}.',
  'Up to {size} per file.': 'Dosya başına en fazla {size}.',
  'Updated {date}': 'Güncelleme: {date}',
  'Upload complete': 'Yükleme tamamlandı',
  'Upload failed': 'Yükleme başarısız oldu',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'Yükleme başarısız oldu (sunucu hatası {status}). Ayrıntılar için sunucuyu çalıştıran terminale bakın.',
  'Upload failed (server error {status}). Please try again in a moment.':
    'Yükleme başarısız oldu (sunucu hatası {status}). Lütfen birazdan yeniden deneyin.',
  Uploading: 'Yükleniyor',
  'Uploading…': 'Yükleniyor…',
  'use a computer for this size': 'bu boyut için bir bilgisayar kullanın',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'yazılı iznimiz olmadan web sitesine veya sayacına karşı betikler, botlar veya başka otomatik araçlar kullanmak ya da uydurma sayılar göndermek;',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'hizmeti yasa dışı olan veya bir başkasının haklarını ihlal eden içerikler üzerinde kullanmak;',
  'use the service to harass, harm or deceive others;':
    'hizmeti başkalarını taciz etmek, onlara zarar vermek veya onları aldatmak için kullanmak;',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'Net konuşmada genellikle çok doğrudur. Emin olmadığı satırlar işaretlenir; böylece önce onları kontrol edebilirsiniz.',
  'Video and audio to text': 'Video ve sesten metne',
  'Video or audio, several at once is fine.':
    'Video veya ses; birkaç dosyayı birden eklemek sorun değil.',
  'Video to text, accurately.': 'Videodan metne, doğru biçimde.',
  'Video to text: transcribe a video or audio file':
    'Videodan metne: bir video veya ses dosyasını yazıya dökün',
  'video transcribed': 'video yazıya döküldü',
  'videos transcribed': 'video yazıya döküldü',
  'Vocabulary hint': 'Kelime ipucu',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'Sesli notlar, toplantılar, dersler, podcast’ler ve röportajlar.',
  'Waiting for microphone permission…': 'Mikrofon izni bekleniyor…',
  'Waiting for the first words…': 'İlk kelimeler bekleniyor…',
  'Waiting in line…': 'Sırada bekleniyor…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'Metnin canlı olarak belirmesini izleyin, hataları düzeltin, sonra SRT, VTT, TXT, Markdown, JSON veya PDF olarak indirin.',
  'We do not ask for your name, e-mail address or any other account details.':
    'Adınızı, e-posta adresinizi veya başka hesap bilgilerinizi istemiyoruz.',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'Hizmetin her zaman kullanılabilir, kesintisiz veya hatasız olacağını vaat etmiyoruz. Web sitesi veya gereksindiği indirmeler (Hugging Face’teki konuşma modelleri ve jsDelivr’deki program dosyaları) bakım nedeniyle ya da denetimimiz dışındaki nedenlerle kullanılamayabilir ve bazı tarayıcılar veya cihazlar her modeli çalıştıramaz. Transkriptleriniz yalnızca bu tarayıcıda tutulduğu ve hareketsizlikten sonra silindiği için ihtiyacınız olanı her zaman dışa aktarın.',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'Verilerinizi satmıyoruz. Dosyalarınızdan ya da transkriptlerinizden hiçbirini tutmuyoruz; dolayısıyla paylaşacak bir şeyimiz yok: tanıma, harici bir yazıya dökme veya yapay zekâ hizmetinde değil, cihazınızda çalışır. Google (reklam), Cloudflare (barındırma ve sayaç), Hugging Face ve jsDelivr (indirmeler) yalnızca yukarıda anlatılanı alır. Hukuk gerektiriyorsa bilgi ifşa edebiliriz.',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    'Bizim tarafımızda size ait hiçbir şey tutmuyoruz: tek bir toplam sayı dışında, kullanımınızla ilgili hiçbir şey bizim tarafımızdan saklanmaz.',
  'We may block access if these rules are broken.':
    'Bu kurallar çiğnenirse erişimi engelleyebiliriz.',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'Bu şartları güncelleyebiliriz. Yeni sürüm, yeni bir “Son güncelleme” tarihiyle bu sayfada yer alır ve o andan itibaren geçerli olur.',
  'We never send your file, your transcript or any personal information to Google.':
    'Dosyanızı, transkriptinizi veya herhangi bir kişisel bilgiyi Google’a asla göndermeyiz.',
  'Web subtitles (.vtt)': 'Web altyazısı (.vtt)',
  'What people use it for': 'İnsanlar bunu ne için kullanıyor',
  'What you can do with it': 'Bununla neler yapabilirsiniz',
  'What you get': 'Ne elde edersiniz',
  'what you were doing, and what happened instead of what you expected;':
    'ne yapıyordunuz ve beklediğiniz yerine ne oldu;',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'Dosyalarınızın nerede işlendiği {brand} uygulamasının nasıl çalıştırıldığına bağlıdır ve sunucu az önce yanıt vermedi. Bkz. [Gizlilik politikası](/privacy).',
  'Where your files are processed depends on how {brand} is run.':
    'Dosyalarınızın nerede işlendiği {brand} uygulamasının nasıl çalıştırıldığına bağlıdır.',
  'Which files can I use, and what are the limits?':
    'Hangi dosyaları kullanabilirim ve sınırlar nelerdir?',
  'Which languages are supported?': 'Hangi diller destekleniyor?',
  'Who builds it': 'Kim geliştiriyor',
  'Who runs this website': 'Bu web sitesini kim işletiyor',
  'Why it exists': 'Neden var',
  'Working…': 'Çalışıyor…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'Evet. Ücretsizdir ve hiçbir zaman hesap veya giriş yoktur. Günlük ya da aylık kota ve ücretli duvar yoktur; reklamlar web sitesini ücretsiz tutar.',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'Evet. Ücretsizdir ve hiçbir zaman hesap veya giriş yoktur. Günlük ya da aylık kota ve ücretli duvar yoktur.',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'Evet. Ücretsizdir; kaydolacak bir şey ve giriş yoktur. Bu kopya kendi bilgisayarınızda çalışır; bu yüzden kota ve ücretli duvar yoktur; ne kadar hızlı çalıştığı bilgisayarınıza bağlıdır.',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'Evet. Bir satırın metnini değiştirmek veya satırı silmek için yanındaki kaleme basın ya da tüm transkriptte arayıp değiştirin. Düzenlemeleriniz her dışa aktarmaya dahil edilir.',
  'You agree not to:': 'Şunları yapmamayı kabul edersiniz:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'Kontrol sizde: transkriptlerinizi, dosyalarınızı ve isterseniz indirilen konuşma modellerini istediğiniz zaman **Verilerimi şimdi sil** ile silebilirsiniz. Yalnızca bu tarayıcıdaki verileri siler; Google’ın çerezlerini silemez.',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'Bunu istediğiniz zaman, reklam gösteren herhangi bir sayfanın (örneğin ana sayfanın) altındaki **Gizlilik ve çerez ayarları** ile değiştirebilirsiniz.',
  'You can now read, fix and download it.': 'Artık okuyabilir, düzeltebilir ve indirebilirsiniz.',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'Hizmeti kullanmayı istediğiniz zaman bırakabilir ve bu tarayıcıdaki verileri **Verilerimi şimdi sil** ile silebilirsiniz. Özellikle bu şartları ihlal ederseniz, erişiminizi istediğimiz zaman askıya alabilir veya sona erdirebiliriz.',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'Eklediğiniz dosyalardaki ve bunlardan üretilen transkriptlerdeki tüm haklar sizde kalır. Bunlar cihazınızda işlenir ve biz onları hiç almayız. Neyi yazıya döktüğünüzden siz sorumlusunuz: yalnızca sahibi olduğunuz veya işleme hakkına sahip olduğunuz içerikleri, içinde konuşan kişilerden gereken her izin dahil, kullanın.',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'Kişiselleştirilmiş reklamcılıktan [Google Reklam Ayarları](https://adssettings.google.com) sayfasını ziyaret ederek çıkabilir veya bazı üçüncü taraf sağlayıcıların kişiselleştirilmiş reklam için çerez kullanımından [www.aboutads.info](https://www.aboutads.info) adresinden çıkabilirsiniz. [Google’ın hizmetlerini kullanan sitelerden gelen bilgileri nasıl kullandığını](https://policies.google.com/technologies/partner-sites) öğrenin.',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'tarayıcınız ve sürümü ile cihazınız (bilgisayar veya telefon ve işletim sistemi);',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'Tarayıcınız burada kopyalamayı engelledi. Bunun yerine metni kaydetmek için Dışa aktar’ı kullanın.',
  'Your change is saved.': 'Değişiklik kaydedildi.',
  'Your change is still in its box: press Save to try again.':
    'Değişiklik hâlâ kutusunda: yeniden denemek için Kaydet düğmesine basın.',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'Dosyanız şifreli bir bağlantı üzerinden sunucuya gönderilir, OpenAI Whisper gibi açık konuşma tanıma modelleriyle yazıya dökülür ve sonrasında otomatik olarak silinir. [Nasıl çalışır](/how-it-works) sayfası her adımı açıklar.',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'Dosyanız kendi cihazınızdaki tarayıcınızda yazıya dökülür; bu yüzden boyut veya uzunluk sınırı koymuyoruz. Çok büyük veya uzun dosyalar da çalışır: daha uzun sürer ve yeterli boş bellek gerektirir; cihazınız yavaş olabilecekse sayfa sizi uyarır.',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'Dosyanız OpenAI Whisper gibi açık konuşma tanıma modelleriyle yazıya dökülür ve sonrasında otomatik olarak silinir.',
  'Your file never leaves your device.': 'Dosyanız cihazınızdan hiç ayrılmaz.',
  'Your file never leaves your device. [Privacy](/privacy)':
    'Dosyanız cihazınızdan hiç ayrılmaz. [Gizlilik](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'Dosyanız cihazınızdan hiç ayrılmaz. Bu cihazdaki tarayıcınızda yazıya dökülür ve ne bize ne de başkasına yüklenir. Transkriptler, düzenlemeleriniz ve dosya yalnızca bu tarayıcının depolamasında tutulur ve {idle} hareketsizlikten sonra otomatik olarak ya da Transkriptler menüsündeki **Verilerimi şimdi sil** düğmesine bastığınızda hemen silinir. Hesap yoktur. Ayrılmadan önce ihtiyacınız olanı dışa aktarın.',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'Dosyanız cihazınızdan hiç ayrılmaz. Doğrudan tarayıcınızda, hesap olmadan yazıya dökülür ve transkriptleriniz bu tarayıcıda kalır.',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'Dosyanız bu cihazda kalır. Yazıya dökülürken bu sekmeyi açık tutun.',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'Dosyalarınız ve transkriptleriniz yalnızca bu oturum için saklanır ve {idle} hareketsizlikten sonra ya da “Verilerimi şimdi sil” düğmesine bastığınızda otomatik olarak silinir. Hesap yok, izleme yok, tek bir gerekli oturum çerezi var. Ayrılmadan önce ihtiyacınız olanı dışa aktarın.',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'Dosyalarınız ve transkriptleriniz yalnızca bu oturum için saklanır ve oturum bittiğinde ya da “Verilerimi şimdi sil” düğmesine bastığınızda otomatik olarak silinir. Hesap yok, izleme yok, tek bir gerekli oturum çerezi var. Ayrılmadan önce ihtiyacınız olanı dışa aktarın.',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'Dosyalarınız otomatik olarak silinir. [Gizlilik](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'Dosyalarınız tarayıcınızda işlenir ve cihazınızda kalır. Web sitesi, indirmeler ve sayaç şifreli bağlantılar (HTTPS) kullanır. Bu tarayıcı profilini kullanabilen herkes, silinene kadar içinde depolanan transkriptleri görebilir; bu yüzden ortak bir bilgisayarda **Verilerimi şimdi sil** düğmesine basın.',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'Dosyalarınız orada işlenebilmesi için sunucumuza yüklenir. Yalnızca oturumunuz boyunca saklanır ve oturum bittiğinde, {idle} hareketsizlikten sonra ya da Transkriptler menüsündeki **Verilerimi şimdi sil** düğmesine bastığınızda hemen otomatik olarak silinir. Hesap ve izleme yoktur; tek çerez, gerekli bir oturum çerezidir (analitik veya reklam çerezi yok).',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'Dosyalarınız orada işlenebilmesi için sunucumuza yüklenir. Yalnızca oturumunuz boyunca saklanır ve oturum bittiğinde ya da Transkriptler menüsündeki **Verilerimi şimdi sil** düğmesine bastığınızda hemen otomatik olarak silinir. Hesap ve izleme yoktur; tek çerez, gerekli bir oturum çerezidir (analitik veya reklam çerezi yok).',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'Dosyalarınız bu cihazdan hiç ayrılmaz. Transkriptler yalnızca bu tarayıcıda tutulur ve {idle} hareketsizlikten sonra ya da “Verilerimi şimdi sil” düğmesine bastığınızda otomatik olarak silinir. Ayrılmadan önce ihtiyacınız olanı dışa aktarın.',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'Dosyalarınız bu cihazdan hiç ayrılmaz. Transkriptler yalnızca bu tarayıcıda tutulur ve oturum bittiğinde ya da “Verilerimi şimdi sil” düğmesine bastığınızda otomatik olarak silinir. Ayrılmadan önce ihtiyacınız olanı dışa aktarın.',
  'Your session ends in {mins} min. Export what you need.':
    'Oturumunuz {mins} dk içinde bitiyor. İhtiyacınız olanı dışa aktarın.',
  'Your session has ended': 'Oturumunuz sona erdi',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'Oturumunuz sona erdi ve verileri silindi. Yeni bir yazıya dökme başlatabilirsiniz.',
  'Your transcript is ready below.': 'Transkriptiniz aşağıda hazır.',
  'Your transcripts': 'Transkriptleriniz',
  'Your transcripts and files were removed from the server.':
    'Transkriptleriniz ve dosyalarınız sunucudan kaldırıldı.',
  'Your transcripts and files were removed from this device.':
    'Transkriptleriniz ve dosyalarınız bu cihazdan kaldırıldı.',
  'title:/': 'Ücretsiz Video ve Ses Yazıya Çevirme',
  'description:/':
    'Videoyu ve sesi ücretsiz metne çevirin. Giriş yok, günlük sınır yok, 50’den fazla dil. Zaman damgalı metin alın; SRT, VTT, TXT veya PDF olarak indirin.',
  'title:/how-it-works': 'Nasıl çalışır',
  'description:/how-it-works':
    'TranscribeVid’in videoyu ve sesi üç basit adımda doğru, zaman damgalı metne nasıl dönüştürdüğü, ne elde edeceğiniz ve en iyi sonuç için ipuçları.',
  'title:/faq': 'Sık sorulan sorular',
  'description:/faq':
    'TranscribeVid hakkında sık sorulan sorular: doğruluk, diller, desteklenen dosyalar ve sınırlar, hız, gizlilik ve düzenleme. Yazıya dökme yanıtları.',
  'title:/about': 'TranscribeVid hakkında',
  'description:/about':
    'TranscribeVid’i kimin geliştirdiği ve neden: kayıt ve giriş gerektirmeyen, temiz arayüzlü, reklamla finanse edilen ücretsiz yazıya çevirme aracı.',
  'title:/contact': 'İletişim',
  'description:/contact':
    'TranscribeVid’e nasıl ulaşılır: sorular, hata bildirimleri, özellik fikirleri ve gizlilik talepleri için e-posta ve web sitesini kimin işlettiği.',
  'title:/privacy': 'Gizlilik politikası',
  'description:/privacy':
    'Bir dosyayı yazıya dökerken TranscribeVid’in neleri nerede ve neden işlediği, ne kadar saklandığı, çerezler, reklamlar, tarayıcı depolaması ve haklarınız.',
  'title:/terms': 'Kullanım şartları',
  'description:/terms':
    'TranscribeVid’i kullanma kuralları: ücretsiz hizmet, içeriğiniz, kabul edilebilir kullanım, dosya sınırları, doğrulukta garanti olmaması, sorumluluk.',
  'title:/tools': 'Tüm ücretsiz araçlar',
  'description:/tools':
    'Tüm ücretsiz video ve sesten metne araçları tek listede: dosya türüne, kullanıma, altyazı dosyalarına ve dillere göre. Giriş yok, 50’den fazla dil.',
  'title:/guides': 'Rehberler',
  'description:/guides':
    'Transkript ve altyazı rehberleri: SRT mi VTT mi, videoya altyazı nasıl eklenir, doğru transkript nasıl elde edilir ve dosyanızı yüklemeden yazıya dökme.',
  'title:/video-to-text': 'Video Yazıya Çevirme: Ücretsiz, Girişsiz',
  'description:/video-to-text':
    'Videoyu ücretsiz yazıya çevirin. 50’den fazla dilde doğru, zaman damgalı transkript alın. Giriş yok, günlük sınır yok. SRT, VTT, TXT veya PDF indirin.',
  'label:/video-to-text': 'Video yazıya çevirme',
  'title:/audio-to-text': 'Ses Yazıya Çevirme: Ücretsiz, Sınırsız',
  'description:/audio-to-text':
    'Podcast’leri, röportajları ve dersleri metne dönüştürün. Zaman damgalı, 50’den fazla dilde, girişsiz ücretsiz ses yazıya çevirme. TXT, SRT, VTT veya PDF.',
  'label:/audio-to-text': 'Ses yazıya çevirme',
  'title:/mp4-to-text': 'MP4 Yazıya Çevirme: Videoyu Ücretsiz Çevir',
  'description:/mp4-to-text':
    'MP4 videoyu zaman damgalı metne çevirin. Ücretsiz, giriş yok, günlük sınır yok, 50’den fazla dil. TXT, SRT, VTT, Markdown, JSON veya PDF olarak indirin.',
  'label:/mp4-to-text': 'MP4 yazıya çevirme',
  'title:/mp3-to-text': 'MP3 Yazıya Çevirme: Ücretsiz Transkript',
  'description:/mp3-to-text':
    'MP3’ü çevrimiçi ücretsiz yazıya çevirin. Giriş yok, 50’den fazla dil, her satırda zaman damgası. Metni düzenleyin; TXT, SRT, VTT veya PDF indirin.',
  'label:/mp3-to-text': 'MP3 yazıya çevirme',
  'title:/srt-subtitle-generator': 'SRT Altyazı Oluşturucu: Videodan Ücretsiz',
  'description:/srt-subtitle-generator':
    'Herhangi bir videodan veya sesten ücretsiz SRT altyazı dosyası oluşturun. Konuşmaya göre zamanlanır, 50’den fazla dil, giriş yok. SRT veya VTT indirin.',
  'label:/srt-subtitle-generator': 'SRT altyazı oluşturucu',
  'title:/voice-recording-to-text': 'Ses Kaydını Yazıya Çevirme: Ücretsiz',
  'description:/voice-recording-to-text':
    'Sesinizi tarayıcıda kaydedin ya da bir sesli not yükleyin ve metin olarak alın. Ücretsiz, giriş yok, 50’den fazla dil. TXT, PDF, SRT veya Markdown indirin.',
  'label:/voice-recording-to-text': 'Ses kaydını yazıya dökme',
  'title:/wav-to-text': 'WAV Yazıya Çevirme: Çevrimiçi Ücretsiz',
  'description:/wav-to-text':
    'WAV dosyasını ücretsiz yazıya çevirin. Kaydedici ve görüşme kayıtlarındaki uzun kayıtları işler; 50’den fazla dil, zaman damgası, giriş yok.',
  'label:/wav-to-text': 'WAV yazıya çevirme',
  'title:/m4a-to-text': 'M4A Yazıya Çevirme: Sesli Notları Çevir',
  'description:/m4a-to-text':
    'M4A sesli notunu veya kaydını ücretsiz yazıya çevirin. iPhone Sesli Notlar ile çalışır; giriş yok, 50’den fazla dil, zaman damgası. TXT, SRT, VTT veya PDF.',
  'label:/m4a-to-text': 'M4A yazıya çevirme',
  'title:/webm-to-text': 'WebM Yazıya Çevirme: Ücretsiz, Girişsiz',
  'description:/webm-to-text':
    'WebM video veya ses dosyasını ücretsiz yazıya çevirin. Ekran ve tarayıcı kayıtlarıyla çalışır; 50’den fazla dil, zaman damgası. TXT, SRT veya PDF.',
  'label:/webm-to-text': 'WebM yazıya çevirme',
  'title:/mov-to-text': 'MOV Yazıya Çevirme: iPhone Videoları',
  'description:/mov-to-text':
    'iPhone veya QuickTime MOV videosunu ücretsiz yazıya çevirin. Giriş yok, 50’den fazla dil, her satırda zaman damgası. TXT, SRT, VTT veya PDF olarak indirin.',
  'label:/mov-to-text': 'MOV yazıya çevirme',
  'title:/whatsapp-voice-message-to-text': 'WhatsApp Ses Mesajını Yazıya Çevirme',
  'description:/whatsapp-voice-message-to-text':
    'WhatsApp ses mesajını ücretsiz metne çevirin. Ses notunu kaydedin, buraya bırakın ve Hintçe dahil 50’den fazla dilde okuyun. Giriş yok, hesap yok.',
  'label:/whatsapp-voice-message-to-text': 'WhatsApp ses mesajını yazıya çevirme',
  'title:/meeting-recording-to-text': 'Zoom, Teams ve Meet Kaydını Yazıya Çevir',
  'description:/meeting-recording-to-text':
    'Zoom, Teams veya Google Meet kaydını ücretsiz, aranabilir, zaman damgalı bir transkripte dönüştürün. Giriş yok, 50’den fazla dil. TXT, SRT, VTT veya PDF.',
  'label:/meeting-recording-to-text': 'Toplantı kaydını yazıya çevirme',
  'title:/lecture-to-text': 'Ders Kaydını Yazıya Çevirme: Ücretsiz',
  'description:/lecture-to-text':
    'Kaydedilmiş bir dersi aranabilir ve çalışılabilir metne dönüştürün. Ücretsiz, giriş yok, 50’den fazla dil, zaman damgası. TXT, Markdown, SRT veya PDF.',
  'label:/lecture-to-text': 'Ders kaydını yazıya çevirme',
  'title:/podcast-transcript-generator': 'Ücretsiz Podcast Transkript Oluşturucu',
  'description:/podcast-transcript-generator':
    'MP3 veya WAV’dan ücretsiz podcast transkripti oluşturun. Zaman damgası, 50’den fazla dil, giriş yok. Düzenleyin; TXT, Markdown, SRT, VTT veya PDF indirin.',
  'label:/podcast-transcript-generator': 'Podcast transkript oluşturucu',
  'title:/interview-transcription': 'Röportaj Yazıya Dökme: Gizli ve Ücretsiz',
  'description:/interview-transcription':
    'Röportajları hesap açmadan ücretsiz yazıya dökün. 50’den fazla dilde zaman damgalı metin; araştırma, gazetecilik ve işe alım için. TXT veya PDF indirin.',
  'label:/interview-transcription': 'Röportaj yazıya dökme',
  'title:/vtt-subtitle-generator': 'Ücretsiz VTT (WebVTT) Altyazı Oluşturucu',
  'description:/vtt-subtitle-generator':
    'Herhangi bir videodan veya sesten ücretsiz WebVTT (.vtt) altyazı dosyası oluşturun. Konuşmaya göre zamanlanır, 50’den fazla dil, giriş yok. VTT indirin.',
  'label:/vtt-subtitle-generator': 'VTT altyazı oluşturucu',
  'title:/youtube-subtitle-generator': 'YouTube Altyazı Oluşturucu: Ücretsiz SRT',
  'description:/youtube-subtitle-generator':
    'Kendi YouTube videonuz için giriş yapmadan ücretsiz SRT altyazı dosyası oluşturun. Konuşmaya göre zamanlanır, 50’den fazla dil. YouTube Studio’ya yükleyin.',
  'label:/youtube-subtitle-generator': 'YouTube altyazı oluşturucu',
  'title:/translate-audio-to-english': 'Konuşmayı İngilizce Metne Çevir, Ücretsiz',
  'description:/translate-audio-to-english':
    'Başka bir dildeki konuşmayı ücretsiz İngilizce metne çevirin. Video veya ses dosyası ekleyin, zaman damgalı İngilizce metin ya da altyazı alın. Giriş yok.',
  'label:/translate-audio-to-english': 'Konuşmayı İngilizceye çevirme',
  'title:/guides/srt-vs-vtt': 'SRT mi VTT mi? Hangi Altyazı Biçimi',
  'description:/guides/srt-vs-vtt':
    'SRT mi VTT mi? Her altyazı biçiminin ne olduğu, nasıl farklılaştığı, nerede çalıştığı ve videonuzdan ücretsiz nasıl elde edeceğiniz.',
  'label:/guides/srt-vs-vtt': 'SRT mi VTT mi',
  'title:/guides/how-to-add-subtitles-to-a-video': 'Videoya Altyazı Ekleme (Ücretsiz)',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'Altyazıyı dört adımda yapın: videoyu yazıya dökün, metni düzeltin, SRT veya VTT dışa aktarın, dosyayı YouTube’a, VLC’ye, editöre ya da oynatıcıya ekleyin.',
  'label:/guides/how-to-add-subtitles-to-a-video': 'Videoya altyazı nasıl eklenir',
  'title:/guides/transcribe-video-without-uploading': 'Videoyu Yüklemeden Yazıya Dökme',
  'description:/guides/transcribe-video-without-uploading':
    'Tarayıcıda yazıya dökmenin nasıl çalıştığı, cihazınızda neyin kaldığı, bir kez neyin indirildiği ve bunu ağ panelinde nasıl kontrol edeceğiniz.',
  'label:/guides/transcribe-video-without-uploading': 'Videoyu yüklemeden yazıya dökme',
  'title:/guides/accurate-transcripts': 'Daha Doğru Transkript Nasıl Elde Edilir',
  'description:/guides/accurate-transcripts':
    'Konuşmadan metne doğruluğunu artırmanın pratik yolları: daha temiz ses, doğru dil ve model, kelime ipucu ve sonucu kontrol edip düzeltme.',
  'label:/guides/accurate-transcripts': 'Daha doğru transkript nasıl elde edilir',
  'title:/guides/what-is-whisper': 'Whisper Nedir? Konuşmadan Metne',
  'description:/guides/what-is-whisper':
    'OpenAI Whisper’ın ne olduğu, neyle eğitildiği, ne kadar doğru olduğu ve nerede zorlandığı; TranscribeVid’de tarayıcınızda nasıl çalıştığı.',
  'label:/guides/what-is-whisper': 'Whisper nedir?',
  'an independent software developer': 'bağımsız bir yazılım geliştirici',
  'Bengaluru, India': 'Bengaluru, Hindistan',
};

export default dict;
