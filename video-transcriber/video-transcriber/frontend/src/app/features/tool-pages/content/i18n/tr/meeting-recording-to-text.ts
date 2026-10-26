import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Toplantı kaydını yazıya çevirme',
  h1: 'Toplantı kaydını yazıya çevirin: Zoom, Teams ve Google Meet',
  lead: 'Görüşmenizden sonra kaydı kaydedin, buraya bırakın ve aranabilen, alıntılanabilen ve toplantı tutanağına dönüştürülebilen zaman damgalı bir transkript alın. Ücretsiz, hesap gerektirmez ve 50’den fazla dili kapsar.',
  dropKind: 'video',
  dropNoun: 'Toplantı kaydınızı',

  whyTitle: 'Toplantı kaydı neden yazıya çevrilmeli',
  why: [
    'Çok az kişi bir saatlik bir toplantıyı yeniden izler, ama birçoğunun ondan tek bir şeye ihtiyacı vardır: kim neye ve ne zamana kadar söz verdi. Transkript, bir son tarihi ya da bir ismi aramanızı, söylendiği dakikayı bulmanızı ve tam olarak alıntılamanızı sağlar. Görüşmeyi yeniden oynatmaktan çok daha hızlı bir başlangıçtır; tutanak ve eylem listeleri için.',
    'Bu sayfa, zaten var olan bir kayıt üzerinde çalışır. Canlı bir görüşmeye katılamaz ve konuşmacı adı eklemez; bu yüzden not alan kişinin değil, yeniden izlemenin yerini tutar. Toplantılar çoğu zaman gizli ayrıntılar içerir; bu yüzden kaydın nereye gittiğini bilin: burada şifreli bir bağlantıyla yüklenir ve sonra otomatik olarak silinir.',
  ],
  browserWhy: [
    'Çok az kişi bir saatlik bir toplantıyı yeniden izler, ama birçoğunun ondan tek bir şeye ihtiyacı vardır: kim neye ve ne zamana kadar söz verdi. Transkript, bir son tarihi ya da bir ismi aramanızı, söylendiği dakikayı bulmanızı ve tam olarak alıntılamanızı sağlar. Görüşmeyi yeniden oynatmaktan çok daha hızlı bir başlangıçtır; tutanak ve eylem listeleri için.',
    'Bu sayfa, zaten var olan bir kayıt üzerinde çalışır. Canlı bir görüşmeye katılamaz ve konuşmacı adı eklemez; bu yüzden not alan kişinin değil, yeniden izlemenin yerini tutar. Toplantılar çoğu zaman gizli ayrıntılar içerir: tarayıcınız kaydı kendi cihazınızda yazıya döker, hiçbir şey yüklenmez ve oturumunuz bitince hiçbir şey saklanmaz.',
  ],

  sections: [
    {
      title: 'Toplantı kaydınızı nerede bulacaksınız',
      paragraphs: [
        'Her toplantı aracı kayıtları kendi yerinde saklar; menü adları, klasörler ve planınızın izin verdikleri sürümler arasında değişir; bu yüzden bunu bir rehber olarak görün. Yalnızca sesi dışa aktarabiliyorsanız bir M4A veya MP3 dosyası daha küçüktür ve aynı derecede iyi okunur. Zoom, Microsoft Teams ve Google Meet ilgili sahiplerine ait adlardır ve bu site onlarla bağlantılı değildir.',
      ],
      bullets: [
        {
          title: 'Zoom.',
          text: 'Yerel kayıt, toplantı bittiğinde bilgisayarınıza kaydedilir; genellikle bir MP4 video ve bir M4A ses dosyası olarak. Bulut kaydı, Zoom hesabınızın kayıtlar sayfasından indirilir.',
        },
        {
          title: 'Microsoft Teams.',
          text: 'Toplantıdan sonra kayıt, toplantı türüne bağlı olarak OneDrive veya SharePoint’te saklanır ve toplantı sohbetinde bir bağlantı görünür. Orada açın ve hesabınız indirmeye izin veriyorsa MP4’ü indirin.',
        },
        {
          title: 'Google Meet.',
          text: 'Kayıtlar Google Drive’a, genellikle bir Meet Recordings klasörüne kaydedilir ve düzenleyen kişi bir bağlantı alır. MP4’ü Drive’dan indirin.',
        },
      ],
    },
    {
      title: 'Transkriptten tutanağa',
      paragraphs: [
        'Ham bir transkript henüz tutanak değildir, ancak tutanağı hızlıca yazdırır. Transkript bittiğinde, üstündeki Metinde ara kutusuna son tarih, anlaşma ya da eylem gibi bir kelime ya da ilgili birinin adını yazın. Kutu kaç satırın eşleştiğini gösterir ve yukarı ve aşağı oklar bir eşleşmeden diğerine geçirir. Her sonucun çevresini okuyun, belirsizse o satırı zaman damgasından oynatın ve satırları, herkes kaydı kontrol edebilsin diye zamanlarıyla birlikte notlarınıza kopyalayın.',
        'Bir isim iki farklı biçimde yazıldıysa yanlış yazımı arayın, Değiştir…’i açın, doğrusunu yazın ve bunu tüm satırlara bir kerede uygulayın. Bir not uygulamasına yapıştırmak için Markdown’ı ya da dağıtmak için PDF’yi indirin. Satırlar bir zaman taşır ancak konuşmacı etiketi taşımaz; bu yüzden düzenlerken isimleri yazın ve kimin konuştuğunu kontrol etmek için kaydı kullanın.',
      ],
    },
    {
      title: 'İzin, kurallar ve özen',
      paragraphs: [
        'Bir toplantıyı kaydetmeden önce herkese söyleyin ve izinlerini alın; kuruluşunuzun kayıtlar ve transkriptler hakkındaki kurallarını izleyin. Gizli bir toplantının transkripti kayıt kadar hassastır; bu yüzden onu aynı özenle saklayın ve paylaşın. Bu sayfa hukuki tavsiye vermez.',
      ],
    },
  ],

  howTitle: 'Toplantı kaydı yazıya nasıl çevrilir',
  howToDescription:
    'Toplantı kaydını ekleyin, dili seçin, transkriptin hazırlanmasını bekleyin ve metin ya da altyazı olarak indirin.',
  steps: [
    {
      title: 'Kaydı ekleyin',
      text: 'Dosya seç düğmesine basın ya da kaydı yukarıdaki kutuya sürükleyin. Bir MP4 video da bir M4A ses dosyası da işe yarar ve yalnızca ses kullanılır. Kutu bir seferde bir kayıt alır ve onu sonraki sayfadaki yükleyiciye aktarır; orada Başka bir dosya ekle, bir günlük görüşmelerin geri kalanını getirir.',
    },
    {
      title: 'Dili ve kaliteyi seçin',
      text: 'Sonraki sayfada insanların konuştuğu dili seçin ya da Otomatik algıla seçeneğini açık tutun. Standart, çoğu görüşme için uygundur. Cihazınız sunuyorsa Yüksek doğruluk ve En yüksek doğruluk, hızlı konuşanlara veya zayıf sese uygundur; aksi hâlde nedeniyle birlikte gri gösterilirler. İkisi de daha yavaştır ve ilk seferde daha büyük bir indirme gerektirir. İnsanlar dil değiştiriyorsa ana dili seçin ve emin olunmayan olarak işaretlenen satırları kontrol edin. Ardından Yazıya dök düğmesine basın.',
    },
    {
      title: 'Transkripti bekleyin',
      text: 'Kayıt işlenirken satırlar görünür; yanında bir ilerleme çubuğu ve kalan sürenin tahmini yer alır. Uzun bir toplantı daha uzun sürer.',
      browser: {
        text: 'Kayıt işlenirken satırlar görünür; yanında bir ilerleme çubuğu ve kalan sürenin tahmini yer alır. İşi kendi cihazınız yapar; bu yüzden uzun bir toplantı daha uzun sürer: bitene kadar bu sayfayı açık tutun.',
      },
    },
    {
      title: 'Arayın, düzenleyin ve dışa aktarın',
      text: 'Satırlar arasında gezinmek için isimleri ve karar kelimelerini Metinde ara kutusuna yazın, bir satırı kontrol etmek için zaman damgasından oynatın ve hataları düzeltin. Ardından TXT, Markdown veya PDF indirin. Konuşmacı adlarını düzenlerken elle ekleyin.',
    },
  ],

  formatsTitle: 'Toplantı kaydı dosyaları ve indirmeler',
  formatsIntro:
    'Zoom, Teams ve Meet kayıtları genellikle MP4 veya M4A’dır. Diğer video ve ses dosyaları da çalışır; yalnızca ses kanalı okunur.',
  uploadTitle: 'Ekleyebileceğiniz kayıt dosyaları',
  accepts: ['MP4', 'M4A', 'MKV', 'MOV', 'WEBM', 'MP3', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'toplantının tamamı düz metin olarak' },
    { name: 'Markdown', use: 'bir not uygulamasına yapıştırılacak zamanlı notlar' },
    { name: 'PDF', use: 'yazdırılacak veya dağıtılacak bir kopya' },
    { name: 'SRT', use: 'kayda altyazı eklemek için zamanlanmış satırlar' },
  ],

  tipsTitle: 'Toplantı transkriptleri için ipuçları',
  tips: [
    {
      title: 'Varsa yalnızca ses dosyasını kullanın.',
      text: 'Aynı konuşmayı çok daha küçük bir dosyada tutar; bu yüzden eklemesi ve işlemesi daha hızlıdır.',
    },
    {
      title: 'İsimleri ve terimleri kelime ipucuna koyun.',
      text: 'Daha fazla seçenek bölümünde toplantıda geçen kişileri, ürün adlarını ve kısaltmaları listeleyin. Böylece isimler ve kısaltmalar beklediğiniz gibi çıkar.',
    },
    {
      title: 'Üst üste konuşmanın hatalara yol açmasını bekleyin.',
      text: 'İki kişi aynı anda konuştuğunda tanıyıcı onları ayıramaz. Emin olmadığı satırlar işaretlenir; bu yüzden önce onları gözden geçirin.',
    },
    {
      title: 'Sınırların altında kalın.',
      text: 'Bu sayfada gösterilen boyut veya süre sınırlarını aşan kayıtlar işlenemez; bu yüzden çok uzun bir görüşmeyi önce parçalara bölün.',
      browser: {
        title: 'Uzun görüşmeler daha uzun sürer.',
        text: 'Site süreye bir sınır koymaz, ancak gün boyu süren bir çalıştay kaydı cihazınızda zaman ve boş bellek gerektirir. İlk saati daha çabuk okumak için dosyayı bir video düzenleyicide parçalara bölün.',
      },
    },
    {
      title: 'Transkripti özenle paylaşın.',
      text: 'Onu yalnızca toplantıda bulunan ya da ihtiyacı olan kişilere gönderin ve artık ihtiyacınız kalmadığında silin.',
    },
  ],

  faqs: [
    {
      question: 'TranscribeVid Zoom veya Teams görüşmeme katılıp onu canlı yazıya dökebilir mi?',
      answer:
        'Hayır. Toplantıdan sonra kaydettiğiniz bir kayıt üzerinde çalışır. Bir görüşmeye katılamaz ve canlı altyazı değildir. Canlı altyazı için toplantı aracınızın özelliğini kullanın.',
    },
    {
      question: 'Toplantı transkripti kimin ne söylediğini gösterir mi?',
      answer:
        'Hayır. Satırlar bir zaman taşır ancak isim taşımaz. İsimleri düzenlerken kendiniz ekleyin ve her birini kayıtla karşılaştırarak kontrol edin.',
    },
    {
      question: 'Gizli bir toplantı kaydını burada yazıya dökmek güvenli mi?',
      answer:
        'Sunucu kaydı şifreli bir bağlantıyla alır ve oturumunuz bitince ya da daha önce Verilerimi şimdi sil düğmesine basarsanız siler. Önce kuruluşunuzun neye izin verdiğini kontrol edin. Bu hukuki tavsiye değildir.',
      browser: {
        answer:
          'Kayıt yüklenmez: tarayıcınız onu kendi cihazınızda yazıya döker ve bir süre işlem yapılmayınca ya da Verilerimi şimdi sil düğmesine bastığınızda temizler. İndirdiğiniz bir transkript cihazınızda sıradan bir dosyadır; bu yüzden ona kayda gösterdiğiniz özenle bakın ve kuruluşunuzun neye izin verdiğini kontrol edin. Bu hukuki tavsiye değildir.',
      },
    },
    {
      question: 'Ne kadar uzun bir toplantı kaydını yazıya dökebilirim?',
      answer: '{limits} Daha uzun dosyalar işlenemez; bu yüzden önce bölün.',
      browser: {
        answer:
          'Kaydın kendisine bir üst sınır konmaz, çünkü iş kendi cihazınızda yapılır. Sizi sınırlayan zaman ve boş bellektir: saatler süren bir görüşme mümkündür, cihazınız bunun için çok yavaş görünüyorsa sayfa sizi uyarır ve WebCodecs desteği olmayan bir tarayıcı çok uzun bir dosyayla başa çıkamayabilir.',
      },
    },
    {
      question: 'İnsanlar toplantı sırasında dil değiştirirse ne olur?',
      answer:
        'En çok konuşulan dili seçin. Tanıma en iyi ana dili izler; bu yüzden başka bir dildeki kelimeler yanlış yazılabilir. Emin olmadığı satırlar işaretlenir: onları kayıtla karşılaştırarak kontrol edin.',
    },
  ],

  links: [
    {
      label: 'MP4 yazıya çevirme',
      path: '/mp4-to-text',
      note: 'MP4 video olarak kaydedilmiş bir toplantı için ayarlar.',
    },
    {
      label: 'M4A yazıya çevirme',
      path: '/m4a-to-text',
      note: 'Videodan daha küçük olan yalnızca ses dosyası için.',
    },
    {
      label: 'Röportaj yazıya dökme',
      path: '/interview-transcription',
      note: 'Kaydedilmiş birebir bir konuşma için; izin ve alıntı kontrolü notlarıyla.',
    },
    {
      label: 'Videoyu yüklemeden yazıya dökme',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Kaydınızın nerede kaldığı ve bunu tarayıcınızda nasıl doğrulayacağınız.',
    },
  ],
};
