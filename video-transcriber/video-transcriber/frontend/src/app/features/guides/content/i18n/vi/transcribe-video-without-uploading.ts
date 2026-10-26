import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Cách chuyển video thành văn bản mà không cần tải lên',
  lead: 'Trên transcribevid.com, việc nhận dạng giọng nói chạy ngay trong trình duyệt của bạn, nên tệp video hoặc âm thanh được đọc trên thiết bị của bạn và không bị gửi đến trang web, đến Google hay bất kỳ ai khác. Bài hướng dẫn này giải thích cách hoạt động đó, trình duyệt của bạn vẫn tải về những gì, những gì vẫn được gửi đi, và cách tự kiểm tra tất cả những điều này.',
  readingMinutes: 12,
  toolPath: '/video-to-text',
  toolCta: 'Chuyển video thành văn bản ngay trên thiết bị của bạn',
  blocks: [
    {
      title: '"Không cần tải lên" nghĩa là gì ở đây',
      paragraphs: [
        'Hầu hết dịch vụ gỡ băng trực tuyến hoạt động theo cùng một cách: bạn gửi tệp lên máy chủ của họ, một chiếc máy tính mà bạn không nhìn thấy sẽ chuyển nó thành văn bản, và bạn tải kết quả về. Bản ghi của bạn nằm trên máy của người khác trong suốt thời gian họ giữ nó.',
        'Trên transcribevid.com, việc này diễn ra theo chiều ngược lại. Chương trình nhận dạng giọng nói đến với trình duyệt của bạn, và trình duyệt chạy nó ngay trên máy tính hoặc điện thoại của bạn. Tệp media được trang bạn đang mở đọc từ ổ đĩa của bạn. Nó không bao giờ được đính kèm vào một yêu cầu gửi đến trang web, và không bao giờ được gửi đến Google, đến các công ty lưu trữ các bản tải về, hay đến bất kỳ dịch vụ giọng nói nào.',
        'Đó là lý do trang web không đặt giới hạn dung lượng hay độ dài và không có hàng đợi: không có máy chủ nào của chúng tôi làm việc, nên không có chi phí phát sinh cho mỗi tệp, và không ai xếp hàng trước bạn. Một bản ghi rất dài vẫn cần thời gian và bộ nhớ trống trên thiết bị của bạn. Đó cũng là lý do một cuộc phỏng vấn bí mật hay một video gia đình riêng tư có thể được chuyển thành văn bản mà không rời khỏi thiết bị của bạn.',
        'Bài hướng dẫn này mô tả trang web transcribevid.com. Một bản sao phần mềm mà ai đó cài trên máy chủ của riêng họ thì hoạt động khác: nó gửi tệp đến máy chủ đó qua kết nối được mã hóa và tự động xóa tệp sau đó.',
      ],
    },
    {
      title: 'Cách hoạt động, từng bước một',
      steps: [
        {
          title: 'Trang được nạp',
          text: 'Trình duyệt của bạn lấy trang và mã chương trình của nó từ transcribevid.com, được lưu trữ trên Cloudflare. Việc này giống như khi mở bất kỳ trang web nào khác.',
        },
        {
          title: 'Mô hình giọng nói được tải về một lần',
          text: 'Lần đầu bạn dùng một mức chất lượng, trình duyệt tải mô hình nhận dạng giọng nói cho mức đó từ Hugging Face, cùng với các tệp công cụ chạy nó từ jsDelivr. Chúng được giữ trong bộ nhớ đệm của trình duyệt, nên lần chuyển thành văn bản kế tiếp bắt đầu mà không phải tải lại.',
        },
        {
          title: 'Tệp của bạn được giải mã trên thiết bị của bạn',
          text: 'Các bộ giải mã âm thanh và video tích hợp sẵn của trình duyệt biến tệp thành âm thanh đơn kênh 16 kHz thuần túy, thứ mà mô hình đọc. Với một vài định dạng mà bản thân trình duyệt không mở được, chẳng hạn AVI, WMA và FLV, trang sẽ hỏi trước rồi tải về một bộ chuyển đổi khoảng 9 MB, và bộ này cũng chạy trên thiết bị của bạn.',
        },
        {
          title: 'Một worker chạy mô hình',
          text: 'Một luồng nền của trang, gọi là Web Worker, chạy mô hình để trang vẫn phản hồi mượt. Nó dùng chip đồ họa của bạn thông qua WebGPU khi trình duyệt hỗ trợ, và nếu không thì dùng bộ xử lý của bạn thông qua WebAssembly.',
        },
        {
          title: 'Văn bản hiện ra, và ở lại trong trình duyệt của bạn',
          text: 'Bản gỡ băng được tạo từng dòng với mốc thời gian. Nó được lưu trong bộ lưu trữ riêng của trình duyệt cho phiên làm việc, và các tệp SRT, VTT, TXT, Markdown, JSON và PDF bạn tải về cũng được tạo ngay trên thiết bị của bạn.',
        },
      ],
    },
    {
      title: 'Trình duyệt của bạn tải về những gì',
      paragraphs: [
        'Không tải lên không có nghĩa là không tải về. Một mô hình giọng nói là một tệp lớn, và trình duyệt của bạn phải lấy nó trước khi có thể chuyển bất cứ thứ gì thành văn bản. Đây là những gì được tải về, và từ đâu.',
      ],
      table: {
        caption: 'Những gì trang tải về, từ đâu và khi nào',
        head: ['Nội dung', 'Từ', 'Khi nào', 'Dung lượng xấp xỉ'],
        rows: [
          [
            'Trang và mã chương trình của nó',
            'transcribevid.com (Cloudflare)',
            'Mỗi lần truy cập, sau đó được lưu đệm',
            'Khoảng 200 KB',
          ],
          [
            'Mã công cụ chạy mô hình',
            'transcribevid.com',
            'Lần chuyển thành văn bản đầu tiên, sau đó được lưu đệm',
            'Dưới 1 MB',
          ],
          [
            'Môi trường chạy mô hình (ONNX Runtime, WebAssembly)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Lần chuyển thành văn bản đầu tiên, sau đó được lưu đệm',
            'Khoảng 17 đến 27 MB',
          ],
          [
            'Một mô hình nhỏ phát hiện giọng nói',
            'transcribevid.com',
            'Lần chuyển thành văn bản đầu tiên, sau đó được lưu đệm',
            'Khoảng 1,2 MB',
          ],
          [
            'Mô hình giọng nói cho mức chất lượng bạn chọn',
            'huggingface.co (Hugging Face)',
            'Một lần cho mỗi mức chất lượng, sau đó được lưu đệm',
            'Từ khoảng 40 MB đến vài GB (xem bên dưới)',
          ],
          [
            'Bộ chuyển đổi cho các định dạng trình duyệt không mở được (AVI, WMA, FLV và tương tự)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Chỉ khi tệp của bạn cần đến, và chỉ sau khi bạn đồng ý',
            'Khoảng 9 MB',
          ],
          [
            'Mô hình viết chính tả tiếng Hindi (IndicXlit)',
            'transcribevid.com',
            'Chỉ khi tiếng Hindi được viết bằng chữ La-tinh (Hinglish), sau đó được lưu đệm',
            'Khoảng 13 MB',
          ],
        ],
      },
      after: [
        'Những thứ tải về này là tệp chương trình và mô hình, không phải dữ liệu của bạn. Các công ty phân phối chúng thấy những thông tin thông thường của một yêu cầu web, chẳng hạn địa chỉ internet và trình duyệt của bạn, nhưng không bao giờ thấy media hay bản gỡ băng của bạn.',
      ],
    },
    {
      title: 'Những gì vẫn được gửi đi, nói thật lòng',
      paragraphs: [
        'Có ba thứ thực sự đến được một máy chủ, và không thứ nào là tệp hay văn bản của bạn.',
      ],
      bullets: [
        {
          title: 'Dịch vụ lưu trữ.',
          text: 'Cloudflare phân phối trang web, nên nó xử lý địa chỉ internet của bạn và các thông tin yêu cầu thông thường để cung cấp và bảo vệ trang.',
        },
        {
          title: 'Một con số tổng đang chạy.',
          text: 'Khi một lần chuyển thành văn bản hoàn tất, trình duyệt của bạn gửi một yêu cầu trống đến bộ đếm của trang, bộ đếm này cộng thêm một vào con số hiển thị ở phần đầu trang. Yêu cầu đó không mang tệp, không mang bản gỡ băng và không mang mã định danh nào. Bộ đếm được báo cáo từ trình duyệt của người truy cập và không được kiểm chứng độc lập.',
        },
        {
          title: 'Quảng cáo.',
          text: 'Trang web miễn phí vì hiển thị quảng cáo do Google AdSense cung cấp, trên các trang thông tin và bên cạnh một bản gỡ băng đã hoàn tất, không bao giờ trong lúc một tệp đang được chuyển thành văn bản. Google dùng cookie cho quảng cáo và, ở nơi luật pháp yêu cầu, sẽ xin sự đồng ý của bạn trước. Các đoạn mã quảng cáo của Google tự gửi các yêu cầu riêng đến Google, nhưng tệp và bản gỡ băng của bạn không bao giờ được gửi đến Google.',
        },
      ],
      after: [
        'Chính sách quyền riêng tư trình bày đầy đủ tất cả những điều này. Không có tài khoản, và trang không hỏi tên hay địa chỉ email của bạn.',
      ],
    },
    {
      title: 'Cách tự kiểm tra',
      paragraphs: [
        'Bạn không cần tin lời chúng tôi. Mọi trình duyệt hiện đại đều có thể cho bạn thấy một trang gửi và nhận những gì, và việc kiểm tra mất hai phút.',
      ],
      steps: [
        {
          title: 'Mở công cụ dành cho nhà phát triển',
          text: 'Trong Chrome, Edge hoặc Firefox, mở trang chủ transcribevid.com và nhấn F12 (trên máy Mac, nhấn Command, Option và I). Chọn tab Network (Mạng).',
        },
        {
          title: 'Xóa danh sách',
          text: 'Nhấn nút xóa, trông giống một vòng tròn có một đường gạch chéo, để chỉ các yêu cầu mới xuất hiện.',
        },
        {
          title: 'Bắt đầu chuyển thành văn bản',
          text: 'Thêm một tệp và nhấn Chuyển thành văn bản. Hãy để tab Network luôn hiển thị.',
        },
        {
          title: 'Quan sát những gì đi vào',
          text: 'Lần đầu, bạn sẽ thấy các bản tải về lớn từ huggingface.co và cdn.jsdelivr.net. Đó là mô hình và công cụ đang được đưa về.',
        },
        {
          title: 'Tìm những gì đi ra',
          text: 'Gõ method:POST vào ô lọc (Chrome và Edge; Firefox chấp nhận cùng bộ lọc đó). Yêu cầu POST duy nhất đến transcribevid.com phải là một yêu cầu trống đến /api/count sau khi bản gỡ băng hoàn tất. Hãy mở nó và kiểm tra phần thân yêu cầu: nó trống. Nếu trang hiển thị quảng cáo, các đoạn mã riêng của Google tự gửi yêu cầu đến Google, và không yêu cầu nào mang tệp hay bản gỡ băng của bạn. Không có gì có dung lượng gần bằng tệp của bạn rời khỏi thiết bị của bạn.',
        },
      ],
    },
    {
      title: 'Lần tải đầu tiên nặng bao nhiêu, và nhanh đến đâu?',
      paragraphs: [
        'Dung lượng phụ thuộc vào mức chất lượng và loại thiết bị. Thiết bị có WebGPU nhận một bản dựng gọn so với kích cỡ của nó, còn thiết bị dùng WebAssembly nhận một bản dựng khác. Trang cho bạn biết chính xác dung lượng tải về trước khi bắt đầu, nên bạn không bao giờ bị bất ngờ. Đây là dung lượng xấp xỉ của các tệp mô hình (con số WebGPU dành cho trình duyệt hỗ trợ shader 16 bit; các thiết bị khác nhận các bản dựng khác):',
      ],
      table: {
        caption: 'Dung lượng tải mô hình xấp xỉ ở lần đầu tiên',
        head: ['Mức chất lượng', 'Mô hình Whisper', 'Với WebGPU', 'Với WebAssembly'],
        rows: [
          ['Nhanh nhất', 'Base', 'Khoảng 146 MB', 'Khoảng 77 MB'],
          ['Tiêu chuẩn', 'Small', 'Khoảng 485 MB', 'Khoảng 249 MB'],
          ['Độ chính xác cao', 'Large v3 Turbo', 'Khoảng 564 MB', 'Khoảng 1,1 GB'],
          [
            'Độ chính xác cao nhất',
            'Large v3',
            'Khoảng 980 MB, cộng thêm khoảng 564 MB cho mốc thời gian theo từ',
            'Khoảng 1,8 GB, cộng thêm khoảng 1,1 GB cho mốc thời gian theo từ',
          ],
        ],
      },
      after: [
        'Hãy cộng thêm vài megabyte cho các tệp cấu hình của mô hình. Large v3 không có phiên bản mốc thời gian riêng, nên khi Mốc thời gian theo từng từ bật, đây là mặc định, lần chạy đầu của nó cũng tải mô hình mốc thời gian Large v3 Turbo, và trang cho bạn biết điều đó trước khi bắt đầu. Mô hình Turbo đó được giữ lại và dùng chung với mức Độ chính xác cao. Sau lần tải đầu, mô hình được đọc từ bộ nhớ đệm của trình duyệt, nên các lần chuyển thành văn bản sau bắt đầu ngay. Tốc độ sau đó phụ thuộc hoàn toàn vào thiết bị của bạn: một máy tính có chip đồ họa mạnh và WebGPU nhanh hơn nhiều so với điện thoại hay laptop cũ dùng WebAssembly.',
      ],
    },
    {
      title: 'Khi nào đây là công cụ phù hợp, và khi nào thì không',
      paragraphs: [
        'Chuyển thành văn bản trên thiết bị của chính bạn phù hợp với tài liệu riêng tư và các tệp dài. Nó không phải công cụ tốt nhất cho mọi việc.',
      ],
      bullets: [
        {
          title: 'Phù hợp cho các bản ghi bí mật.',
          text: 'Trên transcribevid.com, các cuộc phỏng vấn, cuộc họp, ghi chú y tế hay pháp lý và video cá nhân đều ở lại trên thiết bị của bạn.',
        },
        {
          title: 'Phù hợp cho các tệp dài.',
          text: 'Trên transcribevid.com không có bước tải lên để chờ và không đặt giới hạn dung lượng hay độ dài. Một bản ghi rất dài cần thời gian và bộ nhớ trống, và một trình duyệt không hỗ trợ WebCodecs có thể từ chối một tệp rất dài.',
        },
        {
          title: 'Không dành cho phụ đề trực tiếp.',
          text: 'Bản gỡ băng được tạo từ một tệp hoặc bản ghi đã hoàn tất. Nó không tạo phụ đề cho một sự kiện trực tiếp ngay khi sự kiện diễn ra.',
        },
        {
          title: 'Không dành cho tên người nói.',
          text: 'Các dòng có mốc thời gian, nhưng văn bản không cho biết ai đang nói. Bạn có thể gõ tên vào khi chỉnh sửa.',
        },
        {
          title: 'Không lý tưởng trên điện thoại yếu.',
          text: 'Điện thoại có ít bộ nhớ hơn. Trang sẽ cảnh báo bạn, và có thể tắt các mức chất lượng lớn nhất, khi thiết bị của bạn không chạy nổi chúng. Hãy cắt các bản ghi rất dài thành nhiều phần.',
        },
        {
          title: 'Không phù hợp nếu bạn không thể tải một tệp lớn dù chỉ một lần.',
          text: 'Lần dùng đầu tiên cần một kết nối đủ sức tải hàng chục hoặc hàng trăm megabyte.',
        },
      ],
    },
    {
      title: 'Xóa dữ liệu của bạn sau khi dùng',
      paragraphs: [
        'Trên transcribevid.com, các bản gỡ băng và tệp nguồn của bạn được giữ trong bộ lưu trữ của trình duyệt để trang có thể hiển thị chúng và cho bạn chỉnh sửa và xuất. Chúng bị xóa tự động khi phiên của bạn kết thúc sau một thời gian không hoạt động, hoặc ngay lập tức khi bạn nhấn Xóa dữ liệu của tôi ngay trong menu Bản gỡ băng. Dữ liệu đã xóa không thể khôi phục, vì vậy hãy xuất những gì bạn cần trước.',
        'Các mô hình giọng nói ở lại trong bộ nhớ đệm của trình duyệt để các lần chuyển thành văn bản sau diễn ra nhanh, cho đến khi bạn xóa chúng (Xóa dữ liệu của tôi ngay cũng có thể xóa cả chúng) hoặc trình duyệt xóa bộ lưu trữ của nó. Nếu bạn dùng máy tính dùng chung hoặc công cộng, hãy nhấn Xóa dữ liệu của tôi ngay trước khi rời đi, vì bất kỳ ai mở được hồ sơ trình duyệt đó đều đọc được những gì được lưu trong đó.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Có thật là tệp của tôi không bao giờ bị tải lên không?',
      answer:
        'Có, trên transcribevid.com. Việc nhận dạng chạy trong trình duyệt của bạn, và tệp của bạn được trang đọc từ chính ổ đĩa của bạn. Bạn có thể xác nhận điều đó trong tab Network của công cụ dành cho nhà phát triển: yêu cầu duy nhất gửi bất cứ thứ gì đến transcribevid.com là một yêu cầu đếm trống sau khi bản gỡ băng hoàn tất, và các đoạn mã quảng cáo của Google tự gửi các yêu cầu riêng đến Google mà không bao giờ mang tệp của bạn.',
    },
    {
      question: 'Việc chuyển thành văn bản có còn hoạt động nếu kết nối của tôi chậm không?',
      answer:
        'Phần chậm là lần tải đầu tiên của mô hình giọng nói, có thể lên tới hàng trăm megabyte. Khi nó đã được lưu trong trình duyệt của bạn, bản thân việc chuyển thành văn bản dùng thiết bị của chính bạn và không cần tốc độ mạng.',
    },
    {
      question: 'Vì sao trình duyệt của tôi tải một mô hình từ một trang web khác?',
      answer:
        'Mô hình là chương trình nhận dạng giọng nói, và nó quá lớn để đóng gói vào trang. Nó được tải từ Hugging Face, một nơi lưu trữ công khai cho các mô hình như vậy, còn công cụ chạy nó đến từ jsDelivr. Không bên nào nhận được media hay bản gỡ băng của bạn.',
    },
    {
      question: 'Chuyển thành văn bản trên thiết bị của tôi có nhanh hơn tải lên không?',
      answer:
        'Có thể, vì không có bước tải lên và không có hàng đợi, và một máy tính có WebGPU chạy rất nhanh. Trên laptop cũ hay điện thoại, cùng một công việc có thể mất nhiều thời gian hơn so với một máy chủ nhanh. Lần chạy đầu tiên cũng bao gồm lần tải mô hình một lần.',
    },
  ],
  links: [
    {
      label: 'Gỡ băng phỏng vấn',
      path: '/interview-transcription',
      note: 'Cách làm riêng tư cho các cuộc phỏng vấn nghiên cứu, báo chí và tuyển dụng.',
    },
    {
      label: 'Whisper là gì?',
      path: '/guides/what-is-whisper',
      note: 'Mô hình giọng nói mà trình duyệt của bạn chạy, giải thích bằng lời đơn giản.',
    },
    {
      label: 'Cách có bản gỡ băng chính xác hơn',
      path: '/guides/accurate-transcripts',
      note: 'Các thiết lập và thói quen cho văn bản tốt hơn, dù dùng thiết bị nào.',
    },
    {
      label: 'Chuyển video thành văn bản',
      path: '/video-to-text',
      note: 'Thêm một video và xem nó biến thành văn bản có mốc thời gian ngay trên thiết bị của bạn.',
    },
    {
      label: 'Chuyển bản ghi cuộc họp thành văn bản',
      path: '/meeting-recording-to-text',
      note: 'Biến một bản ghi Zoom, Teams hoặc Meet đã lưu thành bản gỡ băng có thể tìm kiếm.',
    },
  ],
};
