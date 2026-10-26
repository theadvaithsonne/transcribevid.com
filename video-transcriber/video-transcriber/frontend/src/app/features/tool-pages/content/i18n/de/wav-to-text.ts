import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WAV zu Text',
  h1: 'WAV-Datei in Text umwandeln, kostenlos und mit Zeitstempeln',
  lead: 'WAV ist das Format von Handrecordern, Gesprächsaufzeichnungsgeräten und Studiosessions. Fügen Sie Ihre Datei hinzu und lesen Sie die Worte als Text mit Zeitstempeln, kostenlos, ohne Anmeldung und ohne die Datei vorher komprimieren zu müssen.',
  dropKind: 'audio',
  dropNoun: 'WAV-Datei',

  whyTitle: 'Warum sich eine WAV-Datei gut transkribieren lässt',
  why: [
    'Eine WAV-Datei speichert den Ton in der Regel ohne Kompression, beim Speichern ging also nichts verloren. Das macht sie zu einer guten Quelle für Spracherkennung: keine Kompressionsartefakte, und jeder Konsonant steckt noch in der Datei. Sie müssen sie nicht erst in eine MP3-Datei umwandeln. TranscribeVid liest die WAV-Datei so, wie sie ist.',
    'Der Preis dieser Qualität ist die Größe. Stereo in CD-Qualität braucht etwa 10 MB pro Minute, eine Stunde Audio sind also mehr als ein halbes Gigabyte. Diese Seite ist für solche großen Dateien gemacht: Sie überspringt Stille und die meisten Nicht-Sprachgeräusche (die Option „Stille und Musik überspringen“, standardmäßig aktiviert) und liefert Ihnen Text mit einem Zeitstempel in jeder Zeile.',
  ],

  sections: [
    {
      title: 'Woher WAV-Aufnahmen kommen',
      paragraphs: [
        'WAV ist die Standardeinstellung der Audiowelt, die Datei vor Ihnen stammt also wahrscheinlich aus einer dieser Quellen.',
      ],
      bullets: [
        {
          title: 'Handrecorder.',
          text: 'Tragbare Recorder für Interviews, Vorlesungen und Feldnotizen speichern oft WAV, weil es jedes Detail des Klangs bewahrt.',
        },
        {
          title: 'Telefon- und Meeting-Recorder.',
          text: 'Werkzeuge zur Gesprächsaufzeichnung und Konferenzsysteme exportieren oft WAV. Liegt jede Seite eines Gesprächs auf einem eigenen Kanal, werden beide zu einem Transkript zusammengemischt.',
        },
        {
          title: 'Audioeditoren.',
          text: 'Programme wie Audacity und Adobe Audition exportieren WAV, wenn Sie ein Projekt speichern oder ausspielen, und machen es so zur naheliegenden Datei für die Weitergabe zur Transkription.',
        },
        {
          title: 'Diktiergeräte.',
          text: 'Manche digitalen Diktiergeräte schreiben WAV-Dateien, die Sie direkt vom Gerät kopieren können.',
        },
      ],
    },
    {
      title: 'Abtastrate, Bittiefe und Kanäle',
      paragraphs: [
        'Sie müssen eine WAV-Datei vor dem Hinzufügen nicht vorbereiten. Die üblichen Einstellungen werden alle gelesen: 8, 16 oder 24 Bit oder 32-Bit-Float, Mono oder Stereo, mit 44,1 oder 48 kHz. Der Ton wird automatisch auf Mono heruntergemischt und für das Sprachmodell umgewandelt.',
        'Eine höhere Abtastrate macht ein Transkript nicht genauer, weil Sprache im unteren Teil des Klangspektrums liegt. Wo Sie das Mikrofon platzieren, spielt eine weit größere Rolle als die Zahlen in der Datei.',
        '„Audio verbessern“ unter „Weitere Optionen“ filtert Brummen und Rauschen und gleicht leise Sprecher an. Es ist standardmäßig aktiviert und bewährt sich bei einer Aufnahme, die neben einem Lüfter, einer Straße oder einer Klimaanlage entstanden ist.',
      ],
    },
  ],

  howTitle: 'So wandeln Sie eine WAV-Datei in Text um',
  howToDescription:
    'Fügen Sie die WAV-Datei hinzu, wählen Sie gesprochene Sprache und Qualität, warten Sie auf das Transkript und laden Sie es als Text oder Untertitel herunter.',
  steps: [
    {
      title: 'WAV-Datei ablegen',
      text: 'Fügen Sie die .wav-Datei im Feld oben auf dieser Seite hinzu: Legen Sie sie dort ab oder klicken Sie auf „Datei auswählen“. Liegt sie noch auf einem Recorder, kopieren Sie sie zuerst auf Ihren Computer. Das Feld nimmt eine Datei an; auf der nächsten Seite reiht „Weitere Datei hinzufügen“ weitere WAV-Dateien ein, und jede bekommt ihr eigenes Transkript.',
    },
    {
      title: 'Sprache und Qualität wählen',
      text: 'Wählen Sie auf der nächsten Seite die gesprochene Sprache oder lassen Sie bei einer Aufnahme in einer Sprache „Automatisch erkennen“ stehen. „Standard“ passt für die meisten Sprachaufnahmen. Bei einer leisen oder schwierigen Aufnahme brauchen „Hohe Genauigkeit“ und „Beste Genauigkeit“ länger und machen weniger Fehler. Klicken Sie dann auf „Transkribieren“.',
      browser: {
        text: 'Wählen Sie auf der nächsten Seite die gesprochene Sprache oder lassen Sie bei einer Aufnahme in einer Sprache „Automatisch erkennen“ stehen. „Standard“ passt für die meisten Sprachaufnahmen. Bei einer leisen oder schwierigen Aufnahme probieren Sie „Hohe Genauigkeit“ oder „Beste Genauigkeit“, falls Ihr Gerät sie anbietet: Sie brauchen länger, sind ein größerer Download beim ersten Mal und sind auf einem Gerät, das sie nicht ausführen kann, mit Begründung ausgegraut. Klicken Sie dann auf „Transkribieren“.',
      },
    },
    {
      title: 'Zusehen, wie der Text erscheint',
      text: 'Das Transkript füllt sich Zeile für Zeile, jede Zeile mit ihrer Zeit. Spielen Sie ab jeder Zeile ab, um sie mit der Aufnahme zu vergleichen.',
    },
    {
      title: 'Bearbeiten und herunterladen',
      text: 'Korrigieren Sie falsche Wörter und laden Sie dann TXT zum Lesen herunter, SRT oder VTT für Untertitel oder PDF zum Drucken. Nach Ihrer Sitzung wird nichts aufbewahrt, speichern Sie also, was Sie brauchen.',
    },
  ],

  formatsTitle: 'WAV und andere Audioformate',
  formatsIntro: 'WAV ist das verlustfreie Format, und dieses Feld nimmt auch diese Audiotypen an.',
  uploadTitle: 'Audiodateien, die Sie hinzufügen können',
  accepts: ['WAV', 'MP3', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'die Worte als reiner Text' },
    { name: 'SRT', use: 'zeitgestempelte Untertitelzeilen' },
    { name: 'VTT', use: 'zeitgestempelte Zeilen für Web-Player' },
    { name: 'PDF', use: 'eine druckbare Kopie' },
    { name: 'Markdown', use: 'Notizen mit Zeiten' },
    { name: 'JSON', use: 'Daten für eigene Werkzeuge' },
  ],

  tipsTitle: 'Tipps zum Transkribieren von WAV-Aufnahmen',
  tips: [
    {
      title: 'Fügen Sie sie genau so hinzu, wie sie ist.',
      text: 'Eine WAV-Datei vorher umzuwandeln bringt nichts, und eine MP3-Datei mit niedriger Bitrate kann Details verlieren. Fügen Sie die Datei so hinzu, wie sie vom Recorder kam.',
    },
    {
      title: 'Hören Sie beide Kanäle an.',
      text: 'Stereo wird auf Mono heruntergemischt. Ist ein Mikrofon viel leiser oder verrauschter als das andere, übernimmt der Mix das, prüfen Sie also vor einem langen Auftrag beide Kanäle in Ihrem Player.',
    },
    {
      title: 'Kürzen Sie lange Stillephasen.',
      text: 'Feldaufnahmen beginnen und enden oft mit Minuten ohne Inhalt. Sie in einem Editor wegzuschneiden macht die Datei kleiner, und das Transkript beginnt dort, wo das Sprechen beginnt.',
    },
    {
      title: 'Teilen Sie eine sehr lange Sitzung.',
      text: 'Aufnahmen über dem Größen- oder Längenlimit werden abgelehnt, teilen Sie eine lange Sitzung daher an einer natürlichen Pause und transkribieren Sie die Teile.',
      browser: {
        title: 'Mehrere Stunden brauchen mehrere Stunden.',
        text: 'Die Seite setzt kein Größen- oder Längenlimit, aber eine Aufnahme von mehreren Stunden braucht viel Zeit und freien Speicher, und ein älterer Browser lehnt eine sehr lange Datei unter Umständen ab. Teilen Sie sie auf dem Handy an einer natürlichen Pause und transkribieren Sie die Teile.',
      },
    },
    {
      title: 'Buchstabieren Sie die schwierigen Wörter.',
      text: 'Tragen Sie Namen, Orte und Fachbegriffe im Wortschatz-Hinweis unter „Weitere Optionen“ so ein, wie Sie sie sehen möchten.',
    },
  ],

  faqs: [
    {
      question:
        'Kann ich eine WAV-Datei transkribieren, die bei einem Telefongespräch aufgenommen wurde?',
      answer:
        'Ja, wenn das Gespräch als WAV-Datei gespeichert ist und beide Personen zu hören sind. Beide Kanäle werden zu einem Transkript zusammengemischt, und Sprechernamen werden nicht hinzugefügt, tippen Sie beim Bearbeiten also Namen in den Text. Sagen Sie den Leuten, dass Sie aufnehmen, und prüfen Sie vor Gesprächsaufzeichnungen die Regeln an Ihrem Wohnort.',
    },
    {
      question: 'Ist WAV für die Transkription genauer als MP3?',
      answer:
        'Es kann ein wenig helfen, weil dem Ton nichts entnommen wurde. Aber eine klare MP3-Datei lässt sich meist gut transkribieren, eine verrauschte WAV-Datei nicht. Das Mikrofon, der Raum und der Abstand des Sprechers spielen eine größere Rolle als das Dateiformat.',
    },
    {
      question: 'Warum ist meine WAV-Datei so groß, und spielt das eine Rolle?',
      answer:
        'WAV speichert den Ton in der Regel ohne Kompression: etwa 10 MB pro Minute bei Stereo in CD-Qualität. Große Dateien brauchen länger zum Einlesen. {limits} Liegt eine Datei über dem Limit, kürzen Sie sie oder exportieren Sie eine komprimierte Kopie (M4A oder MP3) und verwenden Sie diese.',
      browser: {
        answer:
          'WAV speichert den Ton in der Regel ohne Kompression: etwa 10 MB pro Minute bei Stereo in CD-Qualität. Große Dateien brauchen etwas länger zum Einlesen, aber das Format ist nicht das Problem: Im Test wurde eine Datei von etwa 2,5 GB in einem aktuellen Browser ohne Schwierigkeiten gelesen. Die Seite setzt kein Größen- oder Längenlimit, weil Ihr eigenes Gerät die Arbeit macht, eine sehr lange Aufnahme braucht also Zeit und freien Speicher, und ein älterer Browser lehnt eine sehr lange Datei unter Umständen ab. Teilen Sie sie auf dem Handy vorher auf.',
      },
    },
    {
      question: 'Kommt es mit 24-Bit- und 48-kHz-WAV-Dateien zurecht?',
      answer:
        'Ja. Die üblichen WAV-Einstellungen, etwa 16 oder 24 Bit bei 44,1 oder 48 kHz, werden ohne Vorbereitung gelesen, und der Ton wird automatisch für das Sprachmodell umgewandelt.',
    },
    {
      question: 'Kann ich mehrere WAV-Dateien in einem Rutsch transkribieren?',
      answer:
        'Ja, auf der nächsten Seite. Das Feld auf dieser Seite nimmt eine Datei an; dort reiht „Weitere Datei hinzufügen“ die übrigen ein. Jede Datei bekommt ihr eigenes Transkript, sodass ein ganzer Tag an Aufnahmen nacheinander laufen kann.',
    },
  ],

  links: [
    {
      label: 'MP3 zu Text',
      path: '/mp3-to-text',
      note: 'Dieselbe kostenlose Transkription für das komprimierte Format, in dem die meisten Sprachaufnahmen landen.',
    },
    {
      label: 'Interview-Transkription',
      path: '/interview-transcription',
      note: 'Tipps, wie Sie Interviewaufnahmen in ein sauberes, zitierfähiges Transkript verwandeln.',
    },
    {
      label: 'So erhalten Sie ein genaueres Transkript',
      path: '/guides/accurate-transcripts',
      note: 'Was Sie an Aufnahme, Sprache und Einstellungen ändern können, wenn das erste Ergebnis nicht gut genug ist.',
    },
    {
      label: 'Meeting-Aufzeichnung zu Text',
      path: '/meeting-recording-to-text',
      note: 'Für Konferenzgespräche, die als Aufzeichnung gespeichert sind.',
    },
  ],
};
