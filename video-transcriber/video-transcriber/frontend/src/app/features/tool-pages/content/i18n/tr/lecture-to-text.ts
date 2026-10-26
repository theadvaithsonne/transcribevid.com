import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Ders kaydını yazıya çevirme',
  h1: 'Ders kaydını yazıya çevirin: kaydı aranabilir bir transkripte dönüştürün',
  lead: 'Dersi kaydedin, dosyayı buraya bırakın ve zaman damgalı metin olarak okuyun: sınav konusu için arayabileceğiniz, notlarınıza kopyalayabileceğiniz ve kayıtla karşılaştırabileceğiniz bir metin. Hesap yok, ücret yok ve 50’den fazla dil.',
  dropKind: 'video',
  dropNoun: 'Ders kaydınızı',

  whyTitle: 'Ders neden yazıya çevrilmeli',
  why: [
    'Bir derse katılmak kolaydır, ondan tekrar çalışmak zordur. Bir kayıtta ihtiyacınız olan tek tanımı arayamazsınız ve onu bulmak için bir saati yeniden oynatmak, dersin kendisi kadar sürer. Transkript, size kelimeleri sırasıyla, her satırın yanında zamanla verir; böylece ihtiyacınız olan bölüme atlayabilirsiniz.',
    'Ayrıca okumayı dinlemekten daha kolay bulanlara, ikinci bir dilde öğrenim görenlere, bir dersi kaçıranlara ya da kendi verdiği konuşmanın metnini isteyenlere de yardımcı olur. Kayıttan önce öğretim üyenize sorun ve kurumunuzun kayıtlarla ilgili kurallarına uyun.',
  ],

  sections: [
    {
      title: 'Transkriptten ders notlarına',
      paragraphs: [
        'Transkript ham maddedir, bitmiş not değildir. Öğrencilerin onu kullandığı dört yol şunlar.',
      ],
      bullets: [
        {
          title: 'Tekrardan önce arayın.',
          text: 'Transkript bittiğinde üstündeki Metinde ara kutusuna bir terim yazın. Kutu eşleşen satırları sayar ve oklar aralarında gezinir; böylece her birini zaman damgasından oynatıp açıklamayı yeniden duyabilirsiniz. Teknik bir kelime her yerde yanlış yazıldıysa Değiştir… her satırı bir kerede düzeltir.',
        },
        {
          title: 'Kendi taslağınızı oluşturun.',
          text: 'Metni bir kez okuyun, kendi başlıklarınızı ekleyin ve ihtiyacınız olana indirin. Bir fikri kendi sözcüklerinizle ifade etmek, onu kopyalamaktan genellikle daha iyi bir öğrenme yoludur.',
        },
        {
          title: 'İsimleri, sayıları ve formülleri kontrol edin.',
          text: 'Konuşma tanıma duyduğunu yazar. Denklemlerin, simgelerin ve alışılmadık terimlerin çoğu zaman düzeltilmesi gerekir; bu yüzden onları slaytlarla ve kayıtla karşılaştırarak kontrol edin.',
        },
        {
          title: 'Anlamadıklarınızı listeleyin.',
          text: 'Sizi kaçıran bölümlerin zaman damgalarını bir listeye kopyalayın ve onu bir sonraki dersinize ya da görüşme saatine götürün.',
        },
      ],
    },
    {
      title: 'Teknik sözcükler ve diğer diller',
      paragraphs: [
        'Konuya özgü kelimeler, her konuşma tanıyıcı için en zorudur. Başlamadan önce Daha fazla seçenek’i açın ve terimleri, kuram ile yazar adlarını ve kısaltmaları kelime ipucuna listeleyin. Transkript bunları daha sık, sizin yazdığınız gibi yazar.',
        'İlk diliniz olmayan bir dilde öğrenim görüyorsanız transkript, kendi hızınızda okuyabileceğiniz ve kelimelere bakabileceğiniz bir metin verir. Dersin dilini seçin ya da Otomatik algıla seçeneğini açık tutun. Başka bir dildeki bir ders İngilizce metne de dönüştürülebilir: Daha fazla seçenek altında Çıktı’yı İngilizceye çevir olarak ayarlayın. Çeviri, özgün dilde yazıya dökmeden daha az güvenilirdir ve teknik terimleri kaçırabilir; bu yüzden onu kayıtla karşılaştırarak kontrol edin.',
      ],
    },
  ],

  howTitle: 'Ders kaydı yazıya nasıl çevrilir',
  howToDescription:
    'Ders kaydını ekleyin, dili ve teknik terimleri ayarlayın, transkriptin hazırlanmasını bekleyin ve notlar olarak indirin.',
  steps: [
    {
      title: 'Ders kaydını ekleyin',
      text: 'Dosyayı yukarıdaki kutuya sürükleyin ya da Dosya seç düğmesine basın. Telefondaki bir ses kaydediciden gelen dosya, kaydedilmiş bir ders videosu ya da bir çevrimiçi dersin ekran kaydı işe yarar ve yalnızca ses kullanılır. Kutu bir seferde bir dosya alır ve onu sonraki sayfadaki yükleyiciye taşır; orada Başka bir dosya ekle, bir dersin diğer oturumlarını getirir.',
    },
    {
      title: 'Dili ve kaliteyi ayarlayın',
      text: 'Sonraki sayfada dersin dilini seçin. Standart, net bir kayıt için uygundur. Yankılı bir salon ya da hızlı bir konuşmacı için, cihazınız çalıştırabiliyorsa Yüksek doğruluk yardımcı olur (çalıştıramadığında seçenek nedeniyle birlikte gri gösterilir). Daha yavaş bir iş ve ilk seferde daha büyük bir indirme bekleyin.',
    },
    {
      title: 'Teknik terimleri ekleyin, sonra başlatın',
      text: 'Daha fazla seçenek bölümünde anahtar terimleri, isimleri ve kısaltmaları kelime ipucuna yazın; örneğin Krebs döngüsü, Bayes, Dr. Okafor. Ardından Yazıya dök düğmesine basın.',
    },
    {
      title: 'Okuyun, düzeltin ve indirin',
      text: 'Satırları kontrol etmek için zaman damgalarından oynatın ve hataları düzeltin. Ardından not uygulamanız için TXT veya Markdown, yazdırmak için PDF indirin.',
    },
  ],

  formatsTitle: 'Ders kaydı dosyaları ve indirmeler',
  formatsIntro:
    'Telefon kayıtları, kaydedilmiş videolar ve derslerin ekran kayıtları eklenebilir; yalnızca ses kanalı okunur.',
  uploadTitle: 'Ekleyebileceğiniz kayıt dosyaları',
  accepts: ['MP4', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'bir not uygulaması için düz metin' },
    { name: 'Markdown', use: 'zamanlı metin, yeniden yapılandırması kolay' },
    { name: 'PDF', use: 'yazdırılabilir bir çalışma kopyası' },
    { name: 'SRT', use: 'ders paylaştığınız bir videoysa altyazı' },
  ],

  tipsTitle: 'Ders kayıtları için ipuçları',
  tips: [
    {
      title: 'Önce izin isteyin.',
      text: 'Bazı öğretim üyeleri ve kurumlar kayda izin vermez. Sorun ve size verilen kurallara uyun.',
    },
    {
      title: 'Konuşmacıya yakın kayıt yapın.',
      text: 'Salonun önündeki bir kaydedici, arkadaki daha iyi bir kaydediciden genellikle üstündür; çünkü mesafe ve yankı çoğu zaman doğruluktan, hiçbir ayarın geri kazandıramayacağı kadar kaybettirir.',
    },
    {
      title: 'Çok uzun oturumları bölün.',
      text: 'Bir oturum bu sayfadaki sınırlardan büyük veya uzunsa eklemeden önce molada parçalara ayırın.',
      browser: {
        title: 'Uzun oturumlar daha uzun sürer.',
        text: 'Süreye bir sınır konmaz, ancak uzun bir ders cihazınızı bir süre meşgul eder ve boş bellek gerektirir; WebCodecs kullanamayan bir tarayıcı çok uzun bir dosyada zorlanabilir. Molada kesmek, ilk yarıyı daha çabuk okumanızı sağlar.',
      },
    },
    {
      title: 'İncelerken slaytları açık tutun.',
      text: 'Slayt başlıkları, zaman damgalarıyla eşleştirebileceğiniz hazır bir taslak verir.',
    },
    {
      title: 'Ayrılmadan önce indirin.',
      text: 'Transkriptler yalnızca oturumunuz için vardır. Sayfayı kapatmadan önce TXT veya Markdown’ı kaydedin.',
    },
  ],

  faqs: [
    {
      question: 'Bir dersi kaydedip yazıya dökmeye izin var mı?',
      answer:
        'Bu, öğretim üyenize ve kurumunuza bağlıdır; bu yüzden kayıttan önce sorun ve kurallarına uyun. Paylaşma izniniz yoksa transkripti kendi çalışmanız için kullanın. Bu hukuki tavsiye değildir.',
    },
    {
      question: 'Bir ders transkriptini otomatik olarak nota dönüştürebilir miyim?',
      answer:
        'Hayır. TranscribeVid size kelimeleri, her satırda bir zaman damgasıyla verir, ancak özetlemez veya başlık eklemez. Notları metinden siz oluşturursunuz; bu aynı zamanda konuyu öğrenmenin iyi bir yoludur.',
    },
    {
      question: 'Denklemli veya teknik terimli derslerde çalışır mı?',
      answer:
        'Duyduğu kelimeleri yazar; bu yüzden söylenen terimler, kelime ipucuna eklediğinizde genellikle iyi çıkar. Simgeler ve denklemler formül olarak yazılmaz; bu yüzden onları slaytlarınızla karşılaştırarak kontrol edin.',
    },
    {
      question: 'Ne kadar uzun bir dersi yazıya dökebilirim?',
      answer: '{limits} Daha uzun bir dersin önce parçalara bölünmesi gerekir.',
      browser: {
        answer:
          'Ders uzunluğuna bir üst sınır yoktur. İşi kendi cihazınız yaptığı için uzun bir ders çoğunlukla sabır ve boş bellek ister; cihazınız bunun için çok yavaş görünüyorsa sayfa sizi uyarır.',
      },
    },
    {
      question: 'Ekranıma kaydettiğim çevrimiçi bir dersi yazıya dökebilir miyim?',
      answer:
        'Evet. MP4, MOV veya WebM olarak kaydedilmiş bir ekran kaydı çalışır. Yalnızca ses okunur; bu yüzden slaytlardaki yazılar dahil edilmez. Slayt terimlerini kelime ipucuna ekleyin.',
    },
  ],

  links: [
    {
      label: 'Videoyu yazıya çevirme',
      path: '/video-to-text',
      note: 'Her dosya türüyle, kaydedilmiş her video için genel sayfa.',
    },
    {
      label: 'MP3 yazıya çevirme',
      path: '/mp3-to-text',
      note: 'Telefonda veya kaydedicide MP3 olarak kaydedilmiş ders kayıtları için.',
    },
    {
      label: 'Konuşmayı İngilizce metne çevirme',
      path: '/translate-audio-to-english',
      note: 'Başka bir dildeki bir dersten İngilizce metin.',
    },
    {
      label: 'Daha doğru bir transkript nasıl elde edilir',
      path: '/guides/accurate-transcripts',
      note: 'Zor bir kayıtta hataları azaltan ses, dil ve kalite seçimleri.',
    },
  ],
};
