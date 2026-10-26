import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WebM thành văn bản',
  h1: 'Gỡ băng bản ghi WebM thành văn bản',
  lead: 'WebM là định dạng mà trình duyệt và phần mềm quay màn hình lưu lại. Thêm video hoặc âm thanh WebM của bạn và nhận bản gỡ băng có mốc thời gian, miễn phí, không cần đăng nhập và không cần chuyển đổi trước.',
  dropKind: 'video',
  dropNoun: 'tệp WebM',

  whyTitle: 'Bên trong một tệp WebM có gì',
  why: [
    'WebM là một container thân thiện với web. Nó thường chứa video VP8, VP9 hoặc AV1 cùng âm thanh Opus hoặc Vorbis. TranscribeVid chỉ đọc phần âm thanh, nên codec video bên trong là gì cũng không quan trọng, và một tệp WebM chỉ có âm thanh cũng dùng tốt như vậy.',
    'Opus, định dạng âm thanh mà hầu hết tệp WebM sử dụng, được thiết kế cho giọng nói, nên những bản ghi này là nguồn tốt cho bản gỡ băng. Kết quả là văn bản có thời điểm ở mỗi dòng, sẵn sàng để tìm kiếm, trích dẫn hoặc biến thành phụ đề.',
  ],

  sections: [
    {
      title: 'Tệp WebM đến từ đâu',
      paragraphs: [
        'Hầu hết tệp WebM do chính trình duyệt tạo ra, đó là lý do chúng xuất hiện bất cứ khi nào ai đó ghi lại thứ gì đó trên mạng.',
      ],
      bullets: [
        {
          title: 'Phần mềm quay màn hình và quay trong trình duyệt.',
          text: 'Nhiều tiện ích quay màn hình và công cụ ghi trên web lưu ở dạng WebM, vì đó là định dạng mà trình duyệt có thể ghi trực tiếp.',
        },
        {
          title: 'Máy ghi âm trực tuyến.',
          text: 'Một trang web ghi âm micro của bạn thường cho bạn một tệp âm thanh .webm. Nó có thể trông như tệp video, nhưng chỉ chứa âm thanh.',
        },
        {
          title: 'Ứng dụng web bạn tự xây dựng hoặc thử nghiệm.',
          text: 'Các trang ghi âm bằng tính năng MediaRecorder của trình duyệt thường tạo ra WebM trong Chrome. Firefox cũng làm vậy với video, nhưng các bản ghi chỉ có âm thanh của nó thường là Ogg, mà trang này cũng đọc được.',
        },
      ],
    },
    {
      title: 'Một điểm lạ của tệp WebM được ghi trực tiếp',
      paragraphs: [
        'Một tệp WebM được ghi trực tiếp trong trình duyệt thường không có tổng thời lượng được ghi trong tệp. Một số trình phát khi đó hiển thị thời lượng không xác định hoặc không tua tới được, trông như một tệp bị hỏng. Bản thân âm thanh vẫn nguyên vẹn, và bản gỡ băng được tạo từ nó như bình thường.',
        'Nếu một bản ghi thật sự lỗi, nguyên nhân thường đơn giản hơn: micro bị tắt, nên hoàn toàn không có lời nói trong đó. Hãy phát tệp với âm lượng lớn trước khi tìm lý do khác.',
      ],
    },
  ],

  howTitle: 'Cách chuyển tệp WebM thành văn bản',
  howToDescription:
    'Thêm tệp WebM, chọn ngôn ngữ được nói, kiểm tra các dòng và tải bản gỡ băng về dưới dạng văn bản hoặc phụ đề WebVTT.',
  steps: [
    {
      title: 'Thêm tệp WebM',
      text: 'Thả tệp .webm vào khung ở đầu trang này, hoặc bấm Chọn tệp. Một tệp WebM chỉ có âm thanh cũng được thêm theo cách tương tự. Với nhiều bản ghi, hãy thêm tệp đầu tiên ở đây và các tệp còn lại bằng Thêm tệp khác ở trang kế tiếp.',
    },
    {
      title: 'Chọn ngôn ngữ',
      text: 'Ở trang kế tiếp, chọn ngôn ngữ được nói, hoặc giữ Tự động nhận diện với bản ghi chỉ có một ngôn ngữ. Chất lượng Tiêu chuẩn phù hợp với giọng nói rõ từ một micro tốt. Sau đó bấm Chuyển thành văn bản.',
    },
    {
      title: 'Kiểm tra các dòng',
      text: 'Xem văn bản hiện ra từng dòng một. Mở bản gỡ băng, phát từ bất kỳ mốc thời gian nào và sửa những từ sai.',
    },
    {
      title: 'Tải kết quả về',
      text: 'Lấy TXT để đọc hoặc tìm kiếm. WebM thuộc về web, nên VTT là tệp phụ đề tự nhiên cho nó. SRT và PDF cũng có sẵn.',
    },
  ],

  formatsTitle: 'WebM và các định dạng video khác',
  formatsIntro: 'WebM là một trong nhiều loại video và âm thanh mà khung này nhận.',
  uploadTitle: 'Các tệp bạn có thể thêm',
  accepts: ['WEBM', 'MP4', 'MKV', 'MOV', 'OGG', 'OPUS', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'TXT', use: 'lời nói dưới dạng văn bản thuần' },
    { name: 'VTT', use: 'phụ đề cho chính tệp WebM đó trên một trang web' },
    { name: 'SRT', use: 'phụ đề cho trình phát và phần mềm biên tập' },
    { name: 'Markdown', use: 'ghi chú có mốc thời gian' },
    { name: 'JSON', use: 'mọi dòng và mốc thời gian, dành cho chương trình' },
    { name: 'PDF', use: 'bản gỡ băng để in hoặc chia sẻ' },
  ],

  tipsTitle: 'Mẹo gỡ băng bản ghi WebM',
  tips: [
    {
      title: 'Bật micro trước khi ghi.',
      text: 'Phần mềm quay màn hình thường chỉ ghi hình ảnh trừ khi bạn chọn tùy chọn micro hoặc âm thanh hệ thống. Không có tiếng thì không có gì để gỡ băng.',
    },
    {
      title: 'Hãy chuẩn bị cho một track giọng nói duy nhất.',
      text: 'Nếu bạn ghi một tab cuộc họp cùng với micro của chính mình, mọi người sẽ nằm chung một track. Không có nhãn người nói, nên hãy thêm tên khi chỉnh sửa.',
    },
    {
      title: 'Dùng VTT cho web.',
      text: 'Phần tử video của trình duyệt đọc phụ đề VTT thông qua phần tử track. Nó không đọc SRT, nên hãy chọn VTT cho một tệp WebM trên trang riêng của bạn.',
    },
    {
      title: 'Cắt nhỏ các bản ghi rất dài.',
      text: 'Các tệp vượt quá giới hạn dung lượng hoặc thời lượng sẽ bị từ chối, vì vậy hãy cắt một tệp WebM dài thành nhiều phần trước.',
      browser: {
        title: 'Bản ghi dài mất nhiều thời gian hơn.',
        text: 'Trang không đặt giới hạn dung lượng hay thời lượng. Một bản quay màn hình dài vẫn cần thời gian và bộ nhớ trống, và trình duyệt cũ có thể từ chối một tệp quá dài, nên trên điện thoại hãy cắt nó thành nhiều phần trước.',
      },
    },
    {
      title: 'Liệt kê tên và lệnh.',
      text: 'Với một buổi demo phần mềm, hãy đưa tên sản phẩm, các lệnh và từ viết tắt vào gợi ý từ vựng để chúng được viết đúng như cách bạn viết.',
    },
  ],

  faqs: [
    {
      question: 'Vì sao tôi không phát được tệp WebM trên điện thoại, và tôi vẫn gỡ băng được chứ?',
      answer:
        'Một số điện thoại và trình phát cũ không mở được WebM. Điều đó không quan trọng ở đây: TranscribeVid chỉ cần phần âm thanh, nên bạn vẫn có thể thêm tệp và nhận bản gỡ băng.',
    },
    {
      question: 'Tôi có thể gỡ băng một tệp WebM chỉ có âm thanh không?',
      answer:
        'Có. Một số máy ghi âm lưu tệp chỉ có âm thanh với đuôi .webm. Chúng được đọc như bất kỳ tệp âm thanh nào khác.',
    },
    {
      question: 'WebM của tôi dùng VP8, VP9 hay AV1 có quan trọng không?',
      answer:
        'Không. Hình ảnh bị bỏ qua. Điều quan trọng là tệp có một luồng âm thanh ở định dạng phổ biến như Opus.',
    },
    {
      question: 'Làm thế nào để dùng phụ đề với tệp WebM trên trang web của riêng tôi?',
      answer:
        'Hãy tải tệp VTT về, lưu cạnh video và trỏ một phần tử track bên trong phần tử video tới nó. Trang tạo phụ đề VTT cho thấy tệp trông ra sao và đoạn mã chính xác.',
    },
    {
      question: 'Vì sao bản quay màn hình của tôi cho bản gỡ băng trống?',
      answer:
        'Rất có thể nó không chứa lời nói: micro bị tắt hoặc chỉ ghi âm thanh hệ thống. Nếu bạn nghe thấy người đang nói nhưng không có văn bản, hãy giữ Cải thiện âm thanh bật trong Tùy chọn khác và thử thiết lập chất lượng cao hơn.',
    },
  ],

  links: [
    {
      label: 'Tạo phụ đề VTT',
      path: '/vtt-subtitle-generator',
      note: 'Một tệp WebVTT chứa gì và cách gắn nó vào video trên trang của riêng bạn.',
    },
    {
      label: 'Cách thêm phụ đề vào video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Toàn bộ quy trình từ ghi hình đến phụ đề được đăng, từng bước một.',
    },
    {
      label: 'Bản ghi cuộc họp thành văn bản',
      path: '/meeting-recording-to-text',
      note: 'Dành cho các cuộc gọi và hội thảo trực tuyến đã ghi, kể cả cách lấy bản ghi ra khỏi công cụ họp.',
    },
    {
      label: 'MP4 thành văn bản',
      path: '/mp4-to-text',
      note: 'Cùng dịch vụ cho MP4, định dạng video phổ biến nhất.',
    },
  ],
};
