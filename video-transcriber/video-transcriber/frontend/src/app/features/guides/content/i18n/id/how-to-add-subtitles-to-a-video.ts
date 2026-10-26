import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Cara menambahkan subtitle ke video, secara gratis',
  lead: 'Membuat subtitle butuh empat langkah: ubah ucapan menjadi teks, perbaiki kesalahannya, ekspor file SRT atau VTT, lalu pasang file itu ke video. Panduan ini menelusuri setiap langkah dan menunjukkan cara memasang file di YouTube, VLC, aplikasi penyunting video, halaman web, atau secara permanen ke dalam gambar dengan ffmpeg.',
  readingMinutes: 7,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Buat subtitle dari video Anda',
  blocks: [
    {
      title: 'Putuskan dulu: subtitle lunak atau subtitle yang ditanam',
      paragraphs: [
        'Ada dua cara memasang subtitle pada video, dan pilihannya menentukan langkah mana yang Anda butuhkan.',
      ],
      bullets: [
        {
          title: 'Subtitle lunak (jalur terpisah).',
          text: 'Subtitle berupa file atau jalur di samping video. Penonton bisa menyalakan dan mematikannya, memilih bahasa, dan Anda bisa memperbaiki salah ketik kemudian tanpa menyentuh videonya. Beginilah cara kerja YouTube, VLC, sebagian besar pemutar, dan halaman web. Dibutuhkan pemutar yang mendukung jalur subtitle.',
        },
        {
          title: 'Subtitle yang ditanam (bagian dari gambar).',
          text: 'Teks digambar pada setiap bingkai, sehingga tampil di mana-mana, termasuk di platform yang tidak menerima file subtitle. Harganya adalah tidak ada yang bisa mematikannya, Anda tidak bisa memperbaikinya tanpa mengekspor video lagi, dan videonya harus dienkode ulang.',
        },
      ],
      after: [
        'Jika ragu, mulailah dengan subtitle lunak. Tanam hanya jika tempat Anda memposting tidak menyediakan unggahan subtitle.',
      ],
    },
    {
      title: 'Empat langkah sekilas',
      steps: [
        {
          title: 'Transkripsikan videonya',
          text: 'Tambahkan video di halaman utama, pilih bahasa yang diucapkan dan biarkan ucapan berubah menjadi teks berwaktu.',
        },
        {
          title: 'Perbaiki teksnya',
          text: 'Baca transkrip dan perbaiki nama, angka, dan kata yang tidak jelas. Jika baris subtitle keluar terlalu panjang, pilih Panjang baris subtitle yang lebih pendek di menu Ekspor.',
        },
        {
          title: 'Ekspor SRT atau VTT',
          text: 'Unduh file subtitle. SRT bekerja hampir di mana-mana. VTT untuk elemen video pada halaman web.',
        },
        {
          title: 'Pasang file tersebut',
          text: 'Unggah ke YouTube, muat di pemutar atau aplikasi penyunting Anda, atau tambahkan ke halaman Anda. Atau tanam ke dalam video.',
        },
      ],
    },
    {
      title: 'Langkah 1 dan 2: transkripsikan video dan perbaiki teksnya',
      paragraphs: [
        'Pilih video di halaman utama dan pilih bahasa yang dipakai orang di dalamnya, alih-alih membiarkannya pada deteksi otomatis. Menyebutkan bahasanya lebih andal, terutama untuk klip pendek dan aksen. Kualitas Standar cocok untuk sebagian besar video. Pilih Akurasi tinggi untuk suara yang berisik atau aksen yang kental.',
        'Biarkan Waktu per kata tetap aktif di bawah Opsi lainnya. Opsi ini aktif secara bawaan, dan membuat setiap subtitle dimulai dan berakhir bersama kata-katanya, bukan di tepi blok yang panjang. Saat transkrip siap, putar video di sampingnya dan baca sambil mengikuti. Kata yang kurang diyakini oleh mesin pengenalan digarisbawahi selama sakelar Garisbawahi kata yang diragukan aktif (aktif secara bawaan), jadi periksa kata-kata itu lebih dulu.',
        'Subtitle dibaca dengan cepat, jadi bentuklah teks demi penonton. Ini adalah pedoman yang banyak dipakai, bukan aturan yang kaku:',
      ],
      bullets: [
        {
          title: 'Panjang baris.',
          text: 'Sekitar 42 karakter per baris, dan tidak lebih dari dua baris sekaligus. Menu Ekspor memiliki pilihan Panjang baris subtitle: Pendek (32 huruf), Standar (42), atau Panjang (56).',
        },
        {
          title: 'Waktu tampil di layar.',
          text: 'Setiap subtitle sebaiknya bertahan setidaknya sekitar satu detik, dan jarang lebih lama dari sekitar tujuh detik.',
        },
        {
          title: 'Kecepatan membaca.',
          text: 'Sekitar 15 sampai 20 karakter per detik nyaman bagi kebanyakan orang dewasa. Jika orang tidak sempat selesai membaca sebelum barisnya berganti, persingkat kata-katanya atau biarkan tampil lebih lama.',
        },
        {
          title: 'Jeda yang wajar.',
          text: 'Subtitle yang baik terpotong di akhir frasa, bukan di tengah nama atau di antara sebuah kata sandang dan kata bendanya. Ekspor membungkus baris yang panjang untuk Anda, jadi jagalah agar setiap baris hasil suntingan berupa frasa yang utuh.',
        },
      ],
    },
    {
      title: 'Langkah 3: pilih SRT atau VTT',
      paragraphs: [
        'Unduh SRT kecuali subtitle ditujukan untuk video di halaman web Anda sendiri. YouTube, VLC, dan hampir semua aplikasi penyunting menerima SRT. Halaman web membutuhkan VTT, karena browser hanya membaca jalur subtitle dalam format itu.',
        'Anda bisa mengunduh keduanya dari transkrip yang sama, jadi tidak perlu memutuskan lebih dulu. Panduan tentang SRT dan VTT menjelaskan perbedaan persisnya, termasuk apa isi masing-masing file.',
      ],
    },
    {
      title: 'Langkah 4: tambahkan file ke YouTube, VLC, atau aplikasi penyunting',
      paragraphs: [
        'Nama menu berubah dari waktu ke waktu, jadi cari yang paling mendekati jika sebuah label berbeda dari yang tertulis di bawah.',
      ],
      bullets: [
        {
          title: 'YouTube.',
          text: 'Buka YouTube Studio, pilih video, buka Subtitel, tambahkan bahasa, lalu pilih untuk mengunggah file. Pilih opsi untuk file dengan pengaturan waktu, pilih SRT Anda, dan publikasikan. YouTube memungkinkan Anda mengedit barisnya sesudahnya di layar yang sama.',
        },
        {
          title: 'VLC.',
          text: 'Putar videonya, lalu pilih Subtitle, Add Subtitle File dari menu dan pilih SRT Anda. Anda juga bisa menyeret file ke jendela pemutar. Atau simpan SRT di samping video dengan nama yang sama (lecture.mp4 dan lecture.srt) dan VLC biasanya memuatnya sendiri.',
        },
        {
          title: 'Aplikasi penyunting video.',
          text: 'Sebagian besar aplikasi penyunting bisa mengimpor file SRT sebagai jalur keterangan atau subtitle, dari menu seperti File, Import, atau dari panel keterangan. Setelah berada di lini masa, Anda bisa mengubah gaya teksnya. Jika satu format ditolak, coba yang lain.',
        },
        {
          title: 'Ponsel dan tablet.',
          text: 'Aplikasi pemutar video yang mendukung file subtitle, seperti VLC untuk seluler, bisa memuat file SRT dari file Anda. Pemutar galeri bawaan banyak ponsel tidak bisa.',
        },
      ],
    },
    {
      title: 'Menambahkan subtitle ke halaman web dengan elemen track',
      paragraphs: [
        'Di situs web Anda sendiri, elemen video HTML memuat subtitle lewat elemen track yang mengarah ke file WebVTT. Ekspor VTT, unggah di samping video, dan tambahkan satu baris.',
      ],
      code: {
        label: 'Video dengan jalur subtitle',
        text: `<video controls src="talk.mp4">
  <track kind="subtitles" src="talk.en.vtt"
         srclang="en" label="English" default>
</video>`,
      },
      after: [
        'Atribut default menampilkan jalur itu tanpa penonton harus memilihnya. Tambahkan satu baris track untuk setiap bahasa. Jika file VTT berada di domain yang berbeda dari halamannya, server itu harus mengizinkan permintaan lintas asal, atau browser tidak akan memuatnya.',
      ],
    },
    {
      title: 'Menambahkan jalur subtitle lunak ke MP4 dengan ffmpeg',
      paragraphs: [
        'ffmpeg adalah alat baris perintah gratis yang bisa mengemas subtitle di dalam file MP4, sehingga video dan subtitlenya berpindah sebagai satu file. Video dan suaranya disalin tanpa diubah, jadi ini cepat dan tidak mengurangi kualitas. Letakkan video dan file SRT di satu folder dan jalankan perintah ini di sana.',
      ],
      code: {
        label: 'Subtitle lunak di dalam MP4 (penonton bisa mematikannya)',
        text: `ffmpeg -i talk.mp4 -i talk.srt -map 0:v -map 0:a? -map 1:0 -c:v copy -c:a copy -c:s mov_text -metadata:s:s:0 language=eng talk-subtitled.mp4`,
      },
      after: [
        'Opsi -map memilih persis apa yang masuk ke file baru: semua video, suara apa pun (tanda tanya membuat perintah tetap berjalan jika tidak ada), dan file subtitle. Memilih aliran secara manual menghindari galat pada file ponsel dan kamera yang juga memuat jalur data tambahan, yang sering tidak bisa disalin oleh MP4. Pengaturan mov_text adalah jenis subtitle yang dipakai file MP4. Kode bahasanya tiga huruf: eng untuk bahasa Inggris, ind untuk bahasa Indonesia, hin untuk bahasa Hindi, dan seterusnya. Pemutar seperti VLC menampilkan jalur itu di menu subtitelnya.',
      ],
    },
    {
      title: 'Menanam subtitle ke dalam gambar dengan ffmpeg',
      paragraphs: [
        'Untuk platform yang hanya menerima video, gambarlah teks pada setiap bingkai. Ini mengenkode ulang video, jadi memakan waktu lebih lama dan filenya dibuat lagi. Suaranya disalin apa adanya. Jalankan di folder yang berisi kedua file, yang menghindari masalah dengan jalur file.',
      ],
      code: {
        label: 'Subtitle yang ditanam (permanen, tidak bisa dimatikan)',
        text: `ffmpeg -i talk.mp4 -vf "subtitles=talk.srt" -c:a copy talk-burned.mp4`,
      },
      after: [
        "Untuk mengubah tampilannya, tambahkan gaya setelah nama file, misalnya subtitles=talk.srt:force_style='FontSize=22' di dalam tanda kutip perintah. Simpan salinan video aslinya, karena versi yang ditanam tidak bisa diubah kembali menjadi subtitle lunak.",
      ],
    },
    {
      title: 'Aksesibilitas, dan mengapa Anda harus memeriksa teksnya',
      paragraphs: [
        'Subtitle membantu orang yang tuli atau kesulitan mendengar, orang yang menonton di kereta atau di kantor yang sepi dengan suara dimatikan, orang yang masih belajar bahasanya, dan siapa pun yang lebih mudah mengikuti kata-kata tertulis. Banyak penonton menyalakannya bahkan ketika mereka bisa mendengar suaranya.',
        'Pengenalan ucapan itu baik, tetapi tidak sempurna, dan subtitle dengan nama atau angka yang salah bisa menyesatkan. Selalu baca transkrip terhadap videonya sebelum Anda menerbitkannya, dan berikan perhatian ekstra pada nama, angka, istilah teknis, dan apa pun yang bersifat hukum atau medis. Subtitle yang juga menjelaskan bunyi penting, seperti tawa atau pintu yang menutup, lebih berguna bagi orang yang tidak bisa mendengarnya, dan Anda bisa menambahkannya secara manual saat mengedit.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Apa bedanya subtitle dan keterangan (caption)?',
      answer:
        'Subtitle menerjemahkan atau menuliskan ucapan untuk penonton yang bisa mendengar videonya. Keterangan (caption) juga menjelaskan bunyi, seperti musik atau tawa, untuk penonton yang tidak bisa mendengar. File-nya adalah jenis file yang sama, jadi Anda bisa menambahkan deskripsi bunyi ke file SRT sendiri jika Anda menginginkan keterangan.',
    },
    {
      question: 'Apakah saya memerlukan perangkat lunak khusus untuk menambahkan subtitle?',
      answer:
        'Tidak. Unggah file SRT di YouTube Studio, seret ke VLC, atau impor di aplikasi penyunting Anda. Hanya mengemas file ke dalam MP4, atau menanam teks ke dalam gambar, yang membutuhkan alat seperti ffmpeg atau aplikasi penyunting video yang bisa mengekspornya.',
    },
    {
      question: 'Bisakah saya menambahkan subtitle dalam lebih dari satu bahasa?',
      answer:
        'Bisa, dengan subtitle lunak. Buat satu file untuk setiap bahasa dan tambahkan masing-masing sebagai jalurnya sendiri. Situs ini bisa menulis transkrip dalam bahasa yang diucapkan dan bisa menerjemahkan ucapan ke bahasa Inggris, tetapi Anda perlu menerjemahkan teksnya ke bahasa lain sendiri atau dengan alat lain.',
    },
    {
      question: 'Mengapa subtitle saya tidak sinkron dengan video?',
      answer:
        'Entah seluruh file bergeser, yang bisa diperbaiki oleh sebagian besar pemutar dengan pengaturan penundaan subtitle, atau video disunting setelah subtitle dibuat. Subtitle mengikuti waktu audio tempat subtitle itu dibuat, jadi transkripsikan hasil akhir videonya.',
    },
  ],
  links: [
    {
      label: 'Pembuat subtitle SRT',
      path: '/srt-subtitle-generator',
      note: 'Mulai dari sini untuk mengubah video menjadi file SRT.',
    },
    {
      label: 'SRT vs VTT',
      path: '/guides/srt-vs-vtt',
      note: 'Apa isi masing-masing file, dan mana yang diunduh untuk keperluan Anda.',
    },
    {
      label: 'Pembuat subtitle VTT',
      path: '/vtt-subtitle-generator',
      note: 'Dapatkan file WebVTT yang dibutuhkan elemen video pada halaman web.',
    },
    {
      label: 'Pembuat subtitle YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Jalur khusus YouTube, dari file sampai unggahan ke Studio.',
    },
    {
      label: 'Terjemahkan ucapan ke bahasa Inggris',
      path: '/translate-audio-to-english',
      note: 'Dapatkan subtitle bahasa Inggris dari video yang diucapkan dalam bahasa lain.',
    },
  ],
};
