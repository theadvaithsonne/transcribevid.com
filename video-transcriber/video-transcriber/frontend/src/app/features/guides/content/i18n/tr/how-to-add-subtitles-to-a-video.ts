import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Videoya ücretsiz altyazı nasıl eklenir',
  lead: 'Altyazı yapmak dört adım sürer: konuşmayı metne çevirin, hataları düzeltin, bir SRT veya VTT dosyası dışa aktarın ve o dosyayı videoya bağlayın. Bu rehber her adımı gösterir ve dosyanın YouTube’da, VLC’de, bir video düzenleyicide, bir web sayfasında ya da ffmpeg ile kalıcı olarak görüntüye nasıl bağlanacağını anlatır.',
  readingMinutes: 9,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Videonuzdan altyazı oluşturun',
  blocks: [
    {
      title: 'Önce karar verin: yumuşak altyazı mı, gömülü altyazı mı',
      paragraphs: [
        'Bir videoya altyazı koymanın iki yolu vardır ve seçim hangi adımlara ihtiyacınız olduğunu belirler.',
      ],
      bullets: [
        {
          title: 'Yumuşak altyazılar (ayrı bir iz).',
          text: 'Altyazılar, videonun yanındaki bir dosya ya da izdir. İzleyiciler onları açıp kapatabilir, bir dil seçebilir ve bir yazım hatasını videoya dokunmadan sonradan düzeltebilirsiniz. YouTube, VLC, çoğu oynatıcı ve web sayfaları böyle çalışır. Altyazı izlerini destekleyen bir oynatıcı gerektirir.',
        },
        {
          title: 'Gömülü altyazılar (görüntünün parçası).',
          text: 'Metin her kareye çizilir; bu yüzden altyazı dosyası kabul etmeyen platformlar dahil her yerde görünür. Bedeli, kimsenin onu kapatamaması, videoyu yeniden dışa aktarmadan düzeltememeniz ve videonun yeniden kodlanması gerektiğidir.',
        },
      ],
      after: [
        'Şüphedeyseniz yumuşak altyazılarla başlayın. Onları yalnızca paylaştığınız yerde altyazı yükleme seçeneği yoksa gömün.',
      ],
    },
    {
      title: 'Dört adım bir bakışta',
      steps: [
        {
          title: 'Videoyu yazıya dökün',
          text: 'Videoyu ana sayfada ekleyin, konuşulan dili seçin ve konuşmanın zamanlı metne dönüşmesine izin verin.',
        },
        {
          title: 'Metni düzeltin',
          text: 'Transkripti okuyun ve isimleri, sayıları ve anlaşılmayan kelimeleri düzeltin. Altyazı satırları çok uzun çıkarsa Dışa aktar menüsünde daha kısa bir Altyazı satır uzunluğu seçin.',
        },
        {
          title: 'SRT veya VTT dışa aktarın',
          text: 'Altyazı dosyasını indirin. SRT neredeyse her yerde çalışır. VTT, bir web sayfasının video öğesi içindir.',
        },
        {
          title: 'Dosyayı bağlayın',
          text: 'YouTube’a yükleyin, oynatıcınızda ya da düzenleyicinizde yükleyin veya sayfanıza ekleyin. Ya da videoya gömün.',
        },
      ],
    },
    {
      title: '1. ve 2. adımlar: videoyu yazıya dökün ve metni düzeltin',
      paragraphs: [
        'Videoyu ana sayfada seçin ve otomatik algılamaya bırakmak yerine içinde konuşulan dili belirleyin. Dili belirtmek, özellikle kısa kliplerde ve aksanlarda daha güvenilirdir. Standart kalite çoğu video için uygundur. Gürültülü ses ya da ağır aksanlar için Yüksek doğruluk’u seçin.',
        'Daha fazla seçenek altında Kelime düzeyinde zamanlama’yı açık tutun. Varsayılan olarak açıktır ve her altyazının uzun bir bloğun kenarlarında değil, kelimelerle başlayıp bitmesini sağlar. Transkript hazır olduğunda videoyu yanında oynatın ve birlikte okuyun. Emin olunmayan kelimelerin altını çiz anahtarı açıkken (varsayılan olarak açıktır) tanıyıcının daha az emin olduğu kelimelerin altı çizilir; bu yüzden önce onları kontrol edin.',
        'Altyazılar hızla okunur; bu yüzden metni izleyici için şekillendirin. Bunlar yaygın olarak kullanılan yönergelerdir, katı kurallar değil:',
      ],
      bullets: [
        {
          title: 'Satır uzunluğu.',
          text: 'Satır başına yaklaşık 42 karakter ve aynı anda en fazla iki satır. Dışa aktar menüsünde bir Altyazı satır uzunluğu seçeneği vardır: Kısa (32 harf), Standart (42) veya Uzun (56).',
        },
        {
          title: 'Ekranda kalma süresi.',
          text: 'Her altyazı en az yaklaşık bir saniye ekranda kalmalı ve nadiren yaklaşık yedi saniyeden uzun olmalıdır.',
        },
        {
          title: 'Okuma hızı.',
          text: 'Saniyede yaklaşık 15 ila 20 karakter çoğu yetişkin için rahattır. İnsanlar satır değişmeden okumayı bitiremiyorsa ifadeyi kısaltın ya da satırın daha uzun kalmasına izin verin.',
        },
        {
          title: 'Doğal bölünmeler.',
          text: 'İyi bir altyazı, bir ifadenin sonunda bölünür; bir ismin ortasında ya da bir tanımlık ile ismi arasında değil. Dışa aktarma uzun satırları sizin için sarar; bu yüzden düzenlediğiniz her satırı eksiksiz bir ifade olarak tutun.',
        },
      ],
    },
    {
      title: '3. adım: SRT mi VTT mi seçin',
      paragraphs: [
        'Altyazılar kendi web sayfanızdaki bir video için değilse SRT indirin. YouTube, VLC ve neredeyse her düzenleyici SRT alır. Bir web sayfası VTT gerektirir; çünkü tarayıcılar altyazı izlerini yalnızca o biçimde okur.',
        'İkisini de aynı transkriptten indirebilirsiniz; bu yüzden önceden karar vermeniz gerekmez. SRT ve VTT rehberi, her dosyanın içindekiler dahil tam farkları açıklar.',
      ],
    },
    {
      title: '4. adım: dosyayı YouTube’a, VLC’ye ya da bir düzenleyiciye ekleyin',
      paragraphs: [
        'Menü adları zaman zaman değişir; bu yüzden bir etiket aşağıdakinden farklıysa en yakın eşleşmeyi arayın.',
      ],
      bullets: [
        {
          title: 'YouTube.',
          text: 'YouTube Studio’yu açın, videoyu seçin, Altyazılar’ı açın, bir dil ekleyin, ardından dosya yüklemeyi seçin. Zamanlamalı dosya seçeneğini belirleyin, SRT’nizi seçin ve yayımlayın. YouTube, satırları sonradan aynı ekranda düzenlemenize izin verir.',
        },
        {
          title: 'VLC.',
          text: 'Videoyu oynatın, ardından menüden Altyazı, Altyazı Dosyası Ekle’yi seçin ve SRT’nizi belirleyin. Dosyayı oynatıcı penceresine de sürükleyebilirsiniz. Ya da SRT’yi videonun yanına aynı adla kaydedin (lecture.mp4 ve lecture.srt); VLC onu genellikle kendiliğinden yükler.',
        },
        {
          title: 'Video düzenleyiciler.',
          text: 'Çoğu düzenleyici bir SRT dosyasını, Dosya, İçe Aktar gibi bir menüden ya da altyazı panelinden bir altyazı izi olarak içe aktarabilir. Zaman çizelgesine girdikten sonra metnin görünümünü değiştirebilirsiniz. Bir biçim reddedilirse diğerini deneyin.',
        },
        {
          title: 'Telefonlar ve tabletler.',
          text: 'VLC for mobile gibi altyazı dosyalarını destekleyen bir video oynatıcı uygulaması, dosyalarınızdan bir SRT dosyasını yükleyebilir. Birçok telefonun yerleşik galeri oynatıcısı yükleyemez.',
        },
      ],
    },
    {
      title: 'Track öğesiyle bir web sayfasına altyazı eklemek',
      paragraphs: [
        'Kendi web sitenizde HTML video öğesi, altyazıları bir WebVTT dosyasına işaret eden bir track öğesi aracılığıyla yükler. VTT dışa aktarın, videonun yanına yükleyin ve bir satır ekleyin.',
      ],
      code: {
        label: 'Altyazı izi olan bir video',
        text: `<video controls src="talk.mp4">
  <track kind="subtitles" src="talk.en.vtt"
         srclang="en" label="English" default>
</video>`,
      },
      after: [
        'default özniteliği, izleyici seçmeden izi gösterir. Her dil için bir track satırı ekleyin. VTT dosyası sayfadan farklı bir alan adındaysa o sunucunun çapraz kaynak isteklerine izin vermesi gerekir; yoksa tarayıcı onu yüklemez.',
      ],
    },
    {
      title: 'ffmpeg ile bir MP4’e yumuşak altyazı izi eklemek',
      paragraphs: [
        'ffmpeg, altyazıları MP4 dosyasının içine paketleyebilen ücretsiz bir komut satırı aracıdır; böylece video ve altyazıları tek dosya olarak taşınır. Video ve ses dokunulmadan kopyalanır; bu yüzden hızlıdır ve kalite kaybı olmaz. Videoyu ve SRT dosyasını tek bir klasöre koyun ve komutu orada çalıştırın.',
      ],
      code: {
        label: 'Bir MP4’ün içinde yumuşak altyazılar (izleyiciler kapatabilir)',
        text: `ffmpeg -i talk.mp4 -i talk.srt -map 0:v -map 0:a? -map 1:0 -c:v copy -c:a copy -c:s mov_text -metadata:s:s:0 language=eng talk-subtitled.mp4`,
      },
      after: [
        '-map seçenekleri, yeni dosyaya tam olarak neyin gireceğini seçer: tüm video, herhangi bir ses (soru işareti, ses yoksa komutun devam etmesini sağlar) ve altyazı dosyası. Akışları elle seçmek, MP4’ün çoğu zaman kopyalayamadığı ek veri izleri de taşıyan telefon ve kamera dosyalarındaki hataları önler. mov_text ayarı, MP4 dosyalarının kullandığı altyazı türüdür. Dil kodu üç harflidir: İngilizce için eng, İspanyolca için spa, Hintçe için hin ve benzeri. VLC gibi oynatıcılar izi altyazı menülerinde gösterir.',
      ],
    },
    {
      title: 'ffmpeg ile altyazıları görüntüye gömmek',
      paragraphs: [
        'Yalnızca video kabul eden bir platform için metni her kareye çizin. Bu, videoyu yeniden kodlar; bu yüzden daha uzun sürer ve dosya yeniden yapılır. Ses olduğu gibi kopyalanır. Dosya yollarıyla ilgili sorunları önlemek için komutu her iki dosyanın da bulunduğu klasörde çalıştırın.',
      ],
      code: {
        label: 'Gömülü altyazılar (kalıcı, kapatılamaz)',
        text: `ffmpeg -i talk.mp4 -vf "subtitles=talk.srt" -c:a copy talk-burned.mp4`,
      },
      after: [
        "Görünümü değiştirmek için dosya adından sonra bir stil ekleyin; örneğin komutun tırnakları içine subtitles=talk.srt:force_style='FontSize=22'. Özgün videonun bir kopyasını saklayın; çünkü gömülü bir sürüm yeniden yumuşak altyazılara dönüştürülemez.",
      ],
    },
    {
      title: 'Erişilebilirlik ve metni neden kontrol etmelisiniz',
      paragraphs: [
        'Altyazılar sağır veya işitme güçlüğü çeken kişilere, sesi kapalı trende ya da sessiz bir ofiste izleyenlere, dili hâlâ öğrenenlere ve yazılı sözcükleri takip etmeyi daha kolay bulan herkese yardımcı olur. Birçok izleyici sesi duyabilecekken bile onları açar.',
        'Konuşma tanıma iyidir ancak kusursuz değildir ve yanlış bir isim ya da sayı içeren bir altyazı yanıltabilir. Yayımlamadan önce transkripti her zaman videoyla karşılaştırarak okuyun ve isimlere, rakamlara, teknik terimlere ve hukuki ya da tıbbi her şeye ekstra özen gösterin. Kahkaha ya da kapanan bir kapı gibi önemli sesleri de betimleyen altyazılar, onları duyamayan kişiler için daha yararlıdır ve bunları düzenlerken elle ekleyebilirsiniz.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Altyazı ile alt yazı (captions) arasındaki fark nedir?',
      answer:
        'Altyazılar, videoyu duyabilen izleyiciler için konuşmayı çevirir ya da yazar. Captions (işitme engelliler için altyazılar) ayrıca müzik veya kahkaha gibi sesleri de betimler. Dosyalar aynı türden dosyalardır; bu yüzden captions istiyorsanız bir SRT dosyasına ses betimlemelerini kendiniz ekleyebilirsiniz.',
    },
    {
      question: 'Altyazı eklemek için özel bir yazılıma ihtiyacım var mı?',
      answer:
        'Hayır. SRT dosyasını YouTube Studio’ya yükleyin, VLC’ye sürükleyin ya da düzenleyicinizde içe aktarın. Yalnızca dosyayı bir MP4’e paketlemek ya da metni görüntüye gömmek, ffmpeg gibi bir araç ya da bunu dışa aktarabilen bir video düzenleyici gerektirir.',
    },
    {
      question: 'Birden fazla dilde altyazı ekleyebilir miyim?',
      answer:
        'Evet, yumuşak altyazılarla. Her dil için bir dosya yapın ve her birini kendi izi olarak ekleyin. Bu site transkripti konuşulan dilde yazabilir ve konuşmayı İngilizceye çevirebilir, ancak metni diğer dillere kendiniz ya da başka bir araçla çevirmeniz gerekir.',
    },
    {
      question: 'Altyazılarım videoyla neden eşzamansız?',
      answer:
        'Ya dosyanın tamamı kaymıştır; çoğu oynatıcı bunu bir altyazı gecikmesi ayarıyla düzeltebilir, ya da video altyazılar yapıldıktan sonra düzenlenmiştir. Altyazılar yapıldıkları sesin zamanını izler; bu yüzden videonun son kurgusunu yazıya dökün.',
    },
  ],
  links: [
    {
      label: 'SRT altyazı oluşturucu',
      path: '/srt-subtitle-generator',
      note: 'Bir videoyu SRT dosyasına çevirmek için buradan başlayın.',
    },
    {
      label: 'SRT ve VTT farkı',
      path: '/guides/srt-vs-vtt',
      note: 'Her dosyanın içinde ne olduğu ve durumunuz için hangisinin indirileceği.',
    },
    {
      label: 'VTT altyazı oluşturucu',
      path: '/vtt-subtitle-generator',
      note: 'Bir web sayfasının video öğesinin ihtiyaç duyduğu WebVTT dosyasını alın.',
    },
    {
      label: 'YouTube altyazı oluşturucu',
      path: '/youtube-subtitle-generator',
      note: 'YouTube’a özgü yol; dosyadan Studio yüklemesine.',
    },
    {
      label: 'Konuşmayı İngilizceye çevirme',
      path: '/translate-audio-to-english',
      note: 'Başka bir dilde konuşulan bir videodan İngilizce altyazı alın.',
    },
  ],
};
