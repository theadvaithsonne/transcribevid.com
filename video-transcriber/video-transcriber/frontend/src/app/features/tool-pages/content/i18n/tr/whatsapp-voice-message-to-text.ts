import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WhatsApp ses mesajını yazıya çevirme',
  h1: 'WhatsApp ses mesajını yazıya çevirin',
  lead: 'Uzun ses mesajlarını göndermek kolay, yeniden okumak zordur. Mesajı dosya olarak kaydedin, buraya bırakın ve Hintçe, İngilizce, İspanyolca ve diğer birçok dilde zaman damgalı metin olarak okuyun. Ücretsiz, girişsiz.',
  dropKind: 'audio',
  dropNoun: 'WhatsApp ses mesajınızı',

  whyTitle: 'Ses mesajı neden yazıya çevrilmeli',
  why: [
    'Ses mesajını kaydetmek hızlı, kullanmak yavaştır. İçinde arama yapamaz, bir cümleyi kopyalayamaz ya da bir toplantıda göz gezdiremezsiniz. Metin olarak aynı mesajı taramak saniyeler sürer; bir adresi, bir alıntıyı ya da bir talimat listesini doğrudan bir sohbete, nota veya belgeye yapıştırabilirsiniz.',
    'Bu sayfayı kendinizin gönderdiği veya aldığı ve kullanmakta özgür olduğunuz mesajlar için kullanın. Ses mesajları kişiseldir; bu yüzden dosyanın nereye gittiğini bilmek yardımcı olur: burada dosya şifreli bir bağlantıyla sunucuya gider ve sonra otomatik olarak silinir. Hesap gerekmez.',
  ],
  browserWhy: [
    'Ses mesajını kaydetmek hızlı, kullanmak yavaştır. İçinde arama yapamaz, bir cümleyi kopyalayamaz ya da bir toplantıda göz gezdiremezsiniz. Metin olarak aynı mesajı taramak saniyeler sürer; bir adresi, bir alıntıyı ya da bir talimat listesini doğrudan bir sohbete, nota veya belgeye yapıştırabilirsiniz.',
    'Bu sayfayı kendinizin gönderdiği veya aldığı ve kullanmakta özgür olduğunuz mesajlar için kullanın. Ses mesajları kişiseldir; bu yüzden dosya sizde kalır: tarayıcınız onu kendi cihazınızda yazıya döker ve hiçbir şey yüklenmez. Siteyi ilk kullandığınızda tarayıcınız konuşma modelini bir kez indirir ve saklar. En hızlı için on megabaytlar, Standart için birkaç yüz megabayt, daha büyük seçenekler için daha fazladır; bu yüzden telefonda mobil veri yerine Wi-Fi kullanın. Hesap gerekmez.',
  ],

  sections: [
    {
      title: 'Ses mesajı dosya olarak nasıl kaydedilir',
      paragraphs: [
        'WhatsApp ses mesajlarını uygulamanın içinde tutar; bu yüzden mesajı önce dosya olarak kaydedin. Menüler telefon modellerine ve uygulama sürümlerine göre değişir; bu yüzden bu adımları bir rehber olarak görün ve Paylaş, İlet ya da Kaydet seçeneklerini arayın. WhatsApp kendi şirketine aittir ve bu site onunla bağlantılı değildir.',
        'WhatsApp, bazı telefonlarda, sunan dillerde ve sürümlerde sohbetin içinde de bir transkript gösterebilir. Bu sayfa, metni düzenleyip dışa aktarabileceğiniz, zaman damgalı bir dosya olarak istediğinizde ya da sürümünüz veya diliniz kapsanmadığında içindir.',
      ],
      bullets: [
        {
          title: 'Android’de.',
          text: 'Ses mesajına basılı tutun, menüyü açın ve Paylaş’ı ya da İlet’i, ardından Paylaş’ı arayın. Cihaza kaydet, Dosyalar veya bir bulut sürücü uygulamasını seçin ya da mesajı kendinize e-postayla gönderin. Birçok Android telefon, alınan sesli notları bir dosya yöneticisinin açabileceği WhatsApp Voice Notes klasöründe de tutar.',
        },
        {
          title: 'iPhone’da.',
          text: 'Ses mesajına basılı tutun, İlet’i seçin, ardından paylaş simgesine dokunun ve Dosyalar’a Kaydet’i seçin. Mesajı AirDrop veya e-postayla bilgisayarınıza da gönderebilirsiniz.',
        },
        {
          title: 'Bilgisayarda.',
          text: 'WhatsApp Web’de veya masaüstü uygulamasında mesaj menüsü bir İndir seçeneği sunabilir. Sunmuyorsa dosyayı telefonunuza kaydedin ve bilgisayara taşıyın.',
        },
      ],
    },
    {
      title: 'Hintçe, Hinglish ve karışık dilli mesajlar',
      paragraphs: [
        'Ses mesajları çoğu zaman tek bir cümlede dilleri karıştırır. Dili çoğunlukla konuşulan dil olarak ayarlayın ya da Otomatik algıla seçeneğini açık tutun. Tanıma en iyi ana dili izler; bu yüzden ikinci bir dilin girdiği yerlerde emin olunmayan olarak işaretlenen satırları kontrol edin.',
        'Hintçe için Transkript stili, metnin nasıl yazılacağını belirler. Hinglish (Latin harfleriyle Hintçe), Hintçeyi Latin harfleriyle yazar ve İngilizce kelimeleri olduğu gibi bırakır. Özgün yazı Devanagari’yi korur. Urduca, Bengalce, Arapça, İspanyolca, Portekizce ve desteklenen diğer diller kendi yazılarını korur. Başka bir dildeki bir mesaj İngilizce metin olarak da çıkabilir: Daha fazla seçenek bölümünde Çıktı’yı İngilizceye çevir olarak değiştirin ve sonucu kayıtla karşılaştırarak kontrol edin; çünkü çeviri, özgün dilde yazıya dökmekten daha az güvenilirdir.',
      ],
    },
  ],

  howTitle: 'WhatsApp ses mesajı yazıya nasıl çevrilir',
  howToDescription:
    'Ses mesajını dosya olarak kaydedin, sayfaya ekleyin, dili seçin, transkriptin hazırlanmasını bekleyin ve metni kopyalayın ya da indirin.',
  steps: [
    {
      title: 'Ses mesajı dosyasını ekleyin',
      text: 'Kaydettiğiniz dosyayı yukarıdaki kutuya bırakın ya da Dosya seç düğmesine basın. WhatsApp ses mesajı genellikle bir .opus dosyasıdır ve olduğu gibi çalışır. Kutu bir seferde bir dosya alır: mesajı sonraki sayfadaki yükleyiciye aktarır; orada Başka bir dosya ekle ile daha fazla mesaj ekleyebilirsiniz.',
    },
    {
      title: 'Dili seçin',
      text: 'Sonraki sayfada çoğunlukla konuşulan dili seçin ya da Otomatik algıla seçeneğini açık tutun. Hintçe için Transkript stili, Latin harfleri (Hinglish) ile Devanagari arasında seçim yapar. Ardından Yazıya dök düğmesine basın.',
    },
    {
      title: 'Metni bekleyin',
      text: 'Mesaj işlenirken satırlar zaman damgalarıyla görünür ve kısa bir mesaj uzun birinden daha çabuk biter. Standart, çoğu mesaj için uygundur. Hızlı konuşan biri veya gürültülü bir kayıt için, cihazınızın çalıştırabildiği yerde Yüksek doğruluk yardımcı olabilir. Çalıştıramayan bir cihazda bu seçenek nedeniyle birlikte gri gösterilir ve ilk seferde daha büyük bir indirme gerektirir.',
    },
    {
      title: 'Kontrol edin, kopyalayın veya indirin',
      text: 'İsimleri ve anlaşılmayan kelimeleri düzeltin, ardından metni kopyalayın ya da TXT indirin. SRT veya VTT’yi yalnızca mesaj bir videoyla birlikteyse indirin.',
    },
  ],

  formatsTitle: 'Ses mesajı dosyaları ve indirmeler',
  formatsIntro:
    'WhatsApp ses mesajları genellikle .opus dosyalarıdır. Diğer ses dosyaları aynı şekilde çalışır ve video dosyaları da kabul edilir; yalnızca sesleri kullanılır.',
  uploadTitle: 'Ekleyebileceğiniz ses dosyaları',
  accepts: ['OPUS', 'OGG', 'M4A', 'MP3', 'AAC', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'kopyalanacak düz metin olarak mesaj' },
    { name: 'Markdown', use: 'her satırda bir zaman olan notlar' },
    { name: 'PDF', use: 'mesajın yazdırılabilir bir kopyası' },
    { name: 'SRT', use: 'mesajı taşıyan bir video için zamanlanmış satırlar' },
  ],

  tipsTitle: 'Ses mesajları için ipuçları',
  tips: [
    {
      title: 'Dosyayı kaydedin, yeniden kaydetmeyin.',
      text: 'Bir mesajı hoparlörden çalıp başka bir cihazla kaydetmek yankı ve oda gürültüsü ekler. Kaydedilmiş dosya temiz kopyadır.',
    },
    {
      title: 'Ana dili belirtin.',
      text: 'Kısa bir mesajda, özellikle konuşan iki dil arasında geçiş yapıyorsa, dili seçmek otomatik algılamadan daha güvenilirdir.',
    },
    {
      title: 'İsimleri kelime ipucuna ekleyin.',
      text: 'Daha fazla seçenek bölümünde, anılan kişilerin, yerlerin ve dükkânların adlarını yazın. Böylece beklediğiniz biçimde yazılma olasılıkları artar.',
    },
    {
      title: 'Sayılara dayanarak harekete geçmeden önce kontrol edin.',
      text: 'Bir telefon numarası, adres, saat veya tutar yanlış duyulmuş olabilir. O satırı zaman damgasından oynatın ve güvenmeden önce yeniden dinleyin.',
    },
    {
      title: 'Başkalarının mesajlarına özen gösterin.',
      text: 'Yalnızca kendinizin gönderdiği veya aldığı ve kullanmakta özgür olduğunuz mesajları yazıya dökün; size özel olarak gönderilmiş bir mesajın metnini paylaşmadan önce düşünün.',
    },
  ],

  faqs: [
    {
      question: 'Uygulama olmadan WhatsApp ses mesajını yazıya çevirebilir miyim?',
      answer:
        'Evet. Ses mesajını dosya olarak kaydedin, bu sayfaya ekleyin ve metni okuyun. Bu sitede hesaba ihtiyacınız yok; kayıt ya da giriş de yok.',
    },
    {
      question: 'WhatsApp ses mesajı hangi dosya türüdür?',
      answer:
        'Genellikle bir .opus dosyasıdır. Bu sayfa onu doğrudan okur; bu yüzden önce MP3’e dönüştürmeniz gerekmez. OGG, M4A, MP3 veya AAC olarak kaydedilmiş sesli notlar da çalışır.',
    },
    {
      question: 'Hintçe veya Hintçe ile İngilizce karışımı için çalışır mı?',
      answer:
        'Evet. Hintçe desteklenen dillerden biridir. Varsayılan olarak metin Latin harfleriyle (Hinglish) yazılır; Devanagari için Transkript stili altında Özgün yazı’yı seçin. Dilleri karıştıran bir mesaj en iyi ana dili izler; bu yüzden emin olunmayan olarak işaretlenen satırları kontrol edin.',
    },
    {
      question: 'Ne kadar uzun bir WhatsApp ses mesajını yazıya dökebilirim?',
      answer:
        '{limits} Ses mesajları normalde kısadır; bu yüzden bu nadiren önem taşır. Günlük veya aylık kota yoktur.',
      browser: {
        answer:
          'Site boyut veya süre sınırı koymaz ve ses mesajları normalde kısadır; bu yüzden çabuk biter. Çok uzun bir kayıt cihazınızda zaman ve boş bellek gerektirir ve bazı tarayıcılar son derece uzun bir dosyayı kaldıramayabilir.',
      },
    },
    {
      question: 'Bu, WhatsApp ses mesajımın bir kopyasını saklıyor mu?',
      answer:
        'Yalnızca oturumunuz boyunca. Sunucu, oturum bitince ya da Verilerimi şimdi sil düğmesine bastığınızda dosyayı siler.',
      browser: {
        answer:
          'Yalnızca bu tarayıcıda: ses mesajı cihazınızdan hiç çıkmaz. Tarayıcınız bir süre işlem yapılmayınca onu temizler ve Verilerimi şimdi sil ile daha erken de temizleyebilirsiniz.',
      },
    },
  ],

  links: [
    {
      label: 'Hintçe sesi yazıya çevirme (İngilizce sayfa)',
      path: '/hindi-audio-to-text',
      note: 'Devanagari veya Latin harfleriyle Hintçe konuşma için ayarlar ve ipuçları.',
    },
    {
      label: 'Hinglish transkript aracı (İngilizce sayfa)',
      path: '/hinglish-transcription',
      note: 'Hintçenin Latin harfleriyle nasıl yazıldığı ve ne zaman kullanılacağı.',
    },
    {
      label: 'Konuşmayı İngilizce metne çevirme',
      path: '/translate-audio-to-english',
      note: 'Başka bir dildeki bir ses mesajından İngilizce metin alın.',
    },
    {
      label: 'Daha doğru bir transkript nasıl elde edilir',
      path: '/guides/accurate-transcripts',
      note: 'Bir mesaj hatalı çıktığında neyin değiştirilmesi gerektiği.',
    },
  ],
};
