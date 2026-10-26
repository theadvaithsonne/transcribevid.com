import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP4 zu Text',
  h1: 'MP4-Video in Text transkribieren',
  lead: 'MP4 ist das Format von Handykameras, Bildschirmaufnahmen und Meeting-Exporten. Laden Sie Ihre Datei hoch und erhalten Sie ein Transkript mit Zeitstempeln, kostenlos und ohne Anmeldung.',
  dropKind: 'video',
  dropNoun: 'MP4-Datei',

  whyTitle: 'Warum sich MP4-Dateien leicht transkribieren lassen',
  why: [
    'Eine MP4-Datei ist ein Container: Sie enthält Bild und Ton zusammen. TranscribeVid liest den Ton und ignoriert das Bild, es muss also nichts vorher konvertiert werden, und ein eigener Schritt von MP4 zu MP3 ist nicht nötig.',
    'Das passt zu Aufnahmen, die ohnehin als MP4 vorliegen, etwa Handyvideos, gespeicherte Zoom- oder Teams-Meetings, Bildschirmaufnahmen, Webinare und Vorlesungsaufzeichnungen. Das Ergebnis ist Text mit einer Uhrzeit in jeder Zeile, bereit zum Durchsuchen oder zum Umwandeln in Untertitel.',
  ],

  howTitle: 'So wandeln Sie eine MP4-Datei in Text um',
  howToDescription:
    'Laden Sie die MP4-Datei hoch, wählen Sie gesprochene Sprache und Qualität, warten Sie auf das Transkript und laden Sie es herunter.',
  steps: [
    {
      title: 'MP4-Datei finden',
      text: 'Suchen Sie die .mp4-Datei auf Ihrem Handy oder Computer. Sie müssen sie nicht komprimieren oder kürzen, es sei denn, sie überschreitet das Limit.',
      browser: {
        text: 'Suchen Sie die .mp4-Datei auf Ihrem Handy oder Computer. Sie müssen sie vorher nicht komprimieren oder kürzen.',
      },
    },
    {
      title: 'Hochladen',
      text: 'Legen Sie die MP4-Datei im Feld oben auf dieser Seite ab oder klicken Sie auf „Datei auswählen“. Im Uploader können mehrere MP4-Dateien gleichzeitig eingereiht werden.',
      browser: {
        title: 'Hinzufügen',
        text: 'Legen Sie die MP4-Datei im Feld oben auf dieser Seite ab oder klicken Sie auf „Datei auswählen“. Im Uploader können Sie mehrere MP4-Dateien hinzufügen; sie werden nacheinander transkribiert.',
      },
    },
    {
      title: 'Sprache und Qualität wählen',
      text: 'Wählen Sie die gesprochene Sprache. „Standard“ wird empfohlen. „Hohe Genauigkeit“ und „Beste Genauigkeit“ sind langsamer und machen weniger Fehler, „Am schnellsten“ ist bei klarer Sprache schnell.',
    },
    {
      title: 'Ergebnis herunterladen',
      text: 'Laden Sie TXT zum Lesen, SRT oder VTT als Untertitel für dieselbe MP4-Datei oder ein PDF zum Drucken herunter.',
    },
  ],

  formatsTitle: 'MP4 und andere Videoformate',
  formatsIntro:
    'MP4 ist der Normalfall, aber derselbe Upload akzeptiert diese Videotypen und die üblichen Audioformate ebenfalls.',
  uploadTitle: 'Videodateien, die Sie hochladen können',
  accepts: ['MP4', 'M4V', 'MOV', 'MKV', 'WEBM', 'AVI', 'WMV', 'FLV', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'die gesprochenen Worte als reiner Text' },
    { name: 'SRT', use: 'eine Untertiteldatei für dieselbe MP4-Datei' },
    { name: 'VTT', use: 'Untertitel für eine Webseite' },
    { name: 'PDF', use: 'ein Transkript zum Drucken oder Teilen' },
    { name: 'Markdown', use: 'Notizen mit Zeiten' },
    { name: 'JSON', use: 'Daten für eigene Werkzeuge' },
  ],

  tipsTitle: 'Tipps zum Transkribieren von MP4-Dateien',
  tips: [
    {
      title: 'Prüfen Sie, ob Ton vorhanden ist.',
      text: 'Eine Bildschirmaufnahme ohne Audio enthält keine Sprache zum Transkribieren und liefert ein leeres Ergebnis.',
    },
    {
      title: 'Achten Sie auf Wind und Raum.',
      text: 'Handyvideos leiden unter Wind, Abstand und Hall. Halten Sie das Handy näher heran oder verwenden Sie beim nächsten Mal ein externes Mikrofon.',
    },
    {
      title: 'Verkleinern Sie große Dateien, indem Sie nur das Audio exportieren.',
      text: 'Wenn eine MP4-Datei das Limit überschreitet, exportieren Sie in Ihrem Schnittprogramm nur das Audio (M4A oder MP3). Es ist weit kleiner und funktioniert genauso.',
      browser: {
        text: 'Eine sehr lange MP4-Datei braucht auf einem Handy viel Speicher. Exportieren Sie in Ihrem Schnittprogramm nur das Audio (M4A oder MP3): Es ist weit kleiner und funktioniert genauso.',
      },
    },
    {
      title: 'Legen Sie die SRT-Datei neben das Video.',
      text: 'Viele Player laden eine .srt-Datei automatisch, wenn sie denselben Namen wie das Video trägt.',
    },
    {
      title: 'Prüfen Sie Namen und Zahlen.',
      text: 'Automatische Transkripte liegen hier am häufigsten falsch. Suchen und Ersetzen behebt Wiederholungen in einem Rutsch.',
    },
  ],

  faqs: [
    {
      question: 'Muss ich MP4 vorher in MP3 umwandeln?',
      answer:
        'Nein. Laden Sie die MP4-Datei so hoch, wie sie ist. Der Ton wird für Sie aus der Datei gelesen.',
    },
    {
      question: 'Warum wurde meine MP4-Datei abgelehnt?',
      answer:
        'Dateien über dem Größen- oder Längenlimit werden vor der Verarbeitung abgelehnt. {limits} Schneiden Sie das Video in Teile oder exportieren Sie nur das Audio und laden Sie dann erneut hoch.',
      browser: {
        question: 'Warum hat meine MP4-Datei nicht funktioniert?',
        answer:
          'Ihr Browser konnte den Ton nicht lesen: Die Datei ist möglicherweise beschädigt, hat keine Tonspur oder verwendet ein seltenes Audioformat. Exportieren Sie das Audio in Ihrem Schnittprogramm als M4A oder MP3 und fügen Sie stattdessen diese Datei hinzu. Es gibt kein Größen- oder Längenlimit, aber sehr lange Videos brauchen genug freien Speicher.',
      },
    },
    {
      question: 'Kann ich damit Untertitel zu meiner MP4-Datei hinzufügen?',
      answer:
        'Sie erhalten eine Untertiteldatei (SRT oder VTT), die auf die Sprache abgestimmt ist. TranscribeVid bearbeitet oder codiert Ihre MP4-Datei nicht neu, Untertitel fest ins Bild einzubrennen erfordert daher ein Schnittprogramm.',
    },
    {
      question: 'Kann ich statt eines Uploads einen Link einfügen?',
      answer:
        'Nein. TranscribeVid arbeitet mit Dateien, die Sie hochladen oder aufnehmen, nicht mit Weblinks. Wenn das Video von Ihnen stammt, laden Sie die Originaldatei hoch.',
    },
    {
      question: 'Funktioniert es mit Zoom, Teams und Handyvideos?',
      answer:
        'Ja, jede MP4-Datei mit Sprache funktioniert. Bei Meetings werden keine Sprechernamen hinzugefügt, aber die Zeilen tragen Zeitstempel, sodass Sie beim Bearbeiten Namen ergänzen können.',
    },
  ],
};
