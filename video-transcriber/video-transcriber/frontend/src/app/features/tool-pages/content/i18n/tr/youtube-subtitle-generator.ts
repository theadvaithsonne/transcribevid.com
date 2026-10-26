import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'YouTube altyazı oluşturucu',
  h1: 'Kendi YouTube videonuz için altyazı oluşturun',
  lead: 'YouTube için hazırladığınız video dosyasını ekleyin, konuşmaya göre zamanlanmış bir SRT dosyası alın ve YouTube Studio’ya yükleyin. Ücretsiz, girişsiz; yayımlamadan önce her satırı siz kontrol edersiniz.',
  dropKind: 'video',
  dropNoun: 'Videonuzu',

  whyTitle: 'Neden kendi altyazı dosyanızı yüklemelisiniz',
  why: [
    'YouTube birçok video için otomatik altyazı üretir, ancak bunlar her zaman doğru değildir ve YouTube videoyu işlemeyi bitirene kadar görünmezler. Kendi altyazı dosyanız, isimlerinizin, ürünlerinizin ve terimlerinizin sizin yazdığınız gibi yazıldığı her satırı kontrol edip düzeltmenize olanak tanır.',
    'Bu sayfa kendi yaptığınız videolar içindir. Bir YouTube bağlantısından değil, bilgisayarınızdaki video dosyasından çalışır: bağlantı yapıştırma desteklenmez. Video sizinse özgün dosya zaten kameranızda ya da düzenleyicinizde vardır. TranscribeVid bağımsız bir araçtır ve YouTube ile bağlantılı değildir: kanalınızda hiç oturum açmaz; bu yüzden bitmiş dosyayı oraya kendiniz eklersiniz.',
  ],

  sections: [
    {
      title: 'SRT dosyasını YouTube Studio’ya eklemek',
      paragraphs: [
        'YouTube Studio’daki menü adları zaman zaman değişir; bu yüzden bu adımları bir rehber olarak görün ve ekranda gördüğünüz etiketleri izleyin.',
      ],
      bullets: [
        {
          title: 'Altyazılar’ı açın.',
          text: 'Kanalınızda oturum açın, YouTube Studio’yu açın ve soldaki menüden Altyazılar’ı seçin.',
        },
        {
          title: 'Videoyu seçin.',
          text: 'Altyazı eklemek istediğiniz videoyu seçin. YouTube videonun dilini sorarsa önce onu ayarlayın.',
        },
        {
          title: 'Dili ekleyin.',
          text: 'Dil ekle’yi seçin, dosyanın dilini belirleyin, ardından Altyazılar altında Ekle’yi seçin.',
        },
        {
          title: 'Dosyayı yükleyin.',
          text: 'Dosya yükle’yi, ardından Zamanlamayla’yı seçin ve indirdiğiniz .srt dosyasını belirleyin. Satırları önizlemede kontrol edin, sonra Yayınla’yı seçin.',
        },
      ],
    },
    {
      title: 'Başka bir dilden İngilizce altyazı',
      paragraphs: [
        'Video başka bir dilde konuşuluyorsa başlamadan önce Daha fazla seçenek bölümünde Çıktı’yı İngilizceye çevir olarak ayarlayın. Konuşmaya göre zamanlanmış İngilizce metin alırsınız; bunu İngilizce bir altyazı izi olarak yükleyebilirsiniz. Çeviri makine işidir; bu yüzden yayına girmeden önce İngilizceyi baştan sona okuyun.',
        'TranscribeVid İngilizce dışındaki dillere çeviri yapmaz. Dosyanız olan her diğer dil için YouTube Studio’da ayrı bir iz ekleyin.',
      ],
    },
    {
      title: 'Altyazılar neden emeğe değer',
      paragraphs: [
        'İnsanlar sesi açamayacakları yerlerde izler ve birçoğu ikinci bir dili kulaktan çok yazıyla daha iyi takip eder. Altyazılar ayrıca sağır veya işitme güçlüğü çeken izleyicilere yardımcı olur ve söylediğiniz sözleri aranabilen, alıntılanabilen metne dönüştürür.',
      ],
    },
  ],

  howTitle: 'YouTube videosu için altyazı nasıl yapılır',
  howToDescription:
    'Video dosyasını ekleyin, konuşulan dili seçin, satırları kontrol edin, bir SRT dosyası indirin ve YouTube Studio’ya yükleyin.',
  steps: [
    {
      title: 'Video dosyanızı ekleyin',
      text: 'YouTube’a yüklediğiniz video dosyasını seçin; ona bir bağlantıyı değil: bu sayfanın üstündeki kutuya bırakın ya da Dosya seç düğmesine basın. İkinci bir video için sonraki sayfada Başka bir dosya ekle’yi kullanın.',
    },
    {
      title: 'Dili seçin',
      text: 'Sonraki sayfada konuşulan dili seçin ya da Otomatik algıla seçeneğini açık bırakın. Her satır kelimelerle başlayıp bitsin diye Daha fazla seçenek bölümünde Kelime düzeyinde zamanlama’yı açık tutun. Ardından Yazıya dök düğmesine basın.',
    },
    {
      title: 'Satırları kontrol edin',
      text: 'Transkripti açın, herhangi bir zaman damgasından oynatın ve yanlış kelimeleri, isimleri ve sayıları düzeltin. Gösterilmesini istemediğiniz satırları silin.',
    },
    {
      title: 'SRT’yi indirin ve yükleyin',
      text: 'SRT dosyasını indirin, ardından yukarıda anlatıldığı gibi YouTube Studio’da videoya ekleyin.',
    },
  ],

  formatsTitle: 'Video dosyaları ve altyazı dosyaları',
  formatsIntro:
    'YouTube için hazırladığınız video dosyasını bu türlerden herhangi birinde ekleyin ve altyazıyı ihtiyacınız olan biçimde indirin.',
  uploadTitle: 'Ekleyebileceğiniz video dosyaları',
  accepts: ['MP4', 'MOV', 'M4V', 'WEBM', 'MKV', '3GP'],
  downloads: [
    { name: 'SRT', use: 'YouTube Studio’nun istediği altyazı dosyası' },
    { name: 'VTT', use: 'web oynatıcıları için WebVTT' },
    { name: 'TXT', use: 'açıklamanız veya bir blog yazısı için transkript' },
    { name: 'Markdown', use: 'zaman damgalı metin' },
    { name: 'JSON', use: 'programlar için her satır ve zaman' },
    { name: 'PDF', use: 'yazdırılabilir bir metin' },
  ],

  tipsTitle: 'YouTube altyazıları için ipuçları',
  tips: [
    {
      title: 'Son kurguyu kullanın.',
      text: 'Dosyayı, yüklediğiniz tam videodan yapın; daha önceki bir taslaktan değil. Konuşmayı kaydıran her düzenleme zamanlamayı da kaydırır.',
    },
    {
      title: 'Kelime düzeyinde zamanlamayı açık tutun.',
      text: 'Varsayılan olarak açıktır ve tüm cümleleri zamanlamaktan daha hassas bir altyazı zamanlaması verir.',
    },
    {
      title: 'Yayımlamadan önce isimleri düzeltin.',
      text: 'Otomatik metin en sık kanal adlarını, ürünleri ve sayıları yanlış yazar. Kelime ipucu yardımcı olur, baştan sona okuma da gerisini yakalar.',
    },
    {
      title: 'Sesi kapalı okuyun.',
      text: 'Videoyu altyazılar açık ve sessiz izleyin. Hangi satırların okunamayacak kadar çabuk kaybolduğunu hemen görürsünüz.',
    },
  ],

  faqs: [
    {
      question: 'Yüklemediğim bir YouTube videosu için altyazı yapabilir miyim?',
      answer:
        'Hayır. Bu araç bağlantılarla değil, yalnızca dosyalarla çalışır ve kendinizin yaptığı ya da kullanma hakkınızın olduğu videolar içindir. Kendi videolarınız için kameranızdaki ya da düzenleyicinizdeki özgün dosyayı kullanın.',
    },
    {
      question: 'YouTube Studio hangi dosyayı istiyor, SRT mi VTT mi?',
      answer:
        'En güvenli seçim SRT’dir: YouTube Studio’nun okuduğu, yaygın olarak kullanılan bir biçimdir. Satırlar konuşmayla eşleşsin diye zamanlamayla yükleyin.',
    },
    {
      question: 'Altyazı dosyasını yapmak için giriş yapmam gerekir mi?',
      answer:
        'Hayır. Burada hesaba ihtiyacınız yok. YouTube kanalınıza yalnızca dosyayı YouTube Studio’ya yüklemek için ihtiyacınız var.',
    },
    {
      question: 'İspanyolca veya Hintçe bir video için İngilizce altyazıyı nasıl alırım?',
      answer:
        'Başlamadan önce Daha fazla seçenek bölümünde Çıktı’yı İngilizceye çevir olarak ayarlayın. Transkript zamanlarla birlikte İngilizce çıkar. Çeviri otomatiktir ve hatalar içerebilir; bu yüzden onu İngilizce bir iz olarak yayımlamadan önce okuyun.',
    },
    {
      question: 'Altyazılarım YouTube’da neden eşzamansız?',
      answer:
        'En sık nedeni, dosyanın videonun farklı bir sürümünden yapılmış olmasıdır; örneğin başı kırpılmadan önce. Dosyayı yüklediğiniz tam videodan yeniden yapın. Zamanlama yakındır ancak kare düzeyinde kusursuz değildir; bu yüzden YouTube Studio’da son bir kontrol yardımcı olur.',
    },
  ],

  links: [
    {
      label: 'SRT altyazı oluşturucu',
      path: '/srt-subtitle-generator',
      note: 'Bir SRT dosyasının içinin neye benzediği ve dışa aktarmadan önce satırların nasıl düzeltileceği.',
    },
    {
      label: 'Videoya altyazı nasıl eklenir',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Dosyayı kullanabileceğiniz diğer yerler: medya oynatıcılar, düzenleyiciler ve kendi web sayfanız.',
    },
    {
      label: 'Konuşmayı İngilizceye çevirme',
      path: '/translate-audio-to-english',
      note: 'Başka bir dildeki konuşmadan İngilizce metin ve sonrasında nelerin kontrol edileceği.',
    },
    {
      label: 'SRT ve VTT farkı: hangi altyazı biçimi kullanılmalı',
      path: '/guides/srt-vs-vtt',
      note: 'İki yaygın altyazı biçiminin birbirinden nasıl farklı olduğu.',
    },
  ],
};
