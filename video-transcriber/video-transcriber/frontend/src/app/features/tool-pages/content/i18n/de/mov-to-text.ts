import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MOV zu Text',
  h1: 'MOV-Video in Text transkribieren',
  lead: 'MOV ist das, was iPhones, Macs und viele Kameras aufnehmen. Fügen Sie Ihre MOV-Datei hinzu und erhalten Sie ein Transkript mit Zeitstempeln, kostenlos und ohne Anmeldung. Es wird nur der Ton gelesen, Größe und Codec des Bildes spielen also keine Rolle.',
  dropKind: 'video',
  dropNoun: 'MOV-Datei',

  whyTitle: 'Warum MOV-Dateien keine Umwandlung brauchen',
  why: [
    'MOV ist das QuickTime-Format von Apple. Wie eine MP4-Datei enthält es Bild und Ton zusammen, und die meisten MOV-Dateien tragen AAC-Ton, der direkt gelesen wird. TranscribeVid liest diesen Ton und ignoriert das Bild, ein eigener Schritt von MOV zu MP4 ist also nicht nötig.',
    'MOV-Dateien sind oft groß, weil Handys und Kameras in hoher Qualität aufnehmen. Sie müssen Ihre weder verkleinern noch umwandeln. Der schnellste Weg von der Fotomediathek zum Transkript ist, die Datei so hinzuzufügen, wie sie ist.',
  ],

  sections: [
    {
      title: 'Woher MOV-Dateien kommen',
      bullets: [
        {
          title: 'iPhone- und iPad-Videos.',
          text: 'Mit der Kamera-App aufgenommene Videos werden als .MOV-Dateien gespeichert, egal ob das Bildformat H.264 oder HEVC ist.',
        },
        {
          title: 'Bildschirmaufnahmen am Mac.',
          text: 'Die Screenshot-Symbolleiste (Umschalt-Befehl-5) und der QuickTime Player speichern Bildschirmaufnahmen als .mov. Wählen Sie vor der Aufnahme ein Mikrofon, sonst enthält die Datei keine Sprache.',
        },
        {
          title: 'Kameras und Schnittsoftware.',
          text: 'Viele spiegellose Kameras nehmen MOV auf, und Videoschnittprogramme wie Final Cut Pro und Adobe Premiere Pro können es exportieren.',
        },
      ],
    },
    {
      title: 'So bekommen Sie ein Video von Ihrem iPhone',
      paragraphs: [
        'Am einfachsten öffnen Sie diese Seite auf dem iPhone selbst und klicken auf „Datei auswählen“. Sie können ein Video aus der Fotomediathek oder aus „Dateien“ wählen. Fragt das Handy bei der Auswahl, welches Format verwendet werden soll, funktioniert jede Antwort, weil nur der Ton gelesen wird.',
        'Um stattdessen auf einem Computer zu transkribieren, schicken Sie das Video per AirDrop, speichern es in „Dateien“ oder iCloud Drive oder kopieren es per Kabel hinüber. Menünamen ändern sich zwischen Versionen von iOS und macOS, verstehen Sie dies daher als Orientierung.',
      ],
    },
    {
      title: 'Videos mit mehr als einer Tonspur',
      paragraphs: [
        'Manche Kameras und Schnittprogramme schreiben mehrere Tonspuren in eine MOV-Datei, zum Beispiel ein Kameramikrofon und ein Ansteckmikrofon. TranscribeVid verwendet die erste Tonspur, die es lesen kann. Liegt die gewünschte Sprache auf einer anderen Spur, exportieren Sie zuerst eine Kopie mit dieser Spur oder mischen Sie die Spuren in Ihrem Schnittprogramm zusammen.',
      ],
    },
  ],

  howTitle: 'So wandeln Sie eine MOV-Datei in Text um',
  howToDescription:
    'Fügen Sie das MOV-Video hinzu, wählen Sie gesprochene Sprache und Qualität, warten Sie auf das Transkript und laden Sie es herunter.',
  steps: [
    {
      title: 'MOV-Datei hinzufügen',
      text: 'Klicken Sie oben auf dieser Seite auf „Datei auswählen“ oder legen Sie die .mov-Datei im Feld ab. Ein iPhone bietet „Fotos“ und „Dateien“ an. In dieses Feld passt jeweils ein Video; „Weitere Datei hinzufügen“ reiht auf der nächsten Seite weitere ein.',
    },
    {
      title: 'Sprache und Qualität festlegen',
      text: 'Wählen Sie auf der nächsten Seite die gesprochene Sprache. „Standard“ wird empfohlen. Bei Wind, Verkehr oder einem weit entfernten Sprecher brauchen „Hohe Genauigkeit“ und „Beste Genauigkeit“ länger und machen weniger Fehler. Klicken Sie dann auf „Transkribieren“.',
      browser: {
        text: 'Wählen Sie auf der nächsten Seite die gesprochene Sprache. „Standard“ wird empfohlen. Bei Wind, Verkehr oder einem weit entfernten Sprecher probieren Sie „Hohe Genauigkeit“ oder „Beste Genauigkeit“, falls Ihr Gerät sie anbietet: Sie brauchen länger und machen weniger Fehler, jede ist ein größerer Download beim ersten Mal, und ein Gerät, das eine nicht ausführen kann, zeigt sie mit Begründung ausgegraut an. Klicken Sie dann auf „Transkribieren“.',
      },
    },
    {
      title: 'Lesen und korrigieren',
      text: 'Der Text trifft Zeile für Zeile ein, jede mit einer Zeit. Spielen Sie ab jeder Zeile ab, korrigieren Sie Falsches und löschen Sie Zeilen, die Sie nicht möchten.',
    },
    {
      title: 'Transkript herunterladen',
      text: 'Laden Sie TXT oder ein PDF zum Lesen herunter, oder SRT oder VTT als Untertitel in einem Videoschnittprogramm oder im Web. Ihre MOV-Datei wird nie verändert.',
    },
  ],

  formatsTitle: 'MOV und andere Videoformate',
  formatsIntro:
    'Dasselbe Feld nimmt MOV und diese anderen Typen an, dazu die üblichen Audioformate.',
  uploadTitle: 'Videodateien, die Sie hinzufügen können',
  accepts: ['MOV', 'MP4', 'M4V', 'MKV', 'WEBM', '3GP', 'TS'],
  downloads: [
    { name: 'TXT', use: 'die gesprochenen Worte als reiner Text' },
    { name: 'SRT', use: 'Untertitel für Schnittprogramme und Player' },
    { name: 'VTT', use: 'Untertitel für eine Webseite' },
    { name: 'PDF', use: 'ein Transkript zum Drucken oder Teilen' },
    { name: 'Markdown', use: 'Notizen mit Zeiten' },
    { name: 'JSON', use: 'Daten für eigene Werkzeuge' },
  ],

  tipsTitle: 'Tipps zum Transkribieren von MOV-Videos',
  tips: [
    {
      title: 'Lassen Sie „Audio verbessern“ aktiviert.',
      text: 'Handyvideos fangen Wind, Griffgeräusche und Raumhall ein. Der Schalter „Audio verbessern“ unter „Weitere Optionen“ entfernt tiefes Brummen und Rauschen und hebt leise Stimmen an.',
    },
    {
      title: 'Prüfen Sie, welche Spur die Stimme enthält.',
      text: 'Wenn eine Kamera zwei Mikrofone als getrennte Spuren aufgenommen hat, spielen Sie das Video ab und vergewissern Sie sich, dass die erste Spur die mit der Sprache ist.',
    },
    {
      title: 'Schneiden Sie lange Aufnahmen an natürlichen Pausen.',
      text: 'Dateien über dem Größen- oder Längenlimit werden abgelehnt. Schneiden Sie das Video in Teile oder exportieren Sie nur das Audio und fügen Sie es dann hinzu.',
      browser: {
        title: 'Lange Aufnahmen brauchen Speicher.',
        text: 'Die Seite setzt kein Größen- oder Längenlimit, aber ein langes Video braucht Zeit und freien Speicher, vor allem auf einem Handy, und ein älterer Browser lehnt eine sehr lange Datei unter Umständen ab. Exportieren Sie bei einer sehr langen Aufnahme nur das Audio aus Ihrem Schnittprogramm oder schneiden Sie das Video in Teile.',
      },
    },
    {
      title: 'Nehmen Sie bewusst mit Ton auf.',
      text: 'Eine Bildschirmaufnahme am Mac ohne Mikrofon enthält keine Sprache, und das Transkript bleibt leer.',
    },
  ],

  faqs: [
    {
      question: 'Kann ich ein iPhone-Video transkribieren, ohne MOV in MP4 umzuwandeln?',
      answer:
        'Ja. Fügen Sie die MOV-Datei so hinzu, wie sie ist. TranscribeVid liest die Tonspur und ignoriert das Bild, eine Umwandlung ist also nicht nötig.',
    },
    {
      question: 'Funktioniert ein 4K- oder HEVC-Video von meinem iPhone?',
      answer:
        'Ja. Es wird nur der Ton verwendet, Bildgröße und Videoformat spielen also keine Rolle. Es zählt die Tonspur, und Aufnahmen von iPhone und Mac verwenden AAC-Ton, der direkt gelesen wird.',
    },
    {
      question: 'Wie bekomme ich ein Video vom iPhone zum Transkribieren auf einen Computer?',
      answer:
        'Schicken Sie es per AirDrop an einen Mac, speichern Sie es in „Dateien“ oder iCloud Drive oder kopieren Sie es per Kabel hinüber. Oder sparen Sie sich den Computer: Öffnen Sie diese Seite auf dem iPhone und wählen Sie das Video aus „Fotos“.',
    },
    {
      question: 'Warum hat meine Bildschirmaufnahme am Mac keinen Text?',
      answer:
        'Eine Bildschirmaufnahme enthält nur dann Ton, wenn vor der Aufnahme ein Mikrofon gewählt wurde. Öffnen Sie in der Symbolleiste Umschalt-Befehl-5 die „Optionen“, wählen Sie ein Mikrofon und nehmen Sie erneut auf. Menünamen können sich zwischen macOS-Versionen unterscheiden.',
    },
    {
      question: 'Was passiert, wenn meine MOV-Datei zwei Tonspuren hat?',
      answer:
        'TranscribeVid verwendet die erste Tonspur, die es lesen kann. Liegt die Sprache auf einer anderen Spur, exportieren Sie zuerst eine Kopie mit dieser Spur oder mischen Sie die Spuren in Ihrem Schnittprogramm zusammen.',
    },
  ],

  links: [
    {
      label: 'MP4 zu Text',
      path: '/mp4-to-text',
      note: 'Derselbe Dienst für MP4-Dateien, das andere gängige Handyvideo-Format.',
    },
    {
      label: 'Video zu Text',
      path: '/video-to-text',
      note: 'Die Hauptseite für jede Videodatei, mit Tipps für Vorlesungen, Interviews und Clips.',
    },
    {
      label: 'SRT-Untertitel-Generator',
      path: '/srt-subtitle-generator',
      note: 'Erstellen Sie Untertitel für Ihre MOV-Datei und sehen Sie, wie eine SRT-Datei von innen aussieht.',
    },
    {
      label: 'So fügen Sie einem Video Untertitel hinzu',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Was Sie mit der Untertiteldatei tun, nachdem Sie sie heruntergeladen haben.',
    },
  ],
};
