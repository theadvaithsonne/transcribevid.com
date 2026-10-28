import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Video yazıya nasıl çevrilir: beş yöntem ve videonuza hangisinin uyduğu',
  lead: 'Bir videonun sözlerini beş yolla metin olarak alabilirsiniz: YouTube’un zaten elinde olan transkript, sesli yazma, bir video düzenleyicinin altyazıları, çevrimiçi bir hizmet ya da kendi cihazınızda çalışan bir araç. Maliyet, her satırda zaman alıp almadığınız ve sizden önce neler istedikleri bakımından birbirlerinden ayrılırlar. Bu rehber her birinin ne yaptığını ve ne zaman seçileceğini anlatır.',
  readingMinutes: 7,
  toolPath: '/transcribe-video-to-text',
  toolCta: 'Videoyu yazıya çevirin, ücretsiz ve hesapsız',
  blocks: [
    {
      title: 'Kısa cevap',
      bullets: [
        {
          title: 'Video YouTube’da ve altyazısı var:',
          text: 'video sayfasında transkriptini açın. Bir şeye mal olmaz ve bir dakika sürer, ancak yalnızca videonun altyazısı varsa bulunur ve metnin dikkatli okunması gerekir.',
        },
        {
          title: 'Video dosyanız var ve zamanlı metin istiyorsunuz:',
          text: 'bir dosya alan ve size TXT ile altyazı dosyaları veren bir araç kullanın. Aşağıdaki son iki yöntem bunu yapar.',
        },
        {
          title: 'Yalnızca birkaç alıntıya ihtiyacınız var:',
          text: 'videoyu oynatıp yazın ya da sesli yazmayı kullanın. Birkaç dakikadan uzun her şey için, dosyanın tamamını bir yazılıma bırakmaktan daha yavaştır.',
        },
        {
          title: 'Aynı video için altyazı istiyorsunuz:',
          text: 'SRT veya VTT dışa aktaran bir yöntem seçin; böylece tek çalıştırma size hem transkripti hem altyazıyı verir.',
        },
      ],
    },
    {
      title: 'İyi bir transkript videonuzdan ne bekler',
      paragraphs: [
        'Aşağıdaki her yöntem ses kanalından çalışır; bu yüzden metnin kalitesini görüntüden çok sesin kalitesi belirler. Mikrofona yakın, aynı anda tek kişinin konuştuğu ve altında müzik olmayan konuşma iyi çıkar. Yankılı bir oda, üst üste konuşan insanlar ya da gürültülü bir arka plan her yöntemde hatalı çıkar.',
        'Başlamadan önce üç şeyi öğrenin: videoda konuşulan dil, her satırda zamana ihtiyacınız olup olmadığı ve videonun uzunluğu. İkincisi hangi biçimleri indirebilmeniz gerektiğini, üçüncüsü hangi ücretsiz sınırların sizi durduracağını söyler.',
      ],
    },
    {
      title: '1. yöntem: YouTube’un zaten sahip olduğu transkripti kullanın',
      paragraphs: [
        'Birçok YouTube videosunda, sahibi tarafından yazılmış ya da otomatik üretilmiş altyazı bulunur. Bir video sayfasında açıklamayı açın: altyazı varsa orada transkripti göstermek için bir seçenek belirir ve metni, kopyalayabileceğiniz zamanlarla listeler. Video sizinse, YouTube Studio’da altyazıları gözden geçirip indirebileceğiniz bir Altyazılar bölümü vardır. YouTube bu ekranları zaman zaman değiştirir, bu yüzden adlar biraz farklı olabilir.',
      ],
      after: [
        'Zaten YouTube’da olan bir video için en hızlı yol budur. Sınırları şunlardır: yalnızca altyazısı olan bir videonun bağlantısıyla çalışır, otomatik metin isimlerde ve teknik sözcüklerde kaba olabilir ve bilgisayarınızdaki ya da telefonunuzdaki bir dosyaya yardımcı olmaz.',
      ],
    },
    {
      title: '2. yöntem: videoyu oynatın, sesli yazma dinlesin',
      paragraphs: [
        'Bir kelime işlemcideki sesli yazma, örneğin Google Docs’un Araçlar menüsündeki Sesli yazma seçeneği, mikrofonunun duyduğunu yazar. Videoyu hoparlörlerinizden çalarsınız ve o yazar.',
        'Bir şeye mal olmaz, ancak yalnızca videoyu değil, tüm odayı duyar. Size zaman vermez, gerçek zamanlı çalışır, yani bir saatlik video bir saat sürer ve mikrofonun kaçırdığı her şey kaybolur. Bir iki alıntı için uygundur, bir ders ya da röportaj için kötü bir seçimdir.',
      ],
    },
    {
      title: '3. yöntem: video düzenleyicide otomatik altyazıyı açın',
      paragraphs: [
        'Bazı video düzenleyiciler, içlerine yerleştirdiğiniz bir klibin konuşmasını yazıya dökebilir. Örneğin Microsoft Clipchamp’in kendi kılavuzu, Altyazılar sekmesini açmanızı, otomatik altyazıyı etkinleştirmenizi ve ardından altyazıları SRT dosyası olarak indirmenizi söyler; bunun çalışması için videonun sesinde konuşma olması gerekir.',
        'Videoyu zaten düzenliyorsanız bu işe yarar, çünkü altyazılar zaman çizelgesine yerleşir. Düz bir transkript için gereğinden fazla iştir: videoyu düzenleyiciye yüklemeniz gerekir ve metin, sonradan belgeye çevirmeniz gereken bir altyazı dosyası olarak çıkar.',
      ],
    },
    {
      title: '4. yöntem: çevrimiçi bir yazıya dökme hizmeti kullanın',
      paragraphs: [
        'Düzinelerce site, verdiğiniz dosyayı yazıya dökecektir. Çoğu yalnızca belli bir noktaya kadar ücretsizdir: birkaç dakika, birkaç dosya ya da indirmeden önce ödeme isteyen bir önizleme. Önem taşıyan farklar şunlardır: hesap gerekip gerekmediği, kaç dakika hakkınız olduğu, bir dosyanın ne kadar büyük olabileceği ve sonucun dışa aktarılıp aktarılamayacağı.',
        'Hizmetler, basit araçların yapmadığı şeylere ihtiyacınız olduğunda doğru seçimdir: her konuşmacı için isimler, bir toplantıya katılan bir bot ya da dosya olarak elinizde olmayan bir videonun bağlantısı. Bunlardan on üçünün ücretsiz sınırlarını, her biri kendi sayfasından alıntılanmış olarak içeren rehberimizin bağlantısı aşağıdadır.',
      ],
    },
    {
      title: '5. yöntem: dosyayı TranscribeVid ile yazıya dökün',
      paragraphs: [
        'TranscribeVid, video dosyasının kendisini alır; hesap ve günlük sayı sınırı yoktur. Açık bir konuşma modeli olan Whisper’ı çalıştırır ve metni her satırda bir zamanla birlikte geri verir.',
        'Bağlantı kabul etmez, kimin konuştuğunu etiketlemez ve toplantılara katılmaz. Bu işler için 4. yöntemdeki bir hizmeti kullanın.',
      ],
      browser: {
        paragraphs: [
          'TranscribeVid, video dosyasının kendisini alır; hesap, günlük sayı sınırı ve boyut sınırı yoktur. Açık bir konuşma modeli olan Whisper’ı tarayıcınızda çalıştırır; böylece video cihazınızda kalır ve metin her satırda bir zamanla birlikte geri gelir.',
          'Bağlantı kabul etmez, kimin konuştuğunu etiketlemez ve toplantılara katılmaz. Bu işler için 4. yöntemdeki bir hizmeti kullanın. İşi kendi cihazınız yaptığı için, uzun bir video eski bir telefonda yeni bir dizüstü bilgisayardakinden daha yavaştır.',
        ],
      },
      steps: [
        { title: 'Videoyu ekleyin', text: 'Dosyayı araç sayfasındaki kutuya bırakın ya da Dosya seç düğmesine basın. MP4, MOV, MKV, WEBM ve diğer çoğu video dosyası çalışır, ses dosyaları da öyle.' },
        { title: 'Dili ve kaliteyi seçin', text: 'Biliyorsanız konuşulan dili belirtin. Standart çoğu video için uygundur; aksanlar, gürültü ya da Hintçe için Yüksek doğruluk veya En yüksek doğruluk seçin.' },
        { title: 'Metni bekleyin', text: 'Satırlar, bir ilerleme çubuğu ve kalan süreyle birlikte tek tek belirir.' },
        { title: 'Düzenleyin ve indirin', text: 'Düzenleyicide istediğiniz satırı düzeltin, sonra TXT, SRT, VTT, PDF, Markdown veya JSON olarak indirin. Ayrılmadan önce saklamak istediğinizi indirin.' },
      ],
    },
    {
      title: 'Hangi video için hangi yöntem',
      table: {
        caption: 'Bu rehberde anlatıldığı hâliyle beş yöntem yan yana',
        head: ['Yöntem', 'Maliyet', 'Her satırda zaman', 'Şunda çalışır', 'En uygun olduğu iş'],
        rows: [
          ['YouTube transkripti', 'Ücretsiz', 'Evet', 'Altyazısı olan bir YouTube videosu', 'Zaten çevrimiçi olan bir videodan hızlı kopya'],
          ['Sesli yazma', 'Ücretsiz', 'Hayır', 'Sesli çalabildiğiniz her şey', 'Birkaç alıntı'],
          ['Düzenleyici altyazıları', 'Düzenleyiciye göre değişir', 'Evet, altyazı olarak', 'Düzenleyiciye yüklenmiş bir klip', 'Zaten düzenlediğiniz bir video'],
          ['Çevrimiçi hizmet', 'Bir sınıra kadar ücretsiz, sonra ücretli', 'Genellikle', 'Dosyalar, bazen bağlantılar', 'Konuşmacı isimleri, toplantılar, bağlantılar'],
          ['TranscribeVid', 'Ücretsiz', 'Evet', 'Bir video ya da ses dosyası', 'Bir dosya; karşılığında TXT ve altyazı dosyaları'],
        ],
      },
    },
    {
      title: 'Metni kullanmadan önce düzeltin',
      paragraphs: [
        'Hangi yöntemi seçerseniz seçin, sonucu video oynarken bir kez okuyun. Konuşmadan metne çeviri yaygın sözcükleri doğru bulur ama sizin için en önemli şeylerde tökezler: isimler, ürün sözcükleri, sayılar ve hızlı söylenen her şey.',
      ],
      bullets: [
        { title: 'İsimler ve terimler.', text: 'Videoda geçtiğini bildiğiniz her ismi metinde arayın ve geçtiği her yeri düzeltin.' },
        { title: 'Sayılar ve tarihler.', text: 'Her birini videoyla karşılaştırın; yanlış bir rakam kolay gözden kaçar.' },
        { title: 'Konuşmacının değiştiği yerler.', text: 'Bir satır sonu ve bir isim ekleyin, çünkü düz transkriptler kimin konuştuğunu işaretlemez.' },
        { title: 'Altyazılar.', text: 'Bir SRT ya da VTT dosyası kullanacaksanız, her satırı ekranda kaldığı sürede okunabilecek kadar kısa tutun.' },
      ],
      after: [
        'Başlamadan önce hataları azaltan alışkanlıkların daha uzun bir listesi için, daha doğru bir transkript elde etme rehberine bakın.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Hiçbir şey yüklemeden videoyu yazıya çevirebilir miyim?',
      answer: 'Evet. YouTube transkripti, çevrimiçi bir hizmet ve TranscribeVid bir web tarayıcısında çalışır. Yalnızca bir video düzenleyici ya da masaüstü programı kurulum gerektirir.',
    },
    {
      question: 'Bir saatlik videoyu yazıya çevirmenin en hızlı yolu nedir?',
      answer: 'Altyazılı olarak YouTube’daysa, oradaki transkript anında hazırdır. Bir dosya için yazılım, ikisi de en az videonun süresi kadar süren yazmaktan ya da sesli yazmadan çok daha hızlıdır. Yazılımın ne kadar süreceği araca, kalite düzeyine ve cihazınızda çalışıyorsa o cihazın ne kadar hızlı olduğuna bağlıdır.',
    },
    {
      question: 'Önce videonun sesini ayırmam gerekir mi?',
      answer: 'Hayır. Video dosyası kabul eden araçlar ses kanalını kendileri okur; bu yüzden bir MP4 ya da MOV’u olduğu gibi ekleyebilirsiniz. Sesi önce ayırmak yalnızca bir araç video biçimini reddettiğinde işe yarar.',
    },
    {
      question: 'Metni her satırda bir zamanla nasıl alırım?',
      answer: 'Altyazı ya da zamanlı transkript dışa aktaran bir yöntem kullanın: YouTube transkripti zamanları listeler ve SRT ya da VTT indiren bir araç her satıra bir başlangıç ve bitiş zamanı verir. Sesli yazma hiç vermez.',
    },
  ],
  links: [
    {
      label: 'Ücretsiz video yazıya çevirme araçları karşılaştırması',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'On üç çevrimiçi aracın ücretsiz sınırları, her biri kendi sayfasından alıntılanmış.',
    },
    {
      label: 'Daha doğru bir transkript nasıl elde edilir',
      path: '/guides/accurate-transcripts',
      note: 'Her videoda hataları azaltan alışkanlıklar ve ayarlar.',
    },
    {
      label: 'Videonuz için altyazı yapın',
      path: '/srt-subtitle-generator',
      note: 'Aynı videoyu oynatıcılar ve düzenleyiciler için bir SRT dosyasına dönüştürün.',
    },
    {
      label: 'Videoyu yüklemeden yazıya dökme',
      path: '/guides/transcribe-video-without-uploading',
      note: 'İşin cihazınızda nasıl kaldığı ve bunu kendiniz nasıl kontrol edeceğiniz.',
    },
  ],
};
