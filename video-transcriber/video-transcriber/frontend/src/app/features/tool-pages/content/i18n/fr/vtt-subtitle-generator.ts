import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Générateur de sous-titres VTT',
  h1: 'Générer un fichier de sous-titres WebVTT (.vtt) à partir d’une vidéo',
  lead: 'Ajoutez un fichier vidéo ou audio et téléchargez un fichier de sous-titres WebVTT synchronisé sur la parole. Gratuit, sans connexion, et vous pouvez corriger les lignes avant l’export. Utilisez-le avec l’élément vidéo HTML5 ou n’importe quel lecteur web.',
  dropKind: 'video',
  dropNoun: 'vidéo',

  whyTitle: 'Ce qu’est le WebVTT, et pourquoi le web l’utilise',
  why: [
    'Le WebVTT (.vtt) est le format de sous-titres du web. C’est un fichier en texte brut que les navigateurs comprennent nativement : faites pointer l’élément track d’une vidéo vers un fichier .vtt et les sous-titres apparaissent, sans extension ni script.',
    'Il ressemble beaucoup au SRT, avec quelques différences qui comptent. Un fichier VTT commence par le mot WEBVTT, utilise un point au lieu d’une virgule avant les millisecondes et n’a pas besoin de séquences numérotées. La plupart des lecteurs web le lisent. Si vous ne savez pas quel format il vous faut, le guide sur le SRT et le VTT explique le choix.',
  ],

  sections: [
    {
      title: 'Comment utiliser un fichier VTT sur votre page web',
      paragraphs: [
        'Enregistrez le fichier .vtt à côté de votre vidéo, puis ajoutez un élément track dans l’élément video, par exemple : <track kind="subtitles" src="captions.vtt" srclang="en" label="English" default>. Les attributs font ceci.',
      ],
      bullets: [
        {
          title: 'kind.',
          text: 'Utilisez subtitles pour les paroles prononcées. Utilisez captions quand le fichier décrit aussi d’autres sons, comme la musique ou les rires.',
        },
        {
          title: 'srclang.',
          text: 'La langue du fichier sous forme de code court, par exemple en pour l’anglais ou fr pour le français. Ajoutez un élément track pour chaque langue dont vous disposez.',
        },
        {
          title: 'label et default.',
          text: 'label est le nom affiché dans le menu des sous-titres du lecteur. default active cette piste au chargement de la page.',
        },
      ],
    },
    {
      title: 'Pourquoi les sous-titres ne s’affichent pas : les causes habituelles',
      paragraphs: [
        'Gardez le fichier .vtt sur le même site que la page. Un fichier hébergé sur un autre domaine demande les bons en-têtes d’origine croisée de la part de son serveur, et l’élément video a besoin d’un attribut crossorigin, sinon le navigateur l’ignore silencieusement. Vérifiez aussi que la première ligne du fichier est WEBVTT, et que les sous-titres sont activés dans les commandes du lecteur.',
      ],
    },
    {
      title: 'Ce que fait et ne fait pas ce générateur',
      paragraphs: [
        'Il transforme la parole de votre vidéo en texte horodaté. Les lignes sont coupées aux fins de phrase et aux pauses, en lignes d’environ 42 caractères avec deux lignes au plus, et le fichier ne contient que du texte horodaté. Il ne traduit pas vers d’autres langues (sauf l’anglais, grâce à Sortie dans Plus d’options), n’ajoute pas de noms d’intervenants, ne crée ni mise en forme ni repères de chapitres, et n’incruste pas les sous-titres dans l’image. Le WebVTT lui-même prend en charge la mise en forme et les chapitres, et vous pouvez les ajouter à la main dans un éditeur de texte.',
      ],
    },
  ],

  howTitle: 'Comment générer un fichier de sous-titres VTT',
  howToDescription:
    'Ajoutez une vidéo, choisissez la langue, vérifiez les lignes et téléchargez les sous-titres sous forme de fichier WebVTT.',
  steps: [
    {
      title: 'Ajoutez votre vidéo',
      text: 'Placez une vidéo dans la zone en haut de cette page : déposez-la ou appuyez sur Choisir un fichier. Un fichier de son seul fonctionne aussi, si le texte horodaté est tout ce qu’il vous faut. Sur la page suivante, Ajouter un autre fichier en fait entrer d’autres.',
    },
    {
      title: 'Choisissez la langue',
      text: 'Sur la page suivante, choisissez la langue parlée, ou laissez Détecter automatiquement activé. Gardez Horodatage par mot activé dans Plus d’options : le début et la fin de chaque ligne suivent alors les mots. Appuyez ensuite sur Transcrire.',
    },
    {
      title: 'Vérifiez les lignes',
      text: 'Parcourez la transcription, lisez à partir d’un horodatage pour la vérifier et corrigez les mots erronés. Supprimez les lignes que vous ne voulez pas dans les sous-titres.',
    },
    {
      title: 'Téléchargez le VTT',
      text: 'Choisissez VTT parmi les options de téléchargement. Vos modifications sont incluses. Le SRT est disponible à partir de la même transcription si un lecteur en a besoin.',
    },
  ],

  formatsTitle: 'Le format VTT et les fichiers pris en charge',
  formatsIntro:
    'Ajoutez n’importe quel fichier vidéo ou audio et téléchargez du WebVTT. Voici à quoi ressemble l’intérieur d’un fichier VTT :',
  uploadTitle: 'Fichiers que vous pouvez ajouter',
  accepts: ['MP4', 'WEBM', 'MOV', 'MKV', 'M4V', 'MP3', 'WAV', 'M4A'],
  downloads: [
    { name: 'VTT', use: 'WebVTT pour l’élément vidéo HTML5 et les lecteurs web' },
    {
      name: 'SRT',
      use: 'séquences numérotées, pour la plupart des lecteurs et des logiciels de montage',
    },
    { name: 'TXT', use: 'les mêmes mots sans horaires' },
    { name: 'Markdown', use: 'texte avec horodatage' },
    { name: 'JSON', use: 'chaque ligne et son horaire, pour des programmes' },
    { name: 'PDF', use: 'un script imprimable' },
  ],
  exampleLabel: 'Exemple de fichier WebVTT',
  example: `WEBVTT

00:00:00.800 --> 00:00:03.600
Bonjour à tous, et bienvenue.

00:00:04.000 --> 00:00:07.300
Dans cette vidéo, nous mettons en place le projet de zéro.

00:00:07.700 --> 00:00:10.900
Commençons par la structure des dossiers.`,

  tipsTitle: 'Conseils pour les fichiers WebVTT',
  tips: [
    {
      title: 'Testez dans un vrai navigateur.',
      text: 'Ouvrez votre page, lancez la lecture et activez les sous-titres dans les commandes de la vidéo. Faites-le dans plusieurs navigateurs avant de publier.',
    },
    {
      title: 'Utilisez le bon code de langue.',
      text: 'Réglez srclang sur un code valide comme en, fr ou hi. Un mauvais code peut amener le lecteur à nommer ou à choisir la piste de travers.',
    },
    {
      title: 'Lisez les lignes à vitesse réelle.',
      text: 'Lisez la vidéo sans le son et avec les sous-titres, et vérifiez que chaque ligne reste assez longtemps à l’écran pour être lue.',
    },
    {
      title: 'Écrivez les noms comme vous les voulez.',
      text: 'Mettez les noms de marques et les termes techniques dans l’indice de vocabulaire de Plus d’options avant de commencer, afin qu’ils sortent correctement dans chaque ligne.',
    },
  ],

  faqs: [
    {
      question: 'En quoi un fichier VTT diffère-t-il d’un fichier SRT ?',
      answer:
        'Un fichier VTT commence par la ligne WEBVTT, écrit les horaires avec un point (00:00:01.000) là où le SRT utilise une virgule (00:00:01,000), et n’a pas besoin de numéros de séquence. Les navigateurs lisent le VTT dans l’élément vidéo, alors que le SRT demande un lecteur ou un script qui le prenne en charge.',
    },
    {
      question: 'Comment ajouter un fichier VTT à une vidéo HTML ?',
      answer:
        'Enregistrez le fichier .vtt à côté de la vidéo et ajoutez un élément track dans l’élément video, avec kind réglé sur subtitles, src pointant vers le fichier, srclang réglé sur le code de langue et un label pour le menu.',
    },
    {
      question: 'Quels lecteurs lisent les fichiers VTT ?',
      answer:
        'Tous les principaux navigateurs lisent le VTT par l’élément vidéo, et la plupart des lecteurs vidéo web le lisent aussi. Certains lecteurs de bureau et logiciels de montage préfèrent le SRT. Pour ceux-là, téléchargez le SRT à partir de la même transcription.',
    },
    {
      question: 'Le fichier VTT peut-il inclure des chapitres ou une mise en forme ?',
      answer:
        'Le fichier que produit TranscribeVid ne contient que du texte horodaté. Le WebVTT lui-même prend en charge la mise en forme et les chapitres, que vous pouvez ajouter à la main dans un éditeur de texte.',
    },
    {
      question: 'Pourquoi mon fichier VTT n’apparaît-il pas dans le lecteur ?',
      answer:
        'Les causes courantes sont une première ligne qui n’est pas WEBVTT, un fichier sur un autre domaine sans les bons en-têtes d’origine croisée, un srclang ou un kind erroné, ou des sous-titres désactivés dans le lecteur. Ouvrez le fichier dans un éditeur de texte et vérifiez la première ligne.',
    },
  ],

  links: [
    {
      label: 'Générateur de sous-titres SRT',
      path: '/srt-subtitle-generator',
      note: 'La même transcription sous forme de fichier SRT numéroté, avec un exemple détaillé.',
    },
    {
      label: 'SRT ou VTT : quel format de sous-titres choisir',
      path: '/guides/srt-vs-vtt',
      note: 'Un regard côte à côte sur les deux formats et sur l’endroit où chacun fonctionne.',
    },
    {
      label: 'Ajouter des sous-titres à une vidéo',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'De la transcription aux sous-titres publiés, pour le web et pour d’autres lecteurs.',
    },
    {
      label: 'WebM en texte',
      path: '/webm-to-text',
      note: 'Pour les enregistrements d’écran et de navigateur, le format qui convient le mieux à un fichier VTT.',
    },
  ],
};
