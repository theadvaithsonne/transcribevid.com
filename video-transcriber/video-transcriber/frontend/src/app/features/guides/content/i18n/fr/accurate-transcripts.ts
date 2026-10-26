import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Comment obtenir une transcription plus précise',
  lead: 'La précision dépend d’abord du son, puis de trois choix que vous maîtrisez : la langue, le niveau de qualité et un indice de vocabulaire. Ce guide montre ce qu’il faut changer avant d’enregistrer, quels réglages aident, comment repérer les erreurs qui restent, et ce que la reconnaissance vocale ne sait absolument pas faire.',
  readingMinutes: 10,
  toolPath: '/video-to-text',
  toolCta: 'Transcrire une vidéo avec les meilleurs réglages',
  blocks: [
    {
      title: 'Ce qui détermine la précision d’une transcription',
      paragraphs: [
        'La reconnaissance vocale écoute, un peu comme vous. Si une personne parle clairement, près du microphone, dans une pièce calme, dans une langue que le modèle connaît bien, la transcription est généralement très bonne. Si le son est lointain, bruyant, plein d’écho ou saturé de voix, même une personne doit se concentrer, et le logiciel fait plus d’erreurs.',
        'Cela donne un ordre de priorités simple. Réglez d’abord l’audio, car rien en aval ne peut récupérer des mots qui n’ont jamais été captés. Indiquez ensuite la langue au programme. Choisissez ensuite un niveau de qualité adapté à la difficulté. Donnez-lui ensuite les mots inhabituels qu’il ne peut pas deviner. Enfin, vérifiez le résultat, car aucune transcription n’est parfaite.',
      ],
    },
    {
      title: 'Améliorer l’enregistrement lui-même',
      paragraphs: [
        'Quelques minutes de soin au moment d’enregistrer valent plus que n’importe quel réglage ensuite.',
      ],
      bullets: [
        {
          title: 'Approchez-vous.',
          text: 'Placez le microphone à une main ou deux de la bouche de la personne qui parle. Un téléphone tenu près vaut mieux qu’un ordinateur portable de l’autre côté de la table.',
        },
        {
          title: 'Choisissez une pièce calme et feutrée.',
          text: 'Les rideaux, la moquette et les canapés absorbent l’écho. Les murs nus et les grandes pièces vides brouillent les mots. Éteignez les ventilateurs, la climatisation et les notifications.',
        },
        {
          title: 'Évitez la musique sous la voix.',
          text: 'La musique de fond est difficile à séparer de la parole. Ajoutez-la après la transcription, pas avant.',
        },
        {
          title: 'Une seule voix à la fois.',
          text: 'Les voix qui se chevauchent sont le cas le plus difficile. Demandez aux gens de s’attendre, et utilisez un microphone par personne quand c’est possible.',
        },
        {
          title: 'Ne vous souciez pas de la fréquence d’échantillonnage.',
          text: 'Les modèles de parole lisent le son à 16 kHz en mono, et la page convertit automatiquement n’importe quel fichier à ce format. Une fréquence plus élevée ou un mixage surround n’aide pas ; la distance, le bruit et le niveau, si.',
        },
        {
          title: 'Évitez la compression excessive.',
          text: 'Les fichiers à très faible débit, comme un message vocal comprimé sur une connexion faible, perdent des détails dont le modèle a besoin. Utilisez l’enregistrement d’origine quand vous l’avez.',
        },
      ],
    },
    {
      title: 'Indiquez-lui la langue',
      paragraphs: [
        'La page peut détecter la langue toute seule, et pour un long enregistrement en anglais clair elle tombe généralement juste. Mais pour les clips courts, les forts accents et les enregistrements qui mélangent des langues, la détection peut se tromper, et une mauvaise supposition rend toute la transcription médiocre. Choisir la langue dans la liste Langue prend un clic et supprime le risque.',
        'Si la page ne peut pas identifier la langue avec certitude, elle le dit et vous demande de choisir celle que vous entendez. Faites-le et relancez. Pour une parole qui passe d’une langue à l’autre, comme le hindi et l’anglais, choisissez la langue principale et vérifiez les passages dans l’autre.',
      ],
    },
    {
      title: 'Choisissez le bon niveau de qualité',
      paragraphs: [
        'Les quatre choix de qualité exécutent des tailles différentes de la même famille de modèles. Un modèle plus grand fait moins d’erreurs avec les accents, le bruit, les autres langues et les mots rares, mais il est plus long et son premier téléchargement est plus gros.',
      ],
      table: {
        caption: 'Les choix de qualité et quand utiliser chacun',
        head: ['Choix', 'Idéal pour', 'Compromis'],
        rows: [
          [
            'Le plus rapide',
            'Une parole claire dans un enregistrement calme, des brouillons rapides',
            'Le plus d’erreurs des quatre sur un audio difficile',
          ],
          [
            'Standard',
            'La plupart des vidéos et des enregistrements vocaux (le choix de départ habituel)',
            'Un bon équilibre entre vitesse et précision',
          ],
          [
            'Haute précision',
            'Les accents, le bruit de fond, la parole non anglaise',
            'Plus lent, téléchargement plus gros',
          ],
          [
            'Précision maximale',
            'Un audio difficile où chaque mot compte',
            'Le plus lent, le plus gros téléchargement',
          ],
        ],
      },
      after: [
        'Une bonne habitude est de commencer par Standard sur un court échantillon de votre enregistrement, de le lire, et de monter d’un niveau seulement si les erreurs vous gênent. Sous Plus d’options, vous pouvez aussi choisir dans la liste complète des modèles. Sur certains appareils, Haute précision et Précision maximale sont grisées, avec la raison affichée, comme « nécessite 8 Go » ou « utilisez un ordinateur pour cette taille », car les plus grands modèles demandent plus de mémoire. Chaque choix plus grand représente aussi un téléchargement initial plus gros, et la page en indique la taille avant de commencer.',
      ],
    },
    {
      title: 'Utilisez l’indice de vocabulaire pour les noms et le jargon',
      paragraphs: [
        'Les modèles de parole connaissent bien les mots courants et mal les mots rares. Le nom d’une personne, une entreprise, un produit, un lieu ou un terme technique s’écrit comme le modèle le juge le plus probable, ce qui est souvent faux. L’Indice de vocabulaire sous Plus d’options existe pour cela.',
        'Saisissez les mots inhabituels tels que vous voulez les voir écrits, par exemple une phrase comme « Entretien avec le Dr Okafor sur Kubernetes et PostgreSQL. » Une ligne courte et naturelle qui contient les mots fonctionne mieux qu’une longue liste. C’est facultatif et cela peut contenir jusqu’à 1 000 caractères. La page ne le conserve pas dans vos réglages mémorisés, au cas où il contiendrait des noms privés.',
        'L’indice aide pour l’orthographe. Il n’apprend pas au modèle à entendre un mot marmonné ou masqué par le bruit.',
      ],
    },
    {
      title: 'Améliorer l’audio et Ignorer les silences et la musique',
      paragraphs: [
        'Deux commutateurs sous Plus d’options sont activés par défaut, et pour la plupart des enregistrements vous devriez les laisser activés.',
      ],
      bullets: [
        {
          title: 'Améliorer l’audio.',
          text: 'Filtre les grondements très graves et le souffle très aigu, puis égalise le volume pour qu’une voix faible ne se perde pas à côté d’une voix forte. Si un enregistrement vous semble correct mais que la transcription est étrange, essayez une fois avec ce commutateur désactivé pour voir si le filtre est en cause.',
        },
        {
          title: 'Ignorer les silences et la musique.',
          text: 'Un détecteur de parole repère les passages avec une voix humaine et ne transmet que ceux-là au modèle. Le silence et la plupart des sons qui ne sont pas de la parole, comme la musique sans chant, ne l’atteignent jamais, ce qui évite une bonne part du texte inventé qu’un modèle peut produire quand on ne lui donne rien à entendre. La musique avec chant peut tout de même passer. Désactivez-le seulement si de la parole faible est perdue.',
        },
      ],
      after: [
        'L’horodatage par mot est lui aussi activé par défaut. Il ne change pas les mots trouvés, mais il permet aux sous-titres de commencer et de finir exactement avec les mots et il alimente les marques qui montrent quels mots étaient incertains.',
      ],
    },
    {
      title: 'Vérifiez le résultat : où se cachent les erreurs',
      paragraphs: [
        'Quand la transcription est prête, ne la lisez pas d’abord de haut en bas. Cherchez les marques. Les mots dont le modèle était moins sûr sont soulignés, avec un soulignement plus fort pour les plus incertains. Si toute la transcription a une faible confiance, ou si la langue était incertaine, la page affiche un avis avec un bouton pour revoir la langue et la qualité.',
        'Le score de confiance est un indice de l’endroit où regarder, pas un pourcentage de précision ; un mot sans soulignement peut donc quand même être faux. Consacrez votre attention dans cet ordre :',
      ],
      bullets: [
        {
          title: 'Les noms et les lieux.',
          text: 'Ce sont les erreurs les plus courantes et les plus gênantes.',
        },
        {
          title: 'Les nombres, les dates et les unités.',
          text: 'Un chiffre faux change le sens. Vérifiez chacun avec l’enregistrement.',
        },
        {
          title: 'Les mots qui se ressemblent à l’oreille.',
          text: 'A et à, ou et où, et et est sont choisis d’après le contexte et peuvent être confondus.',
        },
        {
          title: 'Les passages proches de bruit ou de voix superposées.',
          text: 'Réécoutez à l’horodatage. Cliquez sur une ligne pour sauter à ce moment.',
        },
      ],
      after: [
        'Corrigez ce que vous trouvez directement dans le texte. Vos modifications sont conservées dans la transcription et se retrouvent dans chaque export.',
      ],
    },
    {
      title: 'Problème et quoi essayer',
      table: {
        caption: 'Problèmes courants et ce qu’il faut essayer d’abord',
        head: ['Problème', 'Quoi essayer'],
        rows: [
          [
            'Mauvaise langue, ou texte dans la mauvaise écriture',
            'Choisissez vous-même la langue au lieu de Détecter automatiquement',
          ],
          [
            'Noms et marques mal orthographiés',
            'Ajoutez-les à l’Indice de vocabulaire sous Plus d’options, puis transcrivez de nouveau le fichier depuis la page d’accueil',
          ],
          [
            'Beaucoup d’erreurs sur les accents ou un son bruyant',
            'Montez d’un niveau de qualité, et gardez Améliorer l’audio activé',
          ],
          [
            'Du texte apparaît là où personne ne parle',
            'Gardez Ignorer les silences et la musique activé ; coupez les longues parties silencieuses ou uniquement musicales',
          ],
          [
            'La même phrase se répète sans cesse',
            'Gardez Utiliser le texte précédent comme contexte désactivé, et essayez un autre niveau de qualité',
          ],
          [
            'Deux personnes qui se coupent la parole',
            'Il n’y a pas de solution logicielle : enregistrez-les sur des microphones séparés la prochaine fois',
          ],
          [
            'Une personne très faible ou lointaine n’est pas captée',
            'Gardez Améliorer l’audio activé ; si la parole est toujours perdue, désactivez Ignorer les silences et la musique pour ce fichier',
          ],
        ],
      },
    },
    {
      title: 'Ce que la reconnaissance vocale ne sait pas faire',
      paragraphs: [
        'Connaître les limites aide à repérer les problèmes tôt. Une transcription issue de n’importe quelle reconnaissance vocale, y compris celle-ci, peut contenir ce qui suit.',
      ],
      bullets: [
        {
          title: 'Pas de noms d’intervenants.',
          text: 'Elle écrit ce qui a été dit, pas qui l’a dit. Ajoutez les noms à la main pendant la modification.',
        },
        {
          title: 'Du texte inventé.',
          text: 'Face au silence, à la musique ou au bruit, un modèle peut produire des mots fluides que personne n’a prononcés, ou répéter une phrase de nombreuses fois. Si vous voyez du texte là où vous n’entendez rien, supprimez-le.',
        },
        {
          title: 'Des homophones erronés et des mots rares.',
          text: 'Elle choisit le mot le plus probable, qui n’est pas toujours le bon.',
        },
        {
          title: 'Des mots perdus dans les voix superposées.',
          text: 'La parole qui se chevauche est généralement transcrite comme une seule voix ou en partie perdue.',
        },
        {
          title: 'Aucune garantie.',
          text: 'Pour tout ce qui est juridique, médical, financier ou publié, considérez la transcription comme un brouillon qu’une personne doit vérifier.',
        },
      ],
    },
  ],
  faqs: [
    {
      question: 'Quel niveau de qualité donne la transcription la plus précise ?',
      answer:
        'Précision maximale fait généralement le moins d’erreurs, avec Haute précision souvent juste derrière, puis Standard et Le plus rapide. L’écart compte surtout pour les accents, le bruit et les langues autres que l’anglais. Sur une parole claire en anglais, les différences sont faibles ; Standard suffit donc souvent.',
    },
    {
      question: 'Un meilleur microphone aide-t-il plus qu’un meilleur réglage ?',
      answer:
        'Généralement, oui. Un son propre et proche permet à un modèle plus petit de bien faire, alors qu’un mauvais son limite même le plus grand. Rapprocher le microphone et réduire le bruit de fond est l’amélioration la moins chère que vous puissiez faire.',
    },
    {
      question: 'Dois-je nettoyer l’audio dans un éditeur avant de transcrire ?',
      answer:
        'Rarement. La page filtre déjà les grondements et le souffle et égalise le volume quand Améliorer l’audio est activé. Les filtres de réduction de bruit puissants d’un éditeur peuvent déformer la parole et dégrader la reconnaissance ; utilisez donc des réglages doux, ou aucun.',
    },
    {
      question:
        'Pourquoi deux niveaux de qualité donnent-ils un texte différent pour le même fichier ?',
      answer:
        'Ce sont des tailles différentes de modèle ; chacun entend et écrit donc un passage difficile à sa façon. Là où deux exécutions divergent, écoutez ce passage à son horodatage, car il est probablement difficile et mérite d’être vérifié à l’oreille.',
    },
    {
      question: 'Puis-je rendre la transcription plus précise en la modifiant ?',
      answer:
        'La modification corrige le texte que vous exportez ; elle ne réentraîne pas le modèle. Corrigez les noms, les nombres et les mots peu clairs sur la page de la transcription et téléchargez la version corrigée. Une nouvelle exécution avec un indice de vocabulaire réduit les corrections la fois suivante.',
    },
  ],
  links: [
    {
      label: 'Qu’est-ce que Whisper ?',
      path: '/guides/what-is-whisper',
      note: 'Le modèle de parole derrière les niveaux de qualité, et où il est fort ou faible.',
    },
    {
      label: 'Transcription d’entretiens',
      path: '/interview-transcription',
      note: 'Des conseils pour transcrire une conversation à deux voix et de nombreux noms.',
    },
    {
      label: 'Cours en texte',
      path: '/lecture-to-text',
      note: 'Obtenez des notes à partir d’un cours enregistré, même depuis le fond d’une grande salle.',
    },
    {
      label: 'Audio hindi en texte (page en anglais)',
      path: '/hindi-audio-to-text',
      note: 'Choisir la langue compte surtout pour le hindi et les autres paroles non anglaises.',
    },
    {
      label: 'Transcrire une vidéo sans l’envoyer',
      path: '/guides/transcribe-video-without-uploading',
      note: 'Comment fonctionne le moteur dans le navigateur et ce que change l’appareil que vous utilisez.',
    },
  ],
};
