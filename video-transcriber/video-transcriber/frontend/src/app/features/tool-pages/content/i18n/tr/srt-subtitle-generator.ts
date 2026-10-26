import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'SRT altyazı oluşturucu',
  h1: 'Videodan veya sesten SRT altyazı oluşturun',
  lead: 'Bir video ekleyin ve her satırı konuşmaya göre zamanlanmış, kullanıma hazır bir .srt dosyası indirin. Ücretsiz, girişsiz; dışa aktarmadan önce metni düzeltebilirsiniz.',
  dropKind: 'video',
  dropNoun: 'Videonuzu',

  whyTitle: 'Bir SRT dosyasında neler bulunur',
  why: [
    'SRT dosyası düz metindir. Her biri bir başlangıç zamanı, bir bitiş zamanı ve ekranda gösterilecek sözcüklerden oluşan numaralı bölümleri listeler. Çoğu video oynatıcı, düzenleyici ve video platformu bir tanesini yükleyebilir; bu da onu başlamak için en güvenli altyazı biçimi yapar.',
    'Altyazılar; sağır veya işitme güçlüğü çeken izleyicilere, sessiz izleyen kişilere ve ikinci bir dili yazıyla daha iyi takip eden herkese yardımcı olur. Ayrıca videonuzdaki konuşmayı aranabilir ve alıntılanabilir kılar.',
  ],

  howTitle: 'SRT dosyası nasıl oluşturulur',
  howToDescription:
    'Bir video ekleyin, dili seçin, satırları kontrol edin ve altyazıyı SRT veya VTT dosyası olarak indirin.',
  steps: [
    {
      title: 'Videoyu yükleyin',
      text: 'Videonuzu bu sayfanın üstündeki kutuya bırakın ya da Dosya seç düğmesine basın. Yalnızca zamanlanmış metne ihtiyacınız varsa bir ses dosyası da olur.',
    },
    {
      title: 'Dili seçin',
      text: 'Konuşulan dili seçin. Kelime düzeyinde zamanlama varsayılan olarak açıktır; bu, altyazı zamanlamasını daha hassas yapar.',
    },
    {
      title: 'Satırları kontrol edin',
      text: 'Transkripti açın, herhangi bir zaman damgasından oynatın ve yanlış kelimeleri düzeltin. İstemediğiniz satırları silin.',
    },
    {
      title: 'SRT veya VTT indirin',
      text: 'Çoğu oynatıcı ve düzenleyici için SRT’yi, web sayfaları için VTT’yi seçin. İkisi de yaptığınız düzenlemeleri içerir.',
    },
  ],

  formatsTitle: 'Altyazı biçimleri ve desteklenen dosyalar',
  formatsIntro:
    'Herhangi bir video veya ses dosyası ekleyin ve altyazıyı SRT ya da VTT olarak indirin. Bir SRT dosyasının içi şöyle görünür:',
  uploadTitle: 'Ekleyebileceğiniz dosyalar',
  accepts: ['MP4', 'MKV', 'MOV', 'WEBM', 'AVI', 'MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'SRT', use: 'zamanlı numaralı bölümler, en geniş destek' },
    { name: 'VTT', use: 'HTML5 video ve web oynatıcıları için WebVTT' },
    { name: 'TXT', use: 'aynı sözcükler, zaman olmadan' },
    { name: 'Markdown', use: 'zaman damgalı metin' },
    { name: 'JSON', use: 'programlar için her satır ve zaman' },
    { name: 'PDF', use: 'yazdırılabilir bir metin' },
  ],
  exampleLabel: 'Örnek bir SRT dosyası',
  example: `1
00:00:01,000 --> 00:00:04,200
Kanala tekrar hoş geldiniz.

2
00:00:04,500 --> 00:00:07,800
Bugün altyazıların nasıl çalıştığına bakıyoruz.`,

  tipsTitle: 'Daha iyi altyazılar için ipuçları',
  tips: [
    {
      title: 'Satırları kısa tutun.',
      text: 'Yaygın bir kural, yaklaşık 42 karakterlik iki satırdır. Satırlar konuşmayı izler; bu yüzden çok uzun olanların bir altyazı düzenleyicide bölünmesi gerekebilir.',
    },
    {
      title: 'Yayımlamadan önce izleyin.',
      text: 'Videoyu altyazılar açıkken oynatın. Otomatik altyazılar, özellikle isimler, sayılar ve terimler için insan kontrolü gerektirir.',
    },
    {
      title: 'Kelime ipucu kullanın.',
      text: 'İsimleri ve teknik terimleri Daha fazla seçenek bölümünde listeleyin; böylece istediğiniz gibi yazılırlar.',
    },
    {
      title: 'Doğru biçimi seçin.',
      text: 'Oynatıcılar, düzenleyiciler ve çoğu yükleme formu için SRT. HTML5 video etiketi ve web oynatıcıları için VTT.',
    },
    {
      title: 'İngilizce altyazı mı gerekiyor?',
      text: 'Daha fazla seçenek bölümünde Çıktı’yı İngilizceye çevir olarak ayarlayın. Çeviri otomatiktir; bu yüzden yayımlamadan önce baştan sona okuyun.',
    },
  ],

  faqs: [
    {
      question: 'SRT dosyası nedir?',
      answer:
        'SubRip (.srt), düz metin bir altyazı biçimidir. Her bölümün bir numarası, bir başlangıç ve bitiş zamanı ve gösterilecek metni vardır. Herhangi bir metin düzenleyici onu açabilir.',
    },
    {
      question: 'SRT mi VTT mi seçmeliyim?',
      answer:
        'Video oynatıcılar, düzenleyiciler ve çoğu yükleme formu için SRT kullanın. Bir web sayfasına HTML5 video öğesiyle altyazı ekliyorsanız VTT (WebVTT) kullanın. TranscribeVid ikisini de aynı transkriptten dışa aktarır.',
    },
    {
      question: 'Altyazıları videoma gömüyor mu?',
      answer:
        'Hayır. Ayrı bir altyazı dosyası alırsınız ve video değişmez. Altyazıyı görüntünün içine gömmek için bir video düzenleyici gerekir.',
    },
    {
      question: 'Zamanlama ne kadar doğru?',
      answer:
        'Zamanlama konuşmayı izler ve genellikle yakındır, ancak kare düzeyinde kusursuz değildir. İlk ve son satırları kontrol edin; tam eşzamanlama gerekiyorsa bir altyazı düzenleyicide ayarlayın.',
    },
    {
      question: 'Başka bir dilde altyazı yapabilir miyim?',
      answer:
        'Konuşulan dilde yazıya dökebilir (50’den fazlası desteklenir) ya da konuşmayı İngilizceye çevirebilirsiniz. Başka dillere çeviri sunulmaz.',
    },
  ],
};
