import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'SRT mi VTT mi: hangi altyazı biçimini kullanmalısınız?',
  lead: 'SRT güvenli varsayılandır: neredeyse her video oynatıcı, düzenleyici ve platform onu okur. Altyazılar bir web sayfasının video öğesi içinse ya da biçimlendirme ve konumlandırma gerekiyorsa VTT’yi (WebVTT) seçin. İkisi de düz metin dosyasıdır ve videonuzdan ikisinden de birini buradan indirebilirsiniz.',
  readingMinutes: 9,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Videonuzdan bir SRT dosyası oluşturun',
  blocks: [
    {
      title: 'Kısa yanıt',
      paragraphs: [
        'Emin değilseniz SRT kullanın. Daha eski ve daha basit biçimdir ve karşılaşabileceğiniz neredeyse her video oynatıcı, video düzenleyici ve yükleme formu tarafından kabul edilir. Her yerde çalışan bir altyazı dosyası, zekice hazırlanmış bir dosyadan daha değerlidir.',
        'Video bir web sayfasında HTML video öğesi aracılığıyla oynatılıyorsa VTT kullanın. Tarayıcılar altyazı izlerini yalnızca WebVTT biçiminde yükler; bu yüzden bir SRT dosyası dönüştürülmeden orada çalışmaz. Metni ekranda konumlandırmak, kalın veya italik yazıyı güvenle eklemek ya da kimin konuştuğunu etiketlemek istediğinizde de VTT daha iyi seçimdir.',
        'Bu rehberin geri kalanı nedenini açıklar, her dosyanın içinin neye benzediğini gösterir ve birinden diğerine hiçbir şeyi bozmadan nasıl geçeceğinizi anlatır.',
      ],
    },
    {
      title: 'Bir SRT dosyası neye benzer',
      paragraphs: [
        'SRT, SubRip Text anlamına gelir; adını 2000’lerin başında DVD’lerdeki altyazıları kopyalayan bir Windows programından alır. Biçim hiçbir zaman resmî olarak standartlaştırılmadı, ancak o kadar yaygınlaştı ki her şey onu destekler. Bir SRT dosyası, her biri bir sonrakinden boş bir satırla ayrılan numaralı blokların (cue) listesidir.',
      ],
      code: {
        label: 'Küçük bir SRT dosyası',
        text: `1
00:00:01,000 --> 00:00:03,500
Welcome to the show.

2
00:00:03,800 --> 00:00:07,200
Today we look at how
subtitle files are built.

3
00:00:07,600 --> 00:00:10,000
Let's start with the basics.`,
      },
      after: [
        'Her blok üç bölümden oluşur: sıra numarası, başlangıç ve bitiş zamanını içeren bir satır ve bir ya da iki satır metin. Zamanlar saat, dakika, saniye ve milisaniye olarak yazılır ve milisaniyeler virgülle ayrılır. Elle dönüştürülmüş bir dosyanın başarısız olmasının en yaygın tek nedeni bu virgüldür.',
        'Dosyayı UTF-8 düz metin olarak, .srt uzantısıyla kaydedin. Metinde aksanlar, Devanagari, Arapça ya da İngilizce olmayan başka karakterler olduğu anda UTF-8 önem kazanır.',
      ],
    },
    {
      title: 'Bir WebVTT dosyası neye benzer',
      paragraphs: [
        'Genellikle VTT diye kısaltılan WebVTT, web için tasarlandı ve web teknolojisini standartlaştıran kuruluş olan W3C’nin yayımladığı bir belirtimde tanımlanır. SRT’ye benzer görünür, ancak zorunlu bir başlık satırı ve birkaç isteğe bağlı ek ekler.',
      ],
      code: {
        label: 'Aynı altyazılar bir WebVTT dosyası olarak',
        text: `WEBVTT

NOTE This file was made from the SRT example.

intro
00:00:01.000 --> 00:00:03.500
Welcome to the show.

00:00:03.800 --> 00:00:07.200 line:85% align:center
Today we look at how
subtitle files are built.

00:00:07.600 --> 00:00:10.000
<v Maria>Let's start with the basics.</v>`,
      },
      after: [
        'Dört ayrıntı onu ayırır. İlk satır WEBVTT olmalıdır. Milisaniyeler virgülle değil, nokta ile ayrılır. Bir blokta numaranın yerine ya da numaraya ek olarak bir ad (yukarıdaki intro sözcüğü) bulunabilir ve numaralar isteğe bağlıdır. Ayrıca zamanlardan sonra line, position ve align gibi, metni ekranda hareket ettiren ayarlar ekleyebilirsiniz.',
        'İzleyicilerin hiç görmediği yorumlar için NOTE blokları yazabilir, kimin konuştuğunu v etiketiyle belirtebilir ve kalın, italik ve altı çizili için b, i ve u gibi basit etiketler kullanabilirsiniz. Dosyayı UTF-8 olarak, .vtt uzantısıyla kaydedin.',
      ],
    },
    {
      title: 'SRT ve VTT karşılaştırması',
      paragraphs: [
        'Bu tablo ikisini yan yana koyar. Günlük kullanımda önem taşıyan farklar; başlık, ondalık ayırıcı ve her biçimin nerede kabul edildiğidir.',
      ],
      table: {
        caption: 'SRT ve WebVTT karşılaştırması',
        head: ['', 'SRT', 'WebVTT (VTT)'],
        rows: [
          ['Dosya uzantısı', '.srt', '.vtt'],
          ['İlk satır', '1 sayısı', 'WEBVTT sözcüğü'],
          ['Zaman biçimi', '00:00:01,000 (virgül)', '00:00:01.000 (nokta)'],
          ['Blok numaraları', 'Zorunlu', 'İsteğe bağlı (bir ad olabilir)'],
          ['Ekrandaki konum', 'Biçimde yok', 'Blok ayarları: line, position, align, size'],
          [
            'Biçimlendirme ve konuşmacı etiketleri',
            'Yalnızca temel etiketler, destek oynatıcıya göre değişir',
            'Belirtimde tanımlı, ayrıca CSS biçimlendirme',
          ],
          ['Yorumlar', 'Yok', 'NOTE blokları'],
          ['Web sayfası video öğesi', 'Kabul edilmez', 'Gereken biçim'],
          ['Resmî belirtim', 'Yok (fiilî bir biçim)', 'W3C belirtimi'],
        ],
      },
      after: [
        'Basitçe: SRT daha geniş erişimi olan daha basit dosyadır, VTT ise daha dar ama daha modern bir yuvası olan daha zengin dosyadır. Sıradan konuşma altyazılarında ekrandaki metin ikisinde de aynı görünür.',
      ],
    },
    {
      title: 'Her biçimin nerede kabul edildiği',
      paragraphs: [
        'Destek zamanla değişir ve her platform yardım sayfalarını farklı ifade eder; bu yüzden bunu bir rehber olarak görün ve yüklediğiniz hizmetin güncel yardım sayfasına bakın.',
      ],
      bullets: [
        {
          title: 'Web sayfaları.',
          text: 'HTML video etiketinin track öğesi WebVTT gerektirir. SRT’nin bir seçenek olmadığı tek yer burasıdır.',
        },
        {
          title: 'YouTube.',
          text: 'Altyazı yükleme SRT’yi kabul eder ve diğer biçimlerle birlikte VTT’yi de kabul eder. SRT olağan seçimdir.',
        },
        {
          title: 'Masaüstü ve mobil oynatıcılar.',
          text: 'VLC ve çoğu diğer oynatıcı SRT’yi okur; birçoğu VTT’yi de okur. Bir oynatıcı genellikle adı videoyla aynı olan bir altyazı dosyasını yükler.',
        },
        {
          title: 'Video düzenleyiciler.',
          text: 'Çoğu düzenleyici SRT’yi bir altyazı izi olarak içe aktarır. Bazıları VTT’yi de içe aktarır. Bir biçim reddedilirse diğerini deneyin.',
        },
        {
          title: 'Diğer sosyal ve öğrenme platformları.',
          text: 'Birçoğu SRT veya VTT ister, birkaçı yalnızca birini ister. Dışa aktarmadan önce yükleme sayfasını okuyun.',
        },
      ],
    },
    {
      title: 'SRT ile VTT arasında elle dönüştürme',
      paragraphs: [
        'Dosyayı yeniden adlandırmak yetmez. İçeriği hâlâ SRT olan talk.vtt adlı bir dosya, başlığı eksik olduğu ve zamanları virgül kullandığı için tarayıcılar tarafından reddedilir. Dönüştürme, herhangi bir metin düzenleyicide bir dakika sürer.',
      ],
      steps: [
        {
          title: 'SRT’den VTT’ye, birinci adım',
          text: 'En üste WEBVTT satırını, ardından boş bir satır ekleyin.',
        },
        {
          title: 'SRT’den VTT’ye, ikinci adım',
          text: 'Her zaman satırında milisaniyeden önceki virgülü noktaya çevirin. --> satırlarında ya da virgülün çevresindeki rakam örüntüsünde bul ve değiştir zaman kazandırır.',
        },
        {
          title: 'SRT’den VTT’ye, üçüncü adım',
          text: 'Numaraları olduğu yerde bırakın; çünkü VTT onlara blok adı olarak izin verir. UTF-8 olarak, .vtt uzantısıyla kaydedin.',
        },
        {
          title: 'VTT’den SRT’ye',
          text: 'Tersini yapın: başlığı, NOTE bloklarını ve zamanlardan sonraki her ayarı silin, noktaları yeniden virgüle çevirin, her bloğun bir numarası olduğundan emin olun ve .srt olarak kaydedin.',
        },
      ],
      after: [
        'ffmpeg yüklüyse altyazı dosyalarını da dönüştürür: ffmpeg -i talk.srt talk.vtt bir SRT dosyasını VTT dosyasına çevirir ve adları tersine çevrilmiş aynı komut öbür yöne gider. Yine de en basit yol, ihtiyacınız olan biçimi transkript sayfasından indirmektir; çünkü ikisi de aynı metinden doğrudan üretilir.',
      ],
    },
    {
      title: 'Yaygın sorunlar ve nedenleri',
      bullets: [
        {
          title: 'Aksanlar veya Latin olmayan harfler garip simgeler olarak görünüyor.',
          text: 'Dosya UTF-8 olarak kaydedilmemiş. Onu bu kodlamayla yeniden kaydedin.',
        },
        {
          title: 'Web sayfasında hiçbir şey görünmüyor.',
          text: 'Dosya VTT yerine SRT’dir ya da sunucu onu yanlış türle gönderiyor. VTT dosyaları text/vtt olarak sunulmalıdır ve başka bir alan adındaki bir dosya ayrıca doğru çapraz kaynak ayarlarına ihtiyaç duyar.',
        },
        {
          title: 'Altyazılar her yerde geç veya erken.',
          text: 'Dosyanın tamamı kaymış. Çoğu oynatıcı ve düzenleyici altyazıyı sabit bir süre kadar kaydırmanıza izin verir; bu, her satırı düzenlemekten kolaydır.',
        },
        {
          title: 'İki altyazı ekranda üst üste biniyor.',
          text: 'Bir bloğun bitiş zamanı bir sonrakinin başlangıç zamanından daha geç. Önceki bloğu kısaltın.',
        },
        {
          title: 'Satırlar okunamayacak kadar uzun.',
          text: 'Onları yaklaşık eşit uzunlukta iki satıra bölün. Satır başına yaklaşık 42 karakter yaygın bir kuraldır.',
        },
      ],
    },
    {
      title: 'Burada videonuzdan SRT veya VTT dosyası nasıl alınır',
      paragraphs: [
        'İki biçimden birini kendiniz yazmanız gerekmez. Ana sayfada video veya ses dosyanızı ekleyin, konuşulan dili seçin ve transkriptin bitmesine izin verin. Baştan sona okuyun ve yanlış her kelimeyi düzeltin: düzenlenmiş bir satır başlangıç ve bitiş zamanını korur ve içindeki kelimeler, uzunluklarıyla orantılı olarak o süreye yayılır.',
        'Ardından indirme menüsünü açın ve SRT veya VTT’yi seçin. İkisi de aynı düzenlenmiş transkriptten yapılır; bu yüzden hiçbir işi tekrarlamadan biri YouTube için, diğeri kendi web sayfanız için dışa aktarılabilir. Altyazıların doğru kelimelerde temiz bölünmesini istiyorsanız Daha fazla seçenek altında Kelime düzeyinde zamanlama’yı açık tutun.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Bir SRT dosyasını VTT olarak yeniden adlandırıp web sitemde kullanabilir miyim?',
      answer:
        'Hayır. Bir tarayıcı, WEBVTT ile başlamayan bir .vtt dosyasını reddeder ve SRT zamanları, VTT’nin nokta istediği yerde virgül kullanır. Başlığı ekleyin, virgülleri değiştirin ya da transkript sayfasından doğrudan bir VTT dosyası indirin.',
    },
    {
      question: 'SRT ve VTT dosyaları boyut veya kalite açısından farklı mıdır?',
      answer:
        'Hayır. İkisi de küçük metin dosyalarıdır ve hiçbiri video kalitesini etkilemez. Fark yalnızca VTT’nin tanımlayabildiği ekstralarda, örneğin ekran konumu ve biçimlendirmede, ve her biçimin nerede kabul edildiğindedir.',
    },
    {
      question: 'SRT altyazıları kalın, italik veya renkli olabilir mi?',
      answer:
        'Bazı oynatıcılar SRT’de b ve i gibi temel etiketleri anlar, ancak destek eşit değildir; bu yüzden sonuç oynatıcıdan oynatıcıya değişebilir. WebVTT etiketlerini ve CSS biçimlendirmesini bir belirtimde tanımlar; bu da sonucu web’de daha öngörülebilir kılar.',
    },
    {
      question: 'Bir altyazı dosyası hangi metin kodlamasını kullanmalı?',
      answer:
        'UTF-8. Her dili işler ve tarayıcıların WebVTT için beklediği budur. Altyazı karakterleri bozuk görünüyorsa dosya neredeyse kesinlikle daha eski bir kodlamayla kaydedilmiştir.',
    },
  ],
  links: [
    {
      label: 'SRT altyazı oluşturucu',
      path: '/srt-subtitle-generator',
      note: 'Bir video bırakın ve içindeki konuşmadan yapılmış bir SRT dosyası indirin.',
    },
    {
      label: 'VTT altyazı oluşturucu',
      path: '/vtt-subtitle-generator',
      note: 'Aynısı, bir web sayfasının video öğesiyle çalışan bir WebVTT dosyası için.',
    },
    {
      label: 'Videoya altyazı nasıl eklenir',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Transkriptten YouTube’da, VLC’de veya bir düzenleyicide altyazı gösteren bir videoya, adım adım.',
    },
    {
      label: 'YouTube altyazı oluşturucu',
      path: '/youtube-subtitle-generator',
      note: 'Sahip olduğunuz bir video için SRT dosyası yapın ve YouTube Studio’ya yükleyin.',
    },
    {
      label: 'Daha doğru bir transkript nasıl elde edilir',
      path: '/guides/accurate-transcripts',
      note: 'Daha iyi metin, altyazıları dışa aktarmadan önce daha az düzeltme demektir.',
    },
  ],
};
