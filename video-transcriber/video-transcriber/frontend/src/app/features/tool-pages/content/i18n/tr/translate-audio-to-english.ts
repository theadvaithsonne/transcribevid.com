import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Konuşmayı İngilizceye çevirme',
  h1: 'Konuşmayı İngilizce metne ve altyazıya çevirin',
  lead: 'Başka bir dildeki bir video veya ses dosyası ekleyin ve zaman damgalı İngilizce metin ya da bir İngilizce altyazı dosyası alın. Ücretsiz, girişsiz.',
  dropKind: 'video',
  dropNoun: 'Video veya ses dosyanızı',

  whyTitle: 'Konuşmayı İngilizceye çevirmek ne yapar',
  why: [
    'Çoğu konuşma tanıma, söyleneni söylendiği dilde yazar. İngilizceye çevirmek farklı bir iştir. Konuşmacı Hintçe, İspanyolca, Almanca ya da desteklenen başka bir dilde konuşur ve metin, her satırında bir zaman damgasıyla İngilizce çıkar. Takip edemediğiniz bir dersin, röportajın, haber klibinin veya aile videosunun özünü ya da başka bir dilde olan bir video için İngilizce altyazıyı istediğinizde işe yarar.',
    'Çevirdiği tek dil İngilizcedir. Fransızcaya, Hintçeye ya da başka bir dile çeviri yoktur ve yazılı metin çevrilmez: yalnızca kayıttaki konuşma. Bu sayfa, yükleyiciyi Çıktı İngilizceye çevir olarak ayarlı ve konuşulan dil Otomatik algıla üzerinde bırakılmış olarak başlatır.',
  ],

  sections: [
    {
      title: 'İngilizcenin ne kadar güvenilir olduğu ve neyin kontrol edileceği',
      paragraphs: [
        'Çeviri, yazıya dökmeden daha zordur. İngilizce doğrudan sesten üretilir; arada özgün dilde yazılı bir metin yoktur. Çoğu zaman anlamı izlemeye yetecek kadar iyidir, ancak cümleleri kısaltabilir ya da yeniden ifade edebilir, deyimleri ve esprileri kaçırabilir; isimleri, sayıları ve teknik kelimeleri yanlış yazabilir.',
        'Sonucu anlamak için bir taslak olarak görün, resmî bir çeviri olarak değil. Sözleşmeler, hukuki, tıbbi ya da diğer önemli malzemeler için bir insan çevirmene danışın ve başlangıç noktası olarak özgün dildeki bir transkripti kullanın.',
        'İyi bir alışkanlık, önce özgün dilde olağan bir transkript, sonra İngilizce sürümü yapmaktır. İkisinin birbiriyle çeliştiği görünen yer daha yakından dinlemeyi hak eder. Yeniden yazıya dök’ü kullandığınızda bitmiş bir transkript korunur; bu yüzden ikisi de aynı dosyadan gelebilir.',
      ],
    },
    {
      title: 'Hangi diller ve hangi kalite seçimleri iyi çevirir',
      bullets: [
        {
          title: 'Listedeki her dil.',
          text: 'Afrikaans’tan Galce’ye kadar 50’den fazla konuşulan dil İngilizceye çevrilebilir. Kalite çok değişir ve öğrenilecek kayıtlı konuşması az olan dillerde en zayıftır. Konuşma zaten İngilizceyse bu sayfaya ihtiyacınız yok: videoyu yazıya çevirme ya da sesi yazıya çevirme sayfalarını kullanın.',
        },
        {
          title: 'Dili belirtin ya da algılanmasına izin verin.',
          text: 'Ne konuşulduğundan emin değilseniz Dil’i Otomatik algıla üzerinde bırakın. Biliyorsanız onu seçmek, özellikle kısa veya aksanlı kliplerde daha güvenilirdir.',
        },
        {
          title: 'Çeviri için Yüksek doğruluktan kaçının.',
          text: 'Yüksek doğruluk, Large v3 Turbo modelini çalıştırır. Whisper’ı yapan OpenAI, Turbo’nun çeviri için eğitilmediğini ve çeviri istendiğinde bile özgün dili döndürdüğünü söylüyor. Daha fazla seçenek altındaki Model listesinde bulunan Distil Large v3 yalnızca İngilizcedir. Bir çeviri için Standart ile başlayın ve zor konuşma için En yüksek doğruluk’u (Large v3) seçin. Aynı Model listesindeki Medium da sağlam bir seçimdir.',
          browser: {
            text: 'Yüksek doğruluk, Large v3 Turbo modelini çalıştırır. Whisper’ı yapan OpenAI, Turbo’nun çeviri için eğitilmediğini ve çeviri istendiğinde bile özgün dili döndürdüğünü söylüyor. Daha fazla seçenek altındaki Model listesinde bulunan Distil Large v3 yalnızca İngilizcedir. Bir çeviri için Standart ile başlayın ve zor konuşma için, cihazınız sunuyorsa En yüksek doğruluk’u (Large v3) seçin. Aynı Model listesindeki Medium da sağlam bir seçimdir.',
          },
        },
        {
          title: 'Yalnızca Whisper.',
          text: 'Çeviri, Whisper tanıma motorunu gerektirir. Deneysel Qwen3 ASR seçeneği çeviri yapamaz: o seçiliyken İngilizceye çevir kullanılamaz ve onu seçmek Çıktı’yı yeniden Yazıya dök olarak ayarlar.',
        },
        {
          title: 'Transkript stili yok.',
          text: 'Transkript stili seçimi (Hinglish veya Özgün yazı) bir çeviriye uygulanmaz ve İngilizceye çevir seçiliyken gri gösterilir.',
        },
      ],
    },
    {
      title: 'İnsanlar İngilizce altyazı ve metinle ne yapar',
      bullets: [
        {
          title: 'Kendi videonuz için altyazı.',
          text: 'SRT veya VTT indirin. İngilizce satırlar özgün konuşmaya göre zamanlanmıştır; bu yüzden aynı videoya bir oynatıcıda ya da bir düzenleyicide eklenebilir.',
        },
        {
          title: 'Bir kaydı anlamak.',
          text: 'Bir röportajın, dersin veya haber raporunun neyle ilgili olduğunu, düzgün bir çeviriye ihtiyacı olup olmadığına karar vermeden önce okuyun.',
        },
        {
          title: 'Araştırma ve gazetecilik.',
          text: 'Bir İngilizce taslak, hangi bölümlerin özenle çevrilmesi, hangilerinin özgün dilden alıntılanması gerektiğine karar vermenize yardımcı olur.',
        },
      ],
    },
  ],

  howTitle: 'Konuşma İngilizceye nasıl çevrilir',
  howToDescription:
    'Başka bir dilde bir video veya ses dosyası ekleyin, İngilizceye çevir’in seçili olduğunu kontrol edin, İngilizce metni bekleyin ve indirin.',
  steps: [
    {
      title: 'Kaydınızı ekleyin',
      text: 'Kaydınızı bu sayfanın üstündeki kutuya bırakın ya da Dosya seç düğmesine basın. Daha fazla seçenek açık, Çıktı İngilizceye çevir olarak ayarlı ve Dil Otomatik algıla üzerinde olan yükleyiciye gelirsiniz. Biliyorsanız konuşulan dili seçin.',
    },
    {
      title: 'Kaliteyi seçin, sonra Yazıya dök’e basın',
      text: 'Standart makul bir başlangıçtır. Aksanlı, gürültülü veya teknik konuşma için En yüksek doğruluk’u seçin; daha uzun sürer ve genellikle daha az hata yapar. Çeviri için Yüksek doğruluk’u seçmeyin: çeviri için eğitilmemiş bir model kullanır. Ardından Yazıya dök düğmesine basın.',
      browser: {
        text: 'Standart makul bir başlangıçtır. Aksanlı, gürültülü veya teknik konuşma için, cihazınız sunuyorsa En yüksek doğruluk’u seçin (çalıştıramadığı bir seçenek nedeniyle birlikte gri gösterilir); ilk seferde büyük bir indirmedir, daha uzun sürer ve genellikle daha az hata yapar. Çeviri için Yüksek doğruluk’u seçmeyin: çeviri için eğitilmemiş bir model kullanır. Ardından Yazıya dök düğmesine basın.',
      },
    },
    {
      title: 'İngilizce metni bekleyin',
      text: 'İngilizce satırlar zamanlarıyla görünür. Transkript stili, yalnızca transkriptlere uygulandığı, çevirilere uygulanmadığı için gri gösterilir.',
    },
    {
      title: 'Kontrol edin ve indirin',
      text: 'Emin olunmayan olarak işaretlenen satırları okuyun, isimleri ve sayıları sesle karşılaştırın, ardından TXT, SRT veya VTT, ya da PDF, Markdown veya JSON dosyası indirin.',
    },
  ],

  formatsTitle: 'Giren dosyalar, çıkan İngilizce metin',
  formatsIntro:
    'Hangi dil konuşulursa konuşulsun birçok biçimdeki video ve ses çalışır. İndirdiğiniz dosyalar İngilizce metni içerir.',
  uploadTitle: 'Ekleyebileceğiniz dosyalar',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'MKV', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'okumak için İngilizce metin' },
    { name: 'SRT', use: 'konuşmaya göre zamanlanmış İngilizce altyazı' },
    { name: 'VTT', use: 'bir web oynatıcısı için İngilizce altyazı' },
    { name: 'PDF', use: 'yazdırılabilir bir kopya' },
    { name: 'Markdown', use: 'başlıklar ve zamanlar içeren metin' },
    { name: 'JSON', use: 'kendi araçlarınız için satırlar ve zamanlar' },
  ],

  tipsTitle: 'Daha iyi çeviriler için ipuçları',
  tips: [
    {
      title: 'Biliyorsanız konuşulan dili belirtin.',
      text: 'Otomatik algılama net konuşma için yeterlidir, ancak kısa bir klipte yanlış bir tahmin kötü bir çeviri verir.',
    },
    {
      title: 'Klipleri tek dilde tutun.',
      text: 'Sürekli diller arasında geçen bir kayıt çeviriyi şaşırtabilir. Onu bölün ya da ne duyulduğunu görmek için önce olağan bir transkript yapın.',
    },
    {
      title: 'Sayıları, isimleri ve tarihleri kontrol edin.',
      text: 'Bunlar en çok önem taşıyan ve çevrilmiş bir taslakta en sık yanlış çıkan ayrıntılardır.',
    },
    {
      title: 'İlk dakikayı deneyin.',
      text: 'Tüm dosyaya güvenmeden önce İngilizcenin ilk dakikasını sesle karşılaştırarak okuyun.',
    },
    {
      title: 'Özgün metni İngilizcenin yanında tutun.',
      text: 'Bir alıntı yayımlarsanız özgün dildeki transkripti İngilizce sürümün yanında tutun.',
    },
  ],

  faqs: [
    {
      question: 'İngilizce dışındaki dillere de çevirebilir mi?',
      answer:
        'Hayır. Çevirdiği tek dil İngilizcedir. Konuşmayı kendi dilinde okumak için bunun yerine olağan bir transkript yapın.',
    },
    {
      question: 'Çevrilmiş bir transkript neden olağan bir transkriptten daha az kesindir?',
      answer:
        'Çeviri, kelimeleri yazmaktan daha zor bir iştir. Konuşmanın tek adımda anlaşılıp yeniden ifade edilmesi gerekir; bu yüzden cümleler kısalabilir, deyimler ve espriler kaçabilir, isimler yanlış duyulabilir. Önemli her şeyi sesle ya da özgün dildeki bir transkriptle karşılaştırarak kontrol edin.',
    },
    {
      question: 'Çevirim neden özgün dilde çıktı?',
      answer:
        'Büyük olasılıkla neden kalite seçimidir. Yüksek doğruluk, çeviri için eğitilmemiş ve onun yerine özgün dili yazma eğiliminde olan Large v3 Turbo modelini çalıştırır. Standart ya da En yüksek doğruluk ile yeniden başlayın ve Çıktı’nın İngilizceye çevir olarak ayarlandığını kontrol edin.',
    },
    {
      question: 'Başka bir dildeki bir video için İngilizce altyazı alabilir miyim?',
      answer:
        'Evet. Çeviriden sonra SRT veya VTT indirin. İngilizce satırlar özgün konuşmanın zamanlamasını taşır. Yayımlamadan önce baştan sona okuyun ve çevirinin bir taslak olduğunu unutmayın.',
    },
    {
      question: 'İngilizceye çevir’i neden seçemiyorum?',
      answer:
        'Deneysel Qwen3 ASR motoru için kullanılamaz. Daha fazla seçenek bölümünde Tanıma motoru’nu yeniden Whisper’a getirin; seçenek geri gelir.',
    },
  ],

  links: [
    {
      label: 'Hintçe sesi yazıya çevirme (İngilizce sayfa)',
      path: '/hindi-audio-to-text',
      note: 'Hintçe konuşmayı çevirmeden önce kendi dilinde okuyun.',
    },
    {
      label: 'İspanyolca sesi yazıya çevirme (İngilizce sayfa)',
      path: '/spanish-audio-to-text',
      note: 'Çevirmeden, aksanlarıyla birlikte bir İspanyolca transkript yapın.',
    },
    {
      label: 'YouTube altyazı oluşturucu',
      path: '/youtube-subtitle-generator',
      note: 'Kendi videonuz için bir SRT yapın ve YouTube Studio’ya yükleyin.',
    },
    {
      label: 'Videoya altyazı nasıl eklenir',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'SRT veya VTT dosyasına sahip olduktan sonra ne yapacağınız.',
    },
  ],
};
