import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MOV ke teks',
  h1: 'Transkripsikan video MOV ke teks',
  lead: 'MOV adalah format yang direkam iPhone, Mac, dan banyak kamera. Tambahkan MOV Anda dan dapatkan transkrip berpenanda waktu, gratis, tanpa login. Hanya suaranya yang dibaca, jadi ukuran dan codec gambar tidak berpengaruh.',
  dropKind: 'video',
  dropNoun: 'file MOV',

  whyTitle: 'Mengapa file MOV tidak perlu dikonversi',
  why: [
    'MOV adalah format QuickTime dari Apple. Seperti MP4, MOV menyimpan gambar dan suara bersama, dan sebagian besar file MOV membawa suara AAC yang dibaca langsung. TranscribeVid membaca suara itu dan mengabaikan gambarnya, jadi tidak perlu langkah terpisah dari MOV ke MP4.',
    'File MOV sering besar, karena ponsel dan kamera merekam dalam kualitas tinggi. Anda tidak harus memperkecil atau mengonversinya. Jalan tercepat dari galeri kamera ke transkrip adalah menambahkan file apa adanya.',
  ],

  sections: [
    {
      title: 'Dari mana file MOV berasal',
      bullets: [
        {
          title: 'Video iPhone dan iPad.',
          text: 'Video yang direkam dengan aplikasi Kamera disimpan sebagai file .MOV, baik format gambarnya H.264 maupun HEVC.',
        },
        {
          title: 'Rekaman layar Mac.',
          text: 'Toolbar tangkapan layar (Shift-Command-5) dan QuickTime Player menyimpan rekaman layar sebagai .mov. Pilih mikrofon sebelum merekam, atau file tidak memiliki ucapan sama sekali.',
        },
        {
          title: 'Kamera dan perangkat lunak penyunting.',
          text: 'Banyak kamera mirrorless merekam MOV, dan aplikasi penyunting video seperti Final Cut Pro dan Adobe Premiere Pro bisa mengekspornya.',
        },
      ],
    },
    {
      title: 'Mengambil video dari iPhone Anda',
      paragraphs: [
        'Cara paling sederhana adalah membuka halaman ini di iPhone itu sendiri dan menekan Pilih file. Anda bisa memilih video dari pustaka Foto atau dari Files. Jika ponsel menanyakan format mana yang dipakai saat Anda memilihnya, jawaban mana pun bisa, karena hanya suaranya yang dibaca.',
        'Untuk mentranskripsikan di komputer, kirim video lewat AirDrop, simpan ke Files atau iCloud Drive, atau salin dengan kabel. Nama menu berubah di antara versi iOS dan macOS, jadi anggap ini sebagai panduan.',
      ],
    },
    {
      title: 'Video dengan lebih dari satu jalur audio',
      paragraphs: [
        'Beberapa kamera dan aplikasi penyunting menulis beberapa jalur audio ke dalam satu MOV, misalnya mikrofon kamera dan mikrofon jepit. TranscribeVid memakai jalur audio pertama yang bisa dibacanya. Jika ucapan yang Anda inginkan ada di jalur lain, ekspor salinan dengan jalur itu terlebih dahulu, atau gabungkan semua jalur di aplikasi penyunting Anda.',
      ],
    },
  ],

  howTitle: 'Cara mengubah MOV ke teks',
  howToDescription:
    'Tambahkan video MOV, pilih bahasa yang diucapkan dan kualitasnya, tunggu transkripnya selesai, lalu unduh.',
  steps: [
    {
      title: 'Tambahkan MOV-nya',
      text: 'Tekan Pilih file di bagian atas halaman ini, atau letakkan file .mov di kotak. iPhone menawarkan Foto dan Files. Satu video muat dalam kotak ini setiap kali; Tambah file lain, di halaman berikutnya, menyiapkan yang lainnya.',
    },
    {
      title: 'Atur bahasa dan kualitas',
      text: 'Di halaman berikutnya, pilih bahasa yang diucapkan. Standar direkomendasikan. Untuk angin, lalu lintas, atau pembicara yang jauh, Akurasi tinggi dan Akurasi terbaik memakan waktu lebih lama dan lebih sedikit membuat kesalahan. Lalu tekan Transkripsikan.',
      browser: {
        text: 'Di halaman berikutnya, pilih bahasa yang diucapkan. Standar direkomendasikan. Untuk angin, lalu lintas, atau pembicara yang jauh, coba Akurasi tinggi atau Akurasi terbaik jika perangkat Anda menyediakannya: keduanya memakan waktu lebih lama dan lebih sedikit membuat kesalahan, masing-masing merupakan unduhan pertama yang lebih besar, dan perangkat yang tidak mampu menjalankan salah satunya menampilkannya diredupkan beserta alasannya. Lalu tekan Transkripsikan.',
      },
    },
    {
      title: 'Baca dan perbaiki',
      text: 'Teks datang baris demi baris dengan waktu di masing-masing baris. Putar dari baris mana pun, perbaiki yang salah, dan hapus baris yang tidak Anda inginkan.',
    },
    {
      title: 'Unduh transkripnya',
      text: 'Ambil TXT atau PDF untuk dibaca, atau SRT atau VTT untuk dipakai sebagai keterangan di aplikasi penyunting video atau di web. MOV Anda tidak pernah diubah.',
    },
  ],

  formatsTitle: 'MOV dan format video lainnya',
  formatsIntro:
    'Kotak yang sama menerima MOV dan jenis lain berikut, serta format audio yang lazim.',
  uploadTitle: 'File video yang bisa Anda tambahkan',
  accepts: ['MOV', 'MP4', 'M4V', 'MKV', 'WEBM', '3GP', 'TS'],
  downloads: [
    { name: 'TXT', use: 'kata-kata yang diucapkan sebagai teks biasa' },
    { name: 'SRT', use: 'keterangan untuk aplikasi penyunting dan pemutar' },
    { name: 'VTT', use: 'keterangan untuk halaman web' },
    { name: 'PDF', use: 'transkrip untuk dicetak atau dibagikan' },
    { name: 'Markdown', use: 'catatan dengan waktu' },
    { name: 'JSON', use: 'data untuk alat Anda sendiri' },
  ],

  tipsTitle: 'Tips untuk mentranskripsikan video MOV',
  tips: [
    {
      title: 'Biarkan Perbaiki audio tetap aktif.',
      text: 'Video dari ponsel menangkap angin, bunyi saat memegang ponsel, dan gema ruangan. Sakelar Perbaiki audio di Opsi lainnya menghilangkan dengung rendah dan desis serta menaikkan suara yang pelan.',
    },
    {
      title: 'Periksa jalur mana yang berisi suara.',
      text: 'Jika kamera merekam dua mikrofon sebagai jalur terpisah, putar videonya dan pastikan jalur pertama adalah yang berisi ucapan.',
    },
    {
      title: 'Potong rekaman panjang pada jeda yang wajar.',
      text: 'File yang melebihi batas ukuran atau durasi ditolak. Potong video menjadi beberapa bagian, atau ekspor audionya saja, lalu tambahkan.',
      browser: {
        title: 'Rekaman panjang membutuhkan memori.',
        text: 'Situs ini tidak menetapkan batas ukuran atau durasi, tetapi video yang panjang membutuhkan waktu dan memori kosong, terutama di ponsel, dan browser yang lebih lama mungkin menolak file yang sangat panjang. Untuk rekaman yang sangat panjang, ekspor audionya saja dari aplikasi penyunting Anda atau potong videonya menjadi beberapa bagian.',
      },
    },
    {
      title: 'Rekam dengan suara secara sengaja.',
      text: 'Rekaman layar Mac yang dibuat tanpa mikrofon tidak memiliki ucapan, dan transkripnya keluar kosong.',
    },
  ],

  faqs: [
    {
      question: 'Bisakah saya mentranskripsikan video iPhone tanpa mengonversi MOV ke MP4?',
      answer:
        'Bisa. Tambahkan MOV apa adanya. TranscribeVid membaca jalur suaranya dan mengabaikan gambarnya, jadi tidak perlu konversi.',
    },
    {
      question: 'Apakah video 4K atau HEVC dari iPhone saya bisa dipakai?',
      answer:
        'Bisa. Hanya suaranya yang dipakai, jadi ukuran gambar dan format video tidak berpengaruh. Yang penting adalah jalur suaranya, dan rekaman iPhone dan Mac memakai suara AAC, yang dibaca langsung.',
    },
    {
      question: 'Bagaimana cara memindahkan video dari iPhone ke komputer untuk ditranskripsikan?',
      answer:
        'Kirim lewat AirDrop ke Mac, simpan ke Files atau iCloud Drive, atau salin dengan kabel. Atau lewati komputer: buka halaman ini di iPhone dan pilih video dari Foto.',
    },
    {
      question: 'Mengapa rekaman layar Mac saya tidak menghasilkan teks?',
      answer:
        'Rekaman layar hanya membawa suara jika mikrofon dipilih sebelum merekam. Di toolbar Shift-Command-5, buka Opsi, pilih mikrofon, dan rekam lagi. Nama menu bisa berbeda di antara versi macOS.',
    },
    {
      question: 'Apa yang terjadi jika MOV saya memiliki dua jalur audio?',
      answer:
        'TranscribeVid memakai jalur audio pertama yang bisa dibacanya. Jika ucapan ada di jalur lain, ekspor salinan dengan jalur itu terlebih dahulu, atau gabungkan semua jalur di aplikasi penyunting Anda.',
    },
  ],

  links: [
    {
      label: 'MP4 ke teks',
      path: '/mp4-to-text',
      note: 'Layanan yang sama untuk file MP4, format video ponsel lain yang umum.',
    },
    {
      label: 'Video ke teks',
      path: '/video-to-text',
      note: 'Halaman utama untuk file video apa pun, dengan tips untuk kuliah, wawancara, dan klip.',
    },
    {
      label: 'Pembuat subtitle SRT',
      path: '/srt-subtitle-generator',
      note: 'Buat keterangan untuk MOV Anda dan lihat seperti apa isi file SRT.',
    },
    {
      label: 'Cara menambahkan subtitle ke video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Apa yang dilakukan dengan file subtitle setelah Anda mengunduhnya.',
    },
  ],
};
