import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Bản ghi cuộc họp thành văn bản',
  h1: 'Chuyển bản ghi cuộc họp thành văn bản: Zoom, Teams và Google Meet',
  lead: 'Lưu bản ghi sau cuộc gọi, thả vào đây và nhận bản gỡ băng có mốc thời gian để tìm kiếm, trích dẫn và biến thành biên bản. Hoàn toàn miễn phí, không cần tài khoản và hỗ trợ hơn 50 ngôn ngữ.',
  dropKind: 'video',
  dropNoun: 'bản ghi cuộc họp',

  whyTitle: 'Vì sao nên gỡ băng bản ghi cuộc họp',
  why: [
    'Rất ít người xem lại một cuộc họp dài cả giờ, nhưng nhiều người cần một điều từ đó: ai đã đồng ý với điều gì, và trước khi nào. Bản gỡ băng cho phép bạn tìm một thời hạn hoặc một cái tên, tìm ra phút nó được nói và trích dẫn chính xác. Đó là điểm khởi đầu nhanh hơn cho biên bản và danh sách việc cần làm so với việc phát lại cuộc gọi.',
    'Trang này làm việc với một bản ghi đã có sẵn. Nó không thể tham gia một cuộc gọi trực tiếp, và không thêm tên người nói, nên nó thay cho việc xem lại, chứ không thay người ghi biên bản. Cuộc họp thường chứa các chi tiết bảo mật, vì vậy hãy biết bản ghi đi đâu: ở đây nó được tải lên qua kết nối mã hóa và được xóa tự động sau đó.',
  ],
  browserWhy: [
    'Rất ít người xem lại một cuộc họp dài cả giờ, nhưng nhiều người cần một điều từ đó: ai đã đồng ý với điều gì, và trước khi nào. Bản gỡ băng cho phép bạn tìm một thời hạn hoặc một cái tên, tìm ra phút nó được nói và trích dẫn chính xác. Đó là điểm khởi đầu nhanh hơn cho biên bản và danh sách việc cần làm so với việc phát lại cuộc gọi.',
    'Trang này làm việc với một bản ghi đã có sẵn. Nó không thể tham gia một cuộc gọi trực tiếp, và không thêm tên người nói, nên nó thay cho việc xem lại, chứ không thay người ghi biên bản. Cuộc họp thường chứa các chi tiết bảo mật: trình duyệt của bạn gỡ băng bản ghi ngay trên thiết bị của bạn và không có gì được tải lên, và không có gì được giữ lại khi phiên của bạn kết thúc.',
  ],

  sections: [
    {
      title: 'Tìm bản ghi cuộc họp của bạn ở đâu',
      paragraphs: [
        'Mỗi công cụ họp lưu bản ghi ở một nơi riêng, và tên menu, thư mục cùng những gì gói của bạn cho phép thay đổi giữa các phiên bản, vì vậy hãy xem đây là gợi ý. Nếu bạn chỉ xuất được phần âm thanh, tệp M4A hoặc MP3 nhỏ hơn và được đọc tốt không kém. Zoom, Microsoft Teams và Google Meet là tên của các chủ sở hữu tương ứng, và trang này không liên kết với họ.',
      ],
      bullets: [
        {
          title: 'Zoom.',
          text: 'Bản ghi cục bộ được lưu trên máy tính của bạn khi cuộc họp kết thúc, thường là một video MP4 và một tệp âm thanh M4A. Bản ghi trên đám mây được tải về từ trang bản ghi trong tài khoản Zoom của bạn.',
        },
        {
          title: 'Microsoft Teams.',
          text: 'Sau cuộc họp, bản ghi được lưu trong OneDrive hoặc SharePoint, tùy loại cuộc họp, và một liên kết xuất hiện trong cuộc trò chuyện của cuộc họp. Hãy mở nó ở đó và tải MP4 về nếu tài khoản của bạn cho phép tải xuống.',
        },
        {
          title: 'Google Meet.',
          text: 'Bản ghi được lưu vào Google Drive, thường trong thư mục Meet Recordings, và người tổ chức nhận được một liên kết. Hãy tải MP4 về từ Drive.',
        },
      ],
    },
    {
      title: 'Từ bản gỡ băng đến biên bản',
      paragraphs: [
        'Bản gỡ băng thô chưa phải là biên bản, nhưng nó giúp viết biên bản rất nhanh. Khi bản gỡ băng xong, hãy gõ một từ như thời hạn, đồng ý hay hành động vào ô Tìm trong văn bản phía trên nó, hoặc tên của một người liên quan. Ô này cho biết có bao nhiêu dòng khớp, và các mũi tên lên xuống chuyển từ dòng này sang dòng kế tiếp. Hãy đọc quanh mỗi kết quả, phát dòng đó từ mốc thời gian của nó nếu chưa rõ, và sao chép các dòng vào ghi chú của bạn kèm thời điểm để ai cũng có thể kiểm tra bản ghi.',
        'Nếu một cái tên bị viết theo hai cách khác nhau, hãy tìm cách viết sai, mở Thay thế…, gõ cách viết đúng và áp dụng cho mọi dòng cùng một lúc. Hãy tải Markdown để dán vào ứng dụng ghi chú, hoặc PDF để gửi đi. Các dòng có mốc thời gian nhưng không có nhãn người nói, vì vậy hãy gõ tên vào khi chỉnh sửa, dùng bản ghi để kiểm tra ai đã nói.',
      ],
    },
    {
      title: 'Sự cho phép, quy định và sự cẩn trọng',
      paragraphs: [
        'Hãy báo cho mọi người biết trước khi ghi một cuộc họp và xin phép họ, đồng thời tuân theo quy định của tổ chức bạn về bản ghi và bản gỡ băng. Bản gỡ băng của một cuộc họp bảo mật nhạy cảm không kém bản ghi, nên hãy lưu trữ và chia sẻ nó cẩn trọng như vậy. Trang này không đưa ra tư vấn pháp lý.',
      ],
    },
  ],

  howTitle: 'Cách chuyển bản ghi cuộc họp thành văn bản',
  howToDescription:
    'Thêm bản ghi cuộc họp, chọn ngôn ngữ, chờ bản gỡ băng và tải về dưới dạng văn bản hoặc phụ đề.',
  steps: [
    {
      title: 'Thêm bản ghi',
      text: 'Bấm Chọn tệp, hoặc kéo bản ghi vào khung phía trên. Cả video MP4 lẫn tệp âm thanh M4A đều dùng được, và chỉ phần âm thanh được sử dụng. Khung này nhận một bản ghi mỗi lần và chuyển nó sang trình tải lên ở trang kế tiếp, nơi Thêm tệp khác đưa vào phần còn lại của một ngày họp.',
    },
    {
      title: 'Chọn ngôn ngữ và chất lượng',
      text: 'Ở trang kế tiếp, chọn ngôn ngữ mọi người đã nói, hoặc giữ Tự động nhận diện. Tiêu chuẩn phù hợp với hầu hết cuộc gọi. Ở những thiết bị có hỗ trợ, Độ chính xác cao và Độ chính xác cao nhất phù hợp với người nói nhanh hoặc âm thanh kém; nếu không, chúng hiện bị làm mờ kèm lý do. Cả hai đều chậm hơn và cần bản tải về lần đầu nặng hơn. Nếu mọi người chuyển ngôn ngữ, hãy chọn ngôn ngữ chính và kiểm tra các dòng được đánh dấu là chưa chắc chắn. Sau đó bấm Chuyển thành văn bản.',
    },
    {
      title: 'Chờ bản gỡ băng',
      text: 'Các dòng hiện ra khi bản ghi được xử lý, cùng thanh tiến độ và ước tính thời gian còn lại. Một cuộc họp dài mất nhiều thời gian hơn.',
      browser: {
        text: 'Các dòng hiện ra khi bản ghi được xử lý, cùng thanh tiến độ và ước tính thời gian còn lại. Chính thiết bị của bạn làm việc, nên một cuộc họp dài mất nhiều thời gian hơn: hãy giữ trang này mở cho đến khi xong.',
      },
    },
    {
      title: 'Tìm kiếm, chỉnh sửa và xuất',
      text: 'Gõ tên người và các từ về quyết định vào Tìm trong văn bản để chuyển giữa các dòng, phát một dòng từ mốc thời gian của nó để kiểm tra, và sửa lỗi. Sau đó tải TXT, Markdown hoặc PDF. Hãy thêm tên người nói thủ công khi chỉnh sửa.',
    },
  ],

  formatsTitle: 'Tệp bản ghi cuộc họp và định dạng tải về',
  formatsIntro:
    'Bản ghi Zoom, Teams và Meet thường là MP4 hoặc M4A. Các tệp video và âm thanh khác cũng dùng được, và chỉ luồng âm thanh được đọc.',
  uploadTitle: 'Các tệp bản ghi bạn có thể thêm',
  accepts: ['MP4', 'M4A', 'MKV', 'MOV', 'WEBM', 'MP3', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'toàn bộ cuộc họp dưới dạng văn bản thuần' },
    { name: 'Markdown', use: 'ghi chú có thời gian để dán vào ứng dụng ghi chú' },
    { name: 'PDF', use: 'một bản để in hoặc gửi đi' },
    { name: 'SRT', use: 'các dòng có thời gian để thêm phụ đề cho bản ghi' },
  ],

  tipsTitle: 'Mẹo cho bản gỡ băng cuộc họp',
  tips: [
    {
      title: 'Dùng tệp chỉ có âm thanh khi có.',
      text: 'Nó chứa cùng lời nói trong một tệp nhỏ hơn nhiều, nên thêm vào và xử lý nhanh hơn.',
    },
    {
      title: 'Đưa tên người và thuật ngữ vào gợi ý từ vựng.',
      text: 'Trong Tùy chọn khác, hãy liệt kê những người, tên sản phẩm và từ viết tắt được dùng trong cuộc họp. Nhờ vậy tên người và từ viết tắt sẽ ra đúng như bạn mong đợi.',
    },
    {
      title: 'Hãy lường trước việc nói chồng lên nhau gây lỗi.',
      text: 'Khi hai người nói cùng lúc, công cụ nhận dạng không thể tách họ ra. Những dòng nó chưa chắc chắn được đánh dấu, vì vậy hãy xem lại chúng trước.',
    },
    {
      title: 'Đừng vượt quá các giới hạn.',
      text: 'Các bản ghi vượt quá giới hạn dung lượng hoặc thời lượng nêu trên trang này không thể được xử lý, vì vậy hãy cắt một cuộc gọi rất dài thành nhiều phần trước.',
      browser: {
        title: 'Cuộc gọi dài mất nhiều thời gian hơn.',
        text: 'Trang không đặt giới hạn về thời lượng, nhưng bản ghi một buổi hội thảo cả ngày cần thời gian và bộ nhớ trống trên thiết bị của bạn. Để đọc giờ đầu tiên sớm hơn, hãy cắt tệp thành nhiều phần trong một phần mềm biên tập video.',
      },
    },
    {
      title: 'Chia sẻ bản gỡ băng một cách cẩn trọng.',
      text: 'Chỉ gửi cho những người đã dự cuộc họp hoặc cần đến nó, và xóa nó khi bạn không còn cần nữa.',
    },
  ],

  faqs: [
    {
      question:
        'TranscribeVid có thể tham gia cuộc gọi Zoom hoặc Teams của tôi và gỡ băng trực tiếp không?',
      answer:
        'Không. Nó làm việc với một bản ghi mà bạn lưu sau cuộc họp. Nó không thể tham gia cuộc gọi, và không phải là phụ đề trực tiếp. Muốn có phụ đề trực tiếp, hãy dùng tính năng của công cụ họp của bạn.',
    },
    {
      question: 'Bản gỡ băng cuộc họp có cho biết ai đã nói gì không?',
      answer:
        'Không. Các dòng có mốc thời gian nhưng không có tên. Hãy tự thêm tên khi chỉnh sửa, và đối chiếu từng tên với bản ghi.',
    },
    {
      question: 'Gỡ băng bản ghi một cuộc họp bảo mật ở đây có an toàn không?',
      answer:
        'Máy chủ nhận bản ghi qua kết nối mã hóa và xóa nó khi phiên của bạn kết thúc, hoặc sớm hơn nếu bạn bấm Xóa dữ liệu của tôi ngay. Hãy kiểm tra trước xem tổ chức của bạn cho phép những gì. Đây không phải là tư vấn pháp lý.',
      browser: {
        answer:
          'Bản ghi không được tải lên: trình duyệt của bạn gỡ băng nó ngay trên thiết bị của bạn, và xóa nó sau một khoảng thời gian không hoạt động hoặc khi bạn bấm Xóa dữ liệu của tôi ngay. Bản gỡ băng bạn tải về là một tệp bình thường trên thiết bị của bạn, vì vậy hãy giữ gìn nó như giữ bản ghi, và kiểm tra xem tổ chức của bạn cho phép những gì. Đây không phải là tư vấn pháp lý.',
      },
    },
    {
      question: 'Tôi có thể gỡ băng bản ghi một cuộc họp dài bao nhiêu?',
      answer: '{limits} Các tệp dài hơn không thể được xử lý, vì vậy hãy chia nhỏ chúng trước.',
      browser: {
        answer:
          'Không có giới hạn nào đặt lên chính bản ghi, vì việc xử lý diễn ra trên thiết bị của bạn. Điều giới hạn bạn là thời gian và bộ nhớ trống: một cuộc gọi dài nhiều giờ vẫn làm được, trang sẽ cảnh báo nếu thiết bị của bạn có vẻ quá chậm cho việc đó, và một trình duyệt không hỗ trợ WebCodecs có thể không xử lý nổi một tệp rất dài.',
      },
    },
    {
      question: 'Nếu mọi người chuyển ngôn ngữ giữa chừng cuộc họp thì sao?',
      answer:
        'Hãy chọn ngôn ngữ được nói nhiều nhất. Việc nhận dạng bám theo ngôn ngữ chính tốt nhất, nên các từ ở ngôn ngữ khác có thể bị viết sai. Những dòng nó chưa chắc chắn được đánh dấu: hãy đối chiếu chúng với bản ghi.',
    },
  ],

  links: [
    {
      label: 'MP4 thành văn bản',
      path: '/mp4-to-text',
      note: 'Các thiết lập cho cuộc họp được lưu thành video MP4.',
    },
    {
      label: 'M4A thành văn bản',
      path: '/m4a-to-text',
      note: 'Dành cho tệp chỉ có âm thanh, nhỏ hơn video.',
    },
    {
      label: 'Gỡ băng phỏng vấn',
      path: '/interview-transcription',
      note: 'Dành cho một cuộc trò chuyện một-một đã ghi, kèm lưu ý về sự đồng ý và việc kiểm tra các câu trích dẫn.',
    },
    {
      label: 'Gỡ băng video mà không cần tải lên',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Bản ghi của bạn nằm ở đâu, và cách xác nhận điều đó trong trình duyệt.',
    },
  ],
};
