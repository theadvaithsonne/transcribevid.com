import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Dịch lời nói sang tiếng Anh',
  h1: 'Dịch lời nói sang văn bản và phụ đề tiếng Anh',
  lead: 'Thêm một tệp video hoặc âm thanh bằng ngôn ngữ khác và nhận văn bản tiếng Anh có mốc thời gian, hoặc một tệp phụ đề tiếng Anh. Miễn phí, không cần đăng nhập.',
  dropKind: 'video',
  dropNoun: 'video hoặc âm thanh',

  whyTitle: 'Dịch lời nói sang tiếng Anh làm được gì',
  why: [
    'Hầu hết công cụ nhận dạng giọng nói ghi lại điều được nói bằng chính ngôn ngữ đã nói. Dịch sang tiếng Anh là một công việc khác. Người nói nói bằng tiếng Hindi, tiếng Tây Ban Nha, tiếng Đức hoặc một ngôn ngữ được hỗ trợ khác, và văn bản ra bằng tiếng Anh, với mốc thời gian ở mỗi dòng. Điều đó hữu ích khi bạn cần nắm ý chính của một bài giảng, cuộc phỏng vấn, đoạn tin tức hay video gia đình mà bạn không theo dõi được, hoặc cần phụ đề tiếng Anh cho một video bằng ngôn ngữ khác.',
    'Tiếng Anh là ngôn ngữ duy nhất mà nó dịch sang. Không có việc dịch sang tiếng Pháp, tiếng Hindi hay bất kỳ ngôn ngữ nào khác, và văn bản viết không được dịch: chỉ có lời nói trong bản ghi. Trang này khởi động trình tải lên với Kết quả đặt là Dịch sang tiếng Anh và ngôn ngữ được nói để ở Tự động nhận diện.',
  ],

  sections: [
    {
      title: 'Độ tin cậy của bản tiếng Anh, và những gì cần kiểm tra',
      paragraphs: [
        'Dịch khó hơn gỡ băng. Bản tiếng Anh được tạo thẳng từ âm thanh, không có văn bản viết bằng ngôn ngữ gốc ở giữa. Nó thường đủ tốt để theo dõi ý nghĩa, nhưng có thể rút ngắn hoặc diễn đạt lại câu, bỏ sót thành ngữ và câu đùa, và sai tên người, con số và từ chuyên ngành.',
        'Hãy xem kết quả là bản nháp để hiểu, không phải bản dịch chính thức. Với hợp đồng, tài liệu pháp lý, y tế hay các tài liệu quan trọng khác, hãy nhờ một người dịch thực thụ, và dùng bản gỡ băng bằng ngôn ngữ gốc làm điểm xuất phát.',
        'Một thói quen tốt là làm một bản gỡ băng thông thường bằng ngôn ngữ gốc trước và bản tiếng Anh sau. Chỗ nào hai bản có vẻ không khớp, chỗ đó đáng được nghe kỹ hơn. Một bản gỡ băng đã xong được giữ lại khi bạn dùng Chuyển lại thành văn bản, nên cả hai có thể đến từ cùng một tệp.',
      ],
    },
    {
      title: 'Những ngôn ngữ và lựa chọn chất lượng nào dịch tốt',
      bullets: [
        {
          title: 'Bất kỳ ngôn ngữ nào trong danh sách.',
          text: 'Hơn 50 ngôn ngữ nói, từ tiếng Afrikaans đến tiếng Wales, có thể được dịch sang tiếng Anh. Chất lượng khác nhau rất nhiều, và kém nhất ở những ngôn ngữ có ít lời nói được ghi lại để học. Nếu lời nói đã là tiếng Anh thì bạn không cần trang này: hãy dùng các trang video thành văn bản hoặc âm thanh thành văn bản.',
        },
        {
          title: 'Chọn ngôn ngữ, hoặc để tự nhận diện.',
          text: 'Hãy để Ngôn ngữ ở Tự động nhận diện khi bạn không chắc đang nói thứ tiếng gì. Nếu bạn biết, chọn nó đáng tin cậy hơn, nhất là với các clip ngắn hoặc có giọng địa phương.',
        },
        {
          title: 'Tránh Độ chính xác cao khi dịch.',
          text: 'Độ chính xác cao chạy mô hình Large v3 Turbo. OpenAI, đơn vị tạo ra Whisper, cho biết Turbo không được huấn luyện để dịch và trả về ngôn ngữ gốc ngay cả khi yêu cầu dịch. Distil Large v3, trong Danh sách mô hình ở Tùy chọn khác, chỉ dùng cho tiếng Anh. Để dịch, hãy bắt đầu với Tiêu chuẩn, và chọn Độ chính xác cao nhất (Large v3) cho giọng nói khó. Medium, cũng nằm trong Danh sách mô hình đó, là một lựa chọn tốt khác.',
          browser: {
            text: 'Độ chính xác cao chạy mô hình Large v3 Turbo. OpenAI, đơn vị tạo ra Whisper, cho biết Turbo không được huấn luyện để dịch và trả về ngôn ngữ gốc ngay cả khi yêu cầu dịch. Distil Large v3, trong Danh sách mô hình ở Tùy chọn khác, chỉ dùng cho tiếng Anh. Để dịch, hãy bắt đầu với Tiêu chuẩn, và chọn Độ chính xác cao nhất (Large v3) cho giọng nói khó nếu thiết bị của bạn có hỗ trợ. Medium, cũng nằm trong Danh sách mô hình đó, là một lựa chọn tốt khác.',
          },
        },
        {
          title: 'Chỉ dùng Whisper.',
          text: 'Việc dịch cần công cụ nhận dạng Whisper. Lựa chọn Qwen3 ASR thử nghiệm không dịch được: Dịch sang tiếng Anh không dùng được khi nó đang được chọn, và việc chọn nó đặt Kết quả trở lại Chuyển thành văn bản.',
        },
        {
          title: 'Không có kiểu bản gỡ băng.',
          text: 'Lựa chọn Kiểu bản gỡ băng (Hinglish hoặc Chữ viết gốc) không áp dụng cho bản dịch, và nó bị làm mờ khi Dịch sang tiếng Anh đang được chọn.',
        },
      ],
    },
    {
      title: 'Mọi người làm gì với phụ đề và văn bản tiếng Anh',
      bullets: [
        {
          title: 'Phụ đề cho video của chính bạn.',
          text: 'Tải SRT hoặc VTT về. Các dòng tiếng Anh được khớp thời gian với lời nói gốc, nên có thể thêm vào cùng video đó trong một trình phát hoặc phần mềm biên tập.',
        },
        {
          title: 'Hiểu một bản ghi.',
          text: 'Hãy đọc xem một cuộc phỏng vấn, bài giảng hay bản tin nói về gì trước khi quyết định nó có cần một bản dịch đàng hoàng không.',
        },
        {
          title: 'Nghiên cứu và báo chí.',
          text: 'Một bản nháp tiếng Anh giúp bạn quyết định đoạn nào cần dịch cẩn thận, và đoạn nào nên trích dẫn từ ngôn ngữ gốc.',
        },
      ],
    },
  ],

  howTitle: 'Cách dịch lời nói sang tiếng Anh',
  howToDescription:
    'Thêm một tệp video hoặc âm thanh bằng ngôn ngữ khác, kiểm tra rằng Dịch sang tiếng Anh đã được chọn, chờ văn bản tiếng Anh và tải về.',
  steps: [
    {
      title: 'Thêm bản ghi của bạn',
      text: 'Thả bản ghi vào khung ở đầu trang này, hoặc bấm Chọn tệp. Bạn sẽ đến trình tải lên với Tùy chọn khác đang mở, Kết quả đặt là Dịch sang tiếng Anh và Ngôn ngữ ở Tự động nhận diện. Hãy chọn ngôn ngữ được nói nếu bạn biết.',
    },
    {
      title: 'Chọn chất lượng, rồi bấm Chuyển thành văn bản',
      text: 'Tiêu chuẩn là điểm khởi đầu hợp lý. Với giọng nói có giọng địa phương, nhiều tạp âm hoặc chuyên ngành, hãy chọn Độ chính xác cao nhất, mất nhiều thời gian hơn và thường ít sai sót hơn. Đừng chọn Độ chính xác cao khi dịch: nó dùng một mô hình không được huấn luyện để dịch. Sau đó bấm Chuyển thành văn bản.',
      browser: {
        text: 'Tiêu chuẩn là điểm khởi đầu hợp lý. Với giọng nói có giọng địa phương, nhiều tạp âm hoặc chuyên ngành, hãy chọn Độ chính xác cao nhất nếu thiết bị của bạn có hỗ trợ (lựa chọn nào không chạy được sẽ bị làm mờ, kèm lý do); đó là bản tải về lần đầu rất nặng, mất nhiều thời gian hơn và thường ít sai sót hơn. Đừng chọn Độ chính xác cao khi dịch: nó dùng một mô hình không được huấn luyện để dịch. Sau đó bấm Chuyển thành văn bản.',
      },
    },
    {
      title: 'Chờ văn bản tiếng Anh',
      text: 'Các dòng tiếng Anh hiện ra kèm thời điểm của chúng. Kiểu bản gỡ băng bị làm mờ vì nó chỉ áp dụng cho bản gỡ băng, không áp dụng cho bản dịch.',
    },
    {
      title: 'Kiểm tra và tải về',
      text: 'Hãy đọc các dòng được đánh dấu là chưa chắc chắn, đối chiếu tên người và con số với âm thanh, rồi tải TXT, SRT hoặc VTT, hoặc tệp PDF, Markdown hay JSON.',
    },
  ],

  formatsTitle: 'Tệp vào, văn bản tiếng Anh ra',
  formatsIntro:
    'Video và âm thanh ở nhiều định dạng đều dùng được, dù ngôn ngữ nào được nói. Các tệp bạn tải về chứa văn bản tiếng Anh.',
  uploadTitle: 'Các tệp bạn có thể thêm',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'MKV', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'văn bản tiếng Anh để đọc' },
    { name: 'SRT', use: 'phụ đề tiếng Anh khớp thời gian với lời nói' },
    { name: 'VTT', use: 'phụ đề tiếng Anh cho trình phát web' },
    { name: 'PDF', use: 'một bản để in' },
    { name: 'Markdown', use: 'văn bản có tiêu đề và mốc thời gian' },
    { name: 'JSON', use: 'các dòng và mốc thời gian cho công cụ của riêng bạn' },
  ],

  tipsTitle: 'Mẹo để có bản dịch tốt hơn',
  tips: [
    {
      title: 'Chọn ngôn ngữ được nói khi bạn biết.',
      text: 'Tự động nhận diện ổn với giọng nói rõ, nhưng đoán sai trên một clip ngắn sẽ cho bản dịch kém.',
    },
    {
      title: 'Giữ mỗi clip trong một ngôn ngữ.',
      text: 'Một bản ghi cứ chuyển đi chuyển lại giữa các ngôn ngữ có thể làm bản dịch bị rối. Hãy chia nhỏ nó, hoặc làm một bản gỡ băng thông thường trước để xem công cụ đã nghe được gì.',
    },
    {
      title: 'Kiểm tra con số, tên người và ngày tháng.',
      text: 'Đó là những chi tiết quan trọng nhất và cũng là những chi tiết hay sai nhất trong một bản dịch nháp.',
    },
    {
      title: 'Thử phút đầu tiên.',
      text: 'Hãy đọc phút đầu tiên của bản tiếng Anh đối chiếu với âm thanh trước khi dựa vào cả tệp.',
    },
    {
      title: 'Giữ bản gốc bên cạnh bản tiếng Anh.',
      text: 'Nếu bạn đăng một câu trích dẫn, hãy giữ bản gỡ băng bằng ngôn ngữ gốc bên cạnh bản tiếng Anh.',
    },
  ],

  faqs: [
    {
      question: 'Nó có thể dịch lời nói sang các ngôn ngữ ngoài tiếng Anh không?',
      answer:
        'Không. Tiếng Anh là ngôn ngữ duy nhất mà nó dịch sang. Để đọc lời nói bằng chính ngôn ngữ của nó, hãy làm một bản gỡ băng thông thường.',
    },
    {
      question: 'Vì sao bản gỡ băng đã dịch kém chính xác hơn bản thông thường?',
      answer:
        'Dịch là một nhiệm vụ khó hơn việc ghi lại các từ. Lời nói phải được hiểu và diễn đạt lại trong một bước, nên câu có thể bị rút ngắn, thành ngữ và câu đùa bị bỏ sót và tên người bị nghe nhầm. Hãy đối chiếu mọi thứ quan trọng với âm thanh hoặc với bản gỡ băng bằng ngôn ngữ gốc.',
    },
    {
      question: 'Vì sao bản dịch của tôi ra bằng ngôn ngữ gốc?',
      answer:
        'Nguyên nhân nhiều khả năng là lựa chọn chất lượng. Độ chính xác cao chạy mô hình Large v3 Turbo, mô hình không được huấn luyện để dịch và có xu hướng viết ra ngôn ngữ gốc. Hãy làm lại với Tiêu chuẩn hoặc Độ chính xác cao nhất, và kiểm tra rằng Kết quả đã đặt là Dịch sang tiếng Anh.',
    },
    {
      question: 'Tôi có thể có phụ đề tiếng Anh cho một video bằng ngôn ngữ khác không?',
      answer:
        'Có. Sau khi dịch, hãy tải SRT hoặc VTT. Các dòng tiếng Anh mang thời gian của lời nói gốc. Hãy đọc qua trước khi đăng, và nhớ rằng bản dịch là một bản nháp.',
    },
    {
      question: 'Vì sao tôi không chọn được Dịch sang tiếng Anh?',
      answer:
        'Lựa chọn này không có cho công cụ Qwen3 ASR thử nghiệm. Hãy chuyển Công cụ nhận dạng trở lại Whisper trong Tùy chọn khác và lựa chọn sẽ xuất hiện lại.',
    },
  ],

  links: [
    {
      label: 'Chuyển âm thanh tiếng Hindi thành văn bản (trang bằng tiếng Anh)',
      path: '/hindi-audio-to-text',
      note: 'Đọc lời nói tiếng Hindi bằng chính ngôn ngữ của nó trước khi dịch.',
    },
    {
      label: 'Chuyển âm thanh tiếng Tây Ban Nha thành văn bản (trang bằng tiếng Anh)',
      path: '/spanish-audio-to-text',
      note: 'Tạo một bản gỡ băng tiếng Tây Ban Nha có dấu, không dịch nó.',
    },
    {
      label: 'Tạo phụ đề YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Tạo một tệp SRT cho video của chính bạn và tải nó lên trong YouTube Studio.',
    },
    {
      label: 'Cách thêm phụ đề vào video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Việc cần làm với tệp SRT hoặc VTT sau khi bạn đã có.',
    },
  ],
};
