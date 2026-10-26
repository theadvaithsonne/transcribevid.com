import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP3 yazıya çevirme',
  h1: 'MP3’ü çevrimiçi yazıya çevirin',
  lead: 'Podcast bölümlerinden ders kayıtlarına ve sesli mesajlara kadar MP3, çoğumuzun yığınla sahip olduğu ses biçimidir. Bir MP3 ekleyin ve zaman damgalı bir transkript alın; ücretsiz ve girişsiz.',
  dropKind: 'audio',
  dropNoun: 'MP3 dosyanızı',

  whyTitle: 'MP3 transkripti size ne sağlar',
  why: [
    'MP3, sesi küçük bir dosyaya sıkıştırır; podcast’lerin, ses kaydedicilerin ve indirilen derslerin onu kullanmasının nedeni budur. Bu burada da işe yarar: bir MP3 yavaş bir bağlantıda bile hızlıca yüklenir ve 128 kbps’lik bir saatlik MP3 yalnızca yaklaşık 58 MB’tır.',
    'Transkript, uzun bir bölümde tek bir ifadeyi aramanızı, konuğunuzdan tam alıntı yapmanızı, programı yeniden dinlemeden yayın notları yazmanızı ya da bir konuşmanın veya sesli mesajın yazılı kaydını tutmanızı sağlar.',
  ],
  browserWhy: [
    'MP3, sesi küçük bir dosyaya sıkıştırır; podcast’lerin, ses kaydedicilerin ve indirilen derslerin onu kullanmasının nedeni budur. Bu burada da işe yarar: tarayıcınız bir MP3’ü hızlıca okur ve 128 kbps’lik bir saatlik MP3 yalnızca yaklaşık 58 MB’tır.',
    'Transkript, uzun bir bölümde tek bir ifadeyi aramanızı, konuğunuzdan tam alıntı yapmanızı, programı yeniden dinlemeden yayın notları yazmanızı ya da bir konuşmanın veya sesli mesajın yazılı kaydını tutmanızı sağlar.',
  ],

  howTitle: 'MP3 yazıya nasıl çevrilir',
  howToDescription:
    'MP3’ü ekleyin, konuşulan dili seçin, transkriptin hazırlanmasını bekleyin ve metin ya da altyazı olarak indirin.',
  steps: [
    {
      title: 'MP3’ünüzü seçin',
      text: '.mp3 dosyasını bu sayfanın üstündeki kutuya bırakın ya da Dosya seç düğmesine basın. Ana sayfada birden fazla dosya ekleyebilirsiniz; her biri kendi transkriptini oluşturur.',
    },
    {
      title: 'Dili seçin',
      text: 'Konuşulan dili seçin ya da otomatik algılamayı açık bırakın. Başka bir dildeki konuşmadan İngilizce metin almak için Daha fazla seçenek bölümünü açın ve Çıktı’yı İngilizceye çevir olarak ayarlayın.',
    },
    {
      title: 'Transkripti bekleyin',
      text: 'Dosya işlenirken metin, bir ilerleme çubuğuyla birlikte görünür. En hızlı, çabuk sonuç verir; En yüksek doğruluk en uzun sürer ve en az hata yapar.',
    },
    {
      title: 'Düzeltin ve indirin',
      text: 'İstediğiniz satırı düzeltin, ardından okumak için TXT’yi; ses bir video veya web oynatıcısına aitse SRT ve VTT’yi indirin.',
    },
  ],

  formatsTitle: 'MP3 ve diğer ses biçimleri',
  formatsIntro:
    'MP3 en yaygın ses dosyasıdır. Bu diğer ses biçimleri de aynı şekilde çalışır ve video dosyaları da kabul edilir.',
  uploadTitle: 'Ekleyebileceğiniz ses dosyaları',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'bölüm veya konuşma düz metin olarak' },
    { name: 'Markdown', use: 'zaman damgalı yayın notları' },
    { name: 'SRT', use: 'video sürümü için altyazı' },
    { name: 'VTT', use: 'web oynatıcıları için transkript izi' },
    { name: 'PDF', use: 'yazdırılacak veya gönderilecek bir transkript' },
    { name: 'JSON', use: 'programlar için yapılandırılmış satırlar' },
  ],

  tipsTitle: 'MP3 dosyalarını yazıya dökme ipuçları',
  tips: [
    {
      title: 'En iyi kopyayı ekleyin.',
      text: 'MP3 kayıplı bir biçimdir ve her yeniden kayıtta biraz daha ayrıntı kaybolur. WAV’ınız ya da özgün kaydınız hâlâ elinizdeyse onu ekleyin.',
    },
    {
      title: 'Çok düşük bit hızlarından kaçının.',
      text: 'Konuşma sıkıştırmadan iyi çıkar, ancak çok düşük bit hızları ünsüzleri bulanıklaştırır ve doğruluğu düşürür.',
    },
    {
      title: 'Uzun bölümleri bölün.',
      text: 'Süre sınırını aşan bir dosya reddedilir. İki saatlik bir bölümü önce herhangi bir ses düzenleyicide parçalara ayırın.',
      browser: {
        text: 'Süre sınırı yoktur, ancak iki saatlik bir bölüm yavaş bir cihazda biraz zaman alır. İlk bölümü daha çabuk okumak için herhangi bir ses düzenleyicide parçalara ayırın.',
      },
    },
    {
      title: 'Girişleri ve müziği yönetin.',
      text: 'Daha fazla seçenek bölümünde Sessizlikleri ve müziği atla seçeneğini açık tutun; böylece jenerikler ve uzun duraklamalar uydurma kelimeler üretmez.',
    },
    {
      title: 'Konukların adlarını yazın.',
      text: 'Sunucuyu, konukları, programın adını ve markaları kelime ipucuna bir kez yazın; doğru çıkma olasılıkları çok daha yüksek olur.',
    },
  ],

  faqs: [
    {
      question: 'Bir MP3 ne kadar uzun olabilir?',
      answer:
        '{limits} 128 kbps’lik 60 dakikalık bir MP3 yaklaşık 58 MB’tır; bu yüzden süre sınırı boyut sınırından daha önemlidir. Günlük veya aylık kota yoktur.',
      browser: {
        answer:
          'Boyut veya süre sınırı koymuyoruz, çünkü MP3 tarayıcınızda, kendi cihazınızda yazıya dökülür. 128 kbps’lik 60 dakikalık bir MP3 yaklaşık 58 MB’tır; daha uzun dosyalar yalnızca daha uzun sürer ve sayfa yavaş bir cihazda sizi uyarır. Günlük veya aylık kota yoktur.',
      },
    },
    {
      question: 'MP3 sıkıştırması doğruluğu düşürür mü?',
      answer:
        'Normal kalitede pek değil, çünkü konuşma MP3 için kolay bir durumdur. Gürültü, yankı ve üst üste konuşan sesler biçimden çok daha fazla zarar verir; bu yüzden elinizde temiz bir özgün kayıt varsa onu tercih edin.',
    },
    {
      question: 'Aynı anda birkaç MP3 dosyasını yazıya dökebilir miyim?',
      answer:
        'Evet. Hepsini birlikte ekleyin; her biri oturumunuzda kendi transkriptini oluşturur ve onları ayrı ayrı açıp indirebilirsiniz.',
    },
    {
      question: 'Bir MP3’ü İngilizceye çevirebilir miyim?',
      answer:
        'Evet. Daha fazla seçenek bölümünde Çıktı’yı İngilizceye çevir olarak ayarlayın. Çeviri otomatiktir; bu yüzden İngilizce metni kullanmadan önce okuyun. Başka hedef diller sunulmaz.',
    },
    {
      question: 'MP3’üm saklanıyor mu?',
      answer:
        'Yalnızca oturumunuz boyunca. Oturum bitince otomatik olarak ya da Verilerimi şimdi sil düğmesine bastığınızda silinir. Hesap gerekmez.',
      browser: {
        answer:
          'Yalnızca bu tarayıcıda: MP3’ünüz cihazınızdan hiç çıkmaz. Bir süre işlem yapılmazsa otomatik olarak ya da Verilerimi şimdi sil düğmesine bastığınızda silinir. Hesap gerekmez.',
      },
    },
  ],
};
