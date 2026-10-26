import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP4 thành văn bản',
  h1: 'Gỡ băng video MP4 thành văn bản',
  lead: 'MP4 là định dạng của camera điện thoại, phần mềm quay màn hình và các bản xuất cuộc họp. Tải tệp của bạn lên và nhận bản gỡ băng có mốc thời gian, miễn phí và không cần đăng nhập.',
  dropKind: 'video',
  dropNoun: 'tệp MP4',

  whyTitle: 'Vì sao tệp MP4 dễ gỡ băng',
  why: [
    'MP4 là một container: nó chứa cả hình ảnh lẫn âm thanh. TranscribeVid đọc phần âm thanh và bỏ qua hình ảnh, nên không cần chuyển đổi gì trước và không cần thêm bước chuyển MP4 sang MP3 riêng.',
    'Nó phù hợp với những bản ghi vốn đã là MP4, như video quay bằng điện thoại, các cuộc họp Zoom hoặc Teams đã lưu, video quay màn hình, hội thảo trực tuyến và bản ghi bài giảng. Kết quả là văn bản có thời điểm ở mỗi dòng, sẵn sàng để tìm kiếm hoặc biến thành phụ đề.',
  ],

  howTitle: 'Cách chuyển MP4 thành văn bản',
  howToDescription:
    'Tải MP4 lên, chọn ngôn ngữ được nói và chất lượng, chờ bản gỡ băng rồi tải về.',
  steps: [
    {
      title: 'Tìm tệp MP4',
      text: 'Tìm tệp .mp4 trên điện thoại hoặc máy tính của bạn. Bạn không cần nén hay cắt tệp, trừ khi nó vượt quá giới hạn.',
      browser: {
        text: 'Tìm tệp .mp4 trên điện thoại hoặc máy tính của bạn. Bạn không cần nén hay cắt tệp trước.',
      },
    },
    {
      title: 'Tải lên',
      text: 'Thả tệp MP4 vào khung ở đầu trang này, hoặc bấm Chọn tệp. Trong trình tải lên, bạn có thể xếp hàng nhiều tệp MP4 cùng lúc.',
      browser: {
        title: 'Thêm tệp',
        text: 'Thả tệp MP4 vào khung ở đầu trang này, hoặc bấm Chọn tệp. Trong trình tải lên, bạn có thể thêm nhiều tệp MP4; chúng được gỡ băng lần lượt từng tệp một.',
      },
    },
    {
      title: 'Chọn ngôn ngữ và chất lượng',
      text: 'Chọn ngôn ngữ được nói. Tiêu chuẩn là lựa chọn được khuyên dùng. Độ chính xác cao và Độ chính xác cao nhất chậm hơn nhưng ít sai sót hơn, còn Nhanh nhất cho kết quả nhanh với giọng nói rõ.',
    },
    {
      title: 'Tải kết quả về',
      text: 'Lấy TXT để đọc, SRT hoặc VTT để dùng làm phụ đề cho chính tệp MP4 đó, hoặc PDF để in.',
    },
  ],

  formatsTitle: 'MP4 và các định dạng video khác',
  formatsIntro:
    'MP4 là trường hợp phổ biến, nhưng cùng khung tải lên này cũng nhận các loại video sau và các định dạng âm thanh thông dụng.',
  uploadTitle: 'Các tệp video bạn có thể tải lên',
  accepts: ['MP4', 'M4V', 'MOV', 'MKV', 'WEBM', 'AVI', 'WMV', 'FLV', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'lời nói dưới dạng văn bản thuần' },
    { name: 'SRT', use: 'tệp phụ đề cho chính tệp MP4 đó' },
    { name: 'VTT', use: 'phụ đề cho một trang web' },
    { name: 'PDF', use: 'bản gỡ băng để in hoặc chia sẻ' },
    { name: 'Markdown', use: 'ghi chú có mốc thời gian' },
    { name: 'JSON', use: 'dữ liệu cho công cụ của riêng bạn' },
  ],

  tipsTitle: 'Mẹo gỡ băng tệp MP4',
  tips: [
    {
      title: 'Kiểm tra xem có tiếng không.',
      text: 'Video quay màn hình không bật âm thanh sẽ không có lời nói để gỡ băng và cho kết quả trống.',
    },
    {
      title: 'Chú ý gió và căn phòng.',
      text: 'Video quay bằng điện thoại hay bị gió, khoảng cách và tiếng vang ảnh hưởng. Hãy cầm điện thoại gần hơn, hoặc dùng thêm micro ngoài ở lần sau.',
    },
    {
      title: 'Thu nhỏ tệp lớn bằng cách xuất riêng âm thanh.',
      text: 'Nếu tệp MP4 vượt quá giới hạn, hãy xuất riêng phần âm thanh (M4A hoặc MP3) từ phần mềm biên tập. Tệp sẽ nhỏ hơn nhiều và hoạt động y như vậy.',
      browser: {
        text: 'Một tệp MP4 rất dài cần rất nhiều bộ nhớ trên điện thoại. Hãy xuất riêng phần âm thanh (M4A hoặc MP3) từ phần mềm biên tập: tệp nhỏ hơn nhiều và hoạt động y như vậy.',
      },
    },
    {
      title: 'Giữ tệp SRT cạnh video.',
      text: 'Nhiều trình phát tự động nạp tệp .srt khi nó có cùng tên với video.',
    },
    {
      title: 'Kiểm tra tên người và con số.',
      text: 'Bản gỡ băng tự động hay sai nhất ở những chỗ này. Tìm và thay thế giúp sửa các chỗ lặp lại chỉ trong một lần.',
    },
  ],

  faqs: [
    {
      question: 'Tôi có cần chuyển MP4 sang MP3 trước không?',
      answer: 'Không. Hãy tải MP4 lên nguyên trạng. Âm thanh sẽ được đọc từ tệp giúp bạn.',
    },
    {
      question: 'Vì sao tệp MP4 của tôi bị từ chối?',
      answer:
        'Các tệp vượt quá giới hạn dung lượng hoặc thời lượng sẽ bị từ chối trước khi xử lý. {limits} Hãy cắt video thành nhiều phần, hoặc chỉ xuất phần âm thanh, rồi tải lên lại.',
      browser: {
        question: 'Vì sao tệp MP4 của tôi không chạy được?',
        answer:
          'Trình duyệt của bạn không đọc được âm thanh của nó: tệp có thể bị hỏng, không có luồng âm thanh hoặc dùng một định dạng âm thanh hiếm gặp. Hãy xuất âm thanh thành M4A hoặc MP3 từ phần mềm biên tập rồi thêm tệp đó vào. Không có giới hạn dung lượng hay thời lượng, nhưng các video rất dài cần đủ bộ nhớ trống.',
      },
    },
    {
      question: 'Tôi có thể thêm phụ đề vào tệp MP4 bằng công cụ này không?',
      answer:
        'Bạn nhận được một tệp phụ đề (SRT hoặc VTT) khớp thời gian với lời nói. TranscribeVid không chỉnh sửa hay mã hóa lại tệp MP4 của bạn, nên muốn chèn cứng phụ đề vào hình ảnh thì cần dùng phần mềm biên tập video.',
    },
    {
      question: 'Tôi có thể dán một liên kết thay vì tải lên không?',
      answer:
        'Không. TranscribeVid làm việc với các tệp bạn tải lên hoặc ghi âm, không dùng liên kết web. Nếu video là của bạn, hãy tải lên tệp gốc.',
    },
    {
      question: 'Công cụ có dùng được với Zoom, Teams và video quay bằng điện thoại không?',
      answer:
        'Có, mọi tệp MP4 có lời nói đều dùng được. Tên người nói không được thêm vào các cuộc họp, nhưng các dòng đều có mốc thời gian để bạn thêm tên khi chỉnh sửa.',
    },
  ],
};
