import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'Message vocal WhatsApp en texte',
  h1: 'Convertir un message vocal WhatsApp en texte',
  lead: 'Les longs messages vocaux sont faciles à envoyer et difficiles à relire. Enregistrez le message sous forme de fichier, déposez-le ici et lisez-le sous forme de texte horodaté, en hindi, en anglais, en espagnol et dans de nombreuses autres langues. Gratuit, sans connexion.',
  dropKind: 'audio',
  dropNoun: 'message vocal WhatsApp',

  whyTitle: 'Pourquoi transformer un message vocal en texte',
  why: [
    'Un message vocal est rapide à enregistrer et lent à exploiter. On ne peut ni le rechercher, ni en copier une phrase, ni le survoler pendant une réunion. Sous forme de texte, le même message se parcourt en quelques secondes, et vous pouvez coller une adresse, une citation ou une liste d’instructions directement dans une conversation, une note ou un document.',
    'Utilisez cette page pour les messages que vous avez envoyés ou reçus et que vous avez le droit d’utiliser. Les messages vocaux sont personnels ; il est donc utile de savoir où va le fichier : ici, il voyage vers le serveur par une connexion chiffrée et est supprimé automatiquement ensuite. Aucun compte n’est nécessaire.',
  ],
  browserWhy: [
    'Un message vocal est rapide à enregistrer et lent à exploiter. On ne peut ni le rechercher, ni en copier une phrase, ni le survoler pendant une réunion. Sous forme de texte, le même message se parcourt en quelques secondes, et vous pouvez coller une adresse, une citation ou une liste d’instructions directement dans une conversation, une note ou un document.',
    'Utilisez cette page pour les messages que vous avez envoyés ou reçus et que vous avez le droit d’utiliser. Les messages vocaux sont personnels ; le fichier reste donc chez vous : votre navigateur le transcrit sur votre propre appareil et rien n’est envoyé. La première fois que vous utilisez le site, votre navigateur télécharge une fois le modèle de parole et le conserve. Il pèse quelques dizaines de mégaoctets pour Le plus rapide, quelques centaines pour Standard et davantage pour les choix plus grands ; sur un téléphone, utilisez donc le Wi-Fi plutôt que les données mobiles. Aucun compte n’est nécessaire.',
  ],

  sections: [
    {
      title: 'Comment enregistrer un message vocal sous forme de fichier',
      paragraphs: [
        'WhatsApp garde les messages vocaux à l’intérieur de l’application ; enregistrez donc d’abord le message sous forme de fichier. Les menus diffèrent selon les modèles de téléphone et les versions de l’application ; considérez donc ces étapes comme un guide et cherchez les options Partager, Transférer ou Enregistrer. WhatsApp appartient à sa propre entreprise, et ce site n’a aucun lien avec elle.',
        'WhatsApp peut aussi afficher une transcription dans la conversation sur certains téléphones, dans les langues et les versions qui la proposent. Cette page sert quand vous voulez le texte sous forme de fichier que vous pouvez modifier et exporter, avec des horodatages, ou quand votre version ou votre langue n’est pas couverte.',
      ],
      bullets: [
        {
          title: 'Sur Android.',
          text: 'Maintenez le doigt sur le message vocal, ouvrez le menu et cherchez Partager, ou Transférer puis Partager. Choisissez Enregistrer sur l’appareil, Fichiers ou une application de stockage en ligne, ou envoyez-le-vous par e-mail. De nombreux téléphones Android conservent aussi les notes vocales reçues dans un dossier WhatsApp Voice Notes qu’un gestionnaire de fichiers peut ouvrir.',
        },
        {
          title: 'Sur iPhone.',
          text: 'Maintenez le doigt sur le message vocal, choisissez Transférer, puis touchez l’icône de partage et choisissez Enregistrer dans Fichiers. Vous pouvez aussi l’envoyer à votre ordinateur par AirDrop ou par e-mail.',
        },
        {
          title: 'Sur un ordinateur.',
          text: 'Dans WhatsApp Web ou l’application de bureau, le menu du message peut proposer une option Télécharger. Si ce n’est pas le cas, enregistrez le fichier sur votre téléphone et transférez-le.',
        },
      ],
    },
    {
      title: 'Hindi, hinglish et messages en plusieurs langues',
      paragraphs: [
        'Les messages vocaux mélangent souvent les langues dans une même phrase. Réglez la langue sur celle qui est le plus parlée, ou gardez Détecter automatiquement. La reconnaissance suit au mieux la langue principale ; vérifiez donc les lignes signalées comme incertaines là où une seconde langue intervient.',
        'Pour le hindi, Style de la transcription décide de la façon dont le texte est écrit. Hinglish (hindi romanisé) écrit le hindi en lettres latines et garde les mots anglais tels quels. Écriture d’origine conserve le devanagari. L’ourdou, le bengali, l’arabe, l’espagnol, le portugais et les autres langues prises en charge gardent leur propre écriture. Un message dans une autre langue peut aussi donner un texte en anglais : dans Plus d’options, réglez Sortie sur Traduire en anglais, et vérifiez le résultat avec l’enregistrement, car la traduction est moins fiable que la transcription dans la langue d’origine.',
      ],
    },
  ],

  howTitle: 'Comment convertir un message vocal WhatsApp en texte',
  howToDescription:
    'Enregistrez le message vocal sous forme de fichier, ajoutez-le à la page, choisissez la langue, attendez la transcription et copiez ou téléchargez le texte.',
  steps: [
    {
      title: 'Ajoutez le fichier du message vocal',
      text: 'Déposez le fichier enregistré sur la zone ci-dessus, ou appuyez sur Choisir un fichier. Un message vocal WhatsApp est généralement un fichier .opus, qui fonctionne tel quel. La zone accepte un fichier à la fois : elle transmet le message à l’outil d’envoi sur la page suivante, où Ajouter un autre fichier vous permet d’inclure d’autres messages.',
    },
    {
      title: 'Choisissez la langue',
      text: 'Sur la page suivante, choisissez la langue la plus parlée, ou gardez Détecter automatiquement. Pour le hindi, Style de la transcription permet de choisir entre les lettres latines (Hinglish) et le devanagari. Appuyez ensuite sur Transcrire.',
    },
    {
      title: 'Attendez le texte',
      text: 'Les lignes apparaissent avec leurs horodatages pendant le traitement du message, et un message court se termine plus vite qu’un long. Standard convient à la plupart des messages. Pour une personne qui parle vite ou un enregistrement bruyant, Haute précision peut aider là où votre appareil peut l’exécuter. Sur un appareil qui ne le peut pas, ce choix est grisé avec une raison, et il demande un téléchargement initial plus gros.',
    },
    {
      title: 'Vérifiez, copiez ou téléchargez',
      text: 'Corrigez les noms et les mots peu clairs, puis copiez le texte ou téléchargez le TXT. Ne téléchargez le SRT ou le VTT que si le message accompagne une vidéo.',
    },
  ],

  formatsTitle: 'Fichiers de messages vocaux et téléchargements',
  formatsIntro:
    'Les messages vocaux WhatsApp sont généralement des fichiers .opus. Les autres fichiers audio fonctionnent de la même façon, et les fichiers vidéo sont acceptés aussi, avec seulement leur son utilisé.',
  uploadTitle: 'Fichiers audio que vous pouvez ajouter',
  accepts: ['OPUS', 'OGG', 'M4A', 'MP3', 'AAC', 'WAV'],
  downloads: [
    { name: 'TXT', use: 'le message en texte brut à copier' },
    { name: 'Markdown', use: 'des notes avec un horaire sur chaque ligne' },
    { name: 'PDF', use: 'une copie imprimable du message' },
    { name: 'SRT', use: 'des lignes horodatées pour une vidéo qui porte le message' },
  ],

  tipsTitle: 'Conseils pour les messages vocaux',
  tips: [
    {
      title: 'Enregistrez le fichier, ne le réenregistrez pas.',
      text: 'Faire jouer un message sur le haut-parleur pendant qu’un autre appareil l’enregistre ajoute de l’écho et du bruit de pièce. Le fichier enregistré est la copie propre.',
    },
    {
      title: 'Nommez la langue principale.',
      text: 'Choisir la langue est plus fiable que la détection automatique pour un message court, surtout quand la personne passe d’une langue à l’autre.',
    },
    {
      title: 'Ajoutez les noms à l’indice de vocabulaire.',
      text: 'Dans Plus d’options, saisissez les noms des personnes, des lieux et des commerces mentionnés. Ils ont alors plus de chances d’être écrits comme vous les attendez.',
    },
    {
      title: 'Vérifiez les nombres avant d’agir.',
      text: 'Un numéro de téléphone, une adresse, une heure ou un montant peuvent être mal compris. Lisez cette ligne à partir de son horodatage et réécoutez avant de vous y fier.',
    },
    {
      title: 'Traitez avec soin les messages des autres.',
      text: 'Ne transcrivez que les messages que vous avez envoyés ou reçus et que vous avez le droit d’utiliser, et réfléchissez avant de partager le texte d’un message que quelqu’un vous a envoyé en privé.',
    },
  ],

  faqs: [
    {
      question: 'Puis-je convertir un message vocal WhatsApp en texte sans l’application ?',
      answer:
        'Oui. Enregistrez le message vocal sous forme de fichier, ajoutez-le à cette page et lisez le texte. Vous n’avez pas besoin de compte sur ce site, et il n’y a ni inscription ni connexion.',
    },
    {
      question: 'De quel type de fichier est un message vocal WhatsApp ?',
      answer:
        'Généralement un fichier .opus. Cette page le lit directement ; vous n’avez donc pas besoin de le convertir d’abord en MP3. Les notes vocales enregistrées en OGG, M4A, MP3 ou AAC fonctionnent aussi.',
    },
    {
      question: 'Cela fonctionne-t-il pour le hindi ou un mélange de hindi et d’anglais ?',
      answer:
        'Oui. Le hindi fait partie des langues prises en charge. Par défaut, le texte est écrit en lettres latines (Hinglish) ; choisissez Écriture d’origine sous Style de la transcription pour le devanagari. Un message qui mélange les langues suit au mieux la principale ; vérifiez donc les lignes signalées comme incertaines.',
    },
    {
      question: 'Quelle durée de message vocal WhatsApp puis-je transcrire ?',
      answer:
        '{limits} Les messages vocaux sont normalement courts ; cela compte donc rarement. Il n’y a aucun quota quotidien ou mensuel.',
      browser: {
        answer:
          'Le site ne fixe aucune limite de taille ni de durée, et les messages vocaux sont normalement courts ; ils se terminent donc vite. Un très long enregistrement demande du temps et de la mémoire libre sur votre appareil, et certains navigateurs peuvent ne pas venir à bout d’un fichier extrêmement long.',
      },
    },
    {
      question: 'Ce service garde-t-il une copie de mon message vocal WhatsApp ?',
      answer:
        'Seulement pendant votre session. Le serveur supprime le fichier à la fin de la session, ou quand vous appuyez sur Supprimer mes données maintenant.',
      browser: {
        answer:
          'Seulement dans ce navigateur : le message vocal ne quitte jamais votre appareil. Votre navigateur l’efface après une période d’inactivité, et vous pouvez l’effacer plus tôt avec Supprimer mes données maintenant.',
      },
    },
  ],

  links: [
    {
      label: 'Audio hindi en texte (page en anglais)',
      path: '/hindi-audio-to-text',
      note: 'Réglages et conseils pour la parole en hindi, en devanagari ou en lettres latines.',
    },
    {
      label: 'Transcription en hinglish (page en anglais)',
      path: '/hinglish-transcription',
      note: 'Comment le hindi s’écrit en lettres latines, et quand l’utiliser.',
    },
    {
      label: 'Traduire un audio en anglais',
      path: '/translate-audio-to-english',
      note: 'Obtenez du texte en anglais à partir d’un message vocal dans une autre langue.',
    },
    {
      label: 'Obtenir une transcription plus précise',
      path: '/guides/accurate-transcripts',
      note: 'Ce qu’il faut changer quand un message sort avec des erreurs.',
    },
  ],
};
