import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Interview-Transkription',
  h1: 'Interview-Transkription ohne Konto',
  lead: 'Machen Sie aus einem aufgezeichneten Interview Text mit Zeitstempeln, den Sie durchsuchen, zitieren und mit der Aufnahme abgleichen können. Gemacht für Forschung, Journalismus und Bewerbungsgespräche: kostenlos, ohne Anmeldung, in mehr als 50 Sprachen.',
  dropKind: 'video',
  dropNoun: 'Interviewaufnahme',

  whyTitle: 'Warum ein Interview transkribieren',
  why: [
    'Ein Interview ist mehr wert, sobald man darin suchen kann. Mit einem Transkript finden Sie, wo ein Teilnehmender ein Thema erwähnt hat, zitieren ihn oder sie wörtlich, gleichen ein Zitat mit der Aufnahme ab und vergleichen Antworten über mehrere Interviews hinweg. Forschende, Journalistinnen und Journalisten, Oral-History-Fachleute und Menschen, die Nutzerforschungs- oder Bewerbungsinterviews führen, arbeiten alle so.',
    'Interviews enthalten oft private oder sensible Angaben. Hier wird die Aufnahme über eine verschlüsselte Verbindung hochgeladen und danach automatisch gelöscht. Holen Sie vor der Aufnahme die Einwilligung aller Beteiligten ein, befolgen Sie die Regeln Ihrer Organisation oder Ethikkommission und behandeln Sie das Transkript so sorgfältig wie die Aufnahme.',
  ],
  browserWhy: [
    'Ein Interview ist mehr wert, sobald man darin suchen kann. Mit einem Transkript finden Sie, wo ein Teilnehmender ein Thema erwähnt hat, zitieren ihn oder sie wörtlich, gleichen ein Zitat mit der Aufnahme ab und vergleichen Antworten über mehrere Interviews hinweg. Forschende, Journalistinnen und Journalisten, Oral-History-Fachleute und Menschen, die Nutzerforschungs- oder Bewerbungsinterviews führen, arbeiten alle so.',
    'Interviews enthalten oft private oder sensible Angaben, deshalb ist wichtig, wohin die Datei geht. Ihr Browser transkribiert die Aufnahme auf Ihrem eigenen Gerät, und es wird nichts hochgeladen. Holen Sie vor der Aufnahme die Einwilligung aller Beteiligten ein, befolgen Sie die Regeln Ihrer Organisation oder Ethikkommission und behandeln Sie das Transkript so sorgfältig wie die Aufnahme: Der heruntergeladene Text ist eine Datei auf Ihrem Gerät wie jede andere.',
  ],

  sections: [
    {
      title: 'Was das Transkript Ihnen gibt und was nicht',
      paragraphs: ['Kennen Sie die Grenzen, bevor Sie auf einem Transkript aufbauen.'],
      bullets: [
        {
          title: 'Keine Sprecherkennzeichnungen.',
          text: 'Jede Zeile hat einen Zeitstempel, aber das Transkript sagt nicht, wer spricht. Ergänzen Sie „Interviewer“ und „Teilnehmer“ beim Bearbeiten von Hand und prüfen Sie dies an der Aufnahme.',
        },
        {
          title: 'Ein sauberer Lesetext, nicht streng wörtlich.',
          text: 'Spracherkennung lässt oft Stottern und manche Füllwörter wie „äh“ weg. Braucht Ihre Studie ein streng wörtliches Protokoll, spielen Sie die Aufnahme neben dem Text ab und ergänzen Sie, was fehlt.',
        },
        {
          title: 'Erst nach dem Interview.',
          text: 'Es arbeitet mit einer gespeicherten Aufnahme. Es tritt keinem Gespräch bei und transkribiert nicht live.',
        },
      ],
    },
    {
      title: 'Ein Transkript prüfen, bevor Sie daraus zitieren',
      paragraphs: [
        'Bevor Sie ein Zitat veröffentlichen oder einen Teilnehmenden zitieren, spielen Sie die Zeile ab ihrem Zeitstempel ab und hören Sie zu. Zeilen, bei denen sich die Spracherkennung unsicher war, sind markiert, beginnen Sie dort. Prüfen Sie Namen, Zahlen und Daten sowie jedes Wort, das die Bedeutung ändern würde, wenn es falsch wäre, etwa „kann“ und „kann nicht“. Um jede Stelle zu finden, an der ein Name oder Begriff vorkommt, tippen Sie ihn in das Feld „Im Text suchen“ über dem fertigen Transkript: Es zählt die passenden Zeilen, und die Pfeile springen zwischen ihnen.',
        'Behalten Sie die Aufnahme als Hauptprotokoll und behandeln Sie das Transkript als Arbeitskopie. Wenn Sie Ihre Methode in einem Bericht oder Artikel beschreiben, geben Sie an, dass das Transkript mit Spracherkennung erstellt und danach von Hand geprüft wurde.',
      ],
    },
    {
      title: 'Einwilligung, Speicherung und Anonymität',
      paragraphs: [
        'Sagen Sie den Teilnehmenden, wie die Aufnahme und das Transkript gespeichert werden und wer sie sehen wird. Wenn Sie Anonymität zugesagt haben, entfernen Sie Namen und Angaben, die jemanden identifizieren könnten, bevor Sie Auszüge weitergeben. Diese Seite kann das nicht für Sie tun, und sie gibt keine Rechtsberatung.',
      ],
    },
  ],

  howTitle: 'So transkribieren Sie ein Interview',
  howToDescription:
    'Fügen Sie die Interviewaufnahme hinzu, wählen Sie die Sprache, ergänzen Sie Namen, warten Sie auf das Transkript, prüfen Sie es dann und laden Sie es herunter.',
  steps: [
    {
      title: 'Interviewaufnahme hinzufügen',
      text: 'Klicken Sie auf „Datei auswählen“ oder ziehen Sie das Interview auf das Feld oben. Audio und Video funktionieren beide. Fügen Sie hier ein Interview hinzu und nutzen Sie dann „Weitere Datei hinzufügen“ auf der nächsten Seite für den Rest Ihrer Reihe.',
    },
    {
      title: 'Sprache und Qualität wählen',
      text: 'Wählen Sie auf der nächsten Seite die Sprache des Interviews oder lassen Sie „Automatisch erkennen“ aktiviert. „Standard“ passt für ein ruhiges Zweiergespräch. Hall, eine Telefonleitung oder ein starker Akzent verlangen „Hohe Genauigkeit“, wo Ihr Gerät sie ausführen kann; ein Gerät, das das nicht kann, zeigt die Auswahl mit Begründung ausgegraut. Sie ist langsamer und ein größerer Download beim ersten Mal.',
    },
    {
      title: 'Namen und Begriffe ergänzen, dann starten',
      text: 'Listen Sie unter „Weitere Optionen“ die Namen der Teilnehmenden, ihre Organisationen und jeden Fachbegriff im Wortschatz-Hinweis auf, damit sie so geschrieben werden, wie Sie es möchten. Klicken Sie dann auf „Transkribieren“.',
    },
    {
      title: 'Prüfen, kennzeichnen und exportieren',
      text: 'Spielen Sie Zeilen ab ihrem Zeitstempel ab, beheben Sie die Fehler und ergänzen Sie Sprecherkennzeichnungen von Hand. Laden Sie dann TXT oder PDF für Ihre Ablage herunter, oder Markdown oder JSON, wenn Sie zeitgestempelte Zeilen brauchen.',
    },
  ],

  formatsTitle: 'Dateien von Interviewaufnahmen und Downloads',
  formatsIntro:
    'Interviews stammen von Handys, Recordern und Videoanrufen. Jede dieser Quellen lässt sich hinzufügen, und gelesen wird nur die Tonspur.',
  uploadTitle: 'Aufnahmedateien, die Sie hinzufügen können',
  accepts: ['MP4', 'MOV', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV'],
  downloads: [
    { name: 'TXT', use: 'reiner Text zum Lesen, Zitieren und Codieren' },
    { name: 'PDF', use: 'eine Kopie zum Drucken oder Ablegen' },
    { name: 'Markdown', use: 'zeitgestempelter Text für eine Notiz-App oder Codier-Software' },
    { name: 'JSON', use: 'zeitgestempelte Zeilen für Analyse-Software' },
  ],

  tipsTitle: 'Tipps für Interviewaufnahmen',
  tips: [
    {
      title: 'Stellen Sie das Mikrofon nah auf.',
      text: 'Platzieren Sie es in der Nähe der teilnehmenden Person und nutzen Sie bei Telefon- und Videoanrufen ein Headset oder ein Ansteckmikrofon. Ein Mikrofon am anderen Ende des Raums oder ein hallender Raum kostet meist mehr Genauigkeit, als irgendeine Einstellung zurückgewinnen kann.',
    },
    {
      title: 'Nennen Sie zu Beginn Datum und Namen.',
      text: 'Sagen Sie zu Beginn der Aufnahme, wer teilnimmt und wann. Das macht die Datei leicht zu beschriften und das Transkript später leicht abzulegen.',
    },
    {
      title: 'Behalten Sie die Originalaufnahme.',
      text: 'Löschen Sie das Audio nie, sobald Sie den Text haben. Die Aufnahme ist es, die einen Zweifel an einem Zitat klärt.',
    },
    {
      title: 'Bleiben Sie unter den Limits.',
      text: 'Alles über den auf dieser Seite genannten Limits wird abgewiesen, schneiden Sie ein sehr langes Interview daher vorher an einer natürlichen Pause.',
      browser: {
        title: 'Lange Interviews dauern länger.',
        text: 'Die Länge ist nicht begrenzt, doch eine lange Aufnahme braucht Zeit und freien Speicher auf Ihrem Gerät, und ein Browser ohne WebCodecs hat mit einer sehr langen Datei unter Umständen Schwierigkeiten. Schneiden Sie sie an einer natürlichen Pause, wenn Sie lieber mit dem ersten Teil beginnen.',
      },
    },
    {
      title: 'Löschen Sie Ihre Daten auf einem gemeinsam genutzten Computer.',
      text: 'Wenn Sie gespeichert haben, was Sie brauchen, klicken Sie auf „Meine Daten jetzt löschen“, damit das Transkript nicht in der Sitzung bleibt.',
    },
  ],

  faqs: [
    {
      question: 'Kann ich hier ein vertrauliches Interview transkribieren?',
      answer:
        'Ihre Aufnahme wird über eine verschlüsselte Verbindung hochgeladen und vom Server gelöscht, wenn die Sitzung endet, oder früher, wenn Sie auf „Meine Daten jetzt löschen“ klicken. Prüfen Sie, bevor Sie sich darauf verlassen, was Ihre Organisation oder Ethikkommission verlangt. Das ist keine Rechtsberatung.',
      browser: {
        answer:
          'Es findet kein Upload statt: Die Aufnahme bleibt auf Ihrem Gerät, während Ihr Browser sie transkribiert, und der Browser löscht sie nach einer Zeit der Inaktivität oder wenn Sie auf „Meine Daten jetzt löschen“ klicken. Ein heruntergeladenes Transkript ist eine gewöhnliche Datei, prüfen Sie daher die Regeln Ihrer Organisation oder Ethikkommission. Das ist keine Rechtsberatung.',
      },
    },
    {
      question: 'Enthält das Interview-Transkript „äh“ und „ähm“?',
      answer:
        'Oft nicht. Das Transkript ist ein sauberer Lesetext und kein streng wörtliches Protokoll, und manches Stottern und manche Füllwörter bleiben weg. Brauchen Sie jedes davon, spielen Sie die Aufnahme neben dem Text ab und ergänzen Sie sie.',
    },
    {
      question: 'Kann das Transkript Interviewer und Teilnehmer unterscheiden?',
      answer:
        'Nein. Das Transkript kennzeichnet nicht, wer spricht. Tippen Sie beim Bearbeiten „Interviewer“ und „Teilnehmer“ in den Text und prüfen Sie jeden Redebeitrag an der Aufnahme.',
    },
    {
      question: 'Wie lang darf ein Interview sein, das ich transkribieren kann?',
      answer: '{limits} Ein längeres Interview muss unter Umständen geteilt werden.',
      browser: {
        answer:
          'Die Länge eines Interviews ist nicht begrenzt. Ihr eigenes Gerät macht die Arbeit, ein langes Interview dauert daher länger und braucht freien Speicher, und die Seite sagt Ihnen, wenn Ihr Gerät zu langsam wirkt.',
      },
    },
    {
      question: 'Kann ich diese Transkripte in meiner Forschung oder meinem Artikel verwenden?',
      answer:
        'Ja. Prüfen Sie sie an der Aufnahme, bevor Sie jemanden zitieren, geben Sie in Ihrer Methode an, dass Spracherkennung verwendet wurde, und befolgen Sie die Regeln Ihrer Einrichtung oder Publikation.',
    },
  ],

  links: [
    {
      label: 'Meeting-Aufzeichnung zu Text',
      path: '/meeting-recording-to-text',
      note: 'Für aufgezeichnete Gespräche, mit Hinweisen, wie aus einem Transkript ein Protokoll wird.',
    },
    {
      label: 'Video zu Text',
      path: '/video-to-text',
      note: 'Die allgemeine Seite für jedes aufgezeichnete Video.',
    },
    {
      label: 'Video transkribieren, ohne es hochzuladen',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Was mit einer Aufnahme in Ihrem Browser geschieht und wie Sie es selbst nachsehen.',
    },
    {
      label: 'So erhalten Sie ein genaueres Transkript',
      path: '/guides/accurate-transcripts',
      note: 'Audio- und Einstellungsentscheidungen, die Fehler verringern.',
    },
  ],
};
