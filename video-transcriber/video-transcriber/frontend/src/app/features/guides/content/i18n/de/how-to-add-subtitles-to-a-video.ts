import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'So fügen Sie einem Video Untertitel hinzu, kostenlos',
  lead: 'Untertitel zu erstellen dauert vier Schritte: die Sprache in Text umwandeln, die Fehler korrigieren, eine SRT- oder VTT-Datei exportieren und diese Datei an das Video anhängen. Dieser Ratgeber führt durch jeden Schritt und zeigt, wie Sie die Datei in YouTube, VLC, einem Schnittprogramm, auf einer Webseite oder mit ffmpeg dauerhaft ins Bild einfügen.',
  readingMinutes: 9,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Untertitel aus Ihrem Video erstellen',
  blocks: [
    {
      title: 'Zuerst entscheiden: weiche oder eingebrannte Untertitel',
      paragraphs: [
        'Es gibt zwei Wege, ein Video mit Untertiteln zu versehen, und die Wahl bestimmt, welche Schritte Sie brauchen.',
      ],
      bullets: [
        {
          title: 'Weiche Untertitel (eine separate Spur).',
          text: 'Die Untertitel sind eine Datei oder eine Spur neben dem Video. Zuschauer können sie ein- und ausschalten, eine Sprache wählen, und Sie können einen Tippfehler später korrigieren, ohne das Video anzufassen. So funktionieren YouTube, VLC, die meisten Player und Webseiten. Es braucht einen Player, der Untertitelspuren unterstützt.',
        },
        {
          title: 'Eingebrannte Untertitel (Teil des Bildes).',
          text: 'Der Text wird in jedes Einzelbild gezeichnet und erscheint daher überall, auch auf Plattformen, die keine Untertiteldatei akzeptieren. Der Preis ist, dass ihn niemand ausschalten kann, Sie ihn nicht korrigieren können, ohne das Video erneut zu exportieren, und das Video neu kodiert werden muss.',
        },
      ],
      after: [
        'Im Zweifel beginnen Sie mit weichen Untertiteln. Brennen Sie sie nur ein, wenn der Ort, an dem Sie veröffentlichen, keinen Untertitel-Upload hat.',
      ],
    },
    {
      title: 'Die vier Schritte auf einen Blick',
      steps: [
        {
          title: 'Das Video transkribieren',
          text: 'Fügen Sie das Video auf der Startseite hinzu, wählen Sie die gesprochene Sprache und lassen Sie die Sprache zu zeitgestempeltem Text werden.',
        },
        {
          title: 'Den Text korrigieren',
          text: 'Lesen Sie das Transkript und korrigieren Sie Namen, Zahlen und unklare Wörter. Werden die Untertitelzeilen zu lang, wählen Sie im Menü „Exportieren“ eine kürzere „Länge der Untertitelzeilen“.',
        },
        {
          title: 'SRT oder VTT exportieren',
          text: 'Laden Sie die Untertiteldatei herunter. SRT funktioniert fast überall. VTT ist für das Video-Element einer Webseite.',
        },
        {
          title: 'Die Datei anhängen',
          text: 'Laden Sie sie zu YouTube hoch, laden Sie sie in Ihrem Player oder Schnittprogramm oder fügen Sie sie Ihrer Seite hinzu. Oder brennen Sie sie ins Video ein.',
        },
      ],
    },
    {
      title: 'Schritte 1 und 2: das Video transkribieren und den Text korrigieren',
      paragraphs: [
        'Wählen Sie das Video auf der Startseite und wählen Sie die Sprache, die darin gesprochen wird, statt die automatische Erkennung stehen zu lassen. Die Sprache zu nennen ist zuverlässiger, besonders bei kurzen Clips und Akzenten. Die Qualität „Standard“ passt für die meisten Videos. Wählen Sie „Hohe Genauigkeit“ bei verrauschtem Ton oder starken Akzenten.',
        'Lassen Sie „Zeitmarken pro Wort“ unter „Weitere Optionen“ eingeschaltet. Es ist standardmäßig aktiviert und sorgt dafür, dass jeder Untertitel mit den Wörtern beginnt und endet statt an den Rändern eines langen Blocks. Ist das Transkript fertig, spielen Sie das Video daneben ab und lesen Sie mit. Wörter, bei denen sich die Spracherkennung weniger sicher war, sind unterstrichen, solange der Schalter „Unsichere Wörter unterstreichen“ eingeschaltet ist (standardmäßig ist er es), prüfen Sie diese also zuerst.',
        'Untertitel werden im Tempo gelesen, formen Sie den Text daher für die Zuschauer. Dies sind weit verbreitete Richtlinien, keine strengen Regeln:',
      ],
      bullets: [
        {
          title: 'Zeilenlänge.',
          text: 'Etwa 42 Zeichen pro Zeile und nicht mehr als zwei Zeilen auf einmal. Das Menü „Exportieren“ hat eine Auswahl „Länge der Untertitelzeilen“: Kurz (32 Buchstaben), Standard (42) oder Lang (56).',
        },
        {
          title: 'Zeit auf dem Bildschirm.',
          text: 'Jeder Untertitel sollte mindestens etwa eine Sekunde stehen bleiben und selten länger als etwa sieben.',
        },
        {
          title: 'Lesegeschwindigkeit.',
          text: 'Etwa 15 bis 20 Zeichen pro Sekunde sind für die meisten Erwachsenen angenehm. Wenn man mit dem Lesen nicht fertig wird, bevor die Zeile wechselt, kürzen Sie den Wortlaut oder lassen Sie ihn länger stehen.',
        },
        {
          title: 'Natürliche Umbrüche.',
          text: 'Ein guter Untertitel bricht am Ende einer Wendung um, nicht mitten in einem Namen oder zwischen einem Artikel und seinem Substantiv. Der Export bricht lange Zeilen für Sie um, halten Sie also jede bearbeitete Zeile als vollständige Wendung.',
        },
      ],
    },
    {
      title: 'Schritt 3: SRT oder VTT wählen',
      paragraphs: [
        'Laden Sie SRT herunter, es sei denn, die Untertitel sind für ein Video auf Ihrer eigenen Webseite. YouTube, VLC und fast jedes Schnittprogramm nehmen SRT. Eine Webseite braucht VTT, weil Browser Untertitelspuren nur in diesem Format lesen.',
        'Sie können beide aus demselben Transkript herunterladen, Sie müssen sich also nicht im Voraus entscheiden. Der Ratgeber zu SRT und VTT erklärt die genauen Unterschiede, einschließlich dessen, was in jeder Datei steht.',
      ],
    },
    {
      title: 'Schritt 4: die Datei zu YouTube, VLC oder einem Schnittprogramm hinzufügen',
      paragraphs: [
        'Menünamen ändern sich von Zeit zu Zeit, suchen Sie daher nach der nächsten Entsprechung, wenn eine Beschriftung von der unten genannten abweicht.',
      ],
      bullets: [
        {
          title: 'YouTube.',
          text: 'Öffnen Sie YouTube Studio, wählen Sie das Video, öffnen Sie „Untertitel“, fügen Sie eine Sprache hinzu und wählen Sie dann, eine Datei hochzuladen. Wählen Sie die Option für eine Datei mit Zeitangaben, wählen Sie Ihre SRT-Datei und veröffentlichen Sie. YouTube lässt Sie die Zeilen danach auf demselben Bildschirm bearbeiten.',
        },
        {
          title: 'VLC.',
          text: 'Spielen Sie das Video ab und wählen Sie dann im Menü „Untertitel“, „Untertiteldatei hinzufügen“ und wählen Sie Ihre SRT-Datei. Sie können die Datei auch auf das Player-Fenster ziehen. Oder speichern Sie die SRT-Datei mit demselben Namen neben dem Video (lecture.mp4 und lecture.srt), dann lädt VLC sie meist von selbst.',
        },
        {
          title: 'Videoschnittprogramme.',
          text: 'Die meisten Schnittprogramme können eine SRT-Datei als Untertitelspur importieren, über ein Menü wie „Datei“, „Importieren“ oder über das Untertitel-Bedienfeld. Liegt sie auf der Zeitleiste, können Sie den Text neu gestalten. Wird ein Format abgelehnt, probieren Sie das andere.',
        },
        {
          title: 'Handys und Tablets.',
          text: 'Eine Videoplayer-App, die Untertiteldateien unterstützt, etwa VLC für Mobilgeräte, kann eine SRT-Datei aus Ihren Dateien laden. Der eingebaute Galerie-Player vieler Handys kann das nicht.',
        },
      ],
    },
    {
      title: 'Untertitel mit dem Track-Element zu einer Webseite hinzufügen',
      paragraphs: [
        'Auf Ihrer eigenen Website lädt das HTML-Video-Element Untertitel über ein Track-Element, das auf eine WebVTT-Datei verweist. Exportieren Sie VTT, laden Sie es neben dem Video hoch und fügen Sie eine Zeile hinzu.',
      ],
      code: {
        label: 'Ein Video mit einer Untertitelspur',
        text: `<video controls src="talk.mp4">
  <track kind="subtitles" src="talk.en.vtt"
         srclang="en" label="English" default>
</video>`,
      },
      after: [
        'Das Attribut default zeigt die Spur an, ohne dass die Zuschauer sie wählen. Fügen Sie pro Sprache eine Track-Zeile hinzu. Liegt die VTT-Datei auf einer anderen Domain als die Seite, muss dieser Server Cross-Origin-Anfragen erlauben, sonst lädt der Browser sie nicht.',
      ],
    },
    {
      title: 'Eine weiche Untertitelspur mit ffmpeg zu einer MP4-Datei hinzufügen',
      paragraphs: [
        'ffmpeg ist ein kostenloses Kommandozeilenwerkzeug, das die Untertitel in die MP4-Datei packen kann, sodass Video und Untertitel als eine Datei reisen. Video und Ton werden unberührt kopiert, das ist daher schnell und verliert keine Qualität. Legen Sie das Video und die SRT-Datei in einen Ordner und führen Sie dort diesen Befehl aus.',
      ],
      code: {
        label: 'Weiche Untertitel in einer MP4-Datei (Zuschauer können sie ausschalten)',
        text: `ffmpeg -i talk.mp4 -i talk.srt -map 0:v -map 0:a? -map 1:0 -c:v copy -c:a copy -c:s mov_text -metadata:s:s:0 language=eng talk-subtitled.mp4`,
      },
      after: [
        'Die -map-Optionen wählen genau aus, was in die neue Datei kommt: das gesamte Video, jeden Ton (das Fragezeichen lässt den Befehl weiterlaufen, wenn keiner vorhanden ist) und die Untertiteldatei. Die Streams von Hand zu wählen vermeidet Fehler bei Handy- und Kameradateien, die zusätzliche Datenspuren enthalten, die MP4 oft nicht kopieren kann. Die Einstellung mov_text ist der Untertiteltyp, den MP4-Dateien verwenden. Der Sprachcode hat drei Buchstaben: eng für Englisch, spa für Spanisch, hin für Hindi und so weiter. Player wie VLC zeigen die Spur in ihrem Untertitelmenü an.',
      ],
    },
    {
      title: 'Untertitel mit ffmpeg ins Bild einbrennen',
      paragraphs: [
        'Für eine Plattform, die nur ein Video akzeptiert, zeichnen Sie den Text in jedes Einzelbild. Dabei wird das Video neu kodiert, es dauert also länger, und die Datei wird neu erstellt. Der Ton wird unverändert kopiert. Führen Sie es in dem Ordner aus, der beide Dateien enthält, das vermeidet Ärger mit Dateipfaden.',
      ],
      code: {
        label: 'Eingebrannte Untertitel (dauerhaft, nicht abschaltbar)',
        text: `ffmpeg -i talk.mp4 -vf "subtitles=talk.srt" -c:a copy talk-burned.mp4`,
      },
      after: [
        "Um das Aussehen zu ändern, fügen Sie nach dem Dateinamen einen Stil hinzu, zum Beispiel subtitles=talk.srt:force_style='FontSize=22' innerhalb der Anführungszeichen des Befehls. Behalten Sie eine Kopie des Originalvideos, denn eine eingebrannte Version lässt sich nicht wieder in weiche Untertitel zurückverwandeln.",
      ],
    },
    {
      title: 'Barrierefreiheit, und warum Sie den Text prüfen müssen',
      paragraphs: [
        'Untertitel helfen gehörlosen und schwerhörigen Menschen, Menschen, die im Zug oder in einem ruhigen Büro ohne Ton schauen, Menschen, die die Sprache noch lernen, und allen, denen das Folgen geschriebener Worte leichter fällt. Viele Zuschauer schalten sie ein, auch wenn sie den Ton hören könnten.',
        'Spracherkennung ist gut, aber nicht perfekt, und ein Untertitel mit einem falschen Namen oder einer falschen Zahl kann in die Irre führen. Lesen Sie das Transkript immer gegen das Video, bevor Sie es veröffentlichen, und seien Sie besonders sorgfältig bei Namen, Zahlen, Fachbegriffen und allem Rechtlichen oder Medizinischen. Untertitel, die auch wichtige Geräusche beschreiben, etwa Lachen oder eine schließende Tür, sind für Menschen nützlicher, die sie nicht hören können, und Sie können diese beim Bearbeiten von Hand ergänzen.',
      ],
    },
  ],
  faqs: [
    {
      question:
        'Was ist der Unterschied zwischen Untertiteln und Untertiteln für Hörgeschädigte (Captions)?',
      answer:
        'Untertitel übersetzen oder schreiben die Sprache für Zuschauer aus, die das Video hören können. Captions beschreiben zusätzlich Geräusche, etwa Musik oder Lachen, für Zuschauer, die nicht hören können. Die Dateien sind dieselbe Art von Datei, Sie können einer SRT-Datei also selbst Geräuschbeschreibungen hinzufügen, wenn Sie Captions möchten.',
    },
    {
      question: 'Brauche ich eine besondere Software, um Untertitel hinzuzufügen?',
      answer:
        'Nein. Laden Sie die SRT-Datei in YouTube Studio hoch, ziehen Sie sie auf VLC oder importieren Sie sie in Ihrem Schnittprogramm. Nur das Packen der Datei in eine MP4-Datei oder das Einbrennen des Textes ins Bild braucht ein Werkzeug wie ffmpeg oder ein Schnittprogramm, das es exportieren kann.',
    },
    {
      question: 'Kann ich Untertitel in mehr als einer Sprache hinzufügen?',
      answer:
        'Ja, mit weichen Untertiteln. Erstellen Sie für jede Sprache eine Datei und fügen Sie jede als eigene Spur hinzu. Diese Seite kann das Transkript in der gesprochenen Sprache schreiben und Sprache ins Englische übersetzen, den Text in andere Sprachen müssten Sie aber selbst oder mit einem anderen Werkzeug übersetzen.',
    },
    {
      question: 'Warum sind meine Untertitel nicht synchron mit dem Video?',
      answer:
        'Entweder ist die ganze Datei verschoben, was die meisten Player mit einer Einstellung für die Untertitelverzögerung beheben können, oder das Video wurde bearbeitet, nachdem die Untertitel erstellt wurden. Untertitel folgen der Zeit des Audios, aus dem sie erstellt wurden, transkribieren Sie also den finalen Schnitt des Videos.',
    },
  ],
  links: [
    {
      label: 'SRT-Untertitel-Generator',
      path: '/srt-subtitle-generator',
      note: 'Beginnen Sie hier, um ein Video in eine SRT-Datei zu verwandeln.',
    },
    {
      label: 'SRT oder VTT',
      path: '/guides/srt-vs-vtt',
      note: 'Was in jeder Datei steht und welche Sie für Ihren Fall herunterladen sollten.',
    },
    {
      label: 'VTT-Untertitel-Generator',
      path: '/vtt-subtitle-generator',
      note: 'Holen Sie sich die WebVTT-Datei, die das Video-Element einer Webseite braucht.',
    },
    {
      label: 'YouTube-Untertitel-Generator',
      path: '/youtube-subtitle-generator',
      note: 'Der YouTube-spezifische Weg, von der Datei bis zum Upload in Studio.',
    },
    {
      label: 'Sprache ins Englische übersetzen',
      path: '/translate-audio-to-english',
      note: 'Englische Untertitel aus einem Video, das in einer anderen Sprache gesprochen wird.',
    },
  ],
};
