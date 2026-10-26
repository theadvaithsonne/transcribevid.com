import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Enregistrement de réunion en texte',
  h1: 'Enregistrement de réunion en texte : Zoom, Teams et Google Meet',
  lead: 'Enregistrez la réunion après votre appel, déposez-la ici et obtenez une transcription horodatée que vous pouvez rechercher, citer et transformer en compte rendu. Cela ne coûte rien, ne demande aucun compte et couvre plus de 50 langues.',
  dropKind: 'video',
  dropNoun: 'enregistrement de réunion',

  whyTitle: 'Pourquoi transcrire un enregistrement de réunion',
  why: [
    'Peu de gens réécoutent une réunion d’une heure, mais beaucoup en attendent une seule chose : qui a accepté quoi, et pour quand. Une transcription vous permet de chercher une échéance ou un nom, de retrouver la minute où cela a été dit et de le citer exactement. C’est un meilleur point de départ pour un compte rendu et une liste d’actions que de rejouer l’appel.',
    'Cette page travaille sur un enregistrement qui existe déjà. Elle ne peut pas rejoindre un appel en direct et n’ajoute pas de noms d’intervenants ; elle remplace donc la réécoute, pas la personne qui prend les notes. Les réunions contiennent souvent des détails confidentiels ; sachez donc où va un enregistrement : ici, il est envoyé par une connexion chiffrée et supprimé automatiquement ensuite.',
  ],
  browserWhy: [
    'Peu de gens réécoutent une réunion d’une heure, mais beaucoup en attendent une seule chose : qui a accepté quoi, et pour quand. Une transcription vous permet de chercher une échéance ou un nom, de retrouver la minute où cela a été dit et de le citer exactement. C’est un meilleur point de départ pour un compte rendu et une liste d’actions que de rejouer l’appel.',
    'Cette page travaille sur un enregistrement qui existe déjà. Elle ne peut pas rejoindre un appel en direct et n’ajoute pas de noms d’intervenants ; elle remplace donc la réécoute, pas la personne qui prend les notes. Les réunions contiennent souvent des détails confidentiels : votre navigateur transcrit l’enregistrement sur votre propre appareil, rien n’est envoyé, et rien n’est conservé une fois votre session terminée.',
  ],

  sections: [
    {
      title: 'Où trouver votre enregistrement de réunion',
      paragraphs: [
        'Chaque outil de réunion enregistre à son propre endroit, et les noms de menus, les dossiers et ce que permet votre offre changent selon les versions ; considérez donc ceci comme un guide. Si vous pouvez exporter seulement l’audio, un fichier M4A ou MP3 est plus petit et se lit tout aussi bien. Zoom, Microsoft Teams et Google Meet sont des noms de leurs propriétaires respectifs, et ce site n’a aucun lien avec eux.',
      ],
      bullets: [
        {
          title: 'Zoom.',
          text: 'Un enregistrement local est sauvegardé sur votre ordinateur à la fin de la réunion, généralement sous forme de vidéo MP4 et de fichier audio M4A. Un enregistrement dans le cloud se télécharge depuis la page des enregistrements de votre compte Zoom.',
        },
        {
          title: 'Microsoft Teams.',
          text: 'Après la réunion, l’enregistrement est stocké dans OneDrive ou SharePoint, selon le type de réunion, et un lien apparaît dans la conversation de la réunion. Ouvrez-le là et téléchargez le MP4 si votre compte autorise les téléchargements.',
        },
        {
          title: 'Google Meet.',
          text: 'Les enregistrements sont sauvegardés dans Google Drive, généralement dans un dossier Meet Recordings, et l’organisateur reçoit un lien. Téléchargez le MP4 depuis Drive.',
        },
      ],
    },
    {
      title: 'De la transcription au compte rendu',
      paragraphs: [
        'Une transcription brute n’est pas encore un compte rendu, mais elle permet de le rédiger vite. Une fois la transcription terminée, saisissez un mot comme échéance, accord ou action dans la zone Rechercher dans le texte au-dessus d’elle, ou le nom d’une personne concernée. La zone indique combien de lignes correspondent, et les flèches haut et bas passent de l’une à l’autre. Lisez autour de chaque résultat, lisez cette ligne à partir de son horodatage si elle n’est pas claire, et copiez les lignes dans vos notes avec leurs horaires pour que chacun puisse vérifier l’enregistrement.',
        'Si un nom est ressorti écrit de deux façons, recherchez la mauvaise orthographe, ouvrez Remplacer…, saisissez la bonne et appliquez-la à toutes les lignes d’un coup. Téléchargez le Markdown à coller dans une application de notes, ou le PDF à diffuser. Les lignes portent un horaire mais pas d’étiquette d’intervenant ; saisissez donc les noms pendant la modification, en vous aidant de l’enregistrement pour vérifier qui a parlé.',
      ],
    },
    {
      title: 'Autorisation, règles et précautions',
      paragraphs: [
        'Prévenez tout le monde avant d’enregistrer une réunion et obtenez son autorisation, et suivez les règles de votre organisation sur les enregistrements et les transcriptions. La transcription d’une réunion confidentielle est aussi sensible que l’enregistrement ; conservez-la et partagez-la donc avec le même soin. Cette page ne donne pas de conseil juridique.',
      ],
    },
  ],

  howTitle: 'Comment convertir un enregistrement de réunion en texte',
  howToDescription:
    'Ajoutez l’enregistrement de la réunion, choisissez la langue, attendez la transcription et téléchargez-la sous forme de texte ou de sous-titres.',
  steps: [
    {
      title: 'Ajoutez l’enregistrement',
      text: 'Appuyez sur Choisir un fichier, ou faites glisser l’enregistrement sur la zone ci-dessus. Une vidéo MP4 ou un fichier audio M4A fonctionnent tous deux, et seul le son est utilisé. La zone accepte un enregistrement à la fois et le passe à l’outil d’envoi sur la page suivante, où Ajouter un autre fichier fait entrer le reste d’une journée d’appels.',
    },
    {
      title: 'Choisissez la langue et la qualité',
      text: 'Sur la page suivante, choisissez la langue qu’ont parlée les participants, ou gardez Détecter automatiquement. Standard convient à la plupart des appels. Là où votre appareil les propose, Haute précision et Précision maximale conviennent aux personnes qui parlent vite ou à un mauvais son ; sinon, elles apparaissent grisées avec la raison. Toutes deux sont plus lentes et demandent un téléchargement initial plus gros. Si les participants changent de langue, choisissez la principale et vérifiez les lignes signalées comme incertaines. Appuyez ensuite sur Transcrire.',
    },
    {
      title: 'Attendez la transcription',
      text: 'Les lignes apparaissent au fil du traitement de l’enregistrement, avec une barre de progression et une estimation du temps restant. Une longue réunion prend plus de temps.',
      browser: {
        text: 'Les lignes apparaissent au fil du traitement de l’enregistrement, avec une barre de progression et une estimation du temps restant. C’est votre propre appareil qui fait le travail ; une longue réunion prend donc plus de temps : gardez cette page ouverte jusqu’à la fin.',
      },
    },
    {
      title: 'Recherchez, modifiez et exportez',
      text: 'Saisissez des noms et des mots de décision dans Rechercher dans le texte pour passer d’une ligne à l’autre, lisez une ligne à partir de son horodatage pour la vérifier, et corrigez les erreurs. Téléchargez ensuite le TXT, le Markdown ou le PDF. Ajoutez les noms des intervenants à la main pendant la modification.',
    },
  ],

  formatsTitle: 'Fichiers d’enregistrement de réunion et téléchargements',
  formatsIntro:
    'Les enregistrements Zoom, Teams et Meet sont généralement en MP4 ou en M4A. Les autres fichiers vidéo et audio fonctionnent aussi, et seule la piste sonore est lue.',
  uploadTitle: 'Fichiers d’enregistrement que vous pouvez ajouter',
  accepts: ['MP4', 'M4A', 'MKV', 'MOV', 'WEBM', 'MP3', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'toute la réunion en texte brut' },
    { name: 'Markdown', use: 'des notes horodatées à coller dans une application de notes' },
    { name: 'PDF', use: 'une copie à imprimer ou à diffuser' },
    { name: 'SRT', use: 'des lignes horodatées pour sous-titrer l’enregistrement' },
  ],

  tipsTitle: 'Conseils pour les transcriptions de réunions',
  tips: [
    {
      title: 'Utilisez le fichier audio seul quand il existe.',
      text: 'Il contient la même parole dans un fichier bien plus petit ; il est donc plus rapide à ajouter et à traiter.',
    },
    {
      title: 'Mettez les noms et les termes dans l’indice de vocabulaire.',
      text: 'Dans Plus d’options, listez les personnes, les noms de produits et les acronymes employés pendant la réunion. Ainsi, les noms et les acronymes ressortent comme vous l’attendez.',
    },
    {
      title: 'Attendez-vous à des erreurs avec les voix superposées.',
      text: 'Quand deux personnes parlent en même temps, le logiciel de reconnaissance ne peut pas les séparer. Les lignes dont il n’est pas sûr sont signalées ; relisez-les donc en premier.',
    },
    {
      title: 'Restez sous les limites.',
      text: 'Les enregistrements qui dépassent les limites de taille ou de durée indiquées sur cette page ne peuvent pas être traités ; découpez donc d’abord un très long appel en parties.',
      browser: {
        title: 'Les longs appels prennent plus de temps.',
        text: 'Le site ne fixe aucune limite de durée, mais l’enregistrement d’un atelier d’une journée demande du temps et de la mémoire libre sur votre appareil. Pour lire la première heure plus tôt, découpez le fichier en parties dans un logiciel de montage vidéo.',
      },
    },
    {
      title: 'Partagez la transcription avec soin.',
      text: 'Envoyez-la seulement aux personnes qui étaient dans la réunion ou qui en ont besoin, et supprimez-la quand vous n’en avez plus besoin.',
    },
  ],

  faqs: [
    {
      question:
        'TranscribeVid peut-il rejoindre mon appel Zoom ou Teams et le transcrire en direct ?',
      answer:
        'Non. Il travaille sur un enregistrement que vous sauvegardez après la réunion. Il ne peut pas rejoindre un appel, et ce n’est pas du sous-titrage en direct. Pour des sous-titres en direct, utilisez la fonction de votre outil de réunion.',
    },
    {
      question: 'Une transcription de réunion indique-t-elle qui a dit quoi ?',
      answer:
        'Non. Les lignes portent un horaire mais pas de nom. Ajoutez vous-même les noms pendant la modification, et vérifiez chacun avec l’enregistrement.',
    },
    {
      question: 'Est-il sûr de transcrire ici l’enregistrement d’une réunion confidentielle ?',
      answer:
        'Le serveur reçoit l’enregistrement par une connexion chiffrée et le supprime à la fin de votre session, ou plus tôt si vous appuyez sur Supprimer mes données maintenant. Vérifiez d’abord ce que votre organisation autorise. Ce n’est pas un conseil juridique.',
      browser: {
        answer:
          'L’enregistrement n’est pas envoyé : votre navigateur le transcrit sur votre propre appareil, et l’efface après une période d’inactivité ou quand vous appuyez sur Supprimer mes données maintenant. Une transcription que vous téléchargez est un fichier ordinaire sur votre appareil ; protégez-la donc comme l’enregistrement, et vérifiez ce que votre organisation autorise. Ce n’est pas un conseil juridique.',
      },
    },
    {
      question: 'Quelle durée de réunion puis-je transcrire ?',
      answer:
        '{limits} Les fichiers plus longs ne peuvent pas être traités ; découpez-les donc d’abord.',
      browser: {
        answer:
          'Aucun plafond n’est fixé sur l’enregistrement lui-même, car le travail se fait sur votre propre appareil. Ce qui vous limite, c’est le temps et la mémoire libre : un appel de plusieurs heures est possible, la page vous prévient si votre appareil semble trop lent pour cela, et un navigateur sans prise en charge de WebCodecs peut ne pas venir à bout d’un fichier très long.',
      },
    },
    {
      question: 'Et si les participants changent de langue pendant la réunion ?',
      answer:
        'Choisissez la langue la plus parlée. La reconnaissance suit au mieux la langue principale ; les mots d’une autre langue peuvent donc être mal écrits. Les lignes dont elle n’est pas sûre sont signalées : vérifiez-les avec l’enregistrement.',
    },
  ],

  links: [
    {
      label: 'MP4 en texte',
      path: '/mp4-to-text',
      note: 'Les réglages pour une réunion sauvegardée en vidéo MP4.',
    },
    {
      label: 'M4A en texte',
      path: '/m4a-to-text',
      note: 'Pour le fichier audio seul, plus petit que la vidéo.',
    },
    {
      label: 'Transcription d’entretiens',
      path: '/interview-transcription',
      note: 'Pour une conversation enregistrée en tête à tête, avec des notes sur le consentement et la vérification des citations.',
    },
    {
      label: 'Transcrire une vidéo sans l’envoyer',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Où reste votre enregistrement, et comment le confirmer dans votre navigateur.',
    },
  ],
};
