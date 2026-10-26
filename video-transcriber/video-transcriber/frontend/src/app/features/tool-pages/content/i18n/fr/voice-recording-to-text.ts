import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Enregistrement vocal en texte',
  h1: 'Transformer un enregistrement vocal en texte, directement depuis votre navigateur',
  lead: 'Enregistrez avec votre microphone sur la page, ou envoyez un mémo vocal de votre téléphone, et lisez ensuite vos paroles sous forme de texte. Gratuit, sans connexion, dans plus de 50 langues.',
  dropKind: 'audio',
  dropNoun: 'enregistrement vocal',
  record: true,

  whyTitle: 'À quoi cela sert, et ce que ce n’est pas',
  why: [
    'Parler va plus vite que taper ; beaucoup de personnes capturent donc des idées, des notes de réunion, des points de cours et des premiers jets sous forme d’enregistrement vocal, puis les transforment en texte. Cette page est faite pour cela : enregistrez ou envoyez, puis lisez, modifiez et téléchargez le texte.',
    'Ce n’est pas de la dictée en direct. Vous enregistrez, vous arrêtez, et la transcription est réalisée à partir de l’enregistrement entier ; les mots n’apparaissent donc pas pendant que vous parlez encore. En contrepartie, chaque ligne reçoit un horodatage.',
  ],

  howTitle: 'Comment transformer un enregistrement vocal en texte',
  howToDescription:
    'Enregistrez avec votre microphone ou envoyez un mémo vocal, choisissez la langue, attendez la transcription et téléchargez-la.',
  steps: [
    {
      title: 'Enregistrez ou choisissez un fichier',
      text: 'Déposez un mémo vocal dans la zone en haut de cette page (les Mémos vocaux de l’iPhone sont des fichiers M4A) ou appuyez sur Choisir un fichier. Pour enregistrer à la place, appuyez sur Enregistrer avec votre microphone sous la zone, puis sur Enregistrer depuis le microphone, et autorisez l’accès quand votre navigateur le demande.',
    },
    {
      title: 'Arrêtez et choisissez la langue',
      text: 'Si vous enregistrez, appuyez sur Arrêter l’enregistrement quand vous avez terminé. Sélectionnez ensuite la langue parlée ou gardez la détection automatique.',
    },
    {
      title: 'Attendez la transcription',
      text: 'Le texte apparaît ligne par ligne, avec une barre de progression et une estimation du temps restant.',
    },
    {
      title: 'Modifiez et téléchargez',
      text: 'Corrigez n’importe quel mot, puis téléchargez le TXT, le Markdown ou le PDF. Les transcriptions n’existent que dans votre session ; enregistrez donc ce dont vous avez besoin.',
    },
  ],

  formatsTitle: 'Formats de mémos vocaux et téléchargements',
  formatsIntro:
    'Les enregistreurs vocaux des téléphones et des ordinateurs sauvegardent dans des formats différents. Tous ceux-ci fonctionnent.',
  uploadTitle: 'Fichiers d’enregistrement que vous pouvez envoyer',
  accepts: ['M4A', 'MP3', 'WAV', 'AAC', 'OGG', 'OPUS', 'FLAC', '3GP'],
  downloads: [
    { name: 'TXT', use: 'vos paroles en texte brut' },
    { name: 'Markdown', use: 'des notes avec horaires' },
    { name: 'PDF', use: 'une copie imprimable de la note' },
    { name: 'SRT', use: 'des lignes horodatées, si l’enregistrement accompagne une vidéo' },
    { name: 'VTT', use: 'des lignes horodatées pour les lecteurs web' },
    { name: 'JSON', use: 'des lignes structurées pour des programmes' },
  ],

  tipsTitle: 'Conseils pour les enregistrements vocaux',
  tips: [
    {
      title: 'Testez le microphone.',
      text: 'Enregistrez dix secondes et réécoutez-les avant une longue séance.',
    },
    {
      title: 'Parlez à un rythme régulier.',
      text: 'Parlez près du microphone dans une pièce calme. Les ventilateurs, les claviers et le vent sont captés aussi nettement que vous.',
    },
    {
      title: 'Articulez bien les noms et les nombres.',
      text: 'Ajoutez les mots inhabituels à l’indice de vocabulaire dans Plus d’options : ils auront beaucoup plus de chances d’être écrits correctement.',
    },
    {
      title: 'Pas de bouton microphone ?',
      text: 'Certains navigateurs n’autorisent l’enregistrement que sur des pages sécurisées ou après votre autorisation. Enregistrez avec l’application de dictaphone de votre téléphone et envoyez plutôt le fichier.',
    },
    {
      title: 'Pensez aux autres.',
      text: 'Prévenez les personnes quand vous les enregistrez, et obtenez d’abord leur autorisation.',
    },
  ],

  faqs: [
    {
      question: 'S’agit-il de dictée en direct ?',
      answer:
        'Non. Vous enregistrez d’abord et la transcription est réalisée ensuite. Pour des mots qui apparaissent pendant que vous parlez, utilisez plutôt la fonction de dictée de votre téléphone ou de votre ordinateur.',
    },
    {
      question: 'Puis-je l’utiliser sur mon téléphone ?',
      answer:
        'Oui. Ouvrez la page dans le navigateur de votre téléphone et enregistrez sur la page, ou envoyez un fichier de mémo vocal que vous avez déjà sauvegardé.',
    },
    {
      question: 'Quelle peut être la durée d’un enregistrement ?',
      answer:
        '{limits} Les fichiers plus longs sont refusés avant d’être traités ; découpez-les donc d’abord. Il n’y a aucun quota quotidien ou mensuel.',
      browser: {
        answer:
          'Nous ne fixons aucune limite : l’enregistrement est transcrit dans votre navigateur, sur votre propre appareil ; un long enregistrement prend donc simplement plus de temps. La page vous prévient sur un appareil plus lent. Il n’y a aucun quota quotidien ou mensuel.',
      },
    },
    {
      question: 'Distingue-t-il les intervenants ?',
      answer:
        'Non. Les noms ou étiquettes des intervenants ne sont pas ajoutés. Chaque ligne porte un horodatage, et vous pouvez saisir les noms dans le texte pendant la modification.',
    },
    {
      question: 'Mon enregistrement vocal est-il conservé ?',
      answer:
        'Seulement pendant votre session. Il est supprimé à la fin de la session, après une période d’inactivité, ou quand vous appuyez sur Supprimer mes données maintenant. Il n’y a pas de compte.',
      browser: {
        answer:
          'Seulement dans ce navigateur : votre enregistrement ne quitte jamais votre appareil. Il est supprimé après une période d’inactivité, ou quand vous appuyez sur Supprimer mes données maintenant. Il n’y a pas de compte.',
      },
    },
  ],
};
