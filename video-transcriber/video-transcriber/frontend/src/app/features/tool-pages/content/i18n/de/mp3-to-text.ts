import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP3 zu Text',
  h1: 'MP3 online in Text umwandeln',
  lead: 'Von Podcast-Folgen über Vorlesungsaufzeichnungen bis zu Sprachnachrichten: MP3 ist das Audioformat, von dem die meisten von uns Stapel besitzen. Laden Sie eine MP3-Datei hoch und erhalten Sie kostenlos und ohne Anmeldung ein Transkript mit Zeitstempeln.',
  dropKind: 'audio',
  dropNoun: 'MP3-Datei',

  whyTitle: 'Was ein MP3-Transkript Ihnen bringt',
  why: [
    'MP3 presst Audio in eine kleine Datei, deshalb nutzen Podcasts, Diktiergeräte und heruntergeladene Vorlesungen es. Das hilft auch hier: Eine MP3-Datei lässt sich selbst bei langsamer Verbindung schnell hochladen, und eine einstündige MP3 mit 128 kbit/s ist nur etwa 58 MB groß.',
    'Mit einem Transkript durchsuchen Sie eine lange Folge nach einer einzigen Wendung, zitieren eine interviewte Person wörtlich, schreiben Shownotes, ohne die Sendung erneut abzuspielen, oder bewahren ein schriftliches Protokoll eines Vortrags oder einer Sprachnachricht auf.',
  ],
  browserWhy: [
    'MP3 presst Audio in eine kleine Datei, deshalb nutzen Podcasts, Diktiergeräte und heruntergeladene Vorlesungen es. Das hilft auch hier: Ihr Browser liest eine MP3-Datei schnell ein, und eine einstündige MP3 mit 128 kbit/s ist nur etwa 58 MB groß.',
    'Mit einem Transkript durchsuchen Sie eine lange Folge nach einer einzigen Wendung, zitieren eine interviewte Person wörtlich, schreiben Shownotes, ohne die Sendung erneut abzuspielen, oder bewahren ein schriftliches Protokoll eines Vortrags oder einer Sprachnachricht auf.',
  ],

  howTitle: 'So wandeln Sie eine MP3-Datei in Text um',
  howToDescription:
    'Laden Sie die MP3-Datei hoch, wählen Sie die gesprochene Sprache, warten Sie auf das Transkript und laden Sie es als Text oder Untertitel herunter.',
  steps: [
    {
      title: 'MP3-Datei auswählen',
      text: 'Legen Sie die .mp3-Datei im Feld oben auf dieser Seite ab oder klicken Sie auf „Datei auswählen“. Im Uploader können Sie mehrere hinzufügen, und jede wird zu einem eigenen Transkript.',
    },
    {
      title: 'Sprache wählen',
      text: 'Wählen Sie die gesprochene Sprache oder lassen Sie die automatische Erkennung an. Um aus einer anderen Sprache englischen Text zu erhalten, öffnen Sie „Weitere Optionen“ und stellen „Ausgabe“ auf „Ins Englische übersetzen“.',
    },
    {
      title: 'Auf das Transkript warten',
      text: 'Der Text erscheint, während die Datei verarbeitet wird, mit einem Fortschrittsbalken. „Am schnellsten“ ist schnell, „Beste Genauigkeit“ dauert am längsten und macht die wenigsten Fehler.',
    },
    {
      title: 'Korrigieren und herunterladen',
      text: 'Korrigieren Sie jede Zeile und laden Sie dann TXT zum Lesen herunter, oder SRT und VTT, wenn das Audio zu einem Video oder Web-Player gehört.',
    },
  ],

  formatsTitle: 'MP3 und andere Audioformate',
  formatsIntro:
    'MP3 ist der häufigste Audio-Upload. Diese anderen Audioformate funktionieren genauso, und Videodateien werden ebenfalls akzeptiert.',
  uploadTitle: 'Audiodateien, die Sie hochladen können',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'die Folge oder den Vortrag als reinen Text' },
    { name: 'Markdown', use: 'Shownotes mit Zeitstempeln' },
    { name: 'SRT', use: 'Untertitel für eine Videoversion' },
    { name: 'VTT', use: 'eine Transkriptspur für Web-Player' },
    { name: 'PDF', use: 'ein Transkript zum Drucken oder Versenden' },
    { name: 'JSON', use: 'strukturierte Zeilen für Programme' },
  ],

  tipsTitle: 'Tipps zum Transkribieren von MP3-Dateien',
  tips: [
    {
      title: 'Laden Sie die beste Kopie hoch.',
      text: 'MP3 ist verlustbehaftet, und jedes erneute Speichern kostet ein wenig mehr Detail. Wenn Sie noch die WAV-Datei oder die Originalaufnahme haben, laden Sie stattdessen diese hoch.',
    },
    {
      title: 'Vermeiden Sie sehr niedrige Bitraten.',
      text: 'Sprache übersteht Kompression gut, aber sehr niedrige Bitraten verwischen Konsonanten und senken die Genauigkeit.',
    },
    {
      title: 'Teilen Sie lange Folgen auf.',
      text: 'Eine Datei über dem Längenlimit wird abgelehnt. Schneiden Sie eine zweistündige Folge vorher in einem beliebigen Audioeditor in Teile.',
      browser: {
        text: 'Es gibt kein Längenlimit, aber eine zweistündige Folge braucht auf einem langsameren Gerät eine Weile. Schneiden Sie sie in einem beliebigen Audioeditor in Teile, um den ersten Teil früher zu lesen.',
      },
    },
    {
      title: 'Gehen Sie mit Intros und Musik um.',
      text: 'Lassen Sie „Stille und Musik überspringen“ unter „Weitere Optionen“ aktiviert, damit Jingles und lange Pausen keine erfundenen Wörter erzeugen.',
    },
    {
      title: 'Schreiben Sie die Gäste aus.',
      text: 'Tragen Sie Moderation, Gäste, Sendungsnamen und Marken einmal im Wortschatz-Hinweis ein, dann werden sie weit eher richtig erkannt.',
    },
  ],

  faqs: [
    {
      question: 'Wie lang darf eine MP3-Datei sein?',
      answer:
        '{limits} Eine 60-minütige MP3 mit 128 kbit/s ist etwa 58 MB groß, das Längenlimit spielt also eine größere Rolle als das Größenlimit. Es gibt kein Tages- oder Monatskontingent.',
      browser: {
        answer:
          'Wir setzen kein Größen- oder Längenlimit, weil die MP3-Datei in Ihrem Browser auf Ihrem eigenen Gerät transkribiert wird. Eine 60-minütige MP3 mit 128 kbit/s ist etwa 58 MB groß; längere Dateien dauern einfach länger, und auf einem langsameren Gerät warnt Sie die Seite. Es gibt kein Tages- oder Monatskontingent.',
      },
    },
    {
      question: 'Schadet die MP3-Kompression der Genauigkeit?',
      answer:
        'Bei normaler Qualität kaum, denn Sprache ist für MP3 der leichte Fall. Rauschen, Hall und sich überlagernde Stimmen schaden weit mehr als das Format, bevorzugen Sie also ein sauberes Original, wenn Sie eines haben.',
    },
    {
      question: 'Kann ich mehrere MP3-Dateien auf einmal transkribieren?',
      answer:
        'Ja. Fügen Sie sie zusammen hinzu, und jede wird in Ihrer Sitzung zu einem eigenen Transkript, das Sie separat öffnen und herunterladen können.',
    },
    {
      question: 'Kann ich eine MP3-Datei ins Englische übersetzen?',
      answer:
        'Ja. Stellen Sie unter „Weitere Optionen“ „Ausgabe“ auf „Ins Englische übersetzen“. Die Übersetzung erfolgt automatisch, lesen Sie den englischen Text daher gegen, bevor Sie ihn verwenden. Andere Zielsprachen werden nicht angeboten.',
    },
    {
      question: 'Wird meine MP3-Datei aufbewahrt?',
      answer:
        'Nur für Ihre Sitzung. Sie wird automatisch gelöscht, wenn die Sitzung endet, oder wenn Sie auf „Meine Daten jetzt löschen“ klicken. Ein Konto ist nicht nötig.',
      browser: {
        answer:
          'Nur in diesem Browser: Ihre MP3-Datei verlässt Ihr Gerät nie. Sie wird nach einer Zeit der Inaktivität automatisch gelöscht oder wenn Sie auf „Meine Daten jetzt löschen“ klicken. Ein Konto ist nicht nötig.',
      },
    },
  ],
};
