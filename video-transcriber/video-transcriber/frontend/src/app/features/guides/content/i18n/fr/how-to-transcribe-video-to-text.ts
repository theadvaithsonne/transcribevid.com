import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Comment transcrire une vidéo en texte : cinq façons, et celle qui convient à votre vidéo',
  lead: 'Vous pouvez obtenir les paroles d’une vidéo sous forme de texte de cinq façons : la transcription que YouTube détient déjà, la dictée vocale, les sous-titres d’un logiciel de montage vidéo, un service en ligne, ou un outil qui fonctionne sur votre propre appareil. Elles diffèrent par leur coût, par le fait d’obtenir ou non une heure sur chaque ligne, et par ce qu’elles exigent de vous au départ. Ce guide explique ce que fait chacune et quand la choisir.',
  readingMinutes: 7,
  toolPath: '/transcribe-video-to-text',
  toolCta: 'Transcrire une vidéo en texte, gratuitement et sans compte',
  blocks: [
    {
      title: 'La réponse courte',
      bullets: [
        {
          title: 'La vidéo est sur YouTube et a des sous-titres :',
          text: 'ouvrez sa transcription sur la page de la vidéo. Cela ne coûte rien et prend une minute, mais elle n’existe que si la vidéo a des sous-titres, et le texte demande une relecture attentive.',
        },
        {
          title: 'Vous avez le fichier vidéo et voulez un texte avec des heures :',
          text: 'utilisez un outil qui accepte un fichier et vous rend du TXT et des fichiers de sous-titres. Les deux dernières façons ci-dessous le font.',
        },
        {
          title: 'Il vous faut seulement quelques citations :',
          text: 'lisez la vidéo et tapez, ou utilisez la dictée vocale. Au-delà de quelques minutes, c’est plus lent que de laisser un logiciel traiter tout le fichier.',
        },
        {
          title: 'Vous voulez des sous-titres pour la même vidéo :',
          text: 'choisissez une façon qui exporte du SRT ou du VTT, pour qu’un seul passage vous donne à la fois la transcription et les sous-titres.',
        },
      ],
    },
    {
      title: 'Ce qu’une bonne transcription demande à votre vidéo',
      paragraphs: [
        'Toutes les façons ci-dessous travaillent à partir de la piste sonore : la qualité du son décide donc de la qualité du texte bien plus que l’image. Une voix proche du micro, une seule à la fois, sans musique dessous, donne un bon résultat. Une pièce avec de l’écho, des personnes qui parlent en même temps ou un fond sonore fort donnent des erreurs avec toutes les méthodes.',
        'Avant de commencer, déterminez trois choses : la langue parlée dans la vidéo, si vous avez besoin d’une heure sur chaque ligne, et la durée de la vidéo. La deuxième vous dit quels formats vous devez pouvoir télécharger ; la troisième vous dit quelles limites gratuites vous bloqueront.',
      ],
    },
    {
      title: 'Façon 1 : utiliser la transcription que YouTube a déjà',
      paragraphs: [
        'De nombreuses vidéos YouTube ont des sous-titres, écrits par leur propriétaire ou générés automatiquement. Sur la page d’une vidéo, ouvrez la description : là où des sous-titres existent, une option pour afficher la transcription apparaît, avec le texte et ses heures, que vous pouvez copier. Si la vidéo est la vôtre, YouTube Studio a une section Sous-titres où vous pouvez vérifier et télécharger les sous-titres. YouTube modifie ces écrans de temps en temps, les libellés peuvent donc différer un peu.',
      ],
      after: [
        'C’est la façon la plus rapide pour une vidéo déjà sur YouTube. Ses limites : elle ne fonctionne qu’avec le lien d’une vidéo qui a des sous-titres, le texte automatique peut être approximatif sur les noms et les mots techniques, et elle n’aide pas pour un fichier sur votre ordinateur ou votre téléphone.',
      ],
    },
    {
      title: 'Façon 2 : lire la vidéo et laisser la dictée vocale écouter',
      paragraphs: [
        'La dictée vocale d’un traitement de texte, comme l’option de saisie vocale du menu Outils de Google Docs, écrit ce que son micro entend. Vous lisez la vidéo sur vos haut-parleurs et il tape.',
        'Elle ne coûte rien, mais elle entend toute la pièce, pas seulement la vidéo. Elle ne donne aucune heure, elle fonctionne en temps réel, donc une vidéo d’une heure prend une heure, et tout ce que le micro manque est perdu. C’est correct pour une citation ou deux et un mauvais choix pour un cours ou un entretien.',
      ],
    },
    {
      title: 'Façon 3 : activer les sous-titres automatiques dans un logiciel de montage vidéo',
      paragraphs: [
        'Certains logiciels de montage vidéo peuvent transcrire la parole d’un clip que vous y placez. Le guide de Microsoft Clipchamp, par exemple, indique d’ouvrir l’onglet des sous-titres, d’activer les sous-titres automatiques, puis de télécharger les sous-titres sous forme de fichier SRT ; la vidéo doit contenir de la parole dans son audio pour que cela fonctionne.',
        'C’est utile quand vous montez de toute façon la vidéo, car les sous-titres se placent sur la timeline. Pour une simple transcription, c’est plus de travail que nécessaire : vous devez charger la vidéo dans le logiciel, et le texte sort sous forme de fichier de sous-titres que vous transformez ensuite en document.',
      ],
    },
    {
      title: 'Façon 4 : utiliser un service de transcription en ligne',
      paragraphs: [
        'Des dizaines de sites transcrivent un fichier que vous leur donnez. La plupart ne sont gratuits que jusqu’à un certain point : quelques minutes, quelques fichiers, ou un aperçu qui vous demande de payer avant de pouvoir télécharger. Les différences qui comptent sont de savoir si un compte est nécessaire, combien de minutes vous obtenez, quelle taille de fichier est acceptée, et si le résultat peut être exporté.',
        'Les services sont le bon choix quand vous avez besoin de ce que les outils simples ne font pas : un nom pour chaque intervenant, un robot qui rejoint une réunion, ou le lien d’une vidéo dont vous n’avez pas le fichier. Notre guide sur les limites gratuites de treize d’entre eux, chacune citée depuis sa propre page, est indiqué plus bas.',
      ],
    },
    {
      title: 'Façon 5 : transcrire le fichier avec TranscribeVid',
      paragraphs: [
        'TranscribeVid prend le fichier vidéo lui-même, sans compte et sans décompte quotidien. Il exécute Whisper, un modèle de reconnaissance vocale ouvert, et rend le texte avec une heure sur chaque ligne.',
        'Il n’accepte pas les liens, n’indique pas qui parle et ne rejoint pas les réunions. Pour ces besoins, utilisez un service de la Façon 4.',
      ],
      browser: {
        paragraphs: [
          'TranscribeVid prend le fichier vidéo lui-même, sans compte, sans décompte quotidien et sans limite de taille. Il exécute Whisper, un modèle de reconnaissance vocale ouvert, dans votre navigateur : la vidéo reste donc sur votre appareil, et le texte revient avec une heure sur chaque ligne.',
          'Il n’accepte pas les liens, n’indique pas qui parle et ne rejoint pas les réunions. Pour ces besoins, utilisez un service de la Façon 4. Comme c’est votre propre appareil qui fait le travail, une longue vidéo est plus lente sur un ancien téléphone que sur un ordinateur portable récent.',
        ],
      },
      steps: [
        { title: 'Ajoutez la vidéo', text: 'Déposez le fichier dans la zone de la page de l’outil, ou appuyez sur Choisir un fichier. MP4, MOV, MKV, WEBM et la plupart des autres fichiers vidéo fonctionnent, tout comme les fichiers audio.' },
        { title: 'Choisissez la langue et la qualité', text: 'Indiquez la langue parlée si vous la connaissez. Standard convient à la plupart des vidéos ; choisissez Haute précision ou Précision maximale pour des accents, du bruit ou l’hindi.' },
        { title: 'Attendez le texte', text: 'Les lignes apparaissent une à une, avec une barre de progression et le temps restant.' },
        { title: 'Modifiez et téléchargez', text: 'Corrigez n’importe quelle ligne dans l’éditeur, puis téléchargez TXT, SRT, VTT, PDF, Markdown ou JSON. Téléchargez ce que vous voulez garder avant de partir.' },
      ],
    },
    {
      title: 'Quelle façon pour quelle vidéo',
      table: {
        caption: 'Les cinq façons côte à côte, telles que décrites dans ce guide',
        head: ['Façon', 'Coût', 'Heures sur chaque ligne', 'Fonctionne avec', 'Idéal pour'],
        rows: [
          ['Transcription YouTube', 'Gratuit', 'Oui', 'Une vidéo YouTube qui a des sous-titres', 'Une copie rapide depuis une vidéo déjà en ligne'],
          ['Dictée vocale', 'Gratuit', 'Non', 'Tout ce que vous pouvez lire à voix haute', 'Quelques citations'],
          ['Sous-titres du logiciel de montage', 'Selon le logiciel', 'Oui, sous forme de sous-titres', 'Un clip chargé dans le logiciel', 'Une vidéo que vous montez de toute façon'],
          ['Service en ligne', 'Gratuit jusqu’à une limite, puis payant', 'En général', 'Des fichiers, et parfois des liens', 'Noms des intervenants, réunions, liens'],
          ['TranscribeVid', 'Gratuit', 'Oui', 'Un fichier vidéo ou audio', 'Un fichier, avec du TXT et des fichiers de sous-titres en retour'],
        ],
      },
    },
    {
      title: 'Corriger le texte avant de l’utiliser',
      paragraphs: [
        'Quelle que soit la façon choisie, relisez le résultat une fois avec la vidéo en lecture. La reconnaissance vocale reconnaît bien les mots courants et trébuche sur ce qui compte le plus pour vous : les noms, les termes de produit, les chiffres et tout ce qui est dit vite.',
      ],
      bullets: [
        { title: 'Noms et termes.', text: 'Cherchez dans le texte chaque nom dont vous savez qu’il est dans la vidéo et corrigez chaque endroit où il apparaît.' },
        { title: 'Chiffres et dates.', text: 'Vérifiez chacun d’eux avec la vidéo ; un chiffre faux passe facilement inaperçu.' },
        { title: 'Quand l’intervenant change.', text: 'Ajoutez un saut de ligne et un nom, car les transcriptions simples n’indiquent pas qui parle.' },
        { title: 'Sous-titres.', text: 'Si vous utilisez un fichier SRT ou VTT, gardez chaque ligne assez courte pour être lue pendant le temps où elle reste à l’écran.' },
      ],
      after: [
        'Pour une liste plus longue d’habitudes qui réduisent les erreurs avant de commencer, consultez le guide pour obtenir une transcription plus précise.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Puis-je transcrire une vidéo en texte sans rien installer ?',
      answer: 'Oui. La transcription YouTube, un service en ligne et TranscribeVid fonctionnent tous dans un navigateur web. Seuls un logiciel de montage vidéo ou un programme de bureau demandent une installation.',
    },
    {
      question: 'Quelle est la façon la plus rapide de transcrire une vidéo d’une heure ?',
      answer: 'Si elle est sur YouTube avec des sous-titres, la transcription y est immédiate. Pour un fichier, un logiciel est bien plus rapide que la frappe ou la dictée vocale, qui prennent toutes deux au moins la durée de la vidéo. Le temps que prend un logiciel dépend de l’outil, du niveau de qualité et, quand il fonctionne sur votre appareil, de la rapidité de cet appareil.',
    },
    {
      question: 'Dois-je d’abord extraire l’audio de la vidéo ?',
      answer: 'Non. Les outils qui acceptent les fichiers vidéo lisent eux-mêmes la piste sonore : vous pouvez donc ajouter un MP4 ou un MOV tel quel. Extraire l’audio d’abord n’aide que si un outil refuse le format de la vidéo.',
    },
    {
      question: 'Comment obtenir le texte avec une heure sur chaque ligne ?',
      answer: 'Utilisez une façon qui exporte des sous-titres ou une transcription horodatée : la transcription YouTube indique des heures, et un outil qui télécharge du SRT ou du VTT donne à chaque ligne une heure de début et de fin. La dictée vocale n’en donne aucune.',
    },
  ],
  links: [
    {
      label: 'Comparatif des outils gratuits de vidéo en texte',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Les limites gratuites de treize outils en ligne, chacune citée depuis sa propre page.',
    },
    {
      label: 'Obtenir une transcription plus précise',
      path: '/guides/accurate-transcripts',
      note: 'Habitudes et réglages qui réduisent les erreurs sur n’importe quelle vidéo.',
    },
    {
      label: 'Créer des sous-titres pour votre vidéo',
      path: '/srt-subtitle-generator',
      note: 'Transformez la même vidéo en fichier SRT pour les lecteurs et les logiciels de montage.',
    },
    {
      label: 'Transcrire une vidéo sans l’envoyer',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Comment le travail reste sur votre appareil et comment le vérifier vous-même.',
    },
  ],
};
