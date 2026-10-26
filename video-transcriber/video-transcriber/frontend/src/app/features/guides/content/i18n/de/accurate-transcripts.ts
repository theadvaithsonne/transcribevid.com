import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'So erhalten Sie ein genaueres Transkript',
  lead: 'Die Genauigkeit hängt zuerst vom Ton ab, dann von drei Entscheidungen, die Sie selbst treffen: Sprache, Qualitätsstufe und Wortschatz-Hinweis. Dieser Ratgeber zeigt, was Sie vor der Aufnahme ändern sollten, welche Einstellungen helfen, wie Sie die verbleibenden Fehler finden und was Spracherkennung grundsätzlich nicht leisten kann.',
  readingMinutes: 10,
  toolPath: '/video-to-text',
  toolCta: 'Ein Video mit den besten Einstellungen transkribieren',
  blocks: [
    {
      title: 'Wovon die Genauigkeit eines Transkripts abhängt',
      paragraphs: [
        'Spracherkennung hört zu, ganz ähnlich wie Sie. Spricht jemand deutlich, nah am Mikrofon, in einem ruhigen Raum und in einer Sprache, die das Modell gut kennt, ist das Transkript meist sehr gut. Ist der Ton weit entfernt, verrauscht, hallig oder voller Stimmen, muss sich selbst ein Mensch konzentrieren, und die Software macht mehr Fehler.',
        'Daraus ergibt sich eine einfache Reihenfolge. Bessern Sie zuerst den Ton, denn nichts, was danach kommt, kann Wörter zurückholen, die nie aufgenommen wurden. Nennen Sie dem Programm dann die Sprache. Wählen Sie danach eine Qualitätsstufe, die zur Schwierigkeit passt. Geben Sie ihm dann die ungewöhnlichen Wörter, die es nicht erraten kann. Prüfen Sie zuletzt das Ergebnis, denn kein Transkript ist perfekt.',
      ],
    },
    {
      title: 'Die Aufnahme selbst verbessern',
      paragraphs: [
        'Ein paar Minuten Sorgfalt bei der Aufnahme bringen mehr als jede Einstellung danach.',
      ],
      bullets: [
        {
          title: 'Gehen Sie nah heran.',
          text: 'Halten Sie das Mikrofon etwa eine bis zwei Handbreiten vom Mund der sprechenden Person entfernt. Ein Handy aus nächster Nähe schlägt einen Laptop auf der anderen Tischseite.',
        },
        {
          title: 'Wählen Sie einen ruhigen, weichen Raum.',
          text: 'Vorhänge, Teppiche und Sofas schlucken Hall. Kahle Wände und große leere Räume verschmieren die Wörter. Schalten Sie Ventilatoren, Klimaanlagen und Benachrichtigungen aus.',
        },
        {
          title: 'Keine Musik unter der Stimme.',
          text: 'Hintergrundmusik lässt sich schwer von Sprache trennen. Fügen Sie sie nach dem Transkribieren hinzu, nicht davor.',
        },
        {
          title: 'Immer nur eine Stimme.',
          text: 'Sich überlagernde Sprecher sind der schwierigste Fall. Bitten Sie die Leute, einander ausreden zu lassen, und nehmen Sie, wo es geht, mit einem Mikrofon pro Person auf.',
        },
        {
          title: 'Sorgen Sie sich nicht um die Abtastrate.',
          text: 'Die Sprachmodelle lesen Ton mit 16 kHz in Mono, und die Seite wandelt jede Datei automatisch darauf um. Eine höhere Rate oder ein Surround-Mix hilft nicht; Abstand, Rauschen und Pegel tun es.',
        },
        {
          title: 'Vermeiden Sie starke Kompression.',
          text: 'Dateien mit sehr niedriger Bitrate, etwa eine Sprachnachricht, die über eine schwache Verbindung zusammengequetscht wurde, verlieren Details, die das Modell braucht. Nehmen Sie die Originalaufnahme, wenn Sie sie haben.',
        },
      ],
    },
    {
      title: 'Nennen Sie die Sprache',
      paragraphs: [
        'Die Seite kann die Sprache selbst erkennen, und bei einer langen Aufnahme in klarem Englisch liegt sie meist richtig. Bei kurzen Clips, starken Akzenten und Aufnahmen mit gemischten Sprachen kann die Erkennung aber danebenliegen, und eine falsche Vermutung macht das ganze Transkript schlecht. Die Sprache in der Liste „Sprache“ zu wählen, kostet einen Klick und beseitigt das Risiko.',
        'Kann die Seite die Sprache nicht sicher bestimmen, sagt sie das und bittet Sie, die Sprache zu wählen, die Sie hören. Tun Sie das und starten Sie erneut. Wird in der Aufnahme zwischen zwei Sprachen gewechselt, etwa Hindi und Englisch, wählen Sie die Hauptsprache und prüfen die Passagen in der anderen.',
      ],
    },
    {
      title: 'Die richtige Qualitätsstufe wählen',
      paragraphs: [
        'Die vier Qualitätsstufen führen unterschiedlich große Modelle derselben Familie aus. Ein größeres Modell macht bei Akzenten, Rauschen, anderen Sprachen und seltenen Wörtern weniger Fehler, braucht aber länger und hat einen größeren ersten Download.',
      ],
      table: {
        caption: 'Die Qualitätsstufen und wann Sie welche nutzen',
        head: ['Auswahl', 'Am besten für', 'Kompromiss'],
        rows: [
          [
            'Am schnellsten',
            'Klare Sprache in einer ruhigen Aufnahme, schnelle Entwürfe',
            'Bei schwierigem Ton die meisten Fehler der vier Stufen',
          ],
          [
            'Standard',
            'Die meisten Videos und Sprachaufnahmen (die übliche Ausgangswahl)',
            'Eine gute Balance aus Geschwindigkeit und Genauigkeit',
          ],
          [
            'Hohe Genauigkeit',
            'Akzente, Hintergrundrauschen, nicht englische Sprache',
            'Langsamer, größerer Download',
          ],
          [
            'Beste Genauigkeit',
            'Schwieriger Ton, bei dem jedes Wort zählt',
            'Am langsamsten, größter Download',
          ],
        ],
      },
      after: [
        'Eine gute Gewohnheit ist, mit „Standard“ an einem kurzen Ausschnitt Ihrer Aufnahme zu beginnen, ihn zu lesen und nur dann eine Stufe höher zu gehen, wenn die Fehler stören. Unter „Weitere Optionen“ können Sie auch aus der vollständigen Modellliste wählen. Auf manchen Geräten sind „Hohe Genauigkeit“ und „Beste Genauigkeit“ ausgegraut, mit dem Grund daneben, etwa „braucht 8 GB“ oder „für diese Größe einen Computer verwenden“, denn die größeren Modelle brauchen mehr Speicher. Jede größere Stufe ist zudem ein größerer Download beim ersten Mal, und die Seite zeigt die Größe, bevor Sie starten.',
      ],
    },
    {
      title: 'Den Wortschatz-Hinweis für Namen und Fachbegriffe nutzen',
      paragraphs: [
        'Sprachmodelle kennen gängige Wörter gut und seltene schlecht. Ein Personenname, eine Firma, ein Produkt, ein Ort oder ein Fachbegriff wird so geschrieben, wie das Modell es am wahrscheinlichsten findet, und das ist oft falsch. Dafür gibt es den „Wortschatz-Hinweis“ unter „Weitere Optionen“.',
        'Tippen Sie die ungewöhnlichen Wörter so ein, wie sie geschrieben werden sollen, zum Beispiel in einem Satz wie „Interview mit Dr. Okafor über Kubernetes und PostgreSQL.“ Eine kurze, natürliche Zeile, die die Wörter enthält, funktioniert besser als eine lange Liste. Er ist optional und kann bis zu 1.000 Zeichen enthalten. Die Seite merkt ihn sich nicht in Ihren gespeicherten Einstellungen, falls er private Namen enthält.',
        'Der Hinweis hilft bei der Schreibweise. Er bringt dem Modell nicht bei, ein genuscheltes oder vom Rauschen überdecktes Wort zu hören.',
      ],
    },
    {
      title: 'Audio verbessern und Stille und Musik überspringen',
      paragraphs: [
        'Zwei Schalter unter „Weitere Optionen“ sind standardmäßig eingeschaltet, und bei den meisten Aufnahmen sollten Sie sie eingeschaltet lassen.',
      ],
      bullets: [
        {
          title: 'Audio verbessern.',
          text: 'Filtert sehr tiefes Brummen und sehr hohes Zischen und gleicht dann die Lautstärke an, damit eine leise Stimme neben einer lauten nicht untergeht. Klingt eine Aufnahme für Sie gut, das Transkript aber seltsam, probieren Sie es einmal mit ausgeschaltetem Schalter, um zu sehen, ob der Filter die Ursache ist.',
        },
        {
          title: 'Stille und Musik überspringen.',
          text: 'Ein Sprach-Detektor findet die Abschnitte mit menschlicher Stimme und gibt nur diese an das Modell weiter. Stille und der Großteil nicht sprachlicher Geräusche, etwa Musik ohne Gesang, erreichen es nie, was einen großen Teil des erfundenen Texts verhindert, den ein Modell erzeugen kann, wenn es nichts zu hören bekommt. Musik mit Gesang kann trotzdem durchkommen. Schalten Sie es nur aus, wenn leise Sprache verloren geht.',
        },
      ],
      after: [
        '„Zeitmarken pro Wort“ ist ebenfalls standardmäßig eingeschaltet. Es ändert nicht, welche Wörter erkannt werden, lässt Untertitel aber genau mit den Wörtern beginnen und enden und liefert die Markierungen, die zeigen, welche Wörter unsicher waren.',
      ],
    },
    {
      title: 'Das Ergebnis prüfen: wo sich die Fehler verstecken',
      paragraphs: [
        'Ist das Transkript fertig, lesen Sie es nicht zuerst von oben nach unten. Suchen Sie nach den Markierungen. Wörter, bei denen sich das Modell weniger sicher war, sind unterstrichen, mit einer stärkeren Unterstreichung für die unsichersten. Ist das ganze Transkript wenig verlässlich oder war die Sprache unsicher, zeigt die Seite einen Hinweis mit einer Schaltfläche, um Sprache und Qualität zu überprüfen.',
        'Der Konfidenzwert ist ein Hinweis, wo Sie hinschauen sollten, keine Genauigkeitsangabe in Prozent, ein Wort ohne Unterstreichung kann also trotzdem falsch sein. Richten Sie Ihre Aufmerksamkeit in dieser Reihenfolge aus:',
      ],
      bullets: [
        {
          title: 'Namen und Orte.',
          text: 'Das sind die häufigsten Fehler und die peinlichsten.',
        },
        {
          title: 'Zahlen, Daten und Einheiten.',
          text: 'Eine falsche Zahl ändert die Bedeutung. Prüfen Sie jede an der Aufnahme.',
        },
        {
          title: 'Gleichklingende Wörter.',
          text: 'Etwa „das“ und „dass“ oder „wieder“ und „wider“ werden aus dem Zusammenhang gewählt und können vertauscht sein.',
        },
        {
          title: 'Passagen nahe an Lärm oder sich überlagernden Stimmen.',
          text: 'Hören Sie am Zeitstempel noch einmal hin. Klicken Sie auf eine Zeile, um zu dieser Stelle zu springen.',
        },
      ],
      after: [
        'Korrigieren Sie, was Sie finden, direkt im Text. Ihre Änderungen bleiben im Transkript erhalten und fließen in jeden Export ein.',
      ],
    },
    {
      title: 'Problem und was Sie versuchen können',
      table: {
        caption: 'Häufige Probleme und was Sie zuerst versuchen sollten',
        head: ['Problem', 'Was Sie versuchen können'],
        rows: [
          [
            'Falsche Sprache oder Text in der falschen Schrift',
            'Wählen Sie die Sprache selbst, statt „Automatisch erkennen“ zu nutzen',
          ],
          [
            'Namen und Marken falsch geschrieben',
            'Tragen Sie sie unter „Weitere Optionen“ in den Wortschatz-Hinweis ein und transkribieren Sie die Datei dann von der Startseite aus erneut',
          ],
          [
            'Viele Fehler bei Akzenten oder verrauschtem Ton',
            'Gehen Sie eine Qualitätsstufe höher und lassen Sie „Audio verbessern“ eingeschaltet',
          ],
          [
            'Text erscheint, wo niemand spricht',
            'Lassen Sie „Stille und Musik überspringen“ eingeschaltet; kürzen Sie lange stille oder reine Musikabschnitte',
          ],
          [
            'Dieselbe Wendung wiederholt sich immer wieder',
            'Lassen Sie „Vorherigen Text als Kontext nutzen“ ausgeschaltet und probieren Sie eine andere Qualitätsstufe',
          ],
          [
            'Zwei Personen reden durcheinander',
            'Per Software lässt sich das nicht beheben: nehmen Sie beim nächsten Mal mit getrennten Mikrofonen auf',
          ],
          [
            'Eine sehr leise oder weit entfernte Stimme wird nicht erkannt',
            'Lassen Sie „Audio verbessern“ eingeschaltet; geht Sprache weiterhin verloren, schalten Sie „Stille und Musik überspringen“ für diese Datei aus',
          ],
        ],
      },
    },
    {
      title: 'Was Spracherkennung nicht kann',
      paragraphs: [
        'Wer die Grenzen kennt, erkennt Probleme früher. Ein Transkript aus jeder Spracherkennung, auch aus dieser, kann Folgendes enthalten.',
      ],
      bullets: [
        {
          title: 'Keine Sprechernamen.',
          text: 'Es schreibt, was gesagt wurde, nicht, wer es gesagt hat. Ergänzen Sie Namen beim Bearbeiten von Hand.',
        },
        {
          title: 'Erfundener Text.',
          text: 'Bei Stille, Musik oder Rauschen kann ein Modell flüssige Wörter erzeugen, die niemand gesprochen hat, oder eine Wendung viele Male wiederholen. Sehen Sie Text, wo Sie nichts hören, löschen Sie ihn.',
        },
        {
          title: 'Falsche Homophone und seltene Wörter.',
          text: 'Es wählt das wahrscheinlichste Wort, und das ist nicht immer das richtige.',
        },
        {
          title: 'Verlorene Wörter bei Durcheinanderreden.',
          text: 'Sich überlagernde Sprache wird meist als eine Stimme transkribiert oder teilweise ausgelassen.',
        },
        {
          title: 'Keine Garantie.',
          text: 'Behandeln Sie das Transkript bei allem Rechtlichen, Medizinischen, Finanziellen oder Veröffentlichten als Entwurf, den ein Mensch prüfen muss.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Welche Qualitätsstufe liefert das genaueste Transkript?',
      answer:
        '„Beste Genauigkeit“ macht meist die wenigsten Fehler, „Hohe Genauigkeit“ liegt oft knapp dahinter, dann folgen „Standard“ und „Am schnellsten“. Der Abstand zählt am meisten bei Akzenten, Rauschen und anderen Sprachen als Englisch. Bei klarer englischer Sprache sind die Unterschiede klein, deshalb reicht oft „Standard“.',
    },
    {
      question: 'Hilft ein besseres Mikrofon mehr als eine bessere Einstellung?',
      answer:
        'Meistens ja. Sauberer, naher Ton lässt ein kleineres Modell gut arbeiten, schlechter Ton begrenzt selbst das größte. Das Mikrofon näher zu bringen und Hintergrundlärm zu senken, ist die günstigste Verbesserung, die Sie vornehmen können.',
    },
    {
      question: 'Sollte ich den Ton vor dem Transkribieren in einem Editor bereinigen?',
      answer:
        'Selten. Die Seite filtert bereits Brummen und Zischen und gleicht die Lautstärke an, wenn „Audio verbessern“ eingeschaltet ist. Starke Rauschunterdrückungs-Filter in einem Editor können Sprache verzerren und die Erkennung verschlechtern, nutzen Sie also sanfte Einstellungen oder gar keine.',
    },
    {
      question: 'Warum liefern zwei Qualitätsstufen für dieselbe Datei unterschiedlichen Text?',
      answer:
        'Es sind unterschiedlich große Modelle, und jedes hört und schreibt eine schwierige Passage auf seine Weise. Wo zwei Durchläufe voneinander abweichen, hören Sie sich die Passage am Zeitstempel an, denn sie ist wahrscheinlich schwierig und eine Kontrolle nach Gehör wert.',
    },
    {
      question: 'Kann ich das Transkript durch Bearbeiten genauer machen?',
      answer:
        'Das Bearbeiten korrigiert den Text, den Sie exportieren; es trainiert das Modell nicht nach. Korrigieren Sie Namen, Zahlen und unklare Wörter auf der Transkript-Seite und laden Sie die korrigierte Fassung herunter. Ein neuer Durchlauf mit Wortschatz-Hinweis verringert die Korrekturen beim nächsten Mal.',
    },
  ],
  links: [
    {
      label: 'Was ist Whisper?',
      path: '/guides/what-is-whisper',
      note: 'Das Sprachmodell hinter den Qualitätsstufen und wo es stark oder schwach ist.',
    },
    {
      label: 'Interview-Transkription',
      path: '/interview-transcription',
      note: 'Tipps zum Transkribieren eines Gesprächs mit zwei Stimmen und vielen Namen.',
    },
    {
      label: 'Vorlesung zu Text',
      path: '/lecture-to-text',
      note: 'Notizen aus einer aufgezeichneten Vorlesung, selbst aus der letzten Reihe eines großen Raums.',
    },
    {
      label: 'Hindi Audio zu Text (Seite auf Englisch)',
      path: '/hindi-audio-to-text',
      note: 'Die Wahl der Sprache zählt am meisten bei Hindi und anderer nicht englischer Sprache.',
    },
    {
      label: 'Video transkribieren, ohne es hochzuladen',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Wie die Engine im Browser arbeitet und was das Gerät, das Sie nutzen, ändert.',
    },
  ],
};
