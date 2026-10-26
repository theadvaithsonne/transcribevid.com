import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'M4A yazıya çevirme',
  h1: 'M4A sesli notunu yazıya çevirin',
  lead: 'M4A; iPhone ve Mac’teki Sesli Notlar’ın, birçok Android kaydedicinin ve Apple uygulamalarının kaydettiği biçimdir. Dosyayı ekleyin ve zaman damgalı bir transkript alın; ücretsiz, girişsiz ve MP3’e dönüştürmeye gerek yok.',
  dropKind: 'audio',
  dropNoun: 'M4A dosyanızı',

  whyTitle: 'M4A dosyaları neden iyi yazıya dökülür',
  why: [
    'M4A, yalnızca sesten oluşan bir MPEG-4 dosyasıdır. Genellikle AAC ses içerir; bu sıkıştırılmıştır ancak konuşma için fazlasıyla yeterlidir, bu yüzden M4A dosyaları küçüktür ve iyi yazıya dökülür. TranscribeVid onları doğrudan okur. Önce dönüştürülecek bir şey yoktur.',
    'Sesli notlar yolda yapılır; bu yüzden çoğu zaman kısık, yankılı ya da telefon cepteyken kaydedilmiştir. Bu sayfadaki kalite seçenekleri ve temizleme ayarları tam olarak bu tür kayıtlar için vardır.',
  ],

  sections: [
    {
      title: 'Sesli notu telefonunuzdan almak',
      paragraphs: [
        'Menü adları iOS, macOS ve Android sürümleri arasında değişir; bu yüzden bunları bir rehber olarak görün. Telefonun kendisindeyseniz Dosya seç düğmesine basın ve kaydı Dosyalar’dan ya da kayıtlar klasörünüzden seçin. Bilgisayara gerek yok.',
      ],
      bullets: [
        {
          title: 'iPhone.',
          text: 'Sesli Notlar’da kaydı açın, Diğer düğmesine (üç nokta) dokunun ve Paylaş’ı seçin. Dosyalar’a kaydedin ya da AirDrop veya e-postayla kendinize gönderin, sonra buraya ekleyin.',
        },
        {
          title: 'Mac.',
          text: 'Sesli Notlar penceresinden bir kaydı Masaüstü’ne sürükleyin. .m4a dosyası olarak gelir ve eklemeye hazırdır.',
        },
        {
          title: 'Android.',
          text: 'Birçok kaydedici uygulama M4A dosyalarını Kayıtlar veya Ses Kaydedici klasörüne kaydeder. Klasör adı uygulamaya bağlıdır ve dosya seçici onu açabilir.',
        },
      ],
    },
    {
      title: 'Kayıpsız ve sıkıştırılmış sesli notlar',
      paragraphs: [
        'iPhone’daki Sesli Notlar, kayıtları Sıkıştırılmış veya Kayıpsız olarak kaydedebilir. Kayıpsız dosyalar çok daha büyüktür, yine .m4a ile biter ve genellikle Apple Lossless codec’ini kullanır. Konuşmanın buna ihtiyacı yoktur: Sıkıştırılmış bir not, boyutunun çok küçük bir kısmıyla aynı transkripti verir.',
      ],
      browser: {
        paragraphs: [
          'iPhone’daki Sesli Notlar, kayıtları Sıkıştırılmış veya Kayıpsız olarak kaydedebilir. Kayıpsız dosyalar çok daha büyüktür, yine .m4a ile biter ve genellikle her tarayıcının tek başına okuyamadığı Apple Lossless codec’ini kullanır. Sizinki okuyamıyorsa sayfa, cihazınızda çalışan küçük bir dönüştürücü (yaklaşık 9 MB) yüklemeyi önerebilir. Konuşmanın Kayıpsız’a ihtiyacı yoktur: Sıkıştırılmış bir not, boyutunun çok küçük bir kısmıyla aynı transkripti verir.',
        ],
      },
    },
  ],

  howTitle: 'M4A yazıya nasıl çevrilir',
  howToDescription:
    'M4A dosyasını ekleyin, konuşulan dili seçin, transkriptin hazırlanmasını bekleyin ve metin olarak indirin.',
  steps: [
    {
      title: 'M4A’yı ekleyin',
      text: '.m4a notunu bu sayfanın üstündeki kutuya bırakın ya da Dosya seç düğmesine basın ve telefondaysanız Dosyalar’dan ya da kayıtlar klasörünüzden seçin. Bu kutuya yalnızca bir not girer; sonraki sayfaya geçince Başka bir dosya ekle gerisini getirir.',
    },
    {
      title: 'Dili seçin',
      text: 'Sonraki sayfada konuşulan dili seçin. Kısa bir not, Otomatik algıla seçeneğine çok az dayanak verir; bu yüzden dili belirtmek daha güvenilirdir. Standart kalite çoğu not için uygundur. Ardından Yazıya dök düğmesine basın.',
    },
    {
      title: 'Transkripti bekleyin',
      text: 'Satırlar bir ilerleme çubuğu ve kalan sürenin tahminiyle tek tek görünür. Ne söylendiğini duymak için herhangi bir satırdan oynatın.',
    },
    {
      title: 'Düzeltin ve kaydedin',
      text: 'Yanlış kelimeleri düzeltin, ardından notlar için TXT, Markdown veya PDF’yi, not bir videoyla birlikteyse SRT veya VTT’yi indirin. Transkript yalnızca oturumunuz boyunca yaşar; bu yüzden sayfayı kapatmadan önce indirin.',
    },
  ],

  formatsTitle: 'M4A ve diğer ses biçimleri',
  formatsIntro:
    'Telefon ve masaüstü kaydediciler farklı biçimlerde kaydeder. Bu kutu bunların hepsini kabul eder.',
  uploadTitle: 'Ekleyebileceğiniz ses dosyaları',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'sözleriniz düz metin olarak' },
    { name: 'Markdown', use: 'zamanlı notlar' },
    { name: 'PDF', use: 'notun yazdırılabilir bir kopyası' },
    { name: 'SRT', use: 'nota eşlik eden bir video için zamanlanmış satırlar' },
    { name: 'VTT', use: 'web oynatıcıları için zamanlanmış satırlar' },
    { name: 'JSON', use: 'programlar için yapılandırılmış satırlar' },
  ],

  tipsTitle: 'Sesli notları yazıya dökme ipuçları',
  tips: [
    {
      title: 'Telefonu yakın tutun.',
      text: 'Telefon cepteyken ya da masanın karşısından kaydedilmiş bir not, her tanıyıcı için zordur. Telefonu ağzınızdan bir el genişliği uzakta tutun ve içine değil, üzerinden konuşun.',
    },
    {
      title: 'Paylaşmadan önce kırpın.',
      text: 'Çoğu sesli not uygulaması kaydın başını ve sonunu kesmenize izin verir. Her iki uçtaki uzun bir duraklamayı kaldırmak bekleme süresinden kazandırır.',
    },
    {
      title: 'Dili belirtin.',
      text: 'On ya da yirmi saniyelik bir notta konuşulan dili seçmek, özellikle aksanlı konuşmalarda veya dillerin karıştığı durumlarda otomatik algılamadan daha iyidir.',
    },
    {
      title: 'Zor isimleri verin.',
      text: 'Alışılmadık isimleri Daha fazla seçenek bölümündeki kelime ipucuna ekleyin; doğru çıkma olasılıkları çok daha yüksek olur.',
    },
  ],

  faqs: [
    {
      question: 'Bir iPhone Sesli Notu’nu dönüştürmeden yazıya dökebilir miyim?',
      answer:
        'Evet. Sesli Notlar M4A dosyalarıdır ve TranscribeVid M4A’yı doğrudan okur. Notu Dosyalar’a ya da bilgisayarınıza paylaşın, sonra buraya ekleyin. Önce MP3’e dönüştürmeyin.',
    },
    {
      question: 'M4A dosyası MP4 ile aynı şey mi?',
      answer:
        'Yakın akrabalardır. İkisi de MPEG-4 kapsayıcısını kullanır; M4A yalnızca ses içerir, MP4 ise genellikle video da taşır. TranscribeVid sesi ikisinden de okur.',
    },
    {
      question: 'M4A transkriptim neden boş veya çok kısa?',
      answer:
        'Not sessiz, çok kısık ya da çoğunlukla arka plan gürültüsü olabilir. Önce geri oynatın. Zayıfsa Daha fazla seçenek bölümünde Sesi iyileştir seçeneğini açık tutun ve dosyanın paylaşırken kesilmediğini kontrol edin.',
    },
    {
      question: 'Telefonumda kaydedilmiş uzun bir toplantıyı yazıya dökebilir miyim?',
      answer:
        'Evet. M4A dosyaları küçüktür; bu yüzden uzun bir kaydı eklemek kolaydır. {limits} Günlük veya aylık kota yoktur.',
      browser: {
        answer:
          'Evet. M4A dosyaları küçüktür; bu yüzden uzun bir kaydı eklemek kolaydır. İşi kendi cihazınız yaptığı için site boyut veya süre sınırı koymaz; bu yüzden çok uzun bir not yalnızca daha uzun sürer ve daha yavaş bir cihazda sayfa bunu başlamadan önce söyler. Eski bir tarayıcı çok uzun bir dosyayı reddedebilir.',
      },
    },
    {
      question: 'Hintçe veya İspanyolca bir sesli notu yazıya dökebilir miyim?',
      answer:
        'Evet. 50’den fazla dil arasından konuşulan dili seçin ya da tek dilli bir not için Otomatik algıla seçeneğini açık bırakın. Hintçe için Dil’in yanındaki Transkript stili, Latin harflerini (Hinglish) ya da özgün Devanagari yazısını seçmenizi sağlar.',
    },
  ],

  links: [
    {
      label: 'Ses kaydını yazıya dökme',
      path: '/voice-recording-to-text',
      note: 'Dosya eklemek yerine sayfada mikrofonunuzla kayıt yapın.',
    },
    {
      label: 'MP3 yazıya çevirme',
      path: '/mp3-to-text',
      note: 'Diğer yaygın ses biçimi olan MP3 dosyaları için aynı ücretsiz yazıya dökme.',
    },
    {
      label: 'Dersi yazıya çevirme',
      path: '/lecture-to-text',
      note: 'Kayıtlı bir dersi aranabilir, çalışılabilir notlara dönüştürün.',
    },
    {
      label: 'Daha doğru bir transkript nasıl elde edilir',
      path: '/guides/accurate-transcripts',
      note: 'En büyük farkı yaratan, kayıtta ve ayarlarda yapılacak basit değişiklikler.',
    },
  ],
};
