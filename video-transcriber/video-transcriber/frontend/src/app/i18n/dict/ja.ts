/** Japanese dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
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
  '.': '。',
  '"{name}" is {size}; the limit is {limit}.': '「{name}」は{size}です。上限は{limit}です。',
  '"{name}" is empty.': '「{name}」は空です。',
  '"{name}" is ready. Press Transcribe to start.':
    '「{name}」の準備ができました。「文字起こしを開始」を押して始めてください。',
  '“{title}” was deleted.': '「{title}」を削除しました。',
  '(optional)': '（任意）',
  '{base} Word timing: {timing}.': '{base} 単語ごとのタイミング：{timing}。',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand}（{domain}）は、**{name}**（{address}）が運営しています（以下「当社」といいます）。お客様のデータをどのように、なぜ処理するかは、当社が決定し、ここで説明します。',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand}（{domain}）は、**{name}**（{address}）が運営しています。詳しくは[このサイトについて](/about)のページをご覧ください。',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand}は一般のお客様向けのサービスであり、13歳未満（該当する場合はEUでは16歳未満）のお子様を対象としていません。',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand}は、{city}を拠点とする**{name}**（{role}）が作り、運営しています。誰もが最高の文字起こし体験を得られるように作りました。最初のクリックからスムーズで、アカウントの作成は不要、じゃまにならないすっきりした画面です。',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand}は一般のお客様向けで、13歳未満のお子様を対象としていません。',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages). No ad is shown while a file is being transcribed or beside your transcript, and never on the privacy, terms or logs pages.':
    '{brand}は、Google AdSenseで配信される広告によって無料で提供されています。広告は、情報ページ（ホーム、使い方、よくある質問、各ツールのページ）にのみ表示されます。ファイルの文字起こし中や、文字起こし結果のそばには広告を表示せず、プライバシー、利用規約、ログのページにも表示しません。',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    '{brand}は無料でご利用いただけます。ファイルがどう扱われるかは、[プライバシーポリシー](/privacy)で説明しています。',
  '{brand} is funded by ads shown on its information pages (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand}は、情報ページに表示される広告（Google AdSense）で運営されています。文字起こしはお使いの端末で行われるため、ファイルごとのサーバー費用がかからず、それがサービスを無料かつ無制限に保っています。広告が何を利用し、設定をどう選べるかは、[プライバシーポリシー](/privacy)で説明しています。',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand}は、動画や音声ファイルの話し声を、3つの簡単なステップでタイムスタンプ付きのテキストにします。',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand}は、動画、音声ファイル、ボイスレコーディングの話し声を、正確でタイムスタンプ付きのテキストにします。無料で、文字起こしできるファイル数に上限はなく、アカウントも不要です。上でファイルを選び、「文字起こしを開始」を押して、結果をお読みください。',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand}は、動画や音声ファイルをブラウザー上でテキストにします。認識はお使いの端末で行われ、ファイルが当社にアップロードされることはありません。無料で、アカウントも不要です。情報ページに表示される広告（Google AdSense。[プライバシーポリシー](/privacy)をご覧ください）で運営されています。当社は、機能をいつでも変更、制限、または終了することがあります。',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand}は、動画や音声を、正確でタイムスタンプ付きのテキストに無料で変換します。登録もログインも透かしもありません。ページを開き、ファイルを選んで、文字起こしをお読みください。',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages, and are served by Google, which uses cookies.':
    '{brand}は、動画や音声をブラウザー上でテキストにします。このページでは、それがお客様のデータにとって何を意味するのかを、わかりやすい言葉で説明します。要点は次のとおりです。ファイルがお使いの端末から出ることはありません。文字起こしはこのブラウザー内にのみ保存され、アカウントはなく、当サイト自身はCookieを設定しません。広告は情報ページにのみ表示され、Cookieを使用するGoogleによって配信されます。',
  '{done} of {total}': '{done} / {total}',
  '{duration} (estimate)': '{duration}（目安）',
  '{gb} GB of memory recommended': 'メモリ {gb} GB を推奨',
  '{h} h': '{h}時間',
  '{h} h {m} min': '{h}時間{m}分',
  '{label} — {note}': '{label} — {note}',
  '{label} — {note} ({download})': '{label} — {note}（{download}）',
  '{label} — {reason}': '{label} — {reason}',
  '{label} (first use downloads {size} MB)': '{label}（初回は{size} MBをダウンロード）',
  "{label}, as reported by visitors' browsers": '{label}（訪問者のブラウザーから報告された数）',
  '{label}: common questions': '{label}：よくある質問',
  '{label}. {title}.': '{label}。{title}。',
  '{label}. Look for it in your downloads.': '{label}。ダウンロードフォルダーをご確認ください。',
  '{language} → English': '{language} → 英語',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} {total}件のうち{done}件はすでにキューに入っています。残りの{left}件はリストに残っています。「文字起こしを開始」を押して再試行してください。',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} {total}件のうち{done}件はすでにキューに入っています。残りの{left}件はリストに残っています。「文字起こしを開始」を押して再試行してください。',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '{model}はこの端末では実時間より遅くなります。{audio}の音声に{wait}かかります（目安）。Tiny または Base の方が早く終わります。',
  '{n} files were skipped: not video or audio.':
    '{n}個のファイルをスキップしました。動画でも音声でもありません。',
  '{n} h ago': '{n}時間前',
  '{n} min': '{n}分',
  '{n} min ago': '{n}分前',
  '{n} min left': '残り{n}分',
  '{n} min read': '読了目安{n}分',
  '{n} minute': '{n}分',
  '{n} minutes': '{n}分',
  '{n} of {total}': '{n} / {total}',
  '{n} of those files are already in the list.':
    'そのうち{n}個のファイルはすでにリストにあります。',
  '{n} video transcribed': '{n}本の動画を文字起こし',
  '{n} videos transcribed': '{n}本の動画を文字起こし',
  '{n} words': '{n}語',
  '{n}% done': '{n}%完了',
  '{n}% model confidence': 'モデルの確信度{n}%',
  '{n}s left': '残り{n}秒',
  '{name} home': '{name}のホーム',
  '{size} download': '{size}のダウンロード',
  '{title}: {blurb}': '{title}：{blurb}',
  '{title}: {blurb} {note}.': '{title}：{blurb} {note}。',
  '{title}. {blurb}': '{title}。{blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}。{blurb} この端末では利用できません：{reason}。',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**このタブの技術ログ。** ログのページには、このタブ自身の技術ログが表示されます。ログはブラウザー内にとどまり、どこにも送信されません。',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**語彙のヒントを追加する**：音声に出てくる名前、ブランド名、専門用語を、書きたい表記で入れます。',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**語彙のヒントを追加する**：名前、ブランド名、専門用語を、書きたい表記で入れます。',
  '**Ads.** Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript.':
    '**広告。** 広告は情報ページにのみ表示され、Cookieを使用するGoogleによって配信されます。ファイルの文字起こし中や、文字起こし結果のそばには広告を表示しません。',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**マークの付いた行を確認し**、文字起こしエディターで直します。',
  '**Choose the spoken language** instead of auto-detect.':
    '自動検出ではなく、**話されている言語を選びます**。',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**ファイルを選びます。** 上に動画または音声ファイルをドロップするか、端末から選ぶか、マイクで声を録音します。MP4、MOV、MKV、WebM、AVI、MP3、WAV、M4A、FLAC、OGGなど、よく使われるほとんどの形式に対応しています。',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**音声を補正** — 低いこもり音とヒスノイズを除去し、小さな声の話者の音量をそろえます',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**ファイルの上限。** 当社では設けていません。ファイルはお使いの端末で処理されるため、非常に大きいファイルや長いファイルは時間がかかり、十分な空きメモリが必要です。端末の処理が遅い場合は、ページが警告します。',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**対応ファイル形式。** 動画：MP4、MKV、MOV、AVI、WEBM、WMV、FLV、M4V、3GP、TS、MTS。音声：MP3、WAV、M4A、AAC、FLAC、OGG、OPUS。マイクから直接録音することもできます。',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**GoogleのCookie。** 広告が読み込まれるときに、Google自身のCookieが設定されます。広告を表示するページに限られます（第6節を参照）。',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**講義やポッドキャスト**を、勉強用やショーノート用の読みやすいテキストにします。',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**上限。** 現在、サーバーからはサイズや長さの上限は通知されていません。非常に大きなファイルは、単に時間がかかります。',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**上限。** 当社ではサイズや長さの上限を設けていません。ファイルはお使いの端末で処理されるため、非常に大きいファイルや長いファイルは単に時間がかかり、十分な空きメモリが必要です。端末の処理が遅い場合は、開始前にページが知らせ、所要時間を見積もります。',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**追加するメディア。** 選択または録音した動画・音声ファイルです。これらはお使いの端末のブラウザー内で（WebGPUまたはWebAssemblyを使って）処理されます。ファイルが当社のサーバーにアップロードされることはなく、Googleやその他の第三者に送信されることもありません。',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**会議やインタビューの記録**を、検索、引用、共有できるテキストにします。',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**間違いは起こります。** 完璧な音声認識はありません。重要な用途に使う前には、必ず文字起こしを確認してください。',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**独自のCookieはありません。** サイト自体はCookieを設定しません。',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**後のために保存されるものはありません。** ファイルと文字起こしは、そのセッションの間だけ存在します。ページを離れる前に、必要なものを書き出してください。詳しくは[プライバシーポリシー](/privacy)をご覧ください。',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**後のために保存されるものはありません。** 文字起こしとファイルはこのブラウザー内にのみ残り、{idle}操作がない場合、または**今すぐデータを削除**を押すと、自動的に削除されます。ページを離れる前に、必要なものを書き出してください。詳しくは[プライバシーポリシー](/privacy)をご覧ください。',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**後のために保存されるものはありません。** 文字起こしはこのセッションの間だけ存在するので、必要なものを書き出してください。[プライバシーポリシー](/privacy)は、ホスト版のウェブサイトについて説明しています。',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**累計の集計。** 文字起こしが完了すると、お使いのブラウザーが当社のカウンター（Cloudflare Worker）に匿名の「+1」を1つ送信します。ファイル、文字起こし、識別子は含まれません。Cloudflareは通信中にお客様のIPアドレスを確認し、不正利用を制限するために（レート制限として）一時的に使用します。当社が保存するのは合計だけです。ページ上部に表示される数字は訪問者のブラウザーから報告されたもので、検証されていません。',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    '聞き取りにくい音声には、**「高精度」または「最高精度」を選びます**。',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**品質と言語を選びます。** 速いモデルは素早く下書きを作り、精度の高いモデルはインタビュー、講義、字幕に向いています。話されている言語は自動で検出でき、50を超える言語に対応しています。',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    '完成した文字起こしを、別の品質や言語で**再度文字起こし**できます。現在の文字起こしは残ります。',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    '別の品質や言語で**再度文字起こし**できます。現在の文字起こしは残ります。',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**読む、直す、ダウンロードする。** 文字起こしはタイムスタンプ付きで表示され、モデルが自信を持てなかった単語にはマークが付くので、確認できます。プレーンテキスト、SRTまたはVTT字幕、Markdown、JSONでダウンロードできます。',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**ウェブサイトを配信するためのリクエスト。** このウェブサイトは、Cloudflare（Cloudflare Pages）によって配信されています。ホスティングおよびネットワークのプロバイダーとして、Cloudflareは、サイトを配信し保護するために、お客様のIPアドレスと通常のリクエスト情報（時刻、リクエストされたページ、ブラウザーなど）を処理します。',
  '**Skip silence & music** — prevents made-up text':
    '**無音と音楽をスキップ** — 存在しないテキストが作られるのを防ぎます',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**音声モデルはブラウザーのキャッシュに残ります**（Cache Storage）。そのため次回の文字起こしは速く始まり、削除するまで（**今すぐデータを削除**でも削除できます）、またはブラウザーがストレージを消去するまで残ります。これらはプログラムファイルであり、お客様のデータではありません。',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**速度。** 選んだ品質、ファイルの長さ、サービスの混み具合によって変わります。',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**速度。** お使いの端末、選んだ品質、ファイルの長さによって変わります。ある品質を初めて使うときは、そのモデルを1回ダウンロードします。ブラウザーがモデルファイルをHugging Faceから、エンジンのプログラムファイルをjsDelivrから取得し、キャッシュに保存します。処理中はタブを開いたままにしてください。',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**良い音声から始めます**：背景ノイズを減らし、マイクを近づけ、一度に話す人を1人にします。「音声を補正」はオンのままにしてください。',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**良い音声から始めます**：背景ノイズを少なく、マイクを近くに、一度に1人ずつ話します。「音声を補正」はオンのままにしてください。',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**ブラウザー内のストレージ。** ブラウザーは、前述のとおり、文字起こしとファイル（IndexedDB）および音声モデル（Cache Storage）を保存し、ライトまたはダーク表示の選択を記憶し、そのセッションストレージが、現在のタブの便利な設定（最後に選んだ品質など）をいくつか保持します。これらは当社には送信されません。',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    'ご自身の動画、リール、オンライン講座の**字幕とキャプション**を、SRTまたはVTTファイルで作ります。',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**お使いの端末で作られるテキスト。** 文字起こし、そのタイムスタンプと編集内容、お選びになったタイトル、選択した設定（品質、言語、語彙のヒント）です。これらはこのブラウザー内で作られ保存され、当社が受け取ることはありません。',
  '**Use previous text as context** — can repeat on long files':
    '**直前のテキストを文脈として使う** — 長いファイルでは繰り返しが起こることがあります',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**ボイスメモ**を文字に起こして、もう一度聞き直さずに済むようにします。',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**実行ごと、品質設定ごと、あるいは他のツールとで、結果が異なることがあるのはなぜですか？** 音声認識は確率的です。最も可能性の高い言葉を選びますが、騒がしい箇所やあいまいな箇所では、複数の答えが僅差になります。品質設定、言語設定、語彙のヒント、音声のクリーンアップが違うと、テキストが変わることがあり、異なるシステムを使う他のツールでも同様です。話者の名前やラベルは追加されません。',
  '**Word-level timing** — better subtitles and confidence marks':
    '**単語ごとのタイミング** — 字幕がより正確になり、確信度のマークも付きます',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**ファイルと文字起こしは、このブラウザー内にとどまります。** 文字起こし、編集内容、元のファイルは、このブラウザーのストレージ（IndexedDB）にのみ保存されます。セッションが終了すると（{idle}操作がない場合に終了します）自動的に削除されます。「文字起こし」メニューの**今すぐデータを削除**を押すと、すぐに削除されます。',
  '1 file was skipped: not video or audio.':
    '1個のファイルをスキップしました。動画でも音声でもありません。',
  '1 minute': '1分',
  '1 word': '1語',
  '1. Agreement': '1. 同意',
  '1. Who runs this website': '1. このウェブサイトの運営者',
  '10. Children': '10. お子様',
  '10. Termination': '10. 終了',
  '11. Children': '11. お子様',
  '11. Your rights and choices': '11. お客様の権利と選択',
  '12. Changes': '12. 変更',
  '12. Open-source components': '12. オープンソースのコンポーネント',
  '13. Changes to this policy': '13. 本ポリシーの変更',
  '13. Governing law': '13. 準拠法',
  '14. Contact': '14. お問い合わせ',
  '2. The service': '2. サービス',
  '2. What is processed, and where': '2. 何が、どこで処理されるか',
  '3 simple steps': '3つの簡単なステップ',
  '3. Why it is processed': '3. 処理の理由',
  '3. Your content': '3. お客様のコンテンツ',
  '4. Acceptable use': '4. 許容される利用',
  '4. How long it is kept': '4. 保存期間',
  '5. Downloads your browser makes': '5. ブラウザーが行うダウンロード',
  '5. Limits: your device does the work': '5. 上限：処理はお使いの端末が行います',
  '6. Accuracy: no warranty': '6. 精度：保証なし',
  '6. Advertising': '6. 広告',
  '7. Availability': '7. 提供状況',
  '7. Cookies and browser storage': '7. Cookieとブラウザーのストレージ',
  '8. Sharing': '8. 共有',
  '8. Third-party downloads and ads': '8. 第三者によるダウンロードと広告',
  '9. Liability': '9. 責任',
  '9. Security': '9. セキュリティ',
  'A name cannot be empty, so the old name was kept.':
    '名前は空にできないため、元の名前を残しました。',
  'A new transcript has started. The old one is kept in your list.':
    '新しい文字起こしを開始しました。元のものは一覧に残っています。',
  'a period': '一定期間',
  About: 'このサイトについて',
  'About {brand}': '{brand}について',
  'about {h} h': '約{h}時間',
  'about {h} h {m} min': '約{h}時間{m}分',
  'about {n} min': '約{n}分',
  'Accurate text': '正確なテキスト',
  'Add another file': 'ファイルを追加',
  'Add your file': 'ファイルを追加する',
  'Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    '広告は、情報ページにのみ表示され、Cookieを使用するGoogleによって配信されます。ファイルの文字起こし中や、文字起こし結果のそばには広告を表示せず、このウェブサイト自身はCookieを設定しません。詳しくは[プライバシーポリシー](/privacy)をご覧ください。',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'どの機能にも広告は必要ありません。広告をブロックまたは拒否しても、すべて同じように動作します。',
  'Ads keep TranscribeVid free. Everything works without them.':
    '広告のおかげでTranscribeVidは無料です。広告がなくても、すべて問題なく使えます。',
  Advertisement: '広告',
  'All free tools': 'すべての無料ツール',
  'All free video and audio to text tools': '動画・音声をテキストにする無料ツールすべて',
  'All tools': 'すべてのツール',
  'All your data was deleted': 'すべてのデータを削除しました',
  'Allow the microphone in your browser, or choose a file instead.':
    'ブラウザーでマイクの使用を許可するか、代わりにファイルを選んでください。',
  'Already added': '追加済みです',
  'Already finished': 'すでに完了しています',
  'Also delete the downloaded speech models?': 'ダウンロード済みの音声モデルも削除しますか？',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'アップロードが進行中です。ファイルを追加する前に、完了するまでお待ちください。',
  'Apply style only': 'スタイルだけを適用',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    'スタイルの適用は、保存済みの認識結果を使い、音声をもう一度処理することはありません。編集した行は残ります。',
  'Audio works too.': '音声ファイルも使えます。',
  'Automatic (IndicXlit when installed)': '自動（インストール済みの場合はIndicXlit）',
  Back: '戻る',
  'Basic phonetic spelling': '基本的な発音表記',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    '当社はアカウントも、お客様を特定する情報も保有していないため、通常、データを特定の個人に結び付けることはできません。法律により、アクセス、訂正、削除、制限、異議、データポータビリティなど、個人データに関する権利や、データ保護当局に苦情を申し立てる権利が認められている場合、次の連絡先にご連絡いただければ、それらを行使できます：',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    '文字起こしはこのブラウザー内にのみ存在するため、ページを離れる前に必要なものを書き出してください。削除したデータは復元できません。',
  'Best accuracy': '最高精度',
  'Best accuracy, slowest': '最高精度、最も遅い',
  Breadcrumb: 'パンくずリスト',
  'By file type': 'ファイル形式から探す',
  'By language': '言語から探す',
  'By use': '用途から探す',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    '{brand}（{domain}）をご利用になることで、これらの規約に同意したものとみなされます。同意されない場合は、サービスをご利用にならないでください。本サービスは、**{name}**（{address}）が運営しています。',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'ウェブサイトまたはそのカウンターのレート制限やセキュリティを回避したり、回避しようとしたり、その運営や他の訪問者の利用を妨害したりすること。',
  'Can I edit the transcript?': '文字起こしは編集できますか？',
  "Can't reach the server.": 'サーバーに接続できません。',
  Cancel: 'キャンセル',
  'Cancel "{title}"?': '「{title}」をキャンセルしますか？',
  'Cancel {title}': '{title}をキャンセル',
  'Cancellation requested': 'キャンセルを要求しました',
  Cancelled: 'キャンセルしました',
  'Cancelling…': 'キャンセルしています…',
  'Cannot reach the server': 'サーバーに接続できません',
  'Cannot reach the server.': 'サーバーに接続できません。',
  'Cannot reach the server. Check your connection and try again.':
    'サーバーに接続できません。接続を確認して、もう一度お試しください。',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'サーバーに接続できません。サーバーが動作していること（npm run dev）を確認して、もう一度お試しください。',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    '行を変更または削除したり、検索して置換したりできます。編集内容は、すべてのダウンロードに反映されます。',
  'Changed in {n} lines.': '{n}行を変更しました。',
  'Check Hinglish spelling': 'ヒングリッシュの表記を確認',
  'Choose "Save as PDF" in the print dialog.':
    '印刷ダイアログで「PDFとして保存」を選んでください。',
  'Choose a file': 'ファイルを選択',
  'Choose a file first': '先にファイルを選んでください',
  'Choose a format': '形式を選択',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'お使いの端末と、かけられる時間に応じて、速いモデルと精度の高いモデルを選べます。',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    '「最速」「標準」「高精度」「最高精度」から選びます。最速は最も速く、最高精度は間違いが最も少なくなります。',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    '話されている言語を選ぶか、自動検出のままにします。話し声を英語に翻訳することもできます。',
  'Chosen files': '選択したファイル',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'マイクの近くで、はっきり話すと、最もよい結果になります。「その他のオプション」の**音声を補正**と**無音と音楽をスキップ**は初期設定でオンになっています。これらは低いこもり音とヒスノイズを除去し、音楽や長い間（ま）の間にモデルが存在しないテキストを作るのを防ぐので、騒がしい録音ではオンのままにしてください。字幕には**単語ごとのタイミング**もオンのままにすると、各行が言葉にぴったり合って始まり、終わります。',
  Close: '閉じる',
  'Close menu': 'メニューを閉じる',
  'Close: {title}': '閉じる：{title}',
  'Common questions': 'よくある質問',
  Contact: 'お問い合わせ',
  'Converting…': '変換しています…',
  Copied: 'コピーしました',
  'Copy text': 'テキストをコピー',
  'Copying…': 'コピーしています…',
  'Could not cancel the transcript.': '文字起こしをキャンセルできませんでした。',
  'Could not change transcript style.': '文字起こしのスタイルを変更できませんでした。',
  'Could not copy': 'コピーできませんでした',
  'Could not delete the transcript.': '文字起こしを削除できませんでした。',
  'Could not delete your data.': 'データを削除できませんでした。',
  'Could not load the text to copy.': 'コピーするテキストを読み込めませんでした。',
  'Could not prepare the file. Please try again.':
    'ファイルを準備できませんでした。もう一度お試しください。',
  'Could not rename the transcript.': '文字起こしの名前を変更できませんでした。',
  'Could not save the change.': '変更を保存できませんでした。',
  'Could not start': '開始できませんでした',
  'Could not start.': '開始できませんでした。',
  Dark: 'ダーク',
  Delete: '削除',
  'Delete "{title}" and its transcript?': '「{title}」とその文字起こしを削除しますか？',
  'Delete "{title}"? This cannot be undone.':
    '「{title}」を削除しますか？この操作は元に戻せません。',
  'Delete {title}': '{title}を削除',
  'Delete all your transcripts and the files kept in this browser now?':
    'このブラウザーに保存されているすべての文字起こしとファイルを、今すぐ削除しますか？',
  'Delete all your transcripts and uploaded files now?':
    'すべての文字起こしとアップロードしたファイルを、今すぐ削除しますか？',
  'Delete line': '行を削除',
  'Delete my data now': '今すぐデータを削除',
  'Delete this line from the transcript?': 'この行を文字起こしから削除しますか？',
  'Delete transcript': '文字起こしを削除',
  Deleted: '削除しました',
  'Detect automatically': '自動検出',
  'Dismiss message': 'メッセージを閉じる',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3は英語の音声にのみ対応しています。翻訳するには、別のモデルを選んでください。',
  Done: '完了',
  'Download failed': 'ダウンロードに失敗しました',
  'Download started': 'ダウンロードを開始しました',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '結果は、プレーンテキスト、SRTまたはVTT字幕、Markdown、JSONでダウンロードできます。',
  'Download the transcript as': '文字起こしを次の形式でダウンロード',
  'Downloading the speech model (first time only): {loaded} of {total}':
    '音声モデルをダウンロードしています（初回のみ）：{loaded} / {total}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    '[ホームページ](/)に動画または音声ファイルをドロップするか、マイクから録音してください。',
  'Drop to add your file': 'ドロップしてファイルを追加',
  'Drop your {noun} here, or choose a file':
    '{noun}をここにドロップするか、ファイルを選択してください',
  'Each line with its time, like [00:12]': '各行に時刻が付きます（例：[00:12]）',
  Edit: '編集',
  'Edit it right here': 'ここで直接編集',
  'Edit this line': 'この行を編集',
  'Edited by you': 'あなたが編集',
  'English only, very fast and accurate': '英語のみ。非常に高速で正確',
  'English translation is selected in More options.':
    '英語への翻訳が「その他のオプション」で選択されています。',
  'Enter saves · Esc cancels': 'Enterで保存 · Escでキャンセル',
  'Every line has a time. Play the media from any line to hear what was said.':
    'すべての行に時刻が付きます。任意の行からメディアを再生すると、話された内容を聞けます。',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'どのページも同じ働きをします。動画や音声ファイルの話し声を、各行にタイムスタンプを付けたテキストにします。50を超える言語に対応し、登録は不要です。お手持ちのファイルや作りたいものに合うページを選んでください。',
  'Experimental: compare on your audio; chunk timestamps':
    '実験的：お使いの音声で比較してください。チャンク単位のタイムスタンプ',
  'Experimental: larger model; chunk timestamps':
    '実験的：より大きなモデル。チャンク単位のタイムスタンプ',
  Export: '書き出し',
  Failed: '失敗しました',
  FAQ: 'よくある質問',
  Fast: '速い',
  'Fast, clean audio': '速い。クリアな音声向け',
  Fastest: '最速',
  'Fastest, rough drafts only': '最速、大まかな下書きのみ',
  'Fewer mistakes. Takes longer.': '間違いが少なくなります。時間がかかります。',
  'Fewest mistakes. Takes the longest.': '間違いが最も少なくなります。最も時間がかかります。',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    'ファイル「{name}」は{size}です。上限は{limit}です。引き上げるには VT_MAX_UPLOAD_MB を設定してください',
  'File "{name}" is {size}; the limit is {limit}.':
    'ファイル「{name}」は{size}です。上限は{limit}です。',
  'file {n} of {total}': '{total}件中{n}件目のファイル',
  'File added': 'ファイルを追加しました',
  'File limits.': 'ファイルの上限。',
  'File not added': 'ファイルを追加できませんでした',
  'File skipped': 'ファイルをスキップしました',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'ファイルと文字起こしは、そのセッションの間だけ存在します。ページを離れる前に、必要なものを書き出してください。当社が保持するのは、サイトで文字起こしされたファイルの数の匿名の累計1つだけです（ページ上部に表示される単一の数字）。これはお客様、お客様のファイル、セッションのいずれにも結び付けられていません。詳しくは[プライバシーポリシー](/privacy)をご覧ください。',
  'Find it automatically': '自動で見つける',
  'first time only, also downloads the {size} MB word-timing model':
    '初回のみ。単語ごとのタイミング用モデル（{size} MB）もダウンロードします',
  'First time only: downloads {size} (needs internet)':
    '初回のみ：{size}をダウンロードします（インターネット接続が必要）',
  'Follow playback': '再生に追従',
  'Following playback': '再生に追従中',
  Footer: 'フッター',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'なまりのある話し方や複数言語が混ざった話し方には、より高い品質設定をお試しください。確信度は、精度の割合ではありません。',
  'For developers: words, times, confidence': '開発者向け：単語、時刻、確信度',
  'For notes apps': 'メモアプリ向け',
  'For video players and editors': '動画プレーヤーと編集ソフト向け',
  'For YouTube and web video': 'YouTubeとWeb動画向け',
  Free: '無料',
  'Free tools': '無料ツール',
  'Free tools:': '無料ツール：',
  'Free video and audio to text': '動画・音声を無料でテキストに',
  'Free video and audio to text, right in your browser':
    '動画・音声を、ブラウザー上で無料でテキストに',
  'Free, unlimited, and no login needed': '無料、無制限、ログイン不要',
  'Free, unlimited, no login': '無料、無制限、ログイン不要',
  'Frequently asked questions': 'よくある質問',
  'Get in touch': 'お問い合わせ',
  'Getting the speech engine ready…': '音声エンジンを準備しています…',
  'Give it a new name': '新しい名前を付けます',
  'Go to the home page': 'ホームページへ',
  'Go to Video to text': '「動画の文字起こし」へ',
  'Good balance (default)': 'バランス良好（初期設定）',
  'Good to know': '知っておくと便利なこと',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'Googleの同意ツールを読み込めませんでした。広告ブロッカーまたはネットワークに止められた可能性があります。同意ツールがない場合、広告も広告用Cookieも読み込まれません。',
  Guides: 'ガイド',
  'Guides: transcripts and subtitles': 'ガイド：文字起こしと字幕',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'ご質問、不具合の発見、機能のご提案はありませんか？{email}までご連絡ください。すべてのメッセージは{brand}を作っている本人が読み、通常は数営業日以内に返信します。',
  'Helps spell uncommon words correctly.': 'めずらしい言葉を正しく表記するのに役立ちます。',
  'High accuracy': '高精度',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    '「高精度」（Large v3 Turbo）は翻訳向けに訓練されておらず、元の言語のまま出力されることがあります。翻訳には「標準」または「最高精度」を選んでください。',
  'High accuracy, slower': '高精度、やや遅い',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    '大きいほど、わずかに精度が上がり、処理は遅くなります。5が標準的な設定です。',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'ヒンディー語をローマ字で表記し、英語の単語はそのまま残します。他の言語は元の文字のままです。なじみのない単語や名前は確認してください。',
  'Hinglish (Roman Hindi)': 'ヒングリッシュ（ローマ字表記のヒンディー語）',
  'Hinglish conversion': 'ヒングリッシュへの変換',
  History: '履歴',
  Home: 'ホーム',
  'How {brand} works': '{brand}の仕組み',
  'How accurate is it?': '精度はどのくらいですか？',
  'How do I get better accuracy?': '精度を上げるにはどうすればよいですか？',
  'How it stays free': '無料である理由',
  'How it works': '使い方',
  'How long does it take?': 'どのくらい時間がかかりますか？',
  'How to transcribe a video to text': '動画を文字起こしする方法',
  'How to turn a video or audio file into text with {brand}':
    '{brand}で動画・音声ファイルをテキストにする方法',
  'If it does have speech, try More › Re-transcribe with the right language.':
    '音声が含まれているなら、「その他」›「再度文字起こし」で、正しい言語を指定して試してください。',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'サービスが混み合っている場合や、すでに多くの文字起こしが実行中の場合は、お待ちいただくようお願いし、その理由をお伝えします。',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'このポリシーを変更した場合は、新しい版が、新しい「最終更新日」とともにこのページに掲載されます。',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'EEA、英国、スイス、および米国の一部の州では、広告が読み込まれる際に、Googleの認定済み同意メッセージでお客様の選択をお尋ねします。',
  'IndicXlit (trained model)': 'IndicXlit（学習済みモデル）',
  'Is it really free and unlimited? Do I need to log in?':
    '本当に無料で無制限ですか？ログインは必要ですか？',
  'Is my data private?': 'データのプライバシーは守られますか？',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    '選んだ品質、ファイルの長さ、サービスの混み具合によって変わります。「最速」は速く、「最高精度」は最も時間がかかりますが、間違いが最も少なくなります。進行状況と残り時間はリアルタイムで表示され、順番を待っているファイルには「待機中」と表示されます。',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'お使いの端末、選んだ品質、ファイルの長さによって変わります。高性能なグラフィックスチップ（WebGPU）があれば最も速く、なければプロセッサー（WebAssembly）で動作するため遅くなります。「最速」は速く、「最高精度」は最も時間がかかりますが、間違いが最も少なくなります。進行状況と残り時間はリアルタイムで表示されます。',
  'It is now called “{title}”.': '名前を「{title}」に変更しました。',
  'It may have been deleted.': '削除された可能性があります。',
  'It was stopped before any text was found.': 'テキストが見つかる前に停止されました。',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'この文字起こしを含め、データは削除されました。文字起こしは、作成したセッションの間だけ保存されます。',
  'Job not found': 'ジョブが見つかりません',
  'JSON (.json)': 'JSON（.json）',
  'just now': 'たった今',
  'Just the words, in paragraphs': '言葉だけを、段落にまとめて',
  'Keep reading': 'あわせて読む',
  'Keep this page open until the upload is done.':
    'アップロードが終わるまで、このページを開いたままにしてください。',
  'Kept only for this session, then deleted automatically.':
    'このセッションの間だけ保存され、その後自動的に削除されます。',
  Language: '言語',
  'Larger or longer files are refused before they are processed, so split them first.':
    'これより大きい、または長いファイルは、処理前に拒否されるため、先に分割してください。',
  'Last updated: {date}': '最終更新日：{date}',
  'Licence text': 'ライセンス文',
  Light: 'ライト',
  'Limits.': '上限。',
  'Line deleted': '行を削除しました',
  'Live: the text appears here as it is recognised':
    'ライブ：認識されたテキストがここに表示されます',
  'Loading model… (first use downloads it)': 'モデルを読み込み中…（初回はダウンロードします）',
  'Loading…': '読み込み中…',
  'Long (56 letters)': '長い（56文字）',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    '詳しい解説：形式、字幕、精度、プライバシー。',
  Main: 'メイン',
  'Make a new transcript of the same file. This one is kept.':
    '同じファイルから新しい文字起こしを作ります。今回のものは残ります。',
  'Make a subtitle file (SRT or VTT) from your video.':
    '動画から字幕ファイル（SRTまたはVTT）を作ります。',
  'Markdown (.md)': 'Markdown（.md）',
  Menu: 'メニュー',
  Model: 'モデル',
  More: 'その他',
  'More answers: [Frequently asked questions](/faq)': 'その他の回答：[よくある質問](/faq)',
  'More free tools': 'その他の無料ツール',
  'More options': 'その他のオプション',
  'More than 50 languages': '50を超える言語',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    '英語、スペイン語、フランス語、ドイツ語、ポルトガル語、イタリア語、オランダ語、ロシア語、アラビア語、ヒンディー語、中国語、日本語、韓国語を含む、50を超える言語に対応しています。言語は自動検出のままにすることも、ご自身で選ぶこともできます。話し声を英語に翻訳することもできます。',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    '多くの文字起こしサイトでは、1行のテキストも見られないうちに、アカウントの作成を求めたり、無料の分数を制限したり、透かしを入れたり、サブスクリプションを勧めたりします。{brand}はその逆です。提供するすべての機能が誰にでも使え、ページが求めるのはファイルだけです。',
  'Name not changed': '名前は変更されませんでした',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    '音声に出てくる名前、ブランド名、専門用語（例：Kubernetes、Dr. Okafor）',
  'Near-best accuracy, much faster than Large': '最高に近い精度で、Largeよりはるかに高速',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'グラフィックスドライバーが16ビットシェーダー（shader-f16）に対応している必要があります',
  'needs 4 GB': '4 GB必要',
  'needs 8 GB': '8 GB必要',
  'needs a graphics-capable browser (Chrome, Edge)':
    'グラフィックスに対応したブラウザー（Chrome、Edge）が必要です',
  'needs WebGPU': 'WebGPUが必要です',
  'Next match': '次の一致',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'アカウントも追跡もありません。ファイルはそのセッションの間だけ保存され、自動的に削除されます。',
  'no estimate for this model here': 'このモデルの目安はここでは出せません',
  'No login': 'ログイン不要',
  'No matches': '一致なし',
  'No microphone': 'マイクがありません',
  'No sign-up, no payment, no daily limit. Just add your file.':
    '登録も、支払いも、1日の上限もありません。ファイルを追加するだけです。',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    '現在、サーバーからはサイズや長さの上限は通知されていません。非常に大きなファイルは、単に時間がかかります。',
  'No speech was found in this file.': 'このファイルには話し声が見つかりませんでした。',
  'No speech was transcribed.': '文字起こしされた話し声はありませんでした。',
  'No speech was transcribed. Check the recording and the selected language.':
    '文字起こしされた話し声はありませんでした。録音と、選択した言語を確認してください。',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'ここではWebGPUを使えません。モデルはCPUの1スレッドで動作するため、大きなサイズは実時間より遅くなります。',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'あなたより先に待っている他の人のファイルはありません。複数のファイルを追加した場合は、タブ内で順番に文字起こしされるので、完了するまでタブを開いたままにしてください。',
  'None of those are video or audio files.': 'それらのファイルは、動画でも音声でもありません。',
  Normal: '通常',
  'not available for this size': 'このサイズでは利用できません',
  'not available in this browser': 'このブラウザーでは利用できません',
  'not available with Qwen (times are per chunk)':
    'Qwenでは利用できません（時刻はチャンク単位です）',
  'Not cancelled': 'キャンセルされませんでした',
  'Not deleted': '削除されませんでした',
  'Not renamed': '名前は変更されませんでした',
  'Not saved': '保存されませんでした',
  Note: '注記',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'まだ何もありません。作成した文字起こしは、このセッションの間ここに表示されます。',
  'Nothing is saved. Export what you need.': '何も保存されません。必要なものは書き出してください。',
  'Nothing is uploaded until you press Transcribe.':
    '「文字起こしを開始」を押すまで、何もアップロードされません。',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    '登録も支払いも必要ありません。ファイルを追加するだけです。',
  'Nothing was recorded.': '何も録音されませんでした。',
  Off: 'オフ',
  On: 'オン',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'はっきりした話し声で、対応言語であれば、通常は非常に高い精度ですが、完璧な音声認識はありません。精度は、音声の品質、なまり、背景ノイズ、複数の話者の重なり、音楽、めずらしい名前や専門用語によって変わります。すべての行に確信度があり、確信度の低い行にはマークが付くので、先に確認できます。重要な用途に使う前には、必ず文字起こしを確認してください。',
  'Open menu': 'メニューを開く',
  'Opening your transcript…': '文字起こしを開いています…',
  'or drop it anywhere on this page.': 'または、このページのどこにでもドロップしてください。',
  'Original script': '元の文字',
  Output: '出力',
  'Page {page} of {pages}': '{pages}ページ中{page}ページ目',
  'Page not found': 'ページが見つかりません',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'お手元のファイル向けのページ：WAV、M4A、WebM、MOV。',
  'PDF document (.pdf)': 'PDFドキュメント（.pdf）',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'PDFはお使いのブラウザーが作成します。印刷ダイアログで「PDFとして保存」を選んでください。',
  'Pick quality': '品質を選ぶ',
  'Plain text (.txt)': 'プレーンテキスト（.txt）',
  'Play from here': 'ここから再生',
  'Playback speed': '再生速度',
  'Please add one file at a time here. You can add more files on the next page.':
    'ここでは一度に1つのファイルを追加してください。次のページでさらに追加できます。',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'プライベートな録音は送らないでください。{brand}はお客様のファイルをお客様の端末で文字起こしし、当社がファイルを受け取ることはないため、サポートのためにファイルは必要ありません。',
  'Please note': 'ご注意',
  Preparing: '準備中',
  'Preparing audio…': '音声を準備しています…',
  'Preparing the audio…': '音声を準備しています…',
  'Preparing…': '準備しています…',
  'Press a question to read its answer.': '質問を押すと、回答が表示されます。',
  'Previous match': '前の一致',
  'Print to PDF': 'PDFに印刷',
  Privacy: 'プライバシー',
  'Privacy and cookie settings': 'プライバシーとCookieの設定',
  'Privacy policy': 'プライバシーポリシー',
  'Privacy requests': 'プライバシーに関するご請求',
  Private: '非公開',
  Progress: '進行状況',
  Quality: '品質',
  'Questions about these terms:': 'これらの規約に関するご質問：',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'ご質問、不具合のご報告、ご提案はいつでも歓迎します。{email}までご連絡いただくか、記載してほしい内容は[お問い合わせ](/contact)のページをご覧ください。',
  Queued: '待機中',
  'Quick results. Good for clear speech.': '結果がすぐに出ます。はっきりした話し声に向いています。',
  Quickest: '最も速い',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'Qwenは、おおよそのチャンク単位のタイムスタンプを使います。単語ごとのタイミングと確信度は利用できません。',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'Qwenはチャンク単位のタイムスタンプを使い、単語ごとの確信度は提供されません。選ぶ前に、短いサンプルで比べてください。',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR（実験的）',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASRには、WebGPU（ChromeまたはEdge）に対応したデスクトップブラウザーと、グラフィックスドライバーの16ビットシェーダー（shader-f16）対応が必要です。',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASRには、WebGPU（ChromeまたはEdge）に対応したデスクトップブラウザーと、8 GBのメモリが必要です。',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASRには、WebGPU（ChromeまたはEdge）に対応したデスクトップブラウザーが必要です。',
  'Re-transcribe': '再度文字起こし',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'タイムスタンプ付きの文字起こしを読み、モデルが自信を持てなかった単語を確認して、その場で直せます。',
  'Read, edit, download': '読む、直す、ダウンロードする',
  Ready: '準備完了',
  'Ready to print or share': '印刷や共有の準備ができました',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    '試してみませんか？[無料ツールをすべて見る](/tools)か、[今すぐファイルを文字起こしする](/)。',
  'Recognition engine': '認識エンジン',
  Recommended: 'おすすめ',
  'Record from microphone': 'マイクから録音',
  'Record straight from your microphone and turn it into text.':
    'マイクから直接録音して、テキストにします。',
  'Record with your microphone': 'マイクで録音',
  'Recording {stamp}': '録音 {stamp}',
  'Recording is not supported by this browser.': 'このブラウザーは録音に対応していません。',
  'Related reading': '関連記事',
  Remove: '外す',
  'Remove {name}': '{name}を外す',
  'Removes it for good': '完全に削除されます',
  Rename: '名前を変更',
  Renamed: '名前を変更しました',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    '{n}行の「{query}」を「{replacement}」に置換しますか？',
  'Replace "{query}" with "{replacement}" in 1 line?':
    '1行の「{query}」を「{replacement}」に置換しますか？',
  'Replace in {n} lines': '{n}行で置換',
  'Replace in 1 line': '1行で置換',
  'Replace with': '置換後の文字',
  'Replace with…': '置換後の文字…',
  'Replace…': '置換…',
  Replaced: '置換しました',
  'Reporting a problem': '問題の報告',
  'Retrying…': '再試行しています…',
  'Review language and quality': '言語と品質を見直す',
  'Review this transcript': 'この文字起こしを見直す',
  Save: '保存',
  Saved: '保存しました',
  'Saving…': '保存しています…',
  'Search depth: {n}': '検索の深さ：{n}',
  'Search the text': 'テキストを検索',
  'Search the transcript': '文字起こしを検索',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    '[利用規約](/terms)、[使い方](/how-it-works)、[よくある質問](/faq)もご覧ください。',
  'Server busy': 'サーバーが混み合っています',
  'Session only — nothing is saved.': 'セッション限定 — 何も保存されません。',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'セッション限定 — 何も保存されません。アプリを閉じると、すべての文字起こしが消去されます。必要なものは書き出してください。',
  'Session time left: about {n} min': 'セッションの残り時間：約{n}分',
  'Short (32 letters)': '短い（32文字）',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    '文字起こしと字幕について、短く実用的に答えます。どの字幕形式を選ぶか、動画に字幕を付ける方法、より正確な文字起こしを得る方法、ファイルをアップロードせずにブラウザー内で文字起こしを行う仕組みなどです。',
  'Show all {count} languages': '{count}言語をすべて表示',
  'Six ways to download': '6つのダウンロード形式',
  'Skip to main content': 'メインコンテンツへ移動',
  Slower: 'やや遅い',
  'slower than real time on the measured laptop':
    '測定したノートパソコンでは実時間より遅くなります',
  Slowest: '最も遅い',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    '一部の機能は、使うときにオープンソースのコンポーネントをブラウザーにダウンロードします。これらもエンジンの他の部分と同じく、お使いの端末で動作します。ライセンス上、次の表示が求められています：',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    '繰り返されたテキストや、話の区切りがはっきりしない箇所があるため、聞いて確認が必要な部分があります。',
  'Something went wrong': '問題が発生しました',
  'Something went wrong in this browser. Please try again.':
    'このブラウザーで問題が発生しました。もう一度お試しください。',
  'Something went wrong while reading this file.': 'このファイルの読み込み中に問題が発生しました。',
  'Source code': 'ソースコード',
  Speed: '速度',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'スマートフォンとタブレットの速度は、測定値ではなく推定値です。安全なサイズは tiny と base です。',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    '字幕にはSRTとVTT、読むにはTXTとMarkdown、プログラム向けにはJSON、印刷するにはPDF。',
  Standard: '標準',
  'Standard (42 letters)': '標準（42文字）',
  Start: '開始',
  'Start a new transcription': '新しい文字起こしを始める',
  'Start again': 'もう一度開始',
  'Started again': 'もう一度開始しました',
  'Starting…': '開始しています…',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'まだ疑問がありますか？[よくある質問](/faq)をお読みになるか、[使い方](/how-it-works)をご覧いただくか、[お問い合わせ](/contact)ください。',
  'Still stuck? [Read How it works](/how-it-works)':
    'まだ困っていますか？[使い方を読む](/how-it-works)',
  'Stop recording · {time}': '録音を停止 · {time}',
  'Stop this transcription? The text found so far is kept.':
    'この文字起こしを停止しますか？これまでに見つかったテキストは残ります。',
  'Stopping the transcription worker. The text found so far is kept.':
    '文字起こしの処理を停止しています。これまでに見つかったテキストは残ります。',
  'Stored on this device only, never uploaded.':
    'この端末にのみ保存され、アップロードされることはありません。',
  'Style unchanged': 'スタイルは変更されませんでした',
  'Style updated': 'スタイルを更新しました',
  'Style updated using the saved recognition. Edited lines are kept.':
    '保存済みの認識結果を使ってスタイルを更新しました。編集した行は残ります。',
  'Subtitle files': '字幕ファイル',
  'Subtitle line length': '字幕の行の長さ',
  'Subtitles (.srt)': '字幕（.srt）',
  'Switch to dark theme': 'ダークテーマに切り替える',
  'Switch to light theme': 'ライトテーマに切り替える',
  Terms: '利用規約',
  'Terms of use': '利用規約',
  'Text with times (.txt)': '時刻付きテキスト（.txt）',
  'That file is already in the list.': 'そのファイルはすでにリストにあります。',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    '動画でも音声でもないファイルです。MP4、MOV、MP3など、動画または音声のファイルを選んでください。',
  'That is not a video or audio file. Please choose a video or audio file.':
    '動画でも音声でもないファイルです。動画または音声のファイルを選んでください。',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    '音声ファイルではありません。MP3、WAV、M4Aなど、音声のファイルを選んでください。',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    '[プライバシーポリシー](/privacy)では、何がなぜ処理されるのかを説明しています。データについて質問したり、ご自身の権利を行使したりするには、同じ連絡先にご連絡ください。',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    '{label}モデルはこの端末では動作しません：{reason}。別のモデルを選んでください。',
  'the exact error message, or a screenshot of it.':
    'エラーメッセージそのもの、またはそのスクリーンショット。',
  'The file is larger than the server accepts.': 'ファイルがサーバーの受け入れ上限を超えています。',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'ある品質を初めて使うときは、ブラウザーがその音声モデルを1回ダウンロードして保存するので、次回以降のファイルは早く始まります。',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'ある品質を初めて使うときは、ブラウザーが音声モデルをHugging Faceから、エンジンのプログラムファイルをjsDelivrからダウンロードし、次回のために保存します。これらとともにお客様のファイルが送られることはありません。文字起こしが完了すると、ブラウザーはページ上部の匿名カウンターに1を加え、それ以外は何もしません。',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'グラフィックスドライバーが16ビットシェーダーに対応していません。ダウンロードが大きくなり、メモリ使用量も増えます。',
  'The line was removed.': '行を削除しました。',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    '主なツール：どんな動画・音声ファイルも、タイムスタンプ付きの文字起こしにします。',
  'The page you are looking for does not exist or has moved.':
    'お探しのページは存在しないか、移動しました。',
  'The recording failed. Please try again.': '録音に失敗しました。もう一度お試しください。',
  'The server does not have enough free disk space for this file.':
    'サーバーに、このファイルのための十分な空きディスク容量がありません。',
  'The server is busy': 'サーバーが混み合っています',
  'The server is busy right now.': '現在、サーバーが混み合っています。',
  'The service is busy right now. Please wait a moment and try again.':
    '現在、サービスが混み合っています。しばらく待ってから、もう一度お試しください。',
  'The service is full right now. Please try again in a little while.':
    '現在、サービスが満員です。しばらくしてから、もう一度お試しください。',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    '音声認識は、OpenAI Whisperなどのオープンな音声認識モデルを使って、お使いのブラウザー内で動作します。ブラウザーがモデルを1回ダウンロードして保存し、あとはすべての処理をお使いの端末で行います。動画や音声が当社にアップロードされることはなく、そのため、ファイルサイズの上限も、他の人のファイルの順番待ちもありません。各ステップは[使い方](/how-it-works)のページで説明しています。',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    '話されている言語を確実には特定できませんでした。聞こえる言語を選んで、もう一度お試しください。',
  'The text found before it was stopped is shown below.':
    '停止するまでに見つかったテキストを、下に表示しています。',
  'The text found so far is kept.': 'これまでに見つかったテキストは残ります。',
  'The text is ready to paste.': 'テキストを貼り付けられる状態です。',
  'The transcript finished before it could be cancelled.':
    'キャンセルする前に、文字起こしが完了しました。',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    '文字起こしは、OpenAI Whisperなどのオープンな音声認識モデルを使って、お使いの端末で行われます。ブラウザーがモデルを1回ダウンロードして保存するので、次のファイルは早く始まり、動画や音声がどこかにアップロードされることはありません。',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'ファイルの種類と長さ（例：「MP4、25分」）。',
  'There is no size or length limit set here.': 'ここではサイズや長さの上限を設けていません。',
  'These details make a problem much quicker to find and fix:':
    '次の情報があると、問題をはるかに早く見つけて修正できます：',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    '本規約は、インドの法律に準拠します。本規約から生じる紛争については、インド・カルナータカ州ベンガルールの裁判所が専属的管轄権を有します。これにより、お客様がお住まいの国の強行的な消費者保護法に基づく保護が失われることはありません。',
  'They are downloaded again the next time you transcribe.':
    '次に文字起こしするときに、再度ダウンロードされます。',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'Googleを含む第三者のベンダーは、お客様のこのウェブサイトや他のウェブサイトへの過去の訪問に基づいて広告を配信するために、Cookieを使用します。Googleが広告用Cookieを使用することで、Googleとそのパートナーは、お客様のこのサイトや、インターネット上の他のサイトへの訪問に基づいて、広告を配信できます。',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'このボックスはMP3、WAV、M4Aなどの音声ファイルを受け付けますが、そのファイルは動画です。',
  'This browser cannot record. Please choose a file instead.':
    'このブラウザーでは録音できません。代わりにファイルを選んでください。',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'このブラウザーはメモリ容量を報告しないため、{gb} GBと仮定しています。ページが重くなったら、より小さいモデルを選んでください。',
  'This cannot be undone. Export anything you want to keep first.':
    'この操作は元に戻せません。残したいものは、先に書き出してください。',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    'この{brand}は、お使いのコンピューター上で動作しています。ファイルはこのコンピューターで処理され、外部に出ることはありません。何も永続的には保存されません。文字起こしはこのセッションの間だけ存在するので、必要なものは書き出してください。[プライバシーポリシー](/privacy)は、ホスト版のウェブサイトについて説明しています。',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'このコピーは、お使いのコンピューター上で動作しています。ファイルはこのコンピューターで処理され、外部に出ることはありません。',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'この端末には、これほど長いファイルに十分なメモリがありません。小分けにして処理するため、時間がかかります。より短く切るか、より小さいモデルを選ぶほうが安全です。',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'このファイルには、ブラウザー内で動作する9 MBのコンバーターが必要です。読み込みますか？',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'これは便宜上の翻訳です。英語版と異なる場合は、英語版が優先されます。',
  'This local copy does not count transcriptions':
    'このローカルコピーは、文字起こしの数を数えません',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'この文字起こしは、モデルの確信度が低くなっています。テキストを使う前に、録音を聞いて、話されている言語を確認してください。',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'この端末では{wait}かかります（目安）。終わるまで、タブを開いたままにしてください。',
  Timestamps: 'タイムスタンプ',
  'Tips for the best results': '最良の結果を得るためのコツ',
  'Tips for the best transcript': '最良の文字起こしのためのコツ',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    '広告の選択を変更するには、[Google広告設定](https://adssettings.google.com)か、ブラウザーのCookie設定をご利用ください。',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    '広告の選択を変更するには、広告が表示されるページの下部にある**プライバシーとCookieの設定**、[Google広告設定](https://adssettings.google.com)、またはブラウザーのCookie設定をご利用ください。',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'お客様が依頼した文字起こしをお使いの端末で行うため、ウェブサイトを安全に配信するため、そして広告によってサービスを無料に保つためです。GDPRなどのデータ保護法が適用される場合、当社の法的根拠は、お客様が求めたサービスの提供（第6条第1項(b)）、セキュリティ、不正利用の防止、匿名の累計集計に関する当社の正当な利益（第6条第1項(f)）、そして法律が求める場合の広告用Cookieについては、Googleの同意メッセージで求められるお客様の同意（第6条第1項(a)）です。',
  'To keep it fast for everyone, each file has a size and length limit.':
    'すべての方に快適に使っていただくため、各ファイルにはサイズと長さの上限があります。',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    '法律で認められる範囲で、当社は、間接損害または結果的損害、データ、利益または事業の損失、あるいは本サービスの利用または利用不能、文字起こしの誤りから生じるいかなる損失についても責任を負いません。本規約のいかなる規定も、法律上制限できない責任を制限するものではありません。',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'お使いの端末で文字起こしを行うため、ブラウザーは、音声モデルのファイルをHugging Face（huggingface.co）から、音声エンジンのプログラムファイルをjsDelivr（cdn.jsdelivr.net）からダウンロードし、削除するまで、次回のためにキャッシュ（Cache Storage）に保存します。これらの提供元は、通常のリクエスト情報（IPアドレス、ブラウザー、リクエストされたファイル）を受け取りますが、お客様のメディアや文字起こしを受け取ることはありません。',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'お使いの端末で動作させるため、ブラウザーは、音声モデルをHugging Faceから、プログラムファイルをjsDelivrからダウンロードします。これらは、それぞれのライセンスと規約に基づいて提供されています。広告はGoogle AdSenseによって提供されます。広告は、当社が管理しておらず責任を負わない第三者のウェブサイトにつながります。',
  Transcribe: '文字起こしを開始',
  'Transcribe (same language)': '文字起こし（同じ言語）',
  'Transcribe {n} files': '{n}個のファイルを文字起こし',
  'Transcribe a file': 'ファイルを文字起こしする',
  'Transcribe or translate speech in the language you need.':
    '必要な言語で、話し声を文字起こしまたは翻訳します。',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    '動画、音声ファイル、ボイスレコーディングを、50を超える言語で文字起こしできます。言語を自動で検出することもできます。',
  'Transcribing {n}%': '文字起こし中 {n}%',
  'Transcribing takes {time} on this device.': 'この端末での文字起こしには{time}かかります。',
  'Transcribing…': '文字起こししています…',
  '{blurb} Not sure? Keep this one.': '{blurb} 迷ったら、これのままで大丈夫です。',
  '{reason} Retrying in {n} s…': '{reason} {n}秒後に再試行します…',
  'Alternatives': '代替サービス',
  'Checking the downloaded file…': 'ダウンロードしたファイルを確認しています…',
  'Connection lost.': '接続が切れました。',
  'Continued after the page reloaded.': 'ページの再読み込み後に続行しました。',
  'Continuing the download ({size} already saved)': 'ダウンロードを再開しています（{size}は保存済み）',
  'Downloaded: ready to start': 'ダウンロード済み：開始できます',
  'Every language in its own script: English in English letters, Hindi in Devanagari. Choose Hinglish to write Hindi in English letters.': 'すべての言語を、それぞれの文字で表記します。英語はアルファベット、ヒンディー語はデーヴァナーガリー文字です。ヒンディー語をローマ字で書きたいときは、ヒングリッシュを選んでください。',
  'First time only: downloads {size}, now downloading in the background': '初回のみ：{size}をダウンロードします（現在、バックグラウンドでダウンロード中）',
  'Getting the model ready: {loaded} of {total}': 'モデルを準備しています：{loaded} / {total}',
  'Good for most videos.': 'ほとんどの動画に向いています。',
  'Honest, dated comparisons with other transcription services.': '他の文字起こしサービスとの、率直で日付を明記した比較です。',
  'Keep this page open until it is finished. If it reloads or closes, it continues where it stopped when you open the site again.': '完了するまで、このページを開いたままにしてください。再読み込みしたり閉じたりしても、サイトをもう一度開くと、止まったところから続行されます。',
  'Length {time}': '長さ {time}',
  'Opens in Word and Google Docs': 'WordとGoogleドキュメントで開けます',
  'Reconnecting…': '再接続しています…',
  'The download server is busy (HTTP {status}).': 'ダウンロード用サーバーが混み合っています（HTTP {status}）。',
  'The download stalled.': 'ダウンロードが止まりました。',
  'Time so far {time}': '経過時間 {time}',
  'Translated to English': '英語に翻訳済み',
  'Waiting for the internet connection…': 'インターネット接続を待っています…',
  'Word document (.docx)': 'Wordドキュメント（.docx）',
  'Transcribed in {time}': '文字起こし所要時間: {time}',
  Transcript: '文字起こし',
  'Transcript name': '文字起こしの名前',
  'Transcript not found': '文字起こしが見つかりません',
  'Transcript ready': '文字起こしの準備ができました',
  'Transcript style': '文字起こしのスタイル',
  'Transcription failed': '文字起こしに失敗しました',
  'Transcription has started. The text appears below as it is recognised.':
    '文字起こしを開始しました。認識されたテキストが、下に順に表示されます。',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    '文字起こしを開始しました。他のファイルは、ページ上部の「文字起こし」にあります。',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    '文字起こしは、お使いの端末で行われ、プロセッサー、グラフィックスチップ、メモリ、バッテリーを使います。当社はファイルサイズや長さの上限を設けていませんが、どのくらい速く動くか、どれくらい大きなファイルをお使いのブラウザーで扱えるかは、端末によって変わります。処理の遅いスマートフォンやコンピューターで長いファイルを扱うと、長い時間がかかったり、メモリが足りなくなったりすることがあります。文字起こしとファイルはこのブラウザー内に保存され、{idle}操作がない場合は自動的に削除されます。[プライバシーポリシー](/privacy)をご覧ください。',
  'Transcription settings': '文字起こしの設定',
  Transcripts: '文字起こし',
  'Transcripts {n}': '文字起こし {n}',
  'Transcripts are only kept for the browser session that created them.':
    '文字起こしは、作成したブラウザーのセッションの間だけ保存されます。',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    '文字起こしは自動で作られるため、特に騒がしい音声、強いなまり、複数の話者の重なり、音楽、名前や専門用語では、間違いが含まれます。特に法律、医療、金融、公開用途では、使う前に必ず文字起こしを確認してください。本サービスは、精度、完全性、特定目的への適合性を含め、明示か黙示かを問わず、いかなる保証もなく、「現状のまま」「提供可能な範囲で」提供されます。',
  'Translate to English': '英語に翻訳',
  'Try again': 'もう一度試す',
  'Try another quality or language': '別の品質や言語を試す',
  'try to spread malware or anything meant to damage the service.':
    'マルウェアや、サービスに損害を与えることを目的としたものを広めようとすること。',
  'Trying again in a moment…': 'まもなく再試行します…',
  'Trying again. This page loads by itself as soon as the server is back.':
    '再試行しています。サーバーが復旧すると、このページは自動的に読み込まれます。',
  'under a minute': '1分未満',
  'Underline unsure words': '自信のない単語に下線を表示',
  Unlimited: '無制限',
  'Unsure: worth listening to again': '自信なし：もう一度聞く価値があります',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'アップロードが急激に集中した場合は、しばらくお待ちいただくことがあります。',
  'Up to {minutes} per file.': '1ファイルあたり最大{minutes}。',
  'Up to {size} and {minutes} minutes per file.': '1ファイルあたり最大{size}、{minutes}分。',
  'Up to {size} and {minutes} per file.': '1ファイルあたり最大{size}、{minutes}。',
  'Up to {size} per file.': '1ファイルあたり最大{size}。',
  'Updated {date}': '更新日 {date}',
  'Upload complete': 'アップロード完了',
  'Upload failed': 'アップロードに失敗しました',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'アップロードに失敗しました（サーバーエラー {status}）。詳細は、サーバーを実行しているターミナルを確認してください。',
  'Upload failed (server error {status}). Please try again in a moment.':
    'アップロードに失敗しました（サーバーエラー {status}）。しばらくしてから、もう一度お試しください。',
  Uploading: 'アップロード中',
  'Uploading…': 'アップロードしています…',
  'use a computer for this size': 'このサイズにはパソコンを使用',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    '当社の書面による許可なく、ウェブサイトまたはそのカウンターに対して、スクリプト、ボット、その他の自動化された手段を使ったり、偽のカウントを送信したりすること。',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    '違法なコンテンツや、他人の権利を侵害するコンテンツに対して、本サービスを使うこと。',
  'use the service to harass, harm or deceive others;':
    '他人を嫌がらせ、危害を加え、またはだますために本サービスを使うこと。',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'はっきりした話し声では、通常、非常に高い精度です。自信のない行にはマークが付くので、先に確認できます。',
  'Video and audio to text': '動画・音声をテキストに',
  'Video or audio, several at once is fine.': '動画でも音声でも、いくつか同時でも大丈夫です。',
  'Video to text, accurately.': '動画をテキストに、正確に。',
  'Video to text: transcribe a video or audio file':
    '動画をテキストに：動画・音声ファイルを文字起こし',
  'video transcribed': '本の動画を文字起こし',
  'videos transcribed': '本の動画を文字起こし',
  'Vocabulary hint': '語彙のヒント',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'ボイスメモ、会議、講義、ポッドキャスト、インタビュー。',
  'Waiting for microphone permission…': 'マイクの許可を待っています…',
  'Waiting for the first words…': '最初の言葉を待っています…',
  'Waiting in line…': '順番を待っています…',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'テキストがリアルタイムに表示されるのを見ながら、間違いを直し、SRT、VTT、TXT、Markdown、JSON、PDFでダウンロードします。',
  'We do not ask for your name, e-mail address or any other account details.':
    'お名前、メールアドレス、その他のアカウント情報をお尋ねすることはありません。',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    '当社は、サービスが常に利用可能であること、中断しないこと、エラーがないことを約束しません。ウェブサイト、またはそれに必要なダウンロード（Hugging Faceの音声モデルとjsDelivrのプログラムファイル）は、メンテナンスや、当社の管理の及ばない理由で利用できなくなることがあり、一部のブラウザーや端末ではすべてのモデルを実行できません。文字起こしはこのブラウザー内にのみ保存され、操作がないと削除されるため、必要なものは必ず書き出してください。',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    '当社は、お客様のデータを販売しません。当社はお客様のファイルや文字起こしを一切保持していないため、共有するものもありません。認識は、外部の文字起こしサービスやAIサービスではなく、お使いの端末で行われます。Google（広告）、Cloudflare（ホスティングとカウンター）、Hugging FaceとjsDelivr（ダウンロード）が受け取るのは、上で説明したものだけです。法律で求められる場合には、情報を開示することがあります。',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    '当社側には、お客様のものを何も保持しません。累計の集計1つを除き、お客様の利用に関するものは何も当社に保存されません。',
  'We may block access if these rules are broken.':
    'これらのルールに違反した場合、当社はアクセスをブロックすることがあります。',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    '当社は、本規約を更新することがあります。新しい版は、新しい「最終更新日」とともにこのページに掲載され、その時点から適用されます。',
  'We never send your file, your transcript or any personal information to Google.':
    'お客様のファイル、文字起こし、個人情報をGoogleに送信することは一切ありません。',
  'Web subtitles (.vtt)': 'Web字幕（.vtt）',
  'What people use it for': '主な使い道',
  'What you can do with it': 'できること',
  'What you get': '得られるもの',
  'what you were doing, and what happened instead of what you expected;':
    '何をしていたか、そして期待と違って何が起きたか。',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'ファイルがどこで処理されるかは、{brand}の運用方法によって異なります。また、先ほどサーバーから応答がありませんでした。[プライバシーポリシー](/privacy)をご覧ください。',
  'Where your files are processed depends on how {brand} is run.':
    'ファイルがどこで処理されるかは、{brand}の運用方法によって異なります。',
  'Which files can I use, and what are the limits?':
    'どんなファイルが使えますか？上限はありますか？',
  'Which languages are supported?': 'どの言語に対応していますか？',
  'Who builds it': '作っている人',
  'Who runs this website': 'このウェブサイトの運営者',
  'Why it exists': 'このサービスがある理由',
  'Working…': '処理しています…',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'はい。無料で、アカウントやログインは今後もありません。1日や月ごとの上限も、有料の壁もありません。広告のおかげでウェブサイトは無料です。',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'はい。無料で、アカウントやログインは今後もありません。1日や月ごとの上限も、有料の壁もありません。',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'はい。無料で、登録もログインも不要です。このコピーはお使いのコンピューターで動作しているため、上限も有料の壁もありません。動作の速さは、お使いのコンピューターによって変わります。',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'はい。行の横の鉛筆アイコンで、その行のテキストを変更したり、行を削除したりできます。文字起こし全体を検索して置換することもできます。編集内容は、すべての書き出しに含まれます。',
  'You agree not to:': 'お客様は、次のことをしないことに同意します：',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'お客様がコントロールできます。**今すぐデータを削除**を使えば、文字起こし、ファイル、必要ならダウンロード済みの音声モデルを、いつでも削除できます。削除されるのはこのブラウザー内のデータだけで、GoogleのCookieは削除できません。',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    '広告が表示されるページ（たとえばホームページ）の下部にある**プライバシーとCookieの設定**から、いつでも変更できます。',
  'You can now read, fix and download it.': '読んだり、直したり、ダウンロードしたりできます。',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'お客様は、いつでも本サービスの利用をやめることができ、**今すぐデータを削除**でこのブラウザー内のデータを削除できます。当社は、特にお客様が本規約に違反した場合に、いつでもアクセスを停止または終了することがあります。',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'お客様が追加するファイルと、そこから作られた文字起こしに関するすべての権利は、お客様が保持します。それらはお使いの端末で処理され、当社が受け取ることはありません。何を文字起こしするかは、お客様の責任です。ご自身が所有している、または処理する権利を持つコンテンツだけをご利用ください。その中で話している人から必要な許可を得ることも含まれます。',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'パーソナライズ広告のオプトアウトは、[Google広告設定](https://adssettings.google.com)で行えます。また、一部の第三者ベンダーによるパーソナライズ広告向けのCookie利用のオプトアウトは、[www.aboutads.info](https://www.aboutads.info)で行えます。[Googleが、そのサービスを使うサイトからの情報をどのように使うか](https://policies.google.com/technologies/partner-sites)についても、ご確認いただけます。',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'お使いのブラウザーとそのバージョン、端末（パソコンかスマートフォンか、そのOS）。',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'お使いのブラウザーが、ここでのコピーをブロックしました。代わりに「書き出し」を使って、テキストを保存してください。',
  'Your change is saved.': '変更を保存しました。',
  'Your change is still in its box: press Save to try again.':
    '変更はまだ入力欄に残っています。もう一度保存するには「保存」を押してください。',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'ファイルは暗号化された接続でサーバーに送信され、OpenAI Whisperなどのオープンな音声認識モデルで文字起こしされ、その後自動的に削除されます。各ステップは[使い方](/how-it-works)のページで説明しています。',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'ファイルはお使いの端末のブラウザー内で文字起こしされるため、当社ではサイズや長さの上限を設けていません。非常に大きいファイルや長いファイルも扱えますが、時間がかかり、十分な空きメモリが必要です。端末の処理が遅そうな場合は、ページが警告します。',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'ファイルはOpenAI Whisperなどのオープンな音声認識モデルで文字起こしされ、その後自動的に削除されます。',
  'Your file never leaves your device.': 'ファイルがお使いの端末から出ることはありません。',
  'Your file never leaves your device. [Privacy](/privacy)':
    'ファイルがお使いの端末から出ることはありません。[プライバシー](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'ファイルがお使いの端末から出ることはありません。ファイルは、この端末のブラウザー内で文字起こしされ、当社や他の誰かにアップロードされることはありません。文字起こし、編集内容、ファイルは、このブラウザーのストレージにのみ保存され、{idle}操作がない場合は自動的に削除されます。「文字起こし」メニューの**今すぐデータを削除**を押すと、すぐに削除されます。アカウントはありません。ページを離れる前に、必要なものを書き出してください。',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'ファイルがお使いの端末から出ることはありません。アカウントなしで、ブラウザー内で文字起こしされ、文字起こしはこのブラウザーにとどまります。',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'ファイルはこの端末にとどまります。文字起こしの間は、このタブを開いたままにしてください。',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'ファイルと文字起こしは、このセッションの間だけ保存され、{idle}操作がない場合、または「今すぐデータを削除」を押すと、自動的に削除されます。アカウントも追跡もなく、Cookieは必須のセッションCookie 1つだけです。ページを離れる前に、必要なものを書き出してください。',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'ファイルと文字起こしは、このセッションの間だけ保存され、セッションの終了時、または「今すぐデータを削除」を押すと、自動的に削除されます。アカウントも追跡もなく、Cookieは必須のセッションCookie 1つだけです。ページを離れる前に、必要なものを書き出してください。',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'ファイルは自動的に削除されます。[プライバシー](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'ファイルはお使いのブラウザー内で処理され、お使いの端末にとどまります。ウェブサイト、ダウンロード、カウンターは、暗号化された接続（HTTPS）を使っています。このブラウザープロファイルを使える人は、削除されるまで、そこに保存された文字起こしを見られるため、共有のコンピューターでは**今すぐデータを削除**を押してください。',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'ファイルは、処理のために当社のサーバーにアップロードされます。ファイルは、そのセッションの間だけ保存され、セッションの終了時、{idle}操作がない場合、または「文字起こし」メニューの**今すぐデータを削除**を押すと、すぐに自動的に削除されます。アカウントも追跡もなく、Cookieは必須のセッションCookie 1つだけです（分析用や広告用のCookieはありません）。',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'ファイルは、処理のために当社のサーバーにアップロードされます。ファイルは、そのセッションの間だけ保存され、セッションの終了時、または「文字起こし」メニューの**今すぐデータを削除**を押すと、すぐに自動的に削除されます。アカウントも追跡もなく、Cookieは必須のセッションCookie 1つだけです（分析用や広告用のCookieはありません）。',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'ファイルがこの端末から出ることはありません。文字起こしはこのブラウザー内にのみ保存され、{idle}操作がない場合、または「今すぐデータを削除」を押すと、自動的に削除されます。ページを離れる前に、必要なものを書き出してください。',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'ファイルがこの端末から出ることはありません。文字起こしはこのブラウザー内にのみ保存され、セッションの終了時、または「今すぐデータを削除」を押すと、自動的に削除されます。ページを離れる前に、必要なものを書き出してください。',
  'Your session ends in {mins} min. Export what you need.':
    'セッションはあと{mins}分で終了します。必要なものを書き出してください。',
  'Your session has ended': 'セッションが終了しました',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'セッションが終了し、そのデータは削除されました。新しい文字起こしを始められます。',
  'Your transcript is ready below.': '文字起こしの準備ができました。下をご覧ください。',
  'Your transcripts': 'あなたの文字起こし',
  'Your transcripts and files were removed from the server.':
    '文字起こしとファイルをサーバーから削除しました。',
  'Your transcripts and files were removed from this device.':
    '文字起こしとファイルをこの端末から削除しました。',

  // page titles, descriptions and link labels
  'title:/': '動画・音声の文字起こしを無料で、ログイン不要',
  'description:/':
    '動画や音声を、タイムスタンプ付きのテキストに無料で変換します。ログイン不要、回数制限なし、50以上の言語に対応。SRT、VTT、TXT、PDFで書き出せます。',
  'title:/how-it-works': '使い方：動画・音声を文字起こしする方法',
  'description:/how-it-works':
    '動画や音声が、3つの簡単なステップで、正確でタイムスタンプ付きのテキストになる仕組みと、得られるもの、最良の結果を得るコツを紹介します。',
  'title:/faq': 'よくある質問：文字起こしの精度・言語・プライバシー',
  'description:/faq':
    'TranscribeVidについてのよくある質問：精度、対応言語、対応ファイルと上限、速度、プライバシー、編集について答えます。',
  'title:/about': 'TranscribeVidについて',
  'description:/about':
    'TranscribeVidを作っている人と、その理由。登録もログインも不要で、すっきりした画面の、広告で運営される無料の動画・音声文字起こしツールです。',
  'title:/contact': 'お問い合わせ',
  'description:/contact':
    'TranscribeVidへの連絡方法：ご質問、不具合の報告、機能のご提案、プライバシーに関するご請求はメールで。運営者についてもご案内します。',
  'title:/privacy': 'プライバシーポリシー',
  'description:/privacy':
    'TranscribeVidがファイルを文字起こしするときに何を、どこで、なぜ処理するか、保存期間、Cookie、広告、ブラウザーのストレージ、お客様の権利を説明します。',
  'title:/terms': '利用規約',
  'description:/terms':
    'TranscribeVidのご利用ルール：無料サービス、コンテンツ、許容される利用、ファイルの上限、文字起こしの精度に関する保証、責任について説明します。',
  'title:/tools': 'すべての無料ツール：動画・音声の文字起こし',
  'description:/tools':
    '動画・音声の文字起こしツールを一覧にしました。ファイル形式別、用途別、字幕ファイル用。ログイン不要、回数制限なし、50以上の言語に対応しています。',
  'title:/guides': 'ガイド：文字起こしと字幕の実用解説',
  'description:/guides':
    '文字起こしと字幕の実用ガイド：SRTとVTTの違い、動画に字幕を付ける方法、正確な文字起こしのコツ、アップロードしない文字起こしの仕組みを解説します。',
  'title:/video-to-text': '動画を文字起こし：無料でタイムスタンプ付き',
  'description:/video-to-text':
    '動画の文字起こしを無料で。50以上の言語で、タイムスタンプ付きの正確なテキストに変換します。ログイン不要、回数制限なし。SRT、VTT、TXT、PDFで書き出し。',
  'label:/video-to-text': '動画の文字起こし',
  'title:/audio-to-text': '音声を文字起こし：無料・無制限・登録不要',
  'description:/audio-to-text':
    'ポッドキャスト、インタビュー、講義の音声を文字起こしします。タイムスタンプ付き、50以上の言語、ログイン不要。TXT、SRT、VTT、PDFで書き出せます。',
  'label:/audio-to-text': '音声の文字起こし',
  'title:/mp4-to-text': 'MP4動画を文字起こし：無料・ログイン不要',
  'description:/mp4-to-text':
    'MP4動画を、タイムスタンプ付きのテキストに文字起こしします。無料で、回数制限なし、50以上の言語に対応。TXT、SRT、VTT、Markdown、JSON、PDFで書き出せます。',
  'label:/mp4-to-text': 'MP4の文字起こし',
  'title:/mp3-to-text': 'MP3をオンラインで文字起こし：無料',
  'description:/mp3-to-text':
    'MP3をオンラインで無料で文字起こしします。ログイン不要、50以上の言語、すべての行にタイムスタンプ。編集して、TXT、SRT、VTT、PDFで書き出せます。',
  'label:/mp3-to-text': 'MP3の文字起こし',
  'title:/srt-subtitle-generator': 'SRT字幕を無料で作成：動画・音声から',
  'description:/srt-subtitle-generator':
    '動画や音声から、SRT字幕ファイルを無料で作成します。話した内容に合わせて時刻付け、50以上の言語、ログイン不要。行を編集して、SRTまたはVTTで書き出せます。',
  'label:/srt-subtitle-generator': 'SRT字幕ジェネレーター',
  'title:/voice-recording-to-text': '録音を文字起こし：ブラウザーで無料',
  'description:/voice-recording-to-text':
    'ブラウザーでマイクを使って録音するか、ボイスメモを追加して、テキストにします。無料、ログイン不要、50以上の言語。TXT、PDF、SRT、Markdownで書き出せます。',
  'label:/voice-recording-to-text': '録音の文字起こし',
  'title:/wav-to-text': 'WAVを文字起こし：オンラインで無料',
  'description:/wav-to-text':
    'WAVファイルを無料で文字起こしします。レコーダーや通話録音の長い音声も扱え、50以上の言語、タイムスタンプ、ログイン不要。TXT、SRT、PDFで書き出せます。',
  'label:/wav-to-text': 'WAVの文字起こし',
  'title:/m4a-to-text': 'M4Aボイスメモを文字起こし：無料',
  'description:/m4a-to-text':
    'M4Aのボイスメモや録音を無料でテキストにします。iPhoneのボイスメモに対応、ログイン不要、50以上の言語、タイムスタンプ付き。TXT、SRT、VTT、PDFで書き出せます。',
  'label:/m4a-to-text': 'M4Aの文字起こし',
  'title:/webm-to-text': 'WebMを文字起こし：無料・ログイン不要',
  'description:/webm-to-text':
    'WebMの動画や音声を無料で文字起こしします。画面録画やブラウザーの録画に対応し、50以上の言語、タイムスタンプ付き。TXT、SRT、VTT、PDFで書き出せます。',
  'label:/webm-to-text': 'WebMの文字起こし',
  'title:/mov-to-text': 'MOV動画を文字起こし：iPhone動画も無料',
  'description:/mov-to-text':
    'iPhoneやQuickTimeのMOV動画を無料で文字起こしします。ログイン不要、50以上の言語、すべての行にタイムスタンプ。TXT、SRT、VTT、PDFで書き出せます。',
  'label:/mov-to-text': 'MOVの文字起こし',
  'title:/whatsapp-voice-message-to-text': 'WhatsAppのボイスメッセージを文字起こし',
  'description:/whatsapp-voice-message-to-text':
    'WhatsAppのボイスメッセージを無料でテキストにします。保存して追加するだけで、ヒンディー語を含む50以上の言語に対応。ログイン不要、アカウント不要です。',
  'label:/whatsapp-voice-message-to-text': 'WhatsAppのボイスメッセージの文字起こし',
  'title:/meeting-recording-to-text': 'Zoom・Teams・Meetの録画を文字起こし',
  'description:/meeting-recording-to-text':
    'Zoom、Teams、Google Meetの録画を、検索できるタイムスタンプ付きの文字起こしにします。無料、ログイン不要、50以上の言語。TXT、SRT、VTT、PDFで書き出せます。',
  'label:/meeting-recording-to-text': '会議の録音の文字起こし',
  'title:/lecture-to-text': '講義を文字起こし：検索できるテキストに',
  'description:/lecture-to-text':
    '録音した講義を、検索して勉強に使えるテキストにします。無料、ログイン不要、50以上の言語、タイムスタンプ付き。TXT、Markdown、SRT、PDFで書き出せます。',
  'label:/lecture-to-text': '講義の文字起こし',
  'title:/podcast-transcript-generator': 'ポッドキャストの文字起こしを無料で作成',
  'description:/podcast-transcript-generator':
    'MP3やWAVのポッドキャストから、文字起こしを無料で作成します。タイムスタンプ付き、50以上の言語、ログイン不要。編集して、TXT、Markdown、SRT、VTT、PDFで書き出せます。',
  'label:/podcast-transcript-generator': 'ポッドキャストの文字起こし',
  'title:/interview-transcription': 'インタビューの文字起こし：無料・登録不要',
  'description:/interview-transcription':
    'インタビューをアカウントなしで無料で文字起こしします。調査、報道、採用向けに50以上の言語でタイムスタンプ付きテキストを作成。TXTやPDFで書き出せます。',
  'label:/interview-transcription': 'インタビューの文字起こし',
  'title:/vtt-subtitle-generator': 'WebVTT（.vtt）字幕を無料で作成',
  'description:/vtt-subtitle-generator':
    '動画や音声から、WebVTT（.vtt）字幕ファイルを無料で作成します。話した内容に合わせて時刻付け、50以上の言語、ログイン不要。行を編集して、VTTで書き出せます。',
  'label:/vtt-subtitle-generator': 'VTT字幕ジェネレーター',
  'title:/youtube-subtitle-generator': 'YouTube字幕を無料で作成：SRTファイル',
  'description:/youtube-subtitle-generator':
    'ご自身のYouTube動画用のSRT字幕ファイルを、無料でログインなしで作成します。話した内容に合わせて時刻付け、50以上の言語。YouTube Studioでアップロードできます。',
  'label:/youtube-subtitle-generator': 'YouTube字幕ジェネレーター',
  'title:/translate-audio-to-english': '音声を英語に翻訳：無料でテキスト化',
  'description:/translate-audio-to-english':
    'ほかの言語の話し声を、英語のテキストにします。動画や音声ファイルを追加すれば、タイムスタンプ付きの英語テキストか字幕が手に入ります。ログイン不要。SRT、VTT、TXT。',
  'label:/translate-audio-to-english': '音声を英語に翻訳',
  'title:/guides/srt-vs-vtt': 'SRTとVTTの違い：字幕形式の選び方',
  'description:/guides/srt-vs-vtt':
    'SRTとVTT、どちらを使う？それぞれの字幕形式とは何か、違い、使える場所、動画から無料で作る方法を解説します。',
  'label:/guides/srt-vs-vtt': 'SRTとVTTの違い',
  'title:/guides/how-to-add-subtitles-to-a-video': '動画に字幕を付ける方法（無料）',
  'description:/guides/how-to-add-subtitles-to-a-video':
    '4つのステップで字幕を作ります。動画を文字起こしし、テキストを直し、SRTまたはVTTで書き出し、YouTube、VLC、編集ソフト、Webプレーヤーに追加します。',
  'label:/guides/how-to-add-subtitles-to-a-video': '動画に字幕を付ける方法',
  'title:/guides/transcribe-video-without-uploading': '動画をアップロードせずに文字起こしする',
  'description:/guides/transcribe-video-without-uploading':
    'ブラウザー内の文字起こしの仕組み、端末にとどまるもの、1回だけダウンロードされるもの、ブラウザーのネットワークパネルでご自身で確認する方法を説明します。',
  'label:/guides/transcribe-video-without-uploading': '動画をアップロードせずに文字起こしする',
  'title:/guides/accurate-transcripts': '文字起こしの精度を上げる方法',
  'description:/guides/accurate-transcripts':
    '音声認識の精度を上げる実用的な方法：クリーンな音声、適切な言語とモデル、語彙のヒント、結果の確認と修正の仕方を解説します。',
  'label:/guides/accurate-transcripts': '文字起こしの精度を上げる方法',
  'title:/guides/what-is-whisper': 'Whisperとは？音声認識をやさしく解説',
  'description:/guides/what-is-whisper':
    'OpenAIのWhisperとは何か、何で学習したか、精度はどのくらいで、どこが苦手か、TranscribeVidでブラウザー内でどう動くかを説明します。',
  'label:/guides/what-is-whisper': 'Whisperとは？',
  'an independent software developer': '独立系のソフトウェア開発者',
  'Bengaluru, India': 'インド・ベンガルール',
  'This page was translated with AI. [Found a mistake? Tell us.](/contact)':
    'このページはAIで翻訳されています。[誤りを見つけたらお知らせください。](/contact)',
  'A finished transcript: a media player next to the text in short lines, each with a timestamp.':
    '完成した文字起こし：メディアプレーヤーの横に、短い行に分けたテキストが並び、各行にタイムスタンプが付いています。',
  'A finished transcript. Every line has a timestamp, and Export saves it as SRT, VTT, TXT, PDF and more.':
    '完成した文字起こし。すべての行にタイムスタンプが付き、「書き出し」でSRT、VTT、TXT、PDFなどの形式で保存できます。',
  '**Visit statistics.** Cloudflare Web Analytics counts visits to our pages: which page was opened, which site you came from, your country, your browser and device type, and how fast the page loaded. Cloudflare says it sets no cookies, keeps no identifier on your device and does not use the data to follow you from one website to another.':
    '**アクセス統計。** Cloudflare Web Analyticsは、当サイトのページへの訪問数を集計します。どのページが開かれたか、どのサイトから来たか、お住まいの国、ブラウザーと端末の種類、ページの読み込みの速さが対象です。Cloudflareによると、Cookieは設定せず、お使いの端末に識別子も残さず、データを使って他のウェブサイトまであなたを追跡することもありません。',
};
export default dict;
