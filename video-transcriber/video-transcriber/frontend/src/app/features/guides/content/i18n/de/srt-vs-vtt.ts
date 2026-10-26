import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'SRT oder VTT: Welches Untertitelformat sollten Sie verwenden?',
  lead: 'SRT ist der sichere Standard: Fast jeder Videoplayer, jedes Schnittprogramm und jede Plattform liest es. Wählen Sie VTT (WebVTT), wenn die Untertitel für das Video-Element einer Webseite gedacht sind oder wenn Sie Formatierung und Positionierung brauchen. Beide sind reine Textdateien, und Sie können hier aus Ihrem Video jede von beiden herunterladen.',
  readingMinutes: 9,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'SRT-Datei aus Ihrem Video erstellen',
  blocks: [
    {
      title: 'Die kurze Antwort',
      paragraphs: [
        'Wenn Sie nicht sicher sind, nehmen Sie SRT. Es ist das ältere und einfachere Format, und fast jeder Videoplayer, jedes Schnittprogramm und jedes Upload-Formular, denen Sie begegnen werden, akzeptiert es. Eine Untertiteldatei, die überall funktioniert, ist mehr wert als eine raffinierte.',
        'Nehmen Sie VTT, wenn das Video auf einer Webseite über das HTML-Video-Element abgespielt wird. Browser laden Untertitelspuren nur im WebVTT-Format, eine SRT-Datei funktioniert dort also nicht ohne Umwandlung. VTT ist auch die bessere Wahl, wenn Sie den Text auf dem Bildschirm platzieren, mit Sicherheit Fettdruck oder Kursivschrift ergänzen oder kennzeichnen möchten, wer spricht.',
        'Alles Weitere in diesem Ratgeber erklärt, warum das so ist, zeigt Ihnen, wie jede Datei von innen aussieht, und sagt Ihnen, wie Sie von einer zur anderen wechseln, ohne etwas kaputt zu machen.',
      ],
    },
    {
      title: 'Wie eine SRT-Datei aussieht',
      paragraphs: [
        'SRT steht für SubRip Text, benannt nach einem Windows-Programm aus den frühen 2000er-Jahren, das Untertitel von DVDs kopierte. Das Format wurde nie offiziell standardisiert, wurde aber so verbreitet, dass alles es unterstützt. Eine SRT-Datei ist eine Liste nummerierter Blöcke, jeweils durch eine Leerzeile vom nächsten getrennt.',
      ],
      code: {
        label: 'Eine kleine SRT-Datei',
        text: `1
00:00:01,000 --> 00:00:03,500
Welcome to the show.

2
00:00:03,800 --> 00:00:07,200
Today we look at how
subtitle files are built.

3
00:00:07,600 --> 00:00:10,000
Let's start with the basics.`,
      },
      after: [
        'Jeder Block hat drei Teile: eine laufende Nummer, eine Zeile mit der Startzeit und der Endzeit und eine oder zwei Textzeilen. Die Zeiten werden als Stunden, Minuten, Sekunden und Millisekunden geschrieben, und die Millisekunden werden durch ein Komma getrennt. Dieses Komma ist der häufigste Grund, warum eine von Hand umgewandelte Datei scheitert.',
        'Speichern Sie die Datei als reinen Text in UTF-8 mit der Endung .srt. UTF-8 ist wichtig, sobald der Text Akzente, Devanagari, Arabisch oder andere nicht englische Zeichen enthält.',
      ],
    },
    {
      title: 'Wie eine WebVTT-Datei aussieht',
      paragraphs: [
        'WebVTT, meist zu VTT verkürzt, wurde für das Web entworfen und ist in einer Spezifikation des W3C definiert, der Organisation, die Webtechnik standardisiert. Es sieht SRT ähnlich, ergänzt aber eine vorgeschriebene Kopfzeile und einige optionale Extras.',
      ],
      code: {
        label: 'Dieselben Untertitel als WebVTT-Datei',
        text: `WEBVTT

NOTE This file was made from the SRT example.

intro
00:00:01.000 --> 00:00:03.500
Welcome to the show.

00:00:03.800 --> 00:00:07.200 line:85% align:center
Today we look at how
subtitle files are built.

00:00:07.600 --> 00:00:10.000
<v Maria>Let's start with the basics.</v>`,
      },
      after: [
        'Vier Einzelheiten heben es ab. Die erste Zeile muss WEBVTT lauten. Die Millisekunden werden durch einen Punkt getrennt, nicht durch ein Komma. Ein Eintrag kann einen Namen (das Wort intro oben) statt oder zusätzlich zu einer Nummer haben, und die Nummern sind optional. Und nach den Zeiten dürfen Einstellungen wie line, position und align stehen, die den Text auf dem Bildschirm verschieben.',
        'Sie können außerdem NOTE-Blöcke für Kommentare schreiben, die Zuschauer nie sehen, mit dem v-Tag kennzeichnen, wer spricht, und einfache Tags wie b, i und u für Fett, Kursiv und Unterstrichen verwenden. Speichern Sie die Datei als UTF-8 mit der Endung .vtt.',
      ],
    },
    {
      title: 'SRT und VTT im Vergleich',
      paragraphs: [
        'Diese Tabelle stellt die beiden nebeneinander. Die Unterschiede, die im Alltag zählen, sind die Kopfzeile, das Dezimaltrennzeichen und wo jedes Format akzeptiert wird.',
      ],
      table: {
        caption: 'SRT im Vergleich mit WebVTT',
        head: ['', 'SRT', 'WebVTT (VTT)'],
        rows: [
          ['Dateiendung', '.srt', '.vtt'],
          ['Erste Zeile', 'Die Zahl 1', 'Das Wort WEBVTT'],
          ['Zeitformat', '00:00:01,000 (Komma)', '00:00:01.000 (Punkt)'],
          ['Eintragsnummern', 'Erforderlich', 'Optional (ein Name ist erlaubt)'],
          [
            'Position auf dem Bildschirm',
            'Nicht im Format vorgesehen',
            'Eintragseinstellungen: line, position, align, size',
          ],
          [
            'Formatierung und Sprecher-Tags',
            'Nur einfache Tags, Unterstützung je nach Player verschieden',
            'In der Spezifikation definiert, dazu CSS-Formatierung',
          ],
          ['Kommentare', 'Keine', 'NOTE-Blöcke'],
          ['Video-Element einer Webseite', 'Nicht akzeptiert', 'Das erforderliche Format'],
          ['Formale Spezifikation', 'Keine (ein De-facto-Format)', 'W3C-Spezifikation'],
        ],
      },
      after: [
        'In einfachen Worten: SRT ist die einfachere Datei mit der größeren Reichweite, VTT ist die reichhaltigere Datei mit der engeren, aber moderneren Heimat. Für gewöhnliche Untertitel gesprochener Sprache sieht der Text auf dem Bildschirm bei beiden gleich aus.',
      ],
    },
    {
      title: 'Wo welches Format akzeptiert wird',
      paragraphs: [
        'Die Unterstützung ändert sich mit der Zeit, und jede Plattform formuliert ihre Hilfeseiten anders, verstehen Sie dies also als Orientierung und prüfen Sie die aktuelle Hilfeseite des Dienstes, auf den Sie hochladen.',
      ],
      bullets: [
        {
          title: 'Webseiten.',
          text: 'Das Track-Element des HTML-Video-Tags braucht WebVTT. Das ist die eine Stelle, an der SRT keine Option ist.',
        },
        {
          title: 'YouTube.',
          text: 'Der Untertitel-Upload akzeptiert SRT und unter anderem auch VTT. SRT ist die übliche Wahl.',
        },
        {
          title: 'Desktop- und Mobil-Player.',
          text: 'VLC und die meisten anderen Player lesen SRT, und viele lesen auch VTT. Ein Player lädt meist eine Untertiteldatei, die denselben Namen wie das Video trägt.',
        },
        {
          title: 'Videoschnittprogramme.',
          text: 'Die meisten Schnittprogramme importieren SRT als Untertitelspur. Manche importieren auch VTT. Wird ein Format abgelehnt, probieren Sie das andere.',
        },
        {
          title: 'Andere Social-Media- und Lernplattformen.',
          text: 'Viele verlangen SRT oder VTT, einige nur eines von beiden. Lesen Sie die Upload-Seite, bevor Sie exportieren.',
        },
      ],
    },
    {
      title: 'SRT und VTT von Hand ineinander umwandeln',
      paragraphs: [
        'Die Datei umzubenennen reicht nicht. Eine Datei namens talk.vtt, die noch SRT-Inhalt enthält, wird von Browsern abgelehnt, weil ihr die Kopfzeile fehlt und ihre Zeiten Kommas verwenden. Die Umwandlung dauert in jedem Texteditor eine Minute.',
      ],
      steps: [
        {
          title: 'SRT zu VTT, Schritt eins',
          text: 'Fügen Sie ganz oben die Zeile WEBVTT hinzu, gefolgt von einer Leerzeile.',
        },
        {
          title: 'SRT zu VTT, Schritt zwei',
          text: 'Ändern Sie in jeder Zeitzeile das Komma vor den Millisekunden in einen Punkt. Ein Suchen und Ersetzen bei den --> Zeilen oder beim Muster der Ziffern um das Komma spart Zeit.',
        },
        {
          title: 'SRT zu VTT, Schritt drei',
          text: 'Lassen Sie die Nummern, wo sie sind, denn VTT erlaubt sie als Eintragsnamen. Speichern Sie als UTF-8 mit der Endung .vtt.',
        },
        {
          title: 'VTT zu SRT',
          text: 'Gehen Sie umgekehrt vor: Löschen Sie die Kopfzeile, NOTE-Blöcke und alle Einstellungen nach den Zeiten, ändern Sie Punkte zurück in Kommas, stellen Sie sicher, dass jeder Eintrag eine Nummer hat, und speichern Sie als .srt.',
        },
      ],
      after: [
        'Wenn Sie ffmpeg installiert haben, wandelt es auch Untertiteldateien um: ffmpeg -i talk.srt talk.vtt macht aus einer SRT-Datei eine VTT-Datei, und derselbe Befehl mit vertauschten Namen geht in die andere Richtung. Der einfachste Weg ist jedoch, das benötigte Format von der Transkriptseite herunterzuladen, denn beide werden direkt aus demselben Text erzeugt.',
      ],
    },
    {
      title: 'Häufige Probleme und ihre Ursachen',
      bullets: [
        {
          title: 'Akzente oder nicht lateinische Buchstaben erscheinen als seltsame Symbole.',
          text: 'Die Datei ist nicht als UTF-8 gespeichert. Speichern Sie sie mit dieser Kodierung neu.',
        },
        {
          title: 'Auf der Webseite wird nichts angezeigt.',
          text: 'Die Datei ist SRT statt VTT, oder der Server liefert sie mit dem falschen Typ aus. VTT-Dateien sollten als text/vtt ausgeliefert werden, und eine Datei auf einer anderen Domain braucht außerdem die richtigen Cross-Origin-Einstellungen.',
        },
        {
          title: 'Die Untertitel kommen überall zu spät oder zu früh.',
          text: 'Die ganze Datei ist verschoben. Die meisten Player und Schnittprogramme lassen Sie Untertitel um eine feste Zeit versetzen, was einfacher ist, als jede Zeile zu bearbeiten.',
        },
        {
          title: 'Zwei Untertitel überlappen sich auf dem Bildschirm.',
          text: 'Die Endzeit eines Eintrags liegt nach der Startzeit des nächsten. Kürzen Sie den früheren Eintrag.',
        },
        {
          title: 'Zeilen sind zu lang zum Lesen.',
          text: 'Teilen Sie sie in zwei Zeilen etwa gleicher Länge. Etwa 42 Zeichen pro Zeile sind eine gängige Richtlinie.',
        },
      ],
    },
    {
      title: 'So bekommen Sie hier eine SRT- oder VTT-Datei aus Ihrem Video',
      paragraphs: [
        'Sie müssen keines der beiden Formate selbst schreiben. Fügen Sie Ihre Video- oder Audiodatei auf der Startseite hinzu, wählen Sie die gesprochene Sprache und lassen Sie das Transkript fertig werden. Lesen Sie es durch und korrigieren Sie jedes falsche Wort: Eine bearbeitete Zeile behält ihre Start- und Endzeit, und die Wörter darin werden im Verhältnis ihrer Länge über diese Zeit verteilt.',
        'Öffnen Sie dann das Download-Menü und wählen Sie SRT oder VTT. Beide werden aus demselben bearbeiteten Transkript erstellt, Sie können also eines für YouTube und das andere für Ihre eigene Webseite exportieren, ohne Arbeit zu wiederholen. Wenn die Untertitel an den richtigen Wörtern sauber umbrechen sollen, lassen Sie „Zeitmarken pro Wort“ unter „Weitere Optionen“ eingeschaltet.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Kann ich eine SRT-Datei in VTT umbenennen und auf meiner Website verwenden?',
      answer:
        'Nein. Ein Browser lehnt eine .vtt-Datei ab, die nicht mit WEBVTT beginnt, und SRT-Zeiten verwenden Kommas, wo VTT Punkte braucht. Fügen Sie die Kopfzeile hinzu, ändern Sie die Kommas oder laden Sie eine VTT-Datei direkt von der Transkriptseite herunter.',
    },
    {
      question: 'Unterscheiden sich SRT- und VTT-Dateien in Größe oder Qualität?',
      answer:
        'Nein. Beide sind kleine Textdateien, und keine wirkt sich auf die Videoqualität aus. Der Unterschied liegt nur in den zusätzlichen Dingen, die VTT beschreiben kann, etwa Bildschirmposition und Formatierung, und darin, wo jedes Format akzeptiert wird.',
    },
    {
      question: 'Können SRT-Untertitel fett, kursiv oder farbig sein?',
      answer:
        'Manche Player verstehen einfache Tags wie b und i in SRT, aber die Unterstützung ist uneinheitlich, das Ergebnis kann daher von Player zu Player abweichen. WebVTT definiert seine Tags und die CSS-Formatierung in einer Spezifikation, was das Ergebnis im Web berechenbarer macht.',
    },
    {
      question: 'Welche Textkodierung sollte eine Untertiteldatei verwenden?',
      answer:
        'UTF-8. Es deckt jede Sprache ab und ist das, was Browser für WebVTT erwarten. Sehen Zeichen in den Untertiteln kaputt aus, wurde die Datei mit ziemlicher Sicherheit in einer älteren Kodierung gespeichert.',
    },
  ],
  links: [
    {
      label: 'SRT-Untertitel-Generator',
      path: '/srt-subtitle-generator',
      note: 'Legen Sie ein Video ab und laden Sie eine SRT-Datei herunter, die aus der Sprache darin erstellt wurde.',
    },
    {
      label: 'VTT-Untertitel-Generator',
      path: '/vtt-subtitle-generator',
      note: 'Dasselbe für eine WebVTT-Datei, die mit dem Video-Element einer Webseite funktioniert.',
    },
    {
      label: 'So fügen Sie einem Video Untertitel hinzu',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Schritt für Schritt, vom Transkript zu einem Video, das Untertitel in YouTube, VLC oder einem Schnittprogramm zeigt.',
    },
    {
      label: 'YouTube-Untertitel-Generator',
      path: '/youtube-subtitle-generator',
      note: 'Erstellen Sie eine SRT-Datei für ein Video, das Ihnen gehört, und laden Sie sie in YouTube Studio hoch.',
    },
    {
      label: 'So erhalten Sie ein genaueres Transkript',
      path: '/guides/accurate-transcripts',
      note: 'Besserer Text bedeutet weniger Korrekturen, bevor Sie die Untertitel exportieren.',
    },
  ],
};
