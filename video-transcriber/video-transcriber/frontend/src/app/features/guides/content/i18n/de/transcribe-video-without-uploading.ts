import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Video transkribieren, ohne es hochzuladen',
  lead: 'Auf transcribevid.com läuft die Spracherkennung in Ihrem eigenen Browser, Ihre Video- oder Audiodatei wird also auf Ihrem Gerät gelesen und weder an die Website noch an Google noch an sonst jemanden gesendet. Dieser Ratgeber erklärt, wie das funktioniert, was Ihr Browser trotzdem herunterlädt, was weiterhin gesendet wird und wie Sie all das selbst überprüfen können.',
  readingMinutes: 11,
  toolPath: '/video-to-text',
  toolCta: 'Ein Video auf Ihrem Gerät transkribieren',
  blocks: [
    {
      title: 'Was „ohne Hochladen“ hier bedeutet',
      paragraphs: [
        'Die meisten Online-Transkriptionsdienste funktionieren gleich: Sie senden Ihre Datei an deren Server, ein Rechner, den Sie nicht sehen, transkribiert sie, und Sie laden das Ergebnis herunter. Ihre Aufnahme liegt auf dem Rechner eines anderen, solange er sie aufbewahrt.',
        'Auf transcribevid.com läuft die Arbeit andersherum. Das Spracherkennungsprogramm kommt zu Ihrem Browser, und Ihr Browser führt es auf Ihrem eigenen Computer oder Handy aus. Die Mediendatei wird von der Seite, die Sie geöffnet haben, von Ihrer Festplatte gelesen. Sie wird nie an eine Anfrage an die Website angehängt, und sie wird nie an Google, an die Unternehmen, die die Downloads hosten, oder an irgendeinen Sprachdienst gesendet.',
        'Deshalb setzt die Seite kein Größen- oder Längenlimit und hat keine Warteschlange: Es gibt keinen Server von uns, der die Arbeit macht, nichts läuft also pro Datei auf eine Rechnung auf, und niemand wartet vor Ihnen. Eine sehr lange Aufnahme braucht trotzdem Zeit und freien Speicher auf Ihrem Gerät. Es ist auch der Grund, warum ein vertrauliches Interview oder ein privates Familienvideo transkribiert werden kann, ohne Ihr Gerät zu verlassen.',
        'Dieser Ratgeber beschreibt die Website transcribevid.com. Eine Kopie der Software, die jemand auf dem eigenen Server installiert, funktioniert anders: Sie sendet die Datei über eine verschlüsselte Verbindung an diesen Server und löscht sie danach automatisch.',
      ],
    },
    {
      title: 'So funktioniert es, Schritt für Schritt',
      steps: [
        {
          title: 'Die Seite lädt',
          text: 'Ihr Browser holt die Seite und ihren Programmcode von transcribevid.com, das bei Cloudflare gehostet wird. Das ist dasselbe wie das Öffnen jeder anderen Website.',
        },
        {
          title: 'Das Sprachmodell wird einmal heruntergeladen',
          text: 'Beim ersten Mal, wenn Sie eine Qualitätsstufe nutzen, lädt Ihr Browser das Spracherkennungsmodell dafür von Hugging Face herunter, zusammen mit den Engine-Dateien, die es ausführen, von jsDelivr. Sie werden im Cache Ihres Browsers aufbewahrt, die nächste Transkription beginnt also ohne erneuten Download.',
        },
        {
          title: 'Ihre Datei wird auf Ihrem Gerät dekodiert',
          text: 'Die eingebauten Audio- und Video-Dekoder des Browsers wandeln die Datei in reinen 16-kHz-Mono-Ton um, den das Modell liest. Bei einigen Formaten, die der Browser nicht selbst öffnen kann, etwa AVI, WMA und FLV, fragt die Seite zuerst und lädt dann einen Konverter von etwa 9 MB herunter, der ebenfalls auf Ihrem Gerät läuft.',
        },
        {
          title: 'Ein Worker führt das Modell aus',
          text: 'Ein Hintergrund-Thread der Seite, ein sogenannter Web Worker, führt das Modell aus, damit die Seite reaktionsfähig bleibt. Er nutzt Ihren Grafikchip über WebGPU, wenn der Browser es unterstützt, und andernfalls Ihren Prozessor über WebAssembly.',
        },
        {
          title: 'Der Text erscheint und bleibt in Ihrem Browser',
          text: 'Das Transkript entsteht Zeile für Zeile mit Zeitstempeln. Es wird für die Sitzung im eigenen Speicher Ihres Browsers abgelegt, und auch die SRT-, VTT-, TXT-, Markdown-, JSON- und PDF-Dateien, die Sie herunterladen, werden auf Ihrem Gerät erstellt.',
        },
      ],
    },
    {
      title: 'Was Ihr Browser tatsächlich herunterlädt',
      paragraphs: [
        'Nicht hochladen heißt nicht, nicht herunterzuladen. Ein Sprachmodell ist eine große Datei, und Ihr Browser muss sie holen, bevor er irgendetwas transkribieren kann. Das ist es, was hereinkommt, und woher.',
      ],
      table: {
        caption: 'Was die Seite herunterlädt, woher und wann',
        head: ['Was', 'Woher', 'Wann', 'Ungefähre Größe'],
        rows: [
          [
            'Die Seite und ihr Programmcode',
            'transcribevid.com (Cloudflare)',
            'Bei jedem Besuch, dann im Cache',
            'Etwa 200 KB',
          ],
          [
            'Der Engine-Code, der das Modell ausführt',
            'transcribevid.com',
            'Erste Transkription, dann im Cache',
            'Unter 1 MB',
          ],
          [
            'Die Modell-Laufzeit (ONNX Runtime, WebAssembly)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Erste Transkription, dann im Cache',
            'Etwa 17 bis 27 MB',
          ],
          [
            'Ein kleines Sprach-Erkennungsmodell',
            'transcribevid.com',
            'Erste Transkription, dann im Cache',
            'Etwa 1,2 MB',
          ],
          [
            'Das Sprachmodell für Ihre Qualitätswahl',
            'huggingface.co (Hugging Face)',
            'Einmal pro Qualitätswahl, dann im Cache',
            'Von etwa 40 MB bis zu einigen GB (siehe unten)',
          ],
          [
            'Ein Konverter für Formate, die der Browser nicht öffnen kann (AVI, WMA, FLV und ähnliche)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Nur wenn Ihre Datei ihn braucht, und nur nachdem Sie zugestimmt haben',
            'Etwa 9 MB',
          ],
          [
            'Das Hindi-Schreibweise-Modell (IndicXlit)',
            'transcribevid.com',
            'Nur wenn Hindi in lateinischen Buchstaben geschrieben wird (Hinglish), dann im Cache',
            'Etwa 13 MB',
          ],
        ],
      },
      after: [
        'Diese Downloads sind Programm- und Modelldateien, nicht Ihre Daten. Die Unternehmen, die sie ausliefern, sehen die üblichen Angaben jeder Webanfrage, etwa Ihre Internetadresse und Ihren Browser, aber nie Ihre Medien oder Ihr Transkript.',
      ],
    },
    {
      title: 'Was weiterhin gesendet wird, ehrlich gesagt',
      paragraphs: [
        'Drei Dinge erreichen tatsächlich einen Server, und keines davon ist Ihre Datei oder Ihr Text.',
      ],
      bullets: [
        {
          title: 'Das Hosting.',
          text: 'Cloudflare liefert die Website aus und verarbeitet dafür Ihre Internetadresse und die üblichen Anfragedetails, um die Seite auszuliefern und zu schützen.',
        },
        {
          title: 'Eine laufende Gesamtzahl.',
          text: 'Wenn eine Transkription abgeschlossen ist, sendet Ihr Browser eine leere Anfrage an den Zähler der Seite, der die im Header angezeigte Zahl um eins erhöht. Sie enthält keine Datei, kein Transkript und keine Kennung. Der Zähler wird von den Browsern der Besucher gemeldet und ist nicht unabhängig geprüft.',
        },
        {
          title: 'Werbung.',
          text: 'Die Seite ist kostenlos, weil sie von Google AdSense ausgelieferte Werbung zeigt, auf Informationsseiten, nie während eine Datei transkribiert wird und nie neben Ihrem Transkript. Google verwendet Cookies für Werbung und fragt, wo das Gesetz es verlangt, zuerst nach Ihrer Einwilligung. Die Werbeskripte von Google stellen eigene Anfragen an Google, aber Ihre Datei und Ihr Transkript werden nie an Google gesendet.',
        },
      ],
      after: [
        'Die Datenschutzerklärung legt all das ausführlich dar. Es gibt kein Konto, und die Seite fragt nicht nach einem Namen oder einer E-Mail-Adresse.',
      ],
    },
    {
      title: 'So überprüfen Sie es selbst',
      paragraphs: [
        'Sie müssen uns nicht beim Wort nehmen. Jeder moderne Browser kann Ihnen zeigen, was eine Seite sendet und empfängt, und die Prüfung dauert zwei Minuten.',
      ],
      steps: [
        {
          title: 'Entwicklerwerkzeuge öffnen',
          text: 'Öffnen Sie in Chrome, Edge oder Firefox die Startseite von transcribevid.com und drücken Sie F12 (auf einem Mac Befehl, Wahl und I). Wählen Sie den Tab „Netzwerk“ (Network).',
        },
        {
          title: 'Liste leeren',
          text: 'Klicken Sie auf die Schaltfläche zum Leeren, die wie ein Kreis mit einem Strich aussieht, damit nur neue Anfragen erscheinen.',
        },
        {
          title: 'Eine Transkription starten',
          text: 'Fügen Sie eine Datei hinzu und klicken Sie auf „Transkribieren“. Lassen Sie den Tab „Netzwerk“ sichtbar.',
        },
        {
          title: 'Beobachten, was hereinkommt',
          text: 'Beim ersten Mal sehen Sie große Downloads von huggingface.co und cdn.jsdelivr.net. Das sind das Modell und die Engine, die eintreffen.',
        },
        {
          title: 'Nach dem suchen, was hinausgeht',
          text: 'Tippen Sie method:POST in das Filterfeld (Chrome und Edge; Firefox akzeptiert denselben Filter). Die einzige POST-Anfrage an transcribevid.com sollte eine leere Anfrage an /api/count nach Abschluss des Transkripts sein. Öffnen Sie sie und prüfen Sie ihren Anfragetext: Er ist leer. Zeigt die Seite Werbung, stellen die Skripte von Google eigene Anfragen an Google, und keine davon trägt Ihre Datei oder Ihr Transkript. Nichts annähernd in der Größe Ihrer Datei verlässt Ihr Gerät.',
        },
      ],
    },
    {
      title: 'Wie groß ist der erste Download, und wie schnell ist er?',
      paragraphs: [
        'Die Größe hängt von der Qualitätsstufe und der Art des Geräts ab. Ein Gerät mit WebGPU erhält eine für seine Größe kompakte Ausführung, während ein Gerät, das WebAssembly nutzt, eine andere erhält. Die Seite nennt Ihnen die genaue Download-Größe, bevor sie beginnt, Sie werden also nie überrascht. Dies sind die ungefähren Größen der Modelldateien (die WebGPU-Angaben gelten für Browser mit 16-Bit-Shader-Unterstützung; andere Geräte erhalten andere Ausführungen):',
      ],
      table: {
        caption: 'Ungefährer Modell-Download beim ersten Mal',
        head: ['Qualitätsstufe', 'Whisper-Modell', 'Mit WebGPU', 'Mit WebAssembly'],
        rows: [
          ['Am schnellsten', 'Base', 'Etwa 146 MB', 'Etwa 77 MB'],
          ['Standard', 'Small', 'Etwa 485 MB', 'Etwa 249 MB'],
          ['Hohe Genauigkeit', 'Large v3 Turbo', 'Etwa 564 MB', 'Etwa 1,1 GB'],
          [
            'Beste Genauigkeit',
            'Large v3',
            'Etwa 980 MB, plus etwa 564 MB für Zeitmarken pro Wort',
            'Etwa 1,8 GB, plus etwa 1,1 GB für Zeitmarken pro Wort',
          ],
        ],
      },
      after: [
        'Rechnen Sie einige Megabyte für die Konfigurationsdateien des Modells dazu. Large v3 hat keine eigene Version mit Zeitmarken pro Wort, bei eingeschalteten „Zeitmarken pro Wort“, was die Standardeinstellung ist, lädt sein erster Durchlauf daher auch das Large-v3-Turbo-Zeitmarken-Modell herunter, und die Seite sagt das vor dem Start. Dieses Turbo-Modell bleibt erhalten und wird mit der Auswahl „Hohe Genauigkeit“ geteilt. Nach dem ersten Download wird das Modell aus dem Cache Ihres Browsers gelesen, spätere Transkriptionen beginnen also sofort. Die Geschwindigkeit danach hängt ganz von Ihrem Gerät ab: Ein Computer mit leistungsfähigem Grafikchip und WebGPU ist viel schneller als ein Handy oder ein älterer Laptop mit WebAssembly.',
      ],
    },
    {
      title: 'Wann das das richtige Werkzeug ist und wann nicht',
      paragraphs: [
        'Auf dem eigenen Gerät zu transkribieren passt gut für private Inhalte und für lange Dateien. Es ist nicht das beste Werkzeug für alles.',
      ],
      bullets: [
        {
          title: 'Gut für vertrauliche Aufnahmen.',
          text: 'Auf transcribevid.com bleiben Interviews, Besprechungen, medizinische oder juristische Notizen und persönliche Videos auf Ihrem Gerät.',
        },
        {
          title: 'Gut für lange Dateien.',
          text: 'Auf transcribevid.com gibt es keinen Upload, auf den man warten müsste, und kein gesetztes Größen- oder Längenlimit. Eine sehr lange Aufnahme braucht Zeit und freien Speicher, und ein Browser ohne WebCodecs-Unterstützung lehnt eine sehr lange Datei unter Umständen ab.',
        },
        {
          title: 'Nicht für Live-Untertitel.',
          text: 'Das Transkript wird aus einer fertigen Datei oder Aufnahme erstellt. Es untertitelt keine Live-Veranstaltung, während sie stattfindet.',
        },
        {
          title: 'Nicht für Sprechernamen.',
          text: 'Zeilen tragen Zeitstempel, aber der Text sagt nicht, wer spricht. Sie können beim Bearbeiten Namen eintippen.',
        },
        {
          title: 'Nicht ideal auf einem schwachen Handy.',
          text: 'Handys haben weniger Speicher. Die Seite warnt Sie und schaltet unter Umständen die größten Qualitätsstufen ab, wenn Ihr Gerät sie nicht ausführen kann. Schneiden Sie sehr lange Aufnahmen in Teile.',
        },
        {
          title: 'Nicht, wenn Sie nicht einmal eine große Datei herunterladen können.',
          text: 'Die erste Nutzung braucht eine Verbindung, die zehn oder hundert Megabyte holen kann.',
        },
      ],
    },
    {
      title: 'Ihre Daten anschließend löschen',
      paragraphs: [
        'Auf transcribevid.com werden Ihre Transkripte und die Quelldatei im Speicher Ihres Browsers aufbewahrt, damit die Seite sie anzeigen und Sie sie bearbeiten und exportieren können. Sie werden automatisch gelöscht, wenn Ihre Sitzung nach einer Zeit der Inaktivität endet, oder sofort, wenn Sie im Menü „Transkripte“ auf „Meine Daten jetzt löschen“ klicken. Gelöschte Daten lassen sich nicht wiederherstellen, exportieren Sie also zuerst, was Sie brauchen.',
        'Die Sprachmodelle bleiben im Cache Ihres Browsers, damit spätere Transkriptionen schnell sind, bis Sie sie löschen („Meine Daten jetzt löschen“ kann sie ebenfalls entfernen) oder Ihr Browser seinen Speicher leert. Wenn Sie einen gemeinsam genutzten oder öffentlichen Computer verwenden, klicken Sie auf „Meine Daten jetzt löschen“, bevor Sie gehen, denn jeder, der dieses Browserprofil öffnen kann, kann lesen, was darin gespeichert ist.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Stimmt es wirklich, dass meine Datei nie hochgeladen wird?',
      answer:
        'Ja, auf transcribevid.com. Die Erkennung läuft in Ihrem Browser, und Ihre Datei wird von der Seite von Ihrer eigenen Festplatte gelesen. Sie können es im Tab „Netzwerk“ der Entwicklerwerkzeuge Ihres Browsers bestätigen: Die einzige Anfrage, die etwas an transcribevid.com sendet, ist eine leere Zähl-Anfrage nach Abschluss des Transkripts, und die Werbeskripte von Google stellen eigene Anfragen an Google, die nie Ihre Datei tragen.',
    },
    {
      question: 'Funktioniert die Transkription auch bei langsamer Verbindung?',
      answer:
        'Der langsame Teil ist der erste Download des Sprachmodells, der Hunderte Megabyte umfassen kann. Sobald es in Ihrem Browser gespeichert ist, nutzt die Transkription selbst Ihr eigenes Gerät und braucht keine Netzwerkgeschwindigkeit.',
    },
    {
      question: 'Warum lädt mein Browser ein Modell von einer anderen Website herunter?',
      answer:
        'Das Modell ist das Programm, das Sprache erkennt, und es ist viel zu groß, um in die Seite eingebaut zu werden. Es wird von Hugging Face heruntergeladen, einem öffentlichen Host für solche Modelle, und die Engine, die es ausführt, kommt von jsDelivr. Keiner von beiden erhält Ihre Medien oder Ihr Transkript.',
    },
    {
      question: 'Ist Transkribieren auf dem eigenen Gerät schneller als Hochladen?',
      answer:
        'Das kann sein, weil es keinen Upload und keine Warteschlange gibt und ein Computer mit WebGPU schnell ist. Auf einem älteren Laptop oder einem Handy kann dieselbe Aufgabe länger dauern, als ein schneller Server brauchen würde. Der erste Durchlauf enthält außerdem den einmaligen Modell-Download.',
    },
  ],
  links: [
    {
      label: 'Interview-Transkription',
      path: '/interview-transcription',
      note: 'Der private Weg für Forschungs-, Journalismus- und Bewerbungsinterviews.',
    },
    {
      label: 'Was ist Whisper?',
      path: '/guides/what-is-whisper',
      note: 'Das Sprachmodell, das Ihr Browser ausführt, in einfachen Worten erklärt.',
    },
    {
      label: 'So erhalten Sie ein genaueres Transkript',
      path: '/guides/accurate-transcripts',
      note: 'Einstellungen und Gewohnheiten, die besseren Text liefern, egal auf welchem Gerät.',
    },
    {
      label: 'Video zu Text',
      path: '/video-to-text',
      note: 'Fügen Sie ein Video hinzu und sehen Sie zu, wie es auf Ihrem eigenen Gerät zu Text mit Zeitstempeln wird.',
    },
    {
      label: 'Meeting-Aufzeichnung zu Text',
      path: '/meeting-recording-to-text',
      note: 'Machen Sie aus einer gespeicherten Zoom-, Teams- oder Meet-Aufzeichnung ein durchsuchbares Transkript.',
    },
  ],
};
