import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP4 en texte',
  h1: 'Transcrire une vidéo MP4 en texte',
  lead: 'Le MP4 est le format des caméras de téléphone, des enregistreurs d’écran et des exports de réunion. Envoyez le vôtre et obtenez une transcription horodatée, gratuite et sans connexion.',
  dropKind: 'video',
  dropNoun: 'fichier MP4',

  whyTitle: 'Pourquoi les fichiers MP4 sont faciles à transcrire',
  why: [
    'Un MP4 est un conteneur : il réunit l’image et le son. TranscribeVid lit le son et ignore l’image ; il n’y a donc rien à convertir au préalable et aucune étape séparée de MP4 en MP3.',
    'Il convient aux enregistrements qui existent déjà en MP4, comme les vidéos de téléphone, les réunions Zoom ou Teams sauvegardées, les captures d’écran, les webinaires et les enregistrements de cours. Le résultat est un texte avec un horaire sur chaque ligne, prêt à être recherché ou transformé en sous-titres.',
  ],

  howTitle: 'Comment convertir un MP4 en texte',
  howToDescription:
    'Envoyez le MP4, choisissez la langue parlée et la qualité, attendez la transcription et téléchargez-la.',
  steps: [
    {
      title: 'Trouvez le MP4',
      text: 'Repérez le fichier .mp4 sur votre téléphone ou votre ordinateur. Vous n’avez pas besoin de le compresser ni de le raccourcir, sauf s’il dépasse la limite.',
      browser: {
        text: 'Repérez le fichier .mp4 sur votre téléphone ou votre ordinateur. Vous n’avez pas besoin de le compresser ni de le raccourcir au préalable.',
      },
    },
    {
      title: 'Envoyez-le',
      text: 'Déposez le MP4 dans la zone en haut de cette page ou appuyez sur Choisir un fichier. Dans l’outil d’envoi, plusieurs fichiers MP4 peuvent être mis en file d’attente en même temps.',
      browser: {
        title: 'Ajoutez-le',
        text: 'Déposez le MP4 dans la zone en haut de cette page ou appuyez sur Choisir un fichier. Dans l’outil d’envoi, vous pouvez ajouter plusieurs fichiers MP4 ; ils sont transcrits les uns après les autres.',
      },
    },
    {
      title: 'Choisissez la langue et la qualité',
      text: 'Choisissez la langue parlée. Standard est recommandé. Haute précision et Précision maximale sont plus lentes et font moins d’erreurs, et Le plus rapide est rapide pour une voix claire.',
    },
    {
      title: 'Téléchargez le résultat',
      text: 'Récupérez le TXT à lire, le SRT ou le VTT à utiliser comme sous-titres avec le même MP4, ou un PDF à imprimer.',
    },
  ],

  formatsTitle: 'MP4 et autres formats vidéo',
  formatsIntro:
    'Le MP4 est le cas courant, mais le même envoi accepte ces types de vidéo ainsi que les formats audio habituels.',
  uploadTitle: 'Fichiers vidéo que vous pouvez envoyer',
  accepts: ['MP4', 'M4V', 'MOV', 'MKV', 'WEBM', 'AVI', 'WMV', 'FLV', '3GP', 'TS', 'MTS'],
  downloads: [
    { name: 'TXT', use: 'les paroles prononcées en texte brut' },
    { name: 'SRT', use: 'un fichier de sous-titres pour le même MP4' },
    { name: 'VTT', use: 'des sous-titres pour une page web' },
    { name: 'PDF', use: 'une transcription à imprimer ou à partager' },
    { name: 'Markdown', use: 'des notes avec horaires' },
    { name: 'JSON', use: 'des données pour vos propres outils' },
  ],

  tipsTitle: 'Conseils pour transcrire des fichiers MP4',
  tips: [
    {
      title: 'Vérifiez qu’il y a du son.',
      text: 'Un enregistrement d’écran réalisé sans audio ne contient aucune parole à transcrire et donne un résultat vide.',
    },
    {
      title: 'Attention au vent et à la pièce.',
      text: 'Les vidéos de téléphone souffrent du vent, de la distance et de l’écho. Tenez le téléphone plus près, ou ajoutez un microphone externe la prochaine fois.',
    },
    {
      title: 'Réduisez les gros fichiers en exportant l’audio.',
      text: 'Si un MP4 dépasse la limite, exportez uniquement l’audio (M4A ou MP3) depuis votre logiciel de montage. Il est bien plus petit et fonctionne de la même façon.',
      browser: {
        text: 'Un MP4 très long demande beaucoup de mémoire sur un téléphone. Exportez uniquement l’audio (M4A ou MP3) depuis votre logiciel de montage : il est bien plus petit et fonctionne de la même façon.',
      },
    },
    {
      title: 'Gardez le SRT à côté de la vidéo.',
      text: 'De nombreux lecteurs chargent automatiquement un fichier .srt lorsqu’il porte le même nom que la vidéo.',
    },
    {
      title: 'Vérifiez les noms et les nombres.',
      text: 'Les transcriptions automatiques se trompent le plus souvent sur ces éléments. Rechercher et remplacer corrige les répétitions d’un seul coup.',
    },
  ],

  faqs: [
    {
      question: 'Dois-je d’abord convertir le MP4 en MP3 ?',
      answer: 'Non. Envoyez le MP4 tel quel. Le son est lu à partir du fichier pour vous.',
    },
    {
      question: 'Pourquoi mon MP4 a-t-il été refusé ?',
      answer:
        'Les fichiers qui dépassent la limite de taille ou de durée sont refusés avant le traitement. {limits} Découpez la vidéo en parties, ou exportez seulement son audio, puis envoyez-la de nouveau.',
      browser: {
        question: 'Pourquoi mon MP4 n’a-t-il pas fonctionné ?',
        answer:
          'Votre navigateur n’a pas pu lire son son : le fichier est peut-être endommagé, sans piste sonore, ou dans un format audio rare. Exportez l’audio en M4A ou en MP3 depuis votre logiciel de montage et ajoutez ce fichier à la place. Il n’y a pas de limite de taille ni de durée, mais les très longues vidéos demandent assez de mémoire libre.',
      },
    },
    {
      question: 'Puis-je ajouter des sous-titres à mon MP4 avec cet outil ?',
      answer:
        'Vous obtenez un fichier de sous-titres (SRT ou VTT) synchronisé sur la parole. TranscribeVid ne modifie ni ne réencode votre MP4 ; incruster les sous-titres dans l’image demande donc un logiciel de montage vidéo.',
    },
    {
      question: 'Puis-je coller un lien au lieu d’envoyer un fichier ?',
      answer:
        'Non. TranscribeVid fonctionne avec les fichiers que vous envoyez ou enregistrez, pas avec des liens web. Si la vidéo est la vôtre, envoyez le fichier d’origine.',
    },
    {
      question: 'Cela fonctionne-t-il avec Zoom, Teams et les vidéos de téléphone ?',
      answer:
        'Oui, tout MP4 contenant de la parole fonctionne. Les noms des participants ne sont pas ajoutés aux réunions, mais les lignes sont horodatées : vous pouvez donc ajouter les noms pendant la modification.',
    },
  ],
};
