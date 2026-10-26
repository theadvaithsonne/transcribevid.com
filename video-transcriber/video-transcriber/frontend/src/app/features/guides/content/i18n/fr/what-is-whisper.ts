import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Qu’est-ce que Whisper ? La reconnaissance vocale expliquée',
  lead: 'Whisper est un modèle de reconnaissance vocale open source qu’OpenAI a publié en 2022. Il transforme la parole en texte dans une centaine de langues, et il peut fonctionner sur votre propre ordinateur. Ce guide explique d’où il vient, ce qu’il a appris, comment il fonctionne, où il est fort ou faible, et comment TranscribeVid l’exécute dans votre navigateur.',
  readingMinutes: 9,
  toolPath: '/audio-to-text',
  toolCta: 'Essayer Whisper sur votre propre audio',
  blocks: [
    {
      title: 'Whisper en un paragraphe',
      paragraphs: [
        'Whisper est un réseau de neurones entraîné à écouter la parole et à écrire ce qu’il entend. Vous lui donnez du son ; il renvoie du texte avec des horodatages, et il peut aussi nommer la langue et traduire la parole en anglais. Il existe en plusieurs tailles, d’une version minuscule qui tient sur un téléphone à une version large qui demande un ordinateur puissant.',
        'Ce n’est ni un site web ni un service. C’est un ensemble de fichiers : le modèle et le code pour l’exécuter. Tout le monde peut les télécharger et les utiliser, ce qui explique pourquoi de nombreux outils de transcription gratuits et privés, dont celui-ci, sont construits dessus.',
      ],
    },
    {
      title: 'D’où il vient',
      paragraphs: [
        'OpenAI a publié Whisper en septembre 2022, avec un article de recherche intitulé « Robust Speech Recognition via Large-Scale Weak Supervision ». Le code et les modèles entraînés ont été diffusés sous la licence MIT, l’une des licences open source les plus permissives. Elle permet d’utiliser, de modifier et de distribuer le logiciel, y compris dans des produits commerciaux.',
        'Avant Whisper, la meilleure reconnaissance vocale était surtout enfermée dans les services de grandes entreprises, ou conçue pour une seule langue ou un seul type d’audio. Whisper a changé cela en étant assez bon, assez large et gratuit à exécuter soi-même. OpenAI vend aussi l’accès à la reconnaissance vocale par son propre service web, mais c’est un produit payant distinct. Le modèle que vous exécutez ici dans votre navigateur est le modèle ouvert.',
      ],
    },
    {
      title: 'Ce sur quoi il a été entraîné',
      paragraphs: [
        'Whisper a appris à partir d’environ 680 000 heures d’audio associé à des transcriptions, collectées sur Internet. Environ un tiers de cet audio n’était pas en anglais et couvrait une centaine de langues (la publication en liste 99). Les transcriptions n’ont pas toutes été vérifiées à la main, et c’est ce que désigne la « supervision faible » du titre de l’article.',
        'Deux conséquences pratiques en découlent. Comme l’audio d’entraînement était très varié, avec des microphones, des accents, des pièces et des sujets différents, Whisper se débrouille mieux avec des enregistrements réels que des modèles entraînés sur de la parole propre de studio. Mais la quantité d’audio d’entraînement diffère d’une langue à l’autre ; la précision est donc inégale : elle est généralement la meilleure pour l’anglais et pour d’autres langues très parlées qui avaient beaucoup d’exemples, et plus faible pour les langues peu représentées dans les données.',
      ],
    },
    {
      title: 'Comment il fonctionne, en termes simples',
      paragraphs: [
        'Whisper découpe l’audio en fenêtres de 30 secondes et transforme chacune en une image du son, appelée spectrogramme, qui montre l’intensité de chaque hauteur de son au fil du temps. Le modèle comporte ensuite deux moitiés. Un encodeur étudie cette image. Un décodeur écrit le texte un petit morceau à la fois, comme une personne pourrait écrire une phrase en pensant à ce qui vient ensuite.',
        'Le décodeur écrit aussi des marqueurs spéciaux : la langue qu’il croit entendre, s’il faut transcrire ou traduire, et où chaque phrase commence et finit dans le temps. C’est de là que viennent les horodatages.',
        'Les longs enregistrements sont traités fenêtre par fenêtre. Cette conception est souple, mais elle explique deux habitudes de Whisper : il peut perdre le fil entre les fenêtres, et il peut se répéter quand une fenêtre contient peu de parole. TranscribeVid réduit les deux avec un détecteur de parole qui ignore le silence et la plupart des sons qui ne sont pas de la parole avant que le modèle ne les voie, et avec des contrôles qui repèrent ensuite une partie du texte répété ou inventé.',
      ],
    },
    {
      title: 'Les tailles de modèle, et celle que vous obtenez ici',
      paragraphs: [
        'Whisper existe en plusieurs tailles. Les modèles plus grands font moins d’erreurs, surtout dans le bruit et dans les langues autres que l’anglais, mais ils sont plus lents et demandent plus de mémoire et un téléchargement plus gros. Les quatre choix de qualité de la page d’envoi correspondent à ces tailles ainsi :',
      ],
      table: {
        caption: 'Les tailles de Whisper et les choix sur TranscribeVid',
        head: ['Modèle', 'Paramètres (environ)', 'Où le trouver ici'],
        rows: [
          ['Tiny', '39 millions', 'Plus d’options, Liste des modèles'],
          ['Base', '74 millions', 'Le plus rapide'],
          ['Small', '244 millions', 'Standard'],
          ['Medium', '769 millions', 'Plus d’options, Liste des modèles'],
          ['Large v3 Turbo', '809 millions', 'Haute précision'],
          ['Large v3', '1,55 milliard', 'Précision maximale'],
        ],
      },
      after: [
        'Large v3 est sorti en novembre 2023, et la version Turbo est arrivée plus tard, en 2024. Turbo est un modèle large allégé, beaucoup plus rapide et proche de lui en précision pour de nombreuses langues, ce qui en fait le choix Haute précision. Une limite : OpenAI indique que Turbo n’a pas été entraîné pour la traduction et peut renvoyer la langue d’origine quand on lui demande de traduire ; pour Sortie, Traduire en anglais, choisissez donc plutôt Précision maximale. La liste des modèles contient aussi Distil Large v3, une version distillée plus petite et plus rapide de Whisper large v3, pour l’anglais uniquement. Sous Moteur de reconnaissance, il y a aussi Qwen3 ASR, un moteur différent et expérimental pour les navigateurs de bureau avec WebGPU. Qwen3 ASR n’est pas un modèle Whisper.',
      ],
    },
    {
      title: 'Ce qu’il fait bien',
      bullets: [
        {
          title: 'L’audio du monde réel.',
          text: 'Les enregistrements au téléphone, les cours, les entretiens et les bandes-son de vidéos avec un bruit modéré.',
        },
        {
          title: 'Beaucoup de langues dans un seul modèle.',
          text: 'La même famille de modèles gère l’anglais, l’espagnol, le hindi, l’arabe, le japonais et des dizaines d’autres, et peut souvent trouver la langue toute seule.',
        },
        {
          title: 'La ponctuation et les majuscules.',
          text: 'Il écrit des phrases avec des majuscules et de la ponctuation, au lieu d’une longue chaîne de mots en minuscules.',
        },
        {
          title: 'Les horodatages.',
          text: 'Chaque ligne vient avec une heure de début et de fin, et avec l’horodatage par mot la page peut placer chaque mot.',
        },
        {
          title: 'La traduction vers l’anglais.',
          text: 'Il peut transformer directement la parole d’une autre langue en texte anglais, ce que la page propose sous Sortie, Traduire en anglais. Turbo fait exception : il n’a pas été entraîné pour la traduction ; utilisez donc Précision maximale pour cela.',
        },
      ],
    },
    {
      title: 'Là où il peine',
      paragraphs: [
        'Whisper est impressionnant, et il est aussi faillible. Connaissez ces habitudes avant de vous fier à une transcription.',
      ],
      bullets: [
        {
          title: 'Il peut inventer du texte.',
          text: 'Face au silence, à la musique ou au bruit, il peut écrire des mots fluides que personne n’a prononcés, ou répéter une phrase encore et encore. C’est un comportement connu du modèle, pas un défaut d’un enregistrement particulier.',
        },
        {
          title: 'Les noms, les nombres et les mots rares.',
          text: 'Il écrit un nom comme il le juge le plus probable, et peut échanger des mots qui se ressemblent à l’oreille. Utilisez l’indice de vocabulaire, puis vérifiez les chiffres.',
        },
        {
          title: 'Des langues inégales.',
          text: 'La précision varie selon la langue et l’accent. Un modèle plus grand aide beaucoup pour les langues qui ont moins de données d’entraînement.',
        },
        {
          title: 'Pas d’étiquettes d’intervenants.',
          text: 'Il ne dit pas qui parle, et les voix qui se chevauchent sont souvent fusionnées ou perdues.',
        },
        {
          title: 'Pas en direct.',
          text: 'Il travaille sur un enregistrement fenêtre par fenêtre ; il n’est donc pas conçu pour des sous-titres qui apparaissent pendant que quelqu’un parle.',
        },
      ],
    },
    {
      title: 'Comment TranscribeVid exécute Whisper dans votre navigateur',
      paragraphs: [
        'Le Whisper d’origine est écrit pour des logiciels spécialisés d’apprentissage automatique. Pour l’exécuter dans une page web, les modèles sont convertis dans un format portable appelé ONNX, et une bibliothèque appelée Transformers.js, de Hugging Face, les exécute avec ONNX Runtime. Sur un ordinateur doté de WebGPU, le travail est fait par la puce graphique, ce qui est rapide. Sinon, il s’exécute sur le processeur via WebAssembly, ce qui est plus lent mais fonctionne presque partout.',
        'Pour garder des téléchargements raisonnables, les modèles utilisent des formats de nombres compacts, qui réduisent la taille des fichiers, généralement au prix d’une petite perte de précision. C’est ainsi que le plus grand modèle pèse environ un gigaoctet avec WebGPU (1,8 Go avec WebAssembly) au lieu de plusieurs.',
        'Sur transcribevid.com, l’exécution dans le navigateur a deux conséquences. D’abord la confidentialité : votre fichier multimédia est lu sur votre appareil et n’est pas envoyé, de sorte qu’aucun de nos serveurs ne reçoit jamais votre audio. Ensuite la vitesse : elle dépend de votre appareil, et la première utilisation de chaque niveau de qualité comprend un téléchargement unique du modèle. Le guide sur la transcription sans envoi explique ce qui est téléchargé et comment le vérifier.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Whisper est-il gratuit ?',
      answer:
        'Le modèle et son code sont gratuits et open source sous la licence MIT ; tout le monde peut donc les exécuter. Faire tourner un grand modèle demande un ordinateur capable ou un serveur loué, et OpenAI propose aussi son propre service web payant. Sur transcribevid.com, il s’exécute sur votre appareil ; il n’y a donc rien à payer.',
    },
    {
      question: 'Combien de langues Whisper comprend-il ?',
      answer:
        'Environ une centaine ; la publication en liste 99. La qualité diffère beaucoup de l’une à l’autre. TranscribeVid en propose 61 dans sa liste Langue, et vous pouvez aussi choisir Détecter automatiquement.',
    },
    {
      question: 'Quelle taille de Whisper dois-je choisir ?',
      answer:
        'Commencez par Standard, qui est le modèle Small. Passez à Haute précision pour les accents, le bruit ou les langues autres que l’anglais, et à Précision maximale quand chaque mot compte et que vous pouvez attendre. Le plus rapide ne convient qu’à une parole claire et calme.',
    },
    {
      question: 'Pourquoi Whisper écrit-il parfois des mots là où personne ne parle ?',
      answer:
        'Le modèle est conçu pour toujours produire un texte plausible ; un passage de silence, de musique ou de bruit peut donc lui en faire inventer. Garder Ignorer les silences et la musique activé écarte la plupart de ces passages avant que le modèle ne les voie.',
    },
  ],
  links: [
    {
      label: 'Comment obtenir une transcription plus précise',
      path: '/guides/accurate-transcripts',
      note: 'Les réglages et les habitudes qui font la plus grande différence sur le résultat de Whisper.',
    },
    {
      label: 'Transcrire une vidéo sans l’envoyer',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Ce que votre navigateur télécharge pour exécuter Whisper, et comment vérifier que rien n’est envoyé.',
    },
    {
      label: 'Traduire la parole en anglais',
      path: '/translate-audio-to-english',
      note: 'Utilisez la traduction de Whisper pour obtenir du texte anglais à partir d’une parole dans une autre langue.',
    },
    {
      label: 'Audio en texte',
      path: '/audio-to-text',
      note: 'Déposez un enregistrement et obtenez une transcription horodatée.',
    },
    {
      label: 'Audio hindi en texte (page en anglais)',
      path: '/hindi-audio-to-text',
      note: 'Comment Whisper gère le hindi, y compris une option hinglish en lettres romaines.',
    },
  ],
};
