import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Âm thanh thành văn bản',
  h1: 'Chuyển âm thanh thành văn bản mà không cần đăng ký',
  lead: 'Thả vào một tập podcast, buổi phỏng vấn, bài giảng hoặc ghi chú giọng nói và nhận bản gỡ băng có mốc thời gian để tìm kiếm, chỉnh sửa và tải về. Miễn phí, không giới hạn và hỗ trợ hơn 50 ngôn ngữ.',
  dropKind: 'audio',
  dropNoun: 'tệp âm thanh',
  record: true,

  whyTitle: 'Khi nào nên chuyển âm thanh thành văn bản',
  why: [
    'Âm thanh là loại nội dung khó lướt qua nhất. Bạn không thể tìm kiếm, đọc lướt hay trích dẫn nó mà không nghe lại. Bản gỡ băng giúp bạn tìm ra phút mà một điều gì đó được nói, lấy các câu trích dẫn chính xác và đọc một cuộc trò chuyện dài cả giờ chỉ trong vài phút.',
    'Các việc thường gặp là ghi chú chương trình podcast, phỏng vấn cho báo chí hoặc nghiên cứu, lịch sử truyền miệng, ghi chú giọng nói, bản nháp đọc chép và bản ghi các buổi học hay buổi nói chuyện. Chỉ gỡ băng những bản ghi do bạn tự thực hiện hoặc được phép sử dụng.',
  ],

  howTitle: 'Cách chuyển âm thanh thành văn bản',
  howToDescription:
    'Thêm một tệp âm thanh hoặc ghi âm mới, chọn ngôn ngữ, chờ bản gỡ băng rồi tải về.',
  steps: [
    {
      title: 'Thêm âm thanh của bạn',
      text: 'Thả tệp âm thanh vào khung ở đầu trang này, hoặc bấm Chọn tệp. Để ghi âm mới, hãy bấm Ghi âm bằng micro bên dưới khung.',
    },
    {
      title: 'Chọn ngôn ngữ',
      text: 'Chọn ngôn ngữ được nói, hoặc để tự động nhận diện. Tiêu chuẩn là lựa chọn khởi đầu tốt cho giọng nói rõ. Nhanh nhất cho kết quả nhanh, Độ chính xác cao nhất mất nhiều thời gian nhất và ít sai sót nhất.',
    },
    {
      title: 'Chờ văn bản hiện ra',
      text: 'Các dòng xuất hiện ngay khi được nhận dạng. Cải thiện âm thanh, được bật sẵn theo mặc định, lọc tiếng ù và tiếng rít, đồng thời làm đều giọng của người nói nhỏ.',
    },
    {
      title: 'Xem lại và xuất',
      text: 'Phát bất kỳ dòng nào từ mốc thời gian của nó, sửa lỗi, rồi tải bản gỡ băng về theo định dạng bạn cần.',
    },
  ],

  formatsTitle: 'Các tệp âm thanh được hỗ trợ và định dạng tải về',
  formatsIntro:
    'Các định dạng âm thanh phổ biến đều dùng được. Tệp video cũng được chấp nhận, và chỉ phần âm thanh của chúng được sử dụng.',
  uploadTitle: 'Các tệp âm thanh bạn có thể tải lên',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'văn bản sạch cho ghi chú và bản nháp' },
    { name: 'Markdown', use: 'văn bản có mốc thời gian, sẵn sàng cho ứng dụng ghi chú' },
    { name: 'PDF', use: 'một bản gỡ băng để in' },
    { name: 'SRT', use: 'các dòng có thời gian cho phụ đề' },
    { name: 'VTT', use: 'các dòng có thời gian cho trình phát web' },
    { name: 'JSON', use: 'mọi dòng và mốc thời gian, dành cho chương trình' },
  ],

  tipsTitle: 'Mẹo để có bản gỡ băng âm thanh chính xác',
  tips: [
    {
      title: 'Đặt micro gần miệng.',
      text: 'Tiếng vang và khoảng cách thường quan trọng hơn định dạng tệp. Một căn phòng yên tĩnh và micro ở gần còn hiệu quả hơn mọi thiết lập.',
    },
    {
      title: 'Mỗi lúc chỉ một giọng.',
      text: 'Nhiều người nói chồng lên nhau, nhạc nền dưới giọng nói và tạp âm lớn gây ra phần lớn lỗi.',
    },
    {
      title: 'Tải lên bản gốc.',
      text: 'Lưu lại bản ghi thành một tệp nhỏ hơn sẽ làm mất chi tiết. Hãy dùng bản gốc hoặc bản chất lượng tốt nhất bạn có.',
    },
    {
      title: 'Dùng gợi ý từ vựng.',
      text: 'Tên người, thương hiệu và thuật ngữ chuyên ngành là những thứ công cụ nhận dạng hay sai nhất. Hãy liệt kê chúng trong Tùy chọn khác.',
    },
    {
      title: 'Hỏi ý kiến trước khi ghi âm.',
      text: 'Hãy xin phép trước khi ghi âm hoặc gỡ băng giọng nói của người khác, và kiểm tra quy định tại địa phương về việc ghi âm cuộc gọi.',
    },
  ],

  faqs: [
    {
      question: 'Tôi có thể chuyển những định dạng âm thanh nào thành văn bản?',
      answer:
        'MP3, WAV, M4A, AAC, FLAC, OGG và OPUS. Các tệp video như MP4 và MKV cũng dùng được, vì chỉ phần âm thanh được sử dụng.',
    },
    {
      question: 'Tôi có thể ghi âm trực tiếp trên trang không?',
      answer:
        'Có, trên các trình duyệt cho phép truy cập micro. Bấm Ghi âm từ micro, cho phép truy cập khi được hỏi, rồi dừng lại. Bản ghi được gỡ băng sau khi bạn dừng, không phải trong lúc bạn nói.',
    },
    {
      question: 'Công cụ có dùng được cho một cuộc phỏng vấn hai người không?',
      answer:
        'Có, lời nói của cả hai người đều được gỡ băng. Tên hay nhãn người nói không được thêm vào, nhưng mỗi dòng đều có mốc thời gian và bạn có thể gõ tên vào văn bản khi chỉnh sửa.',
    },
    {
      question: 'Âm thanh có thể dài bao nhiêu?',
      answer:
        '{limits} Các tệp dài hơn hoặc nặng hơn sẽ bị từ chối trước khi xử lý, vì vậy hãy chia nhỏ chúng trước. Không có hạn mức theo ngày hay theo tháng.',
      browser: {
        answer:
          'Chúng tôi không đặt giới hạn: âm thanh được gỡ băng ngay trong trình duyệt, trên thiết bị của bạn, nên các bản ghi dài chỉ đơn giản là mất nhiều thời gian hơn và cần đủ bộ nhớ trống. Trang sẽ cảnh báo bạn trên thiết bị chậm. Không có hạn mức theo ngày hay theo tháng.',
      },
    },
    {
      question: 'Âm thanh của tôi có được lưu trữ không?',
      answer:
        'Các tệp chỉ được giữ trong phiên làm việc của bạn và tự động xóa khi phiên kết thúc, hoặc xóa ngay khi bạn bấm Xóa dữ liệu của tôi ngay. Không cần tài khoản.',
      browser: {
        answer:
          'Chỉ trong trình duyệt này: âm thanh của bạn không bao giờ rời khỏi thiết bị. Nó tự động bị xóa sau một khoảng thời gian không hoạt động, hoặc xóa ngay khi bạn bấm Xóa dữ liệu của tôi ngay. Không cần tài khoản.',
      },
    },
  ],
};
