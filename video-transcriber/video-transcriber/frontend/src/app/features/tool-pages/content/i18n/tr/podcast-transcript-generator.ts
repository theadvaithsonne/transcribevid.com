import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Podcast transkript oluşturucu',
  h1: 'Ses dosyanızdan podcast transkripti oluşturun',
  lead: 'Bir bölümü bırakın ve yanında yayımlayabileceğiniz, aranabilen, alıntılanabilen ya da yayın notlarına dönüştürülebilen tam, zaman damgalı bir transkript alın. Ücretsiz, kayıt gerektirmez ve 50’den fazla dilde.',
  dropKind: 'audio',
  dropNoun: 'Podcast bölümünüzü',

  whyTitle: 'Bir bölüme neden transkript verilmeli',
  why: [
    'Transkript, bir bölümü bulmayı, alıntılamayı ve takip etmeyi kolaylaştırır. Dinleyiciler ona göz gezdirebilir, sessizde ya da gürültülü bir yerde birlikte okuyabilir ve bir konuğun adını onda arayabilir. Sağır ve işitme güçlüğü çeken dinleyiciler ve ikinci bir dilde dinleyenler de kullanabilir. Arama motorları da metni sesten çok daha kolay okur.',
    'Bu sayfa ilk taslağı yapar: bütün bölüm, her satırında zaman olan bir metin olarak. Onu düzenlemeyi planlayın. Konuşma tanıma, konuklarınızın adlarını ya da programınızın jargonunu bilmez ve konuşmacıları etiketlemez. Bunu kendinizin yaptığı ya da kullanma izninizin olduğu bölümlerde kullanın.',
  ],

  sections: [
    {
      title: 'Transkriptten bölüm sayfasına',
      paragraphs: ['Tek bir transkript, zaten yayımladığınız birkaç şeyi besleyebilir.'],
      bullets: [
        {
          title: 'Yayın notları.',
          text: 'Transkripti bir kez okuyun, konuları seçin ve her birinin zaman damgasıyla kısa bir özet yazın. Bir not uygulamasına ya da blog düzenleyicisine yapıştırmak için Markdown indirin.',
        },
        {
          title: 'Oynatıcının altında bir transkript.',
          text: 'TXT indirin, paragrafları düzenleyin ve Sunucu ile Konuk gibi isimleri elle ekleyin. Transkriptin kendi konuşmacı etiketleri yoktur.',
        },
        {
          title: 'Video sürümü için altyazı.',
          text: 'Bölümü video olarak da yayımlıyorsanız SRT veya VTT indirin ve altyazı olarak yükleyin.',
        },
        {
          title: 'Alıntılar ve klipler.',
          text: 'Satırı bulun, zaman damgasını okuyun ve klibi sesinizden o zamanda kesin.',
        },
      ],
    },
    {
      title: 'İsimleri, jargonu ve reklam okumalarını doğru yazdırmak',
      paragraphs: [
        'Konuk adları, marka adları ve program terimleri, bir tanıyıcının en çok yanlış yaptığı şeylerdir. Başlamadan önce bunları Daha fazla seçenek altındaki kelime ipucuna listeleyin: sunucu, konuklar, programın adı, ürünler ve sık kullandığınız her terim. Transkript hazır olduğunda yanlış yazılmış bir ismi üstündeki Metinde ara kutusuna yazın, Değiştir…’i açın, doğru yazımı girin ve eşleşen her satıra bir kerede uygulayın. Tanıyıcının emin olmadığı satırlar işaretlenir; bu yüzden önce onları gözden geçirin.',
        'Daha fazla seçenek bölümünde Sessizlikleri ve müziği atla anahtarını açık bırakın; böylece jenerikler ve uzun duraklamalar uydurma kelimelere dönüşmez. Bir reklam okumasının altındaki ses efektleri ve müzik yatakları yine de başıboş metin ekleyebilir; bu yüzden söylenmemiş her şeyi silin.',
      ],
    },
  ],

  howTitle: 'Podcast transkripti nasıl oluşturulur',
  howToDescription:
    'Bölümü ekleyin, isimleri ve terimleri listeleyin, transkriptin hazırlanmasını bekleyin ve bölüm sayfası için indirin.',
  steps: [
    {
      title: 'Bölümü ekleyin',
      text: 'Bölümü yukarıdaki kutuya bırakın ya da Dosya seç düğmesine basın. MP3 olağan podcast biçimidir, ancak WAV, M4A, FLAC ve diğerleri de çalışır. Bu kutuya bir seferde bir bölüm girer; sonraki sayfada Başka bir dosya ekle daha fazla bölüm eklemenizi sağlar.',
    },
    {
      title: 'İsimleri ve terimleri listeleyin',
      text: 'Sonraki sayfada Daha fazla seçenek’i açın ve sunucuyu, konukları, programın adını ve her türlü jargonu kelime ipucuna koyun. Konuşulan dili seçin ya da Otomatik algıla seçeneğini açık tutun.',
    },
    {
      title: 'Başlatın ve transkripti bekleyin',
      text: 'Yazıya dök düğmesine basın. Metin satır satır, bir ilerleme çubuğuyla görünür. Standart, çoğu bölüm için uygundur. Üst üste konuşma veya zayıf ses, Yüksek doğruluk ya da En yüksek doğruluk seçeneğinin zamanını hak ettiği yerdir. Bunlar daha yavaştır, ilk seferde daha büyük bir indirme gerektirir ve çalıştıramayan bir cihazda nedeniyle birlikte gri gösterilir.',
    },
    {
      title: 'Düzenleyin ve dışa aktarın',
      text: 'İsimleri ve noktalamayı düzeltin, konuşmacı adlarını elle ekleyin. Ardından bölüm sayfası için TXT veya Markdown, video sürümü için SRT veya VTT indirin.',
    },
  ],

  formatsTitle: 'Podcast dosyaları ve indirmeler',
  formatsIntro:
    'MP3 olağan podcast biçimidir. Diğer ses dosyaları aynı şekilde okunur ve video dosyaları da kabul edilir.',
  uploadTitle: 'Ekleyebileceğiniz ses dosyaları',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'oynatıcının altında yayımlanacak transkript' },
    { name: 'Markdown', use: 'zaman damgalı yayın notları' },
    { name: 'SRT', use: 'video sürümü için altyazı' },
    { name: 'VTT', use: 'web oynatıcıları için transkript izi' },
    { name: 'PDF', use: 'paylaşılacak veya yazdırılacak bir transkript' },
  ],

  tipsTitle: 'Podcast transkriptleri için ipuçları',
  tips: [
    {
      title: 'Son miksi yazıya dökün.',
      text: 'Jenerik ve reklam okumalarıyla birlikte mastering yapılmış bölüm, dinleyicilerin duyduğudur. Böylece zaman damgaları yayımladığınız dosyayla eşleşir.',
    },
    {
      title: 'Elinizdeyse özgün WAV’ınızı kullanın.',
      text: 'MP3 sıkıştırılmış bir kopyadır ve her ek sıkıştırma turu ayrıntı kaybettirir. Daha temiz ses, daha az hata verir.',
    },
    {
      title: 'Çok uzun bölümleri parçalara ayırın.',
      text: 'Bu sayfada gösterilen sınırlardan büyük veya uzun bir dosya işlenemez; bu yüzden uzun bir bölümü önce herhangi bir ses düzenleyicide bölün.',
      browser: {
        title: 'Uzun bölümler daha uzun sürer.',
        text: 'Site bölüm uzunluğuna bir üst sınır koymaz, ancak uzun bir sohbet programı cihazınızda zaman ve boş bellek gerektirir. Onu doğal bir molada herhangi bir ses düzenleyicide bölmek ilk parçayı daha çabuk almanızı sağlar.',
      },
    },
    {
      title: 'Bir kez birlikte okuyun.',
      text: 'Transkripti, bölüm normal hızda çalarken okumak, önemli hataları yakalamanın en hızlı yoludur.',
    },
    {
      title: 'Otomatik olduğunu söyleyin.',
      text: 'Tam bir düzenleme yapmadan transkript yayımlıyorsanız bunu belirtin; böylece okurlar küçük hataların olabileceğini bilir.',
    },
  ],

  faqs: [
    {
      question: 'Otomatik bir podcast transkriptini bölüm sayfamda yayımlayabilir miyim?',
      answer:
        'Evet, kendi yaptığınız bir bölüm için. Önce baştan sona okuyun, isimleri düzeltin, konuşmacı adlarını elle ekleyin ve okurlara otomatik olarak yapıldığını söyleyin. Bir konuk bir şeyin dışarıda bırakılmasını istediyse onu metinden de kaldırın.',
    },
    {
      question: 'Podcast transkriptinde konuşmacı adları var mı?',
      answer:
        'Hayır. Düzenlerken metne "Sunucu" ve "Konuk" yazın; transkriptin kendisi yalnızca zaman taşır.',
    },
    {
      question: 'Bir podcast transkriptinden yayın notları alabilir miyim?',
      answer:
        'Ham maddeyi alırsınız, özeti değil. Transkript sizin için yayın notları yazmaz, ancak zaman damgaları konuları ve her birinin başladığı dakikayı listelemeyi hızlandırır.',
    },
    {
      question: 'Tek seferde ne kadar uzun bir podcast bölümünü yazıya dökebilirim?',
      answer: '{limits} Uzun bir bölümün bölünmesi gerekebilir. Günlük veya aylık kota yoktur.',
      browser: {
        answer:
          'Bölüm uzunluğu site tarafından sınırlanmaz. Uzun bir bölüm daha uzun sürer ve kendi cihazınızda boş bellek gerektirir; sayfa daha yavaş bir cihazda sizi uyarır.',
      },
    },
    {
      question: 'Bir podcast’i RSS akışından veya bir bağlantıdan yazıya dökebilir miyim?',
      answer:
        'Hayır. TranscribeVid web bağlantılarıyla veya akışlarıyla değil, sizin eklediğiniz dosyalarla çalışır. Kendi yaptığınız ya da dışa aktardığınız bölüm dosyasını kullanın ve bu sayfanın üstündeki kutuya ekleyin.',
    },
  ],

  links: [
    {
      label: 'MP3 yazıya çevirme',
      path: '/mp3-to-text',
      note: 'En yaygın podcast dosya türü için ayarlar ve ipuçları.',
    },
    {
      label: 'SRT altyazı oluşturucu',
      path: '/srt-subtitle-generator',
      note: 'Bölümün video sürümü için altyazı.',
    },
    {
      label: 'SRT ve VTT farkı',
      path: '/guides/srt-vs-vtt',
      note: 'Oynatıcınızın veya barındırıcınızın hangi altyazı dosyasını beklediği.',
    },
    {
      label: 'Daha doğru bir transkript nasıl elde edilir',
      path: '/guides/accurate-transcripts',
      note: 'Aynı bölümden daha az hata.',
    },
  ],
};
