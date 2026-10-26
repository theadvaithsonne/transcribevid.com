import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Cách thêm phụ đề vào video miễn phí',
  lead: 'Làm phụ đề gồm bốn bước: chuyển lời nói thành văn bản, sửa lỗi, xuất tệp SRT hoặc VTT và gắn tệp đó vào video. Bài hướng dẫn này đi qua từng bước và chỉ cách gắn tệp trong YouTube, VLC, phần mềm biên tập video, một trang web, hoặc gắn cố định vào hình ảnh bằng ffmpeg.',
  readingMinutes: 10,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Tạo phụ đề từ video của bạn',
  blocks: [
    {
      title: 'Trước hết hãy chọn: phụ đề rời hay phụ đề nhúng cứng',
      paragraphs: [
        'Có hai cách để đưa phụ đề lên video, và lựa chọn của bạn quyết định những bước nào cần làm.',
      ],
      bullets: [
        {
          title: 'Phụ đề rời (một track riêng).',
          text: 'Phụ đề là một tệp hoặc một track nằm cạnh video. Người xem có thể bật hoặc tắt chúng, chọn ngôn ngữ, và bạn có thể sửa lỗi chính tả sau này mà không phải động đến video. YouTube, VLC, hầu hết trình phát và các trang web đều hoạt động theo cách này. Cách này cần một trình phát hỗ trợ track phụ đề.',
        },
        {
          title: 'Phụ đề nhúng cứng (là một phần của hình ảnh).',
          text: 'Chữ được vẽ lên từng khung hình, nên nó hiện ở mọi nơi, kể cả trên những nền tảng không nhận tệp phụ đề. Cái giá phải trả là không ai tắt được nó, bạn không thể sửa nếu không xuất lại video, và video phải được mã hóa lại.',
        },
      ],
      after: [
        'Nếu phân vân, hãy bắt đầu với phụ đề rời. Chỉ nhúng cứng khi nơi bạn đăng không cho tải phụ đề lên.',
      ],
    },
    {
      title: 'Bốn bước trong một cái nhìn',
      steps: [
        {
          title: 'Chuyển video thành văn bản',
          text: 'Thêm video ở trang chủ, chọn ngôn ngữ được nói và để lời nói biến thành văn bản có mốc thời gian.',
        },
        {
          title: 'Sửa văn bản',
          text: 'Đọc bản gỡ băng và sửa tên, con số và những từ chưa rõ. Nếu các dòng phụ đề quá dài, hãy chọn Độ dài dòng phụ đề ngắn hơn trong menu Xuất.',
        },
        {
          title: 'Xuất SRT hoặc VTT',
          text: 'Tải tệp phụ đề về. SRT dùng được gần như ở mọi nơi. VTT dành cho phần tử video của một trang web.',
        },
        {
          title: 'Gắn tệp vào video',
          text: 'Tải nó lên YouTube, nạp nó vào trình phát hoặc phần mềm biên tập, hoặc thêm vào trang của bạn. Hoặc nhúng cứng nó vào video.',
        },
      ],
    },
    {
      title: 'Bước 1 và 2: chuyển video thành văn bản và sửa văn bản',
      paragraphs: [
        'Hãy chọn video ở trang chủ và chọn ngôn ngữ mà mọi người nói trong đó, thay vì để ở chế độ tự động nhận diện. Chỉ rõ ngôn ngữ đáng tin cậy hơn, nhất là với đoạn clip ngắn và giọng vùng miền. Chất lượng Tiêu chuẩn phù hợp với hầu hết video. Hãy chọn Độ chính xác cao khi âm thanh ồn hoặc giọng nặng.',
        'Hãy để công tắc Mốc thời gian theo từng từ luôn bật trong Tùy chọn khác. Nó được bật sẵn, và nhờ đó mỗi phụ đề bắt đầu và kết thúc đúng theo các từ, thay vì ở rìa của một khối dài. Khi bản gỡ băng sẵn sàng, hãy phát video bên cạnh và đọc theo. Những từ mà công cụ nhận dạng ít chắc chắn hơn được gạch chân khi công tắc Gạch chân từ chưa chắc chắn bật (mặc định là bật), vì vậy hãy kiểm tra chúng trước.',
        'Phụ đề được đọc rất nhanh, nên hãy định hình văn bản cho người xem. Đây là các hướng dẫn được dùng rộng rãi, không phải quy tắc cứng nhắc:',
      ],
      bullets: [
        {
          title: 'Độ dài dòng.',
          text: 'Khoảng 42 ký tự mỗi dòng, và không quá hai dòng cùng lúc. Menu Xuất có lựa chọn Độ dài dòng phụ đề: Ngắn (32 chữ cái), Tiêu chuẩn (42) hoặc Dài (56).',
        },
        {
          title: 'Thời gian hiển thị.',
          text: 'Mỗi phụ đề nên hiện ít nhất khoảng một giây, và hiếm khi lâu hơn khoảng bảy giây.',
        },
        {
          title: 'Tốc độ đọc.',
          text: 'Khoảng 15 đến 20 ký tự mỗi giây là thoải mái với hầu hết người lớn. Nếu người xem không đọc xong trước khi dòng chữ đổi, hãy rút gọn cách diễn đạt hoặc để nó hiện lâu hơn.',
        },
        {
          title: 'Ngắt dòng tự nhiên.',
          text: 'Một phụ đề tốt ngắt ở cuối một cụm từ, không ngắt giữa một cái tên hay giữa một mạo từ và danh từ của nó. Bản xuất tự ngắt các dòng dài cho bạn, vì vậy hãy giữ mỗi dòng đã chỉnh sửa là một cụm từ hoàn chỉnh.',
        },
      ],
    },
    {
      title: 'Bước 3: chọn SRT hay VTT',
      paragraphs: [
        'Hãy tải SRT, trừ khi phụ đề dành cho một video trên trang web của riêng bạn. YouTube, VLC và gần như mọi phần mềm biên tập đều nhận SRT. Một trang web cần VTT, vì trình duyệt chỉ đọc track phụ đề ở định dạng đó.',
        'Bạn có thể tải cả hai từ cùng một bản gỡ băng, nên không cần quyết định trước. Bài hướng dẫn về SRT và VTT giải thích chính xác những điểm khác nhau, kể cả nội dung bên trong từng tệp.',
      ],
    },
    {
      title: 'Bước 4: thêm tệp vào YouTube, VLC hoặc phần mềm biên tập',
      paragraphs: [
        'Tên các menu thỉnh thoảng thay đổi, vì vậy hãy tìm mục gần giống nhất nếu nhãn khác với nhãn dưới đây.',
      ],
      bullets: [
        {
          title: 'YouTube.',
          text: 'Mở YouTube Studio, chọn video, mở Phụ đề, thêm một ngôn ngữ, rồi chọn tải tệp lên. Chọn tùy chọn dành cho tệp có thời gian, chọn tệp SRT của bạn và đăng. Sau đó YouTube cho phép bạn sửa các dòng ngay trong cùng màn hình.',
        },
        {
          title: 'VLC.',
          text: 'Phát video, rồi chọn Phụ đề (Subtitle), Thêm tệp phụ đề (Add Subtitle File) từ menu và chọn tệp SRT của bạn. Bạn cũng có thể kéo tệp vào cửa sổ trình phát. Hoặc lưu tệp SRT cạnh video với cùng tên (lecture.mp4 và lecture.srt) và VLC thường tự nạp nó.',
        },
        {
          title: 'Phần mềm biên tập video.',
          text: 'Hầu hết phần mềm biên tập có thể nhập tệp SRT làm track chú thích hoặc phụ đề, từ một menu như Tệp, Nhập, hoặc từ bảng chú thích. Khi nó đã nằm trên dòng thời gian, bạn có thể đổi kiểu chữ. Nếu một định dạng bị từ chối, hãy thử định dạng kia.',
        },
        {
          title: 'Điện thoại và máy tính bảng.',
          text: 'Một ứng dụng phát video hỗ trợ tệp phụ đề, chẳng hạn VLC cho di động, có thể nạp tệp SRT từ phần tệp của bạn. Trình phát thư viện ảnh tích hợp sẵn trên nhiều điện thoại thì không làm được.',
        },
      ],
    },
    {
      title: 'Thêm phụ đề vào trang web bằng phần tử track',
      paragraphs: [
        'Trên website của riêng bạn, phần tử video của HTML nạp phụ đề thông qua một phần tử track trỏ đến tệp WebVTT. Hãy xuất VTT, tải nó lên cạnh video và thêm một dòng.',
      ],
      code: {
        label: 'Một video có track phụ đề',
        text: `<video controls src="talk.mp4">
  <track kind="subtitles" src="talk.en.vtt"
         srclang="en" label="English" default>
</video>`,
      },
      after: [
        'Thuộc tính default hiển thị track mà người xem không cần chọn. Hãy thêm một dòng track cho mỗi ngôn ngữ. Nếu tệp VTT nằm ở tên miền khác với trang, máy chủ đó phải cho phép các yêu cầu cross-origin, nếu không trình duyệt sẽ không nạp nó.',
      ],
    },
    {
      title: 'Thêm track phụ đề rời vào tệp MP4 bằng ffmpeg',
      paragraphs: [
        'ffmpeg là một công cụ dòng lệnh miễn phí có thể đóng gói phụ đề vào bên trong tệp MP4, để video và phụ đề đi cùng nhau trong một tệp. Hình và tiếng được sao chép nguyên vẹn, nên cách này nhanh và không làm mất chất lượng. Hãy đặt video và tệp SRT vào cùng một thư mục rồi chạy lệnh dưới đây tại đó.',
      ],
      code: {
        label: 'Phụ đề rời bên trong tệp MP4 (người xem có thể tắt chúng)',
        text: `ffmpeg -i talk.mp4 -i talk.srt -map 0:v -map 0:a? -map 1:0 -c:v copy -c:a copy -c:s mov_text -metadata:s:s:0 language=eng talk-subtitled.mp4`,
      },
      after: [
        'Các tùy chọn -map chọn chính xác những gì được đưa vào tệp mới: toàn bộ phần hình, mọi âm thanh (dấu hỏi chấm cho phép lệnh chạy tiếp nếu không có âm thanh) và tệp phụ đề. Chọn từng luồng bằng tay giúp tránh lỗi với các tệp quay từ điện thoại và máy ảnh có thêm các track dữ liệu phụ, thứ mà MP4 thường không sao chép được. Thiết lập mov_text là kiểu phụ đề mà tệp MP4 sử dụng. Mã ngôn ngữ gồm ba chữ cái: eng cho tiếng Anh, spa cho tiếng Tây Ban Nha, hin cho tiếng Hindi, v.v. Các trình phát như VLC hiển thị track này trong menu phụ đề của chúng.',
      ],
    },
    {
      title: 'Nhúng cứng phụ đề vào hình ảnh bằng ffmpeg',
      paragraphs: [
        'Với nền tảng chỉ nhận một video, hãy vẽ chữ lên từng khung hình. Cách này mã hóa lại video, nên mất nhiều thời gian hơn và tệp được tạo lại. Âm thanh được sao chép nguyên trạng. Hãy chạy lệnh trong thư mục chứa cả hai tệp để tránh rắc rối với đường dẫn tệp.',
      ],
      code: {
        label: 'Phụ đề nhúng cứng (vĩnh viễn, không thể tắt)',
        text: `ffmpeg -i talk.mp4 -vf "subtitles=talk.srt" -c:a copy talk-burned.mp4`,
      },
      after: [
        "Để đổi giao diện, hãy thêm một kiểu sau tên tệp, ví dụ subtitles=talk.srt:force_style='FontSize=22' bên trong dấu ngoặc kép của lệnh. Hãy giữ lại một bản của video gốc, vì bản đã nhúng cứng không thể chuyển ngược lại thành phụ đề rời.",
      ],
    },
    {
      title: 'Khả năng tiếp cận, và vì sao bạn phải kiểm tra văn bản',
      paragraphs: [
        'Phụ đề giúp người khiếm thính hoặc nghe kém, người xem trên tàu hay trong văn phòng yên tĩnh khi tắt tiếng, người đang học ngôn ngữ đó, và bất kỳ ai thấy dễ theo dõi hơn khi có chữ. Nhiều người xem bật phụ đề ngay cả khi họ có thể nghe được âm thanh.',
        'Nhận dạng giọng nói rất tốt, nhưng không hoàn hảo, và một phụ đề sai tên hay sai con số có thể gây hiểu lầm. Hãy luôn đối chiếu bản gỡ băng với video trước khi đăng, và đặc biệt cẩn thận với tên, số liệu, thuật ngữ chuyên môn và bất cứ điều gì liên quan đến pháp lý hay y tế. Phụ đề có mô tả cả những âm thanh quan trọng, chẳng hạn tiếng cười hoặc tiếng đóng cửa, hữu ích hơn cho người không nghe được chúng, và bạn có thể thêm các mô tả đó bằng tay khi chỉnh sửa.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Phụ đề (subtitles) và chú thích (captions) khác nhau thế nào?',
      answer:
        'Subtitles dịch hoặc viết ra lời nói cho người xem vẫn nghe được video. Captions còn mô tả các âm thanh, như nhạc hoặc tiếng cười, cho người xem không nghe được. Hai loại tệp này giống nhau, nên bạn có thể tự thêm phần mô tả âm thanh vào tệp SRT nếu muốn có captions.',
    },
    {
      question: 'Tôi có cần phần mềm đặc biệt để thêm phụ đề không?',
      answer:
        'Không. Hãy tải tệp SRT lên trong YouTube Studio, kéo nó vào VLC hoặc nhập nó vào phần mềm biên tập của bạn. Chỉ việc đóng gói tệp vào MP4, hoặc nhúng cứng chữ vào hình ảnh, mới cần một công cụ như ffmpeg hoặc phần mềm biên tập video có thể xuất ra.',
    },
    {
      question: 'Tôi có thể thêm phụ đề bằng nhiều hơn một ngôn ngữ không?',
      answer:
        'Có, với phụ đề rời. Hãy làm một tệp cho mỗi ngôn ngữ và thêm từng tệp làm một track riêng. Trang này có thể viết bản gỡ băng bằng ngôn ngữ được nói và có thể dịch lời nói sang tiếng Anh, nhưng bạn sẽ phải tự dịch văn bản sang các ngôn ngữ khác hoặc dùng một công cụ khác.',
    },
    {
      question: 'Vì sao phụ đề của tôi bị lệch so với video?',
      answer:
        'Hoặc là cả tệp bị lệch, điều mà hầu hết trình phát có thể sửa bằng thiết lập độ trễ phụ đề, hoặc là video đã được chỉnh sửa sau khi làm phụ đề. Phụ đề theo thời gian của âm thanh mà chúng được tạo từ đó, vì vậy hãy gỡ băng bản dựng cuối cùng của video.',
    },
  ],
  links: [
    {
      label: 'Tạo phụ đề SRT',
      path: '/srt-subtitle-generator',
      note: 'Bắt đầu từ đây để biến một video thành tệp SRT.',
    },
    {
      label: 'SRT hay VTT',
      path: '/guides/srt-vs-vtt',
      note: 'Nội dung bên trong từng tệp, và nên tải tệp nào cho trường hợp của bạn.',
    },
    {
      label: 'Tạo phụ đề VTT',
      path: '/vtt-subtitle-generator',
      note: 'Lấy tệp WebVTT mà phần tử video của một trang web cần.',
    },
    {
      label: 'Tạo phụ đề YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Quy trình riêng cho YouTube, từ tệp đến bước tải lên trong Studio.',
    },
    {
      label: 'Dịch lời nói sang tiếng Anh',
      path: '/translate-audio-to-english',
      note: 'Có phụ đề tiếng Anh từ một video nói bằng ngôn ngữ khác.',
    },
  ],
};
