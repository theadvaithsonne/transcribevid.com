import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Cara mentranskripsikan video tanpa mengunggahnya',
  lead: 'Di transcribevid.com pengenalan ucapan berjalan di dalam browser Anda sendiri, jadi file video atau audio Anda dibaca di perangkat Anda dan tidak dikirim ke situs web, ke Google, atau ke pihak mana pun. Panduan ini menjelaskan cara kerjanya, apa yang tetap diunduh browser Anda, apa yang tetap dikirim, dan bagaimana Anda bisa memeriksa semuanya sendiri.',
  readingMinutes: 9,
  toolPath: '/video-to-text',
  toolCta: 'Transkripsikan video di perangkat Anda',
  blocks: [
    {
      title: 'Apa arti "tanpa mengunggah" di sini',
      paragraphs: [
        'Kebanyakan layanan transkripsi online bekerja dengan cara yang sama: Anda mengirim file ke server mereka, komputer yang tidak Anda lihat mentranskripsikannya, dan Anda mengunduh hasilnya. Rekaman Anda berada di mesin orang lain selama mereka menyimpannya.',
        'Di transcribevid.com pekerjaan terjadi dengan cara sebaliknya. Program pengenalan ucapan datang ke browser Anda, dan browser Anda menjalankannya di komputer atau ponsel Anda sendiri. File media dibaca dari disk Anda oleh halaman yang sedang Anda buka. File itu tidak pernah dilampirkan pada permintaan ke situs, dan tidak pernah dikirim ke Google, ke perusahaan yang menyediakan unduhan, atau ke layanan ucapan mana pun.',
        'Itulah sebabnya situs ini tidak menetapkan batas ukuran atau durasi dan tidak memiliki antrean: tidak ada server milik kami yang melakukan pekerjaan itu, jadi tidak ada tagihan per file, dan tidak ada orang yang menunggu di depan Anda. Rekaman yang sangat panjang tetap membutuhkan waktu dan memori kosong di perangkat Anda. Itu juga sebabnya wawancara rahasia atau video keluarga yang pribadi bisa ditranskripsikan tanpa meninggalkan perangkat Anda.',
        'Panduan ini menjelaskan situs web di transcribevid.com. Salinan perangkat lunak yang dipasang seseorang di servernya sendiri bekerja secara berbeda: perangkat lunak itu mengirim file ke server tersebut lewat koneksi terenkripsi dan menghapusnya secara otomatis sesudahnya.',
      ],
    },
    {
      title: 'Cara kerjanya, langkah demi langkah',
      steps: [
        {
          title: 'Halaman dimuat',
          text: 'Browser Anda mengambil halaman dan kode programnya dari transcribevid.com, yang di-hosting di Cloudflare. Ini sama seperti membuka situs web lain mana pun.',
        },
        {
          title: 'Model ucapan diunduh satu kali',
          text: 'Saat pertama kali Anda memakai suatu tingkat kualitas, browser Anda mengunduh model pengenalan ucapan untuknya dari Hugging Face, bersama file mesin yang menjalankannya dari jsDelivr. File-file itu disimpan di cache browser Anda, sehingga transkripsi berikutnya dimulai tanpa mengunduhnya lagi.',
        },
        {
          title: 'File Anda didekode di perangkat Anda',
          text: 'Dekoder audio dan video bawaan browser mengubah file menjadi suara mono 16 kHz biasa, yang dibaca oleh model. Untuk beberapa format yang tidak bisa dibuka sendiri oleh browser, seperti AVI, WMA, dan FLV, halaman menanyakan dulu lalu mengunduh konverter sekitar 9 MB, yang juga berjalan di perangkat Anda.',
        },
        {
          title: 'Sebuah worker menjalankan model',
          text: 'Utas latar belakang pada halaman, yang disebut Web Worker, menjalankan model agar halaman tetap responsif. Utas itu memakai chip grafis Anda lewat WebGPU jika browser mendukungnya, dan jika tidak, memakai prosesor Anda lewat WebAssembly.',
        },
        {
          title: 'Teks muncul, dan tetap di browser Anda',
          text: 'Transkrip dibangun baris demi baris dengan penanda waktu. Transkrip disimpan di penyimpanan browser Anda sendiri selama sesi, dan file SRT, VTT, TXT, Markdown, JSON, dan PDF yang Anda unduh juga dibuat di perangkat Anda.',
        },
      ],
    },
    {
      title: 'Apa yang memang diunduh browser Anda',
      paragraphs: [
        'Tidak mengunggah bukan berarti tidak mengunduh. Model ucapan adalah file besar, dan browser Anda harus mengambilnya sebelum bisa mentranskripsikan apa pun. Inilah yang masuk, dan dari mana.',
      ],
      table: {
        caption: 'Apa yang diunduh halaman, dari mana, dan kapan',
        head: ['Apa', 'Dari', 'Kapan', 'Kira-kira seberapa besar'],
        rows: [
          [
            'Halaman dan kode programnya',
            'transcribevid.com (Cloudflare)',
            'Setiap kunjungan, lalu di-cache',
            'Sekitar 200 KB',
          ],
          [
            'Kode mesin yang menjalankan model',
            'transcribevid.com',
            'Transkripsi pertama, lalu di-cache',
            'Di bawah 1 MB',
          ],
          [
            'Runtime model (ONNX Runtime, WebAssembly)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Transkripsi pertama, lalu di-cache',
            'Sekitar 17 sampai 27 MB',
          ],
          [
            'Model deteksi ucapan yang kecil',
            'transcribevid.com',
            'Transkripsi pertama, lalu di-cache',
            'Sekitar 1,2 MB',
          ],
          [
            'Model ucapan untuk pilihan kualitas Anda',
            'huggingface.co (Hugging Face)',
            'Satu kali untuk setiap pilihan kualitas, lalu di-cache',
            'Dari sekitar 40 MB sampai beberapa GB (lihat di bawah)',
          ],
          [
            'Konverter untuk format yang tidak bisa dibuka browser (AVI, WMA, FLV, dan sejenisnya)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Hanya jika file Anda membutuhkannya, dan hanya setelah Anda setuju',
            'Sekitar 9 MB',
          ],
          [
            'Model ejaan Hindi (IndicXlit)',
            'transcribevid.com',
            'Hanya saat bahasa Hindi ditulis dengan huruf Latin (Hinglish), lalu di-cache',
            'Sekitar 13 MB',
          ],
        ],
      },
      after: [
        'Unduhan ini adalah file program dan model, bukan data Anda. Perusahaan yang mengirimkannya melihat rincian biasa dari setiap permintaan web, seperti alamat internet dan browser Anda, tetapi tidak pernah media atau transkrip Anda.',
      ],
    },
    {
      title: 'Apa yang tetap dikirim, secara jujur',
      paragraphs: [
        'Tiga hal memang sampai ke server, dan tidak satu pun adalah file atau teks Anda.',
      ],
      bullets: [
        {
          title: 'Hosting.',
          text: 'Cloudflare menyajikan situs web, jadi Cloudflare memproses alamat internet Anda dan rincian permintaan yang biasa untuk menyajikan dan melindungi situs.',
        },
        {
          title: 'Hitungan total.',
          text: 'Saat sebuah transkripsi selesai, browser Anda mengirim satu permintaan kosong ke penghitung situs, yang menambahkan satu pada angka yang ditampilkan di header. Permintaan itu tidak membawa file, transkrip, atau pengenal. Penghitung itu dilaporkan oleh browser pengunjung dan tidak diverifikasi secara independen.',
        },
        {
          title: 'Iklan.',
          text: 'Situs ini gratis karena menampilkan iklan yang disajikan oleh Google AdSense, di halaman informasi, tidak pernah saat sebuah file sedang ditranskripsikan maupun di samping transkrip Anda. Google memakai cookie untuk iklan dan, jika hukum mewajibkannya, meminta persetujuan Anda terlebih dahulu. Skrip iklan Google membuat permintaannya sendiri ke Google, tetapi file dan transkrip Anda tidak pernah dikirim ke Google.',
        },
      ],
      after: [
        'Kebijakan privasi menguraikan semua ini secara lengkap. Tidak ada akun, dan situs ini tidak meminta nama atau alamat surel.',
      ],
    },
    {
      title: 'Cara memeriksanya sendiri',
      paragraphs: [
        'Anda tidak perlu percaya begitu saja pada kami. Setiap browser modern bisa menunjukkan apa yang dikirim dan diterima oleh sebuah halaman, dan pemeriksaannya memakan dua menit.',
      ],
      steps: [
        {
          title: 'Buka alat pengembang',
          text: 'Di Chrome, Edge, atau Firefox, buka halaman utama transcribevid.com dan tekan F12 (di Mac, Command, Option, dan I). Pilih tab Network.',
        },
        {
          title: 'Kosongkan daftarnya',
          text: 'Tekan tombol hapus, yang tampak seperti lingkaran dengan garis menyilang, agar hanya permintaan baru yang muncul.',
        },
        {
          title: 'Mulai transkripsi',
          text: 'Tambahkan file dan tekan Transkripsikan. Biarkan tab Network tetap terlihat.',
        },
        {
          title: 'Perhatikan apa yang masuk',
          text: 'Pada kali pertama, Anda akan melihat unduhan besar dari huggingface.co dan cdn.jsdelivr.net. Itulah model dan mesin yang tiba.',
        },
        {
          title: 'Cari apa yang keluar',
          text: 'Ketik method:POST ke kotak filter (Chrome dan Edge; Firefox menerima filter yang sama). Satu-satunya permintaan POST ke transcribevid.com seharusnya satu permintaan kosong ke /api/count setelah transkrip selesai. Buka permintaan itu dan periksa isi permintaannya: kosong. Jika halaman menampilkan iklan, skrip Google sendiri membuat permintaannya sendiri ke Google, dan tidak satu pun membawa file atau transkrip Anda. Tidak ada yang mendekati ukuran file Anda yang meninggalkan perangkat Anda.',
        },
      ],
    },
    {
      title: 'Seberapa besar unduhan pertama, dan seberapa cepat?',
      paragraphs: [
        'Ukurannya bergantung pada tingkat kualitas dan jenis perangkat. Perangkat dengan WebGPU mendapat build yang ringkas untuk ukurannya, sedangkan perangkat yang memakai WebAssembly mendapat build yang berbeda. Halaman memberi tahu ukuran unduhan yang persis sebelum dimulai, jadi Anda tidak pernah terkejut. Berikut perkiraan ukuran file modelnya (angka WebGPU untuk browser dengan dukungan shader 16-bit; perangkat lain mendapat build lain):',
      ],
      table: {
        caption: 'Perkiraan unduhan model pertama kali',
        head: ['Pilihan kualitas', 'Model Whisper', 'Dengan WebGPU', 'Dengan WebAssembly'],
        rows: [
          ['Tercepat', 'Base', 'Sekitar 146 MB', 'Sekitar 77 MB'],
          ['Standar', 'Small', 'Sekitar 485 MB', 'Sekitar 249 MB'],
          ['Akurasi tinggi', 'Large v3 Turbo', 'Sekitar 564 MB', 'Sekitar 1,1 GB'],
          [
            'Akurasi terbaik',
            'Large v3',
            'Sekitar 980 MB, ditambah sekitar 564 MB untuk waktu per kata',
            'Sekitar 1,8 GB, ditambah sekitar 1,1 GB untuk waktu per kata',
          ],
        ],
      },
      after: [
        'Tambahkan beberapa megabyte untuk file konfigurasi model. Large v3 tidak memiliki versi waktu per kata sendiri, jadi dengan Waktu per kata aktif, yang merupakan pengaturan bawaan, proses pertamanya juga mengunduh model penyesuaian waktu Large v3 Turbo, dan halaman menyebutkannya sebelum Anda mulai. Model Turbo itu disimpan dan dipakai bersama dengan pilihan Akurasi tinggi. Setelah unduhan pertama, model dibaca dari cache browser Anda, sehingga transkripsi berikutnya langsung dimulai. Kecepatan sesudahnya sepenuhnya bergantung pada perangkat Anda: komputer dengan chip grafis yang mumpuni dan WebGPU jauh lebih cepat daripada ponsel atau laptop lama yang memakai WebAssembly.',
      ],
    },
    {
      title: 'Kapan ini alat yang tepat, dan kapan bukan',
      paragraphs: [
        'Mentranskripsikan di perangkat Anda sendiri cocok untuk materi pribadi dan file yang panjang. Ini bukan alat terbaik untuk segalanya.',
      ],
      bullets: [
        {
          title: 'Bagus untuk rekaman rahasia.',
          text: 'Di transcribevid.com, wawancara, rapat, catatan medis atau hukum, dan video pribadi tetap berada di perangkat Anda.',
        },
        {
          title: 'Bagus untuk file yang panjang.',
          text: 'Di transcribevid.com tidak ada unggahan yang perlu ditunggu dan tidak ada batas ukuran atau durasi yang ditetapkan. Rekaman yang sangat panjang membutuhkan waktu dan memori kosong, dan browser tanpa dukungan WebCodecs mungkin menolak file yang sangat panjang.',
        },
        {
          title: 'Bukan untuk keterangan langsung.',
          text: 'Transkrip dibuat dari file atau rekaman yang sudah selesai. Layanan ini tidak memberi keterangan pada acara langsung saat berlangsung.',
        },
        {
          title: 'Bukan untuk nama pembicara.',
          text: 'Baris membawa penanda waktu, tetapi teks tidak menyebutkan siapa yang berbicara. Anda bisa mengetik nama saat mengedit.',
        },
        {
          title: 'Kurang ideal di ponsel yang lemah.',
          text: 'Ponsel memiliki memori yang lebih sedikit. Halaman memberi peringatan, dan mungkin mematikan pilihan kualitas terbesar, ketika perangkat Anda tidak mampu menjalankannya. Potong rekaman yang sangat panjang menjadi beberapa bagian.',
        },
        {
          title: 'Bukan jika Anda tidak bisa mengunduh file besar satu kali.',
          text: 'Pemakaian pertama membutuhkan koneksi yang bisa mengambil puluhan atau ratusan megabyte.',
        },
      ],
    },
    {
      title: 'Menghapus data Anda sesudahnya',
      paragraphs: [
        'Di transcribevid.com, transkrip dan file sumber Anda disimpan di penyimpanan browser Anda agar halaman bisa menampilkannya dan memungkinkan Anda mengedit dan mengekspornya. Semuanya dihapus secara otomatis saat sesi Anda berakhir setelah beberapa waktu tidak aktif, atau seketika saat Anda menekan Hapus data saya sekarang di menu Transkrip. Data yang dihapus tidak bisa dipulihkan, jadi ekspor dulu apa yang Anda butuhkan.',
        'Model ucapan tetap berada di cache browser Anda agar transkripsi berikutnya cepat, sampai Anda menghapusnya (Hapus data saya sekarang juga bisa menghapusnya) atau browser Anda membersihkan penyimpanannya. Jika Anda memakai komputer bersama atau publik, tekan Hapus data saya sekarang sebelum Anda pergi, karena siapa pun yang bisa membuka profil browser itu dapat membaca apa yang tersimpan di dalamnya.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Benarkah file saya tidak pernah diunggah?',
      answer:
        'Benar, di transcribevid.com. Pengenalan berjalan di browser Anda, dan file Anda dibaca dari disk Anda sendiri oleh halaman. Anda bisa memastikannya di tab Network pada alat pengembang browser Anda: satu-satunya permintaan yang mengirim sesuatu ke transcribevid.com adalah satu permintaan hitung yang kosong setelah transkrip selesai, dan skrip iklan Google membuat permintaannya sendiri ke Google yang tidak pernah membawa file Anda.',
    },
    {
      question: 'Apakah transkripsi tetap berjalan jika koneksi saya lambat?',
      answer:
        'Bagian yang lambat adalah unduhan pertama model ucapan, yang bisa mencapai ratusan megabyte. Setelah tersimpan di browser Anda, transkripsinya sendiri memakai perangkat Anda dan tidak membutuhkan kecepatan jaringan.',
    },
    {
      question: 'Mengapa browser saya mengunduh model dari situs web lain?',
      answer:
        'Model adalah program yang mengenali ucapan, dan ukurannya jauh terlalu besar untuk dibundel ke dalam halaman. Model diunduh dari Hugging Face, tempat penyimpanan publik untuk model semacam itu, dan mesin yang menjalankannya berasal dari jsDelivr. Tidak satu pun dari keduanya menerima media atau transkrip Anda.',
    },
    {
      question: 'Apakah mentranskripsikan di perangkat saya lebih cepat daripada mengunggah?',
      answer:
        'Bisa, karena tidak ada unggahan dan tidak ada antrean, dan komputer dengan WebGPU cepat. Pada laptop lama atau ponsel, pekerjaan yang sama bisa lebih lama daripada server yang cepat. Proses pertama juga mencakup unduhan model satu kali.',
    },
  ],
  links: [
    {
      label: 'Transkripsi wawancara',
      path: '/interview-transcription',
      note: 'Jalur pribadi untuk wawancara penelitian, jurnalisme, dan rekrutmen.',
    },
    {
      label: 'Apa itu Whisper?',
      path: '/guides/what-is-whisper',
      note: 'Model ucapan yang dijalankan browser Anda, dijelaskan dengan kata-kata sederhana.',
    },
    {
      label: 'Cara mendapatkan transkrip yang lebih akurat',
      path: '/guides/accurate-transcripts',
      note: 'Pengaturan dan kebiasaan yang menghasilkan teks lebih baik, apa pun perangkatnya.',
    },
    {
      label: 'Video ke teks',
      path: '/video-to-text',
      note: 'Tambahkan video dan lihat video itu menjadi teks berpenanda waktu di perangkat Anda sendiri.',
    },
    {
      label: 'Rekaman rapat ke teks',
      path: '/meeting-recording-to-text',
      note: 'Ubah rekaman Zoom, Teams, atau Meet yang tersimpan menjadi transkrip yang bisa dicari.',
    },
  ],
};
