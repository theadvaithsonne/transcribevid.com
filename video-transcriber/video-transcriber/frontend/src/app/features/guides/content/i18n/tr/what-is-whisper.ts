import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Whisper nedir? Konuşmadan metne açıklaması',
  lead: 'Whisper, OpenAI’ın 2022’de yayımladığı açık kaynaklı bir konuşma tanıma modelidir. Konuşulan sesi yaklaşık yüz dilde metne dönüştürür ve kendi bilgisayarınızda çalışabilir. Bu rehber nereden geldiğini, neyden öğrendiğini, nasıl çalıştığını, nerede güçlü ve zayıf olduğunu ve TranscribeVid’in onu tarayıcınızın içinde nasıl çalıştırdığını açıklar.',
  readingMinutes: 7,
  toolPath: '/audio-to-text',
  toolCta: 'Whisper’ı kendi sesinizde deneyin',
  blocks: [
    {
      title: 'Bir paragrafta Whisper',
      paragraphs: [
        'Whisper, konuşmayı dinlemek ve duyduğunu yazmak üzere eğitilmiş bir sinir ağıdır. Ona ses verirsiniz; o size zaman damgalı metin döndürür; ayrıca dili adlandırabilir ve konuşmayı İngilizceye çevirebilir. Bir telefona sığan minik bir sürümden, güçlü bir bilgisayar gerektiren büyük bir sürüme kadar birkaç boyutta gelir.',
        'Bir web sitesi ya da hizmet değildir. Bir dosya kümesidir: model ve onu çalıştıran kod. Herkes onları indirip kullanabilir; bu yüzden bu araç dahil birçok ücretsiz ve gizli yazıya dökme aracı onun üzerine kurulmuştur.',
      ],
    },
    {
      title: 'Nereden geldi',
      paragraphs: [
        'OpenAI, Whisper’ı Eylül 2022’de “Robust Speech Recognition via Large-Scale Weak Supervision” adlı bir araştırma makalesiyle birlikte yayımladı. Kod ve eğitilmiş modeller, en esnek açık kaynak lisanslarından biri olan MIT lisansı altında paylaşıldı. Bu lisans, ticari ürünler dahil yazılımı kullanmaya, değiştirmeye ve dağıtmaya izin verir.',
        'Whisper’dan önce en iyi konuşma tanıma çoğunlukla büyük şirketlerin hizmetlerinin içinde kilitliydi ya da tek bir dil veya tek tür ses için yapılmıştı. Whisper, yeterince iyi, yeterince geniş ve kendi başınıza çalıştırması ücretsiz olarak bunu değiştirdi. OpenAI ayrıca kendi web hizmeti üzerinden konuşma tanımaya erişim satar; ancak bu ayrı, ücretli bir üründür. Burada tarayıcınızda çalıştırdığınız model, açık olandır.',
      ],
    },
    {
      title: 'Neyle eğitildi',
      paragraphs: [
        'Whisper, internetten toplanan, yazılı dökümlerle eşleştirilmiş yaklaşık 680.000 saatlik sesten öğrendi. Bu sesin kabaca üçte biri İngilizce değildi ve yaklaşık yüz dili kapsıyordu (yayımlanan sürüm 99 dil sayıyor). Dökümlerin hepsi elle kontrol edilmedi; makale başlığındaki “zayıf denetim” buna işaret eder.',
        'Bundan iki pratik sonuç çıkar. Eğitim sesi çok çeşitli olduğu için (farklı mikrofonlar, aksanlar, odalar ve konular), Whisper gerçek kayıtlarla düzenli stüdyo konuşmasıyla eğitilmiş modellerden daha iyi başa çıkar. Ancak eğitim sesinin miktarı dilden dile değişir; bu yüzden doğruluk eşit değildir: genellikle İngilizce ve bol örneği olan diğer yaygın konuşulan dillerde en güçlüdür, eğitim verisi az olan dillerde daha zayıftır.',
      ],
    },
    {
      title: 'Nasıl çalışır, sade sözcüklerle',
      paragraphs: [
        'Whisper sesi 30 saniyelik pencerelere böler ve her birini, hangi perdenin zaman içinde ne kadar yüksek olduğunu gösteren, spektrogram adı verilen bir ses resmine dönüştürür. Model sonra iki yarıdan oluşur. Bir kodlayıcı o resmi inceler. Bir kod çözücü ise metni, bir insanın bir cümleyi sıradaki sözü düşünerek yazması gibi, küçük parçalar hâlinde birer birer yazar.',
        'Kod çözücü ayrıca özel işaretler de yazar: hangi dilin konuşulduğuna inandığı, yazıya mı döküleceği yoksa çevrileceği ve her cümlenin zamanda nerede başlayıp bittiği. Zaman damgaları buradan gelir.',
        'Uzun kayıtlar pencere pencere işlenir. Bu tasarım esnektir, ancak Whisper’ın iki alışkanlığını da açıklar: pencereler arasında ipin ucunu kaçırabilir ve bir pencerede az konuşma olduğunda kendini tekrar edebilir. TranscribeVid bunların ikisini de, model görmeden önce sessizliği ve konuşma dışı seslerin çoğunu atlayan bir konuşma algılayıcıyla ve sonradan tekrarlanan ya da uydurulan metnin bir kısmını yakalayan denetimlerle azaltır.',
      ],
    },
    {
      title: 'Model boyutları ve burada hangisini aldığınız',
      paragraphs: [
        'Whisper boyutlar hâlinde gelir. Daha büyük modeller, özellikle gürültüde ve İngilizce dışındaki dillerde daha az hata yapar; ancak daha yavaştır ve daha fazla bellek ile daha büyük bir indirme ister. Yükleme sayfasındaki dört kalite seçimi bu boyutlarla şöyle eşleşir:',
      ],
      table: {
        caption: 'Whisper boyutları ve TranscribeVid’deki seçimler',
        head: ['Model', 'Parametre (yaklaşık)', 'Burada nerede bulunur'],
        rows: [
          ['Tiny', '39 milyon', 'Daha fazla seçenek, Model listesi'],
          ['Base', '74 milyon', 'En hızlı'],
          ['Small', '244 milyon', 'Standart'],
          ['Medium', '769 milyon', 'Daha fazla seçenek, Model listesi'],
          ['Large v3 Turbo', '809 milyon', 'Yüksek doğruluk'],
          ['Large v3', '1,55 milyar', 'En yüksek doğruluk'],
        ],
      },
      after: [
        'Large v3 Kasım 2023’te yayımlandı; Turbo sürümü ise 2024’te daha sonra geldi. Turbo, çok daha hızlı olan ve birçok dilde doğrulukta ona yakın kalan, kırpılmış bir büyük modeldir; Yüksek doğruluk seçimi olmasının nedeni de budur. Bir sınırı var: OpenAI, Turbo’nun çeviri için eğitilmediğini ve çevirmesi istendiğinde özgün dili döndürebileceğini söylüyor; bu yüzden Çıktı, İngilizceye çevir için bunun yerine En yüksek doğruluk’u seçin. Model listesinde ayrıca Distil Large v3 de vardır: yalnızca İngilizce için, Whisper large v3’ün daha küçük ve daha hızlı damıtılmış bir sürümü. Tanıma motoru altında ayrıca, WebGPU olan masaüstü tarayıcılar için farklı, deneysel bir motor olan Qwen3 ASR de bulunur. Qwen3 ASR bir Whisper modeli değildir.',
      ],
    },
    {
      title: 'İyi yaptığı şeyler',
      bullets: [
        {
          title: 'Gerçek dünya sesi.',
          text: 'Orta düzeyde gürültülü telefon kayıtları, dersler, röportajlar ve video ses kayıtları.',
        },
        {
          title: 'Tek modelde birçok dil.',
          text: 'Aynı model ailesi İngilizceyi, İspanyolcayı, Hintçeyi, Arapçayı, Japoncayı ve düzinelerce dili daha işler; çoğunlukla dili kendisi de bulabilir.',
        },
        {
          title: 'Noktalama ve büyük/küçük harf.',
          text: 'Cümleleri, tek uzun bir küçük harfli kelime dizisi yerine büyük harfler ve noktalamayla yazar.',
        },
        {
          title: 'Zaman damgaları.',
          text: 'Her satır bir başlangıç ve bitiş zamanıyla gelir; kelime düzeyinde zamanlamayla sayfa her kelimeyi yerleştirebilir.',
        },
        {
          title: 'İngilizceye çeviri.',
          text: 'Başka bir dildeki konuşmayı doğrudan İngilizce metne çevirebilir; sayfa bunu Çıktı, İngilizceye çevir olarak sunar. Turbo bunun istisnasıdır: çeviri için eğitilmemiştir; bunun için En yüksek doğruluk’u kullanın.',
        },
      ],
    },
    {
      title: 'Zorlandığı yerler',
      paragraphs: [
        'Whisper etkileyicidir ve aynı zamanda yanılabilir. Bir transkripte güvenmeden önce bu alışkanlıkları bilin.',
      ],
      bullets: [
        {
          title: 'Metin uydurabilir.',
          text: 'Sessizlik, müzik ya da gürültü verildiğinde kimsenin söylemediği akıcı sözcükler yazabilir ya da bir ifadeyi defalarca tekrarlayabilir. Bu, tek bir kaydın kusuru değil, modelin bilinen bir davranışıdır.',
        },
        {
          title: 'İsimler, sayılar ve seyrek kelimeler.',
          text: 'Bir ismi en olası bulduğu şekilde yazar ve benzer sesli kelimeleri değiştirebilir. Kelime ipucunu kullanın, sonra rakamları kontrol edin.',
        },
        {
          title: 'Eşit olmayan diller.',
          text: 'Doğruluk dile ve aksana göre değişir. Daha büyük bir model, eğitim verisi az olan dillerde çok yardımcı olur.',
        },
        {
          title: 'Konuşmacı etiketi yok.',
          text: 'Kimin konuştuğunu söylemez ve üst üste sesler çoğunlukla birleştirilir ya da atılır.',
        },
        {
          title: 'Canlı değil.',
          text: 'Bir kayıt üzerinde pencere pencere çalışır; bu yüzden biri konuşurken beliren altyazılar için tasarlanmamıştır.',
        },
      ],
    },
    {
      title: 'TranscribeVid, Whisper’ı tarayıcınızda nasıl çalıştırır',
      paragraphs: [
        'Özgün Whisper, uzmanlaşmış makine öğrenmesi yazılımları için yazılmıştır. Onu bir web sayfasında çalıştırmak için modeller ONNX adlı taşınabilir bir biçime dönüştürülür ve Hugging Face’in Transformers.js adlı bir kitaplığı onları ONNX Runtime ile çalıştırır. WebGPU olan bir bilgisayarda iş hızlı olan grafik çipi tarafından yapılır. Aksi hâlde işlemcide WebAssembly aracılığıyla çalışır; bu daha yavaştır ama neredeyse her yerde işe yarar.',
        'İndirmeleri makul tutmak için modeller dosyaları küçülten, çoğunlukla doğrulukta küçük bir kayba mal olan sıkıştırılmış sayı biçimleri kullanır. En büyük modelin birkaç gigabayt yerine WebGPU ile yaklaşık bir gigabayt (WebAssembly ile 1,8 GB) olmasının nedeni budur.',
        'transcribevid.com’da tarayıcıda çalışmanın iki sonucu vardır. Birincisi gizlilik: medya dosyanız cihazınızda okunur ve yüklenmez; bu yüzden hiçbir sunucumuz sesinizi almaz. İkincisi hız: cihazınıza bağlıdır ve her kalite düzeyinin ilk kullanımı tek seferlik bir model indirmesini içerir. Yüklemeden yazıya dökme rehberi, nelerin indirildiğini ve bunun nasıl kontrol edileceğini açıklar.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Whisper’ı kullanmak ücretsiz mi?',
      answer:
        'Model ve kodu MIT lisansı altında ücretsiz ve açık kaynaklıdır; bu yüzden herkes çalıştırabilir. Büyük bir modeli çalıştırmak, yetenekli bir bilgisayar ya da kiralanmış bir sunucu gerektirir ve OpenAI ayrıca kendi ücretli web hizmetini de sunar. transcribevid.com’da cihazınızda çalışır; bu yüzden ödeyeceğiniz bir şey yoktur.',
    },
    {
      question: 'Whisper kaç dil anlıyor?',
      answer:
        'Yaklaşık yüz; yayımlanan sürüm 99 dil sayıyor. Kalite aralarında çok değişir. TranscribeVid bunlardan 61’ini Dil listesinde sunar ve ayrıca Otomatik algıla’yı da seçebilirsiniz.',
    },
    {
      question: 'Hangi Whisper boyutunu seçmeliyim?',
      answer:
        'Small modeli olan Standart ile başlayın. Aksanlar, gürültü ya da İngilizce dışındaki diller için Yüksek doğruluk’a, her kelimenin önemli olduğu ve bekleyebildiğiniz durumlar için En yüksek doğruluk’a geçin. En hızlı yalnızca net, sessiz konuşma içindir.',
    },
    {
      question: 'Whisper bazen kimsenin konuşmadığı yerde neden kelime yazıyor?',
      answer:
        'Model her zaman akla yatkın metin üretecek şekilde yapılmıştır; bu yüzden bir sessizlik, müzik ya da gürültü bölümü onu uydurmaya itebilir. Sessizlikleri ve müziği atla’yı açık tutmak, bu bölümlerin çoğunu model görmeden önce atlar.',
    },
  ],
  links: [
    {
      label: 'Daha doğru bir transkript nasıl elde edilir',
      path: '/guides/accurate-transcripts',
      note: 'Whisper’ın çıktısında en büyük farkı yaratan ayarlar ve alışkanlıklar.',
    },
    {
      label: 'Bir videoyu yüklemeden yazıya dökme',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Tarayıcınızın Whisper’ı çalıştırmak için neleri indirdiği ve hiçbir şeyin yüklenmediğini nasıl doğrulayacağınız.',
    },
    {
      label: 'Konuşmayı İngilizceye çevirme',
      path: '/translate-audio-to-english',
      note: 'Başka bir dildeki konuşmadan İngilizce metin almak için Whisper’ın çevirisini kullanın.',
    },
    {
      label: 'Sesi yazıya çevirme',
      path: '/audio-to-text',
      note: 'Bir kaydı bırakın ve zaman damgalı bir transkript alın.',
    },
    {
      label: 'Hintçe sesi yazıya çevirme',
      path: '/hindi-audio-to-text',
      note: 'Whisper’ın Hintçeyi nasıl ele aldığı; Latin harfli Hinglish seçeneği dahil.',
    },
  ],
};
