import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WebM zu Text',
  h1: 'WebM-Aufnahme in Text transkribieren',
  lead: 'WebM ist das Format, das Browser und Bildschirmrecorder speichern. Fügen Sie Ihr WebM-Video oder -Audio hinzu und erhalten Sie ein Transkript mit Zeitstempeln, kostenlos, ohne Anmeldung und ohne vorherige Umwandlung.',
  dropKind: 'video',
  dropNoun: 'WebM-Datei',

  whyTitle: 'Was in einer WebM-Datei steckt',
  why: [
    'WebM ist ein webfreundlicher Container. Er enthält meist VP8-, VP9- oder AV1-Video mit Opus- oder Vorbis-Ton. TranscribeVid liest nur den Ton, es spielt also keine Rolle, welcher Videocodec darin steckt, und eine WebM-Datei, die nur Audio enthält, funktioniert genauso gut.',
    'Opus, das Tonformat der meisten WebM-Dateien, wurde für Stimmen entwickelt, was diese Aufnahmen zu einer guten Quelle für ein Transkript macht. Das Ergebnis ist Text mit einer Zeit in jeder Zeile, bereit zum Durchsuchen, Zitieren oder Umwandeln in Untertitel.',
  ],

  sections: [
    {
      title: 'Woher WebM-Dateien kommen',
      paragraphs: [
        'Die meisten WebM-Dateien erzeugt der Browser selbst, deshalb tauchen sie auf, wann immer jemand online etwas aufnimmt.',
      ],
      bullets: [
        {
          title: 'Bildschirm- und Browser-Recorder.',
          text: 'Viele Erweiterungen zur Bildschirmaufnahme und Web-Recorder speichern WebM, weil es das Format ist, das ein Browser direkt aufnehmen kann.',
        },
        {
          title: 'Online-Sprachrecorder.',
          text: 'Eine Website, die Ihr Mikrofon aufnimmt, liefert oft eine .webm-Audiodatei. Sie sieht vielleicht aus wie eine Videodatei, enthält aber nur Ton.',
        },
        {
          title: 'Web-Apps, die Sie bauen oder testen.',
          text: 'Seiten, die mit der MediaRecorder-Funktion des Browsers aufnehmen, erzeugen in Chrome meist WebM. Firefox tut das für Video ebenso, aber seine reinen Tonaufnahmen sind oft Ogg, das diese Seite ebenfalls liest.',
        },
      ],
    },
    {
      title: 'Eine Eigenheit aufgenommener WebM-Dateien',
      paragraphs: [
        'Eine WebM-Datei, die live im Browser aufgenommen wurde, enthält oft keine Gesamtlänge. Manche Player zeigen dann eine unbekannte Dauer an oder können nicht vorspulen, was wie eine beschädigte Datei wirken kann. Der Ton selbst ist unversehrt, und das Transkript wird ganz normal daraus erstellt.',
        'Scheitert eine Aufnahme tatsächlich, ist die Ursache meist einfacher: Das Mikrofon war aus, in der Aufnahme ist also gar keine Sprache. Spielen Sie die Datei mit aufgedrehter Lautstärke ab, bevor Sie nach einem anderen Grund suchen.',
      ],
    },
  ],

  howTitle: 'So wandeln Sie eine WebM-Datei in Text um',
  howToDescription:
    'Fügen Sie die WebM-Datei hinzu, wählen Sie die gesprochene Sprache, prüfen Sie die Zeilen und laden Sie das Transkript als Text oder WebVTT-Untertitel herunter.',
  steps: [
    {
      title: 'WebM-Datei hinzufügen',
      text: 'Legen Sie die .webm-Datei im Feld oben auf dieser Seite ab oder klicken Sie auf „Datei auswählen“. Eine WebM-Datei, die nur Ton enthält, geht auf demselben Weg hinein. Bei mehreren Aufnahmen fügen Sie die erste hier hinzu und die anderen mit „Weitere Datei hinzufügen“ auf der nächsten Seite.',
    },
    {
      title: 'Sprache wählen',
      text: 'Wählen Sie auf der nächsten Seite die gesprochene Sprache oder lassen Sie bei einer Aufnahme in einer Sprache „Automatisch erkennen“ aktiviert. Die Qualität „Standard“ passt für klare Sprache von einem guten Mikrofon. Klicken Sie dann auf „Transkribieren“.',
    },
    {
      title: 'Zeilen prüfen',
      text: 'Sehen Sie zu, wie der Text Zeile für Zeile eintrifft. Öffnen Sie das Transkript, spielen Sie ab einem beliebigen Zeitstempel ab und korrigieren Sie die falschen Wörter.',
    },
    {
      title: 'Ergebnis herunterladen',
      text: 'Laden Sie TXT zum Lesen oder Durchsuchen herunter. Eine WebM-Datei gehört ins Web, VTT ist deshalb die naheliegende Untertiteldatei dafür. SRT und PDF gibt es ebenfalls.',
    },
  ],

  formatsTitle: 'WebM und andere Videoformate',
  formatsIntro: 'WebM ist einer von vielen Video- und Audiotypen, die dieses Feld annimmt.',
  uploadTitle: 'Dateien, die Sie hinzufügen können',
  accepts: ['WEBM', 'MP4', 'MKV', 'MOV', 'OGG', 'OPUS', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'TXT', use: 'die gesprochenen Worte als reiner Text' },
    { name: 'VTT', use: 'Untertitel für dieselbe WebM-Datei auf einer Webseite' },
    { name: 'SRT', use: 'Untertitel für Player und Schnittprogramme' },
    { name: 'Markdown', use: 'Notizen mit Zeiten' },
    { name: 'JSON', use: 'jede Zeile und Zeit, für Programme' },
    { name: 'PDF', use: 'ein Transkript zum Drucken oder Teilen' },
  ],

  tipsTitle: 'Tipps zum Transkribieren von WebM-Aufnahmen',
  tips: [
    {
      title: 'Schalten Sie das Mikrofon vor der Aufnahme ein.',
      text: 'Bildschirmrecorder nehmen oft nur das Bild auf, solange Sie nicht die Option für Mikrofon oder Systemton anhaken. Ohne Ton gibt es nichts zu transkribieren.',
    },
    {
      title: 'Rechnen Sie mit einer einzigen Tonspur.',
      text: 'Wenn Sie einen Meeting-Tab zusammen mit Ihrem eigenen Mikrofon aufgenommen haben, landen alle auf derselben Spur. Es gibt keine Sprecherkennzeichnungen, ergänzen Sie also beim Bearbeiten Namen.',
    },
    {
      title: 'Verwenden Sie VTT für das Web.',
      text: 'Das Video-Element eines Browsers liest VTT-Untertitel über das Track-Element. SRT liest es nicht, wählen Sie daher VTT für eine WebM-Datei auf Ihrer eigenen Seite.',
    },
    {
      title: 'Schneiden Sie sehr lange Aufnahmen.',
      text: 'Dateien über dem Größen- oder Längenlimit werden abgelehnt, schneiden Sie eine lange WebM-Datei daher vorher in Teile.',
      browser: {
        title: 'Lange Aufnahmen dauern länger.',
        text: 'Die Seite setzt kein Größen- oder Längenlimit. Eine lange Bildschirmaufnahme braucht trotzdem Zeit und freien Speicher, und ein älterer Browser lehnt eine sehr lange Datei unter Umständen ab, schneiden Sie sie auf dem Handy daher vorher in Teile.',
      },
    },
    {
      title: 'Listen Sie Namen und Befehle auf.',
      text: 'Tragen Sie bei einer Software-Demo Produktnamen, Befehle und Abkürzungen in den Wortschatz-Hinweis ein, damit sie so geschrieben werden, wie Sie sie schreiben.',
    },
  ],

  faqs: [
    {
      question:
        'Warum kann ich meine WebM-Datei auf dem Handy nicht abspielen, und kann ich sie trotzdem transkribieren?',
      answer:
        'Manche ältere Handys und Player können WebM nicht öffnen. Das spielt hier keine Rolle: TranscribeVid braucht nur den Ton, Sie können die Datei also trotzdem hinzufügen und ein Transkript erhalten.',
    },
    {
      question: 'Kann ich eine reine Audio-WebM-Datei transkribieren?',
      answer:
        'Ja. Manche Recorder speichern reine Tondateien mit der Endung .webm. Sie werden wie jede andere Audiodatei gelesen.',
    },
    {
      question: 'Spielt es eine Rolle, ob meine WebM-Datei VP8, VP9 oder AV1 verwendet?',
      answer:
        'Nein. Das Bild wird ignoriert. Wichtig ist, dass die Datei eine Tonspur in einem gängigen Format wie Opus hat.',
    },
    {
      question: 'Wie nutze ich die Untertitel mit einer WebM-Datei auf meiner eigenen Webseite?',
      answer:
        'Laden Sie die VTT-Datei herunter, speichern Sie sie neben dem Video und verweisen Sie mit einem Track-Element innerhalb des Video-Elements darauf. Die Seite zum VTT-Untertitel-Generator zeigt, wie die Datei aussieht, und das genaue Markup.',
    },
    {
      question: 'Warum hat meine Bildschirmaufnahme ein leeres Transkript geliefert?',
      answer:
        'Höchstwahrscheinlich enthält sie keine Sprache: Das Mikrofon war aus oder es wurden nur Systemgeräusche aufgenommen. Wenn Sie Menschen sprechen hören, aber keinen Text erhalten, lassen Sie „Audio verbessern“ unter „Weitere Optionen“ aktiviert und probieren Sie eine höhere Qualitätsstufe.',
    },
  ],

  links: [
    {
      label: 'VTT-Untertitel-Generator',
      path: '/vtt-subtitle-generator',
      note: 'Was eine WebVTT-Datei enthält und wie Sie sie an ein Video auf Ihrer eigenen Seite anhängen.',
    },
    {
      label: 'So fügen Sie einem Video Untertitel hinzu',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Der ganze Weg von der Aufnahme bis zu veröffentlichten Untertiteln, Schritt für Schritt.',
    },
    {
      label: 'Meeting-Aufzeichnung zu Text',
      path: '/meeting-recording-to-text',
      note: 'Für aufgezeichnete Gespräche und Webinare, einschließlich der Frage, wie Sie die Aufzeichnung aus dem Meeting-Werkzeug bekommen.',
    },
    {
      label: 'MP4 zu Text',
      path: '/mp4-to-text',
      note: 'Derselbe Dienst für MP4, das häufigste Videoformat.',
    },
  ],
};
