import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'SRT-Untertitel-Generator',
  h1: 'SRT-Untertitel aus einer Video- oder Audiodatei erstellen',
  lead: 'Laden Sie ein Video hoch und laden Sie eine fertige .srt-Datei herunter, in der jede Zeile auf die Sprache abgestimmt ist. Kostenlos, ohne Anmeldung, und Sie können den Text vor dem Export korrigieren.',
  dropKind: 'video',
  dropNoun: 'Video',

  whyTitle: 'Was eine SRT-Datei enthält',
  why: [
    'Eine SRT-Datei ist reiner Text. Sie listet nummerierte Einträge auf, jeweils mit einer Startzeit, einer Endzeit und den Wörtern, die auf dem Bildschirm erscheinen sollen. Die meisten Videoplayer, Schnittprogramme und Videoplattformen können eine laden, was sie zum sichersten Untertitelformat für den Anfang macht.',
    'Untertitel helfen gehörlosen und schwerhörigen Zuschauern, Menschen, die ohne Ton schauen, und allen, die eine Zweitsprache schriftlich besser verfolgen. Außerdem machen sie die Sprache in Ihrem Video durchsuchbar und zitierfähig.',
  ],

  howTitle: 'So erstellen Sie eine SRT-Datei',
  howToDescription:
    'Laden Sie ein Video hoch, wählen Sie die Sprache, prüfen Sie die Zeilen und laden Sie die Untertitel als SRT- oder VTT-Datei herunter.',
  steps: [
    {
      title: 'Video hochladen',
      text: 'Legen Sie Ihr Video im Feld oben auf dieser Seite ab oder klicken Sie auf „Datei auswählen“. Auch eine Audiodatei funktioniert, wenn Sie nur zeitgestempelten Text brauchen.',
    },
    {
      title: 'Sprache wählen',
      text: 'Wählen Sie die gesprochene Sprache. „Zeitmarken pro Wort“ ist standardmäßig aktiviert und sorgt für ein genaueres Untertitel-Timing.',
    },
    {
      title: 'Zeilen prüfen',
      text: 'Öffnen Sie das Transkript, spielen Sie ab einem beliebigen Zeitstempel ab und korrigieren Sie falsche Wörter. Löschen Sie Zeilen, die Sie nicht möchten.',
    },
    {
      title: 'SRT oder VTT herunterladen',
      text: 'Wählen Sie SRT für die meisten Player und Schnittprogramme oder VTT für Webseiten. Beide enthalten Ihre Änderungen.',
    },
  ],

  formatsTitle: 'Untertitelformate und unterstützte Dateien',
  formatsIntro:
    'Laden Sie eine beliebige Video- oder Audiodatei hoch und laden Sie die Untertitel als SRT oder VTT herunter. So sieht eine SRT-Datei von innen aus:',
  uploadTitle: 'Dateien, die Sie hochladen können',
  accepts: ['MP4', 'MKV', 'MOV', 'WEBM', 'AVI', 'MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'SRT', use: 'nummerierte Einträge mit Zeiten, die breiteste Unterstützung' },
    { name: 'VTT', use: 'WebVTT für HTML5-Video und Web-Player' },
    { name: 'TXT', use: 'dieselben Wörter ohne Zeiten' },
    { name: 'Markdown', use: 'Text mit Zeitstempeln' },
    { name: 'JSON', use: 'jede Zeile und Zeit, für Programme' },
    { name: 'PDF', use: 'ein druckbares Skript' },
  ],
  exampleLabel: 'Eine Beispiel-SRT-Datei',
  example: `1
00:00:01,000 --> 00:00:04,200
Willkommen zurück auf dem Kanal.

2
00:00:04,500 --> 00:00:07,800
Heute schauen wir uns an, wie Untertitel funktionieren.`,

  tipsTitle: 'Tipps für bessere Untertitel',
  tips: [
    {
      title: 'Halten Sie die Zeilen kurz.',
      text: 'Eine gängige Richtlinie sind zwei Zeilen mit etwa 42 Zeichen. Die Zeilen folgen der Sprache, sehr lange müssen daher unter Umständen in einem Untertitel-Editor geteilt werden.',
    },
    {
      title: 'Schauen Sie vor der Veröffentlichung nach.',
      text: 'Spielen Sie das Video mit eingeschalteten Untertiteln ab. Automatische Untertitel brauchen eine menschliche Prüfung, besonders bei Namen, Zahlen und Fachbegriffen.',
    },
    {
      title: 'Nutzen Sie einen Wortschatz-Hinweis.',
      text: 'Tragen Sie Namen und Fachbegriffe unter „Weitere Optionen“ ein, damit sie so geschrieben werden, wie Sie es möchten.',
    },
    {
      title: 'Wählen Sie das richtige Format.',
      text: 'SRT für Player, Schnittprogramme und die meisten Upload-Formulare. VTT für das HTML5-Video-Tag und Web-Player.',
    },
    {
      title: 'Sie brauchen englische Untertitel?',
      text: 'Stellen Sie unter „Weitere Optionen“ „Ausgabe“ auf „Ins Englische übersetzen“. Die Übersetzung erfolgt automatisch, lesen Sie sie daher vor der Veröffentlichung durch.',
    },
  ],

  faqs: [
    {
      question: 'Was ist eine SRT-Datei?',
      answer:
        'SubRip (.srt) ist ein Untertitelformat aus reinem Text. Jeder Eintrag hat eine Nummer, eine Start- und Endzeit und den anzuzeigenden Text. Jeder Texteditor kann sie öffnen.',
    },
    {
      question: 'Soll ich SRT oder VTT wählen?',
      answer:
        'Verwenden Sie SRT für Videoplayer, Schnittprogramme und die meisten Upload-Formulare. Verwenden Sie VTT (WebVTT), wenn Sie einer Webseite mit dem HTML5-Video-Element Untertitel hinzufügen. TranscribeVid exportiert beide aus demselben Transkript.',
    },
    {
      question: 'Werden die Untertitel in mein Video eingebrannt?',
      answer:
        'Nein. Sie erhalten eine separate Untertiteldatei, und das Video bleibt unverändert. Untertitel fest ins Bild einzubrennen erfordert ein Schnittprogramm.',
    },
    {
      question: 'Wie genau ist das Timing?',
      answer:
        'Das Timing folgt der Sprache und liegt meist dicht daran, ist aber nicht bildgenau. Prüfen Sie die erste und die letzte Zeile und passen Sie in einem Untertitel-Editor an, wenn Sie exakten Gleichlauf brauchen.',
    },
    {
      question: 'Kann ich Untertitel in einer anderen Sprache erstellen?',
      answer:
        'Sie können in der gesprochenen Sprache transkribieren (mehr als 50 werden unterstützt) oder Sprache ins Englische übersetzen. Die Übersetzung in andere Sprachen wird nicht angeboten.',
    },
  ],
};
