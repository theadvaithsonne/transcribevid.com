import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Pembuat subtitle SRT',
  h1: 'Buat subtitle SRT dari file video atau audio',
  lead: 'Unggah video dan unduh file .srt siap pakai dengan setiap baris disesuaikan waktunya dengan ucapan. Gratis, tanpa login, dan Anda bisa memperbaiki teksnya sebelum mengekspor.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Apa isi file SRT',
  why: [
    'File SRT adalah teks biasa. Isinya daftar cue bernomor, masing-masing dengan waktu mulai, waktu selesai, dan kata-kata yang ditampilkan di layar. Sebagian besar pemutar video, aplikasi penyunting, dan platform video bisa memuatnya, sehingga SRT menjadi format subtitle yang paling aman untuk memulai.',
    'Subtitle membantu penonton yang tuli atau kesulitan mendengar, orang yang menonton tanpa suara, dan siapa pun yang lebih mudah mengikuti bahasa kedua lewat tulisan. Subtitle juga membuat ucapan dalam video Anda bisa dicari dan dikutip.',
  ],

  howTitle: 'Cara membuat file SRT',
  howToDescription:
    'Unggah video, pilih bahasanya, periksa barisnya, lalu unduh subtitle sebagai file SRT atau VTT.',
  steps: [
    {
      title: 'Unggah videonya',
      text: 'Letakkan video Anda di kotak pada bagian atas halaman ini, atau tekan Pilih file. File audio juga bisa jika Anda hanya membutuhkan teks berwaktu.',
    },
    {
      title: 'Pilih bahasanya',
      text: 'Pilih bahasa yang diucapkan. Waktu per kata aktif secara bawaan, yang menghasilkan penyesuaian waktu subtitle yang lebih rapat.',
    },
    {
      title: 'Periksa barisnya',
      text: 'Buka transkrip, putar dari penanda waktu mana pun, dan perbaiki kata yang salah. Hapus baris yang tidak Anda inginkan.',
    },
    {
      title: 'Unduh SRT atau VTT',
      text: 'Pilih SRT untuk sebagian besar pemutar dan aplikasi penyunting, atau VTT untuk halaman web. Keduanya sudah memuat hasil suntingan Anda.',
    },
  ],

  formatsTitle: 'Format subtitle dan file yang didukung',
  formatsIntro:
    'Unggah file video atau audio apa pun dan unduh subtitle sebagai SRT atau VTT. Beginilah isi file SRT:',
  uploadTitle: 'File yang bisa Anda unggah',
  accepts: ['MP4', 'MKV', 'MOV', 'WEBM', 'AVI', 'MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'SRT', use: 'cue bernomor dengan waktu, dukungan terluas' },
    { name: 'VTT', use: 'WebVTT untuk video HTML5 dan pemutar web' },
    { name: 'TXT', use: 'kata-kata yang sama tanpa waktu' },
    { name: 'Markdown', use: 'teks dengan penanda waktu' },
    { name: 'JSON', use: 'setiap baris dan waktunya, untuk program' },
    { name: 'PDF', use: 'naskah yang siap dicetak' },
  ],
  exampleLabel: 'Contoh file SRT',
  example: `1
00:00:01,000 --> 00:00:04,200
Selamat datang kembali di kanal ini.

2
00:00:04,500 --> 00:00:07,800
Hari ini kita akan melihat cara kerja subtitle.`,

  tipsTitle: 'Tips untuk subtitle yang lebih baik',
  tips: [
    {
      title: 'Jaga agar baris tetap pendek.',
      text: 'Pedoman yang umum adalah dua baris dengan sekitar 42 karakter. Baris mengikuti ucapan, jadi baris yang sangat panjang mungkin perlu dipecah di aplikasi penyunting subtitle.',
    },
    {
      title: 'Tonton sebelum menerbitkan.',
      text: 'Putar video dengan subtitle menyala. Subtitle otomatis perlu diperiksa manusia, terutama untuk nama, angka, dan istilah khusus.',
    },
    {
      title: 'Gunakan petunjuk kosakata.',
      text: 'Tuliskan nama dan istilah teknis di Opsi lainnya agar ejaannya sesuai keinginan Anda.',
    },
    {
      title: 'Pilih format yang tepat.',
      text: 'SRT untuk pemutar, aplikasi penyunting, dan sebagian besar formulir unggah. VTT untuk tag video HTML5 dan pemutar web.',
    },
    {
      title: 'Butuh subtitle bahasa Inggris?',
      text: 'Atur Output ke Terjemahkan ke bahasa Inggris di Opsi lainnya. Terjemahannya otomatis, jadi bacalah sampai selesai sebelum Anda menerbitkannya.',
    },
  ],

  faqs: [
    {
      question: 'Apa itu file SRT?',
      answer:
        'SubRip (.srt) adalah format subtitle berupa teks biasa. Setiap cue memiliki nomor, waktu mulai dan selesai, serta teks yang ditampilkan. Editor teks apa pun bisa membukanya.',
    },
    {
      question: 'Sebaiknya saya memilih SRT atau VTT?',
      answer:
        'Gunakan SRT untuk pemutar video, aplikasi penyunting, dan sebagian besar formulir unggah. Gunakan VTT (WebVTT) saat Anda menambahkan subtitle ke halaman web dengan elemen video HTML5. TranscribeVid mengekspor keduanya dari transkrip yang sama.',
    },
    {
      question: 'Apakah subtitle ditanamkan ke dalam video saya?',
      answer:
        'Tidak. Anda mendapatkan file subtitle terpisah dan videonya tidak diubah. Menanamkan subtitle ke dalam gambar memerlukan aplikasi penyunting video.',
    },
    {
      question: 'Seberapa akurat penyesuaian waktunya?',
      answer:
        'Waktu mengikuti ucapan dan biasanya cukup dekat, tetapi tidak presisi sampai per bingkai. Periksa baris pertama dan terakhir, lalu sesuaikan di aplikasi penyunting subtitle jika Anda membutuhkan sinkronisasi yang tepat.',
    },
    {
      question: 'Bisakah saya membuat subtitle dalam bahasa lain?',
      answer:
        'Anda bisa mentranskripsikan dalam bahasa yang diucapkan (lebih dari 50 bahasa didukung) atau menerjemahkan ucapan ke bahasa Inggris. Penerjemahan ke bahasa lain tidak tersedia.',
    },
  ],
};
