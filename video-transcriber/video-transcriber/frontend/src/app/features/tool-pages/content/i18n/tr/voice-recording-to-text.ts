import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Ses kaydını yazıya dökme',
  h1: 'Ses kaydını doğrudan tarayıcınızdan yazıya dökün',
  lead: 'Sayfada mikrofonunuzla kayıt yapın ya da telefonunuzdan bir sesli not ekleyin; sözlerinizi sonradan metin olarak okuyun. Ücretsiz, girişsiz, 50’den fazla dilde.',
  dropKind: 'audio',
  dropNoun: 'Ses kaydınızı',
  record: true,

  whyTitle: 'Bunun ne işe yaradığı ve ne işe yaramadığı',
  why: [
    'Konuşmak yazmaktan hızlıdır; bu yüzden birçok kişi fikirleri, toplantı notlarını, ders maddelerini ve ilk taslakları sesli kayıt olarak alır, sonra metne çevirir. Bu sayfa tam bunun için hazırlandı: kaydedin ya da ekleyin, sonra metni okuyun, düzenleyin ve indirin.',
    'Canlı dikte değildir. Kaydedersiniz, durdurursunuz ve transkript tüm kayıttan oluşturulur; bu yüzden siz hâlâ konuşurken sözcükler görünmez. Karşılığında her satır bir zaman damgası alır.',
  ],

  howTitle: 'Ses kaydı yazıya nasıl dökülür',
  howToDescription:
    'Mikrofonunuzla kayıt yapın ya da bir sesli not ekleyin, dili seçin, transkriptin hazırlanmasını bekleyin ve indirin.',
  steps: [
    {
      title: 'Kayıt yapın veya dosya seçin',
      text: 'Bir sesli notu bu sayfanın üstündeki kutuya bırakın (iPhone Sesli Notlar kayıtları M4A dosyalarıdır) ya da Dosya seç düğmesine basın. Bunun yerine kayıt yapmak için kutunun altındaki Mikrofonunuzla kayıt yapın bağlantısına, ardından Mikrofondan kayıt düğmesine basın ve tarayıcınız sorduğunda erişime izin verin.',
    },
    {
      title: 'Durdurun ve dili seçin',
      text: 'Kayıt yapıyorsanız işiniz bitince Kaydı durdur düğmesine basın. Ardından konuşulan dili seçin ya da otomatik algılamayı açık bırakın.',
    },
    {
      title: 'Transkripti bekleyin',
      text: 'Metin satır satır, bir ilerleme çubuğu ve kalan sürenin tahminiyle birlikte görünür.',
    },
    {
      title: 'Düzenleyin ve indirin',
      text: 'İstediğiniz kelimeyi düzeltin, ardından TXT, Markdown veya PDF olarak indirin. Transkriptler yalnızca oturumunuzda bulunur; bu yüzden ihtiyacınız olanı kaydedin.',
    },
  ],

  formatsTitle: 'Sesli not biçimleri ve indirmeler',
  formatsIntro:
    'Telefon ve masaüstü ses kaydediciler farklı biçimlerde kaydeder. Bunların hepsi çalışır.',
  uploadTitle: 'Ekleyebileceğiniz kayıt dosyaları',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'OGG', 'OPUS', 'FLAC', '3GP'],
  downloads: [
    { name: 'TXT', use: 'sözleriniz düz metin olarak' },
    { name: 'Markdown', use: 'zamanlı notlar' },
    { name: 'PDF', use: 'notun yazdırılabilir bir kopyası' },
    { name: 'SRT', use: 'kayıt bir videoyla birlikteyse zamanlanmış satırlar' },
    { name: 'VTT', use: 'web oynatıcıları için zamanlanmış satırlar' },
    { name: 'JSON', use: 'programlar için yapılandırılmış satırlar' },
  ],

  tipsTitle: 'Ses kayıtları için ipuçları',
  tips: [
    {
      title: 'Mikrofonu deneyin.',
      text: 'Uzun bir oturumdan önce on saniye kaydedin ve geri dinleyin.',
    },
    {
      title: 'Sabit bir hızla konuşun.',
      text: 'Sessiz bir odada mikrofona yakın konuşun. Fanlar, klavyeler ve rüzgâr, sizin sesiniz kadar net yakalanır.',
    },
    {
      title: 'İsimleri ve sayıları net söyleyin.',
      text: 'Alışılmadık kelimeleri Daha fazla seçenek bölümündeki kelime ipucuna ekleyin; doğru çıkma olasılıkları çok daha yüksek olur.',
    },
    {
      title: 'Mikrofon düğmesi yok mu?',
      text: 'Bazı tarayıcılar kaydı yalnızca güvenli sayfalarda ya da siz izin verdikten sonra yapar. Telefonunuzun ses kaydedici uygulamasıyla kayıt yapın ve dosyayı ekleyin.',
    },
    {
      title: 'Başkalarını düşünün.',
      text: 'İnsanlara kayıt yaptığınızı söyleyin ve önce izinlerini alın.',
    },
  ],

  faqs: [
    {
      question: 'Bu canlı dikte mi?',
      answer:
        'Hayır. Önce kayıt yaparsınız, transkript sonradan oluşturulur. Siz konuşurken görünen sözcükler için bunun yerine telefonunuzun veya bilgisayarınızın dikte özelliğini kullanın.',
    },
    {
      question: 'Telefonumda kullanabilir miyim?',
      answer:
        'Evet. Sayfayı telefonunuzun tarayıcısında açın ve sayfada kayıt yapın ya da daha önce kaydettiğiniz bir sesli not dosyasını ekleyin.',
    },
    {
      question: 'Bir kayıt ne kadar uzun olabilir?',
      answer:
        '{limits} Daha uzun dosyalar işlenmeden önce reddedilir, bu yüzden önce bölün. Günlük veya aylık kota yoktur.',
      browser: {
        answer:
          'Bir sınır koymuyoruz: kayıt tarayıcınızda, kendi cihazınızda yazıya dökülür; bu yüzden uzun bir kayıt yalnızca daha uzun sürer. Sayfa, yavaş bir cihazda sizi uyarır. Günlük veya aylık kota yoktur.',
      },
    },
    {
      question: 'Konuşmacıları birbirinden ayırır mı?',
      answer:
        'Hayır. Konuşmacı adları veya etiketleri eklenmez. Her satırda bir zaman damgası vardır ve düzenlerken metne isimleri kendiniz yazabilirsiniz.',
    },
    {
      question: 'Ses kaydım saklanıyor mu?',
      answer:
        'Yalnızca oturumunuz boyunca. Oturum bitince, bir süre işlem yapılmayınca ya da Verilerimi şimdi sil düğmesine bastığınızda silinir. Hesap yoktur.',
      browser: {
        answer:
          'Yalnızca bu tarayıcıda: kaydınız cihazınızdan hiç çıkmaz. Bir süre işlem yapılmazsa ya da Verilerimi şimdi sil düğmesine bastığınızda silinir. Hesap yoktur.',
      },
    },
  ],
};
