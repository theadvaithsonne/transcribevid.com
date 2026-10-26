import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'WAV en texte',
  h1: 'Convertir un fichier WAV en texte, gratuitement et avec horodatage',
  lead: 'Le WAV est le format des enregistreurs portables, des enregistreurs d’appels et des séances de studio. Ajoutez le vôtre et lisez les paroles sous forme de texte horodaté, gratuitement, sans connexion et sans avoir à compresser le fichier d’abord.',
  dropKind: 'audio',
  dropNoun: 'fichier WAV',

  whyTitle: 'Pourquoi un fichier WAV se transcrit bien',
  why: [
    'Un fichier WAV stocke généralement le son sans compression ; rien n’a donc été jeté au moment de l’enregistrement. C’est une bonne source pour la reconnaissance vocale : pas d’artefacts de compression, et chaque consonne est toujours dans le fichier. Vous n’avez pas besoin de le transformer d’abord en MP3. TranscribeVid lit le WAV tel quel.',
    'Cette qualité a un prix : la taille. Une stéréo de qualité CD occupe environ 10 Mo par minute ; une heure d’audio dépasse donc un demi-gigaoctet. Cette page est faite pour ces gros fichiers : elle ignore les silences et la plupart des sons qui ne sont pas de la parole (l’option Ignorer les silences et la musique, activée par défaut) et vous donne un texte avec un horodatage sur chaque ligne.',
  ],

  sections: [
    {
      title: 'D’où viennent les enregistrements WAV',
      paragraphs: [
        'Le WAV est le format par défaut du monde de l’audio ; le fichier que vous avez sous les yeux vient donc probablement de l’une de ces sources.',
      ],
      bullets: [
        {
          title: 'Les enregistreurs portables.',
          text: 'Les enregistreurs portables utilisés pour les entretiens, les cours et les notes de terrain sauvegardent souvent en WAV, car il conserve tous les détails du son.',
        },
        {
          title: 'Les enregistreurs d’appels et de réunions.',
          text: 'Les outils d’enregistrement d’appels et les systèmes de conférence exportent souvent en WAV. Si chaque côté d’un appel est sur son propre canal, les deux sont mélangés dans une seule transcription.',
        },
        {
          title: 'Les éditeurs audio.',
          text: 'Des programmes comme Audacity et Adobe Audition exportent en WAV quand vous enregistrez ou mixez un projet, ce qui en fait le fichier naturel à transmettre pour une transcription.',
        },
        {
          title: 'Les dictaphones.',
          text: 'Certains dictaphones numériques écrivent des fichiers WAV que vous pouvez copier directement depuis l’appareil.',
        },
      ],
    },
    {
      title: 'Fréquence d’échantillonnage, profondeur de bits et canaux',
      paragraphs: [
        'Vous n’avez pas besoin de préparer un WAV avant de l’ajouter. Les réglages habituels sont tous lus : 8, 16 ou 24 bits, ou 32 bits à virgule flottante, mono ou stéréo, à 44,1 ou 48 kHz. Le son est mélangé en mono et converti automatiquement pour le modèle de parole.',
        'Une fréquence d’échantillonnage plus élevée ne rend pas une transcription plus précise, car la parole se situe dans la partie basse du spectre sonore. L’endroit où vous placez le microphone compte bien plus que les chiffres inscrits sur le fichier.',
        'Améliorer l’audio, sous Plus d’options, filtre les grondements et le souffle et égalise les voix faibles. Il est activé par défaut, et il se justifie pour un enregistrement réalisé près d’un ventilateur, d’une route ou d’un climatiseur.',
      ],
    },
  ],

  howTitle: 'Comment convertir un fichier WAV en texte',
  howToDescription:
    'Ajoutez le fichier WAV, choisissez la langue parlée et la qualité, attendez la transcription et téléchargez-la sous forme de texte ou de sous-titres.',
  steps: [
    {
      title: 'Déposez le WAV',
      text: 'Ajoutez le fichier .wav dans la zone en haut de cette page : déposez-le ou appuyez sur Choisir un fichier. S’il est encore sur un enregistreur, copiez-le d’abord sur votre ordinateur. La zone accepte un seul fichier ; sur la page suivante, Ajouter un autre fichier met d’autres WAV en file, et chacun obtient sa propre transcription.',
    },
    {
      title: 'Choisissez la langue et la qualité',
      text: 'Sur la page suivante, choisissez la langue parlée, ou laissez Détecter automatiquement pour un enregistrement dans une seule langue. Standard convient à la plupart des paroles. Pour un enregistrement faible ou difficile, Haute précision et Précision maximale sont plus longues et font moins d’erreurs. Appuyez ensuite sur Transcrire.',
      browser: {
        text: 'Sur la page suivante, choisissez la langue parlée, ou laissez Détecter automatiquement pour un enregistrement dans une seule langue. Standard convient à la plupart des paroles. Pour un enregistrement faible ou difficile, essayez Haute précision ou Précision maximale si votre appareil les propose : elles sont plus longues, elles représentent un téléchargement initial plus gros, et elles sont grisées, avec la raison, sur un appareil qui ne peut pas les exécuter. Appuyez ensuite sur Transcrire.',
      },
    },
    {
      title: 'Regardez le texte apparaître',
      text: 'La transcription se remplit ligne par ligne, chaque ligne avec son horaire. Lisez à partir de n’importe quelle ligne pour la comparer à l’enregistrement.',
    },
    {
      title: 'Modifiez et téléchargez',
      text: 'Corrigez les mots erronés, puis téléchargez le TXT à lire, le SRT ou le VTT pour des sous-titres, ou le PDF à imprimer. Rien n’est conservé après votre session ; enregistrez donc ce dont vous avez besoin.',
    },
  ],

  formatsTitle: 'WAV et autres formats audio',
  formatsIntro: 'Le WAV est le format sans perte, et cette zone accepte aussi ces types audio.',
  uploadTitle: 'Fichiers audio que vous pouvez ajouter',
  accepts: ['WAV', 'MP3', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS', '3GP'],
  downloads: [
    { name: 'TXT', use: 'les paroles en texte brut' },
    { name: 'SRT', use: 'des lignes de sous-titres horodatées' },
    { name: 'VTT', use: 'des lignes horodatées pour les lecteurs web' },
    { name: 'PDF', use: 'une copie imprimable' },
    { name: 'Markdown', use: 'des notes avec horaires' },
    { name: 'JSON', use: 'des données pour vos propres outils' },
  ],

  tipsTitle: 'Conseils pour transcrire des enregistrements WAV',
  tips: [
    {
      title: 'Ajoutez-le exactement tel quel.',
      text: 'Convertir d’abord un WAV n’apporte rien, et un MP3 à faible débit peut perdre des détails. Ajoutez le fichier tel qu’il est sorti de l’enregistreur.',
    },
    {
      title: 'Écoutez les deux canaux.',
      text: 'La stéréo est mélangée en mono. Si un microphone est beaucoup plus faible ou plus bruyant que l’autre, le mélange en hérite ; vérifiez donc les deux canaux dans votre lecteur avant un long travail.',
    },
    {
      title: 'Coupez les longs silences.',
      text: 'Les enregistrements de terrain commencent et finissent souvent par des minutes de rien. Les couper dans un éditeur rend le fichier plus petit, et la transcription commence là où la parole commence.',
    },
    {
      title: 'Découpez une très longue séance.',
      text: 'Les enregistrements qui dépassent la limite de taille ou de durée sont refusés ; découpez donc une longue séance à une pause naturelle et transcrivez les parties.',
      browser: {
        title: 'Plusieurs heures demandent plusieurs heures.',
        text: 'Le site ne fixe aucune limite de taille ni de durée, mais un enregistrement de plusieurs heures demande beaucoup de temps et de mémoire libre, et un navigateur ancien peut refuser un fichier très long. Sur un téléphone, découpez-le à une pause naturelle et transcrivez les parties.',
      },
    },
    {
      title: 'Épelez les mots difficiles.',
      text: 'Listez les noms, les lieux et les termes techniques dans l’indice de vocabulaire sous Plus d’options, écrits comme vous voulez les voir.',
    },
  ],

  faqs: [
    {
      question: 'Puis-je transcrire un WAV enregistré pendant un appel téléphonique ?',
      answer:
        'Oui, si l’appel est sauvegardé en fichier WAV et que les deux personnes s’entendent. Les deux canaux sont mélangés dans une seule transcription et les noms des intervenants ne sont pas ajoutés ; saisissez donc les noms dans le texte pendant la modification. Prévenez les personnes que vous enregistrez, et vérifiez les règles de votre pays avant d’enregistrer des appels.',
    },
    {
      question: 'Le WAV est-il plus précis que le MP3 pour la transcription ?',
      answer:
        'Il peut aider un peu, car rien n’a été retiré du son. Mais un MP3 clair se transcrit généralement bien et un WAV bruyant non. Le microphone, la pièce et la proximité de la personne qui parle comptent plus que le format du fichier.',
    },
    {
      question: 'Pourquoi mon fichier WAV est-il si gros, et est-ce important ?',
      answer:
        'Le WAV stocke généralement le son sans compression : environ 10 Mo par minute en stéréo de qualité CD. Les gros fichiers sont plus longs à lire. {limits} Si un fichier dépasse la limite, coupez-le, ou exportez une copie compressée (M4A ou MP3) et utilisez-la.',
      browser: {
        answer:
          'Le WAV stocke généralement le son sans compression : environ 10 Mo par minute en stéréo de qualité CD. Les gros fichiers sont un peu plus longs à lire, mais le format n’est pas le problème : lors de nos essais, un fichier d’environ 2,5 Go a été lu sans difficulté dans un navigateur récent. Le site ne fixe aucune limite de taille ni de durée, car c’est votre propre appareil qui fait le travail ; un très long enregistrement demande donc du temps et de la mémoire libre, et un navigateur ancien peut refuser un fichier très long. Sur un téléphone, découpez-le d’abord.',
      },
    },
    {
      question: 'Gère-t-il les fichiers WAV en 24 bits et à 48 kHz ?',
      answer:
        'Oui. Les réglages WAV habituels, comme 16 ou 24 bits à 44,1 ou 48 kHz, sont lus sans aucune préparation, et le son est converti automatiquement pour le modèle de parole.',
    },
    {
      question: 'Puis-je transcrire plusieurs fichiers WAV d’un seul coup ?',
      answer:
        'Oui, sur la page suivante. La zone de cette page accepte un seul fichier ; là, Ajouter un autre fichier met les autres en file. Chaque fichier obtient sa propre transcription ; une journée entière d’enregistrements peut donc s’enchaîner.',
    },
  ],

  links: [
    {
      label: 'MP3 en texte',
      path: '/mp3-to-text',
      note: 'La même transcription gratuite pour le format compressé dans lequel finissent la plupart des enregistrements vocaux.',
    },
    {
      label: 'Transcription d’entretiens',
      path: '/interview-transcription',
      note: 'Des conseils pour transformer des enregistrements d’entretiens en une transcription propre et citable.',
    },
    {
      label: 'Obtenir une transcription plus précise',
      path: '/guides/accurate-transcripts',
      note: 'Ce qu’il faut changer dans l’enregistrement, la langue et les réglages quand le premier résultat n’est pas assez bon.',
    },
    {
      label: 'Enregistrement de réunion en texte',
      path: '/meeting-recording-to-text',
      note: 'Pour les conférences téléphoniques sauvegardées sous forme d’enregistrement.',
    },
  ],
};
