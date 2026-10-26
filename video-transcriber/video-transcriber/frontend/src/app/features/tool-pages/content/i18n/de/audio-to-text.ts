import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Audio zu Text',
  h1: 'Audio zu Text umwandeln, ganz ohne Anmeldung',
  lead: 'Legen Sie einen Podcast, ein Interview, eine Vorlesung oder eine Sprachnotiz ab und erhalten Sie ein Transkript mit Zeitstempeln, das Sie durchsuchen, bearbeiten und herunterladen können. Kostenlos, unbegrenzt und in mehr als 50 Sprachen.',
  dropKind: 'audio',
  dropNoun: 'Audiodatei',
  record: true,

  whyTitle: 'Wann sich Audio zu Text lohnt',
  why: [
    'Audio ist das Medium, das sich am schlechtesten überfliegen lässt. Ohne erneutes Anhören können Sie darin weder suchen noch scannen noch zitieren. Ein Transkript lässt Sie die Minute finden, in der etwas gesagt wurde, exakte Zitate herausziehen und ein einstündiges Gespräch in wenigen Minuten lesen.',
    'Typische Aufgaben sind Shownotes für Podcasts, Interviews für Journalismus oder Forschung, Oral History, Sprachnotizen, diktierte Entwürfe und Aufzeichnungen von Unterricht oder Vorträgen. Transkribieren Sie nur Aufnahmen, die Sie selbst gemacht haben oder verwenden dürfen.',
  ],

  howTitle: 'So wandeln Sie Audio in Text um',
  howToDescription:
    'Fügen Sie eine Audiodatei hinzu oder nehmen Sie eine auf, wählen Sie die Sprache, warten Sie auf das Transkript und laden Sie es herunter.',
  steps: [
    {
      title: 'Audio hinzufügen',
      text: 'Legen Sie eine Audiodatei im Feld oben auf dieser Seite ab oder klicken Sie auf „Datei auswählen“. Für eine neue Aufnahme klicken Sie unter dem Feld auf „Mit dem Mikrofon aufnehmen“.',
    },
    {
      title: 'Sprache wählen',
      text: 'Wählen Sie die gesprochene Sprache oder lassen Sie die automatische Erkennung an. „Standard“ ist bei klarer Sprache ein guter Anfang. „Am schnellsten“ ist schnell, „Beste Genauigkeit“ dauert am längsten und macht die wenigsten Fehler.',
    },
    {
      title: 'Auf den Text warten',
      text: 'Zeilen erscheinen, sobald sie erkannt sind. „Audio verbessern“, standardmäßig aktiviert, filtert Brummen und Rauschen und gleicht leise Sprecher an.',
    },
    {
      title: 'Prüfen und exportieren',
      text: 'Spielen Sie jede Zeile ab ihrem Zeitstempel ab, korrigieren Sie Fehler und laden Sie das Transkript dann im gewünschten Format herunter.',
    },
  ],

  formatsTitle: 'Unterstützte Audiodateien und Downloads',
  formatsIntro:
    'Die gängigen Audioformate funktionieren. Videodateien werden ebenfalls akzeptiert, es wird nur ihr Ton verwendet.',
  uploadTitle: 'Audiodateien, die Sie hochladen können',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'sauberer Text für Notizen und Entwürfe' },
    { name: 'Markdown', use: 'Text mit Zeiten, bereit für eine Notiz-App' },
    { name: 'PDF', use: 'ein druckbares Transkript' },
    { name: 'SRT', use: 'zeitgestempelte Zeilen für Untertitel' },
    { name: 'VTT', use: 'zeitgestempelte Zeilen für Web-Player' },
    { name: 'JSON', use: 'jede Zeile und Zeit, für Programme' },
  ],

  tipsTitle: 'Tipps für genaue Audio-Transkripte',
  tips: [
    {
      title: 'Gehen Sie nah ans Mikrofon.',
      text: 'Hall und Abstand spielen meist eine größere Rolle als das Dateiformat. Ein ruhiger Raum und ein Mikrofon in der Nähe schlagen jede Einstellung.',
    },
    {
      title: 'Immer nur eine Stimme.',
      text: 'Sich überlagernde Sprecher, Musik unter der Sprache und starke Hintergrundgeräusche verursachen die meisten Fehler.',
    },
    {
      title: 'Laden Sie das Original hoch.',
      text: 'Wer eine Aufnahme als kleinere Datei neu speichert, verliert Details. Verwenden Sie das Original oder die Kopie mit der besten Qualität.',
    },
    {
      title: 'Nutzen Sie einen Wortschatz-Hinweis.',
      text: 'Namen, Marken und Fachbegriffe erkennt Spracherkennung am häufigsten falsch. Tragen Sie sie unter „Weitere Optionen“ ein.',
    },
    {
      title: 'Fragen Sie vor der Aufnahme.',
      text: 'Holen Sie die Erlaubnis ein, bevor Sie die Stimmen anderer Personen aufnehmen oder transkribieren, und prüfen Sie die örtlichen Regeln für Gesprächsaufzeichnung.',
    },
  ],

  faqs: [
    {
      question: 'Welche Audioformate kann ich in Text umwandeln?',
      answer:
        'MP3, WAV, M4A, AAC, FLAC, OGG und OPUS. Auch Videodateien wie MP4 und MKV funktionieren, weil nur der Ton verwendet wird.',
    },
    {
      question: 'Kann ich Audio direkt auf der Seite aufnehmen?',
      answer:
        'Ja, in Browsern, die den Mikrofonzugriff erlauben. Klicken Sie auf „Vom Mikrofon aufnehmen“, erlauben Sie den Zugriff, wenn Sie gefragt werden, und beenden Sie die Aufnahme dann. Die Aufnahme wird nach dem Beenden transkribiert, nicht während Sie sprechen.',
    },
    {
      question: 'Funktioniert es bei einem Interview mit zwei Personen?',
      answer:
        'Ja, die Sprache beider Personen wird transkribiert. Sprechernamen oder -kennzeichnungen werden nicht hinzugefügt, aber jede Zeile hat einen Zeitstempel, und Sie können beim Bearbeiten Namen in den Text eintippen.',
    },
    {
      question: 'Wie lang darf das Audio sein?',
      answer:
        '{limits} Längere oder größere Dateien werden abgelehnt, bevor sie verarbeitet werden, teilen Sie sie daher vorher auf. Es gibt kein Tages- oder Monatskontingent.',
      browser: {
        answer:
          'Wir setzen kein Limit: Das Audio wird in Ihrem Browser auf Ihrem eigenen Gerät transkribiert, lange Aufnahmen dauern daher einfach länger und brauchen genug freien Speicher. Auf einem langsameren Gerät warnt Sie die Seite. Es gibt kein Tages- oder Monatskontingent.',
      },
    },
    {
      question: 'Wird mein Audio gespeichert?',
      answer:
        'Dateien werden nur für Ihre Sitzung aufbewahrt und automatisch gelöscht, wenn sie endet, oder sofort, wenn Sie auf „Meine Daten jetzt löschen“ klicken. Es gibt kein Konto.',
      browser: {
        answer:
          'Nur in diesem Browser: Ihr Audio verlässt Ihr Gerät nie. Es wird nach einer Zeit der Inaktivität automatisch gelöscht oder sofort, wenn Sie auf „Meine Daten jetzt löschen“ klicken. Es gibt kein Konto.',
      },
    },
  ],
};
