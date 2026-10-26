import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Sprache ins Englische übersetzen',
  h1: 'Audio ins Englische übersetzen: englischer Text und Untertitel aus Sprache',
  lead: 'Fügen Sie eine Video- oder Audiodatei in einer anderen Sprache hinzu und erhalten Sie englischen Text mit Zeitstempeln oder eine englische Untertiteldatei. Kostenlos, ohne Anmeldung.',
  dropKind: 'video',
  dropNoun: 'Video oder Audiodatei',

  whyTitle: 'Was das Übersetzen von Sprache ins Englische bewirkt',
  why: [
    'Die meiste Spracherkennung schreibt auf, was gesagt wurde, in der Sprache, in der es gesagt wurde. Ins Englische zu übersetzen ist eine andere Aufgabe. Die sprechende Person redet auf Hindi, Spanisch, Deutsch oder in einer anderen unterstützten Sprache, und der Text kommt auf Englisch heraus, mit einem Zeitstempel in jeder Zeile. Das hilft, wenn Sie den Kern einer Vorlesung, eines Interviews, eines Nachrichtenclips oder eines Familienvideos verstehen müssen, dem Sie nicht folgen können, oder wenn Sie englische Untertitel für ein Video in einer anderen Sprache brauchen.',
    'Englisch ist die einzige Sprache, in die übersetzt wird. Es gibt keine Übersetzung ins Französische, Hindi oder in irgendeine andere Sprache, und geschriebener Text wird nicht übersetzt: nur die Sprache in der Aufnahme. Diese Seite startet den Uploader mit „Ausgabe“ auf „Ins Englische übersetzen“ und der gesprochenen Sprache auf „Automatisch erkennen“.',
  ],

  sections: [
    {
      title: 'Wie zuverlässig das Englisch ist und was Sie prüfen sollten',
      paragraphs: [
        'Übersetzen ist schwieriger als Transkribieren. Das Englisch entsteht direkt aus dem Klang, ohne geschriebenen Text in der Originalsprache dazwischen. Es ist oft gut genug, um dem Sinn zu folgen, kann aber Sätze kürzen oder umformulieren, Redewendungen und Witze verfehlen und Namen, Zahlen und Fachwörter falsch wiedergeben.',
        'Behandeln Sie das Ergebnis als Entwurf zum Verstehen, nicht als offizielle Übersetzung. Für Verträge, juristisches, medizinisches oder anderes wichtiges Material fragen Sie eine menschliche Übersetzerin oder einen Übersetzer und nutzen ein Transkript in der Originalsprache als Ausgangspunkt.',
        'Eine gute Gewohnheit ist, zuerst ein gewöhnliches Transkript in der Originalsprache zu erstellen und die englische Fassung danach. Wo beide sich zu widersprechen scheinen, verdient die Stelle genaueres Hinhören. Ein fertiges Transkript bleibt erhalten, wenn Sie „Erneut transkribieren“ nutzen, beide können also aus derselben Datei stammen.',
      ],
    },
    {
      title: 'Welche Sprachen und welche Qualitätsstufen sich gut übersetzen lassen',
      bullets: [
        {
          title: 'Jede Sprache der Liste.',
          text: 'Mehr als 50 gesprochene Sprachen, von Afrikaans bis Walisisch, lassen sich ins Englische übersetzen. Die Qualität schwankt stark und ist bei Sprachen am schwächsten, zu denen es wenig aufgezeichnete Sprache zum Lernen gibt. Ist die Sprache bereits Englisch, brauchen Sie diese Seite nicht: Nutzen Sie die Seiten zu Video zu Text oder Audio zu Text.',
        },
        {
          title: 'Nennen Sie die Sprache oder lassen Sie sie erkennen.',
          text: 'Lassen Sie „Sprache“ auf „Automatisch erkennen“, wenn Sie nicht sicher sind, was gesprochen wird. Wenn Sie es wissen, ist die Wahl zuverlässiger, besonders bei kurzen oder akzentuierten Clips.',
        },
        {
          title: 'Vermeiden Sie „Hohe Genauigkeit“ beim Übersetzen.',
          text: '„Hohe Genauigkeit“ führt das Modell Large v3 Turbo aus. OpenAI, der Hersteller von Whisper, sagt, Turbo sei nicht für die Übersetzung trainiert und gebe die Originalsprache auch dann zurück, wenn eine Übersetzung angefordert wird. Distil Large v3 in der Modellliste unter „Weitere Optionen“ ist nur für Englisch. Beginnen Sie bei einer Übersetzung mit „Standard“ und wählen Sie für schwierige Sprache „Beste Genauigkeit“ (Large v3). Medium, ebenfalls in dieser Modellliste, ist eine weitere solide Wahl.',
          browser: {
            text: '„Hohe Genauigkeit“ führt das Modell Large v3 Turbo aus. OpenAI, der Hersteller von Whisper, sagt, Turbo sei nicht für die Übersetzung trainiert und gebe die Originalsprache auch dann zurück, wenn eine Übersetzung angefordert wird. Distil Large v3 in der Modellliste unter „Weitere Optionen“ ist nur für Englisch. Beginnen Sie bei einer Übersetzung mit „Standard“ und wählen Sie für schwierige Sprache „Beste Genauigkeit“ (Large v3), wenn Ihr Gerät sie anbietet. Medium, ebenfalls in dieser Modellliste, ist eine weitere solide Wahl.',
          },
        },
        {
          title: 'Nur Whisper.',
          text: 'Das Übersetzen braucht das Erkennungsmodul Whisper. Die experimentelle Auswahl Qwen3 ASR kann nicht übersetzen: „Ins Englische übersetzen“ ist nicht verfügbar, solange sie gewählt ist, und ihre Wahl setzt „Ausgabe“ auf „Transkribieren“ zurück.',
        },
        {
          title: 'Kein Transkriptionsstil.',
          text: 'Die Auswahl „Transkriptionsstil“ (Hinglish oder Originalschrift) gilt nicht für eine Übersetzung und ist ausgegraut, solange „Ins Englische übersetzen“ gewählt ist.',
        },
      ],
    },
    {
      title: 'Was Menschen mit englischen Untertiteln und Texten machen',
      bullets: [
        {
          title: 'Untertitel für Ihr eigenes Video.',
          text: 'Laden Sie SRT oder VTT herunter. Die englischen Zeilen sind auf die Originalsprache abgestimmt und lassen sich daher in einem Player oder Schnittprogramm demselben Video hinzufügen.',
        },
        {
          title: 'Eine Aufnahme verstehen.',
          text: 'Lesen Sie, worum es in einem Interview, einer Vorlesung oder einem Nachrichtenbericht geht, bevor Sie entscheiden, ob er eine richtige Übersetzung braucht.',
        },
        {
          title: 'Forschung und Journalismus.',
          text: 'Ein englischer Entwurf hilft Ihnen zu entscheiden, welche Passagen sorgfältig übersetzt werden sollen und welche Sie aus der Originalsprache zitieren.',
        },
      ],
    },
  ],

  howTitle: 'So übersetzen Sie Sprache ins Englische',
  howToDescription:
    'Fügen Sie eine Video- oder Audiodatei in einer anderen Sprache hinzu, prüfen Sie, dass „Ins Englische übersetzen“ gewählt ist, warten Sie auf den englischen Text und laden Sie ihn herunter.',
  steps: [
    {
      title: 'Aufnahme hinzufügen',
      text: 'Legen Sie Ihre Aufnahme im Feld oben auf dieser Seite ab oder klicken Sie auf „Datei auswählen“. Sie landen im Uploader mit geöffneten „Weiteren Optionen“, „Ausgabe“ auf „Ins Englische übersetzen“ und „Sprache“ auf „Automatisch erkennen“. Wählen Sie die gesprochene Sprache, wenn Sie sie kennen.',
    },
    {
      title: 'Qualität wählen, dann auf „Transkribieren“ klicken',
      text: '„Standard“ ist ein ordentlicher Anfang. Für akzentuierte, verrauschte oder fachliche Sprache wählen Sie „Beste Genauigkeit“, die länger dauert und meist weniger Fehler macht. Wählen Sie für eine Übersetzung nicht „Hohe Genauigkeit“: Sie nutzt ein Modell, das nicht für das Übersetzen trainiert wurde. Klicken Sie dann auf „Transkribieren“.',
      browser: {
        text: '„Standard“ ist ein ordentlicher Anfang. Für akzentuierte, verrauschte oder fachliche Sprache wählen Sie „Beste Genauigkeit“, wenn Ihr Gerät sie anbietet (eine Auswahl, die es nicht ausführen kann, ist mit Begründung ausgegraut); sie ist ein großer Download beim ersten Mal, dauert länger und macht meist weniger Fehler. Wählen Sie für eine Übersetzung nicht „Hohe Genauigkeit“: Sie nutzt ein Modell, das nicht für das Übersetzen trainiert wurde. Klicken Sie dann auf „Transkribieren“.',
      },
    },
    {
      title: 'Auf den englischen Text warten',
      text: 'Englische Zeilen erscheinen mit ihren Zeiten. „Transkriptionsstil“ ist ausgegraut, weil er nur für Transkripte gilt, nicht für Übersetzungen.',
    },
    {
      title: 'Prüfen und herunterladen',
      text: 'Lesen Sie die als unsicher markierten Zeilen, gleichen Sie Namen und Zahlen mit dem Audio ab und laden Sie dann TXT, SRT oder VTT herunter, oder eine PDF-, Markdown- oder JSON-Datei.',
    },
  ],

  formatsTitle: 'Dateien hinein, englischer Text heraus',
  formatsIntro:
    'Video und Audio in vielen Formaten funktionieren, egal welche Sprache gesprochen wird. Die Dateien, die Sie herunterladen, enthalten den englischen Text.',
  uploadTitle: 'Dateien, die Sie hinzufügen können',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'MKV', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'englischer Text zum Lesen' },
    { name: 'SRT', use: 'englische Untertitel, auf die Sprache abgestimmt' },
    { name: 'VTT', use: 'englische Untertitel für einen Web-Player' },
    { name: 'PDF', use: 'eine druckbare Kopie' },
    { name: 'Markdown', use: 'Text mit Überschriften und Zeiten' },
    { name: 'JSON', use: 'Zeilen und Zeiten für eigene Werkzeuge' },
  ],

  tipsTitle: 'Tipps für bessere Übersetzungen',
  tips: [
    {
      title: 'Nennen Sie die gesprochene Sprache, wenn Sie sie kennen.',
      text: 'Automatische Erkennung ist bei klarer Sprache in Ordnung, aber ein Fehlgriff bei einem kurzen Clip ergibt eine schlechte Übersetzung.',
    },
    {
      title: 'Halten Sie Clips bei einer Sprache.',
      text: 'Eine Aufnahme, die ständig zwischen Sprachen wechselt, kann die Übersetzung durcheinanderbringen. Teilen Sie sie oder erstellen Sie zuerst ein gewöhnliches Transkript, um zu sehen, was gehört wurde.',
    },
    {
      title: 'Prüfen Sie Zahlen, Namen und Daten.',
      text: 'Es sind die Einzelheiten, auf die es am meisten ankommt, und die, die in einem übersetzten Entwurf am häufigsten falsch sind.',
    },
    {
      title: 'Testen Sie die erste Minute.',
      text: 'Lesen Sie die erste Minute Englisch am Audio gegen, bevor Sie sich auf die ganze Datei verlassen.',
    },
    {
      title: 'Behalten Sie das Original neben dem Englischen.',
      text: 'Wenn Sie ein Zitat veröffentlichen, behalten Sie das Transkript in der Originalsprache neben der englischen Fassung.',
    },
  ],

  faqs: [
    {
      question: 'Kann es Sprache in andere Sprachen als Englisch übersetzen?',
      answer:
        'Nein. Englisch ist die einzige Sprache, in die übersetzt wird. Um die Sprache in ihrer eigenen Sprache zu lesen, erstellen Sie stattdessen ein gewöhnliches Transkript.',
    },
    {
      question: 'Warum ist ein übersetztes Transkript weniger exakt als ein gewöhnliches?',
      answer:
        'Übersetzen ist eine schwierigere Aufgabe, als die Wörter aufzuschreiben. Die Sprache muss in einem Schritt verstanden und neu formuliert werden, Sätze können daher gekürzt, Redewendungen und Witze verfehlt und Namen falsch gehört werden. Prüfen Sie alles Wichtige am Audio oder an einem Transkript in der Originalsprache.',
    },
    {
      question: 'Warum kam meine Übersetzung in der Originalsprache heraus?',
      answer:
        'Die wahrscheinliche Ursache ist die Qualitätsstufe. „Hohe Genauigkeit“ führt das Modell Large v3 Turbo aus, das nicht für das Übersetzen trainiert wurde und stattdessen eher die Originalsprache schreibt. Beginnen Sie noch einmal mit „Standard“ oder „Beste Genauigkeit“ und prüfen Sie, dass „Ausgabe“ auf „Ins Englische übersetzen“ steht.',
    },
    {
      question: 'Kann ich englische Untertitel für ein Video in einer anderen Sprache bekommen?',
      answer:
        'Ja. Laden Sie nach der Übersetzung SRT oder VTT herunter. Die englischen Zeilen tragen das Timing der Originalsprache. Lesen Sie sie vor der Veröffentlichung durch und denken Sie daran, dass die Übersetzung ein Entwurf ist.',
    },
    {
      question: 'Warum kann ich „Ins Englische übersetzen“ nicht wählen?',
      answer:
        'Es ist für das experimentelle Erkennungsmodul Qwen3 ASR nicht verfügbar. Stellen Sie „Erkennungsmodul“ unter „Weitere Optionen“ wieder auf Whisper, und die Auswahl kehrt zurück.',
    },
  ],

  links: [
    {
      label: 'Hindi Audio zu Text (Seite auf Englisch)',
      path: '/hindi-audio-to-text',
      note: 'Lesen Sie Hindi-Sprache in ihrer eigenen Sprache, bevor Sie sie übersetzen.',
    },
    {
      label: 'Spanisch Audio zu Text (Seite auf Englisch)',
      path: '/spanish-audio-to-text',
      note: 'Erstellen Sie ein spanisches Transkript mit Akzenten, ohne es zu übersetzen.',
    },
    {
      label: 'YouTube-Untertitel-Generator',
      path: '/youtube-subtitle-generator',
      note: 'Erstellen Sie eine SRT-Datei für Ihr eigenes Video und laden Sie sie in YouTube Studio hoch.',
    },
    {
      label: 'So fügen Sie einem Video Untertitel hinzu',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Was Sie mit der SRT- oder VTT-Datei tun, sobald Sie sie haben.',
    },
  ],
};
