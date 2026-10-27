import { GuideContent } from '../../../guide.model';

export const CONTENT: GuideContent = {
  h1: 'Comment transcrire une vidéo sans l’envoyer',
  lead: 'Sur transcribevid.com, la reconnaissance vocale s’exécute à l’intérieur de votre propre navigateur ; votre fichier vidéo ou audio est donc lu sur votre appareil et n’est envoyé ni au site, ni à Google, ni à personne d’autre. Ce guide explique comment cela fonctionne, ce que votre navigateur télécharge tout de même, ce qui est tout de même envoyé, et comment vous pouvez tout vérifier vous-même.',
  readingMinutes: 11,
  toolPath: '/video-to-text',
  toolCta: 'Transcrire une vidéo sur votre appareil',
  blocks: [
    {
      title: 'Ce que signifie « sans envoi » ici',
      paragraphs: [
        'La plupart des services de transcription en ligne fonctionnent de la même façon : vous envoyez votre fichier à leur serveur, un ordinateur que vous ne voyez pas le transcrit, et vous téléchargez le résultat. Votre enregistrement reste sur la machine de quelqu’un d’autre aussi longtemps qu’il le garde.',
        'Sur transcribevid.com, le travail se fait dans l’autre sens. Le programme de reconnaissance vocale vient dans votre navigateur, et votre navigateur l’exécute sur votre propre ordinateur ou téléphone. Le fichier multimédia est lu depuis votre disque par la page que vous avez ouverte. Il n’est jamais joint à une requête vers le site, et il n’est jamais envoyé à Google, aux sociétés qui hébergent les téléchargements, ni à aucun service de reconnaissance vocale.',
        'C’est pourquoi le site ne fixe aucune limite de taille ni de durée et n’a pas de file d’attente : aucun serveur à nous ne fait le travail ; rien ne fait donc monter une facture par fichier, et personne n’attend avant vous. Un très long enregistrement demande tout de même du temps et de la mémoire libre sur votre appareil. C’est aussi pourquoi un entretien confidentiel ou une vidéo de famille privée peut être transcrit sans quitter votre appareil.',
        'Ce guide décrit le site web transcribevid.com. Une copie du logiciel que quelqu’un installe sur son propre serveur fonctionne différemment : elle envoie le fichier à ce serveur par une connexion chiffrée et le supprime ensuite automatiquement.',
      ],
    },
    {
      title: 'Comment cela fonctionne, étape par étape',
      steps: [
        {
          title: 'La page se charge',
          text: 'Votre navigateur récupère la page et son code de programme sur transcribevid.com, hébergé chez Cloudflare. C’est la même chose que d’ouvrir n’importe quel autre site web.',
        },
        {
          title: 'Le modèle de parole est téléchargé une fois',
          text: 'La première fois que vous utilisez un niveau de qualité, votre navigateur télécharge le modèle de reconnaissance vocale correspondant depuis Hugging Face, avec les fichiers du moteur qui l’exécute depuis jsDelivr. Ils sont conservés dans le cache de votre navigateur ; la transcription suivante démarre donc sans les télécharger de nouveau.',
        },
        {
          title: 'Votre fichier est décodé sur votre appareil',
          text: 'Les décodeurs audio et vidéo intégrés du navigateur transforment le fichier en son mono 16 kHz brut, que le modèle lit. Pour quelques formats que le navigateur ne peut pas ouvrir lui-même, comme l’AVI, le WMA et le FLV, la page demande d’abord, puis télécharge un convertisseur d’environ 9 Mo, qui s’exécute lui aussi sur votre appareil.',
        },
        {
          title: 'Un worker exécute le modèle',
          text: 'Un fil d’exécution en arrière-plan de la page, appelé Web Worker, exécute le modèle pour que la page reste réactive. Il utilise votre puce graphique via WebGPU quand le navigateur la prend en charge, et sinon votre processeur via WebAssembly.',
        },
        {
          title: 'Le texte apparaît, et reste dans votre navigateur',
          text: 'La transcription est construite ligne par ligne avec des horodatages. Elle est stockée dans l’espace de stockage propre de votre navigateur pour la session, et les fichiers SRT, VTT, TXT, Markdown, JSON et PDF que vous téléchargez sont eux aussi créés sur votre appareil.',
        },
      ],
    },
    {
      title: 'Ce que votre navigateur télécharge réellement',
      paragraphs: [
        'Ne pas envoyer ne veut pas dire ne pas télécharger. Un modèle de parole est un gros fichier, et votre navigateur doit le récupérer avant de pouvoir transcrire quoi que ce soit. Voici ce qui arrive, et d’où.',
      ],
      table: {
        caption: 'Ce que la page télécharge, d’où et quand',
        head: ['Quoi', 'D’où', 'Quand', 'Taille approximative'],
        rows: [
          [
            'La page et son code de programme',
            'transcribevid.com (Cloudflare)',
            'À chaque visite, puis mis en cache',
            'Environ 200 Ko',
          ],
          [
            'Le code du moteur qui exécute le modèle',
            'transcribevid.com',
            'Première transcription, puis mis en cache',
            'Moins de 1 Mo',
          ],
          [
            'L’environnement d’exécution du modèle (ONNX Runtime, WebAssembly)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Première transcription, puis mis en cache',
            'Environ 17 à 27 Mo',
          ],
          [
            'Un petit modèle de détection de la parole',
            'transcribevid.com',
            'Première transcription, puis mis en cache',
            'Environ 1,2 Mo',
          ],
          [
            'Le modèle de parole correspondant à votre choix de qualité',
            'huggingface.co (Hugging Face)',
            'Une fois par choix de qualité, puis mis en cache',
            'De 40 Mo environ à quelques Go (voir ci-dessous)',
          ],
          [
            'Un convertisseur pour les formats que le navigateur ne peut pas ouvrir (AVI, WMA, FLV et semblables)',
            'cdn.jsdelivr.net (jsDelivr)',
            'Seulement si votre fichier en a besoin, et seulement après votre accord',
            'Environ 9 Mo',
          ],
          [
            'Le modèle d’orthographe du hindi (IndicXlit)',
            'transcribevid.com',
            'Seulement quand le hindi est écrit en lettres latines (Hinglish), puis mis en cache',
            'Environ 13 Mo',
          ],
        ],
      },
      after: [
        'Ces téléchargements sont des fichiers de programme et de modèle, pas vos données. Les sociétés qui les livrent voient les détails habituels de toute requête web, comme votre adresse internet et votre navigateur, mais jamais vos médias ni votre transcription.',
      ],
    },
    {
      title: 'Ce qui est tout de même envoyé, en toute honnêteté',
      paragraphs: [
        'Trois choses atteignent bien un serveur, et aucune n’est votre fichier ni votre texte.',
      ],
      bullets: [
        {
          title: 'L’hébergement.',
          text: 'Cloudflare livre le site web ; il traite donc votre adresse internet et les détails habituels de la requête pour livrer et protéger le site.',
        },
        {
          title: 'Un total cumulé.',
          text: 'Quand une transcription se termine, votre navigateur envoie une requête vide au compteur du site, qui ajoute un au nombre affiché dans l’en-tête. Elle ne contient ni fichier, ni transcription, ni identifiant. Le compteur est alimenté par les navigateurs des visiteurs et n’est pas vérifié de façon indépendante.',
        },
        {
          title: 'La publicité.',
          text: 'Le site est gratuit parce qu’il affiche des publicités diffusées par Google AdSense, sur les pages d’information, jamais pendant qu’un fichier est transcrit ni à côté de votre transcription. Google utilise des cookies pour la publicité et, là où la loi l’exige, demande d’abord votre consentement. Les scripts publicitaires de Google font leurs propres requêtes vers Google, mais votre fichier et votre transcription ne sont jamais envoyés à Google.',
        },
      ],
      after: [
        'La politique de confidentialité expose tout cela en détail. Il n’y a pas de compte, et le site ne demande ni nom ni adresse e-mail.',
      ],
    },
    {
      title: 'Comment le vérifier vous-même',
      paragraphs: [
        'Vous n’avez pas à nous croire sur parole. Tous les navigateurs modernes peuvent vous montrer ce qu’une page envoie et reçoit, et la vérification prend deux minutes.',
      ],
      steps: [
        {
          title: 'Ouvrez les outils de développement',
          text: 'Dans Chrome, Edge ou Firefox, ouvrez la page d’accueil de transcribevid.com et appuyez sur F12 (sur Mac, Commande, Option et I). Choisissez l’onglet Réseau (Network).',
        },
        {
          title: 'Videz la liste',
          text: 'Appuyez sur le bouton d’effacement, qui ressemble à un cercle barré d’un trait, afin que seules les nouvelles requêtes apparaissent.',
        },
        {
          title: 'Lancez une transcription',
          text: 'Ajoutez un fichier et appuyez sur Transcrire. Gardez l’onglet Réseau visible.',
        },
        {
          title: 'Observez ce qui arrive',
          text: 'La première fois, vous verrez de gros téléchargements depuis huggingface.co et cdn.jsdelivr.net. Ce sont le modèle et le moteur qui arrivent.',
        },
        {
          title: 'Cherchez ce qui sort',
          text: 'Saisissez method:POST dans la zone de filtre (Chrome et Edge ; Firefox accepte le même filtre). La seule requête POST vers transcribevid.com doit être une requête vide vers /api/count après la fin de la transcription. Ouvrez-la et vérifiez son corps : il est vide. Si la page affiche des publicités, les scripts de Google font leurs propres requêtes vers Google, et aucune ne transporte votre fichier ni votre transcription. Rien qui approche la taille de votre fichier ne quitte votre appareil.',
        },
      ],
    },
    {
      title: 'Quelle est la taille du premier téléchargement, et à quelle vitesse ?',
      paragraphs: [
        'La taille dépend du niveau de qualité et du type d’appareil. Un appareil avec WebGPU reçoit une version compacte pour sa taille, tandis qu’un appareil qui utilise WebAssembly reçoit une version différente. La page vous indique la taille exacte du téléchargement avant de commencer ; vous n’avez donc jamais de surprise. Voici les tailles approximatives des fichiers de modèle (les chiffres WebGPU concernent les navigateurs qui prennent en charge les nuanceurs 16 bits ; les autres appareils reçoivent d’autres versions) :',
      ],
      table: {
        caption: 'Téléchargement approximatif du modèle à la première utilisation',
        head: ['Choix de qualité', 'Modèle Whisper', 'Avec WebGPU', 'Avec WebAssembly'],
        rows: [
          ['Le plus rapide', 'Base', 'Environ 146 Mo', 'Environ 77 Mo'],
          ['Standard', 'Small', 'Environ 485 Mo', 'Environ 249 Mo'],
          ['Haute précision', 'Large v3 Turbo', 'Environ 564 Mo', 'Environ 1,1 Go'],
          [
            'Précision maximale',
            'Large v3',
            'Environ 980 Mo, plus environ 564 Mo pour l’horodatage par mot',
            'Environ 1,8 Go, plus environ 1,1 Go pour l’horodatage par mot',
          ],
        ],
      },
      after: [
        'Ajoutez quelques mégaoctets pour les fichiers de configuration du modèle. Large v3 n’a pas de version avec horodatage par mot qui lui soit propre ; avec Horodatage par mot activé, ce qui est la valeur par défaut, sa première exécution télécharge donc aussi le modèle d’horodatage Large v3 Turbo, et la page le dit avant que vous commenciez. Ce modèle Turbo est conservé et partagé avec le choix Haute précision. Après le premier téléchargement, le modèle est lu depuis le cache de votre navigateur ; les transcriptions suivantes démarrent donc tout de suite. La vitesse ensuite dépend entièrement de votre appareil : un ordinateur avec une puce graphique capable et WebGPU est bien plus rapide qu’un téléphone ou un ancien ordinateur portable utilisant WebAssembly.',
      ],
    },
    {
      title: 'Quand c’est le bon outil, et quand ce ne l’est pas',
      paragraphs: [
        'Transcrire sur votre propre appareil convient bien aux contenus privés et aux longs fichiers. Ce n’est pas le meilleur outil pour tout.',
      ],
      bullets: [
        {
          title: 'Bien pour les enregistrements confidentiels.',
          text: 'Sur transcribevid.com, les entretiens, les réunions, les notes médicales ou juridiques et les vidéos personnelles restent sur votre appareil.',
        },
        {
          title: 'Bien pour les longs fichiers.',
          text: 'Sur transcribevid.com, il n’y a aucun envoi à attendre et aucune limite de taille ni de durée fixée. Un très long enregistrement demande du temps et de la mémoire libre, et un navigateur sans prise en charge de WebCodecs peut refuser un fichier très long.',
        },
        {
          title: 'Pas pour les sous-titres en direct.',
          text: 'La transcription est réalisée à partir d’un fichier ou d’un enregistrement terminé. Elle ne sous-titre pas un événement en direct au fur et à mesure.',
        },
        {
          title: 'Pas pour les noms des intervenants.',
          text: 'Les lignes portent des horodatages, mais le texte n’indique pas qui parle. Vous pouvez saisir les noms pendant la modification.',
        },
        {
          title: 'Pas idéal sur un téléphone peu puissant.',
          text: 'Les téléphones ont moins de mémoire. La page vous prévient, et peut désactiver les plus grands choix de qualité, quand votre appareil ne peut pas les exécuter. Découpez les très longs enregistrements en parties.',
        },
        {
          title: 'Pas si vous ne pouvez pas télécharger un gros fichier une fois.',
          text: 'La première utilisation demande une connexion capable de récupérer des dizaines ou des centaines de mégaoctets.',
        },
      ],
    },
    {
      title: 'Effacer vos données ensuite',
      paragraphs: [
        'Sur transcribevid.com, vos transcriptions et le fichier source sont conservés dans l’espace de stockage de votre navigateur pour que la page puisse les afficher et vous laisser les modifier et les exporter. Ils sont supprimés automatiquement quand votre session se termine après une période d’inactivité, ou immédiatement quand vous appuyez sur Supprimer mes données maintenant dans le menu Transcriptions. Les données supprimées ne peuvent pas être récupérées ; exportez donc d’abord ce dont vous avez besoin.',
        'Les modèles de parole restent dans le cache de votre navigateur pour que les transcriptions suivantes soient rapides, jusqu’à ce que vous les supprimiez (Supprimer mes données maintenant peut aussi les retirer) ou que votre navigateur vide son stockage. Si vous utilisez un ordinateur partagé ou public, appuyez sur Supprimer mes données maintenant avant de partir, car toute personne qui peut ouvrir ce profil de navigateur peut lire ce qui y est stocké.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Est-il vraiment vrai que mon fichier n’est jamais envoyé ?',
      answer:
        'Oui, sur transcribevid.com. La reconnaissance s’exécute dans votre navigateur, et votre fichier est lu depuis votre propre disque par la page. Vous pouvez le confirmer dans l’onglet Réseau des outils de développement de votre navigateur : la seule requête qui envoie quelque chose à transcribevid.com est une requête vide de comptage après la fin de la transcription, et les scripts publicitaires de Google font leurs propres requêtes vers Google, qui ne transportent jamais votre fichier.',
    },
    {
      question: 'La transcription fonctionne-t-elle encore si ma connexion est lente ?',
      answer:
        'La partie lente est le premier téléchargement du modèle de parole, qui peut atteindre des centaines de mégaoctets. Une fois qu’il est enregistré dans votre navigateur, la transcription elle-même utilise votre propre appareil et n’a besoin d’aucun débit réseau.',
    },
    {
      question: 'Pourquoi mon navigateur télécharge-t-il un modèle depuis un autre site web ?',
      answer:
        'Le modèle est le programme qui reconnaît la parole, et il est bien trop gros pour être intégré à la page. Il est téléchargé depuis Hugging Face, un hébergeur public de tels modèles, et le moteur qui l’exécute vient de jsDelivr. Ni l’un ni l’autre ne reçoit vos médias ni votre transcription.',
    },
    {
      question: 'Transcrire sur mon appareil est-il plus rapide que d’envoyer le fichier ?',
      answer:
        'Cela peut l’être, car il n’y a ni envoi ni file d’attente, et un ordinateur avec WebGPU est rapide. Sur un ancien ordinateur portable ou un téléphone, le même travail peut prendre plus de temps qu’un serveur rapide. La première exécution inclut aussi le téléchargement unique du modèle.',
    },
  ],
  links: [
    {
      label: 'Transcription d’entretiens',
      path: '/interview-transcription',
      note: 'La voie privée pour les entretiens de recherche, de journalisme et d’embauche.',
    },
    {
      label: 'Qu’est-ce que Whisper ?',
      path: '/guides/what-is-whisper',
      note: 'Le modèle de parole que votre navigateur exécute, expliqué en termes simples.',
    },
    {
      label: 'Obtenir une transcription plus précise',
      path: '/guides/accurate-transcripts',
      note: 'Les réglages et les habitudes qui donnent un meilleur texte, quel que soit l’appareil.',
    },
    {
      label: 'Vidéo en texte',
      path: '/video-to-text',
      note: 'Ajoutez une vidéo et regardez-la devenir du texte horodaté sur votre propre appareil.',
    },
    {
      label: 'Enregistrement de réunion en texte',
      path: '/meeting-recording-to-text',
      note: 'Transformez un enregistrement Zoom, Teams ou Meet sauvegardé en transcription consultable.',
    },
  ],
};
