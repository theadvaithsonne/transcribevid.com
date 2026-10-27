/** Vietnamese dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
export const PAGES: readonly string[] = [
  '/',
  '/how-it-works',
  '/faq',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/tools',
  '/guides',
];

const dict: Record<string, string> = {
  '.': '.',
  '"{name}" is {size}; the limit is {limit}.':
    '“{name}” có dung lượng {size}; giới hạn là {limit}.',
  '"{name}" is empty.': '“{name}” là tệp trống.',
  '"{name}" is ready. Press Transcribe to start.':
    '“{name}” đã sẵn sàng. Nhấn Chuyển thành văn bản để bắt đầu.',
  '“{title}” was deleted.': 'Đã xóa “{title}”.',
  '(optional)': '(không bắt buộc)',
  '{base} Word timing: {timing}.': '{base} Mốc thời gian theo từng từ: {timing}.',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand} ({domain}) do **{name}**, {address}, vận hành (“chúng tôi”). Chúng tôi quyết định cách thức và lý do dữ liệu của bạn được xử lý, như mô tả tại đây.',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand} ({domain}) do **{name}**, {address}, điều hành. Xem thêm tại trang [Giới thiệu](/about).',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand} là dịch vụ dành cho mọi đối tượng và không hướng đến trẻ em dưới 13 tuổi (hoặc dưới 16 tuổi tại EU nếu áp dụng).',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand} do **{name}**, {role} tại {city}, xây dựng và vận hành. Tôi tạo ra nó để mang đến cho mọi người trải nghiệm chuyển giọng nói thành văn bản tốt nhất có thể: liền mạch từ cú nhấp đầu tiên, không cần tạo tài khoản, và một giao diện gọn gàng không gây vướng víu.',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} dành cho mọi đối tượng và không hướng đến trẻ em dưới 13 tuổi.',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages). No ad is shown while a file is being transcribed or beside your transcript, and never on the privacy, terms or logs pages.':
    '{brand} miễn phí vì có hiển thị quảng cáo, do Google AdSense cung cấp. Quảng cáo chỉ xuất hiện ở các trang thông tin (Trang chủ, Cách hoạt động, Câu hỏi thường gặp và các trang công cụ). Không có quảng cáo nào hiển thị khi tệp đang được chuyển thành văn bản, cũng như bên cạnh bản gỡ băng của bạn, và không bao giờ xuất hiện ở các trang quyền riêng tư, điều khoản hay nhật ký (logs).',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    '{brand} miễn phí sử dụng. [Chính sách quyền riêng tư](/privacy) giải thích điều gì xảy ra với tệp của bạn.',
  '{brand} is funded by ads shown on its information pages (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand} được tài trợ bằng quảng cáo hiển thị trên các trang thông tin (Google AdSense). Vì chính thiết bị của bạn thực hiện việc chuyển thành văn bản nên không phát sinh chi phí máy chủ cho mỗi tệp, và đó là điều giúp dịch vụ luôn miễn phí và không giới hạn. [Chính sách quyền riêng tư](/privacy) giải thích quảng cáo sử dụng những gì và cách chọn thiết lập của bạn.',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand} chuyển giọng nói trong tệp video hoặc âm thanh thành văn bản có mốc thời gian, qua ba bước đơn giản.',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand} chuyển giọng nói trong video, tệp âm thanh và bản ghi âm thành văn bản chính xác, có mốc thời gian. Dịch vụ miễn phí, không giới hạn số tệp bạn chuyển và bạn không cần tài khoản: hãy chọn tệp ở trên, nhấn Chuyển thành văn bản rồi đọc kết quả.',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand} chuyển tệp video và âm thanh thành văn bản ngay trong trình duyệt của bạn: quá trình nhận dạng chạy trên thiết bị của bạn và tệp của bạn không được tải lên chỗ chúng tôi. Dịch vụ miễn phí và không cần tài khoản. Dịch vụ được tài trợ bằng quảng cáo trên các trang thông tin (Google AdSense; xem [Chính sách quyền riêng tư](/privacy)). Chúng tôi có thể thay đổi, hạn chế hoặc ngừng các tính năng bất cứ lúc nào.',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand} chuyển video và âm thanh thành văn bản chính xác, có mốc thời gian, hoàn toàn miễn phí. Không cần đăng ký, không cần đăng nhập và không có hình mờ: mở trang, chọn tệp và đọc bản gỡ băng của bạn.',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages, and are served by Google, which uses cookies.':
    '{brand} chuyển video và âm thanh thành văn bản ngay trong trình duyệt của bạn. Trang này giải thích bằng ngôn từ đơn giản điều đó có ý nghĩa gì với dữ liệu của bạn. Tóm lại: Tệp của bạn không bao giờ rời khỏi thiết bị. Bản gỡ băng của bạn chỉ được lưu trong trình duyệt này, không có tài khoản và trang web không tự đặt cookie. Quảng cáo chỉ xuất hiện ở các trang thông tin, do Google cung cấp và Google sử dụng cookie.',
  '{done} of {total}': '{done}/{total}',
  '{duration} (estimate)': '{duration} (ước tính)',
  '{gb} GB of memory recommended': 'Khuyến nghị {gb} GB bộ nhớ',
  '{h} h': '{h} giờ',
  '{h} h {m} min': '{h} giờ {m} phút',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)': '{label} (lần dùng đầu tải {size} MB)',
  "{label}, as reported by visitors' browsers":
    '{label}, theo báo cáo từ trình duyệt của người truy cập',
  '{label}: common questions': '{label}: câu hỏi thường gặp',
  '{label}. {title}.': '{label}. {title}.',
  '{label}. Look for it in your downloads.': '{label}. Hãy tìm trong thư mục tải xuống của bạn.',
  '{language} → English': '{language} → tiếng Anh',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} Đã xếp hàng {done}/{total} tệp; {left} tệp còn lại vẫn nằm trong danh sách, hãy nhấn Chuyển thành văn bản để thử lại.',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} Đã xếp hàng {done}/{total} tệp; {left} tệp còn lại vẫn nằm trong danh sách, hãy nhấn Chuyển thành văn bản để thử lại.',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '{model} chạy chậm hơn thời gian thực trên thiết bị này: {wait} cho {audio} âm thanh (ước tính). Tiny hoặc Base sẽ xong sớm hơn.',
  '{n} files were skipped: not video or audio.':
    'Đã bỏ qua {n} tệp: không phải video hoặc âm thanh.',
  '{n} h ago': '{n} giờ trước',
  '{n} min': '{n} phút',
  '{n} min ago': '{n} phút trước',
  '{n} min left': 'còn {n} phút',
  '{n} min read': 'Đọc trong {n} phút',
  '{n} minute': '{n} phút',
  '{n} minutes': '{n} phút',
  '{n} of {total}': '{n}/{total}',
  '{n} of those files are already in the list.': '{n} trong số các tệp đó đã có trong danh sách.',
  '{n} video transcribed': '{n} video đã chuyển thành văn bản',
  '{n} videos transcribed': '{n} video đã chuyển thành văn bản',
  '{n} words': '{n} từ',
  '{n}% done': 'Hoàn thành {n}%',
  '{n}% model confidence': 'Độ tin cậy của mô hình {n}%',
  '{n}s left': 'còn {n} giây',
  '{name} home': 'Trang chủ {name}',
  '{size} download': 'Tải xuống {size}',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}.',
  '{title}. {blurb}': '{title}. {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}. {blurb} Không khả dụng trên thiết bị này: {reason}.',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**Nhật ký kỹ thuật trong thẻ này.** Trang Nhật ký (Logs) hiển thị nhật ký kỹ thuật của chính thẻ này. Nhật ký chỉ nằm trong trình duyệt của bạn và không bao giờ được gửi đi đâu.',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**Thêm gợi ý từ vựng**: tên riêng, thương hiệu và thuật ngữ xuất hiện trong âm thanh, viết đúng theo cách bạn muốn.',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**Thêm gợi ý từ vựng**: tên riêng, thương hiệu và thuật ngữ, viết đúng theo cách bạn muốn.',
  '**Ads.** Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript.':
    '**Quảng cáo.** Quảng cáo chỉ xuất hiện ở các trang thông tin, do Google cung cấp và Google sử dụng cookie. Không có quảng cáo nào hiển thị khi tệp đang được chuyển thành văn bản, cũng như bên cạnh bản gỡ băng của bạn.',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**Kiểm tra các dòng được đánh dấu** và sửa chúng trong trình chỉnh sửa bản gỡ băng.',
  '**Choose the spoken language** instead of auto-detect.':
    '**Chọn ngôn ngữ nói** thay vì tự động nhận diện.',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**Chọn tệp của bạn.** Thả tệp video hoặc âm thanh vào phía trên, chọn một tệp từ thiết bị hoặc ghi âm giọng nói bằng micro. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG và hầu hết các định dạng phổ biến khác đều dùng được.',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**Cải thiện âm thanh** — lọc tiếng ù và tiếng xì, cân bằng giọng nói nhỏ',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**Giới hạn tệp.** Chúng tôi không đặt giới hạn nào. Tệp của bạn được xử lý trên thiết bị của bạn, nên tệp rất lớn hoặc rất dài sẽ mất nhiều thời gian hơn và cần đủ bộ nhớ trống; trang sẽ cảnh báo bạn trên thiết bị yếu hơn.',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**Loại tệp.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS và MTS. Âm thanh: MP3, WAV, M4A, AAC, FLAC, OGG và OPUS. Bạn cũng có thể ghi âm trực tiếp từ micro.',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**Cookie của Google.** Google đặt cookie riêng khi quảng cáo tải, chỉ trên các trang có hiển thị quảng cáo (xem mục 6).',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**Bài giảng và podcast** được chuyển thành văn bản dễ đọc để học tập hoặc làm ghi chú chương trình.',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**Giới hạn.** Hiện máy chủ không công bố giới hạn dung lượng hay độ dài nào. Tệp rất lớn chỉ đơn giản là mất nhiều thời gian hơn.',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**Giới hạn.** Chúng tôi không đặt giới hạn dung lượng hay độ dài: tệp của bạn được xử lý trên thiết bị của bạn, nên tệp rất lớn hoặc rất dài chỉ đơn giản là mất nhiều thời gian hơn và cần đủ bộ nhớ trống. Trên thiết bị yếu hơn, trang sẽ thông báo cho bạn trước khi bắt đầu và ước tính thời gian.',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**Phương tiện bạn thêm.** Các tệp video hoặc âm thanh bạn chọn hoặc ghi âm. Chúng được xử lý trong trình duyệt trên thiết bị của bạn (dùng WebGPU hoặc WebAssembly). Tệp của bạn không bao giờ được tải lên máy chủ của chúng tôi và không bao giờ được gửi cho Google hay bất kỳ ai khác.',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**Ghi chú cuộc họp và phỏng vấn** mà bạn có thể tìm kiếm, trích dẫn và chia sẻ.',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**Sai sót vẫn có thể xảy ra.** Không có hệ thống nhận dạng giọng nói nào hoàn hảo. Luôn kiểm tra lại bản gỡ băng trước khi dựa vào nó cho bất cứ việc quan trọng nào.',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**Không có cookie của riêng chúng tôi.** Bản thân trang web không đặt cookie nào.',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Không có gì được lưu lại cho lần sau.** Tệp và bản gỡ băng chỉ tồn tại trong phiên của bạn. Hãy xuất những gì bạn cần trước khi rời đi. Chi tiết có trong [Chính sách quyền riêng tư](/privacy).',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Không có gì được lưu lại cho lần sau.** Bản gỡ băng và tệp chỉ nằm trong trình duyệt này và tự động bị xóa sau {idle} không hoạt động, hoặc khi bạn nhấn **Xóa dữ liệu của tôi ngay**. Hãy xuất những gì bạn cần trước khi rời đi. Chi tiết có trong [Chính sách quyền riêng tư](/privacy).',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**Không có gì được lưu lại cho lần sau.** Bản gỡ băng chỉ tồn tại trong phiên này, vì vậy hãy xuất những gì bạn cần. [Chính sách quyền riêng tư](/privacy) mô tả trang web được lưu trữ.',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**Một con số tổng cộng.** Khi quá trình chuyển thành văn bản hoàn tất, trình duyệt của bạn gửi một dấu “+1” ẩn danh đến bộ đếm của chúng tôi (một Cloudflare Worker). Dấu này không kèm tệp, bản gỡ băng hay mã định danh nào. Cloudflare thấy địa chỉ IP của bạn khi truyền và dùng nó trong thời gian ngắn để hạn chế lạm dụng (giới hạn tốc độ); chúng tôi chỉ lưu tổng số. Con số hiển thị ở đầu trang do trình duyệt của người truy cập báo cáo và chưa được xác minh.',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    '**Chọn Độ chính xác cao hoặc Độ chính xác cao nhất** cho âm thanh khó nghe.',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**Chọn chất lượng và ngôn ngữ.** Mô hình nhanh hơn cho bản nháp nhanh; mô hình chính xác hơn phù hợp hơn cho phỏng vấn, bài giảng và phụ đề. Ngôn ngữ nói có thể được tự động nhận diện và hỗ trợ hơn 50 ngôn ngữ.',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    '**Chuyển lại thành văn bản** bản gỡ băng đã hoàn thành với chất lượng hoặc ngôn ngữ khác; bản gỡ băng hiện tại của bạn vẫn được giữ.',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    '**Chuyển lại thành văn bản** với chất lượng hoặc ngôn ngữ khác; bản gỡ băng hiện tại của bạn vẫn được giữ.',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**Đọc, sửa và tải xuống.** Bản gỡ băng xuất hiện kèm mốc thời gian, và những từ mô hình chưa chắc chắn được đánh dấu để bạn kiểm tra. Tải xuống dưới dạng văn bản thuần, phụ đề SRT hoặc VTT, Markdown hoặc JSON.',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**Các yêu cầu phân phối trang web.** Cloudflare (Cloudflare Pages) phân phối trang web này. Với vai trò nhà cung cấp lưu trữ và mạng của chúng tôi, Cloudflare xử lý địa chỉ IP của bạn và dữ liệu yêu cầu thông thường (như thời gian, trang được yêu cầu và trình duyệt của bạn) để phân phối và bảo vệ trang.',
  '**Skip silence & music** — prevents made-up text':
    '**Bỏ qua khoảng lặng và nhạc** — tránh văn bản bịa đặt',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**Mô hình giọng nói được giữ trong bộ nhớ đệm của trình duyệt** (Cache Storage), nên lần chuyển tiếp theo bắt đầu nhanh hơn, cho đến khi bạn xóa chúng (**Xóa dữ liệu của tôi ngay** cũng có thể xóa chúng) hoặc trình duyệt xóa bộ nhớ của nó. Chúng là tệp chương trình, không phải dữ liệu của bạn.',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**Tốc độ.** Phụ thuộc vào chất lượng bạn chọn, độ dài của tệp và mức độ bận của dịch vụ.',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**Tốc độ.** Phụ thuộc vào thiết bị của bạn, chất lượng bạn chọn và độ dài của tệp. Lần dùng đầu tiên của một mức chất lượng sẽ tải mô hình của nó một lần: trình duyệt của bạn lấy các tệp mô hình từ Hugging Face và các tệp chương trình của bộ máy từ jsDelivr, rồi giữ chúng trong bộ nhớ đệm. Hãy để tab mở trong khi nó hoạt động.',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**Bắt đầu từ âm thanh tốt**: ít tiếng ồn nền hơn, micro ở gần và mỗi lần chỉ một người nói. Hãy giữ bật “Cải thiện âm thanh”.',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**Bắt đầu từ âm thanh tốt**: ít tiếng ồn nền, micro ở gần, mỗi lần một người nói. Hãy giữ bật “Cải thiện âm thanh”.',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**Bộ nhớ trong trình duyệt của bạn.** Trình duyệt lưu bản gỡ băng và tệp của bạn (IndexedDB) cùng các mô hình giọng nói (Cache Storage) như mô tả ở trên, ghi nhớ lựa chọn giao diện sáng hoặc tối, và bộ nhớ phiên của nó giữ một vài thiết lập tiện lợi cho thẻ hiện tại (chẳng hạn lựa chọn chất lượng gần nhất của bạn). Không có gì trong số này được gửi cho chúng tôi.',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    '**Phụ đề** cho video, reels và khóa học trực tuyến của riêng bạn, từ tệp SRT hoặc VTT.',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**Văn bản được tạo trên thiết bị của bạn.** Bản gỡ băng, các mốc thời gian và chỉnh sửa của bạn, tiêu đề bạn chọn và các thiết lập bạn đặt (chất lượng, ngôn ngữ, gợi ý từ vựng). Chúng được tạo và lưu trong trình duyệt này; chúng tôi không bao giờ nhận được chúng.',
  '**Use previous text as context** — can repeat on long files':
    '**Dùng văn bản trước làm ngữ cảnh** — có thể bị lặp ở tệp dài',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**Ghi chú thoại** được chép thành chữ, để bạn không phải nghe lại.',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**Vì sao kết quả có thể khác nhau giữa các lần chạy, mức chất lượng hoặc công cụ khác?** Nhận dạng giọng nói mang tính xác suất: hệ thống chọn những từ có khả năng nhất, và ở những đoạn nhiễu hoặc mơ hồ, nhiều đáp án gần như ngang nhau. Mức chất lượng, thiết lập ngôn ngữ, gợi ý từ vựng hoặc việc làm sạch âm thanh khác nhau có thể thay đổi văn bản, và một công cụ khác dùng hệ thống khác cũng vậy. Tên hoặc nhãn người nói không được thêm vào.',
  '**Word-level timing** — better subtitles and confidence marks':
    '**Mốc thời gian theo từng từ** — phụ đề tốt hơn và dấu độ tin cậy',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**Tệp và bản gỡ băng của bạn nằm trong trình duyệt này.** Bản gỡ băng, các chỉnh sửa và tệp nguồn chỉ được lưu trong bộ nhớ (IndexedDB) của trình duyệt này. Chúng tự động bị xóa khi phiên của bạn kết thúc, tức là sau {idle} không hoạt động, hoặc ngay lập tức khi bạn nhấn **Xóa dữ liệu của tôi ngay** trong menu Bản gỡ băng.',
  '1 file was skipped: not video or audio.': 'Đã bỏ qua 1 tệp: không phải video hoặc âm thanh.',
  '1 minute': '1 phút',
  '1 word': '1 từ',
  '1. Agreement': '1. Thỏa thuận',
  '1. Who runs this website': '1. Ai vận hành trang web này',
  '10. Children': '10. Trẻ em',
  '10. Termination': '10. Chấm dứt',
  '11. Children': '11. Trẻ em',
  '11. Your rights and choices': '11. Quyền và lựa chọn của bạn',
  '12. Changes': '12. Thay đổi',
  '12. Open-source components': '12. Thành phần mã nguồn mở',
  '13. Changes to this policy': '13. Thay đổi đối với chính sách này',
  '13. Governing law': '13. Luật áp dụng',
  '14. Contact': '14. Liên hệ',
  '2. The service': '2. Dịch vụ',
  '2. What is processed, and where': '2. Những gì được xử lý và ở đâu',
  '3 simple steps': '3 bước đơn giản',
  '3. Why it is processed': '3. Vì sao dữ liệu được xử lý',
  '3. Your content': '3. Nội dung của bạn',
  '4. Acceptable use': '4. Sử dụng hợp lệ',
  '4. How long it is kept': '4. Dữ liệu được giữ trong bao lâu',
  '5. Downloads your browser makes': '5. Những gì trình duyệt của bạn tải xuống',
  '5. Limits: your device does the work': '5. Giới hạn: thiết bị của bạn thực hiện công việc',
  '6. Accuracy: no warranty': '6. Độ chính xác: không bảo đảm',
  '6. Advertising': '6. Quảng cáo',
  '7. Availability': '7. Tính khả dụng',
  '7. Cookies and browser storage': '7. Cookie và bộ nhớ trình duyệt',
  '8. Sharing': '8. Chia sẻ',
  '8. Third-party downloads and ads': '8. Tải xuống và quảng cáo của bên thứ ba',
  '9. Liability': '9. Trách nhiệm pháp lý',
  '9. Security': '9. Bảo mật',
  'A name cannot be empty, so the old name was kept.': 'Tên không được để trống nên đã giữ tên cũ.',
  'A new transcript has started. The old one is kept in your list.':
    'Bản gỡ băng mới đã bắt đầu. Bản cũ vẫn được giữ trong danh sách của bạn.',
  'a period': 'một khoảng thời gian',
  About: 'Giới thiệu',
  'About {brand}': 'Giới thiệu về {brand}',
  'about {h} h': 'khoảng {h} giờ',
  'about {h} h {m} min': 'khoảng {h} giờ {m} phút',
  'about {n} min': 'khoảng {n} phút',
  'Accurate text': 'Văn bản chính xác',
  'Add another file': 'Thêm tệp khác',
  'Add your file': 'Thêm tệp của bạn',
  'Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    'Quảng cáo chỉ xuất hiện ở các trang thông tin, do Google cung cấp và Google sử dụng cookie. Không có quảng cáo nào hiển thị khi tệp đang được chuyển thành văn bản, cũng như bên cạnh bản gỡ băng của bạn, và trang web này không tự đặt cookie. Chi tiết có trong [Chính sách quyền riêng tư](/privacy).',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'Không tính năng nào cần đến quảng cáo: khi quảng cáo bị chặn hoặc bị từ chối, mọi thứ vẫn hoạt động như cũ.',
  'Ads keep TranscribeVid free. Everything works without them.':
    'Quảng cáo giúp TranscribeVid miễn phí. Mọi thứ vẫn hoạt động khi không có chúng.',
  Advertisement: 'Quảng cáo',
  'All free tools': 'Tất cả công cụ miễn phí',
  'All free video and audio to text tools':
    'Tất cả công cụ chuyển video và âm thanh thành văn bản miễn phí',
  'All tools': 'Tất cả công cụ',
  'All your data was deleted': 'Đã xóa toàn bộ dữ liệu của bạn',
  'Allow the microphone in your browser, or choose a file instead.':
    'Hãy cho phép micro trong trình duyệt, hoặc chọn một tệp thay thế.',
  'Already added': 'Đã thêm rồi',
  'Already finished': 'Đã hoàn thành rồi',
  'Also delete the downloaded speech models?': 'Xóa luôn các mô hình giọng nói đã tải xuống?',
  'an independent software developer': 'một nhà phát triển phần mềm độc lập',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'Đang tải lên. Hãy chờ hoàn tất trước khi thêm tệp khác.',
  'Apply style only': 'Chỉ áp dụng kiểu',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    'Áp dụng kiểu dùng kết quả nhận dạng đã lưu mà không xử lý lại âm thanh. Các dòng đã sửa được giữ nguyên.',
  'Audio works too.': 'Tệp âm thanh cũng dùng được.',
  'Automatic (IndicXlit when installed)': 'Tự động (IndicXlit khi đã cài đặt)',
  Back: 'Quay lại',
  'Basic phonetic spelling': 'Phiên âm cơ bản',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'Vì chúng tôi không giữ tài khoản và không giữ thông tin nào nhận dạng được bạn, nên thường chúng tôi không thể gắn bất kỳ dữ liệu nào với một cá nhân. Khi pháp luật trao cho bạn các quyền đối với dữ liệu cá nhân, chẳng hạn quyền truy cập, chỉnh sửa, xóa, hạn chế, phản đối và chuyển dữ liệu, hoặc quyền khiếu nại với cơ quan bảo vệ dữ liệu của bạn, bạn có thể thực hiện các quyền đó bằng cách liên hệ với chúng tôi:',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'Vì bản gỡ băng của bạn chỉ tồn tại trong trình duyệt này, hãy xuất những gì bạn cần trước khi rời đi. Dữ liệu đã xóa không thể khôi phục.',
  'Bengaluru, India': 'Bengaluru, Ấn Độ',
  'Best accuracy': 'Độ chính xác cao nhất',
  'Best accuracy, slowest': 'Độ chính xác cao nhất, chậm nhất',
  Breadcrumb: 'Đường dẫn trang',
  'By file type': 'Theo loại tệp',
  'By language': 'Theo ngôn ngữ',
  'By use': 'Theo mục đích sử dụng',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    'Khi sử dụng {brand} ({domain}), bạn đồng ý với các điều khoản này. Nếu không đồng ý, vui lòng không sử dụng dịch vụ. Dịch vụ do **{name}**, {address}, vận hành.',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'vượt qua hoặc cố vượt qua các giới hạn tốc độ hay biện pháp bảo mật của trang web hoặc bộ đếm của trang, hoặc gây cản trở hoạt động của trang hay việc sử dụng của những người truy cập khác;',
  'Can I edit the transcript?': 'Tôi có thể chỉnh sửa bản gỡ băng không?',
  "Can't reach the server.": 'Không thể kết nối với máy chủ.',
  Cancel: 'Hủy',
  'Cancel "{title}"?': 'Hủy “{title}”?',
  'Cancel {title}': 'Hủy {title}',
  'Cancellation requested': 'Đã yêu cầu hủy',
  Cancelled: 'Đã hủy',
  'Cancelling…': 'Đang hủy…',
  'Cannot reach the server': 'Không thể kết nối với máy chủ',
  'Cannot reach the server.': 'Không thể kết nối với máy chủ.',
  'Cannot reach the server. Check your connection and try again.':
    'Không thể kết nối với máy chủ. Hãy kiểm tra kết nối và thử lại.',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'Không thể kết nối với máy chủ. Hãy đảm bảo máy chủ đang chạy (npm run dev) và thử lại.',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'Sửa hoặc xóa một dòng, hoặc tìm và thay thế. Các chỉnh sửa của bạn có trong mọi tệp tải xuống.',
  'Changed in {n} lines.': 'Đã thay đổi trong {n} dòng.',
  'Check Hinglish spelling': 'Kiểm tra cách viết Hinglish',
  'Choose "Save as PDF" in the print dialog.': 'Chọn “Lưu dưới dạng PDF” trong hộp thoại in.',
  'Choose a file': 'Chọn tệp',
  'Choose a file first': 'Hãy chọn tệp trước',
  'Choose a format': 'Chọn định dạng',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'Chọn giữa mô hình nhanh hơn và chính xác hơn, tùy thiết bị của bạn và thời gian bạn có.',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'Chọn Nhanh nhất, Tiêu chuẩn, Độ chính xác cao hoặc Độ chính xác cao nhất: Nhanh nhất là nhanh nhất, Độ chính xác cao nhất ít mắc lỗi nhất.',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'Chọn ngôn ngữ nói hoặc để ở chế độ tự động nhận diện. Bạn cũng có thể dịch giọng nói sang tiếng Anh.',
  'Chosen files': 'Các tệp đã chọn',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'Giọng nói rõ, gần micro cho kết quả tốt nhất. Trong Tùy chọn khác, **Cải thiện âm thanh** và **Bỏ qua khoảng lặng và nhạc** được bật sẵn: chúng lọc tiếng ù và tiếng xì, đồng thời ngăn mô hình bịa ra văn bản trong lúc có nhạc hoặc quãng nghỉ dài, vì vậy hãy giữ bật cho các bản ghi nhiều tạp âm. Với phụ đề, hãy giữ cả **Mốc thời gian theo từng từ** để mỗi dòng bắt đầu và kết thúc đúng theo từng từ.',
  Close: 'Đóng',
  'Close menu': 'Đóng menu',
  'Close: {title}': 'Đóng: {title}',
  'Common questions': 'Câu hỏi thường gặp',
  Contact: 'Liên hệ',
  'Converting…': 'Đang chuyển đổi…',
  Copied: 'Đã sao chép',
  'Copy text': 'Sao chép văn bản',
  'Copying…': 'Đang sao chép…',
  'Could not cancel the transcript.': 'Không thể hủy bản gỡ băng.',
  'Could not change transcript style.': 'Không thể đổi kiểu bản gỡ băng.',
  'Could not copy': 'Không thể sao chép',
  'Could not delete the transcript.': 'Không thể xóa bản gỡ băng.',
  'Could not delete your data.': 'Không thể xóa dữ liệu của bạn.',
  'Could not load the text to copy.': 'Không thể tải văn bản để sao chép.',
  'Could not prepare the file. Please try again.': 'Không thể chuẩn bị tệp. Vui lòng thử lại.',
  'Could not rename the transcript.': 'Không thể đổi tên bản gỡ băng.',
  'Could not save the change.': 'Không thể lưu thay đổi.',
  'Could not start': 'Không thể bắt đầu',
  'Could not start.': 'Không thể bắt đầu.',
  Dark: 'Tối',
  Delete: 'Xóa',
  'Delete "{title}" and its transcript?': 'Xóa “{title}” và bản gỡ băng của nó?',
  'Delete "{title}"? This cannot be undone.': 'Xóa “{title}”? Không thể hoàn tác.',
  'Delete {title}': 'Xóa {title}',
  'Delete all your transcripts and the files kept in this browser now?':
    'Xóa ngay toàn bộ bản gỡ băng và các tệp được lưu trong trình duyệt này?',
  'Delete all your transcripts and uploaded files now?':
    'Xóa ngay toàn bộ bản gỡ băng và tệp đã tải lên của bạn?',
  'Delete line': 'Xóa dòng',
  'Delete my data now': 'Xóa dữ liệu của tôi ngay',
  'Delete this line from the transcript?': 'Xóa dòng này khỏi bản gỡ băng?',
  'Delete transcript': 'Xóa bản gỡ băng',
  Deleted: 'Đã xóa',
  'Detect automatically': 'Tự động nhận diện',
  'Dismiss message': 'Đóng thông báo',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3 chỉ hiểu giọng nói tiếng Anh. Hãy chọn mô hình khác để dịch.',
  Done: 'Xong',
  'Download failed': 'Tải xuống thất bại',
  'Download started': 'Đã bắt đầu tải xuống',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'Tải kết quả xuống dưới dạng văn bản thuần, phụ đề SRT hoặc VTT, Markdown hoặc JSON.',
  'Download the transcript as': 'Tải bản gỡ băng xuống dưới dạng',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'Đang tải mô hình giọng nói (chỉ lần đầu): {loaded}/{total}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    'Hãy thả tệp video hoặc âm thanh vào [trang chủ](/), hoặc ghi âm từ micro của bạn.',
  'Drop to add your file': 'Thả để thêm tệp của bạn',
  'Drop your {noun} here, or choose a file': 'Thả {noun} của bạn vào đây hoặc chọn tệp',
  'Each line with its time, like [00:12]': 'Mỗi dòng kèm thời gian, như [00:12]',
  Edit: 'Sửa',
  'Edit it right here': 'Sửa ngay tại đây',
  'Edit this line': 'Sửa dòng này',
  'Edited by you': 'Do bạn chỉnh sửa',
  'English only, very fast and accurate': 'Chỉ tiếng Anh, rất nhanh và chính xác',
  'English translation is selected in More options.':
    'Bản dịch tiếng Anh đã được chọn trong Tùy chọn khác.',
  'Enter saves · Esc cancels': 'Enter để lưu · Esc để hủy',
  'Every line has a time. Play the media from any line to hear what was said.':
    'Mỗi dòng đều có thời gian. Hãy phát tệp từ bất kỳ dòng nào để nghe lại điều đã nói.',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'Trang nào cũng làm cùng một việc: chuyển giọng nói trong tệp video hoặc âm thanh thành văn bản có mốc thời gian ở mỗi dòng, bằng hơn 50 ngôn ngữ, không cần đăng ký. Hãy chọn trang phù hợp với tệp bạn có hoặc thứ bạn muốn tạo.',
  'Experimental: compare on your audio; chunk timestamps':
    'Thử nghiệm: hãy so sánh trên âm thanh của bạn; mốc thời gian theo đoạn',
  'Experimental: larger model; chunk timestamps':
    'Thử nghiệm: mô hình lớn hơn; mốc thời gian theo đoạn',
  Export: 'Xuất',
  Failed: 'Thất bại',
  FAQ: 'Câu hỏi thường gặp',
  Fast: 'Nhanh',
  'Fast, clean audio': 'Nhanh, cho âm thanh sạch',
  Fastest: 'Nhanh nhất',
  'Fastest, rough drafts only': 'Nhanh nhất, chỉ cho bản nháp thô',
  'Fewer mistakes. Takes longer.': 'Ít lỗi hơn. Mất nhiều thời gian hơn.',
  'Fewest mistakes. Takes the longest.': 'Ít lỗi nhất. Mất nhiều thời gian nhất.',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    'Tệp “{name}” có dung lượng {size}; giới hạn là {limit} - đặt VT_MAX_UPLOAD_MB để tăng giới hạn',
  'File "{name}" is {size}; the limit is {limit}.':
    'Tệp “{name}” có dung lượng {size}; giới hạn là {limit}.',
  'file {n} of {total}': 'tệp {n}/{total}',
  'File added': 'Đã thêm tệp',
  'File limits.': 'Giới hạn tệp.',
  'File not added': 'Chưa thêm tệp',
  'File skipped': 'Đã bỏ qua tệp',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'Tệp và bản gỡ băng chỉ tồn tại trong phiên của bạn. Hãy xuất những gì bạn cần trước khi rời đi. Thứ duy nhất chúng tôi giữ lại là một tổng số ẩn danh về số tệp đã được chuyển thành văn bản trên trang (chỉ một con số, hiển thị ở đầu trang); nó không liên kết với bạn, tệp hay phiên của bạn. Chi tiết có trong [Chính sách quyền riêng tư](/privacy).',
  'Find it automatically': 'Tìm tự động',
  'first time only, also downloads the {size} MB word-timing model':
    'chỉ lần đầu, đồng thời tải mô hình mốc thời gian theo từng từ ({size} MB)',
  'First time only: downloads {size} (needs internet)':
    'Chỉ lần đầu: tải xuống {size} (cần có internet)',
  'Follow playback': 'Theo dõi phát lại',
  'Following playback': 'Đang theo dõi phát lại',
  Footer: 'Chân trang',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'Với giọng có âm sắc vùng miền hoặc lời nói pha trộn nhiều ngôn ngữ, hãy thử mức chất lượng cao hơn. Điểm tin cậy không phải là tỷ lệ phần trăm chính xác.',
  'For developers: words, times, confidence': 'Dành cho nhà phát triển: từ, thời gian, độ tin cậy',
  'For notes apps': 'Cho ứng dụng ghi chú',
  'For video players and editors': 'Cho trình phát video và phần mềm chỉnh sửa',
  'For YouTube and web video': 'Cho YouTube và video trên web',
  Free: 'Miễn phí',
  'Free tools': 'Công cụ miễn phí',
  'Free tools:': 'Công cụ miễn phí:',
  'Free video and audio to text': 'Chuyển video và âm thanh thành văn bản miễn phí',
  'Free video and audio to text, right in your browser':
    'Chuyển video và âm thanh thành văn bản miễn phí, ngay trong trình duyệt của bạn',
  'Free, unlimited, and no login needed': 'Miễn phí, không giới hạn và không cần đăng nhập',
  'Free, unlimited, no login': 'Miễn phí, không giới hạn, không cần đăng nhập',
  'Frequently asked questions': 'Câu hỏi thường gặp',
  'Get in touch': 'Liên hệ với chúng tôi',
  'Getting the speech engine ready…': 'Đang chuẩn bị công cụ nhận dạng giọng nói…',
  'Give it a new name': 'Đặt tên mới',
  'Go to the home page': 'Về trang chủ',
  'Go to Video to text': 'Đến trang Chuyển video thành văn bản',
  'Good balance (default)': 'Cân bằng tốt (mặc định)',
  'Good to know': 'Nên biết',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'Không thể tải công cụ đồng ý (consent) của Google, có thể do trình chặn quảng cáo hoặc mạng đã chặn nó. Khi không có công cụ này, sẽ không có quảng cáo hay cookie quảng cáo nào được tải.',
  Guides: 'Hướng dẫn',
  'Guides: transcripts and subtitles': 'Hướng dẫn: bản gỡ băng và phụ đề',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'Bạn có câu hỏi, phát hiện lỗi hoặc muốn đề xuất tính năng? Hãy viết cho {email}. Mọi tin nhắn đều do người xây dựng {brand} đọc, và thường bạn sẽ nhận được phản hồi trong vòng vài ngày làm việc.',
  'Helps spell uncommon words correctly.': 'Giúp viết đúng các từ ít gặp.',
  'High accuracy': 'Độ chính xác cao',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    'Độ chính xác cao (Large v3 Turbo) không được huấn luyện để dịch và có thể trả về ngôn ngữ gốc. Để dịch, hãy chọn Tiêu chuẩn hoặc Độ chính xác cao nhất.',
  'High accuracy, slower': 'Độ chính xác cao, chậm hơn',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    'Giá trị cao hơn chính xác hơn một chút nhưng chậm hơn. 5 là mặc định hợp lý.',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'Tiếng Hindi viết bằng chữ cái La-tinh, giữ nguyên các từ tiếng Anh. Các ngôn ngữ khác giữ nguyên chữ viết gốc. Hãy xem lại các từ và tên lạ.',
  'Hinglish (Roman Hindi)': 'Hinglish (tiếng Hindi viết bằng chữ La-tinh)',
  'Hinglish conversion': 'Chuyển đổi Hinglish',
  History: 'Lịch sử',
  Home: 'Trang chủ',
  'How {brand} works': 'Cách {brand} hoạt động',
  'How accurate is it?': 'Độ chính xác đến đâu?',
  'How do I get better accuracy?': 'Làm sao để có độ chính xác cao hơn?',
  'How it stays free': 'Vì sao dịch vụ luôn miễn phí',
  'How it works': 'Cách hoạt động',
  'How long does it take?': 'Mất bao lâu?',
  'How to transcribe a video to text': 'Cách chuyển video thành văn bản',
  'How to turn a video or audio file into text with {brand}':
    'Cách chuyển tệp video hoặc âm thanh thành văn bản với {brand}',
  'If it does have speech, try More › Re-transcribe with the right language.':
    'Nếu tệp có lời nói, hãy thử Thêm › Chuyển lại thành văn bản với đúng ngôn ngữ.',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'Nếu dịch vụ đang bận hoặc đã có quá nhiều bản gỡ băng đang chạy, dịch vụ sẽ yêu cầu bạn chờ và nêu lý do.',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'Nếu chúng tôi thay đổi chính sách này, phiên bản mới sẽ xuất hiện trên trang này kèm ngày “Cập nhật lần cuối” mới.',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'Tại EEA, Vương quốc Anh và Thụy Sĩ, cũng như ở một số bang của Hoa Kỳ, thông báo đồng ý đã được chứng nhận của Google sẽ hỏi lựa chọn của bạn khi quảng cáo tải.',
  'IndicXlit (trained model)': 'IndicXlit (mô hình đã huấn luyện)',
  'Is it really free and unlimited? Do I need to log in?':
    'Có thật sự miễn phí và không giới hạn không? Tôi có cần đăng nhập không?',
  'Is my data private?': 'Dữ liệu của tôi có riêng tư không?',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    'Phụ thuộc vào chất lượng bạn chọn, độ dài của tệp và mức độ bận của dịch vụ. Nhanh nhất là nhanh; Độ chính xác cao nhất mất nhiều thời gian nhất nhưng ít mắc lỗi nhất. Tiến độ và thời gian còn lại được hiển thị trực tiếp, và tệp đang chờ đến lượt sẽ hiển thị “Đang chờ trong hàng đợi”.',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'Phụ thuộc vào thiết bị của bạn, chất lượng bạn chọn và độ dài của tệp. Với chip đồ họa mạnh (WebGPU) sẽ nhanh nhất; nếu không, nó chạy trên bộ xử lý (WebAssembly) và chậm hơn. Nhanh nhất là nhanh; Độ chính xác cao nhất mất nhiều thời gian nhất nhưng ít mắc lỗi nhất. Tiến độ và thời gian còn lại được hiển thị trực tiếp.',
  'It is now called “{title}”.': 'Giờ nó có tên là “{title}”.',
  'It may have been deleted.': 'Có thể nó đã bị xóa.',
  'It was stopped before any text was found.': 'Quá trình đã dừng trước khi tìm thấy văn bản nào.',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'Dữ liệu của nó đã bị xóa, bao gồm cả bản gỡ băng này. Bản gỡ băng chỉ được giữ trong phiên đã tạo ra chúng.',
  'Job not found': 'Không tìm thấy tác vụ',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'vừa xong',
  'Just the words, in paragraphs': 'Chỉ lời nói, chia theo đoạn',
  'Keep reading': 'Đọc tiếp',
  'Keep this page open until the upload is done.': 'Hãy giữ trang này mở cho đến khi tải lên xong.',
  'Kept only for this session, then deleted automatically.':
    'Chỉ được giữ trong phiên này, sau đó tự động bị xóa.',
  Language: 'Ngôn ngữ',
  'Larger or longer files are refused before they are processed, so split them first.':
    'Tệp lớn hơn hoặc dài hơn sẽ bị từ chối trước khi xử lý, vì vậy hãy chia nhỏ chúng trước.',
  'Last updated: {date}': 'Cập nhật lần cuối: {date}',
  'Licence text': 'Văn bản giấy phép',
  Light: 'Sáng',
  'Limits.': 'Giới hạn.',
  'Line deleted': 'Đã xóa dòng',
  'Live: the text appears here as it is recognised':
    'Trực tiếp: văn bản xuất hiện tại đây khi được nhận dạng',
  'Loading model… (first use downloads it)': 'Đang tải mô hình… (lần dùng đầu sẽ tải xuống)',
  'Loading…': 'Đang tải…',
  'Long (56 letters)': 'Dài (56 ký tự)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'Câu trả lời chi tiết hơn: định dạng, phụ đề, độ chính xác và quyền riêng tư.',
  Main: 'Chính',
  'Make a new transcript of the same file. This one is kept.':
    'Tạo bản gỡ băng mới của cùng tệp này. Bản hiện tại vẫn được giữ.',
  'Make a subtitle file (SRT or VTT) from your video.':
    'Tạo tệp phụ đề (SRT hoặc VTT) từ video của bạn.',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'Menu',
  Model: 'Mô hình',
  More: 'Thêm',
  'More answers: [Frequently asked questions](/faq)':
    'Thêm câu trả lời: [Câu hỏi thường gặp](/faq)',
  'More free tools': 'Thêm công cụ miễn phí',
  'More options': 'Tùy chọn khác',
  'More than 50 languages': 'Hơn 50 ngôn ngữ',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    'Hơn 50 ngôn ngữ, gồm tiếng Anh, tiếng Tây Ban Nha, tiếng Pháp, tiếng Đức, tiếng Bồ Đào Nha, tiếng Ý, tiếng Hà Lan, tiếng Nga, tiếng Ả Rập, tiếng Hindi, tiếng Trung, tiếng Nhật và tiếng Hàn. Bạn có thể để ngôn ngữ ở chế độ tự động nhận diện hoặc tự chọn. Bạn cũng có thể dịch giọng nói sang tiếng Anh.',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'Hầu hết các trang web gỡ băng yêu cầu bạn tạo tài khoản, giới hạn số phút miễn phí, thêm hình mờ hoặc thúc ép đăng ký trả phí trước khi bạn thấy được một dòng chữ nào. {brand} làm điều ngược lại. Mọi thứ nó cung cấp đều dành cho tất cả mọi người, và trang chỉ đòi hỏi duy nhất tệp của bạn.',
  'Name not changed': 'Chưa đổi tên',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    'Tên riêng, thương hiệu và thuật ngữ trong âm thanh, ví dụ: Kubernetes, Tiến sĩ Okafor',
  'Near-best accuracy, much faster than Large':
    'Độ chính xác gần tốt nhất, nhanh hơn nhiều so với Large',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'cần hỗ trợ shader 16-bit (shader-f16) trong trình điều khiển đồ họa',
  'needs 4 GB': 'cần 4 GB',
  'needs 8 GB': 'cần 8 GB',
  'needs a graphics-capable browser (Chrome, Edge)':
    'cần trình duyệt có hỗ trợ đồ họa (Chrome, Edge)',
  'needs WebGPU': 'cần WebGPU',
  'Next match': 'Kết quả khớp tiếp theo',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'Không tài khoản, không theo dõi. Tệp của bạn chỉ được giữ trong phiên của bạn và tự động bị xóa.',
  'no estimate for this model here': 'không có ước tính cho mô hình này ở đây',
  'No login': 'Không cần đăng nhập',
  'No matches': 'Không có kết quả khớp',
  'No microphone': 'Không có micro',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'Không đăng ký, không thanh toán, không giới hạn hằng ngày. Chỉ cần thêm tệp của bạn.',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'Hiện máy chủ không công bố giới hạn dung lượng hay độ dài nào. Tệp rất lớn chỉ đơn giản là mất nhiều thời gian hơn.',
  'No speech was found in this file.': 'Không tìm thấy lời nói nào trong tệp này.',
  'No speech was transcribed.': 'Không có lời nói nào được chuyển thành văn bản.',
  'No speech was transcribed. Check the recording and the selected language.':
    'Không có lời nói nào được chuyển thành văn bản. Hãy kiểm tra bản ghi và ngôn ngữ đã chọn.',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'Không có WebGPU ở đây: các mô hình chạy trên một luồng CPU, nên các cỡ lớn hơn chậm hơn thời gian thực.',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'Không có tệp của ai khác đứng trước tệp của bạn. Nếu bạn thêm nhiều tệp, chúng được chuyển lần lượt trong thẻ của bạn, vì vậy hãy để thẻ mở cho đến khi xong.',
  'None of those are video or audio files.':
    'Không tệp nào trong số đó là tệp video hoặc âm thanh.',
  Normal: 'Bình thường',
  'not available for this size': 'không khả dụng cho cỡ này',
  'not available in this browser': 'không khả dụng trên trình duyệt này',
  'not available with Qwen (times are per chunk)':
    'không khả dụng với Qwen (mốc thời gian theo từng đoạn)',
  'Not cancelled': 'Chưa hủy',
  'Not deleted': 'Chưa xóa',
  'Not renamed': 'Chưa đổi tên',
  'Not saved': 'Chưa lưu',
  Note: 'Ghi chú',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'Chưa có gì ở đây. Các bản gỡ băng bạn tạo sẽ xuất hiện tại đây trong phiên này.',
  'Nothing is saved. Export what you need.': 'Không có gì được lưu. Hãy xuất những gì bạn cần.',
  'Nothing is uploaded until you press Transcribe.':
    'Không có gì được tải lên cho đến khi bạn nhấn Chuyển thành văn bản.',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'Không cần đăng ký và không phải trả tiền. Chỉ cần thêm tệp của bạn.',
  'Nothing was recorded.': 'Không có gì được ghi âm.',
  Off: 'Tắt',
  On: 'Bật',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'Với giọng nói rõ ràng bằng ngôn ngữ được hỗ trợ, kết quả thường rất chính xác, nhưng không hệ thống nhận dạng giọng nói nào là hoàn hảo. Độ chính xác phụ thuộc vào chất lượng âm thanh, giọng vùng miền, tiếng ồn nền, nhiều người nói chồng lên nhau, nhạc, cũng như tên riêng hiếm hoặc thuật ngữ chuyên ngành. Mỗi dòng đều có điểm tin cậy, và các dòng có độ tin cậy thấp được đánh dấu để bạn kiểm tra trước. Luôn kiểm tra lại bản gỡ băng trước khi dựa vào nó cho bất cứ việc quan trọng nào.',
  'Open menu': 'Mở menu',
  'Opening your transcript…': 'Đang mở bản gỡ băng của bạn…',
  'or drop it anywhere on this page.': 'hoặc thả nó vào bất kỳ đâu trên trang này.',
  'Original script': 'Chữ viết gốc',
  Output: 'Kết quả',
  'Page {page} of {pages}': 'Trang {page}/{pages}',
  'Page not found': 'Không tìm thấy trang',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'Các trang cho loại tệp bạn đang có: WAV, M4A, WebM và MOV.',
  'PDF document (.pdf)': 'Tài liệu PDF (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'Trình duyệt của bạn tạo PDF: hãy chọn “Lưu dưới dạng PDF” trong hộp thoại in.',
  'Pick quality': 'Chọn chất lượng',
  'Plain text (.txt)': 'Văn bản thuần (.txt)',
  'Play from here': 'Phát từ đây',
  'Playback speed': 'Tốc độ phát',
  'Please add one file at a time here. You can add more files on the next page.':
    'Vui lòng thêm từng tệp một ở đây. Bạn có thể thêm nhiều tệp hơn ở trang tiếp theo.',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'Vui lòng không gửi các bản ghi âm riêng tư. {brand} chuyển tệp của bạn thành văn bản ngay trên thiết bị của bạn và chúng tôi không bao giờ nhận được chúng, nên chúng tôi không cần chúng để giúp bạn.',
  'Please note': 'Xin lưu ý',
  Preparing: 'Đang chuẩn bị',
  'Preparing audio…': 'Đang chuẩn bị âm thanh…',
  'Preparing the audio…': 'Đang chuẩn bị âm thanh…',
  'Preparing…': 'Đang chuẩn bị…',
  'Press a question to read its answer.': 'Nhấn vào một câu hỏi để đọc câu trả lời.',
  'Previous match': 'Kết quả khớp trước đó',
  'Print to PDF': 'In ra PDF',
  Privacy: 'Quyền riêng tư',
  'Privacy and cookie settings': 'Cài đặt quyền riêng tư và cookie',
  'Privacy policy': 'Chính sách quyền riêng tư',
  'Privacy requests': 'Yêu cầu về quyền riêng tư',
  Private: 'Riêng tư',
  Progress: 'Tiến độ',
  Quality: 'Chất lượng',
  'Questions about these terms:': 'Câu hỏi về các điều khoản này:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'Câu hỏi, báo lỗi và ý tưởng luôn được chào đón. Hãy viết cho {email}, hoặc xem trang [Liên hệ](/contact) để biết cần nêu những gì.',
  Queued: 'Đang xếp hàng',
  'Quick results. Good for clear speech.': 'Kết quả nhanh. Phù hợp với giọng nói rõ.',
  Quickest: 'Nhanh nhất',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'Qwen dùng mốc thời gian theo đoạn gần đúng. Mốc thời gian theo từng từ và độ tin cậy không khả dụng.',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'Qwen dùng mốc thời gian theo đoạn và không cung cấp độ tin cậy theo từng từ. Hãy so sánh một đoạn mẫu ngắn trước khi chọn.',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (thử nghiệm)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASR cần trình duyệt máy tính để bàn có WebGPU (Chrome hoặc Edge) và hỗ trợ shader 16-bit (shader-f16) trong trình điều khiển đồ họa.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASR cần trình duyệt máy tính để bàn có WebGPU (Chrome hoặc Edge) và 8 GB bộ nhớ.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASR cần trình duyệt máy tính để bàn có WebGPU (Chrome hoặc Edge).',
  'Re-transcribe': 'Chuyển lại thành văn bản',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'Đọc bản gỡ băng có mốc thời gian, xem những từ mô hình chưa chắc chắn và sửa ngay tại chỗ.',
  'Read, edit, download': 'Đọc, sửa, tải xuống',
  Ready: 'Sẵn sàng',
  'Ready to print or share': 'Sẵn sàng để in hoặc chia sẻ',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    'Sẵn sàng thử chưa? [Xem tất cả công cụ miễn phí](/tools) hoặc [chuyển một tệp thành văn bản ngay](/).',
  'Recognition engine': 'Công cụ nhận dạng',
  Recommended: 'Khuyến nghị',
  'Record from microphone': 'Ghi âm từ micro',
  'Record straight from your microphone and turn it into text.':
    'Ghi âm trực tiếp từ micro và chuyển thành văn bản.',
  'Record with your microphone': 'Ghi âm bằng micro',
  'Recording {stamp}': 'Bản ghi âm {stamp}',
  'Recording is not supported by this browser.': 'Trình duyệt này không hỗ trợ ghi âm.',
  'Related reading': 'Bài đọc liên quan',
  Remove: 'Gỡ bỏ',
  'Remove {name}': 'Gỡ bỏ {name}',
  'Removes it for good': 'Xóa vĩnh viễn',
  Rename: 'Đổi tên',
  Renamed: 'Đã đổi tên',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    'Thay “{query}” bằng “{replacement}” trong {n} dòng?',
  'Replace "{query}" with "{replacement}" in 1 line?':
    'Thay “{query}” bằng “{replacement}” trong 1 dòng?',
  'Replace in {n} lines': 'Thay thế trong {n} dòng',
  'Replace in 1 line': 'Thay thế trong 1 dòng',
  'Replace with': 'Thay bằng',
  'Replace with…': 'Thay bằng…',
  'Replace…': 'Thay thế…',
  Replaced: 'Đã thay thế',
  'Reporting a problem': 'Báo cáo sự cố',
  'Retrying…': 'Đang thử lại…',
  'Review language and quality': 'Xem lại ngôn ngữ và chất lượng',
  'Review this transcript': 'Xem lại bản gỡ băng này',
  Save: 'Lưu',
  Saved: 'Đã lưu',
  'Saving…': 'Đang lưu…',
  'Search depth: {n}': 'Độ sâu tìm kiếm: {n}',
  'Search the text': 'Tìm trong văn bản',
  'Search the transcript': 'Tìm trong bản gỡ băng',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'Xem thêm [Điều khoản sử dụng](/terms), [Cách hoạt động](/how-it-works) và [Câu hỏi thường gặp](/faq).',
  'Server busy': 'Máy chủ đang bận',
  'Session only — nothing is saved.': 'Chỉ trong phiên — không có gì được lưu.',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'Chỉ trong phiên — không có gì được lưu. Đóng ứng dụng sẽ xóa toàn bộ bản gỡ băng. Hãy xuất những gì bạn cần.',
  'Session time left: about {n} min': 'Thời gian phiên còn lại: khoảng {n} phút',
  'Short (32 letters)': 'Ngắn (32 ký tự)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'Những câu trả lời ngắn gọn, thiết thực về việc chuyển giọng nói thành văn bản và phụ đề: nên chọn định dạng phụ đề nào, cách thêm phụ đề vào video, cách có bản gỡ băng chính xác hơn, và cách việc chuyển thành văn bản có thể chạy ngay trong trình duyệt của bạn mà không cần tải tệp lên.',
  'Show all {count} languages': 'Hiện tất cả {count} ngôn ngữ',
  'Six ways to download': 'Sáu cách tải xuống',
  'Skip to main content': 'Chuyển đến nội dung chính',
  Slower: 'Chậm hơn',
  'slower than real time on the measured laptop':
    'chậm hơn thời gian thực trên máy tính xách tay đã đo',
  Slowest: 'Chậm nhất',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'Một số tính năng tải các thành phần mã nguồn mở vào trình duyệt của bạn khi bạn sử dụng chúng. Chúng chạy trên thiết bị của bạn như phần còn lại của bộ máy. Giấy phép của chúng yêu cầu chúng tôi hiển thị các thông báo sau:',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    'Một số đoạn cần nghe lại để kiểm tra vì có văn bản lặp lại hoặc ranh giới lời nói chưa rõ ràng.',
  'Something went wrong': 'Đã xảy ra lỗi',
  'Something went wrong in this browser. Please try again.':
    'Đã xảy ra lỗi trong trình duyệt này. Vui lòng thử lại.',
  'Something went wrong while reading this file.': 'Đã xảy ra lỗi khi đọc tệp này.',
  'Source code': 'Mã nguồn',
  Speed: 'Tốc độ',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'Tốc độ trên điện thoại và máy tính bảng là ước tính, không phải đo thực tế; Tiny và Base là các cỡ an toàn.',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'SRT và VTT cho phụ đề, TXT và Markdown để đọc, JSON cho chương trình, hoặc PDF để in.',
  Standard: 'Tiêu chuẩn',
  'Standard (42 letters)': 'Tiêu chuẩn (42 ký tự)',
  Start: 'Bắt đầu',
  'Start a new transcription': 'Bắt đầu một lần chuyển thành văn bản mới',
  'Start again': 'Bắt đầu lại',
  'Started again': 'Đã bắt đầu lại',
  'Starting…': 'Đang bắt đầu…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'Vẫn còn thắc mắc? Hãy đọc [câu hỏi thường gặp](/faq), xem [cách hoạt động](/how-it-works) hoặc [liên hệ với chúng tôi](/contact).',
  'Still stuck? [Read How it works](/how-it-works)':
    'Vẫn chưa được? [Đọc Cách hoạt động](/how-it-works)',
  'Stop recording · {time}': 'Dừng ghi âm · {time}',
  'Stop this transcription? The text found so far is kept.':
    'Dừng lần chuyển thành văn bản này? Phần văn bản đã tìm được vẫn được giữ.',
  'Stopping the transcription worker. The text found so far is kept.':
    'Đang dừng tiến trình chuyển thành văn bản. Phần văn bản đã tìm được vẫn được giữ.',
  'Stored on this device only, never uploaded.':
    'Chỉ lưu trên thiết bị này, không bao giờ tải lên.',
  'Style unchanged': 'Kiểu không thay đổi',
  'Style updated': 'Đã cập nhật kiểu',
  'Style updated using the saved recognition. Edited lines are kept.':
    'Đã cập nhật kiểu bằng kết quả nhận dạng đã lưu. Các dòng đã sửa được giữ nguyên.',
  'Subtitle files': 'Tệp phụ đề',
  'Subtitle line length': 'Độ dài dòng phụ đề',
  'Subtitles (.srt)': 'Phụ đề (.srt)',
  'Switch to dark theme': 'Chuyển sang giao diện tối',
  'Switch to light theme': 'Chuyển sang giao diện sáng',
  Terms: 'Điều khoản',
  'Terms of use': 'Điều khoản sử dụng',
  'Text with times (.txt)': 'Văn bản có thời gian (.txt)',
  'That file is already in the list.': 'Tệp đó đã có trong danh sách.',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'Đó không phải tệp video hoặc âm thanh. Hãy chọn tệp MP4, MOV, MP3 hoặc tệp video hay âm thanh khác.',
  'That is not a video or audio file. Please choose a video or audio file.':
    'Đó không phải tệp video hoặc âm thanh. Vui lòng chọn tệp video hoặc âm thanh.',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'Đó không phải tệp âm thanh. Hãy chọn tệp MP3, WAV, M4A hoặc tệp âm thanh khác.',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    '[Chính sách quyền riêng tư](/privacy) giải thích những gì được xử lý và vì sao. Để đặt câu hỏi về dữ liệu của bạn hoặc thực hiện các quyền của mình, hãy viết đến cùng địa chỉ này.',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    'Mô hình {label} không thể chạy trên thiết bị này: {reason}. Hãy chọn mô hình khác.',
  'the exact error message, or a screenshot of it.':
    'thông báo lỗi chính xác, hoặc ảnh chụp màn hình của thông báo đó.',
  'The file is larger than the server accepts.': 'Tệp lớn hơn mức máy chủ chấp nhận.',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'Lần đầu bạn dùng một mức chất lượng, trình duyệt sẽ tải mô hình giọng nói của nó một lần và giữ lại cho lần sau, nên các tệp sau đó bắt đầu sớm hơn.',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'Lần đầu bạn dùng một mức chất lượng, trình duyệt tải mô hình giọng nói từ Hugging Face và các tệp chương trình của bộ máy từ jsDelivr, rồi giữ chúng cho lần sau; không có gì từ tệp của bạn được gửi kèm theo. Khi một lần chuyển thành văn bản hoàn tất, trình duyệt của bạn cộng thêm một vào bộ đếm ẩn danh ở đầu trang, và không gửi gì khác.',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'Trình điều khiển đồ họa không có shader 16-bit: dung lượng tải xuống lớn hơn và dùng nhiều bộ nhớ hơn.',
  'The line was removed.': 'Dòng đã bị gỡ bỏ.',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'Các công cụ chính: chuyển bất kỳ tệp video hoặc âm thanh nào thành bản gỡ băng có mốc thời gian.',
  'The page you are looking for does not exist or has moved.':
    'Trang bạn tìm không tồn tại hoặc đã được chuyển đi.',
  'The recording failed. Please try again.': 'Ghi âm thất bại. Vui lòng thử lại.',
  'The server does not have enough free disk space for this file.':
    'Máy chủ không đủ dung lượng đĩa trống cho tệp này.',
  'The server is busy': 'Máy chủ đang bận',
  'The server is busy right now.': 'Hiện máy chủ đang bận.',
  'The service is busy right now. Please wait a moment and try again.':
    'Hiện dịch vụ đang bận. Vui lòng chờ một lát rồi thử lại.',
  'The service is full right now. Please try again in a little while.':
    'Hiện dịch vụ đã đầy. Vui lòng thử lại sau ít phút.',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    'Quá trình nhận dạng giọng nói chạy ngay trong trình duyệt của bạn, dùng các mô hình nhận dạng giọng nói mở như OpenAI Whisper. Trình duyệt tải mô hình một lần và giữ lại, sau đó thực hiện toàn bộ công việc trên thiết bị của bạn. Video hoặc âm thanh của bạn không bao giờ được tải lên chỗ chúng tôi, và đó cũng là lý do không có giới hạn dung lượng tệp và không có hàng đợi tệp của người khác. Trang [Cách hoạt động](/how-it-works) giải thích từng bước.',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'Không thể nhận diện chắc chắn ngôn ngữ được nói. Hãy chọn ngôn ngữ bạn nghe thấy và thử lại.',
  'The text found before it was stopped is shown below.':
    'Phần văn bản tìm được trước khi dừng được hiển thị bên dưới.',
  'The text found so far is kept.': 'Phần văn bản đã tìm được vẫn được giữ.',
  'The text is ready to paste.': 'Văn bản đã sẵn sàng để dán.',
  'The transcript finished before it could be cancelled.':
    'Bản gỡ băng đã hoàn thành trước khi kịp hủy.',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'Việc chuyển thành văn bản chạy trên chính thiết bị của bạn với các mô hình nhận dạng giọng nói mở như OpenAI Whisper. Trình duyệt tải một mô hình một lần và giữ lại, nên tệp tiếp theo bắt đầu nhanh hơn, và video hoặc âm thanh của bạn không bao giờ được tải lên bất cứ đâu.',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'loại và độ dài của tệp, ví dụ “MP4, 25 phút”;',
  'There is no size or length limit set here.': 'Ở đây không đặt giới hạn dung lượng hay độ dài.',
  'These details make a problem much quicker to find and fix:':
    'Những chi tiết này giúp tìm và sửa sự cố nhanh hơn nhiều:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    'Các điều khoản này chịu sự điều chỉnh của pháp luật Ấn Độ. Tòa án tại Bengaluru, Karnataka, Ấn Độ có thẩm quyền độc quyền đối với mọi tranh chấp phát sinh từ chúng. Điều này không làm mất bất kỳ sự bảo vệ nào mà bạn có theo luật tiêu dùng bắt buộc của quốc gia nơi bạn sinh sống.',
  'They are downloaded again the next time you transcribe.':
    'Chúng sẽ được tải lại vào lần chuyển thành văn bản tiếp theo của bạn.',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'Các nhà cung cấp bên thứ ba, bao gồm Google, sử dụng cookie để phân phối quảng cáo dựa trên các lần truy cập trước đây của bạn vào trang web này hoặc các trang web khác. Việc Google sử dụng cookie quảng cáo cho phép Google và các đối tác của mình phân phối quảng cáo cho bạn dựa trên lượt truy cập của bạn vào trang này và/hoặc các trang khác trên Internet.',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'Ô này nhận các tệp âm thanh như MP3, WAV hoặc M4A, nhưng tệp đó là video.',
  'This browser cannot record. Please choose a file instead.':
    'Trình duyệt này không thể ghi âm. Vui lòng chọn một tệp thay thế.',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'Trình duyệt này không báo cáo dung lượng bộ nhớ; giả định {gb} GB. Hãy chọn mô hình nhỏ hơn nếu trang bị chậm.',
  'This cannot be undone. Export anything you want to keep first.':
    'Không thể hoàn tác. Hãy xuất mọi thứ bạn muốn giữ trước.',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    'Bản sao {brand} này chạy trên máy tính của chính bạn. Tệp của bạn được xử lý trên máy này và không có gì rời khỏi nó. Không có gì được lưu vĩnh viễn: bản gỡ băng chỉ tồn tại trong phiên này, vì vậy hãy xuất những gì bạn cần. [Chính sách quyền riêng tư](/privacy) mô tả trang web được lưu trữ.',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'Bản sao này chạy trên máy tính của chính bạn. Tệp của bạn được xử lý trên máy này và không có gì rời khỏi nó.',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'Thiết bị này có ít bộ nhớ cho một tệp dài như vậy. Tệp được xử lý theo từng phần nhỏ nên chậm hơn; cắt ngắn hơn hoặc dùng mô hình nhỏ hơn sẽ an toàn hơn.',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'Tệp này cần một bộ chuyển đổi 9 MB chạy trong trình duyệt của bạn. Tải nó không?',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'Đây là bản dịch nhằm tiện theo dõi. Nếu có điểm khác biệt so với bản tiếng Anh, bản tiếng Anh sẽ được áp dụng.',
  'This local copy does not count transcriptions':
    'Bản sao cục bộ này không đếm số lần chuyển thành văn bản',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'Bản gỡ băng này có độ tin cậy của mô hình thấp. Hãy nghe bản ghi và kiểm tra ngôn ngữ được nói trước khi dùng văn bản.',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'Việc này sẽ mất {wait} trên thiết bị này (ước tính). Hãy để tab mở cho đến khi hoàn tất.',
  Timestamps: 'Mốc thời gian',
  'Tips for the best results': 'Mẹo để có kết quả tốt nhất',
  'Tips for the best transcript': 'Mẹo để có bản gỡ băng tốt nhất',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'Để thay đổi lựa chọn quảng cáo của bạn, hãy dùng [Cài đặt quảng cáo của Google](https://adssettings.google.com) hoặc cài đặt cookie của trình duyệt.',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'Để thay đổi lựa chọn quảng cáo của bạn, hãy dùng **Cài đặt quyền riêng tư và cookie** ở cuối trang có hiển thị quảng cáo, [Cài đặt quảng cáo của Google](https://adssettings.google.com), hoặc cài đặt cookie của trình duyệt.',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'Để cung cấp cho bạn bản chuyển thành văn bản mà bạn yêu cầu ngay trên thiết bị của bạn, để phân phối trang web một cách an toàn, và để duy trì dịch vụ miễn phí nhờ quảng cáo. Khi luật bảo vệ dữ liệu như GDPR được áp dụng, cơ sở pháp lý của chúng tôi là cung cấp dịch vụ bạn đã yêu cầu (Điều 6(1)(b)), lợi ích chính đáng của chúng tôi trong việc bảo mật, ngăn chặn lạm dụng và tổng số ẩn danh (Điều 6(1)(f)), và, đối với cookie quảng cáo khi pháp luật yêu cầu, sự đồng ý của bạn (Điều 6(1)(a)), điều mà thông báo đồng ý của Google sẽ hỏi.',
  'To keep it fast for everyone, each file has a size and length limit.':
    'Để giữ tốc độ nhanh cho mọi người, mỗi tệp có giới hạn dung lượng và độ dài.',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    'Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm đối với thiệt hại gián tiếp hoặc hệ quả, mất dữ liệu, lợi nhuận hoặc hoạt động kinh doanh, hay bất kỳ tổn thất nào phát sinh từ việc bạn sử dụng hoặc không thể sử dụng dịch vụ hoặc từ các lỗi trong bản gỡ băng. Không có điều nào trong các điều khoản này giới hạn trách nhiệm mà pháp luật không cho phép giới hạn.',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'Để chuyển thành văn bản trên thiết bị của bạn, trình duyệt tải các tệp mô hình giọng nói từ Hugging Face (huggingface.co) và các tệp chương trình của bộ máy giọng nói từ jsDelivr (cdn.jsdelivr.net), rồi giữ chúng trong bộ nhớ đệm (Cache Storage) cho lần sau cho đến khi bạn xóa chúng. Các nhà cung cấp đó nhận dữ liệu yêu cầu thông thường (địa chỉ IP, trình duyệt của bạn và tệp nào được yêu cầu), không bao giờ nhận phương tiện hay bản gỡ băng của bạn.',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'Để hoạt động trên thiết bị của bạn, trình duyệt tải các mô hình giọng nói từ Hugging Face và các tệp chương trình từ jsDelivr; chúng được cung cấp theo giấy phép và điều khoản riêng. Quảng cáo do Google AdSense cung cấp; một quảng cáo dẫn đến trang web của bên thứ ba mà chúng tôi không kiểm soát và không chịu trách nhiệm.',
  Transcribe: 'Chuyển thành văn bản',
  'Transcribe (same language)': 'Chuyển thành văn bản (cùng ngôn ngữ)',
  'Transcribe {n} files': 'Chuyển {n} tệp thành văn bản',
  'Transcribe a file': 'Chuyển một tệp thành văn bản',
  'Transcribe or translate speech in the language you need.':
    'Chuyển giọng nói thành văn bản hoặc dịch giọng nói bằng ngôn ngữ bạn cần.',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    'Chuyển video, tệp âm thanh và bản ghi âm thành văn bản bằng hơn 50 ngôn ngữ, hoặc để ngôn ngữ được tự động nhận diện.',
  'Transcribing {n}%': 'Đang chuyển thành văn bản {n}%',
  'Transcribing takes {time} on this device.':
    'Việc chuyển thành văn bản mất {time} trên thiết bị này.',
  'Transcribing…': 'Đang chuyển thành văn bản…',
  '{blurb} Not sure? Keep this one.': '{blurb} Chưa chắc? Cứ giữ mức này.',
  '{reason} Retrying in {n} s…': '{reason} Thử lại sau {n} giây…',
  'Alternatives': 'Lựa chọn thay thế',
  'Checking the downloaded file…': 'Đang kiểm tra tệp đã tải xuống…',
  'Connection lost.': 'Mất kết nối.',
  'Continued after the page reloaded.': 'Đã tiếp tục sau khi trang được tải lại.',
  'Continuing the download ({size} already saved)': 'Đang tiếp tục tải xuống (đã lưu {size})',
  'Downloaded: ready to start': 'Đã tải xong: sẵn sàng bắt đầu',
  'Every language in its own script: English in English letters, Hindi in Devanagari. Choose Hinglish to write Hindi in English letters.': 'Mỗi ngôn ngữ theo chữ viết riêng của nó: tiếng Anh bằng chữ La-tinh, tiếng Hindi bằng chữ Devanagari. Chọn Hinglish để viết tiếng Hindi bằng chữ La-tinh.',
  'First time only: downloads {size}, now downloading in the background': 'Chỉ lần đầu: tải xuống {size}, hiện đang tải ở chế độ nền',
  'Getting the model ready: {loaded} of {total}': 'Đang chuẩn bị mô hình: {loaded}/{total}',
  'Good for most videos.': 'Phù hợp với hầu hết video.',
  'Honest, dated comparisons with other transcription services.': 'So sánh trung thực, có ghi ngày với các dịch vụ chuyển thành văn bản khác.',
  'Keep this page open until it is finished. If it reloads or closes, it continues where it stopped when you open the site again.': 'Hãy giữ trang này mở cho đến khi hoàn tất. Nếu trang tải lại hoặc bị đóng, quá trình sẽ tiếp tục từ chỗ đã dừng khi bạn mở lại trang web.',
  'Length {time}': 'Độ dài {time}',
  'Opens in Word and Google Docs': 'Mở được trong Word và Google Docs',
  'Reconnecting…': 'Đang kết nối lại…',
  'The download server is busy (HTTP {status}).': 'Máy chủ tải xuống đang bận (HTTP {status}).',
  'The download stalled.': 'Quá trình tải xuống bị đình trệ.',
  'Time so far {time}': 'Thời gian đã qua {time}',
  'Translated to English': 'Đã dịch sang tiếng Anh',
  'Waiting for the internet connection…': 'Đang chờ kết nối internet…',
  'Word document (.docx)': 'Tài liệu Word (.docx)',
  'Transcribed in {time}': 'Chuyển thành văn bản trong {time}',
  Transcript: 'Bản gỡ băng',
  'Transcript name': 'Tên bản gỡ băng',
  'Transcript not found': 'Không tìm thấy bản gỡ băng',
  'Transcript ready': 'Bản gỡ băng đã sẵn sàng',
  'Transcript style': 'Kiểu bản gỡ băng',
  'Transcription failed': 'Chuyển thành văn bản thất bại',
  'Transcription has started. The text appears below as it is recognised.':
    'Đã bắt đầu chuyển thành văn bản. Văn bản xuất hiện bên dưới khi được nhận dạng.',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'Đã bắt đầu chuyển thành văn bản. Các tệp khác của bạn nằm trong mục Bản gỡ băng ở đầu trang.',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    'Việc chuyển thành văn bản chạy trên thiết bị của bạn và dùng bộ xử lý, chip đồ họa, bộ nhớ và pin của nó. Chúng tôi không đặt giới hạn dung lượng hay độ dài tệp, nhưng tốc độ chạy và kích cỡ tệp mà trình duyệt của bạn xử lý được phụ thuộc vào thiết bị của bạn: một tệp dài trên điện thoại hoặc máy tính yếu hơn có thể mất rất nhiều thời gian hoặc hết bộ nhớ. Bản gỡ băng và tệp của bạn được lưu trong trình duyệt này và tự động bị xóa sau {idle} không hoạt động. Xem [Chính sách quyền riêng tư](/privacy).',
  'Transcription settings': 'Thiết lập chuyển thành văn bản',
  Transcripts: 'Bản gỡ băng',
  'Transcripts {n}': 'Bản gỡ băng {n}',
  'Transcripts are only kept for the browser session that created them.':
    'Bản gỡ băng chỉ được giữ trong phiên trình duyệt đã tạo ra chúng.',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    'Bản gỡ băng được tạo tự động và sẽ có lỗi, đặc biệt với âm thanh nhiễu, giọng địa phương mạnh, nhiều người nói chồng lên nhau, nhạc, và tên riêng hay thuật ngữ kỹ thuật. Luôn kiểm tra bản gỡ băng trước khi dựa vào nó, đặc biệt cho mục đích pháp lý, y tế, tài chính hoặc để xuất bản. Dịch vụ được cung cấp “nguyên trạng” và “theo khả năng sẵn có”, không kèm bất kỳ bảo đảm nào, rõ ràng hay ngầm định, bao gồm về độ chính xác, tính đầy đủ hoặc sự phù hợp cho một mục đích cụ thể.',
  'Translate to English': 'Dịch sang tiếng Anh',
  'Try again': 'Thử lại',
  'Try another quality or language': 'Thử chất lượng hoặc ngôn ngữ khác',
  'try to spread malware or anything meant to damage the service.':
    'cố phát tán phần mềm độc hại hoặc bất cứ thứ gì nhằm gây hại cho dịch vụ.',
  'Trying again in a moment…': 'Sẽ thử lại trong giây lát…',
  'Trying again. This page loads by itself as soon as the server is back.':
    'Đang thử lại. Trang này tự tải ngay khi máy chủ hoạt động trở lại.',
  'under a minute': 'dưới một phút',
  'Underline unsure words': 'Gạch chân từ chưa chắc chắn',
  Unlimited: 'Không giới hạn',
  'Unsure: worth listening to again': 'Chưa chắc: nên nghe lại',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'Các đợt tải lên dồn dập bất thường có thể bị yêu cầu chờ một chút.',
  'Up to {minutes} per file.': 'Tối đa {minutes} mỗi tệp.',
  'Up to {size} and {minutes} minutes per file.': 'Tối đa {size} và {minutes} phút mỗi tệp.',
  'Up to {size} and {minutes} per file.': 'Tối đa {size} và {minutes} mỗi tệp.',
  'Up to {size} per file.': 'Tối đa {size} mỗi tệp.',
  'Updated {date}': 'Cập nhật {date}',
  'Upload complete': 'Tải lên hoàn tất',
  'Upload failed': 'Tải lên thất bại',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'Tải lên thất bại (lỗi máy chủ {status}). Hãy kiểm tra terminal đang chạy máy chủ để biết chi tiết.',
  'Upload failed (server error {status}). Please try again in a moment.':
    'Tải lên thất bại (lỗi máy chủ {status}). Vui lòng thử lại sau giây lát.',
  Uploading: 'Đang tải lên',
  'Uploading…': 'Đang tải lên…',
  'use a computer for this size': 'hãy dùng máy tính cho cỡ này',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'dùng tập lệnh, bot hoặc các phương tiện tự động khác nhằm vào trang web hoặc bộ đếm của trang, hoặc gửi số đếm giả mạo, khi chưa có sự cho phép bằng văn bản của chúng tôi;',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'dùng dịch vụ cho nội dung bất hợp pháp hoặc xâm phạm quyền của người khác;',
  'use the service to harass, harm or deceive others;':
    'dùng dịch vụ để quấy rối, gây hại hoặc lừa dối người khác;',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'Thường rất chính xác với giọng nói rõ. Các dòng mô hình chưa chắc chắn được đánh dấu để bạn kiểm tra trước.',
  'Video and audio to text': 'Chuyển video và âm thanh thành văn bản',
  'Video or audio, several at once is fine.':
    'Video hoặc âm thanh, thêm nhiều tệp cùng lúc cũng được.',
  'Video to text, accurately.': 'Chuyển video thành văn bản, chính xác.',
  'Video to text: transcribe a video or audio file':
    'Chuyển video thành văn bản: gỡ băng tệp video hoặc âm thanh',
  'video transcribed': 'video đã chuyển thành văn bản',
  'videos transcribed': 'video đã chuyển thành văn bản',
  'Vocabulary hint': 'Gợi ý từ vựng',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'Ghi chú thoại, cuộc họp, bài giảng, podcast và phỏng vấn.',
  'Waiting for microphone permission…': 'Đang chờ cấp quyền micro…',
  'Waiting for the first words…': 'Đang chờ những từ đầu tiên…',
  'Waiting in line…': 'Đang chờ đến lượt…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'Xem văn bản xuất hiện trực tiếp, sửa mọi lỗi, rồi tải xuống dưới dạng SRT, VTT, TXT, Markdown, JSON hoặc PDF.',
  'We do not ask for your name, e-mail address or any other account details.':
    'Chúng tôi không yêu cầu tên, địa chỉ e-mail hay bất kỳ thông tin tài khoản nào khác của bạn.',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'Chúng tôi không cam kết dịch vụ sẽ luôn khả dụng, không gián đoạn hoặc không có lỗi. Trang web, hoặc các tệp tải xuống mà nó cần (các mô hình giọng nói từ Hugging Face và các tệp chương trình từ jsDelivr), có thể không khả dụng do bảo trì hoặc vì những lý do ngoài tầm kiểm soát của chúng tôi, và một số trình duyệt hoặc thiết bị không thể chạy mọi mô hình. Vì bản gỡ băng của bạn chỉ được lưu trong trình duyệt này và bị xóa sau thời gian không hoạt động, hãy luôn xuất những gì bạn cần.',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'Chúng tôi không bán dữ liệu của bạn. Chúng tôi không giữ tệp hay bản gỡ băng nào của bạn nên không có gì để chia sẻ: quá trình nhận dạng chạy trên thiết bị của bạn, không chạy trên dịch vụ gỡ băng hay AI bên ngoài. Google (quảng cáo), Cloudflare (lưu trữ và bộ đếm), Hugging Face và jsDelivr (các tệp tải xuống) chỉ nhận những gì được mô tả ở trên. Chúng tôi có thể tiết lộ thông tin nếu pháp luật yêu cầu.',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    'Chúng tôi không giữ gì của bạn: ngoài tổng số duy nhất đó, không có thông tin nào về việc sử dụng của bạn được chúng tôi lưu trữ.',
  'We may block access if these rules are broken.':
    'Chúng tôi có thể chặn quyền truy cập nếu các quy tắc này bị vi phạm.',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'Chúng tôi có thể cập nhật các điều khoản này. Phiên bản mới xuất hiện trên trang này kèm ngày “Cập nhật lần cuối” mới và có hiệu lực từ thời điểm đó.',
  'We never send your file, your transcript or any personal information to Google.':
    'Chúng tôi không bao giờ gửi tệp, bản gỡ băng hay bất kỳ thông tin cá nhân nào của bạn cho Google.',
  'Web subtitles (.vtt)': 'Phụ đề web (.vtt)',
  'What people use it for': 'Mọi người dùng nó để làm gì',
  'What you can do with it': 'Bạn có thể làm gì với nó',
  'What you get': 'Bạn nhận được gì',
  'what you were doing, and what happened instead of what you expected;':
    'bạn đang làm gì, và điều gì đã xảy ra thay vì điều bạn mong đợi;',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'Nơi tệp của bạn được xử lý phụ thuộc vào cách {brand} được vận hành, và máy chủ vừa rồi không phản hồi. Xem [Chính sách quyền riêng tư](/privacy).',
  'Where your files are processed depends on how {brand} is run.':
    'Nơi tệp của bạn được xử lý phụ thuộc vào cách {brand} được vận hành.',
  'Which files can I use, and what are the limits?':
    'Tôi dùng được những tệp nào và giới hạn là gì?',
  'Which languages are supported?': 'Hỗ trợ những ngôn ngữ nào?',
  'Who builds it': 'Ai xây dựng nó',
  'Who runs this website': 'Ai vận hành trang web này',
  'Why it exists': 'Vì sao nó tồn tại',
  'Working…': 'Đang xử lý…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'Có. Dịch vụ miễn phí, không có tài khoản hay đăng nhập, bất cứ lúc nào. Không có hạn mức hằng ngày hay hằng tháng và không có tường phí; quảng cáo giúp trang web luôn miễn phí.',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'Có. Dịch vụ miễn phí, không có tài khoản hay đăng nhập, bất cứ lúc nào. Không có hạn mức hằng ngày hay hằng tháng và không có tường phí.',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'Có. Dịch vụ miễn phí, không cần đăng ký và không cần đăng nhập. Bản sao này chạy trên máy tính của chính bạn nên không có hạn mức và không có tường phí; tốc độ phụ thuộc vào máy tính của bạn.',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'Có. Dùng biểu tượng bút chì bên cạnh một dòng để sửa văn bản hoặc xóa dòng, hoặc tìm và thay thế trên toàn bộ bản gỡ băng. Các chỉnh sửa của bạn được đưa vào mọi bản xuất.',
  'You agree not to:': 'Bạn đồng ý không:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'Bạn nắm quyền kiểm soát: hãy xóa bản gỡ băng, tệp và, nếu muốn, cả các mô hình giọng nói đã tải xuống bất cứ lúc nào bằng **Xóa dữ liệu của tôi ngay**. Nút này chỉ xóa dữ liệu trong trình duyệt này; nó không thể xóa cookie của Google.',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'Bạn có thể thay đổi bất cứ lúc nào bằng **Cài đặt quyền riêng tư và cookie** ở cuối bất kỳ trang nào có hiển thị quảng cáo (ví dụ trang chủ).',
  'You can now read, fix and download it.': 'Bây giờ bạn có thể đọc, sửa và tải xuống.',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'Bạn có thể ngừng sử dụng dịch vụ bất cứ lúc nào và xóa dữ liệu trong trình duyệt này bằng **Xóa dữ liệu của tôi ngay**. Chúng tôi có thể đình chỉ hoặc chấm dứt quyền truy cập của bạn bất cứ lúc nào, đặc biệt nếu bạn vi phạm các điều khoản này.',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'Bạn giữ mọi quyền đối với các tệp bạn thêm và các bản gỡ băng được tạo từ chúng. Chúng được xử lý trên thiết bị của bạn và chúng tôi không bao giờ nhận được. Bạn chịu trách nhiệm về những gì mình chuyển thành văn bản: chỉ dùng nội dung bạn sở hữu hoặc có quyền xử lý, bao gồm mọi sự cho phép cần thiết từ những người nói trong đó.',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'Bạn có thể từ chối quảng cáo được cá nhân hóa bằng cách truy cập [Cài đặt quảng cáo của Google](https://adssettings.google.com), hoặc từ chối việc một số nhà cung cấp bên thứ ba dùng cookie cho quảng cáo cá nhân hóa tại [www.aboutads.info](https://www.aboutads.info). Tìm hiểu [cách Google sử dụng thông tin từ các trang web dùng dịch vụ của mình](https://policies.google.com/technologies/partner-sites).',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'trình duyệt của bạn và phiên bản của nó, cùng thiết bị của bạn (máy tính hoặc điện thoại, và hệ điều hành);',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'Trình duyệt của bạn đã chặn việc sao chép tại đây. Hãy dùng Xuất để lưu văn bản.',
  'Your change is saved.': 'Thay đổi của bạn đã được lưu.',
  'Your change is still in its box: press Save to try again.':
    'Thay đổi của bạn vẫn còn trong ô: nhấn Lưu để thử lại.',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'Tệp của bạn được gửi đến máy chủ qua kết nối được mã hóa, được chuyển thành văn bản bằng các mô hình nhận dạng giọng nói mở như OpenAI Whisper, rồi tự động bị xóa sau đó. Trang [Cách hoạt động](/how-it-works) giải thích từng bước.',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'Tệp của bạn được chuyển thành văn bản trong trình duyệt trên chính thiết bị của bạn, nên chúng tôi không đặt giới hạn dung lượng hay độ dài. Tệp rất lớn hoặc rất dài cũng dùng được: chúng mất nhiều thời gian hơn và cần đủ bộ nhớ trống, và trang sẽ cảnh báo khi thiết bị của bạn có thể chậm.',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'Tệp của bạn được chuyển thành văn bản bằng các mô hình nhận dạng giọng nói mở như OpenAI Whisper và tự động bị xóa sau đó.',
  'Your file never leaves your device.': 'Tệp của bạn không bao giờ rời khỏi thiết bị.',
  'Your file never leaves your device. [Privacy](/privacy)':
    'Tệp của bạn không bao giờ rời khỏi thiết bị. [Quyền riêng tư](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'Tệp của bạn không bao giờ rời khỏi thiết bị. Tệp được chuyển thành văn bản trong trình duyệt trên thiết bị này và không bao giờ được tải lên chỗ chúng tôi hay bất kỳ ai khác. Bản gỡ băng, các chỉnh sửa và tệp chỉ được lưu trong bộ nhớ của trình duyệt này và tự động bị xóa sau {idle} không hoạt động, hoặc ngay lập tức khi bạn nhấn **Xóa dữ liệu của tôi ngay** trong menu Bản gỡ băng. Không có tài khoản. Hãy xuất những gì bạn cần trước khi rời đi.',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'Tệp của bạn không bao giờ rời khỏi thiết bị. Tệp được chuyển thành văn bản ngay trong trình duyệt của bạn, không cần tài khoản, và bản gỡ băng của bạn ở lại trong trình duyệt này.',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'Tệp của bạn ở lại trên thiết bị này. Hãy để tab này mở trong khi tệp được chuyển thành văn bản.',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'Tệp và bản gỡ băng của bạn chỉ được giữ trong phiên này và tự động bị xóa sau {idle} không hoạt động, hoặc khi bạn nhấn “Xóa dữ liệu của tôi ngay”. Không tài khoản, không theo dõi, chỉ một cookie phiên thiết yếu. Hãy xuất những gì bạn cần trước khi rời đi.',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'Tệp và bản gỡ băng của bạn chỉ được giữ trong phiên này và tự động bị xóa khi phiên kết thúc, hoặc khi bạn nhấn “Xóa dữ liệu của tôi ngay”. Không tài khoản, không theo dõi, chỉ một cookie phiên thiết yếu. Hãy xuất những gì bạn cần trước khi rời đi.',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'Tệp của bạn được xóa tự động. [Quyền riêng tư](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'Tệp của bạn được xử lý trong trình duyệt và ở lại trên thiết bị của bạn. Trang web, các tệp tải xuống và bộ đếm dùng kết nối được mã hóa (HTTPS). Bất kỳ ai dùng được hồ sơ trình duyệt này đều có thể xem các bản gỡ băng được lưu trong đó cho đến khi chúng bị xóa, vì vậy hãy nhấn **Xóa dữ liệu của tôi ngay** trên máy tính dùng chung.',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'Tệp của bạn được tải lên máy chủ của chúng tôi để xử lý tại đó. Chúng chỉ được giữ trong phiên của bạn và tự động bị xóa khi phiên kết thúc, sau {idle} không hoạt động, hoặc ngay lập tức khi bạn nhấn **Xóa dữ liệu của tôi ngay** trong menu Bản gỡ băng. Không có tài khoản và không có theo dõi, và cookie duy nhất là một cookie phiên thiết yếu (không có cookie phân tích hay quảng cáo).',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'Tệp của bạn được tải lên máy chủ của chúng tôi để xử lý tại đó. Chúng chỉ được giữ trong phiên của bạn và tự động bị xóa khi phiên kết thúc, hoặc ngay lập tức khi bạn nhấn **Xóa dữ liệu của tôi ngay** trong menu Bản gỡ băng. Không có tài khoản và không có theo dõi, và cookie duy nhất là một cookie phiên thiết yếu (không có cookie phân tích hay quảng cáo).',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'Tệp của bạn không bao giờ rời khỏi thiết bị này. Bản gỡ băng chỉ được lưu trong trình duyệt này và tự động bị xóa sau {idle} không hoạt động, hoặc khi bạn nhấn “Xóa dữ liệu của tôi ngay”. Hãy xuất những gì bạn cần trước khi rời đi.',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'Tệp của bạn không bao giờ rời khỏi thiết bị này. Bản gỡ băng chỉ được lưu trong trình duyệt này và tự động bị xóa khi phiên kết thúc, hoặc khi bạn nhấn “Xóa dữ liệu của tôi ngay”. Hãy xuất những gì bạn cần trước khi rời đi.',
  'Your session ends in {mins} min. Export what you need.':
    'Phiên của bạn sẽ kết thúc sau {mins} phút. Hãy xuất những gì bạn cần.',
  'Your session has ended': 'Phiên của bạn đã kết thúc',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'Phiên của bạn đã kết thúc và dữ liệu của phiên đã bị xóa. Bạn có thể bắt đầu một lần chuyển thành văn bản mới.',
  'Your transcript is ready below.': 'Bản gỡ băng của bạn đã sẵn sàng bên dưới.',
  'Your transcripts': 'Bản gỡ băng của bạn',
  'Your transcripts and files were removed from the server.':
    'Bản gỡ băng và tệp của bạn đã bị xóa khỏi máy chủ.',
  'Your transcripts and files were removed from this device.':
    'Bản gỡ băng và tệp của bạn đã bị xóa khỏi thiết bị này.',

  'title:/': 'Chuyển video thành văn bản miễn phí',
  'description:/':
    'Chuyển video và âm thanh thành văn bản miễn phí. Không cần đăng nhập, không giới hạn mỗi ngày, hơn 50 ngôn ngữ. Có mốc thời gian, xuất SRT, VTT, TXT, PDF.',
  'title:/about': 'Giới thiệu về TranscribeVid',
  'description:/about':
    'Ai xây dựng TranscribeVid và vì sao: công cụ chuyển video, âm thanh thành văn bản miễn phí, không cần đăng ký, giao diện gọn, được quảng cáo tài trợ.',
  'title:/audio-to-text': 'Chuyển âm thanh thành văn bản miễn phí',
  'description:/audio-to-text':
    'Biến podcast, phỏng vấn và bài giảng thành văn bản. Có mốc thời gian, hơn 50 ngôn ngữ, không cần đăng nhập. Tải về TXT, SRT, VTT hoặc PDF.',
  'label:/audio-to-text': 'Âm thanh thành văn bản',
  'title:/contact': 'Liên hệ',
  'description:/contact':
    'Cách liên hệ TranscribeVid: gửi e-mail để hỏi, báo lỗi, đề xuất tính năng hoặc yêu cầu về quyền riêng tư, và ai là người vận hành trang web.',
  'title:/faq': 'Câu hỏi thường gặp',
  'description:/faq':
    'Giải đáp các câu hỏi thường gặp về TranscribeVid: độ chính xác, ngôn ngữ, tệp được hỗ trợ và giới hạn, tốc độ, quyền riêng tư và chỉnh sửa.',
  'title:/guides': 'Hướng dẫn',
  'description:/guides':
    'Hướng dẫn thực tế về bản gỡ băng và phụ đề: SRT hay VTT, cách thêm phụ đề vào video, cách có bản gỡ băng chính xác và chuyển văn bản riêng tư.',
  'title:/guides/accurate-transcripts': 'Cách có bản gỡ băng chính xác hơn',
  'description:/guides/accurate-transcripts':
    'Cách tăng độ chính xác khi chuyển giọng nói thành văn bản: âm thanh sạch hơn, đúng ngôn ngữ và mô hình, gợi ý từ vựng, cùng cách kiểm tra và sửa kết quả.',
  'label:/guides/accurate-transcripts': 'Cách có bản gỡ băng chính xác hơn',
  'title:/guides/how-to-add-subtitles-to-a-video': 'Cách thêm phụ đề vào video miễn phí',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'Tạo phụ đề trong bốn bước: chuyển video thành văn bản, sửa lại, xuất SRT hoặc VTT, rồi thêm tệp vào YouTube, VLC, phần mềm biên tập hoặc trình phát web.',
  'label:/guides/how-to-add-subtitles-to-a-video': 'Cách thêm phụ đề vào video',
  'title:/guides/srt-vs-vtt': 'SRT hay VTT: dùng định dạng phụ đề nào?',
  'description:/guides/srt-vs-vtt':
    'SRT hay VTT? Mỗi định dạng phụ đề là gì, khác nhau thế nào, dùng được ở đâu, và cách lấy tệp SRT hoặc VTT từ video của bạn hoàn toàn miễn phí.',
  'label:/guides/srt-vs-vtt': 'SRT hay VTT',
  'title:/guides/transcribe-video-without-uploading':
    'Chuyển video thành văn bản không cần tải lên',
  'description:/guides/transcribe-video-without-uploading':
    'Cách chuyển văn bản ngay trong trình duyệt hoạt động ra sao, điều gì ở lại trên thiết bị, điều gì chỉ tải một lần, và cách tự kiểm tra bằng bảng Network.',
  'label:/guides/transcribe-video-without-uploading': 'Gỡ băng video mà không cần tải lên',
  'title:/guides/what-is-whisper': 'Whisper là gì? Giải thích dễ hiểu',
  'description:/guides/what-is-whisper':
    'OpenAI Whisper là gì, được huấn luyện trên dữ liệu nào, chính xác đến đâu, khó ở đâu, và cách nó chạy ngay trong trình duyệt của bạn trên TranscribeVid.',
  'label:/guides/what-is-whisper': 'Whisper là gì?',
  'title:/how-it-works': 'Cách hoạt động',
  'description:/how-it-works':
    'Cách TranscribeVid biến video và âm thanh thành văn bản chính xác, có mốc thời gian trong ba bước, những gì bạn nhận được và mẹo để có kết quả tốt nhất.',
  'title:/interview-transcription': 'Gỡ băng phỏng vấn miễn phí, riêng tư',
  'description:/interview-transcription':
    'Gỡ băng phỏng vấn miễn phí, không cần tài khoản. Văn bản có mốc thời gian, hơn 50 ngôn ngữ, hợp cho nghiên cứu, báo chí, tuyển dụng. Tải TXT hoặc PDF.',
  'label:/interview-transcription': 'Gỡ băng phỏng vấn',
  'title:/lecture-to-text': 'Chuyển bài giảng thành văn bản miễn phí',
  'description:/lecture-to-text':
    'Biến bản ghi bài giảng thành ghi chú văn bản có thể tìm kiếm và dùng để học. Miễn phí, không cần đăng nhập, hơn 50 ngôn ngữ. Tải TXT, Markdown, SRT, PDF.',
  'label:/lecture-to-text': 'Bài giảng thành văn bản',
  'title:/m4a-to-text': 'Chuyển M4A thành văn bản miễn phí',
  'description:/m4a-to-text':
    'Chuyển ghi chú giọng nói M4A thành văn bản miễn phí. Dùng được với Voice Memos của iPhone, không cần đăng nhập, hơn 50 ngôn ngữ, có mốc thời gian.',
  'label:/m4a-to-text': 'M4A thành văn bản',
  'title:/meeting-recording-to-text': 'Bản ghi Zoom, Teams, Meet thành văn bản',
  'description:/meeting-recording-to-text':
    'Biến bản ghi Zoom, Teams hoặc Google Meet thành bản gỡ băng có mốc thời gian, tìm kiếm được, miễn phí. Không cần đăng nhập, hơn 50 ngôn ngữ.',
  'label:/meeting-recording-to-text': 'Bản ghi cuộc họp thành văn bản',
  'title:/mov-to-text': 'Chuyển MOV thành văn bản: video iPhone',
  'description:/mov-to-text':
    'Chuyển video MOV từ iPhone hoặc QuickTime thành văn bản miễn phí. Không cần đăng nhập, hơn 50 ngôn ngữ, mỗi dòng có mốc thời gian. Tải TXT, SRT, VTT, PDF.',
  'label:/mov-to-text': 'MOV thành văn bản',
  'title:/mp3-to-text': 'Chuyển MP3 thành văn bản miễn phí',
  'description:/mp3-to-text':
    'Chuyển MP3 thành văn bản trực tuyến miễn phí. Không cần đăng nhập, hơn 50 ngôn ngữ, mỗi dòng có mốc thời gian. Sửa văn bản rồi tải TXT, SRT, VTT hoặc PDF.',
  'label:/mp3-to-text': 'MP3 thành văn bản',
  'title:/mp4-to-text': 'Chuyển MP4 thành văn bản miễn phí',
  'description:/mp4-to-text':
    'Chuyển video MP4 thành văn bản có mốc thời gian. Miễn phí, không cần đăng nhập, không giới hạn mỗi ngày, hơn 50 ngôn ngữ. Tải TXT, SRT, VTT, Markdown, PDF.',
  'label:/mp4-to-text': 'MP4 thành văn bản',
  'title:/podcast-transcript-generator': 'Tạo bản gỡ băng podcast miễn phí',
  'description:/podcast-transcript-generator':
    'Tạo bản gỡ băng podcast từ tệp MP3 hoặc WAV miễn phí. Có mốc thời gian, hơn 50 ngôn ngữ, không cần đăng nhập. Sửa rồi tải TXT, Markdown, SRT, VTT hoặc PDF.',
  'label:/podcast-transcript-generator': 'Tạo bản gỡ băng podcast',
  'title:/privacy': 'Chính sách quyền riêng tư',
  'description:/privacy':
    'TranscribeVid xử lý gì khi bạn chuyển một tệp thành văn bản, ở đâu, vì sao, lưu bao lâu, cùng cookie, quảng cáo, bộ nhớ trình duyệt và quyền của bạn.',
  'title:/srt-subtitle-generator': 'Tạo phụ đề SRT từ video miễn phí',
  'description:/srt-subtitle-generator':
    'Tạo tệp phụ đề SRT từ bất kỳ video hoặc âm thanh nào miễn phí. Khớp theo lời nói, hơn 50 ngôn ngữ, không cần đăng nhập. Sửa dòng rồi tải SRT hoặc VTT.',
  'label:/srt-subtitle-generator': 'Tạo phụ đề SRT',
  'title:/terms': 'Điều khoản sử dụng',
  'description:/terms':
    'Quy tắc sử dụng TranscribeVid: dịch vụ miễn phí, nội dung của bạn, sử dụng hợp lệ, giới hạn tệp, không bảo đảm độ chính xác của bản gỡ băng và trách nhiệm.',
  'title:/tools': 'Tất cả công cụ miễn phí',
  'description:/tools':
    'Mọi công cụ chuyển video, âm thanh thành văn bản miễn phí trong một danh sách: theo loại tệp, mục đích, phụ đề, ngôn ngữ. Không cần đăng nhập.',
  'title:/translate-audio-to-english': 'Dịch lời nói sang văn bản tiếng Anh',
  'description:/translate-audio-to-english':
    'Biến lời nói bằng ngôn ngữ khác thành văn bản tiếng Anh miễn phí. Tải video hoặc âm thanh lên, nhận văn bản hoặc phụ đề tiếng Anh. Không cần đăng nhập.',
  'label:/translate-audio-to-english': 'Dịch lời nói sang tiếng Anh',
  'title:/video-to-text': 'Chuyển video sang văn bản, không đăng nhập',
  'description:/video-to-text':
    'Chuyển video thành văn bản miễn phí. Bản gỡ băng chính xác, có mốc thời gian, hơn 50 ngôn ngữ. Không cần đăng nhập, không giới hạn. Tải SRT, VTT, TXT, PDF.',
  'label:/video-to-text': 'Video thành văn bản',
  'title:/voice-recording-to-text': 'Chuyển file ghi âm thành văn bản miễn phí',
  'description:/voice-recording-to-text':
    'Ghi âm ngay trên trình duyệt hoặc tải lên ghi chú thoại để nhận văn bản. Miễn phí, không cần đăng nhập, hơn 50 ngôn ngữ. Tải TXT, PDF, SRT hoặc Markdown.',
  'label:/voice-recording-to-text': 'Ghi âm thành văn bản',
  'title:/vtt-subtitle-generator': 'Tạo phụ đề VTT (WebVTT) miễn phí',
  'description:/vtt-subtitle-generator':
    'Tạo tệp phụ đề WebVTT (.vtt) từ bất kỳ video hoặc âm thanh nào miễn phí. Khớp theo lời nói, hơn 50 ngôn ngữ, không cần đăng nhập. Sửa dòng rồi tải VTT.',
  'label:/vtt-subtitle-generator': 'Tạo phụ đề VTT',
  'title:/wav-to-text': 'Chuyển WAV thành văn bản miễn phí',
  'description:/wav-to-text':
    'Chuyển tệp WAV thành văn bản miễn phí. Xử lý được bản ghi dài từ máy ghi âm và cuộc gọi, hơn 50 ngôn ngữ, có mốc thời gian, không cần đăng nhập.',
  'label:/wav-to-text': 'WAV thành văn bản',
  'title:/webm-to-text': 'Chuyển WebM thành văn bản miễn phí',
  'description:/webm-to-text':
    'Chuyển tệp WebM thành văn bản miễn phí. Dùng được với bản ghi màn hình và trình duyệt, hơn 50 ngôn ngữ, có mốc thời gian. Tải TXT, SRT, VTT hoặc PDF.',
  'label:/webm-to-text': 'WebM thành văn bản',
  'title:/whatsapp-voice-message-to-text': 'Tin nhắn thoại WhatsApp thành văn bản',
  'description:/whatsapp-voice-message-to-text':
    'Chuyển tin nhắn thoại WhatsApp thành văn bản miễn phí. Lưu ghi chú thoại, thả vào đây, đọc bằng hơn 50 ngôn ngữ, gồm tiếng Hindi. Không cần đăng nhập.',
  'label:/whatsapp-voice-message-to-text': 'Tin nhắn thoại WhatsApp thành văn bản',
  'title:/youtube-subtitle-generator': 'Tạo phụ đề YouTube, tệp SRT miễn phí',
  'description:/youtube-subtitle-generator':
    'Tạo tệp phụ đề SRT cho video YouTube của chính bạn, miễn phí và không cần đăng nhập. Khớp theo lời nói, hơn 50 ngôn ngữ. Tải lên trong YouTube Studio.',
  'label:/youtube-subtitle-generator': 'Tạo phụ đề YouTube',
  'This page was translated with AI. [Found a mistake? Tell us.](/contact)':
    'Trang này được dịch bằng AI. [Phát hiện lỗi? Hãy báo cho chúng tôi.](/contact)',
  'A finished transcript: a media player next to the text in short lines, each with a timestamp.':
    'Một bản gỡ băng đã hoàn thành: trình phát media bên cạnh văn bản chia thành các dòng ngắn, mỗi dòng có một mốc thời gian.',
  'A finished transcript. Every line has a timestamp, and Export saves it as SRT, VTT, TXT, PDF and more.':
    'Một bản gỡ băng đã hoàn thành. Mỗi dòng có mốc thời gian, và nút Xuất lưu bản này thành SRT, VTT, TXT, PDF và nhiều định dạng khác.',
  '**Visit statistics.** Cloudflare Web Analytics counts visits to our pages: which page was opened, which site you came from, your country, your browser and device type, and how fast the page loaded. Cloudflare says it sets no cookies, keeps no identifier on your device and does not use the data to follow you from one website to another.':
    '**Thống kê lượt truy cập.** Cloudflare Web Analytics đếm lượt truy cập các trang của chúng tôi: trang nào được mở, bạn đến từ trang web nào, quốc gia, trình duyệt và loại thiết bị của bạn, và trang tải nhanh đến mức nào. Cloudflare cho biết họ không đặt cookie, không lưu mã định danh nào trên thiết bị của bạn và không dùng dữ liệu để theo dõi bạn từ trang web này sang trang web khác.',
};

export default dict;
