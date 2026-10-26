import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Was ist Whisper? Spracherkennung erklärt',
  lead: 'Whisper ist ein quelloffenes Spracherkennungsmodell, das OpenAI 2022 veröffentlicht hat. Es wandelt gesprochenen Ton in rund hundert Sprachen in Text um und kann auf Ihrem eigenen Computer laufen. Dieser Ratgeber erklärt, woher es kommt, woraus es gelernt hat, wie es funktioniert, wo es stark und wo schwach ist und wie TranscribeVid es in Ihrem Browser ausführt.',
  readingMinutes: 8,
  toolPath: '/audio-to-text',
  toolCta: 'Whisper mit Ihrer eigenen Audiodatei ausprobieren',
  blocks: [
    {
      title: 'Whisper in einem Absatz',
      paragraphs: [
        'Whisper ist ein neuronales Netz, das darauf trainiert wurde, Sprache anzuhören und aufzuschreiben, was es hört. Sie geben ihm Ton, es liefert Text mit Zeitstempeln zurück, und es kann auch die Sprache benennen und Sprache ins Englische übersetzen. Es gibt es in mehreren Größen, von einer winzigen Version, die auf ein Handy passt, bis zu einer großen, die einen leistungsstarken Computer braucht.',
        'Es ist keine Website und kein Dienst. Es ist eine Sammlung von Dateien: das Modell und der Code, der es ausführt. Jeder darf sie herunterladen und nutzen, weshalb viele kostenlose und private Transkriptionswerkzeuge, darunter dieses, darauf aufbauen.',
      ],
    },
    {
      title: 'Woher es kommt',
      paragraphs: [
        'OpenAI hat Whisper im September 2022 veröffentlicht, zusammen mit einer Forschungsarbeit mit dem Titel „Robust Speech Recognition via Large-Scale Weak Supervision“. Der Code und die trainierten Modelle erschienen unter der MIT-Lizenz, einer der freizügigsten Open-Source-Lizenzen. Sie erlaubt es, die Software zu nutzen, zu verändern und weiterzugeben, auch in kommerziellen Produkten.',
        'Vor Whisper war die beste Spracherkennung meist in den Diensten großer Unternehmen eingeschlossen oder für eine Sprache oder eine Art von Ton gebaut. Whisper hat das geändert, indem es gut genug, breit genug und kostenlos zum Selbstbetreiben war. OpenAI verkauft auch den Zugang zu Spracherkennung über einen eigenen Webdienst, aber das ist ein getrenntes, kostenpflichtiges Produkt. Das Modell, das Sie hier in Ihrem Browser ausführen, ist das offene.',
      ],
    },
    {
      title: 'Woraus es gelernt hat',
      paragraphs: [
        'Whisper hat aus etwa 680.000 Stunden Ton gelernt, der mit Transkripten gepaart und aus dem Internet gesammelt wurde. Rund ein Drittel dieses Tons war nicht auf Englisch und deckte etwa hundert Sprachen ab (die Veröffentlichung nennt 99). Die Transkripte wurden nicht alle von Hand geprüft, worauf sich „Weak Supervision“ (schwache Überwachung) im Titel der Arbeit bezieht.',
        'Zwei praktische Folgen ergeben sich daraus. Weil der Trainingston so vielfältig war, mit unterschiedlichen Mikrofonen, Akzenten, Räumen und Themen, kommt Whisper mit echten Aufnahmen besser zurecht als Modelle, die auf sauberer Studiosprache trainiert wurden. Aber die Menge an Trainingston unterscheidet sich von Sprache zu Sprache, die Genauigkeit ist also ungleich: Sie ist im Allgemeinen am höchsten für Englisch und andere weit verbreitete Sprachen, für die es viele Beispiele gab, und schwächer für Sprachen mit wenig Trainingsdaten.',
      ],
    },
    {
      title: 'Wie es funktioniert, in einfachen Worten',
      paragraphs: [
        'Whisper schneidet Ton in Fenster von 30 Sekunden und macht aus jedem ein Bild des Klangs, ein sogenanntes Spektrogramm, das zeigt, wie laut jede Tonhöhe im Zeitverlauf ist. Das Modell hat dann zwei Hälften. Ein Encoder untersucht dieses Bild. Ein Decoder schreibt den Text in kleinen Stücken, so wie ein Mensch einen Satz schreibt und dabei überlegt, was als Nächstes kommt.',
        'Der Decoder schreibt auch besondere Markierungen: welche Sprache seiner Ansicht nach gesprochen wird, ob transkribiert oder übersetzt werden soll und wo jeder Satz zeitlich beginnt und endet. Daher kommen die Zeitstempel.',
        'Lange Aufnahmen werden Fenster für Fenster verarbeitet. Dieser Aufbau ist flexibel, erklärt aber zwei Eigenheiten von Whisper: Es kann zwischen den Fenstern den Faden verlieren, und es kann sich wiederholen, wenn ein Fenster wenig Sprache enthält. TranscribeVid mindert beides mit einem Sprach-Detektor, der Stille und den Großteil nicht sprachlicher Geräusche überspringt, bevor das Modell sie sieht, und mit Prüfungen, die danach einen Teil des wiederholten oder erfundenen Texts abfangen.',
      ],
    },
    {
      title: 'Die Modellgrößen und welche Sie hier bekommen',
      paragraphs: [
        'Whisper gibt es in Größen. Größere Modelle machen weniger Fehler, besonders bei Rauschen und in anderen Sprachen als Englisch, sind aber langsamer und brauchen mehr Speicher und einen größeren Download. Die vier Qualitätsstufen auf der Upload-Seite entsprechen diesen Größen so:',
      ],
      table: {
        caption: 'Whisper-Größen und die Auswahl auf TranscribeVid',
        head: ['Modell', 'Parameter (ungefähr)', 'Wo Sie es hier finden'],
        rows: [
          ['Tiny', '39 Millionen', 'Weitere Optionen, Modellliste'],
          ['Base', '74 Millionen', 'Am schnellsten'],
          ['Small', '244 Millionen', 'Standard'],
          ['Medium', '769 Millionen', 'Weitere Optionen, Modellliste'],
          ['Large v3 Turbo', '809 Millionen', 'Hohe Genauigkeit'],
          ['Large v3', '1,55 Milliarden', 'Beste Genauigkeit'],
        ],
      },
      after: [
        'Large v3 erschien im November 2023, und die Turbo-Version kam später, 2024. Turbo ist ein beschnittenes großes Modell, das viel schneller ist und bei vielen Sprachen fast so genau, weshalb es die Wahl „Hohe Genauigkeit“ ist. Eine Einschränkung: OpenAI sagt, Turbo sei nicht für Übersetzung trainiert worden und könne bei einer Übersetzungsanfrage die Originalsprache zurückgeben, wählen Sie für „Ausgabe“, „Ins Englische übersetzen“ daher stattdessen „Beste Genauigkeit“. In der Modellliste gibt es außerdem Distil Large v3, eine kleinere und schnellere destillierte Version von Whisper Large v3 nur für Englisch. Unter „Erkennungsmodul“ gibt es auch Qwen3 ASR, eine andere, experimentelle Engine für Desktop-Browser mit WebGPU. Qwen3 ASR ist kein Whisper-Modell.',
      ],
    },
    {
      title: 'Was es gut kann',
      bullets: [
        {
          title: 'Echter Ton aus dem Alltag.',
          text: 'Handyaufnahmen, Vorlesungen, Interviews und Tonspuren von Videos mit mäßigem Rauschen.',
        },
        {
          title: 'Viele Sprachen in einem Modell.',
          text: 'Dieselbe Modellfamilie beherrscht Englisch, Spanisch, Hindi, Arabisch, Japanisch und Dutzende weitere und kann die Sprache oft selbst herausfinden.',
        },
        {
          title: 'Satzzeichen und Groß- und Kleinschreibung.',
          text: 'Es schreibt Sätze mit Großbuchstaben und Satzzeichen statt einer langen Kette kleingeschriebener Wörter.',
        },
        {
          title: 'Zeitstempel.',
          text: 'Jede Zeile kommt mit Anfangs- und Endzeit, und mit Zeitmarken pro Wort kann die Seite jedes Wort platzieren.',
        },
        {
          title: 'Übersetzung ins Englische.',
          text: 'Es kann Sprache in einer anderen Sprache direkt in englischen Text umwandeln, was die Seite als „Ausgabe“, „Ins Englische übersetzen“ anbietet. Turbo ist die Ausnahme: Es wurde nicht für Übersetzung trainiert, nutzen Sie dafür also „Beste Genauigkeit“.',
        },
      ],
    },
    {
      title: 'Wo es Schwierigkeiten hat',
      paragraphs: [
        'Whisper ist beeindruckend, und es ist auch fehleranfällig. Kennen Sie diese Eigenheiten, bevor Sie sich auf ein Transkript verlassen.',
      ],
      bullets: [
        {
          title: 'Es kann Text erfinden.',
          text: 'Bei Stille, Musik oder Rauschen schreibt es unter Umständen flüssige Wörter, die niemand gesagt hat, oder wiederholt eine Wendung immer wieder. Das ist ein bekanntes Verhalten des Modells, kein Fehler einer einzelnen Aufnahme.',
        },
        {
          title: 'Namen, Zahlen und seltene Wörter.',
          text: 'Es schreibt einen Namen so, wie es ihn am wahrscheinlichsten findet, und kann ähnlich klingende Wörter vertauschen. Nutzen Sie den Wortschatz-Hinweis und prüfen Sie dann die Zahlen.',
        },
        {
          title: 'Ungleiche Sprachen.',
          text: 'Die Genauigkeit schwankt je nach Sprache und Akzent. Ein größeres Modell hilft bei Sprachen mit weniger Trainingsdaten sehr.',
        },
        {
          title: 'Keine Sprecherzuordnung.',
          text: 'Es sagt nicht, wer spricht, und sich überlagernde Stimmen werden oft zusammengelegt oder ausgelassen.',
        },
        {
          title: 'Nicht live.',
          text: 'Es arbeitet eine Aufnahme Fenster für Fenster ab und ist daher nicht für Untertitel gebaut, die erscheinen, während jemand spricht.',
        },
      ],
    },
    {
      title: 'Wie TranscribeVid Whisper in Ihrem Browser ausführt',
      paragraphs: [
        'Das ursprüngliche Whisper ist für spezialisierte Software für maschinelles Lernen geschrieben. Um es in einer Webseite auszuführen, werden die Modelle in ein portables Format namens ONNX umgewandelt, und eine Bibliothek namens Transformers.js von Hugging Face führt sie mit ONNX Runtime aus. Auf einem Computer mit WebGPU erledigt der Grafikchip die Arbeit, was schnell ist. Andernfalls läuft es über WebAssembly auf dem Prozessor, was langsamer ist, aber fast überall funktioniert.',
        'Damit die Downloads vertretbar bleiben, nutzen die Modelle kompakte Zahlenformate, die die Dateien verkleinern, meist mit einem kleinen Verlust an Genauigkeit. So kommt es, dass das größte Modell mit WebGPU etwa ein Gigabyte groß ist (1,8 GB mit WebAssembly) statt mehrerer.',
        'Auf transcribevid.com hat das Ausführen im Browser zwei Folgen. Erstens Datenschutz: Ihre Mediendatei wird auf Ihrem Gerät gelesen und nicht hochgeladen, also erhält kein Server von uns je Ihren Ton. Zweitens Geschwindigkeit: Sie hängt von Ihrem Gerät ab, und die erste Nutzung jeder Qualitätsstufe enthält einen einmaligen Modell-Download. Der Ratgeber zum Transkribieren ohne Hochladen erklärt, was heruntergeladen wird und wie Sie es überprüfen können.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Ist Whisper kostenlos?',
      answer:
        'Das Modell und sein Code sind frei und quelloffen unter der MIT-Lizenz, jeder kann sie also ausführen. Ein großes Modell zu betreiben braucht einen leistungsfähigen Computer oder einen gemieteten Server, und OpenAI bietet auch einen eigenen kostenpflichtigen Webdienst an. Auf transcribevid.com läuft es auf Ihrem Gerät, es gibt also nichts zu bezahlen.',
    },
    {
      question: 'Wie viele Sprachen versteht Whisper?',
      answer:
        'Rund hundert; die Veröffentlichung nennt 99. Die Qualität unterscheidet sich zwischen ihnen stark. TranscribeVid bietet 61 davon in seiner Liste „Sprache“ an, und Sie können auch „Automatisch erkennen“ wählen.',
    },
    {
      question: 'Welche Whisper-Größe sollte ich wählen?',
      answer:
        'Beginnen Sie mit „Standard“, was das Small-Modell ist. Wechseln Sie für Akzente, Rauschen oder andere Sprachen als Englisch zu „Hohe Genauigkeit“ und zu „Beste Genauigkeit“, wenn jedes Wort zählt und Sie warten können. „Am schnellsten“ ist nur für klare, ruhige Sprache.',
    },
    {
      question: 'Warum schreibt Whisper manchmal Wörter, wo niemand spricht?',
      answer:
        'Das Modell ist darauf gebaut, immer plausiblen Text zu erzeugen, deshalb kann ein Abschnitt mit Stille, Musik oder Rauschen es dazu bringen, welchen zu erfinden. Ist „Stille und Musik überspringen“ eingeschaltet, werden die meisten dieser Abschnitte übersprungen, bevor das Modell sie sieht.',
    },
  ],
  links: [
    {
      label: 'So erhalten Sie ein genaueres Transkript',
      path: '/guides/accurate-transcripts',
      note: 'Die Einstellungen und Gewohnheiten, die den größten Unterschied bei der Ausgabe von Whisper machen.',
    },
    {
      label: 'Video transkribieren, ohne es hochzuladen',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Was Ihr Browser herunterlädt, um Whisper auszuführen, und wie Sie prüfen, dass nichts hochgeladen wird.',
    },
    {
      label: 'Sprache ins Englische übersetzen',
      path: '/translate-audio-to-english',
      note: 'Mit der Übersetzung von Whisper englischen Text aus Sprache in einer anderen Sprache erhalten.',
    },
    {
      label: 'Audio zu Text',
      path: '/audio-to-text',
      note: 'Eine Aufnahme hineinlegen und ein Transkript mit Zeitstempeln erhalten.',
    },
    {
      label: 'Hindi Audio zu Text (Seite auf Englisch)',
      path: '/hindi-audio-to-text',
      note: 'Wie Whisper mit Hindi umgeht, einschließlich einer Option für Hinglish in lateinischen Buchstaben.',
    },
  ],
};
