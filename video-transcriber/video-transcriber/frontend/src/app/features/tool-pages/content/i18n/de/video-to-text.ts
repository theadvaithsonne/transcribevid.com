import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Video zu Text',
  h1: 'Video zu Text umwandeln: kostenlos und mit Zeitstempeln',
  lead: 'Laden Sie ein aufgenommenes Video hoch und sehen Sie zu, wie aus der Sprache Text wird, Zeile für Zeile, jede Zeile mit ihrer Uhrzeit. Vorlesungen, Interviews, Besprechungen, Handyclips und Bildschirmaufnahmen funktionieren, in mehr als 50 Sprachen.',
  dropKind: 'video',
  dropNoun: 'Video',

  whyTitle: 'Warum ein Video in Text umwandeln',
  why: [
    'In Videos lässt sich schlecht suchen. Man kann sie nicht überfliegen, nicht zitieren und keinen Satz herauskopieren. Ein Transkript macht die Sprache zu Text, den Sie durchsuchen, zitieren, übersetzen und in einem Bruchteil der Zeit lesen können, und jede Zeile behält ihren Zeitstempel, sodass Sie genau an die Stelle zurückspringen können.',
    'Genutzt wird es für aufgezeichnete Vorlesungen und Webinare, Interviewmaterial, gespeicherte Team-Meetings, Produktvorführungen, Vlogs und kurze Social-Media-Clips. Der Text ist außerdem ein guter Ausgangspunkt für Untertitel, Shownotes, Blogbeiträge und Besprechungsprotokolle.',
  ],

  howTitle: 'So wandeln Sie ein Video in Text um',
  howToDescription:
    'Laden Sie eine Videodatei hoch, wählen Sie die gesprochene Sprache, warten Sie auf das Transkript und laden Sie es als Text oder Untertitel herunter.',
  steps: [
    {
      title: 'Video auswählen',
      text: 'Legen Sie das Video im Feld oben auf dieser Seite ab oder klicken Sie auf „Datei auswählen“. Es öffnet sich im Uploader, in dem Sie weitere Videos hinzufügen können.',
    },
    {
      title: 'Sprache und Qualität festlegen',
      text: 'Wählen Sie die gesprochene Sprache für die beste Genauigkeit oder lassen Sie die automatische Erkennung an. „Standard“ passt für die meisten Videos. „Am schnellsten“ ist schnell bei klarer Sprache. Für verrauschtes oder schwieriges Audio wählen Sie „Hohe Genauigkeit“ oder „Beste Genauigkeit“; „Beste Genauigkeit“ dauert am längsten und macht die wenigsten Fehler.',
    },
    {
      title: 'Beim Transkribieren zusehen',
      text: 'Der Text erscheint live, Zeile für Zeile, mit einem Fortschrittsbalken und einer Schätzung der verbleibenden Zeit.',
    },
    {
      title: 'Bearbeiten und herunterladen',
      text: 'Korrigieren Sie jede Zeile im Editor und laden Sie dann TXT, SRT, VTT, Markdown, JSON oder PDF herunter. Nach Ihrer Sitzung wird nichts aufbewahrt, laden Sie also herunter, bevor Sie gehen.',
    },
  ],

  formatsTitle: 'Unterstützte Videodateien und Downloads',
  formatsIntro:
    'TranscribeVid liest die Tonspur, die Bildqualität spielt also keine Rolle. Reine Audiodateien funktionieren ebenfalls.',
  uploadTitle: 'Videodateien, die Sie hochladen können',
  accepts: ['MP4', 'MKV', 'MOV', 'AVI', 'WEBM', 'WMV', 'FLV', 'M4V', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'reiner Text zum Lesen oder Einfügen' },
    { name: 'SRT', use: 'Untertitel für Player und Schnittprogramme' },
    { name: 'VTT', use: 'Untertitel für Web-Videos' },
    { name: 'Markdown', use: 'Text mit Überschriften und Zeiten' },
    { name: 'JSON', use: 'zeitgestempelte Zeilen für Programme' },
    { name: 'PDF', use: 'eine druckbare Kopie' },
  ],

  tipsTitle: 'Tipps für bessere Video-Transkripte',
  tips: [
    {
      title: 'Hören Sie zuerst die erste Minute an.',
      text: 'Wenn Sie die Sprache über Laptop-Lautsprecher kaum verstehen, geht es der Software genauso. Beheben Sie Lautstärkeprobleme, bevor Sie hochladen.',
    },
    {
      title: 'Nennen Sie die Sprache.',
      text: 'Die gesprochene Sprache selbst zu wählen ist zuverlässiger als die automatische Erkennung, besonders bei kurzen oder akzentuierten Clips.',
    },
    {
      title: 'Ergänzen Sie einen Wortschatz-Hinweis.',
      text: 'Tragen Sie unter „Weitere Optionen“ Namen, Marken und Fachbegriffe so ein, wie sie geschrieben werden sollen.',
    },
    {
      title: 'Bleiben Sie unter dem Limit.',
      text: 'Videos, die länger oder größer als das oben genannte Limit sind, werden abgelehnt. Schneiden Sie lange Aufnahmen daher vorher in Teile.',
      browser: {
        title: 'Lange Videos dauern länger.',
        text: 'Es gibt kein Größenlimit, aber ein langes Video braucht auf Ihrem Gerät mehr Zeit und mehr Speicher. Schneiden Sie sehr lange Aufnahmen auf dem Handy in Teile.',
      },
    },
    {
      title: 'Prüfen Sie die markierten Zeilen.',
      text: 'Zeilen, bei denen sich die Spracherkennung unsicher ist, sind markiert. Sehen Sie sich diese zuerst an, denn kein Transkript ist perfekt.',
    },
  ],

  faqs: [
    {
      question: 'Ist die Umwandlung von Video zu Text wirklich kostenlos?',
      answer:
        'Ja. Sie ist kostenlos, es gibt kein Konto und keine Anmeldung, und es gibt kein Tages- oder Monatskontingent. {limits} Wenn viele Menschen den Dienst nutzen, muss Ihre Datei unter Umständen eine Weile in einer Warteschlange warten.',
      browser: {
        answer:
          'Ja. Sie ist kostenlos, es gibt kein Konto und keine Anmeldung, und es gibt kein Tages- oder Monatskontingent; Werbung hält den Dienst kostenlos. Ihr Video wird in Ihrem Browser auf Ihrem eigenen Gerät transkribiert, deshalb gibt es kein Größenlimit und niemand steht vor Ihnen: Wie schnell es geht, hängt von Ihrem Gerät ab.',
      },
    },
    {
      question: 'Kann ich ein Video ohne Sprache transkribieren?',
      answer:
        'Nur Sprache wird zu Text. Ein stummes Video oder eines mit reiner Musik liefert ein leeres oder sehr kurzes Ergebnis. Text, der im Bild eingeblendet wird, wird nicht gelesen.',
    },
    {
      question: 'Kann ich einen YouTube-Link einfügen?',
      answer:
        'Nein. TranscribeVid arbeitet mit Dateien, die Sie hochladen oder aufnehmen, nicht mit Weblinks. Wenn das Video von Ihnen stammt, laden Sie die Originaldatei hoch.',
    },
    {
      question: 'Sagt es, wer gerade spricht?',
      answer:
        'Nein. Sprechernamen oder -kennzeichnungen werden nicht hinzugefügt. Jede Zeile hat einen Zeitstempel, und Sie können beim Bearbeiten Namen in den Text eintippen.',
    },
    {
      question: 'Wie genau ist Video zu Text?',
      answer:
        'Bei klarer Sprache in einer unterstützten Sprache ist es meist sehr genau, aber keine Spracherkennung ist perfekt. Rauschen, Akzente, Musik und sich überlagernde Stimmen verringern die Genauigkeit, prüfen Sie wichtige Stellen daher am Video.',
    },
  ],
};
