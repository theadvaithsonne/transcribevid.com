import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'M4A zu Text',
  h1: 'M4A-Sprachmemo in Text transkribieren',
  lead: 'M4A ist das, was Sprachmemos auf iPhone und Mac, viele Android-Recorder und Apple-Apps speichern. Fügen Sie die Datei hinzu und erhalten Sie ein Transkript mit Zeitstempeln, kostenlos, ohne Anmeldung und ohne Umwandlung in MP3.',
  dropKind: 'audio',
  dropNoun: 'M4A-Datei',

  whyTitle: 'Warum sich M4A-Dateien gut transkribieren lassen',
  why: [
    'Eine M4A-Datei ist eine reine Audio-MPEG-4-Datei. Sie enthält meist AAC-Ton, der komprimiert, für Sprache aber mehr als gut genug ist, M4A-Dateien sind daher klein und lassen sich gut transkribieren. TranscribeVid liest sie direkt. Vorher muss nichts umgewandelt werden.',
    'Sprachmemos entstehen unterwegs, deshalb sind sie oft leise, hallig oder mit dem Handy in der Tasche aufgenommen. Die Qualitätsstufen und Bereinigungsoptionen auf dieser Seite gibt es genau für solche Aufnahmen.',
  ],

  sections: [
    {
      title: 'So bekommen Sie ein Sprachmemo vom Handy',
      paragraphs: [
        'Menünamen ändern sich zwischen Versionen von iOS, macOS und Android, verstehen Sie die folgenden Hinweise daher als Orientierung. Wenn Sie direkt auf dem Handy sind, klicken Sie auf „Datei auswählen“ und wählen die Aufnahme in „Dateien“ oder Ihrem Aufnahmeordner aus. Ein Computer ist nicht nötig.',
      ],
      bullets: [
        {
          title: 'iPhone.',
          text: 'Öffnen Sie in „Sprachmemos“ die Aufnahme, tippen Sie auf die Schaltfläche „Mehr“ (drei Punkte) und wählen Sie „Teilen“. Speichern Sie sie in „Dateien“ oder schicken Sie sie sich per AirDrop oder E-Mail selbst zu, und fügen Sie sie dann hier hinzu.',
        },
        {
          title: 'Mac.',
          text: 'Ziehen Sie eine Aufnahme aus dem Fenster „Sprachmemos“ auf den Schreibtisch. Sie kommt als .m4a-Datei an und ist bereit zum Hinzufügen.',
        },
        {
          title: 'Android.',
          text: 'Viele Recorder-Apps speichern M4A-Dateien in einem Ordner „Recordings“ oder „Voice Recorder“. Der Ordnername hängt von der App ab, und die Dateiauswahl kann ihn öffnen.',
        },
      ],
    },
    {
      title: 'Verlustfreie und komprimierte Sprachmemos',
      paragraphs: [
        'Sprachmemos auf dem iPhone können Aufnahmen als „Komprimiert“ oder „Verlustfrei“ speichern. Verlustfreie Dateien sind viel größer, enden weiterhin auf .m4a und verwenden meist den Codec Apple Lossless. Sprache braucht das nicht: Ein komprimiertes Memo liefert dasselbe Transkript bei einem Bruchteil der Größe.',
      ],
      browser: {
        paragraphs: [
          'Sprachmemos auf dem iPhone können Aufnahmen als „Komprimiert“ oder „Verlustfrei“ speichern. Verlustfreie Dateien sind viel größer, enden weiterhin auf .m4a und verwenden meist den Codec Apple Lossless, den nicht jeder Browser von sich aus lesen kann. Kann Ihrer das nicht, bietet die Seite unter Umständen an, einen kleinen Konverter (etwa 9 MB) zu laden, der auf Ihrem Gerät läuft. Sprache braucht „Verlustfrei“ nicht: Ein komprimiertes Memo liefert dasselbe Transkript bei einem Bruchteil der Größe.',
        ],
      },
    },
  ],

  howTitle: 'So machen Sie aus einer M4A-Datei Text',
  howToDescription:
    'Fügen Sie die M4A-Datei hinzu, wählen Sie die gesprochene Sprache, warten Sie auf das Transkript und laden Sie es als Text herunter.',
  steps: [
    {
      title: 'M4A hinzufügen',
      text: 'Legen Sie das .m4a-Memo im Feld oben auf dieser Seite ab oder klicken Sie auf „Datei auswählen“ und wählen es auf dem Handy in „Dateien“ oder Ihrem Aufnahmeordner aus. In dieses Feld passt nur ein Memo; auf der nächsten Seite holt „Weitere Datei hinzufügen“ die übrigen herein.',
    },
    {
      title: 'Sprache wählen',
      text: 'Wählen Sie auf der nächsten Seite die gesprochene Sprache. Ein kurzes Memo gibt „Automatisch erkennen“ wenig zum Arbeiten, die Sprache zu nennen ist daher zuverlässiger. Die Qualität „Standard“ passt für die meisten Memos. Klicken Sie dann auf „Transkribieren“.',
    },
    {
      title: 'Auf das Transkript warten',
      text: 'Die Zeilen erscheinen nacheinander mit einem Fortschrittsbalken und einer Schätzung der verbleibenden Zeit. Spielen Sie ab jeder Zeile ab, um zu hören, was gesagt wurde.',
    },
    {
      title: 'Korrigieren und speichern',
      text: 'Korrigieren Sie jedes falsche Wort und laden Sie dann TXT, Markdown oder PDF für Notizen herunter, oder SRT oder VTT, falls das Memo zu einem Video gehört. Ein Transkript existiert nur für Ihre Sitzung, laden Sie es also herunter, bevor Sie die Seite schließen.',
    },
  ],

  formatsTitle: 'M4A und andere Audioformate',
  formatsIntro:
    'Recorder auf Handy und Desktop speichern in unterschiedlichen Formaten. Dieses Feld nimmt alle diese an.',
  uploadTitle: 'Audiodateien, die Sie hinzufügen können',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'Ihre Worte als reiner Text' },
    { name: 'Markdown', use: 'Notizen mit Zeiten' },
    { name: 'PDF', use: 'eine druckbare Kopie des Memos' },
    { name: 'SRT', use: 'zeitgestempelte Zeilen für ein Video, das zum Memo gehört' },
    { name: 'VTT', use: 'zeitgestempelte Zeilen für Web-Player' },
    { name: 'JSON', use: 'strukturierte Zeilen für Programme' },
  ],

  tipsTitle: 'Tipps zum Transkribieren von Sprachmemos',
  tips: [
    {
      title: 'Halten Sie das Handy nah heran.',
      text: 'Ein Memo, das mit dem Handy in der Tasche oder quer über einen Tisch aufgenommen wurde, ist für jede Spracherkennung schwierig. Halten Sie das Handy eine Handbreit vom Mund entfernt und sprechen Sie daran vorbei, nicht hinein.',
    },
    {
      title: 'Kürzen Sie vor dem Teilen.',
      text: 'In den meisten Sprachmemo-Apps lassen sich Anfang und Ende einer Aufnahme abschneiden. Eine lange Pause an einem der Enden zu entfernen spart Wartezeit.',
    },
    {
      title: 'Nennen Sie die Sprache.',
      text: 'Bei einem Memo von zehn oder zwanzig Sekunden schlägt die Wahl der gesprochenen Sprache die automatische Erkennung, besonders bei akzentuierter Sprache oder einer Mischung aus Sprachen.',
    },
    {
      title: 'Geben Sie die schwierigen Namen vor.',
      text: 'Tragen Sie ungewöhnliche Namen in den Wortschatz-Hinweis unter „Weitere Optionen“ ein, dann werden sie weit eher richtig erkannt.',
    },
  ],

  faqs: [
    {
      question: 'Kann ich ein iPhone-Sprachmemo ohne Umwandlung transkribieren?',
      answer:
        'Ja. Sprachmemos sind M4A-Dateien, und TranscribeVid liest M4A direkt. Teilen Sie das Memo nach „Dateien“ oder auf Ihren Computer und fügen Sie es dann hier hinzu. Wandeln Sie es nicht vorher in MP3 um.',
    },
    {
      question: 'Ist eine M4A-Datei dasselbe wie eine MP4-Datei?',
      answer:
        'Sie sind nah verwandt. Beide nutzen den MPEG-4-Container; eine M4A-Datei enthält nur Audio, eine MP4-Datei meist auch Video. TranscribeVid liest den Ton aus beiden.',
    },
    {
      question: 'Warum ist mein M4A-Transkript leer oder sehr kurz?',
      answer:
        'Das Memo ist möglicherweise stumm, sehr leise oder besteht überwiegend aus Hintergrundgeräuschen. Hören Sie es zuerst an. Ist es schwach, lassen Sie „Audio verbessern“ unter „Weitere Optionen“ aktiviert und prüfen Sie, ob die Datei beim Teilen nicht abgeschnitten wurde.',
    },
    {
      question: 'Kann ich ein langes, mit dem Handy aufgenommenes Meeting transkribieren?',
      answer:
        'Ja. M4A-Dateien sind klein, eine lange Aufnahme lässt sich daher leicht hinzufügen. {limits} Es gibt kein Tages- oder Monatskontingent.',
      browser: {
        answer:
          'Ja. M4A-Dateien sind klein, eine lange Aufnahme lässt sich daher leicht hinzufügen. Die Seite setzt kein Größen- oder Längenlimit, weil Ihr eigenes Gerät die Arbeit macht, ein sehr langes Memo dauert also einfach länger, und auf einem langsameren Gerät sagt Ihnen die Seite das vor dem Start. Ein älterer Browser lehnt eine sehr lange Datei unter Umständen ab.',
      },
    },
    {
      question: 'Kann ich ein Sprachmemo auf Hindi oder Spanisch transkribieren?',
      answer:
        'Ja. Wählen Sie die gesprochene Sprache aus der Liste von mehr als 50 oder lassen Sie bei einem Memo in einer Sprache „Automatisch erkennen“ aktiviert. Für Hindi können Sie mit „Transkriptionsstil“ (neben „Sprache“) lateinische Buchstaben (Hinglish) oder die originale Devanagari-Schrift wählen.',
    },
  ],

  links: [
    {
      label: 'Sprachaufnahme zu Text',
      path: '/voice-recording-to-text',
      note: 'Nehmen Sie mit Ihrem Mikrofon direkt auf der Seite auf, statt eine Datei hochzuladen.',
    },
    {
      label: 'MP3 zu Text',
      path: '/mp3-to-text',
      note: 'Dieselbe kostenlose Transkription für MP3-Dateien, das andere gängige Sprachformat.',
    },
    {
      label: 'Vorlesung zu Text',
      path: '/lecture-to-text',
      note: 'Machen Sie aus einer aufgezeichneten Vorlesung Notizen, die Sie durchsuchen und zum Lernen nutzen können.',
    },
    {
      label: 'So erhalten Sie ein genaueres Transkript',
      path: '/guides/accurate-transcripts',
      note: 'Einfache Änderungen an Aufnahme und Einstellungen, die den größten Unterschied machen.',
    },
  ],
};
