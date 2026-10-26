import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Générateur de sous-titres YouTube',
  h1: 'Créer des sous-titres pour votre propre vidéo YouTube',
  lead: 'Ajoutez le fichier vidéo que vous avez réalisé pour YouTube, obtenez un fichier SRT synchronisé sur la parole et importez-le dans YouTube Studio. Gratuit, sans connexion, et vous vérifiez chaque ligne avant de publier.',
  dropKind: 'video',
  dropNoun: 'vidéo',

  whyTitle: 'Pourquoi importer votre propre fichier de sous-titres',
  why: [
    'YouTube produit des sous-titres automatiques pour de nombreuses vidéos, mais ils ne sont pas toujours justes, et ils n’apparaissent pas tant que YouTube n’a pas fini de traiter la vidéo. Un fichier de sous-titres à vous permet de vérifier et de corriger chaque ligne, avec vos noms, vos produits et vos termes écrits comme vous les écrivez.',
    'Cette page est destinée aux vidéos que vous avez réalisées vous-même. Elle travaille à partir du fichier vidéo de votre ordinateur, pas d’un lien YouTube : coller un lien n’est pas pris en charge. Si la vidéo est la vôtre, vous avez déjà l’original issu de votre caméra ou de votre logiciel de montage. TranscribeVid est un outil indépendant et n’a aucun lien avec YouTube : il ne se connecte jamais à votre chaîne ; c’est donc à vous d’y ajouter le fichier terminé.',
  ],

  sections: [
    {
      title: 'Ajouter le fichier SRT dans YouTube Studio',
      paragraphs: [
        'Les noms de menus de YouTube Studio changent de temps à autre ; considérez donc ces étapes comme un guide et suivez les libellés que vous voyez à l’écran.',
      ],
      bullets: [
        {
          title: 'Ouvrez Sous-titres.',
          text: 'Connectez-vous à votre chaîne, ouvrez YouTube Studio et choisissez Sous-titres dans le menu de gauche.',
        },
        {
          title: 'Choisissez la vidéo.',
          text: 'Choisissez la vidéo à sous-titrer. Si YouTube demande la langue de la vidéo, réglez-la d’abord.',
        },
        {
          title: 'Ajoutez la langue.',
          text: 'Choisissez Ajouter une langue, sélectionnez la langue du fichier, puis choisissez Ajouter sous Sous-titres.',
        },
        {
          title: 'Importez le fichier.',
          text: 'Choisissez Importer un fichier, puis Avec synchronisation, et sélectionnez le fichier .srt que vous avez téléchargé. Vérifiez les lignes dans l’aperçu, puis Publier.',
        },
      ],
    },
    {
      title: 'Des sous-titres en anglais à partir d’une autre langue',
      paragraphs: [
        'Si la vidéo est parlée dans une autre langue, réglez Sortie sur Traduire en anglais dans Plus d’options avant de commencer. Vous obtenez un texte anglais synchronisé sur la parole, que vous pouvez importer comme piste de sous-titres en anglais. La traduction est un travail de machine ; relisez donc l’anglais avant sa mise en ligne.',
        'TranscribeVid ne traduit pas vers d’autres langues que l’anglais. Pour chaque autre langue dont vous avez un fichier, ajoutez une piste séparée dans YouTube Studio.',
      ],
    },
    {
      title: 'Pourquoi les sous-titres valent l’effort',
      paragraphs: [
        'Les gens regardent dans des endroits où ils ne peuvent pas monter le son, et beaucoup suivent mieux une langue étrangère à l’écrit qu’à l’oreille. Les sous-titres aident aussi les spectateurs sourds ou malentendants, et ils transforment vos paroles en texte que l’on peut rechercher et citer.',
      ],
    },
  ],

  howTitle: 'Comment créer des sous-titres pour une vidéo YouTube',
  howToDescription:
    'Ajoutez le fichier vidéo, choisissez la langue parlée, vérifiez les lignes, téléchargez un fichier SRT et importez-le dans YouTube Studio.',
  steps: [
    {
      title: 'Ajoutez votre fichier vidéo',
      text: 'Choisissez le fichier vidéo que vous avez envoyé à YouTube, pas un lien vers celui-ci : déposez-le sur la zone en haut de cette page ou appuyez sur Choisir un fichier. Pour une seconde vidéo, utilisez Ajouter un autre fichier sur la page suivante.',
    },
    {
      title: 'Choisissez la langue',
      text: 'Sur la page suivante, choisissez la langue parlée, ou laissez Détecter automatiquement activé. Gardez Horodatage par mot activé dans Plus d’options, pour que chaque ligne commence et finisse avec les mots. Appuyez ensuite sur Transcrire.',
    },
    {
      title: 'Vérifiez les lignes',
      text: 'Ouvrez la transcription, lisez à partir de n’importe quel horodatage et corrigez les mots, les noms et les nombres erronés. Supprimez les lignes que vous ne voulez pas afficher.',
    },
    {
      title: 'Téléchargez le SRT et importez-le',
      text: 'Téléchargez le fichier SRT, puis ajoutez-le à la vidéo dans YouTube Studio comme décrit plus haut.',
    },
  ],

  formatsTitle: 'Fichiers vidéo et fichiers de sous-titres',
  formatsIntro:
    'Ajoutez le fichier vidéo que vous avez réalisé pour YouTube, dans l’un de ces types, et téléchargez les sous-titres dans le format dont vous avez besoin.',
  uploadTitle: 'Fichiers vidéo que vous pouvez ajouter',
  accepts: ['MP4', 'MOV', 'M4V', 'WEBM', 'MKV', '3GP'],
  downloads: [
    { name: 'SRT', use: 'le fichier de sous-titres que demande YouTube Studio' },
    { name: 'VTT', use: 'WebVTT, pour les lecteurs web' },
    { name: 'TXT', use: 'une transcription pour votre description ou un article de blog' },
    { name: 'Markdown', use: 'texte avec horodatage' },
    { name: 'JSON', use: 'chaque ligne et son horaire, pour des programmes' },
    { name: 'PDF', use: 'un script imprimable' },
  ],

  tipsTitle: 'Conseils pour les sous-titres YouTube',
  tips: [
    {
      title: 'Utilisez le montage final.',
      text: 'Créez le fichier à partir de la vidéo exacte que vous envoyez, pas d’un brouillon antérieur. Chaque modification qui déplace la parole déplace aussi la synchronisation.',
    },
    {
      title: 'Gardez l’horodatage par mot activé.',
      text: 'Il est activé par défaut et donne une synchronisation des sous-titres plus fine que l’horodatage de phrases entières.',
    },
    {
      title: 'Corrigez les noms avant de publier.',
      text: 'Le texte automatique se trompe le plus souvent sur les noms de chaînes, les produits et les nombres. Un indice de vocabulaire aide, et une relecture attrape le reste.',
    },
    {
      title: 'Lisez-le sans le son.',
      text: 'Regardez la vidéo en sourdine avec les sous-titres activés. Vous verrez tout de suite quelles lignes disparaissent trop vite pour être lues.',
    },
  ],

  faqs: [
    {
      question:
        'Puis-je créer des sous-titres pour une vidéo YouTube que je n’ai pas mise en ligne ?',
      answer:
        'Non. Cet outil ne fonctionne qu’avec des fichiers, pas avec des liens, et il est destiné aux vidéos que vous avez réalisées ou que vous avez le droit d’utiliser. Pour vos propres vidéos, utilisez le fichier d’origine issu de votre caméra ou de votre logiciel de montage.',
    },
    {
      question: 'Quel fichier YouTube Studio veut-il, SRT ou VTT ?',
      answer:
        'Le SRT est le choix le plus sûr : c’est un format très répandu que YouTube Studio lit. Importez-le avec synchronisation, pour que les lignes correspondent à la parole.',
    },
    {
      question: 'Dois-je me connecter pour créer le fichier de sous-titres ?',
      answer:
        'Non. Vous n’avez besoin d’aucun compte ici. Vous n’avez besoin de votre chaîne YouTube que pour importer le fichier dans YouTube Studio.',
    },
    {
      question:
        'Comment obtenir des sous-titres en anglais pour une vidéo en espagnol ou en hindi ?',
      answer:
        'Réglez Sortie sur Traduire en anglais dans Plus d’options avant de commencer. La transcription ressort en anglais avec les horaires. La traduction est automatique et peut contenir des erreurs ; relisez-la donc avant de la publier comme piste en anglais.',
    },
    {
      question: 'Pourquoi mes sous-titres sont-ils décalés sur YouTube ?',
      answer:
        'Le plus souvent, le fichier a été créé à partir d’une autre version de la vidéo, par exemple avant que le début ne soit coupé. Recréez le fichier à partir de la vidéo exacte que vous avez envoyée. La synchronisation est proche mais pas exacte à l’image près ; une dernière vérification dans YouTube Studio aide donc.',
    },
  ],

  links: [
    {
      label: 'Générateur de sous-titres SRT',
      path: '/srt-subtitle-generator',
      note: 'À quoi ressemble l’intérieur d’un fichier SRT, et comment corriger les lignes avant l’export.',
    },
    {
      label: 'Ajouter des sous-titres à une vidéo',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'D’autres endroits où utiliser le fichier : lecteurs multimédias, logiciels de montage et votre propre page web.',
    },
    {
      label: 'Traduire un audio en anglais',
      path: '/translate-audio-to-english',
      note: 'Du texte en anglais à partir de la parole dans une autre langue, et ce qu’il faut vérifier ensuite.',
    },
    {
      label: 'SRT ou VTT : quel format de sous-titres choisir',
      path: '/guides/srt-vs-vtt',
      note: 'En quoi les deux formats de sous-titres courants diffèrent.',
    },
  ],
};
