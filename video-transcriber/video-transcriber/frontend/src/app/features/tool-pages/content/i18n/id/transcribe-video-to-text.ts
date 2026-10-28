import { ToolPageContent } from '../../../tool-page.model';

/** Kutipan dari situs lain adalah isi halaman masing-masing pada 28 Oktober 2026; panduan yang ditautkan di bawah memuat tabel lengkap beserta sumbernya. */
export const CONTENT: ToolPageContent = {
  eyebrow: 'Transkrip video ke teks',
  h1: 'Transkrip video ke teks: gratis, tanpa daftar, tanpa batas harian',
  browserH1: 'Transkrip video ke teks: gratis, tanpa daftar, tanpa batas, tanpa unggah',
  lead: 'Tambahkan video dan terima ucapannya sebagai teks, dengan penanda waktu di setiap baris. Tidak perlu membuat akun dan tidak ada batas harian, jadi video berikutnya bisa langsung dimulai begitu video ini selesai.',
  browserLead:
    'Tambahkan video dan terima ucapannya sebagai teks, dengan penanda waktu di setiap baris. Tidak perlu membuat akun, tidak ada batas harian, dan tidak ada batas ukuran file; video tidak pernah diunggah karena perangkat Anda sendiri yang mengerjakannya.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Apa arti "gratis" saat Anda mentranskripsikan video',
  why: [
    'Banyak situs yang menyebut "transkripsi video gratis" hanya memberi Anda satu menit, atau beberapa file, lalu meminta akun atau kartu. Sebelum memilih, periksa empat hal: apakah Anda harus mendaftar, berapa menit atau file yang Anda dapat, seberapa besar file yang diterima, dan apakah hasilnya bisa diunduh.',
    'Di sini jawabannya sederhana. Anda menambahkan video, tidak ada yang perlu didaftarkan, tidak ada hitungan harian atau bulanan, dan transkrip bisa diunduh sebagai TXT, SRT, VTT, PDF, Markdown, atau JSON tanpa biaya. Alat ini tidak memberi label pembicara dan tidak menerima tautan: Anda menambahkan file-nya langsung.',
  ],
  browserWhy: [
    'Banyak situs yang menyebut "transkripsi video gratis" hanya memberi Anda satu menit, atau beberapa file, lalu meminta akun atau kartu. Sebelum memilih, periksa empat hal: apakah Anda harus mendaftar, berapa menit atau file yang Anda dapat, seberapa besar file yang diterima, dan apakah hasilnya bisa diunduh.',
    'Di sini jawabannya sederhana. Anda menambahkan video, tidak ada yang perlu didaftarkan, tidak ada hitungan harian atau bulanan maupun batas ukuran, dan transkrip bisa diunduh sebagai TXT, SRT, VTT, PDF, Markdown, atau JSON tanpa biaya. Karena perangkat Anda yang mengerjakannya, memorinya menjadi satu-satunya batas yang nyata: video yang sangat panjang bisa terlalu berat untuk ponsel, jadi potong dulu menjadi beberapa bagian. Alat ini tidak memberi label pembicara dan tidak menerima tautan: Anda menambahkan file-nya langsung.',
  ],

  sections: [
    {
      title: 'Batas gratis di situs transkripsi video lain, diperiksa Oktober 2026',
      paragraphs: [
        'Berikut kutipan dari halaman masing-masing alat, sebagaimana tertulis pada 28 Oktober 2026, diterjemahkan dari halaman bahasa Inggris milik vendornya. Paket bisa berubah, jadi lihat halamannya sebelum Anda mengandalkan sebuah angka. Panduan yang ditautkan di akhir halaman ini memuat tabel lengkap dengan tautan ke setiap sumber.',
      ],
      bullets: [
        {
          title: 'Riverside.',
          text: '"Transkripsi tanpa batas secara gratis. Tidak perlu mendaftar." Alat gratisnya menerima file MP3, WAV, MP4, dan MOV, dan memberikan seluruh teks rekaman multi-pembicara kepada satu pembicara.',
        },
        { title: 'VoiceCheap.', text: '"Gratis untuk file hingga 60 menit, dengan 1 transkripsi per hari."' },
        { title: 'RecCloud.', text: '"Paket gratis kami memungkinkan video hingga 10 menit."' },
        { title: 'Caption-X.', text: '"Paket gratis mencakup total 5 transkripsi, masing-masing hingga 5 menit."' },
        { title: 'Maestra.', text: '"Pratinjau 1 menit", dan "Daftar untuk mengunduh atau mengekspor transkrip Anda."' },
        { title: 'Any2Text.', text: '"15 menit pertama gratis", lalu $0.035 per menit.' },
      ],
    },
    {
      title: 'Ke mana video Anda pergi selama ditranskripsikan',
      paragraphs: [
        'Video dikirim ke server yang menjalankan situs ini, ditranskripsikan di sana, dan dihapus saat sesi Anda berakhir. Video tidak dikirim ke tempat lain.',
      ],
      browser: {
        paragraphs: [
          'Video tetap berada di perangkat Anda. Browser Anda membacanya, mengambil suaranya, dan menjalankan model ucapan Whisper di atasnya, sehingga tidak ada file yang dikirim kepada kami atau siapa pun.',
          'Yang diunduh hanya perangkat kerjanya: halaman, model ucapan, dan mesin yang menjalankannya. Ukuran model sekitar 77 MB hingga sedikit di atas 1 GB, tergantung tingkat kualitas dan perangkat Anda, dan model itu tersimpan di browser Anda sesudahnya. Untuk membuktikannya sendiri, buka panel jaringan browser Anda saat video ditranskripsikan.',
        ],
      },
    },
    {
      title: 'Empat tingkat kualitas untuk video yang berbeda',
      paragraphs: [
        'Tercepat memakai model Base yang kecil dan cocok untuk draf cepat dari ucapan yang jernih. Standar memakai model yang lebih besar dan menjadi pilihan yang biasa dipakai. Akurasi tinggi menjalankan Large v3 Turbo dan lebih baik menangani aksen serta ruangan yang berisik. Akurasi terbaik menjalankan Large v3 penuh dan membuat kesalahan paling sedikit, tetapi paling lama.',
        'Semakin besar modelnya, semakin lama waktunya: Tercepat membutuhkan waktu paling sedikit dan Akurasi terbaik paling banyak. Coba Standar lebih dulu, dan naik tingkat hanya jika teksnya belum cukup baik.',
      ],
      browser: {
        paragraphs: [
          'Tercepat memakai model Base yang kecil dan cocok untuk draf cepat dari ucapan yang jernih. Standar memakai model yang lebih besar dan menjadi pilihan yang biasa dipakai. Akurasi tinggi menjalankan Large v3 Turbo dan lebih baik menangani aksen serta ruangan yang berisik. Akurasi terbaik menjalankan Large v3 penuh dan membuat kesalahan paling sedikit, tetapi paling lama.',
          'Perangkat Anda yang mengerjakannya, jadi kecepatannya bergantung padanya: laptop keluaran baru jauh lebih cepat daripada ponsel lama, dan di ponsel Tercepat adalah tingkat yang sebaiknya dipakai. Di laptop, coba Standar lebih dulu, dan naik tingkat hanya jika teksnya belum cukup baik.',
        ],
      },
    },
  ],

  howTitle: 'Cara mentranskripsikan video dalam empat langkah',
  howToDescription: 'Tambahkan video, pilih bahasa dan tingkat kualitas, tunggu sampai teksnya muncul, lalu edit dan unduh.',
  steps: [
    {
      title: 'Tambahkan video',
      text: 'Letakkan file di kotak pada bagian atas halaman ini, atau tekan Pilih file. Tautan ke video web tidak diterima.',
    },
    {
      title: 'Pilih bahasa dan kualitas',
      text: 'Sebutkan bahasa yang diucapkan jika Anda tahu, dan pilih tingkat kualitas. Standar adalah awal yang baik; pakai Akurasi tinggi atau Akurasi terbaik untuk aksen, derau, atau bahasa seperti Hindi.',
    },
    {
      title: 'Tunggu teksnya',
      text: 'Baris muncul satu per satu dengan bilah kemajuan dan sisa waktu.',
      browser: {
        text: 'Baris muncul satu per satu dengan bilah kemajuan dan sisa waktu. Saat pertama kali memakai suatu tingkat, modelnya diunduh satu kali; video berikutnya langsung dimulai.',
      },
    },
    {
      title: 'Edit dan unduh',
      text: 'Perbaiki baris mana pun di editor, lalu unduh TXT, SRT, VTT, PDF, Markdown, atau JSON. Unduh sebelum Anda pergi: tidak ada yang disimpan untuk Anda setelah sesi berakhir.',
      browser: {
        text: 'Perbaiki baris mana pun di editor, lalu unduh TXT, SRT, VTT, PDF, Markdown, atau JSON. Transkrip tetap tersimpan di browser ini untuk sementara, tetapi unduh apa yang ingin Anda simpan.',
      },
    },
  ],

  formatsTitle: 'Video yang bisa Anda tambahkan dan file yang Anda terima',
  formatsIntro: 'Yang dibaca adalah jalur suaranya, jadi gambar boleh berkualitas apa saja. File yang hanya berisi audio juga bisa.',
  uploadTitle: 'File video yang bisa Anda tambahkan',
  accepts: ['MP4', 'MOV', 'MKV', 'WEBM', 'AVI', 'M4V', '3GP'],
  downloads: [
    { name: 'TXT', use: 'teks biasa, atau dengan waktu di setiap baris' },
    { name: 'SRT', use: 'subtitle untuk aplikasi penyunting dan pemutar' },
    { name: 'VTT', use: 'subtitle untuk video web' },
    { name: 'PDF', use: 'transkrip untuk dicetak atau dibagikan' },
    { name: 'Markdown', use: 'catatan dengan penanda waktu' },
    { name: 'JSON', use: 'kata dan waktu untuk pengembang' },
  ],

  tipsTitle: 'Mendapat lebih banyak dari transkripsi gratis',
  tips: [
    {
      title: 'Uji menit pertama sebelum seluruh video.',
      text: 'Potong atau putar satu menit video dan transkripsikan bagian itu. Jika teksnya salah, ubah bahasa atau tingkat kualitas sebelum Anda menghabiskan waktu untuk file lengkapnya.',
    },
    {
      title: 'Periksa apa yang ada di layar, bukan hanya yang terdengar.',
      text: 'Hanya ucapan yang dituliskan. Nama yang muncul di slide tetapi tidak pernah diucapkan tidak akan ada di teks.',
    },
    {
      title: 'Bagi rekaman yang sangat panjang.',
      text: 'Video berdurasi beberapa jam lebih mudah ditangani dalam bagian-bagian berdurasi sekitar satu jam: Anda bisa mulai membaca lebih cepat dan kesalahan lebih murah untuk diulang.',
      browser: {
        title: 'Bagi rekaman yang sangat panjang di ponsel.',
        text: 'Tidak ada batas ukuran, tetapi video berdurasi beberapa jam membutuhkan banyak memori. Di ponsel, bagian-bagian berdurasi sekitar satu jam jauh lebih aman, dan di laptop biasanya Anda bisa memproses jauh lebih panjang.',
      },
    },
    {
      title: 'Unduh file subtitle selain teksnya.',
      text: 'File SRT menyimpan pewaktuannya, sehingga satu kali proses memberi Anda transkrip untuk dibaca sekaligus subtitle untuk ditambahkan ke video.',
    },
  ],

  faqs: [
    {
      question: 'Bisakah saya menempelkan tautan YouTube, TikTok, atau Google Drive sebagai ganti file?',
      answer: 'Tidak. Alat ini bekerja dengan file yang Anda tambahkan atau rekam. Jika video itu milik Anda, pakai file aslinya; untuk video milik orang lain, Anda perlu memiliki hak untuk menggunakannya.',
    },
    {
      question: 'Apakah transkrip menampilkan siapa yang berbicara?',
      answer: 'Tidak. Baris memiliki waktu tetapi tidak ada nama pembicara. Anda bisa mengetik nama ke dalam teks di editor, dan itu cepat untuk wawancara dua orang.',
    },
    {
      question: 'Benarkah tidak ada batas jumlah video yang bisa saya transkripsikan?',
      answer: 'Tidak ada akun, tidak ada paket, dan tidak ada hitungan harian atau bulanan. {limits} Jika banyak orang memakai layanan ini, video Anda mungkin menunggu dalam antrean beberapa saat.',
      browser: {
        answer:
          'Tidak ada akun, tidak ada paket, tidak ada hitungan harian atau bulanan, dan tidak ada batas ukuran. Satu-satunya batas adalah perangkat Anda: video yang sangat panjang memakan waktu lebih lama dan membutuhkan lebih banyak memori, jadi ponsel lebih cocok dengan bagian-bagian berdurasi sekitar satu jam. Iklan membuat situs ini tetap gratis, dan tidak ada iklan yang ditampilkan saat video ditranskripsikan.',
      },
    },
    {
      question: 'Tingkat kualitas mana yang cocok untuk video panjang?',
      answer: 'Standar adalah pilihan yang biasa dipakai. Tercepat lebih cepat tetapi membuat lebih banyak kesalahan; Akurasi tinggi dan Akurasi terbaik membutuhkan lebih banyak waktu dan terbayar pada aksen, derau, dan bahasa seperti Hindi.',
    },
    {
      question: 'Apakah video meninggalkan komputer saya?',
      answer: 'Video dikirim ke server yang menjalankan situs ini dan dihapus saat sesi Anda berakhir.',
      browser: {
        answer: 'Tidak. Browser Anda mentranskripsikan video di perangkat Anda sendiri, dan tidak ada file yang dikirim kepada kami. Hanya model ucapan dan mesinnya yang diunduh, satu kali.',
      },
    },
  ],

  links: [
    {
      label: 'Perbandingan alat video ke teks gratis',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Semua batas dalam satu tabel, dikutip dari halaman masing-masing alat.',
    },
    {
      label: 'Transkripsikan video tanpa mengunggahnya',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Bagaimana pekerjaan tetap berada di perangkat Anda dan cara memeriksanya sendiri.',
    },
    {
      label: 'Cara mengubah video ke teks',
      path: '/guides/how-to-transcribe-video-to-text',
      note: 'Lima cara melakukannya, dan mana yang cocok untuk video Anda.',
    },
    {
      label: 'Cara mendapatkan transkrip yang lebih akurat',
      path: '/guides/accurate-transcripts',
      note: 'Kebiasaan dan pengaturan yang mengurangi kesalahan pada video apa pun.',
    },
  ],
};
