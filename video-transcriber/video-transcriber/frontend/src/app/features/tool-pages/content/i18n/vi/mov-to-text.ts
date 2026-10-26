import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MOV thành văn bản',
  h1: 'Gỡ băng video MOV thành văn bản',
  lead: 'MOV là định dạng mà iPhone, Mac và nhiều máy ảnh ghi lại. Thêm tệp MOV của bạn và nhận bản gỡ băng có mốc thời gian, miễn phí, không cần đăng nhập. Chỉ phần âm thanh được đọc, nên dung lượng và codec của hình ảnh không quan trọng.',
  dropKind: 'video',
  dropNoun: 'tệp MOV',

  whyTitle: 'Vì sao tệp MOV không cần chuyển đổi',
  why: [
    'MOV là định dạng QuickTime của Apple. Giống như MP4, nó chứa cả hình ảnh lẫn âm thanh, và hầu hết tệp MOV mang âm thanh AAC được đọc trực tiếp. TranscribeVid đọc phần âm thanh đó và bỏ qua hình ảnh, nên không cần thêm bước chuyển MOV sang MP4 riêng.',
    'Tệp MOV thường lớn, vì điện thoại và máy ảnh quay ở chất lượng cao. Bạn không cần thu nhỏ hay chuyển đổi tệp của mình. Con đường nhanh nhất từ thư viện ảnh đến bản gỡ băng là thêm tệp đúng như nó vốn có.',
  ],

  sections: [
    {
      title: 'Tệp MOV đến từ đâu',
      bullets: [
        {
          title: 'Video trên iPhone và iPad.',
          text: 'Video quay bằng ứng dụng Camera được lưu thành tệp .MOV, dù định dạng hình ảnh là H.264 hay HEVC.',
        },
        {
          title: 'Bản quay màn hình trên Mac.',
          text: 'Thanh công cụ chụp màn hình (Shift-Command-5) và QuickTime Player lưu bản quay màn hình dưới dạng .mov. Hãy chọn micro trước khi quay, nếu không tệp sẽ không có lời nói.',
        },
        {
          title: 'Máy ảnh và phần mềm biên tập.',
          text: 'Nhiều máy ảnh không gương lật quay ở dạng MOV, và các phần mềm biên tập video như Final Cut Pro và Adobe Premiere Pro có thể xuất ra định dạng này.',
        },
      ],
    },
    {
      title: 'Lấy video từ iPhone của bạn',
      paragraphs: [
        'Cách đơn giản nhất là mở trang này ngay trên iPhone và bấm Chọn tệp. Bạn có thể chọn một video từ thư viện Ảnh hoặc từ Tệp. Nếu điện thoại hỏi dùng định dạng nào khi bạn chọn, cách trả lời nào cũng được, vì chỉ phần âm thanh được đọc.',
        'Để gỡ băng trên máy tính, hãy gửi video qua AirDrop, lưu vào Tệp hoặc iCloud Drive, hoặc sao chép sang bằng cáp. Tên các menu thay đổi giữa các phiên bản iOS và macOS, vì vậy hãy xem đây là gợi ý.',
      ],
    },
    {
      title: 'Video có nhiều hơn một track âm thanh',
      paragraphs: [
        'Một số máy ảnh và phần mềm biên tập ghi nhiều track âm thanh vào một tệp MOV, chẳng hạn micro của máy ảnh và micro cài áo. TranscribeVid dùng track âm thanh đầu tiên mà nó đọc được. Nếu lời nói bạn cần nằm ở track khác, hãy xuất một bản sao có track đó trước, hoặc trộn các track lại với nhau trong phần mềm biên tập.',
      ],
    },
  ],

  howTitle: 'Cách chuyển tệp MOV thành văn bản',
  howToDescription:
    'Thêm video MOV, chọn ngôn ngữ được nói và chất lượng, chờ bản gỡ băng và tải về.',
  steps: [
    {
      title: 'Thêm tệp MOV',
      text: 'Bấm Chọn tệp ở đầu trang này, hoặc thả tệp .mov vào khung. iPhone sẽ cho bạn chọn Ảnh và Tệp. Khung này chứa một video mỗi lần; Thêm tệp khác, ở trang kế tiếp, sẽ xếp hàng thêm các video.',
    },
    {
      title: 'Đặt ngôn ngữ và chất lượng',
      text: 'Ở trang kế tiếp, chọn ngôn ngữ được nói. Tiêu chuẩn là lựa chọn được khuyên dùng. Khi có gió, tiếng xe cộ hoặc người nói ở xa, Độ chính xác cao và Độ chính xác cao nhất mất nhiều thời gian hơn nhưng ít sai sót hơn. Sau đó bấm Chuyển thành văn bản.',
      browser: {
        text: 'Ở trang kế tiếp, chọn ngôn ngữ được nói. Tiêu chuẩn là lựa chọn được khuyên dùng. Khi có gió, tiếng xe cộ hoặc người nói ở xa, hãy thử Độ chính xác cao hoặc Độ chính xác cao nhất nếu thiết bị của bạn có hỗ trợ: chúng mất nhiều thời gian hơn và ít sai sót hơn, mỗi lựa chọn là một bản tải về lần đầu nặng hơn, và thiết bị không chạy được sẽ hiện nó bị làm mờ kèm lý do. Sau đó bấm Chuyển thành văn bản.',
      },
    },
    {
      title: 'Đọc và sửa',
      text: 'Văn bản hiện ra từng dòng, mỗi dòng có một mốc thời gian. Hãy phát từ bất kỳ dòng nào, sửa những chỗ sai và xóa những dòng bạn không muốn.',
    },
    {
      title: 'Tải bản gỡ băng về',
      text: 'Lấy TXT hoặc PDF để đọc, hoặc SRT hay VTT để dùng làm phụ đề trong phần mềm biên tập video hoặc trên web. Tệp MOV của bạn không bao giờ bị thay đổi.',
    },
  ],

  formatsTitle: 'MOV và các định dạng video khác',
  formatsIntro:
    'Cùng một khung nhận MOV và các loại sau, cùng với các định dạng âm thanh thông dụng.',
  uploadTitle: 'Các tệp video bạn có thể thêm',
  accepts: ['MOV', 'MP4', 'M4V', 'MKV', 'WEBM', '3GP', 'TS'],
  downloads: [
    { name: 'TXT', use: 'lời nói dưới dạng văn bản thuần' },
    { name: 'SRT', use: 'phụ đề cho phần mềm biên tập và trình phát' },
    { name: 'VTT', use: 'phụ đề cho một trang web' },
    { name: 'PDF', use: 'bản gỡ băng để in hoặc chia sẻ' },
    { name: 'Markdown', use: 'ghi chú có mốc thời gian' },
    { name: 'JSON', use: 'dữ liệu cho công cụ của riêng bạn' },
  ],

  tipsTitle: 'Mẹo gỡ băng video MOV',
  tips: [
    {
      title: 'Giữ Cải thiện âm thanh luôn bật.',
      text: 'Video quay bằng điện thoại thu cả gió, tiếng cầm máy và tiếng vang của phòng. Công tắc Cải thiện âm thanh trong Tùy chọn khác loại bỏ tiếng ù thấp và tiếng rít, đồng thời nâng những giọng nhỏ lên.',
    },
    {
      title: 'Kiểm tra track nào chứa giọng nói.',
      text: 'Nếu máy ảnh ghi hai micro thành các track riêng, hãy phát video và chắc chắn track đầu tiên là track có lời nói.',
    },
    {
      title: 'Cắt các bản ghi dài tại những chỗ nghỉ tự nhiên.',
      text: 'Các tệp vượt quá giới hạn dung lượng hoặc thời lượng sẽ bị từ chối. Hãy cắt video thành nhiều phần, hoặc chỉ xuất phần âm thanh, rồi thêm vào.',
      browser: {
        title: 'Bản ghi dài cần bộ nhớ.',
        text: 'Trang không đặt giới hạn dung lượng hay thời lượng, nhưng một video dài cần thời gian và bộ nhớ trống, nhất là trên điện thoại, và trình duyệt cũ có thể từ chối một tệp quá dài. Với bản ghi rất dài, hãy chỉ xuất phần âm thanh từ phần mềm biên tập hoặc cắt video thành nhiều phần.',
      },
    },
    {
      title: 'Hãy chủ động ghi cả âm thanh.',
      text: 'Bản quay màn hình trên Mac được thực hiện mà không có micro sẽ không có lời nói, và bản gỡ băng sẽ trống.',
    },
  ],

  faqs: [
    {
      question: 'Tôi có thể gỡ băng video iPhone mà không cần chuyển MOV sang MP4 không?',
      answer:
        'Có. Hãy thêm tệp MOV nguyên trạng. TranscribeVid đọc luồng âm thanh và bỏ qua hình ảnh, nên không cần chuyển đổi.',
    },
    {
      question: 'Video 4K hoặc HEVC từ iPhone của tôi có dùng được không?',
      answer:
        'Có. Chỉ phần âm thanh được dùng, nên kích thước hình ảnh và định dạng video không quan trọng. Điều quan trọng là luồng âm thanh, và các bản ghi trên iPhone và Mac dùng âm thanh AAC, được đọc trực tiếp.',
    },
    {
      question: 'Làm thế nào để chuyển video từ iPhone sang máy tính để gỡ băng?',
      answer:
        'Hãy gửi nó qua AirDrop tới Mac, lưu vào Tệp hoặc iCloud Drive, hoặc sao chép sang bằng cáp. Hoặc bỏ qua máy tính: hãy mở trang này trên iPhone và chọn video từ Ảnh.',
    },
    {
      question: 'Vì sao bản quay màn hình trên Mac của tôi không có văn bản?',
      answer:
        'Một bản quay màn hình chỉ có âm thanh nếu micro được chọn trước khi quay. Trong thanh công cụ Shift-Command-5, hãy mở Tùy chọn, chọn một micro và quay lại. Tên các menu có thể khác nhau giữa các phiên bản macOS.',
    },
    {
      question: 'Chuyện gì xảy ra nếu tệp MOV của tôi có hai track âm thanh?',
      answer:
        'TranscribeVid dùng track âm thanh đầu tiên mà nó đọc được. Nếu lời nói nằm ở track khác, hãy xuất một bản sao có track đó trước, hoặc trộn các track lại với nhau trong phần mềm biên tập.',
    },
  ],

  links: [
    {
      label: 'MP4 thành văn bản',
      path: '/mp4-to-text',
      note: 'Cùng dịch vụ cho tệp MP4, định dạng video điện thoại phổ biến còn lại.',
    },
    {
      label: 'Video thành văn bản',
      path: '/video-to-text',
      note: 'Trang chính cho mọi tệp video, kèm mẹo cho bài giảng, phỏng vấn và các clip.',
    },
    {
      label: 'Tạo phụ đề SRT',
      path: '/srt-subtitle-generator',
      note: 'Tạo phụ đề cho tệp MOV của bạn và xem bên trong một tệp SRT trông ra sao.',
    },
    {
      label: 'Cách thêm phụ đề vào video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Việc cần làm với tệp phụ đề sau khi bạn đã tải về.',
    },
  ],
};
