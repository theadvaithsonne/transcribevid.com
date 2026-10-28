import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Cách chuyển video thành văn bản: năm cách, và cách nào hợp với video của bạn',
  lead: 'Bạn có thể lấy lời thoại của một video dưới dạng văn bản bằng năm cách: bản chép lời mà YouTube đã có sẵn, nhập liệu bằng giọng nói, phụ đề của phần mềm biên tập video, một dịch vụ trực tuyến, hoặc một công cụ chạy ngay trên thiết bị của bạn. Chúng khác nhau về chi phí, về việc bạn có mốc thời gian ở từng dòng hay không, và về những gì chúng yêu cầu bạn làm trước. Bài hướng dẫn này nói mỗi cách làm được gì và khi nào nên chọn.',
  readingMinutes: 7,
  toolPath: '/transcribe-video-to-text',
  toolCta: 'Chuyển video thành văn bản, miễn phí và không cần tài khoản',
  blocks: [
    {
      title: 'Câu trả lời ngắn gọn',
      bullets: [
        {
          title: 'Video có trên YouTube và có phụ đề:',
          text: 'hãy mở bản chép lời ngay trên trang video. Không tốn gì và chỉ mất một phút, nhưng nó chỉ có khi video có phụ đề, và văn bản cần được đọc lại cẩn thận.',
        },
        {
          title: 'Bạn có tệp video và muốn văn bản có mốc thời gian:',
          text: 'hãy dùng một công cụ nhận tệp và trả về tệp TXT cùng tệp phụ đề. Hai cách cuối bên dưới làm được việc này.',
        },
        {
          title: 'Bạn chỉ cần vài câu trích:',
          text: 'hãy phát video và gõ, hoặc dùng nhập liệu bằng giọng nói. Với bất cứ thứ gì dài hơn vài phút thì cách này chậm hơn việc để phần mềm xử lý cả tệp.',
        },
        {
          title: 'Bạn muốn có phụ đề cho cùng video đó:',
          text: 'hãy chọn cách xuất được SRT hoặc VTT, để một lần chạy cho bạn cả bản gỡ băng lẫn phụ đề.',
        },
      ],
    },
    {
      title: 'Một bản gỡ băng tốt cần gì từ video của bạn',
      paragraphs: [
        'Mọi cách dưới đây đều làm việc từ phần âm thanh, nên chất lượng âm thanh quyết định chất lượng văn bản nhiều hơn hẳn hình ảnh. Giọng nói gần micro, mỗi lần một người, không có nhạc nền sẽ cho kết quả tốt. Căn phòng có tiếng vang, nhiều người nói chồng lên nhau hoặc nền ồn thì cách nào cũng có lỗi.',
        'Trước khi bắt đầu, hãy xác định ba điều: ngôn ngữ được nói trong video, bạn có cần mốc thời gian ở từng dòng hay không, và video dài bao lâu. Điều thứ hai cho biết bạn phải tải được những định dạng nào; điều thứ ba cho biết giới hạn miễn phí nào sẽ chặn bạn.',
      ],
    },
    {
      title: 'Cách 1: dùng bản chép lời mà YouTube đã có sẵn',
      paragraphs: [
        'Nhiều video YouTube có phụ đề, do chủ kênh viết hoặc được tạo tự động. Trên trang video, hãy mở phần mô tả: nếu có phụ đề, ở đó sẽ xuất hiện một tùy chọn để hiện bản chép lời, liệt kê văn bản kèm mốc thời gian mà bạn có thể sao chép. Nếu video là của bạn, YouTube Studio có mục Phụ đề để bạn xem lại và tải phụ đề về. YouTube thỉnh thoảng thay đổi các màn hình này, nên tên các mục có thể hơi khác.',
      ],
      after: [
        'Đây là cách nhanh nhất cho một video đã có trên YouTube. Hạn chế của nó là chỉ dùng được với liên kết đến video có phụ đề, văn bản tự động có thể khá thô với tên riêng và thuật ngữ chuyên môn, và nó không giúp gì cho tệp nằm trên máy tính hay điện thoại của bạn.',
      ],
    },
    {
      title: 'Cách 2: phát video và để nhập liệu bằng giọng nói lắng nghe',
      paragraphs: [
        'Tính năng nhập liệu bằng giọng nói trong một trình soạn thảo văn bản, chẳng hạn tùy chọn Voice typing trong menu Tools của Google Docs, ghi lại những gì micro của nó nghe thấy. Bạn phát video qua loa và nó gõ chữ.',
        'Cách này không tốn gì, nhưng nó nghe cả căn phòng chứ không chỉ video. Nó không cho bạn mốc thời gian, nó chạy theo thời gian thực nên video dài một giờ mất một giờ, và bất cứ thứ gì micro bỏ lỡ sẽ mất. Nó ổn cho một hai câu trích và là lựa chọn kém cho một bài giảng hay một cuộc phỏng vấn.',
      ],
    },
    {
      title: 'Cách 3: bật phụ đề tự động trong phần mềm biên tập video',
      paragraphs: [
        'Một số phần mềm biên tập video có thể gỡ băng lời nói của đoạn clip bạn đặt vào đó. Chẳng hạn, hướng dẫn riêng của Microsoft Clipchamp nói rằng hãy mở tab Phụ đề, bật phụ đề tự động, rồi tải phụ đề về dưới dạng tệp SRT; video cần có lời nói trong âm thanh thì cách này mới hoạt động.',
        'Cách này hữu ích khi dù sao bạn cũng đang biên tập video, vì phụ đề nằm ngay trên dòng thời gian. Với một bản gỡ băng đơn thuần thì nó tốn công hơn mức cần thiết: bạn phải nạp video vào phần mềm, và văn bản ra dưới dạng tệp phụ đề mà sau đó bạn còn phải chuyển thành tài liệu.',
      ],
    },
    {
      title: 'Cách 4: dùng một dịch vụ gỡ băng trực tuyến',
      paragraphs: [
        'Hàng chục trang web sẽ gỡ băng tệp bạn đưa. Phần lớn chỉ miễn phí đến một mức nào đó: vài phút, vài tệp, hoặc một bản xem trước yêu cầu bạn trả tiền trước khi tải về. Những điểm khác biệt quan trọng là bạn có cần tài khoản hay không, bạn được bao nhiêu phút, tệp tối đa nặng bao nhiêu, và kết quả có xuất ra được hay không.',
        'Dịch vụ là lựa chọn đúng khi bạn cần những thứ mà các công cụ đơn giản không làm: tên cho từng người nói, một bot tham gia cuộc họp, hoặc liên kết đến một video mà bạn không có dưới dạng tệp. Bài hướng dẫn của chúng tôi về giới hạn miễn phí của mười ba dịch vụ, mỗi giới hạn đều trích từ trang của chính dịch vụ đó, được liên kết bên dưới.',
      ],
    },
    {
      title: 'Cách 5: gỡ băng tệp bằng TranscribeVid',
      paragraphs: [
        'TranscribeVid nhận chính tệp video, không cần tài khoản và không đếm số lần mỗi ngày. Nó chạy Whisper, một mô hình giọng nói mã nguồn mở, và trả lại văn bản với mốc thời gian ở từng dòng.',
        'Nó không nhận liên kết, không gắn nhãn ai đang nói, và không tham gia cuộc họp. Với những việc đó, hãy dùng một dịch vụ ở Cách 4.',
      ],
      browser: {
        paragraphs: [
          'TranscribeVid nhận chính tệp video, không cần tài khoản, không đếm số lần mỗi ngày và không giới hạn dung lượng. Nó chạy Whisper, một mô hình giọng nói mã nguồn mở, ngay trong trình duyệt của bạn, nên video ở lại trên thiết bị, và văn bản trả về với mốc thời gian ở từng dòng.',
          'Nó không nhận liên kết, không gắn nhãn ai đang nói, và không tham gia cuộc họp. Với những việc đó, hãy dùng một dịch vụ ở Cách 4. Vì chính thiết bị của bạn làm việc, một video dài sẽ chậm hơn trên điện thoại cũ so với trên laptop đời mới.',
        ],
      },
      steps: [
        { title: 'Thêm video', text: 'Thả tệp vào khung trên trang công cụ, hoặc bấm Chọn tệp. MP4, MOV, MKV, WEBM và hầu hết các tệp video khác đều dùng được, tệp âm thanh cũng vậy.' },
        { title: 'Chọn ngôn ngữ và chất lượng', text: 'Chọn ngôn ngữ được nói nếu bạn biết. Tiêu chuẩn phù hợp với hầu hết video; hãy chọn Độ chính xác cao hoặc Độ chính xác cao nhất cho giọng vùng miền, tiếng ồn hoặc tiếng Hindi.' },
        { title: 'Chờ văn bản hiện ra', text: 'Các dòng hiện ra lần lượt, cùng thanh tiến độ và thời gian còn lại.' },
        { title: 'Chỉnh sửa và tải về', text: 'Sửa bất kỳ dòng nào trong trình chỉnh sửa, rồi tải TXT, SRT, VTT, PDF, Markdown hoặc JSON. Hãy tải về những gì bạn muốn giữ trước khi rời đi.' },
      ],
    },
    {
      title: 'Cách nào cho video nào',
      table: {
        caption: 'Năm cách đặt cạnh nhau, như được mô tả trong bài hướng dẫn này',
        head: ['Cách', 'Chi phí', 'Mốc thời gian ở mỗi dòng', 'Dùng được với', 'Phù hợp nhất cho'],
        rows: [
          ['Bản chép lời YouTube', 'Miễn phí', 'Có', 'Video YouTube có phụ đề', 'Sao chép nhanh từ video đã có trên mạng'],
          ['Nhập liệu bằng giọng nói', 'Miễn phí', 'Không', 'Bất cứ thứ gì bạn có thể phát thành tiếng', 'Vài câu trích'],
          ['Phụ đề trong phần mềm biên tập', 'Tùy phần mềm', 'Có, dưới dạng phụ đề', 'Một clip đã nạp vào phần mềm', 'Video mà dù sao bạn cũng đang biên tập'],
          ['Dịch vụ trực tuyến', 'Miễn phí đến một giới hạn, sau đó trả phí', 'Thường là có', 'Tệp, và đôi khi là liên kết', 'Tên người nói, cuộc họp, liên kết'],
          ['TranscribeVid', 'Miễn phí', 'Có', 'Một tệp video hoặc âm thanh', 'Một tệp, nhận lại TXT và tệp phụ đề'],
        ],
      },
    },
    {
      title: 'Sửa văn bản trước khi dùng',
      paragraphs: [
        'Dù chọn cách nào, hãy đọc kết quả một lần trong khi phát video. Nhận dạng giọng nói làm đúng các từ thông dụng và vấp ở những thứ quan trọng nhất với bạn: tên riêng, từ về sản phẩm, con số và bất cứ điều gì được nói nhanh.',
      ],
      bullets: [
        { title: 'Tên và thuật ngữ.', text: 'Tìm trong văn bản từng cái tên bạn biết có trong video và sửa mọi chỗ nó xuất hiện.' },
        { title: 'Con số và ngày tháng.', text: 'Đối chiếu từng cái với video; một chữ số sai rất dễ bị bỏ sót.' },
        { title: 'Chỗ đổi người nói.', text: 'Thêm một dòng ngắt và một cái tên, vì bản gỡ băng thuần không đánh dấu ai đang nói.' },
        { title: 'Phụ đề.', text: 'Nếu bạn sẽ dùng tệp SRT hoặc VTT, hãy giữ mỗi dòng đủ ngắn để đọc kịp trong thời gian nó hiện trên màn hình.' },
      ],
      after: [
        'Để có danh sách thói quen dài hơn giúp giảm lỗi trước khi bắt đầu, hãy xem bài hướng dẫn về cách có bản gỡ băng chính xác hơn.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Tôi có thể chuyển video thành văn bản mà không cài đặt gì không?',
      answer: 'Có. Bản chép lời YouTube, một dịch vụ trực tuyến và TranscribeVid đều chạy trong trình duyệt web. Chỉ phần mềm biên tập video hoặc chương trình máy tính mới cần cài đặt.',
    },
    {
      question: 'Cách nhanh nhất để gỡ băng một video dài một giờ là gì?',
      answer: 'Nếu video có trên YouTube kèm phụ đề thì bản chép lời ở đó có ngay lập tức. Với một tệp, phần mềm nhanh hơn nhiều so với gõ tay hay nhập liệu bằng giọng nói, vì hai cách này đều mất ít nhất bằng thời lượng video. Phần mềm mất bao lâu tùy vào công cụ, mức chất lượng và, nếu nó chạy trên thiết bị của bạn, tốc độ của thiết bị đó.',
    },
    {
      question: 'Tôi có phải tách âm thanh ra khỏi video trước không?',
      answer: 'Không. Các công cụ nhận tệp video tự đọc phần âm thanh, nên bạn có thể thêm tệp MP4 hoặc MOV nguyên trạng. Tách âm thanh trước chỉ có ích khi một công cụ từ chối định dạng video.',
    },
    {
      question: 'Làm sao để có văn bản với mốc thời gian ở từng dòng?',
      answer: 'Hãy dùng cách xuất được phụ đề hoặc bản gỡ băng có mốc thời gian: bản chép lời YouTube liệt kê thời điểm, và công cụ tải được SRT hoặc VTT cho mỗi dòng một thời điểm bắt đầu và kết thúc. Nhập liệu bằng giọng nói thì không có.',
    },
  ],
  links: [
    {
      label: 'So sánh các công cụ chuyển video thành văn bản miễn phí',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Giới hạn miễn phí của mười ba công cụ trực tuyến, mỗi giới hạn trích từ trang của chính công cụ đó.',
    },
    {
      label: 'Cách có bản gỡ băng chính xác hơn',
      path: '/guides/accurate-transcripts',
      note: 'Thói quen và thiết lập giúp giảm sai sót với mọi video.',
    },
    {
      label: 'Tạo phụ đề cho video của bạn',
      path: '/srt-subtitle-generator',
      note: 'Biến cùng video đó thành tệp SRT cho trình phát và phần mềm biên tập.',
    },
    {
      label: 'Gỡ băng video mà không cần tải lên',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Cách công việc diễn ra ngay trên thiết bị của bạn và cách tự kiểm tra.',
    },
  ],
};
