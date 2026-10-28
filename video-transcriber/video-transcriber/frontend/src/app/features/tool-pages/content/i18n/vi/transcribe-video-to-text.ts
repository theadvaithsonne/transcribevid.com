import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Gỡ băng video thành văn bản',
  h1: 'Chuyển video thành văn bản: miễn phí, không cần đăng ký, không giới hạn mỗi ngày',
  browserH1: 'Chuyển video thành văn bản: miễn phí, không cần đăng ký, không giới hạn, không tải tệp lên',
  lead: 'Thêm một video và nhận lại lời nói trong đó dưới dạng văn bản, mỗi dòng kèm mốc thời gian. Bạn không cần tạo tài khoản và không bị giới hạn mỗi ngày, nên video tiếp theo có thể bắt đầu ngay khi video này xong.',
  browserLead:
    'Thêm một video và nhận lại lời nói trong đó dưới dạng văn bản, mỗi dòng kèm mốc thời gian. Bạn không cần tạo tài khoản, không bị giới hạn mỗi ngày và không giới hạn dung lượng tệp, và video không bao giờ được tải lên: chính thiết bị của bạn làm việc đó.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: '"Miễn phí" nên có nghĩa gì khi bạn gỡ băng video',
  why: [
    'Nhiều trang ghi "gỡ băng video miễn phí" chỉ cho bạn một phút, hoặc vài tệp, rồi yêu cầu tạo tài khoản hoặc nhập thẻ. Trước khi chọn một trang, hãy kiểm tra bốn điều: có phải đăng ký hay không, bạn được bao nhiêu phút hoặc bao nhiêu tệp, tệp tối đa nặng bao nhiêu, và bạn có tải được kết quả về hay không.',
    'Ở đây, câu trả lời cho từng điều đều đơn giản. Bạn thêm video, không phải đăng ký gì, không có giới hạn theo ngày hay theo tháng, và bản gỡ băng được tải về dưới dạng TXT, SRT, VTT, PDF, Markdown hoặc JSON mà không mất phí. Công cụ không gắn tên người nói và không nhận liên kết: bạn thêm chính tệp video.',
  ],
  browserWhy: [
    'Nhiều trang ghi "gỡ băng video miễn phí" chỉ cho bạn một phút, hoặc vài tệp, rồi yêu cầu tạo tài khoản hoặc nhập thẻ. Trước khi chọn một trang, hãy kiểm tra bốn điều: có phải đăng ký hay không, bạn được bao nhiêu phút hoặc bao nhiêu tệp, tệp tối đa nặng bao nhiêu, và bạn có tải được kết quả về hay không.',
    'Ở đây, câu trả lời cho từng điều đều đơn giản. Bạn thêm video, không phải đăng ký gì, không có giới hạn theo ngày hay theo tháng và không giới hạn dung lượng, và bản gỡ băng được tải về dưới dạng TXT, SRT, VTT, PDF, Markdown hoặc JSON mà không mất phí. Vì thiết bị của bạn làm việc, bộ nhớ của nó là giới hạn thực sự duy nhất: một video rất dài có thể quá sức với điện thoại, nên hãy cắt thành nhiều phần trước. Công cụ không gắn tên người nói và không nhận liên kết: bạn thêm chính tệp video.',
  ],

  sections: [
    {
      title: 'Giới hạn miễn phí của các trang gỡ băng video khác, kiểm tra tháng 10 năm 2026',
      paragraphs: [
        'Đây là các câu trích từ trang của chính từng công cụ, đúng như nội dung trang đó vào ngày 28 tháng 10 năm 2026, được dịch sang tiếng Việt từ trang tiếng Anh của các nhà cung cấp. Các gói có thể thay đổi, nên hãy xem lại trang trước khi dựa vào một con số. Bài hướng dẫn được liên kết ở cuối trang này có bảng đầy đủ kèm liên kết đến từng nguồn.',
      ],
      bullets: [
        {
          title: 'Riverside.',
          text: '"Gỡ băng không giới hạn miễn phí. Không cần đăng ký." Công cụ miễn phí nhận tệp MP3, WAV, MP4 và MOV, và gán toàn bộ văn bản của một bản ghi nhiều người nói cho một người nói.',
        },
        { title: 'VoiceCheap.', text: '"Miễn phí cho tệp dài đến 60 phút, mỗi ngày 1 lần gỡ băng."' },
        { title: 'RecCloud.', text: '"Gói miễn phí của chúng tôi cho phép video dài đến 10 phút."' },
        { title: 'Caption-X.', text: '"Gói miễn phí gồm tổng cộng 5 lần gỡ băng, mỗi lần tối đa 5 phút."' },
        {
          title: 'Maestra.',
          text: '"Bản xem trước 1 phút", và "Đăng ký để tải xuống hoặc xuất bản gỡ băng của bạn."',
        },
        { title: 'Any2Text.', text: '"15 phút đầu miễn phí", sau đó $0.035 mỗi phút.' },
      ],
    },
    {
      title: 'Video của bạn đi đâu trong lúc được gỡ băng',
      paragraphs: [
        'Video được gửi đến máy chủ chạy trang web này, được gỡ băng tại đó và bị xóa khi phiên của bạn kết thúc. Nó không được đăng ở nơi nào khác.',
      ],
      browser: {
        paragraphs: [
          'Video ở lại trên thiết bị của bạn. Trình duyệt đọc video, tách phần âm thanh và chạy mô hình giọng nói Whisper trên đó, nên không có tệp nào được gửi cho chúng tôi hay cho bất kỳ ai khác.',
          'Chỉ các công cụ được tải về: trang web, mô hình giọng nói và bộ máy chạy nó. Mô hình nặng từ khoảng 77 MB đến hơn 1 GB một chút, tùy mức chất lượng và thiết bị của bạn, và sau đó được lưu trong trình duyệt. Để tự kiểm chứng, hãy mở bảng Network của trình duyệt trong lúc video được gỡ băng.',
        ],
      },
    },
    {
      title: 'Bốn mức chất lượng cho các loại video khác nhau',
      paragraphs: [
        'Nhanh nhất dùng mô hình Base nhỏ và phù hợp để có bản nháp nhanh cho giọng nói rõ. Tiêu chuẩn dùng mô hình lớn hơn và là lựa chọn thông thường. Độ chính xác cao chạy Large v3 Turbo và xử lý giọng vùng miền cũng như phòng ồn tốt hơn. Độ chính xác cao nhất chạy Large v3 đầy đủ và ít sai sót nhất, nhưng mất nhiều thời gian nhất.',
        'Mô hình càng lớn thì càng mất thời gian: Nhanh nhất cần ít thời gian nhất và Độ chính xác cao nhất cần nhiều nhất. Hãy thử Tiêu chuẩn trước, và chỉ nâng lên khi văn bản chưa đủ tốt.',
      ],
      browser: {
        paragraphs: [
          'Nhanh nhất dùng mô hình Base nhỏ và phù hợp để có bản nháp nhanh cho giọng nói rõ. Tiêu chuẩn dùng mô hình lớn hơn và là lựa chọn thông thường. Độ chính xác cao chạy Large v3 Turbo và xử lý giọng vùng miền cũng như phòng ồn tốt hơn. Độ chính xác cao nhất chạy Large v3 đầy đủ và ít sai sót nhất, nhưng mất nhiều thời gian nhất.',
          'Thiết bị của bạn làm việc, nên tốc độ phụ thuộc vào nó: một chiếc laptop đời mới nhanh hơn nhiều so với một chiếc điện thoại cũ, và trên điện thoại thì Nhanh nhất là mức nên dùng. Trên laptop, hãy thử Tiêu chuẩn trước, và chỉ nâng lên khi văn bản chưa đủ tốt.',
        ],
      },
    },
  ],

  howTitle: 'Cách chuyển video thành văn bản trong bốn bước',
  howToDescription: 'Thêm video, chọn ngôn ngữ và mức chất lượng, chờ văn bản hiện ra, rồi chỉnh sửa và tải về.',
  steps: [
    {
      title: 'Thêm video',
      text: 'Thả tệp vào khung ở đầu trang này, hoặc bấm Chọn tệp. Liên kết đến video trên web không được chấp nhận.',
    },
    {
      title: 'Chọn ngôn ngữ và chất lượng',
      text: 'Chọn ngôn ngữ được nói nếu bạn biết, và chọn một mức chất lượng. Tiêu chuẩn là khởi đầu tốt; hãy dùng Độ chính xác cao hoặc Độ chính xác cao nhất cho giọng vùng miền, tiếng ồn hoặc một ngôn ngữ như tiếng Hindi.',
    },
    {
      title: 'Chờ văn bản hiện ra',
      text: 'Các dòng hiện ra lần lượt cùng thanh tiến độ và thời gian còn lại.',
      browser: {
        text: 'Các dòng hiện ra lần lượt cùng thanh tiến độ và thời gian còn lại. Lần đầu bạn dùng một mức chất lượng, mô hình được tải về một lần; các video sau bắt đầu ngay.',
      },
    },
    {
      title: 'Chỉnh sửa và tải về',
      text: 'Sửa bất kỳ dòng nào trong trình chỉnh sửa, rồi tải TXT, SRT, VTT, PDF, Markdown hoặc JSON. Hãy tải về trước khi rời đi: sau phiên làm việc sẽ không có gì được giữ lại cho bạn.',
      browser: {
        text: 'Sửa bất kỳ dòng nào trong trình chỉnh sửa, rồi tải TXT, SRT, VTT, PDF, Markdown hoặc JSON. Bản gỡ băng được giữ trong trình duyệt này một thời gian, nhưng hãy tải về những gì bạn muốn giữ.',
      },
    },
  ],

  formatsTitle: 'Video bạn có thể thêm và các tệp bạn nhận lại',
  formatsIntro: 'Phần được đọc là âm thanh của video, nên hình ảnh có chất lượng thế nào cũng được. Tệp chỉ có âm thanh cũng dùng được.',
  uploadTitle: 'Các tệp video bạn có thể thêm',
  accepts: ['MP4', 'MOV', 'MKV', 'WEBM', 'AVI', 'M4V', '3GP'],
  downloads: [
    { name: 'TXT', use: 'văn bản thuần, hoặc có mốc thời gian ở mỗi dòng' },
    { name: 'SRT', use: 'phụ đề cho phần mềm biên tập và trình phát' },
    { name: 'VTT', use: 'phụ đề cho video trên web' },
    { name: 'PDF', use: 'bản gỡ băng để in hoặc chia sẻ' },
    { name: 'Markdown', use: 'ghi chú có mốc thời gian' },
    { name: 'JSON', use: 'từng từ và thời điểm, dành cho lập trình viên' },
  ],

  tipsTitle: 'Tận dụng tốt hơn một bản gỡ băng miễn phí',
  tips: [
    {
      title: 'Thử phút đầu tiên trước khi làm cả video.',
      text: 'Cắt hoặc phát một phút của video và gỡ băng phần đó. Nếu văn bản sai, hãy đổi ngôn ngữ hoặc mức chất lượng trước khi bạn tốn thời gian cho cả tệp.',
    },
    {
      title: 'Kiểm tra cả những gì hiện trên màn hình chứ không chỉ những gì bạn nghe.',
      text: 'Chỉ lời nói được ghi lại. Những cái tên xuất hiện trên một slide nhưng không ai nói ra sẽ không có trong văn bản.',
    },
    {
      title: 'Chia nhỏ một bản ghi rất dài.',
      text: 'Một video dài nhiều giờ dễ xử lý hơn khi chia thành các phần dài khoảng một giờ: bạn có thể bắt đầu đọc sớm hơn và làm lại một lỗi tốn ít công hơn.',
      browser: {
        title: 'Chia nhỏ một bản ghi rất dài khi dùng điện thoại.',
        text: 'Không có giới hạn dung lượng, nhưng một video dài nhiều giờ cần rất nhiều bộ nhớ. Trên điện thoại, các phần dài khoảng một giờ an toàn hơn nhiều, còn trên laptop bạn thường có thể làm lâu hơn nhiều.',
      },
    },
    {
      title: 'Tải cả tệp phụ đề lẫn văn bản.',
      text: 'Tệp SRT giữ nguyên mốc thời gian, nên cùng một lần chạy cho bạn cả bản gỡ băng để đọc lẫn phụ đề để thêm vào video.',
    },
  ],

  faqs: [
    {
      question: 'Tôi có thể dán liên kết YouTube, TikTok hoặc Google Drive thay vì tệp không?',
      answer: 'Không. Công cụ này làm việc trên tệp bạn thêm vào hoặc ghi âm. Nếu video là của bạn, hãy dùng tệp gốc; với video của người khác, bạn cần có quyền sử dụng nó.',
    },
    {
      question: 'Bản gỡ băng có cho biết ai đang nói không?',
      answer: 'Không. Các dòng có mốc thời gian nhưng không có tên người nói. Bạn có thể tự gõ tên vào văn bản trong trình chỉnh sửa, việc này khá nhanh với một cuộc phỏng vấn hai người.',
    },
    {
      question: 'Có thật là không giới hạn số video tôi có thể gỡ băng không?',
      answer: 'Không có tài khoản, không có gói và không giới hạn theo ngày hay theo tháng. {limits} Nếu nhiều người đang dùng dịch vụ, video của bạn có thể phải chờ trong hàng đợi một lúc.',
      browser: {
        answer:
          'Không có tài khoản, không có gói, không giới hạn theo ngày hay theo tháng và không giới hạn dung lượng. Giới hạn duy nhất là thiết bị của bạn: một video rất dài mất nhiều thời gian hơn và cần nhiều bộ nhớ hơn, nên điện thoại sẽ làm tốt hơn với các phần dài khoảng một giờ. Quảng cáo giúp trang web miễn phí, và không có quảng cáo nào hiển thị trong lúc video được gỡ băng.',
      },
    },
    {
      question: 'Mức chất lượng nào phù hợp với video dài?',
      answer: 'Tiêu chuẩn là lựa chọn thông thường. Nhanh nhất thì nhanh hơn nhưng sai nhiều hơn; Độ chính xác cao và Độ chính xác cao nhất tốn nhiều thời gian hơn và đáng giá với giọng vùng miền, tiếng ồn và các ngôn ngữ như tiếng Hindi.',
    },
    {
      question: 'Video có rời khỏi máy tính của tôi không?',
      answer: 'Video được gửi đến máy chủ chạy trang web này và bị xóa khi phiên của bạn kết thúc.',
      browser: {
        answer: 'Không. Trình duyệt của bạn gỡ băng video ngay trên thiết bị, và không có tệp nào được gửi cho chúng tôi. Chỉ mô hình giọng nói và bộ máy chạy nó được tải về, một lần.',
      },
    },
  ],

  links: [
    {
      label: 'So sánh các công cụ chuyển video thành văn bản miễn phí',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Mọi giới hạn trong một bảng, trích từ trang của chính từng công cụ.',
    },
    {
      label: 'Gỡ băng video mà không cần tải lên',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Cách công việc diễn ra ngay trên thiết bị của bạn và cách tự kiểm tra.',
    },
    {
      label: 'Cách chuyển video thành văn bản',
      path: '/guides/how-to-transcribe-video-to-text',
      note: 'Năm cách thực hiện, và cách nào hợp với video của bạn.',
    },
    {
      label: 'Cách có bản gỡ băng chính xác hơn',
      path: '/guides/accurate-transcripts',
      note: 'Thói quen và thiết lập giúp giảm sai sót với mọi video.',
    },
  ],
};
