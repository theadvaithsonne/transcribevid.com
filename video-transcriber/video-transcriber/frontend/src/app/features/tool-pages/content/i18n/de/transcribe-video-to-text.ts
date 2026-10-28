import { ToolPageContent } from '../../../tool-page.model';

/** Die Grenzen anderer Seiten sind so zitiert, wie deren eigene Seiten am 28. Oktober 2026 lauteten; der verlinkte Ratgeber enthält die vollständige Tabelle mit Quellen. */
export const CONTENT: ToolPageContent = {
  eyebrow: 'Video in Text umwandeln',
  h1: 'Video in Text umwandeln: kostenlos, ohne Anmeldung, ohne Tageslimit',
  browserH1: 'Video in Text umwandeln: kostenlos, ohne Anmeldung, ohne Limit, ohne Upload',
  lead: 'Fügen Sie ein Video hinzu und erhalten Sie die Sprache als Text zurück, mit einer Zeitangabe in jeder Zeile. Sie müssen kein Konto anlegen und es gibt kein Tageslimit, das nächste Video kann also starten, sobald dieses fertig ist.',
  browserLead:
    'Fügen Sie ein Video hinzu und erhalten Sie die Sprache als Text zurück, mit einer Zeitangabe in jeder Zeile. Sie müssen kein Konto anlegen, es gibt kein Tageslimit und keine Begrenzung der Dateigröße, und das Video wird nie hochgeladen: Ihr eigenes Gerät erledigt die Arbeit.',
  dropKind: 'video',
  dropNoun: 'Video',

  whyTitle: 'Was „kostenlos“ beim Transkribieren eines Videos bedeuten sollte',
  why: [
    'Viele Seiten, die „kostenlose Video-Transkription“ versprechen, geben Ihnen eine Minute oder ein paar Dateien und verlangen dann ein Konto oder eine Karte. Prüfen Sie vor der Wahl vier Dinge: ob Sie sich anmelden müssen, wie viele Minuten oder Dateien Sie bekommen, wie groß eine Datei sein darf und ob Sie das Ergebnis herunterladen können.',
    'Hier ist die Antwort auf jede dieser Fragen einfach. Sie fügen das Video hinzu, es gibt nichts anzumelden, es gibt kein Tages- oder Monatskontingent, und das Transkript lässt sich ohne Kosten als TXT, SRT, VTT, PDF, Markdown oder JSON herunterladen. Das Tool kennzeichnet keine Sprecher und nimmt keine Links an: Sie fügen die Datei selbst hinzu.',
  ],
  browserWhy: [
    'Viele Seiten, die „kostenlose Video-Transkription“ versprechen, geben Ihnen eine Minute oder ein paar Dateien und verlangen dann ein Konto oder eine Karte. Prüfen Sie vor der Wahl vier Dinge: ob Sie sich anmelden müssen, wie viele Minuten oder Dateien Sie bekommen, wie groß eine Datei sein darf und ob Sie das Ergebnis herunterladen können.',
    'Hier ist die Antwort auf jede dieser Fragen einfach. Sie fügen das Video hinzu, es gibt nichts anzumelden, es gibt kein Tages- oder Monatskontingent und kein Größenlimit, und das Transkript lässt sich ohne Kosten als TXT, SRT, VTT, PDF, Markdown oder JSON herunterladen. Weil Ihr Gerät die Arbeit erledigt, ist dessen Speicher die einzige echte Grenze: Ein sehr langes Video kann für ein Handy zu viel sein, schneiden Sie es daher vorher in Teile. Das Tool kennzeichnet keine Sprecher und nimmt keine Links an: Sie fügen die Datei selbst hinzu.',
  ],

  sections: [
    {
      title: 'Kostenlose Grenzen anderer Seiten zur Video-Transkription, geprüft im Oktober 2026',
      paragraphs: [
        'Das sind Zitate von der jeweiligen Seite des Anbieters, so wie sie am 28. Oktober 2026 lautete, aus dem englischen Original ins Deutsche übersetzt. Tarife ändern sich, sehen Sie sich die Seite daher an, bevor Sie sich auf eine Zahl verlassen. Der Ratgeber, der am Ende dieser Seite verlinkt ist, enthält die vollständige Tabelle mit einem Link zu jeder Quelle.',
      ],
      bullets: [
        {
          title: 'Riverside.',
          text: '„Unbegrenzte Transkriptionen kostenlos. Keine Anmeldung erforderlich.“ Das kostenlose Tool nimmt MP3-, WAV-, MP4- und MOV-Dateien an und weist den gesamten Text einer Aufnahme mit mehreren Sprechern einem einzigen Sprecher zu.',
        },
        { title: 'VoiceCheap.', text: '„Kostenlos für Dateien bis zu 60 Minuten, mit 1 Transkription pro Tag.“' },
        { title: 'RecCloud.', text: '„Unser kostenloser Tarif erlaubt Videos mit einer Länge von bis zu 10 Minuten.“' },
        { title: 'Caption-X.', text: '„Der kostenlose Tarif umfasst insgesamt 5 Transkriptionen mit jeweils bis zu 5 Minuten.“' },
        { title: 'Maestra.', text: 'Eine „Vorschau von 1 Minute“ und „Melden Sie sich an, um Ihr Transkript herunterzuladen oder zu exportieren.“' },
        { title: 'Any2Text.', text: '„Die ersten 15 Minuten kostenlos“, danach $0.035 pro Minute.' },
      ],
    },
    {
      title: 'Wohin Ihr Video während der Transkription gelangt',
      paragraphs: [
        'Das Video wird an den Server gesendet, der diese Seite betreibt, dort transkribiert und am Ende Ihrer Sitzung gelöscht. Es wird nirgendwo sonst veröffentlicht.',
      ],
      browser: {
        paragraphs: [
          'Das Video bleibt auf Ihrem Gerät. Ihr Browser liest es, extrahiert den Ton und lässt das Whisper-Spracherkennungsmodell darauf laufen, sodass keine Datei an uns oder an jemand anderen gesendet wird.',
          'Heruntergeladen werden nur die Werkzeuge: die Seite, das Spracherkennungsmodell und die Engine, die es ausführt. Das Modell ist je nach Qualitätsstufe und Gerät zwischen etwa 77 MB und knapp über 1 GB groß und bleibt danach in Ihrem Browser gespeichert. Um es selbst zu sehen, öffnen Sie das Netzwerk-Fenster Ihres Browsers, während ein Video transkribiert wird.',
        ],
      },
    },
    {
      title: 'Vier Qualitätsstufen für unterschiedliche Videos',
      paragraphs: [
        '„Am schnellsten“ nutzt das kleine Modell Base und eignet sich für einen schnellen Entwurf bei klarer Sprache. „Standard“ nutzt ein größeres Modell und ist die übliche Wahl. „Hohe Genauigkeit“ nutzt Large v3 Turbo und kommt mit Akzenten und lauten Räumen besser zurecht. „Beste Genauigkeit“ nutzt das vollständige Large v3 und macht die wenigsten Fehler, braucht aber am längsten.',
        'Je größer das Modell, desto länger dauert es: „Am schnellsten“ braucht die wenigste Zeit und „Beste Genauigkeit“ die meiste. Probieren Sie zuerst „Standard“ aus und gehen Sie nur dann eine Stufe höher, wenn der Text nicht gut genug ist.',
      ],
      browser: {
        paragraphs: [
          '„Am schnellsten“ nutzt das kleine Modell Base und eignet sich für einen schnellen Entwurf bei klarer Sprache. „Standard“ nutzt ein größeres Modell und ist die übliche Wahl. „Hohe Genauigkeit“ nutzt Large v3 Turbo und kommt mit Akzenten und lauten Räumen besser zurecht. „Beste Genauigkeit“ nutzt das vollständige Large v3 und macht die wenigsten Fehler, braucht aber am längsten.',
          'Ihr Gerät erledigt die Arbeit, die Geschwindigkeit hängt also davon ab: Ein aktueller Laptop ist deutlich schneller als ein älteres Handy, und auf einem Handy sollten Sie „Am schnellsten“ verwenden. Probieren Sie auf einem Laptop zuerst „Standard“ aus und gehen Sie nur dann eine Stufe höher, wenn der Text nicht gut genug ist.',
        ],
      },
    },
  ],

  howTitle: 'So wandeln Sie ein Video in vier Schritten in Text um',
  howToDescription: 'Fügen Sie das Video hinzu, wählen Sie Sprache und Qualitätsstufe, warten Sie, bis der Text erscheint, bearbeiten Sie ihn und laden Sie ihn herunter.',
  steps: [
    {
      title: 'Video hinzufügen',
      text: 'Legen Sie die Datei im Feld oben auf dieser Seite ab oder klicken Sie auf „Datei auswählen“. Ein Link zu einem Web-Video wird nicht angenommen.',
    },
    {
      title: 'Sprache und Qualität wählen',
      text: 'Nennen Sie die gesprochene Sprache, wenn Sie sie kennen, und wählen Sie eine Qualitätsstufe. „Standard“ ist ein guter Anfang; nehmen Sie „Hohe Genauigkeit“ oder „Beste Genauigkeit“ bei Akzenten, Rauschen oder einer Sprache wie Hindi.',
    },
    {
      title: 'Auf den Text warten',
      text: 'Die Zeilen erscheinen nach und nach, mit einem Fortschrittsbalken und der verbleibenden Zeit.',
      browser: {
        text: 'Die Zeilen erscheinen nach und nach, mit einem Fortschrittsbalken und der verbleibenden Zeit. Wenn Sie eine Stufe zum ersten Mal verwenden, wird das Modell einmal heruntergeladen; spätere Videos starten sofort.',
      },
    },
    {
      title: 'Bearbeiten und herunterladen',
      text: 'Korrigieren Sie jede Zeile im Editor und laden Sie dann TXT, SRT, VTT, PDF, Markdown oder JSON herunter. Laden Sie herunter, bevor Sie gehen: Nach der Sitzung wird nichts für Sie aufbewahrt.',
      browser: {
        text: 'Korrigieren Sie jede Zeile im Editor und laden Sie dann TXT, SRT, VTT, PDF, Markdown oder JSON herunter. Das Transkript bleibt eine Weile in diesem Browser, laden Sie aber herunter, was Sie behalten möchten.',
      },
    },
  ],

  formatsTitle: 'Videos, die Sie hinzufügen können, und Dateien, die Sie zurückbekommen',
  formatsIntro: 'Gelesen wird die Tonspur, die Bildqualität spielt also keine Rolle. Reine Audiodateien funktionieren ebenfalls.',
  uploadTitle: 'Videodateien, die Sie hinzufügen können',
  accepts: ['MP4', 'MOV', 'MKV', 'WEBM', 'AVI', 'M4V', '3GP'],
  downloads: [
    { name: 'TXT', use: 'reiner Text oder mit Zeit in jeder Zeile' },
    { name: 'SRT', use: 'Untertitel für Schnittprogramme und Player' },
    { name: 'VTT', use: 'Untertitel für Web-Videos' },
    { name: 'PDF', use: 'ein Transkript zum Drucken oder Teilen' },
    { name: 'Markdown', use: 'Notizen mit Zeitstempeln' },
    { name: 'JSON', use: 'Wörter und Zeiten für Entwickler' },
  ],

  tipsTitle: 'Mehr aus einer kostenlosen Transkription herausholen',
  tips: [
    {
      title: 'Testen Sie die erste Minute, bevor Sie das ganze Video nehmen.',
      text: 'Schneiden Sie eine Minute aus dem Video heraus oder spielen Sie sie ab und transkribieren Sie diese. Ist der Text falsch, ändern Sie Sprache oder Qualitätsstufe, bevor Sie Zeit in die ganze Datei stecken.',
    },
    {
      title: 'Prüfen Sie, was auf dem Bildschirm steht, nicht nur, was zu hören ist.',
      text: 'Nur die Sprache wird aufgeschrieben. Namen, die auf einer Folie stehen, aber nie gesagt werden, kommen nicht im Text vor.',
    },
    {
      title: 'Teilen Sie eine sehr lange Aufnahme.',
      text: 'Ein Video von mehreren Stunden lässt sich in Teilen von etwa einer Stunde leichter handhaben: Sie können früher mit dem Lesen beginnen, und ein Fehler ist günstiger zu wiederholen.',
      browser: {
        title: 'Teilen Sie eine sehr lange Aufnahme auf dem Handy.',
        text: 'Es gibt kein Größenlimit, aber ein Video von mehreren Stunden braucht viel Speicher. Auf einem Handy sind Teile von etwa einer Stunde viel sicherer, auf einem Laptop geht es meist deutlich länger.',
      },
    },
    {
      title: 'Laden Sie auch die Untertiteldatei herunter, nicht nur den Text.',
      text: 'Die SRT-Datei behält die Zeitangaben, sodass Sie mit demselben Durchlauf ein Transkript zum Lesen und Untertitel für das Video bekommen.',
    },
  ],

  faqs: [
    {
      question: 'Kann ich statt einer Datei einen YouTube-, TikTok- oder Google-Drive-Link einfügen?',
      answer: 'Nein. Dieses Tool arbeitet mit einer Datei, die Sie hinzufügen oder aufnehmen. Wenn das Video von Ihnen stammt, nehmen Sie die Originaldatei; bei dem Video eines anderen brauchen Sie das Recht, es zu verwenden.',
    },
    {
      question: 'Zeigt das Transkript, wer spricht?',
      answer: 'Nein. Die Zeilen haben Zeitangaben, aber keine Sprechernamen. Sie können im Editor Namen in den Text tippen, was bei einem Interview mit zwei Personen schnell geht.',
    },
    {
      question: 'Gibt es wirklich keine Grenze, wie viele Videos ich transkribieren kann?',
      answer: 'Es gibt kein Konto, keinen Tarif und kein Tages- oder Monatskontingent. {limits} Wenn viele Menschen den Dienst nutzen, muss Ihr Video unter Umständen eine Weile in einer Warteschlange warten.',
      browser: {
        answer:
          'Es gibt kein Konto, keinen Tarif, kein Tages- oder Monatskontingent und kein Größenlimit. Die einzige Grenze ist Ihr Gerät: Ein sehr langes Video dauert länger und braucht mehr Speicher, ein Handy kommt daher mit Teilen von etwa einer Stunde besser zurecht. Werbung hält die Seite kostenlos, und während ein Video transkribiert wird, wird keine angezeigt.',
      },
    },
    {
      question: 'Welche Qualitätsstufe passt zu einem langen Video?',
      answer: '„Standard“ ist die übliche Wahl. „Am schnellsten“ ist schneller, macht aber mehr Fehler; „Hohe Genauigkeit“ und „Beste Genauigkeit“ kosten mehr Zeit und lohnen sich bei Akzenten, Rauschen und Sprachen wie Hindi.',
    },
    {
      question: 'Verlässt das Video meinen Computer?',
      answer: 'Es wird an den Server gesendet, der diese Seite betreibt, und am Ende Ihrer Sitzung gelöscht.',
      browser: {
        answer: 'Nein. Ihr Browser transkribiert das Video auf Ihrem eigenen Gerät, und es wird keine Datei an uns gesendet. Nur das Spracherkennungsmodell und seine Engine werden heruntergeladen, einmalig.',
      },
    },
  ],

  links: [
    {
      label: 'Kostenlose Video-zu-Text-Tools im Vergleich',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Alle Grenzen in einer Tabelle, zitiert von der jeweiligen Seite des Anbieters.',
    },
    {
      label: 'Video transkribieren, ohne es hochzuladen',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Wie die Arbeit auf Ihrem Gerät bleibt und wie Sie es selbst prüfen können.',
    },
    {
      label: 'So wandeln Sie ein Video in Text um',
      path: '/guides/how-to-transcribe-video-to-text',
      note: 'Fünf Wege, und welcher zu Ihrem Video passt.',
    },
    {
      label: 'So bekommen Sie ein genaueres Transkript',
      path: '/guides/accurate-transcripts',
      note: 'Gewohnheiten und Einstellungen, die bei jedem Video Fehler verringern.',
    },
  ],
};
