import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Comment ajouter des sous-titres à une vidéo, gratuitement',
  lead: 'Créer des sous-titres demande quatre étapes : transformer la parole en texte, corriger les erreurs, exporter un fichier SRT ou VTT et joindre ce fichier à la vidéo. Ce guide parcourt chaque étape et montre comment joindre le fichier dans YouTube, VLC, un logiciel de montage, une page web, ou de façon permanente dans l’image avec ffmpeg.',
  readingMinutes: 9,
  toolPath: '/srt-subtitle-generator',
  toolCta: 'Créer des sous-titres à partir de votre vidéo',
  blocks: [
    {
      title: 'D’abord, décidez : sous-titres séparés ou sous-titres incrustés',
      paragraphs: [
        'Il y a deux façons de mettre des sous-titres sur une vidéo, et le choix détermine les étapes dont vous avez besoin.',
      ],
      bullets: [
        {
          title: 'Sous-titres séparés (une piste à part).',
          text: 'Les sous-titres sont un fichier ou une piste à côté de la vidéo. Les spectateurs peuvent les activer et les désactiver, choisir une langue, et vous pouvez corriger une faute plus tard sans toucher à la vidéo. C’est ainsi que fonctionnent YouTube, VLC, la plupart des lecteurs et les pages web. Cela demande un lecteur qui prend en charge les pistes de sous-titres.',
        },
        {
          title: 'Sous-titres incrustés (dans l’image).',
          text: 'Le texte est dessiné sur chaque image, et il s’affiche donc partout, y compris sur les plateformes qui n’acceptent aucun fichier de sous-titres. Le prix à payer : personne ne peut le désactiver, vous ne pouvez pas le corriger sans exporter de nouveau la vidéo, et la vidéo doit être réencodée.',
        },
      ],
      after: [
        'Dans le doute, commencez par des sous-titres séparés. Incrustez-les seulement quand l’endroit où vous publiez n’a pas d’envoi de sous-titres.',
      ],
    },
    {
      title: 'Les quatre étapes en un coup d’œil',
      steps: [
        {
          title: 'Transcrivez la vidéo',
          text: 'Ajoutez la vidéo sur la page d’accueil, choisissez la langue parlée et laissez la parole se transformer en texte horodaté.',
        },
        {
          title: 'Corrigez le texte',
          text: 'Relisez la transcription et corrigez les noms, les nombres et les mots peu clairs. Si les lignes de sous-titres sont trop longues, choisissez une Longueur des lignes de sous-titres plus courte dans le menu Exporter.',
        },
        {
          title: 'Exportez en SRT ou en VTT',
          text: 'Téléchargez le fichier de sous-titres. Le SRT fonctionne presque partout. Le VTT est destiné à l’élément vidéo d’une page web.',
        },
        {
          title: 'Joignez le fichier',
          text: 'Envoyez-le à YouTube, chargez-le dans votre lecteur ou votre logiciel de montage, ou ajoutez-le à votre page. Ou incrustez-le dans la vidéo.',
        },
      ],
    },
    {
      title: 'Étapes 1 et 2 : transcrire la vidéo et corriger le texte',
      paragraphs: [
        'Choisissez la vidéo sur la page d’accueil et sélectionnez la langue qu’on y parle, plutôt que de la laisser sur la détection automatique. Nommer la langue est plus fiable, surtout pour les clips courts et les accents. La qualité Standard convient à la plupart des vidéos. Choisissez Haute précision pour un son bruyant ou de forts accents.',
        'Gardez Horodatage par mot activé sous Plus d’options. Il est activé par défaut, et il permet à chaque sous-titre de commencer et de finir avec les mots plutôt qu’aux bords d’un long bloc. Quand la transcription est prête, lisez la vidéo à côté et suivez le texte. Les mots dont le logiciel de reconnaissance était moins sûr sont soulignés tant que le commutateur Souligner les mots incertains est activé (il l’est par défaut) ; vérifiez-les donc en premier.',
        'Les sous-titres se lisent à vitesse réelle ; façonnez donc le texte pour le spectateur. Ce sont des repères très répandus, pas des règles strictes :',
      ],
      bullets: [
        {
          title: 'Longueur des lignes.',
          text: 'Environ 42 caractères par ligne, et pas plus de deux lignes à la fois. Le menu Exporter propose un choix Longueur des lignes de sous-titres : Courte (32 lettres), Standard (42) ou Longue (56).',
        },
        {
          title: 'Durée d’affichage.',
          text: 'Chaque sous-titre devrait rester affiché au moins une seconde environ, et rarement plus d’environ sept.',
        },
        {
          title: 'Vitesse de lecture.',
          text: 'Environ 15 à 20 caractères par seconde sont confortables pour la plupart des adultes. Si les gens n’ont pas fini de lire avant que la ligne change, raccourcissez la formulation ou laissez-la affichée plus longtemps.',
        },
        {
          title: 'Coupures naturelles.',
          text: 'Un bon sous-titre se coupe à la fin d’un groupe de mots, pas au milieu d’un nom ni entre un article et son nom. L’export retourne à la ligne les lignes longues pour vous ; gardez donc chaque ligne modifiée comme un groupe de mots complet.',
        },
      ],
    },
    {
      title: 'Étape 3 : choisir SRT ou VTT',
      paragraphs: [
        'Téléchargez le SRT, sauf si les sous-titres sont destinés à une vidéo sur votre propre page web. YouTube, VLC et presque tous les logiciels de montage acceptent le SRT. Une page web demande du VTT, car les navigateurs ne lisent les pistes de sous-titres qu’à ce format.',
        'Vous pouvez télécharger les deux à partir de la même transcription ; il n’est donc pas nécessaire de décider à l’avance. Le guide sur le SRT et le VTT explique les différences exactes, y compris ce qu’il y a dans chaque fichier.',
      ],
    },
    {
      title: 'Étape 4 : ajouter le fichier à YouTube, à VLC ou à un logiciel de montage',
      paragraphs: [
        'Les noms de menus changent de temps à autre ; cherchez donc la correspondance la plus proche si un libellé diffère de celui ci-dessous.',
      ],
      bullets: [
        {
          title: 'YouTube.',
          text: 'Ouvrez YouTube Studio, choisissez la vidéo, ouvrez Sous-titres, ajoutez une langue, puis choisissez d’importer un fichier. Choisissez l’option pour un fichier avec synchronisation, sélectionnez votre SRT et publiez. YouTube vous permet ensuite de modifier les lignes sur le même écran.',
        },
        {
          title: 'VLC.',
          text: 'Lisez la vidéo, puis choisissez Sous-titres, Ajouter un fichier de sous-titres dans le menu et sélectionnez votre SRT. Vous pouvez aussi faire glisser le fichier sur la fenêtre du lecteur. Ou enregistrez le SRT à côté de la vidéo avec le même nom (lecture.mp4 et lecture.srt) et VLC le charge généralement de lui-même.',
        },
        {
          title: 'Les logiciels de montage vidéo.',
          text: 'La plupart des logiciels de montage peuvent importer un fichier SRT comme piste de sous-titres, depuis un menu comme Fichier, Importer, ou depuis le panneau des sous-titres. Une fois sur la chronologie, vous pouvez changer la mise en forme du texte. Si un format est refusé, essayez l’autre.',
        },
        {
          title: 'Les téléphones et les tablettes.',
          text: 'Une application de lecture vidéo qui prend en charge les fichiers de sous-titres, comme VLC pour mobile, peut charger un fichier SRT depuis vos fichiers. Le lecteur de galerie intégré de nombreux téléphones ne le peut pas.',
        },
      ],
    },
    {
      title: 'Ajouter des sous-titres à une page web avec l’élément track',
      paragraphs: [
        'Sur votre propre site web, l’élément vidéo HTML charge les sous-titres grâce à un élément track qui pointe vers un fichier WebVTT. Exportez le VTT, envoyez-le à côté de la vidéo et ajoutez une ligne.',
      ],
      code: {
        label: 'Une vidéo avec une piste de sous-titres',
        text: `<video controls src="talk.mp4">
  <track kind="subtitles" src="talk.en.vtt"
         srclang="en" label="English" default>
</video>`,
      },
      after: [
        'L’attribut default affiche la piste sans que le spectateur ait à la choisir. Ajoutez une ligne track par langue. Si le fichier VTT se trouve sur un autre domaine que la page, ce serveur doit autoriser les requêtes d’origine croisée, sinon le navigateur ne le chargera pas.',
      ],
    },
    {
      title: 'Ajouter une piste de sous-titres séparée à un MP4 avec ffmpeg',
      paragraphs: [
        'ffmpeg est un outil gratuit en ligne de commande qui peut emballer les sous-titres dans le fichier MP4, afin que la vidéo et ses sous-titres voyagent dans un seul fichier. La vidéo et le son sont copiés sans modification ; c’est donc rapide et sans perte de qualité. Placez la vidéo et le fichier SRT dans un même dossier et exécutez cette commande à cet endroit.',
      ],
      code: {
        label: 'Sous-titres séparés dans un MP4 (les spectateurs peuvent les désactiver)',
        text: `ffmpeg -i talk.mp4 -i talk.srt -map 0:v -map 0:a? -map 1:0 -c:v copy -c:a copy -c:s mov_text -metadata:s:s:0 language=eng talk-subtitled.mp4`,
      },
      after: [
        'Les options -map choisissent exactement ce qui entre dans le nouveau fichier : toute la vidéo, tout son éventuel (le point d’interrogation permet à la commande de continuer s’il n’y en a pas) et le fichier de sous-titres. Choisir les flux à la main évite les erreurs sur les fichiers de téléphone et d’appareil photo qui contiennent aussi des pistes de données supplémentaires, que le MP4 ne peut souvent pas copier. Le réglage mov_text est le type de sous-titres qu’utilisent les fichiers MP4. Le code de langue comporte trois lettres : eng pour l’anglais, spa pour l’espagnol, hin pour le hindi, et ainsi de suite. Des lecteurs comme VLC affichent la piste dans leur menu de sous-titres.',
      ],
    },
    {
      title: 'Incruster les sous-titres dans l’image avec ffmpeg',
      paragraphs: [
        'Pour une plateforme qui n’accepte qu’une vidéo, dessinez le texte sur chaque image. Cela réencode la vidéo ; c’est donc plus long et le fichier est refait. Le son est copié tel quel. Exécutez la commande dans le dossier qui contient les deux fichiers, ce qui évite les problèmes de chemins de fichiers.',
      ],
      code: {
        label: 'Sous-titres incrustés (permanents, impossibles à désactiver)',
        text: `ffmpeg -i talk.mp4 -vf "subtitles=talk.srt" -c:a copy talk-burned.mp4`,
      },
      after: [
        "Pour changer l’apparence, ajoutez un style après le nom du fichier, par exemple subtitles=talk.srt:force_style='FontSize=22' entre les guillemets de la commande. Gardez une copie de la vidéo d’origine, car une version incrustée ne peut pas être retransformée en sous-titres séparés.",
      ],
    },
    {
      title: 'Accessibilité, et pourquoi il faut vérifier le texte',
      paragraphs: [
        'Les sous-titres aident les personnes sourdes ou malentendantes, les personnes qui regardent dans le train ou dans un bureau calme sans le son, les personnes qui apprennent encore la langue, et quiconque trouve plus facile de suivre des mots écrits. Beaucoup de spectateurs les activent même quand ils pourraient entendre le son.',
        'La reconnaissance vocale est bonne, mais elle n’est pas parfaite, et un sous-titre avec un nom ou un nombre erroné peut induire en erreur. Relisez toujours la transcription avec la vidéo avant de la publier, et redoublez de soin pour les noms, les chiffres, les termes techniques et tout ce qui est juridique ou médical. Des sous-titres qui décrivent aussi les sons importants, comme un rire ou une porte qui se ferme, sont plus utiles aux personnes qui ne peuvent pas les entendre, et vous pouvez les ajouter à la main pendant la modification.',
      ],
    },
  ],
  faqs: [
    {
      question:
        'Quelle est la différence entre sous-titres et sous-titres pour sourds et malentendants ?',
      answer:
        'Les sous-titres traduisent ou écrivent la parole pour des spectateurs qui peuvent entendre la vidéo. Les sous-titres pour sourds et malentendants (captions, en anglais) décrivent aussi les sons, comme la musique ou les rires, pour des spectateurs qui ne peuvent pas entendre. Les fichiers sont du même genre ; vous pouvez donc ajouter vous-même des descriptions de sons à un fichier SRT si vous voulez ce type de sous-titres.',
    },
    {
      question: 'Ai-je besoin d’un logiciel particulier pour ajouter des sous-titres ?',
      answer:
        'Non. Importez le fichier SRT dans YouTube Studio, faites-le glisser sur VLC ou importez-le dans votre logiciel de montage. Seul l’emballage du fichier dans un MP4, ou l’incrustation du texte dans l’image, demande un outil comme ffmpeg ou un logiciel de montage vidéo capable de l’exporter.',
    },
    {
      question: 'Puis-je ajouter des sous-titres en plusieurs langues ?',
      answer:
        'Oui, avec des sous-titres séparés. Créez un fichier par langue et ajoutez chacun comme piste distincte. Ce site peut écrire la transcription dans la langue parlée et peut traduire la parole en anglais, mais vous devriez traduire vous-même le texte vers d’autres langues ou avec un autre outil.',
    },
    {
      question: 'Pourquoi mes sous-titres sont-ils désynchronisés par rapport à la vidéo ?',
      answer:
        'Soit tout le fichier est décalé, ce que la plupart des lecteurs peuvent corriger avec un réglage de décalage des sous-titres, soit la vidéo a été modifiée après la création des sous-titres. Les sous-titres suivent le temps de l’audio à partir duquel ils ont été faits ; transcrivez donc le montage final de la vidéo.',
    },
  ],
  links: [
    {
      label: 'Générateur de sous-titres SRT',
      path: '/srt-subtitle-generator',
      note: 'Commencez ici pour transformer une vidéo en fichier SRT.',
    },
    {
      label: 'SRT ou VTT : quel format choisir',
      path: '/guides/srt-vs-vtt',
      note: 'Ce qu’il y a dans chaque fichier, et lequel télécharger selon votre cas.',
    },
    {
      label: 'Générateur de sous-titres VTT',
      path: '/vtt-subtitle-generator',
      note: 'Obtenez le fichier WebVTT qu’exige l’élément vidéo d’une page web.',
    },
    {
      label: 'Générateur de sous-titres YouTube',
      path: '/youtube-subtitle-generator',
      note: 'Le parcours propre à YouTube, du fichier à l’importation dans Studio.',
    },
    {
      label: 'Traduire un audio en anglais',
      path: '/translate-audio-to-english',
      note: 'Obtenez des sous-titres en anglais à partir d’une vidéo parlée dans une autre langue.',
    },
  ],
};
