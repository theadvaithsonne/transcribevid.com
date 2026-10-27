/** German dictionary: docs/in-browser/I18N.md. Keys are the English strings of docs/in-browser/i18n-source.json. */
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
    '„{name}“ ist {size} groß; das Limit beträgt {limit}.',
  '"{name}" is empty.': '„{name}“ ist leer.',
  '"{name}" is ready. Press Transcribe to start.':
    '„{name}“ ist bereit. Drücken Sie auf Transkribieren, um zu starten.',
  '“{title}” was deleted.': '„{title}“ wurde gelöscht.',
  '(optional)': '(optional)',
  '{base} Word timing: {timing}.': '{base} Zeitmarken pro Wort: {timing}.',
  '{brand} ({domain}) is operated by **{name}**, {address} ("we", "us"). We decide how and why your data is processed, as described here.':
    '{brand} ({domain}) wird betrieben von **{name}**, {address} („wir“, „uns“). Wir entscheiden, wie und warum Ihre Daten verarbeitet werden, wie hier beschrieben.',
  '{brand} ({domain}) is run by **{name}**, {address}. Read more on the [About](/about) page.':
    '{brand} ({domain}) wird betrieben von **{name}**, {address}. Mehr dazu auf der Seite [Über uns](/about).',
  '{brand} is a general-audience service and is not directed to children under 13 (or under 16 in the EU where applicable).':
    '{brand} ist ein Angebot für ein allgemeines Publikum und richtet sich nicht an Kinder unter 13 Jahren (oder, wo in der EU anwendbar, unter 16 Jahren).',
  '{brand} is built and run by **{name}**, {role} based in {city}. I built it to give people the best possible transcription experience: seamless from the first click, with no account to create, and a clean interface that stays out of the way.':
    '{brand} wird von **{name}** entwickelt und betrieben (Rolle: {role}; Sitz: {city}). Ich habe es gebaut, um Menschen das bestmögliche Transkriptionserlebnis zu bieten: nahtlos vom ersten Klick an, ohne Konto und mit einer übersichtlichen Oberfläche, die nicht im Weg steht.',
  '{brand} is for a general audience and is not directed to children under 13.':
    '{brand} richtet sich an ein allgemeines Publikum und nicht an Kinder unter 13 Jahren.',
  '{brand} is free because it shows ads, served by Google AdSense. Ads appear only on information pages (home, How it works, FAQ and the tool pages). No ad is shown while a file is being transcribed or beside your transcript, and never on the privacy, terms or logs pages.':
    '{brand} ist kostenlos, weil es Werbung zeigt, die über Google AdSense ausgeliefert wird. Werbung erscheint nur auf Informationsseiten (Startseite, So funktioniert es, FAQ und die Tool-Seiten). Es wird keine Werbung angezeigt, während eine Datei transkribiert wird, und auch nicht neben Ihrem Transkript, und auf den Seiten zu Datenschutz, Nutzungsbedingungen und Protokollen nie.',
  '{brand} is free to use. The [Privacy policy](/privacy) explains what happens to your files.':
    '{brand} ist kostenlos nutzbar. Die [Datenschutzerklärung](/privacy) erklärt, was mit Ihren Dateien geschieht.',
  '{brand} is funded by ads shown on its information pages (Google AdSense). Because your own device does the transcription, there is no server cost for each file, and that is what keeps the service free and unlimited. The [Privacy policy](/privacy) explains what the ads use and how to choose your settings.':
    '{brand} wird durch Werbung finanziert, die auf den Informationsseiten angezeigt wird (Google AdSense). Weil Ihr eigenes Gerät die Transkription übernimmt, entstehen pro Datei keine Serverkosten, und genau das hält den Dienst kostenlos und unbegrenzt. Die [Datenschutzerklärung](/privacy) erklärt, was die Werbung nutzt und wie Sie Ihre Einstellungen wählen.',
  '{brand} turns the speech in a video or audio file into text with timestamps, in three simple steps.':
    '{brand} wandelt die Sprache in einer Video- oder Audiodatei in drei einfachen Schritten in Text mit Zeitstempeln um.',
  '{brand} turns the speech in videos, audio files and voice recordings into accurate, timestamped text. It is free, there is no limit on how many files you transcribe, and you do not need an account: choose a file above, press Transcribe and read the result.':
    '{brand} wandelt die Sprache in Videos, Audiodateien und Sprachaufnahmen in genauen Text mit Zeitstempeln um. Es ist kostenlos, die Zahl der transkribierten Dateien ist unbegrenzt, und Sie brauchen kein Konto: Wählen Sie oben eine Datei aus, drücken Sie auf Transkribieren und lesen Sie das Ergebnis.',
  '{brand} turns video and audio files into text, right in your browser: the recognition runs on your device, and your files are not uploaded to us. It is free to use and needs no account. It is funded by ads on information pages (Google AdSense; see the [Privacy policy](/privacy)). We may change, limit or stop features at any time.':
    '{brand} wandelt Video- und Audiodateien direkt in Ihrem Browser in Text um: Die Erkennung läuft auf Ihrem Gerät, und Ihre Dateien werden nicht zu uns hochgeladen. Die Nutzung ist kostenlos und braucht kein Konto. Finanziert wird der Dienst durch Werbung auf Informationsseiten (Google AdSense; siehe [Datenschutzerklärung](/privacy)). Wir können Funktionen jederzeit ändern, einschränken oder einstellen.',
  '{brand} turns video and audio into accurate, timestamped text for free. There is no sign-up, no sign-in and no watermark: open the page, choose a file and read your transcript.':
    '{brand} wandelt Video und Audio kostenlos in genauen Text mit Zeitstempeln um. Keine Registrierung, keine Anmeldung, kein Wasserzeichen: Seite öffnen, Datei auswählen und das Transkript lesen.',
  '{brand} turns video and audio into text, right in your browser. This page explains what that involves for your data, in plain words. In short: Your file never leaves your device. Your transcripts are kept in this browser only, there is no account, and the site sets no cookies of its own. Ads appear only on information pages, and are served by Google, which uses cookies.':
    '{brand} wandelt Video und Audio direkt in Ihrem Browser in Text um. Diese Seite erklärt in einfachen Worten, was das für Ihre Daten bedeutet. Kurz gesagt: Ihre Datei verlässt Ihr Gerät nie. Ihre Transkripte werden nur in diesem Browser gespeichert, es gibt kein Konto, und die Website setzt keine eigenen Cookies. Werbung erscheint nur auf Informationsseiten und wird von Google ausgeliefert, das Cookies verwendet.',
  '{done} of {total}': '{done} von {total}',
  '{duration} (estimate)': '{duration} (Schätzung)',
  '{gb} GB of memory recommended': '{gb} GB Arbeitsspeicher empfohlen',
  '{h} h': '{h} Std.',
  '{h} h {m} min': '{h} Std. {m} Min.',
  '{label} — {note}': '{label} – {note}',
  '{label} — {note} ({download})': '{label} – {note} ({download})',
  '{label} — {reason}': '{label} – {reason}',
  '{label} (first use downloads {size} MB)':
    '{label} (beim ersten Mal werden {size} MB heruntergeladen)',
  "{label}, as reported by visitors' browsers": '{label}, gemeldet von den Browsern der Besucher',
  '{label}: common questions': '{label}: Häufige Fragen',
  '{label}. {title}.': '{label}. {title}.',
  '{label}. Look for it in your downloads.': '{label}. Sie finden die Datei in Ihren Downloads.',
  '{language} → English': '{language} → Englisch',
  '{message} {done} of {total} file(s) were already queued; the other {left} are still in the list, press Transcribe to retry.':
    '{message} {done} von {total} Datei(en) waren bereits in der Warteschlange; die übrigen {left} stehen noch in der Liste. Drücken Sie auf Transkribieren, um es erneut zu versuchen.',
  '{message} {done} of {total} file(s) were already queued; the other {left} is still in the list, press Transcribe to retry.':
    '{message} {done} von {total} Datei(en) waren bereits in der Warteschlange; die übrige Datei ({left}) steht noch in der Liste. Drücken Sie auf Transkribieren, um es erneut zu versuchen.',
  '{model} runs slower than real time on this device: {wait} for {audio} of audio (estimate). Tiny or base finish sooner.':
    '{model} läuft auf diesem Gerät langsamer als in Echtzeit: {wait} für {audio} Audio (Schätzung). Tiny oder Base sind früher fertig.',
  '{n} files were skipped: not video or audio.':
    '{n} Dateien wurden übersprungen: weder Video noch Audio.',
  '{n} h ago': 'vor {n} Std.',
  '{n} min': '{n} Min.',
  '{n} min ago': 'vor {n} Min.',
  '{n} min left': 'noch {n} Min.',
  '{n} min read': '{n} Min. Lesezeit',
  '{n} minute': '{n} Minute',
  '{n} minutes': '{n} Minuten',
  '{n} of {total}': '{n} von {total}',
  '{n} of those files are already in the list.': '{n} dieser Dateien sind bereits in der Liste.',
  '{n} video transcribed': '{n} Video transkribiert',
  '{n} videos transcribed': '{n} Videos transkribiert',
  '{n} words': '{n} Wörter',
  '{n}% done': '{n} % fertig',
  '{n}% model confidence': '{n} % Modellkonfidenz',
  '{n}s left': 'noch {n} Sek.',
  '{name} home': '{name} Startseite',
  '{size} download': '{size} Download',
  '{title}: {blurb}': '{title}: {blurb}',
  '{title}: {blurb} {note}.': '{title}: {blurb} {note}.',
  '{title}. {blurb}': '{title}. {blurb}',
  '{title}. {blurb} Not available on this device: {reason}.':
    '{title}. {blurb} Auf diesem Gerät nicht verfügbar: {reason}.',
  "**A technical log in this tab.** The Logs page shows this tab's own technical log. It stays in your browser and is never sent anywhere.":
    '**Ein technisches Protokoll in diesem Tab.** Die Seite „Protokolle“ zeigt das technische Protokoll dieses Tabs. Es bleibt in Ihrem Browser und wird nirgendwohin gesendet.',
  '**Add a vocabulary hint**: names, brands and jargon that appear in the audio, spelled the way you want them.':
    '**Fügen Sie einen Wortschatz-Hinweis hinzu**: Namen, Marken und Fachbegriffe, die im Audio vorkommen, so geschrieben, wie Sie sie haben möchten.',
  '**Add a vocabulary hint**: names, brands and jargon, spelled the way you want them.':
    '**Fügen Sie einen Wortschatz-Hinweis hinzu**: Namen, Marken und Fachbegriffe, so geschrieben, wie Sie sie haben möchten.',
  '**Ads.** Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript.':
    '**Werbung.** Werbung erscheint nur auf Informationsseiten und wird von Google ausgeliefert, das Cookies verwendet. Es wird keine Werbung angezeigt, während eine Datei transkribiert wird, und auch nicht neben Ihrem Transkript.',
  '**Check the marked lines** and fix them in the transcript editor.':
    '**Prüfen Sie die markierten Zeilen** und korrigieren Sie sie im Transkript-Editor.',
  '**Choose the spoken language** instead of auto-detect.':
    '**Wählen Sie die gesprochene Sprache** statt der automatischen Erkennung.',
  '**Choose your file.** Drop a video or audio file above, pick one from your device, or record your voice with the microphone. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG and most other common formats work.':
    '**Wählen Sie Ihre Datei.** Legen Sie oben eine Video- oder Audiodatei ab, wählen Sie eine von Ihrem Gerät aus oder nehmen Sie Ihre Stimme mit dem Mikrofon auf. MP4, MOV, MKV, WebM, AVI, MP3, WAV, M4A, FLAC, OGG und die meisten anderen gängigen Formate funktionieren.',
  '**Enhance audio** — filter rumble & hiss, even out quiet speakers':
    '**Audio verbessern** – Rumpeln und Rauschen filtern, leise Sprecher angleichen',
  '**File limits.** None set by us. Your file is processed on your device, so very large or long files take longer and need enough free memory; the page warns you on a slower device.':
    '**Dateigrenzen.** Von uns gibt es keine. Ihre Datei wird auf Ihrem Gerät verarbeitet, daher dauern sehr große oder lange Dateien länger und brauchen genug freien Speicher; die Seite warnt Sie auf einem langsameren Gerät.',
  '**File types.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS and MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG and OPUS. You can also record straight from your microphone.':
    '**Dateitypen.** Video: MP4, MKV, MOV, AVI, WEBM, WMV, FLV, M4V, 3GP, TS und MTS. Audio: MP3, WAV, M4A, AAC, FLAC, OGG und OPUS. Sie können auch direkt über Ihr Mikrofon aufnehmen.',
  "**Google's cookies.** Google sets its own cookies when ads load, on the pages that show ads only (see section 6).":
    '**Cookies von Google.** Google setzt beim Laden von Werbung eigene Cookies, und zwar nur auf den Seiten, die Werbung zeigen (siehe Abschnitt 6).',
  '**Lectures and podcasts** turned into readable text for studying or show notes.':
    '**Vorlesungen und Podcasts**, umgewandelt in lesbaren Text zum Lernen oder für Shownotes.',
  '**Limits.** No size or length limit is announced by the server right now. Very large files simply take longer.':
    '**Grenzen.** Der Server gibt derzeit keine Größen- oder Längenbegrenzung bekannt. Sehr große Dateien dauern einfach länger.',
  '**Limits.** We set no size or length limit: your file is processed on your device, so very large or long files simply take longer and need enough free memory. On a slower device the page tells you before you start and estimates the time.':
    '**Grenzen.** Wir legen keine Größen- oder Längenbegrenzung fest: Ihre Datei wird auf Ihrem Gerät verarbeitet, daher dauern sehr große oder lange Dateien einfach länger und brauchen genug freien Speicher. Auf einem langsameren Gerät sagt Ihnen die Seite das vor dem Start und schätzt die Dauer.',
  '**Media you add.** The video or audio files you choose or record. They are processed in your browser on your device (using WebGPU or WebAssembly). Your file is never uploaded to our servers and never sent to Google or anyone else.':
    '**Medien, die Sie hinzufügen.** Die Video- oder Audiodateien, die Sie auswählen oder aufnehmen. Sie werden in Ihrem Browser auf Ihrem Gerät verarbeitet (mit WebGPU oder WebAssembly). Ihre Datei wird nie auf unsere Server hochgeladen und nie an Google oder an andere gesendet.',
  '**Meeting and interview notes** that you can search, quote and share.':
    '**Besprechungs- und Interviewnotizen**, die Sie durchsuchen, zitieren und teilen können.',
  '**Mistakes happen.** No speech recognition is perfect. Always verify a transcript before relying on it for anything important.':
    '**Fehler kommen vor.** Keine Spracherkennung ist perfekt. Prüfen Sie ein Transkript immer, bevor Sie sich bei etwas Wichtigem darauf verlassen.',
  '**No cookies of our own.** The site itself sets no cookies.':
    '**Keine eigenen Cookies.** Die Website selbst setzt keine Cookies.',
  '**Nothing is saved for later.** Files and transcripts exist only for your session. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Nichts wird für später gespeichert.** Dateien und Transkripte existieren nur für Ihre Sitzung. Exportieren Sie, was Sie brauchen, bevor Sie gehen. Einzelheiten stehen in der [Datenschutzerklärung](/privacy).',
  '**Nothing is saved for later.** Transcripts and the file stay in this browser only and are deleted automatically after {idle} of inactivity, or when you press **Delete my data now**. Export what you need before you leave. Details are in the [Privacy policy](/privacy).':
    '**Nichts wird für später gespeichert.** Transkripte und die Datei bleiben nur in diesem Browser und werden automatisch nach {idle} Inaktivität gelöscht oder wenn Sie auf **Meine Daten jetzt löschen** drücken. Exportieren Sie, was Sie brauchen, bevor Sie gehen. Einzelheiten stehen in der [Datenschutzerklärung](/privacy).',
  '**Nothing is saved for later.** Transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    '**Nichts wird für später gespeichert.** Transkripte existieren nur für diese Sitzung, exportieren Sie also, was Sie brauchen. Die [Datenschutzerklärung](/privacy) beschreibt die gehostete Website.',
  '**One running total.** When a transcription finishes, your browser sends one anonymous "+1" to our counter (a Cloudflare Worker). It carries no file, transcript or identifier. Cloudflare sees your IP address in transit and uses it briefly to limit abuse (a rate limit); we store only the total. The number shown in the page header is reported by visitors\' browsers and is not verified.':
    '**Eine laufende Gesamtzahl.** Wenn eine Transkription fertig ist, sendet Ihr Browser ein anonymes „+1“ an unseren Zähler (einen Cloudflare Worker). Es enthält weder Datei noch Transkript noch Kennung. Cloudflare sieht Ihre IP-Adresse bei der Übertragung und nutzt sie kurz zur Missbrauchsbegrenzung (Ratenbegrenzung); wir speichern nur die Gesamtzahl. Die im Seitenkopf angezeigte Zahl wird von den Browsern der Besucher gemeldet und ist nicht überprüft.',
  '**Pick High accuracy or Best accuracy** for difficult audio.':
    '**Wählen Sie „Hohe Genauigkeit“ oder „Beste Genauigkeit“** für schwieriges Audio.',
  '**Pick the quality and the language.** A faster model gives a quick draft; a more accurate one is better for interviews, lectures and subtitles. The spoken language can be detected for you, and more than 50 languages are supported.':
    '**Wählen Sie Qualität und Sprache.** Ein schnelleres Modell liefert einen schnellen Entwurf; ein genaueres eignet sich besser für Interviews, Vorlesungen und Untertitel. Die gesprochene Sprache kann automatisch erkannt werden, und mehr als 50 Sprachen werden unterstützt.',
  '**Re-transcribe** a finished transcript with another quality or language; your current transcript is kept.':
    '**Erneut transkribieren**: ein fertiges Transkript mit anderer Qualität oder Sprache neu erstellen; Ihr aktuelles Transkript bleibt erhalten.',
  '**Re-transcribe** with another quality or language; your current transcript is kept.':
    '**Erneut transkribieren** mit anderer Qualität oder Sprache; Ihr aktuelles Transkript bleibt erhalten.',
  '**Read, correct and download.** The transcript appears with timestamps, and words the model was unsure of are marked so you can check them. Download it as plain text, SRT or VTT subtitles, Markdown or JSON.':
    '**Lesen, korrigieren und herunterladen.** Das Transkript erscheint mit Zeitstempeln, und Wörter, bei denen sich das Modell unsicher war, sind markiert, damit Sie sie prüfen können. Laden Sie es als Nur-Text, SRT- oder VTT-Untertitel, Markdown oder JSON herunter.',
  '**Requests that deliver the website.** Cloudflare (Cloudflare Pages) delivers this website. As our hosting and network provider it processes your IP address and the usual request data (such as the time, the page requested and your browser) to deliver and protect the site.':
    '**Anfragen, die die Website ausliefern.** Cloudflare (Cloudflare Pages) liefert diese Website aus. Als unser Hosting- und Netzwerkanbieter verarbeitet es Ihre IP-Adresse und die üblichen Anfragedaten (etwa die Uhrzeit, die angeforderte Seite und Ihren Browser), um die Website auszuliefern und zu schützen.',
  '**Skip silence & music** — prevents made-up text':
    '**Stille und Musik überspringen** – verhindert erfundenen Text',
  "**Speech models stay in your browser's cache** (Cache Storage), so the next transcription starts faster, until you delete them (**Delete my data now** can delete them too) or your browser clears its storage. They are program files, not your data.":
    '**Sprachmodelle bleiben im Cache Ihres Browsers** (Cache Storage), damit die nächste Transkription schneller startet, bis Sie sie löschen (**Meine Daten jetzt löschen** kann sie ebenfalls löschen) oder Ihr Browser seinen Speicher leert. Es sind Programmdateien, nicht Ihre Daten.',
  '**Speed.** It depends on the quality you pick, the length of the file and how busy the service is.':
    '**Geschwindigkeit.** Sie hängt von der gewählten Qualität, der Länge der Datei und der Auslastung des Dienstes ab.',
  "**Speed.** It depends on your device, the quality you pick and the length of the file. The first use of a quality level downloads its model once: your browser fetches the model files from Hugging Face and the engine's program files from jsDelivr, then keeps them cached. Keep the tab open while it works.":
    '**Geschwindigkeit.** Sie hängt von Ihrem Gerät, der gewählten Qualität und der Länge der Datei ab. Bei der ersten Nutzung einer Qualitätsstufe wird ihr Modell einmal heruntergeladen: Ihr Browser lädt die Modelldateien von Hugging Face und die Programmdateien der Engine von jsDelivr und hält sie dann im Cache bereit. Lassen Sie den Tab geöffnet, solange er arbeitet.',
  '**Start from good audio**: less background noise, a close microphone, and one person speaking at a time. Keep "Enhance audio" on.':
    '**Beginnen Sie mit gutem Audio**: weniger Hintergrundgeräusche, ein nahes Mikrofon und immer nur eine sprechende Person. Lassen Sie „Audio verbessern“ eingeschaltet.',
  '**Start from good audio**: little background noise, a close microphone, one person at a time. Keep "Enhance audio" on.':
    '**Beginnen Sie mit gutem Audio**: wenig Hintergrundgeräusche, ein nahes Mikrofon, jeweils eine Person. Lassen Sie „Audio verbessern“ eingeschaltet.',
  '**Storage in your browser.** Your browser keeps your transcripts and files (IndexedDB) and the speech models (Cache Storage) as described above, remembers your light or dark theme choice, and its session storage keeps a few convenience settings for the current tab (such as your last quality choice). None of this is sent to us.':
    '**Speicher in Ihrem Browser.** Ihr Browser bewahrt Ihre Transkripte und Dateien (IndexedDB) und die Sprachmodelle (Cache Storage) wie oben beschrieben auf, merkt sich Ihre Wahl zwischen hellem und dunklem Design, und sein Sitzungsspeicher hält einige Komfort-Einstellungen für den aktuellen Tab bereit (etwa Ihre zuletzt gewählte Qualität). Nichts davon wird an uns gesendet.',
  '**Subtitles and captions** for your own videos, reels and online courses, from an SRT or VTT file.':
    '**Untertitel** für Ihre eigenen Videos, Reels und Online-Kurse, aus einer SRT- oder VTT-Datei.',
  '**Text made on your device.** The transcript, its timestamps and your edits, the title you choose, and the settings you pick (quality, language, vocabulary hint). They are made and kept in this browser; we never receive them.':
    '**Auf Ihrem Gerät erstellter Text.** Das Transkript, seine Zeitstempel und Ihre Änderungen, der von Ihnen gewählte Titel und die gewählten Einstellungen (Qualität, Sprache, Wortschatz-Hinweis). Sie werden in diesem Browser erstellt und gespeichert; wir erhalten sie nie.',
  '**Use previous text as context** — can repeat on long files':
    '**Vorherigen Text als Kontext nutzen** – kann sich bei langen Dateien wiederholen',
  '**Voice memos** written out, so you do not have to listen to them again.':
    '**Sprachnotizen**, ausgeschrieben, damit Sie sie nicht noch einmal anhören müssen.',
  '**Why can results differ between runs, quality settings or other tools?** Speech recognition is probabilistic: it chooses the most likely words, and in noisy or ambiguous passages several answers are close. A different quality setting, language setting, vocabulary hint or audio clean-up can change the text, and so can another tool that uses a different system. Speaker names or labels are not added.':
    '**Warum können sich Ergebnisse zwischen Durchläufen, Qualitätsstufen oder anderen Werkzeugen unterscheiden?** Spracherkennung ist probabilistisch: Sie wählt die wahrscheinlichsten Wörter, und in verrauschten oder mehrdeutigen Passagen liegen mehrere Antworten dicht beieinander. Eine andere Qualitätsstufe, Spracheinstellung, ein anderer Wortschatz-Hinweis oder eine andere Audio-Bereinigung kann den Text verändern, ebenso ein anderes Werkzeug, das ein anderes System nutzt. Sprechernamen oder -kennzeichnungen werden nicht hinzugefügt.',
  '**Word-level timing** — better subtitles and confidence marks':
    '**Zeitmarken pro Wort** – bessere Untertitel und Konfidenzmarkierungen',
  "**Your files and transcripts stay in this browser.** Transcripts, edits and the source file are kept in this browser's storage (IndexedDB) only. They are deleted automatically when your session ends, which happens after {idle} of inactivity, or at once when you press **Delete my data now** in the Transcripts menu.":
    '**Ihre Dateien und Transkripte bleiben in diesem Browser.** Transkripte, Änderungen und die Quelldatei werden nur im Speicher dieses Browsers (IndexedDB) aufbewahrt. Sie werden automatisch gelöscht, wenn Ihre Sitzung endet, was nach {idle} Inaktivität geschieht, oder sofort, wenn Sie im Menü „Transkripte“ auf **Meine Daten jetzt löschen** drücken.',
  '1 file was skipped: not video or audio.': '1 Datei wurde übersprungen: weder Video noch Audio.',
  '1 minute': '1 Minute',
  '1 word': '1 Wort',
  '1. Agreement': '1. Einverständnis',
  '1. Who runs this website': '1. Wer diese Website betreibt',
  '10. Children': '10. Kinder',
  '10. Termination': '10. Beendigung',
  '11. Children': '11. Kinder',
  '11. Your rights and choices': '11. Ihre Rechte und Wahlmöglichkeiten',
  '12. Changes': '12. Änderungen',
  '12. Open-source components': '12. Open-Source-Komponenten',
  '13. Changes to this policy': '13. Änderungen dieser Erklärung',
  '13. Governing law': '13. Anwendbares Recht',
  '14. Contact': '14. Kontakt',
  '2. The service': '2. Der Dienst',
  '2. What is processed, and where': '2. Was verarbeitet wird – und wo',
  '3 simple steps': '3 einfache Schritte',
  '3. Why it is processed': '3. Warum es verarbeitet wird',
  '3. Your content': '3. Ihre Inhalte',
  '4. Acceptable use': '4. Zulässige Nutzung',
  '4. How long it is kept': '4. Wie lange es aufbewahrt wird',
  '5. Downloads your browser makes': '5. Downloads, die Ihr Browser durchführt',
  '5. Limits: your device does the work': '5. Grenzen: Ihr Gerät erledigt die Arbeit',
  '6. Accuracy: no warranty': '6. Genauigkeit: keine Gewährleistung',
  '6. Advertising': '6. Werbung',
  '7. Availability': '7. Verfügbarkeit',
  '7. Cookies and browser storage': '7. Cookies und Browser-Speicher',
  '8. Sharing': '8. Weitergabe',
  '8. Third-party downloads and ads': '8. Downloads und Werbung von Dritten',
  '9. Liability': '9. Haftung',
  '9. Security': '9. Sicherheit',
  'A name cannot be empty, so the old name was kept.':
    'Ein Name darf nicht leer sein, daher wurde der alte Name beibehalten.',
  'A new transcript has started. The old one is kept in your list.':
    'Ein neues Transkript wurde gestartet. Das alte bleibt in Ihrer Liste erhalten.',
  'a period': 'einer bestimmten Zeit',
  About: 'Über uns',
  'About {brand}': 'Über {brand}',
  'about {h} h': 'etwa {h} Std.',
  'about {h} h {m} min': 'etwa {h} Std. {m} Min.',
  'about {n} min': 'etwa {n} Min.',
  'Accurate text': 'Genauer Text',
  'Add another file': 'Weitere Datei hinzufügen',
  'Add your file': 'Datei hinzufügen',
  'Ads appear only on information pages, and are served by Google, which uses cookies. No ad is shown while a file is being transcribed or beside your transcript, and this website sets no cookies of its own. Details are in the [Privacy policy](/privacy).':
    'Werbung erscheint nur auf Informationsseiten und wird von Google ausgeliefert, das Cookies verwendet. Es wird keine Werbung angezeigt, während eine Datei transkribiert wird, und auch nicht neben Ihrem Transkript, und diese Website setzt keine eigenen Cookies. Einzelheiten stehen in der [Datenschutzerklärung](/privacy).',
  'Ads are not needed for any feature: with ads blocked or declined, everything works the same.':
    'Werbung wird für keine Funktion benötigt: Ist sie blockiert oder abgelehnt, funktioniert alles genauso.',
  'Ads keep TranscribeVid free. Everything works without them.':
    'Werbung hält TranscribeVid kostenlos. Alles funktioniert auch ohne sie.',
  Advertisement: 'Werbung',
  'All free tools': 'Alle kostenlosen Tools',
  'All free video and audio to text tools': 'Alle kostenlosen Tools für Video und Audio zu Text',
  'All tools': 'Alle Tools',
  'All your data was deleted': 'Alle Ihre Daten wurden gelöscht',
  'Allow the microphone in your browser, or choose a file instead.':
    'Erlauben Sie das Mikrofon in Ihrem Browser oder wählen Sie stattdessen eine Datei aus.',
  'Already added': 'Bereits hinzugefügt',
  'Already finished': 'Bereits fertig',
  'Also delete the downloaded speech models?': 'Auch die heruntergeladenen Sprachmodelle löschen?',
  'An upload is in progress. Wait for it to finish before adding more files.':
    'Ein Upload läuft gerade. Warten Sie, bis er abgeschlossen ist, bevor Sie weitere Dateien hinzufügen.',
  'Apply style only': 'Nur Stil anwenden',
  'Apply style uses saved recognition without processing the audio again. Edited lines are kept.':
    '„Nur Stil anwenden“ nutzt die gespeicherte Erkennung, ohne das Audio erneut zu verarbeiten. Bearbeitete Zeilen bleiben erhalten.',
  'Audio works too.': 'Audio funktioniert auch.',
  'Automatic (IndicXlit when installed)': 'Automatisch (IndicXlit, wenn installiert)',
  Back: 'Zurück',
  'Basic phonetic spelling': 'Einfache phonetische Schreibweise',
  'Because we hold no account and no details that identify you, we usually cannot link any data to a person. Where the law gives you rights over your personal data, such as access, correction, deletion, restriction, objection and portability, or the right to complain to your data protection authority, you can exercise them by contacting us:':
    'Da wir weder ein Konto noch Angaben speichern, die Sie identifizieren, können wir Daten in der Regel keiner Person zuordnen. Wo das Gesetz Ihnen Rechte an Ihren personenbezogenen Daten gibt, etwa auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Übertragbarkeit, oder das Recht, sich bei Ihrer Datenschutzbehörde zu beschweren, können Sie diese ausüben, indem Sie uns kontaktieren:',
  'Because your transcripts exist only in this browser, export what you need before you leave. Deleted data cannot be recovered.':
    'Da Ihre Transkripte nur in diesem Browser existieren, exportieren Sie, was Sie brauchen, bevor Sie gehen. Gelöschte Daten lassen sich nicht wiederherstellen.',
  'Best accuracy': 'Beste Genauigkeit',
  'Best accuracy, slowest': 'Beste Genauigkeit, am langsamsten',
  Breadcrumb: 'Brotkrumennavigation',
  'By file type': 'Nach Dateityp',
  'By language': 'Nach Sprache',
  'By use': 'Nach Verwendung',
  'By using {brand} ({domain}) you agree to these terms. If you do not agree, please do not use the service. The service is operated by **{name}**, {address}.':
    'Durch die Nutzung von {brand} ({domain}) stimmen Sie diesen Bedingungen zu. Wenn Sie nicht zustimmen, nutzen Sie den Dienst bitte nicht. Der Dienst wird betrieben von **{name}**, {address}.',
  "bypass or try to bypass the rate limits or security of the website or its counter, or interfere with its operation or other visitors' use of it;":
    'die Ratenbegrenzungen oder die Sicherheitsvorkehrungen der Website oder ihres Zählers zu umgehen oder dies zu versuchen oder den Betrieb der Website oder die Nutzung durch andere Besucher zu stören;',
  'Can I edit the transcript?': 'Kann ich das Transkript bearbeiten?',
  "Can't reach the server.": 'Der Server ist nicht erreichbar.',
  Cancel: 'Abbrechen',
  'Cancel "{title}"?': '„{title}“ abbrechen?',
  'Cancel {title}': '{title} abbrechen',
  'Cancellation requested': 'Abbruch angefordert',
  Cancelled: 'Abgebrochen',
  'Cancelling…': 'Wird abgebrochen …',
  'Cannot reach the server': 'Server nicht erreichbar',
  'Cannot reach the server.': 'Der Server ist nicht erreichbar.',
  'Cannot reach the server. Check your connection and try again.':
    'Der Server ist nicht erreichbar. Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
  'Cannot reach the server. Make sure it is running (npm run dev) and try again.':
    'Der Server ist nicht erreichbar. Stellen Sie sicher, dass er läuft (npm run dev), und versuchen Sie es erneut.',
  'Change or delete a line, or search and replace. Your edits are in every download.':
    'Ändern oder löschen Sie eine Zeile oder nutzen Sie Suchen und Ersetzen. Ihre Änderungen sind in jedem Download enthalten.',
  'Changed in {n} lines.': 'In {n} Zeilen geändert.',
  'Check Hinglish spelling': 'Hinglish-Schreibweise prüfen',
  'Choose "Save as PDF" in the print dialog.': 'Wählen Sie im Druckdialog „Als PDF speichern“.',
  'Choose a file': 'Datei auswählen',
  'Choose a file first': 'Wählen Sie zuerst eine Datei aus',
  'Choose a format': 'Format wählen',
  'Choose between faster and more accurate models, depending on your device and how much time you have.':
    'Wählen Sie je nach Gerät und verfügbarer Zeit zwischen schnelleren und genaueren Modellen.',
  'Choose Fastest, Standard, High accuracy or Best accuracy: Fastest is quickest, Best accuracy makes the fewest mistakes.':
    'Wählen Sie „Am schnellsten“, „Standard“, „Hohe Genauigkeit“ oder „Beste Genauigkeit“: „Am schnellsten“ ist am flottesten, „Beste Genauigkeit“ macht die wenigsten Fehler.',
  'Choose the spoken language or leave it on auto-detect. You can also translate speech into English.':
    'Wählen Sie die gesprochene Sprache oder lassen Sie sie automatisch erkennen. Sie können Sprache auch ins Englische übersetzen.',
  'Chosen files': 'Ausgewählte Dateien',
  'Clear speech close to the microphone gives the best result. Under More options, **Enhance audio** and **Skip silence & music** are on by default: they filter rumble and hiss and stop the model from inventing text during music or long pauses, so keep them on for noisy recordings. For subtitles, keep **Word-level timing** on too, so each line starts and ends exactly with the words.':
    'Klare Sprache nahe am Mikrofon liefert das beste Ergebnis. Unter „Weitere Optionen“ sind **Audio verbessern** und **Stille und Musik überspringen** standardmäßig eingeschaltet: Sie filtern Rumpeln und Rauschen und verhindern, dass das Modell bei Musik oder langen Pausen Text erfindet; lassen Sie sie bei verrauschten Aufnahmen daher an. Für Untertitel lassen Sie auch **Zeitmarken pro Wort** eingeschaltet, damit jede Zeile genau mit den Wörtern beginnt und endet.',
  Close: 'Schließen',
  'Close menu': 'Menü schließen',
  'Close: {title}': 'Schließen: {title}',
  'Common questions': 'Häufige Fragen',
  Contact: 'Kontakt',
  'Converting…': 'Wird umgewandelt …',
  Copied: 'Kopiert',
  'Copy text': 'Text kopieren',
  'Copying…': 'Wird kopiert …',
  'Could not cancel the transcript.': 'Das Transkript konnte nicht abgebrochen werden.',
  'Could not change transcript style.': 'Der Transkriptionsstil konnte nicht geändert werden.',
  'Could not copy': 'Kopieren nicht möglich',
  'Could not delete the transcript.': 'Das Transkript konnte nicht gelöscht werden.',
  'Could not delete your data.': 'Ihre Daten konnten nicht gelöscht werden.',
  'Could not load the text to copy.': 'Der zu kopierende Text konnte nicht geladen werden.',
  'Could not prepare the file. Please try again.':
    'Die Datei konnte nicht vorbereitet werden. Bitte versuchen Sie es erneut.',
  'Could not rename the transcript.': 'Das Transkript konnte nicht umbenannt werden.',
  'Could not save the change.': 'Die Änderung konnte nicht gespeichert werden.',
  'Could not start': 'Start nicht möglich',
  'Could not start.': 'Der Start war nicht möglich.',
  Dark: 'Dunkel',
  Delete: 'Löschen',
  'Delete "{title}" and its transcript?': '„{title}“ und sein Transkript löschen?',
  'Delete "{title}"? This cannot be undone.':
    '„{title}“ löschen? Das lässt sich nicht rückgängig machen.',
  'Delete {title}': '{title} löschen',
  'Delete all your transcripts and the files kept in this browser now?':
    'Alle Ihre Transkripte und die in diesem Browser gespeicherten Dateien jetzt löschen?',
  'Delete all your transcripts and uploaded files now?':
    'Alle Ihre Transkripte und hochgeladenen Dateien jetzt löschen?',
  'Delete line': 'Zeile löschen',
  'Delete my data now': 'Meine Daten jetzt löschen',
  'Delete this line from the transcript?': 'Diese Zeile aus dem Transkript löschen?',
  'Delete transcript': 'Transkript löschen',
  Deleted: 'Gelöscht',
  'Detect automatically': 'Automatisch erkennen',
  'Dismiss message': 'Meldung schließen',
  'Distil Large v3 understands English speech only. Choose another model to translate.':
    'Distil Large v3 versteht nur englische Sprache. Wählen Sie zum Übersetzen ein anderes Modell.',
  Done: 'Fertig',
  'Download failed': 'Download fehlgeschlagen',
  'Download started': 'Download gestartet',
  'Download the result as plain text, SRT or VTT subtitles, Markdown or JSON.':
    'Laden Sie das Ergebnis als Nur-Text, als SRT- oder VTT-Untertitel, als Markdown oder als JSON herunter.',
  'Download the transcript as': 'Transkript herunterladen als',
  'Downloading the speech model (first time only): {loaded} of {total}':
    'Sprachmodell wird heruntergeladen (nur beim ersten Mal): {loaded} von {total}',
  'Drop a video or audio file on the [home page](/), or record from your microphone.':
    'Legen Sie eine Video- oder Audiodatei auf der [Startseite](/) ab oder nehmen Sie mit Ihrem Mikrofon auf.',
  'Drop to add your file': 'Zum Hinzufügen der Datei hier ablegen',
  'Drop your {noun} here, or choose a file': '{noun} hier ablegen oder auswählen',
  'Each line with its time, like [00:12]': 'Jede Zeile mit ihrer Zeit, etwa [00:12]',
  Edit: 'Bearbeiten',
  'Edit it right here': 'Direkt hier bearbeiten',
  'Edit this line': 'Diese Zeile bearbeiten',
  'Edited by you': 'Von Ihnen bearbeitet',
  'English only, very fast and accurate': 'Nur Englisch, sehr schnell und genau',
  'English translation is selected in More options.':
    'Die englische Übersetzung ist unter „Weitere Optionen“ ausgewählt.',
  'Enter saves · Esc cancels': 'Eingabe speichert · Esc bricht ab',
  'Every line has a time. Play the media from any line to hear what was said.':
    'Jede Zeile hat eine Zeit. Spielen Sie die Medien ab einer beliebigen Zeile ab, um zu hören, was gesagt wurde.',
  'Every page does the same job: it turns the speech in a video or audio file into text with a timestamp on each line, in more than 50 languages, with no sign-up. Pick the one that matches the file you have or what you want to make.':
    'Jede Seite erfüllt dieselbe Aufgabe: Sie wandelt die Sprache in einer Video- oder Audiodatei in Text mit einem Zeitstempel pro Zeile um, in mehr als 50 Sprachen und ohne Registrierung. Wählen Sie die Seite, die zu Ihrer Datei oder zu Ihrem Vorhaben passt.',
  'Experimental: compare on your audio; chunk timestamps':
    'Experimentell: Vergleichen Sie es mit Ihrem Audio; Zeitstempel pro Abschnitt',
  'Experimental: larger model; chunk timestamps':
    'Experimentell: größeres Modell; Zeitstempel pro Abschnitt',
  Export: 'Exportieren',
  Failed: 'Fehlgeschlagen',
  FAQ: 'FAQ',
  Fast: 'Schnell',
  'Fast, clean audio': 'Schnell, sauberes Audio',
  Fastest: 'Am schnellsten',
  'Fastest, rough drafts only': 'Am schnellsten, nur für grobe Entwürfe',
  'Fewer mistakes. Takes longer.': 'Weniger Fehler. Dauert länger.',
  'Fewest mistakes. Takes the longest.': 'Die wenigsten Fehler. Dauert am längsten.',
  'File "{name}" is {size}; the limit is {limit} - set VT_MAX_UPLOAD_MB to raise it':
    'Die Datei „{name}“ ist {size} groß; das Limit beträgt {limit} – setzen Sie VT_MAX_UPLOAD_MB, um es zu erhöhen',
  'File "{name}" is {size}; the limit is {limit}.':
    'Die Datei „{name}“ ist {size} groß; das Limit beträgt {limit}.',
  'file {n} of {total}': 'Datei {n} von {total}',
  'File added': 'Datei hinzugefügt',
  'File limits.': 'Dateigrenzen.',
  'File not added': 'Datei nicht hinzugefügt',
  'File skipped': 'Datei übersprungen',
  'Files and transcripts exist only for your session. Export what you need before you leave. The only thing we keep is one anonymous running total of how many files have been transcribed on the site (a single number, shown in the page header); it is not linked to you, your files or your session. Details are in the [Privacy policy](/privacy).':
    'Dateien und Transkripte existieren nur für Ihre Sitzung. Exportieren Sie, was Sie brauchen, bevor Sie gehen. Das Einzige, was wir behalten, ist eine anonyme laufende Gesamtzahl der auf der Website transkribierten Dateien (eine einzelne Zahl, die im Seitenkopf angezeigt wird); sie ist weder mit Ihnen noch mit Ihren Dateien oder Ihrer Sitzung verknüpft. Einzelheiten stehen in der [Datenschutzerklärung](/privacy).',
  'Find it automatically': 'Automatisch finden',
  'first time only, also downloads the {size} MB word-timing model':
    'nur beim ersten Mal, lädt auch das Zeitmarken-Modell ({size} MB) herunter',
  'First time only: downloads {size} (needs internet)':
    'Nur beim ersten Mal: lädt {size} herunter (Internet nötig)',
  'Follow playback': 'Wiedergabe folgen',
  'Following playback': 'Folgt der Wiedergabe',
  Footer: 'Fußzeile',
  'For accented or mixed-language speech, try a higher quality setting. The confidence score is not an accuracy percentage.':
    'Probieren Sie bei Sprache mit Akzent oder gemischten Sprachen eine höhere Qualitätsstufe. Der Konfidenzwert ist kein Prozentwert der Genauigkeit.',
  'For developers: words, times, confidence': 'Für Entwickler: Wörter, Zeiten, Konfidenz',
  'For notes apps': 'Für Notiz-Apps',
  'For video players and editors': 'Für Videoplayer und Editoren',
  'For YouTube and web video': 'Für YouTube und Web-Video',
  Free: 'Kostenlos',
  'Free tools': 'Kostenlose Tools',
  'Free tools:': 'Kostenlose Tools:',
  'Free video and audio to text': 'Kostenlos Video und Audio zu Text',
  'Free video and audio to text, right in your browser':
    'Kostenlos Video und Audio zu Text, direkt in Ihrem Browser',
  'Free, unlimited, and no login needed': 'Kostenlos, unbegrenzt und ohne Anmeldung',
  'Free, unlimited, no login': 'Kostenlos, unbegrenzt, ohne Anmeldung',
  'Frequently asked questions': 'Häufig gestellte Fragen',
  'Get in touch': 'Kontakt aufnehmen',
  'Getting the speech engine ready…': 'Die Spracherkennung wird vorbereitet …',
  'Give it a new name': 'Neuen Namen vergeben',
  'Go to the home page': 'Zur Startseite',
  'Go to Video to text': 'Zu „Video zu Text“',
  'Good balance (default)': 'Gute Balance (Voreinstellung)',
  'Good to know': 'Gut zu wissen',
  "Google's consent tool could not be loaded, probably because an ad blocker or the network stopped it. Without it no ads and no ad cookies are loaded.":
    'Das Einwilligungstool von Google konnte nicht geladen werden, wahrscheinlich weil ein Werbeblocker oder das Netzwerk es verhindert hat. Ohne es werden weder Werbung noch Werbe-Cookies geladen.',
  Guides: 'Ratgeber',
  'Guides: transcripts and subtitles': 'Ratgeber: Transkripte und Untertitel',
  'Have a question, found a bug or want to suggest a feature? Write to {email}. Every message is read by the person who builds {brand}, and you will usually get an answer within a few working days.':
    'Haben Sie eine Frage, einen Fehler gefunden oder möchten Sie eine Funktion vorschlagen? Schreiben Sie an {email}. Jede Nachricht wird von der Person gelesen, die {brand} entwickelt, und meist erhalten Sie innerhalb weniger Werktage eine Antwort.',
  'Helps spell uncommon words correctly.':
    'Hilft dabei, ungewöhnliche Wörter richtig zu schreiben.',
  'High accuracy': 'Hohe Genauigkeit',
  'High accuracy (Large v3 Turbo) was not trained to translate and may give you the original language. For translation choose Standard or Best accuracy.':
    '„Hohe Genauigkeit“ (Large v3 Turbo) wurde nicht für Übersetzungen trainiert und gibt unter Umständen die Originalsprache aus. Wählen Sie für Übersetzungen „Standard“ oder „Beste Genauigkeit“.',
  'High accuracy, slower': 'Hohe Genauigkeit, langsamer',
  'Higher is slightly more accurate and slower. 5 is a good default.':
    'Höher ist etwas genauer und langsamer. 5 ist ein guter Standardwert.',
  'Hindi in English letters, with English words preserved. Other languages keep their original script. Review unfamiliar words and names.':
    'Hindi in lateinischen Buchstaben, englische Wörter bleiben erhalten. Andere Sprachen behalten ihre Originalschrift. Prüfen Sie ungewohnte Wörter und Namen.',
  'Hinglish (Roman Hindi)': 'Hinglish (Hindi in lateinischer Schrift)',
  'Hinglish conversion': 'Hinglish-Umwandlung',
  History: 'Verlauf',
  Home: 'Startseite',
  'How {brand} works': 'So funktioniert {brand}',
  'How accurate is it?': 'Wie genau ist es?',
  'How do I get better accuracy?': 'Wie erreiche ich eine bessere Genauigkeit?',
  'How it stays free': 'Wie es kostenlos bleibt',
  'How it works': 'So funktioniert es',
  'How long does it take?': 'Wie lange dauert es?',
  'How to transcribe a video to text': 'So transkribieren Sie ein Video in Text',
  'How to turn a video or audio file into text with {brand}':
    'So wandeln Sie eine Video- oder Audiodatei mit {brand} in Text um',
  'If it does have speech, try More › Re-transcribe with the right language.':
    'Wenn doch Sprache vorhanden ist, probieren Sie „Mehr“ › „Erneut transkribieren“ mit der richtigen Sprache.',
  'If the service is busy or too many transcripts are already running, it asks you to wait and says why.':
    'Wenn der Dienst ausgelastet ist oder bereits zu viele Transkripte laufen, bittet er Sie zu warten und nennt den Grund.',
  'If we change this policy, the new version appears on this page with a new "Last updated" date.':
    'Wenn wir diese Erklärung ändern, erscheint die neue Fassung auf dieser Seite mit einem neuen Datum bei „Zuletzt aktualisiert“.',
  "In the EEA, the UK and Switzerland, and in some US states, Google's certified consent message asks for your choice when ads load.":
    'Im EWR, im Vereinigten Königreich, in der Schweiz und in einigen US-Bundesstaaten fragt die zertifizierte Einwilligungsmeldung von Google beim Laden von Werbung nach Ihrer Entscheidung.',
  'IndicXlit (trained model)': 'IndicXlit (trainiertes Modell)',
  'Is it really free and unlimited? Do I need to log in?':
    'Ist es wirklich kostenlos und unbegrenzt? Muss ich mich anmelden?',
  'Is my data private?': 'Sind meine Daten privat?',
  'It depends on the quality you pick, the length of the file and how busy the service is. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live, and a file waiting for its turn shows "Waiting in queue".':
    'Es hängt von der gewählten Qualität, der Länge der Datei und der Auslastung des Dienstes ab. „Am schnellsten“ ist flott; „Beste Genauigkeit“ dauert am längsten, macht aber die wenigsten Fehler. Fortschritt und verbleibende Zeit werden live angezeigt, und eine Datei, die auf ihren Zug wartet, zeigt „Wartet in der Warteschlange“.',
  'It depends on your device, the quality you pick and the length of the file. With a capable graphics chip (WebGPU) it is fastest; otherwise it runs on the processor (WebAssembly), which is slower. Fastest is quick; Best accuracy takes longest but makes the fewest mistakes. Progress and the time left are shown live.':
    'Es hängt von Ihrem Gerät, der gewählten Qualität und der Länge der Datei ab. Mit einem leistungsfähigen Grafikchip (WebGPU) ist es am schnellsten; sonst läuft es auf dem Prozessor (WebAssembly), was langsamer ist. „Am schnellsten“ ist flott; „Beste Genauigkeit“ dauert am längsten, macht aber die wenigsten Fehler. Fortschritt und verbleibende Zeit werden live angezeigt.',
  'It is now called “{title}”.': 'Es heißt jetzt „{title}“.',
  'It may have been deleted.': 'Es wurde möglicherweise gelöscht.',
  'It was stopped before any text was found.': 'Es wurde gestoppt, bevor Text gefunden wurde.',
  'Its data was deleted, including this transcript. Transcripts are only kept for the session that created them.':
    'Seine Daten wurden gelöscht, einschließlich dieses Transkripts. Transkripte werden nur für die Sitzung aufbewahrt, die sie erstellt hat.',
  'Job not found': 'Transkript nicht gefunden',
  'JSON (.json)': 'JSON (.json)',
  'just now': 'gerade eben',
  'Just the words, in paragraphs': 'Nur die Wörter, in Absätzen',
  'Keep reading': 'Weiterlesen',
  'Keep this page open until the upload is done.':
    'Lassen Sie diese Seite geöffnet, bis der Upload abgeschlossen ist.',
  'Kept only for this session, then deleted automatically.':
    'Nur für diese Sitzung gespeichert, danach automatisch gelöscht.',
  Language: 'Sprache',
  'Larger or longer files are refused before they are processed, so split them first.':
    'Größere oder längere Dateien werden vor der Verarbeitung abgelehnt, teilen Sie sie daher vorher auf.',
  'Last updated: {date}': 'Zuletzt aktualisiert: {date}',
  'Licence text': 'Lizenztext',
  Light: 'Hell',
  'Limits.': 'Grenzen.',
  'Line deleted': 'Zeile gelöscht',
  'Live: the text appears here as it is recognised':
    'Live: Der Text erscheint hier, sobald er erkannt wird',
  'Loading model… (first use downloads it)':
    'Modell wird geladen … (beim ersten Mal wird es heruntergeladen)',
  'Loading…': 'Wird geladen …',
  'Long (56 letters)': 'Lang (56 Zeichen)',
  'Longer answers: formats, subtitles, accuracy and privacy.':
    'Ausführlichere Antworten: Formate, Untertitel, Genauigkeit und Datenschutz.',
  Main: 'Hauptnavigation',
  'Make a new transcript of the same file. This one is kept.':
    'Ein neues Transkript derselben Datei erstellen. Dieses bleibt erhalten.',
  'Make a subtitle file (SRT or VTT) from your video.':
    'Erstellen Sie aus Ihrem Video eine Untertiteldatei (SRT oder VTT).',
  'Markdown (.md)': 'Markdown (.md)',
  Menu: 'Menü',
  Model: 'Modell',
  More: 'Mehr',
  'More answers: [Frequently asked questions](/faq)':
    'Weitere Antworten: [Häufig gestellte Fragen](/faq)',
  'More free tools': 'Weitere kostenlose Tools',
  'More options': 'Weitere Optionen',
  'More than 50 languages': 'Mehr als 50 Sprachen',
  'More than 50 languages, including English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Arabic, Hindi, Chinese, Japanese and Korean. Leave the language on auto-detect or choose it yourself. You can also translate speech into English.':
    'Mehr als 50 Sprachen, darunter Englisch, Spanisch, Französisch, Deutsch, Portugiesisch, Italienisch, Niederländisch, Russisch, Arabisch, Hindi, Chinesisch, Japanisch und Koreanisch. Lassen Sie die Sprache automatisch erkennen oder wählen Sie sie selbst. Sie können Sprache auch ins Englische übersetzen.',
  'Most transcription websites ask you to create an account, limit the free minutes, add watermarks or push a subscription before you see a single line of text. {brand} does the opposite. Everything it offers is available to everyone, and the page asks for nothing but your file.':
    'Die meisten Transkriptions-Websites verlangen ein Konto, begrenzen die kostenlosen Minuten, fügen Wasserzeichen hinzu oder drängen zu einem Abo, bevor Sie auch nur eine Zeile Text sehen. {brand} macht es umgekehrt. Alles, was es bietet, steht jedem zur Verfügung, und die Seite verlangt nichts außer Ihrer Datei.',
  'Name not changed': 'Name nicht geändert',
  'Names, brands and jargon in the audio, e.g. Kubernetes, Dr. Okafor':
    'Namen, Marken und Fachbegriffe im Audio, z. B. Kubernetes, Dr. Okafor',
  'Near-best accuracy, much faster than Large': 'Fast beste Genauigkeit, viel schneller als Large',
  'needs 16-bit shader support (shader-f16) in the graphics driver':
    'benötigt 16-Bit-Shader-Unterstützung (shader-f16) im Grafiktreiber',
  'needs 4 GB': 'braucht 4 GB',
  'needs 8 GB': 'braucht 8 GB',
  'needs a graphics-capable browser (Chrome, Edge)':
    'benötigt einen grafikfähigen Browser (Chrome, Edge)',
  'needs WebGPU': 'benötigt WebGPU',
  'Next match': 'Nächster Treffer',
  'No account and no tracking. Your files are kept only for your session and deleted automatically.':
    'Kein Konto und kein Tracking. Ihre Dateien werden nur für Ihre Sitzung aufbewahrt und automatisch gelöscht.',
  'no estimate for this model here': 'hier keine Schätzung für dieses Modell',
  'No login': 'Ohne Anmeldung',
  'No matches': 'Keine Treffer',
  'No microphone': 'Kein Mikrofon',
  'No sign-up, no payment, no daily limit. Just add your file.':
    'Keine Registrierung, keine Zahlung, kein Tageslimit. Fügen Sie einfach Ihre Datei hinzu.',
  'No size or length limit is announced by the server right now. Very large files simply take longer.':
    'Der Server gibt derzeit keine Größen- oder Längenbegrenzung bekannt. Sehr große Dateien dauern einfach länger.',
  'No speech was found in this file.': 'In dieser Datei wurde keine Sprache gefunden.',
  'No speech was transcribed.': 'Es wurde keine Sprache transkribiert.',
  'No speech was transcribed. Check the recording and the selected language.':
    'Es wurde keine Sprache transkribiert. Prüfen Sie die Aufnahme und die gewählte Sprache.',
  'No WebGPU here: models run on one CPU thread, so larger sizes are slower than real time.':
    'Hier gibt es kein WebGPU: Die Modelle laufen auf einem CPU-Thread, daher sind größere Stufen langsamer als in Echtzeit.',
  "Nobody else's files are ahead of yours. If you add several files, they are transcribed one after another in your tab, so keep the tab open until they are done.":
    'Keine fremden Dateien sind vor Ihrer an der Reihe. Wenn Sie mehrere Dateien hinzufügen, werden sie in Ihrem Tab nacheinander transkribiert, lassen Sie den Tab also geöffnet, bis sie fertig sind.',
  'None of those are video or audio files.': 'Keine davon ist eine Video- oder Audiodatei.',
  Normal: 'Normal',
  'not available for this size': 'für diese Größe nicht verfügbar',
  'not available in this browser': 'in diesem Browser nicht verfügbar',
  'not available with Qwen (times are per chunk)':
    'mit Qwen nicht verfügbar (Zeiten gelten pro Abschnitt)',
  'Not cancelled': 'Nicht abgebrochen',
  'Not deleted': 'Nicht gelöscht',
  'Not renamed': 'Nicht umbenannt',
  'Not saved': 'Nicht gespeichert',
  Note: 'Hinweis',
  'Nothing here yet. Transcripts you create appear here for this session.':
    'Noch nichts vorhanden. Transkripte, die Sie erstellen, erscheinen hier für diese Sitzung.',
  'Nothing is saved. Export what you need.':
    'Es wird nichts gespeichert. Exportieren Sie, was Sie brauchen.',
  'Nothing is uploaded until you press Transcribe.':
    'Es wird nichts hochgeladen, bis Sie auf Transkribieren drücken.',
  'Nothing to sign up for and nothing to pay. Just add your file.':
    'Keine Registrierung, keine Kosten. Fügen Sie einfach Ihre Datei hinzu.',
  'Nothing was recorded.': 'Es wurde nichts aufgenommen.',
  Off: 'Aus',
  On: 'An',
  'On clear speech in a supported language it is usually very accurate, but no speech recognition is perfect. Accuracy depends on the audio quality, accents, background noise, overlapping speakers, music, and rare names or jargon. Every line has a confidence score, and low-confidence lines are marked so you can check them first. Always verify a transcript before relying on it for anything important.':
    'Bei klarer Sprache in einer unterstützten Sprache ist sie meist sehr genau, aber keine Spracherkennung ist perfekt. Die Genauigkeit hängt von Audioqualität, Akzenten, Hintergrundgeräuschen, überlappenden Sprechern, Musik sowie seltenen Namen oder Fachbegriffen ab. Jede Zeile hat einen Konfidenzwert, und Zeilen mit niedriger Konfidenz sind markiert, damit Sie sie zuerst prüfen können. Prüfen Sie ein Transkript immer, bevor Sie sich bei etwas Wichtigem darauf verlassen.',
  'Open menu': 'Menü öffnen',
  'Opening your transcript…': 'Ihr Transkript wird geöffnet …',
  'or drop it anywhere on this page.': 'oder legen Sie sie irgendwo auf dieser Seite ab.',
  'Original script': 'Originalschrift',
  Output: 'Ausgabe',
  'Page {page} of {pages}': 'Seite {page} von {pages}',
  'Page not found': 'Seite nicht gefunden',
  'Pages for the file you already have: WAV, M4A, WebM and MOV.':
    'Seiten für die Datei, die Sie schon haben: WAV, M4A, WebM und MOV.',
  'PDF document (.pdf)': 'PDF-Dokument (.pdf)',
  'PDF is made by your browser: choose "Save as PDF" in the print dialog.':
    'Das PDF erstellt Ihr Browser: Wählen Sie im Druckdialog „Als PDF speichern“.',
  'Pick quality': 'Qualität wählen',
  'Plain text (.txt)': 'Nur-Text (.txt)',
  'Play from here': 'Ab hier abspielen',
  'Playback speed': 'Wiedergabegeschwindigkeit',
  'Please add one file at a time here. You can add more files on the next page.':
    'Bitte fügen Sie hier jeweils nur eine Datei hinzu. Weitere Dateien können Sie auf der nächsten Seite hinzufügen.',
  'Please do not send private recordings. {brand} transcribes your files on your own device and we never receive them, so we do not need them to help you.':
    'Bitte senden Sie keine privaten Aufnahmen. {brand} transkribiert Ihre Dateien auf Ihrem eigenen Gerät, und wir erhalten sie nie, wir brauchen sie also nicht, um Ihnen zu helfen.',
  'Please note': 'Bitte beachten',
  Preparing: 'Wird vorbereitet',
  'Preparing audio…': 'Audio wird vorbereitet …',
  'Preparing the audio…': 'Das Audio wird vorbereitet …',
  'Preparing…': 'Wird vorbereitet …',
  'Press a question to read its answer.': 'Tippen Sie auf eine Frage, um die Antwort zu lesen.',
  'Previous match': 'Vorheriger Treffer',
  'Print to PDF': 'Als PDF drucken',
  Privacy: 'Datenschutz',
  'Privacy and cookie settings': 'Datenschutz- und Cookie-Einstellungen',
  'Privacy policy': 'Datenschutzerklärung',
  'Privacy requests': 'Datenschutzanfragen',
  Private: 'Privat',
  Progress: 'Fortschritt',
  Quality: 'Qualität',
  'Questions about these terms:': 'Fragen zu diesen Bedingungen:',
  'Questions, bug reports and ideas are always welcome. Write to {email}, or see the [Contact](/contact) page for what to include.':
    'Fragen, Fehlermeldungen und Ideen sind jederzeit willkommen. Schreiben Sie an {email} oder lesen Sie auf der Seite [Kontakt](/contact), was Sie angeben sollten.',
  Queued: 'In der Warteschlange',
  'Quick results. Good for clear speech.': 'Schnelle Ergebnisse. Gut für klare Sprache.',
  Quickest: 'Sehr schnell',
  'Qwen uses approximate chunk timestamps. Word timing and confidence are unavailable.':
    'Qwen verwendet ungefähre Zeitstempel pro Abschnitt. Wortzeiten und Konfidenz sind nicht verfügbar.',
  'Qwen uses chunk timestamps and does not provide word confidence. Compare a short sample before choosing it.':
    'Qwen verwendet Zeitstempel pro Abschnitt und liefert keine Konfidenz pro Wort. Vergleichen Sie eine kurze Probe, bevor Sie es wählen.',
  'Qwen3 ASR (experimental)': 'Qwen3 ASR (experimentell)',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 16-bit shader support (shader-f16) in the graphics driver.':
    'Qwen3-ASR benötigt einen Desktop-Browser mit WebGPU (Chrome oder Edge) und 16-Bit-Shader-Unterstützung (shader-f16) im Grafiktreiber.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge) and 8 GB of memory.':
    'Qwen3-ASR benötigt einen Desktop-Browser mit WebGPU (Chrome oder Edge) und 8 GB Arbeitsspeicher.',
  'Qwen3-ASR needs a desktop browser with WebGPU (Chrome or Edge).':
    'Qwen3-ASR benötigt einen Desktop-Browser mit WebGPU (Chrome oder Edge).',
  'Re-transcribe': 'Erneut transkribieren',
  'Read the transcript with timestamps, see which words the model was unsure of, and correct them in place.':
    'Lesen Sie das Transkript mit Zeitstempeln, sehen Sie, bei welchen Wörtern sich das Modell unsicher war, und korrigieren Sie sie direkt.',
  'Read, edit, download': 'Lesen, bearbeiten, herunterladen',
  Ready: 'Bereit',
  'Ready to print or share': 'Bereit zum Drucken oder Teilen',
  'Ready to try it? [See all free tools](/tools) or [transcribe a file now](/).':
    'Bereit zum Ausprobieren? [Alle kostenlosen Tools ansehen](/tools) oder [jetzt eine Datei transkribieren](/).',
  'Recognition engine': 'Erkennungsmodul',
  Recommended: 'Empfohlen',
  'Record from microphone': 'Vom Mikrofon aufnehmen',
  'Record straight from your microphone and turn it into text.':
    'Nehmen Sie direkt über Ihr Mikrofon auf und wandeln Sie die Aufnahme in Text um.',
  'Record with your microphone': 'Mit dem Mikrofon aufnehmen',
  'Recording {stamp}': 'Aufnahme {stamp}',
  'Recording is not supported by this browser.':
    'Aufnahmen werden von diesem Browser nicht unterstützt.',
  'Related reading': 'Weiterführende Lektüre',
  Remove: 'Entfernen',
  'Remove {name}': '{name} entfernen',
  'Removes it for good': 'Entfernt es endgültig',
  Rename: 'Umbenennen',
  Renamed: 'Umbenannt',
  'Replace "{query}" with "{replacement}" in {n} lines?':
    '„{query}“ in {n} Zeilen durch „{replacement}“ ersetzen?',
  'Replace "{query}" with "{replacement}" in 1 line?':
    '„{query}“ in 1 Zeile durch „{replacement}“ ersetzen?',
  'Replace in {n} lines': 'In {n} Zeilen ersetzen',
  'Replace in 1 line': 'In 1 Zeile ersetzen',
  'Replace with': 'Ersetzen durch',
  'Replace with…': 'Ersetzen durch …',
  'Replace…': 'Ersetzen …',
  Replaced: 'Ersetzt',
  'Reporting a problem': 'Ein Problem melden',
  'Retrying…': 'Neuer Versuch …',
  'Review language and quality': 'Sprache und Qualität prüfen',
  'Review this transcript': 'Dieses Transkript prüfen',
  Save: 'Speichern',
  Saved: 'Gespeichert',
  'Saving…': 'Wird gespeichert …',
  'Search depth: {n}': 'Suchtiefe: {n}',
  'Search the text': 'Im Text suchen',
  'Search the transcript': 'Im Transkript suchen',
  'See also the [Terms of use](/terms), [How it works](/how-it-works) and the [FAQ](/faq).':
    'Siehe auch die [Nutzungsbedingungen](/terms), [So funktioniert es](/how-it-works) und die [FAQ](/faq).',
  'Server busy': 'Server ausgelastet',
  'Session only — nothing is saved.': 'Nur Sitzung – nichts wird gespeichert.',
  'Session only — nothing is saved. Closing the app erases all transcripts. Export what you need.':
    'Nur Sitzung – nichts wird gespeichert. Beim Schließen der App werden alle Transkripte gelöscht. Exportieren Sie, was Sie brauchen.',
  'Session time left: about {n} min': 'Verbleibende Sitzungszeit: etwa {n} Min.',
  'Short (32 letters)': 'Kurz (32 Zeichen)',
  'Short, practical answers about turning speech into text and subtitles: which subtitle format to pick, how to add subtitles to a video, how to get a more accurate transcript, and how transcription can run in your own browser without uploading your file.':
    'Kurze, praktische Antworten zur Umwandlung von Sprache in Text und Untertitel: welches Untertitelformat Sie wählen, wie Sie einem Video Untertitel hinzufügen, wie Sie ein genaueres Transkript erhalten und wie Transkription in Ihrem eigenen Browser laufen kann, ohne dass Ihre Datei hochgeladen wird.',
  'Show all {count} languages': 'Alle {count} Sprachen anzeigen',
  'Six ways to download': 'Sechs Möglichkeiten zum Herunterladen',
  'Skip to main content': 'Zum Hauptinhalt springen',
  Slower: 'Langsamer',
  'slower than real time on the measured laptop':
    'langsamer als in Echtzeit auf dem gemessenen Laptop',
  Slowest: 'Am langsamsten',
  'Some features download open-source components into your browser when you use them. They run on your device like the rest of the engine. Their licences ask us to show these notices:':
    'Einige Funktionen laden bei Nutzung Open-Source-Komponenten in Ihren Browser herunter. Sie laufen wie der Rest der Engine auf Ihrem Gerät. Ihre Lizenzen verlangen von uns, diese Hinweise anzuzeigen:',
  'Some passages need a listening check because of repeated text or an uncertain speech boundary.':
    'Einige Passagen sollten Sie wegen wiederholten Texts oder einer unsicheren Sprachgrenze noch einmal anhören.',
  'Something went wrong': 'Etwas ist schiefgelaufen',
  'Something went wrong in this browser. Please try again.':
    'In diesem Browser ist etwas schiefgelaufen. Bitte versuchen Sie es erneut.',
  'Something went wrong while reading this file.':
    'Beim Lesen dieser Datei ist etwas schiefgelaufen.',
  'Source code': 'Quellcode',
  Speed: 'Geschwindigkeit',
  'Speeds on phones and tablets are estimated, not measured; tiny and base are the safe sizes.':
    'Geschwindigkeiten auf Smartphones und Tablets sind geschätzt, nicht gemessen; Tiny und Base sind die sicheren Stufen.',
  'SRT and VTT for subtitles, TXT and Markdown for reading, JSON for programs, or a PDF to print.':
    'SRT und VTT für Untertitel, TXT und Markdown zum Lesen, JSON für Programme oder ein PDF zum Drucken.',
  Standard: 'Standard',
  'Standard (42 letters)': 'Standard (42 Zeichen)',
  Start: 'Starten',
  'Start a new transcription': 'Neue Transkription starten',
  'Start again': 'Erneut starten',
  'Started again': 'Erneut gestartet',
  'Starting…': 'Wird gestartet …',
  'Still have a question? Read the [frequently asked questions](/faq), see [how it works](/how-it-works), or [contact us](/contact).':
    'Noch eine Frage? Lesen Sie die [häufig gestellten Fragen](/faq), sehen Sie nach, [wie es funktioniert](/how-it-works), oder [kontaktieren Sie uns](/contact).',
  'Still stuck? [Read How it works](/how-it-works)':
    'Nicht weitergekommen? [„So funktioniert es“ lesen](/how-it-works)',
  'Stop recording · {time}': 'Aufnahme beenden · {time}',
  'Stop this transcription? The text found so far is kept.':
    'Diese Transkription stoppen? Der bisher gefundene Text bleibt erhalten.',
  'Stopping the transcription worker. The text found so far is kept.':
    'Die Transkription wird gestoppt. Der bisher gefundene Text bleibt erhalten.',
  'Stored on this device only, never uploaded.':
    'Nur auf diesem Gerät gespeichert, nie hochgeladen.',
  'Style unchanged': 'Stil unverändert',
  'Style updated': 'Stil aktualisiert',
  'Style updated using the saved recognition. Edited lines are kept.':
    'Stil mit der gespeicherten Erkennung aktualisiert. Bearbeitete Zeilen bleiben erhalten.',
  'Subtitle files': 'Untertiteldateien',
  'Subtitle line length': 'Länge der Untertitelzeilen',
  'Subtitles (.srt)': 'Untertitel (.srt)',
  'Switch to dark theme': 'Zum dunklen Design wechseln',
  'Switch to light theme': 'Zum hellen Design wechseln',
  Terms: 'Bedingungen',
  'Terms of use': 'Nutzungsbedingungen',
  'Text with times (.txt)': 'Text mit Zeiten (.txt)',
  'That file is already in the list.': 'Diese Datei ist bereits in der Liste.',
  'That is not a video or audio file. Choose an MP4, MOV, MP3 or another video or audio file.':
    'Das ist keine Video- oder Audiodatei. Wählen Sie eine MP4-, MOV- oder MP3-Datei oder eine andere Video- oder Audiodatei.',
  'That is not a video or audio file. Please choose a video or audio file.':
    'Das ist keine Video- oder Audiodatei. Bitte wählen Sie eine Video- oder Audiodatei aus.',
  'That is not an audio file. Choose an MP3, WAV, M4A or another audio file.':
    'Das ist keine Audiodatei. Wählen Sie eine MP3-, WAV- oder M4A-Datei oder eine andere Audiodatei.',
  'The [Privacy policy](/privacy) explains what is processed and why. To ask a question about your data or to exercise your rights, write to the same address.':
    'Die [Datenschutzerklärung](/privacy) erklärt, was verarbeitet wird und warum. Wenn Sie eine Frage zu Ihren Daten haben oder Ihre Rechte ausüben möchten, schreiben Sie an dieselbe Adresse.',
  'The {label} model cannot run on this device: {reason}. Choose another one.':
    'Das Modell „{label}“ kann auf diesem Gerät nicht laufen: {reason}. Wählen Sie ein anderes.',
  'the exact error message, or a screenshot of it.':
    'die genaue Fehlermeldung oder einen Screenshot davon.',
  'The file is larger than the server accepts.': 'Die Datei ist größer, als der Server annimmt.',
  'The first time you use a quality level, your browser downloads its speech model once and keeps it for next time, so later files start sooner.':
    'Wenn Sie eine Qualitätsstufe zum ersten Mal nutzen, lädt Ihr Browser ihr Sprachmodell einmal herunter und behält es für das nächste Mal, sodass spätere Dateien schneller starten.',
  "The first time you use a quality level, your browser downloads the speech model from Hugging Face and the engine's program files from jsDelivr, and keeps them for next time; nothing of your file is sent with them. When a transcription finishes, your browser adds one to the anonymous counter in the page header, and nothing else.":
    'Wenn Sie eine Qualitätsstufe zum ersten Mal nutzen, lädt Ihr Browser das Sprachmodell von Hugging Face und die Programmdateien der Engine von jsDelivr herunter und behält sie für das nächste Mal; von Ihrer Datei wird dabei nichts gesendet. Wenn eine Transkription fertig ist, erhöht Ihr Browser den anonymen Zähler im Seitenkopf um eins, sonst nichts.',
  'The graphics driver has no 16-bit shaders: downloads are larger and memory use higher.':
    'Der Grafiktreiber hat keine 16-Bit-Shader: Die Downloads sind größer und der Speicherverbrauch ist höher.',
  'The line was removed.': 'Die Zeile wurde entfernt.',
  'The main tools: turn any video or audio file into a timestamped transcript.':
    'Die wichtigsten Tools: Wandeln Sie jede Video- oder Audiodatei in ein Transkript mit Zeitstempeln um.',
  'The page you are looking for does not exist or has moved.':
    'Die gesuchte Seite existiert nicht oder wurde verschoben.',
  'The recording failed. Please try again.':
    'Die Aufnahme ist fehlgeschlagen. Bitte versuchen Sie es erneut.',
  'The server does not have enough free disk space for this file.':
    'Der Server hat nicht genug freien Speicherplatz für diese Datei.',
  'The server is busy': 'Der Server ist ausgelastet',
  'The server is busy right now.': 'Der Server ist gerade ausgelastet.',
  'The service is busy right now. Please wait a moment and try again.':
    'Der Dienst ist gerade ausgelastet. Bitte warten Sie einen Moment und versuchen Sie es erneut.',
  'The service is full right now. Please try again in a little while.':
    'Der Dienst ist gerade voll. Bitte versuchen Sie es in einer Weile erneut.',
  "The speech recognition runs inside your own browser, using open speech recognition models such as OpenAI Whisper. Your browser downloads the model once and keeps it, then does all the work on your device. Your video or audio is never uploaded to us, which is also why there is no file size limit and no queue of other people's files. The [How it works](/how-it-works) page explains each step.":
    'Die Spracherkennung läuft direkt in Ihrem Browser und nutzt offene Spracherkennungsmodelle wie OpenAI Whisper. Ihr Browser lädt das Modell einmal herunter und behält es, dann erledigt er die gesamte Arbeit auf Ihrem Gerät. Ihr Video oder Audio wird nie zu uns hochgeladen, weshalb es auch keine Dateigrößenbegrenzung und keine Warteschlange mit den Dateien anderer Leute gibt. Die Seite [So funktioniert es](/how-it-works) erklärt jeden Schritt.',
  'The spoken language could not be identified confidently. Choose the language you hear and try again.':
    'Die gesprochene Sprache konnte nicht sicher erkannt werden. Wählen Sie die Sprache, die Sie hören, und versuchen Sie es erneut.',
  'The text found before it was stopped is shown below.':
    'Der bis zum Stopp gefundene Text wird unten angezeigt.',
  'The text found so far is kept.': 'Der bisher gefundene Text bleibt erhalten.',
  'The text is ready to paste.': 'Der Text ist bereit zum Einfügen.',
  'The transcript finished before it could be cancelled.':
    'Das Transkript war fertig, bevor es abgebrochen werden konnte.',
  'The transcription runs on your own device with open speech recognition models such as OpenAI Whisper. Your browser downloads a model once and keeps it, so the next file starts faster, and your video or audio is never uploaded anywhere.':
    'Die Transkription läuft auf Ihrem eigenen Gerät mit offenen Spracherkennungsmodellen wie OpenAI Whisper. Ihr Browser lädt ein Modell einmal herunter und behält es, sodass die nächste Datei schneller startet, und Ihr Video oder Audio wird nirgendwohin hochgeladen.',
  'the type and length of the file, for example "MP4, 25 minutes";':
    'Typ und Länge der Datei, zum Beispiel „MP4, 25 Minuten“;',
  'There is no size or length limit set here.':
    'Hier ist keine Größen- oder Längenbegrenzung festgelegt.',
  'These details make a problem much quicker to find and fix:':
    'Mit diesen Angaben lässt sich ein Problem viel schneller finden und beheben:',
  'These terms are governed by the laws of India. The courts of Bengaluru, Karnataka, India have exclusive jurisdiction over any dispute arising from them. This does not take away any protection you have under the mandatory consumer laws of the country where you live.':
    'Diese Bedingungen unterliegen dem Recht Indiens. Die Gerichte in Bengaluru, Karnataka, Indien, sind für alle daraus entstehenden Streitigkeiten ausschließlich zuständig. Dadurch entfällt kein Schutz, den Sie nach den zwingenden Verbraucherschutzgesetzen des Landes haben, in dem Sie leben.',
  'They are downloaded again the next time you transcribe.':
    'Sie werden beim nächsten Transkribieren erneut heruntergeladen.',
  "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.":
    'Drittanbieter, darunter Google, verwenden Cookies, um Werbung auf Grundlage Ihrer früheren Besuche dieser oder anderer Websites auszuliefern. Durch die Verwendung von Werbe-Cookies kann Google mit seinen Partnern Ihnen Werbung auf Grundlage Ihres Besuchs dieser und/oder anderer Websites im Internet anzeigen.',
  'This box takes audio files such as MP3, WAV or M4A, but that one is a video.':
    'Dieses Feld nimmt Audiodateien wie MP3, WAV oder M4A an, aber diese Datei ist ein Video.',
  'This browser cannot record. Please choose a file instead.':
    'Dieser Browser kann nicht aufnehmen. Bitte wählen Sie stattdessen eine Datei aus.',
  'This browser does not report memory; {gb} GB assumed. Pick a smaller model if the page gets slow.':
    'Dieser Browser meldet keinen Arbeitsspeicher; es werden {gb} GB angenommen. Wählen Sie ein kleineres Modell, wenn die Seite langsam wird.',
  'This cannot be undone. Export anything you want to keep first.':
    'Das lässt sich nicht rückgängig machen. Exportieren Sie zuerst alles, was Sie behalten möchten.',
  'This copy of {brand} runs on your own computer. Your files are processed on this machine and nothing leaves it. Nothing is saved permanently: transcripts exist only for this session, so export what you need. The [Privacy policy](/privacy) describes the hosted website.':
    'Diese Kopie von {brand} läuft auf Ihrem eigenen Computer. Ihre Dateien werden auf diesem Rechner verarbeitet, und nichts verlässt ihn. Nichts wird dauerhaft gespeichert: Transkripte existieren nur für diese Sitzung, exportieren Sie also, was Sie brauchen. Die [Datenschutzerklärung](/privacy) beschreibt die gehostete Website.',
  'This copy runs on your own computer. Your files are processed on this machine and nothing leaves it.':
    'Diese Kopie läuft auf Ihrem eigenen Computer. Ihre Dateien werden auf diesem Rechner verarbeitet, und nichts verlässt ihn.',
  'This device has little memory for a file this long. It is processed in small pieces, which is slower; a shorter cut or a smaller model is safer.':
    'Dieses Gerät hat wenig Speicher für eine so lange Datei. Sie wird in kleinen Stücken verarbeitet, was langsamer ist; ein kürzerer Ausschnitt oder ein kleineres Modell ist sicherer.',
  'This file needs a 9 MB converter that runs in your browser. Load it?':
    'Diese Datei benötigt einen 9-MB-Konverter, der in Ihrem Browser läuft. Soll er geladen werden?',
  'This is a translation for convenience. If it differs from the English version, the English version applies.':
    'Dies ist eine Übersetzung zu Ihrer Information. Weicht sie von der englischen Fassung ab, gilt die englische Fassung.',
  'This local copy does not count transcriptions': 'Diese lokale Kopie zählt keine Transkriptionen',
  'This transcript has low model confidence. Listen to the recording and check the spoken language before using the text.':
    'Für dieses Transkript ist die Konfidenz des Modells niedrig. Hören Sie sich die Aufnahme an und prüfen Sie die gesprochene Sprache, bevor Sie den Text verwenden.',
  'This will take {wait} on this device (estimate). Keep the tab open until it finishes.':
    'Das dauert auf diesem Gerät {wait} (Schätzung). Lassen Sie den Tab geöffnet, bis es fertig ist.',
  Timestamps: 'Zeitstempel',
  'Tips for the best results': 'Tipps für die besten Ergebnisse',
  'Tips for the best transcript': 'Tipps für das beste Transkript',
  "To change your ad choices, use [Google Ads Settings](https://adssettings.google.com) or your browser's cookie settings.":
    'Um Ihre Werbeauswahl zu ändern, nutzen Sie die [Google-Werbeeinstellungen](https://adssettings.google.com) oder die Cookie-Einstellungen Ihres Browsers.',
  "To change your ad choices, use **Privacy and cookie settings** at the bottom of a page that shows ads, [Google Ads Settings](https://adssettings.google.com), or your browser's cookie settings.":
    'Um Ihre Werbeauswahl zu ändern, nutzen Sie unten auf einer Seite mit Werbung **Datenschutz- und Cookie-Einstellungen**, die [Google-Werbeeinstellungen](https://adssettings.google.com) oder die Cookie-Einstellungen Ihres Browsers.',
  "To give you the transcription you asked for on your own device, to deliver the website securely, and to keep the service free through advertising. Where data protection law such as the GDPR applies, our legal bases are providing the service you requested (Art. 6(1)(b)), our legitimate interest in security, preventing abuse and the anonymous running total (Art. 6(1)(f)), and, for advertising cookies where the law requires it, your consent (Art. 6(1)(a)), which Google's consent message asks for.":
    'Um Ihnen die gewünschte Transkription auf Ihrem eigenen Gerät zu liefern, die Website sicher auszuliefern und den Dienst durch Werbung kostenlos zu halten. Wo Datenschutzrecht wie die DSGVO (GDPR) gilt, sind unsere Rechtsgrundlagen die Bereitstellung des von Ihnen gewünschten Dienstes (Art. 6 Abs. 1 lit. b), unser berechtigtes Interesse an Sicherheit, Missbrauchsvermeidung und der anonymen laufenden Gesamtzahl (Art. 6 Abs. 1 lit. f) und, für Werbe-Cookies, wo das Gesetz es verlangt, Ihre Einwilligung (Art. 6 Abs. 1 lit. a), nach der die Einwilligungsmeldung von Google fragt.',
  'To keep it fast for everyone, each file has a size and length limit.':
    'Damit es für alle schnell bleibt, hat jede Datei eine Größen- und Längenbegrenzung.',
  'To the extent the law allows, we are not liable for indirect or consequential loss, loss of data, profits or business, or for any loss arising from your use of, or inability to use, the service or from errors in a transcript. Nothing in these terms limits liability that cannot be limited by law.':
    'Soweit das Gesetz es zulässt, haften wir nicht für mittelbare Schäden oder Folgeschäden, Datenverlust, entgangenen Gewinn oder Geschäftsverlust oder für Verluste, die sich aus Ihrer Nutzung oder Nichtnutzbarkeit des Dienstes oder aus Fehlern in einem Transkript ergeben. Nichts in diesen Bedingungen beschränkt eine Haftung, die gesetzlich nicht beschränkt werden kann.',
  "To transcribe on your device, your browser downloads the speech model files from Hugging Face (huggingface.co) and the speech engine's program files from jsDelivr (cdn.jsdelivr.net), and keeps them in its cache (Cache Storage) for next time until you delete them. Those providers receive the usual request data (your IP address, your browser and which file was requested), never your media or your transcript.":
    'Um auf Ihrem Gerät zu transkribieren, lädt Ihr Browser die Sprachmodelldateien von Hugging Face (huggingface.co) und die Programmdateien der Spracherkennung von jsDelivr (cdn.jsdelivr.net) herunter und behält sie für das nächste Mal in seinem Cache (Cache Storage), bis Sie sie löschen. Diese Anbieter erhalten die üblichen Anfragedaten (Ihre IP-Adresse, Ihren Browser und welche Datei angefordert wurde), nie Ihre Medien oder Ihr Transkript.',
  'To work on your device, your browser downloads speech models from Hugging Face and program files from jsDelivr; they are provided under their own licences and terms. Ads are provided by Google AdSense; an ad leads to a third-party website that we do not control and are not responsible for.':
    'Damit alles auf Ihrem Gerät funktioniert, lädt Ihr Browser Sprachmodelle von Hugging Face und Programmdateien von jsDelivr herunter; sie werden unter ihren eigenen Lizenzen und Bedingungen bereitgestellt. Werbung wird von Google AdSense bereitgestellt; eine Anzeige führt zu einer Website Dritter, die wir nicht kontrollieren und für die wir nicht verantwortlich sind.',
  Transcribe: 'Transkribieren',
  'Transcribe (same language)': 'Transkribieren (gleiche Sprache)',
  'Transcribe {n} files': '{n} Dateien transkribieren',
  'Transcribe a file': 'Datei transkribieren',
  'Transcribe or translate speech in the language you need.':
    'Transkribieren oder übersetzen Sie Sprache in der Sprache, die Sie brauchen.',
  'Transcribe videos, audio files and voice recordings in more than 50 languages, or let the language be detected for you.':
    'Transkribieren Sie Videos, Audiodateien und Sprachaufnahmen in mehr als 50 Sprachen oder lassen Sie die Sprache automatisch erkennen.',
  'Transcribing {n}%': 'Transkribiere {n} %',
  'Transcribing takes {time} on this device.': 'Die Transkription dauert auf diesem Gerät {time}.',
  'Transcribing…': 'Wird transkribiert …',
  '{blurb} Not sure? Keep this one.': '{blurb} Unsicher? Behalten Sie diese Auswahl.',
  '{reason} Retrying in {n} s…': '{reason} Neuer Versuch in {n} Sek. …',
  'Alternatives': 'Alternativen',
  'Checking the downloaded file…': 'Heruntergeladene Datei wird geprüft …',
  'Connection lost.': 'Verbindung unterbrochen.',
  'Continued after the page reloaded.': 'Nach dem Neuladen der Seite fortgesetzt.',
  'Continuing the download ({size} already saved)': 'Download wird fortgesetzt ({size} bereits gespeichert)',
  'Downloaded: ready to start': 'Heruntergeladen: bereit zum Start',
  'Every language in its own script: English in English letters, Hindi in Devanagari. Choose Hinglish to write Hindi in English letters.': 'Jede Sprache in ihrer eigenen Schrift: Englisch in lateinischen Buchstaben, Hindi in Devanagari. Wählen Sie Hinglish, um Hindi in lateinischen Buchstaben zu schreiben.',
  'First time only: downloads {size}, now downloading in the background': 'Nur beim ersten Mal: lädt {size} herunter, der Download läuft jetzt im Hintergrund',
  'Getting the model ready: {loaded} of {total}': 'Das Modell wird vorbereitet: {loaded} von {total}',
  'Good for most videos.': 'Gut für die meisten Videos.',
  'Honest, dated comparisons with other transcription services.': 'Ehrliche, datierte Vergleiche mit anderen Transkriptionsdiensten.',
  'Keep this page open until it is finished. If it reloads or closes, it continues where it stopped when you open the site again.': 'Lassen Sie diese Seite geöffnet, bis alles fertig ist. Wenn sie neu geladen oder geschlossen wird, geht es an der Stelle weiter, an der es aufgehört hat, sobald Sie die Website wieder öffnen.',
  'Length {time}': 'Länge {time}',
  'Opens in Word and Google Docs': 'Öffnet sich in Word und Google Docs',
  'Reconnecting…': 'Verbindung wird wiederhergestellt …',
  'The download server is busy (HTTP {status}).': 'Der Download-Server ist ausgelastet (HTTP {status}).',
  'The download stalled.': 'Der Download ist ins Stocken geraten.',
  'Time so far {time}': 'Bisherige Dauer {time}',
  'Translated to English': 'Ins Englische übersetzt',
  'Waiting for the internet connection…': 'Warten auf die Internetverbindung …',
  'Word document (.docx)': 'Word-Dokument (.docx)',
  'Transcribed in {time}': 'Transkribiert in {time}',
  Transcript: 'Transkript',
  'Transcript name': 'Name des Transkripts',
  'Transcript not found': 'Transkript nicht gefunden',
  'Transcript ready': 'Transkript fertig',
  'Transcript style': 'Transkriptionsstil',
  'Transcription failed': 'Transkription fehlgeschlagen',
  'Transcription has started. The text appears below as it is recognised.':
    'Die Transkription hat begonnen. Der Text erscheint unten, sobald er erkannt wird.',
  'Transcription has started. Your other files are under Transcripts at the top of the page.':
    'Die Transkription hat begonnen. Ihre anderen Dateien finden Sie oben auf der Seite unter „Transkripte“.',
  'Transcription runs on your device and uses its processor, graphics chip, memory and battery. We set no file-size or length limit, but how fast it runs, and how large a file your browser can handle, depends on your device: a long file on a slower phone or computer may take a long time or run out of memory. Your transcripts and files are kept in this browser and deleted automatically after {idle} of inactivity. See the [Privacy policy](/privacy).':
    'Die Transkription läuft auf Ihrem Gerät und nutzt dessen Prozessor, Grafikchip, Speicher und Akku. Wir legen keine Dateigrößen- oder Längenbegrenzung fest, aber wie schnell sie läuft und wie große Dateien Ihr Browser verarbeiten kann, hängt von Ihrem Gerät ab: Eine lange Datei auf einem langsameren Smartphone oder Computer kann lange dauern oder den Speicher sprengen. Ihre Transkripte und Dateien werden in diesem Browser gespeichert und nach {idle} Inaktivität automatisch gelöscht. Siehe [Datenschutzerklärung](/privacy).',
  'Transcription settings': 'Transkriptionseinstellungen',
  Transcripts: 'Transkripte',
  'Transcripts {n}': 'Transkripte {n}',
  'Transcripts are only kept for the browser session that created them.':
    'Transkripte werden nur für die Browsersitzung aufbewahrt, die sie erstellt hat.',
  'Transcripts are produced automatically and will contain mistakes, especially with noisy audio, strong accents, overlapping speakers, music, and names or technical terms. Always check a transcript before relying on it, particularly for legal, medical, financial or published use. The service is provided "as is" and "as available", without any warranty, express or implied, including about accuracy, completeness or fitness for a particular purpose.':
    'Transkripte werden automatisch erstellt und enthalten Fehler, besonders bei verrauschtem Audio, starken Akzenten, überlappenden Sprechern, Musik sowie Namen oder Fachbegriffen. Prüfen Sie ein Transkript immer, bevor Sie sich darauf verlassen, insbesondere bei rechtlicher, medizinischer, finanzieller oder veröffentlichter Verwendung. Der Dienst wird „wie besehen“ und „wie verfügbar“ bereitgestellt, ohne jede ausdrückliche oder stillschweigende Gewährleistung, auch nicht für Genauigkeit, Vollständigkeit oder Eignung für einen bestimmten Zweck.',
  'Translate to English': 'Ins Englische übersetzen',
  'Try again': 'Erneut versuchen',
  'Try another quality or language': 'Andere Qualität oder Sprache ausprobieren',
  'try to spread malware or anything meant to damage the service.':
    'Schadsoftware oder anderes, das dem Dienst schaden soll, zu verbreiten.',
  'Trying again in a moment…': 'Neuer Versuch gleich …',
  'Trying again. This page loads by itself as soon as the server is back.':
    'Neuer Versuch läuft. Diese Seite lädt sich von selbst, sobald der Server wieder da ist.',
  'under a minute': 'unter einer Minute',
  'Underline unsure words': 'Unsichere Wörter unterstreichen',
  Unlimited: 'Unbegrenzt',
  'Unsure: worth listening to again': 'Unsicher: lohnt sich erneut anzuhören',
  'Unusually heavy bursts of uploads may be asked to wait a little.':
    'Bei ungewöhnlich starken Upload-Spitzen kann es sein, dass Sie ein wenig warten müssen.',
  'Up to {minutes} per file.': 'Bis zu {minutes} pro Datei.',
  'Up to {size} and {minutes} minutes per file.': 'Bis zu {size} und {minutes} Minuten pro Datei.',
  'Up to {size} and {minutes} per file.': 'Bis zu {size} und {minutes} pro Datei.',
  'Up to {size} per file.': 'Bis zu {size} pro Datei.',
  'Updated {date}': 'Aktualisiert am {date}',
  'Upload complete': 'Upload abgeschlossen',
  'Upload failed': 'Upload fehlgeschlagen',
  'Upload failed (server error {status}). Check the terminal running the server for details.':
    'Upload fehlgeschlagen (Serverfehler {status}). Details finden Sie im Terminal, in dem der Server läuft.',
  'Upload failed (server error {status}). Please try again in a moment.':
    'Upload fehlgeschlagen (Serverfehler {status}). Bitte versuchen Sie es gleich noch einmal.',
  Uploading: 'Wird hochgeladen',
  'Uploading…': 'Wird hochgeladen …',
  'use a computer for this size': 'für diese Größe einen Computer verwenden',
  'use scripts, bots or other automated means against the website or its counter, or send made-up counts, without our written permission;':
    'ohne unsere schriftliche Genehmigung Skripte, Bots oder andere automatisierte Mittel gegen die Website oder ihren Zähler einzusetzen oder erfundene Zählwerte zu senden;',
  "use the service on content that is illegal, or that infringes someone else's rights;":
    'den Dienst für Inhalte zu nutzen, die rechtswidrig sind oder die Rechte anderer verletzen;',
  'use the service to harass, harm or deceive others;':
    'den Dienst zu nutzen, um andere zu belästigen, zu schädigen oder zu täuschen;',
  'Usually very accurate on clear speech. Lines it is unsure about are marked, so you can check them first.':
    'Bei klarer Sprache meist sehr genau. Zeilen, bei denen es unsicher ist, sind markiert, damit Sie sie zuerst prüfen können.',
  'Video and audio to text': 'Video und Audio zu Text',
  'Video or audio, several at once is fine.': 'Video oder Audio, auch mehrere auf einmal.',
  'Video to text, accurately.': 'Video zu Text, genau.',
  'Video to text: transcribe a video or audio file':
    'Video zu Text: Video- oder Audiodatei transkribieren',
  'video transcribed': 'Video transkribiert',
  'videos transcribed': 'Videos transkribiert',
  'Vocabulary hint': 'Wortschatz-Hinweis',
  'Voice notes, meetings, lectures, podcasts and interviews.':
    'Sprachnotizen, Besprechungen, Vorlesungen, Podcasts und Interviews.',
  'Waiting for microphone permission…': 'Warten auf die Mikrofonerlaubnis …',
  'Waiting for the first words…': 'Warten auf die ersten Wörter …',
  'Waiting in line…': 'Wartet in der Schlange …',
  'Watch the text appear live, fix any mistakes, then download it as SRT, VTT, TXT, Markdown, JSON or PDF.':
    'Sehen Sie zu, wie der Text live erscheint, korrigieren Sie Fehler und laden Sie ihn dann als SRT, VTT, TXT, Markdown, JSON oder PDF herunter.',
  'We do not ask for your name, e-mail address or any other account details.':
    'Wir fragen weder nach Ihrem Namen noch nach Ihrer E-Mail-Adresse oder anderen Kontodaten.',
  'We do not promise that the service will always be available, uninterrupted or error-free. The website, or the downloads it needs (the speech models from Hugging Face and the program files from jsDelivr), may be unavailable for maintenance or for reasons outside our control, and some browsers or devices cannot run every model. Because your transcripts are kept only in this browser and deleted after inactivity, always export what you need.':
    'Wir versprechen nicht, dass der Dienst immer verfügbar, ununterbrochen oder fehlerfrei ist. Die Website oder die Downloads, die sie braucht (die Sprachmodelle von Hugging Face und die Programmdateien von jsDelivr), können wegen Wartung oder aus Gründen außerhalb unserer Kontrolle nicht verfügbar sein, und manche Browser oder Geräte können nicht jedes Modell ausführen. Da Ihre Transkripte nur in diesem Browser gespeichert und nach Inaktivität gelöscht werden, exportieren Sie stets, was Sie brauchen.',
  'We do not sell your data. We hold none of your files or transcripts, so we have none to share: the recognition runs on your device, not on an external transcription or AI service. Google (advertising), Cloudflare (hosting and the counter), Hugging Face and jsDelivr (the downloads) receive only what is described above. We may disclose information if the law requires it.':
    'Wir verkaufen Ihre Daten nicht. Wir halten keine Ihrer Dateien oder Transkripte vor, also haben wir nichts weiterzugeben: Die Erkennung läuft auf Ihrem Gerät, nicht bei einem externen Transkriptions- oder KI-Dienst. Google (Werbung), Cloudflare (Hosting und der Zähler), Hugging Face und jsDelivr (die Downloads) erhalten nur das oben Beschriebene. Wir können Informationen offenlegen, wenn das Gesetz es verlangt.',
  'We keep nothing of yours on our side: apart from the single running total, nothing about your use is stored by us.':
    'Wir speichern nichts von Ihnen auf unserer Seite: Abgesehen von der einen laufenden Gesamtzahl wird nichts über Ihre Nutzung von uns gespeichert.',
  'We may block access if these rules are broken.':
    'Wir können den Zugang sperren, wenn diese Regeln verletzt werden.',
  'We may update these terms. The new version appears on this page with a new "Last updated" date, and applies from then on.':
    'Wir können diese Bedingungen aktualisieren. Die neue Fassung erscheint auf dieser Seite mit einem neuen Datum bei „Zuletzt aktualisiert“ und gilt ab dann.',
  'We never send your file, your transcript or any personal information to Google.':
    'Wir senden Ihre Datei, Ihr Transkript oder andere personenbezogene Informationen nie an Google.',
  'Web subtitles (.vtt)': 'Web-Untertitel (.vtt)',
  'What people use it for': 'Wofür Menschen es nutzen',
  'What you can do with it': 'Was Sie damit tun können',
  'What you get': 'Was Sie bekommen',
  'what you were doing, and what happened instead of what you expected;':
    'was Sie getan haben und was statt des Erwarteten passiert ist;',
  'Where your files are processed depends on how {brand} is run, and the server did not answer just now. See the [Privacy policy](/privacy).':
    'Wo Ihre Dateien verarbeitet werden, hängt davon ab, wie {brand} betrieben wird, und der Server hat gerade nicht geantwortet. Siehe [Datenschutzerklärung](/privacy).',
  'Where your files are processed depends on how {brand} is run.':
    'Wo Ihre Dateien verarbeitet werden, hängt davon ab, wie {brand} betrieben wird.',
  'Which files can I use, and what are the limits?':
    'Welche Dateien kann ich verwenden, und welche Grenzen gibt es?',
  'Which languages are supported?': 'Welche Sprachen werden unterstützt?',
  'Who builds it': 'Wer es entwickelt',
  'Who runs this website': 'Wer diese Website betreibt',
  'Why it exists': 'Warum es das gibt',
  'Working…': 'Wird bearbeitet …',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall; ads keep the website free.':
    'Ja. Es ist kostenlos, und es gibt nie ein Konto oder eine Anmeldung. Es gibt kein Tages- oder Monatskontingent und keine Bezahlschranke; Werbung hält die Website kostenlos.',
  'Yes. It is free, and there is no account or login, ever. There is no daily or monthly quota and no paywall.':
    'Ja. Es ist kostenlos, und es gibt nie ein Konto oder eine Anmeldung. Es gibt kein Tages- oder Monatskontingent und keine Bezahlschranke.',
  'Yes. It is free, and there is nothing to sign up for and no login. This copy runs on your own computer, so there is no quota and no paywall; how fast it works depends on your computer.':
    'Ja. Es ist kostenlos, und es gibt nichts, wofür Sie sich registrieren müssten, und keine Anmeldung. Diese Kopie läuft auf Ihrem eigenen Computer, daher gibt es weder Kontingent noch Bezahlschranke; wie schnell sie arbeitet, hängt von Ihrem Computer ab.',
  'Yes. Use the pencil next to a line to change its text or delete the line, or search and replace across the whole transcript. Your edits are included in every export.':
    'Ja. Mit dem Stift neben einer Zeile ändern Sie ihren Text oder löschen die Zeile, oder Sie suchen und ersetzen im gesamten Transkript. Ihre Änderungen sind in jedem Export enthalten.',
  'You agree not to:': 'Sie erklären sich damit einverstanden, Folgendes nicht zu tun:',
  "You are in control: delete your transcripts, files and, if you like, the downloaded speech models at any time with **Delete my data now**. It deletes the data in this browser only; it cannot delete Google's cookies.":
    'Sie behalten die Kontrolle: Löschen Sie Ihre Transkripte, Dateien und, wenn Sie möchten, die heruntergeladenen Sprachmodelle jederzeit mit **Meine Daten jetzt löschen**. Das löscht nur die Daten in diesem Browser; die Cookies von Google kann es nicht löschen.',
  'You can change it at any time with **Privacy and cookie settings** at the bottom of any page that shows ads (for example the home page).':
    'Sie können Ihre Entscheidung jederzeit über **Datenschutz- und Cookie-Einstellungen** unten auf jeder Seite mit Werbung ändern (zum Beispiel auf der Startseite).',
  'You can now read, fix and download it.':
    'Sie können es jetzt lesen, korrigieren und herunterladen.',
  'You can stop using the service at any time and delete the data in this browser with **Delete my data now**. We may suspend or end your access at any time, in particular if you break these terms.':
    'Sie können die Nutzung des Dienstes jederzeit beenden und die Daten in diesem Browser mit **Meine Daten jetzt löschen** löschen. Wir können Ihren Zugang jederzeit sperren oder beenden, insbesondere wenn Sie gegen diese Bedingungen verstoßen.',
  'You keep all rights in the files you add and the transcripts made from them. They are processed on your device and we never receive them. You are responsible for what you transcribe: only use content you own or have the right to process, including any permission needed from the people who speak in it.':
    'Sie behalten alle Rechte an den Dateien, die Sie hinzufügen, und an den daraus erstellten Transkripten. Sie werden auf Ihrem Gerät verarbeitet, und wir erhalten sie nie. Sie sind für das verantwortlich, was Sie transkribieren: Nutzen Sie nur Inhalte, die Ihnen gehören oder die Sie verarbeiten dürfen, einschließlich jeder Erlaubnis, die von den Menschen nötig ist, die darin sprechen.',
  "You may opt out of personalised advertising by visiting [Google Ads Settings](https://adssettings.google.com), or opt out of some third-party vendors' use of cookies for personalised advertising at [www.aboutads.info](https://www.aboutads.info). Learn [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).":
    'Sie können personalisierter Werbung widersprechen, indem Sie die [Google-Werbeeinstellungen](https://adssettings.google.com) besuchen, oder der Verwendung von Cookies durch einige Drittanbieter für personalisierte Werbung unter [www.aboutads.info](https://www.aboutads.info) widersprechen. Erfahren Sie, [wie Google Informationen von Websites nutzt, die seine Dienste verwenden](https://policies.google.com/technologies/partner-sites).',
  'your browser and its version, and your device (computer or phone, and its operating system);':
    'Ihren Browser und dessen Version sowie Ihr Gerät (Computer oder Smartphone und dessen Betriebssystem);',
  'Your browser blocked copying here. Use Export to save the text instead.':
    'Ihr Browser hat das Kopieren hier blockiert. Nutzen Sie stattdessen „Exportieren“, um den Text zu speichern.',
  'Your change is saved.': 'Ihre Änderung ist gespeichert.',
  'Your change is still in its box: press Save to try again.':
    'Ihre Änderung steht noch im Feld: Drücken Sie auf „Speichern“, um es erneut zu versuchen.',
  'Your file is sent to the server over an encrypted connection, transcribed with open speech recognition models such as OpenAI Whisper, and deleted automatically afterwards. The [How it works](/how-it-works) page explains each step.':
    'Ihre Datei wird über eine verschlüsselte Verbindung an den Server gesendet, mit offenen Spracherkennungsmodellen wie OpenAI Whisper transkribiert und danach automatisch gelöscht. Die Seite [So funktioniert es](/how-it-works) erklärt jeden Schritt.',
  'Your file is transcribed in your browser on your own device, so we set no size or length limit. Very large or long files work too: they take longer and need enough free memory, and the page warns you when your device may be slow.':
    'Ihre Datei wird in Ihrem Browser auf Ihrem eigenen Gerät transkribiert, daher legen wir keine Größen- oder Längenbegrenzung fest. Auch sehr große oder lange Dateien funktionieren: Sie dauern länger und brauchen genug freien Speicher, und die Seite warnt Sie, wenn Ihr Gerät langsam sein könnte.',
  'Your file is transcribed with open speech recognition models such as OpenAI Whisper and is deleted automatically afterwards.':
    'Ihre Datei wird mit offenen Spracherkennungsmodellen wie OpenAI Whisper transkribiert und danach automatisch gelöscht.',
  'Your file never leaves your device.': 'Ihre Datei verlässt Ihr Gerät nie.',
  'Your file never leaves your device. [Privacy](/privacy)':
    'Ihre Datei verlässt Ihr Gerät nie. [Datenschutz](/privacy)',
  "Your file never leaves your device. It is transcribed in your browser on this device and is never uploaded to us or to anyone else. Transcripts, your edits and the file are kept in this browser's storage only and deleted automatically after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account. Export what you need before you leave.":
    'Ihre Datei verlässt Ihr Gerät nie. Sie wird in Ihrem Browser auf diesem Gerät transkribiert und nie zu uns oder zu anderen hochgeladen. Transkripte, Ihre Änderungen und die Datei werden nur im Speicher dieses Browsers aufbewahrt und nach {idle} Inaktivität automatisch gelöscht oder sofort, wenn Sie im Menü „Transkripte“ auf **Meine Daten jetzt löschen** drücken. Es gibt kein Konto. Exportieren Sie, was Sie brauchen, bevor Sie gehen.',
  'Your file never leaves your device. It is transcribed right in your browser, with no account, and your transcripts stay in this browser.':
    'Ihre Datei verlässt Ihr Gerät nie. Sie wird direkt in Ihrem Browser transkribiert, ohne Konto, und Ihre Transkripte bleiben in diesem Browser.',
  'Your file stays on this device. Keep this tab open while it is transcribed.':
    'Ihre Datei bleibt auf diesem Gerät. Lassen Sie diesen Tab geöffnet, während sie transkribiert wird.',
  'Your files and transcripts are kept only for this session and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'Ihre Dateien und Transkripte werden nur für diese Sitzung aufbewahrt und nach {idle} Inaktivität automatisch gelöscht oder wenn Sie auf „Meine Daten jetzt löschen“ drücken. Kein Konto, kein Tracking, ein notwendiges Sitzungs-Cookie. Exportieren Sie, was Sie brauchen, bevor Sie gehen.',
  'Your files and transcripts are kept only for this session and deleted automatically when it ends, or when you press "Delete my data now". No account, no tracking, one essential session cookie. Export what you need before you leave.':
    'Ihre Dateien und Transkripte werden nur für diese Sitzung aufbewahrt und automatisch gelöscht, wenn sie endet, oder wenn Sie auf „Meine Daten jetzt löschen“ drücken. Kein Konto, kein Tracking, ein notwendiges Sitzungs-Cookie. Exportieren Sie, was Sie brauchen, bevor Sie gehen.',
  'Your files are deleted automatically. [Privacy](/privacy)':
    'Ihre Dateien werden automatisch gelöscht. [Datenschutz](/privacy)',
  'Your files are processed in your browser and stay on your device. The website, the downloads and the counter use encrypted connections (HTTPS). Anyone who can use this browser profile can see the transcripts stored in it until they are deleted, so press **Delete my data now** on a shared computer.':
    'Ihre Dateien werden in Ihrem Browser verarbeitet und bleiben auf Ihrem Gerät. Die Website, die Downloads und der Zähler nutzen verschlüsselte Verbindungen (HTTPS). Wer dieses Browserprofil nutzen kann, kann die darin gespeicherten Transkripte sehen, bis sie gelöscht werden; drücken Sie daher auf einem gemeinsam genutzten Computer auf **Meine Daten jetzt löschen**.',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, after {idle} of inactivity, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'Ihre Dateien werden auf unseren Server hochgeladen, damit sie dort verarbeitet werden können. Sie werden nur für Ihre Sitzung aufbewahrt und automatisch gelöscht, wenn sie endet, nach {idle} Inaktivität oder sofort, wenn Sie im Menü „Transkripte“ auf **Meine Daten jetzt löschen** drücken. Es gibt kein Konto und kein Tracking, und das einzige Cookie ist ein notwendiges Sitzungs-Cookie (keine Analyse- oder Werbe-Cookies).',
  'Your files are uploaded to our server so they can be processed there. They are kept only for your session and deleted automatically when it ends, or right away when you press **Delete my data now** in the Transcripts menu. There is no account and no tracking, and the only cookie is one essential session cookie (no analytics or advertising cookies).':
    'Ihre Dateien werden auf unseren Server hochgeladen, damit sie dort verarbeitet werden können. Sie werden nur für Ihre Sitzung aufbewahrt und automatisch gelöscht, wenn sie endet, oder sofort, wenn Sie im Menü „Transkripte“ auf **Meine Daten jetzt löschen** drücken. Es gibt kein Konto und kein Tracking, und das einzige Cookie ist ein notwendiges Sitzungs-Cookie (keine Analyse- oder Werbe-Cookies).',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically after {idle} of inactivity, or when you press "Delete my data now". Export what you need before you leave.':
    'Ihre Dateien verlassen dieses Gerät nie. Transkripte werden nur in diesem Browser aufbewahrt und nach {idle} Inaktivität automatisch gelöscht oder wenn Sie auf „Meine Daten jetzt löschen“ drücken. Exportieren Sie, was Sie brauchen, bevor Sie gehen.',
  'Your files never leave this device. Transcripts are kept in this browser only and deleted automatically when the session ends, or when you press "Delete my data now". Export what you need before you leave.':
    'Ihre Dateien verlassen dieses Gerät nie. Transkripte werden nur in diesem Browser aufbewahrt und automatisch gelöscht, wenn die Sitzung endet, oder wenn Sie auf „Meine Daten jetzt löschen“ drücken. Exportieren Sie, was Sie brauchen, bevor Sie gehen.',
  'Your session ends in {mins} min. Export what you need.':
    'Ihre Sitzung endet in {mins} Min. Exportieren Sie, was Sie brauchen.',
  'Your session has ended': 'Ihre Sitzung ist beendet',
  'Your session has ended and its data was deleted. You can start a new transcription.':
    'Ihre Sitzung ist beendet und ihre Daten wurden gelöscht. Sie können eine neue Transkription starten.',
  'Your transcript is ready below.': 'Ihr Transkript ist unten fertig.',
  'Your transcripts': 'Ihre Transkripte',
  'Your transcripts and files were removed from the server.':
    'Ihre Transkripte und Dateien wurden vom Server entfernt.',
  'Your transcripts and files were removed from this device.':
    'Ihre Transkripte und Dateien wurden von diesem Gerät entfernt.',

  // page titles, descriptions and link labels
  'title:/': 'Video zu Text kostenlos, ohne Anmeldung',
  'description:/':
    'Video und Audio kostenlos in Text umwandeln: ohne Anmeldung, ohne Tageslimit, in über 50 Sprachen. Mit Zeitstempeln, Export als SRT, VTT, TXT oder PDF.',
  'title:/about': 'Über TranscribeVid',
  'description:/about':
    'Wer TranscribeVid entwickelt und warum: ein kostenloses Tool für Video und Audio zu Text ohne Registrierung und Anmeldung, finanziert durch Werbung.',
  'title:/contact': 'Kontakt',
  'description:/contact':
    'So erreichen Sie TranscribeVid: E-Mail für Fragen, Fehlermeldungen, Funktionswünsche und Datenschutzanfragen sowie Angaben dazu, wer die Website betreibt.',
  'title:/faq': 'Häufig gestellte Fragen',
  'description:/faq':
    'Antworten auf häufige Fragen zu TranscribeVid: Genauigkeit, Sprachen, unterstützte Dateien und Grenzen, Geschwindigkeit, Datenschutz und Bearbeitung.',
  'title:/guides': 'Ratgeber zu Transkripten und Untertiteln',
  'description:/guides':
    'Praktische Ratgeber zu Transkripten und Untertiteln: SRT oder VTT, Untertitel zu einem Video hinzufügen, genaue Transkripte und Transkription ohne Upload.',
  'title:/how-it-works': 'So funktioniert es',
  'description:/how-it-works':
    'So wandelt TranscribeVid Video und Audio in drei einfachen Schritten in genauen Text mit Zeitstempeln um, was Sie bekommen und Tipps für beste Ergebnisse.',
  'title:/privacy': 'Datenschutzerklärung',
  'description:/privacy':
    'Was TranscribeVid verarbeitet, wenn Sie eine Datei transkribieren – wo, warum und wie lange –, dazu Cookies, Werbung, Browser-Speicher und Ihre Rechte.',
  'title:/terms': 'Nutzungsbedingungen',
  'description:/terms':
    'Die Regeln für TranscribeVid: kostenloser Dienst, Ihre Inhalte, zulässige Nutzung, Dateigrenzen, keine Gewährleistung für Genauigkeit und Haftung.',
  'title:/tools': 'Alle kostenlosen Tools',
  'description:/tools':
    'Alle kostenlosen Video-und-Audio-zu-Text-Tools in einer Liste: nach Dateityp, Verwendung, Untertiteldateien und Sprachen. Ohne Anmeldung, über 50 Sprachen.',
  'title:/video-to-text': 'Video zu Text: kostenloser Konverter',
  'description:/video-to-text':
    'Video kostenlos in Text umwandeln. Genaues Transkript mit Zeitstempeln in über 50 Sprachen. Ohne Anmeldung, ohne Tageslimit. Export als SRT, VTT, TXT, PDF.',
  'label:/video-to-text': 'Video zu Text',
  'title:/audio-to-text': 'Audio zu Text: kostenlos und unbegrenzt',
  'description:/audio-to-text':
    'Podcasts, Interviews und Vorlesungen in Text umwandeln. Kostenloser Audio-zu-Text-Konverter mit Zeitstempeln, über 50 Sprachen, ohne Anmeldung. TXT, SRT, PDF.',
  'label:/audio-to-text': 'Audio zu Text',
  'title:/mp4-to-text': 'MP4 zu Text: Videos kostenlos transkribieren',
  'description:/mp4-to-text':
    'MP4-Video in Text mit Zeitstempeln umwandeln. Kostenlos, ohne Anmeldung, ohne Tageslimit, über 50 Sprachen. Export als TXT, SRT, VTT, Markdown, JSON oder PDF.',
  'label:/mp4-to-text': 'MP4 zu Text',
  'title:/mp3-to-text': 'MP3 zu Text: kostenlose Transkripte',
  'description:/mp3-to-text':
    'MP3 online kostenlos in Text transkribieren. Ohne Anmeldung, über 50 Sprachen, Zeitstempel in jeder Zeile. Text bearbeiten und als TXT, SRT, VTT, PDF laden.',
  'label:/mp3-to-text': 'MP3 zu Text',
  'title:/srt-subtitle-generator': 'Kostenloser SRT-Untertitel-Generator',
  'description:/srt-subtitle-generator':
    'SRT-Untertiteldatei aus Video oder Audio kostenlos erstellen. Zur Sprache getaktet, über 50 Sprachen, ohne Anmeldung. Zeilen bearbeiten, SRT oder VTT laden.',
  'label:/srt-subtitle-generator': 'SRT-Untertitel-Generator',
  'title:/voice-recording-to-text': 'Sprachaufnahme zu Text, kostenlos',
  'description:/voice-recording-to-text':
    'Stimme im Browser aufnehmen oder Sprachmemo hinzufügen und als Text erhalten. Kostenlos, ohne Anmeldung, über 50 Sprachen. TXT, PDF, SRT oder Markdown.',
  'label:/voice-recording-to-text': 'Sprachaufnahme zu Text',
  'title:/wav-to-text': 'WAV zu Text: kostenlos online',
  'description:/wav-to-text':
    'WAV-Datei kostenlos in Text umwandeln. Bewältigt lange Aufnahmen von Recordern und Anrufen, über 50 Sprachen, Zeitstempel, ohne Anmeldung. TXT, SRT oder PDF.',
  'label:/wav-to-text': 'WAV zu Text',
  'title:/m4a-to-text': 'M4A zu Text: Sprachmemos kostenlos',
  'description:/m4a-to-text':
    'M4A-Sprachmemo oder -Aufnahme kostenlos in Text umwandeln. Auch iPhone-Sprachmemos, ohne Anmeldung, über 50 Sprachen, Zeitstempel. TXT, SRT, VTT, PDF.',
  'label:/m4a-to-text': 'M4A zu Text',
  'title:/webm-to-text': 'WebM zu Text: kostenlos transkribieren',
  'description:/webm-to-text':
    'WebM-Video oder -Audio kostenlos in Text umwandeln. Für Bildschirm- und Browser-Aufnahmen, über 50 Sprachen, Zeitstempel. Export als TXT, SRT, VTT oder PDF.',
  'label:/webm-to-text': 'WebM zu Text',
  'title:/mov-to-text': 'MOV zu Text: iPhone-Videos kostenlos',
  'description:/mov-to-text':
    'MOV-Video vom iPhone oder aus QuickTime kostenlos transkribieren. Ohne Anmeldung, über 50 Sprachen, Zeitstempel je Zeile. Export als TXT, SRT, VTT, PDF.',
  'label:/mov-to-text': 'MOV zu Text',
  'title:/whatsapp-voice-message-to-text': 'WhatsApp-Sprachnachricht zu Text',
  'description:/whatsapp-voice-message-to-text':
    'WhatsApp-Sprachnachricht kostenlos in Text umwandeln. Nachricht speichern, hier ablegen und in über 50 Sprachen lesen, auch Hindi. Ohne Anmeldung, ohne Konto.',
  'label:/whatsapp-voice-message-to-text': 'WhatsApp-Sprachnachricht zu Text',
  'title:/meeting-recording-to-text': 'Zoom, Teams & Meet: Aufzeichnung zu Text',
  'description:/meeting-recording-to-text':
    'Zoom-, Teams- oder Google-Meet-Aufzeichnung kostenlos in ein durchsuchbares Transkript mit Zeitstempeln umwandeln. Ohne Anmeldung, über 50 Sprachen.',
  'label:/meeting-recording-to-text': 'Meeting-Aufzeichnung zu Text',
  'title:/lecture-to-text': 'Vorlesung zu Text, kostenlos transkribieren',
  'description:/lecture-to-text':
    'Eine aufgezeichnete Vorlesung in durchsuchbaren Text umwandeln. Kostenlos, ohne Anmeldung, über 50 Sprachen, Zeitstempel. Export als TXT, Markdown, SRT, PDF.',
  'label:/lecture-to-text': 'Vorlesung zu Text',
  'title:/podcast-transcript-generator': 'Kostenloser Podcast-Transkript-Generator',
  'description:/podcast-transcript-generator':
    'Podcast-Transkript aus MP3 oder WAV kostenlos erstellen. Zeitstempel, über 50 Sprachen, ohne Anmeldung. Bearbeiten, laden als TXT, Markdown, SRT oder PDF.',
  'label:/podcast-transcript-generator': 'Podcast-Transkript-Generator',
  'title:/interview-transcription': 'Interviews transkribieren: privat, kostenlos',
  'description:/interview-transcription':
    'Interviews kostenlos und ohne Konto transkribieren. Text mit Zeitstempeln in über 50 Sprachen, für Forschung, Journalismus und Personalauswahl. TXT oder PDF.',
  'label:/interview-transcription': 'Interview-Transkription',
  'title:/vtt-subtitle-generator': 'WebVTT-Untertitel kostenlos erstellen',
  'description:/vtt-subtitle-generator':
    'WebVTT-Untertiteldatei (.vtt) aus Video oder Audio kostenlos erstellen. Zur Sprache getaktet, über 50 Sprachen, ohne Anmeldung. Zeilen bearbeiten, VTT laden.',
  'label:/vtt-subtitle-generator': 'VTT-Untertitel-Generator',
  'title:/youtube-subtitle-generator': 'YouTube-Untertitel: kostenlose SRT-Datei',
  'description:/youtube-subtitle-generator':
    'SRT-Untertiteldatei für Ihr eigenes YouTube-Video kostenlos und ohne Anmeldung erstellen. Zur Sprache getaktet, über 50 Sprachen. In YouTube Studio hochladen.',
  'label:/youtube-subtitle-generator': 'YouTube-Untertitel-Generator',
  'title:/translate-audio-to-english': 'Sprache ins Englische übersetzen, kostenlos',
  'description:/translate-audio-to-english':
    'Fremdsprachige Aufnahmen kostenlos in englischen Text übersetzen. Datei hinzufügen, Text oder Untertitel mit Zeitstempeln erhalten. SRT, VTT, TXT.',
  'label:/translate-audio-to-english': 'Sprache ins Englische übersetzen',
  'title:/guides/srt-vs-vtt': 'SRT oder VTT: Welches Format passt?',
  'description:/guides/srt-vs-vtt':
    'SRT oder VTT? Was beide Untertitelformate sind, wie sie sich unterscheiden, wo sie funktionieren und wie Sie kostenlos eine Datei aus Ihrem Video erstellen.',
  'label:/guides/srt-vs-vtt': 'SRT oder VTT',
  'title:/guides/how-to-add-subtitles-to-a-video': 'Untertitel zu einem Video hinzufügen',
  'description:/guides/how-to-add-subtitles-to-a-video':
    'Untertitel in vier Schritten: Video transkribieren, Text korrigieren, SRT oder VTT exportieren und die Datei in YouTube, VLC, Editor oder Webplayer einbinden.',
  'label:/guides/how-to-add-subtitles-to-a-video': 'Untertitel zu einem Video hinzufügen',
  'title:/guides/transcribe-video-without-uploading': 'Video transkribieren ohne Upload',
  'description:/guides/transcribe-video-without-uploading':
    'Wie Transkription im Browser funktioniert, was auf Ihrem Gerät bleibt, was einmal heruntergeladen wird und wie Sie es im Netzwerk-Tab selbst prüfen.',
  'label:/guides/transcribe-video-without-uploading': 'Video transkribieren, ohne es hochzuladen',
  'title:/guides/accurate-transcripts': 'So erhalten Sie ein genaueres Transkript',
  'description:/guides/accurate-transcripts':
    'So verbessern Sie die Genauigkeit: sauberes Audio, passende Sprache und Modell, Wortschatz-Hinweis, Ergebnis prüfen und korrigieren.',
  'label:/guides/accurate-transcripts': 'So erhalten Sie ein genaueres Transkript',
  'title:/guides/what-is-whisper': 'Was ist Whisper? Spracherkennung erklärt',
  'description:/guides/what-is-whisper':
    'Was OpenAI Whisper ist, womit es trainiert wurde, wie genau es ist und wo es Schwächen hat – und wie es bei TranscribeVid in Ihrem Browser läuft.',
  'label:/guides/what-is-whisper': 'Was ist Whisper?',
  'an independent software developer': 'ein unabhängiger Softwareentwickler',
  'Bengaluru, India': 'Bengaluru, Indien',
  'This page was translated with AI. [Found a mistake? Tell us.](/contact)':
    'Diese Seite wurde mit KI übersetzt. [Fehler gefunden? Sagen Sie es uns.](/contact)',
};
export default dict;
