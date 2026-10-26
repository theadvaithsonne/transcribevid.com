import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Video ke teks',
  h1: 'Ubah video ke teks, gratis dan dengan penanda waktu',
  lead: 'Unggah video yang sudah direkam dan lihat ucapannya berubah menjadi teks, baris demi baris, masing-masing dengan waktunya. Kuliah, wawancara, rapat, klip dari ponsel, dan rekaman layar semuanya bisa, dalam lebih dari 50 bahasa.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Mengapa video perlu diubah menjadi teks',
  why: [
    'Video sulit dicari isinya. Anda tidak bisa membacanya sekilas, mengutipnya, atau menyalin satu kalimat darinya. Transkrip mengubah ucapan menjadi teks yang bisa dicari, dikutip, diterjemahkan, dan dibaca dalam waktu jauh lebih singkat, dan setiap baris tetap membawa penanda waktunya sehingga Anda bisa kembali ke momen yang tepat.',
    'Orang memakainya untuk kuliah dan webinar yang direkam, rekaman wawancara, rapat tim yang tersimpan, demo produk, vlog, dan klip pendek media sosial. Teksnya juga menjadi titik awal yang baik untuk keterangan video, catatan acara, artikel blog, dan notulen rapat.',
  ],

  howTitle: 'Cara mengubah video ke teks',
  howToDescription:
    'Unggah file video, pilih bahasa yang diucapkan, tunggu transkripnya selesai, lalu unduh sebagai teks atau subtitle.',
  steps: [
    {
      title: 'Pilih video Anda',
      text: 'Letakkan video di kotak pada bagian atas halaman ini, atau tekan Pilih file. Video akan terbuka di pengunggah, tempat Anda bisa menambah video lain.',
    },
    {
      title: 'Atur bahasa dan kualitas',
      text: 'Pilih bahasa yang diucapkan agar hasilnya paling akurat, atau biarkan Deteksi otomatis tetap aktif. Standar cocok untuk sebagian besar video. Tercepat sangat cepat untuk ucapan yang jernih. Untuk audio yang berisik atau sulit, pilih Akurasi tinggi atau Akurasi terbaik; Akurasi terbaik paling lama dan paling sedikit membuat kesalahan.',
    },
    {
      title: 'Lihat transkripsi berjalan',
      text: 'Teks muncul langsung, baris demi baris, lengkap dengan bilah kemajuan dan perkiraan sisa waktu.',
    },
    {
      title: 'Edit dan unduh',
      text: 'Perbaiki baris mana pun di editor, lalu unduh TXT, SRT, VTT, Markdown, JSON, atau PDF. Tidak ada yang disimpan setelah sesi Anda berakhir, jadi unduh sebelum Anda pergi.',
    },
  ],

  formatsTitle: 'File video yang didukung dan format unduhan',
  formatsIntro:
    'TranscribeVid membaca jalur suaranya, jadi kualitas gambar tidak berpengaruh. File yang hanya berisi audio juga bisa.',
  uploadTitle: 'File video yang bisa Anda unggah',
  accepts: ['MP4', 'MKV', 'MOV', 'AVI', 'WEBM', 'WMV', 'FLV', 'M4V', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'teks biasa untuk dibaca atau ditempel' },
    { name: 'SRT', use: 'subtitle untuk pemutar dan aplikasi penyunting' },
    { name: 'VTT', use: 'subtitle untuk video web' },
    { name: 'Markdown', use: 'teks dengan judul dan waktu' },
    { name: 'JSON', use: 'baris berwaktu untuk program' },
    { name: 'PDF', use: 'salinan yang siap dicetak' },
  ],

  tipsTitle: 'Tips untuk transkrip video yang lebih baik',
  tips: [
    {
      title: 'Putar menit pertama lebih dulu.',
      text: 'Kalau Anda sulit menangkap ucapan lewat speaker laptop, perangkat lunaknya juga akan kesulitan. Atasi masalah volume sebelum Anda mengunggah.',
    },
    {
      title: 'Sebutkan bahasanya.',
      text: 'Memilih bahasa yang diucapkan lebih andal daripada deteksi otomatis, terutama untuk klip yang pendek atau beraksen.',
    },
    {
      title: 'Tambahkan petunjuk kosakata.',
      text: 'Di Opsi lainnya, tuliskan nama, merek, dan istilah khusus persis seperti ejaan yang Anda inginkan.',
    },
    {
      title: 'Tetap di bawah batasnya.',
      text: 'Video yang lebih panjang atau lebih besar dari batas di atas akan ditolak, jadi potong rekaman yang panjang menjadi beberapa bagian lebih dulu.',
      browser: {
        title: 'Video panjang butuh waktu lebih lama.',
        text: 'Tidak ada batas ukuran, tetapi video yang panjang memakan waktu lebih lama di perangkat Anda dan membutuhkan lebih banyak memori. Di ponsel, potong rekaman yang sangat panjang menjadi beberapa bagian.',
      },
    },
    {
      title: 'Periksa baris yang ditandai.',
      text: 'Baris yang diragukan oleh mesin pengenalan diberi tanda. Tinjau baris itu lebih dulu, karena tidak ada transkrip yang sempurna.',
    },
  ],

  faqs: [
    {
      question: 'Apakah mengubah video ke teks benar-benar gratis?',
      answer:
        'Ya. Layanan ini gratis, tanpa akun atau login, dan tanpa kuota harian maupun bulanan. {limits} Jika banyak orang memakai layanan ini, file Anda mungkin menunggu dalam antrean beberapa saat.',
      browser: {
        answer:
          'Ya. Layanan ini gratis, tanpa akun atau login, dan tanpa kuota harian maupun bulanan; iklan yang membuatnya tetap gratis. Video Anda ditranskripsikan di browser, di perangkat Anda sendiri, jadi tidak ada batas ukuran dan tidak ada orang lain yang mengantre di depan Anda: seberapa cepat prosesnya bergantung pada perangkat Anda.',
      },
    },
    {
      question: 'Bisakah saya mentranskripsikan video yang tidak berisi ucapan?',
      answer:
        'Hanya ucapan yang menjadi teks. Video tanpa suara, atau yang hanya berisi musik, menghasilkan keluaran kosong atau sangat pendek. Teks yang tampil di layar tidak dibaca.',
    },
    {
      question: 'Bisakah saya menempelkan tautan YouTube?',
      answer:
        'Tidak. TranscribeVid bekerja dengan file yang Anda unggah atau rekam, bukan tautan web. Jika video itu milik Anda, unggah file aslinya.',
    },
    {
      question: 'Apakah nama pembicara ikut ditampilkan?',
      answer:
        'Tidak. Nama atau label pembicara tidak ditambahkan. Setiap baris memiliki penanda waktu, dan Anda bisa mengetik nama ke dalam teks saat mengedit.',
    },
    {
      question: 'Seberapa akurat video ke teks?',
      answer:
        'Pada ucapan yang jernih dalam bahasa yang didukung, hasilnya biasanya sangat akurat, tetapi tidak ada pengenalan ucapan yang sempurna. Derau, aksen, musik, dan suara yang saling tumpang tindih menurunkan akurasi, jadi periksa bagian yang penting dengan membandingkannya dengan videonya.',
    },
  ],
};
