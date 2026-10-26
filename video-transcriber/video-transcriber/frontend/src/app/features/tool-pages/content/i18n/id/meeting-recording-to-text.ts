import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Rekaman rapat ke teks',
  h1: 'Rekaman rapat ke teks: Zoom, Teams, dan Google Meet',
  lead: 'Simpan rekaman setelah panggilan Anda, letakkan di sini, dan dapatkan transkrip berpenanda waktu yang bisa dicari, dikutip, dan diubah menjadi notulen. Tanpa biaya, tanpa akun, dan mencakup lebih dari 50 bahasa.',
  dropKind: 'video',
  dropNoun: 'rekaman rapat',

  whyTitle: 'Mengapa rekaman rapat perlu ditranskripsikan',
  why: [
    'Hanya sedikit orang yang memutar ulang rapat berdurasi satu jam, tetapi banyak yang membutuhkan satu hal darinya: siapa yang setuju pada apa, dan paling lambat kapan. Transkrip memungkinkan Anda mencari tenggat atau sebuah nama, menemukan menit saat hal itu diucapkan, dan mengutipnya secara persis. Ini awal yang lebih cepat untuk notulen dan daftar tindak lanjut daripada memutar ulang panggilannya.',
    'Halaman ini bekerja pada rekaman yang sudah ada. Halaman ini tidak bisa bergabung dalam panggilan langsung, dan tidak menambahkan nama pembicara, jadi layanan ini menggantikan pemutaran ulang, bukan pencatat rapat. Rapat sering memuat rincian rahasia, jadi ketahui ke mana rekaman pergi: di sini rekaman diunggah lewat koneksi terenkripsi dan dihapus secara otomatis sesudahnya.',
  ],
  browserWhy: [
    'Hanya sedikit orang yang memutar ulang rapat berdurasi satu jam, tetapi banyak yang membutuhkan satu hal darinya: siapa yang setuju pada apa, dan paling lambat kapan. Transkrip memungkinkan Anda mencari tenggat atau sebuah nama, menemukan menit saat hal itu diucapkan, dan mengutipnya secara persis. Ini awal yang lebih cepat untuk notulen dan daftar tindak lanjut daripada memutar ulang panggilannya.',
    'Halaman ini bekerja pada rekaman yang sudah ada. Halaman ini tidak bisa bergabung dalam panggilan langsung, dan tidak menambahkan nama pembicara, jadi layanan ini menggantikan pemutaran ulang, bukan pencatat rapat. Rapat sering memuat rincian rahasia: browser Anda mentranskripsikan rekaman di perangkat Anda sendiri dan tidak ada yang diunggah, dan tidak ada yang disimpan setelah sesi Anda berakhir.',
  ],

  sections: [
    {
      title: 'Di mana menemukan rekaman rapat Anda',
      paragraphs: [
        'Setiap alat rapat menyimpan rekaman di tempatnya sendiri, dan nama menu, folder, serta apa yang diizinkan paket Anda berubah di antara versi, jadi anggap ini sebagai panduan. Jika Anda hanya bisa mengekspor audionya, file M4A atau MP3 lebih kecil dan dibaca sama baiknya. Zoom, Microsoft Teams, dan Google Meet adalah nama milik pemiliknya masing-masing, dan situs ini tidak terhubung dengan mereka.',
      ],
      bullets: [
        {
          title: 'Zoom.',
          text: 'Rekaman lokal disimpan di komputer Anda saat rapat berakhir, biasanya sebagai video MP4 dan file audio M4A. Rekaman cloud diunduh dari halaman rekaman di akun Zoom Anda.',
        },
        {
          title: 'Microsoft Teams.',
          text: 'Setelah rapat, rekaman disimpan di OneDrive atau SharePoint, tergantung jenis rapatnya, dan sebuah tautan muncul di obrolan rapat. Buka di sana dan unduh MP4 jika akun Anda mengizinkan pengunduhan.',
        },
        {
          title: 'Google Meet.',
          text: 'Rekaman disimpan ke Google Drive, biasanya di folder Meet Recordings, dan penyelenggara mendapat tautan. Unduh MP4 dari Drive.',
        },
      ],
    },
    {
      title: 'Dari transkrip ke notulen',
      paragraphs: [
        'Transkrip mentah belum menjadi notulen, tetapi membuat notulen cepat ditulis. Setelah transkrip selesai, ketik kata seperti tenggat, setuju, atau tindakan ke kotak Cari di teks di atasnya, atau nama orang yang terlibat. Kotak itu menunjukkan berapa banyak baris yang cocok, dan panah atas dan bawah berpindah dari satu ke berikutnya. Baca di sekitar setiap temuan, putar baris itu dari penanda waktunya jika belum jelas, dan salin baris ke catatan Anda beserta waktunya agar siapa pun bisa memeriksa rekamannya.',
        'Jika sebuah nama keluar dengan dua ejaan berbeda, cari ejaan yang salah, buka Ganti…, ketik yang benar dan terapkan ke semua baris sekaligus. Unduh Markdown untuk ditempel ke aplikasi catatan, atau PDF untuk diedarkan. Baris membawa waktu tetapi tidak ada label pembicara, jadi ketik nama saat Anda mengedit, dengan memakai rekaman untuk memeriksa siapa yang berbicara.',
      ],
    },
    {
      title: 'Izin, aturan, dan kehati-hatian',
      paragraphs: [
        'Beri tahu semua orang sebelum Anda merekam rapat dan minta izin mereka, dan ikuti aturan organisasi Anda tentang rekaman dan transkrip. Transkrip rapat yang rahasia sama sensitifnya dengan rekamannya, jadi simpan dan bagikan dengan kehati-hatian yang sama. Halaman ini tidak memberikan nasihat hukum.',
      ],
    },
  ],

  howTitle: 'Cara mengubah rekaman rapat ke teks',
  howToDescription:
    'Tambahkan rekaman rapat, pilih bahasanya, tunggu transkripnya selesai, lalu unduh sebagai teks atau subtitle.',
  steps: [
    {
      title: 'Tambahkan rekamannya',
      text: 'Tekan Pilih file, atau seret rekaman ke kotak di atas. Video MP4 maupun file audio M4A bisa dipakai, dan hanya suaranya yang dipakai. Kotak ini menerima satu rekaman setiap kali dan meneruskannya ke pengunggah di halaman berikutnya, tempat Tambah file lain memasukkan sisa panggilan satu hari.',
    },
    {
      title: 'Pilih bahasa dan kualitas',
      text: 'Di halaman berikutnya, pilih bahasa yang dipakai orang-orang, atau biarkan Deteksi otomatis. Standar cocok untuk sebagian besar panggilan. Jika perangkat Anda menyediakannya, Akurasi tinggi dan Akurasi terbaik cocok untuk pembicara yang cepat atau audio yang buruk; jika tidak, keduanya tampil diredupkan beserta alasannya. Keduanya lebih lambat dan membutuhkan unduhan pertama yang lebih besar. Jika orang berganti bahasa, pilih yang utama dan periksa baris yang ditandai ragu. Lalu tekan Transkripsikan.',
    },
    {
      title: 'Tunggu transkripnya',
      text: 'Baris muncul selagi rekaman diproses, dengan bilah kemajuan dan perkiraan sisa waktu. Rapat yang panjang memakan waktu lebih lama.',
      browser: {
        text: 'Baris muncul selagi rekaman diproses, dengan bilah kemajuan dan perkiraan sisa waktu. Perangkat Anda sendiri yang bekerja, jadi rapat yang panjang memakan waktu lebih lama: biarkan halaman ini terbuka sampai selesai.',
      },
    },
    {
      title: 'Cari, edit, dan ekspor',
      text: 'Ketik nama dan kata keputusan ke Cari di teks untuk melompat antarbaris, putar baris dari penanda waktunya untuk memeriksanya, dan perbaiki kesalahan. Lalu unduh TXT, Markdown, atau PDF. Tambahkan nama pembicara secara manual saat Anda mengedit.',
    },
  ],

  formatsTitle: 'File rekaman rapat dan format unduhan',
  formatsIntro:
    'Rekaman Zoom, Teams, dan Meet biasanya berupa MP4 atau M4A. File video dan audio lain juga bisa dipakai, dan hanya jalur suaranya yang dibaca.',
  uploadTitle: 'File rekaman yang bisa Anda tambahkan',
  accepts: ['MP4', 'M4A', 'MKV', 'MOV', 'WEBM', 'MP3', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'seluruh rapat sebagai teks biasa' },
    { name: 'Markdown', use: 'catatan berwaktu untuk ditempel ke aplikasi catatan' },
    { name: 'PDF', use: 'salinan untuk dicetak atau diedarkan' },
    { name: 'SRT', use: 'baris berwaktu untuk memberi keterangan pada rekaman' },
  ],

  tipsTitle: 'Tips untuk transkrip rapat',
  tips: [
    {
      title: 'Pakai file yang hanya berisi audio jika ada.',
      text: 'File itu memuat ucapan yang sama dalam ukuran yang jauh lebih kecil, jadi lebih cepat ditambahkan dan diproses.',
    },
    {
      title: 'Masukkan nama dan istilah ke petunjuk kosakata.',
      text: 'Di Opsi lainnya, daftarkan orang, nama produk, dan akronim yang dipakai dalam rapat. Dengan begitu nama dan akronim keluar sesuai harapan Anda.',
    },
    {
      title: 'Bersiaplah bahwa suara yang saling menyela menimbulkan kesalahan.',
      text: 'Ketika dua orang berbicara bersamaan, mesin pengenalan tidak bisa memisahkannya. Baris yang diragukan diberi tanda, jadi tinjau baris itu lebih dulu.',
    },
    {
      title: 'Tetap di bawah batasnya.',
      text: 'Rekaman yang melebihi batas ukuran atau durasi yang tertera di halaman ini tidak bisa diproses, jadi potong panggilan yang sangat panjang menjadi beberapa bagian lebih dulu.',
      browser: {
        title: 'Panggilan panjang butuh waktu lebih lama.',
        text: 'Situs ini tidak menetapkan batas durasi, tetapi rekaman lokakarya sehari penuh membutuhkan waktu dan memori kosong di perangkat Anda. Untuk membaca satu jam pertama lebih cepat, potong file menjadi beberapa bagian di aplikasi penyunting video.',
      },
    },
    {
      title: 'Bagikan transkrip dengan hati-hati.',
      text: 'Kirim hanya kepada orang yang hadir dalam rapat atau yang membutuhkannya, dan hapus ketika Anda tidak lagi membutuhkannya.',
    },
  ],

  faqs: [
    {
      question:
        'Bisakah TranscribeVid bergabung ke panggilan Zoom atau Teams saya dan mentranskripsikannya secara langsung?',
      answer:
        'Tidak. Layanan ini bekerja pada rekaman yang Anda simpan setelah rapat. Layanan ini tidak bisa bergabung dalam panggilan, dan bukan keterangan langsung. Untuk keterangan langsung, gunakan fitur pada alat rapat Anda.',
    },
    {
      question: 'Apakah transkrip rapat menunjukkan siapa yang mengatakan apa?',
      answer:
        'Tidak. Baris membawa waktu tetapi tidak ada nama. Tambahkan sendiri namanya saat Anda mengedit, dan periksa masing-masing terhadap rekamannya.',
    },
    {
      question: 'Apakah aman mentranskripsikan rekaman rapat yang rahasia di sini?',
      answer:
        'Server menerima rekaman lewat koneksi terenkripsi dan menghapusnya saat sesi Anda berakhir, atau lebih awal jika Anda menekan Hapus data saya sekarang. Periksa dulu apa yang diizinkan organisasi Anda. Ini bukan nasihat hukum.',
      browser: {
        answer:
          'Rekaman tidak diunggah: browser Anda mentranskripsikannya di perangkat Anda sendiri, dan menghapusnya setelah beberapa waktu tidak aktif atau saat Anda menekan Hapus data saya sekarang. Transkrip yang Anda unduh adalah file biasa di perangkat Anda, jadi jagalah seperti Anda menjaga rekamannya, dan periksa apa yang diizinkan organisasi Anda. Ini bukan nasihat hukum.',
      },
    },
    {
      question: 'Berapa lama rekaman rapat yang bisa saya transkripsikan?',
      answer: '{limits} File yang lebih panjang tidak bisa diproses, jadi pecah dulu.',
      browser: {
        answer:
          'Tidak ada batas pada rekaman itu sendiri, karena pekerjaannya terjadi di perangkat Anda sendiri. Yang membatasi Anda adalah waktu dan memori kosong: panggilan berdurasi beberapa jam dimungkinkan, halaman ini memperingatkan Anda jika perangkat Anda tampak terlalu lambat untuk itu, dan browser tanpa dukungan WebCodecs mungkin tidak sanggup menangani file yang sangat panjang.',
      },
    },
    {
      question: 'Bagaimana jika orang berganti bahasa selama rapat?',
      answer:
        'Pilih bahasa yang paling banyak diucapkan. Pengenalan paling baik mengikuti bahasa utama, jadi kata dalam bahasa lain mungkin tertulis salah. Baris yang diragukan diberi tanda: periksa baris itu terhadap rekamannya.',
    },
  ],

  links: [
    {
      label: 'MP4 ke teks',
      path: '/mp4-to-text',
      note: 'Pengaturan untuk rapat yang disimpan sebagai video MP4.',
    },
    {
      label: 'M4A ke teks',
      path: '/m4a-to-text',
      note: 'Untuk file yang hanya berisi audio, yang lebih kecil daripada videonya.',
    },
    {
      label: 'Transkripsi wawancara',
      path: '/interview-transcription',
      note: 'Untuk percakapan empat mata yang direkam, dengan catatan tentang persetujuan dan pemeriksaan kutipan.',
    },
    {
      label: 'Transkripsikan video tanpa mengunggahnya',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Di mana rekaman Anda tetap berada, dan cara memastikannya di browser Anda.',
    },
  ],
};
