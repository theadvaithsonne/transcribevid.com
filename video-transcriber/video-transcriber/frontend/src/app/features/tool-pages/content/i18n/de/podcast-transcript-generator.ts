import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Podcast-Transkript-Generator',
  h1: 'Podcast-Transkript aus Ihrer Audiodatei erstellen',
  lead: 'Legen Sie eine Folge ab und erhalten Sie ein vollständiges Transkript mit Zeitstempeln, das Sie daneben veröffentlichen, durchsuchen, zitieren oder zu Shownotes machen können. Kostenlos, ohne Registrierung und in mehr als 50 Sprachen verfügbar.',
  dropKind: 'audio',
  dropNoun: 'Podcast-Folge',

  whyTitle: 'Warum eine Folge ein Transkript bekommen sollte',
  why: [
    'Ein Transkript macht eine Folge leichter auffindbar, zitierbar und nachvollziehbar. Hörerinnen und Hörer können es überfliegen, stumm oder an einem lauten Ort mitlesen und darin nach dem Namen eines Gasts suchen. Auch gehörlose und schwerhörige Menschen und Personen, die in einer Zweitsprache hören, können es nutzen. Außerdem lesen Suchmaschinen Text weit leichter als Audio.',
    'Diese Seite erstellt den ersten Entwurf: die ganze Folge als Text, mit der Zeit in jeder Zeile. Planen Sie ein, ihn zu bearbeiten. Spracherkennung kennt weder die Namen Ihrer Gäste noch den Fachjargon Ihrer Sendung, und sie kennzeichnet keine Sprecher. Nutzen Sie sie für Folgen, die Sie selbst gemacht haben oder verwenden dürfen.',
  ],

  sections: [
    {
      title: 'Vom Transkript zur Folgenseite',
      paragraphs: ['Ein Transkript kann mehreres speisen, was Sie ohnehin veröffentlichen.'],
      bullets: [
        {
          title: 'Shownotes.',
          text: 'Lesen Sie das Transkript einmal, wählen Sie die Themen aus und schreiben Sie eine kurze Zusammenfassung mit dem Zeitstempel zu jedem. Laden Sie Markdown herunter, um es in eine Notiz-App oder einen Blog-Editor einzufügen.',
        },
        {
          title: 'Ein Transkript unter dem Player.',
          text: 'Laden Sie TXT herunter, ordnen Sie die Absätze und ergänzen Sie Namen wie Moderation und Gast von Hand. Das Transkript hat selbst keine Sprecherkennzeichnungen.',
        },
        {
          title: 'Untertitel für eine Videoversion.',
          text: 'Wenn Sie die Folge auch als Video veröffentlichen, laden Sie SRT oder VTT herunter und laden Sie es als Untertitel hoch.',
        },
        {
          title: 'Zitate und Clips.',
          text: 'Finden Sie die Zeile, lesen Sie ihren Zeitstempel ab und schneiden Sie den Clip zu dieser Zeit aus Ihrem Audio.',
        },
      ],
    },
    {
      title: 'Namen, Jargon und Werbeansagen richtig bekommen',
      paragraphs: [
        'Namen von Gästen, Markennamen und Begriffe der Sendung erkennt Spracherkennung am häufigsten falsch. Listen Sie sie vor dem Start im Wortschatz-Hinweis unter „Weitere Optionen“ auf: die Moderation, die Gäste, den Sendungsnamen, Produkte und jeden Begriff, den Sie oft verwenden. Ist das Transkript fertig, tippen Sie einen falsch geschriebenen Namen in das Feld „Im Text suchen“ darüber, öffnen „Ersetzen…“, geben die richtige Schreibweise ein und wenden sie auf alle passenden Zeilen auf einmal an. Zeilen, bei denen sich die Spracherkennung unsicher war, sind markiert, prüfen Sie diese zuerst.',
        'Lassen Sie den Schalter „Stille und Musik überspringen“ unter „Weitere Optionen“ aktiviert, damit Jingles und lange Pausen nicht zu erfundenen Wörtern werden. Soundeffekte und Musikteppiche unter einer Werbeansage können trotzdem vereinzelten Text hinzufügen, löschen Sie daher alles, was nicht gesagt wurde.',
      ],
    },
  ],

  howTitle: 'So erstellen Sie ein Podcast-Transkript',
  howToDescription:
    'Fügen Sie die Folge hinzu, listen Sie Namen und Begriffe auf, warten Sie auf das Transkript und laden Sie es für die Folgenseite herunter.',
  steps: [
    {
      title: 'Folge hinzufügen',
      text: 'Legen Sie die Folge auf dem Feld oben ab oder klicken Sie auf „Datei auswählen“. MP3 ist das übliche Podcast-Format, aber auch WAV, M4A, FLAC und andere funktionieren. In dieses Feld passt jeweils eine Folge; auf der nächsten Seite können Sie mit „Weitere Datei hinzufügen“ weitere Folgen ergänzen.',
    },
    {
      title: 'Namen und Begriffe auflisten',
      text: 'Öffnen Sie auf der nächsten Seite „Weitere Optionen“ und tragen Sie die Moderation, die Gäste, den Sendungsnamen und jeden Jargon in den Wortschatz-Hinweis ein. Wählen Sie die gesprochene Sprache oder lassen Sie „Automatisch erkennen“ aktiviert.',
    },
    {
      title: 'Starten und auf das Transkript warten',
      text: 'Klicken Sie auf „Transkribieren“. Der Text erscheint Zeile für Zeile mit einem Fortschrittsbalken. „Standard“ passt für die meisten Folgen. Durcheinanderreden oder schlechtes Audio ist der Fall, in dem sich „Hohe Genauigkeit“ oder „Beste Genauigkeit“ ihre Zeit verdienen. Sie sind langsamer, brauchen beim ersten Mal einen größeren Download und erscheinen auf einem Gerät, das sie nicht ausführen kann, mit Begründung ausgegraut.',
    },
    {
      title: 'Bearbeiten und exportieren',
      text: 'Korrigieren Sie Namen und Zeichensetzung und ergänzen Sie Sprechernamen von Hand. Laden Sie dann TXT oder Markdown für die Folgenseite herunter, oder SRT oder VTT für eine Videoversion.',
    },
  ],

  formatsTitle: 'Podcast-Dateien und Downloads',
  formatsIntro:
    'MP3 ist das übliche Podcast-Format. Andere Audiodateien werden genauso gelesen, und Videodateien werden ebenfalls akzeptiert.',
  uploadTitle: 'Audiodateien, die Sie hinzufügen können',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'das Transkript zum Veröffentlichen unter dem Player' },
    { name: 'Markdown', use: 'Shownotes mit Zeitstempeln' },
    { name: 'SRT', use: 'Untertitel für eine Videoversion' },
    { name: 'VTT', use: 'eine Transkriptspur für Web-Player' },
    { name: 'PDF', use: 'ein Transkript zum Teilen oder Drucken' },
  ],

  tipsTitle: 'Tipps für Podcast-Transkripte',
  tips: [
    {
      title: 'Transkribieren Sie den fertigen Mix.',
      text: 'Die gemasterte Folge, mit Intro und Werbeansagen, ist das, was Hörerinnen und Hörer hören. Ihre Zeitstempel passen dann zur Datei, die Sie veröffentlichen.',
    },
    {
      title: 'Nutzen Sie Ihre Original-WAV, wenn Sie eine haben.',
      text: 'Eine MP3-Datei ist eine komprimierte Kopie, und jede weitere Kompressionsrunde kostet Details. Saubereres Audio ergibt weniger Fehler.',
    },
    {
      title: 'Schneiden Sie sehr lange Folgen in Teile.',
      text: 'Eine Datei, die größer oder länger als die auf dieser Seite genannten Limits ist, kann nicht verarbeitet werden, teilen Sie eine lange Folge daher vorher in einem beliebigen Audioeditor.',
      browser: {
        title: 'Lange Folgen dauern länger.',
        text: 'Die Seite setzt keine Obergrenze für die Länge einer Folge, aber eine lange Gesprächssendung braucht Zeit und freien Speicher auf Ihrem Gerät. Wenn Sie sie in einem beliebigen Audioeditor an einer natürlichen Pause teilen, erhalten Sie den ersten Teil früher.',
      },
    },
    {
      title: 'Lesen Sie einmal mit.',
      text: 'Das Transkript zu lesen, während die Folge in normalem Tempo läuft, ist der schnellste Weg, die Fehler zu finden, auf die es ankommt.',
    },
    {
      title: 'Sagen Sie, dass es automatisch erstellt wurde.',
      text: 'Wenn Sie ein Transkript ohne vollständige Überarbeitung veröffentlichen, sagen Sie das, damit die Leserinnen und Leser wissen, dass kleine Fehler möglich sind.',
    },
  ],

  faqs: [
    {
      question:
        'Kann ich ein automatisches Podcast-Transkript auf meiner Folgenseite veröffentlichen?',
      answer:
        'Ja, für eine Folge, die Sie selbst gemacht haben. Lesen Sie es zuerst durch, korrigieren Sie die Namen, ergänzen Sie Sprechernamen von Hand und sagen Sie den Leserinnen und Lesern, dass es automatisch erstellt wurde. Hat ein Gast darum gebeten, etwas wegzulassen, entfernen Sie es auch aus dem Text.',
    },
    {
      question: 'Hat das Podcast-Transkript Sprechernamen?',
      answer:
        'Nein. Tippen Sie beim Bearbeiten „Moderation“ und „Gast“ in den Text; das Transkript selbst trägt nur Zeiten.',
    },
    {
      question: 'Kann ich aus einem Podcast-Transkript Shownotes bekommen?',
      answer:
        'Sie erhalten das Rohmaterial, keine Zusammenfassung. Das Transkript schreibt keine Shownotes für Sie, aber mit seinen Zeitstempeln lassen sich die Themen und die Minute, in der jedes beginnt, schnell auflisten.',
    },
    {
      question: 'Wie lang darf eine Podcast-Folge sein, die ich auf einmal transkribieren kann?',
      answer:
        '{limits} Eine lange Folge muss unter Umständen geteilt werden. Es gibt kein Tages- oder Monatskontingent.',
      browser: {
        answer:
          'Die Länge der Folge ist von der Seite nicht begrenzt. Eine lange Folge dauert länger und braucht freien Speicher auf Ihrem eigenen Gerät; auf einem langsameren warnt Sie die Seite.',
      },
    },
    {
      question: 'Kann ich einen Podcast über seinen RSS-Feed oder einen Link transkribieren?',
      answer:
        'Nein. TranscribeVid arbeitet mit Dateien, die Sie hinzufügen, nicht mit Weblinks oder Feeds. Nutzen Sie die Folgendatei, die Sie gemacht oder exportiert haben, und fügen Sie sie im Feld oben auf dieser Seite hinzu.',
    },
  ],

  links: [
    {
      label: 'MP3 zu Text',
      path: '/mp3-to-text',
      note: 'Einstellungen und Tipps für den häufigsten Podcast-Dateityp.',
    },
    {
      label: 'SRT-Untertitel-Generator',
      path: '/srt-subtitle-generator',
      note: 'Untertitel für eine Videoversion der Folge.',
    },
    {
      label: 'SRT oder VTT',
      path: '/guides/srt-vs-vtt',
      note: 'Welche Untertiteldatei Ihr Player oder Hoster erwartet.',
    },
    {
      label: 'So erhalten Sie ein genaueres Transkript',
      path: '/guides/accurate-transcripts',
      note: 'Weniger Fehler bei derselben Folge.',
    },
  ],
};
