import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MOV yazıya çevirme',
  h1: 'MOV videoyu yazıya çevirin',
  lead: 'MOV, iPhone’ların, Mac’lerin ve birçok kameranın kaydettiği biçimdir. MOV’unuzu ekleyin ve zaman damgalı bir transkript alın; ücretsiz, girişsiz. Yalnızca ses okunur; bu yüzden görüntünün boyutu ve codec’i önemli değildir.',
  dropKind: 'video',
  dropNoun: 'MOV dosyanızı',

  whyTitle: 'MOV dosyaları neden dönüştürme gerektirmez',
  why: [
    'MOV, Apple’ın QuickTime biçimidir. Bir MP4 gibi görüntüyü ve sesi birlikte tutar ve çoğu MOV dosyası doğrudan okunan AAC ses taşır. TranscribeVid bu sesi okur, görüntüyü yok sayar; bu yüzden ayrı bir MOV’dan MP4’e adımına gerek yoktur.',
    'MOV dosyaları çoğu zaman büyüktür, çünkü telefonlar ve kameralar yüksek kalitede kaydeder. Sizinkini küçültmeniz ya da dönüştürmeniz gerekmez. Kamera rulosundan transkripte giden en hızlı yol, dosyayı olduğu gibi eklemektir.',
  ],

  sections: [
    {
      title: 'MOV dosyaları nereden gelir',
      bullets: [
        {
          title: 'iPhone ve iPad videoları.',
          text: 'Kamera uygulamasıyla kaydedilen videolar, görüntü biçimi H.264 de olsa HEVC de olsa .MOV dosyası olarak kaydedilir.',
        },
        {
          title: 'Mac ekran kayıtları.',
          text: 'Ekran görüntüsü araç çubuğu (Shift-Command-5) ve QuickTime Player, ekran kayıtlarını .mov olarak kaydeder. Kayıttan önce bir mikrofon seçin, yoksa dosyada konuşma olmaz.',
        },
        {
          title: 'Kameralar ve düzenleme yazılımları.',
          text: 'Birçok aynasız kamera MOV kaydeder; Final Cut Pro ve Adobe Premiere Pro gibi video düzenleyiciler de onu dışa aktarabilir.',
        },
      ],
    },
    {
      title: 'iPhone’dan video almak',
      paragraphs: [
        'En basit yol, bu sayfayı iPhone’un kendisinde açıp Dosya seç düğmesine basmaktır. Videoyu Fotoğraflar kitaplığından ya da Dosyalar’dan seçebilirsiniz. Seçerken telefon hangi biçimin kullanılacağını sorarsa iki yanıt da işe yarar, çünkü yalnızca ses okunur.',
        'Bunun yerine bilgisayarda yazıya dökmek için videoyu AirDrop ile gönderin, Dosyalar’a ya da iCloud Drive’a kaydedin veya kabloyla kopyalayın. Menü adları iOS ve macOS sürümleri arasında değişir; bu yüzden bunları bir rehber olarak görün.',
      ],
    },
    {
      title: 'Birden fazla ses kanalı olan videolar',
      paragraphs: [
        'Bazı kameralar ve düzenleyiciler tek bir MOV’a birkaç ses kanalı yazar; örneğin bir kamera mikrofonu ve bir yaka mikrofonu. TranscribeVid okuyabildiği ilk ses kanalını kullanır. İstediğiniz konuşma başka bir kanaldaysa önce o kanalı içeren bir kopya dışa aktarın ya da kanalları düzenleyicinizde birleştirin.',
      ],
    },
  ],

  howTitle: 'MOV yazıya nasıl çevrilir',
  howToDescription:
    'MOV videoyu ekleyin, konuşulan dili ve kaliteyi seçin, transkriptin hazırlanmasını bekleyin ve indirin.',
  steps: [
    {
      title: 'MOV’u ekleyin',
      text: 'Bu sayfanın üstündeki Dosya seç düğmesine basın ya da .mov dosyasını kutuya bırakın. iPhone, Fotoğraflar ve Dosyalar seçeneklerini sunar. Bu kutuya bir seferde bir video sığar; sonraki sayfadaki Başka bir dosya ekle daha fazlasını sıraya alır.',
    },
    {
      title: 'Dili ve kaliteyi ayarlayın',
      text: 'Sonraki sayfada konuşulan dili seçin. Standart önerilir. Rüzgâr, trafik veya uzaktaki bir konuşmacı için Yüksek doğruluk ve En yüksek doğruluk daha uzun sürer ve daha az hata yapar. Ardından Yazıya dök düğmesine basın.',
      browser: {
        text: 'Sonraki sayfada konuşulan dili seçin. Standart önerilir. Rüzgâr, trafik veya uzaktaki bir konuşmacı için cihazınız sunuyorsa Yüksek doğruluk veya En yüksek doğruluk seçeneğini deneyin: daha uzun sürerler ve daha az hata yaparlar, her biri ilk seferde daha büyük bir indirmedir ve birini çalıştıramayan bir cihaz onu, nedeniyle birlikte gri renkte gösterir. Ardından Yazıya dök düğmesine basın.',
      },
    },
    {
      title: 'Okuyun ve düzeltin',
      text: 'Metin satır satır, her birinde bir zamanla gelir. Herhangi bir satırdan oynatın, yanlış olanı düzeltin ve istemediğiniz satırları silin.',
    },
    {
      title: 'Transkripti indirin',
      text: 'Okumak için TXT veya PDF, bir video düzenleyicide ya da web’de altyazı olarak kullanmak için SRT veya VTT alın. MOV’unuz asla değiştirilmez.',
    },
  ],

  formatsTitle: 'MOV ve diğer video biçimleri',
  formatsIntro: 'Aynı kutu MOV’u ve şu diğer türleri, ayrıca olağan ses biçimlerini de kabul eder.',
  uploadTitle: 'Ekleyebileceğiniz video dosyaları',
  accepts: ['MOV', 'MP4', 'M4V', 'MKV', 'WEBM', '3GP', 'TS'],
  downloads: [
    { name: 'TXT', use: 'konuşulan sözler düz metin olarak' },
    { name: 'SRT', use: 'düzenleyiciler ve oynatıcılar için altyazı' },
    { name: 'VTT', use: 'bir web sayfası için altyazı' },
    { name: 'PDF', use: 'yazdırılacak veya paylaşılacak bir transkript' },
    { name: 'Markdown', use: 'zamanlı notlar' },
    { name: 'JSON', use: 'kendi araçlarınız için veri' },
  ],

  tipsTitle: 'MOV videolarını yazıya dökme ipuçları',
  tips: [
    {
      title: 'Sesi iyileştir’i açık tutun.',
      text: 'Telefon videoları rüzgâr, tutma gürültüsü ve oda yankısı yakalar. Daha fazla seçenek bölümündeki Sesi iyileştir anahtarı düşük uğultuyu ve cızırtıyı giderir, kısık sesleri öne çıkarır.',
    },
    {
      title: 'Sesin hangi kanalda olduğunu kontrol edin.',
      text: 'Bir kamera iki mikrofonu ayrı kanallar olarak kaydettiyse videoyu oynatın ve konuşmanın ilk kanalda olduğundan emin olun.',
    },
    {
      title: 'Uzun kayıtları doğal molalarda kesin.',
      text: 'Boyut veya süre sınırını aşan dosyalar reddedilir. Videoyu parçalara bölün ya da yalnızca sesini dışa aktarın, sonra ekleyin.',
      browser: {
        title: 'Uzun kayıtlar bellek gerektirir.',
        text: 'Site boyut veya süre sınırı koymaz, ancak uzun bir video, en çok telefonda olmak üzere zaman ve boş bellek gerektirir ve eski bir tarayıcı çok uzun bir dosyayı reddedebilir. Çok uzun bir kayıt için düzenleyicinizden yalnızca sesi dışa aktarın ya da videoyu parçalara bölün.',
      },
    },
    {
      title: 'Sesi bilerek kaydedin.',
      text: 'Mikrofon olmadan yapılmış bir Mac ekran kaydında konuşma yoktur ve transkript boş çıkar.',
    },
  ],

  faqs: [
    {
      question: 'MOV’u MP4’e dönüştürmeden bir iPhone videosunu yazıya dökebilir miyim?',
      answer:
        'Evet. MOV’u olduğu gibi ekleyin. TranscribeVid ses kanalını okur, görüntüyü yok sayar; bu yüzden dönüştürmeye gerek yoktur.',
    },
    {
      question: 'iPhone’umdan gelen 4K veya HEVC bir video çalışır mı?',
      answer:
        'Evet. Yalnızca ses kullanılır; bu yüzden görüntü boyutu ve video biçimi önemli değildir. Önemli olan ses kanalıdır ve iPhone ile Mac kayıtları doğrudan okunan AAC ses kullanır.',
    },
    {
      question: 'Yazıya dökmek için iPhone’umdaki videoyu bilgisayara nasıl alırım?',
      answer:
        'AirDrop ile bir Mac’e gönderin, Dosyalar’a ya da iCloud Drive’a kaydedin veya kabloyla kopyalayın. Ya da bilgisayarı atlayın: bu sayfayı iPhone’da açın ve videoyu Fotoğraflar’dan seçin.',
    },
    {
      question: 'Mac ekran kaydımda neden metin yok?',
      answer:
        'Bir ekran kaydı, yalnızca kayıttan önce bir mikrofon seçildiyse ses taşır. Shift-Command-5 araç çubuğunda Seçenekler’i açın, bir mikrofon seçin ve yeniden kaydedin. Menü adları macOS sürümleri arasında farklı olabilir.',
    },
    {
      question: 'MOV’umda iki ses kanalı varsa ne olur?',
      answer:
        'TranscribeVid okuyabildiği ilk ses kanalını kullanır. Konuşma başka bir kanaldaysa önce o kanalı içeren bir kopya dışa aktarın ya da kanalları düzenleyicinizde birleştirin.',
    },
  ],

  links: [
    {
      label: 'MP4 yazıya çevirme',
      path: '/mp4-to-text',
      note: 'Diğer yaygın telefon video biçimi olan MP4 dosyaları için aynı hizmet.',
    },
    {
      label: 'Videoyu yazıya çevirme',
      path: '/video-to-text',
      note: 'Her video dosyası için ana sayfa; dersler, röportajlar ve klipler için ipuçlarıyla.',
    },
    {
      label: 'SRT altyazı oluşturucu',
      path: '/srt-subtitle-generator',
      note: 'MOV’unuz için altyazı yapın ve bir SRT dosyasının içinin neye benzediğini görün.',
    },
    {
      label: 'Videoya altyazı nasıl eklenir',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Altyazı dosyasını indirdikten sonra ne yapacağınız.',
    },
  ],
};
