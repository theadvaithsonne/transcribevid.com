import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Kuliah ke teks',
  h1: 'Kuliah ke teks: ubah rekaman menjadi transkrip yang bisa dicari',
  lead: 'Rekam kuliahnya, letakkan filenya di sini, dan bacalah sebagai teks dengan penanda waktu: sesuatu yang bisa Anda cari untuk topik ujian, salin ke catatan Anda, dan periksa terhadap rekamannya. Tanpa akun, tanpa biaya, dan lebih dari 50 bahasa.',
  dropKind: 'video',
  dropNoun: 'rekaman kuliah',

  whyTitle: 'Mengapa kuliah perlu ditranskripsikan',
  why: [
    'Kuliah mudah dihadiri tetapi sulit dipakai untuk belajar ulang. Anda tidak bisa mencari satu definisi yang Anda butuhkan di dalam rekaman, dan memutar ulang satu jam untuk menemukannya memakan waktu selama kuliahnya sendiri. Transkrip memberi Anda kata-kata secara berurutan, dengan waktu di samping setiap baris, sehingga Anda bisa melompat ke bagian yang Anda butuhkan.',
    'Transkrip juga membantu orang yang lebih mudah membaca daripada mendengarkan, yang belajar dalam bahasa kedua, yang melewatkan sebuah kelas, atau yang menginginkan teks dari ceramah yang mereka bawakan sendiri. Mintalah izin dosen Anda sebelum merekam, dan ikuti aturan institusi Anda tentang rekaman.',
  ],

  sections: [
    {
      title: 'Dari transkrip ke catatan belajar',
      paragraphs: [
        'Transkrip adalah bahan mentah, bukan catatan jadi. Berikut empat cara mahasiswa memakainya.',
      ],
      bullets: [
        {
          title: 'Cari sebelum belajar ulang.',
          text: 'Setelah transkrip selesai, ketik sebuah istilah ke kotak Cari di teks di atasnya. Kotak itu menghitung baris yang cocok dan panahnya berpindah di antaranya, jadi Anda bisa memutar masing-masing dari penanda waktunya dan mendengar penjelasannya lagi. Jika sebuah kata teknis tertulis salah di mana-mana, Ganti… memperbaiki setiap baris sekaligus.',
        },
        {
          title: 'Susun kerangka Anda sendiri.',
          text: 'Baca teksnya sekali, tambahkan judul Anda sendiri dan pangkas menjadi apa yang Anda butuhkan. Menuangkan sebuah gagasan dengan kata-kata Anda sendiri biasanya cara belajar yang lebih baik daripada menyalinnya.',
        },
        {
          title: 'Periksa nama, angka, dan rumus.',
          text: 'Pengenalan ucapan menuliskan apa yang didengarnya. Persamaan, simbol, dan istilah yang tidak lazim sering perlu diperbaiki, jadi periksa terhadap slide dan rekamannya.',
        },
        {
          title: 'Catat apa yang belum Anda pahami.',
          text: 'Salin penanda waktu bagian yang membuat Anda tertinggal ke dalam daftar, dan bawa ke tutorial atau jam konsultasi berikutnya.',
        },
      ],
    },
    {
      title: 'Kosakata teknis dan bahasa lain',
      paragraphs: [
        'Kata-kata bidang ilmu adalah yang tersulit bagi mesin pengenalan ucapan mana pun. Sebelum mulai, buka Opsi lainnya dan daftarkan istilah, nama teori dan penulis, serta singkatan di petunjuk kosakata. Transkrip lalu lebih sering mengeja semuanya seperti yang Anda tulis.',
        'Jika Anda belajar dalam bahasa yang bukan bahasa pertama Anda, transkrip memberi Anda teks untuk dibaca dengan kecepatan Anda sendiri dan untuk mencari arti kata. Pilih bahasa kuliah, atau biarkan Deteksi otomatis. Kuliah dalam bahasa lain juga bisa diubah menjadi teks bahasa Inggris: di bawah Opsi lainnya, atur Output ke Terjemahkan ke bahasa Inggris. Terjemahan kurang andal dibandingkan transkripsi dalam bahasa aslinya dan bisa melewatkan istilah teknis, jadi periksa terhadap rekamannya.',
      ],
    },
  ],

  howTitle: 'Cara mengubah kuliah ke teks',
  howToDescription:
    'Tambahkan rekaman kuliah, atur bahasa dan istilah teknisnya, tunggu transkripnya selesai, lalu unduh sebagai catatan.',
  steps: [
    {
      title: 'Tambahkan rekaman kuliah',
      text: 'Seret file ke kotak di atas, atau tekan Pilih file. File dari perekam suara di ponsel, video kuliah yang tersimpan, atau rekaman layar kelas online semuanya bisa, dan hanya suaranya yang dipakai. Kotak ini menerima satu file setiap kali dan memindahkannya ke pengunggah di halaman berikutnya, tempat Tambah file lain memasukkan sesi-sesi lain dari sebuah mata kuliah.',
    },
    {
      title: 'Atur bahasa dan kualitas',
      text: 'Di halaman berikutnya, pilih bahasa kuliah. Standar cocok untuk rekaman yang jernih. Untuk aula yang bergema atau pembicara yang cepat, Akurasi tinggi membantu jika perangkat Anda mampu menjalankannya (pilihan itu diredupkan, beserta alasannya, jika tidak mampu). Siapkan diri untuk pekerjaan yang lebih lambat dan unduhan pertama yang lebih besar.',
    },
    {
      title: 'Tambahkan istilah teknis, lalu mulai',
      text: 'Di Opsi lainnya, ketik istilah kunci, nama, dan singkatan di petunjuk kosakata, misalnya siklus Krebs, Bayesian, Dr. Okafor. Lalu tekan Transkripsikan.',
    },
    {
      title: 'Baca, perbaiki, dan unduh',
      text: 'Putar baris dari penanda waktunya untuk memeriksanya dan perbaiki kesalahannya. Lalu unduh TXT atau Markdown untuk aplikasi catatan Anda, atau PDF untuk dicetak.',
    },
  ],

  formatsTitle: 'File rekaman kuliah dan format unduhan',
  formatsIntro:
    'Rekaman dari ponsel, video yang tersimpan, dan rekaman layar kelas semuanya bisa ditambahkan; hanya jalur suaranya yang dibaca.',
  uploadTitle: 'File rekaman yang bisa Anda tambahkan',
  accepts: ['MP4', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'teks biasa untuk aplikasi catatan' },
    { name: 'Markdown', use: 'teks dengan waktu, mudah disusun ulang' },
    { name: 'PDF', use: 'salinan belajar yang siap dicetak' },
    { name: 'SRT', use: 'keterangan, jika kuliah itu video yang Anda bagikan' },
  ],

  tipsTitle: 'Tips untuk rekaman kuliah',
  tips: [
    {
      title: 'Minta izin terlebih dahulu.',
      text: 'Sebagian dosen dan institusi tidak mengizinkan perekaman. Tanyakan, dan ikuti aturan yang diberikan kepada Anda.',
    },
    {
      title: 'Rekam dekat dengan pembicara.',
      text: 'Perekam di bagian depan ruangan biasanya mengalahkan perekam yang lebih baik di bagian belakang, karena jarak dan gema sering mengurangi akurasi lebih banyak daripada yang bisa dipulihkan oleh pengaturan apa pun.',
    },
    {
      title: 'Pecah sesi yang sangat panjang.',
      text: 'Jika sebuah sesi lebih besar atau lebih panjang daripada batas di halaman ini, potong menjadi beberapa bagian pada waktu istirahat sebelum Anda menambahkannya.',
      browser: {
        title: 'Sesi panjang butuh waktu lebih lama.',
        text: 'Tidak ada batas durasi yang ditetapkan, tetapi kuliah yang panjang membuat perangkat Anda sibuk cukup lama dan membutuhkan memori kosong, dan browser yang tidak bisa memakai WebCodecs mungkin kesulitan dengan file yang sangat panjang. Memotongnya pada waktu istirahat memberi Anda separuh pertama untuk dibaca lebih cepat.',
      },
    },
    {
      title: 'Biarkan slide tetap terbuka saat Anda meninjau.',
      text: 'Judul slide memberi Anda kerangka siap pakai untuk dicocokkan dengan penanda waktu.',
    },
    {
      title: 'Unduh sebelum Anda pergi.',
      text: 'Transkrip hanya ada selama sesi Anda. Simpan TXT atau Markdown sebelum Anda menutup halaman.',
    },
  ],

  faqs: [
    {
      question: 'Apakah boleh merekam kuliah dan mentranskripsikannya?',
      answer:
        'Itu bergantung pada dosen dan institusi Anda, jadi tanyakan sebelum merekam dan ikuti aturan mereka. Pakai transkrip untuk belajar sendiri kecuali Anda memiliki izin untuk membagikannya. Ini bukan nasihat hukum.',
    },
    {
      question: 'Bisakah transkrip kuliah diubah menjadi catatan secara otomatis?',
      answer:
        'Tidak. TranscribeVid memberi Anda kata-katanya, dengan penanda waktu di setiap baris, tetapi tidak meringkas atau menambahkan judul. Anda menyusun catatan dari teksnya, yang juga merupakan cara yang baik untuk mempelajari materinya.',
    },
    {
      question: 'Apakah bisa untuk kuliah dengan persamaan atau istilah teknis?',
      answer:
        'Layanan ini menuliskan kata-kata yang didengarnya, jadi istilah yang diucapkan biasanya keluar dengan baik jika Anda menambahkannya ke petunjuk kosakata. Simbol dan persamaan tidak ditulis sebagai rumus, jadi periksa terhadap slide Anda.',
    },
    {
      question: 'Berapa lama kuliah yang bisa saya transkripsikan?',
      answer:
        '{limits} Kuliah yang lebih panjang perlu dipecah menjadi beberapa bagian lebih dulu.',
      browser: {
        answer:
          'Tidak ada batas panjang kuliah. Karena perangkat Anda sendiri yang bekerja, kuliah yang panjang sebagian besar menuntut kesabaran dan memori kosong, dan halaman ini memperingatkan Anda ketika perangkat Anda tampak terlalu lambat untuknya.',
      },
    },
    {
      question: 'Bisakah saya mentranskripsikan kelas online yang saya rekam di layar?',
      answer:
        'Bisa. Rekaman layar yang disimpan sebagai MP4, MOV, atau WebM bisa dipakai. Hanya suaranya yang dibaca, jadi teks pada slide tidak ikut. Tambahkan istilah dari slide ke petunjuk kosakata.',
    },
  ],

  links: [
    {
      label: 'Video ke teks',
      path: '/video-to-text',
      note: 'Halaman umum untuk video rekaman apa pun, dengan semua jenis file.',
    },
    {
      label: 'MP3 ke teks',
      path: '/mp3-to-text',
      note: 'Untuk rekaman kuliah yang disimpan sebagai MP3 di ponsel atau perekam.',
    },
    {
      label: 'Terjemahkan ucapan ke teks bahasa Inggris',
      path: '/translate-audio-to-english',
      note: 'Teks bahasa Inggris dari kuliah dalam bahasa lain.',
    },
    {
      label: 'Cara mendapatkan transkrip yang lebih akurat',
      path: '/guides/accurate-transcripts',
      note: 'Pilihan audio, bahasa, dan kualitas yang mengurangi kesalahan pada rekaman yang sulit.',
    },
  ],
};
