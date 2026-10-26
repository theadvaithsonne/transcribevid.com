import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WebM en texte',
  h1: 'Transcrire un enregistrement WebM en texte',
  lead: 'Le WebM est le format qu’enregistrent les navigateurs et les enregistreurs d’écran. Ajoutez votre vidéo ou votre audio WebM et obtenez une transcription horodatée, gratuite, sans connexion et sans conversion préalable.',
  dropKind: 'video',
  dropNoun: 'fichier WebM',

  whyTitle: 'Ce que contient un fichier WebM',
  why: [
    'Le WebM est un conteneur adapté au web. Il contient généralement de la vidéo VP8, VP9 ou AV1 avec du son Opus ou Vorbis. TranscribeVid ne lit que le son ; le codec vidéo employé n’a donc aucune importance, et un WebM qui ne contient que de l’audio fonctionne tout aussi bien.',
    'L’Opus, le format sonore qu’utilisent la plupart des fichiers WebM, a été conçu pour la voix, ce qui fait de ces enregistrements une bonne source pour une transcription. Le résultat est un texte avec un horaire sur chaque ligne, prêt à être recherché, cité ou transformé en sous-titres.',
  ],

  sections: [
    {
      title: 'D’où viennent les fichiers WebM',
      paragraphs: [
        'La plupart des fichiers WebM sont créés par le navigateur lui-même, ce qui explique qu’ils apparaissent dès que quelqu’un enregistre quelque chose en ligne.',
      ],
      bullets: [
        {
          title: 'Les enregistreurs d’écran et de navigateur.',
          text: 'De nombreuses extensions d’enregistrement d’écran et enregistreurs web sauvegardent en WebM, car c’est le format qu’un navigateur peut enregistrer directement.',
        },
        {
          title: 'Les enregistreurs vocaux en ligne.',
          text: 'Un site qui enregistre votre microphone vous donne souvent un fichier audio .webm. Il peut ressembler à un fichier vidéo, mais il ne contient que du son.',
        },
        {
          title: 'Les applications web que vous créez ou testez.',
          text: 'Les pages qui enregistrent avec la fonction MediaRecorder du navigateur produisent généralement du WebM dans Chrome. Firefox fait de même pour la vidéo, mais ses enregistrements de son seul sont souvent en Ogg, que cette page lit aussi.',
        },
      ],
    },
    {
      title: 'Une particularité des fichiers WebM enregistrés',
      paragraphs: [
        'Un WebM enregistré en direct dans le navigateur n’a souvent aucune durée totale inscrite dans le fichier. Certains lecteurs affichent alors une durée inconnue ou ne permettent pas d’avancer, ce qui peut ressembler à un fichier endommagé. Le son lui-même est intact, et la transcription en est faite normalement.',
        'Si un enregistrement échoue vraiment, la cause est généralement plus simple : le microphone était éteint, et il n’y a donc aucune parole dedans. Lisez le fichier avec le volume monté avant de chercher une autre raison.',
      ],
    },
  ],

  howTitle: 'Comment convertir un WebM en texte',
  howToDescription:
    'Ajoutez le fichier WebM, choisissez la langue parlée, vérifiez les lignes et téléchargez la transcription sous forme de texte ou de sous-titres WebVTT.',
  steps: [
    {
      title: 'Ajoutez le WebM',
      text: 'Déposez le .webm sur la zone en haut de cette page ou appuyez sur Choisir un fichier. Un WebM qui ne contient que du son s’ajoute de la même façon. Pour plusieurs enregistrements, ajoutez le premier ici et les autres avec Ajouter un autre fichier sur la page suivante.',
    },
    {
      title: 'Choisissez la langue',
      text: 'Sur la page suivante, choisissez la langue parlée, ou gardez Détecter automatiquement pour un enregistrement dans une seule langue. La qualité Standard convient à une parole claire captée par un bon microphone. Appuyez ensuite sur Transcrire.',
    },
    {
      title: 'Vérifiez les lignes',
      text: 'Regardez le texte arriver ligne par ligne. Ouvrez la transcription, lisez à partir de n’importe quel horodatage et corrigez les mots qui sont faux.',
    },
    {
      title: 'Téléchargez le résultat',
      text: 'Récupérez le TXT à lire ou à rechercher. Un WebM a sa place sur le web ; le VTT est donc le fichier de sous-titres naturel pour lui. Le SRT et le PDF sont là aussi.',
    },
  ],

  formatsTitle: 'WebM et autres formats vidéo',
  formatsIntro: 'Le WebM est l’un des nombreux types de vidéo et d’audio que cette zone accepte.',
  uploadTitle: 'Fichiers que vous pouvez ajouter',
  accepts: ['WEBM', 'MP4', 'MKV', 'MOV', 'OGG', 'OPUS', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'TXT', use: 'les paroles prononcées en texte brut' },
    { name: 'VTT', use: 'des sous-titres pour le même WebM sur une page web' },
    { name: 'SRT', use: 'des sous-titres pour les lecteurs et les logiciels de montage' },
    { name: 'Markdown', use: 'des notes avec horaires' },
    { name: 'JSON', use: 'chaque ligne et son horaire, pour des programmes' },
    { name: 'PDF', use: 'une transcription à imprimer ou à partager' },
  ],

  tipsTitle: 'Conseils pour transcrire des enregistrements WebM',
  tips: [
    {
      title: 'Activez le microphone avant d’enregistrer.',
      text: 'Les enregistreurs d’écran ne capturent souvent que l’image, sauf si vous cochez l’option microphone ou son du système. Sans son, il n’y a rien à transcrire.',
    },
    {
      title: 'Attendez-vous à une seule piste vocale.',
      text: 'Si vous avez enregistré un onglet de réunion en même temps que votre propre microphone, tout le monde se retrouve sur la même piste. Il n’y a pas d’étiquettes d’intervenants ; ajoutez donc les noms pendant la modification.',
    },
    {
      title: 'Utilisez le VTT pour le web.',
      text: 'L’élément vidéo d’un navigateur lit les sous-titres VTT grâce à l’élément track. Il ne lit pas le SRT ; choisissez donc le VTT pour un WebM sur votre propre page.',
    },
    {
      title: 'Coupez les très longs enregistrements.',
      text: 'Les fichiers qui dépassent la limite de taille ou de durée sont refusés ; découpez donc d’abord un long WebM en parties.',
      browser: {
        title: 'Les longs enregistrements prennent plus de temps.',
        text: 'Le site ne fixe aucune limite de taille ni de durée. Une longue capture d’écran demande tout de même du temps et de la mémoire libre, et un navigateur ancien peut refuser un fichier très long ; sur un téléphone, découpez-le donc d’abord en parties.',
      },
    },
    {
      title: 'Listez les noms et les commandes.',
      text: 'Pour une démonstration de logiciel, mettez les noms de produits, les commandes et les acronymes dans l’indice de vocabulaire afin qu’ils soient écrits comme vous les écrivez.',
    },
  ],

  faqs: [
    {
      question:
        'Pourquoi ne puis-je pas lire mon WebM sur mon téléphone, et puis-je quand même le transcrire ?',
      answer:
        'Certains anciens téléphones et lecteurs ne peuvent pas ouvrir le WebM. Cela n’a pas d’importance ici : TranscribeVid n’a besoin que du son ; vous pouvez donc quand même ajouter le fichier et obtenir une transcription.',
    },
    {
      question: 'Puis-je transcrire un WebM contenant uniquement de l’audio ?',
      answer:
        'Oui. Certains enregistreurs sauvegardent des fichiers de son seul avec l’extension .webm. Ils sont lus comme n’importe quel autre fichier audio.',
    },
    {
      question: 'Est-ce important que mon WebM utilise VP8, VP9 ou AV1 ?',
      answer:
        'Non. L’image est ignorée. Ce qui compte, c’est que le fichier ait une piste sonore dans un format courant comme l’Opus.',
    },
    {
      question: 'Comment utiliser les sous-titres avec un WebM sur ma propre page web ?',
      answer:
        'Téléchargez le fichier VTT, enregistrez-le à côté de la vidéo et faites pointer vers lui un élément track placé dans l’élément vidéo. La page du générateur de sous-titres VTT montre à quoi ressemble le fichier et le balisage exact.',
    },
    {
      question: 'Pourquoi mon enregistrement d’écran a-t-il donné une transcription vide ?',
      answer:
        'Il ne contient très probablement aucune parole : le microphone était éteint ou seuls les sons du système ont été enregistrés. Si vous entendez des personnes parler mais n’obtenez aucun texte, gardez Améliorer l’audio activé dans Plus d’options et essayez un réglage de qualité supérieur.',
    },
  ],

  links: [
    {
      label: 'Générateur de sous-titres VTT',
      path: '/vtt-subtitle-generator',
      note: 'Ce que contient un fichier WebVTT et comment le rattacher à une vidéo sur votre propre page.',
    },
    {
      label: 'Ajouter des sous-titres à une vidéo',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Tout le parcours de l’enregistrement aux sous-titres publiés, pas à pas.',
    },
    {
      label: 'Enregistrement de réunion en texte',
      path: '/meeting-recording-to-text',
      note: 'Pour les appels et les webinaires enregistrés, y compris la façon de sortir l’enregistrement de l’outil de réunion.',
    },
    {
      label: 'MP4 en texte',
      path: '/mp4-to-text',
      note: 'Le même service pour le MP4, le format vidéo le plus courant.',
    },
  ],
};
