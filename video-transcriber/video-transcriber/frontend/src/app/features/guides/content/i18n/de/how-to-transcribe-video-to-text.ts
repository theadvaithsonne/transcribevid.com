import { GuideContent } from '../../../guide.model';

/** Die Schritte anderer Tools sind so wiedergegeben, wie deren eigene Seiten sie beschreiben; nichts davon wurde gemessen. Der Vergleichsratgeber enthält die belegten Grenzen. */
export const CONTENT: GuideContent = {
  h1: 'Video in Text umwandeln: fünf Wege, und welcher zu Ihrem Video passt',
  lead: 'Den Wortlaut eines Videos als Text bekommen Sie auf fünf Wegen: mit dem Transkript, das YouTube bereits hat, per Diktierfunktion, mit den Untertiteln eines Videoschnittprogramms, mit einem Online-Dienst oder mit einem Tool, das auf Ihrem eigenen Gerät läuft. Sie unterscheiden sich in den Kosten, darin, ob Sie in jeder Zeile eine Zeitangabe bekommen, und darin, was sie zuerst von Ihnen verlangen. Dieser Ratgeber sagt, was jeder Weg leistet und wann Sie ihn wählen sollten.',
  readingMinutes: 7,
  toolPath: '/transcribe-video-to-text',
  toolCta: 'Video in Text umwandeln, kostenlos und ohne Konto',
  blocks: [
    {
      title: 'Die kurze Antwort',
      bullets: [
        {
          title: 'Das Video ist auf YouTube und hat Untertitel:',
          text: 'öffnen Sie das Transkript auf der Videoseite. Es kostet nichts und dauert eine Minute, existiert aber nur, wenn das Video Untertitel hat, und der Text muss sorgfältig gelesen werden.',
        },
        {
          title: 'Sie haben die Videodatei und wollen Text mit Zeitangaben:',
          text: 'nehmen Sie ein Tool, das eine Datei annimmt und Ihnen TXT- und Untertiteldateien liefert. Die letzten beiden Wege unten leisten das.',
        },
        {
          title: 'Sie brauchen nur ein paar Zitate:',
          text: 'spielen Sie das Video ab und tippen Sie, oder nutzen Sie die Diktierfunktion. Für alles, was länger als ein paar Minuten ist, geht es langsamer, als die ganze Datei von Software verarbeiten zu lassen.',
        },
        {
          title: 'Sie wollen Untertitel für dasselbe Video:',
          text: 'wählen Sie einen Weg, der SRT oder VTT exportiert, damit Sie mit einem Durchlauf sowohl das Transkript als auch die Untertitel bekommen.',
        },
      ],
    },
    {
      title: 'Was ein gutes Transkript von Ihrem Video braucht',
      paragraphs: [
        'Jeder der folgenden Wege arbeitet mit der Tonspur, die Tonqualität bestimmt die Qualität des Textes daher weit mehr als das Bild. Sprache nahe am Mikrofon, eine Stimme nach der anderen, ohne Musik darunter, kommt gut heraus. Ein Raum mit Hall, Menschen, die durcheinanderreden, oder laute Hintergrundgeräusche führen bei jeder Methode zu Fehlern.',
        'Klären Sie vor dem Start drei Dinge: in welcher Sprache im Video gesprochen wird, ob Sie in jeder Zeile eine Zeitangabe brauchen und wie lang das Video ist. Das Zweite sagt Ihnen, welche Formate Sie herunterladen können müssen; das Dritte, welche kostenlosen Grenzen Sie ausbremsen werden.',
      ],
    },
    {
      title: 'Weg 1: das Transkript nutzen, das YouTube schon hat',
      paragraphs: [
        'Viele YouTube-Videos haben Untertitel, vom Kanalbetreiber geschrieben oder automatisch erstellt. Öffnen Sie auf einer Videoseite die Beschreibung: Wo Untertitel vorhanden sind, erscheint dort eine Option, das Transkript anzuzeigen, und es listet den Text mit Zeitangaben auf, den Sie kopieren können. Wenn das Video von Ihnen ist, gibt es im YouTube Studio den Bereich „Untertitel“, in dem Sie die Untertitel prüfen und herunterladen können. YouTube ändert diese Bildschirme von Zeit zu Zeit, die Bezeichnungen können daher etwas abweichen.',
      ],
      after: [
        'Das ist der schnellste Weg für ein Video, das schon auf YouTube liegt. Seine Grenzen: Er funktioniert nur mit dem Link zu einem Video mit Untertiteln, der automatische Text kann bei Namen und Fachbegriffen holprig sein, und bei einer Datei auf Ihrem Computer oder Handy hilft er nicht.',
      ],
    },
    {
      title: 'Weg 2: das Video abspielen und die Diktierfunktion zuhören lassen',
      paragraphs: [
        'Die Diktierfunktion in einem Textverarbeitungsprogramm, etwa die Option „Spracheingabe“ im Menü „Tools“ von Google Docs, schreibt auf, was ihr Mikrofon hört. Sie spielen das Video über Ihre Lautsprecher ab, und sie tippt mit.',
        'Sie kostet nichts, hört aber den ganzen Raum und nicht nur das Video. Sie liefert keine Zeitangaben, sie läuft in Echtzeit, ein einstündiges Video dauert also eine Stunde, und alles, was das Mikrofon verpasst, ist verloren. Für ein oder zwei Zitate ist sie in Ordnung, für eine Vorlesung oder ein Interview eine schlechte Wahl.',
      ],
    },
    {
      title: 'Weg 3: automatische Untertitel in einem Videoschnittprogramm einschalten',
      paragraphs: [
        'Manche Videoschnittprogramme können die Sprache eines Clips transkribieren, den Sie dort einfügen. Die eigene Anleitung von Microsoft Clipchamp sagt zum Beispiel, man solle den Tab „Untertitel“ öffnen, automatische Untertitel einschalten und die Untertitel dann als SRT-Datei herunterladen; damit das funktioniert, muss das Video Sprache im Ton haben.',
        'Das ist nützlich, wenn Sie das Video ohnehin schneiden, denn die Untertitel landen auf der Zeitleiste. Für ein einfaches Transkript ist es mehr Aufwand als nötig: Sie müssen das Video in das Schnittprogramm laden, und der Text kommt als Untertiteldatei heraus, die Sie anschließend in ein Dokument umwandeln.',
      ],
    },
    {
      title: 'Weg 4: einen Online-Transkriptionsdienst nutzen',
      paragraphs: [
        'Dutzende Seiten transkribieren eine Datei, die Sie ihnen geben. Die meisten sind nur bis zu einem gewissen Punkt kostenlos: ein paar Minuten, ein paar Dateien oder eine Vorschau, die Sie vor dem Download zum Bezahlen auffordert. Entscheidend sind die Unterschiede: ob Sie ein Konto brauchen, wie viele Minuten Sie bekommen, wie groß eine Datei sein darf und ob sich das Ergebnis exportieren lässt.',
        'Dienste sind die richtige Wahl, wenn Sie etwas brauchen, das einfache Tools nicht leisten: Namen für jeden Sprecher, einen Bot, der einer Besprechung beitritt, oder einen Link zu einem Video, das Sie nicht als Datei haben. Unser Ratgeber mit den kostenlosen Grenzen von dreizehn davon, jeweils von der eigenen Seite zitiert, ist unten verlinkt.',
      ],
    },
    {
      title: 'Weg 5: die Datei mit TranscribeVid transkribieren',
      paragraphs: [
        'TranscribeVid nimmt die Videodatei selbst an, ohne Konto und ohne Tageslimit. Es lässt Whisper laufen, ein offenes Spracherkennungsmodell, und liefert den Text mit einer Zeitangabe in jeder Zeile zurück.',
        'Es nimmt keine Links an, kennzeichnet nicht, wer spricht, und tritt keinen Besprechungen bei. Für diese Aufgaben nehmen Sie einen Dienst aus Weg 4.',
      ],
      browser: {
        paragraphs: [
          'TranscribeVid nimmt die Videodatei selbst an, ohne Konto, ohne Tageslimit und ohne Größenlimit. Es lässt Whisper, ein offenes Spracherkennungsmodell, in Ihrem Browser laufen, sodass das Video auf Ihrem Gerät bleibt, und der Text kommt mit einer Zeitangabe in jeder Zeile zurück.',
          'Es nimmt keine Links an, kennzeichnet nicht, wer spricht, und tritt keinen Besprechungen bei. Für diese Aufgaben nehmen Sie einen Dienst aus Weg 4. Weil Ihr eigenes Gerät die Arbeit erledigt, ist ein langes Video auf einem alten Handy langsamer als auf einem aktuellen Laptop.',
        ],
      },
      steps: [
        { title: 'Video hinzufügen', text: 'Legen Sie die Datei im Feld auf der Tool-Seite ab oder klicken Sie auf „Datei auswählen“. MP4, MOV, MKV, WEBM und die meisten anderen Videodateien funktionieren, ebenso Audiodateien.' },
        { title: 'Sprache und Qualität wählen', text: 'Nennen Sie die gesprochene Sprache, wenn Sie sie kennen. „Standard“ passt für die meisten Videos; wählen Sie „Hohe Genauigkeit“ oder „Beste Genauigkeit“ bei Akzenten, Rauschen oder Hindi.' },
        { title: 'Auf den Text warten', text: 'Die Zeilen erscheinen nach und nach, mit einem Fortschrittsbalken und der verbleibenden Zeit.' },
        { title: 'Bearbeiten und herunterladen', text: 'Korrigieren Sie jede Zeile im Editor und laden Sie dann TXT, SRT, VTT, PDF, Markdown oder JSON herunter. Laden Sie herunter, was Sie behalten möchten, bevor Sie gehen.' },
      ],
    },
    {
      title: 'Welcher Weg für welches Video',
      table: {
        caption: 'Die fünf Wege im Überblick, wie in diesem Ratgeber beschrieben',
        head: ['Weg', 'Kosten', 'Zeitangaben in jeder Zeile', 'Funktioniert mit', 'Am besten für'],
        rows: [
          ['YouTube-Transkript', 'Kostenlos', 'Ja', 'Einem YouTube-Video mit Untertiteln', 'Eine schnelle Kopie von einem Video, das schon online ist'],
          ['Diktierfunktion', 'Kostenlos', 'Nein', 'Allem, was Sie laut abspielen können', 'Ein paar Zitate'],
          ['Untertitel im Schnittprogramm', 'Je nach Programm', 'Ja, als Untertitel', 'Einem Clip, der im Schnittprogramm geladen ist', 'Ein Video, das Sie ohnehin schneiden'],
          ['Online-Dienst', 'Bis zu einer Grenze kostenlos, danach kostenpflichtig', 'Meist', 'Dateien, manchmal auch Links', 'Sprechernamen, Besprechungen, Links'],
          ['TranscribeVid', 'Kostenlos', 'Ja', 'Einer Video- oder Audiodatei', 'Eine Datei, mit TXT- und Untertiteldateien zurück'],
        ],
      },
    },
    {
      title: 'Den Text korrigieren, bevor Sie ihn verwenden',
      paragraphs: [
        'Welchen Weg Sie auch wählen: Lesen Sie das Ergebnis einmal bei laufendem Video durch. Spracherkennung trifft gewöhnliche Wörter gut und stolpert über das, was Ihnen am wichtigsten ist: Namen, Produktbegriffe, Zahlen und alles, was schnell gesagt wird.',
      ],
      bullets: [
        { title: 'Namen und Begriffe.', text: 'Suchen Sie im Text nach jedem Namen, von dem Sie wissen, dass er im Video vorkommt, und korrigieren Sie jede Stelle.' },
        { title: 'Zahlen und Daten.', text: 'Prüfen Sie jede am Video; eine falsche Ziffer übersieht man leicht.' },
        { title: 'Wo der Sprecher wechselt.', text: 'Fügen Sie einen Zeilenumbruch und einen Namen ein, denn einfache Transkripte kennzeichnen nicht, wer spricht.' },
        { title: 'Untertitel.', text: 'Wenn Sie eine SRT- oder VTT-Datei verwenden, halten Sie jede Zeile so kurz, dass sie in der Zeit, in der sie im Bild steht, gelesen werden kann.' },
      ],
      after: [
        'Eine längere Liste von Gewohnheiten, die vor dem Start Fehler verringern, finden Sie im Ratgeber dazu, wie Sie ein genaueres Transkript bekommen.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Kann ich ein Video in Text umwandeln, ohne etwas zu installieren?',
      answer: 'Ja. Das YouTube-Transkript, ein Online-Dienst und TranscribeVid funktionieren alle in einem Webbrowser. Nur ein Videoschnittprogramm oder ein Desktop-Programm muss installiert werden.',
    },
    {
      question: 'Was ist der schnellste Weg, ein einstündiges Video zu transkribieren?',
      answer: 'Wenn es auf YouTube mit Untertiteln liegt, ist das Transkript dort sofort da. Bei einer Datei ist Software weit schneller als Tippen oder Diktieren, die beide mindestens so lange dauern, wie das Video läuft. Wie lange Software braucht, hängt vom Tool, von der Qualitätsstufe und, wenn sie auf Ihrem Gerät läuft, von dessen Geschwindigkeit ab.',
    },
    {
      question: 'Muss ich zuerst den Ton aus dem Video herausziehen?',
      answer: 'Nein. Tools, die Videodateien annehmen, lesen die Tonspur selbst, Sie können also ein MP4 oder MOV so hinzufügen, wie es ist. Den Ton vorher herauszuziehen hilft nur, wenn ein Tool das Videoformat ablehnt.',
    },
    {
      question: 'Wie bekomme ich den Text mit einer Zeitangabe in jeder Zeile?',
      answer: 'Nutzen Sie einen Weg, der Untertitel oder ein Transkript mit Zeitangaben exportiert: Das YouTube-Transkript listet Zeiten auf, und ein Tool, das SRT oder VTT herunterlädt, gibt jeder Zeile eine Start- und eine Endzeit. Die Diktierfunktion liefert keine.',
    },
  ],
  links: [
    {
      label: 'Kostenlose Video-zu-Text-Tools im Vergleich',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Die kostenlosen Grenzen von dreizehn Online-Tools, jeweils von der eigenen Seite zitiert.',
    },
    {
      label: 'So bekommen Sie ein genaueres Transkript',
      path: '/guides/accurate-transcripts',
      note: 'Gewohnheiten und Einstellungen, die bei jedem Video Fehler verringern.',
    },
    {
      label: 'Untertitel für Ihr Video erstellen',
      path: '/srt-subtitle-generator',
      note: 'Machen Sie aus demselben Video eine SRT-Datei für Player und Schnittprogramme.',
    },
    {
      label: 'Video transkribieren, ohne es hochzuladen',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Wie die Arbeit auf Ihrem Gerät bleibt und wie Sie es selbst prüfen können.',
    },
  ],
};
