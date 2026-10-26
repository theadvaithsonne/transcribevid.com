import { ToolPageContent } from '../../../tool-page.model';

export const CONTENT: ToolPageContent = {
  eyebrow: 'MOV en texte',
  h1: 'Transcrire une vidéo MOV en texte',
  lead: 'Le MOV est ce qu’enregistrent les iPhone, les Mac et de nombreux appareils photo. Ajoutez votre MOV et obtenez une transcription horodatée, gratuite, sans connexion. Seul le son est lu ; la taille et le codec de l’image n’ont donc aucune importance.',
  dropKind: 'video',
  dropNoun: 'fichier MOV',

  whyTitle: 'Pourquoi les fichiers MOV n’ont pas besoin de conversion',
  why: [
    'Le MOV est le format QuickTime d’Apple. Comme un MP4, il réunit l’image et le son, et la plupart des fichiers MOV contiennent du son AAC lu directement. TranscribeVid lit ce son et ignore l’image ; il n’y a donc pas besoin d’une étape séparée de MOV en MP4.',
    'Les fichiers MOV sont souvent gros, car les téléphones et les appareils photo enregistrent en haute qualité. Vous n’avez pas à réduire ni à convertir le vôtre. Le chemin le plus rapide entre la pellicule et une transcription est d’ajouter le fichier tel quel.',
  ],

  sections: [
    {
      title: 'D’où viennent les fichiers MOV',
      bullets: [
        {
          title: 'Les vidéos d’iPhone et d’iPad.',
          text: 'Les vidéos enregistrées avec l’app Appareil photo sont sauvegardées en fichiers .MOV, que le format d’image soit H.264 ou HEVC.',
        },
        {
          title: 'Les enregistrements d’écran du Mac.',
          text: 'La barre d’outils de capture (Maj-Commande-5) et QuickTime Player enregistrent les captures vidéo de l’écran en .mov. Choisissez un microphone avant d’enregistrer, sinon le fichier ne contient aucune parole.',
        },
        {
          title: 'Les appareils photo et les logiciels de montage.',
          text: 'De nombreux appareils hybrides enregistrent en MOV, et des logiciels de montage vidéo comme Final Cut Pro et Adobe Premiere Pro peuvent l’exporter.',
        },
      ],
    },
    {
      title: 'Récupérer une vidéo depuis votre iPhone',
      paragraphs: [
        'Le plus simple est d’ouvrir cette page sur l’iPhone lui-même et d’appuyer sur Choisir un fichier. Vous pouvez choisir une vidéo dans la photothèque ou dans Fichiers. Si le téléphone demande quel format utiliser quand vous la choisissez, les deux réponses conviennent, car seul le son est lu.',
        'Pour transcrire plutôt sur un ordinateur, envoyez la vidéo par AirDrop, enregistrez-la dans Fichiers ou dans iCloud Drive, ou copiez-la avec un câble. Les noms de menus changent selon les versions d’iOS et de macOS ; considérez donc ce qui précède comme un guide.',
      ],
    },
    {
      title: 'Les vidéos avec plus d’une piste audio',
      paragraphs: [
        'Certains appareils photo et logiciels de montage écrivent plusieurs pistes audio dans un seul MOV, par exemple un microphone d’appareil et un microphone-cravate. TranscribeVid utilise la première piste audio qu’il peut lire. Si la parole que vous voulez se trouve sur une autre piste, exportez d’abord une copie avec cette piste, ou mélangez les pistes dans votre logiciel de montage.',
      ],
    },
  ],

  howTitle: 'Comment convertir un MOV en texte',
  howToDescription:
    'Ajoutez la vidéo MOV, choisissez la langue parlée et la qualité, attendez la transcription et téléchargez-la.',
  steps: [
    {
      title: 'Ajoutez le MOV',
      text: 'Appuyez sur Choisir un fichier en haut de cette page, ou déposez le .mov sur la zone. Un iPhone propose Photos et Fichiers. Une vidéo à la fois entre dans cette zone ; Ajouter un autre fichier, sur la page suivante, en met d’autres en file.',
    },
    {
      title: 'Réglez la langue et la qualité',
      text: 'Sur la page suivante, choisissez la langue parlée. Standard est recommandé. Pour du vent, de la circulation ou une personne éloignée, Haute précision et Précision maximale sont plus longues et font moins d’erreurs. Appuyez ensuite sur Transcrire.',
      browser: {
        text: 'Sur la page suivante, choisissez la langue parlée. Standard est recommandé. Pour du vent, de la circulation ou une personne éloignée, essayez Haute précision ou Précision maximale si votre appareil les propose : elles sont plus longues et font moins d’erreurs, chacune représente un téléchargement initial plus gros, et un appareil qui ne peut pas en exécuter une l’affiche grisée avec la raison. Appuyez ensuite sur Transcrire.',
      },
    },
    {
      title: 'Lisez et corrigez',
      text: 'Le texte arrive ligne par ligne, avec un horaire sur chacune. Lisez à partir de n’importe quelle ligne, corrigez ce qui est faux et supprimez les lignes dont vous ne voulez pas.',
    },
    {
      title: 'Téléchargez la transcription',
      text: 'Récupérez le TXT ou un PDF à lire, ou le SRT ou le VTT à utiliser comme sous-titres dans un logiciel de montage vidéo ou sur le web. Votre MOV n’est jamais modifié.',
    },
  ],

  formatsTitle: 'MOV et autres formats vidéo',
  formatsIntro:
    'La même zone accepte le MOV et ces autres types, ainsi que les formats audio habituels.',
  uploadTitle: 'Fichiers vidéo que vous pouvez ajouter',
  accepts: ['MOV', 'MP4', 'M4V', 'MKV', 'WEBM', '3GP', 'TS'],
  downloads: [
    { name: 'TXT', use: 'les paroles prononcées en texte brut' },
    { name: 'SRT', use: 'des sous-titres pour les logiciels de montage et les lecteurs' },
    { name: 'VTT', use: 'des sous-titres pour une page web' },
    { name: 'PDF', use: 'une transcription à imprimer ou à partager' },
    { name: 'Markdown', use: 'des notes avec horaires' },
    { name: 'JSON', use: 'des données pour vos propres outils' },
  ],

  tipsTitle: 'Conseils pour transcrire des vidéos MOV',
  tips: [
    {
      title: 'Gardez Améliorer l’audio activé.',
      text: 'Les vidéos de téléphone captent le vent, les bruits de manipulation et l’écho de la pièce. Le commutateur Améliorer l’audio dans Plus d’options supprime les grondements graves et le souffle et fait ressortir les voix faibles.',
    },
    {
      title: 'Vérifiez quelle piste contient la voix.',
      text: 'Si un appareil photo a enregistré deux microphones sur des pistes séparées, lisez la vidéo et assurez-vous que la première piste est celle qui contient la parole.',
    },
    {
      title: 'Coupez les longs enregistrements à des pauses naturelles.',
      text: 'Les fichiers qui dépassent la limite de taille ou de durée sont refusés. Découpez la vidéo en parties, ou exportez uniquement son audio, puis ajoutez-la.',
      browser: {
        title: 'Les longs enregistrements demandent de la mémoire.',
        text: 'Le site ne fixe aucune limite de taille ni de durée, mais une longue vidéo demande du temps et de la mémoire libre, surtout sur un téléphone, et un navigateur ancien peut refuser un fichier très long. Pour un très long enregistrement, exportez uniquement l’audio depuis votre logiciel de montage ou découpez la vidéo en parties.',
      },
    },
    {
      title: 'Enregistrez avec le son, exprès.',
      text: 'Un enregistrement d’écran du Mac réalisé sans microphone ne contient aucune parole, et la transcription est vide.',
    },
  ],

  faqs: [
    {
      question: 'Puis-je transcrire une vidéo d’iPhone sans convertir le MOV en MP4 ?',
      answer:
        'Oui. Ajoutez le MOV tel quel. TranscribeVid lit la piste sonore et ignore l’image ; aucune conversion n’est donc nécessaire.',
    },
    {
      question: 'Une vidéo 4K ou HEVC de mon iPhone fonctionne-t-elle ?',
      answer:
        'Oui. Seul le son est utilisé ; la taille de l’image et le format vidéo n’ont donc aucune importance. Ce qui compte, c’est la piste sonore, et les enregistrements d’iPhone et de Mac utilisent du son AAC, lu directement.',
    },
    {
      question: 'Comment faire passer une vidéo de mon iPhone à un ordinateur pour la transcrire ?',
      answer:
        'Envoyez-la par AirDrop vers un Mac, enregistrez-la dans Fichiers ou dans iCloud Drive, ou copiez-la avec un câble. Ou évitez l’ordinateur : ouvrez cette page sur l’iPhone et choisissez la vidéo dans Photos.',
    },
    {
      question: 'Pourquoi mon enregistrement d’écran du Mac n’a-t-il aucun texte ?',
      answer:
        'Un enregistrement d’écran ne transporte du son que si un microphone a été choisi avant d’enregistrer. Dans la barre d’outils Maj-Commande-5, ouvrez Options, choisissez un microphone et enregistrez de nouveau. Les noms de menus peuvent différer selon les versions de macOS.',
    },
    {
      question: 'Que se passe-t-il si mon MOV a deux pistes audio ?',
      answer:
        'TranscribeVid utilise la première piste audio qu’il peut lire. Si la parole se trouve sur une autre piste, exportez d’abord une copie avec cette piste, ou mélangez les pistes dans votre logiciel de montage.',
    },
  ],

  links: [
    {
      label: 'MP4 en texte',
      path: '/mp4-to-text',
      note: 'Le même service pour les fichiers MP4, l’autre format vidéo courant des téléphones.',
    },
    {
      label: 'Vidéo en texte',
      path: '/video-to-text',
      note: 'La page principale pour n’importe quel fichier vidéo, avec des conseils pour les cours, les entretiens et les clips.',
    },
    {
      label: 'Générateur de sous-titres SRT',
      path: '/srt-subtitle-generator',
      note: 'Créez des sous-titres pour votre MOV et voyez à quoi ressemble l’intérieur d’un fichier SRT.',
    },
    {
      label: 'Ajouter des sous-titres à une vidéo',
      path: '/guides/how-to-add-subtitles-to-a-video',
      note: 'Que faire du fichier de sous-titres une fois téléchargé.',
    },
  ],
};
