import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Ghi âm thành văn bản',
  h1: 'Chuyển bản ghi âm giọng nói thành văn bản ngay trên trình duyệt',
  lead: 'Ghi âm bằng micro ngay trên trang, hoặc tải lên một ghi chú giọng nói từ điện thoại, rồi đọc lời của bạn dưới dạng văn bản. Miễn phí, không cần đăng nhập, hỗ trợ hơn 50 ngôn ngữ.',
  dropKind: 'audio',
  dropNoun: 'bản ghi âm',
  record: true,

  whyTitle: 'Công cụ này dùng để làm gì, và không dùng để làm gì',
  why: [
    'Nói nhanh hơn gõ, nên nhiều người ghi lại ý tưởng, ghi chú cuộc họp, các ý chính của bài giảng và bản nháp đầu tiên dưới dạng bản ghi âm rồi chuyển chúng thành văn bản sau. Trang này được tạo ra cho việc đó: ghi âm hoặc tải lên, rồi đọc, chỉnh sửa và tải văn bản về.',
    'Đây không phải là đọc chép trực tiếp. Bạn ghi âm, dừng lại, và bản gỡ băng được tạo từ toàn bộ bản ghi, nên các từ không hiện ra khi bạn còn đang nói. Đổi lại, mỗi dòng đều có mốc thời gian.',
  ],

  howTitle: 'Cách chuyển bản ghi âm thành văn bản',
  howToDescription:
    'Ghi âm bằng micro hoặc tải lên một ghi chú giọng nói, chọn ngôn ngữ, chờ bản gỡ băng và tải về.',
  steps: [
    {
      title: 'Ghi âm hoặc chọn một tệp',
      text: 'Thả ghi chú giọng nói vào khung ở đầu trang này (Voice Memos trên iPhone là các tệp M4A), hoặc bấm Chọn tệp. Để ghi âm trực tiếp, hãy bấm Ghi âm bằng micro bên dưới khung, rồi bấm Ghi âm từ micro, và cho phép truy cập khi trình duyệt hỏi.',
    },
    {
      title: 'Dừng lại và chọn ngôn ngữ',
      text: 'Nếu bạn đang ghi âm, hãy bấm Dừng ghi âm khi xong. Sau đó chọn ngôn ngữ được nói hoặc để tự động nhận diện.',
    },
    {
      title: 'Chờ bản gỡ băng',
      text: 'Văn bản hiện ra từng dòng một, cùng thanh tiến độ và ước tính thời gian còn lại.',
    },
    {
      title: 'Chỉnh sửa và tải về',
      text: 'Sửa bất kỳ từ nào, rồi tải về TXT, Markdown hoặc PDF. Bản gỡ băng chỉ tồn tại trong phiên làm việc của bạn, vì vậy hãy lưu những gì bạn cần.',
    },
  ],

  formatsTitle: 'Định dạng ghi chú giọng nói và định dạng tải về',
  formatsIntro:
    'Máy ghi âm trên điện thoại và máy tính lưu theo những định dạng khác nhau. Tất cả những định dạng này đều dùng được.',
  uploadTitle: 'Các tệp ghi âm bạn có thể tải lên',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'OGG', 'OPUS', 'FLAC', '3GP'],
  downloads: [
    { name: 'TXT', use: 'lời của bạn dưới dạng văn bản thuần' },
    { name: 'Markdown', use: 'ghi chú có mốc thời gian' },
    { name: 'PDF', use: 'một bản in của ghi chú' },
    { name: 'SRT', use: 'các dòng có thời gian, nếu bản ghi đi kèm một video' },
    { name: 'VTT', use: 'các dòng có thời gian cho trình phát web' },
    { name: 'JSON', use: 'các dòng có cấu trúc dành cho chương trình' },
  ],

  tipsTitle: 'Mẹo ghi âm giọng nói',
  tips: [
    {
      title: 'Thử micro trước.',
      text: 'Hãy ghi mười giây và nghe lại trước khi bắt đầu một buổi ghi âm dài.',
    },
    {
      title: 'Nói với nhịp độ đều.',
      text: 'Hãy nói gần micro trong một căn phòng yên tĩnh. Tiếng quạt, tiếng gõ phím và gió được thu rõ không kém giọng của bạn.',
    },
    {
      title: 'Phát âm rõ tên người và con số.',
      text: 'Hãy thêm những từ lạ vào gợi ý từ vựng trong Tùy chọn khác và chúng sẽ có nhiều khả năng được viết đúng hơn rất nhiều.',
    },
    {
      title: 'Không thấy nút micro?',
      text: 'Một số trình duyệt chỉ cho phép ghi âm trên các trang bảo mật hoặc sau khi bạn cấp quyền. Hãy ghi âm bằng ứng dụng ghi âm trên điện thoại rồi tải tệp lên thay thế.',
    },
    {
      title: 'Lưu ý đến người khác.',
      text: 'Hãy cho mọi người biết khi bạn ghi âm họ, và xin phép họ trước.',
    },
  ],

  faqs: [
    {
      question: 'Đây có phải là đọc chép trực tiếp không?',
      answer:
        'Không. Bạn ghi âm trước và bản gỡ băng được tạo sau đó. Muốn chữ hiện ra ngay khi bạn nói, hãy dùng tính năng đọc chép giọng nói trên điện thoại hoặc máy tính của bạn.',
    },
    {
      question: 'Tôi có thể dùng trên điện thoại không?',
      answer:
        'Có. Hãy mở trang trong trình duyệt trên điện thoại và ghi âm ngay trên trang, hoặc tải lên một tệp ghi chú giọng nói mà bạn đã lưu.',
    },
    {
      question: 'Một bản ghi âm có thể dài bao nhiêu?',
      answer:
        '{limits} Các tệp dài hơn sẽ bị từ chối trước khi xử lý, vì vậy hãy chia nhỏ chúng trước. Không có hạn mức theo ngày hay theo tháng.',
      browser: {
        answer:
          'Chúng tôi không đặt giới hạn: bản ghi âm được gỡ băng ngay trong trình duyệt, trên thiết bị của bạn, nên bản dài chỉ đơn giản là mất nhiều thời gian hơn. Trang sẽ cảnh báo bạn trên thiết bị chậm. Không có hạn mức theo ngày hay theo tháng.',
      },
    },
    {
      question: 'Công cụ có phân biệt được từng người nói không?',
      answer:
        'Không. Tên hay nhãn người nói không được thêm vào. Mỗi dòng đều có mốc thời gian, và bạn có thể gõ tên vào văn bản khi chỉnh sửa.',
    },
    {
      question: 'Bản ghi âm giọng nói của tôi có được lưu lại không?',
      answer:
        'Chỉ trong phiên làm việc của bạn. Nó bị xóa khi phiên kết thúc, sau một khoảng thời gian không hoạt động, hoặc khi bạn bấm Xóa dữ liệu của tôi ngay. Không có tài khoản.',
      browser: {
        answer:
          'Chỉ trong trình duyệt này: bản ghi âm của bạn không bao giờ rời khỏi thiết bị. Nó bị xóa sau một khoảng thời gian không hoạt động, hoặc khi bạn bấm Xóa dữ liệu của tôi ngay. Không có tài khoản.',
      },
    },
  ],
};
