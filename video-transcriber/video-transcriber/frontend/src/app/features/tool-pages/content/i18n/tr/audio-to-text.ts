import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Ses yazıya çevirme',
  h1: 'Sesi kaydolmadan yazıya çevirin',
  lead: 'Bir podcast, röportaj, ders veya sesli not bırakın; aranabilen, düzenlenebilen ve indirilebilen zaman damgalı bir transkript alın. Ücretsiz, sınırsız ve 50’den fazla dilde.',
  dropKind: 'audio',
  dropNoun: 'Ses dosyanızı',
  record: true,

  whyTitle: 'Ses yazıya çevirme ne zaman işe yarar',
  why: [
    'Ses, göz gezdirmesi en zor ortamdır. Yeniden dinlemeden içinde arama yapamaz, tarayamaz ya da alıntı çıkaramazsınız. Transkript, bir şeyin hangi dakikada söylendiğini bulmanızı, tam alıntılar çıkarmanızı ve bir saatlik bir konuşmayı birkaç dakikada okumanızı sağlar.',
    'Tipik işler arasında podcast yayın notları, gazetecilik veya araştırma için röportajlar, sözlü tarih çalışmaları, sesli notlar, dikte edilmiş taslaklar ve ders ya da konuşma kayıtları yer alır. Yalnızca kendinizin yaptığı veya kullanma izniniz olan kayıtları yazıya dökün.',
  ],

  howTitle: 'Ses yazıya nasıl çevrilir',
  howToDescription:
    'Bir ses dosyası ekleyin ya da kayıt yapın, dili seçin, transkriptin hazırlanmasını bekleyin ve indirin.',
  steps: [
    {
      title: 'Sesinizi ekleyin',
      text: 'Bir ses dosyasını bu sayfanın üstündeki kutuya bırakın ya da Dosya seç düğmesine basın. Yeni bir kayıt yapmak için kutunun altındaki Mikrofonunuzla kayıt yapın bağlantısına basın.',
    },
    {
      title: 'Dili seçin',
      text: 'Konuşulan dili seçin ya da otomatik algılamayı açık bırakın. Net konuşmalar için Standart iyi bir başlangıçtır. En hızlı, çabuk sonuç verir; En yüksek doğruluk en uzun sürer ve en az hata yapar.',
    },
    {
      title: 'Metni bekleyin',
      text: 'Satırlar tanındıkça görünür. Varsayılan olarak açık olan Sesi iyileştir seçeneği, uğultu ve cızırtıyı süzer, kısık sesli konuşmacıları dengeler.',
    },
    {
      title: 'Gözden geçirin ve dışa aktarın',
      text: 'Herhangi bir satırı zaman damgasından oynatın, hataları düzeltin, ardından transkripti ihtiyacınız olan biçimde indirin.',
    },
  ],

  formatsTitle: 'Desteklenen ses dosyaları ve indirmeler',
  formatsIntro:
    'Yaygın ses biçimleri çalışır. Video dosyaları da kabul edilir ve yalnızca sesleri kullanılır.',
  uploadTitle: 'Ekleyebileceğiniz ses dosyaları',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'notlar ve taslaklar için temiz metin' },
    { name: 'Markdown', use: 'zamanlı metin, not uygulamasına hazır' },
    { name: 'PDF', use: 'yazdırılabilir bir transkript' },
    { name: 'SRT', use: 'altyazı için zamanlanmış satırlar' },
    { name: 'VTT', use: 'web oynatıcıları için zamanlanmış satırlar' },
    { name: 'JSON', use: 'programlar için her satır ve zaman' },
  ],

  tipsTitle: 'Doğru ses transkriptleri için ipuçları',
  tips: [
    {
      title: 'Mikrofona yaklaşın.',
      text: 'Yankı ve mesafe çoğunlukla dosya biçiminden daha önemlidir. Sessiz bir oda ve yakındaki bir mikrofon, her ayardan daha iyidir.',
    },
    {
      title: 'Aynı anda tek ses.',
      text: 'Üst üste konuşan kişiler, konuşmanın altındaki müzik ve güçlü arka plan gürültüsü hataların çoğuna yol açar.',
    },
    {
      title: 'Özgün kaydı ekleyin.',
      text: 'Bir kaydı daha küçük bir dosya olarak yeniden kaydetmek ayrıntıyı siler. Elinizdeki özgün veya en yüksek kaliteli kopyayı kullanın.',
    },
    {
      title: 'Kelime ipucu kullanın.',
      text: 'Tanıyıcıların en çok yanlış yaptığı şeyler isimler, markalar ve teknik terimlerdir. Bunları Daha fazla seçenek bölümünde listeleyin.',
    },
    {
      title: 'Kayıttan önce izin isteyin.',
      text: 'Başkalarının seslerini kaydetmeden veya yazıya dökmeden önce izin alın ve görüşme kaydıyla ilgili yerel kuralları kontrol edin.',
    },
  ],

  faqs: [
    {
      question: 'Hangi ses biçimlerini yazıya çevirebilirim?',
      answer:
        'MP3, WAV, M4A, AAC, FLAC, OGG ve OPUS. MP4 ve MKV gibi video dosyaları da çalışır, çünkü yalnızca ses kullanılır.',
    },
    {
      question: 'Sayfada doğrudan ses kaydı yapabilir miyim?',
      answer:
        'Evet, mikrofon erişimine izin veren tarayıcılarda. Mikrofondan kayıt düğmesine basın, istendiğinde erişime izin verin, ardından kaydı durdurun. Kayıt, siz konuşurken değil, durdurduktan sonra yazıya dökülür.',
    },
    {
      question: 'İki kişilik bir röportaj için de çalışır mı?',
      answer:
        'Evet, her iki kişinin konuşması da yazıya dökülür. Konuşmacı adları veya etiketleri eklenmez, ancak her satırda bir zaman damgası vardır ve düzenlerken metne isimleri kendiniz yazabilirsiniz.',
    },
    {
      question: 'Ses ne kadar uzun olabilir?',
      answer:
        '{limits} Daha uzun veya daha büyük dosyalar işlenmeden önce reddedilir, bu yüzden önce bölün. Günlük veya aylık kota yoktur.',
      browser: {
        answer:
          'Bir sınır koymuyoruz: ses tarayıcınızda, kendi cihazınızda yazıya dökülür; bu yüzden uzun kayıtlar yalnızca daha uzun sürer ve yeterli boş bellek gerektirir. Sayfa, yavaş bir cihazda sizi uyarır. Günlük veya aylık kota yoktur.',
      },
    },
    {
      question: 'Sesim saklanıyor mu?',
      answer:
        'Dosyalar yalnızca oturumunuz boyunca tutulur; oturum bitince otomatik olarak, Verilerimi şimdi sil düğmesine bastığınızda ise hemen silinir. Hesap yoktur.',
      browser: {
        answer:
          'Yalnızca bu tarayıcıda: sesiniz cihazınızdan hiç çıkmaz. Bir süre işlem yapılmazsa otomatik olarak, Verilerimi şimdi sil düğmesine bastığınızda ise hemen silinir. Hesap yoktur.',
      },
    },
  ],
};
