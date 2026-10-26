import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'SRT hay VTT: nên dùng định dạng phụ đề nào?',
  lead: 'SRT là lựa chọn mặc định an toàn: hầu như mọi trình phát video, phần mềm biên tập và nền tảng đều đọc được. Hãy chọn VTT (WebVTT) khi phụ đề dành cho phần tử video của một trang web, hoặc khi bạn cần định dạng kiểu chữ và vị trí hiển thị. Cả hai đều là tệp văn bản thuần, và bạn có thể tải xuống bất kỳ định dạng nào từ video của mình ngay tại đây.',
  readingMinutes: 10,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Tạo tệp SRT từ video của bạn',
  blocks: [
    {
      title: 'Câu trả lời ngắn gọn',
      paragraphs: [
        'Nếu bạn không chắc, hãy dùng SRT. Đây là định dạng cũ hơn và đơn giản hơn, và nó được chấp nhận ở gần như mọi trình phát video, phần mềm biên tập video và biểu mẫu tải lên mà bạn có thể gặp. Một tệp phụ đề dùng được ở mọi nơi có giá trị hơn một tệp cầu kỳ.',
        'Hãy dùng VTT khi video phát trên một trang web thông qua phần tử video HTML. Trình duyệt chỉ nạp các track phụ đề ở định dạng WebVTT, nên tệp SRT sẽ không chạy ở đó nếu chưa chuyển đổi. VTT cũng là lựa chọn tốt hơn khi bạn muốn đặt chữ ở một vị trí trên màn hình, thêm chữ đậm hay nghiêng một cách chắc chắn, hoặc ghi nhãn người đang nói.',
        'Phần còn lại của bài hướng dẫn này giải thích lý do, cho bạn thấy mỗi tệp trông như thế nào bên trong, và chỉ cách chuyển từ định dạng này sang định dạng kia mà không làm hỏng gì.',
      ],
    },
    {
      title: 'Một tệp SRT trông như thế nào',
      paragraphs: [
        'SRT là viết tắt của SubRip Text, đặt theo tên một chương trình Windows đầu những năm 2000 dùng để sao chép phụ đề ra khỏi đĩa DVD. Định dạng này chưa bao giờ được chuẩn hóa chính thức, nhưng nó phổ biến đến mức mọi thứ đều hỗ trợ. Một tệp SRT là danh sách các khối được đánh số, mỗi khối cách khối kế tiếp bằng một dòng trống.',
      ],
      code: {
        label: 'Một tệp SRT nhỏ',
        text: `1
00:00:01,000 --> 00:00:03,500
Welcome to the show.

2
00:00:03,800 --> 00:00:07,200
Today we look at how
subtitle files are built.

3
00:00:07,600 --> 00:00:10,000
Let's start with the basics.`,
      },
      after: [
        'Mỗi khối có ba phần: một số thứ tự, một dòng có thời điểm bắt đầu và thời điểm kết thúc, và một hoặc hai dòng chữ. Thời gian được viết dưới dạng giờ, phút, giây và mili giây, và phần mili giây được ngăn cách bằng dấu phẩy. Dấu phẩy đó là lý do phổ biến nhất khiến một tệp chuyển đổi thủ công bị lỗi.',
        'Hãy lưu tệp dưới dạng văn bản thuần ở mã hóa UTF-8 với phần mở rộng .srt. UTF-8 rất quan trọng ngay khi văn bản có dấu, chữ Devanagari, chữ Ả Rập hay bất kỳ ký tự không phải tiếng Anh nào khác.',
      ],
    },
    {
      title: 'Một tệp WebVTT trông như thế nào',
      paragraphs: [
        'WebVTT, thường được rút gọn thành VTT, được thiết kế cho web và được định nghĩa trong một đặc tả do W3C công bố, tổ chức chuẩn hóa công nghệ web. Nó trông giống SRT nhưng thêm một dòng tiêu đề bắt buộc và vài tính năng tùy chọn.',
      ],
      code: {
        label: 'Cùng phụ đề đó dưới dạng tệp WebVTT',
        text: `WEBVTT

NOTE This file was made from the SRT example.

intro
00:00:01.000 --> 00:00:03.500
Welcome to the show.

00:00:03.800 --> 00:00:07.200 line:85% align:center
Today we look at how
subtitle files are built.

00:00:07.600 --> 00:00:10.000
<v Maria>Let's start with the basics.</v>`,
      },
      after: [
        'Bốn chi tiết làm nó khác biệt. Dòng đầu tiên phải là WEBVTT. Phần mili giây được ngăn cách bằng dấu chấm, không phải dấu phẩy. Một đoạn phụ đề có thể có tên (từ intro ở trên) thay cho, hoặc cùng với, một con số, và các con số là tùy chọn. Và sau thời gian bạn có thể thêm các thiết lập như line, position và align, giúp di chuyển chữ trên màn hình.',
        'Bạn cũng có thể viết các khối NOTE làm chú thích mà người xem không bao giờ thấy, đánh dấu ai đang nói bằng thẻ v, và dùng các thẻ đơn giản như b, i và u cho chữ đậm, nghiêng và gạch chân. Hãy lưu tệp ở UTF-8 với phần mở rộng .vtt.',
      ],
    },
    {
      title: 'So sánh SRT và VTT',
      paragraphs: [
        'Bảng này đặt hai định dạng cạnh nhau. Những khác biệt quan trọng trong sử dụng hằng ngày là dòng tiêu đề, dấu phân cách phần thập phân và nơi mỗi định dạng được chấp nhận.',
      ],
      table: {
        caption: 'SRT so với WebVTT',
        head: ['', 'SRT', 'WebVTT (VTT)'],
        rows: [
          ['Phần mở rộng tệp', '.srt', '.vtt'],
          ['Dòng đầu tiên', 'Con số 1', 'Từ WEBVTT'],
          ['Định dạng thời gian', '00:00:01,000 (dấu phẩy)', '00:00:01.000 (dấu chấm)'],
          ['Số thứ tự đoạn', 'Bắt buộc', 'Tùy chọn (có thể dùng tên)'],
          [
            'Vị trí trên màn hình',
            'Không có trong định dạng',
            'Thiết lập cho đoạn: line, position, align, size',
          ],
          [
            'Kiểu chữ và thẻ người nói',
            'Chỉ có thẻ cơ bản, mức hỗ trợ tùy trình phát',
            'Được định nghĩa trong đặc tả, cộng thêm định dạng CSS',
          ],
          ['Chú thích', 'Không có', 'Khối NOTE'],
          ['Phần tử video của trang web', 'Không được chấp nhận', 'Định dạng bắt buộc'],
          ['Đặc tả chính thức', 'Không có (một định dạng thực tế)', 'Đặc tả của W3C'],
        ],
      },
      after: [
        'Nói đơn giản: SRT là tệp đơn giản hơn với phạm vi rộng hơn, VTT là tệp phong phú hơn với môi trường hẹp hơn nhưng hiện đại hơn. Với phụ đề lời nói thông thường, chữ trên màn hình trông giống nhau dù dùng định dạng nào.',
      ],
    },
    {
      title: 'Mỗi định dạng được chấp nhận ở đâu',
      paragraphs: [
        'Mức hỗ trợ thay đổi theo thời gian, và mỗi nền tảng diễn đạt trang trợ giúp của mình khác nhau, vì vậy hãy xem đây là gợi ý và kiểm tra trang trợ giúp hiện tại của dịch vụ bạn tải lên.',
      ],
      bullets: [
        {
          title: 'Trang web.',
          text: 'Phần tử track của thẻ video HTML cần WebVTT. Đây là nơi duy nhất mà SRT không phải là một lựa chọn.',
        },
        {
          title: 'YouTube.',
          text: 'Phần tải phụ đề lên chấp nhận SRT, và cũng chấp nhận VTT, cùng các định dạng khác. SRT là lựa chọn thường dùng.',
        },
        {
          title: 'Trình phát trên máy tính và di động.',
          text: 'VLC và hầu hết trình phát khác đọc SRT, và nhiều trình phát cũng đọc VTT. Trình phát thường nạp tệp phụ đề có cùng tên với video.',
        },
        {
          title: 'Phần mềm biên tập video.',
          text: 'Hầu hết phần mềm biên tập nhập SRT thành một track phụ đề. Một số cũng nhập được VTT. Nếu một định dạng bị từ chối, hãy thử định dạng kia.',
        },
        {
          title: 'Các nền tảng mạng xã hội và học tập khác.',
          text: 'Nhiều nơi yêu cầu SRT hoặc VTT, một vài nơi chỉ yêu cầu một trong hai. Hãy đọc trang tải lên trước khi xuất.',
        },
      ],
    },
    {
      title: 'Chuyển đổi giữa SRT và VTT bằng tay',
      paragraphs: [
        'Đổi tên tệp là chưa đủ. Một tệp tên talk.vtt mà vẫn chứa nội dung SRT sẽ bị trình duyệt từ chối, vì nó thiếu dòng tiêu đề và thời gian dùng dấu phẩy. Việc chuyển đổi mất một phút trong bất kỳ trình soạn thảo văn bản nào.',
      ],
      steps: [
        {
          title: 'SRT sang VTT, bước một',
          text: 'Thêm dòng WEBVTT ở ngay đầu tệp, theo sau là một dòng trống.',
        },
        {
          title: 'SRT sang VTT, bước hai',
          text: 'Ở mọi dòng thời gian, đổi dấu phẩy trước phần mili giây thành dấu chấm. Tìm và thay thế trên các dòng --> , hoặc theo mẫu các chữ số quanh dấu phẩy, giúp tiết kiệm thời gian.',
        },
        {
          title: 'SRT sang VTT, bước ba',
          text: 'Hãy để nguyên các con số, vì VTT cho phép chúng làm tên đoạn. Lưu ở UTF-8 với phần mở rộng .vtt.',
        },
        {
          title: 'VTT sang SRT',
          text: 'Làm ngược lại: xóa dòng tiêu đề, các khối NOTE và mọi thiết lập sau thời gian, đổi dấu chấm về dấu phẩy, bảo đảm mọi đoạn đều có số thứ tự, và lưu thành .srt.',
        },
      ],
      after: [
        'Nếu bạn đã cài ffmpeg, nó cũng chuyển đổi được tệp phụ đề: ffmpeg -i talk.srt talk.vtt biến tệp SRT thành tệp VTT, và cùng lệnh đó với tên tệp đảo ngược sẽ đi theo chiều ngược lại. Tuy vậy, cách đơn giản nhất là tải đúng định dạng bạn cần từ trang bản gỡ băng, vì cả hai đều được tạo trực tiếp từ cùng một văn bản.',
      ],
    },
    {
      title: 'Các vấn đề thường gặp và nguyên nhân',
      bullets: [
        {
          title: 'Dấu hoặc chữ cái không phải La-tinh hiện thành ký hiệu lạ.',
          text: 'Tệp không được lưu ở UTF-8. Hãy lưu lại với mã hóa đó.',
        },
        {
          title: 'Không có gì hiện trên trang web.',
          text: 'Tệp là SRT chứ không phải VTT, hoặc máy chủ gửi nó với loại sai. Tệp VTT nên được phục vụ với kiểu text/vtt, và một tệp ở tên miền khác cũng cần các thiết lập cross-origin đúng.',
        },
        {
          title: 'Phụ đề bị trễ hoặc sớm ở mọi chỗ.',
          text: 'Cả tệp bị lệch. Hầu hết trình phát và phần mềm biên tập cho phép bạn dịch phụ đề theo một khoảng thời gian cố định, dễ hơn việc sửa từng dòng.',
        },
        {
          title: 'Hai phụ đề chồng lên nhau trên màn hình.',
          text: 'Thời điểm kết thúc của một đoạn muộn hơn thời điểm bắt đầu của đoạn kế tiếp. Hãy rút ngắn đoạn trước.',
        },
        {
          title: 'Các dòng quá dài để đọc.',
          text: 'Hãy chia chúng thành hai dòng có độ dài gần bằng nhau. Khoảng 42 ký tự mỗi dòng là một quy tắc thường dùng.',
        },
      ],
    },
    {
      title: 'Cách lấy tệp SRT hoặc VTT từ video của bạn ngay tại đây',
      paragraphs: [
        'Bạn không cần tự viết định dạng nào cả. Hãy thêm tệp video hoặc âm thanh của bạn ở trang chủ, chọn ngôn ngữ được nói và để bản gỡ băng hoàn tất. Hãy đọc qua và sửa bất kỳ từ nào sai: một dòng đã chỉnh sửa giữ nguyên thời điểm bắt đầu và kết thúc, và các từ bên trong nó được dàn đều trong khoảng thời gian đó theo tỷ lệ độ dài của chúng.',
        'Sau đó mở menu tải về và chọn SRT hoặc VTT. Cả hai đều được tạo từ cùng bản gỡ băng đã chỉnh sửa, nên bạn có thể xuất một bản cho YouTube và một bản cho trang web của riêng bạn mà không phải làm lại gì. Nếu bạn muốn phụ đề tách gọn đúng ở các từ, hãy để Mốc thời gian theo từng từ luôn bật trong Tùy chọn khác.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Tôi có thể đổi tên tệp SRT thành VTT rồi dùng trên trang web của mình không?',
      answer:
        'Không. Trình duyệt từ chối một tệp .vtt không bắt đầu bằng WEBVTT, và thời gian của SRT dùng dấu phẩy ở chỗ VTT cần dấu chấm. Hãy thêm dòng tiêu đề, đổi các dấu phẩy, hoặc tải trực tiếp một tệp VTT từ trang bản gỡ băng.',
    },
    {
      question: 'Tệp SRT và VTT có khác nhau về dung lượng hay chất lượng không?',
      answer:
        'Không. Cả hai đều là tệp văn bản nhỏ và không ảnh hưởng đến chất lượng video. Khác biệt chỉ nằm ở những thứ bổ sung mà VTT có thể mô tả, như vị trí trên màn hình và kiểu chữ, và ở nơi mỗi định dạng được chấp nhận.',
    },
    {
      question: 'Phụ đề SRT có thể in đậm, in nghiêng hoặc có màu không?',
      answer:
        'Một số trình phát hiểu các thẻ cơ bản như b và i trong SRT, nhưng mức hỗ trợ không đồng đều, nên kết quả có thể khác nhau giữa các trình phát. WebVTT định nghĩa các thẻ và định dạng CSS của nó trong một đặc tả, giúp kết quả dễ đoán hơn trên web.',
    },
    {
      question: 'Tệp phụ đề nên dùng mã hóa văn bản nào?',
      answer:
        'UTF-8. Nó xử lý được mọi ngôn ngữ, và đó là thứ trình duyệt mong đợi cho WebVTT. Nếu ký tự phụ đề trông bị hỏng, gần như chắc chắn là tệp đã được lưu ở một mã hóa cũ hơn.',
    },
  ],
  links: [
    {
      label: 'Tạo phụ đề SRT',
      path: '/srt-subtitle-generator',
      note: 'Thả một video vào và tải về một tệp SRT được tạo từ lời nói trong đó.',
    },
    {
      label: 'Tạo phụ đề VTT',
      path: '/vtt-subtitle-generator',
      note: 'Tương tự, cho một tệp WebVTT dùng được với phần tử video của trang web.',
    },
    {
      label: 'Cách thêm phụ đề vào video',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Từng bước, từ bản gỡ băng đến một video hiển thị phụ đề trong YouTube, VLC hoặc phần mềm biên tập.',
    },
    {
      label: 'Tạo phụ đề YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Tạo tệp SRT cho video bạn sở hữu và tải nó lên trong YouTube Studio.',
    },
    {
      label: 'Cách có bản gỡ băng chính xác hơn',
      path: '/guides/accurate-transcripts',
      note: 'Văn bản tốt hơn nghĩa là ít phải sửa hơn trước khi bạn xuất phụ đề.',
    },
  ],
};
