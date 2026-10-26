import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP4 yazıya çevirme',
  h1: 'MP4 videoyu yazıya çevirin',
  lead: 'MP4; telefon kameralarının, ekran kaydedicilerin ve toplantı dışa aktarımlarının biçimidir. Kendi dosyanızı ekleyin ve zaman damgalı bir transkript alın; ücretsiz ve girişsiz.',
  dropKind: 'video',
  dropNoun: 'MP4 dosyanızı',

  whyTitle: 'MP4 dosyalarını yazıya dökmek neden kolay',
  why: [
    'MP4 bir kapsayıcıdır: görüntüyü ve sesi birlikte tutar. TranscribeVid sesi okur, görüntüyü yok sayar; bu yüzden önce dönüştürülecek bir şey yoktur ve ayrı bir MP4’ten MP3’e adımına gerek kalmaz.',
    'Zaten MP4 olarak gelen kayıtlar için uygundur: telefon videoları, kaydedilmiş Zoom veya Teams toplantıları, ekran görüntüleri, web seminerleri ve ders kayıtları gibi. Sonuç, her satırında bir zaman bulunan, aramaya veya altyazıya dönüştürmeye hazır bir metindir.',
  ],

  howTitle: 'MP4 yazıya nasıl çevrilir',
  howToDescription:
    'MP4’ü ekleyin, konuşulan dili ve kaliteyi seçin, transkriptin hazırlanmasını bekleyin ve indirin.',
  steps: [
    {
      title: 'MP4’ü bulun',
      text: '.mp4 dosyasını telefonunuzda veya bilgisayarınızda bulun. Sınırı aşmıyorsa sıkıştırmanız veya kırpmanız gerekmez.',
      browser: {
        text: '.mp4 dosyasını telefonunuzda veya bilgisayarınızda bulun. Önceden sıkıştırmanız veya kırpmanız gerekmez.',
      },
    },
    {
      title: 'Yükleyin',
      text: 'MP4’ü bu sayfanın üstündeki kutuya bırakın ya da Dosya seç düğmesine basın. Ana sayfada aynı anda birkaç MP4 dosyası sıraya alınabilir.',
      browser: {
        title: 'Ekleyin',
        text: 'MP4’ü bu sayfanın üstündeki kutuya bırakın ya da Dosya seç düğmesine basın. Ana sayfada birkaç MP4 dosyası ekleyebilirsiniz; sırayla yazıya dökülürler.',
      },
    },
    {
      title: 'Dili ve kaliteyi seçin',
      text: 'Konuşulan dili seçin. Standart önerilir. Yüksek doğruluk ve En yüksek doğruluk daha yavaştır ve daha az hata yapar; En hızlı ise net konuşmalarda çabuktur.',
    },
    {
      title: 'Sonucu indirin',
      text: 'Okumak için TXT, aynı MP4 ile altyazı olarak kullanmak için SRT veya VTT, yazdırmak için PDF alın.',
    },
  ],

  formatsTitle: 'MP4 ve diğer video biçimleri',
  formatsIntro:
    'MP4 en yaygın durumdur, ancak aynı kutu şu video türlerini ve olağan ses biçimlerini de kabul eder.',
  uploadTitle: 'Ekleyebileceğiniz video dosyaları',
  accepts: ['MP4', 'M4V', 'MOV', 'MKV', 'WEBM', 'AVI', 'WMV', 'FLV', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'konuşulan sözler düz metin olarak' },
    { name: 'SRT', use: 'aynı MP4 için bir altyazı dosyası' },
    { name: 'VTT', use: 'bir web sayfası için altyazı' },
    { name: 'PDF', use: 'yazdırılacak veya paylaşılacak bir transkript' },
    { name: 'Markdown', use: 'zamanlı notlar' },
    { name: 'JSON', use: 'kendi araçlarınız için veri' },
  ],

  tipsTitle: 'MP4 dosyalarını yazıya dökme ipuçları',
  tips: [
    {
      title: 'Sesin olduğundan emin olun.',
      text: 'Sessiz kaydedilmiş bir ekran kaydında yazıya dökülecek konuşma yoktur ve sonuç boş çıkar.',
    },
    {
      title: 'Rüzgâra ve odaya dikkat edin.',
      text: 'Telefon videoları rüzgârdan, mesafeden ve yankıdan zarar görür. Telefonu daha yakına tutun ya da bir dahaki sefere harici bir mikrofon ekleyin.',
    },
    {
      title: 'Büyük dosyaları sesi dışa aktararak küçültün.',
      text: 'Bir MP4 sınırı aşıyorsa düzenleyicinizden yalnızca sesi (M4A veya MP3) dışa aktarın. Çok daha küçüktür ve aynı şekilde çalışır.',
      browser: {
        text: 'Çok uzun bir MP4, telefonda çok fazla bellek gerektirir. Düzenleyicinizden yalnızca sesi (M4A veya MP3) dışa aktarın: çok daha küçüktür ve aynı şekilde çalışır.',
      },
    },
    {
      title: 'SRT’yi videonun yanında tutun.',
      text: 'Birçok oynatıcı, adı videoyla aynı olan bir .srt dosyasını otomatik olarak yükler.',
    },
    {
      title: 'İsimleri ve sayıları kontrol edin.',
      text: 'Otomatik transkriptler en sık bunları yanlış yazar. Ara ve değiştir, tekrarları tek seferde düzeltir.',
    },
  ],

  faqs: [
    {
      question: 'Önce MP4’ü MP3’e dönüştürmem gerekir mi?',
      answer: 'Hayır. MP4’ü olduğu gibi ekleyin. Ses, dosyadan sizin yerinize okunur.',
    },
    {
      question: 'MP4’üm neden reddedildi?',
      answer:
        'Boyut veya süre sınırını aşan dosyalar işlenmeden önce reddedilir. {limits} Videoyu parçalara bölün ya da yalnızca sesini dışa aktarın, sonra yeniden ekleyin.',
      browser: {
        question: 'MP4’üm neden çalışmadı?',
        answer:
          'Tarayıcınız sesini okuyamadı: dosya bozuk olabilir, ses kanalı olmayabilir ya da nadir bir ses biçimi kullanıyor olabilir. Düzenleyicinizden sesi M4A veya MP3 olarak dışa aktarın ve onun yerine o dosyayı ekleyin. Boyut veya süre sınırı yoktur, ancak çok uzun videolar yeterli boş bellek gerektirir.',
      },
    },
    {
      question: 'Bununla MP4’üme altyazı ekleyebilir miyim?',
      answer:
        'Konuşmaya göre zamanlanmış bir altyazı dosyası (SRT veya VTT) alırsınız. TranscribeVid MP4’ünüzü düzenlemez veya yeniden kodlamaz; altyazıyı görüntünün içine gömmek için bir video düzenleyici gerekir.',
    },
    {
      question: 'Dosya eklemek yerine bağlantı yapıştırabilir miyim?',
      answer:
        'Hayır. TranscribeVid web bağlantılarıyla değil, sizin eklediğiniz veya kaydettiğiniz dosyalarla çalışır. Video size aitse özgün dosyayı ekleyin.',
    },
    {
      question: 'Zoom, Teams ve telefon videolarıyla çalışır mı?',
      answer:
        'Evet, konuşma içeren her MP4 çalışır. Toplantılara konuşmacı adları eklenmez, ancak satırlar zaman damgalıdır; böylece düzenlerken isimleri ekleyebilirsiniz.',
    },
  ],
};
