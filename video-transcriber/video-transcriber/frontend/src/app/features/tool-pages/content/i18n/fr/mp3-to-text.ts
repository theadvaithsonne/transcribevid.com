import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MP3 en texte',
  h1: 'Convertir un MP3 en texte en ligne',
  lead: 'Des épisodes de podcast aux enregistrements de cours en passant par les messages vocaux, le MP3 est le format audio dont la plupart d’entre nous ont des piles. Envoyez un MP3 et obtenez gratuitement une transcription horodatée, sans connexion.',
  dropKind: 'audio',
  dropNoun: 'fichier MP3',

  whyTitle: 'Ce que vous apporte la transcription d’un MP3',
  why: [
    'Le MP3 comprime l’audio dans un petit fichier, ce qui explique pourquoi les podcasts, les dictaphones et les cours téléchargés l’utilisent. Cela aide aussi ici : un MP3 s’envoie vite même avec une connexion lente, et un MP3 d’une heure à 128 kbit/s ne pèse qu’environ 58 Mo.',
    'Une transcription permet de chercher une expression dans un long épisode, de citer exactement une personne interrogée, de rédiger les notes d’émission sans réécouter l’émission, ou de conserver une trace écrite d’une conférence ou d’un message vocal.',
  ],
  browserWhy: [
    'Le MP3 comprime l’audio dans un petit fichier, ce qui explique pourquoi les podcasts, les dictaphones et les cours téléchargés l’utilisent. Cela aide aussi ici : votre navigateur lit un MP3 rapidement, et un MP3 d’une heure à 128 kbit/s ne pèse qu’environ 58 Mo.',
    'Une transcription permet de chercher une expression dans un long épisode, de citer exactement une personne interrogée, de rédiger les notes d’émission sans réécouter l’émission, ou de conserver une trace écrite d’une conférence ou d’un message vocal.',
  ],

  howTitle: 'Comment convertir un MP3 en texte',
  howToDescription:
    'Envoyez le MP3, choisissez la langue parlée, attendez la transcription et téléchargez-la sous forme de texte ou de sous-titres.',
  steps: [
    {
      title: 'Choisissez votre MP3',
      text: 'Déposez le .mp3 dans la zone en haut de cette page ou appuyez sur Choisir un fichier. Dans l’outil d’envoi, vous pouvez en ajouter plusieurs, et chacun devient sa propre transcription.',
    },
    {
      title: 'Choisissez la langue',
      text: 'Sélectionnez la langue parlée ou gardez la détection automatique. Pour obtenir du texte en anglais à partir d’une autre langue, ouvrez Plus d’options et réglez Sortie sur Traduire en anglais.',
    },
    {
      title: 'Attendez la transcription',
      text: 'Le texte apparaît pendant le traitement du fichier, avec une barre de progression. Le plus rapide est rapide, Précision maximale est la plus longue et fait le moins d’erreurs.',
    },
    {
      title: 'Corrigez et téléchargez',
      text: 'Corrigez n’importe quelle ligne, puis téléchargez le TXT à lire, ou le SRT et le VTT si l’audio accompagne une vidéo ou un lecteur web.',
    },
  ],

  formatsTitle: 'MP3 et autres formats audio',
  formatsIntro:
    'Le MP3 est le format audio le plus courant. Ces autres formats audio fonctionnent de la même façon, et les fichiers vidéo sont acceptés aussi.',
  uploadTitle: 'Fichiers audio que vous pouvez envoyer',
  accepts: ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS'],
  downloads: [
    { name: 'TXT', use: 'l’épisode ou la conférence en texte brut' },
    { name: 'Markdown', use: 'des notes d’émission avec horodatage' },
    { name: 'SRT', use: 'des sous-titres pour une version vidéo' },
    { name: 'VTT', use: 'une piste de transcription pour les lecteurs web' },
    { name: 'PDF', use: 'une transcription à imprimer ou à envoyer' },
    { name: 'JSON', use: 'des lignes structurées pour des programmes' },
  ],

  tipsTitle: 'Conseils pour transcrire des fichiers MP3',
  tips: [
    {
      title: 'Envoyez la meilleure copie.',
      text: 'Le MP3 est avec perte et chaque réenregistrement perd un peu plus de détails. Si vous avez encore le WAV ou l’enregistrement d’origine, envoyez-le plutôt.',
    },
    {
      title: 'Évitez les débits très faibles.',
      text: 'La parole résiste bien à la compression, mais les débits très faibles brouillent les consonnes et réduisent la précision.',
    },
    {
      title: 'Découpez les longs épisodes.',
      text: 'Un fichier qui dépasse la limite de durée est refusé. Découpez d’abord un épisode de deux heures en parties dans n’importe quel éditeur audio.',
      browser: {
        text: 'Il n’y a pas de limite de durée, mais un épisode de deux heures prend un moment sur un appareil plus lent. Découpez-le en parties dans n’importe quel éditeur audio pour lire la première partie plus tôt.',
      },
    },
    {
      title: 'Gérez les génériques et la musique.',
      text: 'Gardez Ignorer les silences et la musique activé dans Plus d’options, afin que les jingles et les longues pauses ne produisent pas de mots inventés.',
    },
    {
      title: 'Épelez les invités.',
      text: 'Indiquez une fois l’animateur, les invités, le nom de l’émission et les marques dans l’indice de vocabulaire : ils auront beaucoup plus de chances d’être écrits correctement.',
    },
  ],

  faqs: [
    {
      question: 'Quelle peut être la durée d’un MP3 ?',
      answer:
        '{limits} Un MP3 de 60 minutes à 128 kbit/s pèse environ 58 Mo ; la limite de durée compte donc plus que la limite de taille. Il n’y a aucun quota quotidien ou mensuel.',
      browser: {
        answer:
          'Nous ne fixons aucune limite de taille ni de durée, car le MP3 est transcrit dans votre navigateur, sur votre propre appareil. Un MP3 de 60 minutes à 128 kbit/s pèse environ 58 Mo ; les fichiers plus longs prennent simplement plus de temps, et la page vous prévient sur un appareil plus lent. Il n’y a aucun quota quotidien ou mensuel.',
      },
    },
    {
      question: 'La compression MP3 nuit-elle à la précision ?',
      answer:
        'Pas beaucoup à qualité normale, car la parole est le cas facile pour le MP3. Le bruit, l’écho et les voix qui se chevauchent nuisent bien plus que le format ; préférez donc un original propre quand vous en avez un.',
    },
    {
      question: 'Puis-je transcrire plusieurs fichiers MP3 à la fois ?',
      answer:
        'Oui. Ajoutez-les ensemble et chacun devient sa propre transcription dans votre session, que vous pouvez ouvrir et télécharger séparément.',
    },
    {
      question: 'Puis-je traduire un MP3 en anglais ?',
      answer:
        'Oui. Dans Plus d’options, réglez Sortie sur Traduire en anglais. La traduction est automatique : relisez donc le texte anglais avant de l’utiliser. Les autres langues cibles ne sont pas proposées.',
    },
    {
      question: 'Mon MP3 est-il conservé ?',
      answer:
        'Seulement pendant votre session. Il est supprimé automatiquement à la fin de la session, ou quand vous appuyez sur Supprimer mes données maintenant. Aucun compte n’est nécessaire.',
      browser: {
        answer:
          'Seulement dans ce navigateur : votre MP3 ne quitte jamais votre appareil. Il est supprimé automatiquement après une période d’inactivité, ou quand vous appuyez sur Supprimer mes données maintenant. Aucun compte n’est nécessaire.',
      },
    },
  ],
};
