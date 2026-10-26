import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP3 thành văn bản',
  h1: 'Chuyển MP3 thành văn bản trực tuyến',
  lead: 'Từ các tập podcast đến bản ghi bài giảng và tin nhắn thoại, MP3 là định dạng âm thanh mà hầu hết chúng ta đều có cả đống. Tải một tệp MP3 lên và nhận bản gỡ băng có mốc thời gian miễn phí, không cần đăng nhập.',
  dropKind: 'audio',
  dropNoun: 'tệp MP3',

  whyTitle: 'Bản gỡ băng MP3 mang lại cho bạn điều gì',
  why: [
    'MP3 nén âm thanh thành một tệp nhỏ, đó là lý do podcast, máy ghi âm và các bài giảng tải về đều dùng nó. Điều đó cũng có ích ở đây: một tệp MP3 tải lên nhanh ngay cả khi kết nối chậm, và một tệp MP3 dài một giờ ở 128 kbps chỉ nặng khoảng 58 MB.',
    'Bản gỡ băng cho phép bạn tìm một cụm từ trong cả tập podcast dài, trích dẫn chính xác lời người được phỏng vấn, viết ghi chú chương trình mà không cần nghe lại, hoặc lưu một bản ghi bằng văn bản của một buổi nói chuyện hay tin nhắn thoại.',
  ],
  browserWhy: [
    'MP3 nén âm thanh thành một tệp nhỏ, đó là lý do podcast, máy ghi âm và các bài giảng tải về đều dùng nó. Điều đó cũng có ích ở đây: trình duyệt của bạn đọc tệp MP3 rất nhanh, và một tệp MP3 dài một giờ ở 128 kbps chỉ nặng khoảng 58 MB.',
    'Bản gỡ băng cho phép bạn tìm một cụm từ trong cả tập podcast dài, trích dẫn chính xác lời người được phỏng vấn, viết ghi chú chương trình mà không cần nghe lại, hoặc lưu một bản ghi bằng văn bản của một buổi nói chuyện hay tin nhắn thoại.',
  ],

  howTitle: 'Cách chuyển MP3 thành văn bản',
  howToDescription:
    'Tải MP3 lên, chọn ngôn ngữ được nói, chờ bản gỡ băng và tải về dưới dạng văn bản hoặc phụ đề.',
  steps: [
    {
      title: 'Chọn tệp MP3 của bạn',
      text: 'Thả tệp .mp3 vào khung ở đầu trang này, hoặc bấm Chọn tệp. Trong trình tải lên, bạn có thể thêm nhiều tệp, và mỗi tệp trở thành một bản gỡ băng riêng.',
    },
    {
      title: 'Chọn ngôn ngữ',
      text: 'Chọn ngôn ngữ được nói hoặc để tự động nhận diện. Để có văn bản tiếng Anh từ một ngôn ngữ khác, hãy mở Tùy chọn khác và đặt Kết quả thành Dịch sang tiếng Anh.',
    },
    {
      title: 'Chờ bản gỡ băng',
      text: 'Văn bản hiện ra trong lúc tệp được xử lý, cùng thanh tiến độ. Nhanh nhất cho kết quả nhanh, Độ chính xác cao nhất mất nhiều thời gian nhất và ít sai sót nhất.',
    },
    {
      title: 'Sửa và tải về',
      text: 'Sửa bất kỳ dòng nào, rồi tải TXT về để đọc, hoặc SRT và VTT nếu âm thanh đi kèm một video hay trình phát web.',
    },
  ],

  formatsTitle: 'MP3 và các định dạng âm thanh khác',
  formatsIntro:
    'MP3 là loại âm thanh được tải lên phổ biến nhất. Các định dạng âm thanh khác dưới đây hoạt động tương tự, và tệp video cũng được chấp nhận.',
  uploadTitle: 'Các tệp âm thanh bạn có thể tải lên',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'tập podcast hay buổi nói chuyện dưới dạng văn bản thuần' },
    { name: 'Markdown', use: 'ghi chú chương trình có mốc thời gian' },
    { name: 'SRT', use: 'phụ đề cho phiên bản video' },
    { name: 'VTT', use: 'một track bản gỡ băng cho trình phát web' },
    { name: 'PDF', use: 'bản gỡ băng để in hoặc gửi đi' },
    { name: 'JSON', use: 'các dòng có cấu trúc dành cho chương trình' },
  ],

  tipsTitle: 'Mẹo gỡ băng tệp MP3',
  tips: [
    {
      title: 'Tải lên bản tốt nhất.',
      text: 'MP3 là định dạng nén mất dữ liệu và mỗi lần lưu lại lại mất thêm một chút chi tiết. Nếu bạn vẫn còn tệp WAV hoặc bản ghi gốc, hãy tải bản đó lên.',
    },
    {
      title: 'Tránh tốc độ bit quá thấp.',
      text: 'Giọng nói chịu nén khá tốt, nhưng tốc độ bit quá thấp làm nhòe phụ âm và giảm độ chính xác.',
    },
    {
      title: 'Chia nhỏ các tập dài.',
      text: 'Tệp vượt quá giới hạn thời lượng sẽ bị từ chối. Hãy cắt một tập dài hai giờ thành nhiều phần bằng bất kỳ phần mềm chỉnh sửa âm thanh nào trước.',
      browser: {
        text: 'Không có giới hạn thời lượng, nhưng một tập dài hai giờ sẽ mất khá lâu trên thiết bị chậm. Hãy cắt nó thành nhiều phần bằng bất kỳ phần mềm chỉnh sửa âm thanh nào để đọc phần đầu sớm hơn.',
      },
    },
    {
      title: 'Xử lý phần mở đầu và nhạc.',
      text: 'Hãy giữ Bỏ qua khoảng lặng và nhạc luôn bật trong Tùy chọn khác, để nhạc hiệu và các quãng nghỉ dài không tạo ra những từ bịa đặt.',
    },
    {
      title: 'Ghi rõ tên khách mời.',
      text: 'Hãy nhập người dẫn chương trình, khách mời, tên chương trình và thương hiệu vào gợi ý từ vựng một lần, và chúng sẽ có nhiều khả năng được viết đúng hơn rất nhiều.',
    },
  ],

  faqs: [
    {
      question: 'Một tệp MP3 có thể dài bao nhiêu?',
      answer:
        '{limits} Một tệp MP3 dài 60 phút ở 128 kbps nặng khoảng 58 MB, nên giới hạn thời lượng quan trọng hơn giới hạn dung lượng. Không có hạn mức theo ngày hay theo tháng.',
      browser: {
        answer:
          'Chúng tôi không đặt giới hạn dung lượng hay thời lượng, vì tệp MP3 được gỡ băng ngay trong trình duyệt, trên thiết bị của bạn. Một tệp MP3 dài 60 phút ở 128 kbps nặng khoảng 58 MB; các tệp dài hơn chỉ đơn giản là mất nhiều thời gian hơn, và trang sẽ cảnh báo bạn trên thiết bị chậm. Không có hạn mức theo ngày hay theo tháng.',
      },
    },
    {
      question: 'Nén MP3 có làm giảm độ chính xác không?',
      answer:
        'Không nhiều ở chất lượng bình thường, vì giọng nói là trường hợp dễ với MP3. Tạp âm, tiếng vang và nhiều giọng nói chồng lên nhau ảnh hưởng nhiều hơn định dạng rất nhiều, vì vậy hãy ưu tiên bản gốc sạch khi bạn có.',
    },
    {
      question: 'Tôi có thể gỡ băng nhiều tệp MP3 cùng lúc không?',
      answer:
        'Có. Hãy thêm chúng cùng nhau và mỗi tệp trở thành một bản gỡ băng riêng trong phiên làm việc của bạn, bạn có thể mở và tải về riêng từng bản.',
    },
    {
      question: 'Tôi có thể dịch một tệp MP3 sang tiếng Anh không?',
      answer:
        'Có. Trong Tùy chọn khác, hãy đặt Kết quả thành Dịch sang tiếng Anh. Bản dịch là tự động, vì vậy hãy đọc lại văn bản tiếng Anh trước khi dùng. Các ngôn ngữ đích khác không được cung cấp.',
    },
    {
      question: 'Tệp MP3 của tôi có được lưu lại không?',
      answer:
        'Chỉ trong phiên làm việc của bạn. Nó tự động bị xóa khi phiên kết thúc, hoặc khi bạn bấm Xóa dữ liệu của tôi ngay. Không cần tài khoản.',
      browser: {
        answer:
          'Chỉ trong trình duyệt này: tệp MP3 của bạn không bao giờ rời khỏi thiết bị. Nó tự động bị xóa sau một khoảng thời gian không hoạt động, hoặc khi bạn bấm Xóa dữ liệu của tôi ngay. Không cần tài khoản.',
      },
    },
  ],
};
