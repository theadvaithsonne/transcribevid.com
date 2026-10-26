import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Rekaman suara ke teks',
  h1: 'Ubah rekaman suara ke teks, langsung dari browser Anda',
  lead: 'Rekam dengan mikrofon Anda di halaman ini, atau unggah memo suara dari ponsel, lalu baca ucapan Anda sebagai teks sesudahnya. Gratis, tanpa login, dalam lebih dari 50 bahasa.',
  dropKind: 'audio',
  dropNoun: 'rekaman suara',
  record: true,

  whyTitle: 'Untuk apa layanan ini, dan apa yang bukan',
  why: [
    'Berbicara lebih cepat daripada mengetik, jadi banyak orang menangkap ide, catatan rapat, poin kuliah, dan draf pertama sebagai rekaman suara lalu mengubahnya menjadi teks sesudahnya. Halaman ini dibuat untuk itu: rekam atau unggah, lalu baca, edit, dan unduh teksnya.',
    'Ini bukan dikte langsung. Anda merekam, berhenti, dan transkrip dibuat dari seluruh rekaman, jadi kata-katanya tidak muncul saat Anda masih berbicara. Sebagai gantinya, setiap baris mendapat penanda waktu.',
  ],

  howTitle: 'Cara mengubah rekaman suara menjadi teks',
  howToDescription:
    'Rekam dengan mikrofon Anda atau unggah memo suara, pilih bahasanya, tunggu transkripnya selesai, lalu unduh.',
  steps: [
    {
      title: 'Rekam atau pilih file',
      text: 'Letakkan memo suara di kotak pada bagian atas halaman ini (Voice Memos di iPhone berupa file M4A), atau tekan Pilih file. Untuk merekam langsung, tekan Rekam dengan mikrofon Anda di bawah kotak, lalu Rekam dari mikrofon, dan izinkan akses saat browser Anda menanyakannya.',
    },
    {
      title: 'Berhenti dan pilih bahasanya',
      text: 'Jika Anda sedang merekam, tekan Hentikan rekaman setelah selesai. Lalu pilih bahasa yang diucapkan atau biarkan Deteksi otomatis aktif.',
    },
    {
      title: 'Tunggu transkripnya',
      text: 'Teks muncul baris demi baris, lengkap dengan bilah kemajuan dan perkiraan sisa waktu.',
    },
    {
      title: 'Edit dan unduh',
      text: 'Perbaiki kata mana pun, lalu unduh TXT, Markdown, atau PDF. Transkrip hanya ada selama sesi Anda, jadi simpan apa yang Anda butuhkan.',
    },
  ],

  formatsTitle: 'Format memo suara dan format unduhan',
  formatsIntro:
    'Perekam suara di ponsel dan komputer menyimpan dalam format yang berbeda-beda. Semua format berikut bisa dipakai.',
  uploadTitle: 'File rekaman yang bisa Anda unggah',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'OGG', 'OPUS', 'FLAC', '3GP'],
  downloads: [
    { name: 'TXT', use: 'ucapan Anda sebagai teks biasa' },
    { name: 'Markdown', use: 'catatan dengan waktu' },
    { name: 'PDF', use: 'salinan catatan yang siap dicetak' },
    { name: 'SRT', use: 'baris berwaktu, jika rekaman itu menyertai video' },
    { name: 'VTT', use: 'baris berwaktu untuk pemutar web' },
    { name: 'JSON', use: 'baris terstruktur untuk program' },
  ],

  tipsTitle: 'Tips untuk rekaman suara',
  tips: [
    {
      title: 'Uji mikrofonnya.',
      text: 'Rekam sepuluh detik dan putar ulang sebelum sesi yang panjang.',
    },
    {
      title: 'Bicara dengan kecepatan yang stabil.',
      text: 'Berbicaralah dekat mikrofon di ruangan yang tenang. Kipas angin, papan ketik, dan angin tertangkap sama jelasnya dengan suara Anda.',
    },
    {
      title: 'Ucapkan nama dan angka dengan jelas.',
      text: 'Tambahkan kata-kata yang tidak lazim ke petunjuk kosakata di Opsi lainnya dan peluang hasilnya benar jauh lebih besar.',
    },
    {
      title: 'Tidak ada tombol mikrofon?',
      text: 'Sebagian browser hanya mengizinkan perekaman di halaman yang aman atau setelah Anda memberi izin. Rekam dengan aplikasi perekam suara di ponsel Anda dan unggah filenya sebagai gantinya.',
    },
    {
      title: 'Hargai orang lain.',
      text: 'Beri tahu orang saat Anda merekam mereka, dan minta izin mereka terlebih dahulu.',
    },
  ],

  faqs: [
    {
      question: 'Apakah ini dikte langsung?',
      answer:
        'Bukan. Anda merekam lebih dulu dan transkrip dibuat sesudahnya. Untuk kata-kata yang muncul saat Anda berbicara, gunakan fitur dikte di ponsel atau komputer Anda.',
    },
    {
      question: 'Bisakah saya memakainya di ponsel?',
      answer:
        'Bisa. Buka halaman ini di browser ponsel Anda dan rekam langsung di halaman, atau unggah file memo suara yang sudah Anda simpan.',
    },
    {
      question: 'Berapa lama durasi rekaman yang diperbolehkan?',
      answer:
        '{limits} File yang lebih panjang ditolak sebelum diproses, jadi pecah dulu. Tidak ada kuota harian atau bulanan.',
      browser: {
        answer:
          'Kami tidak menetapkan batas: rekaman ditranskripsikan di browser, di perangkat Anda sendiri, jadi rekaman yang panjang hanya memakan waktu lebih lama. Halaman ini memberi peringatan di perangkat yang lebih lambat. Tidak ada kuota harian atau bulanan.',
      },
    },
    {
      question: 'Apakah suara pembicara dibedakan?',
      answer:
        'Tidak. Nama atau label pembicara tidak ditambahkan. Setiap baris memiliki penanda waktu, dan Anda bisa mengetik nama ke dalam teks saat mengedit.',
    },
    {
      question: 'Apakah rekaman suara saya disimpan?',
      answer:
        'Hanya selama sesi Anda. Rekaman dihapus saat sesi berakhir, setelah beberapa waktu tidak aktif, atau saat Anda menekan Hapus data saya sekarang. Tidak ada akun.',
      browser: {
        answer:
          'Hanya di browser ini: rekaman Anda tidak pernah meninggalkan perangkat Anda. Rekaman dihapus setelah beberapa waktu tidak aktif, atau saat Anda menekan Hapus data saya sekarang. Tidak ada akun.',
      },
    },
  ],
};
