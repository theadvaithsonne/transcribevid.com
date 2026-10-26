import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Vorlesung zu Text',
  h1: 'Vorlesung zu Text: aus einer Aufnahme ein durchsuchbares Transkript machen',
  lead: 'Nehmen Sie die Vorlesung auf, legen Sie die Datei hier ab und lesen Sie sie als Text mit Zeitstempeln: etwas, das Sie nach einem Prüfungsthema durchsuchen, in Ihre Notizen kopieren und mit der Aufnahme abgleichen können. Kein Konto, keine Gebühr und mehr als 50 Sprachen.',
  dropKind: 'video',
  dropNoun: 'Vorlesungsaufnahme',

  whyTitle: 'Warum eine Vorlesung transkribieren',
  why: [
    'Eine Vorlesung lässt sich leicht besuchen und schwer nacharbeiten. In einer Aufnahme können Sie nicht nach der einen Definition suchen, die Sie brauchen, und eine Stunde erneut abzuspielen, um sie zu finden, dauert so lange wie die Vorlesung selbst. Ein Transkript liefert Ihnen die Worte der Reihe nach, mit der Zeit neben jeder Zeile, sodass Sie zu der Stelle springen können, die Sie brauchen.',
    'Es hilft außerdem Menschen, denen Lesen leichter fällt als Zuhören, die in einer Zweitsprache studieren, die eine Veranstaltung verpasst haben oder die den Text eines Vortrags haben möchten, den sie selbst gehalten haben. Fragen Sie Ihre Dozentin oder Ihren Dozenten, bevor Sie aufnehmen, und halten Sie sich an die Regeln Ihrer Hochschule zu Aufnahmen.',
  ],

  sections: [
    {
      title: 'Vom Transkript zu Lernnotizen',
      paragraphs: [
        'Ein Transkript ist Rohmaterial, keine fertigen Notizen. Hier sind vier Wege, wie Studierende es nutzen.',
      ],
      bullets: [
        {
          title: 'Suchen, bevor Sie lernen.',
          text: 'Sobald das Transkript fertig ist, tippen Sie einen Begriff in das Feld „Im Text suchen“ darüber. Das Feld zählt die passenden Zeilen, und die Pfeile springen zwischen ihnen, sodass Sie jede ab ihrem Zeitstempel abspielen und die Erklärung noch einmal hören können. Wurde ein Fachwort überall falsch geschrieben, korrigiert „Ersetzen…“ jede Zeile auf einmal.',
        },
        {
          title: 'Bauen Sie Ihre eigene Gliederung.',
          text: 'Lesen Sie den Text einmal, ergänzen Sie eigene Überschriften und kürzen Sie ihn auf das, was Sie brauchen. Einen Gedanken in eigene Worte zu fassen ist meist ein besserer Weg, ihn zu lernen, als ihn abzuschreiben.',
        },
        {
          title: 'Prüfen Sie Namen, Zahlen und Formeln.',
          text: 'Spracherkennung schreibt auf, was sie hört. Gleichungen, Symbole und ungewöhnliche Begriffe müssen oft korrigiert werden, prüfen Sie sie daher an den Folien und an der Aufnahme.',
        },
        {
          title: 'Listen Sie auf, was Sie nicht verstanden haben.',
          text: 'Kopieren Sie die Zeitstempel der Stellen, bei denen Sie den Faden verloren haben, in eine Liste und nehmen Sie sie mit in Ihr nächstes Tutorium oder Ihre nächste Sprechstunde.',
        },
      ],
    },
    {
      title: 'Fachvokabular und andere Sprachen',
      paragraphs: [
        'Fachwörter sind für jede Spracherkennung am schwierigsten. Öffnen Sie vor dem Start „Weitere Optionen“ und listen Sie die Begriffe, die Namen von Theorien und Autoren sowie Abkürzungen im Wortschatz-Hinweis auf. Das Transkript schreibt sie dann häufiger so, wie Sie sie eingetragen haben.',
        'Wenn Sie in einer Sprache studieren, die nicht Ihre erste ist, gibt Ihnen ein Transkript Text, den Sie in Ihrem eigenen Tempo lesen und in dem Sie Wörter nachschlagen können. Wählen Sie die Sprache der Vorlesung oder lassen Sie „Automatisch erkennen“ aktiviert. Eine Vorlesung in einer anderen Sprache lässt sich auch in englischen Text umwandeln: Stellen Sie unter „Weitere Optionen“ „Ausgabe“ auf „Ins Englische übersetzen“. Die Übersetzung ist weniger zuverlässig als die Transkription in der Originalsprache und kann Fachbegriffe verfehlen, prüfen Sie sie daher an der Aufnahme.',
      ],
    },
  ],

  howTitle: 'So wandeln Sie eine Vorlesung in Text um',
  howToDescription:
    'Fügen Sie die Vorlesungsaufnahme hinzu, legen Sie Sprache und Fachbegriffe fest, warten Sie auf das Transkript und laden Sie es als Notizen herunter.',
  steps: [
    {
      title: 'Vorlesungsaufnahme hinzufügen',
      text: 'Ziehen Sie die Datei auf das Feld oben oder klicken Sie auf „Datei auswählen“. Eine Datei aus einem Handy-Diktiergerät, ein gespeichertes Vorlesungsvideo oder eine Bildschirmaufnahme eines Online-Kurses funktionieren alle, und es wird nur der Ton verwendet. Das Feld nimmt jeweils eine Datei an und gibt sie auf der nächsten Seite an den Uploader weiter, wo „Weitere Datei hinzufügen“ die anderen Sitzungen eines Kurses hereinholt.',
    },
    {
      title: 'Sprache und Qualität festlegen',
      text: 'Wählen Sie auf der nächsten Seite die Sprache der Vorlesung. „Standard“ passt für eine klare Aufnahme. Bei einem halligen Hörsaal oder einem schnellen Sprecher hilft „Hohe Genauigkeit“, wenn Ihr Gerät sie ausführen kann (die Auswahl ist mit Begründung ausgegraut, wenn nicht). Rechnen Sie mit einem langsameren Auftrag und einem größeren Download beim ersten Mal.',
    },
    {
      title: 'Fachbegriffe ergänzen, dann starten',
      text: 'Tippen Sie unter „Weitere Optionen“ die wichtigsten Begriffe, Namen und Abkürzungen in den Wortschatz-Hinweis, zum Beispiel Krebs-Zyklus, Bayes’sch, Dr. Okafor. Klicken Sie dann auf „Transkribieren“.',
    },
    {
      title: 'Lesen, korrigieren und herunterladen',
      text: 'Spielen Sie Zeilen ab ihrem Zeitstempel ab, um sie zu prüfen, und beheben Sie die Fehler. Laden Sie dann TXT oder Markdown für Ihre Notiz-App herunter, oder PDF zum Drucken.',
    },
  ],

  formatsTitle: 'Dateien von Vorlesungsaufnahmen und Downloads',
  formatsIntro:
    'Handyaufnahmen, gespeicherte Videos und Bildschirmaufnahmen von Kursen können alle hinzugefügt werden; es wird nur die Tonspur gelesen.',
  uploadTitle: 'Aufnahmedateien, die Sie hinzufügen können',
  accepts: ['MP4', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'reiner Text für eine Notiz-App' },
    { name: 'Markdown', use: 'Text mit Zeiten, leicht umzustrukturieren' },
    { name: 'PDF', use: 'eine druckbare Lernkopie' },
    { name: 'SRT', use: 'Untertitel, falls die Vorlesung ein Video ist, das Sie teilen' },
  ],

  tipsTitle: 'Tipps für Vorlesungsaufnahmen',
  tips: [
    {
      title: 'Fragen Sie zuerst um Erlaubnis.',
      text: 'Manche Dozentinnen und Dozenten und Hochschulen erlauben keine Aufnahmen. Fragen Sie nach und halten Sie sich an die Regeln, die man Ihnen nennt.',
    },
    {
      title: 'Nehmen Sie nah am Sprecher auf.',
      text: 'Ein Recorder vorn im Raum schlägt meist einen besseren hinten, denn Abstand und Hall kosten oft mehr Genauigkeit, als irgendeine Einstellung zurückgewinnen kann.',
    },
    {
      title: 'Teilen Sie sehr lange Sitzungen.',
      text: 'Ist eine Sitzung größer oder länger als die Limits auf dieser Seite, schneiden Sie sie vor dem Hinzufügen an der Pause in Teile.',
      browser: {
        title: 'Lange Sitzungen dauern länger.',
        text: 'Es ist kein Längenlimit gesetzt, aber eine lange Vorlesung beschäftigt Ihr Gerät eine Weile und braucht freien Speicher, und ein Browser, der WebCodecs nicht nutzen kann, hat mit einer sehr langen Datei unter Umständen Schwierigkeiten. Wenn Sie sie an der Pause schneiden, können Sie die erste Hälfte früher lesen.',
      },
    },
    {
      title: 'Lassen Sie die Folien beim Durcharbeiten offen.',
      text: 'Folientitel liefern Ihnen eine fertige Gliederung, die Sie mit den Zeitstempeln abgleichen können.',
    },
    {
      title: 'Laden Sie herunter, bevor Sie gehen.',
      text: 'Transkripte existieren nur für Ihre Sitzung. Speichern Sie TXT oder Markdown, bevor Sie die Seite schließen.',
    },
  ],

  faqs: [
    {
      question: 'Ist es erlaubt, eine Vorlesung aufzunehmen und zu transkribieren?',
      answer:
        'Das hängt von Ihrer Dozentin oder Ihrem Dozenten und Ihrer Hochschule ab, fragen Sie also vor der Aufnahme nach und halten Sie sich an deren Regeln. Nutzen Sie ein Transkript für Ihr eigenes Lernen, es sei denn, Sie haben die Erlaubnis, es zu teilen. Das ist keine Rechtsberatung.',
    },
    {
      question: 'Kann ich ein Vorlesungstranskript automatisch in Notizen umwandeln?',
      answer:
        'Nein. TranscribeVid liefert Ihnen die Worte, mit einem Zeitstempel in jeder Zeile, fasst aber nicht zusammen und fügt keine Überschriften hinzu. Die Notizen bauen Sie aus dem Text selbst, was auch ein guter Weg ist, den Stoff zu lernen.',
    },
    {
      question: 'Funktioniert es bei Vorlesungen mit Gleichungen oder Fachbegriffen?',
      answer:
        'Es schreibt die Wörter auf, die es hört, gesprochene Begriffe kommen daher meist gut heraus, wenn Sie sie in den Wortschatz-Hinweis eintragen. Symbole und Gleichungen werden nicht als Formeln ausgeschrieben, prüfen Sie sie daher an Ihren Folien.',
    },
    {
      question: 'Wie lange darf eine Vorlesung sein, die ich transkribieren kann?',
      answer: '{limits} Eine längere Vorlesung muss vorher in Teile geschnitten werden.',
      browser: {
        answer:
          'Die Länge der Vorlesung ist nicht begrenzt. Weil Ihr eigenes Gerät die Arbeit macht, kostet eine lange Vorlesung vor allem Geduld und freien Speicher, und die Seite warnt Sie, wenn Ihr Gerät dafür zu langsam wirkt.',
      },
    },
    {
      question:
        'Kann ich einen Online-Kurs transkribieren, den ich auf dem Bildschirm aufgenommen habe?',
      answer:
        'Ja. Eine als MP4, MOV oder WebM gespeicherte Bildschirmaufnahme funktioniert. Es wird nur der Ton gelesen, Text auf den Folien ist daher nicht enthalten. Tragen Sie die Begriffe der Folien in den Wortschatz-Hinweis ein.',
    },
  ],

  links: [
    {
      label: 'Video zu Text',
      path: '/video-to-text',
      note: 'Die allgemeine Seite für jedes aufgezeichnete Video, mit allen Dateitypen.',
    },
    {
      label: 'MP3 zu Text',
      path: '/mp3-to-text',
      note: 'Für Vorlesungsaufnahmen, die auf einem Handy oder Recorder als MP3 gespeichert sind.',
    },
    {
      label: 'Sprache ins Englische übersetzen',
      path: '/translate-audio-to-english',
      note: 'Englischer Text aus einer Vorlesung in einer anderen Sprache.',
    },
    {
      label: 'So erhalten Sie ein genaueres Transkript',
      path: '/guides/accurate-transcripts',
      note: 'Die Audio-, Sprach- und Qualitätsentscheidungen, die bei einer schwierigen Aufnahme Fehler verringern.',
    },
  ],
};
