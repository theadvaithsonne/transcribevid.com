import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Pesan suara WhatsApp ke teks',
  h1: 'Ubah pesan suara WhatsApp ke teks',
  lead: 'Pesan suara yang panjang mudah dikirim tetapi sulit dibaca ulang. Simpan pesan sebagai file, letakkan di sini, dan bacalah sebagai teks dengan penanda waktu, dalam bahasa Hindi, Inggris, Spanyol, dan banyak bahasa lain. Gratis, tanpa login.',
  dropKind: 'audio',
  dropNoun: 'pesan suara WhatsApp',

  whyTitle: 'Mengapa pesan suara perlu diubah menjadi teks',
  why: [
    'Pesan suara cepat direkam tetapi lambat dipakai. Anda tidak bisa mencarinya, menyalin satu kalimat darinya, atau membacanya sekilas di tengah rapat. Sebagai teks, pesan yang sama bisa dipindai dalam hitungan detik, dan Anda bisa menempelkan alamat, kutipan, atau daftar petunjuk langsung ke obrolan, catatan, atau dokumen.',
    'Pakai halaman ini untuk pesan yang Anda kirim atau terima dan boleh Anda gunakan. Pesan suara bersifat pribadi, jadi ada baiknya mengetahui ke mana file itu pergi: di sini file dikirim ke server lewat koneksi terenkripsi dan dihapus secara otomatis sesudahnya. Tidak perlu akun.',
  ],
  browserWhy: [
    'Pesan suara cepat direkam tetapi lambat dipakai. Anda tidak bisa mencarinya, menyalin satu kalimat darinya, atau membacanya sekilas di tengah rapat. Sebagai teks, pesan yang sama bisa dipindai dalam hitungan detik, dan Anda bisa menempelkan alamat, kutipan, atau daftar petunjuk langsung ke obrolan, catatan, atau dokumen.',
    'Pakai halaman ini untuk pesan yang Anda kirim atau terima dan boleh Anda gunakan. Pesan suara bersifat pribadi, jadi file tetap bersama Anda: browser Anda mentranskripsikannya di perangkat Anda sendiri dan tidak ada yang diunggah. Saat pertama kali memakai situs ini, browser Anda mengunduh model ucapan satu kali dan menyimpannya. Ukurannya puluhan megabyte untuk Tercepat, beberapa ratus untuk Standar, dan lebih besar untuk pilihan yang lebih besar, jadi gunakan Wi-Fi, bukan data seluler, di ponsel. Tidak perlu akun.',
  ],

  sections: [
    {
      title: 'Cara menyimpan pesan suara sebagai file',
      paragraphs: [
        'WhatsApp menyimpan pesan suara di dalam aplikasi, jadi simpan pesannya sebagai file terlebih dahulu. Menu berbeda di antara model ponsel dan versi aplikasi, jadi anggap langkah-langkah ini sebagai panduan dan cari opsi Bagikan, Teruskan, atau Simpan. WhatsApp milik perusahaannya sendiri, dan situs ini tidak terhubung dengannya.',
        'WhatsApp juga bisa menampilkan transkrip di dalam obrolan pada sebagian ponsel, untuk bahasa dan versi yang menyediakannya. Halaman ini untuk saat Anda menginginkan teks sebagai file yang bisa diedit dan diekspor, dengan penanda waktu, atau saat versi atau bahasa Anda tidak tercakup.',
      ],
      bullets: [
        {
          title: 'Di Android.',
          text: 'Tekan dan tahan pesan suara, buka menu, lalu cari Bagikan, atau Teruskan lalu Bagikan. Pilih Simpan ke perangkat, Files, atau aplikasi penyimpanan awan, atau kirim ke diri sendiri lewat surel. Banyak ponsel Android juga menyimpan catatan suara yang diterima di folder WhatsApp Voice Notes yang bisa dibuka oleh pengelola file.',
        },
        {
          title: 'Di iPhone.',
          text: 'Tekan dan tahan pesan suara, pilih Teruskan, lalu ketuk ikon bagikan dan pilih Simpan ke Files. Anda juga bisa mengirimnya ke komputer dengan AirDrop atau lewat surel.',
        },
        {
          title: 'Di komputer.',
          text: 'Di WhatsApp Web atau aplikasi desktop, menu pesan mungkin menawarkan opsi Unduh. Jika tidak ada, simpan file di ponsel Anda lalu pindahkan.',
        },
      ],
    },
    {
      title: 'Pesan berbahasa Hindi, Hinglish, dan campuran bahasa',
      paragraphs: [
        'Pesan suara sering mencampur bahasa dalam satu kalimat. Atur bahasanya ke bahasa yang paling banyak diucapkan, atau biarkan Deteksi otomatis. Pengenalan paling baik mengikuti bahasa utama, jadi periksa baris yang ditandai ragu di bagian yang disisipi bahasa kedua.',
        'Untuk bahasa Hindi, Gaya transkrip menentukan cara teks ditulis. Hinglish (Hindi beraksara Latin) menulis bahasa Hindi dengan huruf Latin dan mempertahankan kata-kata Inggris apa adanya. Aksara asli mempertahankan Devanagari. Bahasa Urdu, Bengali, Arab, Spanyol, Portugis, dan bahasa lain yang didukung tetap memakai aksaranya sendiri. Pesan dalam bahasa lain juga bisa keluar sebagai teks bahasa Inggris: di Opsi lainnya, ubah Output ke Terjemahkan ke bahasa Inggris, dan periksa hasilnya terhadap rekaman, karena terjemahan kurang andal dibandingkan transkripsi dalam bahasa aslinya.',
      ],
    },
  ],

  howTitle: 'Cara mengubah pesan suara WhatsApp ke teks',
  howToDescription:
    'Simpan pesan suara sebagai file, tambahkan ke halaman ini, pilih bahasanya, tunggu transkripnya selesai, lalu salin atau unduh teksnya.',
  steps: [
    {
      title: 'Tambahkan file pesan suara',
      text: 'Letakkan file yang sudah disimpan di kotak di atas, atau tekan Pilih file. Pesan suara WhatsApp biasanya berupa file .opus, dan itu bisa dipakai apa adanya. Kotak ini menerima satu file setiap kali: kotak ini menyerahkan pesan ke pengunggah di halaman berikutnya, tempat Tambah file lain memungkinkan Anda memasukkan pesan lainnya.',
    },
    {
      title: 'Pilih bahasanya',
      text: 'Di halaman berikutnya, pilih bahasa yang paling banyak diucapkan, atau biarkan Deteksi otomatis. Untuk bahasa Hindi, Gaya transkrip memilih antara huruf Latin (Hinglish) dan Devanagari. Lalu tekan Transkripsikan.',
    },
    {
      title: 'Tunggu teksnya',
      text: 'Baris muncul beserta penanda waktunya selagi pesan diproses, dan pesan yang pendek selesai lebih cepat daripada yang panjang. Standar cocok untuk sebagian besar pesan. Untuk pembicara yang cepat atau rekaman yang berisik, Akurasi tinggi bisa membantu jika perangkat Anda mampu menjalankannya. Pada perangkat yang tidak mampu, pilihan itu diredupkan beserta alasannya, dan membutuhkan unduhan pertama yang lebih besar.',
    },
    {
      title: 'Periksa, salin, atau unduh',
      text: 'Perbaiki nama dan kata yang tidak jelas, lalu salin teksnya, atau unduh TXT. Unduh SRT atau VTT hanya jika pesan itu menyertai video.',
    },
  ],

  formatsTitle: 'File pesan suara dan format unduhan',
  formatsIntro:
    'Pesan suara WhatsApp biasanya berupa file .opus. File audio lain bekerja dengan cara yang sama, dan file video juga diterima, dengan hanya suaranya yang dipakai.',
  uploadTitle: 'File audio yang bisa Anda tambahkan',
  accepts: ['OPUS', 'OGG', 'M4A', 'MP3', 'AAC', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'pesan sebagai teks biasa untuk disalin' },
    { name: 'Markdown', use: 'catatan dengan waktu di setiap baris' },
    { name: 'PDF', use: 'salinan pesan yang siap dicetak' },
    { name: 'SRT', use: 'baris berwaktu untuk video yang memuat pesan itu' },
  ],

  tipsTitle: 'Tips untuk pesan suara',
  tips: [
    {
      title: 'Simpan filenya, jangan rekam ulang.',
      text: 'Memutar pesan lewat speaker sementara perangkat lain merekamnya menambahkan gema dan kebisingan ruangan. File yang disimpan adalah salinan yang bersih.',
    },
    {
      title: 'Sebutkan bahasa utamanya.',
      text: 'Memilih bahasa lebih andal daripada deteksi otomatis untuk pesan yang pendek, terutama jika pembicara berpindah antara dua bahasa.',
    },
    {
      title: 'Tambahkan nama ke petunjuk kosakata.',
      text: 'Di Opsi lainnya, ketik nama orang, tempat, dan toko yang disebut. Dengan begitu nama-nama itu lebih mungkin dieja seperti yang Anda harapkan.',
    },
    {
      title: 'Periksa angka sebelum Anda bertindak.',
      text: 'Nomor telepon, alamat, waktu, atau jumlah uang bisa salah dengar. Putar baris itu dari penanda waktunya dan dengarkan lagi sebelum Anda mengandalkannya.',
    },
    {
      title: 'Perlakukan pesan orang lain dengan hati-hati.',
      text: 'Transkripsikan hanya pesan yang Anda kirim atau terima dan boleh Anda gunakan, dan pikirkan dulu sebelum Anda membagikan teks pesan yang dikirim seseorang kepada Anda secara pribadi.',
    },
  ],

  faqs: [
    {
      question: 'Bisakah saya mengubah pesan suara WhatsApp ke teks tanpa aplikasinya?',
      answer:
        'Bisa. Simpan pesan suara sebagai file, tambahkan ke halaman ini, dan baca teksnya. Anda tidak memerlukan akun di situs ini, dan tidak ada pendaftaran atau login.',
    },
    {
      question: 'Jenis file apa pesan suara WhatsApp itu?',
      answer:
        'Biasanya file .opus. Halaman ini membacanya langsung, jadi Anda tidak perlu mengonversinya ke MP3 lebih dulu. Catatan suara yang disimpan sebagai OGG, M4A, MP3, atau AAC juga bisa dipakai.',
    },
    {
      question: 'Apakah bisa untuk bahasa Hindi atau campuran Hindi dan Inggris?',
      answer:
        'Bisa. Hindi adalah salah satu bahasa yang didukung. Secara bawaan teks ditulis dengan huruf Latin (Hinglish); pilih Aksara asli di bawah Gaya transkrip untuk Devanagari. Pesan yang mencampur bahasa paling baik mengikuti bahasa utamanya, jadi periksa baris yang ditandai ragu.',
    },
    {
      question: 'Sepanjang apa pesan suara WhatsApp yang bisa saya transkripsikan?',
      answer:
        '{limits} Pesan suara biasanya pendek, jadi hal ini jarang menjadi masalah. Tidak ada kuota harian atau bulanan.',
      browser: {
        answer:
          'Situs ini tidak menetapkan batas ukuran atau durasi, dan pesan suara biasanya pendek, jadi cepat selesai. Rekaman yang sangat panjang membutuhkan waktu dan memori kosong di perangkat Anda, dan sebagian browser mungkin tidak sanggup menangani file yang luar biasa panjang.',
      },
    },
    {
      question: 'Apakah layanan ini menyimpan salinan pesan suara WhatsApp saya?',
      answer:
        'Hanya selama sesi Anda. Server menghapus file saat sesi berakhir, atau saat Anda menekan Hapus data saya sekarang.',
      browser: {
        answer:
          'Hanya di browser ini: pesan suara tidak pernah meninggalkan perangkat Anda. Browser Anda menghapusnya setelah beberapa waktu tidak aktif, dan Anda bisa menghapusnya lebih cepat dengan Hapus data saya sekarang.',
      },
    },
  ],

  links: [
    {
      label: 'Audio Hindi ke teks (halaman bahasa Inggris)',
      path: '/hindi-audio-to-text',
      note: 'Pengaturan dan tips untuk ucapan bahasa Hindi, dalam Devanagari atau huruf Latin.',
    },
    {
      label: 'Transkripsi Hinglish (halaman bahasa Inggris)',
      path: '/hinglish-transcription',
      note: 'Cara bahasa Hindi ditulis dengan huruf Latin, dan kapan memakainya.',
    },
    {
      label: 'Terjemahkan ucapan ke teks bahasa Inggris',
      path: '/translate-audio-to-english',
      note: 'Dapatkan teks bahasa Inggris dari pesan suara dalam bahasa lain.',
    },
    {
      label: 'Cara mendapatkan transkrip yang lebih akurat',
      path: '/guides/accurate-transcripts',
      note: 'Apa yang perlu diubah ketika pesan keluar dengan kesalahan.',
    },
  ],
};
