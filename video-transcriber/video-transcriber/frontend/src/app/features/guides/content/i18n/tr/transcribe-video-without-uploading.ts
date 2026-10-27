import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Bir videoyu yüklemeden yazıya dökme',
  lead: 'transcribevid.com’da konuşma tanıma kendi tarayıcınızın içinde çalışır; bu yüzden video veya ses dosyanız cihazınızda okunur ve web sitesine, Google’a ya da başka kimseye gönderilmez. Bu rehber bunun nasıl çalıştığını, tarayıcınızın yine de neleri indirdiğini, neyin yine de gönderildiğini ve bunların hepsini kendiniz nasıl kontrol edebileceğinizi açıklar.',
  readingMinutes: 10,
  toolPath: '/video-to-text',
  toolCta: 'Cihazınızda bir videoyu yazıya dökün',
  blocks: [
    {
      title: 'Burada “yüklemeden” ne demek',
      paragraphs: [
        'Çoğu çevrimiçi yazıya dökme hizmeti aynı şekilde çalışır: dosyanızı sunucularına gönderirsiniz, göremediğiniz bir bilgisayar onu yazıya döker ve sonucu indirirsiniz. Kaydınız, onu ne kadar süre saklarlarsa o kadar süre başkasının makinesinde durur.',
        'transcribevid.com’da iş tersine yapılır. Konuşma tanıma programı tarayıcınıza gelir ve tarayıcınız onu kendi bilgisayarınızda ya da telefonunuzda çalıştırır. Medya dosyası, açık olan sayfa tarafından diskinizden okunur. Siteye yapılan hiçbir isteğe eklenmez; Google’a, indirmeleri barındıran şirketlere ya da herhangi bir konuşma hizmetine de gönderilmez.',
        'Sitenin boyut veya süre sınırı koymamasının ve sırası olmamasının nedeni budur: işi yapan bize ait bir sunucu yoktur; bu yüzden hiçbir şey dosya başına fatura çıkarmaz ve önünüzde kimse beklemez. Çok uzun bir kayıt yine de cihazınızda zaman ve boş bellek gerektirir. Gizli bir röportajın ya da özel bir aile videosunun cihazınızdan çıkmadan yazıya dökülebilmesinin nedeni de budur.',
        'Bu rehber transcribevid.com web sitesini anlatır. Birinin kendi sunucusuna kurduğu yazılımın bir kopyası farklı çalışır: dosyayı şifreli bir bağlantıyla o sunucuya gönderir ve sonra otomatik olarak siler.',
      ],
    },
    {
      title: 'Nasıl çalışır, adım adım',
      steps: [
        {
          title: 'Sayfa yüklenir',
          text: 'Tarayıcınız sayfayı ve program kodunu, Cloudflare üzerinde barındırılan transcribevid.com’dan alır. Bu, başka herhangi bir web sitesini açmakla aynıdır.',
        },
        {
          title: 'Konuşma modeli bir kez indirilir',
          text: 'Bir kalite düzeyini ilk kullandığınızda tarayıcınız onun konuşma tanıma modelini Hugging Face’ten, onu çalıştıran motor dosyalarını ise jsDelivr’den indirir. Bunlar tarayıcınızın önbelleğinde saklanır; böylece sonraki yazıya dökme, onları yeniden indirmeden başlar.',
        },
        {
          title: 'Dosyanız cihazınızda çözülür',
          text: 'Tarayıcının yerleşik ses ve video çözücüleri dosyayı, modelin okuduğu düz 16 kHz mono sese dönüştürür. Tarayıcının kendi başına açamadığı birkaç biçim için (AVI, WMA ve FLV gibi) sayfa önce sorar, sonra yaklaşık 9 MB’lık bir dönüştürücü indirir; o da cihazınızda çalışır.',
        },
        {
          title: 'Bir çalışan modeli çalıştırır',
          text: 'Sayfanın Web Worker adı verilen bir arka plan iş parçacığı, sayfa duyarlı kalsın diye modeli çalıştırır. Tarayıcı destekliyorsa WebGPU aracılığıyla grafik çipinizi, desteklemiyorsa WebAssembly aracılığıyla işlemcinizi kullanır.',
        },
        {
          title: 'Metin belirir ve tarayıcınızda kalır',
          text: 'Transkript satır satır, zaman damgalarıyla oluşturulur. Oturum boyunca tarayıcınızın kendi depolama alanında saklanır ve indirdiğiniz SRT, VTT, TXT, Markdown, JSON ve PDF dosyaları da cihazınızda oluşturulur.',
        },
      ],
    },
    {
      title: 'Tarayıcınızın neleri indirdiği',
      paragraphs: [
        'Yüklememek, indirmemek demek değildir. Bir konuşma modeli büyük bir dosyadır ve tarayıcınız herhangi bir şeyi yazıya dökmeden önce onu almak zorundadır. Gelenler ve nereden geldikleri şunlardır.',
      ],
      table: {
        caption: 'Sayfanın neleri indirdiği, nereden ve ne zaman',
        head: ['Ne', 'Nereden', 'Ne zaman', 'Yaklaşık boyut'],
        rows: [
          [
            'Sayfa ve program kodu',
            'transcribevid.com (Cloudflare)',
            'Her ziyarette, sonra önbellekten',
            'Yaklaşık 200 KB',
          ],
          [
            'Modeli çalıştıran motor kodu',
            'transcribevid.com',
            'İlk yazıya dökmede, sonra önbellekten',
            '1 MB’ın altında',
          ],
          [
            'Model çalışma zamanı (ONNX Runtime, WebAssembly)',
            'cdn.jsdelivr.net (jsDelivr)',
            'İlk yazıya dökmede, sonra önbellekten',
            'Yaklaşık 17 ila 27 MB',
          ],
          [
            'Küçük bir konuşma algılama modeli',
            'transcribevid.com',
            'İlk yazıya dökmede, sonra önbellekten',
            'Yaklaşık 1,2 MB',
          ],
          [
            'Kalite seçiminiz için konuşma modeli',
            'huggingface.co (Hugging Face)',
            'Kalite seçimi başına bir kez, sonra önbellekten',
            'Yaklaşık 40 MB’tan birkaç GB’a kadar (aşağıya bakın)',
          ],
          [
            'Tarayıcının açamadığı biçimler için bir dönüştürücü (AVI, WMA, FLV ve benzerleri)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Yalnızca dosyanız gerektiriyorsa ve yalnızca siz onay verdikten sonra',
            'Yaklaşık 9 MB',
          ],
          [
            'Hintçe yazım modeli (IndicXlit)',
            'transcribevid.com',
            'Yalnızca Hintçe Latin harfleriyle (Hinglish) yazıldığında, sonra önbellekten',
            'Yaklaşık 13 MB',
          ],
        ],
      },
      after: [
        'Bu indirmeler program ve model dosyalarıdır, sizin verileriniz değil. Onları ileten şirketler, internet adresiniz ve tarayıcınız gibi herhangi bir web isteğinin olağan ayrıntılarını görür, ancak medyanızı ya da transkriptinizi asla görmez.',
      ],
    },
    {
      title: 'Yine de neler gönderiliyor, dürüstçe',
      paragraphs: ['Üç şey bir sunucuya ulaşır ve hiçbiri sizin dosyanız ya da metniniz değildir.'],
      bullets: [
        {
          title: 'Barındırma.',
          text: 'Cloudflare web sitesini iletir; bu yüzden siteyi iletmek ve korumak için internet adresinizi ve olağan istek ayrıntılarını işler.',
        },
        {
          title: 'Bir toplam sayaç.',
          text: 'Bir yazıya dökme bittiğinde tarayıcınız sitenin sayacına, üstbilgide gösterilen sayıya bir ekleyen tek bir boş istek gönderir. Dosya, transkript ya da tanımlayıcı taşımaz. Sayaç ziyaretçilerin tarayıcıları tarafından bildirilir ve bağımsız olarak doğrulanmaz.',
        },
        {
          title: 'Reklamcılık.',
          text: 'Site, bilgi sayfalarında, bir dosya yazıya dökülürken ve transkriptinizin yanında asla olmamak üzere Google AdSense tarafından sunulan reklamlar gösterdiği için ücretsizdir. Google reklamlar için çerezler kullanır ve yasanın gerektirdiği yerlerde önce onayınızı ister. Google’ın reklam betikleri Google’a kendi isteklerini yapar, ancak dosyanız ve transkriptiniz Google’a asla gönderilmez.',
        },
      ],
      after: [
        'Gizlilik politikası bunların hepsini ayrıntılı olarak ortaya koyar. Hesap yoktur ve site ad ya da e-posta adresi istemez.',
      ],
    },
    {
      title: 'Kendiniz nasıl kontrol edersiniz',
      paragraphs: [
        'Bizim sözümüze güvenmek zorunda değilsiniz. Her modern tarayıcı, bir sayfanın ne gönderdiğini ve aldığını size gösterebilir ve kontrol iki dakika sürer.',
      ],
      steps: [
        {
          title: 'Geliştirici araçlarını açın',
          text: 'Chrome, Edge veya Firefox’ta transcribevid.com ana sayfasını açın ve F12’ye basın (Mac’te Command, Option ve I). Network sekmesini seçin.',
        },
        {
          title: 'Listeyi temizleyin',
          text: 'Yalnızca yeni istekler görünsün diye, üstü çizili bir daireye benzeyen temizle düğmesine basın.',
        },
        {
          title: 'Bir yazıya dökme başlatın',
          text: 'Bir dosya ekleyin ve Yazıya dök düğmesine basın. Network sekmesini görünür tutun.',
        },
        {
          title: 'Gelenleri izleyin',
          text: 'İlk seferde huggingface.co ve cdn.jsdelivr.net’ten büyük indirmeler göreceksiniz. Bunlar, gelen model ve motordur.',
        },
        {
          title: 'Çıkanlara bakın',
          text: 'Filtre kutusuna method:POST yazın (Chrome ve Edge; Firefox aynı filtreyi kabul eder). transcribevid.com’a giden tek POST isteği, transkript bittikten sonra /api/count adresine giden boş bir istek olmalıdır. Onu açın ve istek gövdesini kontrol edin: boştur. Sayfa reklam gösteriyorsa Google’ın kendi betikleri Google’a kendi isteklerini yapar ve hiçbiri dosyanızı ya da transkriptinizi taşımaz. Dosyanızın boyutuna yakın hiçbir şey cihazınızdan çıkmaz.',
        },
      ],
    },
    {
      title: 'İlk indirme ne kadar büyük ve ne kadar hızlı?',
      paragraphs: [
        'Boyut, kalite düzeyine ve cihazın türüne bağlıdır. WebGPU olan bir cihaz boyutuna göre derli toplu bir yapı alır; WebAssembly kullanan bir cihaz ise farklı bir yapı alır. Sayfa, indirme boyutunu başlamadan önce tam olarak söyler; bu yüzden asla sürprizle karşılaşmazsınız. Bunlar model dosyalarının yaklaşık boyutlarıdır (WebGPU rakamları 16 bit gölgelendirici desteği olan tarayıcılar içindir; diğer cihazlar başka yapılar alır):',
      ],
      table: {
        caption: 'Yaklaşık ilk seferlik model indirmesi',
        head: ['Kalite seçimi', 'Whisper modeli', 'WebGPU ile', 'WebAssembly ile'],
        rows: [
          ['En hızlı', 'Base', 'Yaklaşık 146 MB', 'Yaklaşık 77 MB'],
          ['Standart', 'Small', 'Yaklaşık 485 MB', 'Yaklaşık 249 MB'],
          ['Yüksek doğruluk', 'Large v3 Turbo', 'Yaklaşık 564 MB', 'Yaklaşık 1,1 GB'],
          [
            'En yüksek doğruluk',
            'Large v3',
            'Yaklaşık 980 MB, artı kelime zamanlaması için yaklaşık 564 MB',
            'Yaklaşık 1,8 GB, artı kelime zamanlaması için yaklaşık 1,1 GB',
          ],
        ],
      },
      after: [
        'Modelin yapılandırma dosyaları için birkaç megabayt ekleyin. Large v3’ün kendine ait bir kelime zamanlama sürümü yoktur; bu yüzden varsayılan olan Kelime düzeyinde zamanlama açıkken ilk çalıştırması Large v3 Turbo zamanlama modelini de indirir ve sayfa bunu başlamadan önce söyler. O Turbo modeli saklanır ve Yüksek doğruluk seçimiyle paylaşılır. İlk indirmeden sonra model tarayıcınızın önbelleğinden okunur; bu yüzden sonraki yazıya dökmeler hemen başlar. Bundan sonraki hız tamamen cihazınıza bağlıdır: yetenekli bir grafik çipi ve WebGPU olan bir bilgisayar, WebAssembly kullanan bir telefondan veya daha eski bir dizüstü bilgisayardan çok daha hızlıdır.',
      ],
    },
    {
      title: 'Bu araç ne zaman doğru, ne zaman değil',
      paragraphs: [
        'Kendi cihazınızda yazıya dökmek, özel malzemeler ve uzun dosyalar için iyi bir uyumdur. Her şey için en iyi araç değildir.',
      ],
      bullets: [
        {
          title: 'Gizli kayıtlar için iyi.',
          text: 'transcribevid.com’da röportajlar, toplantılar, tıbbi ya da hukuki notlar ve kişisel videolar cihazınızda kalır.',
        },
        {
          title: 'Uzun dosyalar için iyi.',
          text: 'transcribevid.com’da beklenecek bir yükleme yoktur ve boyut ya da süre sınırı konmamıştır. Çok uzun bir kayıt zaman ve boş bellek gerektirir; WebCodecs desteği olmayan bir tarayıcı çok uzun bir dosyayı reddedebilir.',
        },
        {
          title: 'Canlı altyazı için değil.',
          text: 'Transkript, tamamlanmış bir dosyadan ya da kayıttan yapılır. Canlı bir etkinliği olurken altyazılamaz.',
        },
        {
          title: 'Konuşmacı adları için değil.',
          text: 'Satırlar zaman damgası taşır, ancak metin kimin konuştuğunu söylemez. Düzenlerken isimleri yazabilirsiniz.',
        },
        {
          title: 'Zayıf bir telefonda ideal değil.',
          text: 'Telefonların belleği daha azdır. Cihazınız en büyük kalite seçimlerini çalıştıramadığında sayfa sizi uyarır ve onları kapatabilir. Çok uzun kayıtları parçalara bölün.',
        },
        {
          title: 'Büyük bir dosyayı bir kez bile indiremiyorsanız uygun değil.',
          text: 'İlk kullanım, onlarca ya da yüzlerce megabayt alabilen bir bağlantı gerektirir.',
        },
      ],
    },
    {
      title: 'Sonrasında verilerinizi temizlemek',
      paragraphs: [
        'transcribevid.com’da transkriptleriniz ve kaynak dosya, sayfanın onları gösterebilmesi ve düzenleyip dışa aktarmanıza izin verebilmesi için tarayıcınızın depolama alanında tutulur. Bir süre işlem yapılmadıktan sonra oturumunuz bitince otomatik olarak, ya da Transkriptler menüsünde Verilerimi şimdi sil düğmesine bastığınızda hemen silinir. Silinen veriler geri alınamaz; bu yüzden önce ihtiyacınız olanı dışa aktarın.',
        'Konuşma modelleri, sonraki yazıya dökmeler hızlı olsun diye, siz onları silene (Verilerimi şimdi sil bunları da kaldırabilir) ya da tarayıcınız depolama alanını temizleyene kadar tarayıcınızın önbelleğinde kalır. Paylaşılan ya da herkese açık bir bilgisayar kullanıyorsanız ayrılmadan önce Verilerimi şimdi sil düğmesine basın; çünkü o tarayıcı profilini açabilen herkes içinde saklananı okuyabilir.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Dosyamın asla yüklenmediği gerçekten doğru mu?',
      answer:
        'Evet, transcribevid.com’da. Tanıma tarayıcınızda çalışır ve dosyanız sayfa tarafından kendi diskinizden okunur. Bunu tarayıcınızın geliştirici araçlarındaki Network sekmesinde doğrulayabilirsiniz: transcribevid.com’a bir şey gönderen tek istek, transkript bittikten sonraki boş bir sayma isteğidir ve Google’ın reklam betikleri Google’a, dosyanızı asla taşımayan kendi isteklerini yapar.',
    },
    {
      question: 'Bağlantım yavaşsa yazıya dökme yine de çalışır mı?',
      answer:
        'Yavaş olan kısım, yüzlerce megabayt olabilen konuşma modelinin ilk indirmesidir. Model tarayıcınıza kaydedildikten sonra yazıya dökmenin kendisi kendi cihazınızı kullanır ve ağ hızı gerektirmez.',
    },
    {
      question: 'Tarayıcım neden başka bir web sitesinden model indiriyor?',
      answer:
        'Model, konuşmayı tanıyan programdır ve sayfaya gömülemeyecek kadar büyüktür. Bu tür modeller için herkese açık bir barındırıcı olan Hugging Face’ten indirilir ve onu çalıştıran motor jsDelivr’den gelir. İkisi de medyanızı ya da transkriptinizi almaz.',
    },
    {
      question: 'Cihazımda yazıya dökmek yüklemekten daha hızlı mı?',
      answer:
        'Olabilir; çünkü yükleme ve sıra yoktur ve WebGPU olan bir bilgisayar çabuktur. Daha eski bir dizüstü bilgisayarda ya da telefonda aynı iş, hızlı bir sunucudan daha uzun sürebilir. İlk çalıştırma ayrıca tek seferlik model indirmesini de içerir.',
    },
  ],
  links: [
    {
      label: 'Röportaj yazıya dökme',
      path: '/interview-transcription',
      note: 'Araştırma, gazetecilik ve işe alım röportajları için özel yol.',
    },
    {
      label: 'Whisper nedir?',
      path: '/guides/what-is-whisper',
      note: 'Tarayıcınızın çalıştırdığı konuşma modeli, sade sözcüklerle.',
    },
    {
      label: 'Daha doğru bir transkript nasıl elde edilir',
      path: '/guides/accurate-transcripts',
      note: 'Hangi cihaz olursa olsun daha iyi metin veren ayarlar ve alışkanlıklar.',
    },
    {
      label: 'Videoyu yazıya çevirme',
      path: '/video-to-text',
      note: 'Bir video ekleyin ve kendi cihazınızda zaman damgalı metne dönüşmesini izleyin.',
    },
    {
      label: 'Toplantı kaydını yazıya çevirme',
      path: '/meeting-recording-to-text',
      note: 'Kaydedilmiş bir Zoom, Teams veya Meet kaydını aranabilir bir transkripte dönüştürün.',
    },
  ],
};
