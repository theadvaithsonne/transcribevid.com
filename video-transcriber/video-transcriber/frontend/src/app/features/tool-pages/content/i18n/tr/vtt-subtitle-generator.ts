import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'VTT altyazı oluşturucu',
  h1: 'Videodan WebVTT (.vtt) altyazı dosyası oluşturun',
  lead: 'Bir video veya ses dosyası ekleyin ve konuşmaya göre zamanlanmış bir WebVTT altyazı dosyası indirin. Ücretsiz, girişsiz; dışa aktarmadan önce satırları düzeltebilirsiniz. HTML5 video öğesiyle ya da herhangi bir web oynatıcısıyla kullanın.',
  dropKind: 'video',
  dropNoun: 'Videonuzu',

  whyTitle: 'WebVTT nedir ve web neden onu kullanır',
  why: [
    'WebVTT (.vtt), webin altyazı biçimidir. Tarayıcıların yerel olarak anladığı düz metin bir dosyadır: bir videonun track öğesini bir .vtt dosyasına yönlendirin; altyazılar eklenti ve betik olmadan görünür.',
    'SRT’ye çok benzer görünür; önemli birkaç farkı vardır. Bir VTT dosyası WEBVTT sözcüğüyle başlar, milisaniyelerden önce virgül yerine nokta kullanır ve numaralı bölümlere ihtiyaç duymaz. Çoğu web oynatıcısı onu okur. Hangi biçime ihtiyacınız olduğundan emin değilseniz SRT ve VTT rehberi seçimi açıklar.',
  ],

  sections: [
    {
      title: 'VTT dosyasını web sayfanızda kullanma',
      paragraphs: [
        '.vtt dosyasını videonuzun yanına kaydedin, ardından video öğesinin içine bir track öğesi ekleyin; örneğin: <track kind="subtitles" src="captions.vtt" srclang="en" label="English" default>. Öznitelikler şunları yapar.',
      ],
      bullets: [
        {
          title: 'kind.',
          text: 'Söylenen sözler için subtitles kullanın. Dosya müzik veya kahkaha gibi diğer sesleri de betimliyorsa captions kullanın.',
        },
        {
          title: 'srclang.',
          text: 'Dosyanın dili kısa bir kod olarak; örneğin İngilizce için en, İspanyolca için es. Sahip olduğunuz her dil için bir track öğesi ekleyin.',
        },
        {
          title: 'label ve default.',
          text: 'label, oynatıcının altyazı menüsünde görünen addır. default, sayfa yüklendiğinde o izi açar.',
        },
      ],
    },
    {
      title: 'Altyazılar neden görünmez: olağan nedenler',
      paragraphs: [
        '.vtt dosyasını sayfayla aynı sitede tutun. Başka bir alan adındaki dosya, sunucusundan doğru çapraz kaynak başlıklarını gerektirir ve video öğesinin crossorigin özniteliği olmalıdır; aksi hâlde tarayıcı onu sessizce yok sayar. Ayrıca dosyanın ilk satırının WEBVTT olduğunu ve altyazıların oynatıcı denetimlerinden açıldığını kontrol edin.',
      ],
    },
    {
      title: 'Bu oluşturucunun yaptıkları ve yapmadıkları',
      paragraphs: [
        'Videonuzdaki konuşmayı zamanlı metne dönüştürür. Satırlar cümle sonlarında ve duraklamalarda, yaklaşık 42 karakterlik, en fazla iki satırlık biçimde kesilir ve dosya yalnızca zamanlı metin içerir. Başka dillere çevirmez (Daha fazla seçenek altındaki Çıktı ile İngilizce hariç), konuşmacı adı eklemez, biçimlendirme veya bölüm işaretçisi oluşturmaz ve altyazıyı görüntünün içine gömmez. WebVTT’nin kendisi biçimlendirmeyi ve bölümleri destekler; bunları bir metin düzenleyicide elle ekleyebilirsiniz.',
      ],
    },
  ],

  howTitle: 'VTT altyazı dosyası nasıl oluşturulur',
  howToDescription:
    'Bir video ekleyin, dili seçin, satırları kontrol edin ve altyazıyı WebVTT dosyası olarak indirin.',
  steps: [
    {
      title: 'Videonuzu ekleyin',
      text: 'Bu sayfanın üstündeki kutuya bir video koyun: oraya bırakın ya da Dosya seç düğmesine basın. Yalnızca zamanlı metne ihtiyacınız varsa yalnızca ses içeren bir dosya da işe yarar. Sonraki sayfada Başka bir dosya ekle daha fazlasını getirir.',
    },
    {
      title: 'Dili seçin',
      text: 'Sonraki sayfada konuşulan dili seçin ya da Otomatik algıla seçeneğini açık bırakın. Daha fazla seçenek bölümünde Kelime düzeyinde zamanlama’yı açık tutun: her satırın başlangıcı ve bitişi o zaman kelimeleri izler. Ardından Yazıya dök düğmesine basın.',
    },
    {
      title: 'Satırları kontrol edin',
      text: 'Transkripti baştan sona okuyun, kontrol etmek için bir zaman damgasından oynatın ve yanlış kelimeleri düzeltin. Altyazılarda istemediğiniz satırları silin.',
    },
    {
      title: 'VTT indirin',
      text: 'İndirme seçeneklerinden VTT’yi seçin. Düzenlemeleriniz dahildir. Bir oynatıcı gerektiriyorsa SRT aynı transkriptten edinilebilir.',
    },
  ],

  formatsTitle: 'VTT biçimi ve desteklenen dosyalar',
  formatsIntro:
    'Herhangi bir video veya ses dosyası ekleyin ve WebVTT indirin. Bir VTT dosyasının içi şöyle görünür:',
  uploadTitle: 'Ekleyebileceğiniz dosyalar',
  accepts: ['MP4', 'WEBM', 'MOV', 'MKV', 'M4V', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'VTT', use: 'HTML5 video öğesi ve web oynatıcıları için WebVTT' },
    { name: 'SRT', use: 'çoğu oynatıcı ve düzenleyici için numaralı bölümler' },
    { name: 'TXT', use: 'aynı sözcükler, zaman olmadan' },
    { name: 'Markdown', use: 'zaman damgalı metin' },
    { name: 'JSON', use: 'programlar için her satır ve zaman' },
    { name: 'PDF', use: 'yazdırılabilir bir metin' },
  ],
  exampleLabel: 'Örnek bir WebVTT dosyası',
  example: `WEBVTT

00:00:00.800 --> 00:00:03.600
Herkese günaydın, hoş geldiniz.

00:00:04.000 --> 00:00:07.300
Bu videoda projeyi sıfırdan kuruyoruz.

00:00:07.700 --> 00:00:10.900
Klasör yapısıyla başlayalım.`,

  tipsTitle: 'WebVTT dosyaları için ipuçları',
  tips: [
    {
      title: 'Gerçek bir tarayıcıda deneyin.',
      text: 'Sayfanızı açın, oynat’a basın ve video denetimlerinden altyazıları açın. Yayımlamadan önce bunu birden fazla tarayıcıda yapın.',
    },
    {
      title: 'Doğru dil kodunu kullanın.',
      text: 'srclang’ı en, es veya hi gibi geçerli bir koda ayarlayın. Yanlış bir kod, oynatıcının izi yanlış adlandırmasına veya seçmesine yol açabilir.',
    },
    {
      title: 'Satırları hızında okuyun.',
      text: 'Videoyu sesi kapalı ve altyazılar açık oynatın ve her satırın okunacak kadar uzun süre ekranda kaldığını kontrol edin.',
    },
    {
      title: 'İsimleri istediğiniz gibi yazın.',
      text: 'Marka adlarını ve teknik terimleri başlamadan önce Daha fazla seçenek bölümündeki kelime ipucuna koyun; böylece her satırda doğru çıkarlar.',
    },
  ],

  faqs: [
    {
      question: 'VTT dosyası SRT dosyasından nasıl farklıdır?',
      answer:
        'Bir VTT dosyası WEBVTT satırıyla başlar, SRT’nin virgül kullandığı yerde (00:00:01,000) zamanları nokta ile (00:00:01.000) yazar ve bölüm numaralarına ihtiyaç duymaz. Tarayıcılar VTT’yi video öğesinde okur; SRT ise onu destekleyen bir oynatıcı ya da betik gerektirir.',
    },
    {
      question: 'HTML videosuna VTT dosyasını nasıl eklerim?',
      answer:
        '.vtt dosyasını videonun yanına kaydedin ve video öğesinin içine kind’ı subtitles, src’yi dosyaya, srclang’ı dil koduna ayarlanmış ve menü için bir label’ı olan bir track öğesi ekleyin.',
    },
    {
      question: 'Hangi oynatıcılar VTT dosyalarını okur?',
      answer:
        'Tüm büyük tarayıcılar VTT’yi video öğesi aracılığıyla okur ve çoğu web video oynatıcısı da okur. Bazı masaüstü oynatıcılar ve düzenleyiciler SRT’yi tercih eder. Bunlar için aynı transkriptten SRT indirin.',
    },
    {
      question: 'VTT dosyası bölümler veya biçimlendirme içerebilir mi?',
      answer:
        'TranscribeVid’in yaptığı dosya yalnızca zamanlı metin içerir. WebVTT’nin kendisi biçimlendirmeyi ve bölümleri destekler; bunları bir metin düzenleyicide elle ekleyebilirsiniz.',
    },
    {
      question: 'VTT dosyam neden oynatıcıda görünmüyor?',
      answer:
        'Yaygın nedenler; WEBVTT olmayan bir ilk satır, doğru çapraz kaynak başlıkları olmayan başka bir alan adındaki dosya, yanlış bir srclang veya kind ya da oynatıcıda kapalı altyazılardır. Dosyayı bir metin düzenleyicide açın ve ilk satırı kontrol edin.',
    },
  ],

  links: [
    {
      label: 'SRT altyazı oluşturucu',
      path: '/srt-subtitle-generator',
      note: 'Aynı transkript, uygulamalı bir örnekle numaralı SRT dosyası olarak.',
    },
    {
      label: 'SRT ve VTT farkı: hangi altyazı biçimi kullanılmalı',
      path: '/guides/srt-vs-vtt',
      note: 'İki biçimin yan yana karşılaştırması ve her birinin nerede çalıştığı.',
    },
    {
      label: 'Videoya altyazı nasıl eklenir',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Transkriptten yayımlanmış altyazıya; web ve diğer oynatıcılar için.',
    },
    {
      label: 'WebM yazıya çevirme',
      path: '/webm-to-text',
      note: 'Ekran ve tarayıcı kayıtları için; bir VTT dosyasına en uygun biçim.',
    },
  ],
};
