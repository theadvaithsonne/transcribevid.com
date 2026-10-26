import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Terjemahkan ucapan ke bahasa Inggris',
  h1: 'Terjemahkan ucapan ke teks dan subtitle bahasa Inggris',
  lead: 'Tambahkan file video atau audio dalam bahasa lain dan dapatkan teks bahasa Inggris dengan penanda waktu, atau file subtitle bahasa Inggris. Gratis, tanpa login.',
  dropKind: 'video',
  dropNoun: 'video atau audio',

  whyTitle: 'Apa yang dilakukan penerjemahan ucapan ke bahasa Inggris',
  why: [
    'Kebanyakan pengenalan ucapan menuliskan apa yang diucapkan dalam bahasa yang dipakai saat diucapkan. Menerjemahkan ke bahasa Inggris adalah pekerjaan yang berbeda. Pembicara berbicara dalam bahasa Hindi, Spanyol, Jerman, atau bahasa lain yang didukung, dan teksnya keluar dalam bahasa Inggris, dengan penanda waktu di setiap baris. Ini membantu ketika Anda membutuhkan gambaran umum dari kuliah, wawancara, klip berita, atau video keluarga yang tidak bisa Anda ikuti, atau subtitle bahasa Inggris untuk video yang berbahasa lain.',
    'Bahasa Inggris adalah satu-satunya bahasa tujuannya. Tidak ada penerjemahan ke bahasa Prancis, Hindi, atau bahasa lain mana pun, dan teks tertulis tidak diterjemahkan: hanya ucapan dalam rekaman. Halaman ini memulai pengunggah dengan Output diatur ke Terjemahkan ke bahasa Inggris dan bahasa yang diucapkan dibiarkan pada Deteksi otomatis.',
  ],

  sections: [
    {
      title: 'Seberapa andal bahasa Inggrisnya, dan apa yang perlu diperiksa',
      paragraphs: [
        'Penerjemahan lebih sulit daripada transkripsi. Bahasa Inggrisnya dihasilkan langsung dari suara, tanpa teks tertulis dalam bahasa aslinya di antaranya. Hasilnya sering cukup baik untuk mengikuti maknanya, tetapi bisa memperpendek atau merumuskan ulang kalimat, melewatkan idiom dan lelucon, serta keliru pada nama, angka, dan kata teknis.',
        'Perlakukan hasilnya sebagai draf untuk memahami, bukan sebagai terjemahan resmi. Untuk kontrak, dokumen hukum, medis, atau materi penting lainnya, minta penerjemah manusia, dan pakai transkrip dalam bahasa aslinya sebagai titik awal.',
        'Kebiasaan yang baik adalah membuat transkrip biasa dalam bahasa aslinya lebih dulu dan versi bahasa Inggrisnya kedua. Di tempat keduanya tampak bertentangan, bagian itu layak didengarkan lebih saksama. Transkrip yang sudah selesai tetap tersimpan saat Anda memakai Transkripsi ulang, jadi keduanya bisa berasal dari file yang sama.',
      ],
    },
    {
      title: 'Bahasa dan pilihan kualitas mana yang menerjemahkan dengan baik',
      bullets: [
        {
          title: 'Bahasa mana pun dalam daftar.',
          text: 'Lebih dari 50 bahasa lisan, dari Afrikaans sampai Welsh, bisa diterjemahkan ke bahasa Inggris. Kualitasnya sangat bervariasi, dan paling lemah untuk bahasa yang sedikit memiliki rekaman ucapan untuk dipelajari. Jika ucapannya sudah dalam bahasa Inggris, Anda tidak memerlukan halaman ini: pakai halaman video ke teks atau audio ke teks.',
        },
        {
          title: 'Sebutkan bahasanya, atau biarkan terdeteksi.',
          text: 'Biarkan Bahasa pada Deteksi otomatis ketika Anda tidak yakin apa yang diucapkan. Jika Anda tahu, memilihnya lebih andal, terutama untuk klip yang pendek atau beraksen.',
        },
        {
          title: 'Hindari Akurasi tinggi untuk penerjemahan.',
          text: 'Akurasi tinggi menjalankan model Large v3 Turbo. OpenAI, pembuat Whisper, menyatakan bahwa Turbo tidak dilatih untuk penerjemahan dan mengembalikan bahasa aslinya meskipun penerjemahan diminta. Distil Large v3, di daftar Model pada Opsi lainnya, hanya untuk bahasa Inggris. Untuk penerjemahan, mulailah dengan Standar, dan pilih Akurasi terbaik (Large v3) untuk ucapan yang sulit. Medium, yang juga ada di daftar Model itu, adalah pilihan baik lainnya.',
          browser: {
            text: 'Akurasi tinggi menjalankan model Large v3 Turbo. OpenAI, pembuat Whisper, menyatakan bahwa Turbo tidak dilatih untuk penerjemahan dan mengembalikan bahasa aslinya meskipun penerjemahan diminta. Distil Large v3, di daftar Model pada Opsi lainnya, hanya untuk bahasa Inggris. Untuk penerjemahan, mulailah dengan Standar, dan pilih Akurasi terbaik (Large v3) untuk ucapan yang sulit jika perangkat Anda menyediakannya. Medium, yang juga ada di daftar Model itu, adalah pilihan baik lainnya.',
          },
        },
        {
          title: 'Hanya Whisper.',
          text: 'Penerjemahan membutuhkan mesin pengenalan Whisper. Pilihan Qwen3 ASR yang eksperimental tidak bisa menerjemahkan: Terjemahkan ke bahasa Inggris tidak tersedia selagi pilihan itu dipilih, dan memilihnya mengembalikan Output ke Transkripsi.',
        },
        {
          title: 'Tanpa gaya transkrip.',
          text: 'Pilihan Gaya transkrip (Hinglish atau Aksara asli) tidak berlaku untuk terjemahan, dan diredupkan selagi Terjemahkan ke bahasa Inggris dipilih.',
        },
      ],
    },
    {
      title: 'Untuk apa orang memakai subtitle dan teks bahasa Inggris',
      bullets: [
        {
          title: 'Subtitle untuk video Anda sendiri.',
          text: 'Unduh SRT atau VTT. Baris bahasa Inggrisnya disesuaikan waktunya dengan ucapan aslinya, jadi bisa ditambahkan ke video yang sama di pemutar atau aplikasi penyunting.',
        },
        {
          title: 'Memahami sebuah rekaman.',
          text: 'Baca tentang apa wawancara, kuliah, atau laporan berita itu sebelum Anda memutuskan apakah perlu terjemahan yang sebenarnya.',
        },
        {
          title: 'Penelitian dan jurnalisme.',
          text: 'Draf bahasa Inggris membantu Anda memutuskan bagian mana yang perlu diterjemahkan dengan saksama, dan bagian mana yang dikutip dari bahasa aslinya.',
        },
      ],
    },
  ],

  howTitle: 'Cara menerjemahkan ucapan ke bahasa Inggris',
  howToDescription:
    'Tambahkan file video atau audio dalam bahasa lain, pastikan Terjemahkan ke bahasa Inggris dipilih, tunggu teks bahasa Inggrisnya, lalu unduh.',
  steps: [
    {
      title: 'Tambahkan rekaman Anda',
      text: 'Letakkan rekaman Anda di kotak pada bagian atas halaman ini, atau tekan Pilih file. Anda tiba di pengunggah dengan Opsi lainnya terbuka, Output diatur ke Terjemahkan ke bahasa Inggris dan Bahasa pada Deteksi otomatis. Pilih bahasa yang diucapkan jika Anda mengetahuinya.',
    },
    {
      title: 'Pilih kualitas, lalu tekan Transkripsikan',
      text: 'Standar adalah awal yang wajar. Untuk ucapan beraksen, berisik, atau teknis, pilih Akurasi terbaik, yang memakan waktu lebih lama dan biasanya lebih sedikit membuat kesalahan. Jangan pilih Akurasi tinggi untuk penerjemahan: pilihan itu memakai model yang tidak dilatih untuk menerjemahkan. Lalu tekan Transkripsikan.',
      browser: {
        text: 'Standar adalah awal yang wajar. Untuk ucapan beraksen, berisik, atau teknis, pilih Akurasi terbaik jika perangkat Anda menyediakannya (pilihan yang tidak bisa dijalankannya diredupkan, beserta alasannya); unduhan pertamanya besar, memakan waktu lebih lama dan biasanya lebih sedikit membuat kesalahan. Jangan pilih Akurasi tinggi untuk penerjemahan: pilihan itu memakai model yang tidak dilatih untuk menerjemahkan. Lalu tekan Transkripsikan.',
      },
    },
    {
      title: 'Tunggu teks bahasa Inggrisnya',
      text: 'Baris bahasa Inggris muncul beserta waktunya. Gaya transkrip diredupkan karena hanya berlaku untuk transkrip, bukan untuk terjemahan.',
    },
    {
      title: 'Periksa dan unduh',
      text: 'Baca baris yang ditandai ragu, bandingkan nama dan angka dengan audionya, lalu unduh TXT, SRT, atau VTT, atau file PDF, Markdown, atau JSON.',
    },
  ],

  formatsTitle: 'File masuk, teks bahasa Inggris keluar',
  formatsIntro:
    'Video dan audio dalam banyak format bisa dipakai, apa pun bahasa yang diucapkan. File yang Anda unduh berisi teks bahasa Inggris.',
  uploadTitle: 'File yang bisa Anda tambahkan',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'MKV', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'teks bahasa Inggris untuk dibaca' },
    { name: 'SRT', use: 'subtitle bahasa Inggris yang disesuaikan waktunya dengan ucapan' },
    { name: 'VTT', use: 'subtitle bahasa Inggris untuk pemutar web' },
    { name: 'PDF', use: 'salinan yang siap dicetak' },
    { name: 'Markdown', use: 'teks dengan judul dan waktu' },
    { name: 'JSON', use: 'baris dan waktu untuk alat Anda sendiri' },
  ],

  tipsTitle: 'Tips untuk terjemahan yang lebih baik',
  tips: [
    {
      title: 'Sebutkan bahasa yang diucapkan jika Anda tahu.',
      text: 'Deteksi otomatis cukup baik untuk ucapan yang jernih, tetapi tebakan yang salah pada klip yang pendek menghasilkan terjemahan yang buruk.',
    },
    {
      title: 'Jaga agar klip tetap satu bahasa.',
      text: 'Rekaman yang terus berpindah antarbahasa bisa membingungkan penerjemahan. Pecah, atau buat transkrip biasa lebih dulu untuk melihat apa yang terdengar.',
    },
    {
      title: 'Periksa angka, nama, dan tanggal.',
      text: 'Itulah rincian yang paling penting dan yang paling sering keliru dalam draf terjemahan.',
    },
    {
      title: 'Uji menit pertamanya.',
      text: 'Baca menit pertama bahasa Inggrisnya terhadap audio sebelum Anda mengandalkan seluruh file.',
    },
    {
      title: 'Simpan yang asli di samping versi bahasa Inggris.',
      text: 'Jika Anda menerbitkan kutipan, simpan transkrip dalam bahasa aslinya di samping versi bahasa Inggrisnya.',
    },
  ],

  faqs: [
    {
      question: 'Bisakah layanan ini menerjemahkan ucapan ke bahasa selain bahasa Inggris?',
      answer:
        'Tidak. Bahasa Inggris adalah satu-satunya bahasa tujuannya. Untuk membaca ucapan dalam bahasanya sendiri, buat transkrip biasa.',
    },
    {
      question: 'Mengapa transkrip terjemahan kurang tepat dibandingkan yang biasa?',
      answer:
        'Penerjemahan adalah tugas yang lebih sulit daripada menuliskan kata-katanya. Ucapan harus dipahami dan dinyatakan ulang dalam satu langkah, jadi kalimat bisa diperpendek, idiom dan lelucon terlewat, dan nama salah dengar. Periksa hal penting terhadap audionya atau terhadap transkrip dalam bahasa aslinya.',
    },
    {
      question: 'Mengapa terjemahan saya keluar dalam bahasa aslinya?',
      answer:
        'Penyebab yang mungkin adalah pilihan kualitasnya. Akurasi tinggi menjalankan model Large v3 Turbo, yang tidak dilatih untuk menerjemahkan dan cenderung menulis bahasa aslinya. Mulai lagi dengan Standar atau Akurasi terbaik, dan pastikan Output diatur ke Terjemahkan ke bahasa Inggris.',
    },
    {
      question: 'Bisakah saya mendapatkan subtitle bahasa Inggris untuk video dalam bahasa lain?',
      answer:
        'Bisa. Setelah penerjemahan, unduh SRT atau VTT. Baris bahasa Inggrisnya membawa penyesuaian waktu dari ucapan aslinya. Bacalah sampai selesai sebelum Anda menerbitkannya, dan ingat bahwa terjemahannya adalah draf.',
    },
    {
      question: 'Mengapa saya tidak bisa memilih Terjemahkan ke bahasa Inggris?',
      answer:
        'Pilihan itu tidak tersedia untuk mesin Qwen3 ASR yang eksperimental. Ubah Mesin pengenalan kembali ke Whisper di Opsi lainnya dan pilihannya kembali.',
    },
  ],

  links: [
    {
      label: 'Audio Hindi ke teks (halaman bahasa Inggris)',
      path: '/hindi-audio-to-text',
      note: 'Baca ucapan bahasa Hindi dalam bahasanya sendiri sebelum Anda menerjemahkannya.',
    },
    {
      label: 'Audio Spanyol ke teks (halaman bahasa Inggris)',
      path: '/spanish-audio-to-text',
      note: 'Buat transkrip bahasa Spanyol dengan aksennya, tanpa menerjemahkannya.',
    },
    {
      label: 'Pembuat subtitle YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Buat SRT untuk video Anda sendiri dan unggah di YouTube Studio.',
    },
    {
      label: 'Cara menambahkan subtitle ke video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Apa yang dilakukan dengan file SRT atau VTT setelah Anda memilikinya.',
    },
  ],
};
