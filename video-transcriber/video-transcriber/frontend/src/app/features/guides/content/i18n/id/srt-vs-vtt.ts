import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'SRT vs VTT: format subtitle mana yang sebaiknya dipakai?',
  lead: 'SRT adalah pilihan bawaan yang aman: hampir semua pemutar video, aplikasi penyunting, dan platform membacanya. Pilih VTT (WebVTT) ketika subtitle ditujukan untuk elemen video pada halaman web, atau ketika Anda membutuhkan gaya dan penempatan teks. Keduanya adalah file teks biasa, dan Anda bisa mengunduh salah satunya dari video Anda di sini.',
  readingMinutes: 7,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Buat file SRT dari video Anda',
  blocks: [
    {
      title: 'Jawaban singkatnya',
      paragraphs: [
        'Jika Anda tidak yakin, pakai SRT. Ini adalah format yang lebih tua dan lebih sederhana, dan diterima oleh hampir semua pemutar video, aplikasi penyunting video, dan formulir unggah yang mungkin Anda temui. File subtitle yang bekerja di mana-mana lebih berharga daripada yang canggih.',
        'Pakai VTT ketika video diputar di halaman web lewat elemen video HTML. Browser hanya memuat jalur subtitle dalam format WebVTT, jadi file SRT tidak akan bekerja di sana tanpa konversi. VTT juga pilihan yang lebih baik ketika Anda ingin menempatkan teks di layar, menambahkan huruf tebal atau miring dengan percaya diri, atau memberi label siapa yang berbicara.',
        'Semua isi panduan ini selanjutnya menjelaskan alasannya, menunjukkan seperti apa isi masing-masing file, dan memberi tahu cara berpindah dari satu format ke yang lain tanpa merusak apa pun.',
      ],
    },
    {
      title: 'Seperti apa isi file SRT',
      paragraphs: [
        'SRT adalah singkatan dari SubRip Text, dinamai menurut program Windows dari awal tahun 2000-an yang menyalin subtitle dari DVD. Formatnya tidak pernah distandarkan secara resmi, tetapi menjadi begitu umum sehingga semuanya mendukungnya. File SRT adalah daftar blok bernomor, masing-masing dipisahkan dari blok berikutnya oleh satu baris kosong.',
      ],
      code: {
        label: 'File SRT kecil',
        text: `1
00:00:01,000 --> 00:00:03,500
Welcome to the show.

2
00:00:03,800 --> 00:00:07,200
Today we look at how
subtitle files are built.

3
00:00:07,600 --> 00:00:10,000
Let's start with the basics.`,
      },
      after: [
        'Setiap blok memiliki tiga bagian: nomor urut, satu baris berisi waktu mulai dan waktu selesai, dan satu atau dua baris teks. Waktu ditulis sebagai jam, menit, detik, dan milidetik, dan milidetik dipisahkan dengan koma. Koma itu adalah satu-satunya penyebab paling umum mengapa file yang dikonversi secara manual gagal.',
        'Simpan file sebagai teks biasa dalam UTF-8 dengan ekstensi .srt. UTF-8 menjadi penting begitu teksnya memuat aksen, Devanagari, Arab, atau karakter non-Inggris lainnya.',
      ],
    },
    {
      title: 'Seperti apa isi file WebVTT',
      paragraphs: [
        'WebVTT, biasanya disingkat VTT, dirancang untuk web dan didefinisikan dalam spesifikasi yang diterbitkan oleh W3C, badan yang menstandarkan teknologi web. Bentuknya mirip SRT tetapi menambahkan baris header yang wajib dan beberapa tambahan opsional.',
      ],
      code: {
        label: 'Subtitle yang sama sebagai file WebVTT',
        text: `WEBVTT

NOTE This file was made from the SRT example.

intro
00:00:01.000 --> 00:00:03.500
Welcome to the show.

00:00:03.800 --> 00:00:07.200 line:85% align:center
Today we look at how
subtitle files are built.

00:00:07.600 --> 00:00:10.000
<v Maria>Let's start with the basics.</v>`,
      },
      after: [
        'Empat rincian membedakannya. Baris pertama harus WEBVTT. Milidetik dipisahkan dengan titik, bukan koma. Sebuah cue boleh memiliki nama (kata intro di atas) sebagai pengganti, atau di samping, nomor, dan nomornya opsional. Dan setelah waktu, Anda boleh menambahkan pengaturan seperti line, position, dan align, yang memindahkan teks di layar.',
        'Anda juga bisa menulis blok NOTE untuk komentar yang tidak pernah dilihat penonton, menandai siapa yang berbicara dengan tag v, dan memakai tag sederhana seperti b, i, dan u untuk huruf tebal, miring, dan bergaris bawah. Simpan file sebagai UTF-8 dengan ekstensi .vtt.',
      ],
    },
    {
      title: 'Perbandingan SRT dan VTT',
      paragraphs: [
        'Tabel ini menyandingkan keduanya. Perbedaan yang penting dalam pemakaian sehari-hari adalah header, pemisah desimal, dan tempat masing-masing format diterima.',
      ],
      table: {
        caption: 'SRT dibandingkan dengan WebVTT',
        head: ['', 'SRT', 'WebVTT (VTT)'],
        rows: [
          ['Ekstensi file', '.srt', '.vtt'],
          ['Baris pertama', 'Angka 1', 'Kata WEBVTT'],
          ['Format waktu', '00:00:01,000 (koma)', '00:00:01.000 (titik)'],
          ['Nomor cue', 'Wajib', 'Opsional (nama diperbolehkan)'],
          [
            'Posisi di layar',
            'Tidak ada dalam format',
            'Pengaturan cue: line, position, align, size',
          ],
          [
            'Gaya dan tag pembicara',
            'Hanya tag dasar, dukungan bervariasi antarpemutar',
            'Didefinisikan dalam spesifikasi, ditambah gaya CSS',
          ],
          ['Komentar', 'Tidak ada', 'Blok NOTE'],
          ['Elemen video pada halaman web', 'Tidak diterima', 'Format yang diwajibkan'],
          ['Spesifikasi resmi', 'Tidak ada (format de facto)', 'Spesifikasi W3C'],
        ],
      },
      after: [
        'Dengan kata sederhana: SRT adalah file yang lebih sederhana dengan jangkauan lebih luas, VTT adalah file yang lebih kaya dengan rumah yang lebih sempit tetapi lebih modern. Untuk subtitle ucapan biasa, teks di layar terlihat sama pada keduanya.',
      ],
    },
    {
      title: 'Tempat masing-masing format diterima',
      paragraphs: [
        'Dukungan berubah seiring waktu, dan setiap platform menuliskan halaman bantuannya secara berbeda, jadi anggap ini sebagai panduan dan periksa halaman bantuan terkini dari layanan tempat Anda mengunggah.',
      ],
      bullets: [
        {
          title: 'Halaman web.',
          text: 'Elemen track pada tag video HTML membutuhkan WebVTT. Inilah satu-satunya tempat SRT bukan pilihan.',
        },
        {
          title: 'YouTube.',
          text: 'Unggahan subtitle menerima SRT, dan juga menerima VTT, di antara format lain. SRT adalah pilihan yang biasa.',
        },
        {
          title: 'Pemutar desktop dan seluler.',
          text: 'VLC dan sebagian besar pemutar lain membaca SRT, dan banyak juga yang membaca VTT. Pemutar biasanya memuat file subtitle yang namanya sama dengan nama videonya.',
        },
        {
          title: 'Aplikasi penyunting video.',
          text: 'Sebagian besar aplikasi penyunting mengimpor SRT sebagai jalur keterangan atau subtitle. Sebagian mengimpor VTT juga. Jika satu format ditolak, coba yang lain.',
        },
        {
          title: 'Platform media sosial dan pembelajaran lainnya.',
          text: 'Banyak yang meminta SRT atau VTT, sebagian kecil meminta salah satunya saja. Baca halaman unggah sebelum Anda mengekspor.',
        },
      ],
    },
    {
      title: 'Mengonversi antara SRT dan VTT secara manual',
      paragraphs: [
        'Mengganti nama file saja tidak cukup. File bernama talk.vtt yang isinya masih SRT ditolak oleh browser, karena tidak memiliki header dan waktunya memakai koma. Konversinya memakan waktu semenit di editor teks mana pun.',
      ],
      steps: [
        {
          title: 'SRT ke VTT, langkah satu',
          text: 'Tambahkan baris WEBVTT di bagian paling atas, diikuti satu baris kosong.',
        },
        {
          title: 'SRT ke VTT, langkah dua',
          text: 'Pada setiap baris waktu, ubah koma sebelum milidetik menjadi titik. Cari-dan-ganti pada baris --> , atau pada pola angka di sekitar koma, menghemat waktu.',
        },
        {
          title: 'SRT ke VTT, langkah tiga',
          text: 'Biarkan nomornya di tempatnya, karena VTT mengizinkannya sebagai nama cue. Simpan sebagai UTF-8 dengan ekstensi .vtt.',
        },
        {
          title: 'VTT ke SRT',
          text: 'Lakukan sebaliknya: hapus header, blok NOTE, dan pengaturan apa pun setelah waktu, ubah titik kembali menjadi koma, pastikan setiap cue memiliki nomor, dan simpan sebagai .srt.',
        },
      ],
      after: [
        'Jika ffmpeg terpasang di komputer Anda, ffmpeg juga mengonversi file subtitle: ffmpeg -i talk.srt talk.vtt mengubah file SRT menjadi file VTT, dan perintah yang sama dengan nama yang dibalik berfungsi untuk arah sebaliknya. Namun jalan yang paling sederhana adalah mengunduh format yang Anda butuhkan dari halaman transkrip, karena keduanya dihasilkan langsung dari teks yang sama.',
      ],
    },
    {
      title: 'Masalah umum dan penyebabnya',
      bullets: [
        {
          title: 'Aksen atau huruf non-Latin tampil sebagai simbol aneh.',
          text: 'File tidak disimpan sebagai UTF-8. Simpan ulang dengan pengodean itu.',
        },
        {
          title: 'Tidak ada yang tampil di halaman web.',
          text: 'File berupa SRT, bukan VTT, atau server mengirimkannya dengan jenis yang salah. File VTT seharusnya disajikan sebagai text/vtt, dan file di domain lain juga membutuhkan pengaturan lintas asal yang tepat.',
        },
        {
          title: 'Subtitle terlambat atau terlalu awal di mana-mana.',
          text: 'Seluruh file bergeser. Sebagian besar pemutar dan aplikasi penyunting memungkinkan Anda menggeser subtitle dengan waktu tetap, yang lebih mudah daripada mengedit setiap baris.',
        },
        {
          title: 'Dua subtitle saling tumpang tindih di layar.',
          text: 'Waktu selesai satu cue lebih lambat daripada waktu mulai cue berikutnya. Persingkat cue yang lebih awal.',
        },
        {
          title: 'Baris terlalu panjang untuk dibaca.',
          text: 'Pecah menjadi dua baris dengan panjang yang kira-kira sama. Sekitar 42 karakter per baris adalah pedoman yang umum.',
        },
      ],
    },
    {
      title: 'Cara mendapatkan file SRT atau VTT dari video Anda di sini',
      paragraphs: [
        'Anda tidak perlu menulis kedua format itu sendiri. Tambahkan file video atau audio Anda di halaman utama, pilih bahasa yang diucapkan, dan biarkan transkripnya selesai. Baca sampai habis dan perbaiki kata yang salah: baris yang diedit tetap mempertahankan waktu mulai dan selesainya, dan kata-kata di dalamnya disebar sepanjang waktu itu sebanding dengan panjangnya.',
        'Lalu buka menu unduhan dan pilih SRT atau VTT. Keduanya dibuat dari transkrip hasil suntingan yang sama, jadi Anda bisa mengekspor satu untuk YouTube dan yang lain untuk halaman web Anda sendiri tanpa mengulang pekerjaan apa pun. Jika Anda ingin subtitle terpecah dengan rapi pada kata yang tepat, biarkan Waktu per kata tetap aktif di bawah Opsi lainnya.',
      ],
    },
  ],
  faqs: [
    {
      question:
        'Bisakah saya mengganti nama file SRT menjadi VTT dan memakainya di situs web saya?',
      answer:
        'Tidak. Browser menolak file .vtt yang tidak diawali dengan WEBVTT, dan waktu SRT memakai koma sedangkan VTT membutuhkan titik. Tambahkan header, ubah komanya, atau unduh file VTT langsung dari halaman transkrip.',
    },
    {
      question: 'Apakah file SRT dan VTT berbeda dalam ukuran atau kualitas?',
      answer:
        'Tidak. Keduanya adalah file teks kecil dan tidak ada yang memengaruhi kualitas video. Perbedaannya hanya pada hal tambahan yang bisa dijelaskan VTT, seperti posisi di layar dan gaya, dan pada tempat masing-masing format diterima.',
    },
    {
      question: 'Bisakah subtitle SRT dibuat tebal, miring, atau berwarna?',
      answer:
        'Sebagian pemutar memahami tag dasar seperti b dan i dalam SRT, tetapi dukungannya tidak merata, jadi hasilnya bisa berbeda dari pemutar ke pemutar. WebVTT mendefinisikan tag dan gaya CSS-nya dalam spesifikasi, yang membuat hasilnya lebih bisa diprediksi di web.',
    },
    {
      question: 'Pengodean teks apa yang sebaiknya dipakai file subtitle?',
      answer:
        'UTF-8. Pengodean ini menangani semua bahasa, dan itulah yang diharapkan browser untuk WebVTT. Jika karakter subtitle tampak rusak, hampir pasti file disimpan dalam pengodean yang lebih lama.',
    },
  ],
  links: [
    {
      label: 'Pembuat subtitle SRT',
      path: '/srt-subtitle-generator',
      note: 'Masukkan video dan unduh file SRT yang dibuat dari ucapan di dalamnya.',
    },
    {
      label: 'Pembuat subtitle VTT',
      path: '/vtt-subtitle-generator',
      note: 'Hal yang sama, untuk file WebVTT yang bekerja dengan elemen video pada halaman web.',
    },
    {
      label: 'Cara menambahkan subtitle ke video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Langkah demi langkah, dari transkrip hingga video yang menampilkan subtitle di YouTube, VLC, atau aplikasi penyunting.',
    },
    {
      label: 'Pembuat subtitle YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Buat file SRT untuk video milik Anda dan unggah di YouTube Studio.',
    },
    {
      label: 'Cara mendapatkan transkrip yang lebih akurat',
      path: '/guides/accurate-transcripts',
      note: 'Teks yang lebih baik berarti lebih sedikit koreksi sebelum Anda mengekspor subtitle.',
    },
  ],
};
