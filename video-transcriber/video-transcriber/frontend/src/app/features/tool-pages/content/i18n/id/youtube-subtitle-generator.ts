import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Pembuat subtitle YouTube',
  h1: 'Buat subtitle untuk video YouTube Anda sendiri',
  lead: 'Tambahkan file video yang Anda buat untuk YouTube, dapatkan file SRT yang waktunya disesuaikan dengan ucapan, lalu unggah di YouTube Studio. Gratis, tanpa login, dan Anda memeriksa setiap baris sebelum menerbitkan.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Mengapa mengunggah file subtitle sendiri',
  why: [
    'YouTube membuat keterangan otomatis untuk banyak video, tetapi tidak selalu benar, dan keterangan itu baru muncul setelah YouTube selesai memproses videonya. File subtitle buatan Anda sendiri memungkinkan Anda memeriksa dan memperbaiki setiap baris, dengan nama, produk, dan istilah yang dieja seperti cara Anda menuliskannya.',
    'Halaman ini untuk video yang Anda buat sendiri. Halaman ini bekerja dari file video di komputer Anda, bukan dari tautan YouTube: menempelkan tautan tidak didukung. Jika video itu milik Anda, Anda sudah memiliki aslinya dari kamera atau aplikasi penyunting Anda. TranscribeVid adalah alat independen dan tidak terhubung dengan YouTube: alat ini tidak pernah masuk ke kanal Anda, jadi Anda menambahkan file jadinya ke sana sendiri.',
  ],

  sections: [
    {
      title: 'Menambahkan file SRT di YouTube Studio',
      paragraphs: [
        'Nama menu di YouTube Studio berubah dari waktu ke waktu, jadi anggap langkah-langkah ini sebagai panduan dan ikuti label yang Anda lihat di layar.',
      ],
      bullets: [
        {
          title: 'Buka Subtitel.',
          text: 'Masuk ke kanal Anda, buka YouTube Studio, dan pilih Subtitel dari menu di sebelah kiri.',
        },
        {
          title: 'Pilih videonya.',
          text: 'Pilih video yang ingin Anda beri keterangan. Jika YouTube menanyakan bahasa video, atur dulu.',
        },
        {
          title: 'Tambahkan bahasanya.',
          text: 'Pilih Tambahkan bahasa, pilih bahasa file tersebut, lalu pilih Tambahkan di bawah Subtitel.',
        },
        {
          title: 'Unggah filenya.',
          text: 'Pilih Upload file, lalu Dengan pengaturan waktu, dan pilih file .srt yang Anda unduh. Periksa barisnya di pratinjau, lalu Publikasikan.',
        },
      ],
    },
    {
      title: 'Subtitle bahasa Inggris dari bahasa lain',
      paragraphs: [
        'Jika video diucapkan dalam bahasa lain, atur Output ke Terjemahkan ke bahasa Inggris di Opsi lainnya sebelum Anda mulai. Anda mendapatkan teks bahasa Inggris yang waktunya disesuaikan dengan ucapan, yang bisa Anda unggah sebagai jalur subtitle bahasa Inggris. Terjemahan adalah kerja mesin, jadi baca teks bahasa Inggrisnya sampai selesai sebelum ditayangkan.',
        'TranscribeVid tidak menerjemahkan ke bahasa selain bahasa Inggris. Untuk setiap bahasa lain yang filenya Anda miliki, tambahkan jalur terpisah di YouTube Studio.',
      ],
    },
    {
      title: 'Mengapa subtitle layak diusahakan',
      paragraphs: [
        'Orang menonton di tempat yang tidak memungkinkan mereka menaikkan volume, dan banyak yang lebih mudah mengikuti bahasa kedua lewat tulisan daripada lewat telinga. Subtitle juga membantu penonton yang tuli atau kesulitan mendengar, dan mengubah kata-kata yang Anda ucapkan menjadi teks yang bisa dicari dan dikutip.',
      ],
    },
  ],

  howTitle: 'Cara membuat subtitle untuk video YouTube',
  howToDescription:
    'Tambahkan file video, pilih bahasa yang diucapkan, periksa barisnya, unduh file SRT, lalu unggah di YouTube Studio.',
  steps: [
    {
      title: 'Tambahkan file video Anda',
      text: 'Pilih file video yang Anda unggah ke YouTube, bukan tautannya: letakkan di kotak pada bagian atas halaman ini atau tekan Pilih file. Untuk video kedua, gunakan Tambah file lain di halaman berikutnya.',
    },
    {
      title: 'Pilih bahasanya',
      text: 'Di halaman berikutnya, pilih bahasa yang diucapkan, atau biarkan Deteksi otomatis aktif. Biarkan Waktu per kata tetap aktif di Opsi lainnya, agar setiap baris dimulai dan diakhiri bersama kata-katanya. Lalu tekan Transkripsikan.',
    },
    {
      title: 'Periksa barisnya',
      text: 'Buka transkrip, putar dari penanda waktu mana pun, dan perbaiki kata, nama, dan angka yang salah. Hapus baris yang tidak ingin Anda tampilkan.',
    },
    {
      title: 'Unduh SRT dan unggah',
      text: 'Unduh file SRT, lalu tambahkan ke video di YouTube Studio seperti yang dijelaskan di atas.',
    },
  ],

  formatsTitle: 'File video dan file subtitle',
  formatsIntro:
    'Tambahkan file video yang Anda buat untuk YouTube, dalam salah satu jenis berikut, dan unduh subtitle dalam format yang Anda butuhkan.',
  uploadTitle: 'File video yang bisa Anda tambahkan',
  accepts: ['MP4', 'MOV', 'M4V', 'WEBM', 'MKV', '3GP'],
  downloads: [
    { name: 'SRT', use: 'file subtitle yang diminta YouTube Studio' },
    { name: 'VTT', use: 'WebVTT, untuk pemutar web' },
    { name: 'TXT', use: 'transkrip untuk deskripsi atau artikel blog Anda' },
    { name: 'Markdown', use: 'teks dengan penanda waktu' },
    { name: 'JSON', use: 'setiap baris dan waktunya, untuk program' },
    { name: 'PDF', use: 'naskah yang siap dicetak' },
  ],

  tipsTitle: 'Tips untuk subtitle YouTube',
  tips: [
    {
      title: 'Pakai hasil akhir.',
      text: 'Buat file dari video persis yang Anda unggah, bukan dari draf sebelumnya. Setiap suntingan yang menggeser ucapan juga menggeser penyesuaian waktunya.',
    },
    {
      title: 'Biarkan waktu per kata tetap aktif.',
      text: 'Opsi ini aktif secara bawaan dan menghasilkan penyesuaian waktu subtitle yang lebih rapat daripada menyesuaikan waktu seluruh kalimat.',
    },
    {
      title: 'Perbaiki nama sebelum menerbitkan.',
      text: 'Teks otomatis paling sering keliru pada nama kanal, produk, dan angka. Petunjuk kosakata membantu, dan membaca ulang menangkap sisanya.',
    },
    {
      title: 'Bacalah dengan suara dimatikan.',
      text: 'Tonton video tanpa suara dengan subtitle menyala. Anda akan langsung melihat baris mana yang hilang terlalu cepat untuk dibaca.',
    },
  ],

  faqs: [
    {
      question: 'Bisakah saya membuat subtitle untuk video YouTube yang bukan saya unggah?',
      answer:
        'Tidak. Alat ini hanya bekerja dengan file, bukan tautan, dan dimaksudkan untuk video yang Anda buat atau yang Anda berhak memakainya. Untuk video Anda sendiri, pakai file asli dari kamera atau aplikasi penyunting Anda.',
    },
    {
      question: 'File mana yang diinginkan YouTube Studio, SRT atau VTT?',
      answer:
        'SRT adalah pilihan yang paling aman: format ini banyak dipakai dan dibaca oleh YouTube Studio. Unggah dengan pengaturan waktu, agar barisnya cocok dengan ucapan.',
    },
    {
      question: 'Apakah saya perlu login untuk membuat file subtitle?',
      answer:
        'Tidak. Anda tidak memerlukan akun di sini. Anda hanya membutuhkan kanal YouTube Anda untuk mengunggah file di YouTube Studio.',
    },
    {
      question:
        'Bagaimana cara mendapatkan subtitle bahasa Inggris untuk video berbahasa Spanyol atau Hindi?',
      answer:
        'Atur Output ke Terjemahkan ke bahasa Inggris di Opsi lainnya sebelum Anda mulai. Transkrip keluar dalam bahasa Inggris dengan waktu. Terjemahannya otomatis dan bisa mengandung kesalahan, jadi baca sebelum Anda menerbitkannya sebagai jalur bahasa Inggris.',
    },
    {
      question: 'Mengapa subtitle saya tidak sinkron di YouTube?',
      answer:
        'Paling sering file dibuat dari versi video yang berbeda, misalnya sebelum bagian awalnya dipangkas. Buat ulang file dari video persis yang Anda unggah. Penyesuaian waktunya dekat tetapi tidak presisi sampai per bingkai, jadi pemeriksaan akhir di YouTube Studio membantu.',
    },
  ],

  links: [
    {
      label: 'Pembuat subtitle SRT',
      path: '/srt-subtitle-generator',
      note: 'Seperti apa isi file SRT, dan cara memperbaiki baris sebelum Anda mengekspor.',
    },
    {
      label: 'Cara menambahkan subtitle ke video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Tempat lain untuk memakai file ini: pemutar media, aplikasi penyunting, dan halaman web Anda sendiri.',
    },
    {
      label: 'Terjemahkan ucapan ke bahasa Inggris',
      path: '/translate-audio-to-english',
      note: 'Teks bahasa Inggris dari ucapan dalam bahasa lain, dan apa yang perlu diperiksa sesudahnya.',
    },
    {
      label: 'SRT vs VTT: format subtitle mana yang dipakai',
      path: '/guides/srt-vs-vtt',
      note: 'Perbedaan kedua format subtitle yang umum.',
    },
  ],
};
