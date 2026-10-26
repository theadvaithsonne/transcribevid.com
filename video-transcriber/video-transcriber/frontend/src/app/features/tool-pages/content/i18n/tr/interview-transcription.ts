import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Röportaj yazıya dökme',
  h1: 'Hesapsız röportaj yazıya dökme',
  lead: 'Kaydedilmiş bir röportajı, aranabilen, alıntılanabilen ve kayıtla karşılaştırılabilen zaman damgalı metne dönüştürün. Araştırma, gazetecilik ve işe alım görüşmeleri için yapıldı: ücretsiz, girişsiz, 50’den fazla dilde.',
  dropKind: 'video',
  dropNoun: 'Röportaj kaydınızı',

  whyTitle: 'Röportaj neden yazıya dökülmeli',
  why: [
    'Bir röportaj, içinde arama yapabildiğinizde daha değerli olur. Transkript, bir katılımcının bir konuyu nerede andığını bulmanızı, onu tam olarak alıntılamanızı, bir alıntıyı kayıtla karşılaştırmanızı ve birkaç röportajdaki yanıtları kıyaslamanızı sağlar. Araştırmacılar, gazeteciler, sözlü tarihçiler ve kullanıcı araştırması ya da işe alım görüşmesi yapanlar hep bu şekilde çalışır.',
    'Röportajlar çoğu zaman özel veya hassas ayrıntılar içerir. Burada kayıt şifreli bir bağlantıyla yüklenir ve sonra otomatik olarak silinir. Kayıttan önce herkesin rızasını alın, kuruluşunuzun ya da etik kurulunuzun kurallarına uyun ve transkripti kayıt kadar özenle ele alın.',
  ],
  browserWhy: [
    'Bir röportaj, içinde arama yapabildiğinizde daha değerli olur. Transkript, bir katılımcının bir konuyu nerede andığını bulmanızı, onu tam olarak alıntılamanızı, bir alıntıyı kayıtla karşılaştırmanızı ve birkaç röportajdaki yanıtları kıyaslamanızı sağlar. Araştırmacılar, gazeteciler, sözlü tarihçiler ve kullanıcı araştırması ya da işe alım görüşmesi yapanlar hep bu şekilde çalışır.',
    'Röportajlar çoğu zaman özel veya hassas ayrıntılar içerir; bu yüzden dosyanın nereye gittiği önemlidir. Tarayıcınız kaydı kendi cihazınızda yazıya döker ve hiçbir şey yüklenmez. Kayıttan önce herkesin rızasını alın, kuruluşunuzun ya da etik kurulunuzun kurallarına uyun ve transkripti kayıt kadar özenle ele alın: indirilen metin, cihazınızdaki diğer her dosya gibi bir dosyadır.',
  ],

  sections: [
    {
      title: 'Transkriptin size ne verdiği ve vermediği',
      paragraphs: ['Bir transkript üzerine bir şey inşa etmeden önce sınırlarını bilin.'],
      bullets: [
        {
          title: 'Konuşmacı etiketi yok.',
          text: 'Her satırda bir zaman damgası vardır, ancak transkript kimin konuştuğunu söylemez. Düzenlerken kayıtla karşılaştırarak Görüşmeci ve Katılımcı’yı elle ekleyin.',
        },
        {
          title: 'Temiz bir okuma; kesin biçimde kelimesi kelimesine değil.',
          text: 'Tanıyıcılar çoğu zaman kekelemeleri ve "ııı" gibi bazı dolgu sözcüklerini atlar. Çalışmanız kesin bir kelimesi kelimesine kayıt gerektiriyorsa kaydı metnin yanında oynatın ve eksik olanı ekleyin.',
        },
        {
          title: 'Yalnızca röportajdan sonra.',
          text: 'Kaydedilmiş bir kayıt üzerinde çalışır. Bir görüşmeye katılmaz ya da canlı yazıya dökmez.',
        },
      ],
    },
    {
      title: 'Bir transkripti alıntılamadan önce kontrol etmek',
      paragraphs: [
        'Bir alıntıyı yayımlamadan ya da bir katılımcıyı anmadan önce satırı zaman damgasından oynatın ve dinleyin. Tanıyıcının emin olmadığı satırlar işaretlenir; bu yüzden oradan başlayın. İsimleri, sayıları ve tarihleri, ayrıca yanlış olsaydı anlamı değiştirecek her kelimeyi kontrol edin; örneğin yapabilir ile yapamaz gibi. Bir isim ya da terimin göründüğü her yeri bulmak için onu bitmiş transkriptin üstündeki Metinde ara kutusuna yazın: eşleşen satırları sayar ve oklar aralarında gezinir.',
        'Kaydı birincil kayıt olarak saklayın ve transkripti bir çalışma kopyası olarak görün. Yönteminizi bir raporda ya da makalede anlatırsanız transkriptin konuşma tanımayla yapıldığını ve sonra elle kontrol edildiğini söyleyin.',
      ],
    },
    {
      title: 'Rıza, saklama ve anonimlik',
      paragraphs: [
        'Katılımcılara kaydın ve transkriptin nasıl saklanacağını ve kimlerin göreceğini söyleyin. Anonimlik sözü verdiyseniz alıntıları paylaşmadan önce birini tanıtabilecek isimleri ve ayrıntıları kaldırın. Bu sayfa bunu sizin için yapamaz ve hukuki tavsiye vermez.',
      ],
    },
  ],

  howTitle: 'Röportaj nasıl yazıya dökülür',
  howToDescription:
    'Röportaj kaydını ekleyin, dili seçin, isimleri ekleyin, transkriptin hazırlanmasını bekleyin, ardından kontrol edip indirin.',
  steps: [
    {
      title: 'Röportaj kaydını ekleyin',
      text: 'Dosya seç düğmesine basın ya da röportajı yukarıdaki kutuya sürükleyin. Ses de video da işe yarar. Burada bir röportaj ekleyin, ardından setinizin geri kalanı için sonraki sayfada Başka bir dosya ekle’yi kullanın.',
    },
    {
      title: 'Dili ve kaliteyi seçin',
      text: 'Sonraki sayfada röportajın dilini seçin ya da Otomatik algıla seçeneğini açık tutun. Standart, sessiz bir birebir konuşma için uygundur. Yankı, bir telefon hattı ya da güçlü bir aksan, cihazınızın çalıştırabildiği yerde Yüksek doğruluk gerektirir; çalıştıramayan bir cihaz seçeneği nedeniyle birlikte gri gösterir. Daha yavaştır ve ilk seferde daha büyük bir indirmedir.',
    },
    {
      title: 'İsimleri ve terimleri ekleyin, sonra başlatın',
      text: 'Daha fazla seçenek bölümünde katılımcıların adlarını, kuruluşlarını ve her türlü uzmanlık terimini kelime ipucuna listeleyin; böylece istediğiniz gibi yazılırlar. Ardından Yazıya dök düğmesine basın.',
    },
    {
      title: 'Kontrol edin, etiketleyin ve dışa aktarın',
      text: 'Satırları zaman damgalarından oynatın, hataları düzeltin ve konuşmacı etiketlerini elle ekleyin. Ardından dosyalarınız için TXT veya PDF, zamanlı satırlara ihtiyacınız varsa Markdown veya JSON indirin.',
    },
  ],

  formatsTitle: 'Röportaj kaydı dosyaları ve indirmeler',
  formatsIntro:
    'Röportajlar telefonlardan, kaydedicilerden ve görüntülü görüşmelerden gelir. Bunların hepsi eklenebilir ve okunan tek şey ses kanalıdır.',
  uploadTitle: 'Ekleyebileceğiniz kayıt dosyaları',
  accepts: ['MP4', 'MOV', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV'],
  downloads: [
    { name: 'TXT', use: 'okumak, alıntılamak ve kodlamak için düz metin' },
    { name: 'PDF', use: 'yazdırılacak veya dosyalanacak bir kopya' },
    { name: 'Markdown', use: 'bir not uygulaması ya da kodlama yazılımı için zamanlı metin' },
    { name: 'JSON', use: 'analiz yazılımı için zamanlı satırlar' },
  ],

  tipsTitle: 'Röportaj kayıtları için ipuçları',
  tips: [
    {
      title: 'Mikrofonu yakına koyun.',
      text: 'Onu katılımcının yakınına yerleştirin; telefon ve görüntülü görüşmelerde kulaklık ya da yaka mikrofonu kullanın. Odanın öbür ucundaki bir mikrofon ya da yankılı bir mekân, genellikle hiçbir ayarın geri kazandıramayacağı kadar doğruluk kaybettirir.',
    },
    {
      title: 'Başta tarihi ve isimleri söyleyin.',
      text: 'Kaydın başında kimlerin katıldığını ve ne zaman olduğunu söyleyin. Bu, dosyayı etiketlemeyi ve transkripti sonradan dosyalamayı kolaylaştırır.',
    },
    {
      title: 'Özgün kaydı saklayın.',
      text: 'Metne sahip olduktan sonra sesi asla silmeyin. Bir alıntıyla ilgili kuşkuyu çözen kayıttır.',
    },
    {
      title: 'Sınırların altında kalın.',
      text: 'Bu sayfada gösterilen sınırları aşan her şey geri çevrilir; bu yüzden çok uzun bir röportajı önce doğal bir molada kesin.',
      browser: {
        title: 'Uzun röportajlar daha uzun sürer.',
        text: 'Uzunluk için bir üst sınır yoktur, ancak uzun bir kayıt cihazınızda zaman ve boş bellek gerektirir ve WebCodecs olmayan bir tarayıcı çok uzun bir dosyada zorlanabilir. İlk parçayla başlamayı tercih ederseniz doğal bir molada kesin.',
      },
    },
    {
      title: 'Paylaşılan bir bilgisayarda verilerinizi temizleyin.',
      text: 'İhtiyacınız olanı kaydettiğinizde Verilerimi şimdi sil düğmesine basın; böylece transkript oturumda kalmaz.',
    },
  ],

  faqs: [
    {
      question: 'Gizli bir röportajı burada yazıya dökebilir miyim?',
      answer:
        'Kaydınız şifreli bir bağlantıyla yüklenir ve oturum bitince ya da daha önce Verilerimi şimdi sil düğmesine basarsanız sunucu tarafından silinir. Buna güvenmeden önce kuruluşunuzun ya da etik kurulunuzun ne gerektirdiğini kontrol edin. Bu hukuki tavsiye değildir.',
      browser: {
        answer:
          'Yükleme yapılmaz: tarayıcınız kaydı yazıya dökerken kayıt cihazınızda kalır ve tarayıcı onu bir süre işlem yapılmayınca ya da Verilerimi şimdi sil düğmesine bastığınızda temizler. İndirilmiş bir transkript sıradan bir dosyadır; bu yüzden kuruluşunuzun ya da etik kurulunuzun kurallarını kontrol edin. Bu hukuki tavsiye değildir.',
      },
    },
    {
      question: 'Röportaj transkriptinde "ıııı" ve "eee" yer alıyor mu?',
      answer:
        'Çoğu zaman hayır. Transkript kesin bir kelimesi kelimesine kayıt değil, temiz bir okumadır ve bazı kekelemeler ile dolgu sözcükleri dışarıda bırakılır. Hepsine ihtiyacınız varsa kaydı metnin yanında oynatın ve onları ekleyin.',
    },
    {
      question: 'Transkript görüşmeciyi katılımcıdan ayırt edebilir mi?',
      answer:
        'Hayır. Transkript kimin konuştuğunu işaretlemez. Düzenlerken her sıranın kime ait olduğunu kayıtla kontrol ederek metne Görüşmeci ve Katılımcı yazın.',
    },
    {
      question: 'Ne kadar uzun bir röportajı yazıya dökebilirim?',
      answer: '{limits} Daha uzun bir röportajın bölünmesi gerekebilir.',
      browser: {
        answer:
          'Röportaj uzunluğu sınırlanmaz. İşi kendi cihazınız yapar; bu yüzden uzun bir röportaj daha uzun sürer ve boş bellek gerektirir, cihazınız çok yavaş görünüyorsa sayfa size söyler.',
      },
    },
    {
      question: 'Bu transkriptleri araştırmamda veya makalemde kullanabilir miyim?',
      answer:
        'Evet. Birini alıntılamadan önce onları kayıtla karşılaştırın, yönteminizde konuşma tanımanın kullanıldığını belirtin ve kurumunuzun ya da yayının kurallarına uyun.',
    },
  ],

  links: [
    {
      label: 'Toplantı kaydını yazıya çevirme',
      path: '/meeting-recording-to-text',
      note: 'Kayıtlı görüşmeler için; transkripti tutanağa dönüştürme notlarıyla.',
    },
    {
      label: 'Videoyu yazıya çevirme',
      path: '/video-to-text',
      note: 'Kaydedilmiş her video için genel sayfa.',
    },
    {
      label: 'Videoyu yüklemeden yazıya dökme',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Bir kayda tarayıcınızda ne olduğu ve bunu kendiniz nasıl göreceğiniz.',
    },
    {
      label: 'Daha doğru bir transkript nasıl elde edilir',
      path: '/guides/accurate-transcripts',
      note: 'Hataları azaltan ses ve ayar seçimleri.',
    },
  ],
};
