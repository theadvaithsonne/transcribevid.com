import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'M4A en texte',
  h1: 'Transcrire un mémo vocal M4A en texte',
  lead: 'Le M4A est le format qu’enregistrent l’app Dictaphone (Voice Memos) de l’iPhone et du Mac, de nombreux enregistreurs Android et les applications Apple. Ajoutez le fichier et obtenez une transcription horodatée, gratuite, sans connexion et sans conversion en MP3.',
  dropKind: 'audio',
  dropNoun: 'fichier M4A',

  whyTitle: 'Pourquoi les fichiers M4A se transcrivent bien',
  why: [
    'Un M4A est un fichier MPEG-4 contenant uniquement de l’audio. Il contient généralement du son AAC, compressé mais largement suffisant pour la parole ; les fichiers M4A sont donc petits et se transcrivent bien. TranscribeVid les lit directement. Il n’y a rien à convertir d’abord.',
    'Les mémos vocaux sont faits en déplacement ; ils sont donc souvent faibles, pleins d’écho ou enregistrés avec le téléphone dans une poche. Les choix de qualité et les options de nettoyage de cette page existent précisément pour ce genre d’enregistrement.',
  ],

  sections: [
    {
      title: 'Récupérer un mémo vocal depuis votre téléphone',
      paragraphs: [
        'Les noms de menus changent selon les versions d’iOS, de macOS et d’Android ; considérez donc ce qui suit comme un guide. Si vous êtes sur le téléphone lui-même, appuyez sur Choisir un fichier et choisissez l’enregistrement dans Fichiers ou dans votre dossier d’enregistrements. Aucun ordinateur n’est nécessaire.',
      ],
      bullets: [
        {
          title: 'iPhone.',
          text: 'Dans Dictaphone (Voice Memos), ouvrez l’enregistrement, touchez le bouton Plus (trois points) et choisissez Partager. Enregistrez-le dans Fichiers, ou envoyez-le-vous par AirDrop ou par e-mail, puis ajoutez-le ici.',
        },
        {
          title: 'Mac.',
          text: 'Faites glisser un enregistrement hors de la fenêtre de Dictaphone vers le Bureau. Il arrive sous forme de fichier .m4a, prêt à être ajouté.',
        },
        {
          title: 'Android.',
          text: 'De nombreuses applications d’enregistrement sauvegardent des fichiers M4A dans un dossier Enregistrements ou Enregistreur vocal. Le nom du dossier dépend de l’application, et le sélecteur de fichiers peut l’ouvrir.',
        },
      ],
    },
    {
      title: 'Mémos vocaux sans perte et compressés',
      paragraphs: [
        'L’app Dictaphone de l’iPhone peut enregistrer en qualité Compressée ou Sans perte. Les fichiers sans perte sont bien plus gros, se terminent toujours par .m4a et utilisent généralement le codec Apple Lossless. La parole n’en a pas besoin : un mémo compressé donne la même transcription pour une fraction de la taille.',
      ],
      browser: {
        paragraphs: [
          'L’app Dictaphone de l’iPhone peut enregistrer en qualité Compressée ou Sans perte. Les fichiers sans perte sont bien plus gros, se terminent toujours par .m4a et utilisent généralement le codec Apple Lossless, que tous les navigateurs ne savent pas lire seuls. Si le vôtre ne le peut pas, la page peut proposer de charger un petit convertisseur (environ 9 Mo) qui s’exécute sur votre appareil. La parole n’a pas besoin du Sans perte : un mémo compressé donne la même transcription pour une fraction de la taille.',
        ],
      },
    },
  ],

  howTitle: 'Comment transformer un M4A en texte',
  howToDescription:
    'Ajoutez le fichier M4A, choisissez la langue parlée, attendez la transcription et téléchargez-la sous forme de texte.',
  steps: [
    {
      title: 'Ajoutez le M4A',
      text: 'Déposez le mémo .m4a sur la zone en haut de cette page, ou appuyez sur Choisir un fichier et, sur un téléphone, choisissez-le dans Fichiers ou dans votre dossier d’enregistrements. Un seul mémo entre dans cette zone ; une fois sur la page suivante, Ajouter un autre fichier fait entrer les autres.',
    },
    {
      title: 'Choisissez la langue',
      text: 'Sur la page suivante, sélectionnez la langue parlée. Un mémo court donne peu de matière à Détecter automatiquement ; nommer la langue est donc plus fiable. La qualité Standard convient à la plupart des mémos. Appuyez ensuite sur Transcrire.',
    },
    {
      title: 'Attendez la transcription',
      text: 'Les lignes apparaissent une à une, avec une barre de progression et une estimation du temps restant. Lisez à partir de n’importe quelle ligne pour entendre ce qui a été dit.',
    },
    {
      title: 'Corrigez et enregistrez',
      text: 'Corrigez n’importe quel mot erroné, puis téléchargez le TXT, le Markdown ou le PDF pour des notes, ou le SRT ou le VTT si le mémo accompagne une vidéo. Une transcription ne vit que le temps de votre session ; téléchargez-la donc avant de fermer la page.',
    },
  ],

  formatsTitle: 'M4A et autres formats audio',
  formatsIntro:
    'Les enregistreurs de téléphone et d’ordinateur sauvegardent dans des formats différents. Cette zone les accepte tous.',
  uploadTitle: 'Fichiers audio que vous pouvez ajouter',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'vos paroles en texte brut' },
    { name: 'Markdown', use: 'des notes avec horaires' },
    { name: 'PDF', use: 'une copie imprimable du mémo' },
    { name: 'SRT', use: 'des lignes horodatées pour une vidéo qui accompagne le mémo' },
    { name: 'VTT', use: 'des lignes horodatées pour les lecteurs web' },
    { name: 'JSON', use: 'des lignes structurées pour des programmes' },
  ],

  tipsTitle: 'Conseils pour transcrire des mémos vocaux',
  tips: [
    {
      title: 'Tenez le téléphone près de vous.',
      text: 'Un mémo enregistré avec le téléphone dans une poche ou de l’autre côté d’une table est difficile pour n’importe quel logiciel de reconnaissance. Tenez le téléphone à une largeur de main de votre bouche et parlez en travers, pas droit dedans.',
    },
    {
      title: 'Coupez avant de partager.',
      text: 'La plupart des applications de mémos vocaux permettent de couper le début et la fin d’un enregistrement. Retirer une longue pause à l’une ou l’autre extrémité fait gagner du temps d’attente.',
    },
    {
      title: 'Nommez la langue.',
      text: 'Pour un mémo de dix ou vingt secondes, choisir la langue parlée vaut mieux que la détection automatique, surtout pour une parole avec accent ou un mélange de langues.',
    },
    {
      title: 'Donnez-lui les noms difficiles.',
      text: 'Ajoutez les noms inhabituels à l’indice de vocabulaire dans Plus d’options : ils auront beaucoup plus de chances d’être écrits correctement.',
    },
  ],

  faqs: [
    {
      question: 'Puis-je transcrire un mémo vocal de l’iPhone sans le convertir ?',
      answer:
        'Oui. Les mémos vocaux sont des fichiers M4A et TranscribeVid lit le M4A directement. Partagez le mémo vers Fichiers ou vers votre ordinateur, puis ajoutez-le ici. Ne le convertissez pas d’abord en MP3.',
    },
    {
      question: 'Un fichier M4A est-il la même chose qu’un MP4 ?',
      answer:
        'Ce sont des proches parents. Tous deux utilisent le conteneur MPEG-4 ; un M4A ne contient que de l’audio, alors qu’un MP4 transporte généralement aussi de la vidéo. TranscribeVid lit le son de l’un comme de l’autre.',
    },
    {
      question: 'Pourquoi ma transcription M4A est-elle vide ou très courte ?',
      answer:
        'Le mémo est peut-être silencieux, très faible ou principalement du bruit de fond. Réécoutez-le d’abord. S’il est faible, gardez Améliorer l’audio activé dans Plus d’options, et vérifiez que le fichier n’a pas été coupé lors du partage.',
    },
    {
      question: 'Puis-je transcrire une longue réunion enregistrée sur mon téléphone ?',
      answer:
        'Oui. Les fichiers M4A sont petits ; un long enregistrement est donc facile à ajouter. {limits} Il n’y a aucun quota quotidien ou mensuel.',
      browser: {
        answer:
          'Oui. Les fichiers M4A sont petits ; un long enregistrement est donc facile à ajouter. Le site ne fixe aucune limite de taille ni de durée, car c’est votre propre appareil qui fait le travail ; un très long mémo prend donc simplement plus de temps, et sur un appareil plus lent la page le signale avant que vous commenciez. Un navigateur ancien peut refuser un fichier très long.',
      },
    },
    {
      question: 'Puis-je transcrire un mémo vocal en hindi ou en espagnol ?',
      answer:
        'Oui. Choisissez la langue parlée dans la liste de plus de 50, ou laissez Détecter automatiquement pour un mémo dans une seule langue. Pour le hindi, Style de la transcription (à côté de Langue) vous permet de choisir les lettres latines (Hinglish) ou l’écriture devanagari d’origine.',
    },
  ],

  links: [
    {
      label: 'Enregistrement vocal en texte',
      path: '/voice-recording-to-text',
      note: 'Enregistrez avec votre microphone sur la page au lieu d’envoyer un fichier.',
    },
    {
      label: 'MP3 en texte',
      path: '/mp3-to-text',
      note: 'La même transcription gratuite pour les fichiers MP3, l’autre format vocal courant.',
    },
    {
      label: 'Cours en texte',
      path: '/lecture-to-text',
      note: 'Transformez un cours enregistré en notes que vous pouvez rechercher et étudier.',
    },
    {
      label: 'Obtenir une transcription plus précise',
      path: '/guides/accurate-transcripts',
      note: 'Les changements simples dans l’enregistrement et les réglages qui font la plus grande différence.',
    },
  ],
};
