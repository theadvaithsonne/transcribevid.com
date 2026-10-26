import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Meeting-Aufzeichnung zu Text',
  h1: 'Meeting-Aufzeichnung zu Text: Zoom, Teams und Google Meet',
  lead: 'Speichern Sie die Aufzeichnung nach Ihrem Gespräch, legen Sie sie hier ab und erhalten Sie ein Transkript mit Zeitstempeln, das Sie durchsuchen, zitieren und zu einem Protokoll machen können. Es kostet nichts, braucht kein Konto und deckt mehr als 50 Sprachen ab.',
  dropKind: 'video',
  dropNoun: 'Meeting-Aufzeichnung',

  whyTitle: 'Warum eine Meeting-Aufzeichnung transkribieren',
  why: [
    'Kaum jemand spielt ein einstündiges Meeting noch einmal ab, aber viele brauchen daraus eine einzige Sache: wer wem was bis wann zugesagt hat. Mit einem Transkript suchen Sie nach einer Frist oder einem Namen, finden die Minute, in der es gesagt wurde, und zitieren es wörtlich. Es ist ein schnellerer Start für Protokolle und Aufgabenlisten, als das Gespräch erneut abzuspielen.',
    'Diese Seite arbeitet mit einer Aufzeichnung, die bereits existiert. Sie kann keinem Live-Gespräch beitreten und fügt keine Sprechernamen hinzu, sie ersetzt also das erneute Abspielen, nicht die Protokollführung. Meetings enthalten oft vertrauliche Details, wissen Sie daher, wohin eine Aufzeichnung geht: Hier wird sie über eine verschlüsselte Verbindung hochgeladen und danach automatisch entfernt.',
  ],
  browserWhy: [
    'Kaum jemand spielt ein einstündiges Meeting noch einmal ab, aber viele brauchen daraus eine einzige Sache: wer wem was bis wann zugesagt hat. Mit einem Transkript suchen Sie nach einer Frist oder einem Namen, finden die Minute, in der es gesagt wurde, und zitieren es wörtlich. Es ist ein schnellerer Start für Protokolle und Aufgabenlisten, als das Gespräch erneut abzuspielen.',
    'Diese Seite arbeitet mit einer Aufzeichnung, die bereits existiert. Sie kann keinem Live-Gespräch beitreten und fügt keine Sprechernamen hinzu, sie ersetzt also das erneute Abspielen, nicht die Protokollführung. Meetings enthalten oft vertrauliche Details: Ihr Browser transkribiert die Aufzeichnung auf Ihrem eigenen Gerät, es wird nichts hochgeladen, und nach dem Ende Ihrer Sitzung wird nichts aufbewahrt.',
  ],

  sections: [
    {
      title: 'Wo Sie Ihre Meeting-Aufzeichnung finden',
      paragraphs: [
        'Jedes Meeting-Werkzeug speichert Aufzeichnungen an seinem eigenen Ort, und Menünamen, Ordner und das, was Ihr Tarif erlaubt, ändern sich zwischen Versionen, verstehen Sie dies daher als Orientierung. Wenn Sie nur das Audio exportieren können, ist eine M4A- oder MP3-Datei kleiner und wird genauso gut gelesen. Zoom, Microsoft Teams und Google Meet sind Namen ihrer jeweiligen Inhaber, und diese Seite steht in keiner Verbindung zu ihnen.',
      ],
      bullets: [
        {
          title: 'Zoom.',
          text: 'Eine lokale Aufzeichnung wird nach dem Ende des Meetings auf Ihrem Computer gespeichert, in der Regel als MP4-Video und als M4A-Audiodatei. Eine Cloud-Aufzeichnung laden Sie auf der Aufzeichnungsseite Ihres Zoom-Kontos herunter.',
        },
        {
          title: 'Microsoft Teams.',
          text: 'Nach dem Meeting wird die Aufzeichnung je nach Meetingtyp in OneDrive oder SharePoint abgelegt, und im Meeting-Chat erscheint ein Link. Öffnen Sie sie dort und laden Sie die MP4-Datei herunter, wenn Ihr Konto Downloads erlaubt.',
        },
        {
          title: 'Google Meet.',
          text: 'Aufzeichnungen werden in Google Drive gespeichert, meist in einem Ordner „Meet Recordings“, und der Organisator erhält einen Link. Laden Sie die MP4-Datei aus Drive herunter.',
        },
      ],
    },
    {
      title: 'Vom Transkript zum Protokoll',
      paragraphs: [
        'Ein rohes Transkript ist noch kein Protokoll, aber es macht das Schreiben schnell. Sobald das Transkript fertig ist, tippen Sie ein Wort wie „Frist“, „einverstanden“ oder „Aufgabe“ in das Feld „Im Text suchen“ darüber, oder den Namen einer beteiligten Person. Das Feld zeigt, wie viele Zeilen passen, und mit den Pfeilen nach oben und unten springen Sie von einem Treffer zum nächsten. Lesen Sie rund um jeden Treffer, spielen Sie die Zeile ab ihrem Zeitstempel ab, wenn sie unklar ist, und kopieren Sie die Zeilen mit ihren Zeiten in Ihre Notizen, damit jeder die Aufzeichnung prüfen kann.',
        'Ist ein Name auf zwei verschiedene Arten geschrieben herausgekommen, suchen Sie nach der falschen Schreibweise, öffnen Sie „Ersetzen…“, geben Sie die richtige ein und wenden Sie sie auf alle Zeilen auf einmal an. Laden Sie Markdown zum Einfügen in eine Notiz-App herunter oder PDF zum Weiterreichen. Die Zeilen tragen eine Zeit, aber keine Sprecherkennzeichnung, tippen Sie die Namen also beim Bearbeiten ein und prüfen Sie anhand der Aufzeichnung, wer gesprochen hat.',
      ],
    },
    {
      title: 'Erlaubnis, Regeln und Sorgfalt',
      paragraphs: [
        'Sagen Sie allen Bescheid, bevor Sie ein Meeting aufzeichnen, holen Sie ihre Erlaubnis ein und befolgen Sie die Regeln Ihrer Organisation zu Aufzeichnungen und Transkripten. Das Transkript eines vertraulichen Meetings ist so sensibel wie die Aufzeichnung, bewahren und teilen Sie es daher mit derselben Sorgfalt. Diese Seite gibt keine Rechtsberatung.',
      ],
    },
  ],

  howTitle: 'So wandeln Sie eine Meeting-Aufzeichnung in Text um',
  howToDescription:
    'Fügen Sie die Meeting-Aufzeichnung hinzu, wählen Sie die Sprache, warten Sie auf das Transkript und laden Sie es als Text oder Untertitel herunter.',
  steps: [
    {
      title: 'Aufzeichnung hinzufügen',
      text: 'Klicken Sie auf „Datei auswählen“ oder ziehen Sie die Aufzeichnung auf das Feld oben. Ein MP4-Video oder eine M4A-Audiodatei funktionieren beide, und es wird nur der Ton verwendet. Das Feld nimmt jeweils eine Aufzeichnung an und gibt sie auf der nächsten Seite an den Uploader weiter, wo „Weitere Datei hinzufügen“ den Rest eines Tages voller Gespräche hereinholt.',
    },
    {
      title: 'Sprache und Qualität wählen',
      text: 'Wählen Sie auf der nächsten Seite die Sprache, in der gesprochen wurde, oder lassen Sie „Automatisch erkennen“ aktiviert. „Standard“ passt für die meisten Gespräche. Wo Ihr Gerät sie anbietet, eignen sich „Hohe Genauigkeit“ und „Beste Genauigkeit“ für schnelle Sprecher oder schlechtes Audio; andernfalls erscheinen sie mit Begründung ausgegraut. Beide sind langsamer und brauchen beim ersten Mal einen größeren Download. Wechseln die Teilnehmer die Sprache, wählen Sie die Hauptsprache und prüfen Sie die als unsicher markierten Zeilen. Klicken Sie dann auf „Transkribieren“.',
    },
    {
      title: 'Auf das Transkript warten',
      text: 'Die Zeilen erscheinen, während die Aufzeichnung verarbeitet wird, mit einem Fortschrittsbalken und einer Schätzung der verbleibenden Zeit. Ein langes Meeting dauert länger.',
      browser: {
        text: 'Die Zeilen erscheinen, während die Aufzeichnung verarbeitet wird, mit einem Fortschrittsbalken und einer Schätzung der verbleibenden Zeit. Ihr eigenes Gerät macht die Arbeit, ein langes Meeting dauert daher länger: Lassen Sie diese Seite offen, bis es fertig ist.',
      },
    },
    {
      title: 'Suchen, bearbeiten und exportieren',
      text: 'Tippen Sie Namen und Entscheidungswörter in „Im Text suchen“, um zwischen Zeilen zu springen, spielen Sie eine Zeile ab ihrem Zeitstempel ab, um sie zu prüfen, und korrigieren Sie Fehler. Laden Sie dann TXT, Markdown oder PDF herunter. Ergänzen Sie Sprechernamen beim Bearbeiten von Hand.',
    },
  ],

  formatsTitle: 'Dateien von Meeting-Aufzeichnungen und Downloads',
  formatsIntro:
    'Aufzeichnungen von Zoom, Teams und Meet sind meist MP4 oder M4A. Andere Video- und Audiodateien funktionieren ebenfalls, und es wird nur die Tonspur gelesen.',
  uploadTitle: 'Aufzeichnungsdateien, die Sie hinzufügen können',
  accepts: ['MP4', 'M4A', 'MKV', 'MOV', 'WEBM', 'MP3', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'das ganze Meeting als reiner Text' },
    { name: 'Markdown', use: 'zeitgestempelte Notizen zum Einfügen in eine Notiz-App' },
    { name: 'PDF', use: 'eine Kopie zum Drucken oder Weiterreichen' },
    { name: 'SRT', use: 'zeitgestempelte Zeilen, um die Aufzeichnung zu untertiteln' },
  ],

  tipsTitle: 'Tipps für Meeting-Transkripte',
  tips: [
    {
      title: 'Nutzen Sie die reine Audiodatei, wenn es eine gibt.',
      text: 'Sie enthält dieselbe Sprache in einer viel kleineren Datei und lässt sich daher schneller hinzufügen und verarbeiten.',
    },
    {
      title: 'Tragen Sie Namen und Begriffe in den Wortschatz-Hinweis ein.',
      text: 'Listen Sie unter „Weitere Optionen“ die Personen, Produktnamen und Abkürzungen auf, die im Meeting vorkamen. So kommen Namen und Abkürzungen so heraus, wie Sie es erwarten.',
    },
    {
      title: 'Rechnen Sie damit, dass Durcheinanderreden Fehler verursacht.',
      text: 'Wenn zwei Personen gleichzeitig sprechen, kann die Spracherkennung sie nicht trennen. Zeilen, bei denen sie unsicher ist, sind markiert, prüfen Sie diese zuerst.',
    },
    {
      title: 'Bleiben Sie unter den Limits.',
      text: 'Aufzeichnungen über den auf dieser Seite genannten Größen- oder Längenlimits können nicht verarbeitet werden, schneiden Sie ein sehr langes Gespräch daher vorher in Teile.',
      browser: {
        title: 'Lange Gespräche dauern länger.',
        text: 'Die Seite setzt kein Längenlimit, aber die Aufzeichnung eines ganztägigen Workshops braucht Zeit und freien Speicher auf Ihrem Gerät. Um die erste Stunde früher zu lesen, schneiden Sie die Datei in einem Videoeditor in Teile.',
      },
    },
    {
      title: 'Geben Sie das Transkript mit Sorgfalt weiter.',
      text: 'Senden Sie es nur an die Personen, die im Meeting waren oder es brauchen, und löschen Sie es, wenn Sie es nicht mehr benötigen.',
    },
  ],

  faqs: [
    {
      question:
        'Kann TranscribeVid meinem Zoom- oder Teams-Gespräch beitreten und es live transkribieren?',
      answer:
        'Nein. Es arbeitet mit einer Aufzeichnung, die Sie nach dem Meeting speichern. Es kann keinem Gespräch beitreten, und es sind keine Live-Untertitel. Für Live-Untertitel nutzen Sie die Funktion Ihres Meeting-Werkzeugs.',
    },
    {
      question: 'Zeigt ein Meeting-Transkript, wer was gesagt hat?',
      answer:
        'Nein. Die Zeilen tragen eine Zeit, aber keinen Namen. Ergänzen Sie die Namen selbst beim Bearbeiten und prüfen Sie jeden einzelnen an der Aufzeichnung.',
    },
    {
      question:
        'Ist es sicher, die Aufzeichnung eines vertraulichen Meetings hier zu transkribieren?',
      answer:
        'Der Server empfängt die Aufzeichnung über eine verschlüsselte Verbindung und löscht sie, wenn Ihre Sitzung endet, oder früher, wenn Sie auf „Meine Daten jetzt löschen“ klicken. Prüfen Sie zuerst, was Ihre Organisation erlaubt. Das ist keine Rechtsberatung.',
      browser: {
        answer:
          'Die Aufzeichnung wird nicht hochgeladen: Ihr Browser transkribiert sie auf Ihrem eigenen Gerät und löscht sie nach einer Zeit der Inaktivität oder wenn Sie auf „Meine Daten jetzt löschen“ klicken. Ein heruntergeladenes Transkript ist eine gewöhnliche Datei auf Ihrem Gerät, gehen Sie damit also so sorgsam um wie mit der Aufzeichnung und prüfen Sie, was Ihre Organisation erlaubt. Das ist keine Rechtsberatung.',
      },
    },
    {
      question: 'Wie lang darf eine Meeting-Aufzeichnung sein, die ich transkribieren kann?',
      answer:
        '{limits} Längere Dateien können nicht verarbeitet werden, teilen Sie sie daher vorher auf.',
      browser: {
        answer:
          'Für die Aufzeichnung selbst ist keine Obergrenze gesetzt, weil die Arbeit auf Ihrem eigenen Gerät stattfindet. Begrenzt sind Sie durch Zeit und freien Speicher: Ein mehrstündiges Gespräch ist möglich, die Seite warnt Sie, wenn Ihr Gerät dafür zu langsam wirkt, und ein Browser ohne WebCodecs-Unterstützung kommt mit einer sehr langen Datei unter Umständen nicht zurecht.',
      },
    },
    {
      question: 'Was, wenn die Teilnehmer während des Meetings die Sprache wechseln?',
      answer:
        'Wählen Sie die Sprache, die am meisten gesprochen wird. Die Erkennung folgt der Hauptsprache am besten, Wörter in einer anderen Sprache werden daher möglicherweise falsch geschrieben. Zeilen, bei denen sie unsicher ist, sind markiert: Prüfen Sie diese an der Aufzeichnung.',
    },
  ],

  links: [
    {
      label: 'MP4 zu Text',
      path: '/mp4-to-text',
      note: 'Einstellungen für ein Meeting, das als MP4-Video gespeichert ist.',
    },
    {
      label: 'M4A zu Text',
      path: '/m4a-to-text',
      note: 'Für die reine Audiodatei, die kleiner ist als das Video.',
    },
    {
      label: 'Interview-Transkription',
      path: '/interview-transcription',
      note: 'Für ein aufgezeichnetes Zweiergespräch, mit Hinweisen zu Einwilligung und zur Prüfung von Zitaten.',
    },
    {
      label: 'Video transkribieren, ohne es hochzuladen',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Wo Ihre Aufzeichnung bleibt und wie Sie es in Ihrem Browser überprüfen.',
    },
  ],
};
