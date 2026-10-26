import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Daha doğru bir transkript nasıl elde edilir',
  lead: 'Doğruluk önce sese, sonra kontrol edebildiğiniz üç seçime bağlıdır: dil, kalite düzeyi ve bir kelime ipucu. Bu rehber, kayıt yapmadan önce neyi değiştireceğinizi, hangi ayarların işe yaradığını, geriye kalan hataları nasıl yakalayacağınızı ve konuşma tanımanın hiç yapamadığı şeyleri gösterir.',
  readingMinutes: 9,
  toolPath: '/video-to-text',
  toolCta: 'Bir videoyu en iyi ayarlarla yazıya dökün',
  blocks: [
    {
      title: 'Bir transkriptin doğruluğunu ne belirler',
      paragraphs: [
        'Konuşma tanıma da sizin gibi dinler. Biri net konuşuyorsa, mikrofona yakınsa, sessiz bir odadaysa ve modelin iyi bildiği bir dildeyse transkript genellikle çok iyi olur. Ses uzaksa, gürültülüyse, yankılanıyorsa ya da seslerle doluysa bir insan bile dikkatini vermek zorunda kalır ve yazılım daha çok hata yapar.',
        'Bu, basit bir öncelik sırası verir. Önce sesi düzeltin; çünkü hiç kaydedilmemiş kelimeleri sonrasında hiçbir şey geri getiremez. Sonra programa dili söyleyin. Sonra zorluğa uygun bir kalite düzeyi seçin. Sonra tahmin edemeyeceği alışılmadık kelimeleri verin. Son olarak sonucu kontrol edin; çünkü hiçbir transkript kusursuz değildir.',
      ],
    },
    {
      title: 'Kaydın kendisini iyileştirin',
      paragraphs: [
        'Kayıt yaparken gösterilen birkaç dakikalık özen, sonradan yapılan hiçbir ayardan daha değerlidir.',
      ],
      bullets: [
        {
          title: 'Yaklaşın.',
          text: 'Mikrofonu konuşmacının ağzından bir iki el boyu uzağa koyun. Yakın tutulan bir telefon, masanın karşısındaki dizüstü bilgisayardan iyidir.',
        },
        {
          title: 'Sessiz ve yumuşak bir oda seçin.',
          text: 'Perdeler, halı ve koltuklar yankıyı emer. Çıplak duvarlar ve büyük boş odalar kelimeleri birbirine karıştırır. Vantilatörleri, klimayı ve bildirimleri kapatın.',
        },
        {
          title: 'Müziği sesin altından çıkarın.',
          text: 'Arka plandaki müziği konuşmadan ayırmak zordur. Müziği yazıya dökmeden önce değil, sonra ekleyin.',
        },
        {
          title: 'Bir seferde tek ses.',
          text: 'Üst üste konuşmalar en zor durumdur. İnsanlardan birbirini beklemesini isteyin ve mümkünse kişi başına bir mikrofon kullanın.',
        },
        {
          title: 'Örnekleme hızını dert etmeyin.',
          text: 'Konuşma modelleri sesi 16 kHz mono olarak okur ve sayfa her dosyayı otomatik olarak buna dönüştürür. Daha yüksek bir hız ya da çevresel bir miks yardımcı olmaz; mesafe, gürültü ve ses düzeyi yardımcı olur.',
        },
        {
          title: 'Ağır sıkıştırmadan kaçının.',
          text: 'Zayıf bir bağlantı üzerinden sıkıştırılmış bir ses mesajı gibi çok düşük bit hızlı dosyalar, modelin ihtiyaç duyduğu ayrıntıyı kaybeder. Elinizde varsa özgün kaydı kullanın.',
        },
      ],
    },
    {
      title: 'Ona dili söyleyin',
      paragraphs: [
        'Sayfa dili kendiliğinden algılayabilir ve net İngilizceyle yapılmış uzun bir kayıtta çoğunlukla doğru bulur. Ancak kısa klipler, güçlü aksanlar ve dilleri karıştıran kayıtlarda algılama yanlış tahmin edebilir ve yanlış bir tahmin tüm transkripti kötüleştirir. Dil listesinden dili seçmek tek bir tıklamadır ve riski ortadan kaldırır.',
        'Sayfa dili güvenle belirleyemezse bunu söyler ve duyduğunuz dili seçmenizi ister. Bunu yapın ve yeniden çalıştırın. Hintçe ile İngilizce gibi iki dil arasında geçiş yapan konuşmalarda ana dili seçin ve diğer dildeki bölümleri kontrol edin.',
      ],
    },
    {
      title: 'Doğru kalite düzeyini seçin',
      paragraphs: [
        'Dört kalite seçimi, aynı model ailesinin farklı boyutlarını çalıştırır. Daha büyük bir model aksanlarda, gürültüde, diğer dillerde ve seyrek kelimelerde daha az hata yapar; ancak daha uzun sürer ve ilk indirmesi daha büyüktür.',
      ],
      table: {
        caption: 'Kalite seçimleri ve her birinin ne zaman kullanılacağı',
        head: ['Seçim', 'En uygun olduğu durum', 'Ödün'],
        rows: [
          [
            'En hızlı',
            'Sessiz bir kayıtta net konuşma, hızlı taslaklar',
            'Zor seste dördü arasında en çok hata yapan',
          ],
          [
            'Standart',
            'Çoğu video ve ses kaydı (olağan başlangıç seçimi)',
            'Hız ve doğruluk arasında iyi bir denge',
          ],
          [
            'Yüksek doğruluk',
            'Aksanlar, arka plan gürültüsü, İngilizce dışındaki konuşmalar',
            'Daha yavaş, daha büyük indirme',
          ],
          [
            'En yüksek doğruluk',
            'Her kelimenin önemli olduğu zor ses',
            'En yavaş, en büyük indirme',
          ],
        ],
      },
      after: [
        'İyi bir alışkanlık, kaydınızın kısa bir örneğinde Standart ile başlamak, onu okumak ve yalnızca hatalar sizi rahatsız ederse bir düzey yukarı çıkmaktır. Daha fazla seçenek altında modellerin tam listesinden de seçim yapabilirsiniz. Bazı cihazlarda Yüksek doğruluk ve En yüksek doğruluk, nedeni gösterilerek gri durur; örneğin “8 GB gerekir” ya da “bu boyut için bir bilgisayar kullanın”; çünkü daha büyük modeller daha fazla bellek ister. Her büyük seçim aynı zamanda daha büyük bir ilk indirmedir ve sayfa başlamadan önce boyutunu gösterir.',
      ],
    },
    {
      title: 'İsimler ve teknik terimler için kelime ipucunu kullanın',
      paragraphs: [
        'Konuşma modelleri yaygın kelimeleri iyi, seyrek olanları zayıf bilir. Bir kişi adı, şirket, ürün, yer ya da teknik terim modelin en olası bulduğu şekilde yazılır ve bu çoğunlukla yanlıştır. Daha fazla seçenek altındaki Kelime ipucu bunun için vardır.',
        'Alışılmadık kelimeleri yazılmasını istediğiniz gibi yazın; örneğin “Interview with Dr. Okafor about Kubernetes and PostgreSQL.” gibi bir cümle. Kelimeleri içeren kısa, doğal bir satır, uzun bir listeden daha iyi çalışır. İsteğe bağlıdır ve 1.000 karaktere kadar alabilir. Özel isimler içerebileceği için sayfa onu hatırlanan ayarlarınızda saklamaz.',
        'İpucu yazım konusunda yardımcı olur. Mırıldanılan ya da gürültüyle örtülen bir kelimeyi duymayı modele öğretmez.',
      ],
    },
    {
      title: 'Sesi iyileştir ve Sessizlikleri ve müziği atla',
      paragraphs: [
        'Daha fazla seçenek altındaki iki anahtar varsayılan olarak açıktır ve çoğu kayıt için açık bırakmalısınız.',
      ],
      bullets: [
        {
          title: 'Sesi iyileştir.',
          text: 'Çok alçak uğultuyu ve çok yüksek cızırtıyı süzer, sonra ses düzeyini dengeler; böylece sessiz bir konuşmacı yüksek sesli birinin yanında kaybolmaz. Bir kayıt size iyi geliyor ama transkript tuhafsa, filtrenin nedeni olup olmadığını görmek için bir kez bu anahtar kapalıyken deneyin.',
        },
        {
          title: 'Sessizlikleri ve müziği atla.',
          text: 'Bir konuşma algılayıcı, insan sesinin olduğu bölümleri bulur ve yalnızca onları modele geçirir. Sessizlik ve şarkı sözü olmayan müzik gibi konuşma dışı seslerin çoğu ona hiç ulaşmaz; bu da bir modelin duyacak hiçbir şey verilmediğinde üretebildiği uydurma metnin büyük bölümünü önler. Şarkı sözlü müzik yine de geçebilir. Yalnızca kısık konuşma atılıyorsa kapatın.',
        },
      ],
      after: [
        'Kelime düzeyinde zamanlama da varsayılan olarak açıktır. Hangi kelimelerin bulunacağını değiştirmez; ancak altyazıların kelimelerle tam olarak başlayıp bitmesini ve hangi kelimelerin belirsiz olduğunu gösteren işaretleri sağlar.',
      ],
    },
    {
      title: 'Sonucu kontrol edin: hatalar nerede saklanır',
      paragraphs: [
        'Transkript hazır olduğunda önce onu baştan sona okumayın. İşaretlere bakın. Modelin daha az emin olduğu kelimelerin altı çizilir; en belirsiz olanlarınki daha kalın çizilir. Transkriptin tamamında güven düşükse ya da dil belirsizse sayfa, dili ve kaliteyi gözden geçirmek için bir düğme içeren bir uyarı gösterir.',
        'Güven puanı nereye bakacağınıza dair bir ipucudur, bir doğruluk yüzdesi değildir; bu yüzden altı çizili olmayan bir kelime de yanlış olabilir. Dikkatinizi şu sırayla harcayın:',
      ],
      bullets: [
        {
          title: 'İsimler ve yerler.',
          text: 'Bunlar en yaygın ve en utandırıcı hatalardır.',
        },
        {
          title: 'Sayılar, tarihler ve birimler.',
          text: 'Yanlış bir rakam anlamı değiştirir. Her birini kayıtla karşılaştırın.',
        },
        {
          title: 'Kulağa benzer gelen kelimeler.',
          text: 'Bağlamdan seçilirler ve birbirinin yerine geçebilirler; “hâlâ” ile “hala” gibi.',
        },
        {
          title: 'Gürültünün ya da üst üste seslerin yakınındaki bölümler.',
          text: 'Zaman damgasında yeniden dinleyin. O ana atlamak için bir satıra tıklayın.',
        },
      ],
      after: [
        'Bulduklarınızı doğrudan metinde düzeltin. Düzenlemeleriniz transkriptte saklanır ve her dışa aktarmaya yansır.',
      ],
    },
    {
      title: 'Sorun ve neyi denemeli',
      table: {
        caption: 'Yaygın sorunlar ve önce neyi denemeli',
        head: ['Sorun', 'Neyi denemeli'],
        rows: [
          ['Yanlış dil ya da yanlış yazıda metin', 'Otomatik algıla yerine dili kendiniz seçin'],
          [
            'Yanlış yazılan isimler ve markalar',
            'Onları Daha fazla seçenek altındaki Kelime ipucuna ekleyin, sonra dosyayı ana sayfadan yeniden yazıya dökün',
          ],
          [
            'Aksanlarda ya da gürültülü seste çok hata',
            'Bir kalite düzeyi yukarı çıkın ve Sesi iyileştir’i açık tutun',
          ],
          [
            'Kimsenin konuşmadığı yerde metin çıkıyor',
            'Sessizlikleri ve müziği atla’yı açık tutun; uzun sessiz ya da yalnızca müzik olan bölümleri kırpın',
          ],
          [
            'Aynı ifade defalarca tekrarlanıyor',
            'Önceki metni bağlam olarak kullan’ı kapalı tutun ve farklı bir kalite düzeyi deneyin',
          ],
          [
            'İki kişi birbirinin üstüne konuşuyor',
            'Yazılımla çözümü yoktur: bir dahaki sefere onları ayrı mikrofonlara kaydedin',
          ],
          [
            'Çok kısık ya da uzak bir konuşmacı kaçıyor',
            'Sesi iyileştir’i açık tutun; konuşma yine de atılıyorsa o dosya için Sessizlikleri ve müziği atla’yı kapatın',
          ],
        ],
      },
    },
    {
      title: 'Konuşma tanımanın yapamadıkları',
      paragraphs: [
        'Sınırları bilmek, sorunları erken fark etmenize yardımcı olur. Bunun dahil olduğu herhangi bir konuşma tanımadan çıkan transkript şunları içerebilir.',
      ],
      bullets: [
        {
          title: 'Konuşmacı adı yok.',
          text: 'Ne söylendiğini yazar, kimin söylediğini değil. Düzenlerken adları elle ekleyin.',
        },
        {
          title: 'Uydurma metin.',
          text: 'Sessizlik, müzik ya da gürültü verildiğinde bir model kimsenin söylemediği akıcı sözcükler üretebilir ya da bir ifadeyi defalarca tekrarlayabilir. Hiçbir şey duymadığınız yerde metin görürseniz silin.',
        },
        {
          title: 'Yanlış eşsesli ve seyrek kelimeler.',
          text: 'En olası kelimeyi seçer ve bu her zaman doğru olmaz.',
        },
        {
          title: 'Karışık konuşmada kaybolan kelimeler.',
          text: 'Üst üste konuşma genellikle tek bir ses olarak yazıya dökülür ya da kısmen atılır.',
        },
        {
          title: 'Garanti yok.',
          text: 'Hukuki, tıbbi, mali ya da yayımlanacak her şey için transkripti, bir insanın kontrol etmesi gereken bir taslak olarak görün.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Hangi kalite düzeyi en doğru transkripti verir?',
      answer:
        'En yüksek doğruluk çoğunlukla en az hatayı yapar; Yüksek doğruluk çoğu kez hemen arkasındadır, ardından Standart ve En hızlı gelir. Fark en çok aksanlarda, gürültüde ve İngilizce dışındaki dillerde önemlidir. Net İngilizce konuşmada farklar küçüktür; bu yüzden Standart çoğunlukla yeter.',
    },
    {
      question: 'Daha iyi bir mikrofon, daha iyi bir ayardan daha çok yardımcı olur mu?',
      answer:
        'Çoğunlukla evet. Temiz ve yakın ses, daha küçük bir modelin iyi iş çıkarmasını sağlar; kötü ses ise en büyüğünü bile sınırlar. Mikrofonu yaklaştırmak ve arka plan gürültüsünü kesmek yapabileceğiniz en ucuz iyileştirmedir.',
    },
    {
      question: 'Yazıya dökmeden önce sesi bir düzenleyicide temizlemeli miyim?',
      answer:
        'Nadiren. Sesi iyileştir açıkken sayfa zaten uğultuyu ve cızırtıyı süzer, ses düzeyini dengeler. Bir düzenleyicideki ağır gürültü azaltma filtreleri konuşmayı bozabilir ve tanımayı kötüleştirebilir; bu yüzden yumuşak ayarlar kullanın ya da hiç kullanmayın.',
    },
    {
      question: 'İki kalite düzeyi aynı dosya için neden farklı metin veriyor?',
      answer:
        'Bunlar modelin farklı boyutlarıdır; bu yüzden her biri zor bir bölümü kendi yoluyla duyar ve yazar. İki çalıştırmanın uyuşmadığı yerde, o bölümü zaman damgasında dinleyin; çünkü büyük olasılıkla zor bir bölümdür ve kulakla kontrol etmeye değer.',
    },
    {
      question: 'Transkripti düzenleyerek daha doğru hâle getirebilir miyim?',
      answer:
        'Düzenleme, dışa aktardığınız metni düzeltir; modeli yeniden eğitmez. İsimleri, sayıları ve belirsiz kelimeleri transkript sayfasında düzeltin ve düzeltilmiş sürümü indirin. Kelime ipucuyla yapılan yeni bir çalıştırma, bir sonraki sefer düzeltmeleri azaltır.',
    },
  ],
  links: [
    {
      label: 'Whisper nedir?',
      path: '/guides/what-is-whisper',
      note: 'Kalite düzeylerinin arkasındaki konuşma modeli ve nerede güçlü ya da zayıf olduğu.',
    },
    {
      label: 'Röportaj yazıya dökme',
      path: '/interview-transcription',
      note: 'İki sesin ve çok sayıda ismin olduğu bir sohbeti yazıya dökmek için ipuçları.',
    },
    {
      label: 'Ders kaydını yazıya çevirme',
      path: '/lecture-to-text',
      note: 'Büyük bir odanın arkasından bile kaydedilmiş bir dersten notlar alın.',
    },
    {
      label: 'Hintçe sesi yazıya çevirme',
      path: '/hindi-audio-to-text',
      note: 'Dil seçimi, Hintçe ve İngilizce dışındaki diğer konuşmalar için en çok önem taşır.',
    },
    {
      label: 'Bir videoyu yüklemeden yazıya dökme',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Tarayıcı içi motorun nasıl çalıştığı ve kullandığınız cihazın neyi değiştirdiği.',
    },
  ],
};
