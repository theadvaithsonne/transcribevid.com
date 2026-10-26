import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Traduire un audio en anglais',
  h1: 'Traduire la parole en texte et en sous-titres anglais',
  lead: 'Ajoutez un fichier vidéo ou audio dans une autre langue et obtenez du texte anglais horodaté, ou un fichier de sous-titres en anglais. Gratuit, sans connexion.',
  dropKind: 'video',
  dropNoun: 'vidéo ou audio',

  whyTitle: 'Ce que fait la traduction de la parole en anglais',
  why: [
    'La plupart des reconnaissances vocales écrivent ce qui a été dit dans la langue où cela a été dit. Traduire en anglais est un autre travail. La personne parle en hindi, en espagnol, en allemand ou dans une autre langue prise en charge, et le texte ressort en anglais, avec un horodatage sur chaque ligne. C’est utile quand vous avez besoin de l’essentiel d’un cours, d’un entretien, d’un reportage ou d’une vidéo de famille que vous ne pouvez pas suivre, ou de sous-titres anglais pour une vidéo dans une autre langue.',
    'L’anglais est la seule langue vers laquelle il traduit. Il n’y a pas de traduction vers le français, le hindi ou une autre langue, et le texte écrit n’est pas traduit : seulement la parole de l’enregistrement. Cette page lance l’outil d’envoi avec Sortie réglée sur Traduire en anglais et la langue parlée laissée sur Détecter automatiquement.',
  ],

  sections: [
    {
      title: 'Quelle est la fiabilité de l’anglais, et que vérifier',
      paragraphs: [
        'Traduire est plus difficile que transcrire. L’anglais est produit directement à partir du son, sans texte écrit dans la langue d’origine entre les deux. Il est souvent assez bon pour suivre le sens, mais il peut raccourcir ou reformuler des phrases, manquer des expressions idiomatiques et des plaisanteries, et se tromper sur les noms, les nombres et les mots techniques.',
        'Considérez le résultat comme un brouillon pour comprendre, pas comme une traduction officielle. Pour des contrats, des documents juridiques, médicaux ou d’autres documents importants, faites appel à un traducteur humain, et utilisez une transcription dans la langue d’origine comme point de départ.',
        'Une bonne habitude consiste à réaliser d’abord une transcription ordinaire dans la langue d’origine, puis la version anglaise. Là où les deux semblent différer, l’endroit mérite une écoute plus attentive. Une transcription terminée est conservée quand vous utilisez Retranscrire ; les deux peuvent donc provenir du même fichier.',
      ],
    },
    {
      title: 'Quelles langues et quels choix de qualité traduisent bien',
      bullets: [
        {
          title: 'N’importe quelle langue de la liste.',
          text: 'Plus de 50 langues parlées, de l’afrikaans au gallois, peuvent être traduites en anglais. La qualité varie beaucoup, et elle est la plus faible pour les langues qui disposent de peu de parole enregistrée pour apprendre. Si la parole est déjà en anglais, vous n’avez pas besoin de cette page : utilisez les pages vidéo en texte ou audio en texte.',
        },
        {
          title: 'Nommez la langue, ou laissez-la être détectée.',
          text: 'Laissez Langue sur Détecter automatiquement quand vous n’êtes pas sûr de ce qui est parlé. Si vous la connaissez, la choisir est plus fiable, surtout pour les clips courts ou accentués.',
        },
        {
          title: 'Évitez Haute précision pour la traduction.',
          text: 'Haute précision exécute le modèle Large v3 Turbo. OpenAI, qui a créé Whisper, indique que Turbo n’est pas entraîné pour la traduction et renvoie la langue d’origine même quand la traduction est demandée. Distil Large v3, dans la liste Modèle sous Plus d’options, ne fonctionne qu’en anglais. Pour une traduction, commencez par Standard, et choisissez Précision maximale (Large v3) pour une parole difficile. Medium, également dans cette liste Modèle, est un autre choix fiable.',
          browser: {
            text: 'Haute précision exécute le modèle Large v3 Turbo. OpenAI, qui a créé Whisper, indique que Turbo n’est pas entraîné pour la traduction et renvoie la langue d’origine même quand la traduction est demandée. Distil Large v3, dans la liste Modèle sous Plus d’options, ne fonctionne qu’en anglais. Pour une traduction, commencez par Standard, et choisissez Précision maximale (Large v3) pour une parole difficile si votre appareil la propose. Medium, également dans cette liste Modèle, est un autre choix fiable.',
          },
        },
        {
          title: 'Whisper seulement.',
          text: 'La traduction demande le moteur de reconnaissance Whisper. Le choix expérimental Qwen3 ASR ne peut pas traduire : Traduire en anglais est indisponible tant qu’il est sélectionné, et le choisir remet Sortie sur Transcrire.',
        },
        {
          title: 'Pas de style de transcription.',
          text: 'Le choix Style de la transcription (Hinglish ou Écriture d’origine) ne s’applique pas à une traduction, et il est grisé tant que Traduire en anglais est sélectionné.',
        },
      ],
    },
    {
      title: 'Ce que l’on fait avec des sous-titres et un texte en anglais',
      bullets: [
        {
          title: 'Des sous-titres pour votre propre vidéo.',
          text: 'Téléchargez le SRT ou le VTT. Les lignes en anglais sont synchronisées sur la parole d’origine ; elles peuvent donc être ajoutées à la même vidéo dans un lecteur ou un logiciel de montage.',
        },
        {
          title: 'Comprendre un enregistrement.',
          text: 'Lisez de quoi parle un entretien, un cours ou un reportage avant de décider s’il demande une vraie traduction.',
        },
        {
          title: 'Recherche et journalisme.',
          text: 'Un brouillon en anglais vous aide à décider quels passages faire traduire avec soin, et lesquels citer dans la langue d’origine.',
        },
      ],
    },
  ],

  howTitle: 'Comment traduire la parole en anglais',
  howToDescription:
    'Ajoutez un fichier vidéo ou audio dans une autre langue, vérifiez que Traduire en anglais est sélectionné, attendez le texte anglais et téléchargez-le.',
  steps: [
    {
      title: 'Ajoutez votre enregistrement',
      text: 'Déposez votre enregistrement dans la zone en haut de cette page ou appuyez sur Choisir un fichier. Vous arrivez sur l’outil d’envoi avec Plus d’options ouvert, Sortie réglée sur Traduire en anglais et Langue sur Détecter automatiquement. Choisissez la langue parlée si vous la connaissez.',
    },
    {
      title: 'Choisissez la qualité, puis appuyez sur Transcrire',
      text: 'Standard est un bon début. Pour une parole accentuée, bruyante ou technique, choisissez Précision maximale, qui est plus longue et fait généralement moins d’erreurs. Ne choisissez pas Haute précision pour une traduction : elle utilise un modèle qui n’a pas été entraîné à traduire. Appuyez ensuite sur Transcrire.',
      browser: {
        text: 'Standard est un bon début. Pour une parole accentuée, bruyante ou technique, choisissez Précision maximale si votre appareil la propose (un choix qu’il ne peut pas exécuter est grisé, avec la raison) ; c’est un gros téléchargement initial, elle est plus longue et fait généralement moins d’erreurs. Ne choisissez pas Haute précision pour une traduction : elle utilise un modèle qui n’a pas été entraîné à traduire. Appuyez ensuite sur Transcrire.',
      },
    },
    {
      title: 'Attendez le texte anglais',
      text: 'Les lignes en anglais apparaissent avec leurs horaires. Style de la transcription est grisé, car il ne s’applique qu’aux transcriptions, pas aux traductions.',
    },
    {
      title: 'Vérifiez et téléchargez',
      text: 'Relisez les lignes signalées comme incertaines, comparez les noms et les nombres avec l’audio, puis téléchargez le TXT, le SRT ou le VTT, ou un fichier PDF, Markdown ou JSON.',
    },
  ],

  formatsTitle: 'Des fichiers en entrée, du texte anglais en sortie',
  formatsIntro:
    'La vidéo et l’audio dans de nombreux formats fonctionnent, quelle que soit la langue parlée. Les fichiers que vous téléchargez contiennent le texte anglais.',
  uploadTitle: 'Fichiers que vous pouvez ajouter',
  accepts: ['MP4', 'MP3', 'M4A', 'WAV', 'MKV', 'MOV', 'WEBM'],
  downloads: [
    { name: 'TXT', use: 'du texte anglais à lire' },
    { name: 'SRT', use: 'des sous-titres anglais synchronisés sur la parole' },
    { name: 'VTT', use: 'des sous-titres anglais pour un lecteur web' },
    { name: 'PDF', use: 'une copie imprimable' },
    { name: 'Markdown', use: 'du texte avec titres et horaires' },
    { name: 'JSON', use: 'des lignes et des horaires pour vos propres outils' },
  ],

  tipsTitle: 'Conseils pour de meilleures traductions',
  tips: [
    {
      title: 'Nommez la langue parlée quand vous la connaissez.',
      text: 'La détection automatique convient pour une parole claire, mais une mauvaise supposition sur un clip court donne une mauvaise traduction.',
    },
    {
      title: 'Gardez des clips dans une seule langue.',
      text: 'Un enregistrement qui passe sans cesse d’une langue à l’autre peut perturber la traduction. Découpez-le, ou réalisez d’abord une transcription ordinaire pour voir ce qui a été entendu.',
    },
    {
      title: 'Vérifiez les nombres, les noms et les dates.',
      text: 'Ce sont les détails qui comptent le plus et ceux qui sont le plus souvent faux dans un brouillon traduit.',
    },
    {
      title: 'Testez la première minute.',
      text: 'Relisez la première minute d’anglais avec l’audio avant de vous fier à tout le fichier.',
    },
    {
      title: 'Gardez l’original à côté de l’anglais.',
      text: 'Si vous publiez une citation, gardez la transcription dans la langue d’origine à côté de la version anglaise.',
    },
  ],

  faqs: [
    {
      question: 'Peut-il traduire la parole vers d’autres langues que l’anglais ?',
      answer:
        'Non. L’anglais est la seule langue vers laquelle il traduit. Pour lire la parole dans sa propre langue, réalisez plutôt une transcription ordinaire.',
    },
    {
      question:
        'Pourquoi une transcription traduite est-elle moins exacte qu’une transcription ordinaire ?',
      answer:
        'La traduction est une tâche plus difficile que l’écriture des mots. La parole doit être comprise et reformulée en une seule étape ; des phrases peuvent donc être raccourcies, des expressions idiomatiques et des plaisanteries manquées et des noms mal entendus. Vérifiez tout ce qui est important avec l’audio ou avec une transcription dans la langue d’origine.',
    },
    {
      question: 'Pourquoi ma traduction est-elle ressortie dans la langue d’origine ?',
      answer:
        'La cause probable est le choix de qualité. Haute précision exécute le modèle Large v3 Turbo, qui n’a pas été entraîné à traduire et a tendance à écrire plutôt la langue d’origine. Recommencez avec Standard ou Précision maximale, et vérifiez que Sortie est réglée sur Traduire en anglais.',
    },
    {
      question: 'Puis-je obtenir des sous-titres en anglais pour une vidéo dans une autre langue ?',
      answer:
        'Oui. Après la traduction, téléchargez le SRT ou le VTT. Les lignes en anglais portent la synchronisation de la parole d’origine. Relisez-les avant de publier, et rappelez-vous que la traduction est un brouillon.',
    },
    {
      question: 'Pourquoi ne puis-je pas choisir Traduire en anglais ?',
      answer:
        'Ce n’est pas disponible pour le moteur expérimental Qwen3 ASR. Remettez Moteur de reconnaissance sur Whisper dans Plus d’options et le choix revient.',
    },
  ],

  links: [
    {
      label: 'Audio hindi en texte (page en anglais)',
      path: '/hindi-audio-to-text',
      note: 'Lisez la parole en hindi dans sa propre langue avant de la traduire.',
    },
    {
      label: 'Audio espagnol en texte (page en anglais)',
      path: '/spanish-audio-to-text',
      note: 'Réalisez une transcription en espagnol avec les accents, sans la traduire.',
    },
    {
      label: 'Générateur de sous-titres YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Créez un SRT pour votre propre vidéo et importez-le dans YouTube Studio.',
    },
    {
      label: 'Ajouter des sous-titres à une vidéo',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Que faire du fichier SRT ou VTT une fois que vous l’avez.',
    },
  ],
};
