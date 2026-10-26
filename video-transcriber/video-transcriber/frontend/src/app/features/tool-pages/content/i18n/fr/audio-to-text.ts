import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Audio en texte',
  h1: 'Transformer un audio en texte sans créer de compte',
  lead: 'Déposez un podcast, un entretien, un cours ou une note vocale et obtenez une transcription horodatée que vous pouvez rechercher, modifier et télécharger. Gratuit, illimité et dans plus de 50 langues.',
  dropKind: 'audio',
  dropNoun: 'fichier audio',
  record: true,

  whyTitle: 'Quand la transcription audio en texte vaut la peine',
  why: [
    'L’audio est le média le plus difficile à parcourir. On ne peut ni le rechercher, ni le survoler, ni le citer sans le réécouter. Une transcription vous permet de retrouver la minute où quelque chose a été dit, d’extraire des citations exactes et de lire une conversation d’une heure en quelques minutes.',
    'Les usages typiques : notes d’émission de podcast, entretiens pour le journalisme ou la recherche, histoire orale, notes vocales, brouillons dictés et enregistrements de cours ou de conférences. Ne transcrivez que des enregistrements que vous avez réalisés ou que vous avez le droit d’utiliser.',
  ],

  howTitle: 'Comment convertir un audio en texte',
  howToDescription:
    'Ajoutez un fichier audio ou enregistrez-en un, choisissez la langue, attendez la transcription et téléchargez-la.',
  steps: [
    {
      title: 'Ajoutez votre audio',
      text: 'Déposez un fichier audio dans la zone en haut de cette page ou appuyez sur Choisir un fichier. Pour en enregistrer un nouveau, appuyez sur Enregistrer avec votre microphone sous la zone.',
    },
    {
      title: 'Choisissez la langue',
      text: 'Sélectionnez la langue parlée, ou gardez la détection automatique. Standard est un bon début pour une voix claire. Le plus rapide est rapide, Précision maximale est la plus longue et fait le moins d’erreurs.',
    },
    {
      title: 'Attendez le texte',
      text: 'Les lignes apparaissent au fur et à mesure de la reconnaissance. Améliorer l’audio, activé par défaut, filtre les grondements et le souffle et égalise les voix faibles.',
    },
    {
      title: 'Relisez et exportez',
      text: 'Écoutez n’importe quelle ligne à partir de son horodatage, corrigez les erreurs, puis téléchargez la transcription dans le format dont vous avez besoin.',
    },
  ],

  formatsTitle: 'Fichiers audio pris en charge et téléchargements',
  formatsIntro:
    'Les formats audio courants fonctionnent. Les fichiers vidéo sont acceptés aussi, et seul leur son est utilisé.',
  uploadTitle: 'Fichiers audio que vous pouvez envoyer',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'texte propre pour des notes et des brouillons' },
    { name: 'Markdown', use: 'texte avec horaires, prêt pour une application de notes' },
    { name: 'PDF', use: 'une transcription à imprimer' },
    { name: 'SRT', use: 'lignes horodatées pour des sous-titres' },
    { name: 'VTT', use: 'lignes horodatées pour les lecteurs web' },
    { name: 'JSON', use: 'chaque ligne et son horaire, pour des programmes' },
  ],

  tipsTitle: 'Conseils pour des transcriptions audio précises',
  tips: [
    {
      title: 'Approchez-vous du microphone.',
      text: 'L’écho et la distance comptent généralement plus que le format du fichier. Une pièce calme et un microphone proche valent mieux que n’importe quel réglage.',
    },
    {
      title: 'Une seule voix à la fois.',
      text: 'Les voix qui se chevauchent, la musique sous la parole et un fort bruit de fond causent la plupart des erreurs.',
    },
    {
      title: 'Envoyez l’original.',
      text: 'Réenregistrer un fichier en plus petit supprime des détails. Utilisez l’original ou la copie de meilleure qualité dont vous disposez.',
    },
    {
      title: 'Utilisez un indice de vocabulaire.',
      text: 'Les noms, les marques et les termes techniques sont ce que les logiciels de reconnaissance se trompent le plus souvent. Listez-les dans Plus d’options.',
    },
    {
      title: 'Demandez avant d’enregistrer.',
      text: 'Obtenez l’autorisation avant d’enregistrer ou de transcrire la voix d’autres personnes, et vérifiez les règles locales sur l’enregistrement des appels.',
    },
  ],

  faqs: [
    {
      question: 'Quels formats audio puis-je convertir en texte ?',
      answer:
        'MP3, WAV, M4A, AAC, FLAC, OGG et OPUS. Les fichiers vidéo comme MP4 et MKV fonctionnent aussi, car seul le son est utilisé.',
    },
    {
      question: 'Puis-je enregistrer de l’audio directement sur la page ?',
      answer:
        'Oui, dans les navigateurs qui autorisent l’accès au microphone. Appuyez sur Enregistrer depuis le microphone, autorisez l’accès quand on vous le demande, puis arrêtez. L’enregistrement est transcrit après l’arrêt, pas pendant que vous parlez.',
    },
    {
      question: 'Cela fonctionne-t-il pour un entretien à deux personnes ?',
      answer:
        'Oui, la parole des deux personnes est transcrite. Les noms ou étiquettes des intervenants ne sont pas ajoutés, mais chaque ligne porte un horodatage et vous pouvez saisir les noms dans le texte pendant la modification.',
    },
    {
      question: 'Quelle peut être la durée de l’audio ?',
      answer:
        '{limits} Les fichiers plus longs ou plus lourds sont refusés avant d’être traités ; découpez-les donc d’abord. Il n’y a aucun quota quotidien ou mensuel.',
      browser: {
        answer:
          'Nous ne fixons aucune limite : l’audio est transcrit dans votre navigateur, sur votre propre appareil ; les longs enregistrements prennent donc simplement plus de temps et demandent assez de mémoire libre. La page vous prévient sur un appareil plus lent. Il n’y a aucun quota quotidien ou mensuel.',
      },
    },
    {
      question: 'Mon audio est-il conservé ?',
      answer:
        'Les fichiers ne sont conservés que pendant votre session et sont supprimés automatiquement à sa fin, ou immédiatement quand vous appuyez sur Supprimer mes données maintenant. Il n’y a pas de compte.',
      browser: {
        answer:
          'Seulement dans ce navigateur : votre audio ne quitte jamais votre appareil. Il est supprimé automatiquement après une période d’inactivité, ou immédiatement quand vous appuyez sur Supprimer mes données maintenant. Il n’y a pas de compte.',
      },
    },
  ],
};
