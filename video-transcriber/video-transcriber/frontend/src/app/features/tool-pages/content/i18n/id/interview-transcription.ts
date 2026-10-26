import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Transkripsi wawancara',
  h1: 'Transkripsi wawancara tanpa akun',
  lead: 'Ubah wawancara yang direkam menjadi teks berpenanda waktu yang bisa dicari, dikutip, dan diperiksa terhadap rekamannya. Dibuat untuk penelitian, jurnalisme, dan percakapan rekrutmen: gratis, tanpa login, dalam lebih dari 50 bahasa.',
  dropKind: 'video',
  dropNoun: 'rekaman wawancara',

  whyTitle: 'Mengapa wawancara perlu ditranskripsikan',
  why: [
    'Wawancara jauh lebih berharga setelah Anda bisa mencarinya. Transkrip memungkinkan Anda menemukan di mana seorang partisipan menyebut suatu topik, mengutipnya secara persis, memeriksa kutipan terhadap rekamannya, dan membandingkan jawaban dari beberapa wawancara. Peneliti, jurnalis, pencatat sejarah lisan, dan orang yang menjalankan wawancara riset pengguna atau rekrutmen semuanya bekerja dengan cara ini.',
    'Wawancara sering memuat rincian pribadi atau sensitif. Di sini rekaman diunggah lewat koneksi terenkripsi dan dihapus secara otomatis sesudahnya. Dapatkan persetujuan dari semua orang sebelum Anda merekam, ikuti aturan organisasi atau komite etik Anda, dan perlakukan transkrip dengan kehati-hatian yang sama seperti rekamannya.',
  ],
  browserWhy: [
    'Wawancara jauh lebih berharga setelah Anda bisa mencarinya. Transkrip memungkinkan Anda menemukan di mana seorang partisipan menyebut suatu topik, mengutipnya secara persis, memeriksa kutipan terhadap rekamannya, dan membandingkan jawaban dari beberapa wawancara. Peneliti, jurnalis, pencatat sejarah lisan, dan orang yang menjalankan wawancara riset pengguna atau rekrutmen semuanya bekerja dengan cara ini.',
    'Wawancara sering memuat rincian pribadi atau sensitif, jadi ke mana file pergi itu penting. Browser Anda mentranskripsikan rekaman di perangkat Anda sendiri dan tidak ada yang diunggah. Dapatkan persetujuan dari semua orang sebelum Anda merekam, ikuti aturan organisasi atau komite etik Anda, dan perlakukan transkrip dengan kehati-hatian yang sama seperti rekamannya: teks yang diunduh adalah file di perangkat Anda seperti file lainnya.',
  ],

  sections: [
    {
      title: 'Apa yang diberikan dan tidak diberikan transkrip',
      paragraphs: ['Ketahui batasnya sebelum Anda membangun sesuatu di atas transkrip.'],
      bullets: [
        {
          title: 'Tanpa label pembicara.',
          text: 'Setiap baris memiliki penanda waktu, tetapi transkrip tidak menyebutkan siapa yang berbicara. Tambahkan Pewawancara dan Partisipan secara manual saat Anda mengedit, dengan memeriksa terhadap rekamannya.',
        },
        {
          title: 'Bacaan yang bersih, bukan verbatim secara ketat.',
          text: 'Mesin pengenalan sering menghilangkan gagap dan sebagian kata pengisi seperti eh. Jika penelitian Anda membutuhkan catatan verbatim yang ketat, putar rekaman berdampingan dengan teksnya dan tambahkan apa yang kurang.',
        },
        {
          title: 'Hanya setelah wawancara.',
          text: 'Layanan ini bekerja pada rekaman yang tersimpan. Layanan ini tidak bergabung ke panggilan atau mentranskripsikan secara langsung.',
        },
      ],
    },
    {
      title: 'Memeriksa transkrip sebelum mengutipnya',
      paragraphs: [
        'Sebelum Anda menerbitkan kutipan atau menyebut seorang partisipan, putar barisnya dari penanda waktu dan dengarkan. Baris yang diragukan oleh mesin pengenalan diberi tanda, jadi mulailah dari sana. Periksa nama, angka, dan tanggal, serta kata apa pun yang akan mengubah makna jika salah, seperti bisa dan tidak bisa. Untuk menemukan setiap tempat sebuah nama atau istilah muncul, ketik ke kotak Cari di teks di atas transkrip yang sudah selesai: kotak itu menghitung baris yang cocok dan panahnya berpindah di antaranya.',
        'Jadikan rekaman sebagai catatan utama dan perlakukan transkrip sebagai salinan kerja. Jika Anda menjelaskan metode Anda dalam laporan atau artikel, sebutkan bahwa transkrip dibuat dengan pengenalan ucapan lalu diperiksa secara manual.',
      ],
    },
    {
      title: 'Persetujuan, penyimpanan, dan anonimitas',
      paragraphs: [
        'Beri tahu para partisipan bagaimana rekaman dan transkrip akan disimpan dan siapa yang akan melihatnya. Jika Anda berjanji menjaga anonimitas, hapus nama dan rincian yang bisa mengidentifikasi seseorang sebelum Anda membagikan kutipan. Halaman ini tidak bisa melakukannya untuk Anda, dan tidak memberikan nasihat hukum.',
      ],
    },
  ],

  howTitle: 'Cara mentranskripsikan wawancara',
  howToDescription:
    'Tambahkan rekaman wawancara, pilih bahasanya, tambahkan nama, tunggu transkripnya selesai, lalu periksa dan unduh.',
  steps: [
    {
      title: 'Tambahkan rekaman wawancara',
      text: 'Tekan Pilih file, atau seret wawancara ke kotak di atas. Audio maupun video bisa dipakai. Tambahkan satu wawancara di sini, lalu gunakan Tambah file lain di halaman berikutnya untuk sisa kumpulan Anda.',
    },
    {
      title: 'Pilih bahasa dan kualitas',
      text: 'Di halaman berikutnya, pilih bahasa wawancara, atau biarkan Deteksi otomatis. Standar cocok untuk percakapan empat mata yang tenang. Gema, sambungan telepon, atau aksen yang kental memerlukan Akurasi tinggi jika perangkat Anda mampu menjalankannya; perangkat yang tidak mampu menampilkan pilihan itu diredupkan beserta alasannya. Pilihan itu lebih lambat dan unduhan pertamanya lebih besar.',
    },
    {
      title: 'Tambahkan nama dan istilah, lalu mulai',
      text: 'Di Opsi lainnya, daftarkan nama para partisipan, organisasi mereka, dan istilah khusus apa pun di petunjuk kosakata, agar dieja seperti yang Anda inginkan. Lalu tekan Transkripsikan.',
    },
    {
      title: 'Periksa, beri label, dan ekspor',
      text: 'Putar baris dari penanda waktunya, perbaiki kesalahannya dan tambahkan label pembicara secara manual. Lalu unduh TXT atau PDF untuk arsip Anda, atau Markdown atau JSON jika Anda membutuhkan baris berwaktu.',
    },
  ],

  formatsTitle: 'File rekaman wawancara dan format unduhan',
  formatsIntro:
    'Wawancara berasal dari ponsel, perekam, dan panggilan video. Semuanya bisa ditambahkan, dan hanya jalur suaranya yang dibaca.',
  uploadTitle: 'File rekaman yang bisa Anda tambahkan',
  accepts: ['MP4', 'MOV', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV'],
  downloads: [
    { name: 'TXT', use: 'teks biasa untuk dibaca, dikutip, dan dikodekan' },
    { name: 'PDF', use: 'salinan untuk dicetak atau diarsipkan' },
    {
      name: 'Markdown',
      use: 'teks berwaktu untuk aplikasi catatan atau perangkat lunak pengodean',
    },
    { name: 'JSON', use: 'baris berwaktu untuk perangkat lunak analisis' },
  ],

  tipsTitle: 'Tips untuk rekaman wawancara',
  tips: [
    {
      title: 'Letakkan mikrofon dekat.',
      text: 'Letakkan di dekat partisipan, dan pakai headset atau mikrofon jepit untuk panggilan telepon dan video. Mikrofon di seberang ruangan atau ruang yang bergema biasanya mengurangi akurasi lebih banyak daripada yang bisa dipulihkan oleh pengaturan apa pun.',
    },
    {
      title: 'Sebutkan tanggal dan nama di awal.',
      text: 'Katakan siapa yang ikut serta dan kapan, di awal rekaman. Itu membuat file mudah diberi label dan transkripnya mudah diarsipkan kemudian.',
    },
    {
      title: 'Simpan rekaman aslinya.',
      text: 'Jangan pernah menghapus audionya setelah Anda memiliki teksnya. Rekamanlah yang menyelesaikan keraguan tentang sebuah kutipan.',
    },
    {
      title: 'Tetap di bawah batasnya.',
      text: 'Apa pun yang melebihi batas yang tertera di halaman ini ditolak, jadi potong wawancara yang sangat panjang pada jeda yang wajar lebih dulu.',
      browser: {
        title: 'Wawancara panjang butuh waktu lebih lama.',
        text: 'Tidak ada batas panjang, meskipun rekaman yang panjang membutuhkan waktu dan memori kosong di perangkat Anda, dan browser tanpa WebCodecs mungkin kesulitan dengan file yang sangat panjang. Potong pada jeda yang wajar jika Anda lebih suka memulai dari bagian pertama.',
      },
    },
    {
      title: 'Hapus data Anda di komputer bersama.',
      text: 'Setelah Anda menyimpan apa yang Anda butuhkan, tekan Hapus data saya sekarang, agar transkrip tidak tertinggal di sesi.',
    },
  ],

  faqs: [
    {
      question: 'Bisakah saya mentranskripsikan wawancara yang rahasia di sini?',
      answer:
        'Rekaman Anda diunggah lewat koneksi terenkripsi dan dihapus oleh server saat sesi berakhir, atau lebih awal jika Anda menekan Hapus data saya sekarang. Sebelum Anda mengandalkannya, periksa apa yang dipersyaratkan organisasi atau komite etik Anda. Ini bukan nasihat hukum.',
      browser: {
        answer:
          'Tidak ada unggahan: rekaman tetap di perangkat Anda selagi browser mentranskripsikannya, dan browser menghapusnya setelah beberapa waktu tidak aktif atau saat Anda menekan Hapus data saya sekarang. Transkrip yang diunduh adalah file biasa, jadi periksa aturan organisasi atau komite etik Anda. Ini bukan nasihat hukum.',
      },
    },
    {
      question: 'Apakah transkrip wawancara memuat "eh" dan "ehm"?',
      answer:
        'Sering kali tidak. Transkrip adalah bacaan yang bersih, bukan catatan verbatim yang ketat, dan sebagian gagap serta kata pengisi dihilangkan. Jika Anda membutuhkan semuanya, putar rekaman berdampingan dengan teksnya dan tambahkan.',
    },
    {
      question: 'Bisakah transkrip membedakan pewawancara dari partisipan?',
      answer:
        'Tidak. Transkrip tidak menandai siapa yang berbicara. Ketik Pewawancara dan Partisipan ke dalam teks saat Anda mengedit, dengan memakai rekaman untuk memeriksa setiap giliran bicara.',
    },
    {
      question: 'Berapa lama wawancara yang bisa saya transkripsikan?',
      answer: '{limits} Wawancara yang lebih panjang mungkin perlu dipecah.',
      browser: {
        answer:
          'Panjang wawancara tidak dibatasi. Perangkat Anda sendiri yang bekerja, jadi wawancara yang panjang memakan waktu lebih lama dan membutuhkan memori kosong, dan halaman ini memberi tahu Anda jika perangkat Anda tampak terlalu lambat.',
      },
    },
    {
      question: 'Bisakah saya memakai transkrip ini dalam penelitian atau artikel saya?',
      answer:
        'Bisa. Periksa terhadap rekaman sebelum Anda mengutip siapa pun, sebutkan dalam metode Anda bahwa pengenalan ucapan dipakai, dan ikuti aturan institusi atau penerbitan Anda.',
    },
  ],

  links: [
    {
      label: 'Rekaman rapat ke teks',
      path: '/meeting-recording-to-text',
      note: 'Untuk panggilan yang direkam, dengan catatan tentang mengubah transkrip menjadi notulen.',
    },
    {
      label: 'Video ke teks',
      path: '/video-to-text',
      note: 'Halaman umum untuk video rekaman apa pun.',
    },
    {
      label: 'Transkripsikan video tanpa mengunggahnya',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Apa yang terjadi pada rekaman di browser Anda, dan cara melihatnya sendiri.',
    },
    {
      label: 'Cara mendapatkan transkrip yang lebih akurat',
      path: '/guides/accurate-transcripts',
      note: 'Pilihan audio dan pengaturan yang mengurangi kesalahan.',
    },
  ],
};
