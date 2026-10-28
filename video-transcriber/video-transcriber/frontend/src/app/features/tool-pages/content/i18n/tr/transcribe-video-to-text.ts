import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Videoyu yazıya dökme',
  h1: 'Videoyu yazıya çevirin: ücretsiz, üyeliksiz, günlük sınırsız',
  browserH1: 'Videoyu yazıya çevirin: ücretsiz, üyeliksiz, sınırsız, hiçbir şey yüklenmez',
  lead: 'Bir video ekleyin ve konuşmasını, her satırda bir zamanla birlikte metin olarak geri alın. Açılacak bir hesap ve günlük bir sınır yoktur; bu video biter bitmez sıradaki video başlayabilir.',
  browserLead:
    'Bir video ekleyin ve konuşmasını, her satırda bir zamanla birlikte metin olarak geri alın. Açılacak bir hesap, günlük bir sınır ve dosya boyutu sınırı yoktur; video hiçbir yere yüklenmez, işi kendi cihazınız yapar.',
  dropKind: 'video',
  dropNoun: 'Videonuzu',

  whyTitle: 'Videoyu yazıya çevirirken “ücretsiz” ne anlama gelmeli',
  why: [
    '“Ücretsiz video yazıya çevirme” diyen birçok site size bir dakika ya da birkaç dosya verir, sonra hesap veya kart ister. Birini seçmeden önce dört şeye bakın: kaydolmanız gerekip gerekmediğine, kaç dakika ya da dosya hakkınız olduğuna, ne kadar büyük bir dosya aldığına ve sonucu indirip indiremeyeceğinize.',
    'Burada her birinin cevabı basittir. Videoyu eklersiniz, kaydolunacak bir şey yoktur, günlük ya da aylık bir sayı sınırı yoktur ve transkript TXT, SRT, VTT, PDF, Markdown veya JSON olarak ücretsiz iner. Araç konuşmacıları etiketlemez ve bağlantı kabul etmez: dosyanın kendisini eklersiniz.',
  ],
  browserWhy: [
    '“Ücretsiz video yazıya çevirme” diyen birçok site size bir dakika ya da birkaç dosya verir, sonra hesap veya kart ister. Birini seçmeden önce dört şeye bakın: kaydolmanız gerekip gerekmediğine, kaç dakika ya da dosya hakkınız olduğuna, ne kadar büyük bir dosya aldığına ve sonucu indirip indiremeyeceğinize.',
    'Burada her birinin cevabı basittir. Videoyu eklersiniz, kaydolunacak bir şey yoktur, günlük ya da aylık bir sayı sınırı ve boyut sınırı yoktur; transkript TXT, SRT, VTT, PDF, Markdown veya JSON olarak ücretsiz iner. İşi cihazınız yaptığı için asıl sınır belleğidir: çok uzun bir video telefon için fazla gelebilir, bu yüzden önce parçalara bölün. Araç konuşmacıları etiketlemez ve bağlantı kabul etmez: dosyanın kendisini eklersiniz.',
  ],

  sections: [
    {
      title: 'Diğer video yazıya çevirme sitelerinin ücretsiz sınırları, Ekim 2026’da kontrol edildi',
      paragraphs: [
        'Aşağıdakiler, her aracın kendi sayfasında 28 Ekim 2026 tarihinde yazdığı hâliyle alıntılardır ve firmaların İngilizce sayfalarından çevrilmiştir. Planlar değişir, bu yüzden bir rakama güvenmeden önce sayfaya bakın. Bu sayfanın sonunda bağlantısı verilen rehberde, her kaynağa bağlantı içeren tam tablo yer alır.',
      ],
      bullets: [
        {
          title: 'Riverside.',
          text: '“Ücretsiz sınırsız yazıya dökme. Kayıt gerekmez.” Ücretsiz araç MP3, WAV, MP4 ve MOV dosyalarını kabul eder ve birden çok konuşmacılı bir kaydın tüm metnini tek bir konuşmacıya verir.',
        },
        { title: 'VoiceCheap.', text: '“60 dakikaya kadar olan dosyalar ücretsizdir; günde 1 yazıya dökme.”' },
        { title: 'RecCloud.', text: '“Ücretsiz planımız en fazla 10 dakika uzunluğundaki videolara izin verir.”' },
        { title: 'Caption-X.', text: '“Ücretsiz plan toplam 5 yazıya dökmeyi kapsar; her biri en fazla 5 dakikadır.”' },
        { title: 'Maestra.', text: '“1 dakikalık önizleme” ve “Transkriptinizi indirmek veya dışa aktarmak için kaydolun.”' },
        { title: 'Any2Text.', text: '“İlk 15 dakika ücretsiz”, sonrasında dakikası $0.035.' },
      ],
    },
    {
      title: 'Videonuz yazıya çevrilirken nereye gider',
      paragraphs: [
        'Video, bu siteyi çalıştıran sunucuya gönderilir, orada yazıya dökülür ve oturumunuz bittiğinde silinir. Başka hiçbir yerde yayımlanmaz.',
      ],
      browser: {
        paragraphs: [
          'Video cihazınızda kalır. Tarayıcınız onu okur, sesi ayıklar ve üzerinde Whisper konuşma modelini çalıştırır; bu yüzden ne bize ne de başkasına dosya gönderilir.',
          'Yalnızca araçlar indirilir: sayfa, konuşma modeli ve onu çalıştıran motor. Model, kalite düzeyine ve cihazınıza göre yaklaşık 77 MB ile 1 GB’ın biraz üzeri arasındadır ve sonrasında tarayıcınızda saklanır. Kendiniz görmek için, bir video yazıya dökülürken tarayıcınızın ağ panelini açın.',
        ],
      },
    },
    {
      title: 'Farklı videolar için dört kalite düzeyi',
      paragraphs: [
        'En hızlı, küçük Base modelini kullanır ve net konuşmanın hızlı bir taslağı için uygundur. Standart daha büyük bir model kullanır ve olağan tercihtir. Yüksek doğruluk, Large v3 Turbo’yu çalıştırır ve aksanları ile gürültülü odaları daha iyi çözer. En yüksek doğruluk, tam Large v3’ü çalıştırır ve en az hatayı yapar, ancak en uzun sürer.',
        'Model büyüdükçe süre uzar: En hızlı en az, En yüksek doğruluk en çok zaman alır. Önce Standart’ı deneyin; yalnızca metin yeterince iyi değilse bir üst düzeye geçin.',
      ],
      browser: {
        paragraphs: [
          'En hızlı, küçük Base modelini kullanır ve net konuşmanın hızlı bir taslağı için uygundur. Standart daha büyük bir model kullanır ve olağan tercihtir. Yüksek doğruluk, Large v3 Turbo’yu çalıştırır ve aksanları ile gürültülü odaları daha iyi çözer. En yüksek doğruluk, tam Large v3’ü çalıştırır ve en az hatayı yapar, ancak en uzun sürer.',
          'İşi cihazınız yapar, bu yüzden hız ona bağlıdır: yeni bir dizüstü bilgisayar eski bir telefondan çok daha hızlıdır ve telefonda kullanılacak düzey En hızlı’dır. Dizüstü bilgisayarda önce Standart’ı deneyin; yalnızca metin yeterince iyi değilse bir üst düzeye geçin.',
        ],
      },
    },
  ],

  howTitle: 'Dört adımda video nasıl yazıya çevrilir',
  howToDescription: 'Videoyu ekleyin, dili ve kalite düzeyini seçin, metin belirirken bekleyin, sonra düzenleyip indirin.',
  steps: [
    {
      title: 'Videoyu ekleyin',
      text: 'Dosyayı bu sayfanın üstündeki kutuya bırakın ya da Dosya seç düğmesine basın. Bir web videosunun bağlantısı kabul edilmez.',
    },
    {
      title: 'Dili ve kaliteyi seçin',
      text: 'Biliyorsanız konuşulan dili belirtin ve bir kalite düzeyi seçin. Standart iyi bir başlangıçtır; aksanlar, gürültü ya da Hintçe gibi bir dil için Yüksek doğruluk veya En yüksek doğruluk seçeneğini kullanın.',
    },
    {
      title: 'Metni bekleyin',
      text: 'Satırlar, bir ilerleme çubuğu ve kalan süreyle birlikte tek tek belirir.',
      browser: {
        text: 'Satırlar, bir ilerleme çubuğu ve kalan süreyle birlikte tek tek belirir. Bir düzeyi ilk kez kullandığınızda model bir kez indirilir; sonraki videolar hemen başlar.',
      },
    },
    {
      title: 'Düzenleyin ve indirin',
      text: 'Düzenleyicide istediğiniz satırı düzeltin, sonra TXT, SRT, VTT, PDF, Markdown veya JSON olarak indirin. Ayrılmadan önce indirin: oturumdan sonra sizin için hiçbir şey saklanmaz.',
      browser: {
        text: 'Düzenleyicide istediğiniz satırı düzeltin, sonra TXT, SRT, VTT, PDF, Markdown veya JSON olarak indirin. Transkript bir süre bu tarayıcıda kalır, ancak saklamak istediğinizi indirin.',
      },
    },
  ],

  formatsTitle: 'Ekleyebileceğiniz videolar ve geri alacağınız dosyalar',
  formatsIntro: 'Okunan şey ses kanalıdır, bu yüzden görüntü kalitesi önemli değildir. Yalnızca sesten oluşan dosyalar da çalışır.',
  uploadTitle: 'Ekleyebileceğiniz video dosyaları',
  accepts: ['MP4', 'MOV', 'MKV', 'WEBM', 'AVI', 'M4V', '3GP'],
  downloads: [
    { name: 'TXT', use: 'düz metin ya da her satırda bir zaman' },
    { name: 'SRT', use: 'düzenleyiciler ve oynatıcılar için altyazı' },
    { name: 'VTT', use: 'web videosu için altyazı' },
    { name: 'PDF', use: 'yazdırılacak ya da paylaşılacak bir transkript' },
    { name: 'Markdown', use: 'zaman damgalı notlar' },
    { name: 'JSON', use: 'geliştiriciler için kelimeler ve zamanlar' },
  ],

  tipsTitle: 'Ücretsiz yazıya çevirmeden daha fazla verim almak',
  tips: [
    {
      title: 'Tüm videodan önce ilk dakikayı deneyin.',
      text: 'Videonun bir dakikasını kesin ya da oynatın ve onu yazıya dökün. Metin yanlışsa, dosyanın tamamına zaman harcamadan önce dili ya da kalite düzeyini değiştirin.',
    },
    {
      title: 'Kulaklarınızdakine olduğu kadar ekrandakine de bakın.',
      text: 'Yalnızca konuşma yazıya geçer. Bir slaytta görünen ama hiç söylenmeyen isimler metinde olmaz.',
    },
    {
      title: 'Çok uzun bir kaydı bölün.',
      text: 'Birkaç saatlik bir video, her biri bir saat kadar olan parçalarda daha kolay yönetilir: okumaya daha erken başlarsınız ve bir hatayı yeniden yapmak daha az zamana mal olur.',
      browser: {
        title: 'Telefonda çok uzun bir kaydı bölün.',
        text: 'Boyut sınırı yoktur, ancak birkaç saatlik bir video çok bellek gerektirir. Telefonda her biri bir saat kadar olan parçalar çok daha güvenlidir; dizüstü bilgisayarda genellikle çok daha uzununa gidebilirsiniz.',
      },
    },
    {
      title: 'Metnin yanında altyazı dosyasını da indirin.',
      text: 'SRT dosyası zamanlamayı korur; böylece aynı çalıştırma size hem okunacak bir transkript hem de videoya eklenecek altyazı verir.',
    },
  ],

  faqs: [
    {
      question: 'Dosya yerine bir YouTube, TikTok veya Google Drive bağlantısı yapıştırabilir miyim?',
      answer: 'Hayır. Bu araç sizin eklediğiniz ya da kaydettiğiniz bir dosyayla çalışır. Video size aitse özgün dosyayı kullanın; başkasının videosu için onu kullanma hakkınızın olması gerekir.',
    },
    {
      question: 'Transkript kimin konuştuğunu gösterir mi?',
      answer: 'Hayır. Satırlarda zaman vardır ama konuşmacı adı yoktur. Düzenleyicide metne isimleri kendiniz yazabilirsiniz; iki kişilik bir röportaj için bu hızlıdır.',
    },
    {
      question: 'Yazıya çevirebileceğim video sayısında gerçekten bir sınır yok mu?',
      answer: 'Hesap, plan ve günlük ya da aylık bir sayı sınırı yoktur. {limits} Hizmeti çok kişi kullanıyorsa videonuz bir süre sırada bekleyebilir.',
      browser: {
        answer:
          'Hesap, plan, günlük ya da aylık bir sayı sınırı ve boyut sınırı yoktur. Tek sınır cihazınızdır: çok uzun bir video daha uzun sürer ve daha fazla bellek gerektirir; bu yüzden telefonda bir saat kadar olan parçalar daha iyi sonuç verir. Siteyi reklamlar ücretsiz tutar ve bir video yazıya dökülürken hiçbiri gösterilmez.',
      },
    },
    {
      question: 'Uzun bir video için hangi kalite düzeyi uygun?',
      answer: 'Olağan tercih Standart’tır. En hızlı daha çabuktur ama daha çok hata yapar; Yüksek doğruluk ve En yüksek doğruluk daha çok zaman alır, karşılığını aksanlarda, gürültüde ve Hintçe gibi dillerde verir.',
    },
    {
      question: 'Video bilgisayarımdan çıkıyor mu?',
      answer: 'Bu siteyi çalıştıran sunucuya gönderilir ve oturumunuz bittiğinde silinir.',
      browser: {
        answer: 'Hayır. Tarayıcınız videoyu kendi cihazınızda yazıya döker ve bize hiçbir dosya gönderilmez. Yalnızca konuşma modeli ve motoru, bir kez indirilir.',
      },
    },
  ],

  links: [
    {
      label: 'Ücretsiz video yazıya çevirme araçları karşılaştırması',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Her sınır tek bir tabloda, her aracın kendi sayfasından alıntılanmış.',
    },
    {
      label: 'Videoyu yüklemeden yazıya dökme',
      path: '/guides/transcribe-video-without-uploading',
      note: 'İşin cihazınızda nasıl kaldığı ve bunu kendiniz nasıl kontrol edeceğiniz.',
    },
    {
      label: 'Video yazıya nasıl çevrilir',
      path: '/guides/how-to-transcribe-video-to-text',
      note: 'Bunu yapmanın beş yolu ve hangisinin videonuza uyduğu.',
    },
    {
      label: 'Daha doğru bir transkript nasıl elde edilir',
      path: '/guides/accurate-transcripts',
      note: 'Her videoda hataları azaltan alışkanlıklar ve ayarlar.',
    },
  ],
};
