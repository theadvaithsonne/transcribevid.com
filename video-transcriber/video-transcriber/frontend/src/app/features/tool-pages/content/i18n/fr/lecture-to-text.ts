import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Cours en texte',
  h1: 'Cours en texte : transformer un enregistrement en transcription consultable',
  lead: 'Enregistrez le cours, déposez le fichier ici et lisez-le sous forme de texte horodaté : un texte dans lequel vous pouvez chercher un sujet d’examen, que vous pouvez copier dans vos notes et vérifier avec l’enregistrement. Pas de compte, pas de frais et plus de 50 langues.',
  dropKind: 'video',
  dropNoun: 'enregistrement de cours',

  whyTitle: 'Pourquoi transcrire un cours',
  why: [
    'Un cours est facile à suivre et difficile à réviser. On ne peut pas chercher dans un enregistrement la seule définition dont on a besoin, et réécouter une heure pour la trouver prend autant de temps que le cours lui-même. Une transcription vous donne les mots dans l’ordre, avec l’horaire à côté de chaque ligne, pour que vous puissiez sauter à la partie qu’il vous faut.',
    'Elle aide aussi les personnes qui lisent plus facilement qu’elles n’écoutent, qui étudient dans une seconde langue, qui ont manqué un cours, ou qui veulent le texte d’un exposé qu’elles ont donné elles-mêmes. Demandez à votre enseignant avant d’enregistrer, et suivez le règlement de votre établissement sur les enregistrements.',
  ],

  sections: [
    {
      title: 'De la transcription aux notes de cours',
      paragraphs: [
        'Une transcription est une matière première, pas des notes terminées. Voici quatre façons dont les étudiants l’utilisent.',
      ],
      bullets: [
        {
          title: 'Cherchez avant de réviser.',
          text: 'Quand la transcription est terminée, saisissez un terme dans la zone Rechercher dans le texte au-dessus d’elle. La zone compte les lignes correspondantes et les flèches passent de l’une à l’autre ; vous pouvez ainsi lire chacune à partir de son horodatage et réentendre l’explication. Si un mot technique a été écrit de travers partout, Remplacer… corrige toutes les lignes d’un coup.',
        },
        {
          title: 'Construisez votre propre plan.',
          text: 'Lisez le texte une fois, ajoutez vos propres titres et réduisez-le à ce dont vous avez besoin. Reformuler une idée avec vos mots est généralement une meilleure façon de l’apprendre que de la copier.',
        },
        {
          title: 'Vérifiez les noms, les nombres et les formules.',
          text: 'La reconnaissance vocale écrit ce qu’elle entend. Les équations, les symboles et les termes inhabituels demandent souvent des corrections ; vérifiez-les donc avec les diapositives et l’enregistrement.',
        },
        {
          title: 'Listez ce que vous n’avez pas compris.',
          text: 'Copiez dans une liste les horodatages des passages qui vous ont perdu, et apportez-la à votre prochain cours de soutien ou à votre prochaine permanence.',
        },
      ],
    },
    {
      title: 'Vocabulaire technique et autres langues',
      paragraphs: [
        'Les mots propres à une matière sont les plus difficiles pour n’importe quel logiciel de reconnaissance vocale. Avant de commencer, ouvrez Plus d’options et listez dans l’indice de vocabulaire les termes, les noms des théories et des auteurs, ainsi que les abréviations. La transcription les écrit alors plus souvent comme vous les avez écrits.',
        'Si vous étudiez dans une langue qui n’est pas votre langue maternelle, une transcription vous donne un texte à lire à votre rythme et dans lequel chercher des mots. Choisissez la langue du cours, ou gardez Détecter automatiquement. Un cours dans une autre langue peut aussi être transformé en texte anglais : sous Plus d’options, réglez Sortie sur Traduire en anglais. La traduction est moins fiable que la transcription dans la langue d’origine et peut manquer des termes techniques ; vérifiez-la donc avec l’enregistrement.',
      ],
    },
  ],

  howTitle: 'Comment convertir un cours en texte',
  howToDescription:
    'Ajoutez l’enregistrement du cours, réglez la langue et les termes techniques, attendez la transcription et téléchargez-la comme notes.',
  steps: [
    {
      title: 'Ajoutez l’enregistrement du cours',
      text: 'Faites glisser le fichier sur la zone ci-dessus, ou appuyez sur Choisir un fichier. Un fichier d’un dictaphone de téléphone, une vidéo de cours sauvegardée ou un enregistrement d’écran d’un cours en ligne fonctionnent tous, et seul le son est utilisé. La zone accepte un fichier à la fois et le transmet à l’outil d’envoi sur la page suivante, où Ajouter un autre fichier fait entrer les autres séances d’un cursus.',
    },
    {
      title: 'Réglez la langue et la qualité',
      text: 'Sur la page suivante, choisissez la langue du cours. Standard convient à un enregistrement clair. Pour un amphithéâtre qui résonne ou une personne qui parle vite, Haute précision aide si votre appareil peut l’exécuter (le choix est grisé, avec une raison, quand il ne le peut pas). Attendez-vous à un traitement plus lent et à un téléchargement initial plus gros.',
    },
    {
      title: 'Ajoutez les termes techniques, puis lancez',
      text: 'Dans Plus d’options, saisissez les termes clés, les noms et les abréviations dans l’indice de vocabulaire, par exemple cycle de Krebs, bayésien, Dr Okafor. Appuyez ensuite sur Transcrire.',
    },
    {
      title: 'Lisez, corrigez et téléchargez',
      text: 'Lisez des lignes à partir de leurs horodatages pour les vérifier et corrigez les erreurs. Téléchargez ensuite le TXT ou le Markdown pour votre application de notes, ou le PDF à imprimer.',
    },
  ],

  formatsTitle: 'Fichiers d’enregistrement de cours et téléchargements',
  formatsIntro:
    'Les enregistrements de téléphone, les vidéos sauvegardées et les enregistrements d’écran de cours peuvent tous être ajoutés ; seule la piste sonore est lue.',
  uploadTitle: 'Fichiers d’enregistrement que vous pouvez ajouter',
  accepts: ['MP4', 'M4A', 'MP3', 'WAV', 'WEBM', 'MKV', 'MOV'],
  downloads: [
    { name: 'TXT', use: 'du texte brut pour une application de notes' },
    { name: 'Markdown', use: 'du texte avec horaires, facile à restructurer' },
    { name: 'PDF', use: 'une copie d’étude imprimable' },
    { name: 'SRT', use: 'des sous-titres, si le cours est une vidéo que vous partagez' },
  ],

  tipsTitle: 'Conseils pour les enregistrements de cours',
  tips: [
    {
      title: 'Demandez d’abord l’autorisation.',
      text: 'Certains enseignants et établissements n’autorisent pas l’enregistrement. Demandez, et suivez les règles qu’on vous donne.',
    },
    {
      title: 'Enregistrez près de la personne qui parle.',
      text: 'Un enregistreur placé devant la salle vaut généralement mieux qu’un meilleur au fond, car la distance et l’écho font souvent perdre plus de précision que n’importe quel réglage ne peut en regagner.',
    },
    {
      title: 'Découpez les très longues séances.',
      text: 'Si une séance est plus lourde ou plus longue que les limites indiquées sur cette page, découpez-la en parties à la pause avant de l’ajouter.',
      browser: {
        title: 'Les longues séances prennent plus de temps.',
        text: 'Aucune limite de durée n’est fixée, mais un long cours occupe votre appareil un moment et demande de la mémoire libre, et un navigateur qui ne peut pas utiliser WebCodecs peut avoir du mal avec un fichier très long. Le découper à la pause vous donne la première moitié à lire plus tôt.',
      },
    },
    {
      title: 'Gardez les diapositives ouvertes pendant la relecture.',
      text: 'Les titres des diapositives vous donnent un plan tout prêt à confronter aux horodatages.',
    },
    {
      title: 'Téléchargez avant de partir.',
      text: 'Les transcriptions n’existent que pendant votre session. Enregistrez le TXT ou le Markdown avant de fermer la page.',
    },
  ],

  faqs: [
    {
      question: 'Ai-je le droit d’enregistrer un cours et de le transcrire ?',
      answer:
        'Cela dépend de votre enseignant et de votre établissement ; demandez donc avant d’enregistrer et suivez leurs règles. Utilisez la transcription pour votre propre étude, sauf si vous avez l’autorisation de la partager. Ce n’est pas un conseil juridique.',
    },
    {
      question: 'Puis-je transformer automatiquement la transcription d’un cours en notes ?',
      answer:
        'Non. TranscribeVid vous donne les mots, avec un horodatage sur chaque ligne, mais il ne résume pas et n’ajoute pas de titres. Vous construisez les notes à partir du texte, ce qui est aussi une bonne façon d’apprendre la matière.',
    },
    {
      question: 'Cela fonctionne-t-il pour les cours avec des équations ou des termes techniques ?',
      answer:
        'Il écrit les mots qu’il entend ; les termes prononcés ressortent donc généralement bien quand vous les ajoutez à l’indice de vocabulaire. Les symboles et les équations ne sont pas écrits sous forme de formules ; vérifiez-les donc avec vos diapositives.',
    },
    {
      question: 'Quelle durée de cours puis-je transcrire ?',
      answer: '{limits} Un cours plus long doit d’abord être découpé en parties.',
      browser: {
        answer:
          'Il n’y a aucun plafond sur la durée d’un cours. Comme c’est votre propre appareil qui fait le travail, un long cours coûte surtout de la patience et de la mémoire libre, et la page vous prévient quand votre appareil semble trop lent pour cela.',
      },
    },
    {
      question: 'Puis-je transcrire un cours en ligne que j’ai enregistré sur mon écran ?',
      answer:
        'Oui. Un enregistrement d’écran sauvegardé en MP4, MOV ou WebM fonctionne. Seul le son est lu ; le texte des diapositives n’est donc pas inclus. Ajoutez les termes des diapositives à l’indice de vocabulaire.',
    },
  ],

  links: [
    {
      label: 'Vidéo en texte',
      path: '/video-to-text',
      note: 'La page générale pour toute vidéo enregistrée, avec tous les types de fichiers.',
    },
    {
      label: 'MP3 en texte',
      path: '/mp3-to-text',
      note: 'Pour les enregistrements de cours sauvegardés en MP3 sur un téléphone ou un enregistreur.',
    },
    {
      label: 'Traduire un audio en anglais',
      path: '/translate-audio-to-english',
      note: 'Du texte en anglais à partir d’un cours dans une autre langue.',
    },
    {
      label: 'Obtenir une transcription plus précise',
      path: '/guides/accurate-transcripts',
      note: 'Les choix d’audio, de langue et de qualité qui réduisent les erreurs dans un enregistrement difficile.',
    },
  ],
};
