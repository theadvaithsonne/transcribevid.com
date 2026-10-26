import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Tạo bản gỡ băng podcast',
  h1: 'Tạo bản gỡ băng podcast từ tệp âm thanh của bạn',
  lead: 'Thả một tập vào và nhận bản gỡ băng đầy đủ, có mốc thời gian, để đăng bên cạnh, tìm kiếm, trích dẫn hoặc biến thành ghi chú chương trình. Miễn phí, không cần đăng ký và hỗ trợ hơn 50 ngôn ngữ.',
  dropKind: 'audio',
  dropNoun: 'tập podcast',

  whyTitle: 'Vì sao nên có bản gỡ băng cho một tập podcast',
  why: [
    'Bản gỡ băng giúp một tập dễ được tìm thấy, trích dẫn và theo dõi hơn. Người nghe có thể đọc lướt, đọc theo khi tắt tiếng hoặc ở nơi ồn ào, và tìm tên một khách mời trong đó. Người khiếm thính hoặc nghe kém, và những người nghe bằng ngôn ngữ thứ hai, cũng có thể dùng nó. Công cụ tìm kiếm cũng đọc văn bản dễ hơn âm thanh rất nhiều.',
    'Trang này tạo bản nháp đầu tiên: cả tập dưới dạng văn bản, với thời điểm ở mỗi dòng. Hãy dự định chỉnh sửa nó. Nhận dạng giọng nói không biết tên khách mời hay biệt ngữ của chương trình bạn, và không gán nhãn người nói. Hãy dùng cho những tập do bạn làm hoặc được phép sử dụng.',
  ],

  sections: [
    {
      title: 'Từ bản gỡ băng đến trang của tập',
      paragraphs: ['Một bản gỡ băng có thể phục vụ nhiều thứ bạn vốn đã đăng.'],
      bullets: [
        {
          title: 'Ghi chú chương trình.',
          text: 'Hãy đọc bản gỡ băng một lần, chọn các chủ đề và viết một tóm tắt ngắn kèm mốc thời gian của từng chủ đề. Tải Markdown về để dán vào ứng dụng ghi chú hoặc trình soạn thảo blog.',
        },
        {
          title: 'Bản gỡ băng dưới trình phát.',
          text: 'Tải TXT về, chỉnh lại các đoạn và thêm tên như Người dẫn chương trình và Khách mời bằng tay. Bản gỡ băng không có nhãn người nói riêng.',
        },
        {
          title: 'Phụ đề cho phiên bản video.',
          text: 'Nếu bạn cũng đăng tập này dưới dạng video, hãy tải SRT hoặc VTT về và tải lên làm phụ đề.',
        },
        {
          title: 'Câu trích và đoạn clip.',
          text: 'Hãy tìm dòng đó, đọc mốc thời gian của nó và cắt đoạn clip từ âm thanh của bạn tại thời điểm đó.',
        },
      ],
    },
    {
      title: 'Viết đúng tên người, biệt ngữ và các đoạn quảng cáo',
      paragraphs: [
        'Tên khách mời, tên thương hiệu và thuật ngữ của chương trình là những thứ công cụ nhận dạng hay sai nhất. Trước khi bắt đầu, hãy liệt kê chúng trong gợi ý từ vựng ở Tùy chọn khác: người dẫn chương trình, khách mời, tên chương trình, sản phẩm và mọi thuật ngữ bạn hay dùng. Khi bản gỡ băng sẵn sàng, hãy gõ một cái tên bị viết sai vào ô Tìm trong văn bản phía trên nó, mở Thay thế…, nhập cách viết đúng và áp dụng cho mọi dòng khớp cùng một lúc. Những dòng công cụ nhận dạng chưa chắc chắn được đánh dấu, vì vậy hãy xem lại chúng trước.',
        'Hãy giữ công tắc Bỏ qua khoảng lặng và nhạc luôn bật trong Tùy chọn khác, để nhạc hiệu và các quãng nghỉ dài không biến thành những từ bịa đặt. Hiệu ứng âm thanh và nhạc nền dưới một đoạn quảng cáo vẫn có thể thêm chữ lạc, vì vậy hãy xóa bất cứ thứ gì không được nói ra.',
      ],
    },
  ],

  howTitle: 'Cách tạo bản gỡ băng podcast',
  howToDescription:
    'Thêm tập podcast, liệt kê tên người và thuật ngữ, chờ bản gỡ băng và tải về cho trang của tập.',
  steps: [
    {
      title: 'Thêm tập podcast',
      text: 'Thả tập vào khung phía trên, hoặc bấm Chọn tệp. MP3 là định dạng podcast thông dụng, nhưng WAV, M4A, FLAC và các định dạng khác cũng dùng được. Khung này nhận một tập mỗi lần; ở trang kế tiếp, Thêm tệp khác cho phép bạn đưa thêm các tập.',
    },
    {
      title: 'Liệt kê tên người và thuật ngữ',
      text: 'Ở trang kế tiếp, mở Tùy chọn khác và đưa người dẫn chương trình, khách mời, tên chương trình và mọi biệt ngữ vào gợi ý từ vựng. Chọn ngôn ngữ được nói, hoặc giữ Tự động nhận diện.',
    },
    {
      title: 'Bắt đầu và chờ bản gỡ băng',
      text: 'Bấm Chuyển thành văn bản. Văn bản hiện ra từng dòng cùng thanh tiến độ. Tiêu chuẩn phù hợp với hầu hết các tập. Khi nói chồng lên nhau hoặc âm thanh kém là lúc Độ chính xác cao hay Độ chính xác cao nhất xứng đáng với thời gian bỏ ra. Chúng chậm hơn, cần bản tải về lần đầu nặng hơn, và bị làm mờ kèm lý do trên thiết bị không chạy được.',
    },
    {
      title: 'Chỉnh sửa và xuất',
      text: 'Sửa tên người và dấu câu, và thêm tên người nói bằng tay. Sau đó tải TXT hoặc Markdown cho trang của tập, hoặc SRT hay VTT cho phiên bản video.',
    },
  ],

  formatsTitle: 'Tệp podcast và định dạng tải về',
  formatsIntro:
    'MP3 là định dạng podcast thông dụng. Các tệp âm thanh khác được đọc theo cách tương tự, và tệp video cũng được chấp nhận.',
  uploadTitle: 'Các tệp âm thanh bạn có thể thêm',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'bản gỡ băng để đăng dưới trình phát' },
    { name: 'Markdown', use: 'ghi chú chương trình kèm mốc thời gian' },
    { name: 'SRT', use: 'phụ đề cho phiên bản video' },
    { name: 'VTT', use: 'một track bản gỡ băng cho trình phát web' },
    { name: 'PDF', use: 'bản gỡ băng để chia sẻ hoặc in' },
  ],

  tipsTitle: 'Mẹo cho bản gỡ băng podcast',
  tips: [
    {
      title: 'Gỡ băng bản trộn cuối cùng.',
      text: 'Tập đã hoàn thiện, với phần mở đầu và các đoạn quảng cáo, là thứ người nghe nghe thấy. Khi đó mốc thời gian khớp với tệp bạn đăng.',
    },
    {
      title: 'Dùng tệp WAV gốc khi bạn có.',
      text: 'MP3 là bản sao đã nén, và mỗi vòng nén thêm lại làm mất chi tiết. Âm thanh sạch hơn cho ít lỗi hơn.',
    },
    {
      title: 'Cắt các tập rất dài thành nhiều phần.',
      text: 'Một tệp lớn hơn hoặc dài hơn các giới hạn nêu trên trang này không thể được xử lý, vì vậy hãy chia một tập dài bằng bất kỳ phần mềm chỉnh sửa âm thanh nào trước.',
      browser: {
        title: 'Tập dài mất nhiều thời gian hơn.',
        text: 'Trang không đặt giới hạn về độ dài tập, nhưng một chương trình trò chuyện dài cần thời gian và bộ nhớ trống trên thiết bị của bạn. Chia nó tại một chỗ nghỉ tự nhiên bằng bất kỳ phần mềm chỉnh sửa âm thanh nào sẽ giúp bạn có phần đầu sớm hơn.',
      },
    },
    {
      title: 'Đọc theo một lần.',
      text: 'Đọc bản gỡ băng trong khi tập phát ở tốc độ bình thường là cách nhanh nhất để bắt những lỗi quan trọng.',
    },
    {
      title: 'Nói rõ rằng nó là tự động.',
      text: 'Nếu bạn đăng bản gỡ băng mà chưa chỉnh sửa kỹ, hãy nói rõ điều đó, để người đọc biết có thể còn những lỗi nhỏ.',
    },
  ],

  faqs: [
    {
      question: 'Tôi có thể đăng bản gỡ băng podcast tự động trên trang của tập không?',
      answer:
        'Có, với một tập do bạn làm. Hãy đọc qua trước, sửa tên người, thêm tên người nói bằng tay và cho người đọc biết rằng nó được tạo tự động. Nếu một khách mời yêu cầu bỏ một điều gì đó, hãy xóa nó khỏi văn bản nữa.',
    },
    {
      question: 'Bản gỡ băng podcast có tên người nói không?',
      answer:
        'Không. Hãy gõ "Người dẫn chương trình" và "Khách mời" vào văn bản khi chỉnh sửa; bản thân bản gỡ băng chỉ mang mốc thời gian.',
    },
    {
      question: 'Tôi có thể lấy ghi chú chương trình từ bản gỡ băng podcast không?',
      answer:
        'Bạn nhận được nguyên liệu thô, không phải bản tóm tắt. Bản gỡ băng không viết ghi chú chương trình cho bạn, nhưng mốc thời gian giúp liệt kê nhanh các chủ đề và phút bắt đầu của từng chủ đề.',
    },
    {
      question: 'Tôi có thể gỡ băng một tập podcast dài bao nhiêu trong một lần?',
      answer:
        '{limits} Một tập dài có thể cần được chia nhỏ. Không có hạn mức theo ngày hay theo tháng.',
      browser: {
        answer:
          'Trang không giới hạn độ dài tập. Một tập dài mất nhiều thời gian hơn và cần bộ nhớ trống trên chính thiết bị của bạn; trang sẽ cảnh báo bạn trên thiết bị chậm hơn.',
      },
    },
    {
      question: 'Tôi có thể gỡ băng một podcast từ nguồn cấp RSS hoặc một liên kết không?',
      answer:
        'Không. TranscribeVid làm việc với các tệp bạn thêm vào, không dùng liên kết web hay nguồn cấp. Hãy dùng tệp tập mà bạn đã làm hoặc xuất ra, và thêm nó vào khung ở đầu trang này.',
    },
  ],

  links: [
    {
      label: 'MP3 thành văn bản',
      path: '/mp3-to-text',
      note: 'Các thiết lập và mẹo cho loại tệp podcast phổ biến nhất.',
    },
    {
      label: 'Tạo phụ đề SRT',
      path: '/srt-subtitle-generator',
      note: 'Phụ đề cho phiên bản video của tập.',
    },
    {
      label: 'SRT hay VTT',
      path: '/guides/srt-vs-vtt',
      note: 'Trình phát hoặc nơi lưu trữ của bạn mong đợi tệp phụ đề nào.',
    },
    {
      label: 'Cách có bản gỡ băng chính xác hơn',
      path: '/guides/accurate-transcripts',
      note: 'Ít lỗi hơn từ cùng một tập.',
    },
  ],
};
