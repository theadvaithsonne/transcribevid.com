import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Pembuat subtitle VTT',
  h1: 'Buat file subtitle WebVTT (.vtt) dari video',
  lead: 'Tambahkan file video atau audio dan unduh file subtitle WebVTT yang waktunya disesuaikan dengan ucapan. Gratis, tanpa login, dan Anda bisa memperbaiki barisnya sebelum mengekspor. Pakai bersama elemen video HTML5 atau pemutar web apa pun.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Apa itu WebVTT, dan mengapa web memakainya',
  why: [
    'WebVTT (.vtt) adalah format subtitle untuk web. File ini berupa teks biasa yang dipahami browser secara bawaan: arahkan elemen track pada video ke file .vtt dan keterangan akan muncul, tanpa plugin dan tanpa skrip.',
    'Bentuknya mirip SRT, dengan beberapa perbedaan yang penting. File VTT diawali dengan kata WEBVTT, memakai titik, bukan koma, sebelum milidetik, dan tidak membutuhkan cue bernomor. Sebagian besar pemutar web membacanya. Jika Anda tidak yakin format mana yang Anda butuhkan, panduan tentang SRT dan VTT menjelaskan pilihannya.',
  ],

  sections: [
    {
      title: 'Cara memakai file VTT di halaman web Anda',
      paragraphs: [
        'Simpan file .vtt di samping video Anda, lalu tambahkan elemen track di dalam elemen video, misalnya: <track kind="subtitles" src="captions.vtt" srclang="en" label="English" default>. Atributnya berfungsi sebagai berikut.',
      ],
      bullets: [
        {
          title: 'kind.',
          text: 'Pakai subtitles untuk kata-kata yang diucapkan. Pakai captions jika file juga menjelaskan bunyi lain, seperti musik atau tawa.',
        },
        {
          title: 'srclang.',
          text: 'Bahasa file dalam kode singkat, misalnya en untuk bahasa Inggris atau id untuk bahasa Indonesia. Tambahkan satu elemen track untuk setiap bahasa yang Anda miliki.',
        },
        {
          title: 'label dan default.',
          text: 'label adalah nama yang ditampilkan di menu keterangan pada pemutar. default mengaktifkan jalur itu saat halaman dimuat.',
        },
      ],
    },
    {
      title: 'Mengapa keterangan tidak muncul: penyebab yang umum',
      paragraphs: [
        'Simpan file .vtt di situs yang sama dengan halamannya. File di domain lain membutuhkan header lintas asal yang tepat dari servernya, dan elemen video membutuhkan atribut crossorigin, atau browser akan mengabaikannya tanpa pemberitahuan. Periksa juga bahwa baris pertama file berbunyi WEBVTT, dan bahwa keterangan sudah dinyalakan di kontrol pemutar.',
      ],
    },
    {
      title: 'Apa yang dilakukan dan tidak dilakukan pembuat ini',
      paragraphs: [
        'Pembuat ini mengubah ucapan dalam video Anda menjadi teks berwaktu. Baris dipotong pada akhir kalimat dan jeda, dalam baris sekitar 42 karakter dengan paling banyak dua baris, dan file hanya berisi teks berwaktu. Pembuat ini tidak menerjemahkan ke bahasa lain (kecuali bahasa Inggris, lewat Output di Opsi lainnya), tidak menambahkan nama pembicara, tidak membuat gaya atau penanda bab, dan tidak menanamkan subtitle ke dalam gambar. WebVTT sendiri mendukung gaya dan bab, dan Anda bisa menambahkannya secara manual di editor teks.',
      ],
    },
  ],

  howTitle: 'Cara membuat file subtitle VTT',
  howToDescription:
    'Tambahkan video, pilih bahasanya, periksa barisnya, lalu unduh subtitle sebagai file WebVTT.',
  steps: [
    {
      title: 'Tambahkan video Anda',
      text: 'Masukkan satu video ke kotak pada bagian atas halaman ini: letakkan di sana atau tekan Pilih file. File yang hanya berisi suara juga bisa, jika teks berwaktu adalah satu-satunya kebutuhan Anda. Di halaman berikutnya, Tambah file lain memasukkan yang lainnya.',
    },
    {
      title: 'Pilih bahasanya',
      text: 'Di halaman berikutnya, pilih bahasa yang diucapkan, atau biarkan Deteksi otomatis aktif. Biarkan Waktu per kata tetap aktif di Opsi lainnya: awal dan akhir setiap baris lalu mengikuti kata-katanya. Lalu tekan Transkripsikan.',
    },
    {
      title: 'Periksa barisnya',
      text: 'Baca transkrip dari awal sampai akhir, putar dari penanda waktu untuk memeriksanya, dan perbaiki kata yang salah. Hapus baris yang tidak Anda inginkan di subtitle.',
    },
    {
      title: 'Unduh VTT',
      text: 'Pilih VTT dari opsi unduhan. Hasil suntingan Anda sudah termasuk. SRT tersedia dari transkrip yang sama jika sebuah pemutar membutuhkannya.',
    },
  ],

  formatsTitle: 'Format VTT dan file yang didukung',
  formatsIntro: 'Tambahkan file video atau audio apa pun dan unduh WebVTT. Beginilah isi file VTT:',
  uploadTitle: 'File yang bisa Anda tambahkan',
  accepts: ['MP4', 'WEBM', 'MOV', 'MKV', 'M4V', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'VTT', use: 'WebVTT untuk elemen video HTML5 dan pemutar web' },
    { name: 'SRT', use: 'cue bernomor, untuk sebagian besar pemutar dan aplikasi penyunting' },
    { name: 'TXT', use: 'kata-kata yang sama tanpa waktu' },
    { name: 'Markdown', use: 'teks dengan penanda waktu' },
    { name: 'JSON', use: 'setiap baris dan waktunya, untuk program' },
    { name: 'PDF', use: 'naskah yang siap dicetak' },
  ],
  exampleLabel: 'Contoh file WebVTT',
  example: `WEBVTT

00:00:00.800 --> 00:00:03.600
Selamat pagi semuanya, dan selamat datang.

00:00:04.000 --> 00:00:07.300
Di video ini kita menyiapkan proyek dari nol.

00:00:07.700 --> 00:00:10.900
Mari kita mulai dari struktur folder.`,

  tipsTitle: 'Tips untuk file WebVTT',
  tips: [
    {
      title: 'Uji di browser sungguhan.',
      text: 'Buka halaman Anda, tekan putar, dan nyalakan keterangan di kontrol video. Lakukan ini di lebih dari satu browser sebelum Anda menerbitkan.',
    },
    {
      title: 'Pakai kode bahasa yang benar.',
      text: 'Atur srclang ke kode yang valid seperti en, id, atau hi. Kode yang salah bisa membuat pemutar memberi label atau memilih jalur dengan keliru.',
    },
    {
      title: 'Baca barisnya dengan kecepatan sebenarnya.',
      text: 'Putar video dengan suara dimatikan dan keterangan menyala, lalu periksa apakah setiap baris bertahan di layar cukup lama untuk dibaca.',
    },
    {
      title: 'Eja nama sesuai keinginan Anda.',
      text: 'Masukkan nama merek dan istilah teknis ke petunjuk kosakata di Opsi lainnya sebelum Anda mulai, agar benar di setiap baris.',
    },
  ],

  faqs: [
    {
      question: 'Apa bedanya file VTT dengan file SRT?',
      answer:
        'File VTT diawali dengan baris WEBVTT, menulis waktu dengan titik (00:00:01.000) sedangkan SRT memakai koma (00:00:01,000), dan tidak membutuhkan nomor cue. Browser membaca VTT pada elemen video, sedangkan SRT membutuhkan pemutar atau skrip yang mendukungnya.',
    },
    {
      question: 'Bagaimana cara menambahkan file VTT ke video HTML?',
      answer:
        'Simpan file .vtt di samping video dan tambahkan elemen track di dalam elemen video, dengan kind diatur ke subtitles, src mengarah ke file, srclang diatur ke kode bahasa, dan label untuk menu.',
    },
    {
      question: 'Pemutar mana yang membaca file VTT?',
      answer:
        'Semua browser utama membaca VTT lewat elemen video, dan sebagian besar pemutar video web juga membacanya. Beberapa pemutar dan aplikasi penyunting di desktop lebih menyukai SRT. Untuk itu, unduh SRT dari transkrip yang sama.',
    },
    {
      question: 'Bisakah file VTT memuat bab atau gaya?',
      answer:
        'File yang dibuat TranscribeVid hanya berisi teks berwaktu. WebVTT sendiri mendukung gaya dan bab, yang bisa Anda tambahkan secara manual di editor teks.',
    },
    {
      question: 'Mengapa file VTT saya tidak muncul di pemutar?',
      answer:
        'Penyebab yang umum adalah baris pertama yang bukan WEBVTT, file di domain lain tanpa header lintas asal yang tepat, srclang atau kind yang salah, atau keterangan yang dimatikan di pemutar. Buka file di editor teks dan periksa baris pertamanya.',
    },
  ],

  links: [
    {
      label: 'Pembuat subtitle SRT',
      path: '/srt-subtitle-generator',
      note: 'Transkrip yang sama sebagai file SRT bernomor, lengkap dengan contoh.',
    },
    {
      label: 'SRT vs VTT: format subtitle mana yang dipakai',
      path: '/guides/srt-vs-vtt',
      note: 'Perbandingan berdampingan kedua format dan tempat masing-masing bekerja.',
    },
    {
      label: 'Cara menambahkan subtitle ke video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Dari transkrip sampai keterangan yang terbit, untuk web maupun pemutar lain.',
    },
    {
      label: 'WebM ke teks',
      path: '/webm-to-text',
      note: 'Untuk rekaman layar dan browser, format yang paling cocok dengan file VTT.',
    },
  ],
};
