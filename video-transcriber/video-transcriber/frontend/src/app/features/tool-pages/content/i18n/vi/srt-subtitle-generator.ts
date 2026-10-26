import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Tạo phụ đề SRT',
  h1: 'Tạo phụ đề SRT từ tệp video hoặc âm thanh',
  lead: 'Tải video lên và tải về một tệp .srt dùng được ngay, mỗi dòng khớp thời gian với lời nói. Miễn phí, không cần đăng nhập, và bạn có thể sửa văn bản trước khi xuất.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'Bạn nhận được gì trong một tệp SRT',
  why: [
    'Tệp SRT là văn bản thuần. Nó liệt kê các đoạn phụ đề được đánh số, mỗi đoạn có thời điểm bắt đầu, thời điểm kết thúc và nội dung hiển thị trên màn hình. Hầu hết trình phát video, phần mềm biên tập và nền tảng video đều nạp được tệp này, nên đây là định dạng phụ đề an toàn nhất để bắt đầu.',
    'Phụ đề giúp người khiếm thính hoặc nghe kém, người xem không bật tiếng và bất kỳ ai theo dõi ngôn ngữ thứ hai tốt hơn khi đọc chữ. Chúng cũng làm cho lời nói trong video của bạn có thể tìm kiếm và trích dẫn được.',
  ],

  howTitle: 'Cách tạo tệp SRT',
  howToDescription:
    'Tải video lên, chọn ngôn ngữ, kiểm tra các dòng và tải phụ đề về dưới dạng tệp SRT hoặc VTT.',
  steps: [
    {
      title: 'Tải video lên',
      text: 'Thả video của bạn vào khung ở đầu trang này, hoặc bấm Chọn tệp. Tệp âm thanh cũng dùng được nếu bạn chỉ cần văn bản có thời gian.',
    },
    {
      title: 'Chọn ngôn ngữ',
      text: 'Chọn ngôn ngữ được nói. Mốc thời gian theo từng từ được bật sẵn theo mặc định, giúp thời gian của phụ đề khớp sát hơn.',
    },
    {
      title: 'Kiểm tra các dòng',
      text: 'Mở bản gỡ băng, phát từ bất kỳ mốc thời gian nào và sửa những từ sai. Xóa những dòng bạn không muốn.',
    },
    {
      title: 'Tải SRT hoặc VTT',
      text: 'Chọn SRT cho hầu hết trình phát và phần mềm biên tập, hoặc VTT cho trang web. Cả hai đều bao gồm các chỉnh sửa của bạn.',
    },
  ],

  formatsTitle: 'Định dạng phụ đề và các tệp được hỗ trợ',
  formatsIntro:
    'Tải lên bất kỳ tệp video hoặc âm thanh nào và tải phụ đề về dưới dạng SRT hoặc VTT. Đây là bên trong một tệp SRT trông như thế nào:',
  uploadTitle: 'Các tệp bạn có thể tải lên',
  accepts: ['MP4', 'MKV', 'MOV', 'WEBM', 'AVI', 'MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'SRT', use: 'các đoạn đánh số kèm thời gian, được hỗ trợ rộng rãi nhất' },
    { name: 'VTT', use: 'WebVTT cho video HTML5 và trình phát web' },
    { name: 'TXT', use: 'cùng nội dung nhưng không có thời gian' },
    { name: 'Markdown', use: 'văn bản kèm mốc thời gian' },
    { name: 'JSON', use: 'mọi dòng và mốc thời gian, dành cho chương trình' },
    { name: 'PDF', use: 'một kịch bản để in' },
  ],
  exampleLabel: 'Ví dụ về một tệp SRT',
  example: `1
00:00:01,000 --> 00:00:04,200
Chào mừng bạn quay lại kênh.

2
00:00:04,500 --> 00:00:07,800
Hôm nay chúng ta sẽ tìm hiểu phụ đề hoạt động thế nào.`,

  tipsTitle: 'Mẹo để có phụ đề tốt hơn',
  tips: [
    {
      title: 'Giữ các dòng ngắn.',
      text: 'Một quy tắc thường dùng là hai dòng, mỗi dòng khoảng 42 ký tự. Các dòng bám theo lời nói, nên những dòng quá dài có thể cần được tách ra trong phần mềm chỉnh sửa phụ đề.',
    },
    {
      title: 'Xem thử trước khi đăng.',
      text: 'Hãy phát video với phụ đề bật. Phụ đề tự động cần con người kiểm tra, nhất là tên người, con số và thuật ngữ chuyên ngành.',
    },
    {
      title: 'Dùng gợi ý từ vựng.',
      text: 'Hãy liệt kê tên người và thuật ngữ kỹ thuật trong Tùy chọn khác để chúng được viết đúng như bạn muốn.',
    },
    {
      title: 'Chọn đúng định dạng.',
      text: 'SRT cho trình phát, phần mềm biên tập và hầu hết biểu mẫu tải lên. VTT cho thẻ video HTML5 và trình phát web.',
    },
    {
      title: 'Cần phụ đề tiếng Anh?',
      text: 'Hãy đặt Kết quả thành Dịch sang tiếng Anh trong Tùy chọn khác. Bản dịch là tự động, vì vậy hãy đọc lại kỹ trước khi đăng.',
    },
  ],

  faqs: [
    {
      question: 'Tệp SRT là gì?',
      answer:
        'SubRip (.srt) là một định dạng phụ đề dạng văn bản thuần. Mỗi đoạn có một số thứ tự, thời điểm bắt đầu và kết thúc cùng nội dung hiển thị. Bất kỳ trình soạn thảo văn bản nào cũng mở được nó.',
    },
    {
      question: 'Tôi nên chọn SRT hay VTT?',
      answer:
        'Hãy dùng SRT cho trình phát video, phần mềm biên tập và hầu hết biểu mẫu tải lên. Hãy dùng VTT (WebVTT) khi bạn thêm phụ đề vào một trang web bằng phần tử video HTML5. TranscribeVid xuất cả hai từ cùng một bản gỡ băng.',
    },
    {
      question: 'Công cụ có chèn cứng phụ đề vào video của tôi không?',
      answer:
        'Không. Bạn nhận được một tệp phụ đề riêng và video không bị thay đổi. Muốn chèn cứng phụ đề vào hình ảnh thì cần dùng phần mềm biên tập video.',
    },
    {
      question: 'Thời gian của phụ đề chính xác đến mức nào?',
      answer:
        'Thời gian bám theo lời nói và thường khá sát, nhưng không chính xác đến từng khung hình. Hãy kiểm tra dòng đầu và dòng cuối, rồi chỉnh trong phần mềm chỉnh sửa phụ đề nếu bạn cần đồng bộ chính xác.',
    },
    {
      question: 'Tôi có thể tạo phụ đề bằng ngôn ngữ khác không?',
      answer:
        'Bạn có thể gỡ băng bằng chính ngôn ngữ được nói (hỗ trợ hơn 50 ngôn ngữ) hoặc dịch lời nói sang tiếng Anh. Dịch sang các ngôn ngữ khác không được cung cấp.',
    },
  ],
};
