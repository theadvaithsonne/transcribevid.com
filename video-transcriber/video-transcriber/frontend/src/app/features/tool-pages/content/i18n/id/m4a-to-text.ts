import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'M4A ke teks',
  h1: 'Transkripsikan memo suara M4A ke teks',
  lead: 'M4A adalah format yang disimpan oleh Memo Suara di iPhone dan Mac, banyak perekam Android, dan aplikasi Apple. Tambahkan filenya dan dapatkan transkrip berpenanda waktu, gratis, tanpa login dan tanpa konversi ke MP3.',
  dropKind: 'audio',
  dropNoun: 'file M4A',

  whyTitle: 'Mengapa file M4A mudah ditranskripsikan',
  why: [
    'M4A adalah file MPEG-4 yang hanya berisi audio. Biasanya isinya suara AAC, yang terkompresi tetapi lebih dari cukup baik untuk ucapan, sehingga file M4A kecil dan mudah ditranskripsikan. TranscribeVid membacanya langsung. Tidak ada yang perlu dikonversi lebih dulu.',
    'Memo suara dibuat saat bepergian, jadi sering kali pelan, bergema, atau direkam dengan ponsel di dalam saku. Pilihan kualitas dan opsi pembersihan di halaman ini ada tepat untuk rekaman semacam itu.',
  ],

  sections: [
    {
      title: 'Mengambil memo suara dari ponsel Anda',
      paragraphs: [
        'Nama menu berubah di antara versi iOS, macOS, dan Android, jadi anggap ini sebagai panduan. Jika Anda berada di ponselnya langsung, tekan Pilih file dan pilih rekaman dari Files atau folder rekaman Anda. Tidak perlu komputer.',
      ],
      bullets: [
        {
          title: 'iPhone.',
          text: 'Di Memo Suara (Voice Memos), buka rekaman, ketuk tombol Lainnya (tiga titik) dan pilih Bagikan. Simpan ke Files, atau kirim ke diri sendiri lewat AirDrop atau surel, lalu tambahkan di sini.',
        },
        {
          title: 'Mac.',
          text: 'Seret rekaman keluar dari jendela Memo Suara ke Desktop. Rekaman itu menjadi file .m4a, siap ditambahkan.',
        },
        {
          title: 'Android.',
          text: 'Banyak aplikasi perekam menyimpan file M4A di folder Recordings atau Voice Recorder. Nama folder bergantung pada aplikasinya, dan pemilih file bisa membukanya.',
        },
      ],
    },
    {
      title: 'Memo suara lossless dan terkompresi',
      paragraphs: [
        'Memo Suara di iPhone bisa menyimpan rekaman sebagai Terkompresi atau Lossless. File Lossless jauh lebih besar, tetap berakhiran .m4a dan biasanya memakai codec Apple Lossless. Ucapan tidak membutuhkannya: memo Terkompresi menghasilkan transkrip yang sama dengan ukuran yang jauh lebih kecil.',
      ],
      browser: {
        paragraphs: [
          'Memo Suara di iPhone bisa menyimpan rekaman sebagai Terkompresi atau Lossless. File Lossless jauh lebih besar, tetap berakhiran .m4a dan biasanya memakai codec Apple Lossless, yang tidak bisa dibaca sendiri oleh semua browser. Jika browser Anda tidak bisa, halaman ini mungkin menawarkan untuk memuat konverter kecil (sekitar 9 MB) yang berjalan di perangkat Anda. Ucapan tidak membutuhkan Lossless: memo Terkompresi menghasilkan transkrip yang sama dengan ukuran yang jauh lebih kecil.',
        ],
      },
    },
  ],

  howTitle: 'Cara mengubah M4A menjadi teks',
  howToDescription:
    'Tambahkan file M4A, pilih bahasa yang diucapkan, tunggu transkripnya selesai, lalu unduh sebagai teks.',
  steps: [
    {
      title: 'Tambahkan M4A-nya',
      text: 'Letakkan memo .m4a di kotak pada bagian atas halaman ini, atau tekan Pilih file dan, di ponsel, pilih dari Files atau folder rekaman Anda. Hanya satu memo yang masuk ke kotak ini; setelah Anda berada di halaman berikutnya, Tambah file lain memasukkan sisanya.',
    },
    {
      title: 'Pilih bahasanya',
      text: 'Di halaman berikutnya, pilih bahasa yang diucapkan. Memo yang pendek hanya memberi sedikit bahan bagi Deteksi otomatis, jadi menyebutkan bahasanya lebih andal. Kualitas Standar cocok untuk sebagian besar memo. Lalu tekan Transkripsikan.',
    },
    {
      title: 'Tunggu transkripnya',
      text: 'Baris muncul satu per satu dengan bilah kemajuan dan perkiraan sisa waktu. Putar dari baris mana pun untuk mendengar apa yang diucapkan.',
    },
    {
      title: 'Perbaiki dan simpan',
      text: 'Perbaiki kata yang salah, lalu unduh TXT, Markdown, atau PDF untuk catatan, atau SRT atau VTT jika memo itu menyertai video. Transkrip hanya hidup selama sesi Anda, jadi unduh sebelum Anda menutup halaman.',
    },
  ],

  formatsTitle: 'M4A dan format audio lainnya',
  formatsIntro:
    'Perekam di ponsel dan komputer menyimpan dalam format yang berbeda-beda. Kotak ini menerima semuanya.',
  uploadTitle: 'File audio yang bisa Anda tambahkan',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'ucapan Anda sebagai teks biasa' },
    { name: 'Markdown', use: 'catatan dengan waktu' },
    { name: 'PDF', use: 'salinan memo yang siap dicetak' },
    { name: 'SRT', use: 'baris berwaktu untuk video yang menyertai memo' },
    { name: 'VTT', use: 'baris berwaktu untuk pemutar web' },
    { name: 'JSON', use: 'baris terstruktur untuk program' },
  ],

  tipsTitle: 'Tips untuk mentranskripsikan memo suara',
  tips: [
    {
      title: 'Pegang ponsel dekat dengan mulut.',
      text: 'Memo yang direkam dengan ponsel di dalam saku atau di seberang meja sulit dikenali oleh mesin pengenalan mana pun. Pegang ponsel sejauh selebar telapak tangan dari mulut Anda dan berbicaralah melintasinya, bukan langsung ke arahnya.',
    },
    {
      title: 'Pangkas sebelum membagikan.',
      text: 'Sebagian besar aplikasi memo suara memungkinkan Anda memotong awal dan akhir rekaman. Menghapus jeda panjang di salah satu ujung menghemat waktu tunggu.',
    },
    {
      title: 'Sebutkan bahasanya.',
      text: 'Untuk memo berdurasi sepuluh atau dua puluh detik, memilih bahasa yang diucapkan lebih baik daripada deteksi otomatis, terutama untuk ucapan beraksen atau campuran beberapa bahasa.',
    },
    {
      title: 'Berikan nama-nama yang sulit.',
      text: 'Tambahkan nama yang tidak lazim ke petunjuk kosakata di Opsi lainnya dan peluang hasilnya benar jauh lebih besar.',
    },
  ],

  faqs: [
    {
      question: 'Bisakah saya mentranskripsikan Memo Suara iPhone tanpa mengonversinya?',
      answer:
        'Bisa. Memo Suara adalah file M4A dan TranscribeVid membaca M4A secara langsung. Bagikan memo ke Files atau ke komputer Anda, lalu tambahkan di sini. Jangan konversi ke MP3 lebih dulu.',
    },
    {
      question: 'Apakah file M4A sama dengan MP4?',
      answer:
        'Keduanya bersaudara dekat. Keduanya memakai wadah MPEG-4; M4A hanya berisi audio, sedangkan MP4 biasanya juga membawa video. TranscribeVid membaca suara dari keduanya.',
    },
    {
      question: 'Mengapa transkrip M4A saya kosong atau sangat pendek?',
      answer:
        'Memo itu mungkin senyap, sangat pelan, atau sebagian besar berisi kebisingan latar. Putar ulang dulu. Jika terlalu lemah, biarkan Perbaiki audio tetap aktif di Opsi lainnya, dan pastikan file tidak terpotong saat Anda membagikannya.',
    },
    {
      question: 'Bisakah saya mentranskripsikan rapat panjang yang direkam di ponsel?',
      answer:
        'Bisa. File M4A kecil, jadi rekaman yang panjang mudah ditambahkan. {limits} Tidak ada kuota harian atau bulanan.',
      browser: {
        answer:
          'Bisa. File M4A kecil, jadi rekaman yang panjang mudah ditambahkan. Situs ini tidak menetapkan batas ukuran atau durasi karena perangkat Anda sendiri yang bekerja, jadi memo yang sangat panjang hanya memakan waktu lebih lama, dan di perangkat yang lebih lambat halaman ini memberi tahu sebelum Anda mulai. Browser yang lebih lama mungkin menolak file yang sangat panjang.',
      },
    },
    {
      question: 'Bisakah saya mentranskripsikan memo suara berbahasa Hindi atau Spanyol?',
      answer:
        'Bisa. Pilih bahasa yang diucapkan dari daftar lebih dari 50 bahasa, atau biarkan Deteksi otomatis aktif untuk memo dalam satu bahasa. Untuk bahasa Hindi, Gaya transkrip (di samping Bahasa) memungkinkan Anda memilih huruf Latin (Hinglish) atau aksara Devanagari asli.',
    },
  ],

  links: [
    {
      label: 'Rekaman suara ke teks',
      path: '/voice-recording-to-text',
      note: 'Rekam dengan mikrofon Anda langsung di halaman ini alih-alih mengunggah file.',
    },
    {
      label: 'MP3 ke teks',
      path: '/mp3-to-text',
      note: 'Transkripsi gratis yang sama untuk file MP3, format suara lain yang umum.',
    },
    {
      label: 'Kuliah ke teks',
      path: '/lecture-to-text',
      note: 'Ubah kuliah yang direkam menjadi catatan yang bisa dicari dan dipelajari.',
    },
    {
      label: 'Cara mendapatkan transkrip yang lebih akurat',
      path: '/guides/accurate-transcripts',
      note: 'Perubahan sederhana pada rekaman dan pengaturan yang paling besar pengaruhnya.',
    },
  ],
};
