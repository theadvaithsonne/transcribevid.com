import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WebM ke teks',
  h1: 'Transkripsikan rekaman WebM ke teks',
  lead: 'WebM adalah format yang disimpan oleh browser dan perekam layar. Tambahkan video atau audio WebM Anda dan dapatkan transkrip berpenanda waktu, gratis, tanpa login dan tanpa konversi lebih dulu.',
  dropKind: 'video',
  dropNoun: 'file WebM',

  whyTitle: 'Apa isi file WebM',
  why: [
    'WebM adalah wadah yang ramah web. Biasanya isinya video VP8, VP9, atau AV1 dengan suara Opus atau Vorbis. TranscribeVid hanya membaca suaranya, jadi tidak penting codec video apa yang ada di dalamnya, dan WebM yang hanya berisi audio bekerja sama baiknya.',
    'Opus, format suara yang dipakai sebagian besar file WebM, dirancang untuk suara manusia, sehingga rekaman seperti ini menjadi sumber yang baik untuk transkrip. Hasilnya berupa teks dengan waktu di setiap baris, siap dicari, dikutip, atau diubah menjadi subtitle.',
  ],

  sections: [
    {
      title: 'Dari mana file WebM berasal',
      paragraphs: [
        'Sebagian besar file WebM dibuat oleh browser itu sendiri, itulah sebabnya file ini muncul setiap kali seseorang merekam sesuatu secara online.',
      ],
      bullets: [
        {
          title: 'Perekam layar dan browser.',
          text: 'Banyak ekstensi perekam layar dan perekam web menyimpan WebM, karena itulah format yang bisa direkam langsung oleh browser.',
        },
        {
          title: 'Perekam suara online.',
          text: 'Situs web yang merekam mikrofon Anda sering memberi file audio .webm. File itu mungkin tampak seperti file video, tetapi hanya berisi suara.',
        },
        {
          title: 'Aplikasi web yang Anda buat atau uji.',
          text: 'Halaman yang merekam dengan fitur MediaRecorder pada browser biasanya menghasilkan WebM di Chrome. Firefox melakukan hal yang sama untuk video, tetapi rekaman yang hanya berisi suara sering berformat Ogg, yang juga dibaca oleh halaman ini.',
        },
      ],
    },
    {
      title: 'Keanehan pada file WebM hasil rekaman',
      paragraphs: [
        'WebM yang direkam langsung di browser sering kali tidak memiliki total durasi yang tertulis di dalam file. Beberapa pemutar lalu menampilkan durasi tidak diketahui atau tidak bisa melompat maju, yang bisa terlihat seperti file rusak. Suaranya sendiri utuh, dan transkrip dibuat darinya seperti biasa.',
        'Jika sebuah rekaman memang gagal, penyebabnya biasanya lebih sederhana: mikrofon mati, sehingga sama sekali tidak ada ucapan di dalamnya. Putar file dengan volume dinaikkan sebelum Anda mencari alasan lain.',
      ],
    },
  ],

  howTitle: 'Cara mengubah WebM ke teks',
  howToDescription:
    'Tambahkan file WebM, pilih bahasa yang diucapkan, periksa barisnya, lalu unduh transkrip sebagai teks atau subtitle WebVTT.',
  steps: [
    {
      title: 'Tambahkan WebM-nya',
      text: 'Letakkan file .webm di kotak pada bagian atas halaman ini, atau tekan Pilih file. WebM yang hanya berisi suara masuk dengan cara yang sama. Untuk beberapa rekaman, tambahkan yang pertama di sini dan sisanya dengan Tambah file lain di halaman berikutnya.',
    },
    {
      title: 'Pilih bahasanya',
      text: 'Di halaman berikutnya, pilih bahasa yang diucapkan, atau biarkan Deteksi otomatis untuk rekaman dalam satu bahasa. Kualitas Standar cocok untuk ucapan jernih dari mikrofon yang baik. Lalu tekan Transkripsikan.',
    },
    {
      title: 'Periksa barisnya',
      text: 'Lihat teks datang baris demi baris. Buka transkrip, putar dari penanda waktu mana pun, dan perbaiki kata yang salah.',
    },
    {
      title: 'Unduh hasilnya',
      text: 'Ambil TXT untuk dibaca atau dicari. WebM cocok untuk web, jadi VTT adalah file subtitle yang wajar untuknya. SRT dan PDF juga tersedia.',
    },
  ],

  formatsTitle: 'WebM dan format video lainnya',
  formatsIntro: 'WebM hanyalah satu dari banyak jenis video dan audio yang diterima kotak ini.',
  uploadTitle: 'File yang bisa Anda tambahkan',
  accepts: ['WEBM', 'MP4', 'MKV', 'MOV', 'OGG', 'OPUS', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'TXT', use: 'kata-kata yang diucapkan sebagai teks biasa' },
    { name: 'VTT', use: 'subtitle untuk WebM yang sama di halaman web' },
    { name: 'SRT', use: 'subtitle untuk pemutar dan aplikasi penyunting' },
    { name: 'Markdown', use: 'catatan dengan waktu' },
    { name: 'JSON', use: 'setiap baris dan waktunya, untuk program' },
    { name: 'PDF', use: 'transkrip untuk dicetak atau dibagikan' },
  ],

  tipsTitle: 'Tips untuk mentranskripsikan rekaman WebM',
  tips: [
    {
      title: 'Nyalakan mikrofon sebelum merekam.',
      text: 'Perekam layar sering hanya menangkap gambar kecuali Anda mencentang opsi mikrofon atau audio sistem. Tanpa suara, tidak ada yang bisa ditranskripsikan.',
    },
    {
      title: 'Bersiaplah dengan satu jalur suara.',
      text: 'Jika Anda merekam tab rapat bersama mikrofon Anda sendiri, semua orang berakhir di jalur yang sama. Tidak ada label pembicara, jadi tambahkan nama saat Anda mengedit.',
    },
    {
      title: 'Gunakan VTT untuk web.',
      text: 'Elemen video pada browser membaca subtitle VTT lewat elemen track. Elemen itu tidak membaca SRT, jadi pilih VTT untuk WebM di halaman Anda sendiri.',
    },
    {
      title: 'Potong rekaman yang sangat panjang.',
      text: 'File yang melebihi batas ukuran atau durasi ditolak, jadi potong WebM yang panjang menjadi beberapa bagian lebih dulu.',
      browser: {
        title: 'Rekaman panjang butuh waktu lebih lama.',
        text: 'Situs ini tidak menetapkan batas ukuran atau durasi. Tangkapan layar yang panjang tetap membutuhkan waktu dan memori kosong, dan browser yang lebih lama mungkin menolak file yang sangat panjang, jadi di ponsel potong menjadi beberapa bagian lebih dulu.',
      },
    },
    {
      title: 'Daftarkan nama dan perintah.',
      text: 'Untuk demo perangkat lunak, masukkan nama produk, perintah, dan akronim ke petunjuk kosakata agar ejaannya sesuai cara Anda menuliskannya.',
    },
  ],

  faqs: [
    {
      question:
        'Mengapa WebM saya tidak bisa diputar di ponsel, dan apakah saya masih bisa mentranskripsikannya?',
      answer:
        'Beberapa ponsel dan pemutar lama tidak bisa membuka WebM. Itu tidak masalah di sini: TranscribeVid hanya membutuhkan suaranya, jadi Anda tetap bisa menambahkan file dan mendapatkan transkrip.',
    },
    {
      question: 'Bisakah saya mentranskripsikan WebM yang hanya berisi audio?',
      answer:
        'Bisa. Beberapa perekam menyimpan file yang hanya berisi suara dengan ekstensi .webm. File itu dibaca seperti file audio lainnya.',
    },
    {
      question: 'Apakah penting jika WebM saya memakai VP8, VP9, atau AV1?',
      answer:
        'Tidak. Gambarnya diabaikan. Yang penting adalah file memiliki jalur suara dalam format yang umum seperti Opus.',
    },
    {
      question: 'Bagaimana cara memakai subtitle dengan WebM di halaman web saya sendiri?',
      answer:
        'Unduh file VTT, simpan di samping videonya, dan arahkan elemen track di dalam elemen video ke file itu. Halaman pembuat subtitle VTT menunjukkan seperti apa isi file tersebut dan markup yang tepat.',
    },
    {
      question: 'Mengapa rekaman layar saya menghasilkan transkrip kosong?',
      answer:
        'Kemungkinan besar rekaman itu tidak berisi ucapan: mikrofon mati atau hanya suara sistem yang terekam. Jika Anda bisa mendengar orang berbicara tetapi tidak mendapat teks, biarkan Perbaiki audio tetap aktif di Opsi lainnya dan coba pengaturan kualitas yang lebih tinggi.',
    },
  ],

  links: [
    {
      label: 'Pembuat subtitle VTT',
      path: '/vtt-subtitle-generator',
      note: 'Apa isi file WebVTT dan cara memasangnya pada video di halaman Anda sendiri.',
    },
    {
      label: 'Cara menambahkan subtitle ke video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Seluruh alurnya dari rekaman sampai keterangan yang terbit, langkah demi langkah.',
    },
    {
      label: 'Rekaman rapat ke teks',
      path: '/meeting-recording-to-text',
      note: 'Untuk panggilan dan webinar yang direkam, termasuk cara mengeluarkan rekaman dari alat rapatnya.',
    },
    {
      label: 'MP4 ke teks',
      path: '/mp4-to-text',
      note: 'Layanan yang sama untuk MP4, format video yang paling umum.',
    },
  ],
};
