import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'VTT-Untertitel-Generator',
  h1: 'WebVTT-Untertiteldatei (.vtt) aus einem Video erstellen',
  lead: 'Fügen Sie eine Video- oder Audiodatei hinzu und laden Sie eine WebVTT-Untertiteldatei herunter, die auf die Sprache abgestimmt ist. Kostenlos, ohne Anmeldung, und Sie können die Zeilen vor dem Export korrigieren. Nutzen Sie sie mit dem HTML5-Video-Element oder jedem Web-Player.',
  dropKind: 'video',
  dropNoun: 'Video',

  whyTitle: 'Was WebVTT ist und warum das Web es nutzt',
  why: [
    'WebVTT (.vtt) ist das Untertitelformat des Webs. Es ist eine Textdatei, die Browser von Haus aus verstehen: Verweisen Sie mit dem Track-Element eines Videos auf eine .vtt-Datei, und die Untertitel erscheinen, ohne Plugin und ohne Skript.',
    'Es sieht SRT sehr ähnlich, mit einigen Unterschieden, die zählen. Eine VTT-Datei beginnt mit dem Wort WEBVTT, nutzt vor den Millisekunden einen Punkt statt eines Kommas und braucht keine nummerierten Einträge. Die meisten Web-Player lesen sie. Wenn Sie nicht sicher sind, welches Format Sie brauchen, erklärt der Ratgeber zu SRT und VTT die Wahl.',
  ],

  sections: [
    {
      title: 'So nutzen Sie eine VTT-Datei auf Ihrer Webseite',
      paragraphs: [
        'Speichern Sie die .vtt-Datei neben Ihrem Video und fügen Sie dann ein Track-Element innerhalb des Video-Elements hinzu, zum Beispiel: <track kind="subtitles" src="captions.vtt" srclang="en" label="English" default>. Die Attribute bewirken Folgendes.',
      ],
      bullets: [
        {
          title: 'kind.',
          text: 'Verwenden Sie subtitles für die gesprochenen Worte. Verwenden Sie captions, wenn die Datei auch andere Geräusche beschreibt, etwa Musik oder Lachen.',
        },
        {
          title: 'srclang.',
          text: 'Die Sprache der Datei als kurzer Code, zum Beispiel en für Englisch oder es für Spanisch. Fügen Sie für jede Sprache, die Sie haben, ein eigenes Track-Element hinzu.',
        },
        {
          title: 'label und default.',
          text: 'label ist der Name, der im Untertitelmenü des Players angezeigt wird. default schaltet diese Spur beim Laden der Seite ein.',
        },
      ],
    },
    {
      title: 'Warum die Untertitel nicht erscheinen: die üblichen Ursachen',
      paragraphs: [
        'Halten Sie die .vtt-Datei auf derselben Seite wie die Webseite. Eine Datei auf einer anderen Domain braucht die richtigen Cross-Origin-Header von ihrem Server, und das Video-Element braucht ein crossorigin-Attribut, sonst ignoriert der Browser sie stillschweigend. Prüfen Sie außerdem, dass die erste Zeile der Datei WEBVTT lautet und dass die Untertitel in den Player-Steuerelementen eingeschaltet sind.',
      ],
    },
    {
      title: 'Was dieser Generator tut und was nicht',
      paragraphs: [
        'Er macht aus der Sprache in Ihrem Video zeitgestempelten Text. Die Zeilen werden an Satzenden und Pausen umbrochen, in Zeilen von etwa 42 Zeichen mit höchstens zwei Zeilen, und die Datei enthält nur zeitgestempelten Text. Er übersetzt nicht in andere Sprachen (außer ins Englische, über „Ausgabe“ unter „Weitere Optionen“), fügt keine Sprechernamen hinzu, erstellt keine Formatierung oder Kapitelmarken und brennt die Untertitel nicht ins Bild ein. WebVTT selbst unterstützt Formatierung und Kapitel, und Sie können sie in einem Texteditor von Hand ergänzen.',
      ],
    },
  ],

  howTitle: 'So erstellen Sie eine VTT-Untertiteldatei',
  howToDescription:
    'Fügen Sie ein Video hinzu, wählen Sie die Sprache, prüfen Sie die Zeilen und laden Sie die Untertitel als WebVTT-Datei herunter.',
  steps: [
    {
      title: 'Video hinzufügen',
      text: 'Legen Sie ein Video im Feld oben auf dieser Seite ab oder klicken Sie auf „Datei auswählen“. Eine reine Tondatei funktioniert ebenfalls, wenn zeitgestempelter Text alles ist, was Sie brauchen. Auf der nächsten Seite holt „Weitere Datei hinzufügen“ weitere herein.',
    },
    {
      title: 'Sprache wählen',
      text: 'Wählen Sie auf der nächsten Seite die gesprochene Sprache oder lassen Sie „Automatisch erkennen“ aktiviert. Lassen Sie „Zeitmarken pro Wort“ unter „Weitere Optionen“ eingeschaltet: Anfang und Ende jeder Zeile folgen dann den Wörtern. Klicken Sie dann auf „Transkribieren“.',
    },
    {
      title: 'Zeilen prüfen',
      text: 'Lesen Sie das Transkript durch, spielen Sie ab einem Zeitstempel ab, um es zu prüfen, und korrigieren Sie falsche Wörter. Löschen Sie die Zeilen, die Sie nicht in den Untertiteln haben möchten.',
    },
    {
      title: 'VTT herunterladen',
      text: 'Wählen Sie VTT in den Download-Optionen. Ihre Änderungen sind enthalten. SRT steht aus demselben Transkript zur Verfügung, falls ein Player es braucht.',
    },
  ],

  formatsTitle: 'Das VTT-Format und unterstützte Dateien',
  formatsIntro:
    'Fügen Sie eine beliebige Video- oder Audiodatei hinzu und laden Sie WebVTT herunter. So sieht eine VTT-Datei von innen aus:',
  uploadTitle: 'Dateien, die Sie hinzufügen können',
  accepts: ['MP4', 'WEBM', 'MOV', 'MKV', 'M4V', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'VTT', use: 'WebVTT für das HTML5-Video-Element und Web-Player' },
    { name: 'SRT', use: 'nummerierte Einträge, für die meisten Player und Schnittprogramme' },
    { name: 'TXT', use: 'dieselben Wörter ohne Zeiten' },
    { name: 'Markdown', use: 'Text mit Zeitstempeln' },
    { name: 'JSON', use: 'jede Zeile und Zeit, für Programme' },
    { name: 'PDF', use: 'ein druckbares Skript' },
  ],
  exampleLabel: 'Eine Beispiel-WebVTT-Datei',
  example: `WEBVTT

00:00:00.800 --> 00:00:03.600
Guten Morgen zusammen und herzlich willkommen.

00:00:04.000 --> 00:00:07.300
In diesem Video richten wir das Projekt von Grund auf ein.

00:00:07.700 --> 00:00:10.900
Fangen wir mit der Ordnerstruktur an.`,

  tipsTitle: 'Tipps für WebVTT-Dateien',
  tips: [
    {
      title: 'Testen Sie es in einem echten Browser.',
      text: 'Öffnen Sie Ihre Seite, starten Sie die Wiedergabe und schalten Sie die Untertitel in den Videosteuerungen ein. Tun Sie das in mehr als einem Browser, bevor Sie veröffentlichen.',
    },
    {
      title: 'Verwenden Sie den richtigen Sprachcode.',
      text: 'Setzen Sie srclang auf einen gültigen Code wie en, es oder hi. Ein falscher Code kann dazu führen, dass der Player die Spur falsch beschriftet oder auswählt.',
    },
    {
      title: 'Lesen Sie die Zeilen im Tempo.',
      text: 'Spielen Sie das Video ohne Ton und mit Untertiteln ab und prüfen Sie, ob jede Zeile lange genug auf dem Bildschirm bleibt, um gelesen zu werden.',
    },
    {
      title: 'Schreiben Sie Namen so, wie Sie sie haben möchten.',
      text: 'Tragen Sie Markennamen und Fachbegriffe vor dem Start im Wortschatz-Hinweis unter „Weitere Optionen“ ein, damit sie in jeder Zeile richtig herauskommen.',
    },
  ],

  faqs: [
    {
      question: 'Wie unterscheidet sich eine VTT-Datei von einer SRT-Datei?',
      answer:
        'Eine VTT-Datei beginnt mit der Zeile WEBVTT, schreibt Zeiten mit einem Punkt (00:00:01.000), wo SRT ein Komma verwendet (00:00:01,000), und braucht keine Eintragsnummern. Browser lesen VTT im Video-Element, während SRT einen Player oder ein Skript braucht, das es unterstützt.',
    },
    {
      question: 'Wie füge ich einem HTML-Video eine VTT-Datei hinzu?',
      answer:
        'Speichern Sie die .vtt-Datei neben dem Video und fügen Sie innerhalb des Video-Elements ein Track-Element hinzu, mit kind auf subtitles, src mit Verweis auf die Datei, srclang auf dem Sprachcode und einem label für das Menü.',
    },
    {
      question: 'Welche Player lesen VTT-Dateien?',
      answer:
        'Alle großen Browser lesen VTT über das Video-Element, und die meisten Web-Videoplayer lesen es ebenfalls. Manche Desktop-Player und Schnittprogramme bevorzugen SRT. Laden Sie dafür SRT aus demselben Transkript herunter.',
    },
    {
      question: 'Kann die VTT-Datei Kapitel oder Formatierung enthalten?',
      answer:
        'Die Datei, die TranscribeVid erstellt, enthält nur zeitgestempelten Text. WebVTT selbst unterstützt Formatierung und Kapitel, die Sie in einem Texteditor von Hand ergänzen können.',
    },
    {
      question: 'Warum erscheint meine VTT-Datei nicht im Player?',
      answer:
        'Häufige Ursachen sind eine erste Zeile, die nicht WEBVTT lautet, eine Datei auf einer anderen Domain ohne die richtigen Cross-Origin-Header, ein falsches srclang oder kind oder im Player ausgeschaltete Untertitel. Öffnen Sie die Datei in einem Texteditor und prüfen Sie die erste Zeile.',
    },
  ],

  links: [
    {
      label: 'SRT-Untertitel-Generator',
      path: '/srt-subtitle-generator',
      note: 'Dasselbe Transkript als nummerierte SRT-Datei, mit einem durchgespielten Beispiel.',
    },
    {
      label: 'SRT oder VTT: welches Untertitelformat nutzen',
      path: '/guides/srt-vs-vtt',
      note: 'Ein direkter Vergleich der beiden Formate und wo jedes funktioniert.',
    },
    {
      label: 'So fügen Sie einem Video Untertitel hinzu',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Vom Transkript zu veröffentlichten Untertiteln, für das Web und für andere Player.',
    },
    {
      label: 'WebM zu Text',
      path: '/webm-to-text',
      note: 'Für Bildschirm- und Browser-Aufnahmen, das Format, das am besten zu einer VTT-Datei passt.',
    },
  ],
};
