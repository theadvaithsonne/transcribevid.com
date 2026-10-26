import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Transcription de podcast',
  h1: 'Générer la transcription d’un podcast à partir de votre fichier audio',
  lead: 'Déposez un épisode et obtenez une transcription complète et horodatée à publier à côté, à rechercher, à citer ou à transformer en notes d’émission. Gratuit, sans inscription, et disponible dans plus de 50 langues.',
  dropKind: 'audio',
  dropNoun: 'épisode de podcast',

  whyTitle: 'Pourquoi donner une transcription à un épisode',
  why: [
    'Une transcription rend un épisode plus facile à trouver, à citer et à suivre. Les auditeurs peuvent la parcourir, la lire en même temps sans le son ou dans un endroit bruyant, et y chercher le nom d’un invité. Les auditeurs sourds et malentendants, et les personnes qui écoutent dans une seconde langue, peuvent aussi s’en servir. Les moteurs de recherche lisent aussi le texte bien plus facilement que l’audio.',
    'Cette page produit le premier jet : tout l’épisode sous forme de texte, avec l’horaire sur chaque ligne. Prévoyez de le retoucher. La reconnaissance vocale ne connaît pas les noms de vos invités ni le jargon de votre émission, et elle n’étiquette pas les intervenants. Utilisez-la pour des épisodes que vous avez réalisés ou que vous avez le droit d’utiliser.',
  ],

  sections: [
    {
      title: 'De la transcription à la page de l’épisode',
      paragraphs: ['Une même transcription peut alimenter plusieurs choses que vous publiez déjà.'],
      bullets: [
        {
          title: 'Les notes d’émission.',
          text: 'Lisez la transcription une fois, choisissez les sujets et rédigez un court résumé avec l’horodatage de chacun. Téléchargez le Markdown à coller dans une application de notes ou dans un éditeur de blog.',
        },
        {
          title: 'Une transcription sous le lecteur.',
          text: 'Téléchargez le TXT, remettez les paragraphes en ordre et ajoutez à la main des noms comme Animateur et Invité. La transcription n’a pas d’étiquettes d’intervenants par elle-même.',
        },
        {
          title: 'Des sous-titres pour une version vidéo.',
          text: 'Si vous publiez aussi l’épisode sous forme de vidéo, téléchargez le SRT ou le VTT et envoyez-le comme sous-titres.',
        },
        {
          title: 'Des citations et des extraits.',
          text: 'Trouvez la ligne, lisez son horodatage et découpez l’extrait dans votre audio à ce moment-là.',
        },
      ],
    },
    {
      title: 'Bien écrire les noms, le jargon et les publicités lues',
      paragraphs: [
        'Les noms d’invités, les noms de marques et les termes de l’émission sont ce que le logiciel de reconnaissance se trompe le plus souvent. Avant de commencer, listez-les dans l’indice de vocabulaire sous Plus d’options : l’animateur, les invités, le nom de l’émission, les produits et tout terme que vous employez souvent. Quand la transcription est prête, saisissez un nom mal orthographié dans la zone Rechercher dans le texte au-dessus d’elle, ouvrez Remplacer…, entrez la bonne orthographe et appliquez-la à toutes les lignes correspondantes d’un coup. Les lignes dont le logiciel n’était pas sûr sont signalées ; relisez-les donc en premier.',
        'Laissez le commutateur Ignorer les silences et la musique activé dans Plus d’options, afin que les jingles et les longues pauses ne se transforment pas en mots inventés. Les effets sonores et les fonds musicaux sous une publicité lue peuvent tout de même ajouter du texte parasite ; supprimez donc tout ce qui n’a pas été dit.',
      ],
    },
  ],

  howTitle: 'Comment générer la transcription d’un podcast',
  howToDescription:
    'Ajoutez l’épisode, listez les noms et les termes, attendez la transcription et téléchargez-la pour la page de l’épisode.',
  steps: [
    {
      title: 'Ajoutez l’épisode',
      text: 'Déposez l’épisode sur la zone ci-dessus, ou appuyez sur Choisir un fichier. Le MP3 est le format habituel des podcasts, mais le WAV, le M4A, le FLAC et d’autres fonctionnent. Un seul épisode entre dans cette zone à la fois ; sur la page suivante, Ajouter un autre fichier vous permet d’inclure d’autres épisodes.',
    },
    {
      title: 'Listez les noms et les termes',
      text: 'Sur la page suivante, ouvrez Plus d’options et mettez l’animateur, les invités, le nom de l’émission et tout jargon dans l’indice de vocabulaire. Choisissez la langue parlée, ou gardez Détecter automatiquement.',
    },
    {
      title: 'Lancez et attendez la transcription',
      text: 'Appuyez sur Transcrire. Le texte apparaît ligne par ligne avec une barre de progression. Standard convient à la plupart des épisodes. Les voix superposées ou un mauvais son sont les cas où Haute précision ou Précision maximale méritent leur temps. Elles sont plus lentes, demandent un téléchargement initial plus gros, et apparaissent grisées avec une raison sur un appareil qui ne peut pas les exécuter.',
    },
    {
      title: 'Modifiez et exportez',
      text: 'Corrigez les noms et la ponctuation et ajoutez à la main les noms des intervenants. Téléchargez ensuite le TXT ou le Markdown pour la page de l’épisode, ou le SRT ou le VTT pour une version vidéo.',
    },
  ],

  formatsTitle: 'Fichiers de podcast et téléchargements',
  formatsIntro:
    'Le MP3 est le format habituel des podcasts. Les autres fichiers audio sont lus de la même façon, et les fichiers vidéo sont acceptés aussi.',
  uploadTitle: 'Fichiers audio que vous pouvez ajouter',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'la transcription à publier sous le lecteur' },
    { name: 'Markdown', use: 'des notes d’émission avec horodatage' },
    { name: 'SRT', use: 'des sous-titres pour une version vidéo' },
    { name: 'VTT', use: 'une piste de transcription pour les lecteurs web' },
    { name: 'PDF', use: 'une transcription à partager ou à imprimer' },
  ],

  tipsTitle: 'Conseils pour les transcriptions de podcasts',
  tips: [
    {
      title: 'Transcrivez le mixage final.',
      text: 'L’épisode masterisé, avec son générique et ses publicités lues, est ce qu’entendent les auditeurs. Ses horodatages correspondent alors au fichier que vous publiez.',
    },
    {
      title: 'Utilisez votre WAV d’origine si vous l’avez.',
      text: 'Un MP3 est une copie compressée, et chaque passage de compression supplémentaire fait perdre des détails. Un audio plus propre donne moins d’erreurs.',
    },
    {
      title: 'Découpez les très longs épisodes en parties.',
      text: 'Un fichier plus lourd ou plus long que les limites indiquées sur cette page ne peut pas être traité ; découpez donc d’abord un long épisode dans n’importe quel éditeur audio.',
      browser: {
        title: 'Les longs épisodes prennent plus de temps.',
        text: 'Le site ne plafonne pas la durée d’un épisode, mais une longue émission de conversation demande du temps et de la mémoire libre sur votre appareil. Le découper à une pause naturelle dans n’importe quel éditeur audio vous donne plus tôt la première partie.',
      },
    },
    {
      title: 'Lisez en suivant une fois.',
      text: 'Lire la transcription pendant que l’épisode se joue à vitesse normale est le moyen le plus rapide de repérer les erreurs qui comptent.',
    },
    {
      title: 'Dites que c’est automatique.',
      text: 'Si vous publiez une transcription sans relecture complète, dites-le, pour que les lecteurs sachent que de petites erreurs sont possibles.',
    },
  ],

  faqs: [
    {
      question:
        'Puis-je publier une transcription automatique de podcast sur la page de mon épisode ?',
      answer:
        'Oui, pour un épisode que vous avez réalisé. Relisez-la d’abord, corrigez les noms, ajoutez à la main les noms des intervenants et dites aux lecteurs qu’elle a été produite automatiquement. Si un invité a demandé qu’un passage soit retiré, retirez-le aussi du texte.',
    },
    {
      question: 'La transcription d’un podcast comporte-t-elle les noms des intervenants ?',
      answer:
        'Non. Saisissez « Animateur » et « Invité » dans le texte pendant la modification ; la transcription elle-même ne porte que des horaires.',
    },
    {
      question: 'Puis-je obtenir des notes d’émission à partir d’une transcription de podcast ?',
      answer:
        'Vous obtenez la matière première, pas un résumé. La transcription ne rédige pas les notes d’émission à votre place, mais ses horodatages permettent de lister rapidement les sujets et la minute où chacun commence.',
    },
    {
      question: 'Quelle durée d’épisode de podcast puis-je transcrire d’un seul coup ?',
      answer:
        '{limits} Un long épisode peut devoir être découpé. Il n’y a aucun quota quotidien ou mensuel.',
      browser: {
        answer:
          'La durée d’un épisode n’est pas plafonnée par le site. Un long épisode prend plus de temps et demande de la mémoire libre sur votre propre appareil ; la page vous prévient sur un appareil plus lent.',
      },
    },
    {
      question: 'Puis-je transcrire un podcast à partir de son flux RSS ou d’un lien ?',
      answer:
        'Non. TranscribeVid fonctionne avec les fichiers que vous ajoutez, pas avec des liens web ni des flux. Utilisez le fichier de l’épisode que vous avez réalisé ou exporté, et ajoutez-le dans la zone en haut de cette page.',
    },
  ],

  links: [
    {
      label: 'MP3 en texte',
      path: '/mp3-to-text',
      note: 'Réglages et conseils pour le type de fichier de podcast le plus courant.',
    },
    {
      label: 'Générateur de sous-titres SRT',
      path: '/srt-subtitle-generator',
      note: 'Des sous-titres pour une version vidéo de l’épisode.',
    },
    {
      label: 'SRT ou VTT : quel format choisir',
      path: '/guides/srt-vs-vtt',
      note: 'Quel fichier de sous-titres votre lecteur ou votre hébergeur attend.',
    },
    {
      label: 'Obtenir une transcription plus précise',
      path: '/guides/accurate-transcripts',
      note: 'Moins d’erreurs à partir du même épisode.',
    },
  ],
};
