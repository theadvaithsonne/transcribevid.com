import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Cara mendapatkan transkrip yang lebih akurat',
  lead: 'Akurasi bergantung pertama-tama pada suaranya, lalu pada tiga pilihan yang Anda kendalikan: bahasa, tingkat kualitas, dan petunjuk kosakata. Panduan ini menunjukkan apa yang perlu diubah sebelum Anda merekam, pengaturan mana yang membantu, bagaimana menemukan kesalahan yang tersisa, dan apa yang sama sekali tidak bisa dilakukan oleh pengenalan ucapan.',
  readingMinutes: 9,
  toolPath: '/video-to-text',
  toolCta: 'Transkripsikan video dengan pengaturan terbaik',
  blocks: [
    {
      title: 'Apa yang menentukan akurasi sebuah transkrip',
      paragraphs: [
        'Pengenalan ucapan mendengarkan, kurang lebih seperti Anda. Jika seseorang berbicara dengan jelas, dekat dengan mikrofon, di ruangan yang tenang, dalam bahasa yang dikenal baik oleh model, transkripnya biasanya sangat bagus. Jika suaranya jauh, berisik, bergema, atau penuh dengan banyak suara, manusia pun harus berkonsentrasi, dan perangkat lunak membuat lebih banyak kesalahan.',
        'Itu memberi urutan prioritas yang sederhana. Perbaiki audio lebih dulu, karena tidak ada langkah berikutnya yang bisa memulihkan kata-kata yang tidak pernah tertangkap. Lalu beri tahu program bahasanya. Lalu pilih tingkat kualitas yang sesuai dengan tingkat kesulitannya. Lalu berikan kata-kata tidak lazim yang tidak bisa ditebaknya. Terakhir, periksa hasilnya, karena tidak ada transkrip yang sempurna.',
      ],
    },
    {
      title: 'Perbaiki rekamannya sendiri',
      paragraphs: [
        'Beberapa menit kehati-hatian saat merekam lebih berharga daripada pengaturan apa pun sesudahnya.',
      ],
      bullets: [
        {
          title: 'Mendekatlah.',
          text: 'Letakkan mikrofon sejauh satu atau dua telapak tangan dari mulut pembicara. Ponsel yang dipegang dekat mengalahkan laptop di seberang meja.',
        },
        {
          title: 'Pilih ruangan yang tenang dan empuk.',
          text: 'Tirai, karpet, dan sofa menyerap gema. Dinding kosong dan ruangan besar yang lengang membuat kata-kata menyatu. Matikan kipas angin, pendingin ruangan, dan notifikasi.',
        },
        {
          title: 'Jauhkan musik dari bawah suara.',
          text: 'Musik latar sulit dipisahkan dari ucapan. Tambahkan sesudah mentranskripsikan, bukan sebelumnya.',
        },
        {
          title: 'Satu suara dalam satu waktu.',
          text: 'Pembicara yang saling menyela adalah kasus yang paling sulit. Minta orang saling menunggu, dan pakai satu mikrofon per orang jika bisa.',
        },
        {
          title: 'Jangan khawatirkan laju sampel.',
          text: 'Model ucapan membaca suara pada 16 kHz dalam mono, dan halaman mengubah file apa pun ke bentuk itu secara otomatis. Laju yang lebih tinggi atau campuran surround tidak membantu; yang berpengaruh adalah jarak, derau, dan tingkat volume.',
        },
        {
          title: 'Hindari kompresi yang berat.',
          text: 'File berbitrate sangat rendah, seperti pesan suara yang terperas lewat koneksi yang lemah, kehilangan detail yang dibutuhkan model. Pakai rekaman asli jika Anda memilikinya.',
        },
      ],
    },
    {
      title: 'Beri tahu bahasanya',
      paragraphs: [
        'Halaman bisa mendeteksi bahasa sendiri, dan untuk rekaman panjang dalam bahasa Inggris yang jelas biasanya tepat. Namun untuk klip pendek, aksen yang kental, dan rekaman yang mencampur bahasa, deteksi bisa menebak dengan salah, dan tebakan yang salah membuat seluruh transkrip buruk. Memilih bahasa di daftar Bahasa hanya butuh satu klik dan menghilangkan risikonya.',
        'Jika halaman tidak bisa mengenali bahasanya dengan yakin, halaman menyatakannya dan meminta Anda memilih bahasa yang Anda dengar. Lakukan itu dan jalankan lagi. Untuk ucapan yang berpindah antara dua bahasa, seperti Hindi dan Inggris, pilih bahasa utamanya dan periksa bagian dalam bahasa yang lain.',
      ],
    },
    {
      title: 'Pilih tingkat kualitas yang tepat',
      paragraphs: [
        'Empat pilihan kualitas menjalankan ukuran yang berbeda dari keluarga model yang sama. Model yang lebih besar membuat lebih sedikit kesalahan pada aksen, derau, bahasa lain, dan kata langka, tetapi memakan waktu lebih lama dan unduhan pertamanya lebih besar.',
      ],
      table: {
        caption: 'Pilihan kualitas dan kapan memakai masing-masing',
        head: ['Pilihan', 'Paling cocok untuk', 'Imbalannya'],
        rows: [
          [
            'Tercepat',
            'Ucapan jernih pada rekaman yang tenang, draf cepat',
            'Kesalahan terbanyak dari keempatnya pada audio yang sulit',
          ],
          [
            'Standar',
            'Sebagian besar video dan rekaman suara (pilihan awal yang biasa)',
            'Keseimbangan kecepatan dan akurasi yang baik',
          ],
          [
            'Akurasi tinggi',
            'Aksen, kebisingan latar, ucapan non-Inggris',
            'Lebih lambat, unduhan lebih besar',
          ],
          [
            'Akurasi terbaik',
            'Audio sulit yang setiap katanya penting',
            'Paling lambat, unduhan terbesar',
          ],
        ],
      },
      after: [
        'Kebiasaan yang baik adalah mulai dengan Standar pada cuplikan pendek dari rekaman Anda, membacanya, dan naik satu tingkat hanya jika kesalahannya mengganggu. Di bawah Opsi lainnya Anda juga bisa memilih dari daftar lengkap model. Pada sebagian perangkat Akurasi tinggi dan Akurasi terbaik diredupkan, dengan alasan yang ditampilkan, seperti "butuh 8 GB" atau "pakai komputer untuk ukuran ini", karena model yang lebih besar membutuhkan lebih banyak memori. Setiap pilihan yang lebih besar juga merupakan unduhan pertama yang lebih besar, dan halaman menunjukkan ukurannya sebelum Anda mulai.',
      ],
    },
    {
      title: 'Pakai petunjuk kosakata untuk nama dan istilah khusus',
      paragraphs: [
        'Model ucapan mengenal kata umum dengan baik dan kata langka dengan buruk. Nama seseorang, perusahaan, produk, tempat, atau istilah teknis dieja dengan cara yang paling mungkin menurut model, yang sering kali salah. Petunjuk kosakata di bawah Opsi lainnya ada untuk hal ini.',
        'Ketik kata-kata yang tidak lazim seperti yang Anda inginkan penulisannya, misalnya kalimat seperti "Wawancara dengan Dr. Okafor tentang Kubernetes dan PostgreSQL." Satu baris yang pendek dan alami yang memuat kata-kata itu bekerja lebih baik daripada daftar yang panjang. Petunjuk ini opsional dan bisa memuat hingga 1.000 karakter. Halaman tidak menyimpannya dalam pengaturan yang diingat, kalau-kalau berisi nama pribadi.',
        'Petunjuk ini membantu ejaan. Petunjuk ini tidak mengajari model mendengar kata yang digumamkan atau tertutup derau.',
      ],
    },
    {
      title: 'Perbaiki audio dan Lewati keheningan & musik',
      paragraphs: [
        'Dua sakelar di bawah Opsi lainnya aktif secara bawaan, dan untuk sebagian besar rekaman sebaiknya Anda biarkan aktif.',
      ],
      bullets: [
        {
          title: 'Perbaiki audio.',
          text: 'Menyaring dengung yang sangat rendah dan desis yang sangat tinggi, lalu menyeimbangkan volume agar pembicara yang pelan tidak hilang di samping yang keras. Jika sebuah rekaman terdengar baik bagi Anda tetapi transkripnya aneh, coba sekali dengan sakelar ini dimatikan untuk melihat apakah filternya penyebabnya.',
        },
        {
          title: 'Lewati keheningan & musik.',
          text: 'Pendeteksi ucapan menemukan bagian yang berisi suara manusia dan hanya meneruskan bagian itu ke model. Keheningan dan sebagian besar bunyi non-ucapan, seperti musik tanpa nyanyian, tidak pernah sampai ke model, yang mencegah banyak teks karangan yang bisa dihasilkan model ketika tidak ada yang bisa didengarnya. Musik dengan nyanyian di dalamnya mungkin masih lolos. Matikan hanya jika ucapan yang pelan ikut terbuang.',
        },
      ],
      after: [
        'Waktu per kata juga aktif secara bawaan. Opsi ini tidak mengubah kata mana yang ditemukan, tetapi memungkinkan subtitle dimulai dan berakhir tepat bersama kata-katanya dan menjadi dasar tanda yang menunjukkan kata mana yang tidak pasti.',
      ],
    },
    {
      title: 'Periksa hasilnya: di mana kesalahan bersembunyi',
      paragraphs: [
        'Saat transkrip siap, jangan membacanya dari atas ke bawah lebih dulu. Carilah tandanya. Kata yang kurang diyakini model digarisbawahi, dengan garis bawah yang lebih tebal untuk yang paling tidak pasti. Jika seluruh transkrip berkeyakinan rendah, atau bahasanya tidak pasti, halaman menampilkan pemberitahuan dengan tombol untuk meninjau bahasa dan kualitasnya.',
        'Skor keyakinan adalah petunjuk tentang di mana harus melihat, bukan persentase akurasi, jadi kata tanpa garis bawah masih bisa salah. Curahkan perhatian Anda dengan urutan ini:',
      ],
      bullets: [
        {
          title: 'Nama dan tempat.',
          text: 'Ini adalah kesalahan yang paling umum dan yang paling memalukan.',
        },
        {
          title: 'Angka, tanggal, dan satuan.',
          text: 'Angka yang salah mengubah makna. Periksa masing-masing terhadap rekamannya.',
        },
        {
          title: 'Kata yang bunyinya mirip.',
          text: 'Kata seperti sangsi dan sanksi, atau massa dan masa, dipilih dari konteks dan bisa tertukar.',
        },
        {
          title: 'Bagian di dekat derau atau suara yang saling tumpang tindih.',
          text: 'Dengarkan lagi pada penanda waktunya. Klik sebuah baris untuk melompat ke momen itu.',
        },
      ],
      after: [
        'Perbaiki apa yang Anda temukan langsung di teks. Suntingan Anda tersimpan di transkrip dan mengalir ke setiap ekspor.',
      ],
    },
    {
      title: 'Masalah dan apa yang dicoba',
      table: {
        caption: 'Masalah umum dan apa yang dicoba lebih dulu',
        head: ['Masalah', 'Apa yang dicoba'],
        rows: [
          [
            'Bahasa salah, atau teks dalam aksara yang salah',
            'Pilih sendiri bahasanya alih-alih Deteksi otomatis',
          ],
          [
            'Nama dan merek dieja salah',
            'Tambahkan ke Petunjuk kosakata di bawah Opsi lainnya, lalu transkripsikan lagi file itu dari halaman utama',
          ],
          [
            'Banyak kesalahan pada aksen atau suara yang berisik',
            'Naik satu tingkat kualitas, dan biarkan Perbaiki audio tetap aktif',
          ],
          [
            'Teks muncul di tempat tidak ada yang berbicara',
            'Biarkan Lewati keheningan & musik tetap aktif; pangkas bagian yang hening atau hanya berisi musik',
          ],
          [
            'Frasa yang sama berulang terus-menerus',
            'Biarkan Gunakan teks sebelumnya sebagai konteks tetap mati, dan coba tingkat kualitas yang berbeda',
          ],
          [
            'Dua orang berbicara saling menimpa',
            'Tidak ada perbaikan di perangkat lunak: rekam mereka dengan mikrofon terpisah lain kali',
          ],
          [
            'Pembicara yang sangat pelan atau jauh terlewat',
            'Biarkan Perbaiki audio tetap aktif; jika ucapan masih terbuang, matikan Lewati keheningan & musik untuk file itu',
          ],
        ],
      },
    },
    {
      title: 'Apa yang tidak bisa dilakukan pengenalan ucapan',
      paragraphs: [
        'Mengetahui batasnya membantu Anda menemukan masalah sejak dini. Transkrip dari pengenalan ucapan mana pun, termasuk yang ini, bisa memuat hal-hal berikut.',
      ],
      bullets: [
        {
          title: 'Tanpa nama pembicara.',
          text: 'Layanan ini menuliskan apa yang dikatakan, bukan siapa yang mengatakannya. Tambahkan nama secara manual saat Anda mengedit.',
        },
        {
          title: 'Teks karangan.',
          text: 'Jika diberi keheningan, musik, atau derau, model bisa menghasilkan kata-kata lancar yang tidak diucapkan siapa pun, atau mengulang suatu frasa berkali-kali. Jika Anda melihat teks di tempat Anda tidak mendengar apa-apa, hapus.',
        },
        {
          title: 'Kata yang bunyinya mirip dan kata langka yang keliru.',
          text: 'Layanan ini memilih kata yang paling mungkin, yang tidak selalu yang benar.',
        },
        {
          title: 'Kata yang hilang saat suara saling menimpa.',
          text: 'Ucapan yang tumpang tindih biasanya ditranskripsikan sebagai satu suara atau sebagian terbuang.',
        },
        {
          title: 'Tanpa jaminan.',
          text: 'Untuk apa pun yang bersifat hukum, medis, keuangan, atau yang diterbitkan, perlakukan transkrip sebagai draf yang harus diperiksa oleh manusia.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Tingkat kualitas mana yang memberikan transkrip paling akurat?',
      answer:
        'Akurasi terbaik biasanya membuat paling sedikit kesalahan, dengan Akurasi tinggi sering kali tidak jauh di belakang, lalu Standar dan Tercepat. Selisihnya paling berarti untuk aksen, derau, dan bahasa selain Inggris. Pada ucapan bahasa Inggris yang jernih perbedaannya kecil, jadi Standar sering kali sudah cukup.',
    },
    {
      question:
        'Apakah mikrofon yang lebih baik lebih membantu daripada pengaturan yang lebih baik?',
      answer:
        'Biasanya, ya. Suara yang bersih dan dekat memungkinkan model yang lebih kecil bekerja dengan baik, sedangkan suara yang buruk membatasi bahkan model terbesar. Memindahkan mikrofon lebih dekat dan mengurangi kebisingan latar adalah peningkatan termurah yang bisa Anda lakukan.',
    },
    {
      question:
        'Haruskah saya membersihkan audio di aplikasi penyunting sebelum mentranskripsikan?',
      answer:
        'Jarang. Halaman sudah menyaring dengung dan desis serta menyeimbangkan volume saat Perbaiki audio aktif. Filter pengurang derau yang berat di aplikasi penyunting bisa mendistorsi ucapan dan memperburuk pengenalan, jadi pakai pengaturan yang lembut atau tidak sama sekali.',
    },
    {
      question: 'Mengapa dua tingkat kualitas memberikan teks yang berbeda untuk file yang sama?',
      answer:
        'Keduanya adalah ukuran model yang berbeda, jadi masing-masing mendengar dan mengeja bagian yang sulit dengan caranya sendiri. Di tempat dua hasil berbeda, dengarkan bagian itu pada penanda waktunya, karena kemungkinan itu bagian yang sulit dan layak diperiksa dengan telinga.',
    },
    {
      question: 'Bisakah saya membuat transkrip lebih akurat dengan mengeditnya?',
      answer:
        'Mengedit memperbaiki teks yang Anda ekspor; tidak melatih ulang model. Perbaiki nama, angka, dan kata yang tidak jelas di halaman transkrip dan unduh versi yang sudah diperbaiki. Proses baru dengan petunjuk kosakata mengurangi koreksi di lain waktu.',
    },
  ],
  links: [
    {
      label: 'Apa itu Whisper?',
      path: '/guides/what-is-whisper',
      note: 'Model ucapan di balik tingkat kualitas, dan di mana model itu kuat atau lemah.',
    },
    {
      label: 'Transkripsi wawancara',
      path: '/interview-transcription',
      note: 'Tips mentranskripsikan percakapan dengan dua suara dan banyak nama.',
    },
    {
      label: 'Kuliah ke teks',
      path: '/lecture-to-text',
      note: 'Dapatkan catatan dari kuliah yang direkam, bahkan dari bagian belakang ruangan besar.',
    },
    {
      label: 'Audio Hindi ke teks (halaman bahasa Inggris)',
      path: '/hindi-audio-to-text',
      note: 'Memilih bahasa paling penting untuk bahasa Hindi dan ucapan non-Inggris lainnya.',
    },
    {
      label: 'Transkripsikan video tanpa mengunggahnya',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Cara kerja mesin di dalam browser dan apa yang diubah oleh perangkat yang Anda pakai.',
    },
  ],
};
