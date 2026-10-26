import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Générateur de sous-titres SRT',
  h1: 'Générer des sous-titres SRT à partir d’une vidéo ou d’un fichier audio',
  lead: 'Envoyez une vidéo et téléchargez un fichier .srt prêt à l’emploi, chaque ligne synchronisée sur la parole. Gratuit, sans connexion, et vous pouvez corriger le texte avant l’export.',
  dropKind: 'video',
  dropNoun: 'vidéo',

  whyTitle: 'Ce que contient un fichier SRT',
  why: [
    'Un fichier SRT est du texte brut. Il énumère des séquences numérotées, chacune avec une heure de début, une heure de fin et les mots à afficher à l’écran. La plupart des lecteurs vidéo, des logiciels de montage et des plateformes vidéo peuvent en charger un, ce qui en fait le format de sous-titres le plus sûr pour commencer.',
    'Les sous-titres aident les spectateurs sourds ou malentendants, les personnes qui regardent sans le son et toutes celles qui suivent mieux une langue étrangère à l’écrit. Ils rendent aussi la parole de votre vidéo consultable et citable.',
  ],

  howTitle: 'Comment générer un fichier SRT',
  howToDescription:
    'Envoyez une vidéo, choisissez la langue, vérifiez les lignes et téléchargez les sous-titres au format SRT ou VTT.',
  steps: [
    {
      title: 'Envoyez la vidéo',
      text: 'Déposez votre vidéo dans la zone en haut de cette page ou appuyez sur Choisir un fichier. Un fichier audio fonctionne aussi si vous n’avez besoin que d’un texte horodaté.',
    },
    {
      title: 'Choisissez la langue',
      text: 'Choisissez la langue parlée. L’horodatage par mot est activé par défaut, ce qui donne une synchronisation plus précise des sous-titres.',
    },
    {
      title: 'Vérifiez les lignes',
      text: 'Ouvrez la transcription, lisez à partir de n’importe quel horodatage et corrigez les mots erronés. Supprimez les lignes dont vous ne voulez pas.',
    },
    {
      title: 'Téléchargez le SRT ou le VTT',
      text: 'Choisissez le SRT pour la plupart des lecteurs et des logiciels de montage, ou le VTT pour les pages web. Les deux incluent vos modifications.',
    },
  ],

  formatsTitle: 'Formats de sous-titres et fichiers pris en charge',
  formatsIntro:
    'Envoyez n’importe quel fichier vidéo ou audio et téléchargez les sous-titres en SRT ou en VTT. Voici à quoi ressemble l’intérieur d’un fichier SRT :',
  uploadTitle: 'Fichiers que vous pouvez envoyer',
  accepts: ['MP4', 'MKV', 'MOV', 'WEBM', 'AVI', 'MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'SRT', use: 'séquences numérotées avec horaires, la compatibilité la plus large' },
    { name: 'VTT', use: 'WebVTT pour la vidéo HTML5 et les lecteurs web' },
    { name: 'TXT', use: 'les mêmes mots sans horaires' },
    { name: 'Markdown', use: 'texte avec horodatage' },
    { name: 'JSON', use: 'chaque ligne et son horaire, pour des programmes' },
    { name: 'PDF', use: 'un script imprimable' },
  ],
  exampleLabel: 'Exemple de fichier SRT',
  example: `1
00:00:01,000 --> 00:00:04,200
Bienvenue de nouveau sur la chaîne.

2
00:00:04,500 --> 00:00:07,800
Aujourd’hui, nous voyons comment fonctionnent les sous-titres.`,

  tipsTitle: 'Conseils pour de meilleurs sous-titres',
  tips: [
    {
      title: 'Gardez des lignes courtes.',
      text: 'Un repère courant est de deux lignes d’environ 42 caractères. Les lignes suivent la parole ; les très longues peuvent donc demander à être coupées dans un éditeur de sous-titres.',
    },
    {
      title: 'Regardez avant de publier.',
      text: 'Lisez la vidéo avec les sous-titres activés. Les sous-titres automatiques demandent une vérification humaine, surtout pour les noms, les nombres et le jargon.',
    },
    {
      title: 'Utilisez un indice de vocabulaire.',
      text: 'Listez les noms et les termes techniques dans Plus d’options pour qu’ils soient écrits comme vous le souhaitez.',
    },
    {
      title: 'Choisissez le bon format.',
      text: 'SRT pour les lecteurs, les logiciels de montage et la plupart des formulaires d’envoi. VTT pour la balise vidéo HTML5 et les lecteurs web.',
    },
    {
      title: 'Besoin de sous-titres en anglais ?',
      text: 'Réglez Sortie sur Traduire en anglais dans Plus d’options. La traduction est automatique : relisez-la donc avant de publier.',
    },
  ],

  faqs: [
    {
      question: 'Qu’est-ce qu’un fichier SRT ?',
      answer:
        'SubRip (.srt) est un format de sous-titres en texte brut. Chaque séquence a un numéro, une heure de début et de fin et le texte à afficher. N’importe quel éditeur de texte peut l’ouvrir.',
    },
    {
      question: 'Dois-je choisir le SRT ou le VTT ?',
      answer:
        'Utilisez le SRT pour les lecteurs vidéo, les logiciels de montage et la plupart des formulaires d’envoi. Utilisez le VTT (WebVTT) lorsque vous ajoutez des sous-titres à une page web avec l’élément vidéo HTML5. TranscribeVid exporte les deux à partir de la même transcription.',
    },
    {
      question: 'Incruste-t-il les sous-titres dans ma vidéo ?',
      answer:
        'Non. Vous obtenez un fichier de sous-titres séparé et la vidéo n’est pas modifiée. Incruster les sous-titres dans l’image demande un logiciel de montage vidéo.',
    },
    {
      question: 'Quelle est la précision de la synchronisation ?',
      answer:
        'La synchronisation suit la parole et est généralement proche, mais elle n’est pas exacte à l’image près. Vérifiez la première et la dernière ligne, et ajustez dans un éditeur de sous-titres si vous avez besoin d’une synchronisation exacte.',
    },
    {
      question: 'Puis-je créer des sous-titres dans une autre langue ?',
      answer:
        'Vous pouvez transcrire dans la langue parlée (plus de 50 sont prises en charge) ou traduire la parole en anglais. La traduction vers d’autres langues n’est pas proposée.',
    },
  ],
};
