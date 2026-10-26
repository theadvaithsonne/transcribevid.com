import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Video yazıya çevirme',
  h1: 'Videoyu yazıya çevirin: ücretsiz ve zaman damgalı',
  lead: 'Kayıtlı bir videoyu ekleyin ve konuşmanın satır satır, her satır kendi zamanıyla metne dönüşmesini izleyin. Dersler, röportajlar, toplantılar, telefon klipleri ve ekran kayıtları, 50’den fazla dilde çalışır.',
  dropKind: 'video',
  dropNoun: 'Videonuzu',

  whyTitle: 'Video neden yazıya çevrilmeli',
  why: [
    'Videoda arama yapmak yavaştır. Videoya göz gezdirerek bakamaz, alıntı yapamaz, içinden bir cümleyi kopyalayamazsınız. Transkript, konuşmayı aranabilir, alıntılanabilir, çevrilebilir ve çok daha kısa sürede okunabilir bir metne dönüştürür; her satır zaman damgasını korur, böylece tam o ana geri dönebilirsiniz.',
    'İnsanlar bunu kayıtlı derslerde ve web seminerlerinde, röportaj görüntülerinde, kaydedilmiş ekip toplantılarında, ürün tanıtımlarında, vloglarda ve kısa sosyal medya kliplerinde kullanır. Elde edilen metin; altyazı, yayın notları, blog yazıları ve toplantı tutanakları için de iyi bir başlangıç noktasıdır.',
  ],

  howTitle: 'Video yazıya nasıl çevrilir',
  howToDescription:
    'Bir video dosyası ekleyin, konuşulan dili seçin, transkriptin hazırlanmasını bekleyin ve metin ya da altyazı olarak indirin.',
  steps: [
    {
      title: 'Videonuzu seçin',
      text: 'Videoyu bu sayfanın üstündeki kutuya bırakın ya da Dosya seç düğmesine basın. Video, daha fazla video ekleyebileceğiniz ana sayfada açılır.',
    },
    {
      title: 'Dili ve kaliteyi ayarlayın',
      text: 'En iyi doğruluk için konuşulan dili seçin ya da otomatik algılamayı açık bırakın. Standart, çoğu video için uygundur. En hızlı, net konuşmalarda çabuk sonuç verir. Gürültülü veya zor seslerde Yüksek doğruluk ya da En yüksek doğruluk seçeneğini seçin; En yüksek doğruluk en uzun sürer ve en az hata yapar.',
    },
    {
      title: 'Yazıya dökülmesini izleyin',
      text: 'Metin satır satır canlı olarak görünür; yanında bir ilerleme çubuğu ve kalan sürenin tahmini yer alır.',
    },
    {
      title: 'Düzenleyin ve indirin',
      text: 'Düzenleyicide istediğiniz satırı düzeltin, ardından TXT, SRT, VTT, Markdown, JSON veya PDF olarak indirin. Oturumunuzdan sonra hiçbir şey saklanmaz; ayrılmadan önce indirin.',
    },
  ],

  formatsTitle: 'Desteklenen video dosyaları ve indirmeler',
  formatsIntro:
    'TranscribeVid ses kanalını okur, bu yüzden görüntü kalitesi önemli değildir. Yalnızca sesten oluşan dosyalar da çalışır.',
  uploadTitle: 'Ekleyebileceğiniz video dosyaları',
  accepts: ['MP4', 'MKV', 'MOV', 'AVI', 'WEBM', 'WMV', 'FLV', 'M4V', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'okumak veya yapıştırmak için düz metin' },
    { name: 'SRT', use: 'oynatıcılar ve düzenleyiciler için altyazı' },
    { name: 'VTT', use: 'web videosu için altyazı' },
    { name: 'Markdown', use: 'başlıklar ve zamanlar içeren metin' },
    { name: 'JSON', use: 'programlar için zamanlanmış satırlar' },
    { name: 'PDF', use: 'yazdırılabilir bir kopya' },
  ],

  tipsTitle: 'Daha iyi video transkriptleri için ipuçları',
  tips: [
    {
      title: 'Önce ilk dakikayı dinleyin.',
      text: 'Dizüstü bilgisayarın hoparlöründe konuşmayı takip etmekte zorlanıyorsanız yazılım da zorlanır. Ses sorunlarını videoyu eklemeden önce giderin.',
    },
    {
      title: 'Dili belirtin.',
      text: 'Konuşulan dili seçmek, özellikle kısa veya aksanlı kliplerde otomatik algılamadan daha güvenilirdir.',
    },
    {
      title: 'Kelime ipucu ekleyin.',
      text: 'Daha fazla seçenek bölümünde isimleri, markaları ve terimleri yazılmasını istediğiniz biçimde listeleyin.',
    },
    {
      title: 'Sınırın altında kalın.',
      text: 'Yukarıdaki sınırdan uzun veya büyük videolar reddedilir; bu yüzden uzun kayıtları önce parçalara bölün.',
      browser: {
        title: 'Uzun videolar daha uzun sürer.',
        text: 'Boyut sınırı yoktur, ancak uzun bir video cihazınızda daha uzun sürer ve daha fazla bellek gerektirir. Telefonda çok uzun kayıtları parçalara bölün.',
      },
    },
    {
      title: 'İşaretli satırları kontrol edin.',
      text: 'Tanıyıcının emin olmadığı satırlar işaretlenir. Hiçbir transkript kusursuz olmadığı için önce bunlara bakın.',
    },
  ],

  faqs: [
    {
      question: 'Videoyu yazıya çevirmek gerçekten ücretsiz mi?',
      answer:
        'Evet. Ücretsizdir, hesap ya da giriş gerekmez, günlük veya aylık kota da yoktur. {limits} Hizmeti çok kişi kullanıyorsa dosyanız bir süre sırada bekleyebilir.',
      browser: {
        answer:
          'Evet. Ücretsizdir, hesap ya da giriş gerekmez, günlük veya aylık kota da yoktur; reklamlar hizmetin ücretsiz kalmasını sağlar. Videonuz tarayıcınızda, kendi cihazınızda yazıya dökülür; bu yüzden boyut sınırı yoktur ve önünüzde kimse beklemez: ne kadar hızlı olacağı cihazınıza bağlıdır.',
      },
    },
    {
      question: 'Konuşma içermeyen bir videoyu yazıya çevirebilir miyim?',
      answer:
        'Yalnızca konuşma metne dönüşür. Sessiz bir video ya da yalnızca müzik içeren bir video boş veya çok kısa bir sonuç verir. Ekranda görünen yazılar okunmaz.',
    },
    {
      question: 'YouTube bağlantısı yapıştırabilir miyim?',
      answer:
        'Hayır. TranscribeVid web bağlantılarıyla değil, sizin eklediğiniz veya kaydettiğiniz dosyalarla çalışır. Video size aitse özgün dosyayı ekleyin.',
    },
    {
      question: 'Kimin konuştuğunu söylüyor mu?',
      answer:
        'Hayır. Konuşmacı adları veya etiketleri eklenmez. Her satırda bir zaman damgası vardır ve düzenlerken metne isimleri kendiniz yazabilirsiniz.',
    },
    {
      question: 'Videoyu yazıya çevirme ne kadar doğru?',
      answer:
        'Desteklenen bir dilde net konuşmada genellikle çok doğrudur, ancak hiçbir konuşma tanıma kusursuz değildir. Gürültü, aksanlar, müzik ve üst üste konuşan sesler doğruluğu düşürür; bu yüzden önemli bölümleri videoyla karşılaştırarak kontrol edin.',
    },
  ],
};
