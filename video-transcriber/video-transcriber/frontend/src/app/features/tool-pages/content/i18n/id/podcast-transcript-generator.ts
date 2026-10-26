import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Pembuat transkrip podcast',
  h1: 'Buat transkrip podcast dari file audio Anda',
  lead: 'Masukkan satu episode dan dapatkan transkrip lengkap berpenanda waktu untuk diterbitkan di sampingnya, dicari, dikutip, atau diubah menjadi catatan episode. Gratis, tanpa pendaftaran, dan tersedia dalam lebih dari 50 bahasa.',
  dropKind: 'audio',
  dropNoun: 'episode podcast',

  whyTitle: 'Mengapa episode perlu diberi transkrip',
  why: [
    'Transkrip membuat sebuah episode lebih mudah ditemukan, dikutip, dan diikuti. Pendengar bisa membacanya sekilas, membaca sambil mengikuti saat suara dimatikan atau di tempat yang bising, dan mencarinya untuk nama seorang tamu. Pendengar yang tuli atau kesulitan mendengar, dan orang yang mendengarkan dalam bahasa kedua, juga bisa memakainya. Mesin pencari pun jauh lebih mudah membaca teks daripada audio.',
    'Halaman ini membuat draf pertama: seluruh episode sebagai teks, dengan waktu di setiap baris. Rencanakan untuk mengeditnya. Pengenalan ucapan tidak mengenal nama tamu Anda atau istilah khas acara Anda, dan tidak memberi label pada pembicara. Pakai untuk episode yang Anda buat atau yang Anda diizinkan memakainya.',
  ],

  sections: [
    {
      title: 'Dari transkrip ke halaman episode',
      paragraphs: [
        'Satu transkrip bisa menjadi bahan untuk beberapa hal yang sudah Anda terbitkan.',
      ],
      bullets: [
        {
          title: 'Catatan episode.',
          text: 'Baca transkrip sekali, pilih topik-topiknya dan tulis ringkasan singkat dengan penanda waktu masing-masing. Unduh Markdown untuk ditempel ke aplikasi catatan atau editor blog.',
        },
        {
          title: 'Transkrip di bawah pemutar.',
          text: 'Unduh TXT, rapikan paragrafnya dan tambahkan nama seperti Pembawa acara dan Tamu secara manual. Transkrip tidak memiliki label pembicara sendiri.',
        },
        {
          title: 'Keterangan untuk versi video.',
          text: 'Jika Anda juga menerbitkan episode sebagai video, unduh SRT atau VTT dan unggah sebagai keterangan.',
        },
        {
          title: 'Kutipan dan klip.',
          text: 'Temukan barisnya, baca penanda waktunya dan potong klip dari audio Anda pada waktu itu.',
        },
      ],
    },
    {
      title: 'Menuliskan nama, istilah khusus, dan bacaan iklan dengan benar',
      paragraphs: [
        'Nama tamu, nama merek, dan istilah acara adalah hal yang paling sering salah dikenali oleh mesin pengenalan. Sebelum mulai, daftarkan semuanya di petunjuk kosakata pada Opsi lainnya: pembawa acara, para tamu, nama acara, produk, dan istilah apa pun yang sering Anda pakai. Saat transkrip siap, ketik nama yang salah eja ke kotak Cari di teks di atasnya, buka Ganti…, masukkan ejaan yang benar dan terapkan ke semua baris yang cocok sekaligus. Baris yang diragukan oleh mesin pengenalan diberi tanda, jadi tinjau baris itu lebih dulu.',
        'Biarkan sakelar Lewati keheningan & musik tetap aktif di Opsi lainnya, agar jingle dan jeda panjang tidak berubah menjadi kata-kata karangan. Efek suara dan musik latar di bawah bacaan iklan masih bisa menambahkan teks nyasar, jadi hapus apa pun yang tidak diucapkan.',
      ],
    },
  ],

  howTitle: 'Cara membuat transkrip podcast',
  howToDescription:
    'Tambahkan episodenya, daftarkan nama dan istilahnya, tunggu transkripnya selesai, lalu unduh untuk halaman episode.',
  steps: [
    {
      title: 'Tambahkan episodenya',
      text: 'Letakkan episode di kotak di atas, atau tekan Pilih file. MP3 adalah format podcast yang lazim, tetapi WAV, M4A, FLAC, dan lainnya juga bisa. Satu episode masuk ke kotak ini setiap kali; di halaman berikutnya, Tambah file lain memungkinkan Anda memasukkan episode lain.',
    },
    {
      title: 'Daftarkan nama dan istilahnya',
      text: 'Di halaman berikutnya, buka Opsi lainnya dan masukkan pembawa acara, para tamu, nama acara, dan istilah khusus apa pun ke petunjuk kosakata. Pilih bahasa yang diucapkan, atau biarkan Deteksi otomatis.',
    },
    {
      title: 'Mulai dan tunggu transkripnya',
      text: 'Tekan Transkripsikan. Teks muncul baris demi baris dengan bilah kemajuan. Standar cocok untuk sebagian besar episode. Suara yang saling menyela atau audio yang buruk adalah saat Akurasi tinggi atau Akurasi terbaik sepadan dengan waktunya. Keduanya lebih lambat, membutuhkan unduhan pertama yang lebih besar, dan tampil diredupkan beserta alasannya pada perangkat yang tidak mampu menjalankannya.',
    },
    {
      title: 'Edit dan ekspor',
      text: 'Perbaiki nama dan tanda baca dan tambahkan nama pembicara secara manual. Lalu unduh TXT atau Markdown untuk halaman episode, atau SRT atau VTT untuk versi video.',
    },
  ],

  formatsTitle: 'File podcast dan format unduhan',
  formatsIntro:
    'MP3 adalah format podcast yang lazim. File audio lain dibaca dengan cara yang sama, dan file video juga diterima.',
  uploadTitle: 'File audio yang bisa Anda tambahkan',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'transkrip untuk diterbitkan di bawah pemutar' },
    { name: 'Markdown', use: 'catatan episode dengan penanda waktu' },
    { name: 'SRT', use: 'keterangan untuk versi video' },
    { name: 'VTT', use: 'jalur transkrip untuk pemutar web' },
    { name: 'PDF', use: 'transkrip untuk dibagikan atau dicetak' },
  ],

  tipsTitle: 'Tips untuk transkrip podcast',
  tips: [
    {
      title: 'Transkripsikan hasil campuran akhir.',
      text: 'Episode yang sudah dimastering, lengkap dengan intro dan bacaan iklan, adalah yang didengar pendengar. Penanda waktunya lalu cocok dengan file yang Anda terbitkan.',
    },
    {
      title: 'Pakai WAV asli Anda jika ada.',
      text: 'MP3 adalah salinan terkompresi, dan setiap putaran kompresi tambahan menghilangkan detail. Audio yang lebih bersih menghasilkan lebih sedikit kesalahan.',
    },
    {
      title: 'Potong episode yang sangat panjang menjadi beberapa bagian.',
      text: 'File yang lebih besar atau lebih panjang daripada batas yang tertera di halaman ini tidak bisa diproses, jadi pecah episode yang panjang di aplikasi penyunting audio mana pun lebih dulu.',
      browser: {
        title: 'Episode panjang butuh waktu lebih lama.',
        text: 'Situs ini tidak membatasi panjang episode, tetapi acara bincang-bincang yang panjang membutuhkan waktu dan memori kosong di perangkat Anda. Memecahnya pada jeda yang wajar di aplikasi penyunting audio mana pun membuat Anda mendapat bagian pertama lebih cepat.',
      },
    },
    {
      title: 'Bacalah sambil mendengarkan sekali.',
      text: 'Membaca transkrip sementara episode diputar dengan kecepatan normal adalah cara tercepat untuk menangkap kesalahan yang penting.',
    },
    {
      title: 'Katakan bahwa ini otomatis.',
      text: 'Jika Anda menerbitkan transkrip tanpa suntingan penuh, sampaikan hal itu, agar pembaca tahu kesalahan kecil mungkin ada.',
    },
  ],

  faqs: [
    {
      question: 'Bisakah saya menerbitkan transkrip podcast otomatis di halaman episode saya?',
      answer:
        'Bisa, untuk episode yang Anda buat. Bacalah sampai selesai terlebih dahulu, perbaiki nama, tambahkan nama pembicara secara manual, dan beri tahu pembaca bahwa transkrip itu dibuat secara otomatis. Jika seorang tamu meminta sesuatu dihilangkan, hapus juga dari teksnya.',
    },
    {
      question: 'Apakah transkrip podcast memiliki nama pembicara?',
      answer:
        'Tidak. Ketik "Pembawa acara" dan "Tamu" ke dalam teks saat Anda mengedit; transkrip itu sendiri hanya membawa waktu.',
    },
    {
      question: 'Bisakah saya mendapatkan catatan episode dari transkrip podcast?',
      answer:
        'Anda mendapatkan bahan mentahnya, bukan ringkasan. Transkrip tidak menulis catatan episode untuk Anda, tetapi penanda waktunya membuat Anda cepat mendaftar topik dan menit tempat masing-masing dimulai.',
    },
    {
      question: 'Berapa lama episode podcast yang bisa saya transkripsikan sekaligus?',
      answer:
        '{limits} Episode yang panjang mungkin perlu dipecah. Tidak ada kuota harian atau bulanan.',
      browser: {
        answer:
          'Panjang episode tidak dibatasi oleh situs. Episode yang panjang memakan waktu lebih lama dan membutuhkan memori kosong di perangkat Anda sendiri; halaman ini memperingatkan Anda di perangkat yang lebih lambat.',
      },
    },
    {
      question: 'Bisakah saya mentranskripsikan podcast dari umpan RSS atau tautannya?',
      answer:
        'Tidak. TranscribeVid bekerja dengan file yang Anda tambahkan, bukan tautan web atau umpan. Pakai file episode yang Anda buat atau ekspor, dan tambahkan di kotak pada bagian atas halaman ini.',
    },
  ],

  links: [
    {
      label: 'MP3 ke teks',
      path: '/mp3-to-text',
      note: 'Pengaturan dan tips untuk jenis file podcast yang paling umum.',
    },
    {
      label: 'Pembuat subtitle SRT',
      path: '/srt-subtitle-generator',
      note: 'Keterangan untuk versi video dari episode.',
    },
    {
      label: 'SRT vs VTT',
      path: '/guides/srt-vs-vtt',
      note: 'File keterangan mana yang diharapkan oleh pemutar atau layanan hosting Anda.',
    },
    {
      label: 'Cara mendapatkan transkrip yang lebih akurat',
      path: '/guides/accurate-transcripts',
      note: 'Lebih sedikit kesalahan dari episode yang sama.',
    },
  ],
};
