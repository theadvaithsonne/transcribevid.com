import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Bài giảng thành văn bản',
  h1: 'Bài giảng thành văn bản: biến bản ghi thành bản gỡ băng có thể tìm kiếm',
  lead: 'Ghi âm bài giảng, thả tệp vào đây và đọc nó dưới dạng văn bản có mốc thời gian: thứ bạn có thể tìm kiếm một chủ đề ôn thi, sao chép vào ghi chú và đối chiếu với bản ghi. Không cần tài khoản, không mất phí và hỗ trợ hơn 50 ngôn ngữ.',
  dropKind: 'video',
  dropNoun: 'bản ghi bài giảng',

  whyTitle: 'Vì sao nên gỡ băng một bài giảng',
  why: [
    'Một bài giảng dễ nghe nhưng khó ôn lại. Bạn không thể tìm trong bản ghi một định nghĩa cần thiết, và phát lại cả giờ để tìm nó mất nhiều thời gian như chính bài giảng. Bản gỡ băng cho bạn các từ theo thứ tự, với thời điểm bên cạnh mỗi dòng, để bạn nhảy tới đoạn mình cần.',
    'Nó cũng giúp những người thấy đọc dễ hơn nghe, những người học bằng ngôn ngữ thứ hai, những người đã bỏ lỡ một buổi học, hoặc những người muốn có văn bản của một bài nói do chính họ trình bày. Hãy xin phép giảng viên trước khi ghi âm, và tuân theo quy định của trường về việc ghi âm.',
  ],

  sections: [
    {
      title: 'Từ bản gỡ băng đến ghi chú học tập',
      paragraphs: [
        'Bản gỡ băng là nguyên liệu thô, không phải ghi chú hoàn chỉnh. Dưới đây là bốn cách sinh viên dùng nó.',
      ],
      bullets: [
        {
          title: 'Tìm kiếm trước khi ôn tập.',
          text: 'Khi bản gỡ băng xong, hãy gõ một thuật ngữ vào ô Tìm trong văn bản phía trên nó. Ô này đếm số dòng khớp và các mũi tên chuyển giữa chúng, nên bạn có thể phát từng dòng từ mốc thời gian của nó và nghe lại phần giải thích. Nếu một từ chuyên ngành bị viết sai ở khắp nơi, Thay thế… sửa mọi dòng cùng một lúc.',
        },
        {
          title: 'Tự xây dựng dàn ý.',
          text: 'Hãy đọc văn bản một lần, thêm các đề mục của riêng bạn và cắt gọn cho đúng điều bạn cần. Diễn đạt một ý bằng lời của chính mình thường là cách học tốt hơn so với việc sao chép nó.',
        },
        {
          title: 'Kiểm tra tên người, con số và công thức.',
          text: 'Nhận dạng giọng nói viết ra những gì nó nghe thấy. Phương trình, ký hiệu và thuật ngữ hiếm thường cần được sửa, vì vậy hãy đối chiếu chúng với bài trình chiếu và bản ghi.',
        },
        {
          title: 'Liệt kê những chỗ bạn chưa theo kịp.',
          text: 'Hãy sao chép mốc thời gian của những đoạn khiến bạn lạc vào một danh sách, và mang nó tới buổi hướng dẫn hoặc giờ tiếp sinh viên tiếp theo.',
        },
      ],
    },
    {
      title: 'Từ vựng chuyên ngành và các ngôn ngữ khác',
      paragraphs: [
        'Các từ chuyên môn là phần khó nhất với mọi công cụ nhận dạng giọng nói. Trước khi bắt đầu, hãy mở Tùy chọn khác và liệt kê các thuật ngữ, tên các lý thuyết và tác giả, cùng mọi chữ viết tắt vào gợi ý từ vựng. Khi đó bản gỡ băng sẽ viết chúng đúng như bạn đã viết thường xuyên hơn.',
        'Nếu bạn học bằng một ngôn ngữ không phải tiếng mẹ đẻ, bản gỡ băng cho bạn văn bản để đọc theo nhịp của riêng mình và tra từ. Hãy chọn ngôn ngữ của bài giảng, hoặc giữ Tự động nhận diện. Một bài giảng bằng ngôn ngữ khác cũng có thể được chuyển thành văn bản tiếng Anh: trong Tùy chọn khác, hãy đặt Kết quả thành Dịch sang tiếng Anh. Bản dịch kém đáng tin cậy hơn việc gỡ băng bằng ngôn ngữ gốc và có thể bỏ sót thuật ngữ chuyên ngành, vì vậy hãy đối chiếu nó với bản ghi.',
      ],
    },
  ],

  howTitle: 'Cách chuyển bài giảng thành văn bản',
  howToDescription:
    'Thêm bản ghi bài giảng, đặt ngôn ngữ và thuật ngữ chuyên ngành, chờ bản gỡ băng và tải về làm ghi chú.',
  steps: [
    {
      title: 'Thêm bản ghi bài giảng',
      text: 'Kéo tệp vào khung phía trên, hoặc bấm Chọn tệp. Tệp từ máy ghi âm trên điện thoại, video bài giảng đã lưu hoặc bản quay màn hình một lớp học trực tuyến đều dùng được, và chỉ phần âm thanh được sử dụng. Khung này nhận một tệp mỗi lần và chuyển nó sang trình tải lên ở trang kế tiếp, nơi Thêm tệp khác đưa vào các buổi học còn lại của một khóa.',
    },
    {
      title: 'Đặt ngôn ngữ và chất lượng',
      text: 'Ở trang kế tiếp, chọn ngôn ngữ của bài giảng. Tiêu chuẩn phù hợp với một bản ghi rõ. Với giảng đường có tiếng vang hoặc người nói nhanh, Độ chính xác cao giúp được nếu thiết bị của bạn chạy được (lựa chọn này bị làm mờ, kèm lý do, khi không chạy được). Hãy chuẩn bị cho một công việc chậm hơn và bản tải về lần đầu nặng hơn.',
    },
    {
      title: 'Thêm thuật ngữ chuyên ngành, rồi bắt đầu',
      text: 'Trong Tùy chọn khác, hãy gõ các thuật ngữ chính, tên người và chữ viết tắt vào gợi ý từ vựng, ví dụ chu trình Krebs, Bayes, TS. Okafor. Sau đó bấm Chuyển thành văn bản.',
    },
    {
      title: 'Đọc, sửa và tải về',
      text: 'Phát các dòng từ mốc thời gian của chúng để kiểm tra và sửa lỗi. Sau đó tải TXT hoặc Markdown cho ứng dụng ghi chú của bạn, hoặc PDF để in.',
    },
  ],

  formatsTitle: 'Tệp bản ghi bài giảng và định dạng tải về',
  formatsIntro:
    'Bản ghi trên điện thoại, video đã lưu và bản quay màn hình các lớp học đều có thể được thêm vào; chỉ luồng âm thanh được đọc.',
  uploadTitle: 'Các tệp bản ghi bạn có thể thêm',
  accepts: ['MP4', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'văn bản thuần cho ứng dụng ghi chú' },
    { name: 'Markdown', use: 'văn bản kèm thời gian, dễ sắp xếp lại cấu trúc' },
    { name: 'PDF', use: 'một bản học tập để in' },
    { name: 'SRT', use: 'phụ đề, nếu bài giảng là video bạn chia sẻ' },
  ],

  tipsTitle: 'Mẹo cho bản ghi bài giảng',
  tips: [
    {
      title: 'Hãy xin phép trước.',
      text: 'Một số giảng viên và trường không cho phép ghi âm. Hãy hỏi, và tuân theo quy định bạn được cho biết.',
    },
    {
      title: 'Ghi âm gần người nói.',
      text: 'Máy ghi âm đặt ở phía trước phòng thường hiệu quả hơn một máy tốt hơn đặt ở cuối phòng, vì khoảng cách và tiếng vang thường làm mất nhiều độ chính xác hơn bất kỳ thiết lập nào có thể lấy lại.',
    },
    {
      title: 'Chia nhỏ các buổi rất dài.',
      text: 'Nếu một buổi học lớn hơn hoặc dài hơn các giới hạn nêu trên trang này, hãy cắt nó thành nhiều phần tại giờ giải lao trước khi thêm vào.',
      browser: {
        title: 'Buổi học dài mất nhiều thời gian hơn.',
        text: 'Không có giới hạn về thời lượng, nhưng một bài giảng dài giữ thiết bị của bạn bận một lúc và cần bộ nhớ trống, và trình duyệt không dùng được WebCodecs có thể gặp khó với một tệp rất dài. Cắt nó tại giờ giải lao sẽ cho bạn nửa đầu để đọc sớm hơn.',
      },
    },
    {
      title: 'Mở sẵn bài trình chiếu khi ôn tập.',
      text: 'Tiêu đề các trang trình chiếu cho bạn một dàn ý có sẵn để đối chiếu với các mốc thời gian.',
    },
    {
      title: 'Tải về trước khi rời đi.',
      text: 'Bản gỡ băng chỉ tồn tại trong phiên làm việc của bạn. Hãy lưu TXT hoặc Markdown trước khi đóng trang.',
    },
  ],

  faqs: [
    {
      question: 'Ghi âm một bài giảng rồi gỡ băng có được phép không?',
      answer:
        'Điều đó phụ thuộc vào giảng viên và trường của bạn, vì vậy hãy hỏi trước khi ghi âm và tuân theo quy định của họ. Hãy dùng bản gỡ băng cho việc học của riêng bạn trừ khi bạn được phép chia sẻ nó. Đây không phải là tư vấn pháp lý.',
    },
    {
      question: 'Tôi có thể tự động biến bản gỡ băng bài giảng thành ghi chú không?',
      answer:
        'Không. TranscribeVid cho bạn các từ, với mốc thời gian ở mỗi dòng, nhưng không tóm tắt hay thêm đề mục. Bạn tự xây dựng ghi chú từ văn bản, đó cũng là một cách tốt để học tài liệu.',
    },
    {
      question: 'Công cụ có dùng được cho bài giảng có phương trình hoặc thuật ngữ kỹ thuật không?',
      answer:
        'Nó viết ra những từ nó nghe được, nên các thuật ngữ được nói thường ra tốt khi bạn thêm chúng vào gợi ý từ vựng. Ký hiệu và phương trình không được viết ra dưới dạng công thức, vì vậy hãy đối chiếu chúng với bài trình chiếu của bạn.',
    },
    {
      question: 'Tôi có thể gỡ băng một bài giảng dài bao nhiêu?',
      answer: '{limits} Một bài giảng dài hơn cần được chia thành nhiều phần trước.',
      browser: {
        answer:
          'Không có giới hạn về độ dài bài giảng. Vì chính thiết bị của bạn làm việc, một bài giảng dài chủ yếu tốn sự kiên nhẫn và bộ nhớ trống, và trang sẽ cảnh báo khi thiết bị của bạn có vẻ quá chậm cho việc đó.',
      },
    },
    {
      question: 'Tôi có thể gỡ băng một lớp học trực tuyến mà tôi đã quay màn hình không?',
      answer:
        'Có. Bản quay màn hình được lưu dưới dạng MP4, MOV hoặc WebM đều dùng được. Chỉ phần âm thanh được đọc, nên chữ trên các trang trình chiếu không được đưa vào. Hãy thêm các thuật ngữ trong bài trình chiếu vào gợi ý từ vựng.',
    },
  ],

  links: [
    {
      label: 'Video thành văn bản',
      path: '/video-to-text',
      note: 'Trang tổng quát cho mọi video đã ghi, với đầy đủ các loại tệp.',
    },
    {
      label: 'MP3 thành văn bản',
      path: '/mp3-to-text',
      note: 'Dành cho các bản ghi bài giảng được lưu thành MP3 trên điện thoại hoặc máy ghi âm.',
    },
    {
      label: 'Dịch lời nói sang văn bản tiếng Anh',
      path: '/translate-audio-to-english',
      note: 'Văn bản tiếng Anh từ một bài giảng bằng ngôn ngữ khác.',
    },
    {
      label: 'Cách có bản gỡ băng chính xác hơn',
      path: '/guides/accurate-transcripts',
      note: 'Những lựa chọn về âm thanh, ngôn ngữ và chất lượng giúp giảm lỗi ở một bản ghi khó.',
    },
  ],
};
