import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Video thành văn bản',
  h1: 'Chuyển video thành văn bản, miễn phí và có mốc thời gian',
  lead: 'Tải lên một video đã quay và xem giọng nói trong đó biến thành văn bản, từng dòng một, mỗi dòng kèm thời điểm của nó. Bài giảng, buổi phỏng vấn, cuộc họp, clip quay bằng điện thoại và video quay màn hình đều dùng được, với hơn 50 ngôn ngữ.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Vì sao nên chuyển video thành văn bản',
  why: [
    'Rất khó tìm kiếm trong một video. Bạn không thể lướt qua, trích dẫn hay sao chép một câu từ video. Bản gỡ băng biến giọng nói thành văn bản để bạn tìm kiếm, trích dẫn, dịch và đọc chỉ trong một phần nhỏ thời gian, và mỗi dòng đều giữ mốc thời gian để bạn quay lại đúng khoảnh khắc đó.',
    'Mọi người dùng nó cho các bài giảng và hội thảo trực tuyến đã ghi hình, cảnh phỏng vấn, các cuộc họp nhóm đã lưu, bản demo sản phẩm, vlog và các clip ngắn trên mạng xã hội. Văn bản cũng là điểm khởi đầu tốt cho phụ đề, ghi chú chương trình, bài đăng blog và biên bản cuộc họp.',
  ],

  howTitle: 'Cách chuyển video thành văn bản',
  howToDescription:
    'Tải lên một tệp video, chọn ngôn ngữ được nói, chờ bản gỡ băng và tải về dưới dạng văn bản hoặc phụ đề.',
  steps: [
    {
      title: 'Chọn video của bạn',
      text: 'Thả video vào khung ở đầu trang này, hoặc bấm Chọn tệp. Video sẽ mở trong trình tải lên, nơi bạn có thể thêm nhiều video khác.',
    },
    {
      title: 'Đặt ngôn ngữ và chất lượng',
      text: 'Chọn ngôn ngữ được nói để có độ chính xác tốt nhất, hoặc để bật chế độ tự động nhận diện. Tiêu chuẩn phù hợp với hầu hết video. Nhanh nhất cho kết quả nhanh với giọng nói rõ. Với âm thanh nhiều tạp âm hoặc khó nghe, hãy chọn Độ chính xác cao hoặc Độ chính xác cao nhất; Độ chính xác cao nhất mất nhiều thời gian nhất và ít sai sót nhất.',
    },
    {
      title: 'Xem video được gỡ băng',
      text: 'Văn bản hiện ra trực tiếp, từng dòng một, cùng thanh tiến độ và ước tính thời gian còn lại.',
    },
    {
      title: 'Chỉnh sửa và tải về',
      text: 'Sửa bất kỳ dòng nào trong trình chỉnh sửa, rồi tải về TXT, SRT, VTT, Markdown, JSON hoặc PDF. Không có gì được lưu lại sau phiên làm việc của bạn, vì vậy hãy tải về trước khi rời đi.',
    },
  ],

  formatsTitle: 'Các tệp video được hỗ trợ và định dạng tải về',
  formatsIntro:
    'TranscribeVid đọc phần âm thanh, nên hình ảnh có chất lượng thế nào cũng được. Tệp chỉ có âm thanh cũng dùng được.',
  uploadTitle: 'Các tệp video bạn có thể tải lên',
  accepts: ['MP4', 'MKV', 'MOV', 'AVI', 'WEBM', 'WMV', 'FLV', 'M4V', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'văn bản thuần để đọc hoặc dán' },
    { name: 'SRT', use: 'phụ đề cho trình phát và phần mềm biên tập' },
    { name: 'VTT', use: 'phụ đề cho video trên web' },
    { name: 'Markdown', use: 'văn bản có tiêu đề và mốc thời gian' },
    { name: 'JSON', use: 'các dòng có thời gian dành cho chương trình' },
    { name: 'PDF', use: 'một bản để in' },
  ],

  tipsTitle: 'Mẹo để có bản gỡ băng video tốt hơn',
  tips: [
    {
      title: 'Nghe thử phút đầu tiên trước.',
      text: 'Nếu bạn khó nghe rõ giọng nói qua loa laptop thì phần mềm cũng sẽ gặp khó khăn. Hãy khắc phục vấn đề âm lượng trước khi tải lên.',
    },
    {
      title: 'Chọn đúng ngôn ngữ.',
      text: 'Chọn ngôn ngữ được nói đáng tin cậy hơn tự động nhận diện, nhất là với các clip ngắn hoặc có giọng địa phương.',
    },
    {
      title: 'Thêm gợi ý từ vựng.',
      text: 'Trong Tùy chọn khác, hãy liệt kê tên người, thương hiệu và thuật ngữ đúng như cách bạn muốn viết.',
    },
    {
      title: 'Đừng vượt quá giới hạn.',
      text: 'Video dài hơn hoặc nặng hơn giới hạn nêu trên sẽ bị từ chối, vì vậy hãy cắt các bản ghi dài thành nhiều phần trước.',
      browser: {
        title: 'Video dài cần nhiều thời gian hơn.',
        text: 'Không có giới hạn dung lượng, nhưng video dài sẽ chạy lâu hơn trên thiết bị của bạn và cần nhiều bộ nhớ hơn. Trên điện thoại, hãy cắt các bản ghi rất dài thành nhiều phần.',
      },
    },
    {
      title: 'Kiểm tra các dòng được đánh dấu.',
      text: 'Những dòng mà công cụ nhận dạng chưa chắc chắn sẽ được đánh dấu. Hãy xem lại chúng trước, vì không có bản gỡ băng nào là hoàn hảo.',
    },
  ],

  faqs: [
    {
      question: 'Chuyển video thành văn bản có thật sự miễn phí không?',
      answer:
        'Có. Dịch vụ miễn phí, không cần tài khoản hay đăng nhập, và không có hạn mức theo ngày hay theo tháng. {limits} Nếu nhiều người đang dùng dịch vụ, tệp của bạn có thể phải xếp hàng chờ một lúc.',
      browser: {
        answer:
          'Có. Dịch vụ miễn phí, không cần tài khoản hay đăng nhập, và không có hạn mức theo ngày hay theo tháng; quảng cáo giúp dịch vụ luôn miễn phí. Video của bạn được gỡ băng ngay trong trình duyệt, trên thiết bị của bạn, nên không có giới hạn dung lượng và không ai xếp trước bạn: tốc độ nhanh hay chậm tùy vào thiết bị của bạn.',
      },
    },
    {
      question: 'Tôi có thể gỡ băng một video không có lời nói không?',
      answer:
        'Chỉ có giọng nói mới được chuyển thành văn bản. Video không có tiếng, hoặc chỉ có nhạc, sẽ cho kết quả trống hoặc rất ngắn. Chữ hiển thị trên màn hình không được đọc.',
    },
    {
      question: 'Tôi có thể dán liên kết YouTube không?',
      answer:
        'Không. TranscribeVid làm việc với các tệp bạn tải lên hoặc ghi âm, không dùng liên kết web. Nếu video là của bạn, hãy tải lên tệp gốc.',
    },
    {
      question: 'Công cụ có cho biết ai đang nói không?',
      answer:
        'Không. Tên hay nhãn người nói không được thêm vào. Mỗi dòng đều có mốc thời gian, và bạn có thể gõ tên vào văn bản khi chỉnh sửa.',
    },
    {
      question: 'Chuyển video thành văn bản chính xác đến mức nào?',
      answer:
        'Với giọng nói rõ ràng trong một ngôn ngữ được hỗ trợ, kết quả thường rất chính xác, nhưng không có công nghệ nhận dạng giọng nói nào là hoàn hảo. Tạp âm, giọng địa phương, nhạc nền và nhiều người nói chồng lên nhau làm giảm độ chính xác, vì vậy hãy đối chiếu các đoạn quan trọng với video.',
    },
  ],
};
