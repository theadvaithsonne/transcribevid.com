import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'YouTube-Untertitel-Generator',
  h1: 'Untertitel für Ihr eigenes YouTube-Video erstellen',
  lead: 'Fügen Sie die Videodatei hinzu, die Sie für YouTube erstellt haben, erhalten Sie eine SRT-Datei, die auf die Sprache abgestimmt ist, und laden Sie sie in YouTube Studio hoch. Kostenlos, ohne Anmeldung, und Sie prüfen jede Zeile vor der Veröffentlichung.',
  dropKind: 'video',
  dropNoun: 'Video',

  whyTitle: 'Warum eine eigene Untertiteldatei hochladen',
  why: [
    'YouTube erstellt für viele Videos automatische Untertitel, aber sie sind nicht immer richtig, und sie erscheinen erst, wenn YouTube das Video fertig verarbeitet hat. Mit einer eigenen Untertiteldatei prüfen und korrigieren Sie jede Zeile, mit Ihren Namen, Produkten und Begriffen so geschrieben, wie Sie sie schreiben.',
    'Diese Seite ist für Videos, die Sie selbst gemacht haben. Sie arbeitet mit der Videodatei auf Ihrem Computer, nicht mit einem YouTube-Link: Das Einfügen eines Links wird nicht unterstützt. Wenn das Video von Ihnen ist, haben Sie das Original aus Ihrer Kamera oder Ihrem Schnittprogramm bereits. TranscribeVid ist ein unabhängiges Werkzeug und steht in keiner Verbindung zu YouTube: Es meldet sich nie bei Ihrem Kanal an, die fertige Datei fügen Sie dort also selbst hinzu.',
  ],

  sections: [
    {
      title: 'Die SRT-Datei in YouTube Studio hinzufügen',
      paragraphs: [
        'Menünamen in YouTube Studio ändern sich von Zeit zu Zeit, verstehen Sie diese Schritte daher als Orientierung und folgen Sie den Beschriftungen, die Sie auf dem Bildschirm sehen.',
      ],
      bullets: [
        {
          title: 'Untertitel öffnen.',
          text: 'Melden Sie sich bei Ihrem Kanal an, öffnen Sie YouTube Studio und wählen Sie im Menü links „Untertitel“.',
        },
        {
          title: 'Video auswählen.',
          text: 'Wählen Sie das Video, das Sie untertiteln möchten. Fragt YouTube nach der Sprache des Videos, legen Sie sie zuerst fest.',
        },
        {
          title: 'Sprache hinzufügen.',
          text: 'Wählen Sie „Sprache hinzufügen“, wählen Sie die Sprache der Datei und dann unter „Untertitel“ „Hinzufügen“.',
        },
        {
          title: 'Datei hochladen.',
          text: 'Wählen Sie „Datei hochladen“, dann „Mit Zeitangaben“, und wählen Sie die heruntergeladene .srt-Datei. Prüfen Sie die Zeilen in der Vorschau und klicken Sie dann auf „Veröffentlichen“.',
        },
      ],
    },
    {
      title: 'Englische Untertitel aus einer anderen Sprache',
      paragraphs: [
        'Wird im Video in einer anderen Sprache gesprochen, stellen Sie vor dem Start unter „Weitere Optionen“ „Ausgabe“ auf „Ins Englische übersetzen“. Sie erhalten englischen Text, der auf die Sprache abgestimmt ist und den Sie als englische Untertitelspur hochladen können. Übersetzung ist Maschinenarbeit, lesen Sie das Englische daher durch, bevor es online geht.',
        'TranscribeVid übersetzt nicht in andere Sprachen als Englisch. Für jede weitere Sprache, für die Sie eine Datei haben, fügen Sie in YouTube Studio eine eigene Spur hinzu.',
      ],
    },
    {
      title: 'Warum sich Untertitel lohnen',
      paragraphs: [
        'Menschen schauen an Orten, an denen sie den Ton nicht aufdrehen können, und viele folgen einer Zweitsprache schriftlich besser als nach Gehör. Untertitel helfen außerdem gehörlosen und schwerhörigen Zuschauern, und sie machen Ihre gesprochenen Worte zu Text, der durchsucht und zitiert werden kann.',
      ],
    },
  ],

  howTitle: 'So erstellen Sie Untertitel für ein YouTube-Video',
  howToDescription:
    'Fügen Sie die Videodatei hinzu, wählen Sie die gesprochene Sprache, prüfen Sie die Zeilen, laden Sie eine SRT-Datei herunter und laden Sie sie in YouTube Studio hoch.',
  steps: [
    {
      title: 'Videodatei hinzufügen',
      text: 'Wählen Sie die Videodatei, die Sie bei YouTube hochgeladen haben, nicht einen Link dorthin: Legen Sie sie auf dem Feld oben auf dieser Seite ab oder klicken Sie auf „Datei auswählen“. Für ein zweites Video nutzen Sie „Weitere Datei hinzufügen“ auf der nächsten Seite.',
    },
    {
      title: 'Sprache wählen',
      text: 'Wählen Sie auf der nächsten Seite die gesprochene Sprache oder lassen Sie „Automatisch erkennen“ aktiviert. Lassen Sie „Zeitmarken pro Wort“ unter „Weitere Optionen“ eingeschaltet, damit jede Zeile mit den Wörtern beginnt und endet. Klicken Sie dann auf „Transkribieren“.',
    },
    {
      title: 'Zeilen prüfen',
      text: 'Öffnen Sie das Transkript, spielen Sie ab einem beliebigen Zeitstempel ab und korrigieren Sie falsche Wörter, Namen und Zahlen. Löschen Sie Zeilen, die nicht angezeigt werden sollen.',
    },
    {
      title: 'SRT herunterladen und hochladen',
      text: 'Laden Sie die SRT-Datei herunter und fügen Sie sie in YouTube Studio wie oben beschrieben dem Video hinzu.',
    },
  ],

  formatsTitle: 'Videodateien und Untertiteldateien',
  formatsIntro:
    'Fügen Sie die Videodatei hinzu, die Sie für YouTube erstellt haben, in einem dieser Typen, und laden Sie die Untertitel im benötigten Format herunter.',
  uploadTitle: 'Videodateien, die Sie hinzufügen können',
  accepts: ['MP4', 'MOV', 'M4V', 'WEBM', 'MKV', '3GP'],
  downloads: [
    { name: 'SRT', use: 'die Untertiteldatei, nach der YouTube Studio fragt' },
    { name: 'VTT', use: 'WebVTT, für Web-Player' },
    { name: 'TXT', use: 'ein Transkript für Ihre Beschreibung oder einen Blogbeitrag' },
    { name: 'Markdown', use: 'Text mit Zeitstempeln' },
    { name: 'JSON', use: 'jede Zeile und Zeit, für Programme' },
    { name: 'PDF', use: 'ein druckbares Skript' },
  ],

  tipsTitle: 'Tipps für YouTube-Untertitel',
  tips: [
    {
      title: 'Nehmen Sie den finalen Schnitt.',
      text: 'Erstellen Sie die Datei aus genau dem Video, das Sie hochladen, nicht aus einem früheren Entwurf. Jede Bearbeitung, die die Sprache verschiebt, verschiebt auch das Timing.',
    },
    {
      title: 'Lassen Sie die Zeitmarken pro Wort eingeschaltet.',
      text: 'Sie sind standardmäßig aktiviert und ergeben ein genaueres Untertitel-Timing als das Timing ganzer Sätze.',
    },
    {
      title: 'Korrigieren Sie Namen vor der Veröffentlichung.',
      text: 'Automatischer Text liegt bei Kanalnamen, Produkten und Zahlen am häufigsten falsch. Ein Wortschatz-Hinweis hilft, und ein Durchlesen fängt den Rest ab.',
    },
    {
      title: 'Lesen Sie es ohne Ton.',
      text: 'Schauen Sie das Video stummgeschaltet mit eingeschalteten Untertiteln. Sie sehen sofort, welche Zeilen zu schnell verschwinden, um sie zu lesen.',
    },
  ],

  faqs: [
    {
      question:
        'Kann ich Untertitel für ein YouTube-Video erstellen, das ich nicht hochgeladen habe?',
      answer:
        'Nein. Dieses Werkzeug arbeitet nur mit Dateien, nicht mit Links, und ist für Videos gedacht, die Sie gemacht haben oder verwenden dürfen. Für Ihre eigenen Videos nutzen Sie die Originaldatei aus Ihrer Kamera oder Ihrem Schnittprogramm.',
    },
    {
      question: 'Welche Datei will YouTube Studio, SRT oder VTT?',
      answer:
        'SRT ist die sicherste Wahl: Es ist ein weit verbreitetes Format, das YouTube Studio liest. Laden Sie es mit Zeitangaben hoch, damit die Zeilen zur Sprache passen.',
    },
    {
      question: 'Muss ich mich anmelden, um die Untertiteldatei zu erstellen?',
      answer:
        'Nein. Sie brauchen hier kein Konto. Sie brauchen nur Ihren YouTube-Kanal, um die Datei in YouTube Studio hochzuladen.',
    },
    {
      question: 'Wie bekomme ich englische Untertitel für ein Video auf Spanisch oder Hindi?',
      answer:
        'Stellen Sie vor dem Start unter „Weitere Optionen“ „Ausgabe“ auf „Ins Englische übersetzen“. Das Transkript kommt auf Englisch mit Zeiten heraus. Die Übersetzung erfolgt automatisch und kann Fehler enthalten, lesen Sie sie daher, bevor Sie sie als englische Spur veröffentlichen.',
    },
    {
      question: 'Warum sind meine Untertitel auf YouTube nicht synchron?',
      answer:
        'Meist wurde die Datei aus einer anderen Version des Videos erstellt, zum Beispiel bevor der Anfang gekürzt wurde. Erstellen Sie die Datei erneut aus genau dem Video, das Sie hochgeladen haben. Das Timing liegt dicht daran, ist aber nicht bildgenau, eine abschließende Prüfung in YouTube Studio hilft daher.',
    },
  ],

  links: [
    {
      label: 'SRT-Untertitel-Generator',
      path: '/srt-subtitle-generator',
      note: 'Wie eine SRT-Datei von innen aussieht und wie Sie Zeilen vor dem Export korrigieren.',
    },
    {
      label: 'So fügen Sie einem Video Untertitel hinzu',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Weitere Einsatzorte der Datei: Mediaplayer, Schnittprogramme und Ihre eigene Webseite.',
    },
    {
      label: 'Sprache ins Englische übersetzen',
      path: '/translate-audio-to-english',
      note: 'Englischer Text aus Sprache in einer anderen Sprache und was Sie danach prüfen sollten.',
    },
    {
      label: 'SRT oder VTT: welches Untertitelformat nutzen',
      path: '/guides/srt-vs-vtt',
      note: 'Wie sich die beiden gängigen Untertitelformate unterscheiden.',
    },
  ],
};
