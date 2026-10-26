import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'M4A thành văn bản',
  h1: 'Gỡ băng ghi chú giọng nói M4A thành văn bản',
  lead: 'M4A là định dạng mà Voice Memos trên iPhone và Mac, nhiều máy ghi âm Android và các ứng dụng của Apple lưu lại. Thêm tệp vào và nhận bản gỡ băng có mốc thời gian, miễn phí, không cần đăng nhập và không cần chuyển sang MP3.',
  dropKind: 'audio',
  dropNoun: 'tệp M4A',

  whyTitle: 'Vì sao tệp M4A gỡ băng tốt',
  why: [
    'M4A là tệp MPEG-4 chỉ có âm thanh. Nó thường chứa âm thanh AAC, được nén nhưng hoàn toàn đủ tốt cho giọng nói, nên tệp M4A nhỏ và gỡ băng tốt. TranscribeVid đọc chúng trực tiếp. Không cần chuyển đổi gì trước.',
    'Ghi chú giọng nói thường được tạo ngay khi di chuyển, nên hay nhỏ tiếng, có tiếng vang hoặc được ghi khi để điện thoại trong túi. Các lựa chọn chất lượng và tùy chọn làm sạch trên trang này sinh ra chính cho loại bản ghi như vậy.',
  ],

  sections: [
    {
      title: 'Lấy ghi chú giọng nói ra khỏi điện thoại',
      paragraphs: [
        'Tên các menu thay đổi giữa các phiên bản iOS, macOS và Android, vì vậy hãy xem đây là gợi ý. Nếu bạn đang dùng ngay trên điện thoại, hãy bấm Chọn tệp và chọn bản ghi từ Tệp hoặc thư mục ghi âm của bạn. Không cần máy tính.',
      ],
      bullets: [
        {
          title: 'iPhone.',
          text: 'Trong Voice Memos, mở bản ghi, chạm vào nút Thêm (ba chấm) và chọn Chia sẻ. Lưu vào Tệp, hoặc gửi cho chính bạn qua AirDrop hay thư, rồi thêm vào đây.',
        },
        {
          title: 'Mac.',
          text: 'Kéo một bản ghi ra khỏi cửa sổ Voice Memos thả lên Màn hình nền. Nó xuất hiện dưới dạng tệp .m4a, sẵn sàng để thêm vào.',
        },
        {
          title: 'Android.',
          text: 'Nhiều ứng dụng ghi âm lưu tệp M4A trong thư mục Recordings hoặc Voice Recorder. Tên thư mục tùy thuộc vào ứng dụng, và bộ chọn tệp có thể mở nó.',
        },
      ],
    },
    {
      title: 'Ghi chú giọng nói không mất dữ liệu và loại nén',
      paragraphs: [
        'Voice Memos trên iPhone có thể lưu bản ghi ở dạng Nén hoặc Không mất dữ liệu. Các tệp không mất dữ liệu lớn hơn nhiều, vẫn có đuôi .m4a và thường dùng codec Apple Lossless. Giọng nói không cần đến nó: một ghi chú ở dạng Nén cho cùng một bản gỡ băng với dung lượng chỉ bằng một phần nhỏ.',
      ],
      browser: {
        paragraphs: [
          'Voice Memos trên iPhone có thể lưu bản ghi ở dạng Nén hoặc Không mất dữ liệu. Các tệp không mất dữ liệu lớn hơn nhiều, vẫn có đuôi .m4a và thường dùng codec Apple Lossless, mà không phải trình duyệt nào cũng tự đọc được. Nếu trình duyệt của bạn không đọc được, trang có thể đề nghị nạp một bộ chuyển đổi nhỏ (khoảng 9 MB) chạy ngay trên thiết bị của bạn. Giọng nói không cần dạng Không mất dữ liệu: một ghi chú ở dạng Nén cho cùng một bản gỡ băng với dung lượng chỉ bằng một phần nhỏ.',
        ],
      },
    },
  ],

  howTitle: 'Cách chuyển tệp M4A thành văn bản',
  howToDescription:
    'Thêm tệp M4A, chọn ngôn ngữ được nói, chờ bản gỡ băng và tải về dưới dạng văn bản.',
  steps: [
    {
      title: 'Thêm tệp M4A',
      text: 'Thả ghi chú .m4a vào khung ở đầu trang này, hoặc bấm Chọn tệp và, trên điện thoại, chọn nó từ Tệp hoặc thư mục ghi âm của bạn. Khung này chỉ nhận một ghi chú; khi sang trang kế tiếp, Thêm tệp khác sẽ đưa thêm các ghi chú còn lại vào.',
    },
    {
      title: 'Chọn ngôn ngữ',
      text: 'Ở trang kế tiếp, chọn ngôn ngữ được nói. Một ghi chú ngắn khiến Tự động nhận diện có rất ít dữ liệu để dựa vào, nên chỉ rõ ngôn ngữ đáng tin cậy hơn. Chất lượng Tiêu chuẩn phù hợp với hầu hết ghi chú. Sau đó bấm Chuyển thành văn bản.',
    },
    {
      title: 'Chờ bản gỡ băng',
      text: 'Các dòng hiện ra lần lượt cùng thanh tiến độ và ước tính thời gian còn lại. Hãy phát từ bất kỳ dòng nào để nghe điều đã được nói.',
    },
    {
      title: 'Sửa và lưu lại',
      text: 'Sửa bất kỳ từ sai nào, rồi tải về TXT, Markdown hoặc PDF để làm ghi chú, hoặc SRT hay VTT nếu ghi chú đi kèm một video. Bản gỡ băng chỉ tồn tại trong phiên làm việc của bạn, vì vậy hãy tải về trước khi đóng trang.',
    },
  ],

  formatsTitle: 'M4A và các định dạng âm thanh khác',
  formatsIntro:
    'Máy ghi âm trên điện thoại và máy tính lưu theo những định dạng khác nhau. Khung này nhận tất cả những định dạng đó.',
  uploadTitle: 'Các tệp âm thanh bạn có thể thêm',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'lời của bạn dưới dạng văn bản thuần' },
    { name: 'Markdown', use: 'ghi chú có mốc thời gian' },
    { name: 'PDF', use: 'một bản in của ghi chú giọng nói' },
    { name: 'SRT', use: 'các dòng có thời gian cho video đi kèm ghi chú' },
    { name: 'VTT', use: 'các dòng có thời gian cho trình phát web' },
    { name: 'JSON', use: 'các dòng có cấu trúc dành cho chương trình' },
  ],

  tipsTitle: 'Mẹo gỡ băng ghi chú giọng nói',
  tips: [
    {
      title: 'Cầm điện thoại gần miệng.',
      text: 'Một ghi chú được ghi khi điện thoại để trong túi hoặc đặt ở đầu kia bàn là rất khó với mọi công cụ nhận dạng. Hãy cầm điện thoại cách miệng chừng một gang tay và nói lướt ngang qua nó, đừng nói thẳng vào.',
    },
    {
      title: 'Cắt bớt trước khi chia sẻ.',
      text: 'Hầu hết ứng dụng ghi chú giọng nói cho phép bạn cắt phần đầu và cuối của bản ghi. Bỏ một quãng lặng dài ở hai đầu giúp tiết kiệm thời gian chờ.',
    },
    {
      title: 'Chọn đúng ngôn ngữ.',
      text: 'Với một ghi chú dài mười hay hai mươi giây, chọn ngôn ngữ được nói tốt hơn tự động nhận diện, nhất là với giọng địa phương hoặc khi trộn lẫn nhiều ngôn ngữ.',
    },
    {
      title: 'Cho nó biết những cái tên khó.',
      text: 'Hãy thêm những tên lạ vào gợi ý từ vựng trong Tùy chọn khác và chúng sẽ có nhiều khả năng được viết đúng hơn rất nhiều.',
    },
  ],

  faqs: [
    {
      question: 'Tôi có thể gỡ băng ghi chú Voice Memo trên iPhone mà không cần chuyển đổi không?',
      answer:
        'Có. Voice Memos là các tệp M4A và TranscribeVid đọc M4A trực tiếp. Hãy chia sẻ ghi chú sang Tệp hoặc sang máy tính của bạn, rồi thêm vào đây. Đừng chuyển nó sang MP3 trước.',
    },
    {
      question: 'Tệp M4A có giống MP4 không?',
      answer:
        'Chúng là họ hàng gần. Cả hai đều dùng container MPEG-4; M4A chỉ chứa âm thanh, còn MP4 thường mang cả video. TranscribeVid đọc âm thanh từ cả hai.',
    },
    {
      question: 'Vì sao bản gỡ băng M4A của tôi trống hoặc rất ngắn?',
      answer:
        'Ghi chú có thể không có tiếng, rất nhỏ tiếng hoặc phần lớn là tạp âm nền. Hãy nghe lại trước. Nếu tiếng yếu, hãy giữ Cải thiện âm thanh bật trong Tùy chọn khác, và kiểm tra xem tệp có bị cắt ngắn khi bạn chia sẻ không.',
    },
    {
      question: 'Tôi có thể gỡ băng một cuộc họp dài được ghi bằng điện thoại không?',
      answer:
        'Có. Tệp M4A nhỏ, nên một bản ghi dài rất dễ thêm vào. {limits} Không có hạn mức theo ngày hay theo tháng.',
      browser: {
        answer:
          'Có. Tệp M4A nhỏ, nên một bản ghi dài rất dễ thêm vào. Trang không đặt giới hạn dung lượng hay thời lượng vì chính thiết bị của bạn làm việc, nên một ghi chú rất dài chỉ đơn giản là mất nhiều thời gian hơn, và trên thiết bị chậm, trang sẽ báo trước khi bạn bắt đầu. Trình duyệt cũ có thể từ chối một tệp quá dài.',
      },
    },
    {
      question:
        'Tôi có thể gỡ băng ghi chú giọng nói bằng tiếng Hindi hoặc tiếng Tây Ban Nha không?',
      answer:
        'Có. Hãy chọn ngôn ngữ được nói trong danh sách hơn 50 ngôn ngữ, hoặc để Tự động nhận diện bật với ghi chú chỉ có một ngôn ngữ. Với tiếng Hindi, Kiểu bản gỡ băng (bên cạnh Ngôn ngữ) cho phép bạn chọn chữ La-tinh (Hinglish) hoặc chữ Devanagari gốc.',
    },
  ],

  links: [
    {
      label: 'Ghi âm giọng nói thành văn bản',
      path: '/voice-recording-to-text',
      note: 'Ghi âm bằng micro ngay trên trang thay vì tải một tệp lên.',
    },
    {
      label: 'MP3 thành văn bản',
      path: '/mp3-to-text',
      note: 'Cùng cách gỡ băng miễn phí cho tệp MP3, định dạng giọng nói phổ biến còn lại.',
    },
    {
      label: 'Bài giảng thành văn bản',
      path: '/lecture-to-text',
      note: 'Biến một bài giảng đã ghi thành ghi chú bạn có thể tìm kiếm và học.',
    },
    {
      label: 'Cách có bản gỡ băng chính xác hơn',
      path: '/guides/accurate-transcripts',
      note: 'Những thay đổi đơn giản về bản ghi và các thiết lập tạo ra khác biệt lớn nhất.',
    },
  ],
};
