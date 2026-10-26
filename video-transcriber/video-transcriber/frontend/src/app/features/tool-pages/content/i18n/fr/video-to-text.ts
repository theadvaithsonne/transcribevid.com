import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Vidéo en texte',
  h1: 'Convertir une vidéo en texte, gratuitement et avec horodatage',
  lead: 'Envoyez une vidéo enregistrée et regardez la parole se transformer en texte, ligne par ligne, chacune avec son heure. Cours, entretiens, réunions, séquences filmées au téléphone et enregistrements d’écran fonctionnent, dans plus de 50 langues.',
  dropKind: 'video',
  dropNoun: 'vidéo',

  whyTitle: 'Pourquoi transformer une vidéo en texte',
  why: [
    'Une vidéo est lente à parcourir. On ne peut ni la survoler, ni la citer, ni en copier une phrase. Une transcription change la parole en texte que vous pouvez rechercher, citer, traduire et lire en une fraction du temps, et chaque ligne garde son horodatage pour que vous puissiez revenir au moment exact.',
    'On s’en sert pour des cours et des webinaires enregistrés, des images d’entretien, des réunions d’équipe sauvegardées, des démonstrations de produit, des vlogs et de courts clips pour les réseaux sociaux. Le texte constitue aussi un bon point de départ pour des sous-titres, des notes d’émission, des articles de blog et des comptes rendus de réunion.',
  ],

  howTitle: 'Comment convertir une vidéo en texte',
  howToDescription:
    'Envoyez un fichier vidéo, choisissez la langue parlée, attendez la transcription et téléchargez-la sous forme de texte ou de sous-titres.',
  steps: [
    {
      title: 'Choisissez votre vidéo',
      text: 'Déposez la vidéo dans la zone en haut de cette page ou appuyez sur Choisir un fichier. Elle s’ouvre dans l’outil d’envoi, où vous pouvez ajouter d’autres vidéos.',
    },
    {
      title: 'Réglez la langue et la qualité',
      text: 'Choisissez la langue parlée pour une meilleure précision, ou laissez la détection automatique activée. Standard convient à la plupart des vidéos. Le plus rapide est rapide pour une voix claire. Pour un son bruyant ou difficile, choisissez Haute précision ou Précision maximale ; Précision maximale est la plus longue et fait le moins d’erreurs.',
    },
    {
      title: 'Regardez-la se transcrire',
      text: 'Le texte apparaît en direct, ligne par ligne, avec une barre de progression et une estimation du temps restant.',
    },
    {
      title: 'Modifiez et téléchargez',
      text: 'Corrigez n’importe quelle ligne dans l’éditeur, puis téléchargez TXT, SRT, VTT, Markdown, JSON ou PDF. Rien n’est conservé après votre session : téléchargez avant de partir.',
    },
  ],

  formatsTitle: 'Fichiers vidéo pris en charge et téléchargements',
  formatsIntro:
    'TranscribeVid lit la piste sonore, la qualité de l’image n’a donc aucune importance. Les fichiers audio seuls fonctionnent aussi.',
  uploadTitle: 'Fichiers vidéo que vous pouvez envoyer',
  accepts: ['MP4', 'MKV', 'MOV', 'AVI', 'WEBM', 'WMV', 'FLV', 'M4V', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'texte brut à lire ou à coller' },
    { name: 'SRT', use: 'sous-titres pour les lecteurs et les logiciels de montage' },
    { name: 'VTT', use: 'sous-titres pour la vidéo sur le web' },
    { name: 'Markdown', use: 'texte avec titres et horaires' },
    { name: 'JSON', use: 'lignes horodatées pour des programmes' },
    { name: 'PDF', use: 'une copie à imprimer' },
  ],

  tipsTitle: 'Conseils pour de meilleures transcriptions de vidéos',
  tips: [
    {
      title: 'Écoutez d’abord la première minute.',
      text: 'Si vous avez du mal à suivre la parole avec les haut-parleurs de votre ordinateur portable, le logiciel en aura aussi. Réglez les problèmes de volume avant l’envoi.',
    },
    {
      title: 'Indiquez la langue.',
      text: 'Choisir la langue parlée est plus fiable que la détection automatique, surtout pour les clips courts ou accentués.',
    },
    {
      title: 'Ajoutez un indice de vocabulaire.',
      text: 'Dans Plus d’options, listez les noms, les marques et le jargon tels que vous voulez les voir écrits.',
    },
    {
      title: 'Restez sous la limite.',
      text: 'Les vidéos plus longues ou plus lourdes que la limite indiquée ci-dessus sont refusées ; découpez donc d’abord les longs enregistrements en parties.',
      browser: {
        title: 'Les longues vidéos prennent plus de temps.',
        text: 'Il n’y a pas de limite de taille, mais une longue vidéo demande plus de temps sur votre appareil et davantage de mémoire. Sur un téléphone, découpez les très longs enregistrements en parties.',
      },
    },
    {
      title: 'Vérifiez les lignes signalées.',
      text: 'Les lignes dont le logiciel de reconnaissance n’est pas sûr sont signalées. Relisez-les en premier, car aucune transcription n’est parfaite.',
    },
  ],

  faqs: [
    {
      question: 'La conversion d’une vidéo en texte est-elle vraiment gratuite ?',
      answer:
        'Oui. C’est gratuit, il n’y a ni compte ni connexion, et aucun quota quotidien ou mensuel. {limits} Si beaucoup de monde utilise le service, votre fichier peut attendre un moment dans une file.',
      browser: {
        answer:
          'Oui. C’est gratuit, il n’y a ni compte ni connexion, et aucun quota quotidien ou mensuel ; la publicité le garde gratuit. Votre vidéo est transcrite dans votre navigateur, sur votre propre appareil : il n’y a donc pas de limite de taille et personne ne passe avant vous. La vitesse dépend de votre appareil.',
      },
    },
    {
      question: 'Puis-je transcrire une vidéo sans parole ?',
      answer:
        'Seule la parole devient du texte. Une vidéo silencieuse, ou avec seulement de la musique, donne un résultat vide ou très court. Le texte affiché à l’écran n’est pas lu.',
    },
    {
      question: 'Puis-je coller un lien YouTube ?',
      answer:
        'Non. TranscribeVid fonctionne avec les fichiers que vous envoyez ou enregistrez, pas avec des liens web. Si la vidéo est la vôtre, envoyez le fichier d’origine.',
    },
    {
      question: 'Indique-t-il qui parle ?',
      answer:
        'Non. Les noms ou étiquettes des intervenants ne sont pas ajoutés. Chaque ligne porte un horodatage, et vous pouvez saisir les noms dans le texte pendant que vous le modifiez.',
    },
    {
      question: 'Quelle est la précision de la transcription d’une vidéo ?',
      answer:
        'Sur une parole claire dans une langue prise en charge, elle est généralement très bonne, mais aucune reconnaissance vocale n’est parfaite. Le bruit, les accents, la musique et les voix qui se chevauchent réduisent la précision : vérifiez donc les passages importants avec la vidéo.',
    },
  ],
};
