import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Cách có bản gỡ băng chính xác hơn',
  lead: 'Độ chính xác phụ thuộc trước hết vào âm thanh, rồi đến ba lựa chọn nằm trong tay bạn: ngôn ngữ, mức chất lượng và gợi ý từ vựng. Bài hướng dẫn này cho thấy nên thay đổi gì trước khi ghi âm, những thiết lập nào có ích, cách phát hiện các lỗi còn sót lại, và những việc mà nhận dạng giọng nói hoàn toàn không làm được.',
  readingMinutes: 11,
  toolPath: '/video-to-text',
  toolCta: 'Chuyển video thành văn bản với thiết lập tốt nhất',
  blocks: [
    {
      title: 'Điều gì quyết định độ chính xác của một bản gỡ băng',
      paragraphs: [
        'Nhận dạng giọng nói cũng lắng nghe giống như bạn. Nếu một người nói rõ, ở gần micro, trong phòng yên tĩnh, bằng ngôn ngữ mà mô hình biết rõ, bản gỡ băng thường rất tốt. Nếu âm thanh ở xa, ồn, vang vọng hoặc đầy tiếng người, ngay cả con người cũng phải tập trung, và phần mềm mắc nhiều lỗi hơn.',
        'Điều đó cho ra một thứ tự ưu tiên đơn giản. Hãy sửa âm thanh trước, vì không công đoạn nào phía sau có thể lấy lại những từ chưa từng được thu vào. Rồi cho chương trình biết ngôn ngữ. Rồi chọn mức chất lượng phù hợp với độ khó. Rồi đưa cho nó những từ lạ mà nó không thể đoán ra. Cuối cùng, hãy kiểm tra kết quả, vì không có bản gỡ băng nào hoàn hảo.',
      ],
    },
    {
      title: 'Cải thiện chính bản ghi âm',
      paragraphs: ['Vài phút chú ý khi ghi âm có giá trị hơn bất kỳ thiết lập nào sau đó.'],
      bullets: [
        {
          title: 'Lại gần.',
          text: 'Đặt micro cách miệng người nói chừng một hai gang tay. Một chiếc điện thoại cầm sát tốt hơn một chiếc laptop đặt ở đầu kia bàn.',
        },
        {
          title: 'Chọn căn phòng yên tĩnh và mềm.',
          text: 'Rèm cửa, thảm và ghế sofa hút tiếng vang. Tường trống và những căn phòng lớn trống rỗng làm các từ dính vào nhau. Hãy tắt quạt, máy lạnh và thông báo.',
        },
        {
          title: 'Đừng để nhạc nền dưới giọng nói.',
          text: 'Nhạc nền rất khó tách khỏi lời nói. Hãy thêm nhạc sau khi gỡ băng, không phải trước.',
        },
        {
          title: 'Mỗi lúc một giọng.',
          text: 'Người nói chồng lên nhau là trường hợp khó nhất. Hãy nhờ mọi người chờ nhau nói, và dùng mỗi người một micro nếu có thể.',
        },
        {
          title: 'Đừng lo về tần số lấy mẫu.',
          text: 'Các mô hình giọng nói đọc âm thanh ở 16 kHz đơn kênh, và trang tự chuyển mọi tệp về mức đó. Tần số cao hơn hay bản trộn âm thanh vòm không giúp ích gì; điều quan trọng là khoảng cách, tiếng ồn và âm lượng.',
        },
        {
          title: 'Tránh nén quá mạnh.',
          text: 'Các tệp có bitrate rất thấp, chẳng hạn một tin nhắn thoại bị nén chặt qua đường truyền yếu, mất đi chi tiết mà mô hình cần. Hãy dùng bản ghi gốc khi bạn có.',
        },
      ],
    },
    {
      title: 'Cho nó biết ngôn ngữ',
      paragraphs: [
        'Trang có thể tự nhận diện ngôn ngữ, và với một bản ghi dài bằng tiếng Anh rõ ràng thì thường đúng. Nhưng với đoạn clip ngắn, giọng nặng và các bản ghi trộn nhiều ngôn ngữ, việc nhận diện có thể đoán sai, và một lần đoán sai làm cả bản gỡ băng kém đi. Chọn ngôn ngữ trong danh sách Ngôn ngữ chỉ mất một cú nhấp và loại bỏ rủi ro đó.',
        'Nếu trang không thể nhận ra ngôn ngữ một cách chắc chắn, nó sẽ nói vậy và yêu cầu bạn chọn ngôn ngữ mà bạn nghe thấy. Hãy làm thế rồi chạy lại. Với lời nói chuyển qua lại giữa hai ngôn ngữ, chẳng hạn tiếng Hindi và tiếng Anh, hãy chọn ngôn ngữ chính và kiểm tra các đoạn bằng ngôn ngữ còn lại.',
      ],
    },
    {
      title: 'Chọn đúng mức chất lượng',
      paragraphs: [
        'Bốn lựa chọn chất lượng chạy các cỡ khác nhau của cùng một họ mô hình. Mô hình lớn hơn mắc ít lỗi hơn với giọng vùng miền, tiếng ồn, các ngôn ngữ khác và từ hiếm, nhưng nó mất nhiều thời gian hơn và lần tải đầu nặng hơn.',
      ],
      table: {
        caption: 'Các mức chất lượng và khi nào dùng từng mức',
        head: ['Lựa chọn', 'Phù hợp nhất cho', 'Đánh đổi'],
        rows: [
          [
            'Nhanh nhất',
            'Lời nói rõ trong bản ghi yên tĩnh, bản nháp nhanh',
            'Nhiều lỗi nhất trong bốn mức khi âm thanh khó',
          ],
          [
            'Tiêu chuẩn',
            'Hầu hết video và bản ghi giọng nói (lựa chọn khởi đầu thông thường)',
            'Cân bằng tốt giữa tốc độ và độ chính xác',
          ],
          [
            'Độ chính xác cao',
            'Giọng vùng miền, tiếng ồn nền, lời nói không phải tiếng Anh',
            'Chậm hơn, bản tải lớn hơn',
          ],
          [
            'Độ chính xác cao nhất',
            'Âm thanh khó mà từng từ đều quan trọng',
            'Chậm nhất, bản tải lớn nhất',
          ],
        ],
      },
      after: [
        'Một thói quen tốt là bắt đầu với Tiêu chuẩn trên một đoạn mẫu ngắn của bản ghi, đọc nó, và chỉ nâng lên một mức nếu các lỗi làm bạn khó chịu. Trong Tùy chọn khác, bạn cũng có thể chọn từ danh sách đầy đủ các mô hình. Trên một số thiết bị, Độ chính xác cao và Độ chính xác cao nhất bị làm mờ kèm lý do, chẳng hạn "cần 8 GB" hoặc "hãy dùng máy tính cho cỡ này", vì các mô hình lớn hơn cần nhiều bộ nhớ hơn. Mỗi lựa chọn lớn hơn cũng là một lần tải đầu tiên nặng hơn, và trang hiển thị dung lượng đó trước khi bạn bắt đầu.',
      ],
    },
    {
      title: 'Dùng gợi ý từ vựng cho tên riêng và thuật ngữ',
      paragraphs: [
        'Các mô hình giọng nói biết rõ những từ thông dụng và biết kém những từ hiếm. Tên một người, một công ty, một sản phẩm, một địa danh hay một thuật ngữ chuyên môn được viết theo cách mô hình thấy khả dĩ nhất, và thường là sai. Gợi ý từ vựng trong Tùy chọn khác sinh ra để giải quyết việc này.',
        'Hãy gõ các từ lạ đúng như bạn muốn chúng được viết, ví dụ một câu như "Phỏng vấn Tiến sĩ Okafor về Kubernetes và PostgreSQL." Một dòng ngắn, tự nhiên có chứa các từ đó hiệu quả hơn một danh sách dài. Nó là tùy chọn và có thể chứa tối đa 1.000 ký tự. Trang không lưu nó vào các thiết lập được ghi nhớ của bạn, phòng khi nó chứa những tên riêng tư.',
        'Gợi ý giúp viết đúng chính tả. Nó không dạy mô hình nghe được một từ bị nói lầm bầm hoặc bị tiếng ồn che mất.',
      ],
    },
    {
      title: 'Cải thiện âm thanh và Bỏ qua khoảng lặng và nhạc',
      paragraphs: [
        'Hai công tắc trong Tùy chọn khác được bật sẵn, và với hầu hết bản ghi bạn nên để chúng bật.',
      ],
      bullets: [
        {
          title: 'Cải thiện âm thanh.',
          text: 'Lọc tiếng ù rất trầm và tiếng rít rất cao, rồi cân bằng âm lượng để người nói nhỏ tiếng không bị lấn át bởi người nói to. Nếu bản ghi nghe ổn với bạn nhưng bản gỡ băng lại lạ, hãy thử một lần với công tắc này tắt để xem bộ lọc có phải nguyên nhân không.',
        },
        {
          title: 'Bỏ qua khoảng lặng và nhạc.',
          text: 'Một bộ phát hiện giọng nói tìm những đoạn có giọng người và chỉ chuyển các đoạn đó cho mô hình. Khoảng lặng và hầu hết âm thanh không phải lời nói, như nhạc không có lời hát, không bao giờ đến được mô hình, nhờ đó ngăn được phần lớn văn bản bịa ra mà một mô hình có thể tạo khi không có gì để nghe. Nhạc có lời hát vẫn có thể lọt qua. Chỉ tắt nó nếu lời nói nhỏ bị bỏ sót.',
        },
      ],
      after: [
        'Mốc thời gian theo từng từ cũng được bật sẵn. Nó không thay đổi những từ nào được tìm thấy, nhưng cho phép phụ đề bắt đầu và kết thúc đúng theo các từ và vận hành các dấu cho biết từ nào chưa chắc chắn.',
      ],
    },
    {
      title: 'Kiểm tra kết quả: lỗi ẩn ở đâu',
      paragraphs: [
        'Khi bản gỡ băng sẵn sàng, đừng đọc nó từ đầu đến cuối ngay. Hãy tìm các dấu. Những từ mà mô hình ít chắc chắn hơn được gạch chân, với đường gạch đậm hơn cho từ kém chắc chắn nhất. Nếu cả bản gỡ băng có độ tin cậy thấp, hoặc ngôn ngữ chưa chắc chắn, trang hiển thị một thông báo kèm nút để xem lại ngôn ngữ và chất lượng.',
        'Điểm tin cậy là một gợi ý về nơi cần xem, không phải tỷ lệ chính xác, nên một từ không bị gạch chân vẫn có thể sai. Hãy dồn sự chú ý theo thứ tự này:',
      ],
      bullets: [
        {
          title: 'Tên người và địa danh.',
          text: 'Đây là những lỗi phổ biến nhất và cũng là những lỗi gây ngượng nhất.',
        },
        {
          title: 'Con số, ngày tháng và đơn vị.',
          text: 'Một con số sai làm thay đổi ý nghĩa. Hãy đối chiếu từng cái với bản ghi.',
        },
        {
          title: 'Từ nghe giống nhau.',
          text: 'Những từ như to, too và two trong tiếng Anh, hoặc các từ chỉ khác nhau ở dấu thanh, được chọn dựa trên ngữ cảnh và có thể bị nhầm lẫn.',
        },
        {
          title: 'Đoạn gần tiếng ồn hoặc có giọng nói chồng lên nhau.',
          text: 'Hãy nghe lại ở mốc thời gian đó. Nhấp vào một dòng để nhảy tới khoảnh khắc ấy.',
        },
      ],
      after: [
        'Hãy sửa những gì bạn tìm thấy ngay trong văn bản. Các chỉnh sửa của bạn được giữ trong bản gỡ băng và đi vào mọi bản xuất.',
      ],
    },
    {
      title: 'Vấn đề và cách thử',
      table: {
        caption: 'Các vấn đề thường gặp và nên thử gì trước',
        head: ['Vấn đề', 'Nên thử'],
        rows: [
          [
            'Sai ngôn ngữ, hoặc văn bản hiện sai chữ viết',
            'Tự chọn ngôn ngữ thay vì Tự động nhận diện',
          ],
          [
            'Tên người và thương hiệu bị viết sai',
            'Thêm chúng vào Gợi ý từ vựng trong Tùy chọn khác, rồi chuyển lại tệp thành văn bản từ trang chủ',
          ],
          [
            'Nhiều lỗi với giọng vùng miền hoặc âm thanh ồn',
            'Nâng lên một mức chất lượng, và để Cải thiện âm thanh luôn bật',
          ],
          [
            'Văn bản xuất hiện ở chỗ không ai nói',
            'Để Bỏ qua khoảng lặng và nhạc luôn bật; cắt bớt các đoạn dài chỉ có khoảng lặng hoặc nhạc',
          ],
          [
            'Cùng một cụm từ lặp đi lặp lại',
            'Để Dùng văn bản trước làm ngữ cảnh tắt, và thử một mức chất lượng khác',
          ],
          [
            'Hai người nói chồng lên nhau',
            'Phần mềm không sửa được: lần sau hãy ghi âm họ bằng các micro riêng',
          ],
          [
            'Bỏ sót một người nói rất nhỏ hoặc ở xa',
            'Để Cải thiện âm thanh luôn bật; nếu lời nói vẫn bị bỏ sót, hãy tắt Bỏ qua khoảng lặng và nhạc cho tệp đó',
          ],
        ],
      },
    },
    {
      title: 'Những điều nhận dạng giọng nói không làm được',
      paragraphs: [
        'Biết giới hạn giúp bạn phát hiện vấn đề sớm. Một bản gỡ băng từ bất kỳ hệ thống nhận dạng giọng nói nào, kể cả cái này, có thể chứa những điều sau.',
      ],
      bullets: [
        {
          title: 'Không có tên người nói.',
          text: 'Nó viết ra điều đã được nói, không phải ai đã nói. Hãy thêm tên bằng tay khi chỉnh sửa.',
        },
        {
          title: 'Văn bản bịa ra.',
          text: 'Khi gặp khoảng lặng, nhạc hoặc tiếng ồn, mô hình có thể tạo ra những từ trôi chảy mà không ai nói, hoặc lặp lại một cụm từ nhiều lần. Nếu bạn thấy văn bản ở chỗ bạn không nghe thấy gì, hãy xóa nó.',
        },
        {
          title: 'Từ đồng âm và từ hiếm bị sai.',
          text: 'Nó chọn từ có khả năng nhất, mà không phải lúc nào cũng đúng.',
        },
        {
          title: 'Mất từ khi nhiều người nói chồng lên nhau.',
          text: 'Lời nói chồng lên nhau thường được ghi như một giọng hoặc bị bỏ sót một phần.',
        },
        {
          title: 'Không có gì bảo đảm.',
          text: 'Với bất cứ thứ gì liên quan đến pháp lý, y tế, tài chính hoặc sẽ được xuất bản, hãy coi bản gỡ băng là bản nháp mà một người phải kiểm tra.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Mức chất lượng nào cho bản gỡ băng chính xác nhất?',
      answer:
        'Độ chính xác cao nhất thường mắc ít lỗi nhất, với Độ chính xác cao thường theo sát phía sau, rồi đến Tiêu chuẩn và Nhanh nhất. Khoảng cách này quan trọng nhất với giọng vùng miền, tiếng ồn và các ngôn ngữ khác tiếng Anh. Với lời nói tiếng Anh rõ ràng, sự khác biệt nhỏ, nên Tiêu chuẩn thường là đủ.',
    },
    {
      question: 'Micro tốt hơn có giúp nhiều hơn một thiết lập tốt hơn không?',
      answer:
        'Thường là có. Âm thanh sạch và gần cho phép một mô hình nhỏ làm tốt, trong khi âm thanh kém giới hạn cả mô hình lớn nhất. Đưa micro lại gần hơn và giảm tiếng ồn nền là cải thiện rẻ nhất bạn có thể làm.',
    },
    {
      question:
        'Tôi có nên làm sạch âm thanh trong phần mềm biên tập trước khi chuyển thành văn bản không?',
      answer:
        'Hiếm khi. Trang đã lọc tiếng ù và tiếng rít và cân bằng âm lượng khi Cải thiện âm thanh bật. Các bộ lọc khử ồn mạnh trong phần mềm biên tập có thể làm méo giọng nói và khiến việc nhận dạng tệ hơn, vì vậy hãy dùng thiết lập nhẹ nhàng hoặc không dùng.',
    },
    {
      question: 'Vì sao hai mức chất lượng cho ra văn bản khác nhau với cùng một tệp?',
      answer:
        'Chúng là các cỡ mô hình khác nhau, nên mỗi mô hình nghe và viết một đoạn khó theo cách riêng. Khi hai lần chạy không khớp nhau, hãy nghe đoạn đó ở mốc thời gian của nó, vì có lẽ đó là đoạn khó và đáng kiểm tra bằng tai.',
    },
    {
      question: 'Tôi có thể làm bản gỡ băng chính xác hơn bằng cách chỉnh sửa nó không?',
      answer:
        'Chỉnh sửa sửa lại văn bản bạn xuất; nó không huấn luyện lại mô hình. Hãy sửa tên, con số và các từ chưa rõ trong trang bản gỡ băng rồi tải bản đã sửa về. Một lần chạy mới với gợi ý từ vựng sẽ giảm bớt việc sửa ở lần sau.',
    },
  ],
  links: [
    {
      label: 'Whisper là gì?',
      path: '/guides/what-is-whisper',
      note: 'Mô hình giọng nói đứng sau các mức chất lượng, và nó mạnh hay yếu ở đâu.',
    },
    {
      label: 'Gỡ băng phỏng vấn',
      path: '/interview-transcription',
      note: 'Mẹo để gỡ băng một cuộc trò chuyện có hai giọng và nhiều tên riêng.',
    },
    {
      label: 'Chuyển bài giảng thành văn bản',
      path: '/lecture-to-text',
      note: 'Lấy ghi chú từ một bài giảng đã ghi âm, kể cả khi ngồi cuối một căn phòng lớn.',
    },
    {
      label: 'Chuyển âm thanh tiếng Hindi thành văn bản (trang bằng tiếng Anh)',
      path: '/hindi-audio-to-text',
      note: 'Việc chọn ngôn ngữ quan trọng nhất với tiếng Hindi và các thứ tiếng khác ngoài tiếng Anh.',
    },
    {
      label: 'Chuyển video thành văn bản mà không cần tải lên',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Công cụ chạy trong trình duyệt hoạt động thế nào và thiết bị bạn dùng thay đổi điều gì.',
    },
  ],
};
