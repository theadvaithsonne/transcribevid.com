import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WAV yazıya çevirme',
  h1: 'WAV dosyasını yazıya çevirin: ücretsiz ve zaman damgalı',
  lead: 'WAV; el tipi kaydedicilerin, görüşme kaydedicilerin ve stüdyo çalışmalarının biçimidir. Kendi dosyanızı ekleyin ve sözleri zaman damgalı metin olarak okuyun; ücretsiz, girişsiz ve dosyayı önce sıkıştırmanıza gerek yok.',
  dropKind: 'audio',
  dropNoun: 'WAV dosyanızı',

  whyTitle: 'WAV dosyasını yazıya dökmek neden iyi bir fikir',
  why: [
    'WAV dosyası genellikle sesi sıkıştırmadan saklar; yani kaydedilirken hiçbir şey atılmamıştır. Bu da onu konuşma tanıma için iyi bir kaynak yapar: sıkıştırma bozulması yoktur ve her ünsüz hâlâ dosyadadır. Önce MP3’e çevirmenize gerek yok. TranscribeVid WAV’ı olduğu gibi okur.',
    'Bu kalitenin bedeli boyuttur. CD kalitesinde stereo, her dakika için yaklaşık 10 MB yer kaplar; yani bir saatlik ses yarım gigabayttan büyüktür. Bu sayfa o büyük dosyalar için yapıldı: sessizliği ve konuşma dışı seslerin çoğunu atlar (varsayılan olarak açık olan Sessizlikleri ve müziği atla seçeneği) ve size her satırında zaman damgası olan bir metin verir.',
  ],

  sections: [
    {
      title: 'WAV kayıtları nereden gelir',
      paragraphs: [
        'WAV, ses dünyasının varsayılanıdır; bu yüzden önünüzdeki dosya büyük olasılıkla şunlardan birinden geldi.',
      ],
      bullets: [
        {
          title: 'El tipi kaydediciler.',
          text: 'Röportaj, ders ve saha notları için kullanılan taşınabilir kaydediciler çoğu zaman WAV kaydeder, çünkü sesin her ayrıntısını korur.',
        },
        {
          title: 'Telefon görüşmesi ve toplantı kaydediciler.',
          text: 'Görüşme kaydı araçları ve konferans sistemleri çoğu zaman WAV olarak dışa aktarır. Bir görüşmenin her tarafı kendi kanalındaysa ikisi tek bir transkriptte birleştirilir.',
        },
        {
          title: 'Ses düzenleyiciler.',
          text: 'Audacity ve Adobe Audition gibi programlar, bir projeyi kaydettiğinizde veya dışa aktardığınızda WAV üretir; bu da onu yazıya dökme için doğal dosya yapar.',
        },
        {
          title: 'Dikte cihazları.',
          text: 'Bazı dijital dikte kaydediciler, doğrudan cihazdan kopyalayabileceğiniz WAV dosyaları yazar.',
        },
      ],
    },
    {
      title: 'Örnekleme hızı, bit derinliği ve kanallar',
      paragraphs: [
        'Bir WAV’ı eklemeden önce hazırlamanıza gerek yok. Olağan ayarların hepsi okunur: 8, 16 veya 24 bit ya da 32 bit kayan nokta, mono veya stereo, 44,1 veya 48 kHz. Ses mono’ya indirilir ve konuşma modeli için otomatik olarak dönüştürülür.',
        'Daha yüksek bir örnekleme hızı transkripti daha doğru yapmaz, çünkü konuşma ses spektrumunun alt kısmında yer alır. Mikrofonu nereye koyduğunuz, dosyadaki sayılardan çok daha önemlidir.',
        'Daha fazla seçenek altındaki Sesi iyileştir, uğultu ve cızırtıyı süzer, kısık sesli konuşmacıları dengeler. Varsayılan olarak açıktır ve bir fanın, yolun ya da klimanın yanında yapılmış bir kayıtta yerini hak eder.',
      ],
    },
  ],

  howTitle: 'WAV dosyası yazıya nasıl çevrilir',
  howToDescription:
    'WAV dosyasını ekleyin, konuşulan dili ve kaliteyi seçin, transkriptin hazırlanmasını bekleyin ve metin ya da altyazı olarak indirin.',
  steps: [
    {
      title: 'WAV’ı bırakın',
      text: '.wav dosyasını bu sayfanın üstündeki kutuya ekleyin: oraya bırakın ya da Dosya seç düğmesine basın. Hâlâ bir kaydedicideyse önce bilgisayarınıza kopyalayın. Kutu tek dosya alır; sonraki sayfada Başka bir dosya ekle ile daha fazla WAV sıraya alabilirsiniz ve her biri kendi transkriptini alır.',
    },
    {
      title: 'Dili ve kaliteyi seçin',
      text: 'Sonraki sayfada konuşulan dili seçin ya da tek dilli bir kayıt için Otomatik algıla seçeneğini açık bırakın. Standart, çoğu konuşma için uygundur. Sessiz veya zor bir kayıtta Yüksek doğruluk ve En yüksek doğruluk daha uzun sürer ve daha az hata yapar. Ardından Yazıya dök düğmesine basın.',
      browser: {
        text: 'Sonraki sayfada konuşulan dili seçin ya da tek dilli bir kayıt için Otomatik algıla seçeneğini açık bırakın. Standart, çoğu konuşma için uygundur. Sessiz veya zor bir kayıtta, cihazınız sunuyorsa Yüksek doğruluk veya En yüksek doğruluk seçeneğini deneyin: daha uzun sürerler, ilk seferde daha büyük bir indirme gerektirirler ve onları çalıştıramayan bir cihazda nedeniyle birlikte gri renkte gösterilirler. Ardından Yazıya dök düğmesine basın.',
      },
    },
    {
      title: 'Metnin belirmesini izleyin',
      text: 'Transkript satır satır, her satır kendi zamanıyla dolar. Kayıtla karşılaştırmak için herhangi bir satırdan oynatın.',
    },
    {
      title: 'Düzenleyin ve indirin',
      text: 'Yanlış kelimeleri düzeltin, ardından okumak için TXT’yi, altyazı için SRT veya VTT’yi, yazdırmak için PDF’yi indirin. Oturumunuzdan sonra hiçbir şey saklanmaz; ihtiyacınız olanı kaydedin.',
    },
  ],

  formatsTitle: 'WAV ve diğer ses biçimleri',
  formatsIntro: 'WAV kayıpsız biçimdir ve bu kutu şu ses türlerini de kabul eder.',
  uploadTitle: 'Ekleyebileceğiniz ses dosyaları',
  accepts: ['WAV', 'MP3', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'sözler düz metin olarak' },
    { name: 'SRT', use: 'zamanlanmış altyazı satırları' },
    { name: 'VTT', use: 'web oynatıcıları için zamanlanmış satırlar' },
    { name: 'PDF', use: 'yazdırılabilir bir kopya' },
    { name: 'Markdown', use: 'zamanlı notlar' },
    { name: 'JSON', use: 'kendi araçlarınız için veri' },
  ],

  tipsTitle: 'WAV kayıtlarını yazıya dökme ipuçları',
  tips: [
    {
      title: 'Olduğu gibi ekleyin.',
      text: 'Bir WAV’ı önce dönüştürmekten kazanılacak bir şey yoktur ve düşük bit hızlı bir MP3 ayrıntı kaybedebilir. Dosyayı kaydediciden çıktığı hâliyle ekleyin.',
    },
    {
      title: 'İki kanalı da dinleyin.',
      text: 'Stereo, mono’ya indirilir. Bir mikrofon diğerinden çok daha kısık veya gürültülüyse karışım bunu devralır; bu yüzden uzun bir işten önce oynatıcınızda iki kanalı da kontrol edin.',
    },
    {
      title: 'Uzun sessizlikleri kırpın.',
      text: 'Saha kayıtları çoğu zaman dakikalarca hiçbir şeyle başlar ve biter. Bunları bir düzenleyicide kesmek dosyayı küçültür ve transkript konuşmanın başladığı yerden başlar.',
    },
    {
      title: 'Çok uzun bir oturumu bölün.',
      text: 'Boyut veya süre sınırını aşan kayıtlar reddedilir; bu yüzden uzun bir oturumu doğal bir molada bölün ve parçaları yazıya dökün.',
      browser: {
        title: 'Birkaç saatlik kayıt birkaç saat sürer.',
        text: 'Site boyut veya süre sınırı koymaz, ancak birkaç saatlik bir kayıt çok zaman ve boş bellek gerektirir; eski bir tarayıcı çok uzun bir dosyayı reddedebilir. Telefonda onu doğal bir molada bölün ve parçaları yazıya dökün.',
      },
    },
    {
      title: 'Zor kelimeleri yazın.',
      text: 'İsimleri, yerleri ve teknik terimleri Daha fazla seçenek altındaki kelime ipucuna, görmek istediğiniz biçimde listeleyin.',
    },
  ],

  faqs: [
    {
      question: 'Telefon görüşmesinden kaydedilmiş bir WAV’ı yazıya dökebilir miyim?',
      answer:
        'Evet, görüşme WAV dosyası olarak kaydedilmişse ve iki kişi de duyuluyorsa. İki kanal tek bir transkriptte birleştirilir ve konuşmacı adları eklenmez; bu yüzden düzenlerken metne isimleri yazın. İnsanlara kayıt yaptığınızı söyleyin ve görüşme kaydetmeden önce bulunduğunuz yerdeki kuralları kontrol edin.',
    },
    {
      question: 'WAV, yazıya dökme için MP3’ten daha doğru mu?',
      answer:
        'Biraz yardımcı olabilir, çünkü sesten hiçbir şey çıkarılmamıştır. Ancak net bir MP3 genellikle iyi yazıya dökülür, gürültülü bir WAV ise dökülmez. Mikrofon, oda ve konuşmacının ne kadar yakın olduğu dosya biçiminden daha önemlidir.',
    },
    {
      question: 'WAV dosyam neden bu kadar büyük ve bunun önemi var mı?',
      answer:
        'WAV genellikle sesi sıkıştırmadan saklar: CD kalitesinde stereo için dakikada yaklaşık 10 MB. Büyük dosyaların okunması daha uzun sürer. {limits} Bir dosya sınırı aşıyorsa kırpın ya da sıkıştırılmış bir kopya (M4A veya MP3) dışa aktarıp onu kullanın.',
      browser: {
        answer:
          'WAV genellikle sesi sıkıştırmadan saklar: CD kalitesinde stereo için dakikada yaklaşık 10 MB. Büyük dosyaların okunması biraz daha uzun sürer, ancak sorun biçim değildir: denemelerde yaklaşık 2,5 GB’lık bir dosya güncel bir tarayıcıda sorunsuz okundu. İşi kendi cihazınız yaptığı için site boyut veya süre sınırı koymaz; bu yüzden çok uzun bir kayıt zaman ve boş bellek gerektirir ve eski bir tarayıcı çok uzun bir dosyayı reddedebilir. Telefonda önce bölün.',
      },
    },
    {
      question: '24 bit ve 48 kHz WAV dosyalarını işler mi?',
      answer:
        'Evet. 44,1 veya 48 kHz’de 16 ya da 24 bit gibi olağan WAV ayarları hiçbir hazırlık olmadan okunur ve ses konuşma modeli için otomatik olarak dönüştürülür.',
    },
    {
      question: 'Birkaç WAV dosyasını tek seferde yazıya dökebilir miyim?',
      answer:
        'Evet, sonraki sayfada. Bu sayfadaki kutu tek dosya alır; orada Başka bir dosya ekle ile gerisini sıraya alırsınız. Her dosya kendi transkriptini alır; bu yüzden bütün bir günün kayıtları art arda çalışabilir.',
    },
  ],

  links: [
    {
      label: 'MP3 yazıya çevirme',
      path: '/mp3-to-text',
      note: 'Çoğu ses kaydının sonunda ulaştığı sıkıştırılmış biçim için aynı ücretsiz yazıya dökme.',
    },
    {
      label: 'Röportaj yazıya dökme',
      path: '/interview-transcription',
      note: 'Röportaj kayıtlarını temiz, alıntılanabilir bir transkripte dönüştürme ipuçları.',
    },
    {
      label: 'Daha doğru bir transkript nasıl elde edilir',
      path: '/guides/accurate-transcripts',
      note: 'İlk sonuç yeterince iyi olmadığında kayıtta, dilde ve ayarlarda neyi değiştirmeli.',
    },
    {
      label: 'Toplantı kaydını yazıya çevirme',
      path: '/meeting-recording-to-text',
      note: 'Kayıt olarak saklanmış konferans görüşmeleri için.',
    },
  ],
};
