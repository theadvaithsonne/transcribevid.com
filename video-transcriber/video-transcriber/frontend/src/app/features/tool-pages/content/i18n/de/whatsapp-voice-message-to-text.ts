import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WhatsApp-Sprachnachricht zu Text',
  h1: 'WhatsApp-Sprachnachricht in Text umwandeln',
  lead: 'Lange Sprachnachrichten sind leicht zu verschicken und schwer noch einmal zu lesen. Speichern Sie die Nachricht als Datei, legen Sie sie hier ab und lesen Sie sie als Text mit Zeitstempeln, auf Hindi, Englisch, Spanisch und in vielen anderen Sprachen. Kostenlos, ohne Anmeldung.',
  dropKind: 'audio',
  dropNoun: 'WhatsApp-Sprachnachricht',

  whyTitle: 'Warum eine Sprachnachricht in Text umwandeln',
  why: [
    'Eine Sprachnachricht ist schnell aufgenommen und langsam zu nutzen. Man kann sie nicht durchsuchen, keinen Satz daraus kopieren und sie in einer Besprechung nicht überfliegen. Als Text lässt sich dieselbe Nachricht in Sekunden erfassen, und Sie können eine Adresse, ein Zitat oder eine Liste von Anweisungen direkt in einen Chat, eine Notiz oder ein Dokument einfügen.',
    'Nutzen Sie diese Seite für Nachrichten, die Sie gesendet oder empfangen haben und verwenden dürfen. Sprachnachrichten sind persönlich, es hilft daher zu wissen, wohin die Datei geht: Hier wird sie über eine verschlüsselte Verbindung zum Server übertragen und danach automatisch entfernt. Ein Konto ist nicht nötig.',
  ],
  browserWhy: [
    'Eine Sprachnachricht ist schnell aufgenommen und langsam zu nutzen. Man kann sie nicht durchsuchen, keinen Satz daraus kopieren und sie in einer Besprechung nicht überfliegen. Als Text lässt sich dieselbe Nachricht in Sekunden erfassen, und Sie können eine Adresse, ein Zitat oder eine Liste von Anweisungen direkt in einen Chat, eine Notiz oder ein Dokument einfügen.',
    'Nutzen Sie diese Seite für Nachrichten, die Sie gesendet oder empfangen haben und verwenden dürfen. Sprachnachrichten sind persönlich, deshalb bleibt die Datei bei Ihnen: Ihr Browser transkribiert sie auf Ihrem eigenen Gerät, und es wird nichts hochgeladen. Bei der ersten Nutzung der Seite lädt Ihr Browser das Sprachmodell einmal herunter und behält es. Es sind einige zehn Megabyte für „Am schnellsten“, einige hundert für „Standard“ und mehr für die größeren Stufen, nutzen Sie auf dem Handy daher WLAN statt mobiler Daten. Ein Konto ist nicht nötig.',
  ],

  sections: [
    {
      title: 'So speichern Sie eine Sprachnachricht als Datei',
      paragraphs: [
        'WhatsApp behält Sprachnachrichten in der App, speichern Sie die Nachricht daher zuerst als Datei. Die Menüs unterscheiden sich je nach Handymodell und App-Version, verstehen Sie diese Schritte also als Orientierung und suchen Sie nach den Optionen „Teilen“, „Weiterleiten“ oder „Speichern“. WhatsApp gehört einem eigenen Unternehmen, und diese Seite steht in keiner Verbindung dazu.',
        'WhatsApp kann auf manchen Handys auch ein Transkript im Chat anzeigen, in den Sprachen und Versionen, die es anbieten. Diese Seite ist für den Fall, dass Sie den Text als Datei brauchen, die Sie bearbeiten und mit Zeitstempeln exportieren können, oder wenn Ihre Version oder Sprache nicht abgedeckt ist.',
      ],
      bullets: [
        {
          title: 'Auf Android.',
          text: 'Halten Sie die Sprachnachricht gedrückt, öffnen Sie das Menü und suchen Sie nach „Teilen“ oder „Weiterleiten“ und dann „Teilen“. Wählen Sie „Auf dem Gerät speichern“, „Dateien“ oder eine Cloud-Speicher-App, oder schicken Sie sie sich per E-Mail selbst zu. Viele Android-Handys legen empfangene Sprachnachrichten außerdem in einem Ordner „WhatsApp Voice Notes“ ab, den ein Dateimanager öffnen kann.',
        },
        {
          title: 'Auf dem iPhone.',
          text: 'Halten Sie die Sprachnachricht gedrückt, wählen Sie „Weiterleiten“, tippen Sie dann auf das Teilen-Symbol und wählen „In Dateien sichern“. Sie können sie auch per AirDrop oder E-Mail an Ihren Computer schicken.',
        },
        {
          title: 'Auf einem Computer.',
          text: 'In WhatsApp Web oder der Desktop-App bietet das Nachrichtenmenü möglicherweise die Option „Herunterladen“ an. Falls nicht, speichern Sie die Datei auf Ihrem Handy und übertragen Sie sie.',
        },
      ],
    },
    {
      title: 'Hindi, Hinglish und Nachrichten in gemischten Sprachen',
      paragraphs: [
        'Sprachnachrichten mischen oft mehrere Sprachen in einem Satz. Stellen Sie die Sprache auf die ein, die überwiegend gesprochen wird, oder lassen Sie „Automatisch erkennen“ aktiviert. Die Erkennung folgt der Hauptsprache am besten, prüfen Sie daher die als unsicher markierten Zeilen, wo eine zweite Sprache hinzukommt.',
        'Bei Hindi bestimmt der Transkriptionsstil, wie der Text geschrieben wird. „Hinglish (Hindi in lateinischer Schrift)“ schreibt Hindi in lateinischen Buchstaben und lässt englische Wörter, wie sie sind. „Originalschrift“ behält Devanagari bei. Urdu, Bengalisch, Arabisch, Spanisch, Portugiesisch und die anderen unterstützten Sprachen behalten ihre eigene Schrift. Eine Nachricht in einer anderen Sprache kann auch als englischer Text herauskommen: Stellen Sie unter „Weitere Optionen“ „Ausgabe“ auf „Ins Englische übersetzen“ und prüfen Sie das Ergebnis an der Aufnahme, denn eine Übersetzung ist weniger zuverlässig als die Transkription in der Originalsprache.',
      ],
    },
  ],

  howTitle: 'So wandeln Sie eine WhatsApp-Sprachnachricht in Text um',
  howToDescription:
    'Speichern Sie die Sprachnachricht als Datei, fügen Sie sie der Seite hinzu, wählen Sie die Sprache, warten Sie auf das Transkript und kopieren oder laden Sie den Text herunter.',
  steps: [
    {
      title: 'Datei der Sprachnachricht hinzufügen',
      text: 'Legen Sie die gespeicherte Datei im Feld oben ab oder klicken Sie auf „Datei auswählen“. Eine WhatsApp-Sprachnachricht ist meist eine .opus-Datei, und die funktioniert so, wie sie ist. Das Feld nimmt jeweils eine Datei an: Es gibt die Nachricht auf der nächsten Seite an den Uploader weiter, wo Sie mit „Weitere Datei hinzufügen“ weitere Nachrichten ergänzen können.',
    },
    {
      title: 'Sprache wählen',
      text: 'Wählen Sie auf der nächsten Seite die Sprache, die überwiegend gesprochen wird, oder lassen Sie „Automatisch erkennen“ aktiviert. Bei Hindi wählt der Transkriptionsstil zwischen lateinischen Buchstaben (Hinglish) und Devanagari. Klicken Sie dann auf „Transkribieren“.',
    },
    {
      title: 'Auf den Text warten',
      text: 'Die Zeilen erscheinen mit ihren Zeitstempeln, während die Nachricht verarbeitet wird, und eine kurze Nachricht ist früher fertig als eine lange. „Standard“ passt für die meisten Nachrichten. Bei einem schnellen Sprecher oder einer verrauschten Aufnahme kann „Hohe Genauigkeit“ helfen, wo Ihr Gerät sie ausführen kann. Auf einem Gerät, das das nicht kann, ist die Auswahl mit Begründung ausgegraut, und sie braucht beim ersten Mal einen größeren Download.',
    },
    {
      title: 'Prüfen, kopieren oder herunterladen',
      text: 'Korrigieren Sie Namen und unklare Wörter und kopieren Sie dann den Text oder laden Sie TXT herunter. Laden Sie SRT oder VTT nur herunter, wenn die Nachricht zu einem Video gehört.',
    },
  ],

  formatsTitle: 'Dateien von Sprachnachrichten und Downloads',
  formatsIntro:
    'WhatsApp-Sprachnachrichten sind meist .opus-Dateien. Andere Audiodateien funktionieren genauso, und auch Videodateien werden akzeptiert, wobei nur ihr Ton verwendet wird.',
  uploadTitle: 'Audiodateien, die Sie hinzufügen können',
  accepts: ['OPUS', 'OGG', 'M4A', 'MP3', 'AAC', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'die Nachricht als reiner Text zum Kopieren' },
    { name: 'Markdown', use: 'Notizen mit einer Zeit in jeder Zeile' },
    { name: 'PDF', use: 'eine druckbare Kopie der Nachricht' },
    { name: 'SRT', use: 'zeitgestempelte Zeilen für ein Video, das die Nachricht trägt' },
  ],

  tipsTitle: 'Tipps für Sprachnachrichten',
  tips: [
    {
      title: 'Speichern Sie die Datei, nehmen Sie sie nicht erneut auf.',
      text: 'Eine Nachricht über den Lautsprecher abzuspielen, während ein anderes Gerät aufnimmt, fügt Echo und Raumgeräusche hinzu. Die gespeicherte Datei ist die saubere Kopie.',
    },
    {
      title: 'Nennen Sie die Hauptsprache.',
      text: 'Die Sprache selbst zu wählen ist bei einer kurzen Nachricht zuverlässiger als die automatische Erkennung, besonders wenn der Sprecher zwischen zwei Sprachen wechselt.',
    },
    {
      title: 'Tragen Sie Namen in den Wortschatz-Hinweis ein.',
      text: 'Tippen Sie unter „Weitere Optionen“ die Namen der erwähnten Personen, Orte und Geschäfte ein. Dann werden sie eher so geschrieben, wie Sie es erwarten.',
    },
    {
      title: 'Prüfen Sie Zahlen, bevor Sie danach handeln.',
      text: 'Eine Telefonnummer, eine Adresse, eine Uhrzeit oder ein Betrag kann falsch verstanden werden. Spielen Sie diese Zeile ab ihrem Zeitstempel ab und hören Sie noch einmal hin, bevor Sie sich darauf verlassen.',
    },
    {
      title: 'Gehen Sie mit den Nachrichten anderer sorgsam um.',
      text: 'Transkribieren Sie nur Nachrichten, die Sie gesendet oder empfangen haben und verwenden dürfen, und überlegen Sie, bevor Sie den Text einer Nachricht teilen, die jemand Ihnen privat geschickt hat.',
    },
  ],

  faqs: [
    {
      question: 'Kann ich eine WhatsApp-Sprachnachricht ohne die App in Text umwandeln?',
      answer:
        'Ja. Speichern Sie die Sprachnachricht als Datei, fügen Sie sie dieser Seite hinzu und lesen Sie den Text. Sie brauchen kein Konto auf dieser Seite, und es gibt weder Registrierung noch Anmeldung.',
    },
    {
      question: 'Welcher Dateityp ist eine WhatsApp-Sprachnachricht?',
      answer:
        'Meist eine .opus-Datei. Diese Seite liest sie direkt, Sie müssen sie also nicht vorher in MP3 umwandeln. Als OGG, M4A, MP3 oder AAC gespeicherte Sprachnachrichten funktionieren ebenfalls.',
    },
    {
      question: 'Funktioniert es für Hindi oder eine Mischung aus Hindi und Englisch?',
      answer:
        'Ja. Hindi gehört zu den unterstützten Sprachen. Standardmäßig wird der Text in lateinischen Buchstaben (Hinglish) geschrieben; wählen Sie unter „Transkriptionsstil“ „Originalschrift“ für Devanagari. Eine Nachricht, die Sprachen mischt, folgt der Hauptsprache am besten, prüfen Sie daher die als unsicher markierten Zeilen.',
    },
    {
      question: 'Wie lange darf eine WhatsApp-Sprachnachricht sein, die ich transkribieren kann?',
      answer:
        '{limits} Sprachnachrichten sind normalerweise kurz, das spielt also selten eine Rolle. Es gibt kein Tages- oder Monatskontingent.',
      browser: {
        answer:
          'Die Seite setzt kein Größen- oder Längenlimit, und Sprachnachrichten sind normalerweise kurz, sie sind also schnell fertig. Eine sehr lange Aufnahme braucht Zeit und freien Speicher auf Ihrem Gerät, und manche Browser kommen mit einer extrem langen Datei möglicherweise nicht zurecht.',
      },
    },
    {
      question: 'Bewahrt dieser Dienst eine Kopie meiner WhatsApp-Sprachnachricht auf?',
      answer:
        'Nur für Ihre Sitzung. Der Server löscht die Datei, wenn die Sitzung endet oder wenn Sie auf „Meine Daten jetzt löschen“ klicken.',
      browser: {
        answer:
          'Nur in diesem Browser: Die Sprachnachricht verlässt Ihr Gerät nie. Ihr Browser löscht sie nach einer Zeit der Inaktivität, und mit „Meine Daten jetzt löschen“ können Sie sie früher löschen.',
      },
    },
  ],

  links: [
    {
      label: 'Hindi Audio zu Text',
      path: '/hindi-audio-to-text',
      note: 'Einstellungen und Tipps für Hindi-Sprache, in Devanagari oder lateinischen Buchstaben (Seite auf Englisch).',
    },
    {
      label: 'Hinglish-Transkription',
      path: '/hinglish-transcription',
      note: 'Wie Hindi in lateinischen Buchstaben geschrieben wird und wann man es verwendet (Seite auf Englisch).',
    },
    {
      label: 'Sprache ins Englische übersetzen',
      path: '/translate-audio-to-english',
      note: 'Erhalten Sie englischen Text aus einer Sprachnachricht in einer anderen Sprache.',
    },
    {
      label: 'So erhalten Sie ein genaueres Transkript',
      path: '/guides/accurate-transcripts',
      note: 'Was Sie ändern können, wenn eine Nachricht mit Fehlern herauskommt.',
    },
  ],
};
