import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP4 ke teks',
  h1: 'Transkripsikan video MP4 ke teks',
  lead: 'MP4 adalah format kamera ponsel, perekam layar, dan hasil ekspor rapat. Unggah file Anda dan dapatkan transkrip berpenanda waktu, gratis dan tanpa login.',
  dropKind: 'video',
  dropNoun: 'file MP4',

  whyTitle: 'Mengapa file MP4 mudah ditranskripsikan',
  why: [
    'MP4 adalah wadah: gambar dan suara tersimpan bersama di dalamnya. TranscribeVid membaca suaranya dan mengabaikan gambarnya, jadi tidak ada yang perlu dikonversi lebih dulu dan tidak perlu langkah terpisah dari MP4 ke MP3.',
    'Cocok untuk rekaman yang memang sudah berformat MP4, seperti video dari ponsel, rapat Zoom atau Teams yang disimpan, tangkapan layar, webinar, dan rekaman kuliah. Hasilnya berupa teks dengan waktu di setiap baris, siap dicari atau diubah menjadi subtitle.',
  ],

  howTitle: 'Cara mengubah MP4 ke teks',
  howToDescription:
    'Unggah MP4, pilih bahasa yang diucapkan dan kualitasnya, tunggu transkripnya selesai, lalu unduh.',
  steps: [
    {
      title: 'Temukan file MP4-nya',
      text: 'Cari file .mp4 di ponsel atau komputer Anda. Anda tidak perlu mengompres atau memotongnya kecuali ukurannya melebihi batas.',
      browser: {
        text: 'Cari file .mp4 di ponsel atau komputer Anda. Anda tidak perlu mengompres atau memotongnya terlebih dahulu.',
      },
    },
    {
      title: 'Unggah file tersebut',
      text: 'Letakkan MP4 di kotak pada bagian atas halaman ini, atau tekan Pilih file. Di pengunggah, beberapa file MP4 bisa dimasukkan ke antrean sekaligus.',
      browser: {
        title: 'Tambahkan file tersebut',
        text: 'Letakkan MP4 di kotak pada bagian atas halaman ini, atau tekan Pilih file. Di pengunggah Anda bisa menambah beberapa file MP4; semuanya ditranskripsikan satu per satu.',
      },
    },
    {
      title: 'Pilih bahasa dan kualitas',
      text: 'Pilih bahasa yang diucapkan. Standar direkomendasikan. Akurasi tinggi dan Akurasi terbaik lebih lambat dan lebih sedikit membuat kesalahan, sedangkan Tercepat sangat cepat untuk ucapan yang jernih.',
    },
    {
      title: 'Unduh hasilnya',
      text: 'Ambil TXT untuk dibaca, SRT atau VTT untuk dipakai sebagai subtitle bersama MP4 yang sama, atau PDF untuk dicetak.',
    },
  ],

  formatsTitle: 'MP4 dan format video lainnya',
  formatsIntro:
    'MP4 adalah kasus yang paling umum, tetapi pengunggah yang sama juga menerima jenis video berikut dan format audio yang lazim.',
  uploadTitle: 'File video yang bisa Anda unggah',
  accepts: ['MP4', 'M4V', 'MOV', 'MKV', 'WEBM', 'AVI', 'WMV', 'FLV', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'kata-kata yang diucapkan sebagai teks biasa' },
    { name: 'SRT', use: 'file subtitle untuk MP4 yang sama' },
    { name: 'VTT', use: 'subtitle untuk halaman web' },
    { name: 'PDF', use: 'transkrip untuk dicetak atau dibagikan' },
    { name: 'Markdown', use: 'catatan dengan waktu' },
    { name: 'JSON', use: 'data untuk alat Anda sendiri' },
  ],

  tipsTitle: 'Tips untuk mentranskripsikan file MP4',
  tips: [
    {
      title: 'Pastikan ada suaranya.',
      text: 'Rekaman layar yang dibuat tanpa audio tidak memiliki ucapan untuk ditranskripsikan dan menghasilkan keluaran kosong.',
    },
    {
      title: 'Perhatikan angin dan ruangan.',
      text: 'Video dari ponsel terganggu oleh angin, jarak, dan gema. Dekatkan ponsel, atau tambahkan mikrofon eksternal lain kali.',
    },
    {
      title: 'Perkecil file besar dengan mengekspor audionya.',
      text: 'Jika MP4 melebihi batas, ekspor audionya saja (M4A atau MP3) dari aplikasi penyunting Anda. Ukurannya jauh lebih kecil dan hasilnya sama.',
      browser: {
        text: 'MP4 yang sangat panjang membutuhkan banyak memori di ponsel. Ekspor audionya saja (M4A atau MP3) dari aplikasi penyunting Anda: ukurannya jauh lebih kecil dan hasilnya sama.',
      },
    },
    {
      title: 'Simpan SRT di samping videonya.',
      text: 'Banyak pemutar memuat file .srt secara otomatis jika namanya sama dengan nama videonya.',
    },
    {
      title: 'Periksa nama dan angka.',
      text: 'Transkrip otomatis paling sering keliru pada hal-hal ini. Cari dan ganti memperbaiki pengulangannya sekaligus.',
    },
  ],

  faqs: [
    {
      question: 'Apakah saya perlu mengonversi MP4 ke MP3 lebih dulu?',
      answer: 'Tidak. Unggah MP4 apa adanya. Suaranya dibaca langsung dari file.',
    },
    {
      question: 'Mengapa MP4 saya ditolak?',
      answer:
        'File yang melebihi batas ukuran atau durasi ditolak sebelum diproses. {limits} Potong video menjadi beberapa bagian, atau ekspor audionya saja, lalu unggah lagi.',
      browser: {
        question: 'Mengapa MP4 saya tidak berhasil?',
        answer:
          'Browser Anda tidak bisa membaca suaranya: file mungkin rusak, tidak memiliki jalur suara, atau memakai format audio yang jarang. Ekspor audionya sebagai M4A atau MP3 dari aplikasi penyunting Anda dan tambahkan file itu sebagai gantinya. Tidak ada batas ukuran atau durasi, tetapi video yang sangat panjang membutuhkan memori kosong yang cukup.',
      },
    },
    {
      question: 'Bisakah saya menambahkan subtitle ke MP4 dengan layanan ini?',
      answer:
        'Anda mendapatkan file subtitle (SRT atau VTT) yang waktunya disesuaikan dengan ucapan. TranscribeVid tidak mengedit atau mengenkode ulang MP4 Anda, jadi untuk menanamkan subtitle ke dalam gambar Anda memerlukan aplikasi penyunting video.',
    },
    {
      question: 'Bisakah saya menempelkan tautan alih-alih mengunggah?',
      answer:
        'Tidak. TranscribeVid bekerja dengan file yang Anda unggah atau rekam, bukan tautan web. Jika video itu milik Anda, unggah file aslinya.',
    },
    {
      question: 'Apakah bisa dipakai untuk Zoom, Teams, dan video dari ponsel?',
      answer:
        'Ya, MP4 apa pun yang berisi ucapan bisa dipakai. Nama pembicara tidak ditambahkan pada rapat, tetapi barisnya berpenanda waktu sehingga Anda bisa menambahkan nama saat mengedit.',
    },
  ],
};
