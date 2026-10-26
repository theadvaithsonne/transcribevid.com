import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Tạo phụ đề VTT',
  h1: 'Tạo tệp phụ đề WebVTT (.vtt) từ video',
  lead: 'Thêm một tệp video hoặc âm thanh và tải về một tệp phụ đề WebVTT khớp thời gian với lời nói. Miễn phí, không cần đăng nhập, và bạn có thể sửa các dòng trước khi xuất. Dùng với phần tử video HTML5 hoặc bất kỳ trình phát web nào.',
  dropKind: 'video',
  dropNoun: 'video',

  whyTitle: 'WebVTT là gì, và vì sao web dùng nó',
  why: [
    'WebVTT (.vtt) là định dạng phụ đề của web. Đây là một tệp văn bản thuần mà trình duyệt hiểu sẵn: chỉ cần trỏ phần tử track của video tới một tệp .vtt là phụ đề hiện ra, không cần plugin hay đoạn mã nào.',
    'Nó trông khá giống SRT, với vài điểm khác biệt quan trọng. Tệp VTT bắt đầu bằng từ WEBVTT, dùng dấu chấm thay cho dấu phẩy trước phần mili giây và không cần đánh số các đoạn. Hầu hết trình phát web đều đọc được nó. Nếu bạn không chắc cần định dạng nào, bài hướng dẫn về SRT và VTT sẽ giải thích cách chọn.',
  ],

  sections: [
    {
      title: 'Cách dùng tệp VTT trên trang web của bạn',
      paragraphs: [
        'Lưu tệp .vtt cạnh video, rồi thêm một phần tử track bên trong phần tử video, ví dụ: <track kind="subtitles" src="captions.vtt" srclang="en" label="English" default>. Các thuộc tính có tác dụng như sau.',
      ],
      bullets: [
        {
          title: 'kind.',
          text: 'Dùng subtitles cho những lời được nói. Dùng captions khi tệp còn mô tả cả những âm thanh khác, như nhạc hoặc tiếng cười.',
        },
        {
          title: 'srclang.',
          text: 'Ngôn ngữ của tệp dưới dạng mã ngắn, ví dụ en cho tiếng Anh hoặc vi cho tiếng Việt. Hãy thêm một phần tử track cho mỗi ngôn ngữ bạn có.',
        },
        {
          title: 'label và default.',
          text: 'label là tên hiển thị trong menu phụ đề của trình phát. default bật track đó khi trang được tải.',
        },
      ],
    },
    {
      title: 'Vì sao phụ đề không hiện: những nguyên nhân thường gặp',
      paragraphs: [
        'Hãy để tệp .vtt trên cùng trang web với trang. Tệp ở tên miền khác cần máy chủ của nó gửi đúng tiêu đề cross-origin, và phần tử video cần có thuộc tính crossorigin, nếu không trình duyệt sẽ lặng lẽ bỏ qua nó. Hãy kiểm tra thêm rằng dòng đầu tiên của tệp là WEBVTT, và phụ đề đã được bật trong các nút điều khiển của trình phát.',
      ],
    },
    {
      title: 'Công cụ tạo phụ đề này làm gì và không làm gì',
      paragraphs: [
        'Nó biến lời nói trong video của bạn thành văn bản có thời gian. Các dòng được ngắt ở cuối câu và ở các quãng nghỉ, mỗi dòng khoảng 42 ký tự và tối đa hai dòng, và tệp chỉ chứa văn bản có thời gian. Nó không dịch sang các ngôn ngữ khác (trừ tiếng Anh, qua Kết quả trong Tùy chọn khác), không thêm tên người nói, không tạo kiểu định dạng hay dấu chương, và không chèn cứng phụ đề vào hình ảnh. Bản thân WebVTT hỗ trợ kiểu định dạng và chương, và bạn có thể thêm chúng thủ công trong trình soạn thảo văn bản.',
      ],
    },
  ],

  howTitle: 'Cách tạo tệp phụ đề VTT',
  howToDescription:
    'Thêm một video, chọn ngôn ngữ, kiểm tra các dòng và tải phụ đề về dưới dạng tệp WebVTT.',
  steps: [
    {
      title: 'Thêm video của bạn',
      text: 'Đặt một video vào khung ở đầu trang này: thả vào đó hoặc bấm Chọn tệp. Một tệp chỉ có âm thanh cũng dùng được, nếu bạn chỉ cần văn bản có thời gian. Ở trang kế tiếp, Thêm tệp khác sẽ đưa thêm tệp vào.',
    },
    {
      title: 'Chọn ngôn ngữ',
      text: 'Ở trang kế tiếp, chọn ngôn ngữ được nói, hoặc để Tự động nhận diện bật. Hãy giữ Mốc thời gian theo từng từ bật trong Tùy chọn khác: khi đó điểm bắt đầu và kết thúc của mỗi dòng bám theo các từ. Sau đó bấm Chuyển thành văn bản.',
    },
    {
      title: 'Kiểm tra các dòng',
      text: 'Đọc qua bản gỡ băng, phát từ một mốc thời gian để kiểm tra và sửa những từ sai. Xóa những dòng bạn không muốn có trong phụ đề.',
    },
    {
      title: 'Tải VTT',
      text: 'Chọn VTT trong các tùy chọn tải về. Các chỉnh sửa của bạn được bao gồm. SRT có sẵn từ cùng bản gỡ băng nếu một trình phát cần đến.',
    },
  ],

  formatsTitle: 'Định dạng VTT và các tệp được hỗ trợ',
  formatsIntro:
    'Thêm bất kỳ tệp video hoặc âm thanh nào và tải WebVTT về. Đây là bên trong một tệp VTT trông như thế nào:',
  uploadTitle: 'Các tệp bạn có thể thêm',
  accepts: ['MP4', 'WEBM', 'MOV', 'MKV', 'M4V', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'VTT', use: 'WebVTT cho phần tử video HTML5 và trình phát web' },
    { name: 'SRT', use: 'các đoạn đánh số, cho hầu hết trình phát và phần mềm biên tập' },
    { name: 'TXT', use: 'cùng nội dung nhưng không có thời gian' },
    { name: 'Markdown', use: 'văn bản kèm mốc thời gian' },
    { name: 'JSON', use: 'mọi dòng và mốc thời gian, dành cho chương trình' },
    { name: 'PDF', use: 'một kịch bản để in' },
  ],
  exampleLabel: 'Ví dụ về một tệp WebVTT',
  example: `WEBVTT

00:00:00.800 --> 00:00:03.600
Chào buổi sáng mọi người, và chào mừng các bạn.

00:00:04.000 --> 00:00:07.300
Trong video này, chúng ta sẽ thiết lập dự án từ đầu.

00:00:07.700 --> 00:00:10.900
Hãy bắt đầu với cấu trúc thư mục.`,

  tipsTitle: 'Mẹo dùng tệp WebVTT',
  tips: [
    {
      title: 'Thử trên một trình duyệt thật.',
      text: 'Mở trang của bạn, bấm phát và bật phụ đề trong các nút điều khiển video. Hãy làm vậy trên nhiều hơn một trình duyệt trước khi đăng.',
    },
    {
      title: 'Dùng đúng mã ngôn ngữ.',
      text: 'Đặt srclang là một mã hợp lệ như en, vi hoặc hi. Một mã sai có thể khiến trình phát gắn nhãn hoặc chọn track sai.',
    },
    {
      title: 'Đọc các dòng ở tốc độ thật.',
      text: 'Hãy phát video với tiếng tắt và phụ đề bật, rồi kiểm tra mỗi dòng có hiện trên màn hình đủ lâu để đọc không.',
    },
    {
      title: 'Viết tên đúng như bạn muốn.',
      text: 'Hãy đưa tên thương hiệu và thuật ngữ kỹ thuật vào gợi ý từ vựng trong Tùy chọn khác trước khi bắt đầu, để chúng được viết đúng ở mọi dòng.',
    },
  ],

  faqs: [
    {
      question: 'Tệp VTT khác tệp SRT như thế nào?',
      answer:
        'Tệp VTT bắt đầu bằng dòng WEBVTT, viết thời gian bằng dấu chấm (00:00:01.000) ở chỗ SRT dùng dấu phẩy (00:00:01,000), và không cần số thứ tự cho từng đoạn. Trình duyệt đọc VTT trong phần tử video, còn SRT cần một trình phát hoặc đoạn mã có hỗ trợ.',
    },
    {
      question: 'Làm thế nào để thêm tệp VTT vào một video HTML?',
      answer:
        'Lưu tệp .vtt cạnh video và thêm một phần tử track bên trong phần tử video, với kind đặt là subtitles, src trỏ tới tệp, srclang đặt là mã ngôn ngữ và một label cho menu.',
    },
    {
      question: 'Những trình phát nào đọc được tệp VTT?',
      answer:
        'Tất cả các trình duyệt lớn đều đọc VTT qua phần tử video, và hầu hết trình phát video web cũng đọc được. Một số trình phát và phần mềm biên tập trên máy tính thích SRT hơn. Với những trường hợp đó, hãy tải SRT từ cùng bản gỡ băng.',
    },
    {
      question: 'Tệp VTT có thể chứa chương hoặc kiểu định dạng không?',
      answer:
        'Tệp mà TranscribeVid tạo ra chỉ chứa văn bản có thời gian. Bản thân WebVTT hỗ trợ kiểu định dạng và chương, mà bạn có thể thêm thủ công trong trình soạn thảo văn bản.',
    },
    {
      question: 'Vì sao tệp VTT của tôi không hiện ra trong trình phát?',
      answer:
        'Các nguyên nhân thường gặp là dòng đầu tiên không phải WEBVTT, tệp nằm trên tên miền khác mà thiếu đúng tiêu đề cross-origin, srclang hoặc kind bị sai, hoặc phụ đề đang bị tắt trong trình phát. Hãy mở tệp bằng trình soạn thảo văn bản và kiểm tra dòng đầu tiên.',
    },
  ],

  links: [
    {
      label: 'Tạo phụ đề SRT',
      path: '/srt-subtitle-generator',
      note: 'Cùng bản gỡ băng đó dưới dạng tệp SRT đánh số, kèm một ví dụ minh họa.',
    },
    {
      label: 'SRT hay VTT: nên dùng định dạng phụ đề nào',
      path: '/guides/srt-vs-vtt',
      note: 'So sánh song song hai định dạng và nơi mỗi định dạng dùng được.',
    },
    {
      label: 'Cách thêm phụ đề vào video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Từ bản gỡ băng đến phụ đề được đăng, cho web và cho các trình phát khác.',
    },
    {
      label: 'WebM thành văn bản',
      path: '/webm-to-text',
      note: 'Dành cho bản quay màn hình và trình duyệt, định dạng phù hợp nhất với tệp VTT.',
    },
  ],
};
