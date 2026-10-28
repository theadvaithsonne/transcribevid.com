import { GuideContent } from '../../../guide.model';

/** Langkah untuk alat lain sebagaimana dijelaskan halaman masing-masing; tidak ada yang diukur di sini. Panduan perbandingan memuat batas-batas yang disertai sumber. */
export const CONTENT: GuideContent = {
  h1: 'Cara transkrip video ke teks: lima cara, dan mana yang cocok untuk video Anda',
  lead: 'Anda bisa mendapatkan kata-kata dalam video sebagai teks dengan lima cara: transkrip yang sudah dimiliki YouTube, ketik suara, subtitle otomatis di aplikasi penyunting video, layanan online, atau alat yang berjalan di perangkat Anda sendiri. Kelimanya berbeda dalam biaya, dalam apakah Anda mendapat penanda waktu di setiap baris, dan dalam apa yang diminta lebih dulu dari Anda. Panduan ini menjelaskan apa yang dilakukan masing-masing dan kapan memilihnya.',
  readingMinutes: 7,
  toolPath: '/transcribe-video-to-text',
  toolCta: 'Ubah video ke teks, gratis dan tanpa akun',
  blocks: [
    {
      title: 'Jawaban singkatnya',
      bullets: [
        {
          title: 'Video ada di YouTube dan memiliki subtitle:',
          text: 'buka transkripnya di halaman video. Gratis dan hanya butuh semenit, tetapi hanya ada jika video memiliki subtitle, dan teksnya perlu dibaca dengan teliti.',
        },
        {
          title: 'Anda punya file video dan ingin teks dengan penanda waktu:',
          text: 'pakai alat yang menerima file dan memberi Anda file TXT dan subtitle. Dua cara terakhir di bawah ini melakukannya.',
        },
        {
          title: 'Anda hanya butuh beberapa kutipan:',
          text: 'putar video lalu ketik, atau pakai ketik suara. Untuk apa pun yang lebih panjang dari beberapa menit, cara ini lebih lambat daripada membiarkan perangkat lunak mengerjakan seluruh file.',
        },
        {
          title: 'Anda ingin subtitle untuk video yang sama:',
          text: 'pilih cara yang mengekspor SRT atau VTT, sehingga satu kali proses memberi Anda transkrip sekaligus subtitle.',
        },
      ],
    },
    {
      title: 'Apa yang dibutuhkan transkrip yang baik dari video Anda',
      paragraphs: [
        'Semua cara di bawah ini bekerja dari jalur suara, jadi kualitas suara menentukan kualitas teks jauh lebih besar daripada gambar. Ucapan yang dekat dengan mikrofon, satu suara pada satu waktu, tanpa musik di bawahnya, hasilnya baik. Ruangan yang bergema, orang yang berbicara bersamaan, atau latar belakang yang bising menghasilkan kesalahan pada setiap metode.',
        'Sebelum mulai, cari tahu tiga hal: bahasa yang diucapkan dalam video, apakah Anda butuh waktu di setiap baris, dan berapa lama videonya. Yang kedua memberi tahu format apa yang harus bisa Anda unduh; yang ketiga memberi tahu batas gratis mana yang akan menghentikan Anda.',
      ],
    },
    {
      title: 'Cara 1: pakai transkrip yang sudah dimiliki YouTube',
      paragraphs: [
        'Banyak video YouTube memiliki subtitle, yang ditulis oleh pemiliknya atau dibuat secara otomatis. Di halaman video, buka deskripsi: jika subtitle ada, opsi untuk menampilkan transkrip muncul di sana, dan isinya berupa daftar teks dengan waktu yang bisa Anda salin. Jika videonya milik Anda, YouTube Studio memiliki bagian Subtitle tempat Anda bisa meninjau dan mengunduh subtitle. YouTube mengubah tampilan ini dari waktu ke waktu, jadi labelnya mungkin sedikit berbeda.',
      ],
      after: [
        'Ini cara tercepat untuk video yang sudah ada di YouTube. Batasnya: cara ini hanya berfungsi dengan tautan ke video yang memiliki subtitle, teks otomatisnya bisa kasar pada nama dan istilah teknis, dan cara ini tidak membantu untuk file di komputer atau ponsel Anda.',
      ],
    },
    {
      title: 'Cara 2: putar video dan biarkan ketik suara mendengarkan',
      paragraphs: [
        'Ketik suara di aplikasi pengolah kata, seperti opsi Ketik dengan suara di menu Alat pada Google Docs, menuliskan apa yang didengar mikrofonnya. Anda memutar video lewat speaker dan teksnya diketik.',
        'Cara ini gratis, tetapi mendengar seluruh ruangan, bukan hanya videonya. Hasilnya tanpa penanda waktu, berjalan secara real time sehingga video berdurasi satu jam memakan waktu satu jam, dan apa pun yang tidak tertangkap mikrofon akan hilang. Cara ini cukup untuk satu atau dua kutipan, tetapi pilihan yang buruk untuk kuliah atau wawancara.',
      ],
    },
    {
      title: 'Cara 3: aktifkan subtitle otomatis di aplikasi penyunting video',
      paragraphs: [
        'Beberapa aplikasi penyunting video bisa mentranskripsikan ucapan dari klip yang Anda tempatkan di dalamnya. Panduan resmi Microsoft Clipchamp, misalnya, menyebutkan untuk membuka tab Subtitle, mengaktifkan subtitle otomatis, lalu mengunduh subtitle sebagai file SRT; videonya harus memiliki ucapan dalam audionya agar ini berfungsi.',
        'Ini berguna saat Anda memang sedang menyunting videonya, karena subtitle langsung masuk ke lini masa. Untuk transkrip biasa, caranya lebih repot dari seharusnya: Anda harus memuat video ke aplikasi penyunting, dan teksnya keluar sebagai file subtitle yang kemudian harus Anda ubah menjadi dokumen.',
      ],
    },
    {
      title: 'Cara 4: pakai layanan transkripsi online',
      paragraphs: [
        'Puluhan situs akan mentranskripsikan file yang Anda berikan. Sebagian besar hanya gratis sampai batas tertentu: beberapa menit, beberapa file, atau pratinjau yang meminta Anda membayar sebelum bisa mengunduh. Perbedaan yang penting adalah apakah Anda perlu akun, berapa menit yang Anda dapat, seberapa besar file yang bisa diterima, dan apakah hasilnya bisa diekspor.',
        'Layanan adalah pilihan yang tepat saat Anda butuh sesuatu yang tidak dilakukan alat sederhana: nama untuk setiap pembicara, bot yang bergabung ke rapat, atau tautan ke video yang tidak Anda miliki sebagai file. Panduan kami tentang batas gratis tiga belas layanan, masing-masing dikutip dari halamannya sendiri, ditautkan di bawah.',
      ],
    },
    {
      title: 'Cara 5: transkripsikan file dengan TranscribeVid',
      paragraphs: [
        'TranscribeVid menerima file video-nya langsung, tanpa akun dan tanpa hitungan harian. Alat ini menjalankan Whisper, model ucapan sumber terbuka, dan mengembalikan teks dengan penanda waktu di setiap baris.',
        'Alat ini tidak menerima tautan, tidak memberi label siapa yang berbicara, dan tidak bergabung ke rapat. Untuk pekerjaan itu, pakai layanan dari Cara 4.',
      ],
      browser: {
        paragraphs: [
          'TranscribeVid menerima file video-nya langsung, tanpa akun, tanpa hitungan harian, dan tanpa batas ukuran. Alat ini menjalankan Whisper, model ucapan sumber terbuka, di browser Anda, sehingga video tetap berada di perangkat Anda, dan teksnya kembali dengan penanda waktu di setiap baris.',
          'Alat ini tidak menerima tautan, tidak memberi label siapa yang berbicara, dan tidak bergabung ke rapat. Untuk pekerjaan itu, pakai layanan dari Cara 4. Karena perangkat Anda sendiri yang mengerjakannya, video panjang lebih lambat di ponsel lama daripada di laptop keluaran baru.',
        ],
      },
      steps: [
        { title: 'Tambahkan video', text: 'Letakkan file di kotak pada halaman alat, atau tekan Pilih file. MP4, MOV, MKV, WEBM, dan sebagian besar file video lainnya bisa dipakai, begitu pula file audio.' },
        { title: 'Pilih bahasa dan kualitas', text: 'Sebutkan bahasa yang diucapkan jika Anda tahu. Standar cocok untuk sebagian besar video; pilih Akurasi tinggi atau Akurasi terbaik untuk aksen, derau, atau Hindi.' },
        { title: 'Tunggu teksnya', text: 'Baris muncul satu per satu, dengan bilah kemajuan dan sisa waktu.' },
        { title: 'Edit dan unduh', text: 'Perbaiki baris mana pun di editor, lalu unduh TXT, SRT, VTT, PDF, Markdown, atau JSON. Unduh apa yang ingin Anda simpan sebelum Anda pergi.' },
      ],
    },
    {
      title: 'Cara mana untuk video mana',
      table: {
        caption: 'Kelima cara berdampingan, seperti dijelaskan dalam panduan ini',
        head: ['Cara', 'Biaya', 'Waktu di setiap baris', 'Bekerja pada', 'Terbaik untuk'],
        rows: [
          ['Transkrip YouTube', 'Gratis', 'Ya', 'Video YouTube yang memiliki subtitle', 'Salinan cepat dari video yang sudah online'],
          ['Ketik suara', 'Gratis', 'Tidak', 'Apa pun yang bisa Anda putar dengan suara keras', 'Beberapa kutipan'],
          ['Subtitle editor', 'Tergantung aplikasi penyunting', 'Ya, sebagai subtitle', 'Klip yang dimuat ke aplikasi penyunting', 'Video yang memang sedang Anda sunting'],
          ['Layanan online', 'Gratis sampai batas tertentu, lalu berbayar', 'Biasanya', 'File, dan kadang tautan', 'Nama pembicara, rapat, tautan'],
          ['TranscribeVid', 'Gratis', 'Ya', 'File video atau audio', 'File, dengan TXT dan file subtitle sebagai hasilnya'],
        ],
      },
    },
    {
      title: 'Perbaiki teksnya sebelum Anda memakainya',
      paragraphs: [
        'Cara apa pun yang Anda pilih, baca hasilnya sekali sambil memutar videonya. Pengenalan ucapan benar pada kata-kata umum dan tersandung pada hal-hal yang paling penting bagi Anda: nama, istilah produk, angka, dan apa pun yang diucapkan dengan cepat.',
      ],
      bullets: [
        { title: 'Nama dan istilah.', text: 'Cari di teks setiap nama yang Anda tahu ada di video dan perbaiki di setiap tempat kemunculannya.' },
        { title: 'Angka dan tanggal.', text: 'Periksa masing-masing dengan videonya; satu digit yang salah mudah terlewat.' },
        { title: 'Saat pembicara berganti.', text: 'Tambahkan pemisah baris dan sebuah nama, karena transkrip biasa tidak menandai siapa yang berbicara.' },
        { title: 'Subtitle.', text: 'Jika Anda akan memakai file SRT atau VTT, buat setiap baris cukup pendek untuk dibaca selama tampil di layar.' },
      ],
      after: [
        'Untuk daftar kebiasaan yang lebih panjang yang mengurangi kesalahan sebelum Anda mulai, lihat panduan tentang cara mendapatkan transkrip yang lebih akurat.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Bisakah saya mengubah video ke teks tanpa memasang apa pun?',
      answer: 'Bisa. Transkrip YouTube, layanan online, dan TranscribeVid semuanya bekerja di browser web. Hanya aplikasi penyunting video atau program desktop yang perlu dipasang.',
    },
    {
      question: 'Apa cara tercepat untuk mentranskripsikan video berdurasi satu jam?',
      answer: 'Jika videonya ada di YouTube dengan subtitle, transkrip di sana tersedia seketika. Untuk file, perangkat lunak jauh lebih cepat daripada mengetik atau ketik suara, yang keduanya memakan waktu setidaknya selama durasi video. Berapa lama perangkat lunak bekerja bergantung pada alatnya, tingkat kualitas, dan, jika berjalan di perangkat Anda, seberapa cepat perangkat itu.',
    },
    {
      question: 'Apakah saya harus mengambil audio dari video lebih dulu?',
      answer: 'Tidak. Alat yang menerima file video membaca jalur suaranya sendiri, jadi Anda bisa menambahkan MP4 atau MOV apa adanya. Mengambil audio lebih dulu hanya membantu jika sebuah alat menolak format videonya.',
    },
    {
      question: 'Bagaimana cara mendapatkan teks dengan penanda waktu di setiap baris?',
      answer: 'Pakai cara yang mengekspor subtitle atau transkrip berwaktu: transkrip YouTube mencantumkan waktu, dan alat yang mengunduh SRT atau VTT memberi setiap baris waktu mulai dan waktu selesai. Ketik suara tidak memberikannya.',
    },
  ],
  links: [
    {
      label: 'Perbandingan alat video ke teks gratis',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Batas gratis tiga belas alat online, masing-masing dikutip dari halamannya sendiri.',
    },
    {
      label: 'Cara mendapatkan transkrip yang lebih akurat',
      path: '/guides/accurate-transcripts',
      note: 'Kebiasaan dan pengaturan yang mengurangi kesalahan pada video apa pun.',
    },
    {
      label: 'Buat subtitle untuk video Anda',
      path: '/srt-subtitle-generator',
      note: 'Ubah video yang sama menjadi file SRT untuk pemutar dan aplikasi penyunting.',
    },
    {
      label: 'Transkripsikan video tanpa mengunggahnya',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Bagaimana pekerjaan tetap berada di perangkat Anda dan cara memeriksanya sendiri.',
    },
  ],
};
