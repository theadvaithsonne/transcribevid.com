import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP3 ke teks',
  h1: 'Ubah MP3 ke teks secara online',
  lead: 'Dari episode podcast hingga rekaman kuliah dan pesan suara, MP3 adalah format audio yang kebanyakan dari kita punya berlimpah. Unggah MP3 dan dapatkan transkrip berpenanda waktu secara gratis, tanpa login.',
  dropKind: 'audio',
  dropNoun: 'file MP3',

  whyTitle: 'Manfaat transkrip MP3 bagi Anda',
  why: [
    'MP3 memadatkan audio menjadi file kecil, itulah sebabnya podcast, perekam suara, dan kuliah yang diunduh memakainya. Hal itu membantu di sini juga: MP3 terunggah dengan cepat bahkan pada koneksi yang lambat, dan MP3 berdurasi satu jam pada 128 kbps hanya sekitar 58 MB.',
    'Transkrip memungkinkan Anda mencari satu frasa di episode yang panjang, mengutip narasumber secara persis, menulis catatan acara tanpa memutar ulang acaranya, atau menyimpan catatan tertulis dari ceramah atau pesan suara.',
  ],
  browserWhy: [
    'MP3 memadatkan audio menjadi file kecil, itulah sebabnya podcast, perekam suara, dan kuliah yang diunduh memakainya. Hal itu membantu di sini juga: browser Anda membaca MP3 dengan cepat, dan MP3 berdurasi satu jam pada 128 kbps hanya sekitar 58 MB.',
    'Transkrip memungkinkan Anda mencari satu frasa di episode yang panjang, mengutip narasumber secara persis, menulis catatan acara tanpa memutar ulang acaranya, atau menyimpan catatan tertulis dari ceramah atau pesan suara.',
  ],

  howTitle: 'Cara mengubah MP3 ke teks',
  howToDescription:
    'Unggah MP3, pilih bahasa yang diucapkan, tunggu transkripnya selesai, lalu unduh sebagai teks atau subtitle.',
  steps: [
    {
      title: 'Pilih MP3 Anda',
      text: 'Letakkan file .mp3 di kotak pada bagian atas halaman ini, atau tekan Pilih file. Di pengunggah Anda bisa menambah lebih dari satu, dan masing-masing menjadi transkripnya sendiri.',
    },
    {
      title: 'Pilih bahasanya',
      text: 'Pilih bahasa yang diucapkan atau biarkan Deteksi otomatis aktif. Untuk mendapatkan teks bahasa Inggris dari bahasa lain, buka Opsi lainnya dan atur Output ke Terjemahkan ke bahasa Inggris.',
    },
    {
      title: 'Tunggu transkripnya',
      text: 'Teks muncul selagi file diproses, lengkap dengan bilah kemajuan. Tercepat sangat cepat, sedangkan Akurasi terbaik paling lama dan paling sedikit membuat kesalahan.',
    },
    {
      title: 'Perbaiki dan unduh',
      text: 'Perbaiki baris mana pun, lalu unduh TXT untuk dibaca, atau SRT dan VTT jika audionya menjadi bagian dari video atau pemutar web.',
    },
  ],

  formatsTitle: 'MP3 dan format audio lainnya',
  formatsIntro:
    'MP3 adalah unggahan audio yang paling umum. Format audio lain berikut bekerja dengan cara yang sama, dan file video juga diterima.',
  uploadTitle: 'File audio yang bisa Anda unggah',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'episode atau ceramah sebagai teks biasa' },
    { name: 'Markdown', use: 'catatan acara dengan penanda waktu' },
    { name: 'SRT', use: 'keterangan untuk versi video' },
    { name: 'VTT', use: 'jalur transkrip untuk pemutar web' },
    { name: 'PDF', use: 'transkrip untuk dicetak atau dikirim' },
    { name: 'JSON', use: 'baris terstruktur untuk program' },
  ],

  tipsTitle: 'Tips untuk mentranskripsikan file MP3',
  tips: [
    {
      title: 'Unggah salinan terbaik.',
      text: 'MP3 bersifat lossy dan setiap kali disimpan ulang, sedikit lagi detail hilang. Jika Anda masih punya WAV atau rekaman aslinya, unggah itu sebagai gantinya.',
    },
    {
      title: 'Hindari bitrate yang sangat rendah.',
      text: 'Ucapan tahan terhadap kompresi dengan baik, tetapi bitrate yang sangat rendah mengaburkan konsonan dan menurunkan akurasi.',
    },
    {
      title: 'Pecah episode yang panjang.',
      text: 'File yang melebihi batas durasi ditolak. Potong episode dua jam menjadi beberapa bagian di aplikasi penyunting audio mana pun lebih dulu.',
      browser: {
        text: 'Tidak ada batas durasi, tetapi episode dua jam memakan waktu cukup lama di perangkat yang lebih lambat. Potong menjadi beberapa bagian di aplikasi penyunting audio mana pun agar bagian pertama bisa dibaca lebih cepat.',
      },
    },
    {
      title: 'Tangani intro dan musik.',
      text: 'Biarkan Lewati keheningan & musik tetap aktif di Opsi lainnya, agar jingle dan jeda panjang tidak menghasilkan kata-kata karangan.',
    },
    {
      title: 'Tuliskan nama para tamu.',
      text: 'Masukkan pembawa acara, tamu, nama acara, dan merek ke petunjuk kosakata satu kali, dan peluang hasilnya benar jauh lebih besar.',
    },
  ],

  faqs: [
    {
      question: 'Berapa lama durasi MP3 yang diperbolehkan?',
      answer:
        '{limits} MP3 berdurasi 60 menit pada 128 kbps sekitar 58 MB, jadi batas durasi lebih menentukan daripada batas ukuran. Tidak ada kuota harian atau bulanan.',
      browser: {
        answer:
          'Kami tidak menetapkan batas ukuran atau durasi, karena MP3 ditranskripsikan di browser, di perangkat Anda sendiri. MP3 berdurasi 60 menit pada 128 kbps sekitar 58 MB; file yang lebih panjang hanya memakan waktu lebih lama, dan halaman ini memberi peringatan di perangkat yang lebih lambat. Tidak ada kuota harian atau bulanan.',
      },
    },
    {
      question: 'Apakah kompresi MP3 memengaruhi akurasi?',
      answer:
        'Tidak banyak pada kualitas normal, karena ucapan adalah kasus yang mudah bagi MP3. Derau, gema, dan suara yang tumpang tindih jauh lebih berpengaruh daripada formatnya, jadi pilih file asli yang bersih jika Anda memilikinya.',
    },
    {
      question: 'Bisakah saya mentranskripsikan beberapa file MP3 sekaligus?',
      answer:
        'Bisa. Tambahkan semuanya sekaligus dan masing-masing menjadi transkripnya sendiri dalam sesi Anda, yang bisa dibuka dan diunduh secara terpisah.',
    },
    {
      question: 'Bisakah saya menerjemahkan MP3 ke bahasa Inggris?',
      answer:
        'Bisa. Di Opsi lainnya atur Output ke Terjemahkan ke bahasa Inggris. Terjemahannya otomatis, jadi baca teks bahasa Inggrisnya sebelum Anda memakainya. Bahasa tujuan lain tidak tersedia.',
    },
    {
      question: 'Apakah MP3 saya disimpan?',
      answer:
        'Hanya selama sesi Anda. File dihapus otomatis saat sesi berakhir, atau saat Anda menekan Hapus data saya sekarang. Tidak perlu akun.',
      browser: {
        answer:
          'Hanya di browser ini: MP3 Anda tidak pernah meninggalkan perangkat Anda. File dihapus otomatis setelah beberapa waktu tidak aktif, atau saat Anda menekan Hapus data saya sekarang. Tidak perlu akun.',
      },
    },
  ],
};
