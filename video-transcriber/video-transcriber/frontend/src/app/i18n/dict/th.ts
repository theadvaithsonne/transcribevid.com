/** Thai dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
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
  '"{name}" is {size}; the limit is {limit}.': '“{name}” มีขนาด {size} แต่ขีดจำกัดคือ {limit}',
  '"{name}" is empty.': '“{name}” เป็นไฟล์ว่าง',
  '"{name}" is ready. Press Transcribe to start.': '“{name}” พร้อมแล้ว กดปุ่มถอดเสียงเพื่อเริ่ม',
  '“{title}” was deleted.': 'ลบ “{title}” แล้ว',
  '(optional)': '(ไม่บังคับ)',
  '{base} Word timing: {timing}.': '{base} เวลาระดับคำ: {timing}',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand} ({domain}) ดำเนินการโดย **{name}** ที่ {address} (“เรา”) เราเป็นผู้กำหนดว่าจะประมวลผลข้อมูลของคุณอย่างไรและเพราะเหตุใด ตามที่อธิบายไว้ในหน้านี้',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand} ({domain}) ดำเนินการโดย **{name}** ที่ {address} อ่านเพิ่มเติมได้ที่หน้า [เกี่ยวกับ](/about)',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand} เป็นบริการสำหรับผู้ใช้ทั่วไป และไม่ได้มุ่งเป้าไปที่เด็กอายุต่ำกว่า 13 ปี (หรือต่ำกว่า 16 ปีในสหภาพยุโรปที่บังคับใช้)',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand} สร้างและดูแลโดย **{name}** ซึ่งเป็น{role}ที่อาศัยอยู่ใน {city} เว็บไซต์นี้สร้างขึ้นเพื่อมอบประสบการณ์การถอดเสียงที่ดีที่สุด: ราบรื่นตั้งแต่คลิกแรก ไม่ต้องสร้างบัญชี และหน้าตาเรียบง่ายที่ไม่เกะกะสายตา',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} มีไว้สำหรับผู้ใช้ทั่วไป และไม่ได้มุ่งเป้าไปที่เด็กอายุต่ำกว่า 13 ปี',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages) and beside a finished transcript. No ad is shown while a file is being transcribed, and never on the privacy, terms or logs pages.':
    '{brand} ให้ใช้ฟรีเพราะมีโฆษณา ซึ่งแสดงโดย Google AdSense โฆษณาจะปรากฏเฉพาะในหน้าข้อมูล (หน้าแรก วิธีการทำงาน คำถามที่พบบ่อย และหน้าเครื่องมือ) และข้างข้อความถอดเสียงที่เสร็จแล้วเท่านั้น จะไม่แสดงโฆษณาขณะกำลังถอดเสียงไฟล์ และไม่แสดงในหน้านโยบายความเป็นส่วนตัว ข้อกำหนด หรือบันทึก (Logs) เลย',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    '{brand} ใช้งานได้ฟรี [นโยบายความเป็นส่วนตัว](/privacy) อธิบายว่าไฟล์ของคุณจะถูกจัดการอย่างไร',
  '{brand} is funded by ads shown on its information pages and beside finished transcripts (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand} ได้รับเงินทุนจากโฆษณาที่แสดงในหน้าข้อมูลและข้างข้อความถอดเสียงที่เสร็จแล้ว (Google AdSense) เนื่องจากอุปกรณ์ของคุณเป็นผู้ถอดเสียงเอง จึงไม่มีค่าเซิร์ฟเวอร์ต่อไฟล์ และนี่คือสิ่งที่ทำให้บริการฟรีและไม่จำกัด [นโยบายความเป็นส่วนตัว](/privacy) อธิบายว่าโฆษณาใช้ข้อมูลอะไรและคุณเลือกตั้งค่าได้อย่างไร',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand} เปลี่ยนเสียงพูดในไฟล์วิดีโอหรือไฟล์เสียงให้เป็นข้อความพร้อมไทม์สแตมป์ ใน 3 ขั้นตอนง่าย ๆ',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand} เปลี่ยนเสียงพูดในวิดีโอ ไฟล์เสียง และการบันทึกเสียงให้เป็นข้อความที่แม่นยำพร้อมไทม์สแตมป์ ใช้ฟรี ไม่จำกัดจำนวนไฟล์ที่ถอดเสียง และไม่ต้องมีบัญชี: เลือกไฟล์ด้านบน กดถอดเสียง แล้วอ่านผลลัพธ์ได้เลย',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages and beside finished transcripts (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand} เปลี่ยนไฟล์วิดีโอและไฟล์เสียงให้เป็นข้อความได้ในเบราว์เซอร์ของคุณเลย: การรู้จำเสียงทำงานบนอุปกรณ์ของคุณ และไฟล์ของคุณจะไม่ถูกอัปโหลดมาที่เรา ใช้ฟรีและไม่ต้องมีบัญชี ได้รับเงินทุนจากโฆษณาในหน้าข้อมูลและข้างข้อความถอดเสียงที่เสร็จแล้ว (Google AdSense ดู [นโยบายความเป็นส่วนตัว](/privacy)) เราอาจเปลี่ยนแปลง จำกัด หรือหยุดฟีเจอร์ได้ทุกเมื่อ',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand} เปลี่ยนวิดีโอและเสียงให้เป็นข้อความที่แม่นยำพร้อมไทม์สแตมป์ ฟรี ไม่ต้องสมัครสมาชิก ไม่ต้องเข้าสู่ระบบ และไม่มีลายน้ำ: เปิดหน้านี้ เลือกไฟล์ แล้วอ่านข้อความถอดเสียงได้เลย',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies.':
    '{brand} เปลี่ยนวิดีโอและเสียงให้เป็นข้อความได้ในเบราว์เซอร์ของคุณเลย หน้านี้อธิบายด้วยภาษาง่าย ๆ ว่าสิ่งนี้เกี่ยวข้องกับข้อมูลของคุณอย่างไร สรุปสั้น ๆ: ไฟล์ของคุณไม่เคยออกจากอุปกรณ์ ข้อความถอดเสียงของคุณเก็บไว้ในเบราว์เซอร์นี้เท่านั้น ไม่มีบัญชี และเว็บไซต์ไม่ตั้งค่าคุกกี้ของตัวเอง โฆษณาจะปรากฏเฉพาะในหน้าข้อมูลและข้างข้อความถอดเสียงที่เสร็จแล้ว และแสดงโดย Google ซึ่งใช้คุกกี้',
  '{done} of {total}': '{done} จาก {total}',
  '{duration} (estimate)': '{duration} (ประมาณการ)',
  '{gb} GB of memory recommended': 'แนะนำหน่วยความจำ {gb} GB',
  '{h} h': '{h} ชม.',
  '{h} h {m} min': '{h} ชม. {m} นาที',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)': '{label} (ใช้ครั้งแรกจะดาวน์โหลด {size} MB)',
  "{label}, as reported by visitors' browsers": '{label} ตามที่เบราว์เซอร์ของผู้เข้าชมรายงาน',
  '{label}: common questions': '{label}: คำถามที่พบบ่อย',
  '{label}. {title}.': '{label}. {title}.',
  '{label}. Look for it in your downloads.': '{label} ดูไฟล์ได้ในโฟลเดอร์ดาวน์โหลดของคุณ',
  '{language} → English': '{language} → อังกฤษ',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} เข้าคิวไปแล้ว {done} จาก {total} ไฟล์ อีก {left} ไฟล์ยังอยู่ในรายการ กดถอดเสียงเพื่อลองใหม่',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} เข้าคิวไปแล้ว {done} จาก {total} ไฟล์ อีก {left} ไฟล์ยังอยู่ในรายการ กดถอดเสียงเพื่อลองใหม่',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '{model} ทำงานช้ากว่าเวลาจริงบนอุปกรณ์นี้: ประมาณ {wait} สำหรับเสียงยาว {audio} (ประมาณการ) โมเดล Tiny หรือ Base จะเสร็จเร็วกว่า',
  '{n} files were skipped: not video or audio.': 'ข้ามไฟล์ {n} ไฟล์: ไม่ใช่วิดีโอหรือไฟล์เสียง',
  '{n} h ago': '{n} ชม. ที่แล้ว',
  '{n} min': '{n} นาที',
  '{n} min ago': '{n} นาทีที่แล้ว',
  '{n} min left': 'เหลืออีก {n} นาที',
  '{n} min read': 'อ่าน {n} นาที',
  '{n} minute': '{n} นาที',
  '{n} minutes': '{n} นาที',
  '{n} of {total}': '{n} จาก {total}',
  '{n} of those files are already in the list.': '{n} ไฟล์ในนั้นอยู่ในรายการอยู่แล้ว',
  '{n} video transcribed': 'ถอดเสียงวิดีโอแล้ว {n} รายการ',
  '{n} videos transcribed': 'ถอดเสียงวิดีโอแล้ว {n} รายการ',
  '{n} words': '{n} คำ',
  '{n}% done': 'เสร็จแล้ว {n}%',
  '{n}% model confidence': 'ความมั่นใจของโมเดล {n}%',
  '{n}s left': 'เหลืออีก {n} วินาที',
  '{name} home': 'หน้าแรก {name}',
  '{size} download': 'ดาวน์โหลด {size}',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}',
  '{title}. {blurb}': '{title}. {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}. {blurb} ใช้ไม่ได้บนอุปกรณ์นี้: {reason}',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**บันทึกทางเทคนิคในแท็บนี้** หน้า Logs แสดงบันทึกทางเทคนิคของแท็บนี้เอง ซึ่งอยู่ในเบราว์เซอร์ของคุณและไม่ถูกส่งไปที่ใด',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**เพิ่มคำใบ้คำศัพท์**: ชื่อ แบรนด์ และศัพท์เฉพาะที่ปรากฏในเสียง เขียนตามที่ต้องการให้สะกด',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**เพิ่มคำใบ้คำศัพท์**: ชื่อ แบรนด์ และศัพท์เฉพาะ เขียนตามที่ต้องการให้สะกด',
  '**Ads.** Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed.':
    '**โฆษณา** โฆษณาจะปรากฏเฉพาะในหน้าข้อมูลและข้างข้อความถอดเสียงที่เสร็จแล้ว และแสดงโดย Google ซึ่งใช้คุกกี้ จะไม่แสดงโฆษณาขณะกำลังถอดเสียงไฟล์',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**ตรวจสอบบรรทัดที่มีเครื่องหมาย** แล้วแก้ในตัวแก้ไขข้อความถอดเสียง',
  '**Choose the spoken language** instead of auto-detect.':
    '**เลือกภาษาที่พูด** แทนการตรวจจับอัตโนมัติ',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**เลือกไฟล์ของคุณ** วางไฟล์วิดีโอหรือไฟล์เสียงด้านบน เลือกจากอุปกรณ์ หรือบันทึกเสียงด้วยไมโครโฟน ใช้ได้กับ MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG และรูปแบบทั่วไปส่วนใหญ่',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**ปรับปรุงเสียง** — กรองเสียงครางและเสียงซ่า ปรับเสียงผู้พูดที่เบาให้สม่ำเสมอ',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**ขีดจำกัดของไฟล์** เราไม่ได้กำหนดไว้ ไฟล์ของคุณถูกประมวลผลบนอุปกรณ์ของคุณ ไฟล์ที่ใหญ่หรือยาวมากจึงใช้เวลานานขึ้นและต้องใช้หน่วยความจำว่างเพียงพอ หน้านี้จะเตือนเมื่อใช้อุปกรณ์ที่ช้ากว่า',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**ประเภทไฟล์** วิดีโอ: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS และ MTS เสียง: MP3, WAV, M4A, AAC, FLAC, OGG และ OPUS คุณยังบันทึกจากไมโครโฟนโดยตรงได้ด้วย',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**คุกกี้ของ Google** Google ตั้งคุกกี้ของตัวเองเมื่อโฆษณาโหลด เฉพาะในหน้าที่แสดงโฆษณาเท่านั้น (ดูหัวข้อ 6)',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**การบรรยายและพอดแคสต์** ที่ถูกเปลี่ยนเป็นข้อความอ่านง่าย ไว้ใช้ศึกษาหรือทำสรุปประกอบรายการ',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**ขีดจำกัด** ขณะนี้เซิร์ฟเวอร์ไม่ได้ประกาศขีดจำกัดขนาดหรือความยาวใดไว้ ไฟล์ขนาดใหญ่มากก็แค่ใช้เวลานานขึ้น',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**ขีดจำกัด** เราไม่ได้กำหนดขีดจำกัดขนาดหรือความยาว: ไฟล์ของคุณถูกประมวลผลบนอุปกรณ์ของคุณ ไฟล์ที่ใหญ่หรือยาวมากจึงใช้เวลานานขึ้นและต้องใช้หน่วยความจำว่างเพียงพอ บนอุปกรณ์ที่ช้ากว่า หน้านี้จะแจ้งก่อนเริ่มและประมาณเวลาให้',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**สื่อที่คุณเพิ่ม** ไฟล์วิดีโอหรือไฟล์เสียงที่คุณเลือกหรือบันทึก ไฟล์เหล่านี้ถูกประมวลผลในเบราว์เซอร์บนอุปกรณ์ของคุณ (โดยใช้ WebGPU หรือ WebAssembly) ไฟล์ของคุณจะไม่ถูกอัปโหลดไปยังเซิร์ฟเวอร์ของเรา และไม่ถูกส่งให้ Google หรือใครอื่น',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**บันทึกการประชุมและการสัมภาษณ์** ที่คุณค้นหา อ้างอิง และแชร์ได้',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**ผิดพลาดได้** ไม่มีระบบรู้จำเสียงใดสมบูรณ์แบบ ควรตรวจสอบข้อความถอดเสียงทุกครั้งก่อนนำไปใช้กับเรื่องสำคัญ',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**ไม่มีคุกกี้ของเราเอง** เว็บไซต์เองไม่ตั้งคุกกี้ใด ๆ',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**ไม่มีอะไรถูกบันทึกไว้ใช้ภายหลัง** ไฟล์และข้อความถอดเสียงมีอยู่เฉพาะในเซสชันของคุณ ส่งออกสิ่งที่ต้องการก่อนออกจากหน้านี้ รายละเอียดอยู่ใน[นโยบายความเป็นส่วนตัว](/privacy)',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**ไม่มีอะไรถูกบันทึกไว้ใช้ภายหลัง** ข้อความถอดเสียงและไฟล์อยู่ในเบราว์เซอร์นี้เท่านั้น และจะถูกลบโดยอัตโนมัติเมื่อไม่มีการใช้งานนาน {idle} หรือเมื่อคุณกด **ลบข้อมูลของฉันตอนนี้** ส่งออกสิ่งที่ต้องการก่อนออกจากหน้านี้ รายละเอียดอยู่ใน[นโยบายความเป็นส่วนตัว](/privacy)',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**ไม่มีอะไรถูกบันทึกไว้ใช้ภายหลัง** ข้อความถอดเสียงมีอยู่เฉพาะในเซสชันนี้ ดังนั้นควรส่งออกสิ่งที่ต้องการ [นโยบายความเป็นส่วนตัว](/privacy) อธิบายเว็บไซต์ที่โฮสต์ไว้',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**ยอดรวมหนึ่งตัวเลข** เมื่อการถอดเสียงเสร็จสิ้น เบราว์เซอร์ของคุณจะส่ง “+1” แบบไม่ระบุตัวตนหนึ่งครั้งไปยังตัวนับของเรา (Cloudflare Worker) ซึ่งไม่มีไฟล์ ข้อความถอดเสียง หรือตัวระบุใด ๆ Cloudflare เห็นที่อยู่ IP ของคุณระหว่างการส่งผ่านและใช้ชั่วคราวเพื่อจำกัดการใช้งานในทางที่ผิด (การจำกัดอัตรา) เราเก็บเฉพาะยอดรวม ตัวเลขที่แสดงในส่วนหัวของหน้านี้รายงานโดยเบราว์เซอร์ของผู้เข้าชมและไม่ได้รับการตรวจสอบ',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    '**เลือกแม่นยำสูงหรือแม่นยำที่สุด** สำหรับเสียงที่ถอดยาก',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**เลือกคุณภาพและภาษา** โมเดลที่เร็วกว่าให้ร่างอย่างรวดเร็ว ส่วนโมเดลที่แม่นยำกว่าเหมาะกับการสัมภาษณ์ การบรรยาย และซับไตเติ้ล ระบบตรวจจับภาษาที่พูดให้ได้ และรองรับมากกว่า 50 ภาษา',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    '**ถอดเสียงอีกครั้ง** ข้อความถอดเสียงที่เสร็จแล้วด้วยคุณภาพหรือภาษาอื่น ข้อความถอดเสียงปัจจุบันของคุณจะยังอยู่',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    '**ถอดเสียงอีกครั้ง** ด้วยคุณภาพหรือภาษาอื่น ข้อความถอดเสียงปัจจุบันของคุณจะยังอยู่',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**อ่าน แก้ไข และดาวน์โหลด** ข้อความถอดเสียงจะปรากฏพร้อมไทม์สแตมป์ และคำที่โมเดลไม่มั่นใจจะมีเครื่องหมายไว้ให้ตรวจสอบ ดาวน์โหลดเป็นข้อความธรรมดา ซับไตเติ้ล SRT หรือ VTT, Markdown หรือ JSON',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**คำขอที่ส่งมอบเว็บไซต์** Cloudflare (Cloudflare Pages) ส่งมอบเว็บไซต์นี้ ในฐานะผู้ให้บริการโฮสติ้งและเครือข่ายของเรา Cloudflare ประมวลผลที่อยู่ IP ของคุณและข้อมูลคำขอตามปกติ (เช่น เวลา หน้าที่ร้องขอ และเบราว์เซอร์ของคุณ) เพื่อส่งมอบและปกป้องเว็บไซต์',
  '**Skip silence & music** — prevents made-up text':
    '**ข้ามช่วงเงียบและเพลง** — ป้องกันข้อความที่คิดขึ้นเอง',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**โมเดลรู้จำเสียงจะอยู่ในแคชของเบราว์เซอร์** (Cache Storage) การถอดเสียงครั้งถัดไปจึงเริ่มเร็วขึ้น จนกว่าคุณจะลบ (**ลบข้อมูลของฉันตอนนี้** ลบได้ด้วย) หรือเบราว์เซอร์ล้างพื้นที่จัดเก็บ โมเดลเป็นไฟล์โปรแกรม ไม่ใช่ข้อมูลของคุณ',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**ความเร็ว** ขึ้นอยู่กับคุณภาพที่เลือก ความยาวของไฟล์ และความหนาแน่นของผู้ใช้บริการ',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**ความเร็ว** ขึ้นอยู่กับอุปกรณ์ของคุณ คุณภาพที่เลือก และความยาวของไฟล์ การใช้ระดับคุณภาพครั้งแรกจะดาวน์โหลดโมเดลหนึ่งครั้ง: เบราว์เซอร์ของคุณดึงไฟล์โมเดลจาก Hugging Face และไฟล์โปรแกรมของเอนจินจาก jsDelivr แล้วเก็บไว้ในแคช เปิดแท็บค้างไว้ขณะทำงาน',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**เริ่มจากเสียงที่ดี**: เสียงรบกวนรอบข้างน้อย ไมโครโฟนอยู่ใกล้ปาก และพูดทีละคน เปิด “ปรับปรุงเสียง” ไว้',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**เริ่มจากเสียงที่ดี**: เสียงรบกวนน้อย ไมโครโฟนอยู่ใกล้ปาก พูดทีละคน เปิด “ปรับปรุงเสียง” ไว้',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**พื้นที่จัดเก็บในเบราว์เซอร์** เบราว์เซอร์ของคุณเก็บข้อความถอดเสียงและไฟล์ (IndexedDB) และโมเดลรู้จำเสียง (Cache Storage) ตามที่อธิบายข้างต้น จำค่าธีมสว่างหรือมืดที่คุณเลือก และที่เก็บเซสชันของเบราว์เซอร์จะเก็บการตั้งค่าอำนวยความสะดวกบางอย่างสำหรับแท็บปัจจุบัน (เช่น คุณภาพที่เลือกล่าสุด) ไม่มีสิ่งใดเหล่านี้ถูกส่งมาที่เรา',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    '**ซับไตเติ้ลและคำบรรยาย** สำหรับวิดีโอ รีล และคอร์สออนไลน์ของคุณเอง จากไฟล์ SRT หรือ VTT',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**ข้อความที่สร้างบนอุปกรณ์ของคุณ** ข้อความถอดเสียง ไทม์สแตมป์ และการแก้ไขของคุณ ชื่อที่คุณตั้ง และการตั้งค่าที่คุณเลือก (คุณภาพ ภาษา คำใบ้คำศัพท์) สิ่งเหล่านี้ถูกสร้างและเก็บไว้ในเบราว์เซอร์นี้ เราไม่เคยได้รับ',
  '**Use previous text as context** — can repeat on long files':
    '**ใช้ข้อความก่อนหน้าเป็นบริบท** — อาจทำให้ข้อความซ้ำในไฟล์ยาว',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**บันทึกเสียงช่วยจำ** ที่เขียนออกมาเป็นข้อความ ไม่ต้องฟังซ้ำอีก',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**ทำไมผลลัพธ์จึงต่างกันในแต่ละรอบ ในแต่ละระดับคุณภาพ หรือในเครื่องมืออื่น?** การรู้จำเสียงเป็นกระบวนการแบบความน่าจะเป็น: ระบบเลือกคำที่น่าจะเป็นไปได้มากที่สุด และในช่วงที่มีเสียงรบกวนหรือกำกวม คำตอบหลายแบบอาจใกล้เคียงกัน การตั้งค่าคุณภาพ การตั้งค่าภาษา คำใบ้คำศัพท์ หรือการล้างเสียงที่ต่างกันอาจทำให้ข้อความเปลี่ยนไป เครื่องมืออื่นที่ใช้ระบบต่างกันก็เช่นกัน ระบบไม่เพิ่มชื่อหรือป้ายกำกับผู้พูด',
  '**Word-level timing** — better subtitles and confidence marks':
    '**เวลาระดับคำ** — ซับไตเติ้ลที่ดีขึ้นและเครื่องหมายความมั่นใจ',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**ไฟล์และข้อความถอดเสียงของคุณอยู่ในเบราว์เซอร์นี้** ข้อความถอดเสียง การแก้ไข และไฟล์ต้นฉบับถูกเก็บไว้ในพื้นที่จัดเก็บของเบราว์เซอร์นี้ (IndexedDB) เท่านั้น และจะถูกลบโดยอัตโนมัติเมื่อเซสชันของคุณสิ้นสุดลง ซึ่งเกิดขึ้นหลังไม่มีการใช้งานนาน {idle} หรือทันทีเมื่อคุณกด **ลบข้อมูลของฉันตอนนี้** ในเมนูข้อความถอดเสียง',
  '1 file was skipped: not video or audio.': 'ข้ามไฟล์ 1 ไฟล์: ไม่ใช่วิดีโอหรือไฟล์เสียง',
  '1 minute': '1 นาที',
  '1 word': '1 คำ',
  '1. Agreement': '1. ข้อตกลง',
  '1. Who runs this website': '1. ใครเป็นผู้ดำเนินการเว็บไซต์นี้',
  '10. Children': '10. เด็ก',
  '10. Termination': '10. การยกเลิก',
  '11. Children': '11. เด็ก',
  '11. Your rights and choices': '11. สิทธิและทางเลือกของคุณ',
  '12. Changes': '12. การเปลี่ยนแปลง',
  '12. Open-source components': '12. ส่วนประกอบโอเพนซอร์ส',
  '13. Changes to this policy': '13. การเปลี่ยนแปลงนโยบายนี้',
  '13. Governing law': '13. กฎหมายที่ใช้บังคับ',
  '14. Contact': '14. ติดต่อ',
  '2. The service': '2. บริการ',
  '2. What is processed, and where': '2. ข้อมูลที่ประมวลผลและที่ใด',
  '3 simple steps': '3 ขั้นตอนง่าย ๆ',
  '3. Why it is processed': '3. เหตุผลที่ประมวลผลข้อมูล',
  '3. Your content': '3. เนื้อหาของคุณ',
  '4. Acceptable use': '4. การใช้งานที่ยอมรับได้',
  '4. How long it is kept': '4. ระยะเวลาที่เก็บข้อมูล',
  '5. Downloads your browser makes': '5. ไฟล์ที่เบราว์เซอร์ของคุณดาวน์โหลด',
  '5. Limits: your device does the work': '5. ขีดจำกัด: อุปกรณ์ของคุณทำงานเอง',
  '6. Accuracy: no warranty': '6. ความแม่นยำ: ไม่มีการรับประกัน',
  '6. Advertising': '6. การโฆษณา',
  '7. Availability': '7. ความพร้อมใช้งาน',
  '7. Cookies and browser storage': '7. คุกกี้และพื้นที่จัดเก็บของเบราว์เซอร์',
  '8. Sharing': '8. การแบ่งปัน',
  '8. Third-party downloads and ads': '8. การดาวน์โหลดและโฆษณาจากบุคคลที่สาม',
  '9. Liability': '9. ความรับผิด',
  '9. Security': '9. ความปลอดภัย',
  'A name cannot be empty, so the old name was kept.': 'ชื่อว่างไม่ได้ จึงคงชื่อเดิมไว้',
  'A new transcript has started. The old one is kept in your list.':
    'เริ่มข้อความถอดเสียงใหม่แล้ว ข้อความเก่ายังอยู่ในรายการของคุณ',
  'a period': 'ช่วงเวลาหนึ่ง',
  About: 'เกี่ยวกับ',
  'About {brand}': 'เกี่ยวกับ {brand}',
  'about {h} h': 'ประมาณ {h} ชม.',
  'about {h} h {m} min': 'ประมาณ {h} ชม. {m} นาที',
  'about {n} min': 'ประมาณ {n} นาที',
  'Accurate text': 'ข้อความที่แม่นยำ',
  'Add another file': 'เพิ่มไฟล์อีกไฟล์',
  'Add your file': 'เพิ่มไฟล์ของคุณ',
  'Ads appear only on information pages and beside finished transcripts, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    'โฆษณาจะปรากฏเฉพาะในหน้าข้อมูลและข้างข้อความถอดเสียงที่เสร็จแล้ว และแสดงโดย Google ซึ่งใช้คุกกี้ จะไม่แสดงโฆษณาขณะกำลังถอดเสียงไฟล์ และเว็บไซต์นี้ไม่ตั้งคุกกี้ของตัวเอง รายละเอียดอยู่ใน[นโยบายความเป็นส่วนตัว](/privacy)',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'ไม่มีฟีเจอร์ใดที่ต้องพึ่งโฆษณา: หากบล็อกหรือปฏิเสธโฆษณา ทุกอย่างก็ใช้งานได้เหมือนเดิม',
  'Ads keep TranscribeVid free. Everything works without them.':
    'โฆษณาช่วยให้ TranscribeVid ใช้ฟรี ทุกอย่างใช้งานได้โดยไม่ต้องมีโฆษณา',
  Advertisement: 'โฆษณา',
  'All free tools': 'เครื่องมือฟรีทั้งหมด',
  'All free video and audio to text tools': 'เครื่องมือแปลงวิดีโอและเสียงเป็นข้อความฟรีทั้งหมด',
  'All tools': 'เครื่องมือทั้งหมด',
  'All your data was deleted': 'ลบข้อมูลทั้งหมดของคุณแล้ว',
  'Allow the microphone in your browser, or choose a file instead.':
    'อนุญาตให้ใช้ไมโครโฟนในเบราว์เซอร์ หรือเลือกไฟล์แทน',
  'Already added': 'เพิ่มไว้แล้ว',
  'Already finished': 'เสร็จสิ้นแล้ว',
  'Also delete the downloaded speech models?': 'ลบโมเดลรู้จำเสียงที่ดาวน์โหลดไว้ด้วยหรือไม่?',
  'an independent software developer': 'นักพัฒนาซอฟต์แวร์อิสระ',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'กำลังอัปโหลดอยู่ รอให้เสร็จก่อนจึงเพิ่มไฟล์อื่น',
  'Apply style only': 'ใช้เฉพาะรูปแบบ',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    '“ใช้เฉพาะรูปแบบ” ใช้ผลการรู้จำเสียงที่บันทึกไว้โดยไม่ต้องประมวลผลเสียงอีกครั้ง บรรทัดที่แก้ไขแล้วจะคงไว้',
  'Audio works too.': 'ใช้กับไฟล์เสียงได้ด้วย',
  'Automatic (IndicXlit when installed)': 'อัตโนมัติ (IndicXlit เมื่อติดตั้งแล้ว)',
  Back: 'ย้อนกลับ',
  'Basic phonetic spelling': 'การสะกดตามเสียงแบบพื้นฐาน',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'เนื่องจากเราไม่มีบัญชีและไม่มีรายละเอียดที่ระบุตัวตนของคุณ โดยปกติเราจึงไม่สามารถเชื่อมโยงข้อมูลใด ๆ กับบุคคลได้ ในกรณีที่กฎหมายให้สิทธิแก่คุณเหนือข้อมูลส่วนบุคคล เช่น สิทธิในการเข้าถึง แก้ไข ลบ จำกัด คัดค้าน และโอนย้ายข้อมูล หรือสิทธิร้องเรียนต่อหน่วยงานคุ้มครองข้อมูลของคุณ คุณสามารถใช้สิทธิเหล่านั้นได้โดยติดต่อเรา:',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'เนื่องจากข้อความถอดเสียงของคุณอยู่ในเบราว์เซอร์นี้เท่านั้น ควรส่งออกสิ่งที่ต้องการก่อนออกจากหน้านี้ ข้อมูลที่ลบแล้วกู้คืนไม่ได้',
  'Bengaluru, India': 'เบงกาลูรู ประเทศอินเดีย',
  'Best accuracy': 'แม่นยำที่สุด',
  'Best accuracy, slowest': 'แม่นยำที่สุด ช้าที่สุด',
  Breadcrumb: 'เส้นทางนำทาง',
  'By file type': 'ตามประเภทไฟล์',
  'By language': 'ตามภาษา',
  'By use': 'ตามการใช้งาน',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    'การใช้ {brand} ({domain}) ถือว่าคุณยอมรับข้อกำหนดเหล่านี้ หากไม่ยอมรับ โปรดอย่าใช้บริการ บริการนี้ดำเนินการโดย **{name}** ที่ {address}',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'หลีกเลี่ยงหรือพยายามหลีกเลี่ยงการจำกัดอัตราหรือความปลอดภัยของเว็บไซต์หรือตัวนับของเว็บไซต์ หรือรบกวนการทำงานของเว็บไซต์หรือการใช้งานของผู้เข้าชมคนอื่น;',
  'Can I edit the transcript?': 'แก้ไขข้อความถอดเสียงได้ไหม?',
  "Can't reach the server.": 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้',
  Cancel: 'ยกเลิก',
  'Cancel "{title}"?': 'ยกเลิก “{title}” หรือไม่?',
  'Cancel {title}': 'ยกเลิก {title}',
  'Cancellation requested': 'ส่งคำขอยกเลิกแล้ว',
  Cancelled: 'ยกเลิกแล้ว',
  'Cancelling…': 'กำลังยกเลิก…',
  'Cannot reach the server': 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้',
  'Cannot reach the server.': 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้',
  'Cannot reach the server. Check your connection and try again.':
    'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ตรวจสอบว่าเซิร์ฟเวอร์ทำงานอยู่ (npm run dev) แล้วลองอีกครั้ง',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'แก้ไขหรือลบบรรทัด หรือค้นหาและแทนที่ การแก้ไขของคุณจะอยู่ในทุกไฟล์ที่ดาวน์โหลด',
  'Changed in {n} lines.': 'เปลี่ยนแปลงใน {n} บรรทัด',
  'Check Hinglish spelling': 'ตรวจการสะกดฮิงลิช',
  'Choose "Save as PDF" in the print dialog.': 'เลือก “บันทึกเป็น PDF” ในกล่องโต้ตอบการพิมพ์',
  'Choose a file': 'เลือกไฟล์',
  'Choose a file first': 'เลือกไฟล์ก่อน',
  'Choose a format': 'เลือกรูปแบบ',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'เลือกโมเดลที่เร็วกว่าหรือแม่นยำกว่าได้ตามอุปกรณ์และเวลาที่คุณมี',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'เลือกเร็วที่สุด มาตรฐาน แม่นยำสูง หรือแม่นยำที่สุด: เร็วที่สุดให้ผลไวที่สุด ส่วนแม่นยำที่สุดผิดพลาดน้อยที่สุด',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'เลือกภาษาที่พูด หรือปล่อยไว้ที่ตรวจจับอัตโนมัติ คุณยังแปลเสียงพูดเป็นภาษาอังกฤษได้ด้วย',
  'Chosen files': 'ไฟล์ที่เลือก',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'เสียงพูดชัดและอยู่ใกล้ไมโครโฟนให้ผลดีที่สุด ภายใต้ตัวเลือกเพิ่มเติม **ปรับปรุงเสียง** และ **ข้ามช่วงเงียบและเพลง** เปิดอยู่เป็นค่าเริ่มต้น: สองตัวเลือกนี้กรองเสียงครางและเสียงซ่า และกันไม่ให้โมเดลคิดข้อความขึ้นเองระหว่างเพลงหรือช่วงเงียบนาน ๆ จึงควรเปิดไว้กับการบันทึกที่มีเสียงรบกวน สำหรับซับไตเติ้ล ให้เปิด **เวลาระดับคำ** ไว้ด้วย เพื่อให้แต่ละบรรทัดเริ่มและจบตรงกับคำพอดี',
  Close: 'ปิด',
  'Close menu': 'ปิดเมนู',
  'Close: {title}': 'ปิด: {title}',
  'Common questions': 'คำถามที่พบบ่อย',
  Contact: 'ติดต่อ',
  'Converting…': 'กำลังแปลง…',
  Copied: 'คัดลอกแล้ว',
  'Copy text': 'คัดลอกข้อความ',
  'Copying…': 'กำลังคัดลอก…',
  'Could not cancel the transcript.': 'ยกเลิกข้อความถอดเสียงไม่ได้',
  'Could not change transcript style.': 'เปลี่ยนรูปแบบการถอดเสียงไม่ได้',
  'Could not copy': 'คัดลอกไม่ได้',
  'Could not delete the transcript.': 'ลบข้อความถอดเสียงไม่ได้',
  'Could not delete your data.': 'ลบข้อมูลของคุณไม่ได้',
  'Could not load the text to copy.': 'โหลดข้อความที่จะคัดลอกไม่ได้',
  'Could not prepare the file. Please try again.': 'เตรียมไฟล์ไม่ได้ โปรดลองอีกครั้ง',
  'Could not rename the transcript.': 'เปลี่ยนชื่อข้อความถอดเสียงไม่ได้',
  'Could not save the change.': 'บันทึกการเปลี่ยนแปลงไม่ได้',
  'Could not start': 'เริ่มไม่ได้',
  'Could not start.': 'เริ่มไม่ได้',
  Dark: 'มืด',
  Delete: 'ลบ',
  'Delete "{title}" and its transcript?': 'ลบ “{title}” และข้อความถอดเสียงหรือไม่?',
  'Delete "{title}"? This cannot be undone.': 'ลบ “{title}” หรือไม่? ย้อนกลับไม่ได้',
  'Delete {title}': 'ลบ {title}',
  'Delete all your transcripts and the files kept in this browser now?':
    'ลบข้อความถอดเสียงทั้งหมดและไฟล์ที่เก็บไว้ในเบราว์เซอร์นี้ตอนนี้หรือไม่?',
  'Delete all your transcripts and uploaded files now?':
    'ลบข้อความถอดเสียงทั้งหมดและไฟล์ที่อัปโหลดตอนนี้หรือไม่?',
  'Delete line': 'ลบบรรทัด',
  'Delete my data now': 'ลบข้อมูลของฉันตอนนี้',
  'Delete this line from the transcript?': 'ลบบรรทัดนี้ออกจากข้อความถอดเสียงหรือไม่?',
  'Delete transcript': 'ลบข้อความถอดเสียง',
  Deleted: 'ลบแล้ว',
  'Detect automatically': 'ตรวจจับอัตโนมัติ',
  'Dismiss message': 'ปิดข้อความ',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3 เข้าใจเฉพาะเสียงพูดภาษาอังกฤษ เลือกโมเดลอื่นเพื่อแปล',
  Done: 'เสร็จแล้ว',
  'Download failed': 'ดาวน์โหลดไม่สำเร็จ',
  'Download started': 'เริ่มดาวน์โหลดแล้ว',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'ดาวน์โหลดผลลัพธ์เป็นข้อความธรรมดา ซับไตเติ้ล SRT หรือ VTT, Markdown หรือ JSON',
  'Download the transcript as': 'ดาวน์โหลดข้อความถอดเสียงเป็น',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'กำลังดาวน์โหลดโมเดลรู้จำเสียง (ครั้งแรกเท่านั้น): {loaded} จาก {total}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    'วางไฟล์วิดีโอหรือไฟล์เสียงที่[หน้าแรก](/) หรือบันทึกจากไมโครโฟนของคุณ',
  'Drop to add your file': 'วางเพื่อเพิ่มไฟล์ของคุณ',
  'Drop your {noun} here, or choose a file': 'วาง{noun}ที่นี่ หรือเลือกไฟล์',
  'Each line with its time, like [00:12]': 'แต่ละบรรทัดมีเวลากำกับ เช่น [00:12]',
  Edit: 'แก้ไข',
  'Edit it right here': 'แก้ไขได้ตรงนี้เลย',
  'Edit this line': 'แก้ไขบรรทัดนี้',
  'Edited by you': 'แก้ไขโดยคุณ',
  'English only, very fast and accurate': 'ภาษาอังกฤษเท่านั้น เร็วมากและแม่นยำ',
  'English translation is selected in More options.':
    'เลือกการแปลเป็นภาษาอังกฤษไว้ในตัวเลือกเพิ่มเติม',
  'Enter saves · Esc cancels': 'Enter เพื่อบันทึก · Esc เพื่อยกเลิก',
  'Every line has a time. Play the media from any line to hear what was said.':
    'ทุกบรรทัดมีเวลา เล่นสื่อจากบรรทัดใดก็ได้เพื่อฟังว่าพูดอะไร',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'ทุกหน้าทำหน้าที่เดียวกัน: เปลี่ยนเสียงพูดในไฟล์วิดีโอหรือไฟล์เสียงให้เป็นข้อความพร้อมไทม์สแตมป์ทุกบรรทัด ในมากกว่า 50 ภาษา โดยไม่ต้องสมัครสมาชิก เลือกหน้าที่ตรงกับไฟล์ที่คุณมีหรือสิ่งที่คุณต้องการสร้าง',
  'Experimental: compare on your audio; chunk timestamps':
    'ทดลอง: เปรียบเทียบกับเสียงของคุณ ไทม์สแตมป์ระดับช่วง',
  'Experimental: larger model; chunk timestamps': 'ทดลอง: โมเดลที่ใหญ่กว่า ไทม์สแตมป์ระดับช่วง',
  Export: 'ส่งออก',
  Failed: 'ไม่สำเร็จ',
  FAQ: 'FAQ',
  Fast: 'เร็ว',
  'Fast, clean audio': 'เร็ว เหมาะกับเสียงที่ชัด',
  Fastest: 'เร็วที่สุด',
  'Fastest, rough drafts only': 'เร็วที่สุด ใช้ได้เฉพาะร่างหยาบ',
  'Fewer mistakes. Takes longer.': 'ผิดพลาดน้อยลง ใช้เวลานานขึ้น',
  'Fewest mistakes. Takes the longest.': 'ผิดพลาดน้อยที่สุด ใช้เวลานานที่สุด',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    'ไฟล์ “{name}” มีขนาด {size} แต่ขีดจำกัดคือ {limit} - ตั้งค่า VT_MAX_UPLOAD_MB เพื่อเพิ่ม',
  'File "{name}" is {size}; the limit is {limit}.':
    'ไฟล์ “{name}” มีขนาด {size} แต่ขีดจำกัดคือ {limit}',
  'file {n} of {total}': 'ไฟล์ที่ {n} จาก {total}',
  'File added': 'เพิ่มไฟล์แล้ว',
  'File limits.': 'ขีดจำกัดของไฟล์',
  'File not added': 'ไม่ได้เพิ่มไฟล์',
  'File skipped': 'ข้ามไฟล์แล้ว',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'ไฟล์และข้อความถอดเสียงมีอยู่เฉพาะในเซสชันของคุณ ส่งออกสิ่งที่ต้องการก่อนออกจากหน้านี้ สิ่งเดียวที่เราเก็บไว้คือยอดรวมแบบไม่ระบุตัวตนหนึ่งตัวเลขว่ามีการถอดเสียงไฟล์บนเว็บไซต์ไปแล้วกี่ไฟล์ (ตัวเลขเดียว แสดงในส่วนหัวของหน้า) ซึ่งไม่เชื่อมโยงกับคุณ ไฟล์ของคุณ หรือเซสชันของคุณ รายละเอียดอยู่ใน[นโยบายความเป็นส่วนตัว](/privacy)',
  'Find it automatically': 'ตรวจจับอัตโนมัติ',
  'first time only, also downloads the {size} MB word-timing model':
    'ครั้งแรกเท่านั้น และจะดาวน์โหลดโมเดลเวลาระดับคำ {size} MB ด้วย',
  'First time only: downloads {size} (needs internet)':
    'ครั้งแรกเท่านั้น: ดาวน์โหลด {size} (ต้องใช้อินเทอร์เน็ต)',
  'Follow playback': 'ตามการเล่น',
  'Following playback': 'กำลังตามการเล่น',
  Footer: 'ส่วนท้ายหน้า',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'สำหรับเสียงที่มีสำเนียงหรือผสมหลายภาษา ลองใช้การตั้งค่าคุณภาพที่สูงขึ้น คะแนนความมั่นใจไม่ใช่เปอร์เซ็นต์ความแม่นยำ',
  'For developers: words, times, confidence': 'สำหรับนักพัฒนา: คำ เวลา ความมั่นใจ',
  'For notes apps': 'สำหรับแอปจดบันทึก',
  'For video players and editors': 'สำหรับเครื่องเล่นวิดีโอและโปรแกรมตัดต่อ',
  'For YouTube and web video': 'สำหรับ YouTube และวิดีโอบนเว็บ',
  Free: 'ฟรี',
  'Free tools': 'เครื่องมือฟรี',
  'Free tools:': 'เครื่องมือฟรี:',
  'Free video and audio to text': 'แปลงวิดีโอและเสียงเป็นข้อความฟรี',
  'Free video and audio to text, right in your browser':
    'แปลงวิดีโอและเสียงเป็นข้อความฟรี ในเบราว์เซอร์ของคุณเลย',
  'Free, unlimited, and no login needed': 'ฟรี ไม่จำกัด และไม่ต้องเข้าสู่ระบบ',
  'Free, unlimited, no login': 'ฟรี ไม่จำกัด ไม่ต้องเข้าสู่ระบบ',
  'Frequently asked questions': 'คำถามที่พบบ่อย',
  'Get in touch': 'ติดต่อเรา',
  'Getting the speech engine ready…': 'กำลังเตรียมเอนจินรู้จำเสียง…',
  'Give it a new name': 'ตั้งชื่อใหม่',
  'Go to the home page': 'ไปที่หน้าแรก',
  'Go to Video to text': 'ไปที่หน้าวิดีโอเป็นข้อความ',
  'Good balance (default)': 'สมดุลดี (ค่าเริ่มต้น)',
  'Good for most videos. Not sure? Keep this one.':
    'เหมาะกับวิดีโอส่วนใหญ่ ไม่แน่ใจ? ใช้ตัวนี้ได้เลย',
  'Good to know': 'ควรรู้',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'โหลดเครื่องมือขอความยินยอมของ Google ไม่ได้ อาจเพราะตัวบล็อกโฆษณาหรือเครือข่ายขวางไว้ หากไม่มีเครื่องมือนี้ จะไม่โหลดโฆษณาและคุกกี้โฆษณา',
  Guides: 'คู่มือ',
  'Guides: transcripts and subtitles': 'คู่มือ: ข้อความถอดเสียงและซับไตเติ้ล',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'มีคำถาม พบข้อบกพร่อง หรืออยากเสนอฟีเจอร์ใช่ไหม? ส่งอีเมลถึง {email} ทุกข้อความมีคนที่สร้าง {brand} อ่านเอง และมักจะได้คำตอบภายในไม่กี่วันทำการ',
  'Helps spell uncommon words correctly.': 'ช่วยให้สะกดคำที่ไม่ค่อยพบได้ถูกต้อง',
  'High accuracy': 'แม่นยำสูง',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    'แม่นยำสูง (Large v3 Turbo) ไม่ได้รับการฝึกให้แปล และอาจให้ผลเป็นภาษาต้นฉบับ สำหรับการแปล ให้เลือกมาตรฐานหรือแม่นยำที่สุด',
  'High accuracy, slower': 'แม่นยำสูง ช้ากว่า',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    'ค่าสูงขึ้นแม่นยำขึ้นเล็กน้อยแต่ช้าลง 5 เป็นค่าเริ่มต้นที่ดี',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'ภาษาฮินดีเขียนด้วยตัวอักษรอังกฤษ โดยคงคำภาษาอังกฤษไว้ ภาษาอื่นคงอักษรเดิมของตน ควรตรวจคำและชื่อที่ไม่คุ้นเคย',
  'Hinglish (Roman Hindi)': 'ฮิงลิช (ภาษาฮินดีอักษรโรมัน)',
  'Hinglish conversion': 'การแปลงฮิงลิช',
  History: 'ประวัติ',
  Home: 'หน้าแรก',
  'How {brand} works': '{brand} ทำงานอย่างไร',
  'How accurate is it?': 'แม่นยำแค่ไหน?',
  'How do I get better accuracy?': 'ทำอย่างไรให้แม่นยำขึ้น?',
  'How it stays free': 'ทำไมจึงใช้ฟรีได้',
  'How it works': 'วิธีการทำงาน',
  'How long does it take?': 'ใช้เวลานานแค่ไหน?',
  'How to transcribe a video to text': 'วิธีถอดเสียงวิดีโอเป็นข้อความ',
  'How to turn a video or audio file into text with {brand}':
    'วิธีเปลี่ยนไฟล์วิดีโอหรือไฟล์เสียงเป็นข้อความด้วย {brand}',
  'If it does have speech, try More › Re-transcribe with the right language.':
    'หากมีเสียงพูดอยู่จริง ให้ลอง เพิ่มเติม › ถอดเสียงอีกครั้ง โดยเลือกภาษาที่ถูกต้อง',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'หากบริการไม่ว่างหรือมีข้อความถอดเสียงที่กำลังทำงานอยู่มากเกินไป ระบบจะขอให้รอและบอกเหตุผล',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'หากเราเปลี่ยนนโยบายนี้ เวอร์ชันใหม่จะปรากฏในหน้านี้พร้อมวันที่ “อัปเดตล่าสุด” ใหม่',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'ใน EEA สหราชอาณาจักร และสวิตเซอร์แลนด์ รวมถึงบางรัฐในสหรัฐอเมริกา ข้อความขอความยินยอมที่ Google รับรองจะถามตัวเลือกของคุณเมื่อโฆษณาโหลด',
  'IndicXlit (trained model)': 'IndicXlit (โมเดลที่ผ่านการฝึก)',
  'Is it really free and unlimited? Do I need to log in?':
    'ฟรีและไม่จำกัดจริงหรือ? ต้องเข้าสู่ระบบไหม?',
  'Is my data private?': 'ข้อมูลของฉันเป็นส่วนตัวหรือไม่?',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    'ขึ้นอยู่กับคุณภาพที่เลือก ความยาวของไฟล์ และความหนาแน่นของผู้ใช้บริการ ตัวเลือกเร็วที่สุดให้ผลไว ส่วนแม่นยำที่สุดใช้เวลานานที่สุดแต่ผิดพลาดน้อยที่สุด ความคืบหน้าและเวลาที่เหลือแสดงแบบสด และไฟล์ที่รอคิวจะแสดง “กำลังรอในคิว”',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'ขึ้นอยู่กับอุปกรณ์ของคุณ คุณภาพที่เลือก และความยาวของไฟล์ หากมีชิปกราฟิกที่รองรับ (WebGPU) จะเร็วที่สุด มิฉะนั้นจะทำงานบนตัวประมวลผล (WebAssembly) ซึ่งช้ากว่า ตัวเลือกเร็วที่สุดให้ผลไว ส่วนแม่นยำที่สุดใช้เวลานานที่สุดแต่ผิดพลาดน้อยที่สุด ความคืบหน้าและเวลาที่เหลือแสดงแบบสด',
  'It is now called “{title}”.': 'ตอนนี้ชื่อ “{title}” แล้ว',
  'It may have been deleted.': 'อาจถูกลบไปแล้ว',
  'It was stopped before any text was found.': 'หยุดก่อนที่จะพบข้อความใด ๆ',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'ข้อมูลของเซสชันถูกลบแล้ว รวมถึงข้อความถอดเสียงนี้ ข้อความถอดเสียงถูกเก็บไว้เฉพาะเซสชันที่สร้างขึ้นเท่านั้น',
  'Job not found': 'ไม่พบงาน',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'เมื่อสักครู่',
  'Just the words, in paragraphs': 'เฉพาะคำพูด แบ่งเป็นย่อหน้า',
  'Keep reading': 'อ่านต่อ',
  'Keep this page open until the upload is done.': 'เปิดหน้านี้ค้างไว้จนกว่าการอัปโหลดจะเสร็จ',
  'Kept only for this session, then deleted automatically.':
    'เก็บไว้เฉพาะเซสชันนี้ แล้วลบโดยอัตโนมัติ',
  Language: 'ภาษา',
  'Larger or longer files are refused before they are processed, so split them first.':
    'ไฟล์ที่ใหญ่หรือยาวเกินไปจะถูกปฏิเสธก่อนประมวลผล จึงควรแบ่งไฟล์ก่อน',
  'Last updated: {date}': 'อัปเดตล่าสุด: {date}',
  'Licence text': 'ข้อความสัญญาอนุญาต',
  Light: 'สว่าง',
  'Limits.': 'ขีดจำกัด',
  'Line deleted': 'ลบบรรทัดแล้ว',
  'Live: the text appears here as it is recognised': 'สด: ข้อความจะปรากฏที่นี่ขณะที่ระบบรู้จำเสียง',
  'Loading model… (first use downloads it)': 'กำลังโหลดโมเดล… (ใช้ครั้งแรกจะดาวน์โหลด)',
  'Loading…': 'กำลังโหลด…',
  'Long (56 letters)': 'ยาว (56 ตัวอักษร)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'คำตอบแบบยาว: รูปแบบไฟล์ ซับไตเติ้ล ความแม่นยำ และความเป็นส่วนตัว',
  Main: 'หลัก',
  'Make a new transcript of the same file. This one is kept.':
    'สร้างข้อความถอดเสียงใหม่จากไฟล์เดิม ข้อความนี้จะยังอยู่',
  'Make a subtitle file (SRT or VTT) from your video.':
    'สร้างไฟล์ซับไตเติ้ล (SRT หรือ VTT) จากวิดีโอของคุณ',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'เมนู',
  Model: 'โมเดล',
  More: 'เพิ่มเติม',
  'More answers: [Frequently asked questions](/faq)': 'คำตอบเพิ่มเติม: [คำถามที่พบบ่อย](/faq)',
  'More free tools': 'เครื่องมือฟรีอื่น ๆ',
  'More options': 'ตัวเลือกเพิ่มเติม',
  'More than 50 languages': 'มากกว่า 50 ภาษา',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    'มากกว่า 50 ภาษา รวมถึงอังกฤษ สเปน ฝรั่งเศส เยอรมัน โปรตุเกส อิตาลี ดัตช์ รัสเซีย อาหรับ ฮินดี จีน ญี่ปุ่น และเกาหลี ปล่อยภาษาไว้ที่ตรวจจับอัตโนมัติหรือเลือกเองก็ได้ คุณยังแปลเสียงพูดเป็นภาษาอังกฤษได้ด้วย',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'เว็บถอดเสียงส่วนใหญ่ให้สร้างบัญชี จำกัดนาทีฟรี ใส่ลายน้ำ หรือกดดันให้สมัครสมาชิกก่อนที่คุณจะเห็นข้อความแม้แต่บรรทัดเดียว {brand} ทำตรงกันข้าม ทุกอย่างที่มีให้ใช้ได้กับทุกคน และหน้าเว็บไม่ขออะไรนอกจากไฟล์ของคุณ',
  'Name not changed': 'ไม่ได้เปลี่ยนชื่อ',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    'ชื่อ แบรนด์ และศัพท์เฉพาะในเสียง เช่น Kubernetes, Dr. Okafor',
  'Near-best accuracy, much faster than Large': 'แม่นยำเกือบที่สุด เร็วกว่า Large มาก',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'ต้องใช้การรองรับเชเดอร์ 16 บิต (shader-f16) ในไดรเวอร์กราฟิก',
  'needs 4 GB': 'ต้องใช้ 4 GB',
  'needs 8 GB': 'ต้องใช้ 8 GB',
  'needs a graphics-capable browser (Chrome, Edge)':
    'ต้องใช้เบราว์เซอร์ที่รองรับกราฟิก (Chrome, Edge)',
  'needs WebGPU': 'ต้องใช้ WebGPU',
  'Next match': 'ผลที่ตรงกันถัดไป',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'ไม่มีบัญชีและไม่มีการติดตาม ไฟล์ของคุณถูกเก็บไว้เฉพาะเซสชันของคุณและลบโดยอัตโนมัติ',
  'no estimate for this model here': 'ไม่มีค่าประมาณสำหรับโมเดลนี้ที่นี่',
  'No login': 'ไม่ต้องเข้าสู่ระบบ',
  'No matches': 'ไม่พบรายการที่ตรงกัน',
  'No microphone': 'ไม่มีไมโครโฟน',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'ไม่ต้องสมัคร ไม่ต้องจ่ายเงิน ไม่มีขีดจำกัดรายวัน เพียงเพิ่มไฟล์ของคุณ',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'ขณะนี้เซิร์ฟเวอร์ไม่ได้ประกาศขีดจำกัดขนาดหรือความยาวใดไว้ ไฟล์ขนาดใหญ่มากก็แค่ใช้เวลานานขึ้น',
  'No speech was found in this file.': 'ไม่พบเสียงพูดในไฟล์นี้',
  'No speech was transcribed.': 'ไม่มีเสียงพูดที่ถูกถอดเสียง',
  'No speech was transcribed. Check the recording and the selected language.':
    'ไม่มีเสียงพูดที่ถูกถอดเสียง ตรวจสอบการบันทึกและภาษาที่เลือก',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'ที่นี่ไม่มี WebGPU: โมเดลจะรันบนเธรด CPU เดียว ขนาดที่ใหญ่กว่าจึงช้ากว่าเวลาจริง',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'ไม่มีไฟล์ของคนอื่นอยู่ก่อนไฟล์ของคุณ หากเพิ่มหลายไฟล์ ระบบจะถอดเสียงทีละไฟล์ในแท็บของคุณ จึงควรเปิดแท็บค้างไว้จนกว่าจะเสร็จ',
  'None of those are video or audio files.': 'ไม่มีไฟล์ใดเป็นวิดีโอหรือไฟล์เสียง',
  Normal: 'ปกติ',
  'not available for this size': 'ไม่มีสำหรับขนาดนี้',
  'not available in this browser': 'ไม่มีในเบราว์เซอร์นี้',
  'not available with Qwen (times are per chunk)': 'ไม่มีใน Qwen (เวลาเป็นรายช่วง)',
  'Not cancelled': 'ไม่ได้ยกเลิก',
  'Not deleted': 'ไม่ได้ลบ',
  'Not renamed': 'ไม่ได้เปลี่ยนชื่อ',
  'Not saved': 'ไม่ได้บันทึก',
  Note: 'หมายเหตุ',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'ยังไม่มีอะไรที่นี่ ข้อความถอดเสียงที่คุณสร้างจะปรากฏที่นี่ตลอดเซสชันนี้',
  'Nothing is saved. Export what you need.': 'ไม่มีอะไรถูกบันทึกไว้ ส่งออกสิ่งที่ต้องการ',
  'Nothing is uploaded until you press Transcribe.': 'ไม่มีอะไรถูกอัปโหลดจนกว่าคุณจะกดถอดเสียง',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'ไม่ต้องสมัคร ไม่ต้องจ่ายเงิน เพียงเพิ่มไฟล์ของคุณ',
  'Nothing was recorded.': 'ไม่ได้บันทึกอะไรเลย',
  Off: 'ปิด',
  On: 'เปิด',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'หากเป็นเสียงพูดที่ชัดในภาษาที่รองรับ มักแม่นยำมาก แต่ไม่มีระบบรู้จำเสียงใดสมบูรณ์แบบ ความแม่นยำขึ้นอยู่กับคุณภาพเสียง สำเนียง เสียงรบกวนพื้นหลัง ผู้พูดพูดทับกัน เสียงเพลง รวมถึงชื่อเฉพาะที่หายากและศัพท์เฉพาะ ทุกบรรทัดมีคะแนนความมั่นใจ และบรรทัดที่มั่นใจต่ำจะถูกทำเครื่องหมายไว้ให้คุณตรวจก่อน ควรตรวจสอบข้อความถอดเสียงทุกครั้งก่อนนำไปใช้กับเรื่องสำคัญ',
  'Open menu': 'เปิดเมนู',
  'Opening your transcript…': 'กำลังเปิดข้อความถอดเสียงของคุณ…',
  'or drop it anywhere on this page.': 'หรือวางไว้ที่ใดก็ได้ในหน้านี้',
  'Original script': 'อักษรต้นฉบับ',
  Output: 'ผลลัพธ์',
  'Page {page} of {pages}': 'หน้า {page} จาก {pages}',
  'Page not found': 'ไม่พบหน้านี้',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'หน้าสำหรับไฟล์ที่คุณมีอยู่แล้ว: WAV, M4A, WebM และ MOV',
  'PDF document (.pdf)': 'เอกสาร PDF (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'เบราว์เซอร์ของคุณเป็นผู้สร้าง PDF: เลือก “บันทึกเป็น PDF” ในกล่องโต้ตอบการพิมพ์',
  'Pick quality': 'เลือกคุณภาพ',
  'Plain text (.txt)': 'ข้อความธรรมดา (.txt)',
  'Play from here': 'เล่นจากตรงนี้',
  'Playback speed': 'ความเร็วในการเล่น',
  'Please add one file at a time here. You can add more files on the next page.':
    'โปรดเพิ่มทีละไฟล์ที่นี่ คุณเพิ่มไฟล์อื่นได้ในหน้าถัดไป',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'โปรดอย่าส่งการบันทึกที่เป็นส่วนตัวมาให้ {brand} ถอดเสียงไฟล์ของคุณบนอุปกรณ์ของคุณเอง และเราไม่เคยได้รับไฟล์เหล่านั้น เราจึงไม่จำเป็นต้องใช้เพื่อช่วยคุณ',
  'Please note': 'โปรดทราบ',
  Preparing: 'กำลังเตรียม',
  'Preparing audio…': 'กำลังเตรียมเสียง…',
  'Preparing the audio…': 'กำลังเตรียมเสียง…',
  'Preparing…': 'กำลังเตรียม…',
  'Press a question to read its answer.': 'กดที่คำถามเพื่ออ่านคำตอบ',
  'Previous match': 'ผลที่ตรงกันก่อนหน้า',
  'Print to PDF': 'พิมพ์เป็น PDF',
  Privacy: 'ความเป็นส่วนตัว',
  'Privacy and cookie settings': 'การตั้งค่าความเป็นส่วนตัวและคุกกี้',
  'Privacy policy': 'นโยบายความเป็นส่วนตัว',
  'Privacy requests': 'คำขอด้านความเป็นส่วนตัว',
  Private: 'ส่วนตัว',
  Progress: 'ความคืบหน้า',
  Quality: 'คุณภาพ',
  'Questions about these terms:': 'คำถามเกี่ยวกับข้อกำหนดเหล่านี้:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'ยินดีรับคำถาม รายงานข้อบกพร่อง และไอเดียเสมอ เขียนถึง {email} หรือดูหน้า[ติดต่อ](/contact)ว่าควรระบุอะไรบ้าง',
  Queued: 'รอในคิว',
  'Quick results. Good for clear speech.': 'ได้ผลไว เหมาะกับเสียงที่ชัด',
  Quickest: 'เร็วที่สุด',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'Qwen ใช้ไทม์สแตมป์โดยประมาณเป็นช่วง ไม่มีเวลาระดับคำและความมั่นใจ',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'Qwen ใช้ไทม์สแตมป์เป็นช่วงและไม่ให้ความมั่นใจระดับคำ ควรเทียบตัวอย่างสั้น ๆ ก่อนเลือกใช้',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (ทดลอง)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASR ต้องใช้เบราว์เซอร์บนเดสก์ท็อปที่รองรับ WebGPU (Chrome หรือ Edge) และไดรเวอร์กราฟิกที่รองรับเชเดอร์ 16 บิต (shader-f16)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASR ต้องใช้เบราว์เซอร์บนเดสก์ท็อปที่รองรับ WebGPU (Chrome หรือ Edge) และหน่วยความจำ 8 GB',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASR ต้องใช้เบราว์เซอร์บนเดสก์ท็อปที่รองรับ WebGPU (Chrome หรือ Edge)',
  'Re-transcribe': 'ถอดเสียงอีกครั้ง',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'อ่านข้อความถอดเสียงพร้อมไทม์สแตมป์ ดูว่าโมเดลไม่มั่นใจคำใด และแก้ไขได้ตรงนั้นเลย',
  'Read, edit, download': 'อ่าน แก้ไข ดาวน์โหลด',
  Ready: 'พร้อม',
  'Ready to print or share': 'พร้อมพิมพ์หรือแชร์',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    'พร้อมลองแล้วหรือยัง? [ดูเครื่องมือฟรีทั้งหมด](/tools) หรือ[ถอดเสียงไฟล์ตอนนี้](/)',
  'Recognition engine': 'เอนจินรู้จำเสียง',
  Recommended: 'แนะนำ',
  'Record from microphone': 'บันทึกจากไมโครโฟน',
  'Record straight from your microphone and turn it into text.':
    'บันทึกจากไมโครโฟนโดยตรงแล้วเปลี่ยนเป็นข้อความ',
  'Record with your microphone': 'บันทึกเสียงด้วยไมโครโฟน',
  'Recording {stamp}': 'การบันทึก {stamp}',
  'Recording is not supported by this browser.': 'เบราว์เซอร์นี้ไม่รองรับการบันทึกเสียง',
  'Related reading': 'บทความที่เกี่ยวข้อง',
  Remove: 'นำออก',
  'Remove {name}': 'นำ {name} ออก',
  'Removes it for good': 'ลบทิ้งถาวร',
  Rename: 'เปลี่ยนชื่อ',
  Renamed: 'เปลี่ยนชื่อแล้ว',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    'แทนที่ “{query}” ด้วย “{replacement}” ใน {n} บรรทัดหรือไม่?',
  'Replace "{query}" with "{replacement}" in 1 line?':
    'แทนที่ “{query}” ด้วย “{replacement}” ใน 1 บรรทัดหรือไม่?',
  'Replace in {n} lines': 'แทนที่ใน {n} บรรทัด',
  'Replace in 1 line': 'แทนที่ใน 1 บรรทัด',
  'Replace with': 'แทนที่ด้วย',
  'Replace with…': 'แทนที่ด้วย…',
  'Replace…': 'แทนที่…',
  Replaced: 'แทนที่แล้ว',
  'Reporting a problem': 'การแจ้งปัญหา',
  'Retrying…': 'กำลังลองอีกครั้ง…',
  'Review language and quality': 'ตรวจสอบภาษาและคุณภาพ',
  'Review this transcript': 'ตรวจทานข้อความถอดเสียงนี้',
  Save: 'บันทึก',
  Saved: 'บันทึกแล้ว',
  'Saving…': 'กำลังบันทึก…',
  'Search depth: {n}': 'ความลึกในการค้นหา: {n}',
  'Search the text': 'ค้นหาในข้อความ',
  'Search the transcript': 'ค้นหาในข้อความถอดเสียง',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'ดูเพิ่มเติมที่[ข้อกำหนดการใช้งาน](/terms) [วิธีการทำงาน](/how-it-works) และ[คำถามที่พบบ่อย](/faq)',
  'Server busy': 'เซิร์ฟเวอร์ไม่ว่าง',
  'Session only — nothing is saved.': 'เฉพาะเซสชัน — ไม่มีอะไรถูกบันทึกไว้',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'เฉพาะเซสชัน — ไม่มีอะไรถูกบันทึกไว้ การปิดแอปจะลบข้อความถอดเสียงทั้งหมด ส่งออกสิ่งที่ต้องการ',
  'Session time left: about {n} min': 'เวลาเซสชันที่เหลือ: ประมาณ {n} นาที',
  'Short (32 letters)': 'สั้น (32 ตัวอักษร)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'คำตอบสั้น ๆ ที่ใช้ได้จริงเกี่ยวกับการเปลี่ยนเสียงพูดเป็นข้อความและซับไตเติ้ล: เลือกรูปแบบซับไตเติ้ลอะไร เพิ่มซับไตเติ้ลให้วิดีโออย่างไร ทำอย่างไรให้ข้อความถอดเสียงแม่นยำขึ้น และการถอดเสียงทำงานในเบราว์เซอร์ของคุณเองได้อย่างไรโดยไม่ต้องอัปโหลดไฟล์',
  'Show all {count} languages': 'แสดงทั้ง {count} ภาษา',
  'Six ways to download': 'ดาวน์โหลดได้ 6 วิธี',
  'Skip to main content': 'ข้ามไปยังเนื้อหาหลัก',
  Slower: 'ช้ากว่า',
  'slower than real time on the measured laptop': 'ช้ากว่าเวลาจริงบนแล็ปท็อปที่วัดผล',
  Slowest: 'ช้าที่สุด',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'บางฟีเจอร์จะดาวน์โหลดส่วนประกอบโอเพนซอร์สลงในเบราว์เซอร์เมื่อคุณใช้งาน ส่วนประกอบเหล่านี้ทำงานบนอุปกรณ์ของคุณเหมือนส่วนอื่นของเอนจิน ใบอนุญาตของส่วนประกอบเหล่านี้กำหนดให้เราแสดงประกาศดังต่อไปนี้:',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    'บางช่วงต้องฟังตรวจสอบ เนื่องจากมีข้อความซ้ำหรือขอบเขตของเสียงพูดไม่ชัดเจน',
  'Something went wrong': 'เกิดข้อผิดพลาดบางอย่าง',
  'Something went wrong in this browser. Please try again.':
    'เกิดข้อผิดพลาดในเบราว์เซอร์นี้ โปรดลองอีกครั้ง',
  'Something went wrong while reading this file.': 'เกิดข้อผิดพลาดขณะอ่านไฟล์นี้',
  'Source code': 'ซอร์สโค้ด',
  Speed: 'ความเร็ว',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'ความเร็วบนโทรศัพท์และแท็บเล็ตเป็นค่าประมาณ ไม่ได้วัดจริง ขนาด tiny และ base เป็นขนาดที่ปลอดภัย',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'SRT และ VTT สำหรับซับไตเติ้ล TXT และ Markdown สำหรับอ่าน JSON สำหรับโปรแกรม หรือ PDF สำหรับพิมพ์',
  Standard: 'มาตรฐาน',
  'Standard (42 letters)': 'มาตรฐาน (42 ตัวอักษร)',
  Start: 'เริ่ม',
  'Start a new transcription': 'เริ่มถอดเสียงใหม่',
  'Start again': 'เริ่มใหม่',
  'Started again': 'เริ่มใหม่แล้ว',
  'Starting…': 'กำลังเริ่ม…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'ยังมีคำถามอยู่ไหม? อ่าน[คำถามที่พบบ่อย](/faq) ดู[วิธีการทำงาน](/how-it-works) หรือ[ติดต่อเรา](/contact)',
  'Still stuck? [Read How it works](/how-it-works)':
    'ยังติดปัญหาอยู่? [อ่านวิธีการทำงาน](/how-it-works)',
  'Stop recording · {time}': 'หยุดบันทึก · {time}',
  'Stop this transcription? The text found so far is kept.':
    'หยุดการถอดเสียงนี้หรือไม่? ข้อความที่พบจนถึงตอนนี้จะยังอยู่',
  'Stopping the transcription worker. The text found so far is kept.':
    'กำลังหยุดตัวถอดเสียง ข้อความที่พบจนถึงตอนนี้จะยังอยู่',
  'Stored on this device only, never uploaded.': 'เก็บไว้ในอุปกรณ์นี้เท่านั้น ไม่เคยอัปโหลด',
  'Style unchanged': 'รูปแบบไม่เปลี่ยน',
  'Style updated': 'อัปเดตรูปแบบแล้ว',
  'Style updated using the saved recognition. Edited lines are kept.':
    'อัปเดตรูปแบบโดยใช้ผลการรู้จำเสียงที่บันทึกไว้ บรรทัดที่แก้ไขแล้วจะคงไว้',
  'Subtitle files': 'ไฟล์ซับไตเติ้ล',
  'Subtitle line length': 'ความยาวบรรทัดซับไตเติ้ล',
  'Subtitles (.srt)': 'ซับไตเติ้ล (.srt)',
  'Switch to dark theme': 'เปลี่ยนเป็นธีมมืด',
  'Switch to light theme': 'เปลี่ยนเป็นธีมสว่าง',
  Terms: 'ข้อกำหนด',
  'Terms of use': 'ข้อกำหนดการใช้งาน',
  'Text with times (.txt)': 'ข้อความพร้อมเวลา (.txt)',
  'That file is already in the list.': 'ไฟล์นั้นอยู่ในรายการแล้ว',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'นี่ไม่ใช่ไฟล์วิดีโอหรือไฟล์เสียง เลือก MP4, MOV, MP3 หรือไฟล์วิดีโอหรือไฟล์เสียงอื่น ๆ',
  'That is not a video or audio file. Please choose a video or audio file.':
    'นี่ไม่ใช่ไฟล์วิดีโอหรือไฟล์เสียง โปรดเลือกไฟล์วิดีโอหรือไฟล์เสียง',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'นี่ไม่ใช่ไฟล์เสียง เลือก MP3, WAV, M4A หรือไฟล์เสียงอื่น ๆ',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    '[นโยบายความเป็นส่วนตัว](/privacy)อธิบายว่ามีการประมวลผลอะไรและเพราะอะไร หากต้องการถามเกี่ยวกับข้อมูลของคุณหรือใช้สิทธิของคุณ ให้เขียนถึงที่อยู่อีเมลเดียวกัน',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    'โมเดล {label} ทำงานบนอุปกรณ์นี้ไม่ได้: {reason} เลือกโมเดลอื่น',
  'the exact error message, or a screenshot of it.':
    'ข้อความแสดงข้อผิดพลาดที่ตรงตามจริง หรือภาพหน้าจอของข้อความนั้น',
  'The file is larger than the server accepts.': 'ไฟล์ใหญ่กว่าที่เซิร์ฟเวอร์รับได้',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'ครั้งแรกที่คุณใช้ระดับคุณภาพหนึ่ง เบราว์เซอร์จะดาวน์โหลดโมเดลรู้จำเสียงของระดับนั้นหนึ่งครั้งและเก็บไว้ใช้คราวหน้า ไฟล์ถัดไปจึงเริ่มได้เร็วขึ้น',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'ครั้งแรกที่คุณใช้ระดับคุณภาพหนึ่ง เบราว์เซอร์จะดาวน์โหลดโมเดลรู้จำเสียงจาก Hugging Face และไฟล์โปรแกรมของเอนจินจาก jsDelivr แล้วเก็บไว้ใช้คราวหน้า โดยไม่มีส่วนใดของไฟล์คุณถูกส่งไปพร้อมกัน เมื่อการถอดเสียงเสร็จ เบราว์เซอร์จะเพิ่มหนึ่งในตัวนับแบบไม่ระบุตัวตนที่ส่วนหัวของหน้า และไม่มีอย่างอื่นอีก',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'ไดรเวอร์กราฟิกไม่รองรับเชเดอร์ 16 บิต: ดาวน์โหลดจะใหญ่ขึ้นและใช้หน่วยความจำมากขึ้น',
  'The line was removed.': 'ลบบรรทัดแล้ว',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'เครื่องมือหลัก: เปลี่ยนไฟล์วิดีโอหรือไฟล์เสียงใดก็ได้เป็นข้อความถอดเสียงพร้อมไทม์สแตมป์',
  'The page you are looking for does not exist or has moved.':
    'ไม่มีหน้าที่คุณกำลังหาอยู่ หรือหน้านั้นย้ายไปแล้ว',
  'The recording failed. Please try again.': 'การบันทึกล้มเหลว โปรดลองอีกครั้ง',
  'The server does not have enough free disk space for this file.':
    'เซิร์ฟเวอร์มีพื้นที่ดิสก์ว่างไม่พอสำหรับไฟล์นี้',
  'The server is busy': 'เซิร์ฟเวอร์ไม่ว่าง',
  'The server is busy right now.': 'ตอนนี้เซิร์ฟเวอร์ไม่ว่าง',
  'The service is busy right now. Please wait a moment and try again.':
    'ตอนนี้บริการไม่ว่าง โปรดรอสักครู่แล้วลองอีกครั้ง',
  'The service is full right now. Please try again in a little while.':
    'ตอนนี้บริการเต็ม โปรดลองอีกครั้งในอีกสักครู่',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    'การรู้จำเสียงพูดทำงานภายในเบราว์เซอร์ของคุณเอง โดยใช้โมเดลรู้จำเสียงแบบโอเพนซอร์ส เช่น OpenAI Whisper เบราว์เซอร์ดาวน์โหลดโมเดลหนึ่งครั้งแล้วเก็บไว้ จากนั้นทำงานทั้งหมดบนอุปกรณ์ของคุณ วิดีโอหรือไฟล์เสียงของคุณไม่เคยถูกอัปโหลดมาที่เรา นี่จึงเป็นเหตุผลที่ไม่มีขีดจำกัดขนาดไฟล์และไม่มีคิวไฟล์ของคนอื่น หน้า[วิธีการทำงาน](/how-it-works)อธิบายทุกขั้นตอน',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'ระบุภาษาที่พูดได้อย่างมั่นใจไม่ได้ เลือกภาษาที่คุณได้ยินแล้วลองอีกครั้ง',
  'The text found before it was stopped is shown below.': 'ข้อความที่พบก่อนหยุดแสดงอยู่ด้านล่าง',
  'The text found so far is kept.': 'ข้อความที่พบจนถึงตอนนี้จะยังอยู่',
  'The text is ready to paste.': 'ข้อความพร้อมวางแล้ว',
  'The transcript finished before it could be cancelled.': 'ข้อความถอดเสียงเสร็จก่อนที่จะยกเลิกได้',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'การถอดเสียงทำงานบนอุปกรณ์ของคุณเอง โดยใช้โมเดลรู้จำเสียงแบบโอเพนซอร์ส เช่น OpenAI Whisper เบราว์เซอร์ของคุณดาวน์โหลดโมเดลหนึ่งครั้งแล้วเก็บไว้ ไฟล์ถัดไปจึงเริ่มได้เร็วขึ้น และวิดีโอหรือไฟล์เสียงของคุณไม่เคยถูกอัปโหลดไปที่ใด',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'ประเภทและความยาวของไฟล์ เช่น “MP4, 25 นาที”;',
  'There is no size or length limit set here.': 'ที่นี่ไม่ได้กำหนดขีดจำกัดขนาดหรือความยาว',
  'These details make a problem much quicker to find and fix:':
    'รายละเอียดเหล่านี้ช่วยให้ค้นหาและแก้ปัญหาได้เร็วขึ้นมาก:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    'ข้อกำหนดเหล่านี้อยู่ภายใต้กฎหมายของประเทศอินเดีย ศาลในเบงกาลูรู รัฐกรณาฏกะ ประเทศอินเดีย มีเขตอำนาจแต่เพียงผู้เดียวเหนือข้อพิพาทใด ๆ ที่เกิดจากข้อกำหนดเหล่านี้ ทั้งนี้ไม่ตัดสิทธิความคุ้มครองใด ๆ ที่คุณมีภายใต้กฎหมายคุ้มครองผู้บริโภคภาคบังคับของประเทศที่คุณอาศัยอยู่',
  'They are downloaded again the next time you transcribe.':
    'ข้อมูลเหล่านี้จะถูกดาวน์โหลดอีกครั้งในครั้งถัดไปที่คุณถอดเสียง',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'ผู้ให้บริการภายนอก รวมถึง Google ใช้คุกกี้เพื่อแสดงโฆษณาตามการเข้าชมเว็บไซต์นี้หรือเว็บไซต์อื่นก่อนหน้านี้ของคุณ การที่ Google ใช้คุกกี้โฆษณาทำให้ Google และพันธมิตรแสดงโฆษณาให้คุณตามการเข้าชมเว็บไซต์นี้และ/หรือเว็บไซต์อื่นบนอินเทอร์เน็ตได้',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'ช่องนี้รับไฟล์เสียง เช่น MP3, WAV หรือ M4A แต่ไฟล์นั้นเป็นวิดีโอ',
  'This browser cannot record. Please choose a file instead.':
    'เบราว์เซอร์นี้บันทึกเสียงไม่ได้ โปรดเลือกไฟล์แทน',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'เบราว์เซอร์นี้ไม่รายงานหน่วยความจำ จึงสมมติว่ามี {gb} GB ควรเลือกโมเดลที่เล็กลงหากหน้าเว็บช้า',
  'This cannot be undone. Export anything you want to keep first.':
    'ย้อนกลับไม่ได้ ส่งออกสิ่งที่ต้องการเก็บไว้ก่อน',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '{brand} ฉบับนี้ทำงานบนคอมพิวเตอร์ของคุณเอง ไฟล์ของคุณถูกประมวลผลบนเครื่องนี้และไม่มีอะไรออกจากเครื่อง ไม่มีอะไรถูกบันทึกถาวร: ข้อความถอดเสียงมีอยู่เฉพาะในเซสชันนี้ จึงควรส่งออกสิ่งที่ต้องการ ดูรายละเอียดของเว็บไซต์ที่โฮสต์ไว้ใน[นโยบายความเป็นส่วนตัว](/privacy)',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'ฉบับนี้ทำงานบนคอมพิวเตอร์ของคุณเอง ไฟล์ของคุณถูกประมวลผลบนเครื่องนี้และไม่มีอะไรออกจากเครื่อง',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'อุปกรณ์นี้มีหน่วยความจำน้อยสำหรับไฟล์ที่ยาวขนาดนี้ จึงประมวลผลเป็นชิ้นเล็ก ๆ ซึ่งช้ากว่า การตัดให้สั้นลงหรือใช้โมเดลที่เล็กลงจะปลอดภัยกว่า',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'ไฟล์นี้ต้องใช้ตัวแปลงขนาด 9 MB ที่ทำงานในเบราว์เซอร์ของคุณ โหลดหรือไม่?',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'นี่เป็นคำแปลเพื่อความสะดวก หากแตกต่างจากฉบับภาษาอังกฤษ ให้ยึดฉบับภาษาอังกฤษเป็นหลัก',
  'This local copy does not count transcriptions': 'ฉบับในเครื่องนี้ไม่นับการถอดเสียง',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'ข้อความถอดเสียงนี้โมเดลมีความมั่นใจต่ำ ฟังการบันทึกและตรวจสอบภาษาที่พูดก่อนนำข้อความไปใช้',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'จะใช้เวลา {wait} บนอุปกรณ์นี้ (ค่าประมาณ) เปิดแท็บค้างไว้จนกว่าจะเสร็จ',
  Timestamps: 'ไทม์สแตมป์',
  'Tips for the best results': 'เคล็ดลับเพื่อผลลัพธ์ที่ดีที่สุด',
  'Tips for the best transcript': 'เคล็ดลับเพื่อข้อความถอดเสียงที่ดีที่สุด',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'หากต้องการเปลี่ยนตัวเลือกโฆษณา ให้ใช้[การตั้งค่าโฆษณาของ Google](https://adssettings.google.com) หรือการตั้งค่าคุกกี้ของเบราว์เซอร์',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'หากต้องการเปลี่ยนตัวเลือกโฆษณา ให้ใช้ **การตั้งค่าความเป็นส่วนตัวและคุกกี้** ที่ด้านล่างของหน้าที่แสดงโฆษณา [การตั้งค่าโฆษณาของ Google](https://adssettings.google.com) หรือการตั้งค่าคุกกี้ของเบราว์เซอร์',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'เพื่อถอดเสียงตามที่คุณร้องขอบนอุปกรณ์ของคุณเอง เพื่อส่งมอบเว็บไซต์อย่างปลอดภัย และเพื่อให้บริการนี้ใช้ฟรีผ่านการโฆษณา ในกรณีที่กฎหมายคุ้มครองข้อมูล เช่น GDPR มีผลบังคับใช้ ฐานทางกฎหมายของเราคือ การให้บริการที่คุณร้องขอ (ข้อ 6(1)(b)) ผลประโยชน์โดยชอบด้วยกฎหมายของเราในด้านความปลอดภัย การป้องกันการละเมิด และยอดรวมแบบไม่ระบุตัวตน (ข้อ 6(1)(f)) และสำหรับคุกกี้โฆษณาในกรณีที่กฎหมายกำหนด คือความยินยอมของคุณ (ข้อ 6(1)(a)) ซึ่งข้อความขอความยินยอมของ Google จะขอจากคุณ',
  'To keep it fast for everyone, each file has a size and length limit.':
    'เพื่อให้เร็วสำหรับทุกคน แต่ละไฟล์จึงมีขีดจำกัดขนาดและความยาว',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    'ภายในขอบเขตที่กฎหมายอนุญาต เราไม่รับผิดชอบต่อความสูญเสียทางอ้อมหรือความเสียหายสืบเนื่อง การสูญหายของข้อมูล กำไร หรือธุรกิจ หรือความสูญเสียใด ๆ ที่เกิดจากการที่คุณใช้หรือไม่สามารถใช้บริการ หรือจากข้อผิดพลาดในข้อความถอดเสียง ไม่มีข้อความใดในข้อกำหนดเหล่านี้จำกัดความรับผิดที่กฎหมายไม่อนุญาตให้จำกัด',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'เพื่อถอดเสียงบนอุปกรณ์ของคุณ เบราว์เซอร์จะดาวน์โหลดไฟล์โมเดลรู้จำเสียงจาก Hugging Face (huggingface.co) และไฟล์โปรแกรมของเอนจินเสียงจาก jsDelivr (cdn.jsdelivr.net) แล้วเก็บไว้ในแคช (Cache Storage) สำหรับครั้งหน้าจนกว่าคุณจะลบ ผู้ให้บริการเหล่านั้นได้รับข้อมูลคำขอตามปกติ (ที่อยู่ IP เบราว์เซอร์ และไฟล์ที่ร้องขอ) แต่ไม่เคยได้รับสื่อหรือข้อความถอดเสียงของคุณ',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'เพื่อให้ทำงานบนอุปกรณ์ของคุณ เบราว์เซอร์จะดาวน์โหลดโมเดลรู้จำเสียงจาก Hugging Face และไฟล์โปรแกรมจาก jsDelivr ซึ่งให้บริการภายใต้ใบอนุญาตและข้อกำหนดของตนเอง โฆษณาให้บริการโดย Google AdSense โฆษณาจะนำไปสู่เว็บไซต์ของบุคคลที่สามซึ่งเราไม่ได้ควบคุมและไม่รับผิดชอบ',
  Transcribe: 'ถอดเสียง',
  'Transcribe (same language)': 'ถอดเสียง (ภาษาเดิม)',
  'Transcribe {n} files': 'ถอดเสียง {n} ไฟล์',
  'Transcribe a file': 'ถอดเสียงไฟล์',
  'Transcribe or translate speech in the language you need.':
    'ถอดเสียงหรือแปลคำพูดในภาษาที่คุณต้องการ',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    'ถอดเสียงวิดีโอ ไฟล์เสียง และเสียงบันทึกในมากกว่า 50 ภาษา หรือให้ระบบตรวจจับภาษาให้',
  'Transcribing {n}%': 'กำลังถอดเสียง {n}%',
  'Transcribing takes {time} on this device.': 'การถอดเสียงใช้เวลา {time} บนอุปกรณ์นี้',
  'Transcribing…': 'กำลังถอดเสียง…',
  Transcript: 'ข้อความถอดเสียง',
  'Transcript name': 'ชื่อข้อความถอดเสียง',
  'Transcript not found': 'ไม่พบข้อความถอดเสียง',
  'Transcript ready': 'ข้อความถอดเสียงพร้อมแล้ว',
  'Transcript style': 'รูปแบบการถอดเสียง',
  'Transcription failed': 'การถอดเสียงล้มเหลว',
  'Transcription has started. The text appears below as it is recognised.':
    'การถอดเสียงเริ่มแล้ว ข้อความจะปรากฏด้านล่างเมื่อรู้จำได้',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'การถอดเสียงเริ่มแล้ว ไฟล์อื่นของคุณอยู่ในส่วนข้อความถอดเสียงที่ด้านบนของหน้า',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    'การถอดเสียงทำงานบนอุปกรณ์ของคุณและใช้ตัวประมวลผล ชิปกราฟิก หน่วยความจำ และแบตเตอรี่ของอุปกรณ์ เราไม่ได้กำหนดขีดจำกัดขนาดหรือความยาวของไฟล์ แต่ความเร็วในการทำงานและขนาดไฟล์ที่เบราว์เซอร์รับได้ขึ้นอยู่กับอุปกรณ์ของคุณ: ไฟล์ยาวบนโทรศัพท์หรือคอมพิวเตอร์ที่ช้ากว่าอาจใช้เวลานานหรือหน่วยความจำไม่พอ ข้อความถอดเสียงและไฟล์ของคุณถูกเก็บไว้ในเบราว์เซอร์นี้ และลบโดยอัตโนมัติหลังไม่มีการใช้งาน {idle} ดู[นโยบายความเป็นส่วนตัว](/privacy)',
  'Transcription settings': 'การตั้งค่าการถอดเสียง',
  Transcripts: 'ข้อความถอดเสียง',
  'Transcripts {n}': 'ข้อความถอดเสียง {n}',
  'Transcripts are only kept for the browser session that created them.':
    'ข้อความถอดเสียงจะถูกเก็บไว้เฉพาะเซสชันของเบราว์เซอร์ที่สร้างขึ้นเท่านั้น',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    'ข้อความถอดเสียงสร้างขึ้นโดยอัตโนมัติและจะมีข้อผิดพลาด โดยเฉพาะกับเสียงที่มีเสียงรบกวน สำเนียงที่เด่นชัด ผู้พูดพูดทับกัน เสียงเพลง รวมถึงชื่อและศัพท์เทคนิค ควรตรวจสอบข้อความถอดเสียงทุกครั้งก่อนนำไปใช้ โดยเฉพาะในงานด้านกฎหมาย การแพทย์ การเงิน หรือการเผยแพร่ บริการนี้ให้บริการ “ตามสภาพ” และ “ตามที่มีอยู่” โดยไม่มีการรับประกันใด ๆ ทั้งโดยชัดแจ้งหรือโดยปริยาย รวมถึงความแม่นยำ ความครบถ้วน หรือความเหมาะสมกับวัตถุประสงค์เฉพาะ',
  'Translate to English': 'แปลเป็นภาษาอังกฤษ',
  'Try again': 'ลองอีกครั้ง',
  'Try another quality or language': 'ลองคุณภาพหรือภาษาอื่น',
  'try to spread malware or anything meant to damage the service.':
    'พยายามเผยแพร่มัลแวร์หรือสิ่งใดที่มีไว้เพื่อทำลายบริการ',
  'Trying again in a moment…': 'กำลังลองอีกครั้งในอีกสักครู่…',
  'Trying again. This page loads by itself as soon as the server is back.':
    'กำลังลองอีกครั้ง หน้านี้จะโหลดเองทันทีที่เซิร์ฟเวอร์กลับมา',
  'under a minute': 'ไม่ถึงหนึ่งนาที',
  'Underline unsure words': 'ขีดเส้นใต้คำที่ไม่มั่นใจ',
  Unlimited: 'ไม่จำกัด',
  'Unsure: worth listening to again': 'ไม่มั่นใจ: ควรฟังซ้ำ',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'การอัปโหลดที่หนาแน่นผิดปกติอาจถูกขอให้รอสักครู่',
  'Up to {minutes} per file.': 'สูงสุด {minutes} ต่อไฟล์',
  'Up to {size} and {minutes} minutes per file.': 'สูงสุด {size} และ {minutes} นาทีต่อไฟล์',
  'Up to {size} and {minutes} per file.': 'สูงสุด {size} และ {minutes} ต่อไฟล์',
  'Up to {size} per file.': 'สูงสุด {size} ต่อไฟล์',
  'Updated {date}': 'อัปเดตเมื่อ {date}',
  'Upload complete': 'อัปโหลดเสร็จแล้ว',
  'Upload failed': 'อัปโหลดไม่สำเร็จ',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'อัปโหลดไม่สำเร็จ (ข้อผิดพลาดของเซิร์ฟเวอร์ {status}) ตรวจสอบเทอร์มินัลที่รันเซิร์ฟเวอร์เพื่อดูรายละเอียด',
  'Upload failed (server error {status}). Please try again in a moment.':
    'อัปโหลดไม่สำเร็จ (ข้อผิดพลาดของเซิร์ฟเวอร์ {status}) โปรดลองอีกครั้งในอีกสักครู่',
  Uploading: 'กำลังอัปโหลด',
  'Uploading…': 'กำลังอัปโหลด…',
  'use a computer for this size': 'ใช้คอมพิวเตอร์สำหรับขนาดนี้',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'ใช้สคริปต์ บอต หรือวิธีอัตโนมัติอื่นกับเว็บไซต์หรือตัวนับของเว็บไซต์ หรือส่งตัวเลขที่สร้างขึ้นเอง โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษรจากเรา;',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'ใช้บริการกับเนื้อหาที่ผิดกฎหมาย หรือที่ละเมิดสิทธิของผู้อื่น;',
  'use the service to harass, harm or deceive others;':
    'ใช้บริการเพื่อคุกคาม ทำร้าย หรือหลอกลวงผู้อื่น;',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'โดยปกติแม่นยำมากกับเสียงพูดที่ชัด บรรทัดที่ไม่มั่นใจจะถูกทำเครื่องหมายไว้ ให้คุณตรวจก่อนได้',
  'Video and audio to text': 'วิดีโอและเสียงเป็นข้อความ',
  'Video or audio, several at once is fine.': 'วิดีโอหรือไฟล์เสียง หลายไฟล์พร้อมกันก็ได้',
  'Video to text, accurately.': 'วิดีโอเป็นข้อความ อย่างแม่นยำ',
  'Video to text: transcribe a video or audio file':
    'วิดีโอเป็นข้อความ: ถอดเสียงไฟล์วิดีโอหรือไฟล์เสียง',
  'video transcribed': 'วิดีโอที่ถอดเสียงแล้ว',
  'videos transcribed': 'วิดีโอที่ถอดเสียงแล้ว',
  'Vocabulary hint': 'คำใบ้คำศัพท์',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'เสียงบันทึกย่อ การประชุม การบรรยาย พอดแคสต์ และการสัมภาษณ์',
  'Waiting for microphone permission…': 'กำลังรอการอนุญาตใช้ไมโครโฟน…',
  'Waiting for the first words…': 'กำลังรอคำแรก…',
  'Waiting in line…': 'กำลังรอในคิว…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'ดูข้อความปรากฏสด แก้ไขข้อผิดพลาด แล้วดาวน์โหลดเป็น SRT, VTT, TXT, Markdown, JSON หรือ PDF',
  'We do not ask for your name, e-mail address or any other account details.':
    'เราไม่ขอชื่อ ที่อยู่อีเมล หรือรายละเอียดบัญชีอื่นใดของคุณ',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'เราไม่รับรองว่าบริการจะพร้อมใช้งานตลอดเวลา ไม่สะดุด หรือปราศจากข้อผิดพลาด เว็บไซต์หรือไฟล์ดาวน์โหลดที่ต้องใช้ (โมเดลรู้จำเสียงจาก Hugging Face และไฟล์โปรแกรมจาก jsDelivr) อาจใช้ไม่ได้ชั่วคราวเนื่องจากการบำรุงรักษาหรือเหตุผลที่เกินการควบคุมของเรา และบางเบราว์เซอร์หรืออุปกรณ์ไม่สามารถรันได้ทุกโมเดล เนื่องจากข้อความถอดเสียงของคุณถูกเก็บไว้เฉพาะในเบราว์เซอร์นี้และถูกลบหลังไม่มีการใช้งาน จึงควรส่งออกสิ่งที่ต้องการเสมอ',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'เราไม่ขายข้อมูลของคุณ เราไม่ได้ถือไฟล์หรือข้อความถอดเสียงใด ๆ ของคุณ จึงไม่มีอะไรจะแบ่งปัน: การรู้จำเสียงทำงานบนอุปกรณ์ของคุณ ไม่ใช่บนบริการถอดเสียงหรือ AI ภายนอก Google (โฆษณา) Cloudflare (โฮสติ้งและตัวนับ) Hugging Face และ jsDelivr (ไฟล์ดาวน์โหลด) ได้รับเฉพาะสิ่งที่อธิบายไว้ข้างต้นเท่านั้น เราอาจเปิดเผยข้อมูลหากกฎหมายกำหนด',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    'เราไม่เก็บสิ่งใดของคุณไว้ฝั่งเรา: นอกจากยอดรวมสะสมเพียงตัวเดียว เราไม่เก็บข้อมูลใด ๆ เกี่ยวกับการใช้งานของคุณ',
  'We may block access if these rules are broken.':
    'เราอาจปิดกั้นการเข้าถึงหากมีการฝ่าฝืนกฎเหล่านี้',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'เราอาจปรับปรุงข้อกำหนดเหล่านี้ เวอร์ชันใหม่จะปรากฏในหน้านี้พร้อมวันที่ “อัปเดตล่าสุด” ใหม่ และมีผลตั้งแต่นั้นเป็นต้นไป',
  'We never send your file, your transcript or any personal information to Google.':
    'เราไม่เคยส่งไฟล์ ข้อความถอดเสียง หรือข้อมูลส่วนบุคคลใด ๆ ของคุณไปให้ Google',
  'Web subtitles (.vtt)': 'ซับไตเติ้ลเว็บ (.vtt)',
  'What people use it for': 'คนใช้เครื่องมือนี้ทำอะไร',
  'What you can do with it': 'สิ่งที่คุณทำได้',
  'What you get': 'สิ่งที่คุณจะได้รับ',
  'what you were doing, and what happened instead of what you expected;':
    'สิ่งที่คุณกำลังทำ และสิ่งที่เกิดขึ้นแทนสิ่งที่คุณคาดหวัง;',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'สถานที่ประมวลผลไฟล์ของคุณขึ้นอยู่กับวิธีการเรียกใช้ {brand} และเซิร์ฟเวอร์ไม่ตอบสนองเมื่อสักครู่ ดู[นโยบายความเป็นส่วนตัว](/privacy)',
  'Where your files are processed depends on how {brand} is run.':
    'สถานที่ประมวลผลไฟล์ของคุณขึ้นอยู่กับวิธีการเรียกใช้ {brand}',
  'Which files can I use, and what are the limits?':
    'ใช้ไฟล์ประเภทใดได้บ้าง และมีขีดจำกัดอะไรบ้าง?',
  'Which languages are supported?': 'รองรับภาษาอะไรบ้าง?',
  'Who builds it': 'ใครเป็นผู้สร้าง',
  'Who runs this website': 'ใครดำเนินการเว็บไซต์นี้',
  'Why it exists': 'ทำไมจึงมีเว็บไซต์นี้',
  'Working…': 'กำลังทำงาน…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'ใช่ ใช้ฟรี และไม่มีบัญชีหรือการเข้าสู่ระบบ ไม่ว่าเมื่อใด ไม่มีโควตารายวันหรือรายเดือนและไม่มีเพย์วอลล์ โฆษณาช่วยให้เว็บไซต์ใช้ฟรี',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'ใช่ ใช้ฟรี และไม่มีบัญชีหรือการเข้าสู่ระบบ ไม่ว่าเมื่อใด ไม่มีโควตารายวันหรือรายเดือนและไม่มีเพย์วอลล์',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'ใช่ ใช้ฟรี ไม่ต้องสมัครและไม่ต้องเข้าสู่ระบบ ฉบับนี้ทำงานบนคอมพิวเตอร์ของคุณเอง จึงไม่มีโควตาและไม่มีเพย์วอลล์ ความเร็วในการทำงานขึ้นอยู่กับคอมพิวเตอร์ของคุณ',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'ได้ ใช้ไอคอนดินสอข้างบรรทัดเพื่อเปลี่ยนข้อความหรือลบบรรทัด หรือค้นหาและแทนที่ทั้งข้อความถอดเสียง การแก้ไขของคุณจะรวมอยู่ในทุกการส่งออก',
  'You agree not to:': 'คุณตกลงที่จะไม่:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'คุณเป็นผู้ควบคุม: ลบข้อความถอดเสียง ไฟล์ และหากต้องการ รวมถึงโมเดลรู้จำเสียงที่ดาวน์โหลดไว้ได้ทุกเมื่อด้วย **ลบข้อมูลของฉันตอนนี้** การลบนี้ลบเฉพาะข้อมูลในเบราว์เซอร์นี้ ไม่สามารถลบคุกกี้ของ Google ได้',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'คุณเปลี่ยนได้ทุกเมื่อด้วย **การตั้งค่าความเป็นส่วนตัวและคุกกี้** ที่ด้านล่างของทุกหน้าที่แสดงโฆษณา (เช่น หน้าแรก)',
  'You can now read, fix and download it.': 'ตอนนี้คุณอ่าน แก้ไข และดาวน์โหลดได้แล้ว',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'คุณหยุดใช้บริการและลบข้อมูลในเบราว์เซอร์นี้ได้ทุกเมื่อด้วย **ลบข้อมูลของฉันตอนนี้** เราอาจระงับหรือยุติการเข้าถึงของคุณได้ทุกเมื่อ โดยเฉพาะหากคุณฝ่าฝืนข้อกำหนดเหล่านี้',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'คุณยังคงถือสิทธิ์ทั้งหมดในไฟล์ที่คุณเพิ่มและข้อความถอดเสียงที่สร้างจากไฟล์เหล่านั้น ไฟล์ถูกประมวลผลบนอุปกรณ์ของคุณและเราไม่เคยได้รับ คุณรับผิดชอบต่อสิ่งที่คุณถอดเสียง: ใช้เฉพาะเนื้อหาที่คุณเป็นเจ้าของหรือมีสิทธิ์ประมวลผล รวมถึงการอนุญาตที่จำเป็นจากผู้ที่พูดอยู่ในเนื้อหานั้น',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'คุณอาจเลือกไม่รับโฆษณาแบบปรับตามความสนใจส่วนบุคคลได้โดยไปที่[การตั้งค่าโฆษณาของ Google](https://adssettings.google.com) หรือเลือกไม่ให้ผู้ให้บริการภายนอกบางรายใช้คุกกี้เพื่อโฆษณาแบบปรับตามความสนใจส่วนบุคคลได้ที่ [www.aboutads.info](https://www.aboutads.info) ดู[วิธีที่ Google ใช้ข้อมูลจากเว็บไซต์ที่ใช้บริการของ Google](https://policies.google.com/technologies/partner-sites)',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'เบราว์เซอร์และเวอร์ชันของคุณ รวมถึงอุปกรณ์ของคุณ (คอมพิวเตอร์หรือโทรศัพท์ และระบบปฏิบัติการ);',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'เบราว์เซอร์ของคุณบล็อกการคัดลอกที่นี่ ใช้การส่งออกเพื่อบันทึกข้อความแทน',
  'Your change is saved.': 'บันทึกการเปลี่ยนแปลงแล้ว',
  'Your change is still in its box: press Save to try again.':
    'การเปลี่ยนแปลงของคุณยังอยู่ในช่อง: กดบันทึกเพื่อลองอีกครั้ง',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'ไฟล์ของคุณถูกส่งไปยังเซิร์ฟเวอร์ผ่านการเชื่อมต่อที่เข้ารหัส ถอดเสียงด้วยโมเดลรู้จำเสียงแบบโอเพนซอร์ส เช่น OpenAI Whisper แล้วลบโดยอัตโนมัติหลังจากนั้น หน้า[วิธีการทำงาน](/how-it-works)อธิบายทุกขั้นตอน',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'ไฟล์ของคุณถูกถอดเสียงในเบราว์เซอร์บนอุปกรณ์ของคุณเอง เราจึงไม่กำหนดขีดจำกัดขนาดหรือความยาว ไฟล์ที่ใหญ่หรือยาวมากก็ใช้ได้เช่นกัน แต่จะใช้เวลานานขึ้นและต้องมีหน่วยความจำว่างเพียงพอ และหน้าเว็บจะเตือนเมื่ออุปกรณ์ของคุณอาจช้า',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'ไฟล์ของคุณถูกถอดเสียงด้วยโมเดลรู้จำเสียงแบบโอเพนซอร์ส เช่น OpenAI Whisper และถูกลบโดยอัตโนมัติหลังจากนั้น',
  'Your file never leaves your device.': 'ไฟล์ของคุณไม่เคยออกจากอุปกรณ์',
  'Your file never leaves your device. [Privacy](/privacy)':
    'ไฟล์ของคุณไม่เคยออกจากอุปกรณ์ [ความเป็นส่วนตัว](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'ไฟล์ของคุณไม่เคยออกจากอุปกรณ์ ไฟล์ถูกถอดเสียงในเบราว์เซอร์บนอุปกรณ์นี้ และไม่เคยอัปโหลดมาที่เราหรือใคร ข้อความถอดเสียง การแก้ไขของคุณ และไฟล์ถูกเก็บไว้ในที่เก็บข้อมูลของเบราว์เซอร์นี้เท่านั้น และลบโดยอัตโนมัติหลังไม่มีการใช้งาน {idle} หรือทันทีเมื่อคุณกด **ลบข้อมูลของฉันตอนนี้** ในเมนูข้อความถอดเสียง ไม่มีบัญชี ส่งออกสิ่งที่ต้องการก่อนออกจากหน้านี้',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'ไฟล์ของคุณไม่เคยออกจากอุปกรณ์ ถอดเสียงในเบราว์เซอร์ของคุณโดยตรง ไม่มีบัญชี และข้อความถอดเสียงอยู่ในเบราว์เซอร์นี้',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'ไฟล์ของคุณอยู่บนอุปกรณ์นี้ เปิดแท็บนี้ค้างไว้ขณะถอดเสียง',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'ไฟล์และข้อความถอดเสียงของคุณถูกเก็บไว้เฉพาะเซสชันนี้ และลบโดยอัตโนมัติหลังไม่มีการใช้งาน {idle} หรือเมื่อคุณกด “ลบข้อมูลของฉันตอนนี้” ไม่มีบัญชี ไม่มีการติดตาม มีคุกกี้เซสชันที่จำเป็นหนึ่งตัว ส่งออกสิ่งที่ต้องการก่อนออกจากหน้านี้',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'ไฟล์และข้อความถอดเสียงของคุณถูกเก็บไว้เฉพาะเซสชันนี้ และลบโดยอัตโนมัติเมื่อเซสชันสิ้นสุด หรือเมื่อคุณกด “ลบข้อมูลของฉันตอนนี้” ไม่มีบัญชี ไม่มีการติดตาม มีคุกกี้เซสชันที่จำเป็นหนึ่งตัว ส่งออกสิ่งที่ต้องการก่อนออกจากหน้านี้',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'ไฟล์ของคุณถูกลบโดยอัตโนมัติ [ความเป็นส่วนตัว](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'ไฟล์ของคุณถูกประมวลผลในเบราว์เซอร์และอยู่บนอุปกรณ์ของคุณ เว็บไซต์ ไฟล์ดาวน์โหลด และตัวนับใช้การเชื่อมต่อที่เข้ารหัส (HTTPS) ทุกคนที่ใช้โปรไฟล์เบราว์เซอร์นี้ได้จะเห็นข้อความถอดเสียงที่เก็บไว้ในนั้นจนกว่าจะถูกลบ จึงควรกด **ลบข้อมูลของฉันตอนนี้** บนคอมพิวเตอร์ที่ใช้ร่วมกัน',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'ไฟล์ของคุณถูกอัปโหลดไปยังเซิร์ฟเวอร์ของเราเพื่อประมวลผลที่นั่น ไฟล์ถูกเก็บไว้เฉพาะเซสชันของคุณ และลบโดยอัตโนมัติเมื่อเซสชันสิ้นสุด หลังไม่มีการใช้งาน {idle} หรือทันทีเมื่อคุณกด **ลบข้อมูลของฉันตอนนี้** ในเมนูข้อความถอดเสียง ไม่มีบัญชีและไม่มีการติดตาม และคุกกี้เดียวที่ใช้คือคุกกี้เซสชันที่จำเป็นหนึ่งตัว (ไม่มีคุกกี้วิเคราะห์หรือโฆษณา)',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'ไฟล์ของคุณถูกอัปโหลดไปยังเซิร์ฟเวอร์ของเราเพื่อประมวลผลที่นั่น ไฟล์ถูกเก็บไว้เฉพาะเซสชันของคุณ และลบโดยอัตโนมัติเมื่อเซสชันสิ้นสุด หรือทันทีเมื่อคุณกด **ลบข้อมูลของฉันตอนนี้** ในเมนูข้อความถอดเสียง ไม่มีบัญชีและไม่มีการติดตาม และคุกกี้เดียวที่ใช้คือคุกกี้เซสชันที่จำเป็นหนึ่งตัว (ไม่มีคุกกี้วิเคราะห์หรือโฆษณา)',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'ไฟล์ของคุณไม่เคยออกจากอุปกรณ์นี้ ข้อความถอดเสียงถูกเก็บไว้ในเบราว์เซอร์นี้เท่านั้น และลบโดยอัตโนมัติหลังไม่มีการใช้งาน {idle} หรือเมื่อคุณกด “ลบข้อมูลของฉันตอนนี้” ส่งออกสิ่งที่ต้องการก่อนออกจากหน้านี้',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'ไฟล์ของคุณไม่เคยออกจากอุปกรณ์นี้ ข้อความถอดเสียงถูกเก็บไว้ในเบราว์เซอร์นี้เท่านั้น และลบโดยอัตโนมัติเมื่อเซสชันสิ้นสุด หรือเมื่อคุณกด “ลบข้อมูลของฉันตอนนี้” ส่งออกสิ่งที่ต้องการก่อนออกจากหน้านี้',
  'Your session ends in {mins} min. Export what you need.':
    'เซสชันของคุณจะสิ้นสุดใน {mins} นาที ส่งออกสิ่งที่ต้องการ',
  'Your session has ended': 'เซสชันของคุณสิ้นสุดแล้ว',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'เซสชันของคุณสิ้นสุดแล้วและข้อมูลถูกลบแล้ว คุณเริ่มถอดเสียงใหม่ได้',
  'Your transcript is ready below.': 'ข้อความถอดเสียงของคุณพร้อมอยู่ด้านล่าง',
  'Your transcripts': 'ข้อความถอดเสียงของคุณ',
  'Your transcripts and files were removed from the server.':
    'ข้อความถอดเสียงและไฟล์ของคุณถูกลบออกจากเซิร์ฟเวอร์แล้ว',
  'Your transcripts and files were removed from this device.':
    'ข้อความถอดเสียงและไฟล์ของคุณถูกลบออกจากอุปกรณ์นี้แล้ว',

  // page titles, descriptions and link labels
  'title:/': 'ถอดเสียงวิดีโอเป็นข้อความฟรี ไม่ต้องล็อกอิน',
  'description:/':
    'แปลงวิดีโอและเสียงเป็นข้อความฟรี ไม่ต้องเข้าสู่ระบบ ไม่จำกัดรายวัน รองรับมากกว่า 50 ภาษา ได้ข้อความพร้อมไทม์สแตมป์ และส่งออกเป็น SRT, VTT, TXT, PDF',
  'title:/how-it-works': 'วิธีถอดเสียงวิดีโอและเสียงเป็นข้อความ',
  'description:/how-it-works':
    'TranscribeVid เปลี่ยนวิดีโอและเสียงเป็นข้อความพร้อมไทม์สแตมป์ที่แม่นยำใน 3 ขั้นตอนง่าย ๆ ได้อะไรบ้าง และเคล็ดลับเพื่อผลลัพธ์ที่ดีที่สุด',
  'title:/faq': 'คำถามที่พบบ่อยเกี่ยวกับการถอดเสียง',
  'description:/faq':
    'คำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับ TranscribeVid: ความแม่นยำ ภาษา ไฟล์ที่รองรับและขีดจำกัด ความเร็ว ความเป็นส่วนตัว และการแก้ไข',
  'title:/about': 'เกี่ยวกับ TranscribeVid',
  'description:/about':
    'ใครเป็นผู้สร้าง TranscribeVid และเพราะอะไร: เครื่องมือแปลงวิดีโอและเสียงเป็นข้อความฟรี ไม่ต้องสมัครหรือเข้าสู่ระบบ หน้าตาเรียบง่าย รายได้มาจากโฆษณา',
  'title:/contact': 'ติดต่อเรา',
  'description:/contact':
    'วิธีติดต่อ TranscribeVid: ส่งอีเมลสำหรับคำถาม รายงานข้อบกพร่อง ไอเดียฟีเจอร์ และคำขอด้านความเป็นส่วนตัว รวมถึงข้อมูลผู้ดำเนินการเว็บไซต์',
  'title:/privacy': 'นโยบายความเป็นส่วนตัว',
  'description:/privacy':
    'สิ่งที่ TranscribeVid ประมวลผลเมื่อคุณถอดเสียงไฟล์ ที่ไหน เพราะอะไร และเก็บนานเท่าใด รวมถึงคุกกี้ โฆษณา ที่เก็บข้อมูลของเบราว์เซอร์ และสิทธิของคุณ',
  'title:/terms': 'ข้อกำหนดการใช้งาน',
  'description:/terms':
    'กฎการใช้ TranscribeVid: บริการฟรี เนื้อหาของคุณ การใช้งานที่ยอมรับได้ ขีดจำกัดของไฟล์ ไม่มีการรับประกันความแม่นยำของข้อความถอดเสียง และความรับผิด',
  'title:/tools': 'เครื่องมือถอดเสียงฟรีทั้งหมด',
  'description:/tools':
    'เครื่องมือแปลงวิดีโอและเสียงเป็นข้อความฟรีทั้งหมดในรายการเดียว แยกตามประเภทไฟล์ การใช้งาน ไฟล์ซับไตเติ้ล และภาษา ไม่ต้องเข้าสู่ระบบ ไม่จำกัดรายวัน',
  'title:/guides': 'คู่มือการถอดเสียงและซับไตเติ้ลที่ใช้ได้จริง',
  'description:/guides':
    'คู่มือที่ใช้ได้จริงเกี่ยวกับข้อความถอดเสียงและซับไตเติ้ล: SRT หรือ VTT เพิ่มซับไตเติ้ลให้วิดีโออย่างไร ทำให้ข้อความถอดเสียงแม่นยำ และถอดเสียงแบบไม่อัปโหลด',
  'title:/video-to-text': 'แปลงวิดีโอเป็นข้อความฟรี ไม่ต้องล็อกอิน',
  'description:/video-to-text':
    'แปลงวิดีโอเป็นข้อความฟรี ได้ข้อความถอดเสียงที่แม่นยำพร้อมไทม์สแตมป์ในมากกว่า 50 ภาษา ไม่ต้องเข้าสู่ระบบ ไม่จำกัดรายวัน ดาวน์โหลด SRT, VTT, TXT หรือ PDF',
  'label:/video-to-text': 'แปลงวิดีโอเป็นข้อความ',
  'title:/audio-to-text': 'แปลงเสียงเป็นข้อความ ฟรี ไม่จำกัด',
  'description:/audio-to-text':
    'เปลี่ยนพอดแคสต์ บทสัมภาษณ์ และการบรรยายเป็นข้อความ ฟรี มีไทม์สแตมป์ มากกว่า 50 ภาษา ไม่ต้องเข้าสู่ระบบ ดาวน์โหลด TXT, SRT, VTT หรือ PDF',
  'label:/audio-to-text': 'แปลงเสียงเป็นข้อความ',
  'title:/mp4-to-text': 'แปลง MP4 เป็นข้อความ ถอดเสียงฟรี',
  'description:/mp4-to-text':
    'แปลงวิดีโอ MP4 เป็นข้อความพร้อมไทม์สแตมป์ ฟรี ไม่ต้องเข้าสู่ระบบ ไม่จำกัดรายวัน รองรับมากกว่า 50 ภาษา ดาวน์โหลด TXT, SRT, VTT, Markdown, JSON หรือ PDF',
  'label:/mp4-to-text': 'MP4 เป็นข้อความ',
  'title:/mp3-to-text': 'แปลง MP3 เป็นข้อความออนไลน์ ฟรี',
  'description:/mp3-to-text':
    'ถอดเสียง MP3 เป็นข้อความออนไลน์ฟรี ไม่ต้องเข้าสู่ระบบ รองรับมากกว่า 50 ภาษา มีไทม์สแตมป์ทุกบรรทัด แก้ไขข้อความแล้วดาวน์โหลด TXT, SRT, VTT หรือ PDF',
  'label:/mp3-to-text': 'MP3 เป็นข้อความ',
  'title:/srt-subtitle-generator': 'สร้างซับไตเติ้ล SRT จากวิดีโอ ฟรี',
  'description:/srt-subtitle-generator':
    'สร้างไฟล์ซับไตเติ้ล SRT จากวิดีโอหรือไฟล์เสียงใดก็ได้ ฟรี เวลาตรงกับเสียงพูด รองรับมากกว่า 50 ภาษา ไม่ต้องเข้าสู่ระบบ แก้ไขบรรทัดแล้วดาวน์โหลด SRT หรือ VTT',
  'label:/srt-subtitle-generator': 'สร้างซับไตเติ้ล SRT',
  'title:/voice-recording-to-text': 'แปลงเสียงบันทึกเป็นข้อความ ฟรี',
  'description:/voice-recording-to-text':
    'บันทึกเสียงในเบราว์เซอร์หรือเพิ่มเสียงบันทึกย่อ แล้วรับเป็นข้อความ ฟรี ไม่ต้องเข้าสู่ระบบ รองรับมากกว่า 50 ภาษา ดาวน์โหลด TXT, PDF, SRT หรือ Markdown',
  'label:/voice-recording-to-text': 'แปลงเสียงบันทึกเป็นข้อความ',
  'title:/wav-to-text': 'แปลง WAV เป็นข้อความออนไลน์ ฟรี',
  'description:/wav-to-text':
    'แปลงไฟล์ WAV เป็นข้อความฟรี รองรับการบันทึกยาวจากเครื่องบันทึกเสียงและการโทร มากกว่า 50 ภาษา มีไทม์สแตมป์ ไม่ต้องเข้าสู่ระบบ ดาวน์โหลด TXT, SRT หรือ PDF',
  'label:/wav-to-text': 'WAV เป็นข้อความ',
  'title:/m4a-to-text': 'แปลง M4A เป็นข้อความ ฟรี',
  'description:/m4a-to-text':
    'เปลี่ยนเสียงบันทึกย่อ M4A เป็นข้อความฟรี ใช้ได้กับ Voice Memos บน iPhone ไม่ต้องเข้าสู่ระบบ มากกว่า 50 ภาษา มีไทม์สแตมป์ ดาวน์โหลด TXT, SRT, VTT หรือ PDF',
  'label:/m4a-to-text': 'M4A เป็นข้อความ',
  'title:/webm-to-text': 'แปลง WebM เป็นข้อความ ไม่ต้องเข้าสู่ระบบ',
  'description:/webm-to-text':
    'แปลงไฟล์วิดีโอหรือไฟล์เสียง WebM เป็นข้อความฟรี ใช้ได้กับการอัดหน้าจอและการบันทึกจากเบราว์เซอร์ มากกว่า 50 ภาษา มีไทม์สแตมป์ ดาวน์โหลด TXT, SRT, VTT หรือ PDF',
  'label:/webm-to-text': 'WebM เป็นข้อความ',
  'title:/mov-to-text': 'แปลงวิดีโอ MOV จาก iPhone เป็นข้อความ ฟรี',
  'description:/mov-to-text':
    'ถอดเสียงวิดีโอ MOV จาก iPhone หรือ QuickTime ฟรี ไม่ต้องเข้าสู่ระบบ รองรับมากกว่า 50 ภาษา มีไทม์สแตมป์ทุกบรรทัด ดาวน์โหลด TXT, SRT, VTT หรือ PDF',
  'label:/mov-to-text': 'MOV เป็นข้อความ',
  'title:/whatsapp-voice-message-to-text': 'แปลงข้อความเสียง WhatsApp เป็นข้อความ ฟรี',
  'description:/whatsapp-voice-message-to-text':
    'แปลงข้อความเสียง WhatsApp เป็นข้อความฟรี บันทึกไฟล์เสียง วางลงในช่อง แล้วอ่านได้ในมากกว่า 50 ภาษา รวมถึงภาษาฮินดี ไม่ต้องเข้าสู่ระบบ ไม่ต้องมีบัญชี',
  'label:/whatsapp-voice-message-to-text': 'ข้อความเสียง WhatsApp เป็นข้อความ',
  'title:/meeting-recording-to-text': 'ถอดเสียงบันทึก Zoom, Teams และ Meet',
  'description:/meeting-recording-to-text':
    'แปลงการบันทึกประชุม Zoom, Teams หรือ Google Meet เป็นข้อความที่ค้นหาได้พร้อมไทม์สแตมป์ ฟรี ไม่ต้องเข้าสู่ระบบ มากกว่า 50 ภาษา ดาวน์โหลด TXT, SRT, VTT หรือ PDF',
  'label:/meeting-recording-to-text': 'การบันทึกประชุมเป็นข้อความ',
  'title:/lecture-to-text': 'แปลงคลิปเรียนเป็นข้อความ ฟรี',
  'description:/lecture-to-text':
    'เปลี่ยนคลิปเรียนที่บันทึกไว้เป็นข้อความบันทึกที่ค้นหาและใช้ทบทวนได้ ฟรี ไม่ต้องเข้าสู่ระบบ มากกว่า 50 ภาษา มีไทม์สแตมป์ ดาวน์โหลด TXT, Markdown, SRT หรือ PDF',
  'label:/lecture-to-text': 'แปลงคลิปเรียนเป็นข้อความ',
  'title:/podcast-transcript-generator': 'สร้างข้อความถอดเสียงพอดแคสต์ ฟรี',
  'description:/podcast-transcript-generator':
    'สร้างข้อความถอดเสียงพอดแคสต์จาก MP3 หรือ WAV ฟรี มีไทม์สแตมป์ มากกว่า 50 ภาษา ไม่ต้องเข้าสู่ระบบ แก้ไขแล้วดาวน์โหลด TXT, Markdown, SRT, VTT หรือ PDF',
  'label:/podcast-transcript-generator': 'สร้างข้อความถอดเสียงพอดแคสต์',
  'title:/interview-transcription': 'ถอดเสียงสัมภาษณ์ ฟรี ไม่ต้องมีบัญชี',
  'description:/interview-transcription':
    'ถอดเสียงสัมภาษณ์ฟรีโดยไม่ต้องสร้างบัญชี ได้ข้อความพร้อมไทม์สแตมป์ในมากกว่า 50 ภาษา เหมาะกับงานวิจัย สื่อสารมวลชน และการสรรหาบุคลากร ดาวน์โหลด TXT หรือ PDF',
  'label:/interview-transcription': 'การถอดเสียงสัมภาษณ์',
  'title:/vtt-subtitle-generator': 'สร้างซับไตเติ้ล WebVTT (.vtt) ฟรี',
  'description:/vtt-subtitle-generator':
    'สร้างไฟล์ซับไตเติ้ล WebVTT (.vtt) จากวิดีโอหรือไฟล์เสียงใดก็ได้ ฟรี เวลาตรงกับเสียงพูด รองรับมากกว่า 50 ภาษา ไม่ต้องเข้าสู่ระบบ แก้ไขบรรทัดแล้วดาวน์โหลด VTT',
  'label:/vtt-subtitle-generator': 'สร้างซับไตเติ้ล VTT',
  'title:/youtube-subtitle-generator': 'สร้างซับไตเติ้ล YouTube ไฟล์ SRT ฟรี',
  'description:/youtube-subtitle-generator':
    'สร้างไฟล์ซับไตเติ้ล SRT สำหรับวิดีโอ YouTube ของคุณเอง ฟรีและไม่ต้องเข้าสู่ระบบ เวลาตรงกับเสียงพูด รองรับมากกว่า 50 ภาษา อัปโหลดใน YouTube Studio ได้เลย',
  'label:/youtube-subtitle-generator': 'ทำซับไตเติ้ล YouTube',
  'title:/translate-audio-to-english': 'แปลเสียงพูดเป็นข้อความภาษาอังกฤษ ฟรี',
  'description:/translate-audio-to-english':
    'เปลี่ยนเสียงพูดภาษาอื่นเป็นข้อความภาษาอังกฤษฟรี เพิ่มไฟล์วิดีโอหรือไฟล์เสียง รับข้อความหรือซับไตเติ้ลภาษาอังกฤษพร้อมไทม์สแตมป์ ไม่ต้องเข้าสู่ระบบ SRT, VTT, TXT',
  'label:/translate-audio-to-english': 'แปลเสียงพูดเป็นภาษาอังกฤษ',
  'title:/guides/srt-vs-vtt': 'SRT กับ VTT: ควรใช้ซับไตเติ้ลแบบไหน',
  'description:/guides/srt-vs-vtt':
    'SRT หรือ VTT? ซับไตเติ้ลแต่ละรูปแบบคืออะไร ต่างกันอย่างไร ใช้ได้ที่ไหนบ้าง และสร้างไฟล์ทั้งสองแบบจากวิดีโอของคุณฟรีได้อย่างไร',
  'label:/guides/srt-vs-vtt': 'SRT กับ VTT',
  'title:/guides/how-to-add-subtitles-to-a-video': 'วิธีเพิ่มซับไตเติ้ลให้วิดีโอ (ฟรี)',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'ทำซับไตเติ้ลใน 4 ขั้นตอน: ถอดเสียงวิดีโอ แก้ข้อความ ส่งออกเป็น SRT หรือ VTT แล้วเพิ่มไฟล์ใน YouTube, VLC, โปรแกรมตัดต่อ หรือเครื่องเล่นเว็บของคุณ',
  'label:/guides/how-to-add-subtitles-to-a-video': 'วิธีเพิ่มซับไตเติ้ลให้วิดีโอ',
  'title:/guides/transcribe-video-without-uploading': 'ถอดเสียงวิดีโอโดยไม่ต้องอัปโหลด',
  'description:/guides/transcribe-video-without-uploading':
    'การถอดเสียงในเบราว์เซอร์ทำงานอย่างไร อะไรอยู่บนอุปกรณ์ของคุณ อะไรถูกดาวน์โหลดครั้งเดียว และตรวจสอบเองได้อย่างไรในแผงเครือข่ายของเบราว์เซอร์',
  'label:/guides/transcribe-video-without-uploading': 'ถอดเสียงวิดีโอโดยไม่ต้องอัปโหลด',
  'title:/guides/accurate-transcripts': 'วิธีให้ข้อความถอดเสียงแม่นยำขึ้น',
  'description:/guides/accurate-transcripts':
    'วิธีที่ใช้ได้จริงในการเพิ่มความแม่นยำของการแปลงเสียงเป็นข้อความ: เสียงที่สะอาดขึ้น ภาษาและโมเดลที่เหมาะสม คำใบ้คำศัพท์ และการตรวจแก้ผลลัพธ์',
  'label:/guides/accurate-transcripts': 'วิธีให้ข้อความถอดเสียงแม่นยำขึ้น',
  'title:/guides/what-is-whisper': 'Whisper คืออะไร อธิบายเสียงเป็นข้อความ',
  'description:/guides/what-is-whisper':
    'OpenAI Whisper คืออะไร ฝึกจากข้อมูลอะไร แม่นยำแค่ไหน อ่อนตรงไหน และทำงานในเบราว์เซอร์ของคุณบน TranscribeVid ได้อย่างไร',
  'label:/guides/what-is-whisper': 'Whisper คืออะไร',
};
export default dict;
