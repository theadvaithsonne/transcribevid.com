import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WebM yazıya çevirme',
  h1: 'WebM kaydını yazıya çevirin',
  lead: 'WebM, tarayıcıların ve ekran kaydedicilerin kaydettiği biçimdir. WebM videonuzu veya sesinizi ekleyin ve zaman damgalı bir transkript alın; ücretsiz, girişsiz ve önce dönüştürmeye gerek yok.',
  dropKind: 'video',
  dropNoun: 'WebM dosyanızı',

  whyTitle: 'WebM dosyasının içinde ne var',
  why: [
    'WebM, web dostu bir kapsayıcıdır. Genellikle Opus veya Vorbis sesle birlikte VP8, VP9 ya da AV1 video içerir. TranscribeVid yalnızca sesi okur; bu yüzden içinde hangi video codec’inin olduğu önemli değildir ve yalnızca ses içeren bir WebM de aynı şekilde çalışır.',
    'Çoğu WebM dosyasının kullandığı ses biçimi olan Opus, ses için tasarlanmıştır; bu da bu kayıtları transkript için iyi bir kaynak yapar. Sonuç, her satırında bir zaman bulunan, aramaya, alıntılamaya ya da altyazıya dönüştürmeye hazır bir metindir.',
  ],

  sections: [
    {
      title: 'WebM dosyaları nereden gelir',
      paragraphs: [
        'Çoğu WebM dosyasını tarayıcının kendisi üretir; bu yüzden biri çevrimiçi bir şey kaydettiğinde ortaya çıkar.',
      ],
      bullets: [
        {
          title: 'Ekran ve tarayıcı kaydediciler.',
          text: 'Birçok ekran kaydı eklentisi ve web kaydedici WebM kaydeder, çünkü bu, bir tarayıcının doğrudan kaydedebildiği biçimdir.',
        },
        {
          title: 'Çevrimiçi ses kaydediciler.',
          text: 'Mikrofonunuzu kaydeden bir web sitesi çoğu zaman size bir .webm ses dosyası verir. Video dosyası gibi görünebilir, ancak yalnızca ses içerir.',
        },
        {
          title: 'Kendi yaptığınız veya test ettiğiniz web uygulamaları.',
          text: 'Tarayıcının MediaRecorder özelliğiyle kayıt yapan sayfalar Chrome’da genellikle WebM üretir. Firefox video için aynısını yapar, ancak yalnızca ses kayıtları çoğu zaman Ogg olur; bu sayfa onu da okur.',
        },
      ],
    },
    {
      title: 'Kaydedilmiş WebM dosyalarının bir tuhaflığı',
      paragraphs: [
        'Tarayıcıda canlı kaydedilmiş bir WebM’in dosyasında çoğu zaman toplam süre yazılı olmaz. Bazı oynatıcılar bu durumda süreyi bilinmiyor olarak gösterir ya da ileri sarmaz; bu, dosyanın bozuk olduğu izlenimini verebilir. Ses sağlamdır ve transkript ondan her zamanki gibi oluşturulur.',
        'Bir kayıt gerçekten başarısız olursa nedeni genellikle daha basittir: mikrofon kapalıydı, bu yüzden içinde hiç konuşma yoktur. Başka bir neden aramadan önce dosyayı sesi açık oynatın.',
      ],
    },
  ],

  howTitle: 'WebM yazıya nasıl çevrilir',
  howToDescription:
    'WebM dosyasını ekleyin, konuşulan dili seçin, satırları kontrol edin ve transkripti metin ya da WebVTT altyazı olarak indirin.',
  steps: [
    {
      title: 'WebM’i ekleyin',
      text: '.webm dosyasını bu sayfanın üstündeki kutuya bırakın ya da Dosya seç düğmesine basın. Yalnızca ses içeren bir WebM de aynı şekilde girer. Birkaç kayıt için ilkini burada, diğerlerini sonraki sayfada Başka bir dosya ekle ile ekleyin.',
    },
    {
      title: 'Dili seçin',
      text: 'Sonraki sayfada konuşulan dili seçin ya da tek dilli bir kayıt için Otomatik algıla seçeneğini açık bırakın. Standart kalite, iyi bir mikrofondan gelen net konuşma için uygundur. Ardından Yazıya dök düğmesine basın.',
    },
    {
      title: 'Satırları kontrol edin',
      text: 'Metnin satır satır gelişini izleyin. Transkripti açın, herhangi bir zaman damgasından oynatın ve yanlış kelimeleri düzeltin.',
    },
    {
      title: 'Sonucu indirin',
      text: 'Okumak veya aramak için TXT alın. WebM web’e aittir; bu yüzden VTT onun için doğal altyazı dosyasıdır. SRT ve PDF de var.',
    },
  ],

  formatsTitle: 'WebM ve diğer video biçimleri',
  formatsIntro: 'WebM, bu kutunun kabul ettiği birçok video ve ses türünden biridir.',
  uploadTitle: 'Ekleyebileceğiniz dosyalar',
  accepts: ['WEBM', 'MP4', 'MKV', 'MOV', 'OGG', 'OPUS', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'TXT', use: 'konuşulan sözler düz metin olarak' },
    { name: 'VTT', use: 'aynı WebM için bir web sayfasında altyazı' },
    { name: 'SRT', use: 'oynatıcılar ve düzenleyiciler için altyazı' },
    { name: 'Markdown', use: 'zamanlı notlar' },
    { name: 'JSON', use: 'programlar için her satır ve zaman' },
    { name: 'PDF', use: 'yazdırılacak veya paylaşılacak bir transkript' },
  ],

  tipsTitle: 'WebM kayıtlarını yazıya dökme ipuçları',
  tips: [
    {
      title: 'Kayıttan önce mikrofonu açın.',
      text: 'Ekran kaydediciler, mikrofon veya sistem sesi seçeneğini işaretlemediğiniz sürece çoğu zaman yalnızca görüntüyü yakalar. Ses yoksa yazıya dökülecek bir şey de yoktur.',
    },
    {
      title: 'Tek bir ses kanalı bekleyin.',
      text: 'Bir toplantı sekmesini kendi mikrofonunuzla birlikte kaydettiyseniz herkes aynı kanalda toplanır. Konuşmacı etiketi yoktur; bu yüzden düzenlerken isimleri ekleyin.',
    },
    {
      title: 'Web için VTT kullanın.',
      text: 'Tarayıcının video öğesi, VTT altyazılarını track öğesi aracılığıyla okur. SRT’yi okumaz; bu yüzden kendi sayfanızdaki bir WebM için VTT’yi seçin.',
    },
    {
      title: 'Çok uzun kayıtları kesin.',
      text: 'Boyut veya süre sınırını aşan dosyalar reddedilir; bu yüzden uzun bir WebM’i önce parçalara bölün.',
      browser: {
        title: 'Uzun kayıtlar daha uzun sürer.',
        text: 'Site boyut veya süre sınırı koymaz. Uzun bir ekran kaydı yine de zaman ve boş bellek gerektirir ve eski bir tarayıcı çok uzun bir dosyayı reddedebilir; bu yüzden telefonda önce parçalara bölün.',
      },
    },
    {
      title: 'İsimleri ve komutları listeleyin.',
      text: 'Bir yazılım tanıtımı için ürün adlarını, komutları ve kısaltmaları kelime ipucuna koyun; böylece sizin yazdığınız gibi yazılırlar.',
    },
  ],

  faqs: [
    {
      question: 'WebM’imi neden telefonumda oynatamıyorum ve yine de yazıya dökebilir miyim?',
      answer:
        'Bazı eski telefonlar ve oynatıcılar WebM’i açamaz. Burada bunun önemi yok: TranscribeVid yalnızca sese ihtiyaç duyar; bu yüzden dosyayı yine ekleyebilir ve transkript alabilirsiniz.',
    },
    {
      question: 'Yalnızca ses içeren bir WebM’i yazıya dökebilir miyim?',
      answer:
        'Evet. Bazı kaydediciler yalnızca ses içeren dosyaları .webm uzantısıyla kaydeder. Bunlar diğer ses dosyaları gibi okunur.',
    },
    {
      question: 'WebM’imin VP8, VP9 veya AV1 kullanması önemli mi?',
      answer:
        'Hayır. Görüntü yok sayılır. Önemli olan, dosyanın Opus gibi yaygın bir biçimde bir ses kanalına sahip olmasıdır.',
    },
    {
      question: 'Altyazıları kendi web sayfamdaki bir WebM ile nasıl kullanırım?',
      answer:
        'VTT dosyasını indirin, videonun yanına kaydedin ve video öğesinin içindeki bir track öğesini ona yönlendirin. VTT altyazı oluşturucu sayfası dosyanın neye benzediğini ve tam kodu gösterir.',
    },
    {
      question: 'Ekran kaydım neden boş bir transkript verdi?',
      answer:
        'Büyük olasılıkla içinde konuşma yok: mikrofon kapalıydı ya da yalnızca sistem sesleri kaydedildi. İnsanların konuştuğunu duyuyor ama metin alamıyorsanız Daha fazla seçenek bölümünde Sesi iyileştir seçeneğini açık tutun ve daha yüksek bir kalite ayarı deneyin.',
    },
  ],

  links: [
    {
      label: 'VTT altyazı oluşturucu',
      path: '/vtt-subtitle-generator',
      note: 'Bir WebVTT dosyasının içeriği ve onu kendi sayfanızdaki bir videoya nasıl bağlayacağınız.',
    },
    {
      label: 'Videoya altyazı nasıl eklenir',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Kayıttan yayımlanmış altyazılara kadar tüm yol, adım adım.',
    },
    {
      label: 'Toplantı kaydını yazıya çevirme',
      path: '/meeting-recording-to-text',
      note: 'Kayıtlı görüşmeler ve web seminerleri için; kaydı toplantı aracından çıkarma yolu dahil.',
    },
    {
      label: 'MP4 yazıya çevirme',
      path: '/mp4-to-text',
      note: 'En yaygın video biçimi olan MP4 için aynı hizmet.',
    },
  ],
};
