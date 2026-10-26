import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Sprachaufnahme zu Text',
  h1: 'Sprachaufnahme zu Text, direkt in Ihrem Browser',
  lead: 'Nehmen Sie mit Ihrem Mikrofon direkt auf der Seite auf oder laden Sie ein Sprachmemo von Ihrem Handy hoch und lesen Sie Ihre Worte anschließend als Text. Kostenlos, ohne Anmeldung, in mehr als 50 Sprachen.',
  dropKind: 'audio',
  dropNoun: 'Sprachaufnahme',
  record: true,

  whyTitle: 'Wofür das gedacht ist und wofür nicht',
  why: [
    'Sprechen geht schneller als Tippen, deshalb halten viele Menschen Ideen, Besprechungsnotizen, Vorlesungspunkte und erste Entwürfe als Sprachaufnahme fest und machen sie anschließend zu Text. Diese Seite ist dafür gebaut: aufnehmen oder hochladen, dann den Text lesen, bearbeiten und herunterladen.',
    'Es ist kein Live-Diktat. Sie nehmen auf, beenden die Aufnahme, und das Transkript wird aus der gesamten Aufnahme erstellt, die Wörter erscheinen also nicht, während Sie noch sprechen. Dafür bekommt jede Zeile einen Zeitstempel.',
  ],

  howTitle: 'So machen Sie aus einer Sprachaufnahme Text',
  howToDescription:
    'Nehmen Sie mit Ihrem Mikrofon auf oder laden Sie ein Sprachmemo hoch, wählen Sie die Sprache, warten Sie auf das Transkript und laden Sie es herunter.',
  steps: [
    {
      title: 'Aufnehmen oder Datei auswählen',
      text: 'Legen Sie ein Sprachmemo im Feld oben auf dieser Seite ab (Sprachmemos auf dem iPhone sind M4A-Dateien) oder klicken Sie auf „Datei auswählen“. Zum Aufnehmen klicken Sie stattdessen unter dem Feld auf „Mit dem Mikrofon aufnehmen“, dann auf „Vom Mikrofon aufnehmen“, und erlauben den Zugriff, wenn Ihr Browser fragt.',
    },
    {
      title: 'Beenden und Sprache wählen',
      text: 'Wenn Sie aufnehmen, klicken Sie zum Schluss auf „Aufnahme beenden“. Wählen Sie dann die gesprochene Sprache oder lassen Sie die automatische Erkennung an.',
    },
    {
      title: 'Auf das Transkript warten',
      text: 'Der Text erscheint Zeile für Zeile, mit einem Fortschrittsbalken und einer Schätzung der verbleibenden Zeit.',
    },
    {
      title: 'Bearbeiten und herunterladen',
      text: 'Korrigieren Sie jedes Wort und laden Sie dann TXT, Markdown oder PDF herunter. Transkripte existieren nur in Ihrer Sitzung, speichern Sie also, was Sie brauchen.',
    },
  ],

  formatsTitle: 'Sprachmemo-Formate und Downloads',
  formatsIntro:
    'Diktiergeräte auf Handy und Desktop speichern in unterschiedlichen Formaten. Diese funktionieren alle.',
  uploadTitle: 'Aufnahmedateien, die Sie hochladen können',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'OGG', 'OPUS', 'FLAC', '3GP'],
  downloads: [
    { name: 'TXT', use: 'Ihre Worte als reiner Text' },
    { name: 'Markdown', use: 'Notizen mit Zeiten' },
    { name: 'PDF', use: 'eine druckbare Kopie der Notiz' },
    { name: 'SRT', use: 'zeitgestempelte Zeilen, falls die Aufnahme zu einem Video gehört' },
    { name: 'VTT', use: 'zeitgestempelte Zeilen für Web-Player' },
    { name: 'JSON', use: 'strukturierte Zeilen für Programme' },
  ],

  tipsTitle: 'Tipps für Sprachaufnahmen',
  tips: [
    {
      title: 'Testen Sie das Mikrofon.',
      text: 'Nehmen Sie zehn Sekunden auf und hören Sie sie an, bevor Sie eine lange Sitzung beginnen.',
    },
    {
      title: 'Sprechen Sie in gleichmäßigem Tempo.',
      text: 'Sprechen Sie nah am Mikrofon in einem ruhigen Raum. Lüfter, Tastaturen und Wind werden genauso deutlich aufgenommen wie Sie.',
    },
    {
      title: 'Sagen Sie Namen und Zahlen deutlich.',
      text: 'Tragen Sie ungewöhnliche Wörter in den Wortschatz-Hinweis unter „Weitere Optionen“ ein, dann werden sie weit eher richtig erkannt.',
    },
    {
      title: 'Kein Mikrofon-Button?',
      text: 'Manche Browser erlauben Aufnahmen nur auf sicheren Seiten oder nach Ihrer Zustimmung. Nehmen Sie stattdessen mit der Diktier-App Ihres Handys auf und laden Sie die Datei hoch.',
    },
    {
      title: 'Denken Sie an andere Menschen.',
      text: 'Sagen Sie den Leuten Bescheid, wenn Sie sie aufnehmen, und holen Sie vorher ihre Erlaubnis ein.',
    },
  ],

  faqs: [
    {
      question: 'Ist das ein Live-Diktat?',
      answer:
        'Nein. Sie nehmen zuerst auf, und das Transkript wird danach erstellt. Für Wörter, die erscheinen, während Sie sprechen, nutzen Sie stattdessen die Diktierfunktion Ihres Handys oder Computers.',
    },
    {
      question: 'Kann ich es auf meinem Handy nutzen?',
      answer:
        'Ja. Öffnen Sie die Seite im Browser Ihres Handys und nehmen Sie direkt auf der Seite auf, oder laden Sie eine bereits gespeicherte Sprachmemo-Datei hoch.',
    },
    {
      question: 'Wie lang darf eine Aufnahme sein?',
      answer:
        '{limits} Längere Dateien werden abgelehnt, bevor sie verarbeitet werden, teilen Sie sie daher vorher auf. Es gibt kein Tages- oder Monatskontingent.',
      browser: {
        answer:
          'Wir setzen kein Limit: Die Aufnahme wird in Ihrem Browser auf Ihrem eigenen Gerät transkribiert, eine lange dauert daher einfach länger. Auf einem langsameren Gerät warnt Sie die Seite. Es gibt kein Tages- oder Monatskontingent.',
      },
    },
    {
      question: 'Unterscheidet es Sprecher voneinander?',
      answer:
        'Nein. Sprechernamen oder -kennzeichnungen werden nicht hinzugefügt. Jede Zeile hat einen Zeitstempel, und Sie können beim Bearbeiten Namen in den Text eintippen.',
    },
    {
      question: 'Wird meine Sprachaufnahme gespeichert?',
      answer:
        'Nur für Ihre Sitzung. Sie wird gelöscht, wenn die Sitzung endet, nach einer Zeit der Inaktivität oder wenn Sie auf „Meine Daten jetzt löschen“ klicken. Es gibt kein Konto.',
      browser: {
        answer:
          'Nur in diesem Browser: Ihre Aufnahme verlässt Ihr Gerät nie. Sie wird nach einer Zeit der Inaktivität gelöscht oder wenn Sie auf „Meine Daten jetzt löschen“ klicken. Es gibt kein Konto.',
      },
    },
  ],
};
