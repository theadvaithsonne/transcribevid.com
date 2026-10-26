import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Audio ke teks',
  h1: 'Ubah audio ke teks tanpa perlu mendaftar',
  lead: 'Masukkan podcast, wawancara, kuliah, atau catatan suara dan dapatkan transkrip berpenanda waktu yang bisa dicari, diedit, dan diunduh. Gratis, tanpa batas, dan dalam lebih dari 50 bahasa.',
  dropKind: 'audio',
  dropNoun: 'file audio',
  record: true,

  whyTitle: 'Kapan audio ke teks sangat berguna',
  why: [
    'Audio adalah media yang paling sulit dibaca sekilas. Anda tidak bisa mencarinya, memindainya, atau mengutipnya tanpa mendengarkannya lagi. Transkrip memungkinkan Anda menemukan menit tepat saat sesuatu diucapkan, mengambil kutipan yang persis, dan membaca percakapan berdurasi satu jam hanya dalam beberapa menit.',
    'Pekerjaan yang umum meliputi catatan acara podcast, wawancara untuk jurnalisme atau penelitian, sejarah lisan, catatan suara, draf hasil dikte, serta rekaman pelajaran atau ceramah. Transkripsikan hanya rekaman yang Anda buat sendiri atau yang Anda punya izin untuk memakainya.',
  ],

  howTitle: 'Cara mengubah audio ke teks',
  howToDescription:
    'Tambahkan file audio atau rekam sendiri, pilih bahasanya, tunggu transkripnya selesai, lalu unduh.',
  steps: [
    {
      title: 'Tambahkan audio Anda',
      text: 'Letakkan file audio di kotak pada bagian atas halaman ini, atau tekan Pilih file. Untuk merekam yang baru, tekan Rekam dengan mikrofon Anda di bawah kotak.',
    },
    {
      title: 'Pilih bahasanya',
      text: 'Pilih bahasa yang diucapkan, atau biarkan Deteksi otomatis aktif. Standar adalah awal yang baik untuk ucapan yang jernih. Tercepat sangat cepat, sedangkan Akurasi terbaik paling lama dan paling sedikit membuat kesalahan.',
    },
    {
      title: 'Tunggu teksnya muncul',
      text: 'Baris muncul begitu dikenali. Perbaiki audio, yang aktif secara bawaan, menyaring dengung dan desis serta menyeimbangkan suara pembicara yang pelan.',
    },
    {
      title: 'Tinjau dan ekspor',
      text: 'Putar baris mana pun dari penanda waktunya, perbaiki kesalahan, lalu unduh transkrip dalam format yang Anda butuhkan.',
    },
  ],

  formatsTitle: 'File audio yang didukung dan format unduhan',
  formatsIntro:
    'Format audio yang umum semuanya bisa dipakai. File video juga diterima, dan hanya suaranya yang dipakai.',
  uploadTitle: 'File audio yang bisa Anda unggah',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'teks bersih untuk catatan dan draf' },
    { name: 'Markdown', use: 'teks dengan waktu, siap untuk aplikasi catatan' },
    { name: 'PDF', use: 'transkrip yang siap dicetak' },
    { name: 'SRT', use: 'baris berwaktu untuk subtitle atau keterangan video' },
    { name: 'VTT', use: 'baris berwaktu untuk pemutar web' },
    { name: 'JSON', use: 'setiap baris dan waktunya, untuk program' },
  ],

  tipsTitle: 'Tips untuk transkrip audio yang akurat',
  tips: [
    {
      title: 'Dekatkan diri ke mikrofon.',
      text: 'Gema dan jarak biasanya lebih berpengaruh daripada format file. Ruangan yang tenang dan mikrofon yang dekat mengalahkan pengaturan apa pun.',
    },
    {
      title: 'Satu suara dalam satu waktu.',
      text: 'Pembicara yang saling menyela, musik di bawah ucapan, dan kebisingan latar yang kuat menyebabkan sebagian besar kesalahan.',
    },
    {
      title: 'Unggah file aslinya.',
      text: 'Menyimpan ulang rekaman menjadi file yang lebih kecil menghilangkan detail. Pakai file asli atau salinan berkualitas terbaik yang Anda punya.',
    },
    {
      title: 'Gunakan petunjuk kosakata.',
      text: 'Nama, merek, dan istilah teknis adalah hal yang paling sering salah dikenali. Tuliskan di Opsi lainnya.',
    },
    {
      title: 'Minta izin sebelum merekam.',
      text: 'Dapatkan izin sebelum Anda merekam atau mentranskripsikan suara orang lain, dan periksa aturan setempat tentang perekaman panggilan.',
    },
  ],

  faqs: [
    {
      question: 'Format audio apa saja yang bisa diubah ke teks?',
      answer:
        'MP3, WAV, M4A, AAC, FLAC, OGG, dan OPUS. File video seperti MP4 dan MKV juga bisa, karena hanya suaranya yang dipakai.',
    },
    {
      question: 'Bisakah saya merekam audio langsung di halaman ini?',
      answer:
        'Bisa, di browser yang mengizinkan akses mikrofon. Tekan Rekam dari mikrofon, izinkan akses saat diminta, lalu hentikan. Rekaman ditranskripsikan setelah Anda berhenti, bukan saat Anda berbicara.',
    },
    {
      question: 'Apakah bisa untuk wawancara dua orang?',
      answer:
        'Bisa, ucapan kedua orang ditranskripsikan. Nama atau label pembicara tidak ditambahkan, tetapi setiap baris memiliki penanda waktu dan Anda bisa mengetik nama ke dalam teks saat mengedit.',
    },
    {
      question: 'Berapa lama durasi audio yang diperbolehkan?',
      answer:
        '{limits} File yang lebih panjang atau lebih besar ditolak sebelum diproses, jadi pecah dulu. Tidak ada kuota harian atau bulanan.',
      browser: {
        answer:
          'Kami tidak menetapkan batas: audio ditranskripsikan di browser, di perangkat Anda sendiri, jadi rekaman yang panjang hanya memakan waktu lebih lama dan membutuhkan memori kosong yang cukup. Halaman ini memberi peringatan di perangkat yang lebih lambat. Tidak ada kuota harian atau bulanan.',
      },
    },
    {
      question: 'Apakah audio saya disimpan?',
      answer:
        'File hanya disimpan selama sesi Anda dan dihapus otomatis saat sesi berakhir, atau langsung saat Anda menekan Hapus data saya sekarang. Tidak ada akun.',
      browser: {
        answer:
          'Hanya di browser ini: audio Anda tidak pernah meninggalkan perangkat Anda. Audio dihapus otomatis setelah beberapa waktu tidak aktif, atau langsung saat Anda menekan Hapus data saya sekarang. Tidak ada akun.',
      },
    },
  ],
};
