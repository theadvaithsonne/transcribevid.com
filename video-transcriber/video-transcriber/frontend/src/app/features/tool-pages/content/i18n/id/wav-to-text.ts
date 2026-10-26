import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WAV ke teks',
  h1: 'Ubah file WAV ke teks, gratis dan dengan penanda waktu',
  lead: 'WAV adalah format perekam genggam, perekam panggilan, dan sesi studio. Tambahkan file Anda dan baca isinya sebagai teks berpenanda waktu, gratis, tanpa login, dan tanpa perlu mengompres file lebih dulu.',
  dropKind: 'audio',
  dropNoun: 'file WAV',

  whyTitle: 'Mengapa file WAV bagus untuk ditranskripsikan',
  why: [
    'File WAV biasanya menyimpan suara tanpa kompresi, jadi tidak ada yang terbuang saat disimpan. Itu menjadikannya sumber yang baik untuk pengenalan ucapan: tidak ada artefak kompresi, dan setiap konsonan masih ada di dalam file. Anda tidak perlu mengubahnya menjadi MP3 lebih dulu. TranscribeVid membaca WAV apa adanya.',
    'Harga dari kualitas itu adalah ukuran. Stereo berkualitas CD memakan sekitar 10 MB untuk setiap menit, jadi satu jam audio lebih dari setengah gigabyte. Halaman ini dibuat untuk file-file besar seperti itu: halaman ini melewati keheningan dan sebagian besar suara non-ucapan (opsi Lewati keheningan & musik, aktif secara bawaan) dan memberi Anda teks dengan penanda waktu di setiap baris.',
  ],

  sections: [
    {
      title: 'Dari mana rekaman WAV berasal',
      paragraphs: [
        'WAV adalah bawaan dunia audio, jadi file di depan Anda kemungkinan besar berasal dari salah satu sumber berikut.',
      ],
      bullets: [
        {
          title: 'Perekam genggam.',
          text: 'Perekam portabel yang dipakai untuk wawancara, kuliah, dan catatan lapangan sering menyimpan WAV, karena format ini mempertahankan setiap detail suara.',
        },
        {
          title: 'Perekam panggilan telepon dan rapat.',
          text: 'Alat perekam panggilan dan sistem konferensi sering mengekspor WAV. Jika setiap sisi panggilan berada di salurannya sendiri, keduanya digabung menjadi satu transkrip.',
        },
        {
          title: 'Aplikasi penyunting audio.',
          text: 'Program seperti Audacity dan Adobe Audition mengekspor WAV saat Anda menyimpan atau mengekspor proyek, sehingga WAV menjadi file yang wajar untuk diteruskan ke transkripsi.',
        },
        {
          title: 'Perangkat dikte.',
          text: 'Beberapa perekam dikte digital menulis file WAV yang bisa Anda salin langsung dari perangkatnya.',
        },
      ],
    },
    {
      title: 'Laju sampel, kedalaman bit, dan saluran',
      paragraphs: [
        'Anda tidak perlu menyiapkan WAV sebelum menambahkannya. Pengaturan yang lazim semuanya terbaca: 8, 16, atau 24 bit, atau float 32-bit, mono atau stereo, pada 44,1 atau 48 kHz. Suaranya digabung menjadi mono dan diubah untuk model ucapan secara otomatis.',
        'Laju sampel yang lebih tinggi tidak membuat transkrip lebih akurat, karena ucapan berada di bagian bawah spektrum suara. Letak Anda menaruh mikrofon jauh lebih penting daripada angka-angka pada file.',
        'Perbaiki audio, di bawah Opsi lainnya, menyaring dengung dan desis serta menyeimbangkan suara pembicara yang pelan. Opsi ini aktif secara bawaan, dan sangat berguna pada rekaman yang dibuat di dekat kipas angin, jalan raya, atau pendingin ruangan.',
      ],
    },
  ],

  howTitle: 'Cara mengubah file WAV ke teks',
  howToDescription:
    'Tambahkan file WAV, pilih bahasa yang diucapkan dan kualitasnya, tunggu transkripnya selesai, lalu unduh sebagai teks atau subtitle.',
  steps: [
    {
      title: 'Masukkan WAV-nya',
      text: 'Tambahkan file .wav di kotak pada bagian atas halaman ini: letakkan di sana atau tekan Pilih file. Jika file masih berada di perekam, salin dulu ke komputer Anda. Kotak ini menerima satu file; di halaman berikutnya, Tambah file lain menyiapkan WAV lainnya, dan masing-masing mendapat transkripnya sendiri.',
    },
    {
      title: 'Pilih bahasa dan kualitas',
      text: 'Di halaman berikutnya, pilih bahasa yang diucapkan, atau biarkan Deteksi otomatis untuk rekaman dalam satu bahasa. Standar cocok untuk sebagian besar ucapan. Untuk rekaman yang pelan atau sulit, Akurasi tinggi dan Akurasi terbaik memakan waktu lebih lama dan lebih sedikit membuat kesalahan. Lalu tekan Transkripsikan.',
      browser: {
        text: 'Di halaman berikutnya, pilih bahasa yang diucapkan, atau biarkan Deteksi otomatis untuk rekaman dalam satu bahasa. Standar cocok untuk sebagian besar ucapan. Untuk rekaman yang pelan atau sulit, coba Akurasi tinggi atau Akurasi terbaik jika perangkat Anda menyediakannya: keduanya memakan waktu lebih lama, unduhan pertamanya lebih besar, dan pada perangkat yang tidak mampu menjalankannya keduanya diredupkan beserta alasannya. Lalu tekan Transkripsikan.',
      },
    },
    {
      title: 'Lihat teksnya muncul',
      text: 'Transkrip terisi baris demi baris, masing-masing dengan waktunya. Putar dari baris mana pun untuk memeriksanya terhadap rekaman.',
    },
    {
      title: 'Edit dan unduh',
      text: 'Perbaiki kata yang salah, lalu unduh TXT untuk dibaca, SRT atau VTT untuk subtitle, atau PDF untuk dicetak. Tidak ada yang disimpan setelah sesi Anda berakhir, jadi simpan apa yang Anda butuhkan.',
    },
  ],

  formatsTitle: 'WAV dan format audio lainnya',
  formatsIntro: 'WAV adalah format lossless, dan kotak ini juga menerima jenis audio berikut.',
  uploadTitle: 'File audio yang bisa Anda tambahkan',
  accepts: ['WAV', 'MP3', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'kata-katanya sebagai teks biasa' },
    { name: 'SRT', use: 'baris subtitle berwaktu' },
    { name: 'VTT', use: 'baris berwaktu untuk pemutar web' },
    { name: 'PDF', use: 'salinan yang siap dicetak' },
    { name: 'Markdown', use: 'catatan dengan waktu' },
    { name: 'JSON', use: 'data untuk alat Anda sendiri' },
  ],

  tipsTitle: 'Tips untuk mentranskripsikan rekaman WAV',
  tips: [
    {
      title: 'Tambahkan persis apa adanya.',
      text: 'Tidak ada untungnya mengonversi WAV lebih dulu, dan MP3 berbitrate rendah bisa kehilangan detail. Tambahkan file persis seperti saat keluar dari perekam.',
    },
    {
      title: 'Dengarkan kedua saluran.',
      text: 'Stereo digabung menjadi mono. Jika satu mikrofon jauh lebih pelan atau lebih berisik daripada yang lain, hasil gabungannya mewarisinya, jadi periksa kedua saluran di pemutar Anda sebelum pekerjaan yang panjang.',
    },
    {
      title: 'Pangkas keheningan yang panjang.',
      text: 'Rekaman lapangan sering diawali dan diakhiri dengan beberapa menit kosong. Memotongnya di aplikasi penyunting membuat file lebih kecil, dan transkrip dimulai tepat saat pembicaraan dimulai.',
    },
    {
      title: 'Pecah sesi yang sangat panjang.',
      text: 'Rekaman yang melebihi batas ukuran atau durasi ditolak, jadi pecah sesi yang panjang pada jeda yang wajar lalu transkripsikan bagian-bagiannya.',
      browser: {
        title: 'Beberapa jam butuh beberapa jam.',
        text: 'Situs ini tidak menetapkan batas ukuran atau durasi, tetapi rekaman berdurasi beberapa jam membutuhkan banyak waktu dan memori kosong, dan browser yang lebih lama mungkin menolak file yang sangat panjang. Di ponsel, pecah pada jeda yang wajar lalu transkripsikan bagian-bagiannya.',
      },
    },
    {
      title: 'Eja kata-kata yang sulit.',
      text: 'Tuliskan nama, tempat, dan istilah teknis di petunjuk kosakata pada Opsi lainnya, ditulis seperti yang ingin Anda lihat.',
    },
  ],

  faqs: [
    {
      question: 'Bisakah saya mentranskripsikan WAV hasil rekaman panggilan telepon?',
      answer:
        'Bisa, jika panggilan itu tersimpan sebagai file WAV dan kedua orang terdengar. Kedua saluran digabung menjadi satu transkrip dan nama pembicara tidak ditambahkan, jadi ketik nama ke dalam teks saat Anda mengedit. Beri tahu orang bahwa Anda merekam, dan periksa aturan di tempat Anda tinggal sebelum merekam panggilan.',
    },
    {
      question: 'Apakah WAV lebih akurat daripada MP3 untuk transkripsi?',
      answer:
        'Bisa sedikit membantu, karena tidak ada yang dihilangkan dari suaranya. Namun MP3 yang jernih biasanya tertranskripsi dengan baik dan WAV yang berisik tidak. Mikrofon, ruangan, dan seberapa dekat pembicara lebih berpengaruh daripada format file.',
    },
    {
      question: 'Mengapa file WAV saya sangat besar, dan apakah itu masalah?',
      answer:
        'WAV biasanya menyimpan suara tanpa kompresi: sekitar 10 MB per menit untuk stereo berkualitas CD. File besar membutuhkan waktu lebih lama untuk dibaca. {limits} Jika file melebihi batas, pangkas, atau ekspor salinan terkompresi (M4A atau MP3) dan pakai itu.',
      browser: {
        answer:
          'WAV biasanya menyimpan suara tanpa kompresi: sekitar 10 MB per menit untuk stereo berkualitas CD. File besar membutuhkan waktu sedikit lebih lama untuk dibaca, tetapi formatnya bukan masalah: dalam pengujian, file sekitar 2,5 GB terbaca tanpa kendala di browser terkini. Situs ini tidak menetapkan batas ukuran atau durasi karena perangkat Anda sendiri yang bekerja, jadi rekaman yang sangat panjang membutuhkan waktu dan memori kosong, dan browser yang lebih lama mungkin menolak file yang sangat panjang. Di ponsel, pecah dulu.',
      },
    },
    {
      question: 'Apakah file WAV 24-bit dan 48 kHz bisa ditangani?',
      answer:
        'Bisa. Pengaturan WAV yang lazim, seperti 16 atau 24 bit pada 44,1 atau 48 kHz, terbaca tanpa persiapan apa pun, dan suaranya diubah untuk model ucapan secara otomatis.',
    },
    {
      question: 'Bisakah saya mentranskripsikan beberapa file WAV sekaligus?',
      answer:
        'Bisa, di halaman berikutnya. Kotak di halaman ini menerima satu file; di sana, Tambah file lain menyiapkan sisanya. Setiap file mendapat transkripnya sendiri, jadi rekaman satu hari penuh bisa berjalan satu per satu.',
    },
  ],

  links: [
    {
      label: 'MP3 ke teks',
      path: '/mp3-to-text',
      note: 'Transkripsi gratis yang sama untuk format terkompresi yang paling sering dipakai rekaman suara.',
    },
    {
      label: 'Transkripsi wawancara',
      path: '/interview-transcription',
      note: 'Tips untuk mengubah rekaman wawancara menjadi transkrip yang bersih dan siap dikutip.',
    },
    {
      label: 'Cara mendapatkan transkrip yang lebih akurat',
      path: '/guides/accurate-transcripts',
      note: 'Apa yang perlu diubah pada rekaman, bahasa, dan pengaturan ketika hasil pertama belum cukup baik.',
    },
    {
      label: 'Rekaman rapat ke teks',
      path: '/meeting-recording-to-text',
      note: 'Untuk konferensi telepon yang disimpan sebagai rekaman.',
    },
  ],
};
