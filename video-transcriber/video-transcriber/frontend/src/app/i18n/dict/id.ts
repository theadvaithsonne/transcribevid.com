/** Indonesian dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
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
  '"{name}" is {size}; the limit is {limit}.':
    '"{name}" berukuran {size}; batasnya adalah {limit}.',
  '"{name}" is empty.': '"{name}" kosong.',
  '"{name}" is ready. Press Transcribe to start.':
    '"{name}" sudah siap. Tekan Transkripsikan untuk memulai.',
  '“{title}” was deleted.': '“{title}” telah dihapus.',
  '(optional)': '(opsional)',
  '{base} Word timing: {timing}.': '{base} Waktu per kata: {timing}.',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand} ({domain}) dioperasikan oleh **{name}**, {address} ("kami"). Kami menentukan bagaimana dan mengapa data Anda diproses, seperti dijelaskan di sini.',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand} ({domain}) dijalankan oleh **{name}**, {address}. Baca selengkapnya di halaman [Tentang](/about).',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand} adalah layanan untuk khalayak umum dan tidak ditujukan bagi anak di bawah 13 tahun (atau di bawah 16 tahun di UE jika berlaku).',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand} dibuat dan dijalankan oleh **{name}**, {role} yang berbasis di {city}. Saya membuatnya untuk memberi orang pengalaman transkripsi terbaik: mulus sejak klik pertama, tanpa perlu membuat akun, dengan antarmuka bersih yang tidak mengganggu.',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} ditujukan untuk khalayak umum dan tidak ditujukan bagi anak di bawah 13 tahun.',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages). No ad is shown while a file is being transcribed or beside your transcript, and never on the privacy, terms or logs pages.':
    '{brand} gratis karena menampilkan iklan yang disajikan oleh Google AdSense. Iklan hanya muncul di halaman informasi (beranda, Cara kerja, FAQ, dan halaman alat). Tidak ada iklan yang ditampilkan saat file sedang ditranskripsikan maupun di samping transkrip Anda, dan tidak pernah di halaman privasi, ketentuan, atau log.',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    '{brand} gratis digunakan. [Kebijakan privasi](/privacy) menjelaskan apa yang terjadi pada file Anda.',
  '{brand} is funded by ads shown on its information pages (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand} didanai oleh iklan yang ditampilkan di halaman informasinya (Google AdSense). Karena perangkat Anda sendiri yang melakukan transkripsi, tidak ada biaya server untuk setiap file, dan itulah yang membuat layanan ini tetap gratis dan tanpa batas. [Kebijakan privasi](/privacy) menjelaskan apa yang digunakan iklan dan cara memilih pengaturan Anda.',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand} mengubah ucapan dalam file video atau audio menjadi teks dengan penanda waktu, dalam tiga langkah mudah.',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand} mengubah ucapan dalam video, file audio, dan rekaman suara menjadi teks akurat berpenanda waktu. Gratis, tidak ada batas jumlah file yang Anda transkripsikan, dan Anda tidak memerlukan akun: pilih file di atas, tekan Transkripsikan, lalu baca hasilnya.',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand} mengubah file video dan audio menjadi teks langsung di browser Anda: pengenalan berjalan di perangkat Anda, dan file Anda tidak diunggah ke kami. Gratis digunakan dan tidak memerlukan akun. Layanan ini didanai oleh iklan di halaman informasi (Google AdSense; lihat [Kebijakan privasi](/privacy)). Kami dapat mengubah, membatasi, atau menghentikan fitur kapan saja.',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand} mengubah video dan audio menjadi teks berpenanda waktu secara gratis. Tanpa pendaftaran, tanpa masuk, dan tanpa watermark: buka halaman, pilih file, lalu baca transkrip Anda.',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages, and are served by Google, which uses cookies.':
    '{brand} mengubah video dan audio menjadi teks langsung di browser Anda. Halaman ini menjelaskan apa artinya itu bagi data Anda, dengan kata-kata sederhana. Singkatnya: file Anda tidak pernah meninggalkan perangkat Anda. Transkrip Anda hanya disimpan di browser ini, tidak ada akun, dan situs ini tidak memasang cookie sendiri. Iklan hanya muncul di halaman informasi, dan disajikan oleh Google, yang menggunakan cookie.',
  '{done} of {total}': '{done} dari {total}',
  '{duration} (estimate)': '{duration} (perkiraan)',
  '{gb} GB of memory recommended': 'Disarankan memori {gb} GB',
  '{h} h': '{h} jam',
  '{h} h {m} min': '{h} jam {m} mnt',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)': '{label} (penggunaan pertama mengunduh {size} MB)',
  "{label}, as reported by visitors' browsers":
    '{label}, sebagaimana dilaporkan oleh browser pengunjung',
  '{label}: common questions': '{label}: pertanyaan umum',
  '{label}. {title}.': '{label}. {title}.',
  '{label}. Look for it in your downloads.': '{label}. Cari di folder unduhan Anda.',
  '{language} → English': '{language} → Inggris',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} {done} dari {total} file sudah masuk antrean; {left} file lainnya masih ada di daftar, tekan Transkripsikan untuk mencoba lagi.',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} {done} dari {total} file sudah masuk antrean; {left} file lainnya masih ada di daftar, tekan Transkripsikan untuk mencoba lagi.',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '{model} berjalan lebih lambat dari waktu nyata di perangkat ini: {wait} untuk {audio} audio (perkiraan). Tiny atau base selesai lebih cepat.',
  '{n} files were skipped: not video or audio.': '{n} file dilewati: bukan video atau audio.',
  '{n} h ago': '{n} jam lalu',
  '{n} min': '{n} mnt',
  '{n} min ago': '{n} mnt lalu',
  '{n} min left': 'sisa {n} mnt',
  '{n} min read': '{n} mnt baca',
  '{n} minute': '{n} menit',
  '{n} minutes': '{n} menit',
  '{n} of {total}': '{n} dari {total}',
  '{n} of those files are already in the list.': '{n} dari file tersebut sudah ada di daftar.',
  '{n} video transcribed': '{n} video ditranskripsikan',
  '{n} videos transcribed': '{n} video ditranskripsikan',
  '{n} words': '{n} kata',
  '{n}% done': '{n}% selesai',
  '{n}% model confidence': '{n}% keyakinan model',
  '{n}s left': 'sisa {n} dtk',
  '{name} home': 'Beranda {name}',
  '{size} download': 'Unduhan {size}',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}.',
  '{title}. {blurb}': '{title}. {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}. {blurb} Tidak tersedia di perangkat ini: {reason}.',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**Log teknis di tab ini.** Halaman Log menampilkan log teknis tab ini sendiri. Log tetap berada di browser Anda dan tidak pernah dikirim ke mana pun.',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**Tambahkan petunjuk kosakata**: nama, merek, dan istilah khusus yang muncul dalam audio, dieja sesuai keinginan Anda.',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**Tambahkan petunjuk kosakata**: nama, merek, dan istilah khusus, dieja sesuai keinginan Anda.',
  '**Ads.** Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript.':
    '**Iklan.** Iklan hanya muncul di halaman informasi, dan disajikan oleh Google, yang menggunakan cookie. Tidak ada iklan yang ditampilkan saat file sedang ditranskripsikan maupun di samping transkrip Anda.',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**Periksa baris yang ditandai** dan perbaiki di editor transkrip.',
  '**Choose the spoken language** instead of auto-detect.':
    '**Pilih bahasa yang diucapkan** alih-alih deteksi otomatis.',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**Pilih file Anda.** Letakkan file video atau audio di atas, pilih dari perangkat Anda, atau rekam suara Anda dengan mikrofon. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG, dan sebagian besar format umum lainnya dapat digunakan.',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**Perbaiki audio** — saring dengung & desis, ratakan pembicara yang pelan',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**Batas file.** Tidak ada yang kami tetapkan. File Anda diproses di perangkat Anda, jadi file yang sangat besar atau panjang memerlukan waktu lebih lama dan membutuhkan memori kosong yang cukup; halaman akan memperingatkan Anda di perangkat yang lebih lambat.',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**Jenis file.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS, dan MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG, dan OPUS. Anda juga dapat merekam langsung dari mikrofon.',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**Cookie Google.** Google memasang cookie-nya sendiri saat iklan dimuat, hanya di halaman yang menampilkan iklan (lihat bagian 6).',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**Kuliah dan podcast** diubah menjadi teks yang mudah dibaca untuk belajar atau catatan acara.',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**Batas.** Server saat ini tidak mengumumkan batas ukuran atau panjang. File yang sangat besar hanya memerlukan waktu lebih lama.',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**Batas.** Kami tidak menetapkan batas ukuran atau panjang: file Anda diproses di perangkat Anda, jadi file yang sangat besar atau panjang hanya memerlukan waktu lebih lama dan membutuhkan memori kosong yang cukup. Di perangkat yang lebih lambat, halaman memberi tahu Anda sebelum mulai dan memperkirakan waktunya.',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**Media yang Anda tambahkan.** File video atau audio yang Anda pilih atau rekam. File diproses di browser pada perangkat Anda (menggunakan WebGPU atau WebAssembly). File Anda tidak pernah diunggah ke server kami dan tidak pernah dikirim ke Google atau siapa pun.',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**Catatan rapat dan wawancara** yang dapat Anda cari, kutip, dan bagikan.',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**Kesalahan bisa terjadi.** Tidak ada pengenalan suara yang sempurna. Selalu periksa transkrip sebelum mengandalkannya untuk hal penting.',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**Tanpa cookie sendiri.** Situs ini sendiri tidak memasang cookie.',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Tidak ada yang disimpan untuk nanti.** File dan transkrip hanya ada selama sesi Anda. Ekspor yang Anda perlukan sebelum pergi. Rinciannya ada di [Kebijakan privasi](/privacy).',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Tidak ada yang disimpan untuk nanti.** Transkrip dan file hanya tersimpan di browser ini dan dihapus otomatis setelah {idle} tidak aktif, atau saat Anda menekan **Hapus data saya sekarang**. Ekspor yang Anda perlukan sebelum pergi. Rinciannya ada di [Kebijakan privasi](/privacy).',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**Tidak ada yang disimpan untuk nanti.** Transkrip hanya ada selama sesi ini, jadi ekspor yang Anda perlukan. [Kebijakan privasi](/privacy) menjelaskan situs web yang dihosting.',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**Satu total berjalan.** Saat transkripsi selesai, browser Anda mengirim satu "+1" anonim ke penghitung kami (Cloudflare Worker). Tidak ada file, transkrip, atau pengenal yang dikirim. Cloudflare melihat alamat IP Anda saat transit dan menggunakannya sebentar untuk membatasi penyalahgunaan (pembatasan laju); kami hanya menyimpan totalnya. Angka yang ditampilkan di header halaman dilaporkan oleh browser pengunjung dan tidak diverifikasi.',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    '**Pilih Akurasi tinggi atau Akurasi terbaik** untuk audio yang sulit.',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**Pilih kualitas dan bahasa.** Model yang lebih cepat memberi draf cepat; yang lebih akurat lebih baik untuk wawancara, kuliah, dan subtitle. Bahasa yang diucapkan dapat dideteksi untuk Anda, dan lebih dari 50 bahasa didukung.',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    '**Transkripsi ulang** transkrip yang sudah selesai dengan kualitas atau bahasa lain; transkrip Anda saat ini tetap disimpan.',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    '**Transkripsi ulang** dengan kualitas atau bahasa lain; transkrip Anda saat ini tetap disimpan.',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**Baca, koreksi, dan unduh.** Transkrip muncul dengan penanda waktu, dan kata yang diragukan model ditandai agar dapat Anda periksa. Unduh sebagai teks biasa, subtitle SRT atau VTT, Markdown, atau JSON.',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**Permintaan yang mengirimkan situs web.** Cloudflare (Cloudflare Pages) menyajikan situs web ini. Sebagai penyedia hosting dan jaringan kami, Cloudflare memproses alamat IP Anda dan data permintaan yang lazim (seperti waktu, halaman yang diminta, dan browser Anda) untuk menyajikan dan melindungi situs.',
  '**Skip silence & music** — prevents made-up text':
    '**Lewati keheningan & musik** — mencegah teks karangan',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**Model ucapan tetap berada di cache browser Anda** (Cache Storage), sehingga transkripsi berikutnya dimulai lebih cepat, sampai Anda menghapusnya (**Hapus data saya sekarang** juga dapat menghapusnya) atau browser Anda membersihkan penyimpanannya. Model itu adalah file program, bukan data Anda.',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**Kecepatan.** Bergantung pada kualitas yang Anda pilih, panjang file, dan seberapa sibuk layanan.',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**Kecepatan.** Bergantung pada perangkat Anda, kualitas yang Anda pilih, dan panjang file. Penggunaan pertama suatu tingkat kualitas mengunduh modelnya sekali: browser Anda mengambil file model dari Hugging Face dan file program mesin dari jsDelivr, lalu menyimpannya di cache. Biarkan tab terbuka selama proses berjalan.',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**Mulai dari audio yang baik**: derau latar lebih sedikit, mikrofon dekat, dan satu orang berbicara pada satu waktu. Biarkan "Perbaiki audio" tetap aktif.',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**Mulai dari audio yang baik**: sedikit derau latar, mikrofon dekat, satu orang pada satu waktu. Biarkan "Perbaiki audio" tetap aktif.',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**Penyimpanan di browser Anda.** Browser Anda menyimpan transkrip dan file Anda (IndexedDB) serta model ucapan (Cache Storage) seperti dijelaskan di atas, mengingat pilihan tema terang atau gelap Anda, dan penyimpanan sesinya menyimpan beberapa pengaturan kenyamanan untuk tab saat ini (seperti pilihan kualitas terakhir Anda). Tidak ada satu pun yang dikirim kepada kami.',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    '**Subtitle dan keterangan** untuk video, reel, dan kursus online Anda sendiri, dari file SRT atau VTT.',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**Teks yang dibuat di perangkat Anda.** Transkrip, penanda waktunya, dan suntingan Anda, judul yang Anda pilih, serta pengaturan yang Anda pilih (kualitas, bahasa, petunjuk kosakata). Semuanya dibuat dan disimpan di browser ini; kami tidak pernah menerimanya.',
  '**Use previous text as context** — can repeat on long files':
    '**Gunakan teks sebelumnya sebagai konteks** — dapat berulang pada file panjang',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**Memo suara** dituliskan, sehingga Anda tidak perlu mendengarkannya lagi.',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**Mengapa hasil bisa berbeda antar proses, pengaturan kualitas, atau alat lain?** Pengenalan suara bersifat probabilistik: ia memilih kata yang paling mungkin, dan pada bagian yang bising atau ambigu beberapa jawaban hampir sama kuat. Pengaturan kualitas, pengaturan bahasa, petunjuk kosakata, atau pembersihan audio yang berbeda dapat mengubah teks, begitu pula alat lain yang menggunakan sistem berbeda. Nama atau label pembicara tidak ditambahkan.',
  '**Word-level timing** — better subtitles and confidence marks':
    '**Waktu per kata** — subtitle lebih baik dan tanda keyakinan',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**File dan transkrip Anda tetap berada di browser ini.** Transkrip, suntingan, dan file sumber hanya disimpan di penyimpanan browser ini (IndexedDB). Semuanya dihapus otomatis saat sesi Anda berakhir, yaitu setelah {idle} tidak aktif, atau segera saat Anda menekan **Hapus data saya sekarang** di menu Transkrip.',
  '1 file was skipped: not video or audio.': '1 file dilewati: bukan video atau audio.',
  '1 minute': '1 menit',
  '1 word': '1 kata',
  '1. Agreement': '1. Persetujuan',
  '1. Who runs this website': '1. Siapa yang menjalankan situs web ini',
  '10. Children': '10. Anak-anak',
  '10. Termination': '10. Penghentian',
  '11. Children': '11. Anak-anak',
  '11. Your rights and choices': '11. Hak dan pilihan Anda',
  '12. Changes': '12. Perubahan',
  '12. Open-source components': '12. Komponen sumber terbuka',
  '13. Changes to this policy': '13. Perubahan pada kebijakan ini',
  '13. Governing law': '13. Hukum yang berlaku',
  '14. Contact': '14. Kontak',
  '2. The service': '2. Layanan',
  '2. What is processed, and where': '2. Apa yang diproses, dan di mana',
  '3 simple steps': '3 langkah mudah',
  '3. Why it is processed': '3. Mengapa data diproses',
  '3. Your content': '3. Konten Anda',
  '4. Acceptable use': '4. Penggunaan yang dapat diterima',
  '4. How long it is kept': '4. Berapa lama data disimpan',
  '5. Downloads your browser makes': '5. Unduhan yang dilakukan browser Anda',
  '5. Limits: your device does the work': '5. Batas: perangkat Anda yang bekerja',
  '6. Accuracy: no warranty': '6. Akurasi: tanpa jaminan',
  '6. Advertising': '6. Iklan',
  '7. Availability': '7. Ketersediaan',
  '7. Cookies and browser storage': '7. Cookie dan penyimpanan browser',
  '8. Sharing': '8. Berbagi',
  '8. Third-party downloads and ads': '8. Unduhan dan iklan pihak ketiga',
  '9. Liability': '9. Tanggung jawab hukum',
  '9. Security': '9. Keamanan',
  'A name cannot be empty, so the old name was kept.':
    'Nama tidak boleh kosong, jadi nama lama dipertahankan.',
  'A new transcript has started. The old one is kept in your list.':
    'Transkrip baru telah dimulai. Yang lama tetap ada di daftar Anda.',
  'a period': 'suatu periode',
  About: 'Tentang',
  'About {brand}': 'Tentang {brand}',
  'about {h} h': 'sekitar {h} jam',
  'about {h} h {m} min': 'sekitar {h} jam {m} mnt',
  'about {n} min': 'sekitar {n} mnt',
  'Accurate text': 'Teks akurat',
  'Add another file': 'Tambah file lain',
  'Add your file': 'Tambahkan file Anda',
  'Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    'Iklan hanya muncul di halaman informasi, dan disajikan oleh Google, yang menggunakan cookie. Tidak ada iklan yang ditampilkan saat file sedang ditranskripsikan maupun di samping transkrip Anda, dan situs web ini tidak memasang cookie sendiri. Rinciannya ada di [Kebijakan privasi](/privacy).',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'Iklan tidak diperlukan untuk fitur apa pun: dengan iklan diblokir atau ditolak, semuanya tetap berfungsi sama.',
  'Ads keep TranscribeVid free. Everything works without them.':
    'Iklan membuat TranscribeVid tetap gratis. Semuanya berfungsi tanpa iklan.',
  Advertisement: 'Iklan',
  'All free tools': 'Semua alat gratis',
  'All free video and audio to text tools':
    'Semua alat gratis untuk mengubah video dan audio menjadi teks',
  'All tools': 'Semua alat',
  'All your data was deleted': 'Semua data Anda telah dihapus',
  'Allow the microphone in your browser, or choose a file instead.':
    'Izinkan mikrofon di browser Anda, atau pilih file saja.',
  'Already added': 'Sudah ditambahkan',
  'Already finished': 'Sudah selesai',
  'Also delete the downloaded speech models?': 'Hapus juga model ucapan yang diunduh?',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'Pengunggahan sedang berlangsung. Tunggu sampai selesai sebelum menambahkan file lagi.',
  'Apply style only': 'Terapkan gaya saja',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    'Terapkan gaya menggunakan hasil pengenalan yang tersimpan tanpa memproses audio lagi. Baris yang telah disunting tetap dipertahankan.',
  'Audio works too.': 'Audio juga bisa.',
  'Automatic (IndicXlit when installed)': 'Otomatis (IndicXlit jika terpasang)',
  Back: 'Kembali',
  'Basic phonetic spelling': 'Ejaan fonetik dasar',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'Karena kami tidak menyimpan akun dan tidak memiliki detail yang mengidentifikasi Anda, kami biasanya tidak dapat mengaitkan data apa pun dengan seseorang. Jika hukum memberi Anda hak atas data pribadi Anda, seperti akses, koreksi, penghapusan, pembatasan, keberatan, dan portabilitas, atau hak mengajukan keluhan ke otoritas perlindungan data Anda, Anda dapat menggunakannya dengan menghubungi kami:',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'Karena transkrip Anda hanya ada di browser ini, ekspor yang Anda perlukan sebelum pergi. Data yang dihapus tidak dapat dipulihkan.',
  'Best accuracy': 'Akurasi terbaik',
  'Best accuracy, slowest': 'Akurasi terbaik, paling lambat',
  Breadcrumb: 'Jejak navigasi',
  'By file type': 'Menurut jenis file',
  'By language': 'Menurut bahasa',
  'By use': 'Menurut penggunaan',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    'Dengan menggunakan {brand} ({domain}), Anda menyetujui ketentuan ini. Jika Anda tidak setuju, mohon jangan gunakan layanan ini. Layanan ini dioperasikan oleh **{name}**, {address}.',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'menghindari atau mencoba menghindari pembatasan laju atau keamanan situs web atau penghitungnya, atau mengganggu pengoperasiannya atau penggunaannya oleh pengunjung lain;',
  'Can I edit the transcript?': 'Bisakah saya menyunting transkrip?',
  "Can't reach the server.": 'Tidak dapat menjangkau server.',
  Cancel: 'Batal',
  'Cancel "{title}"?': 'Batalkan "{title}"?',
  'Cancel {title}': 'Batalkan {title}',
  'Cancellation requested': 'Pembatalan diminta',
  Cancelled: 'Dibatalkan',
  'Cancelling…': 'Membatalkan…',
  'Cannot reach the server': 'Tidak dapat menjangkau server',
  'Cannot reach the server.': 'Tidak dapat menjangkau server.',
  'Cannot reach the server. Check your connection and try again.':
    'Tidak dapat menjangkau server. Periksa koneksi Anda dan coba lagi.',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'Tidak dapat menjangkau server. Pastikan server berjalan (npm run dev) lalu coba lagi.',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'Ubah atau hapus baris, atau cari dan ganti. Suntingan Anda ada di setiap unduhan.',
  'Changed in {n} lines.': 'Diubah di {n} baris.',
  'Check Hinglish spelling': 'Periksa ejaan Hinglish',
  'Choose "Save as PDF" in the print dialog.': 'Pilih "Simpan sebagai PDF" di dialog cetak.',
  'Choose a file': 'Pilih file',
  'Choose a file first': 'Pilih file terlebih dahulu',
  'Choose a format': 'Pilih format',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'Pilih antara model yang lebih cepat dan lebih akurat, tergantung perangkat Anda dan waktu yang Anda miliki.',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'Pilih Tercepat, Standar, Akurasi tinggi, atau Akurasi terbaik: Tercepat paling cepat, Akurasi terbaik membuat kesalahan paling sedikit.',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'Pilih bahasa yang diucapkan atau biarkan pada deteksi otomatis. Anda juga dapat menerjemahkan ucapan ke bahasa Inggris.',
  'Chosen files': 'File yang dipilih',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'Ucapan yang jelas dan dekat dengan mikrofon memberi hasil terbaik. Di bawah Opsi lainnya, **Perbaiki audio** dan **Lewati keheningan & musik** aktif secara default: keduanya menyaring dengung dan desis serta mencegah model mengarang teks saat ada musik atau jeda panjang, jadi biarkan tetap aktif untuk rekaman yang bising. Untuk subtitle, biarkan **Waktu per kata** juga aktif, agar setiap baris dimulai dan berakhir tepat dengan kata-katanya.',
  Close: 'Tutup',
  'Close menu': 'Tutup menu',
  'Close: {title}': 'Tutup: {title}',
  'Common questions': 'Pertanyaan umum',
  Contact: 'Kontak',
  'Converting…': 'Mengonversi…',
  Copied: 'Tersalin',
  'Copy text': 'Salin teks',
  'Copying…': 'Menyalin…',
  'Could not cancel the transcript.': 'Tidak dapat membatalkan transkrip.',
  'Could not change transcript style.': 'Tidak dapat mengubah gaya transkrip.',
  'Could not copy': 'Tidak dapat menyalin',
  'Could not delete the transcript.': 'Tidak dapat menghapus transkrip.',
  'Could not delete your data.': 'Tidak dapat menghapus data Anda.',
  'Could not load the text to copy.': 'Tidak dapat memuat teks untuk disalin.',
  'Could not prepare the file. Please try again.':
    'Tidak dapat menyiapkan file. Silakan coba lagi.',
  'Could not rename the transcript.': 'Tidak dapat mengganti nama transkrip.',
  'Could not save the change.': 'Tidak dapat menyimpan perubahan.',
  'Could not start': 'Tidak dapat memulai',
  'Could not start.': 'Tidak dapat memulai.',
  Dark: 'Gelap',
  Delete: 'Hapus',
  'Delete "{title}" and its transcript?': 'Hapus "{title}" dan transkripnya?',
  'Delete "{title}"? This cannot be undone.':
    'Hapus "{title}"? Tindakan ini tidak dapat dibatalkan.',
  'Delete {title}': 'Hapus {title}',
  'Delete all your transcripts and the files kept in this browser now?':
    'Hapus semua transkrip Anda dan file yang disimpan di browser ini sekarang?',
  'Delete all your transcripts and uploaded files now?':
    'Hapus semua transkrip dan file yang diunggah sekarang?',
  'Delete line': 'Hapus baris',
  'Delete my data now': 'Hapus data saya sekarang',
  'Delete this line from the transcript?': 'Hapus baris ini dari transkrip?',
  'Delete transcript': 'Hapus transkrip',
  Deleted: 'Dihapus',
  'Detect automatically': 'Deteksi otomatis',
  'Dismiss message': 'Tutup pesan',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3 hanya memahami ucapan bahasa Inggris. Pilih model lain untuk menerjemahkan.',
  Done: 'Selesai',
  'Download failed': 'Pengunduhan gagal',
  'Download started': 'Pengunduhan dimulai',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'Unduh hasilnya sebagai teks biasa, subtitle SRT atau VTT, Markdown, atau JSON.',
  'Download the transcript as': 'Unduh transkrip sebagai',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'Mengunduh model ucapan (hanya pertama kali): {loaded} dari {total}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    'Letakkan file video atau audio di [beranda](/), atau rekam dari mikrofon Anda.',
  'Drop to add your file': 'Letakkan untuk menambahkan file Anda',
  'Drop your {noun} here, or choose a file': 'Seret {noun} Anda ke sini, atau pilih file',
  'Each line with its time, like [00:12]': 'Setiap baris dengan waktunya, seperti [00:12]',
  Edit: 'Sunting',
  'Edit it right here': 'Sunting langsung di sini',
  'Edit this line': 'Sunting baris ini',
  'Edited by you': 'Disunting oleh Anda',
  'English only, very fast and accurate': 'Hanya bahasa Inggris, sangat cepat dan akurat',
  'English translation is selected in More options.':
    'Terjemahan bahasa Inggris dipilih di Opsi lainnya.',
  'Enter saves · Esc cancels': 'Enter untuk menyimpan · Esc untuk membatalkan',
  'Every line has a time. Play the media from any line to hear what was said.':
    'Setiap baris punya waktu. Putar media dari baris mana pun untuk mendengar apa yang diucapkan.',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'Setiap halaman melakukan tugas yang sama: mengubah ucapan dalam file video atau audio menjadi teks dengan penanda waktu di setiap baris, dalam lebih dari 50 bahasa, tanpa pendaftaran. Pilih yang sesuai dengan file yang Anda miliki atau yang ingin Anda buat.',
  'Experimental: compare on your audio; chunk timestamps':
    'Eksperimental: bandingkan pada audio Anda; penanda waktu per potongan',
  'Experimental: larger model; chunk timestamps':
    'Eksperimental: model lebih besar; penanda waktu per potongan',
  Export: 'Ekspor',
  Failed: 'Gagal',
  FAQ: 'FAQ',
  Fast: 'Cepat',
  'Fast, clean audio': 'Cepat, audio bersih',
  Fastest: 'Tercepat',
  'Fastest, rough drafts only': 'Tercepat, hanya untuk draf kasar',
  'Fewer mistakes. Takes longer.': 'Lebih sedikit kesalahan. Butuh waktu lebih lama.',
  'Fewest mistakes. Takes the longest.': 'Kesalahan paling sedikit. Butuh waktu paling lama.',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    'File "{name}" berukuran {size}; batasnya {limit} - atur VT_MAX_UPLOAD_MB untuk menaikkannya',
  'File "{name}" is {size}; the limit is {limit}.':
    'File "{name}" berukuran {size}; batasnya {limit}.',
  'file {n} of {total}': 'file {n} dari {total}',
  'File added': 'File ditambahkan',
  'File limits.': 'Batas file.',
  'File not added': 'File tidak ditambahkan',
  'File skipped': 'File dilewati',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'File dan transkrip hanya ada selama sesi Anda. Ekspor yang Anda perlukan sebelum pergi. Satu-satunya yang kami simpan adalah satu total berjalan anonim jumlah file yang telah ditranskripsikan di situs ini (satu angka, ditampilkan di header halaman); angka itu tidak terkait dengan Anda, file Anda, atau sesi Anda. Rinciannya ada di [Kebijakan privasi](/privacy).',
  'Find it automatically': 'Temukan otomatis',
  'first time only, also downloads the {size} MB word-timing model':
    'hanya pertama kali, juga mengunduh model waktu per kata {size} MB',
  'First time only: downloads {size} (needs internet)':
    'Hanya pertama kali: mengunduh {size} (perlu internet)',
  'Follow playback': 'Ikuti pemutaran',
  'Following playback': 'Mengikuti pemutaran',
  Footer: 'Footer',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'Untuk ucapan beraksen atau campuran bahasa, coba pengaturan kualitas yang lebih tinggi. Skor keyakinan bukan persentase akurasi.',
  'For developers: words, times, confidence': 'Untuk pengembang: kata, waktu, keyakinan',
  'For notes apps': 'Untuk aplikasi catatan',
  'For video players and editors': 'Untuk pemutar video dan editor',
  'For YouTube and web video': 'Untuk YouTube dan video web',
  Free: 'Gratis',
  'Free tools': 'Alat gratis',
  'Free tools:': 'Alat gratis:',
  'Free video and audio to text': 'Video dan audio ke teks, gratis',
  'Free video and audio to text, right in your browser':
    'Video dan audio ke teks gratis, langsung di browser Anda',
  'Free, unlimited, and no login needed': 'Gratis, tanpa batas, dan tanpa login',
  'Free, unlimited, no login': 'Gratis, tanpa batas, tanpa login',
  'Frequently asked questions': 'Pertanyaan yang sering diajukan',
  'Get in touch': 'Hubungi kami',
  'Getting the speech engine ready…': 'Menyiapkan mesin ucapan…',
  'Give it a new name': 'Beri nama baru',
  'Go to the home page': 'Ke beranda',
  'Go to Video to text': 'Ke Video ke teks',
  'Good balance (default)': 'Keseimbangan yang baik (default)',
  'Good to know': 'Perlu diketahui',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'Alat persetujuan Google tidak dapat dimuat, kemungkinan karena pemblokir iklan atau jaringan menghentikannya. Tanpa alat itu, tidak ada iklan dan cookie iklan yang dimuat.',
  Guides: 'Panduan',
  'Guides: transcripts and subtitles': 'Panduan: transkrip dan subtitle',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'Punya pertanyaan, menemukan bug, atau ingin mengusulkan fitur? Tulis ke {email}. Setiap pesan dibaca oleh orang yang membuat {brand}, dan biasanya Anda akan mendapat jawaban dalam beberapa hari kerja.',
  'Helps spell uncommon words correctly.': 'Membantu mengeja kata yang tidak umum dengan benar.',
  'High accuracy': 'Akurasi tinggi',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    'Akurasi tinggi (Large v3 Turbo) tidak dilatih untuk menerjemahkan dan mungkin memberi Anda bahasa aslinya. Untuk terjemahan, pilih Standar atau Akurasi terbaik.',
  'High accuracy, slower': 'Akurasi tinggi, lebih lambat',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    'Lebih tinggi sedikit lebih akurat dan lebih lambat. 5 adalah default yang baik.',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'Hindi dalam huruf Latin, dengan kata Inggris dipertahankan. Bahasa lain mempertahankan aksara aslinya. Periksa kata dan nama yang tidak dikenal.',
  'Hinglish (Roman Hindi)': 'Hinglish (Hindi beraksara Latin)',
  'Hinglish conversion': 'Konversi Hinglish',
  History: 'Riwayat',
  Home: 'Beranda',
  'How {brand} works': 'Cara kerja {brand}',
  'How accurate is it?': 'Seberapa akurat?',
  'How do I get better accuracy?': 'Bagaimana cara mendapatkan akurasi lebih baik?',
  'How it stays free': 'Mengapa tetap gratis',
  'How it works': 'Cara kerja',
  'How long does it take?': 'Berapa lama waktu yang dibutuhkan?',
  'How to transcribe a video to text': 'Cara mentranskripsikan video menjadi teks',
  'How to turn a video or audio file into text with {brand}':
    'Cara mengubah file video atau audio menjadi teks dengan {brand}',
  'If it does have speech, try More › Re-transcribe with the right language.':
    'Jika memang ada ucapan, coba Lainnya › Transkripsi ulang dengan bahasa yang benar.',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'Jika layanan sibuk atau terlalu banyak transkrip sedang berjalan, Anda diminta menunggu dan diberi tahu alasannya.',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'Jika kami mengubah kebijakan ini, versi baru akan muncul di halaman ini dengan tanggal "Terakhir diperbarui" yang baru.',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'Di EEA, Inggris Raya, dan Swiss, serta di beberapa negara bagian AS, pesan persetujuan bersertifikat Google meminta pilihan Anda saat iklan dimuat.',
  'IndicXlit (trained model)': 'IndicXlit (model terlatih)',
  'Is it really free and unlimited? Do I need to log in?':
    'Apakah benar-benar gratis dan tanpa batas? Apakah saya perlu login?',
  'Is my data private?': 'Apakah data saya privat?',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    'Bergantung pada kualitas yang Anda pilih, panjang file, dan seberapa sibuk layanan. Tercepat itu cepat; Akurasi terbaik paling lama tetapi membuat kesalahan paling sedikit. Kemajuan dan sisa waktu ditampilkan langsung, dan file yang menunggu gilirannya menampilkan "Menunggu dalam antrean".',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'Bergantung pada perangkat Anda, kualitas yang Anda pilih, dan panjang file. Dengan chip grafis yang mumpuni (WebGPU) paling cepat; jika tidak, berjalan di prosesor (WebAssembly), yang lebih lambat. Tercepat itu cepat; Akurasi terbaik paling lama tetapi membuat kesalahan paling sedikit. Kemajuan dan sisa waktu ditampilkan langsung.',
  'It is now called “{title}”.': 'Sekarang bernama “{title}”.',
  'It may have been deleted.': 'Mungkin sudah dihapus.',
  'It was stopped before any text was found.': 'Dihentikan sebelum ada teks yang ditemukan.',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'Datanya telah dihapus, termasuk transkrip ini. Transkrip hanya disimpan selama sesi yang membuatnya.',
  'Job not found': 'Tugas tidak ditemukan',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'baru saja',
  'Just the words, in paragraphs': 'Hanya kata-katanya, dalam paragraf',
  'Keep reading': 'Baca lebih lanjut',
  'Keep this page open until the upload is done.':
    'Biarkan halaman ini terbuka sampai pengunggahan selesai.',
  'Kept only for this session, then deleted automatically.':
    'Disimpan hanya selama sesi ini, lalu dihapus otomatis.',
  Language: 'Bahasa',
  'Larger or longer files are refused before they are processed, so split them first.':
    'File yang lebih besar atau lebih panjang ditolak sebelum diproses, jadi pisahkan dulu.',
  'Last updated: {date}': 'Terakhir diperbarui: {date}',
  'Licence text': 'Teks lisensi',
  Light: 'Terang',
  'Limits.': 'Batas.',
  'Line deleted': 'Baris dihapus',
  'Live: the text appears here as it is recognised': 'Langsung: teks muncul di sini saat dikenali',
  'Loading model… (first use downloads it)': 'Memuat model… (penggunaan pertama mengunduhnya)',
  'Loading…': 'Memuat…',
  'Long (56 letters)': 'Panjang (56 huruf)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'Jawaban lebih panjang: format, subtitle, akurasi, dan privasi.',
  Main: 'Utama',
  'Make a new transcript of the same file. This one is kept.':
    'Buat transkrip baru dari file yang sama. Yang ini tetap disimpan.',
  'Make a subtitle file (SRT or VTT) from your video.':
    'Buat file subtitle (SRT atau VTT) dari video Anda.',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'Menu',
  Model: 'Model',
  More: 'Lainnya',
  'More answers: [Frequently asked questions](/faq)':
    'Jawaban lainnya: [Pertanyaan yang sering diajukan](/faq)',
  'More free tools': 'Alat gratis lainnya',
  'More options': 'Opsi lainnya',
  'More than 50 languages': 'Lebih dari 50 bahasa',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    'Lebih dari 50 bahasa, termasuk Inggris, Spanyol, Prancis, Jerman, Portugis, Italia, Belanda, Rusia, Arab, Hindi, Mandarin, Jepang, dan Korea. Biarkan bahasa pada deteksi otomatis atau pilih sendiri. Anda juga dapat menerjemahkan ucapan ke bahasa Inggris.',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'Kebanyakan situs transkripsi meminta Anda membuat akun, membatasi menit gratis, menambahkan watermark, atau mendorong langganan sebelum Anda melihat satu baris teks pun. {brand} melakukan sebaliknya. Semua yang ditawarkannya tersedia untuk semua orang, dan halaman hanya meminta file Anda.',
  'Name not changed': 'Nama tidak diubah',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    'Nama, merek, dan istilah khusus dalam audio, misalnya Kubernetes, Dr. Okafor',
  'Near-best accuracy, much faster than Large':
    'Akurasi hampir terbaik, jauh lebih cepat daripada Large',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'butuh dukungan shader 16-bit (shader-f16) di driver grafis',
  'needs 4 GB': 'butuh 4 GB',
  'needs 8 GB': 'butuh 8 GB',
  'needs a graphics-capable browser (Chrome, Edge)':
    'butuh browser berkemampuan grafis (Chrome, Edge)',
  'needs WebGPU': 'butuh WebGPU',
  'Next match': 'Kecocokan berikutnya',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'Tanpa akun dan tanpa pelacakan. File Anda hanya disimpan selama sesi Anda dan dihapus otomatis.',
  'no estimate for this model here': 'tidak ada perkiraan untuk model ini di sini',
  'No login': 'Tanpa login',
  'No matches': 'Tidak ada kecocokan',
  'No microphone': 'Tidak ada mikrofon',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'Tanpa pendaftaran, tanpa pembayaran, tanpa batas harian. Cukup tambahkan file Anda.',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'Server saat ini tidak mengumumkan batas ukuran atau panjang. File yang sangat besar hanya memerlukan waktu lebih lama.',
  'No speech was found in this file.': 'Tidak ada ucapan yang ditemukan di file ini.',
  'No speech was transcribed.': 'Tidak ada ucapan yang ditranskripsikan.',
  'No speech was transcribed. Check the recording and the selected language.':
    'Tidak ada ucapan yang ditranskripsikan. Periksa rekaman dan bahasa yang dipilih.',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'Tidak ada WebGPU di sini: model berjalan pada satu thread CPU, sehingga ukuran yang lebih besar lebih lambat daripada waktu nyata.',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'Tidak ada file orang lain yang mendahului file Anda. Jika Anda menambahkan beberapa file, file-file itu ditranskripsikan satu per satu di tab Anda, jadi biarkan tab terbuka sampai selesai.',
  'None of those are video or audio files.':
    'Tidak satu pun dari itu adalah file video atau audio.',
  Normal: 'Normal',
  'not available for this size': 'tidak tersedia untuk ukuran ini',
  'not available in this browser': 'tidak tersedia di browser ini',
  'not available with Qwen (times are per chunk)':
    'tidak tersedia dengan Qwen (waktu per potongan)',
  'Not cancelled': 'Tidak dibatalkan',
  'Not deleted': 'Tidak dihapus',
  'Not renamed': 'Tidak diganti namanya',
  'Not saved': 'Tidak disimpan',
  Note: 'Catatan',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'Belum ada apa pun di sini. Transkrip yang Anda buat muncul di sini selama sesi ini.',
  'Nothing is saved. Export what you need.': 'Tidak ada yang disimpan. Ekspor yang Anda perlukan.',
  'Nothing is uploaded until you press Transcribe.':
    'Tidak ada yang diunggah sampai Anda menekan Transkripsikan.',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'Tidak perlu mendaftar dan tidak perlu membayar. Cukup tambahkan file Anda.',
  'Nothing was recorded.': 'Tidak ada yang direkam.',
  Off: 'Mati',
  On: 'Hidup',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'Pada ucapan yang jelas dalam bahasa yang didukung, hasilnya biasanya sangat akurat, tetapi tidak ada pengenalan suara yang sempurna. Akurasi bergantung pada kualitas audio, aksen, derau latar, pembicara yang tumpang tindih, musik, serta nama langka atau istilah khusus. Setiap baris punya skor keyakinan, dan baris berkeyakinan rendah ditandai agar Anda dapat memeriksanya lebih dulu. Selalu periksa transkrip sebelum mengandalkannya untuk hal penting.',
  'Open menu': 'Buka menu',
  'Opening your transcript…': 'Membuka transkrip Anda…',
  'or drop it anywhere on this page.': 'atau letakkan di mana saja pada halaman ini.',
  'Original script': 'Aksara asli',
  Output: 'Output',
  'Page {page} of {pages}': 'Halaman {page} dari {pages}',
  'Page not found': 'Halaman tidak ditemukan',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'Halaman untuk file yang sudah Anda miliki: WAV, M4A, WebM, dan MOV.',
  'PDF document (.pdf)': 'Dokumen PDF (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'PDF dibuat oleh browser Anda: pilih "Simpan sebagai PDF" di dialog cetak.',
  'Pick quality': 'Pilih kualitas',
  'Plain text (.txt)': 'Teks biasa (.txt)',
  'Play from here': 'Putar dari sini',
  'Playback speed': 'Kecepatan pemutaran',
  'Please add one file at a time here. You can add more files on the next page.':
    'Mohon tambahkan satu file dalam satu waktu di sini. Anda dapat menambahkan lebih banyak file di halaman berikutnya.',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'Mohon jangan kirim rekaman pribadi. {brand} mentranskripsikan file Anda di perangkat Anda sendiri dan kami tidak pernah menerimanya, jadi kami tidak membutuhkannya untuk membantu Anda.',
  'Please note': 'Harap perhatikan',
  Preparing: 'Menyiapkan',
  'Preparing audio…': 'Menyiapkan audio…',
  'Preparing the audio…': 'Menyiapkan audio…',
  'Preparing…': 'Menyiapkan…',
  'Press a question to read its answer.': 'Tekan pertanyaan untuk membaca jawabannya.',
  'Previous match': 'Kecocokan sebelumnya',
  'Print to PDF': 'Cetak ke PDF',
  Privacy: 'Privasi',
  'Privacy and cookie settings': 'Pengaturan privasi dan cookie',
  'Privacy policy': 'Kebijakan privasi',
  'Privacy requests': 'Permintaan terkait privasi',
  Private: 'Privat',
  Progress: 'Kemajuan',
  Quality: 'Kualitas',
  'Questions about these terms:': 'Pertanyaan tentang ketentuan ini:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'Pertanyaan, laporan bug, dan ide selalu disambut. Tulis ke {email}, atau lihat halaman [Kontak](/contact) untuk hal-hal yang perlu disertakan.',
  Queued: 'Dalam antrean',
  'Quick results. Good for clear speech.': 'Hasil cepat. Cocok untuk ucapan yang jelas.',
  Quickest: 'Tercepat',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'Qwen menggunakan penanda waktu per potongan yang bersifat perkiraan. Waktu per kata dan tingkat keyakinan tidak tersedia.',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'Qwen menggunakan penanda waktu per potongan dan tidak memberikan keyakinan per kata. Bandingkan contoh singkat sebelum memilihnya.',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (eksperimental)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASR memerlukan browser desktop dengan WebGPU (Chrome atau Edge) dan dukungan shader 16-bit (shader-f16) di driver grafis.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASR memerlukan browser desktop dengan WebGPU (Chrome atau Edge) dan memori 8 GB.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASR memerlukan browser desktop dengan WebGPU (Chrome atau Edge).',
  'Re-transcribe': 'Transkripsi ulang',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'Baca transkrip dengan penanda waktu, lihat kata mana yang diragukan model, dan koreksi langsung di tempat.',
  'Read, edit, download': 'Baca, sunting, unduh',
  Ready: 'Siap',
  'Ready to print or share': 'Siap dicetak atau dibagikan',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    'Siap mencoba? [Lihat semua alat gratis](/tools) atau [transkripsikan file sekarang](/).',
  'Recognition engine': 'Mesin pengenalan',
  Recommended: 'Disarankan',
  'Record from microphone': 'Rekam dari mikrofon',
  'Record straight from your microphone and turn it into text.':
    'Rekam langsung dari mikrofon Anda dan ubah menjadi teks.',
  'Record with your microphone': 'Rekam dengan mikrofon Anda',
  'Recording {stamp}': 'Rekaman {stamp}',
  'Recording is not supported by this browser.': 'Perekaman tidak didukung oleh browser ini.',
  'Related reading': 'Bacaan terkait',
  Remove: 'Singkirkan',
  'Remove {name}': 'Singkirkan {name}',
  'Removes it for good': 'Dihapus selamanya',
  Rename: 'Ganti nama',
  Renamed: 'Nama diganti',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    'Ganti "{query}" dengan "{replacement}" di {n} baris?',
  'Replace "{query}" with "{replacement}" in 1 line?':
    'Ganti "{query}" dengan "{replacement}" di 1 baris?',
  'Replace in {n} lines': 'Ganti di {n} baris',
  'Replace in 1 line': 'Ganti di 1 baris',
  'Replace with': 'Ganti dengan',
  'Replace with…': 'Ganti dengan…',
  'Replace…': 'Ganti…',
  Replaced: 'Diganti',
  'Reporting a problem': 'Melaporkan masalah',
  'Retrying…': 'Mencoba lagi…',
  'Review language and quality': 'Tinjau bahasa dan kualitas',
  'Review this transcript': 'Tinjau transkrip ini',
  Save: 'Simpan',
  Saved: 'Tersimpan',
  'Saving…': 'Menyimpan…',
  'Search depth: {n}': 'Kedalaman pencarian: {n}',
  'Search the text': 'Cari di teks',
  'Search the transcript': 'Cari di transkrip',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'Lihat juga [Ketentuan penggunaan](/terms), [Cara kerja](/how-it-works), dan [FAQ](/faq).',
  'Server busy': 'Server sibuk',
  'Session only — nothing is saved.': 'Hanya sesi ini — tidak ada yang disimpan.',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'Hanya sesi ini — tidak ada yang disimpan. Menutup aplikasi menghapus semua transkrip. Ekspor yang Anda perlukan.',
  'Session time left: about {n} min': 'Sisa waktu sesi: sekitar {n} mnt',
  'Short (32 letters)': 'Pendek (32 huruf)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'Jawaban singkat dan praktis tentang mengubah ucapan menjadi teks dan subtitle: format subtitle mana yang dipilih, cara menambahkan subtitle ke video, cara mendapatkan transkrip yang lebih akurat, dan bagaimana transkripsi dapat berjalan di browser Anda sendiri tanpa mengunggah file Anda.',
  'Show all {count} languages': 'Tampilkan semua {count} bahasa',
  'Six ways to download': 'Enam cara mengunduh',
  'Skip to main content': 'Langsung ke konten utama',
  Slower: 'Lebih lambat',
  'slower than real time on the measured laptop':
    'lebih lambat dari waktu nyata pada laptop yang diukur',
  Slowest: 'Paling lambat',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'Beberapa fitur mengunduh komponen sumber terbuka ke browser Anda saat Anda menggunakannya. Komponen itu berjalan di perangkat Anda seperti bagian mesin lainnya. Lisensinya meminta kami menampilkan pemberitahuan berikut:',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    'Beberapa bagian perlu diperiksa dengan mendengarkan karena teks berulang atau batas ucapan yang tidak pasti.',
  'Something went wrong': 'Terjadi kesalahan',
  'Something went wrong in this browser. Please try again.':
    'Terjadi kesalahan di browser ini. Silakan coba lagi.',
  'Something went wrong while reading this file.': 'Terjadi kesalahan saat membaca file ini.',
  'Source code': 'Kode sumber',
  Speed: 'Kecepatan',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'Kecepatan pada ponsel dan tablet diperkirakan, bukan diukur; tiny dan base adalah ukuran yang aman.',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'SRT dan VTT untuk subtitle, TXT dan Markdown untuk dibaca, JSON untuk program, atau PDF untuk dicetak.',
  Standard: 'Standar',
  'Standard (42 letters)': 'Standar (42 huruf)',
  Start: 'Mulai',
  'Start a new transcription': 'Mulai transkripsi baru',
  'Start again': 'Mulai lagi',
  'Started again': 'Dimulai lagi',
  'Starting…': 'Memulai…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'Masih punya pertanyaan? Baca [pertanyaan yang sering diajukan](/faq), lihat [cara kerja](/how-it-works), atau [hubungi kami](/contact).',
  'Still stuck? [Read How it works](/how-it-works)':
    'Masih buntu? [Baca Cara kerja](/how-it-works)',
  'Stop recording · {time}': 'Hentikan perekaman · {time}',
  'Stop this transcription? The text found so far is kept.':
    'Hentikan transkripsi ini? Teks yang sudah ditemukan tetap disimpan.',
  'Stopping the transcription worker. The text found so far is kept.':
    'Menghentikan proses transkripsi. Teks yang sudah ditemukan tetap disimpan.',
  'Stored on this device only, never uploaded.':
    'Disimpan hanya di perangkat ini, tidak pernah diunggah.',
  'Style unchanged': 'Gaya tidak berubah',
  'Style updated': 'Gaya diperbarui',
  'Style updated using the saved recognition. Edited lines are kept.':
    'Gaya diperbarui menggunakan hasil pengenalan yang tersimpan. Baris yang telah disunting tetap dipertahankan.',
  'Subtitle files': 'File subtitle',
  'Subtitle line length': 'Panjang baris subtitle',
  'Subtitles (.srt)': 'Subtitle (.srt)',
  'Switch to dark theme': 'Beralih ke tema gelap',
  'Switch to light theme': 'Beralih ke tema terang',
  Terms: 'Ketentuan',
  'Terms of use': 'Ketentuan penggunaan',
  'Text with times (.txt)': 'Teks dengan waktu (.txt)',
  'That file is already in the list.': 'File itu sudah ada di daftar.',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'Itu bukan file video atau audio. Pilih MP4, MOV, MP3, atau file video atau audio lainnya.',
  'That is not a video or audio file. Please choose a video or audio file.':
    'Itu bukan file video atau audio. Silakan pilih file video atau audio.',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'Itu bukan file audio. Pilih MP3, WAV, M4A, atau file audio lainnya.',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    '[Kebijakan privasi](/privacy) menjelaskan apa yang diproses dan mengapa. Untuk mengajukan pertanyaan tentang data Anda atau menggunakan hak Anda, tulis ke alamat yang sama.',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    'Model {label} tidak dapat berjalan di perangkat ini: {reason}. Pilih yang lain.',
  'the exact error message, or a screenshot of it.':
    'pesan kesalahan yang persis, atau tangkapan layarnya.',
  'The file is larger than the server accepts.': 'File lebih besar dari yang diterima server.',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'Saat pertama kali Anda menggunakan suatu tingkat kualitas, browser Anda mengunduh model ucapannya sekali dan menyimpannya untuk lain kali, sehingga file berikutnya dimulai lebih cepat.',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'Saat pertama kali Anda menggunakan suatu tingkat kualitas, browser Anda mengunduh model ucapan dari Hugging Face dan file program mesin dari jsDelivr, lalu menyimpannya untuk lain kali; tidak ada bagian dari file Anda yang dikirim bersamanya. Saat transkripsi selesai, browser Anda menambahkan satu ke penghitung anonim di header halaman, dan tidak ada yang lain.',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'Driver grafis tidak memiliki shader 16-bit: unduhan lebih besar dan penggunaan memori lebih tinggi.',
  'The line was removed.': 'Baris telah dihapus.',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'Alat utama: ubah file video atau audio apa pun menjadi transkrip berpenanda waktu.',
  'The page you are looking for does not exist or has moved.':
    'Halaman yang Anda cari tidak ada atau telah dipindahkan.',
  'The recording failed. Please try again.': 'Perekaman gagal. Silakan coba lagi.',
  'The server does not have enough free disk space for this file.':
    'Server tidak memiliki cukup ruang disk kosong untuk file ini.',
  'The server is busy': 'Server sibuk',
  'The server is busy right now.': 'Server sedang sibuk sekarang.',
  'The service is busy right now. Please wait a moment and try again.':
    'Layanan sedang sibuk sekarang. Mohon tunggu sebentar lalu coba lagi.',
  'The service is full right now. Please try again in a little while.':
    'Layanan sedang penuh sekarang. Silakan coba lagi beberapa saat lagi.',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    'Pengenalan ucapan berjalan di dalam browser Anda sendiri, menggunakan model pengenalan ucapan terbuka seperti OpenAI Whisper. Browser Anda mengunduh model sekali dan menyimpannya, lalu mengerjakan semuanya di perangkat Anda. Video atau audio Anda tidak pernah diunggah ke kami, itulah juga sebabnya tidak ada batas ukuran file dan tidak ada antrean file orang lain. Halaman [Cara kerja](/how-it-works) menjelaskan setiap langkah.',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'Bahasa yang diucapkan tidak dapat dikenali dengan yakin. Pilih bahasa yang Anda dengar lalu coba lagi.',
  'The text found before it was stopped is shown below.':
    'Teks yang ditemukan sebelum dihentikan ditampilkan di bawah.',
  'The text found so far is kept.': 'Teks yang sudah ditemukan tetap disimpan.',
  'The text is ready to paste.': 'Teks siap ditempel.',
  'The transcript finished before it could be cancelled.':
    'Transkrip selesai sebelum sempat dibatalkan.',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'Transkripsi berjalan di perangkat Anda sendiri dengan model pengenalan ucapan terbuka seperti OpenAI Whisper. Browser Anda mengunduh model sekali dan menyimpannya, sehingga file berikutnya dimulai lebih cepat, dan video atau audio Anda tidak pernah diunggah ke mana pun.',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'jenis dan panjang file, misalnya "MP4, 25 menit";',
  'There is no size or length limit set here.':
    'Tidak ada batas ukuran atau panjang yang ditetapkan di sini.',
  'These details make a problem much quicker to find and fix:':
    'Rincian ini membuat masalah jauh lebih cepat ditemukan dan diperbaiki:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    'Ketentuan ini diatur oleh hukum India. Pengadilan Bengaluru, Karnataka, India memiliki yurisdiksi eksklusif atas sengketa apa pun yang timbul darinya. Ini tidak menghilangkan perlindungan apa pun yang Anda miliki berdasarkan undang-undang perlindungan konsumen yang wajib di negara tempat Anda tinggal.',
  'They are downloaded again the next time you transcribe.':
    'File itu diunduh lagi saat Anda mentranskripsikan berikutnya.',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'Vendor pihak ketiga, termasuk Google, menggunakan cookie untuk menayangkan iklan berdasarkan kunjungan Anda sebelumnya ke situs web ini atau situs web lain. Penggunaan cookie iklan oleh Google memungkinkan Google dan mitranya menayangkan iklan kepada Anda berdasarkan kunjungan Anda ke situs ini dan/atau situs lain di Internet.',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'Kotak ini menerima file audio seperti MP3, WAV, atau M4A, tetapi yang itu adalah video.',
  'This browser cannot record. Please choose a file instead.':
    'Browser ini tidak dapat merekam. Silakan pilih file saja.',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'Browser ini tidak melaporkan memori; diasumsikan {gb} GB. Pilih model yang lebih kecil jika halaman menjadi lambat.',
  'This cannot be undone. Export anything you want to keep first.':
    'Tindakan ini tidak dapat dibatalkan. Ekspor dulu apa pun yang ingin Anda simpan.',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    'Salinan {brand} ini berjalan di komputer Anda sendiri. File Anda diproses di mesin ini dan tidak ada yang keluar darinya. Tidak ada yang disimpan secara permanen: transkrip hanya ada selama sesi ini, jadi ekspor yang Anda perlukan. [Kebijakan privasi](/privacy) menjelaskan situs web yang dihosting.',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'Salinan ini berjalan di komputer Anda sendiri. File Anda diproses di mesin ini dan tidak ada yang keluar darinya.',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'Perangkat ini memiliki sedikit memori untuk file sepanjang ini. File diproses dalam potongan kecil, yang lebih lambat; potongan yang lebih pendek atau model yang lebih kecil lebih aman.',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'File ini memerlukan konverter 9 MB yang berjalan di browser Anda. Muat sekarang?',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'Ini adalah terjemahan untuk kenyamanan. Jika berbeda dengan versi bahasa Inggris, versi bahasa Inggris yang berlaku.',
  'This local copy does not count transcriptions': 'Salinan lokal ini tidak menghitung transkripsi',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'Transkrip ini memiliki keyakinan model yang rendah. Dengarkan rekaman dan periksa bahasa yang diucapkan sebelum menggunakan teksnya.',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'Ini akan memakan waktu {wait} di perangkat ini (perkiraan). Biarkan tab terbuka sampai selesai.',
  Timestamps: 'Penanda waktu',
  'Tips for the best results': 'Tips untuk hasil terbaik',
  'Tips for the best transcript': 'Tips untuk transkrip terbaik',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'Untuk mengubah pilihan iklan Anda, gunakan [Pengaturan Iklan Google](https://adssettings.google.com) atau pengaturan cookie browser Anda.',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'Untuk mengubah pilihan iklan Anda, gunakan **Pengaturan privasi dan cookie** di bagian bawah halaman yang menampilkan iklan, [Pengaturan Iklan Google](https://adssettings.google.com), atau pengaturan cookie browser Anda.',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'Untuk memberi Anda transkripsi yang Anda minta di perangkat Anda sendiri, mengirimkan situs web dengan aman, dan menjaga layanan tetap gratis melalui iklan. Jika hukum perlindungan data seperti GDPR berlaku, dasar hukum kami adalah menyediakan layanan yang Anda minta (Pasal 6(1)(b)), kepentingan sah kami dalam keamanan, pencegahan penyalahgunaan, dan total berjalan anonim (Pasal 6(1)(f)), dan, untuk cookie iklan jika hukum mensyaratkannya, persetujuan Anda (Pasal 6(1)(a)), yang diminta oleh pesan persetujuan Google.',
  'To keep it fast for everyone, each file has a size and length limit.':
    'Agar tetap cepat bagi semua orang, setiap file memiliki batas ukuran dan panjang.',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    'Sejauh diizinkan hukum, kami tidak bertanggung jawab atas kerugian tidak langsung atau konsekuensial, kehilangan data, keuntungan, atau bisnis, atau atas kerugian apa pun yang timbul dari penggunaan Anda atau ketidakmampuan menggunakan layanan atau dari kesalahan dalam transkrip. Tidak ada dalam ketentuan ini yang membatasi tanggung jawab yang tidak dapat dibatasi oleh hukum.',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'Untuk mentranskripsikan di perangkat Anda, browser Anda mengunduh file model ucapan dari Hugging Face (huggingface.co) dan file program mesin ucapan dari jsDelivr (cdn.jsdelivr.net), dan menyimpannya di cache-nya (Cache Storage) untuk lain kali sampai Anda menghapusnya. Penyedia tersebut menerima data permintaan yang lazim (alamat IP Anda, browser Anda, dan file mana yang diminta), tidak pernah media atau transkrip Anda.',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'Agar berfungsi di perangkat Anda, browser Anda mengunduh model ucapan dari Hugging Face dan file program dari jsDelivr; keduanya disediakan berdasarkan lisensi dan ketentuan masing-masing. Iklan disediakan oleh Google AdSense; iklan mengarah ke situs web pihak ketiga yang tidak kami kendalikan dan tidak menjadi tanggung jawab kami.',
  Transcribe: 'Transkripsikan',
  'Transcribe (same language)': 'Transkripsi (bahasa yang sama)',
  'Transcribe {n} files': 'Transkripsikan {n} file',
  'Transcribe a file': 'Transkripsikan file',
  'Transcribe or translate speech in the language you need.':
    'Transkripsikan atau terjemahkan ucapan dalam bahasa yang Anda perlukan.',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    'Transkripsikan video, file audio, dan rekaman suara dalam lebih dari 50 bahasa, atau biarkan bahasa dideteksi untuk Anda.',
  'Transcribing {n}%': 'Mentranskripsikan {n}%',
  'Transcribing takes {time} on this device.': 'Transkripsi memakan waktu {time} di perangkat ini.',
  'Transcribing…': 'Mentranskripsikan…',
  '{blurb} Not sure? Keep this one.': '{blurb} Tidak yakin? Pakai yang ini.',
  '{reason} Retrying in {n} s…': '{reason} Mencoba lagi dalam {n} dtk…',
  'Alternatives': 'Alternatif',
  'Checking the downloaded file…': 'Memeriksa file yang diunduh…',
  'Connection lost.': 'Koneksi terputus.',
  'Continued after the page reloaded.': 'Dilanjutkan setelah halaman dimuat ulang.',
  'Continuing the download ({size} already saved)': 'Melanjutkan pengunduhan ({size} sudah tersimpan)',
  'Downloaded: ready to start': 'Sudah diunduh: siap dimulai',
  'Every language in its own script: English in English letters, Hindi in Devanagari. Choose Hinglish to write Hindi in English letters.': 'Setiap bahasa dalam aksaranya sendiri: Inggris dalam huruf Latin, Hindi dalam Devanagari. Pilih Hinglish untuk menulis Hindi dalam huruf Latin.',
  'First time only: downloads {size}, now downloading in the background': 'Hanya pertama kali: mengunduh {size}, sekarang sedang diunduh di latar belakang',
  'Getting the model ready: {loaded} of {total}': 'Menyiapkan model: {loaded} dari {total}',
  'Good for most videos.': 'Cocok untuk sebagian besar video.',
  'Honest, dated comparisons with other transcription services.': 'Perbandingan jujur dan bertanggal dengan layanan transkripsi lain.',
  'Keep this page open until it is finished. If it reloads or closes, it continues where it stopped when you open the site again.': 'Biarkan halaman ini terbuka sampai selesai. Jika dimuat ulang atau ditutup, prosesnya dilanjutkan dari tempat terakhir berhenti saat Anda membuka situs lagi.',
  'Length {time}': 'Durasi {time}',
  'Opens in Word and Google Docs': 'Dibuka di Word dan Google Docs',
  'Reconnecting…': 'Menyambungkan kembali…',
  'The download server is busy (HTTP {status}).': 'Server unduhan sedang sibuk (HTTP {status}).',
  'The download stalled.': 'Pengunduhan terhenti.',
  'Time so far {time}': 'Waktu sejauh ini {time}',
  'Translated to English': 'Diterjemahkan ke bahasa Inggris',
  'Waiting for the internet connection…': 'Menunggu koneksi internet…',
  'Word document (.docx)': 'Dokumen Word (.docx)',
  'Transcribed in {time}': 'Ditranskripsikan dalam {time}',
  Transcript: 'Transkrip',
  'Transcript name': 'Nama transkrip',
  'Transcript not found': 'Transkrip tidak ditemukan',
  'Transcript ready': 'Transkrip siap',
  'Transcript style': 'Gaya transkrip',
  'Transcription failed': 'Transkripsi gagal',
  'Transcription has started. The text appears below as it is recognised.':
    'Transkripsi telah dimulai. Teks muncul di bawah saat dikenali.',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'Transkripsi telah dimulai. File Anda yang lain ada di bawah Transkrip di bagian atas halaman.',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    'Transkripsi berjalan di perangkat Anda dan menggunakan prosesor, chip grafis, memori, dan baterainya. Kami tidak menetapkan batas ukuran atau panjang file, tetapi seberapa cepat berjalan, dan seberapa besar file yang dapat ditangani browser Anda, bergantung pada perangkat Anda: file panjang di ponsel atau komputer yang lebih lambat dapat memakan waktu lama atau kehabisan memori. Transkrip dan file Anda disimpan di browser ini dan dihapus otomatis setelah {idle} tidak aktif. Lihat [Kebijakan privasi](/privacy).',
  'Transcription settings': 'Pengaturan transkripsi',
  Transcripts: 'Transkrip',
  'Transcripts {n}': 'Transkrip {n}',
  'Transcripts are only kept for the browser session that created them.':
    'Transkrip hanya disimpan selama sesi browser yang membuatnya.',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    'Transkrip dibuat secara otomatis dan akan mengandung kesalahan, terutama pada audio yang bising, aksen yang kuat, pembicara yang tumpang tindih, musik, serta nama atau istilah teknis. Selalu periksa transkrip sebelum mengandalkannya, terutama untuk keperluan hukum, medis, keuangan, atau publikasi. Layanan ini disediakan "apa adanya" dan "sebagaimana tersedia", tanpa jaminan apa pun, tersurat maupun tersirat, termasuk mengenai akurasi, kelengkapan, atau kesesuaian untuk tujuan tertentu.',
  'Translate to English': 'Terjemahkan ke bahasa Inggris',
  'Try again': 'Coba lagi',
  'Try another quality or language': 'Coba kualitas atau bahasa lain',
  'try to spread malware or anything meant to damage the service.':
    'mencoba menyebarkan malware atau apa pun yang dimaksudkan untuk merusak layanan.',
  'Trying again in a moment…': 'Mencoba lagi sebentar lagi…',
  'Trying again. This page loads by itself as soon as the server is back.':
    'Mencoba lagi. Halaman ini memuat sendiri begitu server kembali.',
  'under a minute': 'kurang dari semenit',
  'Underline unsure words': 'Garisbawahi kata yang diragukan',
  Unlimited: 'Tanpa batas',
  'Unsure: worth listening to again': 'Diragukan: sebaiknya didengarkan lagi',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'Lonjakan unggahan yang luar biasa besar mungkin diminta menunggu sebentar.',
  'Up to {minutes} per file.': 'Hingga {minutes} per file.',
  'Up to {size} and {minutes} minutes per file.': 'Hingga {size} dan {minutes} menit per file.',
  'Up to {size} and {minutes} per file.': 'Hingga {size} dan {minutes} per file.',
  'Up to {size} per file.': 'Hingga {size} per file.',
  'Updated {date}': 'Diperbarui {date}',
  'Upload complete': 'Pengunggahan selesai',
  'Upload failed': 'Pengunggahan gagal',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'Pengunggahan gagal (kesalahan server {status}). Periksa terminal yang menjalankan server untuk rinciannya.',
  'Upload failed (server error {status}). Please try again in a moment.':
    'Pengunggahan gagal (kesalahan server {status}). Silakan coba lagi sebentar lagi.',
  Uploading: 'Mengunggah',
  'Uploading…': 'Mengunggah…',
  'use a computer for this size': 'pakai komputer untuk ukuran ini',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'menggunakan skrip, bot, atau cara otomatis lain terhadap situs web atau penghitungnya, atau mengirim hitungan palsu, tanpa izin tertulis kami;',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'menggunakan layanan pada konten yang ilegal, atau yang melanggar hak orang lain;',
  'use the service to harass, harm or deceive others;':
    'menggunakan layanan untuk melecehkan, merugikan, atau menipu orang lain;',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'Biasanya sangat akurat pada ucapan yang jelas. Baris yang diragukan ditandai, jadi Anda dapat memeriksanya lebih dulu.',
  'Video and audio to text': 'Video dan audio ke teks',
  'Video or audio, several at once is fine.': 'Video atau audio, beberapa sekaligus tidak masalah.',
  'Video to text, accurately.': 'Video ke teks, dengan akurat.',
  'Video to text: transcribe a video or audio file':
    'Video ke teks: transkripsikan file video atau audio',
  'video transcribed': 'video ditranskripsikan',
  'videos transcribed': 'video ditranskripsikan',
  'Vocabulary hint': 'Petunjuk kosakata',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'Catatan suara, rapat, kuliah, podcast, dan wawancara.',
  'Waiting for microphone permission…': 'Menunggu izin mikrofon…',
  'Waiting for the first words…': 'Menunggu kata-kata pertama…',
  'Waiting in line…': 'Menunggu dalam antrean…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'Lihat teks muncul langsung, perbaiki kesalahan apa pun, lalu unduh sebagai SRT, VTT, TXT, Markdown, JSON, atau PDF.',
  'We do not ask for your name, e-mail address or any other account details.':
    'Kami tidak meminta nama, alamat email, atau detail akun Anda yang lain.',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'Kami tidak menjanjikan bahwa layanan akan selalu tersedia, tanpa gangguan, atau bebas kesalahan. Situs web, atau unduhan yang dibutuhkannya (model ucapan dari Hugging Face dan file program dari jsDelivr), mungkin tidak tersedia karena pemeliharaan atau alasan di luar kendali kami, dan beberapa browser atau perangkat tidak dapat menjalankan setiap model. Karena transkrip Anda hanya disimpan di browser ini dan dihapus setelah tidak aktif, selalu ekspor yang Anda perlukan.',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'Kami tidak menjual data Anda. Kami tidak menyimpan file atau transkrip Anda, jadi tidak ada yang dapat dibagikan: pengenalan berjalan di perangkat Anda, bukan di layanan transkripsi atau AI eksternal. Google (iklan), Cloudflare (hosting dan penghitung), Hugging Face dan jsDelivr (unduhan) hanya menerima apa yang dijelaskan di atas. Kami dapat mengungkapkan informasi jika hukum mensyaratkannya.',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    'Kami tidak menyimpan apa pun milik Anda di pihak kami: selain total berjalan tunggal, tidak ada hal tentang penggunaan Anda yang kami simpan.',
  'We may block access if these rules are broken.':
    'Kami dapat memblokir akses jika aturan ini dilanggar.',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'Kami dapat memperbarui ketentuan ini. Versi baru muncul di halaman ini dengan tanggal "Terakhir diperbarui" yang baru, dan berlaku sejak saat itu.',
  'We never send your file, your transcript or any personal information to Google.':
    'Kami tidak pernah mengirim file Anda, transkrip Anda, atau informasi pribadi apa pun ke Google.',
  'Web subtitles (.vtt)': 'Subtitle web (.vtt)',
  'What people use it for': 'Untuk apa orang menggunakannya',
  'What you can do with it': 'Apa yang dapat Anda lakukan dengannya',
  'What you get': 'Yang Anda dapatkan',
  'what you were doing, and what happened instead of what you expected;':
    'apa yang sedang Anda lakukan, dan apa yang terjadi alih-alih apa yang Anda harapkan;',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'Di mana file Anda diproses tergantung pada cara {brand} dijalankan, dan server tidak menjawab tadi. Lihat [Kebijakan privasi](/privacy).',
  'Where your files are processed depends on how {brand} is run.':
    'Di mana file Anda diproses tergantung pada cara {brand} dijalankan.',
  'Which files can I use, and what are the limits?':
    'File apa yang dapat saya gunakan, dan apa batasannya?',
  'Which languages are supported?': 'Bahasa apa yang didukung?',
  'Who builds it': 'Siapa yang membuatnya',
  'Who runs this website': 'Siapa yang menjalankan situs web ini',
  'Why it exists': 'Mengapa ini ada',
  'Working…': 'Bekerja…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'Ya. Gratis, dan tidak ada akun atau login, selamanya. Tidak ada kuota harian atau bulanan dan tidak ada paywall; iklan membuat situs web ini tetap gratis.',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'Ya. Gratis, dan tidak ada akun atau login, selamanya. Tidak ada kuota harian atau bulanan dan tidak ada paywall.',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'Ya. Gratis, dan tidak ada yang perlu didaftarkan dan tidak ada login. Salinan ini berjalan di komputer Anda sendiri, jadi tidak ada kuota dan tidak ada paywall; seberapa cepat ia bekerja bergantung pada komputer Anda.',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'Ya. Gunakan pensil di samping baris untuk mengubah teksnya atau menghapus baris, atau cari dan ganti di seluruh transkrip. Suntingan Anda disertakan dalam setiap ekspor.',
  'You agree not to:': 'Anda setuju untuk tidak:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'Anda yang berkuasa: hapus transkrip, file, dan, jika mau, model ucapan yang diunduh kapan saja dengan **Hapus data saya sekarang**. Ini hanya menghapus data di browser ini; tidak dapat menghapus cookie Google.',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'Anda dapat mengubahnya kapan saja dengan **Pengaturan privasi dan cookie** di bagian bawah halaman mana pun yang menampilkan iklan (misalnya beranda).',
  'You can now read, fix and download it.':
    'Sekarang Anda dapat membaca, memperbaiki, dan mengunduhnya.',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'Anda dapat berhenti menggunakan layanan kapan saja dan menghapus data di browser ini dengan **Hapus data saya sekarang**. Kami dapat menangguhkan atau mengakhiri akses Anda kapan saja, terutama jika Anda melanggar ketentuan ini.',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'Anda mempertahankan semua hak atas file yang Anda tambahkan dan transkrip yang dibuat darinya. File dan transkrip diproses di perangkat Anda dan kami tidak pernah menerimanya. Anda bertanggung jawab atas apa yang Anda transkripsikan: gunakan hanya konten yang Anda miliki atau berhak Anda proses, termasuk izin apa pun yang diperlukan dari orang yang berbicara di dalamnya.',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'Anda dapat menolak iklan yang dipersonalisasi dengan mengunjungi [Pengaturan Iklan Google](https://adssettings.google.com), atau menolak penggunaan cookie oleh sebagian vendor pihak ketiga untuk iklan yang dipersonalisasi di [www.aboutads.info](https://www.aboutads.info). Pelajari [bagaimana Google menggunakan informasi dari situs yang menggunakan layanannya](https://policies.google.com/technologies/partner-sites).',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'browser Anda dan versinya, serta perangkat Anda (komputer atau ponsel, dan sistem operasinya);',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'Browser Anda memblokir penyalinan di sini. Gunakan Ekspor untuk menyimpan teksnya.',
  'Your change is saved.': 'Perubahan Anda tersimpan.',
  'Your change is still in its box: press Save to try again.':
    'Perubahan Anda masih ada di kotaknya: tekan Simpan untuk mencoba lagi.',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'File Anda dikirim ke server melalui koneksi terenkripsi, ditranskripsikan dengan model pengenalan ucapan terbuka seperti OpenAI Whisper, lalu dihapus otomatis setelahnya. Halaman [Cara kerja](/how-it-works) menjelaskan setiap langkah.',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'File Anda ditranskripsikan di browser pada perangkat Anda sendiri, jadi kami tidak menetapkan batas ukuran atau panjang. File yang sangat besar atau panjang juga bisa: butuh waktu lebih lama dan memori kosong yang cukup, dan halaman memperingatkan Anda ketika perangkat Anda mungkin lambat.',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'File Anda ditranskripsikan dengan model pengenalan ucapan terbuka seperti OpenAI Whisper dan dihapus otomatis setelahnya.',
  'Your file never leaves your device.': 'File Anda tidak pernah meninggalkan perangkat Anda.',
  'Your file never leaves your device. [Privacy](/privacy)':
    'File Anda tidak pernah meninggalkan perangkat Anda. [Privasi](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'File Anda tidak pernah meninggalkan perangkat Anda. File ditranskripsikan di browser Anda pada perangkat ini dan tidak pernah diunggah ke kami atau siapa pun. Transkrip, suntingan Anda, dan file hanya disimpan di penyimpanan browser ini dan dihapus otomatis setelah {idle} tidak aktif, atau segera saat Anda menekan **Hapus data saya sekarang** di menu Transkrip. Tidak ada akun. Ekspor yang Anda perlukan sebelum pergi.',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'File Anda tidak pernah meninggalkan perangkat Anda. File ditranskripsikan langsung di browser Anda, tanpa akun, dan transkrip Anda tetap berada di browser ini.',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'File Anda tetap berada di perangkat ini. Biarkan tab ini terbuka selama proses transkripsi.',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'File dan transkrip Anda hanya disimpan selama sesi ini dan dihapus otomatis setelah {idle} tidak aktif, atau saat Anda menekan "Hapus data saya sekarang". Tanpa akun, tanpa pelacakan, satu cookie sesi penting. Ekspor yang Anda perlukan sebelum pergi.',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'File dan transkrip Anda hanya disimpan selama sesi ini dan dihapus otomatis saat sesi berakhir, atau saat Anda menekan "Hapus data saya sekarang". Tanpa akun, tanpa pelacakan, satu cookie sesi penting. Ekspor yang Anda perlukan sebelum pergi.',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'File Anda dihapus otomatis. [Privasi](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'File Anda diproses di browser Anda dan tetap berada di perangkat Anda. Situs web, unduhan, dan penghitung menggunakan koneksi terenkripsi (HTTPS). Siapa pun yang dapat menggunakan profil browser ini dapat melihat transkrip yang tersimpan di dalamnya sampai dihapus, jadi tekan **Hapus data saya sekarang** di komputer bersama.',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'File Anda diunggah ke server kami agar dapat diproses di sana. File hanya disimpan selama sesi Anda dan dihapus otomatis saat sesi berakhir, setelah {idle} tidak aktif, atau segera saat Anda menekan **Hapus data saya sekarang** di menu Transkrip. Tidak ada akun dan tidak ada pelacakan, dan satu-satunya cookie adalah satu cookie sesi penting (tidak ada cookie analitik atau iklan).',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'File Anda diunggah ke server kami agar dapat diproses di sana. File hanya disimpan selama sesi Anda dan dihapus otomatis saat sesi berakhir, atau segera saat Anda menekan **Hapus data saya sekarang** di menu Transkrip. Tidak ada akun dan tidak ada pelacakan, dan satu-satunya cookie adalah satu cookie sesi penting (tidak ada cookie analitik atau iklan).',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'File Anda tidak pernah meninggalkan perangkat ini. Transkrip hanya disimpan di browser ini dan dihapus otomatis setelah {idle} tidak aktif, atau saat Anda menekan "Hapus data saya sekarang". Ekspor yang Anda perlukan sebelum pergi.',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'File Anda tidak pernah meninggalkan perangkat ini. Transkrip hanya disimpan di browser ini dan dihapus otomatis saat sesi berakhir, atau saat Anda menekan "Hapus data saya sekarang". Ekspor yang Anda perlukan sebelum pergi.',
  'Your session ends in {mins} min. Export what you need.':
    'Sesi Anda berakhir dalam {mins} mnt. Ekspor yang Anda perlukan.',
  'Your session has ended': 'Sesi Anda telah berakhir',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'Sesi Anda telah berakhir dan datanya dihapus. Anda dapat memulai transkripsi baru.',
  'Your transcript is ready below.': 'Transkrip Anda siap di bawah.',
  'Your transcripts': 'Transkrip Anda',
  'Your transcripts and files were removed from the server.':
    'Transkrip dan file Anda telah dihapus dari server.',
  'Your transcripts and files were removed from this device.':
    'Transkrip dan file Anda telah dihapus dari perangkat ini.',

  // page titles, descriptions and link labels (the key is title:/description:/label: + the English path)
  'title:/': 'Video ke Teks & Audio ke Teks Gratis',
  'description:/':
    'Ubah video dan audio ke teks gratis tanpa login. Transkripsi berpenanda waktu dalam 50+ bahasa, tanpa batas harian. Ekspor SRT, VTT, TXT, atau PDF.',
  'title:/about': 'Tentang TranscribeVid',
  'description:/about':
    'Siapa yang membuat TranscribeVid dan mengapa: alat video dan audio ke teks gratis tanpa pendaftaran dan tanpa login, dengan antarmuka bersih, didanai iklan.',
  'title:/audio-to-text': 'Audio ke Teks Gratis dan Tanpa Batas',
  'description:/audio-to-text':
    'Ubah podcast, wawancara, dan kuliah menjadi teks. Konverter audio ke teks gratis dengan penanda waktu, 50+ bahasa, tanpa login. Unduh TXT, SRT, VTT, atau PDF.',
  'label:/audio-to-text': 'Audio ke teks',
  'title:/contact': 'Hubungi TranscribeVid',
  'description:/contact':
    'Cara menghubungi TranscribeVid: email untuk pertanyaan, laporan bug, ide fitur, dan permintaan privasi, serta siapa yang menjalankan situs web ini.',
  'title:/faq': 'Pertanyaan yang Sering Diajukan (FAQ)',
  'description:/faq':
    'Jawaban atas pertanyaan umum tentang TranscribeVid: akurasi, bahasa, file yang didukung dan batasnya, kecepatan, privasi, serta penyuntingan transkrip.',
  'title:/guides': 'Panduan Transkrip dan Subtitle',
  'description:/guides':
    'Panduan praktis tentang transkrip dan subtitle: SRT atau VTT, cara menambahkan subtitle ke video, cara mendapatkan transkrip akurat, dan transkripsi privat.',
  'title:/guides/accurate-transcripts': 'Cara Mendapatkan Transkrip Lebih Akurat',
  'description:/guides/accurate-transcripts':
    'Cara meningkatkan akurasi suara ke teks: audio lebih bersih, bahasa dan model yang tepat, petunjuk kosakata, serta cara memeriksa dan memperbaiki hasilnya.',
  'label:/guides/accurate-transcripts': 'Cara mendapatkan transkrip yang lebih akurat',
  'title:/guides/how-to-add-subtitles-to-a-video': 'Cara Menambahkan Subtitle ke Video',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'Buat subtitle dalam empat langkah: transkripsikan video, perbaiki teks, ekspor SRT atau VTT, lalu tambahkan file ke YouTube, VLC, editor, atau pemutar web Anda.',
  'label:/guides/how-to-add-subtitles-to-a-video': 'Cara menambahkan subtitle ke video',
  'title:/guides/srt-vs-vtt': 'SRT vs VTT: Format Subtitle Mana?',
  'description:/guides/srt-vs-vtt':
    'SRT atau VTT? Apa itu format subtitle tersebut, apa bedanya, di mana masing-masing berfungsi, dan cara mendapatkan keduanya dari video Anda secara gratis.',
  'label:/guides/srt-vs-vtt': 'SRT vs VTT',
  'title:/guides/transcribe-video-without-uploading': 'Transkripsi Video Tanpa Mengunggahnya',
  'description:/guides/transcribe-video-without-uploading':
    'Cara kerja transkripsi di browser, apa yang tetap di perangkat Anda, apa yang diunduh sekali, dan cara memeriksanya sendiri di panel jaringan browser Anda.',
  'label:/guides/transcribe-video-without-uploading': 'Transkripsi video tanpa mengunggahnya',
  'title:/guides/what-is-whisper': 'Apa Itu Whisper? Suara ke Teks Dijelaskan',
  'description:/guides/what-is-whisper':
    'Apa itu OpenAI Whisper, dilatih dengan apa, seberapa akurat dan di mana kesulitannya, serta cara kerjanya di dalam browser Anda di TranscribeVid.',
  'label:/guides/what-is-whisper': 'Apa itu Whisper?',
  'title:/how-it-works': 'Cara Kerja Video ke Teks',
  'description:/how-it-works':
    'Cara TranscribeVid mengubah video dan audio menjadi teks akurat berpenanda waktu dalam tiga langkah, apa yang Anda dapatkan, dan tips untuk hasil terbaik.',
  'title:/interview-transcription': 'Transkripsi Wawancara: Privat & Gratis',
  'description:/interview-transcription':
    'Transkripsikan wawancara secara gratis tanpa membuat akun. Teks berpenanda waktu dalam 50+ bahasa, untuk riset, jurnalisme, dan rekrutmen. Unduh TXT atau PDF.',
  'label:/interview-transcription': 'Transkripsi wawancara',
  'title:/lecture-to-text': 'Kuliah ke Teks: Transkrip Kuliah Gratis',
  'description:/lecture-to-text':
    'Ubah rekaman kuliah menjadi catatan teks yang bisa dicari dan dipelajari. Gratis, tanpa login, 50+ bahasa, penanda waktu. Unduh TXT, Markdown, SRT, atau PDF.',
  'label:/lecture-to-text': 'Kuliah ke teks',
  'title:/m4a-to-text': 'M4A ke Teks: Transkripsi Memo Suara Gratis',
  'description:/m4a-to-text':
    'Ubah memo suara atau rekaman M4A ke teks secara gratis. Cocok untuk Memo Suara iPhone, tanpa login, 50+ bahasa, penanda waktu. Unduh TXT, SRT, VTT, atau PDF.',
  'label:/m4a-to-text': 'M4A ke teks',
  'title:/meeting-recording-to-text': 'Rekaman Zoom, Teams & Meet ke Teks',
  'description:/meeting-recording-to-text':
    'Ubah rekaman Zoom, Teams, atau Google Meet jadi transkrip berpenanda waktu yang bisa dicari. Gratis, tanpa login, 50+ bahasa. Unduh TXT, SRT, VTT, atau PDF.',
  'label:/meeting-recording-to-text': 'Rekaman rapat ke teks',
  'title:/mov-to-text': 'MOV ke Teks: Transkripsi Video iPhone',
  'description:/mov-to-text':
    'Transkripsikan video MOV dari iPhone atau QuickTime secara gratis. Tanpa login, 50+ bahasa, penanda waktu di setiap baris. Unduh TXT, SRT, VTT, atau PDF.',
  'label:/mov-to-text': 'MOV ke teks',
  'title:/mp3-to-text': 'MP3 ke Teks Online: Transkrip Gratis',
  'description:/mp3-to-text':
    'Transkripsikan MP3 ke teks online secara gratis. Tanpa login, 50+ bahasa, penanda waktu di setiap baris. Sunting teksnya dan unduh TXT, SRT, VTT, atau PDF.',
  'label:/mp3-to-text': 'MP3 ke teks',
  'title:/mp4-to-text': 'MP4 ke Teks: Transkripsi Video MP4 Gratis',
  'description:/mp4-to-text':
    'Ubah video MP4 ke teks dengan penanda waktu. Gratis, tanpa login, tanpa batas harian, 50+ bahasa. Unduh TXT, SRT, VTT, Markdown, JSON, atau PDF.',
  'label:/mp4-to-text': 'MP4 ke teks',
  'title:/podcast-transcript-generator': 'Pembuat Transkrip Podcast Gratis',
  'description:/podcast-transcript-generator':
    'Buat transkrip podcast dari MP3 atau WAV secara gratis. Penanda waktu, 50+ bahasa, tanpa login. Sunting, lalu unduh TXT, Markdown, SRT, VTT, atau PDF.',
  'label:/podcast-transcript-generator': 'Pembuat transkrip podcast',
  'title:/privacy': 'Kebijakan Privasi',
  'description:/privacy':
    'Apa yang diproses TranscribeVid saat Anda mentranskripsikan file, di mana dan mengapa, berapa lama disimpan, cookie, iklan, penyimpanan browser, dan hak Anda.',
  'title:/srt-subtitle-generator': 'Pembuat Subtitle SRT dari Video, Gratis',
  'description:/srt-subtitle-generator':
    'Buat file subtitle SRT dari video atau audio apa pun secara gratis. Sesuai ucapan, 50+ bahasa, tanpa login. Sunting barisnya, lalu unduh SRT atau VTT.',
  'label:/srt-subtitle-generator': 'Pembuat subtitle SRT',
  'title:/terms': 'Ketentuan Penggunaan',
  'description:/terms':
    'Aturan penggunaan TranscribeVid: layanan gratis, konten Anda, penggunaan yang dapat diterima, batas file, tanpa jaminan akurasi transkrip, dan tanggung jawab.',
  'title:/tools': 'Semua Alat Audio & Video ke Teks',
  'description:/tools':
    'Semua alat gratis untuk mengubah video dan audio ke teks dalam satu daftar: menurut jenis file, penggunaan, file subtitle, dan bahasa. Tanpa login, 50+ bahasa.',
  'title:/translate-audio-to-english': 'Terjemahkan Ucapan ke Teks Inggris, Gratis',
  'description:/translate-audio-to-english':
    'Ubah ucapan dalam bahasa lain menjadi teks Inggris secara gratis. Unggah video atau audio, dapatkan teks atau subtitle Inggris berpenanda waktu. Tanpa login.',
  'label:/translate-audio-to-english': 'Terjemahkan ucapan ke bahasa Inggris',
  'title:/video-to-text': 'Video ke Teks Gratis, Tanpa Login',
  'description:/video-to-text':
    'Ubah video ke teks gratis. Dapatkan transkrip akurat berpenanda waktu dalam 50+ bahasa, tanpa login dan tanpa batas harian. Unduh SRT, VTT, TXT, atau PDF.',
  'label:/video-to-text': 'Video ke teks',
  'title:/voice-recording-to-text': 'Rekaman Suara ke Teks: Gratis',
  'description:/voice-recording-to-text':
    'Rekam suara Anda di browser atau unggah memo suara dan dapatkan teksnya. Gratis, tanpa login, 50+ bahasa. Unduh TXT, PDF, SRT, atau Markdown.',
  'label:/voice-recording-to-text': 'Rekaman suara ke teks',
  'title:/vtt-subtitle-generator': 'Pembuat Subtitle VTT (WebVTT) Gratis',
  'description:/vtt-subtitle-generator':
    'Buat file subtitle WebVTT (.vtt) dari video atau audio apa pun secara gratis. Sesuai ucapan, 50+ bahasa, tanpa login. Sunting barisnya, lalu unduh VTT.',
  'label:/vtt-subtitle-generator': 'Pembuat subtitle VTT',
  'title:/wav-to-text': 'WAV ke Teks: Transkripsi Online Gratis',
  'description:/wav-to-text':
    'Ubah file WAV ke teks secara gratis. Mampu menangani rekaman panjang dari perekam lapangan dan panggilan, 50+ bahasa, penanda waktu. Unduh TXT, SRT, atau PDF.',
  'label:/wav-to-text': 'WAV ke teks',
  'title:/webm-to-text': 'WebM ke Teks: Transkripsi Gratis',
  'description:/webm-to-text':
    'Ubah file video atau audio WebM ke teks secara gratis. Cocok untuk rekaman layar dan browser, 50+ bahasa, penanda waktu. Unduh TXT, SRT, VTT, atau PDF.',
  'label:/webm-to-text': 'WebM ke teks',
  'title:/whatsapp-voice-message-to-text': 'Pesan Suara WhatsApp ke Teks, Gratis',
  'description:/whatsapp-voice-message-to-text':
    'Ubah pesan suara WhatsApp ke teks secara gratis. Simpan pesan suaranya, letakkan di sini, dan baca dalam 50+ bahasa termasuk Hindi. Tanpa login, tanpa akun.',
  'label:/whatsapp-voice-message-to-text': 'Pesan suara WhatsApp ke teks',
  'title:/youtube-subtitle-generator': 'Pembuat Subtitle YouTube: File SRT Gratis',
  'description:/youtube-subtitle-generator':
    'Buat file subtitle SRT untuk video YouTube Anda sendiri, gratis dan tanpa login. Sesuai ucapan, 50+ bahasa. Unggah di YouTube Studio.',
  'label:/youtube-subtitle-generator': 'Pembuat subtitle YouTube',
  'an independent software developer': 'pengembang perangkat lunak independen',
  'Bengaluru, India': 'Bengaluru, India',
  'This page was translated with AI. [Found a mistake? Tell us.](/contact)':
    'Halaman ini diterjemahkan dengan AI. [Menemukan kesalahan? Beri tahu kami.](/contact)',
};

export default dict;
