import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Tạo phụ đề YouTube',
  h1: 'Tạo phụ đề cho video YouTube của chính bạn',
  lead: 'Thêm tệp video bạn đã làm cho YouTube, nhận một tệp SRT khớp thời gian với lời nói và tải nó lên trong YouTube Studio. Miễn phí, không cần đăng nhập, và bạn kiểm tra từng dòng trước khi đăng.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Vì sao nên tải lên tệp phụ đề của riêng bạn',
  why: [
    'YouTube tạo phụ đề tự động cho nhiều video, nhưng không phải lúc nào cũng đúng, và chúng không xuất hiện cho đến khi YouTube xử lý xong video. Một tệp phụ đề của riêng bạn cho phép bạn kiểm tra và sửa từng dòng, với tên người, sản phẩm và thuật ngữ được viết đúng như cách bạn viết.',
    'Trang này dành cho những video do chính bạn làm. Nó làm việc từ tệp video trên máy tính của bạn, không phải từ một liên kết YouTube: việc dán liên kết không được hỗ trợ. Nếu video là của bạn, bạn đã có bản gốc từ máy ảnh hoặc phần mềm biên tập. TranscribeVid là một công cụ độc lập và không liên kết với YouTube: nó không bao giờ đăng nhập vào kênh của bạn, nên bạn tự thêm tệp đã hoàn thiện vào đó.',
  ],

  sections: [
    {
      title: 'Thêm tệp SRT trong YouTube Studio',
      paragraphs: [
        'Tên các menu trong YouTube Studio thay đổi theo thời gian, vì vậy hãy xem các bước này là gợi ý và làm theo những nhãn bạn thấy trên màn hình.',
      ],
      bullets: [
        {
          title: 'Mở Phụ đề.',
          text: 'Đăng nhập vào kênh của bạn, mở YouTube Studio và chọn Phụ đề từ menu bên trái.',
        },
        {
          title: 'Chọn video.',
          text: 'Chọn video bạn muốn thêm phụ đề. Nếu YouTube hỏi ngôn ngữ của video, hãy đặt nó trước.',
        },
        {
          title: 'Thêm ngôn ngữ.',
          text: 'Chọn Thêm ngôn ngữ, chọn ngôn ngữ của tệp, rồi chọn Thêm trong mục Phụ đề.',
        },
        {
          title: 'Tải tệp lên.',
          text: 'Chọn Tải tệp lên, rồi Có thời gian, và chọn tệp .srt bạn đã tải về. Kiểm tra các dòng trong bản xem trước, rồi chọn Xuất bản.',
        },
      ],
    },
    {
      title: 'Phụ đề tiếng Anh từ một ngôn ngữ khác',
      paragraphs: [
        'Nếu video được nói bằng ngôn ngữ khác, hãy đặt Kết quả thành Dịch sang tiếng Anh trong Tùy chọn khác trước khi bắt đầu. Bạn nhận được văn bản tiếng Anh khớp thời gian với lời nói, và có thể tải lên làm một track phụ đề tiếng Anh. Bản dịch là do máy làm, vì vậy hãy đọc lại văn bản tiếng Anh trước khi công bố.',
        'TranscribeVid không dịch sang các ngôn ngữ ngoài tiếng Anh. Với mỗi ngôn ngữ khác mà bạn có tệp, hãy thêm một track riêng trong YouTube Studio.',
      ],
    },
    {
      title: 'Vì sao phụ đề đáng để bạn bỏ công',
      paragraphs: [
        'Mọi người xem ở những nơi không thể bật to tiếng, và nhiều người theo dõi một ngôn ngữ thứ hai tốt hơn qua chữ viết so với nghe. Phụ đề cũng giúp người khiếm thính hoặc nghe kém, và đưa lời nói của bạn thành văn bản có thể tìm kiếm và trích dẫn.',
      ],
    },
  ],

  howTitle: 'Cách tạo phụ đề cho một video YouTube',
  howToDescription:
    'Thêm tệp video, chọn ngôn ngữ được nói, kiểm tra các dòng, tải tệp SRT về và tải nó lên trong YouTube Studio.',
  steps: [
    {
      title: 'Thêm tệp video của bạn',
      text: 'Hãy chọn tệp video bạn đã tải lên YouTube, không phải một liên kết tới nó: thả vào khung ở đầu trang này hoặc bấm Chọn tệp. Với video thứ hai, hãy dùng Thêm tệp khác ở trang kế tiếp.',
    },
    {
      title: 'Chọn ngôn ngữ',
      text: 'Ở trang kế tiếp, chọn ngôn ngữ được nói, hoặc để Tự động nhận diện bật. Hãy giữ Mốc thời gian theo từng từ bật trong Tùy chọn khác, để mỗi dòng bắt đầu và kết thúc đúng theo các từ. Sau đó bấm Chuyển thành văn bản.',
    },
    {
      title: 'Kiểm tra các dòng',
      text: 'Mở bản gỡ băng, phát từ bất kỳ mốc thời gian nào và sửa những từ, tên người và con số sai. Xóa những dòng bạn không muốn hiển thị.',
    },
    {
      title: 'Tải SRT về và tải lên',
      text: 'Tải tệp SRT về, rồi thêm nó vào video trong YouTube Studio như mô tả ở trên.',
    },
  ],

  formatsTitle: 'Tệp video và tệp phụ đề',
  formatsIntro:
    'Hãy thêm tệp video bạn đã làm cho YouTube, ở bất kỳ loại nào sau đây, và tải phụ đề về theo định dạng bạn cần.',
  uploadTitle: 'Các tệp video bạn có thể thêm',
  accepts: ['MP4', 'MOV', 'M4V', 'WEBM', 'MKV', '3GP'],
  downloads: [
    { name: 'SRT', use: 'tệp phụ đề mà YouTube Studio yêu cầu' },
    { name: 'VTT', use: 'WebVTT, cho trình phát web' },
    { name: 'TXT', use: 'bản gỡ băng cho phần mô tả hoặc một bài blog' },
    { name: 'Markdown', use: 'văn bản kèm mốc thời gian' },
    { name: 'JSON', use: 'mọi dòng và mốc thời gian, dành cho chương trình' },
    { name: 'PDF', use: 'một kịch bản để in' },
  ],

  tipsTitle: 'Mẹo làm phụ đề cho YouTube',
  tips: [
    {
      title: 'Dùng bản dựng cuối cùng.',
      text: 'Hãy tạo tệp từ chính video bạn tải lên, không phải từ một bản nháp trước đó. Mỗi chỉnh sửa làm dịch chuyển lời nói cũng làm dịch chuyển thời gian.',
    },
    {
      title: 'Giữ mốc thời gian theo từng từ luôn bật.',
      text: 'Tùy chọn này được bật sẵn theo mặc định và cho thời gian phụ đề sát hơn so với việc đặt thời gian cho cả câu.',
    },
    {
      title: 'Sửa tên người trước khi đăng.',
      text: 'Văn bản tự động hay sai nhất ở tên kênh, sản phẩm và con số. Gợi ý từ vựng giúp được phần nào, và việc đọc lại sẽ bắt phần còn lại.',
    },
    {
      title: 'Đọc khi tắt tiếng.',
      text: 'Hãy xem video khi tắt tiếng và bật phụ đề. Bạn sẽ thấy ngay những dòng nào biến mất quá nhanh để kịp đọc.',
    },
  ],

  faqs: [
    {
      question: 'Tôi có thể tạo phụ đề cho một video YouTube mà tôi không tải lên không?',
      answer:
        'Không. Công cụ này chỉ làm việc với tệp, không dùng liên kết, và dành cho những video bạn làm hoặc có quyền sử dụng. Với video của chính bạn, hãy dùng tệp gốc từ máy ảnh hoặc phần mềm biên tập.',
    },
    {
      question: 'YouTube Studio cần tệp nào, SRT hay VTT?',
      answer:
        'SRT là lựa chọn an toàn nhất: đây là định dạng được dùng rộng rãi mà YouTube Studio đọc được. Hãy tải lên kèm thời gian, để các dòng khớp với lời nói.',
    },
    {
      question: 'Tôi có cần đăng nhập để tạo tệp phụ đề không?',
      answer:
        'Không. Bạn không cần tài khoản ở đây. Bạn chỉ cần kênh YouTube của mình để tải tệp lên trong YouTube Studio.',
    },
    {
      question:
        'Làm thế nào để có phụ đề tiếng Anh cho video bằng tiếng Tây Ban Nha hoặc tiếng Hindi?',
      answer:
        'Hãy đặt Kết quả thành Dịch sang tiếng Anh trong Tùy chọn khác trước khi bắt đầu. Bản gỡ băng sẽ ra bằng tiếng Anh kèm thời gian. Bản dịch là tự động và có thể có lỗi, vì vậy hãy đọc lại trước khi đăng nó làm một track tiếng Anh.',
    },
    {
      question: 'Vì sao phụ đề của tôi bị lệch thời gian trên YouTube?',
      answer:
        'Thường là do tệp được tạo từ một phiên bản khác của video, ví dụ trước khi phần đầu bị cắt. Hãy tạo lại tệp từ chính video bạn đã tải lên. Thời gian khá sát nhưng không chính xác đến từng khung hình, nên một lần kiểm tra cuối trong YouTube Studio sẽ có ích.',
    },
  ],

  links: [
    {
      label: 'Tạo phụ đề SRT',
      path: '/srt-subtitle-generator',
      note: 'Bên trong một tệp SRT trông ra sao, và cách sửa các dòng trước khi xuất.',
    },
    {
      label: 'Cách thêm phụ đề vào video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Những nơi khác để dùng tệp: trình phát media, phần mềm biên tập và trang web của riêng bạn.',
    },
    {
      label: 'Dịch lời nói sang tiếng Anh',
      path: '/translate-audio-to-english',
      note: 'Văn bản tiếng Anh từ lời nói bằng ngôn ngữ khác, và những điều cần kiểm tra sau đó.',
    },
    {
      label: 'SRT hay VTT: nên dùng định dạng phụ đề nào',
      path: '/guides/srt-vs-vtt',
      note: 'Hai định dạng phụ đề phổ biến khác nhau như thế nào.',
    },
  ],
};
