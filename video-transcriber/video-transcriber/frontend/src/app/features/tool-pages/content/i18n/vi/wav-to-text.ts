import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WAV thành văn bản',
  h1: 'Chuyển tệp WAV thành văn bản, miễn phí và có mốc thời gian',
  lead: 'WAV là định dạng của máy ghi âm cầm tay, máy ghi âm cuộc gọi và các buổi thu trong phòng thu. Thêm tệp của bạn và đọc lời nói dưới dạng văn bản có mốc thời gian, miễn phí, không cần đăng nhập và không cần nén tệp trước.',
  dropKind: 'audio',
  dropNoun: 'tệp WAV',

  whyTitle: 'Vì sao tệp WAV rất đáng để gỡ băng',
  why: [
    'Một tệp WAV thường lưu âm thanh không nén, nên không có gì bị loại bỏ khi lưu. Điều đó khiến nó là nguồn tốt cho nhận dạng giọng nói: không có nhiễu do nén, và mọi phụ âm vẫn còn nguyên trong tệp. Bạn không cần chuyển nó sang MP3 trước. TranscribeVid đọc tệp WAV đúng như nó vốn có.',
    'Cái giá của chất lượng đó là dung lượng. Âm thanh stereo chất lượng CD nặng khoảng 10 MB mỗi phút, nên một giờ âm thanh lên đến hơn nửa gigabyte. Trang này được tạo ra cho những tệp lớn như vậy: nó bỏ qua khoảng lặng và hầu hết âm thanh không phải lời nói (tùy chọn Bỏ qua khoảng lặng và nhạc, được bật sẵn theo mặc định) và cho bạn văn bản có mốc thời gian ở mỗi dòng.',
  ],

  sections: [
    {
      title: 'Các bản ghi WAV đến từ đâu',
      paragraphs: [
        'WAV là định dạng mặc định của thế giới âm thanh, nên tệp trước mặt bạn có lẽ đến từ một trong những nguồn sau.',
      ],
      bullets: [
        {
          title: 'Máy ghi âm cầm tay.',
          text: 'Các máy ghi âm di động dùng cho phỏng vấn, bài giảng và ghi chú thực địa thường lưu ở dạng WAV, vì nó giữ lại mọi chi tiết của âm thanh.',
        },
        {
          title: 'Máy ghi âm cuộc gọi và cuộc họp.',
          text: 'Các công cụ ghi âm cuộc gọi và hệ thống hội nghị thường xuất ra WAV. Nếu mỗi phía của cuộc gọi nằm trên một kênh riêng, cả hai sẽ được trộn vào một bản gỡ băng.',
        },
        {
          title: 'Phần mềm chỉnh sửa âm thanh.',
          text: 'Các chương trình như Audacity và Adobe Audition xuất WAV khi bạn lưu hoặc kết xuất một dự án, khiến nó trở thành tệp tự nhiên để chuyển đi gỡ băng.',
        },
        {
          title: 'Thiết bị đọc chép.',
          text: 'Một số máy ghi âm đọc chép kỹ thuật số ghi ra các tệp WAV mà bạn có thể sao chép thẳng từ thiết bị.',
        },
      ],
    },
    {
      title: 'Tần số lấy mẫu, độ sâu bit và số kênh',
      paragraphs: [
        'Bạn không cần chuẩn bị tệp WAV trước khi thêm vào. Mọi thiết lập thông thường đều được đọc: 8, 16 hoặc 24 bit, hay 32 bit dấu phẩy động, mono hoặc stereo, ở 44,1 hoặc 48 kHz. Âm thanh được trộn xuống mono và tự động chuyển đổi cho mô hình giọng nói.',
        'Tần số lấy mẫu cao hơn không làm bản gỡ băng chính xác hơn, vì giọng nói nằm ở phần thấp của phổ âm thanh. Vị trí đặt micro quan trọng hơn nhiều so với các con số trên tệp.',
        'Cải thiện âm thanh, trong Tùy chọn khác, lọc tiếng ù và tiếng rít, đồng thời làm đều giọng của người nói nhỏ. Tùy chọn này được bật sẵn theo mặc định, và nó rất đáng dùng với bản ghi thực hiện gần quạt, đường phố hoặc máy lạnh.',
      ],
    },
  ],

  howTitle: 'Cách chuyển tệp WAV thành văn bản',
  howToDescription:
    'Thêm tệp WAV, chọn ngôn ngữ được nói và chất lượng, chờ bản gỡ băng và tải về dưới dạng văn bản hoặc phụ đề.',
  steps: [
    {
      title: 'Thả tệp WAV vào',
      text: 'Thêm tệp .wav vào khung ở đầu trang này: thả vào đó hoặc bấm Chọn tệp. Nếu tệp vẫn còn trên máy ghi âm, hãy sao chép nó sang máy tính trước. Khung này nhận một tệp; ở trang kế tiếp, Thêm tệp khác sẽ xếp hàng thêm các tệp WAV, và mỗi tệp có bản gỡ băng riêng.',
    },
    {
      title: 'Chọn ngôn ngữ và chất lượng',
      text: 'Ở trang kế tiếp, hãy chọn ngôn ngữ được nói, hoặc để Tự động nhận diện với bản ghi chỉ có một ngôn ngữ. Tiêu chuẩn phù hợp với hầu hết giọng nói. Với bản ghi yên tĩnh hoặc khó nghe, Độ chính xác cao và Độ chính xác cao nhất mất nhiều thời gian hơn nhưng ít sai sót hơn. Sau đó bấm Chuyển thành văn bản.',
      browser: {
        text: 'Ở trang kế tiếp, hãy chọn ngôn ngữ được nói, hoặc để Tự động nhận diện với bản ghi chỉ có một ngôn ngữ. Tiêu chuẩn phù hợp với hầu hết giọng nói. Với bản ghi yên tĩnh hoặc khó nghe, hãy thử Độ chính xác cao hoặc Độ chính xác cao nhất nếu thiết bị của bạn có hỗ trợ: chúng mất nhiều thời gian hơn, là bản tải về lần đầu nặng hơn, và sẽ bị làm mờ kèm theo lý do trên thiết bị không chạy được. Sau đó bấm Chuyển thành văn bản.',
      },
    },
    {
      title: 'Xem văn bản hiện ra',
      text: 'Bản gỡ băng được điền dần từng dòng, mỗi dòng kèm thời gian của nó. Hãy phát từ bất kỳ dòng nào để đối chiếu với bản ghi.',
    },
    {
      title: 'Chỉnh sửa và tải về',
      text: 'Sửa những từ sai, rồi tải TXT để đọc, SRT hoặc VTT làm phụ đề, hoặc PDF để in. Không có gì được lưu lại sau phiên làm việc của bạn, vì vậy hãy lưu những gì bạn cần.',
    },
  ],

  formatsTitle: 'WAV và các định dạng âm thanh khác',
  formatsIntro: 'WAV là định dạng không mất dữ liệu, và khung này cũng nhận các loại âm thanh sau.',
  uploadTitle: 'Các tệp âm thanh bạn có thể thêm',
  accepts: ['WAV', 'MP3', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'lời nói dưới dạng văn bản thuần' },
    { name: 'SRT', use: 'các dòng phụ đề có thời gian' },
    { name: 'VTT', use: 'các dòng có thời gian cho trình phát web' },
    { name: 'PDF', use: 'một bản để in' },
    { name: 'Markdown', use: 'ghi chú có mốc thời gian' },
    { name: 'JSON', use: 'dữ liệu cho công cụ của riêng bạn' },
  ],

  tipsTitle: 'Mẹo gỡ băng bản ghi WAV',
  tips: [
    {
      title: 'Thêm đúng nguyên trạng.',
      text: 'Chuyển đổi tệp WAV trước chẳng được lợi gì, và tệp MP3 có tốc độ bit thấp có thể mất chi tiết. Hãy thêm tệp đúng như khi nó ra khỏi máy ghi âm.',
    },
    {
      title: 'Nghe cả hai kênh.',
      text: 'Stereo được trộn xuống mono. Nếu một micro nhỏ hoặc nhiễu hơn hẳn micro kia, bản trộn sẽ thừa hưởng điều đó, nên hãy kiểm tra cả hai kênh trong trình phát của bạn trước một công việc dài.',
    },
    {
      title: 'Cắt bớt các khoảng lặng dài.',
      text: 'Các bản ghi thực địa thường bắt đầu và kết thúc bằng nhiều phút im lặng. Cắt chúng trong phần mềm chỉnh sửa giúp tệp nhỏ hơn, và bản gỡ băng bắt đầu đúng chỗ có người nói.',
    },
    {
      title: 'Chia nhỏ một buổi rất dài.',
      text: 'Các bản ghi vượt quá giới hạn dung lượng hoặc thời lượng sẽ bị từ chối, vì vậy hãy chia một buổi dài tại một chỗ nghỉ tự nhiên rồi gỡ băng từng phần.',
      browser: {
        title: 'Vài giờ âm thanh cần vài giờ xử lý.',
        text: 'Trang không đặt giới hạn dung lượng hay thời lượng, nhưng một bản ghi dài vài giờ cần rất nhiều thời gian và bộ nhớ trống, và trình duyệt cũ có thể từ chối một tệp quá dài. Trên điện thoại, hãy chia nó tại một chỗ nghỉ tự nhiên rồi gỡ băng từng phần.',
      },
    },
    {
      title: 'Viết đúng các từ khó.',
      text: 'Hãy liệt kê tên người, địa danh và thuật ngữ kỹ thuật trong gợi ý từ vựng ở Tùy chọn khác, viết đúng như cách bạn muốn thấy chúng.',
    },
  ],

  faqs: [
    {
      question: 'Tôi có thể gỡ băng tệp WAV ghi từ một cuộc gọi điện thoại không?',
      answer:
        'Có, nếu cuộc gọi được lưu thành tệp WAV và nghe rõ cả hai người. Cả hai kênh được trộn vào một bản gỡ băng và tên người nói không được thêm vào, vì vậy hãy gõ tên vào văn bản khi chỉnh sửa. Hãy báo cho mọi người biết bạn đang ghi âm, và kiểm tra quy định nơi bạn sống trước khi ghi âm cuộc gọi.',
    },
    {
      question: 'WAV có cho kết quả gỡ băng chính xác hơn MP3 không?',
      answer:
        'Có thể giúp được một chút, vì không có gì bị loại bỏ khỏi âm thanh. Nhưng một tệp MP3 rõ ràng thường gỡ băng tốt còn một tệp WAV nhiễu thì không. Micro, căn phòng và khoảng cách từ người nói quan trọng hơn định dạng tệp.',
    },
    {
      question: 'Vì sao tệp WAV của tôi lớn như vậy, và điều đó có quan trọng không?',
      answer:
        'WAV thường lưu âm thanh không nén: khoảng 10 MB mỗi phút với stereo chất lượng CD. Tệp lớn mất nhiều thời gian đọc hơn. {limits} Nếu tệp vượt quá giới hạn, hãy cắt bớt, hoặc xuất một bản nén (M4A hoặc MP3) và dùng bản đó.',
      browser: {
        answer:
          'WAV thường lưu âm thanh không nén: khoảng 10 MB mỗi phút với stereo chất lượng CD. Tệp lớn mất nhiều thời gian đọc hơn một chút, nhưng định dạng không phải là vấn đề: trong thử nghiệm, một tệp khoảng 2,5 GB được đọc trơn tru trên một trình duyệt hiện đại. Trang không đặt giới hạn dung lượng hay thời lượng vì chính thiết bị của bạn làm việc, nên một bản ghi rất dài cần thời gian và bộ nhớ trống, và trình duyệt cũ có thể từ chối một tệp quá dài. Trên điện thoại, hãy chia nhỏ nó trước.',
      },
    },
    {
      question: 'Công cụ có xử lý được tệp WAV 24 bit và 48 kHz không?',
      answer:
        'Có. Các thiết lập WAV thông thường, như 16 hoặc 24 bit ở 44,1 hoặc 48 kHz, được đọc mà không cần chuẩn bị gì, và âm thanh được tự động chuyển đổi cho mô hình giọng nói.',
    },
    {
      question: 'Tôi có thể gỡ băng nhiều tệp WAV cùng một lúc không?',
      answer:
        'Có, ở trang kế tiếp. Khung trên trang này nhận một tệp; ở đó, Thêm tệp khác sẽ xếp hàng các tệp còn lại. Mỗi tệp có bản gỡ băng riêng, nên cả một ngày bản ghi có thể chạy lần lượt từng tệp một.',
    },
  ],

  links: [
    {
      label: 'MP3 thành văn bản',
      path: '/mp3-to-text',
      note: 'Cùng cách gỡ băng miễn phí cho định dạng nén mà hầu hết bản ghi giọng nói cuối cùng đều dùng.',
    },
    {
      label: 'Gỡ băng phỏng vấn',
      path: '/interview-transcription',
      note: 'Mẹo để biến bản ghi phỏng vấn thành một bản gỡ băng sạch, dễ trích dẫn.',
    },
    {
      label: 'Cách có bản gỡ băng chính xác hơn',
      path: '/guides/accurate-transcripts',
      note: 'Những điều cần thay đổi về bản ghi, ngôn ngữ và các thiết lập khi kết quả đầu tiên chưa đủ tốt.',
    },
    {
      label: 'Bản ghi cuộc họp thành văn bản',
      path: '/meeting-recording-to-text',
      note: 'Dành cho các cuộc họp trực tuyến được lưu thành bản ghi.',
    },
  ],
};
