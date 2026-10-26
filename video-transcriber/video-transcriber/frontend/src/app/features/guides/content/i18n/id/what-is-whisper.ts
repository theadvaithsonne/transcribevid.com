import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Apa itu Whisper? Penjelasan suara ke teks',
  lead: 'Whisper adalah model pengenalan ucapan sumber terbuka yang dirilis OpenAI pada 2022. Model ini mengubah suara menjadi teks dalam sekitar seratus bahasa, dan bisa dijalankan di komputer Anda sendiri. Panduan ini menjelaskan asal-usulnya, apa yang dipelajarinya, cara kerjanya, di mana kekuatan dan kelemahannya, serta bagaimana TranscribeVid menjalankannya di dalam browser Anda.',
  readingMinutes: 7,
  toolPath: '/audio-to-text',
  toolCta: 'Coba Whisper pada audio Anda sendiri',
  blocks: [
    {
      title: 'Whisper dalam satu paragraf',
      paragraphs: [
        'Whisper adalah jaringan saraf yang dilatih untuk mendengarkan ucapan dan menuliskan apa yang didengarnya. Anda memberinya suara; ia mengembalikan teks beserta penanda waktu, dan juga bisa menyebutkan bahasanya serta menerjemahkan ucapan ke bahasa Inggris. Modelnya tersedia dalam beberapa ukuran, dari versi mungil yang muat di ponsel sampai versi besar yang membutuhkan komputer bertenaga.',
        'Whisper bukan situs web atau layanan. Whisper adalah sekumpulan file: modelnya dan kode untuk menjalankannya. Siapa pun boleh mengunduh dan memakainya, itulah sebabnya banyak alat transkripsi gratis dan privat, termasuk yang ini, dibangun di atasnya.',
      ],
    },
    {
      title: 'Dari mana asalnya',
      paragraphs: [
        'OpenAI menerbitkan Whisper pada September 2022, bersama makalah penelitian berjudul "Robust Speech Recognition via Large-Scale Weak Supervision". Kode dan model yang sudah dilatih dirilis dengan lisensi MIT, salah satu lisensi sumber terbuka yang paling longgar. Lisensi ini memperbolehkan orang memakai, mengubah, dan menyebarkan perangkat lunaknya, termasuk dalam produk komersial.',
        'Sebelum Whisper, pengenalan ucapan terbaik sebagian besar terkunci di dalam layanan perusahaan besar, atau dibuat untuk satu bahasa atau satu jenis audio. Whisper mengubah hal itu karena cukup bagus, cukup luas cakupannya, dan gratis dijalankan sendiri. OpenAI juga menjual akses ke pengenalan ucapan lewat layanan webnya sendiri, tetapi itu produk berbayar yang terpisah. Model yang Anda jalankan di browser di sini adalah yang terbuka.',
      ],
    },
    {
      title: 'Dilatih dengan apa',
      paragraphs: [
        'Whisper belajar dari sekitar 680.000 jam audio yang dipasangkan dengan transkrip, dikumpulkan dari internet. Kira-kira sepertiga dari audio itu bukan dalam bahasa Inggris, mencakup sekitar seratus bahasa (rilisnya mencantumkan 99). Tidak semua transkripnya diperiksa dengan tangan, dan itulah yang dimaksud "weak supervision" (pengawasan lemah) dalam judul makalah.',
        'Dua hal praktis mengikutinya. Karena audio pelatihannya sangat beragam, dengan mikrofon, aksen, ruangan, dan topik yang berbeda-beda, Whisper menghadapi rekaman dunia nyata lebih baik daripada model yang dilatih dengan ucapan studio yang rapi. Namun jumlah audio pelatihan berbeda dari bahasa ke bahasa, sehingga akurasinya tidak merata: umumnya paling kuat untuk bahasa Inggris dan bahasa lain yang banyak penuturnya dan punya banyak contoh, dan lebih lemah untuk bahasa dengan data pelatihan sedikit.',
      ],
    },
    {
      title: 'Cara kerjanya, dalam bahasa sederhana',
      paragraphs: [
        'Whisper memotong audio menjadi jendela berdurasi 30 detik dan mengubah masing-masing menjadi gambaran bunyi yang disebut spektrogram, yang menunjukkan seberapa keras setiap nada dari waktu ke waktu. Modelnya lalu punya dua bagian. Encoder mempelajari gambaran itu. Decoder menuliskan teks sepotong kecil demi sepotong, seperti orang yang menulis kalimat sambil memikirkan apa yang datang berikutnya.',
        'Decoder juga menulis penanda khusus: bahasa apa yang dikiranya diucapkan, apakah harus mentranskripsikan atau menerjemahkan, dan di mana setiap kalimat dimulai dan berakhir dalam waktu. Dari situlah penanda waktu berasal.',
        'Rekaman panjang ditangani jendela demi jendela. Rancangan ini fleksibel, tetapi menjelaskan dua kebiasaan Whisper: ia bisa kehilangan alur di antara jendela, dan bisa mengulang dirinya sendiri ketika sebuah jendela hanya berisi sedikit ucapan. TranscribeVid mengurangi keduanya dengan pendeteksi ucapan yang melewati keheningan dan sebagian besar bunyi non-ucapan sebelum model melihatnya, dan dengan pemeriksaan yang menangkap sebagian teks yang berulang atau dikarang sesudahnya.',
      ],
    },
    {
      title: 'Ukuran model, dan yang mana yang Anda dapatkan di sini',
      paragraphs: [
        'Whisper hadir dalam beberapa ukuran. Model yang lebih besar membuat lebih sedikit kesalahan, terutama pada derau dan bahasa selain Inggris, tetapi lebih lambat dan membutuhkan lebih banyak memori serta unduhan yang lebih besar. Empat pilihan kualitas di halaman unggah dipetakan ke ukuran-ukuran ini seperti berikut:',
      ],
      table: {
        caption: 'Ukuran Whisper dan pilihan di TranscribeVid',
        head: ['Model', 'Parameter (kira-kira)', 'Di mana menemukannya di sini'],
        rows: [
          ['Tiny', '39 juta', 'Opsi lainnya, Daftar model'],
          ['Base', '74 juta', 'Tercepat'],
          ['Small', '244 juta', 'Standar'],
          ['Medium', '769 juta', 'Opsi lainnya, Daftar model'],
          ['Large v3 Turbo', '809 juta', 'Akurasi tinggi'],
          ['Large v3', '1,55 miliar', 'Akurasi terbaik'],
        ],
      },
      after: [
        'Large v3 dirilis pada November 2023, dan versi Turbo menyusul pada 2024. Turbo adalah model besar yang dipangkas, jauh lebih cepat dan mendekati akurasinya untuk banyak bahasa, itulah sebabnya ia menjadi pilihan Akurasi tinggi. Satu batasan: OpenAI menyatakan Turbo tidak dilatih untuk menerjemahkan dan bisa mengembalikan bahasa aslinya ketika diminta menerjemahkan, jadi untuk Output, Terjemahkan ke bahasa Inggris, pilih Akurasi terbaik. Daftar model juga memuat Distil Large v3, versi sulingan Whisper large v3 yang lebih kecil dan lebih cepat, khusus bahasa Inggris. Di bawah Mesin pengenalan ada pula Qwen3 ASR, mesin lain yang bersifat eksperimental untuk browser desktop dengan WebGPU. Qwen3 ASR bukan model Whisper.',
      ],
    },
    {
      title: 'Apa yang dilakukannya dengan baik',
      bullets: [
        {
          title: 'Audio dunia nyata.',
          text: 'Rekaman ponsel, kuliah, wawancara, dan suara video dengan derau sedang.',
        },
        {
          title: 'Banyak bahasa dalam satu model.',
          text: 'Keluarga model yang sama menangani bahasa Inggris, Spanyol, Hindi, Arab, Jepang, dan puluhan lainnya, dan sering kali bisa menentukan bahasanya sendiri.',
        },
        {
          title: 'Tanda baca dan huruf besar.',
          text: 'Whisper menulis kalimat dengan huruf kapital dan tanda baca, bukan satu untaian panjang kata huruf kecil.',
        },
        {
          title: 'Penanda waktu.',
          text: 'Setiap baris disertai waktu mulai dan selesai, dan dengan Waktu per kata halaman bisa menempatkan setiap kata.',
        },
        {
          title: 'Terjemahan ke bahasa Inggris.',
          text: 'Whisper bisa mengubah ucapan dalam bahasa lain langsung menjadi teks bahasa Inggris, yang ditawarkan halaman sebagai Output, Terjemahkan ke bahasa Inggris. Turbo adalah pengecualian: ia tidak dilatih untuk menerjemahkan, jadi pakai Akurasi terbaik untuk ini.',
        },
      ],
    },
    {
      title: 'Di mana ia kesulitan',
      paragraphs: [
        'Whisper mengesankan, dan juga bisa keliru. Kenali kebiasaan berikut sebelum Anda mengandalkan sebuah transkrip.',
      ],
      bullets: [
        {
          title: 'Ia bisa mengarang teks.',
          text: 'Jika diberi keheningan, musik, atau derau, ia bisa menulis kata-kata lancar yang tidak diucapkan siapa pun, atau mengulang suatu frasa berkali-kali. Ini perilaku model yang sudah dikenal, bukan kesalahan satu rekaman.',
        },
        {
          title: 'Nama, angka, dan kata langka.',
          text: 'Ia mengeja nama dengan cara yang dianggapnya paling mungkin, dan bisa menukar kata yang bunyinya mirip. Pakai petunjuk kosakata, lalu periksa angkanya.',
        },
        {
          title: 'Bahasa yang tidak merata.',
          text: 'Akurasi berbeda menurut bahasa dan aksen. Model yang lebih besar sangat membantu untuk bahasa dengan data pelatihan yang lebih sedikit.',
        },
        {
          title: 'Tanpa label pembicara.',
          text: 'Ia tidak menyebutkan siapa yang berbicara, dan suara yang saling menimpa sering digabung atau dibuang.',
        },
        {
          title: 'Bukan langsung.',
          text: 'Ia bekerja pada rekaman jendela demi jendela, jadi tidak dirancang untuk teks yang muncul saat seseorang berbicara.',
        },
      ],
    },
    {
      title: 'Bagaimana TranscribeVid menjalankan Whisper di browser Anda',
      paragraphs: [
        'Whisper yang asli ditulis untuk perangkat lunak pembelajaran mesin khusus. Agar bisa dijalankan di halaman web, modelnya diubah ke format portabel bernama ONNX, dan sebuah pustaka bernama Transformers.js, dari Hugging Face, menjalankannya dengan ONNX Runtime. Di komputer dengan WebGPU, pekerjaan dilakukan oleh chip grafis, yang cepat. Jika tidak, pekerjaan dijalankan oleh prosesor lewat WebAssembly, yang lebih lambat tetapi berfungsi di hampir semua tempat.',
        'Agar unduhannya tetap wajar, model memakai format angka yang ringkas, yang mengecilkan file, biasanya dengan sedikit pengorbanan akurasi. Begitulah model terbesar hanya sekitar satu gigabita dengan WebGPU (1,8 GB dengan WebAssembly), bukan beberapa gigabita.',
        'Di transcribevid.com, menjalankan di browser punya dua konsekuensi. Pertama, privasi: file media Anda dibaca di perangkat Anda dan tidak diunggah, sehingga tidak ada server kami yang pernah menerima audio Anda. Kedua, kecepatan: bergantung pada perangkat Anda, dan penggunaan pertama setiap tingkat kualitas mencakup unduhan model satu kali. Panduan tentang mentranskripsikan tanpa mengunggah menjelaskan apa yang diunduh dan cara memeriksanya.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Apakah Whisper gratis dipakai?',
      answer:
        'Model dan kodenya gratis dan bersumber terbuka di bawah lisensi MIT, jadi siapa pun bisa menjalankannya. Menjalankan model besar membutuhkan komputer yang mumpuni atau server sewaan, dan OpenAI juga menawarkan layanan webnya sendiri yang berbayar. Di transcribevid.com ia berjalan di perangkat Anda, jadi tidak ada yang perlu dibayar.',
    },
    {
      question: 'Berapa banyak bahasa yang dipahami Whisper?',
      answer:
        'Sekitar seratus; rilisnya mencantumkan 99. Kualitasnya sangat berbeda di antara bahasa-bahasa itu. TranscribeVid menawarkan 61 di antaranya dalam daftar Bahasa, dan Anda juga bisa memilih Deteksi otomatis.',
    },
    {
      question: 'Ukuran Whisper mana yang sebaiknya saya pilih?',
      answer:
        'Mulailah dengan Standar, yaitu model Small. Beralihlah ke Akurasi tinggi untuk aksen, derau, atau bahasa selain Inggris, dan ke Akurasi terbaik ketika setiap kata penting dan Anda bisa menunggu. Tercepat hanya untuk ucapan yang jernih dan tenang.',
    },
    {
      question: 'Mengapa Whisper kadang menulis kata di tempat yang tidak ada orang berbicara?',
      answer:
        'Model ini dibuat untuk selalu menghasilkan teks yang masuk akal, jadi rentang keheningan, musik, atau derau bisa membuatnya mengarang sesuatu. Dengan menjaga Lewati keheningan & musik tetap aktif, sebagian besar rentang itu dilewati sebelum model melihatnya.',
    },
  ],
  links: [
    {
      label: 'Cara mendapatkan transkrip yang lebih akurat',
      path: '/guides/accurate-transcripts',
      note: 'Pengaturan dan kebiasaan yang paling besar pengaruhnya pada hasil Whisper.',
    },
    {
      label: 'Transkripsikan video tanpa mengunggahnya',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Apa yang diunduh browser Anda untuk menjalankan Whisper, dan cara memastikan tidak ada yang diunggah.',
    },
    {
      label: 'Terjemahkan ucapan ke bahasa Inggris',
      path: '/translate-audio-to-english',
      note: 'Pakai terjemahan Whisper untuk mendapatkan teks bahasa Inggris dari ucapan dalam bahasa lain.',
    },
    {
      label: 'Audio ke teks',
      path: '/audio-to-text',
      note: 'Masukkan rekaman dan dapatkan transkrip dengan penanda waktu.',
    },
    {
      label: 'Audio Hindi ke teks (halaman bahasa Inggris)',
      path: '/hindi-audio-to-text',
      note: 'Cara Whisper menangani bahasa Hindi, termasuk opsi Hinglish beraksara Latin.',
    },
  ],
};
