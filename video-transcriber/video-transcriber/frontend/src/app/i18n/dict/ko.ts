/** Korean dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
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
    '“{name}” 파일은 크기가 {size}이고 제한은 {limit}입니다.',
  '"{name}" is empty.': '“{name}” 파일이 비어 있습니다.',
  '"{name}" is ready. Press Transcribe to start.':
    '“{name}” 파일이 준비되었습니다. 시작하려면 ‘변환 시작’을 누르세요.',
  '“{title}” was deleted.': '삭제했습니다: “{title}”',
  '(optional)': '(선택 사항)',
  '{base} Word timing: {timing}.': '{base} 단어별 타이밍: {timing}.',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand}({domain})는 **{name}**, {address}(이하 ‘당사’)가 운영합니다. 이 방침에 설명된 대로 이용자의 데이터를 어떻게, 왜 처리할지는 당사가 결정합니다.',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand}({domain})는 **{name}**, {address}에서 운영합니다. 자세한 내용은 [소개](/about) 페이지를 참고하세요.',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand}는 일반 이용자를 위한 서비스이며, 13세 미만(해당하는 경우 EU에서는 16세 미만) 아동을 대상으로 하지 않습니다.',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand}를 만들고 운영하는 사람은 {city}에 거주하는 {role} **{name}**입니다. 저는 사람들이 최고의 텍스트 변환 경험을 하도록 이 서비스를 만들었습니다. 첫 클릭부터 매끄럽고, 계정을 만들 필요가 없으며, 방해되지 않는 깔끔한 화면을 갖췄습니다.',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand}는 일반 이용자를 위한 서비스이며 13세 미만 아동을 대상으로 하지 않습니다.',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages). No ad is shown while a file is being transcribed or beside your transcript, and never on the privacy, terms or logs pages.':
    '{brand}는 Google AdSense가 제공하는 광고를 표시하므로 무료입니다. 광고는 안내 페이지(홈, 사용 방법, 자주 묻는 질문, 도구 페이지)에만 표시됩니다. 파일을 변환하는 동안이나 변환 텍스트 옆에는 광고가 표시되지 않으며, 개인정보 처리방침, 이용약관, 로그 페이지에는 절대 표시되지 않습니다.',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    '{brand}는 무료로 사용할 수 있습니다. 파일이 어떻게 처리되는지는 [개인정보 처리방침](/privacy)에서 확인하세요.',
  '{brand} is funded by ads shown on its information pages (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand}는 안내 페이지에 표시되는 광고(Google AdSense)로 운영됩니다. 변환은 이용자의 기기에서 이루어지므로 파일마다 서버 비용이 들지 않으며, 그 덕분에 서비스를 무료로 무제한 제공할 수 있습니다. 광고가 무엇을 사용하는지, 설정은 어떻게 고르는지는 [개인정보 처리방침](/privacy)에 설명되어 있습니다.',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand}는 세 단계로 동영상이나 오디오 파일 속 음성을 타임스탬프가 붙은 텍스트로 바꿔 줍니다.',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand}는 동영상, 오디오 파일, 음성 녹음 속 음성을 정확하고 타임스탬프가 붙은 텍스트로 바꿔 줍니다. 무료이고, 변환할 수 있는 파일 수에 제한이 없으며, 계정도 필요 없습니다. 위에서 파일을 선택하고 ‘변환 시작’을 누른 다음 결과를 읽어 보세요.',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand}는 브라우저에서 바로 동영상과 오디오 파일을 텍스트로 바꿉니다. 인식은 이용자의 기기에서 실행되며 파일은 당사에 업로드되지 않습니다. 무료이고 계정이 필요 없습니다. 운영 비용은 안내 페이지의 광고(Google AdSense, [개인정보 처리방침](/privacy) 참고)로 충당합니다. 당사는 언제든지 기능을 변경, 제한 또는 중단할 수 있습니다.',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand}는 동영상과 오디오를 정확하고 타임스탬프가 붙은 텍스트로 무료로 바꿔 줍니다. 가입도, 로그인도, 워터마크도 없습니다. 페이지를 열고 파일을 선택해 변환 텍스트를 읽으면 됩니다.',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages, and are served by Google, which uses cookies.':
    '{brand}는 브라우저에서 바로 동영상과 오디오를 텍스트로 바꿉니다. 이 페이지는 그 과정이 이용자의 데이터에 어떤 의미인지 쉬운 말로 설명합니다. 요약하면 이렇습니다. 파일은 기기 밖으로 나가지 않습니다. 변환 텍스트는 이 브라우저에만 저장되고, 계정은 없으며, 사이트는 자체 쿠키를 설정하지 않습니다. 광고는 안내 페이지에만 표시되며, 쿠키를 사용하는 Google이 제공합니다.',
  '{done} of {total}': '{total} 중 {done}',
  '{duration} (estimate)': '{duration}(예상)',
  '{gb} GB of memory recommended': '메모리 {gb}GB 권장',
  '{h} h': '{h}시간',
  '{h} h {m} min': '{h}시간 {m}분',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note} ({download})',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)': '{label}(처음 사용 시 {size}MB 다운로드)',
  "{label}, as reported by visitors' browsers": '{label}, 방문자의 브라우저가 보고한 값',
  '{label}: common questions': '{label}: 자주 묻는 질문',
  '{label}. {title}.': '{label}. {title}.',
  '{label}. Look for it in your downloads.': '{label}. 다운로드 폴더에서 찾으세요.',
  '{language} → English': '{language} → 영어',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} 파일 {total}개 중 {done}개는 이미 대기열에 추가되었습니다. 나머지 {left}개는 목록에 남아 있으니 ‘변환 시작’을 눌러 다시 시도하세요.',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} 파일 {total}개 중 {done}개는 이미 대기열에 추가되었습니다. 나머지 {left}개는 목록에 남아 있으니 ‘변환 시작’을 눌러 다시 시도하세요.',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '이 기기에서는 {model} 모델이 실시간보다 느리게 실행됩니다. 오디오 {audio} 기준 소요 시간: {wait}(예상). Tiny 또는 Base는 더 빨리 끝납니다.',
  '{n} files were skipped: not video or audio.':
    '파일 {n}개를 건너뛰었습니다(동영상이나 오디오가 아님).',
  '{n} h ago': '{n}시간 전',
  '{n} min': '{n}분',
  '{n} min ago': '{n}분 전',
  '{n} min left': '{n}분 남음',
  '{n} min read': '읽는 시간 {n}분',
  '{n} minute': '{n}분',
  '{n} minutes': '{n}분',
  '{n} of {total}': '{total} 중 {n}',
  '{n} of those files are already in the list.': '그중 {n}개 파일은 이미 목록에 있습니다.',
  '{n} video transcribed': '동영상 {n}개 변환됨',
  '{n} videos transcribed': '동영상 {n}개 변환됨',
  '{n} words': '{n}단어',
  '{n}% done': '{n}% 완료',
  '{n}% model confidence': '모델 신뢰도 {n}%',
  '{n}s left': '{n}초 남음',
  '{name} home': '{name} 홈',
  '{size} download': '{size} 다운로드',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}.',
  '{title}. {blurb}': '{title}. {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}. {blurb} 이 기기에서는 사용할 수 없음: {reason}.',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**이 탭의 기술 로그.** 로그 페이지에는 이 탭 자체의 기술 로그가 표시됩니다. 로그는 브라우저에만 남으며 어디로도 전송되지 않습니다.',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**어휘 힌트를 추가하세요**: 오디오에 나오는 이름, 브랜드, 전문 용어를 원하는 표기대로 적어 주세요.',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**어휘 힌트를 추가하세요**: 이름, 브랜드, 전문 용어를 원하는 표기대로 적어 주세요.',
  '**Ads.** Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript.':
    '**광고.** 광고는 안내 페이지에만 표시되며, 쿠키를 사용하는 Google이 제공합니다. 파일을 변환하는 동안이나 변환 텍스트 옆에는 광고가 표시되지 않습니다.',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**표시된 줄을 확인**하고 변환 텍스트 편집기에서 수정하세요.',
  '**Choose the spoken language** instead of auto-detect.':
    '자동 감지 대신 **말하는 언어를 직접 선택**하세요.',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**파일을 선택하세요.** 위에 동영상이나 오디오 파일을 끌어다 놓거나, 기기에서 파일을 고르거나, 마이크로 직접 녹음하세요. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG 등 대부분의 일반적인 형식이 지원됩니다.',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**오디오 향상** — 저음 웅웅거림과 잡음을 걸러 내고 작은 목소리를 고르게 맞춥니다',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**파일 제한.** 당사는 제한을 두지 않습니다. 파일은 이용자의 기기에서 처리되므로 매우 크거나 긴 파일은 시간이 더 걸리고 충분한 여유 메모리가 필요합니다. 기기가 느리면 페이지에서 미리 알려 드립니다.',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**파일 형식.** 동영상: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS, MTS. 오디오: MP3, WAV, M4A, AAC, FLAC, OGG, OPUS. 마이크로 바로 녹음할 수도 있습니다.',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**Google 쿠키.** 광고가 로드될 때 Google은 자체 쿠키를 설정하며, 광고를 표시하는 페이지에서만 설정됩니다(6항 참고).',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**강의와 팟캐스트**를 공부용이나 쇼 노트용으로 읽기 쉬운 텍스트로 바꿉니다.',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**제한.** 지금은 서버가 알리는 크기나 길이 제한이 없습니다. 매우 큰 파일은 시간이 더 걸릴 뿐입니다.',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**제한.** 당사는 크기나 길이 제한을 두지 않습니다. 파일은 이용자의 기기에서 처리되므로 매우 크거나 긴 파일은 시간이 더 걸리고 충분한 여유 메모리가 필요합니다. 기기가 느린 경우 시작하기 전에 페이지에서 알려 주고 소요 시간을 예상해 보여 줍니다.',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**추가한 미디어.** 선택하거나 녹음한 동영상 및 오디오 파일입니다. 이 파일은 이용자의 기기에서 브라우저로 처리됩니다(WebGPU 또는 WebAssembly 사용). 파일은 당사 서버에 업로드되지 않으며 Google이나 다른 누구에게도 전송되지 않습니다.',
  '**Meeting and interview notes** that you can search, quote and share.':
    '검색하고 인용하고 공유할 수 있는 **회의 및 인터뷰 노트**.',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**실수가 있을 수 있습니다.** 완벽한 음성 인식은 없습니다. 중요한 용도로 사용하기 전에는 항상 변환 텍스트를 확인하세요.',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**자체 쿠키는 없습니다.** 사이트 자체는 쿠키를 설정하지 않습니다.',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**나중을 위해 저장되는 것은 없습니다.** 파일과 변환 텍스트는 세션 동안에만 존재합니다. 떠나기 전에 필요한 것을 내보내세요. 자세한 내용은 [개인정보 처리방침](/privacy)에 있습니다.',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**나중을 위해 저장되는 것은 없습니다.** 변환 텍스트와 파일은 이 브라우저에만 남으며, {idle} 동안 사용하지 않으면 자동으로 삭제되고 **내 데이터 지금 삭제**를 눌러도 삭제됩니다. 떠나기 전에 필요한 것을 내보내세요. 자세한 내용은 [개인정보 처리방침](/privacy)에 있습니다.',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**나중을 위해 저장되는 것은 없습니다.** 변환 텍스트는 이번 세션에만 존재하므로 필요한 것을 내보내세요. [개인정보 처리방침](/privacy)은 호스팅되는 웹사이트에 대해 설명합니다.',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**누적 합계 하나.** 변환이 끝나면 브라우저가 당사의 카운터(Cloudflare Worker)에 익명의 ‘+1’ 하나를 보냅니다. 여기에는 파일, 변환 텍스트, 식별자가 들어 있지 않습니다. Cloudflare는 전송 중에 IP 주소를 보게 되며, 남용을 막기 위해 잠시 사용합니다(요청 횟수 제한). 당사는 합계만 저장합니다. 페이지 상단에 표시되는 숫자는 방문자의 브라우저가 보고한 값이며 검증되지 않았습니다.',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    '어려운 오디오에는 **높은 정확도 또는 최고 정확도**를 선택하세요.',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**품질과 언어를 선택하세요.** 빠른 모델은 빠르게 초안을 만들어 주고, 더 정확한 모델은 인터뷰, 강의, 자막에 더 적합합니다. 말하는 언어는 자동으로 감지할 수 있으며 50개가 넘는 언어를 지원합니다.',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    '완료된 변환 텍스트를 다른 품질이나 언어로 **다시 변환**할 수 있습니다. 현재 변환 텍스트는 그대로 유지됩니다.',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    '다른 품질이나 언어로 **다시 변환**할 수 있습니다. 현재 변환 텍스트는 그대로 유지됩니다.',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**읽고, 고치고, 다운로드하세요.** 변환 텍스트가 타임스탬프와 함께 표시되고, 모델이 확신하지 못한 단어에는 표시가 되어 있어 직접 확인할 수 있습니다. 일반 텍스트, SRT 또는 VTT 자막, Markdown, JSON으로 다운로드하세요.',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**웹사이트를 전달하는 요청.** 이 웹사이트는 Cloudflare(Cloudflare Pages)가 전달합니다. Cloudflare는 당사의 호스팅 및 네트워크 제공업체로서 사이트를 전달하고 보호하기 위해 이용자의 IP 주소와 일반적인 요청 데이터(시간, 요청한 페이지, 브라우저 등)를 처리합니다.',
  '**Skip silence & music** — prevents made-up text':
    '**무음 및 음악 건너뛰기** — 지어낸 텍스트를 방지합니다',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**음성 모델은 브라우저의 캐시**(Cache Storage)에 남아 있어 다음 변환이 더 빨리 시작됩니다. 이 모델은 직접 삭제하거나(**내 데이터 지금 삭제**로도 삭제할 수 있습니다) 브라우저가 저장소를 비울 때까지 유지됩니다. 모델은 프로그램 파일이며 이용자의 데이터가 아닙니다.',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**속도.** 선택한 품질, 파일 길이, 서비스 혼잡도에 따라 달라집니다.',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**속도.** 기기, 선택한 품질, 파일 길이에 따라 달라집니다. 품질 단계를 처음 사용할 때는 해당 모델을 한 번 다운로드합니다. 브라우저가 Hugging Face에서 모델 파일을, jsDelivr에서 엔진의 프로그램 파일을 가져온 다음 캐시에 보관합니다. 작업하는 동안 탭을 열어 두세요.',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**좋은 오디오로 시작하세요**: 배경 소음이 적고, 마이크가 가깝고, 한 번에 한 사람만 말하는 것이 좋습니다. ‘오디오 향상’은 켜 두세요.',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**좋은 오디오로 시작하세요**: 배경 소음이 적고, 마이크가 가깝고, 한 번에 한 사람만 말하는 것이 좋습니다. ‘오디오 향상’은 켜 두세요.',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**브라우저 안의 저장소.** 브라우저는 위에서 설명한 대로 변환 텍스트와 파일(IndexedDB), 음성 모델(Cache Storage)을 보관하고, 밝은 테마나 어두운 테마 선택을 기억하며, 세션 저장소에는 현재 탭의 편의 설정 몇 가지(예: 마지막으로 고른 품질)가 저장됩니다. 이 중 어느 것도 당사에 전송되지 않습니다.',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    '내 동영상, 릴스, 온라인 강좌를 위한 **자막**을 SRT 또는 VTT 파일로 만들어 줍니다.',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**기기에서 만들어지는 텍스트.** 변환 텍스트와 타임스탬프, 직접 수정한 내용, 정한 제목, 선택한 설정(품질, 언어, 어휘 힌트)입니다. 이 모두는 이 브라우저에서 만들어지고 보관되며 당사는 받지 않습니다.',
  '**Use previous text as context** — can repeat on long files':
    '**이전 텍스트를 문맥으로 사용** — 긴 파일에서 반복될 수 있음',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**음성 메모**를 글로 풀어 써서 다시 들을 필요가 없게 합니다.',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**실행할 때마다, 품질 설정이나 다른 도구에 따라 결과가 달라질 수 있는 이유는 무엇인가요?** 음성 인식은 확률적입니다. 가장 가능성이 높은 단어를 고르는데, 소음이 있거나 모호한 구간에서는 여러 답이 비슷하게 가까울 수 있습니다. 품질 설정, 언어 설정, 어휘 힌트, 오디오 정리 방식이 달라지면 텍스트가 바뀔 수 있고, 다른 시스템을 쓰는 다른 도구도 마찬가지입니다. 화자 이름이나 라벨은 추가되지 않습니다.',
  '**Word-level timing** — better subtitles and confidence marks':
    '**단어별 타이밍** — 더 나은 자막과 신뢰도 표시',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**파일과 변환 텍스트는 이 브라우저에 남습니다.** 변환 텍스트, 수정 내용, 원본 파일은 이 브라우저의 저장소(IndexedDB)에만 보관됩니다. 세션이 끝나면 자동으로 삭제되며, 세션은 {idle} 동안 사용하지 않으면 끝납니다. 변환 텍스트 메뉴에서 **내 데이터 지금 삭제**를 누르면 즉시 삭제됩니다.',
  '1 file was skipped: not video or audio.': '파일 1개를 건너뛰었습니다(동영상이나 오디오가 아님).',
  '1 minute': '1분',
  '1 word': '1단어',
  '1. Agreement': '1. 약관 동의',
  '1. Who runs this website': '1. 이 웹사이트의 운영자',
  '10. Children': '10. 아동',
  '10. Termination': '10. 종료',
  '11. Children': '11. 아동',
  '11. Your rights and choices': '11. 이용자의 권리와 선택',
  '12. Changes': '12. 변경',
  '12. Open-source components': '12. 오픈소스 구성 요소',
  '13. Changes to this policy': '13. 이 방침의 변경',
  '13. Governing law': '13. 준거법',
  '14. Contact': '14. 문의',
  '2. The service': '2. 서비스',
  '2. What is processed, and where': '2. 처리되는 정보와 처리 위치',
  '3 simple steps': '간단한 3단계',
  '3. Why it is processed': '3. 처리하는 이유',
  '3. Your content': '3. 이용자의 콘텐츠',
  '4. Acceptable use': '4. 허용되는 사용',
  '4. How long it is kept': '4. 보관 기간',
  '5. Downloads your browser makes': '5. 브라우저가 내려받는 파일',
  '5. Limits: your device does the work': '5. 제한: 작업은 이용자의 기기가 합니다',
  '6. Accuracy: no warranty': '6. 정확성: 보증 없음',
  '6. Advertising': '6. 광고',
  '7. Availability': '7. 서비스 이용 가능 여부',
  '7. Cookies and browser storage': '7. 쿠키와 브라우저 저장소',
  '8. Sharing': '8. 공유',
  '8. Third-party downloads and ads': '8. 제3자 다운로드와 광고',
  '9. Liability': '9. 책임',
  '9. Security': '9. 보안',
  'A name cannot be empty, so the old name was kept.':
    '이름은 비워 둘 수 없어서 이전 이름을 그대로 두었습니다.',
  'A new transcript has started. The old one is kept in your list.':
    '새 변환이 시작되었습니다. 이전 변환 텍스트는 목록에 그대로 있습니다.',
  'a period': '일정 기간',
  About: '소개',
  'About {brand}': '{brand} 소개',
  'about {h} h': '약 {h}시간',
  'about {h} h {m} min': '약 {h}시간 {m}분',
  'about {n} min': '약 {n}분',
  'Accurate text': '정확한 텍스트',
  'Add another file': '파일 추가',
  'Add your file': '파일 추가하기',
  'Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    '광고는 안내 페이지에만 표시되며, 쿠키를 사용하는 Google이 제공합니다. 파일을 변환하는 동안이나 변환 텍스트 옆에는 광고가 표시되지 않으며, 이 웹사이트는 자체 쿠키를 설정하지 않습니다. 자세한 내용은 [개인정보 처리방침](/privacy)에 있습니다.',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    '어떤 기능도 광고가 있어야만 작동하지는 않습니다. 광고를 차단하거나 거부해도 모든 것이 똑같이 작동합니다.',
  'Ads keep TranscribeVid free. Everything works without them.':
    '광고 덕분에 TranscribeVid를 무료로 쓸 수 있습니다. 광고가 없어도 모든 기능이 작동합니다.',
  Advertisement: '광고',
  'All free tools': '모든 무료 도구',
  'All free video and audio to text tools': '모든 무료 동영상·오디오 텍스트 변환 도구',
  'All tools': '모든 도구',
  'All your data was deleted': '모든 데이터가 삭제되었습니다',
  'Allow the microphone in your browser, or choose a file instead.':
    '브라우저에서 마이크를 허용하거나 파일을 대신 선택하세요.',
  'Already added': '이미 추가됨',
  'Already finished': '이미 완료됨',
  'Also delete the downloaded speech models?': '다운로드한 음성 모델도 삭제할까요?',
  'an independent software developer': '독립 소프트웨어 개발자',
  'An upload is in progress. Wait for it to finish before adding more files.':
    '업로드가 진행 중입니다. 완료될 때까지 기다린 후 파일을 더 추가하세요.',
  'Apply style only': '스타일만 적용',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    '‘스타일만 적용’은 저장된 인식 결과를 사용하며 오디오를 다시 처리하지 않습니다. 수정한 줄은 그대로 유지됩니다.',
  'Audio works too.': '오디오도 사용할 수 있습니다.',
  'Automatic (IndicXlit when installed)': '자동(설치된 경우 IndicXlit)',
  Back: '뒤로',
  'Basic phonetic spelling': '기본 발음 표기',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    '당사는 계정이나 이용자를 식별하는 정보를 보유하지 않으므로, 일반적으로 어떤 데이터도 특정인과 연결할 수 없습니다. 개인정보 열람, 정정, 삭제, 처리 제한, 반대, 이동권, 개인정보 감독기관에 불만을 제기할 권리 등 법률이 이용자에게 부여하는 권리는 다음으로 연락하여 행사할 수 있습니다.',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    '변환 텍스트는 이 브라우저에만 존재하므로, 떠나기 전에 필요한 것을 내보내세요. 삭제된 데이터는 복구할 수 없습니다.',
  'Bengaluru, India': '인도 벵갈루루',
  'Best accuracy': '최고 정확도',
  'Best accuracy, slowest': '최고 정확도, 가장 느림',
  Breadcrumb: '이동 경로',
  'By file type': '파일 형식별',
  'By language': '언어별',
  'By use': '용도별',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    '{brand}({domain})를 이용함으로써 이용자는 이 약관에 동의하는 것입니다. 동의하지 않으면 서비스를 이용하지 마세요. 서비스는 **{name}**, {address}가 운영합니다.',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    '웹사이트나 카운터의 요청 횟수 제한이나 보안을 우회하거나 우회하려고 시도하거나, 웹사이트의 운영이나 다른 방문자의 이용을 방해하는 행위;',
  'Can I edit the transcript?': '변환 텍스트를 수정할 수 있나요?',
  "Can't reach the server.": '서버에 연결할 수 없습니다.',
  Cancel: '취소',
  'Cancel "{title}"?': '“{title}” 작업을 취소할까요?',
  'Cancel {title}': '{title} 취소',
  'Cancellation requested': '취소를 요청했습니다',
  Cancelled: '취소됨',
  'Cancelling…': '취소하는 중…',
  'Cannot reach the server': '서버에 연결할 수 없음',
  'Cannot reach the server.': '서버에 연결할 수 없습니다.',
  'Cannot reach the server. Check your connection and try again.':
    '서버에 연결할 수 없습니다. 연결 상태를 확인하고 다시 시도하세요.',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하고(npm run dev) 다시 시도하세요.',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    '줄을 수정하거나 삭제하거나, 검색하여 바꿀 수 있습니다. 수정한 내용은 모든 다운로드에 반영됩니다.',
  'Changed in {n} lines.': '{n}개 줄이 변경되었습니다.',
  'Check Hinglish spelling': '힝글리시 표기 확인',
  'Choose "Save as PDF" in the print dialog.': '인쇄 대화상자에서 ‘PDF로 저장’을 선택하세요.',
  'Choose a file': '파일 선택',
  'Choose a file first': '먼저 파일을 선택하세요',
  'Choose a format': '형식 선택',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    '기기와 사용할 수 있는 시간에 따라 더 빠른 모델과 더 정확한 모델 중에서 선택하세요.',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    '가장 빠름, 표준, 높은 정확도, 최고 정확도 중에서 선택하세요. ‘가장 빠름’이 가장 빠르고 ‘최고 정확도’는 오류가 가장 적습니다.',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    '말하는 언어를 선택하거나 자동 감지로 두세요. 음성을 영어로 번역할 수도 있습니다.',
  'Chosen files': '선택한 파일',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    '마이크에 가까이서 또렷하게 말할수록 결과가 가장 좋습니다. 추가 옵션에서 **오디오 향상**과 **무음 및 음악 건너뛰기**는 기본으로 켜져 있습니다. 이 옵션은 웅웅거림과 잡음을 걸러 내고 음악이나 긴 침묵 구간에서 모델이 없는 말을 지어내지 않도록 막아 주므로, 소음이 있는 녹음에서는 켜 두세요. 자막을 만들 때는 각 줄이 단어와 정확히 맞춰 시작하고 끝나도록 **단어별 타이밍**도 켜 두세요.',
  Close: '닫기',
  'Close menu': '메뉴 닫기',
  'Close: {title}': '닫기: {title}',
  'Common questions': '자주 묻는 질문',
  Contact: '문의',
  'Converting…': '형식 변환 중…',
  Copied: '복사됨',
  'Copy text': '텍스트 복사',
  'Copying…': '복사하는 중…',
  'Could not cancel the transcript.': '변환을 취소할 수 없었습니다.',
  'Could not change transcript style.': '변환 텍스트 스타일을 변경할 수 없었습니다.',
  'Could not copy': '복사할 수 없음',
  'Could not delete the transcript.': '변환 텍스트를 삭제할 수 없었습니다.',
  'Could not delete your data.': '데이터를 삭제할 수 없었습니다.',
  'Could not load the text to copy.': '복사할 텍스트를 불러오지 못했습니다.',
  'Could not prepare the file. Please try again.': '파일을 준비하지 못했습니다. 다시 시도하세요.',
  'Could not rename the transcript.': '변환 텍스트 이름을 바꿀 수 없었습니다.',
  'Could not save the change.': '변경 내용을 저장할 수 없었습니다.',
  'Could not start': '시작할 수 없음',
  'Could not start.': '시작할 수 없습니다.',
  Dark: '다크',
  Delete: '삭제',
  'Delete "{title}" and its transcript?': '“{title}” 및 변환 텍스트를 삭제할까요?',
  'Delete "{title}"? This cannot be undone.': '“{title}” 항목을 삭제할까요? 되돌릴 수 없습니다.',
  'Delete {title}': '{title} 삭제',
  'Delete all your transcripts and the files kept in this browser now?':
    '이 브라우저에 있는 모든 변환 텍스트와 파일을 지금 삭제할까요?',
  'Delete all your transcripts and uploaded files now?':
    '모든 변환 텍스트와 업로드한 파일을 지금 삭제할까요?',
  'Delete line': '줄 삭제',
  'Delete my data now': '내 데이터 지금 삭제',
  'Delete this line from the transcript?': '변환 텍스트에서 이 줄을 삭제할까요?',
  'Delete transcript': '변환 텍스트 삭제',
  Deleted: '삭제됨',
  'Detect automatically': '자동 감지',
  'Dismiss message': '메시지 닫기',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3는 영어 음성만 이해합니다. 번역하려면 다른 모델을 선택하세요.',
  Done: '완료',
  'Download failed': '다운로드 실패',
  'Download started': '다운로드를 시작했습니다',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '결과를 일반 텍스트, SRT 또는 VTT 자막, Markdown, JSON으로 다운로드하세요.',
  'Download the transcript as': '변환 텍스트 다운로드 형식',
  'Downloading the speech model (first time only): {loaded} of {total}':
    '음성 모델 다운로드 중(처음 한 번만): {total} 중 {loaded}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    '[홈 페이지](/)에 동영상이나 오디오 파일을 끌어다 놓거나 마이크로 녹음하세요.',
  'Drop to add your file': '여기에 놓아 파일 추가',
  'Drop your {noun} here, or choose a file': '{noun}을 여기에 끌어다 놓거나 선택하세요',
  'Each line with its time, like [00:12]': '각 줄에 [00:12]처럼 시간이 표시됩니다',
  Edit: '편집',
  'Edit it right here': '여기에서 바로 편집하세요',
  'Edit this line': '이 줄 편집',
  'Edited by you': '직접 수정함',
  'English only, very fast and accurate': '영어 전용, 매우 빠르고 정확함',
  'English translation is selected in More options.':
    '추가 옵션에서 영어 번역이 선택되어 있습니다.',
  'Enter saves · Esc cancels': 'Enter로 저장 · Esc로 취소',
  'Every line has a time. Play the media from any line to hear what was said.':
    '모든 줄에는 시간이 있습니다. 어느 줄에서든 미디어를 재생해 무슨 말이 오갔는지 들어 보세요.',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    '모든 페이지가 같은 일을 합니다. 동영상이나 오디오 파일 속 음성을 줄마다 타임스탬프가 붙은 텍스트로 바꿔 주며, 50개가 넘는 언어를 지원하고 가입이 필요 없습니다. 가지고 있는 파일이나 만들고 싶은 결과에 맞는 페이지를 고르세요.',
  'Experimental: compare on your audio; chunk timestamps':
    '실험적: 내 오디오로 비교해 보세요, 청크 단위 타임스탬프',
  'Experimental: larger model; chunk timestamps': '실험적: 더 큰 모델, 청크 단위 타임스탬프',
  Export: '내보내기',
  Failed: '실패',
  FAQ: '자주 묻는 질문',
  Fast: '빠름',
  'Fast, clean audio': '빠름, 깨끗한 오디오',
  Fastest: '가장 빠름',
  'Fastest, rough drafts only': '가장 빠름, 거친 초안 전용',
  'Fewer mistakes. Takes longer.': '오류가 더 적습니다. 시간이 더 걸립니다.',
  'Fewest mistakes. Takes the longest.': '오류가 가장 적습니다. 가장 오래 걸립니다.',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    '“{name}” 파일은 크기가 {size}이고 제한은 {limit}입니다. 제한을 높이려면 VT_MAX_UPLOAD_MB를 설정하세요',
  'File "{name}" is {size}; the limit is {limit}.':
    '“{name}” 파일은 크기가 {size}이고 제한은 {limit}입니다.',
  'file {n} of {total}': '{total}개 중 {n}번째 파일',
  'File added': '파일 추가됨',
  'File limits.': '파일 제한.',
  'File not added': '파일이 추가되지 않음',
  'File skipped': '파일을 건너뜀',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    '파일과 변환 텍스트는 세션 동안에만 존재합니다. 떠나기 전에 필요한 것을 내보내세요. 당사가 보관하는 것은 사이트에서 변환된 파일 수의 익명 누적 합계 하나뿐입니다(페이지 상단에 표시되는 숫자 하나). 이 숫자는 이용자, 파일, 세션과 연결되어 있지 않습니다. 자세한 내용은 [개인정보 처리방침](/privacy)에 있습니다.',
  'Find it automatically': '자동으로 찾기',
  'first time only, also downloads the {size} MB word-timing model':
    '처음 한 번만, {size}MB 크기의 단어별 타이밍 모델도 다운로드합니다',
  'First time only: downloads {size} (needs internet)':
    '처음 한 번만: {size} 다운로드(인터넷 필요)',
  'Follow playback': '재생 따라가기',
  'Following playback': '재생을 따라가는 중',
  Footer: '페이지 하단',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    '억양이 강하거나 여러 언어가 섞인 음성에는 더 높은 품질 설정을 시도해 보세요. 신뢰도 점수는 정확도 백분율이 아닙니다.',
  'For developers: words, times, confidence': '개발자용: 단어, 시간, 신뢰도',
  'For notes apps': '노트 앱용',
  'For video players and editors': '동영상 플레이어와 편집기용',
  'For YouTube and web video': 'YouTube와 웹 동영상용',
  Free: '무료',
  'Free tools': '무료 도구',
  'Free tools:': '무료 도구:',
  'Free video and audio to text': '무료 동영상·오디오 텍스트 변환',
  'Free video and audio to text, right in your browser':
    '브라우저에서 바로 쓰는 무료 동영상·오디오 텍스트 변환',
  'Free, unlimited, and no login needed': '무료, 무제한, 로그인 불필요',
  'Free, unlimited, no login': '무료, 무제한, 로그인 불필요',
  'Frequently asked questions': '자주 묻는 질문',
  'Get in touch': '문의하기',
  'Getting the speech engine ready…': '음성 엔진을 준비하는 중…',
  'Give it a new name': '새 이름 지정',
  'Go to the home page': '홈 페이지로 이동',
  'Go to Video to text': '동영상 텍스트 변환으로 이동',
  'Good balance (default)': '균형 잡힌 선택(기본값)',
  'Good to know': '알아 두면 좋은 점',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'Google의 동의 도구를 불러올 수 없습니다. 광고 차단 프로그램이나 네트워크가 막았을 수 있습니다. 이 도구가 없으면 광고와 광고 쿠키는 로드되지 않습니다.',
  Guides: '가이드',
  'Guides: transcripts and subtitles': '가이드: 변환 텍스트와 자막',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    '질문이 있거나 버그를 발견했거나 기능을 제안하고 싶으신가요? 메시지 보낼 곳: {email}. 모든 메시지는 {brand}를 만드는 사람이 직접 읽으며, 보통 영업일 기준 며칠 안에 답변을 받으실 수 있습니다.',
  'Helps spell uncommon words correctly.': '흔하지 않은 단어를 올바르게 표기하는 데 도움이 됩니다.',
  'High accuracy': '높은 정확도',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    '높은 정확도(Large v3 Turbo)는 번역용으로 학습되지 않아 원래 언어로 결과가 나올 수 있습니다. 번역에는 ‘표준’ 또는 ‘최고 정확도’를 선택하세요.',
  'High accuracy, slower': '높은 정확도, 더 느림',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    '값이 클수록 약간 더 정확하지만 더 느립니다. 기본값으로 5를 권장합니다.',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    '힌디어를 영어 알파벳으로 적고 영어 단어는 그대로 둡니다. 다른 언어는 원래 문자를 유지합니다. 낯선 단어와 이름은 확인하세요.',
  'Hinglish (Roman Hindi)': '힝글리시(로마자 힌디어)',
  'Hinglish conversion': '힝글리시 변환',
  History: '기록',
  Home: '홈',
  'How {brand} works': '{brand} 사용 방법',
  'How accurate is it?': '얼마나 정확한가요?',
  'How do I get better accuracy?': '정확도를 높이려면 어떻게 하나요?',
  'How it stays free': '무료로 유지되는 방법',
  'How it works': '사용 방법',
  'How long does it take?': '얼마나 걸리나요?',
  'How to transcribe a video to text': '동영상을 텍스트로 변환하는 방법',
  'How to turn a video or audio file into text with {brand}':
    '{brand}로 동영상이나 오디오 파일을 텍스트로 바꾸는 방법',
  'If it does have speech, try More › Re-transcribe with the right language.':
    '음성이 있는데도 그렇다면 ‘더보기 › 다시 변환’에서 올바른 언어로 시도해 보세요.',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    '서비스가 바쁘거나 이미 너무 많은 변환이 진행 중이면, 기다려 달라고 안내하고 그 이유를 알려 줍니다.',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    '이 방침을 변경하면 새 버전이 새로운 ‘최종 업데이트’ 날짜와 함께 이 페이지에 게시됩니다.',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'EEA, 영국, 스위스와 일부 미국 주에서는 광고가 로드될 때 Google의 인증된 동의 메시지가 이용자의 선택을 묻습니다.',
  'IndicXlit (trained model)': 'IndicXlit(학습된 모델)',
  'Is it really free and unlimited? Do I need to log in?':
    '정말 무료이고 무제한인가요? 로그인이 필요한가요?',
  'Is my data private?': '내 데이터는 비공개인가요?',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    '선택한 품질, 파일 길이, 서비스가 얼마나 바쁜지에 따라 다릅니다. ‘가장 빠름’은 빠르고, ‘최고 정확도’는 가장 오래 걸리지만 오류가 가장 적습니다. 진행 상황과 남은 시간이 실시간으로 표시되며, 차례를 기다리는 파일에는 ‘대기열에서 기다리는 중’이 표시됩니다.',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    '기기, 선택한 품질, 파일 길이에 따라 다릅니다. 고성능 그래픽 칩(WebGPU)이 있으면 가장 빠르고, 없으면 프로세서(WebAssembly)에서 실행되어 더 느립니다. ‘가장 빠름’은 빠르고, ‘최고 정확도’는 가장 오래 걸리지만 오류가 가장 적습니다. 진행 상황과 남은 시간이 실시간으로 표시됩니다.',
  'It is now called “{title}”.': '이제 이름이 “{title}”입니다.',
  'It may have been deleted.': '삭제되었을 수 있습니다.',
  'It was stopped before any text was found.': '텍스트를 찾기 전에 중단되었습니다.',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    '이 변환 텍스트를 포함한 데이터가 삭제되었습니다. 변환 텍스트는 만든 세션 동안에만 보관됩니다.',
  'Job not found': '작업을 찾을 수 없음',
  'JSON (.json)': 'JSON (.json)',
  'just now': '방금',
  'Just the words, in paragraphs': '단락으로 나눈 텍스트만',
  'Keep reading': '계속 읽기',
  'Keep this page open until the upload is done.': '업로드가 끝날 때까지 이 페이지를 열어 두세요.',
  'Kept only for this session, then deleted automatically.':
    '이번 세션 동안만 보관된 후 자동으로 삭제됩니다.',
  Language: '언어',
  'Larger or longer files are refused before they are processed, so split them first.':
    '더 크거나 긴 파일은 처리되기 전에 거부되므로 먼저 나누세요.',
  'Last updated: {date}': '최종 업데이트: {date}',
  'Licence text': '라이선스 전문',
  Light: '라이트',
  'Limits.': '제한.',
  'Line deleted': '줄 삭제됨',
  'Live: the text appears here as it is recognised':
    '실시간: 텍스트가 인식되는 대로 여기에 표시됩니다',
  'Loading model… (first use downloads it)': '모델을 불러오는 중…(처음 사용 시 다운로드)',
  'Loading…': '불러오는 중…',
  'Long (56 letters)': '길게(56자)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    '더 자세한 답변: 형식, 자막, 정확도, 개인정보 보호.',
  Main: '메인',
  'Make a new transcript of the same file. This one is kept.':
    '같은 파일의 새 변환 텍스트를 만듭니다. 이 변환 텍스트는 그대로 유지됩니다.',
  'Make a subtitle file (SRT or VTT) from your video.':
    '동영상으로 자막 파일(SRT 또는 VTT)을 만드세요.',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: '메뉴',
  Model: '모델',
  More: '더보기',
  'More answers: [Frequently asked questions](/faq)': '더 많은 답변: [자주 묻는 질문](/faq)',
  'More free tools': '더 많은 무료 도구',
  'More options': '추가 옵션',
  'More than 50 languages': '50개가 넘는 언어',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    '영어, 스페인어, 프랑스어, 독일어, 포르투갈어, 이탈리아어, 네덜란드어, 러시아어, 아랍어, 힌디어, 중국어, 일본어, 한국어를 포함해 50개가 넘는 언어를 지원합니다. 언어는 자동 감지로 두거나 직접 선택할 수 있습니다. 음성을 영어로 번역할 수도 있습니다.',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    '대부분의 텍스트 변환 사이트는 텍스트 한 줄을 보기도 전에 계정 만들기를 요구하거나, 무료 시간을 제한하거나, 워터마크를 넣거나, 구독을 권합니다. {brand}는 그 반대입니다. 제공하는 모든 기능을 누구나 쓸 수 있으며, 페이지가 요구하는 것은 파일뿐입니다.',
  'Name not changed': '이름이 변경되지 않음',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    '오디오에 나오는 이름, 브랜드, 전문 용어. 예: Kubernetes, Dr. Okafor',
  'Near-best accuracy, much faster than Large': '최고에 가까운 정확도, Large보다 훨씬 빠름',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    '그래픽 드라이버의 16비트 셰이더 지원(shader-f16) 필요',
  'needs 4 GB': '4GB 필요',
  'needs 8 GB': '8GB 필요',
  'needs a graphics-capable browser (Chrome, Edge)':
    '그래픽을 지원하는 브라우저(Chrome, Edge) 필요',
  'needs WebGPU': 'WebGPU 필요',
  'Next match': '다음 일치 항목',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    '계정도 추적도 없습니다. 파일은 세션 동안에만 보관되고 자동으로 삭제됩니다.',
  'no estimate for this model here': '이 모델은 여기서 예상 시간을 알 수 없음',
  'No login': '로그인 불필요',
  'No matches': '일치하는 항목 없음',
  'No microphone': '마이크 없음',
  'No sign-up, no payment, no daily limit. Just add your file.':
    '가입도, 결제도, 하루 제한도 없습니다. 파일만 추가하세요.',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    '지금은 서버가 알리는 크기나 길이 제한이 없습니다. 매우 큰 파일은 시간이 더 걸릴 뿐입니다.',
  'No speech was found in this file.': '이 파일에서 음성을 찾지 못했습니다.',
  'No speech was transcribed.': '변환된 음성이 없습니다.',
  'No speech was transcribed. Check the recording and the selected language.':
    '변환된 음성이 없습니다. 녹음과 선택한 언어를 확인하세요.',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    '여기서는 WebGPU를 사용할 수 없습니다. 모델이 CPU 스레드 하나에서 실행되므로 큰 크기는 실시간보다 느립니다.',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    '다른 사람의 파일이 내 파일보다 앞에 있지 않습니다. 파일을 여러 개 추가하면 내 탭에서 차례로 변환되므로, 모두 끝날 때까지 탭을 열어 두세요.',
  'None of those are video or audio files.': '동영상이나 오디오 파일이 하나도 아닙니다.',
  Normal: '보통',
  'not available for this size': '이 크기에서는 사용할 수 없음',
  'not available in this browser': '이 브라우저에서는 사용할 수 없음',
  'not available with Qwen (times are per chunk)': 'Qwen에서는 사용할 수 없음(시간은 청크 단위)',
  'Not cancelled': '취소되지 않음',
  'Not deleted': '삭제되지 않음',
  'Not renamed': '이름이 바뀌지 않음',
  'Not saved': '저장되지 않음',
  Note: '참고',
  'Nothing here yet. Transcripts you create appear here for this session.':
    '아직 아무것도 없습니다. 만든 변환 텍스트는 이 세션 동안 여기에 표시됩니다.',
  'Nothing is saved. Export what you need.': '아무것도 저장되지 않습니다. 필요한 것을 내보내세요.',
  'Nothing is uploaded until you press Transcribe.':
    '‘변환 시작’을 누르기 전에는 아무것도 업로드되지 않습니다.',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    '가입할 것도 결제할 것도 없습니다. 파일만 추가하세요.',
  'Nothing was recorded.': '녹음된 내용이 없습니다.',
  Off: '끔',
  On: '켬',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    '또렷한 음성과 지원되는 언어에서는 보통 매우 정확하지만, 완벽한 음성 인식은 없습니다. 정확도는 오디오 품질, 억양, 배경 소음, 겹치는 화자, 음악, 드문 이름이나 전문 용어에 따라 달라집니다. 모든 줄에는 신뢰도 점수가 있고, 신뢰도가 낮은 줄에는 표시가 되어 있어 먼저 확인할 수 있습니다. 중요한 용도로 사용하기 전에는 항상 변환 텍스트를 확인하세요.',
  'Open menu': '메뉴 열기',
  'Opening your transcript…': '변환 텍스트를 여는 중…',
  'or drop it anywhere on this page.': '또는 이 페이지 아무 곳에나 놓으세요.',
  'Original script': '원래 문자',
  Output: '출력',
  'Page {page} of {pages}': '{pages}페이지 중 {page}페이지',
  'Page not found': '페이지를 찾을 수 없음',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    '이미 가지고 있는 파일용 페이지: WAV, M4A, WebM, MOV.',
  'PDF document (.pdf)': 'PDF 문서(.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'PDF는 브라우저가 만듭니다. 인쇄 대화상자에서 ‘PDF로 저장’을 선택하세요.',
  'Pick quality': '품질 선택',
  'Plain text (.txt)': '일반 텍스트(.txt)',
  'Play from here': '여기부터 재생',
  'Playback speed': '재생 속도',
  'Please add one file at a time here. You can add more files on the next page.':
    '여기서는 파일을 한 번에 하나씩 추가해 주세요. 다음 페이지에서 더 추가할 수 있습니다.',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    '개인적인 녹음은 보내지 마세요. {brand}는 이용자의 기기에서 파일을 변환하며 당사는 파일을 받지 않으므로, 도움을 드리는 데 파일이 필요하지 않습니다.',
  'Please note': '참고 사항',
  Preparing: '준비 중',
  'Preparing audio…': '오디오 준비 중…',
  'Preparing the audio…': '오디오를 준비하는 중…',
  'Preparing…': '준비 중…',
  'Press a question to read its answer.': '질문을 눌러 답변을 읽어 보세요.',
  'Previous match': '이전 일치 항목',
  'Print to PDF': 'PDF로 인쇄',
  Privacy: '개인정보',
  'Privacy and cookie settings': '개인정보 및 쿠키 설정',
  'Privacy policy': '개인정보 처리방침',
  'Privacy requests': '개인정보 관련 요청',
  Private: '비공개',
  Progress: '진행 상황',
  Quality: '품질',
  'Questions about these terms:': '이 약관에 대한 문의:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    '질문, 버그 신고, 아이디어는 언제든 환영합니다. 보낼 곳: {email}. 포함할 내용은 [문의](/contact) 페이지에서 확인하세요.',
  Queued: '대기 중',
  'Quick results. Good for clear speech.': '빠른 결과. 또렷한 음성에 적합합니다.',
  Quickest: '가장 빠름',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'Qwen은 대략적인 청크 단위 타임스탬프를 사용합니다. 단어별 타이밍과 신뢰도는 사용할 수 없습니다.',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'Qwen은 청크 단위 타임스탬프를 사용하며 단어별 신뢰도를 제공하지 않습니다. 선택하기 전에 짧은 샘플로 비교해 보세요.',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR(실험적)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASR에는 WebGPU(Chrome 또는 Edge)와 그래픽 드라이버의 16비트 셰이더 지원(shader-f16)을 갖춘 데스크톱 브라우저가 필요합니다.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASR에는 WebGPU(Chrome 또는 Edge)와 8GB 메모리를 갖춘 데스크톱 브라우저가 필요합니다.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASR에는 WebGPU(Chrome 또는 Edge)를 갖춘 데스크톱 브라우저가 필요합니다.',
  'Re-transcribe': '다시 변환',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    '타임스탬프와 함께 변환 텍스트를 읽고, 모델이 확신하지 못한 단어를 확인한 다음 그 자리에서 고치세요.',
  'Read, edit, download': '읽고, 편집하고, 다운로드',
  Ready: '준비됨',
  'Ready to print or share': '인쇄하거나 공유할 준비 완료',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    '시작해 볼까요? [모든 무료 도구 보기](/tools) 또는 [지금 파일 변환하기](/).',
  'Recognition engine': '인식 엔진',
  Recommended: '추천',
  'Record from microphone': '마이크에서 녹음',
  'Record straight from your microphone and turn it into text.':
    '마이크로 바로 녹음해서 텍스트로 바꿔 보세요.',
  'Record with your microphone': '마이크로 녹음',
  'Recording {stamp}': '녹음 {stamp}',
  'Recording is not supported by this browser.': '이 브라우저는 녹음을 지원하지 않습니다.',
  'Related reading': '관련 글',
  Remove: '제거',
  'Remove {name}': '{name} 제거',
  'Removes it for good': '영구적으로 삭제됩니다',
  Rename: '이름 바꾸기',
  Renamed: '이름 변경됨',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    '{n}개 줄에서 “{query}” → “{replacement}” 바꾸기를 적용할까요?',
  'Replace "{query}" with "{replacement}" in 1 line?':
    '1개 줄에서 “{query}” → “{replacement}” 바꾸기를 적용할까요?',
  'Replace in {n} lines': '{n}개 줄에서 바꾸기',
  'Replace in 1 line': '1개 줄에서 바꾸기',
  'Replace with': '바꿀 내용',
  'Replace with…': '바꿀 내용…',
  'Replace…': '바꾸기…',
  Replaced: '바꿨습니다',
  'Reporting a problem': '문제 신고',
  'Retrying…': '다시 시도하는 중…',
  'Review language and quality': '언어와 품질 검토',
  'Review this transcript': '이 변환 텍스트 검토',
  Save: '저장',
  Saved: '저장됨',
  'Saving…': '저장하는 중…',
  'Search depth: {n}': '검색 깊이: {n}',
  'Search the text': '텍스트 검색',
  'Search the transcript': '변환 텍스트 검색',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    '[이용약관](/terms), [사용 방법](/how-it-works), [자주 묻는 질문](/faq)도 참고하세요.',
  'Server busy': '서버 혼잡',
  'Session only — nothing is saved.': '세션 전용 — 아무것도 저장되지 않습니다.',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    '세션 전용 — 아무것도 저장되지 않습니다. 앱을 닫으면 모든 변환 텍스트가 지워집니다. 필요한 것을 내보내세요.',
  'Session time left: about {n} min': '남은 세션 시간: 약 {n}분',
  'Short (32 letters)': '짧게(32자)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    '음성을 텍스트와 자막으로 바꾸는 방법에 대한 짧고 실용적인 답변입니다. 어떤 자막 형식을 고를지, 동영상에 자막을 추가하는 방법, 더 정확한 변환 텍스트를 얻는 방법, 파일을 업로드하지 않고 브라우저에서 변환할 수 있는 이유를 다룹니다.',
  'Show all {count} languages': '{count}개 언어 모두 보기',
  'Six ways to download': '다운로드 방법 6가지',
  'Skip to main content': '본문으로 건너뛰기',
  Slower: '느림',
  'slower than real time on the measured laptop': '측정한 노트북에서 실시간보다 느림',
  Slowest: '가장 느림',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    '일부 기능은 사용할 때 오픈소스 구성 요소를 브라우저에 다운로드합니다. 이 구성 요소는 엔진의 나머지 부분과 마찬가지로 이용자의 기기에서 실행됩니다. 해당 라이선스에 따라 다음 고지를 표시해야 합니다.',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    '반복되는 텍스트나 불확실한 음성 경계 때문에 직접 들어 보고 확인해야 하는 구간이 있습니다.',
  'Something went wrong': '문제가 발생했습니다',
  'Something went wrong in this browser. Please try again.':
    '이 브라우저에서 문제가 발생했습니다. 다시 시도하세요.',
  'Something went wrong while reading this file.': '이 파일을 읽는 중 문제가 발생했습니다.',
  'Source code': '소스 코드',
  Speed: '속도',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    '휴대폰과 태블릿의 속도는 측정값이 아니라 추정값입니다. tiny와 base가 안전한 크기입니다.',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    '자막에는 SRT와 VTT, 읽기에는 TXT와 Markdown, 프로그램에는 JSON, 인쇄에는 PDF를 사용하세요.',
  Standard: '표준',
  'Standard (42 letters)': '표준(42자)',
  Start: '시작',
  'Start a new transcription': '새 변환 시작',
  'Start again': '다시 시작',
  'Started again': '다시 시작했습니다',
  'Starting…': '시작하는 중…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    '궁금한 점이 더 있나요? [자주 묻는 질문](/faq)을 읽거나, [사용 방법](/how-it-works)을 보거나, [문의](/contact)하세요.',
  'Still stuck? [Read How it works](/how-it-works)':
    '아직 해결되지 않았나요? [사용 방법 읽기](/how-it-works)',
  'Stop recording · {time}': '녹음 중지 · {time}',
  'Stop this transcription? The text found so far is kept.':
    '이 변환을 중지할까요? 지금까지 찾은 텍스트는 유지됩니다.',
  'Stopping the transcription worker. The text found so far is kept.':
    '변환 작업을 중지하는 중입니다. 지금까지 찾은 텍스트는 유지됩니다.',
  'Stored on this device only, never uploaded.': '이 기기에만 저장되며 업로드되지 않습니다.',
  'Style unchanged': '스타일 변경 없음',
  'Style updated': '스타일이 업데이트됨',
  'Style updated using the saved recognition. Edited lines are kept.':
    '저장된 인식 결과로 스타일을 업데이트했습니다. 수정한 줄은 그대로 유지됩니다.',
  'Subtitle files': '자막 파일',
  'Subtitle line length': '자막 줄 길이',
  'Subtitles (.srt)': '자막(.srt)',
  'Switch to dark theme': '어두운 테마로 전환',
  'Switch to light theme': '밝은 테마로 전환',
  Terms: '약관',
  'Terms of use': '이용약관',
  'Text with times (.txt)': '시간이 포함된 텍스트(.txt)',
  'That file is already in the list.': '그 파일은 이미 목록에 있습니다.',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    '동영상이나 오디오 파일이 아닙니다. MP4, MOV, MP3 또는 다른 동영상이나 오디오 파일을 선택하세요.',
  'That is not a video or audio file. Please choose a video or audio file.':
    '동영상이나 오디오 파일이 아닙니다. 동영상이나 오디오 파일을 선택하세요.',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    '오디오 파일이 아닙니다. MP3, WAV, M4A 또는 다른 오디오 파일을 선택하세요.',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    '[개인정보 처리방침](/privacy)에서 어떤 정보가 왜 처리되는지 설명합니다. 데이터에 대해 질문하거나 권리를 행사하려면 같은 주소로 보내 주세요.',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    '이 기기에서는 {label} 모델을 실행할 수 없습니다: {reason}. 다른 모델을 선택하세요.',
  'the exact error message, or a screenshot of it.': '정확한 오류 메시지 또는 그 스크린샷.',
  'The file is larger than the server accepts.': '파일이 서버가 허용하는 크기보다 큽니다.',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    '품질 단계를 처음 사용할 때 브라우저가 해당 음성 모델을 한 번 다운로드해 보관하므로, 이후 파일은 더 빨리 시작됩니다.',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    '품질 단계를 처음 사용할 때 브라우저가 Hugging Face에서 음성 모델을, jsDelivr에서 엔진의 프로그램 파일을 다운로드해 다음에 쓸 수 있도록 보관합니다. 이때 이용자의 파일은 어떤 것도 함께 전송되지 않습니다. 변환이 끝나면 브라우저가 페이지 상단의 익명 카운터에 1을 더하며, 그 외에는 아무것도 보내지 않습니다.',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    '그래픽 드라이버가 16비트 셰이더를 지원하지 않아 다운로드가 더 크고 메모리 사용량이 더 많습니다.',
  'The line was removed.': '줄이 제거되었습니다.',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    '주요 도구: 모든 동영상이나 오디오 파일을 타임스탬프가 붙은 변환 텍스트로 바꿉니다.',
  'The page you are looking for does not exist or has moved.':
    '찾으시는 페이지가 없거나 이동했습니다.',
  'The recording failed. Please try again.': '녹음에 실패했습니다. 다시 시도하세요.',
  'The server does not have enough free disk space for this file.':
    '서버에 이 파일을 처리할 만한 여유 디스크 공간이 없습니다.',
  'The server is busy': '서버가 혼잡합니다',
  'The server is busy right now.': '지금은 서버가 혼잡합니다.',
  'The service is busy right now. Please wait a moment and try again.':
    '지금은 서비스가 혼잡합니다. 잠시 기다린 후 다시 시도하세요.',
  'The service is full right now. Please try again in a little while.':
    '지금은 서비스가 가득 찼습니다. 잠시 후 다시 시도하세요.',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    '음성 인식은 이용자의 브라우저 안에서 OpenAI Whisper 같은 오픈 음성 인식 모델로 실행됩니다. 브라우저가 모델을 한 번 다운로드해 보관한 다음 모든 작업을 이용자의 기기에서 처리합니다. 동영상이나 오디오는 당사에 업로드되지 않으며, 그래서 파일 크기 제한도 다른 사람 파일의 대기열도 없습니다. 각 단계는 [사용 방법](/how-it-works) 페이지에 설명되어 있습니다.',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    '말하는 언어를 확실하게 식별하지 못했습니다. 들리는 언어를 선택하고 다시 시도하세요.',
  'The text found before it was stopped is shown below.':
    '중단되기 전에 찾은 텍스트가 아래에 표시됩니다.',
  'The text found so far is kept.': '지금까지 찾은 텍스트는 유지됩니다.',
  'The text is ready to paste.': '텍스트를 붙여넣을 준비가 되었습니다.',
  'The transcript finished before it could be cancelled.': '취소하기 전에 변환이 끝났습니다.',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    '변환은 이용자의 기기에서 OpenAI Whisper 같은 오픈 음성 인식 모델로 실행됩니다. 브라우저가 모델을 한 번 다운로드해 보관하므로 다음 파일은 더 빨리 시작되며, 동영상이나 오디오는 어디에도 업로드되지 않습니다.',
  'the type and length of the file, for example "MP4, 25 minutes";':
    '파일의 형식과 길이(예: “MP4, 25분”);',
  'There is no size or length limit set here.':
    '여기에는 크기나 길이 제한이 설정되어 있지 않습니다.',
  'These details make a problem much quicker to find and fix:':
    '이런 정보가 있으면 문제를 훨씬 빨리 찾아 고칠 수 있습니다:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    '이 약관은 인도 법률의 적용을 받습니다. 약관에서 발생하는 모든 분쟁은 인도 카르나타카주 벵갈루루 법원이 전속 관할권을 가집니다. 이는 이용자가 거주하는 국가의 강행 소비자 보호법에 따른 보호를 박탈하지 않습니다.',
  'They are downloaded again the next time you transcribe.':
    '다음에 변환할 때 다시 다운로드됩니다.',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'Google을 포함한 제3자 공급업체는 이용자가 이 웹사이트나 다른 웹사이트를 이전에 방문한 기록을 바탕으로 광고를 제공하기 위해 쿠키를 사용합니다. Google이 광고 쿠키를 사용하면 Google과 파트너는 이 사이트 및/또는 인터넷의 다른 사이트 방문 기록을 바탕으로 이용자에게 광고를 제공할 수 있습니다.',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    '이 상자는 MP3, WAV, M4A 같은 오디오 파일을 받지만, 그 파일은 동영상입니다.',
  'This browser cannot record. Please choose a file instead.':
    '이 브라우저는 녹음할 수 없습니다. 대신 파일을 선택하세요.',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    '이 브라우저는 메모리를 보고하지 않아 {gb}GB로 가정합니다. 페이지가 느려지면 더 작은 모델을 선택하세요.',
  'This cannot be undone. Export anything you want to keep first.':
    '이 작업은 되돌릴 수 없습니다. 보관하려는 것이 있으면 먼저 내보내세요.',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '{brand}의 이 사본은 이용자의 컴퓨터에서 실행됩니다. 파일은 이 컴퓨터에서 처리되며 밖으로 나가지 않습니다. 영구 저장되는 것은 없습니다. 변환 텍스트는 이번 세션 동안에만 존재하므로 필요한 것을 내보내세요. [개인정보 처리방침](/privacy)은 호스팅되는 웹사이트에 대해 설명합니다.',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    '이 사본은 이용자의 컴퓨터에서 실행됩니다. 파일은 이 컴퓨터에서 처리되며 밖으로 나가지 않습니다.',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    '이 기기는 이렇게 긴 파일을 처리할 메모리가 부족합니다. 작은 조각으로 나누어 처리하므로 더 느립니다. 더 짧게 자르거나 더 작은 모델을 쓰는 편이 안전합니다.',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    '이 파일에는 브라우저에서 실행되는 9MB 변환 프로그램이 필요합니다. 불러올까요?',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    '이것은 편의를 위한 번역입니다. 영어 버전과 다른 경우 영어 버전이 적용됩니다.',
  'This local copy does not count transcriptions': '이 로컬 사본은 변환 횟수를 집계하지 않습니다',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    '이 변환 텍스트는 모델 신뢰도가 낮습니다. 텍스트를 사용하기 전에 녹음을 듣고 말하는 언어를 확인하세요.',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    '이 기기에서 걸리는 시간은 {wait}입니다(예상). 끝날 때까지 탭을 열어 두세요.',
  Timestamps: '타임스탬프',
  'Tips for the best results': '최상의 결과를 위한 팁',
  'Tips for the best transcript': '최고의 변환 텍스트를 위한 팁',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    '광고 선택을 변경하려면 [Google 광고 설정](https://adssettings.google.com) 또는 브라우저의 쿠키 설정을 사용하세요.',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    '광고 선택을 변경하려면 광고가 표시되는 페이지 하단의 **개인정보 및 쿠키 설정**, [Google 광고 설정](https://adssettings.google.com) 또는 브라우저의 쿠키 설정을 사용하세요.',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    '이용자가 요청한 텍스트 변환을 이용자의 기기에서 제공하고, 웹사이트를 안전하게 전달하며, 광고를 통해 서비스를 무료로 유지하기 위해서입니다. GDPR과 같은 개인정보 보호법이 적용되는 경우, 당사의 법적 근거는 이용자가 요청한 서비스의 제공(제6조 제1항 (b)호), 보안·남용 방지·익명 누적 합계에 대한 당사의 정당한 이익(제6조 제1항 (f)호), 그리고 법률이 요구하는 경우 광고 쿠키에 대한 이용자의 동의(제6조 제1항 (a)호)이며, 동의는 Google의 동의 메시지를 통해 요청됩니다.',
  'To keep it fast for everyone, each file has a size and length limit.':
    '모두가 빠르게 쓸 수 있도록 각 파일에는 크기와 길이 제한이 있습니다.',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    '법률이 허용하는 범위에서, 당사는 간접 손해나 결과적 손해, 데이터·이익·사업의 손실, 또는 서비스의 이용이나 이용 불가, 변환 텍스트의 오류로 인해 발생한 어떠한 손실에 대해서도 책임지지 않습니다. 이 약관의 어떤 내용도 법률상 제한할 수 없는 책임을 제한하지 않습니다.',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    '이용자의 기기에서 변환하기 위해 브라우저는 Hugging Face(huggingface.co)에서 음성 모델 파일을, jsDelivr(cdn.jsdelivr.net)에서 음성 엔진의 프로그램 파일을 다운로드하고, 삭제할 때까지 다음 사용을 위해 캐시(Cache Storage)에 보관합니다. 이 제공업체들은 일반적인 요청 데이터(IP 주소, 브라우저, 요청된 파일)를 받으며, 이용자의 미디어나 변환 텍스트는 절대 받지 않습니다.',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    '이용자의 기기에서 작동하도록 브라우저는 Hugging Face에서 음성 모델을, jsDelivr에서 프로그램 파일을 다운로드합니다. 이들은 각자의 라이선스와 약관에 따라 제공됩니다. 광고는 Google AdSense가 제공하며, 광고는 당사가 관리하지 않고 책임지지 않는 제3자 웹사이트로 연결됩니다.',
  Transcribe: '변환 시작',
  'Transcribe (same language)': '텍스트 변환(같은 언어)',
  'Transcribe {n} files': '{n}개 파일 변환 시작',
  'Transcribe a file': '파일 변환하기',
  'Transcribe or translate speech in the language you need.':
    '필요한 언어로 음성을 변환하거나 번역하세요.',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    '50개가 넘는 언어로 동영상, 오디오 파일, 음성 녹음을 텍스트로 바꾸거나 언어를 자동으로 감지하게 하세요.',
  'Transcribing {n}%': '변환 중 {n}%',
  'Transcribing takes {time} on this device.': '이 기기에서 변환하는 데 걸리는 시간: {time}.',
  'Transcribing…': '변환하는 중…',
  '{blurb} Not sure? Keep this one.': '{blurb} 잘 모르겠다면 이것을 그대로 두세요.',
  '{reason} Retrying in {n} s…': '{reason} {n}초 후 다시 시도합니다…',
  'Alternatives': '대안',
  'Checking the downloaded file…': '다운로드한 파일을 확인하는 중…',
  'Connection lost.': '연결이 끊어졌습니다.',
  'Continued after the page reloaded.': '페이지를 새로고침한 뒤 이어서 진행했습니다.',
  'Continuing the download ({size} already saved)': '다운로드를 이어서 받는 중(이미 {size} 저장됨)',
  'Downloaded: ready to start': '다운로드 완료: 바로 시작할 수 있습니다',
  'Every language in its own script: English in English letters, Hindi in Devanagari. Choose Hinglish to write Hindi in English letters.': '모든 언어를 각자의 문자로 표기합니다. 영어는 영어 알파벳으로, 힌디어는 데바나가리 문자로 적습니다. 힌디어를 영어 알파벳으로 적으려면 힝글리시를 선택하세요.',
  'First time only: downloads {size}, now downloading in the background': '처음 한 번만: {size} 다운로드(지금 백그라운드에서 다운로드 중)',
  'Getting the model ready: {loaded} of {total}': '모델을 준비하는 중: {total} 중 {loaded}',
  'Good for most videos.': '대부분의 동영상에 적합합니다.',
  'Honest, dated comparisons with other transcription services.': '다른 텍스트 변환 서비스와의 솔직하고 날짜를 명시한 비교입니다.',
  'Keep this page open until it is finished. If it reloads or closes, it continues where it stopped when you open the site again.': '완료될 때까지 이 페이지를 열어 두세요. 페이지가 새로고침되거나 닫혀도 사이트를 다시 열면 멈춘 지점부터 이어서 진행됩니다.',
  'Length {time}': '길이 {time}',
  'Opens in Word and Google Docs': 'Word와 Google 문서에서 열립니다',
  'Reconnecting…': '다시 연결하는 중…',
  'The download server is busy (HTTP {status}).': '다운로드 서버가 혼잡합니다(HTTP {status}).',
  'The download stalled.': '다운로드가 멈췄습니다.',
  'Time so far {time}': '경과 시간 {time}',
  'Translated to English': '영어로 번역됨',
  'Waiting for the internet connection…': '인터넷 연결을 기다리는 중…',
  'Word document (.docx)': 'Word 문서(.docx)',
  'Transcribed in {time}': '변환 소요 시간: {time}',
  Transcript: '변환 텍스트',
  'Transcript name': '변환 텍스트 이름',
  'Transcript not found': '변환 텍스트를 찾을 수 없음',
  'Transcript ready': '변환 텍스트 준비됨',
  'Transcript style': '변환 텍스트 스타일',
  'Transcription failed': '변환 실패',
  'Transcription has started. The text appears below as it is recognised.':
    '변환이 시작되었습니다. 텍스트는 인식되는 대로 아래에 표시됩니다.',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    '변환이 시작되었습니다. 다른 파일은 페이지 상단의 변환 텍스트에서 볼 수 있습니다.',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    '변환은 이용자의 기기에서 실행되며 프로세서, 그래픽 칩, 메모리, 배터리를 사용합니다. 당사는 파일 크기나 길이 제한을 두지 않지만, 실행 속도와 브라우저가 처리할 수 있는 파일 크기는 기기에 따라 달라집니다. 느린 휴대폰이나 컴퓨터에서 긴 파일은 오래 걸리거나 메모리가 부족할 수 있습니다. 변환 텍스트와 파일은 이 브라우저에 보관되며 {idle} 동안 사용하지 않으면 자동으로 삭제됩니다. [개인정보 처리방침](/privacy)을 참고하세요.',
  'Transcription settings': '변환 설정',
  Transcripts: '변환 텍스트',
  'Transcripts {n}': '변환 텍스트 {n}',
  'Transcripts are only kept for the browser session that created them.':
    '변환 텍스트는 이를 만든 브라우저 세션 동안에만 보관됩니다.',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    '변환 텍스트는 자동으로 생성되므로 오류가 포함될 수 있습니다. 특히 소음이 있는 오디오, 강한 억양, 겹치는 화자, 음악, 이름이나 전문 용어에서 그렇습니다. 특히 법률, 의료, 금융 용도나 공개 용도로 사용하기 전에는 항상 변환 텍스트를 확인하세요. 서비스는 정확성, 완전성, 특정 목적에 대한 적합성을 포함하여 명시적이든 묵시적이든 어떠한 보증도 없이 ‘있는 그대로’, ‘제공 가능한 상태로’ 제공됩니다.',
  'Translate to English': '영어로 번역',
  'Try again': '다시 시도',
  'Try another quality or language': '다른 품질이나 언어 시도',
  'try to spread malware or anything meant to damage the service.':
    '악성 코드나 서비스에 피해를 주려는 모든 것을 퍼뜨리려는 행위.',
  'Trying again in a moment…': '잠시 후 다시 시도합니다…',
  'Trying again. This page loads by itself as soon as the server is back.':
    '다시 시도하는 중입니다. 서버가 복구되면 이 페이지가 자동으로 불러와집니다.',
  'under a minute': '1분 미만',
  'Underline unsure words': '불확실한 단어에 밑줄 표시',
  Unlimited: '무제한',
  'Unsure: worth listening to again': '불확실: 다시 들어 볼 만함',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    '업로드가 갑자기 지나치게 몰리면 잠시 기다리라는 안내가 나올 수 있습니다.',
  'Up to {minutes} per file.': '파일당 최대 {minutes}.',
  'Up to {size} and {minutes} minutes per file.': '파일당 최대 {size}, {minutes}분.',
  'Up to {size} and {minutes} per file.': '파일당 최대 {size}, {minutes}.',
  'Up to {size} per file.': '파일당 최대 {size}.',
  'Updated {date}': '{date} 업데이트',
  'Upload complete': '업로드 완료',
  'Upload failed': '업로드 실패',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    '업로드 실패(서버 오류 {status}). 서버를 실행 중인 터미널에서 자세한 내용을 확인하세요.',
  'Upload failed (server error {status}). Please try again in a moment.':
    '업로드 실패(서버 오류 {status}). 잠시 후 다시 시도하세요.',
  Uploading: '업로드 중',
  'Uploading…': '업로드하는 중…',
  'use a computer for this size': '이 크기에는 컴퓨터를 사용하세요',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    '서면 허가 없이 웹사이트나 카운터에 스크립트, 봇 또는 기타 자동화 수단을 사용하거나 임의로 만든 수치를 보내는 행위;',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    '불법적이거나 타인의 권리를 침해하는 콘텐츠에 서비스를 사용하는 행위;',
  'use the service to harass, harm or deceive others;':
    '타인을 괴롭히거나 해치거나 속이는 데 서비스를 사용하는 행위;',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    '또렷한 음성에서는 보통 매우 정확합니다. 확신하지 못하는 줄에는 표시가 되어 있어 먼저 확인할 수 있습니다.',
  'Video and audio to text': '동영상 및 오디오 텍스트 변환',
  'Video or audio, several at once is fine.':
    '동영상이나 오디오, 여러 개를 한 번에 추가해도 됩니다.',
  'Video to text, accurately.': '정확한 동영상 텍스트 변환.',
  'Video to text: transcribe a video or audio file':
    '동영상 텍스트 변환: 동영상이나 오디오 파일 변환',
  'video transcribed': '동영상 변환됨',
  'videos transcribed': '동영상 변환됨',
  'Vocabulary hint': '어휘 힌트',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    '음성 메모, 회의, 강의, 팟캐스트, 인터뷰.',
  'Waiting for microphone permission…': '마이크 권한을 기다리는 중…',
  'Waiting for the first words…': '첫 단어를 기다리는 중…',
  'Waiting in line…': '대기열에서 기다리는 중…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    '텍스트가 실시간으로 나타나는 것을 보고, 오류를 고친 다음 SRT, VTT, TXT, Markdown, JSON 또는 PDF로 다운로드하세요.',
  'We do not ask for your name, e-mail address or any other account details.':
    '이름, 이메일 주소 또는 그 밖의 계정 정보를 요구하지 않습니다.',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    '당사는 서비스가 항상 이용 가능하거나, 중단되지 않거나, 오류가 없을 것을 보장하지 않습니다. 웹사이트나 필요한 다운로드(Hugging Face의 음성 모델과 jsDelivr의 프로그램 파일)는 점검이나 당사가 통제할 수 없는 이유로 이용할 수 없을 수 있으며, 일부 브라우저나 기기는 모든 모델을 실행하지 못합니다. 변환 텍스트는 이 브라우저에만 보관되고 사용하지 않으면 삭제되므로, 필요한 것은 항상 내보내세요.',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    '당사는 이용자의 데이터를 판매하지 않습니다. 당사는 이용자의 파일이나 변환 텍스트를 보유하지 않으므로 공유할 것도 없습니다. 인식은 외부 텍스트 변환 서비스나 AI 서비스가 아니라 이용자의 기기에서 실행됩니다. Google(광고), Cloudflare(호스팅과 카운터), Hugging Face와 jsDelivr(다운로드)는 위에 설명된 정보만 받습니다. 법률이 요구하는 경우 당사는 정보를 공개할 수 있습니다.',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    '당사 측에는 이용자의 어떤 정보도 보관하지 않습니다. 누적 합계 하나를 제외하고는 이용자의 사용에 관한 어떤 것도 당사가 저장하지 않습니다.',
  'We may block access if these rules are broken.': '이 규칙을 위반하면 접근을 차단할 수 있습니다.',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    '당사는 이 약관을 수정할 수 있습니다. 새 버전은 새로운 ‘최종 업데이트’ 날짜와 함께 이 페이지에 게시되며 그때부터 적용됩니다.',
  'We never send your file, your transcript or any personal information to Google.':
    '당사는 이용자의 파일, 변환 텍스트 또는 개인정보를 Google에 절대 보내지 않습니다.',
  'Web subtitles (.vtt)': '웹 자막(.vtt)',
  'What people use it for': '사람들이 사용하는 용도',
  'What you can do with it': '할 수 있는 일',
  'What you get': '제공하는 기능',
  'what you were doing, and what happened instead of what you expected;':
    '무엇을 하고 있었는지, 그리고 예상과 달리 무슨 일이 일어났는지;',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    '파일이 어디에서 처리되는지는 {brand}가 어떻게 실행되는지에 따라 다르며, 방금 서버가 응답하지 않았습니다. [개인정보 처리방침](/privacy)을 참고하세요.',
  'Where your files are processed depends on how {brand} is run.':
    '파일이 어디에서 처리되는지는 {brand}가 어떻게 실행되는지에 따라 다릅니다.',
  'Which files can I use, and what are the limits?':
    '어떤 파일을 사용할 수 있고, 제한은 무엇인가요?',
  'Which languages are supported?': '어떤 언어를 지원하나요?',
  'Who builds it': '만든 사람',
  'Who runs this website': '이 웹사이트의 운영자',
  'Why it exists': '만든 이유',
  'Working…': '작업 중…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    '예. 무료이며 계정이나 로그인은 앞으로도 없습니다. 하루나 한 달 사용량 제한도 유료 장벽도 없고, 광고가 웹사이트를 무료로 유지해 줍니다.',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    '예. 무료이며 계정이나 로그인은 앞으로도 없습니다. 하루나 한 달 사용량 제한도 유료 장벽도 없습니다.',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    '예. 무료이며 가입하거나 로그인할 필요가 없습니다. 이 사본은 이용자의 컴퓨터에서 실행되므로 사용량 제한도 유료 장벽도 없으며, 작동 속도는 컴퓨터에 따라 달라집니다.',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    '예. 줄 옆의 연필을 눌러 텍스트를 바꾸거나 줄을 삭제할 수 있고, 전체 변환 텍스트에서 검색해 바꿀 수도 있습니다. 수정한 내용은 모든 내보내기에 포함됩니다.',
  'You agree not to:': '이용자는 다음을 하지 않기로 동의합니다:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    '이용자가 통제합니다. **내 데이터 지금 삭제**로 언제든지 변환 텍스트, 파일, 원한다면 다운로드한 음성 모델까지 삭제할 수 있습니다. 삭제되는 것은 이 브라우저의 데이터뿐이며 Google의 쿠키는 삭제할 수 없습니다.',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    '광고가 표시되는 모든 페이지(예: 홈 페이지) 하단의 **개인정보 및 쿠키 설정**으로 언제든지 변경할 수 있습니다.',
  'You can now read, fix and download it.': '이제 읽고, 고치고, 다운로드할 수 있습니다.',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    '서비스 이용은 언제든 중단할 수 있으며, **내 데이터 지금 삭제**로 이 브라우저의 데이터를 삭제할 수 있습니다. 당사는 특히 이 약관을 위반한 경우 언제든지 이용자의 접근을 정지하거나 종료할 수 있습니다.',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    '이용자가 추가한 파일과 그 파일로 만든 변환 텍스트에 대한 모든 권리는 이용자에게 있습니다. 이들은 이용자의 기기에서 처리되며 당사는 받지 않습니다. 무엇을 변환할지는 이용자의 책임입니다. 직접 소유했거나 처리할 권리가 있는 콘텐츠만 사용하고, 그 안에서 말하는 사람들에게서 필요한 허락도 받으세요.',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    '[Google 광고 설정](https://adssettings.google.com)을 방문하여 맞춤 광고를 거부하거나, [www.aboutads.info](https://www.aboutads.info)에서 일부 제3자 공급업체의 맞춤 광고용 쿠키 사용을 거부할 수 있습니다. [Google이 자사 서비스를 사용하는 사이트의 정보를 사용하는 방법](https://policies.google.com/technologies/partner-sites)을 알아보세요.',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    '브라우저와 버전, 기기(컴퓨터 또는 휴대폰과 운영 체제);',
  'Your browser blocked copying here. Use Export to save the text instead.':
    '브라우저가 여기서 복사를 차단했습니다. 대신 내보내기를 사용해 텍스트를 저장하세요.',
  'Your change is saved.': '변경 내용이 저장되었습니다.',
  'Your change is still in its box: press Save to try again.':
    '변경 내용이 아직 입력란에 있습니다. 저장을 눌러 다시 시도하세요.',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    '파일은 암호화된 연결로 서버에 전송되어 OpenAI Whisper 같은 오픈 음성 인식 모델로 변환되며, 이후 자동으로 삭제됩니다. 각 단계는 [사용 방법](/how-it-works) 페이지에 설명되어 있습니다.',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    '파일은 이용자의 기기에서 브라우저로 변환되므로 크기나 길이 제한을 두지 않습니다. 매우 크거나 긴 파일도 가능하지만 시간이 더 걸리고 충분한 여유 메모리가 필요하며, 기기가 느릴 수 있을 때는 페이지가 알려 줍니다.',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    '파일은 OpenAI Whisper 같은 오픈 음성 인식 모델로 변환되며 이후 자동으로 삭제됩니다.',
  'Your file never leaves your device.': '파일은 기기 밖으로 나가지 않습니다.',
  'Your file never leaves your device. [Privacy](/privacy)':
    '파일은 기기 밖으로 나가지 않습니다. [개인정보](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    '파일은 기기 밖으로 나가지 않습니다. 파일은 이 기기의 브라우저에서 변환되며 당사나 다른 누구에게도 업로드되지 않습니다. 변환 텍스트, 수정 내용, 파일은 이 브라우저의 저장소에만 보관되고 {idle} 동안 사용하지 않으면 자동으로 삭제되며, 변환 텍스트 메뉴에서 **내 데이터 지금 삭제**를 누르면 즉시 삭제됩니다. 계정은 없습니다. 떠나기 전에 필요한 것을 내보내세요.',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    '파일은 기기 밖으로 나가지 않습니다. 계정 없이 브라우저에서 바로 변환되며, 변환 텍스트는 이 브라우저에 남습니다.',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    '파일은 이 기기에 남습니다. 변환하는 동안 이 탭을 열어 두세요.',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    '파일과 변환 텍스트는 이번 세션 동안에만 보관되고 {idle} 동안 사용하지 않거나 ‘내 데이터 지금 삭제’를 누르면 자동으로 삭제됩니다. 계정도 추적도 없고 필수 세션 쿠키 하나만 사용합니다. 떠나기 전에 필요한 것을 내보내세요.',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    '파일과 변환 텍스트는 이번 세션 동안에만 보관되고 세션이 끝나거나 ‘내 데이터 지금 삭제’를 누르면 자동으로 삭제됩니다. 계정도 추적도 없고 필수 세션 쿠키 하나만 사용합니다. 떠나기 전에 필요한 것을 내보내세요.',
  'Your files are deleted automatically. [Privacy](/privacy)':
    '파일은 자동으로 삭제됩니다. [개인정보](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    '파일은 이용자의 브라우저에서 처리되며 기기에 남습니다. 웹사이트, 다운로드, 카운터는 암호화된 연결(HTTPS)을 사용합니다. 이 브라우저 프로필을 사용할 수 있는 사람은 삭제되기 전까지 여기에 저장된 변환 텍스트를 볼 수 있으므로, 공용 컴퓨터에서는 **내 데이터 지금 삭제**를 누르세요.',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    '파일은 서버에서 처리할 수 있도록 당사 서버에 업로드됩니다. 이 파일은 세션 동안에만 보관되며 세션이 끝나거나 {idle} 동안 사용하지 않으면 자동으로 삭제되고, 변환 텍스트 메뉴에서 **내 데이터 지금 삭제**를 누르면 즉시 삭제됩니다. 계정과 추적은 없고, 쿠키는 필수 세션 쿠키 하나뿐입니다(분석용 쿠키나 광고 쿠키는 없습니다).',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    '파일은 서버에서 처리할 수 있도록 당사 서버에 업로드됩니다. 이 파일은 세션 동안에만 보관되며 세션이 끝나면 자동으로 삭제되고, 변환 텍스트 메뉴에서 **내 데이터 지금 삭제**를 누르면 즉시 삭제됩니다. 계정과 추적은 없고, 쿠키는 필수 세션 쿠키 하나뿐입니다(분석용 쿠키나 광고 쿠키는 없습니다).',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    '파일은 이 기기 밖으로 나가지 않습니다. 변환 텍스트는 이 브라우저에만 보관되며 {idle} 동안 사용하지 않거나 ‘내 데이터 지금 삭제’를 누르면 자동으로 삭제됩니다. 떠나기 전에 필요한 것을 내보내세요.',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    '파일은 이 기기 밖으로 나가지 않습니다. 변환 텍스트는 이 브라우저에만 보관되며 세션이 끝나거나 ‘내 데이터 지금 삭제’를 누르면 자동으로 삭제됩니다. 떠나기 전에 필요한 것을 내보내세요.',
  'Your session ends in {mins} min. Export what you need.':
    '세션이 {mins}분 후에 끝납니다. 필요한 것을 내보내세요.',
  'Your session has ended': '세션이 끝났습니다',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    '세션이 끝나 데이터가 삭제되었습니다. 새 변환을 시작할 수 있습니다.',
  'Your transcript is ready below.': '변환 텍스트가 아래에 준비되었습니다.',
  'Your transcripts': '내 변환 텍스트',
  'Your transcripts and files were removed from the server.':
    '변환 텍스트와 파일이 서버에서 삭제되었습니다.',
  'Your transcripts and files were removed from this device.':
    '변환 텍스트와 파일이 이 기기에서 삭제되었습니다.',
  'title:/': '무료 동영상·오디오 텍스트 변환, 로그인 불필요',
  'description:/':
    '무료 동영상·음성 텍스트 변환. 로그인과 하루 제한 없이 50개 이상의 언어를 지원하며, 타임스탬프가 붙은 텍스트를 SRT, VTT, TXT, PDF로 내보내세요.',
  'title:/about': 'TranscribeVid 소개',
  'description:/about':
    'TranscribeVid를 만든 사람과 이유: 가입도 로그인도 필요 없고 화면이 깔끔한, 광고로 운영되는 무료 동영상·오디오 텍스트 변환 도구입니다.',
  'title:/contact': '문의',
  'description:/contact':
    'TranscribeVid에 연락하는 방법: 질문, 버그 신고, 기능 제안, 개인정보 관련 요청을 위한 이메일과 웹사이트 운영자 안내입니다.',
  'title:/faq': '자주 묻는 질문',
  'description:/faq':
    'TranscribeVid에 대한 자주 묻는 질문의 답변: 정확도, 언어, 지원 파일과 제한, 속도, 개인정보 보호, 편집 방법을 알려 드립니다.',
  'title:/guides': '가이드',
  'description:/guides':
    '변환 텍스트와 자막에 대한 실용 가이드: SRT와 VTT 선택, 동영상에 자막 추가, 정확한 변환 텍스트 만들기, 업로드 없는 비공개 텍스트 변환.',
  'title:/how-it-works': '사용 방법',
  'description:/how-it-works':
    'TranscribeVid가 동영상과 오디오를 세 단계로 정확하고 타임스탬프가 붙은 텍스트로 바꾸는 방법, 제공하는 결과, 최상의 결과를 위한 팁을 알려 드립니다.',
  'title:/privacy': '개인정보 처리방침',
  'description:/privacy':
    '파일을 변환할 때 TranscribeVid가 무엇을, 어디에서, 왜 처리하는지, 얼마나 보관하는지, 쿠키, 광고, 브라우저 저장소, 이용자의 권리를 설명합니다.',
  'title:/terms': '이용약관',
  'description:/terms':
    'TranscribeVid 이용 규칙: 무료 서비스, 이용자의 콘텐츠, 허용되는 사용, 파일 제한, 변환 텍스트 정확성에 대한 무보증, 책임을 안내합니다.',
  'title:/tools': '모든 무료 도구',
  'description:/tools':
    '모든 무료 동영상·오디오 텍스트 변환 도구를 한 목록에: 파일 형식별, 용도별, 자막 파일, 언어별. 로그인 불필요, 하루 제한 없음, 50개 이상의 언어.',
  'title:/video-to-text': '무료 동영상 텍스트 변환기, 로그인 불필요',
  'description:/video-to-text':
    '동영상을 텍스트로 무료 변환하세요. 50개 이상의 언어로 정확하고 타임스탬프가 붙은 변환 텍스트를 받아 보세요. 로그인 불필요, 하루 제한 없음. SRT, VTT, TXT, PDF 다운로드.',
  'label:/video-to-text': '동영상 텍스트 변환',
  'title:/audio-to-text': '음성 텍스트 변환: 무료, 무제한',
  'description:/audio-to-text':
    '팟캐스트, 인터뷰, 강의를 텍스트로 바꾸세요. 타임스탬프, 50개 이상의 언어, 로그인 불필요. TXT, SRT, VTT, PDF로 다운로드할 수 있는 무료 음성 텍스트 변환.',
  'label:/audio-to-text': '음성 텍스트 변환',
  'title:/mp4-to-text': 'MP4 텍스트 변환: MP4 동영상 무료 변환',
  'description:/mp4-to-text':
    'MP4 동영상을 타임스탬프와 함께 텍스트로 변환하세요. 무료, 로그인 불필요, 하루 제한 없음, 50개 이상의 언어. TXT, SRT, VTT, Markdown, JSON, PDF 다운로드.',
  'label:/mp4-to-text': 'MP4 텍스트 변환',
  'title:/mp3-to-text': 'MP3 텍스트 변환기: 무료 변환 텍스트',
  'description:/mp3-to-text':
    'MP3를 온라인에서 무료로 텍스트로 변환하세요. 로그인 불필요, 50개 이상의 언어, 모든 줄에 타임스탬프. 텍스트를 고친 뒤 TXT, SRT, VTT, PDF로 다운로드하세요.',
  'label:/mp3-to-text': 'MP3 텍스트 변환',
  'title:/srt-subtitle-generator': '무료 SRT 자막 만들기: 동영상으로',
  'description:/srt-subtitle-generator':
    '동영상이나 오디오로 SRT 자막 파일을 무료로 만드세요. 음성에 맞춘 타이밍, 50개 이상의 언어, 로그인 불필요. 줄을 고친 뒤 SRT 또는 VTT로 다운로드하세요.',
  'label:/srt-subtitle-generator': 'SRT 자막 만들기',
  'title:/voice-recording-to-text': '녹음 텍스트 변환: 무료 음성 변환기',
  'description:/voice-recording-to-text':
    '브라우저에서 목소리를 녹음하거나 음성 메모를 추가해 텍스트로 받으세요. 무료, 로그인 불필요, 50개 이상의 언어. TXT, PDF, SRT, Markdown 다운로드.',
  'label:/voice-recording-to-text': '녹음 텍스트 변환',
  'title:/wav-to-text': 'WAV 텍스트 변환: 무료 온라인 변환',
  'description:/wav-to-text':
    'WAV 파일을 무료로 텍스트로 변환하세요. 녹음기와 통화의 긴 녹음도 처리하며 50개 이상의 언어, 타임스탬프, 로그인 불필요. TXT, SRT, PDF 다운로드.',
  'label:/wav-to-text': 'WAV 텍스트 변환',
  'title:/m4a-to-text': 'M4A 텍스트 변환: 음성 메모 무료 변환',
  'description:/m4a-to-text':
    'M4A 음성 메모나 녹음을 무료로 텍스트로 바꾸세요. iPhone 음성 메모 지원, 로그인 불필요, 50개 이상의 언어, 타임스탬프. TXT, SRT, VTT, PDF 다운로드.',
  'label:/m4a-to-text': 'M4A 텍스트 변환',
  'title:/webm-to-text': 'WebM 텍스트 변환: 무료, 로그인 불필요',
  'description:/webm-to-text':
    'WebM 동영상이나 오디오 파일을 무료로 텍스트로 변환하세요. 화면 녹화와 브라우저 녹음에 사용할 수 있고 50개 이상의 언어, 타임스탬프. TXT, SRT, VTT, PDF.',
  'label:/webm-to-text': 'WebM 텍스트 변환',
  'title:/mov-to-text': 'MOV 텍스트 변환: iPhone 동영상 무료',
  'description:/mov-to-text':
    'iPhone이나 QuickTime으로 찍은 MOV 동영상을 무료로 텍스트로 변환하세요. 로그인 불필요, 50개 이상의 언어, 모든 줄에 타임스탬프. TXT, SRT, VTT, PDF 다운로드.',
  'label:/mov-to-text': 'MOV 텍스트 변환',
  'title:/whatsapp-voice-message-to-text': 'WhatsApp 음성 메시지 텍스트 변환, 무료',
  'description:/whatsapp-voice-message-to-text':
    'WhatsApp 음성 메시지를 무료로 텍스트로 바꾸세요. 음성 메시지를 파일로 저장해 끌어다 놓으면 힌디어를 포함한 50개 이상의 언어로 읽을 수 있습니다. 로그인 불필요.',
  'label:/whatsapp-voice-message-to-text': 'WhatsApp 음성 메시지 텍스트 변환',
  'title:/meeting-recording-to-text': 'Zoom·Teams·Meet 회의 녹음 텍스트 변환',
  'description:/meeting-recording-to-text':
    'Zoom, Teams, Google Meet 회의 녹음을 검색할 수 있고 타임스탬프가 붙은 변환 텍스트로 무료로 바꾸세요. 로그인 불필요, 50개 이상의 언어. TXT, SRT, VTT, PDF.',
  'label:/meeting-recording-to-text': '회의 녹음 텍스트 변환',
  'title:/lecture-to-text': '강의 텍스트 변환: 무료 강의 변환기',
  'description:/lecture-to-text':
    '녹음한 강의를 검색하고 공부할 수 있는 텍스트 노트로 바꾸세요. 무료, 로그인 불필요, 50개 이상의 언어, 타임스탬프. TXT, Markdown, SRT, PDF 다운로드.',
  'label:/lecture-to-text': '강의 텍스트 변환',
  'title:/podcast-transcript-generator': '무료 팟캐스트 변환 텍스트 만들기',
  'description:/podcast-transcript-generator':
    'MP3나 WAV로 팟캐스트 변환 텍스트를 무료로 만드세요. 타임스탬프, 50개 이상의 언어, 로그인 불필요. 고친 뒤 TXT, Markdown, SRT, VTT, PDF로 다운로드.',
  'label:/podcast-transcript-generator': '팟캐스트 변환 텍스트 만들기',
  'title:/interview-transcription': '인터뷰 텍스트 변환: 비공개로 무료',
  'description:/interview-transcription':
    '계정 없이 인터뷰를 무료로 텍스트로 변환하세요. 50개 이상의 언어와 타임스탬프를 지원하며 연구, 취재, 채용에 알맞습니다. TXT 또는 PDF로 다운로드.',
  'label:/interview-transcription': '인터뷰 텍스트 변환',
  'title:/vtt-subtitle-generator': '무료 VTT(WebVTT) 자막 만들기',
  'description:/vtt-subtitle-generator':
    '동영상이나 오디오로 WebVTT(.vtt) 자막 파일을 무료로 만드세요. 음성에 맞춘 타이밍, 50개 이상의 언어, 로그인 불필요. 줄을 고친 뒤 VTT로 다운로드하세요.',
  'label:/vtt-subtitle-generator': 'VTT 자막 만들기',
  'title:/youtube-subtitle-generator': 'YouTube 자막 만들기: 무료 SRT 파일',
  'description:/youtube-subtitle-generator':
    '내 YouTube 동영상용 SRT 자막 파일을 로그인 없이 무료로 만드세요. 음성에 맞춘 타이밍, 50개 이상의 언어. YouTube 스튜디오에서 업로드하면 됩니다.',
  'label:/youtube-subtitle-generator': 'YouTube 자막 만들기',
  'title:/translate-audio-to-english': '음성을 영어 텍스트로 번역, 무료',
  'description:/translate-audio-to-english':
    '다른 언어의 음성을 영어 텍스트로 무료 번역하세요. 동영상이나 오디오 파일을 추가하면 타임스탬프가 붙은 영어 텍스트나 자막을 받습니다. SRT, VTT, TXT.',
  'label:/translate-audio-to-english': '음성을 영어로 번역',
  'title:/guides/srt-vs-vtt': 'SRT와 VTT 차이: 어떤 자막 형식을 쓸까',
  'description:/guides/srt-vs-vtt':
    'SRT와 VTT 중 무엇을 쓸까요? 두 자막 형식이 무엇인지, 어떻게 다른지, 각각 어디에서 쓰이는지, 동영상에서 파일을 무료로 만드는 방법을 설명합니다.',
  'label:/guides/srt-vs-vtt': 'SRT와 VTT의 차이',
  'title:/guides/how-to-add-subtitles-to-a-video': '동영상에 자막을 무료로 추가하는 방법',
  'description:/guides/how-to-add-subtitles-to-a-video':
    '자막은 네 단계로 만들 수 있습니다. 동영상을 변환하고 텍스트를 고친 다음 SRT 또는 VTT로 내보내 YouTube, VLC, 편집기, 웹 플레이어에 추가하세요.',
  'label:/guides/how-to-add-subtitles-to-a-video': '동영상에 자막을 추가하는 방법',
  'title:/guides/transcribe-video-without-uploading': '동영상을 업로드하지 않고 텍스트로 변환',
  'description:/guides/transcribe-video-without-uploading':
    '브라우저 안에서 변환하는 방식, 기기에 남는 것, 한 번 다운로드되는 것, 브라우저 네트워크 패널에서 직접 확인하는 방법을 설명합니다.',
  'label:/guides/transcribe-video-without-uploading': '동영상을 업로드하지 않고 변환하기',
  'title:/guides/accurate-transcripts': '더 정확한 변환 텍스트를 얻는 방법',
  'description:/guides/accurate-transcripts':
    '음성 텍스트 변환 정확도를 높이는 실용적인 방법: 깨끗한 오디오, 알맞은 언어와 모델, 어휘 힌트, 결과를 확인하고 고치는 방법을 알려 드립니다.',
  'label:/guides/accurate-transcripts': '더 정확한 변환 텍스트를 얻는 방법',
  'title:/guides/what-is-whisper': 'Whisper란? 음성 텍스트 변환 쉽게 이해하기',
  'description:/guides/what-is-whisper':
    'OpenAI Whisper가 무엇인지, 무엇으로 학습했는지, 얼마나 정확하고 어떤 점에 약한지, TranscribeVid에서 브라우저 안에서 어떻게 실행되는지 설명합니다.',
  'label:/guides/what-is-whisper': 'Whisper란?',
  'This page was translated with AI. [Found a mistake? Tell us.](/contact)':
    '이 페이지는 AI로 번역되었습니다. [오류를 발견하셨나요? 알려 주세요.](/contact)',
  'A finished transcript: a media player next to the text in short lines, each with a timestamp.':
    '완료된 변환 텍스트: 미디어 플레이어 옆에 짧은 줄로 나뉜 텍스트가 있고, 각 줄에 타임스탬프가 붙어 있습니다.',
  'A finished transcript. Every line has a timestamp, and Export saves it as SRT, VTT, TXT, PDF and more.':
    '완료된 변환 텍스트. 모든 줄에 타임스탬프가 있고, 내보내기로 SRT, VTT, TXT, PDF 등으로 저장할 수 있습니다.',
  '**Visit statistics.** Cloudflare Web Analytics counts visits to our pages: which page was opened, which site you came from, your country, your browser and device type, and how fast the page loaded. Cloudflare says it sets no cookies, keeps no identifier on your device and does not use the data to follow you from one website to another.':
    '**방문 통계.** Cloudflare Web Analytics는 당사 페이지의 방문 수를 집계합니다. 어떤 페이지가 열렸는지, 어느 사이트에서 왔는지, 이용자의 국가, 브라우저와 기기 종류, 페이지가 얼마나 빨리 로드되었는지가 대상입니다. Cloudflare는 쿠키를 설정하지 않고, 이용자의 기기에 식별자를 남기지 않으며, 데이터를 이용해 다른 웹사이트까지 이용자를 추적하지 않는다고 밝히고 있습니다.',
};

export default dict;
