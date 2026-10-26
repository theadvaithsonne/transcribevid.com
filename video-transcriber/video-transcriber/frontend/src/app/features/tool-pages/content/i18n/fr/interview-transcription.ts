import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Transcription d’entretiens',
  h1: 'Transcription d’entretiens sans compte',
  lead: 'Transformez un entretien enregistré en texte horodaté que vous pouvez rechercher, citer et vérifier avec l’enregistrement. Conçu pour la recherche, le journalisme et les entretiens d’embauche : gratuit, sans connexion, dans plus de 50 langues.',
  dropKind: 'video',
  dropNoun: 'enregistrement d’entretien',

  whyTitle: 'Pourquoi transcrire un entretien',
  why: [
    'Un entretien vaut davantage dès qu’on peut y faire des recherches. Une transcription vous permet de retrouver où un participant a évoqué un sujet, de le citer exactement, de vérifier une citation avec l’enregistrement et de comparer les réponses de plusieurs entretiens. Les chercheurs, les journalistes, les historiens de l’oral et les personnes qui mènent des entretiens d’étude utilisateur ou d’embauche travaillent tous ainsi.',
    'Les entretiens contiennent souvent des détails privés ou sensibles. Ici, l’enregistrement est envoyé par une connexion chiffrée puis supprimé automatiquement. Obtenez le consentement de tous avant d’enregistrer, suivez les règles de votre organisation ou de votre comité d’éthique, et traitez la transcription avec autant de soin que l’enregistrement.',
  ],
  browserWhy: [
    'Un entretien vaut davantage dès qu’on peut y faire des recherches. Une transcription vous permet de retrouver où un participant a évoqué un sujet, de le citer exactement, de vérifier une citation avec l’enregistrement et de comparer les réponses de plusieurs entretiens. Les chercheurs, les journalistes, les historiens de l’oral et les personnes qui mènent des entretiens d’étude utilisateur ou d’embauche travaillent tous ainsi.',
    'Les entretiens contiennent souvent des détails privés ou sensibles ; la destination du fichier compte donc. Votre navigateur transcrit l’enregistrement sur votre propre appareil et rien n’est envoyé. Obtenez le consentement de tous avant d’enregistrer, suivez les règles de votre organisation ou de votre comité d’éthique, et traitez la transcription avec autant de soin que l’enregistrement : le texte téléchargé est un fichier sur votre appareil comme un autre.',
  ],

  sections: [
    {
      title: 'Ce que la transcription vous donne et ne vous donne pas',
      paragraphs: ['Connaissez les limites avant de vous appuyer sur une transcription.'],
      bullets: [
        {
          title: 'Pas d’étiquettes d’intervenants.',
          text: 'Chaque ligne a un horodatage, mais la transcription n’indique pas qui parle. Ajoutez à la main Enquêteur et Participant pendant la modification, en vérifiant avec l’enregistrement.',
        },
        {
          title: 'Une lecture propre, pas strictement mot à mot.',
          text: 'Les logiciels de reconnaissance omettent souvent les bégaiements et certains mots de remplissage comme euh. Si votre étude exige un relevé strictement mot à mot, lisez l’enregistrement en parallèle du texte et ajoutez ce qui manque.',
        },
        {
          title: 'Seulement après l’entretien.',
          text: 'Il travaille sur un enregistrement sauvegardé. Il ne rejoint pas un appel et ne transcrit pas en direct.',
        },
      ],
    },
    {
      title: 'Vérifier une transcription avant de la citer',
      paragraphs: [
        'Avant de publier une citation ou de citer un participant, lisez la ligne à partir de son horodatage et écoutez. Les lignes dont le logiciel n’était pas sûr sont signalées ; commencez donc par là. Vérifiez les noms, les nombres et les dates, ainsi que tout mot qui changerait le sens s’il était faux, comme « peut » et « ne peut pas ». Pour trouver chaque endroit où apparaît un nom ou un terme, saisissez-le dans la zone Rechercher dans le texte au-dessus de la transcription terminée : elle compte les lignes correspondantes et les flèches passent de l’une à l’autre.',
        'Gardez l’enregistrement comme document de référence et traitez la transcription comme une copie de travail. Si vous décrivez votre méthode dans un rapport ou un article, indiquez que la transcription a été réalisée par reconnaissance vocale puis vérifiée à la main.',
      ],
    },
    {
      title: 'Consentement, stockage et anonymat',
      paragraphs: [
        'Dites aux participants comment l’enregistrement et la transcription seront stockés et qui les verra. Si vous avez promis l’anonymat, retirez les noms et les détails qui pourraient identifier quelqu’un avant de partager des extraits. Cette page ne peut pas le faire à votre place, et elle ne donne pas de conseil juridique.',
      ],
    },
  ],

  howTitle: 'Comment transcrire un entretien',
  howToDescription:
    'Ajoutez l’enregistrement de l’entretien, choisissez la langue, ajoutez les noms, attendez la transcription, puis vérifiez-la et téléchargez-la.',
  steps: [
    {
      title: 'Ajoutez l’enregistrement de l’entretien',
      text: 'Appuyez sur Choisir un fichier, ou faites glisser l’entretien sur la zone ci-dessus. L’audio comme la vidéo fonctionnent. Ajoutez ici un entretien, puis utilisez Ajouter un autre fichier sur la page suivante pour le reste de votre série.',
    },
    {
      title: 'Choisissez la langue et la qualité',
      text: 'Sur la page suivante, sélectionnez la langue de l’entretien, ou gardez Détecter automatiquement. Standard convient à une conversation calme en tête à tête. Un écho, une ligne téléphonique ou un fort accent appellent Haute précision là où votre appareil peut l’exécuter ; un appareil qui ne le peut pas affiche ce choix grisé avec une raison. Elle est plus lente et demande un téléchargement initial plus gros.',
    },
    {
      title: 'Ajoutez les noms et les termes, puis lancez',
      text: 'Dans Plus d’options, listez dans l’indice de vocabulaire les noms des participants, leurs organisations et les termes spécialisés, pour qu’ils soient écrits comme vous le voulez. Appuyez ensuite sur Transcrire.',
    },
    {
      title: 'Vérifiez, étiquetez et exportez',
      text: 'Lisez des lignes à partir de leurs horodatages, corrigez les erreurs et ajoutez les étiquettes d’intervenants à la main. Téléchargez ensuite le TXT ou le PDF pour vos dossiers, ou le Markdown ou le JSON si vous avez besoin de lignes horodatées.',
    },
  ],

  formatsTitle: 'Fichiers d’enregistrement d’entretien et téléchargements',
  formatsIntro:
    'Les entretiens viennent de téléphones, d’enregistreurs et d’appels vidéo. N’importe lequel peut être ajouté, et seule la piste sonore est lue.',
  uploadTitle: 'Fichiers d’enregistrement que vous pouvez ajouter',
  accepts: ['MP4', 'MOV', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV'],
  downloads: [
    { name: 'TXT', use: 'du texte brut à lire, à citer et à coder' },
    { name: 'PDF', use: 'une copie à imprimer ou à classer' },
    {
      name: 'Markdown',
      use: 'du texte horodaté pour une application de notes ou un logiciel de codage',
    },
    { name: 'JSON', use: 'des lignes horodatées pour un logiciel d’analyse' },
  ],

  tipsTitle: 'Conseils pour les enregistrements d’entretiens',
  tips: [
    {
      title: 'Placez le microphone près de la personne.',
      text: 'Placez-le près du participant, et utilisez un casque ou un microphone-cravate pour les appels téléphoniques et vidéo. Un microphone à l’autre bout de la pièce ou un lieu qui résonne coûte généralement plus de précision que n’importe quel réglage ne peut en regagner.',
    },
    {
      title: 'Annoncez la date et les noms au début.',
      text: 'Dites qui participe et quand, au début de l’enregistrement. Cela facilite l’étiquetage du fichier et le classement ultérieur de la transcription.',
    },
    {
      title: 'Gardez l’enregistrement d’origine.',
      text: 'Ne supprimez jamais l’audio une fois que vous avez le texte. C’est l’enregistrement qui tranche un doute sur une citation.',
    },
    {
      title: 'Restez sous les limites.',
      text: 'Tout ce qui dépasse les limites indiquées sur cette page est refusé ; découpez donc d’abord un très long entretien à une pause naturelle.',
      browser: {
        title: 'Les longs entretiens prennent plus de temps.',
        text: 'Il n’y a aucun plafond de durée, mais un long enregistrement demande du temps et de la mémoire libre sur votre appareil, et un navigateur sans WebCodecs peut avoir du mal avec un fichier très long. Découpez-le à une pause naturelle si vous préférez commencer par la première partie.',
      },
    },
    {
      title: 'Effacez vos données sur un ordinateur partagé.',
      text: 'Quand vous avez enregistré ce dont vous avez besoin, appuyez sur Supprimer mes données maintenant, afin que la transcription ne reste pas dans la session.',
    },
  ],

  faqs: [
    {
      question: 'Puis-je transcrire ici un entretien confidentiel ?',
      answer:
        'Votre enregistrement est envoyé par une connexion chiffrée et supprimé par le serveur à la fin de la session, ou plus tôt si vous appuyez sur Supprimer mes données maintenant. Avant de vous y fier, vérifiez ce qu’exige votre organisation ou votre comité d’éthique. Ce n’est pas un conseil juridique.',
      browser: {
        answer:
          'Aucun envoi n’a lieu : l’enregistrement reste sur votre appareil pendant que votre navigateur le transcrit, et le navigateur l’efface après une période d’inactivité ou quand vous appuyez sur Supprimer mes données maintenant. Une transcription téléchargée est un fichier ordinaire ; vérifiez donc les règles de votre organisation ou de votre comité d’éthique. Ce n’est pas un conseil juridique.',
      },
    },
    {
      question: 'La transcription de l’entretien comprend-elle les euh et les hum ?',
      answer:
        'Souvent non. La transcription est une lecture propre plutôt qu’un relevé strictement mot à mot, et certains bégaiements et mots de remplissage sont omis. Si vous les voulez tous, lisez l’enregistrement en parallèle du texte et ajoutez-les.',
    },
    {
      question: 'La transcription peut-elle distinguer l’enquêteur du participant ?',
      answer:
        'Non. La transcription n’indique pas qui parle. Saisissez Enquêteur et Participant dans le texte pendant la modification, en vous aidant de l’enregistrement pour vérifier chaque tour de parole.',
    },
    {
      question: 'Quelle durée d’entretien puis-je transcrire ?',
      answer: '{limits} Un entretien plus long peut devoir être découpé.',
      browser: {
        answer:
          'La durée d’un entretien n’est pas plafonnée. C’est votre propre appareil qui fait le travail ; un long entretien prend donc plus de temps et demande de la mémoire libre, et la page vous prévient si votre appareil semble trop lent.',
      },
    },
    {
      question: 'Puis-je utiliser ces transcriptions dans ma recherche ou mon article ?',
      answer:
        'Oui. Vérifiez-les avec l’enregistrement avant de citer quelqu’un, indiquez dans votre méthode qu’une reconnaissance vocale a été utilisée, et suivez les règles de votre établissement ou de votre publication.',
    },
  ],

  links: [
    {
      label: 'Enregistrement de réunion en texte',
      path: '/meeting-recording-to-text',
      note: 'Pour les appels enregistrés, avec des notes sur la façon de transformer une transcription en compte rendu.',
    },
    {
      label: 'Vidéo en texte',
      path: '/video-to-text',
      note: 'La page générale pour toute vidéo enregistrée.',
    },
    {
      label: 'Transcrire une vidéo sans l’envoyer',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Ce qui arrive à un enregistrement dans votre navigateur, et comment le constater vous-même.',
    },
    {
      label: 'Obtenir une transcription plus précise',
      path: '/guides/accurate-transcripts',
      note: 'Les choix d’audio et de réglages qui réduisent les erreurs.',
    },
  ],
};
