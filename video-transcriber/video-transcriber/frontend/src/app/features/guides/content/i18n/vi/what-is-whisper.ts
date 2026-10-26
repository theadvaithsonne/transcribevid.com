import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Whisper là gì? Giải thích về chuyển giọng nói thành văn bản',
  lead: 'Whisper là một mô hình nhận dạng giọng nói mã nguồn mở mà OpenAI phát hành năm 2022. Nó chuyển âm thanh lời nói thành văn bản trong khoảng một trăm ngôn ngữ, và có thể chạy ngay trên máy tính của bạn. Bài hướng dẫn này giải thích nó đến từ đâu, đã học từ dữ liệu gì, hoạt động thế nào, mạnh và yếu ở đâu, và cách TranscribeVid chạy nó ngay trong trình duyệt của bạn.',
  readingMinutes: 8,
  toolPath: '/audio-to-text',
  toolCta: 'Thử Whisper với âm thanh của bạn',
  blocks: [
    {
      title: 'Whisper trong một đoạn văn',
      paragraphs: [
        'Whisper là một mạng nơ-ron được huấn luyện để nghe lời nói và viết ra những gì nó nghe được. Bạn đưa âm thanh vào; nó trả về văn bản có mốc thời gian, và nó cũng có thể nêu tên ngôn ngữ và dịch lời nói sang tiếng Anh. Nó có nhiều cỡ, từ một phiên bản nhỏ xíu chạy vừa trên điện thoại đến một phiên bản lớn cần máy tính mạnh.',
        'Nó không phải một trang web hay một dịch vụ. Nó là một bộ tệp: mô hình và mã để chạy nó. Ai cũng có thể tải về và dùng, đó là lý do nhiều công cụ gỡ băng miễn phí và riêng tư, kể cả công cụ này, được xây dựng trên nó.',
      ],
    },
    {
      title: 'Nó đến từ đâu',
      paragraphs: [
        'OpenAI công bố Whisper vào tháng 9 năm 2022, cùng với một bài nghiên cứu mang tên "Robust Speech Recognition via Large-Scale Weak Supervision". Mã nguồn và các mô hình đã huấn luyện được phát hành theo giấy phép MIT, một trong những giấy phép mã nguồn mở thoáng nhất. Nó cho phép mọi người dùng, sửa đổi và phân phối phần mềm, kể cả trong các sản phẩm thương mại.',
        'Trước Whisper, công nghệ nhận dạng giọng nói tốt nhất phần lớn bị khóa bên trong các dịch vụ của những công ty lớn, hoặc được xây dựng cho một ngôn ngữ hay một loại âm thanh. Whisper thay đổi điều đó nhờ đủ tốt, đủ rộng và miễn phí để tự chạy. OpenAI cũng bán quyền truy cập nhận dạng giọng nói qua dịch vụ web của chính họ, nhưng đó là một sản phẩm trả phí riêng biệt. Mô hình bạn chạy trong trình duyệt ở đây là bản mã nguồn mở.',
      ],
    },
    {
      title: 'Nó được huấn luyện bằng gì',
      paragraphs: [
        'Whisper học từ khoảng 680.000 giờ âm thanh đi kèm bản gỡ băng, thu thập từ internet. Khoảng một phần ba số âm thanh đó không phải tiếng Anh, bao gồm khoảng một trăm ngôn ngữ (bản phát hành liệt kê 99). Các bản gỡ băng không phải đều được kiểm tra bằng tay, đó là điều "weak supervision" (giám sát yếu) trong tiêu đề bài nghiên cứu muốn nói.',
        'Có hai hệ quả thực tế. Vì âm thanh huấn luyện rất đa dạng, với nhiều loại micro, giọng, căn phòng và chủ đề khác nhau, Whisper xử lý các bản ghi thực tế tốt hơn các mô hình huấn luyện trên giọng nói phòng thu sạch sẽ. Nhưng lượng âm thanh huấn luyện khác nhau giữa các ngôn ngữ, nên độ chính xác không đồng đều: nhìn chung nó mạnh nhất với tiếng Anh và các ngôn ngữ phổ biến khác có nhiều ví dụ, và yếu hơn với những ngôn ngữ có ít dữ liệu huấn luyện.',
      ],
    },
    {
      title: 'Cách hoạt động, nói đơn giản',
      paragraphs: [
        'Whisper cắt âm thanh thành các cửa sổ 30 giây và biến mỗi cửa sổ thành một bức tranh của âm thanh, gọi là phổ đồ (spectrogram), cho thấy từng cao độ to đến đâu theo thời gian. Mô hình sau đó có hai nửa. Một bộ mã hóa (encoder) nghiên cứu bức tranh đó. Một bộ giải mã (decoder) viết văn bản từng mẩu nhỏ một, như cách một người có thể viết một câu trong khi nghĩ xem điều gì đến tiếp theo.',
        'Bộ giải mã cũng viết các dấu hiệu đặc biệt: ngôn ngữ nào nó cho là đang được nói, nên gỡ băng hay dịch, và mỗi câu bắt đầu và kết thúc ở thời điểm nào. Mốc thời gian đến từ đó.',
        'Các bản ghi dài được xử lý từng cửa sổ một. Thiết kế này linh hoạt, nhưng nó giải thích hai thói quen của Whisper: nó có thể mất mạch giữa các cửa sổ, và có thể lặp lại chính mình khi một cửa sổ có ít lời nói. TranscribeVid giảm cả hai bằng một bộ phát hiện giọng nói bỏ qua khoảng lặng và hầu hết âm thanh không phải lời nói trước khi mô hình nhìn thấy, và bằng các bước kiểm tra bắt một số văn bản bị lặp hoặc bịa ra sau đó.',
      ],
    },
    {
      title: 'Các cỡ mô hình, và bạn nhận được cỡ nào ở đây',
      paragraphs: [
        'Whisper có nhiều cỡ. Mô hình lớn hơn mắc ít lỗi hơn, nhất là khi có tiếng ồn và với các ngôn ngữ khác tiếng Anh, nhưng chúng chậm hơn và cần nhiều bộ nhớ hơn cùng bản tải lớn hơn. Bốn lựa chọn chất lượng trên trang tải tệp tương ứng với các cỡ này như sau:',
      ],
      table: {
        caption: 'Các cỡ Whisper và các lựa chọn trên TranscribeVid',
        head: ['Mô hình', 'Số tham số (xấp xỉ)', 'Tìm thấy ở đâu trên trang này'],
        rows: [
          ['Tiny', '39 triệu', 'Tùy chọn khác, Danh sách mô hình'],
          ['Base', '74 triệu', 'Nhanh nhất'],
          ['Small', '244 triệu', 'Tiêu chuẩn'],
          ['Medium', '769 triệu', 'Tùy chọn khác, Danh sách mô hình'],
          ['Large v3 Turbo', '809 triệu', 'Độ chính xác cao'],
          ['Large v3', '1,55 tỷ', 'Độ chính xác cao nhất'],
        ],
      },
      after: [
        'Large v3 được phát hành vào tháng 11 năm 2023, còn phiên bản Turbo ra sau đó, vào năm 2024. Turbo là một mô hình lớn đã được cắt gọn, nhanh hơn nhiều và gần bằng nó về độ chính xác với nhiều ngôn ngữ, đó là lý do nó là lựa chọn Độ chính xác cao. Một hạn chế: OpenAI cho biết Turbo không được huấn luyện để dịch và có thể trả về ngôn ngữ gốc khi được yêu cầu dịch, vì vậy với Kết quả, Dịch sang tiếng Anh, hãy chọn Độ chính xác cao nhất. Danh sách mô hình cũng có Distil Large v3, một phiên bản chưng cất nhỏ hơn và nhanh hơn của Whisper large v3, chỉ dành cho tiếng Anh. Trong Công cụ nhận dạng còn có Qwen3 ASR, một công cụ khác, mang tính thử nghiệm, dành cho trình duyệt máy tính có WebGPU. Qwen3 ASR không phải là mô hình Whisper.',
      ],
    },
    {
      title: 'Những gì nó làm tốt',
      bullets: [
        {
          title: 'Âm thanh thực tế.',
          text: 'Bản ghi bằng điện thoại, bài giảng, cuộc phỏng vấn và nhạc nền video có tiếng ồn vừa phải.',
        },
        {
          title: 'Nhiều ngôn ngữ trong một mô hình.',
          text: 'Cùng một họ mô hình xử lý tiếng Anh, tiếng Tây Ban Nha, tiếng Hindi, tiếng Ả Rập, tiếng Nhật và hàng chục thứ tiếng khác, và thường có thể tự xác định ngôn ngữ.',
        },
        {
          title: 'Dấu câu và chữ hoa.',
          text: 'Nó viết các câu có chữ hoa và dấu câu, thay vì một chuỗi dài các từ viết thường.',
        },
        {
          title: 'Mốc thời gian.',
          text: 'Mỗi dòng đều có thời điểm bắt đầu và kết thúc, và với mốc thời gian theo từng từ, trang có thể đặt từng từ vào đúng vị trí.',
        },
        {
          title: 'Dịch sang tiếng Anh.',
          text: 'Nó có thể biến lời nói bằng ngôn ngữ khác trực tiếp thành văn bản tiếng Anh, điều mà trang cung cấp dưới dạng Kết quả, Dịch sang tiếng Anh. Turbo là ngoại lệ: nó không được huấn luyện để dịch, vì vậy hãy dùng Độ chính xác cao nhất cho việc này.',
        },
      ],
    },
    {
      title: 'Những chỗ nó gặp khó khăn',
      paragraphs: [
        'Whisper rất ấn tượng, và cũng có thể sai. Hãy biết những thói quen này trước khi bạn dựa vào một bản gỡ băng.',
      ],
      bullets: [
        {
          title: 'Nó có thể bịa ra văn bản.',
          text: 'Khi gặp khoảng lặng, nhạc hoặc tiếng ồn, nó có thể viết ra những từ trôi chảy mà không ai nói, hoặc lặp đi lặp lại một cụm từ. Đây là hành vi đã biết của mô hình, không phải lỗi của một bản ghi riêng lẻ.',
        },
        {
          title: 'Tên người, con số và từ hiếm.',
          text: 'Nó viết một cái tên theo cách nó thấy khả dĩ nhất, và có thể đổi các từ nghe giống nhau. Hãy dùng gợi ý từ vựng, rồi kiểm tra các con số.',
        },
        {
          title: 'Các ngôn ngữ không đồng đều.',
          text: 'Độ chính xác thay đổi theo ngôn ngữ và theo giọng vùng miền. Một mô hình lớn hơn giúp ích rất nhiều với những ngôn ngữ có ít dữ liệu huấn luyện.',
        },
        {
          title: 'Không có nhãn người nói.',
          text: 'Nó không cho biết ai đang nói, và các giọng nói chồng lên nhau thường bị gộp lại hoặc bỏ sót.',
        },
        {
          title: 'Không phải trực tiếp.',
          text: 'Nó làm việc trên một bản ghi từng cửa sổ một, nên không được xây dựng cho phụ đề xuất hiện ngay khi ai đó đang nói.',
        },
      ],
    },
    {
      title: 'Cách TranscribeVid chạy Whisper trong trình duyệt của bạn',
      paragraphs: [
        'Whisper gốc được viết cho phần mềm học máy chuyên dụng. Để chạy nó trong một trang web, các mô hình được chuyển sang một định dạng di động gọi là ONNX, và một thư viện tên Transformers.js, của Hugging Face, chạy chúng bằng ONNX Runtime. Trên máy tính có WebGPU, việc tính toán do chip đồ họa đảm nhận, rất nhanh. Nếu không, nó chạy trên bộ xử lý thông qua WebAssembly, chậm hơn nhưng dùng được gần như ở mọi nơi.',
        'Để giữ các bản tải ở mức hợp lý, các mô hình dùng định dạng số gọn, giúp thu nhỏ tệp, thường phải đánh đổi một chút độ chính xác. Đó là cách mô hình lớn nhất nặng khoảng một gigabyte với WebGPU (1,8 GB với WebAssembly) thay vì vài gigabyte.',
        'Trên transcribevid.com, việc chạy trong trình duyệt có hai hệ quả. Thứ nhất, quyền riêng tư: tệp media của bạn được đọc trên thiết bị của bạn và không bị tải lên, nên không có máy chủ nào của chúng tôi từng nhận được âm thanh của bạn. Thứ hai, tốc độ: nó phụ thuộc vào thiết bị của bạn, và lần dùng đầu tiên của mỗi mức chất lượng bao gồm một lần tải mô hình một lần. Bài hướng dẫn về chuyển thành văn bản mà không cần tải lên giải thích những gì được tải về và cách kiểm tra điều đó.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Whisper có miễn phí để dùng không?',
      answer:
        'Mô hình và mã của nó miễn phí và là mã nguồn mở theo giấy phép MIT, nên ai cũng có thể chạy chúng. Chạy một mô hình lớn cần một máy tính mạnh hoặc một máy chủ thuê, và OpenAI cũng cung cấp dịch vụ web trả phí của riêng họ. Trên transcribevid.com nó chạy trên thiết bị của bạn, nên bạn không phải trả gì.',
    },
    {
      question: 'Whisper hiểu được bao nhiêu ngôn ngữ?',
      answer:
        'Khoảng một trăm; bản phát hành liệt kê 99. Chất lượng khác nhau rất nhiều giữa các ngôn ngữ. TranscribeVid cung cấp 61 ngôn ngữ trong danh sách Ngôn ngữ, và bạn cũng có thể chọn Tự động nhận diện.',
    },
    {
      question: 'Tôi nên chọn cỡ Whisper nào?',
      answer:
        'Hãy bắt đầu với Tiêu chuẩn, tức là mô hình Small. Chuyển sang Độ chính xác cao khi có giọng vùng miền, tiếng ồn hoặc các ngôn ngữ khác tiếng Anh, và sang Độ chính xác cao nhất khi từng từ đều quan trọng và bạn có thể chờ. Nhanh nhất chỉ dành cho lời nói rõ và yên tĩnh.',
    },
    {
      question: 'Vì sao đôi khi Whisper viết ra từ ở chỗ không ai nói?',
      answer:
        'Mô hình được xây dựng để luôn tạo ra văn bản hợp lý, nên một đoạn khoảng lặng, nhạc hoặc tiếng ồn có thể khiến nó bịa ra một ít. Để Bỏ qua khoảng lặng và nhạc luôn bật sẽ bỏ qua hầu hết những đoạn đó trước khi mô hình nhìn thấy.',
    },
  ],
  links: [
    {
      label: 'Cách có bản gỡ băng chính xác hơn',
      path: '/guides/accurate-transcripts',
      note: 'Các thiết lập và thói quen tạo ra khác biệt lớn nhất cho kết quả của Whisper.',
    },
    {
      label: 'Chuyển video thành văn bản mà không cần tải lên',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Trình duyệt của bạn tải về những gì để chạy Whisper, và cách xác minh rằng không có gì bị tải lên.',
    },
    {
      label: 'Dịch lời nói sang tiếng Anh',
      path: '/translate-audio-to-english',
      note: 'Dùng chức năng dịch của Whisper để có văn bản tiếng Anh từ lời nói bằng ngôn ngữ khác.',
    },
    {
      label: 'Chuyển âm thanh thành văn bản',
      path: '/audio-to-text',
      note: 'Thả một bản ghi vào và nhận bản gỡ băng có mốc thời gian.',
    },
    {
      label: 'Chuyển âm thanh tiếng Hindi thành văn bản (trang bằng tiếng Anh)',
      path: '/hindi-audio-to-text',
      note: 'Cách Whisper xử lý tiếng Hindi, kể cả tùy chọn Hinglish viết bằng chữ La-tinh.',
    },
  ],
};
