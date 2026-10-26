import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'SRT ou VTT : quel format de sous-titres choisir ?',
  lead: 'Le SRT est le choix sûr par défaut : presque tous les lecteurs vidéo, logiciels de montage et plateformes le lisent. Choisissez le VTT (WebVTT) quand les sous-titres sont destinés à l’élément vidéo d’une page web, ou quand vous avez besoin de mise en forme et de positionnement. Les deux sont des fichiers en texte brut, et vous pouvez télécharger l’un ou l’autre à partir de votre vidéo ici.',
  readingMinutes: 9,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Créer un fichier SRT à partir de votre vidéo',
  blocks: [
    {
      title: 'La réponse courte',
      paragraphs: [
        'Si vous avez un doute, utilisez le SRT. C’est le format le plus ancien et le plus simple, et il est accepté par presque tous les lecteurs vidéo, logiciels de montage et formulaires d’envoi que vous risquez de rencontrer. Un fichier de sous-titres qui fonctionne partout vaut mieux qu’un fichier ingénieux.',
        'Utilisez le VTT quand la vidéo est lue sur une page web grâce à l’élément vidéo HTML. Les navigateurs ne chargent les pistes de sous-titres qu’au format WebVTT ; un fichier SRT n’y fonctionnera donc pas sans conversion. Le VTT est aussi le meilleur choix quand vous voulez placer le texte à l’écran, ajouter du gras ou de l’italique en toute confiance, ou indiquer qui parle.',
        'Tout le reste de ce guide explique pourquoi, vous montre à quoi ressemble chaque fichier à l’intérieur, et vous dit comment passer de l’un à l’autre sans rien casser.',
      ],
    },
    {
      title: 'À quoi ressemble un fichier SRT',
      paragraphs: [
        'SRT signifie SubRip Text, du nom d’un programme Windows du début des années 2000 qui copiait les sous-titres des DVD. Le format n’a jamais été formellement normalisé, mais il est devenu si courant que tout le prend en charge. Un fichier SRT est une liste de blocs numérotés, chacun séparé du suivant par une ligne vide.',
      ],
      code: {
        label: 'Un petit fichier SRT',
        text: `1
00:00:01,000 --> 00:00:03,500
Welcome to the show.

2
00:00:03,800 --> 00:00:07,200
Today we look at how
subtitle files are built.

3
00:00:07,600 --> 00:00:10,000
Let's start with the basics.`,
      },
      after: [
        'Chaque bloc comporte trois parties : un numéro d’ordre, une ligne avec l’heure de début et l’heure de fin, et une ou deux lignes de texte. Les horaires s’écrivent en heures, minutes, secondes et millisecondes, et les millisecondes sont séparées par une virgule. Cette virgule est de loin la raison la plus courante pour laquelle un fichier converti à la main échoue.',
        'Enregistrez le fichier en texte brut en UTF-8 avec l’extension .srt. L’UTF-8 compte dès que le texte contient des accents, du devanagari, de l’arabe ou tout autre caractère non anglais.',
      ],
    },
    {
      title: 'À quoi ressemble un fichier WebVTT',
      paragraphs: [
        'Le WebVTT, généralement abrégé en VTT, a été conçu pour le web et est défini dans une spécification publiée par le W3C, l’organisme qui normalise les technologies du web. Il ressemble au SRT mais ajoute une ligne d’en-tête obligatoire et quelques extras facultatifs.',
      ],
      code: {
        label: 'Les mêmes sous-titres sous forme de fichier WebVTT',
        text: `WEBVTT

NOTE This file was made from the SRT example.

intro
00:00:01.000 --> 00:00:03.500
Welcome to the show.

00:00:03.800 --> 00:00:07.200 line:85% align:center
Today we look at how
subtitle files are built.

00:00:07.600 --> 00:00:10.000
<v Maria>Let's start with the basics.</v>`,
      },
      after: [
        'Quatre détails le distinguent. La première ligne doit être WEBVTT. Les millisecondes sont séparées par un point, pas par une virgule. Une séquence peut avoir un nom (le mot intro ci-dessus) à la place d’un numéro ou en plus de celui-ci, et les numéros sont facultatifs. Et après les horaires, vous pouvez ajouter des réglages comme line, position et align, qui déplacent le texte à l’écran.',
        'Vous pouvez aussi écrire des blocs NOTE pour des commentaires que les spectateurs ne voient jamais, indiquer qui parle avec la balise v, et utiliser des balises simples comme b, i et u pour le gras, l’italique et le soulignement. Enregistrez le fichier en UTF-8 avec l’extension .vtt.',
      ],
    },
    {
      title: 'Comparaison du SRT et du VTT',
      paragraphs: [
        'Ce tableau met les deux côte à côte. Les différences qui comptent au quotidien sont l’en-tête, le séparateur décimal et les endroits où chaque format est accepté.',
      ],
      table: {
        caption: 'Le SRT comparé au WebVTT',
        head: ['', 'SRT', 'WebVTT (VTT)'],
        rows: [
          ['Extension du fichier', '.srt', '.vtt'],
          ['Première ligne', 'Le nombre 1', 'Le mot WEBVTT'],
          ['Format des horaires', '00:00:01,000 (virgule)', '00:00:01.000 (point)'],
          ['Numéros de séquence', 'Obligatoires', 'Facultatifs (un nom est permis)'],
          [
            'Position à l’écran',
            'Absente du format',
            'Réglages de séquence : line, position, align, size',
          ],
          [
            'Mise en forme et balises d’intervenant',
            'Balises de base seulement, la prise en charge varie selon le lecteur',
            'Définies dans la spécification, plus mise en forme CSS',
          ],
          ['Commentaires', 'Aucun', 'Blocs NOTE'],
          ['Élément vidéo d’une page web', 'Non accepté', 'Le format requis'],
          ['Spécification formelle', 'Aucune (un format de fait)', 'Spécification du W3C'],
        ],
      },
      after: [
        'En clair : le SRT est le fichier plus simple à la portée plus large, le VTT est le fichier plus riche à la maison plus étroite mais plus moderne. Pour des sous-titres ordinaires de parole, le texte à l’écran a le même aspect dans les deux cas.',
      ],
    },
    {
      title: 'Où chaque format est accepté',
      paragraphs: [
        'La prise en charge évolue avec le temps, et chaque plateforme formule ses pages d’aide à sa façon ; considérez donc ceci comme un guide et consultez la page d’aide actuelle du service vers lequel vous envoyez le fichier.',
      ],
      bullets: [
        {
          title: 'Les pages web.',
          text: 'L’élément track de la balise vidéo HTML exige du WebVTT. C’est le seul endroit où le SRT n’est pas une option.',
        },
        {
          title: 'YouTube.',
          text: 'L’envoi de sous-titres accepte le SRT, et il accepte aussi le VTT, entre autres formats. Le SRT est le choix habituel.',
        },
        {
          title: 'Les lecteurs de bureau et mobiles.',
          text: 'VLC et la plupart des autres lecteurs lisent le SRT, et beaucoup lisent aussi le VTT. Un lecteur charge généralement un fichier de sous-titres qui porte le même nom que la vidéo.',
        },
        {
          title: 'Les logiciels de montage vidéo.',
          text: 'La plupart des logiciels de montage importent le SRT comme piste de sous-titres. Certains importent aussi le VTT. Si un format est refusé, essayez l’autre.',
        },
        {
          title: 'Les autres plateformes sociales et d’apprentissage.',
          text: 'Beaucoup demandent du SRT ou du VTT, quelques-unes n’en demandent qu’un seul. Lisez la page d’envoi avant d’exporter.',
        },
      ],
    },
    {
      title: 'Convertir à la main entre SRT et VTT',
      paragraphs: [
        'Renommer le fichier ne suffit pas. Un fichier appelé talk.vtt qui contient encore du SRT est rejeté par les navigateurs, car il n’a pas l’en-tête et ses horaires utilisent des virgules. La conversion prend une minute dans n’importe quel éditeur de texte.',
      ],
      steps: [
        {
          title: 'SRT vers VTT, première étape',
          text: 'Ajoutez la ligne WEBVTT tout en haut, suivie d’une ligne vide.',
        },
        {
          title: 'SRT vers VTT, deuxième étape',
          text: 'Dans chaque ligne d’horaire, remplacez la virgule avant les millisecondes par un point. Une recherche et un remplacement sur les lignes --> , ou sur le motif de chiffres autour de la virgule, fait gagner du temps.',
        },
        {
          title: 'SRT vers VTT, troisième étape',
          text: 'Laissez les numéros où ils sont, puisque le VTT les autorise comme noms de séquence. Enregistrez en UTF-8 avec l’extension .vtt.',
        },
        {
          title: 'VTT vers SRT',
          text: 'Faites l’inverse : supprimez l’en-tête, les blocs NOTE et les réglages après les horaires, remettez des virgules à la place des points, assurez-vous que chaque séquence a un numéro, et enregistrez en .srt.',
        },
      ],
      after: [
        'Si vous avez ffmpeg installé, il convertit aussi les fichiers de sous-titres : ffmpeg -i talk.srt talk.vtt transforme un fichier SRT en fichier VTT, et la même commande avec les noms inversés va dans l’autre sens. Le chemin le plus simple reste cependant de télécharger le format dont vous avez besoin depuis la page de la transcription, car les deux sont produits directement à partir du même texte.',
      ],
    },
    {
      title: 'Problèmes courants et leurs causes',
      bullets: [
        {
          title: 'Les accents ou les lettres non latines apparaissent comme des symboles étranges.',
          text: 'Le fichier n’est pas enregistré en UTF-8. Enregistrez-le de nouveau avec cet encodage.',
        },
        {
          title: 'Rien ne s’affiche sur la page web.',
          text: 'Le fichier est du SRT plutôt que du VTT, ou le serveur l’envoie avec le mauvais type. Les fichiers VTT doivent être servis en text/vtt, et un fichier sur un autre domaine demande aussi les bons réglages d’origine croisée.',
        },
        {
          title: 'Les sous-titres sont en retard ou en avance partout.',
          text: 'Tout le fichier est décalé. La plupart des lecteurs et des logiciels de montage permettent de décaler les sous-titres d’un temps fixe, ce qui est plus facile que de modifier chaque ligne.',
        },
        {
          title: 'Deux sous-titres se chevauchent à l’écran.',
          text: 'L’heure de fin d’une séquence est postérieure à l’heure de début de la suivante. Raccourcissez la séquence précédente.',
        },
        {
          title: 'Les lignes sont trop longues à lire.',
          text: 'Coupez-les en deux lignes de longueur à peu près égale. Environ 42 caractères par ligne est un repère courant.',
        },
      ],
    },
    {
      title: 'Comment obtenir ici un fichier SRT ou VTT à partir de votre vidéo',
      paragraphs: [
        'Vous n’avez pas besoin d’écrire vous-même l’un ou l’autre format. Ajoutez votre fichier vidéo ou audio sur la page d’accueil, choisissez la langue parlée et laissez la transcription se terminer. Relisez-la et corrigez tout mot erroné : une ligne modifiée garde son heure de début et de fin, et les mots qu’elle contient sont répartis sur cette durée proportionnellement à leur longueur.',
        'Ouvrez ensuite le menu de téléchargement et choisissez SRT ou VTT. Les deux sont produits à partir de la même transcription modifiée ; vous pouvez donc exporter l’un pour YouTube et l’autre pour votre propre page web sans refaire aucun travail. Si vous voulez que les sous-titres se coupent proprement aux bons mots, laissez Horodatage par mot activé sous Plus d’options.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Puis-je renommer un fichier SRT en VTT et l’utiliser sur mon site web ?',
      answer:
        'Non. Un navigateur rejette un fichier .vtt qui ne commence pas par WEBVTT, et les horaires du SRT utilisent des virgules là où le VTT exige des points. Ajoutez l’en-tête, changez les virgules, ou téléchargez directement un fichier VTT depuis la page de la transcription.',
    },
    {
      question: 'Les fichiers SRT et VTT diffèrent-ils par la taille ou la qualité ?',
      answer:
        'Non. Ce sont tous deux de petits fichiers texte et aucun n’affecte la qualité de la vidéo. La différence tient seulement aux éléments supplémentaires que le VTT peut décrire, comme la position à l’écran et la mise en forme, et aux endroits où chaque format est accepté.',
    },
    {
      question: 'Les sous-titres SRT peuvent-ils être en gras, en italique ou en couleur ?',
      answer:
        'Certains lecteurs comprennent des balises de base comme b et i dans le SRT, mais la prise en charge est inégale ; le résultat peut donc différer d’un lecteur à l’autre. Le WebVTT définit ses balises et sa mise en forme CSS dans une spécification, ce qui rend le résultat plus prévisible sur le web.',
    },
    {
      question: 'Quel encodage de texte un fichier de sous-titres doit-il utiliser ?',
      answer:
        'L’UTF-8. Il gère toutes les langues, et c’est ce qu’attendent les navigateurs pour le WebVTT. Si les caractères des sous-titres semblent cassés, le fichier a presque certainement été enregistré dans un encodage plus ancien.',
    },
  ],
  links: [
    {
      label: 'Générateur de sous-titres SRT',
      path: '/srt-subtitle-generator',
      note: 'Déposez une vidéo et téléchargez un fichier SRT réalisé à partir de la parole qu’elle contient.',
    },
    {
      label: 'Générateur de sous-titres VTT',
      path: '/vtt-subtitle-generator',
      note: 'La même chose, pour un fichier WebVTT qui fonctionne avec l’élément vidéo d’une page web.',
    },
    {
      label: 'Ajouter des sous-titres à une vidéo',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Pas à pas, de la transcription à une vidéo qui affiche des sous-titres dans YouTube, VLC ou un logiciel de montage.',
    },
    {
      label: 'Générateur de sous-titres YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Créez un fichier SRT pour une vidéo qui vous appartient et importez-le dans YouTube Studio.',
    },
    {
      label: 'Obtenir une transcription plus précise',
      path: '/guides/accurate-transcripts',
      note: 'Un meilleur texte signifie moins de corrections avant d’exporter les sous-titres.',
    },
  ],
};
