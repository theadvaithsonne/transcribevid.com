import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Transcrire une vidéo en texte',
  h1: 'Transcrire une vidéo en texte : gratuit, sans inscription, sans quota quotidien',
  browserH1: 'Transcrire une vidéo en texte : gratuit, sans inscription, sans limite, sans envoi de fichier',
  lead: 'Ajoutez une vidéo et récupérez sa parole sous forme de texte, avec une heure sur chaque ligne. Il n’y a aucun compte à créer et aucun quota quotidien : la vidéo suivante peut démarrer dès que celle-ci est terminée.',
  browserLead:
    'Ajoutez une vidéo et récupérez sa parole sous forme de texte, avec une heure sur chaque ligne. Il n’y a aucun compte à créer, aucun quota quotidien et aucune limite de taille de fichier, et la vidéo n’est jamais envoyée : c’est votre propre appareil qui fait le travail.',
  dropKind: 'video',
  dropNoun: 'vidéo',

  whyTitle: 'Ce que « gratuit » devrait vouloir dire quand on transcrit une vidéo',
  why: [
    'De nombreux sites qui annoncent une « transcription vidéo gratuite » vous offrent une minute, ou quelques fichiers, puis vous demandent un compte ou une carte bancaire. Avant d’en choisir un, vérifiez quatre points : faut-il s’inscrire, combien de minutes ou de fichiers sont offerts, quelle taille de fichier est acceptée, et peut-on télécharger le résultat.',
    'Ici, la réponse à chacun est simple. Vous ajoutez la vidéo, il n’y a aucune inscription, aucun décompte quotidien ou mensuel, et la transcription se télécharge en TXT, SRT, VTT, PDF, Markdown ou JSON sans frais. L’outil n’indique pas qui parle et n’accepte pas les liens : vous ajoutez le fichier lui-même.',
  ],
  browserWhy: [
    'De nombreux sites qui annoncent une « transcription vidéo gratuite » vous offrent une minute, ou quelques fichiers, puis vous demandent un compte ou une carte bancaire. Avant d’en choisir un, vérifiez quatre points : faut-il s’inscrire, combien de minutes ou de fichiers sont offerts, quelle taille de fichier est acceptée, et peut-on télécharger le résultat.',
    'Ici, la réponse à chacun est simple. Vous ajoutez la vidéo, il n’y a aucune inscription, aucun décompte quotidien ou mensuel ni limite de taille, et la transcription se télécharge en TXT, SRT, VTT, PDF, Markdown ou JSON sans frais. Comme c’est votre appareil qui fait le travail, sa mémoire est la seule vraie limite : une vidéo très longue peut être trop lourde pour un téléphone, découpez-la donc d’abord en parties. L’outil n’indique pas qui parle et n’accepte pas les liens : vous ajoutez le fichier lui-même.',
  ],

  sections: [
    {
      title: 'Limites gratuites d’autres sites de transcription vidéo, vérifiées en octobre 2026',
      paragraphs: [
        'Ce sont des citations tirées de la page de chaque outil, telle qu’elle se lisait le 28 octobre 2026, et traduites ici à partir des pages en anglais des éditeurs. Les offres changent : consultez la page avant de vous fier à un chiffre. Le guide indiqué à la fin de cette page contient le tableau complet, avec un lien vers chaque source.',
      ],
      bullets: [
        {
          title: 'Riverside.',
          text: '« Transcriptions illimitées gratuites. Aucune inscription requise. » L’outil gratuit accepte les fichiers MP3, WAV, MP4 et MOV, et attribue tout le texte d’un enregistrement à plusieurs intervenants à un seul intervenant.',
        },
        { title: 'VoiceCheap.', text: '« Gratuit pour les fichiers jusqu’à 60 minutes, avec 1 transcription par jour. »' },
        { title: 'RecCloud.', text: '« Notre offre gratuite permet des vidéos d’une durée maximale de 10 minutes. »' },
        { title: 'Caption-X.', text: '« L’offre gratuite couvre 5 transcriptions au total, de 5 minutes maximum chacune. »' },
        { title: 'Maestra.', text: 'Un « aperçu de 1 minute », et « Inscrivez-vous pour télécharger ou exporter votre transcription. »' },
        { title: 'Any2Text.', text: '« 15 premières minutes gratuites », puis $0.035 la minute.' },
      ],
    },
    {
      title: 'Où va votre vidéo pendant sa transcription',
      paragraphs: [
        'La vidéo est envoyée au serveur qui fait fonctionner ce site, transcrite là-bas, et supprimée à la fin de votre session. Elle n’est publiée nulle part ailleurs.',
      ],
      browser: {
        paragraphs: [
          'La vidéo reste sur votre appareil. Votre navigateur la lit, en extrait le son et exécute dessus le modèle de reconnaissance vocale Whisper : aucun fichier n’est envoyé, ni à nous ni à qui que ce soit d’autre.',
          'Seuls les outils sont téléchargés : la page, le modèle de reconnaissance vocale et le moteur qui l’exécute. Le modèle pèse entre 77 Mo environ et un peu plus de 1 Go, selon le niveau de qualité et votre appareil, et il est ensuite conservé dans votre navigateur. Pour le constater vous-même, ouvrez le panneau réseau de votre navigateur pendant la transcription d’une vidéo.',
        ],
      },
    },
    {
      title: 'Quatre niveaux de qualité pour des vidéos différentes',
      paragraphs: [
        'Le plus rapide utilise le petit modèle Base et convient à un brouillon rapide d’une voix claire. Standard utilise un modèle plus grand, et c’est le choix habituel. Haute précision exécute Large v3 Turbo et gère mieux les accents et les pièces bruyantes. Précision maximale exécute le Large v3 complet et fait le moins d’erreurs, mais prend le plus de temps.',
        'Plus le modèle est grand, plus il faut de temps : Le plus rapide demande le moins de temps et Précision maximale le plus. Essayez d’abord Standard, et ne montez d’un niveau que si le texte n’est pas assez bon.',
      ],
      browser: {
        paragraphs: [
          'Le plus rapide utilise le petit modèle Base et convient à un brouillon rapide d’une voix claire. Standard utilise un modèle plus grand, et c’est le choix habituel. Haute précision exécute Large v3 Turbo et gère mieux les accents et les pièces bruyantes. Précision maximale exécute le Large v3 complet et fait le moins d’erreurs, mais prend le plus de temps.',
          'C’est votre appareil qui fait le travail, la vitesse en dépend donc : un ordinateur portable récent est bien plus rapide qu’un ancien téléphone, et sur un téléphone, Le plus rapide est le niveau à utiliser. Sur un ordinateur portable, essayez d’abord Standard, et ne montez d’un niveau que si le texte n’est pas assez bon.',
        ],
      },
    },
  ],

  howTitle: 'Comment transcrire une vidéo en quatre étapes',
  howToDescription: 'Ajoutez la vidéo, choisissez la langue et le niveau de qualité, attendez que le texte apparaisse, puis modifiez-le et téléchargez-le.',
  steps: [
    {
      title: 'Ajoutez la vidéo',
      text: 'Déposez le fichier dans la zone en haut de cette page, ou appuyez sur Choisir un fichier. Un lien vers une vidéo web n’est pas accepté.',
    },
    {
      title: 'Choisissez la langue et la qualité',
      text: 'Indiquez la langue parlée si vous la connaissez, et choisissez un niveau de qualité. Standard est un bon début ; utilisez Haute précision ou Précision maximale pour des accents, du bruit ou une langue comme l’hindi.',
    },
    {
      title: 'Attendez le texte',
      text: 'Les lignes apparaissent une à une, avec une barre de progression et le temps restant.',
      browser: {
        text: 'Les lignes apparaissent une à une, avec une barre de progression et le temps restant. La première fois que vous utilisez un niveau, le modèle est téléchargé une seule fois ; les vidéos suivantes démarrent tout de suite.',
      },
    },
    {
      title: 'Modifiez et téléchargez',
      text: 'Corrigez n’importe quelle ligne dans l’éditeur, puis téléchargez TXT, SRT, VTT, PDF, Markdown ou JSON. Téléchargez avant de partir : rien n’est conservé pour vous après la session.',
      browser: {
        text: 'Corrigez n’importe quelle ligne dans l’éditeur, puis téléchargez TXT, SRT, VTT, PDF, Markdown ou JSON. La transcription reste un moment dans ce navigateur, mais téléchargez ce que vous voulez garder.',
      },
    },
  ],

  formatsTitle: 'Vidéos que vous pouvez ajouter et fichiers que vous récupérez',
  formatsIntro: 'C’est la piste sonore qui est lue, l’image peut donc être de n’importe quelle qualité. Les fichiers audio seuls fonctionnent aussi.',
  uploadTitle: 'Fichiers vidéo que vous pouvez ajouter',
  accepts: ['MP4', 'MOV', 'MKV', 'WEBM', 'AVI', 'M4V', '3GP'],
  downloads: [
    { name: 'TXT', use: 'texte brut, ou une heure sur chaque ligne' },
    { name: 'SRT', use: 'sous-titres pour les logiciels de montage et les lecteurs' },
    { name: 'VTT', use: 'sous-titres pour la vidéo sur le web' },
    { name: 'PDF', use: 'une transcription à imprimer ou à partager' },
    { name: 'Markdown', use: 'des notes avec horodatages' },
    { name: 'JSON', use: 'mots et heures pour les développeurs' },
  ],

  tipsTitle: 'Tirer davantage d’une transcription gratuite',
  tips: [
    {
      title: 'Testez la première minute avant toute la vidéo.',
      text: 'Découpez ou lisez une minute de la vidéo et transcrivez-la. Si le texte est faux, changez la langue ou le niveau de qualité avant de perdre du temps sur le fichier complet.',
    },
    {
      title: 'Vérifiez ce qui est à l’écran autant que ce qui est dans vos oreilles.',
      text: 'Seule la parole est écrite. Les noms qui apparaissent sur une diapositive mais ne sont jamais prononcés ne seront pas dans le texte.',
    },
    {
      title: 'Découpez un très long enregistrement.',
      text: 'Une vidéo de plusieurs heures se gère plus facilement par parties d’une heure environ : vous pouvez commencer à lire plus tôt et une erreur coûte moins cher à refaire.',
      browser: {
        title: 'Découpez un très long enregistrement sur un téléphone.',
        text: 'Il n’y a pas de limite de taille, mais une vidéo de plusieurs heures demande beaucoup de mémoire. Sur un téléphone, des parties d’une heure environ sont bien plus sûres, et sur un ordinateur portable on peut en général aller beaucoup plus loin.',
      },
    },
    {
      title: 'Téléchargez aussi le fichier de sous-titres, pas seulement le texte.',
      text: 'Le fichier SRT conserve le minutage : un seul passage vous donne donc à la fois une transcription à lire et des sous-titres à ajouter à la vidéo.',
    },
  ],

  faqs: [
    {
      question: 'Puis-je coller un lien YouTube, TikTok ou Google Drive au lieu d’un fichier ?',
      answer: 'Non. Cet outil fonctionne avec un fichier que vous ajoutez ou enregistrez. Si la vidéo est la vôtre, utilisez le fichier d’origine ; pour la vidéo de quelqu’un d’autre, vous devez avoir le droit de l’utiliser.',
    },
    {
      question: 'La transcription indiquera-t-elle qui parle ?',
      answer: 'Non. Les lignes ont une heure mais pas de nom d’intervenant. Vous pouvez saisir des noms dans le texte, dans l’éditeur, ce qui est rapide pour un entretien à deux.',
    },
    {
      question: 'N’y a-t-il vraiment aucune limite au nombre de vidéos que je peux transcrire ?',
      answer: 'Il n’y a ni compte, ni abonnement, ni quota quotidien ou mensuel. {limits} Si beaucoup de monde utilise le service, votre vidéo peut attendre un moment dans une file.',
      browser: {
        answer:
          'Il n’y a ni compte, ni abonnement, ni quota quotidien ou mensuel, ni limite de taille. La seule limite est votre appareil : une vidéo très longue prend plus de temps et demande plus de mémoire, un téléphone s’en sort donc mieux avec des parties d’une heure environ. La publicité garde le site gratuit, et aucune n’est affichée pendant la transcription d’une vidéo.',
      },
    },
    {
      question: 'Quel niveau de qualité convient à une longue vidéo ?',
      answer: 'Standard est le choix habituel. Le plus rapide va plus vite mais fait plus d’erreurs ; Haute précision et Précision maximale demandent plus de temps et valent le coup pour les accents, le bruit et des langues comme l’hindi.',
    },
    {
      question: 'La vidéo quitte-t-elle mon ordinateur ?',
      answer: 'Elle est envoyée au serveur qui fait fonctionner ce site et supprimée à la fin de votre session.',
      browser: {
        answer: 'Non. Votre navigateur transcrit la vidéo sur votre propre appareil, et aucun fichier ne nous est envoyé. Seuls le modèle de reconnaissance vocale et son moteur sont téléchargés, une seule fois.',
      },
    },
  ],

  links: [
    {
      label: 'Comparatif des outils gratuits de vidéo en texte',
      path: '/guides/free-video-to-text-tools-compared',
      note: 'Toutes les limites dans un seul tableau, citées depuis la page de chaque outil.',
    },
    {
      label: 'Transcrire une vidéo sans l’envoyer',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Comment le travail reste sur votre appareil et comment le vérifier vous-même.',
    },
    {
      label: 'Comment transcrire une vidéo en texte',
      path: '/guides/how-to-transcribe-video-to-text',
      note: 'Cinq façons de le faire, et celle qui convient à votre vidéo.',
    },
    {
      label: 'Obtenir une transcription plus précise',
      path: '/guides/accurate-transcripts',
      note: 'Habitudes et réglages qui réduisent les erreurs sur n’importe quelle vidéo.',
    },
  ],
};
